---
id: 20260909-065145-task-0000-estimation-log-script
task: 0000
title: Walkthrough — Build-EstimationLog.ps1 genérico distribuido con el kit (T7)
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-09
---

# Walkthrough — `Build-EstimationLog.ps1` genérico distribuido con el kit (T7)

## 1. Cambios realizados

- **Script** `skills/sdd-templates/scripts/Build-EstimationLog.ps1` (195 líneas): unifica las copias de Alybo y MDT; `-Root` / `-OutFile`; resuelve `.docs/sdd` o `docs/sdd`; lee `walkthrough.md`, `patch.md` y `hotfix.md` acotando la extracción a la sección de tiempo; tolera negrita, `~`, coma decimal, unidad con espacio y rangos; `Tipo` normalizado; tasks sin plan con estimado `—`; warning si el esfuerzo real no se lee; warning si va a sobreescribir un log mantenido a mano; fecha `—` para carpetas fuera de convención; factor global y mediana por Tipo; salida LF, UTF-8 sin BOM. Commits `809a8da`, `dea8273`, `c17b973`, `976a549` (implementador Sonnet, tres rondas de revisión).
- **Tests Pester** `tests/Build-EstimationLog.Tests.ps1` (26 tests) con 15 fixtures versionadas en `tests/fixtures/estimation-log/` que reproducen líneas reales del kit y de Alybo. Primer código ejecutable del kit.
- **Skills de cierre**: `sdd-end-task/references/estimacion.md` paso 3 y `sdd-end-patch/SKILL.md` paso 5 ejecutan el script del kit por `<Base directory>/../sdd-templates/scripts/`; fila a mano solo sin `pwsh` o sin el script (instalación parcial). RED `a980518` (`tests/estimation-log-red.md`), GREEN `74b4eae` (`tests/estimation-log-green.md`), fallback `1034388`.
- **Docs de anclaje** `cdad2bc`: `sdd-templates/SKILL.md` (sección Scripts), README (11 plantillas + script), `tech-stack.md`, `architecture.md`.
- **Roadmap**: T10 (migración de consumidores) y T11 (gates y reviews proporcionales) nacidas en el brainstorming y el plan de esta task; `17f55bf`.
- **Cierre** (este commit): `funcional/estimacion.md` fusionado desde el delta, Art. X de calidad de código en la constitution, `estimation-log.md` del kit regenerado por el script, changelog, roadmap.

## 2. Tiempo: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1 h (rango 0,7–1,5)
- Esfuerzo real: **~1,1 h** (aproximado: plan aprobado 07:17 UTC, re-revisión final limpia ~08:20 UTC; incluye 2 rondas de revisión de task y 1 de rama, RED y GREEN en paralelo). Spec + plan: ~0,45 h (carpeta 06:51 UTC → commit 07:17 UTC).
- Desviación: +0,1 h (+10 %)
- Causa de la desviación: no obligatoria (< 30 %). Lo que sí se movió: el código del plan se transcribió en ~7 min, pero la revisión final de rama (Opus) encontró tres defectos de robustez que las dos revisiones de task (Sonnet) no vieron, y la ronda de arreglos costó ~25 min.

## 3. Desviaciones del plan

- **Task 2 por `Agent` ×2 en vez de `Workflow`**: mismo aislamiento y modelo, menos ceremonia, y permite la pregunta a posteriori con `SendMessage`. Ruling anotado en el ledger.
- **Effort no declarable**: el tool `Agent` acepta modelo pero no effort. Se declaró Sonnet y el effort quedó en el defecto del harness; el plan pedía Sonnet/medium. Registrado en `tasks.md`.
- **El plan decía 14 filas en el smoke del kit**: son 13 (la carpeta de esta task no tenía walkthrough). Tras el cierre, 14.
- **Gate de sección en `patch.md`**: el brief no gateaba; la revisión de task lo pidió literal (`Tiempo (ligero)`); el smoke de Alybo destapó un patch real titulado `## 5. Tiempo` y el gate pasó a «cualquier encabezado que empiece por Tiempo» con `\b`. Dos rulings.
- **Rama**: se trabajó en `master` sin worktree, como todas las tasks del kit (sin `environments.md`, sin remoto). `finishing-a-development-branch` no tiene nada que fusionar.
- **Alcance añadido por la revisión final**: guardas de fecha, extracción acotada a sección, aviso ante log manual, rutas absolutas, dos tests más, fallthrough walkthrough→patch, y purga de comentarios que repetían el código (instrucción del dev-lead durante la ronda).

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Tests Passed: 26, Failed: 0** (verificado por el agente en el cierre, 08:25 UTC).

