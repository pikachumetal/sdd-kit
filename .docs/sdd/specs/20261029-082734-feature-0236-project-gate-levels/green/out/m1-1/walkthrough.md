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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) — `src/app.js`, `test/cancel.test.js` (b8da837 / defbc7d).
- Comando `canceladas`: lista sala, día y motivo de las reservas canceladas — `src/app.js` (defbc7d).
- Capacidad `bookings` creada con los dos requisitos de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- Esfuerzo real: no medido para la implementación (la sesión de cierre mide 0,01 h; el trabajo lo hizo otra sesión).
- Compactación: no
- Review de spec: no · hallazgos 0, aceptados 0 (dos señales: MODIFIED, datos)

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.
- En el cierre: `tech-stack.md` citaba `src/rooms.js`, que no existe; lo he corregido a `src/app.js` como única entrada.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → 5/5 en verde, y `node --test --test-concurrency=1` → 5/5 · duración ~0,2 s · configuración: la de la constitución (`node --test` entero) más el ruling de concurrencia · sobre 8a81a18 (antes del commit de cierre).
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre defbc7d. Tras ella solo hay dos commits de documentación de menos de 20 líneas cada uno (`tasks.md`, `tech-stack.md`), sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 · smoke 5/5 THEN con ejecución real (`run()` en un solo proceso y la CLI) · revisión final Spec y Código sobre defbc7d, sin re-revisión (solo documentación después). `no probado`: `canceladas` por CLI en procesos separados, porque el almacén es en memoria y cada proceso arranca vacío.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI y `run`) + suite | ok |
| motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| sin `--motivo` responde lo mismo | ejecución real (CLI y `run`); la suite no lo cubre | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real (`run`, mismo proceso) + suite | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten un almacén en memoria y hay que correrlos en serie: deuda en el roadmap.
- «sin `--motivo`» no tiene test propio: lo cubre solo la ejecución real.

## 5. Aprendizajes

- El almacén de reservas en memoria impide aislar los tests → deuda del roadmap (no hay `architecture.md`; no es un cambio estructural de esta feature).
- Revisión de skills: `.claude/skills/` no existe en el proyecto; no aplica, ningún patrón reutilizable.

## 6. Adendas

- (ninguna)
