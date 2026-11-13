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

- `src/app.js` (Task 1, `2bcf266`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro».
- `src/app.js` (Task 2, `e963be1`): comando `canceladas`, que lista las reservas canceladas como «Norte lun — sala ocupada».
- `test/cancel.test.js`: tres tests (motivo de la lista, motivo fuera de la lista, listado).
- Cierre: este walkthrough, `tasks.md`, la capacidad `bookings` (delta fusionado), la fila 0010 del roadmap y la deuda descubierta.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. (Fila en la deuda, «Por triar».)

## 4. Verificación

### 4.1 Builds

- `node --test` sobre el árbol de la rama: el primer pase dio 5/6 y el segundo 6/6 sin tocar nada. El fallo del primero es `test/ids.test.js` (`TypeError … reading 'trim'`), un test que no toca esta feature y que también falla en `develop` desde estado limpio (ver 4.3). Salida guardada en el scratchpad de la sesión.
- Gate: `node --test` → suite: corrió 6/6 · segundo pase, tras un primer pase 5/6 por `ids.test.js` (ajeno a la rama) · <1 s · configuración: la del plan (§3), sin `operations.md` · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 6/6 en el segundo pase (el primero, 5/6 por `ids.test.js`, que falla también en `develop`) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre `e963be1`, re-revisión del único commit posterior (solo `tasks.md`) limpia · no probado: nada

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) | `Norte lun — sala ocupada`; por CLI, en dos procesos, `canceladas` sale vacío: las reservas viven en memoria (lo cubre la fila 0014 del roadmap) |

### 4.3 Residuales / deuda generada

- `test/ids.test.js` falla en su primer pase en un repo sin `.git/ids-store`: lee ese fichero, fuera del árbol, y hace `undefined.trim()` si no existe. Falla igual en `develop` (worktree desacoplado, estado limpio) y pasa al segundo pase. Fila en «Por triar».
- El test de `canceladas` depende del orden (ruling de la Task 2). Fila en «Por triar».
- Para el dev-lead: el listado `canceladas` no se ve desde la CLI en procesos separados porque el estado no persiste; ya lo cubre la fila 0014 («Motivo guardado»), no hay fila nueva.

## 5. Aprendizajes

- Cancelar con motivo y listado de canceladas son comportamiento observable → `capabilities/bookings.md` (delta fusionado con `sdd capability merge`).
- Sin convención nueva ni cambio estructural: `constitution.md` y `architecture.md` no cambian.

Retro: error que cazaría un chequeo → dos filas en la deuda, con el chequeo (suite dos veces en un clon limpio) como arreglo (.docs/sdd/steering/debt.md)

## 6. Adendas

- (ninguna)
