---
id: 20261105-212202-feature-0012-libres-por-planta
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

🦆 Hoy `salas libres 10:00-12:00` te da todas las salas libres de la franja, de todas las plantas. Con esta feature podrás escribir `salas libres 10:00-12:00 --planta 2` y solo saldrán las libres de la planta 2 (por ejemplo `Sur`); si no escribes `--planta`, todo sigue igual que hoy. Si la planta no existe, el programa te lo dice y te enseña las que sí hay, para que un error de tecleo no parezca «no queda nada libre». Por dentro, cada sala pasa a llevar su planta como un dato más, en memoria, junto al nombre.

Validación: dev-lead — lo que usa una persona en la terminal; un humano observa la salida del comando.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran por planta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-availability`), contrato público (opción nueva `--planta` de un comando de la CLI), datos nuevos (planta de cada sala, en memoria) · tamaño: ~60 líneas (código y tests) en 2 ficheros
- Dominio (sonnet): si «Reglas de la capacidad» declara los límites del valor de `--planta` y la regla ante conflicto, y si el «Sin `--planta` no cambia ni un carácter» del Intent tiene escenario (señal: capacidad nueva)
- Técnica (sonnet): si los THEN de los escenarios son coherentes entre sí con los mismos datos y qué pasa con combinaciones de argumentos (`--planta` repetido, sin valor, antes de la franja) (señal: contrato público)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin mirar el segundo ojo sobre las combinaciones de argumentos de la CLI, justo donde los dos revisores han encontrado más huecos

1. **Enfoque (central)**: cada sala lleva su planta como dato propio en la lista de salas que ya vive en memoria (`Norte` → planta 1, `Sur` → planta 2), y `libres` filtra por ese dato. Descartados: un mapa aparte planta→salas (dos sitios que mantener a la vez) y deducir la planta del nombre de la sala (frágil, el nombre es libre). Encaja con el ADR 0003 (`decisions/0003-bookings-in-memory.md`): nada se guarda en disco.
2. **Qué planta tiene cada sala**: Norte en la planta 1 y Sur en la planta 2. Nadie lo dijo y hoy el programa no sabe nada de plantas; son valores inventados para tener datos, **corrígelos si no son los de tu coworking**. En los escenarios son solo el dato de ejemplo, no un requisito.
3. **Valor de `--planta`**: cualquier texto, comparado literalmente con la planta de cada sala; no se normaliza (`01` no es `1`) y no se valida su forma. Un valor que no coincide con ninguna planta es «la planta no existe» (decisión 7), también `10:00-12:00` si alguien lo pone justo detrás de `--planta`.
4. **Orden de los argumentos**: `--planta <valor>` vale antes o después de la franja (`libres 10:00-12:00 --planta 2` y `libres --planta 2 10:00-12:00`); la franja es el primer argumento que no es la opción ni su valor. Sin franja, `libres --planta 2` se comporta como hoy `libres` sin franja (no lo cambio) filtrado por planta.
5. **Interpretación de «sin `--planta`, lista todas las salas»** (a validar tú): lo entiendo como «sin filtrar por planta», es decir, el comportamiento de hoy: las salas libres de la franja, de todas las plantas. No lista salas ocupadas. Si querías otra cosa (listar todas, ocupadas o no), dímelo en el gate.
6. **Sin salas libres en la planta pedida**: el texto `sin salas libres en la planta <n>`. Sin `--planta`, el caso «ninguna libre» no cambia: sigue devolviendo la línea vacía de hoy (hay escenario de regresión).
7. **Planta que no existe**: el texto `la planta <valor> no existe: plantas 1, 2`, con las plantas que sí hay en orden ascendente.
8. **`--planta` sin valor** (último argumento): el texto `falta el número de planta tras --planta`.
9. **`--planta` repetido**: el texto `--planta solo se puede dar una vez`, también si repite el mismo valor. Elegí error y no «gana la última» para que un filtro mal escrito no pase por bueno.
10. **Orden de las comprobaciones** cuando se combinan problemas: primero `--planta` sin valor, luego `--planta` repetido, luego planta que no existe, y al final el listado (con su «sin salas libres»). La franja nunca se valida, como hoy.
11. **Cómo salen los mensajes**: son la cadena que devuelve `run`, como los demás textos de la herramienta (`sin reserva Norte lun`): por la salida normal y sin código de error. Los tres textos de las decisiones 7–9 y el de la 6 siguen esa regla.
12. **Formato de la lista**: nombres separados por `, ` en el orden en que están declaradas las salas (Norte, Sur), como hoy.
13. **Capacidad nueva `room-availability`** (inglés, kebab-case): hoy no hay carpeta `capabilities/`. Su primer requisito recoge el `libres` que ya existe (sin él el filtro no se entiende) y el resto es lo nuevo. Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` sale con código 0 (7 requisitos añadidos y 5 reglas añadidas en `room-availability.md`).
14. **Reglas de la capacidad**: datos en memoria junto a las salas; nombres en castellano, como `--cada-semana`; límites y regla ante conflicto, ver su bloque.
15. **Estimación**: `estimation.md` existe, así que `plan.md` llevará el bloque «Estimación y esfuerzo». Prevista 1–2 tasks.
- Política de modelos: revisores de la spec: dos en Sonnet (ya despachados) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Dominio:
- **Aceptado** — Límites «no aplica» contradecía la decisión 3 → decisión 3 reescrita (cualquier texto, literal, sin normalizar) y «Límites» lo declara, con escenario de `01`.
- **Aceptado** — Regla ante conflicto «no aplica» con conflictos reales → decisiones 9 y 10 y escenarios de `--planta` repetido y de orden de comprobaciones.
- **Aceptado** — Faltaban escenarios de `--planta` sin franja y de «ninguna libre» sin `--planta` → decisión 4 y escenario de regresión de línea vacía; el de sin franja queda como decisión 4 (comportamiento heredado), sin escenario propio.
- **Aceptado** — «Cada sala está en una planta» no era observable → requisito eliminado; Norte→1 y Sur→2 quedan como dato de ejemplo (decisión 2).
- **Aceptado** — La interpretación de «lista todas las salas» figuraba como decisión del dev-lead → movida a la decisión 5, marcada «a validar tú»; bajo «con el dev-lead» queda solo lo que dijo.
- **Aceptado** — Avisos sin la línea vacía heredada → añadida a «Avisos» como salida heredada.
- **Aceptado** — ADR 0003 no localizable → la decisión 1 y las reglas citan su ruta.
- **Aceptado** — Ejemplo `01` → escenario de planta inexistente con `01`.
- **Aceptado** — Formato de la lista sin declarar → decisión 12 y requisito de la lista por franja.

