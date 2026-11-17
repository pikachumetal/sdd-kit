---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-19
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `canceladas` lista «sala día — motivo». Commits eb8dcc0 (Task 1) y f891ff1 (Task 2).
- `test/cancel.test.js`: motivo de la lista, motivo fuera de la lista y listado.
- `bookings` (capacidad): fusionados los dos requisitos del delta con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en la spec ni en el plan. Dos tasks, Native, como se planeó.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como fila de deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pasan, 0 fallos · 0,2 s · sobre c508f03 (agente, ejecución real).
- Revisión final (`tasks.md`): Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre f891ff1. Desde entonces HEAD solo añade documentación (18 líneas: `tasks.md` y una palabra de `spec.md`), sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · suite 5/5 · smoke 4/4 THEN con ejecución real (`run()` en un solo proceso, porque el almacén es en memoria; el CLI suelto confirma los dos mensajes de error y el éxito) · revisión final Spec y Código limpia sobre f891ff1. No validado por una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real · suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real · suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real · suite | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren en serie: fila en «Deuda técnica» del roadmap.
- `canceladas` desde el CLI en un proceso nuevo sale vacío (el almacén no persiste entre ejecuciones): lo dice la capacidad («en memoria»); la persistencia es la 0014.

## 5. Aprendizajes

- Los tests comparten estado global y la suite necesita `--test-concurrency=1` → fila de deuda del roadmap (no se escribe en `tech-stack.md`).
- Sin `.claude/skills/` en el proyecto: revisión de skills hecha, no aplica.

## 6. Adendas

