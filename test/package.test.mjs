import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, writeFile, readFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { validate, root, rejectSecrets } from '../scripts/validate.mjs';

async function fixture() { const dir = await mkdtemp(join(tmpdir(), 'statedock-test-')); await cp(join(root, 'core'), dir, { recursive: true }); return dir; }
test('shared package satisfies official schemas', async () => assert.equal(await validate(), true));
test('rejects invented portable manifest fields', async () => {
  const dir = await fixture(), path = join(dir, 'plugin.json');
  const data = JSON.parse(await readFile(path)); data.skills = './skills/';
  await writeFile(path, JSON.stringify(data)); await assert.rejects(validate(dir), /additional properties/);
});
test('rejects native http transport in portable MCP', async () => {
  const dir = await fixture(), path = join(dir, 'mcp.json');
  const data = JSON.parse(await readFile(path)); data.mcpServers.statedock.type = 'http';
  await writeFile(path, JSON.stringify(data)); await assert.rejects(validate(dir));
});
test('rejects credentials and endpoint changes', async () => {
  assert.throws(() => rejectSecrets('Bearer ' + 'x'.repeat(32), 'test'), /credential/);
  assert.throws(() => rejectSecrets('sdm_' + 'x'.repeat(32), 'test'), /credential/);
  const dir = await fixture(), path = join(dir, 'mcp.json');
  const data = JSON.parse(await readFile(path)); data.mcpServers.statedock.url = 'https://example.org/mcp';
  await writeFile(path, JSON.stringify(data)); await assert.rejects(validate(dir), /endpoint/);
});
test('rejects symlinks before packaging', async () => {
  const dir = await fixture(); await symlink('/etc/passwd', join(dir, 'secret.txt'));
  await assert.rejects(validate(dir), /Symlink/);
});
test('rejects executable or unapproved package additions', async () => {
  const dir = await fixture(); await writeFile(join(dir, 'scheduler.mjs'), 'setInterval(() => {}, 1000)');
  await assert.rejects(validate(dir), /Unapproved package file/);
});
test('archive roundtrip preserves all skills and contains no private config or runtime', async () => {
  const archive = execFileSync(process.execPath, [join(root, 'scripts/pack.mjs')], { encoding: 'utf8' }).trim();
  const entries = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split('\n').filter(name => !name.endsWith('/')).sort();
  assert.deepEqual(entries, ['LICENSE', 'README.md', 'mcp.json', 'plugin.json', 'assets/logo.png', ...['statedock-pickup', 'statedock-plan', 'statedock-update'].map(name => `skills/${name}/SKILL.md`)].map(name => `statedock/${name}`).sort());
  const target = await mkdtemp(join(tmpdir(), 'statedock-unpack-'));
  execFileSync('tar', ['-xzf', archive, '-C', target]);
  await validate(join(target, 'statedock'));
  for (const name of ['statedock-plan', 'statedock-pickup', 'statedock-update']) assert.equal(await readFile(join(target, 'statedock/skills', name, 'SKILL.md'), 'utf8'), await readFile(join(root, 'core/skills', name, 'SKILL.md'), 'utf8'));
  assert.equal((await readFile(`${archive}.sha256`, 'utf8')).split(' ')[0], createHash('sha256').update(await readFile(archive)).digest('hex'));
});
test('OpenAI ZIP has portable manifests at root and survives extraction', async () => {
  const archive = execFileSync(process.execPath, [join(root, 'scripts/pack-zip.mjs')], { encoding: 'utf8' }).trim();
  const entries = execFileSync('unzip', ['-Z1', archive], { encoding: 'utf8' }).trim().split('\n').sort();
  assert.deepEqual(entries, ['LICENSE', 'README.md', 'mcp.json', 'plugin.json', 'assets/logo.png', ...['statedock-pickup', 'statedock-plan', 'statedock-update'].map(name => `skills/${name}/SKILL.md`)].sort());
  const target = await mkdtemp(join(tmpdir(), 'statedock-zip-'));
  execFileSync('unzip', ['-q', archive, '-d', target]);
  await validate(target);
  const manifest = JSON.parse(await readFile(join(target, 'plugin.json'), 'utf8'));
  for (const field of ['logo', 'composerIcon']) {
    const path = manifest.extensions['com.openai'].interface[field];
    assert.equal(path, './assets/logo.png');
    assert.deepEqual(await readFile(join(target, path)), await readFile(join(root, 'core/assets/logo.png')));
  }
  assert.equal((await readFile(`${archive}.sha256`, 'utf8')).split(' ')[0], createHash('sha256').update(await readFile(archive)).digest('hex'));
});
test('Harness Bundle packages shared Skills with optional MCP disabled and no host runtime', async () => {
  const built = JSON.parse(execFileSync(process.execPath, [join(root, 'scripts/build-harness.mjs')], { encoding: 'utf8' }));
  const entries = execFileSync('tar', ['-tzf', built.tarball], { encoding: 'utf8' }).trim().split('\n').filter(name => !name.endsWith('/')).sort();
  const expected = ['package.json', 'index.mjs', 'mcp.mjs', 'cordis.patch.yml', 'locale/en.json', 'locale/zh.json', 'logo.png', 'LICENSE', 'README.md', ...['statedock-pickup', 'statedock-plan', 'statedock-update'].map(name => `skills/${name}/SKILL.md`)];
  assert.deepEqual(entries, expected.map(name => `package/${name}`).sort());
  const target = await mkdtemp(join(tmpdir(), 'statedock-harness-unpack-'));
  execFileSync('tar', ['-xzf', built.tarball, '-C', target]);
  const patch = await readFile(join(target, 'package/cordis.patch.yml'), 'utf8');
  assert.match(patch, /name: ['"]?@statedock\/dsh-plugin\/mcp['"]?\n\s+disabled: true/);
  const manifest = JSON.parse(await readFile(join(target, 'package/package.json'), 'utf8'));
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml');
  assert.equal(manifest.peerDependencies['@deepseek-ai/dsh-mcp-client'], '0.2.0-rc.2');
  assert.equal(manifest.scripts, undefined, 'No install lifecycle scripts');
  for (const name of ['statedock-plan', 'statedock-pickup', 'statedock-update']) assert.equal(await readFile(join(target, 'package/skills', name, 'SKILL.md'), 'utf8'), await readFile(join(root, 'core/skills', name, 'SKILL.md'), 'utf8'));
});
