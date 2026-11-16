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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `836106b`): el motivo es de una lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde `motivo no válido: cambio de planes, sala ocupada, otro`. La reserva cancelada guarda su motivo.
- Comando `canceladas` (`src/app.js`, `b8d497e`): lista `<sala> <día> — <motivo>` de las reservas canceladas.
- Tests en `test/cancel.test.js`.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node scripts/gate.mjs run bookings:test rooms:test` → exit 0.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 6/6 · rooms:test: corrió 1/1 · configuración: la del gate · sobre el commit de cierre.
- Una pasada previa del conjunto dio rojo en `test/store.test.js` (`EBUSY: resource busy or locked, open 'data/bookings.json'`). El fichero solo, en la rama y en un worktree desacoplado de `develop`, pasa 1/1 en las dos: no se repite; deuda en «Por triar».

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 7/7 verde (bookings 6, rooms 1) · smoke 5/5 THEN con ejecución real · revisión final Spec y Código limpias sobre b8d497e; HEAD solo añadió `tasks.md`, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso, `run` importado) | `Norte lun — sala ocupada` |

Reportado por el usuario: nada. No probado: `canceladas` en un proceso distinto del que cancela (las reservas viven en memoria hasta la 0014, como dice la spec).

### 4.3 Residuales / deuda generada

- `test/store.test.js` falla la primera vez (`EBUSY`) y pasa después: fila en «Por triar».
- Test de `canceladas` dependiente del orden: fila en «Por triar».

## 5. Aprendizajes

- Los valores de comportamiento (la lista de motivos, los mensajes) viven en `capabilities/bookings.md` → `capabilities/bookings.md`.

Retro: sin señales
