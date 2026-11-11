---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-11
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | `8636045` | revisión limpia; el commit de la task lleva el RED reescrito del test existente por la spec |
| 2 | Listado de canceladas | done | (en el cierre) | revisión limpia |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Revisión

Revisión final: Spec opus+high, Yes (0 Critical, 0 Important, 3 Minor; 3 sin verificar → suite y CLI real verificados por el hilo; decisión 2 ausente de la spec, a ✋) · Código sonnet+high, With fixes (0 Critical, 2 Important, 5 Minor) · Arquitectura no (plan), sobre 290068d
Pasada de fix: 77f0ec7, 1 hallazgo RED→GREEN
Re-revisión: 290068d..77f0ec7, sdd-kit:effort-high + opus, limpia

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

> Salida de `sdd ledger rulings <plan>`, tal cual.

- Ruling: sin worktree nuevo, trabajo en la rama feature/0010-cancel-reason del checkout actual — ya está aislada de main y el usuario pidió implementar en esta rama — si me equivoco, mover la rama a otro worktree es barato.
- Ruling: Modelo de los implementadores y revisores: sonnet con sdd-kit:effort-medium — el plan no declara Modelo y las tasks son de 1 fichero con prosa — si queda corto, el fix-loop escala.
- Ruling: base — develop está en el merge-base 55bdc8a, sin remoto: ROADMAP.md y los ficheros de las tasks sin cambios — sin freno de alcance — si aparece un remoto, se repite el chequeo.
- Ruling: el test existente «cancelar una reserva activa» se sustituye por el de la spec (con --motivo) — el ADDED de la spec cambia ese output, no es una desviación sino su consecuencia — si Laura quería conservar el viejo, se restaura en una línea.
- Ruling: el orden de comprobación en `cancelar` es primero la reserva y luego el motivo — la spec fija el motivo inválido con la reserva existente (GIVEN) y así `cancelar Sur mar` sigue diciendo «sin reserva Sur mar» (test existente intacto) — si Laura quería motivo antes que reserva, es un cambio de una línea.
- Ruling: T2 depende del orden de declaración de los tests de T1 sobre el estado del módulo — añadir un reset exportado sería código de producción que la spec no pide — si el reviewer lo marca, se reabre.
- Ruling: `canceladas` sin canceladas devuelve cadena vacía y varias canceladas se unen con salto de línea — la spec no fija ninguno y es lo mínimo — no cambia ningún THEN.
- Ruling: Task 1 — finales de línea: test/cancel.test.js pasó de CRLF a LF; git (autocrlf=true) lo normaliza y solo avisa — el diff real es la reescritura de los tests — si molesta, se restaura CRLF en un commit.
- Final: Ruling: Eje Arquitectura no — plan sin la línea, cambio de un fichero sin ninguna de las cuatro señales — si hay frontera que no vi, queda sin revisar ese eje
- Final: Ruling: ejes Spec y Code en paralelo — control.maxParallelAgents no está fijado y salen 2 — si el tope real fuera 1, el segundo irá tras el primero
- Final: Ruling: `sdd capability merge` falla (no escribe nada): la spec declara `bookings` como «Modificadas» y no existe capabilities/bookings — no toco la spec aprobada; queda para el paso 3 de sdd-archive, que la corrige en su bloque «Capacidades» (pasa a «Nuevas») — si archive no lo ve, la capacidad no se integra
- Final: Ruling: (Código Important 2: `canceladas` vacío imprime línea en blanco; spec axis lo dejó fuera) — el código se mantiene: un mensaje nuevo es un output observable que la spec no fija y añadirlo es una decisión de Laura, no mía; hoy se comporta como `libres` sin salas — coste si me equivoco: una línea en blanco hasta que se decida el texto
- Final: Ruling: (no verificado, camino de la terminal real) — verificado por el hilo: `cancelar` con `--motivo "sala ocupada"` entrecomillado funciona por la terminal — sin coste
- Final: Ruling: (hallazgo del hilo, sin grado de eje) — el estado `bookings` vive en memoria del proceso: desde la terminal, `canceladas` en otro proceso siempre sale vacío; el modelo es de toda la app y ya existía (el estado `cancelled` tampoco persistía); persistir es un cambio de spec (Scope/Approach) — no lo toco y va a ✋ para Laura — coste si me equivoco: la 0010 no cumple su Intent para quien la usa por terminal hasta que se decida la persistencia
- Final: Ruling: (Declined, Código) — si la lista de motivos es la correcta: eje Spec, decisión 1 del dev-lead — se mantiene — sin coste
- Final: Ruling: (Declined, Código) — si `run` mezcla parseo, despacho y dominio y `reasonAfterFlag` merece módulo: eje Arquitectura, que no sale por no tener ninguna de las cuatro señales — se mantiene — coste si me equivoco: frontera sin revisar en un cambio de un fichero
- Final: Ruling: (Declined, Código) — persistir cancelaciones más allá del array en memoria: ver el ruling del hilo de arriba — a ✋
- Final: Ruling: (Declined, Código) — si `voidBooking` también debería llevar motivo: fuera de la feature, la 0011 lo trata (No entra) — se mantiene — sin coste
- Final: Ruling: (Declined, Código) — si el test viejo «cancelar una reserva activa» debía pasar sin cambios: la spec lo cambia (AND sin --motivo) — ya ruled en el preflight — se mantiene
- Final: Ruling: (Declined, Spec) — persistencia entre invocaciones: ver el ruling del hilo — a ✋
- Final: Ruling: (Declined, Spec) — `canceladas` vacío: ver el ruling del Important 2 — se mantiene
- Final: Ruling: (Declined, Spec) — `--motivo` sin valor o con otra capitalización se rechaza con la lista: es lo esperable de una lista cerrada — se mantiene — sin coste
- Final: Ruling: (Declined, Spec) — `--motivo` antes de la sala responde «sin reserva --motivo otro»: la spec fija la sintaxis con el motivo detrás — se mantiene — coste si me equivoco: mensaje poco claro con una sintaxis no soportada
- Final: Ruling: (Declined, Spec) — orden reserva→motivo: ruled en el preflight — se mantiene
- Final: Ruling: (Declined, Spec) — etiqueta ADDED en vez de MODIFIED del primer requisito: redacción de la spec aprobada, no se toca; lo ve archive junto al bloque «Capacidades» — coste si me equivoco: el merge de capacidades registra el requisito como nuevo
- Final: Ruling: (Declined, Spec/Código) — CRLF→LF en test/cancel.test.js: ya ruled en la Task 1 — se mantiene
- Final: Ruling: (no verificado, Spec) — «Decisiones» de la spec salta de 1 a 3 desde el commit de apertura: no sé si se perdió una decisión 2 — a ✋ para Laura — coste si me equivoco: una decisión sin cubrir
- Final: minor (deferred): Spec — ningún test fija el filtro `cancelled` de `listCancelled` ni el separador \n con varias canceladas (src/app.js)
- Final: minor (deferred): Spec — la lista cerrada solo se prueba aceptando «sala ocupada»; «cambio de planes» y «otro» sin test
- Final: minor (deferred): Código — finales de línea CRLF→LF en test/cancel.test.js hacen el diff ruidoso
- Final: minor (deferred): Código — literal `'--motivo'` inline en vez de constante nombrada (src/app.js)
- Final: minor (deferred): Código — `CANCEL_REASONS` declarada entre funciones en vez de junto a `rooms` y `bookings` (src/app.js)
- Final: minor (deferred): Código — texto del rechazo `motivo no válido: a, b, c` podría decir «usa uno de» (la spec fija el literal)
- Final: minor (deferred): Código — la constante de test MOTIVO_NO_VALIDO repite la lista a mano
- Final: minor (deferred): Re-revisión (fuera del diff del fix) — `src/app.js` guarda estado mutable en módulo y ejecuta CLI a nivel superior; una fábrica o reset en producción haría los tests más limpios sin el import con query
