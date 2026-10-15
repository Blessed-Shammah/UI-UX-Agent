# UI/UX Agent

**Give your AI a design process, not another request to “make it look premium.”**

UI/UX Agent is an npm-installable, open-source skill and JavaScript toolkit for building thoughtful web interfaces, mobile apps, and desktop software with an LLM. It inspects a project's stack, proposes compatible design foundations, and guides the host agent from an imperfect brief through implementation and verification.

You describe what people need to do. The agent takes responsibility for the design decisions: hierarchy, type, color, spacing, imagery, motion, interaction states, and platform behavior.

It includes a **project-aware resource planner, skill installer, prompt composer, and importable API**. Bring a text-capable LLM or coding agent; no model service or paid API is required by this package. Your host's model and tools perform the design/build work. Their costs and limits remain separate.

## Start in one minute

Requires Node.js 20+. Install from this checkout:

```bash
npm install -g .
ui-ux-agent init --target portable --project /path/to/product
```

Then open the product in your coding agent and say:

```text
Read .ui-ux-agent/SKILL.md and use its UI/UX workflow.
Build an invoice follow-up tool for small studios. The owner should see which
invoice needs attention, inspect its history, and prepare a reminder.
Use this project's stack. Make reasonable design decisions and verify the flow.
```

For local skill discovery, select `--target codex`, `claude`, `cursor`, or `copilot` instead of `portable`. The installer copies the skill, references, and routing metadata into the target's project folder and preserves existing files. These are local skill adapters, not marketplace registrations. See [installation and integrations](docs/npm-and-integrations.md).

**For a downloadable npm package**, create and install a tarball:

```bash
npm pack
npm install -g ./ui-ux-agent-kit-0.3.0.tgz
```

Registry publication has not been performed; the package name is not claimed to be reserved. The checkout and tarball routes work without it.

**In an ordinary AI chat**, copy [the standalone starter](prompts/START.md), or generate a self-contained, resource-aware task from a brief:

```bash
ui-ux-agent prompt --brief examples/marketing-brief.json --output /tmp/design-task.md
```

Paste or attach the output to your model. All commands run locally without runtime dependencies or model calls; live research and rendering use the host agent's tools. Output files are never silently overwritten.

## Choose the right foundation

The planner considers platform, framework, existing components, product intent, free scope, source redistribution, and motion preference. Its shortlist includes **Tailark OSS, shadcn/ui, PrebuiltUI, daisyUI, shadcn-vue, shadcn-svelte, TailAdmin, Tabler, Flowbite, Landwind, Magic UI, React Bits**, and native/semantic alternatives.

```bash
ui-ux-agent inspect --project /path/to/product
ui-ux-agent plan --brief examples/marketing-brief.json --project /path/to/product --json
```

A React landing page can lead to Tailark blocks with a shadcn foundation; an invoice application calls for working application components; a native desktop tool calls for its native toolkit. An established design system takes priority over introducing a new one. Restricted or unverified source redistribution is excluded when `open_source` is true. Expressive motion is opt-in.

These are explainable local recommendations, not live verification or aesthetic verdicts. The agent must inspect the exact source/preview, adapt the product, implement its behavior, and verify the result. See [resource decisions](docs/resource-decisions.md) and [the routing registry](resources/routing.json).

## What it helps the agent do

| Your need | The workflow |
| --- | --- |
| “I have an idea, but cannot describe the design” | Infer a brief, state assumptions, choose a justified direction |
| “Everything looks like the same generated template” | Ground composition, copy, and imagery in the actual product |
| “A good free theme already exists” | Compare foundations, check rights and stack fit, adapt deliberately |
| “The screenshot looks good but nothing works” | Implement states, task completion, recovery, and truthful demo boundaries |
| “It breaks on a phone or small window” | Apply platform-specific layouts and verify representative sizes |
| “I keep re-prompting with no progress” | Diagnose the failed decision and fix it using observable evidence |

There are five specialist perspectives: product designer, visual designer, resource curator, UI engineer, and experience reviewer. One model can perform them sequentially. Separate agents are optional and depend on the host and your authorization.

## Choose your mode

```bash
# Improve an existing interface while preserving its behavior
ui-ux-agent prompt --brief examples/saas-brief.json --mode redesign --project /path/to/product

# Review without changing code; smaller prompt for limited context
ui-ux-agent prompt --brief examples/saas-brief.json --mode audit --compact

# Concise teacher-style review: keep good work and suggest justified corrections
ui-ux-agent prompt --brief examples/review-brief.json --mode review --project /path/to/product --compact

# A focused specialist handoff
ui-ux-agent prompt --brief examples/desktop-brief.json --role experience-reviewer

# Dated free-template leads, not a live search
ui-ux-agent resources --query "clean ui"
```

