---
id: 20261029-190601-feature-0246-baseline-detached-worktree
feature: 0246
title: La línea base corre en un worktree desanclado, y la pasada de fix no adjudica lo que mete
mode: full
profile: delegate
status: approved
created: 2026-10-29
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-29
---

# Spec — La línea base corre en un worktree desanclado, y la pasada de fix no adjudica lo que mete

🦆 Hoy la línea base de `sdd-worktrees` corre en el árbol de la rama: en la 0238 encontró a medias los RED de la Task 2 y salió roja sin que la rama tuviera nada roto. Con el cambio corre en `git worktree add --detach <tmp> HEAD`, el commit de apertura, y el worktree se quita al acabar: su resultado es el de ese commit aunque la sesión escriba tests a la vez. Además, una regla de la pasada de fix: un Important que la re-revisión achaca a la propia pasada de fix se arregla en el hilo y va a ✋ como `sin revisar`, sin ruling que lo deje en pie. Ninguna skill crece: cada fichero editado queda con las mismas palabras o menos.

## Capacidades

- Modificadas: `feature-flow` — la línea base corre en un worktree desanclado en el commit de apertura
- Modificadas: `verification` — un Important que mete la propia pasada no se adjudica

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `verification`) · tamaño: ~40 líneas en 5 ficheros de skills
- Mínimo razonable: ninguna — deja sin mirar si «atribuido a la pasada de fix» (decisión 4) choca con «Una re-revisión nunca abre otra»; lo cubre el repaso de coherencia
```

1. **Dónde vive el worktree de la línea base**: `<padre de los worktrees>/baseline-<id>`, el mismo patrón que el de la revisión final (`review-<id>-<sha corto>`). Allí corre la preparación del paso 2 de `sdd-worktrees` (dependencias y, con `environments.md`, `env:setup`, con su `env:clean` antes de quitarlo): sin dependencias el gate falla con `Cannot find module` (patch 0245). Se quita con `git worktree remove` al acabar, verde o rojo.
2. **El commit de apertura es el `HEAD` del momento**: el paso 5 de `sdd-propose` ya lo commitea antes de los RED de la Task 1, y `sdd-implement` invoca `sdd-worktrees` en su Setup, después. Sin commit de apertura (una feature retomada a mitad), `HEAD` es el último commit: la regla es «el `HEAD` cuando arranca la línea base», no un sha guardado.
3. **Si la línea base sale roja**, se queda el paso de hoy: el mismo comando en un worktree desanclado de la rama de integración, y la deuda. Solo cambia dónde corre la primera pasada.
4. **«Achacado a la pasada de fix»**: el Important cae en líneas que cambió la pasada (`git diff <último revisado>..<sha de la pasada>`) o la re-revisión lo dice. Se arregla como hoy un Critical: test que lo reproduce y falla, arreglo, suite, y ✋ `sin revisar: <sha> — <qué arregla>`. Un Important en código que ya vio la revisión final se sigue adjudicando con `Final: Ruling:`. Por economía de palabras, la viñeta del Critical de «What it leaves open» y la nueva van juntas.
5. *(Recortada en la enmienda del 2026-10-29: RED limpio.)* **El valor que elige un arreglo** se busca en las decisiones y los THEN de la spec antes de escribirlo; vale para la pasada de Native y para el encargo del subagente de fix en SDD (va en la frase que ya comparten, «In both…»).
6. *(Recortada en la enmienda del 2026-10-29: RED limpio dos veces.)* **La regla del efecto** vive en `sdd-tdd`, «Verify RED», en la viñeta «Fails because feature missing»: el test afirma el efecto que nombra el requisito o el hallazgo (lo que se ejecuta, la salida, el fichero que deja), no una variable intermedia ni el nombre de un fichero. `sdd-verify` la nombra en la pasada de Native («Closing the review») y `plan-writing.md` en su punto 1 («Spec coverage»), que ya dice «A task whose test only reads what was written doesn't cover…»: esa frase pasa a nombrar la regla. `plan-writing.md` no tiene sección «Verificación»; la tiene `plan-template.md`, que no se toca: la regla llega al test por `sdd-tdd`, y al plan por el punto 1.
7. **Saldo de palabras por fichero** (regla 6 de `CLAUDE.md`): cada fichero editado de `skills/` acaba con igual o menos palabras que hoy, contadas como `words()` de `word-budget.test.ts` (tabla de abajo). Lo que sale, por fichero: en `sdd-worktrees`, la frase del fallo de la línea base se acorta y salen las filas de «Quick Reference» que repiten el paso 3 (texto del kit, no de superpowers: Art. IX); en `sdd-verify`, las viñetas del Critical y del Important nuevo se funden; en `sdd-tdd`, `sdd-implement` y `plan-writing.md`, la frase nueva sustituye a la que toca. El plan fija cada recorte con su recuento.
8. **El RED antes de la spec** (`tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas»): los frentes estructurales están leídos con fichero y línea — `sdd-worktrees/SKILL.md:130` corre la línea base en el árbol, `sdd-verify/SKILL.md:253` manda adjudicar todo Important abierto, `sdd-verify/SKILL.md:243-247` no pide mirar la spec al elegir un valor —. El del efecto es de conducta y no lo he medido con sujetos antes de la spec: tiene dos casos de campo (0238 §3, verificado; 0235 §1) y su RED, n = 2, abre la Task 2; si sale limpio, la regla se recorta y vuelvo a pedir la aprobación (`tech-stack.md`, «Un baseline que no falla…»). Lo mismo con el del valor de la spec (tres casos de campo, 0257 §2 el último).
9. **Prueba (Art. I)**: `sdd-verify` es skill de verify, así que va su tramo `closing` de la batería como control, más escenarios nuevos en esa batería; `sdd-worktrees`, `sdd-tdd` y `sdd-implement`, humo.
   - `w1` (`sdd-worktrees`, humo): molde con el commit de apertura y un RED de la Task 1 a medio escribir en el árbol; esperado: la línea base corre con `git worktree add --detach … HEAD`, da verde y quita el worktree. RED n = 1, GREEN n = 2.
   - `e1` (`sdd-verify`, efecto): revisión final Native con un Important «`canceladas --desde` sin fecha no filtra nada y no avisa»; esperado: el test de la pasada afirma la salida (el aviso, lo listado), no una bandera. RED n = 2, GREEN n = 2.
   - `f1` (`sdd-verify`, Important de la pasada): la re-revisión vuelve con un Important en las líneas de la pasada de fix; esperado: test, arreglo y ✋ `sin revisar`, sin `Final: Ruling:`. RED n = 1, GREEN n = 2.
   - `s1` (`sdd-verify`, valor de la spec): un Minor «no dice si es el local o el remoto» con `review.minors: fix` y una spec que fija el local; esperado: el arreglo dice el local. RED n = 2, GREEN n = 2.
   - `t1` (`sdd-tdd`, humo): un implementador con la Verificación «sin scripts de bash»; esperado: el test mira la primera línea `#!`, no la extensión. RED n = 1, GREEN n = 1.
   - Controles: `c1`, `c1f`, `c5` y `c6` de la batería de `sdd-verify`, n = 1, sobre el texto editado.
