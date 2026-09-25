---
id: 20260925-081130-task-0070-openspec-capabilities
task: 0070
title: Plan de implementación — Capacidades al estilo OpenSpec
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Capacidades al estilo OpenSpec

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native.** Son cuatro tasks en serie que comparten `sdd-end-patch/SKILL.md`, las plantillas y el script, y el hilo ya tiene en contexto el formato real de las 13 capacidades y la campaña del RED. El revisor final va con Opus y effort high (Art. IV).
2. **Modelo de la sesión.** La sesión es Opus 5.5. El kit recomienda gama media para ejecutar Native, pero la parada donde se cambia el modelo la quitó la aprobación por delegación; sigo en Opus y lo registro en el walkthrough.
3. **El validador primero (Task 1)**, con fixtures versionadas en `tests/fixtures/capabilities/`: son el contrato del formato que lee (architecture). Las otras tres tasks lo usan para comprobarse.
4. **Las reglas en negrita de `migration`, `roadmap`, `task-flow` y `task-ids` pasan a `## Reglas de la capacidad`** en la Task 2. La entrada que falte se escribe con el valor que ya dicen los requisitos de esa capacidad, y si no lo dicen, «no aplica»; cada valor nuevo lo cito en el walkthrough para que se pueda revisar.
5. **La init greenfield no lleva sujeto en el GREEN**: su cambio es quitar una línea que pedía el historial, y la plantilla ya no lo tiene, así que no queda fuente que lo pida. Lo vigila `CapabilitiesAtBirth.Tests.ps1`.
6. **Campaña GREEN en la Task 3**, cuando están todas las ediciones de skills que mide: 4 escenarios y 7 sujetos, con el techo común de la spec (`SUBJECT_CAP=17`, `COST_CAP=16`).
7. **La migración, última y tras integrar `develop`** (enunciado): la 0062 escribe `migrations/v2.0.0.md` en paralelo. Si al integrar ya existe, se añade un paso; si no, se crea con la cabecera de las anteriores.
8. **Coste**: ~4 h de hilo; GREEN ~3 $ en sujetos; revisor final ~150k tokens de Opus.

**Goal**: que las capacidades sean solo requisitos y reglas, que la spec y el patch declaren arriba sus capacidades, y que los cierres lo comprueben con `Test-Capabilities.ps1`.

**Architecture**: un script de solo lectura en `sdd-templates/scripts/` valida `capabilities/` y, con `-Artifact`, el bloque «Capacidades» de la spec o del patch frente a su delta. Las plantillas pierden el historial y ganan el bloque; los cierres ejecutan el validador tras fusionar. Una migración quita el historial de los proyectos.

**Tech Stack**: PowerShell 7 portable y Pester 5 (`tests/*.Tests.ps1`); sujetos `claude -p --model sonnet` con `red/run.sh`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son cuatro tasks en serie sobre los mismos ficheros y el formato real ya está en el contexto del hilo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes incluidas); nombres de skill y de fichero en inglés kebab-case (Art. III).
- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el porqué no deducible. El bloque de ayuda de `Get-Help` no es un comentario (Art. X).
- Sin comentarios que citen documentos: ni la constitution, ni una spec, ni una task, ni un requisito, ni `capabilities/` (Art. X).
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell (Art. X).
- PowerShell 7 portable: sin APIs exclusivas de Windows; rutas con `Join-Path`. La salida fija `[Console]::OutputEncoding` en UTF-8 y lo restaura en un `finally`, como `Get-NextSddId.ps1`.
- Mensajes del validador, literales: `<fichero>: <qué falla>`, una línea por fallo, código de salida 1; sin fallos, `Capacidades válidas: <n>` y 0; sin carpeta o con la carpeta vacía y sin `-Artifact`, `Sin capacidades que validar` y 0. Ante `## Historial`: `<fichero>: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`.
- Las fixtures no llevan datos reales de la máquina ni el nombre de usuario.
- Un test que lance `pwsh` hijo o cree repos lleva `-Tag 'Slow'`; un test que ejecute git dot-sourcea `tests/Clear-GitEnv.ps1`.
- No se tocan `skills/sdd-start-task/SKILL.md`, `skills/sdd-start-patch/`, `hooks/`, `README.md` ni la skill `sdd-plan` (tasks 0062 y 0064).

### De proceso

