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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de una lista cerrada (cambio de planes, sala ocupada, otro); con otro valor, o sin `--motivo`, responde «motivo no válido: …». Se guarda en la reserva cancelada. Ficheros: `src/app.js`, `test/cancel.test.js` (Task 1, commit 2584d99).
- `canceladas`: lista las reservas con estado cancelada como «<sala> <día> — <motivo>». Ficheros: `src/app.js`, `test/cancel.test.js` (Task 2, commit 362d4f4).
- Capacidad `bookings` creada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`: no existía y la creó el merge desde el delta del spec).
- Changelog (2.x): una entrada en Added y otra en Changed.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código: dos tasks, Native, como decía el plan.

### Decisiones tomadas sin el dev-lead

- El Ruling de la Task 2 (`--test-concurrency=1` en el gate, contra una carrera sobre el almacén compartido) lo decidió el agente sin el dev-lead y nunca se aplicó: `gate.json` sigue sin la opción, y su causa no era una carrera (`node --test` corre cada fichero en su proceso y los tests de `cancel.test.js` van en serie). Lo retiré en el cierre — por qué: dejarlo como registro afirmaba un cambio de gate que no existe — coste si está mal: ninguno en ejecución, el gate sigue como estaba; queda el acoplamiento por orden como deuda.
- Corregí en `tasks.md` el commit de la Task 1 (decía el de la Task 2) — por qué: la re-revisión lo marcó y `git show` lo confirma — coste si está mal: ninguno.

## 4. Verificación

### 4.1 Builds

- La suite corre una sola vez, en el merge de sincronía del paso 6 del cierre (hay otra rama abierta, la 0011, y `develop` va por delante). Su línea `Gate:` y su sha van en el mensaje final del cierre, porque este fichero entra en el commit de cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-11-05 · smoke 4/4 THEN con ejecución real sobre la entrada `node src/app.js` · revisión final Spec y Código limpia sobre 362d4f4 · re-revisión del tramo posterior (solo `tasks.md`) con dos Important de registro, corregidos aquí · suite en el merge de sincronía.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real | verificado por el agente |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un mismo proceso) | verificado por el agente |

Límite que el dev-lead debe saber: el almacén es en memoria, así que `node src/app.js canceladas` en un proceso aparte, sin cancelar antes en ese mismo proceso, no devuelve nada. Ya era así antes de esta feature; lo cubre la fila 0014 del roadmap («Motivo guardado»).

### 4.3 Residuales / deuda generada

- Tests de `cancel.test.js` acoplados por orden (`canceladas` depende del estado que deja el test de cancelar) → fila de deuda en el roadmap.
- Falta el test de `cancelar` sin `--motivo`; el THEN del spec está verificado a mano, no por la suite → fila de deuda en el roadmap.
- El spec dice en «Decisiones» «dos señales (MODIFIED, datos)» pero su delta solo tiene ADDED, y la numeración de esa lista salta del 1 al 3. No se reescribe un spec aprobado; queda anotado aquí.

## 5. Aprendizajes

- Un Ruling que describe un cambio de configuración debe comprobarse contra el fichero que dice cambiar antes de registrarse → sin destino nuevo: es lo que corrigió este cierre en `tasks.md`.

Retro: documento o skill desmentido → corregido en el mismo documento (`tasks.md`: el commit de la Task 1 y el Ruling sin aplicar)

## 6. Adendas

- _Ninguna._
