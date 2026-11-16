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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` (a8b09e1, Task 1).
- Comando `canceladas`: lista `<sala> <día> — <motivo>` de las reservas canceladas. `src/app.js`, `test/cancel.test.js` (beead2d, Task 2).
- Capacidad nueva `bookings` fusionada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre, `node --test` (el comando del plan y del CI de la base) pasó 3 de 3 veces sin la opción, así que la carrera no se reprodujo; queda como deuda.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 pasan; `node --test` (el gate del plan y del CI) → 5/5 pasan, 3 ejecuciones seguidas.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre (la rama solo añade documentación sobre beead2d)

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke 4/4 THEN con ejecución real (`run` de `src/app.js`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre beead2d; Arquitectura no (plan). Sin validación del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista («me aburro») → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` → el mismo «motivo no válido: …» | ejecución real | ok (sin test propio en la suite) |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1`: fila en la deuda del roadmap.
- «sin `--motivo`» no tiene test en la suite; solo smoke.

## 5. Aprendizajes

- Ninguno estructural ni de convención; la capacidad `bookings` ya recoge el comportamiento → `capabilities/bookings.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; este trabajo no revela un patrón reutilizable → no aplica.

## 6. Adendas

