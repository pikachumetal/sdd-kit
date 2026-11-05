---
name: sdd-verify
description: Use when sdd-implement closes a task or finishes its last one, or sdd-archive reaches its final-review check — before claiming work complete, fixed or passing, and to run the final whole-branch review. Invoked from there; not the entry of a change (that is sdd-propose).
---

<!-- kit: 0312 · sustituye: «Verification Before Completion» -->
# sdd-verify

## Overview

<!-- kit: 0312 -->
Claiming work is complete without verification is dishonesty, not efficiency. Write everything the user reads in the language of their message. Forked from `verification-before-completion` and `requesting-code-review` of superpowers (MIT, see `NOTICE`); the text is the source's, changed only where the kit works differently.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## Common Failures

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Linter clean | Linter output: 0 errors | Partial check, extrapolation |
| Build succeeds | Build command: exit 0 | Linter passing, logs look good |
| Bug fixed | Test original symptom: passes | Code changed, assumed fixed |
| Regression test works | Red-green cycle verified | Test passes once |
| Agent completed | VCS diff shows changes | Agent reports "success" |
| Requirements met | Line-by-line checklist | Tests passing |
<!-- kit: 0312 -->
| Filtered gate passes | Each task of the gate: ran N/M, or skipped with the tool's reason | Exit 0, «Tasks: n completed» |

<!-- kit: 0312 -->
**The `Gate:` line.** A gate that filters (`--affected --base <ref>`, a cache) exits 0 even when it skips tasks, so wherever you record a gate —a config commit, the walkthrough's 4.1, `patch.md` §4, the baseline report— the line names every task: `` Gate: `<comando>` → <tarea>: corrió <N>/<M> · <tarea>: saltada (<porqué>) ``, with `<N>/<M>` its tests in green over its total; a gate without tasks (`node --test`) is one entry: `` Gate: `<comando>` → <N>/<M> ``. The reason for a skip comes from the tool (`moon task <t>`: its inputs against the changed files), not from your reading. A task whose definition the change edits (its `moon.yml`, its script, the gate line of §Testing) runs without the filter before you claim the gate, and that entry replaces its `saltada` one: `<tarea>: corrió <N>/<M> (sin filtro: cambia su definición)`. Never `→ verde`, nor the exit code alone (`tests/affected-gate-red.md`, k6). The commands that ran go before the arrow, each in backticks, separated by ` · `.

<!-- kit: 0312 -->
**Running a gate.** Wherever you run the closing gate —the validation, the close, the config lane, the baseline—, from `operations.md` §Testing (without it, `tech-stack.md` §Testing); after a red, item 3 holds for any gate, the merge's `--verify` too:

