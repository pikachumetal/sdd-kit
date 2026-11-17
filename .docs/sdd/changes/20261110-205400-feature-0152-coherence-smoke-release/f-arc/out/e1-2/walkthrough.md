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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (955566d).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (7b744c0).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5. `node e2e/run.mjs` → 7/7, con el entorno levantado desde esta rama.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unitaria: corrió 5/5 · e2e: corrió 7/7 · 48 s · configuración: la del gate · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:52083/health` → ok, levantado en esta sesión
- E2E: 48 s de 0,5 min (pasa del presupuesto: deuda del proyecto en 4.3)
- Las dos primeras pasadas del e2e salieron rojas (3 casos con la salida antigua, «cancelada Norte lun» sin motivo) porque en el puerto 52083 había un servidor de otro árbol; el runner no lo comprueba. Con `env-up` desde la rama, verde. Una pasada intermedia se cortó tras el primer test (exit 1, sin resumen) y no pude explicarla; la siguiente, entera, pasó 7/7.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite unitaria 5/5 y e2e 7/7 sobre el commit de cierre · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 7b744c0, re-revisión del cierre limpia. Reportado por el usuario: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) y suite | ok |
| motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI) y suite | ok |
| sin `--motivo` responde lo mismo | ejecución real (CLI) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (misma sesión: cancelar y luego canceladas) y suite | ok |

### 4.3 Residuales / deuda generada

- El test `canceladas` depende del estado del primer test de `test/cancel.test.js` → fila en la deuda («Por triar»).
- Suite e2e pasa de su presupuesto: 48 s de 0,5 min — deuda del proyecto → fila en la deuda.
- El runner e2e usa el servidor que haya en el puerto aunque sea de otro árbol → fila en la deuda.

## 5. Aprendizajes

- El comportamiento nuevo (motivo al cancelar, listado de canceladas) → `capabilities/bookings.md`, por `sdd capability merge`.
- Antes de cada pasada del e2e hay que correr `env-up` desde la rama que se cierra: el runner usa el servidor que haya en el puerto → `operations.md` («Entorno de la suite»).

Retro: error que cazaría un chequeo → una línea en «Entorno de la suite» (`.docs/sdd/steering/operations.md`); el chequeo en el runner va a la deuda

## 6. Adendas

- _Ninguna_
