---
id: 20261113-144428-feature-0010-exportar-reservas-csv
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

🦆 Hoy `salas` no deja sacar las reservas de una sala para cuadrarlas en la hoja de cálculo. Con esta feature, `node src/app.js exportar-csv Norte > norte.csv` escribe en `norte.csv` una cabecera `sala;día;franja` y una fila por reserva de Norte, por ejemplo `Norte;lun;10:00-12:00`, listo para abrir con doble clic en Excel. Si la sala no existe (`norte`, `Este`), no escribe nada en el fichero: el aviso sale por el canal de errores y el comando termina con código 1. Por dentro, es un comando nuevo en `src/app.js` que arma el texto con las reservas que ya existen en memoria y lo imprime como los demás comandos.

Validación: dev-lead — es un fichero que se abre en Excel, y eso solo lo ve una persona.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a un fichero que abre una hoja de cálculo.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (dominio y técnica, sonnet) — señales: capacidad nueva (`booking-export`), contrato público (el formato CSV que consume la hoja de cálculo) · tamaño: ~40 líneas de código y pruebas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (sonnet): si el THEN de la sala inexistente protege de verdad al fichero (aviso solo por stderr, stdout vacío) y si la cabecera `sala;día;franja` y el orden de las filas sirven al responsable que cuadra los lunes (señal: capacidad nueva + contrato público)
- Técnica (sonnet): si BOM + `;` + comillas dan una cadena que Excel y Calc abren sin asistente, y si el error por `throw` en `run()` más captura en el arranque no cambia lo que hacen `libres`, `reservar` y `cancelar` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el orden y los textos de aviso sirven a quien cuadra las salas
- **Estado de la review: NO despachada.** Esta sesión no tiene herramienta para lanzar subagentes, así que no ha leído la spec ningún revisor independiente. Lo que sí hice: la pasada de coherencia y una lectura mía con los siete puntos (abajo). Si quieres los dos revisores, dímelo y los lanzo desde una sesión que pueda.
- Delta sobre una copia de `.docs/sdd`: `sdd capability merge` → 5 requisitos y 5 reglas añadidos en `booking-export.md`, `sdd capability check` → «Capacidades válidas: 1». El repo no cambia.

### Hallazgos de la review

Lectura propia con los siete puntos, no de un revisor independiente:
- **Aceptado** — el escenario de sala inexistente mezclaba `Este` y `norte` en un solo THEN → separado: el THEN lleva `Este` y un AND lleva `norte` con su texto.
- **Sin hallazgo** en los puntos 1 (no hay capacidades vivas con las que contradecir), 5 y 5 bis (sin roles; los nombres y avisos nuevos están en «Reglas de la capacidad»), 6 y 7 (sin datos reales en los ejemplos).

