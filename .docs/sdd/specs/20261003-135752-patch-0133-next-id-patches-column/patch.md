---
id: 20261003-135752-patch-0133-next-id-patches-column
task: 0133
title: Patch — Get-NextSddId.ps1 lee el id de la tabla de Patches
type: patch
solution: causa raíz
status: done
created: 2026-10-03
branch: hotfix/v2.3.1
commit: 868c98e5
---

# Patch 0133 — Get-NextSddId.ps1 lee el id de la tabla de Patches

## Capacidades

- Modificadas: `feature-ids` — cambia «Contrato de lectura del roadmap»: el id de la tabla de Patches, en la segunda columna, también cuenta

## 1. Síntoma

Fila de deuda del roadmap «`Get-NextSddId.ps1` no lee el id de la tabla de Patches» ([walkthrough de la 0117](../20261001-153446-feature-0117-patch-lane-fixed-solution/walkthrough.md) §4.3, 2026-10-01; el walkthrough está en `develop`): 3 sujetos del GREEN de la 0117 recibieron el 0011, ya usado en la tabla de Patches, y reservaron otro.

Medido sobre `main` (2.3.0): un proyecto en `sequence` cuyo roadmap solo tiene `| 2026-10-01 | 0011 | algo |` en «Patches», sin carpeta en `specs/`, recibe `0001` en vez de `0012`.

## 2. Causa raíz

`skills/sdd-templates/scripts/Get-NextSddId.ps1`, `Get-RoadmapLineIds`: el patrón `^\|\s*(\d{4})\s*\|` solo reconoce el id en la primera columna. `roadmap-template.md` pone en «Patches» la cabecera `| Fecha | Id | Descripción |`: la primera columna es una fecha y el id va en la segunda, así que ninguna fila de esa tabla cuenta. En campo lo tapa el escaneo de `specs/`, que encuentra la carpeta del patch; sin carpeta (un patch cuya carpeta está en otra rama o se borró), el id sale otra vez.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Get-NextSddId.ps1`
  - `tests/Get-NextSddId.Tests.ps1`
  - `.docs/sdd/capabilities/feature-ids.md` (fusión del delta, en el cierre)
- **Cambio**: el patrón acepta una fecha `AAAA-MM-DD` opcional como primera columna y toma el id de la siguiente: `^\|\s*(?:\d{4}-\d{2}-\d{2}\s*\|\s*)?(\d{4})\s*\|`. Una fecha suelta en otra columna, una versión o una cantidad siguen sin contar.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test nuevo antes del fix: roadmap con `0011` solo en «Patches» → `0012` | ❌ como se esperaba: `0001` |
| 2 | `tests/Get-NextSddId.Tests.ps1` y `tests/TaskIds.Tests.ps1` tras el fix | ✅ 66/66 |

Los casos los verificó el agente.

Validación en campo: 2026-10-03 · test nuevo en RED antes del fix y 66/66 tras él · pre-commit 949/0

## 5. Tiempo (ligero)

- Real: 0,3h

## 6. Delta de capacidad

### Capacidad: `feature-ids`

**Reglas de la capacidad**
- **Contrato de lectura del roadmap**: el script reconoce un id en la primera columna de una fila de tabla (`| 0001 |`), en la segunda si la primera es una fecha (`| 2026-10-01 | 0001 |`, la forma de la tabla de Patches), en los nombres de artefacto (`feature-<id>-`, `task-<id>-`, `patch-<id>-`, `proposal-<id>-`) y en un segmento del nombre de rama (`feature/0001`, `hotfix/0001-slug`). Cualquier otra aparición de cuatro dígitos (fechas, versiones) no cuenta.