Create your own brief using [the minimal template](templates/brief.json). Only `product`, `audience`, and `primary_task` are required. The JavaScript planner uses an explicit platform or a detected project platform, falling back to `web`; `--platform` overrides it. Examples include [marketing](examples/marketing-brief.json), [SaaS application](examples/saas-brief.json), [mobile fieldwork](examples/mobile-brief.json), and [a desktop studio tool](examples/desktop-brief.json). Example paths are checkout-relative; use your own brief path after installing elsewhere.

See [the worked SaaS contract](examples/saas-design-contract.md) and [its CSS tokens](examples/saas-tokens.css) for concrete design decisions. They illustrate the process; they are not a finished app or a mandatory house style.

## Review existing work without forcing a redesign

Ask the installed skill:

```text
Review this interface like a thoughtful teacher. Explain what works and keep it.
If it needs improvement, suggest the smallest effective corrections and why.
If the central approach needs rethinking, describe a better implementation.
Keep the report concise and do not change files yet.
```

Review mode supports **Keep**, **Refine**, **Rethink**, and **Insufficient evidence**. It gives specific strengths, usually up to three priority corrections with reasons and checks, and a better implementation only when warranted. It can recommend no changes. It distinguishes usability defects from taste, and marks missing runtime/visual evidence explicitly.

The planner leaves the verdict unassessed until the host agent inspects the actual work. It does not prescribe a replacement library before finding a problem. Review and audit remain advisory; implementing corrections requires an implementation request. See [review guidance](skills/ui-ux-agent/references/review.md) and [the concise report template](templates/review.md).

## Import into your LLM workflow

Install the local tarball as a dependency, then:

```js
import { createPlan, generatePrompt } from 'ui-ux-agent-kit';

const brief = {
  product: 'Workshop booking', audience: 'Independent studios',
  primary_task: 'Understand the product and open a booking demo',
  intent: 'marketing', stack: 'React', free_only: true,
};
const plan = await createPlan(brief, { project: './product' });
const prompt = await generatePrompt(brief, { project: './product' });
// Supply prompt to your existing LLM integration; inspect plan for routing data.
```

See [API and installation details](docs/npm-and-integrations.md). The earlier Python composer remains available with Python 3.10+ as a basic prompt-only fallback; project detection, resource ranking, and host installation are JavaScript features.

## How quality is handled

The agent establishes a small design contract, builds a representative slice, inspects it, and extends the same system across the requested experience. It checks the owner's promise and the end user's task. It uses existing components or a licensed template when that saves effort without sacrificing fit.

Completion requires evidence: applicable build/tests, rendered layouts, working interactions, keyboard behavior, and relevant accessibility checks. Every result is marked passed, failed, unverified, or not applicable. Text-only models can write specs and code; they cannot honestly claim to have rendered or tested them.

No prompt guarantees flawless design, one-pass delivery, or an interface nobody associates with AI. This toolkit aims to reduce avoidable iteration and make failures easier to diagnose. Its effect on design quality has **not yet been independently benchmarked**. See [evaluation](evals/README.md).

## Explore the toolkit

- [Design workflow and recovery](skills/ui-ux-agent/references/workflow.md)
- [Patterns for SaaS, commerce, editorial, mobile, and desktop](skills/ui-ux-agent/references/product-patterns.md)
- [Color, type, composition, imagery, and motion](skills/ui-ux-agent/references/visual-direction.md)
- [Interaction states and implementation](skills/ui-ux-agent/references/interaction.md)
- [Free-resource and template strategy](skills/ui-ux-agent/references/sourcing.md)
- [Web](skills/ui-ux-agent/references/platform-web.md), [mobile](skills/ui-ux-agent/references/platform-mobile.md), and [desktop](skills/ui-ux-agent/references/platform-desktop.md) guidance
- [Quality gates](skills/ui-ux-agent/references/quality.md) and [delivery template](templates/delivery.md)
- [Model capabilities and context management](docs/model-workflow.md)
- [Sources and research boundaries](docs/sources.md)

## Development and contributions

The npm CLI is in `bin/`, its API is in `src/`, and the Python fallback is in `tools/`. Tests are in `tests/`, instructions in `skills/`, and resource data in `resources/`. There are no runtime dependencies or application build step.

```bash
npm test
npm run test:python
node bin/ui-ux-agent.js --help
npm pack --dry-run
```

Read [CONTRIBUTING.md](CONTRIBUTING.md) for changes, resource submissions, and evidence requirements. The existing [AGENTS.md](AGENTS.md) is preserved; this README documents the toolkit added after that initial scaffold.

## License

[MIT](LICENSE) for this repository's original code and documentation. Referenced projects, fonts, images, and other assets retain their own licenses. No third-party templates or commercial theme assets are bundled.
