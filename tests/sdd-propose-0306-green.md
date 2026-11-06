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

## Controles de la Task 5 (`control/`, `control-fix/`, `control-using/`, `control-verify/`)

Kit final (Tasks 1 a 4 y 6) en la copia `.temp/k306`. `sdd-propose` entera salvo `rv1`, `rr1`, `co7`, `co8`, `g1` y `a3`, ya medidos en `green-t24/` con el texto de la Task 4: 58 escenarios, 107 sujetos Sonnet. La tanda se cortó al cerrarse la sesión con 35 guardados y se reanudó saltando las etiquetas guardadas. El precio real salió a ~0,57 $ por sujeto, no los 0,36 $ de la 0281: el dev-lead aprobó subir la previsión dos veces (2026-11-06, opciones «2» y «1»). Las filas de prosa las leyeron tres lectores Sonnet (effort medium), un tercio cada uno; cada «falla» se releyó en el hilo.

| Escenario | Veredicto | Lectura |
| --- | --- | --- |
| 46 escenarios | puerta verde, prosa leída: pasa | |
| `c1` | 0/2 por el medidor; C1 2/2 | la petición es el slash `/sdd-kit:sdd-propose`, que el harness expande sin llamada a `Skill`, y `firstSkill` da `sdd-kit:sdd-grilling`; los dos toman la fila 0010 de la rama como enunciado |
| `rv2`, `lr1` (`control/`) | 1/2, rojo de fixture | el repaso de coherencia nuevo vio que `spec-0018-small.md` apuntaba a `docs/guia.md`, a la capacidad `guide` y a la fila 0018, que el molde no tiene, y que `spec-0019-lite.md` cambiaba la firma de `libres` y suponía un responsable de sala; los dos sujetos pararon antes de la review, que es lo correcto. Fixtures rehechas, con `capability merge` verde sobre una copia del molde |
| `rv2`, `lr1` (`control-fix/`) | 2/2 | un revisor Sonnet cada uno (RV2-B leída) |
| `co6` | 2/2 | listar «El resumen va al final» al renumerar `resumen-cierre` no es la confusión que caza CO6 (el mismo caso cuenta como pasa en la 0281) |
| `using-sdd` `p1 v1 c1w pc1 bt1 c2` | 6/6 verde | |
| `sdd-verify` `s1` | 2/2 | los dos revisores devuelven el Crítico del SMS sin escenario (R leída) |
| L Idioma | 6 sujetos de `sdd-propose` (`h1-2`, `pl2-1`, `g1b-2`, `co6-1`, `co6-2`, `f1-2`) y `v1-2` de `using-sdd` | líneas de transición en inglés entre llamadas («Dispatching the two spec reviewers in parallel…»). En las campañas del 31 de octubre en adelante, 0 de ~700 sujetos: es de esta feature, que deja en inglés las references que el sujeto sigue. REFACTOR abajo |

Sin atribuir, un sujeto en contra cada uno (en `l1`, los dos), con el texto que los gobierna sin cambios o sin base con la que comparar; van al ticket para la 0311: `k3-1` (K1, el gate de `operations.md` en config sobre `main`), `p1-2` (P3, para por huecos de la spec de la fixture antes de `sdd-implement`), `l1` (L1, la «planta» cambia datos y lite no cabe: parece la fixture), `pl2-1` (PL2, la fila «la reserva de otra persona no se toca» sin test), `adr-c-1` (ADR-C, cita la ADR 0003), `co2-1` (CO2, reclasifica a patch en el paso 4) y `f1-2` (F1-C, cambios de paso sin «Ahora: … Queda:»).

## REFACTOR del idioma (`refactor-l/`, 10 sujetos Sonnet, 10,11 $)

La frase del Overview del `SKILL.md` pasa de «…in the language of their message, skill announcements included.» a «…skill announcements and the one-line notes between tool calls included, also while the reference you follow is in English.», sustituida en su sitio (Art. IX); el `SKILL.md` queda en 19.671 bytes.

| Escenario | Veredicto | Lectura |
| --- | --- | --- |
| `h1`, `g1b`, `co6`, `f1` | 2/2 | ninguna línea en inglés (L); H1, G1B, CO6 y F1-C pasan |
| `pl2` | 2/2 de máquina; L 2/2 | PL2 sigue sin test para «la reserva de otra persona no se toca» en los dos: el molde no guarda dueño de reserva y los dos lo dicen. Es de la fixture: va al ticket con los demás sin atribuir |
| `v1` (`using-sdd`) | sin correr | el acumulado (107,44 $) tocó el techo de 108 $; `v1-2` fue 1 de 12 sujetos de `using-sdd` con inglés, y `using-sdd` no cambia en esta feature |

Coste de sujetos de la feature: 107,44 $ en 171 sujetos, sobre una previsión de 57,50 $ ampliada por el dev-lead a ~106 $.

## Lo que añade la revisión final

- `lr1` con un rol en la spec: la fixture vieja («el responsable ve sus salas marcadas») ya dio 3 de 3 revisores en Sonnet (`green-t1/lr1-1`, `lr1-2` y `control/lr1-2`); la rehecha mide la misma frase de `review-spec.md` con una regla de negocio.
- `g1` y `g1b` despachan dos revisores y la segunda ronda: su petición dice «escrita y repasada, sin review» como estado de la fixture, y la `spec-0010.md` trae «Sin review de spec: dos señales», que la rúbrica nueva ya no admite en full. No mide «sin review»: lo miden las filas NR (`k1`, `k2`, `s1`, 0 `Agent`) y NR-B (`s1` registra «Sin review» con la frase), recalculadas sobre los sujetos de `control/` sin lanzar ninguno.
- PR1-A (hay revisor) se añade a PR1, que pasaba sin commit ni `Agent`: `pr1` 2/2 en `green-t1/` y en `control/`.
