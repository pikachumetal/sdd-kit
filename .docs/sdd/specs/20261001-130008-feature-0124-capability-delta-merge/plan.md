---
id: 20261001-130008-feature-0124-capability-delta-merge
feature: 0124
title: Plan de implementación — La fusión del delta de capacidades como script
spec: ./spec.md
status: approved
created: 2026-10-01
---

# Plan de implementación — La fusión del delta de capacidades como script

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native.** Las Tasks 1 y 2 comparten el parser del delta, y la 2 depende de las firmas de la 1. La Task 3 es una guía que se escribe a partir de lo que mide el RED, y la escribe el hilo que ha leído las salidas. Con tres tasks así encadenadas, un implementador por task no compensa su contexto.
2. **Modelo.** Implementa la sesión (Opus 5.5), porque el dev-lead aprobó por delegación sin la parada para bajar a Sonnet. Los sujetos headless van con Sonnet (`MODEL=sonnet`). El revisor final, con `sdd-kit:effort-high` + `opus`.
3. **El RED de la campaña va al principio de la Task 3**, contra un `git worktree add --detach` de `develop` en el scratchpad. En `develop` no existe el script, así que el RED mide la fusión a mano, que es el fallo de los tickets. El GREEN usa el kit de este worktree.
4. **La normalización se escribe como un formateador de líneas, no como un modelo de la capacidad.** Una línea en blanco antes y después de cada título `#`–`###`, ninguna doble, ninguna al principio y una sola nueva línea al final. Así se conserva el texto que no es requisito (un párrafo bajo `## Requisitos`, una cita), y queda lo que piden MD012 y MD022.
5. **Huecos de la plantilla**: un nombre de capacidad, un título o una línea fusionable con `<…>` fuera del código en línea falla con `«<…>» es un hueco de la plantilla`. Es lo que hace fallar, sin escribir, una `spec-template.md` calcada sin tocar o a medias (regla de `architecture.md`: un script que lee un artefacto se prueba contra su plantilla).
6. **Sin delta** (`Ninguna, porque…`, o sin subsecciones `### Capacidad:`): escribe `Sin delta que fusionar` y sale con 0. Así el paso de los cierres se puede ejecutar siempre.
7. **Fin de línea**: si el fichero de la capacidad usa CRLF, lo conserva; si no, LF. UTF-8 sin BOM.
8. **Coste**: ~3 h de implementación. Campaña: 5 sujetos en el RED, 5 en el GREEN y 3 de reserva; ~4 $, techo 7 $ y 2 h (spec, decisión 13). Revisor final: ~120k tokens.
9. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que el cierre de una feature o de un patch fusione el delta de capacidades con un comando del kit, todo o nada, y que el validador cace los restos que hoy deja la fusión a mano.

**Architecture**: `CapabilitySections.ps1` pasa a tener el único parser del delta, que leen `Test-Capabilities.ps1` y el script nuevo `Merge-CapabilityDelta.ps1`. El script calcula en memoria las capacidades resultantes, escribe solo si no hay fallos y normaliza los ficheros que toca. Las skills de cierre lo nombran en su paso de fusión.

