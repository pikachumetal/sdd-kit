---
id: 20261119-155832-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Al cancelar una reserva hay que decir por qué, eligiendo de una lista: `salas cancelar Norte lun --motivo sala-ocupada`. Después, un comando nuevo, `canceladas`, enseña cada reserva cancelada con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda el motivo al cancelarse y el listado lee las que quedaron en estado cancelada.

Validación: dev-lead — lo usa una persona desde la terminal y solo ella ve si los textos del comando y del listado le sirven.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo obligatorio y listar las canceladas con su motivo.

## ✋ Decisiones que he tomado yo — valida estas

1. **Capacidad nueva `booking-cancellation`** — el proyecto no tiene `capabilities/` todavía y la cancelación no está especificada en ningún sitio; es el nombre del fichero, en inglés.
2. **El motivo es obligatorio** — el dev-lead dijo «se elige un motivo»; no dijo qué pasa si no se da. Una cancelación sin motivo no se hace: así el listado nunca tiene huecos.
3. **Se da con `--motivo <valor>`**, con los valores `cambio-de-planes`, `sala-ocupada` y `otro` (guiones por ser argumentos de terminal; las tres opciones son del dev-lead). En el listado se enseñan con espacios: `cambio de planes`, `sala ocupada`, `otro`.
4. **Textos de error**, nada de esto lo dijo nadie:
   - sin `--motivo`: `falta el motivo: elige cambio-de-planes, sala-ocupada u otro`
   - valor fuera de la lista: `motivo no válido: viaje; elige cambio-de-planes, sala-ocupada u otro`
   - en ambos casos la reserva sigue activa.
5. **El motivo se valida antes de buscar la reserva**: `cancelar Sur mar` sin motivo dice `falta el motivo…`, no `sin reserva Sur mar`.
6. **`cancelar` con motivo responde** `cancelada Norte lun (cambio de planes)`: el texto actual más el motivo entre paréntesis.
7. **`otro` no pide texto libre**: es una opción más de la lista. *Pendiente*: el dev-lead no dijo si `otro` debe poder explicarse; lo tomo como no.
8. **El comando del listado se llama `canceladas`** (mismo estilo que `libres`). El listado no existe hoy: el roadmap dice que «lo enseña», pero no hay ningún listado de canceladas que ampliar, así que lo creo.
9. **Formato del listado**: una línea por reserva, `<sala> <día> <franja> · <motivo>`, en el orden en que se cancelaron; vacío: `sin canceladas`.
10. **Solo salen las canceladas**, no las anuladas: `PRODUCT.md` distingue cancelación (la hace el cliente) de anulación (el responsable), y el motivo se pide solo al cancelar. `anular` no cambia.
11. **Qué es «cancelada»**: lo que hoy deja `cancelar` (estado `cancelled`). No añado la regla de las 24 h de `PRODUCT.md`, que el código no aplica.
12. **Los motivos viven en el código** (una lista en `src/app.js`), no en un fichero de configuración: no hay base de datos y el proyecto es un solo fichero.
13. **El porqué de fondo**: nadie dijo por qué se quiere el motivo. *Pendiente*: Intent describe el efecto, no la razón.
14. **Delta probado en una copia** de `.docs/sdd`: `sdd capability merge` añade los 4 requisitos a `booking-cancellation.md` sin rechazos. Sin hallazgos en `git grep` fuera de lo ya listado en «Lo que se retira o cambia de forma» (`CHANGELOG.md:20` es histórico y no cambia).
15. **Sin review de la spec**, como pediste: la política de abajo lo recoge. Queda sin cubrir lo que un revisor habría contrastado (p. ej. si el texto de los errores encaja con el estilo de la herramienta).
- Política de modelos (solo en `delegate`): revisores de la spec: ninguno (sin review, a petición del usuario) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Al cancelar se elige un motivo de una lista — «al cancelar una reserva se elige un motivo de una lista»
- La lista es cambio de planes, sala ocupada, otro — «(cambio de planes, sala ocupada, otro)»
- El listado de canceladas enseña el motivo — «el listado de canceladas lo enseña»
- Sin review — «Sin review»

## Intent

Hoy `cancelar Norte lun` deja la reserva cancelada sin decir por qué, y no hay forma de ver después qué reservas se cancelaron. Se quiere que cada cancelación lleve un motivo de una lista cerrada y que ese motivo se vea al listar las canceladas. Éxito: tras `cancelar Norte lun --motivo cambio-de-planes`, `canceladas` devuelve `Norte lun 10:00-12:00 · cambio de planes`. Anti-goal: que se pueda cancelar sin motivo y el listado tenga huecos. El porqué de fondo no se dijo (ver ✋ 13).

