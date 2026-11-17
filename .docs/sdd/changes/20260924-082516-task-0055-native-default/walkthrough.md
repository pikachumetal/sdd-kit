---
id: 20260924-082516-task-0055-native-default
task: 0055
title: Walkthrough — Native por defecto, SDD para tasks grandes
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-24
date: 2026-09-24
---

# Walkthrough — Native por defecto, SDD para tasks grandes

## 1. Cambios realizados

- **Apertura** (`3139c71`): partición de la fila 0055 en 0055 (a), 0057 (b) y 0058 (c); lectura determinista de superpowers 6.4.1 frente al kit (`red/lectura-superpowers-641.md`, 39 filas con E12–E15 de los scripts `task-start` y `task-done`); spec con review de dos revisores; plan; RED previo (`tests/native-default-red.md`); lanzador común de la campaña 0055–0058 con techo y fichero `stop` (`red/run.sh`).
- **Contrato del método** (`5c9f401`): Art. IV y `mission.md`; en `control-profiles.md`, la fila «Plan» de la tabla de gates, la clave `execution` (`auto | native | subagent`, default `auto`) y la pregunta 5; en `overrides-superpowers.md`, SDD deja de ser el default y el Execution Handoff se adopta (solo se sobrescribe dónde se para); `plan-template.md` lleva `Ejecución` en la cabecera; primera línea de los pasos 5 y 6 de `sdd-start-task`; README a 8 skills de superpowers; `tests/NativeDefault.Tests.ps1`.
- **Init y migración** (`b3f2bb7`): greenfield (fila 21) y brownfield (fila 5) preguntan el método; `generacion.md` escribe `execution` en el marcador; la migración v1.2.0 la pregunta si falta.
- **Hook** (`0030a51`): el aviso de `SessionStart` del repo nombra «las skills y los agentes».
- **GREEN** (`0c43874`): 11 sujetos (`tests/native-default-green.md`) y el REFACTOR del gate del paso 5 en `pair` (forma literal de la pregunta).
- **Fix de la revisión final** (`e35397a`): fila de `executing-plans` en overrides (las paradas del kit en Native), `execution` en el esquema del marcador de greenfield (`estructura.md`), el paso 6 en lite, el método nombrado por el dev-lead en el gate de `pair`, verificación de `execution` en la migración, README y notas de evidencia.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 1,3 h — reloj del hilo aproximado por las marcas de los commits: apertura a las 11:07, fix de la revisión final a las 11:48 y cierre hasta las ~12:20. Spec y plan (lectura de superpowers, RED y review de spec incluidos) ~1,1 h antes, fuera de este número.
- Desviación: −1,2 h (−48 %)
- Causa de la desviación: la estimación contaba las entrevistas simuladas de init a varios turnos; bastaron entrevistas a un turno (~0,2 $ y ~2 min cada una), y el GREEN del paso 5 corrió en paralelo con las Tasks 2 y 3.
- Modelo del hilo: Opus 5.5 (1M context)
- Tokens del hilo: no medido
- Tokens de subagentes: 1177552 en 13 despachos — revisores de spec Sonnet ×2 196k; implementador T1 Sonnet 118k; revisor T1 Sonnet 102k; re-revisión T1 Sonnet 62k; implementador T2 Sonnet 121k; revisor T2 Sonnet 79k; implementador T3 Sonnet 70k; revisor T3 Sonnet 62k; revisor final Opus 178k; fixer final Sonnet 106k; re-revisión final Sonnet 83k
- Coste de sujetos: 5,83 $ en 13 sujetos Sonnet — RED 1,39 $; GREEN 4,44 $
- Review de spec: 2 revisores · hallazgos 13, aceptados 11

## 3. Desviaciones del plan

- La Task 3 lleva 3 RED y no 2: se añadió el del mensaje con otra carpeta.
- El escenario `g4` del GREEN no se lanzó: medía lo mismo que `g1`.
- El GREEN del paso 5 corrió mientras se implementaban las Tasks 2 y 3, sobre una copia de `5c9f401`: solo depende de la Task 1.
- REFACTOR del hilo en el paso 5 (no estaba en el plan): la forma literal de la pregunta del gate en `pair`.
- El fix de la revisión final añadió la fila de `executing-plans` en overrides, que la spec pedía y el plan no mapeó.

### Decisiones tomadas sin el dev-lead

