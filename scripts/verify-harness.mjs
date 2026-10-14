import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { root, json } from './validate.mjs';

const runtime = process.env.STATEDOCK_DSH_RUNTIME;
if (!runtime) throw new Error('Set STATEDOCK_DSH_RUNTIME to an extracted or installed 0.2.0-rc.2 runtime directory containing node_modules/@deepseek-ai/. See adapters/deepseek-harness/README.md.');
const modules = join(resolve(runtime), 'node_modules');
const native = name => pathToFileURL(join(modules, '@deepseek-ai', name, 'lib/index.js')).href;
const installedVersion = (await json(join(modules, '@deepseek-ai/dsh/package.json'))).version;
assert.equal(installedVersion, '0.2.0-rc.2', 'Only the tested runtime is admitted');
const built = JSON.parse(execFileSync(process.execPath, [join(root, 'scripts/build-harness.mjs')], { encoding: 'utf8' }));
await symlink(modules, join(built.directory, 'node_modules'));
const { Context } = await import(native('cordis'));
const { default: Skills } = await import(native('dsh-skill'));
const skillsAdapter = await import(pathToFileURL(join(built.directory, 'index.mjs')).href);
const mcpAdapter = await import(pathToFileURL(join(built.directory, 'mcp.mjs')).href);
const ctx = new Context();
const registry = ctx.plugin(Skills);
await registry.await();
const plugin = ctx.plugin(skillsAdapter);
try {
  await plugin.await();
  const names = (await ctx.skills.list()).map(skill => skill.name).sort();
  assert.deepEqual(names, ['statedock-pickup', 'statedock-plan', 'statedock-update']);
  for (const name of names) {
    const loaded = await ctx.skills.get(name);
    const source = await readFile(join(root, 'core/skills', name, 'SKILL.md'), 'utf8');
    assert.equal(loaded.content.trim(), source.replace(/^---\n[\s\S]*?\n---\n/, '').trim());
  }
} finally { await plugin.dispose(); }
assert.equal((await ctx.skills.list()).length, 0, 'Dispose must unregister the provider');
await registry.dispose();

const temp = await mkdtemp(join(tmpdir(), 'statedock-harness-cli-'));
const cli = join(modules, '@deepseek-ai/dsh/lib/bin.js');
const env = { ...process.env, DSH_HOME: temp };
execFileSync(process.execPath, [cli, 'plugin', '--profile', 'smoke', 'add', built.tarball, '--ignore-scripts', '--config.auto-install-peers=false'], { cwd: root, env, encoding: 'utf8' });
const profile = await json(join(temp, 'profiles/smoke/package.json'));
assert.ok(profile.dsh.profile.bundles.includes('@statedock/dsh-plugin'));
const config = execFileSync(process.execPath, [cli, '--profile', 'smoke', '--dump-config'], { env, encoding: 'utf8' });
assert.match(config, /id: statedock-skills/);
assert.match(config, /name: ['"]?@statedock\/dsh-plugin\/mcp['"]?\n\s+disabled: true/);

const checks = ['three native Skills discovered and content matched', 'provider disposal removes Skills', 'actual DSH CLI installs Bundle and composes disabled optional MCP'];
const savedToken = process.env.STATEDOCK_TOKEN;
try {
  delete process.env.STATEDOCK_TOKEN;
  await assert.rejects(mcpAdapter.apply({}), /supply STATEDOCK_TOKEN/);
  checks.push('optional MCP fails before connecting when token is missing');
} finally {
  if (savedToken === undefined) delete process.env.STATEDOCK_TOKEN;
  else process.env.STATEDOCK_TOKEN = savedToken;
}
if (process.argv.includes('--remote')) {
  assert.ok(process.env.STATEDOCK_TOKEN?.trim(), 'Remote verification requires securely supplied STATEDOCK_TOKEN');
  const remote = new Context();
  const tools = new Map();
  // Capture native bridge registrations without creating agents or model sessions.
  remote.provide('tools', { register(def) { tools.set(def.name, def); return () => tools.delete(def.name); } });
  const connection = remote.plugin(mcpAdapter);
  try {
    await connection.await();
    for (const name of ['get_instance_info', 'create_plan', 'claim_next_task', 'submit_handoff']) assert.ok(tools.has(`mcp__statedock_plugin__${name}`));
    const result = await tools.get('mcp__statedock_plugin__get_instance_info').execute({}, { signal: AbortSignal.timeout(15000) });
    const instance = result.structuredContent?.data ?? JSON.parse(result.content[0].text).data;
    assert.equal(instance.publicOrigin, 'https://statedock.dev');
    assert.equal(instance.mcpUrl, 'https://statedock.dev/mcp');
    assert.equal(instance.transport, 'remote');
    checks.push(`${tools.size} tools discovered through native MCP bridge; read-only remote instance verified`);
  } finally { await connection.dispose(); }
  assert.equal(tools.size, 0, 'Dispose must remove registered MCP tools');
}
console.log(JSON.stringify({ runtime: installedVersion, isolatedHome: temp, package: built.tarball, checks, limitations: 'No live desktop profile change, GUI acceptance or model turn; remote verification never writes tasks.' }, null, 2));
