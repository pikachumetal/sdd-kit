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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (Task 1, `0f4f608`).
- `canceladas` lista las reservas canceladas con su motivo: `src/app.js`, `test/cancel.test.js` (Task 2, `13b46f7`).
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar una carrera sobre el almacén en memoria — era un workaround hasta aislar el almacén — coste si es erróneo: la suite tarda el doble. Adjudicado en el cierre: `node --test` (el gate del plan y el del CI) pasa igual, 4 de 4 pasadas, y ningún fichero del repo lleva la bandera, así que no queda workaround ni deuda.

## 4. Verificación

### 4.1 Builds

- `node --test` → verde, en `25a1ae8` (4 pasadas, cada una con exit 0); `node --test --test-concurrency=1` → verde.
- Gate: `node --test` → suite: corrió todo · sobre el commit de cierre (el cierre junta `25a1ae8`, que solo toca `.docs/`, y el código no cambia desde `13b46f7`)
- Revisión final: Spec opus y Código sonnet sobre `13b46f7`, limpias. Re-revisión de `13b46f7..25a1ae8` (opus): 2 hallazgos Important documentales de `tasks.md`, corregidos en el cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite verde · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre `13b46f7`, re-revisión de `13b46f7..25a1ae8` con 2 hallazgos documentales corregidos. Verificado por el agente; el dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) y suite | ok |
| un motivo fuera de la lista (`"porque sí"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI) y suite | ok |
| sin `--motivo` responde lo mismo | ejecución real (CLI); la suite no lo cubre | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real (import de `run`, porque el almacén es en memoria y no sobrevive entre procesos) y suite | ok |

### 4.3 Residuales / deuda generada

- Ninguna. El caso «sin `--motivo`» tiene THEN y no tiene test: el smoke lo cubrió a mano.

## 5. Aprendizajes

- El almacén de reservas es en memoria: la CLI no encadena `cancelar` y `canceladas` entre procesos, y un smoke de ese par pasa por `run`. → sin destino nuevo: ya lo cubre la fila 0014 del roadmap («Motivo guardado»).

Retro: sin señales

## 6. Adendas

_Ninguna_
