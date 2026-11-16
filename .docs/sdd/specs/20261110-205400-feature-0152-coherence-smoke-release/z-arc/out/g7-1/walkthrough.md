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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; sin motivo o fuera de la lista responde «motivo no válido: …». Comando nuevo `canceladas`, que lista «sala día — motivo» (Task 1, cfd2f7a; Task 2, 83c2b61).
- `test/cancel.test.js`: pruebas de cancelar con motivo válido, con motivo fuera de la lista y del listado.
- `package.json`: script `cancelar` (atajo a `node src/app.js cancelar`), añadido tras la revisión final.
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- Ninguna de alcance. El script `cancelar` de `package.json` no estaba en el plan; la re-revisión lo ve sin riesgo (no añade comportamiento ni dependencias).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` (suite unitaria): 2/2, verde, sobre el commit de cierre.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5 tests, 0 fallos · rooms:test: corrió 1 test, 0 fallos · 2 tareas completadas, 0 saltadas (sin filtro: cambia el build) · configuración: la del gate (`gate.json`), sin `--affected` porque la rama toca `package.json` · sobre el commit de cierre
- Revisión final: Spec y Código limpias sobre 83c2b61; re-revisión del resto de la rama (`package.json` y `tasks.md`) con `sdd-kit:effort-high` + opus: sin Critical ni Important y un Minor, pasado a deuda.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite unitaria 2/2 · gate 6/6 tests · smoke 5/5 THEN con ejecución real (CLI y script npm) · revisión final Spec y Código sobre 83c2b61, re-revisión del resto limpia · no probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` (la suite no lo cubre) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y listar en el mismo proceso → `Norte lun — sala ocupada`; el listado no persiste entre procesos (los datos viven en memoria) |
| Atajo `npm run cancelar -- Norte lun --motivo "sala ocupada"` | ejecución real | `cancelada Norte lun (sala ocupada)` |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → deuda «Por triar».
- `npm run cancelar` exige `--` antes de los argumentos y no está documentado → deuda «Por triar».

## 5. Aprendizajes

- Los tests que dependen del orden de ejecución se anotan como deuda en cuanto se aceptan → `.docs/sdd/steering/debt.md`.
- El comportamiento nuevo (motivo y listado) vive en la capacidad → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
