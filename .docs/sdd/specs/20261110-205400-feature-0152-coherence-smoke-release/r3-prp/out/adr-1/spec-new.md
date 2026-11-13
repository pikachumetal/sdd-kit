---
id: 20261111-191118-feature-0012-reservas-persistentes
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

🦆 Hoy, si cancelas la reserva de Norte del lunes y cierras la terminal, al abrirla otra vez esa reserva vuelve a estar activa y `libres 10:00-12:00` dice solo `Sur`. Con este cambio, lo que haces con las reservas se guarda en un fichero y la terminal nueva lo encuentra: tras cancelar, `libres 10:00-12:00` dice `Norte, Sur` también en la sesión siguiente. Alcance honesto: hoy `reservar` no crea reservas de verdad, así que lo que se conserva es el estado de las reservas existentes (cancelada, anulada). Para guardarlo, `salas` deja de ser «solo memoria», y por eso esta spec sustituye la decisión 0003 que lo decidió así.

Validación: dev-lead — es una herramienta que usa una persona en su terminal: hay que cerrarla, abrirla y ver que la reserva sigue ahí.

## Capacidades

- Nuevas: `bookings` — qué pasa con las reservas entre una sesión de terminal y la siguiente.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), datos nuevos persistentes (el fichero de reservas) · tamaño: ~200 líneas en ~10 ficheros
- Dominio (sonnet): si los escenarios de «Los cambios se conservan entre sesiones» cubren también `anular` y si «Sin fichero, arranca con las reservas de serie» deja a quien lo estrene una pista razonable (señal: capacidad nueva)
- Técnica (sonnet): si el guardado por fichero temporal + renombrado de la decisión 4 aguanta un corte a medias, y si «reservas ilegibles» no pisa el fichero (señal: datos nuevos)
- Mínimo razonable: solo técnica — deja sin mirar si el comportamiento visible (qué dice `libres` tras reabrir) está completo en los escenarios

