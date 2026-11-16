---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Task 1 — Cancelar con motivo** (`d3885f5`): `src/app.js` gana la lista cerrada de motivos (`cambio de planes`, `sala ocupada`, `otro`) y `cancelar <sala> <día> --motivo <motivo>`; un motivo fuera de la lista o sin `--motivo` responde `motivo no válido: cambio de planes, sala ocupada, otro`. La reserva cancelada guarda su motivo. Tests en `test/cancel.test.js`.
- **Task 2 — Listado de canceladas** (`ce28086`): comando `canceladas`, una línea `<sala> <día> — <motivo>` por reserva cancelada. Test en `test/cancel.test.js`.
- Documentación: `tasks.md` con la revisión final y `migrations/v3.0.0.md` (una línea).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Las tasks se implementaron como el plan; el plan decía `node --test` como gate y la ejecución lo cambió (ruling de abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén de reservas compartido en memoria; es un workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` sobre el último commit de la rama antes del cierre → 5 pasan, 0 fallan, 0,18 s; salida completa guardada en el scratchpad de la sesión.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,18 s · configuración: la del gate de la constitución más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre (el cierre solo suma documentación sobre el último commit de la rama antes del cierre: el mismo código).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final de Spec y Código limpia sobre `ce28086`; lo posterior (`tasks.md` y `migrations/v3.0.0.md`, 18 líneas de documentación) no se re-revisó. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) y `suite` | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (CLI, con `me aburro`) y `suite` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real (CLI); la suite no lo cubre | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (un solo proceso: `run('cancelar', …)` y `run('canceladas', [])`) y `suite` | `Norte lun — sala ocupada` |

- Lo reportado por el usuario: nada.
- Sin probar: `canceladas` desde la CLI tras un `cancelar` en otra invocación; el almacén está en memoria y cada invocación arranca vacía (lo cubre la 0014, «Motivo guardado»).

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén de reservas en memoria y el de `canceladas` depende del de `cancelar`; el gate necesita `--test-concurrency=1` → fila en «Deuda técnica» del roadmap.
- Sin test de `cancelar` sin `--motivo` (el THEN solo se probó a mano) → fila en «Deuda técnica» del roadmap.

## 5. Aprendizajes

- La lista cerrada de motivos y los dos comportamientos nuevos son comportamiento observable → capacidad `bookings` (`capabilities/bookings.md`), fusionada con `sdd capability merge`.
- El workaround de `--test-concurrency=1` no se escribe en `tech-stack.md`: queda en el ruling y en su fila de deuda → «Deuda técnica» del roadmap.

Retro: sin señales

## 6. Adendas

- _Ninguna._
