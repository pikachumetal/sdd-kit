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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: …». El motivo se guarda con la reserva cancelada (`src/app.js`, `test/cancel.test.js`, 08b14f4).
- `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso (`src/app.js`, `test/cancel.test.js`, 61eb04b).
- Capacidad `bookings` creada con las dos exigencias de la spec (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado en el cierre: con `--test-name-pattern="canceladas"` falla). Deuda abierta en «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test test/` entero: 6/6 en verde, sobre el commit de cierre (el cierre solo junta documentación sobre el código de 61eb04b).
- Gate: `node --test test/` → 6/6 · sobre el commit de cierre. El proyecto no declara `operations.md` ni tareas de gate: no hay otro comando.
- Primera pasada roja, no reproducida: `test/ids.test.js` falló una vez con `TypeError [Error]: Cannot read properties of undefined (reading 'trim')` (el test lee `<git-common-dir>/ids-store`, que aún no existía). Contraste: el fichero solo y la tarea entera en la rama (1/1 y 6/6) y en un worktree desacoplado de `develop` (1/1 y 5/5), todo en verde, sin limpiar estado. El test es de f7ea6ab, anterior a la rama. Deuda abierta en «Por triar».

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 6/6 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 61eb04b.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en el mismo proceso (la reserva vive en memoria hasta la 0014; en procesos separados no hay estado compartido, como dice la spec) | ok |

### 4.3 Residuales / deuda generada

- Test intermitente `test/ids.test.js` (estado en `.git/ids-store`) → «Por triar» de `debt.md`.
- `canceladas` depende del orden de los tests → «Por triar» de `debt.md`.
- El motivo no sobrevive al proceso: ya planificado en la 0014.

## 5. Aprendizajes

- Un test no deja estado fuera del proceso ni depende de otro test: dos tests de esta feature lo incumplían y solo fallan en la primera pasada o solos → `steering/constitution.md` (norma 5).

Retro: error que cazaría un chequeo → una norma en la constitución y dos filas de deuda (`.docs/sdd/steering/constitution.md`, `.docs/sdd/steering/debt.md`)

## 6. Adendas

- _Ninguna_
