---
id: 20261106-100601-feature-0012-informes
feature: 0012
title: Informes de ocupación de salas
mode: full
profile: delegate
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de salas

🦆 Hoy no hay forma de ver cómo se usan las salas. Con `informes` sacas, de una vez, cuatro tablas: cuántas reservas tiene cada sala (`Norte  3`), cuántas cae en cada día de la semana (`mar  2`), qué franjas se piden más (`10:00-12:00  2`) y qué salas nadie ha reservado (`Sur`). Con `--sala Norte` las cuatro hablan solo de Norte, y donde no hay reservas dicen «sin reservas». Por dentro: una función pura `informes(reservas, sala)` en `src/app.js` que `run` llama.

Validación: dev-lead — es una salida que lee una persona; solo ella sabe si las tablas se entienden.

## Capacidades

- Nuevas: `reports` — lo que enseña el comando `informes`: las cuatro vistas, el filtro por sala y el caso sin reservas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`) · tamaño: ~150 líneas en 2 ficheros (`src/app.js`, `test/informes.test.js`; `PRODUCT.md` lo escribe el cierre)
- Dominio (sonnet): si las definiciones de «ocupación» y «nadie ha reservado» (decisiones 1 y 2) son coherentes entre las cuatro vistas y con el caso «sin reservas» de la decisión 7 (señal: capacidad nueva)
- Técnica (sonnet): si los escenarios de `reports` se pueden probar con las dos costuras de «Dónde se prueba» y si la tabla de la decisión 5 es determinista (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar que «ocupación» y «sin reservas» se contradigan entre vistas, el hueco que no se ve hasta que sale una tabla que dice dos cosas

1. **Ocupación = número de reservas activas.** No hay aforo ni horas de uso en el producto, así que no hay porcentaje. Una reserva cancelada o anulada no cuenta, en ninguna de las cuatro vistas — es coherente con `libres`, que ya ignora lo que no está activo.
2. **«Una sala que nadie ha reservado» = sala sin ninguna reserva activa.** Una sala con solo reservas canceladas o anuladas sale en esa vista. Alternativa descartada: «sin ninguna reserva de ningún estado»; contradiría la decisión 1 (la vista 1 diría `0` y la 4 no la listaría).
3. **Orden y huecos.** Vista 1: salas en el orden de la constante de salas (`Norte`, `Sur`), con `0` las que no tienen. Vista 2: los siete días en este orden `lun mar mié jue vie sáb dom`, con `0` los vacíos (la app solo usa hoy `lun` y `mar`; los acentos de `mié` y `sáb` son mi propuesta). Vista 3: de más a menos reservas y, a igual número, por franja de menor a mayor (`09:00-10:00` antes que `14:00-15:00`); salen todas las franjas con al menos una reserva, sin tope. Todo esto rige solo si la decisión 7 no dice `sin reservas`: la 7 prevalece sobre los `0` y sobre la fila única.
4. **Títulos y columnas.** Cada vista lleva su título en una línea: `Ocupación por sala`, `Ocupación por día`, `Franjas más reservadas`, `Salas que nadie ha reservado`; las vistas se separan con una línea en blanco y salen en ese orden. Cabeceras de columna: `Sala` y `Reservas`; `Día` y `Reservas`; `Franja` y `Reservas`; `Sala`. La alineación la fija la decisión 5.
5. **Formato de la tabla.** Texto plano: una fila de cabecera y una por dato; cada columna tan ancha como su texto más largo (cabecera incluida), con dos espacios entre columnas, alineada a la izquierda y sin espacios al final de la línea. Sin línea en blanco al final de la salida.
6. **Dónde se escribe el comando.** `informes [--sala <nombre>]` en `src/app.js`, que sigue siendo el único fichero de entrada (`tech-stack.md`). Con `--sala` repetido vale la primera; el nombre es siempre el argumento que sigue a `--sala` (`--sala --otra` es la sala `--otra`, desconocida). Los argumentos sobrantes se ignoran.
7. **«Sin reservas» prevalece.** Se aplica a las reservas activas que quedan después de filtrar: si no hay ninguna, cada una de las cuatro vistas escribe su título y debajo `sin reservas`, sin tabla ni `0`s, también la vista 4. Es tu frase literal; tiene un coste que marco: con cero reservas activas, la vista 4 no lista las salas aunque todas estén sin reservar. Con reservas, si la vista 4 no tiene nada que listar escribe `ninguna` bajo su título.
8. **`--sala` filtra las reservas** y en la vista 1 deja solo la fila de esa sala. Con `--sala X` la vista 4 solo mira la sala X: dice `ninguna` si X tiene reservas activas, y `sin reservas` si no las tiene (decisión 7); nunca lista otras salas ni a X. El nombre se compara tal cual, con mayúscula inicial: `norte` es una sala desconocida.
9. **Errores de `--sala`, como texto, nunca excepción.** `informes(reservas, sala)` recibe `sala` sin definir cuando no hay filtro, y `''` cuando `--sala` no trae nombre; `run` solo traduce los argumentos. `informes` devuelve `sala desconocida: <nombre>` para una sala que no existe y `falta el nombre de la sala` para `''`; en ambos casos no sale ninguna vista.
10. **Enfoques y costuras.** (a) **Elegido**: función pura `informes(reservas, sala)` exportada, probada directa con reservas inventadas y por `run('informes', …)` con la reserva de ejemplo de la app (dos costuras porque `run` solo ve `Norte lun 10:00-12:00`); (b) solo por `run` — descartado: con una sola reserva de ejemplo no se pueden probar el orden por empate, los días ni el filtrado; (c) un módulo `src/informes.js` — descartado: `tech-stack.md` pide un solo fichero de entrada y el comando cabe en ~60 líneas.
11. **Contrato de datos.** Una reserva es `{ room, day, slot, status }`, como en la app, con `status` `active`, `cancelled` o `voided`; `day` es uno de `lun mar mié jue vie sáb dom`. La lista de salas es la constante `rooms` del módulo (`Norte`, `Sur`), no se deduce de las reservas. `run` pasa `params` (una lista) y las reservas de la app; `informes` devuelve texto. Un día fuera de esa lista no se prueba ni se cuenta en la vista 2: la app no lo escribe hoy.
12. **Capacidad nueva `reports`**, en inglés kebab-case como nombre de fichero (`capabilities/reports.md`); el contenido va en castellano.
13. **Término nuevo en `PRODUCT.md`**: «Ocupación» — número de reservas activas. Lo escribe el cierre.
14. **Reparto en 5 tasks.** Una por vista (1 a 4, en el orden de la decisión 4) y una para `--sala`; la task 1 también monta el comando, la constante de contrato, el ayudante de tablas y la regla de «sin reservas» / `ninguna` de la decisión 7 que las demás reutilizan. Todos los tests, también los de `run`, van en `test/informes.test.js`. Es lo que pediste.
15. **Reglas de la capacidad.** Datos en memoria, como el resto de la app (`operations.md`); sin tope en el número de franjas; avisos: los dos de `--sala`; conflicto: `sin reservas` prevalece (decisión 7).
16. **Delta probado sobre una copia de `.docs/sdd`**: `sdd capability merge` añade en `reports.md` los requisitos y las reglas, sin rechazos (repetido tras integrar la review).
- Política de modelos: dos revisores de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Técnica:
- **Aceptado** — columnas con espacios distintos en la decisión 4 y en el THEN → la 4 solo da nombres de cabecera y los THEN llevan la tabla literal.
- **Aceptado** (Crítico) — escenario «Salas que nadie ha reservado» con dos GIVEN y un AND sin GIVEN → partido en tres escenarios con salida literal.
- **Aceptado** (Crítico) — THEN que ninguna costura declarada ejercita → «Dónde se prueba» asigna cada escenario a su costura; filtrado y cero reservas van a la función directa.
- **Aceptado** — contrato de datos sin decir → decisión 11.
- **Aceptado** — quién valida `--sala` y qué devuelve → decisión 9 y fila de «Lo que se retira o cambia de forma».
- **Aceptado** — decisiones sin declarar (repetido, sobrantes, mayúsculas, `--sala` con solo canceladas) → decisiones 6 y 8 y un escenario.
- **Aceptado** — «sin reservas» sin salida completa → escenario con las cuatro vistas literales.
- **Aceptado** — Intent remitía a una decisión inexistente → reescrito.
- **Aceptado** — cabeceras y filas con `0` de la vista 2 → siete filas literales.
- **Aceptado** — decisión 11 duplicaba la 10 → fundida.

Dominio:
- **Aceptado** (Crítico) — «sin reservas» chocaba con los `0` y la fila única → la decisión 7 prevalece (decisiones 3 y 8) y hay un escenario de precedencia.
- **Aceptado** (Crítico) — la vista 4 filtrada nunca lista y la decisión 8 era circular → la decisión 8 lo dice y hay un escenario por rama; el coste de la 7 sigue marcado para que lo valides.
- **Aceptado** — cero reservas globales sin GIVEN → escenario propio por la función directa.
- **Aceptado** — disyunción en la vista 4 → tres escenarios.
- **Aceptado** — lista de salas y estados sin fuente → decisión 11.
- **Aceptado** — decisión 15 contra las reglas → alineada; «Límites» y «Regla ante conflicto» declaradas.
- **Aceptado** — nombre inglés contra «castellano» → la regla de idioma cita la excepción.
- **Aceptado** — Intent → reescrito.
- **Aceptado** — repetido, sobrantes y minúscula → decisiones 6 y 8 y escenario de `norte`.
- **Rechazado** — días fuera de `lun…dom` como escenario propio → no es alcanzable hoy (la app solo escribe días válidos); queda dicho en la decisión 11.
- **Aceptado** — decisión 16 sin evidencia → repetida tras integrar.

Segunda ronda (un revisor, sonnet):
- **Aceptado** (Crítico) — la vista 4 con `--sala` listaría `Sur` según las reglas → decisión 8: con sala solo se mira esa sala.
- **Aceptado** (Crítico) — la función no distinguía «sin filtro» de «sin nombre» → decisión 9 fija `undefined` y `''`, y los errores se prueban por las dos costuras.
- **Aceptado** — «Filtrar por sala» sin tablas literales → vistas 2 y 3 literales.
- **Aceptado** — disyunciones en «Sin reservas en toda la app» y «Errores» → partidos en escenarios de un solo comportamiento.
- **Aceptado** — comportamiento de la decisión 6 sin escenario → «Sala repetida» y «Argumento tras la opción»; quito la promesa de «cualquier posición».
- **Aceptado** — THEN de «Sala solo con canceladas» → literal.
- **Aceptado** — Intent contra el coste de la decisión 7 → matizado.
- **Aceptado** — `PRODUCT.md` fuera de las tasks → lo escribe el cierre; la estimación cuenta 2 ficheros.
- **Aceptado** — task y fichero de la regla de la 7 y de los tests de `run` → decisión 14.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Una opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- Salida en tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- Plan en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy el producto reserva y cancela, pero no dice cómo se usan las salas: para saber qué sala está vacía o qué franja se llena hay que leer las reservas una a una. El comando `informes` lo resume en cuatro tablas leíbles en la terminal. Éxito: con las reservas del primer escenario del delta, `informes` enseña las cuatro vistas con los números que salen de contarlas a mano; y con `informes --sala Sur` sobre la reserva de ejemplo de la app, las cuatro dicen «sin reservas». Fracaso aunque «funcione»: una vista que cuente canceladas, o dos vistas que se contradigan sobre qué es «reservada» (salvo el coste de la decisión 7, que ya está marcado).

## Scope

- Entra: el comando `informes` con sus cuatro vistas; la opción `--sala`; el texto «sin reservas»; los errores de `--sala`; los tests; el término «Ocupación» en `PRODUCT.md`.
- No entra: porcentajes o aforo, rangos de fechas, ordenar o limitar con opciones, otros formatos (CSV, JSON), crear reservas nuevas, persistencia.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -n -i "informes\|0012\|ocupaci"` fuera de `specs/`: sin resultados; `run` sigue devolviendo `salas` ante un comando desconocido (`src/app.js:32`) | no aplica: el comando es nuevo y no toca ese retorno |
| Contrato de `run` y de los exports | `src/app.js:28-33` (`run`) | `run` gana una rama `informes` que pasa `params` (lista) a `informes`, y el módulo exporta `informes` (decisiones 9 y 11); nada de lo anterior cambia |

