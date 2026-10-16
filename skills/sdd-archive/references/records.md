# Records — detail

## Roadmap 2.x

- `Patch only:` with the validation deferred and an open `## Release <N>` section, the patch also gets a row in its table, with the header of `roadmap-template.md` and `🧪 validación diferida a <disparador>` in «Estado»: the release close looks for deferred items there, not in «Patches». A validated patch gets no row there (2/2 didn't add it, `tests/sdd-end-patch-release-row-red.md`).
- If `patch.md` re-measures a debt or backlog row the patch doesn't settle, and the result contradicts what the row claims (its evidence, its count, its proposal), rewrite those cells with the new measurement, its date and a link to `patch.md`: the row can no longer claim what the measurement denies (2/2 left it intact, `tests/fewer-stops-red.md`, s6).
- After editing and before the closing commit, `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap check --path .docs/sdd`. A failure in a line the close wrote you fix in the roadmap, never in the validator. Failures in lines you didn't touch you don't fix and don't stop the close: the final message says how many and that the «Roadmap en la forma de la plantilla» step of the v2.3.0 migration fixes them (3 of 4 closes left it red without saying so, `tests/release-close-roadmap-red.md`, K1).
