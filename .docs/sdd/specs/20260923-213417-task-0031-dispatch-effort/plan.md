---
id: 20260923-213417-task-0031-dispatch-effort
task: 0031
title: Plan de implementación — Effort real al despachar
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — Effort real al despachar

## Decisiones que he tomado yo — valida estas

1. **Task 1, Modelo**: Sonnet, `general-purpose`. **El effort no está disponible en esta sesión: hereda el de la sesión.** Los tipos `sdd-kit:effort-*` nacen en esta task, y Claude Code carga los agentes al arrancar. Es el caso de la spec «Sin effort en el harness, el plan lo dice», aplicado a la propia task. Gama media porque la task interpreta prosa.
2. **Task 2 en línea** (campaña GREEN y evidencia): la lanza el hilo, porque los sujetos `claude -p` y el proxy se gestionan desde el scratchpad de la sesión (`tech-stack.md`, «Sujetos headless»), y un subagente no hereda ese método.
3. **Escenario del GREEN**: un molde con un plan de una sola task cuyo `Modelo` sigue la plantilla nueva. El sujeto la ejecuta con `superpowers:subagent-driven-development` y el kit del worktree (`--plugin-dir`), detrás del proxy. Se mide la llamada `Agent` del stream y el `effort` de las peticiones del subagente. 2 sujetos. Sonda de control: la de `probe-plain` ya hecha en el RED (`model` sin tipo → effort de la sesión), sin relanzarla.
4. **Los dos THEN de texto** («el plan lo dice» y «el revisor de spec») se verifican con el test Pester, no con sujetos: son el texto que el hilo copia. En la evidencia van como `suite`, no como ejecución real.
5. **Coste**: ~1 h en total; GREEN ≤ 2,5 $ (queda ~4 $ del techo común de 6 $).

**Goal**: el effort que declara un plan del kit es el que viaja en cada petición del subagente, vía tipos de agente del plugin.

**Architecture**: tres definiciones `agents/effort-<nivel>.md` con `model: inherit` y `effort` en el frontmatter. El plan y el despacho del revisor de spec nombran el par `subagent_type` + `model`. El Art. IV dice cómo se cumple y qué hacer si el harness no lo expone.

**Tech Stack**: skills en Markdown, agentes de plugin de Claude Code, Pester 5.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Constitution Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Literales exactos de la spec: `sdd-kit:effort-low`, `sdd-kit:effort-medium`, `sdd-kit:effort-high`; «effort: no disponible en este harness, hereda el de la sesión»; `model: inherit`.

### De proceso

- Política de modelos del Art. IV; `fable` y `opus xhigh` prohibidos por defecto.
- Ejecución por defecto: `subagent-driven-development`; Task 2 en línea (decisión 2).
- Commits: tipo/scope en inglés, cuerpo en castellano, un commit por hito.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres ficheros de agente genéricos por effort, no por rol.
- [x] **YAGNI gate**: sin `xhigh` ni `max`, que ningún plan usa por defecto.
- [x] **Constitution check**: Art. I (RED medido en `red/`, GREEN en la Task 2), Art. IV (política intacta, se corrige el hecho de la herencia), Art. IX (superpowers no cubre el effort en Claude Code).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `agents/effort-low.md`, `agents/effort-medium.md`, `agents/effort-high.md`: tipos de agente del plugin.
- `tests/AgentDefinitions.Tests.ps1`: ya escrito por el hilo (RED 9/9).
- `tests/dispatch-effort-red.md`, `tests/dispatch-effort-green.md`: evidencia (Task 2).

**Modificar**:

- `skills/sdd-templates/templates/plan-template.md`: campo `Modelo` (línea 125).
- `skills/sdd-start-task/references/review-spec.md`: línea 49.
- `.docs/sdd/constitution.md`: Art. IV, segundo párrafo.
- `.docs/sdd/tech-stack.md`: §Distribución.
- `README.md`: una línea en la instalación con `npx skills add`.

**NO se tocan**:

- `skills/sdd-start-task/SKILL.md` paso 6: basta el campo `Modelo` (spec, decisión 7).
- `.claude-plugin/plugin.json`: Claude Code descubre `agents/` en la raíz del plugin sin declararlo. La versión se sube en el cierre de la release.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El cuerpo del agente sustituye el system prompt de `general-purpose` y el implementador rinde peor | Media | Medio | Cuerpo neutro que remite al encargo; el GREEN mira que el implementador termina la task |
| Un plan con Haiku y `effort-*`: el effort se ignora en silencio | Baja | Bajo | El campo `Modelo` dice que Haiku va con `general-purpose` sin tipo de effort |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Tipos de agente y texto que los nombra

**Modelo**: Sonnet, `general-purpose` · effort: no disponible en este harness, hereda el de la sesión (los tipos nacen en esta task)
**Tests RED**: hilo principal · `tests/AgentDefinitions.Tests.ps1`, escrito y en RED (9/9), sin commitear: va en el commit de la task
**Superficies**: tooling · docs
**Verificación**: `Invoke-Pester -Path tests/AgentDefinitions.Tests.ps1,tests/Skills.Tests.ps1,tests/Manifests.Tests.ps1,tests/ProportionalReview.Tests.ps1 -Output Detailed`

**Interfaces**:
- Consume: nada.
- Produce: los tipos `sdd-kit:effort-low|medium|high` (fichero `agents/effort-<nivel>.md`, frontmatter `name: effort-<nivel>`, `description`, `model: inherit`, `effort: <nivel>`, sin `tools`); el literal «effort: no disponible en este harness, hereda el de la sesión».

