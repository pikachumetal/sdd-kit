# Evidencia GREEN — compatibilidad con superpowers 7.0.0 (patch 0167, 2026-10-10)

Verificación del fix del RED ([`superpowers-700-red.md`](superpowers-700-red.md)): mismos escenarios, mismo lanzador ([`subject.sh`](../.docs/sdd/specs/20261010-195847-patch-0167-superpowers-7-compat/red/subject.sh)), Sonnet, superpowers 7.0.0 desde la caché. El kit es una copia del working tree con el cambio:

- **Paso 4 de `sdd-start-feature`**: «No ofrezcas saltarse las preguntas, aunque su primer mensaje lo pida: en el kit, saltárselas no se lleva la spec ni su gate. Si el usuario pide empezar ya, escribes la spec con lo que hay y sus huecos van a «Decisiones que he tomado yo».» Y el repaso de coherencia escribe sus cuatro comprobaciones en el paso, sin citar el «Spec Self-Review».
- **`overrides-superpowers.md`**: «Size the Work» y la oferta de saltarse las preguntas sustituyen a la fila de la clasificación spike / bounded / architectural; filas nuevas del builder check y del estilo de preguntas; la del Execution Handoff deja de citar la HARD-GATE.
- **`sdd-roadmap`**: la entrevista dice su técnica (una pregunta por turno, la recomendada primero) sin atribuírsela a brainstorming.

| Sujeto | Coste | Ofrece saltarse las preguntas | `spec.md` | Gate | Builder check | Dónde para |
| --- | --- | --- | --- | --- | --- | --- |
| `n-1` | 0,28 $ | no | no, aún pregunta | — | no | playback y pregunta: ¿quién crea y cancela las reservas? |
| `n-2` | 0,54 $ | no | sí | sí | no | pregunta del nivel de review de `review-spec.md` |
| `s-1` | 0,26 $ | no | no, aún pregunta | — | no | suposición marcada y pregunta abierta |
| `s-2` | 0,22 $ | — (no llegó a brainstorming) | no | — | no | primera pregunta del paso 2, con sus opciones |
| `y-1` | 0,45 $ | no; el usuario lo pidió igual | sí, «los huecos los resolví yo y están en "Decisiones que he tomado yo"» | sí | no | gate («¿Apruebas la spec?») |
| `y-2` | 0,48 $ | no; el usuario lo pidió igual | sí | sí, antes pregunta la review | no | pregunta del nivel de review |

Total GREEN: 2,23 $ (campaña: 4,61 $).

| Frente | RED | GREEN |
| --- | --- | --- |
| Oferta de saltarse las preguntas | 5 de 5 | **0 de 5** que llegaron a brainstorming |
| «Sí, sáltate las preguntas» se lleva la spec y el gate | 0 de 2 | 0 de 2: spec con los huecos en «Decisiones que he tomado yo» y gate |
| Feature sin `spec.md` ni gate por el tamaño | 0 de 6 | 0 de 6 |
| Builder check despachado | 0 de 6 | 0 de 6 |

GREEN. `tests/SuperpowersCompat.Tests.ps1` fija las filas de overrides, la frase del paso 4 y la versión validada; `tests/ProportionalReview.Tests.ps1`, las cuatro comprobaciones del repaso.

## Sobre `develop` (port en el merge de `main`, 2026-10-10)

En `develop` el paso de la spec vive en `sdd-propose` (feature 0160), en inglés, y sus preguntas siguen `sdd-grilling`. El port lleva la misma frase, traducida («Don't offer to skip the questions, even if its first message asks you to…»), al paso 4 de `sdd-propose`, y el repaso de coherencia con sus cuatro comprobaciones. La fila de preguntas de `overrides-superpowers.md` manda a `sdd-grilling`. Mismos escenarios con la entrada en `sdd-propose`: [`subject.sh`](../.docs/sdd/specs/20261010-195847-patch-0167-superpowers-7-compat/green-develop/subject.sh), con el kit copiado del merge.

| Sujeto | Coste | Ofrece saltarse las preguntas | `spec.md` | Gate | Builder check | Dónde para |
| --- | --- | --- | --- | --- | --- | --- |
| `n-1` | 0,24 $ | no | no, aún pregunta | — | no | pregunta de `sdd-grilling`, recomendada 1️⃣ |
| `n-2` | 0,26 $ | no | no, aún pregunta | — | no | pregunta de `sdd-grilling`, recomendada 1️⃣ |
| `s-1` | 0,27 $ | no | no, aún pregunta | — | no | pregunta de `sdd-grilling`, recomendada 1️⃣ |
| `s-2` | 0,23 $ | no («no ofrezco saltar las preguntas») | no, aún pregunta | — | no | pregunta de `sdd-grilling`, recomendada 1️⃣ |
| `y-1` | 0,43 $ | no; el usuario lo pidió igual | sí, «como me has pedido saltar las preguntas, las he tomado todas yo» | sí | no | review y gate |
| `y-2` | 0,39 $ | no; el usuario lo pidió igual | sí | sí, «que me pidieras saltarme las preguntas no aprueba la spec» | no | gate |

Total: 1,83 $ (campaña: 6,43 $). Oferta 0 de 6, spec y gate 2 de 2 con «sáltate las preguntas», builder check 0 de 6. GREEN.