10. **Previsión de coste**: RED 7 sujetos, GREEN 9, controles 4, una tanda de REFACTOR de 4 = 24 sujetos Sonnet a ~0,5 $ (entre los ~0,35 $ de los demás y los ~0,70 $ de `sdd-archive` de `tech-stack.md`) ≈ 12 $; con el 20 % de reserva, techo 15 $. ~2 h de campaña. Con más de 15 $ paro y decides tú.
11. **Una pieza entra, otra sale**: entran la regla del worktree de la línea base, la del efecto, la del valor de la spec y la del Important de la pasada; salen las palabras de la decisión 7, hasta dejar cada fichero igual o por debajo. Ningún tope de `word-budget.test.ts` cambia.

- Repaso de coherencia: el THEN de «Un valor que elige la pasada de fix sale de la spec» citaba «la decisión 5» de otra spec y `sdd capability merge` lo rechazó; ahora lleva el literal. La regla de adjudicar solo vive en `sdd-verify/SKILL.md:253` para la revisión final: los «Adjudicate» de `sdd-implement` son del bucle por task, fuera del alcance.
- Delta probado con `sdd capability merge` sobre una copia de `.docs/sdd` (2026-10-29, antes de las enmiendas, que quitan dos de los cuatro requisitos añadidos; tras ellas lo fusionó el cierre): añadido «La línea base corre en un worktree desanclado en el commit de apertura» en `feature-flow`; sustituido «La revisión se cierra una vez» y añadidos «Un Important que mete la pasada de fix no se adjudica», «El test de la pasada de fix afirma el efecto del hallazgo» y «Un valor que elige la pasada de fix sale de la spec» en `verification`; `sdd capability check` sobre la copia: `Capacidades válidas: 20`.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (solo texto de skills y baterías) · sujetos de la campaña RED/GREEN en Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide tu `CLAUDE.md`.

