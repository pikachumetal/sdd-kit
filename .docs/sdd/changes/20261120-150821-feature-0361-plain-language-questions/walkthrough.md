---
id: 20261120-150821-feature-0361-plain-language-questions
feature: 0361
title: Walkthrough — Las preguntas de la entrevista hablan en el idioma del producto
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-20
---

# Walkthrough — Las preguntas de la entrevista hablan en el idioma del producto

## 1. Cambios realizados

- **Batería de `sdd-grilling`**: escenario nuevo `j1` (paso `sdd-propose`, molde `reservas`): una petición técnica («`libres` no tiene en cuenta el día…») y un segundo turno en el que el dev-lead dice su regla en una frase. Filas de rúbrica J1 (la pregunta nombra cada pieza con el vocabulario del proyecto, con el nombre del código detrás; sin palabras _Evitar_; el caso añadido, marcado) y J2 (la regla del usuario se devuelve con sus palabras y se pregunta si es así). `tests/batteries/sdd-grilling/battery.md` (`21eeb0038`, `71c3ccc83` y el commit de cierre) y `tests/batteries/sdd-grilling/subject.mjs` (`21eeb0038`).
- **Skills**: sin cambios netos. `sdd-grilling` y `sdd-spec-writing` se editaron en tres versiones (`92313cce4` y la tanda de corrección) y volvieron a las de `develop` en `71c3ccc83` (tercera enmienda), con sus topes de `cli/test/kit/word-budget.test.ts`.
- **Evidencia** en la carpeta de la spec: `red/` (RED en `salas`), `red-reservas/`, `green-salas/`, `green-reservas-1/` y `green-reservas/` (los textos probados), `ab-base/`, `ab-new-salas/` (cortado), `ab-new-1/` y `ab-new/`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1h
- Esfuerzo real: 1,45 h — reloj de la sesión 3,27 h desde 2026-11-20T12:54Z, sin 109 min de espera al dev-lead (15 esperas)
- Desviación: +0,45 h (+45 %)
- Causa de la desviación: dos enmiendas y una tanda de corrección que el plan no preveía (tres textos probados en vez de uno, y el `j1` rehecho sobre `reservas`); esperas y huecos: 12:59Z 56 min; 13:55Z 1 min; 13:56Z 3 min; 14:00Z 0 min; 14:00Z 7 min; 14:08Z 0 min; 14:09Z 3 min; 14:13Z 1 min; 14:26Z 5 min; 14:48Z 4 min; 14:53Z 1 min; 15:01Z 6 min; 15:22Z 13 min; 15:43Z 8 min; 15:51Z 0 min
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 69.137.281 — claude-opus-5-5 69.137.281
- Tokens de subagentes: 4.816.552 en 6 despachos — Re-revisar spec 0361 claude-sonnet-5-5 216.585 / 1 min; Re-review fix pass 0361 claude-opus-5-5 1.060.368 / 2 min; Final review — Code axis claude-sonnet-5-5 543.266 / 1 min; Revisar enmienda 0361 claude-sonnet-5-5 210.763 / 1 min; Final review — Spec axis claude-opus-5-5 2.580.315 / 5 min; Revisar spec 0361 claude-sonnet-5-5 205.255 / 0 min
- Coste de la sesión: 24,28 $ (hilo 20,76 $ + subagentes 3,52 $)
- Coste de sujetos: 9,61 $ en 38 sujetos sonnet — RED `salas` 1,01 $; GREEN `salas` 0,87 $; A/B base 1,62 $; A/B nuevo cortado 0,52 $; RED y GREEN `reservas` ~1,93 $; A/B nuevo 1,47 $; tanda de corrección ~2,19 $ (de `battery.mjs`, coste acumulado por fase)
- Review de spec: 1 revisor (dos vueltas y otra para la primera enmienda) · hallazgos 30, aceptados 25

## 3. Desviaciones del plan

- Tres enmiendas, todas aprobadas por el dev-lead: (1) los nombres del código no salen de la pregunta, van detrás del vocabulario del proyecto, y `j1` pasa a `reservas` (corrección del dev-lead por la sesión «sdd-kit develop»); (2) tras el GREEN en rojo, la regla se lleva también a la nota de entendimiento de `sdd-spec-writing` y la devolución de la regla a «Answers»; (3) tras seguir en rojo, la feature cierra solo con la prueba.
- Task 3 nueva para lo que tocaba la Task 1 cerrada.

