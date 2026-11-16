---
id: 20261106-100724-feature-0012-persist-bookings
feature: 0012
title: Las reservas sobreviven a cerrar y volver a abrir la terminal
mode: full
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar y volver a abrir la terminal

🦆 Hoy, si cancelas la reserva de la sala Norte del lunes y cierras la terminal, al volver a abrirla la reserva está otra vez activa: todo se olvida. Con este cambio, `salas cancelar Norte lun` deja la reserva cancelada también mañana, y `salas libres 10:00-12:00` responde `Norte, Sur` aunque hayas cerrado la terminal entre medias. Por dentro, las reservas se guardan en un fichero JSON de tu carpeta personal que leen `libres`, `cancelar` y `anular` al arrancar y que se reescribe cuando una reserva cambia.

Validación: dev-lead — lo que cambia se ve al usar la terminal (cerrar y reabrir), y solo una persona comprueba que se siente bien.

## Capacidades

- Nuevas: `bookings` — qué pasa con las reservas entre un arranque y el siguiente (guardado, lectura, fichero ilegible, ruta).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`bookings`), datos nuevos persistentes (fichero de reservas) · tamaño: ~60 líneas de código y tests en 5 ficheros (`src/app.js`, `src/store.js`, `test/store.test.js`, `test/cancel.test.js`, `test/app.test.js`), más 3 documentos (`operations.md`, ADR 0003 y 0004; el roadmap, con una línea de deuda); sigue por debajo del umbral de dos revisores: sin contrato público ni MODIFIED
- Revisor único con los siete puntos (sonnet): si los THEN de `bookings` cubren el fichero ilegible y el primer arranque sin fichero, y si la decisión 1 (supersede de la ADR 0003) deja sin contradicción `operations.md` y la propia ADR (señal: datos nuevos persistentes)
- Mínimo razonable: sin review — deja sin mirar si el reemplazo de la ADR 0003 deja alguna frase suya vigente que se contradiga con el código nuevo

Enfoques (nadie elige en `delegate`; el elegido es la decisión central):
- **A. Fichero JSON propio, leído al arrancar y reescrito al cambiar (elegido).** Encaja con «un solo fichero de entrada, sin dependencias» de `tech-stack.md`: solo `node:fs`, que es de Node.
- B. SQLite. Descartado: exige una dependencia externa (`tech-stack.md` dice «sin dependencias externas») para una lista de decenas de reservas.
- C. Proceso residente que guarda el estado en memoria (un daemon). Descartado: no sobrevive a reiniciar la máquina y añade un proceso que gestionar.

