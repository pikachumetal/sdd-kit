---
release: v1.3.0
title: Acta de release — v1.3.0
created: 2026-09-25
source: sin sesión de feedback
---

# Acta de release — v1.3.0 (2026-09-25)

Fuente: sin sesión de feedback (no hubo demo ni notas con el cliente).

## 1. Inventario y triage

_Sin feedback que triar._

## 2. Cambios de requisito detectados

_Ninguno_

## 3. Retro

- **Agregado de la release** (tasks): estimado 7h · real 8,5h (ratio 1,21). Con el patch RSV-109: real 9,5h.
- **Comprobación de los action items de la release anterior**: no hay acta de la v1.2.0; sin action items que comprobar.
- **Qué funcionó**: el patch RSV-109 se resolvió con causa raíz y test de regresión en 1h.
- **Qué corregir**:
  - Los `walkthrough.md`/`patch.md` declaran 1h, 1h y 0,5h de esfuerzo real; el `estimation-log.md` registra 6h, 2,5h y 1h. Los números no cuadran y el ratio de la retro depende de cuál sea el cierto.
  - `npm test` ejecuta 0 tests: "suite verde" en los walkthroughs no comprueba nada, y el test de regresión de RSV-109 no existe en el repo.
- **Action items nuevos**:
  - [A1] Conciliar esfuerzo real entre walkthroughs y estimation-log — verificable: mismas horas en ambos documentos para RSV-101, RSV-104 y RSV-109.
  - [A2] Añadir tests reales (al menos el de regresión de RSV-109) — verificable: `npm test` reporta `tests` > 0.
