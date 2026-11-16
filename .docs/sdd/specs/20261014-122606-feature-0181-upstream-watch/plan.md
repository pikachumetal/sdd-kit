---
id: 20261014-122606-feature-0181-upstream-watch
feature: 0181
title: Plan de implementación — Vigilancia de fuentes
spec: ./spec.md
status: draft
created: 2026-10-14
---

# Plan de implementación — Vigilancia de fuentes

## Decisiones que he tomado yo — valida estas

1. **Modelo**: Native, así que la sesión implementa las tres tasks (hoy Opus 5.5; el dev-lead eligió no parar antes de la Task 1). El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
2. **Ejecución: native**, porque son tres tasks encadenadas por una sola interfaz (la tabla `## Fuentes vigiladas`, que la Task 2 lee y la Task 3 actualiza). Un error lo caza el Pester de la Task 2 o el propio check, y el plan cabe en un contexto. La Task 3 es juicio de lectura, mejor en el hilo que tiene la spec.
3. **El clone se identifica con `git config --get remote.origin.url`, no con `git remote get-url`**: `get-url` aplica `url.<base>.insteadOf`, y los clones de juguete del Pester redirigen `https://github.com/acme/juguete` a un origen local.
4. **Fetch con `git fetch --tags --force --quiet origin`**: sin `--force`, un tag movido en el origen hace fallar el fetch, y la fila fallaría sin que haya una versión nueva.
5. **Barrido de procedencia**: frases de 8 palabras en común (minúsculas, palabras `[a-z0-9']+`), con 5 o más frases en común para listar un par. Corre contra los `.md` de los seis clones. Las plantillas en castellano se miran por sus menciones de fuentes, porque una traducción no comparte frases.
6. **La versión de `sdd-grilling`** sale de comparar con el mismo barrido su `SKILL.md` contra `skills/productivity/grilling/SKILL.md` en `v1.2.3`, `86cba45` y `85f83d3`. Gana el de más frases en común; si empatan, el aviso dice «entre <a> y <b>».
7. **Fechas iniciales de la tabla**: la del commit que escribió cada versión en el repo. superpowers, 2026-10-10. OpenSpec, 2026-09-20 (reglas revisadas, según `tech-stack.md`). Spec Kit, 2026-09-30. mattpocock/skills, 2026-10-08. MADR, 2026-10-07 (feature 0142). impeccable, 2026-09-29.
8. **`setx SDD_UPSTREAM_DIR D:/code/github/upstream`** en la máquina del dev-lead, más `$env:` en la sesión, porque `setx` solo afecta a los procesos nuevos.
9. **Gate de cierre de este repo** (§3): no hay `operations.md` ni §Testing en `tech-stack.md`, así que sería `no declarado`. Uso las tareas de moon de «Contenido y build», como la 0150.
10. **Riesgo alto**: ninguno. El check no está en ningún hook, y su Pester va en `Slow`.
11. **Coste estimado**: 4,5 h de implementación. Sin subagentes salvo el revisor final (~150k tokens, ~3 $).
12. **Review Focus**: 5 entradas que la spec no fija; ver la sección.

**Goal**: dejar las fuentes del kit revisadas y en una tabla, y un check del repo que falle cuando una tenga un tag más nuevo que su versión vista.

**Architecture**: la tabla `## Fuentes vigiladas` de `THIRD_PARTY_NOTICES.md` es el dato. `tests/upstream/check.ts` la lee, encuentra el clone de cada fila en `SDD_UPSTREAM_DIR` por su remoto, hace fetch y compara tags de la misma familia. La revisión es lectura de diffs, con el resultado en `upstream-review.md` y filas en el roadmap.

**Tech Stack**: Node ≥ 22.18.0 con TypeScript sin compilar y solo módulos `node:*`; git; Pester ≥ 5 para el test del check; moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks encadenadas por la tabla de `THIRD_PARTY_NOTICES.md`, un error lo caza el Pester de la Task 2 o el check real, y el plan cabe en un contexto; con `execution: auto`, fijado en sdd-kit.json. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- El check corre con Node ≥ 22.18.0 sin compilar (solo sintaxis que se borra), sin dependencias: módulos `node:*` y `cli/src/git/git.ts`.
- Mensajes del check, literales:
  - `Fuentes al día: <n>.`
  - `<Fuente>: vista <vista>, última <última>. Revisa: git -C <clone> diff <vista>..<última>`
  - `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.`
  - `<Fuente>: sin clone de <repo> en <carpeta>.`
  - `<Fuente>: la versión vista <vista> no es un tag del clone.`
  - `<Fuente>: no se pudo actualizar el clone: <primera línea del error de git>.`
  - `Sin la tabla de «Fuentes vigiladas» en <ruta>.`
