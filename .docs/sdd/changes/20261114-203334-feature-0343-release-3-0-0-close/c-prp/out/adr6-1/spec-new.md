---
id: 20261115-193436-feature-0012-persist-bookings
feature: 0012
title: Las cancelaciones y anulaciones sobreviven a cerrar la terminal
mode: full
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las cancelaciones y anulaciones sobreviven a cerrar la terminal

🦆 Hoy, si cancelas `Norte lun` y cierras la terminal, al abrirla otra vez la reserva vuelve a estar activa y `libres 10:00-12:00` vuelve a decir `Sur`. Con este cambio, lo que cancelas o anulas se queda: al abrir de nuevo, `cancelar Norte lun` responde `sin reserva Norte lun` y `libres 10:00-12:00` dice `Norte, Sur`. Por dentro, salas guarda las reservas en un fichero JSON de tu carpeta personal y lo lee al arrancar; si el fichero está roto, avisa y no toca nada. Esto sustituye la decisión 0004 («el estado vive en memoria»). Ojo: `reservar` hoy no crea ninguna reserva, así que de momento lo único que se ve persistir son las cancelaciones y las anulaciones.

Validación: dev-lead — lo usa una persona: hay que cerrar y volver a abrir la terminal de verdad.

## Capacidades

- Nuevas: `booking-persistence` — el estado de las reservas se conserva entre ejecuciones.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-persistence`), contrato público (formato del fichero `reservas.json`), datos (estado persistente nuevo) · tamaño: ~110 líneas en 8 ficheros
- Dominio (sonnet): si los escenarios cubren lo que el Intent promete (cancelar/anular conservados, primer arranque, sin escritura sin cambio, fichero ilegible) y si «anular» tiene su propio THEN con datos (señal: capacidad nueva)
- Técnica (sonnet): si `run` cargando en cada llamada y el formato `{room, day, slot, status}` encajan con `src/app.js` y los tests actuales, y si la escritura atómica y `SALAS_DATOS` están en los escenarios (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar si el Intent y los escenarios dicen lo mismo

Coherencia: `sdd capability merge` sobre una copia → 4 requisitos añadidos y 5 reglas de `booking-persistence.md`, sin rechazos (repetido tras la review: 12 requisitos y 5 reglas); `git grep` de «memoria» y de la 0012 solo da `operations.md:14` y la ADR 0004, ambas en la tabla de «Lo que se retira».

1. Enfoque: fichero JSON leído al arrancar y escrito tras cada cambio, frente a SQLite (`node:sqlite` es experimental en Node 22 y arrastra decisiones de migración) y a un registro de eventos (más piezas para 2 salas) — ver Approach.
2. Nueva capacidad `booking-persistence` (inglés, kebab-case; el nombre es un slug de fichero, una excepción consciente a _Evitar: booking_ de `PRODUCT.md`). Los mensajes de `cancelar`, `anular` y `libres` que aparecen en los THEN se citan para poder probar, no se definen aquí: hoy no existe capacidad que los posea.
3. Ruta del fichero: `path.join(os.homedir(), '.salas', 'reservas.json')`; la variable de entorno `SALAS_DATOS` la sustituye (vacía cuenta como no definida; la ruta que se muestra en los mensajes es la resuelta con `path.resolve`). Nadie dijo dónde; la carpeta personal evita ensuciar el repo y funciona desde cualquier directorio y en Windows. Si el directorio no existe, se crea al guardar.
4. Primer arranque (sin fichero): se parte de la reserva actual `Norte lun 10:00-12:00` y el fichero no se crea hasta el primer cambio. Así los comandos de solo lectura (`libres`) no escriben nada y el comportamiento de hoy no cambia.
5. Se guarda tras cada `cancelar` o `anular` que cambia algo; `sin reserva …` no escribe.
6. Escritura atómica (fichero temporal en la misma carpeta + renombrado) para no dejar un JSON a medias si se corta el proceso; tras guardar no queda ningún `.tmp`. Es una medida de implementación: no se prueba que sobreviva a un corte a mitad de escritura (exigiría simular el fallo del renombrado), se revisa en el código.
7. Formato del fichero: array JSON en UTF-8 de `{room, day, slot, status}`, con los nombres que ya usa el código (`status`: `active`, `cancelled`, `voided`). Se mantienen en inglés porque es el formato interno que ya existe, no texto de interfaz; es una excepción consciente a _Evitar: room_ de `PRODUCT.md`, que habla de lo que ve la persona.
8. Fichero ilegible = que no sea JSON válido, que esté vacío (0 bytes), que no sea un array de objetos con `room`, `day`, `slot` y `status` de tipo texto, o que algún `status` no sea `active`, `cancelled` o `voided`. Un array vacío `[]` es válido: significa «sin reservas» y no vuelve a poner la de partida. Reservas repetidas no se validan. Entonces salas no ejecuta el comando, no toca el fichero y responde por la salida de error, con código 1, `reservas.json ilegible: <ruta>; corrígelo o bórralo` (castellano, texto plano: ADR 0002 y 0006; `reservas.json` es literal aunque `SALAS_DATOS` apunte a otro nombre, la ruta va detrás). No lo reinicia sola: perdería reservas sin avisar. Límite conocido: quien borre el fichero como sugiere el aviso vuelve al primer arranque, con `Norte lun` activa de nuevo, también si la había cancelado.
9. Fallo al guardar (sin permisos, disco lleno): salas no da por hecho el cambio y responde por la salida de error, con código 1, `no se pudo guardar <ruta>; el cambio no se ha aplicado`.
10. Dos terminales a la vez: límite conocido, sin bloqueo. Como cada llamada lee, cambia y escribe, dos procesos simultáneos pueden perder un cambio sin avisar. Se acepta porque PRODUCT.md dice que la usa una sola persona; no se promete ni se prueba.
11. `reservar` sigue sin crear reservas: arreglarlo es otra feature, no se cuela aquí. Por eso el Intent se limita a cancelaciones y anulaciones.
12. Módulo nuevo `src/almacen.js` (`cargar`, `guardar`): la entrada sigue siendo `src/app.js`, pero `architecture.md` dice «un solo fichero de entrada», que se corrige (ver Scope). `run` carga el estado al empezar cada llamada: así un proceso nuevo y la segunda llamada de un test ven lo mismo.
13. Cómo sale el error: `run` lanza una excepción con el mensaje y el bloque de entrada de `app.js` la escribe por la salida de error con `process.exitCode = 1`.
14. Validación `dev-lead`, no `agente`: lo que se valida es cerrar y abrir una terminal real.
15. Política de modelos: dos revisores de spec, dominio en sonnet (no cambia reglas de negocio) y técnica en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Hallazgos de la review

- **Aceptado** — Crítico (técnica) y Importante (dominio): el escenario juntaba cancelar y anular → dos escenarios, cada uno con su GIVEN completo, el `status` guardado y `libres` en un proceso nuevo.
- **Aceptado** — Crítico (técnica) y Importante (dominio): «Fichero ilegible» con «cualquier comando» sin datos → WHEN con `libres 10:00-12:00` y con `cancelar Norte lun`, ruta concreta en el GIVEN y el THEN, y escenarios para fichero vacío y de forma incorrecta (decisión 8).
- **Aceptado** — Crítico (técnica): faltaban escenarios de ruta por defecto, directorio inexistente, escritura atómica → añadidos (directorio inexistente y ruta por defecto, `.tmp` residual).
- **Aceptado** — Importante (técnica): decisiones en el cuerpo y no en ✋ (módulo, carga por llamada, formato en inglés, salida de error) → decisiones 7, 12 y 13; Scope actualiza `architecture.md`.
- **Aceptado** — Importante (técnica): `~` y Windows, `SALAS_DATOS` vacía, fallo al guardar → decisiones 3 y 9, con escenario.
- **Aceptado** — Importante (técnica): «sin cambio no se escribe» pasaría reescribiendo → el escenario comprueba que `mtime` no cambia y da el contenido del fichero.
- **Aceptado** — Importante (técnica): primer arranque no cubría crear el fichero con la reserva de partida → escenario «Primer cambio sin fichero».
- **Aceptado** — Importante (técnica): cómo se prueba el código 1 y el aislamiento entre tests → «Dónde se prueba» (`spawnSync` en un test, `mkdtemp` por test).
- **Aceptado** — Importante (dominio): reglas de la capacidad sin formato ni valores de `status` → «Reglas de la capacidad» los declara.
- **Aceptado** — Menor (técnica y dominio): «gana la última escritura» como regla probable → decisión 10, límite conocido sin garantía.
- **Aceptado** — Menor (dominio): el Intent prometía más que la entrega → Intent y título acotados a cancelaciones y anulaciones.
- **Aceptado** — Menor (dominio): aviso con ruta distinta del nombre → decisión 8 (nombre literal, ruta detrás, salida de error, código 1).
- **Segunda ronda (un revisor, sonnet), aceptado** — cifra de «Coherencia» desfasada → corregida; «fallo al guardar» no reproducible → caso fijado (el padre es un fichero normal) con AND de contenido intacto y sin `.tmp`; `status` desconocido, `[]` y duplicados sin decidir → decisión 8, «Límites» y escenarios; `SALAS_DATOS` vacía y `<ruta>` dependiente de la plataforma → escenario y `<ruta>` definida como `path.resolve`; «Ruta por defecto» sin contenido → ANDs añadidos; borrar el fichero resucita `Norte lun` → límite conocido en la decisión 8; ADR y fila del roadmap fuera de «Entra» → Scope; nombre `booking-persistence` y mensajes citados → decisión 2; cancelar un `voided` y anular un `cancelled` → escenario «Solo lo activo se cancela o anula».
- **Segunda ronda, aceptado con matiz** — «no queda `.tmp`» pasa con escritura directa → se declara en la decisión 6 que la atomicidad no se prueba (simular el fallo del renombrado costaría más que lo que protege) y se revisa en el código.
- **Rechazado** — Menor (dominio, n.º 9): confirmar que ninguna capacidad futura documentará el arranque «vacío» → no hay `capabilities/` hoy y el delta es solo `ADDED`; no hay nada que modificar.

### Decisiones tomadas con el dev-lead

- Que las reservas sobrevivan a cerrar y volver a abrir la terminal; perfil delegate; escribir la spec y presentarla — «que las reservas sobrevivan a cerrar y volver a abrir la terminal. Perfil delegate. Escribe la spec y preséntamela.»

## Intent

Hoy salas empieza vacío en cada arranque (ADR 0004: «Cerrar la terminal pierde las reservas»), así que cualquier cancelación o anulación se pierde al cerrar la terminal. Se quiere que las cancelaciones y anulaciones sigan ahí al volver a abrirla. Éxito: tras `cancelar Norte lun`, un proceso nuevo ve la reserva cancelada. Anti-objetivos: perder reservas sin avisar si el fichero se estropea; dejar el fichero a medias; que un comando de solo lectura escriba en disco.

## Scope

- Entra: guardar y leer las reservas en un fichero JSON (`src/almacen.js`); guardado tras `cancelar` y `anular`; avisos de fichero ilegible y de fallo al guardar; adaptar los tests existentes para que usen un fichero temporal propio por test (`SALAS_DATOS`); actualizar `operations.md` («Motor de producción»), `architecture.md` («un solo fichero de entrada») y el README. La ADR que sustituye a la 0004 (con su Confirmación sobre `node:fs`) la escribe el cierre, y la fila de la 0012 en `ROADMAP.md` la crea la apertura de la feature.
- No entra: que `reservar` cree reservas; bloqueo entre dos terminales; migración de formato o versionado del fichero; una base de datos; exportar a `.ics` (fila 0004).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | Scope: se actualiza en la feature |
| «Un solo fichero de entrada: `src/app.js`» | `.docs/sdd/steering/architecture.md:4` | decisión 12 y Scope: se corrige para reflejar `src/almacen.js` |
| ADR 0004 «El estado vive en un solo proceso» y su Confirmación «`src/` no importa `node:fs`» | `.docs/sdd/decisions/0004-single-process-state.md` | decisión 1 y «Términos y ADR»: la sustituye una ADR nueva que escribe el cierre |
| `bookings` solo en memoria, arranca siempre igual | `src/app.js:3` | Scope: lo sustituye la carga desde el fichero |
| Tests que dependen de la memoria compartida del proceso | `test/cancel.test.js`, `test/app.test.js` | Scope: pasan a un fichero temporal por test |

- Filas que implementa: nada: comprobado con `git grep -nE "0012" -- . ":!.docs/sdd/specs"` (la fila de la 0012 no existe en `ROADMAP.md`; se crea al abrir la feature).

## Approach

- A) Fichero JSON en la carpeta personal, leído al arrancar y escrito tras cada cambio — sin dependencias, dos funciones (`cargar`, `guardar`) en un módulo `src/almacen.js`; no resuelve dos terminales a la vez.
- B) SQLite (`node:sqlite`) — experimental en Node 22 y obliga a decidir migraciones; excesivo para dos salas.
- C) Registro de eventos (se reproduce al arrancar) — más piezas y formato propio sin que nadie lo necesite.
- Elegido: A — es lo más pequeño que cumple el Intent y mantiene «Node 22, sin dependencias externas» de `architecture.md`.

`run` carga el estado al empezar cada llamada y, si `cancelar` o `anular` lo cambian, lo guarda antes de responder (decisiones 3 a 9 y 12 a 13 fijan ruta, formato, errores y salida).

## Dónde se prueba

- Persistencia entre ejecuciones: llamando dos veces a `run` sobre el mismo fichero temporal (cada llamada recarga el estado, como un proceso nuevo), en la costura de los tests de cancelación actuales; cada test crea su carpeta con `mkdtemp` y apunta `SALAS_DATOS` a ella, para que los ficheros de test en paralelo no choquen.
- Fichero ilegible, fallo al guardar y primer arranque: por `run` con un fichero temporal, mismo patrón.
- Código de salida 1 y salida de error: un test con `spawnSync` de `node src/app.js`.
- Ruta por defecto: un test con `HOME` y `USERPROFILE` apuntando a una carpeta temporal; el cierre real de terminal lo valida el dev-lead a mano.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: «El estado de las reservas vive en un fichero JSON» — alternativa descartada: en memoria (sustituye la 0004) y SQLite.

## Delta de comportamiento

### Capacidad: `booking-persistence`

#### ADDED — Cancelar se conserva entre ejecuciones

- GIVEN un fichero de datos con `[{"room":"Norte","day":"lun","slot":"10:00-12:00","status":"active"}]` y ninguna otra reserva
- WHEN `cancelar Norte lun` y, en un proceso nuevo, `cancelar Norte lun`
- THEN el primero responde `cancelada Norte lun` y el segundo `sin reserva Norte lun`
- AND el fichero guarda `Norte lun` con `status` `cancelled`
- AND en un proceso nuevo, `libres 10:00-12:00` responde `Norte, Sur`

#### ADDED — Anular se conserva entre ejecuciones

- GIVEN el mismo fichero de datos, con `Norte lun` activa y ninguna otra reserva
- WHEN `anular Norte lun` y, en un proceso nuevo, `anular Norte lun`
- THEN el primero responde `anulada Norte lun` y el segundo `sin reserva Norte lun`
- AND el fichero guarda `Norte lun` con `status` `voided`
- AND en un proceso nuevo, `libres 10:00-12:00` responde `Norte, Sur`

#### ADDED — Primer arranque sin fichero

- GIVEN que no existe el fichero de datos
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`
- AND el fichero sigue sin existir

