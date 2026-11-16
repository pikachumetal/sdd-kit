---
status: accepted
date: 2026-10-07
rutas:
  - skills/**
  - tests/**
---

# Pruebas de skills por batería y humo

## Contexto y problema

Desde la 0.1.0 el Art. I exigía, para toda skill nueva o editada, una campaña RED (baseline sin la skill, con racionalizaciones textuales) → GREEN (mismos escenarios con la skill) → cierre de huecos, documentada en `tests/<skill>-red.md` y `-green.md`. La regla fue creciendo con cada fallo:

- **A/B de no-regresión** para recortes (2026-09-07): una versión recortada puede batir al baseline vacío y ser peor que la vigente; control contra tratamiento en `tests/<skill>-ab.md`.
- **Fuente incidental** (task 0059): un baseline limpio puede salir de algo que el sujeto leyó por azar; con un sujeto por escenario, 3/3 limpio, con uno más, 1/6.
- **El recorte quita la guía, no la medición** (task 0008): el requisito recortado falló 1/2 en el GREEN (dev-lead, 2026-09-22).
- **Campaña dimensionada y previsión de coste con techo** (tasks 0039 y 0040): la 0040 gastó ~3,5 h, 44 sujetos y 15,29 $ en ~30 min de texto sin que nadie avisara (dev-lead, 2026-09-23).
- **El GREEN mide lo que el RED ya cumplía** (task 0067: el paso vecino cayó de 4/4 a 1/4 con la evidencia diciendo «sin regresión»; task 0061: sujeto de control tras editar después del GREEN).
- **Una pieza entra, otra sale**, con topes de palabras en `tests/WordBudget.Tests.ps1` (feature 0120, 2026-10-01: 52.000 palabras en `skills/` y ningún freno).
- **Renombrar es editar** (task 0062: con `sdd-plan` 2/2 sujetos llegaban, con `sdd-roadmap` 0/1; una regla de la skill retirada quedó sin destino).
- **La previsión cuenta todo lo que el agente ejecuta** (task 0073: un paso nuevo de una migración solo tenía test estático).

La feature 0120 introdujo las baterías por skill (`tests/batteries/<skill>/`). El 2026-09-29, tras cruzar 66 filas 🧪 sin ninguna validada a mano, el dev-lead decidió que el kit se valida en uso (feature 0118), y en el lienzo 0131 que la campaña por edición encarece cada cambio más de lo que paga.

## Opciones consideradas

- Mantener la campaña RED/GREEN completa por edición y el A/B obligatorio en todo recorte.
- Batería completa solo en las skills donde un fallo cuesta más (entrada, propose, verify, archive), humo en el resto y A/B puntual.
- Solo validación en campo, sin pruebas previas.

## Decisión

Batería completa en las skills de entrada, propose, verify y archive; humo (1-2 escenarios, n = 1) en todas; antes de cada release, las dos. A/B solo ante una duda concreta. Cada fallo de campo pasa a escenario. La guidance nueva sigue necesitando un test que falle antes. Se quedan la previsión de coste con techo, «una pieza entra, otra sale» y «renombrar es editar». Mientras no existan las skills de propose, verify y archive (0146-0149), la skill que se escribe nace con su batería, y una edición de una skill de la 2.3.x lleva el tramo de su batería si la tiene y, si no, humo.

### Consecuencias

- Sale como regla el A/B obligatorio en todo recorte.
- Los matices de campaña (fuente incidental, el recorte no quita la medición, conductas vecinas como escenarios de control, el sujeto de control tras editar una guía ya medida) pasan a método en `tech-stack.md` §Baterías por skill; la previsión que lista cada paso se queda en el artículo, porque la comprueba la lente técnica de la review de spec.
- Una skill sin batería (las de humo) puede regresar en un paso que nadie mide; lo recoge el campo.

### Confirmación

`tests/headless/battery.sh` da el veredicto por escenario; `tests/WordBudget.Tests.ps1` fija los topes. Que cada edición lleve su batería o su humo lo comprueba la revisión final.