- Filas que implementa: nada: comprobado con `git grep -n -i "informes\|0012\|ocupaci"` (la 0012 es el id reservado de esta feature, sin fila de roadmap)

## Approach

Una función pura `informes(reservas, sala)` en `src/app.js` que devuelve el texto de las cuatro vistas; `run('informes', params)` separa `--sala` y la llama con las reservas de la app. Un ayudante común escribe cada tabla (decisión 5). La forma de una reserva y el origen de las salas son los de la decisión 11. Se construye en 5 tasks: la 1 deja el comando, el ayudante y la vista de ocupación por sala; las 2, 3 y 4 añaden una vista cada una; la 5 añade `--sala` y sus errores.

## Dónde se prueba

- Por `informes(reservas, sala)` directa, con reservas inventadas (como `cancel.test.js`, sin pasar por `run`): todos los escenarios salvo los dos «por la terminal».
- Por `run('informes', params)`, como los tests de `app.test.js` pero en `test/informes.test.js`, con la reserva de ejemplo: «Sin reservas con la reserva de ejemplo», «Sala repetida» y «Argumento tras la opción»; los tres errores se prueban por las dos costuras.

## Términos y ADR

- Términos resueltos: Ocupación — número de reservas activas de una sala, un día o una franja; una cancelada o anulada no cuenta.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

