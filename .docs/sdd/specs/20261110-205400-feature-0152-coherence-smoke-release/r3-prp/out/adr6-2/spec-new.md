---
id: 20261111-195902-feature-0012-reservas-persistentes
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

🦆 Hoy, si cancelas la reserva de Norte del lunes y abres otra terminal, la reserva vuelve a estar ahí: cada arranque empieza de cero. Con este cambio, la cancelación se queda guardada: en la terminal nueva, `libres 10:00-12:00` dice `Norte, Sur`. Las reservas se guardan en un fichero de tu carpeta personal, que el programa lee al arrancar y reescribe cada vez que una reserva cambia. Esto deja sin efecto la decisión de que el estado viva solo en memoria. Como `reservar` todavía no crea reservas, lo que se conserva son los cambios de las que ya existen; dos terminales a la vez no están protegidas.

Validación: dev-lead — lo que se ve es el comportamiento de la herramienta entre dos arranques reales, y es quien la usa quien debe comprobar que le sirve.

## Capacidades

- Nuevas: `bookings` — qué reservas existen, dónde se guardan y cómo se conservan entre arranques.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), datos nuevos persistentes (el fichero), formato de fichero y variable de entorno que otros leen (tus scripts, tus tests) · tamaño: ~130 líneas en 6 ficheros (código ~45, tests ~65, documentos ~20)
- Dominio (sonnet): si «conservar entre arranques» cubre lo que el dev-lead espera de `cancelar` y `anular` y qué pasa con la reserva de partida de Norte (señal: capacidad nueva)
- Técnica (sonnet): si la escritura atómica y el aviso de fichero ilegible aguantan un arranque cortado a medias, y si ningún test toca la carpeta personal real (señal: datos nuevos + formato de fichero)
- Mínimo razonable: solo técnica — deja sin mirar si el comportamiento por defecto sin fichero es el que quiere quien usa la herramienta

