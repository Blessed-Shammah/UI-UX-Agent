# Review like a thoughtful teacher

Assess the work against its audience, task, constraints, and platform. Explain what works and the smallest changes that would make a meaningful difference. A sound interface is a valid outcome: do not invent faults to justify the review or redesign something simply because you would have styled it differently.

## Establish what you can see

Inspect the supplied implementation, screenshots, task flow, and relevant constraints. Exercise the primary journey when tools permit. Describe the reviewed scope and evidence: a screenshot can establish visible hierarchy, not working persistence or keyboard behavior. Source can reveal a missing label without proving a rendered layout. Mark unverified dimensions explicitly.

Do not infer quality from a framework name, a resource ranking, or the absence of a fashionable library. A simple native implementation may already be the most suitable choice.

## Make a proportionate judgment

| Verdict | When to use it | Recommended action |
| --- | --- | --- |
| Keep | Observed work serves the scoped task well; no material defect found | State why it works. No changes recommended within the reviewed scope. |
| Refine | Local defects affect clarity, access, consistency, or feedback | Suggest targeted corrections while retaining the structure and strengths. |
| Rethink | Evidence shows the central flow, information hierarchy, or interaction model obstructs the task | Describe a better flow/composition and a minimal migration path; preserve useful behavior and components. |
| Insufficient evidence | Critical context or artifacts needed for a judgment are missing | Give bounded observations and name the smallest missing check or artifact. Do not manufacture a verdict. |

A minor aesthetic preference is not a defect. Separate taste suggestions from recommendations supported by user impact. Do not promise that any proposed version is objectively the best without comparing it against actual task evidence.

## Inspect before correcting

First identify concrete strengths worth retaining. Then examine task clarity, navigation, hierarchy, content, interaction and recovery, accessibility, responsive/platform behavior, and implementation consistency. Use applicable quality gates, not a universal visual trend checklist.

For each proposed correction give **location → observed issue → user consequence → smallest suitable fix → verification**. For example: “Checkout / email field: the placeholder disappears after entry, so the field loses its visible label. Add a persistent label; verify after typing and at 200% zoom.” Distinguish this source/visual observation from any runtime checks you did not perform.

Prioritize blockers, then recurring friction, then meaningful polish. Usually present at most three priority improvements; disclose any additional critical blockers rather than hiding them to meet a length target. If nothing material needs fixing, leave the improvement list empty. Avoid arbitrary scores, grades, generic praise, and a long inventory of every possible best practice.

## Rethink the implementation only when warranted

Compare keeping the current approach, a targeted repair, and a structural change. Recommend the least disruptive option that solves the demonstrated problem. Consider the existing stack, component reuse, data/state model, migration effort, and regressions. Adding shadcn, Tailark, or another library is not an improvement by itself.

When a structural change is justified, explain the replacement journey or composition in one short paragraph, then identify the first implementation step and an observable acceptance check. Research a different foundation only if the current one cannot reasonably serve the need. State the tradeoff and what must remain intact.

## Concise response contract

Aim for roughly 150–250 words for an ordinary review; be shorter when the work is sound. Use:

1. **Verdict and scope:** Keep, Refine, Rethink, or Insufficient evidence, with one evidence-based sentence.
2. **Keep:** One or two specific strengths to preserve.
3. **Improve:** Zero to three priority corrections with brief reasons and checks. State “No material changes recommended” if appropriate.
4. **Better approach:** Only for a justified structural change; include the first step and tradeoff.
5. **Unverified:** Only the material gaps in evidence.

Be direct, respectful, and explanatory, as a teacher correcting the work rather than judging the person. The review is advisory: do not edit files, install dependencies, replace assets, or start a redesign unless the user requested implementation. If they subsequently ask for corrections, carry the accepted strengths, findings, and acceptance checks into the implementation and recheck the same issues afterward.
