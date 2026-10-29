---
name: sdd-verify
description: Use when sdd-implement closes a task or finishes its last one, or sdd-archive reaches its final-review check — before claiming work complete, fixed or passing, and to run the final whole-branch review. Invoked from there; not the entry of a change (that is sdd-propose).
---

# sdd-verify

## Overview

Claiming work is complete without verification is dishonesty, not efficiency. Write everything the user reads in the language of their message. Forked from `verification-before-completion` and `requesting-code-review` of superpowers 7.0.0 (MIT, see `NOTICE`); the text is the source's, changed only where the kit works differently.

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
| Filtered gate passes | Each task of the gate: ran N/M, or skipped with the tool's reason | Exit 0, «Tasks: n completed» |

**The `Gate:` line.** A gate that filters (`--affected --base <ref>`, a cache) exits 0 even when it skips tasks, so wherever you record a gate —a config commit, the walkthrough's 4.1, `patch.md` §4, the baseline report— the line names every task: `` Gate: `<comando>` → <tarea>: corrió <N>/<M> · <tarea>: saltada (<porqué>) ``, with `<N>/<M>` its tests in green over its total; a gate without tasks (`node --test`) is one entry: `` Gate: `<comando>` → <N>/<M> ``. The reason for a skip comes from the tool (`moon task <t>`: its inputs against the changed files), not from your reading. A task whose definition the change edits (its `moon.yml`, its script, the gate line of §Testing) runs without the filter before you claim the gate, and that entry replaces its `saltada` one: `<tarea>: corrió <N>/<M> (sin filtro: cambia su definición)`. Never `→ verde`, nor the exit code alone (`tests/affected-gate-red.md`, k6). The commands that ran go before the arrow, each in backticks, separated by ` · `.

**Running a gate.** Wherever you run the closing gate —the validation, the close, the config lane, the baseline—, from `operations.md` §Testing (without it, `tech-stack.md` §Testing):

