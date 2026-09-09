# Roadmap — sdd-kit

## Release v0.6.0 — RC hacia v1.0.0 · comprometida (2026-09-07)

Decisión del usuario (2026-09-07): v0.6.0 es la **release candidate hacia v1.0.0** — al cerrarla no queda nada pendiente. Entra todo el trabajo pendiente y toda la deuda técnica; las decisiones abiertas se resuelven dentro de la release (🔒 = decisión que falta y quién la debe). Orden: T1 → T2 → T3 (T2 reestructura lo que T1 acaba de tocar; T3 edita `plan-template` después de T1); T4, T5, T7–T9 sin orden fijado hasta resolver sus bloqueos (T6 fusionada en T5 el 2026-09-07).

| # | Task | Origen | Estado |
| --- | --- | --- | --- |
| T1 | [Alineación con superpowers 6.3.0](specs/20260907-151234-task-0000-alineacion-superpowers/spec.md): mapeo vías→carriles, spike en `sdd-consult`, restricciones globales en el plan, versión validada, vigilancia del estado del arte | consulta 2026-09-07 · deuda "override no probado" | ✅ cerrada 2026-09-07 — [walkthrough](specs/20260907-151234-task-0000-alineacion-superpowers/walkthrough.md). El RED recortó: mapeo completo de vías y frase SDD no escritos (baseline limpio); sí: spike → consult, modo sondear, bloque de restricciones |
| T2 | [Progressive disclosure de las skills](specs/20260907-184057-task-0000-progressive-disclosure/spec.md): cada corte validado por **A/B de no-regresión** contra la versión vigente (Art. I ampliado), skill a skill, en tres olas. | consulta 2026-09-07 · deuda de tamaño | ✅ cerrada 2026-09-08 — 11/11 skills con evidencia en `tests/<skill>-ab.md`. **8 cortes aceptados en 6 skills** (conjunto: 8011 → 7054 palabras, −12 %; `sdd-start-task` 1503 → 997, −34 %); **1 corte descartado** (`sdd-consult`: lo que se movía era la definición del propio carril); **4 skills sin candidato** que cumpla el criterio (a)+(b). El pendiente "crea un todo por paso" **se retira sin cambios**: superpowers 6.3.0 conserva esa instrucción en sus skills activas y su Phase E solo la despegó del nombre de la herramienta (`docs/porting-to-a-new-harness.md:469`); la línea del kit ya está en lenguaje de acción |
| T3 | [Workflow y ejecución](specs/20260908-095857-task-0000-workflow-ejecucion/spec.md): `subagent-driven-development` como default, campos `Modelo` (modelo **y** effort) y `Ejecución` en el plan, política de modelos de superpowers, traspaso de las "Restricciones globales" al subagente, code-review en el cierre condicionado al camino en línea. Art. IX nuevo (relación con superpowers: adoptar · aportar · extender ante hueco) | consulta 2026-09-07 · práctica real en Alybo · requisito No-Code del dev-lead | ✅ cerrada 2026-09-08 — [walkthrough](specs/20260908-095857-task-0000-workflow-ejecucion/walkthrough.md). El RED recortó el TDD (el baseline ya lo hace) y cambió la forma de la herencia (quien despacha entrega las restricciones). **Verificado**: code-review (1/1), restricciones aplicadas (3/3 JSDoc vs 0/2), no-regresión de las dos skills (5/5). **Delegación, modelo/effort y traspaso al ejecutor aislado verificados por dogfooding en la misma sesión** (2/2 JSDoc con el bloque en el encargo, frente a 0/2 sin él); la limitación para *sujetos*-subagente queda en T9. El contrato de worktrees se saca de aquí y sigue en T4 |
| T4 | [Entorno por worktree](specs/20260908-135025-task-0000-entorno-por-worktree/spec.md): contrato al kit (`environments-template.md`, marcador `.sdd-env.json`, `env:setup`/`env:clean`/`env:preflight`, predicado en `sdd-start-task`, `sdd-end-*` e `init-*`), scripts al proyecto; el worktree y su borrado se adoptan de superpowers, lo que cierra el ítem que T3 absorbió y la contradicción del override | consulta 2026-09-07 · Alybo task 0000-worktree-env | ✅ cerrada 2026-09-08 — [walkthrough](specs/20260908-135025-task-0000-entorno-por-worktree/walkthrough.md). **La skill `sdd-env` no se escribe**: el baseline sin skill resuelve E1 leyendo `environments.md`. RED 3 fallos → GREEN 3/3 (`env:setup` tras el worktree, `env:clean` antes de la rama, `environments.md` cosechado en brownfield); A/B 5/5 sin degradación. Plantilla implementada **por despacho** a un subagente con revisión y una ronda de arreglos: primera task del kit bajo el default de T3 |
| T5 | [Spec ligera + `funcional/` vivo con delta](specs/20260908-150513-task-0000-spec-ligera-funcional/spec.md): `spec-template.md` reescrita (decisiones a validar · Intent/Scope/Approach · delta por capacidad con GIVEN/WHEN/THEN · aprobaciones), `funcional-template.md` nueva (un fichero por capacidad, título estable como clave de fusión, cinco reglas anti-proliferación), rename `funcional.md` → `funcional/` en siete sitios, `plan-template` recibe riesgos y rollout | consulta 2026-09-07 · backlog OpenSpec | ✅ cerrada 2026-09-08 — [walkthrough](specs/20260908-150513-task-0000-spec-ligera-funcional/walkthrough.md). **Ninguna guidance de conducta en las skills**: el RED mostró que con el delta bien formado el baseline fusiona 3/3, lee la capacidad y no vuelca brownfield; la plantilla basta como receta (E4). A/B 6/6 sin degradación. La propia spec de T5 es el primer ejemplar del formato y su cierre estrena `funcional/flujo-de-task.md` del kit |
| T7 | [`Build-EstimationLog.ps1` genérico distribuido con el kit](specs/20260909-065145-task-0000-estimation-log-script/spec.md): script en `sdd-templates/scripts/`, invocado por `sdd-end-task`/`sdd-end-patch` sin copia en el proyecto, parseo tolerante al formato real, factor global y por Tipo, tests Pester | backlog | ✅ cerrada 2026-09-09 — [walkthrough](specs/20260909-065145-task-0000-estimation-log-script/walkthrough.md). Primer código ejecutable del kit: 26 tests Pester, 15 fixtures versionadas. RED 2/2 exhiben la fila a mano → GREEN 2/2 ejecutan el script del kit. Tres rondas de revisión (dos de task, una de rama con Opus, que encontró lo que las de task no vieron). El log del kit ya se genera; Alybo/MDT borran su copia en T10 |
| T8 | CI que valide frontmatter y estructura de las skills | deuda | ⏳ |
| T9 | Método de test: montar un entorno **sin** una skill (el staging por renombrado la hace ininvocable, no ausente). **Segunda limitación (T3, 2026-09-08)**: un subagente de workflow no tiene herramienta para despachar subagentes, así que toda guidance cuyo efecto sea *despachar* (default de ejecución, modelo y effort, traspaso al ejecutor aislado) no se valida con sujetos-subagente; se valida por dogfooding con el dev-lead como testigo | deuda (task dependencias-declaradas) · T3 | ⏳ es un spike: se resuelve vía `sdd-consult` y puede cerrarse como limitación aceptada con evidencia |
| T10 | Migración de proyectos consumidores entre versiones del kit: marcador de versión del kit en `.docs/sdd/`, sección «Migración desde vX» obligatoria en `release-notes-template.md`, y RED sobre una fixture v0.5.0 antes de decidir si la guidance va a `sdd-init-brownfield` (predicado: `.docs/sdd/` ya existe) o a una skill `sdd-migrate`. Primer caso: borrar el `Build-EstimationLog.ps1` local que T7 sustituye | consulta 2026-09-09 (durante el brainstorming de T7) | ⏳ tras T7 |
| T11 | Gates y reviews proporcionales: (a) plan-gate ligero — `plan-template` presenta un bloque «Decisiones que he tomado yo» (modelo/effort por task, ejecución, coste, riesgos altos) y el resto es para el ejecutor; (b) review adversarial de la **spec** (no del plan) por predicado observable (`mode: full` y crea capacidad, toca contrato público o estimación > media jornada), habilitado por el predicado y activado por el usuario, con un subagente revisor cuyos hallazgos entran en «Decisiones a validar» antes del gate; (c) el artículo de calidad de código de la constitution del proyecto (Art. X del kit: sin comentarios que repitan el código, clean code, umbrales) viaja **literal** en el encargo del **implementador y del revisor** (mismo hueco que las Restricciones globales de T3; en T7 el revisor Sonnet no lo aplicó y el dev-lead lo pidió a mano); (d) el walkthrough registra si hubo review de spec y cuántos hallazgos cambiaron algo, para cruzarlo con el estimation-log. Evidencia previa: Alybo 6106/6121, tensar antes de implementar bajó la implementación 50–80 % | consulta 2026-09-09 (durante el plan de T7) | ⏳ tras T10 |
| — | Kit de nivel 2 (skills técnicas por stack: sql-migration, backend-command/query, backend-feature, frontend-feature) | backlog | 🔒 ¿segundo plugin o carpetas por stack en este repo? — usuario. Si es "carpetas en este repo", se convierte en task de v0.6.0; si es "segundo plugin", sale de este roadmap |

