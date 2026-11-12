---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`8c9267f`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) en `src/app.js`; sin `--motivo` o con uno fuera de la lista responde `motivo no válido: …`. Tests en `test/cancel.test.js`.
- **Listado de canceladas** (`9c8e33d`): comando `canceladas` con `<sala> <día> — <motivo>` por reserva cancelada, en `src/app.js`; flujo core en `e2e/cancel.e2e.mjs` y `test/cancel.test.js`.
- **Capacidad** `bookings` creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge` (dos requisitos ADDED).

## 3. Desviaciones del plan

- _Ninguna_ en el código. El plan fija el gate de cierre en `node --test`; el ruling de la Task 2 lo cambió a `node --test --test-concurrency=1` y el cierre no lo usó (ver abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1`, para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. La re-revisión lo marcó: `node --test` ya corre cada fichero en su propio proceso, y el cierre pasó la suite sin la bandera (5/5), así que la causa no está demostrada. Va a la deuda (Por triar), no a `operations.md`.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 en verde (sin `--test-concurrency=1`). `node e2e/run.mjs` → 7/7 en verde, 48,2 s.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48,2 s e2e · configuración: la del gate de cierre de `operations.md` · sobre el commit de cierre (el cierre solo suma `.docs/` y `ROADMAP.md` al último commit de código `9c8e33d`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:62814/health` → `ok`, levantado en esta sesión.
- E2E: 48,2 s de 0,5 min de Presupuesto E2E (30 s): lo pasa → deuda del proyecto en 4.3.
- Primer intento del e2e en rojo, 7 de 7 con `ERR_CONNECTION_REFUSED`: no levanté el entorno antes; con `/health` ya en ok, el primer `/run` tiró el servidor (`server.mjs` escribe la marca `env-crash` y sale) y el segundo intento falló igual. Contraste de «Un rojo»: `e2e/cancel.e2e.mjs` solo, en la rama (5/5) y en un worktree desacoplado de `develop` en `4bb3f4b` (3/3), verde en los dos: no se repite, y el error es una conexión rechazada, que lo explica. Fila de deuda abierta; luego el gate completo en verde.

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · suite unit 5/5 y e2e 7/7 sobre `9c8e33d` + cierre · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre `9c8e33d`, limpia; re-revisión del commit de registro de `tasks.md` (juntado en el cierre) con un Important (commit de la Task 1 mal en `tasks.md`) arreglado y un Minor a la deuda. Nadie ha validado a mano: es verificado por el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | verificado por el agente |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) y suite | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | verificado por el agente; sin test propio en `test/cancel.test.js` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (una cancelación y el listado en el mismo proceso) y e2e | verificado por el agente |

Nota: la CLI guarda el estado en memoria por proceso, así que el listado se vio en el mismo proceso que la cancelación; en el servidor lo cubre el e2e.

### 4.3 Residuales / deuda generada

- Sin test de «sin `--motivo`» (THEN del spec cubierto solo con ejecución real): no es deuda abierta, pero conviene un test en la siguiente feature que toque `cancelar`.
- Ruling `--test-concurrency=1` sin causa diagnosticada → «Por triar» de `debt.md`.
- Servidor e2e que cae en el primer `/run` → «Lista» de `debt.md`, con su remedio temporal en `operations.md`, «Entorno de la suite».
- E2E sobre su presupuesto: 48,2 s contra 0,5 min — deuda del proyecto.

## 5. Aprendizajes

- Con `/health` en ok el servidor puede caer en el primer `/run`; el chequeo de `Entorno de la suite` no lo caza → `operations.md` (la línea del chequeo) y deuda.
- El ruling de la ejecución que cambia un gate se contrasta con una pasada sin él antes del cierre → deuda «Por triar», sin copia en `operations.md`.

Retro: error que cazaría un chequeo → una línea en `operations.md` y fila de deuda (`.docs/sdd/steering/operations.md`)

## 6. Adendas

- _Ninguna_
