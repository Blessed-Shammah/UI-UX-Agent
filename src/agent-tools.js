import { detectProject } from './project.js';
import { createPlan, getRegistry } from './planner.js';
import { generatePrompt } from './prompt.js';

function checkInput(input, allowed) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Tool input must be an object.');
  for (const key of Object.keys(input)) {
    if (!allowed.includes(key)) throw new Error(`Unexpected tool input: ${key}`);
  }
}

/** Provider-neutral descriptors. The host maps schemas and dispatches execute. */
export function getAgentTools({ project = '.' } = {}) {
  const briefSchema = {
    type: 'object', required: ['product', 'audience', 'primary_task'],
    properties: {
      product: { type: 'string' }, audience: { type: 'string' }, primary_task: { type: 'string' },
      platform: { type: 'string', enum: ['web', 'mobile', 'desktop'] },
      intent: { type: 'string', enum: ['marketing', 'application', 'commerce', 'editorial'] },
      stack: { type: 'string' }, free_only: { type: 'boolean' }, open_source: { type: 'boolean' },
      motion: { type: 'string', enum: ['none', 'subtle', 'expressive'] },
    },
    additionalProperties: true,
  };
  const taskSchema = {
    type: 'object', required: ['brief'], additionalProperties: false,
    properties: {
      brief: briefSchema, mode: { type: 'string', enum: ['build', 'redesign', 'audit', 'review'] },
      platform: { type: 'string', enum: ['web', 'mobile', 'desktop'] },
    },
  };
  return [
    {
      name: 'uiux_inspect_project',
      description: 'Read framework and design-system markers in the host-configured project. Does not execute project scripts.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      async execute(input = {}) { checkInput(input, []); return detectProject(project); },
    },
    {
      name: 'uiux_plan_interface',
      description: 'Rank compatible UI foundations with reasons and exclusions, then provide research and execution steps. Recommendations need live inspection.',
      inputSchema: taskSchema,
      async execute(input) {
        checkInput(input, ['brief', 'mode', 'platform']);
        return createPlan(input.brief, { project, mode: input.mode, platform: input.platform });
      },
    },
    {
      name: 'uiux_get_design_guidance',
      description: 'Get task-specific design/build/audit/review guidance. Review recognizes sound work and gives concise, justified corrections without editing files.',
      inputSchema: taskSchema,
      async execute(input) {
        checkInput(input, ['brief', 'mode', 'platform']);
        return { prompt: await generatePrompt(input.brief, { project, mode: input.mode, platform: input.platform }) };
      },
    },
    {
      name: 'uiux_search_resources',
      description: 'Search dated local resource metadata. Not live web search, code download, or license verification.',
      inputSchema: { type: 'object', required: ['query'], properties: { query: { type: 'string' } }, additionalProperties: false },
      async execute(input) {
        checkInput(input, ['query']);
        if (typeof input.query !== 'string') throw new Error('query must be a string.');
        const registry = await getRegistry();
        const terms = input.query.toLowerCase().split(/\s+/).filter(Boolean);
        return {
          reviewed: registry.reviewed, liveVerified: false,
          resources: registry.resources.filter((item) => terms.every((term) => JSON.stringify(item).toLowerCase().includes(term))),
        };
      },
    },
  ];
}
