import { mkdtemp, mkdir, cp, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from './validate.mjs';
import { validateAntigravity } from './validate-antigravity.mjs';

await validateAntigravity();
await mkdir(join(root, 'dist'), { recursive: true });
const output = await mkdtemp(join(root, 'dist', 'antigravity-'));
const plugin = join(output, 'statedock');
await mkdir(plugin, { recursive: false });
await copyFile(join(root, 'adapters/antigravity/plugin.json'), join(plugin, 'plugin.json'));
await copyFile(join(root, 'adapters/antigravity/mcp_config.json'), join(plugin, 'mcp_config.json'));
await cp(join(root, 'core/skills'), join(plugin, 'skills'), { recursive: true, errorOnExist: true, force: false });
await copyFile(join(root, 'LICENSE'), join(plugin, 'LICENSE'));
await copyFile(join(root, 'adapters/antigravity/README.md'), join(plugin, 'README.md'));
await validateAntigravity(plugin);
console.log(plugin);
