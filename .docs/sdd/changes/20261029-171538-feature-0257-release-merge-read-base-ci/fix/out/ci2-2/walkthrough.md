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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js`, commit 4775517.
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js`, commit 71e472a.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test (fila en la deuda del roadmap) — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → 5/5 tests verdes · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke 4/4 THEN con ejecución real (verificado por el agente; el dev-lead no ha probado nada a mano) · revisión final Spec y Código limpia sobre 71e472a, con solo `tasks.md` después.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`me aburro`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren en serie: aislar el almacén por test (fila en la deuda del roadmap).

## 5. Aprendizajes

- Los tests de `app.js` comparten estado y no admiten concurrencia → deuda del roadmap (no hay `architecture.md` ni `.claude/skills/`: revisado, no aplica a skills).

## 6. Adendas

- (ninguna)
