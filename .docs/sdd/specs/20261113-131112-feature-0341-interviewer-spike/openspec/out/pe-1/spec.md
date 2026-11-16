---
id: 20261113-151534-feature-0010-exportar-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-13
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Con `salas exportar Norte` sale por pantalla un CSV con las reservas de esa sala de la semana que empieza el lunes que viene, por ejemplo `Norte;16/11/2026;lun;10:00-12:00`. Lo rediriges a un fichero (`> norte.csv`) y el responsable de la sala lo abre en su hoja de cálculo el lunes. Por dentro, cada reserva guarda solo el día de la semana (`lun`), así que el comando le pone la fecha que le toca en esa semana.

Validación: dev-lead — lo que sale es un fichero que una persona abre en su hoja de cálculo; solo un humano ve si las columnas y las fechas se leen bien.

## Capacidades

- Nuevas: `booking-export` — exportación de las reservas de una sala a un fichero que abre una hoja de cálculo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: **no se ha despachado ningún revisor**. La rúbrica de `review-spec.md` daría dos (señal: contrato público, el formato del CSV que consume una hoja de cálculo; tamaño ~25 líneas de código y ~15 de tests, en 2 ficheros), pero esta sesión no tiene herramienta para lanzar subagentes. En su lugar, la pasada de coherencia la hice yo (resultado abajo). Si quieres los dos revisores, dímelo y los lanzo antes de que apruebes.

- Dominio (sonnet): si «semana que empieza el lunes que viene» está bien resuelta cuando hoy es lunes o domingo (decisión 2) y qué ve el responsable si la sala no tiene reservas (decisión 7) (señal: contrato público)
- Técnica (sonnet): si `;` y `DD/MM/AAAA` abren bien en una hoja de cálculo en castellano y si añadir un parámetro `hoy` a `run` rompe a los tres tests actuales (decisiones 3, 4 y 9) (señal: contrato público)
- Mínimo razonable: un solo revisor técnico — deja sin mirar si la regla del lunes, la que más fácil se malinterpreta, hace lo que espera quien cuadra la semana

