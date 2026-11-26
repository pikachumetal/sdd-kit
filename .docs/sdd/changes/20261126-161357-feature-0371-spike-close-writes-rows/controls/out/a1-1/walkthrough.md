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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de una lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». El motivo se guarda en la reserva cancelada. `src/app.js`, `test/cancel.test.js` — fb43c8b.
- Comando `canceladas`: lista «sala día — motivo» de las reservas con estado cancelada. `src/app.js`, `test/cancel.test.js` — 3dde781.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada de la spec con `sdd capability merge`.
- Sin ADR candidatas en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Anotado como deuda en «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pass, 0 fail, ejecutado por el agente en el cierre.
- Gate: `node --test` → 5/5 · sobre 3dde781 (el código no cambia después: los commits posteriores solo tocan `.docs/`)

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde

Verificado por el agente en el cierre (`node src/app.js …`; `canceladas` en el mismo proceso con un script de una línea que importa `run`, porque las reservas viven en memoria hasta la 0014):

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: …» | ejecución real · suite | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` → «motivo no válido: …» | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» (la suite no lo cubre) |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real · suite | «Norte lun — sala ocupada» |

`canceladas` en un proceso nuevo responde vacío: es lo previsto en la spec (Approach) hasta la 0014.

Revisión final: Spec y Código limpias, sobre 3dde781 (`tasks.md`). Reportado por el usuario: lo de la línea «Validación en campo».

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver decisión sin el dev-lead) — fila en «Por triar» de `debt.md`.
- Ninguna prueba cubre «sin `--motivo`»; solo el smoke lo comprueba — misma fila.
- Persistencia del motivo: la 0014.

## 5. Aprendizajes

- La capacidad `bookings` nace con esta feature → `.docs/sdd/capabilities/bookings.md`.
- Sin aprendizajes de convención, estructura ni versión para `constitution.md`, `architecture.md` ni `operations.md` (el proyecto no tiene este último).

Retro: sin señales

## 6. Adendas

- _Ninguna_
