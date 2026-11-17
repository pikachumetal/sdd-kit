---
id: 20260921-090000-task-0009-slot-format
task: 0009
title: Walkthrough — Validar el formato de la franja horaria
spec: ./spec.md
status: done
created: 2026-09-21
---

# Walkthrough — Validar el formato de la franja horaria

## 1. Cambios realizados

- `src/app.js` (y `src/slots.js` en la 0009).

## 4. Verificación

### 4.2 Smoke / tests

- Validación diferida: 2026-09-21 · «lo valido todo junto en el smoke de la release» · disparador: smoke de la release v0.4.0

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node --test` | verde (verificado por el agente) |

## 6. Adendas

- 2026-09-25 · Validación diferida cumplida en el smoke de la release v0.4.0: el dev-lead probó la franja en `libres`. `reservar` no se mencionó en el smoke; solo la cubren los tests automáticos.
