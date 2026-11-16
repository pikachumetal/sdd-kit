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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (d7b9f7a).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (55f1c8b).
- Capacidad `bookings` creada con los dos requisitos del delta (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde, 0 fallos, ~150 ms, sobre el commit de cierre (el cierre solo añade `.docs/`).
- Gate: `node --test` → sin tareas de gate declaradas (no hay `operations.md`); suite entera.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 55f1c8b (HEAD solo movió `tasks.md`).
- Nada validado por el usuario: todo lo de la tabla lo ejecutó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, `--motivo "me aburro"`) + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (CLI) | ok (sin test en la suite) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real, en un solo proceso (`run('cancelar')` y luego `run('canceladas')`) + suite | ok |

Límite visto: el almacén es en memoria, así que `canceladas` en una invocación nueva de la CLI responde vacío. Es el alcance de la 0014 («Motivo guardado»), no un fallo de esta feature.

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al estado del primer test → fila en «Por triar» de `debt.md`.
- El caso «sin `--motivo`» no tiene test propio → misma fila de deuda.

## 5. Aprendizajes

- Sin convención, estructura ni versión nuevas; el comportamiento observable vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
