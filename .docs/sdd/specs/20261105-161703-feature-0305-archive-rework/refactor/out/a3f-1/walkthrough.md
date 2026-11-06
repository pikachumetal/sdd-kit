---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de estar en la lista cerrada (cambio de planes, sala ocupada, otro); con uno fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro». Commit `41cd12a` (Task 1).
- `src/app.js`, comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas. Commit `6d97b60` (Task 2).
- `test/cancel.test.js`: los tres casos de la spec que tienen test (motivo válido, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. El gate de cierre es el del plan, `node --test`.

### Decisiones tomadas sin el dev-lead

- Task 2: gate `node --test --test-concurrency=1` para esquivar una carrera sobre el almacén en memoria — **retirada en el cierre**: la re-revisión mostró que el diagnóstico no se sostiene (`node --test` ya aísla cada fichero en su proceso, y dentro de `cancel.test.js` los tests corren en orden) y el flag no cambia ningún resultado — coste de haberla dejado: un gate verde por una razón distinta de la registrada y una deuda apuntando al sitio equivocado.
- En el cierre: corregí en `tasks.md` la fila de la Task 1 (`6d97b60` → `41cd12a`) y reescribí ese Ruling; son registros del cierre, no cambian código.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 6/6 · ~1,3 s · configuración: la del gate (la misma con y sin `--test-concurrency=1`) · sobre el commit de cierre. El código no cambia desde `6d97b60`; el cierre solo toca `.docs/`.
- Primera pasada, en rojo: 5/6, falla `test/ids.test.js` («una reserva nueva lleva su id», `TypeError … 'trim'`). Contraste: el fichero solo pasa en la rama y en `develop`; en un clon limpio de `develop` falla la primera vez y pasa la segunda, porque lee y escribe `ids-store` en el git-common-dir. Es de `500ffa1`, anterior a la rama, y la rama no lo toca. Con ese estado ya creado, la suite entera pasa 6/6. Va a deuda (4.3).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 6/6 (tras el contraste del rojo previo de `ids.test.js`) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre `6d97b60`, re-revisión del tramo `6d97b60..11fbc37` con 1 Important y 1 Minor, ambos de `tasks.md` y corregidos aquí · no probado: `canceladas` desde otro proceso (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real, con `--motivo "me aburro"` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real; sin test en la suite | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, `cancelar` y `canceladas` en el mismo proceso (`node -e` importando `run`) | `Norte lun — sala ocupada` |

Verificado por mí: las cuatro filas. Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- `test/ids.test.js` falla la primera vez en un clon limpio: fila nueva en «Deuda técnica» del roadmap.
- `canceladas` depende de que `cancelar` haya corrido antes en el mismo proceso: el almacén es la lista en memoria de `src/app.js`. Desde la CLI, `node src/app.js canceladas` en otro proceso sale vacío. Es el límite que ya recoge el ítem 0014 del roadmap («Motivo guardado»); además, fila de deuda para aislar el almacén por test.
- Sin `--motivo` no tiene test en la suite: lo cubre el smoke, no la suite.
- La lista «Decisiones que he tomado yo» de la spec salta del 1 al 3: cosmético, sin tocar.

## 5. Aprendizajes

- Cancelar con motivo y el listado de canceladas son comportamiento observable → `.docs/sdd/capabilities/bookings.md`.
- Un rojo atribuido a una carrera sin contrastarlo acabó como Ruling que cambiaba el gate del plan; la causa real era un test con estado en `.git` → deuda del roadmap (test hermético).

Retro: error que cazaría un chequeo → test hermético para `ids.test.js`, en la deuda del roadmap (`.docs/sdd/roadmap.md`)

## 6. Adendas

- _Ninguna._
