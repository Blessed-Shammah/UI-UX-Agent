import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPlan, generatePrompt, getAgentTools } from '../src/index.js';
import { runCli } from '../src/cli.js';

const brief = { product: 'Existing invoices', audience: 'Studio owners', primary_task: 'Review an invoice and prepare a reminder', stack: 'React' };

test('Review and audit defer verdicts and do not prescribe a replacement foundation', async () => {
  for (const mode of ['review', 'audit']) {
    const plan = await createPlan(brief, { mode });
    assert.equal(plan.strategy, 'assess-before-changing');
    assert.equal(plan.assessment.status, 'unassessed');
    assert.equal(plan.assessment.changesAuthorized, false);
    assert.ok(plan.assessment.verdicts.includes('keep'));
    assert.ok(plan.assessment.verdicts.includes('insufficient-evidence'));
    assert.equal(plan.recommendation.primary, 'retain-until-evidence');
    assert.deepEqual(plan.recommendation.shortlist, []);
    assert.deepEqual(plan.recommendation.supporting, []);
  }
});

test('A review leaves existing source and project instructions unchanged', async (t) => {
  const project = await mkdtemp(join(tmpdir(), 'uiux-review-'));
  t.after(() => rm(project, { recursive: true, force: true }));
  const source = '<button>Prepare reminder</button>\n';
  await writeFile(join(project, 'index.html'), source);
  await writeFile(join(project, 'AGENTS.md'), 'Keep existing project instructions.\n');
  const before = await readdir(project);
  await createPlan(brief, { mode: 'review', project });
  await generatePrompt(brief, { mode: 'review', project });
  assert.equal(await readFile(join(project, 'index.html'), 'utf8'), source);
  assert.equal(await readFile(join(project, 'AGENTS.md'), 'utf8'), 'Keep existing project instructions.\n');
  assert.deepEqual(await readdir(project), before);
});

test('Review guidance survives compact bundles and role selection', async () => {
  const prompt = await generatePrompt(brief, { mode: 'review', compact: true, role: 'experience-reviewer' });
  assert.ok(prompt.includes('# Review like a thoughtful teacher'));
  assert.ok(prompt.includes('Keep is a valid verdict'));
  assert.ok(prompt.includes('zero to three priority corrections'));
  assert.ok(prompt.includes('Do not implement proposed changes'));
});

test('CLI accepts review mode and avoids an empty resource shortlist display', async () => {
  const briefPath = new URL('../examples/review-brief.json', import.meta.url).pathname;
  let stdout = '';
  let stderr = '';
  const status = await runCli(['plan', '--brief', briefPath, '--mode', 'review'], {
    stdout: (text) => { stdout += text; }, stderr: (text) => { stderr += text; },
  });
  assert.equal(status, 0, stderr);
  assert.ok(stdout.includes('assess-before-changing'));
  assert.ok(stdout.includes('Assessment status: unassessed'));
  assert.ok(!stdout.includes('Inspect this shortlist:'));
});

test('LLM tool schema exposes review and executes an advisory plan', async () => {
  const tool = getAgentTools().find((item) => item.name === 'uiux_plan_interface');
  assert.ok(tool.inputSchema.properties.mode.enum.includes('review'));
  const plan = await tool.execute({ brief, mode: 'review' });
  assert.equal(plan.assessment.changesAuthorized, false);
});

test('Build mode still supplies implementation resources without an unearned review verdict', async () => {
  const plan = await createPlan(brief, { mode: 'build' });
  assert.ok(plan.recommendation.shortlist.length);
  assert.equal(plan.assessment, undefined);
});
