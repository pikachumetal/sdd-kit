# sdd-propose rehecha (feature 0306) — RED estructural, GREEN y controles

Spec: [`.docs/sdd/specs/20261105-161645-feature-0306-propose-rework/spec.md`](../.docs/sdd/specs/20261105-161645-feature-0306-propose-rework/spec.md). Batería: [`tests/batteries/sdd-propose/battery.md`](batteries/sdd-propose/battery.md).

## RED estructural

Leído con fichero y línea antes de editar (decisión 15 de la spec): el texto de hoy dice lo contrario de lo que se mide, así que no se lanzan sujetos.

| Frente | Escenario | Texto de hoy |
| --- | --- | --- |
| Dos revisores en full, sin preguntar | `rv1` | `skills/sdd-propose/references/review-spec.md:25` «En `pair` y `delegate`, si toca recomendar, lo preguntas **antes de presentar la spec**» y `:47` «**Proponer no es activar**» |
| Scope pequeño, un revisor, nunca ninguno | `rv2` | `review-spec.md:20` «**Por defecto, ninguna.** 0–3 señales no proponen review.» |
| Confirmar antes de paralelizar, con modelos y coste | `rv3` | `review-spec.md:25`: la pregunta lleva el modelo del dominio, no el coste |
| Lite, un revisor en Sonnet | `lr1` | `review-spec.md:3` «En modo lite no se aplica.» |
| Segunda ronda tras un Crítico | `rr1` | `review-spec.md:64` «Después, el gate: el usuario lee las decisiones y los hallazgos, nada más.» |
| Revisor del patch | `pr1` | `skills/sdd-implement/references/patch-flow.md:19` «don't dispatch any axis or reviewer» y `:31` «You're about to dispatch a reviewer «to be safe»» |

## GREEN de la Task 1 (`green-t1/`, 12 sujetos Sonnet, 7,10 $)

| Escenario | Veredicto | Lectura |
| --- | --- | --- |
| `rv1` | 1/2, rojo | `rv1-1` preguntó el nivel antes de despachar: la copia del kit (`.temp/k306`) llevaba aún el `control-profiles.md` viejo, cuya fila «Review de spec recomendada» dice «pregunta antes de presentar»; la Task 3 la sustituye. Se repite en la tanda de REFACTOR con el kit entero. |
| `rv2` | 2/2 | un `Agent` cada uno (RV2-B leída) |
| `rv3` | 2/2 | ningún `Agent`; los dos preguntan con el modelo de cada revisor y su coste (RV3-B leída) |
| `lr1` | 2/2 | un revisor en Sonnet |
| `rr1` | 1/2, rojo | `rr1-2` no abrió `review-spec.md`: la petición daba la review por hecha, y la segunda ronda solo vivía en la reference. REFACTOR: el paso 4 del `SKILL.md` nombra la segunda ronda donde se decide (Task 4). |
| `pr1` | 2/2 (con la fila PR1 corregida: el orden de `battery.mjs` es «falla si A antes de B») | los dos despachan el revisor Sonnet antes del commit; en `pr1-2` el revisor encontró un Important real (el test de `anular` pasaba sin el fix), arreglado y respondido en §4 |

## GREEN de las Tasks 2 y 4, y repetición de `rv1` y `rr1` (`green-t24/`, 18 sujetos Sonnet, 10,61 $)

Kit de las Tasks 1 a 4 en la copia (`.temp/k306`), con el REFACTOR de `rr1` en el paso 4 del `SKILL.md`.

| Escenario | Veredicto | Lectura |
| --- | --- | --- |
| `rv1` | 2/2 | dos revisores sin preguntar (dominio `model=opus`, técnica `model=sonnet`) y, con un Crítico aceptado, la segunda ronda en Sonnet; ninguna pregunta de activar (RV-C leída) |
| `rr1` | 2/2 | un `Agent` de segunda ronda, `model=sonnet`, antes del gate (RR1-B leída) |
| `co7` | 2/2 | «Lo que se retira…» nombra `test/config.test.js` (3 y 4 menciones en la spec que deja) |
| `co8` | 2/2 | los dos señalan que el THEN no atrapa `libres 10:00-10:00` y lo cambian en la spec |
| `a3` | 2/2 | con «patch:» en la petición, lee `patch-lane.md` (A3-L, máquina) |
| `k1`, `g1` | 2/2 | controles del carril config y del gate en prosa |
| `pb` | 2/2 de máquina; PB 1/2 | `pb-1` dice los enfoques y sigue, con las secciones en el ✋; `pb-2` va a la spec sin el mensaje de enfoques |
| `pb-p` | 2/2 de máquina; PB-P 1/2 | `pb-p-2` dice los enfoques y pregunta; `pb-p-1` salta a la sección 1. Los dos que fallan traían «decidido con el dev-lead» en la petición: REFACTOR 1 en `spec-writing.md` |

## REFACTOR de los enfoques (`refactor-t4/` y `refactor2-t4/`, 8 sujetos Sonnet, 4,61 $)

| Tanda | Cambio | `pb` (`delegate`) | `pb-p` (`pair`) |
| --- | --- | --- | --- |
| 1 | `spec-writing.md`: «decidido con el dev-lead» fija el qué, no el cómo; las secciones van tras el mensaje de enfoques | 0/2 con mensaje propio: los dos van a la spec | 2/2 |
| 2 | el paso 4 del `SKILL.md` nombra el mensaje de enfoques, también en `delegate` | 0/2: `pb-1` va a la spec; `pb-2` pone el enfoque como decisión del ✋ | 2/2 (`pb-p-1` pregunta «¿Vamos con la opción 1?») |

Tras dos tandas, la conducta de `delegate` era la de un mensaje que no espera respuesta: el dev-lead aprobó la enmienda del 2026-11-05 (opción «Apruebo las dos»), que en `delegate` lleva los enfoques al ✋, como ya hacía `pb-2`. La fila PB se reescribe con ella; la batería entera de la Task 5 vuelve a medir `pb` con la fila nueva.
