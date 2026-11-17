---
id: 20260902-160308-task-0000-dependencias-declaradas
task: 0000
title: Plan de implementación — Declaración de dependencias del kit
spec: ./spec.md
status: approved
created: 2026-09-02
---

# Plan de implementación — Declaración de dependencias del kit

**Goal**: declarar las dependencias del kit donde sirvan —resolución automática en el manifest, prerrequisito legible en el README— y que la rama de `grilling` degrade en lugar de morir cuando la skill no está instalada.

**Architecture**: tres cambios independientes en orden de coste creciente. Los manifests (Task 1) y la declaración humana (Task 2) son cambios declarativos, verificables leyendo el fichero, sin Art. I porque no tocan guidance. La degradación (Task 3) sí es guidance nueva sobre dos skills y arrastra el ciclo RED→GREEN completo, así que va última y puede recortarse sola si el baseline no exhibe el fallo.

**Tech Stack**: Markdown + manifests JSON. Sin build ni CI (`tech-stack.md`): la verificación es estructural y por smoke documentado. Tests de skills con subagentes Sonnet sobre fixtures desechables en el scratchpad de sesión.

**Spec**: `./spec.md`

## Global Constraints

- Texto humano en castellano con ortografía correcta; nombres de skill y fichero en inglés kebab-case (Art. III).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only (Art. VI).
- Ninguna edición de skill sin RED→GREEN documentado en `tests/` (Art. I).
- Sin bump de versión en esta task: el corte lo hace `sdd-end-release` (Art. V).
- Nombre exacto del marketplace de la dependencia: `claude-plugins-official`. Nombre exacto del plugin: `superpowers`.
- La dependencia se declara **sin restricción de versión**.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿se puede hacer más simple? Sí se consideró: solo declaración humana (más simple, descartado por el usuario porque desaprovecha el campo) y eliminar la dependencia de `grilling` (más simple aún, descartado porque pierde la skill real). El alcance actual es el mínimo que satisface las cuatro decisiones tomadas.
- [ ] **YAGNI gate**: no se abstrae nada. No se crea fichero nuevo salvo la evidencia de test, que el Art. I obliga.
- [ ] **Brownfield gate**: el kit es su propio brownfield. Se respeta el patrón existente de las skills (predicado observable, tabla de racionalizaciones) y no se refactoriza nada fuera de scope — en particular NO se toca el "crea un todo por paso" ni el tamaño de `sdd-start-task`.
- [ ] **Constitution check**: Arts. I, III, IV, V, VI, VII y VIII revisados en `spec.md` §7.1. Sin excepciones.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-consult-degradacion-red.md` — baseline sin la guidance de degradación, con racionalizaciones textuales.
- `tests/sdd-consult-degradacion-green.md` — mismos escenarios con la guidance; veredicto contra cada fallo del RED.

**Modificar**:

- `.claude-plugin/plugin.json` — añadir el array `dependencies`.
- `.claude-plugin/marketplace.json` — añadir `allowCrossMarketplaceDependenciesOn`.
- `README.md` — línea 5 (estado real) y sección Convenciones (declaración canónica de dependencias).
- `.docs/sdd/tech-stack.md` — la viñeta "Dependencia" deja de listar y apunta al README.
- `skills/sdd-consult/SKILL.md` — predicado de degradación en el paso 2.
- `skills/sdd-init-greenfield/SKILL.md` — misma degradación en la línea 12.

**NO se tocan** (constancia de lo deliberadamente intacto):

- Las 8 skills con "crea un todo por paso" — es el otro pendiente del ítem 4 del roadmap, con su propio ciclo.
- `skills/sdd-start-task/SKILL.md` — la deuda de tamaño tiene su propia task; tocarla aquí sería refactor oportunista.
- El resto de `tests/` — esta task no re-testea skills que no modifica.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos API

No aplica. El contrato relevante es el schema del manifest de Claude Code, ya verificado en `spec.md` §3.

---

## 2. Tasks

Tres tasks → se crea `tasks.md` como registro vivo.

### Task 1 — Declaración en los manifests

**Ficheros**: modificar `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`

- [ ] **Step 1: Implementación** — añadir a `plugin.json`, tras `"version"`:

```json
  "dependencies": [
    { "name": "superpowers", "marketplace": "claude-plugins-official" }
  ],
```

y a `marketplace.json`, tras `"owner"`:

```json
  "allowCrossMarketplaceDependenciesOn": ["claude-plugins-official"],