1. **Sustituye la ADR 0003.** Guardar contradice «las reservas viven en memoria»; la 0003 dice que no se guardaba porque nadie lo pidió, y ahora lo pides. El cierre escribe la ADR 0004 (`bookings-in-file`) y pone la 0003 en `superseded by 0004`; el texto de la 0003 se conserva a propósito, es historia. Su «Confirmación» pasa de «`src/` no importa `node:fs`» a «solo `src/store.js` importa `node:fs`, `node:os` y `node:path`», y se comprueba con `git grep -nE "node:(fs|os|path)" src/`, que debe dar solo `src/store.js`; ese paso va en el plan, no en el lint.
2. **Dónde vive el fichero**: `~/.salas/reservas.json`, o la ruta de la variable de entorno `SALAS_DATOS` si existe y no está vacía (vacía = como no definida; una ruta relativa se resuelve desde la carpeta de trabajo). Una ruta por usuario y no por carpeta de trabajo, para que abrir la terminal en otro directorio no «pierda» las reservas. `SALAS_DATOS` existe sobre todo para que los tests no toquen el fichero real.
3. **Formato**: JSON legible, `{ "version": 1, "bookings": [ { "room", "day", "slot", "status" } ] }`, con las mismas claves que ya usa el código. La `version` deja la puerta a migrar; una `version` distinta de 1 se trata como ilegible (decisión 6), no se intenta adivinar.
4. **Cuándo y cómo se escribe**: solo al cambiar algo (`cancelar`, `anular` con éxito), nunca al leer (`libres`) ni cuando la respuesta es `sin reserva`. Se escribe a `<ruta>.<pid>.tmp` (sufijo único por proceso, para que dos terminales no pisen el mismo temporal) y se renombra sobre `<ruta>`; sin `fsync` (un corte de luz puede perder el último cambio, lo acepto). El directorio se crea si falta, también con `SALAS_DATOS`. Si no se puede crear, escribir o renombrar, falla con `no se pudo guardar: <ruta>` y código 1, y el fichero anterior queda como estaba; un `.tmp` huérfano se ignora y no se limpia. Que el fichero anterior quede intacto si falla el renombrado no se prueba (no hay forma fiable de forzarlo sin inyectar el fallo): lo garantiza renombrar al final.
5. **Sin fichero**: arranca con las reservas que hoy trae de serie (Norte, lun, 10:00-12:00) y el fichero se crea en el primer cambio. No quito ese dato de ejemplo porque los tests actuales dependen de él y nadie pidió quitarlo. No hay ninguna pista de dónde se guarda (ni aviso al crear el fichero): dónde vive está en `operations.md`.
6. **Qué es «ilegible» y qué hace**: contenido que no es JSON, vacío, JSON sin lista `bookings`, `version` distinta de 1, o cualquier error de lectura que no sea «no existe» (`ENOENT`, y también `ENOTDIR`: una ruta cuyo padre es un fichero cuenta como «no existe», y falla al guardar, decisión 4). Falla en cualquier orden que lea (`libres`, `cancelar`, `anular`, `reservar`; esta última carga solo para fallar) con `reservas ilegibles: <ruta>` por la salida de error, sin traza, código de salida 1, y **no toca el fichero** (perder las reservas sin avisar es peor que parar). El texto y el canal son míos.
7. **Dos terminales a la vez**: gana la última que escribe, sin avisar y sin bloqueos; si una terminal leyó antes de que la otra guardara, su escritura posterior borra el cambio de la otra. Para una sola persona que usa una sola terminal es lo más barato; si se vuelve un problema, será su propia fila. No se prueba.
8. **`reservar` no entra.** Hoy `reservar` solo responde `reserva semanal creada` sin crear ninguna reserva; hacer que cree reservas de verdad exige decidir sala, día y franja como argumentos y es otra feature (conviene apuntarla en el roadmap, no lo he hecho). Consecuencia que debes saber: lo que hoy se puede conservar entre sesiones es el estado de las reservas existentes, no reservas nuevas. **Si esperabas que `reservar` ya guardara reservas nuevas, dímelo: cambia el alcance.**
9. **Enfoque**: fichero JSON por usuario, frente a fichero en la carpeta de trabajo y a `node:sqlite` (ver Approach).
10. **Módulo nuevo `src/store.js`**, síncrono (los tests actuales comparan el valor devuelto por `run`), con la lectura, la comprobación de forma y el guardado; es el único que importa `node:fs`, `node:os` y `node:path`. `src/app.js` sigue siendo el único fichero de entrada. `cancelBooking`, `voidBooking` y `run` conservan su firma y sus textos; `freeRooms`, `cancelBooking`, `voidBooking` y `reservar` cargan el estado con `store.load()`; `cancelBooking` y `voidBooking` además lo cambian y lo guardan, y `run` solo despacha. La entrada (`app.js`) captura el error, escribe el mensaje por la salida de error y sale con código 1.
11. **Capacidad `bookings`** (slug en inglés, contenido en castellano): nombre y alcance míos. «booking» y «room» están en «Evitar» de `PRODUCT.md` para el texto que lee la persona; aquí son identificadores de código (el slug de la capacidad, la ADR y las claves del fichero), que ya existen en `src/app.js`, y ningún mensaje de la interfaz los usa.
12. **Reglas de la capacidad**, todas mías porque la constitution no tiene «Reglas de producto»: datos en el fichero de la decisión 2; claves en inglés (las del código), nombre del fichero y mensajes en castellano (art. 4); límites, una sola persona y pocas reservas, sin tope; avisos, los de la decisión 4 y la 6; conflicto, gana la última escritura.
13. **Los tests actuales cambian de preparación, no de aserciones**: `SALAS_DATOS` vacío y la ruta relativa no se prueban (tocar `~/.salas` real lo impide), y se lee en cada llamada (no al importar), y los tests de `test/app.test.js` y `test/cancel.test.js` —también el de `reservar`, que carga estado aunque no guarde— apuntan a un fichero temporal propio por test; sin eso, el primer `cancelar` real dejaría el fichero cancelado, el segundo test fallaría y se escribiría en el `~/.salas` real de quien desarrolla.
14. **Sin `§Frontend`**: no hay pantalla, la salida es texto de terminal.
15. **Repaso de coherencia**: el delta, fusionado en una copia de `.docs/sdd` fuera del repo, dio `bookings.md: añadido` ×5 requisitos y ×5 reglas, sin rechazos (repetido tras la segunda ronda); `git grep` de lo retirado («memoria», `0003`, `node:fs`) da las filas de «Lo que se retira o cambia de forma»; sin medir: nada. No hay topes de palabras ni subjects que prever.
- Política de modelos: dos revisores de spec en sonnet (ninguna regla de roles o permisos que pida opus) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · no se fija `control.maxParallelAgents`

