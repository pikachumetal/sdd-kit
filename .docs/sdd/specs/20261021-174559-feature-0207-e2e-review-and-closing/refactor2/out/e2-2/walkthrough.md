---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `52be3bb`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`; la lista es cerrada (cambio de planes, sala ocupada, otro) y un motivo fuera de ella, o ausente, responde «motivo no válido: …». Tests en `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `7085a98`): comando `canceladas`, que lista sala, día y motivo de las reservas canceladas.
- **E2E**: `e2e/cancel.e2e.mjs` cambia el test «cancela una reserva» (que no pedía motivo) por «cancela una reserva con su motivo» y añade «rechaza un motivo fuera de la lista» y «la cancelada sale en canceladas con su motivo».
- **Capacidad**: nace `capabilities/bookings.md` con los dos requisitos del delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_ en lo que se construye.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No quedó aplicado**: `operations.md` sigue con `node --test test/` y el cierre corrió el gate tal como está declarado, en verde (5/5), así que el ruling no cambió nada en el repositorio. La carrera pasa a la deuda.

## 4. Verificación

### 4.1 Builds

- Build: no aplica.
- Suite completa sobre el código de `7085a98` (lo posterior solo añade `tasks.md`): `node --test test/` → 5/5 · 0,12 s; `node e2e/run.mjs` → 7/7 · 48,2 s · configuración: la del gate (sin `E2E_TRACE`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:4862/health` → `ok`, levantado en esta sesión y parado por `env-down` al acabar.
- E2E: 48,2 s de 0,5 min (pasa del presupuesto: deuda en 4.3).
- Tanda: `cancel.e2e.mjs` › los 3 tests nuevos o cambiados ×3 + los 2 demás ×1 = 11 ejecuciones · ~1,4 min estimados, 1,4 min reales (72,2 s + 12,1 s). 11/11 en verde, sin una sola ejecución roja: no hay inestabilidad. `free.e2e.mjs` no lo toca la rama (contra `develop`) y no entró.

### 4.2 Smoke / tests

Validación en campo: 2026-10-21 · suite unit 5/5 y E2E 7/7 sobre el código de `7085a98` · smoke 4/4 THEN con ejecución real contra el servidor levantado en esta sesión · tanda de estabilidad 11/11 · revisión final de Spec y Código limpias sobre `7085a98` (lo posterior solo añade `tasks.md`). No probado: nada de lo que dice la spec.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ✔ verificado por el agente |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ✔ verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real + suite | ✔ verificado por el agente |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real + suite | ✔ verificado por el agente |

### 4.3 Residuales / deuda generada

- Carrera de los tests sobre el almacén compartido en memoria (la del ruling de la Task 2): fila en la deuda del roadmap.
- Suite E2E fuera de presupuesto: 48,2 s de 0,5 min — fila en la deuda del roadmap. Cada paso de la traza completa tarda 6 s y la rama añade 24 s de pasos nuevos o cambiados; no medí la suite sin la rama.

## 5. Aprendizajes

- Ningún aprendizaje de convención, estructura ni versión: la feature no los trajo. El comportamiento observable va a `capabilities/bookings.md`.
- Skills: el proyecto no tiene `.claude/skills/`; mirado, no aplica.
- ADR: la spec no declara candidatas; `sdd decision check` sin decisiones.

## 6. Adendas

- _Ninguna._
