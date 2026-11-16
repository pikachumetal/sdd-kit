---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, commit `bf4b6ba`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, commit `1401880`): el comando `canceladas` lista «<sala> <día> — <motivo>» de las reservas con estado cancelada.
- **Capacidad nueva** `bookings` (`.docs/sdd/capabilities/bookings.md`), creada con `sdd capability merge` desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado como deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus, high) limpia · Código (sonnet, high) limpia · Arquitectura no (plan), sobre `1401880`. El único commit posterior solo toca `tasks.md`: no hace falta re-revisión.
- La suite del proyecto corre una sola vez tras el merge de sincronización con `develop` (hay otra rama abierta, `feature/0011-others`); su resultado va en el mensaje final, porque este fichero entra en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · smoke 4/4 THEN con ejecución real, ejecutado por el agente · revisión final Spec y Código limpia sobre `1401880` · suite pendiente del merge de sincronización

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) | ok |
| un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI) | ok |
| sin `--motivo` responde lo mismo | ejecución real (CLI) | ok |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar en el mismo proceso | ejecución real (`node -e` en un solo proceso, porque las reservas viven en memoria hasta la 0014) | ok |

Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: `canceladas` usa la cancelación del primer test (ruling de la Task 2). Fila en «Por triar» de `debt.md`.
- `canceladas` solo enseña lo cancelado en el mismo proceso hasta que la 0014 guarde el motivo en el almacén de reservas (ya está en el roadmap).

## 5. Aprendizajes

- Ninguno nuevo para `constitution.md`, `architecture.md` ni `operations.md`; el comportamiento observable vive en `capabilities/bookings.md`.

Retro: documento o skill desmentido → ticket del kit: la descripción de `sdd-archive` sitúa la carpeta del cambio en `.docs/sdd/changes/`, pero el proyecto la tiene en `.docs/sdd/specs/`

## 6. Adendas

- _Ninguna_
