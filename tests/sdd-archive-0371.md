# RED y GREEN de la feature 0371 — el cierre de un spike escribe las filas que su `research.md` §5 propone

Escenario `sp1` de `tests/batteries/sdd-archive/battery.md`, molde `reservas-spike-rows`, `sonnet`. Salidas en `.docs/sdd/changes/20261126-161357-feature-0371-spike-close-writes-rows/` (`red/out/`, `green/out/`, `refactor/out/` y `controls/out/`).

## RED: kit de `develop` (`c399c9fe9`), `N=2`

Línea `suma:`: `red: 2 sujetos · 0.81 $`.

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| sp1-1 | falla SP1-SP4 | no abre ninguna fila; la 0030 queda `✅` con `#412` en «Externo»; no reserva ids |
| sp1-2 | falla SP1-SP3 | reserva 0031 y 0032 con `id next --reserve`, pero las abre en Later; la 0030 queda `✅` sin los ids y con `#412` |

## GREEN: kit de la rama, `N=2`

Línea `suma:`: `green: 2 sujetos · 0.81 $`. Viñeta: «… the spike's row ends in `→ <ids>`, «Externo» `—`.»

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| sp1-1 | falla SP2 | dos filas `⏳` en Now con ids reservados y `#412` movido; pero `→ 0031, 0032` va en la frase de «Tarea», y «Estado» queda `✅` |
| sp1-2 | falla SP2 y SP3 | igual con `→ 0031, 0032` en «Tarea»; `#412` se queda en la 0030 y las filas nuevas llevan `—` |

Fallo de forma (Art. II): «the spike's row ends in» se lee como el final de la fila, no de su «Estado».

## REFACTOR: kit de la rama, `N=2`

Línea `suma:`: `refactor: 2 sujetos · 0.81 $`. Viñeta: «The spike's «Externo» moves to those rows, and its «Estado» cell becomes `✅ → <ids>`.»

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| sp1-1 | pasa SP1-SP4 | 0031 y 0032 `⏳` en Now con brief y `#412`; la 0030 `✅ → 0031, 0032` con «Externo» `—`; ids de `id next --reserve --count 2`; filas en el commit de cierre `be33a3d`, `develop` solo con el merge; `roadmap check` del roadmap final: «Roadmap válido» |
| sp1-2 | pasa SP1-SP4 | igual; cierre `6076f3d`; «Roadmap válido» |

Las filas nuevas llevan `**Toca:** —`: §5 del molde no nombra ningún fichero.

## Controles: `a9` y `a1`, `N=1`, kit del GREEN

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| a9-1 | pasa N1 y N2 | la 0010 `✅` en Now; «El motivo de cancelar no se valida» sale de «Lista» y «Los motivos no se traducen» queda reescrita a lo que falta (el inglés) |
| a1-1 | pasa A1-A7 | 4.1 con la suite y su sha; la 0010 `✅` sin prefijo; fila de deuda del workaround; `git status` antes de los registros; `sdd-retro`; merge en `develop` |

El control corrió con la viñeta del GREEN; el REFACTOR solo reescribe la viñeta de `mode: spike`, que `a9` y `a1` no leen.

## Palabras

`dist/skills/sdd-archive/` + `dist/skills/sdd-templates/`, contadas como `word-budget.test.ts`: 25.794 antes, 25.793 después (8.080 + 17.713).
