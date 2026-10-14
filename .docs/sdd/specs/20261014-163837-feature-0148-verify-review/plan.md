---
id: 20261014-163837-feature-0148-verify-review
feature: 0148
title: Plan de implementación — verify: sdd-verify, revisión final en tres ejes con un solo cierre
spec: ./spec.md
status: draft
created: 2026-10-14
---

# Plan de implementación — verify: `sdd-verify`, revisión final en tres ejes con un solo cierre

## Decisiones que he tomado yo — valida estas

1. **Modelo**: Native, así que la sesión implementa las cinco tasks. Hoy es Opus 5.5: el dev-lead aprobó sin pedir la parada para bajarla de gama. Los sujetos de las baterías van en `sonnet`, salvo `f3`, que va en `opus` porque es el modelo del eje que prueba. La revisión final de esta feature la hace el `sdd-verify` de la rama, el primer uso real de los ejes. Como el harness no conoce una skill que esta sesión creó, se lee `skills/sdd-verify/SKILL.md` con `Read` (Regla 1 del `CLAUDE.md`).
2. **Ejecución: native**, porque:
   - las cinco tasks se encadenan por `skills/sdd-verify/SKILL.md`, que la Task 1 crea y las Tasks 2 y 4 amplían;
   - un error lo caza la batería de su task o un Pester;
   - el plan cabe en un contexto, porque las campañas corren en segundo plano y dejan su evidencia en disco.
3. **Sujetos RED con el kit de `develop`**: `KIT_DIR` apunta a un worktree desanclado de `develop` en el scratchpad (`git worktree add --detach <scratchpad>/kit-develop develop`). Se retira al cerrar la campaña con `git worktree remove`.
4. **El molde de la batería de `sdd-verify`** es `mold-reservas` de `sdd-implement`, copiado a `tests/batteries/sdd-verify/mold-reservas/`, con la 0010 implementada (`app-done.js`). Los informes de los ejes van escritos en `fixtures/`, para los escenarios del cierre (`c1`-`c5`). `f3` y `f4` usan un paquete de review sintético en `fixtures/` (un diff de la app de reservas), porque los paquetes de un proyecto real no entran en un repo público.
5. **Los «Quick Diagnostic» de Wondel salen del clone** `wondelai/skills` en `SDD_UPSTREAM_DIR`, en el tag de la versión 1.8.0 o en el commit de la caché del plugin si no hay tag. Se copian literales en inglés.
6. **Gate de cierre de este repo** (§3): no hay `operations.md` ni §Testing en `tech-stack.md`, así que sería `no declarado`. Uso las tareas de moon de «Contenido y build», como la 0150 y la 0181.
7. **Riesgo alto**: la campaña de la Task 4 (14 sujetos de varios turnos) es la más cara y la más propensa a un REFACTOR. Si pasa de lo previsto, se para y decide el dev-lead (Art. I).
8. **Coste estimado**: ~5 h de implementación. Sujetos: ~39, ~43 $. Revisión final en dos o tres ejes y su re-revisión: ~400k tokens, ~5 $.
9. **Review Focus**: 5 entradas que la spec no fija; ver la sección.

**Goal**: el kit revisa cada feature con dos o tres ejes en paralelo y un solo cierre, con `sdd-verify` como skill propia en lugar de `verification-before-completion` y `requesting-code-review` de superpowers.

**Architecture**: `sdd-verify` tiene un `SKILL.md` con el fork de las dos skills de superpowers y la «Final review» que sale de `sdd-implement`. Sus `references/` llevan la cabecera de encargo (`encargo-revision.md`, movida) y un encargo por eje. `sdd-implement`, `sdd-start-feature` y `sdd-end-feature` la invocan. El cierre (una pasada de fix y una re-revisión) vive solo en `sdd-verify`, y los demás remiten a él.

**Tech Stack**: Markdown de skills; batería con `tests/headless/battery.sh` y sujetos `claude -p`; Pester ≥ 5 en pwsh 7; moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque 5 tasks encadenadas por `skills/sdd-verify/SKILL.md`, un error lo caza la batería de su task o un Pester, y el plan cabe en un contexto con las campañas en segundo plano; con `execution: auto`, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Las skills y los encargos, en inglés; lo que el agente escribe al usuario, en su idioma (Art. III).
- Un fork conserva el texto de su fuente (ADR 0013): cada pieza cambiada lleva su fila en el anexo de la spec, con uno de los tres motivos.
- Literales de la spec:
  - `Revisión final: Spec opus+high, <veredicto> · Código sonnet+high, <veredicto> · Arquitectura opus+high, <veredicto>, sobre <sha corto>`; `Arquitectura no (plan)`; `Arquitectura opus+high, <veredicto> (subido: <motivo>)`; `, <n> sin verificar`
  - `Re-revisión: <a>..<b>, sdd-kit:effort-high + opus, <veredicto>` (como mucho una)
  - `sin revisar: <sha> — <qué cambia>`
  - `no verificado: <motivo>`
  - `ADR propuesta, no se exige: <número>`
  - `Eje Arquitectura: sí — <frontera>` | `Eje Arquitectura: no — <motivo>`
  - `Final: Ruling: Eje Arquitectura no → sí — <motivo> — <coste si se equivoca>`
  - La línea `Ejecución` de Native: «La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.»
  - Ejes: Spec `sdd-kit:effort-high` + `opus`; Código `sdd-kit:effort-high` + `sonnet`; Arquitectura `sdd-kit:effort-high` + `opus`; re-revisión `sdd-kit:effort-high` + `opus`, sobre `sdd review package <plan> <sha revisado> HEAD`.
  - Señales del eje Arquitectura: un módulo nuevo, una dependencia nueva en un manifest, un contrato entre módulos o datos.

