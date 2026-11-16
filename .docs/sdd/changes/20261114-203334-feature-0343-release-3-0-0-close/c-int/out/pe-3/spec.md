---
id: 20261114-223910-feature-0010-exportar-csv-reservas
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-14
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Con `salas exportar Norte` la terminal escribe el CSV de las reservas de Norte: una cabecera `Sala;Día;Franja` y una fila por reserva, p. ej. `Norte;lun;10:00-12:00`. Tú lo rediriges a un fichero y el responsable de la sala lo abre en Excel en castellano, que ya separa por `;`. Una sala sin reservas da solo la cabecera; una sala que no existe (`exportar Oeste`) da un error por stderr y no escribe nada, para que un nombre mal tecleado no parezca «no hay reservas». Por dentro, `app.js` pasa a poder fallar con código de salida 1 y el CSV empieza con una marca BOM para que Excel lea bien las tildes.

Validación: dev-lead — el CSV lo usa una persona en Excel; solo ella ve si las columnas y las tildes salen bien.

## Capacidades

- Nuevas: `bookings` — qué se puede hacer con las reservas de una sala; de momento, exportarlas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: la rúbrica pedía dos revisores (señales: capacidad nueva `bookings` y contrato público —el CSV lo consume Excel—; ~40 líneas en 3 ficheros: `src/app.js`, `test/app.test.js`, `README.md`), pero esta sesión no tiene herramienta para despachar subagentes. **No hubo revisores independientes**: pasé yo las dos lentes, con el mismo contexto con el que escribí la spec, así que su valor es menor.
- Dominio (yo): si un lunes el responsable obtiene en Excel lo que pide —cabecera, BOM, comillas, sala inexistente frente a sala sin reservas—.
- Técnica (yo): si `run` lanzando un `Error` y el `try/catch` de `app.js` bastan para stderr y código 1, y si cada escenario se puede probar con la costura de «Dónde se prueba».
- Mínimo razonable: solo técnica — deja sin mirar si el CSV es el que Excel en castellano abre bien; eso solo lo confirma abrirlo en Excel (validación del dev-lead).

Coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` → `bookings.md` creada con 5 requisitos y 5 reglas; `capability check` → «Capacidades válidas: 1». Nada que retirar: `git grep -n "0010\|exportar" -- ROADMAP.md README.md src test` sin resultados.

1. Capacidad nueva `bookings` (slug en inglés, sustantivo del dominio; la exportación es un requisito suyo, no una capacidad) — hoy no hay ninguna capacidad.
2. Nombre del comando: `exportar <sala>` — nadie lo nombró; sigue el castellano de `libres`, `reservar`, `cancelar` (constitución, art. IV).
3. Formato: separador `;` (dicho por el dev-lead), saltos de línea `\n` y un BOM UTF-8 (`U+FEFF`) al principio — Excel en castellano solo lee bien tildes como la de «Día» con BOM; `\n` porque `console.log` ya termina en `\n` y mezclar `\r\n` daría finales distintos.
4. Un campo que contenga `;`, `"` o un salto de línea va entre comillas dobles, con `"` duplicada — es la regla estándar de CSV; hoy ninguna sala ni franja la necesita, pero un nombre de sala nuevo con `;` rompería las columnas del lunes.
5. Orden de las filas: el de la lista de reservas — no hay otro criterio pedido; hoy es el orden de alta.
6. La sala se compara con el nombre exacto (`Norte`, no `norte`): sala que no existe → error — mantiene la regla de `libres`, que también compara literal.
7. Errores por `stderr` y código de salida 1, con estos literales: `sala desconocida: Oeste` (el nombre tecleado) y `uso: salas exportar <sala>` (sin sala). Lo pedido fue «error por stderr»; el texto y el `uso:` sin argumento los fijo yo.
8. Cómo falla `run`: `run('exportar', …)` lanza un `Error` con ese texto y `app.js` lo captura, lo escribe por `console.error` y pone `process.exitCode = 1`. El resto de comandos no cambia — es lo mínimo para el stderr que pidió el dev-lead.
9. Las reservas semanales (`reservar --cada-semana`) no entran: hoy solo devuelven un texto y no se guardan, no hay nada que exportar.
10. Enfoque: A (función `exportarReservas` en `src/app.js`) frente a B (un módulo `src/csv.js` aparte) y C (escribir el fichero desde el comando) — ver Approach.
11. Riesgo conocido, no resuelto: el `>` de Windows PowerShell 5 guarda en UTF-16 y Excel lo lee mal; PowerShell 7 y cmd guardan en UTF-8. Se documenta en el README, no se cambia el comando.
- Política de modelos: revisores de la spec: ninguno (sin herramienta de despacho en esta sesión; ver la review de arriba) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar

### Hallazgos de la review

- **Aceptado** — Importante · Delta «Los campos con separador se entrecomillan»: su GIVEN pide una sala `Aula; 2` que `run` no puede alcanzar, porque las salas son la constante `rooms` de `app.js` → el escenario pasa a probar la función `csvFila`, exportada, y «Dónde se prueba» lo dice.
- **Aceptado** — Menor · THEN de exportar: `console.log` añade un `\n` final a la salida → los dos THEN lo dicen.
- **Rechazado** — Menor · un campo que empiece por `=`, `+`, `-` o `@` podría ejecutarse como fórmula en Excel → salas, días y franjas salen de datos fijos del propio código, no de texto libre; si algún día la sala la teclea un usuario, se revisa entonces.

### Decisiones tomadas con el dev-lead

- Excel en castellano, separador `;` — «Abren el CSV con Excel, en castellano. Por eso el separador debe ser punto y coma.»
- Salida por stdout — «Por la salida estándar: que salga por pantalla y yo la rediriges a un fichero.»
- Columnas — «Sala, día y franja.»
- Sala sin reservas / sala inexistente — «una sala sin reservas sale solo con los encabezados `Sala;Día;Franja`, y una sala que no existe muestra un error por stderr y no escribe nada en el CSV. Me parece bien tocar `app.js` para eso»

## Intent

Hoy el responsable de cada sala no puede sacar sus reservas de `salas`; los lunes las cuadra en su hoja de cálculo. El éxito es que `salas exportar <sala> > fichero.csv` se abra en Excel en castellano con tres columnas bien separadas y las tildes correctas, sin pasos intermedios. Fracasaría, aunque funcionara, si una sala mal escrita diera un fichero que parece «sin reservas», o si Excel mostrara todo en una columna o `DÃ­a`.

## Scope

- Entra: el comando `exportar <sala>` con el CSV de las decisiones 3 y 4; el error por stderr con código 1 para sala desconocida y falta de sala; los tests de ambos; una nota en el README sobre cómo redirigir y el aviso de PowerShell 5.
- No entra: escribir ficheros desde el comando, otros filtros (día, rango), reservas semanales, cambiar el formato de la lista de reservas, otros comandos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La línea final `if (command) console.log(run(command, args))` pasa a capturar errores | `src/app.js:16` | Scope y decisión 8 |

- Filas que implementa: ninguna (la 0010 no tiene fila en `ROADMAP.md`; la 0009, exportar a `.ics`, es otra idea y no se toca) · comprobado con `git grep -n "0010\|exportar" -- ROADMAP.md README.md src test`.

## Approach

- A. Función `exportarReservas(sala)` en `src/app.js`, junto a `freeRooms`, llamada desde `run` — cero ficheros nuevos; se prueba con `run()` como los tests actuales; `app.js` crece unas 20 líneas.
- B. Módulo `src/csv.js` con el escapado de campos — separa el formato del comando, pero para tres columnas añade un fichero y un import (el proyecto tiene un solo fichero de entrada, `operations.md`).
- C. Escribir el fichero desde el comando — descartado por el dev-lead (sale por stdout).
- Elegido: A — es la costura más alta y la única que no añade ficheros; si el CSV crece, se extrae a B entonces.

`run('exportar', [sala])` devuelve `U+FEFF` + cabecera + filas unidas con `\n` (y `console.log` añade un `\n` final). Las filas las da `csvFila(sala, dia, franja)`, exportada para probar el escapado. `app.js` envuelve la llamada en `try/catch`: ante un `Error`, `console.error(error.message)` y `process.exitCode = 1`.

## Dónde se prueba

- Exportar una sala con reservas y una sin reservas: por `run('exportar', …)`, como los tests actuales de `test/app.test.js`.
- Escapado de campos: por `csvFila`, exportada, porque las salas son una constante y `run` no puede dar una con `;`.
- Sala desconocida y falta de sala: `run` lanza el `Error` con su texto, también por `run`.
- Stderr, código de salida 1 y stdout vacío: lanzando `node src/app.js exportar Oeste` como proceso hijo (`spawnSync` de `node:child_process`), porque es lo que `run` no ve.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con la reserva `lun 10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida estándar es `U+FEFF` + `Sala;Día;Franja\nNorte;lun;10:00-12:00` + un salto de línea final
- AND el código de salida es 0 y no se escribe nada por stderr

#### ADDED — Una sala sin reservas se exporta solo con la cabecera

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida estándar es `U+FEFF` + `Sala;Día;Franja` + un salto de línea final, sin filas
- AND el código de salida es 0

#### ADDED — Una sala que no existe no genera CSV

- GIVEN que no existe la sala `Oeste`
- WHEN se ejecuta `salas exportar Oeste`
- THEN stderr es `sala desconocida: Oeste`, la salida estándar queda vacía y el código de salida es 1

#### ADDED — Exportar sin indicar sala da el uso

- GIVEN cualquier estado de las reservas
- WHEN se ejecuta `salas exportar` sin sala
- THEN stderr es `uso: salas exportar <sala>`, la salida estándar queda vacía y el código de salida es 1

#### ADDED — Los campos con separador se entrecomillan

- GIVEN la sala `Aula; 2`, el día `mar` y la franja `09:00-10:00`
- WHEN se construye su fila con `csvFila`
- THEN la fila es `"Aula; 2";mar;09:00-10:00`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: la lista de reservas de `src/app.js` (en memoria); el CSV no se guarda, sale por la salida estándar
- **Idioma de los nombres**: castellano (cabecera `Sala;Día;Franja`, constitución art. IV)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: salas exportar <sala>`, por stderr
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
