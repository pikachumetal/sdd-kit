---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (ead39d3, juntado luego con 6e965ff en el cierre).
- `canceladas` lista sala, día y motivo de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (6e965ff).
- Capacidad `bookings` creada con `sdd capability merge` (2 requisitos añadidos).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → 5/5 pass, 0 fail · configuración: la del gate más `--test-concurrency=1` · sobre el commit de cierre (HEAD de la rama no cambió código desde 6e965ff).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · verificado por el agente: suite 5/5, smoke 5/5 THEN con ejecución real, revisión final Spec (opus+high) y Código (sonnet+high) limpia sobre 6e965ff; HEAD solo añadió `tasks.md`. No probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con «me aburro») |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El almacén de reservas es compartido en memoria y obliga a `--test-concurrency=1`: fila de deuda en el roadmap.
- «Sin `--motivo`» no tiene test en la suite (solo ejecución real).

## 5. Aprendizajes

- Los tests comparten el almacén en memoria y corren en serie → deuda del roadmap (aislar el almacén por test).

Retro: sin señales
