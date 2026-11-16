---
id: 20261113-142758-feature-0010-exportar-csv
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

Validación: dev-lead — el CSV lo abre una persona en su hoja de cálculo y solo ella ve si las columnas salen bien.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

1. Capacidad nueva `booking-export` (slug en inglés, kebab-case) — no existe ninguna en `capabilities/` que cubra la salida de reservas.
2. Nombre del comando: `exportar <sala>`, un verbo en castellano como `libres`, `reservar` y `cancelar`.
3. El CSV sale por la salida estándar, como el resto de comandos; para tener el fichero, `exportar Norte > norte.csv`. No hay opción `--salida`.
4. Cabecera `sala;dia;franja`, sin tilde en `dia` para que no dependa de la codificación del fichero. Fin de línea `\n`, sin BOM ni comillas: las salas y los días de hoy no llevan `;` ni acentos.
5. Orden de las filas: el de la lista de reservas, sin ordenar.
6. Sala sin reservas: solo la cabecera, no un error.
7. Sala que no existe: `sala desconocida: Oeste`. El nombre se compara exacto, con mayúsculas, como ya hace `libres`.
8. Sin sala: `uso: exportar <sala>`.
9. Los textos de error salen por la salida estándar y no cambian el código de salida, porque `run` solo devuelve texto y el resto de comandos hace igual.
10. Hoy existe una sola reserva de ejemplo (`Norte · lun · 10:00-12:00`): `exportar` lee la misma lista que `libres`.
11. `run` pasa a aceptar un tercer parámetro opcional con la lista de reservas (`run(cmd, params, data = bookings)`), para que los tests prueben varias reservas sin tocar la lista real. Es compatible con los tres tests actuales.
12. Enfoque: A (rama nueva en `run`), frente a B (módulo `csv.js`) — ver Approach.
13. Sin salto de línea final en lo que devuelve `run`: `console.log` ya pone el suyo.
14. Se añade la fila 0010 al roadmap (Now, 🔄), porque la feature no tenía fila.
15. Resultado del delta en una copia de `.docs/sdd`: `sdd capability merge` añade 3 requisitos y las 5 reglas a `booking-export.md` sin rechazar nada.

### Hallazgos de la review

Review de spec propuesta: dos revisores — señales: capacidad nueva, formato de fichero que consume la hoja de cálculo · tamaño: ~15 líneas en 2 ficheros. No se despacharon: la sesión no tiene herramienta de subagentes; la revisión de los siete puntos la hizo el propio agente, sin lente independiente.
- **Aceptado** — (2, técnica) el primer escenario pide dos reservas de Norte y `bookings` es privado, así que el test no podía montarlo → decisión 11, la lista inyectable.
- **Aceptado** — (4) el enfoque elegido y el salto de línea final no estaban en ✋ → decisiones 12 y 13.
- **Aceptado** — (3) la spec no decía que la feature añade su fila al roadmap → decisión 14 y Scope.
- **Rechazado** — (5, 5 bis) sin roles ni estados nuevos y sin reglas de producto en la constitución: nada que complementar.

- Política de modelos (solo en `delegate`): revisores de la spec — ninguno despachado (la sesión no tiene herramienta de subagentes; la rúbrica pedía dos en sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.

### Decisiones tomadas con el dev-lead

- Se exportan todas las reservas de la sala, sin filtro; el filtro por día lo hace el responsable en la hoja — «1️⃣. Todas las reservas de la sala, y el filtro por día lo hago yo en la hoja.»
- Separador `;` — «Opción 1️⃣, `;`. El Excel del responsable está en castellano.»

## Intent

El responsable de cada sala cuadra los lunes sus reservas en una hoja de cálculo, y hoy solo puede verlas tecleándolas a mano. Con este cambio, `salas exportar Norte > norte.csv` deja un fichero que su Excel en castellano abre en tres columnas, con una fila por reserva de esa sala. Fracasaría si, aunque el comando funcione, Excel mostrara cada fila entera en una sola celda.

## Scope

- Entra: el comando `exportar <sala>`; sus tests en `test/app.test.js`; la implementación en `src/app.js`; la fila 0010 en `ROADMAP.md`.
- No entra: filtrar por día o franja, escribir a un fichero con una opción propia, exportar todas las salas a la vez, comillas o escapado, BOM, otros formatos (el `.ics` es la fila 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: ninguna (la feature no tiene fila en el roadmap; la 0009 es otra: `.ics`) → nada: comprobado con `git grep -n -iE "exportar|csv"`, solo aparece la fila 0009.

## Approach

- A. Rama nueva en `run` que filtra la lista de reservas y une las filas con `;` — unas diez líneas en `src/app.js`, sin ficheros nuevos, con la lista de reservas inyectable (decisión 11), y se prueba con `run()` como los tests actuales.
- B. Módulo nuevo `src/csv.js` con una función de serialización genérica — queda reutilizable para el `.ics` o para otros listados, pero con una sola llamada hoy es una abstracción sin segundo uso.
- Elegido: A — `run` ya concentra todos los comandos en un solo fichero (operations.md: «un solo fichero de entrada: `src/app.js`»), y B no se justifica hasta que haya otro formato.

`run('exportar', [sala])` devuelve un texto: cabecera + una línea por reserva de la sala, unidas con `\n`, sin salto de línea final extra (`console.log` ya añade el suyo).

## Dónde se prueba

- Exportar una sala con reservas, vacía, desconocida y sin argumento: con `run()`, como los tests actuales de `test/app.test.js`.
- Que Excel lo abra en columnas: lo valida el dev-lead a mano con el CSV real.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN Norte tiene las reservas `lun 10:00-12:00` y `mar 10:00-12:00`, y Sur no tiene ninguna
- WHEN se ejecuta `exportar Norte`
- THEN sale `sala;dia;franja`, `Norte;lun;10:00-12:00` y `Norte;mar;10:00-12:00`, cada una en su línea y en ese orden
- AND no sale ninguna reserva de Sur

#### ADDED — Una sala sin reservas exporta solo la cabecera

- GIVEN Sur no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Una sala desconocida o sin nombre no exporta

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN sale `sala desconocida: Oeste`
- AND con `exportar` sin sala sale `uso: exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: la lista de reservas en memoria de `src/app.js`
- **Idioma de los nombres**: cabecera y avisos en castellano, sin tildes en la cabecera
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` · `uso: exportar <sala>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