## Scope

- Entra: `--motivo` en `cancelar` con los tres valores; guardar el motivo en la reserva; comando `canceladas`; los textos de error de ✋ 4.
- No entra: anulaciones y su motivo (feature 0011 las toca aparte); texto libre en `otro`; la regla de las 24 h; persistencia entre ejecuciones; filtrar o ordenar el listado; cambiar el motivo de una reserva ya cancelada.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13` (`cancelBooking`), `src/app.js:30` (`run`), `test/cancel.test.js:5` (`cancelar una reserva activa`) | delta (`ADDED` motivo obligatorio) y decisión 2; el test se reescribe con `--motivo` |
| La respuesta `cancelada Norte lun` pasa a `cancelada Norte lun (cambio de planes)` | `test/cancel.test.js:6` | decisión 6 |
| `cancelar Sur mar` sin motivo ya no dice `sin reserva Sur mar` | `test/cancel.test.js:9-10` (`cancelar sin reserva lo dice`) | decisión 5; el test pasa a usar `--motivo` |

- Filas que implementa: 0010 → `ROADMAP.md` (su propia fila) | `CHANGELOG.md` la anotará el cierre de la release.

## Approach

- **A. Motivo como campo de la reserva y comando `canceladas` que filtra por estado** — `cancelBooking` recibe el motivo y lo guarda en `booking.reason`; `canceladas` recorre `bookings` con `status === 'cancelled'`. Cambia dos funciones y añade una; nada más.
- **B. Registro aparte de cancelaciones** (`cancellations = [{room, day, slot, reason}]`) — duplica datos que ya están en la reserva y hay que mantener los dos en sincronía; sin ventaja con todo en memoria.
- **C. Estado por motivo** (`cancelled-plans`, `cancelled-busy`…) — mezcla el estado con el motivo y rompe `findBooking`/`freeRooms`, que comparan con `'active'` y habrían de conocer cada estado nuevo.
- Elegido: **A** — es el cambio mínimo, reutiliza el estado `cancelled` que ya existe y deja `anular` intacto. Lo elijo yo (perfil `delegate`: no hubo mensaje de enfoques; este apartado y el ✋ lo recogen).

Lo que fija A: la lista de motivos es una constante en `src/app.js` con `valor → texto del listado`; `run` separa `--motivo <valor>` del resto de argumentos antes de llamar a `cancelBooking`; `canceladas` usa el orden de `bookings`, que es el de creación, no el de cancelación: para listar «en el orden en que se cancelaron» (✋ 9) `cancelBooking` guarda también un contador de cancelación, o el listado se ordena por él. Es detalle del plan.

## Dónde se prueba

- cancelar con motivo, sin motivo y con motivo no válido: `run('cancelar', …)` en `test/cancel.test.js`, como los tests actuales de cancelar.
- la reserva sigue activa tras un error de motivo: mismo fichero, comprobando con `run('libres', …)` que la sala no queda libre.
- `canceladas` con una, con varias y con ninguna: `run('canceladas', [])` en `test/cancel.test.js`.
- una anulada no sale en `canceladas`: mismo fichero, con `run('anular', …)`.

## Términos y ADR

- Términos resueltos: **cancelación** frente a **anulación**, tal como las define `PRODUCT.md`; el listado es de cancelaciones.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo cambio-de-planes`
- THEN responde `cancelada Norte lun (cambio de planes)` y la reserva deja de estar activa (`libres 10:00-12:00` devuelve `Norte, Sur`)
- AND con `sala-ocupada` responde `cancelada Norte lun (sala ocupada)`, y con `otro`, `cancelada Norte lun (otro)`

#### ADDED — El motivo es obligatorio y de la lista

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` sin `--motivo`
- THEN responde `falta el motivo: elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa (`libres 10:00-12:00` devuelve `Sur`)
- AND con `--motivo viaje` responde `motivo no válido: viaje; elige cambio-de-planes, sala-ocupada u otro` y la reserva sigue activa
- AND el motivo se comprueba antes que la reserva: `cancelar Sur mar` sin motivo responde `falta el motivo: …`

#### ADDED — Cancelar lo que no existe

- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Listado de canceladas

- GIVEN Norte lun cancelada con `cambio-de-planes` y Sur mar cancelada con `sala-ocupada`, en ese orden
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun 10:00-12:00 · cambio de planes` y `Sur mar 10:00-12:00 · sala ocupada`
- AND GIVEN ninguna cancelada, responde `sin canceladas`
- AND una reserva anulada con `anular` no sale

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