Reservas de `F1`: activas `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00`, `Norte mar 14:00-15:00`; cancelada `Norte vie 09:00-10:00`; `Sur` sin ninguna.

#### ADDED — Ocupación por sala

- GIVEN `F1`
- WHEN se llama a `informes` sin sala
- THEN la vista es, línea a línea: `Ocupación por sala` · `Sala   Reservas` · `Norte  3` · `Sur    0`, con la cancelada sin contar

#### ADDED — Ocupación por día

- GIVEN `F1`
- WHEN se llama a `informes` sin sala
- THEN la vista es: `Ocupación por día` · `Día  Reservas` · `lun  1` · `mar  2` · `mié  0` · `jue  0` · `vie  0` · `sáb  0` · `dom  0` (el viernes es cero porque la reserva está cancelada)

#### ADDED — Franjas más reservadas

- GIVEN `F1` más la activa `Sur lun 09:00-10:00`
- WHEN se llama a `informes` sin sala
- THEN la vista es: `Franjas más reservadas` · `Franja       Reservas` · `10:00-12:00  2` · `09:00-10:00  1` · `14:00-15:00  1`

#### ADDED — Salas que nadie ha reservado

- GIVEN `F1` (`Sur` sin ninguna reserva)
- WHEN se llama a `informes` sin sala
- THEN la vista es: `Salas que nadie ha reservado` · `Sala` · `Sur`

