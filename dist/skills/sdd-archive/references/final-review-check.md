# The final review, before the close writes

`Feature only:` item 6 of the pre-checks of `sdd-archive`.

1. Check there was one, and with which axes and models: `sdd-implement` runs it with `sdd-verify`, and the thread records it in the `Revisión final:` line of `tasks.md` (without `tasks.md`, in the axes' report of this session); a 2.x line, without axes, counts too. With no final review at all, invoke `sdd-verify` for it.
2. Compare `HEAD` with the last reviewed commit.
The last reviewed commit is the second sha of the `Re-revisión:` line; without one, the `sobre` of `Revisión final:`; and if the line says «juntada en el cierre», the closing commit.
If `HEAD` didn't move, don't launch another review.
3. If it moved with a commit the thread doesn't review —the one «Every commit of yours» of `sdd-implement` lets through: under 20 lines, only documentation or comments—:
   - without `Re-revisión:` in `tasks.md`, dispatch the single re-review of `<last reviewed>..HEAD` as «Closing the review» of `sdd-verify` says ([encargo-revision.md](../../sdd-verify/references/encargo-revision.md)), with its silence watch, record `Re-revisión: <sha>..<sha>, sdd-kit:effort-high + opus, <verdict>`, and write nothing until it's back and closed;
   - with `Re-revisión:` already there, don't dispatch another: the walkthrough carries `sin revisar: <sha> — <qué cambia>` in ✋.
