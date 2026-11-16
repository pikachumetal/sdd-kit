---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`f765622`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva (`booking.reason`) y responde «cancelada Norte lun (sala ocupada)». Un motivo fuera de la lista, o ninguno, responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`5786784`): comando `canceladas`, una línea «sala día — motivo» por reserva cancelada. Ficheros: `src/app.js`, `test/cancel.test.js`, y `e2e/cancel.e2e.mjs` con los tres casos E2E nuevos.
- **Capacidad**: `capabilities/bookings.md` no existía; la ha creado `sdd capability merge` con los dos requisitos ADDED de la spec.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código: dos tasks, Native, como el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una supuesta carrera sobre el almacén en memoria — **no se aplicó**: ni `package.json` ni el «Gate de cierre» de `operations.md` llevan la opción, y el gate pasó sin ella — el problema real es una dependencia de orden entre tests (ver 4.3) — coste si está mal: ninguno, porque no cambió nada; el ruling queda anotado en `tasks.md` con esta aclaración.
- Cierre: eje de Arquitectura «no» por ruling, porque el plan no trae la línea `Eje Arquitectura:` — el diff no trae módulo, dependencia ni contrato nuevos; el único dato es un campo `reason` en un registro en memoria, sin esquema ni persistencia — coste si está mal: un cambio de datos sin revisión de arquitectura; la 0014 («Motivo guardado») lo va a reutilizar.
- Cierre: no he despachado una segunda re-revisión tras corregir `tasks.md`; una re-revisión no abre otra, y lo corregido es el registro, no el código.

## 4. Verificación

### 4.1 Builds

- `node --test test/ && node e2e/run.mjs` (gate de cierre), salida completa guardada: unitarias 5/5, E2E 7/7.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48,7 s · configuración: la del gate (sin `E2E_TRACE`: el truco del README no se usó) · sobre el commit de cierre (el cierre junta el commit que solo añadía `tasks.md`; el código es el de `5786784`)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:55279/health` → ok, levantado en esta sesión (el primer arranque no llegó a responder en 5 s; sin cambiar nada, el segundo sí, pid 73984) y parado al acabar con `env-down`.
- E2E: 48,2 s de 0,5 min — pasa del presupuesto (ver 4.3).
- Tanda: `# Tanda: 3 tests nuevos de cancel.e2e.mjs ×3 + 2 más de ese fichero ×1 = 11 ejecuciones · ~1,3 min (6,9 s × 11 ÷ 1 worker)`, 1,4 min reales (72,2 s + 12,1 s): 11/11 en verde, sin ningún rojo. Alcance contra `develop`, no `main`: solo `e2e/cancel.e2e.mjs` cambia; `free.e2e.mjs` no se tocó y no entró. Con la pasada del gate, cada test nuevo corrió 4 veces.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite unitaria 5/5 y E2E 7/7 · smoke 4/4 THEN con ejecución real · tanda 11/11 · revisión final Spec y Código limpias sobre `5786784`; la re-revisión del commit posterior, que solo añadía `tasks.md`, devolvió 3 Important y 1 Minor sobre el registro `tasks.md`, ninguno sobre el código: la fila de la Task 1 corregida, el ruling del gate y el eje de Arquitectura adjudicados (3.), el Minor y la dependencia de orden en la deuda.

Verificado por el agente (nadie más ha probado nada):

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite + E2E | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con `--motivo "me aburro"` + suite + E2E | ok |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok — ningún test lo cubre |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un proceso) + suite | ok |

### 4.3 Residuales / deuda generada

- `canceladas enseña sala, día y motivo` (`test/cancel.test.js`) depende de que el test anterior ya haya cancelado Norte lun: es una dependencia de orden, contra lo que dice `operations.md` («Datos»). Fila en «Por triar» de `debt.md`.
- Ningún test cubre «sin `--motivo`»: solo lo he comprobado ejecutándolo. Fila en «Por triar».
- La suite E2E pasa de su presupuesto: 48,2 s de 0,5 min (6 s por paso del runner con la traza completa) — deuda del proyecto, fila en «Por triar».
- La fila 0014 del roadmap («Motivo guardado») ya está hecha por esta feature (`booking.reason`); lo decide el dev-lead.

## 5. Aprendizajes

- Los dos requisitos de comportamiento → `.docs/sdd/capabilities/bookings.md` (creada por `sdd capability merge`; no existía).
- Ningún aprendizaje estructural ni de convención: `architecture.md`, `constitution.md` y `operations.md` quedan como están.

Retro: documento o skill desmentido → corregido en el mismo documento: el ruling del gate y «Arquitectura no (plan)» de `tasks.md` decían lo que el repo desmiente (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
