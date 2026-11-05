# Final Review and Finish

<!-- kit: 0296 · sustituye: «superpowers:subagent-driven-development» -->
Part of `sdd-implement-subagent`. Every task in the plan is
<!-- kit: fin -->
complete.

<!-- kit: 649f1a99 · sustituye: «The final whole-branch review gets a package too…fixed before merge.» -->
**REQUIRED SUB-SKILL:** `sdd-verify` runs the final whole-branch review and its single closing: its axes go out in the background once the last task's squashed commit exists, and you come back here when its closing is done. The silence watch of each dispatch and the closing drafts are `sdd-implement`'s, «After the last task».

If the final whole-branch review returns findings, dispatch ONE fix subagent
with the complete findings list — not one fixer per finding.
Per-finding fixers each rebuild context and re-run suites; a real
session's final-review fix wave cost more than all its tasks combined.
Then run exactly one scoped re-review of the fix wave
<!-- kit: bb9f588e · sustituye: «`bash scripts/review-package PLAN_FILE FIX_BASE HEAD` by its absolute path, from the working tree you're executing in,» -->
(`sdd review package <plan> FIX_BASE HEAD`
over the fix range,
<!-- kit: fin -->
[re-review-prompt.md](../re-review-prompt.md)).
Adjudicate any residual findings as in the fix loop's breaker
(references/fix-loop.md): park with rulings, or rule on the load-bearing
<!-- kit: 0296 · sustituye: «Only the four things that stop a running plan (top of SKILL.md) stop you here.» -->
ones and ledger what you decided. The stops named in `SKILL.md` are the only ones here. There is no second fix wave —
<!-- kit: fin -->
residual load-bearing findings surface to your human partner when
<!-- kit: 64a86577 · sustituye: «finishing-a-development-branch presents the options.» -->
`sdd-archive` presents the validation.
<!-- kit: fin -->

### Finish

<!-- kit: e7ddf254 -->
Run `sdd ledger rulings <plan>` and paste its lines into `tasks.md` under `## Rulings` (without `tasks.md`, in the validation's presentation).

Before you delete anything, collect every ledger line containing `Ruling:` —
preflight rulings, parked findings, breaker adjudications, all of them — into
your final message under "Rulings I made", in the order you made them, each
with what it costs if wrong. The list is exhaustive: if the ledger holds a
ruling, the list holds it. That list is the only place the decisions you
took on your human partner's behalf reach them — they read it and rework
whatever you got wrong. A ruling that dies with the workspace was a decision
made in secret.

<!-- kit: e7ddf254 -->
Every `minor (deferred)` line goes under «Deferred minors» in that message too; both lists feed «Decisiones tomadas sin el dev-lead» of the walkthrough.

<!-- kit: 64a86577 · sustituye: «the final whole-branch review is clean and its fixes are merged» -->
When the closing of the review is done (`sdd-verify`) and its fixes are committed,
<!-- kit: fin -->
delete this plan's workspace (`rm -rf <workspace>`) — the git history is
the record now. Sibling directories belong to other plans; leave them
alone.

<!-- kit: 64a86577 · sustituye: «Use superpowers:finishing-a-development-branch.» -->
Then invoke `sdd-archive` with `Skill`: its first step is the validation.
