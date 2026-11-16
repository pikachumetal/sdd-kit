---
id: 20261113-155936-feature-0010-exportar-reservas-csv
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

🦆 Podrás escribir `salas exportar Norte > norte.csv` y obtener un fichero que la hoja de cálculo abre en dos columnas, `dia` y `franja`, con una fila por reserva: `lun;10:00-12:00`. Si escribes mal la sala (`Nrote`), el aviso sale por la pantalla, el comando termina con error y el fichero queda vacío, así que no se confunde con una sala sin reservas. Por dentro, `run` lanza un error y el punto de entrada lo escribe en la salida de errores.

Validación: dev-lead — es lo que abre una persona en su hoja de cálculo; solo ella ve si las columnas salen bien.

## Capacidades

- Nuevas: `booking-export` — la exportación de las reservas de una sala a CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva, contrato público (el CSV lo consume una hoja de cálculo) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): que el CSV de `Sur` (sin reservas) y el de una sala desconocida no se confundan, y que `dia;franja` basta para cuadrar (señal: contrato público)
- Técnica (sonnet): que lanzar el error desde `run` y escribirlo en el punto de entrada no rompa `libres`, `reservar` ni `cancelar` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas bastan para quien cuadra

### Hallazgos de la review

Sin hallazgos de revisores: en esta sesión no hay herramienta para lanzar subagentes, así que la review la he hecho yo con los siete puntos, y no es independiente. Si la quieres independiente, dilo antes de aprobar.

