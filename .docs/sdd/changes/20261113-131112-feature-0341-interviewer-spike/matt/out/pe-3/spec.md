---
id: 20261113-145501-feature-0010-exportar-csv
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

🦆 Hoy el responsable de una sala no puede sacar sus reservas de `salas` para cuadrarlas los lunes. Con esto escribirá `salas exportar Norte > norte.csv` y obtendrá un fichero que su Excel en castellano abre en columnas con doble clic: `sala;dia;franja` y debajo `Norte;lun;10:00-12:00`. Si se equivoca de sala, el comando avisa por el canal de errores y no crea un CSV con el aviso dentro. Por dentro es un comando nuevo en `src/app.js` que recorre la lista de reservas y une los campos con `;`.

Validación: dev-lead — lo usa una persona con su hoja de cálculo; solo ella puede confirmar que el Excel en castellano lo abre en columnas.

## Capacidades

- Nuevas: `booking-export` — exportación de las reservas de una sala a CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores según la regla — señales: contrato público (el CSV es un formato de fichero que consume la hoja de cálculo) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (sonnet): si `sala;dia;franja` y las filas de «El CSV lleva una fila por reserva de la sala» bastan para cuadrar, y si el caso de la sala sin reservas es el esperable (señal: contrato público)
- Técnica (sonnet): si mandar el error por stderr con código 1 es compatible con `run` devolviendo texto y con el `if (command) console.log(...)` actual (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas sirven a quien cuadra
- **Estado real:** en esta sesión no hay herramienta para despachar subagentes, así que **no se despacharon revisores**. La revisión la hice yo, releyendo la spec en contra de los siete puntos (ver «Hallazgos de la review»). Si quieres revisores de verdad, dímelo y se lanzan en una sesión que pueda.

1. Cabecera `sala;dia;franja`, en minúsculas y sin tilde (`dia`) — la salida va sin BOM y en UTF-8: una tilde se vería rota en Excel; los datos de hoy (`lun`, `10:00-12:00`, `Norte`) son ASCII.
2. Una fila por reserva de esa sala, en el orden de la lista de reservas, columnas `sala;dia;franja` — son los tres campos que tiene una reserva hoy; no hay más que exportar.
3. Sala conocida sin reservas (p. ej. `Sur`): sale solo la cabecera y el código de salida es 0 — es un resultado válido, el responsable ve que no hay nada que cuadrar.
4. Sala desconocida (p. ej. `Oeste`) o sin indicar sala: stdout vacío, mensaje por stderr y código de salida 1 — con `> norte.csv`, un mensaje en stdout acabaría dentro del fichero como una fila falsa. Literales: `sala desconocida: Oeste` y `uso: salas exportar <sala>`.
5. El nombre de la sala se compara exacto y con mayúsculas, igual que `libres` y `rooms` hoy (`Norte`, no `norte`) — coherencia con lo existente; no hay petición de lo contrario.
6. Sin comillas ni escapes: ninguna sala, día ni franja actual contiene `;`, comillas o saltos de línea. Si algún día los hay, hay que revisarlo (fuera de este cambio).
7. Fin de línea `\n`; la salida termina en un solo salto de línea, el que añade `console.log` al imprimir.
8. Capacidad nueva `booking-export` (inglés, kebab-case): el proyecto no tiene capacidades y esta es la primera.
9. Repaso de coherencia: el delta se fusionó en una copia de `.docs/sdd` fuera del repo y `capability merge` salió con 0 (4 requisitos y 5 reglas añadidos a `booking-export.md`); `capability check`: «Capacidades válidas: 1». El repo no se tocó.
10. Enfoque: A (la función `run` lanza un `Error` y el punto de entrada lo traslada a stderr y `exit 1`), frente a B (que `run` devuelva el error como texto, como hace `cancelar`) y C (fichero con `--salida`, descartado por ti) — ver Approach.
- Política de modelos: ningún revisor despachado (sin herramienta de subagentes en esta sesión) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Autorrevisión de un solo agente (no hay revisores despachados); la hice contra los siete puntos y estos son los hallazgos:

- **Aceptado** — (3, hueco de alcance) el Intent hablaba de cuadrar reservas pero no decía qué pasa con una sala sin reservas → decisión 3 y su escenario.
- **Aceptado** — (4, decisión tomada en el cuerpo) el comportamiento ante error estaba solo en el THEN → decisión 4 con sus literales.
- **Aceptado** — (2, escenario que pasa sin el comportamiento) un THEN «el CSV es correcto» no distinguía de un CSV vacío → los THEN llevan la salida literal.
- **Rechazado** — (6, contrato) escapar `;` y comillas desde ya → no existe ningún dato que lo necesite; se anota como límite en la decisión 6.
- Sin hallazgos Críticos, así que no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- La sala se pide como argumento y el CSV sale por stdout; el responsable redirige con `>` — «Opción 1: `salas exportar <sala>` por stdout, y yo lo redirijo a un fichero con `>`.»
- Separador `;` porque el Excel del responsable está en castellano — «Con punto y coma (`;`), porque el Excel del responsable está en castellano. Cabecera y resto, decide tú.»

## Intent

Hoy el responsable de cada sala cuadra sus reservas los lunes en una hoja de cálculo, pero `salas` solo las usa por dentro: no hay forma de sacarlas. Se quiere un comando que escriba en CSV las reservas de una sala. Éxito: el responsable ejecuta `salas exportar Norte > norte.csv`, abre el fichero en su Excel en castellano con doble clic y ve tres columnas (`sala`, `dia`, `franja`) sin ningún paso de importación. Sería un fracaso, aunque funcione, que Excel lo abriera todo en una sola columna, o que un error de sala dejara un fichero con el aviso como si fuera una reserva.

## Scope

- Entra: comando `exportar <sala>` en `src/app.js`; sale por stdout un CSV con `;`, cabecera `sala;dia;franja` y una fila por reserva de la sala; errores por stderr con código 1; los tests de esos comportamientos.
- No entra: escribir a un fichero con `--salida` (lo descartó el dev-lead); exportar a `.ics` (es la fila 0009 del roadmap); exportar todas las salas a la vez; filtros por día; persistencia de las reservas (siguen en memoria, como hoy); escapado de `;` y comillas (ver decisión 6).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|0010"` (solo aparece la fila 0009 del roadmap, `.ics`, que es otra cosa y queda fuera)

## Approach

- A. `run('exportar', [sala])` devuelve el CSV como texto y **lanza un `Error`** si la sala falta o no existe; el punto de entrada lo atrapa, escribe el mensaje por stderr y sale con 1 — una función pura que se prueba sola con `assert.equal` y `assert.throws`, y una pequeña rama nueva en el punto de entrada.
- B. `run` devuelve el aviso de error como texto, como hacen hoy `cancelar` y el resto — cero cambios en el punto de entrada, pero con `> norte.csv` el aviso acaba dentro del fichero y sale con código 0.
- C. Escribir un fichero con `--salida` — descartado por el dev-lead.
- Elegido: A — es la única que cumple el criterio de fracaso del Intent (nada de avisos dentro del CSV) con un cambio pequeño; B es más simple pero rompe justo lo que importa.

Partes que fija A: `run` lanza `Error('sala desconocida: <nombre>')` o `Error('uso: salas exportar <sala>')`; el punto de entrada (`if (command)`) pasa a envolver la llamada en `try/catch`, escribe `error.message` con `console.error` y fija `process.exitCode = 1`. Los comandos existentes no lanzan, así que su comportamiento no cambia.

## Dónde se prueba

- CSV de una sala con reservas, de una sala sin reservas, y los dos errores en `run`: por `run('exportar', [...])` y `assert.throws`, como los tests actuales de `test/app.test.js`.
- stdout vacío y código 1 ante error: ejecutando `node src/app.js exportar Oeste` con `child_process.spawnSync` y comprobando `stdout`, `stderr` y `status` — es la única costura que ve la redirección real.
- Apertura en Excel en castellano: a mano, por el dev-lead, en la validación.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — El CSV lleva una fila por reserva de la sala

- GIVEN la sala `Norte` con la reserva `lun`, `10:00-12:00`
- WHEN el usuario ejecuta `salas exportar Norte`
- THEN la salida es `sala;dia;franja` en la primera línea y `Norte;lun;10:00-12:00` en la segunda, nada más, y el código de salida es 0
- AND redirigida con `> norte.csv`, el fichero tiene esas dos líneas y se abre en columnas en un Excel en castellano

#### ADDED — Una sala sin reservas se exporta con la cabecera sola

- GIVEN la sala `Sur`, sin reservas
- WHEN el usuario ejecuta `salas exportar Sur`
- THEN la salida es solo `sala;dia;franja` y el código de salida es 0

#### ADDED — Una sala desconocida no produce CSV

- GIVEN las salas `Norte` y `Sur`
- WHEN el usuario ejecuta `salas exportar Oeste`
- THEN stdout queda vacío, stderr dice `sala desconocida: Oeste` y el código de salida es 1

#### ADDED — Exportar sin indicar sala no produce CSV

- GIVEN cualquier estado de las reservas
- WHEN el usuario ejecuta `salas exportar` sin sala
- THEN stdout queda vacío, stderr dice `uso: salas exportar <sala>` y el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas, en memoria en `src/app.js`; el CSV no se guarda, solo se imprime
- **Idioma de los nombres**: cabecera y avisos en castellano, sin tildes en la cabecera (`dia`)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <nombre>` y `uso: salas exportar <sala>`, por stderr
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
