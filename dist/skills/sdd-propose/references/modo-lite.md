## Lite mode — observable predicate, activated by the user

A feature **can** go in lite mode if it meets **all** these conditions:

- The flow to change already exists in the repo and can be read.
- It doesn't change public contracts (API, interfaces another module consumes).
- It doesn't change the data schema. A data-only migration, idempotent and reversible (adding or removing texts or catalog rows), doesn't rule it out, but the spec names it.
- It fits in a single module or area.
- If `.docs/sdd/estimation.md` exists: the estimate is ≤ half a day.

Meeting them **enables** the mode; it does NOT activate it. Propose lite mode in the lane question of `sdd-propose`, **citing one by one the conditions you checked**, and wait for the user's explicit confirmation. Without confirmation, the feature goes in full mode.

In lite: a short `spec.md` (with the estimate block inside), without `plan.md` or `tasks.md`. If the lite changes what is seen, its Approach carries the criterion in measurable sentences and the reference screen, and before presenting the validation you apply [frontend-verification.md](../../sdd-implement/references/frontend-verification.md): on the user's environment if they have it up, with no dedicated build or new spec suite, the `§Frontend` detector in its two viewports and one screenshot per state. You don't present with a detector finding open and unjustified, and the presentation shows its output, or the warning «composición no medida», or «no probado» with its reason. Everything else is identical — the spec's gate, its review, the smoke and the `walkthrough.md` with real time never get cheaper. If a condition falls while implementing, the feature **moves up** to full mode: stop, say so and write the missing `plan.md` with its gate. Never the other way round.
