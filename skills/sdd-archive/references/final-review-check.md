# The final review, before the close writes

`Feature only:` item 6 of the pre-checks of `sdd-archive`.

1. Check there was one, and with which axes and models: `sdd-validate` runs it with `sdd-verify`, and the thread records it in the `Revisión final:` line of `tasks.md` (without `tasks.md`, in the axes' report of this session); a 2.x line, without axes, counts too. With no final review at all, send the work back to `sdd-validate`: the close doesn't dispatch it.
2. Compare `HEAD` with the last reviewed commit.
<!-- kit: incluye last-reviewed-sha -->
If `HEAD` didn't move, don't launch another review.
3. If it moved with a commit of 20 lines or more, or one that changes more than documentation or comments (the others you review in the thread: «Every commit of yours» of `sdd-implement`):
   - without `Re-revisión:` in `tasks.md`, don't dispatch it: send the work back to `sdd-validate`, which reviews it before the validation (its review is «Closing the review» of `sdd-verify`);
   - with `Re-revisión:` already there, don't dispatch another: the walkthrough carries `sin revisar: <sha> — <qué cambia>` in ✋.
