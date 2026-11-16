---
id: 20261116-135119-feature-0010-motivo-cancelar
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

🦆 Al cancelar una reserva hay que decir por qué, eligiendo entre `cambio de planes`, `sala ocupada` y `otro`: `salas cancelar Norte lun sala ocupada` cancela la reserva y guarda el motivo; sin motivo, o con uno que no está en la lista, no se cancela nada y se te enseña la lista. Además hay un comando nuevo, `salas canceladas`, que lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva cancelada guarda su motivo en un campo `reason` y el listado solo recorre las de estado cancelado.

Validación: dev-lead — lo usa una persona desde la terminal; el agente no puede dar por bueno lo que esa persona ve.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (cambia la forma del comando `cancelar`, que pasa a exigir motivo), capacidad nueva (`booking-cancellation`) · tamaño: ~30 líneas en 2 ficheros de código (`src/app.js`, tests)
- Dominio (sonnet): si la lista de tres motivos y los textos de error cubren lo que dice la fila 0010 del roadmap, y si «anulada» queda fuera del listado de canceladas (señal: capacidad nueva)
- Técnica (sonnet): si el orden de comprobación (motivo antes que reserva) y el estado en memoria no rompen los tests de `test/cancel.test.js` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el listado cuadra con los términos Cancelación/Anulación de `PRODUCT.md`

1. **Enfoque: A, frente a B y C (ver Approach).**
2. **Nombre de capacidad**: `booking-cancellation` (slug en inglés kebab-case). Es capacidad nueva: `capabilities/` está vacío.
3. **El motivo es el resto de los argumentos**: `cancelar Norte lun sala ocupada` y `cancelar Norte lun "sala ocupada"` valen igual (los argumentos tras el día se unen con un espacio), para no obligar a entrecomillar.
4. **La lista de motivos es fija y literal**: `cambio de planes`, `sala ocupada`, `otro`, en ese orden. Se comparan tal cual, en minúsculas; `Otro` no vale.
5. **Motivo ausente o fuera de lista**: respuesta `motivo requerido: cambio de planes, sala ocupada, otro`; la reserva sigue activa. El texto es mío.
6. **Orden de comprobación**: primero el motivo, después la reserva. `cancelar Sur mar` (sin reserva y sin motivo) responde con el motivo requerido, no con `sin reserva Sur mar`.
7. **Cancelar con motivo sigue respondiendo `cancelada <sala> <día>`**, sin repetir el motivo: lo mínimo; el motivo se ve en el listado.
8. **Comando del listado: `canceladas`**, sin argumentos (`salas canceladas`). El nombre es mío, en plural como `libres`.
9. **Formato de cada línea del listado**: `<sala> <día> <franja> · <motivo>` (`Norte lun 10:00-12:00 · sala ocupada`), una por línea, en el orden en que están guardadas las reservas; sin ninguna, `sin canceladas`. Mío.
10. **Las reservas anuladas por el responsable (`voided`) no salen en `canceladas`**: «Cancelación» y «Anulación» son cosas distintas en `PRODUCT.md`, y la fila 0010 habla de cancelar. No se pide motivo al anular.
11. **El listado no filtra por sala ni por día**: la fila 0010 no lo pide.
12. **Los tests existentes de `cancelar` cambian**: llevaban `cancelar Norte lun` sin motivo y pasan a llevarlo.
13. **La constitution no tiene «Reglas de producto»**: los valores de «Reglas de la capacidad» salen de esta spec.
14. **Sin `§Frontend`**: es una CLI sin pantalla; no aplica.
15. **No se aplica la regla de las 24 h** de `PRODUCT.md` (el código hoy tampoco la aplica): fuera de alcance. Consecuencia: `canceladas` lista cancelaciones de cualquier hora, y la definición de «Cancelación» de `PRODUCT.md` («antes de 24 h») no se cumple del todo. No toco `PRODUCT.md`; queda para quien decida aplicar las 24 h.
16. **Motivo sin normalizar**: los argumentos tras el día se unen con un solo espacio y se comparan tal cual, sin recortar ni colapsar espacios (`"sala  ocupada"` entrecomillado con dos espacios no vale).
17. **Cancelar una reserva ya cancelada o anulada** responde `sin reserva <sala> <día>`, como hoy: solo se cancelan reservas activas.
18. **Se exporta `bookings` de `src/app.js`** para que los tests siembren más reservas (la semilla trae una sola: Norte lun 10:00-12:00). Es el único cambio de interfaz interna.
19. **Hallazgos de nombres**: el slug `booking-cancellation` y los identificadores del código (`reason`, `cancelled`, `voided`, `cancelBooking`) van en inglés; es el idioma del código existente. «Evitar: booking» de `PRODUCT.md` se refiere al texto que ve quien usa la herramienta, que va en castellano.
20. **`anular` no cambia**: ya existe, deja la reserva en estado `voided` y no pide motivo.
21. **La entrada del changelog** va en `[Unreleased]` al cerrar la feature, no en el Scope de código.
- Política de modelos: revisores de la spec: dos, Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado en una copia con `sdd capability merge`: `sdd capability merge` sale con código 0: `booking-cancellation.md: añadido «Cancelar exige un motivo de la lista»`, `añadido «Listado de reservas canceladas»` y las cinco reglas de la capacidad añadidas.

