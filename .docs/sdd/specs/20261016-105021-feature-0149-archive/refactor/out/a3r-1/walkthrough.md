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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo se valida contra la lista cerrada (cambio de planes, sala ocupada, otro) y se guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (50a8c39).
- `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (3789d76).
- Capacidad `bookings` creada con los dos requisitos (no existía `capabilities/`).

## 2. Tiempo y coste

- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-16T12:40Z, sin 0 min de espera al dev-lead (0 esperas) *(solo el cierre: el proyecto no tiene `estimation.md`)*
- Tokens del hilo: 362.960 — claude-sonnet-5-5 362.960
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Pasa a la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` y `node --test --test-concurrency=1` sobre 5a39232 → 5/6 en ambas, falla solo `test/export.e2e.test.js` («TimeoutError: export no respondió en 5000 ms») · ~0,1-0,3 s.
- Contraste sin la rama: el mismo comando en un worktree temporal de `develop` también falla en ese test (4/5). Es la deuda ya registrada en el roadmap; no es de la rama.

### 4.2 Smoke / tests

Validación en campo: 2026-10-16 · suite 5/6 (el fallo es el e2e de exportación, rojo también en `develop`) · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 3789d76; 5a39232 solo cambia `tasks.md` (17 líneas), sin re-revisión · Arquitectura: no (plan).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ok |
| motivo fuera de la lista (`me aburro`) → «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (sin test en la suite) | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite · ejecución real | ok |

### 4.3 Residuales / deuda generada

- Falta un test en la suite para el THEN «sin `--motivo`»; solo lo cubre mi smoke.
- Los tests comparten el almacén en memoria (`canceladas` depende de que `cancelar` corra antes): fila de deuda.

## 5. Aprendizajes

- Workaround de la carrera de tests sobre el almacén compartido → fila en «Deuda técnica» del roadmap. No va a `tech-stack.md`: el proyecto no lo declara allí.
- Skills: el proyecto no tiene `.claude/skills/` (comprobado); sin skill que revisar.

## 6. Adendas

- (ninguna)
