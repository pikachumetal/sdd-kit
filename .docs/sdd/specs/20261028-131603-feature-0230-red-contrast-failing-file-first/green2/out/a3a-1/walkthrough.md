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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`; un motivo fuera de la lista o sin `--motivo` responde `motivo no válido: …`. Commit f4b86c7 (Task 1).
- `src/app.js`, `test/cancel.test.js`: el comando `canceladas` lista `<sala> <día> — <motivo>` de las reservas canceladas. Commit 4b6dcb9 (Task 2).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada desde el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no · dos señales (MODIFIED, datos), decidido en la spec.

## 3. Desviaciones del plan

- Ninguna en lo implementado. El plan pedía como gate de cierre `node --test`; el gate real del proyecto es `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` (constitution, art. 2) y es el que se ha pasado.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test; coste si está mal: la suite tarda el doble. **No está aplicada en el código**: `gate.json` y `package.json` no llevan el flag y la rama no toca el gate. El ruling consta en `tasks.md`; queda como decisión sin ejecutar y el dev-lead decide si se aplica.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → `bookings:test`: corrió, 5 pasan y 1 en rojo (`test/store.test.js`, «el almacén guarda una reserva», `Error: EBUSY: resource busy or locked, open 'data/bookings.json'`) · `rooms:test`: saltada (la rama no toca sus inputs) · configuración: la del gate · sobre el commit de cierre (el cierre junta el sha corrido).
- Contraste del rojo, por el fichero solo con `node --test test/store.test.js`: verde en la rama (1/1) y verde en un worktree desacoplado de `develop` (b1bf007, tras `npm install`), sin limpiar estado ni cachés. El error es de recurso de la máquina (`EBUSY`), así que no se corrió la tarea entera: «No se repite». Fila de test intermitente abierta en la deuda del roadmap. La tarea `bookings:test` no se ha vuelto a correr entera en verde.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · verificado por el agente: smoke 4/4 THEN con ejecución real (`run()` de `src/app.js` en un solo proceso); gate con `store.test.js` en rojo por `EBUSY`, no se repite (ver 4.1); revisión final de Spec y Código limpia sobre 4b6dcb9, sin cambios de código después. Sin validación del dev-lead: nadie ha probado el comando a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ✅ |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | ✅ |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ✅ |
| sin `--motivo` → la misma respuesta | ejecución real | ✅ |

### 4.3 Residuales / deuda generada

- `test/store.test.js` falla de forma intermitente con `EBUSY` (ver 4.1): fila en «Deuda técnica» del roadmap.
- La fila 0014 del roadmap («Motivo guardado: el motivo de una cancelación se guarda en el almacén de reservas») se solapa con lo que ya hace esta feature, que guarda el motivo con la reserva en memoria. No la he tocado: el dev-lead decide si queda saldada.

## 5. Aprendizajes

- Comportamiento observable nuevo → `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- Sin cambios para `constitution.md`, `architecture.md` (no existe; no hay ningún cambio estructural) ni `tech-stack.md`.
- Revisión de skills: `.claude/skills/` no existe en el proyecto y el trabajo no revela un patrón reutilizable: no aplica.
- ADR: ninguna candidata en la spec.

## 6. Adendas

- _Ninguna._
