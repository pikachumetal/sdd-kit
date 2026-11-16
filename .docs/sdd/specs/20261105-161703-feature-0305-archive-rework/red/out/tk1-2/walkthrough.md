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

- `src/app.js` y `test/cancel.test.js`, Task 1 (`7025b0f`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva; un motivo fuera de la lista, o la ausencia de `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- `src/app.js` y `test/cancel.test.js`, Task 2 (`5901b33`): comando `canceladas`, que lista `<sala> <día> — <motivo>` por cada reserva cancelada.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge`, a partir del delta de la spec.
- Registros del cierre: `tasks.md` (el commit de la Task 1 era `7025b0f`, no `5901b33`), changelog, roadmap y una fila de deuda.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en lo que se construyó: dos tasks Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` — los tests comparten el almacén de reservas en memoria y corrían en carrera — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en `roadmap.md`.
- Spec, decisión 3: sin review de spec (el spec solo tiene ADDED y la spec lo justifica con «dos señales (MODIFIED, datos)»; la numeración de «Decisiones» salta de la 1 a la 3).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 de 5 en verde, 0 fallos, ~0,2 s.
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,2 s · configuración: la del gate más `--test-concurrency=1` (ruling de la Task 2) · sobre `b6bab97` (el commit de cierre solo añade documentación).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI `node src/app.js`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias, sobre `5901b33`; `HEAD` (`b6bab97`) solo añade `tasks.md` (17 líneas de documentación), sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| Un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real (ningún test lo cubre) | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real (`run` en el mismo proceso) + suite | ok |

### 4.3 Residuales / deuda generada

- Cada invocación de la CLI es un proceso nuevo y el almacén vive en memoria: `node src/app.js canceladas` en una segunda ejecución sale vacío. La spec no pide persistencia; es la fila 0014 «Motivo guardado» del roadmap.
- Deuda nueva: tests con almacén compartido y `--test-concurrency=1` (fila en «Deuda técnica» de `roadmap.md`).

## 5. Aprendizajes

- Los tests de `app.js` no aíslan el almacén en memoria y por eso corren en serie → deuda (`roadmap.md`, «Deuda técnica»); no va a `tech-stack.md`, porque es un workaround y no una decisión.

Retro: sin señales

## 6. Adendas

- (ninguna)
