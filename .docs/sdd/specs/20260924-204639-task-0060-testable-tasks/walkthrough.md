---
id: 20260924-204639-task-0060-testable-tasks
task: 0060
title: Walkthrough — Tasks que se prueban, escenarios con datos y guion de pruebas
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — Tasks que se prueban, escenarios con datos y guion de pruebas

## 1. Cambios realizados

- **Plantillas** (`8bbd796`, REFACTOR en `2c4f0e3`):
  - `plan-template.md` §2 lleva la orientación «Tasks verticales» (orientación, no regla; sin tamaño fijo en horas), con «Las capas de una sola funcionalidad no son base común». La task tipo lleva la línea `**Se prueba en la aplicación**`, o «no, porque <base común | migración | refactor>».
  - `spec-template.md`: los escenarios de reglas de negocio llevan datos concretos (ejemplo de la bolsa FR, IT, PT), y una entrada de «Reglas de la capacidad» que cambia va con su valor completo («se escribe A, B y C»).
- **`sdd-start-task`** (`a691c49`): el paso 7 presenta el **guion de pruebas** (pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, separado del smoke) en vez de «cómo probarlo». El paso 6 para en `pair` al cerrar cada task, con el guion de esa task.
- **`sdd-end-task`** (commit de cierre, enmienda): el pre-check del paso 0 presenta el mismo guion cuando el usuario pide cerrar sin haber validado.
- **Test y evidencia**: `tests/TestableTasks.Tests.ps1` (7 tests de literales), `tests/testable-tasks-red.md` y `tests/testable-tasks-green.md`. El molde, el lanzador y las salidas están en `red/` y `green/` de esta carpeta.
- **Capacidades** (en el cierre): `task-flow` (2 ADDED y el MODIFIED de la validación) y `capabilities` (el MODIFIED del delta).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 0,8 h — reloj del hilo aproximado por las marcas de los commits (hora local):
  - apertura a las 23:58;
  - Tasks 1 y 2 a las 23:59 y 00:01;
  - GREEN y REFACTOR hasta las 00:19;
  - revisión final y arreglo del paso 0 hasta las 00:29;
  - cierre ~0,2 h.
  La spec, el plan y el RED previo, de ~22:35 a 23:58 (~1,4 h), quedan fuera de este número.
- Desviación: −0,7 h (−47 %)
- Causa de la desviación: las tasks eran frases de plantilla ya redactadas en el plan, y los sujetos corrieron en segundo plano mientras se escribía la evidencia. Es el sesgo de sobreestimar la guidance que advierte `estimation.md`.
- Modelo del hilo: Opus 5.5 (1M context)
- Tokens del hilo: no medido
- Tokens de subagentes: 113474 en 1 despacho — revisor final Opus (effort high) 113k / 3 min
- Coste de sujetos: 5,95 $ en 14 sujetos Sonnet — RED previo 2,23 $ (5); GREEN 1,76 $ (5); REFACTOR 1,57 $ (2); enmienda e0 0,39 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La enmienda del paso 0 de `sdd-end-task` (fichero fuera del plan). La decidió el dev-lead tras la revisión final: «Arreglarlo aquí (Recomendada)». La previsión subió de 13 sujetos y 8 $ a 15 y 9 $.

### Decisiones tomadas sin el dev-lead

- Task 2: el helper `Assert-Literal` pasó de `-BeLikeExactly` a `.Contains` antes de implementar — en `-Like` la comilla invertida escapa y el literal `` `pair` `` no casaría nunca — coste si está mal: ninguno, el test es más estricto.
- Task 3: REFACTOR de `plan-template.md` §2 tras el GREEN p3, que partió por capas con «no, porque es una base común». Se añadió «las capas de una sola funcionalidad no son base común», con 2 sujetos de la reserva — coste si está mal: la salida sigue abierta y la pieza 1 queda como deuda.
- Final: los declinados del revisor quedan fuera de la rama o del cierre, como dice el plan: `.docs/workflow/greenfield.md`, la fusión de capacidades, el bump y el changelog, `control-profiles.md`, repetir p1, el `effort-medio` del molde y el salto de línea final — coste si está mal: ninguno en esta rama.
- Deferred minors de la revisión final (van a una fila de deuda del roadmap):
  - La parada de `pair` no dice de dónde sacar el guion si la task no tiene la línea «Se prueba en la aplicación».
  - «lo que no esté aquí desaparece» en `spec-template.md` se puede leer como la subsección entera.
  - `plan-template.md` §2 lleva dos ejemplos de la misma idea.
  - La Task 3 añadió un literal al test RED de la Task 1 sin nombrarlo en el ruling (queda nombrado aquí).
  - Las casillas de «Verificación por task» de `tasks.md` estaban sin marcar (corregido en el cierre).

## 4. Verificación

### 4.1 Builds

- Sin build (Markdown y Pester).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «ok smoke diferido al iuso, end.feedback, comit y merge» · disparador: la primera task que el dev-lead planifique y valide con el kit de `develop` tras este merge (la 0058, siguiente de la serie), a cargo del dev-lead. Lo concretó el agente, porque la frase decía «al uso».

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Suite completa del kit (`Invoke-Pester -Path tests`, `Slow` incluidos), tras la Task 3 | 609 pasan, 0 fallan |
| 2 | Suite rápida tras el arreglo del paso 0 | 546 pasan, 0 fallan |
| 3 | `tests/TestableTasks.Tests.ps1` | 7/7 |
| 4 | GREEN p3 (web por capas), tras el REFACTOR | pasa 2/2 |
| 5 | GREEN p2 (escenarios con datos y reglas completas) | pasa 1/1 |
| 6 | GREEN v7 (guion en la validación) | pasa 1/1 |
| 7 | GREEN v6 (`pair` para tras la task, con guion) | pasa 1/1 |
| 8 | GREEN c6 (`delegate` no para) | pasa 1/1 |
| 9 | GREEN e0 («cierra» sin validar: guion en el paso 0) | pasa 1/1; 2 de 4 pasos con resultado genérico |

Los escenarios del delta son los casos del smoke: tasks verticales (p3), la parada de `pair` con guion (v6, c6), la validación con guion (v7, e0), y escenarios con datos y reglas completas (p2).

### 4.3 Residuales / deuda generada

- Los cinco minors diferidos de la revisión final: fila de deuda en el roadmap.
- En el GREEN e0, el guion dio dos resultados genéricos («Reserva correcta, sin error») teniendo el literal en su smoke. Va en la misma fila.

## 5. Aprendizajes

- Una salida que da la guía («no, porque <base común…>») se usó para justificar el fallo que la guía quiere quitar; el contraejemplo la cierra → `tech-stack.md` (Cómo se testean las skills).
- Un molde sin la tentación da un RED limpio falso: la CLI pequeña no partía por capas, y la web con capas sí → `tech-stack.md`.
- En un test de literales de Pester, `-BeLike` no sirve con código Markdown, porque la comilla invertida es escape → `tech-stack.md`.
- `tools.mjs` de la 0009 no oculta `/c/Users/<usuario>/` → `tech-stack.md`.
- La parada de `pair` solo en la tabla de gates no se aplicaba (RED v6), y confirma el aprendizaje de la 0055. Ya está en `tech-stack.md`; no se duplica.

## 6. Adendas

- _Ninguna_
