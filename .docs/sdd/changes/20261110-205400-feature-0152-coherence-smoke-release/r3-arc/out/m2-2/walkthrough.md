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

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; `src/app.js`, `test/cancel.test.js` (edb782e).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas; `src/app.js`, `test/cancel.test.js` (fe00b4e).
- Capacidad `bookings` creada con los dos requisitos, fusionada con `sdd capability merge`.
- `architecture.md`: una línea cambiada en el commit bbfc03e (ver 4.3).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (fila en «Por triar» de `debt.md`)
- Commits bbfc03e y 024000d (solo documentación, menos de 20 líneas): revisados en el hilo, sin re-revisión.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde, sobre bbfc03e (Node v26.10.0). Sin `operations.md`: no hay «Suites» ni `Gate:` declarados.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke con ejecución real de los 3 THEN y de los dos bordes del primero · revisión final Spec y Código limpias sobre fe00b4e; los dos commits posteriores, solo documentación, revisados en el hilo. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`) | ok |
| motivo fuera de la lista («me aburro») → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo`, y `--motivo` sin valor → el mismo mensaje | ejecución real | ok (sin test propio en la suite) |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real, solo en el mismo proceso (`run` importado) | ok; por CLI, en dos invocaciones, sale vacío |

### 4.3 Residuales / deuda generada

- El almacén vive en memoria: `canceladas` en una invocación aparte de la CLI no ve lo cancelado antes. La persistencia es la 0014, ya en el roadmap.
- «sin `--motivo`» está en el delta pero no tiene test en `test/cancel.test.js`; solo lo cubre el smoke.
- bbfc03e cambia en `architecture.md` «Node 22» por «Node 20»: nada en el repo lo respalda (sin `engines`, y aquí corre Node 26.10.0) ni tiene que ver con la 0010. Sin verificar: lo decide el dev-lead.
- Workaround `--test-concurrency=1`: fila en la deuda.

## 5. Aprendizajes

- Cambio de comportamiento observable → `capabilities/bookings.md` (fusionado desde el delta de la spec).

Retro: sin señales

## 6. Adendas

- _Ninguna_