1. Each suite of «Suites» with nivel `unitario` or `pendiente` runs whole, with its command, before the gate.
2. If the branch —or, after `sdd merge --sync`, what the base brought— touches a file of «Sin filtro» (without the field: `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, their lockfiles, `.moon/**`, `tsconfig*.json`, `Directory.Build.*`, `Directory.Packages.props`, `global.json`, `.prototools`, `vitest.config.*`, `jest.config.*`, `playwright.config.*`, at any depth), the gate runs without `--affected` and each task carries `(sin filtro: cambia el build)`. A project's `moon.yml` is «cambia su definición», not the build.
3. After a red pass at `<sha>`, a fix that only touches `.docs/` or `*.md` reruns only the tests that failed, alone: no gate and no suite, even if a task's inputs include that file. Otherwise the next pass runs, with the project's runner, every test that failed and the red task's tests that never ran (bail, a crashed process; the whole task if the output doesn't tell), then the gate with `--base <sha>` instead of `--base <merge.into>`, plus the tasks the tool skipped because they depend on the red one, each with `(no corrió en la pasada roja)`. The unit suites of item 1 run whole again. A red that isn't a test (a build, a typecheck) reruns its task whole. A fix that touches «Sin filtro» runs everything without the filter. The line starts after the arrow with `tras el rojo en <sha>, arreglo <sha>:`, or `tras el rojo en <sha>, arreglo <sha> solo de docs:`.
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

**In the kit, that means:**
- A task's `complete` line: `sdd task done` runs the task's «Verificación» and writes its result; you read that output before the line counts (`sdd-implement`, completion contract).
- The `Revisión final:` line of `tasks.md`, the validation's smoke and the walkthrough: each says only what a command or a reviewer's report you read in this session shows.

**Rule applies to:**
- Exact phrases
- Paraphrases and synonyms
- Implications of success
- ANY communication suggesting completion/correctness

## Requesting review

Dispatch a code reviewer subagent to catch issues before they cascade. The reviewer gets precisely crafted context for evaluation — never your session's history.

**Core principle:** Review early, review often.

### When to Request Review

**Mandatory:**
- After each task in subagent-driven development: the task review of `sdd-implement`, with its own prompt.
- After completing major feature: the final whole-branch review, in axes ([Final review](#final-review)).
- Before the closing merge to the integration branch: the review's single closing. The merge to `main` is always a person's call.

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

### How to Request

The kit doesn't take `HEAD~1` nor one `general-purpose` reviewer: the package comes from the recipe of [encargo-revision.md](references/encargo-revision.md), and each axis gets its own brief, model and effort ([Final review](#final-review)).

### Act on feedback

- Re-grade each finding by its effect, then act as [Closing the review](#closing-the-review) says: ONE fix pass for Critical and Important —and Minor with `review.minors: fix`—, other Minors to the ledger.
- Push back if the reviewer is wrong (with reasoning): a finding you don't fix is a `Final: Ruling:` with why the code stands.

### Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll just review the diff myself instead of dispatching a reviewer" | You're the coordinator — reviewing the diff inline burns the context window you need to keep driving the work. Dispatch a reviewer subagent: the diff and the evaluation live in its context, and only the findings come back to you. |
| "The reviewer needs my whole session history to understand the change" | Hand it precisely crafted context, never your session's history. That keeps the reviewer on the work product, not your thought process. |

### Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues beyond the one fix pass and the re-review of [Closing the review](#closing-the-review)
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification

## Final review

**Dispatch it in the background as soon as the last task's commit exists** —in Native, the last task's; in SDD, the squashed one after its clean review—, before starting the app for its «Verificación visual»: while it reviews, you do that check and write the closing drafts of step 7. It works isolated from the moving `HEAD`, in a detached worktree at the sha it reviews (`git worktree add --detach <worktrees parent>/review-<id>-<short sha> <sha>`), with the package built there and the brief telling it not to look at later branches or commits; when it returns, remove it with `git worktree remove`. (`tests/closing-off-critical-path-red.md`, c1)

**The axes.** The review goes out in axes, each with its own brief, model and effort, in parallel: load `sdd-parallel-agents` with `Skill` and dispatch them in the same message, never more at once than `control.maxParallelAgents` of `.docs/sdd/sdd-kit.json` (with 2 and three axes, two go out and the third when one returns). In `delegate`, a `Política de modelos:` line in the approved spec's ✋ that names the axes is the confirmation a user instruction asks before parallelizing: dispatch them without asking again (two of two stopped here: `tests/sdd-propose-0185-green.md`); an Architecture axis you raise isn't in the line: confirm it. Each axis brief carries, inside its block, the header, «Cómo revisar» and the worktree sentence of [encargo-revision.md](references/encargo-revision.md): fill every `<…>`, and use its package recipe —not `sdd review package`—. Every `sdd <verb>` here and in `references/` runs as `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verb>`. What each axis gets:

| Axis | Brief | Model | Gets, besides the package |
| --- | --- | --- | --- |
| Spec | [spec-reviewer-prompt.md](references/spec-reviewer-prompt.md) | `sdd-kit:effort-high` + `opus` | the paths of `spec.md` and `plan.md`; the plan's `## Review Focus`, verbatim, if it has one; the `accepted` ADRs that `sdd decision index --path .docs/sdd --files <the diff's files>` lists; the output of `sdd capability index --path .docs/sdd`; and a pointer to the ledger's `Ruling:`, `minor (deferred)` and `parked` lines |
| Code | [code-reviewer-prompt.md](references/code-reviewer-prompt.md) | `sdd-kit:effort-high` + `sonnet` | «Flujos core», «Retries», «Timeouts» of `operations.md` §Testing, literal, or `sin E2E declarados`; neither the spec nor the ADRs |
| Architecture | [architecture-reviewer-prompt.md](references/architecture-reviewer-prompt.md) | `sdd-kit:effort-high` + `opus` | the path of `architecture.md` and the plan's `Eje Arquitectura` line, or your ruling that raised it; it goes out only with `sí` |

The models are those of the 0131 proposal: an axis changes model only with data of the constitution's Principle 5. Specify model and effort on every dispatch; an omitted model inherits the session's. These are the fresh contexts the whole run buys. Do not skip them, and do not replace them with your own read of the diff.

**The architecture axis.** The plan's header carries `Eje Arquitectura: sí — <frontier>` or `no — <reason>`. Before dispatching, check the diff against four signals: a new module, a new dependency in a manifest (`package.json`, `*.csproj`, `go.mod`…), a contract between modules, data. A manifest in the file list is not the check: for each one the diff touches, read `git diff "$MERGE_BASE" HEAD -- <manifest>` (the recipe's merge-base); an added line under its dependencies is a new dependency. Write what you found to the ledger first, also when the plan says `sí` and when you find nothing:

```
Final: Eje Arquitectura: <sí | no> en el plan · señales en el diff: <each signal with its file, or «ninguna»> → <sale | no sale>
```

If the diff crosses one the plan didn't foresee, the axis goes out and you ledger `Final: Ruling: Eje Arquitectura no → sí — <reason> — <cost if wrong>`; `tasks.md` writes it `Arquitectura opus+high, <verdict> (subido: <reason>)`. Never lower a `sí`. Without the line —lite mode, or a plan written before the kit carried it— decide it at dispatch with the same signals, as a ruling.

**Each axis gets its silence watch** (`sdd-implement`, «Every dispatch»). A hung axis is relaunched alone, once, as [Vigía de silencio](../sdd-start-feature/references/control-profiles.md#vigía-de-silencio) says; the others go on.

**Read the reports by axis.** A change can pass one axis and fail another: code that follows every standard can implement the wrong thing, and code that does exactly what the spec asked can break the project's conventions. Keep the reports under one heading per axis, as they came; do not merge or rerank findings across axes, because that is how one axis masks another. Re-grading each finding by its effect happens inside its axis ([Closing the review](#closing-the-review)).

**Without a subagent tool:** read each axis brief and perform each review yourself against the package, as separate passes after the last task's ledger line. Write `Final review: self-review (no subagent tool)` to the ledger, and say so in your final message: a self-review by the author is weaker than fresh reviewers, and the user decides whether that is enough before merge.

### Example

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

## Closing the review

**Sort the findings before you act on any of them.** The reviewer's severity labels are advice; the gate is yours. Its «Declined to judge» list is yours too: every line there is a ruling you make and ledger, exactly like a plan conflict — `Final: Ruling: <behavior the reviewer set aside> — <what a reasonable person using this software gets, and why that stands or why it is now a finding> — <cost if wrong>`. Re-grade first, inside each axis, by effect: the spec is a vision document, and a finding's grade is what a reasonable person using this software gets if it ships, not whether the spec names the input that triggers it — a reviewer who set a finding at Minor because the spec was silent has graded the spec, not the effect. Then:

- **Critical and Important** enter the fix pass.
- A **«no verificado»**: verify it yourself before the validation, or adjudicate it with `Final: Ruling:`.
- **Minor**, with `"review": {"minors": "fix"}` in `sdd-kit.json`, enters the fix pass with them, without asking; in Native its ledger line is `Final: fixed <finding> — <test> RED→GREEN, suite <N>/<N>`, or `Final: fixed <finding> — suite <N>/<N>` when no test can reproduce it (a name, a wording). Any other value, or no key, it goes to the ledger as `Final: minor (deferred): <one-liner>` and to your final message under «Deferred minors»: deferred Minors never enter the fix pass, and never become rulings — a ruling is a decision about a conflict, not a note that you declined a polish suggestion.

**Native:** fix the Critical and Important findings of every axis, and the Minor ones with `review.minors: fix`, yourself — you are the implementer here — in ONE pass. Each fix is verified by TDD: write the test that reproduces the finding, watch it fail, make it pass, then run the whole suite. Record each in the ledger as `Final: fixed <finding> — <test name> RED→GREEN, suite <N>/<N>`. A fix without a test that failed first is not verified, except a Minor no test reproduces; a suite that is not green after the pass means the pass is not over. A finding you decide not to fix is a ruling — `Final: Ruling: <finding> — <why the code stands> — <cost if wrong>` — and reaches the user in the rulings list. There is no second fix pass.

**SDD:** if the final review returns findings, dispatch ONE fix subagent with the complete findings list of every axis — not one fixer per finding. Per-finding fixers each rebuild context and re-run suites; a real session's final-review fix wave cost more than all its tasks combined. Its scoped re-review is the single re-review below: don't dispatch another for the fix wave. There is no second fix wave.

In both, the reproduce-before-fixing rule of the fix loop applies.

**The single re-review.** Right before you present the validation —with `validation.mode: field`, before you go on to the closing— dispatch ONE re-review in the background, with its silence watch: `sdd-kit:effort-high` + `opus`; the header of [encargo-revision.md](references/encargo-revision.md) and [re-review-prompt.md](../sdd-implement/references/re-review-prompt.md), filled with the open findings of every axis and the «What to Check» of the axes that went out; over `sdd review package <plan> <last reviewed> HEAD`, in its own detached worktree at `HEAD`. It covers the fix pass and every later commit of yours. Write `Re-revisión: <last reviewed>..<head>, sdd-kit:effort-high + opus, <verdict>` in `tasks.md`. A `Re-revisión:` line already in `tasks.md` means it went out: never dispatch another. If, since the last reviewed sha, you only have commits you review in the thread (`sdd-implement`, «Every commit of yours»), don't dispatch it.

**What it leaves open:**

- An Important or a Minor: adjudicate it with `Final: Ruling: <finding> — <why it stands or waits> — <cost if wrong>`, and it reaches ✋ in the validation's presentation and in the walkthrough. No second fix pass, no second re-review.
- **A Critical is never adjudicated.** Fix it yourself: the test that reproduces it fails first, then the whole suite. It reaches ✋ as `sin revisar: <sha> — <what it fixes>`. If fixing it changes the spec, it is a deviation: stop (`sdd-implement`, «Deviations and rulings»).

**A re-review never opens another.** A commit after it —a fix the validation asked for— is reviewed in the thread if `sdd-implement`'s «Every commit of yours» allows it (`revisado en el hilo: <sha> · <files> · <n> líneas`); any other goes to ✋ as `sin revisar: <sha> — <what it changes>`, in any profile and with any `validation.mode`. If no re-review went out yet (a clean review, no fixes), that commit opens it, and it is the only one. While a `sin revisar` or a «no verificado» is unresolved, neither the `Validación en campo:` line nor the walkthrough says the review was clean: they say how many are left («…, 1 sin revisar»).

| Excuse | Reality |
| --- | --- |
| "The commit after the re-review isn't covered: it needs its own re-review" | That is how a feature chained three re-reviews. It goes to ✋ as `sin revisar`; a re-review never opens another. |
| "This re-review is small: a cheap model is enough" | The single re-review is the closing's only fresh eyes on the fix pass: `sdd-kit:effort-high` + `opus`. |

**The last reviewed sha** is the second sha of the `Re-revisión:` line; without one, the `sobre` of `Revisión final:`; and if the line says «juntada en el cierre», the closing commit. A `Revisión final:` line in the 2.x format (`Revisión final: sdd-kit:effort-high + opus, <verdict>, sobre <sha>`, without axes) counts as the final review, and the range starts at its `sobre`, with the fix pass inside, as in the single closing.

**`tasks.md`.** When the axes return, write `Revisión final: Spec opus+high, <verdict> · Código sonnet+high, <verdict> · Arquitectura <opus+high, <verdict> | no (plan)>, sobre <sha corto>`, with the `HEAD` they reviewed (without `tasks.md`, in the validation's presentation). A raised axis reads `Arquitectura opus+high, <verdict> (subido: <reason>)`, and a check an axis couldn't make adds `, <n> sin verificar` to its verdict. After the fix pass, `Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN`. At most one `Re-revisión:` line.