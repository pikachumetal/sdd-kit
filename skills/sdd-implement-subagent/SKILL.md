---
name: sdd-implement-subagent
description: Use when sdd-implement runs a plan with SDD: a fresh implementer subagent and a task review per task. Invoked from there; not the entry of a change (that is sdd-propose) nor of resuming paused work (that is sdd-implement).
---

# Subagent-Driven Development

Execute plan by dispatching a fresh implementer subagent per task, a task review (spec compliance + code quality) after each, and a broad whole-branch review at the end.

**Why subagents:** You delegate tasks to specialized agents with isolated context. By precisely crafting their instructions and context, you ensure they stay focused and succeed at their task. They should never inherit your session's context or history — you construct exactly what they need. This also preserves your own context for coordination work.

**Core principle:** Fresh subagent per task + task review (spec + quality) + broad final review = high quality, fast iteration

**Narration:** between tool calls, narrate at most one short line — the
ledger and the tool results carry the record.

<!-- kit: 0296 · sustituye: «four» -->
**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are the ones named below, or all tasks complete. "Should I continue?" prompts and progress summaries waste their time — they asked you to execute the plan, so execute it.
<!-- kit: fin -->

**Rulings, not stalls.** A running plan does not wait on a human. Conflicts,
<!-- kit: e7ddf254 · sustituye: «you would have asked to exceed» -->
ambiguities, plan defects, a cap the plan sets — decide
<!-- kit: fin -->
them. The spec is the binding authority, the plan is its argument, and your
judgment settles what neither answers. Record every decision in the ledger as
`Ruling: <what you decided> — <why> — <what it costs if wrong>`, and keep
going. A wrong ruling costs rework your human partner can see and undo; a
session parked on a question costs their whole day and buys nothing.

<!-- kit: 0296 · sustituye: «Four things stop you, and only these…and a plan so broken that every path forward is a guess.» -->
These stop you, and nothing else: an irreversible or destructive operation; a security-sensitive action; a side effect outside this worktree that norms say you ask about first (a merge, a push to a shared branch, a publish); a plan so broken that every path forward is a guess; a deviation from the approved spec or a scope brake (`sdd-implement`, «Deviations and rulings»); and, in `pair`, the stop after each task (`sdd-implement`, «After each task»). For those, stop and ask.

## When to Use

<!-- kit: 0296 · sustituye: «```dot…```» -->
`sdd-implement` chose SDD for this plan.
<!-- kit: fin -->

**vs. Executing Plans (inline):**
- Fresh subagent per task (no context pollution) instead of one context doing every task
- Review after each task (spec compliance + code quality) instead of only at the end
- Costs a fresh context per task and per review; inline costs one context plus one final reviewer
- Both run in this session, share the same plan workspace and ledger, and never pause between tasks

## The Process

