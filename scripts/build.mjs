import { mkdtemp, mkdir, cp, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { validate, root } from './validate.mjs';

await validate();
await mkdir(join(root, 'dist'), { recursive: true });
// New output directory each time: never delete or overwrite an existing build.
const output = await mkdtemp(join(root, 'dist', 'build-'));
const plugin = join(output, 'statedock');
await cp(join(root, 'core'), plugin, { recursive: true, errorOnExist: true, force: false });
for (const name of ['LICENSE', 'README.md']) await copyFile(join(root, name), join(plugin, name));
await validate(plugin);
console.log(plugin);
