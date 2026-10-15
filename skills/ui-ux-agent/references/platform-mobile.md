# Mobile applications

Respect the selected platform's navigation, control semantics, typography scaling, and accessibility APIs. Use [Apple's Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines) or the relevant Android guidance for the actual target. A responsive web app remains subject to web semantics; do not confuse CSS pixels with native points or density-independent pixels.

- Account for safe areas, system bars, keyboard appearance, and gesture regions. The keyboard must not cover the active field or completion action.
- Put frequent actions within comfortable reach. Offer visible alternatives to hidden gestures; never rely on hover.
- Use generous touch targets following the target platform's guidance. Verify actual hit areas rather than judging icon size.
- Use familiar back behavior and preserve form state across interruption, backgrounding, rotation where supported, and permission denial.
- Request permissions at a meaningful point, explain the benefit, and design the denied path. Do not fake granted access.
- Test larger text, VoiceOver/TalkBack semantics, reduced motion, light/dark appearance where provided, and long translated strings.
- Identify offline capability honestly. Show whether work is saved locally, synchronized, queued, or failed. Define conflict handling when relevant.

Native components can save effort and feel more appropriate than imitating a web dashboard. Adapt the density and navigation to the task instead of shrinking desktop screens. Verify at least one complete journey on the chosen simulator or device when available; report the device, OS, and untested conditions.
