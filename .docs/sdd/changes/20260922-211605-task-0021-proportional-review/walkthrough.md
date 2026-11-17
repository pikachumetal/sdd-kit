---
id: 20260922-211605-task-0021-proportional-review
task: 0021
title: Walkthrough — Revisión por task abaratada
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Revisión por task abaratada

## 1. Cambios realizados

- **Partición y reserva** (`884ccc3`, `be88646`; en `develop`, `72c1b76` y `2932930`): la fila 0021 se partió en tres, en serie tras ella: la 0031 (effort real al despachar) y la 0032 (bordes de la revisión). La palanca «revisión en paralelo con la task siguiente» pasó a la 0022 (decisiones del dev-lead).
- **RED previo** (`4049a4b`): seis sujetos antes de la spec ([`tests/proportional-review-red.md`](../../../../tests/proportional-review-red.md)). Superpowers ya cubría cuatro de las cinco palancas de la fila; lo que las anulaba era texto del kit.
- **Restricciones de código y de proceso** (`1a1d6bc`): `plan-template.md` parte las Restricciones globales en «De código» y «De proceso»; `encargo-revision.md` pasa a la cabecera «Restricciones de código», con tolerancia de una unidad en los umbrales, la definición de qué es modificar un test RED y la sección «Revisor final» (lee el paquete, no ejecuta suite, build ni lint); el paso 6 de `sdd-start-task` y `overrides-superpowers.md` despachan solo el bloque «De código»; el Art. X recoge la tolerancia.
- **Repaso de coherencia** (`be3c2f5`, afinado en `79affd7`): el paso 4 aplica el «Spec Self-Review» de `brainstorming` antes del gate, en los dos modos, y pide cambiar todas las apariciones de un literal.
- **Anclas** (`tests/ProportionalReview.Tests.ps1`, `54300d6` con la aserción que pidió la revisión final) y la prueba de lite de `tests/DispatchBrief.Tests.ps1`.
- **GREEN** (`79affd7`): [`tests/proportional-review-green.md`](../../../../tests/proportional-review-green.md).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 0,75h — reloj del hilo, aproximado con las marcas de los commits (de `3cd0919`, 23:33, al cierre, ~00:20). Spec y plan con el RED previo: ~0,75h (de ~22:50 a 23:33).
- Desviación: −1,25h (−63 %)
- Causa de la desviación: la estimación contaba con ediciones de prosa iteradas y un GREEN de media hora; las ediciones fueron cortas (cuatro ficheros de texto) y cada tanda de sujetos corrió en paralelo en ~2 min. La única ronda extra (R3) costó ~5 min.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 142003 en 1 despacho — revisor final Sonnet 142003 / 8,7 min
- Coste de sujetos: 5,15 $ en 14 sujetos Sonnet — RED 2,44 $ (6); GREEN 2,71 $ (8)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 2 recibió una frase más tras el GREEN («Si cambias un literal, busca todas sus apariciones…»), commiteada con el GREEN (`79affd7`) y repetido R3 con dos sujetos.
- `green/m3` no se versiona: el lanzador GREEN usa `red/m3`, idéntico, porque la copia pasaba de 140 caracteres de ruta.
- La revisión final añadió un commit de test (`54300d6`).

### Decisiones tomadas sin el dev-lead

- R3 ronda 1 dejó un THEN con el literal viejo (r3-1) → frase nueva en el paso 4 y R3 repetido (2/2) — si me equivoco, la frase sobra: una línea del `SKILL.md`.
- Los commits solo de `roadmap.md` y el merge de `develop` quedaron fuera del paquete del revisor final; los leí en el hilo — si me equivoco, una fila mal escrita en el roadmap, visible en `git log`.
- `green/m3` quitado por longitud de ruta, lanzador apuntado a `red/m3` — sin coste en la evidencia: mismo molde byte a byte.
- Disparador de la validación diferida concretado por mí con el uso más próximo, porque la frase del dev-lead no lo nombraba (decisión del dev-lead del 2026-09-22 en la fila 0015) — si me equivoco, el dev-lead lo corrige en la fila del roadmap.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester ./tests` (pre-commit de cada commit y del merge de `develop`): `Tests Passed: 324, Failed: 0, Skipped: 6`.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «diferida» · disparador: la primera task con subagentes en un proyecto del equipo con el kit 1.2.0, a cargo del dev-lead.

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Anclas nuevas en rojo antes de editar (8 pruebas, cada una por su aserción) | ✅ salida en `tasks.md` |
| 2 | Revisor de task ante un diff correcto con tres trampas (R1) | ✅ «Approved» 2/2 (RED: «Needs fixes» 2/2) |
| 3 | Función de 21 líneas frente a 20 (R1, R2) | ✅ Important 0/4 (RED 2/4) |
| 4 | Revisor final: suite, lint y diff rehecho (R2) | ✅ 0/2 ejecutan; 2/2 leen el paquete (RED 2/2 y 2/2) |
| 5 | Spec contradictoria al gate (R3) | ✅ 0/2 en la ronda 2 (RED 1/2; ronda 1, 1/2 corrección incompleta) |
| 6 | Revisor final real de esta rama con la cabecera nueva | ✅ no ejecutó la suite; un Important real (ancla), arreglado con rojo contra `be3c2f5` |

### 4.3 Residuales / deuda generada

- **Trailer con un modelo prohibido: disparador ausente** (RED y GREEN, 0/8 leen el mensaje completo de un commit) → deuda como posible falso negativo; el disparador observable es un revisor que ejecuta `git log` sin `--oneline`.
- **Rulings ya registrados tomados como hallazgo**: sin escenario → deuda.
- Minor diferidos de la revisión final: el commit `79affd7` es `test(sdd):` con una línea de skill; el Art. X solo da el ejemplo de las líneas.
- El punto «la cabecera del implementador admite cambios de formato» de la fila 0007 queda saldado aquí (decisión 5 de la spec).

## 5. Aprendizajes

- Antes de escribir guidance contra un coste de campo, leer qué hace ya superpowers: cuatro de las cinco palancas de la fila estaban en `subagent-driven-development` y lo que las anulaba era una línea del kit («todo incumplimiento es Important»). → `tech-stack.md` (cómo se testean las skills)
- Un revisor se mide como sujeto headless con el encargo como petición de `claude -p`: las tool calls del stream dicen si ejecutó la suite o rehízo el diff, sin marcadores en el molde. → `tech-stack.md`
- Un GREEN que corrige a medias cuenta como fallo: tras un veredicto «corregido», buscar el literal viejo en la salida (`grep`), porque el sujeto lo declara corregido aunque quede un THEN con el valor viejo. → `tech-stack.md`
- Reglas de proceso fuera del encargo del revisor: es convención del kit que los proyectos calcan en su plan. → ya en `plan-template.md` y en la capacidad `task-flow`; sin doc vivo adicional.
- Revisión de skills: esta task edita `sdd-start-task`, `sdd-templates` y la constitution; ninguna otra skill cita la regla vieja (revisado con `grep` de «Restricciones globales» y «Important» en `skills/`). El repo no tiene `.claude/skills/` (solo `settings.json`).

## 6. Adendas

- _Ninguna_
