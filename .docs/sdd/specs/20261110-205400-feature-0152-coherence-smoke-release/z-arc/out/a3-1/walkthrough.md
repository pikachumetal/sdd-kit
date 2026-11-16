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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada (a9b21e9). Sin motivo, o fuera de la lista, responde «motivo no válido: …».
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» (7021a46).
- `test/cancel.test.js`: tests de ambos comandos.
- `.docs/sdd/capabilities/bookings.md`: creada al fusionar el delta de la spec (capacidad nueva).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, 0 fallos (agente, sobre el commit de cierre; el cierre solo añade documentación a 7021a46).
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · verificada por el agente: suite 5/5 · smoke 4/4 THEN con ejecución real (salidas abajo) · revisión final Spec y Código limpias sobre 7021a46; el commit posterior solo toca `tasks.md`. El dev-lead no ha probado a mano: lo de arriba lo ejecuté yo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`--motivo xyz`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real (en un mismo proceso con `run()`) · suite | ok |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria del proceso: lanzar `node src/app.js canceladas` en una invocación aparte de `cancelar` no muestra nada. El THEN se cumple dentro de un proceso; el almacén es la fila 0014 «Motivo guardado» del roadmap.
- Test de `canceladas` acoplado al primero (ver ruling de §3) → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Nada estructural ni de convención: el comportamiento nuevo vive en `capabilities/bookings.md` → capabilities/bookings.md

Retro: sin señales

## 6. Adendas

- _ninguna_
