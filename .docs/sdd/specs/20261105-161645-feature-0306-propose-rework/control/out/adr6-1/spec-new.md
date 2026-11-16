---
id: 20261105-212026-feature-0012-persistir-reservas
feature: 0012
title: Las reservas sobreviven a cerrar y volver a abrir la terminal
mode: full
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar y volver a abrir la terminal

🦆 Hoy, si cancelas la reserva de la sala Norte del lunes y cierras la terminal, al abrirla de nuevo la reserva vuelve a estar activa: cada arranque empieza de cero. Con este cambio, la cancelación (y la anulación) se queda: al volver a abrir, la sala Norte sale libre en esa franja. Las reservas se guardan en un fichero junto a la aplicación. Si ese fichero está roto, la aplicación lo dice y no lo toca. Esto revierte la decisión de guardar todo en memoria (ADR 0004).

Validación: dev-lead — es lo que usa una persona y lo observa cerrando y abriendo la terminal de verdad: dos comandos.

## Capacidades

- Nuevas: `reservations` — qué pasa con las reservas entre un arranque y el siguiente: se conservan, qué ocurre sin fichero, con un fichero roto o si no se puede guardar.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservations`), datos persistentes nuevos (fichero de reservas con su formato), ADR vigente que se revierte (0004) · tamaño: ~110 líneas en 6 ficheros (código, tests, `.gitignore`, `operations.md`)
- Dominio (sonnet): si los escenarios cubren lo que la persona observa al cerrar y abrir (cancelación y anulación sobreviven, `libres` lo refleja) y si falta algún caso del primer arranque (señal: capacidad nueva)
- Técnica (sonnet): si el formato versionado y el rechazo de un fichero ilegible dejan la puerta abierta a 0010 y 0011 (que añaden campos a la reserva), y si la ADR 0004 queda bien tratada (señal: datos persistentes + ADR revertida)
- Mínimo razonable: solo técnica — deja sin mirar si el flujo de usuario del cierre y reapertura está completo

1. **Enfoque elegido: un fichero JSON**, descartando SQLite y un registro de eventos. SQLite (`node:sqlite`) es experimental en Node 22 (el de `tech-stack.md`) y arrastra más de lo que una sola persona con dos salas necesita; el registro de eventos aguanta mejor dos terminales a la vez, pero es más código para un caso que ya se acepta (decisión 6). Es la decisión central de esta spec.
2. **Dónde vive: `data/reservas.json`, junto a `src/`**, no en el directorio donde se lance el comando: «volver a abrir la terminal» suele ser en otra carpeta y los datos se perderían. La ruta se resuelve desde la ubicación del propio `app.js`, no desde el directorio de trabajo. `data/` va a `.gitignore` (son datos de uso) y se crea al guardar por primera vez si no existe.
3. **`SALAS_DATOS` cambia la ruta del fichero.** Lo necesitan los tests para no tocar el fichero real, y sirve en el servidor si el sitio por defecto no vale. Variable vacía = no definida; una ruta relativa se resuelve contra el directorio de trabajo. Nombre en castellano, como los comandos (ADR 0002). Es un nombre nuevo de variable de entorno; nadie lo pidió.
4. **Formato: `{"version": 1, "reservas": [...]}`**, cada reserva con sus cuatro campos de hoy (`room`, `day`, `slot`, `status`, todos texto) y cualquier campo extra conservado al reescribir. Pensado para que 0010 (motivo al cancelar) y 0011 puedan añadir campos sin migrar — es un supuesto mío: esas features no están especificadas. Es la respuesta a «cómo se migra el formato» de la ADR 0004.
5. **Sin fichero, se arranca con la reserva de ejemplo de hoy** (Norte, lun, 10:00-12:00, activa) y el fichero no se crea hasta que algo cambia. Un comando que no cambia nada (`libres`, un `cancelar` sin reserva) no escribe. Un fichero que existe con `"reservas": []` significa «sin reservas»: la de ejemplo no reaparece.
6. **Dos terminales a la vez: gana la última escritura**, sin bloqueo. Me apoyo en `mission.md` («la uso yo… no hay más usuarios»): una sola persona y comandos de milisegundos, un candado costaría más que el riesgo. `PRODUCT.md` dice «para los equipos de una oficina» y la ADR 0002 habla de usuarios de Madrid: si el servidor se comparte, esta decisión cae; **confírmame que es una sola persona**. La escritura es atómica (se escribe un fichero temporal y se renombra) para que una lectura nunca vea un fichero a medias. Es la respuesta a «dos terminales a la vez» de la ADR 0004.
7. **Un fichero ilegible detiene el comando** (también `cancelar` y `anular`, que son los que escriben) con `datos de reservas ilegibles: <ruta> (<motivo>); no se ha modificado el fichero` en la salida de error y código 1. Nunca se sobrescribe: empezar de cero en silencio perdería todas las reservas por un error. Es ilegible, comprobando en este orden y con el primer motivo que salga: JSON roto o fichero vacío (`JSON inválido`); que no sea un objeto, o que `version` falte o no sea un número (`formato inesperado`); `version` distinta de 1 (`versión <n> no soportada`); `reservas` que no es lista, o una reserva sin sus cuatro campos como texto (`formato inesperado`). Un fichero con esa forma se acepta tal cual: no valida nombres de sala, valores de `status` ni duplicados. `<ruta>` es la ruta resuelta y absoluta. Solo `libres`, `cancelar` y `anular` leen el fichero: `reservar` y un comando desconocido no lo abren, así que un fichero roto no los detiene (decisión 9). Los motivos son texto propio en castellano, no el de Node (ADR 0002). Los textos son míos.
8. **Si no se puede guardar** (la carpeta de destino no se puede crear o escribir), el comando falla con `no se pudieron guardar las reservas: <ruta>; el cambio no se ha aplicado` en la salida de error y código 1. El texto es mío.
9. **Se persisten los cambios que existen hoy: `cancelar` y `anular`; solo `libres`, `cancelar` y `anular` leen el fichero.** Con dos reservas activas de la misma sala y día, `cancelar` y `anular` actúan sobre la primera del fichero, como hoy. `reservar` no crea ninguna reserva (solo devuelve `reserva semanal creada`), así que no hay nada que guardar de él; arreglarlo es otra feature. Lo dejo dicho porque «las reservas sobreviven» puede sonar a que `reservar` ya funciona.
10. **Capacidad nueva: `reservations`** (inglés, nombre de fichero). Se evita `bookings` por el término a evitar de `PRODUCT.md`.
11. **Esta feature revierte la ADR 0004** («el estado vive en un solo proceso»), aceptada y con la confirmación «`src/` no importa `node:fs`», que se rompe en cuanto se implementa. Por eso la ADR nueva (0007, «las reservas se guardan en un fichero JSON versionado») se escribe en la **primera task del plan**, no al cerrar, y la 0004 pasa a `superseded by 0007`; la spec no edita la 0004 (es inmutable). La única edición de la 0004 es su campo `status`, en la Task 1. La 0007 mantiene lo que dicen la 0002 (mensajes en castellano), la 0005 (`rooms` no se toca) y la 0006 (sin colores), y dice la consecuencia para el despliegue: `data/` vive en el árbol del código, y una copia limpia o un `git clean` lo borra. También cambia `operations.md`: la línea «Motor de producción», una línea de `SALAS_DATOS` en «Comandos» y la recomendación de apuntarla fuera del árbol del código en producción.
12. **Los tests existentes usarán un fichero temporal** vía `SALAS_DATOS`, para que `node --test` no lea ni escriba `data/reservas.json` ni dependa del orden entre ficheros. La ubicación por defecto se prueba sobre una copia de `app.js` en una carpeta temporal.
13. **`engines` de `package.json` (`>=20`) y `tech-stack.md` (Node 22) no coinciden; no los toco aquí.** La ruta se calcula con `fileURLToPath(import.meta.url)`, que vale en las dos.
14. **Repaso de coherencia:** `git grep` de «memoria», «node:fs» y «empieza vacío» solo da la ADR 0004 y `operations.md:14` (ya en la tabla); `scripts/lint.mjs` importa `node:fs` pero la confirmación de la 0004 habla solo de `src/`. El delta, fusionado en una copia de `.docs/sdd` con `sdd capability merge`, crea `reservations.md` con 19 requisitos y 5 reglas (repetido tras la segunda ronda; la primera vez rechazó una referencia a «decisión 7» dentro de las Reglas, ya reescrita); el repo no cambia.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica, más una segunda ronda con un revisor sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Dominio:
- **Aceptado** — nada comprueba que `anular` vea lo persistido, ni `cancelar` tras `anular` → el escenario de anulación lleva ahora el AND `cancelar Norte lun` → `sin reserva Norte lun`.
- **Aceptado** — no se dice qué guarda `status` → Reglas: `cancelled` / `voided` (los valores de hoy).
- **Aceptado** — «Idioma» y «Límites» marcados «no aplica» → ahora declarados (decisiones 3, 4 y 7).
- **Aceptado** — límites de un fichero nuevo sin cubrir → decisiones 7 y 8 y tres escenarios nuevos.
- **Aceptado** — el motivo de `JSON.parse` no es verificable ni está en castellano → motivos propios (decisión 7).
- **Aceptado** — `/tmp/otro.json` es solo POSIX → «un temporal propio del test».
- **Aceptado** — `SALAS_DATOS` no estaba en Scope → añadido, con `operations.md`.
- **Aceptado** — falta `reservas: []` → decisión 5 y escenario.
- **Aceptado** — «afecta a 0010/0011» era promesa → marcado como supuesto (decisión 4).
- **Aceptado (sin cambio)** — ejemplos inventados, nada que corregir (hallazgo 10 en lo demás).

Segunda ronda (sin tercera):
- **Aceptado** — GIVEN de «no se puede guardar» no portable → «el directorio padre es un fichero normal», sin salida normal y sin temporal huérfano.
- **Aceptado** — orden de comprobación sin fijar → fijado en la decisión 7; el escenario mezclado se parte en tres y se añaden `[]` y `version` de texto.
- **Aceptado** — duplicados, salas y `status` desconocidos, reserva ambigua → decisiones 7 y 9 y un escenario.
- **Aceptado** — qué comandos leen el fichero → decisión 9, Scope y un escenario con `reservar`.
- **Rechazado** — escenarios de «gana la última escritura» y de atomicidad: una carrera entre dos procesos no se prueba de forma determinista, y un test flaky es peor que ninguno. Las dos reglas quedan como decisión de diseño **sin verificar por test**, para la revisión final.
- **Aceptado** — una sola persona frente a `PRODUCT.md` → decisión 6, que pide confirmación.
- **Aceptado** — `data/` junto al código se pierde al redesplegar → ADR 0007 y `operations.md` (decisión 11).
- **Aceptado** — `<ruta>` ambigua y relativa sin probar → ruta resuelta y absoluta (decisión 7), escenario de ruta relativa; la vacía va en el de la ruta por defecto.
- **Aceptado** — quién edita el `status` de la 0004 → solo la Task 1, en Scope; «Se valida en: la rama» se quita (se ve desde la rama).

Técnica:
- **Aceptado (Crítico)** — sin `SALAS_DATOS` los tests tocarían los datos reales → GIVEN común en «Reglas» y decisión 12; la ruta por defecto se prueba sobre una copia.
- **Aceptado (Crítico)** — el escenario de `SALAS_DATOS` no era verificable → reescrito con ruta temporal, salida `cancelada Norte lun`, código 0 y `status` del fichero.
- **Aceptado (Crítico)** — el ilegible solo se probaba con `libres` y con placeholders → escenario de `cancelar` sobre fichero roto y motivos fijos.
- **Aceptado** — salidas exactas y código 0 de `cancelar` y `anular` → en los THEN.
- **Aceptado** — faltan campo extra conservado y formas inválidas → escenarios nuevos.
- **Aceptado** — `data/` inexistente y fallo de escritura → decisiones 2 y 8, escenarios nuevos.
- **Aceptado** — 0007 al cerrar rompe la confirmación al implementar; ADR 0002/0005/0006 → decisión 11: 0007 en la Task 1.
- **Aceptado** — `SALAS_DATOS` vacía o relativa, `operations.md` → decisión 3 y Scope.
- **Aceptado** — `engines` y `import.meta` → decisión 13.
- **Aceptado** — escritura atómica en la regla → decisión 6.

### Decisiones tomadas con el dev-lead

- Que las reservas sobrevivan a cerrar y volver a abrir la terminal — «que las reservas sobrevivan a cerrar y volver a abrir la terminal»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy cada arranque de salas empieza con la reserva de ejemplo y descarta lo que se hizo antes: una cancelación hecha ayer no existe hoy (ADR 0004). Para una herramienta que se usa a diario esto la vuelve inútil como registro. Éxito: cancelar o anular, cerrar la terminal, abrir otra y ver el mismo estado en `libres`, `cancelar` y `anular`. Fracaso, aunque «funcione»: perder todas las reservas por un fichero estropeado, o que los tests escriban en el fichero real.

## Scope

- Entra: leer las reservas de `data/reservas.json` (o `SALAS_DATOS`) al ejecutar cada comando; escribirlas tras `cancelar` y `anular` cuando cambian algo, de forma atómica; el rechazo de un fichero ilegible y el fallo al guardar; `data/` en `.gitignore`; los tests con fichero temporal; `operations.md` («Motor de producción» y `SALAS_DATOS`); la ADR 0007 y el campo `status` de la 0004 en la primera task; que solo `libres`, `cancelar` y `anular` lean el fichero.
- No entra: que `reservar` cree reservas; bloqueo entre terminales; migrar formatos futuros; motivo al cancelar (0010) y anular de otros (0011); cualquier otro comando; alinear `engines` con `tech-stack.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «El estado vive en memoria; cada arranque empieza vacío; cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0004-single-process-state.md:16,21,25`; `.docs/sdd/operations.md:14` | decisión 11: ADR 0007 la sustituye; `operations.md` se corrige en el plan |
| Confirmación «`src/` no importa `node:fs`» | `.docs/sdd/decisions/0004-single-process-state.md:29` | decisión 11: queda sin vigor con la 0004 sustituida, desde la Task 1 |

- Filas que implementa: 0012 (reservada con `sdd id next`, sin fila en el roadmap; la fila se añade en la apertura) → ficheros que la nombren: ninguno · comprobado con `git grep -nE "0012" -- . ':!.docs/sdd/specs'` (sin resultados).

## Approach

El estado se carga del fichero al ejecutar cada comando y se guarda tras un cambio, con la forma de las decisiones 2 a 8. Las operaciones de hoy (`libres`, `cancelar`, `anular`) no cambian de salida: solo de dónde leen y qué guardan. Lo demás (módulo, orden de tasks) lo decide el plan.

## Dónde se prueba

Todos los escenarios parten de `SALAS_DATOS` apuntando a un fichero temporal propio del test (que no existe, salvo que el GIVEN diga otra cosa); nunca se toca `data/reservas.json` real.

- Cancelar o anular y que sobreviva: arrancando `node src/app.js` varias veces con `SALAS_DATOS` temporal y un directorio de trabajo distinto de la raíz del repo, porque el cierre de la terminal es un proceso nuevo; no se puede probar con `run` en el mismo proceso.
- `libres`, `cancelar`, `anular` y el primer arranque: por `run`, como los tests actuales (`test/cancel.test.js`).
- Mensajes de error y códigos de salida: por el proceso arrancado, que es donde se ven.
- La ubicación por defecto (`data/reservas.json`): sobre una copia de `app.js` en una carpeta temporal, para no tocar los datos reales.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: «las reservas se guardan en un fichero JSON versionado» — alternativas descartadas: memoria (la 0004 vigente), SQLite, registro de eventos; sustituye a la 0004. Se escribe en la Task 1 (decisión 11).

## Delta de comportamiento

### Capacidad: `reservations`

#### ADDED — Las reservas sobreviven a cerrar la terminal

- GIVEN la reserva Norte lun 10:00-12:00 activa y sin fichero de datos
- WHEN `cancelar Norte lun` y después, en otro proceso, `libres 10:00-12:00`
- THEN el primer comando muestra `cancelada Norte lun` con código 0, y el segundo muestra `Norte, Sur`
- AND `cancelar Norte lun` en un tercer proceso muestra `sin reserva Norte lun`
- AND `anular Norte lun` en un cuarto proceso muestra `sin reserva Norte lun`

#### ADDED — La anulación también se conserva

- GIVEN la reserva Norte lun 10:00-12:00 activa y sin fichero de datos
- WHEN `anular Norte lun` y después, en otro proceso, `libres 10:00-12:00`
- THEN el primer comando muestra `anulada Norte lun` con código 0, y el segundo muestra `Norte, Sur`
- AND `cancelar Norte lun` en un tercer proceso muestra `sin reserva Norte lun`

#### ADDED — Sin fichero se arranca con la reserva de ejemplo y no se crea el fichero al leer

- GIVEN que no existe el fichero de datos
- WHEN `libres 10:00-12:00`
- THEN muestra `Sur`
- AND el fichero de datos sigue sin existir

#### ADDED — Un fichero sin reservas no recupera la de ejemplo

- GIVEN un fichero de datos `{"version": 1, "reservas": []}`
- WHEN `libres 10:00-12:00`
- THEN muestra `Norte, Sur`

#### ADDED — Un comando que no cambia nada no escribe

- GIVEN que no existe el fichero de datos
- WHEN `cancelar Sur mar`
- THEN muestra `sin reserva Sur mar` con código 0
- AND el fichero de datos sigue sin existir

#### ADDED — Un campo extra de la reserva se conserva al guardar

- GIVEN un fichero de datos con la reserva `{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "active", "motivo": "sin sitio"}` y la reserva `{"room": "Sur", "day": "mar", "slot": "09:00-10:00", "status": "active", "motivo": "taller"}`
- WHEN `cancelar Norte lun`
- THEN el fichero conserva `"motivo": "sin sitio"` en la de Norte, que ahora tiene `"status": "cancelled"`, y la de Sur queda igual

#### ADDED — El primer guardado crea la carpeta de datos

- GIVEN `SALAS_DATOS` apuntando a un fichero dentro de una carpeta que no existe
- WHEN `cancelar Norte lun`
- THEN muestra `cancelada Norte lun` con código 0 y el fichero existe con `"status": "cancelled"`

#### ADDED — Un fichero ilegible detiene el comando y no se toca

- GIVEN un fichero de datos con el contenido `{roto`
- WHEN `libres 10:00-12:00`
- THEN la salida de error es `datos de reservas ilegibles: <la ruta de SALAS_DATOS> (JSON inválido); no se ha modificado el fichero` y el código de salida es 1
- AND el contenido del fichero sigue siendo `{roto`

#### ADDED — Un comando que escribe tampoco sobrescribe un fichero ilegible

- GIVEN un fichero de datos con el contenido `{roto`
- WHEN `cancelar Norte lun`
- THEN la salida de error es `datos de reservas ilegibles: <la ruta de SALAS_DATOS> (JSON inválido); no se ha modificado el fichero`, el código de salida es 1 y no hay salida normal
- AND el contenido del fichero sigue siendo `{roto`

#### ADDED — Un fichero vacío se rechaza como ilegible

- GIVEN un fichero de datos vacío (0 bytes)
- WHEN `libres 10:00-12:00`
- THEN la salida de error es `datos de reservas ilegibles: <la ruta de SALAS_DATOS> (JSON inválido); no se ha modificado el fichero` y el código de salida es 1
- AND el fichero sigue vacío

#### ADDED — Un fichero con forma inesperada se rechaza como ilegible

- GIVEN un fichero de datos `[]`, o `{"reservas": []}`, o `{"version": "1", "reservas": []}`, o `{"version": 1}`, o `{"version": 1, "reservas": [{"room": "Norte"}]}`
- WHEN `libres 10:00-12:00`
- THEN en cada caso la salida de error es `datos de reservas ilegibles: <la ruta de SALAS_DATOS> (formato inesperado); no se ha modificado el fichero` y el código de salida es 1
- AND el fichero queda como estaba

#### ADDED — La versión se comprueba antes que la lista de reservas

- GIVEN un fichero de datos `{"version": 2}`
- WHEN `libres 10:00-12:00`
- THEN el motivo es `versión 2 no soportada`, no `formato inesperado`

#### ADDED — Un fichero roto no detiene a `reservar`

- GIVEN un fichero de datos con el contenido `{roto`
- WHEN `reservar Norte --cada-semana`
- THEN muestra `reserva semanal creada` con código 0 y el fichero sigue siendo `{roto`

#### ADDED — Con dos reservas de la misma sala y día, se actúa sobre la primera del fichero

- GIVEN un fichero con `Norte lun 08:00-09:00` y `Norte lun 10:00-12:00`, las dos activas, en ese orden
- WHEN `cancelar Norte lun`
- THEN muestra `cancelada Norte lun`, la de 08:00-09:00 queda `cancelled` y la de 10:00-12:00 sigue `active`

#### ADDED — Una versión de formato desconocida se rechaza como ilegible

- GIVEN un fichero de datos `{"version": 2, "reservas": []}`
- WHEN `libres 10:00-12:00`
- THEN la salida de error es `datos de reservas ilegibles: <la ruta de SALAS_DATOS> (versión 2 no soportada); no se ha modificado el fichero` y el código de salida es 1

#### ADDED — Si no se puede guardar, el comando falla y lo dice

- GIVEN la reserva Norte lun 10:00-12:00 activa y `SALAS_DATOS` apuntando a un fichero cuyo directorio padre es un fichero normal
- WHEN `cancelar Norte lun`
- THEN la salida de error es `no se pudieron guardar las reservas: <la ruta de SALAS_DATOS>; el cambio no se ha aplicado`, el código de salida es 1 y no hay salida normal
- AND no queda ningún fichero temporal junto a esa ruta

#### ADDED — `SALAS_DATOS` cambia dónde se guardan las reservas

- GIVEN `SALAS_DATOS` apuntando a un fichero temporal propio del test, y que `data/reservas.json` junto a `src/` no existe
- WHEN `cancelar Norte lun`
- THEN las reservas se guardan en ese fichero y no se crea `data/reservas.json`

#### ADDED — Sin `SALAS_DATOS` se usa `data/reservas.json` junto a `src/`, lo lance quien lo lance

- GIVEN una copia de la aplicación en una carpeta temporal, sin `SALAS_DATOS` (o vacía), y un directorio de trabajo distinto de esa carpeta
- WHEN `cancelar Norte lun`
- THEN se crea `data/reservas.json` junto a la copia de `src/`, no en el directorio de trabajo

#### ADDED — Una ruta relativa de `SALAS_DATOS` se resuelve contra el directorio de trabajo

- GIVEN `SALAS_DATOS` con el valor `reservas-prueba.json` y un directorio de trabajo temporal propio del test
- WHEN `cancelar Norte lun`
- THEN el fichero se crea como `reservas-prueba.json` dentro de ese directorio de trabajo

#### Reglas de la capacidad — reservations

- **Dónde viven los datos**: `data/reservas.json` junto a `src/`, o la ruta de `SALAS_DATOS` (vacía = no definida; relativa = contra el directorio de trabajo); formato `{"version": 1, "reservas": [...]}`, cada reserva con `room`, `day`, `slot`, `status` (texto; hoy `active`, `cancelled`, `voided`) y los campos extra que traiga, conservados; escritura atómica.
- **Idioma de los nombres**: `room`, `day`, `slot` y `status` no cambian; la clave nueva `reservas` y la variable `SALAS_DATOS` van en castellano (ADR 0002); `version` es la palabra corriente de un formato.
- **Límites**: forma inesperada, fichero vacío y versión distinta de 1 son «ilegible», comprobados en este orden: JSON, que sea un objeto con `version` numérica, versión 1, `reservas` lista de reservas completas; un fichero con la forma buena se acepta tal cual (sin validar salas, `status` ni duplicados); un fallo al escribir es «no se pudieron guardar». Solo `libres`, `cancelar` y `anular` leen el fichero.
- **Avisos**: `datos de reservas ilegibles: <ruta> (<motivo>); no se ha modificado el fichero` con motivo `JSON inválido`, `formato inesperado` o `versión <n> no soportada`, y `no se pudieron guardar las reservas: <ruta>; el cambio no se ha aplicado`; los dos por la salida de error, código 1.
- **Regla ante conflicto**: dos terminales a la vez, gana la última escritura; no hay bloqueo. Esta regla y la escritura atómica no tienen escenario (una carrera entre procesos no se prueba de forma determinista): quedan sin verificar por test.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
