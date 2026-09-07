---
id: 20260907-151234-task-0000-alineacion-superpowers
task: 0000
title: Plan de implementación — Alineación del kit con superpowers 6.3.0
spec: ./spec.md
status: approved
created: 2026-09-07
---

# Plan de implementación — Alineación del kit con superpowers 6.3.0

**Goal**: que el kit traduzca las vías de `brainstorming` 6.3.0 a sus carriles sin perder `spec.md`, absorba el spike en `sdd-consult`, propague las restricciones de la spec al plan, y declare y vigile la versión de superpowers validada.

**Architecture**: cuatro tasks en orden de coste creciente y de dependencia. Los documentos del kit (Task 1) no son guidance y no arrastran Art. I: van primero y se cierran solos. La guidance (Tasks 2–4) sigue el ciclo RED → implementación condicionada → GREEN sobre una sola campaña de cuatro escenarios con superpowers 6.3.0 **real** (el harness lo tiene instalado; las skills del kit se entregan por prompt desde el working tree). Cada pieza de guidance se escribe solo si su escenario RED falla; el plan estima esa parte como rango condicional (action item A6).

**Tech Stack**: Markdown. Sin build ni CI. Tests de skills con subagentes **Sonnet** sobre fixture desechable en el scratchpad de sesión, verificación en disco y pregunta a posteriori (`tech-stack.md` §Tests). El plan fija el modelo de los subagentes aquí: Sonnet para ejecutar escenarios (conducta bajo guidance, no juicio), el hilo principal para verificar y redactar la evidencia.

**Spec**: `./spec.md`

## Global Constraints

