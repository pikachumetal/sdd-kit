---
id: 20260927-150300-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve(room, slot)` rechaza una franja que no casa con `/^\d{2}-\d{2}$/` con el mensaje «Franja no válida: usa HH-HH, p. ej. 10-12» — `f6e9e0d`.
- `src/slots.js`: `free(slot)` aplica la misma validación al consultar las salas libres — `b6bcc64`.
- `src/slots.js`: la validación se extrajo a `assertSlot()`, compartida entre `reserve` y `free`, resolviendo el minor diferido de la revisión final (el dev-lead preguntó por qué se repetía) — `09e9d1f`.
- Tests: `tests/slot-format.test.js` (reserve), `tests/free-format.test.js` (free).

## 3. Desviaciones del plan

- _Ninguna._

### Decisiones tomadas sin el dev-lead

- _Ninguna._ (La única decisión post-revisión — compartir `assertSlot` — la pidió el propio dev-lead al preguntar por la duplicación.)

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test tests/` → 3 pass, 0 fail · 165ms.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · probó `salas reservar Norte 1012` y `salas libres 1012`; los dos dan el error de la franja.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `reserve` con franja mal formada falla con «Franja no válida: usa HH-HH, p. ej. 10-12» | suite `tests/slot-format.test.js` + ejecución real del dev-lead (`salas reservar Norte 1012`) | Pass |
| `free` con franja mal formada falla con el mismo mensaje | suite `tests/free-format.test.js` + ejecución real del dev-lead (`salas libres 1012`) | Pass |

### 4.3 Residuales / deuda generada

- Ningún test cubre `free()` con una franja válida como `10-12` (`reserve` sí la tiene en `tests/slots.test.js`, previo a esta feature) — fila en «Deuda técnica» del roadmap.

## 5. Aprendizajes

- Compartir la validación de la franja entre `reserve` y `free` (`assertSlot`) es ya el comportamiento vigente → fusionado en `capabilities/booking.md` (creada en este cierre, primera feature que toca la capacidad `booking`); no abre convención nueva de `constitution.md`.
- El proyecto no tiene `.claude/skills/` y esta feature no reveló un patrón reutilizable → no aplica.

## 6. Adendas

- _Ninguna todavía._
