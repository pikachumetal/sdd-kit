---
id: 20260909-105650-task-0000-migracion-consumidores
task: 0000
title: Plan de implementación — Migración de proyectos consumidores entre versiones del kit (T10)
spec: ./spec.md
status: approved
approved_at: 2026-09-09
created: 2026-09-09
---

# Plan de implementación — Migración de proyectos consumidores entre versiones del kit (T10)

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (default del kit). Steps con checkbox.

**Goal**: que un proyecto consumidor con `.docs/sdd/` diga «actualízame al kit» y el agente aplique, en orden y con gate, los ficheros `migrations/vX.Y.Z.md` posteriores a la versión de su `sdd-kit.json`, escribiendo el marcador al final.

**Architecture**: el artefacto manda. Tres ficheros de migración (v0.2.0, v0.4.0, v0.6.0) con pasos-predicado y un `README.md` con el procedimiento (leer marcador → aplicar en orden → gate por fichero → escribir marcador), todos bajo `skills/sdd-init-brownfield/references/migrations/`. El RED mide, con el método headless de T9, si un agente con `sdd-init-brownfield` vigente y esos ficheros presentes migra bien un proyecto v0.5.0 calcado de Alybo; solo lo que falle entra en la skill. El marcador se añade a la lista de estructura de `init-*` como receta (Art. II, sin RED). Cierre con dogfooding: el kit escribe su propio `sdd-kit.json`.

**Tech Stack**: Markdown. Sujetos: sesiones headless `claude -p` con el kit instalado deshabilitado por `--settings` y el working tree cargado por `--plugin-dir` (T9). Fixture desechable con git propio.

**Spec**: `./spec.md`

## Restricciones globales

Copiadas de la spec y la constitution. Toda task las hereda; **quien despacha las incluye en el encargo**.

