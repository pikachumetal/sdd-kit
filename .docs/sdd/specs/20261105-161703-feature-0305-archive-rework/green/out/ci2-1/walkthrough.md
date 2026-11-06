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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`e54616b`).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (`12b3512`).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva con los dos requisitos del delta.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Entra en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde (salida guardada en el scratchpad), sobre el commit de cierre.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · sobre el commit de cierre
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre `12b3512`. Commit posterior (solo `tasks.md`, 17 líneas): revisado en el hilo (`revisado en el hilo`), sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke con ejecución real de 4 de 5 THEN por la CLI y del listado en un mismo proceso (el almacén es en memoria: `canceladas` en una invocación aparte sale vacío; lo guarda la 0014) · revisión final Spec y Código limpia sobre `12b3512`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| motivo fuera de la lista (`--motivo "me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real | verificado por el agente |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (`run()` en un proceso) y suite | verificado por el agente |

### 4.3 Residuales / deuda generada

- El gate en serie es un workaround: fila en la deuda técnica del roadmap («Aislar el almacén de reservas por test»).
- El motivo no sobrevive al proceso: es la 0014 (Motivo guardado), ya en el roadmap.

## 5. Aprendizajes

- El almacén de reservas en memoria compartido entre tests obliga a serializarlos → deuda técnica del roadmap (sin destino en documentos vivos: no es convención ni estructura).
- Cancelar con motivo cambia el comportamiento observable de `bookings` → `capabilities/bookings.md` (fusionado con `sdd capability merge`).

Retro: sin señales

## 6. Adendas

- (ninguna)
