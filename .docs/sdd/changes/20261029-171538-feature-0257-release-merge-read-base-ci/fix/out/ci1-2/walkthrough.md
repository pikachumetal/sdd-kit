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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, 4775517).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (`src/app.js`, `test/cancel.test.js`, 71e472a).
- Capacidad `bookings` creada con los dos requisitos del delta (`capabilities/bookings.md`, `sdd capability merge`).

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. La spec numera sus decisiones 1 y 3 (falta la 2): erratas de numeración, sin efecto.

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde; `node --test --test-concurrency=1` → 5/5 en verde.
- Gate: `node --test` → suite: corrió 5/5 · 0,17 s · configuración: la del gate (y la del ruling, `--test-concurrency=1`, 0,24 s) · sobre el commit de cierre (el cierre junta el commit de `tasks.md`, solo documentación; el código es el de 71e472a).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · suite 5/5 en verde · smoke por la CLI (`node src/app.js …`) con ejecución real en 3 de los 4 THEN; el listado `canceladas` por la CLI no se pudo probar porque el almacén es en memoria y cada invocación empieza vacía (solo `test/cancel.test.js` lo cubre, dentro de un mismo proceso) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 71e472a, sin re-revisión porque lo posterior es solo `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | verificado por el agente |
| Sin `--motivo` responde lo mismo | ejecución real | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | suite; CLI: no probado (almacén en memoria) | verificado solo por la suite |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y por eso el ruling pide `--test-concurrency=1` → fila en la deuda técnica del roadmap.
- Persistir el motivo en un almacén de reservas ya está en el roadmap (0014).

## 5. Aprendizajes

- El comportamiento observable (motivo obligatorio, listado de canceladas) → `capabilities/bookings.md`.
- Sin cambio estructural, convención ni versión nueva: no toca `architecture.md`, `constitution.md` ni `tech-stack.md`.
- Revisión de skills: `.claude/skills/` no existe en el proyecto y el trabajo no revela un patrón reutilizable ni desmiente nada: no aplica.

## 6. Adendas

- _Ninguna_
