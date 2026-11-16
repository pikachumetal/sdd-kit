---
id: 20261116-111652-feature-0012-reservas-persistentes
feature: 0012
title: Las reservas sobreviven a cerrar la terminal
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar la terminal

🦆 Hoy, cada vez que ejecutas `salas` las reservas empiezan de cero: si cancelas la de Norte del lunes y vuelves a abrir la terminal, `libres 10:00-12:00` sigue diciendo `Sur` porque Norte «vuelve» a estar reservada. Con este cambio, cancelar (o anular) deja el resultado guardado en un fichero de tu carpeta personal, y al volver `libres 10:00-12:00` dice `Norte, Sur`. Por dentro: se lee un JSON al arrancar y se reescribe entero solo cuando una reserva cambia. Esto deshace el ADR 0003 («en memoria»), que habrá que sustituir.

Validación: dev-lead — lo que la persona hace en su terminal (cerrar, volver a abrir y mirar `libres`); el agente puede medir dos arranques, pero el sitio del fichero y el aviso de fichero roto son cosas que quien usa la herramienta debe ver.

## Capacidades

- Nuevas: `booking-persistence` — las reservas se guardan en disco y se recuperan en el siguiente arranque.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (siete puntos) — señales: capacidad nueva, datos persistentes nuevos (fichero JSON) · tamaño: ~45 líneas de código y ~70 de tests, más 3 documentos, en 8 ficheros (`store.js`, `app.js`, 3 tests, `operations.md`, `architecture.md`, ADR)
- Único (sonnet): si los THEN de la capacidad cubren lo que la spec promete (fichero ausente, roto, solo-lectura sin escribir) y si las decisiones del cuerpo están todas aquí (señal: datos nuevos)
- Mínimo razonable: sin revisión — deja sin mirar un hueco entre el Intent y los escenarios (p. ej. qué pasa con un fichero roto)

### Hallazgos de la review

- **Aceptado** — Crítico: ningún THEN comprueba la ruta por defecto ni el contenido del fichero → escenario «El fichero guardado tiene las claves y la ruta previstas».
- **Rechazado** — Crítico: el escenario de la reserva de ejemplo fija como requisito algo pendiente de ti → es el comportamiento de hoy (los tests lo usan); lo dejo en el delta y, si decides quitar la reserva de ejemplo (decisión 3), se corrige con una enmienda.
- **Aceptado** — Importante: `libres` con fichero roto, forma inválida y guardar fallido → escenarios y decisiones 13 y 14.
- **Aceptado** — Importante: decisiones de cuerpo fuera de ✋ → decisiones 15, 17 y 18.
- **Aceptado** — Importante: «Límites: no aplica» → «sin tope ni purga» (decisión 15).
- **Rechazado** — Importante: posible `MODIFIED` no declarado de cancelar/anular/`libres` → `sdd capability index` dice «Sin capacidades»: no hay requisito vivo que modificar.
- **Aceptado** — Importante: `architecture.md` y `PRODUCT.md` → fila nueva en la tabla y decisión 18.
- **Aceptado** — Menor: recalcular tamaño y acotar la afirmación del `git grep` → decisión 12.
- **Aceptado** — Menor: «dos terminales» sin escenario → decisión 16 (declarativo).

Segunda ronda (sin tercera):

- **Rechazado** — Crítico: los escenarios dependen de la reserva de ejemplo, pendiente de ti → mismo motivo que arriba: es el comportamiento actual y está marcada ⚠️ en la decisión 3. **Es lo primero que necesito de ti**; si la quitas, los GIVEN pasan a crear su reserva en el fichero.
- **Aceptado** — Crítico: «ilegible» sin casos de forma inválida ni de errores de lectura → el escenario añade `[{"room":"Norte"}]`, `[]` válido y una ruta que es una carpeta.
- **Aceptado** — Importante: carpeta sin permiso no es reproducible → el escenario usa una ruta cuyo padre es un fichero normal.
- **Aceptado** — Importante: el test de la ruta por defecto escribiría en el HOME real → «Dónde se prueba» redirige `HOME` y `USERPROFILE` a una carpeta temporal; `SALAS_DATOS` vacío tiene su AND.
- **Aceptado** — Importante: con fichero roto fallan todas las órdenes → decisión 5 y escenario lo dicen (cualquier orden, salida 1).
- **Aceptado** — Importante: segundo aviso fuera de las reglas → añadido a «Avisos».
- **Rechazado** — Importante: guardar antes de responder por stdout → se responde y, si falla guardar, el aviso y la salida 1 lo dicen (decisión 14); cambiar el orden no aporta nada a quien lo ve en la terminal.
- **Rechazado** — Importante: `PRODUCT.md` → no se toca; la excepción de nombres vive en la decisión 18. Los «3 documentos» son `operations.md`, `architecture.md` y el ADR.
- **Rechazado** — Menor: hallazgos y verificaciones dentro de ✋ → es donde la plantilla los pide; la decisión pendiente va marcada ⚠️.
- **Aceptado** — Menor: invocación y versión → «Dónde se prueba»: `node src/app.js <orden>`; solo `node:fs`, `node:os` y `node:path`, válidos en Node 20 y 22.

