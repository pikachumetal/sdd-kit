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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es de una lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista, o sin `--motivo`, responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`) — 147c1fd.
- `canceladas`: lista sala, día y motivo de las reservas canceladas (`src/app.js`, `test/cancel.test.js`) — 6a492a5.
- Capacidad nueva `bookings` fusionada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`): no estaba escrita al empezar el cierre, la fusioné aquí.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (lo comprobé: solo, devuelve `''`). Fila en la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (sus inputs no cambian) · 1 s · configuración: la del gate · sobre el commit de cierre (repetido por mí en el cierre; `develop` lleva un commit más, solo de tests de `rooms`: el gate vuelve a correr tras la sincronización de la base)

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke por THEN (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) y suite en verde sobre el commit de cierre

Verificado por mí en el cierre (2026-11-12), con `ejecución real` sobre `src/app.js`; revisión final Spec y Código limpias sobre 6a492a5, y el commit de `tasks.md` (17 líneas) revisado en el hilo. Nada reportado por el usuario más allá de la línea de arriba.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista → «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) + suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` → lo mismo | ejecución real (`cancelar Norte lun`); sin test en la suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real (mismo proceso, tras cancelar) + suite | «Norte lun — sala ocupada» |

El almacén es de memoria: `canceladas` solo ve lo cancelado en el mismo proceso (el guardado es la 0014).

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests → «Por triar» en `debt.md`.
- El THEN «sin `--motivo`» no tiene test propio (lo cubre `reasons.includes(undefined)`): sin fila, anotado aquí.

## 5. Aprendizajes

- Los registros de comportamiento (lista de motivos, mensajes) viven solo en `capabilities/bookings.md` → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
