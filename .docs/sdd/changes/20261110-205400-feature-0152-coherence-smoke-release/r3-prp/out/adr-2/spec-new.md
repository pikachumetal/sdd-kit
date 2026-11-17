---
id: 20261111-195807-feature-0012-persistir-reservas
feature: 0012
title: Las reservas sobreviven a cerrar y volver a abrir la terminal
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar y volver a abrir la terminal

🦆 Hoy, si cancelas la reserva de Norte del lunes y cierras la terminal, al volver a abrirla la reserva está otra vez activa. Con este cambio la cancelación (y la anulación) queda guardada en un fichero de tu carpeta personal: al abrir de nuevo, `salas libres 10:00-12:00` responde `Norte, Sur`. Si el fichero está estropeado, `salas` se niega a seguir y dice cuál es, en vez de borrarlo. Ojo: `reservar` todavía no crea reservas de verdad, así que lo que se guarda es la reserva que ya existe y lo que le pase.

Validación: dev-lead — es lo que una persona hace con la terminal (cerrar, abrir, mirar); un test no sustituye verlo en su carpeta.

## Capacidades

- Nuevas: `reservations` — las reservas guardadas entre sesiones: dónde viven, cómo sobreviven a cerrar la terminal y qué pasa con un fichero ilegible.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservations`), contrato público (el formato del fichero en disco), datos persistentes nuevos · tamaño: ~150 líneas en 5 ficheros
- Dominio (sonnet): si los escenarios de «Las reservas se guardan entre sesiones» cubren cancelar y anular con datos, y si «la reserva de arranque» es una regla de producto sin dueño (señal: capacidad nueva)
- Técnica (sonnet): si la escritura atómica y «dos terminales» de la decisión 5 se sostienen sin bloqueo, y si el formato `version: 1` deja migrar (señal: contrato público + datos persistentes)
- Mínimo razonable: solo técnica — deja sin mirar si la reserva de arranque y los textos de error son los que querría quien usa la herramienta

1. Enfoque: un fichero JSON que se lee entero en cada comando y se reescribe solo cuando un comando cambia el estado, frente a un registro de eventos (JSONL) y a `node:sqlite` (ver Approach).
2. Dónde vive: `~/.salas/reservas.json` (con `os.homedir()`), o la ruta de la variable de entorno `SALAS_FICHERO` si está definida y no vacía; vacía cuenta como no definida. Nadie dijo dónde; la variable existe para que los tests no toquen la carpeta personal y para quien quiera otro sitio.
3. Formato, en castellano: `{"version": 1, "reservas": [{"sala": "Norte", "dia": "lun", "franja": "10:00-12:00", "estado": "activa"}]}`, con `estado` ∈ `activa` · `cancelada` · `anulada`. Lo corregí tras la review: el vocabulario de `PRODUCT.md` evita `booking` y `room`, y el fichero es un contrato que queda fijado en disco. `anular` escribe `anulada` y `cancelar` escribe `cancelada`, así se conserva la distinción cancelación/anulación.
4. Primer arranque, sin fichero: el estado inicial es la reserva que el código ya trae (Norte, lun, 10:00-12:00, activa). Así `libres` y los tests actuales no cambian. El fichero se crea la primera vez que un comando cambia algo, no al leer. Deuda que acepto: ese dato de ejemplo acaba escrito en tu fichero real al primer cambio; quitarlo es otra fila.
5. Dos terminales: cada comando lee el fichero al empezar, así que una terminal ve lo que la otra ya cambió. Si dos comandos escriben a la vez, no hay garantía: el último en renombrar gana, sin bloqueo (no se prueba). La escritura es atómica: fichero temporal con sufijo único (`<ruta>.<pid>.tmp`) y renombrado, para que un corte no deje el fichero a medias.
6. «Fichero ilegible» se define así: no es JSON, está vacío, no es `version: 1`, no tiene la lista `reservas`, o alguna entrada no tiene `sala`, `dia` y `franja` como texto y un `estado` de los tres admitidos. Se valida cada entrada; que la sala o la franja existan no se comprueba. Texto: `salas: no se puede leer <ruta>: formato no reconocido`, código de salida 1, sin tocar el fichero. No se arranca de cero encima: sería perder las reservas sin avisar.
7. Si escribir falla (carpeta que no se puede crear, disco lleno, sin permisos): código de salida 1 y `salas: no se puede guardar <ruta>: <motivo del sistema>`; el fichero anterior queda como estaba. Permisos: los que dé el sistema por defecto, sin tocarlos.
8. Fichero nuevo `src/store.js` con la lectura y la escritura; `src/app.js` sigue siendo la entrada y solo lo llama. Se separa para probar el fichero sin pasar por los comandos. Dentro del código se renombra el estado a los valores del fichero (`activa`, `cancelada`, `anulada`) para no traducir.
9. ADR y documentos: esta feature contradice la ADR 0003 («las reservas viven en memoria»). El cierre escribe la ADR 0004 (reservas en un fichero JSON, frente a SQLite y a seguir en memoria), marca la 0003 como `superseded by 0004`, reescribe la línea «Motor de producción» de `operations.md` y añade a `architecture.md` que `src/store.js` guarda las reservas. No lo hago aquí: lo hace `sdd-archive`.
10. Nombre de la capacidad nueva: `reservations` (nombre de fichero en inglés kebab-case, contenido en castellano).
11. Política de modelos: revisores de la spec en sonnet (dominio y técnica), en paralelo · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo previstos.
12. Repaso de coherencia: el delta probado en una copia de `.docs/sdd` con `sdd capability merge` (versión final: 6 requisitos y 5 reglas añadidos, `reservations.md` creada, sin rechazos); `git grep` de lo retirado hecho (tabla de arriba); `node --test` de hoy: 4 de 4 en verde. Sin medir: que sin aislamiento los tests existentes fallen en la segunda ejecución (es un razonamiento sobre el código, no una medida); el Task 2 los aísla igualmente.
13. Comportamiento que ya tenía el código y la spec fija: `cancelar` y `anular` sobre una reserva ya cancelada o anulada responden `sin reserva <sala> <día>` y no escriben; `libres` solo lee y nunca escribe; todo error termina con código de salida 1. Lo de la reserva ya cancelada es una regla de dominio que nadie decidió expresamente: valídala.

### Hallazgos de la review

Primera ronda, dominio:

- **Aceptado** — Crítico: claves del fichero en inglés contra `PRODUCT.md` (evitar `booking` y `room`) → decisión 3 y delta en castellano (`reservas`, `sala`, `dia`, `franja`, `estado`, `activa`/`cancelada`/`anulada`).
- **Aceptado** — `anular` no define el `estado` → decisión 3 y escenario con el contenido del fichero tras `anular`.
- **Aceptado** — Scope no lista `src/store.js`, ni la adaptación de tests, ni la escritura atómica; línea «Entra, si el RED lo exhibe: nada» vacía → Scope reescrito, línea borrada.
- **Aceptado** — la reserva de arranque sin dueño → decisión 4 (deuda declarada) y regla «Dónde viven los datos».
- **Aceptado** — «ilegible» sin criterio por entrada → decisión 6 y escenarios (fichero vacío, `estado` desconocido).
- **Aceptado** — «gana el último» sin escenario → decisión 5 y regla: sin garantía, no se prueba.
- **Aceptado** — fallo de escritura sin aviso → decisión 7 y escenario.
- **Aceptado** — `~` sin simular en el test → decisión 2 y GIVEN con `HOME` y `USERPROFILE` a una carpeta temporal.

Primera ronda, técnica:

- **Aceptado** — Crítico: falta `anular` sobre `cancelada` y el valor de `estado` tras `anular` → escenarios de ADDED «Anular y cancelar se guardan».
- **Aceptado** — Crítico: «dos terminales» se pasa con estado en memoria → escenario con dos procesos y, en «Dónde se prueba», un `run()` que ve un cambio del fichero hecho después de importar el módulo.
- **Aceptado** — casos de ilegible incompletos → escenarios de fichero vacío, `{"version": 1}` y `estado` desconocido.
- **Aceptado** — `~` y Windows → `os.homedir()` y tests con `HOME` y `USERPROFILE`; `SALAS_FICHERO` vacía cuenta como no definida.
- **Aceptado** — «no se crea ningún fichero» sin precondición → GIVEN con `SALAS_FICHERO` temporal y THEN que ni la ruta ni su `.tmp` existen.
- **Aceptado** — temporal compartido y fallo de escritura → sufijo `<pid>` único y decisión 7.
- **Aceptado** — decisiones sin listar (`estado`, errores de escritura, permisos) → decisiones 3 y 7.
- **Aceptado** — `architecture.md` → decisión 9.
- **Aceptado** — «Límites: no aplica» falso → regla «Límites»: sin tope de tamaño.
- **Aceptado** — afirmación sin medir sobre los tests → decisión 12, marcada como razonamiento.

Segunda ronda (un revisor, sonnet):

- **Aceptado** — Crítico: ningún escenario de `libres` con un fichero ya existente → escenario con Sur activa y Norte cancelada (`Norte`).
- **Aceptado** — Crítico: «no se crea `~/.salas`» sin precondición → GIVEN con `HOME` y `USERPROFILE` a `/tmp/casa-prueba` sin `.salas`.
- **Aceptado** — `SALAS_FICHERO` vacía sin escenario propio → escenarios separados para sin definir y vacía.
- **Aceptado** — criterios de «ilegible» sin escenario cada uno → los escenarios listan cada caso (`reservas` no lista, `null`, `[]`, campo no textual, falta `sala`).
- **Aceptado** — fallo de escritura sin mecanismo ni comprobación de `.tmp` huérfano → carpeta sin permiso de escritura y AND sin `.tmp`.
- **Aceptado** — el escenario secuencial de dos terminales no prueba la relectura → «Dónde se prueba» lo marca de humo y el de relectura, obligatorio.
- **Aceptado** — reserva ya cancelada responde `sin reserva`, `libres` no escribe, código 1: decisiones sin enumerar → decisión 13.
- **Aceptado** — referencia rota a «Repaso» → resultado dentro de la decisión 12.
- **Aceptado** — números de línea frágiles → comprobados con `grep` (`src/app.js:3,6,10,16,23`, `architecture.md:5`); `package.json` admite Node ≥20, confirmado.
- **Aceptado** — nombre de persona en el ejemplo y `version` en inglés → `/tmp/casa-prueba`; `version` declarada excepción en «Idioma de los nombres».

### Decisiones tomadas con el dev-lead

- La feature es que las reservas sobrevivan a cerrar y volver a abrir la terminal, con perfil delegate — «que las reservas sobrevivan a cerrar y volver a abrir la terminal. Perfil delegate.»

## Intent

Hoy las reservas viven en la memoria del proceso (ADR 0003): cerrar la terminal las pierde y cada arranque empieza con la misma reserva de ejemplo. Una cancelación o una anulación hecha ayer no vale hoy. Éxito: tras `cancelar Norte lun` y cerrar la terminal, una terminal nueva responde `sin reserva Norte lun` y `libres 10:00-12:00` da `Norte, Sur`. Fracaso aunque funcione: que un fichero estropeado se sustituya en silencio por un estado vacío o de ejemplo, perdiendo lo guardado.

## Scope

- Entra: guardar y leer la lista de reservas entre procesos (`src/store.js`: fichero JSON, ubicación, formato, primer arranque, escritura atómica, creación de `~/.salas`, fichero ilegible, error de escritura); que `cancelar`, `anular` y `libres` lean y escriban por ahí; adaptar los tests existentes (`test/cancel.test.js`, `test/app.test.js`) para que cada uno use un fichero temporal propio.
- No entra: que `reservar` cree reservas de verdad (hoy solo responde `reserva semanal creada` y no guarda nada; es otra fila del roadmap, y sin ella lo que se guarda es solo la reserva de arranque y su historia); quitar la reserva de arranque de ejemplo; bloqueo entre procesos; migración de formato (hay `version: 1` y nada más); validar que la sala o la franja existan; reservas por usuario o por equipo; el listado de canceladas (fila 0010); escribir la ADR 0004 y los cambios de `operations.md` y `architecture.md` (los hace el cierre).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Las reservas viven en memoria»: `bookings` como lista de módulo que empieza igual en cada arranque, y su estado `'active'`/`'cancelled'`/`'voided'` | `src/app.js:3,6,10,16,23` | Scope + decisiones 3 y 8: el estado sale a `src/store.js`, se carga de disco y los valores pasan a `activa`/`cancelada`/`anulada` |
| ADR 0003 «Las reservas viven en memoria del proceso» (decisión, consecuencia «Cerrar la terminal pierde las reservas», confirmación «`src/` no importa `node:fs`») | `.docs/sdd/decisions/0003-bookings-in-memory.md:8,22,27,31` | decisión 9: el cierre la marca `superseded by 0004`; la confirmación deja de cumplirse porque `src/store.js` importa `node:fs` |
| «Motor de producción: sin base de datos; las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | decisión 9: el cierre la reescribe («un fichero JSON en `~/.salas/reservas.json`») |
| «Un solo fichero de entrada: `src/app.js`» (sigue cierto como entrada, pero hay un módulo más) | `.docs/sdd/steering/architecture.md:5` | decisión 9: el cierre añade que `src/store.js` guarda las reservas |
| Tests que dan por hecho el estado de arranque en memoria | `test/cancel.test.js:6-12`, `test/app.test.js:5-7` | Scope: cada test apunta `SALAS_FICHERO` a un fichero temporal propio (ver «Dónde se prueba») |

- Filas que implementa: 0012 (id reservado por `sdd id next`, sin fila de roadmap previa) → ficheros que la nombran: ninguno · nada: comprobado con `git grep -nE "\b0012\b" -- . ':!.docs/sdd/changes'`.

## Approach

- A. Un fichero JSON leído entero en cada comando y reescrito solo si el comando cambia algo — el más simple; es de una sola persona y un puñado de reservas. Cuesta: el último que escribe gana si dos terminales escriben a la vez.
- B. Registro de eventos (JSONL, una línea por cancelación o anulación) — aguanta mejor los cortes y deja historia. Cuesta: hay que reconstruir el estado al leer y decidir cuándo compactar; nadie ha pedido historia.
- C. `node:sqlite` — resuelve el acceso concurrente. Cuesta: es experimental en Node 22, `package.json` admite Node ≥20 donde no existe, y la arquitectura dice «sin dependencias externas».
- Elegido: A — es lo único proporcionado al uso real (una persona, su servidor) y se deshace borrando un fichero; la ADR 0003 ya pesó el coste de guardar y aquí lo asume.

Partes del cómo que fija A:

- `src/store.js` exporta `loadBookings()` y `saveBookings(list)`. La ruta se resuelve en cada llamada (no al importar) para que un test pueda cambiar `SALAS_FICHERO`.
- `loadBookings()` sin fichero devuelve la reserva de arranque; con fichero legible, su lista; con uno ilegible, lanza un error que `src/app.js` convierte en el texto y el código de salida de la decisión 6. `saveBookings()` hace lo propio con el de la decisión 7.
- `saveBookings()` escribe en `<ruta>.<pid>.tmp` y renombra; crea la carpeta `~/.salas` si falta.
- `cancelBooking`/`voidBooking` cargan, cambian el estado y guardan; `libres` solo carga. Una reserva ya cancelada o anulada no se encuentra: `cancelar` y `anular` responden `sin reserva …` y no escriben.

## Dónde se prueba

- Sobrevivir a cerrar la terminal (cancelar, volver a abrir, `libres` y `cancelar` de nuevo), el escenario secuencial de dos terminales (de humo) y el texto del error con su código de salida 1: por proceso, ejecutando `node src/app.js …` con `SALAS_FICHERO` a un fichero temporal; el código de salida y «cerrar y volver a abrir» solo se ven fuera de `run()`.
- Anulación, contenido del fichero, ruta por defecto (con `HOME` y `USERPROFILE` a una carpeta temporal), ilegibles y error de escritura: por `run()` con fichero temporal, como `cancel.test.js` hoy.
- Que cada comando relee el fichero (es el escenario que de verdad lo prueba, obligatorio): `run('libres', …)`, editar el fichero a mano, `run('libres', …)` otra vez, sin reimportar el módulo.
- Lectura/escritura del fichero (atómica, carpeta que falta): contra `src/store.js` directo.
- Los tests existentes: reciben un fichero temporal por test (`mkdtemp`) para no depender del orden ni de la carpeta personal.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: reservas guardadas en un fichero JSON, frente a SQLite y a seguir en memoria — sustituye a la 0003

## Delta de comportamiento

### Capacidad: `reservations`

#### ADDED — Las reservas se guardan entre sesiones

- GIVEN `SALAS_FICHERO` apunta a `/tmp/prueba/reservas.json`, que no existe, y la reserva de arranque Norte lun 10:00-12:00 activa
- WHEN `cancelar Norte lun` y se cierra el proceso, y en un proceso nuevo `cancelar Norte lun`
- THEN la primera vez responde `cancelada Norte lun` y la segunda `sin reserva Norte lun`
- AND en el proceso nuevo `libres 10:00-12:00` responde `Norte, Sur`

- GIVEN `SALAS_FICHERO` apunta a `/tmp/prueba/reservas.json`, que no existe
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`, y ni `/tmp/prueba/reservas.json` ni `/tmp/prueba/reservas.json.<pid>.tmp` existen

