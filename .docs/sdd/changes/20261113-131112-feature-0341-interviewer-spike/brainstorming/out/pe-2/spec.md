---
id: 20261113-150609-feature-0010-exportar-csv
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

🦆 Con `salas exportar Norte` sale por pantalla una tabla con las reservas de esa sala, una por línea y separada por `;`: `Norte;lun;10:00-12:00`. Se puede guardar en un fichero con `salas exportar Norte > norte.csv` y abrirlo en el Excel en castellano del responsable, que ya reparte las columnas. Si la sala no existe o falta el nombre, no sale ningún CSV: sale un error y el comando termina con fallo. Por dentro, es una rama nueva en `run` de `src/app.js`.

Validación: dev-lead — es algo que usa una persona: hay que abrir el CSV en la hoja de cálculo y ver que las columnas caen bien.

## Capacidades

- Nuevas: `bookings` — qué hace el producto con las reservas de una sala: de momento, exportarlas a CSV.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (el CSV lo consume una hoja de cálculo) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): si `sala;dia;franja` y la sala sin reservas (solo cabecera) sirven para cuadrar en una hoja, y si «sala desconocida» da error en vez de CSV vacío (señal: contrato público)
- Técnica (sonnet): si el error por `stderr` con código 1 no rompe el resto de comandos de `run` y si la prueba por `spawn` es necesaria (señal: capacidad nueva)
- Mínimo razonable: un solo revisor técnico — deja sin mirar si las columnas son las que el responsable necesita
- **No se ha despachado ninguna review:** esta sesión no tiene herramienta para lanzar subagentes. La decisión de revisar o no es tuya al aprobar (ver opciones del gate).

1. Enfoque: rama nueva en `run` de `src/app.js` con una función `exportarCsv(sala)`, frente a un fichero aparte o un flag `--csv` (ver Approach).
2. Nombre del comando: `exportar` — nadie lo dijo; coherente con `libres`, `reservar`, `cancelar` (verbos en castellano).
3. La sala va como argumento posicional: `salas exportar Norte`.
4. Salida por pantalla (stdout), sin escribir ficheros: quien quiera fichero redirige (`> norte.csv`). Es lo que menos código toca y deja al responsable elegir el nombre.
5. Columnas y cabecera: `sala;dia;franja`, con cabecera. Sin fecha concreta porque las reservas guardadas solo tienen día de la semana y franja.
6. Separador `;` (lo dijo el dev-lead) y saltos de línea `\n`. Sin comillas ni escapes: los nombres de sala son `Norte` y `Sur`, sin `;`, y no se prevén otros.
7. Orden de las filas: el de la lista de reservas. Con los datos actuales (una reserva) no se puede probar; se queda como decisión sin test.
8. Sala sin reservas: solo la cabecera (`sala;dia;franja`), no error.
9. Sala que no existe (se compara el nombre exacto, `Oeste` o `norte` minúscula): error `sala desconocida: Oeste` por stderr y código de salida 1, sin nada en stdout. Si fuera un mensaje por stdout acabaría dentro del fichero al redirigir.
10. Sin nombre de sala: error `uso: salas exportar <sala>` por stderr y código de salida 1.
11. Capacidad nueva `bookings` (nombre en inglés, sustantivo del dominio). Al fusionar se crea `.docs/sdd/capabilities/bookings.md`.
12. Sin codificación especial: la salida es ASCII con los datos actuales; no se añade BOM. Si un día una sala lleva tilde, hay que revisarlo.
13. Fusión probada sobre una copia de `.docs/sdd`: `sdd capability merge` sale con 0, crea `bookings.md` con 4 requisitos y las 5 reglas.
14. Política de modelos: sin revisores despachados · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

Sin review despachada (ver arriba).

### Decisiones tomadas con el dev-lead

- Separador `;` porque el Excel del responsable está en castellano — «Sí, el Excel del responsable está en castellano, así que el separador tiene que ser punto y coma (`;`).»
- Reservas de una sala, para cuadrarlas los lunes en la hoja del responsable — «Cada lunes el responsable de la sala cuadra las reservas de esa sala en su hoja de cálculo.»
- Qué echa en falta el responsable hoy: el dev-lead no lo sabe («Lo que echa en falta ahora, no lo sé.»); por eso las columnas son una propuesta mía (decisión 5).

