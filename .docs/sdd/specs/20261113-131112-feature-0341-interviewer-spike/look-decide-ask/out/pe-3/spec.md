---
id: 20261113-154121-feature-0010-exportar-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala para cuadrarlas en una hoja de cálculo. Con esto, `node src/app.js exportar Norte > norte.csv` imprime las reservas de la sala `Norte` y el fichero se abre en Excel, con la configuración en castellano, ya repartido en columnas: `Norte;lun;10:00-12:00` pasa a ser la sala, el día y la franja en tres celdas. Si la sala no existe, no se imprime ningún CSV y el comando falla con un aviso por el canal de errores, para no guardar el aviso dentro del fichero.

Validación: dev-lead — el CSV lo abre una persona en Excel y solo ella ve si las columnas y las tildes salen bien.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a un formato que abre la hoja de cálculo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (dominio y técnica, sonnet) — señales: contrato público (el CSV es un formato de fichero que consume Excel), capacidad nueva (`booking-export`) · tamaño: ~45 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (sonnet): si los THEN de `exportar Norte` y `exportar Sur` cuadran con lo que el responsable necesita el lunes (señal: capacidad nueva)
- Técnica (sonnet): si el BOM, el `;` y el entrecomillado de la decisión 9 abren bien en Excel en castellano, y si el código 1 con el aviso por el canal de errores se prueba con un solo test que arranca el proceso (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el listado responde a lo que necesita quien cuadra las reservas
- **No se despachó ninguno: esta sesión no tiene herramienta para lanzar subagentes.** Lo que hay es una autorrevisión de los siete puntos por quien escribió la spec, que no es independiente; si quieres la review con revisores, hay que lanzarla desde una sesión que pueda.

1. Capacidad nueva `booking-export` (slug en inglés, kebab-case) — es un sustantivo del dominio distinto de la reserva y de la cancelación, y no existe ninguna en `capabilities/`.
2. Nombre del comando: `exportar <sala>` — va con `libres`, `reservar` y `cancelar`, todos verbos en castellano.
3. Cabecera `sala;dia;franja` — son los nombres de los campos de la reserva (`room`, `day`, `slot`) en castellano y sin tilde, para que las columnas no cambien si se cambia la configuración de Excel.
4. Separador `;`, codificación UTF-8 con BOM al principio y saltos de línea `\n` — con Excel en castellano `;` reparte las columnas y el BOM hace que lea bien las tildes; Excel acepta `\n`.
5. Orden de las filas: el orden en que están guardadas las reservas — no hay otro orden que el usuario haya pedido y los días son `lun`, `mar`… sin fecha.
6. Una sala sin reservas exporta solo la cabecera — así quien cuadra ve la hoja vacía y no un error.
7. El nombre de la sala se compara tal cual está en la lista (`Norte`, `Sur`), distinguiendo mayúsculas — es como la tabla de salas lo guarda; no hay tolerancia a `norte`.
8. Sala desconocida (`Oeste`) o sin sala: no se imprime nada por la salida estándar, el aviso va por el canal de errores y el proceso termina con código 1 — con la salida redirigida, el aviso no acaba dentro de `norte.csv`. Textos: `sala desconocida: Oeste` y `falta la sala: uso exportar <sala>`.
9. Entrecomillado de campos: un campo que contenga `;`, `"` o un salto de línea va entre comillas dobles y con las comillas internas duplicadas — la franja no se valida hoy (deuda «Sin validación del formato de franja») y un `;` dentro desplazaría las columnas.
10. Enfoque: dos funciones en `src/app.js` (`toCsv` pura y su uso en `run`), frente a un módulo `src/csv.js` y frente a imprimir sin BOM (ver Approach).
11. Cuántas tasks: 2 (el CSV y el error de la sala desconocida).
12. Sin fila en el roadmap: el id 0010 se reservó con `sdd id next --reserve` al no tener fila; no he añadido ninguna al roadmap (eso es de `sdd-roadmap`).
13. Política de modelos: revisores de la spec ninguno (sin herramienta de subagentes en esta sesión; la rúbrica pedía dos en sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.
14. Resultado de `sdd capability merge` sobre una copia de `.docs/sdd`: sin errores, `booking-export.md` creada con sus 4 requisitos y las 5 reglas (el aviso de longitud de un requisito, 595 caracteres, se resolvió separando el orden de las filas en un requisito propio).

### Hallazgos de la review

Autorrevisión, no independiente (ver arriba):

- **Aceptado** — el `console.log` del arranque añade un salto de línea final que la salida de `run` no lleva, y la spec no lo decía → dicho en Approach («sin salto final; `console.log` añade el suyo»).
- **Aceptado** — con `mode: full` y sin fila en el roadmap, el id 0010 no tiene fila → anotado en la decisión 12.
- **Rechazado** — los escenarios citan `toCsv`, un nombre de implementación → se queda: la lista de reservas de `run` no se puede inyectar y sin esa función el entrecomillado no se prueba; el motivo está en «Dónde se prueba».

### Decisiones tomadas con el dev-lead

- Quien cuadra las reservas las abre en Excel con la configuración en castellano — «Excel, con la configuración en castellano.»
- La salida es la salida estándar y el usuario la redirige a un fichero — «Quiero la opción 2️⃣: que imprima por la salida estándar. Yo lo redirijo a un fichero.»
- El motivo: el responsable de cada sala cuadra las reservas los lunes en su hoja de cálculo — «el responsable de cada sala las cuadra los lunes en su hoja de cálculo».

## Intent

Hoy `salas` no saca las reservas de una sala en ningún formato que se pueda llevar a una hoja de cálculo. El responsable de cada sala las cuadra los lunes en Excel, con la configuración en castellano. Se quiere un comando que imprima las reservas de una sala en CSV y que Excel lo abra repartido en columnas y con las tildes bien, redirigiéndolo a un fichero. Es un fracaso aunque funcione si el fichero se abre en Excel con todo en una sola celda, o con las tildes rotas, o si un aviso de error acaba dentro del CSV.

## Scope

- Entra: el comando `exportar <sala>`, que imprime por la salida estándar las reservas de esa sala en CSV; el aviso de sala desconocida o ausente por el canal de errores con código de salida 1; los tests.
- No entra: escribir el fichero desde el comando (lo decidió el dev-lead); filtrar por día o por semana (la reserva no tiene fecha); exportar todas las salas a la vez; escapar fórmulas que Excel pudiera interpretar (`=…`); el formato `.ics` (es la fila 0009 de Later, otra cosa).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma: `run` conserva `libres`, `reservar --cada-semana`, `cancelar` y la salida `salas` | `src/app.js:9-14` | Scope: `exportar` es un comando nuevo |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|0010"`, que solo encuentra la fila 0009 (`.ics`) de Later, distinta.

## Approach

- A. Dos funciones en `src/app.js`: `toCsv(room, list)` pura, y `run('exportar', …)` que la usa — unas 15 líneas; se prueba sola con datos y por `run`.
- B. Módulo nuevo `src/csv.js` — un fichero más para una función; `operations.md` fija un solo fichero de entrada pero no prohíbe módulos; la fila 0008 (`src/correo.js`) apunta a que el proyecto los usa cuando la pieza lo pide, y esta es demasiado pequeña.
- C. Imprimir sin BOM — lo descarta el dev-lead al elegir la salida estándar, pero el BOM se mantiene porque no cambia la salida redirigida desde bash y Excel lo necesita para las tildes.
- Elegido: A — la pieza es pequeña y se prueba sin entrar en la costura del proceso.

El BOM es el carácter `﻿` al principio de la salida. La salida de `run('exportar', ['Norte'])` es el texto completo con la cabecera y las filas separadas por `\n`, sin salto final; `console.log` añade el suyo. La sala desconocida o ausente lanza un `Error` desde `run`; el arranque de `src/app.js` lo captura, imprime `error.message` por el canal de errores y deja `process.exitCode = 1`.

Aviso, redirigir con `>` en PowerShell 5.1 recodifica el fichero a UTF-16 y estropea el BOM; el usuario lo ha elegido redirigir y lo sabe de la entrevista, y no se cambia.

## Dónde se prueba

- Contenido del CSV (cabecera, filas, sala vacía, orden): por `run('exportar', [...])`, como los tests actuales de `app.test.js`.
- Entrecomillado: por `toCsv(room, list)` con una lista inyectada, porque la lista de reservas de `run` no se puede cambiar desde fuera.
- Sala desconocida o ausente: por `run`, que lanza el `Error` con su texto; el canal de errores y el código 1, con un único test que arranca `node src/app.js exportar Oeste` y comprueba la salida estándar vacía, el error y el código.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN las reservas `Norte · lun · 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida estándar es `﻿sala;dia;franja` seguido de un salto de línea y `Norte;lun;10:00-12:00`
- AND una reserva de otra sala no sale en la salida

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida estándar es solo `﻿sala;dia;franja`

#### ADDED — Las filas salen en el orden de las reservas

- GIVEN las reservas de `Norte`: `lun · 10:00-12:00` y `mar · 09:00-10:00`, guardadas en ese orden
- WHEN se llama a `toCsv('Norte', lista)`
- THEN las filas salen en ese orden: `Norte;lun;10:00-12:00` y después `Norte;mar;09:00-10:00`

#### ADDED — Campos con separador o comillas entre comillas

- GIVEN una reserva de `Norte` con franja `10:00;12:00`
- WHEN se llama a `toCsv('Norte', lista)`
- THEN la fila es `Norte;lun;"10:00;12:00"`

- GIVEN una reserva de `Norte` con franja `a"b`
- WHEN se llama a `toCsv('Norte', lista)`
- THEN la fila es `Norte;lun;"a""b"`

#### ADDED — Sala desconocida o ausente no produce CSV

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN no se imprime nada por la salida estándar, se imprime `sala desconocida: Oeste` por el canal de errores y el proceso termina con código 1

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar` sin sala
- THEN no se imprime nada por la salida estándar, se imprime `falta la sala: uso exportar <sala>` por el canal de errores y el proceso termina con código 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; el CSV no se guarda, se imprime.
- **Idioma de los nombres**: castellano sin tildes en la cabecera (`sala`, `dia`, `franja`); avisos en castellano.
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `falta la sala: uso exportar <sala>`, por el canal de errores.
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
