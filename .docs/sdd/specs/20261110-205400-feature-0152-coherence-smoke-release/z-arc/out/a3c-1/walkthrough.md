---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» (a04a77a).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: «<sala> <día> — <motivo>» por reserva cancelada (c9c11e1).
- `.docs/sdd/capabilities/bookings.md` — fusionados con `sdd capability merge` los dos requisitos del delta.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 en verde, 122 ms, sobre c9c11e1 (los commits posteriores solo tocan `.docs/`); salida guardada en el scratchpad de la sesión.
- Gate: no declarado (el proyecto no tiene `operations.md`); la suite entera corrió sin filtro.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/5 THEN con ejecución real por la CLI, 1 THEN solo con `suite` y con ejecución real en un mismo proceso (ver tabla) · revisión final Spec y Código limpias sobre c9c11e1 (los commits posteriores son solo documentación, sin re-revisión).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista → «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` → lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | suite; ejecución real solo en un mismo proceso | por la CLI en una llamada aparte sale vacío (las reservas viven en memoria, un proceso por comando); importando `run` y llamando a `cancelar` y `canceladas` en el mismo proceso: `Norte lun — sala ocupada` |

- Verificado por el agente: todo lo anterior. Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- `canceladas` no se puede ver por la CLI porque no hay persistencia entre comandos: lo cubre la fila 0014 «Motivo guardado» del roadmap; el comportamiento queda registrado en `bookings` con «Dónde viven los datos: en memoria».
- El test de `canceladas` depende del primero (ruling de la Task 2): fila en «Por triar» de `debt.md`.
- «Decisiones que he tomado yo» de la spec numera 1 y 3, sin 2: la numeración no se ha tocado, el cuerpo de la spec está aprobado.

## 5. Aprendizajes

- Comportamiento observable (motivo obligatorio y listado) → `capabilities/bookings.md`, por el delta de la spec.

Retro: sin señales

## 6. Adendas

- _Ninguna_