### 4.2 Smoke / tests

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Escenario «El estimation-log se genera desde los artefactos de cierre»: script sobre `D:\code\git\sdd-kit` | ✅ verificado: 14 filas tras este walkthrough, 0 warnings, cabecera AUTO-GENERADO; `.docs/sdd/estimation-log.md` del kit regenerado por el script (dogfooding, decisión 6) |
| 2 | Escenario «El script vive en el kit y las skills de cierre lo invocan» | ✅ verificado: GREEN 2/2 en fixture Ledgerly-est (`tests/estimation-log-green.md`); ejecutado además en este cierre |
| 3 | Escenario «El parseo tolera el formato real»: fixtures `fancy`, `sinplan`, `legacy`, `docs/sdd`, `sinligero`, rangos y negrita del propio kit | ✅ verificado: tests Pester + los 12 walkthroughs históricos del kit parsean sin warning |
| 4 | Escenario «Factor global y por Tipo» | ✅ verificado: kit → factor 0.33 (10 artefactos con ratio, todos `docs`); Alybo → 0.59 sobre 64, tabla por Tipo con 5 tipos |
| 5 | Escenario «Bloque presente sin esfuerzo real avisa» | ✅ verificado: fixture `roto` (test) y el patch `null-date` de la fixture del RED (`WARNING: … Fila excluida.`) |
| 6 | Smoke sobre Alybo con `-OutFile` temporal | ✅ verificado: 70 filas, 0 warnings; el log committed de Alybo tenía 62 (hotfix con `Estimación: —` que su script descartaba, un patch titulado `## 5. Tiempo`, y artefactos posteriores). No se escribió su log |
| 7 | Canal `npx skills add --skill sdd-templates` instala el `.ps1` | ✅ verificado en directorio temporal (`.claude/skills/sdd-templates/scripts/Build-EstimationLog.ps1`) |
| 8 | Aviso al sobreescribir un log mantenido a mano | ✅ verificado por test; en este cierre el log manual del kit disparó el aviso una vez (esperado) |

### 4.3 Residuales / deuda generada

- **Parked en la revisión final** (reales, sin dependientes): la rama «truncar antes del siguiente encabezado» de `Get-TimeSection` no tiene fixture propia (verificada a mano por el revisor); el singular «1 artefacto» no se asserta; el `try/catch` de `Resolve-Path` uniformiza cualquier excepción en «No se encuentra…». → fila de deuda en el roadmap.
- **No medido**: el aviso ante copia antigua en `.tools/sdd/` y la cláusula de fallback por instalación parcial (anotados en el GREEN).
- **T10**: Alybo y MDT deben borrar su `Build-EstimationLog.ps1` local; `sdd-init-greenfield` sigue creando `estimation-log.md` vacío a mano (nota de alcance de la revisión final).
- **T11(c)** ampliado: el artículo de calidad de código viaja al implementador y al revisor.

## 5. Aprendizajes

- **La revisión final de rama con un modelo superior encuentra lo que dos revisiones de task no ven**: las tres revisiones Sonnet aprobaron un `Substring(0, 8)` sin guardar y una extracción a nivel de documento; Opus las reprodujo con carpetas reales. La revisión de rama no es redundante con la de task. → `tech-stack.md` (§Tests).
- **Una restricción de estilo mal formulada produce slop**: «comentarios en castellano con tildes» en las Restricciones globales empujó al implementador a comentar el *qué*. La regla correcta es «sin comentarios que repitan el código; solo el porqué no deducible». → `constitution.md` Art. X (nuevo) y T11(c).
- **El gate literal de una plantilla falla contra artefactos reales**: `Tiempo (ligero)` excluía en silencio un patch de Alybo titulado `## 5. Tiempo`. El smoke sobre un repo real es parte del test, no un extra. → `tech-stack.md` (§Tests).
- **Las fixtures acumuladas cruzan umbrales**: tres rondas llevaron el conjunto de calibración a n=10 exacto y apagaron el aviso «< 10» que un test asumía. Los tests de umbral necesitan fixtures a ambos lados. → `tech-stack.md` (§Tests).
- **`Agent` no expone effort**: Art. IV exige modelo y effort; con el tool `Agent` solo se declara el modelo. Se anota en `tasks.md` como desviación de forma. → `tech-stack.md`.
- **Un reinicio de sesión mata a los subagentes en curso**: la re-revisión final se perdió con el reinicio y hubo que reanudarla con `SendMessage`; el ledger permitió retomar sin repetir nada. → `tech-stack.md`.
- **El log generado sustituye al manual sin perder nada**: los rangos y notas viven en el walkthrough; el log es tabla de calibración. → `estimation.md`.
