---
id: 20261112-121834-feature-0012-persistir-reservas
feature: 0012
title: Las cancelaciones y anulaciones sobreviven a cerrar y volver a abrir la terminal
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las cancelaciones y anulaciones sobreviven a cerrar y volver a abrir la terminal

🦆 Hoy, si anulas la reserva de Norte del lunes y cierras la terminal, al volver a abrirla la reserva sigue ahí como si nada: `salas` olvida todo. Con este cambio, lo que cancelas o anulas queda guardado en un archivo de tu carpeta personal, y al volver a abrir `libres 10:00-12:00` ya cuenta Norte como libre. La primera vez, sin archivo, `salas` arranca con la reserva de ejemplo de siempre. Si el archivo está estropeado o no se puede escribir, `salas` te lo dice, sale con error y no pierde lo que había guardado.

Validación: dev-lead — lo usa una persona: cierra la terminal, la abre y mira si sus reservas siguen.

## Capacidades

- Nuevas: `booking-persistence` — qué se guarda de las reservas, dónde, cuándo y qué pasa si el archivo no se puede leer o escribir.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: datos nuevos persistentes (archivo JSON propio, sin otro consumidor), capacidad nueva · tamaño: ~110 líneas en 8 ficheros (`src/store.js`, `src/app.js`, tres tests, ADR 0007 y ADR 0004, `operations.md`, `architecture.md`)
- Dominio (sonnet): si las cinco reglas de «booking-persistence» no contradicen la constitución (castellano, git-flow) y si «reservar no entra» (decisión 9) deja el Intent sin prometer de más (señal: capacidad nueva + datos)
- Técnica (sonnet): si cada escenario de «Lo anulado sobrevive al cierre» y «Archivo ilegible» falla de verdad sin la persistencia, y si la variable `SALAS_ARCHIVO` y el gate `node --test && node scripts/lint.mjs` quedan cubiertos (señal: datos nuevos)
- Mínimo razonable: solo técnica — deja sin mirar si el Intent promete más de lo que `reservar` (que hoy no crea nada) permite cumplir