**Tech Stack**: PowerShell 7 y Pester ≥ 5, Markdown (skills y plantillas), `tests/headless/` (sujetos Sonnet).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks comparten el parser y la Task 3 es guía escrita a partir del RED · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el porqué no deducible. El bloque de ayuda de `Get-Help` no es un comentario.
- Sin comentarios que citen documentos: nunca la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, ayuda, skills) en castellano con tildes.
- El revisor marca el incumplimiento como Important, salvo un umbral numérico superado en una unidad, que es Minor.
- Scripts portables: PowerShell 7 sin APIs exclusivas de Windows (rutas con `Join-Path`).
- Todo `*.Tests.ps1` que lance procesos va con `-Tag 'Slow'`, como `Test-Capabilities.Tests.ps1`.
- Mensajes literales del script (la spec los fija): `<fichero>: añadido «<t>»`, `<fichero>: sustituido «<t>»`, `<fichero>: quitado «<t>»`, `<fichero>: regla «<n>» sustituida`, `<fichero>: regla «<n>» añadida`, `<fichero>: «<t>» ya no estaba`, `<fichero>: «<t>» ya estaba` (un `ADDED` idéntico al vigente), `<artefacto>: «<t>» del MODIFIED no está en capabilities/<c>.md`, `<artefacto>: «<t>» cita la spec («decisión <n>»): reescríbelo en el delta sin la referencia y vuelve a ejecutar`, `<artefacto>: «<t>» del ADDED ya está en capabilities/<c>.md con otro texto: usa MODIFIED`, `<artefacto>: «<c>» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`. Del validador: `<fichero>: línea suelta en «<t>» (línea <n>): «<texto>»` y `<fichero>: resto de delta «Se valida en:» en la línea <n>`.
- De `sdd-end-feature` y `sdd-end-patch` solo se toca el paso de fusión; `patch-template.md` y `capability-template.md` no se tocan.

### De proceso

- Política de modelos: la del Art. IV. Revisor final con `sdd-kit:effort-high` + `opus`; sujetos headless con Sonnet.
- Campaña: `SUBJECT_CAP=13`, `COST_CAP=7` en cada llamada a `tests/headless/run.sh`, con `SPEC_DIR` en esta carpeta.
- Si un escenario sale limpio en el RED, su guía no se escribe y se repite como control en el GREEN (Art. I), tras mirar de dónde sacó cada sujeto la conducta.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con el trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Un commit por task. Nunca `--no-verify`; la suite completa, desde la herramienta PowerShell.

## Review Focus

