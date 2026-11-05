## Config lane

1. With the lane confirmed, make the change. If it turns out to change what the product's user sees or can do, the lane goes up (step 2 of `sdd-propose`).
2. Run the `Build` of `operations.md` if it declares one and its §Testing `Gate de cierre`; without that gate, the one in `tech-stack.md` §Testing; without either, the constitution's, as «Running a gate» of `sdd-verify` says. With no gate anywhere, say so and ask what to run: never invent a command (`tests/sdd-propose-0160-red.md`, k1).
3. Gate red → don't commit; say what failed.
4. Gate green → one commit on the current branch, whose body carries the `Gate:` line of `sdd-verify`, one entry per task of the gate: `` Gate: `<comando>` → <tarea>: corrió <N>/<M> · <tarea>: saltada (<porqué de la herramienta>) ``; a task whose definition you edited runs without the filter first (`tests/affected-gate-red.md`, k6). On the stable branch of the constitution's git-flow (`main`) don't commit: in `pair` and `delegate` stop and ask; in `unattended` leave it uncommitted and report it.
5. If the branch is a `feature/*` whose only commit above `merge.into` (`git log <into>..HEAD`) is this config commit, merge it as a closing does, by the «Merge to develop» and «Push» rows of the [gate table](control-profiles.md): `sdd merge --project-root "<worktree>"`, run as `sdd-propose`'s `SKILL.md` runs the CLI, with `--push` when those rows say so. On any other branch, don't merge: the commit stays where it is, and you say so.

No spec, plan, folder, id, roadmap row, changelog entry, estimate or `sdd-feedback` ticket: there is no behavior to tell.

## Red flags — STOP

- You're about to edit a dependency, CI or a setting without asking, or to commit it without running the gate.
