import { fileURLToPath } from 'node:url';
import * as filesystemSkills from '@deepseek-ai/dsh-skill-filesystem';

export const name = 'statedock-skills';
export const inject = ['skills'];

// Delegate discovery and lifecycle to the host's packaged-skill provider.
export async function apply(ctx) {
  const provider = ctx.plugin(filesystemSkills, {
    providerName: 'statedock',
    includeDefaultRoots: false,
    bundledSkillDir: fileURLToPath(new URL('./skills/', import.meta.url)),
    watch: false,
  });
  await provider.await();
}
