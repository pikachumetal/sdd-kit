---
id: 20261112-162535-feature-0012-informes
feature: 0012
title: Informes de ocupación de las salas
mode: full
status: in-review
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de las salas

🦆 Con `salas informes` verás, en cuatro tablas de texto, cuántas reservas activas tiene cada sala, cada día de la semana y cada franja, y qué salas nadie ha reservado; con `--sala Norte` las cuatro hablan solo de Norte. Por ejemplo, con `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00` y `Sur lun 09:00-10:00` sale `Norte  2` y `Sur  1`; las canceladas no cuentan, y una vista sin datos dice «sin reservas». Por dentro es una función pura en `src/app.js` que recibe las reservas, para probar cada vista con sus datos.

Validación: dev-lead — es un comando que usa una persona y lo que sale en la terminal lo debe ver quien lo usa.

## Capacidades

- Nuevas: `booking-reports` — informes de ocupación de las reservas por sala, día, franja y salas sin uso.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`booking-reports`) · tamaño: ~60 líneas de código en 1 fichero y ~120 de tests en otro
- Dominio (sonnet): si «sin reservas» en la vista de salas sin reservas (decisión 7) es coherente con el listado de salas que nadie ha reservado, y si los escenarios cubren el filtro con sala sin reservas (señal: capacidad nueva)
- Técnica (sonnet): si la función pura `informes` de «Approach» permite probar los escenarios sin tocar el estado global de `src/app.js` (señal: capacidad nueva)
- Mínimo razonable: el mismo revisor único; no hay un nivel inferior defendible — sin él quedaría sin mirar la contradicción de la decisión 7.

1. Enfoque: función pura exportada `informes(reservas, params, salas)` en `src/app.js`, frente a un módulo `src/informes.js` y a probar solo por `run` (ver Approach).
2. «Ocupación» = número de reservas **activas**; las canceladas (`cancelled`) y anuladas (`voided`) no cuentan en ninguna vista. No hay porcentaje: el proyecto no define horario de apertura con el que dividir.
3. Una sala «que nadie ha reservado» = una sala sin ninguna reserva activa (una cancelada no la salva).
4. Orden y contenido: ocupación por sala, todas las salas en el orden de `rooms` (Norte, Sur), con 0 si no tienen; por día, solo los días con alguna reserva, en orden de semana (`lun mar mie jue vie sab dom`; los días se escriben como los guarda el sistema, sin tilde); franjas, solo las que tienen alguna reserva, de más a menos reservas y, a igualdad, por franja ascendente; sin tope de filas.
5. Forma de la tabla: líneas separadas por `\n`, sin salto final; una línea de título por vista, luego la cabecera, una línea de guiones y una fila por dato; las vistas de texto (`sin reservas`, `ninguna`) van en la línea siguiente al título, sin cabecera ni guiones; una línea en blanco entre vistas. Columnas separadas por dos espacios, alineadas a la izquierda; el ancho de cada columna es el mayor entre su cabecera y sus datos, y los guiones miden ese ancho; la última columna no se rellena (sin espacios a la derecha). Títulos: `Ocupación por sala`, `Ocupación por día`, `Franjas más reservadas`, `Salas sin reservas`. Cabeceras: `Sala` y `Reservas`; `Día` y `Reservas`; `Franja` y `Reservas`; `Sala`.
6. Sintaxis: `informes` y `informes --sala <nombre>`, el nombre tal cual figura en `rooms` (distingue mayúsculas: `sur` no es `Sur`). Una sala desconocida responde `sala desconocida: <nombre>` y no enseña ninguna vista. `--sala` sin nombre responde `falta el nombre de la sala`. Cualquier otro parámetro se ignora. Un error no cambia el código de salida (la aplicación hoy solo imprime).
7. **Pendiente de confirmar, lectura literal de tu frase**: «sin reservas, cada vista dice «sin reservas»» lo aplico también a «Salas sin reservas»: si no hay ninguna reserva activa en el ámbito (todo, o la sala de `--sala`), esa vista dice `sin reservas` en vez de listar las salas que, en rigor, nadie ha reservado. Si hay alguna reserva y todas las salas del ámbito tienen una, esa vista dice `ninguna`. La alternativa coherente sería listar siempre las salas sin uso y dejar «sin reservas» para las otras tres vistas; la cambio si lo prefieres.
8. Plan en 5 tasks, en este orden: por sala (lleva también el comando `informes` y la tabla), por día, franjas, salas sin reservas, `--sala`.
9. Capacidad nueva `booking-reports` (slug en inglés).
10. Los informes no cambian ningún dato ni añaden persistencia: leen las reservas en memoria.
11. Repaso de coherencia: delta probado en una copia de `.docs/sdd` con `sdd capability merge` → rc=0, 6 requisitos y 5 reglas añadidos a `booking-reports.md`; el repo no cambia.