- Texto humano en castellano con ortografía correcta; nombres de skill y fichero en inglés kebab-case (Art. III).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only (Art. VI).
- Ninguna edición de `skills/*/SKILL.md` ni de `skills/sdd-templates/templates/*.md` sin RED→GREEN documentado en `tests/` (Art. I). README, constitution y roadmap quedan fuera del Art. I.
- Sin bump de versión; changelog en `[Unreleased]` (Art. V).
- Ninguna convención de Art. IV cambia: mismo naming, mismas carpetas; el bloque nuevo de plantilla es opcional y `sdd-end-task` no lo comprueba.
- Versión y fecha exactas a declarar: `superpowers 6.3.0`, `2026-09-07`.
- Las skills se entregan al subagente **por prompt** (contenido íntegro del working tree); `brainstorming` y `writing-plans` NO se pegan: las resuelve el harness (plugin instalado 6.3.0), que es justo lo que se prueba.
- Prompts de RED y GREEN idénticos palabra por palabra; una copia fresca de fixture por escenario; molde sin `.git`.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: se consideró "solo re-testar la fila actual" (más simple): queda como resultado posible si el RED no falla. No se crea ninguna skill nueva (decisión registrada en el roadmap: la unidad de descomposición es el auxiliar, no la skill).
- [ ] **YAGNI gate**: ningún `references/` todavía (eso es T2); ninguna abstracción; los únicos ficheros nuevos son la evidencia de test.
- [ ] **Brownfield gate**: se respeta el patrón de las skills (predicado, tabla de racionalizaciones, receta para fallos de forma). No se toca el tamaño de `sdd-start-task` ni el "crea un todo por paso" (T2). No se toca `sdd-start-release`.
- [ ] **Constitution check**: Arts. I–VIII revisados en `spec.md` §7.1; sin excepciones.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-start-task-vias-red.md` y `tests/sdd-start-task-vias-green.md` — escenarios E1 (bounded) y E4 (ambigüedad SDD).
- `tests/sdd-consult-spike-red.md` y `tests/sdd-consult-spike-green.md` — escenario E2.
- `tests/plan-template-restricciones-red.md` y `tests/plan-template-restricciones-green.md` — escenario E3.

(Los `-green.md` solo existen para los escenarios cuyo RED falló; si un RED sale limpio, su fichero RED lo documenta y no hay GREEN.)

**Modificar**:

- `README.md` §Dependencias — versión validada y regla de re-test.
- `.docs/sdd/constitution.md` Art. V — revisión de compatibilidad por release.
- `.docs/sdd/roadmap.md` — sección "Referencias de vigilancia".
- `skills/sdd-start-task/SKILL.md` — paso 2 (Enrutado), tabla de overrides, overview *(condicionado al RED)*.
- `skills/sdd-consult/SKILL.md` — paso 2 (modo sondear) y tabla de racionalizaciones *(condicionado al RED)*.
- `skills/sdd-templates/templates/plan-template.md` — bloque "Restricciones globales" *(condicionado al RED)*.

**NO se tocan**:

- `.docs/sdd/tech-stack.md` — el README es la fuente única de dependencias; no se repite la versión.
- `skills/sdd-start-release/SKILL.md` — la vigilancia del estado del arte es del kit, no de los proyectos consumidores.
- `skills/sdd-start-patch/SKILL.md` — el mapeo `bounded → patch` solo lo nombra `sdd-start-task`; patch ya gatea causa raíz.
- Todo lo de T2 y T3 (tamaño de skills, `subagent-driven-development`, TDD, code review, cierre).

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica. El contrato relevante es el texto de `brainstorming` y `writing-plans` 6.3.0, verificado en `spec.md` §1.

---

## 2. Tasks

Cuatro tasks → `tasks.md` como registro vivo.

### Task 1 — Documentos del kit: versión validada, Art. V y referencias de vigilancia

**Ficheros**: modificar `README.md`, `.docs/sdd/constitution.md`, `.docs/sdd/roadmap.md`

- [ ] **Step 1: Implementación** — en `README.md`, tras el párrafo "El kit invoca **6 skills de superpowers** …", añadir:

```markdown
**Versión validada**: superpowers **6.3.0** (revisado el 2026-09-07). El kit traduce las vías de `brainstorming` (spike / bounded / architectural) a sus carriles y adopta el bloque de restricciones globales de `writing-plans`; ese mapeo se re-testa (Art. I) en cada minor de superpowers antes de cerrar una release del kit.
```

En `.docs/sdd/constitution.md`, Art. V, sustituir el párrafo por:

```markdown
SemVer en `.claude-plugin/plugin.json`. Cada release: bump de versión + entrada en `.docs/sdd/changelog.md`. Los usuarios actualizan con `/plugin marketplace update`. Cada release del kit revisa además la compatibilidad con la versión de superpowers instalada (sus `RELEASE-NOTES.md`) y actualiza la versión validada que declara el README; si una minor cambia una skill que el kit invoca, el mapeo se re-testa antes de cerrar.
```

En `.docs/sdd/roadmap.md`, antes de "## Decisiones tomadas", añadir:

```markdown
## Referencias de vigilancia

Se revisan al abrir cada release del kit (Art. V). No son dependencias: son el estado del arte con el que el kit se alinea por conceptos, no por layout.

