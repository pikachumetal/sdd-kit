---
id: 20261112-162649-feature-0012-persistent-reservations
feature: 0012
title: Las reservas sobreviven a cerrar y volver a abrir la terminal
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar y volver a abrir la terminal

🦆 Hoy, si cancelas `Norte lun` y en la terminal siguiente pides `libres 10:00-12:00`, `salas` sigue diciendo solo `Sur`: se ha olvidado de la cancelación. Con este cambio, la cancelación se guarda en un fichero y la terminal siguiente responde `Norte, Sur`. Sin fichero, `salas` arranca con la reserva de ejemplo de siempre (Norte, lun, 10:00-12:00). Si el fichero está corrupto, o no se puede guardar, `salas` lo dice, termina con error y no pisa nada. Cuidado con una cosa: `reservar` hoy no crea ninguna reserva, solo imprime un texto, y este cambio no lo arregla.

Validación: dev-lead — lo que cambia lo observa una persona abriendo y cerrando la terminal; un test automático no lo sustituye.

## Capacidades

- Nuevas: `reservation-persistence` — qué se recuerda de las reservas entre un arranque de `salas` y el siguiente, y dónde.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservation-persistence`), datos nuevos persistentes (el fichero de reservas), formato de fichero (lo lee `salas` en cada arranque) · tamaño: ~200 líneas en 5 ficheros
- Dominio (sonnet): si los escenarios cubren las transiciones de estado que `cancelar` y `anular` ya permiten hoy y las cinco reglas de la capacidad (señal: capacidad nueva). Sin reglas de negocio ni roles nuevos, por eso sonnet.
- Técnica (sonnet): si el fichero ilegible (decisión 5), la escritura por fichero temporal (decisión 7) y el aislamiento de los tests (decisión 10) dejan algún camino que pierda reservas o escriba en el fichero real (señal: datos persistentes)
- Mínimo razonable: solo técnica — deja sin mirar si la capacidad nueva contradice lo que `cancelar` y `anular` prometen hoy

1. **`reservar` no crea reservas hoy y este cambio no lo arregla.** En `src/app.js`, `reservar` solo imprime `reserva semanal creada` si lleva `--cada-semana`; nunca añade nada a la lista. Lo único que hay para guardar es la reserva de ejemplo y los cambios de estado de `cancelar` y `anular`. Es lo primero que debes validar: si por «reservas sobrevivan» entendías también que `reservar Norte lun 10:00-12:00` deje una reserva nueva, eso es otra feature (esta no entra) y conviene decirlo antes de aprobar.
2. **Enfoque: un fichero JSON en la carpeta personal, frente a SQLite y frente a un fichero junto al proyecto** (ver Approach).
3. **Dónde vive el fichero**: `.salas/reservas.json` dentro de la carpeta personal del usuario (la que da `os.homedir()`). La variable de entorno `SALAS_DATOS` **es la ruta de un fichero** y lo sustituye; definida pero vacía cuenta como no definida; una ruta relativa se resuelve contra la carpeta de trabajo del momento. En ambos casos la carpeta que lo contiene se crea si no existe. Sin variable, abrir la terminal en otra carpeta no cambia nada. Nadie dijo ruta ni nombre.
3 bis. **Solo leen el fichero los comandos que usan el estado**: `libres`, `cancelar` y `anular`. `reservar` y los comandos desconocidos no lo leen, así que un fichero ilegible no los afecta (siguen imprimiendo lo de hoy y terminando con código 0). Nadie dijo qué comandos; leer solo lo necesario evita que un fichero estropeado rompa lo que no lo usa.
4. **El primer arranque, sin fichero**: `salas` parte de la reserva de ejemplo de hoy (Norte, lun, 10:00-12:00, activa). Leer no crea el fichero; lo crea el primer comando que cambia algo (`cancelar` o `anular` con éxito).
5. **Fichero ilegible**: `salas` no imprime nada en la salida normal; escribe en la salida de error `no se puede leer <ruta>: <motivo>`, termina con código 1 y no modifica el fichero. Prefiero parar a empezar de cero y pisar lo que había; tú no dijiste nada de este caso. `<ruta>` es la ruta absoluta que resulta de la decisión 3. Ilegible es cualquier fichero que no cumpla el formato de la decisión 8, y el `<motivo>` es uno de estos literales: `el fichero no es un JSON válido` (incluye el fichero vacío), `el formato no es el esperado` (JSON válido pero que no cumple el formato), `versión no admitida` (la versión no es 1), o el texto del error del sistema si la lectura falla por otro motivo que «no existe» (permisos, es una carpeta). «No existe» incluye que una carpeta de la ruta sea en realidad un fichero (`ENOENT` y `ENOTDIR`): eso se descubre al guardar, no al leer (decisión 9).
6. **Dos terminales a la vez**: sin bloqueo; gana la última que escribe. Cada comando lee y escribe en milisegundos y la usa una sola persona (`PRODUCT.md`), así que el riesgo es mínimo. Un bloqueo costaría más de lo que protege. Quien lo necesite, abre otra feature.
7. **Escritura**: se escribe un fichero temporal en la misma carpeta, con nombre único por proceso, y se renombra sobre el definitivo. Un corte del proceso a mitad de escritura deja el fichero anterior entero y el temporal se borra si la escritura falla (es cómo, no qué: sin escenario). No hay `fsync`: un corte de corriente puede perder el último cambio, y no se promete más. En Windows, si otro programa bloquea el fichero y el renombrado falla, cuenta como fallo de escritura (decisión 10).
8. **Formato**: UTF-8 sin BOM (al leer, un BOM se ignora; el caso lo cubre un escenario): `{ "version": 1, "bookings": [ { "room", "day", "slot", "status" } ] }`, con los nombres y valores que hoy usa el código en memoria: `status` es `active`, `cancelled` o `voided`; `room`, `day` y `slot` son texto. Ilegible (decisión 5) es todo lo que no sea un objeto con `version` igual a 1 y `bookings` como lista de reservas con esos cuatro campos. Esta feature no migra nada.
9. **Fallo al guardar**: `cancelar` y `anular` escriben el fichero **antes** de imprimir su resultado. Si no se puede guardar, no imprimen nada en la salida normal, escriben en la de error `no se puede guardar <ruta>: <texto del error del sistema>`, terminan con código 1 y lo que había en el fichero no cambia. Así nunca ves `cancelada Norte lun` de un cambio que se perdió.
10. **Los tests no tocan el fichero real**: un ayudante de test crea una carpeta temporal por test y fija `SALAS_DATOS` a un fichero dentro de ella. `salas` lee `SALAS_DATOS` en cada arranque, no al cargar el módulo, así que los tests que llaman a `run` en el propio proceso (`test/app.test.js`, `test/cancel.test.js`) solo cambian en esa preparación: `run` sigue devolviendo el mismo texto en los casos de éxito y, en un fallo de leer o de guardar, lanza un `Error` cuyo mensaje es el literal de las decisiones 5 y 9; la entrada de línea de comandos lo escribe en la salida de error y termina con código 1. El ayudante falla si un test no fijó `SALAS_DATOS` y no toca `~/.salas`; no añado una comprobación de esa carpeta antes y después de `node --test`, porque el ayudante ya lo impide. Los tests de la ruta por defecto fijan `HOME` y `USERPROFILE` a una carpeta temporal. Los de proceso hijo usan la ruta absoluta de `src/app.js` y rutas absolutas en `SALAS_DATOS`.
11. **Idioma de los nombres**: los del código de hoy (`room`, `day`, `slot`, `status`, `active`, `cancelled`, `voided`, `bookings`), porque el fichero es el volcado de la lista actual. La constitución (4) solo exige castellano en el texto de la interfaz y de los documentos. El nombre del fichero y de la variable de entorno van en castellano, como el producto.
12. **ADR y documentos**: se escribe la ADR 0007 («Las reservas viven en un fichero JSON») y la 0004 pasa a `superseded by 0007`; la línea «Motor de producción» de `operations.md` pasa a decir que las reservas viven en un fichero JSON. Todo en una task de esta feature, no en el cierre. La 0004 dice que cerrar la terminal pierde las reservas y que `src/` no importa `node:fs`; ambas cosas dejan de ser ciertas. `architecture.md` no cambia: sigue sin dependencias externas (`node:fs` y `node:os` son del propio Node). Ese fichero dice «Node 22» y `package.json` declara `>=20`; no lo resuelvo aquí, y para la opción B (Approach) me fío del segundo, que es lo que realmente se exige.
13. **Capacidad nueva `reservation-persistence`**: es la primera de `capabilities/` en este proyecto, que hasta hoy no las usa; el nombre evita «booking», que `PRODUCT.md` marca como término a evitar. Solo describe lo que esta feature añade: las salidas de éxito de `cancelar`, `anular` y `libres` que cita son las de hoy y no cambian (el `sin reserva` de un tercer proceso es la transición de estado de hoy, ahora persistida); lo nuevo es que el estado se recuerda, que se añaden los caminos de fallo (error de leer y de guardar) y que arrancar con la reserva de ejemplo pasa a ser el caso «sin fichero». Si prefieres que esta feature no abra `capabilities/`, el delta se borra y lo observable queda en «Dónde se prueba».
14. **Texto de los errores en castellano** y sin colores (`constitution` 4, ADR 0006).
- Política de modelos: dos revisores de spec en sonnet, más un tercero en sonnet para la segunda ronda · ejes de la revisión final según el plan, con los de `delegate` por defecto (Spec opus+high, Código sonnet+high) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.
- Pasada de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` añade los seis requisitos de `reservation-persistence` sin rechazos (repetido tras integrar los hallazgos); lo que se retira, abajo.

