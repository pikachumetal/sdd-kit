---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`3280bdf`): `cancelar <sala> <día> --motivo <motivo>` acepta solo cambio de planes, sala ocupada u otro; un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`432f257`): el comando `canceladas` lista cada reserva cancelada con su motivo («Norte lun — sala ocupada»). Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Capacidad** `bookings`: creada con `sdd capability merge` a partir del delta de la spec (dos requisitos ADDED).

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Spec y plan tal como se aprobaron; la revisión final (Spec y Código, limpias) no cambió nada.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre bfcb21e
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 1/2 · rooms:test: saltada (la rama no toca sus inputs: `src/rooms.js`, `test/rooms.test.js`) · 1 s · configuración: la del gate · sobre bfcb21e *(el cruce de tareas sale del diff de la rama contra `develop` y los `inputs` de `gate.json`; el cierre no volvió a correr la suite)*

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre bfcb21e

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del estado que deja el primer test (ruling de la Task 2) → deuda «Por triar» en `debt.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (límite de la spec, ya en el roadmap como 0014).

## 5. Aprendizajes

- Nuevo comportamiento observable (motivo al cancelar y listado de canceladas) → `capabilities/bookings.md` (creada en este cierre con `sdd capability merge`).
- Sin aprendizajes de estructura ni de convención: `architecture.md` y `constitution.md` no cambian.

Retro: sin señales

## 6. Adendas

- _Ninguna_
