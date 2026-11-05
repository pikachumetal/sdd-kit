## Naming of spec folders

`<yyyyMMdd-HHmmss>-(feature|patch|proposal)-<id>-<slug>`, all in UTC:

- Timestamp: `Get-Date -AsUTC -Format 'yyyyMMdd-HHmmss'` (PowerShell).
- `feature`, `patch` or `proposal` by the lane. A `-task-` folder from before 2.0.0 is legacy: the scripts read it and the closing writes in it without renaming it, but no new folder is prefixed `task-`. A folder containing `patch.md` is ALWAYS prefixed `patch-`; one containing `proposal.md`, `proposal-` (`sdd-roadmap` creates it).
- `<id>`: depends on the mode declared in `.docs/sdd/sdd-kit.json` (`ids.mode`; no field ⇒ `tracker`). In `tracker`: the ticket id in the project's tracker, `0000` if there is none. In `sequence`: the id reserved in the roadmap row of the feature or the patch, or, if it has no row, the one `sdd id next --project-root <project root> --reserve` reserves. Without `--reserve` the script only proposes an id, and another worktree computing at the same time takes the same one. The reserved id is **provisional** until the task starts: before creating the folder, `sdd id claim --project-root <project root>` checks it against the remote's integration and publishes it, and if another clone already published it, it moves to the next free one and renames the branch («la 0174 pasa a 0203»). **Never a module's name** ("M4" isn't an id).
- **The branch carries the reserved id.** If on reserving you're already on a `feature/<slug>` branch without an id (`feature/fix-sala`, the one the worktree created) and without commits of its own against the integration branch, rename it before the first commit with `git branch -m feature/<id>-<slug>` and say so in your message. With commits of its own, don't rename it: warn and go on. Never rename the integration or the stable branch (`develop`, `main`): if you're on one of them, create `feature/<id>-<slug>`. Without this rule, 2 of 2 subjects of the RED reserved `0014` and committed the fix on `feature/fix-sala` (`tests/sdd-roadmap-red.md`, p8b).
- Features, patches and proposals share **a single sequence**: an id doesn't repeat between lanes. A split feature takes a **reserved id** with `sdd id next --reserve`, with `parent: <id>` in the frontmatter **and its own roadmap row** — never a suffix like `0006a`. Without that row, the relation between the two halves is lost as soon as the session closes.
- `<slug>`: short descriptive kebab-case.

## Red flags — STOP

- The folder says `feature-` but the content is a `patch.md`, or the `<id>` is a module instead of a ticket.
- In `sequence` without a roadmap row, you created the folder before the branch — the branch reserves the id, it goes first.
- In `sequence`, you created the folder without running `sdd id claim`, or with the id it replaced.

| Rationalization | Reality |
| --- | --- |
| "Without a ticket the id is `0000`; I add a slug to the branch so it doesn't clash with the feature in another worktree" | Seeing the clash and patching it with an improvised slug is the failure: in `sequence` the id comes from the roadmap row or from `sdd id next`, never from a convention invented on the spot. |

## Modules by observable predicate (don't ask: observe the project)

| If it exists… | Then… |
| --- | --- |
| `.docs/sdd/estimation.md` | The «Estimación y esfuerzo» block is mandatory in `plan.md`, and real time is mandatory in `walkthrough.md` |
| `.docs/sdd/changelog.md` (2.x) | An entry through `add-to-changelog` during the closing; with `CHANGELOG.md` at the root, the cut of `sdd-end-release` writes it |
| `.docs/sdd/architecture.md` | It's read in step 1. If it's missing and the feature has to create it, it's traced from `architecture-template.md` of `sdd-templates` |
