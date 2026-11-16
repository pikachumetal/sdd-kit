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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva (d98fb54).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (d946b05).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, fusionada del delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Sin `estimation.md` en el proyecto: no hay bloque de tiempo.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test`: primer pase 5/6, rojo en `test/ids.test.js` (no toca esta rama); segundo pase 6/6, sobre e7dc6db. Salida en el scratchpad (`suite-0010.txt`, `suite-0010-b.txt`).
- Contraste del rojo: `node --test test/ids.test.js` verde en la rama y en un worktree desvinculado de `develop` (4dd6aa1); la suite entera, 5/5 en la base. Línea de error del primer pase: `TypeError [Error]: Cannot read properties of undefined (reading 'trim')` (`test/ids.test.js:12`). Causa, por el código del test: lee `ids-store` en el directorio común de git, y solo existe tras la primera ejecución. No se limpió el estado para reproducirlo; no se repite, y va a la deuda.
- Gate: `node --test` → suite entera: corrió 6/6 · sobre e7dc6db

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 6/6 (tras el rojo que no repite de `ids.test.js`) · smoke de 3 THEN con ejecución real, 1 de ellos en un solo proceso · revisión final Spec y Código sobre d946b05, limpia; HEAD solo añade `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Sur mar --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en un solo proceso (`import { run }`) | `Norte lun — sala ocupada` |
| `canceladas` por la CLI, tras un `cancelar` en otro proceso | ejecución real | salida vacía: las reservas viven en memoria; lo cubre la 0014 (motivo guardado) |

### 4.3 Residuales / deuda generada

- `test/ids.test.js` rojo la primera vez que corre en un repo: depende de `ids-store` en el directorio común de git. Fila en «Por triar».
- `test/cancel.test.js` depende del orden de sus tests (el ruling de la Task 2). Fila en «Por triar».
- El listado `canceladas` no sobrevive entre invocaciones de la CLI: es la 0014, ya en el roadmap.

## 5. Aprendizajes

- Los THEN de un comando que lee estado no se verifican con dos invocaciones de la CLI mientras el almacén sea memoria → 0014 (roadmap).
- Capacidad `bookings` creada → `capabilities/bookings.md`.

Retro: error que cazaría un chequeo → fila de deuda con el chequeo propuesto: correr cada fichero de test aislado y en orden distinto (.docs/sdd/steering/debt.md)

## 6. Adendas

- _Ninguna_
