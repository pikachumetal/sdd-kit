---
id: 20261102-085747-patch-0288-rc2-fake-gh
task: 0288
title: Patch — el gh falso no llega al sujeto cuando el lanzador hereda ORIGINAL_PATH
type: patch
solution: causa raíz
status: done
created: 2026-11-02
branch: patch/0288-rc2-fake-gh
commit: 25af5af0
---

# Patch 0288 — el `gh` falso no llega al sujeto cuando el lanzador hereda `ORIGINAL_PATH`

Validación: agente, «Perfil delegate» — `validation.mode: field`: el uso real lo validan los tickets.

## Capacidades

- Ninguna, porque ninguna capacidad describe el entorno que el lanzador de sujetos (`tests/headless/lib.mjs`) pasa a `claude`.

## 1. Síntoma

Ticket de la feature 0277, §3, y fila 0288: en `rc2` de la batería de `sdd-archive`, el sujeto corre `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha` y recibe

```text
failed to determine base repo: no git remotes found
```

`## llamadas a gh` dice `ninguna` y `K6` falla 2/2, también con el kit de la base (`.docs/sdd/specs/20261101-191641-feature-0277-sdd-retro/green/out/rc2-1.tools.txt` y `base-ctl/out/`). Ese mensaje es del `gh` real: el falso (`fixtures/gh/gh.mjs`) solo escribe lo de `gh.json`.

Medido además: en la 0277, `rc1` también dice `ninguna` en los cuatro sujetos (green y base-ctl); en la 0177 (2026-10-31, misma versión de Claude Code, 2.1.316), `rc1` y `rc2` registran la llamada.

## 2. Causa raíz

En Windows, la herramienta Bash de Claude Code es Git Bash de login. Su `/etc/profile`, con `MSYS2_PATH_TYPE` en `inherit` (el valor por omisión), rehace el `PATH` así:

```sh
ORIGINAL_PATH="${ORIGINAL_PATH:-${PATH}}"
PATH="${MINGW_MOUNT_POINT}/bin:${MSYS2_PATH}${ORIGINAL_PATH:+:${ORIGINAL_PATH}}"
```

y exporta `ORIGINAL_PATH` (línea 152). Si el proceso que lanza la batería desciende de un Git Bash de login, hereda `ORIGINAL_PATH` con el `PATH` de entonces. `ghFake` (`tests/batteries/sdd-archive/subject.mjs`) antepone el `bin/` del molde a `PATH`, y `claudeEnv` (`tests/headless/lib.mjs`) antepone `no-claude/`, pero los dos dejan `ORIGINAL_PATH` tal cual. El Bash del sujeto rehace el `PATH` desde esa `ORIGINAL_PATH` vieja, y pierde el `gh` falso y también `no-claude/`, el bloqueo que impide al sujeto lanzar su propio `claude` fuera de la cuenta.

Evidencia, con un `CLAUDE_BIN` que lanza el `claude` real con los argumentos y el entorno del sujeto de `rc2` y solo cambia la petición por una sonda (`command -v gh; type -a gh; gh run list …; echo "$PATH"`), con haiku:

| Lanzado desde | `ORIGINAL_PATH` | `command -v gh` en el sujeto | `gh.log` | Snapshot de shell del sujeto |
| --- | --- | --- | --- | --- |
| PowerShell | sin definir | `…/runs/red/rc2-1/bin/gh` | `gh run list --workflow ci.yml` | — |
| Git Bash | sin definir | `…/runs/red/rc2-1/bin/gh` | `gh run list --workflow ci.yml` | 09:49:41: `no-claude` y `rc2-1/bin` en `PATH` |
| Git Bash | `"$PATH"` del padre | `/c/Program Files/GitHub CLI/gh` → `failed to determine base repo: no git remotes found` | no existe | 09:56:13: ni `no-claude` ni `rc2-1/bin` en `PATH` |

Una sola variable cambia entre la segunda y la tercera fila, y la tercera da el síntoma literal del ticket. Un sujeto real de `rc2` (sonnet), lanzado hoy desde PowerShell sin `ORIGINAL_PATH`, registra la llamada en `## llamadas a gh`: el fallo depende de cómo se arrancó la sesión que lanza la batería, no del molde ni de la versión de Claude Code (2.1.316 el 31-oct y el 1-nov).

Descartado: dos claves `Path` y `PATH` en `s.env` (desde los dos shells hay una sola), la cadena `battery.mjs` → `campaign.mjs` → `run.mjs` (pasa el entorno intacto), los hooks del kit (no tocan el entorno), el perfil del usuario (`~/.bashrc` antepone y no reescribe, sin cambios desde el 29-oct).

Mismo mecanismo en otros escenarios: todos los que usan `ghFake` (`ci1`, `ci2`, `rc1`, `rc2`) y, por `no-claude/`, todos los sujetos de todas las baterías.

## 3. Fix

- **Fichero(s)**: `tests/headless/lib.mjs`, `cli/test/kit/headless/lib.test.ts`
- **Cambio**: `claudeEnv` quita `ORIGINAL_PATH` del entorno del sujeto: sin ella, el `/etc/profile` de Git Bash toma el `PATH` que arma el lanzador. En Linux y macOS la variable no existe o no la lee nadie, y quitarla no cambia nada.
- **Decisiones**:
  - El arreglo va en el lanzador común y no en `ghFake`: lo mismo pierde `no-claude/` en cualquier batería — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `pnpm --dir cli exec vitest run test/kit/headless/lib.test.ts -t "ORIGINAL_PATH"`: el entorno de `claude` no lleva `ORIGINAL_PATH` | ✅ RED antes del fix (`expected {…} not to have property "ORIGINAL_PATH"`), verde después; `test/kit/headless/` 142/142 |
| 2 | Paso `release-ci` (`rc1` y `rc2`, `n = 2`) desde Git Bash con `ORIGINAL_PATH="$PATH"` heredada: `BATTERY=sdd-archive STEPS="release-ci" … node tests/headless/battery.mjs run` | ✅ `rc1 · 2/2 · verde`, `rc2 · 2/2 · verde`; salida en `green/out/` |
| 3 | Fila `K6` de `rc2` leída a mano en `green/out/rc2-{1,2}.tools.txt` | ✅ 2/2: ningún comando corre `node --test`; solo sale en la línea `**Suites**` del tech-stack que lee el sujeto |
| 4 | `## llamadas a gh` en `green/out/{rc1,rc2}-{1,2}.state.txt` | ✅ los cuatro: `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha`, y el sujeto recibe el `success` del `gh` falso |

Validación en campo: 2026-11-02 · test RED→GREEN de `claudeEnv` y `test/kit/headless/` 142/142 · `release-ci` con `ORIGINAL_PATH` heredada, `rc1` 2/2 y `rc2` 2/2, `K6` leída a mano 2/2 (ejecución real) · el gate de cierre corre en la base integrada, porque `patch/0290` está abierta a la vez

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-02T08:57Z
- Esfuerzo real: 0,33 h — reloj de la sesión 0,33 h desde 2026-11-02T08:43Z, sin 0 min de espera al dev-lead (0 esperas)
- Desvío: −34 % sobre las 0,5 h. Una sonda con `CLAUDE_BIN` (el `claude` real con los argumentos y el entorno del sujeto, y una petición de una línea en haiku) separó el entorno del modelo sin lanzar sujetos enteros, y el fix fue de una línea
- Coste de sujetos: 0,96 $ en 5 sujetos Sonnet y 4 sondas Haiku — diagnóstico 0,28 $ (un `rc2` real 0,27 $; sondas < 0,01 $); verificación `release-ci` 0,68 $