1. **Nombre del comando: `exportar <sala>`** — castellano como `libres`, `reservar` y `cancelar` (constitución, art. 4). Nadie dijo el nombre.
2. **Capacidad nueva `booking-export`** (slug en inglés, contenido en castellano) — no existe ninguna capacidad y el sustantivo del dominio es la exportación de reservas.
3. **Cabecera y columnas: `dia;franja`, sin columna de sala** — la sala ya está en el comando; es el trozo de la reserva que cuadra el responsable. Salen en el orden en que están guardadas.
4. **Cabecera siempre, también sin reservas** — así `Sur` da un CSV válido y sin filas de datos.
5. **Saltos de línea `\n`, sin BOM, sin comillas** — el resultado de `run` lo imprime `console.log`, que añade `\n`; día y franja son ASCII y nunca llevan `;`, así que no hace falta escapar nada. Si un día un día o una franja llevase acentos o `;`, habría que revisarlo.
6. **Sala con coincidencia exacta de mayúsculas** — igual que `reservar Norte`; `norte` es sala desconocida.
7. **Textos de error** (nadie los dijo): sala desconocida → `Sala desconocida: Nrote. Salas: Norte, Sur`; sin argumento → `Falta la sala. Uso: exportar <sala>`. Ambos por la salida de errores, código de salida 1.
8. **Enfoque A: `run` lanza un `Error` y el punto de entrada lo captura**, frente a B y C (ver Approach).
9. **Entregar el fichero al responsable queda fuera** — lo dejó a mi criterio el dev-lead; no se construye nada para ello.
10. **Reglas de la capacidad**: la constitución no tiene «Reglas de producto», así que los valores de las cinco entradas son míos (en el delta).
11. **Sin fechas**: las reservas guardan el día de la semana (`lun`), no una fecha; el CSV no puede darla.
- Delta probado sobre una copia de `.docs/sdd` fuera del repo: `sdd capability merge` añade 3 requisitos y 5 reglas a `booking-export.md` (rc 0) y `sdd capability check` da «Capacidades válidas: 1». `capabilities/` del repo no cambia.
- Política de modelos: revisores de la spec, ninguno (ver Hallazgos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La salida va por la salida estándar y el dev-lead la redirige a un fichero — «Sale por la salida estándar y yo lo redirijo a un fichero.»
- Cómo llega el fichero al responsable lo decido yo (ver 9) — «Cómo le llega ese fichero al responsable, no sé; decide tú.»
- Separador `;` — «Sí, con `;`.»
- Sala desconocida: error, no CSV vacío — «Sí, vamos con el error para la sala desconocida (opción 1). El resto, decide tú.»

## Intent

Hoy el responsable de cada sala cuadra sus reservas los lunes en una hoja de cálculo y no hay forma de sacarlas de `salas`. Con `exportar`, el dev-lead genera un CSV por sala que la hoja abre sin retoques. Éxito: `salas exportar Norte > norte.csv` abre en dos columnas en una hoja con configuración regional española. Fracaso aunque funcione: que el CSV salga en una sola columna, o que una errata en la sala deje un fichero que parezca «sin reservas».

## Scope

- Entra: el comando `exportar <sala>` con su CSV (`dia;franja`), el error de sala desconocida y de sala ausente, y que el punto de entrada escriba los errores en la salida de errores con código 1.
- No entra: entregar el fichero al responsable; fechas reales; filtrar por día; otros formatos (`.ics` es la 0009); exportar todas las salas a la vez; cambios en `libres`, `reservar` y `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -niE "exportar\|csv\|0010"` solo da `ROADMAP.md:19` (0009, `.ics`, otra fila) | Scope: no entra |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|0010" -- . ':!.docs/sdd/specs'`; la feature no tiene fila en `ROADMAP.md`.

## Approach

- A. `run` lanza un `Error` en los fallos y el punto de entrada lo escribe en la salida de errores con código 1 — cambio mínimo (~5 líneas en `src/app.js`); `libres`, `reservar` y `cancelar` siguen igual. Coste: un camino de error nuevo en un fichero que no tenía ninguno.
- B. `run` devuelve `{ salida, error, codigo }` en todos los comandos — contrato uniforme, pero obliga a reescribir los tres comandos y sus tests, y toca lo que no entra.
- C. Un módulo `src/exportar.js` aparte — separa la función, pero `operations.md` fija un solo fichero de entrada y la función son 3 líneas.
- Elegido: A — el menor cambio que da el camino de error que pide el dev-lead; B toca lo que no entra, C divide un código que cabe en una función.

`exportar` filtra `bookings` por sala, en su orden, y devuelve `dia;franja` más una línea `dia;franja` por reserva, unidas por `\n`. El punto de entrada envuelve la llamada a `run` en `try/catch`: el mensaje del error va a `console.error` y `process.exitCode = 1`.

## Dónde se prueba

- CSV de una sala con y sin reservas, sala desconocida y sala ausente: por `run`, como los tests actuales de `test/app.test.js` (`assert.equal`, y `assert.throws` para los errores).
- Error por la salida de errores, salida estándar vacía y código 1: lanzando `node src/app.js exportar Nrote` como proceso y mirando stdout, stderr y el código; es lo único que `run` no ve.
- Que el fichero abre en dos columnas: a mano por el dev-lead, en su validación.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — El CSV de una sala lista sus reservas

- GIVEN la sala `Norte` con la reserva `lun` `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `dia;franja` y, en la línea siguiente, `lun;10:00-12:00`
- AND la sala `Sur`, sin reservas, da solo `dia;franja`

#### ADDED — Una sala desconocida es un error, no un CSV vacío

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Nrote`
- THEN no sale nada por la salida estándar, sale `Sala desconocida: Nrote. Salas: Norte, Sur` por la salida de errores y el código de salida es 1

#### ADDED — Sin sala no hay exportación

- GIVEN el comando `exportar` sin argumento
- WHEN se ejecuta
- THEN no sale nada por la salida estándar, sale `Falta la sala. Uso: exportar <sala>` por la salida de errores y el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: la lista `bookings` en memoria de `src/app.js`
- **Idioma de los nombres**: comando y mensajes en castellano; cabecera `dia;franja`
- **Límites**: no aplica
- **Avisos**: sala desconocida y sala ausente, por la salida de errores y con código 1
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
