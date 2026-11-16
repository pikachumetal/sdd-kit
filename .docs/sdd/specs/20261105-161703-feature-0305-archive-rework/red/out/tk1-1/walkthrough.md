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

- **Cancelar con motivo** (`de6ee64`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada. Sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`03c2e4c`): el comando `canceladas` lista «sala día — motivo». `src/app.js`, `test/cancel.test.js`.
- **Capacidad** `bookings`: nueva, fusionada del delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en alcance: las dos tasks salieron como el plan.

### Decisiones tomadas sin el dev-lead

- El gate corre con `node --test --test-concurrency=1` en lugar de `node --test` — esquiva la carrera de los tests sobre el almacén compartido en memoria, workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Suite ejecutada por el agente: 5/5 verdes.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,16 s · configuración: la del gate más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 03c2e4c; lo posterior es solo `tasks.md` (17 líneas)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, en el mismo proceso que `cancelar`: el almacén es en memoria y cada invocación de la CLI parte de cero |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén de reservas en memoria y se pisan: el gate corre en serie. Fila en la deuda técnica del roadmap.
- «sin `--motivo`» no tiene test propio en la suite; está cubierto por la ejecución real de arriba.

## 5. Aprendizajes

- Los tests de la CLI comparten el almacén en memoria del módulo y no se pueden paralelizar → deuda técnica del roadmap (aislar el almacén por test).

Retro: sin señales

## 6. Adendas

- _Ninguna_
