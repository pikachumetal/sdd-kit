---
id: 20261113-145730-feature-0010-exportar-csv
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

🦆 Escribirás `salas exportar Norte > norte.csv` y obtendrás un fichero con una línea de cabecera `sala;día;franja` y una por reserva, por ejemplo `Norte;lun;10:00-12:00`. Tu hoja de cálculo en castellano lo abre de un doble clic, con tres columnas y los acentos bien. Si la sala no existe, el aviso sale por el canal de errores y el fichero queda vacío, en vez de llevarse el texto del error dentro. Por dentro, el CSV se monta con una función corta en `src/app.js`, sin librerías.

Validación: dev-lead — lo que sale es un fichero que se abre en una hoja de cálculo: solo quien la usa puede ver si las columnas y los acentos salen bien.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala en un CSV que abre una hoja de cálculo en castellano.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume la hoja de cálculo del responsable) · tamaño: ~70 líneas en 4 ficheros
- Dominio (sonnet): si `sala;día;franja` y el BOM bastan para que la hoja en castellano abra el CSV sin tocar nada, y qué pasa con una sala sin reservas (señal: contrato público)
- Técnica (sonnet): si el error por `stderr` con código 1 es compatible con `> fichero` y con la forma actual de `run()` y el punto de entrada de `src/app.js` (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si el fichero abre bien en la hoja, el único consumidor del formato

**Estado de la review: NO despachada.** Esta sesión no tiene herramienta de subagentes, así que no hay revisores independientes. Lo que sí hice yo, y no sustituye a la review: el repaso de coherencia, el delta probado sobre una copia (`sdd capability merge` aceptó 4 requisitos y 5 reglas; `capability check`: «Capacidades válidas: 1»; el repo no cambió) y una lectura adversarial de los siete puntos que no encontró contradicciones con capacidades (no hay ninguna) ni escenarios sin GIVEN/WHEN/THEN. Si prefieres revisión independiente, dilo y se despacha antes de aprobar, o con «apruebo sin review» la saltamos.

### Hallazgos de la review

Ninguno: no hubo review.

1. Enfoque: función pura `exportCsv(room)` dentro de `src/app.js` que `run` invoca para `exportar`, frente a un módulo `src/csv.js` o a escribir ficheros desde el comando (ver Approach).
2. Nombre del comando: `exportar <sala>` — verbo en castellano como `reservar`, `cancelar`, `libres`.
3. Columnas y cabecera: `sala;día;franja`, con cabecera en la primera línea. Ejemplo: `Norte;lun;10:00-12:00`.
4. Codificación: UTF-8 con BOM — Excel en castellano, al abrir con doble clic un UTF-8 sin BOM, estropea los acentos (`día` → `dÃ­a`). Si tu hoja no lo necesita, se quita.
5. Fin de línea `\n`; la última fila termina con salto de línea (el que añade `console.log`).
6. Orden de las filas: el de las reservas en memoria, sin ordenar por día ni franja.
7. Escapado: un campo que contenga `;`, `"` o salto de línea va entre comillas dobles, con `"` duplicada. Con las salas y franjas de hoy no ocurre; está para que un nombre de sala futuro no rompa la hoja.
8. Sala sin reservas: salida con solo la cabecera (`sala;día;franja`).
9. Sala inexistente, o `exportar` sin sala: nada por la salida estándar, el aviso por `stderr` y código de salida 1, para que `> fichero` no meta el aviso dentro del CSV. Textos: `sala desconocida: <sala>` y `uso: salas exportar <sala>`.
10. El nombre de la sala se compara exacto, con mayúsculas (`Norte`, no `norte`), como `rooms` hoy.
11. Fuera de esta feature: exportar todas las salas a la vez y el calendario `.ics` (fila 0009).
12. Capacidad nueva `booking-export`. El proyecto no tiene `capabilities/`: esta spec la crea al cerrarse.
13. Política de modelos: revisores de la spec en Sonnet (ninguna regla de negocio ni roles) · revisión final: Spec opus+high, Código sonnet+high · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Decisiones tomadas con el dev-lead

- La salida va por la salida estándar y la redirección a fichero la hace el usuario — «Por la salida estándar; yo redirijo a un fichero con `>`.»
- Separador `;` — «Usa `;`. Mi hoja de cálculo está en castellano y así es como la abro.»

## Intent

Cada lunes el responsable de cada sala cuadra sus reservas en una hoja de cálculo. Hoy no hay forma de sacarlas de `salas`: se copian a mano. Con `salas exportar Norte > norte.csv` se obtiene un fichero que la hoja en castellano abre de un doble clic, con tres columnas bien separadas y los acentos intactos. Fracasaría aunque «funcione» si al abrirlo todo cae en una sola columna, si `día` sale como `dÃ­a` o si un error acaba escrito dentro del fichero.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js`; sus tests en `test/app.test.js`; una línea en `README.md` que lo documente.
- No entra: exportar varias salas a la vez, elegir columnas o separador, escribir ficheros desde el comando, ordenar las filas, el calendario `.ics` (fila 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La línea de entrada `if (command) console.log(run(command, args));` pasa a capturar un error de `run` y sacarlo por `stderr` con código 1 | `src/app.js:16` | Scope y decisión 9 |

- Filas que implementa: 0010 (sin fila en el roadmap) → nada: comprobado con `git grep -niE "exportar|csv|0010"`, solo aparece la fila 0009 (`.ics`), que es otra tarea.

## Approach

- A. Función `exportCsv(room)` en `src/app.js`, llamada desde `run` — una función pura y corta que se prueba con `run('exportar', ['Norte'])`, como los demás comandos. Cuesta engordar un fichero que hoy tiene 16 líneas.
- B. Módulo nuevo `src/csv.js` con el escapado — separa responsabilidades, pero para una función de unas 10 líneas añade un fichero y un import sin que nada más lo reutilice todavía.
- C. Que el comando escriba el fichero — descartado por el dev-lead: redirige él.
- Elegido: A — el proyecto es un único fichero de entrada sin dependencias (`operations.md`); si el CSV crece o se reutiliza, extraerlo a un módulo es un refactor pequeño.

El fallo se señala lanzando un `Error` desde `run` con el texto del aviso; el punto de entrada lo captura, lo escribe en `stderr` y fija `process.exitCode = 1`. Los comandos existentes no se tocan: ninguno lanza.

## Dónde se prueba

- Filas, cabecera, BOM y sala sin reservas: por `run('exportar', [...])`, como los tests de `libres` y `cancelar`.
- Escapado de campos (decisión 7): por la función `csvField`, exportada solo para el test. Las reservas son internas y ningún dato de hoy lo exige, así que no es un escenario de la capacidad.
- Aviso por `stderr`, salida estándar vacía y código 1: ejecutando `node src/app.js exportar <x>` con `spawnSync` en un test; es la única costura que ve el canal y el código de salida.
- Que la hoja de cálculo lo abre bien: la validación manual del dev-lead al cerrar.

## Términos y ADR

- Términos resueltos: franja — el tramo horario de una reserva, `10:00-12:00` | ninguno más.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala `Norte` con una reserva el lunes de `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida estándar empieza por el BOM UTF-8 y sigue con las líneas `sala;día;franja` y `Norte;lun;10:00-12:00`, cada una terminada en salto de línea
- AND el código de salida es 0

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida estándar es el BOM y solo la línea `sala;día;franja`
- AND el código de salida es 0

#### ADDED — Sala desconocida

- GIVEN que `Este` no es una sala
- WHEN se ejecuta `exportar Este`
- THEN la salida estándar queda vacía
- AND `stderr` muestra `sala desconocida: Este`
- AND el código de salida es 1

#### ADDED — Falta la sala

- GIVEN el comando sin argumento
- WHEN se ejecuta `exportar`
- THEN la salida estándar queda vacía
- AND `stderr` muestra `uso: salas exportar <sala>`
- AND el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: no aplica — el export solo lee las reservas que ya existen
- **Idioma de los nombres**: castellano (`exportar`, `sala;día;franja`)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: salas exportar <sala>`, por `stderr`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
