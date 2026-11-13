---
id: 20261111-191002-feature-0012-informes
feature: 0012
title: Informes de ocupación
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación

🦆 Hasta ahora no hay forma de ver cómo se usan las salas. Con `informes` sale una tabla de texto con cuatro vistas: reservas por sala, por día de la semana, las franjas más reservadas y las salas que nadie ha reservado; con `--sala Norte`, las cuatro se limitan a esa sala. Por ejemplo, con 3 reservas en Norte y 2 en Sur, la primera vista dice «Norte | 3» y «Sur | 2». Solo cuentan las reservas vigentes, y si no hay ninguna cada vista dice «sin reservas». Se construye como una función que recibe la lista de reservas, para probarla con datos inventados.

Validación: dev-lead — el informe lo lee una persona en la terminal; el formato de la tabla se juzga a ojo.

## Capacidades

- Nuevas: `room-reports` — los informes de ocupación de las salas: sus cuatro vistas, el filtro por sala y el caso sin reservas.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-reports`) · tamaño: ~150 líneas en 3 ficheros (`src/app.js`, `test/informes.test.js`, la capacidad)
- Dominio (sonnet): si la regla «solo cuentan las reservas vigentes» (decisión 2) y el «sin reservas» de la vista de salas sin reservas (decisión 4) dan resultados coherentes en los escenarios de «Salas sin reservas» y «Sin reservas» (señal: capacidad nueva)
- Técnica (sonnet): si la función pura `informes(reservas, params)` encaja en un solo `src/app.js` sin dependencias (`architecture.md`) y si el orden de los argumentos de «Filtro por sala» es inequívoco (señal: capacidad nueva)
- Mínimo razonable: solo dominio — deja sin mirar el encaje técnico en el fichero único y el parseo de `--sala`

1. Capacidad nueva `room-reports` — el proyecto no tiene capacidades; los informes son un sustantivo del dominio que no encaja en otra.
2. Solo cuentan las reservas vigentes (`status: active`); las canceladas y las anuladas no entran en ninguna vista — un informe de ocupación mide lo que ocupa la sala, y una cancelada no la ocupa.
3. Qué filas sale en cada vista:
   - Ocupación por sala: una fila por sala del sistema (Norte, Sur), con 0 si no tiene reservas.
   - Ocupación por día: siete filas, `lun mar mié jue vie sáb dom` en ese orden, con 0 los días sin reservas.
   - Franjas más reservadas: solo las franjas con alguna reserva, de más a menos reservada y, a igual número, por franja en orden de cadena; sin tope de filas.
   - Salas sin reservas: de las salas dentro del filtro (todas, o la de `--sala`), las que tienen 0 reservas vigentes, en el orden del sistema. Con `--sala Norte` y reservas en Norte sale `ninguna`: Sur queda fuera del filtro.
4. Sin reservas: si, tras aplicar el filtro, no hay ninguna reserva vigente, cada una de las cuatro vistas imprime su título y debajo `sin reservas` (la salida del dev-lead aplicada literalmente), también «Salas sin reservas», que en ese caso no lista las salas. Si hay reservas y todas las salas las tienen, «Salas sin reservas» imprime `ninguna`.
5. Formato de la tabla de texto: una vista = su título, una línea de cabecera y una fila por dato; las columnas separadas por ` | ` y rellenadas con espacios a la derecha hasta el ancho de la celda más larga (la última columna sin relleno); las vistas, separadas por una línea en blanco. Cabeceras: `Sala | Reservas`, `Día | Reservas`, `Franja | Reservas`, `Sala`. Títulos: «Ocupación por sala», «Ocupación por día de la semana», «Franjas más reservadas», «Salas sin reservas».
6. `--sala <nombre>` puede ir en cualquier posición entre los argumentos; el nombre es exacto, con mayúscula inicial como en el resto de comandos (`Norte`, no `norte`). Con una sala, «Ocupación por sala» muestra solo esa fila.
7. Errores de `--sala`: `--sala` sin nombre → `falta el nombre de la sala`; una sala que no existe → `sala desconocida: Este`. Ninguno imprime vistas.
8. Contrato de la función: `informes(reservas, params)` recibe la lista de reservas (`{ room, day, slot, status }`, como en `app.js`; `status` vale `active`, `cancelled` o `voided`) y `params` como el array de argumentos que sigue al comando (`['--sala', 'Norte']`); devuelve siempre un string, también para los errores (no lanza); `run('informes', params)` lo devuelve y el comando lo imprime con `console.log`, como los demás. `cancelar` y `anular` ya conservan la reserva con otro `status`.
   Argumentos: el primer `--sala` manda y los argumentos que no conoce se ignoran; `--sala` sin nombre es el último argumento o va seguido de uno que empieza por `--`. Orden de las vistas: sala, día, franjas, salas sin reservas. Los días son los de los datos (`lun`, `mié`, con tilde); las franjas se ordenan como cadena, por código de unidad (con el formato `HH:MM-HH:MM` coincide con el orden alfabético y con el horario). Las salas son la constante `rooms` de `app.js`; una reserva de una sala que no está ahí, o con un día fuera de los siete, o con un `status` que no es `active`, se descarta antes de calcular nada (también antes de decidir si no hay reservas). Los días y los `status` son los de `app.js` (`lun`, `active`, `cancelled`, `voided`), comprobado leyéndolo.
9. Enfoque: función pura `informes(reservas, params)` exportada desde `src/app.js`, frente a un fichero `src/informes.js` aparte y a probarlo solo a través de las reservas en memoria (ver Approach).
10. Validación: `dev-lead` (cabecera), no `agente`: lo lee una persona.
11. Sin `§Frontend`: no hay pantalla, solo salida de terminal.
12. El `ROADMAP.md` no tiene fila 0012: la feature nace de esta petición, no de una fila. La limitación de que `reservar` no guarda reservas se acepta tal cual: la feature se verifica con listas inventadas y, si se quiere guardar reservas, es otra fila futura.
13. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade los 11 requisitos y las 5 reglas de `room-reports.md` sin rechazos; `capabilities/` del repo no cambia.
- Política de modelos: dos revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` (no fijado en `sdd-kit.json`) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Revisión técnica (sonnet):
- **Aceptado** (Crítico) — firma de `informes` y de `params` sin definir → decisión 8: array de argumentos, devuelve string, errores devueltos, `console.log` en el comando.
- **Aceptado** (Crítico) — «otro argumento delante» sin caso concreto → decisión 8 (se ignoran) y AND de «Filtro por sala» con `x --sala Norte`.
- **Aceptado** — `--sala` en medio y `norte` en minúscula sin escenario → «Errores de la opción --sala».
- **Aceptado** — THEN en prosa en día, salas sin reservas y sin reservas → bloques literales.
- **Aceptado** — nada prueba la salida entera → escenario «Informe completo».
- **Aceptado** — desempate sin GIVEN y orden de cadena → GIVEN y bloque en «Franjas más reservadas»; decisión 8.
- **Aceptado** — decisiones en el cuerpo fuera de la lista (orden de vistas, días, `console.log`) → decisión 8.
- **Aceptado** — forma de la reserva y `status` sin declarar → decisión 8 (comprobado en `app.js`: `cancelar` y `anular` cambian el `status`, no borran).
- **Aceptado** — origen de las salas y sala fuera de la lista → decisión 8 y «Límites».
Revisión de dominio (sonnet):
- **Aceptado** — «Salas sin reservas» frente al filtro → decisión 3: se calcula sobre las salas dentro del filtro.
- **Aceptado** — «Regla ante conflicto: no aplica» → regla: el error de `--sala` gana.
- **Rechazado** — renombrar `room-reports` por «room» en _Evitar_ → la regla 1 de `capability-template.md` manda un slug en inglés; es un nombre de fichero, no texto que lea la persona.
- **Aceptado** — idioma de los identificadores → «Idioma de los nombres».
- **Aceptado** — valores de `status` → decisión 8.
- **Aceptado** — empate sin GIVEN y «otro argumento» (repetidos con la técnica) → ya cubiertos arriba.
- **Aceptado** — límite de los datos en memoria → «Limitación conocida» en Scope y «Límites».
- **Aceptado** — Scope sin formato, `ninguna` ni orden → Scope.
- **Aceptado** — `norte` en minúscula → ya cubierto arriba.
- **Aceptado** — salas sin enumerar → «Límites».

