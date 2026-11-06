---
id: 20261106-100512-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar libres por planta

🦆 Hoy `salas libres 10:00-12:00` enseña todas las salas libres de la franja. Con esto, `salas libres 10:00-12:00 --planta 2` enseña solo las de la planta 2 (por ejemplo `Sur`), y sin `--planta` todo sigue igual que ahora. Para poder filtrar, cada sala pasa a tener una planta anotada en el código.

Validación: dev-lead — es un comando que usa una persona y lo que ve en pantalla lo decide ella.

## Capacidades

- Nuevas: `room-availability` — qué salas salen como libres en una franja y cómo se filtran (planta)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-availability`), contrato público (opción `--planta` de la CLI), datos nuevos (planta por sala) · tamaño: ~30 líneas en 2 ficheros (`src/app.js`, tests)
- Dominio (sonnet): si las reglas de la capacidad cubren el dato nuevo (planta), los dos avisos y el conflicto de `--planta` repetido (señal: datos + contrato público)
- Técnica (sonnet): si cada THEN (`Sur`, salida vacía, `planta desconocida: 9`) lo produce el `run` descrito (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar las reglas de la capacidad (límites y avisos), el hueco que más hallazgos dio aquí

### Hallazgos de la review

- **Aceptado** (Crítico, dominio) — faltaba «Reglas de la capacidad» → añadida la sección con las cinco reglas por nombre.
- **Aceptado** (Importante, técnica y dominio) — el día no entra en `libres` y las fixtures eran ambiguas → GIVEN unificado: Norte reservada de 10:00-12:00 (el lun), y se dice que `libres` filtra por franja, sin día, como hoy (Approach y decisión 3).
- **Aceptado** (Importante, ambas) — escenario mezclado de planta desconocida y sin valor → partido en dos ADDED con la misma fixture.
- **Aceptado** (Importante, técnica) — tipo de retorno de `run` sin fijar → Approach: `run` devuelve una cadena, `''` si no hay libres, y los avisos se devuelven igual que `sin reserva Norte lun` hoy.
- **Aceptado** (Importante, ambas) — valores no enteros (`abc`, `0`, `2.5`) sin regla → decisión 5: cualquier valor que no sea la planta de alguna sala da `planta desconocida: <valor>`; nuevo escenario.
- **Aceptado** (Importante, ambas) — `--planta` repetida, antes de la franja o sin franja → decisiones 6 y 7, y «No entra».
- **Aceptado** (Importante, ambas) — plantas inventadas → decisión 2 marcada como la primera a validar, y las plantas válidas se derivan de las salas anotadas.
- **Aceptado** (Menor, técnica y dominio) — faltaban escenarios de planta sin libres y de regresión sin `--planta` → añadidos.
- **Aceptado** (Menor, técnica) — contrato interno de `freeRooms` y de la sala sin declarar → Approach.
- **Rechazado** (Importante, dominio) — idioma del nombre de la capacidad → el slug es un nombre de fichero y va en inglés kebab-case por convención del kit (`spec-template.md`); la regla 4 de la constitución cubre el texto de la interfaz y de los documentos, y el contenido de la capacidad va en castellano. Queda en decisión 1 para tu visto bueno.
- **Rechazado** (Menor, técnica) — quitar la nota del delta probado en copia → es el registro que pide el repaso de coherencia; va como nota, no como decisión.
### Hallazgos de la segunda ronda (sin Críticos, sin tercera ronda)

- **Aceptado** (Importante) — `--planta 9 --planta 2` y la franja inválida sin regla → AND añadido a «Planta repetida»; la franja inválida entra en «No entra» (ya es la deuda «Sin validación del formato de franja horaria» del roadmap).
- **Aceptado** (Importante) — «(el lun)» en la fixture y orden de `Norte, Sur` → quitado el día del GIVEN; la franja se compara como texto exacto y el orden es el de la lista de salas (Approach y escenario).
- **Aceptado** (Importante) — «Límites» tautológico → la planta se compara como texto exacto con la de cada sala; `--planta 02` y `2.5` son desconocidas (decisión 5, regla y escenario).
- **Aceptado** (Importante) — «Idioma de los nombres» citaba mal la constitución → regla separada: nombres de código y fichero (convención del kit; `floor`, `room-availability`) y texto de interfaz (regla 4).
- **Aceptado** (Importante) — `--planta` antes de la franja o sin franja → se queda en «No entra», ahora dicho como «sin garantía»; no prometo una salida mínima nueva.
- **Aceptado** (Menores) — GIVEN de «Planta sin salas libres» igualado a los demás; nota sobre avisos como cadena (convención actual, como `sin reserva Norte lun`); recuento de la nota del merge corregido; «Entra» cita la capacidad y el test de regresión; la afirmación de «no cambia de forma» corregida: la sala sí cambia de forma interna (`git grep rooms`: solo la usa `freeRooms`).
- **Rechazado** (Menor) — mover la «Política de modelos» fuera de ✋ → la plantilla del kit la pone ahí, y es la línea que confirma el paralelismo al aprobar.

- **Rechazado** (Importante, dominio) — canal y código de salida de los avisos → hoy `run` devuelve la cadena y `app.js` la imprime con `console.log`, sin código de salida distinto; los avisos nuevos siguen esa convención (regla «Avisos»), sin canal propio.

1. **Capacidad nueva `room-availability`** (kebab-case en inglés, el contenido en castellano): `capabilities/` está vacía y `libres` no tiene capacidad; el delta recoge `libres` entero, con y sin `--planta`, para dejar su comportamiento vivo documentado.
2. **Plantas de las salas (validar primero)**: no existe el dato. Propongo `Norte` → planta 1 y `Sur` → planta 2, anotado junto a la lista de salas de `src/app.js`. Si las plantas reales son otras, se corrige antes de aprobar: los escenarios y el aviso de planta desconocida salen de este dato.
3. **Forma del comando**: `libres <franja> --planta <n>`, con la franja primero y la opción después (como `reservar … --cada-semana`). `libres` sigue filtrando solo por franja, sin día, como hoy.
4. **Planta con número entero**: `--planta 2`, no `--planta=2` ni nombres de planta.
5. **Planta que no existe o no válida** (`--planta 9`, `abc`, `0`, `02`, `2.5`): `planta desconocida: <valor>`, con el valor tal como se tecleó. Las plantas válidas son las de alguna sala anotada, y el valor se compara como texto exacto con ella (`02` no es `2`).
6. **`--planta` sin valor**: `falta la planta tras --planta`.
7. **`--planta` repetida**: gana la última (`--planta 1 --planta 2` equivale a `--planta 2`). `--planta` antes de la franja, sin franja o con una franja mal escrita queda fuera: sin garantía.
8. **Planta sin salas libres**: la salida queda vacía (`''`), igual que hoy cuando no hay ninguna libre en la franja.
9. **Enfoque** (sin menú de enfoques en `delegate`): un campo `floor` en cada sala de `src/app.js` y el filtro dentro de `freeRooms`. Descartado: un fichero de datos aparte (el proyecto es un solo fichero, `tech-stack.md`) y filtrar en `run` tras listar (duplicaría la lista de salas).
10. **Tasks previstas**: 1 (RED con los escenarios, luego el filtro). No se parte.
- Nota (no es decisión): delta probado en una copia de `.docs/sdd` con `sdd capability merge`: sale con éxito sobre la spec final (6 requisitos y 5 reglas añadidos en `room-availability.md`); el `capabilities/` del repo no cambia hasta el cierre.
- Política de modelos: revisores de la spec: dominio y técnica, ambos sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `libres` no distingue plantas: quien solo quiere una sala de su planta tiene que leer la lista entera. Se quiere poder limitar el listado a una planta, sin cambiar nada para quien no usa la opción. Éxito: `libres 10:00-12:00 --planta 2` devuelve solo las salas libres de la planta 2, y `libres 10:00-12:00` devuelve lo mismo que antes. Fracaso aunque funcione: que el comando sin `--planta` cambie su salida.

## Scope

- Entra: opción `--planta <n>` en `libres`; planta anotada por sala (`floor`) y filtro en `freeRooms`; los avisos de las decisiones 5 y 6; la capacidad nueva `room-availability` con la documentación viva de `libres`; tests de los escenarios, incluido el de regresión sin `--planta`.
- No entra: reservar por planta, mostrar la planta en el listado, nombres de planta, otros comandos con `--planta`, un fichero de datos de salas, el día en `libres`, `--planta` antes de la franja o sin franja, validar el formato de la franja (deuda del roadmap).

## Lo que se retira o cambia de forma

Nada se retira, y `libres <franja>` sin opción conserva su salida. Cambia de forma solo un dato interno: cada sala pasa de cadena a `{ name, floor }`. Comprobado con `git grep -n -i "libres\|planta"` y `git grep -n "rooms"` fuera de `specs/`: `src/app.js:28` (se amplía), `src/app.js:2` y `:6` (única lectura de la lista de salas, la de `freeRooms`), `test/app.test.js:5-6` (su aserción `run('libres', ['10:00-12:00'])` → `Sur` sigue valiendo) y `changelog.md:10` (histórico de la 0006, no se toca).

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| sala como cadena → `{ name, floor }` | `src/app.js:2`, `:6` | Scope y Approach (decisión 9) |

- Filas que implementa: ninguna (0012 sin fila en `roadmap.md`) → nada la nombra | nada: comprobado con `git grep -n "0012"` fuera de `specs/`

## Approach

Cada sala pasa de nombre a `{ name, floor }` (`Norte` planta 1, `Sur` planta 2) en `src/app.js`; `freeRooms(slot, floor)` filtra por franja y, si recibe planta, por planta. `run('libres', params)` toma la franja de `params[0]`; si `params` trae `--planta`, lee el valor siguiente (el último, si se repite) y lo valida contra las plantas de las salas. `run` devuelve una cadena (`''` si no hay libres), y los avisos se devuelven igual que hoy `sin reserva Norte lun`: `app.js` imprime con `console.log`, sin código de salida propio. `freeRooms` solo lo llama `run` (`git grep`).

## Dónde se prueba

- `libres` con y sin `--planta`, planta sin libres, planta desconocida y `--planta` sin valor: llamando a `run('libres', [...])`, como el test existente de `libres` en `test/app.test.js`.

## Términos y ADR

- Términos resueltos: planta — piso del edificio donde está una sala (número entero)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres de una franja

- GIVEN la sala Norte reservada de 10:00-12:00 y Sur sin reservas
- WHEN se pide `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND con `libres 14:00-16:00` (otra franja, que no coincide con la reservada) la salida es `Norte, Sur`, en el orden de la lista de salas