- GIVEN el fichero guarda Sur lun 10:00-12:00 `activa` y Norte lun 10:00-12:00 `cancelada`
- WHEN `libres 10:00-12:00`
- THEN responde `Norte`

#### ADDED — Anular y cancelar se guardan cada uno con su estado

- GIVEN `SALAS_FICHERO` apunta a `/tmp/prueba/reservas.json`, que no existe
- WHEN `anular Norte lun` y se cierra el proceso, y en un proceso nuevo `anular Norte lun`
- THEN la primera vez responde `anulada Norte lun` y la segunda `sin reserva Norte lun`
- AND el fichero contiene `{"version": 1, "reservas": [{"sala": "Norte", "dia": "lun", "franja": "10:00-12:00", "estado": "anulada"}]}`

- GIVEN el fichero guarda Norte lun 10:00-12:00 con estado `cancelada`
- WHEN `anular Norte lun`
- THEN responde `sin reserva Norte lun` y el fichero no cambia

- GIVEN el fichero guarda Norte lun 10:00-12:00 con estado `anulada`
- WHEN `cancelar Norte lun`
- THEN responde `sin reserva Norte lun` y el fichero no cambia

#### ADDED — Dónde viven las reservas

- GIVEN `SALAS_FICHERO` apunta a `/tmp/prueba/reservas.json` y la carpeta personal (`HOME` y `USERPROFILE`) es `/tmp/casa-prueba`, sin `.salas`
- WHEN `cancelar Norte lun`
- THEN el fichero contiene `{"version": 1, "reservas": [{"sala": "Norte", "dia": "lun", "franja": "10:00-12:00", "estado": "cancelada"}]}` y `/tmp/casa-prueba` sigue sin `.salas`

