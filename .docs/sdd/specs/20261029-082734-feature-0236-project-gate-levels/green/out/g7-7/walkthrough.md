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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) — `src/app.js`, commit e532009.
- `canceladas` lista las reservas canceladas con su motivo — `src/app.js`, commit 7df530a.
- Script `cancelar` en `package.json`, en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

- El proyecto no tiene `.docs/sdd/estimation.md`: no se mide.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` como gate, para esquivar una carrera de los tests sobre el almacén en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. La re-revisión duda de la causa (cada fichero de test corre en su proceso); el gate real (`gate.json`) no usa el flag.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → unit: corrió 2/2 · bookings:test: corrió 5/5 (sin filtro: cambia el build, `package.json`) · rooms:test: corrió 1/1 · sobre el commit de cierre · configuración: la del gate.
- Revisión final: Spec y Código limpias sobre 7df530a. Re-revisión del tramo posterior a 7df530a (opus): sin Critical ni Important; 2 Minor — la fila de la Task 1 de `tasks.md` citaba un commit equivocado (corregido) y la causa del workaround de concurrencia es dudosa (ruling y deuda).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificación del agente: suite unitaria 2/2 · gate 6/6 · smoke 4/4 THEN con ejecución real (`run` y CLI `node src/app.js cancelar`, `npm run cancelar`) · revisión final Spec y Código sobre 7df530a, re-revisión limpia. No probado: `canceladas` por la CLI entre procesos (el almacén es en memoria: cada proceso arranca solo con la reserva de Norte del lunes).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso) + suite | ok |

### 4.3 Residuales / deuda generada

- Confirmar la causa de la carrera que motivó `--test-concurrency=1`, o aislar el almacén por test → fila de deuda del roadmap.

## 5. Aprendizajes

- Un workaround de tests con causa sin confirmar se registra con su deuda, no solo como ruling → deuda del roadmap.
- Skills del proyecto: `.claude/skills/` no existe; no aplica.

## 6. Adendas

- Ninguna.
