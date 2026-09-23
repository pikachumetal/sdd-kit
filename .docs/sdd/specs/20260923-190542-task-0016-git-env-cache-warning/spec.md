---
id: 20260923-190542-task-0016-git-env-cache-warning
task: 0016
title: Entorno de git limpio en los tests y aviso de skills cargadas de la caché
mode: full
status: approved
created: 2026-09-23
author: Claude (Opus 5.5), por encargo del dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-23
---

# Spec — Entorno de git limpio en los tests y aviso de skills cargadas de la caché

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: 0 (sin capacidad nueva, sin contrato público, sin MODIFIED/REMOVED, sin datos, sin dependencia externa; he leído los tests, el pre-commit, Start-KitSession.ps1 y .claude/settings.json)
- Mínimo razonable: ninguna — deja sin mirar el formato de salida del hook SessionStart, que se comprueba en el smoke con una sesión real
```

1. **Sin campaña de sujetos (Art. I proporcional)** — ninguna de las dos piezas edita una skill: la evidencia es su test Pester. Previsión de campaña: 0 sujetos, 0 $.
2. **Sin delta en `capabilities/`** — las dos piezas son herramientas de este repo, no conducta que el kit lleva a los proyectos. Los escenarios de abajo son el contrato de los tests, no una capacidad.
3. **El helper expone dos funciones, `Clear-GitEnv` y `Restore-GitEnv`**, como `Resolve-Bash.ps1` expone la suya: `$script:SavedGitEnv = Clear-GitEnv` en `BeforeAll`, `Restore-GitEnv $script:SavedGitEnv` en `AfterAll`. Dot-sourcear el fichero no borra nada por sí solo: así un `.` accidental no cambia el entorno.
4. **Las cinco variables del enunciado, no seis** — `Invoke-SddMerge.Tests.ps1` borra además `GIT_PREFIX`; al migrarlo al helper deja de hacerlo. Git la exporta a hooks y alias pero ningún comando la lee para elegir repositorio o índice.
5. **«Test que ejecuta git» = fichero `tests/*.Tests.ps1` con `git -C` fuera de un comentario**. `tech-stack.md` ya obliga a `git -C` siempre en los tests, así que es un predicado observable. Un test estructural nuevo lo vigila: todo fichero así dot-sourcea `Clear-GitEnv.ps1` y llama a `Restore-GitEnv`. Hoy son cuatro: `Get-NextSddId`, `Invoke-SddMerge`, `Hook` y `PathLength`. El propio test de convención queda fuera del recorrido: su patrón contiene el texto que busca y se señalaría a sí mismo.
6. **`PathLength` y `Hook` también usan el helper**, aunque solo lean el repo propio. Consecuencia: dentro del pre-commit, `git ls-files` lee `.git/index` y no el índice temporal del commit. Los ficheros nuevos ya están en `.git/index` tras el `git add`, así que la comprobación de rutas no pierde nada.
7. **`Invoke-GitIsolated` de `Get-NextSddId.Tests.ps1` deja de guardar y restaurar por llamada**: lo hace el helper una vez por fichero. El `It` que pone `GIT_DIR` a propósito sigue borrándolo al acabar.
8. **Los scripts del kit (`Get-NextSddId.ps1`, `Invoke-SddMerge.ps1`) no se tocan**: tienen su propia lista y viajan a los proyectos sin `tests/`. La 0044 comparte fase; no entro en sus ficheros.
9. **Cómo sabe el hook de dónde vienen las skills**: `Start-KitSession.ps1` exporta `SDD_KIT_SESSION_ROOT` con su propia carpeta antes de lanzar `claude`; el hook la hereda y la compara con la carpeta del proyecto de la sesión (`CLAUDE_PROJECT_DIR`; si falta, el directorio actual). Sin variable, o con otra carpeta (otro worktree, otra rama), avisa. Descarté leer la línea de comandos del proceso padre: frágil y distinta en cada shell.
10. **Falso positivo aceptado**: una sesión lanzada a mano con `claude --plugin-dir .` carga la rama y aun así recibe el aviso. El texto lo dice («si no lanzaste con `Start-KitSession.ps1`…»).
11. **El aviso va a los dos**: `systemMessage` para el dev-lead (que relance) y `additionalContext` para el agente (que aplique la regla 2 del `CLAUDE.md`: contrastar con `skills/<nombre>/SKILL.md` antes de ejecutar un paso). El hook sale siempre con código 0: avisa, no bloquea.
12. **Hook en PowerShell** (`.claude/hooks/Test-KitSessionSource.ps1`), registrado en `.claude/settings.json` con `pwsh -NoProfile -File`. El código ejecutable del kit es PowerShell y el equipo trabaja en Windows; no es el hook del plugin (`hooks/session-start`, bash), que sigue igual.
13. **Repaso de coherencia (2026-09-23)**: contrasté el borrador con el código y lo corregí en tres puntos. El test de convención se excluye a sí mismo (decisión 5). El hook usa el directorio actual si falta `CLAUDE_PROJECT_DIR` (decisión 9). El JSON del aviso lleva el `hookEventName` que Claude Code exige en `hookSpecificOutput`.
14. **Docs**: `architecture.md` (anatomía de `<script>.Tests.ps1`), `tech-stack.md` (la regla «Dentro de un hook de git…» y la trampa (8) nombran el helper) y la regla 2 del `CLAUDE.md` (nombra el hook). Ninguno es de la 0044.

## Intent

Dentro del pre-commit, git exporta `GIT_INDEX_FILE` y compañía; una fixture Pester las heredó y escribió en el índice del worktree real (ticket 0042 §1). Hoy cada test que ejecuta git se protege a su manera, con listas distintas, y el test nuevo que no lo haga repite el accidente. Por otro lado, once reportes de sesiones que cargaron las skills de la caché y no de la rama: `Start-KitSession.ps1` es voluntario y nada avisa. Se quiere un helper único y vigilado para lo primero y un aviso al arrancar la sesión para lo segundo.

## Scope

- Entra: `tests/Clear-GitEnv.ps1` y su test; migrar los cuatro tests que ejecutan git; test estructural que lo exige; hook `SessionStart` del repo, su script y su test; `Start-KitSession.ps1` exporta la variable; docs (`architecture.md`, `tech-stack.md`, `CLAUDE.md`).
- No entra: renombrados de ficheros en castellano, barrido de reglas en `references/`, el resto de la fila 0016 (versión siguiente); slugs de `specs/` (histórico sellado); los scripts de `skills/sdd-templates/scripts/`; el hook del plugin (`hooks/`); ninguna skill, ni `sdd-start-task`, `sdd-end-task`, `sdd-end-patch`, `plan-template` u `overrides-superpowers` (0044).

## Approach

Helper con dos funciones, al estilo de `Resolve-Bash.ps1`, y un test de convención que recorre `tests/*.Tests.ps1` y exige el helper allí donde hay `git -C`. Para el aviso, una señal explícita que deja el lanzador (`SDD_KIT_SESSION_ROOT`) y un hook del proyecto que la comprueba contra `CLAUDE_PROJECT_DIR`; el hook se prueba llamándolo en proceso con el entorno preparado y se comprueba una vez en una sesión real.

## Delta de comportamiento

Sin capacidad tocada (decisión 2). Escenarios, contrato de los tests:

### Helper `Clear-GitEnv.ps1`

**Borra las variables de git**
- GIVEN `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR` y `GIT_OBJECT_DIRECTORY` con valor en el proceso
- WHEN se llama a `Clear-GitEnv`
- THEN ninguna de las cinco existe (`Test-Path Env:\<nombre>` es falso), no solo vacía

**Restaura lo que había**
- GIVEN el valor que devolvió `Clear-GitEnv`, con unas variables que existían y otras que no
- WHEN se llama a `Restore-GitEnv` con él
- THEN las que existían recuperan su valor exacto
- AND las que no existían siguen sin existir

**Todo test que ejecuta git lo usa**
- GIVEN un fichero `tests/*.Tests.ps1` con `git -C` fuera de un comentario
- WHEN corre el conjunto rápido de la suite
- THEN el test de convención falla si el fichero no dot-sourcea `Clear-GitEnv.ps1` o no llama a `Restore-GitEnv`, y nombra el fichero

**La fixture no toca el índice heredado** (ya cubierto por `Invoke-SddMerge.Tests.ps1`, «ignora el GIT_INDEX_FILE que hereda de un hook»; sigue en verde tras la migración)

### Hook `SessionStart` del repo

**Sesión lanzada con el script: silencio**
- GIVEN `SDD_KIT_SESSION_ROOT` igual a la carpeta del proyecto de la sesión (sin distinguir mayúsculas ni separadores)
- WHEN se ejecuta el hook
- THEN no escribe nada y sale con 0

**Sesión sin el script: aviso**
- GIVEN `SDD_KIT_SESSION_ROOT` ausente
- WHEN se ejecuta el hook
- THEN escribe un JSON con `systemMessage` que nombra `Start-KitSession.ps1` y `hookSpecificOutput` (`hookEventName: SessionStart`) cuyo `additionalContext` dice que las skills `sdd-kit:*` vienen de la caché y que antes de ejecutar un paso se contrasta con `skills/<nombre>/SKILL.md` de la rama
- AND sale con 0

**Sesión lanzada desde otro worktree: aviso**
- GIVEN `SDD_KIT_SESSION_ROOT` apunta a una carpeta distinta de la del proyecto
- WHEN se ejecuta el hook
- THEN escribe el mismo aviso, nombrando las dos carpetas

**El lanzador deja la señal**
- GIVEN `Start-KitSession.ps1`
- THEN exporta `SDD_KIT_SESSION_ROOT` con su carpeta antes de invocar `claude`

**El hook está registrado**
- GIVEN `.claude/settings.json`
- THEN tiene un hook `SessionStart` que ejecuta `.claude/hooks/Test-KitSessionSource.ps1` con `pwsh`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-23 | aprobada («si, apruebo») |
