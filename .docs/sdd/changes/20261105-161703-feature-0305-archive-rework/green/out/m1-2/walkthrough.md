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

- **Cancelar con motivo** (Task 1, `28abe37`): `cancelar <sala> <día> --motivo <motivo>` acepta solo la lista cerrada (cambio de planes, sala ocupada, otro). Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `ff3420f`): el comando `canceladas` lista las reservas canceladas como «Norte lun — sala ocupada». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Documentación**: `.docs/sdd/tech-stack.md` dice que `src/app.js` también valida el motivo al cancelar; la capacidad `bookings` nace en `.docs/sdd/capabilities/bookings.md` con los dos requisitos de la spec.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance: dos tasks, Native, como decía el plan. Los dos commits posteriores a la revisión final cambian solo documentación (menos de 20 líneas cada uno) y se han revisado en el hilo.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` y no con `node --test` — esquiva la carrera de los tests sobre el almacén de reservas, que está en memoria y es compartido; es un workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Pasa a la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- La suite completa (`node --test --test-concurrency=1`) corre una sola vez, sobre el merge de sincronización del cierre, porque `develop` lleva un commit por delante de la rama. Su `Gate:` y su sha van en el mensaje final: el walkthrough ya está en el commit de cierre.
- Revisión final: Spec (opus, high) y Código (sonnet, high), limpias, sobre `ff3420f`; Arquitectura no, por el plan.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · smoke de los 4 THEN con ejecución real sobre `src/app.js` (la CLI y, para `canceladas`, `run` en el mismo proceso) · revisión final de Spec y Código limpia sobre `ff3420f` · suite completa tras el merge de sincronización (mensaje final). Nada de esto lo ha probado el dev-lead: todo es verificado por el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, tras cancelar en el mismo proceso |

### 4.3 Residuales / deuda generada

- `canceladas` solo ve lo cancelado en el mismo proceso, porque el almacén está en memoria: desde la CLI, dos invocaciones seguidas no comparten estado. Ya lo cubre la fila 0014 («Motivo guardado») del roadmap; no se abre otra.
- Los tests comparten el almacén en memoria y corren en serie: fila nueva en «Deuda técnica».

## 5. Aprendizajes

- Un cambio de comportamiento observable (cancelar con motivo, listado de canceladas) → `.docs/sdd/capabilities/bookings.md`, con `sdd capability merge`.
- `src/app.js` valida el motivo al cancelar → `.docs/sdd/tech-stack.md` (ya escrito en la rama; sin valores de comportamiento, que viven en la capacidad).
- Los tests de cancelación pisan el almacén compartido en memoria y obligan a `--test-concurrency=1` → fila de «Deuda técnica» del roadmap (no hay `architecture.md` ni destino de plantilla para esto).

Retro: sin señales

## 6. Adendas

- _Ninguna._
