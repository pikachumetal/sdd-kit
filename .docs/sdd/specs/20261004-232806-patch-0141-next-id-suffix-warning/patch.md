---
id: 20261004-232806-patch-0141-next-id-suffix-warning
task: 0141
title: Patch — Get-NextSddId.ps1 avisa de las carpetas con sufijo sin formato de error
type: patch
solution: dev-lead
status: done
created: 2026-10-05
branch: hotfix/v2.3.2
commit: <hash>
---

# Patch 0141 — Get-NextSddId.ps1 avisa de las carpetas con sufijo sin formato de error

## Capacidades

- Ninguna, porque el fix devuelve `Get-NextSddId.ps1` a lo que ya dice `feature-ids`: «el script las nombra en un aviso por salida de error, cuenta su número como ocupado y devuelve el siguiente id libre»

## 1. Síntoma

Ticket del patch 0057 de un proyecto (`field-reports/20261004-225436-patch-0057-keep-app-base-href.md`, menores, en `develop`): «`Get-NextSddId.ps1 -Reserve` imprime `Assert-NoSharedIds` con formato de error (carpetas con sufijo anteriores a la secuencia) aunque reserva bien».

## 2. Solución fijada

Dev-lead, 2026-10-05: «Que lo diga como aviso, o que no lo diga si no afecta a la reserva.»

Lo que da por existente, comprobado con el fixture `tests/fixtures/task-ids/legacy-suffix` en un repo temporal: `-Reserve` devuelve `0007` y sale con 0, y por stderr sale el registro de error de PowerShell, con `Assert-NoSharedIds: <ruta>:173`, el marco `Line |` y el subrayado `~~~~`. Viene de `Write-Error … -ErrorAction Continue` en `Assert-NoSharedIds`.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Get-NextSddId.ps1`
  - `tests/Get-NextSddId.Tests.ps1`
- **Cambio**: `Assert-NoSharedIds` escribe una línea por stderr con `[Console]::Error.WriteLine`: `aviso: carpetas con sufijo anteriores a la secuencia (su número cuenta como ocupado): <carpetas>.`, en lugar de `Write-Error`.
- **Decisiones**:
  - Aviso y no silencio: la capacidad `feature-ids` ya dice que el script las nombra en un aviso por salida de error, y callarlo sería otro cambio de comportamiento — sin el dev-lead (la petición deja elegir)
  - Por stderr y no con `Write-Warning`: stdout lleva solo el id, que leen las skills — sin el dev-lead
  - El otro `Write-Error … -ErrorAction Continue` del script («Se omiten las ramas…») tiene el mismo formato y no se toca: el ticket no lo reporta (sin refactor oportunista) — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `-Reserve` con `task-0006a` y `task-0006b` | ❌ antes: stderr con el marco de error · ✅ ahora: una línea `aviso: …` con las dos carpetas |
| 2 | la reserva no cambia | ✅ `0007`, sale con 0 |
| 3 | `tests/Get-NextSddId.Tests.ps1` | ✅ 49/0 |

Los casos los verificó el agente.

## 5. Tiempo (ligero)

- Real: 0,2h
