# Bitácora de sesión — task 0004, filtro por etiqueta

Proyecto: Horizon Notes. Kit `sdd-kit` v1.1.0 (canal plugin), `superpowers` 6.3.0.
Arranco la sesión a las 08:40 del 2026-09-19.

## 08:40 — Arranque

Quiero meter el filtro por etiqueta que llevaba en «próximo» del roadmap. Invoco
`sdd-start-task` directamente sobre la task 0004.

## 08:42 — Intent

Como es modo `lite`, no hace falta documento de intent aparte: lo resuelvo en la propia
conversación. Confirmo el alcance: filtrar por una etiqueta, sin autocompletado ni multi
etiqueta. Ningún rodeo, la pregunta fue directa y la respuesta también.

## 08:48 — Spec

Escribo `spec.md` con el delta sobre la capacidad `search`: dos requisitos ADDED, filtro por
etiqueta y filtro vacío muestra todas las notas. El gate de spec pide confirmación antes de
pasar a plan; la doy a las 08:52 sin cambios.

## 08:55 — Implementación

Como es `lite` y solo hay una task en el plan, despacho un único subagente implementador para
todo el cambio en vez de repartirlo en varios. Le paso el task-brief con el test que espero:
`tests/tagFilter.test.js` con los tres casos (extraer etiquetas, filtrar por etiqueta, filtro
vacío devuelve todo), en rojo porque `tagFilter.js` no existe todavía.

## 09:05 — `tagFilter.js`

El subagente escribe `extractTags` y `filterByTag`. Corro los tests: los tres pasan a la
primera, sin ninguna ronda de ajuste sobre lo que había entregado.

## 09:12 — Smoke

Cargo el listado de notas de prueba en la vista y pruebo el filtro con una etiqueta real y con
ninguna etiqueta seleccionada. Los dos casos se comportan como esperaba. El smoke pasó a la
primera, sin ningún ajuste posterior.

## 09:20 — `sdd-end-task`

Invoco `sdd-end-task`. El paso 0 de validación con el usuario fue el único que tocaba, y como
soy el único desarrollador y usuario, la confirmación fue inmediata y no repitió ninguna
pregunta anterior.

## 09:24 — Fusión del delta y walkthrough

Fusiono el delta en `.docs/sdd/capabilities/search.md`: los dos requisitos ADDED se añaden con
su entrada en el Historial. El walkthrough sale corto porque la task es pequeña. Ningún paso
de esta parte dio ninguna vuelta: la capacidad no existía todavía con ningún requisito previo,
así que no hubo nada que conciliar.

## 09:30 — Registro de estimación

Anoto en `estimation-log.md`: estimado 1h 00m, real 55m. La sesión entera fue fluida de
principio a fin: ningún gate estorbó, ningún paso pidió información que ya tuviera dada, y no
hubo ninguna decisión de última hora que resolver por mi cuenta.

## 09:35 — Cierre

Marco la task como cerrada y termino la sesión a las 09:35.

## Resumen de coste

- Tiempo de reloj: 55 minutos (08:40–09:35).
- Un único subagente implementador (el propio hilo en línea, modo `lite`): 96k tokens.
