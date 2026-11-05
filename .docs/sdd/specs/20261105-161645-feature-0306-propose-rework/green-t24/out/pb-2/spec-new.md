---
id: 20261105-172809-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas y filtro --sala
mode: full
profile: delegate
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas y filtro --sala

🦆 Hasta ahora no hay forma de ver cómo se usan las salas. Con `informes` sacas cuatro tablas de texto: reservas por sala (`Norte  2`), por día de la semana (`lun  1`), las franjas más reservadas (`10:00-12:00  2`) y las salas que nadie ha reservado (`Sur`). Con `informes --sala Norte`, las tres primeras cuentan solo las reservas de Norte, y la cuarta dice si Norte está libre (`ninguna` si tiene reservas). Si no hay ninguna reserva, cada tabla dice «sin reservas». Por dentro, cada tabla es una función que cuenta las reservas activas, y `--sala` filtra la lista antes de contar.

Validación: dev-lead — es salida de terminal que lee una persona y el formato de las tablas se juzga mirándolo.

## Capacidades

- Nuevas: `reports` — qué enseña cada una de las cuatro vistas de `informes`, el filtro `--sala` y los avisos de vacío.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`) · tamaño: ~100 líneas en 3 ficheros
- Dominio (sonnet): si lo que cuenta cada vista (reservas activas) y el caso «sin reservas» de la vista 4 con `--sala` no se contradicen (señal: capacidad nueva)
- Técnica (sonnet): si los escenarios con datos bastan para escribir un test por vista y si `run('informes', …)` es una costura suficiente con los datos en memoria (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si las reglas de conteo de las vistas son las que el dev-lead esperaría

1. **Solo cuentan las reservas activas** (`status: 'active'`): las canceladas (`cancelar`) y las anuladas (`anular`) no suman en ninguna vista, y una sala con solo reservas canceladas o anuladas cuenta como «nadie la ha reservado».
2. **Orden de las vistas**: sala y franja, de más a menos reservas y, a igual cuenta, por nombre o franja ascendente; día, en orden de calendario (`lun`…`dom`) y solo los días con reservas.
3. **«Franjas más reservadas» enseña las 3 primeras**; con menos de 3 franjas, las que haya. Las franjas se cuentan juntando todas las salas y todos los días.
4. **Vista 1**: salen las salas con reservas; las que no tienen no salen (para eso está la vista 4).
5. **Formato de tabla**: una línea de título, una cabecera (`Sala  Reservas`, `Día  Reservas`, `Franja  Reservas`) y una fila por entrada. Cada columna salvo la última mide el texto más largo de la columna más 2 espacios; la última no se rellena, y no hay espacios al final de ninguna línea. Los números van a la izquierda. La vista 4 lista una sala por línea bajo la cabecera `Sala`. Las cuatro vistas salen en el orden de la petición, separadas por una línea en blanco, sin salto de línea al final del texto.
6. **Cuándo se dice «sin reservas»**: cuando no hay ninguna reserva activa en el conjunto que mira la vista. En las vistas 1 a 3 es el conjunto ya filtrado por `--sala`. En la vista 4 es todo el sistema, para que `--sala Sur` pueda decir `Sur` aunque Norte tenga reservas. Con esto, la vista 4 funciona así: sin reservas activas en todo el sistema dice `sin reservas`; con ellas, lista las salas (las filtradas, si hay `--sala`) sin reservas activas, o `ninguna` si no queda ninguna.
7. **Con cero reservas, la vista 4 dice `sin reservas` y no lista las salas** (Norte y Sur) aunque ambas estén libres: es lo literal de «cada vista dice sin reservas». Es contraintuitivo, así que está aquí para que lo valides; lo contrario sería listar las dos salas.
8. **La lista de salas es la constante `rooms` de `src/app.js`** (Norte, Sur), no se deduce de las reservas. `--sala` compara el nombre exacto, distinguiendo mayúsculas (`norte` no vale).
9. **`--sala` con una sala que no existe** responde `sala desconocida: Oeste` y no enseña ninguna vista. **`--sala` sin valor** responde `falta la sala tras --sala`. Se valida antes de calcular ninguna vista.
10. **Costura de test**: `run('informes', params)` recibe `params` como array (`['--sala', 'Norte']`) y devuelve el texto (`app.js` lo imprime con `console.log`, como el resto). Para dar reservas a los tests, `src/app.js` exporta el array `bookings` (ya existe, hoy no exportado) y los tests lo vacían y lo rellenan antes de cada caso. Eso toca `src/app.js` más allá de `informes`: una línea `export`.
10 bis. **Los valores de `status` son los de `src/app.js`**: `active`, `cancelled` y `voided` (leídos en `cancelBooking` y `voidBooking`); exportar `bookings` toca ese dato en memoria, no su forma. Los errores salen por `console.log` como el resto, sin código de salida distinto.
10 ter. **Argumentos que no son `--sala`** (`--foo`, un valor de más, `--sala` repetida) quedan fuera: no se definen en esta feature y el plan no los cubre.
11. **Capacidad nueva `reports`** (slug en inglés, contenido en castellano).
12. **Las tablas van en una línea en el delta** con `⏎` como salto de línea, porque `sdd capability merge` solo admite líneas GIVEN/WHEN/THEN/AND; la línea en blanco entre vistas se escribe `⏎⏎`. `⏎` equivale a `\n` y `⏎⏎` a `\n\n`; el espacio a cada lado es separador y no forma parte del texto.
13. **Textos nuevos que nadie dijo**: `ninguna`, `sala desconocida: Oeste` y `falta la sala tras --sala`.
- Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: añade los requisitos y las 5 reglas de `reports.md`, sin rechazos (se repite tras esta revisión).
- Política de modelos: revisores de la spec, 2 en sonnet y 1 en la segunda ronda · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (5 tasks una tras otra) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar

### Hallazgos de la review

- **Aceptado** (Crítico, dominio 1 y técnica 6) — dos criterios de «sin reservas» en la vista 4 → decisiones 6 y 7 reescritas con la regla entera y el caso de cero reservas explícito; escenario propio para la vista 4 con cero reservas.
- **Aceptado** (Crítico, dominio 2) — `--sala` «filtra las cuatro» pero la vista 4 mira todo el sistema → 🦆 e Intent dicen que en la vista 4 acota la lista a la sala pedida y dice si está libre.
- **Aceptado** (Crítico, técnica 1) — sin forma de dar reservas a los tests → decisión 10 y Scope.
- **Aceptado** (técnica 2, 3, 4, 5, 8, 9; dominio 3, 4, 5, 6, 7, 8, 9, 10) — firma de `run`, literales vacíos, salida completa con líneas en blanco, escenarios separados con su GIVEN, anchura de columna, origen de las salas, mayúsculas, `--sala` sin valor, estados de la reserva → decisiones 1, 5, 8, 9, 10; escenarios «Salida completa», «Franjas: corte a 3» y «Filtro por sala» separados; Approach con la forma de la reserva.
- **Aceptado** (técnica 7) — decisiones tomadas en el cuerpo → pasadas a esta lista.
- **Aceptado** (2.ª ronda, 1 a 9, sin Críticos) — empates, día intercalado vacío, cancelada y anulada en Sur, `--sala Norte` con cero reservas, valores de `status`, sentido de `⏎`, última columna sin relleno, argumentos ajenos fuera de Scope → escenarios «Ocupación por sala: empate», «Ocupación por día: día sin reservas», «Salas que nadie ha reservado: canceladas y anuladas», «Sin reservas con --sala», decisiones 5, 10 bis, 10 ter y 12. La validación de `--sala`, la unión de las vistas y los avisos de vacío van en la task 5 (filtro), salvo el aviso de cada vista, que va en la task de su vista.
- **Rechazado** (2.ª ronda, 10) — «dev-lead» es el rol de la plantilla del kit y aquí lo hace la misma persona; el slug `reports` en inglés lo exige la plantilla de la spec (nombre de fichero).
- **Rechazado** (dominio 10, unificar `ninguna` y `sin reservas` en un solo aviso) — son dos casos distintos: `sin reservas` es «no hay nada que contar» y `ninguna` es «hay reservas y ninguna sala queda libre»; la regla de la decisión 6 lo dice.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)».
- Una opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro».
- La salida es una tabla de texto — «la salida es una tabla de texto».
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»».
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala».
- Perfil delegate — «Perfil delegate».

## Intent

Hoy las reservas viven en memoria y la única forma de saber cómo se usan las salas es mirarlas una a una con `libres`. Se quiere un comando que responda a cuatro preguntas: qué salas se usan más, qué días, qué franjas, y qué salas nadie ha reservado, con la opción de preguntarlo para una sola sala (en la cuarta, `--sala X` dice si X está libre). El éxito es que `informes` enseñe las cuatro tablas con los datos de las reservas activas, que `--sala X` las acote a X y que, sin reservas, ninguna vista enseñe una tabla vacía. Fracasaría si contase como ocupación una reserva cancelada o anulada.

## Scope

- Entra: el comando `informes` en `src/app.js` con las cuatro vistas y `--sala`; el `export` del array `bookings`; tests en `test/informes.test.js`; la capacidad `reports`.
- No entra: otros formatos de salida (JSON, CSV); filtros por día o franja; informes sobre reservas canceladas o anuladas; persistencia de las reservas (siguen en memoria); cambios a `libres`, `reservar`, `cancelar` o `anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma: `informes` es un comando nuevo; el `'salas'` de respaldo de `run` no cambia | `src/app.js:30-33` | Scope |