**Verificaciones sin task** (se registran en el cierre de la release):

- **A6** (acta v0.5.0): el plan de T1 expresa la guidance como rango condicional al RED ("0 h si el baseline no falla / Xh si falla").
- **A7** (acta v0.5.0): resolución automática de `superpowers` en entorno limpio — evidencia ya disponible en `installed_plugins.json`: en `D:\code\git\ai-hackathon`, `sdd-kit` instalado el 2026-09-07 a las 12:01:30 y `superpowers` con `auto: true` a las 12:01:48. Se registra en el acta.
- Fila de deuda "`.docs/sdd/templates/` sigue existiendo": ya no existe (commit `a49a845`). Retirada de la tabla.

**Decisiones a resolver dentro de la release** (para llegar a v1.0.0 sin pendientes): nivel 2 (plugin aparte o carpetas); ~~nivel del contrato de worktrees (T4)~~ resuelta el 2026-09-08; dónde se aloja el repo el día que se distribuya (GitHub / Azure DevOps / interno); changelog de cliente además del técnico.

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
| ~~`sdd-start-task` con 1503 palabras~~ — saldada en T2: **997 palabras** tras bajar modo lite, nombrado y overrides a `references/`, con 4/4 escenarios sin degradación. El patrón medido: las skills con **secciones autónomas** admiten cortes grandes (−34 %); las de **checklist** solo −6 % a −14 %, porque el detalle vive dentro de cada paso | — | ✅ T2 |
| ~~El override sobre la clasificación de `brainstorming` está escrito pero **no probado**~~ — saldada en T1: 2/2 baselines con `brainstorming` 6.3.0 real anunciaron `bounded` y conservaron `spec.md` ([RED](../../tests/sdd-start-task-vias-red.md)) | — | ✅ T1 |
| ~~El propio kit aún no ha ciclado ninguna tarea con su flujo~~ — saldada: la task del carril release (20260721) cicló spec → plan → RED/GREEN → cierre | — | — |
| El método de test no sabe montar un entorno **sin** una skill: el staging por renombrado la hace ininvocable, no ausente (task dependencias-declaradas) | Medio | T9 |
| Sin CI que valide frontmatter/estructura de las skills | Bajo | T8 |
| `Build-EstimationLog.ps1`: la rama «truncar antes del siguiente encabezado» de `Get-TimeSection` sin fixture propia; el singular «1 artefacto» sin assert; el `try/catch` de `Resolve-Path` uniformiza cualquier excepción (parked en la revisión final de T7) | Bajo | siguiente task que toque el script |

