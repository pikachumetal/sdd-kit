---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es de una lista cerrada (cambio de planes, sala ocupada, otro); uno fuera de la lista, o ninguno, responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — `2258ed2`.
- `canceladas`: lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). `src/app.js`, `test/cancel.test.js` — `555a940`.
- Capacidad nueva `capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

Sin `.docs/sdd/estimation.md`: el proyecto no tiene el módulo de estimación.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En el cierre se corrigieron dos errores del registro `tasks.md` que halló la re-revisión: la fila de la Task 1 citaba el commit de la Task 2, y el ruling del gate no estaba aplicado en `gate.json`.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. `gate.json` no lo lleva: lo apliqué a mano en la suite de cierre.

## 4. Verificación

### 4.1 Builds

- `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (sus inputs no cambian) · salida 0.
- Gate: `node --test --test-concurrency=1` → 6/6 pasan, 0 fallan, sobre `HEAD` antes del commit de cierre (el commit de cierre solo suma `.docs/`).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 6/6 · gate 5/5 · smoke 5/5 THEN con ejecución real · revisión final Spec y Código limpias sobre `555a940`; re-revisión de `555a940..23addde` con 2 hallazgos del registro, corregidos en el cierre. El dev-lead no dijo qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`run` del módulo) | verificado por el agente |
| Motivo fuera de la lista (`x`, `sala-ocupada`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| Sin `--motivo` → el mismo mensaje | ejecución real | verificado por el agente |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real | verificado por el agente |
| `cancelar Norte lun --motivo otro` desde la CLI → «cancelada Norte lun (otro)» | ejecución real | verificado por el agente |

### 4.3 Residuales / deuda generada

- Workaround de `--test-concurrency=1`: fila en la deuda del roadmap.
- `roadmap check` falla en 2 líneas que este cierre no tocó (cabecera de «Deuda técnica» y «Releases cerradas»): las arregla la migración v2.3.0 del kit.

## 5. Aprendizajes

- Los tests comparten el almacén de reservas en memoria y corren en carrera → deuda del roadmap (no va a `tech-stack.md`).

Retro: sin señales
