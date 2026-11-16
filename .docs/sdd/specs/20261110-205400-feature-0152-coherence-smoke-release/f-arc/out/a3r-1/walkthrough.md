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

- `cancelar <sala> <día> --motivo <motivo>`: motivo de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — Task 1, commit `2df37a9`.
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — Task 2, commit `821a3b9`.
- Capacidad nueva `bookings` fusionada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Fila en «Por triar» de `debt.md`.

## 4. Verificación

### 4.1 Builds

- `node --test` entero, salida guardada en el scratchpad: 5 de 6 en verde; el único rojo es `test/export.e2e.test.js` («TimeoutError: export no respondió en 5000 ms»), que falla igual sin la rama.
- Contraste del rojo: ese fichero solo, en la rama y en un worktree desprendido de `develop` a la vez: rojo en los dos, mismo error. Está en `debt.md` («Por triar», «revisión de la 0007»).
- Gate: `node --test` → corrió 6/6, 5 verdes y 1 roja (`export.e2e`, preexistente en `develop`) · sobre el commit de cierre (la rama solo añade `.docs/` desde la última task)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (CLI y `run` en un solo proceso, porque las reservas viven en memoria) · suite 5/6, el rojo es de `develop` · revisión final Spec y Código sobre `821a3b9`, limpia; el commit posterior, solo `tasks.md` (17 líneas), revisado en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real | verificado por el agente |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (mismo proceso) | verificado por el agente |

Nada reportado por el dev-lead: no ha dicho qué probó.

### 4.3 Residuales / deuda generada

- `test/export.e2e.test.js` en rojo en `develop`: ya en «Por triar», no es de esta feature.
- Test de `canceladas` dependiente del orden: fila nueva en «Por triar».

## 5. Aprendizajes

- Sin aprendizajes nuevos para los docs vivos; el comportamiento observable está en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
