---
id: 20261113-221240-feature-0010-exportar-csv
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

🦆 Con `exportar Norte` sale por pantalla una tabla de texto con una línea por reserva de la sala Norte, por ejemplo `Norte;lun;10:00-12:00`, precedida de la cabecera `sala;dia;franja`. La rediriges a un fichero (`exportar Norte > norte.csv`) y la abres en tu hoja de cálculo el lunes. Por dentro es un comando más de `run` en `src/app.js` que recorre las reservas en memoria de esa sala.

Validación: dev-lead — lo usa una persona y lo que cuenta es que la hoja de cálculo lo abra bien en columnas.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: **no se ha podido despachar** en esta sesión (no hay herramienta de subagentes). Nivel que daba la rúbrica: dos revisores — señales: capacidad nueva, contrato público (el formato CSV lo consume tu hoja de cálculo) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): si la cabecera `sala;dia;franja` y el `;` como separador se abren en columnas en una hoja de cálculo en castellano (señal: contrato público)
- Técnica (sonnet): si `exportar` con sala desconocida o sin argumento no choca con el `return 'salas'` por defecto de `run` (señal: capacidad nueva)
- Mínimo razonable: un solo revisor técnico — deja sin mirar si el CSV se abre bien en la hoja, que es justo lo que tú validas a mano

1. Nombre del comando: `exportar <sala>` — verbo en castellano, como `reservar`, `cancelar` y `libres`.
2. La salida va por pantalla, como el resto de comandos; para tener un fichero, `exportar Norte > norte.csv` — no escribo ficheros por mi cuenta.
3. Primera línea de cabecera `sala;dia;franja`, sin tilde — sin BOM una tilde puede salir rota al abrir el CSV en la hoja de cálculo.
4. Una línea por reserva de la sala: `<sala>;<día>;<franja>`, separadas por `\n`, sin línea final en blanco — lo que pediste: «sala, día y franja, separados por punto y coma».
5. Sala sin reservas (`exportar Sur`): solo la cabecera — una hoja vacía con cabecera se distingue de un error.
6. Sala que no existe (`exportar Este`): `sala desconocida: Este`, sin cabecera ni CSV — para que un nombre mal escrito no parezca «sala sin reservas».
7. Sin sala (`exportar`): `uso: exportar <sala>`.
8. El nombre de la sala se compara tal cual (`Norte`, no `norte`) — igual que hace `libres` con las salas.
9. Las reservas salen de la lista en memoria que ya usa `src/app.js`; no añado persistencia ni fechas — hoy la lista tiene una sola reserva fija y eso no es de esta feature.
10. No entrecomillo campos: ningún valor de sala, día o franja lleva `;` hoy — si algún día lo lleva, es otra feature.
11. Capacidad nueva `booking-export` — slug en inglés kebab-case, por la regla 1 de `capability-template.md`.
- Repaso de coherencia: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`, sin rechazos: «booking-export.md: añadido» ×3 requisitos y 5 reglas; la capacidad real no se toca hasta el cierre. `git grep` de `exportar|csv` fuera de las specs: solo la fila 0009 del roadmap.
- Pendiente de ti: con qué comparas el CSV en la hoja — «no sé»; si más adelante necesitas otra columna u otro orden, será otra feature.
- Política de modelos (delegate): revisores de la spec: ninguno despachado (sin subagentes en esta sesión) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Columnas sala, día y franja, separadas por punto y coma — «En cada fila me basta con sala, día y franja, separados por punto y coma.»
- Uso: abrirlo cada lunes en su hoja de cálculo para cuadrar las reservas de la sala — «Lo abro los lunes en mi hoja de cálculo para cuadrar las reservas de la sala».

## Intent

Hoy no hay forma de sacar las reservas de una sala de la herramienta: solo se puede preguntar qué salas están libres en una franja. El responsable de cada sala las cuadra los lunes en su hoja de cálculo y tiene que copiarlas a mano. El éxito es que `exportar Norte > norte.csv` produzca un fichero que la hoja abre en tres columnas (sala, día, franja) sin retoques. Fracasaría, aunque «funcione», si al abrirlo todo cayera en una sola columna o saliera una tilde rota.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js` y sus tests en `test/app.test.js`.
- No entra: persistencia de reservas, fechas, nombre de quien reserva, escribir el fichero desde la herramienta, entrecomillado de campos, la exportación a `.ics` (fila 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0010 (sin fila propia en `ROADMAP.md`; la 0009, `.ics`, es otra cosa y no se toca) → nada: comprobado con `git grep -niE "exportar|csv" -- . ':!.docs/sdd/specs'`, que solo da la fila 0009 del roadmap.

## Approach

- Rama nueva en `run` que filtra `bookings` por sala y une líneas con `;` — cambio mínimo, en el mismo fichero y estilo que `libres`; cabe en el patrón actual y se prueba por `run`.
- Módulo propio `src/exportar.js` — separa la lógica, pero para unas 10 líneas añade un fichero y una importación; `operations.md` dice «un solo fichero de entrada» y no lo pide.
- Elegido: rama en `run` — es lo que ya hace `libres` y no hay lógica que justifique otro módulo.

`exportar` valida la sala contra `rooms` (la lista que ya existe), luego devuelve la cabecera más una línea por reserva de esa sala en el orden de `bookings`.

## Dónde se prueba

- `exportar` (sala con reservas, sin reservas, desconocida, sin argumento): por `run`, como los tests actuales de `app.test.js`.
- Que la hoja de cálculo lo abra en columnas: lo comprueba el dev-lead a mano en la validación, con un `norte.csv` real.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte con la reserva `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN sale `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`

#### ADDED — Sala sin reservas

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Sala desconocida o sin indicar

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Este`
- THEN sale `sala desconocida: Este` y ninguna línea de CSV
- AND `exportar` sin sala da `uso: exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: la lista de reservas en memoria de `src/app.js`; el CSV no se guarda, sale por pantalla
- **Idioma de los nombres**: castellano; la cabecera, `sala;dia;franja`, sin tilde
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` · `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
