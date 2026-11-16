---
id: 20261116-135858-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-16
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-16
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `salas cancelar Norte lun` cancela sin preguntar por qué. Después de esta feature hay que decir el motivo, que es uno de tres: `salas cancelar Norte lun --motivo "sala ocupada"` responde `cancelada Norte lun (sala ocupada)`, y un comando nuevo, `salas canceladas`, lista cada cancelación con su motivo (`Norte lun · sala ocupada`). Sin motivo, o con uno fuera de la lista, no se cancela nada y el aviso dice cuáles hay.

Validación: dev-lead — es comportamiento que se usa desde la terminal; la frase de delegación no nombra `agente`.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`booking-cancellation`) · tamaño: ~45 líneas de código y tests en 3 ficheros
- Único (sonnet, siete puntos): si algún THEN de `booking-cancellation` pasa sin el comportamiento (p. ej. «no se cancela nada» sin comprobar que la reserva sigue activa) y si el texto de cada aviso está en «Reglas de la capacidad» (señal: capacidad nueva)
- Mínimo razonable: el mismo revisor — sin él quedaría sin mirar si el orden «motivo antes que reserva» contradice el comportamiento que ya había

1. Nombre del comando para listar: `canceladas` (sin argumentos) — el roadmap pide «el listado de canceladas» y hoy no existe ningún listado; sigue el estilo de `libres` y `cancelar` (verbo o adjetivo en minúscula).
2. Forma del motivo: opción `--motivo "<texto>"`, con el texto literal de la lista, entre comillas si lleva espacios — el roadmap dice «se elige de una lista» y la terminal no tiene selector; lo más simple que no rompe `cancelar <sala> <día>`.
3. La lista, con su texto exacto: `cambio de planes`, `sala ocupada`, `otro` — la dio el dev-lead (ver abajo); el texto exacto, en minúsculas y con espacios, lo fijo yo.
4. El motivo es obligatorio: sin `--motivo` no se cancela — «se elige un motivo» no dice que sea opcional; un opcional dejaría canceladas sin motivo en el listado. Cambia lo que hace hoy `cancelar` sin motivo (cancelaba): es deliberado.
5. Avisos, con su literal: sin `--motivo`, `falta el motivo: elige cambio de planes, sala ocupada u otro`; con un texto fuera de la lista, `motivo no válido: "<texto>"; elige cambio de planes, sala ocupada u otro` (el texto tal cual, sin escapar comillas). Ninguno cancela.
6. Orden de comprobación: primero el motivo, después la reserva — así un `cancelar` mal escrito se corrige con el mismo aviso aunque la reserva no exista. Con motivo válido y sin reserva activa se mantiene `sin reserva <sala> <día>`.
7. Respuesta al cancelar: `cancelada <sala> <día> (<motivo>)` — hoy es `cancelada <sala> <día>`; el motivo entre paréntesis lo confirma.
8. Formato del listado: una línea por cancelación, `<sala> <día> · <motivo>`, en el orden en que están guardadas las reservas (no el de cancelación); sin ninguna, `sin canceladas`.
9. Solo las cancelaciones: el listado no incluye las reservas anuladas (`voided`) — PRODUCT.md distingue Cancelación (el cliente) de Anulación (el responsable); el motivo es de la primera y `anular` no cambia.
10. Capacidad nueva `booking-cancellation` (slug en inglés, kebab-case) — no hay ninguna capacidad en `capabilities/` y el comportamiento de cancelar no tiene dónde vivir.
11. Enfoque: A (cambiar `cancelBooking` para recibir el motivo y guardarlo en la reserva, más una función `listCancelled`), frente a B (guardar las canceladas en una lista aparte) y C (un fichero de log) — ver Approach.
12. Reglas de la capacidad: la constitución no tiene «Reglas de producto» y no hay capacidad previa; los cinco valores son los de lo que ya hace la app (memoria, castellano) más los de esta spec, con «Límites» sin tope de longitud ni de volumen.
13. Detalles del cómo que fijo: el motivo se compara literalmente (sensible a mayúsculas); `--motivo` puede ir en cualquier posición tras la sala y el día; un `--motivo` sin valor cuenta como ausente; cancelar una reserva ya cancelada responde `sin reserva` porque ya no está activa; `--motivo ""` (vacío) cuenta como ausente; un valor que empieza por `--` se toma como el valor y es no válido; los parámetros sobrantes se ignoran (`--motivo sala ocupada` sin comillas da `motivo no válido: "sala"; …`); `canceladas` ignora los argumentos que reciba; si falta la sala o el día no se define nada nuevo (sigue como hoy); `cancelBooking(room, day, reason)` cambia de firma (el único llamador es `run`); la clave interna es `reason` y la función `listCancelled`.
16. Para poder probar sin reservas compartidas entre tests, `src/app.js` exporta `resetBookings(list)`, que sustituye las reservas en memoria (sin argumento, restaura la reserva `Norte lun 10:00-12:00` de hoy) — los escenarios parten de reservas que la app no sabe crear todavía (`Sur mar`, `Norte mié`) y los tests comparten proceso.
17. Los términos «Evitar» de PRODUCT.md (booking, room) valen para texto de usuario y documentos; los identificadores internos (`booking-cancellation`, `cancelBooking`) quedan exentos, como los de hoy.
18. El listado incluye toda cancelación, sin plazo: la regla de 24 h de PRODUCT.md sigue sin comprobarse.
19. La Task 1 es la cancelación con motivo (cancelar, avisos, `resetBookings`); la Task 2, el listado `canceladas`.
21. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade 6 requisitos y 5 reglas, y `capability check` da «Capacidades válidas: 1».
20. Política de modelos: revisor de la spec en sonnet, uno · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

