# Roadmap — sdd-kit

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 4 | Feedback de la migración real de Alybo y MDT (acta v1.0.0, A8): la ejecuta el dev-lead en los proyectos con `sdd-init-brownfield`; lo que falle vuelve al kit como patch | ⏳ |
| 1 | Estreno real: instalar en un proyecto del equipo y ciclar las primeras tareas | 🔄 en curso — feedback devuelto al kit: carril release, fuente única de plantillas, rename hotfix→patch, modo lite (v0.4.0–v0.5.0). En v0.5.0 el bucle se cerró desde dentro: una consulta destapó la referencia rota a `grilling` y la ausencia de declaración de dependencias. El 2026-09-07 otra consulta abrió v0.6.0 entera |
| 3 | Compatibilidad con Claude Code y dependencias — ~~`grilling` referenciada como `superpowers:grilling`~~ ✅ ([patch 20260902-153722](specs/20260902-153722-patch-0000-grilling-reference/patch.md)) · ~~declaración de dependencias~~ ✅ ([task dependencias-declaradas](specs/20260902-160308-task-0000-dependencias-declaradas/walkthrough.md)). El pendiente "crea un todo por paso" pasa a **T2** | ✅ cerrado como ítem; resto en v0.6.0 |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Kit de nivel 2 como **segundo plugin** (skills técnicas por stack), cuando un proyecto lo pida | decisión 2026-09-09 |
| B2 | Medir la lente dominio con las cinco reglas (GREEN con review activada) y la entrevista de brownfield | acta v1.0.0, A10 |
| B3 | Resumen para personas generado desde los artefactos al cerrar una release | research-hackaton §7, sin prioridad |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| ~~`sdd-start-task` con 1503 palabras~~ — saldada en T2: **997 palabras** tras bajar modo lite, nombrado y overrides a `references/`, con 4/4 escenarios sin degradación. El patrón medido: las skills con **secciones autónomas** admiten cortes grandes (−34 %); las de **checklist** solo −6 % a −14 %, porque el detalle vive dentro de cada paso | — | ✅ T2 |
| ~~El override sobre la clasificación de `brainstorming` está escrito pero **no probado**~~ — saldada en T1: 2/2 baselines con `brainstorming` 6.3.0 real anunciaron `bounded` y conservaron `spec.md` ([RED](../../tests/sdd-start-task-vias-red.md)) | — | ✅ T1 |
| ~~El propio kit aún no ha ciclado ninguna tarea con su flujo~~ — saldada: la task del carril release (20260721) cicló spec → plan → RED/GREEN → cierre | — | — |

## Referencias de vigilancia

Se revisan al abrir cada release del kit (Art. V). No son dependencias: son el estado del arte con el que el kit se alinea por conceptos, no por layout.

- `claude plugin eval` — RED/GREEN integrado en Claude Code con brazo baseline sin plugin (`--ablation with-without`), en early access el 2026-09-09; cuando salga, candidato a sustituir las campañas a mano del kit.
- superpowers — `RELEASE-NOTES.md` del plugin instalado (`~/.claude/plugins/cache/claude-plugins-official/superpowers/<versión>/`). Validado: 6.3.0 (2026-09-07).
- OpenSpec — <https://openspec.dev/changelog/> · conceptos: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md>. Visto: v1.11.0 (2026-08-26).
- Spec Kit — <https://github.com/github/spec-kit/releases>. Visto: v0.8.7 (2026-05-07).

## Decisiones tomadas

