import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getAgentTools } from '../src/index.js';

test('Agent tools use the host-bound project and provide executable structured results', async (t) => {
  const project = await mkdtemp(join(tmpdir(), 'uiux-tools-'));
  t.after(() => rm(project, { recursive: true, force: true }));
  await writeFile(join(project, 'package.json'), JSON.stringify({ dependencies: { vue: '*' } }));
  const tools = getAgentTools({ project });
  const byName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
  const inspected = await byName.uiux_inspect_project.execute({});
  assert.equal(inspected.stack, 'vue');
  const brief = { product: 'Invoices', audience: 'Studios', primary_task: 'Review overdue invoices' };
  const plan = await byName.uiux_plan_interface.execute({ brief });
  assert.equal(plan.context.project.root, project);
  assert.ok(plan.recommendation.shortlist.some((item) => item.id === 'shadcn-vue'));
  const found = await byName.uiux_search_resources.execute({ query: 'tailark' });
  assert.equal(found.resources[0].id, 'tailark');
  assert.equal(found.liveVerified, false);
  const guidance = await byName.uiux_get_design_guidance.execute({ brief, mode: 'audit' });
  assert.ok(guidance.prompt.includes('without implementation or file edits'));
});

test('Model arguments cannot override the host-bound project or invoke filesystem mutations', async () => {
  const tools = getAgentTools();
  assert.ok(tools.every((tool) => !/install|write|delete/.test(tool.name)));
  await assert.rejects(tools[0].execute({ project: '/elsewhere' }), /Unexpected/);
  await assert.rejects(tools[1].execute({ brief: {}, project: '/elsewhere' }), /Unexpected/);
  await assert.rejects(tools[3].execute({ query: 123 }), /string/);
});
