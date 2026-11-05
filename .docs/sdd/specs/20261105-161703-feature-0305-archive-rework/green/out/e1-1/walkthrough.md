---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `11ea873`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`cambio de planes`, `sala ocupada`, `otro`) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde `motivo no válido: cambio de planes, sala ocupada, otro`. Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `745393d`): comando `canceladas`, una línea `<sala> <día> — <motivo>` por reserva cancelada. Ficheros: `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`.
- **Capacidad**: nace `capabilities/bookings.md` con los dos requisitos de la spec, fusionada con `sdd capability merge`. La carpeta `capabilities/` no existía: la creó la fusión.

## 3. Desviaciones del plan

- Ninguna en el código: las dos tasks salieron como en el plan.
- Corregido en el cierre: `tasks.md` daba `745393d` como commit de la Task 1; es `11ea873` (`745393d` es la Task 2).

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar una carrera sobre el almacén en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No llegó a aplicarse**: `package.json`, `operations.md` y el plan siguen con `node --test test/`.
- Cierre: dejo el gate como lo declara `operations.md` (sin el flag) porque pasa 5/5 sin él; la causa real es una dependencia de orden dentro de `test/cancel.test.js` (`canceladas` solo pasa tras `cancelar con un motivo de la lista`; suelto da `''` en vez de `Norte lun — sala ocupada`, comprobado). Va a la deuda — coste si es erróneo: ese test falla al ejecutarlo suelto.

## 4. Verificación

### 4.1 Builds

- Verificado por mí, sobre el mismo código que el commit de cierre (que solo añade documentación y `capabilities/`): entorno levantado en esta sesión con `node scripts/env-up.mjs` y `/health` en verde; gate de cierre literal `node --test test/ && node e2e/run.mjs`, exit 0.
- Gate: `node --test test/ && node e2e/run.mjs` → unitarias: corrió 5/5 · e2e: corrió 7/7 · 48,7 s · configuración: la del gate · sobre el commit de cierre.
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:1570/health` → ok, levantado en esta sesión; parado al acabar con `env-down`.
- E2E: 48,2 s de 0,5 min de presupuesto — pasa del presupuesto (6 s por paso con la traza completa): deuda del proyecto, ver 4.3.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 unitarias y 7/7 e2e · smoke 4/4 THEN con ejecución real contra el servidor levantado en esta sesión · revisión final Spec y Código sobre `745393d` limpia · re-revisión del tramo posterior (solo `tasks.md`) con 2 Important y 1 Minor, todos sobre el registro y tratados en el cierre; nadie la ha validado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde `cancelada Norte lun (sala ocupada)` | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista (`me aburro`) responde `motivo no válido: cambio de planes, sala ocupada, otro` | ejecución real | igual |
| sin `--motivo` responde lo mismo | ejecución real | igual |
| `canceladas` responde `Norte lun — sala ocupada` | ejecución real | igual, en la misma sesión tras cancelar |

### 4.3 Residuales / deuda generada

- Dependencia de orden en `test/cancel.test.js`: `canceladas` solo pasa tras `cancelar con un motivo de la lista`, contra la regla de «Datos» de `operations.md` — fila en «Deuda técnica».
- Suite E2E: 48,2 s frente a un presupuesto de 0,5 min — deuda del proyecto, fila en «Deuda técnica».
- Fuera de scope, ya en el roadmap: las anulaciones del responsable de sala (0011), el informe de canceladas (0012) y guardar el motivo en el almacén de reservas (0014).

## 5. Aprendizajes

- Un cambio de comportamiento observable (cancelar pide motivo, `canceladas` lo enseña) → `capabilities/bookings.md`, nueva, fusionada desde el delta de la spec.
- Un Ruling que dice «apliqué X» sin que X esté en el repo se detecta solo cruzándolo con `package.json` y `operations.md`: la re-revisión lo vio y el cierre lo corrigió → `tasks.md`, sección Rulings.
- Sin `architecture.md` en el proyecto y sin aprendizaje estructural: nada que volcar.

Retro: documento o skill desmentido → corregido en el mismo documento: el Ruling de la Task 2 decía aplicar `--test-concurrency=1` y el repo no lo tenía (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- (ninguna)