### Decisiones tomadas sin el dev-lead

- J2 acepta «ese día, a esa hora» con coma — j1-1 lo repetía así; la fila mide las palabras, no la puntuación — si está mal, J2 pasa una paráfrasis con coma.
- Coste del sujeto `j1` 0,50 $ frente a 0,23 $ previstos — la previsión se rehízo con `battery.mjs plan` — el GREEN costó ~1 $ más de lo previsto al principio.
- Brazo base del A/B y GREEN a la vez, por encima de los 3 de `maxParallelAgents` — ahorra espera — la máquina va más cargada mientras corren.
- Preguntar al dev-lead antes de escribir la primera enmienda — el mensaje de «sdd-kit develop» chocaba con su «sí» sobre los casos añadidos — un turno más de parada.
- Lo que tocaba la Task 1 cerrada va a una Task 3 — `ab-base/` sigue valiendo, la base no cambia — si está mal, el A/B compara con sujetos de otro momento.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 779/779 · cli:typecheck: corrió · cli:test: corrió 2575/2590 (15 saltados) · 2 min 5 s · configuración: la del gate, sin `--affected` (corre las tareas del Scope) · sobre el commit de cierre (el árbol de la pasada de fix; después solo entró documentación)
- `kit:own`, `kit:copies` y `cli/test/kit/word-budget.test.ts` en verde con las skills de vuelta a `develop`; el pre-commit pasó en cada commit.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-20 · RED de `j1` en `reservas` con el kit de `develop`: J1 y J2 fallan 2 de 2 (el escenario reproduce el fallo, que es lo que se entrega) · `battery.mjs verdict` sobre `red-reservas/out` → «j1 · 2/2 · puerta verde · sin leer: R2, R12, J1, J2» · gate 779/779 y 2575/2590 · revisión final Spec y Código sobre `71c3ccc83`, re-revisión limpia de la pasada de fix (en el commit de cierre)

| Prueba (`j1`, n = 2) | J1 Idioma del proyecto | J2 Devolver la regla |
| --- | --- | --- |
| Base, molde `salas` | falla 2 de 2 | falla 2 de 2 |
| Base, molde `reservas` | falla 2 de 2 | falla 2 de 2 |
| Texto 1 (molde de la pregunta), `salas` | falla 2 de 2 | falla 2 de 2 |
| Texto 2 (enmienda 1), `reservas` | falla 2 de 2 | falla 2 de 2 |
| Texto 3 (nota de entendimiento y «Answers»), `reservas` | falla 2 de 2 | pasa 1 de 2 |

A/B de g7, g8, g9 y p2 (n = 2 por brazo): puerta verde en todos; sin mejora clara; con el texto 2, g8 pasó de preguntar abierto a confirmar la cita de `PRODUCT.md` y g9-1 cerró con dos preguntas.

### 4.3 Residuales / deuda generada

- La fila «Lista» de las preguntas con jerga sigue abierta, con lo aprendido: la jerga nace sobre todo en la nota «Lo que he entendido» del primer mensaje, no en la ❓; mover o añadir prosa, también en la línea exacta de la nota, no la quita; por Art. II es un fallo de forma, que pide un hueco obligatorio en la plantilla del mensaje.

## 5. Aprendizajes

- «Regla lejos de su paso» no era la causa de la jerga, o no la única: con la regla en el molde y en la línea de la nota, J1 sigue 0 de 2 → fila de deuda de las preguntas con jerga (`.docs/sdd/steering/debt.md`), vía el ticket.
- El lanzador de baterías lee el techo de sujetos de la fila «Suma» de la spec: un texto entre paréntesis en esa celda lo rompe y no lanza nada → ticket del kit.

Retro: corrección repetida → ticket del kit: la entrevista de esta misma feature repitió el fallo que quería arreglar (el dev-lead: «a que tope te refieres», «no acabo de ver el problema», «que me estas preguntando?»); el molde de «Shape of a question» de `sdd-grilling` sigue llevando a preguntas que no se entienden a la primera
Retro: documento o skill desmentido → ticket del kit: la causa «regla lejos de su paso» de la fila de deuda de las preguntas con jerga; con la regla en el paso, J1 sigue 0 de 2
Retro: error que cazaría un chequeo → ticket del kit: `battery.mjs run` sale con «define SUBJECT_CAP (previsión de la spec)» si la celda de la fila «Suma» de la spec lleva texto tras el número; no lanzó nada (0 $), pero costó un relanzamiento
