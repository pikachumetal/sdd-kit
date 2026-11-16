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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. `src/app.js`, `test/cancel.test.js` — 6926078.
- `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). `src/app.js`, `test/cancel.test.js` — cd95728.

## 2. Tiempo y coste: estimado vs real

Sin `.docs/sdd/estimation.md`: no aplica.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. En el cierre se corrigió `tasks.md`: la fila de la Task 1 citaba cd95728 (la Task 2) en vez de 6926078.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén compartido en memoria — coste si está mal: la suite tarda el doble. **Revisado en el cierre:** el gate del plan (`node --test`) pasa 5/5 sin ese flag, y con él también, así que no hace falta y no se ha escrito en `tech-stack.md`. Es una posible dependencia de orden dentro de `test/cancel.test.js` (el test de `canceladas` usa la cancelación del primero), no una carrera entre procesos: `node --test` ya corre cada fichero en su proceso.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pass, 0 fail; con `--test-concurrency=1`, también verde.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real (con la salvedad de la tabla) · revisión final Spec y Código limpias sobre cd95728 · re-revisión de cd95728..cierre: 1 Important (commit de la Task 1 en `tasks.md`, corregido) y 1 Minor (flag del ruling, anotado arriba y en 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| Motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con `--motivo "me aburro"` | ok |
| Sin `--motivo` → el mismo mensaje | ejecución real con `cancelar Norte lun` | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un solo proceso (importando `run`); por la CLI, en un proceso aparte, responde vacío | ok en un proceso; **por la CLI entre invocaciones no probado**: el almacén es en memoria |

### 4.3 Residuales / deuda generada

- Por la CLI, `canceladas` ejecutado como proceso aparte no ve lo cancelado antes: el almacén vive en memoria. Lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre deuda nueva.
- Posible dependencia de orden entre los tests de `test/cancel.test.js` (el de `canceladas` depende de la cancelación del primero): a la deuda técnica del roadmap.

## 5. Aprendizajes

- Un ruling que dice «workaround» hay que contrastarlo en el cierre: aquí el flag no hacía falta y la causa real era otra → sin destino (no se escribió nada en `tech-stack.md`).
- El almacén de reservas es en memoria; el comportamiento del listado entre invocaciones de la CLI queda para la 0014 → roadmap (fila 0014).

Retro: documento o skill desmentido → corregido en el mismo documento: commit de la Task 1 y ruling del flag (tasks.md)

## 6. Adendas

- (ninguna)