### Hallazgos de la review

- **Aceptado** — Crítico (técnica): `SALAS_DATOS` figuraba como ruta de fichero y como carpeta temporal → ahora es siempre un fichero (decisiones 3 y 10)
- **Aceptado** — «booking» es término a evitar en `PRODUCT.md` (dominio) → capacidad `reservation-persistence`, carpeta y rama renombradas (decisión 13)
- **Aceptado** — idioma de los nombres, límites y avisos sin declarar (dominio) → decisión 11, «Reglas de la capacidad» y decisión 9
- **Aceptado** — ilegible solo cubría dos casos (dominio y técnica) → decisiones 5 y 8, y escenarios de formato y de fichero vacío
- **Aceptado** — fallo al guardar sin decidir, imprimir antes de guardar (dominio y técnica) → decisión 9 y escenario
- **Aceptado** — temporal sin nombre único, sin `fsync`, Windows (técnica) → decisión 7
- **Aceptado** — ruta relativa y variable vacía (técnica) → decisión 3
- **Aceptado** — aislamiento de los tests y lectura de la variable en cada arranque (técnica) → decisión 10
- **Aceptado** — `anular` tras `cancelar`, `libres` que no escribe, contenido del fichero, `<ruta>` literal, `stdout` vacío (dominio y técnica) → escenarios
- **Aceptado** — Intent más amplio que el Scope; carpeta que se crea sin escenario → Intent acotado y escenario de la ruta por defecto
- **Aceptado** — estados y codificación sin enumerar (técnica) → decisión 8
- **Aceptado, sin cambio de la spec** — dos pisos de Node (técnica) → decisión 12 lo dice y no lo resuelve
- **Aceptado** — «resultado abajo» sin resultado (técnica) → viñeta de la pasada de coherencia
- **Segunda ronda, aceptado** — Crítico: el escenario de guardar fallaba al leer con `ENOTDIR` en POSIX → decisión 5 (`ENOENT` y `ENOTDIR` cuentan como «no existe»)
- **Segunda ronda, aceptado** — contrato de `run`, qué comandos leen, escenarios que faltaban (BOM, estado y campo inválidos), variable vacía en Windows, escenarios no ejecutables, `sin reserva` y decisión 13, límites con valor, referencia de la decisión 10, guarda del ayudante → decisiones 3 bis, 10 y 13, escenarios y «Dónde se prueba»

