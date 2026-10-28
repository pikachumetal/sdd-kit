---
id: 20261028-220038-patch-0254-campaign-cleanup-kit-copy
task: 0254
title: Patch — la limpieza de una campaña de sujetos para también los procesos lanzados desde su copia del kit
type: patch
solution: causa raíz
status: in-progress
created: 2026-10-28
branch: patch/0254-campaign-cleanup-kit-copy
commit:
---

# Patch 0254 — la limpieza de una campaña de sujetos para también los procesos lanzados desde su copia del kit

## Capacidades

- Ninguna, porque el lanzador de sujetos (`tests/headless/`) es una herramienta del repo, no del kit que se instala.

## 1. Síntoma

Fila 0254 del roadmap, con dos casos de un `sdd validation serve` que un sujeto deja vivo: en la tanda de la 0230 bloqueó la carpeta de `g4-1` (`rm: cannot remove '…/.temp/r30/green/g4-1/repo': Device or resource busy`) y la tanda colgó 1 h 6 min ([ticket de la 0230](../../field-reports/20261028-162209-feature-0230-red-contrast-failing-file-first.md) §1); en el RED de la 0248, `run.mjs` dio `EPERM, Permission denied` al limpiar la carpeta de `ws1-2` hasta pararlo por PID ([ticket del patch 0248](../../field-reports/20261028-214351-patch-0248-lanes-env-setup.md), menores).

## 2. Causa raíz

- El sujeto lanza el panel como dice `skills/sdd-archive/references/dev-validation.md`: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" validation serve --steps <steps.json> --out .temp/validation/<id>.json`, en segundo plano, con rutas relativas y el cwd en su molde. Su línea de órdenes nombra la copia del kit (`CLAUDE_PLUGIN_ROOT` es `KIT_DIR`) y no la carpeta del sujeto; el cwd en el molde es lo que bloquea el borrado en Windows.
- `subjectProcesses(processes, folder)` (`tests/headless/campaign.mjs`) solo elige los procesos cuya línea de órdenes nombra la carpeta del sujeto, así que el servidor no se para.
- Además, la carpeta solo la borra el propio sujeto (`cleanup` de `tests/headless/lib.mjs`, `fs.remove(s.RUN)`), antes de salir; la parada de la campaña (`launchSubject`, al acabar el sujeto) llega después, y nadie vuelve a borrarla.

## 3. Fix

- **Fichero(s)**: `tests/headless/campaign.mjs`, `cli/test/kit/headless/campaign.test.ts`, cabecera de `tests/headless/run.mjs` y la descripción del lanzador en `tech-stack.md`. Sale `stopSubjectProcesses`, que solo usaba `launchSubject`: la sustituye `stopLeftovers`, que lista los procesos una vez para la carpeta y para la copia del kit.
- **Cambio**: al acabar un sujeto, si ya no queda ninguno en curso, la campaña para también los procesos cuya línea de órdenes nombra la CLI de su copia del kit (`<KIT_DIR>/cli/bin/sdd.js`) y después borra las carpetas de los sujetos acabados que sigan en disco (salvo `KEEP_MOLD=1`).
- **Decisiones**:
  - Se busca `<KIT_DIR>/cli/bin/sdd.js`, no `KIT_DIR` a secas: los `claude` de los sujetos llevan `--plugin-dir <KIT_DIR>`, y buscar la carpeta del kit pararía a los sujetos en curso — sin el dev-lead (no lo ve el usuario del kit)
  - Solo cuando no queda ningún sujeto en curso: la línea de órdenes del servidor no dice de qué sujeto es, y con otro en marcha se pararía su panel o un `sdd.js` a medias; el que acaba último limpia lo de todos — sin el dev-lead (no lo ve el usuario del kit)
  - La parada al recibir una señal (`stopCampaign`) y el barrido de cortados al arrancar no cambian — sin el dev-lead (no lo ve el usuario del kit)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | GIVEN un sujeto que deja vivo `node <copia del kit>/cli/bin/sdd.js validation serve` WHEN la campaña limpia su carpeta THEN el proceso ya no existe y la carpeta se borra sin `EPERM` (lista de procesos inyectada; `fs.remove` de la carpeta lanza `EPERM` mientras el servidor no se haya parado; un `claude --plugin-dir <copia del kit>` no se toca) | ✅ RED antes del fix (`expected [] to deeply equal [ { pid: 71, tree: true } ]`) → GREEN |
| 2 | con otro sujeto en curso no se para nada de la copia del kit; lo para el último en acabar, que borra también la carpeta del primero | ✅ RED → GREEN; mutante sin la guarda de «en curso»: rojo |
| 3 | con `KEEP_MOLD=1` se para el servidor y la carpeta se queda | ✅ RED → GREEN |
| 4 | `cli/test/kit/headless/campaign.test.ts` entera y `cli:typecheck` | ✅ 37/37 · typecheck limpio |
| 5 | smoke con la lista de procesos real de Windows (`realDeps().processes`): un `node <kit>/cli/bin/sdd.js validation serve` con barras `/` lo encuentra `subjectProcesses` y `killProcess` lo para | ✅ `encontrados [ 77664 ]` · `vivo tras parar: false` |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,01 h del gate de cierre (31 s, patch 0241)
- Inicio: 2026-10-28T22:00Z
- Coste de sujetos: no aplica