#### ADDED — Sala solo con reservas canceladas

- GIVEN la activa `Norte lun 10:00-12:00` y la cancelada `Sur mar 09:00-10:00`
- WHEN se llama a `informes` sin sala
- THEN la vista es: `Salas que nadie ha reservado` · `Sala` · `Sur`

#### ADDED — Todas las salas con reservas

- GIVEN las activas `Norte lun 10:00-12:00` y `Sur mar 09:00-10:00`
- WHEN se llama a `informes` sin sala
- THEN la vista es: `Salas que nadie ha reservado` · `ninguna`

#### ADDED — Filtrar por sala

- GIVEN `F1`
- WHEN se llama a `informes` con la sala `Norte`
- THEN la vista 1 es `Ocupación por sala` · `Sala   Reservas` · `Norte  3`
- AND la vista 2 es `Ocupación por día` · `Día  Reservas` · `lun  1` · `mar  2` · `mié  0` · `jue  0` · `vie  0` · `sáb  0` · `dom  0`
- AND la vista 3 es `Franjas más reservadas` · `Franja       Reservas` · `10:00-12:00  2` · `14:00-15:00  1`
- AND la vista 4 es `Salas que nadie ha reservado` · `ninguna`, aunque `Sur` no tenga reservas, porque con sala solo se mira `Norte`

