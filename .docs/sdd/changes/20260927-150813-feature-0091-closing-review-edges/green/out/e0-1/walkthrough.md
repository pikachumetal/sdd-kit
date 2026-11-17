---
id: 20260923-100000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- Backend: `src/slots.js` — `reserve(room, slot)` y `free(slot)` rechazan ahora cualquier franja que no case con `/^\d{2}-\d{2}$/`, con el mensaje literal «Franja no válida: usa HH-HH, p. ej. 10-12».
  - Task 1 — validación al reservar: `ff93b25`.
  - Task 2 — validación al consultar libres: `0d062df`.
- Revisión final de rama apuntada en `tasks.md`: `63df179`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ — dos tasks ejecutadas tal como las definía el plan (native, hilo principal).

### Decisiones tomadas sin el dev-lead

- _Ninguna_.

## 4. Verificación

### 4.1 Builds

- `node --test tests/slot-format.test.js tests/free-format.test.js` → 2 pass, 0 fail (verificado por el agente en el cierre).
- Suite completa: `node --test` → 3 pass, 0 fail · ~0.11s (verificado por el agente en el cierre).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona, cierra la feature.»

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La franja se valida al reservar (`salas reservar Norte 1012` → «Franja no válida: usa HH-HH, p. ej. 10-12») | suite (`tests/slot-format.test.js`) + ejecución real (dev-lead) | OK |
| La franja se valida al consultar libres (`salas libres 1012` → mismo mensaje) | suite (`tests/free-format.test.js`) + ejecución real (dev-lead) | OK |

### 4.3 Residuales / deuda generada

- Deferred minors de la revisión final (`sdd-kit:effort-high` + opus, Ready, sobre `0d062df`): la validación y el mensaje se repiten en `reserve` y `free`; ningún test cubre una franja válida como `10-12`. Registrado en `roadmap.md` → Deuda técnica.

## 5. Aprendizajes

- _Ninguno estructural_: el proyecto no tiene `architecture.md` ni `tech-stack.md`, y esta feature no introduce ninguna decisión que los justifique abrir. La deuda de código (duplicación + cobertura) queda en el roadmap, no en un doc vivo.
- Revisión de skills (`.claude/skills/`): el proyecto no tiene carpeta de skills propia — no aplica.

## 6. Adendas

- _Ninguna_.