```

Sin campo `version` en la dependencia: constreñir contra tags de un repo ajeno solo añade el modo de fallo `no-matching-tag` (spec §3).

- [ ] **Step 2: Build** — el kit no tiene build. Equivalente: validar que ambos JSON parsean.

Ejecutar: `node -e "JSON.parse(require('fs').readFileSync('.claude-plugin/plugin.json'));JSON.parse(require('fs').readFileSync('.claude-plugin/marketplace.json'));console.log('JSON OK')"`
Esperado: `JSON OK`.

- [ ] **Step 3: Verificación** — smoke documentado: releer ambos ficheros y comprobar que el nombre del plugin es exactamente `superpowers` y el del marketplace exactamente `claude-plugins-official`, contrastados contra `installed_plugins.json`, que registra `superpowers@claude-plugins-official`.

Ejecutar: `grep -c 'claude-plugins-official' .claude-plugin/plugin.json .claude-plugin/marketplace.json`
Esperado: 1 en cada fichero.

- [ ] **Step 4: Commit** — `feat(plugin): declarar superpowers como dependencia cross-marketplace`

### Task 2 — Declaración humana en fuente única

**Ficheros**: modificar `README.md`, `.docs/sdd/tech-stack.md`

- [ ] **Step 1: Implementación** — en `README.md`:

Línea 5, sustituir `Estado: **v0.3.0 publicada** (carril consult).` por el estado real:

```markdown
> Estado: **v0.4.0 cerrada**, sin distribuir (sin remoto configurado). Las 11 skills de proceso validadas con el TDD de writing-skills: baseline sin skill (RED) → skill dirigida a los fallos observados (GREEN) → cierre de huecos. Evidencia completa en `tests/`.
```

(El recuento pasa de 10 a 11: el README ya lista 11 filas en su tabla de contenido.)

Sustituir la viñeta de Convenciones `- Requiere el plugin **superpowers** (...)` por una sección propia antes de Convenciones:

```markdown
## Dependencias

Declaración canónica: cualquier otro documento del repo apunta aquí en vez de repetir la lista.

| Dependencia | Obligatoria | Canal | Instalación |
| --- | --- | --- | --- |
| `superpowers` | Sí | Plugin de Claude Code (marketplace `claude-plugins-official`) | Se resuelve sola: `plugin.json` la declara. Manual: `claude plugin install superpowers@claude-plugins-official` |
| `grilling` | No | Skill suelta (`npx skills add`) | `npx skills add mattpocock/skills --skill grilling` |

El kit invoca **6 skills de superpowers**: `brainstorming`, `writing-plans`, `executing-plans`, `systematic-debugging`, `writing-skills` y `finishing-a-development-branch`. Sin el plugin instalado, Claude Code deshabilita el kit y muestra el comando de instalación: es un fallo ruidoso a propósito, preferible a un flujo que se ejecuta a medias.