#### ADDED — El primer cambio crea el fichero

- GIVEN que `SALAS_DATOS` apunta a `<carpeta temporal>/nueva/reservas.json` y la carpeta `nueva` no existe
- WHEN `cancelar Norte lun`
- THEN responde `cancelada Norte lun`
- AND se crean la carpeta y el fichero, con `Norte lun` en `cancelled`
- AND en un proceso nuevo, `libres 10:00-12:00` responde `Norte, Sur`
- AND no queda ningún fichero `.tmp` en la carpeta

#### ADDED — Ruta por defecto

- GIVEN que `SALAS_DATOS` no está definida y la carpeta personal es `<carpeta temporal>`
- WHEN `cancelar Norte lun`
- THEN responde `cancelada Norte lun`
- AND el fichero se crea en `<carpeta temporal>/.salas/reservas.json` con `Norte lun` en `cancelled`

#### ADDED — `SALAS_DATOS` vacía

- GIVEN `SALAS_DATOS` definida como cadena vacía y la carpeta personal es `<carpeta temporal>`
- WHEN `cancelar Norte lun`
- THEN se comporta como «Ruta por defecto»: el fichero se crea en `<carpeta temporal>/.salas/reservas.json`

#### ADDED — Solo lo activo se cancela o anula

- GIVEN un fichero con `Norte lun` en `voided`, y por separado otro con `Norte lun` en `cancelled`
- WHEN `cancelar Norte lun` en el primero y `anular Norte lun` en el segundo
- THEN ambos responden `sin reserva Norte lun`
- AND los ficheros no cambian

