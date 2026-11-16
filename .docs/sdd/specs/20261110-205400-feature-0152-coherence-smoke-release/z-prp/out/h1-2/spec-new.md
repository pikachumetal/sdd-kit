---
id: 20261112-162723-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: approved
created: 2026-11-12
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-12
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 14:00-16:00` enseña `Norte, Sur`, sin decir en qué planta está cada sala. Con el cambio, `libres 14:00-16:00 --planta 2` enseña solo `Sur`; sin `--planta` sigue enseñando todas, igual que ahora. Cada sala pasa a tener una planta (Norte, la 1; Sur, la 2). Una planta sin salas o un valor que no es un número dan un mensaje claro en vez de una línea vacía.

Validación: dev-lead — lo que sale por la terminal lo ve una persona, y el dev-lead dijo «nos vemos en la validación».

## Capacidades

- Nuevas: `room-availability` — qué salas hay libres en una franja y cómo se filtran.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

### Hallazgos de la review

- **Aceptado** — requisito 1 sin escenario de reserva cancelada/anulada ni día → añadido el AND de reserva cancelada o anulada y la nota «cruza solo la franja» (decisión 12).
- **Aceptado** — casos de `--planta` sin franja, repetido o seguido de franja → decisión 9 y escenario `libres --planta 2`; el repetido queda fuera.
- **Aceptado** — `02`, `-1`, `1.5`, `+2` sin decidir → decisión 9, escenarios `--planta 02` y `--planta -1`.
- **Aceptado** — canal y código de salida y «línea vacía» sin fijar → decisión 10.
- **Aceptado** — Intent prometía más que el Scope → reformulado como «acotar».
- **Aceptado** — fila 3 de «cambia de forma» chocaba con «sin cambiarlo» → precisada a las entradas con `--planta`.
- **Aceptado** — «Límites: no aplica» → «entero sin signo; existen la 1 y la 2».
- **Aceptado** — CHANGELOG sin decisión → decisión 11.
- **Aceptado** — «sin salas» sobre `rooms` antes de las reservas → decisión 10.
- **Rechazado** — `PRODUCT.md` no está en `steering/` → está en la raíz del proyecto, donde lo pide el kit; el revisor no lo encontró por la ruta que se le dio.

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva, datos nuevos (la planta de cada sala) · tamaño: ~70 líneas en 4 ficheros
- Único (sonnet, siete puntos): que el delta de `room-availability` cubra cada THEN con datos, que «sin `--planta`» documente lo que `libres` ya hace hoy sin cambiarlo, y que los dos mensajes de error de la decisión 5 estén en un escenario (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si un THEN contradice el comportamiento de `libres` que hoy solo vive en `src/app.js` y `test/app.test.js`, porque no hay capacidad viva con la que cotejar

1. **Capacidad nueva `room-availability`** (slug en inglés, como pide la plantilla) — hoy no hay `capabilities/`; el comportamiento de `libres` solo vive en el código. Su primer requisito documenta lo que ya hace, sin cambiarlo.
2. **Plantas de las salas: Norte → 1, Sur → 2** — nadie dijo en qué planta está cada una y hacen falta datos para que el filtro se vea; si no son estas, se corrige al validar.
3. **Forma: `libres <franja> [--planta <n>]`**, y `--planta <n>` vale antes o después de la franja — la opción ya está decidida por el dev-lead; el orden libre es mío, para que no importe cómo se teclee.
4. **`<n>` es un entero** (`1`, `2`); no se admiten nombres de planta (`baja`) ni rangos — YAGNI: el producto tiene dos plantas.
5. **Mensajes**, en castellano (art. 4): planta sin salas → `sin salas en la planta 9`; `--planta` sin valor o con algo que no es un entero → `planta no válida: usa un número, p. ej. --planta 1` — sin ellos una planta mal escrita se confundiría con «nada libre».
6. **Sin salas libres en la planta pedida → línea vacía**, como hoy cuando no queda ninguna libre — no cambio ese comportamiento.
7. **Carpeta de la spec en `changes/`**, no en `specs/` (donde dejaron las anteriores) — es la convención vigente del kit.
8. **Enfoque: A (filtrar `rooms` por planta dentro de `freeRooms`) frente a B y C (ver Approach).**
9. **`--planta` es un entero sin signo**: `02` vale como la 2; `-1`, `1.5` y `+2` son «planta no válida». **`--planta` repetido** no se define (no entra). **`--planta` sin franja** (`libres --planta 2`) filtra igual que hoy lo hace `libres` sin franja: sin ninguna reserva que cruzar, salen las salas de esa planta. `libres --planta 14:00-16:00` toma `14:00-16:00` como valor y da «planta no válida» — es coherente aunque no sea el mensaje ideal.
10. **Salida**: todo sale por la salida estándar con código 0, como cada respuesta de la aplicación hoy (`console.log`); la «línea vacía» es `console.log('')`. «Sin salas» se decide sobre `rooms`, antes de mirar las reservas: una planta que existe pero está toda reservada da línea vacía, no el mensaje.
11. **Una línea en `CHANGELOG.md`** bajo `Added` — el proyecto la lleva por cada feature.
12. **El requisito 1 documenta lo que `libres` hace hoy**, incluido que cruza solo la franja y no el día, y que solo cuentan las reservas activas (no las canceladas ni las anuladas) — lo dejo escrito tal cual, sin cambiarlo; el escenario de regresión es el test actual.
- Repaso de coherencia: delta probado en una copia con `sdd capability merge` → 3 requisitos y 5 reglas añadidos, salida 0; `sdd capability check` en la copia → «Capacidades válidas: 1». Corregido: una regla citaba «decisión 5» y la fusión la rechazó; ahora lleva los literales. `git grep -n 0012` fuera de `changes/` → sin resultados.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final según `sdd-verify` (Spec opus+high, Código sonnet+high, Arquitectura según el plan) · sin otros despachos en paralelo · hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»
- Spec aprobada por delegación — «Apruebo la spec por delegación, nos vemos en la validación»
- Parar antes de implementar, con spec y plan escritos — «escribe la spec y el plan y para antes de implementar»

## Intent

Hoy `libres <franja>` devuelve todas las salas libres sin poder acotar por planta, y quien busca sala en la suya tiene que saberse de memoria cuál es cuál. Se quiere poder acotar la búsqueda a una planta (enseñar la planta de cada sala en el listado queda fuera). Éxito: `libres 14:00-16:00 --planta 2` devuelve solo `Sur`, y `libres 14:00-16:00` sigue devolviendo `Norte, Sur` exactamente como hoy. Sería un fracaso que el listado sin `--planta` cambiara.

## Scope

- Entra: cada sala tiene una planta; `libres` acepta `--planta <n>` y filtra por ella; los dos mensajes de la decisión 5; una línea en `CHANGELOG.md`.
- No entra: otros comandos (`reservar`, `cancelar`, `anular`) con planta; enseñar la planta en el listado; nombres de planta distintos de un entero; validar el formato de franja (deuda ya anotada en `debt.md`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de `['Norte', 'Sur']` a salas con planta | `src/app.js:2` (definición), `src/app.js:5` (`freeRooms`) | Scope y decisión 2 |
| `freeRooms(slot)` recibe también la planta | `src/app.js:5`, `src/app.js:28` (llamada) | Scope y Approach |
| `libres` ya no toma `params[0]` como franja cuando hay `--planta` (hoy `libres --planta 2` lo trataría como franja) | `src/app.js:28`; `test/app.test.js:6` sigue valiendo (`libres 10:00-12:00` → `Sur`) | Scope; sin `--planta` nada cambia y el test no cambia |

- Filas que implementa: 0012 (esta feature, sin fila previa en `ROADMAP.md`) → nada la nombra más: comprobado con `git grep -n 0012` fuera de `changes/`.

## Approach

- A. Guardar la planta en cada sala (`{ name, floor }`) y filtrar dentro de `freeRooms(slot, floor)` — cabe en la estructura actual; un solo sitio decide qué sala sale.
- B. Un mapa aparte `floorOf = { Norte: 1, Sur: 2 }` y filtrar después en `run` — dos estructuras que mantener a la vez al añadir una sala; la planta queda lejos de la sala.
- C. Una librería de argumentos — descartada: el proyecto no tiene dependencias externas (`architecture.md`) y no se justifica por una opción.
- Elegido: A — la planta es un dato de la sala y `freeRooms` ya es el único sitio que decide qué sala sale.

Partes del cómo que fija A: `run('libres', params)` separa `--planta <valor>` de `params` (en cualquier posición); la primera posición restante es la franja. Planta válida = cadena de dígitos; el filtro compara con la planta como número.

## Dónde se prueba

- Todos los THEN: por `run('libres', [...])`, como el test actual `libres excluye la sala reservada en la franja` en `test/app.test.js`; sin pantallas.

## Términos y ADR

- Términos resueltos: planta — piso del edificio en que está una sala (número entero)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres lista las salas sin reserva activa en la franja

- GIVEN Norte con reserva activa `lun 10:00-12:00` y Sur sin reservas (`libres` cruza solo la franja, no el día)
- WHEN `libres 10:00-12:00`
- THEN sale `Sur`
- AND con `libres 14:00-16:00` sale `Norte, Sur`
- AND si la reserva de Norte está cancelada o anulada, `libres 10:00-12:00` sale `Norte, Sur`

#### ADDED — Libres filtra por planta

- GIVEN Norte en la planta 1 y Sur en la planta 2, ninguna reservada a las `14:00-16:00`
- WHEN `libres 14:00-16:00 --planta 2`
- THEN sale `Sur`
- AND con `libres 14:00-16:00 --planta 1` sale `Norte`
- AND con `libres --planta 2 14:00-16:00` sale `Sur`
- AND con `libres 14:00-16:00 --planta 02` sale `Sur`
- AND con `libres --planta 2` (sin franja) sale `Sur`
- AND con Norte reservada `10:00-12:00`, `libres 10:00-12:00 --planta 1` sale una línea vacía

#### ADDED — Libres avisa de una planta que no existe o no es válida

- GIVEN Norte en la planta 1 y Sur en la planta 2
- WHEN `libres 14:00-16:00 --planta 9`
- THEN sale `sin salas en la planta 9`
- AND con `libres 14:00-16:00 --planta abc` sale `planta no válida: usa un número, p. ej. --planta 1`
- AND con `libres 14:00-16:00 --planta` (sin valor) sale `planta no válida: usa un número, p. ej. --planta 1`
- AND con `libres 14:00-16:00 --planta -1` sale `planta no válida: usa un número, p. ej. --planta 1`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria, en `rooms` de `src/app.js` (el proyecto no tiene base de datos)
- **Idioma de los nombres**: castellano (opción `--planta`, mensajes)
- **Límites**: planta = entero sin signo; existen las plantas 1 y 2
- **Avisos**: planta sin salas (`sin salas en la planta <n>`) o no válida (`planta no válida: usa un número, p. ej. --planta 1`)
- **Regla ante conflicto**: no aplica

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada: «Apruebo la spec por delegación, nos vemos en la validación» |
