# GREEN — Review Focus del plan (feature 0113)

Kit en `dc5683b5` (plantilla con `## Review Focus` y encargo del revisor final con su copia literal), superpowers 6.4.2. Mismos escenarios y molde que el [RED](plan-review-focus-red.md), con el mismo [subject.sh](../.docs/sdd/specs/20260929-170930-feature-0113-plan-review-focus/red/subject.sh); salidas en [`green/out/`](../.docs/sdd/specs/20260929-170930-feature-0113-plan-review-focus/green/out/). Solo Opus 5.5, el modelo en el que el RED falla.

- Cuatro sujetos (3,90 $) y uno de control tras la pasada de fix de la revisión final (r-3, con el kit en `e4451c29`, 0,89 $).
- La campaña entera suma 15 sujetos y 12,03 $. El techo de la spec era de 14 sujetos y 16 $; el dev-lead aprobó el sujeto 15.
- p va con dos sujetos; e y r, con uno cada uno en la primera medida, porque el RED con Opus gastó 4 sujetos del techo.
- No hay r-1: la segunda tanda lanzó p y r con el número 2.

## Resultados

| Medida | RED (Opus) | GREEN (Opus) |
| --- | --- | --- |
| p: `## Review Focus` entre «Restricciones globales» y «Phase -1» | 1/2 | **2/2** |
| p: «Decisiones que he tomado yo» lo resume en una línea | 0/2 (0/4 contando Sonnet) | **2/2** — «Review Focus: 5 entradas que la spec no fija…» |
| p: cada línea nombra su task y su test | 2/2 | **2/2** (5 de 5 líneas en los dos) |
| p: fila del Review Focus en el self-review §4 | 1/2 (p-3, con su «§1.10») | **2/2 con una fila agregada** («Review Focus → Task 1, `A`, `B`…»); **0/2 con una fila por línea**, que es la forma de la plantilla |
| r: el encargo del revisor final lleva el Review Focus literal | 1/2 | **2/2** — r-2 (`dc5683b5`) y r-3 (`e4451c29`, tras la pasada de fix, con «el test o la verificación que la fija»): sección `## Review Focus` tras «Cómo revisar», con las dos líneas |

## Controles (Art. I: lo que el RED ya cumplía)

| Control | Resultado |
| --- | --- |
| p: los tests de los THEN siguen en «Tests RED» de su task | 2/2 |
| p: el plan no copia cuerpos que la firma y los tests fijan (patch 0082) | 2/2 — p-1 sin bloques de código; p-2 con dos bloques de asserts como código |
| e: el hilo escribe el test de la línea del Review Focus que no está en «Tests RED» (Task 2 cancelada), uno por THEN, sin commitear | 1/1 — `Rejects_unknown_status_with_400`; `HEAD` sin cambios y los tests sin commitear |
| r: el encargo mantiene «Restricciones de código» y «Cómo revisar» | 2/2 |

## Notas

- La primera línea del Review Focus de p-1 coincide con el ejemplo de la plantilla (`status=Foo` → 400 … `Rejects_unknown_status`). El molde es justo el dominio del ejemplo, así que aquí la línea es correcta y no demuestra copia. p-2, con el mismo molde, escribe sus propias líneas. Queda como minor diferido de la revisión final (el ejemplo va fuera del placeholder).
- La fila del §4 sale agregada en los dos planes: nombra los tests, pero no va una por línea, como pide la plantilla. Mejora frente al RED, donde no se nombraban los tests. No cambia lo que recibe el revisor final, que es la sección entera. Queda como deuda: medir si hace falta la forma por línea.
