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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — `0fc3dea`.
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — `26eca93`.
- Capacidad nueva `bookings` con los dos requisitos (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- Sin `.docs/sdd/estimation.md` en el proyecto: no aplica.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, por una carrera supuesta sobre el almacén compartido — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Desmentido en el cierre**: `node --test` sin el flag da 5/5 en tres pasadas, así que el gate no cambia (constitution §2) y el flag no hace falta. Lo que sí hay es una dependencia de orden entre tests (ver 4.3).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, tres pasadas seguidas sin el flag y una con `--test-concurrency=1`.
- Gate: `node --test` → suite: corrió 5/5 · sobre 406ff44 (el commit de cierre solo añade documentación).
- Revisión final: Spec y Código limpias sobre 26eca93; re-revisión de 26eca93..406ff44 (solo documentación) con hallazgos de documentación, resueltos en el cierre (commit de la Task 1, ruling del gate) o del dev-lead (filas 0009 y 0016).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 5/5 THEN con ejecución real (`node src/app.js …`; `canceladas` en un solo proceso, porque el almacén es en memoria) · revisión final Spec y Código sobre 26eca93, re-revisión del tramo documental con hallazgos resueltos. Verificado por el agente; no hay nada reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok; sin test en la suite |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real (un solo proceso) y suite | ok |
| el listado por CLI entre procesos distintos | no probado | el almacén es en memoria: lo cubre la 0014 |

### 4.3 Residuales / deuda generada

- El THEN «sin `--motivo`» no tiene test en `test/cancel.test.js` (solo se probó con ejecución real) — fila en la deuda del roadmap.
- El test de `canceladas` solo pasa si antes corre el de cancelar: depende del orden y del almacén compartido — fila en la deuda del roadmap.

## 5. Aprendizajes

- El gate de cierre sigue siendo `node --test` entero; el flag del ruling no es un aprendizaje, es un diagnóstico desmentido → corregido en `tasks.md` y en 3.
- La capacidad `bookings` nace con esta feature → `.docs/sdd/capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido en el mismo documento (tasks.md)

## 6. Adendas

- _Ninguna_.