### Hallazgos de la review

Sin Críticos: no hay segunda ronda. Dominio y técnica, 20 hallazgos (varios repetidos).

- **Aceptado** — nada observa que `reason` se guarda; el caso `sala ocupada` no ejecuta `canceladas` → el primer escenario añade el AND con `canceladas`.
- **Aceptado** — la decisión 6 (motivo antes que reserva) sin escenario → escenario `cancelar Sur mar` sin motivo; la regla ante conflicto lo declara.
- **Aceptado** — decisiones 3 y 4 sin escenario (motivo entrecomillado, `Otro`) → AND del primer escenario y escenario `Otro`; decisión 16 sobre espacios sin normalizar.
- **Aceptado** — orden y varias líneas del listado sin escenario → escenario con dos canceladas; el orden pasa a ser el de las reservas guardadas (decisión 9) y se exporta `bookings` para sembrar (decisión 18).
- **Aceptado** — qué pasa al cancelar una reserva ya cancelada o anulada → decisión 17 y escenario.
- **Aceptado** — `anular` y su estado `voided` no estaban dichos → decisión 20; «Dónde viven los datos» recoge que `voided` queda fuera.
- **Aceptado** — Avisos incompletos, Idioma de los nombres sin identificadores, regla de conflicto «no aplica» → «Reglas de la capacidad» reescritas; decisión 19.
- **Aceptado** — «Términos y ADR» afirmaba algo que `PRODUCT.md` no dice; la regla de las 24 h → «Términos y ADR» corregido; decisión 15 declara la consecuencia.
- **Aceptado** — Scope no listaba los tests nuevos; fixture «Sur el mar»; aislamiento de los tests del listado → Scope, escenario y «Dónde se prueba» corregidos (dos ficheros de test).
- **Aceptado** — ayuda de comandos o README: no existe ninguna ayuda de comandos en `src/app.js` y `README.md` no documenta comandos; no hay nada que actualizar (la entrada del changelog, decisión 21).

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación» (2026-11-16)
- Parada tras la Task 1 — «cuando tengas el commit de la Task 1, para» (2026-11-16): se implementa la Task 1, se commitea y se para.
- Lista de motivos — «de una lista: cambio de planes, sala ocupada, otro»

## Intent

Hoy `salas cancelar Norte lun` cancela sin dejar rastro del porqué, y no hay forma de ver qué reservas se cancelaron. Importa para saber, de un vistazo, si se cancela por cambio de planes o porque la sala estaba ocupada. Éxito: toda cancelación nueva queda con uno de los tres motivos y `salas canceladas` los enseña. Fracaso aunque «funcione»: poder cancelar sin motivo, o que una anulación del responsable aparezca como cancelada.

## Scope

- Entra: `cancelar` exige un motivo de la lista y lo guarda; comando `canceladas` que lista las canceladas con su motivo; exportar `bookings`; los tests de `cancelar` actualizados y los tests nuevos del listado (`test/canceladas.test.js`, `test/canceladas-anulada.test.js`).
- No entra: pedir motivo al anular (`anular`); filtrar el listado; la regla de las 24 h; persistir las reservas fuera de memoria; migrar canceladas anteriores (no hay: todo vive en memoria).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Forma `cancelar <sala> <día>` (sin motivo) | `src/app.js:30` (`run`), `src/app.js:13` (`cancelBooking`), `test/cancel.test.js:5` y `:9` | Delta `ADDED` «Cancelar exige un motivo de la lista»; decisión 12 para los tests |
| Entrada «Cancelar una reserva propia.» del changelog de 0.3.0 | `CHANGELOG.md:20` | Se queda: es historia de una versión ya publicada; la entrada nueva va en `[Unreleased]` al cerrar la release |

- Filas que implementa: 0010 → `ROADMAP.md:7` (su propia fila; la marca el cierre) | ningún otro fichero la nombra: comprobado con `git grep -n 0010`.

## Approach

- A. Motivo como resto de argumentos, validado dentro de `cancelBooking`, guardado en `booking.reason`; `canceladas` filtra `status === 'cancelled'` — cambia dos funciones de `src/app.js` y no añade ficheros de código.
- B. Motivo como opción `--motivo <texto>` — obliga a escribirla siempre con su nombre, más larga que el resto de comandos (`cancelar Norte lun`), sin ganar nada.
- C. Pedir el motivo por pregunta interactiva con lista numerada — la herramienta se usa como comando de una línea y `run` es una función síncrona que se prueba sin teclado; costaría reescribir cómo se prueba.
- Elegido: A — la forma más corta, la misma que usan `libres` y `cancelar` hoy, y se prueba por `run` como los tests actuales.