- **v1.0.0 en vez de v0.6.0** (2026-09-09, cierre): el dev-lead cerró la RC como 1.0.0 contra la recomendación del agente (`versionado.md` reserva 1.0.0 para producción y el kit sigue local-only). Registrado en el [acta](releases/v1.0.0/feedback.md).
- **Kit de nivel 2 → segundo plugin** (2026-09-09): el kit de proceso se queda agnóstico; las skills técnicas por stack irán en un plugin aparte cuando un proyecto lo pida. Sin task.
- **Hosting → sigue local-only** (2026-09-09): sin plazo; se retoma cuando la empresa quiera distribuir.
- **Changelog de cliente → sí, opt-in por proyecto** (2026-09-09, T18): acumulado derivado de las release notes.
- **Contrato de entorno por worktree: al kit; scripts: al proyecto** (2026-09-08, T4). El kit fija lo agnóstico —`environments.md`, marcador `.sdd-env.json`, entradas `env:setup`/`env:clean`/`env:preflight`, predicado— y el proyecto escribe los scripts (nivel 3). El worktree en sí lo gestiona superpowers (Art. IX). La skill `sdd-env` del roadmap **no se escribe**: el baseline sin skill ya resuelve el caso «worktree abierto desde Orca, prepárame el entorno» leyendo `environments.md` (`tests/entorno-worktree-red.md`, E1). Ortogonal a la decisión de nivel 2, que sigue abierta.
- **v0.6.0 es RC hacia v1.0.0** (2026-09-07): entra todo lo pendiente, deuda incluida; nada se arrastra a v0.7.0. Las decisiones abiertas se resuelven dentro de la release.
- **La unidad de descomposición de una skill es el fichero auxiliar, no la skill** (2026-09-07): cada skill nueva suma su `description` a la lista cargada en todas las sesiones y añade un salto de invocación que el agente puede saltarse. Gobierna T2.
- **Distribución: local-only** (2026-09-02). El kit se instala apuntando a la ruta local del repo y lo usa el dev-lead; no se configura remoto hasta que la empresa decida distribuirlo al equipo. Cierra el action item A2-ter, arrastrado desde v0.1.0. Consecuencia asumida: v0.2.0–v0.5.0 quedan cerradas y no distribuidas, y `claude plugin tag --push` no aplica. → [acta v0.5.0](releases/v0.5.0/feedback.md)

## Decisiones pendientes

- Dónde se aloja el repo el día que la empresa quiera distribuirlo (GitHub / Azure DevOps / interno) — sin plazo (2026-09-09: sigue local-only).

## Releases cerradas

### v1.0.0 — 2026-09-09

Planificada como v0.6.0 (RC), cerrada como 1.0.0. Doce tasks y dos patches en tres días: alineación con superpowers 6.3.0 y progressive disclosure (T1, T2), `subagent-driven-development` por defecto con política de modelos (T3), entorno por worktree (T4), spec ligera y `funcional/` por capacidad (T5), `Build-EstimationLog.ps1` y Art. X (T7), Pester + hook (T8), migración de consumidores (T10), gates y reviews proporcionales (T11–T13), comentarios sin citas (T14), release pequeña (T15), tests RED por el hilo (T16), las cinco reglas de producto (T17) y changelog de cliente (T18). **Cerrada, no distribuida** (local-only por decisión). [Release notes](releases/v1.0.0/release-notes.md) · [changelog](changelog.md) · [acta](releases/v1.0.0/feedback.md) · [hallazgos del hackaton](releases/v1.0.0/research-hackaton.md).

smoke: 2026-09-09 · 2 hallazgos (por tramo, saldados en los patches de T7; final: Pester 136/136, `claude plugin validate --strict`, E2E de T16 → 0)

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
| 2026-09-09 | [20260909-120448-patch-0000-estimation-log-residuales](specs/20260909-120448-patch-0000-estimation-log-residuales/patch.md) | Residuales parked de la revisión final de T7 (fixture del corte por encabezado, singular, comprobación de `-Root`). La RC no arrastra deuda. |
| 2026-09-09 | [20260909-103518-patch-0000-estimacion-lite-label](specs/20260909-103518-patch-0000-estimacion-lite-label/patch.md) | `Build-EstimationLog.ps1` no leía la estimación de un walkthrough lite («(de la spec)» en vez de «(del plan)»). Paréntesis opcional tras la etiqueta. |
| 2026-09-02 | [20260902-153722-patch-0000-grilling-reference](specs/20260902-153722-patch-0000-grilling-reference/patch.md) | `sdd-consult` invocaba `superpowers:grilling`, nombre que no resuelve. Corregido a `grilling`. |
