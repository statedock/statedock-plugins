import { readFile, readdir, lstat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { root, rejectSecrets } from './validate.mjs';

export async function validateAntigravity(dir = join(root, 'adapters/antigravity')) {
  const manifest = JSON.parse(await readFile(join(dir, 'plugin.json'), 'utf8'));
  if (manifest.$schema !== 'https://antigravity.google/schemas/v1/plugin.json' || manifest.name !== 'statedock' || typeof manifest.description !== 'string' || 'version' in manifest || 'author' in manifest || 'homepage' in manifest) throw new Error('Invalid Antigravity plugin manifest');
  const mcp = JSON.parse(await readFile(join(dir, 'mcp_config.json'), 'utf8'));
  if (JSON.stringify(mcp) !== JSON.stringify({ mcpServers: { statedock: { serverUrl: 'https://statedock.dev/mcp' } } })) throw new Error('Unexpected Antigravity MCP endpoint, transport or credentials');
  const source = dir === join(root, 'adapters/antigravity');
  const skillsDir = join(dir, 'skills');
  const names = source ? (await readdir(join(root, 'core/skills'))).sort() : (await readdir(skillsDir)).sort();
  if (names.join(',') !== 'statedock-pickup,statedock-plan,statedock-update') throw new Error('Unexpected Antigravity skill inventory');
  for (const name of names) {
    const skillDir = join(source ? join(root, 'core/skills') : skillsDir, name);
    const stat = await lstat(skillDir);
    if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Invalid Antigravity skill path: ${name}`);
    const text = await readFile(join(skillDir, 'SKILL.md'), 'utf8');
    const front = text.match(/^---\n([\s\S]+?)\n---\n/);
    if (!front) throw new Error(`Missing frontmatter: ${name}`);
    const meta = parse(front[1]);
    if (meta.name !== name || typeof meta.description !== 'string' || !meta.description) throw new Error(`Invalid Antigravity skill: ${name}`);
    rejectSecrets(text, `${name}/SKILL.md`);
  }
  rejectSecrets(JSON.stringify(manifest) + JSON.stringify(mcp), 'Antigravity manifests');
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await validateAntigravity(process.argv[2] ? resolve(process.argv[2]) : undefined);
  console.log('Antigravity manifest, MCP endpoint, skills and credential checks passed.');
}