#### ADDED — Libres de una franja filtrados por planta

- GIVEN Norte en la planta 1 y Sur en la planta 2, y Norte reservada de 10:00-12:00
- WHEN se pide `libres 10:00-12:00 --planta 2`
- THEN la salida es `Sur`
- AND con `libres 14:00-16:00 --planta 1` la salida es `Norte`

#### ADDED — Planta sin salas libres

- GIVEN Norte en la planta 1 y Sur en la planta 2, y Norte reservada de 10:00-12:00
- WHEN se pide `libres 10:00-12:00 --planta 1`
- THEN la salida es vacía

#### ADDED — Planta desconocida

- GIVEN Norte en la planta 1 y Sur en la planta 2
- WHEN se pide `libres 10:00-12:00 --planta 9`
- THEN la salida es `planta desconocida: 9`
- AND con `--planta abc` la salida es `planta desconocida: abc`
- AND con `--planta 02` la salida es `planta desconocida: 02`

#### ADDED — Planta sin valor

- GIVEN Norte en la planta 1 y Sur en la planta 2
- WHEN se pide `libres 10:00-12:00 --planta`
- THEN la salida es `falta la planta tras --planta`

#### ADDED — Planta repetida

- GIVEN Norte en la planta 1 y Sur en la planta 2, y Norte reservada de 10:00-12:00
- WHEN se pide `libres 10:00-12:00 --planta 1 --planta 2`
- THEN la salida es `Sur`
- AND con `--planta 9 --planta 2` la salida es `Sur`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: campo `floor` de cada sala, en la lista de salas de `src/app.js`.
- **Idioma de los nombres**: nombres de código y de fichero en inglés (`floor`, `room-availability`, convención del kit); texto de interfaz (opción `--planta`, avisos) en castellano (constitución, regla 4).
- **Límites**: las plantas válidas son las de alguna sala anotada; el valor se compara como texto exacto, y cualquier otro (`9`, `abc`, `02`, `2.5`) es desconocido.
- **Avisos**: `planta desconocida: <valor>` · `falta la planta tras --planta`; salen como cadena de `run`, sin código de salida propio, igual que `sin reserva Norte lun` hoy.
- **Regla ante conflicto**: con `--planta` repetida gana la última.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
