---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva — `src/app.js`, `test/cancel.test.js` (d4b46e1).
- `canceladas` lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js` (d5c7b7b).
- Capacidad `bookings` creada en `capabilities/bookings.md`.

## 2. Tiempo y coste

- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-16T12:35Z, sin 0 min de espera al dev-lead (1 espera) *(solo el cierre; `estimation.md` no existe)*
- Tokens del hilo: 393.915 — claude-sonnet-5-5 393.915
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)

## 3. Desviaciones del plan

- _Ninguna_ en el plan. En el cierre se corrigió «Capacidades» de la spec: decía `Modificadas: bookings` y la capacidad no existía; pasa a `Nuevas` (anotado en Enmiendas de la spec).

### Decisiones tomadas sin el dev-lead

- Task 2: gate `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 verdes · 0,2 s · sobre f07d7b5.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec (opus) y Código (sonnet) limpias sobre d5c7b7b; lo posterior (f07d7b5) solo cambia `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite + ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: …» | suite + ejecución real | ok |
| sin `--motivo` → «motivo no válido: …» | ejecución real (`node src/app.js cancelar Norte lun`); sin test en la suite | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite + ejecución real | ok |

### 4.3 Residuales / deuda generada

- El caso «sin `--motivo`» no tiene test propio.
- Los tests comparten un almacén en memoria y corren en serie (ver arriba): deuda en el roadmap.

## 5. Aprendizajes

- El workaround de concurrencia de tests → deuda del roadmap (no pasa a `tech-stack.md`).

## 6. Adendas

- (ninguna)
