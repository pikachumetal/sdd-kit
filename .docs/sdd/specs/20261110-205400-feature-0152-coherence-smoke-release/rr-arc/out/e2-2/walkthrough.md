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

- **Cancelar con motivo** (`5d853c0`): `src/app.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva y lo enseña en la respuesta. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `test/cancel.test.js`.
- **Listado de canceladas** (`7faa840`): `src/app.js` — comando `canceladas`, una línea «sala día — motivo» por reserva cancelada. `test/cancel.test.js` y `e2e/cancel.e2e.mjs` (un test cambiado y dos nuevos).
- **Capacidad `bookings`** creada con `sdd capability merge`: los dos requisitos ADDED de la spec.

## 3. Desviaciones del plan

- `7faa840` toca también `e2e/cancel.e2e.mjs`, que el plan no lista en «Ficheros» de la Task 2. Los E2E de los flujos core lo piden; no cambia la spec.

### Decisiones tomadas sin el dev-lead

- Gate con `--test-concurrency=1` (Ruling de la Task 2) — para esquivar una carrera sobre el almacén en memoria — coste si está mal: suite el doble de lenta. Lo revisé al cierre: **no se aplicó** y la premisa no se sostiene (un proceso por fichero; lo real es una dependencia de orden entre tests). El gate corrió tal como lo declara `operations.md`.
- Sin review de spec (dos señales: MODIFIED, datos) — decisión de la spec — coste si está mal: un hueco de la spec sin ver; el THEN «sin `--motivo`» quedó sin test propio, y lo cubrí con ejecución real.
- Al cierre, el commit posterior a la revisión final (solo `tasks.md`, 17 líneas) movió `HEAD` tras la revisión final: lancé la re-revisión única (`sdd-kit:effort-high` + `opus`) en vez de leerlo en el hilo, porque así lo pide el cierre. Corregí lo que encontró en el registro.
- Dependencia de orden entre tests: no la he arreglado (queda en la deuda): es un cambio de tests fuera del scope de esta feature.

## 4. Verificación

### 4.1 Builds

- `node --test test/` y `node e2e/run.mjs` sobre el código del cierre (el commit de cierre solo suma `.docs/`): unit 5/5, E2E 7/7.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48,6 s · configuración: la del gate (sin `E2E_TRACE`) · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:55082/health` → ok, levantado en esta sesión (pid 6232 para el gate, 71284 para el smoke) y parado al acabar.
- E2E: 48,1 s de 0,5 min (pasa el presupuesto: deuda en 4.3)
- Tanda: `Tanda: 3 tests cambiados/nuevos de cancel.e2e.mjs ×3 + 2 más de ese fichero ×1 = 11 ejecuciones · ~1,4 min (7,6 s × 11 ÷ 1)`, 1,4 min reales (84,7 s): 11/11 en verde, ninguna inestable.

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · suite unit 5/5 y E2E 7/7 sobre el commit de cierre · tanda de los tests cambiados ×3 y los otros dos ×1, 11/11 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre 7faa840, re-revisión del rango posterior a `7faa840` con hallazgos en el registro, ya corregidos (código sin hallazgos) · no probado: nada

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» (misma sesión que la cancelación) |

### 4.3 Residuales / deuda generada

- Suite E2E que pasa de su presupuesto: 48,1 s de 0,5 min — deuda del proyecto (ya pasaba sin la rama: cada paso espera 6 s con la traza por defecto; los tests nuevos suman 8 pasos más).
- Dependencia de orden entre tests de `test/cancel.test.js`: «canceladas enseña sala, día y motivo» solo pasa tras «cancelar con un motivo de la lista», sobre el almacén compartido del módulo. Fila en «Por triar».
- Minor diferido: el THEN «sin `--motivo`» no tiene test propio (lo cubre el código y la ejecución real de arriba).

## 5. Aprendizajes

- Un ruling que dice «aplicado en el gate» tiene que dejar rastro en `package.json` u `operations.md`; el cierre no lo encontró, y el registro decía lo contrario del repo → solo este walkthrough y la deuda (sin destino de doc vivo: no hay convención nueva).
- La capacidad `bookings` nace con esta feature → `capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido en el mismo documento (.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md)
Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` (paso 3 de sdd-archive) manda re-revisar un commit de solo documentación y menos de 20 líneas, y `sdd-implement` («Every commit of yours») y `sdd-verify` («Closing the review») mandan leerlo en el hilo sin despachar

## 6. Adendas

- (ninguna)
