# Evidencia RED — compatibilidad con superpowers 7.0.0 (patch 0167, 2026-10-10)

RED previo al fix (Art. I y Art. V), sobre `main` en `446faec9` (kit 2.3.3) con superpowers **7.0.0** cargado desde la caché de `superpowers-marketplace` (`SUPERPOWERS_DIR`). Misma forma que el repaso de la 6.4.2 ([`superpowers-642-red.md`](superpowers-642-red.md)): lo que se decide leyendo el texto de superpowers se mide con el texto, y lo que depende de la conducta, con sujetos.

## Qué cambia de la 6.4.2 a la 7.0.0

La 7.0.0 (2026-10-09) reescribe `skills/brainstorming/SKILL.md`. Lo que toca al kit:

- **(a)** Desaparece el «Spec Self-Review» que citaba el repaso de coherencia del paso 4 de `sdd-start-feature`.
- **(b)** La clasificación spike / bounded / architectural pasa a «Size the Work»: «A quick, clear task» → do it, «A small change» → in chat, «A project» → written design.
- **(c)** El primer mensaje ofrece saltarse las preguntas: «If they take you up on it, this skill is done», y la HARD-GATE: «If they opted out of the questions, the skill is done and the gate goes with it».
- **(d)** El «Builder check», un subagente con `builder-check-prompt.md`, sustituye al revisor de la spec.
- **(e)** La HARD-GATE ya no dice «reviews the written implementation plan and selects its execution method», que citaba la fila del Execution Handoff de `overrides-superpowers.md`.
- **(f)** «Each message ends with one question: a single sentence with no list of example answers».

Las demás skills que invoca el kit cambian en detalles que no tocan su texto: `executing-plans` (`task-done` registra una verificación silenciosa), `subagent-driven-development` (`.gitignore` de `sdd-workspace`, rutas en Windows), `requesting-code-review` y `systematic-debugging` (ejemplos).

## Sujetos

Molde de la task 0006 (reservas, perfil `delegate`, `ids.mode: sequence`), con el marcador en 2.3.3 y la primera pregunta del paso 2 contestada en la petición. Lanzador: [`subject.sh`](../.docs/sdd/specs/20261010-195847-patch-0167-superpowers-7-compat/red/subject.sh), con `tests/headless/run.sh`, Sonnet, `MAX_TURNS=40`. El kit es `git archive` de `HEAD`.

- `n` — feature normal (0011, avisos por correo), modo full; el segundo turno da la descripción que pide brainstorming.
- `s` — feature pequeña (0013, que la lista diga cuántas reservas hay), modo lite; un turno.
- `y` — la 0011 con «Sí, sáltate las preguntas y empieza ya.» en el segundo turno.

| Sujeto | Coste | Ofrece saltarse las preguntas | `spec.md` | Gate | Builder check | Dónde para |
| --- | --- | --- | --- | --- | --- | --- |
| `n-1` | 0,32 $ | sí («redacte la spec con mis propias decisiones») | no, aún pregunta | — | no | pregunta: ¿`Owner` guarda el correo? |
| `n-2` | 0,32 $ | sí («arranque directamente con mis suposiciones») | no, aún pregunta | — | no | pregunta: ¿estado y correo dentro de la 0011? |
| `s-1` | 0,45 $ | no le dio tiempo: escribió la spec en el primer turno | sí | sí | no | gate («¿Apruebas la spec?»), review «ninguna» por rúbrica |
| `s-2` | 0,32 $ | sí | no, aún pregunta | — | no | pregunta abierta («¿Qué ves hoy…?») |
| `y-1` | 0,49 $ | sí | sí, repasada | sí, antes pregunta el nivel de review | no | pregunta del nivel de review de `review-spec.md` |
| `y-2` | 0,48 $ | sí | sí, «hice el repaso de coherencia» | sí | no | gate («¿Apruebas la spec?») |

Total: 2,38 $. Ningún sujeto leyó `overrides-superpowers.md` (0 de 6 en los extractos de tool calls).

| Frente | Resultado |
| --- | --- |
| (b) el tamaño deja la feature sin `spec.md` ni gate | **No se reproduce**: 0 de 6. `s-1` escribió la spec de la feature pequeña y paró en el gate |
| (c) la oferta de saltarse las preguntas | **Se reproduce**: 5 de 5 sujetos que llegaron a preguntar la ofrecen, contra la decisión del dev-lead |
| (c) «sí, empieza ya» se lleva la spec y el gate | **No se reproduce**: 2 de 2 escriben la spec y paran en el gate |
| (d) builder check | **No se reproduce**: 0 de 6 lo despachan; `y-1` aplica la rúbrica de `review-spec.md` |
| (a) repaso de coherencia sin el «Spec Self-Review» | **No se reproduce**: los 3 que escriben la spec la repasan. Cambio mecánico |
| (e), (f) y (g) | Texto: cambio mecánico. (f) no se mide en feature: la primera pregunta iba contestada en la petición, y las de diseño las decide brainstorming |

## Conclusión

Solo la oferta de saltarse las preguntas pide texto en la skill: la fila de `overrides-superpowers.md` no llega, porque nadie la lee. El resto queda en el cambio mecánico: las filas de overrides, el repaso de coherencia con sus cuatro comprobaciones escritas en el paso, la entrevista de `sdd-roadmap` sin atribuir la técnica a brainstorming y la versión validada. GREEN: [`superpowers-700-green.md`](superpowers-700-green.md).