- El título de un `MODIFIED` o `REMOVED` con espacios de más respecto al de la capacidad → se compara tras recortar y colapsar espacios; distinto en mayúsculas → no casa, y falla como «no está» · Task 2, `un título con espacios de más casa; con otras mayúsculas falla`
- Un párrafo entre `## Requisitos` y el primer `###` → se conserva, y el `ADDED` va tras el último requisito · Task 2, `conserva el texto que no es requisito`
- Un delta con dos capacidades, una de ellas con fallo → no se escribe ninguna de las dos · Task 2, `un fallo en una capacidad no escribe ninguna`
- `**REMOVED — X**` seguido de su línea `- motivo: …` → la línea de motivo no se fusiona ni cuenta como escenario · Task 2, `fusiona ADDED, MODIFIED con encabezado partido, REMOVED y una regla`
- Una entrada de reglas con su valor en varias líneas sangradas → se sustituye entera, con sus continuaciones · Task 2, `una regla con continuación se sustituye entera`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y dos comprobaciones; el parser se mueve, no se duplica.
- [x] **YAGNI gate**: sin modo «solo normalizar» ni sin parámetro de salida en seco (`-WhatIf`): el todo o nada ya protege, y normalizar las capacidades no tocadas es de la 0129.
- [x] **Brownfield gate**: el validador sigue dando verde a las 14 capacidades del repo (comprobado al escribir la spec); los tests vigentes de `Test-Capabilities.Tests.ps1` no cambian.
- [x] **Constitution check**: Art. I (RED/GREEN con previsión), Art. V (sin pasos de migración: el script no se copia al proyecto), Art. VIII (sin plantillas nuevas), Art. X (calidad de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1` — la fusión.
- `tests/Merge-CapabilityDelta.Tests.ps1` — sus tests.
- `red/subject.sh` de esta carpeta — molde `salas` y escenarios `f1`, `p1`, `t1`.
- `tests/capability-merge-red.md`, `tests/capability-merge-green.md` — evidencia.

**Modificar**:

- `skills/sdd-templates/scripts/CapabilitySections.ps1` — parser del delta y de requisitos, compartido.
- `skills/sdd-templates/scripts/Test-Capabilities.ps1` — usa el parser compartido; línea suelta y «Se valida en:».
- `tests/Test-Capabilities.Tests.ps1` — tests de las dos comprobaciones nuevas.
- `skills/sdd-templates/SKILL.md` — filas del script nuevo, del validador y de `CapabilitySections.ps1`.
- `skills/sdd-end-feature/SKILL.md` (paso 4) y `skills/sdd-end-feature/references/aprendizajes-skills.md` (paso 4).
- `skills/sdd-end-patch/SKILL.md` (paso 1, solo la frase de fusión).
- `skills/sdd-start-feature/SKILL.md` (paso 7, la frase del borrador del delta fusionado).
- `skills/sdd-templates/templates/spec-template.md` (ayuda del delta).
- `.docs/sdd/changelog.md` (`[Unreleased]`).

**NO se tocan**:

- `patch-template.md` y `capability-template.md` — spec, decisión 11.
- El resto de pasos de `sdd-end-feature` y `sdd-end-patch` — van en paralelo la 0050 y la 0120.
- `migrations/v2.3.0.md` — spec, decisión 12.
- `Get-CapabilityIndex.ps1` — no lee el delta.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

Ninguna: el script vive en el kit.

### 1.4 Contratos API

Interfaz del script: `pwsh -NoProfile -File Merge-CapabilityDelta.ps1 -Path <.docs/sdd> -Artifact <spec.md|patch.md>`. Salida en castellano, una línea por cambio o por fallo; 0 sin fallos, 1 con fallos y sin escribir.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Mover el parser rompe la comprobación `-Artifact` del patch 0105 | Baja | Alto | Los tests vigentes de `Test-Capabilities.Tests.ps1` corren sin cambios en la Task 1 |
| La normalización reformatea capacidades enteras en los proyectos | Alta | Bajo | Solo espacios en blanco, una vez por capacidad; dicho en el changelog |
| La regla de «decisión N» da un falso positivo en un texto legítimo | Media | Bajo | Solo fuera del código en línea; el mensaje dice cómo reescribirlo |

### 1.8 Rollout

Directo, en la 2.3.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — El parser del delta compartido y el validador más estricto

**Modelo**: la sesión (Opus 5.5), Native.
**Tests RED**: hilo principal · `tests/Test-Capabilities.Tests.ps1`, con copia fuera del repo antes del código.
**Superficies**: tooling.
**Verificación**: `Invoke-Pester -Path tests/Test-Capabilities.Tests.ps1,tests/CapabilityRules.Tests.ps1,tests/Get-CapabilityIndex.Tests.ps1 -Output Minimal` y `pwsh -NoProfile -File skills/sdd-templates/scripts/Test-Capabilities.ps1 -Path .docs/sdd`.
**Se prueba en la aplicación**: no, porque es tooling del kit: lo prueban Pester y el validador sobre las capacidades del repo.

**Interfaces**:
- Consume: nada.
- Produce, en `CapabilitySections.ps1`:
  - `Get-Requirements([string[]]$Lines)` → objetos `{ Title: string; Lines: List[string] }`, uno por `### `, con las líneas hasta el siguiente `###` (se mueve tal cual desde `Test-Capabilities.ps1`).
  - `Get-DeltaEntries([string[]]$Lines)` → objetos `{ Capability: string; Kind: 'ADDED'|'MODIFIED'|'REMOVED'|'RULES'; Title: string; Lines: List[string] }`. Lee cada `### Capacidad: \`<c>\``; `Title` es el del encabezado en negrita, unido si ocupa varias líneas y sin el `(antes: …)`, con los espacios colapsados (vacío en `RULES`); `Lines` son las líneas del cuerpo, tras el encabezado entero, hasta el siguiente encabezado en negrita o título `#`.
  - `Get-DeclaredCapabilities([string[]]$Block)` → objetos `{ Kind: 'Nuevas'|'Modificadas'; Name: string; Summary: string }`, con `Summary` el texto tras `—` (se mueve desde `Test-Capabilities.ps1` y gana `Summary`).

**Ficheros**: modificar `skills/sdd-templates/scripts/CapabilitySections.ps1`, `skills/sdd-templates/scripts/Test-Capabilities.ps1`, `tests/Test-Capabilities.Tests.ps1`.

- [ ] **Step 1: Tests RED** en `Describe 'Test-Capabilities.ps1 sobre capabilities/'`, sobre la fixture `bookings.md`:
  - `una línea suelta bajo un requisito falla con requisito, línea y texto`: insertar `guardada»)` tras el THEN de «Reservar una franja» (queda en la línea 13) → `$lines | Should -Contain 'bookings.md: línea suelta en «Reservar una franja» (línea 13): «guardada»)»'`, código 1.
  - `una cita, una línea sangrada y una línea en blanco bajo un requisito no son sueltas`: insertar `> nota`, `  sigue el THEN` y una línea vacía bajo «Reservar una franja» → `Should -Be @('Capacidades válidas: 1')`.
  - `una línea Se valida en en la capacidad es resto de delta`: insertar `- Se valida en: worktree con la base al día` tras el THEN de «Reservar una franja» (línea 13) → `Should -Contain 'bookings.md: resto de delta «Se valida en:» en la línea 13'`.
  - `un párrafo entre Requisitos y el primer requisito no es una línea suelta` → `Capacidades válidas: 1`.
- [ ] **Step 2: Implementación**: mover `Get-Requirements` y `Get-DeclaredCapabilities` a `CapabilitySections.ps1`; sustituir `Get-DeltaRequirements` por `Get-DeltaEntries` (en `Test-DeltaApplied`, filtrando `Kind -in 'ADDED','MODIFIED'`); añadir `Test-LooseLines([string[]]$Lines)` (solo dentro de `## Requisitos`, bajo un `###`: falla la línea no vacía que no empieza por `- `, `>` ni espacio en blanco) y la marca `^- Se valida en:` en `Test-DeltaLeftovers`. Ayuda `Get-Help` del script y de `CapabilitySections.ps1` al día.
- [ ] **Step 3: Verificación**: los comandos de «Verificación»; el validador escribe `Capacidades válidas: 14`.
- [ ] **Step 4: Commit de la task**.

### Task 2 — `Merge-CapabilityDelta.ps1`

**Modelo**: la sesión (Opus 5.5), Native.
**Tests RED**: hilo principal · `tests/Merge-CapabilityDelta.Tests.ps1`, con copia fuera del repo antes del código.
**Superficies**: tooling.
**Verificación**: `Invoke-Pester -Path tests/Merge-CapabilityDelta.Tests.ps1,tests/Test-Capabilities.Tests.ps1 -Output Minimal`.
**Se prueba en la aplicación**: no, porque es tooling del kit: lo prueba Pester, y en uso el cierre de esta misma feature.

**Interfaces**:
- Consume: `Get-Requirements`, `Get-DeltaEntries`, `Get-DeclaredCapabilities` y `Get-SectionLines` de `CapabilitySections.ps1` (Task 1).
- Produce: `Merge-CapabilityDelta.ps1 -Path <string> -Artifact <string>`; salida y códigos de la spec («La fusión del delta es un script» y «… falla sin escribir nada»). Además `Sin delta que fusionar` con 0 cuando el artefacto no tiene subsecciones `### Capacidad:`.

**Ficheros**: crear `skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1`, `tests/Merge-CapabilityDelta.Tests.ps1`.

- [ ] **Step 1: Tests RED** (`Describe 'Merge-CapabilityDelta.ps1' -Tag 'Slow'`, con un `New-SddFolder` como el de `Test-Capabilities.Tests.ps1`, la fixture `bookings.md` reescrita con línea en blanco tras cada título y la regla `**Avisos**: aviso si la reserva pisa un festivo`, y una spec con el delta del escenario de la spec):
  - `fusiona ADDED, MODIFIED con encabezado partido, REMOVED y una regla`: salida `Should -Be @('bookings.md: añadido «Cancelar una reserva»', 'bookings.md: sustituido «Reservar una franja»', 'bookings.md: quitado «Consultar salas libres»', 'bookings.md: regla «Avisos» sustituida')`, en el orden del delta, código 0; `bookings.md` contiene `### Cancelar una reserva` tras `### Reservar una franja`, no contiene `### Consultar salas libres` ni `- motivo:`, y su línea de avisos es `- **Avisos**: aviso si la reserva pisa un festivo o dura más de 4 h`; después `Test-Capabilities.ps1 -Artifact` da `Capacidades válidas: 1`.
  - `deja fuera Se valida en, la ayuda y el antes partido`: el fichero no contiene `Se valida en`, `guardada»)` ni ninguna línea que empiece por `>` venida del delta.
  - `normaliza las líneas en blanco del fichero que toca`: con la entrada sin línea en blanco tras un `###` y con una doble, la salida no contiene `"`n`n`n"` y cada línea `#`–`###` va seguida de una en blanco.
  - `conserva el texto que no es requisito`: un párrafo bajo `## Requisitos` sigue ahí.
  - `un MODIFIED que no está falla y no escribe nada`: `Should -Contain 'spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md'`, código 1, `bookings.md` byte a byte igual.
  - `un fallo en una capacidad no escribe ninguna`: dos capacidades, fallo en la segunda; la primera, igual.
  - `una cita de una decisión por número falla y no escribe`: `Should -Contain 'spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo en el delta sin la referencia y vuelve a ejecutar'`; y `entre comillas invertidas no cuenta como cita`: con `` `por la decisión 10` `` pasa.
  - `volver a ejecutarlo no cambia nada`: segunda ejecución con código 0; la salida contiene `bookings.md: «Cancelar una reserva» ya estaba` y `bookings.md: «Consultar salas libres» ya no estaba`, y el fichero es igual al de la primera.
  - `un ADDED con el título ya presente y otro texto falla`: `Should -Contain 'spec.md: «Cancelar una reserva» del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED'`.
  - `una capacidad declarada en Nuevas se crea con su propósito`: `- Nuevas: \`rooms\` — Salas, su aforo y su mantenimiento` → `rooms.md` empieza por `# Capacidad — rooms`, `## Propósito` y `Salas, su aforo y su mantenimiento` (el texto tal cual), seguidos de `## Requisitos` con sus requisitos; `sin Nuevas falla` y `desde un patch.md falla` con `«rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`.
  - `una regla nueva se añade en el orden canónico y crea la sección si falta`; `una regla con continuación se sustituye entera`.
  - `un título con espacios de más casa; con otras mayúsculas falla`.
  - `conserva CRLF si el fichero lo usa`.
  - `sin delta escribe Sin delta que fusionar y sale con 0`.
  - `la spec-template calcada sin tocar falla con el hueco y no escribe` y `la spec-template rellenada a medias falla con el hueco`: la plantilla se lee de `skills/sdd-templates/templates/spec-template.md`; la salida contiene `es un hueco de la plantilla`, código 1.
- [ ] **Step 2: Implementación** de `Merge-CapabilityDelta.ps1` con estas piezas (los cuerpos, del implementador): `Get-MergeableLines([string[]]$Lines)` (sin vacías, `>`, `- Se valida en:` ni `- motivo:`), `Find-SpecCitation([string]$Line)` (regex `(?i)decisi[oó]n(es)?\s+\d+` sobre la línea sin el código en línea), `Find-TemplateGap([string]$Text)` (`<[^>]+>` sin el código en línea), una función por tipo de cambio que devuelve líneas nuevas o un fallo, `Format-CapabilityLines([string[]]$Lines)` (decisión 4) y la escritura todo o nada al final. Ayuda `Get-Help` con ejemplo.
- [ ] **Step 3: Verificación**: los comandos de «Verificación».
- [ ] **Step 4: Commit de la task**.

### Task 3 — Las skills de cierre usan el script, y la plantilla no deja citar decisiones

**Modelo**: la sesión (Opus 5.5), Native; sujetos `MODEL=sonnet`.
**Tests RED**: hilo principal · la campaña: `red/subject.sh` y `tests/capability-merge-red.md`, antes de editar ninguna skill.
**Superficies**: docs (skills y plantillas), tests de evidencia.
**Verificación**: `Invoke-Pester -Path tests/Skills.Tests.ps1,tests/CapabilityRules.Tests.ps1,tests/CapabilitiesAtBirth.Tests.ps1 -Output Minimal` y las tablas de `tests/capability-merge-green.md`.
**Se prueba en la aplicación**: no, porque es guía del kit: lo prueba la campaña, y en uso los cierres de los proyectos.

**Interfaces**:
- Consume: `Merge-CapabilityDelta.ps1 -Path .docs/sdd -Artifact <spec.md|patch.md>` (Task 2) y las comprobaciones nuevas del validador (Task 1).
- Produce: nada que use otra task.

**Ficheros**: crear `red/subject.sh`, `tests/capability-merge-red.md`, `tests/capability-merge-green.md`; modificar `skills/sdd-end-feature/SKILL.md`, `skills/sdd-end-feature/references/aprendizajes-skills.md`, `skills/sdd-end-patch/SKILL.md`, `skills/sdd-start-feature/SKILL.md`, `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-templates/SKILL.md`, `.docs/sdd/changelog.md`.

- [ ] **Step 1: RED** con el kit de `develop`: `f1` ×2, `p1` ×1, `t1` ×2 (spec, decisión 13). Por sujeto: la capacidad resultante, `Test-Capabilities.ps1` de la rama sobre ella, si editó a mano o con un script propio y cuánto tardó. Se anota en `tests/capability-merge-red.md` con las frases textuales.
- [ ] **Step 2: Guía**, dirigida a los fallos del RED: el paso 4 de `sdd-end-feature` y el bloque «Capacidades» del paso 1 de `sdd-end-patch` ejecutan `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Merge-CapabilityDelta.ps1" -Path .docs/sdd -Artifact <ruta>` antes del validador y, si falla, corrigen lo que dice el mensaje y lo vuelven a ejecutar, nunca a mano; `aprendizajes-skills.md` remite al script en vez de describir la fusión; el paso 7 de `sdd-start-feature` dice que el borrador del delta fusionado sale del mismo comando; `spec-template.md` dice en la ayuda del delta que un THEN no cita decisiones de la spec por número (solo si `t1` falla en el RED). Filas de `skills/sdd-templates/SKILL.md` y entrada de `[Unreleased]`.
- [ ] **Step 3: GREEN** con el kit de la rama: los mismos escenarios, con las conductas del RED que ya se cumplían como filas de control.
- [ ] **Step 4: Verificación** y **commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 3h
- Base de la estimación: 3 tasks; un script de ~200 líneas con ~20 tests Pester (referencia: patch 0105, ~1 h por una comprobación del validador) y una campaña de 10 sujetos (0127: ~70 min).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal, desde la herramienta PowerShell: `Invoke-Pester -Path tests` entero.
- [ ] Cada THEN de la spec, con ejecución real del script sobre una copia del molde `salas`.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre con `sdd-end-feature`, que fusiona el delta de esta spec con el propio script.

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «La fusión del delta es un script» → Task 2. ✓
- ADDED «La fusión del delta falla sin escribir nada» → Task 2. ✓
- MODIFIED «El cierre fusiona el delta en la verdad viva» → Task 3 (paso 4, `aprendizajes-skills.md`, paso 7), medido por `f1`. ✓
- MODIFIED «El cierre de un patch fusiona su delta» → Task 3, medido por `p1`. ✓
- MODIFIED «El delta declara el comportamiento por capacidad» → Task 3 (`spec-template.md`), medido por `t1`; el rechazo, Task 2. ✓
- MODIFIED «El validador de capacidades» → Task 1. ✓
- Reglas «Avisos» → Tasks 1 y 2 (mensajes literales). ✓
- Review Focus → Task 2, cinco tests nombrados. ✓
