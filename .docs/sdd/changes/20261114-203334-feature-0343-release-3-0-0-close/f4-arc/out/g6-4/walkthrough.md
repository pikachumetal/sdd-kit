---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (ddff0da).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas del proceso: `src/app.js`, `test/cancel.test.js` (1ec44f3).
- Capacidad nueva `bookings` con sus dos requisitos, fusionada desde el delta de la spec.
- Sin ADR candidatas en la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en `debt.md`, «Por triar»).

## 4. Verificación

### 4.1 Builds

- Gate de cierre de la constitución (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`): corre una sola vez en el sync merge del paso 6, porque `develop` va por delante y hay otra rama abierta (`feature/0011-others`); su línea `Gate:` y su sha van en el mensaje final, porque este fichero está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · smoke 4/4 THEN con ejecución real sobre el commit de cierre (mismo código que 1ec44f3) · suite en el sync merge (ver 4.1) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 1ec44f3; `HEAD` solo añadió `tasks.md` (documentación), sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde la cancelación | ejecución real (`node src/app.js` y `run`) | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista | ejecución real: `cancelar Sur mar --motivo "me aburro"` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` | ejecución real: `cancelar Norte lun` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` enseña el motivo | ejecución real, en el mismo proceso que la cancelación (las reservas viven en memoria hasta la 0014) | `Norte lun — sala ocupada` |

Reportado por el usuario: nada; el dev-lead no ha probado a mano.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver la decisión de §3): fila en la deuda.
- Entre procesos `canceladas` sale vacío hasta la 0014 (límite ya declarado en la spec).

## 5. Aprendizajes

- Nada nuevo para constitution, architecture ni operations: el comportamiento vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- Ninguna.
