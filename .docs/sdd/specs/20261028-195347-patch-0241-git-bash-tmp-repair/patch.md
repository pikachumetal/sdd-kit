---
id: 20261028-195347-patch-0241-git-bash-tmp-repair
task: 0241
title: Patch — el hook de arranque del plugin repara el /tmp de Git Bash cuando apunta a una carpeta borrada
type: patch
solution: causa raíz
status: done
created: 2026-10-28
branch: patch/0241-git-bash-tmp-repair
commit: f90307c9
---

# Patch 0241 — el hook de arranque del plugin repara el /tmp de Git Bash cuando apunta a una carpeta borrada

## Capacidades

- Modificadas: `cli` — el hook de sesión repara el `/tmp` de Git Bash, también sin `.docs/sdd/`, y solo calla sin `.docs/sdd/` si no hay nada que reparar

## 1. Síntoma

Reportado en la fila 0241 del roadmap y en el walkthrough de la feature 0216: cada `bash` de cada sesión escribe `bash.exe: warning: could not find /tmp, please create!`, que se cuela en la salida de los tests (tres rojos de `kit:test-headless` en la 0216) y de las herramientas. `mount` enseñaba `/tmp` sobre `feature-0237-lint-clean-kit-markdown/.temp/vitest-CU4Bs3`, ya borrada.

Medido hoy: la carpeta existía otra vez (recreada a mano, con un fichero `sddscratch`) y `bash -c 'test -d /tmp'` salía con 0. Renombrándola un momento se reproduce el reportado.

## 2. Causa raíz

Git Bash (MSYS2) monta `/tmp` sobre el `TEMP` del primer proceso MSYS de la máquina (`usertemp` en la tabla de montajes) y todos los procesos MSYS posteriores comparten esa tabla mientras quede uno vivo. Si esa carpeta se borra, el montaje sigue apuntando a ella y `bash` avisa en cada arranque. Evidencia, con la carpeta renombrada (y devuelta a su sitio después):

- `C:\Program Files\Git\usr\bin\mount.exe` sigue dando `D:/code/.worktrees/sdd-kit/feature-0237-lint-clean-kit-markdown/.temp/vitest-CU4Bs3 on /tmp type ntfs (binary,noacl,posix=0,usertemp)`, y `cygpath.exe -w /tmp`, `D:\code\.worktrees\sdd-kit\feature-0237-lint-clean-kit-markdown\.temp\vitest-CU4Bs3`: los dos binarios dan la ruta aunque la carpeta no exista.
- `bash.exe -c 'test -d /tmp; echo $?'` → `bash.exe: warning: could not find /tmp, please create!` y `1`.
- Tras crear la carpeta vacía en esa ruta, sin cerrar ningún proceso, el mismo `bash` da `0` sin aviso: crearla basta.

Nada del kit lo repara hoy: el hook `SessionStart` del plugin (`hooks/hooks.json` → `sdd hook session-start` → `runSessionStart` de `cli/bin/session-start.js`) solo escribe avisos de versión y `using-sdd`. `cli/src/hook/session-start.ts`, que nombra la fila, solo reexporta `cli/bin/session-start.js`: el arreglo va en este, que es lo que ejecuta el hook.

## 3. Fix

