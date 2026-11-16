---
id: 20261111-191018-feature-0012-libres-planta
feature: 0012
title: Filtrar las salas libres por planta
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar las salas libres por planta

🦆 Hoy `libres 10:00-12:00` enseña todas las salas libres de la franja. Con esta feature, `libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (con los datos de ejemplo, `Sur`), y sin `--planta` sigue enseñando todas, como ahora. Para poder filtrar, cada sala pasa a tener una planta en el código; hoy no la tiene.

Validación: dev-lead — el resultado lo ve una persona en la terminal.

## Capacidades

- Nuevas: `room-availability` — qué salas se ven libres en una franja y cómo se filtran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-availability`), contrato público (la opción `--planta` de `libres`), datos (la planta de cada sala) · tamaño: ~25 líneas en 3 ficheros
- Dominio (sonnet): si el THEN de «sin `--planta` lista todas» coincide con lo que hace hoy `libres` y si los mensajes de planta inválida o sin salas dejan algún caso sin respuesta (señal: contrato público)
- Técnica (sonnet): si pasar `rooms` de textos a objetos con `floor` rompe `bookings` o `cancelBooking`, y si el orden `<franja> --planta <n>` se analiza sin ambigüedad en `run` (señal: datos)
- Mínimo razonable: solo técnica — deja sin mirar si los mensajes de error cubren todos los valores que alguien puede escribir tras `--planta`

1. Plantas de las salas: `Norte` → planta 1, `Sur` → planta 2 — nadie dijo en qué planta está cada sala; es un dato inventado para poder probar y se cambia en una línea.
2. Sintaxis: `libres <franja> --planta <n>`, con la opción tras la franja y con espacio (no `--planta=2`) — misma forma de opción con guion doble que `--cada-semana`.
3. La planta es un entero de 1 en adelante, escrito solo con dígitos y sin cero a la izquierda (`^[1-9][0-9]*$`): `01`, `+2`, `2abc` y la cadena vacía son no válidos.
4. Mensajes (literales): `planta no válida: <valor>` si el valor no es un entero ≥ 1 (`abc`, `0`, `-1`, `1.5`, `01`, `2abc`); `falta el número de planta` si `--planta` va sin valor; `sin salas en la planta <n>` si es un entero válido sin ninguna sala (`--planta 3`).
5. Planta válida con salas pero todas ocupadas en la franja: `run` devuelve `''`, como hoy cuando no hay ninguna libre; no inventa un mensaje. «Sin salas» se decide por las salas que existen, no por las libres.
6. Capacidad nueva `room-availability` (slug en inglés y kebab-case, como pide la plantilla de capacidades aunque la constitución pida castellano para el texto): `capabilities/` no existe y no hay otra donde encaje. El delta recoge también el comportamiento vigente de `libres` (excluir las ocupadas), que hoy no está escrito en ninguna capacidad.
7. Enfoque: A, frente a B y C (ver Approach).
8. Delta probado en una copia de `.docs/sdd` (`sdd capability merge`): crea `room-availability.md` con 6 requisitos y las 5 reglas, sin rechazos; `capabilities/` del repo no cambia.
9. Orden de validación: primero se lee la franja (`params[0]`, sin validarla, como hoy); después, si `params[1]` es `--planta`, se mira el valor (`falta…`, luego `no válida…`), y por último si existe alguna sala en esa planta (`sin salas…`).
10. Parámetros que no son `--planta` tras la franja (`--piso 2`, `--planta=2`) se ignoran y se listan todas las salas, como hoy con cualquier parámetro extra; `libres --planta 2` (sin franja) lee `--planta` como franja, como hoy leería cualquier texto. Es lo más barato y no cambia nada vigente; el riesgo es una opción mal escrita que parece no filtrar.
11. Las cinco reglas de la capacidad no vienen de la constitución (no tiene «Reglas de producto»): «dónde viven los datos» sale de `operations.md` («las reservas viven en memoria»); idioma, límites, avisos y conflicto, de las decisiones 2–5 y 9.
12. Formato de salida: nombres separados por `, ` en una sola línea.
13. Esta feature no tiene fila en `ROADMAP.md`: nace de la petición directa del dev-lead; el id 0012 lo reserva la rama.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — dominio 1 y 9 (día ignorado, `No entra`) → AND del escenario 1, Scope y decisión 10.
- **Aceptado** — dominio 2, técnica 1 (valores no válidos) → decisión 3 y escenario con `-1`, `1.5`, `01`, `2abc`.
- **Aceptado** — dominio 3 y 4, técnica 3 y 4 (parámetros extra, orden) → decisiones 9 y 10.
- **Aceptado** — dominio 5 (cancelada/anulada libera) → AND del escenario 1.
- **Aceptado** — dominio 6, 8 y 10, técnica 2 (reglas sin fuente, límites, formato, vacío) → decisiones 11 y 12 y reglas.
- **Aceptado** — dominio 7 → decisión 6 justifica el slug en inglés por la plantilla de capacidades.
- **Aceptado** — técnica 5, 10 (sin salas vs ocupadas, comparación en `freeRooms`) → AND de «Planta sin salas» y fila de la tabla de forma.
- **Aceptado** — técnica 7, 8, 9 (premisa de `--cada-semana`, changelog, roadmap) → decisiones 2 y 13, Scope. Rechazado el `README.md`: no menciona `libres`, queda fuera.
- **Rechazado** — técnica 6 (revisar también el hueco de mensajes): lo cubren ahora los dos revisores.
- Sin hallazgos Críticos: no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- Filtrar las salas libres por planta con la opción `--planta` — «filtrar libres por planta con la opción --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `libres` devuelve todas las salas libres de la franja, y quien busca sala en una planta concreta tiene que descartar las demás a ojo. Se quiere poder pedir solo las de una planta. Éxito: `libres 10:00-12:00 --planta 2` devuelve solo las libres de la planta 2, y `libres 10:00-12:00` devuelve lo mismo que hoy. Fracaso aunque «funcione»: que sin `--planta` cambie lo que sale hoy, o que una planta mal escrita parezca «sin salas libres».

