import { access, readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

async function exists(path) {
  try { await access(path); return true; } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

/** Read bounded project markers, without executing code or uploading source. */
export async function detectProject(directory = '.') {
  const root = resolve(directory);
  const entries = await readdir(root, { withFileTypes: true });
  let manifest = {};
  const warnings = [];
  if (await exists(join(root, 'package.json'))) {
    manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
    if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
      throw new Error('Project package.json must be an object.');
    }
  }
  const dependencies = Object.keys({ ...manifest.dependencies, ...manifest.devDependencies });
  const has = (name) => dependencies.includes(name);
  let stack = 'unknown';
  for (const [name, candidate] of [
    ['next', 'react'], ['nuxt', 'vue'], ['svelte', 'svelte'], ['vue', 'vue'],
    ['astro', 'html'], ['@angular/core', 'angular'], ['react', 'react'],
  ]) {
    if (has(name)) { stack = candidate; break; }
  }
  let platform = 'web';
  let shell = null;
  if (has('react-native') || has('expo')) { platform = 'mobile'; stack = 'react-native'; }
  if (has('electron') || has('@tauri-apps/api') || has('@tauri-apps/cli') || await exists(join(root, 'src-tauri'))) {
    platform = 'desktop'; shell = has('electron') ? 'electron' : 'tauri';
  }
  if (await exists(join(root, 'pubspec.yaml'))) { platform = 'mobile'; stack = 'flutter'; }
  if (entries.some((item) => /\.(xcodeproj|xcworkspace)$/.test(item.name))) {
    stack = 'swiftui'; platform = 'mobile';
    warnings.push('Apple project detected; confirm iOS versus macOS and the actual UI toolkit.');
  }
  if (entries.some((item) => /\.csproj$/.test(item.name))) { stack = 'dotnet'; platform = 'desktop'; }
  if (await exists(join(root, 'composer.json')) && stack === 'unknown') stack = 'html';
  const markers = [];
  for (const name of ['components.json', 'src/components/ui', 'components/ui', 'design-system']) {
    if (await exists(join(root, name))) markers.push(name);
  }
  const libraries = dependencies.filter((name) => /^(?:@radix-ui\/|@base-ui\/|@mui\/|@chakra-ui\/|@nuxt\/ui$|daisyui$|antd$|bootstrap$|tailwindcss$|shadcn)/.test(name));
  if (stack === 'unknown') warnings.push('No supported framework marker found; preserve the project and confirm its stack before adopting framework-specific code.');
  if (manifest.workspaces) warnings.push('Workspace root detected; inspect the actual app directory with --project before choosing components.');
  return { root, stack, platform, shell, libraries, markers, warnings };
}

export function stackFromBrief(value = '') {
  const text = typeof value === 'string' ? value.toLowerCase() : '';
  for (const [pattern, stack] of [
    [/react[ -]?native|\bexpo\b/, 'react-native'], [/flutter/, 'flutter'],
    [/swiftui|\bswift\b/, 'swiftui'], [/avalonia|\bwpf\b|winui|\.net/, 'dotnet'],
    [/svelte/, 'svelte'], [/\bvue\b|nuxt/, 'vue'], [/angular/, 'angular'],
    [/react|next\.?js/, 'react'], [/\bhtml\b|astro|laravel|htmx/, 'html'],
  ]) if (pattern.test(text)) return stack;
  return 'unknown';
}
