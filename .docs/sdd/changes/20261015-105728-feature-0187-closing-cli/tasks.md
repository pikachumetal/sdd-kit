---
id: 20261015-105728-feature-0187-closing-cli
title: Tasks — CLI del cierre
spec: ./spec.md
plan: ./plan.md
created: 2026-10-15
---

# Tasks — CLI del cierre: `sdd merge` para el hotfix, el destino sacado, la base en rojo, la suite una vez y el push que reintenta (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0187-closing-cli`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Destino sacado con `diff --stat` y salidas, y `--check` | done | 26c4dcd2 | |
| 2 | La suite una vez: `--verified-at` | done | 888a7121 | |
| 3 | La base en rojo | done | 6ee0c340 | |
| 4 | El push que reintenta | done | 1af2af94 | |
| 5 | El hotfix con git-flow: `--into`, `--order` y `--tag` | done | 6be691bb | |

## Verificación por task

- [x] Task 1 — `vitest run test/merge/exits.test.ts test/merge/destination.slow.test.ts test/merge/failures.slow.test.ts`
- [x] Task 2 — `vitest run test/merge/verified-at.slow.test.ts test/merge/verify.slow.test.ts test/merge/usage.test.ts`
- [x] Task 3 — `vitest run test/merge/base-red.slow.test.ts test/merge/verify.slow.test.ts test/merge/failures.slow.test.ts test/merge/verify.test.ts`
- [x] Task 4 — `vitest run test/merge/push-retry.slow.test.ts test/merge/lock-and-base.slow.test.ts test/merge/failures.slow.test.ts`
- [x] Task 5 — `vitest run test/merge/` (11 ficheros, 65 tests)

## Revisión

- Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 6be691bb
- Pasada de fix: juntada en el cierre, 2 hallazgos RED→GREEN (más 2 tests que fijan comportamiento ya correcto y el refactor de `integrateHotfix`)
- Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important a medias adjudicado como ruling y 6 Minor diferidos

## Rulings

