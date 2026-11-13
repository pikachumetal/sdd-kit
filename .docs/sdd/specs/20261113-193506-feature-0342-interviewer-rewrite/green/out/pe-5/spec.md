---
id: 20261113-214037-feature-0010-exportar-reservas-csv
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

🦆 Hoy `salas` no tiene forma de sacar las reservas a una hoja de cálculo. Con esta feature, `salas exportar Norte > norte.csv` escribe en `norte.csv` una línea de cabecera y una línea por reserva de esa sala: `Norte;lun;10:00-12:00`. Las columnas van separadas por punto y coma, para que el Excel en castellano del responsable las abra ya en columnas. Si la sala no existe, no se escribe nada en el CSV y el error sale aparte, por la salida de errores. Por dentro, es un comando nuevo en `src/app.js` que recorre las reservas de la sala y las formatea.

Validación: dev-lead — lo que se entrega es un fichero que una persona abre en su hoja de cálculo; ningún test mide cómo lo muestra un Excel en castellano.

## Capacidades

- Nuevas: `room-booking-export` — exportar a CSV las reservas de una sala.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-booking-export`), contrato público (un formato de fichero que consume la hoja de cálculo del responsable) · tamaño: ~40 líneas en 3 ficheros
- Dominio (sonnet): si el CSV de `Norte` con una reserva lun 10:00-12:00 da lo que el responsable necesita para cuadrar la semana, y qué pasa con las reservas semanales que hoy no se guardan (señal: capacidad nueva). Sonnet porque no hay roles ni reglas de flujo.
- Técnica (sonnet): si el error por la salida de errores es coherente con que `run` devuelva texto, y si el entrecomillado cubre franjas sin validar (señal: contrato público).
- Mínimo razonable: solo técnica — deja sin mirar si el CSV cuadra con lo que el responsable necesita.

⚠️ **No se han despachado revisores**: esta sesión no tiene herramienta para lanzar subagentes. Los dos revisores de arriba son lo que la rúbrica pide y **no se han ejecutado**. En su lugar, yo mismo repasé la spec con los siete puntos, y esa lectura no es independiente. Si quieres la review de verdad, dímelo y se lanza desde una sesión que pueda.

### Hallazgos de la review

- **Aceptado** — (mi repaso, punto 2) la decisión 9 promete entrecomillar saltos de línea y ningún escenario lo cubría → añadido un AND al escenario de entrecomillado.
- **Repaso de coherencia**: `sdd capability merge` sobre una copia de `.docs/sdd` termina sin error y añade `room-booking-export.md` con 5 requisitos y 5 reglas; el `capabilities/` del repo no cambia. `git grep -niE "exportar|csv"` solo encuentra la fila 0009.

1. Nombre del comando: `exportar <sala>` — nadie lo dijo; sigue el castellano y el estilo de verbo de `libres`, `reservar`, `cancelar`.
2. Columnas: `sala;dia;franja`, con cabecera, una línea por reserva — son los tres campos que tiene hoy una reserva; sin cabecera la hoja de cálculo no sabría qué es cada columna.
3. Qué se exporta: todas las reservas guardadas de esa sala, sin filtro de semana — las reservas solo guardan el día de la semana (`lun`), no una fecha, así que no hay con qué filtrar.
4. Orden: el de alta de las reservas — es el único que existe hoy.
5. Sala sin reservas: solo la cabecera `sala;dia;franja`.
6. Sala que no existe (`exportar Oeste`): nada por la salida normal; por la de errores `sala desconocida: Oeste`, con código de salida 1 — la salida se redirige a un fichero, y un mensaje en ella acabaría dentro del CSV.
7. Sin sala (`exportar`): nada por la salida normal; por la de errores `uso: exportar <sala>`, con código de salida 1 — mismo motivo que la 6.
8. Nombre de la sala: se compara tal cual, con mayúsculas (`Norte`, no `norte`) — como hace hoy `libres`.
9. Valores con `;`, comillas o salto de línea: se entrecomillan con comillas dobles y las comillas internas se duplican — la franja horaria no se valida hoy (deuda «Sin validación del formato de franja horaria»), así que puede traer cualquier cosa.
10. Codificación: UTF-8 sin BOM y saltos de línea `\n` — las salas actuales (`Norte`, `Sur`) no llevan tildes. Riesgo: una sala con tilde se vería mal en Excel; si pasa, se añade el BOM.
11. Las reservas semanales (`reservar Norte --cada-semana`) no se exportan: hoy ese comando no guarda ninguna reserva, solo devuelve «reserva semanal creada».
12. Fuera de la feature: cómo llega el fichero al responsable — «Cómo le llega ese fichero al responsable no lo sé, decide tú».
13. Enfoque: A, frente a B y C (ver Approach).
- Pendiente de ti: con qué compara el responsable el CSV para cuadrar las reservas — «Con qué lo compara para cuadrarlas, no sé». Si lo compara con otra lista, quizá le falten columnas.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Separador de columnas: punto y coma — «Punto y coma (opción 1): el Excel del responsable está en castellano.»
- El CSV sale por la salida normal y lo redirige quien ejecuta el comando — «Lo ejecuto yo y redirijo la salida a un fichero.»

## Intent

Hoy el responsable de cada sala no puede ver sus reservas fuera de la terminal, y cada lunes las cuadra en su hoja de cálculo. Quiero que `salas exportar <sala>` dé un CSV que esa hoja abra en columnas sin tocarlo. El éxito es abrir el fichero de `Norte` en el Excel en castellano y ver tres columnas con la reserva `Norte · lun · 10:00-12:00`. Fracasaría, aunque funcionara, si el CSV saliera todo en una columna, o si un mensaje de error acabara dentro del fichero.

## Scope

- Entra: comando `exportar <sala>` con el CSV descrito en las decisiones 2 a 11 y los errores de las decisiones 6 y 7.
- Entra, si el RED lo exhibe: nada.
- No entra: filtrar por semana o fecha; exportar todas las salas a la vez; escribir el fichero desde el propio comando; entregar el fichero al responsable; el formato `.ics` (es la fila 0009); validar el formato de la franja.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv"`, que solo encuentra la fila 0009 (`.ics`), otra idea que queda fuera. Esta feature no tiene fila en el roadmap; la crea el cierre o `sdd-roadmap`.

