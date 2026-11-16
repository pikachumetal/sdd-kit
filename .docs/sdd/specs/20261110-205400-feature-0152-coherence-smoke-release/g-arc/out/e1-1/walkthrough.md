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

- **Cancelar con motivo** (`6f6616c`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo`, o con uno fuera de la lista, responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`2a6bc43`): el comando `canceladas` lista «<sala> <día> — <motivo>». Ficheros: `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`.
- **Capacidad**: nueva `capabilities/bookings.md`, creada con `sdd capability merge` desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Va a deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5; la suite unitaria y el E2E del gate pasaron sobre el mismo árbol.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 49 s · configuración: la del gate · sobre el commit de cierre (el cierre solo añade documentación a `6e1131b`, sin tocar código).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:54766/health` → `ok`, levantado en esta sesión (pid 91280) y parado al acabar con `env-down.mjs`.
- E2E: 49 s de 0,5 min — pasa del presupuesto; deuda en 4.3.

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · suite unit 5/5 y E2E 7/7 sobre el gate de cierre · smoke 4/4 THEN (3 con ejecución real por CLI, el listado con ejecución real por E2E) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 2a6bc43; `HEAD` solo añadió documentación (`tasks.md`) desde esa revisión, sin re-revisión. Arquitectura no se revisó (el plan no la pedía). Nadie del equipo ha probado el cambio a mano: todo lo anterior es verificado por el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + E2E | ok |
| Motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con la entrada que falla + E2E | ok |
| Sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en E2E con el motivo «otro» («Norte lun — otro»); con «sala ocupada», `suite` | ok |

Una ejecución suelta de la CLI no ve el listado de otra: el estado vive en memoria de cada proceso, por eso el listado se comprobó por el servidor del E2E.

### 4.3 Residuales / deuda generada

- Suite E2E que pasa de su presupuesto: 49 s de 0,5 min — deuda del proyecto (ya iba cerca antes de la rama; nadie lo medía).
- El test de `canceladas` depende del primer test (ruling de la Task 2) — deuda.
- La spec numera sus decisiones 1 y 3 (falta la 2): solo cosmético, sin tocar la spec aprobada.

## 5. Aprendizajes

- Cada test debe preparar sus datos; el de `canceladas` no lo hace → deuda en `steering/debt.md` (`operations.md` §Datos ya lo exige).
- Comportamiento nuevo de cancelar y del listado → `capabilities/bookings.md` (merge del delta de la spec).

Retro: sin señales

## 6. Adendas

- _Ninguna_
