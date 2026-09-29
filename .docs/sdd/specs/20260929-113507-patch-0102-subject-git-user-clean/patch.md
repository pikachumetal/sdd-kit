---
id: 20260929-113507-patch-0102-subject-git-user-clean
task: 0102
title: Patch — el user.name de git de la máquina sale limpio de los sujetos y el pre-commit lo caza
type: patch
status: done
created: 2026-09-29
branch: feature/0102-subject-git-user-clean
commit: <hash>
---

# Patch 0102 — el user.name de git de la máquina sale limpio de los sujetos y el pre-commit lo caza

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/headless/extract.mjs` ni `tests/SubjectOutputPrivacy.Tests.ps1`.

## 1. Síntoma

Fila de deuda del roadmap «`extract.mjs` no limpia el `user.name` que llega al sujeto por el contexto de la sesión» ([ticket de la feature 0086](../../field-reports/20260927-135601-feature-0086-spec-review-weight.md) §4 y, segundo caso, [ticket de la feature 0099](../../field-reports/20260929-091515-feature-0099-frontend-verification.md) §1): tres salidas de un escenario llevaban el `user.name` de git de la máquina. Pasaron los siete `pre-commit` de la rama y el gate completo, y solo lo vio `SubjectOutputPrivacy.Tests.ps1` en el `pre-merge-commit`. El ticket suponía que el `pre-commit` no ejecuta ese test.

Medido, y difiere del reportado: el `pre-commit` **sí** ejecuta `SubjectOutputPrivacy.Tests.ps1` (no lleva la etiqueta `Slow`), pero pasa con la fuga dentro. Con un fichero sin commitear en `.docs/sdd/specs/zz-leak-probe/red/spec.md` que contenía el `user.name` real, lanzado como lo lanza el hook (`pwsh -NoProfile` desde `sh`): `Passed=7 Failed=0`. El mismo test con `[Console]::OutputEncoding` en UTF-8: `Passed=6 Failed=1`. Además, `extract.mjs clean` deja el nombre tal cual (`grep -c` del nombre en su salida: `1`).

## 2. Causa raíz

Dos defectos independientes:

1. **El test no reconoce el nombre si lleva caracteres no ASCII.** `pwsh -NoProfile` lanzado desde `sh` arranca con `[Console]::OutputEncoding` en `ibm437`, y PowerShell decodifica con él la salida de `git config user.name`. Un nombre con tilde llega corrupto (la «À», bytes `c3 80`, se lee como `U+251C` más otro carácter: 14 caracteres en lugar de 13), el patrón de `Find-Leak` no casa con ningún fichero y el test pasa. Desde una sesión con perfil la consola está en UTF-8 y sí la caza; por eso el `pre-commit` la dejó pasar y el `pre-merge-commit` del ticket la vio.
2. **`extract.mjs clean` no conoce el nombre.** Limpia la ruta de la campaña, el home y el usuario del sistema, pero no el `user.name` de git. `subject_launch` fija `Fixture` con `GIT_CONFIG_*` para lo que el sujeto lea con git, pero el harness le inyecta el nombre de la máquina en el contexto de la sesión, y el sujeto lo copia. `subject_keep` y `subject_save` ya pasan por `clean` (`tests/headless/lib.sh:100-119`): basta con que `clean` lo sustituya.

La tercera parte de la propuesta de la fila («el `pre-commit` ejecuta `SubjectOutputPrivacy.Tests.ps1` cuando el commit toca salidas de sujetos») no hace falta: ya lo ejecuta en cada commit. Lo que fallaba era la lectura del nombre (defecto 1).

## 3. Fix

- **Fichero(s)**: `tests/headless/extract.mjs`, `tests/SubjectOutputPrivacy.Tests.ps1`.
- **Cambio**: `extract.mjs` lee `git config user.name` desde la carpeta del kit (UTF-8, y sin los `GIT_CONFIG_COUNT`/`KEY_n`/`VALUE_n` que `subject_launch` exporta para tapar el nombre con `Fixture`) y `clean` lo sustituye por `<git-user>`, en los tres modos. El test lee el nombre con `Get-GitUserName`, que fija `[Console]::OutputEncoding` en UTF-8 mientras llama a git. Dos tests nuevos cubren ambos defectos.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Sonda: fichero sin commitear con el `user.name` real en `specs/zz-leak-probe/red/`, `SubjectOutputPrivacy.Tests.ps1` lanzado como en el `pre-commit` | ✅ antes: `Passed=7 Failed=0` (la fuga pasa) → después: `Failed=1` en «ni el user.name de git de esta máquina». La sonda se borró sin commitear |
| 2 | Test nuevo «extract.mjs clean sustituye el user.name de git de la máquina, no el del molde»: global `Alice Liddell` y molde `Fixture` por `GIT_CONFIG_*` | ✅ RED (sin el fix de `extract.mjs`) → verde: `spec aprobada por <git-user>; commits de Fixture` |
| 3 | Test nuevo «lee el user.name de git en UTF-8 aunque la consola no lo sea»: consola en IBM437 y nombre `Àlice Liddell` | ✅ RED (sin la línea de UTF-8) → verde |
| 4 | `extract.mjs clean` sobre la sonda con el nombre real | ✅ `Aprobada por <git-user>` |
| 5 | `HeadlessLauncher.Tests.ps1` (lanzador que usa `extract.mjs`) | ✅ 15/15 |
| 6 | Suite rápida del kit (`pre-commit` del fix) | ✅ en el commit del fix |

La primera versión del helper de los tests restauraba las variables con `[Environment]::SetEnvironmentVariable($name, $null)`: PowerShell pasa `""`, `GIT_CONFIG_GLOBAL` quedaba vacía y git dejaba de leer la config global, así que el test del nombre se **saltaba** (`Skipped`) con la sonda dentro. Lo cazó la sonda del caso 1. Se usa `Restore-GitEnv`, que ya borra la variable cuando no existía.

Ningún fichero commiteado contiene el nombre real: la sonda vivió solo en el working tree y los tests usan `Alice Liddell` y `Àlice Liddell`.

## 5. Tiempo (ligero)

- Estimación: 0.5h
- Real: 0.6h