- GIVEN `SALAS_FICHERO` sin definir y la carpeta personal (`HOME` y `USERPROFILE`) es `/tmp/casa-prueba`, sin `.salas`
- WHEN `cancelar Norte lun`
- THEN el fichero es `/tmp/casa-prueba/.salas/reservas.json`, y `/tmp/casa-prueba/.salas` se crea

- GIVEN `SALAS_FICHERO` definida como cadena vacía y la carpeta personal es `/tmp/casa-prueba`, sin `.salas`
- WHEN `cancelar Norte lun`
- THEN el fichero es `/tmp/casa-prueba/.salas/reservas.json`

#### ADDED — Cada comando ve lo que otra terminal ya guardó

- GIVEN dos terminales, A y B, con el mismo `SALAS_FICHERO`
- WHEN en A `cancelar Norte lun` y después, en B, `libres 10:00-12:00`
- THEN B responde `Norte, Sur`

- GIVEN un proceso que ya ejecutó `libres 10:00-12:00` (responde `Sur`) y después otra terminal cancela Norte lun
- WHEN ese mismo proceso ejecuta `libres 10:00-12:00` otra vez
- THEN responde `Norte, Sur`

#### ADDED — Un fichero ilegible no se pisa

- GIVEN el fichero contiene `{no es json`
- WHEN `libres 10:00-12:00`
- THEN el comando termina con código 1 y escribe en el error `salas: no se puede leer /tmp/prueba/reservas.json: formato no reconocido`
- AND el fichero sigue conteniendo `{no es json`