## Referencias de vigilancia

Se revisan al abrir cada release del kit (Art. V). No son dependencias: son el estado del arte con el que el kit se alinea por conceptos, no por layout.

- superpowers — `RELEASE-NOTES.md` del plugin instalado (`~/.claude/plugins/cache/claude-plugins-official/superpowers/<versión>/`). Validado: 6.3.0 (2026-09-07).
- OpenSpec — <https://openspec.dev/changelog/> · conceptos: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md>. Visto: v1.11.0 (2026-08-26).
- Spec Kit — <https://github.com/github/spec-kit/releases>. Visto: v0.8.7 (2026-05-07).

## Decisiones tomadas

- **Contrato de entorno por worktree: al kit; scripts: al proyecto** (2026-09-08, T4). El kit fija lo agnóstico —`environments.md`, marcador `.sdd-env.json`, entradas `env:setup`/`env:clean`/`env:preflight`, predicado— y el proyecto escribe los scripts (nivel 3). El worktree en sí lo gestiona superpowers (Art. IX). La skill `sdd-env` del roadmap **no se escribe**: el baseline sin skill ya resuelve el caso «worktree abierto desde Orca, prepárame el entorno» leyendo `environments.md` (`tests/entorno-worktree-red.md`, E1). Ortogonal a la decisión de nivel 2, que sigue abierta.
- **v0.6.0 es RC hacia v1.0.0** (2026-09-07): entra todo lo pendiente, deuda incluida; nada se arrastra a v0.7.0. Las decisiones abiertas se resuelven dentro de la release.
- **La unidad de descomposición de una skill es el fichero auxiliar, no la skill** (2026-09-07): cada skill nueva suma su `description` a la lista cargada en todas las sesiones y añade un salto de invocación que el agente puede saltarse. Gobierna T2.
- **Distribución: local-only** (2026-09-02). El kit se instala apuntando a la ruta local del repo y lo usa el dev-lead; no se configura remoto hasta que la empresa decida distribuirlo al equipo. Cierra el action item A2-ter, arrastrado desde v0.1.0. Consecuencia asumida: v0.2.0–v0.5.0 quedan cerradas y no distribuidas, y `claude plugin tag --push` no aplica. → [acta v0.5.0](releases/v0.5.0/feedback.md)

## Decisiones pendientes

Todas con plazo: dentro de v0.6.0 (ver la sección de la release).

- ¿Kit de nivel 2 como segundo plugin o como carpetas por stack en este repo?
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