### Decisiones tomadas con el dev-lead

- Carril feature, perfil `delegate`, al fusionar `sdd merge --push` — «Arranca la 0246 con sdd-propose, carril feature … Perfil delegate. Al fusionar, `sdd merge --push`.»
- La línea base corre en `git worktree add --detach <tmp> HEAD`, como la revisión final, y el worktree se quita al acabar; la sesión sigue en el suyo — literal del prompt de arranque
- La 0256 entra entera: la regla del efecto va en `sdd-tdd`, nombrada desde `sdd-verify` y `plan-writing.md` — «Sí, los 5 grupos» (2026-10-29); su regla del efecto la sustituye la enmienda del 2026-10-29 (RED limpio)
- Pasada de fix: antes de escribir un valor (un sha, un literal, un umbral), lo busca en las decisiones de la spec — literal del prompt de arranque (3.er caso, ticket de la feature 0257 §2); la sustituye la enmienda del 2026-10-29 (RED limpio)
- Ningún arreglo alarga una skill: el saldo de palabras de cada skill editada queda igual o baja — literal del prompt de arranque (regla 6 de `CLAUDE.md`)

## Intent

Hoy la línea base corre en el árbol donde la sesión ya escribe los RED, y una línea base roja por ficheros a medio escribir no dice nada de la rama (0238 §2: 30 tests y el `tsc` en rojo, una línea base perdida). Y la pasada de fix de la revisión final falla de tres maneras que ha dado el campo: prueba un indicador y no el efecto (0235 §1, 0238 §3), elige un valor contra una decisión de la spec (0257 §2) y, cuando la re-revisión encuentra lo que la propia pasada metió, la regla solo deja adjudicarlo (0236 §4). El éxito: la línea base da el resultado del commit de apertura pase lo que pase en el árbol; el test de la pasada afirma lo que se ejecuta o se imprime; ningún arreglo contradice la spec; y ningún Important metido por la pasada llega al merge con un ruling. El fracaso, aunque funcione: que alguna skill crezca, o que la línea base se haga más lenta de lo que cuesta instalar dependencias en el worktree temporal.

## Scope

- Entra: `skills/sdd-worktrees/SKILL.md` (paso 3 y «Quick Reference»), `skills/sdd-implement/SKILL.md` (Setup, paso 1), `skills/sdd-verify/SKILL.md` («Closing the review»), los escenarios nuevos de `tests/batteries/sdd-verify/` y `tests/batteries/sdd-implement/` y la evidencia `tests/baseline-detached-*.md`, `tests/fix-pass-effect-*.md`.
- No entra: la parte de carga de «El baseline del gate de cierre sale rojo si el hilo corre tests a la vez» (un `vitest` a mano a la vez), que sigue abierta; `plan-template.md`; la revisión final (ya corre desanclada); la CLI.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La línea base corre en el árbol de la sesión | `skills/sdd-worktrees/SKILL.md:130`; `skills/sdd-implement/SKILL.md:33` | corre en un worktree desanclado en `HEAD` (decisión 1) |
| «If tests fail: run the same command in a detached worktree of the integration branch (`git worktree add --detach`, removed when done)» | `skills/sdd-worktrees/SKILL.md:134` | se acorta: el mecanismo ya lo dice la frase de arriba |
| Filas «Baseline command», «Gate filters by a base» y «Tests fail during baseline» de «Quick Reference» | `skills/sdd-worktrees/SKILL.md:161-163` | salen o se funden en una (decisión 7) |
| «An Important or a Minor: adjudicate it…» | `skills/sdd-verify/SKILL.md:253`; `capabilities/verification.md:92` | se queda para lo que ya revisó la revisión final; el Important de la pasada se funde con la viñeta del Critical (decisión 4); delta `MODIFIED` «La revisión se cierra una vez» |
| «Fails because feature missing (not typos)» | `skills/sdd-tdd/SKILL.md:123` | no cambia: la regla del efecto salió en la enmienda del 2026-10-29 |
| «A task whose test only reads what was written doesn't cover «has asked…»» | `skills/sdd-propose/references/plan-writing.md:23` | no cambia (enmienda del 2026-10-29) |

