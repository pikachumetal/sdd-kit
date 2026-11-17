---
id: 20260925-175053-patch-0079-spec-dir-absolute
task: 0079
title: Patch — el lanzador headless pierde las salidas con SPEC_DIR relativo
type: patch
status: done
created: 2026-09-25
branch: patch/0079-spec-dir-absolute
commit: 5dc1c31
---

# Patch 0079 — el lanzador headless pierde las salidas con SPEC_DIR relativo

## Capacidades

- Ninguna, porque ninguna capacidad describe el lanzador de sujetos headless (`tests/headless/`), que es infraestructura de tests de este repo y no se distribuye a los proyectos.

## 1. Síntoma

Dos veces el mismo día. En la task 0077 (ticket §2), la primera tanda del RED se lanzó con `SPEC_DIR` relativo y `run.sh` terminó con «sujetos de la campaña: 0 · coste acumulado: 0.00 $» y exit 0. En la feature 0064 (ticket §1), un sujeto de 12 turnos y 0,34 $ acabó igual, y el techo de coste de la campaña no contó ese gasto. En los dos casos las salidas se recuperaron a mano desde el stream.

## 2. Causa raíz

`subject_init` (`tests/headless/lib.sh`) guardaba `OUT` tal como llegaba de `run.sh`, que lo construye como `"$SPEC_DIR/<fase>/out"`. Después, `subject_launch` hace `cd "$R"` al molde, y `subject_save` y `subject_keep` escriben en `$OUT`, que ahora se resuelve contra el molde, donde esa carpeta no existe. Las redirecciones fallan dentro del sujeto en segundo plano, y `run.sh` cuenta los `*.tools.txt` bajo `SPEC_DIR`, donde no hay ninguno. Sin salidas, `spent()` suma 0, y el techo `COST_CAP` deja de proteger la campaña. De paso, `out_path` solo mide la longitud de las rutas que empiezan por `REPO_ROOT`, así que con un `OUT` relativo tampoco comprobaba el límite de 140 caracteres.

`RUNS_DIR` no tenía el problema porque `subject_init` ya lo resuelve a absoluto (`RUNS="$(cd "$RUNS" && pwd)"`).

## 3. Fix

- **Fichero(s)**: `tests/headless/lib.sh`, `tests/HeadlessLauncher.Tests.ps1`
- **Cambio**: `subject_init` resuelve `OUT` a ruta absoluta justo después de crearla, igual que ya hacía con `RUNS`. El arreglo va en `lib.sh`, y no en `run.sh`, porque así cubre también un `subject.sh` lanzado sin `run.sh`. Caso nuevo en el test del lanzador: campaña en seco con `SPEC_DIR=spec` relativo.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `SPEC_DIR` relativo y `DRY_RUN=1`: antes del fix, el test nuevo falla porque `spec/red/out/a-1.tools.txt` no existe | ✅ RED reproducido |
| 2 | El mismo caso con el fix: la salida existe y el recuento dice «sujetos de la campaña: 1» | ✅ |
| 3 | `HeadlessLauncher`, `PathLength` y `SubjectOutputPrivacy` completos, incluido el límite de 140 caracteres con `OUT` ya absoluto | ✅ 18/18 |

Validación diferida: 2026-09-25 · «Diferido a la ola 1» · disparador: la primera campaña de la ola 1 (0078, 0074 o 0036) lanzada con `run.sh`, cuyo recuento final de «sujetos de la campaña» y de coste tiene que coincidir con los sujetos que corrieron, a cargo del dev-lead
Validado: 2026-09-25 · «Validado» · por el disparador: la campaña del patch 0078 lanzó 8 sujetos con `run.sh` y `SPEC_DIR` absoluto tras este patch; las salidas cayeron en `red/out/` y `green/out/` y los recuentos coincidieron ([ticket del patch 0078](../../field-reports/20260925-181620-patch-0078-split-threshold.md), «Funcionó, no tocar»)

## 5. Tiempo (ligero)

- Real: 0,3 h
