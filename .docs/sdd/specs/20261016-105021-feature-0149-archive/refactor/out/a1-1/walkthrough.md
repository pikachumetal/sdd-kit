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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (2274a11).
- `canceladas` lista «sala día — motivo» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (e99a0ed).
- Capacidad `bookings` creada en `capabilities/bookings.md` con los dos requisitos de la spec. La spec la declaraba «Modificadas», pero el proyecto no tenía ese fichero: se corrigió a «Nuevas» para poder fusionar (el fichero solo recoge lo que añade la 0010, no el comportamiento previo de reservas).

## 2. Tiempo y coste: estimado vs real

No existe `.docs/sdd/estimation.md`; solo se pegan las medidas del cierre.

- Esfuerzo real: 0,01 h — reloj de la sesión 0,01 h desde 2026-10-16T11:49Z, sin 0 min de espera al dev-lead (0 esperas) *(solo la sesión del cierre)*
- Tokens del hilo: 212.419 — claude-sonnet-5-5 212.419
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no (dos señales: MODIFIED, datos)

## 3. Desviaciones del plan

- _Ninguna_ en las tasks.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Pasa a la tabla de deuda del roadmap.
- En el cierre: declarar `bookings` como «Nuevas» en vez de «Modificadas» en la spec aprobada (no existía su fichero de capacidad) — coste si es erróneo: la capacidad nace con solo dos requisitos.

## 4. Verificación

### 4.1 Builds

- `node --test` sobre 6d39cef → 5/5 en verde, 112 ms.

### 4.2 Smoke / tests

Validación en campo: 2026-10-16 · suite 5/5 · smoke de los THEN de la spec con ejecución real (CLI y llamada directa a `run`) · revisión final Spec y Código limpia sobre e99a0ed; el commit posterior solo toca `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js`) + suite | ok |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real vía `run` encadenado en un mismo proceso + suite | ok |

### 4.3 Residuales / deuda generada

- Por CLI, `canceladas` en un proceso nuevo responde vacío: el almacén es en memoria y no persiste entre invocaciones. Ya lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Fila de deuda nueva por el workaround de `--test-concurrency=1`.

## 5. Aprendizajes

- Comportamiento observable de cancelar y de `canceladas` → `capabilities/bookings.md` (creada).
- El almacén compartido en memoria obliga a serializar los tests → deuda del roadmap; no se escribe en `tech-stack.md`.
- Revisión de skills: `.claude/skills/` no existe en el proyecto y esta feature no revela un patrón reutilizable → no aplica.

## 6. Adendas

- (ninguna)
