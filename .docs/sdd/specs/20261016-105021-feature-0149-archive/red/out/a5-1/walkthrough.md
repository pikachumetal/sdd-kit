---
id: 20261016-170000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Comando nuevo `canceladas`, que lista las reservas canceladas con su motivo (56a3fa9).
- `test/cancel.test.js`: tres tests (motivo de la lista, motivo fuera de la lista, listado) (56a3fa9).
- Documentación: la capacidad `bookings` nace en `capabilities/bookings.md`; `tech-stack.md`, changelog y roadmap puestos al día.
- La 0010 es pieza de la 0009 (`parent: 0009`); la 0009 sigue ⏳ hasta que cierre la otra mitad.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate de cierre es `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Vuelcado en `tech-stack.md` y en la deuda técnica del roadmap.
- Minor diferido de la re-revisión: la fila 0016 «Fotos de las salas» cuelga de la 0009 «Cancelaciones con motivo» sin relación aparente. No lo he cambiado, porque la partición es del dev-lead: confirmar si el hermano de la 0010 es otro id (¿0014?).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 en verde, 0,2 s.
- Revisión final sobre 56a3fa9: Spec (opus + high) limpia · Código (sonnet + high) limpia · Arquitectura no (plan). Re-revisión del tramo 56a3fa9..8453e2d (solo documentación: roadmap pasa de CRLF a LF y `parent: 0009`), `sdd-kit:effort-high` + opus: sin Critical ni Important, un Minor diferido.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre 56a3fa9, re-revisión limpia. No probado por una persona: nadie ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real | OK |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real (`--motivo "me aburro"`) | OK |
| Sin `--motivo` responde lo mismo | ejecución real; sin test en la suite | OK |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real | OK |

### 4.3 Residuales / deuda generada

- Falta un test que fije el THEN «sin `--motivo`»: hoy solo lo cubre la ejecución real.
- Deuda: los tests comparten el almacén en memoria y obligan a `--test-concurrency=1` → fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El gate de tests va en serie por el almacén compartido → `tech-stack.md` (§Testing) y deuda técnica del roadmap.
- El comportamiento nuevo (motivo y listado) → `capabilities/bookings.md`, fusionado con `sdd capability merge`.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; esta feature no revela ningún patrón reutilizable.

## 6. Adendas

_Ninguna._
