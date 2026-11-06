---
id: 20261105-173947-feature-0012-informes
feature: 0012
title: Informes de ocupación de salas
mode: full
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de salas

🦆 Hoy no hay forma de ver cómo se usan las salas. Con `informes` sale en pantalla, en cuatro tablas de texto, cuántas reservas tiene cada sala, cada día y cada franja, y qué salas nadie ha reservado: con Norte reservada el lunes y el martes de 10:00 a 12:00 y Sur el lunes de 14:00 a 16:00, «Ocupación por sala» da `Norte | 2` y `Sur | 1`. Con `--sala Norte` las cuatro tablas cuentan solo esa sala, y sin reservas cada una dice «sin reservas». Por dentro, una función por vista en `src/app.js` y un formateador de tabla común.

Validación: dev-lead — la valida el desarrollador, que es el único usuario del proyecto (`mission.md`): es salida que lee una persona en la terminal y el formato de las tablas se juzga mirándolo.

## Capacidades

- Nuevas: `reporting` — los informes de ocupación de las salas: sus cuatro vistas, la opción `--sala` y los avisos.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reporting`), contrato público (el comando `informes` y el formato de su salida los consume quien usa la herramienta) · tamaño: ~170 líneas en 3 ficheros (`src/app.js`, `test/informes.test.js`, la capacidad)
- Dominio (sonnet): si las reglas de recuento (solo reservas activas, orden por reservas desc y luego alfabético, días de lun a dom) no se contradicen entre las cuatro vistas, y si «sin reservas» con `--sala` en la vista de salas sin reservar es coherente (señal: capacidad nueva)
- Técnica (sonnet): si los THEN con tabla literal se pueden verificar tal cual por `run('informes', …)` con los datos en memoria, y si `--sala` sin valor o con sala desconocida tiene escenario (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las reglas de recuento son coherentes entre vistas

Decisiones mías, porque la entrevista no las fijó:

1. **Qué cuenta como reserva**: solo las de estado `active`; las canceladas y las anuladas no cuentan en ninguna vista — porque una reserva cancelada o anulada ya no ocupa la sala.
2. **«Ocupación» = número de reservas**, sin porcentaje: el producto no define un horario de apertura sobre el que calcular un porcentaje.
3. **Formato de la tabla**: una línea de título, una de cabecera y una por fila; columnas separadas por ` | `, rellenadas con espacios a la derecha hasta la más ancha **salvo la última**, y ninguna línea acaba en espacio; sin líneas de adorno. Un aviso (`sin reservas`, `todas las salas tienen reservas`, `<X> tiene reservas`) sustituye a la cabecera y a las filas: la vista queda en título y una línea. Las vistas van separadas por una línea en blanco y la salida no acaba en salto de línea.
4. **Títulos de las vistas**: «Ocupación por sala», «Ocupación por día», «Franjas más reservadas», «Salas que nadie ha reservado». Cabeceras de columna: `sala`, `día`, `franja`, `reservas`.
5. **Orden**: por sala y por franja, de más a menos reservas y, a igualdad, alfabético; por día, `lun mar mie jue vie sab dom` (sin tildes, como en los datos).
6. **Solo salen filas con reservas** en las tres vistas de recuento (una sala sin reservas no aparece en «Ocupación por sala»: para eso está la cuarta vista), y salen todas, sin tope: «Franjas más reservadas» lista cada franja con reservas, no solo las primeras.
7. **«Sin reservas»** es el texto literal y se decide sobre las reservas activas que quedan tras el filtro: sin ninguna, cada vista imprime su título y debajo `sin reservas`, también la cuarta aunque haya salas. Es mi lectura literal de la frase del dev-lead («sin reservas, cada vista dice «sin reservas»»): que entonces la cuarta no liste las salas es lo que debes validar.
8. **Cuarta vista**: sin `--sala` y con alguna reserva activa, lista las salas sin reservas activas, o dice `todas las salas tienen reservas` si no queda ninguna. Con `--sala <X>` y X con reservas activas, dice `<X> tiene reservas`; con X sin reservas, `sin reservas` (decisión 7).
9. **Sintaxis y errores**: `params` es la lista de argumentos de `run`, p. ej. `['--sala', 'Norte']`, y `run` devuelve una cadena, como hoy. La sala se compara exacta (`norte` no vale). Se recorren los parámetros de izquierda a derecha y el valor que sigue a `--sala` se consume antes de mirar nada más: `--sala` sin valor, con un valor que empieza por `--` (también `--sala --sala`) o con valor vacío → `falta la sala tras --sala`; cualquier otro parámetro, incluido un `--sala` repetido o uno suelto como `Norte`, → `parámetro desconocido: <p>` (el primero). Solo con los parámetros válidos se comprueba la sala → `sala desconocida: <X>`. Con error no sale ninguna vista.
10. **Datos de las pruebas**: `src/app.js` exporta `rooms` y `bookings`, y los tests los dejan como necesiten (`bookings.length = 0` y `push`). Es un contrato nuevo del módulo (se exportan las mismas referencias, mutables y nunca reasignadas; `node --test` entero sigue en verde, constitución 2), necesario porque hoy los datos no se pueden preparar; las salas son las de `rooms` (Norte y Sur).
11. **Capacidad nueva `reporting`** (inglés kebab-case, convención del kit para el nombre de fichero): no existe ninguna capacidad en el proyecto y esto es comportamiento nuevo.
12. **Diseño por secciones (5 tasks)**: no se hizo en turnos; lo que habría preguntado va aquí (decisiones 1 a 10) porque el perfil es `delegate`. Enfoque elegido tras el mensaje de enfoques: una función por vista en `src/app.js` más un formateador de tabla común, descartando un agrupador genérico (la cuarta vista no es un recuento) y un fichero nuevo (el tech-stack dice «un solo fichero de entrada»).
13. **Delta probado en una copia** de `.docs/sdd` con `sdd capability merge`; tras la ronda 1 crea `reporting.md` con 9 requisitos y 5 reglas, sin rechazos; el repo no cambia.
- Política de modelos: dos revisores de la spec en sonnet (dominio y técnica), más una segunda ronda con uno en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Ronda 1 (técnica):
- **Aceptado** — Crítico: los GIVEN «las mismas reservas» no se pueden reconstruir en un test aislado → cada escenario cita los «datos base», definidos una vez con sala, día, franja y estado.
- **Aceptado** — Crítico: no se dice cómo preparan los tests reservas y salas → decisión 10 y Scope: `src/app.js` exporta `rooms` y `bookings`.
- **Aceptado** — Crítico: no se fija la forma de `params` ni el caso `--sala` sin valor o seguido de otra opción → decisión 9 y escenario «Parámetros no válidos».
- **Aceptado** — Importante: padding de la última columna → decisión 3 (sin relleno ni espacios finales) con la tabla de la cuarta vista como ejemplo.
- **Aceptado** — Importante: «sin reservas» y «--sala» sin salida literal → escenarios «Informe completo», «Sin reservas» y «Filtrar por sala» con la salida completa.
- **Aceptado** — Importante: cuarta vista contradictoria con `--sala Sur` sin reservas → decisiones 7 y 8 y escenarios de la cuarta vista en los tres casos.
- **Aceptado** — Importante: empates y orden → escenario «Orden y desempates» con tablas literales.
- **Aceptado** — Importante: contrato de retorno y parámetros desconocidos o repetidos → decisión 9.
- **Aceptado** — Menor: cifra de la copia de la fusión → quitada de la decisión 13.
- **Aceptado** — Menor: qué ve el dev-lead en terminal → «Dónde se prueba»: con los datos de arranque (Norte lun 10:00-12:00) salen tablas con una fila.

Ronda 1 (dominio):
- **Aceptado** — Importante: cuarta vista con «sin reservas» sin dato de salas → GIVEN con salas Norte y Sur y decisión 8.
- **Aceptado** — Importante: la cuarta vista cambia de naturaleza con `--sala` → escenario con Norte sin reservas y Sur con ellas.
- **Aceptado** — Importante: fuente de las salas → regla «Dónde viven los datos» y decisión 10.
- **Aceptado** — Importante: nombres de día → decisión 5 y escenario de orden con `vie` y `lun`.
- **Aceptado** — Menor: criterio de orden sin escenario → «Orden y desempates».
- **Aceptado** — Menor: sin reserva anulada en los datos → los datos base incluyen una anulada.
- **Aceptado** — Menor: el nombre `reporting` → regla de idioma y decisión 11.
- **Aceptado** — Menor: reglas de límite y conflicto «no aplica» → conflicto con valor (decisión 9).
- **Aceptado** — Menor: `libres` sin contexto en «No entra» → quitado.
- **Aceptado** — Menor: justificación de la decisión 1 → reescrita.

Ronda 2 (sonnet, sin Críticos, sin tercera ronda):
- **Aceptado** — Importante: precedencia de `--sala --sala` y casos sin escenario → decisión 9 y escenario «Parámetros no válidos» ampliados.
- **Aceptado** — Importante: el cableado de la CLI y los datos de arranque eran supuestos → citados en Scope y «Dónde se prueba», comprobados en `src/app.js`.
- **Aceptado** — Importante: exportar `rooms` y `bookings` → decisión 10 (mismas referencias, sin reasignar, `node --test` en verde).
- **Aceptado** — Importante: avisos sin cabecera → decisión 3.
- **Aceptado** — Menor: desempate de salas, salida literal del informe completo, «sin tope» en las franjas, frase del dev-lead en la decisión 7, quién valida, y evidencia de la fusión → todos corregidos en su sitio.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy la herramienta reserva, cancela y anula, pero no deja ver cómo se usan las salas: para saber qué sala se llena o qué franja está vacía hay que mirar las reservas una a una. Se quiere un comando `informes` que lo resuma en cuatro vistas y que se pueda acotar a una sala. Es un éxito si, con los datos de las reservas activas, cada vista da los números correctos y legibles en una terminal; fracasa, aunque funcione, si cuenta reservas canceladas o anuladas, o si con datos vacíos imprime una tabla vacía en lugar de «sin reservas».

## Scope

- Entra: el comando `informes` con las cuatro vistas, la opción `--sala <nombre>` que filtra las cuatro, los avisos `sin reservas`, `todas las salas tienen reservas`, `<sala> tiene reservas`, `sala desconocida: <X>`, `falta la sala tras --sala` y `parámetro desconocido: <p>`, la capacidad `reporting`, los tests (`test/informes.test.js`) y exportar `rooms` y `bookings` desde `src/app.js`. Implementa `src/app.js`. El cableado de la línea de comandos ya existe (`console.log(run(command, args))` al final de `src/app.js`) y no cambia.
- No entra: porcentajes de ocupación, rangos de fechas, exportar a fichero, otras salidas que no sean tabla de texto, y cambios al comportamiento de los comandos existentes.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "informes?|0012"` fuera de `specs/`, sin resultados; la 0012 no tiene fila en el roadmap.