### Decisiones tomadas con el dev-lead

- Perfil `delegate` para esta feature — «Perfil delegate.»
- Objetivo de la feature — «que las reservas sobrevivan a cerrar y volver a abrir la terminal»

## Intent

Hoy cada comando de `salas` es un proceso nuevo que arranca con la reserva de ejemplo y nada más. Una cancelación o una anulación se confirma por pantalla y se olvida al instante: `cancelar Norte lun` imprime `cancelada Norte lun`, y el siguiente `libres 10:00-12:00` sigue diciendo `Sur`, como si Norte aún estuviera ocupada. El éxito es que un comando posterior, en otra terminal u otro día, vea las cancelaciones y anulaciones de los anteriores. Fracasaría, aunque «funcione», si pisa en silencio un fichero que no entiende, si imprime un cambio que luego no pudo guardar, o si los tests escriben en la carpeta personal de quien los ejecuta.

## Scope

- Entra: `src/app.js` lee el estado de un fichero JSON en cada `libres`, `cancelar` y `anular` y lo escribe, antes de imprimir, tras un `cancelar` o un `anular` que cambian algo; ruta por defecto y `SALAS_DATOS`; creación de la carpeta si falta; arranque sin fichero; fichero ilegible; fallo al guardar.
- Entra: tests de arranque a arranque (proceso hijo con `SALAS_DATOS` temporal), el ayudante de test y la adaptación de los existentes (decisión 10).
- Entra: ADR 0007, la 0004 como `superseded by 0007` y la línea de `operations.md` (decisión 12).
- No entra: que `reservar` cree reservas (decisión 1).
- No entra: bloqueo entre terminales, migración de formato, SQLite, comando para ver, vaciar o mover el fichero, cambios en `architecture.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «El estado vive en memoria; cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0004-single-process-state.md:16,21,25` | decisión 12: ADR 0007 y la 0004 a `superseded by 0007` |
| «`src/` no importa `node:fs`» (Confirmación de la 0004) | `.docs/sdd/decisions/0004-single-process-state.md:29` | decisión 12: la 0007 la sustituye por su propia confirmación |
| «las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | decisión 12 |

