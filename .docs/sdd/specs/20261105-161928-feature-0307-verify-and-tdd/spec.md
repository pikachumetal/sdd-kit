---
id: 20261105-161928-feature-0307-verify-and-tdd
feature: 0307
proposal: 0301
title: sdd-verify y sdd-tdd con las tres reglas
mode: full
profile: delegate
status: approved
created: 2026-11-05
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-05
---

# Spec — sdd-verify y sdd-tdd con las tres reglas

🦆 Hoy `sdd-verify` pesa 22.881 bytes y, tras compactar, Claude Code corta lo que pasa de 20.000: lo que se pierde es el cierre de la revisión final, justo la parte que dice que hay una sola pasada de fix y una sola re-revisión. Con esta feature, ese cierre pasa a su propio fichero de `references/`, que la skill manda leer en cuanto vuelven los ejes, y la skill baja a unos 16.900 bytes. Además, cuatro frases que el kit había pegado junto a una regla de superpowers la sustituyen: por ejemplo, «**MANDATORY. Never skip.**» y, debajo, «Also for a RED you received: run it…» pasan a ser una sola frase que ya dice las dos cosas. Y el encargo de revisión, que sigue en castellano, se traduce al inglés, salvo el texto que reciben los revisores, que es el mismo en seis encargos. Hecho cuando `kit:skill-size`, `kit:copies` y `kit:own` no dan rojos de esta fila y `cli:test` pasa.

Validación: agente — es texto que lee el agente: lo observan entero `kit:skill-size`, `kit:copies`, `kit:own`, la suite y el humo de cuatro escenarios de batería; el repo valida en campo (`validation.mode: field`).

## Capacidades