## Approach

Una función por vista en `src/app.js` (por sala, por día, por franja, salas sin reservas), cada una sobre la lista de reservas activas, y un formateador de tabla común que pone título, cabecera y filas con las columnas rellenadas. `run('informes', params)` valida los parámetros, lee `--sala`, filtra las reservas activas y junta las cuatro vistas separadas por una línea en blanco. Las tasks siguen ese reparto: 1 por sala (con el comando y el formateador), 2 por día, 3 franjas, 4 salas sin reservar y 5 `--sala` con sus errores.

## Dónde se prueba

- Las cuatro vistas, `--sala` y los avisos: por `run('informes', params)`, como los tests actuales de `cancelar` (`test/cancel.test.js`), en `test/informes.test.js`; cada test deja `bookings` como pide su GIVEN.
- El formato en terminal: lo mira el dev-lead en la validación con `node src/app.js informes`; con los datos de arranque de `src/app.js` (una reserva, Norte lun 10:00-12:00, comprobado en el código) salen tablas con una fila y «Salas que nadie ha reservado» lista Sur.

## Términos y ADR

- Términos resueltos: **Ocupación** — número de reservas activas; **Informe** — una de las cuatro vistas en tabla de texto que da `informes`.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reporting`

> **Datos base** (los que citan los escenarios): salas Norte y Sur; reservas Norte lun 10:00-12:00 `active`, Norte mar 10:00-12:00 `active`, Sur lun 14:00-16:00 `active`, Sur mie 09:00-10:00 `cancelled`, Norte jue 10:00-12:00 `voided`.

#### ADDED — Ocupación por sala

- GIVEN los datos base
- WHEN se ejecuta `informes`
- THEN la vista «Ocupación por sala» sale como
  ```
  Ocupación por sala
  sala  | reservas
  Norte | 2
  Sur   | 1
  ```
- AND las reservas canceladas y anuladas no cuentan

#### ADDED — Ocupación por día de la semana

- GIVEN los datos base
- WHEN se ejecuta `informes`
- THEN la vista «Ocupación por día» sale como
  ```
  Ocupación por día
  día | reservas
  lun | 2
  mar | 1
  ```

#### ADDED — Franjas más reservadas

- GIVEN los datos base
- WHEN se ejecuta `informes`
- THEN la vista «Franjas más reservadas» sale como
  ```
  Franjas más reservadas
  franja      | reservas
  10:00-12:00 | 2
  14:00-16:00 | 1
  ```

#### ADDED — Orden y desempates

- GIVEN reservas activas Sur lun 14:00-16:00, Sur mar 09:00-10:00, Norte vie 10:00-12:00
- WHEN se ejecuta `informes`
- THEN «Ocupación por sala» pone primero la que más reservas tiene aunque sea alfabéticamente posterior: `Sur | 2` y después `Norte | 1`
- AND con una reserva activa en cada sala, «Ocupación por sala» las empata y pone `Norte | 1` antes que `Sur | 1`
- AND «Ocupación por día» va en orden de la semana: `lun | 1`, `mar | 1`, `vie | 1`
- AND «Franjas más reservadas», con las tres franjas empatadas a 1, las ordena alfabéticamente: `09:00-10:00`, `10:00-12:00`, `14:00-16:00`

#### ADDED — Salas que nadie ha reservado

- GIVEN salas Norte y Sur y una única reserva activa, Norte lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN la vista «Salas que nadie ha reservado» sale como
  ```
  Salas que nadie ha reservado
  sala
  Sur
  ```
- AND con los datos base, que tienen reservas activas en las dos salas, la vista dice `todas las salas tienen reservas` bajo su título

#### ADDED — Sin reservas

- GIVEN salas Norte y Sur y ninguna reserva activa
- WHEN se ejecuta `informes`
- THEN la salida es exactamente
  ```
  Ocupación por sala
  sin reservas

  Ocupación por día
  sin reservas

  Franjas más reservadas
  sin reservas

  Salas que nadie ha reservado
  sin reservas
  ```

#### ADDED — Informe completo

- GIVEN los datos base
- WHEN se ejecuta `informes`
- THEN la salida es exactamente, sin salto de línea al final
  ```
  Ocupación por sala
  sala  | reservas
  Norte | 2
  Sur   | 1

  Ocupación por día
  día | reservas
  lun | 2
  mar | 1

  Franjas más reservadas
  franja      | reservas
  10:00-12:00 | 2
  14:00-16:00 | 1

  Salas que nadie ha reservado
  todas las salas tienen reservas
  ```

#### ADDED — Filtrar por sala

- GIVEN los datos base
- WHEN se ejecuta `informes --sala Norte`
- THEN la salida es exactamente
  ```
  Ocupación por sala
  sala  | reservas
  Norte | 2

  Ocupación por día
  día | reservas
  lun | 1
  mar | 1

  Franjas más reservadas
  franja      | reservas
  10:00-12:00 | 2

  Salas que nadie ha reservado
  Norte tiene reservas
  ```
- AND con `informes --sala Sur` y una única reserva activa, Norte lun 10:00-12:00, las cuatro vistas dicen `sin reservas`

#### ADDED — Parámetros no válidos

- GIVEN salas Norte y Sur
- WHEN se ejecuta `informes --sala Este`
- THEN la salida es `sala desconocida: Este` y no sale ninguna vista
- AND `informes --sala norte` da `sala desconocida: norte`
- AND `informes --sala`, `informes --sala --otra` e `informes --sala ""` dan `falta la sala tras --sala`
- AND `informes --sala --sala` da `falta la sala tras --sala`, `informes --sala Este --otra` da `parámetro desconocido: --otra` e `informes Norte` da `parámetro desconocido: Norte`
- AND `informes --semana` da `parámetro desconocido: --semana`, e `informes --sala Norte --sala Sur` da `parámetro desconocido: --sala`

#### Reglas de la capacidad — reporting

- **Dónde viven los datos**: las reservas y las salas, en memoria en `src/app.js` (`bookings` y `rooms`), sin persistencia (`operations.md`).
- **Idioma de los nombres**: castellano en títulos, cabeceras y avisos (constitución, regla 4); el nombre de la capacidad, `reporting`, va en inglés kebab-case por convención del kit.
- **Límites**: ninguno: cada vista lista todas sus filas.
- **Avisos**: `sin reservas`, `todas las salas tienen reservas`, `<sala> tiene reservas`, `sala desconocida: <X>`, `falta la sala tras --sala`, `parámetro desconocido: <p>`.
- **Regla ante conflicto**: un parámetro repetido o desconocido da `parámetro desconocido: <p>`; no se aplica ninguno.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