1. **Enfoque: A (fichero JSON), frente a B (SQLite) y C (registro de eventos)** — ver Approach.
2. **Dónde vive el fichero**: `~/.salas/reservas.json`, y la variable de entorno `SALAS_DATOS` lo sustituye (ruta completa del fichero). Nadie dijo dónde; la variable existe para que los tests no toquen tus reservas reales.
3. **La reserva de ejemplo del primer arranque se conserva**: sin fichero, se parte de la reserva que hoy está fijada en el código (Norte, lun, 10:00-12:00) y se guarda al primer cambio. Lo hago para no romper los tests ni el comportamiento actuales. ⚠️ **Pendiente de ti**: si esa reserva es solo de demostración, debería desaparecer en este cambio (y los tests, crear la suya); no lo sé y no lo he decidido.
4. **Solo se escribe cuando algo cambia** (`cancelar`, `anular` con éxito). `libres`, `reservar` y `salas` no crean ni tocan el fichero.
5. **Fichero ilegible**: sale por stderr `reservas ilegibles en <ruta>: corrígelo o bórralo`, código de salida 1, y no se modifica el fichero, con **cualquier** orden (también `salas`, `libres`, `reservar`: se carga al arrancar). Texto y código, míos. Nunca se parte de cero en silencio sobre un fichero que existe: perdería tus reservas.
6. **Dos terminales a la vez**: gana la última escritura; no hay bloqueo. Es una herramienta de una sola persona y cada orden dura milisegundos. Escritura atómica (fichero temporal y renombrar) para que un corte no deje el JSON a medias.
7. **Formato**: un JSON con la lista de reservas tal cual hoy en memoria (`room`, `day`, `slot`, `status`), sin campo de versión. Sin migraciones hasta que haga falta.
8. **Idioma de los nombres del fichero**: las claves siguen como en el código (`room`, `day`, `slot`, `status`) porque es el formato interno; el texto que ve la persona sigue en castellano.
9. **El ADR 0003 se sustituye** por uno nuevo al cerrar (lo escribe `sdd-archive`); `operations.md` cambia su línea de «Motor de producción».
10. **`reservar` no entra**: hoy solo imprime `reserva semanal creada` y no crea nada, así que lo único que persiste de verdad es cancelar y anular. Hacer que `reservar` cree reservas es otro cambio (propongo una fila nueva); lo señalo porque el valor de esta feature es menor hasta entonces.
11. **Sin división**: ~3 tasks (lectura/escritura, aislar los tests existentes y el de dos procesos, documentos); no toca varias superficies.
12. **Repaso de coherencia**: el delta probado sobre una copia de `.docs/sdd` da `booking-persistence.md: añadido` (escenarios y reglas), sin rechazos; el `git grep` sobre `.docs` de lo retirado solo encuentra el ADR 0003, `operations.md:14` y `architecture.md`; la fila de `src/app.js:3` la localicé leyendo el código.
13. **«Ilegible» incluye un JSON válido que no sea una lista de reservas** (`{}`, un objeto, reservas sin `room`/`day`/`slot`/`status`): mismo aviso y salida 1. Nunca se parte de cero sobre un fichero que existe.
14. **`SALAS_DATOS` vacío cuenta como no definido.** Si no se puede guardar (carpeta sin permiso, disco lleno): stderr `no se puede guardar en <ruta>: <motivo del sistema>`, salida 1; la orden ya respondió por stdout.
15. **Sin tope ni purga**: el fichero guarda también las canceladas y anuladas para siempre; son pocas y solo una persona. Un `.tmp` huérfano tras un corte se sobrescribe en la siguiente escritura; nadie lo limpia.
16. **Solo declarativo, sin escenario**: «gana la última escritura» y «un corte no deja el JSON a medias» (decisión 6) no se prueban; reproducir una carrera entre dos procesos sería frágil y no lo pidió nadie.
17. **Nombres internos**: `src/store.js` con `load()`/`save()`, carga al importar `src/app.js` (por eso los tests fijan `SALAS_DATOS` antes de importar) y carpeta creada si falta; decisiones mías, de plan, no de comportamiento.
18. **`room`/`booking` en las claves del fichero** son excepción deliberada a la terminología de `PRODUCT.md` (sala/reserva): es el nombre interno que ya usa el código.
- Política de modelos (solo en `delegate`): revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Las reservas sobreviven a cerrar y volver a abrir la terminal — «que las reservas sobrevivan a cerrar y volver a abrir la terminal». Perfil delegate, del proyecto. El porqué (qué vas a hacer con ello) no lo contó la petición: lo deduzco del producto y va a Intent como suposición.