1. **Se deja sin efecto la decisión 0004 («el estado vive en un solo proceso»)** — es lo que pide el cambio: guardar entre arranques exige un fichero. La decisión nueva la escribe el cierre y marca la 0004 como sustituida; su «Confirmación» (`src/` no importa `node:fs`) deja de valer y la nueva dirá lo contrario.
2. **Enfoque: fichero JSON, escrito entero y de forma atómica, frente a SQLite y a un registro de cambios** (ver Approach).
3. **Dónde vive el fichero**: `reservas.json` dentro de `.salas/` en la carpeta personal de quien arranca el programa, la que da `os.homedir()` (igual en Windows y en POSIX). Nadie dijo dónde; la carpeta personal es el único sitio que existe en cualquier PC y no ensucia el repo.
4. **`SALAS_FICHERO` cambia la ruta**: una variable de entorno con la ruta completa del fichero. Nadie la pidió; la necesitan los tests para no escribir en la carpeta personal real, y sirve en el servidor si el fichero debe ir a otro sitio. Vacía cuenta como no definida; una ruta relativa se resuelve desde el directorio donde se arranca. Se documenta en `operations.md`.
5. **Cuándo se lee y cuándo se escribe**: se lee al arrancar cada comando; se escribe justo después de cada cambio (`cancelar`, `anular`) y nunca en un comando de consulta (`libres`) ni en un cambio que no cambia nada. Así un proceso cortado pierde como mucho el cambio en curso, no los anteriores.
6. **Escritura atómica**: se escribe en `<ruta del fichero>.tmp` (con la ruta por defecto, `reservas.json.tmp`), en la misma carpeta que el definitivo (para no cruzar volúmenes), y se renombra encima. Un corte a medias deja el fichero anterior intacto; si la escritura falla, el temporal no se queda (decisión 16). Con dos terminales a la vez comparten temporal, y el conflicto puede acabar en el aviso de la decisión 16 en vez de en «gana la última» (decisión 10).
7. **Sin fichero, el arranque parte de la reserva de hoy** (Norte, lun, 10:00-12:00): es el contenido que el programa tiene escrito en el código y no hay otro modo de crear reservas todavía. El fichero aparece con el primer cambio, no antes.
8. **Fichero ilegible: se avisa y no se toca.** «Ilegible» es: no es JSON, está vacío, o su forma no es la de la decisión 9 (`bookings` no es una lista, a una reserva le falta `room`, `day`, `slot` o `status`, o un `status` no es `active`, `cancelled` ni `voided`). Una lista `bookings` vacía es válida (no hay reservas). No se comprueba que `room` sea una sala conocida: la lista de salas (ADR 0005) sigue siendo cosa del código. El texto literal es `fichero de reservas ilegible: <ruta>`, sale por la salida de errores, el proceso termina con código 1 y ningún comando —`cancelar` incluido— cambia el fichero. Se descartó arrancar vacío o con la reserva de partida: pisaría datos que quizá se pueden arreglar a mano.
9. **Forma del fichero**: `{"bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "active"}]}`. Las claves y los estados (`active`, `cancelled`, `voided`) son los del código de hoy, para no inventar un segundo vocabulario; la clave de arriba va en inglés por lo mismo. Indentación y salto de línea final sin fijar. Sin número de versión: el formato no tiene más de una forma todavía.
10. **Dos terminales a la vez no se protegen.** Gana la última que escribe, y la otra puede perder su último cambio: es pérdida aceptada, no un efecto raro. Leer y escribir en cada comando acorta la ventana, pero no la cierra; proteger exigiría bloqueos que nadie ha pedido.
11. **No se crea ningún comando nuevo.** `reservar` hoy solo responde `reserva semanal creada` sin crear nada (`src/app.js`, `run`). Por eso lo que sobrevive a cerrar la terminal son los cambios de estado de las reservas que ya existen (`cancelar`, `anular`); sin `reservar`, «las reservas sobreviven» solo se puede comprobar con la de partida. Las transiciones son las de hoy: solo una reserva activa se cancela o se anula, y borrar el fichero devuelve la reserva de partida como activa. Dime si prefieres meter `reservar <sala> <día> <franja>` aquí; si no, es otra feature y la ve el roadmap.
12. **Capacidad nueva `bookings`** (nombre del fichero en inglés, regla de las capacidades; el contenido va en castellano).
13. **Las cinco reglas de la capacidad** se declaran en el delta con estos valores (la constitución no tiene «Reglas de producto»): datos en el fichero de la decisión 3; claves y estados en inglés como el código (decisión mía de esta capacidad) y textos al usuario en castellano (ADR 0002); sin límites; dos avisos (decisiones 8 y 16); ante conflicto, gana la última escritura (decisión 10).
14. **Política de modelos:** revisores de la spec: dos, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte.
15. **Repaso de coherencia hecho**: el delta probado sobre una copia de `.docs/sdd` (`sdd capability merge`) → `bookings.md`: requisitos y reglas añadidos, sin rechazos (repetido tras la review, ver abajo); `git grep` de `reservas.json`, `SALAS_FICHERO` y `.salas` fuera de esta spec: sin resultados, nada que renombrar (es previo a editar `operations.md` y `architecture.md`; se repite al cierre). El fichero vive en la carpeta personal, fuera del repo: `.gitignore` no cambia. `scripts/lint.mjs` solo mira tabuladores en `src/app.js`: no lee las confirmaciones de las ADR, así que el gate de cierre no falla por `node:fs` mientras la 0004 sigue vigente. Sin medir: nada.
16. **Si no se puede guardar** (carpeta que no se puede crear, sin permisos, el renombrado falla): el texto literal es `no se pudo guardar el fichero de reservas: <ruta>`, por la salida de errores, código 1, el fichero anterior intacto y sin `reservas.json.tmp`. Lo pidió la review; nadie lo dijo antes.
17. **El código de leer y guardar va en `src/app.js`**, sin módulo nuevo ni paquetes: la arquitectura dice «un solo fichero de entrada». `architecture.md` anota la ruta del fichero y la variable de entorno. El cálculo de la ruta es una función exportada (`rutaFichero`), para poder probarlo sin tocar disco.
18. **Contrato de error**: `run` lanza un `Error` con el texto del aviso; la entrada del proceso lo imprime por la salida de errores y pone código 1. Solo `libres`, `cancelar` y `anular` leen el fichero; `reservar` y un comando desconocido no lo leen y no fallan por un fichero ilegible. Nadie lo dijo; es lo que mantiene los tests de `run` como hoy.
19. **Excepción a la terminología**: `PRODUCT.md` pide evitar «booking» y «room» en lo que ve el usuario. La capacidad `bookings` (regla de las capacidades: nombre en inglés) y las claves del fichero (`bookings`, `room`) los usan porque son los nombres del código; el usuario nunca los ve en la salida.

