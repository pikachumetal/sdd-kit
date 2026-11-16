---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `a956c37`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `b95da6c`): comando `canceladas`, una línea «sala día — motivo» por reserva cancelada. `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`.
- **Capacidad** `bookings`: creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge` (no existía el directorio de capacidades).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_. El plan declaraba como gate de cierre `node --test`; el cierre pasó el de `operations.md` §Testing (`node --test test/ && node e2e/run.mjs`), que es el declarado por el proyecto.

### Decisiones tomadas sin el dev-lead

- Task 2: el test unitario `canceladas enseña sala, día y motivo` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. **Comprobado en el cierre**: corrido solo (`--test-name-pattern`) falla; en el gate completo pasa por el orden. Fila de deuda abierta en 4.3.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 en verde; `node e2e/run.mjs` → 7/7 en verde (salida guardada entera).
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → e2e: corrió 7/7 · 48,3 s · configuración: la del gate (sin `E2E_TRACE` ni opciones) · sobre el commit de cierre
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:6179/health` → `ok`, levantado en esta sesión (antes de cada pasada) y parado después por su puerto.
- E2E: 48,3 s de 0,5 min — pasa del presupuesto (deuda en 4.3).
- Tanda: `# Tanda: 3 tests nuevos o cambiados ×3 + 2 los demás de e2e/cancel.e2e.mjs ×1 = 11 ejecuciones · ~1,4 min (7,6 s × 11 ÷ 1)`, 1,4 min reales (84,8 s en cinco invocaciones, porque el runner aplica un único `--repeat-each` por invocación). **11/11 en verde, sin ningún fallo ni tiempo anómalo** (6,0–6,1 s por paso, constante). El alcance es lo que cambia la rama contra `develop`: solo `e2e/cancel.e2e.mjs`; `free.e2e.mjs` no la toca y no entró.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · gate 5/5 unitarios + 7/7 E2E · tanda E2E 11/11 · smoke de los 4 THEN con ejecución real contra el servidor (sesión propia) · revisión final Spec y Código sobre `b95da6c`, limpia (`HEAD` solo añadió `tasks.md`) · no probado: el comando por línea de comandos de `src/app.js` (solo vía servidor y tests).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ✓ |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`me aburro`) + suite + E2E | ✓ |
| sin `--motivo` → el mismo mensaje | ejecución real (solo se probó así: ningún test lo cubre) | ✓ |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | ✓ |

### 4.3 Residuales / deuda generada

- El test unitario `canceladas enseña sala, día y motivo` depende del orden: falla solo. Hace falta estado por test (0014, «Motivo guardado», lo mueve al almacén). Fila en «Por triar».
- La suite E2E tarda 48,3 s con presupuesto de 0,5 min (la traza completa hace que cada paso espere 6 s). Fila en «Por triar».
- «Sin `--motivo`» no tiene test automático: lo cubrió el smoke del cierre. Va en la misma fila que la dependencia de orden.

## 5. Aprendizajes

- Las capacidades de comportamiento viven en un directorio que el proyecto no tenía → `.docs/sdd/capabilities/bookings.md` (creado por `sdd capability merge`).
- Con el estado de `app.js` en memoria del proceso, un test que lee lo que dejó otro solo pasa en orden → `.docs/sdd/steering/debt.md` (Por triar), hasta que 0014 dé estado por test.

Retro: sin señales

## 6. Adendas

- _Ninguna_
