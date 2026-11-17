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

- **Cancelar con motivo** (`0e4e8dc`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`b300ca1`): comando `canceladas`, una línea `<sala> <día> — <motivo>` por reserva cancelada. `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`.
- **Capacidad** `bookings` creada con `sdd capability merge` desde el delta de la spec: `capabilities/bookings.md`.

## 3. Desviaciones del plan

- El «Gate de cierre» del plan decía `node --test`; el cierre corrió el de `operations.md` §Testing, `node --test test/ && node e2e/run.mjs`, que incluye el e2e.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` (`test/cancel.test.js`) reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: 5/5 · e2e: 7/7 · 49 s · configuración: la del gate · sobre el commit de cierre (el cierre junta el último commit, que solo toca `tasks.md`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:54046/health` → `ok`, levantado en esta sesión.
- E2E: 48,2 s de 0,5 min (presupuesto superado: deuda del proyecto, en 4.3).
- La primera pasada del gate cayó (e2e: 2 de 7 pasaron, el 3.º agotó el tiempo y el resto dio `ERR_CONNECTION_REFUSED`): `server.mjs` sale en el primer `/run` si no existe la marca `env-crash` del git-common-dir. Con el entorno levantado de nuevo y comprobado, la segunda pasada, sin tocar código, pasó 7/7. No es del cambio; deuda en 4.3.

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · gate 5/5 unit y 7/7 e2e sobre el commit de cierre · smoke 4/4 THEN con ejecución real contra el servidor de la suite · revisión final Spec y Código sobre b300ca1, limpia; el commit posterior solo toca `tasks.md`.

Todo lo de la tabla lo verifiqué yo; nada viene reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Suite e2e que pasa de su presupuesto: 48,2 s de 0,5 min — deuda del proyecto.
- `server.mjs` sale en el primer `/run` (marca `env-crash`): la primera pasada del gate cae siempre — deuda del proyecto.
- El test `canceladas enseña sala, día y motivo` depende de la cancelación de otro test — deuda (ruling de la Task 2).

## 5. Aprendizajes

- `bookings` es ya una capacidad viva: el comportamiento del motivo y de `canceladas` vive en `capabilities/bookings.md` → `capabilities/bookings.md`
- `architecture.md` apunta a la capacidad, sin copiar sus valores → `steering/architecture.md`

Retro: error que cazaría un chequeo → un chequeo que ejecute cada test suelto, pedido como fila de deuda (steering/debt.md)

## 6. Adendas

- _Ninguna._