1. **Aceptado** — THEN con `libres` contradictorio → reescrito con `libres 10:00-12:00` de `Sur` a `Norte, Sur`.
2. **Aceptado** — «sigue activa» sin comprobación → `libres` y `canceladas` en cada caso.
3. **Aceptado** — anuladas no probadas → GIVEN con `Norte mié` anulada y dos canceladas con orden.
4. **Aceptado** — faltaban bordes → escenario «motivo antes que reserva», mayúsculas, `--motivo` sin valor, doble cancelación (decisión 13).
5. **Aceptado** — decisiones del cuerpo → decisión 13.
6. **Aceptado** — Límites y escape → decisión 12 y regla de Límites/Avisos.
7. **Aceptado** — Intent alineada con PRODUCT.md; el THEN de `canceladas` ya enlaza el motivo guardado.
8. **Aceptado** — líneas citadas por símbolo; divergencia de 24 h anotada en Términos.
9. **Aceptado** — la aprobación por delegación se registra al cerrar la review, no antes (ver Aprobaciones).
10. **Aceptado** — política de modelos numerada, decisión de estimación retirada.

Segunda ronda (sin Críticos):

11. **Aceptado** — orden del listado → el de las reservas guardadas, GIVEN que lo distingue.
12. **Aceptado** — `reason` solo con un motivo → `canceladas` con los tres motivos.
13. **Aceptado** — parseo → decisión 13 y escenarios de valor vacío, `--` y sobrantes.
14. **Aceptado** — recancelar tras reservar → no existe ningún comando para reservar de nuevo: fuera de Scope.
15. **Aceptado** — aprobación antes de cerrar la review → registrada ahora, al cerrarla.
16. **Aceptado** — literal de la decisión 5 arreglado.
17. **Aceptado** — GIVEN con `libres` copiado.
18. **Aceptado** — plazo de 24 h → decisión 18.
19. **Aceptado** — firma y argumentos extra → decisión 13; contenido de la Task 1 → decisión 19.
20. **Aceptado** — términos «Evitar» → decisión 17.

### Decisiones tomadas con el dev-lead

- Los motivos son una lista de tres: cambio de planes, sala ocupada, otro — «cambio de planes, sala ocupada, otro» (petición inicial, 2026-11-16).
- La spec se aprueba por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» (2026-11-16).
- Parar al tener el commit de la Task 1 — misma frase.

## Intent

Hoy se cancela una reserva sin dejar rastro de por qué, y no hay forma de ver las canceladas. Quien cancela, y quien revisa después las cancelaciones, quiere distinguir una cancelación por cambio de planes de una porque la sala estaba ocupada. Éxito: cada cancelación nueva queda con uno de los tres motivos y `salas canceladas` los enseña. Anti-objetivo: que `cancelar` siga cancelando sin motivo o con uno inventado, que dejaría el listado con huecos.

## Scope