Piezas que fija A: una constante `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']` en `src/app.js`; `cancelBooking(room, day, reason)` valida el motivo antes de buscar la reserva y guarda `reason` junto a `status = 'cancelled'`; `cancelledList()` devuelve el texto del listado; `run` encamina `canceladas` y pasa `params.slice(2).join(' ')` como motivo.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo fuera de lista, sin reserva: por `run('cancelar', …)` en `test/cancel.test.js`, como los tests actuales.
- Listado `canceladas`: por `run('canceladas', [])`. `test/canceladas.test.js` (fichero nuevo) corre, en este orden, vacío → una cancelada → dos canceladas, sembrando la segunda con `bookings.push`; `test/canceladas-anulada.test.js` (fichero nuevo) cubre la anulada, porque la semilla solo trae Norte lun y no puede estar cancelada y anulada en el mismo proceso. `node --test` corre cada fichero en su proceso, así que el estado en memoria no se pisa entre ficheros; dentro de un fichero, el orden de los tests lo fija.
- Línea de comandos real (`node src/app.js cancelar Norte lun sala ocupada`): smoke manual en la validación.

## Términos y ADR

- Términos resueltos: Cancelación (la que anula el cliente: lleva motivo y sale en `canceladas`) frente a Anulación (la del responsable: no pide motivo y no sale en `canceladas`). `PRODUCT.md` define la Anulación «por cualquier motivo» y la Cancelación «antes de 24 h»; esta feature no los cambia (decisión 15).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `cancelar Norte lun sala ocupada`
- THEN responde `cancelada Norte lun`
- AND la reserva queda cancelada con el motivo `sala ocupada`: `canceladas` responde `Norte lun 10:00-12:00 · sala ocupada`
- AND vale igual con el motivo entrecomillado (`cancelar Norte lun "sala ocupada"`), porque los argumentos tras el día se unen con un espacio

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `cancelar Norte lun` (sin motivo)
- THEN responde `motivo requerido: cambio de planes, sala ocupada, otro`
- AND la reserva sigue activa (`libres 10:00-12:00` no lista Norte)

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `cancelar Norte lun aburrimiento`
- THEN responde `motivo requerido: cambio de planes, sala ocupada, otro`
- AND la reserva sigue activa

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `cancelar Norte lun Otro`
- THEN responde `motivo requerido: cambio de planes, sala ocupada, otro` (solo valen minúsculas)
- AND la reserva sigue activa

- GIVEN no hay reserva activa de Sur en mar
- WHEN se ejecuta `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

- GIVEN no hay reserva activa de Sur en mar
- WHEN se ejecuta `cancelar Sur mar` (sin motivo)
- THEN responde `motivo requerido: cambio de planes, sala ocupada, otro`, no `sin reserva Sur mar`

- GIVEN Norte lun 10:00-12:00 ya cancelada
- WHEN se ejecuta `cancelar Norte lun otro`
- THEN responde `sin reserva Norte lun`

#### ADDED — Listado de reservas canceladas

- GIVEN Norte lun 10:00-12:00 cancelada con el motivo `cambio de planes`
- WHEN se ejecuta `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`

- GIVEN Norte lun 10:00-12:00 cancelada con `cambio de planes` y Sur mar 14:00-15:00 cancelada con `otro`
- WHEN se ejecuta `canceladas`
- THEN responde dos líneas, en el orden en que están guardadas las reservas: `Norte lun 10:00-12:00 · cambio de planes` y `Sur mar 14:00-15:00 · otro`

- GIVEN ninguna reserva cancelada
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`

- GIVEN Norte lun 10:00-12:00 anulada por el responsable (`anular Norte lun`)
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en el campo `reason` de cada reserva cancelada (como el resto de reservas); el listado solo incluye las de estado cancelado, las anuladas (`voided`) quedan fuera.
- **Idioma de los nombres**: castellano en los mensajes, los motivos y el comando `canceladas`; identificadores del código (`reason`, `cancelled`, `voided`) y slug de la capacidad en inglés, como el código existente.
- **Límites**: tres motivos, cerrados: `cambio de planes`, `sala ocupada`, `otro`; comparación literal en minúsculas, sin normalizar espacios.
- **Avisos**: `motivo requerido: cambio de planes, sala ocupada, otro` (falta el motivo o no está en la lista) · `sin reserva <sala> <día>` (no hay reserva activa) · `cancelada <sala> <día>` (confirmación) · `sin canceladas` (listado vacío).
- **Regla ante conflicto**: si faltan a la vez el motivo y la reserva, gana el aviso del motivo.

## Enmiendas

- 2026-11-16 — el AND del escenario «sin motivo» decía «`libres 10:00-12:00` lista Norte»; `libres` lista las salas libres, así que con Norte reservada no la lista: vuelve a «no lista Norte», que era la redacción antes de plegar los hallazgos — error mío al plegarlos, lo vio el RED de la Task 1 — Task 1 — sin aprobar (corrección de un error de redacción; el dev-lead debe confirmarla)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-16 | aprobada: «Apruebo la spec por delegación» (frase del dev-lead; el agente la aprueba tras la review) |