## Intent

Hoy las reservas viven en la memoria del proceso (ADR 0003) y cada arranque empieza igual: lo que cancelas o anulas se pierde al cerrar la terminal. Suposición mía (no la dijiste): usas `salas` a lo largo de varios días y no quieres rehacer lo que ya hiciste. Éxito: cancelar `Norte lun`, cerrar, abrir de nuevo y que `libres 10:00-12:00` diga `Norte, Sur`. Fracaso aunque «funcione»: perder o machacar reservas por un fichero roto, o que los tests escriban en tus reservas reales.

## Scope

- Entra: guardar y recuperar las reservas en un fichero JSON; escribir solo al cambiar; aviso con salida 1 si el fichero es ilegible; `SALAS_DATOS`; aislar los tests existentes (`test/app.test.js`, `test/cancel.test.js`) para que usen un fichero temporal; un test con dos procesos reales; actualizar `operations.md` y marcar el ADR 0003 como sustituido al cierre.
- Entra también: nuevo módulo `src/store.js` (se anota en `architecture.md`, que hoy dice «un solo fichero de entrada»).
- No entra: que `reservar` cree reservas; migraciones o versión de formato; bloqueo entre terminales; SQLite; cambiar la reserva de ejemplo (a la espera de tu respuesta a la decisión 3).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Las reservas viven en memoria del proceso» (cada arranque empieza vacío) | `.docs/sdd/decisions/0003-bookings-in-memory.md:8,22,31` | decisiones 1 y 9: el ADR 0003 pasa a sustituido por uno nuevo, al cierre |
| «sin base de datos; las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | decisión 9 y Scope: nueva línea «fichero JSON en `~/.salas/reservas.json`» |
| `bookings` como constante en memoria con la reserva de ejemplo | `src/app.js:3` | Approach: pasa a cargarse del fichero; el ejemplo es el valor inicial (decisión 3) |
| «Un solo fichero de entrada: `src/app.js`» | `.docs/sdd/steering/architecture.md:5` | Scope: se añade `src/store.js` y que solo se usa `node:fs`, `node:os` y `node:path` |
| Confirmación del ADR 0003: «`src/` no importa `node:fs`» | `.docs/sdd/decisions/0003-bookings-in-memory.md:31` | el ADR nuevo cambia la confirmación (`src/` solo importa `node:fs`, `node:os` y `node:path`) |

- Filas que implementa: nada: comprobado con `git grep -nE "0012|persist" -- ROADMAP.md .docs` (la feature no tenía fila; nace de la petición)

## Approach

- **A. Fichero JSON**, leído al arrancar y reescrito entero al cambiar — cuesta: decidir sitio y formato (decisiones 2, 6, 7), y que dos terminales a la vez se pisen (decisión 6). Sin dependencias.
- **B. SQLite** — cuesta: `node:sqlite` es experimental en Node 22 y `package.json` admite Node ≥20; un paquete externo rompe «sin dependencias» (`architecture.md`). Desproporcionado para una lista de pocas reservas.
- **C. Registro de eventos (append)** — cuesta: hay que reconstruir el estado al leer y compactar; sin ganancia con tan pocas reservas y un solo usuario.
- Elegido: **A** — es lo mínimo que cumple la petición, no añade dependencias y el formato es legible a mano.

Partes del cómo que fija A: un módulo pequeño `src/store.js` con `load()` y `save(bookings)`; `src/app.js` carga al arrancar y llama a `save` tras `cancelBooking`/`voidBooking` con éxito; ruta = `process.env.SALAS_DATOS ?? ~/.salas/reservas.json` (crea la carpeta si falta); escritura a `<ruta>.tmp` y `rename`. Los tests ponen `SALAS_DATOS` a una carpeta temporal **antes** de importar `src/app.js`, cada fichero de test con la suya (`node --test` los ejecuta en procesos aparte, y compartir fichero haría que `cancel.test.js` cambiara lo que ve `app.test.js`).

