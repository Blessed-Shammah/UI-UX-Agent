# How resource decisions work

The JavaScript planner uses [routing metadata](../resources/routing.json). It combines platform, framework markers, existing components, product intent, free scope, source-distribution constraints, and motion preference. It does not make a live aesthetic judgment or download third-party code.

## Examples

| Situation | Expected decision |
| --- | --- |
| New React SaaS landing page, open-source, subtle motion | Inspect Tailark OSS marketing blocks and shadcn as a compatible interaction foundation |
| React invoice application | Prioritize working application components; do not prescribe a marketing hero |
| Existing Material UI or another component system | Extend the existing system; use external candidates only for named gaps |
| Vue or Svelte product | Exclude React-only source; inspect compatible ports or cross-framework CSS foundations |
| Native desktop tool | Use native toolkit conventions, keyboard flows, resizing and density |
| Electron/React tool | Compatible web components can be used inside the shell, with desktop-specific verification |
| Unknown framework | Report uncertainty and prefer semantic/platform primitives until the stack is established |
| Open-source component kit | Exclude restricted or unverified redistribution, even if a website says “free” |

## Why these named libraries are different

[Tailark's open-source repository](https://github.com/tailark/blocks) is a marketing-block source; it documents its registry and primitive variants. Its commercial site also has paid offerings. The agent must select the actual OSS item and verify the current revision, rather than assuming every preview is freely reusable.

[shadcn/ui installation guidance](https://ui.shadcn.com/docs/installation) provides framework-specific setup paths. It supplies source components, not a finished product identity. The agent still designs content, task flow, density, tokens, and states.

[PrebuiltUI's license](https://prebuiltui.com/policies/template-license) distinguishes end-product use from standalone source/kit redistribution and has separate free/premium terms. The toolkit links to its search/components pages for discovery and does not bundle its source. The supplied clean-UI search URL could not be retrieved during this review, so the entry explicitly requires live inspection and offers the official components page as a fallback.

Motion libraries are optional enhancements, not foundations. They remain excluded unless expressive motion is requested; their current license and exact component dependencies still need inspection. A quiet application should not acquire animation machinery merely because it is available.

## Ranking and boundaries

Hard filters eliminate incompatible surfaces/stacks, paid-only entries under free-only policy, restricted or unverified source redistribution under open-source policy, and unrequested expressive motion. Eligible entries earn explicit points for task fit, framework fit, narrowly targeted source, foundation role, and already-installed libraries. Marketing blocks receive a marketing-specific bonus. Ties use stable IDs.

These authored weights are inspectable in `src/planner.js`. They are not learned recommendations or measured quality. The model can override the order after inspecting evidence, and should explain why. Keep the dated registry small enough to maintain; adding a source requires a concrete task fit, caution, and official references.

Before a recommendation becomes an adoption, the agent must inspect the actual free component, layout, narrow behavior, source, license, dependencies, and integration effort. After adoption it must change demo content, integrate a coherent visual system, implement meaningful states, run the task, and report evidence. Returning the ranking alone does not complete a design/build request.
