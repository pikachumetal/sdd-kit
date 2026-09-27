<#
.SYNOPSIS
  Deriva las etapas c9, p11 y d8 del molde a partir de base y t9, y genera su estimation-log con el script del kit.
#>
param([Parameter(Mandatory)][string]$Kit, [Parameter(Mandatory)][string]$Scratch)
$ErrorActionPreference = 'Stop'
$m = Join-Path $PSScriptRoot 'm'
$utf8 = [System.Text.UTF8Encoding]::new($false)

function Write-Stage([string]$stage, [string]$relative, [string]$text) {
  $target = Join-Path (Join-Path $m $stage) $relative
  New-Item -ItemType Directory -Force (Split-Path $target) | Out-Null
  [IO.File]::WriteAllText($target, $text, $utf8)
}

function Read-Base([string]$relative) { [IO.File]::ReadAllText((Join-Path (Join-Path $m 'base') $relative), $utf8) }

$changelog = Read-Base 'sdd/changelog.md'
$roadmap = Read-Base 'sdd/roadmap.md'
$line0006 = '- Listado de salas libres por franja (`salas libres 10:00-12:00`). [task 0006](specs/20260917-090000-task-0006-free/)'
$row0008 = '| 0008 | Avisos por correo antes de la reserva | `src/notify.js` | 🔄 en curso (worktree `0008`) |'
$row0009 = '| 🔄 en curso |'

$c9Changelog = $changelog.Replace($line0006, "$line0006`n- Validación del formato de la franja horaria en ``libres`` y ``reservar``. [task 0009](specs/20260921-090000-task-0009-slot-format/)")
Write-Stage 'c9' 'sdd/changelog.md' $c9Changelog
Write-Stage 'c9' 'sdd/roadmap.md' $roadmap.Replace($row0009, '| ✅ |')

$fixLine = '- La cancelación ya no borra reservas de otro día con la misma hora. [patch 0007](specs/20260918-090000-patch-0007-cancel/)'
Write-Stage 'p11' 'sdd/changelog.md' $changelog.Replace($fixLine, "$fixLine`n- ``cancelar`` sin hora pide el uso en vez de responder ``cancelada mar undefined``. [patch 0011](specs/20260923-080000-patch-0011-cancel-usage/)")
Write-Stage 'p11' 'sdd/roadmap.md' $roadmap.Replace('| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |', "| 2026-09-18 | 0007 | La cancelación borraba reservas de otro día con la misma hora |`n| 2026-09-23 | 0011 | ``cancelar`` sin hora respondía ``cancelada mar undefined`` |")
$app = Read-Base 'src/app.js'
Write-Stage 'p11' 'src/app.js' $app.Replace("  if (cmd === 'cancelar') return ``cancelada `${params[0]} `${params[1]}``;", "  if (cmd === 'cancelar') return params[1] ? ``cancelada `${params[0]} `${params[1]}`` : 'Uso: cancelar <día> <HH:MM>';")
$tests = Read-Base 'test/app.test.js'
Write-Stage 'p11' 'test/app.test.js' ($tests + "`ntest('cancelar sin hora pide el uso', () => {`n  assert.equal(run('cancelar', ['mar']), 'Uso: cancelar <día> <HH:MM>');`n});`n")
Write-Stage 'p11' 'sdd/specs/20260923-080000-patch-0011-cancel-usage/patch.md' @'
---
id: 20260923-080000-patch-0011-cancel-usage
task: 0011
branch: feature/0011
commit: (el del fix en feature/0011)
---

# Patch — cancelar sin hora

## 1. Síntoma

`salas cancelar mar` respondía `cancelada mar undefined`.

## 2. Causa raíz

`run` no comprobaba que llegara la hora.

## 3. Fix

`cancelar` sin hora devuelve `Uso: cancelar <día> <HH:MM>`. Test de regresión en `test/app.test.js`.

## 4. Verificación

| Caso | Antes | Ahora | Por |
| --- | --- | --- | --- |
| `salas cancelar mar` | `cancelada mar undefined` | `Uso: cancelar <día> <HH:MM>` | agente, ejecución real |

Suite: `node --test`, 6/6.

## 5. Tiempo

- Esfuerzo real: 0,3h
'@

Write-Stage 'd8' 'src/notify.js' "export function notify(booking) {`n  return ``Aviso: reserva de `${booking.room} a las `${booking.slot}``;`n}`n"
Write-Stage 'd8' 'sdd/specs/20260920-090000-task-0008-notify/walkthrough.md' @'
# Walkthrough — Avisos por correo

Implementado, smoke ejecutado y validado por el dev-lead. Suite verde.

## 2. Tiempo y coste: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 2,5h
'@
Write-Stage 'd8' 'sdd/changelog.md' $changelog.Replace($line0006, "$line0006`n- Aviso por correo antes de cada reserva. [task 0008](specs/20260920-090000-task-0008-notify/)")
Write-Stage 'd8' 'sdd/roadmap.md' $roadmap.Replace($row0008, '| 0008 | Avisos por correo antes de la reserva | `src/notify.js` | ✅ |')

$script = Join-Path $Kit 'skills/sdd-templates/scripts/Build-EstimationLog.ps1'
foreach ($variant in @(@{ Stage = 'c9'; Layers = 'base', 't9', 'c9' }, @{ Stage = 'p11'; Layers = 'base', 'p11' }, @{ Stage = 'd8'; Layers = 'base', 'd8' })) {
  $tmp = Join-Path $Scratch "elog-$($variant.Stage)"
  if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
  New-Item -ItemType Directory -Force (Join-Path $tmp '.docs') | Out-Null
  foreach ($layer in $variant.Layers) {
    $sddLayer = Join-Path (Join-Path $m $layer) 'sdd'
    if (Test-Path $sddLayer) { Copy-Item -Recurse -Force $sddLayer (Join-Path $tmp '.docs') }
  }
  & pwsh -NoProfile -File $script -Root $tmp | Out-Null
  Write-Stage $variant.Stage 'sdd/estimation-log.md' ([IO.File]::ReadAllText((Join-Path $tmp '.docs/sdd/estimation-log.md'), $utf8))
}
