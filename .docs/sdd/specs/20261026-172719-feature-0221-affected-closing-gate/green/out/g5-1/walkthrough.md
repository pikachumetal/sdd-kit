---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (58bffbd).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (d16d30c).
- Capacidad `bookings` creada con el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_ en el código.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, contra una carrera sobre el almacén en memoria — coste si está mal: la suite tarda el doble. **No llegó al código**: ni `gate.json` ni el gate de `plan.md` llevan el flag en d16d30c, y la re-revisión del cierre dudó de que la carrera exista (cada fichero de test corre en su proceso). Queda como intención sin efecto; no abre deuda porque no hay workaround escrito.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/0 fallos · rooms:test: saltada (el filtro por base no ve cambios de la rama en sus inputs; los trajo `develop`) · 1,7 s · configuración: la del gate · sobre el merge de sincronización (con develop en 0aa96dc).
- Suite completa sin filtro: `node scripts/gate.mjs run bookings:test rooms:test` → bookings 5 pasan, rooms 2 pasan, 0 fallos · sobre el merge de sincronización (con develop en 0aa96dc).
- Revisión final: Spec (opus) y Código (sonnet) limpias sobre d16d30c; re-revisión del tramo posterior (solo `tasks.md`) con 2 hallazgos, ambos de `tasks.md` y corregidos en el cierre (commit de la Task 1 y ruling no aplicado).

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke por THEN con ejecución real (`node src/app.js cancelar …`, y `run('cancelar')` + `run('canceladas')` en un mismo proceso porque el almacén es en memoria) · revisión final Spec y Código sobre d16d30c, re-revisión del cierre con hallazgos corregidos · suite completa en el sync del cierre. El borrador previo probaba `--motivo sala-ocupada`, que no es de la lista; se rehízo con «sala ocupada».

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| Motivo fuera de la lista (`sala-ocupada`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| Sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (mismo proceso) | ok |

### 4.3 Residuales / deuda generada

- Sin test para el caso «sin `--motivo`» (lo cubre el smoke, no la suite).

## 5. Aprendizajes

- Ninguno que vuelva a docs vivos: no hay convención, estructura ni herramienta nuevas. El comportamiento observable pasó a `capabilities/bookings.md`.
- Revisión de skills: el proyecto no tiene `.claude/skills/`; no aplica, ningún patrón reutilizable.

## 6. Adendas

- _Ninguna._
