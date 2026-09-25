# Tasks — sdd-roadmap, una sola puerta de entrada al roadmap (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `Get-NextSddId.ps1` reconoce el carril `proposal` | done | `196d46b` | `Build-EstimationLog.ps1` ya ignora las propuestas: nada para la 0068 |
| 2 | Plantilla de la propuesta y carril `proposal` en las plantillas | done | `6fd3a98` | |
| 3 | Skill `sdd-roadmap` y entrada por el router | done | `ff2d592` | nació como `sdd-plan`; renombrada en `cda449d` |
| 4 | Retirada de `sdd-start-release` | done | `41f99a5` | freno de alcance antes: develop integrado en `b8e7312` (enmienda `247561e`) |
| 5 | Renombrar la rama sin id tras reservar | done | `debb31f` | |
| 6 | GREEN | done | `4c0d835` | 22 sujetos, 5,99 $; sin REFACTOR con el nombre `sdd-plan` |

Revisión final: general-purpose + opus, con cambios (2 Important corregidos en `3180924` y verificados con p11 ×2; 6 Minor diferidos)
REFACTOR tras el renombrado: salida a sdd-roadmap en el paso 2 de sdd-start-task (`e68cd50`), verificada con p10 ×2 y p2 ×1
Renombrado `sdd-plan` → `sdd-roadmap`: `cda449d` (enmienda de la spec); enrutado medido de nuevo con 4 sujetos
Revisión del tramo tras la revisión final (renombrado + REFACTOR): general-purpose + opus, con cambios (1 Important corregido en `a2889e2`, otro verificado con p7 en `cf95a79`; 5 Minor diferidos)
Revisión de skills del proyecto: este repo no tiene `.claude/skills/` (mirado en el cierre); las skills del kit que cambia esta task son las de `skills/`
