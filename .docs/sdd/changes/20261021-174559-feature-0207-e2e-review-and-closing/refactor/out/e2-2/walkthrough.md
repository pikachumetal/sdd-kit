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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`; sin motivo o fuera de la lista responde `motivo no válido: …`. Comando nuevo `canceladas`, que lista `<sala> <día> — <motivo>`. Commits `7a80a18` (task 1) y `b12f322` (task 2).
- `test/cancel.test.js`: tests unitarios del motivo y del listado.
- `e2e/cancel.e2e.mjs`: el test «cancela una reserva» pasa a «cancela una reserva con su motivo» y entran «rechaza un motivo fuera de la lista» y «la cancelada sale en canceladas con su motivo».
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en lo que hace el código.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Nunca llegó al gate**: `operations.md` y `package.json` siguen con `node --test test/`, que pasa tal cual (ver 4.1). Queda la dependencia entre tests como deuda (ver 4.3).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test test/ && node e2e/run.mjs` → verde sobre el código de `b12f322` (solo cambian docs desde entonces; unit 5/5; E2E 7/7) · 48,1 s de E2E · configuración: la del gate (sin `E2E_TRACE=light`, el truco del README, ni `--test-concurrency`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:4572/health` → `ok`, levantado en esta sesión con el puerto libre antes; parado después con `node scripts/env-down.mjs`.
- E2E: 48,1 s de 0,5 min — **pasa del presupuesto** (ver 4.3).
- Estabilidad: los tres tests de la rama que cambian respecto a `develop`, ×3, más los otros dos de `e2e/cancel.e2e.mjs` ×1: 11 ejecuciones, 11 verdes (72,2 s + 12,1 s). `e2e/free.e2e.mjs` no lo toca la rama y no se repitió.

### 4.2 Smoke / tests

Validación en campo: 2026-10-21 · suite unit 5/5 y E2E 7/7 sobre el código de `b12f322` · tanda de estabilidad 11/11 · smoke 4/4 THEN con ejecución real · revisión final de Spec y Código sobre `b12f322` limpia, sin Arquitectura (plan); lo posterior a `b12f322` solo es documentación (`tasks.md`), sin revisar aparte.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelarla con ese motivo | ejecución real | ok |

Todo lo anterior lo verificó el agente; ninguna fila es de lo que probó el usuario.

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` comparten el almacén en memoria y `canceladas` depende de que `cancelar` corra antes → fila en «Deuda técnica» del roadmap.
- E2E: 48,1 s de 0,5 min de presupuesto — deuda del proyecto → fila en «Deuda técnica» del roadmap.

## 5. Aprendizajes

- La dependencia entre tests por el almacén compartido → deuda del roadmap (no hay documento vivo donde ponerla: el ruling no se escribió en `tech-stack.md` ni en `operations.md`).
- El presupuesto E2E de `operations.md` no casa con la suite: 7 tests de 6 s por paso dan ~48 s → deuda del roadmap.
- Skills del proyecto: se miró `.claude/skills/`; no existe y el trabajo no revela un patrón reutilizable. No aplica.
- `architecture.md`: no existe y ningún aprendizaje es estructural, así que no se crea.

## 6. Adendas

- _Ninguna._
