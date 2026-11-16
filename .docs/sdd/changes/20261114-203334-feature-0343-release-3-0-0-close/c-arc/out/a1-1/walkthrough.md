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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 9755f94): el motivo debe estar en la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …». La reserva cancelada guarda su motivo.
- `canceladas` (`src/app.js`, `test/cancel.test.js`, 44b4f6d): lista «sala día — motivo» de las reservas canceladas del proceso.
- Capacidad nueva `bookings` (`capabilities/bookings.md`), fusionada desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde, 0 fallos, ~0,2 s, sobre el commit de cierre (el cierre solo añade documentación a 44b4f6d).
- Gate: `node --test` → suite unitaria: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

Validación en campo: 2026-11-15 · suite 5/5 · smoke 5/5 THEN con ejecución real (CLI `node src/app.js` y `run` en un mismo proceso para `canceladas`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 44b4f6d; el commit posterior solo toca `tasks.md`, sin re-revisión · Arquitectura no revisada (el plan no la pedía) · el dev-lead no detalló qué probó: no hay `Validado`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real; sin test en la suite | ok |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar | ejecución real (mismo proceso) | ok |
| `canceladas` en un proceso nuevo no enseña nada | ejecución real | ok: salida vacía, es el límite que la spec declara hasta la 0014 |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests → fila en «Por triar» de la deuda.
- El THEN «sin `--motivo`» solo lo cubre el smoke, no un test → misma fila.
- Las reservas viven en memoria: `canceladas` solo enseña lo cancelado en el mismo proceso. Ya está en la spec; lo salda la 0014.

## 5. Aprendizajes

- Hasta la 0014 el estado de las reservas es del proceso, no persistente: cualquier comando nuevo que dependa de lo cancelado hereda el límite → ya está en la spec (Approach) y en el roadmap (0014); sin destino nuevo.
- Un test que prepara sus datos con el de otro falla al correr solo → deuda (`debt.md`, «Por triar»).

Retro: sin señales

## 6. Adendas

- (ninguna)
