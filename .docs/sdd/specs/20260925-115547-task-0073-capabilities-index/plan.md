---
id: 20260925-115547-task-0073-capabilities-index
task: 0073
title: Plan de implementación — Índice de capacidades generado
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Índice de capacidades generado

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: las tres tasks van en fila (la 2 usa la lectura de secciones de la 1, la 3 usa el script de la 2) y la 3 es una campaña de sujetos que solo puede llevar el hilo principal. Con subagentes solo cambiarían de mano las dos primeras, y pagaríamos un contexto nuevo por task y por revisión. La revisión independiente llega al final: Opus con `sdd-kit:effort-high`.
2. **Modelo de la sesión**: la sesión va en Opus, y la opción de parar para bajarla a gama media estaba en el gate de la spec, que aprobaste por delegación. No paro ahora a ofrecerla: sería una parada que no pediste. Lo registro como ruling.
3. **Lectura común**: `CapabilitySections.ps1` en `sdd-templates/scripts/`, cargado con `.` por `Test-Capabilities.ps1` y `Get-CapabilityIndex.ps1`, como `SddLock.ps1`. Tiene `Get-SectionTitle`, `Get-SectionLines` y `Get-CapabilityPurpose`: el propósito en una línea, `''` si está vacío o es solo el hueco `<…>`, y `$null` si no hay sección.
4. **Propósito de las 13 capacidades del repo**: sale de su párrafo actual, sin la procedencia, y va en ≤ 300 caracteres. Los punteros útiles («la tabla vive en…») se quedan solo si caben.
5. **Coste**: ~2,5 h de implementación, más la campaña ya declarada en la spec (12 sujetos, ~6 $, techo 14 y 8 $) y un revisor final Opus (~150k tokens).

**Goal**: cada capacidad declara su propósito, un script lo lista al vuelo y las tres skills que eligen capacidades lo ejecutan antes de abrir ninguna.

**Architecture**: la lectura de secciones pasa a un fichero común que cargan los dos scripts. El validador suma las comprobaciones del propósito, y el índice escribe una línea Markdown por capacidad. La guía de las skills es una frase en el paso 1 de cada una y en la ayuda del bloque «Capacidades» de `spec-template.md`.

**Tech Stack**: PowerShell 7 portable y Pester 5; Markdown para plantillas y skills; bash y `claude -p` para la campaña de sujetos.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks van en fila y la 3 es una campaña del hilo principal. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Scripts portables: PowerShell 7 sin APIs exclusivas de Windows (`architecture.md`).
- Un script que lee un artefacto del kit se prueba contra su plantilla calcada sin tocar y contra la plantilla calcada y rellenada a medias (`architecture.md`).
- Tope del propósito: 300 caracteres, medidos sobre el propósito en una sola línea.
- Mensajes exactos: `falta la sección «Propósito»` · `«Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad` · `«Propósito» tiene <n> caracteres; el máximo es 300 (una o dos frases)` · `«Propósito» debe ser la primera sección` · índice: `` - `<nombre>` — <propósito> ``, `(sin propósito)`, `Sin capacidades`.
- No se tocan: `skills/sdd-end-patch/`, `skills/sdd-start-task/references/commit-milestones.md`, `skills/sdd-templates/templates/patch-template.md`, el lanzador de referencia de `tests/`. No se renombra task → feature.

### De proceso