### Hallazgos de la review

Técnica:
- **Aceptado** (Crítico) — los escenarios no fijan `SALAS_FICHERO`, así que un test podría tocar la carpeta personal real → cada GIVEN lo fija a una ruta temporal; la ruta por defecto se comprueba solo como cálculo, sin tocar disco (Dónde se prueba).
- **Aceptado** (Crítico) — la atomicidad no la prueba ningún escenario y falta Windows → decisión 6 con nombre y sitio del temporal; requisito «Si no se puede guardar…»; decisión 16.
- **Aceptado** — el primer escenario mezclaba tres cosas → la carpeta ausente tiene su requisito.
- **Aceptado** — `anular` sin escenario; cambio que no cambia nada → requisitos «Una anulación se conserva…» y «Un cambio que no cambia nada no escribe…».
- **Aceptado** — «ilegible» sin definir y canal del aviso → decisión 8 y requisito de forma errónea.
- **Aceptado** — carpeta personal, `SALAS_FICHERO` vacío o relativo → decisiones 3 y 4.
- **Aceptado en parte** — corte entre lectura y escritura → la decisión 10 lo dice como pérdida aceptada; sin escenario, porque lo que no se protege no tiene comportamiento que probar.
- **Aceptado** — transiciones y borrado del fichero → decisión 11.
- **Aceptado** — THEN con puntos medios → THEN con los campos.
- **Aceptado** — `operations.md`, `architecture.md` y dónde vive el código → Scope y decisión 17.

Dominio:
- **Aceptado** — el AND de la carpeta contradice el GIVEN → requisito propio.
- **Aceptado** — `anular` sin escenario → requisito propio.
- **Aceptado** — título e Intent prometen más de lo que hay → el Intent dice qué se conserva y de qué depende lo demás; el título se queda con las palabras del dev-lead.
- **Aceptado** — clave `reservas` frente a «claves en inglés» → la clave pasa a `bookings` (decisión 9).
- **Aceptado** — «ilegible» solo con JSON mal formado → requisito de forma errónea.
- **Aceptado** — THEN con puntos medios (mismo hallazgo) → arreglado.
- **Aceptado** — ADR 0002 mal citada → decisión 13.
- **Aceptado** — crear la carpeta falta en el Scope → Scope.
- **Aceptado** — fallo al guardar sin aviso → decisión 16.
- **Rechazado** — «no existe `PRODUCT.md`» → existe en la raíz del repo; el revisor lo buscó en `steering/`.

Segunda ronda (un revisor, sonnet, sin Críticos; no hay tercera):
- **Aceptado** — «fichero anterior intacto» sin fichero previo en el GIVEN → el requisito parte de un fichero válido y comprueba su contenido y la salida estándar vacía.
- **Aceptado** — temporal compartido entre dos terminales → decisión 6.
- **Aceptado** — ruta por defecto, vacía y relativa sin escenario, y función no mencionada → requisito de ruta y decisión 17.
- **Aceptado** — «ilegible» con casos sin separar y `bookings` vacío → decisión 8 y escenarios separados.
- **Rechazado** — la 0004 vigente rompería el gate durante la implementación → `scripts/lint.mjs` no lee ADR (comprobado, decisión 15); el orden de las ADR sigue siendo el del cierre.
- **Aceptado** — contrato de error de `run` y comandos que no leen el fichero → decisión 18.
- **Aceptado** — Terminología («booking», «room») → decisión 19.
- **Aceptado** — transiciones sobre reservas no activas → requisito propio.
- **Aceptado** — estado de la segunda ronda → este bloque. La política de modelos se queda como línea aparte (decisión 14), que es su sitio en `delegate`.
- **Aceptado** — repaso previo a los documentos → decisión 15.

