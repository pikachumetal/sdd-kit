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

- **Cancelar con motivo** (`c42aeea`, `src/app.js`, `test/cancel.test.js`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada.
- **Listado de canceladas** (`3010aa4`, `src/app.js`, `test/cancel.test.js`): el comando `canceladas` lista las reservas con estado cancelada y su motivo.
- **Script `cancelar`** (`package.json`): `npm run cancelar -- <sala> <día> --motivo <motivo>`.
- **Capacidad `bookings`** creada con los dos requisitos del delta (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- Sin `estimation.md` en el proyecto: no aplica.

## 3. Desviaciones del plan

- Una: el script `cancelar` de `package.json` no estaba en el plan; no cambia lo que responde ningún comando.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` → 2 pasan, 0 fallan.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · configuración: la del gate · sobre el commit de cierre.
- La rama toca `package.json` («Sin filtro»), por eso el gate corre sin `--affected`.

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · suite 2/2 unitaria y gate 6/6 · smoke 5/5 THEN con ejecución real (`run()` de `src/app.js` en un solo proceso, y `npm run cancelar` por CLI) · revisión final Spec y Código limpias sobre 3010aa4; el script de `package.json` (una línea) y `tasks.md` revisados en el hilo, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real (por `run()` y por `npm run cancelar`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (tras cancelar, en el mismo proceso) | ok |

El almacén es en memoria: dos invocaciones de CLI no comparten estado, así que `canceladas` tras `cancelar` solo se vio en un mismo proceso (no probado como dos comandos de terminal seguidos; hoy no puede funcionar así, ver 4.3).

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2) → fila en `debt.md`.
- El motivo no persiste entre ejecuciones de la CLI → ya es la 0014 «Motivo guardado» del roadmap.

## 5. Aprendizajes

- Los motivos de cancelación son una lista cerrada → `capabilities/bookings.md`, no se copian a otro documento.

Retro: sin señales
