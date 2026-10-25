---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261025-151935-patch-0169-git-hooks-warning
task: 0169
mode:
date: 2026-10-25
---

# Ticket para el kit — patch 0169: un test Pester con `git init` reinicializó el repo del kit como bare desde el pre-commit

## Contexto

- Carril y modo: patch (petición cerrada del dev-lead), perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback` (todas leídas con `Read` del working tree: la sesión no salió de `Start-KitSession.ps1`)
- Proyecto: el propio kit (skills en Markdown, tests Pester, CLI en Node)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,42 h frente a 0,5 h estimadas
- Coste en tokens: 4.737.011 del hilo, 2,33 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un `git init` en un test Pester, lanzado desde el pre-commit, dejó `core.bare = true` en el repo compartido

- **Qué pasó**: los tests nuevos de `tests/KitSessionSource.Tests.ps1` creaban repos de prueba con `git init` y `git -C <dir> config` sin limpiar las variables de git. Fuera del hook pasaron (24/0). Dentro del pre-commit, git exporta `GIT_DIR`. El `git init` reinicializó entonces el repo común del kit y escribió `bare = true` en su `config`. El checkout principal pasó a dar `fatal: this operation must be run in a work tree` en `git -C <checkout principal> status` (Git Bash). Además, 3 tests salieron en rojo dentro del hook (`kit:test-fast` 1281/3): `git -C` leía la config del kit, no la del repo de prueba. Se restauró `core.bare = false` a mano. El test carga ahora `tests/Clear-GitEnv.ps1` en su `BeforeAll`, y se comprobó con `GIT_DIR` apuntando a un repo señuelo.
- **Fuente**: `git config core.bare` → `true` en el worktree; la línea `bare = true` en el `config` común, con mtime de las 14:46:27 locales, la hora del segundo intento de commit; salida del pre-commit en el commit fallido; commit `f5bc0055` (el test corregido); `patch.md` del patch 0169 §4.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md:42` ya lo dice («Dentro de un hook de git, `git -C` no basta… en los tests Pester, `tests/Clear-GitEnv.ps1`»), y cita que en la task 0001 pasó lo mismo. Nada lo comprueba.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: no leí `tech-stack.md` antes de escribir un test con git. Es la segunda vez que pasa (task 0001), y la regla vive solo en prosa. Otros tests ya la siguen (`tests/UpstreamWatch.Tests.ps1:2-3`), pero nada obliga a un test nuevo a seguirla.
- **Coste**: un commit bloqueado, unos minutos con el checkout principal roto para cualquier otra sesión del clon (dos worktrees abiertos a la vez) y la investigación (~10 min, sin respaldo más fino que esta sesión).
- **Propuesta**: un test Pester de anatomía que recorra `tests/*.Tests.ps1`: si un fichero llama a `git init` o a `git -C`, debe hacer dot-source de `Clear-GitEnv.ps1` y llamar a `Clear-GitEnv` en un `BeforeAll`. Así la regla de `tech-stack.md:42` la comprueba la suite y no depende de la lectura del agente.
- **Verificada**: sí — reproducido en esta sesión con el commit real (`git commit` en Git Bash → `kit:test-fast` 1281/3 y `core.bare = true`). La corrección se comprobó con `GIT_DIR` señuelo en `pwsh -File tests/Invoke-KitTests.ps1`.
- **Criterio de aceptación**: GIVEN un `tests/X.Tests.ps1` nuevo con `git init $dir` y sin `Clear-GitEnv`, WHEN corre `kit:test-fast`, THEN el test de anatomía falla nombrando `X.Tests.ps1`; con `Clear-GitEnv` en su `BeforeAll`, pasa.

## Lo que hice por iniciativa propia

- Antes de reintentar el commit tras corregir el test, ejecuté la suite con `GIT_DIR` y `GIT_INDEX_FILE` apuntando a un repo señuelo del scratchpad, no al del kit, y comprobé que su `core.bare` seguía en `false`. Así reprodujo el entorno del hook sin arriesgar el repo real. Funcionó. Candidato a regla: probar un cambio que llama a git desde los tests contra un `GIT_DIR` señuelo antes de commitear.

## Funcionó, no tocar

- `sdd merge --sync` y `sdd merge --push --verified-at`: integraron la base del patch 0170 sin conflicto y publicaron a la primera.
- `sdd estimation log`, `sdd capability check`, `sdd decision check` y `kit:roadmap` tras el merge de registros: la fila 0169 quedó coherente en el roadmap, en Patches y en el log.
- `sdd session tokens` dio el esfuerzo real sin esperas en una línea pegable.

## Menores

- `sdd id claim` falló una vez con `destino con cambios: <checkout principal>; límpialo y relanza sdd id claim`; al mirarlo el checkout estaba limpio (otra sesión en curso) y el reintento pasó. El mensaje podría decir que reintentar basta si el cambio era de otra sesión — `cli/src/ids/claim.ts:185`.
