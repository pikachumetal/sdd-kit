---
id: 20260922-135640-patch-0027-script-arranque
task: 0027
title: Patch — las sesiones del repo arrancan con las skills del working tree
type: patch
status: done
created: 2026-09-22
branch: feature/0027
commit: e0580d5
---

# Patch 0027 — las sesiones del repo arrancan con las skills del working tree

## 1. Síntoma

Del dev-lead: «en este repo, las sesiones cargan las skills del plugin publicado (caché 1.1.0) y no las de la rama. Ya van cinco reportes (tickets 0003, 0004, 0013, 0005 y patch 0024); en el último, la skill de la caché habría nombrado la carpeta del patch como patch-0000 y rompido la secuencia de ids». La regla 2 del `CLAUDE.md` lo evita solo si el agente se acuerda de comparar en cada paso.

## 2. Causa raíz

El `.claude/settings.json` del repo declara `enabledPlugins: {"sdd-kit@sdd-kit": true}` y, desde el patch 0024, la fuente `github` del marketplace. Una sesión lanzada con `claude` a secas carga por tanto el plugin publicado desde `~/.claude/plugins/cache/sdd-kit/sdd-kit/1.1.0/`, no `skills/` de la rama. La receta que lo corrige (`--settings` que deshabilita el plugin + `--plugin-dir`) estaba escrita en la regla 2 como «mejor aún» y marcada «en sesión interactiva está por comprobar», así que no era la forma de arrancar.

Evidencia (sesiones interactivas reales en terminales de Orca, Claude Code 2.1.278, pidiendo invocar `sdd-kit:sdd-templates` y copiar la línea `Base directory`):

- Sin script (`claude`): `C:\Users\pikac\.claude\plugins\cache\sdd-kit\sdd-kit\1.1.0\skills\sdd-templates`.
- Con script (`./Start-KitSession.ps1`): `D:\code\.worktrees\sdd-kit\script-arranque\skills\sdd-templates`.

Base comprobada: la rama sale de `develop` en `2fb5b37`, que ya lleva el `CLAUDE.md` y el `.claude/settings.json` cambiados hoy (reglas 6 y patch 0024).

## 3. Fix

- **Fichero(s)**: `Start-KitSession.ps1` (nuevo), `CLAUDE.md`, `README.md`
- **Cambio**: el script lanza `claude --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir $PSScriptRoot @args`; usa `$PSScriptRoot` en vez de `.` para que funcione aunque se invoque desde otra carpeta. El `CLAUDE.md` abre con «Arranca las sesiones de este repo con `./Start-KitSession.ps1`» y la regla 2 cita el script en lugar de la receta, deja el contraste con `skills/<nombre>/SKILL.md` como red para sesiones que no salieron del script y cuenta los cinco reportes. La sección «Desarrollo» del README cita también el script, para no tener la receta repetida en dos sitios. El id 0027 es el de la rama: `Get-NextSddId.ps1` devuelve 0028 porque ya cuenta `feature/0027`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Sesión interactiva con el script: `Base directory` de una skill del kit | ✅ agente: apunta a `…\script-arranque\skills\sdd-templates` |
| 2 | Sesión interactiva sin script (control) | ✅ agente: apunta a la caché `…\plugins\cache\sdd-kit\sdd-kit\1.1.0\…` (reproduce el síntoma) |
| 3 | Con el script, el plugin publicado no se cuela duplicado | ✅ agente: `sdd-kit:sdd-start-patch` aparece una vez, con la description de la rama («hay un bug…, arréglalo», que la 1.1.0 no lleva) |
| 4 | Los argumentos extra llegan a `claude` | ✅ agente: `./Start-KitSession.ps1 --version` → `2.1.278 (Claude Code)` |
| 5 | Suite completa `Invoke-Pester -Path tests` | ✅ agente: 291 pasan, 0 fallan, 6 skipped |
| 6 | Arranque desde el terminal propio del dev-lead | diferido por el dev-lead al uso diario: «ya sabe sdd-kit se prueba en el dida a dia en el uso» |

## 5. Tiempo (ligero)

- Estimación: 0,25h
- Real: 0,4h
