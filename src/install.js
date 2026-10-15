import { lstat, mkdir, readdir, copyFile, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

export const targets = {
  portable: '.ui-ux-agent',
  codex: '.agents/skills/ui-ux-agent',
  claude: '.claude/skills/ui-ux-agent',
  cursor: '.cursor/skills/ui-ux-agent',
  copilot: '.github/skills/ui-ux-agent',
};
const skillSource = fileURLToPath(new URL('../skills/ui-ux-agent/', import.meta.url));

async function inspect(path) {
  try { return await lstat(path); } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function filesUnder(path, prefix = '') {
  const result = [];
  for (const item of await readdir(path, { withFileTypes: true })) {
    if (item.isSymbolicLink()) throw new Error(`Refusing packaged symlink: ${item.name}`);
    const name = join(prefix, item.name);
    if (item.isDirectory()) result.push(...await filesUnder(join(path, item.name), name));
    else if (item.isFile()) result.push(name);
  }
  return result.sort();
}

/** Install into a new project-local directory; preserve all existing files. */
export async function installSkill({ project = '.', target = 'portable', dryRun = false } = {}) {
  if (!Object.hasOwn(targets, target)) throw new Error(`Unknown installation target: ${target}`);
  const root = resolve(project);
  const rootInfo = await lstat(root);
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) throw new Error('Project must be an existing directory, not a symlink.');
  const destination = resolve(root, targets[target]);
  const local = relative(root, destination);
  if (local.startsWith('..') || isAbsolute(local)) throw new Error('Installation must remain inside the project.');
  let parent = root;
  for (const part of local.split(/[\\/]/).slice(0, -1)) {
    parent = join(parent, part);
    const info = await inspect(parent);
    if (info && (!info.isDirectory() || info.isSymbolicLink())) throw new Error(`Installation parent is not a regular directory: ${parent}`);
  }
  if (await inspect(destination)) throw new Error(`Destination already exists; nothing changed: ${destination}`);
  const files = await filesUnder(skillSource);
  const report = { target, destination, files: [...files, 'resources/routing.json', 'INSTALLATION.json'], dryRun };
  if (dryRun) return report;
  await mkdir(resolve(destination, '..'), { recursive: true });
  // Exclusive reservation prevents a second invocation from replacing this tree.
  await mkdir(destination);
  try {
    for (const name of files) {
      const output = join(destination, name);
      await mkdir(resolve(output, '..'), { recursive: true });
      await copyFile(join(skillSource, name), output, 1); // COPYFILE_EXCL
    }
    await mkdir(join(destination, 'resources'));
    await copyFile(fileURLToPath(new URL('../resources/routing.json', import.meta.url)), join(destination, 'resources/routing.json'), 1);
    const metadata = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    await writeFile(join(destination, 'INSTALLATION.json'), JSON.stringify({ package: metadata.name, version: metadata.version, target }, null, 2) + '\n', { flag: 'wx' });
  } catch (error) {
    await rm(destination, { recursive: true, force: true });
    throw error;
  }
  return report;
}