- Entra: `cancelar` exige `--motivo` con un valor de la lista; guarda el motivo en la reserva cancelada; el comando `canceladas`.
- No entra: motivos para `anular` (Anulación, otro actor); motivos propios o editables; filtrar o contar canceladas por motivo; persistencia (las reservas viven en memoria); volver a reservar una reserva cancelada (no hay comando); la regla de 24 h de PRODUCT.md (hoy no se comprueba y no es de esta feature); cambiar el CHANGELOG (lo escribe el corte de la release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo ya no cancela | `src/app.js` (`cancelBooking` y su línea en `run`); los dos tests de `test/cancel.test.js` | Scope y decisión 4: los dos tests se actualizan en la Task 1 |
| Respuesta `cancelada <sala> <día>` pasa a llevar `(<motivo>)` | `src/app.js` (`cancelBooking`); `test/cancel.test.js` | Decisión 7 y requisito «Cancelar exige un motivo de la lista» |

- Filas que implementa: 0010 → ninguna otra fila ni fichero la nombra (`ROADMAP.md` solo la define) | comprobado con `git grep -nE "0010|motivo"` fuera de las carpetas de evidencia.

## Approach

- A. Guardar el motivo en la propia reserva (`reason`) y listar las de `status: 'cancelled'` — cuesta una propiedad más en un objeto que ya cambia de estado; no hay estructura nueva y `anular` no se toca.
- B. Mover la reserva cancelada a una lista `cancelled` — cuesta duplicar la forma de la reserva y cambiar `findBooking` y `freeRooms` para que miren dos listas.
- C. Registrar cada cancelación en un fichero — no encaja: las reservas viven en memoria y el comando no persiste nada.
- Elegido: A — es el cambio mínimo sobre el patrón que ya usa `cancelBooking`/`voidBooking` (el estado vive en la reserva).

`cancelBooking(room, day, reason)` valida `reason` contra la lista antes de buscar la reserva (decisión 6) y la guarda en la reserva al cancelar. `run` lee `--motivo` de los parámetros: el valor es el elemento que sigue a `--motivo`; la sala y el día siguen siendo los dos primeros. `listCancelled()` devuelve las líneas del listado.

## Dónde se prueba

- Cancelar con motivo, motivo ausente o inválido, y sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado de canceladas: por `run('canceladas', [])`, en el mismo fichero tras cancelar; el listado no incluye anuladas (se anula con `run('anular', …)`).

## Términos y ADR

- Términos resueltos: ninguno. Divergencia que no se toca: PRODUCT.md define Cancelación como «antes de 24 h» y la app hoy no lo comprueba; sigue fuera de esta feature
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva activa `Norte lun` en `10:00-12:00`, con `libres 10:00-12:00` = `Sur`
- WHEN se ejecuta `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde `cancelada Norte lun (sala ocupada)`, `libres 10:00-12:00` pasa a `Norte, Sur` y `canceladas` responde `Norte lun · sala ocupada`
- AND con `--motivo "cambio de planes"` o `--motivo "otro"` responde `cancelada Norte lun (cambio de planes)` o `cancelada Norte lun (otro)`, y `canceladas` muestra `Norte lun · cambio de planes` o `Norte lun · otro`

#### ADDED — Cancelar sin motivo no cancela

- GIVEN la reserva activa `Norte lun` en `10:00-12:00`, con `libres 10:00-12:00` = `Sur`
- WHEN se ejecuta `cancelar Norte lun` sin `--motivo`
- THEN responde `falta el motivo: elige cambio de planes, sala ocupada u otro`, `libres 10:00-12:00` sigue siendo `Sur` y `canceladas` responde `sin canceladas`
- AND con `--motivo` como último parámetro, sin valor, o con `--motivo ""`, responde lo mismo

#### ADDED — Cancelar con un motivo fuera de la lista no cancela

- GIVEN la reserva activa `Norte lun` en `10:00-12:00`, con `libres 10:00-12:00` = `Sur`
- WHEN se ejecuta `cancelar Norte lun --motivo "me aburro"`
- THEN responde `motivo no válido: "me aburro"; elige cambio de planes, sala ocupada u otro`, `libres 10:00-12:00` sigue siendo `Sur` y `canceladas` responde `sin canceladas`
- AND con `--motivo "Otro"` (otra mayúscula) responde `motivo no válido: "Otro"; elige cambio de planes, sala ocupada u otro`
- AND con `--motivo sala ocupada` (sin comillas) responde `motivo no válido: "sala"; elige cambio de planes, sala ocupada u otro`

#### ADDED — El motivo se comprueba antes que la reserva

- GIVEN no hay reserva activa para `Sur mar`
- WHEN se ejecuta `cancelar Sur mar` sin `--motivo`
- THEN responde `falta el motivo: elige cambio de planes, sala ocupada u otro`, no `sin reserva Sur mar`

#### ADDED — Cancelar una reserva que no está activa

- GIVEN no hay reserva activa para `Sur mar`
- WHEN se ejecuta `cancelar Sur mar --motivo "otro"`
- THEN responde `sin reserva Sur mar`
- AND cancelar dos veces `Norte lun` con motivo válido responde la segunda vez `sin reserva Norte lun`

#### ADDED — Listado de canceladas

- GIVEN las reservas guardadas en este orden, `Sur mar`, `Norte lun` y `Norte mié`; `Norte lun` cancelada con `--motivo "sala ocupada"` y después `Sur mar` con `--motivo "otro"`; `Norte mié` anulada con `anular`
- WHEN se ejecuta `canceladas`
- THEN responde dos líneas, `Sur mar · otro` y `Norte lun · sala ocupada`, en el orden de las reservas guardadas (no el de cancelación), y ninguna de `Norte mié`
- AND sin ninguna cancelada responde `sin canceladas`
- AND `canceladas` con argumentos de más responde igual que sin ellos

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`); no persiste entre ejecuciones.
- **Idioma de los nombres**: castellano en comandos, motivos y avisos.
- **Límites**: tres motivos fijos: `cambio de planes`, `sala ocupada`, `otro`, comparados literalmente (mayúsculas y espacios cuentan); sin motivos propios; sin tope de longitud ni de número de canceladas (memoria).
- **Avisos**: `falta el motivo: elige cambio de planes, sala ocupada u otro` · `motivo no válido: "<texto>"; elige cambio de planes, sala ocupada u otro` · `sin reserva <sala> <día>` · `sin canceladas`.
- **Regla ante conflicto**: el motivo se comprueba antes que la existencia de la reserva.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-16 | aprobada: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
