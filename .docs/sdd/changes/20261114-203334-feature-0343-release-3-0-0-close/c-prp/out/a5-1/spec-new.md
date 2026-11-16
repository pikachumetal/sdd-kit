---
id: 20261115-192011-feature-0012-libres-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 10:00-12:00` te dice qué salas están libres en esa franja, estén en la planta que estén. Con el cambio, `libres 10:00-12:00 --planta 2` solo te enseña las libres de la planta 2 (`Sur`), y sin `--planta` sigue saliendo todo como hasta ahora (`Sur`). Para que eso sea posible, cada sala pasa a tener una planta dentro de `src/app.js`; esa asignación la he puesto yo y la tienes que validar.

Validación: dev-lead — lo usa una persona desde la terminal; basta con ejecutar `libres` con y sin `--planta`.

## Capacidades

- Nuevas: `free-rooms` — qué salas están libres en una franja, y cómo se filtran por planta.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: hecha — un revisor sonnet con los siete puntos y una segunda ronda (sonnet) tras dos Críticos aceptados; señales: capacidad nueva, datos nuevos (la planta de cada sala) · tamaño: ~15 líneas en 2 ficheros

1. **Qué planta tiene cada sala**: `Norte` en la planta 1 y `Sur` en la planta 2. Nadie lo dijo y el código no tiene ese dato; lo he inventado para poder probar el filtro. Si la oficina real es distinta, dime la tabla.
2. **El valor de la planta es un número entero** (`1`, `2`), no un nombre («baja», «primera»). Es lo más corto de teclear y de comparar.
3. **Sintaxis**: `libres <franja> --planta <n>`, con un espacio entre la opción y el valor, como se pasa `--cada-semana`. La opción puede ir antes o después de la franja (`libres --planta 2 10:00-12:00` vale igual). La franja es el primer argumento que no es opción ni valor de opción.
4. **`--planta` sin valor**: el valor es el argumento siguiente, salvo que no haya ninguno o empiece por `--` (solo el doble guion corta el valor; `-1` o `-x` son valores); entonces responde `indica una planta`. Así `libres --planta 10:00-12:00` lee `10:00-12:00` como valor de planta y responde `sin planta 10:00-12:00`.
5. **Planta que no existe o no es un entero canónico** (`--planta 5`, `--planta abc`, `--planta 02`, `--planta -1`) responde `sin planta <valor>` con el valor tal cual, con el mismo estilo que `sin reserva Norte lun`. No lista nada. La planta de cada sala es un entero y se compara como `String(planta)` con el valor escrito; la existencia se comprueba contra las plantas de `rooms`, no contra una lista fija. Sin tope de longitud: es una herramienta local de una sola persona.
6. **Planta que existe pero sin salas libres en la franja** devuelve la cadena vacía, igual que hoy cuando no queda ninguna sala libre. No añado un mensaje nuevo para ese caso: no estaba en el encargo y cambiaría una salida que ya existe.
7. **Capacidad nueva `free-rooms`** (slug en inglés, kebab-case). No existe ninguna capacidad en el proyecto y el comportamiento de `libres` no estaba recogido; el delta recoge solo lo que fija este cambio: el filtro y que sin `--planta` la salida no cambia.
8. **Enfoque**: guardar la planta como un campo de cada sala en el `rooms` de `src/app.js` y filtrar en `freeRooms`, frente a (B) un mapa aparte `planta → salas`, o (C) deducir la planta del nombre de la sala. Ver Approach.
9. **Términos**: «planta» entra como término nuevo del producto (el piso del edificio en que está una sala); lo propongo para `PRODUCT.md` al cerrar.
10. **Qué entra y qué no**: `salas` (el listado sin más) no enseña la planta; es una mejora aparte.
11. **Orden de comprobación**: primero se valida `--planta` (valor ausente, luego planta inexistente) y solo después se mira la franja y las reservas; un aviso de planta gana siempre a la lista, y la falta de franja no se comprueba antes que la planta. La franja es el primer argumento que no empieza por `--` y no es el valor de `--planta`; cualquier otra opción `--x` se salta sin validarla.
12. **Firma interna**: `freeRooms(slot, planta)` con `planta` opcional; `undefined` no filtra.
13. **Canal de los avisos**: `indica una planta` y `sin planta <valor>` se devuelven desde `run` y salen por `console.log`, como `sin reserva ${room} ${day}` (`src/app.js:12`); el código de salida no cambia.
14. **Fuera de alcance, sin comportamiento definido**: `--planta` repetido, `--planta ""` (valor vacío), opciones desconocidas con valor, y `libres` sin franja (con o sin `--planta`, p. ej. `libres --planta 2`) o con franja inválida. Lo que hoy hace `libres` sin franja con la llamada de hoy no cambia; el resto no se promete.
15. **Alcance de `free-rooms`**: recoge la regla «libre = sin reserva activa en esa franja», que ya cumple el código, además del filtro por planta, para que la capacidad no nazca sin su contrato principal.
### Hallazgos de la review

1. **Aceptado** — GIVEN sin estado completo → cerrados en cada escenario y añadidos dos AND que distinguen un filtro roto.
2. **Aceptado** — «cualquier estado» y valor ausente indefinido → decisión 4 y tres THEN en «Planta sin valor».
3. **Aceptado** — parseo del valor, `02`, `-1` → decisión 5; repetido y sin franja, a decisión 14 como fuera de alcance.
4. **Aceptado** — decisiones sin ✋ → decisiones 11, 12 y 14.
5. **Aceptado en parte** — prioridad del aviso → decisión 11 y un GIVEN con franja ocupada; **Rechazado** el saneado y el tope de longitud: herramienta local de una persona.
6. **Rechazado** — capacidad parcial: es intencionado, queda dicho en la decisión 15.
7. **Aceptado** — `PRODUCT.md` y `ROADMAP.md` pasan al Scope; `CHANGELOG.md` existe.
8. **Rechazado** — `salas` no lee `rooms` (`run` devuelve la cadena `salas` fija; `git grep rooms` solo da `src/app.js:2` y `:6`).
9. **Aceptado** — decisión 13.
10. **Aceptado en parte** — la review queda marcada como hecha; **Rechazado** el tope numérico (decisión 5).

### Hallazgos de la segunda ronda

Sin Críticos. **Aceptados**: sin franja y opciones desconocidas (decisiones 11 y 14), criterio `String(planta)` y existencia contra `rooms` (5), `-x` como valor (4), vacío (14), guarda contra `[object Object]`, cita de `src/app.js:12` (13), capacidad con su contrato (15, nuevo ADDED). **Rechazado**: nada.

- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta».
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas».
- Perfil delegate — «Perfil delegate».

## Intent

Hoy `libres <franja>` devuelve todas las salas libres en la franja. Quien busca sitio suele querer una planta concreta y ahora tiene que descartar a ojo. El cambio añade un filtro opcional `--planta <n>`. Éxito: `libres 10:00-12:00 --planta 2` responde solo con salas libres de la planta 2, y `libres 10:00-12:00` responde exactamente lo mismo que hoy. Fracaso aunque «funcione»: que sin `--planta` cambie la salida, o que una planta mal escrita parezca «sin salas libres» en vez de avisar de que no existe.

## Scope

- Entra: la planta de cada sala; la opción `--planta` en `libres`; los avisos de `--planta` sin valor y de planta inexistente; tests; una línea en el `CHANGELOG.md` (existe); el término «planta» en `PRODUCT.md` y la fila 0012 en `ROADMAP.md`, al cerrar.
- No entra: mostrar la planta en `salas` o en otra salida; filtrar por otro criterio (capacidad, día); cambiar el comportamiento de `libres` sin `--planta`; leer las plantas de un fichero o de la configuración.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de cadenas a lista de objetos `{ nombre, planta }` | `src/app.js:2`, único uso en `src/app.js:6` (`freeRooms`); sin otras apariciones (`git grep -n rooms`) | Scope: se implementa en la task; el resultado de `libres` sin `--planta` no cambia |
| `params[0]` como franja de `libres` | `src/app.js:28`; `test/app.test.js:6` | Decisión 3: la franja es el primer argumento que no es opción; con la misma llamada de hoy sigue siendo `params[0]` |

- Filas que implementa: nada: no hay fila 0012 en `ROADMAP.md` (comprobado con `git grep -n "0012"`, sin resultados); la fila se apunta al cerrar.

## Approach

- A. Campo `planta` en cada sala de `rooms` y filtro en `freeRooms` — un cambio de unas 15 líneas en un solo fichero; el dato vive junto al nombre y se prueba con la misma costura que hoy.
- B. Mapa aparte `planta → salas` — dos estructuras que mantener sincronizadas; añadir una sala exige tocar las dos.
- C. Deducir la planta del nombre (`Norte` → 1) — frágil, no escala a una sala nueva y esconde el dato.
- Elegido: A — es lo más simple y deja un único sitio donde dar de alta una sala.

Partes del cómo que fija A: `libres` separa sus argumentos en la opción `--planta <valor>` y el resto; el primer resto es la franja. `freeRooms(slot, planta)` recibe `planta` opcional; si es `undefined`, no filtra. La comprobación de «planta existente» se hace contra las plantas de `rooms`, no contra una lista fija.

## Dónde se prueba

- `libres` con y sin `--planta`, en cualquier orden, y los dos avisos: por `run('libres', [...])` en `test/app.test.js`, como el test de `libres` actual.
- La salida real en terminal: smoke manual de `node src/app.js libres 10:00-12:00 --planta 2` en la validación del dev-lead.

## Términos y ADR

- Términos resueltos: **Planta** — el piso del edificio en el que está una sala; se identifica con un número entero. _Evitar_: piso, nivel.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `free-rooms`

#### ADDED — Libres sin filtro de planta

- GIVEN `Norte` (planta 1) reservada de 10:00 a 12:00 y `Sur` (planta 2) sin reservas
- WHEN `libres 10:00-12:00`
- THEN la salida es `Sur`, igual que antes de existir `--planta`
- AND con `libres 14:00-15:00` (ambas libres) la salida es `Norte, Sur`, no `[object Object]`

#### ADDED — Una sala está libre si no tiene reserva activa en la franja

- GIVEN `Norte` con una reserva activa de 10:00 a 12:00 y `Sur` con una reserva cancelada en 10:00-12:00
- WHEN `libres 10:00-12:00`
- THEN la salida es `Sur`

#### ADDED — Libres filtradas por planta

- GIVEN `Norte` (planta 1) y `Sur` (planta 2), ambas libres en 14:00-15:00
- WHEN `libres 14:00-15:00 --planta 2`
- THEN la salida es `Sur`
- AND con `libres 14:00-15:00 --planta 1` la salida es `Norte`
- AND con `libres --planta 2 14:00-15:00` la salida es `Sur`

#### ADDED — Planta sin salas libres en la franja

- GIVEN `Norte` (planta 1) reservada de 10:00 a 12:00 y `Sur` (planta 2) sin reservas
- WHEN `libres 10:00-12:00 --planta 1`
- THEN la salida es la cadena vacía
- AND con `libres 10:00-12:00 --planta 2` la salida es `Sur`
- AND con `libres 11:00-12:00 --planta 1` (franja distinta, `Norte` sin reserva en ella) la salida es `Norte`

#### ADDED — Planta inexistente

- GIVEN `Norte` (planta 1) y `Sur` (planta 2); `Norte` reservada de 10:00 a 12:00
- WHEN `libres 10:00-12:00 --planta 5`
- THEN la salida es `sin planta 5`
- AND con `--planta abc` la salida es `sin planta abc`
- AND con `--planta 02` la salida es `sin planta 02`
- AND con `--planta -1` la salida es `sin planta -1`
- AND `libres --planta 10:00-12:00` responde `sin planta 10:00-12:00`

#### ADDED — Planta sin valor

- GIVEN `Norte` (planta 1) y `Sur` (planta 2), sin reservas en 14:00-15:00
- WHEN `libres 14:00-15:00 --planta`
- THEN la salida es `indica una planta`
- AND con `libres --planta` la salida es `indica una planta`
- AND con `libres --planta --otra` la salida es `indica una planta`

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
