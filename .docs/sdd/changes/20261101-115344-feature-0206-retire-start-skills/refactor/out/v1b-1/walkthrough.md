---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — 7a921c5.
- `canceladas` lista «<sala> <día> — <motivo>» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — f74707b.

## 2. Tiempo y coste

- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-11-01T13:26Z, sin 0 min de espera al dev-lead (0 esperas)
- Tokens del hilo: 335.842 — claude-sonnet-5-5 335.842
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre `node --test --test-concurrency=1`, no `node --test` — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Apuntado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · sin filtro: no aplica (sin manifiestos tocados) · 0,13 s · configuración: la del gate más `--test-concurrency=1` (ruling de la Task 2) · sobre 3ceba7f
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre f74707b; HEAD (3ceba7f) solo añade `tasks.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre f74707b

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un mismo proceso (el almacén es en memoria): `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1`: fila en la deuda técnica del roadmap.
- El almacén en memoria no persiste entre ejecuciones de la CLI; `canceladas` solo ve cancelaciones del mismo proceso. Lo cubre la 0014 (Motivo guardado), ya en el roadmap.

## 5. Aprendizajes

- El gate necesita `--test-concurrency=1` mientras el almacén sea compartido → `tech-stack.md` (con su fila de deuda).
- Comportamiento observable de cancelar y de canceladas → `capabilities/bookings.md` (creada con `sdd capability merge`).
- Revisión de skills: no aplica — `.claude/skills/` no existe y el trabajo no reveló un patrón reutilizable.

## 6. Adendas