- Cabecera de la tabla, literal: `| Fuente | Repo | Versión vista | Fecha |`.

### De proceso

- Política de modelos del Art. IV: modelo y effort declarados en cada despacho; `fable` y `opus xhigh` prohibidos por defecto; revisor final con `sdd-kit:effort-high` + `opus`.
- Native: la sesión implementa; commits por hito ([commit-milestones.md](../../../../skills/sdd-start-feature/references/commit-milestones.md)): apertura, uno por task y cierre.
- Commits con tipo/scope en inglés, título y cuerpo en castellano, y la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Dos dígitos en una parte de la versión → `v1.10.0` es más nueva que `v1.9.0`, no al revés por orden de texto · Task 2, `compara 1.10.0 por encima de 1.9.0`
- El origen con `.git` y otras mayúsculas que la fila (`https://github.com/acme/juguete.git` frente a `[Acme/Juguete]`) → encuentra el clone · Task 2, `encuentra el clone aunque el origen lleve .git y otras mayúsculas`
- Líneas después de la tabla que no son filas (la sección de avisos, con `- `) → no se leen como fuentes · Task 2, `S1 todo al día` (el fichero de juguete lleva avisos debajo de la tabla)
- Una carpeta de `SDD_UPSTREAM_DIR` que no es un repo git, o un fichero suelto → se ignora sin romper · Task 2, `S1 todo al día` (la carpeta de juguete lleva `notas.txt` y una carpeta vacía)
- La tabla sin el fichero que se le pasa → `Sin la tabla…`, no una traza · Task 2, `sin tabla`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y una tabla; sin configuración más allá de una variable de entorno.
- [x] **YAGNI gate**: sin opciones (`--offline`, `--json`) que nadie pidió.
- [x] **Brownfield gate**: sigue el patrón de `tests/headless/battery.mjs` y `tests/Battery.Tests.ps1`; reutiliza `cli/src/git/git.ts`.
- [x] **Constitution check**: Art. V (lo que la feature cumple), Art. IX (avisos con versión), Art. X (código), Art. XI (la revisión es un artefacto de evento).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/upstream/check.ts` — el check: lee la tabla, encuentra clones, hace fetch y compara tags.
- `tests/UpstreamWatch.Tests.ps1` — Pester `Slow` del check, con orígenes y clones de juguete.
- `.docs/sdd/specs/20261014-122606-feature-0181-upstream-watch/provenance-scan.mjs` — barrido de procedencia, de un solo uso, que se queda como evidencia.
- `.docs/sdd/specs/20261014-122606-feature-0181-upstream-watch/upstream-review.md` — procedencia de las skills y revisión de cada fuente.

**Modificar**:

- `THIRD_PARTY_NOTICES.md` — sección `## Fuentes vigiladas` con la tabla; versión en cada fork y skill de desarrollo; aviso de MADR; lo que falte según el inventario.
- `tests/SuperpowersCompat.Tests.ps1` — la superpowers validada se lee en la tabla.
- `moon.yml` — tarea `upstream`.
- `.docs/sdd/tech-stack.md` — `kit:upstream` en «Contenido y build»; «Referencias de vigilancia» adelgazada.
- `CLAUDE.md` — regla 5 de la sesión.
- `.docs/sdd/roadmap.md` — `moon run kit:upstream` en la fila 0152; filas de lo que convenga traer.

**NO se tocan**:

- `skills/**/SKILL.md` y `references/` — lo que convenga traer va a filas (spec, «No entra»); solo puede entrar un `NOTICE` que falte.
- `cli/src/` — el check usa `git.ts` y no añade verbos.
- `README.md` — la versión validada de superpowers no cambia.

### 1.6 Dependencias

Los clones de `D:/code/github/upstream/` (superpowers, OpenSpec, spec-kit, mattpocock-skills, madr, e impeccable, que clona la Task 1), y red para el fetch.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una fuente publica otra versión durante la feature | baja | S8 da rojo al cerrar | se revisa también esa versión, o se apunta y se deja la vista donde quedó |
| Spec Kit es demasiado grande para revisarlo por diff | media | la Task 3 se alarga | ficheros acotados en la spec (✋ 16) |

### 1.8 Rollout