- Filas que implementa: 0246 → `roadmap.md:33` (a ✅ al cerrar); 0256 → `roadmap.md:43` (aparcada, absorbida: sale con la 0246); deuda que salda: «La pasada de fix mete un Important y la regla solo deja adjudicarlo» (`roadmap.md:629`, entera); «Una verificación de ausencia mira el nombre de los ficheros y no la propiedad» (`roadmap.md:603`) no se salda: su RED salió limpio (enmienda del 2026-10-29) y la fila lleva esa evidencia; en parte, «El baseline del gate de cierre sale rojo si el hilo corre tests a la vez» (`roadmap.md:564`, la del árbol; queda la de carga). Buscado `0246` y `0256` en `skills/`, `capabilities/`, `.docs/sdd/*.md`, `CLAUDE.md`, `tests/batteries/` y `cli/`: solo el roadmap y los tickets.

## Approach

Task 1, la línea base: el paso 3 de `sdd-worktrees` abre con el worktree desanclado en `HEAD` y la preparación del paso 2 dentro (decisiones 1-3); `sdd-implement` Setup paso 1 lo dice en su frase. Task 2, el efecto: sin cambio de skill tras su RED limpio (enmienda del 2026-10-29). Task 3, la pasada de fix: la viñeta fundida de «What it leaves open» (decisión 4). Cada task mide su saldo de palabras.

## Dónde se prueba