1. **La ADR 0003 («Las reservas viven en memoria del proceso») queda reemplazada por una ADR nueva, la 0004, y la 0003 pasa a `superseded by 0004`; las dos se escriben en la Task 1 del plan, no en el cierre.** La 0003 dice «cerrar la terminal pierde las reservas», «cada arranque empieza vacío» y «`src/` no importa `node:fs`». Una ADR es inmutable, así que la decisión nueva va en otra; y si las escribe el cierre, la 0003 sigue `accepted` y contradice el código durante toda la implementación. La confirmación de la 0004 sustituye a la de la 0003: «`src/` importa `node:fs` solo desde el módulo de almacenamiento y ningún paquete de base de datos». La 0004 declara también el estado inicial de la decisión 5.
2. **El fichero es `reservas.json` en `~/.salas/`** (carpeta personal del usuario, se crea al primer guardado). Nadie dijo dónde; es el sitio que no depende de desde qué carpeta lances `salas`.
3. **`SALAS_DATOS` cambia la ruta del fichero, y se crean las carpetas que falten hasta él.** Sin ella rige la de la decisión 2. Los tests la usan para no tocar tu carpeta personal; para probar la ruta por defecto, los tests cambian `HOME` y `USERPROFILE` a una carpeta temporal.
4. **Formato: `{"version": 1, "reservas": [{"sala", "dia", "franja", "estado"}]}`**, con los mismos datos de hoy (sala, día, franja, estado). Los valores de `estado` siguen siendo los del código actual (`active`, `cancelled`, `voided`), en inglés, porque ya existen así; los nombres de los campos, en castellano, por la constitución. El número de versión deja sitio a migrar el formato sin adivinar; sin migración ahora. Un `version` distinto de 1 se trata como ilegible a propósito (decisión 7): el programa no sabe leer otra versión y prefiere parar; el mensaje «arréglalo o bórralo» se acepta aunque sea escueto para ese caso.
5. **Sin fichero, el primer arranque empieza con las reservas que ya trae el programa** (la de Norte, lun, 10:00-12:00) y el fichero se crea solo al primer cambio. Un comando que solo lee (`libres`) no crea el fichero.
6. **Se guardan también las canceladas y las anuladas**, no solo las activas: el estado de cada reserva es lo que sobrevive, y el listado de canceladas de la fila 0010 las va a necesitar. Un `cancelar` o `anular` que responde `sin reserva …` no reescribe el fichero.
7. **«Ilegible» es: no es JSON válido, o es JSON sin `version: 1`, o sin una lista `reservas`, o con alguna entrada a la que le falte `sala`, `dia` o `franja` (cadenas) o cuyo `estado` no sea `active`, `cancelled` o `voided`.** Un fichero vacío cuenta como ilegible; uno sin permisos de lectura también (este caso no se prueba: no es reproducible de forma portable y se acepta como no verificado), y una ruta que es una carpeta, también. `SALAS_DATOS` definida pero vacía cuenta como no definida. Los comandos que leen el fichero son `libres`, `cancelar` y `anular`; con un fichero ilegible los tres fallan y no tocan el fichero. Texto, por la salida de error: `reservas ilegibles: <ruta> — arréglalo o bórralo`, con la ruta tal como la usa el programa (la de `SALAS_DATOS` tal cual, o la absoluta por defecto); código de salida 1. Prefiero parar a empezar vacío y pisarlas: perder reservas en silencio es justo lo que esta feature quiere evitar.
8. **Dos terminales a la vez: gana la última escritura, y se acepta que una pise el cambio de la otra aunque toquen reservas distintas.** Cada comando es un proceso corto que lee y escribe en milisegundos, y es una sola persona (mission.md): no hay bloqueos ni relectura antes de escribir. Se escribe a un fichero temporal en la misma carpeta (`reservas.json.tmp`) que luego sustituye al bueno, para no dejar un fichero a medias si el proceso muere; un temporal huérfano se pisa en el siguiente guardado (no se prueba: se acepta como no verificado). Si el cambio de nombre falla (por ejemplo `EPERM` en Windows con el fichero abierto por otro proceso), es un fallo de escritura de la decisión 9.
9. **Si no se puede escribir (carpeta sin permisos, ruta imposible, disco lleno), el comando falla**: salida de error `no se pudo guardar: <ruta>`, código de salida 1, y el fichero anterior queda intacto. La respuesta del comando (`cancelada Norte lun`) no se imprime.
10. **`reservar` sigue como está** (responde sin crear nada ni leer el fichero): hoy no crea reservas reales y no es lo que se pidió. Va como deuda a la sección «Deuda técnica» del roadmap en la Task 3.
11. **Capacidad nueva `bookings`** (inglés kebab-case por ser nombre de fichero): ninguna existía en `capabilities/`.
12. **Que `cancelar` o `anular` sobre una reserva ya cancelada o anulada responda `sin reserva <sala> <día>` no es nuevo**: es lo que hace hoy el código (`findBooking` solo busca las `active`, `src/app.js:9-11`, y `cancelBooking` responde `sin reserva …`, `src/app.js:13-17`) y los scenarios lo usan; la Task 2 lo comprueba antes de apoyarse en él.
16. **Roles y acceso: no aplica.** Es una sola persona (mission.md); el fichero no lleva permisos especiales.
13. **`operations.md` documenta la ubicación del fichero, `SALAS_DATOS` y qué hacer con un fichero ilegible en el servidor** (corregirlo o borrarlo, y se pierde el estado). Copia de seguridad: no aplica, porque nadie la ha pedido y el fichero se recrea desde el programa.
14. **Los módulos nuevos**: un módulo `src/store.js` con la lectura y escritura del fichero, y un test propio. Nombres internos, sin efecto observable.
15. **Sin `§Frontend`**: es una herramienta de terminal, sin pantallas.
- Política de modelos: un revisor de spec en sonnet (más uno de segunda ronda) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (la ejecución es Native, las tasks van una tras otra) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** (Crítico) — la ADR 0003 queda `accepted` y contradice el código hasta el cierre → decisión 1: las dos ADR se escriben en la Task 1; la 0004 declara el estado inicial precargado.
- **Aceptado** (Crítico) — el AND de la ruta por defecto no se puede probar sin tocar la carpeta real, y `/tmp/otro/` no existe en Windows → dos scenarios, ruta temporal anidada y creación de carpetas (decisión 3), y `HOME`/`USERPROFILE` temporales para la ruta por defecto.
- **Aceptado** (Importante) — `cancelar`, `anular` y `reservar` con fichero ilegible, y qué es «ilegible» → decisión 7 y dos scenarios nuevos.
- **Aceptado** (Importante) — última escritura, fallo de escritura, temporal huérfano, renombrado en Windows → decisiones 8 y 9 y un scenario de fallo de escritura.
- **Aceptado** (Importante) — `sin reserva` tras cancelar o anular dado por sabido → decisión 12.
- **Aceptado** (Importante) — el servidor escribe en `~/.salas/` y falta en `operations.md` → decisión 13 y Scope.
- **Aceptado** (Menor) — decisiones y ficheros fuera de la lista → decisiones 10, 14 y recuento de ficheros.
- **Aceptado** (Menor) — mezcla de idiomas y «Límites» sin motivo → decisión 4 y reglas de la capacidad.
- **Aceptado** (Menor) — `<ruta>` sin literal verificable → decisión 7.
- **Aceptado** (Menor) — review «pendiente» → esta sección.

