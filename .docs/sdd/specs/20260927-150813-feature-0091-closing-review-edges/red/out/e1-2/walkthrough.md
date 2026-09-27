---
id: 20260923-100000-task-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve(room, slot)` valida la franja contra `/^\d{2}-\d{2}$/` y lanza «Franja no válida: usa HH-HH, p. ej. 10-12» si no casa — d0655e1.
- `src/slots.js`: `free(slot)` aplica la misma validación al consultar salas libres — 1be1886.
- `src/slots.js`: la validación se extrae a `assertSlot(slot)` y la comparten `reserve` y `free`, resolviendo el minor diferido de la revisión final («la validación y el mensaje se repiten») — 1c6e728.

## 2. Tiempo y coste: estimado vs real

- Módulo de estimación inactivo: no existe `.docs/sdd/estimation.md`.
- Modelo del hilo: Sonnet 5, effort no registrado (ejecución Native, sesión) → revisión final de rama: sdd-kit:effort-high + Opus.
- Tokens del hilo: no medido (sin transcripts de Claude Code para el worktree)
- Tokens de subagentes: no medido (sin transcripts de Claude Code para el worktree)
- Coste de la sesión: no medido (sin transcripts de Claude Code para el worktree)
- Review de spec: no

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- _Ninguna_

## 4. Verificación

### 4.1 Builds

- Suite: `node --test tests/slot-format.test.js tests/free-format.test.js` → 2 pass, 0 fail · ~157 ms

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · probó `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. «Vale, funciona, cierra la feature.»

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Falla con «Franja no válida: usa HH-HH, p. ej. 10-12» al reservar con una franja que no casa `HH-HH` | ejecución real (`salas reservar Norte 1012`, dev-lead) · suite (`tests/slot-format.test.js`) | ✅ |
| Falla con el mismo mensaje al consultar salas libres con una franja que no casa `HH-HH` | ejecución real (`salas libres 1012`, dev-lead) · suite (`tests/free-format.test.js`) | ✅ |

### 4.3 Residuales / deuda generada

- Ningún test cubre una franja válida (p. ej. `10-12`) en `reserve`/`free` — minor diferido de la revisión final, sin resolver; anotado en la tabla de deuda técnica del roadmap.
- Re-revisión de `1be1886..1c6e728` (commit posterior a la revisión final, toca `src/slots.js`, no entra en la excepción de `.docs/`): el despacho de subagente no estaba disponible en esta campaña. Lectura en el hilo: extrae la validación duplicada a `assertSlot`, sin cambio de comportamiento observable ni de API exportada, tests en verde — Ready (0 Critical, 0 Important, 0 Minor), pero es lectura del hilo, no de un subagente independiente.

## 5. Aprendizajes

- El delta de esta spec declaraba la capacidad `booking`, que aún no existía en `capabilities/` → creada en `capabilities/booking.md` (fusión del delta, `capability-template.md` de `sdd-templates`) y añadido el bloque `## Capacidades` que faltaba en `spec.md`.

## 6. Adendas

_Ninguna_
