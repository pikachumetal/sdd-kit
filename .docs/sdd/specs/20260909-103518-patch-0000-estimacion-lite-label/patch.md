---
id: 20260909-103518-patch-0000-estimacion-lite-label
task: 0000
title: Patch — Build-EstimationLog.ps1 no lee la estimación de un walkthrough lite
type: patch
status: done
created: 2026-09-09
branch: master
commit: e0d6707
---

# Patch 0000 — `Build-EstimationLog.ps1` no lee la estimación de un walkthrough lite

## 1. Síntoma

Al cerrar T8 (primera task en modo lite del kit), el `estimation-log.md` regenerado muestra la fila con estimado vacío:

```
| 2026-09-09 | 0000 | infra/tooling | — | 0.7 | — | 20260909-100606-task-0000-skills-validation |
```

El walkthrough sí lleva la estimación: `- Estimación de implementación (de la spec): 1 h (rango 0,7–1,5)`.

## 2. Causa raíz

`Read-Walkthrough` (`skills/sdd-templates/scripts/Build-EstimationLog.ps1:62`) definía la etiqueta como `Estimaci[oó]n de implementaci[oó]n \(del plan\)|Estimaci[oó]n de implementaci[oó]n|Estimaci[oó]n`, y `Get-FieldText` exige `\**\s*:` justo detrás de la alternativa que casa. Con `(de la spec)` ninguna alternativa llega a los dos puntos: la primera exige el literal `(del plan)`, la segunda y la tercera tropiezan con el paréntesis. Reproducido aislado: `$t -match $p` → `False`. El origen es que `walkthrough-template.md` escribe «(del plan)» y en modo lite no hay plan: el redactor sustituye el paréntesis por lo que corresponde, y el script no lo toleraba.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Build-EstimationLog.ps1`, `tests/Build-EstimationLog.Tests.ps1`, `tests/fixtures/estimation-log/lite/`
- **Cambio**: la etiqueta acepta cualquier paréntesis opcional tras «Estimación de implementación»: `Estimaci[oó]n de implementaci[oó]n(?: \([^)]*\))?|Estimaci[oó]n`. Fixture propia (`lite/`) con la línea real del walkthrough de T8 y test que espera `| 2026-09-15 | 0013 | docs | 1 | 0.5 | 0.5 | … |`. No se toca la plantilla (fix mínimo); queda anotado como sugerencia para T10/T11: el texto de ayuda de `walkthrough-template.md` puede decir «(del plan, o de la spec en lite)».

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: test nuevo sobre la fixture `lite` antes del fix | ✅ verificado por el agente: 26 pass / 1 fail (el nuevo) |
| 2 | GREEN: suite completa tras el fix | ✅ verificado por el agente: 133/133, 5 skipped |
| 3 | Regenerar `.docs/sdd/estimation-log.md` del kit | ✅ verificado por el agente: la fila de T8 pasa a `1 | 0.7 | 0.7` |

## 5. Tiempo (ligero)

- Estimación: — (entró por el cierre de T8, no por planificación)
- Real: ~0,15 h (causa raíz, test, fix, regeneración y cierre)