- GIVEN el fichero contiene, cada vez uno de estos: `{"version": 2, "reservas": []}` · `{"version": 1}` · `{"version": 1, "reservas": {}}` · `null` · `[]` · nada (0 bytes)
- WHEN `cancelar Norte lun`
- THEN, en cada caso, el comando termina con código 1 con el mismo texto de error y el fichero no cambia

- GIVEN el fichero contiene, cada vez una de estas entradas mal formadas dentro de `{"version": 1, "reservas": [ … ]}`: `{"sala": "Norte", "dia": "lun", "franja": "10:00-12:00", "estado": "pendiente"}` · `{"sala": "Norte", "dia": "lun", "franja": 1000, "estado": "activa"}` · `{"dia": "lun", "franja": "10:00-12:00", "estado": "activa"}`
- WHEN `libres 10:00-12:00`
- THEN, en cada caso, el comando termina con código 1 con el mismo texto de error y el fichero no cambia

#### ADDED — Si no se puede guardar, el fichero anterior queda como estaba

- GIVEN `/tmp/prueba/f` es un fichero normal y `SALAS_FICHERO` apunta a `/tmp/prueba/f/reservas.json`
- WHEN `cancelar Norte lun`
- THEN el comando termina con código 1 y el error empieza por `salas: no se puede guardar /tmp/prueba/f/reservas.json:`

