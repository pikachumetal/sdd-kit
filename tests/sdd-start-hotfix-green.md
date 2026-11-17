# Evidencia GREEN — sdd-start-hotfix (2026-07-09)

Mismo escenario que el RED baseline 2 (ticket 231, bug mal diagnosticado por operaciones), mismo prompt, con la skill cargada. Sonnet, fixture limpia.

- ✅ **Causa raíz por la skill, no por config personal**: invocó `systematic-debugging` citando el paso obligatorio de `sdd-start-hotfix` (el RED dependía del CLAUDE.md global del tester).
- ✅ **Hipótesis del reporte descartada con evidencia**: grep de `Customer|Tipo|Segment|Tier` por todo el repo antes de decidir; no implementó lógica de tipo de cliente. Causa real: off-by-one en la condición del descuento.
- ✅ **Ubicación y naming corregidos**: `.docs/sdd/specs/20260709-120306-hotfix-231-descuento-100-euros/` — sin carpeta `hotfixes/` inventada, prefijo `hotfix-` + id de ticket + timestamp UTC real.
- ✅ **hotfix.md completo**: síntoma literal, causa con evidencia, fix, verificación (pendientes honestos por falta de compilador), tiempo.
- ✅ **Criterio de carril evaluado explícitamente**: "defecto determinista… encaja en el criterio de hotfix y no de task".
- ✅ **Separación de responsabilidades**: no tocó `roadmap.md` — reconoció que el cierre pertenece a `sdd-end-hotfix` (no cargada) en vez de fabricar pasos.

## Veredicto

Validada al primer intento contra los dos baselines RED. Sin racionalizaciones nuevas → sin REFACTOR.
