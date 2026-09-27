---
id: 20260927-124418-patch-0084-headless-phase-mold
task: 0084
title: Patch — el molde de cada sujeto headless, en una carpeta por fase
type: patch
status: done
created: 2026-09-27
branch: feature/0084-headless-phase-mold
commit: 2919749
---

# Patch 0084 — el molde de cada sujeto headless, en una carpeta por fase

## Capacidades

- Ninguna, porque ninguna capacidad describe el lanzador de sujetos headless (`tests/headless/`).

## 1. Síntoma

Dos filas de «Deuda técnica» del roadmap, decididas por el dev-lead el 2026-09-27 para antes del corte de la 2.0.0:

1. **«`run.sh` cuenta de menos el coste de un sujeto con dos turnos»** ([ticket del patch 0080](../../field-reports/20260927-095543-patch-0080-defer-trigger.md) §3): «Informó de 6,69 $ cuando el total era 10,00 $». Fix propuesto: `spent()` suma todas las líneas `RESULTADO` de cada fichero, y `lib.sh` gana `subject_resume "<texto>"`.
2. **«Dos fases de una campaña en paralelo pisan el molde de cada sujeto»** ([ticket del patch 0082](../../field-reports/20260927-120907-patch-0082-superpowers-obra-642.md) §1): con un mismo `RUNS_DIR`, las fases se borran el molde entre sí. Fix propuesto: `PHASE` en la ruta del molde (`$RUNS/$PHASE/$LABEL`).

**Medido**: la (1) no se reproduce, y este patch solo arregla la (2).

## 2. Causa raíz

**(1) Sin fallo.** Se miraron los 10 streams crudos de la campaña del 0080, que seguían en su scratchpad (`runs*/d-{1,2}.jsonl`). En los 10, el segundo evento `result` (el del turno con `--resume`) trae un `total_cost_usd` **acumulado**. Su `modelUsage` es la suma exacta de los `usage` de los dos turnos. Ejemplo, `runs/d-1.jsonl`:

- tokens de salida: 2798 del turno 1 + 5430 del turno 2 = 8228 en el `modelUsage` del segundo `result`;
- coste: 0,417 $ + 0,446 $ (el `usage` del turno 2 a los precios de Sonnet 5 de `sdd-kit.json`) = 0,862 $, que es el `total_cost_usd` del segundo `result`.

Por tanto, el `tail -n 1` de `spent()` ya da el coste del sujeto. Los 6,69 $ eran el total real. Los 10,00 $ contaban dos veces el primer turno, como en la task 0055 (`tech-stack.md`). Sumar todas las líneas haría saltar `COST_CAP` antes de tiempo. La fila queda re-medida en el roadmap. `subject_resume` es una comodidad, no un fallo: se queda allí como deuda.

**(2) Reproducida en seco.** `run.sh` etiqueta a cada sujeto `<escenario>-<n>`, sin la fase. `subject_init` (`tests/headless/lib.sh`) deriva todas sus rutas de `$RUNS/$LABEL` y hace `rm -rf "$RUN"` antes de crear el molde. Esas rutas son el molde, `<etiqueta>.jsonl`, `.args` y `.err`. Con una campaña en el scratchpad (`DRY_RUN=1`), `PHASE=red` y después `PHASE=green` sobre el mismo `RUNS_DIR` dejaron el README del molde de `a-1` con el texto de `green`, y un solo `a-1.jsonl` y un solo `a-1.args`. Si las fases corren a la vez, una borra el molde de la otra con el sujeto en marcha.

## 3. Fix

- **Fichero(s)**: `tests/headless/lib.sh`, `tests/HeadlessLauncher.Tests.ps1`.
- **Cambio**: `subject_init` cuelga `RUNS` de `${PHASE:-red}` (el mismo valor por defecto de `run.sh`). Así, molde, stream, args y `.err` quedan en `RUNS_DIR/<fase>/`. El `stop` de `run.sh` sigue en la raíz de `RUNS_DIR`. Test nuevo, y los dos que leían `a-1.args` lo leen en `red/`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `red` y `green` con el mismo `RUNS_DIR` dejan dos moldes y dos streams (test nuevo): RED antes del fix («Expected path '…\runs\red\a-1\repo\README.md' to exist»), GREEN después | ✅ |
| 2 | `Invoke-Pester tests/HeadlessLauncher.Tests.ps1`: 14/14 | ✅ |
| 3 | (1): `modelUsage` del último `result` = suma de los `usage` de los dos turnos, en 10 de 10 streams del 0080 | ✅ sin fallo |

Validación diferida: 2026-09-27 · «Diferir: lo pruebo en la próxima campaña headless con dos fases, a cargo del dev-lead» · disparador: la próxima campaña headless con dos fases, a cargo del dev-lead

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Real: 0,6 h
