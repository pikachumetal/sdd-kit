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
