---
status: accepted
date: 2026-11-05
rutas:
  - skills/sdd-propose/references/review-spec.md
  - skills/sdd-propose/SKILL.md
  - skills/sdd-implement/references/patch-flow.md
---

# La review de spec no es opcional: la rúbrica decide cuántos revisores

## Contexto y problema

Desde la feature 0040, la rúbrica de `review-spec.md` contaba señales y proponía «ninguna» por defecto: con 0 a 3 señales, una spec full llegaba al gate sin que nadie más la leyera, y en lite y en patch no había review. El [ticket de la feature 0302](../field-reports/20261104-102149-feature-0302-annotated-copies.md) §1 lo vio en campo: la review que pidió el dev-lead encontró lo que la rúbrica había dejado pasar, con dos señales. El dev-lead, al pedir la 0306 (2026-11-04): «lite y patch minimo tendriamos que levantar uno en sonnet».

## Opciones consideradas

- Mantener «ninguna» por defecto y bajar el umbral de señales: sigue habiendo specs full sin lector, y el umbral solo mueve el sitio donde se cuela el fallo.
- La review siempre, y la rúbrica decide cuántos revisores (elegida).

## Decisión

En full, dos revisores (dominio y técnica) sin preguntar si se hace; un Scope de menos de ~50 líneas sin contrato público ni `MODIFIED` baja a un revisor con los siete puntos, nunca a ninguno. En lite, un revisor en Sonnet. Un patch lleva un revisor en Sonnet antes del commit del fix (`patch-flow.md` de `sdd-implement`). Un spike y un cambio de config no llevan review. Un Crítico aceptado o la decisión central reescrita abre una segunda ronda en Sonnet, sin tercera. La única forma de no tener review es que el dev-lead la quite con su frase, que se registra.

### Consecuencias

- Cada spec paga al menos un revisor (~1-3 $ en full con dos), y el gate llega con los hallazgos incorporados.
- La pregunta «¿hago review?» desaparece de `delegate`; con paralelismo restringido, una spec delegada va a un revisor sin preguntar.
- Volver a «ninguna» por defecto es una ADR nueva, no un cambio de rúbrica.

### Confirmación

La batería de `sdd-propose`: `rv1` (dos revisores en full), `rv2` (un revisor con Scope pequeño), `rv3` (paralelismo restringido), `lr1` (lite en Sonnet), `rr1` (segunda ronda), `pr1` (revisor del patch antes del commit) y las filas NR (spike, config y «sin review») de `tests/batteries/sdd-propose/battery.md`.
