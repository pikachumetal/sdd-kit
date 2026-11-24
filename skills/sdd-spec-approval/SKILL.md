---
name: sdd-spec-approval
description: Use when sdd-spec-writing hands off a written spec.md, or sdd-propose resumes an unapproved one, to run its coherence pass and review, take it through its approval gate and hand it off. Invoked from there; not the entry of a change (that is sdd-propose).
---

# sdd-spec-approval

## Overview

<!-- kit: incluye user-language -->

<!-- kit: incluye phase-notice -->

`spec.md` is written. This skill checks it, has it reviewed and gets it approved, in this order: the coherence pass, the review, the gate, the hand-off. In full and lite, all four; a spike has no delta or Scope to review, so it goes straight to the gate.

## 1. Coherence pass

Its message opens with the phase notice. Before the review and before the gate: go through `spec.md` in four checks (placeholders, contradictions, scope, ambiguity), checking each literal that appears in more than one place —an expression, a file, a threshold— against the decisions and scenarios that use it. If you change a literal, search and change all its occurrences in the spec.

**Each `MODIFIED`.** Search outside the spec, in the code or in the texts that apply it (in a skills kit, in `skills/`), where what changes is implemented —the literal and the function or step that applies it— and list in the Scope each file that implements it, or say in its line why it stays out: a requirement can have more than one entry, and reading only the file the Scope already names doesn't find it.

**What is retired or changes form.** What the spec retires or changes in form or place —a template literal too: a label, a heading, a fixed line— and the id of each roadmap row it implements are not `MODIFIED`s: search each name and each id in the whole repo with `git grep`, outside the evidence folders (`.docs/sdd/changes/`, `.docs/sdd/field-reports/` and, in a skills kit, `tests/*.md`), with each form of the literal (the string and its bare value), and run each real case the spec cites (a file:line, a sha) against the THEN that should catch it, and each count of a check it fixes against what running it gives, on today's text or on a copy with the change made; one that can't run before the gate goes to ✋ as `sin medir`. «Lo que se retira o cambia de forma» gets one row per hit, with its destination, and a THEN or a count that doesn't hold changes or is flagged. For anything retired with numbered steps, also `git grep -niE "(pasos?|steps?) <n>\b" -- .docs/sdd/capabilities/`: each bare hit goes in that table.

**The delta on a copy.** Test the delta on a copy of `.docs/sdd` in a temp folder outside the repo: run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability merge --path <copy> --artifact <spec.md>`, fix in the spec what it rejects, and write its result line in ✋; the repo's `capabilities/` doesn't change.

**In `delegate`, ✋ carries the `Política de modelos:` line.** Say what you correct in «Decisiones que he tomado yo». The reviewers read the spec after this pass, not instead of it.

## 2. The review

With its phase notice, invoke `sdd-spec-review` with `Skill` and apply its rubric: it decides how many reviewers, and the reviewer's brief is there. Fold its findings in as its §4 says: with a Crítico accepted or the central decision rewritten, its second round goes before the gate, also when the review came back before this skill. Deciding without invoking it is the failure.

## 3. The approval gate

Nothing gets built until the user approves `spec.md` at its gate, per the current profile ([gate table](../sdd-propose/references/control-profiles.md)): in `pair` and `delegate` present the spec **starting with its 🦆 (from `sdd-rubber-duck` in short mode, also under the title of `spec.md`) and with «✋ Decisiones que he tomado yo — valida estas»** — and WAIT for the user's explicit approval. The gate question, in prose, ends the turn, with fixed numbered options: «Apruebo (Recomendada)» first, «Cambios»; an option that approves or a «sí» counts as approval. In `delegate`, a third option, not the recommended one, is the stop before Task 1 that `sdd-propose`'s announcement offers, under the same conditions and with the same reason, saying how many tasks it foresees («prevé <n> tasks»); if they choose it, `sdd-plan-writing` writes the plan, puts the opening in its commit and, with Native, stops as that announcement says; with SDD, it goes on. Choosing a scope («just validate X») or answering another question of the turn doesn't approve: the spec stays ON HOLD, even in `delegate`. In `unattended` the agent approves it, with the decisions recorded in that same block, and continues.

If the user chose or said at the start the phrase that approves the spec by delegation, don't stop either: approve it yourself, record their literal phrase and the date in «Decisiones tomadas con el dev-lead» and in «Aprobaciones», decide the spec review yourself without asking, record it and continue. The rest of the profile's stops stay the same, and so does the validation of `sdd-validate`, which `validation.mode: field` does in the field.

## 4. Hand-off

After the spec is approved, with the phase notice: in full and spike, invoke `sdd-plan-writing` with `Skill` in the same turn; in lite, `sdd-implement`, which reads `mode` and `profile` from the frontmatter of `spec.md` and the branch. ⛔ Approved —by the user or by delegation— the turn doesn't end before that invocation: presenting the spec again, or asking for «sigue», is a stop the profile doesn't have.

## Red flags — STOP and go back to the gate

- You're about to present the gate without the coherence pass, or without invoking `sdd-spec-review` in full or lite.
- The spec is approved in full or spike and you're about to write `plan.md` without invoking `sdd-plan-writing`.

| Rationalization | Reality |
| --- | --- |
| "The reviewers will read it, so the coherence pass can wait" | The pass is yours and goes before dispatching them: a spec approved with a THEN that contradicted its decision cost an amendment and a dev-lead stop. |
| "The user won't answer; I'll continue and document it" | An unapproved spec isn't a contract. The task WAITS at the gate; your last message presents the spec and asks for approval. |
| "In `delegate` the user no longer repeats the gate; from approval on the agent works alone" | Choosing a scope isn't approving. The approval question is explicit and goes alone: without a «sí» or an «apruebo», the spec stays ON HOLD even if the profile is `delegate`. |