1. **Nombre del comando: `exportar-csv <sala>`** y no `exportar` — la fila 0009 del roadmap (calendario .ics) también va a «exportar»; así `exportar` queda libre. Cuesta que el nombre es más largo que `libres`, `reservar` y `cancelar`.
2. **BOM UTF-8 al principio** — con `día` en la cabecera, Excel sin BOM muestra `dÃ­a`. Lo decidiste tú dejándomelo: «lo que necesito es que el Excel lo abra bien cada lunes». Medido en esta máquina con `node … > f.csv`: bash y cmd escriben los bytes tal cual (`ef bb bf … c3 ad`), PowerShell 7 igual, y Windows PowerShell 5 reescribe todo en UTF-16 con BOM (`ff fe … ed 00`), que Excel también abre. Sin medir: la apertura real en Excel, que lo valida el dev-lead.
3. **Sala sin reservas: solo la cabecera.** **Sala inexistente o sin nombre: sin CSV, aviso por stderr, código de salida 1** — decidido por mí a tu «decide tú»: un error de tecleo no debe parecer una sala vacía, y un aviso por stdout acabaría dentro del fichero al redirigir con `>`.
4. **Textos de los avisos:** `No existe la sala Este. Salas: Norte, Sur` y `Uso: exportar-csv <sala>`, con las salas listadas en el orden en que están definidas.
5. **El nombre de la sala se compara exacto** (`norte` ≠ `Norte`), como ya hace `libres` — no pedí mayúsculas ni minúsculas.
6. **Orden de las filas: el orden en que están guardadas las reservas**, sin ordenar por día ni por hora. Ordenar sería otra funcionalidad no pedida; con las reservas actuales no se nota.
7. **Fin de línea `\n`** (el que ya imprime `console.log`), no `\r\n` — Excel y Calc lo abren igual.
8. **Comillas:** un campo que lleve `;`, `"` o un salto de línea va entre comillas dobles, con `"` doblado. Hoy no ocurre con los datos reales, pero la deuda «sin validación del formato de franja horaria» deja que una franja lleve cualquier texto, y sin esta regla una franja con `;` movería columnas en la hoja sin aviso.
9. **Enfoque: A, frente a B y C (ver Approach).**
10. **Capacidad nueva `booking-export`**, en inglés kebab-case porque es un nombre de fichero.
11. **Sin cambios en `README.md`, `CHANGELOG.md` ni `ROADMAP.md` en esta feature:** el changelog lo escribe el corte de release, y esta feature no tiene fila en el roadmap (la 0010 se reservó al arrancar).
- Política de modelos (solo en `delegate`): revisores de la spec en sonnet, dominio y técnico · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Decisiones tomadas con el dev-lead

- La salida va por la salida estándar y el usuario redirige con `>` — «Por la salida estándar. Yo redirijo a un fichero con `>`.»
- Separador `;` con cabecera en castellano `sala;día;franja` — «Punto y coma (`;`), con cabecera en castellano: `sala;día;franja`. Es la opción 1.»
- Codificación y casos de sala vacía o inexistente: «No sé, decide tú: lo que necesito es que el Excel lo abra bien cada lunes.» y «No sé, decide tú.» (decisiones 2 y 3 de arriba)

## Intent

Hoy `salas` guarda las reservas de cada sala pero no hay forma de sacarlas del programa. El responsable de cada sala las cuadra los lunes en su hoja de cálculo y tiene que copiarlas a mano. Con esta feature, ejecutar `node src/app.js exportar-csv Norte > norte.csv` da un fichero que Excel abre con doble clic y con `día` bien escrito. Fracasaría, aunque funcionara técnicamente, si el fichero se abriera en una sola columna o con `dÃ­a`, o si un error de tecleo en el nombre de la sala dejara un fichero vacío que parece «sin reservas».

## Scope

- Entra: el comando `exportar-csv <sala>` que imprime por la salida estándar la cabecera y una fila por reserva de la sala; los avisos de sala inexistente y de uso; el código de salida 1 en esos dos casos; las pruebas.
- No entra: exportar varias salas o todas a la vez; escribir a un fichero con una opción propia (`--salida`); ordenar las reservas; filtrar por día; exportar a calendario `.ics` (fila 0009); validar el formato de la franja (deuda ya anotada); cambios en `reservar`, `libres` o `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|export"` fuera de las carpetas de evidencia solo da `ROADMAP.md:19` (la fila 0009, calendario) y `src/app.js:9` (`export function run`) | sin cambio: la 0009 sigue en Later y su nombre de comando queda libre (decisión 1) |

- Filas que implementa: nada: comprobado con `git grep -nE "0010" -- . ':!.docs/sdd'` (la 0010 no tiene fila en el roadmap).

## Approach

