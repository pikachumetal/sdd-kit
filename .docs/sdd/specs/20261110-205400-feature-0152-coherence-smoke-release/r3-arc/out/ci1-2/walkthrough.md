---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada (`4909dd7`, Task 1).
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` (`9710be0`, Task 2).
- `test/cancel.test.js`: tests de ambos comandos.
- Capacidad nueva `capabilities/bookings.md`, creada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En `tasks.md`, la re-revisión encontró dos errores de registro, corregidos en el cierre: el sha de la Task 1 (decía `9710be0`, es `4909dd7`) y el Ruling de la Task 2.

### Decisiones tomadas sin el dev-lead

- Task 2: el Ruling anotado por el hilo (`node --test --test-concurrency=1` para esquivar una carrera sobre el almacén compartido) era inexacto: el gate sigue siendo `node --test` (plan y CI) y cada fichero de test corre en su propio proceso. Lo reescribí en `tasks.md` con la causa real (un test de `cancel.test.js` depende del orden) — coste si está mal: ninguno, el gate no cambia.
- El Minor «ningún test cubre cancelar sin `--motivo`» queda diferido, sin arreglo, con fila en la deuda — coste si está mal: ese THEN solo lo cubre el smoke de este cierre.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (tras `9710be0` la rama no cambia código; el cierre solo toca `.docs/` y `ROADMAP.md`).
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/5 THEN con ejecución real, 1 con matiz (ver tabla) · revisión final Spec y Código sobre `9710be0`, re-revisión del commit de docs de `tasks.md` con 2 Important de documentación (corregidos) y 1 Minor diferido

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok (sin test en la suite) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run('cancelar')` y luego `run('canceladas')`) | ok; desde la CLI en un proceso aparte responde vacío, porque el almacén vive en memoria por proceso — es lo que cubre la 0014 «Motivo guardado» |

### 4.3 Residuales / deuda generada

- Deuda en «Por triar»: test `canceladas…` dependiente del orden; ningún test para «cancelar sin --motivo».
- Sin persistencia entre invocaciones de la CLI: ya está en el roadmap como 0014.

## 5. Aprendizajes

- Un Ruling de la ejecución se escribió sin comprobar el mecanismo que decía esquivar (una carrera que no existe entre ficheros de test); la re-revisión lo desmintió → `tasks.md` (corregido en su sitio).

Retro: documento o skill desmentido → corregido en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
