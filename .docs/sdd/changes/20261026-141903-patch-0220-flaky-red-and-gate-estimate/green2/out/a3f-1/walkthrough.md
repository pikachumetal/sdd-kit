---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde `motivo no válido: …` — `src/app.js`, `test/cancel.test.js` (c4de91d, 6c294c1).
- `canceladas`: lista `<sala> <día> — <motivo>` de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (6c294c1).
- Capacidad nueva `bookings`, fusionada desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

No hay `.docs/sdd/estimation.md`: sin estimación que comparar.

- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-26T14:47Z, sin 0 min de espera al dev-lead (0 esperas) *(tal cual de `sdd session tokens`: mide la sesión del cierre; la sesión que abrió la feature no deja transcripts en este árbol)*
- Tokens del hilo: 415.593 — claude-sonnet-5-5 415.593
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)

## 3. Desviaciones del plan

- _Ninguna_ en tasks ni en ficheros. La spec numera sus decisiones 1 y 3 (falta la 2): errata de la spec, sin efecto.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` como gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Ninguna config del repo lo fija (el gate de la constitución es `node --test`): fila en la deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → **1 rojo en la primera pasada** (`test/ids.test.js`: «una reserva nueva lleva su id», `TypeError … reading 'trim'`), 5/5 verdes el resto; contrastado sin la rama (`develop`, mismo comando, sin limpiar estado) → 5/5 verde; otra vez en la rama → 6/6 verde, 0,3 s. «No se repite»: flaky, fila en la deuda. Salida guardada en `/tmp/sdd0010/suite.txt`, `suite-develop.txt`, `suite2.txt`.
- Suite con el flag del ruling: `node --test --test-concurrency=1` → 6/6 verde, 0,57 s.
- Revisión final: Spec opus+high limpia, Código sonnet+high limpia, Arquitectura no (plan), sobre 6c294c1. Lo posterior a 6c294c1 solo añade `tasks.md`: sin revisar nada de código.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · suite 6/6 (con una pasada roja flaky ajena, ver 4.1) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 6c294c1. Sin `no probado`; nadie del equipo ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real (`run`, mismo proceso: el almacén es en memoria) | ok |

### 4.3 Residuales / deuda generada

- Test flaky `test/ids.test.js` (estado en `<git-common-dir>/ids-store`): falla la primera vez que corre y pasa después. → deuda.
- Workaround `--test-concurrency=1` sin configurar en el repo. → deuda.
- El almacén en memoria hace que `canceladas` solo vea cancelaciones del mismo proceso: la 0014 («Motivo guardado») ya está en el roadmap.

## 5. Aprendizajes

- Los tests que usan estado fuera del test (`ids-store`) rompen la primera pasada → fila de deuda en `roadmap.md`.
- Sin `architecture.md`, `operations.md` ni `.claude/skills/`: ningún aprendizaje estructural ni patrón de skill que volcar (skills revisadas mirando: la carpeta no existe).

## 6. Adendas

- ADR: ninguna candidata en la spec.
