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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin motivo o fuera de la lista responde «motivo no válido: …» (Task 1, `481bfa7`).
- `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs` — comando `canceladas`: «Norte lun — sala ocupada» (Task 2, `383cc1f`).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2 (ejecución): usar `node --test --test-concurrency=1` en el gate para esquivar una carrera sobre el almacén compartido — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. **No llegó a aplicarse**: el gate de cierre corrió como lo declara `operations.md` y pasó 5/5; la re-revisión señaló que el motivo no se sostiene (cada fichero corre en su proceso).

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unitaria: corrió 5/5 · E2E: corrió 7/7 · 48,1 s de E2E (0,13 s unitaria) · configuración: la del gate (traza completa, sin opciones añadidas) · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:52370/health` → ok, levantado en esta sesión. El primer pase dio 7 `ERR_CONNECTION_REFUSED` porque `server.mjs` sale en la primera petición a `/run`; levanté el entorno otra vez, comprobé el health y repetí el pase entero (verde). Parado al terminar, puerto libre.
- E2E: 48,1 s de 0,5 min (30 s) de Presupuesto E2E — por encima, ver 4.3.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 unitarios + 7/7 E2E con el gate declarado · smoke 4/4 THEN con ejecución real (servidor con sesión propia y CLI) · revisión final Spec y Código limpias sobre 383cc1f; re-revisión del commit de `tasks.md` con 2 Important + 1 Minor, todos sobre el registro y ninguno sobre código.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (servidor y CLI) + suite | ✔ |
| motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (servidor y CLI) + suite | ✔ |
| sin `--motivo` responde lo mismo | ejecución real (servidor y CLI) | ✔ (sin test en la suite) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (servidor) + suite + E2E | ✔ |

### 4.3 Residuales / deuda generada

- `test/cancel.test.js`: el test `canceladas` depende del orden de los tests → «Por triar».
- `server.mjs` cae en la primera petición a `/run` → «Por triar», con el workaround en `operations.md`.
- Suite E2E por encima de su presupuesto: 48,1 s de 30 s — deuda del proyecto → «Por triar».

## 5. Aprendizajes

- Un health verde no prueba que el entorno E2E aguante la primera petición real → `.docs/sdd/steering/operations.md` (§Testing, «Entorno de la suite»), con su fila de deuda.

Retro: documento o skill desmentido → línea en operations.md (`.docs/sdd/steering/operations.md`)
Retro: error que cazaría un chequeo → ticket del kit: el cierre dice «corrige cualquier desajuste» de `tasks.md` a mano, y un commit mal anotado en la fila de Task 1 solo lo cazó la re-revisión; un chequeo de la tabla contra `git log` lo habría visto

## 6. Adendas

- _(ninguna)_