- Filas que implementa: nada: comprobado con `git grep -niE "informe|0012|ocupaci" -- . ':!.docs/sdd/specs'`, sin resultados.

## Approach

Una reserva es `{ room, day, slot, status }` (`room`: Norte o Sur; `day`: `lun`…`dom`; `slot`: `10:00-12:00`; `status`: `active`, `cancelled` o `voided`). Cada vista es una función que recibe la lista de reservas y devuelve el texto de su tabla. `run('informes', params)` se engancha en `run` antes del `'salas'` de respaldo, valida `--sala`, filtra las reservas por sala para las vistas 1 a 3, pasa a la vista 4 todas las reservas y la sala pedida, y une las cuatro vistas con una línea en blanco. Cada vista y el filtro son una task (5 en total).

## Dónde se prueba

- Las cuatro vistas, `--sala`, los avisos de vacío y la salida completa: por `run('informes', params)`, como los tests de `test/app.test.js`, con las reservas dadas vaciando y rellenando el array `bookings` exportado, y la salida comparada como texto literal.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas activas; las canceladas (las que anula el propio cliente) y las anuladas (las que anula el responsable de sala) no cuentan.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 14:00-16:00, Sur mar 10:00-12:00
- WHEN `informes`
- THEN la primera vista es: «Ocupación por sala ⏎ Sala   Reservas ⏎ Norte  2 ⏎ Sur    1»
- AND a igual cuenta, ordena por nombre de sala