## Dónde se prueba

- Aislamiento: todo test fija `SALAS_DATOS` a una carpeta temporal; el de la ruta por defecto redirige `HOME` y `USERPROFILE` a una carpeta temporal. Solo se usan `node:fs`, `node:os` y `node:path` (válidos en Node 20 y 22).
- Persistencia entre arranques: arrancando `node src/app.js <orden>` (argumentos de línea de comandos) dos veces con el mismo `SALAS_DATOS` (frontera de proceso real, que es lo que cerrar la terminal produce); no hay patrón previo, el resto de tests llaman a `run` en el mismo proceso.
- Lectura sin escribir y cancelar/anular persisten: por `run`, como `test/cancel.test.js`, con `SALAS_DATOS` temporal.
- El aviso de fichero roto y su código de salida: por el arranque de proceso (stderr y `exit 1` solo se ven ahí).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: «Las reservas se guardan en un fichero JSON en la carpeta personal» — alternativas descartadas: en memoria (ADR 0003, que sustituye), SQLite.

## Delta de comportamiento

### Capacidad: `booking-persistence`

#### ADDED — Cancelar y anular quedan guardados

- GIVEN la reserva de Norte del lunes 10:00-12:00 activa y `libres 10:00-12:00` responde `Sur`
- WHEN `cancelar Norte lun` y, tras cerrar el proceso, se arranca de nuevo con `libres 10:00-12:00`
- THEN la primera orden responde `cancelada Norte lun` y la segunda `Norte, Sur`
- AND con `anular Norte lun` en lugar de `cancelar`, la primera responde `anulada Norte lun` y la segunda `Norte, Sur`

#### ADDED — Sin fichero se parte de la reserva de ejemplo y no se crea nada al leer

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Sur` y el fichero sigue sin existir

#### ADDED — Solo se escribe cuando hay un cambio

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN se ejecuta `cancelar Sur mar` (no hay reserva)
- THEN responde `sin reserva Sur mar` y el fichero sigue sin existir

#### ADDED — El fichero guardado tiene las claves y la ruta previstas

- GIVEN `SALAS_DATOS` no definido (o vacío) y la carpeta personal sin `.salas`
- WHEN se ejecuta `cancelar Norte lun`
- THEN existe `~/.salas/reservas.json`, que es un JSON con la lista `[{"room":"Norte","day":"lun","slot":"10:00-12:00","status":"cancelled"}]`
- AND con `anular Norte lun`, el `status` guardado es `voided`
- AND con `SALAS_DATOS=""` ocurre lo mismo que sin definir

#### ADDED — Un fichero ilegible no se pisa

- GIVEN `SALAS_DATOS` apunta a un fichero cuyo contenido es `{no es json`
- WHEN se ejecuta `cancelar Norte lun`
- THEN stderr dice `reservas ilegibles en <ruta>: corrígelo o bórralo`, el código de salida es 1 y el contenido del fichero sigue siendo `{no es json`
- AND lo mismo con cualquier otra orden (`libres 10:00-12:00`, `salas`, `reservar Norte --cada-semana`) y con un fichero cuyo contenido es `{}`, `[{"room":"Norte"}]` o cuya ruta es una carpeta
- AND un fichero con `[]` no es ilegible: `libres 10:00-12:00` responde `Norte, Sur`

#### ADDED — Si no se puede guardar, se dice

- GIVEN `SALAS_DATOS` apunta a una ruta cuya carpeta padre es un fichero normal (no se puede crear)
- WHEN se ejecuta `cancelar Norte lun`
- THEN stdout dice `cancelada Norte lun`, stderr dice `no se puede guardar en <ruta>: <motivo del sistema>` y el código de salida es 1

#### Reglas de la capacidad — booking-persistence

- **Dónde viven los datos**: `~/.salas/reservas.json`; `SALAS_DATOS` lo sustituye por la ruta completa del fichero.
- **Idioma de los nombres**: las claves del fichero son `room`, `day`, `slot`, `status` (formato interno); lo que ve la persona, en castellano.
- **Límites**: sin tope ni purga; las reservas canceladas y anuladas se guardan para siempre.
- **Avisos**: `reservas ilegibles en <ruta>: corrígelo o bórralo` y `no se puede guardar en <ruta>: <motivo del sistema>` (stderr, salida 1).
- **Regla ante conflicto**: con dos terminales a la vez gana la última escritura.

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
