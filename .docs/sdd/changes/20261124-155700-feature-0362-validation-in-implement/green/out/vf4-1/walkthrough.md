---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-24
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada (cambio de planes, sala ocupada, otro) y comando `canceladas` (56c2090, 911e7bb).
- `test/cancel.test.js`, `e2e/cancel.e2e.mjs`: tests por THEN, cada uno con su estado; el E2E queda en el flujo core de cancelar con motivo (pasada de fix, juntada en el cierre).
- ADR: sin candidatas en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutilizaba la cancelación del primer test — workaround hasta que cada test preparase sus datos — coste si es erróneo: fallaba solo o reordenado. Resuelto en la pasada de fix, juntada en el cierre.
- La spec dice «MODIFIED» en su decisión 3 pero el delta solo tiene ADDED, y `cancelar` sin `--motivo` deja de cancelar (ruptura que pide la spec) — el CHANGELOG lo recoge en «Changed» — coste si es erróneo: quien usaba `cancelar` sin motivo recibe un error sin aviso previo.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: 7/7 · e2e: 5/5 (sin filtro: la suite entera) · E2E 30,1 s de 0,5 min · sobre el último commit de código de la rama (los posteriores solo tocan `.docs/`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:53706/health` → ok, levantado en esta sesión (la primera pasada del E2E, sin entorno, falló 7/7 con conexión rechazada; con el entorno, 7/7 y tras la pasada de fix 5/5).
- Revisión final: Spec opus+high y Código sonnet+high sobre el último commit de la task 2, ambos con arreglos; pasada de fix y re-revisión limpia, juntadas en el cierre (ver `tasks.md`).

### 4.2 Smoke / tests

Verificado por el agente (ejecución real contra el servidor de `env-up`, con la sesión del agente):

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` tras cancelar | ejecución real | «Norte lun — sala ocupada» |
| `cancelar Sur mar --motivo otro` (rama «sin reserva») | ejecución real | «sin reserva Sur mar» |

<!-- cspell:ignore exportación -->
Validación diferida: 2026-11-24 · «Lo pruebo mañana en la primera exportación, a cargo del dev-lead.» · disparador: la primera exportación de mañana (2026-11-25), donde el dev-lead recorre los 5 pasos del guion (cancelar con motivo, `canceladas`, motivo fuera de la lista, sin motivo, sin reserva) contra el entorno de `env-up`; dueño: dev-lead

### 4.3 Residuales / deuda generada

- Minor diferidos de la revisión final (en `tasks.md`): lista vacía de `canceladas`, motivo inválido que deja la reserva activa sin test, literal `--motivo` inline, ficheros de test con LF en un repo CRLF, `freshApp` dependiente de nombres únicos.
- El CHANGELOG recoge en «Changed» que `cancelar` exige `--motivo`.

## 5. Aprendizajes

- El cambio de comportamiento observable (cancelar pide motivo; `canceladas`) → `.docs/sdd/capabilities/bookings.md`, con `sdd capability merge` (capacidad nueva, creada desde el delta).
- Sin aprendizajes de convención, estructura ni herramienta: `constitution.md`, `architecture.md` y `operations.md` quedan como están.

Retro: sin señales

## 6. Adendas

- _Ninguna_
