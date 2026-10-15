# Evaluate behavior, not prompt length

The toolkit has deterministic CLI tests. **It has no measured design-quality benchmark results yet.** Use this protocol to establish whether a change helps a particular model and task.

## Controlled comparison

1. Choose a task from [cases.json](cases.json), or submit a representative real brief with private information removed.
2. Run the same model with the same tools, initial repository, time/token budget, and user brief. Compare the current baseline against the proposed instructions. Start each run in a fresh session/workspace.
3. Save actual output, source changes, setup commands, screenshots at matching sizes, test results, and limitations. Record model/version, date, tool access, prompt variant, seed if available, and any follow-up messages. Do not give one variant extra coaching.
4. Ask reviewers to complete the primary task before assessing appearance. If possible, conceal which prompt produced which result and randomize presentation order.
5. Record each blocking failure separately. Score task clarity, completion, visual coherence, appropriate distinctiveness, accessibility, and responsiveness using the anchors in [quality guidance](../skills/ui-ux-agent/references/quality.md). Report disagreements and raw observations.
6. Repeat across products and multiple runs before generalizing. Report sample size, failures, constraints, and uncertainty. A single attractive screenshot cannot establish broad superiority.

Use `templates/delivery.md` for each run's evidence. Keep generated run artifacts outside the repository or in ignored `evals/runs/`; commit only intentional, redacted, rights-cleared evidence. Never publish private task data by default.

## Minimum regression set

Test build, redesign, audit, and review; include a non-web platform, a constrained text-only run, and a sound existing implementation that should not trigger invented corrections. A change must preserve user constraints, avoid fake verification, and avoid unauthorized edits. Native tasks require actual native environments to verify integration; otherwise mark that dimension unverified.

Do not let a model grade itself as the only evidence. Automated checks establish bounded technical properties. Human task observation and rendered review establish different properties. Report both.
