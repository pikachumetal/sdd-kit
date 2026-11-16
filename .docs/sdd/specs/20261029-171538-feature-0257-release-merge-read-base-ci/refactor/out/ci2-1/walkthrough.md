---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — Task 1, `2aec50b`.
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` — Task 2, `28633c1`.
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Gate con `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. (Ruling de la Task 2.) El gate de cierre del plan y el CI usan `node --test` a secas; ver 4.1.

## 4. Verificación

### 4.1 Builds

- `node --test` (el gate del plan, §3, y el del CI) → 5 tests, 5 pasan, 0 fallan. **Verificado por el agente.**
- Gate: `node --test` → suite única: corrió 5/5 · 0,11 s · configuración: la del gate, sin `--test-concurrency=1` (el ruling de la Task 2 no se aplicó en el cierre: pasa sin él) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke 4/4 THEN con ejecución real (`run()` de `src/app.js`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `28633c1`; `87398ce` solo toca `tasks.md`. No lo ha probado el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + ejecución real | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real (`--motivo x`) | ok |
| sin `--motivo` responde lo mismo | ejecución real; **ningún test lo cubre** | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite + ejecución real | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y `canceladas` depende de que el test de `cancelar` corra antes: fila en la deuda del roadmap.
- Falta un test para `cancelar` sin `--motivo`: fila en la deuda del roadmap.

## 5. Aprendizajes

- El almacén en memoria compartido entre tests obliga a un orden y motivó un workaround → deuda del roadmap (no hay `architecture.md` ni skills en el proyecto; ningún aprendizaje de convención o estructura).
- Revisión de skills: `.claude/skills/` no existe en el proyecto; no aplica.