### Hallazgos de la review

Segunda ronda (por el Crítico de la técnica), todos aceptados: ENOTDIR cuenta como «no existe» (decisión 6) para que el escenario de guardado imposible sea coherente; «fichero anterior intacto» declarado sin probar (decisión 4); el huérfano pasa a su requisito, por `run` y con `.1.tmp`; escenarios de `anular`, `reservar`, vacío y `{}` ilegibles; quién carga, aclarado (decisión 10); `SALAS_DATOS` vacío o relativo declarados sin probar (decisión 13); Confirmación de la ADR con `git grep` en el plan; cifras de la decisión 15 y tamaño de la cabecera recalculados. Sin tercera ronda.

Dominio:
- **Aceptado** — términos «booking»/«room» en slug y claves → decisión 11 los declara identificadores de código.
- **Aceptado** — la decisión 8 estrecha el éxito → título y 🦆 dicen el alcance, y la decisión 8 pide tu confirmación; el roadmap lo apunto como recomendación, no lo edito.
- **Aceptado** — faltaban escenarios de `anular`/`cancelar` cruzados → separados en escenarios con pasos numerados; añadido `anular` y luego `cancelar`.
- **Aceptado** — pista al estrenar sin fichero → decisión 5: ninguna, dicho expresamente.
- **Aceptado** — formas erróneas y errores de escritura → decisiones 4 y 6, con escenarios.
- **Aceptado** — «Límites» y `SALAS_DATOS` vacío o relativo → decisiones 2 y 12.
- **Aceptado** — escenario con tres pasos mezclados → pasos separados y numerados.
- **Aceptado** — conflicto de dos terminales → decisión 7 dice que el cambio de la otra se pierde y que no se prueba.
- **Aceptado** — líneas citadas de la 0003 → la tabla cita por nombre y la decisión 1 dice que su texto se conserva.
- **Aceptado** — idioma del nombre del fichero → regla «Idioma de los nombres».

Técnica:
- **Aceptado (Crítico)** — el código 1 no se prueba por `run` → decisión 10 (la entrada captura y sale con 1), escenarios de ilegible por proceso real, y «Dónde se prueba» lo dice.
- **Aceptado** — qué es ilegible; `libres` también → decisión 6 y escenarios con `libres` y `version` 2.
- **Aceptado** — caso negativo de escritura → escenario `cancelar Sur mar`.
- **Aceptado** — `.tmp`: sufijo único, huérfano, error de renombrado → decisión 4 y escenario del huérfano; `fsync` queda fuera, dicho.
- **Aceptado** — directorio inexistente → decisión 4 y escenario.
- **Aceptado** — cuándo se lee `SALAS_DATOS`, sincronía, `reservar` → decisiones 10 y 13.
- **Aceptado** — firmas exportadas y `node:os`/`node:path` → decisión 10 y la 1.
- **Aceptado** — `GIVEN` sin `SALAS_DATOS` repetido → cada escenario lo fija y numera los procesos.
- **Aceptado** — decisiones sueltas en el cuerpo → pasan a 4, 6 y 10.
- **Aceptado** — `existsSync` observable → los THEN lo nombran.

### Decisiones tomadas con el dev-lead

- Que las reservas sobrevivan a cerrar y volver a abrir la terminal; perfil `delegate`; que la spec se escriba y se te presente — «que las reservas sobrevivan a cerrar y volver a abrir la terminal. Perfil delegate. Escribe la spec y preséntamela»

## Intent

Hoy `salas` guarda las reservas solo en la memoria del proceso (ADR 0003): cerrar la terminal las pierde y cada arranque vuelve al estado de serie. Importa porque quien la usa ya ha cancelado o anulado reservas y las ve resucitar al abrirla otra vez. El éxito es que, tras cancelar o anular, cerrar y abrir una terminal nueva, `libres` y `cancelar` ven el estado nuevo. Fracasaría, aunque funcione, si un fichero estropeado hiciera perder las reservas sin avisar o si los tests tocaran el fichero real de quien desarrolla. Alcance: las reservas existentes; `reservar` sigue sin crear ninguna (decisión 8).

## Scope