- Ninguna, porque docs: el texto cambia de sitio y de forma, y la conducta que describe `verification` queda igual (su requisito del Minor sin test ya dice `Final: fixed <hallazgo> — suite <N>/<N>`).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: ninguna (sin capacidad nueva, sin delta, sin contrato que consuma otro sistema: el bloque del encargo que leen los revisores no cambia) · tamaño: ~150 líneas en 8 ficheros, casi todo texto que se mueve o se traduce
- Mínimo razonable: ninguna — la fidelidad de cada frase la mira el eje Spec de la revisión final, con el diff contra `develop`; la conducta, el humo
Review hecha: dos revisores, pedidos por el dev-lead — dominio (opus + effort medium) y técnica (sonnet + effort medium)
```

1. **Lo que sale de `sdd-verify/SKILL.md`**: el cuerpo entero de `## Closing the review` (6.307 bytes en `dist/`: la ordenación de hallazgos, Native, SDD, la re-revisión única, «What it leaves open», su tabla de racionalizaciones, el último sha revisado y las líneas de `tasks.md`) pasa a `skills/sdd-verify/references/closing-the-review.md`. Es lo único de la skill que se lee en un solo paso, cuando vuelven los ejes. «Running a gate» y la línea `Gate:` se quedan: las citan `sdd-propose`, `sdd-archive`, `sdd-worktrees` y `merge-recipe.md`, y se leen en cuatro sitios. La skill queda en ~16.900 bytes.
2. **El título se queda con su puntero**: `## Closing the review` sigue en `SKILL.md` con una sola frase, lo primero del paso, en un bloque `<!-- kit: 0307 -->` (`SKILL.md` es una copia anotada): «When the axes return, the first thing in this step is to read [references/closing-the-review.md](references/closing-the-review.md) and follow it, before you act on any finding.» Así siguen valiendo las anclas `#closing-the-review` de la propia skill (`:183`, `:202`) y las citas por nombre de «Closing the review» en `sdd-implement/references/re-review-prompt.md:3`, `sdd-implement/SKILL.md:306`, `sdd-archive/SKILL.md:24` y `sdd-propose/references/control-profiles.md:78`. El ejemplo de `:268` («[Closing the review: re-grade inside each axis, then ONE fix pass]») es del `### Example` de «Final review» y se queda en `SKILL.md`. Por qué así: una regla que solo vive en una referencia no se lee si el paso no la manda abrir (`tech-stack.md`, features 0146 y 0147).
3. **`closing-the-review.md` es propia, sin marcas**: entra en la lista `own` de `upstream.json`, como `encargo-revision.md`, que ya está ahí y bajo la carpeta de la copia `pending: 0297`: `kindOf` de `build/sources.ts` da `own` antes que la carpeta pendiente, y `cli:test` pasa así hoy. Sin `NOTICE`. Su texto es del kit y va sin las marcas `kit: 0312` de los bloques de donde sale. Los enlaces relativos del texto movido se reescriben desde `references/`: `[encargo-revision.md](encargo-revision.md)` y `[re-review-prompt.md](../../sdd-implement/references/re-review-prompt.md)`; las anclas internas a la propia skill, `../SKILL.md#…`.
4. **K31** (`SKILL.md:283`, al moverla): «A fix without a test that failed first is not verified, except a Minor no test reproduces» se sustituye por una frase sin absoluta ni excepción: «A fix is verified by the test that reproduces its finding and failed first, or, when no test can reproduce it (a Minor: a name, a wording), by the whole suite, with the ledger line `Final: fixed <finding> — suite <N>/<N>`.» El Minor sin test se sigue arreglando, como dicen su viñeta y el requisito de `verification`.
5. **`kit:own`, `dist/…/SKILL.md:61`** («every» … «instead of», el punto 3 de «Running a gate»): «the gate with `--base <sha>` instead of `--base <merge.into>`» pasa a «the gate with `--base <sha>`, not `--base <merge.into>`». Misma regla, sin la palabra de excepción; la línea está dentro de un bloque `kit: 0312` y la marca no cambia.
6. **`sdd-tdd`, las dos líneas «→ 0307» de `kit:copies`**, cada una sustituye la frase de superpowers en lugar de ir debajo:
   - `:121-123`: «**MANDATORY. Never skip.**» + «Also for a RED you received: run it before touching the code it covers…» → una frase: «**MANDATORY, a RED you received included: never skip it.** Run it before touching the code it covers, and keep the command and the failing output for the report's «TDD Evidence».»
   - `:318-320`: «- [ ] All tests pass» + «(the task's «Verificación»)» → «- [ ] The task's «Verificación» passes». Coincide con «"Other tests" means the task's «Verificación»», ya en Verify GREEN.
7. **K34 y K35 de la 0299, en `sdd-tdd`** (research.md §5 los da a esta fila):
   - K34, `:136-138`: «Fix test.» y debajo «A test you received: report it…» → «**Test passes?** You're testing existing behavior. Fix a test you wrote; report a test you received (`DONE_WITH_CONCERNS` with the green output), and don't write code to «make it pass».»
   - K35, `:140-142`: la regla del error de compilación está dos veces (en «Confirm:» y tras «Test errors?»). Se queda en «Confirm:», que ya sustituye «errors)», y «Test errors?» sustituye «Fix error,» para no contradecirla: «**Test errors?** Any other error: fix it, re-run until it fails correctly.» Sale la frase del kit repetida.
   - La línea de las Red Flags «(a RED you received: report it, see Verify RED)» no la toco: la 0299 no la da como hallazgo y `kit:copies` tampoco.
   - Riesgo aceptado: K34, K35 y la checklist quedan sin escenario. `t1c` (RED recibido que ya pasa) no carga `sdd-tdd`, y la conducta de cada una es la de la frase del kit que ya estaba debajo, ahora en la misma frase. Si el campo trae un fallo, entra como escenario.
