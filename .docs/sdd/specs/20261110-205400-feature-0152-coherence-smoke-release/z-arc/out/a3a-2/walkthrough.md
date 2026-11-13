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

- **Cancelar con motivo** (Task 1, `aab7e3c`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`; la lista de motivos es cerrada (cambio de planes, sala ocupada, otro). Un motivo fuera de la lista, o la ausencia de `--motivo`, responde «motivo no válido: …». Tests en `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `6f18d63`): comando `canceladas` en `src/app.js`, una línea «sala día — motivo» por reserva cancelada.
- **Capacidad** `bookings` creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge` desde el delta de la spec (dos requisitos ADDED).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2, de `## Rulings` de `tasks.md`; el ledger no trae rulings).

## 4. Verificación

### 4.1 Builds

- `node --test`: 7/7 en verde, ejecutado por el agente en el cierre.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 6 pruebas, 0 fallos · rooms:test: saltada (la rama no toca sus inputs) · configuración: la del gate · sobre `6f18d63` (el código es el mismo que el del cierre: solo cambian `.docs/` y la capacidad).
- Un primer `node --test` salió rojo en `test/store.test.js` con `EBUSY: resource busy or locked, open 'data/bookings.json'`. Contraste a mano: el fichero solo pasa en verde en la rama y, a la vez, en un worktree detached de `develop` con dependencias instaladas (`npm ci`). Es «No se repite»; el error es de recurso de la máquina. Va a deuda en «Por triar» (4.3). La suite entera, repetida después, dio 7/7.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 7/7 · gate `bookings:test` 6/6 y `rooms:test` saltada · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `6f18d63`; Arquitectura no (plan); `HEAD` solo añadió `tasks.md`, sin código que re-revisar · no probado: `canceladas` en una invocación aparte de `cancelar` (el estado vive en memoria del proceso, ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y listar en el mismo proceso → `Norte lun — sala ocupada` |

Verificado por el agente: todo lo anterior. Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- `canceladas` solo ve lo cancelado en el mismo proceso, porque las reservas viven en memoria: la pieza que lo guarda es la 0014 «Motivo guardado», ya en el roadmap.
- Deuda en «Por triar»: `test/store.test.js` falla en el primer arranque (`EBUSY`, no se repite) y el test de `canceladas` depende del orden de los tests.

## 5. Aprendizajes

- Ninguno que cambie una convención, la estructura o las versiones. Lo observable (motivo y listado) vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_.
