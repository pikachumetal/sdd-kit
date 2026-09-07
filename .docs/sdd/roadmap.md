# Roadmap — sdd-kit

## Release v0.6.0 — RC hacia v1.0.0 · comprometida (2026-09-07)

Decisión del usuario (2026-09-07): v0.6.0 es la **release candidate hacia v1.0.0** — al cerrarla no queda nada pendiente. Entra todo el trabajo pendiente y toda la deuda técnica; las decisiones abiertas se resuelven dentro de la release (🔒 = decisión que falta y quién la debe). Orden: T1 → T2 → T3 (T2 reestructura lo que T1 acaba de tocar; T3 edita `plan-template` después de T1); T4, T5, T7–T9 sin orden fijado hasta resolver sus bloqueos (T6 fusionada en T5 el 2026-09-07).

| # | Task | Origen | Estado |
| --- | --- | --- | --- |
| T1 | [Alineación con superpowers 6.3.0](specs/20260907-151234-task-0000-alineacion-superpowers/spec.md): mapeo vías→carriles, spike en `sdd-consult`, restricciones globales en el plan, versión validada, vigilancia del estado del arte | consulta 2026-09-07 · deuda "override no probado" | 🔄 spec aprobada, plan en curso |
| T2 | Progressive disclosure de las skills largas: `SKILL.md` (gates, enrutado, tablas) + `references/` leídos en el punto de uso; borrar solo prosa muerta (método superpowers 6.2.0); re-test Art. I. Absorbe el pendiente "crea un todo por paso" en 8 skills (TodoWrite retirado en Claude Code v2.1.233) | ítem "recorte" (antes <500 palabras) · deuda "1403 palabras" · ítem 3 | ⏳ |
| T3 | Workflow y ejecución: `subagent-driven-development` por defecto con política de modelos forzada desde el plan (campo `Modelo` por task, aprobado con el plan; el más barato que resuelve bien; nunca `fable` ni `opus xhigh` por defecto), `test-driven-development` y `requesting-code-review` explícitos, cierre = merge a `develop` local y worktree borrado por el usuario. Hoy la política vive solo en Alybo (`.claude/CLAUDE.md:50-75`) y el kit dice lo contrario | consulta 2026-09-07 · práctica real en Alybo | ⏳ |
| T4 | Entorno por worktree: skill que fija el contrato (marcador, `worktree:new/remove`, `env:setup/clean`, predicado `environments.md`) y guía a `init-*` a generar los scripts del proyecto por entrevista, con los de Alybo (`.tools/scripts/*.mjs`) como referencia | consulta 2026-09-07 · Alybo task 0000-worktree-env | 🔒 el kit es nivel 1 (agnóstico de stack) y los scripts son nivel 2/3: decidir si el contrato va al kit y los scripts al proyecto, o todo a nivel 2 — usuario, ligado a la decisión "kit de nivel 2" |
| T5 | **Spec ligera + `funcional/` vivo con delta** (dirección fijada el 2026-09-07 sobre [OpenSpec](https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md)). Mapeo: su `specs/<dominio>/spec.md` (verdad viva por capacidad) → `.docs/sdd/funcional/<capacidad>.md`, que en brownfield **no se vuelca de golpe**: cada task escribe su delta y `sdd-end-task` lo fusiona (su `archive`); su `proposal.md` (Intent / Scope / Approach, 3-5 líneas por sección) → `spec.md` corta, con **"Decisiones que he tomado yo — valida estas"** arriba, porque es lo único que el usuario necesita leer; su delta (`ADDED` / `MODIFIED (Previously: …)` / `REMOVED (reason)` con `GIVEN / WHEN / THEN`) sustituye a la §4 en prosa y da al smoke escenarios contra los que verificar. Regla de contenido: *si la implementación puede cambiar sin cambiar el comportamiento observable, no va en la spec*. Lo técnico sigue en `plan.md`. Nuestro `specs/` es su `changes/`: sin choque de nombres. Hoy `funcional.md` se declara en cuatro sitios y ninguna skill lo escribe; el propio kit tampoco lo tiene (dogfooding). Absorbe la antigua T6 (ideas para `spec-template`) | consulta 2026-09-07 · backlog OpenSpec | ⏳ cambio de convención → Art. IV: spec dedicada + revisión de `sdd-init-*`, `sdd-start-task`, `sdd-consult`, `sdd-end-task`, `sdd-end-release` |
| T7 | `Build-EstimationLog.ps1` genérico distribuible con el kit (hoy cada proyecto lleva el suyo) | backlog | ⏳ |
| T8 | CI que valide frontmatter y estructura de las skills | deuda | ⏳ |
| T9 | Método de test: montar un entorno **sin** una skill (el staging por renombrado la hace ininvocable, no ausente) | deuda (task dependencias-declaradas) | ⏳ es un spike: se resuelve vía `sdd-consult` y puede cerrarse como limitación aceptada con evidencia |
| — | Kit de nivel 2 (skills técnicas por stack: sql-migration, backend-command/query, backend-feature, frontend-feature) | backlog | 🔒 ¿segundo plugin o carpetas por stack en este repo? — usuario. Si es "carpetas en este repo", se convierte en task de v0.6.0; si es "segundo plugin", sale de este roadmap |

**Verificaciones sin task** (se registran en el cierre de la release):

- **A6** (acta v0.5.0): el plan de T1 expresa la guidance como rango condicional al RED ("0 h si el baseline no falla / Xh si falla").
- **A7** (acta v0.5.0): resolución automática de `superpowers` en entorno limpio — evidencia ya disponible en `installed_plugins.json`: en `D:\code\git\ai-hackathon`, `sdd-kit` instalado el 2026-09-07 a las 12:01:30 y `superpowers` con `auto: true` a las 12:01:48. Se registra en el acta.
- Fila de deuda "`.docs/sdd/templates/` sigue existiendo": ya no existe (commit `a49a845`). Retirada de la tabla.