## Intent

Hoy no hay forma de sacar las reservas de una sala de `salas`: el responsable de cada sala las cuadra los lunes en su hoja de cálculo, así que tiene que copiarlas a mano. Con `salas exportar <sala>` obtiene un CSV que abre directamente en su Excel en castellano. Éxito: el CSV de `Norte` se abre en una hoja con tres columnas (`sala`, `dia`, `franja`) y una fila por reserva, sin tener que tocar el separador. Fracaso, aunque funcione: que el Excel lo abra todo en una sola columna, o que un error acabe dentro del fichero.

## Scope

- Entra: el comando `exportar <sala>` con salida CSV por stdout; el error de sala desconocida o ausente por stderr con código 1; las pruebas; una línea en `README.md` que explique cómo guardarlo (`salas exportar Norte > norte.csv`).
- No entra: fechas concretas (las reservas no las guardan); filtros por día o franja; exportar todas las salas a la vez; escribir directamente un fichero con un nombre propio; formatos `.ics` (es la 0009) o Excel nativo; escapes y comillas CSV; codificación con BOM.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma: solo se añade un comando. El final de `src/app.js` (`if (command) console.log(run(command, args))`) se envuelve para dar errores a stderr con código 1 | `src/app.js:16` | Scope y decisiones 9 y 10: los demás comandos siguen imprimiendo igual, no lanzan errores |

- Filas que implementa: nada: comprobado con `git grep -nE "0010|exportar|CSV|csv" -- . ':!.docs/sdd/specs'` (sin resultados); la fila 0009 (.ics) queda fuera

## Approach

- A. Rama nueva en `run` de `src/app.js` con una función `exportarCsv(sala)` — unas 12 líneas, mismo estilo que `libres`; se prueba con el `run` que ya usan los tests.
- B. Fichero aparte `src/exportar.js` — la operación dice «un solo fichero de entrada: `src/app.js`», que es la entrada, no impide otros ficheros; pero para 12 líneas es un módulo más que importar y no gana nada.
- C. Un flag `--csv` sobre un listado de reservas — no hay hoy un comando que liste reservas, habría que crearlo solo para colgarle el flag.
- Elegido: A — es lo que menos toca y sigue el patrón del fichero.

`run` lanza un `Error` con el texto del mensaje cuando la sala es desconocida o no se da; el final de `app.js` lo captura, escribe el mensaje por stderr y pone `process.exitCode = 1`. El resto de comandos no lanzan.

## Dónde se prueba

- Salida de `exportar Norte`, `exportar Sur`: por `run` de `src/app.js`, como los tests de `libres`.
- Errores `exportar Oeste` y `exportar` sin sala: `assert.throws` sobre `run`, con el texto exacto.
- Que el error llega por stderr con código 1 y stdout vacío: una prueba con `child_process.spawnSync('node', ['src/app.js', 'exportar', 'Oeste'])`. Es el único patrón nuevo de los tests, y es necesario porque `run` no ve los códigos de salida.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN las salas `Norte` y `Sur`, y la reserva `Norte · lun · 10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN stdout es exactamente `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`, con `;` como separador, y el código de salida es 0

#### ADDED — Una sala sin reservas se exporta solo con cabecera

- GIVEN las salas `Norte` y `Sur`, y la reserva `Norte · lun · 10:00-12:00`
- WHEN se ejecuta `salas exportar Sur`
- THEN stdout es exactamente `sala;dia;franja` y el código de salida es 0

#### ADDED — Exportar una sala que no existe da error

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `salas exportar Oeste`
- THEN stdout queda vacío, stderr dice `sala desconocida: Oeste` y el código de salida es 1
- AND con `salas exportar norte` (minúscula) pasa lo mismo: `sala desconocida: norte`

#### ADDED — Exportar sin indicar la sala da error

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `salas exportar` sin más argumentos
- THEN stdout queda vacío, stderr dice `uso: salas exportar <sala>` y el código de salida es 1

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, la lista `bookings` de `src/app.js`
- **Idioma de los nombres**: comando y cabeceras en castellano sin tildes (`exportar`, `sala`, `dia`, `franja`); mensajes en castellano
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: salas exportar <sala>`, por stderr
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
