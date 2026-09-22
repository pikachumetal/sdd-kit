---
id: 20260921-162234-task-0008-control-profiles
title: Tasks — Perfiles de control y gates
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Perfiles de control y gates (registro vivo)

- **Spec**: `./spec.md` (aprobada 2026-09-21: «Apruebo la spec»)
- **Plan**: `./plan.md` (aprobado 2026-09-21: «1, pero podemos bajar lo de una task un review, se pueden agrupar los reviews?»)
- **Rama**: `feature/0008`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Campaña RED | done | `3473e25`, `973b1e0` | Nueve sujetos (4,14 $; E4-1 inválido por permisos y relanzado). E1, E4 y E5 fallan 2/2; E3 pasa 2/2 y recorta la aprobación explícita, reaprobado por el dev-lead: «Apruebo el recorte» |
| 2 | Guía de arranque y ejecución | done | `aca90a2` | Implementador Sonnet (effort high declarado en el encargo), ~222k tokens. Su concern (cambios ajenos en `green/`) eran los moldes del GREEN que preparaba el controlador. Revisión: agrupada |
| 3 | Cierre, plantillas, release y migración | done | `95736c0` | Implementador Sonnet, ~188k tokens. Ruling: la conducta de las 🧪 va al paso 6 de `sdd-end-release`, porque la skill no tiene paso «smoke». Revisión: agrupada |
| 2b | Propuesta de partir una task grande (enmienda) | done | `a9788cb` | Enmienda aprobada por el dev-lead: «Enmienda en la 0008». RED E11 falla 2/2 con un solo tema. Implementador Sonnet, ~131k tokens |
| — | Revisión agrupada de 2, 3 y 2b | done | `176e680` | Sonnet, ~222k tokens. Un Important (`review-spec.md` §3 decía «si el usuario activa», que choca con `unattended`), corregido en una ronda por el implementador de la Task 2; re-revisión limpia. Un Minor diferido (sin frase para la no-respuesta a la pregunta de review) |
| 4 | Campaña GREEN | pending | | |

## Verificación por task

- [x] Task 1 — `tests/control-profiles-red.md`, artefactos en `red/`; `red/ControlProfiles.Tests.ps1` 0/12
- [ ] Task 2 — `Invoke-Pester tests` verde con el primer bloque de `tests/ControlProfiles.Tests.ps1`
- [ ] Task 3 — `Invoke-Pester tests` verde con los dos bloques
- [x] Task 2 — suite 221/0
- [x] Task 3 — suite 227/0
- [x] Task 2b — suite 228/0 con `TaskSplit` movido
- [x] Revisión agrupada de las Tasks 2, 3 y 2b — limpia tras una ronda
- [ ] Task 4 — `tests/control-profiles-green.md`, artefactos en `green/`

## Desviaciones

- El tool `Agent` no expone effort: se declara en el encargo (desviación ya conocida).
