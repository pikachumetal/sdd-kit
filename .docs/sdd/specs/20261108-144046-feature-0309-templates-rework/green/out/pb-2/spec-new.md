---
id: 20261108-184224-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas de ocupación
mode: full
profile: delegate
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas de ocupación

🦆 Hoy no hay forma de ver cómo se usan las salas. Con `informes` sacas cuatro tablas de texto: reservas por sala (`Norte  2`), por día de la semana (`lun  3`), las franjas más reservadas (`10:00-12:00  2`) y las salas que nadie ha reservado (`Sur`). Con `--sala Norte` las cuatro se calculan solo con las reservas de Norte. Si no hay reservas, cada vista dice «sin reservas». Por dentro, una función pura en `src/app.js` que recibe las reservas y devuelve el texto, y `run('informes', …)` la llama con los datos del módulo.

Validación: dev-lead — es lo que ve una persona en la terminal (formato de las tablas, orden, textos).

## Capacidades

- Nuevas: `reports` — informes de ocupación de las salas a partir de las reservas activas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`), contrato público (formato de salida del CLI) · tamaño: ~120 líneas en 2 ficheros (`src/app.js` y `test/informes.test.js`)
- Dominio (sonnet): si los THEN de las cuatro vistas y de `--sala` cubren los casos de reservas canceladas/anuladas y de sala sin reservas con los datos del ejemplo (señal: capacidad nueva)
- Técnica (sonnet): si el formato de tabla (columnas, relleno, orden de empates) es determinista y probable con la función pura, y si `run('informes', …)` encaja con `run` actual (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las reglas de conteo (qué reserva cuenta) son las que espera quien reserva

### Hallazgos de la review

Ronda 2 (un revisor, sin tercera ronda):

- **Aceptado** — Crítico: la decisión 2 decía «no hay horas» y las franjas son horas → reformulada: no hay aforo ni porcentajes; la reserva es `{room, day, slot, status}` (decisión 11).
- **Aceptado** — Crítico: el AND `Sur    0` contradecía el GIVEN de «Ocupación por sala» → quitado; el caso con 0 lo cubren «Las reservas canceladas y anuladas no cuentan» y «El comando con los datos del módulo».
- **Aceptado** — Importante: empate, día fuera de lista y «todas las salas tienen reservas» sin GIVEN/tabla → escenarios nuevos con tabla literal.
- **Aceptado** — Importante: la decisión 9 atribuía al dev-lead la precedencia → la excepción «sin reservas» es suya; la precedencia sobre 5 y 8 es mía y se dice.
- **Aceptado** — Importante: forma de los datos y de los retornos → decisión 11 (reserva, salas, `informes` y `run` devuelven un string, los avisos son strings, no excepciones).
- **Aceptado** — Importante: reserva activa de una sala que no está en la lista → decisión 14 (se ignora en todas las vistas) y escenario.
- **Aceptado** — Importante: dependencia de los estados `cancelled`/`voided` → decisión 15.
- **Aceptado** — Menor: recuento de ficheros de la review, estado compartido en el test de `run`, frase críptica de la decisión 7, `--sala=Norte` → corregidos.

Ronda 1 (dominio y técnica):

- **Aceptado** — Crítico: el AND de `--sala Sur` contradecía el GIVEN del escenario «Filtrar por sala» → ahora son dos escenarios con su propio GIVEN («Filtrar por sala» y «Filtrar por una sala sin reservas»).
- **Aceptado** — Crítico: los fragmentos `Sur  0` no respetaban el relleno de la decisión 3 → todos los THEN llevan la tabla completa, con relleno literal.
- **Aceptado** — Importante: choque entre decisiones 5 y 8 y la 9 con cero reservas → decisión 9 fija la precedencia (gana «sin reservas» cuando las reservas activas filtradas son 0).
- **Aceptado** — Importante: falta «Reglas de la capacidad» → añadida con las cinco reglas.
- **Aceptado** — Importante: forma de los días y día desconocido → decisión 6 fija la forma con acento en el dato y la salida, y un día fuera de la lista sale al final.
- **Aceptado** — Importante: «activa» sin definir → decisión 2: activa es `status: 'active'`; cualquier otro estado no cuenta. El escenario de no contadas cubre las cuatro vistas.
- **Aceptado** — Importante: parseo de `--sala` (repetido, minúscula, extras, sin nombre) → decisión 10 y escenarios nuevos.
- **Aceptado** — Importante: relleno de la última columna y salto final → decisión 3.
- **Aceptado** — Menor: «todas las salas tienen reservas» engañoso con `--sala` → decisión 8: con `--sala` el texto es «la sala tiene reservas».
- **Aceptado** — Menor: texto sin cabecera en esa vista, escenario literal de `run('informes', [])`, función sin mutar entradas, criterio de empates, «sin límite» como regla, Intent reformulado → decisiones 3, 7, 11 y escenario «El comando con los datos del módulo».
- **Rechazado** — Menor: pedir al dev-lead que fije `reports` frente a `informes` como idioma de los nombres → el slug es un nombre de fichero (decisión 1) y ya lo valida en este gate.

1. Nombre de la capacidad nueva: `reports` (inglés kebab-case, contenido en castellano) — el slug es un nombre de fichero.
2. **Ocupación = número de reservas activas.** Activa es `status: 'active'`; cualquier otro estado (`cancelled`, `voided`) no cuenta en ninguna vista. No hay aforo en los datos, así que no hay porcentajes.
3. **Forma de la tabla:** una línea de título, una de cabecera y una por fila; entre columnas, dos espacios tras la celda más ancha de la columna; la última columna no lleva relleno (sin espacios finales); los números van alineados a la izquierda; sin barras ni rayas; el texto no acaba en salto de línea (lo añade `console.log`). Las cuatro vistas salen en el orden dicho, separadas por una línea en blanco, con los títulos «Ocupación por sala», «Ocupación por día de la semana», «Franjas más reservadas» y «Salas sin reservas».
4. **Cabeceras:** `Sala  Reservas`, `Día  Reservas`, `Franja  Reservas`, `Sala` (con el relleno de la decisión 3).
5. **Ocupación por sala:** lista todas las salas (Norte, Sur), con 0 las que no tienen reservas, en el orden de la lista de salas; salvo cuando manda la decisión 9.
6. **Ocupación por día:** solo los días con reservas, en orden `lun mar mié jue vie sáb dom`, escritos así (con acento) en el dato y en la salida. Un día que no esté en esa lista sale después de los conocidos, en orden alfabético simple.
7. **Franjas más reservadas:** todas las franjas con reservas, de más a menos reservas, y a igualdad por franja con comparación simple de cadenas (`<`). Sin límite de cuántas salen.
8. **Salas sin reservas:** las salas con 0 reservas activas, una por línea. Si todas tienen alguna, la vista dice «todas las salas tienen reservas» (con `--sala`, «la sala tiene reservas»), sin cabecera; sin esto la lista vacía se leería como un fallo. Salvo cuando manda la decisión 9.
9. **«sin reservas» (precedencia):** si no hay ninguna reserva activa tras aplicar `--sala`, cada una de las cuatro vistas muestra su título y debajo «sin reservas», incluida «Salas sin reservas», y esto gana a las decisiones 5 y 8. Que cada vista diga «sin reservas» lo dijo el dev-lead; la precedencia sobre 5 y 8 es mía.
10. **`--sala <nombre>`:** va tras `informes`; el nombre debe coincidir exacto con una sala, con mayúsculas (`Norte`, `Sur`). Filtra las cuatro vistas: se cuentan solo las reservas de esa sala, y «Ocupación por sala» y «Salas sin reservas» solo consideran esa sala. Sala que no existe (también `norte`): `sala desconocida: Oeste` (una línea, sin tablas). `--sala` sin nombre, o seguido de otra opción que empieza por `--`: `falta el nombre de la sala`. Si `--sala` aparece más de una vez, vale el primero; los parámetros que sobran se ignoran, como en los otros comandos, y `--sala=Norte` no se reconoce (se ignora, sin filtro). `informes` sin parámetros no filtra.
11. **Dónde va el código:** una función pura `informes(params, reservas, salas)` exportada de `src/app.js` que no modifica sus argumentos: `reservas` es una lista de `{room, day, slot, status}` y `salas` una lista de nombres, como en el módulo hoy; devuelve un string (los avisos de la decisión 10 también son strings devueltos, no excepciones). `run('informes', params)` devuelve ese string y la llama con los datos del módulo. Un solo fichero de entrada, como pide `tech-stack.md`.
12. **Sin entrada en el roadmap:** la 0012 sale de `sdd id next --reserve`; no hay fila en `roadmap.md`. Se añade al cerrar si el dev-lead lo quiere.
14. **Reserva de una sala que no está en la lista:** una reserva activa cuya sala no figura en `salas` se ignora en todas las vistas.
15. **Dependencia de los estados:** hoy `status` es `active`, `cancelled` o `voided`; las filas 0010 y 0011 están pendientes y no se espera que los cambien. Si lo hicieran, se revisa esta spec.
13. Delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: crea `reports.md` con requisitos añadidos, sin rechazos (se repite tras estos cambios). Sin dependencias que instalar (`package.json` no tiene).
- Política de modelos: revisores de la spec con sonnet (dominio y técnica, y la segunda ronda) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas»
- Una opción `--sala` que filtra las cuatro vistas — «una opción --sala que filtra las cuatro»
- Salida como tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- Plan en 5 tasks, una por vista y otra para `--sala`; perfil delegate — «el plan sale en 5 tasks, una por vista y otra para --sala. Perfil delegate»

## Intent

Hoy `salas` reserva, cancela y anula, pero no dice cómo se usan las salas. El dev-lead quiere verlo desde la terminal: cuántas reservas tiene cada sala, qué días y franjas se reservan más y qué salas nadie usa. Éxito: `informes` da las cuatro tablas con los números correctos y `--sala X` las reduce a esa sala. Fracaso aunque funcione: que cuente reservas canceladas o anuladas, o que una vista vacía imprima una línea en blanco sin decir nada.

## Scope

- Entra: el comando `informes`, las cuatro vistas, `--sala`, los textos «sin reservas», «todas las salas tienen reservas», «la sala tiene reservas», `sala desconocida` y `falta el nombre de la sala`.
- No entra: porcentajes de ocupación o aforo, rangos de fechas, otros formatos (CSV, JSON), crear reservas por fecha, nuevas salas. Tampoco el motivo de cancelación (0010) ni la anulación por responsable (0011).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. `run` gana un caso, `informes`; el resto de comandos no cambia | `src/app.js` (`run`) | Scope |

- Filas que implementa: 0012 → ningún fichero la nombra | nada: comprobado con `git grep -n "0012"` fuera de `.docs/sdd/specs/` (sin resultados)

## Approach

- A) Función pura en `src/app.js` que recibe las reservas y las salas, y `run` la llama con los datos del módulo — una función por vista más un formateador de tabla; se prueba con datos de ejemplo sin tocar el estado del módulo.
- B) Módulo nuevo `src/informes.js` — separa, pero `tech-stack.md` dice «un solo fichero de entrada» y el proyecto es de un fichero; añade una importación para ~60 líneas.
- C) Calcular dentro de `run` leyendo `bookings` del módulo — no se puede probar con otros datos que la reserva única de ejemplo.
- Elegido: A — es lo más pequeño, se prueba con datos de ejemplo y respeta el fichero único.

Las cuatro vistas comparten el filtrado por `--sala` y el conteo de reservas activas; el formateador de tabla es común. Cada vista es una función `vistaX(reservas, salas)` que devuelve un texto; `informes` las une.

## Dónde se prueba

- Las cuatro vistas y `--sala`: llamando a la función `informes` con reservas de ejemplo, en `test/informes.test.js`, como los tests de `cancel.test.js` que llaman a funciones exportadas.
- Que el comando existe: `run('informes', [])` con los datos del módulo (una reserva activa de Norte el lunes), en `test/informes.test.js`, como `app.test.js` prueba `run`. Es el único test de ese fichero que depende del estado del módulo, y ninguno del fichero cancela o anula con `run`.

## Términos y ADR

- Términos resueltos: ocupación — número de reservas activas (no un porcentaje).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `reports`

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: en memoria, en `src/app.js` (lista de salas y de reservas del módulo); `informes` no guarda nada.
- **Idioma de los nombres**: castellano en comando, opción y textos (`informes`, `--sala`); el slug de la capacidad en inglés.
- **Límites**: sin límite de filas por vista.
- **Avisos**: `sala desconocida: <nombre>` y `falta el nombre de la sala`.
- **Regla ante conflicto**: nombre de sala exacto con mayúsculas; `--sala` repetido, vale el primero; parámetros sobrantes, se ignoran; con cero reservas activas filtradas manda «sin reservas».

#### ADDED — Ocupación por sala

- GIVEN salas Norte y Sur, y reservas activas: Norte lun 10:00-12:00, Norte mar 10:00-12:00, Sur lun 14:00-16:00
- WHEN `informes`
- THEN la vista «Ocupación por sala» es:
  ```text
  Ocupación por sala
  Sala   Reservas
  Norte  2
  Sur    1
  ```

#### ADDED — Ocupación por día de la semana

- GIVEN las reservas del ejemplo anterior
- WHEN `informes`
- THEN la vista «Ocupación por día de la semana» es:
  ```text
  Ocupación por día de la semana
  Día  Reservas
  lun  2
  mar  1
  ```
- AND los días sin reservas no salen; el orden es lun, mar, mié, jue, vie, sáb, dom

#### ADDED — Franjas más reservadas

- GIVEN las reservas del ejemplo y una cuarta, activa: Sur mar 10:00-12:00
- WHEN `informes`
- THEN la vista «Franjas más reservadas» es:
  ```text
  Franjas más reservadas
  Franja       Reservas
  10:00-12:00  3
  14:00-16:00  1
  ```

#### ADDED — Salas sin reservas

- GIVEN salas Norte y Sur, y una sola reserva activa: Norte lun 10:00-12:00
- WHEN `informes`
- THEN la vista «Salas sin reservas» es:
  ```text
  Salas sin reservas
  Sala
  Sur
  ```

#### ADDED — Todas las salas tienen reservas

- GIVEN reservas activas: Norte lun 10:00-12:00, Sur lun 14:00-16:00
- WHEN `informes`
- THEN la vista «Salas sin reservas» es:
  ```text
  Salas sin reservas
  todas las salas tienen reservas
  ```

#### ADDED — Empates y días fuera de la lista

- GIVEN reservas activas: Norte lun 14:00-16:00, Sur lun 08:00-10:00
- WHEN `informes`
- THEN «Franjas más reservadas» es:
  ```text
  Franjas más reservadas
  Franja       Reservas
  08:00-10:00  1
  14:00-16:00  1
  ```
- AND con reservas activas Norte dom 10:00-12:00 y Norte xyz 10:00-12:00, «Ocupación por día de la semana» es:
  ```text
  Ocupación por día de la semana
  Día  Reservas
  dom  1
  xyz  1
  ```

#### ADDED — Las reservas canceladas y anuladas no cuentan

- GIVEN Norte lun 10:00-12:00 activa, Norte mar 10:00-12:00 cancelada y Sur lun 14:00-16:00 anulada
- WHEN `informes`
- THEN las cuatro vistas son:
  ```text
  Ocupación por sala
  Sala   Reservas
  Norte  1
  Sur    0

  Ocupación por día de la semana
  Día  Reservas
  lun  1

  Franjas más reservadas
  Franja       Reservas
  10:00-12:00  1

  Salas sin reservas
  Sala
  Sur
  ```

#### ADDED — Sin reservas

- GIVEN salas Norte y Sur, sin ninguna reserva activa
- WHEN `informes`
- THEN cada una de las cuatro vistas sale con su título y debajo «sin reservas»:
  ```text
  Ocupación por sala
  sin reservas

  Ocupación por día de la semana
  sin reservas

  Franjas más reservadas
  sin reservas

  Salas sin reservas
  sin reservas
  ```

#### ADDED — El comando con los datos del módulo

- GIVEN los datos del módulo: una sola reserva activa, Norte lun 10:00-12:00
- WHEN `run('informes', [])`
- THEN el texto es:
  ```text
  Ocupación por sala
  Sala   Reservas
  Norte  1
  Sur    0

  Ocupación por día de la semana
  Día  Reservas
  lun  1

  Franjas más reservadas
  Franja       Reservas
  10:00-12:00  1

  Salas sin reservas
  Sala
  Sur
  ```

#### ADDED — Filtrar por sala

- GIVEN reservas activas: Norte lun 10:00-12:00, Norte mar 10:00-12:00, Sur lun 14:00-16:00
- WHEN `informes --sala Norte`
- THEN las cuatro vistas son:
  ```text
  Ocupación por sala
  Sala   Reservas
  Norte  2

  Ocupación por día de la semana
  Día  Reservas
  lun  1
  mar  1

  Franjas más reservadas
  Franja       Reservas
  10:00-12:00  2

  Salas sin reservas
  la sala tiene reservas
  ```

#### ADDED — Filtrar por una sala sin reservas

- GIVEN una sola reserva activa: Norte lun 10:00-12:00
- WHEN `informes --sala Sur`
- THEN las cuatro vistas dicen «sin reservas», cada una bajo su título, como en el escenario «Sin reservas»

#### ADDED — Reserva de una sala que no existe

- GIVEN salas Norte y Sur, y una sola reserva activa: Oeste lun 10:00-12:00
- WHEN `informes`
- THEN las cuatro vistas dicen «sin reservas», como en el escenario «Sin reservas»

#### ADDED — Sala desconocida o sin nombre

- GIVEN salas Norte y Sur
- WHEN `informes --sala Oeste`
- THEN la salida es `sala desconocida: Oeste`, sin tablas
- AND `informes --sala norte` da `sala desconocida: norte`
- AND `informes --sala` sin nombre, o `informes --sala --otra`, da `falta el nombre de la sala`

#### ADDED — --sala repetido o con parámetros sobrantes

- GIVEN salas Norte y Sur
- WHEN `informes --sala Norte --sala Sur extra`
- THEN el resultado es el de `informes --sala Norte`
- AND `informes --sala=Norte` da el resultado de `informes`, sin filtro
