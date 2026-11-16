---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, f15b3fc): valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada.
- `canceladas` (`src/app.js`, `test/cancel.test.js`, c4ae17d): lista «sala día — motivo» de las reservas canceladas del proceso.
- `migrations/v3.0.0.md`: la línea pasa a «**Escribe**: `sdd-kit.json`, `operations.md`.» (alcance de la spec).
- Capacidad `bookings` creada con `sdd capability merge` (`capabilities/bookings.md`, dos requisitos ADDED).
- Sin «ADR candidata» en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado en el cierre: `--test-name-pattern canceladas` solo, falla).

## 4. Verificación

### 4.1 Builds

- `node --test` en la rama: 5/5 verdes (5 tests, 0 fallos) antes del cierre; la base va por delante (`develop` +2 commits), así que la suite del cierre corre una vez en el merge de sync (paso 6) y su resultado va en el mensaje final, no aquí.
- Gate: no declarado (el proyecto no tiene `operations.md` §Testing ni gate).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 en la rama · smoke 4/4 THEN con ejecución real (`run()` en un proceso y CLI `node src/app.js`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias (lo posterior a la revisión es solo documentación) · no probado: la suite sobre el merge de sync · sin intervención del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (CLI y `run()`) + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (CLI) | ok (sin test propio en la suite) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real (`run()` tras cancelar, mismo proceso) + suite | ok; como CLI en un proceso nuevo sale vacío: las reservas viven en memoria hasta la 0014, tal como dice el Approach |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: `canceladas` falla si corre solo — a «Por triar» en la deuda.
- «Sin `--motivo`» no tiene test en la suite — a «Por triar».

## 5. Aprendizajes

- Las reservas en memoria obligan a que el listado y la cancelación compartan proceso; lo resuelve la 0014 («Motivo guardado») → sin destino nuevo, ya está en el roadmap.

Retro: sin señales

## 6. Adendas