**Decisiones a resolver dentro de la release** (para llegar a v1.0.0 sin pendientes): nivel 2 (plugin aparte o carpetas); nivel del contrato de worktrees (T4); dónde se aloja el repo el día que se distribuya (GitHub / Azure DevOps / interno); changelog de cliente además del técnico.

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 1 | Estreno real: instalar en un proyecto del equipo y ciclar las primeras tareas | 🔄 en curso — feedback devuelto al kit: carril release, fuente única de plantillas, rename hotfix→patch, modo lite (v0.4.0–v0.5.0). En v0.5.0 el bucle se cerró desde dentro: una consulta destapó la referencia rota a `grilling` y la ausencia de declaración de dependencias. El 2026-09-07 otra consulta abrió v0.6.0 entera |
| 3 | Compatibilidad con Claude Code y dependencias — ~~`grilling` referenciada como `superpowers:grilling`~~ ✅ ([patch 20260902-153722](specs/20260902-153722-patch-0000-grilling-reference/patch.md)) · ~~declaración de dependencias~~ ✅ ([task dependencias-declaradas](specs/20260902-160308-task-0000-dependencias-declaradas/walkthrough.md)). El pendiente "crea un todo por paso" pasa a **T2** | ✅ cerrado como ítem; resto en v0.6.0 |

## Backlog

Vacío por decisión (2026-09-07): todo lo que había entra en v0.6.0 (T4–T9 y la decisión de nivel 2).

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| `sdd-start-task` con **1403 palabras** (eran 965; la task modo-lite añadió el predicado, el override y dos racionalizaciones). Relectura 2026-09-07: superpowers no acorta skills (`brainstorming` 2324), mantiene pequeño lo siempre cargado y parte el resto en auxiliares; el límite aplica a las `description`, no al `SKILL.md` | Medio | T2 |
| El override sobre la clasificación de `brainstorming` está escrito pero **no probado**: el GREEN no pudo demostrar que fuera él quien evitó el fallo | Bajo → Alto con 6.3.0 (la clasificación es obligatoria y en voz alta) | T1 |
| ~~El propio kit aún no ha ciclado ninguna tarea con su flujo~~ — saldada: la task del carril release (20260721) cicló spec → plan → RED/GREEN → cierre | — | — |
| El método de test no sabe montar un entorno **sin** una skill: el staging por renombrado la hace ininvocable, no ausente (task dependencias-declaradas) | Medio | T9 |
| Sin CI que valide frontmatter/estructura de las skills | Bajo | T8 |

## Decisiones tomadas

- **v0.6.0 es RC hacia v1.0.0** (2026-09-07): entra todo lo pendiente, deuda incluida; nada se arrastra a v0.7.0. Las decisiones abiertas se resuelven dentro de la release.
- **La unidad de descomposición de una skill es el fichero auxiliar, no la skill** (2026-09-07): cada skill nueva suma su `description` a la lista cargada en todas las sesiones y añade un salto de invocación que el agente puede saltarse. Gobierna T2.
- **Distribución: local-only** (2026-09-02). El kit se instala apuntando a la ruta local del repo y lo usa el dev-lead; no se configura remoto hasta que la empresa decida distribuirlo al equipo. Cierra el action item A2-ter, arrastrado desde v0.1.0. Consecuencia asumida: v0.2.0–v0.5.0 quedan cerradas y no distribuidas, y `claude plugin tag --push` no aplica. → [acta v0.5.0](releases/v0.5.0/feedback.md)

## Decisiones pendientes

Todas con plazo: dentro de v0.6.0 (ver la sección de la release).

- ¿Kit de nivel 2 como segundo plugin o como carpetas por stack en este repo?
- ¿El contrato de worktrees (T4) va al kit o a nivel 2?
- Dónde se aloja el repo el día que la empresa quiera distribuirlo (GitHub / Azure DevOps / interno).
- ¿Changelog de cliente además del técnico? (por ahora solo técnico).

## Releases cerradas

### v0.5.0 — 2026-09-02

Modo lite del carril task + declaración de dependencias del kit (manifest cross-marketplace y README como fuente única) + la referencia rota a `grilling`. **Cerrada, no distribuida** — por decisión, no por olvido: el kit es local-only. [Release notes](releases/v0.5.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.5.0/feedback.md).

### v0.4.0 — 2026-07-22

Rename del carril `hotfix`→`patch` + override de worktrees neutral en `sdd-start-task`. **Cerrada pero no distribuida**: sin remoto configurado, no llega a los consumidores vía `/plugin marketplace update`. [Release notes](releases/v0.4.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.4.0/feedback.md).

### v0.3.0 — 2026-07-21

Carril consult (`sdd-consult`). [Release notes](releases/v0.3.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.3.0/feedback.md).

### v0.2.0 — 2026-07-21

Carril release (`sdd-start-release`, `sdd-end-release`) + fuente única de plantillas. [Release notes](releases/v0.2.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v0.2.0/feedback.md).

### v0.1.0 — 2026-07-09

Las 7 skills de proceso iniciales + plantillas + manifests. Sin acta (el carril release no existía).

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-02 | [20260902-153722-patch-0000-grilling-reference](specs/20260902-153722-patch-0000-grilling-reference/patch.md) | `sdd-consult` invocaba `superpowers:grilling`, nombre que no resuelve. Corregido a `grilling`. |
