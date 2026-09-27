# Evidencia GREEN — review de spec con lentes sin solape (2026-09-21)

Verificación de la [task 0011](../.docs/sdd/specs/20260920-220930-task-0011-spec-review-lenses/spec.md) con el `review-spec.md` reescrito (commits `62f49f5` y `ddba5e0`). Mismos escenarios que [el RED](spec-review-lenses-red.md), mismos defectos plantados, mismo modelo (Sonnet vía subagente `general-purpose`).

**Cambio de condición respecto al RED**: los cinco sujetos corren sobre `fixture-no-rule` —el fixture Ledgerly **sin** el artículo de datos ficticios—, que es la condición en la que el RED falló (E3b) y la que reproduce la constitution real del kit. Los ocho defectos plantados son idénticos; lo único que cambia es que el nombre real no está prohibido por escrito en el proyecto del fixture.

**Corrección de método aplicada antes de medir**: el primer borrador del ejemplo de §2 usaba el dominio de la propia fixture (cancelación tras el envío, `cancel_reason`, export a logística), así que le habría dado la respuesta literal a los sujetos de propuesta. Se movió a un caso de facturación (`ddba5e0`) antes de lanzar el GREEN. Sin ese cambio, E2 no habría medido nada.

## E1 — ¿desaparece el solape entre lentes? (2 sujetos: una lente cada uno, encargo repartido)

Dominio (puntos 1, 3, 5, 5 bis, 7): 10 hallazgos. Técnica (puntos 2, 4, 6): 10 hallazgos. Total 20.

| Comprobación | RED (encargo vigente) | GREEN (encargo repartido) |
| --- | --- | --- |
| Hallazgos totales | 19 | 20 |
| **Duplicados plenos** (los dos reportan el mismo defecto con la misma prescripción) | **8 de 19 — 42 %** | **0 de 20 — 0 %** |
| Solape parcial (mismo defecto, prescripción distinta por el punto de cada lente) | 1 | 4 |
| Hallazgos que la otra lente no podía ver | 2 (uno por lente) | 20 |
| Hallazgos nuevos que el RED no encontró | — | **2**: el impacto en la API REST interna que el frontend tendrá que consumir, y dónde vive el estado «pendiente» de la petición |
| Fugas de frontera | n/a | 0 hallazgos fuera de los puntos propios; 2 los rozan al citar el Scope o una capacidad para enmarcar una decisión oculta, que es su punto |

El criterio de aceptación de la spec —menos del 10 % de duplicados— se cumple en duplicados plenos: **0 %**. El solape residual son cuatro defectos que las dos lentes ven desde puntos distintos y prescriben distinto: el CSV de logística es a la vez «estado de negocio fuera de PostgreSQL» (dominio, punto 5 bis) y «contrato acordado con otro equipo sin declarar» (técnica, punto 6); el reembolso automático es «contradicción con un requisito vivo» (dominio, punto 1) y «decisión tomada en el cuerpo» (técnica, punto 4). Eso no es el duplicado que el reparto venía a quitar —dos revisores diciendo lo mismo con las mismas palabras— sino dos arreglos distintos para el mismo síntoma, y la spec necesita los dos.

**Ningún Crítico del RED se perdió.** Los seis defectos que el RED marcó como Crítico siguen reportados: el `MODIFIED` no declarado de `orders` (dominio, Crítico), el de `refunds` (dominio Crítico + técnica Crítico), el export a logística (dominio Crítico + técnica Crítico), la ventana de 30 días contra el Scope (técnica Crítico), el catálogo de `cancel_reason` (técnica Importante) y el nombre real (dominio Menor). Los dos últimos **bajaron de severidad** al pasar a la lente que los tiene asignados: se anota como efecto secundario del reparto, no como pérdida — el hallazgo llega y su arreglo es el mismo.

Coste: 73,4k y 71,8k tokens; 135 s y 113 s.

## E2 — ¿la propuesta de nivel ayuda a decidir? (2 sujetos)

Los dos devolvieron el bloque completo con la forma de §2. Extractos literales:

- Sujeto A, línea de mínimo: «Mínimo razonable: un revisor, lente técnica — deja sin cubrir la contradicción con «Un pedido se cancela solo antes del envío» y «El reembolso lo ejecuta administración», el tipo de hueco que no se ve hasta que administración se encuentra sin poder actuar sobre un caso que antes era suyo».
- Sujeto B, línea de mínimo: «Mínimo razonable: un revisor (dominio) — deja sin cubrir si el export nuevo respeta lo ya acordado con logística y si `cancel_reason` necesita migración con default, el tipo de brecha que no se ve hasta que logística recibe un CSV que no esperaba».

