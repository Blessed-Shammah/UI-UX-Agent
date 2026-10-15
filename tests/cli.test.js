import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from '../src/cli.js';

const brief = fileURLToPath(new URL('../examples/saas-brief.json', import.meta.url));
async function run(...args) {
  const result = { stdout: '', stderr: '', status: null };
  result.status = await runCli(args, {
    stdout: (text) => { result.stdout += text; },
    stderr: (text) => { result.stderr += text; },
  });
  return result;
}

test('CLI help, valid plan JSON, and filtered resources work', async () => {
  assert.equal((await run('--help')).status, 0);
  const result = await run('plan', '--brief', brief, '--json');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).schemaVersion, 1);
  const resources = JSON.parse((await run('resources', '--query', 'tailark', '--json')).stdout);
  assert.equal(resources.resources.length, 1);
  assert.equal(resources.resources[0].id, 'tailark');
});

test('CLI errors exit nonzero without writing an output artifact', async (t) => {
  const folder = await mkdtemp(join(tmpdir(), 'uiux-cli-'));
  t.after(() => rm(folder, { recursive: true, force: true }));
  const output = join(folder, 'prompt.md');
  await writeFile(output, 'keep this');
  const result = await run('prompt', '--brief', brief, '--compact', '--output', output);
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.equal(await readFile(output, 'utf8'), 'keep this');
  assert.equal((await run('plan')).status, 1);
  assert.equal((await run('unknown')).status, 1);
  assert.equal((await run('plan', '--brief', brief, '--unknown')).status, 1);
});