<!-- kit: 0312 -->
1. In the validation and the close, a branch that only touches `.docs/` or `*.md` runs nothing. Otherwise each suite of «Suites» with level `unitario` or `pendiente` (a suite without a level counts as `pendiente`) runs whole, with its command, before the gate, unless its command is the gate's or one of the tasks the gate runs.
2. If the branch —or, after `sdd merge --sync`, what the base brought— touches a file of «Sin filtro» (without the field: `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `packages.lock.json`, `poetry.lock`, `uv.lock`, `go.sum`, `Cargo.lock`, `composer.lock`, `Gemfile.lock`, `.moon/**`, `tsconfig*.json`, `Directory.Build.*`, `Directory.Packages.props`, `global.json`, `.prototools`, `vitest.config.*`, `jest.config.*`, `playwright.config.*`, at any depth), the gate runs without `--affected` and every task carries `(sin filtro: cambia el build)`. A project's `moon.yml` is «cambia su definición», not the build.
3. After a red pass at `<sha>`:
   - A fix that only touches `.docs/` or `*.md` reruns only the tests that failed, alone: no gate and no suite, even if a task's inputs include that file. The line starts after the arrow with `tras el rojo en <sha>, arreglo <sha> solo de docs:`.
   - Otherwise, with the project's runner, every test that failed and the red task's tests that never ran (bail, a crashed process; the whole task if the output doesn't tell); then the unit suites of item 1 and the gate with `--base <sha>`, not `--base <merge.into>`, plus the tasks the tool skipped because they depend on the red one, each as `<tarea>: corrió <N>/<M> (no corrió en la pasada roja)`. A fix that touches «Sin filtro» runs everything without the filter. The line starts after the arrow with `tras el rojo en <sha>, arreglo <sha>:`.
   - A red that isn't a test (a build, a typecheck) reruns its task whole.
4. Lint is not part of the gate: a lint red is fixed in its file, the pre-commit checks it, and it reruns no test.

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to commit/push/PR without verification
- Trusting agent success reports
- Relying on partial verification
- Thinking "just this once"
- Tired and wanting work over
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler |
| "Agent said success" | Verify independently |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial proves nothing |
| "Different words so rule doesn't apply" | Spirit over letter |

## Key Patterns

**Tests:**
```
✅ [Run test command] [See: 34/34 pass] "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**
```
✅ Write → Run (pass) → Revert fix → Run (MUST FAIL) → Restore → Run (pass)
❌ "I've written a regression test" (without red-green verification)
```

**Build:**
```
✅ [Run build] [See: exit 0] "Build passes"
❌ "Linter passed" (linter doesn't check compilation)
```

**Requirements:**
```
✅ Re-read plan → Create checklist → Verify each → Report gaps or completion
❌ "Tests pass, phase complete"
```

**Agent delegation:**
```
✅ Agent reports success → Check VCS diff → Verify changes → Report actual state
❌ Trust agent report
```

## When To Apply

**ALWAYS before:**
- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing, PR creation, task completion
- Moving to next task
- Delegating to agents

<!-- kit: 0312 -->
**In the kit, that means:**
- A task's `complete` line: `sdd task done` runs the task's «Verificación» and writes its result; you read that output before the line counts (`sdd-implement`, completion contract).
- The `Revisión final:` line of `tasks.md`, the validation's smoke and the walkthrough: each says only what a command or a reviewer's report you read in this session shows.

**Rule applies to:**
- Exact phrases
- Paraphrases and synonyms
- Implications of success
- ANY communication suggesting completion/correctness
<!-- kit: 0312 -->

<!-- kit: 0312 -->
## Requesting review

<!-- kit: 0312 · de: superpowers skills/requesting-code-review/SKILL.md -->
Dispatch a code reviewer subagent to catch issues before they cascade. The reviewer gets precisely crafted context for evaluation — never your session's history.

<!-- kit: 0312 · de: superpowers skills/requesting-code-review/SKILL.md -->
**Core principle:** Review early, review often.

<!-- kit: 0312 -->
### When to Request Review

<!-- kit: 0312 -->
**Mandatory:**
- After each task in subagent-driven development: the task review of `sdd-implement`, with its own prompt.
- After completing major feature: the final whole-branch review, in axes ([Final review](#final-review)).
- Before the closing merge to the integration branch: the review's single closing. The merge to `main` is always a person's call.

<!-- kit: 0312 · de: superpowers skills/requesting-code-review/SKILL.md -->
**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

<!-- kit: 0312 -->
### How to Request

<!-- kit: 0312 -->
The kit doesn't take `HEAD~1` nor one `general-purpose` reviewer: the package comes from the recipe of [encargo-revision.md](references/encargo-revision.md), and each axis gets its own brief, model and effort ([Final review](#final-review)).

<!-- kit: 0312 -->
### Act on feedback

<!-- kit: 0312 -->
- Re-grade each finding by its effect, then act as [Closing the review](#closing-the-review) says: ONE fix pass for Critical and Important —and Minor with `review.minors: fix`—, other Minors to the ledger.
- Push back if the reviewer is wrong (with reasoning): a finding you don't fix is a `Final: Ruling:` with why the code stands.

<!-- kit: 0312 -->
### Common Rationalizations

<!-- kit: 0312 · de: superpowers skills/requesting-code-review/SKILL.md -->
| Excuse | Reality |
|--------|---------|
| "I'll just review the diff myself instead of dispatching a reviewer" | You're the coordinator — reviewing the diff inline burns the context window you need to keep driving the work. Dispatch a reviewer subagent: the diff and the evaluation live in its context, and only the findings come back to you. |
| "The reviewer needs my whole session history to understand the change" | Hand it precisely crafted context, never your session's history. That keeps the reviewer on the work product, not your thought process. |

<!-- kit: 0312 -->
### Red Flags

<!-- kit: 0312 -->
**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues beyond the one fix pass and the re-review of [Closing the review](#closing-the-review)
- Argue with valid technical feedback

<!-- kit: 0312 · de: superpowers skills/requesting-code-review/SKILL.md -->
**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

<!-- kit: 0312 -->
## Final review

<!-- kit: 0312 -->
**Dispatch it in the background as soon as the last task's commit exists** —in Native, the last task's; in SDD, the squashed one after its clean review—, before starting the app for its «Verificación visual»: while it reviews, you do that check and write the closing drafts of step 7. It works isolated from the moving `HEAD`, in a detached worktree at the sha it reviews (`git worktree add --detach <worktrees parent>/review-<id>-<short sha> <sha>`), with the package built there and the brief telling it not to look at later branches or commits; when it returns, remove it with `git worktree remove`. (`tests/closing-off-critical-path-red.md`, c1)

<!-- kit: 0312 -->
**The axes.** With `mode: spike`, only the Spec axis goes out. Otherwise the review goes out in axes, each with its own brief, model and effort, in parallel: load `sdd-parallel-agents` with `Skill` and dispatch them in the same message, never more at once than `control.maxParallelAgents` of `.docs/sdd/sdd-kit.json` (with 2 and three axes, two go out and the third when one returns). In `delegate`, a `Política de modelos:` line in the approved spec's ✋ that names the axes is the confirmation a user instruction asks before parallelizing: dispatch them without asking again (two of two stopped here: `tests/sdd-propose-0185-green.md`); an Architecture axis you raise isn't in the line: confirm it. Each axis brief carries, inside its block, the header, «Cómo revisar» and the worktree sentence of [encargo-revision.md](references/encargo-revision.md): fill every `<…>`, and use its package recipe —not `sdd review package`—. Every `sdd <verb>` here and in `references/` runs as `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verb>`. What each axis gets:

<!-- kit: 0312 -->
| Axis | Brief | Model | Gets, besides the package |
| --- | --- | --- | --- |
| Spec | [spec-reviewer-prompt.md](references/spec-reviewer-prompt.md) | `sdd-kit:effort-high` + `opus` | the paths of `spec.md` and `plan.md` and, in a spike, of `research.md`; the plan's `## Review Focus`, verbatim, if it has one; the `accepted` ADRs that `sdd decision index --path .docs/sdd --files <the diff's files>` lists; the output of `sdd capability index --path .docs/sdd`; and a pointer to the ledger's `Ruling:`, `minor (deferred)` and `parked` lines |
| Code | [code-reviewer-prompt.md](references/code-reviewer-prompt.md) | `sdd-kit:effort-high` + `sonnet` | «Flujos core», «Retries», «Timeouts» of `operations.md` §Testing, literal, or `sin E2E declarados`; the output of `sdd review comments --base "$MERGE_BASE"`, run in `$REVIEW_DIR`; neither the spec nor the ADRs |
| Architecture | [architecture-reviewer-prompt.md](references/architecture-reviewer-prompt.md) | `sdd-kit:effort-high` + `opus` | the path of `architecture.md` and the plan's `Eje Arquitectura` line, or your ruling that raised it; it goes out only with `sí` |

<!-- kit: 0312 -->
The models are those of the 0131 proposal: an axis changes model only with data of the constitution's Principle 5. Specify model and effort on every dispatch; an omitted model inherits the session's. These are the fresh contexts the whole run buys. Do not skip them, and do not replace them with your own read of the diff.

<!-- kit: 0312 -->
**The architecture axis.** The plan's header carries `Eje Arquitectura: sí — <frontier>` or `no — <reason>`. Before dispatching, check the diff against four signals: a new module, a new dependency in a manifest (`package.json`, `*.csproj`, `go.mod`…), a contract between modules, data. A manifest in the file list is not the check: for each one the diff touches, read `git diff "$MERGE_BASE" HEAD -- <manifest>` (the recipe's merge-base); an added line under its dependencies is a new dependency. Write what you found to the ledger first, also when the plan says `sí` and when you find nothing:

<!-- kit: 0312 -->
```
Final: Eje Arquitectura: <sí | no> en el plan · señales en el diff: <each signal with its file, or «ninguna»> → <sale | no sale>
```

<!-- kit: 0312 -->
If the diff crosses one the plan didn't foresee, the axis goes out and you ledger `Final: Ruling: Eje Arquitectura no → sí — <reason> — <cost if wrong>`; `tasks.md` writes it `Arquitectura opus+high, <verdict> (subido: <reason>)`. Never lower a `sí`. Without the line —lite mode, or a plan written before the kit carried it— decide it at dispatch with the same signals, as a ruling.

<!-- kit: 0312 -->
**Each axis gets its silence watch** (`sdd-implement`, «Every dispatch»). A hung axis is relaunched alone, once, as [Vigía de silencio](../sdd-propose/references/control-profiles.md#vigía-de-silencio) says; the others go on.

<!-- kit: 0312 -->
**Read the reports by axis.** A change can pass one axis and fail another: code that follows every standard can implement the wrong thing, and code that does exactly what the spec asked can break the project's conventions. Keep the reports under one heading per axis, as they came; do not merge or rerank findings across axes, because that is how one axis masks another. Re-grading each finding by its effect happens inside its axis ([Closing the review](#closing-the-review)).

<!-- kit: 0312 -->
**Without a subagent tool:** read each axis brief and perform each review yourself against the package, as separate passes after the last task's ledger line. Write `Final review: self-review (no subagent tool)` to the ledger, and say so in your final message: a self-review by the author is weaker than fresh reviewers, and the user decides whether that is enough before merge.

<!-- kit: 0312 -->
### Example

<!-- kit: 0312 -->
```
[Last task committed: a1b2c3d; plan header: Eje Arquitectura: no — solo la app de reservas]
[Package from the recipe of encargo-revision.md, built in review-0010-a1b2c3d]
[sdd decision index --files <diff files> → 0003 (accepted); sdd capability index → bookings, invoicing]
[sdd-parallel-agents: two dispatches in one message, in the background, each with its silence watch]
  Spec axis (sdd-kit:effort-high + opus): spec and plan paths, Review Focus, ADR 0003, capability index
  Code axis (sdd-kit:effort-high + sonnet): the package
[While they review: the visual check and the closing drafts]

## Spec
Critical · contradicts · src/annul.js:12 · the REMOVED requirement still runs · «Las anulaciones se avisan por correo»
## Code
Minor · possible Feature Envy in cancelledList (src/app.js:36)

[Closing the review: re-grade inside each axis, then ONE fix pass]
```

<!-- kit: 0312 -->
## Closing the review

<!-- kit: 0307 -->
When the axes return, the first thing in this step is to read [references/closing-the-review.md](references/closing-the-review.md) and follow it, before you act on any finding.