1. Esto **sustituye el ADR 0004** («el estado vive en un solo proceso»), que decía «cerrar la terminal pierde las reservas» y prohibía `node:fs` en `src/`. Se escribe un ADR 0007 al cerrar; el 0004 pasa a `superseded by 0007`, y se actualizan `operations.md` («Motor de producción», y `SALAS_ARCHIVO` en Comandos) y `architecture.md` («Un solo fichero de entrada: `src/app.js`»). La nueva Confirmación: `node:fs` solo aparece en `src/store.js`, y un test lo comprueba. **Excepción conocida**: mientras dura la rama, `src/store.js` usa `node:fs` contra el 0004 todavía vigente; el eje de Arquitectura de la revisión final no debe reportarlo, porque el 0004 se sustituye al cerrar. — es la única forma de que algo sobreviva al proceso, y el 0004 ya anticipaba el coste (dónde vive el fichero, dos terminales, el formato), que aquí se decide.
2. Capacidad nueva `booking-persistence` (slug en inglés kebab-case, contenido en castellano; los identificadores `loadBookings`/`saveBookings` siguen el `bookings` del código existente) — el proyecto no tiene `capabilities/`; esta es la primera.
3. Dónde: `~/.salas/reservas.json`, con `~` resuelto por `os.homedir()`. `SALAS_ARCHIVO` lo cambia: una cadena vacía cuenta como no definida, la ruta relativa se resuelve contra la carpeta desde la que se ejecuta, y no se expande `~`. Todos los tests fijan `SALAS_ARCHIVO` a una carpeta temporal para no tocar nunca la carpeta personal. — un archivo por persona, fuera del repo.
4. Formato: JSON `{"version": 1, "reservas": [{"room", "day", "slot", "status"}]}`, los mismos campos de hoy; `status` es `active`, `cancelled` o `voided`. Campos en inglés, como en el código: la constitución (art. 4) pide castellano en el texto de la interfaz y de los documentos, y el archivo no es ninguno de los dos. — `version` deja migrar sin adivinar.
5. Cuándo se guarda: al terminar `cancelar` o `anular`, solo si cambió una reserva (si responde `sin reserva …`, no escribe); `libres` y los demás no escriben. Antes de guardar se crea la carpeta padre del archivo, con las intermedias, si no existe.
6. Primer arranque, sin archivo (el archivo no existe, o su ruta pasa por algo que no es una carpeta: errores `ENOENT` o `ENOTDIR`): se parte de la reserva de ejemplo actual (Norte, lun, 10:00-12:00, activa). Con archivo, manda el archivo, aunque ya no contenga la de ejemplo.
7. Archivo ilegible: cualquier otro error de lectura (`EACCES`, `EISDIR`…), JSON roto, `version` distinta de 1, `reservas` que no es lista, o una reserva sin los cuatro campos como texto o con un `status` fuera de los tres. **Cualquier** comando dado, también `libres` o uno desconocido, no se ejecuta (sin comando no se lee nada, como hoy): escribe en la salida de error `no se pueden leer las reservas de <ruta>; no se ha cambiado nada` (con la ruta resuelta) y sale con código 1. Nunca se sobrescribe.
8. Fallo al guardar (sin permisos, disco lleno): escribe en la salida de error `no se pueden guardar las reservas en <ruta>: <causa>`, sale con código 1 y **no** imprime `anulada`/`cancelada`. `<causa>` es el mensaje del sistema, tal cual (en inglés). El guardado serializa antes de tocar el disco y va a `<archivo>.<pid>.tmp`, que se renombra sobre el archivo: un fallo no deja un archivo roto ni un `.tmp` sobrante. — que no mienta es lo mínimo.
9. **`reservar` no entra.** Hoy `reservar` solo devuelve «reserva semanal creada» y no crea ninguna reserva, así que lo único que puede sobrevivir es la reserva de ejemplo y sus cancelaciones/anulaciones. Crear reservas de verdad es otra feature; esta deja listo dónde se guardarán. — si esperabas que `reservar` ya guardara, dilo: cambia el alcance.
10. Dos terminales a la vez: cada proceso lee una vez al arrancar y guarda su lista entera al terminar, así que **si dos cancelaciones coinciden, la de la terminal que guarda antes puede perderse** (gana la última, aunque sean reservas distintas). No se bloquea ni se relee antes de guardar; se acepta. — el 0004 ya lo nombraba y nadie lo ha pedido.
11. Enfoque: A, un módulo `src/store.js`, frente a B (todo en `app.js`) y C (SQLite) — ver Approach. `store.js` también resuelve la ruta (`resolvePath(env)`: `SALAS_ARCHIVO` o `~/.salas/reservas.json`); `app.js` solo importa `store.js`. La carga, el guardado y los mensajes de error van en el bloque `if (command)` del final de `app.js` —el que hoy ya imprime el resultado—, no en `run()`, que sigue devolviendo texto: importar `run` desde un test nunca toca disco. Ese bloque carga las reservas, ejecuta el comando, compara el estado antes y después y guarda solo si cambió.
12. Política de modelos: revisores de la spec con Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`
13. Resultado del delta sobre una copia de `.docs/sdd`: `sdd capability merge` creó `booking-persistence.md` con los 8 requisitos y las 5 reglas de esta versión, sin rechazos.

### Hallazgos de la review

- **Aceptado** (Crítico, técnica) el escenario de supervivencia no cubría `cancelar` ni fijaba el archivo → escenarios separados para `anular` y `cancelar`, cada uno con THEN sobre el contenido del archivo y el segundo `libres` en otro proceso.
- **Aceptado** (Crítico, técnica) «Archivo ilegible» solo cubría JSON roto, sin canal de salida ni ruta → escenarios para `{roto`, `version: 2` y un campo inválido; mensaje en la salida de error con la ruta resuelta; también falla `libres` (decisión 7).
- **Aceptado** (dominio+técnica) «Primer arranque» y «Consultar no escribe» eran casi idénticos y no probaban que manda el archivo → «Primer arranque» pasa a un archivo con `reservas: []` que da `Norte, Sur`; «Consultar no escribe» tiene variante con archivo existente.
- **Aceptado** (técnica) creación de `~/.salas/`, formato guardado y fallo de escritura sin cubrir → escenarios «Primer guardado crea la carpeta» y «Fallo al guardar», guardado atómico (decisiones 5 y 8).
- **Aceptado** (técnica) decisiones tomadas en el cuerpo → promovidas a 3, 5, 7, 8 y 11; límites y avisos de la capacidad corregidos.
- **Aceptado** (técnica) contrato de `SALAS_ARCHIVO` → decisión 3, y documentación en `operations.md` al cerrar.
- **Aceptado** (técnica) Confirmación del ADR 0007 sin test → un test comprueba que `node:fs` solo está en `src/store.js` (Dónde se prueba).
- **Aceptado** (técnica) `architecture.md` dice «un solo fichero» → fila en «Lo que se retira o cambia de forma».
- **Aceptado** (técnica) pérdida de actualizaciones con dos procesos → escrita en la decisión 10.
- **Aceptado** (dominio) `~` en Windows → `os.homedir()` (decisión 3).
- **Aceptado en parte** (técnica) actualizar el ADR 0004 en la primera task → no se mueve (ni los tests ni `scripts/lint.mjs`, que solo comprueba tabuladores, hacen cumplir su Confirmación, y el ADR se cierra con el resto de la documentación), pero la violación temporal queda escrita como excepción conocida en la decisión 1 para que la revisión de Arquitectura no la reporte (segunda ronda: el motivo anterior no bastaba).
- **Rechazado** (dominio) renombrar el slug y los identificadores por la terminología de `PRODUCT.md` → esa regla es de texto en castellano; el slug va en inglés por la plantilla de capacidades y los identificadores siguen el código existente (`bookings`, `room`).
- **Rechazado** (dominio) distinguir cancelación de anulación en la spec → en esta feature solo cambian el mensaje y el `status`; lo que persiste es igual. Sí se añade un escenario para cada una.

- **Aceptado** (Crítico, segunda ronda) «Fallo al guardar» acababa en «ilegible» porque leer una ruta bajo un archivo da `ENOTDIR` → `ENOENT` y `ENOTDIR` cuentan como «sin archivo» y cualquier otro error de lectura es ilegible (decisiones 6 y 7); en el escenario la carga da «sin archivo» y falla solo el guardado.
- **Aceptado** (segunda ronda) código de salida y mensajes se comprobaban en `store.js`, donde no se ven → pasan al test con `child_process`; el guardado vive en el bloque `if (command)` de `app.js` y detecta el cambio comparando el estado antes y después (decisión 11).
- **Aceptado** (segunda ronda) decisión 13 obsoleta → delta vuelto a pasar con la versión final: 8 requisitos y 5 reglas.
- **Aceptado** (segunda ronda) guardado atómico sin escenario → escenario «Guardado atómico» y nombre del temporal con el pid (decisión 8).
- **Aceptado** (segunda ronda) quién resuelve la ruta y qué es «ejecutado como programa» → `store.js` resuelve la ruta; el bloque `if (command)` de `app.js` es lo que no corre al importar `run` (decisión 11).
- **Aceptado** (segunda ronda) carpeta de `~/.salas/` frente a la de `SALAS_ARCHIVO`; causa en inglés; comandos afectados; fecha de modificación poco fiable; recuento de ficheros y tests; título más acotado → decisiones 5, 7 y 8, escenario «Consultar no escribe» con `utimes`, cabecera de la review y título.

### Decisiones tomadas con el dev-lead

- Perfil `delegate` — viene de `sdd-kit.json`, no lo dijo el dev-lead en esta sesión.

## Intent

Hoy cada arranque de `salas` empieza con el estado de fábrica: una reserva de ejemplo, y todo cambio se pierde al salir (ADR 0004). Para una herramienta de reservas eso es lo que más molesta: lo que anulaste ayer vuelve a aparecer. Éxito: tras `anular Norte lun` y reabrir la terminal, `libres 10:00-12:00` responde `Norte, Sur`, sin que nadie haga nada más. Sería un fracaso, aunque «funcione», que un archivo roto hiciera perder las reservas guardadas sin avisar, que un fallo al guardar dijera `anulada` sin haber guardado, o que `salas` escribiera en disco al solo consultar.

## Scope

- Entra: leer las reservas al arrancar y guardarlas tras `cancelar` y `anular`; el archivo, su formato, su ruta y `SALAS_ARCHIVO` (decisiones 3 y 4); la creación de la carpeta del archivo; los mensajes de archivo ilegible y de fallo al guardar; el test de la Confirmación; el ADR 0007 y la actualización de `operations.md` y `architecture.md` al cerrar.
- No entra: `reservar` (decisión 9); bloqueo entre procesos (decisión 10); migración de formatos (solo existe `version: 1`); comando para vaciar o inspeccionar el archivo; sincronizar entre equipos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «El estado vive en un solo proceso» / «cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0004-single-process-state.md` | decisión 1: ADR 0007, 0004 → `superseded by 0007` al cerrar |
| `Motor de producción: sin base de datos; las reservas viven en memoria` | `.docs/sdd/steering/operations.md:14` | decisión 1: se reescribe al cerrar («archivo JSON en `~/.salas/reservas.json`») y se añade `SALAS_ARCHIVO` a Comandos |
| `Un solo fichero de entrada: src/app.js` | `.docs/sdd/steering/architecture.md:5` | decisión 1: se reescribe al cerrar (`app.js` entra, `store.js` guarda) |
| `bookings` como constante en memoria de `app.js` | `src/app.js:3` | pasa a cargarse de `src/store.js` (Approach) |

- Filas que implementa: ninguna (la 0012 se reservó con la rama, sin fila en `ROADMAP.md`) → nada más la nombra: comprobado con `git grep -n "0012"`.

## Approach

- A: módulo `src/store.js` con `loadBookings(path)` y `saveBookings(path, bookings)` (guardado atómico: archivo temporal y renombrado); `app.js` las llama, en el bloque `if (command)` del final, antes de ejecutar el comando y después si el estado cambió; `store.js` también resuelve la ruta. — un fichero nuevo; `node:fs` queda en un solo sitio y se prueba solo, con una ruta temporal.
- B: leer y escribir dentro de `app.js`. — menos ficheros, pero `app.js` importa `node:fs` y los tests de `run()` tocarían disco sin una costura clara.
- C: `node:sqlite`. — tipos y consultas que no hacen falta con una lista de reservas; añade el «cómo se migra» que el 0004 temía.
- Elegido: A — la ruta entra por parámetro, así los tests usan una carpeta temporal (`SALAS_ARCHIVO`) y nunca la carpeta personal.

`run(cmd, params)` sigue devolviendo texto y sus tests actuales no cambian. Los errores de lectura y de escritura los trata ese bloque de `app.js`: imprime el mensaje por la salida de error y fija el código de salida.

## Dónde se prueba

- Leer, guardar, validar el contenido, `resolvePath` y el guardado atómico: `src/store.js` directamente, con una carpeta temporal, como `test/*.test.js` hoy.
- Todo lo que se ve desde fuera —supervivencia entre procesos, código de salida, salida de error, que no se imprima `anulada`, que `libres` no escriba—: arrancando `node src/app.js` con `child_process` y `SALAS_ARCHIVO` en la carpeta temporal; es el único modo de ver un proceso nuevo. Entra en el gate `node --test`.
- La Confirmación del ADR 0007: un test que lee `src/` y falla si `node:fs` aparece fuera de `store.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: guardar el estado en un archivo JSON personal frente a memoria o SQLite (sustituye al 0004)

## Delta de comportamiento

### Capacidad: `booking-persistence`

#### ADDED — Lo anulado sobrevive al cierre

- GIVEN `SALAS_ARCHIVO` apunta a un archivo que no existe
- WHEN se ejecuta `anular Norte lun` y, en un proceso nuevo con el mismo `SALAS_ARCHIVO`, `libres 10:00-12:00`
- THEN el primero responde `anulada Norte lun`, el archivo contiene `version` 1 y una reserva Norte lun 10:00-12:00 con `status` `voided`, y el segundo responde `Norte, Sur`

#### ADDED — Lo cancelado sobrevive al cierre

- GIVEN `SALAS_ARCHIVO` apunta a un archivo que no existe
- WHEN se ejecuta `cancelar Norte lun` y, en un proceso nuevo con el mismo `SALAS_ARCHIVO`, `libres 10:00-12:00`
- THEN el primero responde `cancelada Norte lun`, el archivo contiene la reserva Norte lun con `status` `cancelled`, y el segundo responde `Norte, Sur`

#### ADDED — Primer guardado crea la carpeta

- GIVEN `SALAS_ARCHIVO` apunta a `<tmp>/nueva/reservas.json` y `<tmp>/nueva` no existe
- WHEN se ejecuta `anular Norte lun`
- THEN existe `<tmp>/nueva/reservas.json` con JSON válido `{"version": 1, "reservas": [...]}`

#### ADDED — Consultar no escribe

- GIVEN `SALAS_ARCHIVO` apunta a un archivo que no existe
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Sur` y el archivo sigue sin existir
- AND con un archivo existente cuya fecha de modificación se fijó antes a una fecha antigua (`utimes`), contenido y fecha son los mismos tras ejecutar `libres 10:00-12:00`
- AND `anular Sur mar` (responde `sin reserva Sur mar`) tampoco escribe

#### ADDED — Con archivo manda el archivo

- GIVEN `SALAS_ARCHIVO` apunta a un archivo con `{"version": 1, "reservas": []}`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Norte, Sur`, aunque la reserva de ejemplo ya no esté

#### ADDED — Archivo ilegible

- GIVEN el archivo contiene `{roto`
- WHEN se ejecuta `anular Norte lun`
- THEN sale con código 1, la salida de error dice `no se pueden leer las reservas de <ruta>; no se ha cambiado nada` con la ruta de `SALAS_ARCHIVO`, y el archivo sigue conteniendo `{roto`
- AND con `{"version": 2, "reservas": []}`, o con una reserva con `status` `cerrada`, ocurre lo mismo
- AND `libres 10:00-12:00` con el archivo roto también sale con código 1 y el mismo mensaje

#### ADDED — Fallo al guardar

- GIVEN `SALAS_ARCHIVO` apunta a `<tmp>/archivo-normal/reservas.json`, donde `archivo-normal` es un archivo (la lectura da «sin archivo» y la carpeta padre no se puede crear)
- WHEN se ejecuta `anular Norte lun`
- THEN sale con código 1, la salida de error dice `no se pueden guardar las reservas en <ruta>: <causa>`, y no se imprime `anulada Norte lun`

#### ADDED — Guardado atómico

- GIVEN `SALAS_ARCHIVO` apunta a un archivo válido con una reserva
- WHEN se llama a `saveBookings` con un estado que no se puede serializar
- THEN falla antes de tocar el disco: el contenido original sigue intacto y no queda ningún `.tmp`
- AND tras un guardado correcto, la carpeta contiene solo `reservas.json`, sin `.tmp`
- AND este escenario se prueba en `store.js` directamente: desde el programa no hay forma de forzar un fallo del renombrado

#### Reglas de la capacidad — booking-persistence

- **Dónde viven los datos**: `~/.salas/reservas.json` (`~` por `os.homedir()`), o la ruta de `SALAS_ARCHIVO` (vacía = no definida; relativa a la carpeta de ejecución; sin expandir `~`)
- **Idioma de los nombres**: mensajes en castellano (ADR 0002); campos y valores de `status` del archivo en inglés, como en el código
- **Límites**: sin tope de reservas ni de tamaño del archivo
- **Avisos**: dos, por la salida de error y con código 1: archivo ilegible y fallo al guardar
- **Regla ante conflicto**: gana la última terminal que guarda; se puede perder el cambio de la otra

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