## Scope

- Entra: la opción `--planta <n>` de `libres`; la planta de cada sala en `src/app.js`; los mensajes de la decisión 4; la capacidad `room-availability`; una línea en `### Added` de `[Unreleased]` en `CHANGELOG.md`, con el enlace a esta carpeta.
- No entra: la reserva, la cancelación y la anulación (no usan planta); el día en `libres` (la disponibilidad se calcula solo por franja, como hoy); `--planta` antes de la franja, `--planta=2` y otras opciones desconocidas (se ignoran, decisión 10); `README.md` (no documenta `libres`); cualquier otro filtro (capacidad, equipamiento); persistencia (las salas viven en memoria, ver `operations.md`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de textos a lista de objetos `{ name, floor }` | `src/app.js:2`, `src/app.js:6` (`freeRooms`, incluida su comparación `b.room === room`, que pasa a `room.name`) | Approach (enfoque A); mismo resultado sin `--planta`, cubierto por el escenario «Sin `--planta` se listan todas las salas» |
| `bookings[].room` sigue siendo el nombre de la sala | `src/app.js:3`, `findBooking` (`:10`), `cancelBooking`, `voidBooking` | No cambia: las reservas se enlazan por nombre; el filtro de planta solo toca `freeRooms` |

- Filas que implementa: nada: comprobado con `git grep -n "0012\|planta\|floor"` fuera de `.docs/sdd/specs`, sin resultados.

## Approach

- A — cada sala lleva su planta (`{ name, floor }`) y `freeRooms(slot, floor)` filtra por ella. Cuesta: tocar la forma de `rooms` (2 líneas) y el filtro; lo demás no cambia.
- B — un mapa aparte `floors = { Norte: 1, Sur: 2 }`. Cuesta: dos fuentes que mantener cuando haya una sala nueva (se puede olvidar su planta).
- C — filtrar en `run` sobre el resultado de `freeRooms`. Cuesta: `run` tendría que conocer el mapa de plantas igual que B, y deja el dato lejos de la sala.
- Elegido: A — el dato vive junto a la sala, una sola fuente.

`run('libres', params)` lee `params[0]` como franja y, si `params[1] === '--planta'`, valida `params[2]` según la decisión 4 antes de filtrar. Cualquier otro parámetro extra se ignora, como hoy.

## Dónde se prueba

- `libres` con y sin `--planta`, los tres mensajes, y una reserva cancelada que libera la sala: por `run('libres', [...])`, como el test actual de `libres` en `test/app.test.js`; un fichero nuevo `test/libres-planta.test.js` si el actual crece.
- Línea de `CHANGELOG.md`: a ojo en la validación, sin test.

## Términos y ADR

- Términos resueltos: planta — el piso del edificio donde está una sala; número entero desde 1.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Salas libres de una franja

- GIVEN `Norte` (planta 1) con reserva activa en `10:00-12:00` y `Sur` (planta 2) sin reservas
- WHEN `libres 10:00-12:00`
- THEN sale `Sur`
- AND si la reserva de `Norte` está cancelada o anulada, sale `Norte, Sur`
- AND el día no interviene: la disponibilidad se calcula solo por franja

#### ADDED — Salas libres de una planta

- GIVEN `Norte` (planta 1) y `Sur` (planta 2) sin reservas en `14:00-16:00`
- WHEN `libres 14:00-16:00 --planta 2`
- THEN sale `Sur`
- AND con `--planta 1` sale `Norte`

#### ADDED — Sin `--planta` se listan todas las salas

- GIVEN `Norte` y `Sur` sin reservas en `14:00-16:00`
- WHEN `libres 14:00-16:00`
- THEN sale `Norte, Sur`

#### ADDED — Planta con todas las salas ocupadas

- GIVEN `Norte` (planta 1) con reserva activa en `10:00-12:00`
- WHEN `libres 10:00-12:00 --planta 1`
- THEN `run` devuelve `''`

#### ADDED — Planta sin salas

- GIVEN las salas están en las plantas 1 y 2
- WHEN `libres 10:00-12:00 --planta 3`
- THEN sale `sin salas en la planta 3`
- AND con `Norte` ocupada en `10:00-12:00`, `--planta 1` devuelve `''`, no `sin salas en la planta 1`

#### ADDED — Planta no válida

- GIVEN cualquier estado de reservas
- WHEN `libres 10:00-12:00 --planta abc`
- THEN sale `planta no válida: abc`
- AND con `--planta 0`, `-1`, `1.5`, `01` o `2abc` sale `planta no válida: <valor>` con el valor escrito
- AND con `--planta` sin valor sale `falta el número de planta`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria, en `src/app.js` (salas con su planta y reservas).
- **Idioma de los nombres**: castellano en la interfaz (`libres`, `--planta`, mensajes); identificadores del código en inglés, como hoy.
- **Límites**: planta entera ≥ 1, solo dígitos; sin máximo.
- **Avisos**: `planta no válida: <valor>`, `falta el número de planta`, `sin salas en la planta <n>`.
- **Regla ante conflicto**: se valida en este orden: valor ausente, valor no válido, planta sin salas. Salida: nombres separados por `, ` en una línea; vacío es `''`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