#### ADDED — Array vacío

- GIVEN un fichero que contiene `[]`
- WHEN `libres 10:00-12:00`
- THEN responde `Norte, Sur`
- AND el fichero sigue conteniendo `[]`

#### ADDED — Sin cambio no se escribe

- GIVEN un fichero de datos con `Norte lun` en `active` y una hora de modificación fijada
- WHEN `cancelar Sur mar`
- THEN responde `sin reserva Sur mar`
- AND la hora de modificación del fichero no cambia

#### ADDED — Fichero ilegible

- GIVEN `SALAS_DATOS` apunta a `<carpeta temporal>/reservas.json` y el fichero contiene `esto no es json`
- WHEN `libres 10:00-12:00`, y por separado `cancelar Norte lun`
- THEN cada uno escribe por la salida de error `reservas.json ilegible: <ruta>; corrígelo o bórralo` y sale con código 1, donde `<ruta>` es `path.resolve` de `<carpeta temporal>/reservas.json` (en Windows, con `\`)
- AND el fichero conserva su contenido `esto no es json`

#### ADDED — Fichero vacío o con otra forma

- GIVEN un fichero de datos vacío (0 bytes), y por separado uno con `{}`, uno con `[{"room":"Norte"}]` y uno con `[{"room":"Norte","day":"lun","slot":"10:00-12:00","status":"pendiente"}]`
- WHEN `libres 10:00-12:00`
- THEN en los cuatro casos responde igual que en «Fichero ilegible», con la ruta de ese fichero
- AND el fichero conserva su contenido

#### ADDED — Fallo al guardar

- GIVEN `SALAS_DATOS` apuntando a `<carpeta temporal>/fichero/reservas.json`, donde `fichero` es un fichero normal y no una carpeta (así no se puede crear ni escribir, también como administrador o en Windows)
- WHEN `cancelar Norte lun`
- THEN escribe por la salida de error `no se pudo guardar <ruta>; el cambio no se ha aplicado` y sale con código 1, con `<ruta>` resuelta con `path.resolve`
- AND `fichero` conserva su contenido y no queda ningún `.tmp` en `<carpeta temporal>`

#### Reglas de la capacidad — booking-persistence

- **Dónde viven los datos**: `path.join(os.homedir(), '.salas', 'reservas.json')`, o la ruta de `SALAS_DATOS` si está definida y no vacía; formato: array JSON en UTF-8 de `{room, day, slot, status}`, con `status` `active`, `cancelled` o `voided`
- **Idioma de los nombres**: castellano en los mensajes; las claves y los valores de `status` del fichero, en inglés, como el código actual
- **Límites**: el fichero debe ser un array de objetos con `room`, `day`, `slot` y `status` de tipo texto y `status` entre `active`, `cancelled` y `voided`; vacío o de otra forma cuenta como ilegible; `[]` es válido y significa sin reservas; las reservas repetidas no se validan
- **Avisos**: `reservas.json ilegible: <ruta>; corrígelo o bórralo` y `no se pudo guardar <ruta>; el cambio no se ha aplicado`, por la salida de error y con código de salida 1
- **Regla ante conflicto**: ninguna; dos procesos a la vez pueden perder un cambio (límite conocido)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
