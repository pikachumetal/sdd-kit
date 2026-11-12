# Records — detail

## Real time

With `.docs/sdd/steering/estimation.md`, step 2 of `sdd-archive`: a deviation beyond ±30 % cites its cause by `Esperas y huecos` hours and minutes, or says «sin medir»; if you don't know the time, ask, and without an answer approximate it and say so.

## Capabilities

- **The old literal of a `MODIFIED`**: before merging, search the old clause of each `MODIFIED` (its `(antes: …)`, or each phrase of the living requirement it changes) in the whole capability file. Each appearance outside that requirement is fixed through the artifact's delta —a `MODIFIED` of the other requirement, or the «Reglas de la capacidad» entry with its full value—, never by hand, and the walkthrough or `patch.md` names it.

### Capabilities of a patch

`Patch only:` open the capability that describes the piece the fix touched and compare it with what it does now. If the fix only brings it back to what the capability says, there's no delta: «Capacidades» says `Ninguna, porque el fix devuelve <comando> a lo que ya dice <nombre>`, and an empty delta section of the template goes. If it changed something observable the capability says otherwise or doesn't say, the block says `- Modificadas: <nombre> — cambia «<requisito>»` and the delta goes in «Delta de capacidad». A patch creates no capability: with none describing the piece, `Ninguna, porque ninguna capacidad describe <pieza>`, and the final message says so.

## Roadmap

- The change's row stays in Now with `✅` (or `🧪 validación diferida a <disparador>`) in «Estado», and doesn't move section: what's done stays in Now until the release is cut, which moves it to the changelog. A change without a row gains one in Now, with its brief: without it, the cut doesn't see it.
- In «Lista» of `.docs/sdd/steering/debt.md`, the rows whose «Destino» is the closed id go; a row settled only in part stays, with «Ítem» rewritten to what's left. Debt the work uncovered goes to «Por triar», with its origin and date.
- If `patch.md` re-measures a debt row the patch doesn't settle, and the result contradicts what the row claims (its evidence, its count, its proposal), rewrite those cells with the new measurement, its date and a link to `patch.md`: the row can no longer claim what the measurement denies.
- After editing and before the closing commit, `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap check --path .docs/sdd`.
<!-- kit: incluye roadmap-check-failures -->

## What's next in the family

The family comes from `parent:` and `proposal:` in the frontmatter of the `spec.md` or `patch.md` you close, and from the roadmap rows carrying the text `parent: <id>` or `proposal: <id>` (in the brief). Its open pieces are the rows with `⏳` or `🔄` and that `parent:` or that `proposal:`; the piece you close counts as closed, because the indexes come before the final message. The recommended one is the first in roadmap order whose dependencies are all closed: the «Tras» column.

The lines are step 9.5's, literal. Besides them:

- Only `proposal:`: the mother is the proposal: «Para acabar la propuesta `<N>` falta: …».
- A mother already closed: only the open sisters, without the last sentence. No `parent:` and no `proposal:`: nothing.
- You don't mark the mother's row: the dev-lead decides.

## History

- `Patch only:` the fix commit carries code, tests and `patch.md`; the close commit, `patch.md` with the fix's hash and the time, plus roadmap, debt, estimation-log and merged capabilities.
- `Feature only:`
<!-- kit: incluye squash-cited-shas -->
The line becomes `Pasada de fix: juntada en el cierre, <n> hallazgos RED→GREEN`.
