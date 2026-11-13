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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js`, `test/cancel.test.js` (36bd3d1).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (efeb186).
- Capacidad nueva `bookings` creada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`).
- `tasks.md` tenía el commit de la Task 1 como efeb186; corregido a 36bd3d1.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. Anotado en `debt.md` («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde, 0,3 s, sobre el árbol del cierre (salida en el scratchpad de la sesión).
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · sobre el commit de cierre (el cierre solo añade documentación y `ROADMAP.md` a lo verificado).

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus) y Código (sonnet) limpias sobre efeb186; los tres commits posteriores son solo documentación, revisados en el hilo, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`) | verificado por el agente |
| motivo fuera de la lista («me aburro») → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real | verificado por el agente |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real, en un mismo proceso (`run('cancelar')` y `run('canceladas')`) | verificado por el agente |

Nada reportado por el usuario.

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria del proceso: `node src/app.js canceladas` en un proceso nuevo sale vacío. Ya está planificado en la fila 0014 («Motivo guardado»); no se abre deuda.
- Workaround `--test-concurrency=1`: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cambio de comportamiento observable → `capabilities/bookings.md` (fusionado desde el delta de la spec).

Retro: sin señales

## 6. Adendas

- _Ninguna_
