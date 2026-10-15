# From intent to a usable product

## A compact contract

Record these decisions in the project's existing documentation, or a small `design/` folder if appropriate. Do not generate a paperwork tree for a button fix.

| Decision | Useful detail |
| --- | --- |
| Audience | Who uses this, on what device, under what pressure? |
| Job | “When invoices are overdue, find the next customer to contact.” |
| Success | A visible completed action, not “a modern dashboard.” |
| Scope | Screens, primary journey, data source, demo versus production. |
| Direction | Mood, composition, type roles, image treatment, one distinctive device. |
| System | Semantic colors, type scale, spacing, radii, elevations, motion. |
| Acceptance | Observable checks, including failure and narrow-window behavior. |

Keep decisions and unresolved assumptions distinct. Existing brand constraints win over taste preferences.

## Build

1. Map the shortest successful journey and its recovery paths. Use real domain vocabulary and plausible data; resolve content before decorating it.
2. Examine up to three useful references if browsing is available. Extract specific lessons, such as navigation density or form grouping. Choose custom composition, an existing system, or a licensed template based on fit and adaptation cost.
3. Compare two materially different directions privately: composition, hierarchy, type, density, imagery. Choose one and explain the fit. Do not make users approve every color.
4. Establish semantic tokens and a few shared primitives. Build the riskiest representative screen with its real interactions and a narrow layout.
5. Render it. Check visual hierarchy, actual text wrapping, keyboard flow, touch use, image crops, and states. Fix structural issues before producing more screens.
6. Extend the same decisions across the scoped journey. Run quality gates and deliver evidence.

## Redesign

Capture the current routes, tasks, components, screenshots, and known bugs first. Preserve behavior and familiar concepts unless a change solves an identified problem. Identify three high-impact defects and fix hierarchy/layout before cosmetic detail. Compare the same task and viewport before and after. A complete rewrite is rarely the first remedy for poor spacing.

## Audit

Inspect the artifact the user provided. Each finding needs location, observable problem, user impact, severity, proposed fix, and a verification method. Prioritize broken tasks, inaccessible controls, and misleading states ahead of visual preference. Separate measured issues from subjective suggestions. Follow [review guidance](review.md) to retain strengths and avoid manufacturing defects. Do not implement changes unless requested.

## Review and rethink

Use [review guidance](review.md) for a concise teaching-style assessment. Choose Keep, Refine, Rethink, or Insufficient evidence from what was actually observed. Preserve sound work; a zero-finding review is legitimate. If improvement is needed, explain the smallest effective correction and why it matters. Recommend a different implementation only when evidence justifies its cost. Do not begin the corrections without an implementation request.

## Recover without exhausting the user

If an iteration fails, name the failed hypothesis: missing hierarchy, inappropriate density, weak type, irrelevant imagery, or broken behavior. Make a targeted correction and compare evidence. After two unsuccessful attempts at the same design problem, change the foundation or reference rather than randomly changing colors. This is an escalation heuristic, not a guarantee of success or permission to abandon the task.

When the user changes direction, preserve working behavior and update the contract. Finish with a short handoff: what works, commands, evidence, limitations, and any decision still requiring the owner.
