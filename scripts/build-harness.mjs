import { mkdtemp, mkdir, cp, copyFile } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { root, validate, json } from './validate.mjs';

await validate();
const adapter = join(root, 'adapters/deepseek-harness');
if ((await json(join(adapter, 'package.json'))).version !== (await json(join(root, 'package.json'))).version) throw new Error('Harness package version differs from shared source');
await mkdir(join(root, 'dist'), { recursive: true });
const build = await mkdtemp(join(root, 'dist', 'harness-'));
const output = join(build, 'dsh-statedock');
await cp(adapter, output, { recursive: true });
await cp(join(root, 'core/skills'), join(output, 'skills'), { recursive: true });
await copyFile(join(root, 'core/assets/logo.png'), join(output, 'logo.png'));
await copyFile(join(root, 'LICENSE'), join(output, 'LICENSE'));
await mkdir(join(root, 'artifacts'), { recursive: true });
// npm pack packages files only; no installation hooks or registry publication.
const result = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', build], { cwd: output, env: { ...process.env, npm_config_cache: '/tmp/statedock-npm-cache' }, encoding: 'utf8' }));
console.log(JSON.stringify({ directory: output, tarball: join(build, result[0].filename), runtime: '0.2.0-rc.2' }));
