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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (48c4234).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (0992e55).
- Capacidad nueva `capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 7/7 verdes, en la rama, sobre el commit de cierre.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 6/6 · rooms:test: corrió 1/1 · sobre el commit de cierre.
- Un primer pase de `test/store.test.js` salió rojo con `EBUSY: resource busy or locked, open 'data/bookings.json'`. Contraste: el fichero solo, en la rama y a la vez en un worktree desligado de `develop`, salió verde en los dos; la suite entera, verde después. No se repite, y el error es de un fichero bloqueado: fila en «Por triar» de la deuda.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 7/7 · gate 2/2 tareas · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 0992e55; el commit posterior, que solo toca `tasks.md`, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real (`cancelar Norte lun`) | verificado por el agente |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real (en una sola ejecución tras cancelar) + suite | verificado por el agente |

Nada reportado por el usuario.

### 4.3 Residuales / deuda generada

- `test/store.test.js` falla la primera vez con `EBUSY` y pasa después: fila en «Por triar».
- El test de `canceladas` depende del primer test: fila en «Por triar».
- Nota: `node src/app.js canceladas` en un proceso aparte no ve lo cancelado en otro, porque las reservas viven en memoria; es el estado actual del almacén, fuera del alcance de la spec.

## 5. Aprendizajes

- La lista de motivos es un valor de comportamiento → `capabilities/bookings.md`, no se copia a otro documento.
- Sin aprendizajes estructurales ni de convención: `architecture.md` y `constitution.md` siguen como estaban.

Retro: sin señales
