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

- Task 1 (e807bdf): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- Task 2 (0f73464): comando `canceladas`, que lista «<sala> <día> — <motivo>». `src/app.js`, `test/cancel.test.js`.
- Capacidad `bookings` creada con los dos requisitos del delta (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. La re-revisión apunta que con un solo fichero de tests el flag no cambia nada y que lo que hay es una dependencia de orden entre tests; el gate de cierre es `node --test`, como dice el plan, y pasa igual con y sin el flag.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, y con `--test-concurrency=1` también 5/5.
- Gate: `node --test` → corrió 5/5 · sobre el commit de cierre (el código es el de 0f73464; el cierre solo añade documentos)

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · suite 5/5 · smoke con ejecución real de los 5 THEN, con la salvedad de la tabla · revisión final Spec (opus) y Código (sonnet) limpias sobre 0f73464; re-revisión del commit de documentación posterior a 0f73464 con un Important de documentación (commit de la task 1 mal citado) corregido. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` responde eso |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | provocado con `--motivo xyz`: responde eso |
| sin `--motivo` → el mismo mensaje | ejecución real | provocado con `cancelar Norte lun`: responde eso |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | en un mismo proceso (cancelar y luego `canceladas`) responde eso; **en dos invocaciones de la CLI sale vacío**: las reservas viven en memoria y no sobreviven al proceso (ver 4.3) |

### 4.3 Residuales / deuda generada

- Las reservas viven solo en memoria: `salas canceladas` lanzado como invocación aparte nunca ve lo cancelado antes. Va a «Por triar» de la deuda.
- «Los motivos no se traducen»: la 0010 salda solo el castellano; queda el inglés.

## 5. Aprendizajes

- La lista de motivos es cerrada y vive en `src/app.js`; el comportamiento queda en `capabilities/bookings.md` → capabilities/bookings.md

Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` aceptó dos tasks con el mismo commit (la 1 citaba el de la 2) y solo lo cazó la re-revisión; un `sdd ledger`/check de commits distintos por task lo cazaría
