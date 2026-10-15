# npm package and LLM integration

## Install from the repository or a tarball

Requires Node.js 20+ and npm. No Python or third-party runtime packages are needed for the JavaScript CLI/API.

From a checkout:

```bash
npm install -g .
ui-ux-agent --help
```

To create a portable npm download:

```bash
npm pack
npm install -g ./ui-ux-agent-kit-0.3.0.tgz
```

The tarball can be shared and installed without publishing to the npm registry. `ui-ux-agent-kit` is the package's current metadata name, not a claim that this name is reserved or published. Registry ownership and publication are separate maintainer actions. Use the tarball or checkout instructions until an actual registry release is confirmed.

## Install into a coding agent's project

```bash
ui-ux-agent init --target portable --project /path/to/product --dry-run
ui-ux-agent init --target portable --project /path/to/product
```

| Target | Project-local destination |
| --- | --- |
| `portable` | `.ui-ux-agent/` |
| `codex` | `.agents/skills/ui-ux-agent/` |
| `claude` | `.claude/skills/ui-ux-agent/` |
| `cursor` | `.cursor/skills/ui-ux-agent/` |
| `copilot` | `.github/skills/ui-ux-agent/` |

The installer copies the entrypoint, all design references, and routing metadata. It refuses existing destinations and does not modify `AGENTS.md`, host settings, dependencies, or credentials. No postinstall hook silently edits projects. Choose one target rather than installing duplicate skills into several directories a host already scans.

These adapters create local skill folders, not official marketplace/plugin registrations. Host support and discovery vary by product/version. For `portable`, explicitly ask the agent to read `.ui-ux-agent/SKILL.md`. For hosts with skill discovery, select/invoke the skill if automatic selection does not occur.

Reviewed integration references: [OpenAI local skill discovery](https://learn.chatgpt.com/docs/build-skills), [Claude Code skills](https://code.claude.com/docs/en/skills), [Cursor skills](https://cursor.com/help/customization/skills), and [Copilot skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills).

## Route and execute a task

```bash
ui-ux-agent inspect --project /path/to/product
ui-ux-agent plan --brief examples/marketing-brief.json --project /path/to/product --json
ui-ux-agent prompt --brief examples/marketing-brief.json --project /path/to/product --output /tmp/design-task.md
```

Use your own brief file when running outside this repository; example paths are checkout-relative. A brief needs `product`, `audience`, and `primary_task`. Optional fields:

| Field | Meaning |
| --- | --- |
| `platform` | `web`, `mobile`, or `desktop`; CLI override wins |
| `intent` | `marketing`, `application`, `commerce`, or `editorial`; otherwise heuristically inferred |
| `stack` | Framework description, used when project detection cannot establish one |
| `free_only` | Boolean; defaults to true; candidate's exact free scope still needs inspection |
| `open_source` | Boolean; defaults to false; true excludes restricted/unverified source redistribution |
| `motion` | `none`, `subtle`, or `expressive`; expressive libraries are opt-in |
| `direction`, `constraints`, `acceptance` | Additional product instructions preserved in the task |

The CLI reads only bounded project markers at the selected root. In a monorepo, point `--project` at the actual application. It does not execute project scripts. For an existing project, detected framework markers take precedence over the brief's fallback stack description. Actual migrations require an explicit user decision and a revised plan.

Build/redesign plans give a strategy, compatible shortlist, adaptation instructions, excluded options with reasons, research steps, and execution checks. Ranking scores are fit heuristics, not design-quality scores. The host LLM must inspect live sources and the actual interface, choose a foundation, implement the product, and verify the result. This package does not provide a model or acquire the host's missing tools.

`mode: 'review'` requests a concise, teaching-style assessment: Keep, Refine, Rethink, or Insufficient evidence; specific strengths; justified priority corrections; and a better implementation only when needed. Review and audit plans leave `assessment.status` as `unassessed`, prohibit implementation within that task, and withhold replacement shortlists until an observed problem justifies researching alternatives. The model must inspect the work to form its verdict. `generatePrompt` includes this review guidance even with `compact: true`.

## Import from JavaScript

Install the tarball as a project dependency instead of globally:

```bash
npm install /path/to/ui-ux-agent-kit-0.3.0.tgz
```

```js
import { createPlan, generatePrompt, installSkill } from 'ui-ux-agent-kit';

const brief = {
  product: 'Workshop booking',
  audience: 'Independent studios',
  primary_task: 'Understand the product and open a booking demo',
  intent: 'marketing',
  stack: 'React',
  open_source: true,
};

const plan = await createPlan(brief, { project: './product' });
const prompt = await generatePrompt(brief, { project: './product', compact: true });
// Pass prompt to your chosen LLM using your host's existing model integration.
// Use plan.recommendation and plan.execution as structured task context.

await installSkill({ project: './product', target: 'portable', dryRun: true });
```

Additional exports: `detectProject(directory)`, `getRegistry()`, `validateBrief(brief)`, and `targets`. All operations are local. `createPlan`/`generatePrompt` accept `mode` and `platform`; `generatePrompt` also accepts `compact` and a specialist `role`. `installSkill` writes only when `dryRun` is false.

## Let the model call the planner as tools

```js
import { getAgentTools } from 'ui-ux-agent-kit';

const tools = getAgentTools({ project: '/path/to/product' });
// Each descriptor has: name, description, inputSchema, and async execute(input).
// Map the descriptors into your provider/agent framework's tool registration format.
// Dispatch a validated tool call to the corresponding execute method.
```

The four tools inspect the configured project, plan the interface, retrieve full task-specific guidance, and search local resource metadata. The host binds the project path; model arguments cannot override it. They expose no installation, publishing, or source-file mutation action. Provider SDK formats differ, so these are neutral descriptors, not a claim of automatic compatibility with every SDK.

Give the host model its ordinary code-editing, browsing, and preview tools as appropriate. The toolkit's tools help it make and explain the design decisions; they do not manufacture missing host capabilities. Retrieved guidance should lead into implementation and verification when that is the user's task.

## Publishing later

Choose an available package name or owned scope, authenticate npm in the maintainer's environment, run tests, inspect `npm pack --dry-run`, and publish the reviewed tarball with the intended visibility. Never commit npm tokens. This repository does not claim registry publication until an actual release is verified.
