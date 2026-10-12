---
id: 20261012-202133-patch-0174-stale-task-pointers
task: 0174
title: Patch — Punteros desfasados a la task 0022 y un repaso de coherencia que no los busca
type: patch
solution: dev-lead
status: done
created: 2026-10-12
branch: patch/0174-stale-task-pointers
commit: e3d01fe
---

# Patch 0174 — Punteros desfasados a la task 0022 y un repaso de coherencia que no los busca

## Capacidades

- Modificadas: `control-profiles` — «Límites» deja de decir que la conducta de `control.maxParallelAgents` la define la task 0022

## 1. Síntoma

Tras cerrar la feature 0166, que implementó el tope `control.maxParallelAgents` en `sdd-parallel-agents`, cuatro textos siguen diciendo que lo define la task 0022 (pendiente, en Later): `capabilities/control-profiles.md` («Límites»: «su conducta la define la task 0022»), `skills/sdd-start-feature/references/control-profiles.md:156` y `:231`, y `skills/sdd-config/SKILL.md:28`. La revisión final de la 0166 lo vio en la capacidad y lo dejó como pendiente del dev-lead ([ticket de la feature 0166](../../field-reports/20261012-183835-feature-0166-worktrees-and-parallel-agents.md)).

## 2. Solución fijada

Fila 0174 del roadmap y dev-lead (2026-10-12, «Punteros y regla»): (a) los punteros pasan a apuntar a `sdd-parallel-agents`; (b) el «Coherence pass» de `sdd-propose` busca también los «task NNNN» que apuntan a la fila que la feature salda o implementa. La regla cambia texto de skill: RED con sujetos (Art. I).

Lo que da por existente, comprobado: los cuatro punteros están en `develop` (`9a8933c`), y `skills/sdd-parallel-agents/SKILL.md:85` aplica el tope por tandas. La búsqueda de `0022` y `maxParallelAgents` en `skills/` y `.docs/sdd/` da dos más, que se quedan: `control-profiles.md:3` (lista de qué tasks fijaron el contrato, historia) y `capabilities/feature-flow.md:467` («como pide el tope de reintentos de la 0022»: los reintentos por tipo de fallo siguen pendientes en la 0022). Por la misma razón, `control-profiles.md:156` cambia solo en la parte del tope.

Por qué el repaso de la 0166 no los vio: su encargo pedía listar el grep de los nombres de las dos skills de superpowers, y el «Coherence pass» busca fuera de la spec solo dónde se implementa cada `MODIFIED`. El tope era un `ADDED` de `sdd-parallel-agents`, y los punteros nombraban la fila (0022), no la skill.

## 3. Fix

- **Fichero(s)**: `skills/sdd-config/SKILL.md`, `skills/sdd-start-feature/references/control-profiles.md`, `.docs/sdd/capabilities/control-profiles.md` (por el delta de §6), `tests/ForkSkills.Tests.ps1`, `tests/batteries/sdd-propose/` (`battery.md`, `subject.sh`).
- **Cambio**: los tres punteros de las skills y el de la capacidad dicen que el tope de agentes lo aplica `sdd-parallel-agents`; los reintentos por tipo de fallo siguen en la 0022. Un test fija que ninguno vuelve a remitir el tope a la 0022. La batería de `sdd-propose` gana el escenario `t1` (molde `reservas-puntero`) como control.
- **Decisiones**:
  - Entran punteros y regla en el mismo patch, la regla con RED — dev-lead («Punteros y regla», 2026-10-12)
  - La regla del «Coherence pass» no entra: el RED sale limpio 2/2 en dos moldes, y sin fallo medido no se escribe guía (Art. I); `t1` queda como control y el caso va a deuda con «Esperar 2.º ticket» — sin el dev-lead
  - El primer molde (puntero en `PRODUCT.md`) se rehace con el puntero en `docs/config.md`: `PRODUCT.md` lo lee el paso 1 y daba una salida antes del punto medido (`tech-stack.md`, «Comprobación previa», pregunta 6); evidencia en `red-v1/` — sin el dev-lead
  - `control-profiles.md:3` (lista histórica de tasks) y `capabilities/feature-flow.md:467` (reintentos de la 0022, aún pendientes) se quedan — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `nadie remite ya el tope de agentes a la task 0022` (`ForkSkills.Tests.ps1`) con el kit de `develop` y con la rama | ✅ falla con `develop` (0/1) y pasa con la rama (1/1) |
| 2 | RED `t1` v1, puntero en `PRODUCT.md` (`red-v1/out/`) | limpio 2/2: los dos citan el puntero y el solape con la 0009 · disparador ausente: el paso 1 lee `PRODUCT.md` · 0,69 $ |
| 3 | RED `t1` v2, puntero en `docs/config.md` (`red/out/`) | limpio 2/2: los dos abren `docs/config.md` desde el README y lo ponen en el Scope · 0,62 $ |
| 4 | `grep 0022` en `skills/` y `.docs/sdd/capabilities/` tras el fix | solo quedan `control-profiles.md:3`, `:156` (reintentos), `feature-flow.md:467` y escenarios con la 0022 como dato |

Validación en campo: 2026-10-12 · ForkSkills `0174` 1/1 (0/1 con `develop`) · pre-commit 1.114 Pester y 757 CLI en verde · RED `t1` 4 sujetos con ejecución real, limpio en los dos moldes

## 5. Tiempo (ligero)

- Estimación: 1,5 h
- Inicio: 2026-10-12T20:21Z
- Real: 0,4 h (de la clasificación, ~20:10Z, al cierre, 20:36Z), con los dos RED de ~5 min

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**Reglas de la capacidad**
- **Límites**: `control.maxParallelAgents` 3 por defecto; su conducta la aplica `sdd-parallel-agents` (requisito «Dos revisores de spec se despachan con `sdd-parallel-agents`» de `feature-flow`). `control.silence` 8 y 20 minutos por defecto: 20 (`longCommandMinutes`) si la llamada que espera el subagente es un comando de shell o si se vigila la salida de una verificación lenta, y 8 (`betweenStepsMinutes`) en cualquier otra espera; un subagente colgado se relanza una sola vez (requisitos de `feature-flow`). Umbral para proponer partir una feature: más de 5 tasks internas previstas, o 4 o 5 que tocan capacidades o superficies distintas o llevan migración; con 3 o menos, nunca. Checkpoint de alcance: en el 3.º fix descubierto de una feature y en cada tercero después.
