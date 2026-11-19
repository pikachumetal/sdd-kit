---
status: accepted
date: 2026-11-19
rutas:
  - skills/sdd-spec-review/**
  - skills/sdd-propose/SKILL.md
  - skills/sdd-implement/references/patch-flow.md
---

# La review de spec no es opcional: la rúbrica decide cuántos revisores, en `sdd-spec-review`

## Contexto y problema

La [ADR 0024](0024-spec-review-always-on.md) decide que la review de spec no es opcional y que la rúbrica decide cuántos revisores, y sus `rutas` nombran `skills/sdd-propose/references/review-spec.md`, que la feature 0359 lleva a la skill de fase `sdd-spec-review`. Desde entonces `sdd decision index --files` ya no ofrece la 0024 a quien toca la rúbrica, y una ADR no se edita.

## Opciones consideradas

- Editar las `rutas` de la 0024: rompe la regla de que una ADR solo cambia su `status` (`architecture.md`, tabla de documentos).
- Una ADR nueva con la misma decisión y las `rutas` de hoy, que sustituye a la 0024 (elegida), como hizo la 3.0.0 con las 0027 a 0033.

## Decisión

Se mantiene la decisión de la 0024, entera: en full, dos revisores (dominio y técnica) sin preguntar si se hace; un Scope de menos de ~50 líneas sin contrato público ni `MODIFIED` baja a un revisor con los siete puntos, nunca a ninguno. En lite, un revisor en Sonnet. Un patch lleva un revisor en Sonnet antes del commit del fix. Un spike y un cambio de config no llevan review. Un Crítico aceptado o la decisión central reescrita abre una segunda ronda en Sonnet, sin tercera. La única forma de no tener review es que el dev-lead la quite con su frase, que se registra. Esta ADR sustituye a la 0024 (dev-lead, 2026-11-19: «1», a «ADR nuevas»).

### Consecuencias

- Las de la 0024, sin cambio.
- Quien toca `skills/sdd-spec-review/` recibe esta ADR de `sdd decision index --files`.

### Confirmación

La batería de `sdd-propose`: `rv1`, `rv2`, `rv3`, `rq1`, `lr1`, `rr1`, `pr1` y las filas NR de `tests/batteries/sdd-propose/battery.md`.