- Política de modelos (Art. IV): modelo y effort explícitos en cada despacho; revisor final Native con Opus y `sdd-kit:effort-high`; `fable` y `opus xhigh` prohibidos.
- Native con el ledger de `executing-plans`: `task-start`, RED apartados fuera del repo y comparados con `git diff --no-index` antes del commit, y `task-done`.
- Un commit por hito; commits bilingües con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Campaña: `SUBJECT_CAP=14`, `COST_CAP=8`, fichero `stop` junto a `red/run.sh`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script de lectura y cuatro comprobaciones; la guía es una frase por skill.
- [x] **YAGNI gate**: el fichero común tiene dos usos reales, los dos scripts; sin `-Json` ni otros formatos de salida.
- [x] **Brownfield gate**: el validador sigue aceptando todo lo que aceptaba, salvo la falta de propósito, que migra `v2.0.0.md`.
- [x] **Constitution check**: Art. I (campaña con previsión y techo), Art. V (migración), Art. VIII (plantilla única), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/CapabilitySections.ps1` — lectura de secciones y del propósito.
- `skills/sdd-templates/scripts/Get-CapabilityIndex.ps1` — el índice.
- `tests/Get-CapabilityIndex.Tests.ps1` — sus tests.
- `.docs/sdd/specs/<carpeta>/red/`, `green/` — arnés y salidas de la campaña.
- `tests/capabilities-index-red.md`, `tests/capabilities-index-green.md` — evidencia.

**Modificar**:

- `skills/sdd-templates/scripts/Test-Capabilities.ps1`, `tests/Test-Capabilities.Tests.ps1`, `tests/fixtures/capabilities/bookings.md`.
- `skills/sdd-templates/templates/capability-template.md`, `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-templates/SKILL.md`.
- `.docs/sdd/capabilities/*.md` (13), `skills/sdd-init-brownfield/references/migrations/v2.0.0.md`.
- `skills/sdd-start-task/SKILL.md`, `skills/sdd-roadmap/SKILL.md`, `skills/sdd-consult/SKILL.md`, `tests/CapabilityRules.Tests.ps1`.
- `.docs/sdd/tech-stack.md` (lista de scripts), `.docs/sdd/roadmap.md` (fila de deuda: el cierre del patch usa el índice).

**NO se tocan**: los de «No se tocan» de las restricciones de código.

### 1.6 Dependencias

- La 0070 (validador y bloque «Capacidades») está en `develop`; la 0064 va después.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El patch paralelo del lanzador toca `tests/` que uso | media | commits que chocan | cruzar ficheros con la base antes de cada task |
| El RED sale limpio | media | guía sin fallo medido | decisión 9 de la spec: entra sin prohibición, el GREEN la mide |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — El propósito en la plantilla, en el validador, en las capacidades y en la migración

**Modelo**: sesión (Native); effort de la sesión.
**Tests RED**: hilo principal · `tests/Test-Capabilities.Tests.ps1` (nuevos `It`), apartados en el scratchpad antes del código.
**Superficies**: tooling · docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/Test-Capabilities.Tests.ps1,tests/MigrationInitParity.Tests.ps1,tests/CapabilityRules.Tests.ps1,tests/CapabilitiesAtBirth.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque es el kit: la comprobación es el validador sobre `.docs/sdd` del repo, `Capacidades válidas: 13`.

**Interfaces**:
- Produce: `CapabilitySections.ps1` con `Get-SectionTitle([string]$Line)`, `Get-SectionLines([string[]]$Lines, [string]$Title)` (null si no hay sección) y `Get-CapabilityPurpose([string[]]$Lines)` (`$null` sin sección; `''` si está vacía o es solo `<…>`; si no, las líneas que no son `>` ni están en blanco, recortadas y unidas con un espacio).

**Ficheros**: crear `CapabilitySections.ps1`; modificar `Test-Capabilities.ps1`, sus tests y fixture, `capability-template.md`, las 13 capacidades y `v2.0.0.md`.

- [ ] **Step 1: tests RED** en `tests/Test-Capabilities.Tests.ps1`: la fixture `bookings.md` gana `## Propósito` con «Reservar y consultar salas por franja horaria desde el CLI.»; `It` nuevos: sin sección → `bookings.md: falta la sección «Propósito»`; vacía → `bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad`; solo ayuda `>` y `<una o dos frases…>` → el mismo mensaje; 412 caracteres en dos líneas → `bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)`; detrás de `## Requisitos` → `bookings.md: «Propósito» debe ser la primera sección`; plantilla calcada tal cual como `bookings.md` → exactamente el fallo de título y el de propósito vacío; plantilla con título y propósito rellenos y el resto a medias (ayudas y huecos de requisitos) → `Capacidades válidas: 1`; en «La migración a 2.0.0», un paso con «Propósito de las capacidades», «Sin gate» y «se salta».
- [ ] **Step 2: ejecutar y ver fallar** los `It` nuevos; apartar la copia en el scratchpad.
- [ ] **Step 3: código**: `CapabilitySections.ps1` (mover `Get-SectionTitle` y `Get-SectionLines`, añadir `Get-CapabilityPurpose`); en el validador, `. (Join-Path $PSScriptRoot 'CapabilitySections.ps1')`, `Propósito` en `$script:AllowedSections`, el mensaje de sección no admitida pasa a «solo «Propósito», «Requisitos» y «Reglas de la capacidad»», y `Test-CapabilityPurpose` en `Test-CapabilityFile`, con la ayuda de `Get-Help` actualizada.
- [ ] **Step 4: plantilla**: `## Propósito` tras la cita de reglas, con ayuda `>` (una o dos frases, ≤ 300 caracteres, qué cubre, sin procedencia) y hueco `<una o dos frases: qué cubre la capacidad>`; la última línea de la cita pasa a «Índice: lo genera `Get-CapabilityIndex.ps1` al vuelo; no hay `index.md`.»
- [ ] **Step 5: las 13 capacidades**: el párrafo bajo el título pasa a `## Propósito` en ≤ 300 caracteres y sin procedencia.
- [ ] **Step 6: migración**: paso 2 «**Propósito de las capacidades.**» (el paso del marcador pasa a ser el 3), con la frase «Además…» de `**Escribe**:` y la verificación como dice la spec, sin tokens nuevos en `**Escribe**:`.
- [ ] **Step 7: Verificación** — el comando de arriba, todo verde; comparar los RED con su copia.
- [ ] **Step 8: Commit de la task** `feat(sdd-templates): propósito obligatorio en cada capacidad`.

### Task 2 — `Get-CapabilityIndex.ps1`

**Modelo**: sesión (Native); effort de la sesión.
**Tests RED**: hilo principal · `tests/Get-CapabilityIndex.Tests.ps1`, apartado antes del código.
**Superficies**: tooling · docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/Get-CapabilityIndex.Tests.ps1,tests/Test-Capabilities.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque es el kit: sobre el repo, `Get-CapabilityIndex.ps1 -Path .docs/sdd` escribe 13 líneas, una por capacidad, con su propósito.

**Interfaces**:
- Consume: `Get-CapabilityPurpose` de `CapabilitySections.ps1`.
- Produce: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Get-CapabilityIndex.ps1" -Path "<raíz>/.docs/sdd"` → líneas `` - `<nombre>` — <propósito> `` en orden de nombre; `(sin propósito)`; `Sin capacidades`; siempre código 0.

- [ ] **Step 1: tests RED**: `bookings` con propósito y `rooms` sin él → las dos líneas de la spec y código 0; propósito en dos líneas con una línea `>` → una sola línea sin la ayuda; propósito de 412 caracteres → sale entero; sin carpeta y con la carpeta vacía → `Sin capacidades`; plantilla calcada tal cual → `` - `bookings` — (sin propósito) ``; plantilla rellenada a medias → su propósito; sobre `.docs/sdd` del repo → tantas líneas como ficheros, ninguna `(sin propósito)`.
- [ ] **Step 2: ejecutar y ver fallar**; apartar la copia.
- [ ] **Step 3: código** con ayuda `Get-Help` y salida UTF-8, como `Test-Capabilities.ps1`.
- [ ] **Step 4: docs**: fila en la tabla de scripts de `sdd-templates/SKILL.md` y mención en `tech-stack.md` junto a `Test-Capabilities.ps1`.
- [ ] **Step 5: Verificación** y comparación de RED.
- [ ] **Step 6: Commit** `feat(sdd-templates): índice de capacidades generado al vuelo`.

### Task 3 — Las skills ejecutan el índice (RED → guía → GREEN)

**Modelo**: sesión (Native) para la guía; sujetos `claude -p --model sonnet` (el lanzador).
**Tests RED**: hilo principal · `tests/CapabilityRules.Tests.ps1`: los tres `SKILL.md` nombran `Get-CapabilityIndex.ps1` en su paso 1, y el bloque de `spec-template.md` pasa de `listar .docs/sdd/capabilities/` a `Get-CapabilityIndex.ps1`.
**Superficies**: docs (skills) · tests
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/CapabilityRules.Tests.ps1 -Output Detailed"` y la campaña GREEN.
**Verificación lenta**: GREEN, `SCENARIOS="s r q"` con `SUBJECT=1` y `2`, `OUT_NAME=green`, `PURPOSE=1`, con el kit del working tree copiado al scratchpad · ~15 min.
**Se prueba en la aplicación**: no, porque es el kit: los sujetos del GREEN ejecutan el índice antes de abrir capacidades.

**Interfaces**:
- Consume: la línea de ejecución de la Task 2.

- [ ] **Step 1: RED** (lanzado con la spec): leer `red/out`, anotar por sujeto la capacidad elegida, los ficheros de `capabilities/` abiertos y las filas de control; escribir `tests/capabilities-index-red.md`.
- [ ] **Step 2: tests estáticos RED** en `CapabilityRules.Tests.ps1`; ver fallar; apartar copia.
- [ ] **Step 3: guía**: paso 1 de `sdd-start-task` («antes de abrir ninguna capacidad, ejecuta `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Get-CapabilityIndex.ps1" -Path .docs/sdd` y lee solo las que, por su propósito, toca la task»), paso 1 de `sdd-roadmap` y de `sdd-consult` con la misma frase adaptada, y la ayuda del bloque de `spec-template.md` («se escribe con la salida de `Get-CapabilityIndex.ps1`, con el nombre exacto que da el índice»).
- [ ] **Step 4: GREEN**: copiar el kit del working tree y lanzar los 6 sujetos; `tests/capabilities-index-green.md` con los fallos del RED y las filas de control.
- [ ] **Step 5: deuda**: fila de roadmap «el cierre del patch escribe el bloque con el índice» (decisión 6 de la spec).
- [ ] **Step 6: Commit** `feat(skills): las skills eligen capacidades con el índice generado`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,0h
- Estimación de implementación: 2,5h
- Base de la estimación: 3 tasks, dos scripts pequeños sobre un parser existente y una campaña de 12 sujetos con arnés reutilizado; referencia 0070 (M, formato + validador + campaña)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre: `pwsh -NoProfile -Command "Invoke-Pester tests -Output Normal"`, y `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>` tras fusionar.
- [ ] Criterios de la spec verificados.
- [ ] Revisión final: Opus con `sdd-kit:effort-high`, y su línea en `tasks.md`.
- [ ] Cierre vía `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

Todos los escenarios de la spec tienen su task; sin gate de plan en `delegate`.

- ADDED «Cada capacidad declara su propósito» → Task 1 (plantilla, capacidades, primera sección). ✓
- ADDED «El índice de capacidades se genera al vuelo» → Task 2 (script) y Task 3 (skills). ✓
- MODIFIED «La spec y el patch declaran sus capacidades al principio» → Task 3 (ayuda de `spec-template.md`). ✓
- MODIFIED «La consulta lee la capacidad, no las specs» → Task 3 (`sdd-consult`). ✓
- MODIFIED «El validador de capacidades» → Task 1. ✓
- ADDED «La migración a v2.0.0 añade el propósito a las capacidades» → Task 1 (Step 6). ✓