- **A. `exportar-csv` en `src/app.js`, con el error como `throw` capturado en el arranque** — una función `exportCsv(sala)` y una rama nueva en `run()`. Un `Error` con el aviso llega al bloque de arranque, que lo imprime por stderr y fija el código de salida 1. Es poco código y no toca los demás comandos, que no lanzan nada.
- **B. `run()` devuelve `{ salida, error }` para todos los comandos** — evita el `throw` pero obliga a cambiar `libres`, `reservar` y `cancelar` y sus tests actuales, por un solo caso de error.
- **C. Un módulo nuevo `src/csv.js`** — una función pura que se prueba sola, pero `operations.md` fija un único fichero de entrada y para ~15 líneas añade un fichero sin que haya otro consumidor.
- Elegido: **A** — es lo más pequeño que da el aviso por stderr con código 1 sin tocar el resto de comandos. Cuesta que el arranque gane un `try/catch` y que `run()` pase a poder lanzar un error de usuario.

Partes del cómo que fija A: la cadena del CSV empieza por `﻿` y se une con `\n`; el arranque, si `run()` lanza, escribe `error.message` en stderr y deja `process.exitCode = 1` sin imprimir nada por stdout; las reservas se leen del mismo arreglo en memoria que ya usa `libres`.

## Dónde se prueba

- Contenido del CSV (cabecera, filas, sala vacía, comillas, BOM): llamando a `run('exportar-csv', ['Norte'])`, como los tests actuales de `libres` y `cancelar`.
- Sala inexistente y falta de argumento: `assert.throws(() => run(...))` con el texto del aviso, por la misma costura.
- Que el aviso no entra en el fichero y el código de salida es 1: un único test que lanza `node src/app.js exportar-csv Este` como proceso y comprueba stdout vacío, stderr con el aviso y código 1 — es lo único que `>` hace visible.
- Que Excel lo abre bien: lo valida el dev-lead con el fichero real; ningún test lo ve.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN las reservas `{ sala: Norte, día: lun, franja: 10:00-12:00 }`
- WHEN el usuario ejecuta `exportar-csv Norte`
- THEN la salida estándar es un texto que empieza por el carácter BOM, sigue con la cabecera `sala;día;franja`, y después una línea por reserva de Norte: `Norte;lun;10:00-12:00`
- AND las líneas se separan con `\n` y se mantienen en el orden en que están guardadas las reservas
- AND el código de salida es 0

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur`, que existe y no tiene reservas
- WHEN el usuario ejecuta `exportar-csv Sur`
- THEN la salida estándar es el BOM y la cabecera `sala;día;franja`, sin más líneas
- AND el código de salida es 0

#### ADDED — Una sala inexistente no genera CSV

- GIVEN las salas `Norte` y `Sur`
- WHEN el usuario ejecuta `exportar-csv Este`
- THEN la salida estándar queda vacía
- AND por la salida de errores sale `No existe la sala Este. Salas: Norte, Sur`
- AND el código de salida es 1
- AND con `exportar-csv norte` (otra capitalización) pasa lo mismo, con `No existe la sala norte. Salas: Norte, Sur`

#### ADDED — El comando pide la sala

- GIVEN cualquier estado de las reservas
- WHEN el usuario ejecuta `exportar-csv` sin sala
- THEN la salida estándar queda vacía, por la salida de errores sale `Uso: exportar-csv <sala>` y el código de salida es 1

#### ADDED — Los campos con separador van entre comillas

- GIVEN una reserva de Norte con la franja `10:00;12:00`
- WHEN el usuario ejecuta `exportar-csv Norte`
- THEN la fila de esa reserva es `Norte;lun;"10:00;12:00"`
- AND un campo con `"` lo lleva doblado y entre comillas (`a"b` sale `"a""b"`), y uno con un salto de línea también va entre comillas

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: en memoria, en el mismo arreglo de reservas que usan `libres` y `cancelar`
- **Idioma de los nombres**: cabecera `sala;día;franja` y avisos en castellano; el comando se llama `exportar-csv`
- **Límites**: no aplica
- **Avisos**: sala inexistente: `No existe la sala <nombre>. Salas: Norte, Sur`; sin sala: `Uso: exportar-csv <sala>`; ambos por stderr, nunca por stdout
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
