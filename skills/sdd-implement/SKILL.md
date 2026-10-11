---
name: sdd-implement
description: Use when sdd-start-feature reaches its implementation step with an approved spec (and plan, in full mode), to implement it task by task, in this session (Native) or with a subagent per task (SDD). Invoked from that step; not the entry of a change (that is sdd-propose).
---

# sdd-implement

## Overview

Execute the approved plan, task by task, and leave a record that survives your own forgetting. Write everything the user reads in the language of their message. Forked from `executing-plans` and `subagent-driven-development` of superpowers 7.0.0 (MIT, see `NOTICE`).

**Core principle:** the plan already did the thinking. Execute it exactly, prove each step with a test you watched fail and then pass, and keep the ledger: it is your memory after compaction.

**Your first message after loading this skill**, new run or resumed, carries under its phase notice the line `Workspace del plan: <ruta> — …` of [Setup](#setup), step 2. Saying «preparo el workspace» or «leo el ledger» isn't it.

**Narration:** between tool calls, at most one short line; the ledger and the tool results carry the record. The phase notice of `sdd-start-feature` still opens each change of step.

**Continuous execution:** don't ask «should I continue?» between tasks. Only these stop you: an irreversible or destructive operation; a security-sensitive action; a side effect outside this worktree that norms say you ask first (a merge, a push to a shared branch, a publish); a plan so broken that every path forward is a guess; and the kit's own stops, which are a fifth class, not an exception to the four: a **deviation** from the approved spec, a **scope brake** and, in `pair`, the stop after each task ([Deviations and rulings](#deviations-and-rulings)).

## Method

The plan's `Ejecución` line decides, for the whole plan. With `execution: auto` its reason weighs four factors by name, with no numeric threshold: how much the tasks depend on each other's interfaces, how many there are, what an error reaching the branch costs, and whether the plan fits one context. In lite mode, without a plan, `spec.md` is the plan: the method is `execution` if `sdd-kit.json` fixes it, and Native with `auto`.

- **Native**: you implement every task in this session, with the ledger; one fresh reviewer at the end. The cheapest: a fully specified plan makes it transcription plus testing, and a mid-tier session (Sonnet, effort medium) runs it well.
- **SDD** (`Ejecución: subagent`): a fresh implementer subagent per task and a task review after each, then the final review. Costs a fresh context per task and per review. Use it when a review gate per task is wanted, or when the plan is long enough that its later tasks would run on a compacted context.

Both share the workspace, the ledger and its format: a plan can change method mid-flight and the new one resumes from the same ledger. After a compaction in Native with two or more tasks without their `complete` line, the rest goes on with SDD over the same ledger, without stopping in `delegate` or `unattended`; with one task left, Native goes on. Ledger it every time, with either outcome: `Task <N>: Ruling: compactación — sigo con <Native | SDD> — quedan <k> tasks` (with one, `queda 1 task`; the task you were on counts); the walkthrough's `Compactación:` line comes from it. After compaction you reread the plan and the ledger, not this skill.

## Setup

1. **Worktree**: work in an isolated one — use `superpowers:using-git-worktrees` to create one or verify the existing one. Never implement on `main` without the user's explicit consent. *(if `.docs/sdd/environments.md` exists)* After creating the worktree, run `env:setup`, and every implementer brief says where the `.sdd-env.json` marker is: (`tests/entorno-worktree-red.md`, F1).
2. **Workspace**: each plan owns one. Run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" workspace <plan>`; it prints the plan's git-ignored directory, home to every artifact of THIS plan: ledger, briefs, reports, review packages. Another plan's directory is never yours. **Your next message to the user**, right under its phase notice, carries this line, also when you resume: `Workspace del plan: <ruta> — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia` (resuming, add `· retomo en la Task <N>`). «Preparo el workspace» isn't it (`tests/sdd-implement-red.md`, `tests/sdd-implement-green.md`). The `sdd <verb>` of this skill (`workspace`, `task start|done|brief`, `review package`, `ledger rulings`) runs the same way, from any shell.
3. **Ledger**: `<workspace>/progress.md`. If its first line names your plan, tasks with a `Task <N>: complete` line are DONE — don't redo or re-dispatch them; resume at the first task without one. A task whose last line is a fix round is mid-loop: resume at the next round. A ledger naming another plan is someone else's: leave it and start your own, with the identity line `# SDD ledger — plan: <plan path>`. After compaction, trust the ledger and `git log` over your recollection; `git clean -fdx` destroys the workspace, and then you recover from `git log`. `tasks.md` doesn't replace the ledger: after a compaction it's the ledger that says what's done (`tests/native-adapt-red.md`).
4. **Read** the plan once, its context and Global Constraints, and the spec: the spec is the authority the plan argues from. A plan without a reachable spec gets a ledger note: rulings made without one are provisional. One todo per task. With more than one task, `tasks.md` is the **living record** (status and commit hash per task); the harness todo list is ephemeral.
5. **TDD**: load `sdd-tdd` with `Skill` before Task 1. It governs every step of every task you implement; a plan whose steps already say «write the failing test first» doesn't exempt you. In Native, read once the `## Quality decalogue` of [implementer-prompt.md](references/implementer-prompt.md): it governs the code you write, under the project's quality article.
6. **Pre-flight scan**, before Task 1, written to the ledger as a table: one row per pair of tasks sharing a file or an interface (what one produces against what the other consumes, and what you found), one row per task (do its tests and its code agree; do the files it creates match the ones it later touches), and what the plan mandates that the review rubric calls a defect (a test that asserts nothing, verbatim duplication). «The scan is clean» without the rows is not a scan. Rule on each finding, with the spec as the binding authority, and record the ruling beside its row.
7. **Effort**: before the first dispatch of the feature —the implementer in SDD, the final reviewer in Native— check that the `sdd-kit:effort-<level>` type is among the session's agents. If not, say so before dispatching, dispatch with the `model` and the phrase «effort: no disponible en este harness, hereda el de la sesión», and record it as a ruling.

## Before each task

Every task, the second and later ones too, in both methods:

1. **Check the base first**, with or without a remote: `git diff $(git merge-base HEAD <integration>) <integration> -- .docs/sdd/roadmap.md`, with `<integration>` `develop` or the one the constitution fixes (with a remote, `git fetch` first and compare `origin/<integration>` too). Without a remote the base moves anyway: another worktree commits to the local branch. If the feature's row is in the diff, it's a scope brake: don't start or dispatch, and follow its row in the [gate table](../sdd-start-feature/references/control-profiles.md). Then cross `git diff --name-only $(git merge-base HEAD <integration>) <integration>` with the task's «Crear» and «Modificar» files: a match is the same brake, because another feature already changed what this one will touch.
2. **The RED tests are the thread's**: with the opening already in its commit, you write the tests that encode the task's scenarios —one per THEN and one per Review Focus line that names the task— in RED by compilation or by failure, without committing them: they go in the task's commit. Keep a copy outside the repo to compare later: it's the only proof the test wasn't fitted to the code (`tests/tests-red-hilo-red.md`).

## Native loop

1. **Take the task**: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" task start <plan> <n>` prints the brief path and BASE, the commit the range is cut from. Read the brief every time: what you remember is a summary. Then the base check and the RED tests of [Before each task](#before-each-task).
2. **Work the steps** in the plan's RED-GREEN order, under TDD. Watching the test fail is a step; a test that passes before the implementation exists is a finding about the test. Every step with a command has an `Expected:`: run it, read the output, compare. Matches → next step. The code is wrong → `sdd-debugging`: find the cause, never patch the symptom. The plan is wrong (a step contradicts the spec, an interface doesn't match, a command can't work) → rule the smallest change that satisfies the spec, ledger `Task <N>: Ruling: <finding> — <what you decided and why>`, and go on. Send long test output to a file in the workspace and read its tail; append to the ledger in the same call as the commit.
3. **Completion contract**, with evidence from this session, not from the diff looking right: every test the brief names exists, ran in this task and you read its output; every `Expected:` was compared with real output; every deviation from the brief has its `Ruling:` line; and the final run is `sdd task done`, below. If one is missing, the task isn't complete.
4. **Close, in this order**: compare the RED copy with the committed test using `git diff --no-index` — a change that isn't formatting is a ruling in the ledger; commit the task; check the commit exists — if `HEAD` is still at the task's base, the pre-commit rejected it: read its message and fix the cause before committing again, because the task's «Verificación» is narrower than the hook and `sdd task done` would pass anyway (`tests/closing-verification-red.md`); then, in its own call, `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" task done <plan> <n> <base> -- <command…>` with the command of the task's «Verificación». It records the task even if the command prints nothing, and writes `HEAD` in the ledger line. The command must exit non-zero on failure: with Pester, `-CI`, or `Invoke-Pester` exits 0 with a red test (`tests/task-done-exit-code-red.md`). A failing run records nothing. (`tests/native-adapt-red.md`)

| Excuse | Reality |
| --- | --- |
| "I remember what Task N says" | You remember a summary; the brief has the exact values. |
| "The plan's code is right, skip watching the test fail" | A test you never saw fail proves nothing. It is one step. Run it. |
| "I'll run the full suite at the end instead of per step" | Per-step runs tell you which step broke it; the end-of-task run is the contract. |
| "The plan is wrong here, I'll just do the right thing" | Do it and ledger the ruling: unledgered, it's a decision made in secret. |
| "I'll write the ledger lines after a few tasks" | Compaction doesn't wait. One line per task, with the commit. |
| "Let me check in before the next task" | Native was chosen to spend less. Only the stops of the Overview stop you. |
| "I read my own diff carefully; the final reviewer is redundant" | Same author, same blind spots: the reviewer is the only fresh context. |
| "Tests should pass, the change was trivial" | «Should» is not evidence: the contract asks for the command and its output. |
| "Subagents are slow and expensive, I'll skip the final review too" | One review of the whole branch is the floor. |
| "The reviewer said Minor, so it's Minor" | The label graded the spec's silence; grade what the person gets. |
| "The fix is obvious, no need for a failing test first" | The failing test is the only proof the finding was real and is gone. |
| "I'll fix the minors too while I'm in there" | Nobody asked for them: ledger them, the user decides. |

## SDD loop

**Models**: declare model and effort on every dispatch: omitted, both inherit the session's. The effort travels in the agent type (`sdd-kit:effort-low`, `-medium`, `-high`) next to `model`. Mid-tier is the floor for reviewers and for implementers working from prose; the cheapest tier only when the task's text already holds the code to write, or for a single-file mechanical fix: turns cost more than tokens. Design judgment or broad codebase understanding → the most capable model. Fix rounds 4-5 → one tier above the implementer that got stuck. `fable` and `opus xhigh` are forbidden by default, unless the task justifies it in writing.

**Batch small same-shape work**: tasks that are each the same small edit across files go to ONE implementer, reviewed as one unit.

**Hand artifacts over as files**: what you paste into a dispatch stays in your context.

**Never dispatch two implementers at once.**

### 1. Dispatch the implementer

- Record BASE (`git rev-parse HEAD`).
- `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" task brief <plan> <n>` extracts the task's text to a file and prints its path. Never make a subagent read the whole plan.
- The dispatch is [implementer-prompt.md](references/implementer-prompt.md), filled, every section kept: the plan's «De código» block, literal, as first section (in lite mode, the constitution's code-quality article); the `## Quality decalogue`, as is; the RED tests' path as contract; the task's «Verificación» commands, not the full suite; one line on where the task fits; interfaces and decisions from earlier tasks the brief can't know; your resolution of any ambiguity; the report file (the brief's path with `-report.md`). No history of earlier tasks. If an earlier task parked a finding in this area, a pointer to its ledger entry. (`tests/gates-reviews-red.md`, E3) The «De proceso» block (model policy, method) you apply: it doesn't travel.
- The implementer never dispatches subagents — not helpers, never a reviewer.
- Record the implementer's agent id: fix rounds 1-3 resume it.
- **Slow verification**: if the task has «Verificación lenta», the implementer doesn't run it: you launch it in the background as soon as it reports, while the task review runs. Dispatch the next task meanwhile only if it shares no files with the running one and its brief forbids the commands that compete for the same binaries; if the slow verification fails, it opens the task's fix round.

### 2. Handle the report

- **DONE**: build the review package and dispatch the task reviewer.
- **DONE_WITH_CONCERNS**: read the concerns first. Correctness or scope → address them before review; observations → note them and go on.
- **NEEDS_CONTEXT**: provide it and re-dispatch.
- **BLOCKED**: a context problem → more context, same model; more reasoning needed → a more capable model; too large → split it; the plan is wrong → rule the correction, ledger it and re-dispatch carrying it. Never ignore an escalation or retry the same model unchanged.

When it returns, compare the RED copy with the committed test: a change that isn't formatting goes to the task reviewer.

### 3. Review the task

- `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" review package <plan> <BASE> HEAD` writes the commit list, stat and full diff to a file and prints its path; the package never enters your context. Never `HEAD~1`: it drops all but the last commit of a multi-commit task. Never dispatch a reviewer without a diff file.
- Dispatch [task-reviewer-prompt.md](references/task-reviewer-prompt.md), filled with the brief, the report, the package and the plan's «De código» block, literal. Don't ask it to re-run tests the implementer ran, and don't pre-judge: if your prompt says «do not flag», «don't treat X as a defect», «at most Minor» or «the plan chose», stop.
- Resolve each «⚠️ Cannot verify from diff» yourself; a real gap enters the fix loop.

### 4. The fix loop

It opens with spec ❌, a Critical or Important finding, or a ⚠️ you confirmed. Two routes leave first: Minor findings go to the ledger (`Task <N>: minor (deferred): <one-liner>`), and the final review gets that list; a plan-mandated finding, or one that conflicts with the plan's text, is yours to rule on with the spec as authority, ledgered before you act. The rest enters the loop. A round is one fix dispatch plus one scoped re-review; five rounds per task at most:

- **Rounds 1-3**: resume the original implementer with the open findings, verbatim (without a way to message a live subagent, a fresh one with [implementer-prompt.md](references/implementer-prompt.md) filled as in step 1, plus the report file and the findings).
- **Rounds 4-5**: a fresh implementer one tier up, with [implementer-prompt.md](references/implementer-prompt.md) filled as in step 1, plus the report file, the findings and «A prior implementer attempted this task [N] times; you own it now. Read the report file for what was tried.»
- **Every round**: the implementer fixes, re-runs the covering tests and appends its fix report; check it names the tests, the command and the output, then `sdd review package <plan> <FIX_BASE> HEAD` (FIX_BASE = the head the previous review saw) and dispatch [re-review-prompt.md](references/re-review-prompt.md). New Critical or Important breakage in the fix diff joins the open list; out-of-scope observations go to the ledger as deferred minors. Ledger `Task <N>: fix round <R>/5 (<X> addressed, <Y> open — <one-liners>; commits <a7>..<b7>)`.
- **Reproduce before fixing**: a Critical or Important finding that claims something about execution (an exception, an exit code, a value in a given environment or platform) is fixed by a test that reproduces it in RED first; the fix brief asks for it before the reviewer's proposed fix, and says that if the test isn't RED in one attempt, return `NEEDS_CONTEXT` with the test and its output, unfixed. Not reproducing it doesn't discard the finding: you fix without RED, reject or defer it, ledgered with the attempt's output. A finding you see reading the diff (a name, the structure, a duplication) skips this (`tests/post-final-review-red.md`, f1).
- **Never fix findings yourself**: your fixes skip review.
- **The breaker**: if round 5 leaves findings open, stop dispatching and adjudicate each: the reviewer is wrong or it's contestable → `Task <N>: parked — <finding> — Ruling: <why the code stands>`; real but nothing builds on it → parked the same way, saying it's real and deferred; real and load-bearing → rule the smallest change that unblocks, ledger it and carry it to the next dispatch; stop only if every path forward is a guess. Adjudicate only at the cap.

### 5. Complete the task

Clean review, or all open findings parked at the cap: ledger `Task <N>: complete (commits <base7>..<head7>, review clean)` or `…, <K> parked)`. Squash the task's range into one commit with a message you write, even with a single commit, before dispatching the next task, unless a guard trips; its hash goes to `tasks.md` in the next milestone's commit ([commit-milestones.md](../sdd-start-feature/references/commit-milestones.md)).

| Excuse | Reality |
| --- | --- |
| "Close enough on spec compliance" | Spec gaps mean not done. Fix, or reach the cap and adjudicate. |
| "I'll fix it myself, dispatching is overhead" | Your fixes pollute your context and skip review. Resume the implementer. |
| "One more round will converge" | Past the cap the failure is structural. Adjudicate. |
| "The reviewer will just find something new anyway" | Scoped re-reviews only verify fixes. |
| "This finding is obviously wrong, I'll drop it" | You adjudicate only at the cap, and every ruling is a ledger line. |
| "The fix was small, skip the re-review" | Unreviewed fixes are how regressions land. |
| "Ledger bookkeeping is overhead" | The ledger survives compaction; without it, finished tasks get re-dispatched. |
| "The implementer spawned its own reviewer — extra assurance" | A duplicate seat: flag it as a defect. |

## After each task

**Visual check**: if the task has «Verificación visual», after its review you look at it in a real browser before marking it done in `tasks.md`: with Playwright, the MCP if the session has it and otherwise a script with the `playwright` package, applying [frontend-verification.md](../sdd-start-feature/references/frontend-verification.md): the `§Frontend` detector of `tech-stack.md` in its two viewports, one screenshot per state and theme checked with the rubric against the reference screen, and computed-style measurements only if the criterion fixes a value. Don't mark it done with a detector finding open and unjustified: «it was already there» only for what the task doesn't touch; «false positive» or «intentional» only citing the criterion or the reference screen; «the spec doesn't fix it» doesn't leave it for the dev-lead — the fix goes in its own commit, which enters review (`tests/frontend-verification-red.md`). Keep the screenshots outside git until validation, and don't delete them when cleaning. Only without a browser to run Playwright, without a way to start the app, if the declared detector doesn't run, or without the access the app asks for («no probado: falta el acceso en §Frontend»), said with the concrete error, it stays «no probado» in `tasks.md` — never replaced by the suite. «The Playwright MCP isn't in the session» is not «no browser», and «missing dependencies» is not «can't start it»: install them (`tests/visual-check-red.md`).

**Processes you start**: save the PID (`$!`, `Start-Process -PassThru`, the harness's background task) or the port it listens on; stop it by that PID or by the process listening on that port, never by executable name (`taskkill /IM`, `pkill node`, `killall`, `Stop-Process -Name`) or a command-line pattern (`pkill -f`, filtering `CommandLine`): the dev-lead's machine runs others alike — their server, the MCPs, other sessions (`tests/closing-verification-red.md`). Before starting, check the port is free (if not, it isn't yours: use another); after stopping, check it's free again: the PID of `$!` or `Start-Process -PassThru` can be a launcher's, and if something still listens, stop that one, your child (`tests/closing-verification-green.md`).

**In `pair`**, with the task's commit done, stop before the next one and present that task's test script, shaped like step 7 of `sdd-start-feature`, from its plan line «Se prueba en la aplicación»; if it says «no, porque…», the script says so and gives the check that can be done. With «Verificación visual», before the script show the criterion, the detector output per viewport with each finding fixed or justified, each measurement with its value and the expected one if the criterion fixes a value, and each screenshot's path, or «composición no medida» or «no probado» with its reason. `delegate` and `unattended` don't stop here (`tests/testable-tasks-red.md`, v6).

The closing gate —the project's full build and suite— runs once, in the final validation (step 7 of `sdd-start-feature`), never inside a task.

## Deviations and rulings

- **Ruling** (rulings, not stalls): leaving the plan without changing the spec (a file under «NO se tocan», another order, a fix of yours) — don't stop: ledger `Ruling: <what you decided> — <why> — <what it costs if wrong>` and go on. The spec is the binding authority, the plan its argument, your judgment settles what neither answers.
- **Scope brakes** stop like a deviation even though they don't change the spec's letter: the third discovered fix, a decision that changes the observable output, the feature's row or a task file changed in the base ([control-profiles.md](../sdd-start-feature/references/control-profiles.md)).
- **Deviation**: a change to the approved spec (a requirement, a THEN, the Scope, a «No entra» or «Dónde se prueba») — the update action. In `pair` and `delegate`, stop with its 🦆 and its ✋, leave uncommitted the correction in its place in `spec.md` and its line in «Enmiendas», and wait for approval; approved, what touches a closed task goes to a new task at the end, with its commit (`Task 3 — enmienda <fecha>: <qué>` after Task 2), without reopening it, and `tasks.md` marks the closed task as `afectada por enmienda <fecha> → Task 3`. In `unattended`, apply it marked `sin aprobar` and go on.
- **Every commit of yours** —an improvised fix too— enters the review scope of the task in progress; with no task open and the final review not yet out, the final review's; and once it's out, even if not back, the re-review of the range `<last reviewed>..HEAD` of step 7. Never presented or closed unreviewed, except a commit under 20 lines (`git diff --numstat`) that only changes documentation or comments —files under `.docs/`, `*.md` of any path that aren't an agent's instructions or a template, comment lines no tool interprets; in a merge, only what you resolved, with `git show --remerge-diff`—: read it yourself and note `revisado en el hilo`.

## Recovery

After a machine crash or a quota cut, before anything else, reread the ledger, `git log` and the workspace's report files (`task-<n>-report.md`). A task whose report arrived complete —it carries its `Status:`— counts as returned: it goes on to its task review, and that agent's failure notification is ignored. A dispatch without a complete report is relaunched once, with the same brief and model, and its dispatch names the files `git status` shows changed. A task with its `complete` line is never redone. Ledger `Task <N>: Ruling: recuperación tras <caída | corte por cuota> — <qué se retomó>`. (`tests/sdd-implement-red.md`)

## Final review

**Dispatch it in the background as soon as the last task's commit exists** —in Native, the last task's; in SDD, the squashed one after its clean review—, before starting the app for its «Verificación visual»: while it reviews, you do that check and write the closing drafts of step 7. It works isolated from the moving `HEAD`, in a detached worktree at the sha it reviews (`git worktree add --detach <worktrees parent>/review-<id>-<short sha> <sha>`), with the package built there and the brief telling it not to look at later branches or commits; when it returns, remove it with `git worktree remove`. (`tests/closing-off-critical-path-red.md`, c1) Its brief, model (`sdd-kit:effort-high` + `opus`, also in Native: the kit's ceiling), package recipe —not `sdd review package`— and Review Focus section are the «Revisor final» of [encargo-revision.md](../sdd-start-feature/references/encargo-revision.md), followed by `code-reviewer.md` of `superpowers:requesting-code-review`, with the plan and spec paths and a pointer to the ledger's `Ruling:`, deferred-minor and parked lines.

**Every dispatch** —implementer, reviewers, re-review— and every slow verification in the background gets its silence watch in the same turn: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" watch subagent --description "<the dispatch's description>"` in the background, or `watch command --path <the command's output>`; the script reads the thresholds. What to do with its warning is in [Vigía de silencio](../sdd-start-feature/references/control-profiles.md#vigía-de-silencio). (`tests/silence-watch-red.md`)

**Without a subagent tool**: perform that review yourself against the package, as a separate pass after the last task's ledger line; ledger `Final review: self-review (no subagent tool)` and say so: the user decides if a self-review is enough.

**Sort the findings before acting.** The severity labels are advice; the gate is yours. Each «Declined to judge» line is a ruling: `Final: Ruling: <behavior set aside> — <what a reasonable person using this gets, and why that stands or is now a finding> — <cost if wrong>`. Re-grade by effect: a finding's grade is what a person gets if it ships, not whether the spec names its input. Then Critical and Important enter the fix pass; Minor goes to the ledger as `Final: minor (deferred): <one-liner>` and never becomes a ruling.

- **Native**: fix them yourself in ONE pass. Each fix is a test that reproduces the finding, watched fail, then pass, then the whole suite: `Final: fixed <finding> — <test> RED→GREEN, suite <N>/<N>`. No re-review: the covering tests and the suite answer it. A finding you don't fix is `Final: Ruling: <finding> — <why the code stands> — <cost if wrong>`. No second pass.
- **SDD**: ONE fix subagent with the whole list —not one per finding—, then exactly one scoped re-review of the fix range, and adjudicate residuals as at the breaker. No second fix wave.
- In both, the reproduce-before-fixing rule of the fix loop applies.

When it returns, with either method, write in `tasks.md` `Revisión final: <tipo> + <modelo>, <veredicto>, sobre <sha corto>`, with the `HEAD` it reviewed (without `tasks.md`, in the validation's presentation). If it returned Critical or Important, after its fix pass write below `Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN`: step 7 and the closing count the range from there.

## Finish

Before deleting anything: run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" ledger rulings <plan>` and paste its lines into `tasks.md` under `## Rulings` (without `tasks.md`, in the validation's presentation). Every `Ruling:` line —pre-flight, parked, breaker, final— and every `minor (deferred)` reach the user in your final message, in order, under «Rulings I made» and «Deferred minors»: they feed «Decisiones tomadas sin el dev-lead» of the walkthrough.

When the final review is clean and its fixes are committed, delete this plan's workspace; sibling directories belong to other plans. Then go on with step 7 of `sdd-start-feature` (validation).

## Red flags — STOP

- You're about to start Task 1 and your messages haven't carried the `Workspace del plan: …` line.
- You're about to edit code and the plan isn't approved.
- You're about to dispatch an implementer, a final reviewer, a fix wave or a re-review without the `## Restricciones de código` section at the start of its brief.
- You're about to dodge a file marked «NO se tocan» with a fix that isn't in its own commit and doesn't enter review.
- You're about to record as a ruling a discovered fix that is already the third, or a decision that changes the observable output, without the scope brake.
- You're about to start or dispatch a task without crossing its files with the base, because the feature's row didn't change.
- You're about to mark a UI task done because «the tests pass and the review is clean», without looking at it in a browser or leaving it «no probado».
- You're about to mark a UI task done with a detector finding open and unjustified, or without running the detector `§Frontend` declares.
- You're about to stop a process by its name or a command-line pattern, instead of the PID or port of what you started.
- An implementer's brief carries the project's full gate because «the constitution says all green in every task» — that rule is met with the task's surfaces, not the whole suite.

| Excuse | Reality |
| --- | --- |
| "The vetoed file has a defect; I dodge it in another so I don't break the rule" | Dodging it without commit or review is the failure (E4): it's a ruling, not a licence to skip review — ledger it, put it under «Me salí del plan en…» and let the commit enter the task's review. |
| "The user is away; I'll stop and ask which option they prefer" | A ruling doesn't change the spec: don't wait for anyone. Decide and go on; stopping here is the other failure (E4). |
| "The implementer already does TDD; let it write the tests" | Code and test by the same hand describe the implementation. Tests come from the spec's THEN, before dispatch and from another hand; the implementer runs them, it doesn't write them. |
| "It doesn't change the spec, so it's a ruling" | True for other deviations from the plan, not for the scope brakes: the third fix, the observable output, the row and the file changed in the base stop without touching the spec's letter. |
| "The row didn't change and `develop` only brings another feature: I go on" | Another feature can touch your files without touching your row. Cross the base's `git diff --name-only` with the task's files. |
| "The tests pass and the review is clean: the UI task is done" | A unit test doesn't look at a browser. Without «Verificación visual» run, the task stays «no probado» in `tasks.md`. |
| "The spec doesn't fix the padding and the task is reviewed: I leave it for the dev-lead" | A detector finding in what the task touches is fixed in its own commit, which enters review, or justified citing the criterion (`tests/frontend-verification-red.md`, q1). |
| "No Playwright MCP: the visual check stays «no probado»" | Without the MCP there's still a browser: a script with the `playwright` package opens the same screen. |
| "The constitution says all green in every task, so the brief carries the full gate" | That rule is met with the surfaces each task declares («Verificación»); the full gate runs once, in the final validation. |
| "I kill every `node.exe` (or `pkill -f server.mjs`): that surely stops mine" | And the dev-lead's server, their MCPs and the other sessions. Stop what you started by its PID or port. |
