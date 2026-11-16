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

- **Cancelar con motivo** (Task 1, `7d7fc2e`): `src/app.js` pide `--motivo` de una lista cerrada (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada; `test/cancel.test.js` actualizado.
- **Listado de canceladas** (Task 2, `05b640f`): comando `canceladas` en `src/app.js`, con su test y las tres specs E2E de `e2e/cancel.e2e.mjs`.
- Capacidad nueva `capabilities/bookings.md`, con los dos requisitos del delta.

## 3. Desviaciones del plan

- `05b640f` toca `e2e/cancel.e2e.mjs`, que no está en los ficheros de la Task 2: son las specs E2E de los flujos core.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera sobre el almacén en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Nunca se aplicó**: el gate sigue siendo `node --test test/` y salió verde sin el flag; además `node --test` ya corre cada fichero en su proceso, así que el flag no resolvería esa carrera. Va a deuda (§4.3).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5. `node e2e/run.mjs` → 7/7.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48,2 s de E2E · configuración: la del gate (`E2E_TRACE` por defecto, sin retries) · sobre el commit de cierre (el squash junta el commit de `tasks.md`; el código es el mismo, salvo `.docs/`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:52367/health` → `ok`, levantado en esta sesión (puerto libre antes) y parado después.
- E2E: 48,2 s de 0,5 min (supera el presupuesto, ver 4.3).
- Tanda: `# Tanda: 3 tests nuevos o cambiados ×3 + 2 más de e2e/cancel.e2e.mjs ×1 = 11 ejecuciones · ~1,4 min (7,6 s × 11 ÷ 1 worker)`, 84 s reales (72,2 s + 12,1 s): 11/11 en verde. `e2e/free.e2e.mjs` no cambia frente a `develop`.
- Revisión final: Spec y Código limpias sobre `05b640f`. Re-revisión del tramo posterior a `05b640f`: 1 Important y 1 Minor, ambos en `tasks.md` y corregidos en el cierre (commit de la Task 1; el ruling, aquí y en deuda).

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · verificada por el agente, sin intervención del dev-lead: suite unitaria 5/5 y E2E 7/7, tanda 11/11, smoke 4/4 THEN con ejecución real contra el servidor levantado, revisión final limpia sobre `05b640f` y re-revisión del tramo final con sus dos hallazgos corregidos.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ✅ |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`me aburro`) | ✅ |
| sin `--motivo` → la misma respuesta | ejecución real (sin test unitario ni E2E que lo cubra) | ✅ |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | ✅ |

### 4.3 Residuales / deuda generada

- Suite E2E que pasa de su presupuesto: 48,2 s de 0,5 min — deuda del proyecto.
- El ruling `--test-concurrency=1` no se aplicó, y los tests de `test/cancel.test.js` dependen del orden (el test 3 solo pasa si el 1 ya canceló Norte lun): fila en «Por triar».
- El THEN «sin `--motivo`» solo está probado a mano: sin test automático.
- La 0014 «Motivo guardado» parece cubierta ya por esta feature (la spec guarda el motivo con la reserva): a triar con `sdd-roadmap`.

## 5. Aprendizajes

- El comportamiento nuevo vive en la capacidad → `capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido en el mismo documento (`tasks.md`, el ruling de `--test-concurrency=1` que ningún fichero aplica)

## 6. Adendas

- _Ninguna._
