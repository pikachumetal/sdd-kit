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

- `src/app.js`: lista cerrada de motivos (`cambio de planes`, `sala ocupada`, `otro`); `cancelar` exige `--motivo` de la lista, guarda el motivo con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`; comando nuevo `canceladas` que lista `<sala> <día> — <motivo>`. Commits `0133224` (task 1) y `af270cb` (task 2).
- `test/cancel.test.js`: tests de cancelar con motivo, con motivo fuera de la lista y del listado.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en tasks ni en ficheros.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria; workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. (Task 2, de `## Rulings` de `tasks.md`.) El flag **no figura** en `gate.json` de la rama: el gate sigue siendo `node --test test/app.test.js test/cancel.test.js`, y la suite pasó sin el flag. El ruling queda como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test corrió (5 pasan, 0 fallan) · rooms:test: saltada (sus inputs no los toca la rama) · 1 s · configuración: la del gate · sobre el commit de cierre (la base va 2 commits por delante, `0015`: el paso de la base integrada repite la suite y se anota en el mensaje final).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificado por el agente: suite verde (bookings:test 5/5) · smoke 3/3 THEN con ejecución real (abajo) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `af270cb`; la Arquitectura no se revisó (el plan no la pide). `HEAD` solo añadió `tasks.md` desde esa revisión. No probado: nada más allá de la tabla. El borrador de esta línea (2026-10-26) citaba `--motivo sala-ocupada`, que la CLI rechaza con «motivo no válido…»; se sustituye por la ejecución con el motivo de la spec (`"sala ocupada"`).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | verificado por el agente |
| Motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| Sin `--motivo` responde lo mismo | ejecución real | verificado por el agente |
| `canceladas` tras esa cancelación responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run('cancelar',…)` y `run('canceladas',[])`); el almacén es en memoria, así que dos invocaciones de la CLI no comparten estado | verificado por el agente |

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria: la cancelación y el listado no persisten entre ejecuciones de la CLI. Lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Workaround de la carrera de tests sobre el almacén compartido (ver arriba): fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- Comportamiento observable nuevo (motivo al cancelar, listado de canceladas) → `capabilities/bookings.md`, fusionado con `sdd capability merge`.
- Skills: no aplica. `.claude/skills/` no existe en el proyecto y el trabajo no reveló un patrón reutilizable ni desmintió una skill.
- Sin aprendizajes de convención, estructura ni herramienta para `constitution.md`, `architecture.md` (no existe) o `tech-stack.md`.

## 6. Adendas

- Ninguna.
