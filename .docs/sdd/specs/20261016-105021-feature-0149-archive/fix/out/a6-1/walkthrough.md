---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva (`3bc738c`). El comando `canceladas` lista sala, día y motivo (`d71e766`).
- `test/cancel.test.js`: un test por comportamiento (motivo válido, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec.
- `.docs/sdd/decisions/0003-cancel-reason-in-booking.md`: la ADR candidata de la spec.

## 3. Desviaciones del plan

- _Ninguna_ en el código. Un registro se corrigió en el cierre: `tasks.md` daba `d71e766` como commit de la task 1 (es `3bc738c`).

### Decisiones tomadas sin el dev-lead

- Quité de `tasks.md` el ruling «gate con `--test-concurrency=1`». Lo había escrito el hilo para esquivar una «carrera de tests sobre el almacén compartido», pero esa carrera no existe: `node --test` a secas da 5/5 en verde (verificado en el cierre). El gate sigue siendo el de la constitution y el plan, `node --test` — coste si está mal: ninguno, la suite pasa con los dos comandos.
- Dejé como deuda, sin tocar código, el acoplamiento de orden entre los tests de `test/cancel.test.js` — coste si está mal: el test de `canceladas` falla si se ejecuta solo.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 en verde · 0,1 s · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · verificación del agente: suite 5/5 · smoke 4/4 THEN con ejecución real (`run` importado y llamado con las entradas de la spec) · revisión final Spec y Código sobre `d71e766`, limpia · re-revisión del tramo de documentación posterior a `d71e766` con 1 Important (el ruling falso, cerrado en el cierre) y 4 Minor. `no probado`: la ejecución de `canceladas` sin un `cancelar` previo en el mismo proceso, que devuelve vacío por diseño del almacén en memoria.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- Acoplamiento de orden en `test/cancel.test.js` → fila en la deuda técnica del roadmap.
- El ítem 0014 del roadmap («el motivo se guarda en el almacén de reservas») se solapa con esta feature, que ya guarda el motivo en la reserva (ADR 0003). Hay que decidir si 0014 se cierra o se redefine como persistencia; no lo he tocado.
- Las ADR 0001 y 0002 entraron en la rama en `196f1cb` sin ser de esta feature; a la 0002 le faltaba la sección «Confirmación» y se la añadí en el cierre para que `decision check` pase.

ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-in-booking.md

## 5. Aprendizajes

- Un test que solo pasa tras otro es deuda, no una carrera: diagnosticar antes de cambiar el gate → fila de deuda del roadmap.
- Revisión de skills: `.claude/skills/` no existe en el proyecto y esta feature no revela un patrón reutilizable → no aplica.

## 6. Adendas

- (ninguna)
