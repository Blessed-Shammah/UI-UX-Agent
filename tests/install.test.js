import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { installSkill, targets } from '../src/index.js';

async function sandbox(t) {
  const root = await mkdtemp(join(tmpdir(), 'uiux-install-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test('All host targets install self-contained skills while preserving AGENTS.md', async (t) => {
  for (const target of Object.keys(targets)) {
    const root = await sandbox(t);
    await writeFile(join(root, 'AGENTS.md'), 'user instructions\n');
    const result = await installSkill({ project: root, target });
    assert.ok((await readFile(join(result.destination, 'SKILL.md'), 'utf8')).startsWith('---'));
    assert.ok((await readFile(join(result.destination, 'references/resource-routing.md'), 'utf8')).length);
    const registry = JSON.parse(await readFile(join(result.destination, 'resources/routing.json'), 'utf8'));
    assert.ok(registry.resources.some((item) => item.id === 'tailark'));
    assert.equal(await readFile(join(root, 'AGENTS.md'), 'utf8'), 'user instructions\n');
  }
});

test('Dry run makes no changes', async (t) => {
  const root = await sandbox(t);
  const result = await installSkill({ project: root, target: 'claude', dryRun: true });
  assert.equal(result.dryRun, true);
  assert.deepEqual(await readdir(root), []);
});

test('Reinstall refuses to overwrite customized skill files', async (t) => {
  const root = await sandbox(t);
  const result = await installSkill({ project: root });
  await writeFile(join(result.destination, 'SKILL.md'), 'custom instructions');
  await assert.rejects(installSkill({ project: root }), /already exists/);
  assert.equal(await readFile(join(result.destination, 'SKILL.md'), 'utf8'), 'custom instructions');
});

test('Symlink parents and destinations are rejected before writing outside the project', async (t) => {
  const root = await sandbox(t);
  const outside = await sandbox(t);
  await symlink(outside, join(root, '.claude'));
  await assert.rejects(installSkill({ project: root, target: 'claude' }), /regular directory/);
  assert.deepEqual(await readdir(outside), []);
  await symlink(outside, join(root, '.ui-ux-agent'));
  await assert.rejects(installSkill({ project: root }), /already exists/);
});

test('Invalid targets cannot create arbitrary paths', async (t) => {
  const root = await sandbox(t);
  await assert.rejects(installSkill({ project: root, target: '../outside' }), /Unknown/);
  assert.deepEqual(await readdir(root), []);
});
