---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-27
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista, o ninguno, responde «motivo no válido: …». Nuevo comando `canceladas`, que lista «Norte lun — sala ocupada». Commits de las tasks: `1c62097` (task 1) y `68236b4` (task 2).
- `test/cancel.test.js`: los tests de ambos comportamientos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ sobre la spec.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. **Al cerrar: el ruling no está aplicado.** `gate.json` no lleva la opción (ningún commit de la rama lo toca) y la suite pasa sin ella; queda como deuda en el roadmap, junto al almacén compartido que lo motivó.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`, configuración la de `gate.json`. `develop` lleva un commit que la rama no tiene (`test/rooms.test.js`, entrada de `rooms:test`), así que la suite no se corrió antes: corre una sola vez en el merge de sincronización (paso 6 del cierre) y es la suite de la validación. Su resultado, línea `Gate:` por tarea y sha, van en el mensaje final del cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-10-27 · verificación del agente: smoke por THEN con ejecución real (abajo, `node src/app.js cancelar …` y `run()` para el listado) · revisión final de Spec y Código limpia sobre `68236b4`, sin re-revisión (el único commit posterior, `tasks.md`, es solo documentación) · suite: en el merge de sincronización, ver 4.1 · el dev-lead no dijo qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo sala-ocupada`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real (`run("cancelar", …)` y `run("canceladas", [])` en el mismo proceso) | `Norte lun — sala ocupada` |

Un borrador anterior de esta línea daba como humo `--motivo sala-ocupada` como cancelación correcta; esa entrada responde «motivo no válido» y se ha corregido.

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria del proceso: `canceladas` en una ejecución aparte de `cancelar` sale vacío. Solo se ve el listado dentro de un mismo proceso (como hacen los tests). Lo cubre la fila 0014 «Motivo guardado» del roadmap.
- El almacén en memoria compartido entre tests y el ruling sin aplicar: fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El comportamiento nuevo → `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- La carrera de tests sobre el almacén en memoria → deuda técnica del roadmap (no es una convención ni un cambio estructural: no toca `constitution.md` ni `tech-stack.md`; el proyecto no tiene `architecture.md` y no hay nada estructural que anclar).
- Revisión de skills: no aplica; miré y el proyecto no tiene `.claude/skills/`, y esta feature no revela un patrón reutilizable.

## 6. Adendas

- _Ninguna_
