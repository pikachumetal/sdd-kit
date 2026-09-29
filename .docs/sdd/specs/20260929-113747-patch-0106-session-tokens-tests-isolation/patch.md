---
id: 20260929-113747-patch-0106-session-tokens-tests-isolation
task: 0106
title: Patch — los tests «sin -ProjectsRoot» de Measure-SessionTokens leen la salida del hijo en UTF-8
type: patch
status: done
created: 2026-09-29
branch: feature/0106-session-tokens-tests-isolation
commit: <hash>
---

# Patch 0106 — los tests «sin -ProjectsRoot» de Measure-SessionTokens leen la salida del hijo en UTF-8

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/Measure-SessionTokens.Tests.ps1`.

## 1. Síntoma

Dos filas de deuda del roadmap, en un solo patch porque son el mismo fichero de tests:

- «Tres tests `Slow` de `Measure-SessionTokens.Tests.ps1` fallan en la máquina del dev-lead» ([ticket de la feature 0098](../../field-reports/20260928-220334-feature-0098-visual-patch-lane.md) §5): `Invoke-Pester -Path tests` dio 1022/3, los tres del bloque «sin -ProjectsRoot», sobre `develop` limpio y sin `CLAUDE_CONFIG_DIR`. El ticket lo atribuye a que «el test lee el `HOME` real, que en esta máquina tiene varias `~/.claude-*`».
- «Los tests de `Measure-SessionTokens` sin `-ProjectsRoot` fallan desde Git Bash» ([ticket de la feature 0089](../../field-reports/20260927-180811-feature-0089-greenfield-init-template.md) §4): 965/3 desde Git Bash y 968/0 desde PowerShell, por «—» contra «-».

Medido el 2026-09-29 en la máquina del dev-lead, con `~/.claude` y `~/.claude-gco` reales: desde PowerShell, 24/24; desde Git Bash, 21/24, los mismos tres tests:

```text
Expected: '- Tokens del hilo: 3.505.005 - claude-sonnet-5 3.505.005'
But was:  '- Tokens del hilo: 3.505.005 — claude-sonnet-5 3.505.005'
Expected length: 56 · Actual length: 58
```

Difiere de la primera fila en la causa: no es el `HOME`, es la codificación. Las dos filas son el mismo fallo.

## 2. Causa raíz

`Invoke-MeasureFromHome` lanza el script en un `pwsh` hijo y lee su salida con `[Console]::OutputEncoding` del proceso padre. El script fuerza UTF-8 en su salida (`Measure-SessionTokens.ps1:244`). Desde PowerShell, la consola del padre ya es UTF-8. Desde Git Bash no lo es, y el padre decodifica los 3 bytes UTF-8 de «—» como 3 caracteres: la cadena mide 58 en lugar de 56.

La hipótesis del `HOME` real queda descartada con dos pruebas:

- El test ya aísla el `HOME`: pone `USERPROFILE` en una carpeta de `TestDrive`, y el `pwsh` hijo deriva `$HOME` de ella (`USERPROFILE='C:\fakehome' pwsh -Command '$HOME'` imprime `C:\fakehome`).
- Desde PowerShell pasa 24/24 en una máquina con `~/.claude-gco` real.

Los tres fallos del ticket de la 0098 coinciden con los tres de Git Bash. Lo más probable es que esa suite se lanzara desde la herramienta Bash, aunque el ticket no dice el shell.

## 3. Fix

- **Fichero(s)**: `tests/Measure-SessionTokens.Tests.ps1`
- **Cambio**: `Invoke-MeasureFromHome` pone `[Console]::OutputEncoding` en UTF-8 mientras corre el hijo y lo restaura en el `finally`. Es el mismo patrón que ya usa el test «sin carpeta de transcripts…» del bloque «no medido».

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `Invoke-Pester -Path tests/Measure-SessionTokens.Tests.ps1` desde Git Bash (`pwsh -NoProfile -Command …`), antes del fix | ❌ 21/24 (reproducido) |
| 2 | Lo mismo tras el fix, desde Git Bash | ✅ 24/24 |
| 3 | Lo mismo tras el fix, desde PowerShell, con `~/.claude` y `~/.claude-gco` reales | ✅ 24/24 |

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Real: 0,3 h
