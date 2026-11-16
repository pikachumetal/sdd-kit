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

- `src/app.js` y `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada (Task 1, ef32e29). Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» (Task 1).
- `src/app.js` y `test/cancel.test.js`: el comando `canceladas` lista «<sala> <día> — <motivo>» de las reservas canceladas del proceso (Task 2, 1790e6f).
- `migrations/v3.0.0.md`: la línea «**Escribe**» pasa a «`sdd-kit.json`, `operations.md`.», como pedía el scope de la spec.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, creada con `sdd capability merge` desde el delta de la spec (dos requisitos `ADDED`).
- Sin «ADR candidata» en la spec.

## 3. Desviaciones del plan

- _Ninguna_. Plan de dos tasks, ejecutado en Native como decía.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sin fallos ni saltados.
- Gate: `node --test` → corrió 5/5 (el proyecto no declara tareas de gate ni «Suites») · sobre el commit de cierre (el cierre junta el código verificado, que solo difiere en `.docs/`).
- Revisión final: Spec (opus+high) limpia y Código (sonnet+high) limpia; Arquitectura no, porque el plan no la pedía. El commit posterior solo toca una línea de `tasks.md`: sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real (la CLI real para los tres de `cancelar`; `canceladas` en un solo proceso porque las reservas viven en la memoria del proceso hasta la 0014) · revisión final Spec y Código limpia. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, tras cancelar en el mismo proceso |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primero (ruling de la Task 2): fila en «Por triar» de `debt.md`.
- `canceladas` solo enseña lo cancelado en el mismo proceso hasta que la 0014 guarde el motivo en el almacén; ya estaba en la spec.

## 5. Aprendizajes

- Cambio de comportamiento observable: dos requisitos de la cancelación con motivo → `capabilities/bookings.md`.
- Estructura y convenciones: nada que subir a `architecture.md` ni a `constitution.md`; el cambio vive en el único fichero de entrada.

Retro: sin señales

## 6. Adendas

- _Ninguna._
