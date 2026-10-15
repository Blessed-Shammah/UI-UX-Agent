# Quality gates and honest delivery

## Blocking gates

A scoped implementation is not ready if its main journey is broken, essential controls are inaccessible, content is misleading, user work is lost unexpectedly, or layout prevents use on a supported size. Visual appeal cannot compensate for these failures.

| Gate | Evidence to collect |
| --- | --- |
| Product fit | Primary journey and success state demonstrated with realistic content |
| Behavior | Meaningful actions work; loading, empty, validation, failure, and recovery inspected |
| Visual system | Rendered views show consistent type, color roles, spacing, alignment, and image treatment |
| Responsiveness | Representative narrow/medium/wide sizes; long content and enlargement checked |
| Accessibility | Keyboard/focus checks, actual contrast, semantic inspection, relevant automated scan |
| Engineering | Applicable build, lint, tests; console/network errors checked |
| Assets | Missing assets resolved, required notices retained, provenance recorded |

Use only applicable gates. A visual prototype can pass its agreed prototype scope, but must still label simulated behavior. Native projects use platform-specific accessibility checks rather than claiming web compliance proves native quality.

## Critique the rendered result

Check in this order: task and hierarchy, content, composition and density, typography, color contrast, imagery, interaction feedback, then fine polish. Describe observable defects: “the primary action falls below the fold at 360px” is actionable; “not premium enough” is not.

Compare against the design contract and chosen reference qualities. Fix the three highest-impact issues, render again, and check for regressions. Do not introduce unrelated aesthetic directions during polish. Use screenshots to inspect layout; use interaction tests to establish behavior. Neither replaces the other.

## Evidence record

For each check, record `pass`, `fail`, `unverified`, or `not applicable`, with the command or manual steps, environment, observed outcome, and artifact path if one exists. Do not turn “not run” into “pass.” Do not fabricate screenshots, audit outputs, accessibility conformance, real-user feedback, or performance metrics.

Delivery should give the user the working artifact, setup/run commands, a concise account of major choices, evidence, and remaining limitations. A high model-generated rating is not evidence of real usability.

## Optional review rubric

For comparing candidates, rate task clarity, task completion, visual coherence, distinctiveness appropriate to the domain, accessibility, and responsiveness from 1–5. Anchor 1 to a concrete failure, 3 to usable but inconsistent, and 5 to strong execution with evidence. Keep ratings separate; do not average away a blocked task. These are subjective review aids, not a benchmark result or a guarantee that nobody will recognize AI assistance.
