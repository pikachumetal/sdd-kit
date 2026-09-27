---
id: 20260925-163055-task-0064-task-to-feature-rename
feature: 0064
title: Walkthrough — Renombrado task → feature
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — Renombrado task → feature

> La carpeta conserva `-task-` porque se creó antes del renombrado (decisión 13 de la spec). Su `id:` es el nombre de la carpeta, no el patrón nuevo.

## 1. Cambios realizados

- **Lectores** (`af6e722`): `Get-NextSddId.ps1` y `Build-EstimationLog.ps1` reconocen las carpetas `-feature-` y el campo `feature:` junto al legado `-task-`/`task:`. La columna del id del estimation-log se llama `Id`. Las plantillas de spec, plan, walkthrough, tasks, research y data-model escriben `feature`. `nombrado.md` fija `(feature|patch|proposal)`, con `-task-` como legado. La tabla de release de `roadmap-template.md` titula `Feature` su columna.
- **Skills** (`9963d5b`): `git mv` de `sdd-start-task` → `sdd-start-feature` y `sdd-end-task` → `sdd-end-feature`. Vocabulario de la unidad en las 13 skills, sus `references/`, las plantillas, `hooks/router.md` y el README. Las tasks del plan de superpowers conservan su nombre. Los tests Pester siguen los literales nuevos sin perder ninguna aserción.
- **Migración y docs vivos** (`1ee68c4`):
  - Paso 3 de `migrations/v2.0.0.md`: sustituye los dos nombres en `CLAUDE.md`, `AGENTS.md` y los docs vivos del proyecto, sin gate y sin tocar el histórico.
  - Docs vivos del repo: `CLAUDE.md`, constitution (Art. IV), misión, arquitectura y `.docs/workflow/`.
  - Test guarda: `tests/FeatureRename.Tests.ps1` falla si queda un nombre viejo fuera del histórico.
- **Campaña** (`3ba8934`): GREEN del enrutado y de la migración.
- **Revisión final** (`a9e9211`): `tech-stack.md` recomendaba situar a un sujeto con `sdd-start-task`.
- **Enmienda** (`5f03a89`): las filas nuevas del roadmap se saldan con `**[Feature <id>, …]**`; `Task` queda como legado que se cuenta.
- **Cierre**:
  - Fusión del delta en 7 capacidades (`routing`, `task-flow`, `task-ids`, `estimation`, `kit-feedback`, `migration`, `roadmap`).
  - Vocabulario de las 11 que nombraban la unidad, incluidos los cinco requisitos ambiguos de la decisión 9.
  - `capabilities/` sale de la lista blanca del test guarda; `capabilities/migration.md` queda en ella.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,2h — reloj del hilo, por las marcas de los commits: apertura a las 18:43, última task a las 19:12, arreglos de la revisión y enmienda hasta las 19:31 y cierre hasta ~19:55. La spec y el plan, de ~17:55 a 18:43, van aparte (~0,8h).
- Desviación: −2,8h (−70 %)
- Causa de la desviación: la mitad estimada para la Task 2 («≈50 ficheros, clasificación manual») se hizo por lotes. Primero `grep` con contexto de cada mención; después, una lista de sustituciones literales por fichero, aplicada con un script que falla si un literal no aparece. Los sujetos corrieron en paralelo (10 a la vez en el GREEN). Es el mismo sesgo del aviso del 2026-09-07 de `estimation.md`: estimar en horas secuenciales lo que son lotes y minutos.
- Modelo del hilo: Opus 5.5, effort de la sesión (spec, plan, ejecución Native y cierre)
- Tokens del hilo: 64.154.170 — claude-opus-5-5 64.154.170
- Tokens de subagentes: 9.659.814 en 3 despachos — Review spec lente dominio claude-sonnet-5 344.470 / 2 min; Review spec lente técnica claude-sonnet-5 241.636 / 2 min; Revisión final de rama 0064 claude-opus-5-5 9.073.708 / 6 min
- Coste de la sesión: 24,67 $ (hilo 20,20 $ + subagentes 4,47 $)
- Coste de sujetos: 3,76 $ en 13 sujetos Sonnet — RED `m1` 0,34 $; GREEN (enrutado y `m1`) 2,68 $; `r1` RED 0,36 $ y GREEN 0,37 $
- Review de spec: 2 revisores · hallazgos 11, aceptados 11 (uno en parte)

## 3. Desviaciones del plan

- **Enmienda de la spec a petición del dev-lead** (tras la revisión final): el prefijo de cierre de fila del roadmap pasa a legado, como las carpetas. Añade la capacidad `roadmap` al delta y el escenario `r1`, y sube el techo de la campaña a 17 sujetos y 5 $.
- **Arreglo de la revisión final** fuera de las tasks del plan: `tech-stack.md` (`a9e9211`).

### Decisiones tomadas sin el dev-lead

