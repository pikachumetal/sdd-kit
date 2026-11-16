---
id: 20261113-152915-feature-0010-exportar-reservas-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala a una hoja de cálculo. Con esto, `node src/app.js exportar Norte > norte.csv` deja un fichero que Excel en castellano abre con una fila por reserva y tres columnas: `Norte;lun;10:00-12:00`. El comando imprime el CSV por la salida estándar, con `;` como separador y una marca BOM al principio para que Excel respete la codificación. Si la sala no existe, avisa por la salida de error y no escribe nada en el CSV. Por dentro es una función pura que construye el texto a partir de las reservas, y `run()` la llama con las reservas en memoria.

Validación: dev-lead — el resultado lo abre una persona en Excel en castellano y solo ella ve si las columnas salen bien.

## Capacidades

- Nuevas: `bookings` — reservas de las salas; de momento, solo su exportación a CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el CSV lo consume Excel), capacidad nueva (`bookings`) · tamaño: ~70 líneas en 2 ficheros
- Dominio (sonnet): si el CSV de «Exportar a CSV las reservas de una sala» sirve para cuadrar las reservas cada lunes (columnas `sala;dia;franja`, una fila por reserva, sin columna de fecha) (señal: contrato público)
- Técnica (sonnet): si el BOM y el `\n` final que añade `console.log` dan un fichero que Excel abre sin línea en blanco, y si el error por `stderr` con código 1 se puede probar desde `node --test` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas sirven para el uso del lunes
- **Estado de la review: no se ha despachado.** Esta sesión no tiene herramienta de subagentes. Hice yo una lectura adversarial con los 7 puntos; no sustituye a los dos revisores.

1. Capacidad nueva `bookings` (slug en inglés, kebab-case): `capabilities/` no existe y el comportamiento de las reservas aún no está documentado. Solo recoge este requisito; no vuelco `libres`, `reservar` ni `cancelar`.
2. Nombre del comando: `exportar <sala>`, en castellano como `libres`, `reservar` y `cancelar` (constitución, punto 4).
3. Columnas y cabecera: `sala;dia;franja`, como los campos de cada reserva (`room`, `day`, `slot`). Sin tilde en `dia`, para que la cabecera sea ASCII. No hay columna de fecha porque las reservas no la tienen.
4. BOM UTF-8 (`﻿`) al principio de la salida, para que Excel en castellano lea bien la codificación. Es mi decisión; la tuya fue el `;`.
5. Saltos de línea `\n`, sin `\r\n`, y sin salto final propio: el que cierra el fichero es el de `console.log`, igual que en el resto de comandos. Evita una línea en blanco al final.
6. Orden de las filas: el de la lista `bookings`, sin ordenar por día ni franja.
7. Nombre de sala exacto y sensible a mayúsculas (`Norte`, no `norte`), como el resto de comandos, que comparan con `===`.
8. Sala sin reservas: sale solo la cabecera.
9. Sala desconocida o sin argumento: mensaje por `stderr` y código de salida 1, sin nada en la salida estándar. Si el mensaje fuera por la salida estándar, acabaría dentro del CSV al redirigir. Textos literales: `sala desconocida: Oeste` y `uso: exportar <sala>`.
10. Para ello, `run()` lanza un `Error` en esos dos casos y la entrada (`src/app.js`) lo captura, lo imprime con `console.error` y pone `process.exitCode = 1`. Afecta a todos los comandos, pero hoy ninguno otro lanza.
11. Enfoque: función pura `reservasCsv(sala, lista)` exportada, frente a las otras dos vías (ver Approach).
12. Sin escapado de `;`, comillas ni saltos de línea dentro de un campo: las salas son `Norte` y `Sur` y las franjas tienen la forma `HH:MM-HH:MM`.
- Delta probado en una copia de `.docs/sdd` fuera del repo con `sdd capability merge`: sale 0 y crea `bookings.md` con el requisito «Exportar a CSV las reservas de una sala» y las cinco reglas; el repo no cambia.
- Política de modelos: revisores de la spec — ninguno despachado (sin herramienta de subagentes) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Separador `;`, porque la hoja es Excel en castellano — «Excel en castellano, así que quiero punto y coma (`;`).»
- Salida por la salida estándar, y redirige el usuario — «Por pantalla, por la salida estándar; yo lo redirijo a un fichero.»