### Decisiones tomadas con el dev-lead

- Que las reservas sobrevivan a cerrar y volver a abrir la terminal — «que las reservas sobrevivan a cerrar y volver a abrir la terminal»
- Perfil `delegate` para esta feature — «Perfil delegate.»

## Intent

Hoy el programa guarda las reservas solo en memoria: cada arranque empieza con la reserva de partida (Norte, lun, 10:00-12:00), así que cualquier cambio se pierde al terminar el comando (ADR 0004, «Cerrar la terminal pierde las reservas»). Importa porque la herramienta es para llevar las reservas reales del coworking: una cancelación que se olvida deja una sala ocupada que no lo está.

Como `reservar` todavía no crea reservas, lo que se conserva son la de partida y los cambios de estado de las que existan; que sirva para reservas nuevas depende de otra feature.

El éxito es medible: tras `cancelar Norte lun` en un arranque, `libres 10:00-12:00` en otro arranque dice `Norte, Sur`, y `cancelar Norte lun` otra vez dice `sin reserva Norte lun`. Fracasaría, aunque funcionase, si un fichero dañado se sustituyera sin avisar por reservas inventadas, si un guardado fallido dejara el fichero a medias, o si los tests escribieran en la carpeta personal real de quien los ejecuta.

## Scope

- Entra: leer las reservas de un fichero JSON al arrancar y escribirlo tras cada `cancelar` o `anular` que cambie algo; ruta por defecto y `SALAS_FICHERO`; escritura atómica; crear la carpeta del fichero si falta; aviso de fichero ilegible y aviso de no poder guardar, ambos con código de salida 1; arranque sin fichero con la reserva de partida.
- Entra: los tests (`test/app.test.js`, `test/cancel.test.js` y los nuevos) usan `SALAS_FICHERO` apuntando a una carpeta temporal.
- Entra: actualizar `operations.md` (línea «Motor de producción» y la variable `SALAS_FICHERO`), `architecture.md` (ruta del fichero) y, al cierre, la decisión nueva que sustituye a la 0004.
- No entra: crear reservas nuevas (`reservar` sigue como hoy); bloqueo entre dos terminales; migrar formatos; exportar a calendario (fila 0004 de «Later»); validar el formato de franja (deuda «Por triar»).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «El estado vive en un solo proceso» y su consecuencia «Cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0004-single-process-state.md:21,25` | decisión 1: la 0004 queda sustituida por la nueva ADR del cierre |
| Confirmación «`src/` no importa `node:fs` ni ningún paquete de base de datos» | `.docs/sdd/decisions/0004-single-process-state.md:29` | decisión 1: la nueva ADR confirma lo contrario (solo `node:fs`, sin paquetes de base de datos) |
| «sin base de datos; las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | Scope: se reescribe como «fichero JSON local (`SALAS_FICHERO`, por defecto `.salas/reservas.json` en la carpeta personal); sin base de datos» |
| La reserva de partida escrita en el código como estado inicial | `src/app.js:3` | decisión 7: pasa a ser el contenido de partida cuando no hay fichero |
| Tests que dan por hecho el estado en memoria (`libres excluye la sala reservada`, `cancelar`) | `test/app.test.js`, `test/cancel.test.js` | Scope: pasan a usar `SALAS_FICHERO` temporal |

- Filas que implementa: 0012 (reservada con `sdd id next --reserve`, sin fila en `ROADMAP.md`) → nada: comprobado con `git grep -n "0012"`, sin resultados fuera de esta spec.

## Approach

- **A. Fichero JSON escrito entero y atómicamente** — un fichero legible a mano, sin dependencias nuevas; se reescribe entero en cada cambio, lo cual con decenas de reservas es instantáneo. Cuesta decidir la ruta y los avisos (decisiones 3, 8 y 16).
- **B. SQLite (`node:sqlite`)** — consultas y transacciones gratis, pero el módulo es experimental en Node 22, no existe en Node 20 (el `package.json` admite `>=20`) y rompe «sin dependencias» en espíritu: más superficie de la que pide guardar una lista.
- **C. Registro de cambios (se añade una línea por cada cambio y se reproduce al arrancar)** — escribe menos y soporta mejor dos terminales, pero hay que compactar el registro y leerlo entero para saber el estado; es más de lo que hace falta hoy.
- **Elegido: A** — es lo más pequeño que cumple el éxito medible y se puede arreglar a mano si algo sale mal. Frente a B, ninguna dependencia ni versión de Node nueva; frente a C, sin compactación.

Partes del cómo que fija A: el estado vive en memoria durante el comando, como hasta ahora; se carga del fichero al principio de `run` y se guarda al final de cada cambio. La ruta se resuelve en cada llamada (no al importar el módulo) para que los tests puedan cambiarla.

## Dónde se prueba

- Conservar entre arranques: llamando a `run` dos veces con el mismo `SALAS_FICHERO` temporal, como los tests de `cancel.test.js`; un test además arranca `node src/app.js` dos veces como procesos separados, que es el caso real.
- Primer arranque sin fichero y comandos que no escriben: por `run`, comprobando que el fichero no existe.
- Ruta por defecto: se comprueba solo el cálculo (carpeta personal + `.salas/reservas.json`), sin leer ni escribir esa ruta; ningún test corre sin `SALAS_FICHERO`.
- Fallo al guardar: `SALAS_FICHERO` bajo una ruta cuya carpeta no se puede crear (un fichero normal hace de carpeta), arrancando el proceso para ver código y salida de errores.
- Fichero ilegible (JSON roto, vacío, forma errónea) y código de salida 1: arrancando `node src/app.js` como proceso, porque el código de salida solo existe ahí.
- Carpeta que no existe: ruta temporal con subcarpeta nueva, por `run`.
- Los tests existentes: reciben `SALAS_FICHERO` temporal; ninguno toca la carpeta personal real.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: las reservas se guardan en un fichero JSON local — descartadas: SQLite y registro de cambios; sustituye a la 0004.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Las reservas se conservan al cerrar y volver a abrir la terminal

- GIVEN `SALAS_FICHERO` apunta a un `reservas.json` temporal con la reserva `room: Norte, day: lun, slot: 10:00-12:00, status: active`
- WHEN se ejecuta `cancelar Norte lun` y, en un arranque nuevo, `libres 10:00-12:00`
- THEN la primera salida es `cancelada Norte lun` y la segunda es `Norte, Sur`
- AND en otro arranque nuevo, `cancelar Norte lun` responde `sin reserva Norte lun`

#### ADDED — Una anulación se conserva entre arranques

- GIVEN `SALAS_FICHERO` apunta a una ruta temporal sin fichero
- WHEN se ejecuta `anular Norte lun` y, en un arranque nuevo, `libres 10:00-12:00`
- THEN la primera salida es `anulada Norte lun` y la segunda es `Norte, Sur`
- AND el fichero tiene la reserva de Norte con `status: voided`

#### ADDED — Sin fichero de reservas, el arranque parte de la reserva de partida

- GIVEN `SALAS_FICHERO` apunta a una ruta temporal sin fichero
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND el fichero sigue sin existir

#### ADDED — Solo un cambio de reserva escribe el fichero

- GIVEN `SALAS_FICHERO` apunta a una ruta temporal sin fichero
- WHEN se ejecuta `cancelar Norte lun`
- THEN la salida es `cancelada Norte lun`
- AND el fichero existe y su `bookings` tiene una reserva con `room: Norte, day: lun, slot: 10:00-12:00, status: cancelled`

#### ADDED — Un cambio que no cambia nada no escribe el fichero

- GIVEN `SALAS_FICHERO` apunta a una ruta temporal sin fichero
- WHEN se ejecuta `cancelar Sur lun`
- THEN la salida es `sin reserva Sur lun`
- AND el fichero sigue sin existir

#### ADDED — La carpeta del fichero se crea si falta

- GIVEN `SALAS_FICHERO` apunta a `<temporal>/nueva/reservas.json` y la carpeta `nueva` no existe
- WHEN se ejecuta `cancelar Norte lun`
- THEN la salida es `cancelada Norte lun`
- AND existen la carpeta `nueva` y el fichero

#### ADDED — Un fichero de reservas ilegible no se pisa

- GIVEN `SALAS_FICHERO` apunta a un fichero temporal que contiene `{no es json`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN por la salida de errores sale `fichero de reservas ilegible: <la ruta tal como se dio en SALAS_FICHERO>`
- AND el proceso termina con código 1
- AND el contenido del fichero sigue siendo `{no es json`
- AND `cancelar Norte lun` da la misma salida y el mismo código, y tampoco cambia el fichero

#### ADDED — Un fichero con forma errónea cuenta como ilegible

- GIVEN `SALAS_FICHERO` apunta a un fichero temporal cuyo contenido es, en cada caso: `{}` · vacío · `{"bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "perdida"}]}` · `{"bookings": [{"room": "Norte", "day": "lun", "status": "active"}]}` (sin `slot`)
- WHEN se ejecuta `libres 10:00-12:00`
- THEN en cada caso, por la salida de errores sale `fichero de reservas ilegible: <ruta>` y el proceso termina con código 1
- AND el fichero queda como estaba

#### ADDED — Una lista de reservas vacía es un fichero legible

- GIVEN `SALAS_FICHERO` apunta a un fichero temporal que contiene `{"bookings": []}`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida es `Norte, Sur`
- AND el fichero queda como estaba

#### ADDED — Solo una reserva activa se cancela o se anula

- GIVEN `SALAS_FICHERO` apunta a un fichero temporal con la reserva de Norte lun con `status: cancelled`
- WHEN se ejecuta `anular Norte lun` y `cancelar Norte lun`
- THEN las salidas son `sin reserva Norte lun` las dos veces
- AND el fichero queda como estaba

#### ADDED — Si no se puede guardar, el fichero anterior queda intacto

- GIVEN `SALAS_FICHERO` apunta a un `reservas.json` temporal válido con la reserva de Norte lun activa, y su renombrado falla (en su lugar hay una carpeta con ese nombre)
- WHEN se ejecuta `cancelar Norte lun`
- THEN por la salida de errores sale `no se pudo guardar el fichero de reservas: <ruta>` y el proceso termina con código 1
- AND la salida estándar queda vacía
- AND no existe ningún `<ruta>.tmp`

#### ADDED — La ruta del fichero sale de `SALAS_FICHERO` o de la carpeta personal

- GIVEN `SALAS_FICHERO` con `/tmp/x/r.json` · vacía · sin definir · `rel/r.json`
- WHEN se calcula la ruta del fichero
- THEN sale `/tmp/x/r.json` · la carpeta personal + `.salas/reservas.json` · lo mismo · `rel/r.json` resuelta desde el directorio de arranque
- AND el cálculo no lee ni escribe ningún fichero

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: un fichero JSON, `reservas.json` en la carpeta `.salas/` de la carpeta personal, o la ruta que diga `SALAS_FICHERO`
- **Idioma de los nombres**: las claves del fichero (`bookings`, `room`, `day`, `slot`, `status`) y los estados (`active`, `cancelled`, `voided`) en inglés, como el código; los textos al usuario en castellano
- **Límites**: no aplica
- **Avisos** (ambos por la salida de errores, con código 1): `fichero de reservas ilegible: <ruta>` y `no se pudo guardar el fichero de reservas: <ruta>`
- **Regla ante conflicto**: dos terminales a la vez no se protegen; gana la última escritura

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