Segunda ronda (revisor nuevo, sonnet, sin Críticos; no hay tercera):

- **Aceptado** (Importante) — decisiones 5, 6, 7 y 8 sin scenario → dos scenarios nuevos (fichero vacío o entradas inválidas; comando sin reserva no crea fichero); lo de `estado` guardado lo cubren los dos primeros scenarios; el temporal huérfano y la falta de permisos de lectura quedan como «no verificado», dicho en las decisiones 7 y 8.
- **Aceptado** (Importante) — «sin permiso de escritura» no es portable → el scenario usa una ruta cuya carpeta padre es un fichero normal.
- **Aceptado** (Importante) — «ilegible» incompleto → decisión 7 ampliada (entradas, `estado`, ruta que es carpeta, `SALAS_DATOS` vacía).
- **Aceptado** (Importante) — versión futura con mensaje engañoso → aclarado en la decisión 4, y el mensaje se acepta.
- **Aceptado** (Importante) — recuento de ficheros → 5 ficheros de código y tests, y el nivel de review se mantiene (sin contrato público ni MODIFIED, ~60 líneas).
- **Aceptado** (Menor) — filas de la tabla para `operations.md` y los metadatos de la ADR → añadidas.
- **Aceptado** (Menor) — roles y acceso → decisión 16.
- **Aceptado** (Menor) — `EPERM` al renombrar → decisión 8, tratado como fallo de escritura.
- **Aceptado** (Menor) — decisión 12 sin cita → líneas de `src/app.js` citadas y comprobación en la Task 2.
- **Aceptado** (Menor) — codificación del aviso en tests → «Dónde se prueba».

### Decisiones tomadas con el dev-lead

- Perfil `delegate`, spec para presentar antes de aprobar (sin aprobación por delegación) — «Perfil delegate. Escribe la spec y preséntamela.»
- Qué se pide: las reservas sobreviven a cerrar y volver a abrir la terminal — «que las reservas sobrevivan a cerrar y volver a abrir la terminal»

## Intent

Hoy las reservas viven en la memoria del proceso (ADR 0003): cada arranque de `salas` empieza con las reservas que trae el programa, y lo que cancelas o anulas se pierde al cerrar la terminal. Importa porque una reserva cancelada que reaparece activa bloquea una sala que ya está libre. El éxito: tras cerrar y reabrir, cada reserva está en el estado en que la dejaste. Fracasaría aunque funcionara si, ante un fichero estropeado, el programa empezara vacío y lo sobrescribiera sin avisar.

## Scope

