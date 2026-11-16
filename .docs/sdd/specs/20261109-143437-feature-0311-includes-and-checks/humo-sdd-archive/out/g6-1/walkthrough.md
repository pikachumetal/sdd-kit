---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (Task 1, a7651d8).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>»: `src/app.js`, `test/cancel.test.js` (Task 2, cd4adb8).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (Task 2; fila en la deuda técnica del roadmap).
- Cierre: no he lanzado re-revisión del commit 4057c42, posterior a la revisión final (sobre cd4adb8): solo añade `tasks.md` con el registro de esa misma revisión y queda fuera del paquete de revisión. sin revisar: 4057c42 — solo `tasks.md`.

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre cd4adb8; Arquitectura no (plan).
- La suite del cierre corre una sola vez, sobre la fusión de sincronización de la base (hay otra rama abierta, `feature/0011-others`, y `develop` va por delante): su `Gate:` y su sha van en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-09 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código sobre cd4adb8, limpia · suite sobre la fusión de sincronización (paso 6)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista: «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `cancelar Norte lun --motivo "pereza"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo`, lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un solo proceso (cancelar y luego `canceladas`): `Norte lun — sala ocupada` |

Nota: el almacén es en memoria, así que `canceladas` lanzado como proceso aparte tras un `cancelar` también aparte sale vacío; la persistencia del motivo es la 0014. No probado entre procesos.

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren con `--test-concurrency=1`: deuda técnica en el roadmap.
- `canceladas` no sobrevive entre procesos del CLI: 0014 (ya en el roadmap).

## 5. Aprendizajes

- Los tests de `app.js` comparten un almacén en memoria y se pisan si corren en paralelo → deuda técnica del roadmap (aislar el almacén por test).

Retro: sin señales

## 6. Adendas

- _Ninguna_
