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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; nuevo comando `canceladas` que lista `<sala> <día> — <motivo>` (3aa5326, f875ba1).
- `test/cancel.test.js`: tests de cancelar con motivo válido, con motivo fuera de la lista y del listado.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria (Task 2) — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes; `node --test --test-concurrency=1` → 5/5 verdes.
- Gate: `node --test` → suite: corrió 5/5 · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite 5/5 · smoke 4/5 THEN con ejecución real, 1 THEN solo con ejecución real en proceso único (ver tabla) · revisión final Spec y Código limpias sobre 3aa5326 (HEAD solo añadió documentación)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar …`) | ok |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real en un solo proceso (`import('./src/app.js')`: `run('cancelar', …)` y luego `run('canceladas', [])`) + suite; **por la CLI en dos procesos, `canceladas` sale vacío** | ok solo en un proceso |

### 4.3 Residuales / deuda generada

- Por la CLI, `canceladas` no ve lo cancelado en otra invocación: el almacén de reservas es en memoria y no persiste entre procesos. No es de esta feature (ya era así), pero deja el listado sin uso real hasta que se guarde: lo cubre la fila 0014 (Motivo guardado). Apuntado en la deuda.
- Los tests comparten el almacén en memoria y el de `canceladas` depende de que el primero haya cancelado: de ahí el workaround de `--test-concurrency=1`. Apuntado en la deuda.

## 5. Aprendizajes

- El workaround de concurrencia y la falta de persistencia quedan como filas de deuda, no como decisión en `tech-stack.md`.

Retro: error que cazaría un chequeo → deuda del roadmap (tests con estado compartido: aislar el almacén por test)
