---
id: 20261101-164101-patch-0278-e2e-titles-core-flows
task: 0278
title: Patch — un test del proyecto compara los títulos E2E con «Flujos core»
type: patch
solution: dev-lead
status: done
created: 2026-11-01
branch: patch/0278-e2e-titles-core-flows
commit: a6f263cc
---

# Patch 0278 — un test del proyecto compara los títulos E2E con «Flujos core»

## Capacidades

- Modificadas: `feature-flow` — nuevo requisito «Un test del proyecto compara los títulos E2E con Flujos core»

## 1. Síntoma

Fila 0278: «En OdySIF, document-manager y GCO las pruebas de comprobar una tarea se quedaron en la rama, y la suite llegó a casi una hora. Hoy solo lo frena la revisión final, y un patch no la lleva desde la 0206.»

Medido ([RED](../../../../tests/e2e-core-flow-titles-red.md)): 1 de 1 sujetos leyó la guía, nombró el flujo y no dejó nada que compare títulos.

## 2. Solución fijada

Dev-lead, 2026-11-01, «si», al proponer el enfoque de la fila: «`writing-e2e.md` y `operations-template.md` piden a todo proyecto con E2E un test que compara los títulos de `test(...)` con "Flujos core"». Lo que da por existente, comprobado: la regla 1 de `writing-e2e.md`, el campo de la plantilla y `findE2eSuiteViolations` en `conventions.test.ts` de document-manager.

## 3. Fix

- **Fichero(s)**: `skills/sdd-tdd/references/writing-e2e.md`, `skills/sdd-templates/templates/operations-template.md`; evidencia en `tests/e2e-core-flow-titles-red.md` y `tests/e2e-core-flow-titles-green.md`; campaña en `red/` y `green/`
- **Cambio**: la regla 1 pide el test, dice dónde vive y qué se hace con un rojo; un título nuevo pasa a ser propuesta para el ✋. La plantilla dice que un test compara la lista.
- **Decisiones**:
  - Un test de títulos, solo con la lista declarada, y la lista la decide el dev-lead — dev-lead (fila y prompt de arranque)
  - El test vive en una suite que el cierre corre entera (`unitario` o `pendiente`), aunque lea ficheros: con `--affected` no correría en todos los carriles — sin el dev-lead (método)
  - Todo título nuevo es propuesta para el ✋, no solo un flujo nuevo: si el agente pudiera añadir su línea, el test no frenaría nada — sin el dev-lead (método, aplica «la lista la decide el dev-lead»)
  - `sdd-init` y la migración v3.0.0 no ofrecen el test ni cambian: un test en rojo desde el primer día frena el gate de todas las ramas, y limpiar la suite está fuera de alcance. Lo pide la guía al tocar el primer E2E; sin tocar ninguno no entra título nuevo — sin el dev-lead (la fila lo deja a este patch)
  - `code-reviewer-prompt.md` y `frontend-verification.md` no cambian: el eje de código sigue cubriendo al proyecto que aún no tiene el test, y una verificación ya no escribe specs — sin el dev-lead (método)
  - Sin exclusión `probe-*` como la de document-manager: lo que no nombra un flujo no llega a la rama — dev-lead (prompt de arranque)
- **Saldo de palabras**: `writing-e2e.md` 1003 → 1002; `operations-template.md` 1143 → 1143. Lo paga el bloque de dos líneas del Overview, que repetía los títulos de las reglas; la fila «The behavior is new…», que repetía la regla 1; y «say which in its `describe`», que la lista sustituye.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `t1` con el texto de antes | ✅ reproduce 1/1: E2E nuevo, sin test de títulos |
| 2 | GREEN `t1`: el test del sujeto, sin tocar la lista | ✅ `Tests  1 failed (1)`, nombra «formatea una celda como moneda» |
| 3 | El mismo test con el título en la lista | ✅ `Tests  1 passed (1)` |
| 4 | GREEN `t2` (`pendiente`) y `t3` (sin E2E) | ✅ sin test de títulos; `t3` no lo pide |
| 5 | `word-budget`, `skills`, `path-length` y `operations-gate-fields` de `cli/test/kit/` | ✅ 184 pasados, 11 saltados |

Validación en campo: 2026-11-01 · RED 1/1 · GREEN 3/3 (0,91 $) · el test del sujeto, rojo y verde a mano en una copia del molde · no probado: el texto recortado tras el GREEN (cuatro palabras), ni un molde con Playwright real

## 5. Tiempo (ligero)

- Estimación: 1,5 h + ~10 min de gate de cierre
- Inicio: 2026-11-01T16:30Z
- Esfuerzo real: 0,19 h — reloj de la sesión 0,19 h desde 2026-11-01T16:30Z, sin 0 min de espera al dev-lead (0 esperas)
- Desvío: −87 %. Sin paradas ni rojos, y con el molde `hojas` y el lanzador de sujetos ya hechos, que la estimación contaba como trabajo
- Coste de sujetos: 0,91 $ en 4 sujetos Sonnet — RED 0,20 $; GREEN 0,71 $

## 6. Delta de capacidad

### Capacidad: `feature-flow`

**ADDED — Un test del proyecto compara los títulos E2E con Flujos core**
- GIVEN un proyecto con «Flujos core» declarados en `operations.md` §Testing y un `test(...)` cuyo título no está en la lista
- WHEN una task toca un E2E siguiendo la guía de `sdd-tdd`
- THEN deja un test en una suite que el cierre corre entera, que sale en rojo y nombra ese título
- AND con el título en la lista sale en verde
- AND con la lista `pendiente` o sin E2E, no se pide ese test
