# Records — detail

## Roadmap 2.x

- `Patch only:` with the validation deferred and an open `## Release <N>` section, the patch also gets a row in its table, with the header of `roadmap-template.md` and `🧪 validación diferida a <disparador>` in «Estado»: the release close looks for deferred items there, not in «Patches». A validated patch gets no row there (2/2 didn't add it, `tests/sdd-end-patch-release-row-red.md`).
- If `patch.md` re-measures a debt or backlog row the patch doesn't settle, and the result contradicts what the row claims (its evidence, its count, its proposal), rewrite those cells with the new measurement, its date and a link to `patch.md`: the row can no longer claim what the measurement denies (2/2 left it intact, `tests/fewer-stops-red.md`, s6).
- After editing and before the closing commit, `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap check --path .docs/sdd`. A failure in a line the close wrote you fix in the roadmap, never in the validator. Failures in lines you didn't touch you don't fix and don't stop the close: the final message says how many and that the «Roadmap en la forma de la plantilla» step of the v2.3.0 migration fixes them (3 of 4 closes left it red without saying so, `tests/release-close-roadmap-red.md`, K1).

## Roadmap 3.0.0

With `ROADMAP.md` at the project root (otherwise the 2.x form above):

- The change's row stays in Now with `✅` (or `🧪 validación diferida a <disparador>`) in «Estado», and doesn't move section: what's done stays in Now until the release is cut, which moves it.
- In «Lista» of `.docs/sdd/steering/debt.md`, the rows whose «Destino» is the closed id go; a row settled only in part stays, with «Ítem» rewritten to what's left. Debt the work uncovered goes to «Por triar», with its origin and date.
- `sdd roadmap check` checks both files, as in 2.x.

## What's next in the family

The family comes from `parent:` and `proposal:` in the frontmatter of the `spec.md` or `patch.md` you close, and from the roadmap rows carrying the text `parent: <id>` or `proposal: <id>` (in 2.x, in «Ítem»; in `ROADMAP.md`, in the brief). Its open pieces are the rows with `⏳` or `🔄` and that `parent:` or that `proposal:`; the piece you close counts as closed, because the indexes come before the final message. The recommended one is the first in roadmap order whose dependencies are all closed: the «Tras» column in `ROADMAP.md`, «tras <id>» in 2.x.

- Open pieces, one free: «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.», followed by its launch prompt in the form of `launch-prompt-template.md` of `sdd-templates`.
- Open pieces, all blocked: the same first sentence, then «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» instead of the recommendation.
- Only `proposal:`: the mother is the proposal: «Para acabar la propuesta `<N>` falta: …».
- No open piece and the mother still open: «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» You don't mark the mother's row: the dev-lead decides.
- A mother already closed: only the open sisters, without the last sentence. No `parent:` and no `proposal:`: nothing.

## Capabilities of a patch

`Patch only:` open the capability that describes the piece the fix touched and compare it with what it does now. If the fix only brings it back to what the capability says, there's no delta: «Capacidades» says `Ninguna, porque el fix devuelve <comando> a lo que ya dice <nombre>`, and an empty delta section of the template goes. If it changed something observable the capability says otherwise or doesn't say, the block says `- Modificadas: <nombre> — cambia «<requisito>»` and the delta goes in «Delta de capacidad». A patch creates no capability: with none describing the piece, `Ninguna, porque ninguna capacidad describe <pieza>`, and the final message says so.
