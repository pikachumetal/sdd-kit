---
id: 20261105-173631-feature-0012-informes
feature: 0012
title: Comando informes con cuatro vistas de ocupación
mode: full
profile: delegate
status: in-review
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando informes con cuatro vistas de ocupación

🦆 Hoy no hay forma de ver cómo se usan las salas. Con esta feature, `informes` enseña cuatro tablas de texto: reservas por sala, por día de la semana, por franja y qué salas nadie ha reservado. Por ejemplo, con tres reservas en Norte y ninguna en Sur, «Ocupación por sala» muestra `Norte  3` y «Salas sin reservas» muestra `Sur`. `informes --sala Norte` limita las cuatro tablas a esa sala. Por dentro son cuatro funciones puras en `src/app.js`, una por vista, y un despachador que `run` invoca.

Validación: dev-lead — es salida que lee una persona: el formato de las tablas solo lo valida quien la mira.

## Capacidades

- Nuevas: `reports` — las cuatro vistas del comando `informes` y su filtro `--sala`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`reports`) · tamaño: ~60 líneas en 3 ficheros (`src/app.js` y dos de test)
- Dominio y técnica (sonnet): si los THEN de «Franjas más reservadas» (orden y desempate), «Salas sin reservas» (`ninguna` / `sin reservas`) y «Sin reservas» no se contradicen entre sí (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar la tensión entre la regla «sin reservas» y la vista de salas sin reservar

1. Solo cuentan las reservas con estado `active`; las canceladas y anuladas no suman — la ocupación real no incluye lo que ya no existe. La capacidad depende de que cada reserva tenga `room`, `day`, `slot` y `status`, como hoy.
2. «Ocupación por sala» y «Ocupación por día» listan solo lo que tiene reservas, ordenado de más a menos reservas y, a igualdad, por el orden de `rooms` (Norte, Sur) o de la semana (`lun mar mie jue vie sab dom`, escritos sin acento, como se guardan hoy `lun`).
3. «Franjas más reservadas» lista todas las franjas con reservas, de más a menos y, a igualdad, por texto de la franja; sin tope de filas — el «más reservadas» lo da el orden. Una franja es la cadena exacta `HH:MM-HH:MM`: no se funden ni se solapan.
4. «Ocupación» es el número de reservas, no un porcentaje: no hay horario de apertura del que sacarlo.
5. Formato: título, cabecera y una fila por dato; cada columna mide lo que su celda más ancha y se separa de la siguiente con dos espacios; las cuatro vistas salen en el orden de la petición, separadas por una línea en blanco. Títulos: `Ocupación por sala`, `Ocupación por día de la semana`, `Franjas más reservadas`, `Salas sin reservas`; cabeceras: `sala`·`reservas`, `día`·`reservas`, `franja`·`reservas` y `sala`.
6. Sin reservas activas en el alcance (todo el sistema, o la sala filtrada), las cuatro vistas dicen `sin reservas`, también «Salas sin reservas», como pediste, aunque ahí habría podido listar las salas vacías.
7. «Salas sin reservas», con reservas pero todas las salas del alcance con alguna, dice `ninguna`. Si hay varias salas sin reservas, van en el orden de `rooms`.
8. `--sala Este` (no existe) responde `sala desconocida: Este` en lugar de las vistas, y prevalece sobre `sin reservas`; el nombre se compara exacto, distinguiendo mayúsculas (`norte` ≠ `Norte`). `--sala` sin nombre responde `falta el nombre de la sala`.
9. Todo sale como texto devuelto por `run` (stdout, sin código de error), igual que el resto de comandos; `run` y su respuesta por defecto (`salas`) no cambian.
10. Identificadores en inglés, como `freeRooms` y `cancelBooking`: `roomOccupancy`, `dayOccupancy`, `topSlots`, `unbookedRooms` y `report`.
11. Capacidad nueva `reports` (inglés, kebab-case): no existe ninguna en el proyecto.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — cabeceras con relleno fijo contradecían los ejemplos → la decisión 5 define el ancho por columna y los THEN son ejemplos de ella.
- **Aceptado** — grafía de `mié`/`sáb` frente a lo guardado → la decisión 2 usa `mie`/`sab` sin acento.
- **Aceptado** — `sin reservas` por sala filtrada vacía era una excepción a mano → escenario propio «Salas sin reservas, sin reservas en el alcance» y decisión 6.
- **Aceptado** — GIVEN relativos («las mismas reservas») → cada requisito lleva el suyo completo.
- **Aceptado** — Scope sin `ninguna`, `sala desconocida` ni la regla de `active` → añadidos a «Entra».
- **Aceptado** — mayúsculas, `--sala` sin valor, orden de salas, franja exacta y canal sin decidir → decisiones 3, 7, 8 y 9.
- **Aceptado** — dependencia de la forma de `bookings` y `run` sin declarar → decisiones 1 y 9.
- **Aceptado** — «Límites» y «Regla ante conflicto» → reglas de la capacidad corregidas.
- **Aceptado** — idioma de los identificadores → decisión 10.
- **Aceptado** — la evidencia del repaso de coherencia no era una decisión → pasa a la línea siguiente.

Repaso de coherencia: el delta probado sobre una copia de `.docs/sdd` con `sdd capability merge` se fusionó sin rechazos antes de la review; `git grep` no halla `informes` ni `0012` fuera de las specs.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Opción `--sala` que filtra las cuatro — «una opción --sala que filtra las cuatro»
- Salida en tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- Plan en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy solo se puede reservar, cancelar y anular, y ver qué salas están libres en una franja. No hay manera de saber cómo se usa el coworking: qué sala se llena, qué día, a qué hora, y cuál no se usa nunca. El dev-lead quiere esa lectura desde la línea de comandos, en cuatro vistas y con la posibilidad de mirar solo una sala. El éxito es que `informes` responda a esas cuatro preguntas en una tabla legible; fracasaría, aunque funcionase, si contase reservas canceladas como ocupación o si una sala vacía diera una tabla en blanco sin explicación.

## Scope

- Entra: el comando `informes` con las cuatro vistas; la opción `--sala <nombre>` que las filtra; solo cuentan las reservas `active`; los textos `sin reservas`, `ninguna`, `sala desconocida: <nombre>` y `falta el nombre de la sala`.
- No entra: porcentajes de ocupación, rango de fechas, otros formatos de salida (CSV, JSON), orden configurable, persistencia de datos (las reservas siguen en memoria), cambios en `run` fuera de añadir `informes`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0012 → ningún fichero la nombra: comprobado con `git grep -niE "informes?|0012" -- . ':!.docs/sdd/specs'`.

## Approach

Una función pura por vista en `src/app.js` (`roomOccupancy`, `dayOccupancy`, `topSlots`, `unbookedRooms`), cada una con `(bookings, rooms)` y devolviendo el texto de su tabla; `report(params)` aplica el filtro `--sala` a reservas y salas antes de llamar a las cuatro, y `run('informes', params)` lo invoca. Es el patrón de `freeRooms` y `cancelBooking`, y deja una task por vista más una para `--sala`.

## Dónde se prueba

- Cada vista, con reservas inyectadas: por la función pura exportada, en `test/informes.test.js`, como los tests actuales de `cancelBooking`.
- `--sala` y el comando: por `run('informes', [...])`, como `test/app.test.js`, con los datos del módulo (una reserva activa de Norte el lunes 10:00-12:00).

## Términos y ADR

- Términos resueltos: ocupación — número de reservas activas
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN salas Norte y Sur; reservas activas Norte lun 10:00-12:00, Norte lun 15:00-16:00, Norte mar 10:00-12:00 y Sur lun 10:00-12:00; una reserva cancelada de Sur mié 10:00-12:00
- WHEN se ejecuta `informes`
- THEN la vista dice, línea a línea: `Ocupación por sala` · `sala   reservas` · `Norte  3` · `Sur    1`

#### ADDED — Ocupación por día de la semana

- GIVEN las mismas reservas y salas que en «Ocupación por sala»: Norte lun 10:00-12:00, Norte lun 15:00-16:00, Norte mar 10:00-12:00, Sur lun 10:00-12:00 activas; Sur mié 10:00-12:00 cancelada
- WHEN se ejecuta `informes`
- THEN la vista dice, línea a línea: `Ocupación por día de la semana` · `día  reservas` · `lun  3` · `mar  1`

#### ADDED — Franjas más reservadas

- GIVEN las mismas reservas y salas que en «Ocupación por sala»
- WHEN se ejecuta `informes`
- THEN la vista dice, línea a línea: `Franjas más reservadas` · `franja       reservas` · `10:00-12:00  3` · `15:00-16:00  1`

#### ADDED — Salas sin reservas

- GIVEN salas Norte y Sur; solo Norte tiene reservas activas
- WHEN se ejecuta `informes`
- THEN la vista dice, línea a línea: `Salas sin reservas` · `sala` · `Sur`
- AND con reservas activas en Norte y en Sur, la vista dice `Salas sin reservas` y debajo `ninguna`

#### ADDED — Sin reservas en el alcance

- GIVEN salas Norte y Sur sin ninguna reserva activa (solo canceladas o anuladas, o ninguna)
- WHEN se ejecuta `informes`
- THEN cada vista conserva su título y debajo dice `sin reservas`: `Ocupación por sala` · `sin reservas`, y lo mismo bajo `Ocupación por día de la semana`, `Franjas más reservadas` y `Salas sin reservas`

#### ADDED — Filtrar por sala

- GIVEN salas Norte y Sur; reservas activas Norte lun 10:00-12:00, Norte lun 15:00-16:00, Norte mar 10:00-12:00 y Sur lun 10:00-12:00
- WHEN se ejecuta `informes --sala Sur`
- THEN las cuatro vistas cuentan solo la sala Sur: «Ocupación por sala» muestra `Sur  1`, «Ocupación por día de la semana» muestra `lun  1`, «Franjas más reservadas» muestra `10:00-12:00  1` y «Salas sin reservas» dice `ninguna`
- AND con las salas Norte y Sur y reservas activas solo en Norte, `informes --sala Sur` dice `sin reservas` en las cuatro vistas
- AND `informes --sala Este` responde `sala desconocida: Este`, y `informes --sala norte` responde `sala desconocida: norte`
- AND `informes --sala` sin nombre responde `falta el nombre de la sala`

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: en memoria, en el array `bookings` de `src/app.js`; solo cuentan las de estado `active`.
- **Idioma de los nombres**: castellano en títulos, cabeceras y avisos; los días tal cual se guardan.
- **Límites**: sin tope de filas ni de ancho de columna.
- **Avisos**: `sin reservas`, `ninguna`, `sala desconocida: <nombre>`, `falta el nombre de la sala`.
- **Regla ante conflicto**: `sala desconocida` y `falta el nombre de la sala` prevalecen sobre las vistas; `sin reservas` prevalece sobre `ninguna` y sobre la lista de salas vacías.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
