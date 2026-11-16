# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

Setup: in-place on feature/0026-note-title-date (normal checkout, not main); baseline `node --test` in detached worktree → 0 tests, exit 0. Base check vs develop: no diff.

## Pre-flight scan

| Task(s) | Checked | Found |
| --- | --- | --- |
| Task 1 (self) | RED h0/h1 vs the two Scope items; Ficheros vs Interfaces | coherent: one file, two changes; step-2 change is conditional on RED |

Task 1: Ruling: h0 clean 3/3 at n=3 — the Scope item «Entra, si el RED lo exhibe» (step-2 phrase: no date in the file name) goes out, not written — constitution Art. I (2nd): no guidance without a failing baseline — if wrong: dates get appended in the field and h0 must be rerun with more subjects.
Task 1: Ruling: work in place, no worktree — the RED outputs live untracked in this tree and the user asked to continue here — if wrong: nothing lost, the branch is the feature's.
Task 1: Ruling: RED copy kept in the git-ignored workspace (.temp/sdd/plan/red-copy) — the repo has no other out-of-tree scratch — if wrong: the copy dies with the workspace; git keeps the committed one.
Task 1: GREEN smoke h1 blocked — `claude` on PATH is the no-claude stub ("claude anidado bloqueado en un sujeto") — task NOT complete; edit to step 1 left uncommitted.
