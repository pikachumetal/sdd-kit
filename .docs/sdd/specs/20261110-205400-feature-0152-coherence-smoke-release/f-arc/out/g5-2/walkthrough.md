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

- `src/app.js` (b42e7fe): `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …».
- `src/app.js` (07ec3ca): comando `canceladas`, que lista «sala día — motivo» de las reservas con estado cancelada.
- `test/cancel.test.js`: tres tests (motivo de la lista, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde antes de la sincronización: `bookings:test` 5 pasados, 0 fallidos; `rooms:test` saltada (la rama no toca sus inputs); 1 s, sobre el commit de cierre.
- La base (`develop`) trae un commit después de la rama, que añade un test en `test/rooms.test.js`. La suite validadora corre una vez en la fusión de sincronización (paso 6 del cierre) y su `Gate:` y su sha van en el mensaje final del cierre, porque este fichero ya está en el commit de cierre.
- Revisión final: Spec y Código limpias, Arquitectura no (plan), sobre 07ec3ca. El único commit posterior, de 17 líneas y solo `tasks.md`, lo leí en el hilo (`revisado en el hilo: tasks.md · 17 líneas`) y se junta en el cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · smoke por THEN con ejecución real (4 de 4; el listado, solo en un proceso, ver más abajo) · suite en verde (`bookings:test` 5/5, antes de la sincronización; la de la fusión de sincronización va en el mensaje final) · revisión final Spec y Código sobre 07ec3ca, sin re-revisión: el commit posterior es de documentación.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ✅ responde lo esperado |
| Un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con la entrada que falla | ✅ responde lo esperado |
| Sin `--motivo` responde lo mismo | ejecución real, con la entrada que falla | ✅ responde lo esperado |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`cancelar` y `canceladas` sobre el módulo importado); por la CLI en procesos separados, no probado | ✅ en un proceso · ⚠️ por la CLI suelta imprime una línea vacía: las reservas viven en memoria y cada comando es un proceso nuevo; el almacén lo trae la 0014 («Motivo guardado») |

### 4.3 Residuales / deuda generada

- El listado de canceladas solo se ve con las reservas en memoria del mismo proceso; lo salda la fila 0014 del roadmap, no hay fila de deuda nueva.
- El test de `canceladas` depende del estado que deja el primer test: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento de cancelar con motivo y del listado de canceladas → `.docs/sdd/capabilities/bookings.md` (capacidad nueva, creada por el cierre).

Retro: sin señales

## 6. Adendas

- _Ninguna_