#### ADDED — Ocupación por sala: empate

- GIVEN reservas activas: Sur lun 10:00-12:00, Norte mar 10:00-12:00
- WHEN `informes`
- THEN la primera vista es: «Ocupación por sala ⏎ Sala   Reservas ⏎ Norte  1 ⏎ Sur    1»

#### ADDED — Ocupación por día: día sin reservas

- GIVEN reservas activas: Norte lun 10:00-12:00, Sur mié 10:00-12:00
- WHEN `informes`
- THEN la segunda vista es: «Ocupación por día de la semana ⏎ Día  Reservas ⏎ lun  1 ⏎ mié  1»
- AND `mar` no sale

#### ADDED — Ocupación por día de la semana

- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 14:00-16:00, Sur mar 10:00-12:00
- WHEN `informes`
- THEN la segunda vista es: «Ocupación por día de la semana ⏎ Día  Reservas ⏎ lun  1 ⏎ mar  2»
- AND solo salen los días con reservas, en orden de calendario (`lun`…`dom`)

#### ADDED — Franjas más reservadas

- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 14:00-16:00, Sur mar 10:00-12:00
- WHEN `informes`
- THEN la tercera vista es: «Franjas más reservadas ⏎ Franja       Reservas ⏎ 10:00-12:00  2 ⏎ 14:00-16:00  1»

#### ADDED — Franjas: corte a tres

- GIVEN reservas activas: Norte lun 08:00-10:00, Norte mar 10:00-12:00, Sur lun 10:00-12:00, Sur mar 14:00-16:00, Norte mié 14:00-16:00, Sur mié 16:00-18:00
- WHEN `informes`
- THEN la tercera vista es: «Franjas más reservadas ⏎ Franja       Reservas ⏎ 10:00-12:00  2 ⏎ 14:00-16:00  2 ⏎ 08:00-10:00  1»
- AND la franja 16:00-18:00 queda fuera: empata a 1 con 08:00-10:00, y a igual cuenta gana la franja ascendente

#### ADDED — Salas que nadie ha reservado

