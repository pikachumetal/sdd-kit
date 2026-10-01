---
id: 20260930-174818-patch-0126-merge-verify-output
task: 0126
title: Patch — El fallo de -VerifyCommand cita el log y la cola de la salida del gate
type: patch
status: done
created: 2026-09-30
branch: feature/0126-merge-verify-output
commit: 7000b3dc
---

# Patch 0126 — El fallo de -VerifyCommand cita el log y la cola de la salida del gate

## Capacidades

- Ninguna, porque ninguna capacidad describe el mensaje de error de `-VerifyCommand` en `Invoke-SddMerge.ps1`.

## 1. Síntoma

Fila de deuda del roadmap «Un rojo ajeno se investiga antes de mirar la deuda del proyecto», solo la pieza decidida por el dev-lead el 2026-09-30 ([ticket de la feature 0038 de document-manager](../../field-reports/20260930-115335-feature-0038-estado-vacio-explorador.md) §2): con `-VerifyCommand` el error es solo `verificación: código de salida <n>.`, sin la salida del gate, y el agente relanzó el script para verla, contra la receta. El resto de la fila (la base en rojo, el rojo ajeno) no entra.

Medido con el test nuevo de `tests/Invoke-SddMerge.Tests.ps1` antes del fix (`-VerifyCommand "Write-Output 'Tests Failed: 3'; exit 1"`): la salida del gate sale suelta por stdout **antes** del error, y el error solo dice `verificación: código de salida 1.`. Con una suite larga, esa salida se pierde entre el resto o la trunca quien lee el comando; el worktree temporal `merge-<id>` se retira al fallar, así que no queda nada que mirar.

## 2. Causa raíz

`skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, `Invoke-Verification`: ejecuta `& pwsh -NoProfile -Command $Command` sin capturar su salida y lanza `throw "verificación: código de salida $LASTEXITCODE."`. El rechazo del hook `pre-merge-commit` (`Complete-MergeAttempt`) sí guarda la salida de git y cita sus últimas 20 líneas en el mensaje; la verificación nunca se alineó con él.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`
  - `tests/Invoke-SddMerge.Tests.ps1`
- **Cambio**: la salida del gate (stdout y stderr) se sigue viendo en consola y además se guarda con `Tee-Object` en `%TEMP%\sdd-merge-verify-<yyyyMMdd-HHmmss>-<pid>.log`, fuera del worktree temporal. Si falla, el mensaje es `verificación: código de salida <n>; salida completa en <ruta>` seguido de sus últimas 20 líneas, como el del hook; si pasa, el log se borra.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test nuevo antes del fix: el mensaje cita la ruta del log y la cola | ❌ como se esperaba: solo `código de salida 1.` |
| 2 | `tests/Invoke-SddMerge.Tests.ps1` tras el fix | ✅ 22/22 |
| 3 | suite completa desde PowerShell (`Invoke-Pester -Path tests`) | ✅ 1132 pasan, 0 fallan, 10 saltados |

Los casos 1 a 3 los verificó el agente.

Validación diferida: 2026-09-30 · «Diferir: lo pruebo en el próximo cierre con -VerifyCommand en rojo, a cargo del dev-lead» · disparador: el próximo cierre con `-VerifyCommand` en rojo, a cargo del dev-lead

Validación en campo: 2026-10-01 · adenda: este repo pasa a `validation.mode: field` con la feature 0118 (decisión del dev-lead del 2026-09-29); vale la verificación del agente de la tabla de arriba

## 5. Tiempo (ligero)

- Real: 0,5h
