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

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada (bfb7396).
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, que lista «sala día — motivo» de las reservas canceladas (826577f).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,68 h — reloj de 2 sesiones 5,01 h desde 2026-10-08T09:00Z, sin 200 min de espera al dev-lead (2 esperas)
- Desviación: −2,32h (−58%)
- Causa de la desviación (obligatoria si |desviación| > 30%): estimación holgada para dos tasks cortas en el mismo fichero; esperas descontadas: 09:40Z 140 min y 12:40Z 60 min
- Compactación: no
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 369.647 — claude-sonnet-5-5 369.639; claude-sonnet-5 8
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pasan, 0 fallan (verificado por el agente).
- Gate: `node --test` → 5/5 · 0,18 s · configuración: la del gate de cierre del plan · sobre 826577f (el código no ha cambiado desde entonces: los commits posteriores son solo `.docs/`)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 826577f; HEAD solo añadió documentación, sin re-revisión; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en el mismo proceso tras cancelar: `Norte lun — sala ocupada`; en un proceso aparte sale vacío (las reservas viven en memoria hasta la 0014, como dice la spec) |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (el ruling de arriba): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014 → `steering/architecture.md`
- El comportamiento de `cancelar` con motivo y de `canceladas` → `capabilities/bookings.md`

Retro: sin señales

## 6. Adendas

