# Web interfaces

Use semantic HTML and the project's routing/data conventions. Keep links navigational and buttons actionable. Support browser back, useful document titles, keyboard order, and appropriate form submission behavior.

Design from content constraints: inspect narrow, medium, and wide layouts (for example 360, 768, and 1440 CSS pixels) and intermediate widths. These are sample checks, not required breakpoints. Stack comparison layouts sensibly; provide intentional overflow for genuinely wide tables. Avoid page-wide horizontal scrolling. Test text enlargement, 200% zoom, and reflow at a narrow viewport. Do not disable zoom.

Use persistent focus indicators. Test menus, dialogs, tab sets, and validation with the keyboard. Dialog focus enters predictably, stays within a modal where appropriate, and returns to the trigger. Sticky headers and overlays must not hide focused controls. Announce important asynchronous changes without making the screen reader excessively chatty.

Target WCAG 2.2 AA for the scoped web content. Normal text needs 4.5:1 contrast; large text needs 3:1 under the standard's definition. Required graphical/control boundaries generally need 3:1, subject to the criterion's scope and exceptions. Target-size minimum is 24×24 CSS pixels or qualifying spacing/exceptions; prefer roughly 44×44 for touch where feasible. Do not misrepresent the larger design preference as the AA minimum.

Use [WCAG 2.2](https://www.w3.org/TR/WCAG22/) to resolve exact definitions and exceptions. Automated scans cover only part of accessibility; keyboard, screen reader, zoom, reading order, and task completion need human checks.

Reserve image dimensions, compress assets, and avoid unnecessary client JavaScript. [Core Web Vitals](https://web.dev/articles/vitals) good thresholds are LCP ≤2.5s, INP ≤200ms, and CLS ≤0.1, assessed at the 75th percentile. These are measurement targets; a local lab run cannot establish field performance. Inspect console errors and network failures, and test the actual primary flow rather than only taking a screenshot.
