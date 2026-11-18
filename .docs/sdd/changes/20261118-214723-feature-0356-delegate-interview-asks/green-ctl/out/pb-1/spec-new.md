---
id: 20261118-225504-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas de ocupación
mode: full
status: draft
created: 2026-11-18
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas de ocupación

🦆 Hoy no hay forma de ver cómo se usan las salas. Con `informes` verás, en una tabla de texto, cuántas reservas tiene cada sala, cada día de la semana y cada franja, y qué salas nadie ha reservado: con la reserva de ejemplo (`Norte`, lunes, `10:00-12:00`), `Norte` sale con 1 y `Sur` con 0. Con `--sala Norte` las cuatro vistas hablan solo de `Norte`. Sin reservas, cada vista dice «sin reservas». Por dentro, cuatro funciones puras en `src/app.js` que reciben la lista de reservas, para poder probar también el caso vacío.

Validación: dev-lead — lo que sale por la terminal lo lee una persona: formato, títulos y textos los valida el dev-lead.

## Capacidades

- Nuevas: `reports` — informes de uso de las salas: cuatro vistas de ocupación y su filtro por sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`) · tamaño: ~90 líneas en 4 ficheros (`src/app.js`, `test/informes.test.js`, `CHANGELOG.md`, la spec)
- Dominio (sonnet): si las cinco reglas de `reports` están declaradas y si cada valor elegido por mí está en esta lista (señal: capacidad nueva)
- Técnica (sonnet): si los escenarios de las cuatro vistas, del caso vacío y de `--sala` se contradicen o pasan sin el comportamiento (señal: salida de texto con orden y desempates)
- Mínimo razonable: solo técnica — deja sin mirar las reglas de la capacidad y los valores míos que no están aquí

Prueba del delta sobre una copia de `.docs/sdd`: `sdd capability merge` añade los 8 requisitos y las 5 reglas de `reports`, y `sdd capability check` da «Capacidades válidas: 1» (el `capabilities/` del repo no cambia).

### Hallazgos de la review

- **Aceptado** — contradicción entre «Informes sin reservas», «Salas sin reservas» y la decisión 5 (dominio 2, técnica 2 y 3) → la decisión 9 pasa a ser la regla única del caso vacío («sin reservas» sustituye al cuerpo de cada vista; las decisiones 5 y 8 dicen «salvo el caso vacío»), y el escenario vacío y el de `--sala` con sala sin reservas escriben la salida.
- **Aceptado** — código de miércoles y sábado sin confirmar (dominio 1, técnica 5) → se aceptan las dos grafías (`mie` o `mié`, `sab` o `sáb`) para ordenar y se enseña la que llegue; hay escenario con ellas; la decisión 6 deja de depender de un código desconocido.
- **Aceptado** — reglas de la capacidad incompletas (dominio 3, 4 y 5) → «Dónde viven los datos» nombra `rooms`, «Límites» dice «sin tope de filas» y «Regla ante conflicto» recoge los órdenes y desempates.
- **Aceptado** — casos de `--sala` sin escenario (dominio 6, técnica 1) → escenarios para `--sala norte`, `--sala` seguido de otra opción y `--sala` repetido (decisión 13).
- **Aceptado** — los escenarios no fijan el texto (técnica 4) → escenario de salida completa con el literal y escenario del orden de días.
- **Aceptado** — contrato de datos y firmas sin declarar, y si `run` devuelve o imprime (técnica 6 y 7) → decisión 14.
- **Aceptado** — avisos fuera del Scope (dominio 7) y task de la rama `run` (técnica 8) → Scope y decisión 15; `CHANGELOG.md` existe (comprobado).

1. **Capacidad nueva `reports`** (slug en inglés, kebab-case) — es el sustantivo del dominio; hoy `capabilities/` está vacío.
2. **Ocupación = número de reservas activas.** Las canceladas y las anuladas no cuentan. Sin porcentajes: no hay un horario de apertura que dé el 100 %.
3. **Comando `informes` y opción `--sala <nombre>`** (el dev-lead dijo «informes» y «--sala»); el nombre se compara tal cual con el de la sala (`Norte`, `Sur`).
4. **Forma de la salida**: cada vista es un título, una cabecera y filas con las columnas separadas por ` | `, la primera rellenada con espacios hasta el ancho de su celda más larga, sin espacios al final de línea; las vistas van separadas por una línea en blanco y salen en este orden, con estos títulos: `Ocupación por sala` (columnas `sala | reservas`), `Ocupación por día` (`día | reservas`), `Franjas más reservadas` (`franja | reservas`), `Salas sin reservas` (`sala`). Con la única reserva activa `Norte lun 10:00-12:00`, `informes` imprime exactamente:

```text
Ocupación por sala
sala  | reservas
Norte | 1
Sur   | 0

Ocupación por día
día | reservas
lun | 1

Franjas más reservadas
franja      | reservas
10:00-12:00 | 1