Segunda ronda (sonnet, sin Críticos):
- **Aceptado** — WHEN de `--sala` sin la lista de reservas → `informes(reservas, ['--sala', 'Norte'])`.
- **Aceptado** — descartar salas desconocidas antes de decidir «sin reservas» → decisión 8.
- **Aceptado** — sin bloque con `Sur | 0` → escenario «Salas sin reservas en la ocupación por sala».
- **Aceptado** — el cableado de `run` sin requisito → escenario «Comando informes».
- **Aceptado** — limitación de datos como decisión → decisión 12 e Intent.
- **Aceptado** — THEN en prosa de «Solo cuentan las reservas vigentes» → bloques literales.
- **Aceptado** — día fuera de los siete, `status` desconocido, `--sala ''` y orden de cadena → decisión 8 y «Errores de la opción --sala».
- **Rechazado** — sacar la línea «Política de modelos» de ✋ → es la línea que fija la plantilla en `delegate`, y está dentro del bloque que el dev-lead aprueba.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «decidido con el dev-lead: un comando informes con cuatro vistas»
- Una opción `--sala` que filtra las cuatro vistas — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy el listado solo dice las salas (`salas`) y cuáles están libres en una franja (`libres`); no hay forma de saber cuánto se usa cada sala, qué días o a qué hora. Un informe de ocupación lo responde sin salir de la terminal. Éxito (medido sobre la función pura, con listas inventadas: con los datos de hoy casi no hay reservas): `informes` imprime las cuatro vistas con las cifras correctas de las reservas vigentes, y `informes --sala Norte` imprime las mismas vistas solo con Norte. Fracaso, aunque pase los tests: que una reserva cancelada o anulada cuente como ocupación, o que una vista vacía salga en blanco en lugar de decir «sin reservas».

