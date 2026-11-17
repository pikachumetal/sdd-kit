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

- **Cancelar con motivo** (Task 1, `3b844d7`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro). Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `8da80b0`): el comando `canceladas` enseña sala, día y motivo. Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Script `cancelar`** en `package.json` (fuera de las tasks, tras la revisión final): `npm run cancelar -- <sala> <día> --motivo <motivo>`. Revisado en la re-revisión.
- **Capability** `bookings` creada con los dos requisitos de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- La gate de cierre del plan (§3) dice `node --test`; la ejecución usó `node --test --test-concurrency=1` por el ruling de la Task 2, y el cierre pasó la gate declarada del proyecto (`scripts/gate.mjs`, ver 4.1).
- Un commit fuera de las tasks, el del script `cancelar` de `package.json`, llegó después de la revisión final.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila de deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Unit: `node --test test/app.test.js` → 2/2.
- Suite completa: `node --test --test-concurrency=1` → 6/6.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · configuración: la del gate, sin `--affected` porque la rama toca `package.json` · sobre el commit de cierre.
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre `8da80b0`. Re-revisión del tramo `8da80b0..HEAD` (opus, limpia, sin hallazgos nuevos). El tipo de subagente `sdd-kit:effort-high` no estaba disponible en la sesión de cierre; la re-revisión se despachó como `general-purpose` con `opus`.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificación del agente: suite 6/6 · gate 2/2 tareas sin filtro · smoke de los THEN de `cancelar` con ejecución real · THEN de `canceladas` solo con suite (el almacén es en memoria, un proceso nuevo lo ve vacío) · revisión final Spec y Código sobre `8da80b0`, re-revisión limpia. Nadie ha probado a mano más allá de esto.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`npm run cancelar -- …`) y suite | ok |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real y suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite (`canceladas enseña sala, día y motivo`) | ok; no probado por CLI: el almacén es en memoria y cada proceso arranca vacío |

### 4.3 Residuales / deuda generada

- Los tests comparten el almacén en memoria y compiten entre sí: se corren en serie. Pasa a la deuda del roadmap.
- `npm run cancelar` necesita `--` antes de los argumentos (`npm run cancelar -- Norte lun --motivo "sala ocupada"`); sin él npm se queda `--motivo`. Queda dicho aquí; el README del proyecto no documenta ningún comando todavía.
- El motivo no persiste entre procesos: es la 0014 «Motivo guardado» del roadmap.

## 5. Aprendizajes

- Los tests de reservas no se pueden correr en paralelo mientras compartan el almacén en memoria → fila de deuda en `roadmap.md`.
- Revisión de skills del proyecto: no aplica, `.claude/skills/` no existe y la feature no crea ninguna.
- No hay `architecture.md` ni learning estructural que volcar.

## 6. Adendas

- (ninguna)