```dot
digraph process {
    rankdir=TB;

    subgraph cluster_per_task {
        label="Per Task";
        "Dispatch implementer subagent (./implementer-prompt.md)" [shape=box];
        "Implementer asks questions?" [shape=diamond];
        "Answer questions, provide context" [shape=box];
        "Implementer implements, tests, commits, self-reviews" [shape=box];
        "Generate review package, dispatch task reviewer (./task-reviewer-prompt.md)" [shape=box];
        "Spec ✅ and quality approved?" [shape=diamond];
        "Fix loop: read references/fix-loop.md before every round" [shape=box];
        "Append completion to ledger, mark todo complete" [shape=box];
    }

    "Setup: worktree, ledger check, read plan, pre-flight review" [shape=box];
<!-- kit: 649f1a99 -->
    "Base check; write the RED tests; sdd task brief" [shape=box];
    "Base check; write the RED tests; sdd task brief" -> "Dispatch implementer subagent (./implementer-prompt.md)";
<!-- kit: fin -->
    "More tasks remain?" [shape=diamond];
<!-- kit: 649f1a99 · sustituye: «read references/final-review.md» -->
    "Final review and finish: sdd-verify, then Finish of sdd-implement-native" [shape=box];
<!-- kit: fin -->
    "Final review clean: delete this plan's workspace" [shape=box];
<!-- kit: 64a86577 · sustituye: «"Use superpowers:finishing-a-development-branch"» -->
    "sdd-archive (validation)" [shape=box style=filled fillcolor=lightgreen];
<!-- kit: fin -->

<!-- kit: 649f1a99 · sustituye: «"Dispatch implementer subagent (./implementer-prompt.md)"» -->
    "Setup: worktree, ledger check, read plan, pre-flight review" -> "Base check; write the RED tests; sdd task brief";
<!-- kit: fin -->
    "Dispatch implementer subagent (./implementer-prompt.md)" -> "Implementer asks questions?";
    "Implementer asks questions?" -> "Answer questions, provide context" [label="yes"];
    "Answer questions, provide context" -> "Implementer implements, tests, commits, self-reviews";
    "Implementer asks questions?" -> "Implementer implements, tests, commits, self-reviews" [label="no"];
    "Implementer implements, tests, commits, self-reviews" -> "Generate review package, dispatch task reviewer (./task-reviewer-prompt.md)";
    "Generate review package, dispatch task reviewer (./task-reviewer-prompt.md)" -> "Spec ✅ and quality approved?";
    "Spec ✅ and quality approved?" -> "Append completion to ledger, mark todo complete" [label="yes"];
    "Spec ✅ and quality approved?" -> "Fix loop: read references/fix-loop.md before every round" [label="no"];
    "Fix loop: read references/fix-loop.md before every round" -> "Append completion to ledger, mark todo complete" [label="addressed, or parked at the cap"];
    "Append completion to ledger, mark todo complete" -> "More tasks remain?";
<!-- kit: 649f1a99 · sustituye: «"Dispatch implementer subagent (./implementer-prompt.md)"» -->
    "More tasks remain?" -> "Base check; write the RED tests; sdd task brief" [label="yes"];
<!-- kit: fin -->
<!-- kit: 649f1a99 · sustituye: «read references/final-review.md» -->
    "More tasks remain?" -> "Final review and finish: sdd-verify, then Finish of sdd-implement-native" [label="no"];
<!-- kit: fin -->
<!-- kit: 649f1a99 · sustituye: «read references/final-review.md» -->
    "Final review and finish: sdd-verify, then Finish of sdd-implement-native" -> "Final review clean: delete this plan's workspace";
<!-- kit: fin -->
<!-- kit: 64a86577 · sustituye: «"Use superpowers:finishing-a-development-branch"» -->
    "Final review clean: delete this plan's workspace" -> "sdd-archive (validation)";
<!-- kit: fin -->
}
```

## Setup

<!-- kit: 0296 · sustituye: «use…existing one.» -->
Ensure the work happens in an isolated workspace: invoke `sdd-worktrees` with `Skill`; it detects or creates it, runs `env:setup` if `§Entornos` exists, and runs the baseline in a detached worktree.
<!-- kit: fin -->
Never start implementation on a main/master branch without your human
partner's explicit consent.

Conversation memory does not survive compaction. In real sessions,
controllers that lost their place have re-dispatched entire completed task
sequences — the single most expensive failure observed. Track progress in
a ledger file, not only in todos.

<!-- kit: 31783aa5 · sustituye: «at skill start, run this skill's `bash scripts/sdd-workspace PLAN_FILE` by its absolute path, from the working tree you're executing in — it prints the plan's git-ignored directory (under `<repo-root>/.superpowers/sdd/`),» -->
- Each plan owns a workspace: run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" workspace <plan>`; your next message, under its phase notice and also when you resume, opens with the `Workspace del plan:` line it prints on stderr, word for word (resuming, add `· retomo en la Task <N>`); the path it prints is the plan's git-ignored directory, home to every artifact for THIS plan: ledger, briefs, reports, review packages. Another plan's directory is never yours to read or write. «Preparo el workspace» isn't it (`tests/sdd-implement-red.md`).
<!-- kit: fin -->
- Check for this plan's ledger at `<workspace>/progress.md`. If one exists,
  read [references/resuming.md](references/resuming.md) before anything
  else: it says whose ledger it is and where to resume.