- superpowers — `RELEASE-NOTES.md` del plugin instalado (`~/.claude/plugins/cache/claude-plugins-official/superpowers/<versión>/`). Validado: 6.3.0 (2026-09-07).
- OpenSpec — <https://openspec.dev/changelog/> · conceptos: <https://github.com/Fission-AI/OpenSpec/blob/main/docs/concepts.md>. Visto: v1.11.0 (2026-08-26).
- Spec Kit — <https://github.com/github/spec-kit/releases>. Visto: v0.8.7 (2026-05-07).
```

- [ ] **Step 2: Build** — no aplica (Markdown). Equivalente: la versión aparece una sola vez fuera de la constitution.

Ejecutar: `grep -rn "6\.3\.0" README.md .docs/sdd/constitution.md .docs/sdd/tech-stack.md`
Esperado: coincidencias en `README.md` (la declaración) y ninguna en `tech-stack.md`.

- [ ] **Step 3: Verificación** — releer los tres ficheros: README declara versión y regla; Art. V obliga a revisar; roadmap tiene la sección con las tres referencias y sus versiones vistas.

- [ ] **Step 4: Commit** — `docs(kit): versión de superpowers validada, revisión por release en Art. V y referencias de vigilancia`

### Task 2 — RED: campaña de cuatro escenarios con superpowers 6.3.0 real

**Ficheros**: crear `tests/sdd-start-task-vias-red.md`, `tests/sdd-consult-spike-red.md`, `tests/plan-template-restricciones-red.md`

- [ ] **Step 1: Montar la fixture** — molde "Bookline" en el scratchpad de sesión, **sin `.git`**: app Node mínima de pedidos (`src/order-list.js` con listado paginado, `src/order-api.js` con formato de `id` documentado como contrato), `.docs/sdd/` con `constitution.md` (git-flow `feature/*` desde `develop`, testing obligatorio, retrocompatibilidad en contratos públicos), `mission.md`, `tech-stack.md`, `roadmap.md`, `estimation.md` (módulo activo), `specs/` vacío. Para E3, además una spec aprobada `specs/20260907-000000-task-0000-filtro-estado/spec.md` con restricciones explícitas en §7: `Node >= 20`, "sin dependencias nuevas", nombres de fichero `order-*.js`, formato de estado exacto `pending | paid | shipped`. Una copia por escenario con `git init` + rama `develop` + commit inicial dentro de la copia.

- [ ] **Step 2: Lanzar los escenarios** — cuatro subagentes **Sonnet**, uno por escenario, en paralelo, cada uno sobre su copia. Prompt **neutro**: rol de dev del equipo, ruta de la copia, la skill del kit pegada íntegra (la que toque), la petición. Sin mencionar vías, artefactos, modos, gates ni qué se espera que lea.

  | | Skill pegada | Petición | Hipótesis a refutar |
  | --- | --- | --- | --- |
  | E1 | `sdd-start-task` | «Añade un filtro por estado a la pantalla de listado de pedidos.» | `brainstorming` 6.3.0 anuncia `bounded` y el agente obedece "no spec file": no crea `spec.md` o implementa sin gate |
  | E2 | `sdd-consult` | «¿Se puede exportar el listado de pedidos a CSV sin meter dependencias? Pruébalo rápido.» | El agente fabrica artefactos (carpeta en `specs/`, rama) o conserva el código de la prueba sin etiquetarlo desechable |
  | E3 | `plan-template.md` + `spec.md` aprobada (en disco) | «La spec del filtro está aprobada. Escribe el plan de implementación calcando la plantilla.» | Las restricciones de §7 no llegan al plan como bloque ni a las tasks |
  | E4 | `sdd-start-task` | «Arranca la task del filtro por estado siguiendo el flujo SDD del proyecto.» | El agente interpreta "SDD" como `subagent-driven-development` (`.superpowers/sdd/`, `task-brief`, dispatch) |

- [ ] **Step 3: Verificar en disco** — por escenario, sin fiarse del autoinforme:

  - E1: `git branch` (rama `feature/*`), `ls .docs/sdd/specs/` (carpeta `*-task-0000-*` con `spec.md`), `git status` (código intacto), último mensaje = spec presentada y parada en el gate. Anotar la vía que anunció `brainstorming` y qué hizo el agente con ella.
  - E2: `ls .docs/sdd/specs/` (vacío), `git branch` (solo `develop`/`master`), `git status` (limpio o con la prueba etiquetada como desechable), último mensaje = recomendación.
  - E3: `plan.md` existe; buscar cada restricción de §7 (`>= 20`, `order-`, `pending | paid | shipped`, "dependencias") en el plan y en qué sección aparece.
  - E4: `ls -a` (¿`.superpowers/`?), transcript (¿dispatch de subagentes?, ¿`task-brief`?), qué carpeta de spec creó.

- [ ] **Step 4: Preguntar a posteriori** — con cada escenario cerrado: E1 «¿qué vía anunció brainstorming y por qué escribiste (o no) la spec?»; E2 «¿qué hiciste con el código de la prueba?»; E3 «¿de dónde sacaste las restricciones de las tasks?»; E4 «¿qué entendiste por "flujo SDD"?». Registrar las frases textuales: son la materia de las tablas de racionalizaciones.

- [ ] **Step 5: Escribir la evidencia** — tres ficheros RED con la estructura de `tests/sdd-start-task-lite-red.md`: método, escenarios, verificado en disco, positivos que NO requieren guidance, fallos reproducidos con citas, fallos no reproducidos. **Un RED limpio recorta la task** (Art. I): el fichero lo documenta y ese ítem de la Task 3 no se ejecuta.

- [ ] **Step 6: Commit** — `test(task): RED de las vías de brainstorming 6.3.0, el spike en consult y las restricciones del plan`

### Task 3 — Implementación condicionada al RED

**Ficheros**: modificar `skills/sdd-start-task/SKILL.md`, `skills/sdd-consult/SKILL.md`, `skills/sdd-templates/templates/plan-template.md` — **cada uno solo si su escenario falló**.

- [ ] **Step 1 (si E1 falló): mapeo vías → carriles en `sdd-start-task`** — en el paso 2 (Enrutado) sustituir «tres salidas:» por «cuatro salidas:» y anteponer:

```markdown
pregunta de viabilidad cuya salida es una respuesta y no código que se conserve ("¿se puede…?", "pruébalo rápido") → NO es una task, es un spike: `sdd-consult`;
```

Y en la tabla de overrides sustituir la fila «Clasificación de `brainstorming` (spike / bounded / architectural) …» por:

```markdown
| Vía que anuncia `brainstorming` (spike / bounded / architectural) | Se traduce al carril del kit y se anuncian las dos: `spike` → `sdd-consult` · `bounded` → `sdd-start-patch` si es bug determinista, **modo lite** si es feature pequeña (lo decide el predicado) · `architectural` → modo full. Su regla "no spec file, no implementation plan document" NO aplica: en el kit toda task tiene `spec.md` y su gate en los dos modos — el diseño que superpowers presenta en chat es lo que el modo lite persiste como spec corta. |
```

Añadir a la tabla de racionalizaciones la frase textual del RED (no inventada), con la forma:

```markdown
| "<cita textual de E1>" | La vía de brainstorming clasifica la conversación; el carril del kit clasifica el artefacto. `bounded` es lite con spec, no "sin spec". |
```

- [ ] **Step 2 (si E4 falló): desambiguar SDD** — en el overview de `sdd-start-task`, tras «Este proyecto trabaja con **Spec-Driven Development**:», insertar:

```markdown
(SDD aquí es *Spec*-Driven; el `subagent-driven-development` de superpowers es un modo de ejecución, no este proceso.)
```

- [ ] **Step 3 (si E2 falló): modo sondear en `sdd-consult`** — en el paso 2 («Elige el modo»), añadir una tercera viñeta:

```markdown
   - **Sondear / probar viabilidad** ("¿se puede…?", "pruébalo rápido", salida = una respuesta) → es un spike: explora y prueba lo que haga falta, pero todo lo que construyas es **desechable y se etiqueta así**; la salida es una recomendación en la conversación. Nada persiste: ni carpeta de spec, ni rama, ni código conservado. Si la respuesta es "sí y lo queremos", eso es una petición nueva: handoff al carril (paso 5).
```

Añadir a la tabla de racionalizaciones la frase textual del RED:

```markdown
| "<cita textual de E2>" | Un spike produce una respuesta. Conservar el código es otra petición: se enruta al carril, que gatea. |
```

- [ ] **Step 4 (si E3 falló): bloque "Restricciones globales" en `plan-template.md`** — tras `**Spec**: \`./spec.md\`` y antes de la primera `---`, insertar:

```markdown
## Restricciones globales

> Copia **literal** de las restricciones de la spec que atan a todas las tasks —versiones mínimas, límites de dependencias, naming, valores exactos— más los artículos de la constitution que aplican. Una línea por restricción. Cada task las hereda aunque no las repita. Escribe "ninguna" si no hay.

- <restricción, con el valor exacto de la spec>
```

- [ ] **Step 5: Verificación estructural** — frontmatter YAML válido en las skills tocadas; Markdown sin tablas rotas.

Ejecutar: `head -4 skills/sdd-start-task/SKILL.md skills/sdd-consult/SKILL.md`
Esperado: `---`, `name:`, `description:` en cada una.

- [ ] **Step 6: Commit** — `feat(skills): mapeo de las vías de brainstorming a los carriles, spike en consult y restricciones globales en el plan` (título ajustado a lo que realmente cambió).

### Task 4 — GREEN y refactor

**Ficheros**: crear los `tests/*-green.md` de los escenarios que fallaron en RED.

- [ ] **Step 1: Re-lanzar** — mismos escenarios que fallaron, prompts **idénticos**, copias frescas del molde, skills modificadas pegadas por prompt. Mismo modelo (Sonnet).

- [ ] **Step 2: Verificar en disco** — las mismas comprobaciones del Step 3 de la Task 2, y veredicto contra cada fallo del RED.

- [ ] **Step 3: REFACTOR** — si el GREEN destapa un hueco de la propia skill (instrucción que contradice otra, caso sin cubrir), corregir y re-verificar en el mismo fichero GREEN.

- [ ] **Step 4: Commit** — `test(task): GREEN de las vías de brainstorming, el spike y las restricciones del plan`

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h (consulta previa, brainstorming, spec, apertura de release, plan)
- Estimación de implementación: **2 h – 4 h**, condicionada al RED (action item A6): Task 1 ≈ 0,5 h · Task 2 ≈ 1,5 h (fixture nueva + 4 escenarios) · Task 3 = **0 h si ningún RED falla / 1 h si fallan los tres** · Task 4 = **0 h / 1 h**, en proporción a los escenarios que fallen.
- Base de la estimación: 4 tasks; la fixture se reconstruye (el scratchpad es por sesión). Referencias del `estimation-log`: `modo-lite` 3 h/0,5 h y `dependencias-declaradas` 3 h/0,3 h, ambas infladas por contar guidance que el RED desautorizó — de ahí el rango. Escenario más probable según la evidencia disponible: E1 falla (el riesgo está verificado en el texto de 6.3.0 y F1 del RED del lite ya no lo tapa), E2 y E3 inciertos, E4 limpio.
- Confianza: media — la incertidumbre está en cuántos escenarios fallan, no en la implementación.

---

## 3. Validación final

- [ ] README, Art. V y roadmap declaran versión, regla y referencias (Task 1).
- [ ] Tres ficheros RED en `tests/`; un GREEN por cada RED que falló, con veredicto por fallo.
- [ ] Criterios de éxito de la spec §2: 1 (E1 verde o RED limpio documentado), 2 (E2), 3 (E3), 4 (Task 1), 5 (roadmap: ya cubierto por la apertura de v0.6.0 + sección de referencias).
- [ ] Frontmatter YAML válido en las skills tocadas.
- [ ] Cierre vía `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- §4.1 enrutado por vías → Task 2 E1 + Task 3 Step 1 + Task 4. ✓
- §4.2 spike en consult → Task 2 E2 + Task 3 Step 3 + Task 4. ✓
- §4.3 desambiguar SDD → Task 2 E4 + Task 3 Step 2. ✓
- §4.4 bloque de restricciones → Task 2 E3 + Task 3 Step 4 + Task 4. ✓
- §4.5 README versión validada → Task 1. ✓
- §4.6 Art. V → Task 1. ✓
- §4.7 roadmap: alcance y relectura del ítem 2 → hechos en la apertura de v0.6.0 (commit del roadmap); referencias de vigilancia → Task 1. ✓
- Edge case "ratchet sube la vía" → sin task (coincide con lite → full). ✓
- Edge case "superpowers < 6.3.0" → sin task; el mapeo solo se activa si hay vía anunciada. ✓
- NO objetivos (T2, T3, worktrees, brownfield) → sin task; listados en §1.1 como NO se toca. ✓
- A6 → sección Estimación expresada como rango condicional. ✓
