# Evidencia GREEN — `using-sdd`, la puerta de entrada al kit (2026-09-25)

Mismas 14 frases, molde y aislamiento que el [RED](using-sdd-red.md), con dos sujetos Sonnet por frase. El kit es un `git archive` de la rama tras la Task 2 (`99a6648`). En él, el hook inyecta `skills/using-sdd/SKILL.md` y `hooks/router.md` ya no existe. Las salidas están en `green/out/` de la [carpeta de la spec](../.docs/sdd/specs/20260925-180228-feature-0074-using-sdd/).

## Resultados

| Frase | Puerta esperada | RED (s1 · s2) | GREEN (s1 · s2) | Veredicto |
| --- | --- | --- | --- | --- |
| i1 | `sdd-init-brownfield` | `sdd-init-brownfield` | `sdd-init-brownfield` · `sdd-init-brownfield` | control, sin regresión |
| c1 | `sdd-consult` | `sdd-consult` | `sdd-consult` · `sdd-consult` | control, sin regresión |
| r1 | `sdd-roadmap` | `sdd-start-feature` · `sdd-start-feature` (proponen partir) | `sdd-roadmap` · `sdd-roadmap` | pasa |
| r2 | `sdd-roadmap` | `sdd-roadmap` | `sdd-roadmap` · `sdd-roadmap` | control, sin regresión |
| r3 | `sdd-roadmap` | `sdd-start-feature` · `sdd-start-feature` | `sdd-roadmap` · `sdd-roadmap` | **fallo corregido, 2 de 2** |
| r4 | `sdd-roadmap` | `sdd-roadmap` | `sdd-roadmap` · `sdd-roadmap` | control, sin regresión |
| f1 | `sdd-start-feature` | `sdd-start-feature` | `sdd-start-feature` · `sdd-start-feature` | control, sin regresión |
| f2 | `sdd-start-feature` («Let's build») | `sdd-start-feature` | `sdd-start-feature` · `sdd-start-feature` | control, sin regresión |
| f3 | `sdd-start-feature` («hazlo rápido») | `sdd-start-feature` | `sdd-start-feature` · `sdd-start-feature` | control, sin regresión |
| p1 | `sdd-start-patch` | `sdd-start-patch` | `sdd-start-patch` · `sdd-start-patch` | control, sin regresión |
| e1 | `sdd-end-release` | `sdd-end-release` | `sdd-end-release` · `sdd-end-release` | control, sin regresión |
| s1 | `sdd-config` | ninguna · ninguna (a memoria) | `sdd-config` · `sdd-config` | **fallo corregido, 2 de 2** |
| d1 | una pregunta antes de la puerta | `sdd-start-feature` · `sdd-start-feature` | ninguna · ninguna, con pregunta | **fallo corregido, 2 de 2** |
| t1 | ninguna (edición directa) | ninguna | ninguna · ninguna | control, sin regresión |

Recuento: **14 de 14 frases, 28 de 28 sujetos**, en su puerta.

## Lo que no se ve en la primera skill

- **d1**: los dos sujetos contestan en el segundo turno con una sola pregunta y la recomendación delante. d1-1: «Mi recomendación es empezar por un único problema concreto…», y después «¿Qué es lo que se quejan exactamente los usuarios?». d1-2: «**Mi recomendación:** que me digas qué se quejan exactamente…». El `git log` del molde solo tiene el commit base: ni rama ni carpeta.
- **s1**: ninguna de las dos herramientas de los sujetos nombra la memoria, y los dos entran por `sdd-config`. En el RED, los dos habían escrito «Lo he guardado en memoria».
- **r1**: el RED lo contaba como equivalente, porque `sdd-start-feature` proponía partir. Con la fila «algo grande», los dos sujetos entran ya por `sdd-roadmap`.

## Trampas de método

- n = 2 por frase: es la frecuencia observada, no una tasa.
- Los controles pasan con la skill entera cargada en lugar del router de 150 palabras. La skill tiene 426 palabras, con un tope de 450 que fija `tests/UsingSdd.Tests.ps1`.

## Control tras la revisión final

La revisión final encontró que la regla del router «planificar sin hacerlo todavía» («apunta en el roadmap», «no lo arranques») no había llegado a la fila de `sdd-roadmap`. Se añadió a esa fila, y la skill quedó en 437 palabras. La medida usa los 4 sujetos que quedaban en el techo, uno por frase, en `refactor/out/`:

| Frase | Puerta esperada | Primera skill | Veredicto |
| --- | --- | --- | --- |
| r5 «Apunta en el roadmap lo del filtro por sala, no lo arranques todavía.» | `sdd-roadmap` | `sdd-roadmap` | pasa (frase nueva) |
| r3 | `sdd-roadmap` | `sdd-roadmap` | control, sin regresión |
| f1 | `sdd-start-feature` | `sdd-start-feature` | control, sin regresión |
| f3 | `sdd-start-feature` | `sdd-start-feature` | control, sin regresión |

Los `.args` de estos sujetos confirman que `--setting-sources ""` y `--plugin-dir` de superpowers llegaron a `claude`. r1, r2 y r4, las otras frases de la misma fila, no se volvieron a medir tras la edición: no quedaban sujetos dentro del techo.

Coste: 28 sujetos del GREEN (4,00 $) y 4 de control (0,66 $). Campaña entera: 50 sujetos y 7,54 $ (más ~0,06 $ de sondas), en el techo de sujetos de la previsión (50) y muy por debajo del de coste (18 $).
