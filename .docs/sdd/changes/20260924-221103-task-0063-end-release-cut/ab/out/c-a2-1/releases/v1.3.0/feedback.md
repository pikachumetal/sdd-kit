---
release: v1.3.0
title: Acta de release — v1.3.0
created: 2026-09-25
source: sin sesión de feedback
---

# Acta de release — v1.3.0 (2026-09-25)

Fuente: sin sesión de feedback.

## 1. Inventario y triage

_Sin sesión de feedback: no hay peticiones que triar._

## 2. Cambios de requisito detectados

_Ninguno_

## 3. Retro

- **Agregado de la release** (tasks): estimado 7h · real 8,5h (ratio 1,21) según `estimation-log.md`. Patch RSV-109: 1h.
- **Discrepancia de evidencia**: los walkthroughs de RSV-101 y RSV-104 declaran 1h de esfuerzo real cada uno; el estimation-log registra 6h y 2,5h. Sin resolver; el agregado usa el log.
- **Action items de la release anterior**: no existe acta de v1.2.0; no hay nada que comprobar.
- **Qué funcionó**: patch RSV-109 con causa raíz y test de regresión documentados.
- **Qué corregir**: `npm test` ejecuta 0 tests y `src/app.js` solo imprime `salas`, así que "suite verde" no acredita nada; walkthroughs y estimation-log no coinciden en horas.
- **Action items nuevos**:
  - [A1] Reconciliar horas reales de RSV-101/RSV-104 entre walkthrough y estimation-log — ambos ficheros muestran el mismo valor.
  - [A2] Que `npm test` ejecute al menos un test por feature entregada — `node --test` reporta `tests` > 0.
