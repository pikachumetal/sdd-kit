---
id: 20261115-194008-feature-0012-libres-planta
feature: 0012
title: Filtrar las salas libres por planta
mode: full
profile: delegate
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar las salas libres por planta

🦆 Hoy `salas libres 10:00-12:00` enseña todas las salas libres en esa franja, estén en la planta que estén. Con esta feature, `salas libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (`Sur`), y sin `--planta` sigue enseñando todas, como hasta ahora. Para ello cada sala pasa a tener una planta, un dato que hoy no existe; el filtro se aplica sobre ese dato.

Validación: dev-lead — lo usa una persona desde la terminal; ejecuta `libres` con y sin `--planta` y mira la salida.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja, y cómo se filtran por planta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`room-availability`) · tamaño: ~25 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Revisor único (sonnet, siete puntos): si los THEN de «Libres filtra por planta» y de «Planta desconocida» se cumplen con los datos del arranque y si algún valor de la spec no está listado aquí (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin cubrir un THEN que pase por casualidad con los datos del arranque o un valor puesto sin decirlo

1. **Planta de cada sala: `Norte` → planta 1, `Sur` → planta 2. PENDIENTE de confirmar por ti**: la petición no dice en qué planta está cada sala y hoy el código no lo guarda; son valores míos para poder escribir los escenarios. Si es otro reparto, cambian los valores de los THEN y nada más. Aprobar la spec sin corregirlo lo confirma.
2. **Motivo (supuesto mío, pendiente)**: nadie dijo para qué se quiere el filtro; supongo que al llegar a una planta se quiere ver lo libre en ella. Si el motivo es otro, el Intent puede cambiar.
3. **Forma de la opción: `--planta <número>`**, con el número como argumento aparte (`--planta 2`), no `--planta=2`. El nombre `--planta` lo decidió el dev-lead; el resto de la forma, yo.
4. **Orden libre de los argumentos**: `libres 10:00-12:00 --planta 2` y `libres --planta 2 10:00-12:00` dan lo mismo.
5. **Planta que no existe o no es un número** (`--planta 3`, `--planta abc`, `--planta 02`): sale `planta desconocida: 3` / `…: abc` / `…: 02`. «Existe» = el texto del valor es exactamente la planta de alguna sala (`1` o `2`); `02` o `2.0` no coinciden.
6. **`--planta` sin número** (`libres 10:00-12:00 --planta`): sale `falta el número de planta`. El argumento que sigue a `--planta` es siempre su valor: `libres --planta 14:00-16:00` da `planta desconocida: 14:00-16:00`.
7. **Sin ninguna sala libre en la planta**: la salida queda vacía, igual que hoy cuando no hay ninguna libre; no añado un mensaje nuevo (ver «No entra»).
8. **Bordes que no valido y que quedan sin definir**: `--planta=2` (no se reconoce como la opción: sobra un argumento y no se filtra, sin aviso), `--planta ""` (valor vacío), `--planta` repetido, y sin franja (`libres --planta 2`, que se comporta como hoy sin franja: ninguna reserva coincide y salen las de la planta). Con un error de planta sale el aviso y no se mira nada más. La franja sigue sin validarse (ya está en `debt.md`).
9. **`libres` ignora el día de la reserva** (hoy solo compara la franja) y **una reserva cancelada o anulada deja libre la sala** (`freeRooms` solo cuenta las de estado `active`): lo he comprobado leyendo `freeRooms`. No lo cambio; queda escrito en «Límites» de la capacidad.
10. **Capacidad nueva `room-availability`** (kebab-case en inglés), porque no hay capacidades y el comportamiento de `libres` no está escrito en ningún sitio. Recoge también el comportamiento actual (por franja, sin filtro) para que el filtro tenga contra qué definirse.
11. **Término nuevo: «planta»** (la planta del edificio donde está la sala; número). Candidato a «Terminology» de `PRODUCT.md`; lo escribe el cierre.
12. **Enfoque**: cada sala pasa a ser `{ name, floor }` y `freeRooms` filtra por `floor` si se le pasa una planta, frente a un mapa `floors` aparte (ver Approach). `floor` va en inglés como el resto del código (`rooms`, `freeRooms`); lo que ve el usuario, en castellano.
13. **Línea base verificada**: hoy `libres 10:00-12:00` da `Sur` (test existente) y las salas se unen con `, ` (`Norte, Sur`, leído en `freeRooms`); «Libres por franja» y «Libres sin planta lista todas» la recogen tal cual.
14. **Pasada de coherencia**: delta probado en una copia de `.docs/sdd` con `sdd capability merge` sobre la spec final → exit 0, 5 requisitos y 5 reglas añadidos en `room-availability.md`; `git grep` de lo que cambia de forma sin más sitios que `src/app.js` y `test/app.test.js`.
- Política de modelos: revisor de la spec `sonnet` (uno, más una segunda ronda `sonnet`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: el orden «ocupadas, luego planta» no es observable → quitado del Approach (el resultado no depende del orden).
- **Aceptado** — Crítico: «Libres por franja» sin línea base verificada → decisión 13, y quito el día de los GIVEN (`libres` lo ignora, decisión 9).
- **Aceptado** — Importante: `02`, `2.0` sin dicho → decisión 5 y THEN con `--planta 02`.
- **Aceptado** — Importante: `--planta` seguido de la franja → decisión 6 y THEN.
- **Aceptado** — Importante: bordes sin decidir (sin franja, repetido, orden de avisos) → decisión 8.
- **Aceptado** — Importante: «Límites» y «conflicto» sin razonar; ADR 0003 → reglas reescritas; el ADR existe (`.docs/sdd/decisions/0003-bookings-in-memory.md`) y se cita con su ruta.
- **Rechazado** — Importante: reparto de plantas pendiente como eje de los THEN → es un dato que solo sabes tú; queda marcado pendiente en 1 y en el delta, y la aprobación lo convierte en definitivo. No se puede resolver sin ti.
- **Aceptado** — Menor: «sin planta» duplicaba «por franja» → ahora usa 14:00-16:00 con las dos plantas y «por franja» solo 10:00-12:00.
- **Rechazado** — Menor: `floor` frente a «Evitar: room» → los identificadores del código no son términos de producto; decisión 12.
- **Aceptado** — Menor: conteo de la decisión 11 → ahora lo dice el resultado final.

Segunda ronda (sin Críticos, no hay tercera):

- **Aceptado** — Importante: día ignorado y «activa» sin definir → decisión 9 (verificado: `freeRooms` solo cuenta `active`) y «Límites» de la capacidad.
- **Aceptado** — Importante: `--planta=2` ignorado en silencio → decisión 8, como borde sin definir.
- **Aceptado** — Importante: `--planta` repetido chocaba con la decisión 6 → decisión 8, sin definir.
- **Aceptado** — Importante: nota «pendiente» dentro del delta → sacada del delta; la decisión 1 dice que aprobar sin corregir confirma el reparto.
- **Aceptado** — Menor: AND con `10:00-12:00 --planta 2` no probaba el filtro → añadido el mismo con `14:00-16:00`.
- **Aceptado** — Menor: edición de `PRODUCT.md` y de la capacidad sin declarar → Scope.
- **Aceptado** — Menor: `--planta ""` → decisión 8.
- **Rechazado** — Menor: unificar «dev-lead» con el único usuario de `PRODUCT.md` → «dev-lead» es el rol que usa el kit para quien aprueba; aquí es la misma persona.
- **Rechazado** — Menor: conteo de revisores y tamaño → la política de modelos ya dice una revisión más una segunda ronda; el tamaño cuenta código y tests, los documentos los escribe el cierre.

## Intent

Hoy `salas libres <franja>` devuelve las salas libres de la franja sin distinguir dónde están: con `Norte` reservada de 10:00 a 12:00, `salas libres 10:00-12:00` da `Sur`. Cuando se quiere una sala en una planta concreta hay que mirar la lista y saber de memoria en qué planta está cada una. Éxito: `salas libres 10:00-12:00 --planta 2` da `Sur`, `--planta 1` da lo libre de la planta 1, y sin `--planta` todo sigue igual que hoy.

Anti-objetivo: que sin `--planta` cambie algo de la salida actual (aunque el filtro funcione).

## Scope

- Entra: la opción `--planta <número>` en `libres`; el dato «planta» de cada sala (`Norte` 1, `Sur` 2); los dos avisos (planta desconocida, falta el número); escribir la capacidad `room-availability` con el comportamiento de `libres` (la crea el cierre) y añadir «planta» a «Terminology» de `PRODUCT.md` (también el cierre).
- No entra: filtrar `reservar`, `cancelar` o `anular` por planta; un mensaje cuando no hay ninguna libre; listar las plantas; nombres de planta que no sean un número; guardar las plantas fuera del código; validar la franja.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. `rooms` pasa de `['Norte', 'Sur']` a objetos `{ name, floor }`: cambia su forma interna, no lo que se ve | `src/app.js:2`, `src/app.js:6` (`freeRooms`) | Scope · decisión 12 |

- Filas que implementa: nada: comprobado con `git grep -niE "libres|planta|rooms" -- . ':!.docs/sdd/specs'`; solo `src/app.js`, `test/app.test.js` y la línea de `CHANGELOG.md` de la 0006 lo nombran, y esta es historia que no cambia.

## Approach

- **A. Salas como objetos `{ name, floor }`** — un solo sitio con el dato de cada sala; `freeRooms` filtra por `floor` si llega una planta. Cuesta tocar la forma de `rooms` y cada sitio que la use (hoy solo `freeRooms`).
- **B. Un mapa `floors` aparte** (`{ Norte: 1, Sur: 2 }`) junto a `rooms` — no toca `rooms`, pero deja dos listas que mantener a la vez: añadir una sala y olvidar su planta pasa en silencio.
- Elegido: **A** — el dato de la sala vive con la sala; con `rooms` usado solo en `freeRooms`, el cambio de forma cuesta una línea.

Lo que fija A:

- `run('libres', params)` separa `--planta` y el argumento que le sigue de los demás; el primer argumento restante es la franja.
- Validación antes de filtrar: sin valor → `falta el número de planta`; valor que no es exactamente la planta de alguna sala → `planta desconocida: <valor>`.
- Con planta válida, `freeRooms` devuelve las libres de esa planta; sin `--planta`, el camino es el de hoy.

## Dónde se prueba

- `libres` con y sin `--planta`, planta desconocida y falta de número: por `run('libres', [...])`, como el test actual de `libres` en `test/app.test.js`.

## Términos y ADR

- Términos resueltos: planta — la planta del edificio en la que está una sala; número. _Evitar_: piso, nivel.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres por franja

- GIVEN salas `Norte` y `Sur`, y `Norte` con una reserva activa en 10:00-12:00
- WHEN `salas libres 10:00-12:00`
- THEN la salida es `Sur`

#### ADDED — Libres sin planta lista todas

- GIVEN `Norte` en la planta 1 y `Sur` en la planta 2, sin reservas en 14:00-16:00
- WHEN `salas libres 14:00-16:00` sin `--planta`
- THEN la salida es `Norte, Sur` (las de todas las plantas)

#### ADDED — Libres filtra por planta

- GIVEN `Norte` en la planta 1, `Sur` en la planta 2, y `Norte` con una reserva activa en 10:00-12:00
- WHEN `salas libres 14:00-16:00 --planta 1`
- THEN la salida es `Norte`
- AND con `salas libres 14:00-16:00 --planta 2` la salida es `Sur` (`Norte` también está libre y queda fuera)
- AND con `salas libres 10:00-12:00 --planta 2` la salida es `Sur`
- AND con `salas libres 10:00-12:00 --planta 1` la salida está vacía (`Norte` está ocupada y `Sur` es de otra planta)
- AND `salas libres --planta 2 14:00-16:00` da `Sur`, igual que con la opción al final

#### ADDED — Planta desconocida

- GIVEN las mismas salas, solo con plantas 1 y 2
- WHEN `salas libres 14:00-16:00 --planta 3`
- THEN la salida es `planta desconocida: 3`
- AND con `--planta abc` la salida es `planta desconocida: abc`
- AND con `--planta 02` la salida es `planta desconocida: 02`
- AND `salas libres --planta 14:00-16:00` da `planta desconocida: 14:00-16:00`

#### ADDED — Planta sin número

- GIVEN las mismas salas
- WHEN `salas libres 14:00-16:00 --planta`
- THEN la salida es `falta el número de planta`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria del proceso; la planta de cada sala, en la constante de salas de `src/app.js` (ADR 0003, `.docs/sdd/decisions/0003-bookings-in-memory.md`).
- **Idioma de los nombres**: castellano (`--planta`, `planta desconocida`).
- **Límites**: las plantas válidas son solo las que tiene alguna sala (hoy 1 y 2). La disponibilidad se calcula solo por franja, sin mirar el día; una reserva cancelada o anulada deja libre la sala.
- **Avisos**: `planta desconocida: <valor>` · `falta el número de planta`.
- **Regla ante conflicto**: no aplica: varias salas en una misma planta no se excluyen entre sí.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