Directo. El dev-lead ya tiene la variable fijada tras la Task 2.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Tabla de fuentes vigiladas, versiones de los avisos e inventario de procedencia

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: TDD del propio hilo · `tests/SuperpowersCompat.Tests.ps1`
**Superficies**: docs · tooling (Pester rápido)
**Verificación**: `moon run kit:test-fast`

**Interfaces**:
- Consume: nada.
- Produce: la sección `## Fuentes vigiladas` de `THIRD_PARTY_NOTICES.md`, con la cabecera `| Fuente | Repo | Versión vista | Fecha |`, el repo como `[owner/name](https://github.com/owner/name)` y la versión entre comillas invertidas. `upstream-review.md` con su sección `## Procedencia`.

**Ficheros**: modificar `THIRD_PARTY_NOTICES.md`, `tests/SuperpowersCompat.Tests.ps1`; crear `provenance-scan.mjs` y `upstream-review.md` en la carpeta de la feature.

- [ ] **Step 1: RED** — en `tests/SuperpowersCompat.Tests.ps1`, sustituye el `It 'las referencias de vigilancia declaran validada la 7.0.0 en la caché de superpowers-marketplace'` por:

  ```powershell
  It 'THIRD_PARTY_NOTICES vigila superpowers en la 7.0.0' {
    $row = (Get-KitFile 'THIRD_PARTY_NOTICES.md') -split "`n" | Where-Object { $_ -match '^\| superpowers \|' }
    $row | Should -Match '\| \[obra/superpowers\]\(https://github\.com/obra/superpowers\) \| `v7\.0\.0` \|'
  }
  ```

  `moon run kit:test-fast` → rojo en ese `It`.
- [ ] **Step 2: clone de impeccable** — `git clone https://github.com/pbakaus/impeccable D:/code/github/upstream/impeccable`.
- [ ] **Step 3: tabla** — en `THIRD_PARTY_NOTICES.md`, tras el H1, `## Fuentes vigiladas` con una frase: de qué fuentes copia texto el kit (avisos de abajo) o toma conceptos (OpenSpec, Spec Kit), y que `moon run kit:upstream` compara la versión vista con el último tag de su clone. Después, la tabla:

  | Fuente | Repo | Versión vista | Fecha |
  | --- | --- | --- | --- |
  | superpowers | [obra/superpowers](https://github.com/obra/superpowers) | `v7.0.0` | 2026-10-10 |
  | OpenSpec | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | `v1.11.0` | 2026-09-20 |
  | Spec Kit | [github/spec-kit](https://github.com/github/spec-kit) | `v0.8.7` | 2026-09-30 |
  | mattpocock/skills | [mattpocock/skills](https://github.com/mattpocock/skills) | `v1.2.3` | 2026-10-08 |
  | MADR | [adr/madr](https://github.com/adr/madr) | `4.0.0` | 2026-10-07 |
  | impeccable | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | `skill-v4.3.1` | 2026-09-29 |

  La lista de avisos que ya existe va bajo `## Skills y plantillas del kit`.
- [ ] **Step 4: barrido de procedencia** — `provenance-scan.mjs <skills-dir> <upstream-dir>`: frases de 8 palabras (minúsculas, palabras `[a-z0-9']+`) de cada `.md` de `skills/` contra cada `.md` de los clones (sin `node_modules/`). Escribe `<fichero del kit> → <clone>/<fichero> · <n>` con n ≥ 5, de mayor a menor. Ejecútalo y busca además las menciones de fuentes en `skills/sdd-templates/templates/` (`OpenSpec|MADR|impeccable|mattpocock|Spec Kit|Keep a Changelog`). Con eso, escribe `## Procedencia` en `upstream-review.md`: una tabla `| Skill o plantilla | Texto de | Versión | Aviso | Invoca de fuera |`, con una fila por skill (las 22) y por plantilla con fuente. «Invoca de fuera» lista las `superpowers:*` y las herramientas externas que nombra (`impeccable detect`). El comando y su salida resumida van en la misma sección.
- [ ] **Step 5: versiones y huecos** — en `THIRD_PARTY_NOTICES.md`:
  - `sdd-grilling` lleva su versión: el barrido de su `SKILL.md` contra `grilling` en `v1.2.3`, `86cba45` y `85f83d3` (gana el de más frases; si empatan, «entre <a> y <b>»).
  - `domain-modeling` dice «`b0618bc`, posterior a v1.3.1».
  - Una línea nueva: `adr-template.md` toma la forma mínima de [MADR](https://github.com/adr/madr) 4.0.0 — MIT OR CC0-1.0.
  - Skills de desarrollo: `writing-skills` 7.0.0 y `writing-for-agents` v1.3.1.
  - Cada fila del inventario con texto de una fuente y sin aviso gana su línea, y su `NOTICE` en la carpeta de la skill si la licencia lo pide (MIT: sí).
- [ ] **Step 6: Verificación** — `moon run kit:test-fast` → verde.
- [ ] **Step 7: Commit de la task** — `docs(notices): fuentes vigiladas, versiones de los avisos y procedencia de las skills`.

### Task 2 — El check `kit:upstream`

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: TDD del propio hilo · `tests/UpstreamWatch.Tests.ps1`
**Superficies**: tooling · docs
**Verificación**: `pwsh -NoProfile -Command "exit (Invoke-Pester -Path tests/UpstreamWatch.Tests.ps1 -Output Minimal -PassThru).FailedCount"` · `moon run kit:test-fast kit:roadmap` · `moon run kit:upstream` (RED real: sale con 1)

**Interfaces**:
- Consume: la tabla `## Fuentes vigiladas` de `THIRD_PARTY_NOTICES.md` (Task 1).
- Produce: `node tests/upstream/check.ts [<ruta de THIRD_PARTY_NOTICES.md>]` y `moon run kit:upstream`. Lee `SDD_UPSTREAM_DIR`; escribe los mensajes de las Restricciones globales; sale con 0 si todo está al día y con 1 si no.

**Ficheros**: crear `tests/upstream/check.ts`, `tests/UpstreamWatch.Tests.ps1`; modificar `moon.yml`, `.docs/sdd/tech-stack.md`, `CLAUDE.md`, `.docs/sdd/roadmap.md`.

- [ ] **Step 1: RED** — `tests/UpstreamWatch.Tests.ps1`, `Describe … -Tag 'Slow'`, con `Clear-GitEnv` como en `tests/Battery.Tests.ps1`:
  - Ayudante `New-Source -Name <n> -Tags <tags>`: crea el origen en `TestDrive/origins/<n>` (`git init`, un commit, los tags) y lo clona en `TestDrive/upstream/<n>`. Después, `git remote set-url origin https://github.com/acme/<n>` y `git config url.<ruta del origen>.insteadOf https://github.com/acme/<n>`.
  - Ayudante `New-Notices -Seen <tag> [-Repo <owner/name>]`: escribe en `TestDrive` un `THIRD_PARTY_NOTICES.md` con `## Fuentes vigiladas`, la cabecera, la fila `| Juguete | [acme/juguete](https://github.com/acme/juguete) | `<tag>` | 2026-10-14 |` y debajo una lista de avisos (`- algo adapta…`).
  - `TestDrive/upstream` lleva además `notas.txt` y una carpeta vacía.
  - El check se lanza con `& node tests/upstream/check.ts <notices> 2>&1` y `$env:SDD_UPSTREAM_DIR` fijada en el test y restaurada en `AfterEach`.

  | `It` | GIVEN | Asserts |
  | --- | --- | --- |
  | `S1 todo al día` | tags `v0.9.0`, `v1.0.0`; vista `v1.0.0` | salida `Fuentes al día: 1.`; código 0 |
  | `S2 versión nueva en el origen` | clone con `v1.0.0`; tag `v1.1.0` añadido al origen después | `-Match '^Juguete: vista v1\.0\.0, última v1\.1\.0\. Revisa: git -C .+juguete diff v1\.0\.0\.\.v1\.1\.0$'`; código 1 |
  | `S3 otras familias y prereleases no cuentan` | tags `v1.0.0`, `v1.1.0-beta`, `@acme/juguete@9.9.9` | `Fuentes al día: 1.`; código 0 |
  | `S4 sin la variable` | sin `SDD_UPSTREAM_DIR` | `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.`; código 1 |
  | `S5 sin clone` | `upstream` sin clones | `Juguete: sin clone de acme/juguete en <TestDrive/upstream>.`; código 1 |
  | `S6 la vista no es un tag` | vista `v2.0.0` | `Juguete: la versión vista v2.0.0 no es un tag del clone.`; código 1 |
  | `S7 origen inexistente` | `insteadOf` a una ruta que no existe | `-Match '^Juguete: no se pudo actualizar el clone: '`; código 1 |
  | `compara 1.10.0 por encima de 1.9.0` | tags `v1.9.0`, `v1.10.0`; vista `v1.9.0` | `-Match 'vista v1\.9\.0, última v1\.10\.0'`; código 1 |
  | `encuentra el clone aunque el origen lleve .git y otras mayúsculas` | origen `https://github.com/acme/juguete.git`; fila `[Acme/Juguete]` | `Fuentes al día: 1.`; código 0 |
  | `sin tabla` | notices sin `## Fuentes vigiladas` | `Sin la tabla de «Fuentes vigiladas» en <ruta>.`; código 1 |

  Ejecútalo → rojo (no existe el script).
- [ ] **Step 2: Implementación** — `tests/upstream/check.ts`, con `import { git } from '../../cli/src/git/git.ts'`:
  - `interface Source { name: string; repo: string; seen: string }`, donde `repo` es `owner/name` en minúsculas.
  - `parseSources(markdown: string): Source[] | null`: busca la cabecera literal y lee filas hasta la primera línea que no empieza por `|`. Devuelve `null` si no hay cabecera.
  - `repoOfUrl(url: string): string | null`: `github.com/<owner>/<name>` sin `.git` y en minúsculas.
  - `parseTag(tag: string): { prefix: string; version: number[] } | null`: `^(.*?)(\d+)\.(\d+)\.(\d+)$`. Devuelve `null` con un sufijo de prerelease o si no casa.
  - `newestTag(tags: string[], seen: string): string`: el de mismo `prefix` con la versión mayor, comparada por número; si ninguno supera a la vista, `seen`.
  - `findClones(dir: string): Promise<Map<string, string>>`: el repo de cada subcarpeta, leído con `git config --get remote.origin.url`; las que no son repo se ignoran.
  - `checkSource(source: Source, clone: string | undefined, dir: string): Promise<string | null>`: el mensaje del problema o `null`. Hace `git fetch --tags --force --quiet origin` y `git tag --list`.
  - `main(argv: string[]): Promise<number>`: ruta por defecto `<raíz del repo>/THIRD_PARTY_NOTICES.md`, calculada desde `import.meta.dirname`.
- [ ] **Step 3: tarea de moon** — en `moon.yml`, la tarea `upstream` con `command: node`, `args: [tests/upstream/check.ts]` y `options: { cache: false }`.
- [ ] **Step 4: docs** —
  - `tech-stack.md` «Contenido y build»: `kit:upstream` en la lista de tareas, «la vigilancia de fuentes, fuera de hooks y de `kit:test`; pide `SDD_UPSTREAM_DIR`».
  - «Referencias de vigilancia» queda así. Primero, un párrafo: las fuentes con versión están en la tabla de `THIRD_PARTY_NOTICES.md`, y `moon run kit:upstream` falla si una tiene un tag más nuevo que su vista. Al revisar se hace `git diff <vista>..<última>` en lo que el kit forkea y en sus conceptos: OpenSpec, `schemas/spec-driven/schema.yaml` y `docs/`; Spec Kit, `CHANGELOG.md`, `spec-driven.md` y `templates/`. De cada cambio se decide si se asume, se modifica o se mantiene (propuesta 0119), y la fila sube a la última versión. Debajo quedan las referencias sin versión: `claude plugin eval`, `diagnosing-superpowers`, OpenSpec con ADR, ADR, MySpec y CodeMySpec. Salen las líneas de superpowers (la caché), OpenSpec y Spec Kit.
  - `CLAUDE.md`, regla 5 de «Reglas de la sesión»: «**Al preparar una release del kit**, antes de nada `moon run kit:upstream` (una vez por máquina: `setx SDD_UPSTREAM_DIR <carpeta de los clones>`): si falla, revisar las fuentes que nombra es parte de la release (Art. V), y lo que convenga traer va al roadmap.»
  - `roadmap.md`, fila 0152: «Incluye también `moon run kit:upstream` en la batería de release (feature 0181).»
- [ ] **Step 5: Verificación** — el Pester → verde. `setx SDD_UPSTREAM_DIR D:/code/github/upstream` y `$env:SDD_UPSTREAM_DIR` en la sesión. `moon run kit:upstream` → sale con 1, con las líneas de OpenSpec, Spec Kit, mattpocock/skills e impeccable (RED real, al walkthrough). `moon run kit:test-fast kit:roadmap` → verde.
- [ ] **Step 6: Commit de la task** — `feat(tests): check kit:upstream de las versiones nuevas de las fuentes`.

### Task 3 — Revisión de las fuentes

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: el check real de la Task 2, en rojo
**Superficies**: docs
**Verificación**: `moon run kit:upstream kit:roadmap`

**Interfaces**:
- Consume: `moon run kit:upstream` y la tabla (Tasks 1 y 2); `upstream-review.md` (Task 1).
- Produce: las versiones vistas al día; `upstream-review.md` con una sección por fuente; filas en el roadmap.

**Ficheros**: modificar `upstream-review.md`, `THIRD_PARTY_NOTICES.md`, `.docs/sdd/roadmap.md`.

- [ ] **Step 1: revisión por fuente** — con el diff que da el check, acotado a:
  - OpenSpec `v1.11.0..v1.14.1`: `schemas/spec-driven/schema.yaml` y `docs/`.
  - mattpocock/skills `v1.2.3..v1.3.1`: `skills/productivity/grilling/`, `teach/`, `wait-what/` y `skills/engineering/to-spec/`.
  - Spec Kit `v0.8.7..v1.2.0`: `CHANGELOG.md`, `spec-driven.md` y `templates/`.
  - impeccable `skill-v4.3.1..skill-v4.5.2`: `reference/init.md`.

  En `upstream-review.md`, una sección por fuente: el comando y una tabla `| Cambio | Pieza del kit | Decisión | Destino |`, con la decisión «se asume», «se modifica» o «se mantiene». En un fork, el texto nuevo se asume salvo por los tres motivos de la ADR 0013, citando el motivo. Una pieza que la fuente no cambia no lleva fila.
- [ ] **Step 2: destinos** — lo que convenga traer va como fila nueva al final de «Deuda técnica», con la forma de sus filas, o como «Incluye también: …» en la fila de la 3.0.0 que toca esa pieza. Ya hay un candidato: el aviso de OpenSpec 1.14.1 de un requisito de más de 500 caracteres, del ticket de la feature 0150 §2.
- [ ] **Step 3: versiones vistas** — en la tabla, OpenSpec `v1.14.1`, Spec Kit `v1.2.0`, mattpocock/skills `v1.3.1` e impeccable la última de su familia, todas con fecha 2026-10-14.
- [ ] **Step 4: Verificación** — `moon run kit:upstream` → `Fuentes al día: 6.`, con código 0 (S8). `moon run kit:roadmap` → verde.
- [ ] **Step 5: Commit de la task** — `docs(roadmap): revisión de OpenSpec, mattpocock/skills, Spec Kit e impeccable`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,25 h
- Estimación de implementación: 4,5 h (Task 1: 1,25 h; Task 2: 1,25 h; Task 3: 2 h)
- Base de la estimación: 3 tasks; un script de ~120 líneas con su Pester, como `battery.mjs`; la revisión de 4 diffs acotados (~190 líneas de OpenSpec, ~40 de mattpocock, Spec Kit sin medir). Ratio infra/tooling del log: 0,45 (p25–p75 0,37–0,55).
- Confianza: media (lo que tarde Spec Kit)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `no declarado` en `operations.md` ni en `tech-stack.md` §Testing (decisión 9); se ejecutan las tareas de moon de «Contenido y build»: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, y `moon run kit:upstream` (S8)
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Tabla `## Fuentes vigiladas` en `THIRD_PARTY_NOTICES.md` (✋ 2, 13, 18) → Task 1. ✓
- Versiones de los forks y skills de desarrollo; aviso de MADR (✋ 5, 17) → Task 1. ✓
- Inventario de procedencia (enmienda) → Task 1, Steps 4-5. ✓
- impeccable clonado y en la tabla (✋ 1) → Task 1. ✓
- `SuperpowersCompat.Tests.ps1` (✋ 21) → Task 1, Step 1. ✓
- Check S1–S7, mensajes (✋ 6-12) → Task 2, Pester. ✓
- `moon run kit:upstream`, `SDD_UPSTREAM_DIR` (✋ 6, 8) → Task 2, Steps 3 y 5. ✓
- «Referencias de vigilancia» adelgazada (✋ 3, 20) → Task 2, Step 4. ✓
- Regla de `CLAUDE.md` y fila 0152 (✋ 14) → Task 2, Step 4. ✓
- RED real con cuatro fuentes (✋ 18) → Task 2, Step 5. ✓
- Revisión por fuente, ficheros acotados (✋ 15, 16), destinos en el roadmap → Task 3, Steps 1-2. ✓
- S8 → Task 3, Step 4. ✓
- Aplicar lo que convenga traer → N/A (spec, «No entra»). ✓
- Review Focus: las 5 líneas → Task 2, sus `It`. ✓
