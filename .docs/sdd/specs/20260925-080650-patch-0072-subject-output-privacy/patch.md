---
id: 20260925-080650-patch-0072-subject-output-privacy
task: 0072
title: Patch — las salidas de los sujetos guardan el usuario y el home de la máquina
type: patch
status: done
created: 2026-09-25
branch: feature/0072-subject-output-privacy
commit: <hash>
---

# Patch 0072 — las salidas de los sujetos guardan el usuario y el home de la máquina

## 1. Síntoma

Del [ticket del patch 0069](../../field-reports/20260925-072140-patch-0069-scope-brake-registries.md) §2: «el lanzador de sujetos (`subject.sh` de la 0039, que llama a `tools.mjs` de la 0009) sustituye `$RUN` por `<run>`, pero no el home del usuario. Las salidas de este patch traían `/c/Users/<usuario>/.claude/plugins`, una ruta `AppData\Local\Temp` y el usuario en los listados de `ls -l`. […] 110 ficheros de `red/out` o `green/out` de 12 carpetas de `specs/`».

Medido en la rama: son **186** ficheros bajo `specs/*/red|green|refactor/`, no 110. El ticket contó solo `out/`; también hay `.jsonl` y `.json` crudos de lanzadores anteriores a `tools.mjs` (tasks 0006, 0008, 0010, 0014, 0031), `refactor/out/` de la 0067, un `subject.sh` y un `sondas.md`.

## 2. Causa raíz

- `tools.mjs` de la 0009 sí sustituía el home, pero solo en la forma de `USERPROFILE` (`C:\Users\<u>` y `C:/Users/<u>`). No cubría la forma Git Bash (`/c/Users/<u>`), el nombre de la carpeta de proyecto de Claude Code (`C--Users-<u>-…`) ni el usuario suelto (propietario en `ls -l`). Ya estaba anotado dos veces en `tech-stack.md` (tasks 0053 y 0060) como comprobación manual antes del commit, no como arreglo del lanzador.
- `subject.sh` de la 0039 genera `state.txt` con un `sed` propio que solo sustituye `$RUN`.
- Ningún test del repo mira la evidencia, así que nada frena una salida nueva con el home.
- Evidencia: el RED de `tests/SubjectOutputPrivacy.Tests.ps1` con `USERPROFILE=C:\Users\alice`: salen intactas `/c/Users/alice/.claude/plugins`, `"C:\\Users\\alice\\.claude"`, `C--Users-alice-AppData…` y `1 alice 197609`.

## 3. Fix

Tres commits, por decisión del dev-lead. El orden pedido era lanzador, test y saneado; va lanzador, saneado y test, porque el pre-commit corre la suite y no deja commitear el test en rojo. El RED del test se vio antes del saneado (fila 4).

1. **Lanzador** — `tools.mjs` (0009) toma el usuario del nombre de la carpeta home (no de `$USERNAME`, que en Git Bash vale `SYSTEM`: ticket 0068 §5), sustituye el home en sus formas Windows (`\`, `\\` de JSON, `/`) y Git Bash por `<home>`, y el usuario como palabra entera por `<user>`. Nuevo modo `--clean <run>` que filtra la entrada estándar; `subject.sh` de la 0039 lo usa para `state.txt` en lugar de su `sed`. Test: `tests/SubjectOutputPrivacy.Tests.ps1`, dos casos.
2. **Saneado** — las salidas existentes pasan por la misma limpieza de `tools.mjs --clean`. Solo cambian esas rutas y el usuario.
3. **Test del repo** — el mismo fichero de test falla si un fichero de `specs/*/red|green|refactor/` lleva `X:\Users\…` (también con `\\` o `/`), `/x/Users/…` o `X--Users-…` sin marcador, o el usuario de la máquina que corre la suite como palabra suelta, y nombra los ficheros.

`refactor/` entra en el alcance aunque la petición decía `red|green`: es evidencia de sujetos del mismo tipo (0067) y traía el usuario.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `tools.mjs` con un home falso deja `/c/Users/alice`, `C:\\Users\\alice`, `C--Users-alice` y `1 alice` | ✅ fallaba (2/2 casos), verificado por el agente |
| 2 | GREEN: las cinco formas salen como `<home>` o `<user>`; `alicemetal/sdd-kit` queda intacto | ✅ 2/2 |
| 3 | `--clean` con el `$HOME` real de Git Bash | ✅ `<home>/b`, `1 <user> 1` |
| 4 | RED del test del repo antes del saneado | ✅ fallaba: 186 ficheros con el usuario, 115 de ellos con la ruta |
| 5 | Saneado, `git diff --word-diff` | ✅ 1313 líneas en 186 ficheros; 0 palabras quitadas sin el usuario, 0 añadidas sin `<home>` o `<user>` |
| 6 | GREEN del test del repo y suite del pre-commit | ✅ 4/4; 632 pasan, 0 fallan |
| 7 | El primer GREEN marcaba `C:\\Users\\<user>` (limpio a mano en la 0040) | Falso positivo por backtracking de `\\{1,2}`: el patrón exige que tras el separador no venga otro ni `<` |

## 5. Tiempo (ligero)

- Estimación: 30 min
- Real: ~25 min
