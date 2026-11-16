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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo se valida contra la lista cerrada (cambio de planes, sala ocupada, otro) y se guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — 5e00828.
- `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — b4d2f71.
- Capacidad nueva `bookings` fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): no estimada (el proyecto no tiene `estimation.md`)
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-29T16:29Z, sin 0 min de espera al dev-lead (0 esperas)
- Tokens del hilo: 383.282 — claude-sonnet-5-5 383.282
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre el gate pasa también sin la opción (`node --test`, el de CI), así que el workaround no hizo falta; queda como deuda.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 5/5 pasan · 0,13 s · configuración: la del gate del plan · sobre el commit de cierre. Con `node --test --test-concurrency=1` también 5/5.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke 5/5 THEN con ejecución real · revisión final (Spec opus+high y Código sonnet+high, limpias) sobre b4d2f71; HEAD se movió con un commit solo de documentación (tasks.md), sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real (`run` encadenando cancelar y canceladas en un proceso, porque el almacén es en memoria) | ok |
| (los cuatro, por la suite) | suite | ok |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1` sin necesidad demostrada → fila en la deuda del roadmap.
- La spec numera «Decisiones que he tomado yo» como 1 y 3 (falta la 2); no cambia nada de lo aprobado.

## 5. Aprendizajes

- Ninguno que deba volcarse a un doc vivo. Revisión de skills: no aplica, el proyecto no tiene `.claude/skills/` (comprobado).

## 6. Adendas

- (ninguna)
