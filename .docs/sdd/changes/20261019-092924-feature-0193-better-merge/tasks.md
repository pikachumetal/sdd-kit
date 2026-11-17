---
id: 20261019-092924-feature-0193-better-merge
title: Tasks — Merge mejor que el de git por defecto
spec: ./spec.md
plan: ./plan.md
created: 2026-10-19
---

# Tasks — Merge mejor que el de git por defecto (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0193-better-merge`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Opciones de git y Mergiraf en la cadena de resolución | done | d36f314c | reescritura de marcas en diff3 (ruling) |
| 2 | Registros por id | done | 8aa46dc | |
| 3 | `sdd merge --sync` y el merge de sincronización de `sdd-archive` | done | 51fa7ad9 | RED a3c rojo; GREEN a3 2/2, a3n 1/1, a3c 1/1 (1,98 $) |
| 4 | Hotfix: etiqueta y vuelta antes de tocar nada | done | 483435c9 | |
| 5 | Menores de código de la 0187 | done | 2b1374d6 | menor 4 no se junta (ruling) |

## Verificación por task

- [x] Task 1 — `npx vitest run test/merge` (en `cli/`)
- [x] Task 2 — `npx vitest run test/merge`
- [x] Task 3 — `npx vitest run test/merge`; Pester de `WordBudget` y `ArchiveSkill`; batería `sdd-archive` (`a3c` RED; `a3`, `a3n`, `a3c` GREEN)
- [x] Task 4 — `npx vitest run test/merge`
- [x] Task 5 — `npx vitest run test/merge`

## Fixes adicionales

## Rulings

- Task 3: Ruling: tests/SyncMerge.Tests.ps1 fija «git merge --no-edit <remote>/<merge.into>» y «A conflict only in the three registers…»: se reescribe con --sync en el Step 3 — el plan no lo listaba — si me equivoco, el pre-commit lo caza
- Task 1: Ruling: la reescritura de marcas para resolver se queda en --conflict=diff3, no zdiff3 (decisión 5 de la spec) — zdiff3 saca las líneas comunes ('  }') fuera del trozo y la unión de trozos que solo añaden dejaría dos métodos sin cerrar (comprobado en un repo temporal); git merge sí lleva zdiff3 — si me equivoco, nada observable: el trozo que llega a una persona tras el abort no existe
- Baseline: Ruling: gate de cierre con kit:test 1322/0 y cli:test-min 1214 pass / 3 fail — los 3 son los RED nuevos de mergiraf.slow.test.ts, que la baseline recogió al correr mientras los escribía; el árbol de la apertura estaba verde — si me equivoco, un rojo previo se vería en el gate final
- Task 1: Ruling: el test lento de Mergiraf cambió tras el RED en la preparación (fetch antes de integrar origin/develop en las ramas; aserción de config con --local y por clave, porque el git global del dev tiene merge.guitool) — no cambia lo que se comprueba — si me equivoco, nada
- Task 2: Ruling: el test lento de roadmap pasó a tener conflicto real (la destino también añade la 0200): con solo marcar la 0190 git ya fusionaba sin conflicto y el test no era RED; el de CHANGELOG.md con la misma entrada en los dos lados ya lo fusiona git (cambio idéntico) y queda como guarda — si me equivoco, nada
- Task 3: Ruling: el GREEN corre a3 con la n de la batería (2), no 1 como decía el plan: el runner toma la n de battery.md; techo de 5 sujetos en total, dentro de los ~6 $ previstos — si me equivoco, un sujeto de más
- Task 4: Ruling: el test de dos releases pasó a releases que solo están en el remoto (creadas por otra sesión) con main remota adelantada: con ramas locales el código de hoy ya abortaba antes de tocar nada y el test no era RED; openRelease publica la release, porque con remoto solo cuentan las del remoto; se quita el test de 'v3..0' (git no la crea), que ahora es la etiqueta inválida con 2 — si me equivoco, nada
- Task 3: Ruling: task done con sync, usage y registries en vez de todo test/merge: los RED de la Task 4 ya están escritos en hotfix.slow.test.ts sin commitear y el conjunto entero saldría rojo por ellos; test/merge entero pasó en el pre-commit (cli:test) y pasará en la Task 4 — si me equivoco, un rojo de la Task 3 se vería en la Task 4
- Task 5: Ruling: menor 4 (esqueleto parecido entre integrate/integrateHotfix y publish/pushAll) no se junta: el hotfix maneja dos checkouts, la etiqueta y un push atómico sin reintentos, y el merge normal reintenta; un esqueleto común necesitaría callbacks para cada diferencia y se lee peor que las dos funciones — si me equivoco, una refactorización sin cambio de conducta
- Task 5: Ruling: los tests de los menores 8 y 10 (--verified-at con sha de otra rama y con código de la rama) ya pasaban: el menor pedía la cobertura, no un arreglo — si me equivoco, nada
- Task 5: Ruling: report del hotfix tenía 4 parámetros (fuera de la lista de la 0187): pasa a 3 con { ...paths, tagged } — si me equivoco, nada
- Final: Ruling: Código I1 (reescritura de marcas con --conflict=diff3 y no zdiff3, como dicen la decisión 5 de la spec y las Restricciones del plan) — se queda diff3: zdiff3 saca las líneas comunes del trozo y la unión de trozos que solo añaden deja dos métodos sin su llave de cierre (comprobado en un repo temporal, ruling de la Task 1); git merge sí lleva zdiff3 — si me equivoco, ningún efecto visible: tras el abort no queda trozo con marcas
- Final: Ruling: Spec I2(a), duplicados que git fusiona sin conflicto en sitios distintos — fuera, por la decisión 8 aprobada — si me equivoco, una fila doble que roadmap check no caza
- Final: Ruling: no verificado «veredictos de la batería» — verificados en el hilo: transcripciones en specs/…/red/out y green/out, puerta y conducta leídas fila por fila — si me equivoco, un GREEN mal puntuado
- Final: Ruling: no verificado «docs-claims acepta --sync» — cli:test del pre-commit (incluye docs-claims.test.ts) pasó 1039/1039 en los commits de las Tasks 3-5 — si me equivoco, nada
- Final: Ruling: no verificado «suite completa» y «Mergiraf en CI» — el gate de cierre corre en la validación en esta máquina, con mergiraf 0.20.0 en el PATH; en CI sin mergiraf, describe.skipIf salta sus tests — si me equivoco, Mergiraf sin test fuera de esta máquina
- Final: Ruling: declinado «git merge --ff-only sin -c/-X» — un fast-forward no hace merge de tres vías: las opciones no cambian nada — si me equivoco, nada
- Final: Ruling: declinado «Mergiraf resuelve un import que cambian los dos lados» — es lo que decidió el dev-lead (código 0 → sigue, la suite corre sobre el resultado) — si me equivoco, un import mal unido que la suite no ve
- Final: Ruling: declinado «--sync sin cerrojo» — decisión 3 de la spec: no toca la rama destino — si me equivoco, dos --sync a la vez en el mismo worktree, que git ya bloquea con su index.lock
- Final: Ruling: declinado «tests RED modificados en hotfix.slow.test.ts» — rulings de la Task 4 en el ledger — si me equivoco, nada
- Final: Ruling: declinado «etiqueta que empieza por -» — check-ref-format la acepta y git tag la leería como opción; heredado, no lo trae la rama — si me equivoco, un error de git con código 1
- Final: Ruling: «Dónde se prueba» de histogram — solo el test de mergeArgs, sin caso myers/histogram estable (decisión 7 del plan) — si me equivoco, histogram sin prueba de efecto
- Final: Ruling: el descarte del merge driver no va a tech-stack.md (decisión 10 de la spec): tech-stack, architecture y constitution están en su tope de palabras (tech-stack 18797/18800) y subirlo es del dev-lead; queda en la decisión 10 de la spec y en el walkthrough — si me equivoco, el descarte no está en el documento de anclaje hasta que el dev-lead suba el tope (~35 palabras)

