import { mkdtemp, mkdir, writeFile, cp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { root, validate, files } from './validate.mjs';

const executable = process.env.STATEDOCK_CODEX_BIN || 'codex';
const temp = await mkdtemp(join(tmpdir(), 'statedock-codex-'));
const home = join(temp, 'codex-home'), market = join(temp, 'marketplace');
await mkdir(home);
await mkdir(join(market, '.agents/plugins'), { recursive: true });
const plugin = execFileSync(process.execPath, [join(root, 'scripts/build.mjs')], { encoding: 'utf8' }).trim();
await cp(plugin, join(market, 'plugins/statedock'), { recursive: true });
await writeFile(join(market, '.agents/plugins/marketplace.json'), JSON.stringify({ name: 'statedock-local', plugins: [{ name: 'statedock', source: { source: 'local', path: './plugins/statedock' }, policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' }, category: 'Productivity' }] }, null, 2));
// Child-only override; user's CODEX_HOME and credentials are never read or modified.
function run(args) { return execFileSync(executable, args, { env: { ...process.env, CODEX_HOME: home }, cwd: market, encoding: 'utf8', timeout: 30000 }); }
const version = run(['--version']).trim();
const registration = run(['plugin', 'marketplace', 'add', market, '--json']);
const installed = run(['plugin', 'add', 'statedock@statedock-local', '--json']);
const listing = run(['plugin', 'list', '--json']);
const state = JSON.parse(listing).installed.find(item => item.pluginId === 'statedock@statedock-local');
assert.ok(state?.installed && state.enabled, 'Plugin must be installed and enabled');
assert.equal(state.version, '0.1.1');
const manifests = (await files(home)).filter(path => path.endsWith('/plugin.json'));
const cached = manifests.find(path => !path.includes('/marketplaces/'));
assert.ok(cached, 'Installed cached plugin manifest must exist');
await validate(join(cached, '..'));
for (const name of ['statedock-plan', 'statedock-pickup', 'statedock-update']) {
  assert.equal(await readFile(join(cached, '..', 'skills', name, 'SKILL.md'), 'utf8'), await readFile(join(root, 'core/skills', name, 'SKILL.md'), 'utf8'));
}
console.log(JSON.stringify({ version, isolatedDirectory: temp, registration: JSON.parse(registration), installed: JSON.parse(installed), listing: JSON.parse(listing), cachedPlugin: join(cached, '..'), checks: 'Installed cache schemas and all three skill contents verified; OAuth and model invocation not exercised.' }, null, 2));