| Comprobación | RED | GREEN |
| --- | --- | --- |
| Nivel y señales | 2/2 | 2/2 |
| Una línea por lente con qué comprobaría **en esta spec** | 0/2 | **2/2** |
| Líneas ancladas (citan un requisito, sección o valor de la spec) y no genéricas | 0/2 | **2/2** — los dos citan «Un pedido se cancela solo antes del envío», `cancel_reason` y el CSV de logística por su nombre |
| Opción mínima razonable | 0/2 | **2/2** |
| El mínimo nombra el descubierto, no el precio | 0/2 | **2/2** — ninguno mencionó tokens ni dinero |

**Colateral valioso**: los dos, al tener que justificar la lente con contenido de la spec, **corrigieron el recuento de señales que la propia spec fixture se había puesto**. La fixture declaraba «capacidad nueva» y los dos la descartaron (`orders` y `refunds` ya existen) y en su lugar contaron el `MODIFIED` efectivo que el delta disfraza de `ADDED`. La forma no solo explica el nivel: obliga a verificar las señales contra las capacidades en vez de enumerarlas de memoria.

**Límite honesto**: los dos propusieron dos revisores pero eligieron **mínimos distintos** (A: solo técnica; B: solo dominio). La forma llega 2/2; cuál es la lente mínima sigue siendo juicio del agente, y el dev-lead lo decide con el descubierto delante, que es exactamente lo que la task perseguía.

Coste: 78,4k y 75,2k tokens.

## E3 — ¿mira alguien los ejemplos de la spec? (2 sujetos, lente dominio, sin regla escrita)

Condición idéntica a la de E3b del RED: la constitution del fixture **no** prohíbe citar nombres reales.

| Comprobación | RED (E3b) | GREEN |
| --- | --- | --- |
| Marcan «<proyecto-real>» como defecto | **0/2** | **2/2** |
| Lo enmarcan como nombre real que no debería estar (no como decisión sin declarar) | 0/2 | 2/2 |
| Severidad | — | Menor en los dos |

Citas literales del GREEN:

- Run 1: «Se nombra «<proyecto-real>» como referencia de otro dominio donde «la aprobación del supervisor funcionó bien»; no lo prohíbe la constitution, pero es un nombre real de cliente/proyecto que queda en el historial publicado y un ejemplo inventado serviría igual».
- Run 2: «Se nombra "<proyecto-real>" como proyecto/cliente real de referencia donde un ejemplo inventado serviría igual».

Los dos reproducen el razonamiento del punto tal como está escrito, **incluida la cláusula de que la constitution no lo prohíba**: sin ella el punto habría heredado el agujero que el RED destapó (el kit no tiene esa regla escrita, y por eso en campo no se marcó nada). La severidad Menor es consistente en los dos runs; si el equipo quiere que un nombre real sea bloqueante, eso es una regla de la constitution —trabajo de la task 0002—, no del encargo del revisor.

Coste: 73,4k y ~72k tokens.

## Huecos de la propia guidance detectados en el GREEN

- **La severidad del punto 7 no está fijada** y los dos sujetos la dejaron en Menor. No se corrige aquí: el encargo no asigna severidades a ningún otro punto y hacerlo solo para este sería una excepción sin fallo que la respalde. Queda como observación para la 0002, que escribirá la regla.
- **El reparto redistribuye severidades**: dos defectos que el RED marcó Crítico (el catálogo de `cancel_reason` y el nombre real) bajaron a Importante y Menor al quedar en manos de la lente que los tiene asignados. El hallazgo llega y el arreglo es el mismo, pero un equipo que priorice solo por «Crítico» verá menos Críticos que antes. Anotado en el walkthrough.

## Conclusión — veredicto contra cada fallo del RED

| Fallo del RED | Veredicto |
| --- | --- |
| 8 duplicados plenos de 19 hallazgos (42 %), los puntos 1–4 recorridos dos veces | **Resuelto**: 0 duplicados plenos de 20, sin perder ningún Crítico, y con 2 hallazgos nuevos que ninguna lente veía cuando ambas lo miraban todo |
| 2/2 propuestas de nivel con solo nivel y señales | **Resuelto**: 2/2 con línea por lente anclada a la spec, opción mínima y su descubierto; colateral, las dos corrigieron el recuento de señales de la spec |
| 0/2 marcan un nombre real cuando la constitution no lo prohíbe | **Resuelto**: 2/2 lo marcan, con el razonamiento del punto |

Sin refactor: ningún criterio falló, así que no hubo que reescribir y re-verificar. Coste total de la campaña: **11 sujetos, ~810k tokens de subagente** (6 RED, 5 GREEN).
