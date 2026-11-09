---
id: 20261109-085259-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas de ocupación
mode: full
status: draft
created: 2026-11-09
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas de ocupación

🦆 Con `informes` ves, en una sola salida, cómo se usan las salas. Con la reserva actual (Norte, lunes, 10:00-12:00) sale «Norte 1» en ocupación por sala, «lun 1» por día, «10:00-12:00 1» en franjas y «Sur» en salas sin reservas. `informes --sala Norte` hace lo mismo pero solo con esa sala. Si no hay ninguna reserva, las cuatro vistas dicen «sin reservas». Por dentro es una función pura en `src/app.js` que recibe las reservas y las salas, y por eso se prueba con datos inventados sin tocar nada más.

Validación: dev-lead — la salida la lee una persona y el formato de la tabla es parte de lo que se aprueba.

## Capacidades

- Nuevas: `booking-reports` — informes de ocupación de las salas a partir de las reservas activas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-reports`) · tamaño: ~130 líneas en 2 ficheros (`src/app.js`, `test/informes.test.js`)
- Dominio (sonnet): si contar solo reservas activas (decisión 3) y el «sin reservas» común con `--sala` (decisión 8) dicen lo que pidió el dev-lead y lo que `PRODUCT.md` llama reserva (señal: capacidad nueva)
- Técnica (sonnet): si una función pura exportada desde el único `src/app.js` se prueba con datos propios y si los THEN de formato (anchos, orden, espacios finales) se pueden comprobar al carácter (señal: capacidad nueva)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin cubrir la doble mirada sobre el formato literal de la tabla y sobre los bordes de `--sala`

1. Enfoque: función pura `informes(reservas, salas, { sala })` en `src/app.js`, frente a calcular dentro de `run` (no se prueba con datos) o crear `src/informes.js` (rompe «un solo fichero de entrada») — ver Approach.
2. Capacidad nueva `booking-reports` (slug en inglés, kebab-case) — el comportamiento de los informes no pertenece a ninguna capacidad, porque el proyecto no tiene ninguna.
3. Solo cuentan las reservas con `status: 'active'`; las de `cancelled` y `voided` no ocupan la sala — son las que `libres` (`freeRooms`) ya trata como libres, y los estados salen de `cancelBooking` y `voidBooking`; lo leí en `src/app.js`, la Task 1 lo vuelve a comprobar.
4. «Ocupación» = número de reservas activas. No hay porcentajes ni horas, porque las franjas no tienen duración fija.
5. Orden: salas y franjas por número de reservas, de más a menos, y a igual número por su texto, de menor a mayor con la comparación simple de cadenas (`a < b`, no `localeCompare`: `10:00-12:00` va antes que `9:00-11:00`, y `Norte` antes que `Sur`). Los días **no** van por número: van en orden de semana (`lun`, `mar`, `mié`, `jue`, `vie`, `sáb`, `dom`, escritos así y en minúscula); un valor que no sea uno de esos (`Lun`, `xyz`) va después, ordenado por su texto con `<`.
6. Formato de cada vista: una línea de título, una cabecera, una fila por elemento; todas las columnas alineadas a la izquierda, separadas por dos espacios, con el ancho en caracteres (`String.length`) de la celda más larga de la columna (cabecera incluida), y sin espacios al final de la línea. Las cuatro vistas van en el orden del encargo, con exactamente una línea en blanco entre ellas, y el texto devuelto no acaba en salto de línea (el que ya imprime `console.log` es el único). Títulos, cabeceras y días van en la forma compuesta (NFC), como se escriben en el fichero. Títulos y cabeceras literales: «Ocupación por sala» (`sala`, `reservas`), «Ocupación por día» (`día`, `reservas`), «Franjas más reservadas» (`franja`, `reservas`), «Salas sin reservas» (`sala`).
7. Cada vista solo lista lo que tiene reservas (salas, días, franjas); sin tope de filas en «Franjas más reservadas».
8. Con cero reservas activas de salas que existen en el alcance (todo, o la sala de `--sala`), las cuatro vistas llevan su título y debajo `sin reservas`, también «Salas sin reservas», aunque entonces todas las salas lo estén. Con reservas, si ninguna sala queda sin ellas, «Salas sin reservas» pone `ninguna` bajo el título, sin cabecera: esa palabra no la dijo el dev-lead, es mía.
9. `--sala`: la forma es `informes --sala Norte`; el nombre se compara tal cual (`norte` no vale). Una sala que no existe da `sala desconocida: Este`. `--sala` sin nombre —último parámetro, vacío, o seguido de otro que empiece por `--`— da `falta la sala tras --sala`. En ambos casos no sale ninguna vista. Con `--sala X`, «Salas sin reservas» solo considera X. Cualquier otro parámetro se ignora, y con `--sala` repetido manda el primero.
10. Datos: el estado de una reserva es uno de `active`, `cancelled` o `voided` (los de `src/app.js`); una reserva de una sala que no está en `rooms` se ignora en las cuatro vistas.
11. `run('informes', params)` devuelve el texto y `src/app.js` lo imprime con `console.log` como con los demás comandos; los avisos de error salen igual, y el código de salida del proceso no cambia (0).
12. Validación `dev-lead`; se prueba con la función pura y, para el cableado, con `run('informes', [...])` y los datos de siempre.
13. Delta probado en una copia de `.docs/sdd` en una carpeta temporal: `sdd capability merge` añade 18 requisitos y 5 reglas a `booking-reports.md` (rc 0) y `capability check` da «Capacidades válidas: 1» (rc 0), tras integrar la review. `capabilities/` del repo no cambia hasta el cierre.
- Política de modelos: revisores de la spec dos en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Dominio:

- **Aceptado** — «Límites» decía «no aplica» pero hay límites (sin tope de filas, nombre de sala exacto, días de la lista) → reescrita con esos tres valores.
- **Aceptado** — «Regla ante conflicto» decía «no aplica» con desempates definidos → reescrita con el desempate, el orden de los días desconocidos y el `--sala` repetido, y un requisito para cada caso.
- **Aceptado** — un día fuera de la lista no tenía THEN y la decisión 5 parecía contradecir el «de más a menos» → requisito «Días fuera de la lista»; la decisión 5 dice que los días nunca van por número.
- **Aceptado** — `--sala` de una sala que existe y sin reservas, y X con reservas con otras salas sin ellas, sin THEN propio → requisitos «`--sala` sin reservas activas» y «Filtrar con `--sala`» (cuya salida entera acaba en `ninguna`).
- **Aceptado** — una sola reserva inactiva como ejemplo (cancelada) → el GIVEN de «Sin reservas» y el de «Informes de ocupación» llevan una cancelada y una anulada.
- **Aceptado** — la cuenta «8 requisitos y 5 reglas» no se había contrastado → recalculada con el merge real: 18 requisitos y 5 reglas tras la segunda ronda (decisión 13).
- **Aceptado** — `ninguna` no la pidió el dev-lead → la decisión 8 lo dice.
- **Aceptado** — el ancho no decía si era en caracteres → decisión 6: caracteres (`String.length`), y un requisito con cuentas de dos cifras.
- **Aceptado** — el origen de las salas no estaba dicho → «Dónde viven los datos» nombra `rooms` y la firma lleva `salas`.
- **Sin cambio** — el punto 1 no aplica (no hay capacidades, solo `ADDED`) y los ejemplos son inventados.

Técnica:

- **Aceptado (Crítico)** — «Filtrar con `--sala`» daba literales sueltos → el THEN pone las cuatro tablas completas.
- **Aceptado (Crítico)** — «Informes de ocupación» no mostraba la salida entera ni el salto final → bloque con la salida completa; decisión 6 fija la línea en blanco entre vistas y que no acaba en salto de línea.
- **Aceptado** — alineación y anchos de la última columna → decisión 6: izquierda, en caracteres, cabecera incluida; requisito «Anchos de columna» con `10`.
- **Aceptado** — `<` o `localeCompare` → decisión 5: `<`; requisito «Desempate de salas y franjas» con `9:00-11:00` y `10:00-12:00`.
- **Aceptado** — días fuera de la lista y mayúsculas → requisito «Días fuera de la lista» con `Lun`, `abc`, `xyz`.
- **Aceptado** — `--sala --otra`, parámetros sueltos y `--sala` repetido → decisión 9 y requisitos «`--sala` sin nombre» y «Parámetros sobrantes o repetidos».
- **Aceptado** — firma sin fijar → `informes(reservas, salas, { sala })`.
- **Aceptado** — valores de `status` y reservas de salas desconocidas → decisión 10 y requisito «Reserva de una sala que no existe».
- **Aceptado** — AND que mezclaban casos → cada caso tiene su requisito, con su GIVEN completo.
- **Aceptado** — `run` devuelve o imprime, y código de salida → decisión 11.

Segunda ronda (un revisor, sonnet; sin Críticos, no hay tercera):

- **Aceptado** — el cableado y el código de salida no tenían escenario → requisito «Cableado de `informes`» con la salida literal de la semilla.
- **Aceptado** — «Reserva de una sala que no existe» solo comprobaba una vista → remite a la salida entera de «Cableado de `informes`».
- **Aceptado** — reservas solo de una sala desconocida sin escenario → decisión 8 («de salas que existen») y requisito «Solo reservas de una sala que no existe».
- **Aceptado** — el ancho no se veía en el escenario de dos cifras → renombrado «Cuentas de dos cifras», que solo promete la alineación; el ancho de la primera columna ya se ve en las otras salidas.
- **Aceptado** — «Desempate» en prosa → bloques literales de las dos vistas.
- **Aceptado** — «`--sala` sin reservas activas» remitía a otro bloque → dice «exactamente la de «Sin reservas»».
- **Aceptado** — `--sala --sala Norte` y `--sala ""` → decisión 9 y requisito «`--sala` sin nombre».
- **Aceptado** — afirmación sobre `libres` sin comprobar → decisión 3 cita `freeRooms`, `cancelBooking` y `voidBooking`, y la Task 1 lo comprueba.
- **Aceptado** — nueva exportación y NFC → Scope y decisión 6.
- **Aceptado en parte** — el gate no estaba en «Dónde se prueba» → añadido; la rama `feature/0012-informes` ya lleva el id, como pide `nombrado.md`, y no se cambia.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Una opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `salas` no deja ver cómo se usan las salas: solo `libres` dice qué sala está libre en una franja. Quien administra el coworking quiere ver de un vistazo qué salas se usan más, qué días y franjas se llenan y qué salas nadie reserva. El éxito es que `informes` conteste esas cuatro preguntas en una salida legible y que `--sala` la reduzca a una sala. Sería un fracaso que contara como ocupadas las reservas canceladas o anuladas, o que con la lista vacía imprimiera tablas sin filas.

## Scope

- Entra: el comando `informes` con las cuatro vistas y `--sala <nombre>`, la función pura que las calcula (una exportación nueva de `src/app.js`) y sus tests.
- No entra: guardar reservas nuevas (`reservar` sigue siendo el mensaje fijo), porcentajes de ocupación, filtros por día o franja, otros formatos (CSV, JSON), cambios en `libres`, `cancelar` o `anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "informes?"` fuera de `.docs/sdd/specs/`: sin resultados | solo `ADDED` en el delta |

- Filas que implementa: nada: comprobado con `git grep -niE "informes?|0012" -- . ':!.docs/sdd/specs'`, sin resultados (la 0012 no tiene fila en `roadmap.md`).

## Approach

- A — función pura `informes(reservas, salas, { sala })` exportada desde `src/app.js`; `run` solo la conecta con el comando. Cuesta unas 50 líneas en un fichero que ya tiene 35, y se prueba con datos propios.
- B — calcular dentro de `run` con el arreglo `bookings` del módulo. Cuesta menos código, pero solo hay una reserva de semilla y `reservar` no añade ninguna: no se puede probar nada más que el caso trivial.
- C — un fichero nuevo `src/informes.js`. Se prueba igual que A, pero `tech-stack.md` fija «un solo fichero de entrada: `src/app.js`».
- Elegido: A — es la única vía que se prueba con varias reservas sin romper la regla del fichero único.

Partes del cómo que fija A:

- `informes(reservas, salas, { sala })` devuelve el texto completo (cuatro vistas, o el aviso de sala desconocida o sin nombre). `run('informes', params)` extrae `--sala` de `params` según la decisión 9 y le pasa `bookings` y `rooms`.
- Cada vista cuenta las reservas con `status === 'active'` del alcance y una función de tabla común aplica el formato de la decisión 6.

## Dónde se prueba

- Las cuatro vistas, el orden, los empates y el formato: con `informes(reservas, salas, …)` desde `test/informes.test.js`, con reservas inventadas y las salas Norte y Sur.
- El filtro `--sala`, la sala desconocida, la falta de nombre y los parámetros sobrantes: con la misma función (y con `run('informes', ['--sala', 'Norte'])` para el análisis de `params`).
- El cableado del comando: `run('informes', [])` con la reserva de semilla (Norte, lun, 10:00-12:00), como `test/app.test.js`.
- «Sin reservas»: con `informes([], …)`.
- Cierre: `node --test && node scripts/lint.mjs` entero en verde (gate de `operations.md`).

## Términos y ADR

- Términos resueltos: Ocupación — número de reservas activas de una sala, un día o una franja.
- ADR candidatas: ninguna

## Delta de comportamiento

> Datos de los escenarios, salvo que se diga otra cosa — el «conjunto D»: reservas activas Norte lun 10:00-12:00, Norte lun 14:00-16:00 y Sur mar 10:00-12:00; una Norte mié 10:00-12:00 con estado `cancelled` y una Sur vie 09:00-10:00 con estado `voided`; salas Norte y Sur.

### Capacidad: `booking-reports`

#### ADDED — Informes de ocupación

- GIVEN el conjunto D
- WHEN se ejecuta `informes`
- THEN la salida es exactamente esto (sin salto de línea al final):
  ```text
  Ocupación por sala
  sala   reservas
  Norte  2
  Sur    1

  Ocupación por día
  día  reservas
  lun  2
  mar  1

  Franjas más reservadas
  franja       reservas
  10:00-12:00  2
  14:00-16:00  1

  Salas sin reservas
  ninguna
  ```

#### ADDED — Ocupación por sala

- GIVEN las reservas activas Norte lun 10:00-12:00, Norte lun 14:00-16:00 y Sur mar 10:00-12:00
- WHEN se ejecuta `informes`
- THEN «Ocupación por sala» es:
  ```text
  Ocupación por sala
  sala   reservas
  Norte  2
  Sur    1
  ```

#### ADDED — Ocupación por día de la semana

- GIVEN las reservas activas Sur dom 10:00-12:00, Norte mié 10:00-12:00, Norte mié 14:00-16:00 y Sur lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN «Ocupación por día» es, en orden de semana y no por número de reservas:
  ```text
  Ocupación por día
  día  reservas
  lun  1
  mié  2
  dom  1
  ```

#### ADDED — Días fuera de la lista

- GIVEN las reservas activas Norte xyz 10:00-12:00, Norte mié 10:00-12:00, Sur Lun 10:00-12:00 y Sur abc 10:00-12:00
- WHEN se ejecuta `informes`
- THEN «Ocupación por día» es:
  ```text
  Ocupación por día
  día  reservas
  mié  1
  Lun  1
  abc  1
  xyz  1
  ```
  porque `Lun` no es `lun` y los valores desconocidos van después de los conocidos, ordenados con `<`

#### ADDED — Franjas más reservadas

- GIVEN las reservas activas Norte lun 10:00-12:00, Sur mar 10:00-12:00 y Norte lun 14:00-16:00
- WHEN se ejecuta `informes`
- THEN «Franjas más reservadas» es:
  ```text
  Franjas más reservadas
  franja       reservas
  10:00-12:00  2
  14:00-16:00  1
  ```

#### ADDED — Desempate de salas y franjas

- GIVEN las reservas activas Sur lun 9:00-11:00 y Norte mar 10:00-12:00
- WHEN se ejecuta `informes`
- THEN «Ocupación por sala» y «Franjas más reservadas» son, porque a igual número va primero el texto menor con `<` y `1` es menor que `9`:
  ```text
  Ocupación por sala
  sala   reservas
  Norte  1
  Sur    1

  Franjas más reservadas
  franja       reservas
  10:00-12:00  1
  9:00-11:00   1
  ```
  (en la salida real van con las otras dos vistas, separadas por una línea en blanco)

#### ADDED — Salas sin reservas

- GIVEN la única reserva activa Norte lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN «Salas sin reservas» es:
  ```text
  Salas sin reservas
  sala
  Sur
  ```

#### ADDED — Sin reservas

- GIVEN solo una Norte lun 10:00-12:00 con estado `cancelled` y una Sur mar 10:00-12:00 con estado `voided`
- WHEN se ejecuta `informes`
- THEN la salida es exactamente esto:
  ```text
  Ocupación por sala
  sin reservas

  Ocupación por día
  sin reservas

  Franjas más reservadas
  sin reservas

  Salas sin reservas
  sin reservas
  ```

#### ADDED — Cuentas de dos cifras

- GIVEN diez reservas activas de Norte y dos de Sur, todas en lun 10:00-12:00
- WHEN se ejecuta `informes`
- THEN «Ocupación por sala» es:
  ```text
  Ocupación por sala
  sala   reservas
  Norte  10
  Sur    2
  ```
  con la cuenta alineada a la izquierda y sin espacios al final de ninguna línea

#### ADDED — Cableado de `informes`

- GIVEN la reserva de semilla de `src/app.js` (Norte lun 10:00-12:00, activa) y las salas Norte y Sur
- WHEN se ejecuta `run('informes', [])`
- THEN devuelve exactamente esto (el proceso lo imprime con `console.log` y sale con código 0):
  ```text
  Ocupación por sala
  sala   reservas
  Norte  1

  Ocupación por día
  día  reservas
  lun  1

  Franjas más reservadas
  franja       reservas
  10:00-12:00  1

  Salas sin reservas
  sala
  Sur
  ```

#### ADDED — Avisos de `informes` con código de salida 0

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `run('informes', ['--sala', 'Este'])`
- THEN devuelve `sala desconocida: Este` y el proceso sale con código 0, como con los demás comandos

#### ADDED — Reserva de una sala que no existe

- GIVEN la reserva activa Norte lun 10:00-12:00 y otra activa Este mar 14:00-16:00, con las salas Norte y Sur
- WHEN se ejecuta `informes`
- THEN la salida es exactamente la de «Cableado de `informes`»: la de Este no cuenta en ninguna de las cuatro vistas

#### ADDED — Solo reservas de una sala que no existe

- GIVEN la única reserva activa Este mar 14:00-16:00, con las salas Norte y Sur
- WHEN se ejecuta `informes`
- THEN la salida es exactamente la de «Sin reservas», porque la de Este se ignora y no queda ninguna

#### ADDED — Filtrar con `--sala`

- GIVEN el conjunto D
- WHEN se ejecuta `informes --sala Norte`
- THEN la salida es exactamente esto (sin salto de línea al final):
  ```text
  Ocupación por sala
  sala   reservas
  Norte  2

  Ocupación por día
  día  reservas
  lun  2

  Franjas más reservadas
  franja       reservas
  10:00-12:00  1
  14:00-16:00  1

  Salas sin reservas
  ninguna
  ```

#### ADDED — `--sala` sin reservas activas

- GIVEN el conjunto D con la reserva de Sur mar 10:00-12:00 pasada a `cancelled`
- WHEN se ejecuta `informes --sala Sur`
- THEN la salida es exactamente la de «Sin reservas»: las cuatro vistas con su título y `sin reservas` debajo

#### ADDED — `--sala` desconocida

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `informes --sala Este`
- THEN la salida es solo `sala desconocida: Este`, sin ninguna vista
- AND `informes --sala norte` da solo `sala desconocida: norte`

#### ADDED — `--sala` sin nombre

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `informes --sala`
- THEN la salida es solo `falta la sala tras --sala`
- AND `informes --sala --otra`, `informes --sala --sala Norte` e `informes --sala ""` dan solo `falta la sala tras --sala`

#### ADDED — Parámetros sobrantes o repetidos

- GIVEN el conjunto D
- WHEN se ejecuta `informes foo` o `informes --sala Norte --sala Sur`
- THEN `informes foo` da la misma salida que `informes`, y `informes --sala Norte --sala Sur` da la misma que `informes --sala Norte`

#### Reglas de la capacidad — booking-reports

- **Dónde viven los datos**: memoria; los informes leen las reservas (`bookings`) y las salas (`rooms`) del módulo y no guardan nada
- **Idioma de los nombres**: castellano en títulos, cabeceras y avisos; el comando y la opción son `informes` y `--sala`
- **Límites**: sin tope de filas en ninguna vista; el nombre de sala se compara tal cual; los días conocidos son `lun`, `mar`, `mié`, `jue`, `vie`, `sáb` y `dom`
- **Avisos**: `sin reservas`, `ninguna`, `sala desconocida: <nombre>` y `falta la sala tras --sala`
- **Regla ante conflicto**: a igual número de reservas, salas y franjas van por su texto con `<`; los días van en orden de semana y los desconocidos después, por su texto; con `--sala` repetido manda el primero

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
