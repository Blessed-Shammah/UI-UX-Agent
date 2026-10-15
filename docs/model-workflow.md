# Working across different LLMs

## Match the workflow to capabilities

| Available capability | What the agent can responsibly deliver |
| --- | --- |
| Text only | Product contract, specifications, code, and manual test plan |
| Images as input | Visual reference analysis and screenshot critique; not interaction verification |
| Files and execution | Project-aware implementation and actual build/test evidence |
| Browser or app control | Rendered review and exercised journeys on observed surfaces |
| Internet browsing | Current resource discovery and source/license inspection |
| Image generation | Optional art assets, still requiring review and rights considerations |

No single capability proves the others. A model that can describe a screenshot may not be able to operate the app. A successful build does not demonstrate good typography or keyboard usability. The composer does not call an LLM or add tools to one.

## Make context useful

Give the agent the brief, relevant source files, current design contract, and observed failures. Load platform-specific guidance rather than every platform manual. For smaller context budgets use `--compact`, one representative journey, and a focused role. Compact mode intentionally omits the detailed reference chapters; the platform and quality guidance remain included.

Keep decisions in a short artifact: audience, task, selected direction, tokens, accepted behavior, unresolved assumptions, and next check. Update it when decisions change. In a new session, supply this artifact and relevant code, rather than asking the model to infer decisions from a long transcript.

Specific acceptance criteria and source material improve the task specification, but do not create missing knowledge, tools, or judgment. Request concise decisions and evidence, not an elaborate hidden reasoning transcript. Self-critique is useful as a pass; it is not an independent reviewer or a substitute for execution.

## Efficient iteration

Separate visual diagnosis from repair: inspect the result, identify the defect and user impact, propose a specific change, implement, and verify. Preserve a successful direction instead of sampling a new style every turn. Change the foundation when evidence suggests the current one is a poor fit.

For paid tools, agree on any meaningful resource budget in the host's normal way. This toolkit imposes no API subscriptions. If browsing or generation is unavailable, use supplied references, existing assets, semantic HTML/native controls, and code-native visuals. Label the limitation without inventing research.

## Evidence and limitations

The [Lost in the Middle paper](https://arxiv.org/abs/2307.03172) reports position-related context-use failures in its evaluated models and tasks. It supports caution about dumping long context, not a claim that every contemporary model fails identically or that compact prompts always win.

[Anthropic's agent engineering guidance](https://www.anthropic.com/engineering/building-effective-agents) distinguishes structured workflows from autonomous agents and favors appropriate simplicity. Our sequential roles and explicit checks are an application of that idea, not evidence of improved UI quality.

This repository's design workflow is an authored synthesis. It needs real comparative evaluation across products and models. See [the evaluation protocol](../evals/README.md); do not advertise unmeasured improvements or guaranteed one-shot results.
