# Contributing

Help make the agent's decisions better, not just its prompt longer. Start with a concrete task, an observed failure, or a useful resource whose fit can be explained.

## Repository map

- `skills/ui-ux-agent/`: portable entrypoint and focused design references.
- `prompts/`: standalone text entrypoint.
- `bin/` and `src/`: dependency-free Node.js CLI, project inspector, planner, prompt API, and skill installer.
- `tools/`: legacy Python prompt composer.
- `resources/`: dated, curated resource leads.
- `examples/` and `templates/`: reusable briefs and evidence artifacts.
- `tests/` and `evals/`: deterministic checks and behavioral evaluation protocol.

## Make a change

Use Node.js 20+ with ESM, two-space indentation, and descriptive `camelCase` names for JavaScript. The Python fallback uses Python 3.10+, four-space indentation, and `snake_case`. Prefer standard-library modules. Keep Markdown direct and links relative for local files. Put detailed conditional guidance in references rather than expanding every prompt. Preserve existing user choices and distinguish recommendations from requirements.

Run `npm test` and `npm run test:python`. Validate skill frontmatter with your host's skill validator when available. For distribution changes, pack the package, install that tarball in a temporary project, and exercise the CLI, API import, and copied skill. For prompt changes, also run an appropriate evaluation task; documentation validation does not establish behavioral quality. There is no numeric coverage threshold. Test meaningful behaviors and regression cases, not exact prompt wording.

## Resource submissions

Use the official source URL, specific use case, license-file URL where applicable, actual free scope, and caveats. Update the review date only after checking the catalog's entries; record individual review notes if only one resource was refreshed. Do not include commercial theme source, unlicensed screenshots/assets, secret credentials, or unsupported accessibility claims.

## Pull requests

Use concise imperative subjects, such as `Add desktop keyboard review guidance`. Explain the problem, changed behavior, validation, and remaining limits. Link an issue when relevant. For example UI changes, include comparable screenshots with viewport/device details and primary-task results. For claimed quality improvements, include the evaluation task, model/tool conditions, and evidence; do not present your own preference as a measured gain.

Report issues with a minimal brief, mode/platform, model capabilities, expected outcome, actual outcome, and redacted artifacts. Never upload private project data just to reproduce a design defect.
