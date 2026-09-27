# Constitución — Nortia Distribución

## Artículo 1 — Idioma

La documentación y los comentarios de código se escriben en castellano con ortografía correcta
(tildes incluidas). Los identificadores de código (clases, métodos, variables) van en inglés.

## Artículo 2 — Commits

Mensajes de commit con formato `tipo(ámbito): descripción breve`. El tipo y el ámbito en
inglés (`feat`, `fix`, `refactor`, `test`, `docs`), la descripción en castellano. Un commit por
cambio lógico completo.

## Artículo 3 — Testing

Ninguna funcionalidad de cálculo de precio, tarifa o descuento se integra sin un test que la
cubra. Los tests de dominio (`Pricing`, `Orders`) usan xUnit y viven en `tests/`, en espejo de
la carpeta de `src/` que cubren.

## Artículo 4 — Convenciones de `.docs/sdd/`

Cada task no trivial tiene su carpeta en `.docs/sdd/specs/` con el patrón
`AAAAMMDD-HHMMSS-task-NNNN-slug`. Las capacidades del dominio (pricing, orders, catalog) viven
en `.docs/sdd/capabilities/`, una por fichero, y se actualizan cuando una spec añade o modifica
un requisito.

## Artículo 5 — Calidad de código

Funciones con una sola responsabilidad y nombres que expliquen el dominio de tarifas y pedidos
sin necesitar comentario aparte. Se prioriza la claridad del cálculo de precio sobre la
brevedad: un escalado o un rappel mal leído cuesta dinero real al mayorista.
