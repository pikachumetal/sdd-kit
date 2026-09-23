---
id: 20260923-190542-task-0016-git-env-cache-warning
task: 0016
title: Walkthrough — Entorno de git limpio en los tests y aviso de skills cargadas de la caché
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Entorno de git limpio en los tests y aviso de skills cargadas de la caché

## 1. Cambios realizados

- **Helper `tests/Clear-GitEnv.ps1`** (`17dd401`): `Clear-GitEnv` borra `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR` y `GIT_OBJECT_DIRECTORY` con `Remove-Item Env:\` y devuelve lo que había; `Restore-GitEnv` lo repone y con `$null` no hace nada. Los cuatro tests que ejecutan git (`Get-NextSddId`, `Invoke-SddMerge`, `Hook`, `PathLength`) lo usan en `BeforeAll`/`AfterAll`; `Invoke-GitIsolated` queda en una línea e `Invoke-SddMerge.Tests.ps1` deja de guardar `GIT_PREFIX` (decisión 4 de la spec).
- **Test de convención `tests/GitEnvConvention.Tests.ps1`** (`17dd401`, `dbdd29b`): todo `tests/*.Tests.ps1` con `git -C` fuera de un comentario dot-sourcea el helper, guarda `Clear-GitEnv` y llama a `Restore-GitEnv`; se excluye a sí mismo y exige encontrar los cuatro ficheros conocidos.
- **Hook `SessionStart` del repo** (`f515759`, `83d689a`, `11ed312`): `.claude/hooks/Test-KitSessionSource.ps1`, registrado en `.claude/settings.json` con `"shell": "bash"` y `pwsh -NoProfile -File "${CLAUDE_PROJECT_DIR}/…"`. Compara `SDD_KIT_SESSION_ROOT` con `CLAUDE_PROJECT_DIR` (o el directorio actual) sin distinguir mayúsculas ni separadores; si no casan, escribe `systemMessage` y `hookSpecificOutput.additionalContext` en JSON ASCII (`EscapeNonAscii`) y sale siempre con 0. Una ruta que `GetFullPath` rechaza cuenta como distinta.
- **Lanzador `Start-KitSession.ps1`** (`f515759`): exporta `SDD_KIT_SESSION_ROOT` antes de `claude` y la restaura en un `finally`; lanza `claude` con `--dangerously-skip-permissions` (enmienda del dev-lead, `4904c57`).
- **Docs**: `architecture.md` (anatomía de `<script>.Tests.ps1` y `.claude/` en el árbol), `tech-stack.md` (regla «Dentro de un hook de git…» y trampa 8), `CLAUDE.md` regla 2 (nombra el hook).
- **Tests**: `tests/Clear-GitEnv.Tests.ps1` (5), `tests/GitEnvConvention.Tests.ps1` (13), `tests/KitSessionSource.Tests.ps1` (13). Sin campaña de sujetos: ninguna skill editada (Art. I proporcional).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 0,7h — reloj del hilo, aproximado con las marcas de los commits (apertura a las 21:29, validación a las 22:10). Spec y plan: ~1h, repartida entre una sesión anterior (borrador de la spec) y esta.
- Desviación: -1,8h (-72%)
- Causa de la desviación: el plan traía el código casi escrito y los tests RED del hilo, así que las dos tasks fueron transcripción; la verificación lenta de la Task 1 corrió en paralelo con la Task 2. La estimación supuso más incertidumbre en el hook de Windows de la que hubo.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 815k en 8 despachos — implementador T1 Sonnet 121k / 3 min; revisor T1 Sonnet 106k / 2 min; implementador T2 con 3 reanudaciones Sonnet 143k / 17 min; revisor T2 Sonnet 92k / 3 min; re-revisión T2 Sonnet 80k / 1 min; revisor final Opus 126k / 3 min; fix final Sonnet 75k / 2 min; re-revisión final Sonnet 71k / 1 min
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Enmienda aprobada**: `--dangerously-skip-permissions` en el lanzador, decidido por el dev-lead al preguntarle qué hacer con su cambio local (`4904c57`).
- **Ronda de fix de la Task 2** (`83d689a`, `11ed312`): guard `try/catch` en `Get-NormalizedPath` y un test de contrato con ruta inválida, añadidos a petición del revisor de task.
- **Ronda de fix de la revisión final** (`dbdd29b`): frase de `CLAUDE.md` movida junto a su referente, `It` que exige guardar `Clear-GitEnv` y variable del test renombrada para no coincidir con la del helper.
- El modo auto no pudo evaluar ninguna llamada a `Edit` al principio de la sesión («no verdict»); el dev-lead pasó la sesión a bypass y se retomó.

### Decisiones tomadas sin el dev-lead

- El test del fix del hook usa `'   '` y no el carácter nulo que pedí primero — Windows trunca el nulo en una variable de entorno y el test pasaba sin el fix — si está mal, el test no fija nada y una regresión pasaría en verde.
- El guard de `GetFullPath` se conserva y su test es de contrato, no de implementación — sin guard el hook ya salía con 0 porque la excepción de .NET termina la sentencia y el script sigue; el guard solo quita la traza por stderr — si está mal, sobra un `try/catch`.
- Autoricé tocar dos tests RED del hilo tras la revisión final (un `It` añadido en `GitEnvConvention` y una variable renombrada en `Clear-GitEnv.Tests`) — los escribí yo y el hallazgo era de cobertura — si está mal, un test del contrato cambió sin su gate.
- Aparcado: en `CLAUDE.md` regla 2 quedan dos frases seguidas con la condición «si no sale del script» — es redundancia de prosa, no error — si está mal, una frase de más.

## 4. Verificación

### 4.1 Builds

- Sin build (repo de markdown y scripts PowerShell).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-23 · «los 3 pasos que me pides funciona»: `claude` a secas en el worktree muestra el aviso, `./Start-KitSession.ps1` arranca sin aviso, y tras salir `$env:SDD_KIT_SESSION_ROOT` queda vacía.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Suite completa con `Slow` (`Invoke-Pester -Path tests`), verificado por el agente | 449 passed, 0 failed, 6 skipped |
| 2 | Verificación lenta de la Task 1 (`Get-NextSddId`, `Invoke-SddMerge`), verificado por el agente | 40/40 |
| 3 | Hook con el comando literal de `settings.json` vía bash, sin variable, verificado por el agente | JSON ASCII con el aviso, exit 0 |
| 4 | Hook con la variable igual al proyecto, verificado por el agente | sin salida, exit 0 |
| 5 | Siete commits de la rama pasando por el pre-commit, verificado por el agente | índice sin entradas ajenas; `git status` solo con los artefactos del cierre |
| 6 | Sesión real sin script / con script / variable al salir, reportado por el dev-lead | aviso / sin aviso / vacía |

### 4.3 Residuales / deuda generada

- Lo recortado de la fila 0016 (renombrados de ficheros en castellano, barrido de reglas en `references/`, ruta con tildes para los scripts, formato de cierre de filas ya cerradas) sigue descrito en la fila 0016 del roadmap y se replanifica con fila propia al abrir la versión siguiente, como decidió el corte del 2026-09-23.

## 5. Aprendizajes

- En modo auto, el clasificador del servidor puede devolver «no verdict» en todas las llamadas a `Edit` y el harness lo trata como fallo permanente; las lecturas siguen funcionando. Salida: cambiar el modo de permisos, no esquivarlo por shell → `tech-stack.md` (trampa 10).
- Un carácter nulo no sobrevive a una variable de entorno de Windows, `[IO.Path]::GetFullPath` de .NET moderno no rechaza `|`, y una excepción de un método .NET en PowerShell termina la sentencia pero el script sigue: para probar una ruta que lanza, solo espacios → `tech-stack.md` (trampa 11).
- Revisión de skills: el repo no tiene `.claude/skills/`, y ninguna skill del kit afirma algo que esta task desmienta; las que tocan el encargo y los commits son de la 0044 → no aplica.
- El helper de entorno de git y el hook de origen de las skills → ya documentados por las tasks en `architecture.md`, `tech-stack.md` y `CLAUDE.md`.

## 6. Adendas
