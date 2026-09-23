---
id: 20260923-145338-task-0042-merge-script
task: 0042
title: Plan de implementación — La receta de merge del cierre como script con cerrojo
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — La receta de merge del cierre como script con cerrojo

## Decisiones que he tomado yo — valida estas

1. **Task 1 va por agente**: Sonnet 5 con effort high. Los tests Pester los escribe y commitea el hilo antes del despacho. El revisor de la task es Sonnet 5 con effort medium. El implementador trabaja desde prosa, y la concurrencia y la limpieza en `finally` son fáciles de dejar a medias.
2. **Task 2 va en línea**. El RED, la guidance dirigida a sus fallos y el GREEN son el ciclo del Art. I, y quien ve los fallos del RED escribe la guidance. Los sujetos son Sonnet headless (`claude -p --model sonnet`), 2 por campaña y en paralelo. El lanzador se adapta del RED de la 0009 (`subject.sh`, `tools.mjs`).
3. **Revisor final de rama**: Sonnet 5 con effort medium, que recibe el bloque «De código».
4. **Sin plan gate** (perfil `delegate`): la cobertura escenario → task queda en §4.
5. **Coste estimado**: unas 4 h de reloj. En tokens, unos 150k del implementador, 100k del revisor de task y 130k del revisor final. Los sujetos cuestan de 0,6 a 0,9 $ cada uno: 4 sujetos, unos 3 $, que puede subir a 6 $ si hay que repetir una tanda.
6. **Riesgo alto: el test de dos procesos puede ser frágil por el reloj.** Por eso el primer proceso retiene el cerrojo con `-VerifyCommand "Start-Sleep -Seconds 6"`, y el segundo solo arranca cuando existe el fichero de cerrojo. Nada se decide por tiempos cortos.

**Goal**: `Invoke-SddMerge.ps1` ejecuta la receta del merge del cierre con cerrojo, base integrada, push de la rama destino y limpieza si falla, y la receta de `sdd-end-task` pasa a invocarlo.

**Architecture**: un script PowerShell en `skills/sdd-templates/scripts/`, que el kit ejecuta y que no se copia al proyecto, igual que sus dos vecinos. La secuencia va dentro de un `try/finally` que retira el worktree temporal y suelta el cerrojo siempre. La receta de `merge-recipe.md` queda reducida a la invocación y a qué hacer si el script falla.

**Tech Stack**: PowerShell 7+, git ≥ 2.38 (`worktree`, `merge`, `--git-common-dir`), Pester 5.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.
- Toda lectura de la salida de git fija `[System.Console]::OutputEncoding` en UTF-8 y la restaura, como `Invoke-GitUtf8` en `Get-NextSddId.ps1`: las rutas con tildes llegan mal decodificadas si no.
- Antes de invocar git, el script quita del entorno `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR` y `GIT_OBJECT_DIRECTORY`, como `Invoke-IsolatedGit` en `Get-NextSddId.ps1`. Dentro de un hook, git las exporta, y heredadas apuntan al repo que se está commiteando y no al que se fusiona.
- Rutas con `-LiteralPath` siempre; nunca `rm -rf` ni `Remove-Item -Recurse` sobre un worktree: se retira con `git worktree remove`.
- Nunca `--no-verify`, nunca `git stash`, nunca `push` de `HEAD:<destino>`.
- Ficheros con LF y sin BOM, como el resto de `scripts/`.

### De proceso

