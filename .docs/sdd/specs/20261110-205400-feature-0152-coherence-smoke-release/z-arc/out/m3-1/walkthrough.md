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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» (89fa916).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (9c12437).
- `migrations/v3.0.0.md` — la línea pasa a «**Escribe**: `sdd-kit.json`, `operations.md`.» (entra en el commit de cierre).
- `capabilities/bookings.md` — capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde sobre 365ff91 (la rama antes del cierre). Con `develop` por delante (la 0016), la suite del cierre corre una vez sobre el merge de sincronización; su línea `Gate:` y su sha van en el mensaje final del cierre.
- Revisión final: Spec y Código limpias; el único commit posterior a lo revisado cambia una línea de `tasks.md` (docs), sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN y un borde con ejecución real (por la CLI con `node src/app.js`, salvo el del listado, en un mismo proceso con `run()` porque la CLI no persiste entre procesos) · `node --test` 5/5 sobre 365ff91, suite del cierre sobre el merge de sincronización · revisión final Spec y Código limpias sobre el commit de cierre · no probado: `canceladas` en un proceso aparte (sale vacío, lo cubre la 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `--motivo` sin valor responde lo mismo (borde) | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso: `run('cancelar', …)` y luego `run('canceladas', [])`) | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- La CLI no guarda las reservas entre procesos: `node src/app.js canceladas` solo ve lo cancelado en su propio proceso. Ya lo cubre la fila 0014 «Motivo guardado».
- Los tests de cancelación dependen de su orden (ruling de la Task 2): fila en «Por triar» de la deuda.

## 5. Aprendizajes

- La capacidad `bookings` nace con esta feature → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
