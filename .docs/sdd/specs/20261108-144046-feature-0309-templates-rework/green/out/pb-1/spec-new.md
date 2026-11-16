---
id: 20261108-183526-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas
mode: full
profile: delegate
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas

🦆 Hoy no hay forma de ver cómo se usan las salas. Con `informes` sale en la terminal un resumen en cuatro tablas: cuántas reservas tiene cada sala (`Norte | 2`), cuántas cae en cada día de la semana (`lun | 2`), qué franjas se reservan más (`10:00-12:00 | 2`) y qué salas no ha reservado nadie (`Sur`). Con `informes --sala Norte` las cuatro tablas se limitan a esa sala. Sin reservas, cada tabla dice «sin reservas». Por dentro son cuatro funciones puras en `src/app.js` y una que las junta, que `run` llama.

Validación: dev-lead — es salida que lee una persona en la terminal; el formato de las tablas se juzga mirándolo.

## Capacidades

- Nuevas: `reports` — los informes de ocupación de las salas: el comando `informes`, sus cuatro vistas y su filtro `--sala`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`) · tamaño: ~170 líneas en 3 ficheros (`src/app.js`, `test/informes.test.js`, la capacidad al cerrar)
- Dominio (sonnet): si la regla única de «sin reservas» (decisión 4) deja alguna vista con un resultado absurdo, y si «ocupación» como recuento de reservas activas (decisión 2) responde a lo que el dev-lead pidió con «ocupación por sala» (señal: capacidad nueva)
- Técnica (sonnet): si los escenarios del delta se pueden probar con funciones puras sobre `bookings` y `rooms` pasados por parámetro, y si `run('informes', …)` con los datos por defecto basta como costura alta (señal: capacidad nueva)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar el cruce entre el filtro `--sala` y la vista 4, donde la regla de «sin reservas» es más fácil de contradecir

1. **Capacidad nueva `reports`** (slug en inglés, kebab-case) — es un sustantivo del dominio y no cuelga de ningún ticket; ninguna capacidad existente cubre informes.
2. **«Ocupación» es el número de reservas activas**, no un porcentaje ni un tiempo — el producto no define horas disponibles por sala, así que un porcentaje exigiría inventar un horario, y una reserva de 1 hora cuenta igual que una de 8. Cuentan solo las reservas con estado `active`: las canceladas y las anuladas no.
3. **Nombre y forma del comando**: `informes` y `--sala <nombre>`, sin abreviaturas — el dev-lead dijo «un comando informes» y «una opción --sala»; el resto lo escribí yo. `--sala` compara el nombre exacto (`Norte`, no `norte`), como hacen `cancelar` y `anular`.
4. **«Sin reservas» vale para las cuatro vistas con una sola regla**: la vista dice «sin reservas» cuando en su ámbito (todas las salas, o la que da `--sala`) no hay ninguna reserva activa. Es la lectura literal de lo que dijo el dev-lead («sin reservas, cada vista dice «sin reservas»»), y tiene una consecuencia que debes validar: **la vista 4 también dice «sin reservas» cuando no hay ninguna reserva**, en vez de listar todas las salas (que es lo que se esperaría de «salas que nadie ha reservado»); y `informes --sala Sur` con Sur vacía dice «sin reservas» en las cuatro vistas, no «Sur» en la 4. Con `--sala X` válida, la vista 4 solo puede dar «ninguna» o «sin reservas», porque X es la única sala del ámbito. Alternativa si no te gusta: en la vista 4, sin reservas en el ámbito, listar todas las salas del ámbito; cambia los escenarios «Sin reservas» y «Filtrar por una sala sin reservas».
5. **Salida**: cuatro bloques separados por una línea en blanco, en este orden; cada uno empieza con su título (`Ocupación por sala`, `Ocupación por día de la semana`, `Franjas más reservadas`, `Salas sin reservas`) y la línea siguiente es la cabecera de la tabla, sin líneas entre medias (salvo en «sin reservas»: título y esa línea, sin cabecera). Una fila de cabecera y una por dato; las columnas separadas por ` | `; todas las columnas se rellenan con espacios hasta la celda más ancha **menos la última**, que no lleva espacios finales. El texto no termina en salto de línea (lo añade `console.log`). Los títulos, las cabeceras (`sala`, `día`, `franja`, `reservas`) y el relleno son míos.
6. **Vista 1 lista todas las salas del ámbito**, también las que tienen 0, en el orden de `rooms` (Norte, Sur), no por número de reservas — así se ve a la vez la que más y la que menos se usa. Si el ámbito no tiene ninguna reserva activa, dice «sin reservas» (decisión 4). Una reserva de una sala que no está en `rooms` queda sin definir: los datos de hoy no las tienen.
7. **Vista 2 lista solo los días con reservas**, en orden de semana: `lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom` (sin tilde, como el `lun` que ya usan los datos). Un día con otro código queda sin definir: los datos de hoy solo usan `lun`.
8. **Vista 3 lista todas las franjas con reservas**, de más a menos reservada; a igual número, por orden alfabético ascendente del texto de la franja. No pongo tope (nadie dijo «las 3 primeras»).
9. **Vista 4 sin salas que listar** (hay reservas en el ámbito y todas las salas tienen alguna) dice `ninguna` bajo la cabecera.
10. **Errores de `--sala`**: una sala que no existe (`Oeste`, y también `norte` en minúscula) devuelve solo «sala desconocida: <valor>»; `--sala` sin valor, con valor vacío o con un valor que empieza por `--` devuelve solo «falta el nombre de la sala». Si hay dos `--sala`, vale la primera. Cualquier otro argumento (`informes Norte`) se ignora. Un error se imprime como cualquier salida y el proceso termina bien (código 0). Los textos y estas reglas son míos.
11. **Enfoque**: una función exportada `informes(bookings, rooms, params)` valida `--sala`, filtra, llama a las cuatro vistas y junta los bloques; `run('informes', params)` la llama con los datos por defecto. Las cuatro vistas y la de formato también se exportan (ver Approach). Los datos por defecto solo tienen una reserva, y sin pasar los datos por parámetro no se podrían probar los otros escenarios. `cancelar` y `anular` mutan `bookings`; los tests de informes no los usan.
12. **Delta probado en una copia** de `.docs/sdd`: `sdd capability merge` y `sdd capability check` (exit 0) sobre `cp -r .docs/sdd <tmp>`; el repo no se tocó. Resultado tras la review: merge exit 0 (18 requisitos y 5 reglas añadidos) y «Capacidades válidas: 1», sin avisos.
- Política de modelos: dos revisores de la spec en sonnet (ver bloque) y, por haber Críticos aceptados, un revisor de segunda ronda en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (plan de 5 tasks, de una en una) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

- **Aceptado** (Crítico, dominio) decisión 6 contradecía a la 4 con cero reservas → la 6 dice ahora que, sin reservas en el ámbito, la vista 1 dice «sin reservas».
- **Rechazado** (Crítico, dominio ×2 y técnica) la vista 4 dice «sin reservas» donde se esperaba listar las salas → es la lectura literal del dev-lead; no cambio su regla por mi cuenta, pero lo he subido a la decisión 4 con su consecuencia y la alternativa para que lo valide en este gate.
- **Aceptado** (Crítico, técnica) los escenarios no se podían probar por `run` con los datos por defecto → decisión 11 y Approach: función exportada `informes(bookings, rooms, params)`; los escenarios del delta se prueban contra ella.
- **Aceptado** (Importante) «ocupación» no distingue duración → decisión 2 y Términos.
- **Aceptado** (Importante) el desempate de franjas no tenía GIVEN → escenario propio, con orden alfabético del texto.
- **Aceptado** (Importante) canceladas y anuladas no se distinguían de activas en una misma sala/día/franja → el escenario las pone en la misma que una activa.
- **Aceptado** (Importante) faltaban escenarios para la vista 1 con 0, el orden de semana y los bordes de `--sala` → escenarios nuevos y decisión 10.
- **Aceptado** (Importante) relleno de la última columna y salida completa sin fijar → decisión 5 y escenario de salida completa literal.
- **Aceptado** (Menor) `ninguna` sin escenario propio, «Límites» sin motivo, aislamiento de tests y argumentos desconocidos → escenario propio, «Límites: sin tope de filas», decisión 11 y decisión 10.
- **Aceptado** (Importante) «días fuera de lista van al final» sin escenario ni orden → quitado de la decisión 7 (queda sin definir).

- **Aceptado** (segunda ronda, Importante) «sin reservas» contra la cabecera, salida completa no literal, `--sala` repetido, regla ante conflicto, GIVEN sin salas, reserva de sala ajena a `rooms`, cita de `run`, efecto de `--sala` en la vista 4 → decisiones 4, 5, 6 y 10, escenarios y Scope corregidos; el orden de las salas tiene escenario propio.
- **Rechazado** (segunda ronda, Menor) «dev-lead» y «el autor que usa el producto» como roles distintos → en este proyecto es la misma persona; «dev-lead» es el nombre del rol en el kit y en tus frases literales.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Una opción `--sala` que filtra las cuatro vistas — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy el dev-lead no puede saber cómo se usan las salas sin leer las reservas una a una. Quiere un resumen que responda cuatro preguntas: qué sala tiene más reservas, qué día cae más trabajo, a qué hora se reserva más y qué sala nadie reserva. «Más usada» aquí es «más reservas», no «más horas». Es éxito si cada una sale en una tabla que se lee de un vistazo en la terminal y si `--sala` deja ver lo mismo para una sola sala. Fracasa, aunque funcione, si contando reservas canceladas o anuladas se llegara a una conclusión equivocada, o si sin reservas el comando mostrara tablas vacías en vez de decirlo.

## Scope

- Entra: el comando `informes` con las vistas 1 a 4; la opción `--sala <nombre>` y sus dos respuestas de error; la función `informes(bookings, rooms, params)` que valida, filtra y junta; los tests de las cuatro vistas, del filtro, de «sin reservas» y de la salida completa.
- No entra: otros formatos de salida (CSV, JSON); filtros por día o franja; porcentajes de ocupación ni horas; rangos de fechas (las reservas no guardan fecha, solo día de la semana); mostrar quién reservó; días con un código distinto de `lun`…`dom`; reservas de una sala que no está en `rooms`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma: `run` conserva su respuesta por defecto (`salas`) y los comandos actuales | `src/app.js:27-33` (`run`) | Scope: solo se añade una rama `informes` |

- Filas que implementa: nada: comprobado con `git grep -niE "informes|0012" -- . ':!.docs/sdd/specs'` (sin resultados fuera de esta carpeta).

## Approach

- Funciones puras por vista en `src/app.js` (`occupancyByRoom`, `occupancyByDay`, `busiestSlots`, `unbookedRooms`), cada una con `bookings` y `rooms` por parámetro, más una que da formato a la tabla y `informes(bookings, rooms, params)` que valida `--sala`, filtra y junta los cuatro bloques — son funciones pequeñas en el único fichero de entrada, como `freeRooms` y `cancelBooking`; se prueban solas con los datos que cada escenario necesita.
- Un módulo nuevo `src/informes.js` con las vistas — separa el código de informes, pero `tech-stack.md` fija un solo fichero de entrada y el resto de comandos viven en `app.js`: dos sitios para el mismo tipo de cosa.
- Una sola función que agrupa por un campo (`room`, `day`, `slot`) y que sirve a las vistas 1 a 3 — menos código, pero la vista 2 necesita el orden de la semana y la vista 3 el orden por recuento: acaba con tres parámetros de ordenación y es más difícil de leer que tres funciones de tres líneas.
- Elegido: las funciones puras por vista en `src/app.js` — encaja con el estilo del proyecto y permite una task por vista, como pidió el dev-lead.

`informes` valida `--sala` primero (errores de la decisión 10), filtra `bookings` y `rooms` al ámbito una sola vez, y llama a las cuatro vistas con eso: ninguna vista sabe de `--sala`. «Sin reservas» lo decide cada vista con la misma comprobación: no hay reservas activas en el ámbito. `informes` se construye por tasks: la Task 1 la crea con la vista 1, cada task siguiente añade su vista y la última, el filtro `--sala`.

## Dónde se prueba

- Las cuatro vistas, «sin reservas», la salida completa, el filtro y los errores de `--sala`: contra `informes(bookings, rooms, params)` y las vistas con `bookings` y `rooms` de fixture, en el fichero nuevo `test/informes.test.js` (mismo patrón `node:test` que `test/app.test.js`).
- Que `run('informes', [])` llama a `informes` con los datos por defecto (Norte lun 10:00-12:00 activa): por `run`, en el mismo fichero, sin usar `cancelar` ni `anular` (`node --test` ejecuta cada fichero en su propio proceso).
- El formato de la tabla se juzga además mirándolo en la validación: `node src/app.js informes`.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas activas (no porcentaje ni tiempo). Evitar «uso» como sinónimo en la salida.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN las salas Norte y Sur y las reservas activas Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN se ejecuta `informes`
- THEN el primer bloque es "Ocupación por sala", cabecera "sala  | reservas", fila "Norte | 2" y fila "Sur   | 1"

#### ADDED — Las salas salen en el orden de las salas

- GIVEN las salas Norte y Sur y las reservas activas Sur lun 10:00-12:00, Sur mar 10:00-12:00 y Norte lun 14:00-16:00
- WHEN se ejecuta `informes`
- THEN el primer bloque tiene, en este orden, las filas "Norte | 1" y "Sur   | 2"

#### ADDED — Una sala sin reservas sale con 0

- GIVEN las salas Norte y Sur y la única reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN el primer bloque es "Ocupación por sala", cabecera "sala  | reservas", fila "Norte | 1" y fila "Sur   | 0"

#### ADDED — Las reservas canceladas y anuladas no cuentan

- GIVEN las salas Norte y Sur y, en Norte lun 10:00-12:00, una reserva activa, otra cancelada y otra anulada
- WHEN se ejecuta `informes`
- THEN el primer bloque tiene la fila "Norte | 1", el segundo la fila "lun | 1" y el tercero la fila "10:00-12:00 | 1"

#### ADDED — Ocupación por día de la semana

- GIVEN las reservas activas Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN se ejecuta `informes`
- THEN el segundo bloque es "Ocupación por día de la semana", cabecera "día | reservas", fila "lun | 2" y fila "mar | 1"

#### ADDED — Los días salen en orden de semana y solo los que tienen reservas

- GIVEN las reservas activas Norte vie 10:00-12:00, Norte lun 10:00-12:00 y Sur sab 10:00-12:00
- WHEN se ejecuta `informes`
- THEN el segundo bloque tiene, en este orden, las filas "lun | 1", "vie | 1" y "sab | 1", y ninguna otra

#### ADDED — Franjas más reservadas

- GIVEN las reservas activas Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN se ejecuta `informes`
- THEN el tercer bloque es "Franjas más reservadas", cabecera "franja      | reservas", fila "10:00-12:00 | 2" y fila "14:00-16:00 | 1"

#### ADDED — Franjas con el mismo número de reservas

- GIVEN las reservas activas Norte lun 14:00-16:00 y Sur mar 09:00-10:00
- WHEN se ejecuta `informes`
- THEN el tercer bloque tiene, en este orden, las filas "09:00-10:00 | 1" y "14:00-16:00 | 1"

#### ADDED — Salas que nadie ha reservado

- GIVEN las salas Norte y Sur y la única reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN el cuarto bloque es "Salas sin reservas", cabecera "sala" y fila "Sur"

#### ADDED — Todas las salas tienen alguna reserva

- GIVEN las salas Norte y Sur y las reservas activas Norte lun 10:00-12:00 y Sur lun 14:00-16:00
- WHEN se ejecuta `informes`
- THEN el cuarto bloque es "Salas sin reservas", cabecera "sala" y fila "ninguna"

#### ADDED — Sin reservas

- GIVEN las salas Norte y Sur y ninguna reserva activa (no hay ninguna, o todas están canceladas o anuladas)
- WHEN se ejecuta `informes`
- THEN cada uno de los cuatro bloques es su título seguido de la línea "sin reservas"

#### ADDED — Salida completa

- GIVEN las salas Norte y Sur y la única reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN la salida son estas 16 líneas, sin espacios finales ni salto de línea al final: "Ocupación por sala", "sala  | reservas", "Norte | 1", "Sur   | 0", "", "Ocupación por día de la semana", "día | reservas", "lun | 1", "", "Franjas más reservadas", "franja      | reservas", "10:00-12:00 | 1", "", "Salas sin reservas", "sala", "Sur"

#### ADDED — Filtrar por sala

- GIVEN las reservas activas Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00
- WHEN se ejecuta `informes --sala Norte`
- THEN el primer bloque lista solo la fila "Norte | 2", el segundo "lun | 1" y "mar | 1", el tercero "10:00-12:00 | 2", y el cuarto "ninguna"

#### ADDED — Filtrar por una sala sin reservas

- GIVEN las salas Norte y Sur, la única reserva activa Norte lun 10:00-12:00, y que Sur no tiene ninguna activa
- WHEN se ejecuta `informes --sala Sur`
- THEN los cuatro bloques son su título seguido de la línea "sin reservas"

#### ADDED — Sala desconocida

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `informes --sala Oeste`, o `informes --sala norte`
- THEN la salida es solo "sala desconocida: Oeste", o "sala desconocida: norte"

#### ADDED — Falta el nombre de la sala

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `informes --sala`, o `informes --sala ""`, o `informes --sala --otra`
- THEN la salida es solo "falta el nombre de la sala"

#### ADDED — Con dos --sala vale la primera

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `informes --sala Norte --sala Oeste`, o `informes --sala Oeste --sala Norte`
- THEN la primera da lo mismo que `informes --sala Norte`, y la segunda solo "sala desconocida: Oeste"

#### ADDED — Otros argumentos se ignoran

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `informes Norte`
- THEN la salida es la misma que la de `informes` sin argumentos

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: en memoria, en `bookings` y `rooms` de `src/app.js`; los informes solo leen, nunca escriben
- **Idioma de los nombres**: castellano (títulos, cabeceras y avisos), según el artículo 4 de la constitución; el comando y la opción, `informes` y `--sala`
- **Límites**: sin tope de filas en ninguna vista
- **Avisos**: `sin reservas` · `ninguna` · `sala desconocida: <valor>` · `falta el nombre de la sala`
- **Regla ante conflicto**: con dos `--sala` vale la primera; cualquier otro argumento se ignora

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