## Scope

- Entra: el comando `informes` con las cuatro vistas, su formato de tabla y el orden de sus filas; la opción `--sala`; los textos `sin reservas` y `ninguna`; los dos avisos de error de `--sala`.
- Limitación conocida: el informe mide las reservas en memoria, y hoy `reservar` no guarda ninguna; con los datos de hoy el comando real casi siempre dirá una sola reserva o `sin reservas`.
- No entra: otros formatos de salida (CSV, JSON); filtrar por día o por franja; rangos de fechas; reservas nuevas o cambios en cancelar, anular y libres; que `reservar` guarde reservas (hoy no las guarda).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | `run` solo gana la rama `informes`; la respuesta por defecto `salas` no cambia |

- Filas que implementa: nada: comprobado con `git grep -niE "informe|0012" -- . ':!.docs/sdd/specs'` (sin resultados)

## Approach

- A. Función pura `informes(reservas, params)` exportada desde `src/app.js` (además de `run`, que le pasa las reservas en memoria) — se prueba con listas inventadas, sin tocar el estado del módulo; mantiene el fichero único de `architecture.md`; `app.js` crece unas 60 líneas.
- B. Un fichero `src/informes.js` aparte — separa mejor, pero `architecture.md` fija un solo fichero de entrada y un segundo módulo para ~60 líneas no se gana el coste.
- C. Probarlo solo con `run` y las reservas en memoria — no hace falta exportar nada más, pero hoy hay una sola reserva (`Norte lun 10:00-12:00`) y `reservar` no guarda: no se pueden probar la franja más reservada ni el orden.
- Elegido: A — es la única costura que permite datos distintos sin cambiar el estado compartido, y mantiene la estructura actual.

