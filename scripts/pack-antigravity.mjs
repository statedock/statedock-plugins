import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { createHash } from 'node:crypto';
import { root } from './validate.mjs';
import { validateAntigravity } from './validate-antigravity.mjs';

const plugin = execFileSync(process.execPath, [join(root, 'scripts/build-antigravity.mjs')], { encoding: 'utf8' }).trim();
await validateAntigravity(plugin);
await mkdir(join(root, 'artifacts'), { recursive: true });
const uniqueDir = await mkdtemp(join(root, 'artifacts', '.antigravity-pack-'));
const version = JSON.parse(await readFile(join(root, 'package.json'), 'utf8')).version;
const uniqueArchive = join(root, 'artifacts', `statedock-antigravity-${version}-${basename(uniqueDir).slice('.antigravity-pack-'.length)}.zip`);
const entries = ['LICENSE', 'README.md', 'plugin.json', 'mcp_config.json', ...['statedock-pickup', 'statedock-plan', 'statedock-update'].map(name => `skills/${name}/SKILL.md`)];
execFileSync('zip', ['-q', '-X', uniqueArchive, ...entries], { cwd: plugin });
execFileSync('unzip', ['-t', uniqueArchive]);
const digest = createHash('sha256').update(await readFile(uniqueArchive)).digest('hex');
await writeFile(`${uniqueArchive}.sha256`, `${digest}  ${basename(uniqueArchive)}\n`, { flag: 'wx' });
console.log(uniqueArchive);