- **Fichero(s)**: `cli/bin/git-bash-tmp.js` (nuevo), `cli/bin/session-start.js`, `cli/test/hook/git-bash-tmp.test.ts` (nuevo), `.docs/sdd/tech-stack.md`
- **Cambio**: `runSessionStart`, en Windows y con `git.exe` en el `PATH`, pregunta el montaje a `<Git>\usr\bin\cygpath.exe -w /tmp` con `execFileSync` (2 s de tope); si la carpeta no existe, la crea vacía y antepone una línea al `systemMessage`, también sin `.docs/sdd/`. Un fallo de la reparación no cambia el resto de la salida del hook. `tech-stack.md` explica el fallo y el `fstab` permanente.
- **Decisiones**:
  - El arreglo va en el hook `SessionStart` del plugin, no en `start-kit-session.mjs` ni en el hook del repo — dev-lead (fila 0241)
  - El montaje se pregunta con `execFile` del binario de Git (`mount.exe` o `cygpath.exe -w /tmp`), nunca con `bash -c`, y solo con `process.platform === 'win32'` y el binario presente — dev-lead (fila 0241)
  - `tech-stack.md` documenta el arreglo permanente opcional por máquina, `/tmp` fijo en `C:\Program Files\Git\etc\fstab` — dev-lead (fila 0241)
  - `cygpath.exe -w /tmp` en lugar de `mount.exe`: da la ruta de Windows sin analizar la tabla — sin el dev-lead (no lo ve el usuario del kit)
  - Git se localiza por el `git.exe` del `PATH` (`<Git>\cmd`, `<Git>\bin` o `<Git>\mingw64\bin`) — sin el dev-lead (no lo ve el usuario del kit)
  - La reparación corre también sin `.docs/sdd/`, y el aviso va en `systemMessage` — sin el dev-lead: la fila pide que corra «en todo proyecto con el plugin instalado» y que «lo diga en una línea»; el sitio de la línea es mío

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `vitest run test/hook/git-bash-tmp.test.ts` sin `cli/bin/git-bash-tmp.js` | ❌ `Cannot find module '../../bin/git-bash-tmp.js'` |
| 2 | GREEN: el mismo test con el módulo (reparación con el sistema de ficheros en memoria, `cygpath` inyectado, sin Windows, sin Git en el `PATH`, fusión del `systemMessage`) | ✅ 9/9 |
| 3 | De punta a punta en esta máquina: con la carpeta de `/tmp` renombrada, `bash -c 'test -d /tmp'` → aviso y `1`; `node cli/bin/sdd.js hook session-start` con `CLAUDE_PROJECT_DIR` en `cli/` (sin `.docs/sdd/`) | ✅ sale con 0 y escribe `{"systemMessage": "sdd-kit: Git Bash tenía /tmp montado sobre una carpeta borrada; la he creado vacía: D:\\code\\…\\vitest-CU4Bs3"}`; la carpeta existe y el mismo `bash` da `0` sin aviso; una segunda ejecución no escribe nada. La carpeta original se devolvió a su sitio |
| 4 | Lo mismo con `CLAUDE_PROJECT_DIR` en la raíz del worktree (con `.docs/sdd/`) | ✅ sale con 0; `systemMessage` con la línea de la reparación y `additionalContext` con `using-sdd`; `bash` da `0` después |
| 5 | Coste del arranque: `cygpath.exe -w /tmp` medido tres veces | 365, 190 y 749 ms |

Gate: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → cli:test: corrió 1592/1604 (12 skipped) · cli:typecheck: corrió (de caché de moon, mismas entradas que el pre-commit de `f90307c9`) · kit:test-headless: saltada (--affected: el cambio no toca sus inputs) · 31 s, sobre el árbol de `f90307c9` con el cierre sin commitear (solo `.md`)

Validación en campo: 2026-10-28 · RED → GREEN 9/9 de `git-bash-tmp.test.ts` · de punta a punta en Windows con la carpeta de `/tmp` apartada, con y sin `.docs/sdd/`: el hook la crea, lo dice y `bash -c 'test -d /tmp'` pasa de `1` con aviso a `0` · gate de cierre en verde · no probado: una máquina con Git instalado fuera de `C:\Program Files\Git` o sin `git.exe` en el `PATH`, y Linux o macOS de verdad (cubiertos solo por el test con la plataforma inyectada)

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,18 h del gate de cierre (11 min, patch 0245)
- Inicio: 2026-10-28T19:53Z
- Esfuerzo real: 0,17 h — reloj de la sesión 0,17 h desde 2026-10-28T19:51Z, sin 0 min de espera al dev-lead (0 esperas). −75 % sobre la estimación (0,68 h con el gate): la causa raíz ya venía medida en la fila y en el walkthrough de la 0216, y el gate corrió en 31 s porque `--affected` saltó `kit:test-headless` y `cli:typecheck` salió de caché
- Coste de sujetos: no aplica

## 6. Delta de capacidad

### Capacidad: `cli`

#### MODIFIED — El hook de sesión es un verbo de la CLI

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` en `2.2.0` y el kit cargado en `3.0.0`, con migraciones hasta la `2.3.0`
- WHEN Claude Code arranca la sesión y ejecuta `hooks/hooks.json`
- THEN escribe el JSON de la fixture `cli/test/fixtures/hook/pending-migration.json`: el `systemMessage` de las migraciones pendientes, y `additionalContext` con ese aviso, la orden de ofrecer la migración y `using-sdd`
- AND en una sesión headless con el plugin por `--plugin-dir`, el `hook_response` del stream trae ese `additionalContext`
- AND sin `.docs/sdd/` ni `/tmp` de Git Bash que reparar no escribe nada y sale con 0
- AND con Node 20.11.0 escribe el mismo JSON con `sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0` añadido a `systemMessage`, y sale con 0

#### ADDED — El hook de sesión repara el `/tmp` de Git Bash

- GIVEN Windows con Git en el `PATH` y el `/tmp` de Git Bash montado sobre una carpeta que no existe
- WHEN corre `sdd hook session-start`, con `.docs/sdd/` o sin él
- THEN crea esa carpeta vacía, pone delante del `systemMessage` `sdd-kit: Git Bash tenía /tmp montado sobre una carpeta borrada; la he creado vacía: <ruta>` y sale con 0
- AND un `bash -c 'test -d /tmp'` de Git Bash sale con 0 sin aviso
- AND pregunta el montaje a un binario de Git con `execFile`, nunca con un `bash -c`
- AND en otro sistema, o sin Git en el `PATH`, no ejecuta nada