- Colisión de id: `develop` trajo el patch 0056 de otro worktree; la parte (b) pasa a 0057 y la (c) a 0058, corregido en la apertura sin publicar — el script dio 0058 como siguiente libre — coste si está mal: renumerar dos filas.
- La fila del handoff lleva `<native \| subagent>` escapado dentro de la celda GFM, y su aserción RED pasa a exigir el literal escapado — un `|` sin escapar parte la celda en GitHub — coste si está mal: una aserción.
- El helper `Get-TableRow` del RED acepta filas indentadas (`^\s*\|`), cambio del implementador de la Task 2 — las tablas de las init van indentadas; ninguna aserción cambia — coste si está mal: un ancla que case con otra fila (el revisor no encontró colisión).
- REFACTOR del gate del paso 5 en `pair`, hecho por el hilo — `g2` falló 2/2 la forma — coste si está mal: una frase de skill; pasó por la revisión final.
- `g4` no se lanzó — medía lo mismo que `g1` — coste si está mal: un sujeto de control.
- En lite, sin plan: `execution` si está fijado; con `auto`, Native — la spec calla y el paso 6 tiene que cubrir los dos modos — coste si está mal: una frase.
- «Declined to judge» de la revisión final (resto del paso 6 solo SDD, paso 9, apertura sin despacho en Native, `Modelo`/`Tests RED` en Native, disparadores «antes de despachar», bump y changelog, `.docs/workflow`) — todo es alcance de la 0057 o del cierre — coste si está mal: nada nuevo.

## 4. Verificación

### 4.1 Builds

- Sin build. `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` tras el fix final: 553 pasan, 0 fallan, 6 saltados.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-24 · «ya sabes, diferido» · disparador: la primera task que se ejecute en Native con el kit nuevo (la 0057), a cargo del dev-lead. El disparador lo concretó el agente: la frase no lo nombraba.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `delegate` con `auto`: `Ejecución: <método>, porque <motivo>` sin parar por el método (`g1`) | 2/2 (verificado por el agente) |
| 2 | `pair`: una pregunta aprueba el plan y elige el método (`g2`) | 0/2 → 2/2 tras el REFACTOR |
| 3 | Método fijado en `sdd-kit.json`, no se pregunta (`g3`) | 2/2 |
| 4 | Init greenfield, brownfield y migración preguntan `execution` (`ig`, `ib`, `im`) | 3/3 |
| 5 | Aviso del hook nombra los agentes | `KitSessionSource.Tests.ps1`, 3 `It` nuevos en verde |
| 6 | Tipo `sdd-kit:effort-*` ausente antes del primer despacho (RED `e1`) | pasa 2/2 sin guía: no se escribió |

### 4.3 Residuales / deuda generada

- La comprobación del tipo `sdd-kit:effort-<nivel>` antes del primer despacho (ticket 0053 §1) no se reprodujo en sujetos recién arrancados: posible falso negativo → fila en la deuda técnica del roadmap.
- `review-package` sigue sin excluir `red/` y `green/`: el paquete final se hizo a mano con `git diff … ':(exclude)…'` (199 KB). Ya está en la fila 0032.
- El molde `salas` tiene un hueco de alcance (la spec de la 0012 pide «libres» y el código no lo tiene): 8 de 8 sujetos del paso 5 pararon por él. Para medir «no para» en la 0057, un molde sin ese hueco y una petición que siga hasta la Task 1 → fila 0057.

## 5. Aprendizajes

- Dos worktrees que reservan id a la vez con `Get-NextSddId.ps1` pueden coger el mismo: el script lee las ramas, pero la reserva de la otra rama aún no estaba commiteada → `tech-stack.md`, «Aprendizajes por task» (0055).
- En una fila de tabla GFM, un `|` dentro de comillas invertidas también parte la celda: se escapa `\|`, y un test que fije el literal tiene que fijar la forma escapada → `tech-stack.md`, «Aprendizajes por task» (0055).
- Una regla de forma que solo vive en una celda de la tabla de gates no llega a la salida aunque el agente lea la tabla (0/2): la forma literal va en el paso que la produce → `tech-stack.md`, «Sujetos headless».
- Una entrevista de init se mide a un turno, con las preguntas anteriores dadas en la petición: ~0,2 $ por sujeto frente a 0,4–0,7 $ de la entrevista simulada → `tech-stack.md`, «Sujetos headless».
- El comportamiento nuevo (método elegido por el handoff, clave `execution`, pregunta 5) → `capabilities/control-profiles.md`, `onboarding.md` y `migration.md`.

## 6. Adendas