- Filas que implementa: nada: comprobado con `git grep -nE "0012"` fuera de `.docs/sdd/specs` y `.docs/sdd/changes` (sin resultados; el id 0012 no tiene fila en `ROADMAP.md`). Se añadirá la fila al cerrar si el dev-lead la quiere.

## Approach

- **A. Fichero JSON en la carpeta personal** — un solo fichero que se lee entero al arrancar y se reescribe tras cada cambio. Cuesta: elegir ruta y formato (decisiones 3 y 8), la escritura segura (7) y que dos terminales a la vez puedan pisarse (6).
- **B. SQLite (`node:sqlite`)** — transacciones y concurrencia resueltas. No encaja: `package.json` declara `node >=20` y `node:sqlite` no existe en 20; es una dependencia de motor para guardar una lista de dos o tres reservas.
- **C. Fichero junto al proyecto (carpeta actual)** — sin elegir ruta. Falla el objetivo: abrir la terminal en otra carpeta daría otro conjunto de reservas, justo el síntoma de hoy.
- Elegido: **A**, porque es lo único que cumple el objetivo con una sola decisión nueva de infraestructura (la ruta) y sin subir de Node 20. Cuesta que el cambio de ADR sea real: la 0004 decía que guardar «obliga a decidir dónde vive el fichero, dos terminales a la vez y cómo se migra el formato, y nadie lo ha pedido»; hoy alguien lo ha pedido, y las decisiones 3, 6 y 8 son esas tres respuestas.

Partes del cómo que fija A: el fichero se lee en cada comando que usa el estado (no solo en el primero); un comando que no cambia nada, como `libres`, no escribe; escribir es fichero temporal más renombrado (decisión 7).

## Dónde se prueba

En los escenarios, `salas <comando>` es `node <ruta absoluta de src/app.js> <comando>`.

- Persistencia de arranque a arranque, ruta por defecto y `SALAS_DATOS`: tests que lanzan `salas` como proceso hijo con `SALAS_DATOS` temporal. Es una costura nueva, porque la existente (`run` en el propio proceso) no reproduce un cierre de terminal.
- Fichero ilegible y fallo al guardar: el mismo proceso hijo; se comprueban la salida de error (con la ruta literal que da `path.resolve`), la salida normal vacía, el código de salida y el contenido del fichero.
- `libres`, `cancelar`, `anular` actuales: los tests existentes por `run`, con `SALAS_DATOS` temporal (decisión 10).
- `SALAS_DATOS` vacía: en Windows una variable vacía no sobrevive al proceso hijo, así que esa regla se prueba con una prueba de la función que resuelve la ruta, no solo con el proceso hijo.
- Que abrir la terminal en otra carpeta ve lo mismo: un test con dos carpetas de trabajo distintas y la misma `SALAS_DATOS`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: «Las reservas viven en un fichero JSON en la carpeta personal» — SQLite y fichero junto al proyecto descartados (decisión 12: la escribe una task de esta feature)

## Delta de comportamiento

### Capacidad: `reservation-persistence`

