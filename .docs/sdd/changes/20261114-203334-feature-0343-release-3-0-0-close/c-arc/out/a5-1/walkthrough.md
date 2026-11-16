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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (Task 1, 8d335fc).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas del mismo proceso: `src/app.js`, `test/cancel.test.js` (Task 2, 93ee178).
- Capacidad `bookings` creada con los dos requisitos ADDED, mezclada con `sdd capability merge`: `.docs/sdd/capabilities/bookings.md`.
- Pieza de la 0009 (`parent: 0009`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pass, 0 fail (verificado por el agente, salida guardada en el scratchpad de la sesión).
- Gate: `node --test` (gate de cierre de la constitución; sin `operations.md` ni «Suites» declaradas) → 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real (el THEN de motivo fuera de la lista y el de sin `--motivo` también con la CLI) · revisión final Spec y Código limpias sobre 93ee178, sin re-revisión: lo posterior son commits de documentación

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI y `run`) + suite | ok |
| motivo fuera de la lista (`xx`, `me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI y `run`) + suite | ok |
| sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI y `run`) | ok |
| `canceladas` tras la cancelación, en el mismo proceso, responde «Norte lun — sala ocupada» | ejecución real (`run` en un proceso) + suite | ok |

Nota: por la CLI, cada invocación es un proceso: `canceladas` solo enseña lo cancelado en el suyo (límite de la spec hasta la 0014), así que ese THEN se probó con `run` en un único proceso.

### 4.3 Residuales / deuda generada

- Acoplamiento entre tests de `test/cancel.test.js` (ver ruling): fila en «Por triar» de `debt.md`.
- Sin test del THEN «sin `--motivo`» en la suite: lo cubre el smoke, no un test.

## 5. Aprendizajes

- Sin aprendizajes nuevos para los documentos vivos; el comportamiento observable vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

_Ninguna_