- Native: el hilo principal (Opus 5.5) ejecuta las tasks; el revisor final, `subagent_type: sdd-kit:effort-high` + `model: opus`.
- Sujetos Sonnet headless con `red/run.sh`: `SUBJECT_CAP=17`, `COST_CAP=16`, contando el RED; la parada se pide con `touch red/stop`.
- Commits bilingües (tipo/scope en inglés, cuerpo en castellano) con la línea `Co-Authored-By` de la sesión. Un commit por hito.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un solo script sin dependencias, una migración de un paso y dos bloques de plantilla.
- [x] **YAGNI gate**: el validador no valida el contenido de las reglas ni las specs históricas.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 3 con controles), Art. V (migración), Art. VIII (plantillas solo en `sdd-templates`), Art. X (restricciones de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/Test-Capabilities.ps1` — el validador.
- `tests/Test-Capabilities.Tests.ps1` — tests Pester del validador y de las capacidades del repo.
- `tests/fixtures/capabilities/` — capacidades y artefactos de ejemplo (válidos y con cada fallo).
- `tests/capability-format-green.md` — evidencia del GREEN.
- `skills/sdd-init-brownfield/references/migrations/v2.0.0.md` — o un paso nuevo si la 0062 ya lo creó.

**Modificar**:

- `skills/sdd-templates/templates/capability-template.md` — fuera el historial; la regla 3 nombra el validador.
- `skills/sdd-templates/templates/spec-template.md`, `patch-template.md` — bloque «Capacidades»; la ayuda de §6 del patch deja de decir «borra esta sección» sin más.
- `skills/sdd-templates/SKILL.md` — fila del script en el índice de scripts.
- `skills/sdd-end-task/SKILL.md` paso 4 y `references/aprendizajes-skills.md` paso 4 — fusión sin historial y validador.
- `skills/sdd-end-patch/SKILL.md` paso 1 — sin línea de historial, bloque y validador.
- `skills/sdd-init-greenfield/SKILL.md` paso 6 — fuera la línea de historial del volcado.
- `.docs/sdd/capabilities/*.md` (las 13) — fuera `## Historial`; reglas en negrita a su sección en cuatro.
- `tests/CapabilityRules.Tests.ps1`, `tests/CapabilitiesAtBirth.Tests.ps1` — lo que afirmaban del historial.
- `.docs/sdd/architecture.md` — el validador en «Anatomía de la evidencia»/scripts, enlazando la capacidad.

**NO se tocan**:

- El delta de esta spec en `capabilities.md` y `migration.md`: lo fusiona el cierre.
- `skills/sdd-start-task/SKILL.md` y `skills/sdd-start-patch/`: el bloque se pide en la plantilla que calcan; `sdd-start-patch` es de la 0062.
- Specs y walkthroughs históricos.

### 1.6 Dependencias

- Task 0062 en paralelo: comparte `migrations/`; la Task 4 integra `develop` antes.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un proyecto con reglas del delta pegadas (como las cuatro del repo) falla el validador en su primer cierre tras migrar | Media | Medio | La migración lo lista como pendiente; el mensaje dice dónde van las entradas |
| El GREEN escribe el bloque con otra forma que el validador no reconoce | Media | Medio | El parser acepta con o sin guion y varias capacidades por línea; el GREEN ejecuta el validador |
| Choque con la `v2.0.0.md` de la 0062 | Media | Bajo | Task 4 al final, tras integrar `develop` |

### 1.8 Rollout

Release 2.0.0 del kit (lunes 2026-09-28). Los proyectos reciben el cambio con la migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — El validador de capacidades

**Modelo**: hilo principal (Native), Opus 5.5.
**Tests RED**: hilo principal · `tests/Test-Capabilities.Tests.ps1` y `tests/fixtures/capabilities/`, escritos antes del script; copia fuera del repo.
**Superficies**: tooling.
**Verificación**: `$PSStyle.OutputRendering='PlainText'; Invoke-Pester -Path tests/Test-Capabilities.Tests.ps1 -Output Normal` (desde `pwsh -NoProfile`).
**Se prueba en la aplicación**: `pwsh -NoProfile -File skills/sdd-templates/scripts/Test-Capabilities.ps1 -Path tests/fixtures/capabilities/<caso>` da el mensaje de cada fallo; sobre `.docs/sdd` del repo falla por los `## Historial` hasta la Task 2.

**Interfaces**:
- Consume: nada.
- Produce: `Test-Capabilities.ps1 -Path <carpeta .docs/sdd> [-Artifact <ruta de spec.md o patch.md>]`. Lee `<Path>/capabilities/*.md`. Salida en stdout, una línea por fallo, `<nombre del fichero>: <mensaje>`; exit 1 si hay fallos, 0 si no. Mensajes:
  - `<f>: el título debe ser «# Capacidad — <slug>»`
  - `<f>: falta la sección «Requisitos»`
  - `<f>: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
  - `<f>: sección «<nombre>» no admitida: solo «Requisitos» y «Reglas de la capacidad»`
  - `<f>: «<requisito>» no tiene escenario completo (falta - THEN)` — lista las que faltan de `- GIVEN`, `- WHEN`, `- THEN`, separadas por coma
  - `<f>: resto de delta «<marca>» en la línea <n>` — marcas `**ADDED —`, `**MODIFIED —`, `**REMOVED —`
  - `<f>: resto de delta «**Reglas de la capacidad**» en la línea <n>: sus entradas van en «## Reglas de la capacidad»`
  - `<f>: a «Reglas de la capacidad» le falta «<entrada>»` — entradas `Dónde viven los datos`, `Idioma de los nombres`, `Límites`, `Avisos`, `Regla ante conflicto`; una de más se admite
  - Con `-Artifact` (nombre del artefacto como `<a>`): `<a>: falta el bloque «## Capacidades»`; `<a>: «<c>» está en el bloque «Capacidades» y no tiene subsección en el delta`; `<a>: el delta tiene «<c>» y el bloque «Capacidades» no la nombra`; `<a>: el bloque dice «Ninguna» y hay delta`; `<a>: «Ninguna» sin motivo: escribe «Ninguna, porque <motivo>»`; `<a>: «<c>» no tiene fichero en capabilities/`; `<a>: un patch no crea capacidades: quita «Nuevas»`
  - Sin fallos: `Capacidades válidas: <n>`. Sin carpeta o vacía y sin `-Artifact`: `Sin capacidades que validar`.
- Formato del bloque que lee: sección `## Capacidades` hasta el siguiente `## `; líneas `Nuevas:` y `Modificadas:` (con o sin `- ` delante) cuyos nombres son los textos entre comillas invertidas antes de la primera raya `—`; `Ninguna` seguido de `, porque <texto no vacío>`. El delta: cada `### Capacidad: \`<c>\`` del artefacto. Un artefacto es patch si se llama `patch.md` o su frontmatter dice `type: patch`.

**Ficheros**: crear `skills/sdd-templates/scripts/Test-Capabilities.ps1`, `tests/Test-Capabilities.Tests.ps1`, `tests/fixtures/capabilities/**`; modificar `skills/sdd-templates/SKILL.md` (fila del índice de scripts, con el comando `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Test-Capabilities.ps1" -Path "<raíz del proyecto>/.docs/sdd" [-Artifact "<spec.md|patch.md>"]` y «No se copia al proyecto»).

- [ ] **Step 1: Tests RED** — un `It` por cada línea de «El validador de capacidades» de la spec y por cada mensaje de arriba, con una fixture por caso en `tests/fixtures/capabilities/<caso>/capabilities/`: `valid` (bookings con requisitos y cinco reglas → `Capacidades válidas: 1`), `missing-then` (el ejemplo literal de la spec), `bad-title`, `history`, `extra-section`, `delta-mark`, `bold-rules`, `missing-rule`, `extra-rule` (seis entradas → válida), `empty` (carpeta vacía) y `none` (sin carpeta); y artefactos en `tests/fixtures/capabilities/artifacts/`: `spec-ok.md`, `spec-no-block.md`, `spec-mismatch.md` (bloque con `bookings`, delta con `rooms`), `spec-none-with-delta.md`, `spec-none-no-reason.md`, `spec-missing-file.md`, `patch-new.md` (`type: patch` con `Nuevas:`), `patch-none.md` (`Ninguna, porque el fix devuelve \`reservar\` a lo que ya dice \`bookings\``, sin delta → válido). Los tests llaman al script con `& $script -Path … 6>&1` en proceso y leen `$LASTEXITCODE`; si hace falta un proceso hijo, `-Tag 'Slow'`. Ejecutar: FAIL (no existe el script).
- [ ] **Step 2: Implementación** — script con funciones pequeñas: `Get-CapabilityFiles`, `Test-CapabilityTitle`, `Test-CapabilitySections`, `Test-RequirementScenarios`, `Test-DeltaLeftovers`, `Test-CapabilityRules`, `Get-DeclaredCapabilities`, `Get-DeltaCapabilities`, `Test-ArtifactBlock`; recogen mensajes en una lista y el cuerpo principal los escribe y sale.
- [ ] **Step 3: Verificación** — la de arriba, verde. Comparar los RED con su copia (`git diff --no-index`).
- [ ] **Step 4: Commit de la task** — `feat(sdd-templates): validador de capacidades Test-Capabilities.ps1`.

### Task 2 — Las capacidades sin historial

**Modelo**: hilo principal (Native), Opus 5.5.
**Tests RED**: hilo principal · en `tests/Test-Capabilities.Tests.ps1` un `It 'las capacidades del repo pasan el validador'` sobre `.docs/sdd`; en `tests/CapabilityRules.Tests.ps1` y `tests/CapabilitiesAtBirth.Tests.ps1`, los `It` del historial pasan a afirmar su ausencia: `capability-template.md` sin `## Historial` ni `<carpeta de la task o del patch>`; el paso 1 de `sdd-end-patch` sin «línea de historial»; el paso 4 de `aprendizajes-skills.md` dice que la capacidad no guarda historial; el paso 6 de `sdd-init-greenfield` sin `init — ADDED volcado inicial`.
**Superficies**: docs, tooling.
**Verificación**: `$PSStyle.OutputRendering='PlainText'; Invoke-Pester -Path tests/Test-Capabilities.Tests.ps1,tests/CapabilityRules.Tests.ps1,tests/CapabilitiesAtBirth.Tests.ps1,tests/Skills.Tests.ps1 -Output Normal`; y `pwsh -NoProfile -File skills/sdd-templates/scripts/Test-Capabilities.ps1 -Path .docs/sdd` → `Capacidades válidas: 13`.
**Se prueba en la aplicación**: `Test-Capabilities.ps1 -Path .docs/sdd` del repo da `Capacidades válidas: 13`.

**Interfaces**:
- Consume: `Test-Capabilities.ps1 -Path <carpeta .docs/sdd>` (Task 1): sin fallos escribe `Capacidades válidas: <n>` y sale con 0.
- Produce: `capability-template.md` sin sección `## Historial`; regla 3 de su bloque anti-proliferación: «`sdd-end-task` fusiona el delta de la spec, y `sdd-end-patch` el del `patch.md`: `ADDED` añade…, `MODIFIED` sustituye entero…, `REMOVED` lo quita. La capacidad no guarda historial: quién cambió qué lo dicen git y el bloque «Capacidades» de cada spec o patch».

**Ficheros**: modificar `skills/sdd-templates/templates/capability-template.md`, `skills/sdd-end-task/references/aprendizajes-skills.md` (paso 4: «sin línea de historial: la capacidad no lo guarda»), `skills/sdd-end-patch/SKILL.md` (paso 1: quitar «con la línea de historial `…`»), `skills/sdd-init-greenfield/SKILL.md` (paso 6: quitar el punto «Su «Historial» empieza con…»; y la racionalización «las dejó sin historial», que pasa a «sin aprobar la partición»), las 13 `.docs/sdd/capabilities/*.md` (borrar `## Historial` hasta el final; en `migration`, `roadmap`, `task-flow` y `task-ids`, mover el bloque `**Reglas de la capacidad**` a `## Reglas de la capacidad` al final y completar las cinco entradas), los dos tests.

- [ ] **Step 1: Tests RED** — los de arriba. Ejecutar: FAIL.
- [ ] **Step 2: Implementación** — las ediciones. Para cada entrada de reglas que falte, buscar el valor en los requisitos de esa capacidad; si no lo dicen, «no aplica». Apuntar cada valor nuevo para el walkthrough.
- [ ] **Step 3: Verificación** — la de arriba, verde. Comparar los RED.
- [ ] **Step 4: Commit de la task** — `refactor(capabilities): quitar el historial de las capacidades`.

### Task 3 — El bloque «Capacidades» y el validador en los cierres (con GREEN)

**Modelo**: hilo principal (Native), Opus 5.5; sujetos Sonnet headless.
**Tests RED**: hilo principal · `tests/CapabilityRules.Tests.ps1`: `spec-template.md` tiene `## Capacidades` antes de `## Decisiones que he tomado yo`, con `Nuevas:`, `Modificadas:` y `Ninguna, porque`, y su ayuda dice listar `capabilities/` y reutilizar el nombre exacto; `patch-template.md` tiene `## Capacidades` antes de `## 1. Síntoma`, sin `Nuevas:`, y la ayuda de §6 ya no dice «no hay delta: borra esta sección» sin la línea del bloque; el paso 4 de `sdd-end-task/SKILL.md` y el paso 1 de `sdd-end-patch/SKILL.md` nombran `Test-Capabilities.ps1` con `-Artifact`; el paso 1 de `sdd-end-patch` dice `Ninguna, porque el fix devuelve`. El `It` de la 0067 «ya decía, no hay delta» se conserva.
**Superficies**: docs, tooling.
**Verificación**: `$PSStyle.OutputRendering='PlainText'; Invoke-Pester -Path tests/CapabilityRules.Tests.ps1,tests/Test-Capabilities.Tests.ps1,tests/Skills.Tests.ps1 -Output Normal`; la campaña GREEN (7 sujetos).
**Se prueba en la aplicación**: no, porque son plantillas y skills: la prueba es el GREEN, que escribe specs y cierra tasks y patches con el kit de la rama.

**Interfaces**:
- Consume: `Test-Capabilities.ps1 -Path <.docs/sdd> -Artifact <spec.md|patch.md>` (Task 1); plantillas sin historial (Task 2).
- Produce: bloque de `spec-template.md`, justo tras `# Spec — <título>`:
  ```markdown
  ## Capacidades

  > Se escribe tras listar `.docs/sdd/capabilities/`, con el nombre exacto de cada fichero (sin `.md`). Una línea por capacidad; cada una tiene su subsección `### Capacidad:` en el delta, y ninguna subsección del delta falta aquí. Una capacidad nueva va en «Nuevas» y también en «Decisiones que he tomado yo». Si el cambio no toca comportamiento observable: «Ninguna, porque <refactor | herramientas | docs>», y sin delta. Lo comprueba `Test-Capabilities.ps1` al cerrar.

  - Nuevas: `<nombre>` — <qué cubre>
  - Modificadas: `<nombre>` — <qué requisito cambia>
  ```
  y el de `patch-template.md`, justo antes de `## 1. Síntoma`, igual sin «Nuevas» (un patch no crea capacidades) y con los motivos del carril: «Ninguna, porque el fix devuelve `<comando>` a lo que ya dice `<capacidad>`» o «Ninguna, porque ninguna capacidad describe `<pieza>`».

**Ficheros**: modificar `spec-template.md`, `patch-template.md` (bloque y ayuda de §6: si no hay delta, el bloque lo dice con «Ninguna, porque…» y la sección se borra), `skills/sdd-end-task/SKILL.md` paso 4 (tras fusionar y antes del commit de cierre, ejecutar el validador con `-Artifact <spec.md>`; si falla, se corrige la fusión, no el validador), `skills/sdd-end-task/references/aprendizajes-skills.md` paso 4 (lo mismo, en una frase), `skills/sdd-end-patch/SKILL.md` paso 1 (el bloque del patch: «Modificadas» con delta; «Ninguna, porque…» si devuelve el comportamiento o si ninguna capacidad describe la pieza; y el validador con `-Artifact <patch.md>`), `tests/CapabilityRules.Tests.ps1`; crear `tests/capability-format-green.md` y `green/` de la carpeta de la spec.

- [ ] **Step 1: Tests RED** — los de arriba. Ejecutar: FAIL.
- [ ] **Step 2: Implementación** — las ediciones.
- [ ] **Step 3: Verificación** — Pester verde; comparar los RED.
- [ ] **Step 4: GREEN** — copia del kit de la rama con `git archive HEAD skills .claude-plugin` tras el commit de la task; escenarios: `c` (spec de la 0021, 2 sujetos), `m` sin `(antes:)` y con validación neutra (cierre de la 0020, 2), `p1` (cierre del patch 0014 con delta, 2) y `p2` (cierre del patch 0013 sin delta, 1), estos dos del molde de la 0067 con `SECTION6=1` para que el `patch.md` traiga el bloque y la §6 vacíos de la plantilla. Filas: bloque presente y coherente con el delta; validador ejecutado tras fusionar y en verde; sin línea de historial; controles del RED: nombre exacto `bookings`, `MODIFIED` en bloque entero con datos, regla con valor completo, cláusula del 0014 conservada, `p2` sin tocar `bookings.md`. Evidencia en `tests/capability-format-green.md`.
- [ ] **Step 5: Commit de la task** — `feat(sdd-templates): bloque «Capacidades» en spec y patch, validado al cerrar`.

### Task 4 — Migración a 2.0.0 y documentos de anclaje

**Modelo**: hilo principal (Native), Opus 5.5.
**Tests RED**: hilo principal · `tests/MigrationInitParity.Tests.ps1` sigue en verde con el fichero; `tests/Test-Capabilities.Tests.ps1`: un `It` que ejecuta sobre la fixture `history` el paso descrito (quitar desde `## Historial` hasta el final) y comprueba que el validador pasa; un `It` que comprueba que `v2.0.0.md` nombra `Test-Capabilities.ps1` en su verificación.
**Superficies**: docs, tooling.
**Verificación**: `$PSStyle.OutputRendering='PlainText'; Invoke-Pester -Path tests/MigrationInitParity.Tests.ps1,tests/Test-Capabilities.Tests.ps1,tests/Skills.Tests.ps1 -Output Normal`.
**Se prueba en la aplicación**: no, porque es una migración: la prueba es el `It` que la aplica a la fixture `history`.

**Interfaces**:
- Consume: `Test-Capabilities.ps1` (Task 1); mensaje de historial `<f>: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`.
- Produce: paso de migración: «**Historial de las capacidades.** Si alguna `.docs/sdd/capabilities/*.md` tiene `## Historial`: se borra la sección entera, desde su título hasta la siguiente sección `##` o el final, sin gate (el historial queda en git). Sin `capabilities/`, el paso se salta y lo dice.» Y en «Verificación»: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Test-Capabilities.ps1" -Path .docs/sdd` pasa; si falla por otra cosa que el historial, el informe lo lista como pendiente del dev-lead, sin tocarlo.

**Ficheros**: integrar `develop` primero (`git merge develop`); crear o modificar `skills/sdd-init-brownfield/references/migrations/v2.0.0.md`; modificar `.docs/sdd/architecture.md` (el validador junto a los scripts, enlazando `capabilities/capabilities.md`), `tests/Test-Capabilities.Tests.ps1`.

- [ ] **Step 1: Integrar `develop`** y mirar si existe `v2.0.0.md` y qué trae.
- [ ] **Step 2: Tests RED** — los de arriba. Ejecutar: FAIL.
- [ ] **Step 3: Implementación** — el paso y la verificación; si el fichero es nuevo, cabecera como `v1.2.0.md`; si la migración escribe `sdd-kit.json`, su línea `**Escribe**:`.
- [ ] **Step 4: Verificación** — verde; comparar los RED.
- [ ] **Step 5: Commit de la task** — `feat(migrations): la 2.0.0 quita el historial de las capacidades`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 4h
- Base de la estimación: 4 tasks en serie; un script nuevo con ~20 casos; 13 capacidades a mano, 4 con reglas que completar; GREEN de 7 sujetos; la 0067 (M, plantilla + cierre de patch + GREEN) como referencia. ¿El plan trae el código? parcial (interfaces y mensajes, no el script).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` (suite completa, `Slow` incluidos).
- [ ] `Test-Capabilities.ps1 -Path .docs/sdd` sobre el repo → `Capacidades válidas: 13`.
- [ ] Cada requisito del delta tiene su task (§4).
- [ ] Cierre con `sdd-end-task`: fusión del delta en `capabilities` y `migration`, y el validador con `-Artifact spec.md` antes del commit de cierre.

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «La spec y el patch declaran sus capacidades al principio» → Task 3 (plantillas, GREEN `c`, `p1`, `p2`) y Task 1 (comprobación). ✓
- MODIFIED «El cierre fusiona el delta en la verdad viva» → Task 2 (sin historial), Task 3 (validador en el paso 4, GREEN `m`). ✓
- MODIFIED «El cierre de un patch fusiona su delta» → Task 2 y Task 3 (GREEN `p1`). ✓
- MODIFIED «Un patch que devuelve el comportamiento a la capacidad no lleva delta» → Task 3 (GREEN `p2`). ✓
- MODIFIED «El volcado inicial es una excepción de greenfield» → Task 2 (Pester; sin sujeto, decisión 5). ✓
- ADDED «Una capacidad no guarda historial» → Task 2. ✓
- ADDED «El validador de capacidades» → Task 1; su «Avisos» son los mensajes de la Task 1. ✓
- ADDED «La migración a v2.0.0 quita el historial de las capacidades» → Task 4. ✓
- Scope «reglas en negrita de cuatro capacidades» → Task 2. ✓
- Scope «pieza (4) a deuda» → hecha en la apertura (fila de deuda). ✓
