---
id: 20260927-182418-feature-0092-usage-guide
feature: 0092
title: Plan de implementación — Guía de uso del kit para los devs del equipo
spec: ./spec.md
status: approved
created: 2026-09-27
---

# Plan de implementación — Guía de uso del kit para los devs del equipo

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: cuatro tasks de documentación, en secuencia, sobre el mismo material leído en esta sesión (tickets, skills, docs de flujo). Un subagente por task tendría que releerlo todo. La revisión independiente la da el revisor final de rama.
2. **Modelo**: la sesión implementa (Opus 5.5, elegido por el dev-lead al arrancar; no pidió bajar de modelo). Revisor final de rama: `subagent_type: sdd-kit:effort-high` + `model: opus`, con el encargo de «Revisor final» de `encargo-revision.md` y la lente pedida en la spec: contrastar cada regla de la guía con `skills/`.
3. **Las dos comprobaciones nuevas del test se escriben como funciones puras** (`Test-MarkerCurrent` y `Get-BrokenRelativeLink`) definidas en el propio fichero de test, con casos literales para C1 y C3. Así los casos de fallo no necesitan ficheros de fixture ni `$TestDrive`, que llega `$null` dentro de funciones de `BeforeAll` (`tech-stack.md`).
4. **El orden de las tasks sigue a la dependencia del test**: la Task 1 mete la guía en la vigilancia y la escribe; greenfield y brownfield siguen en v1.1.0 hasta la Task 2, lo que el «igual o posterior» admite. La comprobación del enlace del README va con la Task 3, que es la que lo añade.
5. **Coste estimado**: ~4 h de hilo y un revisor final (~150k tokens, del orden de 3–5 $). Sin sujetos: no se edita ninguna skill.

**Goal**: una guía de uso en `.docs/workflow/usage-guide.md` bajo la vigilancia de `WorkflowDocs.Tests.ps1`, con greenfield y brownfield al día con la 2.0.0 y el README apuntando a ella.

**Architecture**: documentación en Markdown y un test Pester. El test gana dos funciones puras (marcador igual o posterior, enlaces relativos rotos) que se aplican a los documentos reales y a casos literales.