- Entra: guardar en un fichero y leer de él el estado de las reservas existentes (`cancelar`, `anular`, `libres`; `reservar` lee para fallar si el fichero es ilegible); `src/store.js` y sus tres importaciones de Node; la variable `SALAS_DATOS`; los avisos de las decisiones 4 y 6 y el código de salida 1 en `src/app.js`; la preparación de los tests actuales; la ADR 0004 y el cambio de estado de la 0003 (las escribe el cierre); `operations.md`, línea «Motor de producción» y la ruta del fichero; `architecture.md`, una línea con el fichero.
- No entra: que `reservar` cree reservas de verdad (decisión 8); bloqueos o avisos entre dos terminales (decisión 7); migrar formatos (decisión 3); quitar la reserva de serie (decisión 5); `fsync` y limpiar `.tmp` huérfanos (decisión 4).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «las reservas viven en memoria del proceso» | ADR `0003-bookings-in-memory` (título, opciones, decisión); `.docs/sdd/steering/operations.md`, «Motor de producción» | decisión 1 (ADR 0004 + 0003 `superseded`; su texto se conserva) · Scope: `operations.md` |
| «`src/` no importa `node:fs`» (Confirmación de la 0003) | ADR `0003-bookings-in-memory`, «Confirmación» | decisión 1: pasa a «solo `src/store.js`» en la 0004 |
| Estado en memoria `bookings` de `src/app.js` | `src/app.js`, constante y funciones `freeRooms`, `findBooking`, `cancelBooking`, `voidBooking` | decisión 10: `store.js` lo carga y guarda |
| Tests que cancelan sobre el estado compartido | `test/app.test.js`, `test/cancel.test.js` | decisión 13 |
| `scripts/lint.mjs` importa `node:fs` | `scripts/lint.mjs`, primera línea | sin cambio: está fuera de `src/`, la Confirmación nueva solo habla de `src/` |

- Filas que implementa: nada: comprobado con `git grep -n 0012`.

## Approach

- **A. Fichero JSON por usuario** (`~/.salas/reservas.json`, o `SALAS_DATOS`) — un módulo pequeño sin dependencias, legible a mano; cuesta decidir el formato y qué pasa con dos escrituras a la vez.
- **B. Fichero JSON en la carpeta de trabajo** — más simple, pero abrir la terminal en otro directorio parece perder las reservas; descartada.
- **C. `node:sqlite`** — resuelve la concurrencia, pero es experimental en Node 22, `package.json` admite Node ≥20 y la arquitectura dice «sin dependencias»; para una sola persona sobra.
- Elegido: A — es lo más barato que cumple lo pedido sin añadir dependencias; las dos preguntas que hicieron caer la ADR 0003 (dónde vive y qué pasa con dos terminales) tienen respuesta en las decisiones 2 y 7.

El detalle del guardado y de lo ilegible está en las decisiones 4, 6 y 10.

## Dónde se prueba

- Las reservas se conservan entre sesiones, el fichero ilegible (salida de error y código 1) y el guardado que falla: con procesos reales (`child_process.spawnSync('node', ['src/app.js', …])` con `SALAS_DATOS` en una carpeta temporal) — es la única forma de probar «cerrar y abrir» y el código de salida; `run` devuelve texto y no sale con código.
- Sin fichero, escritura solo al cambiar, directorio inexistente, `.tmp` huérfano y los ilegibles que no necesitan código de salida: por `run`, como `test/cancel.test.js`, con `SALAS_DATOS` temporal, y `existsSync` sobre la ruta exacta.
- La salida de terminal se ve en el comando; sin captura.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: «las reservas se guardan en un fichero JSON por usuario» — frente a seguir en memoria (0003), a sqlite y a un fichero por carpeta; sustituye la 0003.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Los cambios se conservan entre sesiones

- GIVEN la reserva `Norte lun 10:00-12:00` activa y `SALAS_DATOS` a un fichero que no existe, el mismo en las tres terminales
- WHEN en la terminal 1 `cancelar Norte lun`; en la 2, nueva, `cancelar Norte lun`; en la 3, nueva, `libres 10:00-12:00`
- THEN la 1 dice `cancelada Norte lun`, la 2 `sin reserva Norte lun` y la 3 `Norte, Sur`
- GIVEN la reserva `Norte lun 10:00-12:00` activa y `SALAS_DATOS` a un fichero que no existe, el mismo en las tres terminales
- WHEN en la terminal 1 `anular Norte lun`; en la 2, nueva, `libres 10:00-12:00`; en la 3, nueva, `cancelar Norte lun`
- THEN la 1 dice `anulada Norte lun`, la 2 `Norte, Sur` y la 3 `sin reserva Norte lun`