- Entra: guardar el estado de las reservas en un fichero al cambiar (cancelar, anular) y leerlo al arrancar `libres`, `cancelar` y `anular`; ruta por defecto, `SALAS_DATOS` y creación de carpetas; el error de fichero ilegible y el de escritura; tests que usan un fichero temporal; `operations.md` actualizado (motor, ubicación, `SALAS_DATOS`, fichero ilegible); las ADR 0003 (a `superseded by 0004`) y 0004 (nueva), en la Task 1; la línea de deuda sobre `reservar` en el roadmap.
- No entra: crear reservas con `reservar` (decisión 10); migrar el formato del fichero (decisión 4); bloqueo entre terminales (decisión 8); copia de seguridad (decisión 13); exportar a `.ics` (B1 del roadmap); el motivo al cancelar (fila 0010).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Decisión «las reservas viven en memoria del proceso» y la consecuencia «cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0003-bookings-in-memory.md:8,22,27` | decisión 1: ADR 0004 la reemplaza; la 0003 pasa a `superseded by 0004`, en la Task 1 |
| Confirmación «`src/` no importa `node:fs`» | `.docs/sdd/decisions/0003-bookings-in-memory.md:31` | decisión 1: la 0004 trae la confirmación nueva |
| «Motor de producción: sin base de datos; las reservas viven en memoria» | `.docs/sdd/operations.md:14` | decisión 13: se reescribe a «sin base de datos; las reservas viven en un fichero JSON» y enlaza la capacidad `bookings` |
| Adiciones en `operations.md`: ubicación del fichero, `SALAS_DATOS`, qué hacer con un fichero ilegible | `.docs/sdd/operations.md` (líneas nuevas bajo «Comandos» o «Testing») | decisión 13 |
| `status` y `rutas` de la ADR 0003 (`accepted` → `superseded by 0004`); la 0004 hereda `rutas: src/**` | `.docs/sdd/decisions/0003-bookings-in-memory.md:2` | decisión 1, en la Task 1 |
| `bookings` como lista fija del módulo, sin lectura ni guardado | `src/app.js:3` | Scope: la lista se carga del fichero (decisión 5 para el caso sin fichero) |
| Tests que cancelan y anulan sobre el estado compartido del proceso | `test/cancel.test.js`, `test/app.test.js` | Scope: usan `SALAS_DATOS` apuntando a un fichero temporal, para no escribir en `~/.salas/` |

- Filas que implementa: 0012 (id reservado, sin fila en el roadmap) → nada la nombra fuera de esta carpeta: comprobado con `git grep -n "0012" -- . ':!.docs/sdd/specs'`

## Approach

El enfoque A de las decisiones. `libres`, `cancelar` y `anular` leen `reservas.json` al arrancar, y cancelar o anular reescriben el fichero entero. La lógica de lectura y escritura vive en un solo módulo (decisión 14), para que el resto de `src/app.js` siga sin tocar el disco. El resto del cómo va en `plan.md`.

## Dónde se prueba

- Las reservas sobreviven a cerrar la terminal: lanzando dos procesos `node src/app.js` seguidos con el mismo `SALAS_DATOS`, porque un solo proceso no puede probar que sobrevive — es la costura más alta que existe para esto, y los tests actuales no tienen una igual.
- Fichero ilegible, primer arranque, ruta y fallo de escritura: con `run(...)` y `SALAS_DATOS`, como los tests de `cancel.test.js`; el código de salida y la salida de error, con un proceso. La ruta por defecto, con un proceso con `HOME` y `USERPROFILE` temporales. Los tests que comparan el aviso (lleva un guion largo `—`) leen la salida de error del proceso hijo decodificada como UTF-8.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: Las reservas se guardan en un fichero JSON local — alternativas descartadas: memoria del proceso (la ADR 0003, que esta reemplaza) y SQLite. Se escribe en la Task 1 (decisión 1)

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Las reservas sobreviven al cierre de la terminal

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe, y la reserva de Norte, lun, 10:00-12:00 activa
- WHEN `salas cancelar Norte lun` termina, y en un proceso nuevo se lanza `salas libres 10:00-12:00`
- THEN la salida es `Norte, Sur`
- AND un segundo `salas cancelar Norte lun` responde `sin reserva Norte lun`

#### ADDED — Una anulación también sobrevive

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe, y la reserva de Norte, lun, 10:00-12:00 activa
- WHEN `salas anular Norte lun` termina, y en un proceso nuevo se lanza `salas libres 10:00-12:00`
- THEN la salida es `Norte, Sur`
- AND `salas cancelar Norte lun` responde `sin reserva Norte lun`

#### ADDED — Sin fichero, el primer arranque no crea nada si solo lees

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN se lanza `salas libres 10:00-12:00`
- THEN la salida es `Sur`
- AND el fichero sigue sin existir

#### ADDED — Un fichero ilegible no se pisa

- GIVEN `SALAS_DATOS` apunta a un fichero cuyo contenido es `{no es json`
- WHEN se lanza `salas libres 10:00-12:00`
- THEN la salida de error es `reservas ilegibles: <el valor de SALAS_DATOS> — arréglalo o bórralo` y el código de salida es 1
- AND el contenido del fichero sigue siendo `{no es json`

#### ADDED — Un cambio sobre un fichero ilegible tampoco lo pisa

- GIVEN `SALAS_DATOS` apunta a un fichero cuyo contenido es `{"version": 2, "reservas": []}`
- WHEN se lanza `salas cancelar Norte lun`
- THEN la salida de error es `reservas ilegibles: <el valor de SALAS_DATOS> — arréglalo o bórralo` y el código de salida es 1
- AND el contenido del fichero sigue siendo `{"version": 2, "reservas": []}`

#### ADDED — Un fichero vacío o con entradas inválidas es ilegible

- GIVEN `SALAS_DATOS` apunta a un fichero vacío, o a uno con `{"version": 1}`, o a uno con una entrada `{"sala": "Norte", "dia": "lun", "franja": "10:00-12:00", "estado": "pendiente"}`
- WHEN se lanza `salas libres 10:00-12:00`
- THEN en los tres casos la salida de error es `reservas ilegibles: <el valor de SALAS_DATOS> — arréglalo o bórralo` y el código de salida es 1

#### ADDED — Un comando sin reserva no crea ni reescribe el fichero

- GIVEN `SALAS_DATOS` apunta a un fichero que no existe
- WHEN se lanza `salas cancelar Sur mar`
- THEN la salida es `sin reserva Sur mar`
- AND el fichero sigue sin existir

#### ADDED — La ruta del fichero se puede cambiar y se crean sus carpetas

- GIVEN `SALAS_DATOS` apunta a `<carpeta temporal>/a/b/reservas.json`, que no existe ni sus carpetas, y la reserva de Norte, lun, 10:00-12:00 activa
- WHEN se lanza `salas cancelar Norte lun`
- THEN `<carpeta temporal>/a/b/reservas.json` existe y contiene la reserva de Norte, lun con estado `cancelled`

#### ADDED — Sin `SALAS_DATOS`, el fichero va a la carpeta personal

- GIVEN `SALAS_DATOS` sin definir, `HOME` y `USERPROFILE` apuntan a una carpeta temporal, y la reserva de Norte, lun, 10:00-12:00 activa
- WHEN se lanza `salas cancelar Norte lun`
- THEN `<carpeta temporal>/.salas/reservas.json` existe y contiene la reserva de Norte, lun con estado `cancelled`

#### ADDED — Si no se puede guardar, el comando falla y el fichero queda intacto

- GIVEN `SALAS_DATOS` apunta a `<carpeta temporal>/fichero/reservas.json`, donde `<carpeta temporal>/fichero` es un fichero normal y no una carpeta (así no se puede crear la ruta, sin depender de permisos del sistema)
- WHEN se lanza `salas cancelar Norte lun`
- THEN la salida de error es `no se pudo guardar: <el valor de SALAS_DATOS>` y el código de salida es 1
- AND no se imprime `cancelada Norte lun`
- AND `<carpeta temporal>/fichero` sigue siendo el mismo fichero normal, sin cambios

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: un fichero JSON, `~/.salas/reservas.json` o la ruta de `SALAS_DATOS`
- **Idioma de los nombres**: los campos del fichero en castellano (`sala`, `dia`, `franja`, `estado`); los valores de `estado` son los del código actual (`active`, `cancelled`, `voided`), en inglés porque ya existen así
- **Límites**: no aplica: la lista es de decenas de reservas y se reescribe entera; no hay tope diseñado
- **Avisos**: `reservas ilegibles: <ruta> — arréglalo o bórralo` y `no se pudo guardar: <ruta>`
- **Regla ante conflicto**: con dos terminales a la vez, gana la última escritura y puede pisar el cambio de la otra

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