### Hallazgos de la review

- **Rechazado** (Crítico) — la lectura literal de «sin reservas» deja la vista «Salas sin reservas» sin función con `--sala` y sin reservas → es la frase del dev-lead y no la reescribo por mi cuenta: la decisión 7 sigue marcada como pendiente de confirmar en este gate y el cambio, si lo quieres, es de una sola vista (listar siempre las salas sin uso).
- **Aceptado** — firma sin `salas` en decisión 1 y Approach → unificada en `informes(reservas, params, salas)`; el escenario de `--sala` lleva `GIVEN salas Norte, Sur y Oeste`.
- **Aceptado** — cabeceras con espacios distintos a los escenarios → decisión 5 da las cabeceras como palabras sueltas y fija el ancho (mayor entre cabecera y datos).
- **Aceptado** — escenario de las cuatro vistas sin salida exacta → lleva la salida literal, con `\n`, sin salto final y vistas de texto tras el título.
- **Aceptado** — datos que no rompen el orden → `dom`/`lun`, empate `11:00-12:00`/`09:00-10:00` y sala Sur con `0` antes que Norte.
- **Aceptado** — precedencia de `sin reservas` frente a `0` → declarada en «Regla ante conflicto».
- **Aceptado** — la conexión por `run` no estaba en el delta → escenario con la salida de la reserva del módulo.
- **Aceptado** — `sur` en minúsculas, parámetros sobrantes, código de salida → escenario `--sala sur` y decisión 6.
- **Aceptado** — `Límites: no aplica` contradecía «sin tope de filas» → `sin tope de filas`.
- **Aceptado** — «sin añadir ficheros» → «ficheros de código». El 🦆 se escribe al presentar y la 7 queda abierta en el gate.

- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Una opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy no hay forma de saber cómo se usan las salas: hay que repasar las reservas a mano. `salas informes` resume las reservas activas en cuatro tablas (por sala, por día, por franja y salas sin uso), y `--sala Norte` limita las cuatro a una sala. Éxito: con las reservas `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00` y `Sur lun 09:00-10:00`, el comando enseña `Norte  2` y `Sur  1` sin abrir ningún otro dato. Fracaso aunque funcione: que una reserva cancelada cuente como ocupación, o que una vista vacía salga sin decir nada.

## Scope

