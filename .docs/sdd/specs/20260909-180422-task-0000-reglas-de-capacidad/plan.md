---
id: 20260909-180422-task-0000-reglas-de-capacidad
task: 0000
title: Plan de implementación — Las cinco reglas que el agente decide al azar si nadie las escribe (T17)
spec: ./spec.md
status: approved
created: 2026-09-09
---

# Plan de implementación — Las cinco reglas que el agente decide al azar si nadie las escribe (T17)

> Compatible con `superpowers:writing-plans`. Ejecución: en línea en las tres tasks, con motivo en cada una.

## Decisiones que he tomado yo — valida estas

1. **Ejecución en línea en las tres tasks** — el trabajo es una campaña headless (sujetos Sonnet + persona Haiku) que dirige el hilo, más seis ediciones de una a cinco líneas en ficheros que el hilo ya tiene en contexto; despachar un implementador para eso cuesta más que hacerlo y el GREEN es la verificación. Los **sujetos** de la campaña son Sonnet (por defecto del harness headless, effort por defecto) y el dev-lead simulado es Haiku: transcripción de una persona fija, tier más barato.
2. **RED de spec y RED de entrevista en curso** desde la aprobación de la spec (petición corregida: el primer intento se paró en la primera pregunta de brainstorming por dev-lead ausente; la segunda dice «toma tú las decisiones y lístalas»). Se registran con sus dos intentos.
3. **Alcance de la guidance condicionado al RED** (Art. I): plantilla + subsección + lente + fusión + entrevista solo si el RED de cada lado falla; lo que el baseline ya haga, no se escribe.
4. **Sin `tests/*.Tests.ps1` nuevos**: no hay código ejecutable; la evidencia es narrativa en `tests/reglas-capacidad-{red,green}.md` y el hook Pester valida anatomía y enlaces.
5. **Coste**: RED ≈ 0,8 $ (spec) + ≈ 3 $ (entrevista, 2 × ~14 turnos); GREEN igual. Total ≈ 8 $. Horas: 1,0 h (0,7–1,5).

**Goal**: que las cinco reglas tengan nombre y sitio en el kit: entrevista, capacidad, spec y review.

**Architecture**: ediciones de texto en dos plantillas, dos referencias y dos skills de init; verificación por campaña headless con dos fixtures (spec sobre Ledgerly-reglas; entrevista simulada sobre carpeta vacía con persona Haiku).

**Tech Stack**: Markdown; `claude -p` headless (`stream-json` para la spec, `--resume` en bucle para la entrevista); Pester 6.1.0 en el hook.

**Spec**: `./spec.md`

## Restricciones globales