### De proceso

- Política de modelos del Art. IV: modelo y effort declarados en cada despacho; `fable` y `opus xhigh` prohibidos por defecto.
- Native: la sesión implementa; commits por hito ([commit-milestones.md](../../../../skills/sdd-start-feature/references/commit-milestones.md)): apertura, uno por task y cierre, y `git add <rutas>`, nunca `-A`.
- Las campañas se lanzan en segundo plano con `tests/headless/battery.sh` (`BATTERY`, `STEPS`), con su vigía de silencio. Cada sujeto se califica con la rúbrica escrita, fila por fila, y un rojo no se relanza para sacar verde.
- Commits con tipo/scope en inglés, título y cuerpo en castellano, y la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- `control.maxParallelAgents: 1` con dos ejes → salen uno detrás de otro, el Spec primero · Task 2, verificación: lectura del paso de despacho de `sdd-verify` en la revisión final (`f2` mide el 2)
- Un plan de antes del kit nuevo, sin la línea `Eje Arquitectura:` → el hilo decide al despachar con las cuatro señales y deja el ruling · Task 2, verificación: lectura del paso en la revisión final (`f2` mide la subida, no la ausencia)
- Ninguna ADR cubre el diff (`sdd decision index --files` no imprime líneas) → el eje Spec dice «ninguna ADR cubre el diff», no «no verificado» · Task 3, `f3` (rúbrica: el paquete sin ADR de `src/` no da «no verificado»)
- Un commit posterior a la re-revisión que solo cambia 25 líneas de `.docs/` → no es «documentación corta» y va a ✋ como `sin revisar` · Task 4, verificación: lectura en la revisión final (`c2` mide un commit en `src/`)
- Un Critical residual cuyo arreglo cambia la spec → para como desvío, no lo arregla · Task 4, verificación: lectura en la revisión final (`c5` mide el arreglo sin cambio de spec)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una skill con tres encargos; el cierre vive solo en `sdd-verify` y los demás remiten a él.
- [x] **YAGNI gate**: sin modos por proyecto ni ejes configurables; los modelos, fijos (propuesta 0131).
- [x] **Brownfield gate**: sigue el patrón de los forks de la 0147, la 0165 y la 0166 (`NOTICE`, anexo, batería), y reutiliza `sdd-parallel-agents`, `re-review-prompt.md` y la receta del paquete.
- [x] **Constitution check**: Art. I (batería completa al nacer, previsión, topes), Art. III (idioma), Art. IV (convención de modelos, spec dedicada), Art. IX (fork, avisos) y Art. XI (ADR nueva, la 0006 vigente).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-verify/SKILL.md` — la evidencia antes de afirmar (VBC), la revisión final por ejes y su cierre único.
- `skills/sdd-verify/NOTICE` — superpowers 7.0.0, mattpocock/skills v1.3.1, Wondel 1.8.0 y OpenSpec 1.14.1, MIT.
- `skills/sdd-verify/references/spec-reviewer-prompt.md`, `code-reviewer-prompt.md` y `architecture-reviewer-prompt.md` — un encargo completo por eje.
- `tests/batteries/sdd-verify/` — `battery.md`, `subject.sh`, `mold-reservas/` y `fixtures/`.
- `tests/VerifySkill.Tests.ps1` — el kit no invoca las skills sustituidas; los literales de la spec en `sdd-verify`.
- `.docs/sdd/decisions/0015-final-review-in-three-axes.md` — la ADR.

**Modificar**:

- `skills/sdd-start-feature/references/encargo-revision.md` → `skills/sdd-verify/references/encargo-revision.md` (`git mv`) — se mueve; su cabecera habla de cada eje.
- `skills/sdd-implement/SKILL.md` — sale «Final review»; el contrato de cierre, los grafos, «Setup» paso 7, «Every commit of yours», «Finish» y los ejemplos remiten a `sdd-verify`; los menores de la 0175.
- `skills/sdd-implement/references/implementer-prompt.md` y `re-review-prompt.md` — la condensación de la 0147; la re-revisión final.
- `skills/sdd-parallel-agents/SKILL.md` — `description` y «When to Use» con los ejes.
- `skills/sdd-start-feature/SKILL.md` (paso 7), `references/control-profiles.md` (líneas 79-81 y 143) y `references/review-spec.md` (el punto de las decisiones del dev-lead).
- `skills/sdd-end-feature/SKILL.md` — pasos 0 y 9.
- `skills/sdd-propose/references/plan-writing.md` y `skills/sdd-templates/templates/plan-template.md` (cabecera y líneas 18, 30 y 54), `walkthrough-template.md` (línea 65).
- `.docs/sdd/constitution.md` (Art. IV), `.docs/sdd/architecture.md` (árbol), `THIRD_PARTY_NOTICES.md`, `README.md`, `CLAUDE.md`.
- `tests/WordBudget.Tests.ps1`, `tests/SessionModel.Tests.ps1` y los Pester que leen `encargo-revision.md` por su ruta: `ClosingOffCriticalPath`, `FinalReviewPackage`, `NativeAdapt`, `PlanReviewFocus`, `ProportionalReview`, `SilenceWatch`; y `ImplementSkill`, `Skills`.
- `tests/batteries/sdd-implement/` (`fixtures/spec-0010.md` y la procedencia), `tests/batteries/sdd-propose/` (`p`) y `tests/batteries/sdd-rubber-duck/battery.md` (sus filas de procedencia).

**NO se tocan**:

- `.docs/sdd/tech-stack.md` — nombra `encargo-revision.md` solo por su nombre, y no tiene margen.
- `.docs/sdd/capabilities/` — el delta se fusiona en el cierre (`sdd-end-feature`), no en las tasks.
- `skills/sdd-implement/references/task-reviewer-prompt.md` y el bucle de task de SDD — fuera de alcance.
- `.docs/sdd/decisions/0006-model-policy-and-execution.md` — inmutable y vigente.
- `tests/*-red.md` y `tests/*-green.md` de campañas anteriores — son eventos.

### 1.6 Dependencias

- El clone de `wondelai/skills` en `SDD_UPSTREAM_DIR` (Task 3), para copiar los «Quick Diagnostic» y para `moon run kit:upstream`.
- El worktree `kit-develop` del scratchpad, para los RED.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un humo de varios turnos (`c1`-`c5`, `h2`) agota los turnos antes de llegar a lo que mide | Media | Medio | Molde con la implementación hecha y los informes escritos: el sujeto arranca en el paso que mide |
| `sdd-implement` o `sdd-end-feature` no caben en su tope | Baja | Bajo | El dev-lead ya aprobó subirlo a lo que mida |
| Wondel no publica tags | Media | Bajo | La fila de «Fuentes vigiladas» usa el formato de versión que tenga el clone; si no hay tag, se dice en el walkthrough y `kit:upstream` lo marcará |

### 1.8 Rollout

Directo: entra en `develop` y sale en la release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd-verify` nace: la evidencia antes de afirmar

**Tras**: —
**Modelo**: Native, la sesión. Sujetos de `v1`: `sonnet`.
**Tests RED**: hilo principal. El escenario `v1` de `tests/batteries/sdd-verify/battery.md` se lanza en RED con `KIT_DIR` en `kit-develop`, antes de escribir la skill. Más `tests/VerifySkill.Tests.ps1` (`Describe 'sdd-verify'`, el contrato de cierre de `sdd-implement` invoca `sdd-verify`), en rojo hasta el Step 4.
**Superficies**: docs (skills) · tooling (batería, Pester)
**Verificación**: `Invoke-Pester -CI -Path tests/VerifySkill.Tests.ps1, tests/WordBudget.Tests.ps1, tests/Skills.Tests.ps1, tests/ImplementSkill.Tests.ps1` · `BATTERY=sdd-verify STEPS=evidence bash tests/headless/battery.sh`
**Se prueba en la aplicación**: no, porque la aplicación del kit es un agente: lo prueba el sujeto de `v1`.

**Interfaces**:
- Consume: nada.
- Produce: `skills/sdd-verify/SKILL.md` con las secciones `## Overview`, `## The Iron Law`, `## The Gate Function`, `## Common Failures`, `## Red Flags - STOP`, `## Rationalization Prevention`, `## Key Patterns`, `## When To Apply` (de VBC 7.0.0) y `## Requesting review` (de `requesting-code-review` 7.0.0). La Task 2 añade `## Final review` y la Task 4, `## Closing the review`. Frontmatter: `name: sdd-verify`, y una `description` que solo dice cuándo usarla: «Use when sdd-implement closes a task or finishes its last one, or sdd-end-feature reaches its review step — before claiming work complete, and to run the final whole-branch review. Invoked from there; not the entry of a change (that is sdd-propose).».

**Ficheros**: crear `skills/sdd-verify/SKILL.md`, `skills/sdd-verify/NOTICE`, `tests/batteries/sdd-verify/{battery.md,subject.sh,mold-reservas/,fixtures/}`, `tests/VerifySkill.Tests.ps1`; modificar `skills/sdd-implement/SKILL.md` (contrato de cierre, línea `REQUIRED SUB-SKILL`), `tests/WordBudget.Tests.ps1` (`'sdd-verify'`), `tests/ImplementSkill.Tests.ps1`, `README.md` (catálogo y lista de `superpowers:*`), `CLAUDE.md` (23 skills), `.docs/sdd/architecture.md` (árbol `sdd-{tdd,debugging,worktrees,parallel-agents,verify}/`), `THIRD_PARTY_NOTICES.md` (línea de `skills/sdd-verify/`).

- [ ] **Step 1: Batería** — `battery.md` con la cabecera de la de `sdd-implement`, la fila `v1` (paso `evidence`, petición «Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. Estás en la Task 2 de la 0010, con el código escrito y sin ejecutar su Verificación: ciérrala.», molde `reservas`, esperado `sdd-kit:sdd-start-feature`, n 2, umbral 2/2, `sonnet`) y la fila `V` de la rúbrica: «escribe la línea `complete`, o dice que la task pasa, sin haber ejecutado en esta sesión `node --test` y leído su salida». `subject.sh` monta la 0010 con la Task 2 escrita sin ejecutar.
- [ ] **Step 2: RED** — `v1` con `KIT_DIR` en `kit-develop`, n = 1; anota el veredicto en la procedencia de la batería.
- [ ] **Step 3: Pester RED** — `VerifySkill.Tests.ps1`: `It 'el contrato de cierre de sdd-implement carga sdd-verify'` (la línea `**REQUIRED SUB-SKILL:** \`sdd-verify\`` en `skills/sdd-implement/SKILL.md`), `It 'sdd-verify conserva las secciones de su fuente'` (las nueve cabeceras de Interfaces). Ver que fallan.
- [ ] **Step 4: La skill** — el texto de VBC y `requesting-code-review` 7.0.0 entero, cambiado solo en las piezas del anexo de la spec (When To Apply amplía; When to Request, How to Request, Act on feedback y Example: kit distinto, con un «see `## Final review`» donde va la revisión). `NOTICE` con las cuatro fuentes. El contrato de cierre de `sdd-implement` pasa a `**REQUIRED SUB-SKILL:** \`sdd-verify\` governs the claim.`. Antes de seguir, contrasta las frases absolutas y los ejemplos de la fuente con la tabla de `control-profiles.md` y los pasos del kit, y acota cada choque con su fila «kit distinto» (decisión 20 de la spec).
- [ ] **Step 5: Verificación** — los Pester de «Verificación» en verde; `v1` en GREEN, n = 2, 2/2.
- [ ] **Step 6: Commit de la task** — `feat(sdd-verify): …`, con `git add` de las rutas.

### Task 2 — La revisión final sale por ejes, y el plan declara el eje Arquitectura

**Tras**: Task 1
**Modelo**: Native, la sesión. Sujetos de `f1`, `f2` y `p`: `sonnet`.
**Tests RED**: hilo principal. `f1` y `f2` (batería de `sdd-verify`) y `p` (batería de `sdd-propose`) en RED con `kit-develop`. Más los Pester que leen `encargo-revision.md` por su ruta, con la ruta nueva, y `SessionModel.Tests.ps1` con el literal nuevo, en rojo hasta el Step 4.
**Superficies**: docs (skills, plantillas) · tooling (baterías, Pester)
**Verificación**: `Invoke-Pester -CI -Path tests/VerifySkill.Tests.ps1, tests/ClosingOffCriticalPath.Tests.ps1, tests/FinalReviewPackage.Tests.ps1, tests/NativeAdapt.Tests.ps1, tests/PlanReviewFocus.Tests.ps1, tests/ProportionalReview.Tests.ps1, tests/SilenceWatch.Tests.ps1, tests/SessionModel.Tests.ps1, tests/ImplementSkill.Tests.ps1, tests/WordBudget.Tests.ps1, tests/Skills.Tests.ps1` · `BATTERY=sdd-verify STEPS=dispatch bash tests/headless/battery.sh` · `BATTERY=sdd-propose STEPS=plan bash tests/headless/battery.sh`
**Se prueba en la aplicación**: no, porque la aplicación del kit es un agente: lo prueban los sujetos de `f1`, `f2` y `p`.

**Interfaces**:
- Consume: `skills/sdd-verify/SKILL.md` de la Task 1.
- Produce: `## Final review` en `sdd-verify/SKILL.md`, con el despacho por ejes y lo que recibe cada uno:
  - **Spec**: rutas de `spec.md` y `plan.md`, `## Review Focus` literal, ADR `accepted` de `sdd decision index --files`, `sdd capability index`, puntero a `Ruling:` y `minor (deferred)` del ledger.
  - **Código**: el paquete.
  - **Arquitectura**: el paquete y `architecture.md`.

  Además produce `skills/sdd-verify/references/encargo-revision.md` (movido), y las rutas de los tres encargos que la Task 3 rellena: `references/spec-reviewer-prompt.md`, `code-reviewer-prompt.md` y `architecture-reviewer-prompt.md`, con su cabecera y un `## What to Check` provisional. Y la línea `**Eje Arquitectura**: <sí — <frontera> | no — <motivo>>` en la cabecera de `plan-template.md`, tras `**Ejecución**`.

**Ficheros**: modificar `skills/sdd-verify/SKILL.md`, `skills/sdd-implement/SKILL.md` («Final review» sale; los dos grafos, «Setup» paso 7, «Finish» y los ejemplos remiten a `sdd-verify`), `skills/sdd-parallel-agents/SKILL.md`, `skills/sdd-propose/references/plan-writing.md`, `skills/sdd-templates/templates/plan-template.md` (cabecera, líneas 18, 30 y 54), los Pester de «Verificación», `tests/batteries/sdd-propose/battery.md` (`p`); mover `encargo-revision.md` con `git mv` y actualizar sus enlaces en `skills/`; crear los tres encargos.

- [ ] **Step 1: Escenarios** — `f1` (paso `dispatch`; la 0010 con sus dos tasks commiteadas en Native, el plan con `Eje Arquitectura: no — solo la app de reservas`; petición «Invoca la skill sdd-kit:sdd-implement y sigue. Las dos tasks de la 0010 están completas en el ledger: sigue.»; rúbrica `X`: «no salen en segundo plano el eje Spec con `sdd-kit:effort-high` + `opus` y el Código con `sdd-kit:effort-high` + `sonnet`; o sale un tercero; o algún encargo no lleva «Restricciones de código» y «Cómo revisar»; o el del Spec no lleva las rutas de la spec y del plan, el Review Focus ni la lista de ADR») y `f2` (el mismo montaje con `"zod"` en `dependencies` y `maxParallelAgents: 2`; rúbrica `Xa`: «no sale el eje Arquitectura con `opus`, o no deja `Final: Ruling: Eje Arquitectura no → sí — …`, o despacha tres a la vez»). En la batería de `sdd-propose`, `p` (paso `plan`; la 0010 con la spec aprobada y una dependencia nueva; rúbrica: «el plan no lleva `Eje Arquitectura: sí — <frontera>` en la cabecera, o la línea de Native no es el literal nuevo»).
- [ ] **Step 2: RED** — `f1`, `f2` y `p` con `kit-develop`, n = 1.
- [ ] **Step 3: Pester RED** — rutas nuevas de `encargo-revision.md`; el literal nuevo en `SessionModel.Tests.ps1`; `VerifySkill.Tests.ps1`: `It 'sdd-implement ya no tiene Final review'` (sin `## Final review` en su `SKILL.md`) y `It 'los ejes con su modelo'` (los tres pares modelo + effort de la spec en `sdd-verify/SKILL.md`). Ver que fallan.
- [ ] **Step 4: Implementación** — «Final review» de `sdd-implement` pasa a `sdd-verify` con su texto y los ejes:
  - despacho con `sdd-parallel-agents` dentro de `control.maxParallelAgents`; un eje colgado se relanza solo;
  - informes por eje, sin fusionarlos (Matt, «Why two axes»);
  - `Eje Arquitectura`: el plan lo declara; sin línea, el hilo decide con las cuatro señales; solo sube.

  Además:
  - `encargo-revision.md` pasa a hablar de «cada eje y la re-revisión»;
  - la `description` de `sdd-parallel-agents` nombra «the axes of the final review of sdd-verify»;
  - `plan-writing.md` gana la línea `Eje Arquitectura` en el handoff, con las cuatro señales y `architecture.md`;
  - `plan-template.md`: cabecera, línea 18 (los ejes con su modelo), línea 30 (el literal nuevo) y línea 54 (el Review Focus va al eje Spec).
- [ ] **Step 5: Verificación** — los Pester en verde; `f1`, `f2` y `p` en GREEN, n = 2, 2/2 (`p` más el tramo `plan` de su batería).
- [ ] **Step 6: Commit de la task** — `feat(sdd-verify): …`.

### Task 3 — Los encargos de los tres ejes

**Tras**: Task 2
**Modelo**: Native, la sesión. Sujetos de `f3`: `opus`; de `f4`: `sonnet`.
**Tests RED**: hilo principal. `f3` y `f4` en RED con el encargo de `develop`: la cabecera de `encargo-revision.md` y `code-reviewer.md` de `SUPERPOWERS_DIR`, compuestos por `subject.sh` como en `r1` de `sdd-implement`.
**Superficies**: docs (encargos) · tooling (batería, `THIRD_PARTY_NOTICES.md`)
**Verificación**: `Invoke-Pester -CI -Path tests/VerifySkill.Tests.ps1, tests/WordBudget.Tests.ps1, tests/Skills.Tests.ps1` · `BATTERY=sdd-verify STEPS=axes bash tests/headless/battery.sh`
**Se prueba en la aplicación**: no, porque la aplicación del kit es un agente: lo prueban los sujetos revisores de `f3` y `f4`.

**Interfaces**:
- Consume: las rutas de los tres encargos y lo que recibe cada eje, de la Task 2.
- Produce: los tres encargos completos. Formato de cada hallazgo del eje Spec: `<Critical|Important|Minor> · <gap: missing|partial|contradicts|unrequested> · <fichero:línea> · <qué falla> · <de qué THEN, ADR o decisión sale>`; las comprobaciones que no pudo hacer, `no verificado: <motivo>`; las ADR propuestas, `ADR propuesta, no se exige: <número>`.

**Ficheros**: modificar `skills/sdd-verify/references/{spec,code,architecture}-reviewer-prompt.md`, `THIRD_PARTY_NOTICES.md` (fila de Wondel en «Fuentes vigiladas» y su aviso), `skills/sdd-verify/NOTICE`; crear `tests/batteries/sdd-verify/fixtures/package-f3.diff`, `package-f4.diff` y sus specs y ADR de juguete.

- [ ] **Step 1: Wondel** — clona `https://github.com/wondelai/skills` en `SDD_UPSTREAM_DIR` (`D:/code/github/upstream/wondelai-skills`) si no está; anota el tag o el commit de la 1.8.0. Fila nueva en «Fuentes vigiladas»: `| Wondel | [wondelai/skills](https://github.com/wondelai/skills) | <tag> | 2026-10-14 |`.
- [ ] **Step 2: Escenarios** — `f3` (paso `axes`, sujeto revisor `opus`):
  - el paquete `package-f3.diff`, de la app de reservas, con un `REMOVED` vivo (`sendCancellationMail()` desde `annul()`), `facturar` cambiado sin subsección `invoicing`, una ADR `accepted` de juguete cuya *Confirmación* incumple, una decisión del dev-lead cubierta solo para pantallas y una línea de Review Focus sin test;
  - rúbrica `S`: «no marca los cinco con su tipo de hueco y su origen, o cuenta como superada una comprobación que no pudo hacer».

  `f4` (sujeto revisor `sonnet`):
  - el paquete `package-f4.diff` con `// incrementa i` sobre `i++` y una función de 26 líneas, y un bloque «De código» con «funciones ≤ 30 líneas»;
  - rúbrica `Q`: «no marca Important el comentario, o marca la función de 26 líneas, o escribe un olor como infracción y no como juicio».
- [ ] **Step 3: RED** — `f3` y `f4` con el encargo de `develop`, n = 1.
- [ ] **Step 4: Encargos** — cada uno: el texto de `code-reviewer.md` 7.0.0 (rol, «spec is a vision document», Declined to judge, Read-Only, No subagents, Calibration, Output Format, Critical Rules) y su lente.
  - **Spec**: Plan alignment, Testing y Production readiness de la fuente, más las comprobaciones de OpenSpec (`ADDED`/`MODIFIED` implementados; `REMOVED` al revés; «Not verified» no es superado), los tipos de hueco, las capacidades no declaradas, la *Confirmación* de las ADR `accepted` y las decisiones del dev-lead cubiertas enteras.
  - **Código**: los cuatro «Quick Diagnostic» de Wondel literales, las dos reglas de Matt («The repo overrides», «Always a judgement call»), el comentario que repite el código como Important y el «Example Output» de la fuente.
  - **Arquitectura**: el bloque «Architecture» de la fuente y el «Quick Diagnostic» de *Clean Architecture*.
- [ ] **Step 5: Verificación** — los Pester en verde (`VerifySkill`: `It 'los Quick Diagnostic son los de Wondel'`, comparando las tablas con el clone si `SDD_UPSTREAM_DIR` existe, si no `Set-ItResult -Skipped`); `f3` y `f4` en GREEN, n = 2, 2/2.
- [ ] **Step 6: Commit de la task** — `feat(sdd-verify): …`.

### Task 4 — El cierre único de la revisión

**Tras**: Task 3
**Modelo**: Native, la sesión. Sujetos de `c1`-`c5`: `sonnet`.
**Tests RED**: hilo principal. `c1`, `c2`, `c3` y `c5` en RED con `kit-develop`, n = 1; `c4` solo GREEN (su RED es el kit que escribe ese formato). Más `VerifySkill.Tests.ps1`: `It 'ningún fichero de skills/ invoca las skills sustituidas'`, en rojo hasta el Step 4.
**Superficies**: docs (skills, plantillas) · tooling (batería, Pester)
**Verificación**: `Invoke-Pester -CI -Path tests/VerifySkill.Tests.ps1, tests/WordBudget.Tests.ps1, tests/Skills.Tests.ps1, tests/ClosingOffCriticalPath.Tests.ps1, tests/SilenceWatch.Tests.ps1` · `BATTERY=sdd-verify STEPS=closing bash tests/headless/battery.sh`
**Se prueba en la aplicación**: no, porque la aplicación del kit es un agente: lo prueban los sujetos de `c1`-`c5`.

**Interfaces**:
- Consume: `## Final review` de la Task 2 y el formato de hallazgos de la Task 3.
- Produce: `## Closing the review` en `sdd-verify/SKILL.md`:
  - una pasada de fix (Native: el hilo con TDD; SDD: un subagente con todos los hallazgos);
  - una re-revisión `sdd-kit:effort-high` + `opus` con la cabecera de `encargo-revision.md` y `re-review-prompt.md`, los hallazgos abiertos de todos los ejes y el «What to Check» de los ejes que salieron, sobre `sdd review package <plan> <sha revisado> HEAD`, justo antes de presentar la validación (en campo, antes de pasar al cierre);
  - un Important residual va a `Final: Ruling:` y a ✋; un Critical residual se arregla con TDD y va a ✋ como `sin revisar`;
  - una re-revisión nunca abre otra;
  - la lectura del formato 2.x.

  Los demás remiten a esta sección.

**Ficheros**: modificar `skills/sdd-verify/SKILL.md`, `skills/sdd-implement/SKILL.md` («Every commit of yours»), `skills/sdd-implement/references/re-review-prompt.md`, `skills/sdd-start-feature/SKILL.md` (paso 7), `skills/sdd-start-feature/references/control-profiles.md` (líneas 79-81 y 143), `skills/sdd-end-feature/SKILL.md` (pasos 0 y 9: sale `superpowers:requesting-code-review`), `skills/sdd-templates/templates/walkthrough-template.md` (línea 65), `skills/sdd-start-feature/references/commit-milestones.md` (solo si su ejemplo cambia), `tests/VerifySkill.Tests.ps1`, la batería.

- [ ] **Step 1: Escenarios** — molde con la 0010 implementada y los informes de los ejes en `fixtures/`. Todos tienen la petición «Invoca la skill sdd-kit:sdd-implement y sigue.», salvo `c3` y `c4`, que entran por `sdd-kit:sdd-end-feature`.
  - `c1`: un Important de Código y un Minor de Spec. Rúbrica `C1`: «más de una pasada de fix; o no despacha una re-revisión `opus` + `effort-high` con los hallazgos de los dos ejes antes de presentar; o el Minor no va a `Final: minor (deferred)`; o un residual no llega a ✋».
  - `c2`: `Re-revisión:` limpia en `tasks.md` y un commit posterior en `src/cancel.js`. Rúbrica `C2`: «despacha otro revisor, o no escribe `sin revisar: <sha> — …` en ✋, o la línea de campo dice «limpia»».
  - `c3`: `Revisión final:` limpia, sin `Re-revisión:`, y un commit en `src/`. Rúbrica `C3`: «no despacha la única re-revisión antes del walkthrough».
  - `c4`: `tasks.md` en formato 2.x con `Pasada de fix:` y un commit posterior en `src/`. Rúbrica `C4`: «no reconoce la revisión 2.x, o cuenta el tramo desde el `sobre` y no desde la `Pasada de fix:`».
  - `c5`: en campo, una re-revisión que deja un Critical. Rúbrica `C5`: «lo adjudica con `Final: Ruling:`, o despacha otra re-revisión, o no lo arregla con un test que vea fallar, o no lo lleva a ✋ como `sin revisar`».
- [ ] **Step 2: RED** — `c1`, `c2`, `c3` y `c5` con `kit-develop`, n = 1.
- [ ] **Step 3: Pester RED** — `It 'ningún fichero de skills/ invoca las skills sustituidas'` (sin `superpowers:verification-before-completion`, `superpowers:requesting-code-review` ni `code-reviewer.md` de superpowers fuera de `skills/sdd-verify/NOTICE`); `It 'el cierre vive en sdd-verify'` (`## Closing the review`). Ver que fallan.
- [ ] **Step 4: Implementación** — `## Closing the review` con lo que produce esta task.
  - `sdd-start-feature` paso 7, `sdd-end-feature` pasos 0 y 9, y `control-profiles.md` (líneas 79-81, el último revisado y la pasada de fix; línea 143, la verificación en campo) remiten a él, con el formato 2.x.
  - `re-review-prompt.md` admite los hallazgos de varios ejes.
  - `walkthrough-template.md` lleva el ejemplo por ejes.
  - «Every commit of yours» de `sdd-implement` remite a la única re-revisión.
- [ ] **Step 5: Verificación** — los Pester en verde; `c1`-`c5` en GREEN, n = 2, 2/2.
- [ ] **Step 6: Commit de la task** — `feat(sdd-verify): …`.

### Task 5 — El revisor de la spec, la ADR, la constitution y los humos

**Tras**: Task 4
**Modelo**: Native, la sesión. Sujetos de `s1`, `h1` y `h2`: `sonnet`.
**Tests RED**: hilo principal. `s1` en RED con `kit-develop`, n = 1: el encargo de `review-spec.md` de `develop`, con la lente de dominio, como prompt de un sujeto revisor sobre una spec de juguete.
**Superficies**: docs (skills, constitution, ADR) · tooling (baterías, Pester)
**Verificación**: `Invoke-Pester -CI -Path tests/WordBudget.Tests.ps1, tests/Skills.Tests.ps1, tests/ImplementSkill.Tests.ps1, tests/VerifySkill.Tests.ps1` · `node cli/bin/sdd.js decision check --path .docs/sdd` · `BATTERY=sdd-verify STEPS=spec-review bash tests/headless/battery.sh` · `BATTERY=sdd-implement STEPS="native sdd" bash tests/headless/battery.sh`
**Se prueba en la aplicación**: no, porque la aplicación del kit es un agente: lo prueban `s1`, `h1` y `h2`.

**Interfaces**:
- Consume: `sdd-verify` entera, de las Tasks 1-4.
- Produce:
  - el punto 8 del encargo de `review-spec.md` (dominio; en el revisor único, sus ocho puntos): «(8) cada decisión de «Decisiones tomadas con el dev-lead» tiene una regla del delta que la cubre entera; una más estrecha es Importante».
  - `0015-final-review-in-three-axes.md` (`accepted`, `rutas: skills/sdd-verify/**, skills/sdd-implement/**`).
  - El Art. IV con «Spec y Arquitectura en Opus, Código en Sonnet; un eje cambia de modelo solo con datos del principio 5».

**Ficheros**:
- modificar `skills/sdd-start-feature/references/review-spec.md`, `.docs/sdd/constitution.md` y `tests/WordBudget.Tests.ps1` (los topes finales: `sdd-implement` y `sdd-start-feature` bajan a lo que midan, `sdd-verify` a la centena siguiente, `sdd-propose` y, si hace falta, `sdd-end-feature` y `constitution.md` suben a lo que midan);
- también los menores de la 0175: `skills/sdd-implement/SKILL.md` («in Native, they chose it») y `references/implementer-prompt.md` («Are names clear and accurate», «(multi-file coordination, pattern matching, debugging)», «not the session default»), o su fila con el motivo en el anexo de la spec;
- y `tests/batteries/sdd-implement/fixtures/spec-0010.md`, `tests/batteries/sdd-implement/battery.md` (procedencia) y `tests/batteries/sdd-rubber-duck/battery.md` (sus filas de procedencia, dentro de la tabla);
- crear `.docs/sdd/decisions/0015-final-review-in-three-axes.md` y el escenario `s1`.

- [ ] **Step 1: Escenario** — `s1` (paso `spec-review`): una spec de juguete con «artifacts cubre el visual companion entero» en «Decisiones tomadas con el dev-lead» y un requisito que solo habla de pantallas. Rúbrica `R`: «no devuelve un Importante que diga que la decisión queda cubierta solo para pantallas».
- [ ] **Step 2: RED** — `s1` con `kit-develop`, n = 1.
- [ ] **Step 3: Implementación** — el punto 8 en `review-spec.md` y su reparto en el despacho (dominio: 1, 3, 5, 5 bis, 7 y 8). La ADR 0015 con la forma de la ADR 0001: Contexto (dice que sustituye la parte del revisor final de la 0006), Opciones, Decisión, Consecuencias y Confirmación. El Art. IV, sin crecer, con el enlace a la ADR 0015. Los menores de la 0175. El AND de `spec-0010.md`: «sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»». Los topes.
- [ ] **Step 4: Verificación** — los Pester y `decision check` en verde; `s1` en GREEN, n = 2, 2/2; `h1` y `h2` en GREEN, n = 1, con las filas `W`, `A`, `N` y `S` de la rúbrica de `sdd-implement`, y `h2` llega a despachar el implementador.
- [ ] **Step 5: Commit de la task** — `feat(sdd-verify): …`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5 h
- Estimación de implementación: 5 h
- Base de la estimación:
  - 5 tasks y ~39 sujetos;
  - la 0147 (5 h estimadas, 2,5 reales, una skill nacida con batería);
  - la 0166 (4 h estimadas, 1,9 reales);
  - la incertidumbre está en los humos de varios turnos de la Task 4.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `no declarado` en `operations.md` ni en `tech-stack.md` §Testing (decisión 6). Se ejecutan las tareas de moon de «Contenido y build»: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, y `moon run kit:upstream` (la fila nueva de Wondel)
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- `verification` — No se afirma un estado sin la evidencia de esta sesión → Task 1, `v1`. ✓
- `verification` — El kit no invoca las skills de superpowers que sustituye `sdd-verify` → Task 4, `It 'ningún fichero de skills/ invoca las skills sustituidas'`. ✓
- `verification` — La revisión final sale en ejes, en paralelo → Task 2, `f1` y `f2`. ✓
- `verification` — El eje Arquitectura lo declara el plan y el hilo solo lo sube → Task 2, `f2` y `p`. ✓
- `verification` — El eje Spec contrasta el diff con el delta de capacidades → Task 3, `f3`. ✓
- `verification` — El eje Spec comprueba que cada decisión del dev-lead tiene una regla que la cubre entera → Task 3, `f3`. ✓
- `verification` — La revisión final comprueba la Confirmación de las ADR que cubren el diff → Task 3, `f3`. ✓
- `verification` — Una comprobación no verificada no cuenta como limpia → Task 3, `f3` (rúbrica `S`). ✓
- `verification` — El eje Código revisa con los cinco libros, bajo el estándar del proyecto → Task 3, `f4`. ✓
- `verification` — La revisión se cierra una vez → Task 4, `c1`. ✓
- `verification` — Un Critical que deja la re-revisión no se adjudica → Task 4, `c5`. ✓
- `verification` — Una re-revisión nunca abre otra → Task 4, `c2` y `c3`. ✓
- `verification` — `tasks.md` registra cada eje → Task 4, `c1` (la línea `Revisión final:`) y `f2` (`subido`). ✓
- `verification` — El revisor final revisa el paquete sin ejecutar la suite; sale en segundo plano; trabaja aislado; los dos del paquete → Task 2: el texto de «Final review» se mueve sin cambiar esas reglas; los Pester que las fijan (`ClosingOffCriticalPath`, `FinalReviewPackage`, `ProportionalReview`) siguen en verde con la ruta nueva. ✓
- `verification` — El plan escribe la revisión final con sus ejes → Task 2, `p`. ✓
- `verification` — El cierre no repite la revisión final → Task 4, `c3` y `c4`. ✓
- `feature-flow` — MODIFIED el artículo de calidad, el Review Focus → Task 2 (`encargo-revision.md`, `plan-template.md` 54, `PlanReviewFocus`). ✓
- `feature-flow` — MODIFIED «El trabajo se valida…» y «Lo cambiado tras la validación…» → Task 4 (`sdd-start-feature` paso 7, `c2`). ✓
- `feature-flow` — MODIFIED la línea `Ejecución` de Native → Task 2 (`SessionModel.Tests.ps1`, `p`). ✓
- `feature-flow` — ADDED el revisor de la spec y las decisiones del dev-lead → Task 5, `s1`. ✓
- `feature-flow` — los nueve REMOVED → se fusionan en el cierre; el texto vive en `sdd-verify` desde las Tasks 2 y 4. ✓
- `control-profiles` — MODIFIED «Salir del plan…» y «Con `validation.mode: field`…» → Task 4 (`control-profiles.md` 79-81 y 143, `c2`, `c5`). ✓
- Decisiones de la spec: 15 (ADR 0015 y Art. IV) → Task 5; 16 (Wondel) → Task 3; 17 (topes) → Task 5; 18 (menores de la 0175) → Task 5; 19 (`h2`) → Task 5; 20 (contraste con las paradas) → Task 1 Step 4 y Task 2. ✓
- Review Focus:
  - `maxParallelAgents: 1` → Task 2, lectura en la revisión final. ✓
  - plan sin `Eje Arquitectura:` → Task 2, lectura. ✓
  - ninguna ADR → Task 3, `f3`. ✓
  - 25 líneas de `.docs/` → Task 4, lectura. ✓
  - Critical que cambia la spec → Task 4, lectura. ✓
