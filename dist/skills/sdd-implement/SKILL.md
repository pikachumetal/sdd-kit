---
name: sdd-implement
description: Use when sdd-propose hands off a confirmed patch, or an approved spec (and plan, in full mode), to implement it task by task, or to resume a paused feature or patch on its branch («retoma la feature», «sigue con la Task 3», «retoma el patch»). Not the entry of a new change (that is sdd-propose).
---

# sdd-implement

## Overview

Execute the approved plan, task by task, and leave a record that survives your own forgetting.
Write everything the user reads in the language of their message —announcements, notes between tool calls, after a failed one too—, also while the reference you follow is in English.
**Notice:** each change of step opens with a plain line: `Ahora: <what you do, without a step number>. Queda: <what is left until the user's next stop>, ~<minutes>`, and `, ~<dollars>` if it launches subagents or subjects; a counter or a step number alone isn't a notice.

## Patch

If `sdd-propose` handed you a confirmed patch, or you resume one (its `patch.md` on the branch), read [references/patch-flow.md](references/patch-flow.md) and follow it, with the class and the estimate it brought; implement nothing from here: nothing below applies to a patch. Its `sdd <verb>` run as `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verb>`.

## Method

The plan's `Ejecución` line decides, for the whole plan; `plan-writing.md` of `sdd-propose` writes it. In lite mode, without a plan, `spec.md` is the plan: the method is `execution` if `sdd-kit.json` fixes it, and Native with `auto`. With no subagent tool in your harness, the method is Native.

After the check of [Setup](#setup), invoke the method's skill with `Skill`; it prepares the workspace and runs the tasks:

- **Native**: `sdd-implement-native`.
- **SDD** (`Ejecución: subagent`): `sdd-implement-subagent`.

Both run in this session, over the same workspace and ledger, and never pause between tasks. After a compaction in Native with two or more tasks without their `complete` line, invoke `sdd-implement-subagent` with `Skill`: the rest goes on with SDD over the same ledger, without stopping in `delegate` or `unattended`; with one task left, Native goes on. Ledger it every time: `Task <N>: Ruling: compactación — sigo con <Native | SDD> — quedan <k> tasks` (with one, `queda 1 task`; the task you were on counts); after compaction you reread the plan and the ledger, not this skill.

## Setup

With no approved `spec.md` on the branch, stop and send the change to `sdd-propose`: an unapproved spec isn't a contract. Resuming without a ledger, `tasks.md` and `git log` say what's done: start it from them and go on at the first pending task.

**Effort**: before the first dispatch of the feature —the implementer in SDD, the final review's axes in Native— check that the `sdd-kit:effort-<level>` type is among the session's agents.
If the harness doesn't expose the type, dispatch with the `model` and «effort: no disponible en este harness, hereda el de la sesión».
Say so before dispatching, and record it as a ruling.

## Before each task

Every task, the second and later ones too, in both methods:

1. **Check the base first**, with or without a remote: `git diff $(git merge-base HEAD <integration>) <integration> -- ROADMAP.md`, with `<integration>` `develop` or the one the constitution fixes (with a remote, `git fetch` first and compare `origin/<integration>` too). If the feature's row is in the diff, it's a scope brake: don't start or dispatch, and follow its row in the [gate table](../sdd-propose/references/control-profiles.md). Cross `git diff --name-only $(git merge-base HEAD <integration>) <integration>` with the task's «Crear» and «Modificar» files, except `ROADMAP.md`, whose row the check above covers, and `CHANGELOG.md` and `.docs/sdd/steering/estimation-log.md`, which the closing's sync merge resolves: for a match, compare `git diff -U0` of the base (`origin/<integration>` too if the match comes from there; ranges are the merge base's) with the lines the task will touch. An overlap the spec doesn't declare, or lines you can't tell, is the same brake. Other lines, or an overlap the spec declares with file and region and the base stays inside it, is a `Ruling:` with both ranges, and you go on.
2. **In a spike, «Evidencia» replaces the RED tests**: the raw output goes in the spec's folder, and the task's «Verificación» checks that file. Otherwise, **the RED tests are the thread's**: with the opening already in its commit, you write the tests that encode the task's scenarios —one per THEN and one per Review Focus line that names the task— in RED by compilation or by failure, without committing them: they go in the task's commit. Keep a copy outside the repo: it's the only proof the test wasn't fitted to the code.
3. **Compare the RED copy** with the test before its commit (SDD: when the implementer returns), using `git diff --no-index <copy> <path>`: a change that isn't formatting is a ledger `Ruling:` or, in SDD, goes to the task reviewer.
4. **In SDD, a «Verificación lenta»**: the implementer doesn't run it. You launch it in the background as soon as it reports, while the task review runs; dispatch the next task meanwhile only if it shares no files with the running one and its brief forbids the commands that compete for the same binaries. If it fails, it opens the task's fix round.

