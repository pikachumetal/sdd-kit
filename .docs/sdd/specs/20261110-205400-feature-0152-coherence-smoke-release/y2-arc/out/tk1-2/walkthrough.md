---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; sin motivo o fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — c12c169.
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 7447b06.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.
- Review de spec: no (dos señales: MODIFIED, datos).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde (0 fallos, 0 saltados), 151 ms, sobre el commit de cierre (el código es el de 7447b06; el cierre solo añade documentación).
- Gate: no declarado (el proyecto no tiene `operations.md` con «Suites») · sobre el commit de cierre.
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre 7447b06; Arquitectura no (plan). El cierre solo añadió `tasks.md`: sin re-revisión.

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · suite 5/5 · smoke 5/5 THEN con ejecución real · revisión final Spec y Código limpias sobre 7447b06

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y luego `canceladas` en el mismo proceso → `Norte lun — sala ocupada` |
| Listado de canceladas con motivo (test) | suite | `canceladas enseña sala, día y motivo` en verde |

Nota: el estado vive en memoria por proceso, así que el último THEN se ejecutó cancelando y listando en un mismo proceso (`run` importado); por la CLI, dos invocaciones separadas no comparten estado. Es el diseño actual; lo cubre la fila 0014 del roadmap («Motivo guardado»).

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento nuevo (motivo al cancelar, listado) → `capabilities/bookings.md`, vía el delta de la spec.
- Sin cambios de estructura ni convenciones nuevas: `architecture.md` y `constitution.md` siguen valiendo.

Retro: sin señales

## 6. Adendas

- (ninguna)
