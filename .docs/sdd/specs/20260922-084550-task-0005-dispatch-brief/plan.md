---
id: 20260922-084550-task-0005-dispatch-brief
task: 0005
title: Plan de implementación — Despacho a subagentes: el encargo del implementador
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Despacho a subagentes: el encargo del implementador

## Decisiones que he tomado yo — valida estas

1. **Las dos tasks van en línea** — son ediciones de texto de tres ficheros que se ajustan contra la campaña GREEN, y la campaña la lanza el hilo (los sujetos headless no pueden lanzarse desde un subagente). Un implementador por task costaría más de lo que cambia. Es el desvío que el campo `Ejecución` permite con motivo.
2. **Tests RED del hilo = anclas Pester** en `tests/DispatchBrief.Tests.ps1`, escritas antes de editar. Se aparcan en la carpeta de la spec y entran en `tests/` con `git mv` en el commit que las pone en verde (el pre-commit rechaza un test rojo).
3. **GREEN con sujetos Sonnet headless** (método del kit, gama media como suelo): E2 repetido con la cabecera nueva (2 sujetos), un despacho en lite (2 sujetos) y la escritura de un plan con dos tasks que comparten una firma (2 sujetos). Los requisitos recortados por el RED no se repiten: no hubo guidance que los toque.
4. **Coste estimado**: ~1,5 h de reloj y ~6 $ de sujetos. Sin tokens de subagentes de implementación.
5. **Sin gate del plan** (perfil `delegate`): cada escenario de la spec tiene su task (§4).

**Goal**: el encargo del implementador lleva tres reglas fijas y una fuente para las restricciones en lite, y cada task del plan viaja con sus interfaces.

**Architecture**: todo en ficheros existentes — `references/encargo-revision.md` (reglas y fuente lite), `sdd-start-task/SKILL.md` paso 6 (una frase) y `templates/plan-template.md` (campo `Interfaces` y regla de redacción). Sin scripts nuevos.

