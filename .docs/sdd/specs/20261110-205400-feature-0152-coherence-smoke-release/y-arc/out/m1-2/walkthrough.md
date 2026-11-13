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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (09575f0).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (f3ab783).
- `.docs/sdd/steering/architecture.md`: la línea de estructura dice que `src/app.js` también valida el motivo al cancelar (en el commit de cierre).
- Capacidad nueva `bookings`, fusionada del delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite: `node --test` — corre entera tras la fusión de sincronización con la base (la base lleva un commit de adelanto); su resultado y su sha van en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (`node src/app.js` y un proceso único para `canceladas`) · revisión final de Spec y Código limpia · suite sobre la fusión de sincronización (ver 4.1).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del estado que deja el primer test: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Estructural: `src/app.js` valida el motivo al cancelar → `steering/architecture.md` (ya escrito por la 0010).
- Comportamiento observable: cancelar con motivo y listado de canceladas → `capabilities/bookings.md` (fusionado).

Retro: sin señales

## 6. Adendas

- _Ninguna_
