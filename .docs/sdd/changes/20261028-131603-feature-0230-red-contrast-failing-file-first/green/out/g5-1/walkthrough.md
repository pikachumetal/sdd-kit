---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva (c34ab6b). Comando `canceladas`: lista «sala día — motivo» (59adcb4).
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- Capacidad `bookings` creada con `sdd capability merge` (dos requisitos ADDED).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Ojo: ese flag no está en `gate.json` ni en `scripts/gate.mjs`; el ruling no se aplicó. La deuda queda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → `bookings:test`: corrió, 5 passed, 0 failed · `rooms:test`: saltada (la rama no toca sus entradas) · 1 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

Validación en campo: 2026-10-28 · smoke de las 4 salidas con ejecución real (abajo) y gate en verde sobre el commit de cierre; sin revisión de UI. La línea anterior de este registro (2026-10-26) citaba `--motivo sala-ocupada`, un motivo que no está en la lista y que el código rechaza; la sustituye este smoke, hecho con «sala ocupada». Verificado por el agente, no por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → «motivo no válido: …» | ejecución real (CLI) | ok; sin test en la suite |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (mismo proceso: el almacén es en memoria) + suite | ok |

### 4.3 Residuales / deuda generada

- Tests de `cancel.test.js` acoplados por el almacén compartido en memoria: fila de deuda en el roadmap.
- El THEN «sin `--motivo`» no tiene test propio.

## 5. Aprendizajes

- El comportamiento nuevo → `capabilities/bookings.md`.
- Convención, arquitectura y versiones: nada nuevo (no hay `architecture.md`; ningún aprendizaje estructural).
- Skills: el proyecto no tiene `.claude/skills/` (mirado); este trabajo no revela ningún patrón reutilizable.