- Art. I: ninguna edición de skill sin RED→GREEN en `tests/`; lo que el baseline ya hace no se escribe.
- Art. VIII: las plantillas viven solo en `skills/sdd-templates/templates/`.
- Art. III: texto humano en castellano con tildes; nombres de skill en inglés kebab-case. Ficheros LF sin BOM.
- Política de modelos (Art. IV): modelo y effort explícitos en todo despacho; gama media como suelo para interpretar prosa; `fable` y `opus xhigh` prohibidos por defecto. Modo por defecto `subagent-driven-development`; esta task va en línea con motivo (decisión 1).
- Art. X (literal): **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `funcional/`. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano en castellano con tildes. El revisor marca el incumplimiento como Important.
- Las cinco familias se nombran siempre igual y en este orden: *dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto*.
- Fixtures en el scratchpad, sin `.git` en el molde; `git init` en la copia por run. Copia limpia del kit para `--plugin-dir` y `--add-dir`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cinco nombres fijos, una sección, una subsección, un punto de lente, una línea de fusión, un bloque de cinco preguntas. Nada más.
- [x] **YAGNI gate**: sin taxonomía de reglas, sin validador, sin fusión automática distinta de la que ya existe.
- [x] **Brownfield gate**: `funcional/` sigue sin volcarse; la sección del funcional aparece con la primera task que cree la capacidad.
- [x] **Constitution check**: Art. I (RED antes), VIII (plantillas en su sitio), IX (superpowers no cubre reglas de producto), X (sin código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/reglas-capacidad-red.md` — baseline de spec (dos sujetos, dos intentos) y de entrevista simulada (dos sujetos).
- `tests/reglas-capacidad-green.md` — verificación tras la guidance.
- `.docs/sdd/funcional/onboarding.md` — lo crea `sdd-end-task` al fusionar (declarado en la spec); no se crea en este plan.

**Modificar** (solo lo que el RED respalde):

- `skills/sdd-templates/templates/funcional-template.md` — sección «Reglas de la capacidad» entre requisitos e historial.
- `skills/sdd-templates/templates/spec-template.md` — subsección «Reglas de la capacidad» tras `REMOVED` en el delta.
- `skills/sdd-start-task/references/review-spec.md` — punto (5 bis) de la lente dominio.
- `skills/sdd-end-task/references/aprendizajes-skills.md` — fusión por nombre de entrada.
- `skills/sdd-init-greenfield/SKILL.md` — paso 1 (a bis): bloque de cinco preguntas; paso 2: sección «Reglas de producto» de la constitution.
- `skills/sdd-init-brownfield/references/generacion.md` — paso 3, constitution: las cinco como propuesta a confirmar.

**NO se tocan**:

- `skills/sdd-end-task/SKILL.md` — la fusión ya vive en su referencia.
- `funcional/flujo-de-task.md` — lo fusiona `sdd-end-task` al cerrar.

### 1.6 Dependencias

`claude` CLI con `--resume`; Haiku disponible como `--model haiku`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La entrevista simulada se desvía (la persona responde de más) | media | baja | persona con «responde solo a lo que te pregunta»; se lee el log completo antes de contar |
| El baseline de spec ya declara ≥ 4 de 5 | media | media | se recorta (decisión 3) y se deja escrito |
| La persona Haiku aprueba documentos sin leerlos | alta | nula para el RED (se mide qué pregunta el agente, no qué aprueba) | — |

### 1.8 Rollout

Directo: entra en v0.6.0.

### 1.9 Excepciones a la constitution

Ninguna (la excepción al Art. I de la spec inicial cayó con la review).

---

## 2. Tasks

### Task 1 — RED: spec y entrevista

**Modelo**: sujetos Sonnet (effort por defecto del harness), persona Haiku; el hilo dirige.
**Ejecución**: en línea — campaña headless dirigida por el hilo (decisión 1).
**Tests RED**: no aplica (evidencia narrativa; sin código).

**Ficheros**: crear `tests/reglas-capacidad-red.md`.

- [ ] **Step 1: Spec** — dos sujetos sobre `ledgerly-reglas-molde/red` con la petición corregida; contar en `spec.md` cuántas de las cinco declara (en «Decisiones a validar» o en el delta). Registrar el primer intento (parada en la primera pregunta de brainstorming).
- [ ] **Step 2: Entrevista** — dos sujetos con `entrevista-driver.py` (persona Haiku, 14 turnos como tope); contar cuántas de las cinco pregunta el agente por nombre antes de cerrar el bloque de producto y en el resto de la entrevista.
- [ ] **Step 3: Evidencia** — tabla por sujeto, citas literales, conclusión con lo que sobra y lo que entra.
- [ ] **Step 4: Commit** — `test(skills): RED de reglas de capacidad — spec y entrevista simulada`.

### Task 2 — Guidance respaldada por el RED

**Modelo**: hilo principal.
**Ejecución**: en línea — seis ediciones de una a cinco líneas (decisión 1).
**Tests RED**: no aplica.

**Ficheros**: los seis de §1.1 «Modificar», recortados a lo que el RED respalde.

- [ ] **Step 1: `funcional-template`** — tras el último requisito:

```markdown
## Reglas de la capacidad *(opcional; presente obliga a decidir)*

> Cinco entradas fijas, por nombre; «no aplica» es respuesta válida. El nombre es la clave: `sdd-end-task` sustituye o añade cada entrada por su nombre cuando una spec la cambia.

- **Dónde viven los datos**: <fichero, tabla, memoria, almacenamiento del cliente… | no aplica>
- **Idioma de los nombres**: <API, claves, mensajes | no aplica>
- **Límites**: <topes, profundidades, tamaños | no aplica>
- **Avisos**: <qué se avisa al usuario y cuándo | no aplica>
- **Regla ante conflicto**: <qué manda cuando dos vías dan el mismo dato | no aplica>
```

- [ ] **Step 2: `spec-template`** — tras `**REMOVED — <título estable>**` y su motivo:

```markdown
**Reglas de la capacidad** *(solo las entradas que este delta cambia; el nombre es la clave de fusión)*
- **Dónde viven los datos** / **Idioma de los nombres** / **Límites** / **Avisos** / **Regla ante conflicto**: <valor | no aplica>
```

- [ ] **Step 3: `review-spec.md`** — en el encargo, tras el punto (5), añadir: «(5 bis) [lente dominio, si el delta introduce datos, nombres, topes, avisos o una condición de conflicto nuevos] **las cinco reglas por nombre** —dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto—: cada una declarada o «no aplica»; una regla que contradiga la constitution es Crítico». Y una frase en §3: «mismo pase, dos listas: el complemento de visibilidad y las cinco reglas».
- [ ] **Step 4: `aprendizajes-skills.md`** — en el paso 4, tras «REMOVED quita»: «; las entradas de «Reglas de la capacidad» se sustituyen o añaden por su nombre, sin marcas».
- [ ] **Step 5: `sdd-init-greenfield/SKILL.md`** — paso 1 (a): «… módulos imaginados, y **las cinco reglas de producto por nombre** —dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto—; «no sé» deja la entrada pendiente». Paso 2: «la constitution lleva la sección «Reglas de producto» con las cinco (respondida · pendiente · no aplica; si difiere por capacidad, por capacidad dentro de la entrada)».
- [ ] **Step 6: `generacion.md`** — paso 3, constitution: «… + la sección «Reglas de producto» con las cinco reglas por nombre como PROPUESTA deducida del código (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto), a confirmar por el usuario; lo no deducible queda pendiente».
- [ ] **Step 7: Build** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`. Esperado: 136 passed.
- [ ] **Step 8: Commit** — `feat(skills): las cinco reglas de producto tienen nombre y sitio — entrevista, capacidad, spec y review`.

### Task 3 — GREEN: spec y entrevista

**Modelo**: sujetos Sonnet, persona Haiku; el hilo dirige.
**Ejecución**: en línea — campaña headless (decisión 1).
**Tests RED**: no aplica.

**Ficheros**: crear `tests/reglas-capacidad-green.md`.

- [ ] **Step 1: Copia limpia** del kit con la Task 2 (`kit-limpio-t17`: `skills/` + `.claude-plugin/`).
- [ ] **Step 2: Spec** — dos sujetos sobre `ledgerly-reglas-molde/green` (funcional con la sección) y la misma petición. Umbral ≥ 4 de 5 en los dos.
- [ ] **Step 3: Entrevista** — dos sujetos con la misma persona. Umbral 5 de 5 preguntadas en los dos.
- [ ] **Step 4: Evidencia** — misma tabla que el RED; si un umbral no se alcanza, iterar la guidance (máximo dos iteraciones) y registrar cada una.
- [ ] **Step 5: Build** — Pester verde.
- [ ] **Step 6: Commit** — `test(skills): GREEN de reglas de capacidad — spec ≥4/5 y entrevista 5/5`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h (incluye la review de dominio: 10 hallazgos, ~0,3 $)
- Estimación de implementación: 1,0 h (rango 0,7–1,5)
- Base de la estimación: RED en curso (evidencia 10 min), seis ediciones (15 min), GREEN cuatro sujetos en paralelo (~10 min de reloj) + evidencia (15 min), cierre con `onboarding.md` y fusión (10 min). Anclas: T11 1,2 h (dos campañas), T16 0,35 h.
- Confianza: media (la entrevista simulada es método nuevo)

---

## 3. Validación final

- [ ] Pester verde (hook).
- [ ] GREEN de spec ≥ 4/5 y de entrevista 5/5 en los dos sujetos, o iteración registrada.
- [ ] Spec satisfecha: cada decisión tiene su step (ver Self-review).
- [ ] Cierre vía `sdd-end-task` con validación del usuario.

---

## 4. Self-review (cobertura spec → tasks)

- Decisión 2 (cinco nombres fijos) → Restricciones globales + Task 2 Steps 1–6. ✓
- Decisión 3 (`funcional-template`) → Task 2 Step 1. ✓
- Decisión 4 (`spec-template` + fusión por nombre) → Task 2 Steps 2 y 4. ✓
- Decisión 5 (lente dominio + Crítico por conflicto con la constitution) → Task 2 Step 3. ✓
- Decisión 6 (entrevista, constitution «Reglas de producto», «no sé» → pendiente) → Task 2 Steps 5–6; RED/GREEN → Tasks 1 y 3. ✓
- Decisiones 7–8 (RED/GREEN y umbrales) → Tasks 1 y 3. ✓
- Decisión 9 (`onboarding`, `MODIFIED` en `flujo-de-task`) → cierre (`sdd-end-task`), no requiere task. ✓
- Hallazgos 1–10 de la review → incorporados en la spec; ninguno exige task propia. ✓
