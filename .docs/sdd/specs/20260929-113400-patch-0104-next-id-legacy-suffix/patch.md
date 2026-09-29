---
id: 20260929-113400-patch-0104-next-id-legacy-suffix
task: 0104
title: Patch — Get-NextSddId.ps1 -Reserve no aborta con ids heredados con sufijo
type: patch
status: done
created: 2026-09-29
branch: feature/0104-next-id-legacy-suffix
commit: 62d78765
---

# Patch 0104 — `Get-NextSddId.ps1 -Reserve` no aborta con ids heredados con sufijo

## Capacidades

- Modificadas: `feature-ids` — cambia «El script avisa de un id duplicado y no devuelve ninguno»

## 1. Síntoma

Reportado ([ticket de la feature 0010b del template](../../field-reports/20260928-222123-feature-0010b-verificacion-e2e.md) §4, fila de deuda del roadmap): con carpetas cerradas `task-0006a-…` y `task-0006b-…`, anteriores a la regla de «nunca sufijos», el script lanza «Dos artefactos distintos comparten el id 0006» y no reserva. El agente calculó el id a mano.

Medido: igual que el reportado. Con el fixture `legacy-suffix` ampliado con `task-0006b-old-split`, el script sale sin id tanto con `-Reserve` como sin él.

## 2. Causa raíz

`SpecFolderIdPattern` (`-(?:feature|task|patch|proposal)-(\d{4})[a-z]*-`) captura solo los cuatro dígitos y descarta el sufijo, así que `0006a` y `0006b` salen los dos como id `0006`. `Assert-NoSharedIds` agrupa por ese id y lanza la excepción en cuanto un grupo tiene más de una carpeta. La regla del duplicado se escribió para la secuencia sin sufijos y no contemplaba el histórico que el propio patrón ya acepta para contar el id como ocupado.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Get-NextSddId.ps1`, `tests/Get-NextSddId.Tests.ps1`, fixture `tests/fixtures/task-ids/legacy-suffix/` (carpeta `task-0006b-old-split`)
- **Cambio**: `Assert-NoSharedIds` separa las carpetas con sufijo de letra, las nombra en un aviso por salida de error y comprueba el duplicado solo con las carpetas sin sufijo. El id de las carpetas con sufijo sigue contando como ocupado.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `legacy-suffix` con `0006a` y `0006b`, sin `-Reserve` y con `-Reserve` en un repo | ❌ antes del fix: los dos tests sin id |
| 2 | GREEN: mismos casos → `0007`, código 0, aviso con `0006a` por stderr | ✅ |
| 3 | `duplicate-ids` y `mixed-duplicate` (mismo id sin sufijo) siguen siendo error | ✅ (tests existentes) |
| 4 | Suite completa `tests/Get-NextSddId.Tests.ps1` (agente) y suite rápida del hook de commit | ✅ 47/47 · 794 en verde |

Validación diferida: 2026-09-29 · «Diferir: lo pruebo en el próximo -Reserve del template, a cargo del dev-lead» · disparador: el próximo `Get-NextSddId.ps1 -Reserve` en el proyecto template, a cargo del dev-lead

## 5. Tiempo (ligero)

- Real: 0,3h

## 6. Delta de capacidad

### Capacidad: `feature-ids`

**MODIFIED — El script avisa de un id duplicado y no devuelve ninguno**
- GIVEN un proyecto en modo `sequence` donde dos carpetas de `specs/` distintas llevan el mismo id
- WHEN se invoca `Get-NextSddId.ps1`, con `-Reserve` o sin él
- THEN escribe el id duplicado y las rutas implicadas por salida de error, y no devuelve ningún id por salida estándar
- AND el contador no cambia
- AND las carpetas con sufijo alfabético heredadas (`…-task-0006a-…`, `…-task-0006b-…`) no cuentan como duplicado: el script las nombra en un aviso por salida de error, cuenta su número como ocupado y devuelve el siguiente id libre
