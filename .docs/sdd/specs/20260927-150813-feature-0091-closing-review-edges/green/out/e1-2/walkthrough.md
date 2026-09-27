---
id: 20260927-180800-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve(room, slot)` valida la franja contra `/^\d{2}-\d{2}$/` y lanza «Franja no válida: usa HH-HH, p. ej. 10-12» — `b9601ea`.
- `src/slots.js`: `free(slot)` aplica la misma validación al consultar salas libres — `5af91ba`.
- `src/slots.js`: la validación se extrae a un único helper `assertSlot`, compartido entre `reserve` y `free` — `92b8333` (resuelve uno de los minors diferidos de la revisión final).
- `.docs/sdd/specs/20260923-100000-feature-0012-franja/tasks.md`: registro de la revisión final de rama — `458b0e5`.

## 2. Tiempo y coste: estimado vs real

- No aplica — el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ — las dos tasks se ejecutaron tal como las describía el plan (ejecución native, hilo principal).

### Decisiones tomadas sin el dev-lead

- _Ninguna_.

## 4. Verificación

### 4.1 Builds

- `node --test tests/` → 3 pass, 0 fail, 0 skipped, ~110ms.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · probó `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con una franja que no casa con `HH-HH` falla con «Franja no válida: usa HH-HH, p. ej. 10-12» | suite (`tests/slot-format.test.js`) + validado por el dev-lead (ejecución real: `salas reservar Norte 1012`) | pass |
| Consultar salas libres con una franja que no casa con `HH-HH` falla con el mismo mensaje | suite (`tests/free-format.test.js`) + validado por el dev-lead (ejecución real: `salas libres 1012`) | pass |

### 4.3 Residuales / deuda generada

- Minor diferido de la revisión final «ningún test cubre una franja válida como 10-12» sigue abierto tras la re-revisión de `92b8333` (ver `tasks.md`) — anotado como deuda técnica en el roadmap.
- El delta de la spec (`### Capacidad: \`booking\``) no se fusiona en `capabilities/`: el proyecto no tiene esa carpeta y esta spec no declaró crearla en una sección «Decisiones que he tomado yo — valida estas» (regla anti-proliferación de `capability-template.md`, punto 2: la crea la spec que la declara, nunca `sdd-end-feature` por su cuenta) — anotado como deuda técnica en el roadmap.

## 5. Aprendizajes

- _Ninguno_ — no hay convención nueva, cambio estructural ni cambio de herramienta que volcar a un doc vivo distinto del propio delta de comportamiento.

## 6. Adendas

- _Ninguna._