#### ADDED — Sin fichero, arranca con las reservas de serie

- GIVEN `SALAS_DATOS` a un fichero que no existe
- WHEN `libres 10:00-12:00`
- THEN dice `Sur` AND `existsSync(<ruta>)` es falso
- GIVEN `SALAS_DATOS` a un fichero que no existe
- WHEN `cancelar Sur mar`
- THEN dice `sin reserva Sur mar` AND `existsSync(<ruta>)` es falso
- GIVEN `SALAS_DATOS` a un fichero que no existe
- WHEN `cancelar Norte lun`
- THEN dice `cancelada Norte lun` AND el fichero existe con la reserva `Norte lun 10:00-12:00` en estado `cancelled` AND la carpeta no contiene ningún `.tmp`

#### ADDED — Un fichero ilegible no se pisa

- GIVEN `SALAS_DATOS` a un fichero cuyo contenido es `{roto`
- WHEN `cancelar Norte lun`
- THEN falla con `reservas ilegibles: <la ruta del fichero>` por la salida de error y código de salida 1 AND el fichero sigue conteniendo `{roto`
- GIVEN `SALAS_DATOS` a un fichero cuyo contenido es `{roto`
- WHEN `libres 10:00-12:00`
- THEN falla igual, con el mismo mensaje y código 1, y el fichero sigue conteniendo `{roto`
- GIVEN `SALAS_DATOS` a un fichero cuyo contenido es `{roto`
- WHEN `anular Norte lun`, y en otro escenario `reservar Norte --cada-semana`
- THEN las dos fallan con `reservas ilegibles: <la ruta del fichero>` y código 1 AND el fichero sigue conteniendo `{roto`
- GIVEN `SALAS_DATOS` a un fichero vacío, y en otro escenario a uno cuyo contenido es `{}`
- WHEN `libres 10:00-12:00`
- THEN falla con `reservas ilegibles: <la ruta del fichero>` y código 1 AND el fichero queda igual
- GIVEN `SALAS_DATOS` a un fichero cuyo contenido es `{"version":2,"bookings":[]}`
- WHEN `libres 10:00-12:00`
- THEN falla con `reservas ilegibles: <la ruta del fichero>` y código 1 AND el fichero queda igual

#### ADDED — El guardado crea lo que falta y dice cuándo no puede

- GIVEN `SALAS_DATOS` a `<tmp>/nuevo/sub/reservas.json`, cuyo directorio no existe
- WHEN `cancelar Norte lun`
- THEN dice `cancelada Norte lun` AND el fichero existe
- GIVEN `SALAS_DATOS` a una ruta cuyo directorio padre no se puede crear (un fichero ocupa ese nombre)
- WHEN `cancelar Norte lun`
- THEN falla con `no se pudo guardar: <la ruta>` por la salida de error y código de salida 1

#### ADDED — Un temporal huérfano se ignora

- GIVEN `SALAS_DATOS` a un fichero válido con la reserva `Norte lun 10:00-12:00` activa y, junto a él, un `<ruta>.1.tmp` con basura
- WHEN `cancelar Norte lun` (por `run`)
- THEN dice `cancelada Norte lun` AND el fichero tiene la reserva en `cancelled` AND el `.tmp` sigue ahí, sin tocar

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: `~/.salas/reservas.json`, o la ruta de `SALAS_DATOS` si existe y no está vacía
- **Idioma de los nombres**: claves del fichero en inglés (`room`, `day`, `slot`, `status`); nombre del fichero y mensajes en castellano
- **Límites**: no aplica: una sola persona, pocas reservas, sin tope
- **Avisos**: `reservas ilegibles: <ruta>` si el fichero no se puede leer o no tiene la forma esperada; `no se pudo guardar: <ruta>` si no se puede escribir; ambos por la salida de error, con código de salida 1
- **Regla ante conflicto**: con dos terminales escribiendo, gana la última escritura

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
