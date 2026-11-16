---
id: 20261114-224331-feature-0010-exportar-csv-sala
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

🦆 Hasta ahora no hay forma de sacar las reservas de una sala fuera de la terminal. Con esto, `salas exportar Norte > norte.csv` te deja un fichero que abres en tu hoja de cálculo: una fila por reserva (`Norte;lun;10:00-12:00`) bajo la cabecera `sala;dia;franja`, con todas las reservas de esa sala. Si la sala no existe, no escribe nada en el fichero y avisa por el canal de errores. Por dentro es una función nueva en `src/app.js` que filtra la lista de reservas por sala y la formatea.

Validación: dev-lead — lo que usa una persona: hay que abrir el CSV en la hoja de cálculo real y ver que las columnas salen separadas.

## Capacidades

- Nuevas: `bookings-export` — exportación de las reservas de una sala a un fichero para hoja de cálculo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: **no despachada** — señales: contrato público (el formato del CSV lo consume una hoja de cálculo), capacidad nueva · tamaño: ~60 líneas en 3 ficheros (`src/app.js`, `test/app.test.js`, spec)
- Dominio (opus): si la cabecera y el separador cuadran con lo que la hoja del responsable espera, y qué NO debe salir en el fichero (señal: contrato público)
- Técnica (sonnet): si el error por `stderr` con código 1 rompe el contrato de `run` o de los otros comandos (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar la lente técnica del cambio en el punto de entrada
- Esta sesión no tiene herramienta para lanzar subagentes, así que ninguna lente se ha ejecutado: la spec va sin review externa y el dev-lead decide al aprobar si quiere una antes de implementar.

1. **Enfoque: función en `src/app.js` y salida por `stdout`** — frente a un módulo `src/csv.js` y a una opción `--salida fichero` (ver Approach).
2. **Nombre del comando: `exportar`** — el resto de comandos son verbos en castellano (`libres`, `reservar`, `cancelar`).
3. **Separador `;`** — una hoja de cálculo con configuración regional española separa columnas por `;`: con `,` abriría todo en una sola columna. Coste: una hoja en configuración inglesa tendría que indicar el separador al importar.
4. **Cabecera `sala;dia;franja`**, en minúsculas y `dia` sin tilde — evita problemas de codificación al abrirlo sin marca BOM. Mismos nombres que los campos `room`, `day`, `slot` de la reserva, traducidos.
5. **Sin comillas ni escape** — hoy sala, día y franja no pueden contener `;`, comillas ni saltos de línea; si algún día pueden, se amplía.
6. **Orden de las filas: el de la lista de reservas**, sin reordenar — es el orden en que se hicieron; nadie pidió otro.
7. **Fin de línea `\n`** — las hojas de cálculo lo aceptan y es el de `console.log`.
8. **Nombre de sala exacto** (`Norte`, no `norte`) — igual que `libres` compara hoy.
9. **Sala desconocida: `sala desconocida: Oeste`, por `stderr`, código de salida 1, nada por `stdout`** — así `> norte.csv` no guarda el mensaje de error dentro del fichero. Para ello `run` lanza un `Error` y el punto de entrada lo imprime; no cambia lo que devuelve `run` en los demás comandos.
10. **Sin sala: `uso: salas exportar <sala>`**, mismo canal y código que la anterior.
11. **Sala sin reservas: solo la cabecera**, no es un error — la hoja del responsable tiene que poder quedar «vacía» un lunes.
12. **Capacidad nueva `bookings-export`** — hoy no hay capacidades; el slug va en inglés.
13. **Reglas de la capacidad** inventadas por mí, porque la constitución no tiene «Reglas de producto»: datos en memoria (`bookings` de `src/app.js`), nombres en castellano (art. IV), sin límites, avisos los dos de arriba, sin conflicto posible.
14. **Validación `dev-lead`** — lo observa una persona en su hoja de cálculo.
15. **Sin tope de tamaño ni paginación** — la lista vive en memoria y es de una sala.
16. **Prueba del delta sobre una copia de `.docs/sdd`**: `sdd capability merge` añade los 4 requisitos y las 5 reglas de `bookings-export` (código 0) y `sdd capability check` da «Capacidades válidas: 1». `capabilities/` del repo no se ha tocado.
- Política de modelos: ningún revisor de spec (ver el bloque de review) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Se exportan **todas** las reservas de la sala, sin filtro por día — «La 1️⃣, todas las reservas de la sala. Lo demás, decide tú.»
- Todo lo no listado aquí, lo decide el agente (ver ✋) — «Lo demás, decide tú.»

## Intent

Hoy las reservas solo se ven en la terminal. El responsable de cada sala las cuadra los lunes en su hoja de cálculo y ahora tiene que copiarlas a mano. Con `salas exportar <sala>` obtiene un CSV de esa sala que abre directamente en la hoja, con las columnas ya separadas. Éxito: un fichero generado con `salas exportar Norte > norte.csv` se abre en la hoja de cálculo con tres columnas y una fila por reserva, sin retocar nada. Anti-objetivo: que el mensaje de error acabe dentro del CSV, o que la hoja muestre todo en una sola columna.

## Scope

- Entra: comando `exportar <sala>` que escribe por `stdout` el CSV de todas las reservas de la sala; errores de sala desconocida y de falta de sala; captura de errores en el punto de entrada (`stderr`, código 1).
- No entra: filtro por día o por fecha (la reserva no guarda fecha); opción para escribir a fichero; exportar todas las salas de golpe; otros formatos (`.ics` es la 0009); comillas y escape; cambiar el manejo de errores de los demás comandos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n 0010` (sin resultados fuera de esta spec; la 0010 se reservó para esta feature y no tiene fila en `ROADMAP.md`).

## Approach

- **A. Función en `src/app.js`, salida por `stdout`** — el proyecto tiene un único fichero de entrada (`operations.md`) y `run` devuelve cadenas que el punto de entrada imprime; encaja sin tocar nada más. Coste: `app.js` crece unas veinte líneas.
- **B. Módulo nuevo `src/csv.js`** — separa el formato, pero para una función de diez líneas añade un fichero y contradice «un solo fichero de entrada».
- **C. Opción `--salida fichero`** — evita la redirección de la terminal, pero añade escritura a disco, rutas y sobrescritura, que nadie pidió; `> norte.csv` ya lo hace.
- Elegido: **A** — es lo más corto y no añade superficie que mantener.

Cómo: `run('exportar', [sala])` comprueba que la sala está en `rooms`; si no, lanza `Error('sala desconocida: <sala>')`; si no hay sala, `Error('uso: salas exportar <sala>')`. Devuelve `['sala;dia;franja', ...filas].join('\n')`, con las filas de `bookings` de esa sala en su orden. El punto de entrada envuelve `console.log(run(...))` en un `try/catch` que imprime el mensaje por `stderr` y deja `process.exitCode = 1`.

## Dónde se prueba

- Exportar una sala con reservas y una sin ellas: por `run('exportar', [sala])`, como los tests actuales de `libres` y `cancelar`.
- Sala desconocida y falta de sala: `assert.throws` sobre `run`, mismo patrón.
- Mensaje por `stderr`, código 1 y `stdout` vacío: un único test que lanza `node src/app.js exportar Oeste` como proceso hijo — es la única costura nueva, porque el punto de entrada no se puede llamar desde `run`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings-export`

#### ADDED — Exportar a CSV las reservas de una sala

- GIVEN la sala `Norte` tiene una reserva el `lun` de `10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida es exactamente `sala;dia;franja` en la primera línea y `Norte;lun;10:00-12:00` en la segunda, separadas por `\n`
- AND el código de salida es 0

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala `Sur` no tiene reservas y `Norte` tiene una el `lun` de `10:00-12:00`
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida es solo `sala;dia;franja`, sin filas de `Norte`
- AND el código de salida es 0

#### ADDED — Exportar una sala que no existe falla sin escribir en la salida

- GIVEN las salas son `Norte` y `Sur`
- WHEN se ejecuta `salas exportar Oeste`
- THEN por `stderr` sale `sala desconocida: Oeste`, la salida estándar queda vacía y el código de salida es 1

#### ADDED — Exportar sin indicar sala muestra el uso

- GIVEN las salas son `Norte` y `Sur`
- WHEN se ejecuta `salas exportar` sin argumentos
- THEN por `stderr` sale `uso: salas exportar <sala>`, la salida estándar queda vacía y el código de salida es 1

#### Reglas de la capacidad — bookings-export

- **Dónde viven los datos**: en memoria, en la lista `bookings` de `src/app.js`
- **Idioma de los nombres**: castellano (comando, cabecera y mensajes), sin tildes en la cabecera
- **Límites**: ninguno
- **Avisos**: `sala desconocida: <sala>` y `uso: salas exportar <sala>`, por `stderr` con código 1
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