1. **Enfoque: A, frente a B y C** (ver Approach).
2. **«El lunes que viene» es siempre posterior a hoy**: si hoy es lunes 16/11/2026, la semana exportada empieza el 23/11/2026, no hoy. Si hoy es domingo 15/11/2026, empieza el 16/11/2026. — «que viene» lo leo como «el próximo», y hoy ya empezó.
3. **Separador `;`** y no `,`: en una hoja de cálculo en castellano la coma es el separador decimal, y un CSV con comas se abre entero en una sola columna. — es lo que Excel en castellano espera.
4. **Fecha como `DD/MM/AAAA`** (`16/11/2026`), no ISO. — es el formato que la hoja de cálculo en castellano reconoce como fecha.
5. **Columnas y su orden: `sala;fecha;dia;franja`**, con cabecera en castellano y `dia` sin tilde (con tilde, Excel necesita un BOM al principio del fichero y no quiero meterlo). — la constitución pide castellano en la interfaz.
6. **Orden de las filas: por fecha y, dentro del mismo día, por franja.** — así se lee la semana de arriba abajo.
7. **Sala sin reservas esa semana: solo la cabecera.** No es un error. — el responsable ve que no hay nada, en vez de un aviso que confunde con un fallo.
8. **Sala que no existe: `sala desconocida: Este`; sin indicar sala: `uso: exportar <sala>`.** Son textos de aviso que nadie dijo. — siguen el estilo corto de `cancelar` y `libres`.
9. **El comando escribe el CSV por pantalla** (stdout) y no crea el fichero él mismo: se redirige con `>`. `run` recibe un tercer parámetro opcional `hoy` (por defecto, la fecha de hoy) para poder probar el cálculo de la semana sin depender del reloj. — `run` ya devuelve el texto que `app.js` imprime.
10. **Las reservas semanales (`--cada-semana`) no se exportan**: hoy no se guardan, `reservar` solo contesta un texto. — no hay dato que exportar.
11. **Capacidad nueva `booking-export`** (nombre en inglés, el contenido va en castellano). — no hay carpeta `capabilities/` todavía; esta es la primera.
- Política de modelos: ningún revisor de spec despachado (ver arriba) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`
- Pasada de coherencia: hecha. `git grep -niE "0010|exportar|csv"` fuera de `.docs/sdd/specs/`: solo el 0009 (`ROADMAP.md:19`, «Exportar reservas a calendario (.ics)»), otra idea distinta que queda en Later sin tocar. Los tres tests actuales llaman a `run(cmd, params)` sin tercer parámetro; con `hoy` opcional siguen igual. Delta fusionado en una copia de `.docs/sdd` en una carpeta temporal con `sdd capability merge`: sin rechazos, 5 requisitos añadidos y las 5 reglas de la capacidad (`booking-export.md`); el `capabilities/` del repositorio no cambió.

### Decisiones tomadas con el dev-lead

- Solo las reservas de la semana que empieza el lunes que viene — «Solo las de la semana que empieza el lunes que viene. Lo demás, decide tú.»
- Todo lo demás lo decido yo (decisiones 2 a 11) — «Lo demás, decide tú.»

## Intent

El responsable de cada sala cuadra los lunes las reservas en su hoja de cálculo. Hoy no tiene de dónde sacarlas: `libres` solo dice qué salas están libres en una franja y no hay forma de listar las reservas de una sala.

Éxito: ejecutar `salas exportar Norte > norte.csv` el viernes 13/11/2026 y abrir `norte.csv` en una hoja de cálculo en castellano da una tabla de cuatro columnas, con las reservas de Norte del 16/11/2026 al 22/11/2026, cada una con su fecha. Fracasaría, aunque funcione, si el fichero se abre entero en una columna, o si las fechas salen como texto y no se pueden ordenar.

## Scope

- Entra: el comando `exportar <sala>` y su CSV de la semana siguiente; los avisos de sala desconocida y de falta de sala; la capacidad `booking-export`.
- No entra: elegir otra semana o un día (`--dia`, `--desde`); guardar el fichero desde el comando; las reservas semanales, que no se guardan; añadir fechas al modelo de reservas; exportar a calendario `.ics` (es la 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | `run(cmd, params)` solo gana un tercer parámetro opcional (decisión 9); los tres tests actuales siguen valiendo |

- Filas que implementa: nada: comprobado con `git grep -niE "0010|exportar|csv"`; el id 0010 está reservado sin fila en el roadmap.

## Approach

- **A. Una función pura `exportarCsv(sala, reservas, hoy)` en `src/app.js`, que `run` llama.** Cuesta unas 25 líneas en el fichero que ya existe y exportar una función más. Se prueba sola con reservas inventadas, sin tocar el array de `app.js`.
- **B. Un módulo nuevo `src/exportar.js`.** Aísla el código, pero para unas 25 líneas añade un fichero y un import; `app.js` sigue teniendo las reservas, así que habría que pasárselas.
- **C. Guardar la fecha real en cada reserva** (`day: 'lun'` pasa a `date: '2026-11-16'`). Es lo más fiel, pero cambia el modelo y obliga a tocar `libres`, `cancelar` y sus tests; es otra feature.
- Elegido: A — el modelo actual ya dice el día de la semana de cada reserva, y con eso basta para saber la fecha que le toca en la semana que viene; C no hace falta para esto.

Partes del cómo que fija A:

- La semana empieza en el primer lunes posterior a `hoy` y acaba en el domingo siguiente; la fecha de cada reserva es la de su `day` en esa semana (`lun` a `dom`: `lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`). La hora local manda, no la UTC.
- Cabecera `sala;fecha;dia;franja`, una fila por reserva, `\n` entre líneas.
- La parte que cambia el comportamiento va en una función aparte de `run`; `run` solo reparte (sala sin indicar, sala desconocida, exportar).

## Dónde se prueba

- Semana y columnas: llamando a `run('exportar', ['Norte'], fecha)` como los tests de `run` actuales; solo ve la reserva que ya hay en `app.js` (Norte, lun, 10:00-12:00).
- Orden por fecha y franja, varias reservas, fechas con hoy lunes o domingo: directamente sobre `exportarCsv` con reservas inventadas, porque el array de `app.js` solo tiene una.
- Avisos (`sala desconocida`, `uso`): por `run`, como el resto.
- El fichero abierto en una hoja de cálculo en castellano: lo valida el dev-lead a mano (ver Validación); un test no lo ve.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala de la semana siguiente

- GIVEN la sala Norte con una reserva el lunes de 10:00 a 12:00, y hoy es viernes 13/11/2026
- WHEN se ejecuta `salas exportar Norte`
- THEN sale por pantalla, en dos líneas: `sala;fecha;dia;franja` y `Norte;16/11/2026;lun;10:00-12:00`
- AND solo salen reservas de esa sala: la reserva de Sur del mismo lunes no aparece

#### ADDED — La semana exportada empieza el lunes posterior a hoy

- GIVEN la sala Norte con una reserva el lunes de 10:00 a 12:00
- WHEN hoy es lunes 16/11/2026
- THEN la fecha de la reserva es `23/11/2026`
- AND con hoy domingo 15/11/2026 es `16/11/2026`

#### ADDED — Las filas salen por fecha y franja

- GIVEN la sala Norte con reservas el miércoles de 09:00 a 10:00, el lunes de 14:00 a 15:00 y el lunes de 10:00 a 12:00, y hoy es viernes 13/11/2026
- WHEN se exporta Norte
- THEN las filas salen en este orden: `Norte;16/11/2026;lun;10:00-12:00`, `Norte;16/11/2026;lun;14:00-15:00`, `Norte;18/11/2026;mie;09:00-10:00`

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN sale solo `sala;fecha;dia;franja`

#### ADDED — Aviso si la sala no existe o falta

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `salas exportar Este`
- THEN sale `sala desconocida: Este` y ninguna cabecera
- AND `salas exportar` sin sala da `uso: exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: en memoria, en las reservas de `src/app.js`; el comando no escribe ningún fichero.
- **Idioma de los nombres**: castellano, sin tildes en la cabecera (`sala;fecha;dia;franja`).
- **Límites**: una sala y una semana (de lunes a domingo) por exportación.
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`.
- **Regla ante conflicto**: no aplica.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
