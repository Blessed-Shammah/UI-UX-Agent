# Desktop applications

Honor the target OS and toolkit rather than styling every desktop product as a browser landing page. Use platform-native windowing, menus, file dialogs, and accessibility integration where appropriate. [Fluent 2](https://fluent2.microsoft.design/) and [Apple's guidelines](https://developer.apple.com/design/human-interface-guidelines) are useful starting points for their platforms.

Design for resizable windows and different display scales. Define a supported minimum size, panel collapse behavior, split-view limits, and intentional scrolling. Test resizing during use, high DPI, large text, maximized windows, and more than one monitor when relevant. Do not assume a fixed screenshot size is the product.

Make keyboard operation a first-class workflow: logical tab order, visible focus, familiar shortcuts, discoverable commands, and appropriate Escape/Enter behavior. Avoid stealing common text-editing shortcuts. Provide menu or visible alternatives for shortcuts and drag-and-drop.

Dense tools benefit from clear table alignment, adjustable panels, bulk actions with explicit scope, contextual details, and meaningful selection states. Density should reduce navigation effort while preserving readable labels and usable targets. Do not replace every table with spacious cards.

Design file-open/save cancellation, permission errors, unsaved work, long tasks, and recovery after interruption. Preserve user data and show progress with cancellation when supported. A desktop mockup must not imply working filesystem or OS integration unless it actually exists.

Verify the primary task with the toolkit's test tools or a real application session. For browser-based desktop shells, check both browser content accessibility and shell-specific behavior. Record what was inspected and which OS integrations remain unverified.