- Baseline: Ruling: gate de cierre con cli:test 866/866, cli:test-slow 157/157, cli:test-min 1023/1023 y kit:test 1258 pass / 1 fail (FastSuiteBudget 34,2 s > 30 s con la máquina cargada por el propio gate) — es la fila 0190 del roadmap (mutex de moon), deuda conocida, no de esta feature; sigo — si me equivoco, un rojo real del conjunto rápido quedaría tapado hasta el gate final, que lo repite.
- Task 1: Ruling: destinationExits(path, files) sin el parámetro into del plan — no lo usa ningún texto de las salidas; el test RED cambia solo en esa llamada — si me equivoco, añadir un parámetro.
- Task 1: Ruling: checkDestination no hace worktree prune (solo lectura, spec «sin cambiar ningún ref, índice ni fichero»); ignora los registros de worktree cuya carpeta no existe — si me equivoco, un --check con un registro podado a mano daría el temporal en vez de sacado, igual que el merge tras su prune.
- Task 2: Ruling: los tests van en un verified-at.slow.test.ts nuevo y no en verify.slow.test.ts ni usage.test.ts — el de --verified-at nada necesita un repo, y separarlo deja cada fichero con un requisito — si me equivoco, mover tres tests.
- Task 3: Ruling: tests en base-red.slow.test.ts nuevo en vez de verify.slow.test.ts, y el log de la base se llama sdd-merge-verify-base-<stamp>-<pid>.log para no pisar el de la verificación del mismo segundo — si me equivoco, mover tres tests.
- Task 4: Ruling: tests en push-retry.slow.test.ts nuevo en vez de lock-and-base.slow.test.ts; «último commit verificado» = HEAD antes de reintegrar, haya corrido la verificación o se omitiera por docs (equivale a medir desde --verified-at, porque HEAD solo difiere de él en docs) — si me equivoco, una re-verificación de más o de menos tras un push movido.
- Task 5: Ruling: publishFromSeed pasa de push-retry.slow.test.ts a helpers.ts para compartirlo con hotfix.slow.test.ts; el test de la Task 4 solo cambia su import — si me equivoco, nada.
- Task 5: Ruling: verifyMerge y explainFailure (la línea base:) se mueven a verify.ts para que los usen run.ts y hotfix.ts sin importarse en círculo; Job se exporta de run.ts como tipo — si me equivoco, un movimiento de código.
- Task 5: Ruling: la vuelta a una release/ que el remoto no tiene no se sincroniza con el remoto, y el push atómico la publica — si me equivoco, el hotfix publica una release que solo estaba en local.
- Task 5: Ruling: el mensaje de vuelta con conflicto dice «y la etiqueta» solo si hay --tag — el literal de la spec es el caso con etiqueta — si me equivoco, un texto.
- Task 5: Ruling: el destino de la vuelta usa el worktree temporal merge-<rama>-<vuelta> (merge-0200-fix-develop), para no chocar con el de la rama estable — si me equivoco, un nombre de carpeta.
- Task 5: Ruling: --order con --into igual a merge.into también se registra en el commit — si me equivoco, una línea de más en un merge normal.
- Task 5 (superado por la pasada de fix): Ruling: el destino de vuelta se decide con los refs que hay antes del cerrojo, sin fetch; una release/ abierta en el remoto tras el último fetch no se ve — si me equivoco, la vuelta va a develop en vez de a esa release.
- Final: Ruling: Código I3 (*.md fuera de .docs cuenta como docs, también skills/*.md) — es la regla de ✋4 de la spec aprobada; restringirla cambiaría la spec — si me equivoco, en este repo un merge cuya base solo avanzó en skills/*.md salta --verify, aunque esos cambios ya pasaron su propio gate.
- Final: Ruling: Spec Minor «negativas de uso del hotfix en hotfix.slow.test.ts y no en usage.test.ts» — dependen de la política del repo (merge.into), así que necesitan un repo de prueba — si me equivoco, mover dos tests.
- Final: Ruling: el comentario «ponytail:» de pushAll se queda: es el marcador de atajos de las reglas de estilo del dev-lead (code-style.md) — si me equivoco, una palabra.
- Final: Ruling: Re-revisión I1 a medias — prepareHotfix aún decide «varias ramas release/ abiertas» antes del cerrojo con los refs locales, sin fetch; la vuelta que se usa ya se decide tras el fetch — el fallo posible es conservador: aborta con «fusiona a mano» cuando el remoto ya cerró una de las releases o no hay into local, y nunca publica en una rama equivocada; basta un git fetch y relanzar — si me equivoco, un hotfix que había que hacer abortaría hasta que alguien haga fetch.

## Minors diferidos

- más de 3 parámetros en explainFailure, verifyMerge, openReleases (ahora 3) y mergeFeature (superado en uno)
- mergeBranch 21 líneas e integrate ~22, contando firma y llave
- MERGE_CONFLICT parsea el texto de attempt.ts; una clase MergeConflict lo evitaría
- esqueleto parecido entre integrate/integrateHotfix y publish/pushAll (dos copias)
- pushAll publica la vuelta con el remoto de --into
- un fallo de red en ls-remote cuenta como vuelta no publicada y se salta su sync
- isRegistry casa por basename en cualquier carpeta
- el test del Review Focus 1 usa un sha antecesor (feature/0001); falta uno de otra rama
- una etiqueta que solo existe en el remoto no se detecta antes de tocar nada
- --verified-at solo se prueba con código cambiado en la base, no en la rama
- «varias release/ abiertas» puede salir tras syncBaseBranch de la estable (into local ya avanzada en fast-forward al remoto), no «antes de tocar nada»
- no se mira el código de salida del fetch de release/* en mergeHotfix
- un nombre de etiqueta inválido sale con 1 tras fusionar y deshacer; git check-ref-format en prepareHotfix lo daría con 2 antes de tocar nada
- el hook pre-receive de los tests se escribe sin bit de ejecución (mismo patrón que el test de failures.slow.test.ts que ya existía); en POSIX git lo ignoraría
- el comentario de mergeHotfix dice «rama estable ya integrada» cuando solo está sincronizada con el remoto
- back: '' de relleno en prepareHotfix
