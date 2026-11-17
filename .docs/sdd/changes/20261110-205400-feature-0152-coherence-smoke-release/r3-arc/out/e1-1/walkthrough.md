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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; sin motivo o fuera de la lista responde «motivo no válido: …». Commit e02682b (Task 1).
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo» de las reservas canceladas. Commit 3384a82 (Task 2).
- `test/cancel.test.js` y `e2e/cancel.e2e.mjs`: cubren el motivo válido, el motivo fuera de la lista y el listado.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Una decisión de ejecución, abajo.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate durante la Task 2 — para esquivar la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. (Del `## Rulings` de `tasks.md`; `sdd ledger rulings` no devuelve rulings porque el espacio de ejecución ya no existe.)

## 4. Verificación

### 4.1 Builds

- Ejecutado por el agente el 2026-11-11: `node --test test/` → 5/5; `node scripts/env-up.mjs` → `/health` ok; `node e2e/run.mjs` → 7/7; `node scripts/env-down.mjs` → entorno parado.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unitaria: corrió 5/5 · e2e: corrió 7/7 · 48,1 s de e2e · configuración: la del gate de `operations.md`, sin `--test-concurrency=1`, y pasó igual · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:57249/health` → ok, levantado en esta sesión
- E2E: 48,1 s de 0,5 min de Presupuesto E2E: lo pasa (ver 4.3)

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · suite unitaria 5/5 · e2e 7/7 · smoke de 4 THEN, 3 con ejecución real por la CLI y 1 por el servidor del e2e · revisión final Spec y Código limpias sobre 3384a82; el commit posterior que solo registra la revisión en `tasks.md` (17 líneas) revisado en el hilo. Nadie ha dicho qué probó: es verificación del agente, no del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con `--motivo "me aburro"`, suite y e2e | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real; ningún test lo cubre | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | suite (el literal exacto) y ejecución real por el servidor del e2e, con el motivo `otro`: «Norte lun — otro». La CLI suelta no sirve: el almacén vive en memoria y cada invocación empieza vacía | verificado por el agente; el literal con «sala ocupada» solo por la suite |

### 4.3 Residuales / deuda generada

- El e2e dura 48,1 s y el presupuesto es 0,5 min: deuda del proyecto, en «Por triar» de `debt.md`. La causa visible es la traza completa (6 s por paso frente a 2,4 s con `E2E_TRACE=light`).
- La carrera de los tests sobre el almacén en memoria compartido (el ruling de arriba): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento nuevo (motivo al cancelar, listado de canceladas) → `.docs/sdd/capabilities/bookings.md`, por `sdd capability merge`.
- Una suite que solo pasa con `--test-concurrency=1` esconde un almacén compartido entre tests → deuda en `debt.md` («Por triar»); no es una convención ni un cambio estructural, así que `constitution.md` y `architecture.md` no cambian.

Retro: documento o skill desmentido → `tasks.md` daba 3384a82 como commit de la Task 1 y `git log` dice e02682b; corregido en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