- Entra: el comando `informes` y sus cuatro vistas; la opción `--sala`; los tests en `test/informes.test.js`; `src/app.js` (función `informes` y rama en `run`).
- No entra: otros filtros (día, franja), porcentajes de ocupación, topes de filas, exportación (el `.ics` es la 0004), crear reservas, cambiar dónde viven las reservas, README y CHANGELOG (los escribe el corte de la release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0012 sin fila en `ROADMAP.md` (id reservado con `sdd id next --reserve`) → ninguna otra la nombra | nada: comprobado con `git grep -niE "informe|0012|ocupaci"` (sin resultados antes de esta spec)

## Approach

- A. Función pura exportada `informes(reservas, params)` en `src/app.js`, que `run('informes', params)` llama con las reservas en memoria — el fichero crece ~60 líneas, el proyecto sigue con un solo fichero de código; los tests pasan sus propias reservas, sin tocar el estado global.
- B. Módulo nuevo `src/informes.js` — más limpio si crece, pero parte la estructura de «un solo fichero de entrada» de `architecture.md` por una función de 60 líneas.
- C. Probar solo por `run` — sin costura nueva, pero `run` lee las reservas del módulo (hoy una sola: `Norte lun 10:00-12:00`) y no hay forma de sembrar datos: no se podrían probar ni las franjas ni el filtro.
- Elegido: A — es la única que permite datos distintos en cada test sin añadir ficheros de código; coste: `src/app.js` pasa de ~35 a ~95 líneas.

Partes del cómo: cuatro funciones auxiliares (una por vista) que devuelven filas, un `tabla(titulo, cabeceras, filas)` que pinta la tabla y la línea `sin reservas`, y `informes` que valida `--sala`, filtra y concatena las vistas con una línea en blanco. La vista de salas sin reservas devuelve su texto (`sin reservas`, `ninguna` o la tabla) según la decisión 7. Las salas conocidas salen de `rooms`; `informes` recibe también esa lista para que un test use salas distintas.

## Dónde se prueba

- Las cuatro vistas y el filtro: por la función `informes(reservas, params, salas)`, con reservas sembradas en el test, en `test/informes.test.js`, con `node:test` y `assert.equal` como `test/app.test.js`.
- La conexión del comando: por `run('informes', [])`, como los tests actuales de `run`, con la reserva que ya trae el módulo (`Norte lun 10:00-12:00`).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-reports`

#### ADDED — El informe enseña las cuatro vistas en orden

- GIVEN salas Norte y Sur, reservas activas `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00` y `Sur lun 09:00-10:00`, y una cancelada `Norte lun 14:00-16:00`
- WHEN se pide `informes`
- THEN la salida son, en este orden y separadas por una línea en blanco, estas cuatro vistas (líneas separadas por salto de línea, sin salto final): `Ocupación por sala`, `Sala   Reservas`, `-----  --------`, `Norte  2`, `Sur    1` · `Ocupación por día`, `Día  Reservas`, `---  --------`, `lun  2`, `mar  1` · `Franjas más reservadas`, `Franja       Reservas`, `-----------  --------`, `10:00-12:00  2`, `09:00-10:00  1` · `Salas sin reservas`, `ninguna`
- AND con las reservas de la sala módulo (`Norte lun 10:00-12:00` y salas Norte y Sur), `run('informes', [])` enseña `Norte  1`, `Sur  0`, `lun  1`, `10:00-12:00  1` y, bajo `Salas sin reservas` y la cabecera `Sala` con sus guiones `----`, la fila `Sur`

#### ADDED — Ocupación por sala cuenta las reservas activas de cada sala

- GIVEN las reservas del escenario anterior
- WHEN se pide `informes`
- THEN `Ocupación por sala` es `Norte  2` y `Sur  1` bajo la cabecera `Sala   Reservas` y su línea `-----  --------`
- AND una sala sin reservas activas sale con `0` (con salas Sur y Norte, en ese orden, y reservas solo en Norte: `Sur  0` va antes que `Norte  1`), y las reservas canceladas o anuladas no cuentan
- AND sin ninguna reserva activa, la vista es `Ocupación por sala` seguida de `sin reservas`

#### ADDED — Ocupación por día cuenta las reservas activas de cada día de la semana

- GIVEN las reservas del primer escenario
- WHEN se pide `informes`
- THEN `Ocupación por día` es `lun  2` y `mar  1` bajo la cabecera `Día  Reservas` y su línea `---  --------`
- AND solo salen los días con alguna reserva activa, en orden de semana: con reservas en `dom` y `lun`, `lun` sale antes que `dom`
- AND sin ninguna reserva activa, la vista es `Ocupación por día` seguida de `sin reservas`

#### ADDED — Franjas más reservadas ordena las franjas por reservas activas

- GIVEN las reservas del primer escenario
- WHEN se pide `informes`
- THEN `Franjas más reservadas` es `10:00-12:00  2` y `09:00-10:00  1`, en ese orden, bajo la cabecera `Franja       Reservas` y su línea `-----------  --------`
- AND a igualdad de reservas, la franja anterior en orden alfabético va primero: con `11:00-12:00` y `09:00-10:00`, una reserva cada una, sale antes `09:00-10:00`
- AND sin ninguna reserva activa, la vista es `Franjas más reservadas` seguida de `sin reservas`

#### ADDED — Salas sin reservas lista las salas que nadie ha reservado

- GIVEN salas Norte, Sur y Oeste, y reservas activas solo en Norte y Sur
- WHEN se pide `informes`
- THEN `Salas sin reservas` es la fila `Oeste` bajo la cabecera `Sala` y su línea `-----`
- AND con alguna reserva activa y todas las salas con una, la vista es `Salas sin reservas` seguida de `ninguna`
- AND sin ninguna reserva activa en el ámbito, la vista es `Salas sin reservas` seguida de `sin reservas`
- AND una sala solo con reservas canceladas cuenta como sin reservas

#### ADDED — `--sala` filtra las cuatro vistas a una sala

- GIVEN salas Norte, Sur y Oeste, y las reservas del primer escenario
- WHEN se pide `informes --sala Sur`
- THEN las cuatro vistas cuentan solo las reservas de Sur: `Ocupación por sala` enseña solo `Sur  1`, `Ocupación por día` enseña `lun  1`, `Franjas más reservadas` enseña `09:00-10:00  1` y `Salas sin reservas` dice `ninguna`
- AND con `informes --sala Oeste` (Oeste sin reservas) las cuatro vistas dicen `sin reservas`
- AND con `informes --sala sur` sale solo `sala desconocida: sur`
- AND con `informes --sala Cenicienta` sale solo `sala desconocida: Cenicienta`
- AND con `informes --sala` sin nombre sale solo `falta el nombre de la sala`

#### Reglas de la capacidad — booking-reports

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; los informes solo las leen
- **Idioma de los nombres**: castellano en comando, títulos y avisos; los días como los guarda el sistema (`lun`, `mar`…)
- **Límites**: sin tope de filas
- **Avisos**: `sin reservas`, `ninguna`, `sala desconocida: <nombre>`, `falta el nombre de la sala`
- **Regla ante conflicto**: `sin reservas` solo si no hay ninguna reserva activa en el ámbito (todo, o la sala de `--sala`); si hay alguna, las vistas enseñan su tabla, con `0` donde toque

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
