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

- `src/app.js`: `cancelar` exige `--motivo` de una lista cerrada (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada; comando nuevo `canceladas` (660e85c, c07325f).
- `test/cancel.test.js` y `e2e/cancel.e2e.mjs`: tests del motivo y del listado.
- Capacidad `bookings` creada desde el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

`.docs/sdd/estimation.md` no existe: el módulo de estimación está apagado.

- Esfuerzo real: 0,07 h — reloj de la sesión 0,07 h desde 2026-10-21T18:25Z, sin 0 min de espera al dev-lead (0 esperas)
- Tokens del hilo: 618.713 — claude-sonnet-5-5 618.713
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. El flag no llegó al gate ni al código: el gate declarado (`node --test test/`) pasa sin él. La carrera queda como deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test test/ && node e2e/run.mjs` → unit 5/5, E2E 7/7 · 48,2 s de E2E · sobre `ec3ae9f` · configuración: la del gate (traza `on`, sin variables añadidas)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:4327/health` → `ok`, levantado en esta sesión y parado con `env-down`
- E2E: 48,2 s de 0,5 min (30 s) — pasa del presupuesto; deuda en 4.3
- Estabilidad de las specs que toca la rama: `e2e/cancel.e2e.mjs`, los 3 tests nuevos o cambiados ×3 → 9/9 en verde (72,5 s); los otros 2 tests del fichero ×1 → 2/2. `free.e2e.mjs` no se toca y no se repitió.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · suite 5/5 unit + 7/7 E2E · smoke 3/3 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre c07325f; HEAD solo añadió `tasks.md` · specs E2E repetidas ×3 sin fallos. Arquitectura sin revisar (decisión del plan). No probado: nada a mano por una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` → la misma respuesta | ejecución real (curl a `/run`) + `test/cancel.test.js` | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Suite E2E por encima del presupuesto: 48,2 s de 0,5 min — deuda del proyecto (cada paso espera 6 s con la traza completa).
- Carrera de los tests sobre el almacén compartido en memoria — deuda del proyecto.

## 5. Aprendizajes

- La capacidad `bookings` no existía; nace del delta de la spec → `.docs/sdd/capabilities/bookings.md`.
- Sin aprendizajes de convención, arquitectura ni versiones. No existe `.claude/skills/` en el proyecto: miradas, ninguna skill que crear ni desmentida.

## 6. Adendas

