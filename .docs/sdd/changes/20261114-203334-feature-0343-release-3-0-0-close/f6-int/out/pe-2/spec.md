---
id: 20261116-182946-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Hoy no hay forma de sacar las reservas de una sala a una hoja de cálculo. Con esta feature, `salas exportar Norte > norte.csv` deja en `norte.csv` las reservas de Norte, una por fila, con las columnas `sala;dia;franja` (por ejemplo `Norte;lun;10:00-12:00`), separadas por `;` para que una hoja en castellano las abra ya en columnas. Si la sala no existe (`salas exportar Oeste`), el comando avisa por el canal de errores y no escribe nada en el fichero. Por dentro, es una orden nueva en `src/app.js` que filtra las reservas por sala y las une con `;`.

Validación: dev-lead — el resultado lo abre una persona en su hoja de cálculo en castellano; un test no ve si las columnas se separan bien al abrirlo.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el CSV lo consume una hoja de cálculo; el comando es nuevo), capacidad nueva (`booking-export`) · tamaño: ~45 líneas en 3 ficheros (`src/app.js`, `test/app.test.js`, la capacidad)
- Dominio (sonnet): si `sala;dia;franja` y el texto de error bastan para cuadrar las reservas del lunes sin confundir «sin reservas» con «error» (señal: contrato público)
- Técnica (sonnet): si el error por `stderr` con código de salida 1 impide de verdad que el redireccionamiento `> fichero` guarde un mensaje de error como si fueran datos (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si la cabecera y las columnas sirven al responsable de la sala
- **No despachados:** esta sesión no tiene herramienta de subagentes, así que no hay revisores. Hice yo una lectura adversarial en el hilo (ver Hallazgos); no tiene la independencia de un revisor.

1. Nombre del comando: `salas exportar <sala>` — nadie lo dijo; sigue el estilo de los verbos actuales (`libres`, `reservar`, `cancelar`), en castellano (Art. 4).
2. Columnas y cabecera: `sala;dia;franja`, siempre con cabecera, sin tilde en `dia` (como el campo `day` y los días `lun`…) — así el fichero es ASCII y no depende de la codificación al abrirlo.
3. Contenido: todas las reservas de la sala, en el orden en que están. Las reservas guardan solo el día de la semana (`lun`), sin fecha, así que no se puede filtrar «esta semana»; filtrar por semana va a otra feature.
4. Sala sin reservas (existe, p. ej. `Sur`): salida de solo cabecera, código de salida 0 — es «no hay reservas», no un error.
5. Sala desconocida: el nombre se compara exacto (`norte` en minúscula, o `Oeste`, es desconocida). El comando escribe por el canal de errores `sala desconocida: Oeste (salas: Norte, Sur)`, **no escribe nada por la salida estándar** y termina con código 1. Lo de «error claro y sin CSV» lo dijo el dev-lead; que sea por `stderr` y con código 1 lo decido yo, porque con `> fichero` un mensaje por la salida estándar acabaría dentro del fichero.
6. Sin sala (`salas exportar`): mismo tratamiento, con el texto `falta la sala: uso: salas exportar <sala>`.
7. Formato: separador `;` (lo dijo el dev-lead), saltos de línea `\n`, sin BOM y sin comillas ni escapado: los valores actuales (`Norte`, `lun`, `10:00-12:00`) no llevan `;` ni comillas. Si en el futuro hay nombres de sala con `;`, hará falta escapar (va al No entra).
8. Enfoque: A, frente a B (ver Approach).
9. Capacidad nueva `booking-export` (slug en inglés, por la regla 1 de las capacidades). Es la primera capacidad del proyecto: `capabilities/` no existe y la crea el cierre al fusionar el delta.
10. Reglas de la capacidad: el proyecto no tiene «Reglas de producto» en su constitution; los valores de las cinco entradas los fijo yo (ver el delta).
11. Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` añade los 4 requisitos y las 5 reglas de `booking-export` sin rechazos, y `sdd capability check` da «Capacidades válidas: 1». El `capabilities/` del repo no cambia.
- Política de modelos: revisores de la spec — ninguno despachado (sin herramienta de subagentes en esta sesión) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan (sin `architecture.md`: no aplica) · otros despachos en paralelo: ninguno previsto (1–2 tasks) · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Sin revisores. Lectura adversarial mía, para que la veas:
- **Aceptado** — con `console.log(run(...))` el mensaje de error saldría por la salida estándar con código 0 → el error se lanza desde `run` y el punto de entrada lo escribe por `stderr` con `process.exitCode = 1` (decisión 5; THEN del escenario de sala desconocida).
- **Aceptado** — `run('exportar', [])` con sala `undefined` produciría un CSV de solo cabecera por coincidencia → escenario propio de «falta la sala» (decisión 6).
- **Aceptado** — `norte` en minúscula coincidiría o no según cómo se compare → comparación exacta y escenario con dato (decisión 5).

### Decisiones tomadas con el dev-lead

- Salida: CSV por la salida estándar; el dev-lead lo redirige a un fichero — «Opción 1: por la salida estándar. Yo lo redirijo a un fichero.»
- Separador `;` — «Castellano. La hoja del responsable de cada sala está en configuración española, así que quiero el separador `;`.»
- Sala desconocida: error claro y sin CSV — «Opción 1: que dé error claro y no escriba CSV. Una hoja vacía por un nombre mal escrito se confundiría con "no hay reservas".»

## Intent

Hoy no hay forma de sacar las reservas de una sala del programa: el responsable de cada sala las cuadra los lunes en su hoja de cálculo y tiene que copiarlas a mano. Se quiere que `salas exportar <sala>` saque sus reservas en un CSV que una hoja de cálculo en castellano abra directamente en columnas, sin pasos de importación. Éxito: `salas exportar Norte > norte.csv` se abre en columnas `sala`, `dia`, `franja` con la fila `Norte`, `lun`, `10:00-12:00`. Fracaso aunque funcione técnicamente: que un nombre de sala mal escrito deje un fichero que parece «sin reservas», o que el CSV se abra en una sola columna.

## Scope

- Entra: el comando `exportar <sala>`, su CSV por la salida estándar, y los errores de sala desconocida y de falta de sala por `stderr` con código de salida 1.
- No entra: escribir ficheros desde el comando (se redirige), filtrar por semana o fecha (las reservas no tienen fecha), elegir el separador, escapar `;` o comillas, exportar a calendario `.ics` (es la fila 0009 del roadmap), exportar varias salas a la vez.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | El comando `exportar` es nuevo; los demás verbos de `run()` no cambian. El punto de entrada pasa a capturar errores de `run`, y hoy ninguna orden los lanza. |

- Filas que implementa: nada: comprobado con `git grep -n -iE "exportar|0010|csv"` fuera de `.docs/sdd/changes` (solo aparece la fila 0009, «Exportar reservas a calendario (.ics)», que es otra feature)

## Approach

- A — una rama `exportar` en `run()` de `src/app.js`, con una función pura `exportCsv(sala)` en el mismo fichero: filtra `bookings` por sala, une las columnas con `;` y lanza un `Error` con el texto de la decisión 5 o 6; el punto de entrada captura el error, lo escribe por `stderr` y fija `process.exitCode = 1`. Coste: `app.js` crece unas 20 líneas y el punto de entrada cambia, pero sigue en un fichero, como pide `operations.md`.
- B — un módulo `src/csv.js` con el formateo y `app.js` solo lo llama. Coste: un fichero y un `import` más para una función de cinco líneas; se justificaría con más formatos, que no hay.
- Elegido: A — es lo que hace el proyecto hoy (todo en `app.js`, sin dependencias) y la lógica pura se prueba como los tests actuales, con `run(...)`.

Partes del cómo que fija A: `run('exportar', [sala])` devuelve el CSV como texto de líneas unidas con `\n`, sin salto final (`console.log` añade el suyo); los errores se lanzan como `Error`, no se devuelven como texto, para que el punto de entrada pueda separarlos de los datos.

## Dónde se prueba

- CSV de una sala con reservas y de una sala sin ellas: por `run('exportar', [...])`, como los tests actuales de `test/app.test.js`.
- Sala desconocida y falta de sala: por `run`, que lanza `Error` con el texto (`assert.throws`).
- Que el error sale por `stderr`, con código 1 y sin nada por la salida estándar: ejecutando `node src/app.js exportar Oeste` con `child_process` (`spawnSync`) en el test: es la segunda costura, y hace falta porque `run` por sí solo no demuestra que `> fichero` quede vacío.
- Cómo se abre en la hoja de cálculo: lo valida el dev-lead a mano.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala `Norte` con una reserva el `lun` en la franja `10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida estándar es exactamente `sala;dia;franja` y, en otra línea, `Norte;lun;10:00-12:00`, y el código de salida es 0

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur`, que existe y no tiene reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida estándar es exactamente `sala;dia;franja` y el código de salida es 0

#### ADDED — Una sala desconocida no exporta nada

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `salas exportar Oeste`, o `salas exportar norte` en minúscula
- THEN la salida estándar queda vacía, el canal de errores recibe `sala desconocida: Oeste (salas: Norte, Sur)` (o `sala desconocida: norte (salas: Norte, Sur)`) y el código de salida es 1

#### ADDED — Exportar sin indicar la sala falla

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `salas exportar` sin sala
- THEN la salida estándar queda vacía, el canal de errores recibe `falta la sala: uso: salas exportar <sala>` y el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: no aplica: el comando lee las reservas que ya existen y no guarda datos nuevos
- **Idioma de los nombres**: castellano: el comando, los mensajes de error y los nombres de columna (`sala`, `dia`, `franja`), sin tildes en la cabecera
- **Límites**: no aplica
- **Avisos**: los errores van por el canal de errores con código de salida 1 y nunca por la salida estándar: `sala desconocida: <sala> (salas: <lista>)` y `falta la sala: uso: salas exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