8. **`encargo-revision.md`, lo que se traduce y lo que no** (aquí te rebato el alcance literal): se traduce toda la prosa de fuera de los bloques y los títulos del fichero. **No** se traduce el bloque que recibe el revisor (```` ```markdown ````: `## Restricciones de código`, su texto, `## Cómo revisar`, `## Review Focus`): es el mismo texto, literal, en seis encargos —`task-reviewer-prompt.md`, `re-review-prompt.md` e `implementer-prompt.md` de `sdd-implement`, y los tres `*-reviewer-prompt.md` de `sdd-verify`—, y lo nombran la red flag de `sdd-implement/SKILL.md:330` y el requisito de `verification` (línea 28). Traducirlo solo aquí deja a los revisores finales con una cabecera y a los implementadores con otra; traducirlo en los seis toca `sdd-implement`, que la 0296 está partiendo ahora mismo en otro worktree. `kit:own` no lo da en rojo, porque mira la prosa de fuera de los bloques. Choca ya hoy con la regla «Idioma de los nombres» de `verification` («los encargos de los ejes en inglés»), porque los tres `*-reviewer-prompt.md` llevan ese bloque en castellano; esta feature no lo empeora, y hasta la 0311 manda la línea 28 del requisito, que nombra «Restricciones de código». Va al ticket como literal entre filas, para que la sesión `develop` lo tríe a la 0311, como las frases repetidas. Buscado en `cli/` y `tests/`: ningún literal del CLI lee estos títulos; `compose-axis.mjs` y `compose.mjs` leen `encargo-revision.md` solo en la ruta de un kit 2.x (`skills/sdd-start-feature/`), y `own.test.ts` y `fixtures/own/spanish-sample.md` usan «## Restricciones de código» como muestra de castellano, sin leer el fichero.
9. **Títulos de `encargo-revision.md`**: `# Review brief — mandatory header`; `## Final reviewer («Revisor final»)`, con el nombre viejo al lado porque lo citan `sdd-implement/SKILL.md:388` y `:468` (de la 0296) y así no cambian, como hizo la 0316 con su paso citado; `## Implementer brief`. Los nombres de bloques de la plantilla del plan («De código», «De proceso») se quedan entre «…»: son texto del proyecto. Al traducir una restricción con salvedad, «no X other than Y» (`tech-stack.md`, «Traducir una skill con `kit:own` delante»).
10. **«Una pieza entra, otra sale» (Art. I)**: no entra guía nueva. Salen la excepción de K31, la frase repetida de K35 y las tres líneas pegadas de `sdd-tdd`; `sdd-tdd` baja de palabras, y `sdd-verify/SKILL.md` baja ~900 palabras que pasan a la referencia, con el total de la skill igual (± la frase del puntero y la traducción).
11. **La procedencia de la batería de `sdd-verify`** (`battery.md:111`, `:119` y `:120`), que nombra «`## Closing the review`», pasa a nombrar `references/closing-the-review.md`. La evidencia con fecha (`tests/sdd-verify-0178-minors.md:10`) no cambia.
12. **Pasada de coherencia**: `sdd capability merge` sobre una copia de `.docs/sdd` en el scratchpad → «Sin delta que fusionar», exit 0. Corregí en la pasada el sitio de K31 (la 0299 lo daba en `:243`; hoy es `:283`) y que «Running a gate» no es lo que sale, porque lo citan otras cuatro skills.
13. **Método de prueba**: humo n = 1, sin RED de sujetos, una tanda de REFACTOR de hasta 4 sujetos y parada a ~6 $ o ~60 min (Art. I y `tech-stack.md`, «Baterías por skill»); los topes de palabras no cambian; `Validación: agente`, porque el repo valida en campo.
- Política de modelos: revisores de la spec, dos (hechos: dominio opus, técnica sonnet, effort medium) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (sin señales: ni módulo, ni dependencia, ni contrato, ni datos) · sujetos del humo en sonnet (los de cada batería): `c1`, `c1f` y `t2` de `sdd-verify` en paralelo y después `t1b` de `sdd-implement`, dentro de `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide `CLAUDE.md`; lo que no nombra se confirma aparte

La rúbrica daba «ninguna». El dev-lead pidió dos revisores en paralelo: dominio en Opus y técnica en Sonnet, los dos con `sdd-kit:effort-medium`.

### Hallazgos de la review

- **Rechazado** — (Crítico, dominio 1; Importante, técnica 1) `closing-the-review.md` en `own` y bajo la carpeta `pending: 0297` a la vez daría rojo → `encargo-revision.md` ya está así y `cli:test` pasa: `kindOf` de `build/sources.ts` da `own` primero, y la carpeta de una copia con `pending` solo clasifica lo que nada más clasifica. Lo dice ahora la decisión 3.
- **Aceptado** — (Importante, dominio 2) la frase nueva de K31 conservaba «only» con el Minor detrás de un punto y coma, una excepción con otra puntuación → decisión 4: «…verified by the test that … failed first, or, when no test can reproduce it (a Minor…), by the whole suite».
- **Aceptado** — (Importante, dominio 3; Importante, técnica 3) un fichero propio con marcas `kit: 0312` → decisión 3: va sin marcas.
- **Rechazado** — (Importante, dominio 4; Importante, técnica 5) renombrar `## Revisor final` rompería un ancla → `sdd-implement/SKILL.md:388` y `:468` lo citan por nombre, en prosa; `git grep -n "#revisor-final\|encargo-revision.md#"` en `skills/`, `tests/`, `cli/` y `capabilities/` no da nada.
- **Aceptado** — (Importante, dominio 5) dejar el bloque en castellano choca con «Idioma de los nombres» de `verification` → decisión 8: el choque ya existe hoy, esta feature no lo empeora, manda la línea 28 hasta la 0311 y va al ticket para el triaje de `develop`.
- **Aceptado** — (Menor, dominio 6) el Intent parecía prometer la skill entera en inglés → el Intent nombra la salvedad del bloque.
- **Aceptado** — (Menor, dominio 7) «the Minor bullet above» dependía de la posición → decisión 4 nombra la línea del ledger por su texto.
- **Aceptado** — (Importante, técnica 2) el puntero es texto del kit en una copia anotada → decisión 2: va en un bloque `kit: 0307`; la línea de la decisión 5 ya está en un bloque `kit: 0312`, y K31 va a un fichero propio.
- **Aceptado** — (Importante, técnica 4) «sin rojos de esta fila» no se comprueba con el código de salida de `kit:own` → «Dónde se prueba»: filtrada por `sdd-verify|sdd-tdd`, queda exactamente una línea, la del preámbulo.
- **Aceptado** — (Importante, técnica 6) los enlaces relativos del texto movido dejan de resolver → decisión 3 los reescribe; decisión 2: el ejemplo de `:268` se queda en `SKILL.md`.
- **Aceptado** — (Importante, técnica 7) faltaba buscar «Closing the review» en todo el repo → decisión 2 lista las cuatro citas vivas por nombre (`re-review-prompt.md:3`, `sdd-implement/SKILL.md:306`, `sdd-archive/SKILL.md:24`, `control-profiles.md:78`), que siguen valiendo con el título; lo demás son tickets y specs con fecha, que no se reescriben (Art. XI).
- **Aceptado** — (Menor, técnica 8) K34, K35 y la checklist sin escenario → decisión 7, riesgo aceptado con su motivo.
- **Aceptado** — (Menor, técnica 9) la línea de la rúbrica y la política de modelos decían «ninguno» → bloque de la rúbrica y política de modelos corregidos.
- **Aceptado** — (Menor, técnica 10) decisiones de método fuera de ✋ → decisión 13.

### Decisiones tomadas con el dev-lead

- Review de la spec: dos revisores en paralelo, dominio en Opus y técnica en Sonnet — «dos revisores en paralelo, dominio en Opus y técnica en Sonnet» (2026-11-05)

- Alcance: `sdd-verify/SKILL.md` por debajo de 20.000 bytes moviendo a `references/` lo que se lee en un solo paso; las dos líneas «→ 0307» de `sdd-tdd`; la frase que falla con la tabla de la 0299 (research.md §5); traducir `encargo-revision.md` — petición de arranque, 2026-11-05
- Fuera: anotar `skills/sdd-verify/references/` y el `REMOVED` del eje Spec (0297); las frases que `kit:own` da repetidas con la skill de otra fila (0311) — petición de arranque
- Antes de cambiar un título de `encargo-revision.md`, buscarlo en `cli/` y `tests/` — petición de arranque
- La frase que falla se sustituye, sin añadir otra al lado (ADR 0022, regla 3) — petición de arranque
- Una restricción con salvedad, «no X other than Y» — petición de arranque
- Perfil `delegate`; al fusionar, `sdd merge --push` — petición de arranque

## Intent

`sdd-verify` es una de las cinco skills que pasan de 20.000 bytes, y tras compactar se pierde su final: el cierre de la revisión. `sdd-tdd` tiene dos añadidos del kit que `kit:copies` da en rojo por ir junto a una absoluta de superpowers, y las dos skills tienen las excepciones pegadas que la 0299 encontró (K31, K34) y una regla dicha dos veces (K35). `encargo-revision.md` sigue en castellano (16 rojos de `kit:own`). El éxito: `kit:skill-size` sin FALLA en `sdd-verify`, `kit:copies` sin ninguna línea «→ 0307», `kit:own` sin líneas en `skills/sdd-verify/` ni `skills/sdd-tdd/` salvo las repetidas con la skill de otra fila (el bloque literal del encargo queda en castellano: decisión 8), `cli:test` en verde, y la misma conducta en el humo. Fracasa, aunque las tres comprobaciones queden en verde, si el agente deja de leer el cierre de la revisión a la vuelta de los ejes (dos pasadas de fix, otra re-revisión, un Minor sin arreglar), o si un implementador vuelve a implementar sobre un RED recibido sin verlo fallar.

## Scope

- Entra: `skills/sdd-verify/SKILL.md` — el cuerpo de `## Closing the review` a `references/closing-the-review.md` con el puntero de la decisión 2; K31 (decisión 4); la frase de `kit:own` (decisión 5).
- Entra: `skills/sdd-verify/references/closing-the-review.md`, nuevo, y su entrada en la lista `own` de `upstream.json`.
- Entra: `skills/sdd-verify/references/encargo-revision.md`, traducido con las decisiones 8 y 9.
- Entra: `skills/sdd-tdd/SKILL.md` — las sustituciones de las decisiones 6 y 7, con marcas `sustituye` de la 0307 que `kit:copies` acepta.
- Entra: `tests/batteries/sdd-verify/battery.md`, la procedencia (decisión 11).
- Entra: `dist/`, regenerado con `moon run kit:build` (ADR 0023).
- No entra: anotar `skills/sdd-verify/references/` contra OpenSpec ni el `REMOVED` del eje Spec (0297); las frases que `kit:own` da repetidas con la skill de otra fila, como «write everything the user reads in the language of their» o K32, K33 y K36 (0311); el bloque del encargo que reciben los revisores (decisión 8); `sdd-implement`, que reescribe la 0296; la red flag del RED recibido de `sdd-tdd` (decisión 7).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| El cuerpo de `## Closing the review` cambia de sitio | `skills/sdd-verify/SKILL.md:183, 202` (anclas `#closing-the-review`), `:245`, `:268` (el ejemplo) · por nombre: `skills/sdd-implement/references/re-review-prompt.md:3`, `skills/sdd-implement/SKILL.md:306`, `skills/sdd-archive/SKILL.md:24`, `skills/sdd-propose/references/control-profiles.md:78` · `tests/batteries/sdd-verify/battery.md:111, 119, 120` · `tests/sdd-verify-0178-minors.md:10`, tickets de `field-reports/` y specs anteriores | decisión 2: el título queda en `SKILL.md` y anclas y citas siguen valiendo; la batería, Scope (decisión 11); la evidencia, los tickets y las specs con fecha se quedan (Art. XI) |
| «except a Minor no test reproduces» | `skills/sdd-verify/SKILL.md:283` · la regla, en `capabilities/verification.md:89` | decisión 4; `verification` no cambia |
| «instead of `--base <merge.into>`» | `skills/sdd-verify/SKILL.md:67` | decisión 5 |
| Los añadidos de `sdd-tdd` bajo «Never skip», «Fix test», «Fix error» y «All tests pass», y sus marcas `arregla: 0307` | `skills/sdd-tdd/SKILL.md:122-123, 137-138, 141-142, 319-320` | decisiones 6 y 7 |
| `# Encargo de revisión — cabecera obligatoria` → `# Review brief — mandatory header` | `encargo-revision.md:1` · `tests/batteries/sdd-verify/compose-axis.mjs:25` (ruta `skills/sdd-start-feature/`, kit 2.x) | se queda: el script lo lee solo en un kit anterior a la 0148 |
| `## Revisor final` → `## Final reviewer («Revisor final»)` | `encargo-revision.md:23` · `skills/sdd-implement/SKILL.md:388, 468` | decisión 9: el nombre viejo, al lado; `sdd-implement` no cambia |
| `## Encargo del implementador` → `## Implementer brief` | `encargo-revision.md:78` · `tests/batteries/sdd-implement/compose.mjs:24` (ruta de kit 2.x) | se queda, por lo mismo |
| `## Restricciones de código`, `## Cómo revisar`, `## Review Focus` del bloque del encargo | seis encargos de `sdd-implement` y `sdd-verify` · `sdd-implement/SKILL.md:330` · `capabilities/verification.md:28` | no cambian: decisión 8 |

- Filas que implementa: 0307 → la nombran `roadmap.md` (la fila 0307, y la 0297 y la 0311, que van tras ella) y la propuesta 0301; en `capabilities/kit-distribution.md:115` y `cli/test/kit/copies.test.ts:293-294`, `arregla: 0307` es el ejemplo del mecanismo y se queda; las marcas `arregla: 0307` de `skills/sdd-tdd/SKILL.md:122` y `:319` salen (decisión 6). Comprobado con `git grep -n "0307" -- .docs/sdd/capabilities skills tests cli`. El cierre marca la fila.

## Approach

Cada frase que falla se reescribe en su sitio, con la regla entera delante (ADR 0022, regla 3): ninguna excepción ni frase nueva al lado. En `sdd-tdd`, cada cambio es una marca `sustituye: «S»` con la S que diga `kit:copies` (lo que el bloque quita del original). Lo que sale de `sdd-verify` se mueve sin reescribir, salvo K31. La traducción de `encargo-revision.md` sigue la frase una a una, sin mejorarla. Después de cada task, `moon run kit:build` y las tres comprobaciones.

## Dónde se prueba

- Tamaño: `moon run kit:skill-size`, sin la línea `FALLA: dist/skills/sdd-verify/SKILL.md` (hoy 22.881 bytes).
- Copias: `moon run kit:copies`, sin ninguna línea «→ 0307» (hoy dos, `sdd-tdd/SKILL.md:122` y `:319`) ni rojo nuevo en `sdd-tdd` o `sdd-verify`; queda `skills/sdd-verify/references/: sin anotar → 0297`.
- Propias: `moon run kit:own` sale con 1 por las demás filas; filtrada por `sdd-verify|sdd-tdd`, queda exactamente una línea: la que da «write everything the user reads in the language of their» repetida en 13 skills (el preámbulo, 0311). Hoy son 18: esa, la de `SKILL.md:61` y 16 de `encargo-revision.md`.
- Suite: `moon run cli:test` (enlaces, `references/` sin huérfanos, topes de palabras, `dist/` igual al build).
- Conducta, humo n = 1 en sonnet: `c1` (Important a la pasada, Minor al ledger, una re-revisión en opus) y `c1f` (Minor a la pasada con `review.minors: fix`) de la batería de `sdd-verify`, que leen el cierre desde la referencia y la frase de K31; `t2` (tras un rojo, el gate con `--base <rojo>`), la frase de la decisión 5; `t1b` de la batería de `sdd-implement` (el implementador que carga `sdd-tdd` ve fallar el RED recibido antes de tocar `src/`), la frase de `:121`.
- Fidelidad de la traducción y de cada sustitución: el eje Spec de la revisión final, con el diff contra `develop`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-verify` `SKILL.md` | 3593 / 3825 (3060 × 1,25) | 232 | sin cambio: baja ~900 |
| `sdd-verify` completa | 9613 / 11400 (9120 × 1,25) | 1787 | sin cambio: igual ± la traducción |
| `sdd-tdd` `SKILL.md` | 1715 / 2188 (1750 × 1,25) | 473 | sin cambio: baja |
| `sdd-tdd` completa | 4028 / 5038 (4030 × 1,25) | 1010 | sin cambio |

## Previsión de coste

Humo, no campaña: no hay RED de sujetos porque no hay guía nueva; los rojos son los de `kit:skill-size`, `kit:copies` y `kit:own`, ya medidos. Precio por sujeto: ~0,6 $ en la batería de `sdd-verify` (6,68 $ en 11 sujetos, `tests/sdd-verify-0178-minors.md`); ~0,5 $ uno de encargo de `sdd-implement`. Umbral de parada: más de ~6 $ o ~60 min de sujetos, la tanda de REFACTOR incluida; entonces paro y decides tú (Art. I).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 0: el rojo son las tres comprobaciones | 0 |
| GREEN (humo) | 4: `c1`, `c1f`, `t2` de `sdd-verify` y `t1b` de `sdd-implement`, n = 1 | ~2,3 |
| Una tanda de REFACTOR | hasta 4, los que fallen | ~2,3 |
| Controles | 0: no hay A/B; el humo es el control de no regresión | 0 |
| Medición tras la revisión final | 0, salvo que la pasada de fix toque un texto medido: se repite su sujeto dentro de la tanda de REFACTOR | 0 |
| Suma | 4 a 8 | ~2,3 a ~4,6 |

Pasos que cambian y su escenario (Art. I):

| Skill | Qué cambia | Escenario o motivo |
| --- | --- | --- |
| `sdd-verify` | `## Closing the review` detrás de un puntero; K31 | `c1`, `c1f` |
| `sdd-verify` | «Running a gate», punto 3 (decisión 5) | `t2` |
| `sdd-verify` | `encargo-revision.md` traducido fuera del bloque | sin escenario: el bloque que recibe cada eje no cambia, y `compose-axis.mjs` compone los encargos de los ejes desde los `*-reviewer-prompt.md`; la fidelidad, el eje Spec |
| `sdd-tdd` | Verify RED, «**MANDATORY…**» con el RED recibido | `t1b` |
| `sdd-tdd` | «Test passes?», «Test errors?» y la checklist | sin escenario: la conducta es la de la frase que ya estaba debajo, ahora en la misma; `t1c` (RED recibido que ya pasa) no carga `sdd-tdd` |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-05 | aprobada (opción «Apruebo») |