## Minors diferidos

- assertTagFree da la etiqueta por libre si ls-remote --tags falla por red (el fetch posterior para el merge, pero --check puede decir «listo»)
- decideBack pinta 'null' si la vuelta no tiene remoto
- --sync en HEAD desacoplado pinta 'undefined' e ignora --branch en silencio
- mergeKeyedHunk arrastra un campo lines vacío en el objeto merged
- MARKER duplicado en registries.ts y mergiraf.ts
- exits.ts reexporta isRegistry solo para su test
- mergiraf.test.ts no limpia su mkdtemp
- el aviso «registros: dos filas distintas…» sale aunque el merge acabe abortado por otro fichero
- completeMergeAttempt mezcla el ternario y la condición de conflicted.length; un early return lo aclararía
- el test de Review Focus 4 (--sync con MERGE_HEAD) pasa por el conflicto UU y no aísla MERGE_HEAD
- el test de Review Focus 5 (--check sin fetch) no distingue con fetch y sin él
- «vuelta: no se pudo consultar» sin test (revisado por el eje Spec: distingue 0, 2 y lo demás)
- la receta no nombra base: integrada ni el error de cambios sin commitear de --sync
- un fallo de git merge sin conflicto en --sync sale como «el hook rechazó el merge»
- el fetch de release/* no lleva --prune: una release borrada en el remoto sigue contando como abierta
- dedupeRows usa `seen.set(...) !== undefined` como truco para devolver true
- dedupeRows compara solo con la primera fila de cada id: con a, b, b se quedan las dos b
- la unión de trozos en un registro deja dos líneas en blanco seguidas (cosmético)
- lineKey da id a la cabecera de una tabla (anterior a la pasada de fix)

Revisión final: Spec opus+high, con arreglos (3 Important) · Código sonnet+high, con arreglos (2 Important) · Arquitectura no (plan), sobre 2b1374d6
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN y 1 refactor
Re-revisión: juntada en el cierre, desde 2b1374d6, sdd-kit:effort-high + opus, limpia (3 Minor diferidos)
