# One commit per milestone

A feature's branch counts its milestones: **opening**, **one commit per plan task** and **closing** — 2 + N commits from the `merge-base`, 3 in lite. A patch's has two: **fix** and **closing**. While a milestone is open, commit as much as needed: the task review of `sdd-implement-subagent` works by `BASE..HEAD` ranges. When the milestone's review comes back clean, its range is squashed into one commit.

## What each milestone carries

| Milestone | Carries | Squashed | Base |
| --- | --- | --- | --- |
| Opening | spec, findings of the spec review, `plan.md`, `tasks.md` (lite: the spec alone) | before writing the first task's RED tests (in Native, before its `sdd task start`); lite: before implementing | `git merge-base HEAD <integration>` |
| Task N | its RED tests, its implementation, the fixes of its review, its evidence | with its review (and re-review) clean, before dispatching the next one or the final review; in Native, with its completion contract met and before `sdd task done` | the `BASE` you noted before dispatching it (in Native, the one `sdd task start` prints) |
| Closing | `sdd-archive` documentation, fixes of the final branch review and of the validation, and `tasks.md` with the review lines of the range rewritten without sha | after the closing documentation, before the merge | the last task's commit |
| Fix (patch) | code, tests and `patch.md` | with the fix verified | `git merge-base HEAD <integration>` |
| Closing (patch) | `patch.md` with hash and time, changelog (2.x), roadmap, estimation-log | before the merge | the fix's commit |
| Sync merge | the target branch integrated into the feature, with the registries resolved | not squashed | — |

If the dev-lead fixes another shape of commits («three commits in order»), theirs wins over «a single commit» and the milestone isn't squashed. A test in RED goes in the commit of its fix or a later one, never before: a `pre-commit` that runs the suite rejects it, and without it the branch would carry a red commit. The RED is recorded in `patch.md` §4 (in a feature, in its evidence). No `--no-verify` (ticket of patch 0072 §2).

The sync merge is requested only by the [merge recipe](../../sdd-archive/references/merge-recipe.md#integrated-base); it goes after the closing commit and is the last commit of the branch, so the history stays at 2 + N (2 in a patch) plus that merge, and the closing isn't squashed again.

## Recipe

First the two guards (next section). If neither trips:

```bash
git reset --soft <base>
git commit        # the project's commit convention
```

The recipe holds also with a single commit in the range: you write the milestone's message with the project's convention, and it is never inherited from the implementer, because the task review package shows the subject and not the body. Measured in `tests/native-adapt-red.md`: with «a single commit, nothing to squash», 2 of 2 subjects left a body without accents on the branch. Never `rebase -i`, `push --force` or `--no-verify`.

## Guards

Nothing is squashed, and no force push is made, if:

- the range contains a merge: `git rev-list --merges <base>..HEAD` is not empty. Squashing it would put the integrated branch's changes into the milestone's commit;
- the range is already published: `git branch -r --contains <first commit of the range>` is not empty (`git rev-list --reverse <base>..HEAD` gives the first). Rewriting it would force the push.

The milestone stays as it is, and the walkthrough (or `patch.md`) says which one stayed unsquashed and why.

## The hash in the artifacts

A commit can't contain its own hash. Task N's goes in `tasks.md` in the next milestone's commit —task N+1 or, for the last one, the closing—, and a patch fix's, in `patch.md` in the closing commit. It is always the hash of the already squashed commit; the ledger line also uses `<base>..<squashed hash>`.

The closing has no next milestone, and the squash deletes the shas of its range.
Before squashing, each `Pasada de fix:`, `Re-revisión:` or `Revisión final:` line of `tasks.md` whose sha falls in the squashed range is rewritten without it, and so is any sha of the range that `walkthrough.md`, `patch.md`, the debt or an ADR of the branch cites (a cited sha is any 7 to 40 hex characters); otherwise that range isn't squashed.
So `Pasada de fix: 7ea5c37, 1 hallazgo RED→GREEN` becomes `Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN`, and `Re-revisión: 7ea5c37..21c1f70, sdd-kit:effort-high + opus, limpia` becomes `Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia`. From there, the last reviewed is the closing commit. Criterion: after the closing commit, `git merge-base --is-ancestor <sha> HEAD` succeeds for every sha of those files.

## RED tests left uncommitted

The task's RED tests are written by the thread before the dispatch and **not committed**: they go in the task's commit. With a `pre-commit` that demands the suite green, a commit of tests in red can't be made without `--no-verify`, and with the squash it would add nothing to the history. Before dispatching, keep a copy outside the repo; when the implementer returns, compare it with the committed test (`git diff --no-index <copy> <path>`). A change that isn't formatting goes to the task reviewer.

The opening is squashed before writing the first task's RED tests, and each milestone, before the next task's. If with a RED in the tree you must commit something else (a ruling, a thread fix, a sync merge), set it aside first —the copy is already outside the repo—, commit and put it back: a `pre-commit` that runs the suite also sees the untracked files.