`grilling` es opcional y solo la usa el carril consult para tensar una dirección. Si no está instalada, la skill hace el interrogatorio por su cuenta y lo dice.
```

En `.docs/sdd/tech-stack.md`, sustituir la viñeta `- **Dependencia**: plugin **superpowers** ...` por:

```markdown
- **Dependencias**: declaradas en el [README](../../README.md#dependencias), que es la fuente única — `superpowers` (obligatoria, resuelta por `plugin.json`) y `grilling` (opcional, `npx skills add`). Aquí no se repite la lista: dos copias divergen (aprendizaje de esta task, 2026-09-02).
```

- [ ] **Step 2: Build** — no aplica (Markdown). Equivalente: comprobar que no quedan listas divergentes.

Ejecutar: `grep -rn "writing-plans" README.md .docs/sdd/tech-stack.md`
Esperado: la skill aparece solo en el README, dentro de la lista de 6.

- [ ] **Step 3: Verificación** — smoke documentado: `grep -n "superpowers" README.md .docs/sdd/tech-stack.md` y confirmar que existe **una sola** enumeración de skills invocadas, en el README, y que `tech-stack` solo la referencia.

- [ ] **Step 4: Commit** — `docs(readme): declaración canónica de dependencias y estado real del kit`

### Task 3 — Degradación de `grilling` (Art. I)

**Ficheros**: crear `tests/sdd-consult-degradacion-red.md` y `tests/sdd-consult-degradacion-green.md`; modificar `skills/sdd-consult/SKILL.md`, `skills/sdd-init-greenfield/SKILL.md`

**Staging de la ausencia**: no se puede desinstalar `grilling` del entorno del subagente. La condición real que vive un consumidor —*la skill nombrada no está en su lista*— se reproduce fielmente entregando al subagente el `SKILL.md` con el nombre sustituido por uno garantizado ausente (`grilling-unavailable`). Todo lo demás queda idéntico. Esta sustitución es del **fixture de test**, nunca del fichero del repo, y se documenta en el RED como parte del método.

- [ ] **Step 1: Montar la fixture** — copia del molde "TimeTrack" en el scratchpad de sesión, una por run. El molde **no lleva `.git`**: el `git init` se hace en la copia (`tech-stack.md`). Entrega de la skill **por prompt**, pegando el `SKILL.md` del working tree — el plugin instalado resuelve a la copia en cache y probaría la versión vieja.

- [ ] **Step 2: RED** — 2 escenarios con Sonnet, prompt **neutro** (nada de "¿qué skill invocaste?" por delante):

  - **S1** — `"Quiero meter SSO en TimeTrack, ¿cómo lo enfocarías?"` → dispara el modo pensar/estructurar, que es el que nombra la skill ausente.
  - **S2** — `"pensemos bien cómo partimos el módulo de fichajes antes de tocar nada"` → mismo modo, otra formulación.

  Conducta esperada del baseline (la hipótesis a refutar): al no resolver la skill, el agente **abandona el interrogatorio** —responde de corrido, o se va a `brainstorming`, o produce artefactos— en vez de hacer las preguntas él mismo. Registrar las racionalizaciones textuales.

  Preguntar **a posteriori**, con el escenario ya cerrado, qué hizo al no encontrar la skill: es método válido para lo que el autoinforme no cuenta (`tech-stack.md`).

  Escribir `tests/sdd-consult-degradacion-red.md`. **Si el baseline no falla**, es evidencia válida de que la guidance sobra (Art. I): se recorta el Step 3, se documenta y la task termina en las Tasks 1 y 2. No es un contratiempo.

- [ ] **Step 3: Implementación** — solo si el RED exhibió el fallo. En `skills/sdd-consult/SKILL.md`, paso 2, sustituir la rama de estructurar por un predicado observable (Art. II: predicado, nunca cláusula de excepción):

```markdown
   - **Pensar / estructurar / tensar una dirección** ("¿cómo enfocarías X?", "pensémoslo bien") → `grilling` si está disponible en tu lista de skills (interroga una a una, recomienda respuesta, sin artefactos, no ligado a SDD). **Si no lo está**, haz tú el interrogatorio con esa misma forma —una pregunta cada vez, con tu recomendación, sin producir artefactos— y dilo en tu primer mensaje. Lo que no se degrada nunca es el interrogatorio: no hay atajo a responder de corrido porque falte la skill. **NUNCA `superpowers:brainstorming`**: ese es el motor de construir features y acaba en spec → plan → implementación; aplicado a una consulta, la convierte en lo que no era.
```

  Añadir la racionalización observada a la tabla del final (texto exacto tomado del RED, no inventado).

  En `skills/sdd-init-greenfield/SKILL.md:12`, misma degradación:

```markdown
El motor de la entrevista es `superpowers:brainstorming` (o `grilling` si el usuario lo prefiere y está disponible; si no lo está, haz tú las preguntas de una en una): preguntas de una en una, y cada documento se aprueba antes de darse por anclaje.
```

- [ ] **Step 4: GREEN** — mismos 2 escenarios, prompts **idénticos palabra por palabra**, copias frescas de fixture, con el `SKILL.md` modificado (y la misma sustitución de nombre del staging). Verificar en disco, no solo por autoinforme. Escribir `tests/sdd-consult-degradacion-green.md` con el veredicto contra cada fallo del RED. Si el GREEN destapa huecos de la propia skill → REFACTOR y re-verificación en el mismo fichero.

- [ ] **Step 5: Commit** — RED en su propio commit (`test(task): RED de la degradación de grilling`), implementación + GREEN después (`feat(skills): degradación de grilling por predicado observable`).

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,8 h
- Estimación de implementación: 3 h (Task 1 ≈ 0,3 h · Task 2 ≈ 0,7 h · Task 3 ≈ 2 h)
- Base de la estimación: 3 tasks, dos triviales y una con ciclo RED/GREEN completo de 2 escenarios sobre 2 skills. Referencias del `estimation-log`: `consult-skill` (2,5 h estimado / 1,4 h real) y `modo-lite` (3 h / 0,5 h), ambas con ratio < 1 porque el RED recortó alcance. Aquí puede repetirse: el staging de la ausencia es el punto donde el baseline podría no fallar.
- Confianza: media — la incertidumbre está concentrada en si el staging reproduce el fallo, no en la implementación.

---

## 3. Validación final

- [ ] Ambos JSON parsean; `dependencies` y `allowCrossMarketplaceDependenciesOn` con los nombres exactos.
- [ ] Una sola enumeración de skills invocadas en todo el repo, en el README.
- [ ] `README.md:5` refleja v0.4.0 cerrada y sin distribuir.
- [ ] `tests/sdd-consult-degradacion-{red,green}.md` existen, o el RED documenta por qué se recortó el alcance.
- [ ] Frontmatter YAML válido en las skills tocadas.
- [ ] Cierre vía `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- Éxito 1 (manifests declaran y autorizan) → Task 1. ✓
- Éxito 2 (una sola declaración humana; `tech-stack` apunta) → Task 2. ✓
- Éxito 3 (degradación con RED→GREEN) → Task 3. ✓
- Éxito 4 (`README.md:5` con el estado real) → Task 2, Step 1. ✓
- NO objetivo: degradar superpowers → sin task. Confirmado en spec §2. ✓
- NO objetivo: "crea un todo por paso" en 8 skills → sin task, y listado en §1.1 como NO se toca. ✓
- NO objetivo: tags de release y remoto → sin task; `claude plugin tag` exige remoto (spec §1). ✓
- Riesgo "el RED no exhibe el fallo" → cubierto explícitamente en Task 3, Step 2. ✓