- La línea base: `w2` (y `w1` de control), sujetos de `sdd-implement` en su Setup sobre un molde con commit de apertura y un RED a medio escribir.
- El Important de la pasada: `c8` en la batería de `sdd-verify`, sobre el molde `reservas`, como `c5` y `c6`. El efecto y el valor de la spec, recortados por su RED: `c7`, `c9` y `t6` quedan en las baterías como controles.
- El saldo: un recuento por fichero antes y después en el walkthrough, y `cli/test/kit/word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: «commit de apertura» (el `HEAD` cuando arranca la línea base, decisión 2); «achacado a la pasada de fix» (decisión 4).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `feature-flow`

#### ADDED — La línea base corre en un worktree desanclado en el commit de apertura

- GIVEN la 0010 con el commit de apertura `a1b2c3d` en `feature/0010-cancel` y la línea base de `sdd-worktrees` en segundo plano
- WHEN la sesión escribe los RED de la Task 1 en su árbol mientras la línea base corre
- THEN la línea base corre en `git worktree add --detach <padre de los worktrees>/baseline-0010 HEAD`, con las dependencias (y `env:setup`, si hay `environments.md`) instaladas allí, y su resultado es el de `a1b2c3d`: no cambia con los ficheros que la sesión escribe
- AND al acabar, verde o rojo, quita ese worktree (`env:clean` antes, si hubo `env:setup`); la sesión sigue en el suyo
- AND si sale roja, corre el mismo comando en un worktree desanclado de la rama de integración, como «El worktree de la implementación lo prepara `sdd-worktrees`»

### Capacidad: `verification`

#### MODIFIED — La revisión se cierra una vez

- GIVEN la revisión final sobre `a1b2c3d`, con 1 Important del eje Código y 1 Minor del eje Spec
- WHEN el hilo la procesa, con cualquier método
- THEN el Important entra en una sola pasada de fix (en Native, el hilo con TDD; en SDD, un subagente con todos los hallazgos de todos los ejes), y el Minor, sin `review.minors` en `sdd-kit.json` o con `defer`, va al ledger como `Final: minor (deferred): <una línea>`
- AND con `"review": {"minors": "fix"}` en `sdd-kit.json`, el Minor entra en esa misma pasada sin preguntar, y el ledger lo apunta como `Final: fixed <hallazgo> — <test> RED→GREEN, suite <N>/<N>` (si ningún test lo reproduce, `Final: fixed <hallazgo> — suite <N>/<N>`), nunca como `minor (deferred)`
- AND justo antes de presentar la validación (con `validation.mode: field`, antes de pasar al cierre), despacha una sola re-revisión con `sdd-kit:effort-high` + `opus`, con la cabecera de `encargo-revision.md` y `re-review-prompt.md`, los hallazgos abiertos de todos los ejes y el «What to Check» de los ejes que salieron, sobre el paquete `sdd review package <plan> a1b2c3d HEAD`; apunta `Re-revisión: a1b2c3d..<head>, sdd-kit:effort-high + opus, <veredicto>`
- AND en SDD la fix wave no lleva otra re-revisión: es esta
- AND un Important que la re-revisión deja abierto en código que ya vio la revisión final, el hilo lo adjudica con `Final: Ruling:` y llega a ✋ en la presentación y en el walkthrough, sin otra pasada de fix ni otra re-revisión; uno que mete la propia pasada de fix no se adjudica («Un Important que mete la pasada de fix no se adjudica»)
- AND si desde `a1b2c3d` solo hay commits que se revisan en el hilo, no despacha re-revisión

#### ADDED — Un Important que mete la pasada de fix no se adjudica

- GIVEN la pasada de fix `b2c3d4e` sobre la revisión final de `a1b2c3d`, y una re-revisión que vuelve con 1 Important en líneas que cambió `b2c3d4e`: «`canceladas` enseña la franja de la reserva equivocada»
- WHEN el hilo cierra la revisión
- THEN no lo adjudica con un ruling: escribe el test que lo reproduce, lo ve fallar, lo arregla, corre la suite y lleva a ✋ `sin revisar: <sha> — arregla el Important «canceladas enseña la franja de la reserva equivocada»`
- AND no despacha otra re-revisión
- AND un Important que la re-revisión achaca a la pasada sin que caiga en sus líneas, porque lo dice su informe, sigue el mismo camino

## Topes de palabras

| Fichero | Hoy (palabras) | Después |
| --- | --- | --- |
| `skills/sdd-worktrees/SKILL.md` | 1435 | ≤ 1435 |
| `skills/sdd-implement/SKILL.md` | 9583 | ≤ 9583 |
| `skills/sdd-verify/SKILL.md` | 3567 | ≤ 3567 |

## Enmiendas

- 2026-10-29 — Sale el requisito «Un valor que elige la pasada de fix sale de la spec» y la decisión 5 queda sin regla: su RED (`c9`, n = 2) salió limpio, los dos sujetos usaron el 20 de la spec y no el 10 del revisor (`tests/fix-pass-effect-red.md`); Art. I. La regla del efecto sigue, con su RED repetido sobre un molde más duro: el primero salió limpio en los 2 sujetos válidos con un molde que lo ponía fácil — aprobada: opciones «Recortarla (Recomendada)» y «Endurecer y medir (Recomendada)» (dev-lead, 2026-10-29)

- 2026-10-29 — Sale el requisito «El test de la pasada de fix afirma el efecto del hallazgo» y la decisión 6 queda sin regla: el RED repetido sobre el molde endurecido (`--desde` en la spec, el hallazgo que nombra la bandera `missing`) salió limpio 2/2, como el primero y `t6` (`tests/fix-pass-effect-red.md`); no se tocan `sdd-tdd` ni `plan-writing.md` — aplica la opción «Endurecer y medir (Recomendada)»: «si sigue limpio, recorto la regla» (dev-lead, 2026-10-29)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-29 | aprobada (opción «Apruebo») |
