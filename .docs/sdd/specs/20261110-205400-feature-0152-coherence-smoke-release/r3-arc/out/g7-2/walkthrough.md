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

- **Cancelar con motivo** (`b706fb2`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`4da2327`): `canceladas` lista las reservas con estado cancelada como «<sala> <día> — <motivo>». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Fuera del plan**: script `cancelar` en `package.json` (`npm run cancelar -- <sala> <día> --motivo <motivo>`), commit juntado en el cierre.
- Capacidad `bookings` creada con `sdd capability merge` (`capabilities/bookings.md`, dos requisitos).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- Un script en `package.json` que el plan no pedía.

### Decisiones tomadas sin el dev-lead

- Script `cancelar` en `package.json` — atajo para ejecutar el comando de la spec sin escribir `node src/app.js` — coste si está mal: un script de una línea que se borra.
- Task 2, Ruling `--test-concurrency=1` en el gate — **retirado en el cierre**: nunca se aplicó (`gate.json` y `scripts/gate.mjs` no cambian en la rama) y la carrera que decía esquivar no se reproduce (suite entera 8 de 8 sin ello). Queda como decisión declarada y no ejecutada.

## 4. Verificación

### 4.1 Builds

- `node --test test/app.test.js` → 2/2, sobre el commit de cierre.
- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · menos de 1 s · configuración: la del gate · sobre el commit de cierre. Repetido 8 veces sin fallos.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 2/2 y gate 6/6 · smoke 2/2 THEN, uno por CLI y otro en proceso (ver tabla) · revisión final Spec y Código limpias sobre `4da2327` · re-revisión de `4da2327..cierre` con 1 Important y 2 Minor, los tres de `tasks.md` y resueltos en el cierre · lo verificado lo hizo el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar …`) | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | ok; sin test propio en `test/cancel.test.js` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y `run('canceladas', …)` importados de `src/app.js`) | ok; **no probado por la CLI en dos invocaciones**: el almacén es la memoria del proceso y `node src/app.js canceladas` suelto responde vacío |

### 4.3 Residuales / deuda generada

- Las cancelaciones no sobreviven al proceso: cada `node src/app.js …` empieza de cero. Ya lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre deuda.
- `test/cancel.test.js`: falta el test de «sin `--motivo`», y el test de `canceladas` depende del estado que deja el anterior del mismo fichero. Fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El almacén de reservas vive en la memoria del proceso: hasta la 0014 la CLI no conserva nada entre invocaciones → `steering/architecture.md`.

Retro: documento o skill desmentido → corregido en el mismo documento, el Ruling de `--test-concurrency=1` retirado (`tasks.md`)

## 6. Adendas

- _Ninguna._
