---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelBooking` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)»; `--motivo` se lee con `reasonOf`. Commit 9aceaa7.
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas canceladas. Commit 62cd0bf.
- `test/cancel.test.js`: pruebas de ambos comportamientos.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con el delta de la spec (2 requisitos).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el código no cambió desde la última task).
- Gate: saltada (el proyecto no declara gate ni «Suites»; la suite completa `node --test` corrió entera) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 5/5 THEN con ejecución real (importando `run` en un mismo proceso y por la CLI) · revisión final Spec y Código limpias sobre 62cd0bf; HEAD solo añadió documentación después

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde el aviso | ejecución real + suite | `cancelar Sur mar --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` (CLI y `run`) → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | `Norte lun — sala ocupada` (tras cancelar en el mismo proceso) |

Las filas de «motivo fuera de la lista» y «sin --motivo» son los dos AND del primer requisito; el segundo requisito es la última fila.

### 4.3 Residuales / deuda generada

- Sin test para «sin `--motivo`»: solo lo cubre la ejecución real → deuda en «Por triar».
- El test de `canceladas` depende del orden de los tests (ruling de §3) → deuda en «Por triar».
- Las reservas viven en memoria: `canceladas` solo enseña lo cancelado en el mismo proceso, y por la CLI `canceladas` suelta sale vacío. Lo cubre la 0014 (spec, «Approach»).

## 5. Aprendizajes

- Ninguno que cambie un documento vivo: el comportamiento nuevo está en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _(ninguna)_