Técnica:
- **Aceptado** — `libres --planta 10:00-12:00` → decisión 3 y escenario: cae en «la planta 10:00-12:00 no existe».
- **Aceptado** — Valores no numéricos o mal formados sin escenario → decisión 3 sin «entero», con escenarios de `abc` y `01`.
- **Aceptado** — `--planta` repetido y sin franja → decisiones 4 y 9, escenario del repetido.
- **Aceptado** — Orden de validación → decisión 10 y escenario de combinación.
- **Aceptado** — Canal y código de salida de los mensajes → decisión 11.
- **Aceptado** — «Cada sala está en una planta» no verificable → ver arriba, eliminado.
- **Aceptado** — GIVEN de «Planta que no existe» citaba las plantas inventadas → ahora cita Norte (1) y Sur (2); orden «ascendente» en la decisión 7.
- **Aceptado** — Cambio interno de `rooms` y test existente → comprobado: `test/app.test.js` solo importa `run`, no `rooms` ni `freeRooms`; sigue en verde sin cambios (tabla de «Lo que se retira»).
- **Aceptado** — Changelog en el Scope → fuera del Scope: lo escribe `sdd-archive`.

No hubo Crítico ni se reescribió la decisión central, así que no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta` se listan todas las salas — «sin --planta, lista todas las salas» (su interpretación es la decisión 5, a validar)
- Perfil de control `delegate` — «Perfil delegate» (coincide con `sdd-kit.json`)

## Intent

Hoy `salas libres <franja>` enseña las salas libres de todo el coworking mezcladas; quien busca sitio en su planta tiene que descartar a ojo las que no le valen. Se quiere poder pedir solo las de una planta: `salas libres 10:00-12:00 --planta 2`. Éxito: con `--planta` sale solo lo de esa planta y sin `--planta` la salida no cambia ni un carácter. Fracaso aunque «funcione»: que pedir una planta mal escrita parezca «no hay salas libres» y se tome por buena una planta que no existe.

## Scope

- Entra: planta como dato de cada sala; opción `--planta <valor>` de `libres`, en cualquier posición; los textos de las decisiones 6–9; un test por escenario.
- No entra: `--planta` en `reservar`, `cancelar` ni `anular`; listar las salas con su planta; plantas con nombre; guardar las plantas fuera del código; filtrar por día (hoy `libres` solo mira la franja y esta feature no lo cambia); validar la forma de la franja; la línea del changelog (la escribe `sdd-archive` al cerrar).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. La lista `rooms` pasa de nombres a salas con planta, y `freeRooms` recibe la planta (cambio interno) | `src/app.js:2`, `src/app.js:5-6`, `src/app.js:28` (única referencia en el repo; `test/app.test.js` solo importa `run`) | Scope (cambio interno; no es un requisito `MODIFIED`: no hay capacidad previa) |

- Filas que implementa: 0012 → nada: comprobado con `git grep -niE "libres|planta|rooms|freeRooms" -- . ':!.docs/sdd/specs'` (solo `changelog.md:10`, histórico; `src/app.js` y `test/app.test.js:5-6`, que sigue en verde sin cambios).

## Approach

Decisión 1: `rooms` pasa a ser una lista de salas con nombre y planta; `freeRooms` recibe además la planta opcional; `run` separa `--planta <valor>` de la franja y aplica las comprobaciones en el orden de la decisión 10 antes de listar. El detalle (funciones, orden de tareas) es del plan.

## Dónde se prueba

- `libres` con y sin `--planta`, y los casos de error: por `run('libres', [...])`, como el test actual de `libres` en `test/app.test.js`.
- La salida en terminal real: un smoke con `node src/app.js libres 10:00-12:00 --planta 2` en la validación.

## Términos y ADR

- Términos resueltos: **Planta** — nivel del edificio en que está una sala; la identifica su número. _Evitar_: piso, floor.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Las salas libres se listan por franja

- GIVEN Norte (planta 1) reservada en la franja 10:00-12:00 y Sur (planta 2) sin reservas
- WHEN se pide `libres 10:00-12:00`
- THEN sale `Sur`
- AND con ambas libres, `libres 14:00-16:00` sale `Norte, Sur` (separadas por `, ` y en el orden en que están declaradas)

#### ADDED — Las libres se filtran por planta

- GIVEN Norte (planta 1) reservada en 10:00-12:00 y sin reservas en 14:00-16:00; Sur (planta 2) sin reservas
- WHEN se pide `libres 10:00-12:00 --planta 2`
- THEN sale `Sur`
- AND con `libres --planta 2 10:00-12:00` (opción antes de la franja) sale lo mismo
- AND con `libres 14:00-16:00 --planta 1` sale `Norte`

#### ADDED — Sin `--planta` no se filtra

- GIVEN Norte y Sur sin reservas en 14:00-16:00
- WHEN se pide `libres 14:00-16:00` sin `--planta`
- THEN sale `Norte, Sur`, igual que antes de esta feature
- AND con Norte y Sur reservadas en 10:00-12:00, `libres 10:00-12:00` sale la línea vacía, igual que antes

#### ADDED — Planta sin salas libres

- GIVEN Norte (planta 1) reservada en 10:00-12:00
- WHEN se pide `libres 10:00-12:00 --planta 1`
- THEN sale `sin salas libres en la planta 1`

#### ADDED — Planta que no existe

- GIVEN Norte (planta 1) y Sur (planta 2)
- WHEN se pide `libres 10:00-12:00 --planta 9`
- THEN sale `la planta 9 no existe: plantas 1, 2`
- AND con `--planta 01` sale `la planta 01 no existe: plantas 1, 2`
- AND con `--planta abc` sale `la planta abc no existe: plantas 1, 2`
- AND con `libres --planta 10:00-12:00` sale `la planta 10:00-12:00 no existe: plantas 1, 2`

#### ADDED — `--planta` sin valor

- GIVEN cualquier estado de reservas
- WHEN se pide `libres 10:00-12:00 --planta`
- THEN sale `falta el número de planta tras --planta`

#### ADDED — `--planta` repetido

- GIVEN cualquier estado de reservas
- WHEN se pide `libres 10:00-12:00 --planta 1 --planta 2`
- THEN sale `--planta solo se puede dar una vez`
- AND combinado con una planta inexistente (`libres 10:00-12:00 --planta 9 --planta 9`) sale también `--planta solo se puede dar una vez`: se comprueba antes que la existencia

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria junto a la lista de salas; no se guardan (`decisions/0003-bookings-in-memory.md`)
- **Idioma de los nombres**: castellano (`--planta`, como `--cada-semana`)
- **Límites**: el valor de `--planta` es cualquier texto, comparado literalmente con la planta de cada sala, sin normalizar; una sola `--planta` por orden
- **Avisos**: `sin salas libres en la planta <n>` · `la planta <valor> no existe: plantas <lista ascendente>` · `falta el número de planta tras --planta` · `--planta solo se puede dar una vez`. La línea vacía sin `--planta` y ninguna libre es salida heredada, no un aviso nuevo
- **Regla ante conflicto**: se comprueba, por este orden, `--planta` sin valor, `--planta` repetido, planta que no existe y, al final, el listado; la franja no se valida

### Estimación y esfuerzo

Va en `plan.md` (modo full).

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