Before the first task, with more than one task, write `tasks.md`, the **living record** (status and commit hash per task): it goes in the opening's commit or, if that is done, in Task 1's.

## After each task

**Visual check**: if the task has «Verificación visual», after its review you look at it in a real browser before marking it done in `tasks.md`: with Playwright, the MCP if the session has it and otherwise a script with the `playwright` package, applying [frontend-verification.md](references/frontend-verification.md): the `§Frontend` detector of `operations.md` in its two viewports, one screenshot per state and theme checked with the rubric against the reference screen, and computed-style measurements only if the criterion fixes a value. Don't mark it done with a detector finding open and unjustified: «it was already there» only for what the task doesn't touch; «false positive» or «intentional» only citing the criterion or the reference screen; «the spec doesn't fix it» doesn't leave it for the dev-lead — the fix goes in its own commit, which enters review. Keep the screenshots outside git until validation, and don't delete them when cleaning. Only without a browser to run Playwright, without a way to start the app, if the declared detector doesn't run, or without the access the app asks for («no probado: falta el acceso en §Frontend»), said with the concrete error, it stays «no probado» in `tasks.md` — never replaced by the suite. «The Playwright MCP isn't in the session» is not «no browser», and «missing dependencies» is not «can't start it»: install them.

**Processes you start**: save the PID (`$!`, `Start-Process -PassThru`, the harness's background task) or the port it listens on; stop it by that PID or by the process listening on that port, never by executable name (`taskkill /IM`, `pkill node`, `killall`, `Stop-Process -Name`) or a command-line pattern (`pkill -f`, filtering `CommandLine`): the dev-lead's machine runs others alike. Before starting, check the port is free (if not, it isn't yours: use another); after stopping, check it's free again: the PID of `$!` or `Start-Process -PassThru` can be a launcher's, and if something still listens, stop that one, your child.

**In `pair`**, with the task's commit done, stop before the next one and present that task's test script, shaped as [dev-validation.md](../sdd-archive/references/dev-validation.md) says, from its plan line «Se prueba en la aplicación»; if it says «no, porque…», the script says so and gives the check that can be done.
With «Verificación visual», the message carries what §5 of `frontend-verification.md` of `sdd-implement` lists, or «composición no medida» or «no probado» with its reason.
It goes before the script. `delegate` and `unattended` don't stop here.

The closing gate —the project's full build and suite— runs at the baseline of `sdd-worktrees` and once in the validation (step 1 of `sdd-archive`), never inside a task.

## Deviations and rulings

- **Rulings.** Scope brakes and the deviations below aren't rulings: they stop; a `Ruling:` in the ledger doesn't stop you.
- **How you stop**, in `pair` and `delegate`: with 🦆 and ✋. A deviation that changes the delta: write in `spec.md` the correction you recommend, dispatch its reviewer, then stop with its findings in ✋. When the stop's file is a copy in `upstream.json`, the first line of the ✋ is `Copia:` and the literal output of `git log -1 --format='%h %s' <sha7>`, `<sha7>` the id after `kit:` in the block's mark; with a task id, the first line of `git log -S '<S>' --reverse --format='%h %s' -- <file>` (S the mark's quote); with none, `Copia: no encuentro el commit del kit que lo cambió`.
- **Scope brakes** stop the same way: the third discovered fix, a decision that changes the observable output, the feature's row or the task's lines changed in the base ([control-profiles.md](../sdd-propose/references/control-profiles.md)).
- **Deviation**: a change to the approved spec (a requirement, a THEN, the Scope, a «No entra» or «Dónde se prueba»). A Scope item marked «si el RED lo exhibe» with a clean RED at n = 3 goes out with a `Ruling:`; anything else is a deviation. Leaving the plan without changing the spec (a file under «NO se tocan», another order, a fix of the thread) is a `Ruling:`, not a deviation. In `pair` and `delegate`, leave the correction in its place in `spec.md` and its «Enmiendas» line uncommitted; if it changes the delta, one `sonnet` reviewer (`sdd-kit:effort-medium`) with the seven points of `review-spec.md` of `sdd-propose` reads it first, its findings in the ✋. Stop with 🦆 and ✋ and wait; approved, what touches a closed task goes to a new task at the end with its commit (`Task 3 — enmienda <fecha>: <qué>` after Task 2), not reopened, and `tasks.md` marks the closed task `afectada por enmienda <fecha> → Task 3`. In `unattended`, apply the most conservative option the same way, marked `sin aprobar`, and go on; if every option blocks the feature, park it (`⏸️ aparcada: <motivo>`). A REFACTOR or fix round whose guidance or behavior adds or changes a THEN or an AND, even one left unwritten («don't write until the user confirms» fixing a smoke that «only says warn»), is a deviation, not a ruling: stop before committing it. One case goes on: an AND or a THEN that only applies, literally, a line of the spec's «Decisiones tomadas con el dev-lead». Write it in its place in `spec.md`, its «Enmiendas» line marked `sin aprobar`, commit it with the round and end your message with its line, `✋ Enmienda sin aprobar: <qué>`; a `Ruling:` hides it from the dev-lead. A value, case or text that line doesn't say: stop.
The approval's detail and the files an amendment adds: [Deviation](../sdd-propose/references/control-profiles.md#deviation).
- **Every commit of yours** enters the review scope of the task in progress; with no task open and the final review not yet out, the final review's; and once it's out, even if not back, the single re-review of the range `<last reviewed>..HEAD` («Closing the review» of `sdd-verify`); once that re-review is out, it doesn't open another and goes to ✋ as `sin revisar: <sha> — <what it changes>`. No commit is presented or closed unreviewed other than one under 20 lines (`git diff --numstat`) that only changes documentation or comments —files under `.docs/`, `*.md` of any path that aren't an agent's instructions or a template, comment lines no tool interprets; in a merge, only what you resolved, with `git show --remerge-diff`—: that one you read yourself, noting `revisado en el hilo`.

## Recovery

After a crash or a quota cut, first reread the ledger, `git log` and the workspace's report files (`task-<n>-report.md`). A report that arrived complete counts as returned, its agent's failure notification ignored: a task's goes to its task review, the final review's axes as «After the last task» says. A dispatch without a complete report is relaunched once, with the same brief and model, and its dispatch names the files `git status` shows changed. A task with its `complete` line is never redone. Ledger `Task <N>: Ruling: recuperación tras <caída | corte por cuota> — <qué se retomó>`.

## After the last task

**When the axes return**, first thing: invoke `sdd-verify` with `Skill` and follow its «Closing the review», before any stop.

**Every dispatch** —implementer, reviewers, re-review— and every slow verification in the background gets its silence watch in the same turn: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" watch subagent --description "<the dispatch's description>"` in the background, or, for a slow verification, through `watch command -- <the command…>`; its warning, in [Silence watch](../sdd-propose/references/control-profiles.md#silence-watch).

**Closing drafts**: while the axes review, write in their place, uncommitted, `walkthrough.md` without the verification or the time, and the delta merged into `capabilities/` with the `sdd capability merge` of step 3 of `sdd-archive`; the roadmap isn't touched. `sdd-archive` only completes them.

## Red flags — STOP

- You're about to edit code and the plan isn't approved.
- You're about to dispatch an implementer, a final reviewer, a fix wave or a re-review without the `## Code constraints` section at the start of its brief.
- You're about to dodge a file marked «NO se tocan» with a fix outside its own reviewed commit.
- You're about to record as a ruling a discovered fix that is already the third, or a decision that changes the observable output, without the scope brake.
- You're about to start or dispatch a task without crossing its files with the base, because the feature's row didn't change.
- You're about to mark a UI task done with a detector finding open and unjustified, or without running the detector `§Frontend` declares.
- An implementer's brief carries the project's full gate because «the constitution says all green in every task»: the task's surfaces meet that rule.

| Excuse | Reality |
| --- | --- |
| "The vetoed file has a defect; I dodge it in another so I don't break the rule" | Dodging it without commit or review is the failure (E4): it's a ruling, not a licence to skip review — ledger it, put it under «Me salí del plan en…» and let the commit enter the task's review. |
| "The user is away; I'll stop and ask which option they prefer" | A ruling doesn't change the spec: don't wait for anyone. Decide and go on; stopping here is the other failure (E4). |
| "The implementer already does TDD; let it write the tests" | Code and test by the same hand describe the implementation. Tests come from the spec's THEN, before dispatch and from another hand; the implementer runs them, it doesn't write them. |
| "The tests pass and the review is clean: the UI task is done" | A unit test doesn't look at a browser. Without «Verificación visual» run, the task stays «no probado» in `tasks.md`. |
| "The spec doesn't fix the padding and the task is reviewed: I leave it for the dev-lead" | A detector finding in what the task touches is fixed in its own commit, which enters review, or justified citing the criterion. |
| "I kill every `node.exe` (or `pkill -f server.mjs`): that surely stops mine" | And the dev-lead's server, their MCPs and the other sessions. Stop what you started by its PID or port. |