- Create the ledger with its identity as the first line:
  `# SDD ledger — plan: <plan file path>`.
- The ledger is your recovery map: the commits it names exist in git even
  when your context no longer remembers creating them. After compaction,
  trust the ledger and `git log` over your own recollection.
- `git clean -fdx` will destroy the workspace (it's git-ignored scratch); if
  that happens, recover from `git log`.

Read the plan once, note its context and Global Constraints, and create a
todo per task. If the plan names a Spec, read that too: the spec is the
authority the plan argues from, and conflicts inside the plan resolve
against it. A plan with no reachable spec gets a ledger note saying so —
rulings made without one are provisional.

Before dispatching Task 1, read [references/preflight.md](references/preflight.md)
and run the conflict scan it describes. Its table and rulings go in the
ledger.

## Model Selection

Use the least powerful model that can handle each role to conserve cost and increase speed.

**Mechanical implementation tasks** (isolated functions, clear specs, 1-2 files): use a fast, cheap model. Most implementation tasks are mechanical when the plan is well-specified.

**Integration and judgment tasks** (multi-file coordination, pattern matching, debugging): use a standard model.

**Architecture and design tasks**: use the most capable available model.
<!-- kit: 649f1a99 · sustituye: «The final whole-branch review is one of these — dispatch it on the most capable available model, not the session default.» -->
`sdd-verify` sets the models of the final review's axes.
<!-- kit: fin -->

**Review tasks**: choose the model with the same judgment, scaled to the
diff's size, complexity, and risk. A small mechanical diff does not need the
most capable model; a subtle concurrency change does. Scoped re-reviews of
small fix diffs take a cheap-to-mid tier.

**Fix-loop escalation (rounds 4-5)**: use a model at least one tier above
the implementer that got stuck.

<!-- kit: e7ddf254 · sustituye: «Always specify the model explicitly when dispatching a subagent.» -->
**Declare the model and the effort on every dispatch.** An
omitted model inherits your session's model — often the most capable and
most expensive — which silently defeats this section. An omitted effort inherits the session's too. The effort travels in the agent type (`sdd-kit:effort-low`, `-medium`, `-high`) next to `model`.
<!-- kit: fin -->

**Turn count beats token price.** Wall-clock and context cost scale with how
many turns a subagent takes, and the cheapest models routinely take 2-3× the
turns on multi-step work — costing more overall. Use a mid-tier model as the
floor for reviewers and for implementers working from prose descriptions.
When the task's plan text contains the complete code to write, the
implementation is transcription plus testing: use the cheapest tier for
that implementer. Single-file mechanical fixes also take the cheapest tier.

**Task complexity signals (implementation tasks):**
- Touches 1-2 files with a complete spec → cheap model
- Touches multiple files with integration concerns → standard model
- Requires design judgment or broad codebase understanding → most capable model

<!-- kit: 4597d47e -->
`fable` and `opus xhigh` are forbidden by default, unless the task justifies it in writing.

## The Task Loop

**Small same-shape work:** when the plan lists several small edits of the
same kind across files, read [references/batching.md](references/batching.md)
before dispatching them.

Everything you paste into a dispatch prompt — and everything a subagent
prints back — stays resident in your context for the rest of the session
and is re-read on every later turn. Hand artifacts over as files.

**Waiting on dispatched subagents:** never poll a wait interface with
short timeouts, and never sit in one silent, open-ended wait either.
While you have local work — ledger updates, packaging the next review,
reading reports — keep working; child results arrive on their own.
<!-- kit: 649f1a99 · sustituye: «When you are genuinely idle…not at the end of the session.» -->
A stuck or lost child is noticed by its silence watch (`sdd-implement`, «After the last task»).
<!-- kit: fin -->

### 1. Dispatch the implementer

<!-- kit: 4dcb5598 -->
Before the first dispatch, `tasks.md`, and before every dispatch, the base check and the RED tests: `sdd-implement`, «Before each task».

Record BASE (`git rev-parse HEAD`) before dispatching — the review package
and fix-round diffs need it.

<!-- kit: bb9f588e · sustituye: «this skill's `bash scripts/task-brief PLAN_FILE N` by its absolute path, from the working tree you're executing in» -->
- **Task brief:** before dispatching an implementer, run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" task brief <plan> <n>` — it extracts the task's full text to a
<!-- kit: fin -->
  uniquely named file and prints the path. Compose the dispatch so the
  brief stays the single source of
  requirements. Your dispatch should contain: (1) one line on where this
  task fits in the project; (2) the brief path, introduced as "read this
  first — it is your requirements, with the exact values to use verbatim";
  (3) interfaces and decisions from earlier tasks that the brief cannot
  know; (4) your resolution of any ambiguity you noticed in the brief;
  (5) the report-file path and report contract. Exact values (numbers,
  magic strings, signatures, test cases) appear only in the brief. Never
  make a subagent read the whole plan file.
- **Report file:** name the implementer's report file after the brief
  (brief `…/task-N-brief.md` → report `…/task-N-report.md`) and put it in
  the dispatch prompt. The implementer writes the full report there and
  returns only status, commits, a one-line test summary, and concerns.
- A dispatch prompt describes one task, not the session's history. Do not
  paste accumulated prior-task summaries ("state after Tasks 1-3") into
  later dispatches — a real session's dispatch hit 42k chars of which 99%
  was pasted history. A fresh subagent needs its task, the interfaces it
  touches, and the global constraints. Nothing else.
- The dispatch carries the no-subagents contract (it is in the
  implementer template): the implementer never dispatches subagents —
  not helpers, and never a reviewer. Review arrives from you, after the
  report. In real sessions, every reviewer a worker spawned duplicated
  the task review the controller dispatched anyway — a full extra
  review seat per task.
- If an earlier task parked a finding in the area this task touches, carry
  a pointer to that ledger entry in the dispatch.
- Record the implementer's agent identity from the dispatch result —
  fix-loop rounds 1-3 resume this agent.
- Never dispatch multiple implementation subagents in parallel (conflicts).

Template: [implementer-prompt.md](implementer-prompt.md)

### 2. Handle the report

Implementer subagents report one of four statuses. Handle each appropriately:

<!-- kit: bb9f588e · sustituye: «`bash scripts/review-package PLAN_FILE BASE HEAD` by its absolute path, from the working tree you're executing in» -->
**DONE:** Generate the review package (`node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" review package <plan> BASE HEAD` — it prints the unique file path it wrote; BASE is the commit you recorded before dispatching the implementer — never `HEAD~1`, which silently drops all but the last commit of a multi-commit task), then dispatch the task reviewer with the printed path.

**Any other status** (DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED): read
[references/handling-reports.md](references/handling-reports.md) and follow
it, every time you get one.

If the implementer asks questions — before starting or mid-task — answer
clearly and completely, provide additional context if needed, and don't
rush it into implementation.

<!-- kit: 4597d47e -->
When it returns, compare the RED copy with the committed test, as `sdd-implement`, «Before each task», says.

### 3. Review the task

Per-task reviews are task-scoped gates. The broad review happens once, at the
final whole-branch review. Never skip the task review, and never accept a
report missing either verdict — spec compliance AND task quality are both
required. Implementer self-review never replaces the task review; both are
needed.

<!-- kit: bb9f588e · sustituye: «this skill's `bash scripts/review-package PLAN_FILE BASE HEAD` by its absolute path, from the working tree you're executing in,» -->
- Hand the reviewer its diff as a file: run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" review package <plan> BASE HEAD` and pass the reviewer the file path
<!-- kit: fin -->
  it prints (or, without bash: `git log --oneline`, `git diff --stat`,
  and `git diff -U10` for the range, redirected to one uniquely named
  file). The output never enters your own context, and the reviewer sees
  the commit list, stat summary, and full diff with context in one Read
  call. Use the BASE you recorded before dispatching the implementer —
  never `HEAD~1`, which silently truncates multi-commit tasks. Never
  dispatch a task reviewer without a diff file.
- **Reviewer inputs:** the task reviewer gets three paths — the same brief
  file, the report file, and the review package — plus the global
  constraints that bind the task.
- The global-constraints block you hand the reviewer is its attention
<!-- kit: 0296 · sustituye: «the binding requirements…Global Constraints section or the spec» -->
  lens. Copy the plan's «De código» block verbatim, never its «De proceso» one: exact values, exact formats, and the
<!-- kit: fin -->
  stated relationships between components ("same layout as X", "matches
  Y"). The reviewer's template already carries the process rules (YAGNI,
  test hygiene, review method) — the constraints block is for what THIS
  project's spec demands.
- Do not add open-ended directives like "check all uses" or "run race tests
  if useful" without a concrete, task-specific reason
- Do not ask a reviewer to re-run tests the implementer already ran on the
  same code — the implementer's report carries the test evidence
- Do not pre-judge findings for the reviewer — never instruct a reviewer to
  ignore or not flag a specific issue. If you believe a finding would be a
  false positive, let the reviewer raise it and adjudicate it in the review
  loop. If the prompt you are writing contains "do not flag," "don't treat X
  as a defect," "at most Minor," or "the plan chose" — stop: you are
  pre-judging, usually to spare yourself a review loop.
If the reviewer reports "⚠️ Cannot verify from diff" items, read
[references/cannot-verify.md](references/cannot-verify.md) before you mark
the task complete.

Template: [task-reviewer-prompt.md](task-reviewer-prompt.md)

### 4. The fix loop

The loop triggers when the review reports spec ❌, any Critical or Important
finding, or a ⚠️ item you confirmed as a real gap.

When it triggers, read [references/fix-loop.md](references/fix-loop.md) and
follow it. Read it again before every round, even if you read it earlier in
this session: it holds the round cap, the breaker, and the ledger line each
round writes, and your memory of it does not survive compaction.

### 5. Complete the task

When the review comes back clean — or every open finding is parked with a
ruling at the cap — append the completion line to the ledger in the same
message as your other bookkeeping:

- `Task <N>: complete (commits <base7>..<head7>, review clean)`
- `Task <N>: complete (commits <base7>..<head7>, <K> parked)` after a
  tripped breaker

Then mark the todo complete and move on. Never move to the next task while
the review has open Critical/Important issues that are neither fixed nor
parked-with-ruling at the cap.

<!-- kit: 4597d47e -->
Squash the task's range into one commit, as [commit-milestones.md](../sdd-implement/references/commit-milestones.md) says, before dispatching the next task, and do what `sdd-implement`, «After each task», asks of this one.

## Final Review

<!-- kit: 0296 · sustituye: «read…how you finish.» -->
When every task is complete, invoke `sdd-verify` with `Skill`: the final review and its single closing are its. When its closing is done, finish with [Finish](../sdd-implement-native/SKILL.md#finish) of `sdd-implement-native`.
<!-- kit: fin -->

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Close enough on spec compliance" | Reviewer found spec gaps = not done. Fix or hit the cap and adjudicate — those are the only exits. |
| "I'll fix it myself, dispatching is overhead" | Controller fixes pollute your context and skip review. Resume the implementer. |
| "One more round will converge" | Past the cap, rounds don't converge — the failure is structural. Adjudicate and route. |
| "The reviewer will just find something new anyway" | Scoped re-reviews verify fixes; they cannot wander. New findings on untouched code go to the ledger, not the loop. |
| "This finding is obviously wrong, I'll drop it" | You adjudicate only at the cap, and every ruling is a ledger entry. Silent discards are forbidden. |
| "The fix was small, skip the re-review" | Unreviewed fixes are how regressions land. Every round ends with a scoped re-review. |
| "Reviews slow the loop down" | The loop without reviews is just unverified churn. Reviews are the loop's brakes and steering. |
| "Ledger bookkeeping is overhead" | The ledger is what survives compaction. Controllers without one have re-dispatched entire completed task sequences. |
| "The implementer spawned its own reviewer — free extra assurance" | It's a duplicate seat reviewing the same diff; the task review is the gate. A worker-spawned reviewer is a defect to flag, not rigor. |