**Ficheros**: crear `agents/effort-{low,medium,high}.md`; modificar `plan-template.md`, `review-spec.md`, `constitution.md`, `tech-stack.md`, `README.md`.

- [ ] **Step 1: Agentes.** Tres ficheros con esta forma (cambia el nivel):

```markdown
---
name: effort-medium
description: Subagente del kit SDD con effort medium. Úsalo cuando el plan declara effort medium; el modelo se pasa en el despacho.
model: inherit
effort: medium
---

Eres un subagente despachado por el hilo principal. El encargo que recibes es tu instrucción completa: síguelo, usa las herramientas que necesites y devuelve el informe que te pide.
```

- [ ] **Step 2: `plan-template.md:125`.** Sustituye la línea del campo `Modelo` por:

```markdown
**Modelo**: <modelo **y** effort, los dos explícitos, con el despacho literal: `subagent_type: sdd-kit:effort-<low|medium|high>` + `model: <sonnet|opus>` — `Agent` no tiene parámetro de effort y, sin tipo, el subagente hereda el de la sesión. Con Haiku, que no admite effort: `general-purpose` + `model: haiku`. Si el harness no expone el effort (kit sin sus agentes, otro harness): «effort: no disponible en este harness, hereda el de la sesión». Gama media como suelo si hay que interpretar prosa; el tier más barato solo si esta task ya trae el código escrito o es un arreglo mecánico. `fable` y `opus xhigh` exigen justificación escrita aquí mismo>
```

- [ ] **Step 3: `review-spec.md:49`.** Cambia «Subagente `general-purpose`, **modelo Sonnet, effort medium**, uno por lente.» por «Subagente `subagent_type: sdd-kit:effort-medium` con `model: sonnet`, uno por lente.» y deja el resto de la línea igual.

- [ ] **Step 4: Art. IV.** En el segundo párrafo, sustituye «—omitir el modelo hereda el de la sesión, normalmente el más caro, y declarar el modelo sin el effort lo deja caer al defecto de ese modelo—» por «—omitir el modelo hereda el de la sesión, normalmente el más caro, y declarar el modelo sin el effort hace que el subagente herede el de la sesión—». Tras la frase que acaba en «…arreglos mecánicos de un fichero.», añade: «En Claude Code el effort viaja en el tipo de agente: el kit entrega `sdd-kit:effort-low`, `-medium` y `-high`, y el despacho pasa ese `subagent_type` junto al `model`. Si el harness no expone el effort, el plan lo escribe así: «effort: no disponible en este harness, hereda el de la sesión».»

- [ ] **Step 5: `tech-stack.md` §Distribución y README.** En §Distribución, una viñeta: los tipos de agente `agents/effort-*.md` solo llegan por el canal plugin; con `npx skills add` el plan escribe «effort: no disponible en este harness, hereda el de la sesión». En el README, tras el bloque `npx skills add`, una frase con lo mismo.

- [ ] **Step 6: Verificación.** El comando de «Verificación». Esperado: todo en verde, AgentDefinitions 9/9.

- [ ] **Step 7: Commit de la task.** `feat(skills): tipos de agente por effort para despachar el effort declarado (task 0031)`, incluyendo `tests/AgentDefinitions.Tests.ps1`.

### Task 2 — Campaña GREEN y evidencia

**Modelo**: no aplica (en línea)
**Ejecución**: en línea: sujetos `claude -p` y proxy desde el scratchpad del hilo (decisión 2)
**Tests RED**: no aplica; la medida es la campaña
**Superficies**: docs
**Verificación**: los dos sujetos del escenario de la decisión 3; lectura del stream y de `requests.jsonl`

**Interfaces**:
- Consume: los tipos de la Task 1 cargados con `--plugin-dir` sobre una copia del kit sacada con `git archive` del commit de la Task 1.
- Produce: `tests/dispatch-effort-red.md` y `tests/dispatch-effort-green.md`; `green/` en la carpeta de la spec con el molde, el lanzador y lo que produjo cada sujeto.

- [ ] **Step 1**: `tests/dispatch-effort-red.md` con las sondas de `red/` (lo que mide, las cifras y la sonda inválida).
- [ ] **Step 2**: molde y lanzador con la comprobación de `cwd`; 2 sujetos en serie detrás del proxy.
- [ ] **Step 3**: `tests/dispatch-effort-green.md`: veredicto por THEN (ejecución real o `suite`) y coste.
- [ ] **Step 4: Commit de la task.** `test(skills): GREEN del effort por tipo de agente (task 0031)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,6h
- Estimación de implementación: 1h
- Base de la estimación: 2 tasks, texto acotado; la incertidumbre está en la campaña GREEN (referencia: 0039, 0,7 h de implementación y cierre)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `Invoke-Pester -Path tests` completo
- [ ] Criterios de éxito: los tres ADDED de la spec con su evidencia
- [ ] Spec satisfecha: ver Self-review
- [ ] Cierre de rama con `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «El effort declarado viaja en el tipo de agente» → Task 1 (agentes, campo `Modelo`) + Task 2 (ejecución real). ✓
- ADDED «Sin effort en el harness, el plan lo dice» → Task 1 (campo `Modelo`, Art. IV, tech-stack, README; test Pester). ✓
- ADDED «El revisor de spec se despacha con su effort» → Task 1 Step 3; test Pester. ✓
- Corrección del Art. IV (herencia de la sesión) → Task 1 Step 4. ✓
- Cada escenario tiene su task: comprobado (perfil `delegate`, sin gate de plan).
