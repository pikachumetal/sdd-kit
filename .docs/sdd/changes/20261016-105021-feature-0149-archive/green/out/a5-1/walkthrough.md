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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `src/app.js`, `test/cancel.test.js` (991ed32).
- Comando `canceladas`: lista `<sala> <día> — <motivo>` de las reservas canceladas; `src/app.js`, `test/cancel.test.js` (70b5323).
- Capacidad nueva `bookings` fusionada con `sdd capability merge`.
- Pieza de la 0009 (`parent: 0009`); la 0016 sigue abierta.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en lo que se construye.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` en vez de `node --test` — esquiva la carrera de los tests sobre el almacén compartido en memoria; es un workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. Anotado en `tech-stack.md` y como fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pasan, 0 fallan · 0,17 s · sobre 851d0e4 (la base integrada se comprueba en el merge).
- Revisión final: Spec (opus, high) y Código (sonnet, high) limpias sobre 70b5323; Arquitectura no (plan). Desde entonces solo cambia documentación (roadmap, `parent:` de la spec, `tasks.md`), sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · verificación del agente: suite 5/5 · smoke de los 3 THEN y los 2 AND con ejecución real (módulo y CLI) · revisión final Spec y Código limpias sobre 70b5323. Nada reportado por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite + ejecución real (módulo y CLI) | ok |
| Motivo fuera de la lista (`me aburro`) → «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real (módulo y CLI) | ok |
| Sin `--motivo` → el mismo «motivo no válido…» | ejecución real (módulo y CLI); sin test en la suite | ok |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | suite + ejecución real (mismo proceso) | ok |
| `canceladas` en un proceso nuevo de la CLI, tras cancelar en otro | ejecución real: sale vacío | no probado como requisito: el almacén es en memoria y no persiste entre procesos; es el alcance de la 0014 |

### 4.3 Residuales / deuda generada

- Falta un test del THEN «sin `--motivo`» (verificado a mano, no en la suite).
- Workaround `--test-concurrency=1`: fila en la deuda técnica del roadmap.
- Persistencia del motivo entre procesos: ya planificada como 0014.

## 5. Aprendizajes

- La suite comparte el almacén en memoria y los tests compiten si corren en paralelo → `tech-stack.md` (Testing) y deuda.
- Comportamiento de cancelar con motivo y del listado de canceladas → `capabilities/bookings.md`.
- Skills del proyecto: no aplica, el proyecto no tiene `.claude/skills/` y el trabajo no revela un patrón reutilizable.

## 6. Adendas

- _Ninguna_