- GIVEN `/tmp/prueba/reservas.json` guarda Norte lun 10:00-12:00 con estado `activa` y la carpeta `/tmp/prueba` no admite crear ficheros nuevos (sin permiso de escritura)
- WHEN `cancelar Norte lun`
- THEN el comando termina con código 1 y `/tmp/prueba/reservas.json` sigue guardando Norte lun 10:00-12:00 con estado `activa`
- AND en `/tmp/prueba` no queda ningún `.tmp`

#### Reglas de la capacidad — reservations

- **Dónde viven los datos**: `~/.salas/reservas.json` (`os.homedir()`), o `SALAS_FICHERO` si está definida y no vacía; sin fichero, el estado es la reserva de arranque Norte lun 10:00-12:00 activa, y el fichero solo se crea al cambiar algo
- **Idioma de los nombres**: las claves y los estados del fichero van en castellano (`reservas`, `sala`, `dia`, `franja`, `estado`; `activa`, `cancelada`, `anulada`), con los términos de `PRODUCT.md` («Reserva», «Sala», «Cancelación», «Anulación») y la `franja` que ya usa `libres`; la excepción es `version`, clave técnica que se queda en inglés; los textos al usuario, en castellano
- **Límites**: sin tope de tamaño del fichero; se lee entero en cada comando
- **Avisos**: `salas: no se puede leer <ruta>: formato no reconocido` (código de salida 1) y `salas: no se puede guardar <ruta>: <motivo del sistema>` (código de salida 1)
- **Regla ante conflicto**: dos comandos que escriben a la vez: sin garantía, el último en renombrar gana; sin bloqueo

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
