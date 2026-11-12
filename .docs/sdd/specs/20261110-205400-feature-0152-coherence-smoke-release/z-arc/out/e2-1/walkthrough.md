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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`; sin motivo o fuera de la lista responde `motivo no válido: …`. Comando nuevo `canceladas`. Commits 16d81da y 0529dc5.
- `test/cancel.test.js`: tests unitarios de los tres casos. `e2e/cancel.e2e.mjs`: tres tests E2E nuevos o cambiados (cancela con motivo, rechaza un motivo fuera de la lista, la cancelada sale en `canceladas`).
- `.docs/sdd/capabilities/bookings.md`: creada al fusionar el delta de la spec (dos requisitos añadidos).

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test unitario `canceladas enseña sala, día y motivo` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. (Pasa a la deuda, «Por triar».)

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 en verde.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → e2e: corrió 7/7 · 48,2 s · configuración: la del gate (sin `E2E_TRACE`) · sobre el commit de cierre (el cierre junta `eff5bae`, que solo añade `tasks.md` sobre `0529dc5`; el código es el mismo).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:51691/health` → `ok`, levantado en esta sesión (nada escuchaba antes) y parado al acabar.
- E2E: 48,2 s de 0,5 min (pasa del presupuesto; deuda en 4.3).
- Tanda: `# Tanda: 3 tests nuevos o cambiados de e2e/cancel.e2e.mjs ×3 + los otros 2 de ese fichero ×1 = 11 ejecuciones · ~1,4 min (7,6 s de media × 11 ÷ 1 worker)`, 1,4 min reales (84,5 s): 11/11 en verde, sin inestabilidad. Alcance medido contra `develop`; `e2e/free.e2e.mjs` no lo toca la rama y no entra.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite unitaria 5/5 · gate e2e 7/7 · tanda ×3 de las specs que toca la rama 11/11 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 0529dc5; `HEAD` solo añadió `tasks.md`, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (E2E contra el servidor, ×4 en total) | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (E2E ×3, provocado con `me aburro`) | ok |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (E2E, con otro motivo: «Norte lun — otro») | ok |

### 4.3 Residuales / deuda generada

- El test unitario `canceladas` depende del orden de los tests → «Por triar».
- Suite E2E por encima de su presupuesto: 48,2 s de 0,5 min — deuda del proyecto → «Por triar».

## 5. Aprendizajes

- El comportamiento nuevo (motivo y listado de canceladas) vive en la capacidad `bookings` → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
