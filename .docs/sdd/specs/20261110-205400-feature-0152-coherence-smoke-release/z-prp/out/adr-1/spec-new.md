---
id: 20261112-155742-feature-0012-persist-bookings
feature: 0012
title: Las reservas sobreviven a cerrar la terminal
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar la terminal

🦆 Hoy, si cancelas `Norte lun` y cierras la terminal, al volver a abrirla `Norte lun` vuelve a estar reservada: todo empieza de cero. Con este cambio cada comando que modifica una reserva la deja guardada en un fichero JSON, y cada arranque lee ese fichero: cancelas `Norte lun`, cierras, abres, pides `libres 10:00-12:00` y sale `Norte, Sur`. Ojo: hoy `reservar` no crea reservas, así que lo que sobrevive es la reserva inicial y sus cancelaciones y anulaciones; crear reservas de verdad es otra feature. Por dentro, `src/app.js` deja de guardar las reservas en una variable del módulo, un módulo nuevo las lee y las escribe, y la decisión 0003 («en memoria») se sustituye por otra.

Validación: dev-lead — es una herramienta de terminal que usa una persona: cerrar y volver a abrir la terminal de verdad es lo que prueba el cambio.

## Capacidades

- Nuevas: `bookings` — dónde viven las reservas y que su estado se conserva entre arranques de la terminal.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), datos nuevos persistentes (el fichero `reservas.json`) · tamaño: ~120 líneas en ~9 ficheros
- Dominio (sonnet): si las cinco reglas de «Reglas de la capacidad — bookings» cubren lo que alguien que cierra la terminal en mitad de un `cancelar` esperaría, y si «No entra: `reservar` real» deja el escenario de supervivencia observable (señal: capacidad nueva)
- Técnica (sonnet): si leer el fichero en cada `run` y escribir con fichero temporal + `rename` aguanta un fichero ausente, vacío o ilegible sin pisarlo, y si los tests existentes (`app.test.js`, `cancel.test.js`) siguen aislados con `SALAS_DATOS` (señal: datos nuevos)
- Mínimo razonable: solo técnica — deja sin mirar si el aviso `reservas ilegibles: <ruta>` y la regla de «el último que escribe gana» son lo que quien reserva esperaría

