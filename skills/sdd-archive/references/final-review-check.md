# The final review, before the close writes

`Feature only:` item 6 of the pre-checks of `sdd-archive`.

1. Check there was one, and with which axes and models: `sdd-implement` runs it with `sdd-verify`, and the thread records it in the `Revisión final:` line of `tasks.md` (without `tasks.md`, in the axes' report of this session); a 2.x line, without axes, counts too. With no final review at all, invoke `sdd-verify` for it.
2. Compare `HEAD` with the last reviewed commit.
<!-- kit: incluye last-reviewed-sha -->
If `HEAD` didn't move, don't launch another review.
3. If it moved with a commit of 20 lines or more, or one that changes more than documentation or comments (the others you review in the thread: «Every commit of yours» of `sdd-implement`):
   - without `Re-revisión:` in `tasks.md`, dispatch the single re-review of `<last reviewed>..HEAD` as «Closing the review» of `sdd-verify` says ([encargo-revision.md](../../sdd-verify/references/encargo-revision.md)), with its silence watch, record `Re-revisión: <sha>..<sha>, sdd-kit:effort-high + opus, <verdict>`, and write nothing until it's back and closed;
   - with `Re-revisión:` already there, don't dispatch another: the walkthrough carries `sin revisar: <sha> — <qué cambia>` in ✋.
