import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, basename, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { root, validate, json } from './validate.mjs';

const plugin = execFileSync(process.execPath, [join(root, 'scripts/build.mjs')], { encoding: 'utf8' }).trim();
await validate(plugin);
await mkdir(join(root, 'artifacts'), { recursive: true });
const version = (await json(join(root, 'package.json'))).version;
const archive = join(root, 'artifacts', `statedock-${version}-${basename(dirname(plugin))}.tgz`);
execFileSync('tar', ['-czf', archive, '-C', dirname(plugin), 'statedock']);
const digest = createHash('sha256').update(await readFile(archive)).digest('hex');
await writeFile(`${archive}.sha256`, `${digest}  ${basename(archive)}\n`, { flag: 'wx' });
console.log(archive);