- **Marcador**: `.docs/sdd/sdd-kit.json` = `{ "version": "X.Y.Z", "channel": "plugin" | "cli", "updated": "YYYY-MM-DD" }`. Sin más campos. Lo escriben `init-*` al inicializar y la migración al terminar.
- **Migraciones**: `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md`, una por versión con cambio estructural; cada paso empieza por un predicado observable («Si existe …»); cada fichero termina con una sección «Verificación» de comprobaciones ejecutables. `README.md` en la misma carpeta con el procedimiento. **Versión objetivo = la mayor de `migrations/`**; sin marcador se asume anterior a v0.2.0 y se aplican todas.
- **`funcional.md` heredado → `funcional/legado.md`** con nota de excepción temporal; nunca se trocea ni se borra.
- **Scripts del proyecto en `.tools/sdd/` distintos de `Build-EstimationLog.ps1` no se tocan.**
- **El diff de `estimation-log.md` se presenta al dev-lead antes de commitear.**
- **La migración no regenera documentos de anclaje ni vuelca `funcional/`.**
- Art. I — guidance que el baseline ya cumple no se escribe; la escritura del marcador en `init-*` es receta (Art. II), no medida. Art. III — castellano con tildes. Art. IV — modelo y effort explícitos; sujetos Sonnet. Art. X — sin comentarios que repitan el código (no aplica: no hay código). Art. VIII — ninguna plantilla nueva fuera de `sdd-templates`.
- **Sujetos headless**: `claude -p --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir D:/code/git/sdd-kit --permission-mode acceptEdits --allowedTools "Bash(*)" --max-turns 80 --output-format json "<petición>"`, con cwd en la copia de la fixture. Prompt neutro. Verificación en disco. n=1 por escenario no es veredicto: ante una diferencia, repetir.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: lo simple sería una skill `sdd-migrate` con el procedimiento dentro. Rechazado: contradice la decisión 2026-09-07 y añade una `description` a toda sesión; el predicado en brownfield cuesta una frase.
- [x] **YAGNI gate**: sin comparación SemVer real (los ficheros se aplican por orden lexicográfico de nombre, que coincide mientras las versiones sean `0.X.0`… y se anota); sin migrar artefactos históricos; sin migrar Alybo/MDT; sin script de migración: los pasos los ejecuta el agente.
- [x] **Brownfield gate**: `sdd-init-brownfield` conserva su flujo de onboarding intacto; el predicado solo desvía cuando `.docs/sdd/` ya existe.
- [x] **Constitution check**: Art. I (RED/GREEN de la guidance), II (receta para el marcador), V (ampliado: migración por release), VII (dogfooding: `sdd-kit.json` del kit), IX (no hay pieza de superpowers para esto).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-init-brownfield/references/migrations/README.md` — procedimiento.
- `skills/sdd-init-brownfield/references/migrations/v0.2.0.md` — borrar `.docs/sdd/templates/` (fuente única, 2026-07-21). **Corrige la decisión 3 de la spec**: v0.2.0 sí tuvo cambio estructural.
- `skills/sdd-init-brownfield/references/migrations/v0.4.0.md` — hotfix → patch.
- `skills/sdd-init-brownfield/references/migrations/v0.6.0.md` — `funcional/`, marcador, script de estimación, `environments.md`.
- `.docs/sdd/sdd-kit.json` — el del kit.
- `tests/migracion-red.md`, `tests/migracion-green.md`.
- `tasks.md`.

**Modificar**:

- `skills/sdd-init-brownfield/SKILL.md` — predicado de migración (solo si el RED lo respalda) y enlace a `references/migrations/README.md`.
- `skills/sdd-init-brownfield/references/generacion.md` paso 5 y `skills/sdd-init-greenfield/references/estructura.md` — `sdd-kit.json` en la estructura.
- `skills/sdd-init-greenfield/SKILL.md` paso 3 — «`sdd-kit.json` con la versión instalada».
- `.docs/sdd/constitution.md` Art. V — la release con cambio estructural escribe su migración.
- `.docs/sdd/mission.md` — glosario: marcador, migración.
- `README.md` — sección «Actualizar un proyecto» (comando y qué hace).
- `tests/Skills.Tests.ps1` — el test de huérfanos debe ignorar `references/migrations/` (subcarpeta de artefactos enlazada por su README) o enlazarla; se decide en Task 3.

**NO se tocan**:

- `sdd-consult` — si E2 muestra que enruta bien sin guidance, nada; si no, se anota como deuda (no entra).
- Los proyectos Alybo y MDT.
- `release-notes-template.md` — es para el cliente.

### 1.6 Dependencias

- Método headless de T9 (`tech-stack.md` §Tests). Permisos: `--permission-mode acceptEdits --allowedTools "Bash(*)"` se valida en Task 2 Step 1 con un smoke antes de lanzar los escenarios.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto headless no puede escribir o ejecutar Bash por permisos y el RED mide el harness, no la skill | Media | Alto | Smoke previo (Task 2 Step 1): un sujeto crea un fichero y ejecuta `git status` en la copia; si falla, se ajustan los flags antes de los escenarios |
| El sujeto re-inicializa el proyecto (regenera docs) en vez de migrar | Alta en RED | Medio | Es justo lo que se mide: hash de `mission.md` antes/después y presencia de `funcional/` con más de `legado.md` |
| El agente trocea `funcional.md` por capacidades | Media | Medio | Paso explícito «no trocear» en `v0.6.0.md`; comprobación en disco: solo `legado.md` |
| Orden lexicográfico ≠ SemVer cuando lleguen `v0.10.0` | Baja hoy | Bajo | Anotado en el README de migraciones; se resuelve cuando exista una versión de dos dígitos |
| Alybo tiene enlaces a `funcional.md` en cinco docs; la fixture debe reproducirlos para medir la actualización de enlaces | Media | Medio | La fixture lleva enlaces en `architecture.md`, `mission.md`, `README.md` y `CLAUDE.md` |

### 1.8 Rollout

Directo: entra en v0.6.0. La primera invocación real es Alybo, a petición del dev-lead (decisión 9).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Ficheros de migración, procedimiento y marcador del kit

**Modelo**: en línea.
**Ejecución**: en línea — el contenido íntegro de los cuatro ficheros está aquí; despachar sería transcripción sin nada que verificar más allá del diff, y el redactor de los pasos es quien conoce las cinco releases.

**Ficheros**: crear `skills/sdd-init-brownfield/references/migrations/{README,v0.2.0,v0.4.0,v0.6.0}.md`, `.docs/sdd/sdd-kit.json`.

- [ ] **Step 1: `README.md`**

```markdown
# Migraciones del kit — procedimiento

Un proyecto ya inicializado (`.docs/sdd/` existe) no se re-inicializa: se migra. Cada fichero `vX.Y.Z.md` de esta carpeta recoge los cambios estructurales que esa versión del kit pide al proyecto, como pasos-predicado que se pueden verificar.

