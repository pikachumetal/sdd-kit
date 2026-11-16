---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada (cambio de planes, sala ocupada, otro); un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: …» — 9c2c622.
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» — 4929fff.
- `migrations/v3.0.0.md`: la línea pasa a «**Escribe**: `sdd-kit.json`, `operations.md`.» (en el commit de cierre, tras la revisión final).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, mergeada de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, salida completa guardada en el scratchpad de la sesión.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre (el cierre junta los commits posteriores a la Task 2; el código no cambió desde 4929fff)
- El proyecto no declara `operations.md`: sin «Suites», sin CI de la base, sin E2E.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código limpias sobre 346f39c; después solo cambió `tasks.md` (una línea), sin código ni re-revisión necesaria.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `node src/app.js cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `node src/app.js cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un mismo proceso (las reservas viven en memoria hasta la 0014): `cancelar` y luego `canceladas` → `Norte lun — sala ocupada` |

Verificado por el agente, todo lo anterior. Reportado por el usuario: nada; con `validation.mode: field` no hay guion ni espera.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver «Decisiones tomadas sin el dev-lead»): fila en «Por triar» de `debt.md`.
- La spec no tiene decisión 2 en «Decisiones que he tomado yo» (numeración 1, 3): no toco la spec aprobada; lo dejo anotado.
- Sin `estimation.md`: no hay bloque de tiempo ni fila en el estimation-log.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso: `canceladas` solo enseña lo cancelado en el mismo proceso, y el smoke del listado hay que correrlo en uno solo → ya recogido en la spec («Approach»); lo resuelve la 0014 (fila del roadmap).

Retro: sin señales

## 6. Adendas

- (ninguna)
