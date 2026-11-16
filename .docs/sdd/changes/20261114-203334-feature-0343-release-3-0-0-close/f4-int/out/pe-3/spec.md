---
id: 20261116-154731-feature-0010-export-reservas-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala fuera de la herramienta. Con esta feature, `salas exportar Norte` imprime en pantalla las reservas de Norte como filas separadas por `;` (por ejemplo `Norte;lun;10:00-12:00`), y el responsable las guarda con `salas exportar Norte > norte.csv` y las abre con doble clic en su Excel en castellano, cada dato en su columna. Si la sala no existe, el comando falla con un aviso por el canal de errores, así que el fichero redirigido queda vacío y no se confunde con una sala sin reservas. Por dentro es un comando más en `run` de `src/app.js` que filtra `bookings` por sala.

Validación: dev-lead — lo consume una persona en su Excel; solo ella ve si las columnas caen en su sitio.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (la rúbrica los da por contrato público: el CSV lo consume el Excel del responsable) — señales: capacidad nueva, contrato público (formato del CSV) · tamaño: ~30 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (sonnet): si los escenarios cubren lo que el responsable hace el lunes: sala con reservas, sala sin reservas, sala mal escrita y comando sin sala, con datos (señal: capacidad nueva)
- Técnica (sonnet): si el CSV con `;` y salto `\n` se abre en columnas en Excel en castellano, y si el error por `stderr` con código 1 se puede probar con la costura existente (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar la lente técnica separada del formato del CSV
**Estado de la review: no despachada.** Esta sesión no tiene herramienta de subagentes, así que no hay revisores independientes. He pasado yo los siete puntos sobre esta spec en el hilo y no he encontrado contradicciones; no equivale a una revisión adversarial, y si la quieres, se lanza desde una sesión que pueda.

1. Capacidad nueva `booking-export` (slug en inglés, kebab-case) — no hay capacidades en el proyecto y esto no cabe en ninguna.
2. Nombre del comando: `exportar <sala>` — nadie lo dijo; coincide con el verbo del resto de comandos en infinitivo/imperativo (`libres`, `reservar`, `cancelar`).
3. Cabecera del CSV: `sala;dia;franja` — sin tilde en `dia` para que el nombre de columna sea seguro en cualquier codificación; son las tres claves de cada reserva en `bookings`.
4. Una fila por reserva, en el orden de `bookings`, sin comillas ni espacios alrededor de `;`. Saltos de línea `\n`.
5. El nombre de la sala se compara exacto, con mayúscula inicial como en `rooms` (`Norte`, no `norte`) — igual que `reservar Norte`. Un `norte` da el error de sala inexistente.
6. Sala que existe pero sin reservas (`Sur`): imprime solo la cabecera y sale con código 0.
7. Sala que no existe: el aviso va por `stderr`, con código de salida 1 y la salida estándar vacía — tú elegiste «decide tú» entre error o solo cabecera; elijo error, y por `stderr` en vez de por la salida estándar para que `salas exportar Oeste > oeste.csv` deje el fichero vacío en vez de con el aviso dentro (mejora el coste que te presenté en la opción 1).
8. Textos del aviso: `No existe la sala Oeste. Salas: Norte, Sur` y, sin argumento, `Falta la sala. Uso: exportar <sala>` (también `stderr`, código 1).
9. Sin BOM, sin comillas de escape ni filtro por día: los datos de hoy no llevan `;` ni comillas, y `bookings` solo guarda día de la semana (`lun`), no fechas, así que no hay «las de esta semana» que filtrar; se exportan todas las reservas de la sala.
10. Enfoque: `run` lanza un `Error` con el aviso y el punto de entrada lo captura y lo escribe por `stderr` (ver Approach).
11. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade los 4 requisitos y las 5 reglas de `booking-export` sin rechazos, y `sdd capability check` da «Capacidades válidas: 1».
- Política de modelos: sin revisores de la spec (no despachados, ver arriba) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (un fichero) · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Sin revisores independientes; mi pasada de los siete puntos:
- **Aceptado** — la separación por `;` es lo que hace que Excel en castellano abra en columnas y está en un THEN con datos → escenario «Exportar las reservas de una sala» fija la salida exacta, sin comas.
- **Aceptado** — un aviso por la salida estándar acabaría dentro del fichero redirigido → el aviso va por `stderr` (decisión 7).
- **Sin medir** — que Excel interprete `10:00-12:00` como texto y no como hora o fecha: no hay Excel en esta sesión; lo comprueba el dev-lead en la validación.

### Decisiones tomadas con el dev-lead

- La salida va a la salida estándar y el dev-lead la redirige a fichero — «Opción 1: a la salida estándar. Yo lo redirijo a un fichero.»
- Separador `;`, porque el Excel del responsable está en castellano — «Punto y coma (1️⃣), porque el Excel del responsable está en castellano. La hoja es ese Excel.»
- Sala inexistente: decide el agente (ver ✋ 7) — «No sé, decide tú.»
- Anti-objetivo: que al abrirlo en Excel todo caiga en una sola columna, o que sala, día y franja no queden en su sitio — «Que al abrirlo en el Excel todo caiga en una sola columna, o que las salas, los días y las franjas no queden en su sitio.»

## Intent

El responsable de cada sala cuadra los lunes sus reservas en una hoja de cálculo (Excel en castellano) y hoy tiene que copiarlas a mano porque la herramienta no las saca. Se quiere un comando cuya salida se abra directamente en esa hoja. Éxito: `salas exportar Norte > norte.csv` y doble clic en `norte.csv` deja una fila por reserva con sala, día y franja cada uno en su columna. Fracaso aunque funcione por dentro: todo en una sola columna, o datos en columnas cambiadas, o un aviso de error dentro del fichero.

## Scope

- Entra: comando `exportar <sala>` que imprime el CSV de las reservas de esa sala; aviso por `stderr` con código 1 para sala inexistente y para falta de sala.
- No entra: escribir el fichero desde la herramienta (se redirige), exportar todas las salas a la vez, filtrar por día, el calendario `.ics` (es la fila 0009), BOM o escapado de `;` y comillas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -n -i "exportar\|csv" -- . ':!.docs/sdd/specs'`, solo aparece la fila 0009 (.ics) de `ROADMAP.md`, que es otra feature. La feature 0010 no tiene fila propia en el roadmap.

## Approach

- A. `run` lanza un `Error` con el texto del aviso para los dos casos de error; el punto de entrada (`if (command)`) lo captura, escribe el mensaje por `stderr` y fija `process.exitCode = 1`. Mínimo cambio: `run` sigue devolviendo una cadena en el caso feliz y los tres tests existentes no se tocan.
- B. `run` devuelve `{ out, err, code }`. Más explícito, pero obliga a cambiar los tres tests existentes y `libres`/`reservar`/`cancelar` solo por esta feature.
- C. El aviso por la salida estándar con código 0 (como el resto de comandos). Es lo más cercano a lo que ya hace `run`, pero el aviso acabaría dentro de `norte.csv` y no se distingue de una sala vacía en un script.
- Elegido: A — es lo único que mantiene el aviso fuera del fichero redirigido sin reescribir lo existente.

Detalle del cómo: la cabecera es la constante `sala;dia;franja`; las filas se construyen con `[room, day, slot].join(';')` de `bookings.filter(b => b.room === sala)`; el resultado se une con `\n`.

## Dónde se prueba

- CSV con reservas, CSV sin reservas: `run('exportar', ['Norte'])` y `run('exportar', ['Sur'])`, como los tests de `libres` actuales (`assert.equal` sobre la cadena exacta).
- Sala inexistente y sin sala: `assert.throws` sobre `run`, con el mensaje exacto.
- `stderr`, código 1 y salida estándar vacía: un único test que lanza `node src/app.js exportar Oeste` con `node:child_process` y comprueba `stderr`, `status` y `stdout`; es la única costura que ve lo que realmente ve quien redirige.
- Que Excel abre las columnas bien: lo valida el dev-lead con el Excel del responsable.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte tiene la reserva `lun 10:00-12:00`
- WHEN se ejecuta `salas exportar Norte`
- THEN la salida estándar es exactamente `sala;dia;franja` en la primera línea y `Norte;lun;10:00-12:00` en la segunda, separadas por salto de línea, sin comas ni comillas, y el código de salida es 0

#### ADDED — Sala existente sin reservas

- GIVEN la sala Sur existe y no tiene reservas
- WHEN se ejecuta `salas exportar Sur`
- THEN la salida estándar es solo `sala;dia;franja` y el código de salida es 0

#### ADDED — Sala inexistente

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `salas exportar Oeste`
- THEN `stderr` dice `No existe la sala Oeste. Salas: Norte, Sur`, la salida estándar queda vacía y el código de salida es 1

#### ADDED — Exportar sin indicar sala

- GIVEN cualquier estado
- WHEN se ejecuta `salas exportar`
- THEN `stderr` dice `Falta la sala. Uso: exportar <sala>`, la salida estándar queda vacía y el código de salida es 1

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: en memoria, en `bookings` de `src/app.js`; nada se escribe a disco.
- **Idioma de los nombres**: castellano en cabecera (`sala;dia;franja`) y avisos.
- **Límites**: no aplica.
- **Avisos**: sala inexistente y falta de sala, por `stderr` con código 1 (ver escenarios).
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