#### ADDED — Sin reservas ante filtro vacío

- GIVEN `F1` más la cancelada `Sur mar 09:00-10:00`
- WHEN se llama a `informes` con la sala `Sur`
- THEN las cuatro vistas son su título y debajo `sin reservas`, sin `Sur  0` ni los siete días a cero

#### ADDED — Sin reservas en toda la app

- GIVEN ninguna reserva
- WHEN se llama a `informes` sin sala
- THEN las cuatro vistas son su título y debajo `sin reservas`, también la vista 4

#### ADDED — Solo reservas canceladas en toda la app

- GIVEN solo la cancelada `Norte vie 09:00-10:00`
- WHEN se llama a `informes` sin sala
- THEN las cuatro vistas son su título y debajo `sin reservas`, también la vista 4

#### ADDED — Sin reservas con la reserva de ejemplo

- GIVEN la reserva de ejemplo de la app (`Norte lun 10:00-12:00`)
- WHEN se pide por la terminal `informes --sala Sur`
- THEN la salida es, con una línea en blanco entre vistas: `Ocupación por sala` / `sin reservas` · `Ocupación por día` / `sin reservas` · `Franjas más reservadas` / `sin reservas` · `Salas que nadie ha reservado` / `sin reservas`

#### ADDED — Sala desconocida

- GIVEN la reserva de ejemplo de la app
- WHEN se pide `informes --sala Oeste`
- THEN responde `sala desconocida: Oeste`, sin ninguna vista

#### ADDED — Sala con minúscula

- GIVEN la reserva de ejemplo de la app
- WHEN se pide `informes --sala norte`
- THEN responde `sala desconocida: norte`, sin ninguna vista

#### ADDED — Opción sin nombre

- GIVEN la reserva de ejemplo de la app
- WHEN se pide `informes --sala`
- THEN responde `falta el nombre de la sala`, sin ninguna vista

#### ADDED — Sala repetida

- GIVEN la reserva de ejemplo de la app
- WHEN se pide `informes --sala Sur --sala Norte`
- THEN la salida es la de `informes --sala Sur`: las cuatro vistas dicen `sin reservas`

#### ADDED — Argumento tras la opción

- GIVEN la reserva de ejemplo de la app
- WHEN se pide `informes --sala --otra`
- THEN responde `sala desconocida: --otra`, sin ninguna vista

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: en memoria, como el resto de la app; las salas, la constante `rooms`
- **Idioma de los nombres**: castellano (el nombre de fichero de la capacidad, `reports`, va en inglés kebab-case)
- **Límites**: sin tope en el número de franjas de la vista 3
- **Avisos**: `sala desconocida: <nombre>` · `falta el nombre de la sala`
- **Regla ante conflicto**: `sin reservas` prevalece sobre los `0` y la fila única

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
