---
id: 20260927-000000-feature-0012-franja
feature: "0012"
title: Walkthrough — Validar el formato de la franja
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Validar el formato de la franja

## 1. Cambios realizados

- `reserve(room, slot)` en `src/slots.js` lanza «Franja no válida: usa HH-HH, p. ej. 10-12» si la franja no casa con `/^\d{2}-\d{2}$/` — commit `9fc88d4`.
- `free(slot)` en `src/slots.js` aplica la misma validación — commit `588f557`.
- Revisión final de rama sobre `588f557`: Ready (0 Critical, 0 Important, 2 Minor).
- Tras presentar la validación, el dev-lead preguntó por qué la validación se repetía en `reserve` y `free`. Refactor: se extrae `assertSlot(slot)` y la usan ambas funciones, mismo mensaje y comportamiento observable — commit `8235580`.

## 3. Desviaciones del plan

- _Ninguna_ que cambie la spec: el plan preveía dos tasks independientes con la validación inline en cada una; compartirla en `assertSlot` no cambia ningún GIVEN/WHEN/THEN, es un ruling.

### Decisiones tomadas sin el dev-lead

- Ruling: refactor de `8235580` (compartir `assertSlot` entre `reserve` y `free`) registrado como ruling, no como enmienda — no cambia comportamiento observable, solo resuelve el minor de duplicación diferido en la revisión final.
- Ruling: el commit `8235580` llegó después de presentar la validación al usuario, así que se abrió una re-revisión del tramo `588f557..8235580` antes de invocar el cierre. El despacho del revisor final no estaba disponible en esta campaña; la re-revisión la hizo el hilo principal en su lugar (Ready, 0/0/0) — coste si está mal: un problema de diseño en el refactor pasaría sin una segunda mirada independiente; mitigado porque el diff es mínimo y mecánico (extraer una función, sin cambio de lógica).

## 4. Verificación

### 4.1 Builds

- `node --test tests/` → 3 pass, 0 fail · 172 ms.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-27 · probó `salas reservar Norte 1012` y `salas libres 1012` sobre el commit `8235580`; los dos dan el error de franja esperado. La CLI `salas` no está en este worktree (no hay `package.json` ni bin), así que esta ejecución solo la reportó el dev-lead, no se repitió en la sesión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La franja se valida al reservar | ejecución real (dev-lead) | Falla con «Franja no válida: usa HH-HH, p. ej. 10-12» |
| La franja se valida al consultar libres | ejecución real (dev-lead) | Falla con el mismo mensaje |

### 4.3 Residuales / deuda generada

- Ningún test cubre una franja válida como `10-12` (minor diferido en la revisión final, sin resolver todavía) → fila de deuda técnica en el roadmap.

## 5. Aprendizajes

- Comportamiento observable de reserva/consulta de franjas volcado en la capacidad nueva `capabilities/booking.md` (no existía `capabilities/` en el proyecto; creada en este cierre).
- `spec.md` de esta feature no traía el bloque «## Capacidades» que pide la plantilla vigente; se añadió en el cierre para que `Test-Capabilities.ps1 -Artifact` pudiera validar el delta.

## 6. Adendas

- _Ninguna._