## Intent

El responsable de cada sala cuadra sus reservas cada lunes en una hoja de cálculo, y hoy tiene que copiarlas a mano. Con el comando lo hace con una redirección, `node src/app.js exportar Norte > norte.csv`, y doble clic en Excel. El éxito es que, sin tocar nada, el fichero se abra en columnas separadas y con la codificación bien. Fallaría, aunque el código funcione, si todo apareciera en una sola columna o si hubiera un mensaje de error dentro del CSV.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js`, la función exportada `reservasCsv`, el manejo de errores en la entrada y sus tests en `test/app.test.js`.
- No entra: escribir a un fichero (`--salida`), separador configurable, exportar todas las salas a la vez, filtrar por día, escapar campos, ordenar, y la exportación a calendario `.ics` (fila 0009 del roadmap, otra feature).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La línea de entrada `if (command) console.log(run(command, args));` pasa a un `try/catch` | `src/app.js:16` | Scope y decisión 10 |

- Filas que implementa: nada: la 0010 no tiene fila en el roadmap, y la fila 0009 menciona «exportar» pero es el `.ics` y queda fuera (No entra) | comprobado con `git grep -n -iE "csv|exportar"`: solo aparece en la fila 0009 de `ROADMAP.md`

## Approach

- A. Construir el CSV dentro de `run()` leyendo `bookings` del módulo — es lo más corto, pero con los datos reales (una sola reserva en `Norte`) no se puede probar el orden ni que se filtre por sala.
- B. Función pura `reservasCsv(sala, lista)` exportada desde `src/app.js`, y `run('exportar', …)` la llama con `bookings` — se prueba con listas inventadas (0, 1 y varias reservas, de varias salas) sin cambiar los datos del módulo, y sigue en un solo fichero.
- C. Módulo nuevo `src/csv.js` con la función — se prueba igual que B, pero añade un fichero para ~10 líneas, y `operations.md` habla de un único fichero de entrada.
- Elegido: B — es lo único que deja probar orden, filtro y sala vacía sin tocar `bookings`, y no crea ficheros.

`reservasCsv(sala, lista)` devuelve `'﻿' + ['sala;dia;franja', ...filas].join('\n')`, con una fila `sala;dia;franja` por cada elemento de `lista` cuya `room` sea `sala`. `run('exportar', params)` lanza `Error('uso: exportar <sala>')` si no hay `params[0]`, `Error('sala desconocida: <sala>')` si no está en `rooms`, y si no, devuelve `reservasCsv(params[0], bookings)`.

## Dónde se prueba

- Contenido del CSV (cabecera, filas, filtro, orden, sala vacía, BOM): llamando a `reservasCsv` con listas inventadas, como los tests actuales llaman a `run()` en `test/app.test.js`.
- `exportar Norte` con los datos reales: por `run('exportar', ['Norte'])`, como los tests actuales.
- Errores, `stderr` y código de salida 1: ejecutando `node src/app.js exportar Oeste` como proceso hijo desde un test (`spawnSync`), porque es la única vía que ve `stderr` y el código.
- Que Excel en castellano lo abra en tres columnas y sin caracteres raros: lo valida el dev-lead a mano.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala Norte tiene una reserva el lun de 10:00-12:00
- WHEN se ejecuta `exportar Norte`
- THEN la salida estándar es `﻿sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`, cada una terminada en salto de línea
- AND no se escribe nada en la salida de error

- GIVEN la sala Norte tiene el lun 10:00-12:00 y el mar 14:00-16:00, y la sala Sur el mié 09:00-10:00
- WHEN se exporta la sala Norte
- THEN salen la cabecera y dos filas, `Norte;lun;10:00-12:00` y `Norte;mar;14:00-16:00`, en ese orden, sin la fila de Sur

- GIVEN la sala Sur no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `﻿sala;dia;franja`

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN la salida de error es `sala desconocida: Oeste`, la salida estándar queda vacía y el código de salida es 1

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin sala
- THEN la salida de error es `uso: exportar <sala>`, la salida estándar queda vacía y el código de salida es 1

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, en `bookings` de `src/app.js`; la exportación va a la salida estándar
- **Idioma de los nombres**: castellano (cabecera `sala;dia;franja` y mensajes de error), según el punto 4 de la constitución
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`, por la salida de error
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
