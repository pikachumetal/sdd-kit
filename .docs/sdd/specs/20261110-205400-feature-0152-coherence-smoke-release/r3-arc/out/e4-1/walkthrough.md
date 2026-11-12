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

- `cancelar <sala> <día> --motivo <motivo>`: motivo de una lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: …» — `src/app.js`, `test/cancel.test.js` (91d882c).
- `canceladas`: lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs` (720e07c).
- Capacidad nueva `bookings` creada con `sdd capability merge` desde la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. El gate de cierre es el del plan, `node --test`, más la E2E de `operations.md`.

### Decisiones tomadas sin el dev-lead

- _Ninguna_ vigente. `tasks.md` traía un ruling (`--test-concurrency=1` en el gate, por una carrera entre tests sobre el almacén en memoria); la re-revisión lo señaló como Important y el cierre lo retiró: `node --test` ya corre cada fichero en su proceso, así que la carrera no existe, y esa bandera no estaba en ningún gate.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 verde (unit).
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48,1 s · configuración: la del gate (`E2E_TRACE` por defecto, traza completa) · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:54423/health` → ok, levantado en esta sesión.
- E2E: 48,1 s de 0,5 min (pasa del presupuesto, ver 4.3).
- La primera pasada de la E2E salió roja, 0/7, con `ERR_CONNECTION_REFUSED`: el servidor de la suite cae en la primera petición de un clon (`server.mjs`, commit 16bdfca). Contraste: la E2E entera pasa 7/7 en la rama y 5/5 en `develop` (16bdfca), sin limpiar estado. No se repite; ver 4.3.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite unit 5/5 · E2E 7/7 (tras la pasada roja contrastada) · smoke 4 de 4 THEN con ejecución real · revisión final Spec y Código limpias sobre 720e07c · re-revisión sobre el commit de docs posterior: 1 Important y 1 Minor, ambos sobre `tasks.md`, corregidos en el cierre, sin tocar código.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con `--motivo "porque sí"` | ok |
| sin `--motivo` → la misma respuesta | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar')` y `run('canceladas')`) y `e2e/cancel.e2e.mjs`; el almacén es en memoria, así que `canceladas` suelto desde la terminal sale vacío | ok |

- Revisión: 2 de 2 hallazgos de la re-revisión resueltos (ruling falso retirado; Task 1 citaba 720e07c en vez de 91d882c).

### 4.3 Residuales / deuda generada

- Suite E2E que pasa de su presupuesto: 48,1 s de 0,5 min — deuda del proyecto. `README.md` apunta `E2E_TRACE=light` como atajo local de Laura; no se aplicó al gate.
- E2E roja la primera vez en un clon: fila en «Por triar» de `debt.md`.
- Sin test para «sin `--motivo`» en `test/cancel.test.js` (lo cubre el código y el smoke): observación de la re-revisión, sin fila.

## 5. Aprendizajes

- `node --test` aísla cada fichero de test en su proceso: no hace falta `--test-concurrency=1` para el almacén en memoria → ninguno, no hay destino que lo necesite (el ruling erróneo se retiró de `tasks.md`).
- El entorno de la suite cae la primera vez en un clon → `operations.md` §Testing, «Entorno de la suite».

Retro: error que cazaría un chequeo → línea en `operations.md` §Testing sobre la caída del servidor en la primera petición, con su fila de deuda (`.docs/sdd/steering/operations.md`, `.docs/sdd/steering/debt.md`)

## 6. Adendas

- (ninguna)
