import { readFile, readdir, lstat } from 'node:fs/promises';
import { resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import { parse } from 'yaml';

export const root = fileURLToPath(new URL('../', import.meta.url));
export async function json(path) { return JSON.parse(await readFile(path, 'utf8')); }
export function rejectSecrets(text, label) {
  if (/sdm_[A-Za-z0-9_-]{12,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|Bearer\s+(?!\$\{)[A-Za-z0-9._-]{16,}/.test(text)) throw new Error(`Possible credential in ${label}`);
}
export async function files(dir) {
  const result = [];
  for (const name of (await readdir(dir)).sort()) {
    const path = join(dir, name), stat = await lstat(path);
    if (stat.isSymbolicLink()) throw new Error(`Symlink not allowed: ${path}`);
    if (stat.isDirectory()) result.push(...await files(path));
    else if (stat.isFile()) result.push(path);
    else throw new Error(`Unsupported file: ${path}`);
  }
  return result;
}
export async function validate(dir = join(root, 'core')) {
  const ajv = new Ajv({ strict: false, allErrors: true });
  for (const name of ['plugin', 'mcp']) {
    const schema = await json(join(root, 'schemas', `${name}.schema.json`));
    const check = ajv.compile(schema), data = await json(join(dir, `${name}.json`));
    if (!check(data)) throw new Error(`${name}: ${ajv.errorsText(check.errors)}`);
  }
  const manifest = await json(join(dir, 'plugin.json'));
  if (manifest.version !== (await json(join(root, 'package.json'))).version || manifest.license !== 'MIT') throw new Error('Version/license mismatch');
  const mcp = await json(join(dir, 'mcp.json'));
  if (JSON.stringify(mcp.mcpServers) !== JSON.stringify({ statedock: { type: 'streamable-http', url: 'https://statedock.dev/mcp' } })) throw new Error('Unexpected MCP endpoint/transport/credentials');
  const names = (await readdir(join(dir, 'skills'))).sort();
  if (names.join(',') !== 'statedock-pickup,statedock-plan,statedock-update') throw new Error('Unexpected skill inventory');
  for (const name of names) {
    const text = await readFile(join(dir, 'skills', name, 'SKILL.md'), 'utf8');
    const front = text.match(/^---\n([\s\S]+?)\n---\n/);
    if (!front) throw new Error(`Missing frontmatter: ${name}`);
    const meta = parse(front[1]);
    if (meta.name !== name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.name) || meta.name.length > 64 || typeof meta.description !== 'string' || !meta.description || meta.description.length > 1024) throw new Error(`Invalid skill: ${name}`);
  }
  const allowed = new Set(['plugin.json', 'mcp.json', 'LICENSE', 'README.md', ...names.map(name => `skills/${name}/SKILL.md`)]);
  for (const path of await files(dir)) {
    if (!allowed.has(relative(dir, path))) throw new Error(`Unapproved package file: ${path}`);
    rejectSecrets(await readFile(path, 'utf8'), path);
  }
  return true;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await validate(process.argv[2] ? resolve(process.argv[2]) : undefined);
  console.log('Manifest schemas, skills, endpoint and credential checks passed.');
}
