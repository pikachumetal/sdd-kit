---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, 7f7bc6e.
- `canceladas` lista «sala día — motivo»: `src/app.js`, 298d67f. Tests en `test/cancel.test.js`.
- Cierre: capacidad `bookings` creada con `sdd capability merge`; changelog, roadmap y deuda al día.

## 3. Desviaciones del plan

- Ninguna sobre la spec. La corrección de `tech-stack.md` (ver 4.3) es del cierre.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (Task 2, de `## Rulings` de `tasks.md`).

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → 5/5 pasan, 0 fallan · 1 s · configuración: la del ruling de la Task 2 · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke de los 4 THEN con ejecución real (CLI y un proceso con `run`) · revisión final de Spec y Código limpia sobre 298d67f; HEAD solo añadió documentación (tasks.md y tech-stack.md, cada commit bajo 20 líneas), sin re-revisión. Nadie ha probado a mano más allá de esto.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`me aburro`) + suite | verificado por el agente |
| sin `--motivo` → el mismo mensaje | ejecución real (la suite no lo cubre) | verificado por el agente |
| `canceladas` → «Norte lun — sala ocupada» | suite + ejecución real en un solo proceso | verificado por el agente; por CLI, en procesos separados, sale vacío porque el almacén es en memoria (lo cubre la 0014) |

### 4.3 Residuales / deuda generada

- El workaround `--test-concurrency=1` pasa a la tabla de deuda técnica del roadmap.
- `tech-stack.md` (018e6fe) decía «Entradas: `src/app.js` y `src/rooms.js`», pero `src/rooms.js` no existe: restaurado a «Un solo fichero de entrada: `src/app.js`».
- `sin --motivo` no tiene test propio.

## 5. Aprendizajes

- El almacén en memoria compartido hace que los tests dependan del orden → deuda técnica del roadmap (aislar el almacén por test).
- Skills del proyecto: no aplica, miré y el proyecto no tiene `.claude/skills/`.

## 6. Adendas

- (ninguna)
