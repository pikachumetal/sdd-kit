---
id: 20261105-211837-feature-0012-libres-por-planta
feature: 0012
title: Filtrar las salas libres por planta
mode: full
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar las salas libres por planta

🦆 Hoy `libres 10:00-12:00` enseña las salas libres sin decir en qué planta están. Con esta feature, `libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (con los datos de partida: `Sur`), y sin `--planta` todo sigue igual (`Sur`). Por dentro, cada sala pasa a llevar su planta y `libres` filtra por ella si se la piden.

Validación: dev-lead — es un comando que usa una persona y la asignación de plantas a las salas es una decisión suya.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran por planta.

## ✋ Decisiones que he tomado yo — valida estas

**A confirmar primero:** dijiste «sin --planta, lista todas las salas» y yo lo leo como «todas las libres de la franja», que es lo que hace hoy el comando (decisión 4). Y las plantas de la decisión 1 son inventadas.

Review de spec: un revisor en sonnet con los siete puntos y, por aceptar dos Críticos, una segunda ronda con otro — señales: capacidad nueva (`room-availability`) · tamaño: ~25 líneas en 3 ficheros (`src/app.js`, `test/app.test.js`, `.docs/sdd/capabilities/room-availability.md`)
- Mínimo razonable: sin revisor — deja sin mirar si los escenarios sin filtro reproducen el comportamiento actual

1. **Plantas de las salas: `Norte` en la planta 1 y `Sur` en la planta 2.** Nadie dijo en qué planta está cada sala y el código no lo recoge; es un dato de partida inventado. Corrígelo con las plantas reales: el Intent y los escenarios cambian con ellas.
2. **Forma del comando: `libres <franja> --planta <n>`**, con `--planta` detrás de la franja. La franja sigue siendo el primer argumento, como hoy.
3. **La planta del filtro se compara tal cual (como texto) con la de la sala.** Una planta que ninguna sala tiene (`--planta 9`) da la lista vacía, como hoy cuando no hay ninguna libre.
4. **Sin `--planta` el comando no cambia**: todas las libres de la franja; no enseña las ocupadas. Si querías ver también las ocupadas, es otra feature.
5. **Capacidad nueva `room-availability`** (inglés kebab-case; se crea `.docs/sdd/capabilities/room-availability.md`): el proyecto no tiene capacidades, y el comportamiento actual de `libres` entra en ella como escenario para fijarlo con un test.
6. **Enfoque (central): cada sala pasa a ser `{ nombre, planta }` en `src/app.js` y `freeRooms` filtra por planta.** Descartados: un mapa aparte `sala → planta` (dos listas que mantener sincronizadas con solo dos salas) y deducir la planta del nombre (el nombre no la lleva). La salida sigue siendo nombres separados por coma.
7. **Argumentos fuera de lo dicho**: `--planta` sin valor, con un valor no numérico o antes de la franja no tienen regla ni test; quedan sin definir (ver «No entra»).

- Política de modelos: spec con un revisor en sonnet (más una segunda ronda) · ejes de la revisión final según el plan · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Hallazgos de la review

Primera ronda:
- **Aceptado** — GIVEN sin día y plantas sin declarar (Crítico) → los escenarios comparten GIVEN, sin «el lunes», con las plantas dentro.
- **Aceptado en parte** — dato de la planta sin sitio ni regla (Crítico) → vive en `src/app.js` (Approach); no añado regla para una sala sin planta porque con los datos de partida no se puede ejercitar.
- **Aceptado** — formato de salida → escenario con las dos salas libres (`Norte, Sur`).
- **Rechazado** — `--planta` sin valor, no numérico o antes de la franja → nadie lo pidió y es una herramienta de un solo usuario; queda sin definir (decisión 7).
- **Aceptado** — el Intent promete cercanía y no enseña la planta → el Intent dice que el valor es filtrar, no informar.
- **Aceptado** — `rooms` cambia de forma → fila en la tabla; solo la usa `freeRooms`.
- **Aceptado** — cómo se prepara la reserva → el test usa la reserva que ya trae `bookings` (`Norte`, 10:00-12:00).
- Resto aceptado: decisión 4 y plantas arriba del bloque, «salas de partida» corregido, y el resultado del merge de prueba (sin rechazos) fuera de ✋.

Segunda ronda:
- **Rechazado (Crítico)** — `--planta` sin valor o no numérico sin escenario → mismo motivo que arriba: queda declarado sin definir y en «No entra».
- **Rechazado (Crítico)** — la spec no es verificable hasta tener las plantas reales → no bloqueo: el gate es donde las validas, y por eso van arriba del bloque.
- **Aceptado** — decisión 4 más visible → arriba, con tu frase literal.
- **Aceptado** — escenario sin filtro mezclaba plantas y comportamiento actual → sin plantas en su GIVEN y con una nota de que fija lo que ya hace.
- **Aceptado** — tres casos en un solo escenario → tres escenarios.
- **Aceptado en parte** — regla de sala sin planta sin escenario → retirada.
- **Aceptado** — bloque de proceso y revisores incoherentes → reconciliado y con la ruta de la capacidad.
- **Aceptado** — fila «Nada se retira» → pasa a prosa.
- **Aceptado** — «número entero» sin garantía → decisión 3, comparación como texto.
- **Aceptado** — crear `capabilities/` → decisión 5 y Scope.

### Decisiones tomadas con el dev-lead

- Filtrar las libres por planta con la opción `--planta` — «filtrar libres por planta con la opción --planta»
- Sin `--planta`, se listan todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
### Decisiones tomadas con el dev-lead

- Filtrar las libres por planta con la opción `--planta` — «filtrar libres por planta con la opción --planta»
- Sin `--planta`, se listan todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `libres <franja>` devuelve las salas libres sin informar de su planta; quien está en una planta y quiere una sala cerca tiene que conocer de memoria dónde está cada una. Se quiere poder filtrar (no informar: la salida sigue sin enseñar la planta): preguntar `libres 10:00-12:00 --planta 2` y recibir solo las libres de esa planta. Éxito: con el dato de partida, `libres 10:00-12:00 --planta 2` da `Sur` y `--planta 1` da una lista vacía (`Norte` está reservada), y `libres 10:00-12:00` sigue dando `Sur`. Fracaso aunque funcione: que sin `--planta` cambie lo que `libres` devuelve hoy.

## Scope

- Entra: la opción `--planta <n>` en `libres`; la planta de cada sala (decisión 1); la capacidad `room-availability` (se crea `.docs/sdd/capabilities/room-availability.md`) con el comportamiento nuevo y el actual.
- No entra: validar `--planta` sin valor o con un valor que no sea un número; enseñar la planta junto al nombre en la salida; las salas ocupadas en el listado; filtrar por planta en otros comandos (`reservar`, `cancelar`, `anular`); la validación del formato de la franja (deuda técnica aparte).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista `{ nombre, planta }` | `src/app.js:2` y `freeRooms` (`src/app.js:5-7`); ningún otro comando la usa | Approach; el escenario «Libres sin filtro de planta» fija que `libres` no cambia |

Nada se retira: la salida de `libres` sin `--planta` no cambia (decisión 4).

- Filas que implementa: nada: comprobado con `git grep -niE "libres|planta"` (solo `src/app.js:28`, `test/app.test.js:5-6` y `changelog.md:10`, que describen el comando actual y siguen valiendo)

## Approach

`rooms` deja de ser una lista de nombres y pasa a una lista de salas con nombre y planta (decisión 1). `freeRooms` recibe la franja y, opcionalmente, la planta, y descarta las salas de otra planta además de las reservadas. `run('libres', params)` toma la franja del primer argumento y la planta del valor que sigue a `--planta`, si está. La salida sigue siendo los nombres separados por coma.

## Dónde se prueba

- `libres` sin `--planta`: por `run('libres', ['10:00-12:00'])`, como el test actual de `test/app.test.js`.
- `libres` con `--planta`: por `run('libres', ['10:00-12:00', '--planta', '2'])`, en el mismo fichero.

## Términos y ADR

- Términos resueltos: planta — el piso del edificio donde está una sala; ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres sin filtro de planta

> Fija lo que `libres` ya hace hoy.

- GIVEN `Norte` con una reserva de 10:00-12:00 y `Sur` sin reservas
- WHEN se pide `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND con la franja `14:00-16:00`, en la que ninguna tiene reserva, la salida es `Norte, Sur`

#### ADDED — Libres de una planta con sala libre

- GIVEN `Norte` (planta 1) con una reserva de 10:00-12:00 y `Sur` (planta 2) sin reservas
- WHEN se pide `libres 10:00-12:00 --planta 2`
- THEN la salida es `Sur`

#### ADDED — Libres de una planta con su sala reservada

- GIVEN `Norte` (planta 1) con una reserva de 10:00-12:00 y `Sur` (planta 2) sin reservas
- WHEN se pide `libres 10:00-12:00 --planta 1`
- THEN la salida es vacía

#### ADDED — Libres de una planta inexistente

- GIVEN `Norte` (planta 1) y `Sur` (planta 2)
- WHEN se pide `libres 10:00-12:00 --planta 9`
- THEN la salida es vacía

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
