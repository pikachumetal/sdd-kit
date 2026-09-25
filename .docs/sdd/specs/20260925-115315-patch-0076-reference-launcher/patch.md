---
id: 20260925-115315-patch-0076-reference-launcher
task: 0076
title: Patch — cada campaña copia el lanzador de sujetos de otra y hereda sus defectos
type: patch
status: done
created: 2026-09-25
branch: feature/0076-reference-launcher
commit: cd3f16c
---

# Patch 0076 — cada campaña copia el lanzador de sujetos de otra y hereda sus defectos

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/headless/`: es herramienta del repo del kit, no conducta que el kit fije a los proyectos.

## 1. Síntoma

Fila de deuda del roadmap ([ticket 0062](../../field-reports/20260925-105927-task-0062-plan-entry.md) §5): «el `subject.sh` de la 0062 usaba el `tools.mjs` de la 0055, que no sanea el home, y el test de privacidad del patch 0072 rechazó el merge; antes, copiar el `.docs/` de cada sujeto rompió `PathLength.Tests.ps1`. Tercer problema de la familia (tope de sujetos, privacidad, rutas)».

Medido en la rama, además: la ruta de la campaña no se sustituye por `<run>` cuando el scratchpad cuelga de `%TEMP%`. Git Bash la escribe `/tmp/…`, y node la recibe como `C:/…`, porque MSYS convierte el argumento. El dry-run del lanzador nuevo dejó en `tools.txt` la ruta entera del scratchpad, con el id de la sesión.

## 2. Causa raíz

- No hay fuente única del lanzador: `tech-stack.md` remite a los de carpetas concretas («Lanzador de referencia: `red/subject.sh` de la carpeta de la task 0004», el `tools.mjs` de la 0009, el `run.sh` de la 0044…). Cada campaña copia el de la anterior más cercana, y cada copia pierde alguna salvaguarda:
  - 5 `subject.sh` (0059, 0061, 0067 y los dos de la 0070) llaman al `tools.mjs` de la 0055. Con un home falso `C:\Users\alice`, ese `tools.mjs` deja intactos `/c/Users/alice/.claude/plugins` y `1 alice 197609`, y su `state.txt` usa un `sed` que solo sustituye `$RUN`.
  - 17 `subject.sh`, de las tasks 0004 a 0042, no tienen la guarda del scratchpad: quien copie uno de ellos la pierde.
  - El de la 0062 copia `specs/` entero a la salida, y eso rompió el límite de 140.
- Las variantes de la ruta de la campaña en `tools.mjs` de la 0009 parten de la forma `/c/…`. Pero node recibe `C:/…`, y así no generan `/c/…`, ni `\\` de JSON, ni `/tmp/…`.

## 3. Fix

- **Ficheros**: `tests/headless/run.sh`, `tests/headless/lib.sh`, `tests/headless/extract.mjs`; `tests/HeadlessLauncher.Tests.ps1` (nuevo, `Slow`); `tests/SubjectOutputPrivacy.Tests.ps1` (apunta al extractor nuevo, con dos casos más); `.gitattributes` (`tests/headless/*.sh` con `eol=lf`: con `core.autocrlf=true` el checkout pone CRLF y bash no lo ejecuta); `tech-stack.md` y `architecture.md`.
- **Cambio**: el lanzador de referencia se usa, no se copia. La campaña solo escribe su `subject.sh` (molde, petición y estado) con las funciones de `lib.sh`. `run.sh` exige `SUBJECT_CAP` y `COST_CAP`, los cuenta en todas las fases de la spec, para ante `RUNS_DIR/stop` y aborta fuera del scratchpad. `lib.sh` comprueba el scratchpad, la copia del kit y el `cwd`, y solo admite copias planas por debajo de 140. `extract.mjs` (modos `tools`, `texts` y `clean`) une el saneado del patch 0072 con el extractor de textos de la 0055, y sustituye la ruta de la campaña en todas sus formas. `DRY_RUN=1` recorre la campaña sin `claude -p`. Las campañas cerradas no se migran.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Reproducción: `tools.mjs` de la 0055 con home `C:\Users\alice` | ✅ fallaba: salen `/c/Users/alice/…` y `1 alice 197609` (agente) |
| 2 | RED: `HeadlessLauncher.Tests.ps1` y la privacidad sobre `extract.mjs`, sin los ficheros | ✅ 8 fallos de 11 (agente) |
| 3 | GREEN: seco, `SUBJECT_CAP`, `COST_CAP` en todas las fases (el último `result`), `stop`, fuera del scratchpad, caps obligatorios, copia plana | ✅ 11/11 (agente) |
| 4 | Dry-run a mano en el scratchpad: `tools.txt` con la ruta entera `/tmp/claude/…` | ❌ destapó la causa de la fila 2 de §2; RED con dos casos nuevos (2 fallos) |
| 5 | GREEN con las formas de `<run>` (`C:/`, `\`, `\\`, `/c/`, `/tmp/`) | ✅ 13/13 (agente) |
| 6 | Suite completa, con `Slow` | ✅ 787 pasan, 0 fallan, 8 omitidos (agente) |

## 5. Tiempo (ligero)

- Estimación: 30 min
- Real: ~35 min