#### ADDED — Las cancelaciones y anulaciones sobreviven a un reinicio

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe, y se ejecuta `salas cancelar Norte lun` (salida `cancelada Norte lun`)
- WHEN en un proceso nuevo se ejecuta `salas libres 10:00-12:00`
- THEN la salida es `Norte, Sur`
- AND el fichero, leído como JSON, es `{"version": 1, "bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "cancelled"}]}`
- AND en un tercer proceso, `salas cancelar Norte lun` da `sin reserva Norte lun` y `salas anular Norte lun` da `sin reserva Norte lun`
- GIVEN otro `SALAS_DATOS` sin fichero, y se ejecuta `salas anular Norte lun` (salida `anulada Norte lun`)
- WHEN en un proceso nuevo se ejecuta `salas libres 10:00-12:00`
- THEN la salida es `Norte, Sur`, y el fichero tiene `"status": "voided"`

#### ADDED — Sin fichero se arranca con la reserva de ejemplo

- GIVEN `SALAS_DATOS` apunta a una ruta sin fichero
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida es `Sur`
- AND el fichero sigue sin existir
- GIVEN la misma ruta sin fichero
- WHEN se ejecuta `salas cancelar Sur mar` (salida `sin reserva Sur mar`)
- THEN el fichero sigue sin existir
- GIVEN un fichero escrito por `salas cancelar Norte lun`, y se leen sus bytes
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN los bytes del fichero son idénticos a los leídos

#### ADDED — Dónde vive el fichero

- GIVEN `SALAS_DATOS` sin definir, la carpeta personal (`HOME` y `USERPROFILE`) apuntando a una carpeta temporal vacía
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN existe `.salas/reservas.json` dentro de esa carpeta (que se ha creado), y desde otra carpeta de trabajo `salas libres 10:00-12:00` da `Norte, Sur`
- GIVEN `SALAS_DATOS` definida pero vacía y la misma carpeta personal temporal vacía
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN existe `.salas/reservas.json` dentro de esa carpeta
- GIVEN `SALAS_DATOS` relativa (`datos/r.json`) y una carpeta de trabajo temporal
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN existe `datos/r.json` dentro de la carpeta de trabajo

#### ADDED — Un fichero ilegible no se pisa

- GIVEN el fichero de `SALAS_DATOS` contiene `{no es json`
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida normal está vacía, la de error es `no se puede leer <ruta>: el fichero no es un JSON válido`, el código de salida es 1 y el fichero sigue conteniendo `{no es json`
- GIVEN el fichero está vacío (0 bytes)
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida de error es `no se puede leer <ruta>: el fichero no es un JSON válido` y el código es 1
- GIVEN el fichero contiene `{"version": 1, "bookings": "nada"}`
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida de error es `no se puede leer <ruta>: el formato no es el esperado`
- GIVEN el fichero contiene una reserva con `"status": "hecha"`, o una reserva sin el campo `slot`
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida de error es `no se puede leer <ruta>: el formato no es el esperado` y el código es 1
- GIVEN el fichero contiene `{"version": 2, "bookings": []}`
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN la salida de error es `no se puede leer <ruta>: versión no admitida`, el código es 1 y el fichero no cambia
- GIVEN `SALAS_DATOS` apunta a una carpeta
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida de error empieza por `no se puede leer <ruta>: ` y el código es 1

#### ADDED — Un fichero con BOM o un comando que no usa el estado no fallan

- GIVEN el fichero es el de un `cancelar Norte lun` reescrito con un BOM UTF-8 delante
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN la salida es `Norte, Sur` y el código es 0
- GIVEN el fichero contiene `{no es json`
- WHEN se ejecuta `salas reservar Norte --cada-semana`
- THEN la salida es `reserva semanal creada`, el código es 0 y el fichero no cambia

#### ADDED — Si no se puede guardar, no se dice que se hizo

- GIVEN `SALAS_DATOS` es `<carpeta temporal>/fichero/reservas.json`, donde `fichero` es un fichero normal y no una carpeta
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN la salida normal está vacía, la de error empieza por `no se puede guardar <ruta>: `, el código es 1 y `fichero` conserva su contenido

#### Reglas de la capacidad — reservation-persistence

- **Dónde viven los datos**: un fichero JSON, `.salas/reservas.json` en la carpeta personal, o la ruta de `SALAS_DATOS`
- **Idioma de los nombres**: los del código de hoy, en inglés; el fichero y la variable, en castellano
- **Límites**: sin límite de tamaño ni de número de reservas: el fichero se lee entero
- **Avisos**: `no se puede leer <ruta>: <motivo>` y `no se puede guardar <ruta>: <motivo>` en la salida de error, con código 1
- **Regla ante conflicto**: sin bloqueo; gana la última escritura
