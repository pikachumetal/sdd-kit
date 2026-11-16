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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (865fc09).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>»: `src/app.js`, `test/cancel.test.js` (6729a6e).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado: con `--test-name-pattern="canceladas"` no pasa). Fila en la deuda.

## 4. Verificación

### 4.1 Builds

- `node --test` sobre el commit de cierre, salida guardada: 6/6 en verde en la rama. Sin gate declarado ni `operations.md`.
- Gate: `node --test` → suite: corrió 6/6 · sobre el commit de cierre
- Una primera pasada de la suite dio rojo en `test/ids.test.js` (`TypeError … reading 'trim'`), un fichero que esta feature no toca. Contrastado: solo, en la rama y en un worktree desacoplado de `develop`, pasa en los dos; la suite entera, también (6/6 rama, 5/5 `develop`). Causa: el test falla en la primera ejecución de un clon, cuando falta `.git/ids-store`, y lo crea. No se repite; fila en la deuda.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 6/6 · smoke 4/4 THEN con ejecución real (CLI) · revisión final Spec y Código limpias sobre 6729a6e; HEAD solo añadió `tasks.md`. Nadie del equipo ha probado el cambio a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real; sin test propio | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en el mismo proceso que la cancelación | `Norte lun — sala ocupada` |

- Las reservas viven en la memoria del proceso (hasta la 0014): `node src/app.js canceladas` en un proceso aparte no enseña nada. Es lo que dice la spec; no es un fallo.

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden (ruling de la Task 2) → deuda, «Por triar».
- `test/ids.test.js` falla en la primera ejecución de un clon → deuda, «Por triar».
- Sin test propio para «sin `--motivo`» (cubierto por la misma validación, pero solo con ejecución real).

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014; `canceladas` solo ve lo cancelado en el mismo proceso → `steering/architecture.md`.
- Un test que reutiliza el estado de otro corre bien en la suite y falla solo: preparar los datos en cada test → deuda «Por triar».

Retro: sin señales

## 6. Adendas

- _Ninguna_
