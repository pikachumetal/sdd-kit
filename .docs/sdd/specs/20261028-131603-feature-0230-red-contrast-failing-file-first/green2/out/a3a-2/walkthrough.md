---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista o ausente responde «motivo no válido: …» — commit f2905f5.
- `src/app.js`: comando `canceladas`, que lista las reservas canceladas como «Norte lun — sala ocupada» — commit 6bfc5a0.
- `test/cancel.test.js`: tests de la cancelación con motivo, con motivo fuera de la lista y del listado.
- `.docs/sdd/capabilities/bookings.md`: capacidad creada al fusionar el delta de la spec (2 requisitos).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No quedó aplicado**: `gate.json` no lleva el flag; pasa a la deuda.

## 4. Verificación

### 4.1 Builds

- `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió, 5 pasan y 1 falla (`test/store.test.js`, `Error: EBUSY: resource busy or locked, open 'data/bookings.json'`) · rooms:test: saltada (sus inputs no cambian respecto a `develop`) · sobre el commit de cierre.
- Contraste del rojo: `node --test test/store.test.js` solo, en la rama y en un worktree desvinculado de `develop` (3943f98), sin limpiar estado: en verde en los dos (1/1 y 1/1). No se repite: el test falla la primera vez que corre en un repo sin `store-lock` (deuda de tests flaky en `roadmap.md`).
- Gate: `node scripts/gate.mjs run bookings:test rooms:test` (sin filtro, tras el contraste) → bookings:test: corrió 6/6 · rooms:test: corrió 1/1 · configuración: la del gate, sin `--affected` · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · gate sin filtro 7/7 tras contrastar el rojo de `store.test.js` (no se repite) · smoke 4/4 THEN con ejecución real, el listado en el mismo proceso · revisión final Spec y Código sobre 6bfc5a0, sin re-revisión (el commit posterior solo toca `tasks.md`, 17 líneas). `no probado`: `canceladas` desde un proceso nuevo, porque el estado vive en memoria (lo cubre la 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ✅ |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real (`--motivo "me aburro"`) | ✅ |
| Sin `--motivo` responde lo mismo | ejecución real (sin test automático) | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real (cancelar y listar en el mismo proceso) | ✅ |

### 4.3 Residuales / deuda generada

- Test flaky `test/store.test.js` («el almacén guarda una reserva»): falla la primera vez sin `store-lock` → deuda en `roadmap.md`.
- Ruling de la Task 2 sin aplicar en `gate.json` → deuda en `roadmap.md`.
- Sin test automático de `cancelar` sin `--motivo` → deuda en `roadmap.md`.

## 5. Aprendizajes

- El almacén en memoria hace que cada invocación de la CLI parta vacía; el motivo no sobrevive entre procesos → fila 0014 del roadmap («Motivo guardado»).
- El test del almacén falla en la primera pasada de un repo limpio → fila de deuda de tests flaky en `roadmap.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/` y el trabajo no reveló un patrón reutilizable ni desmintió ninguna skill → no aplica.
- Sin ADR: la spec no declara ninguna candidata.

## 6. Adendas

- _Ninguna_
