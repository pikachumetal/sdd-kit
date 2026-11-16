---
id: 20261115-192824-feature-0012-persistent-bookings
feature: 0012
title: Las reservas sobreviven a cerrar y volver a abrir la terminal
mode: full
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar y volver a abrir la terminal

🦆 Hoy, si cancelas la reserva de Norte del lunes y vuelves a pedir las salas libres de 10:00-12:00, `salas` vuelve a decir «Sur»: la cancelación se perdió al terminar el comando. Con este cambio, la cancelación (y la anulación) queda guardada en un fichero de tu carpeta personal, y `libres 10:00-12:00` dirá «Norte, Sur» ahora, mañana y después de cerrar la terminal. Si el fichero se estropea, `salas` no lo pisa: te dice cuál es y no cambia nada. `reservar` sigue sin crear reservas de verdad, y eso queda fuera de este cambio. Esto contradice la decisión 0003 («las reservas viven en memoria»), que se sustituye por una nueva.

Validación: dev-lead — lo que cambia se ve cerrando y abriendo la terminal, y eso solo lo observa una persona.

## Capacidades

- Nuevas: `bookings` — qué se guarda de las reservas, dónde, y qué pasa al arrancar con un fichero que falta o está roto.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (el formato del fichero lo leerán las versiones futuras), datos (primer dato persistente del producto) · tamaño: ~80 líneas en 5 ficheros
- Dominio (sonnet): si los textos de aviso y el estado inicial sin fichero son coherentes con el producto y con los términos «reserva», «cancelación» y «anulación» de `PRODUCT.md` (señal: capacidad nueva)
- Técnica (sonnet): si la lectura en cada comando y la escritura por renombrado aguantan el escenario de dos terminales, y si la versión del formato (decisión 5) deja salida a un cambio futuro (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar si los textos de aviso hablan el idioma del producto

1. **Enfoque**: un fichero JSON en disco, frente a SQLite y frente a un fichero en la carpeta de trabajo (ver Approach).
2. **Capacidad nueva `bookings`** (sustantivo del dominio, inglés kebab-case, como pide `capability-template.md`): no hay ninguna capacidad hoy, y esta es la primera. `PRODUCT.md` marca «Evitar: booking» para el texto que ve quien usa la herramienta; el nombre de una capacidad es un nombre de fichero, no ese texto, y la regla de la plantilla lo manda en inglés. Acepto esa diferencia a propósito.
3. **Dónde vive el fichero**: `reservas.json` dentro de `.salas` del directorio personal (`os.homedir()`, también en Windows); la variable `SALAS_DATOS` lo cambia por otra ruta. Una `SALAS_DATOS` vacía cuenta como no definida; una relativa se resuelve desde la carpeta de trabajo. La variable existe para que los tests no toquen tu carpeta personal. La carpeta del fichero se crea, con sus padres, en la primera escritura, sea cual sea la ruta.
4. **Formato**: `{"version": 1, "bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "active"}]}`, con sangría de 2 espacios y un salto de línea final, para que una persona lo abra. Los tests comparan el JSON ya leído, no el texto. `status` vale `active`, `cancelled` (cancelación) o `voided` (anulación): los tres que ya usa el código y los términos de `PRODUCT.md`. Las claves van en inglés porque son identificadores técnicos que ya usa el código, no texto de interfaz; los mensajes, en castellano.
5. **Un `version` en el fichero**: cuesta una línea y es lo único que deja a una versión futura distinguir un formato viejo sin adivinar. Una versión que no sea la 1 se trata como fichero ilegible.
6. **Sin fichero, el estado inicial es la reserva de hoy** (`Norte · lun · 10:00-12:00 · active`), que está escrita a mano en `src/app.js`. El fichero solo se crea cuando un comando cambia algo (`cancelar`, `anular`); `libres` no lo crea.
7. **Fichero ilegible**: no se sobrescribe, no se arregla solo. Sale por la salida de error `no puedo leer <ruta>: <motivo>; no he cambiado nada` y el código de salida es 1. Los motivos son literales y cada uno tiene su caso: `el contenido no es JSON válido` (no se puede interpretar), `versión <n> no soportada` (`version` es un número y no es 1; `<n>` se imprime tal cual), `faltan las reservas` (hay `version` 1 y no hay `bookings`), `las reservas no tienen la forma esperada` (cualquier otro: la raíz no es un objeto, falta `version` o no es un número, `bookings` no es una lista, una entrada sin `room`, `day`, `slot` o `status`, o con un `status` que no es uno de los tres). Una ruta que es una carpeta o que no se puede leer por permisos usa el mensaje del sistema como motivo. Que el fichero no exista, o que un tramo de su ruta no sea una carpeta, no es ilegible: es «sin fichero» (decisión 6), y si luego hay que guardar, falla el guardado (decisión 8).
8. **Lectura en cada comando, escritura por renombrado, sin bloqueo**: los comandos que miran reservas (`libres`, `cancelar`, `anular`) leen el fichero al empezar y, si cambian algo, lo escriben entero a `<ruta>.<pid>.tmp` y lo renombran. `reservar` y cualquier otro comando no leen ni escriben: un fichero roto no los hace fallar. Con dos terminales escribiendo a la vez no hay garantía: un cambio puede perderse (ver «Reglas»). Si el sistema falla al guardar, el aviso es `no puedo guardar <ruta>: <motivo del sistema>`, el código de salida es 1, el comando no imprime su resultado de éxito y el `.tmp` se borra.
9. **Los tests actuales cambian**: `test/app.test.js` y `test/cancel.test.js` llaman a `run` sin ruta; con persistencia escribirían en tu carpeta personal. Cada test apuntará `SALAS_DATOS` a una carpeta temporal. No añado ninguna guardia automática contra un test que se olvide de hacerlo: en un proyecto de una sola persona cuesta más que el riesgo.
10. **Código en `src/store.js`**: leer y escribir el fichero. `src/app.js` sigue siendo la única entrada (`architecture.md`) y usa el almacén; el código ha de valer en Node 20, la mínima de `package.json` (`architecture.md` dice Node 22: la mínima manda). Solo node:fs, node:os y node:path: sin dependencias. El código de salida se fija con `process.exitCode`, para no cortar la salida pendiente.
11. **ADR 0004 la escribe el cierre**: «Las reservas se guardan en un JSON del disco», frente a «en memoria» y «SQLite»; el cierre cambia el `status` de la 0003 a `superseded by 0004`. Cumple las tres condiciones de `adr-template.md`: es difícil de deshacer una vez hay ficheros de usuario, sorprende a quien lea el código sin contexto y hubo una alternativa real.
12. **`operations.md` cambia en esta feature**: la línea «Motor de producción: sin base de datos; las reservas viven en memoria» pasa a decir que viven en el fichero de `.salas`.
13. **Pendiente — ¿`reservar` debe guardar reservas de verdad?** Hoy `reservar` devuelve el texto fijo `reserva semanal creada` y no añade nada a la lista. Lo dejo fuera (No entra) y propongo una fila aparte en el roadmap. Si lo quieres dentro, hay que decidir qué datos pide y qué hace con una sala ya ocupada. El título es tu frase, pero lo que entrega esta feature es que lo cancelado y lo anulado sobreviva.
14. **La regla de 24 h de la cancelación no entra**: `cancelar` hoy no la aplica, y esta feature no la añade ni la quita.
15. **Duplicados en el fichero**: no se validan; `cancelar` y `anular` actúan sobre la primera reserva activa de esa sala y día, como hoy.
- Resultado de probar el delta sobre una copia, con esta versión: `sdd capability merge` lo acepta (6 requisitos y las 5 reglas de `bookings`).
- Política de modelos: revisores de la spec en sonnet (dos, en paralelo, y un tercero en la segunda ronda) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — `anular` sin escenario ni valor de `status` guardado → decisión 4 fija `voided` y el delta lo comprueba con el contenido del fichero.
- **Aceptado** — texto de éxito de `anular` sin declarar → `anulada Norte lun` (el de hoy) pasa a «Avisos» y al escenario.
- **Aceptado** — regla de 24 h no tratada → decisión 14: no entra, y se dice.
- **Aceptado** — avisos y formas inesperadas sin motivo (JSON no objeto, entradas rotas, `bookings` mal formado, ruta que es una carpeta) → decisión 7 y escenarios nuevos.
- **Aceptado** — fallo al guardar sin aviso ni salida → decisión 8 y escenario.
- **Aceptado** — carpeta padre de `SALAS_DATOS` sin tratar → decisión 3 y escenario con ruta nueva.
- **Aceptado** — «Regla ante conflicto» contradecía el Scope y el anti-objetivo → reescrita como «sin garantía: un cambio puede perderse».
- **Aceptado** — «Límites» era «no aplica» y sí había → se declaran la versión única, `status` cerrado y los duplicados (decisión 15).
- **Aceptado** — el escenario de «lee al empezar» pasaba con cualquier implementación → ahora son dos `run` en el mismo proceso con el fichero cambiado entre medias.
- **Aceptado** — qué comandos leen, y `reservar` con fichero roto → decisión 8 y escenario.
- **Aceptado** — comparar texto o JSON, `SALAS_DATOS` vacía o relativa, nombre del `.tmp`, `process.exitCode`, Node 20 frente a 22 y `~` en Windows → decisiones 3, 4, 8 y 10.
- **Aceptado, parcial** — el título promete más que el Scope → la 🦆 y la decisión 13 lo acotan; el título se queda porque es la frase del dev-lead.
- **Aceptado, parcial** — «el `.tmp` no queda» probaba poco → se acota a escritura correcta, y el fallo de guardado tiene su escenario.
- **Rechazado** — claves en inglés frente a «Evitar: booking, room» → son identificadores técnicos del código, no texto de interfaz (decisión 4); renombrarlas obligaría a tocar todo `src/app.js` sin que nadie lo vea.
- **Rechazado** — guardia automática contra tests que escriban en el directorio personal → decisión 9: cuesta más que el riesgo en un proyecto de una persona.
- **Aceptado** (2.ª ronda) — el escenario de fallo al guardar no podía cumplirse, porque con una carpeta en la ruta falla antes la lectura → ahora se provoca con una ruta dentro de un fichero normal, y la lectura de «no existe» o «un tramo no es carpeta» cuenta como sin fichero (decisión 7).
- **Aceptado** (2.ª ronda) — el contrato de `run` ante un error estaba sin fijar → `run` lanza un `Error` con el aviso y `src/app.js` lo captura (Approach).
- **Aceptado** (2.ª ronda) — `bookings` frente a «Evitar» de `PRODUCT.md`, `version` no numérica, lectura fresca de `cancelar`, ruta relativa, entregables del Scope y el recuento de requisitos → decisiones 2 y 7, escenarios y Scope.
- **Aceptado** (2.ª ronda) — el estado inicial como dato de la capacidad, antes rechazado: el escenario «Sin fichero» solo miraba `libres` → ahora comprueba también que `cancelar Norte lun` funciona y `cancelar Norte mar` no.

### Decisiones tomadas con el dev-lead

- Las reservas deben sobrevivir a cerrar y volver a abrir la terminal — «que las reservas sobrevivan a cerrar y volver a abrir la terminal»
- Perfil `delegate` para esta feature — «Perfil delegate»

## Intent

Hoy cada comando de `salas` es un proceso que empieza con la lista de reservas escrita en el código y termina sin guardar nada. Cancelar la reserva de Norte del lunes solo vale hasta que acaba ese comando: el siguiente `libres 10:00-12:00` vuelve a decir «Sur». Es el límite que la decisión 0003 aceptó cuando nadie había pedido guardar; ahora se pide.

Éxito: tras `cancelar Norte lun`, un proceso nuevo, mañana o tras cerrar la terminal, ve la reserva cancelada; igual con `anular`. Se puede medir con dos ejecuciones seguidas de `node src/app.js`. Una reserva nueva hecha con `reservar` no entra: ese comando hoy no guarda nada.

Anti-objetivos, lo que lo haría fracasar aunque funcione:
- Que un fichero estropeado se pise en silencio y pierda reservas que sí existían.
- Que los tests escriban en la carpeta personal de quien los corre.
- Que la herramienta pida instalar algo: sigue sin dependencias.

## Scope

- Entra: guardar en disco el estado de las reservas que cambian los comandos existentes (`cancelar` y `anular`) y leerlo al arrancar los que miran reservas (`libres`, `cancelar`, `anular`).
- Entra: `src/store.js` nuevo y su integración en `src/app.js` (qué comandos leen, el orden «guardar y luego imprimir», `process.exitCode`).
- Entra: estado inicial sin fichero, fichero ilegible, fallo al guardar y versión del formato.
- No entra: ampliar `scripts/lint.mjs`, que solo mira `src/app.js`, para que cubra `src/store.js`.
- Entra: `test/app.test.js` y `test/cancel.test.js` aíslan su fichero con `SALAS_DATOS`.
- Entra: la línea «Motor de producción» de `operations.md`.
- No entra: que `reservar` cree reservas de verdad (decisión 13).
- No entra: la regla de 24 h de la cancelación (decisión 14).
- No entra: bloqueo entre procesos, y cualquier garantía con dos terminales escribiendo en el mismo instante.
- No entra: migrar datos viejos (no existen: la memoria no dejaba nada), caducidad o limpieza de reservas pasadas, un comando para ver o editar el fichero.
- No entra: ADR 0004 y el cambio de estado de la 0003 (los hace el cierre).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Las reservas viven en memoria» (decisión) | `.docs/sdd/decisions/0003-bookings-in-memory.md:8,22,31` | decisión 11: ADR 0004 la sustituye y la 0003 queda `superseded by 0004` (lo hace el cierre) |
| «Motor de producción: sin base de datos; las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | Scope y decisión 12 |
| «`src/` no importa `node:fs`» (la «Confirmación» de la 0003) | `.docs/sdd/decisions/0003-bookings-in-memory.md:31` | deja de cumplirse a propósito: `src/store.js` importa `node:fs` (decisión 10); la 0004 trae su propia «Confirmación» |
| Lista `bookings` escrita a mano en memoria | `src/app.js:3` | pasa a ser el estado inicial de la decisión 6, que `src/store.js` lee o escribe |
| `README.md` y `CHANGELOG.md` | `README.md`, `CHANGELOG.md` | nada que retirar; el cierre añade la entrada de `Added` |

- Filas que implementa: nada: comprobado con `git grep -n -iE "memoria|node:fs|persist" -- . ':!.docs/sdd/specs'` y con `ROADMAP.md`, que no tiene fila para la 0012.

## Approach

- **A. Un fichero JSON en `.salas`, en el directorio personal** — coste: sin bloqueo entre procesos (puede perderse un cambio concurrente) y hay que decidir ruta, formato y versión. Se prueba solo, sin dependencias, y un humano puede abrirlo.
- **B. SQLite** — coste: `node:sqlite` solo existe desde Node 22.5 y con aviso de experimental, y `package.json` declara `>=20`; si no, un paquete nuevo en un proyecto sin dependencias. Resuelve la concurrencia, que hoy nadie ha pedido.
- **C. Un fichero en la carpeta de trabajo** (`./.salas.json`) — coste: si abres la terminal en otra carpeta, las reservas «desaparecen»: es la misma pérdida que se quiere evitar.
- Elegido: **A** — es el único que cumple a la vez «sin dependencias» y «vuelvo a abrir la terminal en cualquier carpeta». Deja a la vista lo que la 0003 dijo que había que decidir: dónde vive el fichero (decisión 3), dos terminales (decisión 8) y el formato (decisiones 4 y 5).

Las partes del cómo que fija:
- `src/store.js` exporta `loadBookings()` y `saveBookings(bookings)`. `loadBookings` devuelve el estado inicial si no hay fichero y lanza un error con el motivo literal si está ilegible. `saveBookings` crea la carpeta, escribe `<ruta>.<pid>.tmp` y lo renombra; si algo falla, borra el `.tmp` y lanza el error.
- `src/app.js` carga las reservas al empezar `libres`, `cancelar` y `anular` (no al importar el módulo, para que los tests puedan elegir el fichero) y guarda solo tras un `cancelar` o `anular` con éxito. Un `cancelar` que dice `sin reserva …` no escribe. Imprime el resultado solo después de guardar.
- Contrato de `run`: ante un fichero ilegible o un fallo al guardar, lanza un `Error` cuyo mensaje es el aviso completo (`no puedo leer <ruta>: <motivo>; no he cambiado nada`). Al arrancar como programa, `src/app.js` captura ese error, escribe el mensaje por la salida de error y fija `process.exitCode = 1`.

## Dónde se prueba

- Cancelar y anular guardan: por `run`, como los tests actuales, con `SALAS_DATOS` en una carpeta temporal; el segundo paso lee el fichero con un `run` nuevo, y el contenido se compara ya leído.
- Cada comando lee al empezar: dos `run` en el mismo proceso, cambiando el fichero entre medias.
- Sobrevive entre procesos: dos ejecuciones de `node src/app.js` con la misma `SALAS_DATOS` (`child_process`), una sola vez, porque es la costura que de verdad separa dos arranques.
- Fichero ilegible, fallo al guardar, `reservar` con fichero roto, estado inicial y carpeta nueva: por `run` (el mensaje del error que lanza) y, para el código de salida y la salida de error, por `node src/app.js`. El fallo al guardar se provoca con `SALAS_DATOS` apuntando dentro de un fichero normal (`<tmp>/archivo/x.json`, donde `archivo` es un fichero): la lectura lo toma por «sin fichero» y el guardado falla igual en cualquier sistema.
- `SALAS_DATOS` relativa: por `node src/app.js` con la carpeta de trabajo en una carpeta temporal.
- La ruta por defecto (`.salas/reservas.json` del directorio personal) se prueba solo en su resolución (una función pura que recibe el directorio personal), nunca escribiendo en el real; la creación de la carpeta se prueba con una ruta de `SALAS_DATOS` que no existe.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: las reservas se guardan en un JSON del disco — alternativas descartadas: memoria del proceso (la 0003) y SQLite

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Lo cancelado y lo anulado se conserva entre ejecuciones

- GIVEN sin fichero de datos (estado inicial: `Norte · lun · 10:00-12:00 · active`)
- WHEN `cancelar Norte lun` y, en un proceso nuevo, `libres 10:00-12:00`
- THEN el primer comando dice `cancelada Norte lun` y el segundo dice `Norte, Sur`
- AND el fichero contiene la reserva de Norte con `"status": "cancelled"`
- AND con `anular Norte lun` en su lugar, dice `anulada Norte lun`, el fichero contiene la reserva con `"status": "voided"` y, en un proceso nuevo, `cancelar Norte lun` dice `sin reserva Norte lun`
- AND un `cancelar Sur mar` que dice `sin reserva Sur mar` no crea el fichero

#### ADDED — Cada comando lee el fichero al empezar

- GIVEN dos `run` seguidos de `libres 10:00-12:00` en el mismo proceso, con el fichero cambiado entre ellos (la reserva de Norte pasa a `cancelled`, como si otra terminal la hubiera cancelado)
- WHEN se ejecuta el segundo
- THEN dice `Norte, Sur`, mientras que el primero dijo `Sur`
- AND con un `cancelar Norte lun` en lugar del segundo `libres`, tras cambiar el fichero entre medias para que Norte lun esté `voided`, dice `sin reserva Norte lun`

#### ADDED — Sin fichero se parte de la reserva inicial

- GIVEN `SALAS_DATOS` apunta a una ruta que no existe
- WHEN `libres 10:00-12:00`
- THEN dice `Sur` y la ruta sigue sin existir
- AND `cancelar Norte mar` dice `sin reserva Norte mar` y `cancelar Norte lun` dice `cancelada Norte lun`: el estado inicial es la reserva de Norte del lunes y ninguna otra

#### ADDED — Dónde está el fichero

- GIVEN `SALAS_DATOS=<carpeta temporal>/nueva/x.json`, donde `nueva` no existe
- WHEN `cancelar Norte lun`
- THEN la carpeta `nueva` se crea y el fichero de datos es `<carpeta temporal>/nueva/x.json`, con `{"version": 1, "bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "cancelled"}]}` (comparado ya leído)
- AND tras esa escritura correcta la carpeta del fichero no contiene ningún `.tmp`
- AND con `SALAS_DATOS=x.json` (relativa) y la carpeta de trabajo en `<carpeta temporal>`, el fichero es `<carpeta temporal>/x.json`
- AND sin `SALAS_DATOS` o con `SALAS_DATOS` vacía, la ruta es `.salas/reservas.json` dentro del directorio personal (comprobado en la función que resuelve la ruta, sin escribir en el real)

#### ADDED — Un fichero ilegible no se toca

- GIVEN `SALAS_DATOS=<ruta>` con el contenido `{rota`
- WHEN `libres 10:00-12:00`
- THEN la salida de error dice `no puedo leer <ruta>: el contenido no es JSON válido; no he cambiado nada`, el código de salida es 1 y el contenido del fichero sigue siendo `{rota`
- AND con `{"version": 2, "bookings": []}` dice `no puedo leer <ruta>: versión 2 no soportada; no he cambiado nada`
- AND con `{"version": 1}` dice `no puedo leer <ruta>: faltan las reservas; no he cambiado nada`
- AND con `[]`, con `{"bookings": []}`, con `{"version": "1", "bookings": []}`, con `{"version": 1, "bookings": {}}` y con una entrada sin `room` dice `no puedo leer <ruta>: las reservas no tienen la forma esperada; no he cambiado nada`
- AND `cancelar Norte lun` y `anular Norte lun` con cualquiera de esos contenidos fallan igual y no escriben
- AND `reservar Norte --cada-semana` con `{rota` dice `reserva semanal creada`, con código de salida 0

#### ADDED — Un fallo al guardar no da por hecha la operación

- GIVEN `SALAS_DATOS=<carpeta temporal>/archivo/x.json`, donde `archivo` es un fichero normal
- WHEN `cancelar Norte lun`
- THEN la salida de error dice `no puedo guardar <ruta>: <motivo del sistema>`, el código de salida es 1 y no se imprime `cancelada Norte lun`
- AND `archivo` sigue siendo el mismo fichero, con el mismo contenido

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: `reservas.json` dentro de `.salas` del directorio personal, o la ruta de `SALAS_DATOS`
- **Idioma de los nombres**: las claves del fichero y los valores de `status`, en inglés, porque son identificadores técnicos; los mensajes, en castellano
- **Límites**: una sola versión del formato admitida (la 1); `status` solo vale `active`, `cancelled` o `voided`; los duplicados del fichero no se validan y los comandos actúan sobre la primera reserva activa de la sala y el día
- **Avisos**: `no puedo leer <ruta>: <motivo>; no he cambiado nada`, con los motivos `el contenido no es JSON válido`, `versión <n> no soportada`, `faltan las reservas` y `las reservas no tienen la forma esperada`; `no puedo guardar <ruta>: <motivo del sistema>`; y los de éxito de siempre: `cancelada <sala> <día>` y `anulada <sala> <día>`
- **Regla ante conflicto**: sin garantía con dos terminales escribiendo a la vez: la que escribe la última puede deshacer el cambio de la otra, porque cada una lee antes de escribir y no hay bloqueo

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
