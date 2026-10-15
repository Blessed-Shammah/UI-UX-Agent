import { readFile, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { createPlan, detectProject, generatePrompt, getRegistry, installSkill } from './index.js';

const help = `UI/UX Agent — install, inspect, route, and brief your coding agent

ui-ux-agent init --target portable|codex|claude|cursor|copilot [--project .] [--dry-run]
ui-ux-agent inspect [--project .]
ui-ux-agent plan --brief brief.json [--project .] [--mode build|redesign|audit|review] [--json]
ui-ux-agent prompt --brief brief.json [--project .] [--compact] [--output prompt.md]
ui-ux-agent resources [--query "clean UI"] [--json]

plan/prompt: --platform web|mobile|desktop; prompt also accepts --role.
--output creates a new file and refuses to overwrite. No automatic model calls,
third-party library installation, browsing, or publishing. Node.js 20+.
`;

export async function runCli(argv, io = { stdout: (text) => process.stdout.write(text), stderr: (text) => process.stderr.write(text) }) {
  try {
    const command = argv[0];
    const { values, positionals } = parseArgs({
      args: argv.slice(1), allowPositionals: true,
      options: {
        project: { type: 'string' }, target: { type: 'string' }, brief: { type: 'string' },
        mode: { type: 'string' }, platform: { type: 'string' }, role: { type: 'string' },
        query: { type: 'string' }, output: { type: 'string' },
        compact: { type: 'boolean' }, json: { type: 'boolean' },
        'dry-run': { type: 'boolean' }, help: { type: 'boolean' },
      },
    });
    if (positionals.length) throw new Error(`Unexpected arguments: ${positionals.join(' ')}`);
    let result;
    if (!command || ['help', '--help', '-h'].includes(command) || values.help) result = help;
    else if (command === 'init') result = await installSkill({ project: values.project, target: values.target, dryRun: values['dry-run'] });
    else if (command === 'inspect') result = await detectProject(values.project);
    else if (command === 'resources') {
      const registry = await getRegistry();
      const query = (values.query ?? '').toLowerCase().split(/\s+/).filter(Boolean);
      const resources = registry.resources.filter((item) => query.every((term) => JSON.stringify(item).toLowerCase().includes(term)));
      result = values.json ? { reviewed: registry.reviewed, liveVerified: false, resources } :
        `Dated resource leads (${registry.reviewed}), not live verification.\n\n` + resources.map((item) => `${item.name} [${item.role}]\n${item.url}\n${item.adapt}\nInspect: ${item.inspect}`).join('\n\n');
    } else if (['plan', 'prompt'].includes(command)) {
      if (!values.brief) throw new Error('--brief is required.');
      const brief = JSON.parse(await readFile(values.brief, 'utf8'));
      const options = { project: values.project, mode: values.mode, platform: values.platform, compact: values.compact, role: values.role };
      if (command === 'prompt') result = await generatePrompt(brief, options);
      else {
        const plan = await createPlan(brief, options);
        result = values.json ? plan : [
          `Strategy: ${plan.strategy}`, `Mode: ${plan.mode}; surface: ${plan.context.surface}; stack: ${plan.context.stack}; intent: ${plan.context.intent}`,
          `Primary: ${plan.recommendation.primary}`, plan.recommendation.rationale,
          ...(plan.assessment ? [
            '\nAssessment status: unassessed — the host agent must inspect the actual work.',
            ...plan.assessment.report.map((item) => `- ${item}`),
          ] : ['\nInspect this shortlist:', ...plan.recommendation.shortlist.map((item) => `- ${item.name}: ${item.reasons.join(' ')}\n  ${item.url}\n  Adapt: ${item.adapt}\n  Verify: ${item.inspect}`)]),
          '\nExecution:', ...plan.execution.map((step, index) => `${index + 1}. ${step}`),
          '\nLimits:', ...plan.limits, 'Use --json for research steps and the full mode-specific contract.',
        ].join('\n');
      }
    } else throw new Error(`Unknown command: ${command}. Use --help.`);
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    if (values.output) {
      await writeFile(values.output, text.endsWith('\n') ? text : text + '\n', { flag: 'wx', encoding: 'utf8' });
      io.stderr(`Created ${values.output}\n`);
    } else io.stdout(text.endsWith('\n') ? text : text + '\n');
    return 0;
  } catch (error) {
    io.stderr(`ui-ux-agent: ${error.message}\n`);
    return 1;
  }
}