1. **`reservar` no pasa a crear reservas** — hoy `reservar` solo devuelve `reserva semanal creada` y no crea nada; la spec guarda lo que ya existe (la reserva inicial y los estados `cancelled`/`voided`). Es la decisión que más condiciona el valor del cambio: si quieres que `reservar <sala> <día> <franja>` cree de verdad, es otra feature (lleva sus reglas de conflicto) y esta se queda corta pero correcta. Recomiendo no mezclarlas.
2. **Fichero JSON, no SQLite ni otro formato** — ver Approach.
3. **Ruta del fichero**: `SALAS_DATOS` si existe (ruta al fichero entero); si no, `os.homedir()` + `/.salas/reservas.json` (en Windows, `USERPROFILE`), creando `.salas/` —y, con `SALAS_DATOS`, las carpetas que falten hasta el fichero— si faltan. En los avisos la `<ruta>` es la de `SALAS_DATOS` tal cual, o la ruta por defecto sin normalizar. Nadie dijo dónde.
4. **Formato**: `{"version": 1, "bookings": [{"room","day","slot","status"}]}`, UTF-8 sin BOM, con `status` ∈ `active` | `cancelled` | `voided` (los valores de hoy en `src/app.js:3,17,24`). Los campos son los del código; `version` existe para que un cambio futuro de formato pueda migrar. Al leer se tolera un BOM inicial; al escribir no se pone.
5. **Sin fichero, se parte de la reserva inicial** `Norte lun 10:00-12:00` activa (la de `src/app.js:3`): los tests y `libres` de hoy no cambian. Leer, o un comando que no cambia nada (`cancelar Sur mar` → `sin reserva Sur mar`), no crea ni reescribe el fichero: solo escribe un comando que cambia una reserva.
6. **Cada `run` lee el fichero y escribe tras cambiar algo**, en vez de cargar una vez al arrancar: cada invocación de la terminal es un proceso, y así una segunda terminal ve lo que la primera ya guardó. No garantiza nada sobre dos comandos que se solapan en el tiempo (decisión 9).
7. **Escritura atómica**: fichero temporal en la misma carpeta + `rename` (y se borra el temporal si algo falla), para que cerrar la terminal a mitad de una escritura no deje un JSON truncado. Un `rename` que falla —p. ej. en Windows, con el destino abierto por otro proceso— cuenta como fallo de guardado (decisión 15). La atomicidad en sí y la limpieza del temporal cuando falla el `rename` no tienen escenario observable (forzar ese fallo es frágil entre sistemas): se revisan en el código, y los escenarios de «sin temporales» comprueban que no queda basura en el caso feliz y en el fallo de guardado.
8. **Fichero ilegible** (vacío, JSON inválido, sin `version` 1 o con `version` distinta, `bookings` que no es una lista, o un elemento sin los cuatro campos o con un `status` fuera de `active`/`cancelled`/`voided`; una lista vacía sí es legible: significa «sin reservas»; un `<ruta>` que no se puede leer como fichero también): **cualquier** comando —`libres` incluido— no cambia nada, no escribe, y responde `reservas ilegibles: <ruta>`. Nunca se sobrescribe un fichero que no se entiende, aunque eso bloquee la herramienta hasta que lo arreglen o lo borren.
9. **Dos terminales a la vez: gana el último que escribe**, sin bloqueo de fichero, y **una cancelación concurrente puede perderse sin aviso**. Con una sola persona usándola (PRODUCT.md, Product Purpose: «no hay más usuarios»; la primera línea habla de «equipos de una oficina», pero el propósito real es el de una persona) basta, y un bloqueo es el coste que 0003 quiso evitar. Límite conocido, sin escenario.
10. **Capacidad nueva `bookings`** (slug en inglés, contenido en castellano): hoy no existe `capabilities/` y el comportamiento de reservas no está en ninguna. Esta spec solo la abre con lo de persistencia. Los nombres del fichero (`bookings`, `room`, `status`…) son identificadores técnicos heredados del código, no texto de interfaz.
11. **Módulo nuevo `src/store.js`** para leer/escribir: `src/app.js` sigue siendo el único punto de entrada (`architecture.md`), pero ya no es el único fichero de `src/`.
12. **ADR nueva 0004** que sustituye a la 0003 (la escribe el cierre); la 0003 pasa a `superseded by 0004`. Su «Confirmación» actual (`src/` no importa `node:fs`) deja de cumplirse y la 0004 la reescribe: `src/` solo toca el disco desde `src/store.js`. (La ADR 0004 y la fila 0004 «Exportar a .ics» del roadmap son cosas distintas: numeraciones separadas.)
13. **Los tests existentes se aíslan** con un `SALAS_DATOS` a un directorio temporal (`os.tmpdir()`) por test; sin eso, `cancel.test.js` escribiría en el home real de quien los corre. Los tests comparan el contenido del fichero ya parseado, no como texto.
14. **Delta probado sobre una copia** de `.docs/sdd` con `sdd capability merge`: ver su resultado al final de la sección de decisiones; el `capabilities/` del repo no cambia hasta el cierre.
15. **Fallo de guardado**: si no se puede escribir (carpeta imposible de crear, permisos, `rename` fallido), el comando **no confirma el cambio**: responde `no se pudo guardar: <ruta>` en lugar de `cancelada …`/`anulada …`, y no deja ficheros temporales.
16. **Código de salida**: `reservas ilegibles` y `no se pudo guardar` salen con código 1 (los dos avisos por stdout, como el resto de respuestas de hoy, `src/app.js:36`); el resto, 0 como hoy.
17. **Versión de Node**: `architecture.md` dice Node 22 y `package.json` `engines` `>=20`; `src/store.js` usa solo APIs de `node:fs`, `node:path` y `node:os` presentes en 20.
- Política de modelos: revisores de la spec, dos en `sonnet` (el cambio no toca roles ni reglas de negocio) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` (no fijado: 3 por defecto)

Delta sobre copia (tras las dos rondas): `sdd capability merge` sin errores, 8 requisitos y 5 reglas añadidos a `bookings.md`, `Capacidades válidas: 1`; el `capabilities/` del repo no cambia hasta el cierre.

### Hallazgos de la review

Primera ronda (técnica 10, dominio 10):
- **Aceptado** — escenario de ruta mezclaba dos casos y comparaba texto (técnica 1) → dos escenarios, comparación parseada, rutas `<dir temporal>`.
- **Aceptado** — ilegible solo cubría `{rota` (técnica 2, dominio 3) → tres escenarios (inválido, vacío, `version: 2`) y regla de que `libres` también devuelve el aviso (decisión 8).
- **Aceptado** — escritura atómica sin escenario (técnica 3) → escenario «sin temporales» y decisión 7 dice que la atomicidad se revisa en código.
- **Aceptado** — fichero existente + comando sin cambios no reescribe (técnica 4) → escenario con contenido y mtime.
- **Aceptado** — «último gana» sin escenario / pérdida silenciosa (técnica 5, dominio 5) → decisión 9 y regla de conflicto lo dicen; límite conocido sin escenario.
- **Aceptado** — vocabulario de `status` (técnica 6, dominio 1) → decisión 4, escenario de `voided` comprueba el fichero; decisión 10 aclara identificadores técnicos y ya no cita el art. 4.
- **Aceptado** — avisos y código de salida no declarados, fallo de guardado (técnica 7, dominio 2) → decisiones 15 y 16, escenario de fallo de guardado.
- **Aceptado** — Windows, `os.homedir()`, rename, `/tmp` (técnica 8, dominio 9) → decisiones 3, 7, 13; rutas neutras en el delta.
- **Aceptado** — BOM, serialización (técnica 9) → decisión 4.
- **Aceptado** — Node 22 vs `>=20` (técnica 10) → decisión 17.
- **Aceptado** — el valor del cambio sin `reservar` real (dominio 4) → el Intent y el 🦆 lo dicen; el título se mantiene porque es lo que pidió el dev-lead.
- **Aceptado** — línea de review decía «tres reglas» (dominio 7), «0004» ambiguo (dominio 8), cita de PRODUCT.md (dominio 10), «Límites» sin motivo (dominio 6) → corregidos.

Segunda ronda (un revisor, sonnet; hubo Críticos aceptados):
- **Aceptado** — «ilegible» no cubría `bookings` mal formada ni elementos incompletos o con `status` desconocido (1.ª parte del crítico 2) → decisión 8 y cuarto contenido del escenario de ilegible.
- **Aceptado** — padre de `SALAS_DATOS` inexistente (crítico 3) → decisión 3 y `AND` del escenario de ruta.
- **Aceptado** — `anular` sin escenario de fallo de guardado (4) → añadido; ruta de los avisos sin normalizar (5) → decisión 3; `architecture.md` fuera de Scope (7) → Scope y tabla; recuento de ficheros y «Límites» (10) → corregidos; código 0 en el escenario sin fichero (parte del 1) → añadido.
- **Rechazado** — crítico 1 (que `libres` dé `Sur` sin fichero contradiga el 🦆): `Sur` es correcto, `Norte` está reservada; el `Norte, Sur` es tras cancelar. Crítico 2, 2.ª parte (`bookings: []` legible pierde una cancelación): una lista vacía es un estado válido que alguien guardó, no una pérdida; no hay sentido en tratarla como ilegible. Crítico 3, resto: cubierto arriba.
- **Rechazado** — escenario del `rename` fallido (6): forzarlo es frágil entre sistemas y un destino-directorio caería en «ilegible»; queda como revisión de código (decisión 7). Roles y transiciones (8): se dejan como hoy y se dice en «No entra»; la tensión de PRODUCT.md («equipos» vs «no hay más usuarios») no es de esta spec. «Idioma de los nombres» (9): el art. 4 se cita solo para los textos de salida, que es lo que dice; los identificadores en inglés se justifican como técnicos (decisión 10).

### Decisiones tomadas con el dev-lead

- Perfil `delegate`, del proyecto (`sdd-kit.json`); el dev-lead pidió «Arranca este cambio con sdd-propose: que las reservas sobrevivan a cerrar y volver a abrir la terminal. Perfil delegate. Escribe la spec y preséntamela.» — la spec va al gate, no se aprueba por delegación.

## Intent

Hoy cada arranque de `salas` empieza con la reserva inicial y nada más: una cancelación o anulación se pierde al cerrar la terminal (ADR 0003). Importa porque nadie espera que `cancelar Norte lun` deje de valer cuando cierra la ventana. Hoy `reservar` no crea reservas (decisión 1): lo que se conserva es la reserva inicial y el estado que le dan `cancelar` y `anular`; la persistencia es el paso previo a poder crear reservas. Éxito: tras `cancelar Norte lun` (`cancelada Norte lun`), un proceso nuevo con `libres 10:00-12:00` responde `Norte, Sur`. Sería un fracaso, aunque «funcione», que un fichero roto se sobrescribiera en silencio, que un comando dijera `cancelada …` sin haber guardado nada, o que los tests del proyecto escribieran en el home real de quien los ejecuta.

## Scope

- Entra: guardar en un fichero JSON y leer de él el estado de las reservas (activa, cancelada, anulada), con ruta, formato, fichero ausente, fichero ilegible, fallo de guardado, avisos, código de salida y escritura atómica de «✋».
- Entra: `src/app.js` deja de tener el array de módulo (`src/app.js:3`); `freeRooms`, `findBooking`, `cancelBooking`, `voidBooking` trabajan sobre lo que lee `src/store.js` (`src/app.js:5-24`), y el arranque (`src/app.js:36`) pone el código de salida.
- Entra: aislar `test/app.test.js` y `test/cancel.test.js` con `SALAS_DATOS` temporal; tests nuevos de la persistencia, uno con dos procesos `node src/app.js` seguidos.
- Entra: `operations.md:14` («Motor de producción») y la sustitución de la ADR 0003 por la 0004, al cierre.
- Entra: `architecture.md` (hoy «un solo fichero de entrada: `src/app.js`»): sigue siendo la única entrada, y se añade que `src/store.js` es el único que toca el disco.
- No entra: `package.json` (ni `engines`) y `README.md`; roles o permisos (quién puede `cancelar` o `anular`) y las transiciones de estado: siguen como hoy (`cancelar`/`anular` solo ven reservas `active`, `src/app.js:9-10`); que `reservar` cree reservas, sus conflictos o sus textos; validar el formato de la franja (deuda «Por triar»); bloqueo de fichero entre terminales; migrar formatos (solo existe `version: 1`); SQLite o cualquier dependencia; exportar a `.ics` (fila 0004 del roadmap).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Las reservas viven en memoria del proceso» / «cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0003-bookings-in-memory.md:8,22,27` | decisión 12: ADR 0004 la sustituye; 0003 pasa a `superseded by 0004` (la inmutabilidad de las ADR solo deja cambiar `status`) |
| «`src/` no importa `node:fs` ni ningún paquete de base de datos» (Confirmación) | `.docs/sdd/decisions/0003-bookings-in-memory.md:31` | decisión 12: la 0004 pone «solo `src/store.js` importa `node:fs`» |
| «Motor de producción: sin base de datos; las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | Scope: pasa a «sin base de datos; las reservas viven en un fichero JSON (ADR 0004)» |
| «Un solo fichero de entrada: `src/app.js`» | `.docs/sdd/steering/architecture.md:5` | Scope: sigue siendo la única entrada; se añade `src/store.js` como único que toca el disco |
| Array de módulo `bookings` con la reserva inicial | `src/app.js:3` (y usos en `:6`, `:10`) | Scope: la reserva inicial pasa a ser el estado por defecto de `src/store.js` |
| Tests que mutaban el estado compartido del módulo | `test/cancel.test.js:5-7`, `test/app.test.js:5-7` | Scope y decisión 13: `SALAS_DATOS` temporal por test |

- Filas que implementa: nada — no hay fila de roadmap para el 0012 (id reservado con `sdd id next --reserve`); comprobado con `git grep -n -i -E "persist|memoria|guard" -- ROADMAP.md README.md PRODUCT.md`: sin coincidencias en ellos.

## Approach

- **A. Fichero JSON, leído y escrito en cada `run`** — sin dependencias (`node:fs`), legible y arreglable a mano; cuesta un módulo nuevo y decidir ruta, ilegible y conflicto (decisiones 3-9).
- **B. SQLite (`node:sqlite`)** — resuelve la concurrencia, pero en Node 22 es experimental, la `engines` de `package.json` dice `>=20`, y 0003 ya descartó esta vía por el coste de una dependencia para una sola persona.
- **C. Fichero de registro de solo añadir (log de eventos)** — sin pisar nunca, pero hay que reconstruir el estado en cada arranque y compactarlo: complejidad sin necesidad con 1 reserva y 3 estados.
- Elegido: **A** — es lo más pequeño que cumple el éxito del Intent y no añade ninguna dependencia ni runtime nuevo.

`src/store.js` exporta `loadBookings()` (devuelve la lista, o lanza un error de «ilegible») y `saveBookings(list)` (lanza un error de «no se pudo guardar»); `run` abre con `loadBookings()`, aplica el comando, y si cambió algo, `saveBookings`. Sin fichero, `loadBookings()` devuelve la reserva inicial sin escribir.

## Dónde se prueba

- Cancelar/anular se conserva entre arranques: dos `node src/app.js` seguidos con `child_process`, `SALAS_DATOS` a un directorio temporal — la costura más alta posible: el proceso real. Incluye el código de salida de los avisos.
- Ruta, fichero ausente, ilegible (tres variantes), fallo de guardado, «sin temporales» y «un comando que no cambia nada no reescribe»: por `run(...)` con `SALAS_DATOS` temporal, como los tests actuales de `cancel.test.js`; el contenido se compara parseado.
- Ruta por defecto: `run(...)` con `SALAS_DATOS` sin definir y `HOME` y `USERPROFILE` apuntando a un directorio temporal.
- Los tests actuales de `libres`, `cancelar` y `anular` siguen verdes, aislados con `SALAS_DATOS`.
- Sin escenario, por decisión: la atomicidad del `rename` en sí y los dos terminales a la vez (decisiones 7 y 9).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: guardar las reservas en un fichero JSON en vez de en memoria — alternativas: memoria (la 0003, que sustituye) y SQLite. Difícil de deshacer (el formato en disco), sorprende a quien lea `src/` sin contexto (0003 dice lo contrario) y hubo alternativa real.

## Delta de comportamiento

> En los escenarios, `<dir>` es un directorio temporal del sistema (`os.tmpdir()`), no una ruta fija.

### Capacidad: `bookings`

#### ADDED — Una cancelación se conserva al cerrar y volver a abrir la terminal

- GIVEN `SALAS_DATOS=<dir>/r.json` sin fichero, con la reserva inicial `Norte lun 10:00-12:00`
- WHEN `cancelar Norte lun` en un proceso, y cuando acaba, `libres 10:00-12:00` en un proceso nuevo
- THEN el primero imprime `cancelada Norte lun` y el segundo `Norte, Sur`

#### ADDED — Una anulación se conserva al cerrar y volver a abrir la terminal

- GIVEN `SALAS_DATOS=<dir>/r.json` sin fichero, con la reserva inicial `Norte lun 10:00-12:00`
- WHEN `anular Norte lun` en un proceso, y cuando acaba, `libres 10:00-12:00` en un proceso nuevo
- THEN el primero imprime `anulada Norte lun` y el segundo `Norte, Sur`
- AND el fichero parseado tiene la reserva `Norte lun 10:00-12:00` con `status` `voided`

#### ADDED — Sin fichero se parte de la reserva inicial y leer no lo crea

- GIVEN `SALAS_DATOS=<dir>/r.json` y que ese fichero no existe
- WHEN `libres 10:00-12:00`, y después `cancelar Sur mar`
- THEN imprime `Sur` y luego `sin reserva Sur mar`, los dos con código de salida 0
- AND `<dir>/r.json` sigue sin existir

#### ADDED — Un comando que no cambia nada no reescribe el fichero

- GIVEN `SALAS_DATOS=<dir>/r.json` con la reserva `Norte lun 10:00-12:00` en `active`
- WHEN `cancelar Sur mar`
- THEN imprime `sin reserva Sur mar`
- AND el contenido y la fecha de modificación de `<dir>/r.json` son los de antes

#### ADDED — La ruta del fichero sale de `SALAS_DATOS`

- GIVEN `SALAS_DATOS=<dir>/a.json`
- WHEN `cancelar Norte lun`
- THEN `<dir>/a.json` existe y, parseado, es `{"version": 1, "bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "cancelled"}]}`
- AND en `<dir>` no queda ningún otro fichero
- AND con `SALAS_DATOS=<dir>/nuevo/a.json` (la carpeta `nuevo` no existe) el mismo comando crea `<dir>/nuevo/a.json`

#### ADDED — Sin `SALAS_DATOS` el fichero va a la carpeta del usuario

- GIVEN `SALAS_DATOS` sin definir y la carpeta del usuario (`os.homedir()`) en `<dir>/h`
- WHEN `cancelar Norte lun`
- THEN existe `<dir>/h/.salas/reservas.json`, con la reserva en `cancelled`

#### ADDED — Un fichero ilegible no se sobrescribe y bloquea todo comando

- GIVEN `SALAS_DATOS=<dir>/r.json` con uno de estos contenidos: `{rota`, vacío (0 bytes), `{"version": 2, "bookings": []}`, `{"version": 1, "bookings": [{"room": "Norte"}]}`
- WHEN `cancelar Norte lun`, y también `libres 10:00-12:00`
- THEN cada uno imprime `reservas ilegibles: <dir>/r.json` y sale con código 1
- AND `<dir>/r.json` sigue con el contenido de antes, byte a byte

#### ADDED — Si no se puede guardar, el comando no confirma el cambio

- GIVEN `SALAS_DATOS=<dir>/f/r.json`, donde `<dir>/f` es un fichero normal (no una carpeta)
- WHEN `cancelar Norte lun`, y también `anular Norte lun`
- THEN imprimen `no se pudo guardar: <dir>/f/r.json` y salen con código 1, y no imprimen `cancelada Norte lun` ni `anulada Norte lun`
- AND `<dir>` no contiene ningún fichero temporal

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: un fichero JSON, en `SALAS_DATOS` o, si no está, en `<os.homedir()>/.salas/reservas.json`; formato `{"version": 1, "bookings": [...]}`, UTF-8 sin BOM, con `status` ∈ `active`, `cancelled`, `voided`.
- **Idioma de los nombres**: los campos y valores del fichero son identificadores técnicos heredados del código (`room`, `day`, `slot`, `status`, `bookings`), en inglés; los textos de salida, en castellano (constitution, art. 4).
- **Límites**: no aplica — una persona y un puñado de reservas; no se fija tamaño máximo y el fichero se lee entero en cada comando.
- **Avisos**: `reservas ilegibles: <ruta>` si el fichero existe y no se entiende (código 1); `no se pudo guardar: <ruta>` si no se puede escribir (código 1).
- **Regla ante conflicto**: dos terminales a la vez, gana el último que escribe; sin bloqueo y sin aviso, y una cancelación concurrente puede perderse.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
