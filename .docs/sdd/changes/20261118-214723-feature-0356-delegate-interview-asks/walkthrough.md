---
id: 20261118-214723-feature-0356-delegate-interview-asks
feature: 0356
title: Walkthrough — En delegate, la entrevista pregunta lo que falta y es del dev-lead
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-19
---

# Walkthrough — En delegate, la entrevista pregunta lo que falta y es del dev-lead

## 1. Cambios realizados

- `skills/sdd-propose/references/spec-writing.md`: «What the spec covers» abre con los tres montones de `brainstorming` (answered, minor, the dev-lead's). Lo respondido se usa si nada lo contradice; lo menor lo decide el agente con el proyecto y va al ✋; lo del dev-lead se pregunta en `pair` y en `delegate`, y el perfil no es un «decide for me». Lo del dev-lead es lo que cambia la spec, el enfoque o las tasks: el porqué, «even if you can guess»; el criterio; los goals, non-goals y anti-goals «as territory, not a script»; una contradicción entre la petición y el proyecto, y lo que la petición pide preguntar. Un punto de «Abierto» nunca está respondido, y sin el dev-lead lo suyo va al ✋ «pendiente», también en «Design by sections» y «Starting right away». Los enfoques en `delegate` dejan «because nobody chooses» (`01f5c76` y la pasada de fix del cierre).
- `skills/sdd-propose/references/control-profiles.md`: la línea de `delegate` dice que la parada de la spec incluye las preguntas de su entrevista.
- `tests/batteries/sdd-propose/`: escenarios `iq1` a `iq5` y filas `IQ1` a `IQ6`; `subject.mjs` y `tests/headless/battery.mjs` leen `<br>` como salto de línea en la petición (`2b02320` y el cierre).
- `upstream.json` y `THIRD_PARTY_NOTICES.md`: la nota de `brainstorming` nombra los tres montones. `cli/test/kit/word-budget.test.ts`: el total de `sdd-propose` pasa de 13.927 a 14.162 palabras, el tope aprobado en la spec.
- Evidencia: `tests/sdd-propose-0356-interview-asks-red.md` y `-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 1,42 h — reloj de la sesión 2,40 h desde 2026-11-18T21:24Z, sin 58 min de espera al dev-lead (17 esperas)
- Desviación: −0,58 h (−29 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): no aplica
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 69.484.778 — claude-opus-5-5 69.484.778
- Tokens de subagentes: 4.253.868 en 7 despachos — Re-review fix 0356 claude-opus-5-5 605.597 / 2 min; Review spec 0356 segunda ronda claude-sonnet-5-5 151.665 / 1 min; Review enmienda 0356 iq5 claude-sonnet-5-5 138.158 / 0 min; Final review — Spec axis 0356 claude-opus-5-5 1.918.696 / 4 min; Review spec 0356 siete puntos claude-sonnet-5-5 248.593 / 1 min; Final review — Code axis 0356 claude-sonnet-5-5 993.550 / 2 min; Review desvío THEN 0356 claude-sonnet-5-5 197.609 / 1 min
- Coste de la sesión: 24,67 $ (hilo 20,96 $ + subagentes 3,71 $)
- Coste de sujetos: 20,86 $ en 49 sujetos sonnet, el acumulado de la campaña que da `battery.mjs` — red 8 sujetos; red-iq5 2; green 10; green-ctl 2; fix 9; fix-iq4 2; fix-interviewer 16
- Review de spec: 1 revisor (siete puntos) y segunda ronda · hallazgos 19, aceptados 15

## 3. Desviaciones del plan

- Enmienda del 2026-11-18: el RED de `iq1` salió limpio 3/3 y el plan paraba ahí (decisión 7). El dev-lead eligió seguir y añadir `iq5`, un prompt de arranque largo, que también salió limpio 2/2. La Task 2 apuntó a lo que sí fallaba: `iq3` (la propuesta de «Abierto» dada por decidida) e `iq4` (el umbral fijado sin «pendiente»).
- Enmienda del 2026-11-19: tras la revisión final, el THEN del primer escenario pasa a «termina el turno con una pregunta y sin `spec.md`, y no da por decidido cuándo cuenta muy ocupada; preguntar antes el porqué vale», y la previsión suma la re-medida y la batería `interviewer` (ADR 0035). Aprobada por el dev-lead.
- Las tandas de REFACTOR no se usaron: la re-medida tras la revisión final ocupó su sitio.

### Decisiones tomadas sin el dev-lead

- `IQ1` como `tools: /^>>> Write:[^\n]*spec\.md/` presente — `verdict` aplica el regex a la llamada entera — si falla, la fila no distingue un Read de un Write.
- Línea base del gate en rojo por `molds.test.ts` («el molde salas3-current de sdd-upgrade (r1)»), que `develop` arregla en `ed7131e87` — sigo; lo trae el merge de sincronización — si no, el gate de cierre sale rojo.
- `IQ2` reescrita a «da por decidido el umbral»; preguntar antes el porqué no falla — la fila contradecía «El porqué va primero» — si falla, deja pasar a quien decida el umbral más tarde.
- La petición de un escenario admite `<br>` como salto de línea — una celda de tabla no admite saltos — si falla, `iq5` mide otro prompt.
- `a5` (control) pregunta la planta de cada sala en vez de escribir la spec — el molde no tiene plantas y es un dato del dev-lead: es la regla nueva — si falla, la regla hace preguntar datos que el agente podría inventar con razón.
- Ejes Spec y Código en paralelo sin preguntar — la decisión 2 del plan aprobado los nombra con su modelo — si falla, ~3 $ sin confirmación explícita de paralelizar.
- «Abierto» aún no está en `launch-prompt-template.md` — lo trae la 0357, acordado con su sesión — si la 0357 no se fusiona, la regla no hace nada.
- «user» frente a «dev-lead» en `spec-writing.md`, y `unattended` sin puntero — `control-profiles.md:67` ya lo cubre — si falla, un lector duda de si son la misma persona.
- `iq4` a n = 2 en la re-medida — si falla, el «pendiente» se apoya en un solo sujeto.
- N2: `IQ3` («segunda pregunta») e `IQ6` («pregunta antes de la spec») cambiadas a petición del revisor del desvío — RED y GREEN de esas filas se juzgaron con las viejas — si falla, no se comparan con la misma vara.
- La re-medida mide el texto de la pasada de fix, no el de N1 — N1 devuelve la frase literal de la fuente y solo quita presión de preguntar — si falla, `iq2` pregunta los anti-goals y nadie lo ha medido.
- `capability check` avisa de que el requisito nuevo de `feature-flow` tiene 2.121 caracteres, con 500 aconsejados — no lo parto: partirlo cambia el delta aprobado y el aviso no es un error — si falla, el requisito se lee peor que uno por comportamiento.
- `fp-1` rojo en `K` de `interviewer` — para en la clasificación por la premisa falsa y no llega al paso de la spec; con n = 5 y un rojo, la fila no separa textos (0342) — si falla, el cambio hace que propose pregunte antes de cargar `sdd-grilling`.

## 4. Verificación

### 4.1 Builds

- `moon run kit:build` → verde; `moon run kit:copies kit:own kit:skill-size` → verde; `npx vitest run test/kit/word-budget.test.ts` → `Tests  77 passed (77)`; el pre-commit (`cli:test`) en verde en cada commit.
- Gate: corre una vez sobre el merge de sincronización (la base va 19 commits por delante); su línea va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-19 · smoke 5/5 THEN con ejecución real (sujetos headless de la batería de `sdd-propose`, kit de la pasada de fix) · batería `interviewer` p1, p2, p3 y pe en verde, fp 4/5 adjudicado · revisión final Spec opus+high y Código sonnet+high sobre `01f5c76`, re-revisión con 2 Important nuevos arreglados o adjudicados · 2 sin revisar: el arreglo N1 de la re-revisión y la evidencia de la re-medida, juntados en el cierre · suite sobre el merge de sincronización

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Con el umbral sin definir, termina el turno con una pregunta y sin `spec.md`, y no lo da por decidido | ejecución real (`iq1`, fase `fix`) | 3/3 |
| Con el prompt completo, no pregunta antes de `spec.md`: lo escribe y lo presenta, con nombres y ficheros en ✋ | ejecución real (`iq2`, fase `fix`) | 2/2 |
| Con «Abierto», pregunta el separador citando `;` y no pregunta el fichero de test | ejecución real (`iq3`, fase `fix`) | 2/2; `iq3-2` pregunta antes el alcance y deja el separador como tuyo para la siguiente |
| Con el prompt de arranque largo, pregunta y no da el umbral por decidido | ejecución real (`iq5`, fase `fix`) | 2/2 |
| Con la spec aprobada por delegación, no pregunta y deja el umbral en ✋ «pendiente» | ejecución real (`iq4`, fase `fix-iq4`, n = 2) | 2/2 |

### 4.3 Residuales / deuda generada

- El fallo de campo de la 0355 («en `delegate` no pregunta nada») no se reprodujo ni con una petición corta ni con un prompt de arranque largo. Queda como posible falso negativo de sesión larga; lo vigila el campo y la 0357, que saca las propuestas del agente de «Decisiones ya tomadas».
- El arreglo N1 («as territory, not a script») no se volvió a medir.

## 5. Aprendizajes

- Una petición de varias líneas en una batería se escribe con `<br>` → cabecera de `tests/batteries/sdd-propose/battery.md`.
- Que el lanzador diga «define SUBJECT_CAP» cuando la celda «Suma» lleva texto al lado del número no ayuda a encontrar el fallo → ticket del kit.

Retro: corrección repetida → ticket del kit: en la entrevista de `sdd-grilling`, la forma de la pregunta de diseño (bloque ❓ con alternativas, hallazgos y términos del kit) abrumó al dev-lead dos veces («no te entiendo nada…», «me abrumas con texto cuando creo que es sencillísimo»), y la skill da esa forma por buena
Retro: error que cazaría un chequeo → ticket del kit: la fila «Suma» de «Previsión de coste» con texto junto al número («49 sujetos (22 gastados)») deja la campaña sin techo y el lanzador solo dice «define SUBJECT_CAP (previsión de la spec)»; ni `spec-template.md` ni el repaso de coherencia lo comprueban

## 6. Adendas
