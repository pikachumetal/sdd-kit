---
kit_version: 2.3.4
lane: feature
id: 20261103-165754-feature-0303-adr-three-rules
task: 0303
mode: lite
date: 2026-11-03
---

# Ticket para el kit — feature 0303: ADR de las tres reglas, lite en delegate con una parada de más por la política de modelos

## Contexto

- Carril y modo: feature lite, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio repo del kit; cambio solo de documentos (`.docs/sdd/`)
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-opus-5-5 (eje Spec), claude-sonnet-5-5 (eje Código)
- Coste en reloj: 0,32 h frente a 0,5 h estimadas
- Coste en tokens: 12.133.244 del hilo + 3.255.592 de subagentes; 7,60 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La línea «Política de modelos» de la spec lite no nombró los ejes de la revisión final, y eso añadió una parada al dev-lead

- **Qué pasó**: en el ✋ de la spec escribí «Política de modelos: ninguno; la sesión escribe la ADR y los dos enlaces sin subagentes». Al llegar a la revisión final, `sdd-verify` despacha dos ejes en paralelo, y solo una línea que los nombra cuenta como la confirmación que pide el `CLAUDE.md` del dev-lead. Paré a pedirla, con modelos y coste, y el dev-lead respondió «si».
- **Fuente**: `skills/sdd-templates/templates/spec-template.md:45` (la línea trae el hueco «<ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan>»); `skills/sdd-verify/SKILL.md`, «The axes» («a `Política de modelos:` line in the approved spec's ✋ that names the axes is the confirmation…»); `sdd session tokens` → `Esperas y huecos: 16:28Z 3 min; 16:35Z 7 min`.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4 («In `delegate`, ✋ carries the `Política de modelos:` line») y la línea 45 de `spec-template.md`.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: la plantilla tiene el hueco de los ejes. Lo leí como «subagentes que despacha la spec», y en lite, sin plan ni tasks, «ninguno» parecía completo. Nada en el repaso de coherencia comprueba que la línea nombre los ejes que `sdd-verify` va a lanzar.
- **Coste**: una parada del dev-lead, de 7 min (la espera de las 16:35Z de `sdd session tokens`).
- **Propuesta**: en el repaso de coherencia del paso 4 de `sdd-propose`, sustituir «In `delegate`, ✋ carries the `Política de modelos:` line» por una frase que exija los ejes de la revisión final con modelo y effort, también en lite. Sin añadir otra frase (regla 3 de la ADR 0022).
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una feature lite en `delegate` que solo toca documentos WHEN el agente presenta la spec THEN la línea `Política de modelos:` nombra `Spec opus+high` y `Código sonnet+high`, y la revisión final sale sin otra pregunta de confirmación.

### 2. El encargo del eje Código no tiene forma para una rama solo de documentos

- **Qué pasó**: la rama solo tocaba `.docs/sdd/`. El encargo del eje Código (`code-reviewer-prompt.md`) es el de un revisor de código: calidad, manejo de errores, E2E y las tablas de los cinco libros. Lo adapté a mano: cambié «What Was Implemented» por una lista de comprobaciones de documentos (Markdown, enlaces relativos, frontmatter de ADR, ortografía, contradicciones) y resumí los cinco libros a la única fila que aplica (DRY). Con ese encargo, el eje encontró el único Important de la revisión: la regla 2 de la ADR tenía dos lecturas frente a la constitution.
- **Fuente**: `skills/sdd-verify/references/code-reviewer-prompt.md` («Fill every `<…>`», sin hueco para el tipo de cambio); `sdd session tokens` → `Final review — Code axis claude-sonnet-5-5 973.784 / 2 min`.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «The axes», y `skills/sdd-verify/references/code-reviewer-prompt.md`.
- **Por qué el kit no lo evitó**: la tabla de ejes no distingue una rama de solo documentos. `sdd-verify` sí la distingue en «Running a gate» (punto 1, «a branch that only touches `.docs/` or `*.md` runs nothing»), pero no en el encargo.
- **Coste**: 0,51 $ del eje y unos minutos de adaptar el encargo a mano; sin respaldo para el tiempo.
- **Propuesta**: que el encargo del eje Código tenga un hueco «Qué se revisa» que se llena con el tipo de cambio, en vez de editarlo a mano. Con una rama solo de `.docs/` o `*.md`, ese hueco lleva las comprobaciones de documentos, y sustituye a «What Was Implemented».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una rama que solo cambia `.docs/` WHEN el hilo llena el encargo del eje Código THEN no edita ninguna sección de la plantilla, y el encargo pide enlaces, frontmatter y contradicciones entre documentos.

## Lo que hice por iniciativa propia

- Medí las palabras del cambio de la constitution antes de presentar la spec. La primera versión de la frase del Art. IX la dejaba en 2.238 palabras, sobre su tope de 2.236; la reescribí antes del gate y quedó en 2.232. Funcionó: el gate no tuvo que tocar el tope.
- Un script de un uso (`links.mjs`, en el scratchpad) comprobó que los enlaces relativos de la ADR, la constitution y `tech-stack.md` resuelven. Encontró un enlace roto de antes de la rama (`capabilities/task-ids.md`), que la retro corrigió. `cli/test/kit/` no comprueba los enlaces de `.docs/`.

## Funcionó, no tocar

- Los dos ejes de la revisión final comprobaron cada cita de la ADR contra su fuente: commits, research, ticket. Encontraron una cita no literal antes del merge, cuando la ADR todavía se podía corregir.
- La regla de «Every commit of yours» de `sdd-implement`: la pasada de fix tenía 6 líneas de `.docs/`, se revisó en el hilo y no hizo falta re-revisión.
- `sdd decision index --files` como RED y GREEN de una ADR: antes daba la 0013, después la 0022.

## Menores

- `sdd-archive` paso 0.1 dice que pares y preguntes ante cualquier cambio sin commitear, y el párrafo de debajo dice que el cierre parte de los borradores sin commitear de `sdd-implement`. Seguí el segundo. Son dos frases sobre la misma regla, una al lado de la otra — `skills/sdd-archive/SKILL.md:19` y `:26`.
- En lite, sin plan, el bucle Native nombra `sdd task start <plan> <n>` y no dice qué hacer sin tasks; no lo lancé, tomé el BASE con `git` y usé `sdd task done <spec.md> 1 <base>`, que sí registró la línea — `skills/sdd-implement/SKILL.md`, Native loop paso 1.