1. **Desde dónde**: lee `.docs/sdd/sdd-kit.json`. Si no existe, el proyecto es anterior a v0.2.0: se aplican todas.
2. **Hasta dónde**: la mayor versión que tenga fichero en esta carpeta (el canal `npx skills add` no instala `plugin.json`; esta carpeta es la verdad). Orden: por nombre de fichero (válido mientras las versiones sean de un dígito por segmento; cuando exista `v0.10.0`, ordenar por SemVer).
3. **Cómo**: aplica cada fichero en orden, paso a paso. Cada paso empieza por un predicado: si no se cumple, se salta y se dice. Los pasos marcados **gate** se presentan al dev-lead antes de ejecutarse (un rename masivo, un borrado, un diff de `estimation-log.md`); si el dev-lead no está, se dejan como pendientes explícitos, nunca se hacen por su cuenta.
4. **Qué NO es migrar**: regenerar documentos de anclaje, volcar `funcional/`, trocear `funcional.md`, tocar specs o walkthroughs históricos, borrar scripts del proyecto que no sean del kit.
5. **Al terminar**: escribe `.docs/sdd/sdd-kit.json` con la versión aplicada, el canal (`plugin` si el kit llegó por `/plugin install`, `cli` si por `npx skills add`) y la fecha; ejecuta la sección «Verificación» de cada fichero aplicado; un commit por versión migrada (`chore(sdd): migrar al kit vX.Y.Z`).
```

- [ ] **Step 2: `v0.2.0.md`**

```markdown
# Migración a v0.2.0 — las plantillas viven solo en el kit

Aplica si existe `.docs/sdd/templates/`.

1. Si existe `.docs/sdd/templates/`: **gate** — borrarla (`git rm -r .docs/sdd/templates`). Las plantillas se calcan del skill `sdd-templates`; una copia en el proyecto deriva.
2. Si `CLAUDE.md` o algún doc de `.docs/sdd/` dice que las plantillas están en `.docs/sdd/templates/`: sustituir por «se calcan del skill `sdd-templates`».

## Verificación

- `Test-Path .docs/sdd/templates` → `False`.
- `grep -rn "sdd/templates" CLAUDE.md .docs/sdd/*.md` → sin resultados.
```

- [ ] **Step 3: `v0.4.0.md`**

```markdown
# Migración a v0.4.0 — carril hotfix → patch

Aplica si `CLAUDE.md`, `constitution.md` o `roadmap.md` citan `sdd-start-hotfix`, `sdd-end-hotfix` o `hotfix-template.md`, o si el roadmap tiene una tabla «Hotfixes».

1. El histórico no se toca: las carpetas `*-hotfix-*` y los ficheros `hotfix.md` se conservan tal cual (el kit los lee como legado).
2. Si algún doc cita `sdd-start-hotfix` / `sdd-end-hotfix` / `hotfix-template.md`: sustituir por `sdd-start-patch` / `sdd-end-patch` / `patch-template.md`.
3. Si el roadmap tiene una tabla «Hotfixes»: renombrarla «Patches»; las filas se conservan.

## Verificación

- `grep -rn "sdd-start-hotfix\|sdd-end-hotfix\|hotfix-template" CLAUDE.md .docs/sdd/*.md` → sin resultados.
- Las carpetas `*-hotfix-*` siguen existiendo.
```

- [ ] **Step 4: `v0.6.0.md`**

```markdown
# Migración a v0.6.0 — funcional/, marcador, script de estimación, entorno

1. **`funcional.md` → `funcional/legado.md`.** Si existe `.docs/sdd/funcional.md`: **gate** — `git mv .docs/sdd/funcional.md .docs/sdd/funcional/legado.md` y añadir al principio del fichero:

   > Documento funcional heredado (anterior a `funcional/` por capacidad). **Excepción temporal**: `legado` no es una capacidad; cada task que toque una capacidad saca de aquí lo suyo a `funcional/<capacidad>.md` y lo retira de este fichero. No trocear de golpe.

   Actualizar todo enlace o mención a `funcional.md` en `CLAUDE.md` y `.docs/sdd/*.md` para que apunte a `funcional/legado.md`. No crear ningún otro fichero en `funcional/`.