**Tech Stack**: Markdown; Pester ≥ 5 en `pwsh` 7, lanzado desde la herramienta PowerShell (desde Git Bash la página de códigos rompe los literales con tildes, `tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son cuatro tasks de documentación en secuencia sobre el mismo material ya cargado en la sesión. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes incluidas); nombres de fichero en inglés kebab-case: `usage-guide.md`.
- Marcador literal de revisión: «Última revisión: kit v2.0.0», en `usage-guide.md`, `greenfield.md` y `brownfield.md`.
- Nombres retirados que ningún documento versionado de `.docs/workflow/` puede contener: `hotfix`, `funcional\.md`, `sdd-start-release`, `sdd-start-task`.
- La guía describe el kit como está en `skills/` de esta rama; no cita artículos de la constitution, tests ni evidencia.
- Ejemplos con dominio inventado, sin clientes, proyectos ni personas reales.
- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes. El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho; revisor final de Native con `sdd-kit:effort-high` + `opus`; `fable` y `opus xhigh` prohibidos por defecto.
- Commits bilingües (tipo/scope en inglés, título y cuerpo en castellano), con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Nunca `--no-verify`.
- Historia de la rama: apertura, un commit por task, cierre (`commit-milestones.md`).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una guía y dos funciones de test; sin generador ni plantilla nueva.
- [x] **YAGNI gate**: las dos funciones tienen un solo uso cada una, dentro del test que las necesita.
- [x] **Constitution check**: Art. III (idioma), Art. VIII (no se crea plantilla), Art. X (test). Art. I no aplica: no se toca `skills/`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/workflow/usage-guide.md` — la guía de uso, siete secciones.
- `.docs/sdd/specs/20260927-182418-feature-0092-usage-guide/tasks.md` — registro vivo.

**Modificar**:

- `tests/WorkflowDocs.Tests.ps1` — guía en las listas, marcador igual o posterior, `sdd-start-task` retirado, enlaces relativos, enlace del README.
- `.docs/workflow/greenfield.md`, `.docs/workflow/brownfield.md` — revisión para la 2.0.0 y marcador.
- `.docs/workflow/evidence-and-references.md` — solo lo que dice del kit (tabla del §3 y la frase de «La spec y el plan se revisan»).
- `README.md` — los cuatro sitios de la decisión 5 de la spec.
- `CLAUDE.md` — índice de `.docs/workflow/`.
- `.docs/sdd/tech-stack.md` — línea «Vigencia de `.docs/workflow/`».
- `.docs/sdd/roadmap.md` — fila de la 0092 en la Release 2.0.0 y punto 1 del cierre (commit de apertura).

**NO se tocan**:

- `skills/**` — la guía describe el kit; no lo cambia.
- `.claude-plugin/plugin.json` — el bump es del corte de la 2.0.0.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La guía cuenta una regla que no coincide con la skill vigente | Media | Alto: el dev contesta mal a una parada | Cada regla se escribe con la skill abierta; el revisor final contrasta la guía con `skills/` |
| Otra feature cambia una skill que la guía describe antes del corte | Baja | Medio | Freno «fichero cambiado en la base» antes de cada task; al cerrar, merge de sincronización |

### 1.8 Rollout

Directo, con el merge a `develop`; se publica con el corte de la 2.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La guía de uso, bajo la vigilancia del test

**Modelo**: la sesión (Native).
**Tests RED**: hilo principal, en `tests/WorkflowDocs.Tests.ps1`, con copia fuera del repo antes del código.
**Superficies**: docs · tooling (test Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/WorkflowDocs.Tests.ps1 -Output Detailed"` desde la herramienta PowerShell.
**Interfaces**:
- Consume: nada.
- Produce: `Test-MarkerCurrent([string]$Content, [version]$PluginVersion) -> bool` y `Get-BrokenRelativeLink([string]$Content, [string]$BaseDirectory) -> string[]`, en el `BeforeAll` del test; `$VersionedDocs = @('greenfield.md', 'brownfield.md', 'usage-guide.md')`.

**Ficheros**: crear `.docs/workflow/usage-guide.md`; modificar `tests/WorkflowDocs.Tests.ps1`.

- [ ] **Step 1: Tests RED** (C1, C2, C3 salvo el README, C4):
  - `It 'acepta un marcador igual o posterior a plugin.json'`: `Test-MarkerCurrent 'Última revisión: kit v2.0.0' '1.1.0' | Should -BeTrue`; `Test-MarkerCurrent 'Última revisión: kit v1.1.0' '1.1.0' | Should -BeTrue`.
  - `It 'rechaza un marcador anterior a plugin.json'`: `Test-MarkerCurrent 'Última revisión: kit v1.0.0' '1.1.0' | Should -BeFalse`; `Test-MarkerCurrent 'Última revisión: kit v2.0.0' '2.0.1' | Should -BeFalse`; sin marcador, `-BeFalse`.
  - `It '<_> declara la versión del kit que revisó'` pasa a usar `Test-MarkerCurrent` con `-Because "$_ describe el kit: si la versión subió, hay que releerlo y actualizar el marcador"`.
  - `'existe la carpeta con los cuatro documentos'` añade `usage-guide.md`; la lista de obsoletos añade `'sdd-start-task'`.
  - `It 'detecta un enlace relativo roto'`: `Get-BrokenRelativeLink '[x](brownfeld.md) [y](greenfield.md) [z](https://a.b/c.md) [w](#ancla)' $script:WorkflowRoot | Should -Be @('brownfeld.md')`.
  - `It '<_> no tiene enlaces relativos rotos' -ForEach @('greenfield.md','brownfield.md','evidence-and-references.md','usage-guide.md')`: `Get-BrokenRelativeLink … | Should -BeNullOrEmpty -Because "…"`.
  - `It 'la guía tiene las siete secciones en orden'`: los títulos `^## ` de `usage-guide.md`, fuera de bloques de código, empiezan por `1. `…`7. ` en orden y son siete.
  - `It 'la guía enlaza los otros tres documentos'`: contiene `](greenfield.md`, `](brownfield.md` y `](evidence-and-references.md`.
- [ ] **Step 2: Implementación del test**: `Test-MarkerCurrent` busca `Última revisión: kit v([0-9]+\.[0-9]+\.[0-9]+)` y compara `[version]` con `-ge`. `Get-BrokenRelativeLink` toma los destinos de `](destino)` que no llevan `:` ni empiezan por `#`, quita el `#ancla`, y devuelve los que no existen resueltos contra `$BaseDirectory`.
- [ ] **Step 3: La guía**: `usage-guide.md` con el índice de la spec, títulos `## 1. La idea en una página` … `## 7. Problemas típicos`, la tabla de confusiones de la spec respondida cada una en su sección (C5), cada regla escrita con la skill abierta (`using-sdd`, `sdd-start-feature` y sus `references/control-profiles.md`, `nombrado.md` y `modo-lite.md`, `sdd-start-patch`, `sdd-end-feature` y `merge-recipe.md`, `sdd-end-patch`, `sdd-roadmap`, `sdd-end-release`, `sdd-config`, `sdd-feedback`, `sdd-consult`), marcador al pie.
- [ ] **Step 4: Verificación** — el comando de «Verificación»: todos verdes; los RED apartados, comparados con `git diff --no-index`.
- [ ] **Step 5: Commit de la task**.

### Task 2 — Greenfield, brownfield y el anexo al día con la 2.0.0

**Modelo**: la sesión (Native).
**Tests RED**: ninguno automático nuevo: C6 se comprueba con la búsqueda del Step 1, que se guarda como evidencia en `tasks.md`. El test de la Task 1 ya vigila marcador y nombres retirados.
**Superficies**: docs.
**Verificación**: el comando de la Task 1, y `Select-String -Path .docs/workflow/greenfield.md, .docs/workflow/brownfield.md -Pattern 'subagentes, que es el modo por defecto','con subagentes por defecto','y los commitea','inventario completo del feedback','acta de feedback triado','al historial','otro gate'` sin resultados.
**Interfaces**:
- Consume: `usage-guide.md` de la Task 1 (secciones a las que se enlaza en vez de repetir).
- Produce: nada.

**Ficheros**: modificar `.docs/workflow/greenfield.md`, `.docs/workflow/brownfield.md`, `.docs/workflow/evidence-and-references.md`.

- [ ] **Step 1: RED de C6** — ejecutar la búsqueda de «Verificación» antes de editar y apuntar en `tasks.md` cada afirmación encontrada (esperado: al menos implementación por subagentes por defecto, tests commiteados antes de despachar, release con inventario y triaje, historial de capacidades).
- [ ] **Step 2: Revisión** — sustituir cada afirmación por lo que hace la 2.0.0: Native por defecto y subagentes para planes largos; gate del plan solo en `pair`; tests RED en el commit de la task; `using-sdd` como puerta; perfiles; `sdd-roadmap` para planificar y `sdd-end-release` como corte (changelog sellado, notas, roadmap colapsado, retro si se pide); capacidades sin historial; validación con diferido. Donde la guía lo cuenta, enlazar su sección. Marcadores a «kit v2.0.0». En el anexo, la fila «La spec y el plan se revisan; la implementación va con checkpoints» pasa a decir lo que revisa el dev (la spec) y dónde va la revisión (revisión final de rama).
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task**.

### Task 3 — El README y los índices apuntan a la guía

**Modelo**: la sesión (Native).
**Tests RED**: hilo principal, en `tests/WorkflowDocs.Tests.ps1`: `It 'el README enlaza la guía de uso'`: `Get-Content README.md -Raw | Should -Match '\]\(\.docs/workflow/usage-guide\.md'`.
**Superficies**: docs · tooling.
**Verificación**: el comando de la Task 1.
**Interfaces**:
- Consume: la ruta `.docs/workflow/usage-guide.md` de la Task 1.
- Produce: nada.

**Ficheros**: modificar `README.md`, `CLAUDE.md`, `.docs/sdd/tech-stack.md`, `tests/WorkflowDocs.Tests.ps1`.

- [ ] **Step 1: Test RED** del README.
- [ ] **Step 2: Cambios** — README: enlace a la guía como punto de entrada al principio de «Cómo se usa»; «Luego el plan, otro gate» pasa a decir que en el perfil por defecto el plan no para; «los tres documentos» de «Cómo está escrito» pasa a cuatro, con la guía primero; «Once skills» pasa a «Catorce skills». `CLAUDE.md`: la guía en el índice de `.docs/workflow/`, y «compara su marcador … con `plugin.json`» dice «igual o posterior». `tech-stack.md`: la línea «Vigencia de `.docs/workflow/`» dice que el marcador vale si es igual o posterior a `plugin.json` y por qué (se revisan antes del corte que sube la versión).
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit de la task**.

### Task 4 — Pasada de humanizer

**Modelo**: la sesión (Native).
**Tests RED**: ninguno: C7 se registra en `tasks.md`.
**Superficies**: docs.
**Verificación**: el comando de la Task 1 (la pasada no puede romper enlaces, secciones ni marcadores).
**Interfaces**:
- Consume: `usage-guide.md` y los párrafos reescritos en la Task 2.
- Produce: nada.

**Ficheros**: modificar `.docs/workflow/usage-guide.md` y, si la pasada lo pide, los párrafos reescritos de `greenfield.md` y `brownfield.md`.

- [ ] **Step 1: Pasada** — invocar `humanizer:humanizer` sobre la guía y los párrafos reescritos; aplicar los cambios que no alteran ninguna regla.
- [ ] **Step 2: Registro** — en `tasks.md`, la pasada y los cambios que dejó.
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,75 h
- Estimación de implementación: 4 h
- Base de la estimación: 4 tasks; la guía (~300 líneas) es el grueso y exige contrastar cada regla con 10 skills; la revisión de greenfield y brownfield, ~1 h; README, índices y humanizer, ~0,75 h.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` desde la herramienta PowerShell, con la duración.
- [ ] Criterios C1–C7 de la spec, con su evidencia.
- [ ] Cada requisito tiene su task (Self-review).
- [ ] Cierre con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- C1 marcador igual o posterior → Task 1 (función y casos), Task 2 (marcadores a v2.0.0). ✓
- C2 guía vigilada y `sdd-start-task` retirado → Task 1. ✓
- C3 enlaces relativos → Task 1; enlace del README → Task 3. ✓
- C4 siete secciones y enlaces a los tres documentos → Task 1. ✓
- C5 confusiones de los tickets → Task 1 Step 3; lo contrasta el revisor final. ✓
- C6 greenfield y brownfield sin la 1.1.0 → Task 2. ✓
- C7 humanizer → Task 4. ✓
- Decisiones 5 y 9 de la spec (README, `CLAUDE.md`, `tech-stack.md`) → Task 3; decisión 10 (roadmap) → commit de apertura. ✓
- Review Focus (lo que ningún test fija): una regla de la guía que contradiga la skill (revisor final); un enlace a un ancla que no existe (el test solo mira ficheros: el revisor final abre los enlaces con `#`); la guía hablando del mantenimiento del kit en vez del uso (revisor final, contra la decisión 6). ✓
