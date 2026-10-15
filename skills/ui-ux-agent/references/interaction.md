# Interaction, content, and engineering

## Design the state model

For each meaningful component, consider default, hover where available, focus, active/selected, disabled, loading, empty, error, and success. Implement only applicable states, but do not omit failure because the mockup looks nicer without it.

| Situation | Expected behavior |
| --- | --- |
| Save takes time | Show progress, prevent duplicate submission, preserve the draft. |
| Request fails | Explain the problem near its context and offer a useful retry. |
| No records yet | Explain what appears here and provide a relevant first action. |
| Filter has no results | Preserve filters and offer a clear way to reset them. |
| Action destroys work | Explain consequence and provide confirmation or undo as appropriate. |
| Session expires | Preserve recoverable work and make the next step understandable. |
| Network is unavailable | Distinguish cached, queued, and failed states truthfully. |

Use optimistic updates only when failure recovery is defined. A toast does not prove persistence. Do not present browser storage as secure multi-user infrastructure.

## Write from the user's side

Use nouns people recognize and verbs that describe outcomes: “Create invoice,” “Save changes,” “Export CSV.” Keep the same action name across button, dialog, progress, and confirmation. Give forms persistent visible labels, useful examples, field errors, and appropriate autofill/input types. Preserve input after errors. Avoid invented statistics, generic superlatives, placeholder testimonials, and decorative jargon.

Navigation should expose location and the next useful action. Keep back behavior predictable. Provide URLs for meaningful web locations where appropriate. Offer a non-drag alternative for drag interactions. Make tooltips supplementary, not the only way to discover essential information.

## Engineer for consistency

Use existing components and dependencies when sound. Centralize semantic tokens and interaction primitives; separate content/data from layout where useful. Choose mature accessible primitives for dialogs, menus, tabs, and popovers, then test their integration. Do not replace platform semantics with clickable generic containers.

Map mock data and production APIs explicitly. Keep server validation, authorization, and payment processing outside the claims of a visual prototype. Use the project's architecture and error handling. Avoid new dependencies for simple visual effects. Optimize images, reserve media dimensions, load expensive features on demand, and measure on representative devices.

## Owner and end-user passes

As the owner: is the promise truthful, the main action discoverable, the scope maintainable, and the important business state visible?

As the end user: can I complete the task without guessing, recover a mistake, understand what's happening, and operate the interface using my input method?

Resolve the highest-impact mismatch before adding visual flourish.