- En la Task 1, el THEN literal de `task-ids` pasa antes de implementar (en ese escenario manda el patch 0080). El caso que discrimina es el AND `feature-only`, que sí falla, y se conservan los dos. — Coste si está mal: ninguno.
- En la Task 1 también cambian la cabecera `| id | Task |` de `sdd-roadmap/SKILL.md` y `MigrationInitParity.Tests.ps1`, por el contrato de la plantilla. — Coste si está mal: ninguno.
- Los nombres `sdd-start-task`/`sdd-end-task` se sustituyen con `sed`, porque son tokens sin ambigüedad. La palabra «task» suelta se clasifica a mano. — Coste si está mal: ninguno; lo vigilan el test guarda y la revisión final.
- En la Task 2 se conservó `Task` en el prefijo de cierre de fila, como freno de alcance. — Después lo cambió el dev-lead como enmienda.
- La lista blanca del test guarda incluye `MigrationInitParity.Tests.ps1` y `capabilities/migration.md`, que nombran las skills viejas para describir la migración. — Coste si está mal: un nombre viejo en esos dos ficheros no se caza.
- `FeatureRename.Tests.ps1` gana `Clear-GitEnv`/`Restore-GitEnv` después de copiar el RED, porque la convención del repo lo exige a todo test que ejecuta git. — Coste si está mal: ninguno.
- En `tech-stack.md` solo cambia el prompt recomendado. Las otras menciones de las skills viejas citan mediciones hechas con el nombre de entonces. — Coste si está mal: un lector toma una cita histórica por método vivo.
- La primera pasada del RED de `m1` no guardó la salida (`SPEC_DIR` relativo). Se regeneró desde el stream sin relanzar el sujeto. — Coste si está mal: ninguno; `state.txt` lo dice.
- Menores diferidos de la revisión final (van a la deuda del roadmap):
  - `constitution.md`: «justificación escrita en la task».
  - El `id:` de las plantillas no coincide con una carpeta `-task-` heredada.
  - `FeatureRename.Tests.ps1` lee también la ruta vieja de `nombrado.md`.
  - El test guarda no lleva `-Tag 'Slow'`.
  - Falta un `m1` que entre por la skill.
  - El README tiene un comentario desalineado.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester -Path tests` (suite entera, con los `Slow`): 850 verdes, 0 fallos, 8 saltados, tras la enmienda.
- `claude plugin validate --strict .`: «Validation passed».
- `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>`: «Capacidades válidas: 14», tras la fusión.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «vale, test diferiado, feedback, commit y merge» · disparador: la 0074 (`using-sdd`), primera feature que se arranca con el kit de `develop`, a cargo del dev-lead.

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `h1`, `h4`, `p1`, `p2`, `p3` y `p6` (peticiones de trabajo) | ✅ entran por `sdd-start-feature` (6/6) |
| 2 | `p4` (pregunta) y `p5` (bug) | ✅ `sdd-consult` y `sdd-start-patch` |
| 3 | `e1` «Hemos acabado, cierra la tarea» | ✅ `sdd-end-feature` |
| 4 | `m1`, migración de un proyecto en 1.2.0 | ✅ 0 nombres viejos en los docs vivos (el RED dejaba 2) e histórico intacto |
| 5 | `r1`, cierre de una feature que salda una fila | ✅ `**[Feature SALAS-142, …]**` (el RED escribía `Task`) |
| 6 | `Get-NextSddId.ps1` con carpetas `feature`, `task` y `patch` mezcladas | ✅ `0081`, `0080` y aviso de duplicado `0063` |
| 7 | `Build-EstimationLog.ps1` con `feature:`, `task:` y una carpeta `-feature-` sin frontmatter | ✅ ids `0063`, `0079` y `0081`, cabecera `Id` |

Evidencia: [`tests/feature-rename-red.md`](../../../../tests/feature-rename-red.md) y [`tests/feature-rename-green.md`](../../../../tests/feature-rename-green.md).

### 4.3 Residuales / deuda generada

- Renombrar los slugs `task-flow` y `task-ids` de `capabilities/` (decisión 9): el delta no sabe renombrar un fichero.
- Los seis menores diferidos de la revisión final.
- Que la migración revise también `.claude/skills/` y `.claude/commands/` del proyecto consumidor, que pueden nombrar las skills viejas (recomendación de la revisión final).

## 5. Aprendizajes

- Un renombrado de vocabulario con dos sentidos (la unidad del kit y la task del plan) se hace por lotes: `grep` con contexto, una lista de sustituciones literales por fichero y un script que falla si un literal no aparece, con el test guarda como red. Sale en minutos y no mete falsos positivos. → `tech-stack.md`, «Aprendizajes por task».
- `SPEC_DIR` de `tests/headless/run.sh` va en ruta absoluta: el sujeto hace `cd` al molde y una ruta relativa pierde la salida. → `tech-stack.md`, «Aprendizajes por task».
- Un sujeto de cierre completo cuesta ~0,35 $ con un molde que empieza en la rama lista (`r1`), frente a los ~0,85 $ que se estimaron desde la 0018. → `tech-stack.md`, «Aprendizajes por task».
- Revisión de skills de proyecto: este repo no tiene `.claude/skills/` (solo `.claude/hooks/` y `settings.json`), así que no aplica.

## 6. Adendas