2. **Script de estimación local.** Si existe `.tools/sdd/Build-EstimationLog.ps1` o `tools/sdd/Build-EstimationLog.ps1`: **gate** — `git rm` de ese fichero (solo ese: otros scripts de la carpeta son del proyecto); sustituir sus menciones en `estimation.md`, `README.md` y `CLAUDE.md` por el comando del kit `pwsh -NoProfile -File "<Base directory de sdd-init-brownfield>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root .`; ejecutarlo y presentar el diff de `.docs/sdd/estimation-log.md` al dev-lead antes de commitear (cambian columnas, separador decimal y aparece el factor por Tipo).
3. **Entorno por worktree.** Si el proyecto tiene scripts `env:setup` / `env:clean` (en `package.json`, `.tools/` o equivalente) y no existe `.docs/sdd/environments.md`: **gate** — proponer calcarlo de `environments-template.md` del skill `sdd-templates` con los datos reales de esos scripts. Si no hay scripts de entorno, nada.
4. **Artefactos en curso.** Las specs y planes existentes no se reescriben; las tasks nuevas usan las plantillas nuevas (spec ligera con delta por capacidad, plan con Restricciones globales).
5. **Marcador.** Escribir `.docs/sdd/sdd-kit.json`: `{ "version": "0.6.0", "channel": "plugin" | "cli", "updated": "<hoy>" }`.

## Verificación

