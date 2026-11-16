---
id: 20261113-141448-feature-0010-exportar-reservas-csv
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

🦆 Nuevo comando `exportar <sala>`: imprime las reservas de esa sala como una tabla CSV que Excel abre en columnas. Ejemplo: `exportar Norte` imprime `sala;dia;franja` y debajo `Norte;lun;10:00-12:00`. El responsable lo guarda con `> norte.csv`, lo abre en Excel y lo cuadra con su hoja. Si la sala no existe o falta, el aviso sale por el canal de errores y no se cuela en el fichero. Por dentro es una función más en `src/app.js` que filtra la lista de reservas por sala; nada se escribe a disco.

Validación: dev-lead — lo usa una persona con Excel; solo ella ve si las columnas abren bien y le sirven para cuadrar.

## Capacidades

- Nuevas: `booking-export` — exportar las reservas de una sala a CSV.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el CSV lo consume Excel) · tamaño: ~20 líneas de código y ~120 de spec en 2 ficheros
- Dominio (sonnet): si el THEN de `exportar Norte` y el orden de columnas `sala;dia;franja` sirven al responsable que cuadra en Excel, y si falta el caso de una sala con varias reservas (señal: contrato público)
- Técnica (sonnet): si el `;` sin comillas ni BOM abre en columnas en Excel es-ES y si `exportar` sin sala o con sala desconocida colisiona con el `return 'salas'` final de `run` (señal: contrato público + capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si el contenido sirve al responsable para cuadrar
```

Repaso de coherencia: `sdd capability merge` sobre copia de `.docs/sdd` → añadidos a `booking-export.md` sin rechazos (se repite tras la review); `git grep -niE "exportar|csv"` sin más sitios que la fila 0009 (otra cosa). No hay `capabilities/` previo: el delta no se contrasta con verdad viva, solo con el código.

1. Nombre del comando: `exportar <sala>` — en castellano como `libres`, `reservar`, `cancelar` (constitution, regla 4).
2. CSV por stdout, sin fichero propio: el responsable lo guarda con `> norte.csv`. Coherente con `run`, que devuelve texto; evita decidir rutas y sobrescrituras.
3. Separador `;`: Excel con configuración regional española abre un CSV con `,` en una sola columna. Salto de línea `\n` (Excel lo admite). Lo que devuelve `run` no lleva `\n` final; el fichero guardado sí termina en `\n`, porque `console.log` lo añade.
4. Columnas, en este orden: `sala;dia;franja`, tal como las guarda cada reserva. Sin BOM UTF-8 y cabeceras sin tilde: hoy todos los datos son ASCII. Riesgo conocido: una sala con tilde (`Ágora`) se vería mal en Excel sin BOM; y en PowerShell 5, `>` guarda UTF-16 y Excel lo lee mal (en PowerShell 7 o en bash, UTF-8). La columna `sala` repite el mismo valor en todas las filas pero permite juntar exports de varias salas. `franja` va entera (`10:00-12:00`), sin partir en inicio y fin: el responsable no dijo qué columna usa para cuadrar, así que decido tres columnas fieles a los datos; si le hace falta partirla, es lo primero que se verá en la validación.
5. Sin fechas de calendario: las reservas solo guardan el día de la semana (`lun`), la columna `dia` lo copia tal cual. «Formato de fecha» no aplica hasta que las reservas guarden fechas reales; si la hoja del responsable pide fechas, quedará fuera (riesgo a validar).
6. Orden de filas: el de la lista de reservas (orden de alta), sin reordenar. Lo exportado es lo que hay en la lista; hoy `cancelar` no modifica la lista, así que no afecta.
7. El nombre de la sala es sensible a mayúsculas, como en `libres`: `exportar norte` es sala desconocida.
8. Una sala sin reservas devuelve solo la cabecera: `sala;dia;franja`.
9. Errores: sala desconocida (`exportar Oeste`) → `sala desconocida: Oeste`; sin sala (`exportar`) → `uso: exportar <sala>`. Textos míos. `run` lanza un `UsoError` (clase nueva de `src/app.js`, exportada); el bloque final captura solo ese tipo, imprime el mensaje por stderr y sale con código 1, y cualquier otro error se relanza como hoy. Así `exportar Oeste > norte.csv` no deja un «CSV» con el aviso dentro, y `libres`, `reservar` y `cancelar` se comportan igual que hoy. Esto cambia el bloque final de `src/app.js` (ver «Lo que se retira o cambia de forma»).
9 bis. Argumentos raros: `exportar ""` (cadena vacía) se trata como falta de sala → `uso: exportar <sala>`; argumentos sobrantes (`exportar Norte extra`) se ignoran. Decisión mía: es lo más simple y no rompe nada.
10. Sin comillas ni escapado: hoy los valores son fijos y no llevan `;`. Riesgo conocido: la deuda «Sin validación del formato de franja horaria» permitiría una franja con `;`, que descuadraría la fila; se queda fuera.
11. Sala desconocida = que no esté en la lista `rooms` de `src/app.js` (no «sin reservas»): Sur existe y está vacía.
12. `exportCsv(room, list = bookings)` se exporta de `src/app.js` y es pura: filtra por sala sin validar (`exportCsv('Oeste')` devuelve solo la cabecera). Quien valida la sala contra `rooms` es `run`, que lanza el `UsoError`. Así se prueba con una lista propia (varias reservas, orden, filtro) sin cambiar los datos de ejemplo. La rama `exportar` de `run` va antes del `return 'salas'` final.
13. Capacidad nueva `booking-export` (la primera del proyecto); la declaro yo.
14. Enfoque: A (función `exportCsv` junto a `freeRooms`), frente a B (módulo `src/csv.js`) y C (escribir el fichero); ver Approach.
15. Pruebas: los escenarios con los datos de ejemplo de `bookings` son pruebas de humo sobre datos fijos (si cambia el dato, cambia el test); el comportamiento de stderr y código 1 se prueba con un proceso real (`child_process.spawnSync`, sin dependencias nuevas), y «Excel lo abre en tres columnas» es un paso manual de la validación.
- Política de modelos (`delegate`): revisores de la spec con sonnet, dominio y técnica, más una segunda ronda con un revisor sonnet de los siete puntos (hechas) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents` (3).

### Hallazgos de la review

- **Aceptado** — Técnica 1: el THEN no fija el literal exacto → los THEN llevan el string completo, sin `\n` final (decisión 3).
- **Aceptado** — Técnica 2 y 3: sin BOM solo vale con datos ASCII; `\n`; PowerShell 5 guarda UTF-16 → decisión 4 lo dice como riesgo conocido.
- **Aceptado** — Técnica 4: un escenario mezclaba dos casos → separados (sala desconocida / sin sala), con el literal y la regla de distinguir `undefined`.
- **Aceptado** — Técnica 5 y Dominio 4 (mayúsculas) → decisión 7 y un THEN (`exportar norte`).
- **Aceptado** — Técnica 6 y 9 y Dominio 1 (varias reservas, orden, sembrar datos) → decisiones 6 y 12 y un escenario con dos reservas.
- **Aceptado** — Técnica 7 y Dominio 2 (avisos por stdout dentro del fichero) → decisión 9 (stderr y código 1).
- **Aceptado** — Técnica 8: dónde va la rama y qué se exporta → decisión 12.
- **Aceptado** — Dominio 3: de dónde sale la lista de salas → decisión 11 y «Dónde viven los datos».
- **Aceptado** — Dominio 4: límite y conflicto de `;` → «Límites» y «Regla ante conflicto».
- **Aceptado** — Dominio 6: cabeceras sin tilde → «Idioma de los nombres».
- **Aceptado** — Dominio 7: matizar el éxito → Intent.
- **Aceptado** — Dominio 9: no hay verdad viva previa → nota en el repaso.
- **Aceptado** (ronda 2) — 1 Crítico: el aviso por stderr con código 1 no tenía escenario → un THEN de proceso y una prueba con `spawnSync` (decisión 15).
- **Aceptado** (ronda 2) — 2 Crítico: el `catch` del bloque final cambiaba todos los comandos → `UsoError` y solo ese tipo se captura (decisión 9); anotado en Scope y en «Lo que se retira o cambia de forma».
- **Aceptado** (ronda 2) — 3 y 4: alcance oculto y quién valida la sala → Scope, tabla y decisión 12 (`run` valida, `exportCsv` es pura).
- **Aceptado** (ronda 2) — 5: cadena vacía y argumentos sobrantes → decisión 9 bis y un THEN.
- **Aceptado** (ronda 2) — 6 y 7: criterio de éxito en Excel y datos fijos → decisión 15 y «Dónde se prueba».
- **Aceptado** (ronda 2) — 8, 9 y 10: política de modelos numerada, riesgo de valores no ASCII en «Límites», `\n` final del fichero → decisión 3 y reglas.
- **Rechazado** — Dominio 5 (partir `franja` en inicio y fin, quitar `sala`): el usuario delegó las columnas; partir inventa una necesidad que nadie ha dicho. Queda dicho en la decisión 4 y se valida con el responsable.
- **Rechazado** — Dominio 8 (PRODUCT.md dice que no hay más usuarios): el propio pedido nombra al responsable de cada sala; PRODUCT.md puede estar desfasado, se lo digo al dev-lead en el gate.
- **Rechazado** — Técnica 10 (quitar el resultado del repaso): se reproduce con `sdd capability merge --path <copia> --artifact spec.md`.

### Decisiones tomadas con el dev-lead

- Las columnas y el formato de fechas los decide el agente — «No sé qué columna usa para cuadrar ni en qué formato quiere las fechas; decide tú.»

## Intent

Hoy no hay forma de sacar las reservas de una sala de `salas`: el responsable de cada sala las cuadra los lunes en su hoja de cálculo (Excel) y tiene que copiarlas a mano. Quiero que un comando las dé listas para abrir en Excel. Éxito: `exportar Norte > norte.csv` se abre en Excel en tres columnas, con los datos tal como están (día de la semana y franja, sin fechas de calendario). Fracaso aunque «funcione»: que Excel meta todo en una sola columna, o que un aviso de error acabe dentro del fichero como si fuera un export.

## Scope

- Entra: comando `exportar <sala>` con salida CSV `;`, cabecera y una fila por reserva de la sala; sala sin reservas, sala desconocida, falta de argumento y cadena vacía (avisos por stderr, código 1); en `src/app.js`: `exportCsv` y `UsoError` exportadas, rama `exportar` en `run` y el bloque final que captura `UsoError`; ampliar `test/app.test.js`.
- No entra: escribir ficheros, filtrar por semana o por día, fechas reales, comillas/escapado, BOM, exportar todas las salas a la vez, reservas semanales (`--cada-semana` no guarda nada hoy), el `.ics` (fila 0009), cambiar el comportamiento de `reservar`, `libres` o `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Bloque final de `src/app.js` (`if (command) console.log(run(command, args));`): pasa a capturar `UsoError` | `src/app.js`, última línea | Scope y decisión 9; los demás comandos no cambian |
| Exportaciones del módulo: se añaden `exportCsv` y `UsoError` | `src/app.js` | Scope y decisión 12 |

- Nada se retira.

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv"` fuera de `.docs/sdd/specs` (solo la fila 0009 de `ROADMAP.md`, que es otra cosa: calendario `.ics`).

## Approach

- A. Función `exportCsv(room, list = bookings)` en `src/app.js`, junto a `freeRooms`, y rama en `run` — ~15 líneas, se prueba por `run` y por la función con lista propia.
- B. Módulo `src/csv.js` — separaría el formato, pero para 3 columnas fijas es más estructura que código.
- C. El comando escribe un fichero — obliga a fijar ruta y sobrescritura; `> fichero` ya lo da la shell.
- Elegido: A — es lo mínimo, encaja con `src/app.js` como único punto de entrada (operations.md) y no inventa decisiones de ficheros.

`run` valida la sala contra `rooms` y lanza `new UsoError(mensaje)`; `exportCsv` no valida. El bloque final de `src/app.js` envuelve `run` en `try/catch`: si el error es un `UsoError`, imprime el mensaje con `console.error` y fija `process.exitCode = 1`; cualquier otro error se relanza.

## Dónde se prueba

- Escenarios con los datos de ejemplo (`exportar Norte`, `exportar Sur`): por `run('exportar', [...])`, como los tests de `test/app.test.js`; son pruebas de humo sobre datos fijos.
- Varias reservas, orden y filtro por sala: por `exportCsv(room, list)` con una lista propia.
- Avisos: `assert.throws` sobre `run` con `UsoError` y el mensaje exacto.
- Stderr y código de salida: con `child_process.spawnSync('node', ['src/app.js', 'exportar', 'Oeste'])`: stdout vacío, stderr con el mensaje, código 1.
- Excel: paso manual de la validación: guardar `exportar Norte > norte.csv` y abrirlo en Excel con configuración regional española; deben verse tres columnas.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte con la reserva `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN el resultado es exactamente `sala;dia;franja\nNorte;lun;10:00-12:00`, sin `\n` final

#### ADDED — Solo salen las reservas de la sala pedida, en orden de alta

- GIVEN la lista de reservas `Norte lun 10:00-12:00`, `Sur mar 09:00-10:00`, `Norte mar 14:00-16:00`
- WHEN se exporta la sala Norte
- THEN el resultado es exactamente `sala;dia;franja\nNorte;lun;10:00-12:00\nNorte;mar;14:00-16:00`

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN la sala Sur, que existe y no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN el resultado es exactamente `sala;dia;franja`

#### ADDED — Una sala desconocida se avisa y no se exporta

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN falla con un `UsoError` de mensaje `sala desconocida: Oeste`
- AND `exportar norte` (minúscula) falla con `sala desconocida: norte`

#### ADDED — Sin sala se indica el uso

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar` sin argumentos, o `exportar ""`
- THEN falla con un `UsoError` de mensaje `uso: exportar <sala>`
- AND `exportar Norte extra` ignora `extra` y exporta Norte

#### ADDED — Los avisos no entran en el fichero

- GIVEN el programa ejecutado como proceso: `node src/app.js exportar Oeste`
- WHEN termina
- THEN stdout está vacío, stderr contiene `sala desconocida: Oeste` y el código de salida es 1
- AND `node src/app.js libres 10:00-12:00` sigue imprimiendo `Sur` por stdout con código 0

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas en la lista `bookings` y las salas en `rooms`, en memoria de `src/app.js`; la salida es stdout, no se escribe fichero.
- **Idioma de los nombres**: castellano (comando, avisos); las cabeceras `sala`, `dia`, `franja` van sin tilde a propósito.
- **Límites**: sin tope; sin BOM, así que un valor no ASCII (p. ej. una sala `Ágora`) se vería mal en Excel; el valor de una columna no puede contener `;` (no se comprueba); sin fechas de calendario, solo el día de la semana guardado; la salida de `run` no lleva `\n` final y el fichero guardado sí.
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`, por stderr y con código de salida 1; nunca en stdout.
- **Regla ante conflicto**: un valor con `;` no se escapa (descuadra la fila, riesgo conocido); el nombre de sala distingue mayúsculas, como `libres`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
