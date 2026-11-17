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

- **Cancelar con motivo** (Task 1, `8da7cd1`): `src/app.js` guarda con la reserva cancelada el motivo de la lista cerrada (cambio de planes, sala ocupada, otro). `cancelar <sala> <día> --motivo <motivo>` responde «cancelada <sala> <día> (<motivo>)»; un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro». Tests en `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `c50627a`): comando `canceladas`, una línea «<sala> <día> — <motivo>» por reserva cancelada. Test en `test/cancel.test.js` y flujo E2E en `e2e/cancel.e2e.mjs`.
- Cierre: `tasks.md` con el commit real de la Task 1, changelog y roadmap.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no (decisión 3 de la spec) · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Ninguna en lo construido: dos tasks, Native, como el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: usar `node --test --test-concurrency=1` en el gate para esquivar una carrera sobre el almacén compartido — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Era errónea y no llegó al repo**: el cierre corrió el gate tal como lo declara `operations.md` (sin el flag), en verde. La causa real es que `canceladas enseña sala, día y motivo` solo pasa tras el primer test de su fichero; va a la deuda (fila nueva del roadmap) y no se ha tocado el test.
- En el cierre: los dos hallazgos de la re-revisión eran de `tasks.md` y los corregí allí (la Task 1 apuntaba a `c50627a`, es `8da7cd1`; el ruling, con su nota de cierre).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 en verde (99 ms).
- `node scripts/env-up.mjs` + `curl -f http://localhost:8061/health` → `ok`, levantado en esta sesión (pid 53788). Había ya un servidor escuchando en el 8061 que no era mío; `env-up` lo reinició y comprobé el mío antes de pasar el E2E. Parado con `env-down` al acabar.
- `node e2e/run.mjs` → 7/7 en verde.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 49 s · configuración: la del gate, sin variables ni opciones añadidas · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:8061/health` → `ok`, levantado en esta sesión
- E2E: 49 s de 0,5 min — pasa del presupuesto: fila de deuda abierta en el roadmap.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite unitaria 5/5 · E2E 7/7 · smoke 4/4 THEN con ejecución real contra el servidor levantado por mí, con una sesión nueva · revisión final Spec y Código limpia sobre c50627a; re-revisión del tramo posterior (solo `tasks.md`) con 2 hallazgos Important, corregidos en el cierre. Nada `no probado`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- `canceladas enseña sala, día y motivo` depende del test anterior de su fichero → fila de «Deuda técnica» del roadmap.
- E2E de 49 s frente a un presupuesto de 0,5 min → fila de «Deuda técnica» del roadmap, con la duración.
- La fila 0014 «Motivo guardado» parece cubierta por esta feature (el motivo se guarda con la reserva en el almacén). No la he tocado: lo decide el dev-lead.

## 5. Aprendizajes

- Un ruling de la ejecución que dice haber cambiado el gate hay que contrastarlo con el repo al cerrar: este nunca se aplicó y su causa estaba mal atribuida → corregido en `tasks.md` y deuda en el roadmap.
- Una nueva capacidad `bookings` (cancelar con motivo y listado de canceladas) → `capabilities/bookings.md`, con `sdd capability merge`.

Retro: documento o skill desmentido → corregido en el mismo documento: el ruling de `--test-concurrency=1` de `tasks.md` lo desmentía el repo (`tasks.md`)

## 6. Adendas

- (ninguna)
