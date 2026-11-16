---
id: 20261116-184452-feature-0010-export-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
profile: delegate
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Con `node src/app.js exportar Norte > norte.csv` sale un fichero con las reservas de la sala Norte, una por línea y separadas por `;`: `Norte;lun;10:00-12:00`. Así el responsable de la sala lo abre los lunes en su hoja de cálculo en castellano y ya lo ve en columnas. Si la sala no existe, el error sale por la pantalla y el fichero queda vacío. Por dentro, `run` gana un comando `exportar` y `app.js` pasa los errores a la salida de errores.

Validación: dev-lead — es un fichero que una persona abre en su hoja de cálculo, y solo ella ve si las columnas salen bien.

## Capacidades

- Nuevas: `bookings-export` — exportar a CSV las reservas de una sala.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: la rúbrica pide dos revisores (señales: capacidad nueva, contrato público —el CSV lo consume la hoja de cálculo—) · tamaño: ~35 líneas en 2 ficheros
- Dominio (opus): lo que recibe la hoja en la sala vacía y en la desconocida (señal: contrato público)
- Técnica (sonnet): que el error a `stderr` con código 1 quepa en `run` sin romper `libres`, `reservar` y `cancelar` (señal: contrato público)
- **No se han lanzado:** esta sesión no tiene herramienta para despachar subagentes. He pasado yo solo los siete puntos y dejo sin cubrir la mirada independiente de un segundo revisor

### Hallazgos de la review

- **Aceptado** — el 🦆 decía que el fichero «no se crea con basura», pero con `>` el fichero se crea vacío → reescrito como «queda vacío»

1. Nombre del comando: `exportar <sala>`. Nadie lo dijo; sigue al verbo de `reservar`, `cancelar`.
2. Columnas y cabecera: `sala;dia;franja`, con cabecera. Son los tres datos que tiene hoy una reserva; sin nombre de quien reserva porque no se guarda. La cabecera permite filtrar en la hoja.
3. Orden: el de alta de las reservas, sin reordenar. Hoy no hay día con fecha para ordenar bien (`lun`, `mar`).
4. Sala sin reservas: solo la cabecera. Es un resultado válido, no un error.
5. Sala que no existe (o sin argumento): mensaje por la salida de errores y código de salida 1, nada por la salida estándar. Así `> norte.csv` no guarda el mensaje dentro del fichero. Los textos: `sala desconocida: Zzz` y `uso: exportar <sala>`.
6. El nombre de la sala se compara exacto, con mayúsculas, igual que `libres`.
7. Fin de línea `\n`, sin BOM y sin comillas ni escapes: las salas y las franjas son una lista fija sin `;`. Si una sala con tilde sale mal en tu hoja, se añade el BOM en otra feature.
8. Capacidad nueva `bookings-export` (el proyecto aún no tiene ninguna).
- Política de modelos: sin revisores de la spec (no hay herramienta para lanzarlos en esta sesión) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- La salida va por salida estándar y se redirige con `>` — «Opción 1: por salida estándar, y yo lo redirijo a un fichero con `>`.»
- Separador `;` — «Punto y coma (opción 1️⃣), porque mi hoja está en castellano.»

## Intent

Hoy no hay forma de sacar las reservas de una sala de la herramienta: el responsable las cuadra los lunes en su hoja de cálculo y tendría que copiarlas a mano. Se quiere un comando que las imprima en CSV, listo para redirigir a un fichero. Éxito: abrir el fichero en la hoja de cálculo en castellano y ver tres columnas (sala, día, franja) sin retocar nada. Fracaso aunque funcione: que un mensaje de error acabe dentro del fichero y se cuele en la hoja.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js` (`run` y la salida de errores del arranque) y sus tests en `test/app.test.js`; `README.md` con una línea de uso.
- No entra: escribir ficheros desde la app, escapes y comillas, BOM, filtrar por día, exportar todas las salas, el `.ics` (es la fila 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. El arranque pasa de `console.log(run(...))` a capturar el error de `run` y escribirlo con `console.error` | `src/app.js:16` | Scope y decisión 5 |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv" -- . ':!.docs/sdd'`, que solo encuentra la fila 0009 del roadmap (`.ics`, otra cosa).

## Approach

- A. `exportar` dentro de `run`, con un error que `run` lanza y el arranque captura — un cambio de 6 líneas, se prueba con `run` directamente.
- B. Un módulo `src/exportar.js` aparte — más ficheros para un comando de cinco líneas, en un proyecto que tiene un solo fichero de entrada (`operations.md`).
- C. Que `run` devuelva un objeto `{ out, err, code }` — obliga a tocar `libres`, `reservar` y `cancelar` y sus tests.
- Elegido: A — es el patrón de `libres` y no toca los demás comandos.

`exportar` filtra `bookings` por `room`, las une como `sala;dia;franja` con la cabecera delante y las devuelve unidas por `\n`. Sin sala, o con una sala fuera de `rooms`, lanza `Error` con el texto de la decisión 5. El arranque envuelve `run` en `try/catch`: en error, `console.error(e.message)` y `process.exitCode = 1`.

## Dónde se prueba

- Cabecera y filas, sala vacía, sala desconocida y sin argumento: por `run`, como los tests actuales de `test/app.test.js`.
- Que el error sale por `stderr` con código 1 y `stdout` vacío: un test que lanza `node src/app.js exportar Zzz` y mira ambos. Es la única costura nueva y es la que protege lo que importa de la redirección.
- Las columnas en la hoja de cálculo: lo ve el dev-lead en la validación.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte con la reserva `lun 10:00-12:00`
- WHEN se ejecuta `node src/app.js exportar Norte`
- THEN la salida estándar es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND la salida va a la salida estándar, y con `> norte.csv` el fichero contiene exactamente esas dos líneas

#### ADDED — Una sala sin reservas sale solo con cabecera

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `node src/app.js exportar Sur`
- THEN la salida estándar es solo `sala;dia;franja`

#### ADDED — Una sala que no existe no ensucia la salida estándar

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `node src/app.js exportar Zzz > zzz.csv`
- THEN la salida de errores dice `sala desconocida: Zzz`, el código de salida es 1 y `zzz.csv` queda vacío

#### ADDED — Exportar pide una sala

- GIVEN cualquier estado
- WHEN se ejecuta `node src/app.js exportar` sin sala
- THEN la salida de errores dice `uso: exportar <sala>`, el código de salida es 1 y la salida estándar queda vacía

#### Reglas de la capacidad — bookings-export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; el CSV no se guarda en ningún sitio, lo escribe quien redirige la salida
- **Idioma de los nombres**: castellano: comando `exportar`, columnas `sala`, `dia`, `franja`, mensajes de error
- **Límites**: no aplica
- **Avisos**: errores solo por la salida de errores, nunca por la estándar
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
