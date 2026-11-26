---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Task 1, commit `1910020`.
- `src/app.js`: comando `canceladas`, que lista sala, día y motivo de las reservas canceladas. Task 2, commit `d12fc78`.
- `test/cancel.test.js`: un test por comportamiento de cada task.
- Capacidad nueva `capabilities/bookings.md`, con los dos requisitos del delta de la spec.
- Sin ADR: la spec no declara «ADR candidata».

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` (gate de cierre de la constitución) → 5/5 en verde, 0 fallos, en la rama sobre `d12fc78` (el código no cambió desde entonces: los dos commits posteriores son de documentación).
- Gate: `node --test` → suite única: corrió 5/5 · sobre `d12fc78`

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde

Verificado por el agente en el cierre, con una ejecución real de `run` (un único proceso, porque las reservas viven en memoria hasta la 0014):

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real · suite | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`cancelar Sur mar --motivo xyz`, también por la CLI) · suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | «motivo no válido: cambio de planes, sala ocupada, otro»; ningún test de la suite lo cubre |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real · suite | «Norte lun — sala ocupada» |

La suite la cubre salvo el THEN «sin `--motivo`», que solo está en el smoke. Reportado por el usuario: la frase de la validación en campo de arriba, sin más detalle.

### 4.3 Residuales / deuda generada

- Los motivos siguen sin existir en inglés: la fila de `debt.md` queda con lo que falta.
- El test de `canceladas` depende del orden de los tests (ruling de la Task 2): fila en «Por triar».
- Falta un test del THEN «sin `--motivo`»: va en la misma fila de «Por triar».

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → `steering/architecture.md`.
- Los tests de `cancel.test.js` comparten estado entre sí (reservas en memoria) → deuda en `steering/debt.md`, no es una convención nueva.

Retro: sin señales
