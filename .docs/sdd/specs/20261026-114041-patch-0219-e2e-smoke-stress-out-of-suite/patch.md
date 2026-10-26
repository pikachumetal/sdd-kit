---
id: 20261026-114041-patch-0219-e2e-smoke-stress-out-of-suite
task: 0219
title: Patch — una prueba de estrés no entra en la suite E2E del gate
type: patch
solution: dev-lead
status: done
created: 2026-10-26
branch: patch/0219-e2e-smoke-stress-out-of-suite
commit: <hash>
---

# Patch 0219 — una prueba de estrés no entra en la suite E2E del gate

## Capacidades

- Modificadas: `feature-flow` — nuevo requisito «Una prueba de estrés no entra en la suite E2E del gate»

## 1. Síntoma

Fila de deuda «Un smoke hecho con E2E se queda en la suite, y una prueba de estrés entra como E2E» (dev-lead, caso de campo de GCO con kit 2.3, 2026-10-26): «en GCO los E2E se usaron para el smoke y no se borraron: la suite pasó de 40 min; se recortó a lo que hay que probar en la UI y vuelve a crecer con cada funcionalidad; el último parte de un compañero añadió E2E, uno de ellos una prueba de estrés».

Medido con la 3.0.0 ([RED](../../../../tests/e2e-smoke-stress-red.md)): la prueba de estrés se reproduce (1 de 1: el sujeto leyó `writing-e2e.md`, nombró el flujo core «editar celdas de una hoja y que se guarden» y la dejó en `e2e/`, que corre el gate). El smoke no (0 de 2: los dos sujetos dejaron su script en `/tmp`).

## 2. Solución fijada

Dev-lead, fila 0219 del roadmap y prompt de arranque (2026-10-26): «RED primero con un sujeto headless y la 3.0.0, sobre un molde con «Flujos core» y «Presupuesto E2E» en operations.md y dos escenarios»; «si el RED no lo reproduce, se cierra con la evidencia sin tocar texto; si lo reproduce, dos líneas en skills/sdd-tdd/references/writing-e2e.md (el smoke se ejecuta, su resultado va al walkthrough y su script no se queda como E2E; una prueba de carga o estrés se ejecuta como medida del smoke o vive en una suite aparte que no corre en el gate) y GREEN».

Con el RED partido, el dev-lead eligió «Solo la de estrés (Recomendada)» (2026-10-26): se escribe la línea de carga o estrés; la del smoke no, por el Art. I, y queda en la fila de deuda como posible falso negativo.

Lo que da por existente, comprobado: la regla 1 de `writing-e2e.md` («Name the Core Flow») y el eje de código de `sdd-verify` (`code-reviewer-prompt.md`, Important si un E2E nuevo no nombra un flujo core). Ninguno frena una prueba de estrés que nombra un flujo core.

## 3. Fix

- **Fichero(s)**: `skills/sdd-tdd/references/writing-e2e.md`, `tests/WordBudget.Tests.ps1`; evidencia en `tests/e2e-smoke-stress-red.md` y `tests/e2e-smoke-stress-green.md`; campaña en `red/` y `green/`
- **Cambio**: una frase al final del párrafo de la regla 1: «A load or stress test isn't an E2E, even on a core flow: run it as a smoke measurement, or in a suite the closing gate doesn't run.» Los topes de palabras suben lo que mide la frase: `sdd-tdd` Total 4020 → 4030 y Kit 91300 → 91328.
- **Decisiones**:
  - Solo la línea de estrés; la del smoke queda en la deuda — dev-lead (2026-10-26, «Solo la de estrés (Recomendada)»)
  - La frase va en la regla 1 y no en una regla propia: el sujeto del RED cumplió la regla 1 nombrando el flujo, y ahí es donde la lee — sin el dev-lead (método; no cambia lo que ve el usuario del kit fuera de esa guía)
  - Subir los topes de `WordBudget.Tests.ps1` lo que mide la frase, sin recortar otra pieza — dev-lead (2026-10-26, «Subir los topes (Recomendada)»)
  - La frase, acortada de 38 a 28 palabras para el tope, con el GREEN repetido — sin el dev-lead (método)
  - Un sujeto por escenario y uno más de `s1` para confirmar el limpio — sin el dev-lead (método, perfil `delegate`)
- **Una pieza entra, otra sale**: nada sale, aprobado por el dev-lead con los topes. La frase cierra un hueco de una regla existente sin regla nueva; la del smoke, que también entraba, no se escribe.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `s2`: la Task 2 de un plan pide una prueba de estrés de cinco sesiones | ✅ reproduce 1/1: `e2e/0027-concurrent-edit.spec.ts`, commiteado, en la suite del gate |
| 2 | RED `s1`: el smoke del paso 7 con `validation.mode: field` | ✅ limpio 0/2: los scripts quedan en `/tmp`; línea no escrita |
| 3 | GREEN `s2` con la frase nueva, una vez por redacción | ✅ 2/2: `stress/` con `playwright.stress.config.ts` y `npm run stress`; `playwright.config.ts` sigue con `testDir: './e2e'` |
| 4 | `tests/WordBudget.Tests.ps1` con los topes nuevos | ✅ 71/71 |

## 5. Tiempo (ligero)

- Estimación: 1,5 h (post hoc): no calibra
- Inicio: 2026-10-26T11:08Z
- Esfuerzo real: <se escribe al cerrar>
- Coste de sujetos: 2,22 $ en 5 sujetos Sonnet — RED 1,71 $ (3); GREEN 0,51 $ (2)

## 6. Delta de capacidad

### Capacidad: `feature-flow`

**ADDED — Una prueba de estrés no entra en la suite E2E del gate**
- GIVEN un proyecto con «Flujos core» en `operations.md` §Testing, entre ellos «editar celdas de una hoja y que se guarden», y un gate de cierre que corre `playwright test` sobre `e2e/`
- WHEN una task pide una prueba de estrés de cinco sesiones editando la misma hoja a la vez
- THEN la prueba no queda en `e2e/` ni en ninguna suite que corra el gate de cierre, aunque ejerza un flujo core
- AND vive en una suite aparte con su propio comando, o se ejecuta como medida del smoke con su resultado en el walkthrough