- `Test-Path .docs/sdd/funcional.md` → `False`; `Get-ChildItem .docs/sdd/funcional` → solo `legado.md` (salvo capacidades creadas después por tasks).
- `grep -rn "funcional\.md" CLAUDE.md .docs/sdd/*.md` → sin resultados (todo apunta a `funcional/legado.md`).
- `Test-Path .tools/sdd/Build-EstimationLog.ps1` → `False`; los demás ficheros de `.tools/sdd/` siguen.
- Primera línea de `.docs/sdd/estimation-log.md` empieza por `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit)`.
- `.docs/sdd/sdd-kit.json` existe con `"version": "0.6.0"`.
```

- [ ] **Step 5: marcador del kit** — `.docs/sdd/sdd-kit.json`:

```json
{ "version": "0.6.0", "channel": "plugin", "updated": "2026-09-09" }
```

(El kit consume sus propias skills por el plugin instalado desde la ruta local; v0.6.0 es la release en curso, que estos ficheros definen.)

- [ ] **Step 6: Pester** — `Invoke-Pester -Path tests`: si el test de huérfanos de `references/` marca `migrations/`, no toca: solo mira `references/*.md` de primer nivel. Si el test de enlaces falla por algo, parar y anotar para Task 3.
- [ ] **Step 7: Commit** `feat(skills): ficheros de migración del kit por versión y marcador sdd-kit.json` (cuerpo en castellano: tres migraciones, procedimiento, marcador del propio kit).

---

### Task 2 — RED con sujetos headless: migrar un proyecto v0.5.0

**Modelo**: sujetos Sonnet (headless, `--model sonnet`).
**Ejecución**: en línea — los sujetos son los medidos; la sesión orquesta y verifica en disco.

**Ficheros**: crear `tests/migracion-red.md`; fixture "Alybo-corto" en el scratchpad.

- [ ] **Step 1: Smoke del método** — copia mínima de fixture; sujeto con el comando de las Restricciones globales y la petición «Crea el fichero `hola.txt` con la palabra hola y ejecuta `git status`». Esperado: fichero creado y salida de git en el JSON. Si falla, ajustar `--permission-mode`/`--allowedTools` y repetir hasta que escriba y ejecute; documentar los flags finales en el RED.
- [ ] **Step 2: Fixture "Alybo-corto v0.5.0"** (molde sin `.git`): `CLAUDE.md` (punteros, cita `funcional.md` y `sdd-start-hotfix`), `.docs/sdd/` con `mission.md` (enlace a `funcional.md`), `constitution.md` (artículo que cita `sdd-end-hotfix`), `tech-stack.md`, `architecture.md` (enlace a `funcional.md`), `funcional.md` (~40 líneas, tres secciones de producto), `roadmap.md` (tabla «Hotfixes» con una fila), `estimation.md` (cita `.tools/sdd/Build-EstimationLog.ps1`), `estimation-log.md` manual (2 filas), `templates/spec-template.md` (copia vieja), `specs/20260701-100000-task-0001-alta/walkthrough.md` (bloque de tiempo) y `specs/20260715-100000-hotfix-0000-fix/hotfix.md` (§5 Tiempo); `.tools/sdd/Build-EstimationLog.ps1` (copia de Alybo) y `.tools/sdd/Validate-Specs.ps1` (stub que no debe tocarse); `package.json` con `env:setup`/`env:clean` stubs. Sin `sdd-kit.json`. Cada copia: `git init -b main` + commit.
- [ ] **Step 3: Escenarios** (una copia por escenario, prompt neutro):
  - E1: «Este proyecto ya trabaja con el kit SDD y acabo de actualizar el kit a la última versión. Ponme el proyecto al día con la skill `sdd-kit:sdd-init-brownfield`. El dev-lead soy yo y no estaré disponible durante la sesión: lo que sea decisión mía, déjalo pendiente.»
  - E2: «Acabo de actualizar el kit sdd-kit a la última versión. ¿Qué tengo que cambiar en este proyecto para ponerlo al día? Hazlo si puedes.» (sin nombrar skill: mide el enrutado).
- [ ] **Step 4: Verificación en disco** por copia: (a) `sdd-kit.json` con `0.6.0`; (b) `funcional/legado.md` existe, `funcional.md` no, `funcional/` sin otros ficheros; (c) `grep funcional\.md` en docs → 0; (d) `.tools/sdd/Build-EstimationLog.ps1` borrado y `Validate-Specs.ps1` intacto; (e) log con cabecera AUTO-GENERADO o diff dejado pendiente con explicación; (f) `templates/` borrada o gate pendiente; (g) menciones hotfix sustituidas; (h) `mission.md`/`tech-stack.md` sin regenerar (hash igual salvo el enlace); (i) `environments.md` propuesto como pendiente; (j) commits `chore(sdd): migrar al kit vX.Y.Z`. Registrar qué skill invocó cada sujeto (JSON de salida: eventos `Skill`).
- [ ] **Step 5: Pregunta a posteriori** — no aplica al headless (la sesión termina). En su lugar, el JSON de salida guarda el razonamiento final; se citan de ahí las frases que gobernaron la decisión.
- [ ] **Step 6: `tests/migracion-red.md`** con el formato de `tests/estimation-log-red.md`: fixture, flags finales del método, escenarios, fallos F1…, positivos sin guidance, tabla de guidance respaldada. Si E1 migra bien con el fichero delante, el predicado en `SKILL.md` **no se escribe** (solo el enlace, que es forma).
- [ ] **Step 7: Commit** `test(skills): RED de la migración de consumidores con sujetos headless`.

---

### Task 3 — Guidance respaldada + GREEN + marcador en init-*

**Modelo**: sujetos Sonnet (headless). Ediciones en línea.
**Ejecución**: en línea — las ediciones se deciden frase a frase contra el RED.

**Ficheros**: modificar `skills/sdd-init-brownfield/SKILL.md`, `skills/sdd-init-brownfield/references/generacion.md`, `skills/sdd-init-greenfield/SKILL.md`, `skills/sdd-init-greenfield/references/estructura.md`, `tests/Skills.Tests.ps1` si procede; crear `tests/migracion-green.md`.

- [ ] **Step 1: Texto previsto para `sdd-init-brownfield/SKILL.md`** (solo lo que el RED respalde). Tras el Overview, antes de «Principios»:

```markdown
## Predicado: ¿onboarding o migración?

Si **ya existe `.docs/sdd/`**, este proyecto no necesita onboarding: necesita **migrar** al kit instalado. No regeneres ningún documento de anclaje ni vuelques `funcional/`: sigue [references/migrations/README.md](references/migrations/README.md) — lee `sdd-kit.json`, aplica en orden los `migrations/vX.Y.Z.md` que falten con sus gates, y escribe el marcador al final. El flujo de abajo es solo para proyectos sin `.docs/sdd/`.
```

- [ ] **Step 2: Marcador en la estructura** (receta, sin RED):
  - `sdd-init-brownfield/references/generacion.md` paso 5: añadir «`sdd-kit.json` con la versión del kit instalada (`{ "version", "channel", "updated" }`; la versión es la mayor de `references/migrations/` del kit instalado)».
  - `sdd-init-greenfield/references/estructura.md`: línea `├── sdd-kit.json      (versión del kit instalada: version, channel, updated)`.
  - `sdd-init-greenfield/SKILL.md` paso 3: «…`estimation-log.md` vacío, `sdd-kit.json` con la versión instalada».
- [ ] **Step 3: GREEN** — mismos dos escenarios y comprobaciones que el RED, con las ediciones. Esperado: E1 migra sin regenerar y escribe el marcador; E2 enruta a brownfield o, como mínimo, encuentra `migrations/` y aplica.
- [ ] **Step 4: `tests/migracion-green.md`** — veredicto por fallo del RED; huecos de la guidance con REFACTOR y re-verificación.
- [ ] **Step 5: Pester verde** (`Invoke-Pester -Path tests`); si el test de enlaces de `Skills.Tests.ps1` no acepta `references/migrations/README.md`, ampliar el patrón de `Get-RelativeLinks` para subcarpetas — con su test.
- [ ] **Step 6: Commit** `feat(skills): sdd-init-brownfield migra un proyecto ya inicializado; init-* escriben sdd-kit.json`.

---

### Task 4 — Constitution, mission y README

**Modelo**: en línea.
**Ejecución**: en línea — ediciones de una línea con texto dado aquí.

- [ ] **Step 1: `constitution.md` Art. V** — añadir: «Toda release que cambie la estructura de `.docs/sdd/` o retire algo del proyecto consumidor escribe `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` con pasos-predicado y verificación; el proyecto declara su versión en `.docs/sdd/sdd-kit.json` (T10, 2026-09-09).»
- [ ] **Step 2: `mission.md` glosario** — «**Marcador de versión** (`sdd-kit.json`): la versión del kit que un proyecto tiene aplicada. **Migración**: aplicar, en orden y con gate, los `migrations/vX.Y.Z.md` posteriores a esa versión; la ejecuta `sdd-init-brownfield` cuando `.docs/sdd/` ya existe.»
- [ ] **Step 3: `README.md`** — sección «Actualizar un proyecto» tras «Instalación»: `/plugin marketplace update` (o `npx skills add` de nuevo) y después «Ponme el proyecto al día con `sdd-init-brownfield`»; qué hace (lee `sdd-kit.json`, aplica migraciones con gate, escribe el marcador).
- [ ] **Step 4: Commit** `docs(sdd): Art. V con migración por release, glosario y README de actualización`.

El cierre (`funcional/migracion.md` por fusión, changelog, roadmap, walkthrough) lo hace `sdd-end-task`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1,5 h (rango 1–2,5)
- Base de la estimación: Task 1 ≈ 20 min (cuatro ficheros redactados aquí); Task 2 ≈ 30 min con el riesgo del método headless (smoke de permisos, sujetos de varios minutos cada uno); Task 3 ≈ 25 min; Task 4 ≈ 10 min. Anclas: T7 1,1 h, T8 0,7 h. Incertidumbre principal: el método headless es nuevo (flags de permisos, duración de cada sujeto).
- Confianza: media

---

## 3. Validación final

- [ ] Pester verde
- [ ] GREEN 2/2: migración sin regenerar, marcador escrito
- [ ] `.docs/sdd/sdd-kit.json` del kit commiteado
- [ ] Cierre vía `sdd-end-task`: `funcional/migracion.md` fusionado

---

## 4. Self-review (cobertura spec → tasks)

- El proyecto declara la versión del kit que tiene → Task 1 (marcador del kit) + Task 3 Step 2 (init-*). ✓
- Cada release con cambio estructural lleva su migración → Task 1 (tres ficheros) + Task 4 (Art. V). ✓
- Un proyecto ya inicializado se migra, no se re-inicializa → Task 2 (RED) + Task 3 (predicado y GREEN) + README de migraciones. ✓
- El `funcional.md` heredado se conserva como legado → Task 1 `v0.6.0.md` paso 1; medido en Task 2 (b). ✓
- La copia local del script de estimación se retira → Task 1 `v0.6.0.md` paso 2; medido en Task 2 (d)(e). ✓
- Decisión 3 corregida: v0.2.0 sí tuvo cambio estructural (`templates/`) → Task 1 `v0.2.0.md`; se presenta en el gate del plan. ✓
- Alybo/MDT, `sdd-migrate`, artefactos históricos → N/A (no entra). ✓
