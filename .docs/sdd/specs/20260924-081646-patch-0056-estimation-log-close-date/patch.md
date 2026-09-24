---
id: 20260924-081646-patch-0056-estimation-log-close-date
task: 0056
title: Patch — el estimation-log fecha la fila con el cierre, no con la apertura
type: patch
status: done
created: 2026-09-24
branch: feature/patch-log
commit: <hash>
---

# Patch 0056 — el estimation-log fecha la fila con el cierre, no con la apertura

## 1. Síntoma

Reportado por el dev-lead: «Build-EstimationLog.ps1 fecha la fila con el id de la carpeta y no con el cierre: una task abierta el 23 y cerrada el 24 sale con fecha del 23». Es el tercer reporte: [ticket template 0016](../../field-reports/20260922-212212-task-0016-test-db-guard.md) §3, patch 0035 §4 y [ticket de la 0053](../../field-reports/20260924-080338-task-0053-fewer-stops.md) §4.

Medido sobre el corpus de este repo: 10 artefactos llevan en el frontmatter un `created:` posterior a la fecha de su carpeta (0000-progressive-disclosure, 0002, 0011, 0014, 0008, 0019, 0021, 0031, 0053 y 0026; la 0053 lleva además `date:`). Los 10 salían en `estimation-log.md` con la fecha de la carpeta. El reporte habla de `date:`, pero la plantilla usa `created:` y solo la 0053 lleva también `date:`.

## 2. Causa raíz

`New-Row` tomaba la fecha de `Get-FolderDate $Dir.Name`, que solo parsea el prefijo `yyyyMMdd` del nombre de la carpeta. Ese prefijo es el timestamp de **apertura** (`sdd-start-task` / `sdd-start-patch` paso 2). El artefacto que lee el script (walkthrough.md o patch.md) lleva en su frontmatter `created:` con la fecha en que se escribió, que en un walkthrough es el cierre. El script leía ya ese contenido (`Get-TaskId` saca `task:` de él), pero nunca la fecha.

Efecto colateral: `Get-ReleaseLabel` asigna la release comparando esa fecha con las del changelog. La 0002 y la 0011, abiertas el 20 y cerradas el 21, caían en la 1.1.0 (cortada el 20) sin pertenecer a ella.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Build-EstimationLog.ps1`, `tests/Build-EstimationLog.Tests.ps1`, `.docs/sdd/estimation-log.md` (regenerado).
- **Cambio**: `Get-FolderDate` pasa a `Get-RowDate`: toma la primera línea `created: YYYY-MM-DD` o `date: YYYY-MM-DD` del artefacto. Si no hay ninguna, o el campo lleva el placeholder de la plantilla, usa la fecha de la carpeta como respaldo.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: 4 casos nuevos en `Describe 'Fecha de la fila'` (walkthrough con `created:`, patch.md con `created:`, `date:`, placeholder) antes del fix | ✅ agente: 3 fallan porque la fila sale con la fecha de la carpeta (2026-09-23); el del placeholder pasa |
| 2 | GREEN: mismos casos con el fix | ✅ agente: 4/4 |
| 3 | Suite completa `Invoke-Pester tests` | ✅ agente: 528 pasan, 0 fallan |
| 4 | `estimation-log.md` regenerado | ✅ agente: cambian exactamente las 10 filas medidas en §1 y la tabla por release (1.1.0 pasa de 5 a 3 artefactos; «sin publicar», de 36 a 38) |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 0,4h
- Coste de sujetos: no aplica
