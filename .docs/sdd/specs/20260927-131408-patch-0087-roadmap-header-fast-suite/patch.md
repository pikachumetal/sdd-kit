---
id: 20260927-131408-patch-0087-roadmap-header-fast-suite
task: 0087
title: Patch — cabecera de la release del roadmap y conjunto rápido del pre-commit
type: patch
status: done
created: 2026-09-27
branch: patch/0087-roadmap-header-fast-suite
commit: <hash>
---

# Patch 0087 — cabecera de la release del roadmap y conjunto rápido del pre-commit

Dos piezas que decidió el dev-lead el 2026-09-27, antes del corte de la 2.0.0.

## Capacidades

- Ninguna, porque ninguna capacidad describe el roadmap del propio kit ni la suite de tests del kit.

## 1. Síntoma

**Pieza 1** ([ticket del patch 0083](../../field-reports/20260927-125226-patch-0083-rename-leftovers.md) §1): «Copié la forma de `roadmap-template.md` (`| id | Feature | Origen | Ficheros que toca | Estado |`) y puse `✅` en la última columna. La cabecera real del roadmap del kit es `| id | Task | Peticiones | Ficheros que toca | Tamaño |` […], así que la última columna era el tamaño.» Además, el paso 4 de `sdd-end-patch` «no dice si un patch entra también en la tabla de la release».

**Pieza 2** (fila de deuda «`FastSuiteBudget.Tests.ps1` falla con carga dentro de la suite completa», tercer reporte en el ticket del patch 0083 §3): «`Invoke-Pester tests` […] dio 931/1. El fallo fue `FastSuiteBudget` […]. Aislado pasó en 29,4 s.»

**Medido** en la base (`62985a8`), con el mismo comando del test (el conjunto rápido en un proceso aparte, sin otra carga): **35,2 s**, por encima del umbral de 30 s. Difiere del reporte: ahora falla también aislado, no solo con carga. Los cinco ficheros más caros eran `SubjectOutputPrivacy` 7,4 s, `Build-EstimationLog` 3,7 s, `Measure-SessionTokens` 3,4 s, `DenyKillHook` 3,4 s y `Test-Capabilities` 2,9 s.

## 2. Causa raíz

**Pieza 1**: la 0064 renombró task → feature en la plantilla, pero no en las dos tablas de la sección `## Release 2.0.0` del roadmap del kit (líneas 27 y 95). Estas tablas tenían además su propia forma: el estado iba al principio de la celda «Task» y la última columna guardaba el tamaño. `tests/RoadmapStructure.Tests.ps1` solo comparaba el número de celdas de la cabecera con el del separador, no el texto con el de la plantilla. Por eso nada lo detectó. `sdd-end-patch` paso 4 solo nombraba la tabla de Patches. Pero `sdd-end-release` (paso 4, al colapsar el roadmap) busca los `🧪 validación diferida a <esta release>` en la sección de la release. Así, un patch diferido que solo tiene fila en Patches no llega al smoke de la release.

**Pieza 2**: el conjunto rápido creció con cada feature hasta pasar el umbral de 30 s en una máquina sin otra carga. Con una sola medición, cualquier carga añadida lo tumba.

## 3. Fix

- **Ficheros**: `.docs/sdd/roadmap.md`, `tests/RoadmapStructure.Tests.ps1`, `skills/sdd-end-patch/SKILL.md`, `tests/FastSuiteBudget.Tests.ps1`, `tests/Build-EstimationLog.Tests.ps1`, `tests/Measure-SessionTokens.Tests.ps1`, `tests/DenyKillHook.Tests.ps1`, `tests/Test-Capabilities.Tests.ps1`, y la evidencia en `tests/sdd-end-patch-release-row-red.md` y `-green.md`.
- **Cambio, pieza 1**: las dos tablas de la release llevan la cabecera literal de la plantilla. Un script movió el estado de cada una de las 60 filas a la columna «Estado» y dejó el tamaño al final de la celda «Feature» (`Tamaño: M.`). Las filas sin prefijo quedaron así: la 0033, saldada, con `✅`; la 0032, en curso en paralelo, con `🔄`; y las de «Versión siguiente» con `⏳`. Decisión del dev-lead: «Estado a su columna». `RoadmapStructure` falla si la cabecera de una tabla `| id |` no es la de `roadmap-template.md`. `sdd-end-patch` paso 4: un patch con la validación diferida y una sección de release abierta lleva también fila en la tabla de esa release, con el 🧪 en «Estado»; un patch validado no la lleva. Decisión del dev-lead: «Solo si queda 🧪».
- **Cambio, pieza 2**: `-Tag 'Slow'` en `Build-EstimationLog`, `Measure-SessionTokens`, `DenyKillHook` y `Test-Capabilities`. En este último se exceptúa «Las capacidades del repo», que valida las capacidades reales en cada commit. `SubjectOutputPrivacy` no se toca. `FastSuiteBudget` mide dos veces y se queda con la mejor.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `RoadmapStructure` con la cabecera vieja (RED) | ✅ falla: «got @('\| id \| Task \| Peticiones \| Ficheros que toca \| Tamaño \|', …)» |
| 2 | `RoadmapStructure` tras alinear | ✅ 3/3 |
| 3 | `FastSuiteBudget` aislado, mejor de dos | ✅ pasa; las dos pasadas, 51,2 s (≈25,6 s cada una, frente a 35,2 s antes) |
| 4 | `sdd-end-patch` paso 4: patch diferido con release abierta | ✅ RED 2/2 sin fila en la tabla de la release ([red](../../../../tests/sdd-end-patch-release-row-red.md)) → GREEN 1/1 con la fila y el 🧪 en «Estado» ([green](../../../../tests/sdd-end-patch-release-row-green.md)). 5 sujetos Sonnet, 3,07 $, por encima del techo de 3 $: el dev-lead eligió «Cerrar con lo medido» |
| 5 | Suite completa | ✅ 931/3 en 473 s: `ReleaseFlow` (la regla nombraba `sdd-end-release`) y dos de `SubjectOutputPrivacy` (salidas sin limpiar). Corregidos y re-ejecutados esos ficheros: 148/0; `FastSuiteBudget` pasó dentro de la suite completa |

Verificado por el agente: todo lo de la tabla. Nada lo reportó el usuario.

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Real: 1,1 h, sin contar los sujetos, que corrieron en headless (≈ 0,3 h de reloj)

## Decisiones tomadas sin el dev-lead

- El test de cabecera compara toda tabla cuya cabecera empieza por `| id |`. Así cubre también la tabla de «Versión siguiente», que cuelga de la sección de la release.
- `Test-Capabilities`: «Las capacidades del repo» queda en el conjunto rápido. Valida las capacidades reales y tarda menos de 0,2 s.
- Estados de las filas sin prefijo: la 0033 con `✅`, porque su celda dice «saldada»; la 0032 con `🔄`, porque se ejecuta en paralelo; las de «Versión siguiente» con `⏳`.
- El lanzador de sujetos pasa las salidas por `tests/headless/extract.mjs`, no por el `tools.mjs` de la 0055, que no quita el home.
