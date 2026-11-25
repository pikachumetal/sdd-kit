---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-24
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, 531ccc9).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso (`src/app.js`, `test/cancel.test.js`, 5338b0b).
- Capacidad nueva `capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado en el cierre: `--test-name-pattern canceladas` solo, 0 pass / 1 fail). Fila en la deuda.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, sobre el commit de cierre (el mismo código que la última task; el cierre solo añade documentación).
- Gate: `node --test` → 5/5 · saltada la sincronización de la base (sin remoto; `develop` local).
- Revisión final sobre 5338b0b: Spec (opus+high) limpia · Código (sonnet+high) limpia · Arquitectura no (plan). `HEAD` solo añadió documentación después: sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-24 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre 5338b0b. No probado: `canceladas` desde la CLI en un proceso aparte (sale vacía: las reservas viven en la memoria del proceso hasta la 0014, como dice la spec).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con «me aburro») |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso: `run('cancelar')` y `run('canceladas')`) y suite | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso: `canceladas` solo enseña lo cancelado en el mismo proceso → ya dicho en la spec; lo resuelve la 0014 (sin cambio de docs vivos).
- Comportamiento observable nuevo → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
