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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva (`src/app.js`, Task 1, `2c5fb27`).
- Comando `canceladas`: lista sala, día y motivo de las reservas canceladas (`src/app.js`, Task 2, `7ab4723`).
- El motivo se recorta de espacios alrededor antes de validarlo (`reasonOf`, `src/app.js`). Esto no está en la spec: lo pidió un arreglo posterior a la revisión final, juntado en el commit de cierre.
- Test del recorte en `test/cancel.test.js`: «cancelar con un motivo de la lista y espacios alrededor».
- Capacidad nueva `capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el plan. Una en la spec que no es de THEN: el recorte del motivo no estaba en la spec (ver ✋ y 4.3).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.
- Final: se deja `src/app.js` en LF aunque estaba en CRLF — devolver el CRLF reescribiría la historia revisada y el contenido es el mismo — coste si está mal: `git blame` apunta a un solo commit.
- Final: no se enmienda la spec por el recorte del motivo — no cambia ningún THEN: tras recortar solo pasan los tres valores de la lista — coste si está mal: la capacidad no describe que `"  otro  "` se acepta.

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 6/6 en verde, ejecutado por mí sobre el árbol del cierre.
- Gate: `node --test` → corrió 6/6 · sobre el commit de cierre.
- El RED del test nuevo se vio: sin el `.trim()`, `node --test` da 5 pasan / 1 falla; con él, 6/6.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 6/6 · smoke de los THEN con ejecución real (5 de 5 entradas de abajo) · revisión final Spec y Código limpias sobre `7ab4723`; re-revisión del arreglo posterior a la revisión final con 1 Important (el recorte sin test), arreglado con su test, y 2 Minor con ruling · 1 sin revisar (el commit del test, 4 líneas, posterior a la re-revisión) · no probado: el uso por una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |
| (no está en la spec) `--motivo "  otro  "` se acepta; con `--motivo` como último argumento, «motivo no válido…» | ejecución real y suite | ok |

### 4.3 Residuales / deuda generada

- Tests de `test/cancel.test.js` dependientes del orden → «Por triar» de `debt.md`.
- Finales de línea mezclados, sin `.gitattributes` → «Por triar».
- La capacidad `bookings` no dice que el motivo se recorta → «Por triar».
- Spec sin test para «sin `--motivo`» ni «`--motivo` como último argumento» antes de este cierre; el test del recorte cubre el segundo por el camino de `?.trim()`, no el primero.

## 5. Aprendizajes

- El comportamiento nuevo (motivo obligatorio de lista cerrada, listado de canceladas) → `capabilities/bookings.md`.
- Un arreglo posterior a la revisión final que cambia código necesita su test en el mismo commit: la re-revisión lo pilló como Important → `steering/constitution.md` ya lo dice (regla 2); sin cambio.
- Un fichero reescrito entero por un cambio de finales de línea esconde la línea real del diff → fila de deuda sobre `.gitattributes`.

Retro: error que cazaría un chequeo → fila de deuda: un `.gitattributes` que fije los finales de línea (steering/debt.md); sin CLAUDE.md ni operations.md donde poner una línea, y normalizar el repo entero no es de esta feature

## 6. Adendas

- _Ninguna._