## Approach

- A. Función `exportRoom(room)` en `src/app.js` que arma el texto del CSV, y `run('exportar', params)` la llama. Los errores son excepciones que la entrada del programa captura para escribirlas por la salida de errores y fijar el código 1 — un cambio mínimo, en el único fichero de entrada que define `operations.md`.
- B. Que `run` devuelva un objeto `{ out, err, code }` para todos los comandos — obliga a reescribir `libres`, `reservar` y `cancelar` y sus tests por una sola feature.
- C. Que el comando escriba él mismo el fichero (`exportar Norte norte.csv`) — contradice la decisión del dev-lead de redirigir la salida, y hay que decidir qué hacer si el fichero ya existe.
- Elegido: A — es el único que no toca los comandos existentes ni contradice lo que dijo el dev-lead.

`run('exportar', ['Norte'])` devuelve el texto del CSV y no lo imprime; imprimir sigue siendo cosa de la entrada del programa, como hoy.

## Dónde se prueba

- CSV de una sala con reservas, sin reservas y entrecomillado: `run('exportar', [...])` en `test/app.test.js`, como los tests actuales.
- Sala desconocida y sin sala: `run` lanza el error con el texto de las decisiones 6 y 7, con el mismo patrón.
- Salida de errores y código 1: un test que ejecuta `node src/app.js exportar Oeste` y mira stdout vacío, stderr y código de salida; es la única forma de comprobar lo que se redirige. El Excel en castellano lo valida el dev-lead a mano.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-booking-export`

#### ADDED — El CSV de una sala lleva una línea por reserva

- GIVEN la sala `Norte` con la reserva `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND solo salen reservas de `Norte`, nunca las de `Sur`

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `sala;dia;franja`

#### ADDED — Los valores con separador se entrecomillan

- GIVEN la sala `Norte` con una reserva cuya franja es `10:00;12:00`
- WHEN se ejecuta `exportar Norte`
- THEN esa línea es `Norte;lun;"10:00;12:00"`
- AND una comilla dentro de un valor se duplica: `a"b` sale como `"a""b"`
- AND un valor con salto de línea también se entrecomilla: `a` y `b` en dos líneas salen como `"a` / `b"`

#### ADDED — Una sala desconocida no escribe en el CSV

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN no sale nada por la salida normal
- AND por la salida de errores sale `sala desconocida: Oeste`
- AND el código de salida es 1

#### ADDED — Sin sala no se exporta nada

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar` sin sala
- THEN no sale nada por la salida normal
- AND por la salida de errores sale `uso: exportar <sala>`
- AND el código de salida es 1

#### Reglas de la capacidad — room-booking-export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; el CSV no se guarda, sale por la salida normal.
- **Idioma de los nombres**: castellano (`sala`, `dia`, `franja`, `exportar`).
- **Límites**: sin tope de filas; sin filtro de semana ni de fecha.
- **Avisos**: `sala desconocida: <sala>` · `uso: exportar <sala>`, ambos por la salida de errores.
- **Regla ante conflicto**: no aplica.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
