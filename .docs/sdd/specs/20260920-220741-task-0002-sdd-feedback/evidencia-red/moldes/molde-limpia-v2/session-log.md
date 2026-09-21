# Bitácora de sesión — task 0004, filtro por etiqueta

Proyecto: Horizon Notes. Kit `sdd-kit` v1.1.0 (canal plugin), `superpowers` 6.3.0.
Arranco la sesión a las 08:40 del 2026-09-19. Soy el único desarrollador y el único usuario.

## 08:40 — Arranque

Invoco `sdd-start-task` sobre la task 0004 del roadmap. Leo constitution, mission, tech-stack y roadmap; no hay `capabilities/` todavía.

## 08:43 — Enrutado

La skill me propone modo lite y cita las condiciones del predicado una por una. Las repaso, se cumplen todas, y confirmo el modo.

## 08:45 — Brainstorming

Invoco `superpowers:brainstorming`. Dos preguntas: una etiqueta o varias (una; la múltiple no tiene task todavía) y qué cuenta como etiqueta (palabra con `#`, sin distinguir mayúsculas). Clasifica el cambio como acotado y me presenta un diseño corto en el chat.

## 08:50 — Spec

Calco la plantilla de spec: decisiones arriba (incluida la capacidad nueva `search`), delta con dos ADDED y sus escenarios, y el bloque de estimación de lite (1 h). La presento; la apruebo a las 08:52 sin cambios.

## 08:55 — Implementación

Escribo yo el test en rojo con los dos escenarios (`tests/tagFilter.test.js`, uno por THEN más el de mayúsculas), lo commiteo y despacho un subagente implementador con la ruta del test como contrato.

## 09:05 — `tagFilter.js`

El subagente escribe `extractTags` y `filterByTag`. Los tests pasan a la primera. El revisor de la task no encuentra nada.

## 09:12 — Smoke

Cargo el listado de notas de prueba y pruebo el filtro con una etiqueta real, con la misma en mayúsculas y sin ninguna etiqueta elegida. Los tres casos se comportan como dice la spec.

## 09:18 — Validación

Presento qué hay, cómo probarlo y el smoke. Lo pruebo yo mismo en la vista: el filtro por `#viaje` y el filtro vacío funcionan. Lo doy por validado.

## 09:20 — Parada

Todo fue fluido: ningún gate estorbó, ningún paso pidió información que ya estuviera dada, no hubo decisiones de última hora. Paro aquí; el cierre con `sdd-end-task` queda para después.

## Coste

- Reloj: 40 minutos (08:40–09:20).
- Un subagente implementador: 96k tokens. Un revisor de task: 41k tokens. El hilo principal sin contador.
