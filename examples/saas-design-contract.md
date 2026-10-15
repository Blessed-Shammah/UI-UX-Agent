# Worked contract: Due North

An illustrative design decision record for [the SaaS brief](saas-brief.json), not a rendered application or a claim of tested usability.

## Product and task

A studio owner starts the day by deciding which overdue invoice needs attention. Success means opening a relevant invoice, reviewing its history, editing a reminder, and preparing it with a truthful demonstration confirmation. Sending email, authentication, payments, and remote persistence are outside this example's scope.

## Direction

Use a calm operational workspace: pale slate canvas, white work surfaces, ink headings, and restrained blue actions. A compact invoice list is the organizing element; a detail panel supplies history and the reminder action. This makes the work visible before summary metrics. Avoid a hero, oversized greeting, decorative chart, or arbitrary financial totals.

One system sans-serif family keeps this small application fast and readable. The identity comes from careful table rhythm, an orderly status language, and a precise reminder workflow, rather than unusual type for its own sake.

## Tokens

Use [the CSS example](saas-tokens.css) as a starting implementation. It is specific to this illustrative light theme, not a universal palette.

| Role | Choice | Intended use |
| --- | --- | --- |
| Canvas | `#F8FAFC` | Workspace background |
| Surface | `#FFFFFF` | Invoice and detail surfaces |
| Text | `#0F172A` | Headings and primary content |
| Secondary text | `#475569` | Dates and supporting labels |
| Action | `#1D4ED8` | Primary action with white text |
| Danger | `#B91C1C` | Error text with descriptive message |
| Border | `#CBD5E1` | Decorative grouping; do not rely on it alone to identify controls |

Use a 4/8/12/16/24/32/48 spacing rhythm. Heading: 28px/1.2, weight 650 where available; section title: 18px/1.35; body: 16px/1.5; table labels: 14px/1.4. Check the actual font fallback and content density before finalizing.

## Composition and flow

Wide: concise navigation, page title and relevant action, filter row, invoice list beside details. Narrow: preserve the invoice's customer, due status, amount, and open action; move details into a dedicated navigable view. Do not squeeze the wide table and panel into a phone.

Sort the example queue by overdue urgency, but label the actual rule. Keep search/filter state when returning from details. Use words alongside status color. Prefer “Prepare reminder” to “Send” because this demonstration does not send email.

## State and evidence plan

Check initial sample records, no invoices, no filter results, invalid recipient, edited reminder, preparation in progress, simulated failure, retry, and success. Preserve the draft on failure and mark all sample data.

Inspect at 360px, 768px, and 1440px; test intermediate resizing, 200% zoom, keyboard operation, long customer names, and large invoice values. Measure actual rendered contrast, including focus and input boundaries. Run the selected project's build and tests. Record each result in [the handoff template](../templates/delivery.md).

No runtime checks are claimed here. These choices are a concrete hypothesis to implement and evaluate.
