import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPlan, detectProject, generatePrompt, getRegistry } from '../src/index.js';

const brief = { product: 'Studio invoices', audience: 'Studio owners', primary_task: 'Review an invoice and prepare a reminder' };
async function project(t, manifest = {}) {
  const root = await mkdtemp(join(tmpdir(), 'uiux-project-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, 'package.json'), JSON.stringify(manifest));
  return root;
}

test('React marketing recommends marketing blocks with a compatible foundation', async () => {
  const plan = await createPlan({ ...brief, stack: 'React', intent: 'marketing', primary_task: 'A SaaS landing page that explains the product' });
  assert.equal(plan.recommendation.shortlist[0].id, 'tailark');
  assert.equal(plan.recommendation.primary, 'shadcn');
  assert.equal(plan.research.liveVerified, false);
  assert.ok(plan.recommendation.excluded.some((item) => item.id === 'react-bits'));
});

test('Application workflow does not prefer a marketing library', async () => {
  const plan = await createPlan({ ...brief, stack: 'React' });
  assert.equal(plan.context.intent, 'application');
  assert.equal(plan.recommendation.primary, 'shadcn');
  assert.ok(!plan.recommendation.shortlist.some((item) => item.id === 'tailark'));
});

test('Existing component system remains primary instead of replacing it', async (t) => {
  const root = await project(t, { dependencies: { react: '*', '@mui/material': '*' } });
  const plan = await createPlan(brief, { project: root });
  assert.equal(plan.strategy, 'extend-existing-system');
  assert.equal(plan.recommendation.primary, 'existing-system');
});

test('Vue and Svelte exclude incompatible React source', async () => {
  for (const stack of ['Vue', 'Svelte']) {
    const plan = await createPlan({ ...brief, stack });
    assert.ok(plan.recommendation.excluded.some((item) => item.id === 'shadcn'));
    assert.ok(!plan.recommendation.shortlist.some((item) => item.id === 'tailark'));
    assert.ok(plan.recommendation.shortlist.some((item) => item.id === `shadcn-${stack.toLowerCase()}`));
  }
});

test('Unknown stack does not pretend framework-specific code fits', async () => {
  const plan = await createPlan(brief);
  assert.equal(plan.context.stack, 'unknown');
  assert.equal(plan.recommendation.primary, 'html-native');
  assert.ok(plan.recommendation.excluded.some((item) => item.id === 'shadcn' && /unresolved/.test(item.reason)));
});

test('Open-source filter excludes restricted and unverified redistribution', async () => {
  const plan = await createPlan({ ...brief, stack: 'React', intent: 'marketing', open_source: true, motion: 'expressive' });
  assert.ok(plan.recommendation.excluded.some((item) => item.id === 'prebuiltui' && /redistribution/.test(item.reason)));
  for (const item of [...plan.recommendation.shortlist, ...plan.recommendation.supporting]) {
    assert.ok(['permissive', 'native'].includes(item.redistribution));
  }
});

test('Expressive enhancements appear only when requested', async () => {
  const plan = await createPlan({ ...brief, stack: 'React', intent: 'marketing', motion: 'expressive' });
  assert.ok(plan.recommendation.supporting.some((item) => item.id === 'react-bits' || item.id === 'magicui'));
  assert.notEqual(plan.recommendation.primary, 'react-bits');
});

test('Native desktop and mobile do not recommend web source', async () => {
  for (const platform of ['desktop', 'mobile']) {
    const plan = await createPlan({ ...brief, platform });
    assert.equal(plan.recommendation.primary, `${platform}-native`);
    assert.equal(plan.strategy, 'platform-native-first');
    assert.ok(plan.recommendation.shortlist.every((item) => item.platforms.includes(platform)));
  }
});

test('Electron detects a desktop surface that can use React components', async (t) => {
  const root = await project(t, { devDependencies: { electron: '*', react: '*' } });
  const plan = await createPlan(brief, { project: root });
  assert.equal(plan.context.surface, 'desktop-web');
  assert.equal(plan.context.stack, 'react');
  assert.ok(plan.recommendation.shortlist.some((item) => item.id === 'shadcn'));
});

test('Manifest detection is read-only and warns about workspace roots', async (t) => {
  const root = await project(t, { workspaces: ['apps/*'], dependencies: { next: '*', tailwindcss: '*' } });
  await writeFile(join(root, 'components.json'), '{}');
  const info = await detectProject(root);
  assert.equal(info.stack, 'react');
  assert.ok(info.markers.includes('components.json'));
  assert.ok(info.warnings.some((warning) => /Workspace/.test(warning)));
});

test('Flutter marker detected; explicit platform overrides its default', async (t) => {
  const root = await project(t);
  await writeFile(join(root, 'pubspec.yaml'), 'name: studio');
  const plan = await createPlan(brief, { project: root, platform: 'desktop' });
  assert.equal(plan.context.stack, 'flutter');
  assert.equal(plan.context.platform, 'desktop');
  assert.equal(plan.recommendation.primary, 'desktop-native');
});

test('Malformed briefs, options, and manifests fail with actionable errors', async (t) => {
  await assert.rejects(createPlan({ product: 'Only a title' }), /audience/);
  await assert.rejects(createPlan({ ...brief, open_source: 'yes' }), /boolean/);
  await assert.rejects(createPlan(brief, { platform: 'tv' }), /platform/);
  await assert.rejects(createPlan(brief, { mode: 'delete' }), /mode/);
  const root = await project(t);
  await writeFile(join(root, 'package.json'), 'not JSON');
  await assert.rejects(detectProject(root), /JSON/);
});

test('Compact prompt retains brief, live-check limits, routing, platform, and audit scope', async () => {
  const options = { mode: 'audit', compact: true };
  const compact = await generatePrompt({ ...brief, stack: 'React' }, options);
  const full = await generatePrompt({ ...brief, stack: 'React' }, { mode: 'audit' });
  assert.ok(compact.length < full.length);
  assert.ok(compact.includes(brief.primary_task));
  assert.ok(compact.includes('without implementation or file edits'));
  assert.ok(compact.includes('"liveVerified": false'));
  assert.ok(compact.includes('# Web interfaces'));
});

test('Registry ids are unique and each choice contains actionable adaptation guidance', async () => {
  const registry = await getRegistry();
  assert.equal(new Set(registry.resources.map((item) => item.id)).size, registry.resources.length);
  for (const item of registry.resources) {
    assert.ok(item.adapt && item.inspect && item.license);
    assert.equal(new URL(item.url).protocol, 'https:');
    assert.ok(item.stacks.length === 0 || item.stacks.every((stack) => typeof stack === 'string'));
  }
});
