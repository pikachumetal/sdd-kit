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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». Commit `0d065f3` (Task 1).
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas. Commit `512cd29` (Task 2).
- `test/cancel.test.js`: tests de ambos comportamientos.
- `.docs/sdd/capabilities/bookings.md`: creada al fusionar el delta de la spec (capacidad nueva, dos requisitos).

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre la suite pasa también con `node --test` a secas (5/5), que es lo que corre el CI de `develop`; el acoplamiento entre tests queda como deuda.
- Sin review de spec: dos señales (MODIFIED, datos) — ya figuraba en la spec.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5; `node --test --test-concurrency=1` → 5/5. Salida entera guardada en el scratchpad de la sesión.
- Gate: `node --test` → suite: corrió 5/5 · sin gate por tareas (no hay «Suites» en `operations.md`) · <1 s · configuración: la del CI de la base (`node --test`), más una pasada con `--test-concurrency=1` · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 sobre el commit de cierre · smoke de 4 THEN con ejecución real (el cuarto solo en el mismo proceso, ver tabla) · revisión final Spec y Código limpias sobre `512cd29`; el commit posterior (solo `tasks.md`, 17 líneas) revisado en el hilo, sin re-revisión · nadie ha dicho qué probó: no hay `Validado` del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) y `suite` | ok |
| Motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, entrada que falla) y `suite` | ok |
| Sin `--motivo` responde lo mismo | ejecución real (CLI, entrada que falla); sin test propio | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`node -e` con `run`) y `suite`; con la CLI, `canceladas` en un proceso aparte sale **vacío** | ok en proceso; no probado entre procesos |

Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria y cada orden de la CLI es un proceso nuevo: `cancelar` y luego `canceladas` en dos órdenes no enseña la cancelada. No lo cubre esta feature; la fila 0014 («Motivo guardado», guardar el motivo en el almacén de reservas) del roadmap lo trata. El dev-lead decide si la 0010 se da por buena sin ello.
- Los tests de cancelar comparten el almacén en memoria y `canceladas` depende de que `cancelar` haya corrido antes: fila en «Por triar» de `debt.md`.
- `tasks.md` decía `512cd29` para la Task 1; el commit es `0d065f3`. Corregido.

## 5. Aprendizajes

- El motivo de cancelación y su listado son comportamiento observable → `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- Tests que dependen del orden por el almacén compartido → `debt.md` («Por triar»), no `operations.md`: el workaround no se ha escrito en ningún documento vivo.

Retro: documento o skill desmentido → corregido en el mismo documento (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`: la Task 1 es `0d065f3`, no `512cd29`)

## 6. Adendas

- _Ninguna_.
