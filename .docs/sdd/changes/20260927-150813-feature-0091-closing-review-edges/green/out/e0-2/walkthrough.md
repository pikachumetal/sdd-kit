---
id: 20260927-180000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve` valida la franja contra `/^\d{2}-\d{2}$/` y lanza «Franja no válida: usa HH-HH, p. ej. 10-12» — 85b7dfd.
- `src/slots.js`: `free(slot)` aplica la misma validación y el mismo mensaje — 837804e.
- `.docs/sdd/specs/.../tasks.md`: revisión final de rama y minors diferidos — 061cbba.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

_Ninguna._

### Decisiones tomadas sin el dev-lead

_Ninguna._

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test tests/` → 3 tests, 0 fallos · <1s.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona, cierra la feature.»

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con franja inválida falla con «Franja no válida: usa HH-HH, p. ej. 10-12» | ejecución real (`salas reservar Norte 1012`, dev-lead) + suite (`slot-format.test.js`) | OK |
| Consultar libres con franja inválida falla con el mismo mensaje | ejecución real (`salas libres 1012`, dev-lead) + suite (`free-format.test.js`) | OK |

### 4.3 Residuales / deuda generada

- La validación y el mensaje se repiten en `reserve` y `free` (duplicación sin extraer) — deferred minor de la revisión final, sobre 837804e.
- Ningún test cubre una franja válida como `10-12` — deferred minor de la revisión final, sobre 837804e.

## 5. Aprendizajes

- `spec.md` no declaraba el bloque «## Capacidades»: se añadió (`Nuevas: booking`) y se creó `.docs/sdd/capabilities/booking.md` desde la plantilla, fusionando el delta de la spec → `capabilities/booking.md` (nuevo).
- No revela ningún patrón reutilizable nuevo ni desmiente nada de una skill existente → revisión de skills: no aplica (el proyecto no tiene `.claude/skills/`).

## 6. Adendas

_Ninguna._