- Política de modelos: la de `subagent-driven-development`; modelo **y** effort explícitos en cada despacho; gama media como suelo para implementadores desde prosa y revisores; `fable` y `opus xhigh` prohibidos.
- Ejecución por defecto: `subagent-driven-development`; la Task 2 va en línea (decisión 2).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Máximo 3 agentes a la vez (`control.maxParallelAgents`).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y una receta más corta. Sin clave nueva en `sdd-kit.json` (decisión 1 de la spec).
- [x] **YAGNI gate**: sin abstracciones; el cerrojo es un fichero, no una librería.
- [x] **Brownfield gate**: la receta conserva «Cuándo» y «Merge denegado por el entorno»; `merge.removeWorktree` no cambia.
- [x] **Constitution check**: Art. I (Task 2 con RED→GREEN), Art. III (mensajes en castellano), Art. VI, Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/Invoke-SddMerge.ps1` — el script.
- `tests/Invoke-SddMerge.Tests.ps1` — Pester, escrito por el hilo.
- `tests/merge-script-red.md`, `tests/merge-script-green.md` — evidencia del Art. I.
- `.docs/sdd/specs/20260923-145338-task-0042-merge-script/red/`, `green/` — molde, lanzador y salida de los sujetos.

**Modificar**:

- `skills/sdd-end-task/references/merge-recipe.md` — la receta pasa a ser la invocación.
- `skills/sdd-end-task/SKILL.md` paso 10 y `skills/sdd-end-patch/SKILL.md` paso 6 — nombran el script en lugar del worktree a mano.
- `skills/sdd-templates/SKILL.md` — fila de `Invoke-SddMerge.ps1` en la tabla de scripts.

**NO se tocan**:

- `.githooks/*` — la suite ya corre en `pre-merge-commit`.
- `skills/sdd-start-task/references/control-profiles.md` — la fila «push: persona» sigue igual (decisión 1).
- `capabilities/control-profiles.md` — la escribe el cierre al fusionar el delta.

### 1.6 Dependencias

`Build-EstimationLog.ps1`, en la misma carpeta, para el conflicto del log. Git y pwsh, que ya son requisito del kit.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Test de concurrencia frágil | media | medio | espera por fichero de cerrojo, no por tiempo (decisión 6) |
| Hooks globales de la máquina en los repos del test | media | medio | `core.hooksPath` apuntando a una carpeta vacía en la fixture |
| `reset --hard` sobre un worktree ajeno | baja | alto | solo en el temporal o en el de destino comprobado limpio bajo el cerrojo |

### 1.8 Rollout

Directo: la siguiente release del kit (minor, comportamiento nuevo en el cierre).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `Invoke-SddMerge.ps1`

**Modelo**: Sonnet 5, effort high
**Tests RED**: hilo principal · `tests/Invoke-SddMerge.Tests.ps1`, commiteado antes del despacho
**Superficies**: tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Invoke-SddMerge.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: `skills/sdd-templates/scripts/Build-EstimationLog.ps1 -Root <worktree>` (escribe `<root>/.docs/sdd/estimation-log.md`; lanza si no hay `specs/`). `.docs/sdd/sdd-kit.json` del `-ProjectRoot`: `{"merge": {"into": "develop", "noFf": true, "removeWorktree": false}}`.
- Produce: `pwsh -NoProfile -File Invoke-SddMerge.ps1 [-ProjectRoot <ruta>] [-Branch <rama>] [-Push] [-VerifyCommand <string>] [-LockTimeoutMinutes <double>]`. Sale con 0 si ha fusionado y con un código distinto de 0 si ha fallado; en ese caso el mensaje empieza por el paso (`cerrojo`, `base`, `merge`, `verificación`, `push`, `destino sacado`, `política`). Imprime `Esperando el cerrojo de merge: lo tiene <rama> (<worktree>, PID <pid>) desde <hora>.` al empezar a esperar y cuando cambia el dueño. Si toma un cerrojo huérfano, imprime un aviso que contiene `huérfano`. El commit se titula `merge: <rama> en <destino>`. El cerrojo es `<git-common-dir>/sdd-merge.lock` y contiene un JSON `{branch, worktree, pid, host, since}`.

**Ficheros**: crear `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`

- [ ] **Step 1: Implementación**. Secuencia, cada paso en su función de 20 líneas como mucho:
  1. Resolver la política: si falta `merge.into` o `merge.noFf` en `sdd-kit.json`, falla con `política: …`. La rama sale de `-Branch` o, si no se pasa, de `git branch --show-current` en `-ProjectRoot`. El directorio común sale de `git rev-parse --git-common-dir`, resuelto contra `-ProjectRoot` si es relativo. La carpeta de worktrees es la carpeta padre de `git rev-parse --show-toplevel`.
  2. Cerrojo: `[System.IO.FileStream]::new($path, 'CreateNew', 'ReadWrite', 'Read, Delete')`, con el JSON del dueño escrito y `Flush()`. El stream queda abierto hasta el `finally`. Si la creación falla con `IOException`, leer el dueño con un stream de `FileShare` `ReadWrite, Delete`, que puede fallar si el fichero desaparece mientras tanto: en ese caso, reintentar. Si `host` es esta máquina y `Get-Process -Id pid` no existe, borrar el fichero, avisar con `huérfano` y reintentar. Si no, esperar 2 s, imprimir el mensaje de espera cuando cambia el dueño y rendirse a los `-LockTimeoutMinutes` (30 por defecto) con `cerrojo: … lo tiene <rama> …`. Al soltarlo: `Dispose()` y `Remove-Item -LiteralPath`.
  3. Destino: `git worktree list --porcelain`. Si un worktree tiene `branch refs/heads/<into>` y `git -C <él> status --porcelain` no está vacío, falla con `destino sacado: …` más la lista de ficheros. Si está limpio, se usa ese worktree y no se retira. Si ningún worktree lo tiene, `git worktree add <carpeta>/merge-<último segmento de la rama> <into>`, y si esa ruta ya existe, falla sin tocarla.
  4. Base: remoto = `git config branch.<into>.remote`; si está vacío, `origin` si `git remote` lo lista; si no hay, se salta el paso. `git fetch <remoto> +refs/heads/<into>:refs/remotes/<remoto>/<into>`. Si `<remoto>/<into>` no es ancestro de `HEAD`: `git merge --ff-only`, y si falla, `git merge --no-edit <remoto>/<into>` con la resolución de conflictos del paso 5.
  5. Merge: guardar `$before = git rev-parse HEAD` y ejecutar `git merge [--no-ff] -m "merge: <rama> en <into>" -m "Fusión hecha con Invoke-SddMerge.ps1 (sdd-kit)." <rama>`. Si hay conflicto (`git diff --name-only --diff-filter=U`) y el único fichero termina en `sdd/estimation-log.md`, ejecutar `Build-EstimationLog.ps1 -Root <worktree del merge>`, `git add` y `git commit --no-edit`. Con cualquier otro conflicto, `git merge --abort` y fallar con `merge: conflicto en <ficheros>`.
  6. Verificación: si hay `-VerifyCommand`, `pwsh -NoProfile -Command <cmd>` con el worktree del merge como directorio. Si el código de salida no es 0, falla con `verificación: …`.
  7. Push: con `-Push` y remoto, `git push <remoto> refs/heads/<into>:refs/heads/<into>`. Si falla, falla con `push: …`.
  8. Si algo falla desde el paso 5: `git merge --abort` si hay un merge a medias y `git reset --hard $before` en el worktree del merge. Después relanzar.
  9. `finally`: si el worktree es temporal, `git worktree remove <ruta>`, añadiendo `--force` solo si el primero falla tras el reset. Después, soltar el cerrojo.
  10. Si todo sale bien, imprimir `Fusionado <rama> en <into>: <hash corto>` y, si hubo push, `publicado en <remoto>`.
- [ ] **Step 2: Build** — `pwsh -NoProfile -Command "[System.Management.Automation.Language.Parser]::ParseFile('skills/sdd-templates/scripts/Invoke-SddMerge.ps1', [ref]$null, [ref]$null) | Out-Null"`. Esperado: sin errores de análisis.
- [ ] **Step 3: Verificación** — el comando de «Verificación». Esperado: todos los tests en verde.
- [ ] **Step 4: Commit** — `feat(sdd-templates): Invoke-SddMerge.ps1 fusiona con cerrojo, base integrada y push de la rama destino`, con un cuerpo que cite la task 0042.

### Task 2 — La receta invoca el script (RED→GREEN)

**Modelo**: hilo principal. Sujetos: Sonnet headless.
**Ejecución**: en línea. La guidance la escribe quien ha visto los fallos del RED (Art. I).
**Tests RED**: campaña de sujetos, `tests/merge-script-red.md`
**Superficies**: docs (skills)
**Verificación**: GREEN 2/2 en las medidas del RED, más el control de «Merge denegado por el entorno»; `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Skills.Tests.ps1,tests/PathLength.Tests.ps1 -Output Minimal"`

**Interfaces**:
- Consume: la línea de invocación de la Task 1.
- Produce: `merge-recipe.md` con la invocación `pwsh -NoProfile -File "<Base directory de la skill de cierre>/../sdd-templates/scripts/Invoke-SddMerge.ps1" -ProjectRoot "<worktree de la feature>" [-Push] [-VerifyCommand "<suite>"]`.

**Ficheros**: `merge-recipe.md`, `sdd-end-task/SKILL.md`, `sdd-end-patch/SKILL.md`, `sdd-templates/SKILL.md`, `tests/merge-script-{red,green}.md`, `red/` y `green/` de la spec.

- [ ] **Step 1: Molde y lanzador** — copiar `run.sh`, `subject.sh` y `tools.mjs` del RED de la 0009. Cambios: un remoto bare `remote.git` como `origin` del repo bare; tras sacar los worktrees, un clon empuja a `develop` del remoto un commit ajeno; el `fetch` del repo bare no se hace, así que `origin/develop` queda atrás. La petición: task validada, pasos 0 a 9 hechos, y el dev-lead ha dicho «fusiónalo a develop y súbelo a origin». El estado final registra `develop` local, `develop` del remoto y si son iguales.
- [ ] **Step 2: RED** — 2 sujetos con el kit en `develop`. Medir: `fetch` antes del merge, push de `develop` o de `HEAD:develop`, `develop` local igual a la remota, worktree temporal retirado. Escribir `tests/merge-script-red.md`. Si el RED no reproduce ningún fallo, parar: sin fallo no hay guidance (Art. I). Es un desvío y se pregunta al dev-lead.
- [ ] **Step 3: Guidance** — reescribir `merge-recipe.md` y las líneas del paso 10, el paso 6 y la tabla de scripts, dirigidas a los fallos del RED.
- [ ] **Step 4: GREEN** — 2 sujetos con el kit de la rama, más 1 sujeto de control en el escenario de merge denegado (hook `deny-merge.js` de la 0009, adaptado para casar `Invoke-SddMerge`). Escribir `tests/merge-script-green.md`.
- [ ] **Step 5: Commit** — `feat(sdd-end-task): el merge del cierre se hace con Invoke-SddMerge.ps1`, con un cuerpo que cite la task 0042.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 3h (rango 2–4h). Task 1: 1,5h, contando los tests escritos por el hilo. Task 2: 1,5h, condicionada al RED: si no reproduce, la guidance se recorta.
- Base de la estimación: 2 tasks; la concurrencia es lo incierto; campañas de sujetos al estilo de la 0009 (≈ 10 min de redacción por fichero de evidencia).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Minimal"` (lo repite el hook de pre-commit)
- [ ] Smoke real: `Invoke-SddMerge.ps1 -ProjectRoot <fixture con tildes>` con dos procesos a la vez, a mano, fuera de Pester
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama con `sdd-end-task`, y el merge de esta task con el propio script

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «El merge del cierre espera su turno» → Task 1 (tests: dos procesos, timeout, cerrojo huérfano). ✓
- ADDED «El merge del cierre parte de la rama destino publicada» → Task 1 (tests: remoto avanzado, conflicto del log, otro conflicto); Task 2 (la receta la hace cumplir). ✓
- ADDED «El push del cierre publica la rama destino» → Task 1 (tests: `-Push` y sin `-Push`); Task 2 (medida `HEAD:develop`). ✓
- ADDED «Un merge del cierre que falla deja la rama destino como estaba» → Task 1 (tests: verificación en rojo, push rechazado, conflicto ajeno). ✓
- Decisiones 7 y 8 de la spec (destino sacado, interfaz, nombre `merge-<id>`) → Task 1 (tests: destino sucio, destino limpio, sin política, ruta del temporal). ✓
- Delta en `capabilities/` → cierre (`sdd-end-task`), no task. ✓
