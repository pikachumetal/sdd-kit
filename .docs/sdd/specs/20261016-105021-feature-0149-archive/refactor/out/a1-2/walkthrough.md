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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando `canceladas` (2411534, 2483164).
- `test/cancel.test.js`: tests del motivo válido, del motivo fuera de la lista y del listado (2411534, 2483164).
- `bookings` nace como capacidad en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

No hay `.docs/sdd/estimation.md`: el módulo de estimación no está activo.

- Tokens del hilo: 429.574 — claude-sonnet-5-5 429.574
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-16T11:51Z, sin 0 min de espera al dev-lead (0 esperas). Es solo la sesión del cierre: la implementación fue en otra sesión y no se mide aquí.

## 3. Desviaciones del plan

- _Ninguna_ en el código. En el cierre, la spec declaraba `bookings` como «Modificadas» y no existía `capabilities/bookings.md`: se pasó a «Nuevas» (ver abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.
- Al cerrar: `bookings` pasa de «Modificadas» a «Nuevas» en la spec aprobada (el proyecto no tenía `capabilities/`; sin esto `sdd capability merge` no fusiona). Va en «Decisiones» y «Enmiendas» de la spec; los escenarios no cambian — coste si está mal: la capacidad solo recoge el comportamiento de la 0010, no el resto de reservas.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 verdes · 0,18 s · sobre e80b804.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código sobre 2483164, limpia; HEAD solo añadió `tasks.md` (documentación), sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real (`node src/app.js`) | ok |
| motivo fuera de la lista y sin `--motivo` → «motivo no válido: cambio de planes, sala ocupada, otro» | suite (el caso sin `--motivo` no) · ejecución real de ambos | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite · ejecución real (cancelar y listar en el mismo proceso: el almacén es en memoria) | ok |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y corren en serie: fila en la deuda del roadmap.
- El caso «sin `--motivo`» no tiene test propio (lo cubre `undefined` fuera de la lista); verificado a mano.
- 0014 «Motivo guardado» sigue en el roadmap: hoy el motivo vive solo en memoria.

## 5. Aprendizajes

- El comportamiento de cancelar con motivo y de `canceladas` → `capabilities/bookings.md`.
- Un cierre con capacidad declarada «Modificadas» sin fichero falla en `capability merge`: se declara «Nuevas» → `capabilities/bookings.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/` y el trabajo no revela ningún patrón reutilizable: no aplica.
- Sin `architecture.md` ni aprendizaje estructural: no hay nada que volcar ahí.

## 6. Adendas

