---
id: 20260927-100000-feature-0012-franja
feature: 0012
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `src/slots.js`: `reserve(room, slot)` valida la franja contra `/^\d{2}-\d{2}$/` y lanza «Franja no válida: usa HH-HH, p. ej. 10-12» si no casa (bd0205f).
- `src/slots.js`: `free(slot)` aplica la misma validación y el mismo mensaje al consultar salas libres (2638016).
- `.docs/sdd/capabilities/booking.md`: creada (primera feature que toca la capacidad `booking`), con los dos requisitos de esta spec.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- _Ninguna_.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 3 pass, 0 fail · 217ms.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · «He probado `salas reservar Norte 1012` y `salas libres 1012`: los dos dan el error de la franja. Vale, funciona, cierra la feature.»

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Reservar con franja inválida falla con «Franja no válida: usa HH-HH, p. ej. 10-12» | ejecución real (dev-lead: `salas reservar Norte 1012`) + suite `tests/slot-format.test.js` | ✅ |
| Consultar libres con franja inválida falla con el mismo mensaje | ejecución real (dev-lead: `salas libres 1012`) + suite `tests/free-format.test.js` | ✅ |

### 4.3 Residuales / deuda generada

- La validación y el mensaje se repiten en `reserve` y `free`; ningún test cubre una franja válida como `10-12` (hallazgo Minor de la revisión final, sdd-kit:effort-high + opus, sobre 2638016) → fila en la tabla de deuda técnica del roadmap.

## 5. Aprendizajes

- `capabilities/` no existía en el proyecto → creada, con `booking.md` calcado de la plantilla del kit.

## 6. Adendas

- _Ninguna_.
