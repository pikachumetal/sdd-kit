# RED y GREEN de la feature 0371 — el cierre de un spike escribe las filas que su `research.md` §5 propone

Escenario `sp1` de `tests/batteries/sdd-archive/battery.md`, molde `reservas-spike-rows`, `sonnet`. Salidas en `.docs/sdd/changes/20261126-161357-feature-0371-spike-close-writes-rows/` (`red/out/`, `green/out/`, `refactor/out/` y `controls/out/`).

## RED: kit de `develop` (`c399c9fe9`), `N=2`

Línea `suma:`: `red: 2 sujetos · 0.81 $`.

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| sp1-1 | falla SP1-SP4 | no abre ninguna fila; la 0030 queda `✅` con `#412` en «Externo»; no reserva ids |
| sp1-2 | falla SP1-SP3 | reserva 0031 y 0032 con `id next --reserve`, pero las abre en Later; la 0030 queda `✅` sin los ids y con `#412` |

## GREEN: kit de la rama, `N=2`

Línea de la tanda: `green: 2 sujetos · 0.84 $` (campaña: 6 sujetos, 2,61 $). Viñeta: «… the spike's row ends in `→ <ids>`, «Externo» `—`.»

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| sp1-1 | falla SP2 | dos filas `⏳` en Now con ids reservados y `#412` movido; pero `→ 0031, 0032` va en la frase de «Tarea», y «Estado» queda `✅` |
| sp1-2 | falla SP2 y SP3 | igual con `→ 0031, 0032` en «Tarea»; `#412` se queda en la 0030 y las filas nuevas llevan `—` |

Fallo de forma (Art. II): «the spike's row ends in» se lee como el final de la fila, no de su «Estado».

## REFACTOR: kit de la rama, `N=2`

Línea de la tanda: `refactor: 2 sujetos · 0.92 $` (campaña: 8 sujetos, 3,53 $). Viñeta: «The spike's «Externo» moves to those rows, and its «Estado» cell becomes `✅ → <ids>`.»

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

## Pasada de fix tras la revisión final: kit de la rama, `N=2`

Primera medición, `fix: 2 sujetos · 0.83 $` (campaña: 10 sujetos, 4,35 $). Viñeta: «… with its brief and the spike's «Externo» …; the spike's «Externo» becomes `—`».

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| sp1-1 | falla SP3 | filas, ids y `✅ → 0031, 0032` bien; `#412` desaparece de todas las filas |
| sp1-2 | falla SP3 | igual |

Tanda extra, `fix2: 2 sujetos · 0.79 $` (enmienda de la previsión; campaña: 12 sujetos, 5,15 $). Viñeta final: «The spike's «Externo» moves to each of those rows, and its «Estado» cell becomes `✅ → <ids>` (or `🧪 … → <ids>`).»

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| sp1-1 | falla SP3 | 0031 y 0032 `⏳` en Now con brief y `#412`; la 0030 `✅ → 0031, 0032`, pero conserva `#412`: lo copia en vez de moverlo; ids reservados; cierre `c2ba927`; «Roadmap válido» |
| sp1-2 | pasa SP1-SP4 | la 0030 `✅ → 0031, 0032` con «Externo» `—`; «Roadmap válido» |

El dev-lead cierra con lo medido (SP3 1/2): la copia de «Externo» va a deuda.