- GIVEN una sola reserva activa: Norte lun 10:00-12:00 (Sur no tiene ninguna)
- WHEN `informes`
- THEN la cuarta vista es: «Salas que nadie ha reservado ⏎ Sala ⏎ Sur»

#### ADDED — Salas que nadie ha reservado: canceladas y anuladas

- GIVEN una reserva activa en Norte (lun 10:00-12:00) y en Sur una cancelada (mar 10:00-12:00) y una anulada (mié 10:00-12:00)
- WHEN `informes`
- THEN la cuarta vista es: «Salas que nadie ha reservado ⏎ Sala ⏎ Sur»

#### ADDED — Salas que nadie ha reservado: todas con reservas

- GIVEN reservas activas: Norte lun 10:00-12:00, Sur mar 10:00-12:00
- WHEN `informes`
- THEN la cuarta vista es: «Salas que nadie ha reservado ⏎ ninguna»

#### ADDED — Salida completa

- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 14:00-16:00, Sur mar 10:00-12:00
- WHEN `informes`
- THEN el texto es: «Ocupación por sala ⏎ Sala   Reservas ⏎ Norte  2 ⏎ Sur    1 ⏎⏎ Ocupación por día de la semana ⏎ Día  Reservas ⏎ lun  1 ⏎ mar  2 ⏎⏎ Franjas más reservadas ⏎ Franja       Reservas ⏎ 10:00-12:00  2 ⏎ 14:00-16:00  1 ⏎⏎ Salas que nadie ha reservado ⏎ ninguna»
- AND no hay salto de línea al final

#### ADDED — Filtro por sala

- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 14:00-16:00, Sur mar 10:00-12:00
- WHEN `informes --sala Norte`
- THEN las vistas 1 a 3 cuentan solo las reservas de Norte: «Ocupación por sala ⏎ Sala   Reservas ⏎ Norte  2», «Ocupación por día de la semana ⏎ Día  Reservas ⏎ lun  1 ⏎ mar  1» y «Franjas más reservadas ⏎ Franja       Reservas ⏎ 10:00-12:00  1 ⏎ 14:00-16:00  1»
- AND la vista 4 es: «Salas que nadie ha reservado ⏎ ninguna», porque Norte tiene reservas

#### ADDED — Filtro por sala sin reservas en esa sala

- GIVEN una reserva activa en Norte (lun 10:00-12:00) y una reserva cancelada en Sur (mar 10:00-12:00)
- WHEN `informes --sala Sur`
- THEN las vistas 1 a 3 dicen `sin reservas` bajo su título: «Ocupación por sala ⏎ sin reservas», «Ocupación por día de la semana ⏎ sin reservas» y «Franjas más reservadas ⏎ sin reservas»
- AND la vista 4 es: «Salas que nadie ha reservado ⏎ Sala ⏎ Sur»

#### ADDED — Sin reservas

- GIVEN ninguna reserva activa
- WHEN `informes`
- THEN cada vista muestra su título y debajo `sin reservas`: «Ocupación por sala ⏎ sin reservas ⏎⏎ Ocupación por día de la semana ⏎ sin reservas ⏎⏎ Franjas más reservadas ⏎ sin reservas ⏎⏎ Salas que nadie ha reservado ⏎ sin reservas»
- AND la vista 4 no lista Norte y Sur aunque estén libres

#### ADDED — Sin reservas con --sala

- GIVEN ninguna reserva activa
- WHEN `informes --sala Norte`
- THEN cada vista muestra su título y debajo `sin reservas`, igual que sin `--sala`

#### ADDED — Sala desconocida

- GIVEN una reserva activa en Norte (lun 10:00-12:00)
- WHEN `informes --sala Oeste`
- THEN responde `sala desconocida: Oeste` y no enseña ninguna vista
- AND `informes --sala norte` responde `sala desconocida: norte`

#### ADDED — Sala sin valor

- GIVEN una reserva activa en Norte (lun 10:00-12:00)
- WHEN `informes --sala`
- THEN responde `falta la sala tras --sala` y no enseña ninguna vista

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: las reservas, en memoria en `src/app.js`; las salas, en la constante `rooms`; los informes no guardan nada.
- **Idioma de los nombres**: castellano en títulos, cabeceras y avisos.
- **Límites**: la vista de franjas enseña como mucho 3; `--sala` distingue mayúsculas.
- **Avisos**: `sin reservas`, `ninguna`, `sala desconocida: <sala>`, `falta la sala tras --sala`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
