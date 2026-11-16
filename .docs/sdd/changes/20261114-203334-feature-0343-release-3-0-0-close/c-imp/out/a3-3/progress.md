# SDD ledger — plan: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/plan.md

Spec: .docs/sdd/specs/20261014-130000-feature-0026-note-title-date/spec.md (approved, profile delegate). Method: Native (plan `Ejecución: native`).
Baseline: `node --test` in detached worktree at 79481f4 → 0 tests, exit 0 (the project has no test suite; skill tests are smokes per constitution Art. I).

## Pre-flight scan

| Row | Checked | Found |
| --- | --- | --- |
| Task 1 (only task, no shared files with others) | RED tests named (h0, h1) vs spec «Dónde se prueba» (h0 → step 2 sentence, h1 → step 1 warning); files: only `skills/guardar-nota/SKILL.md` | Consistent. «Verificación: node --test» runs 0 tests: it cannot show either smoke green — see ruling below. |
| Plan vs Global Constraints | skill text in English | Consistent. |
| Constitution | two articles numbered «Art. I» | Both agree (smoke per skill edit; guidance only if the baseline exhibits the failure). No conflict for this task. |

## Rulings

Task 1: Ruling: work in place on `feature/0026-note-title-date` (normal checkout, not main), no extra worktree — non-interactive session, the branch already isolates the feature — cost if wrong: none beyond the branch itself.
Task 1: Ruling: the step-2 sentence (Scope «Entra, si el RED lo exhibe») goes out — h0 was clean 3 of 3 (red/h0.txt), and constitution Art. I says guidance whose baseline doesn't exhibit the failure isn't written — cost if wrong: names with an added date would still be possible; re-open with a new smoke that exhibits it.
Task 1: Ruling: the task's «Verificación» `node --test` runs 0 tests, so the task's real gate is smoke h1 in GREEN with a headless subject (spec «Dónde se prueba», constitution Art. I) — cost if wrong: closing on an empty suite would claim a fix nobody watched pass.
Task 1: Ruling: smoke h1 GREEN NOT RUN — nested `claude` is blocked in this session («claude anidado bloqueado en un sujeto: run.mjs no ve su coste») and there is no subagent tool; the guidance edit stays uncommitted and the task stays open (no `complete` line) — cost if wrong: one more round to run the smoke outside this session.

RED copy outside the repo: ../red-copy-0026/h0.txt, h1.txt.