Salas sin reservas
sala
Sur
```

5. **Ocupación por sala** lista todas las salas, también las de 0, en el orden de `rooms` (`Norte`, `Sur`), salvo el caso vacío (decisión 9).
6. **Ocupación por día** lista solo los días con reservas, en orden de semana `lun, mar, mie, jue, vie, sab, dom`, con `mie` o `mié` y `sab` o `sáb` igual de válidos (se enseña el que venga en la reserva, porque hoy el programa solo usa `lun` y `mar`); un código de día desconocido va detrás, por orden alfabético.
7. **Franjas más reservadas** lista todas las franjas con reservas, de más a menos reservas y, a igual número, por franja ascendente; sin tope de filas.
8. **Salas sin reservas** lista las salas con 0 reservas activas (una sala con solo una reserva cancelada cuenta como sin reservas); si todas tienen, dice `ninguna`; salvo el caso vacío (decisión 9).
9. **`sin reservas`** se imprime en cada una de las cuatro vistas, con su título, cuando no queda ninguna reserva activa (tras aplicar `--sala`). Es la regla única del caso vacío y gana a las decisiones 5 y 8: en ese caso «Ocupación por sala» no lista las salas con 0 y «Salas sin reservas» no lista las salas, y las dos dicen `sin reservas`; con `--sala Norte` sin reservas activas pasa lo mismo.
10. **Sala desconocida**: `informes --sala Oeste` imprime `sala desconocida: Oeste` y ninguna vista.
11. **`--sala` sin nombre** imprime `falta el nombre de la sala` y ninguna vista.
12. **Mayúsculas**: el nombre de `--sala` se compara tal cual: `--sala norte` imprime `sala desconocida: norte`.
13. **`--sala` toma la palabra siguiente** como nombre; si no hay palabra o empieza por `--`, es `falta el nombre de la sala`; si se repite, manda la última.
14. **Contrato de datos y firmas**: las funciones leen de cada reserva `status === 'active'`, `room`, `day` y `slot`; se exportan `occupancyByRoom(bookings, rooms)`, `occupancyByDay(bookings)`, `topSlots(bookings)`, `roomsWithoutBookings(bookings, rooms)` e `informes(bookings, rooms, args)`, que devuelve el texto completo como cadena; `run('informes', params)` devuelve esa cadena y el `console.log` final del programa la imprime, como el resto de comandos.
15. **Reparto en tasks** (el dev-lead fijó 5, una por vista y una para `--sala`): la rama `informes` de `run`, el formato común y el caso vacío van en la Task 1 con «Ocupación por sala»; la entrada de `CHANGELOG.md`, en la Task 5.
16. **Enfoque**: funciones puras exportadas desde `src/app.js` (A), frente a un módulo nuevo `src/informes.js` (B) y a calcular dentro de `run` sobre los datos fijos (C) (ver Approach).
- Política de modelos: revisores de la spec — dominio sonnet y técnica sonnet, en paralelo · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Una opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy lo único que se puede mirar es `libres` para una franja concreta: no hay forma de saber qué salas, días o franjas se usan más ni qué sala no usa nadie. Se quiere un comando que lo cuente. Éxito: `informes` imprime las cuatro vistas con los números correctos y `--sala X` las restringe a esa sala. Anti-meta: un número que no cuadre con las reservas activas, o una vista vacía sin explicación.

## Scope

- Entra: comando `informes` con las cuatro vistas; opción `--sala`; el texto `sin reservas`; los avisos `sala desconocida: <nombre>` y `falta el nombre de la sala`; la rama `informes` en `run` de `src/app.js`; tests en `test/informes.test.js`; entrada en `CHANGELOG.md` (`[Unreleased]`, Added).
- No entra: porcentajes y horarios de apertura; filtros por día o franja; exportar a fichero o `.ics`; persistencia (las reservas siguen en memoria).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma: `run` solo gana la rama `informes` | `src/app.js` (`run`) | Scope |

- Filas que implementa: nada: comprobado con `git grep -n -i informes` (sin resultados); `ROADMAP.md` no tiene fila 0012.

## Approach

- A. Cuatro funciones puras exportadas desde `src/app.js` (`occupancyByRoom`, `occupancyByDay`, `topSlots`, `roomsWithoutBookings`) e `informes`, que las compone con `--sala` (firmas en la decisión 14). Cuesta: `app.js` crece unas ~70 líneas; cada vista se prueba con listas propias, también la vacía.
- B. Módulo nuevo `src/informes.js`. Cuesta: contradice «un solo fichero de entrada» de `architecture.md` sin necesitarlo.
- C. Calcular dentro de `run` sobre `bookings`. Cuesta: los datos reales son una sola reserva fija y no hay forma de probar el caso vacío ni el orden de franjas.
- Elegido: A — es la única que deja probar `sin reservas` y los desempates, y encaja con `cancelBooking` y `voidBooking`, que ya se exportan.

Las 5 tasks (una por vista y otra para el filtro) caen todas sobre `src/app.js` y `test/informes.test.js`: misma superficie y sin migración, por eso no se divide.

## Dónde se prueba

- Cada vista: `test/informes.test.js`, unitarios sobre la función pura con listas propias, como `test/cancel.test.js`; incluye la lista vacía.
- `run('informes', [])` y `run('informes', ['--sala', 'Norte'])`: un test por la entrada `run` con los datos reales (una reserva `Norte lun 10:00-12:00`).
- Texto y formato de la tabla: los mismos tests, comparando el texto completo.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN reservas activas `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00` y `Sur lun 14:00-16:00`
- WHEN se ejecuta `informes`
- THEN la vista `Ocupación por sala` muestra la fila `Norte | 2` y la fila `Sur | 1`
- AND una sala sin reservas activas aparece con `0`
- AND una reserva cancelada o anulada no cuenta

#### ADDED — Salida completa de informes

- GIVEN la única reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `informes`
- THEN las líneas son `Norte lun 10:00-12:00`, las líneas de `informes` son, en este orden y con una línea en blanco entre vistas: `Ocupación por sala`, `sala  | reservas`, `Norte | 1`, `Sur   | 0`; `Ocupación por día`, `día | reservas`, `lun | 1`; `Franjas más reservadas`, `franja      | reservas`, `10:00-12:00 | 1`; `Salas sin reservas`, `sala`, `Sur`

#### ADDED — Ocupación por día

- GIVEN reservas activas `Norte mar 10:00-12:00`, `Norte lun 10:00-12:00` y `Sur lun 14:00-16:00`
- WHEN se ejecuta `informes`
- THEN la vista `Ocupación por día` muestra `lun | 2` antes que `mar | 1`
- AND un día sin reservas no aparece
- AND con reservas en `sab`, `mie` y `dom`, y en un código desconocido `xyz`, el orden es `mie`, `sab`, `dom`, `xyz`; `mié` y `sáb` valen igual y se enseñan como llegan

#### ADDED — Franjas más reservadas

- GIVEN reservas activas `Norte lun 10:00-12:00`, `Sur mar 10:00-12:00` y `Sur lun 14:00-16:00`
- WHEN se ejecuta `informes`
- THEN la vista `Franjas más reservadas` muestra `10:00-12:00 | 2` antes que `14:00-16:00 | 1`
- AND con el mismo número de reservas, la franja menor va primero

#### ADDED — Salas sin reservas

- GIVEN las salas `Norte` y `Sur`, y una única reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `informes`
- THEN la vista `Salas sin reservas` muestra `Sur`
- AND si todas las salas tienen reservas activas dice `ninguna`
- AND con ninguna reserva activa dice `sin reservas`, no `Norte` y `Sur`
- AND una sala con solo una reserva cancelada aparece como sin reservas

#### ADDED — Informes sin reservas

- GIVEN ninguna reserva activa
- WHEN se ejecuta `informes`
- THEN la salida son los cuatro bloques `Ocupación por sala` + `sin reservas`, `Ocupación por día` + `sin reservas`, `Franjas más reservadas` + `sin reservas` y `Salas sin reservas` + `sin reservas`, cada título en su línea con `sin reservas` en la siguiente, y una línea en blanco entre bloques

#### ADDED — Filtrar los informes por sala

- GIVEN reservas activas `Norte lun 10:00-12:00` y `Sur mar 14:00-16:00`
- WHEN se ejecuta `informes --sala Norte`
- THEN las cuatro vistas cuentan solo las reservas de `Norte`: `Ocupación por día` muestra `lun | 1` y no muestra `mar`
- AND si `Norte` no tiene reservas activas, las cuatro vistas dicen `sin reservas`, con su título cada una, como en la salida completa de «Informes sin reservas»
- AND con `informes --sala Sur --sala Norte` manda la última: cuenta `Norte`

#### ADDED — Avisos de la opción sala

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `informes --sala Oeste` o `informes --sala norte`
- THEN imprime solo `sala desconocida: Oeste` o `sala desconocida: norte`, sin ninguna vista
- AND `informes --sala` sin nombre, o seguido de otra opción como `--sala --x`, imprime solo `falta el nombre de la sala`

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: memoria; las reservas (`bookings`) y las salas (`rooms`) de `src/app.js`
- **Idioma de los nombres**: castellano en títulos y mensajes (`Ocupación por sala`, `sin reservas`); el comando y la opción en castellano (`informes`, `--sala`)
- **Límites**: sin tope de filas en ninguna vista
- **Avisos**: `sala desconocida: <nombre>` y `falta el nombre de la sala`
- **Regla ante conflicto**: a igual número de reservas, el orden de `rooms` en salas, el orden de semana en días y la franja ascendente en franjas; un código de día desconocido va detrás, por orden alfabético; con `--sala` repetido manda la última

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
