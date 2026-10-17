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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (`cambio de planes`, `sala ocupada`, `otro`) y lo guarda con la reserva cancelada; el comando `canceladas` lista las reservas canceladas con su motivo. Task 1 en 186d3ba (cancelar con motivo), Task 2 en 6b742cd (listado de canceladas).
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada desde el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

> El proyecto no tiene `.docs/sdd/estimation.md`: no hay estimación ni log que calibrar. Se dejan las líneas medidas.

- Tipo: backend
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-16T14:51Z, sin 0 min de espera al dev-lead (0 esperas) *(solo cuenta la sesión del cierre)*
- Modelo del hilo: Sonnet 5.5, effort no registrado
- Tokens del hilo: 454.359 — claude-sonnet-5-5 454.359
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. El gate de cierre del plan era `node --test`; la ejecución usó `node --test --test-concurrency=1` (ver el ruling).

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pasan, 0 fallos · 170 ms · sobre 603ba5e (ejecutada por el agente en el cierre).
- Revisión final: Spec (opus+high) y Código (sonnet+high), limpias, sobre 6b742cd; Arquitectura no (lo decidía el plan). Desde 6b742cd solo cambian documentos (`spec.md` +1 línea, `tasks.md`, `roadmap.md`), sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI para el comando `cancelar`; el listado en un solo proceso, porque el almacén es en memoria) · revisión final Spec y Código sobre 6b742cd, limpias. El dev-lead no ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + ejecución real | ok |
| Un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real | ok |
| Sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (la suite no lo cubre) | ok |
| Tras cancelar con «sala ocupada», `canceladas` responde «Norte lun — sala ocupada» | suite + ejecución real | ok |

### 4.3 Residuales / deuda generada

- Falta un test que cubra el THEN «sin `--motivo`»: hoy solo lo prueba el smoke de este cierre.
- Los tests comparten el almacén en memoria y por eso corren con `--test-concurrency=1` → fila en «Deuda técnica» del roadmap.

## 5. Aprendizajes

- El almacén de reservas compartido en memoria obliga a serializar los tests → deuda del roadmap (no es un valor de comportamiento: no va a `tech-stack.md`).
- Revisión de skills: el proyecto no tiene `.claude/skills/` y este trabajo no revela un patrón reutilizable → no aplica.
- ADR: la spec no declara ninguna candidata → ninguna.

## 6. Adendas

- (ninguna)