Partes del cómo que fija A: cada vista es una función pequeña que devuelve su texto (título + tabla o `sin reservas`); `informes` filtra por `status === 'active'` y, si hay `--sala`, por sala; si el resultado está vacío, imprime las cuatro vistas con `sin reservas`; si no, imprime cada una. El estado en memoria sigue siendo el de `app.js`.

## Dónde se prueba

- Las cuatro vistas, el filtro, «sin reservas» y los errores de `--sala`: llamando a `informes(reservas, params)` con listas inventadas, en `test/informes.test.js`, con el estilo de `test/cancel.test.js` (`assert.equal` sobre el texto exacto).
- El comando: una prueba de `run('informes', [])` con las reservas en memoria, para el cableado; con la reserva actual (`Norte lun 10:00-12:00`) y otra tras cancelarla con `cancelBooking('Norte', 'lun')`, que da «sin reservas».

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-reports`

#### ADDED — Ocupación por sala

- GIVEN reservas vigentes: Norte lun 10:00-12:00, Norte lun 14:00-16:00, Norte mié 10:00-12:00, Sur lun 10:00-12:00, Sur mar 10:00-12:00, y una cancelada Norte vie 10:00-12:00
- WHEN `informes`
- THEN la vista «Ocupación por sala» sale como:
  ```
  Ocupación por sala
  Sala  | Reservas
  Norte | 3
  Sur   | 2
  ```

#### ADDED — Ocupación por día de la semana

- GIVEN las mismas reservas
- WHEN `informes`
- THEN la vista «Ocupación por día de la semana» sale como:
  ```
  Ocupación por día de la semana
  Día | Reservas
  lun | 3
  mar | 1
  mié | 1
  jue | 0
  vie | 0
  sáb | 0
  dom | 0
  ```

#### ADDED — Franjas más reservadas

- GIVEN las mismas reservas
- WHEN `informes`
- THEN la vista «Franjas más reservadas» sale como:
  ```
  Franjas más reservadas
  Franja      | Reservas
  10:00-12:00 | 4
  14:00-16:00 | 1
  ```
- AND con reservas vigentes `Norte lun 10:00-12:00`, `Sur mar 10:00-12:00`, `Norte mié 09:00-10:00` y `Sur jue 09:00-10:00`, las dos franjas empatan a 2 y sale primero `09:00-10:00` (orden de cadena) y después `10:00-12:00`:
  ```
  Franjas más reservadas
  Franja      | Reservas
  09:00-10:00 | 2
  10:00-12:00 | 2
  ```

#### ADDED — Salas sin reservas

- GIVEN solo reservas vigentes de Norte
- WHEN `informes`
- THEN la vista «Salas sin reservas» sale como:
  ```
  Salas sin reservas
  Sala
  Sur
  ```
- AND si Norte y Sur tienen reservas vigentes, la vista sale como:
  ```
  Salas sin reservas
  ninguna
  ```

#### ADDED — Salas sin reservas en la ocupación por sala

- GIVEN solo la reserva vigente Norte lun 10:00-12:00
- WHEN `informes(reservas, [])`
- THEN «Ocupación por sala» incluye las dos salas, la que no tiene reservas con 0:
  ```
  Ocupación por sala
  Sala  | Reservas
  Norte | 1
  Sur   | 0
  ```

#### ADDED — Solo cuentan las reservas vigentes

- GIVEN Norte tiene una reserva vigente (lun 10:00-12:00), una cancelada (mar 10:00-12:00) y una anulada (mié 10:00-12:00)
- WHEN `informes`
- THEN «Ocupación por sala» y «Ocupación por día de la semana» salen como:
  ```
  Ocupación por sala
  Sala  | Reservas
  Norte | 1
  Sur   | 0

  Ocupación por día de la semana
  Día | Reservas
  lun | 1
  mar | 0
  mié | 0
  jue | 0
  vie | 0
  sáb | 0
  dom | 0
  ```

#### ADDED — Informes sin reservas

- GIVEN ninguna reserva vigente
- WHEN `informes`
- THEN la salida entera es:
  ```
  Ocupación por sala
  sin reservas

  Ocupación por día de la semana
  sin reservas

  Franjas más reservadas
  sin reservas

  Salas sin reservas
  sin reservas
  ```
- AND «Salas sin reservas» dice `sin reservas`, no lista las salas; en estas vistas no hay cabecera de columnas

#### ADDED — Informe completo

- GIVEN las reservas de «Ocupación por sala»
- WHEN `informes`
- THEN la salida es el texto de las vistas, en el orden sala, día, franjas, salas sin reservas, separadas por una línea en blanco y sin salto de línea final (lo añade el `console.log` del comando):
  ```
  Ocupación por sala
  Sala  | Reservas
  Norte | 3
  Sur   | 2

  Ocupación por día de la semana
  Día | Reservas
  lun | 3
  mar | 1
  mié | 1
  jue | 0
  vie | 0
  sáb | 0
  dom | 0

  Franjas más reservadas
  Franja      | Reservas
  10:00-12:00 | 4
  14:00-16:00 | 1

  Salas sin reservas
  ninguna
  ```

#### ADDED — Comando informes

- GIVEN las reservas en memoria de `app.js` al arrancar (solo Norte lun 10:00-12:00 vigente)
- WHEN `run('informes', [])`
- THEN devuelve el mismo texto que `informes(reservas, [])` con esa reserva: «Ocupación por sala» con `Norte | 1` y `Sur   | 0`, `lun | 1` en la de días, `10:00-12:00 | 1` en franjas y en «Salas sin reservas» la fila `Sur`
- AND tras `cancelBooking('Norte', 'lun')` (que deja la reserva con `status: cancelled`), `run('informes', [])` devuelve el texto de «Informes sin reservas»

#### ADDED — Filtro por sala

- GIVEN las reservas de «Ocupación por sala»
- WHEN `informes(reservas, ['--sala', 'Norte'])`
- THEN la salida es:
  ```
  Ocupación por sala
  Sala  | Reservas
  Norte | 3

  Ocupación por día de la semana
  Día | Reservas
  lun | 2
  mar | 0
  mié | 1
  jue | 0
  vie | 0
  sáb | 0
  dom | 0

  Franjas más reservadas
  Franja      | Reservas
  10:00-12:00 | 2
  14:00-16:00 | 1

  Salas sin reservas
  ninguna
  ```
- AND con solo reservas vigentes de Norte, `--sala Sur` da las cuatro vistas con `sin reservas`, como en «Informes sin reservas»
- AND `--sala` vale en cualquier posición y los demás argumentos se ignoran: `x --sala Norte` y `--sala Norte x` dan la misma salida que `--sala Norte`

#### ADDED — Errores de la opción --sala

- GIVEN cualquier reserva
- WHEN `--sala` es el último argumento, o va seguido de otro que empieza por `--` (`--sala`, `--sala --x`)
- THEN la salida es solo `falta el nombre de la sala`
- AND `--sala ''` (cadena vacía) también da `falta el nombre de la sala`
- AND con `--sala Este` la salida es solo `sala desconocida: Este`, y con `--sala norte` (minúscula) es `sala desconocida: norte`; ninguno de los tres imprime vistas

#### Reglas de la capacidad — room-reports

- **Dónde viven los datos**: reservas en memoria de `src/app.js`
- **Idioma de los nombres**: castellano en lo que lee la persona (títulos, cabeceras, avisos y la opción `--sala`); los identificadores del código siguen en inglés como los de `app.js` (`informes` es el comando, `status: active` el valor ya existente)
- **Límites**: sin tope de filas; siete días fijos; las salas del sistema son las de `rooms` en `app.js` (Norte, Sur, en ese orden); una sala nueva cambia las filas con 0; el informe mide solo las reservas en memoria
- **Avisos**: `sin reservas`, `ninguna`, `falta el nombre de la sala`, `sala desconocida: <nombre>`
- **Regla ante conflicto**: primero se valida `--sala` y su error gana sobre todo lo demás (sin vistas); después se filtra por sala y por reservas vigentes

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
