---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`) — e222766: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`) — 877f0aa: comando `canceladas` con «<sala> <día> — <motivo>».
- Cierre: capacidad `bookings` creada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`); borrados los dos E2E de feature de `cancel.e2e.mjs`; fila de deuda por el test acoplado.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`)

## 4. Verificación

### 4.1 Builds

- Gate de cierre (`node --test test/ && node scripts/critical-path.mjs && node e2e/run.mjs`): no corre aquí; la base (`develop`) va un commit por delante, así que corre una vez sobre el merge de sincronización (paso 6) y su sha va en el mensaje final.
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:61980/health` → levantado en esta sesión para los tests de feature y el smoke; parado después con `env-down.mjs`.
- Tests de feature: `node scripts/critical-path.mjs --extras --run` → 5 passed (36,1 s) · borrados: `cancel.e2e.mjs › rechaza un motivo fuera de la lista`, `cancel.e2e.mjs › la cancelada sale en canceladas con su motivo`. Tras borrar, el check no devuelve ningún `fuera:`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · smoke 4/4 THEN con ejecución real contra el servidor levantado en esta sesión · tests de feature 5/5 · revisión final (Spec opus+high, Código sonnet+high, limpia) sobre 877f0aa; HEAD solo añadió `tasks.md` · suite de cierre `no probado` aquí, corre en el merge de sincronización.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende de la cancelación de otro test: fila en «Por triar» de `debt.md`.
- `develop` no tiene `roadmap.md` ni `estimation.md` en este proyecto: sin fila de roadmap ni tiempo real que registrar.

## 5. Aprendizajes

- El motivo de cancelación es comportamiento observable → `capabilities/bookings.md` (creada por el delta de la spec).

Retro: sin señales

## 6. Adendas

- (ninguna)
