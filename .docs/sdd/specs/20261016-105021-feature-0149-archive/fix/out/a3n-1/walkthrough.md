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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser uno de la lista cerrada (cambio de planes, sala ocupada, otro); si no, o si falta, responde «motivo no válido: …». La reserva cancelada guarda su motivo. `src/app.js`, `test/cancel.test.js` — 565852f.
- `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 58959ea.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 2. Tiempo y coste

Sin `.docs/sdd/estimation.md`: no hay estimación que comparar. Medido con `sdd session tokens`; ojo, cuenta solo la sesión del cierre, no la que implementó.

- Tokens del hilo: 328.581 — claude-sonnet-5-5 328.581
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-16T14:51Z, sin 0 min de espera al dev-lead (0 esperas)

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 verdes · 0,1 s · sha 8d1909b. Con `--test-concurrency=1` también 5/5.
- La suite pasa también sin el workaround en esta ejecución; el test de `canceladas` depende del estado que deja el de `cancelar` (almacén compartido), de ahí la deuda.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · verificación del agente: suite 5/5 · smoke 5/5 THEN con ejecución real sobre `run()` · revisión final Spec y Código sobre 58959ea, limpia (HEAD solo añade `tasks.md`) · no probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`me aburro`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | ok |
| listado enseña el motivo de la reserva cancelada con «sala ocupada» | suite | ok |

### 4.3 Residuales / deuda generada

- Workaround de la suite en serie → fila en «Deuda técnica» del roadmap.
- Se sustituyó el test «cancelar sin reserva lo dice» (de antes de la 0010) por los del motivo: el mensaje `sin reserva <sala> <día>` sigue en el código, pero ya no tiene test. Fila en «Deuda técnica».
- La `spec.md` numera sus decisiones 1 y 3 (falta la 2): no se ha tocado, la spec está aprobada.

## 5. Aprendizajes

- Cambio de comportamiento observable → `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- Almacén de reservas compartido entre tests: sin destino estructural (no hay `architecture.md`) → fila de deuda en el roadmap, no se inventa el documento.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; no aplica, el trabajo no revela ningún patrón reutilizable.

## 6. Adendas

- _Ninguna_
