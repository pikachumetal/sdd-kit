---
id: 20260922-132530-patch-0023-rutas-largas
task: 0023
title: Patch — rutas de evidencia por debajo de 140 caracteres
type: patch
status: done
created: 2026-09-22
branch: feture/patch-rutas-largas
commit: f59754c
---

# Patch 0023 — rutas de evidencia por debajo de 140 caracteres

## 1. Síntoma

Del dev-lead: «la ruta más larga del repo tiene 165 caracteres y rompe la instalación del plugin en Windows; acorta la evidencia de la task 0002 por debajo de 140 y añade un test que lo vigile». Detalle en la fila de deuda «El plugin distribuye el repo entero» del roadmap:

```
fatal: cannot create directory at '.docs/sdd/specs/20260920-220741-task-0002-sdd-feedback/evidencia-red/moldes/molde-cliente/.docs/sdd/specs/…': Filename too long
```

## 2. Causa raíz

Las campañas RED/GREEN versionan dentro de la carpeta de la spec un proyecto simulado con su propio `.docs/sdd/specs/<timestamp>-task-…/`, así que la ruta anida dos nombres de spec completos. Medido con `git ls-files` sobre la rama (que ya integra `develop`): **65 rutas de 140 caracteres o más**, no solo las de la 0002:

- **Task 0002** (7 rutas, máx. 165): los moldes en `evidencia-red/moldes/molde-*/` y tres tickets GREEN copiados con el nombre completo que les dio el sujeto (`E2-green-2--20260921-064137-task-0007-implementer-dispatch-and-learning-destination.md`).
- **Task 0013** (58 rutas, máx. 152): cada sujeto copia su `.docs/` entera a `red/out/<etiqueta>/` y `green/out/<etiqueta>/`. Entró en `develop` después de escribir la fila del roadmap, por eso la fila solo nombra la 0002.

Acortar solo la 0002 dejaba el test pedido en rojo. Nada lo vigilaba: ningún test mira la longitud de las rutas. La task 0008 ya había sorteado el mismo problema a mano (`green/o/<etiqueta>/specs/…`, 139 caracteres), sin regla que lo fijara.

## 3. Fix

- **Fichero(s)**: `tests/PathLength.Tests.ps1` (nuevo); carpetas de evidencia de las tasks 0002 y 0013, con sus lanzadores y READMEs; referencias en `architecture.md`, `tech-stack.md`, `tests/kit-feedback-red.md`, `tests/kit-feedback-green.md` y en `tasks.md` y `walkthrough.md` de la 0002.
- **Cambio**: test Pester que falla si alguna ruta de `git ls-files` llega a 140 caracteres. En la 0002, `evidencia-red/` → `red/`, `evidencia-green/` → `green/`, `moldes/molde-*` → `red/m-*` y los tickets GREEN a `<etiqueta>.md` (el nombre original sigue en `<etiqueta>.status.txt`). En la 0013, cada salida `out/<etiqueta>/.docs/sdd/` pasa a `<etiqueta>/`, el patrón de la 0008. Los tickets de campo (`field-reports/`) conservan las rutas antiguas: son copia literal y no se editan.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `Invoke-Pester tests/PathLength.Tests.ps1` antes del fix | ✅ falla con 65 rutas (máx. 165) |
| 2 | GREEN: el mismo test tras los renombrados | ✅ pasa; la ruta más larga queda en 139 (de la 0008) |
| 3 | Suite completa `Invoke-Pester -Path tests` | ✅ 291 pasan, 0 fallan, 6 skipped |
| 4 | Sin referencias vivas a `evidencia-red/`, `evidencia-green/` ni a `out/` de la 0013 | ✅ solo quedan en `field-reports/` (literal) y en la fila del roadmap que cierra este patch |

Pendiente, fuera de este patch: la pieza (3) de la fila, que el plugin distribuya solo `skills/` y `.claude-plugin/`.

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 0,75h
