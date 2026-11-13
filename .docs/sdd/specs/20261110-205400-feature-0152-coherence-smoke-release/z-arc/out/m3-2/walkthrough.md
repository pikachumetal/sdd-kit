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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, `c62bd67`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, `95eb4b4`): `canceladas` lista las reservas con estado cancelada como «<sala> <día> — <motivo>».
- `migrations/v3.0.0.md`: la línea queda como «**Escribe**: `sdd-kit.json`, `operations.md`.», como pedía el scope.
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Comprobado en el cierre: con `--test-name-pattern="canceladas"` solo, el test falla; la suite entera, en su orden, pasa.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5 tests, 5 pasan, 0 fallan, sobre el commit de cierre (la salida entera en el scratchpad de la sesión).
- Gate: el proyecto no declara `operations.md` ni «Suites» ni gate; la suite de arriba es lo único que hay y corrió entera. La rama no toca ningún fichero de «Sin filtro».

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke de 4 THEN: 3 con ejecución real por la CLI, 1 con ejecución real solo dentro de un proceso (la CLI no lo muestra, ver abajo) · revisión final Spec y Código limpias; el último commit antes del cierre solo cambia una línea de `tasks.md`, sin re-revisión · lo que dice la tabla como `no probado` no se probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `… --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `node src/app.js cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | suite; ejecución real solo en un proceso | por la CLI, `node src/app.js canceladas` en un proceso aparte imprime una línea vacía: las reservas viven en memoria y no sobreviven entre invocaciones. En un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) sí responde `Norte lun — sala ocupada`. **Fallo: este THEN no se cumple de punta a punta por la CLI.** |

### 4.3 Residuales / deuda generada

- `canceladas` está vacío en la CLI real porque las reservas no se guardan entre invocaciones. La persistencia es el trabajo de la 0014 («Motivo guardado»), que sigue abierta en Now. Fila en «Por triar» de `debt.md`.
- El test de `canceladas` depende del orden (ver Decisiones tomadas sin el dev-lead). Misma fila.

## 5. Aprendizajes

- La lista cerrada de motivos vive en `capabilities/bookings.md` y en `src/app.js`; no se copia a otro documento → `capabilities/bookings.md`.
- Un THEN de una CLI con estado en memoria no se puede probar con dos invocaciones: la suite en un proceso lo da por bueno y la CLI real no → deuda, no un documento vivo.

Retro: sin señales