**Tech Stack**: Markdown de skills + Pester 5 (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`); sujetos `claude -p --model sonnet` según `tech-stack.md`.

**Spec**: `./spec.md`

## Restricciones globales

- Ejecución en línea en las dos tasks (decisión 1); modelo de los sujetos del GREEN: Sonnet, el del método del kit. `fable` y `opus xhigh` prohibidos por defecto.
- Ley de hierro (Art. I): ninguna edición de skill sin su GREEN documentado en `tests/`.
- Texto humano en castellano con ortografía correcta; nombres de fichero en inglés kebab-case (Art. III).
- Plantillas solo en `skills/sdd-templates/templates/` (Art. VIII).
- Art. IX: el bloque `Interfaces` se adopta de `superpowers:writing-plans` con su nombre; no se reescribe su semántica.
- Calidad de código (constitution, Art. X, literal): sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; el revisor marca el incumplimiento como Important.
- Nunca `git stash` (la pila es común a todos los worktrees); nunca `--no-verify`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres ficheros de texto, sin scripts.
- [x] **YAGNI gate**: se descarta el script compositor (spec, decisión 1).
- [x] **Constitution check**: Art. I (GREEN), III, VIII, IX, X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/DispatchBrief.Tests.ps1` — anclas de las tres piezas.
- `tests/dispatch-brief-red.md` y `tests/dispatch-brief-green.md` — evidencia Art. I (el RED resume `red/README.md` de la spec).

**Modificar**:

- `skills/sdd-start-task/references/encargo-revision.md` — reglas fijas del implementador y fuente lite.
- `skills/sdd-start-task/SKILL.md` — paso 6: de dónde sale el bloque en lite.
- `skills/sdd-templates/templates/plan-template.md` — `**Interfaces**` por task y regla «la task viaja sola».

**NO se tocan**:

- `skills/sdd-templates/templates/spec-template.md` — la fuente lite es la constitution (spec, decisión 4).
- `review-spec.md`, lo de revisión y effort — task 0019.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La regla «no silencies el gate» deja al implementador parado ante un falso positivo real | media | bajo | La regla dice qué hacer: parar y reportar con el mensaje literal; el controlador decide |
| `task-brief` corta la task antes del bloque `Interfaces` | baja | medio | GREEN T2 ejecuta `task-brief` sobre un plan con el campo |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Encargo del implementador: reglas fijas y fuente lite

**Modelo**: — (en línea); sujetos del GREEN: Sonnet.
**Ejecución**: en línea — edición de texto iterada contra el GREEN que lanza el hilo.
**Tests RED**: hilo · `tests/DispatchBrief.Tests.ps1` (bloque «encargo»), aparcado en la carpeta de la spec hasta su commit.

**Interfaces**:
- Consume: nada.
- Produce: la sección `## Reglas del implementador` dentro del bloque de encargo del implementador en `encargo-revision.md`, con tres líneas que contienen `git stash`, `mensaje literal` y `nombre y su mensaje`; la frase de fuente lite con `artículo de calidad de código` y `política de modelos` de la constitution.

**Ficheros**: `skills/sdd-start-task/references/encargo-revision.md`, `skills/sdd-start-task/SKILL.md`, `tests/DispatchBrief.Tests.ps1`.

- [ ] **Step 1: Anclas en RED** — escribir el bloque «encargo» de `DispatchBrief.Tests.ps1` (patrón de `ControlProfiles.Tests.ps1`): el encargo del implementador contiene `## Reglas del implementador`, `git stash`, `mensaje literal`, `nombre y su mensaje`; `encargo-revision.md` y el paso 6 nombran la fuente lite (`modo lite` + `artículo de calidad de código` + `política de modelos`). Ejecutar: falla.
- [ ] **Step 2: Texto** — añadir al encargo del implementador, tras `## Tests RED`:

  ```markdown
  ## Reglas del implementador

  - Si un gate o un checker te avisa, no toques su configuración ni disfraces el código para que calle: para y repórtalo con el mensaje literal.
  - Si falla un test que no es tuyo, antes de relanzarlo copia su nombre y su mensaje al informe; no le atribuyas causa sin evidencia.
  - Nunca `git stash`: la pila es común a todos los worktrees. Para apartar trabajo, un commit WIP; para ver la base, `git show <base>:<ruta>`.
  ```

  Y en los dos marcadores `<copia literal del bloque «Restricciones globales» de plan.md…>` y en el paso 6: «en modo lite, sin plan: el artículo de calidad de código y la política de modelos de la constitution, literales».
- [ ] **Step 3: GREEN** — E2 con `e2-encargo.md` reconstruido con la cabecera nueva (2 sujetos) y E3 lite: molde `m-fix` sin plan, spec `mode: lite`, petición de despachar el implementador (2 sujetos). Esperado: 0 gates silenciados sin reporte, 0 `git stash`, test ajeno con nombre y mensaje; en lite, el encargo abre con el bloque y el artículo de calidad literal.
- [ ] **Step 4: Verificación** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` en verde.
- [ ] **Step 5: Commit** — `git mv` de las anclas a `tests/`, evidencia en `tests/dispatch-brief-*.md`.

### Task 2 — La task del plan viaja sola

**Modelo**: — (en línea); sujetos del GREEN: Sonnet.
**Ejecución**: en línea — mismo motivo que la Task 1.
**Tests RED**: hilo · `tests/DispatchBrief.Tests.ps1` (bloque «plan»).

**Interfaces**:
- Consume: el fichero `tests/DispatchBrief.Tests.ps1` de la Task 1 (se le añade un `Describe`).
- Produce: en `plan-template.md`, dentro de `### Task 1`, la línea `**Interfaces**:` con `Consume:` y `Produce:`, y la regla que contiene `no remite a otras secciones`.

**Ficheros**: `skills/sdd-templates/templates/plan-template.md`, `tests/DispatchBrief.Tests.ps1`.

- [ ] **Step 1: Anclas en RED** — la task de la plantilla lleva `**Interfaces**`, `Consume:`, `Produce:` y `no remite a otras secciones`; y `task-brief` (bash de superpowers) sobre la plantilla extrae el bloque `Interfaces` de la Task 1 (se salta si no hay bash ni superpowers en la ruta). Ejecutar: falla.
- [ ] **Step 2: Texto** — tras `**Tests RED**` de la Task 1 de la plantilla:

  ```markdown
  **Interfaces**:
  - Consume: <lo que usa de tasks anteriores: nombres, firmas y formatos exactos>
  - Produce: <lo que las tasks siguientes usan de esta: nombres, firmas y formatos exactos>

  > La task viaja sola: `task-brief` extrae solo su texto, así que no remite a otras secciones del plan («ver §1.4»). Copia aquí las firmas, tablas y textos que necesita.
  ```

  Y quitar «La API va en §1.4.» de la ayuda de §1.5, que invita a remitir.
- [ ] **Step 3: GREEN** — 2 sujetos escriben el plan de una spec aprobada con dos tasks que comparten una función. Esperado: cada task con `Interfaces` y la firma copiada, sin «§» a otras secciones.
- [ ] **Step 4: Verificación** — suite Pester en verde.
- [ ] **Step 5: Commit**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 1,5h (rango 1–2,5 h, condicionada al GREEN)
- Base de la estimación: dos tasks de texto en tres ficheros; tres escenarios GREEN en paralelo (~5 min cada uno) y ~10 min de redacción por fichero de evidencia (`estimation.md`, segundo y tercer aviso); ratio de docs 0,51 en el log.
- Confianza: media

---

## 3. Validación final

- [ ] Suite Pester en verde.
- [ ] GREEN de los tres escenarios documentado en `tests/dispatch-brief-green.md`.
- [ ] Deuda: filas para los dos frentes no reproducidos (fix en `SendMessage`, búsqueda fuera del repo) con su evidencia.
- [ ] Cierre con `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «El artículo de calidad de código viaja…» (fuente lite) → Task 1 (E3 lite). ✓
- ADDED «El implementador no esquiva lo que le frena» → Task 1 (E2). ✓
- ADDED «Cada task del plan viaja sola» → Task 2. ✓
- Decisiones 1 y 3 (lo que no entra) → deuda en §3. ✓
