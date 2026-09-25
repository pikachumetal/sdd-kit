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

Coste: 28 sujetos, 4,00 $. Campaña entera: 46 sujetos y 6,88 $ (más ~0,06 $ de sondas), dentro de la previsión de 50 sujetos y 18 $. Sin ronda de REFACTOR.
