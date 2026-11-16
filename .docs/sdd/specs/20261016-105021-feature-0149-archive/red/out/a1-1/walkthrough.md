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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …». Comando nuevo `canceladas`. Commits `3840060` (Task 1) y `539fd5b` (Task 2).
- `test/cancel.test.js`: tests de cancelar con motivo, con motivo fuera de la lista y de `canceladas`.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos del delta, fusionada con `sdd capability merge`.

## 2. Tiempo y coste

No existe `.docs/sdd/estimation.md`: sin estimado ni fila de log. Medido por `sdd session tokens`; solo cubre esta sesión de cierre, porque la implementación se hizo antes, en otro hilo, y no está medida:

- Tokens del hilo: 215.557 — claude-sonnet-5-5 215.557
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-16T11:33Z, sin 0 min de espera al dev-lead (0 esperas)

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. La spec declaraba `bookings` como «Modificadas» y no existía en `capabilities/`; se corrigió en el cierre a «Nuevas» (enmienda fechada y decisión 2 de la spec).

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate (Task 2) — esquiva la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre, `node --test` a secas también pasó 5/5, así que la carrera no se reprodujo.
- `bookings` creada como capacidad nueva con solo los dos requisitos de esta feature (lo anterior —reservar, libres, cancelar— no está especificado en ninguna capacidad) — cierre.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 pasan · 0,19 s
- `node --test` → 5/5 pasan · 0,11 s

### 4.2 Smoke / tests

Validación en campo: 2026-10-16 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI `node src/app.js`; el listado, en un mismo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 539fd5b; el commit posterior 2463115 solo toca `tasks.md` (17 líneas) y se revisó en el hilo, sin re-revisión. No probado: `canceladas` tras un `cancelar` por la CLI en procesos separados (sale vacío, ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ✅ |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ✅ |
| sin `--motivo` responde lo mismo | ejecución real (sin test propio) | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real en un mismo proceso (`run('cancelar')` + `run('canceladas')`) | ✅ dentro de un proceso; por la CLI en procesos separados sale vacío |

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en la memoria del proceso: `node src/app.js canceladas` en una invocación aparte de `cancelar` imprime vacío. El THEN se cumple dentro de un proceso, como prueba la suite, pero un usuario de la CLI no verá nunca las canceladas. Lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre otra.
- «sin `--motivo`» no tiene test propio en `test/cancel.test.js`; verificado a mano. Fila de deuda en el roadmap.
- El ruling `--test-concurrency=1` queda como workaround sin causa raíz. Fila de deuda en el roadmap.

## 5. Aprendizajes

- Comportamiento observable (cancelar con motivo, listado de canceladas) → `capabilities/bookings.md` (creada).
- Estructura: el estado vive en un array de módulo en `src/app.js`, compartido por los tests y perdido entre invocaciones → `architecture.md` (no existía: creado desde la plantilla).
- Revisión de skills: `.claude/skills/` no existe en el proyecto; se miró y no hay patrón reutilizable que justifique crear una.

## 6. Adendas

_Ninguna._
