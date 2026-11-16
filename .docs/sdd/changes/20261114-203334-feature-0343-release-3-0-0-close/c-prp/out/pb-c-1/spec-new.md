---
id: 20261115-192533-feature-0012-libres-por-planta
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

🦆 Hoy `salas libres 10:00-12:00` te dice qué salas están libres en esa franja, sin importar dónde estén. Con esta feature podrás añadir `--planta 2` y solo verás las libres de esa planta: `salas libres 10:00-12:00 --planta 2` → `Sur`. Sin `--planta` todo sigue como hasta ahora. Para que esto sea posible, cada sala pasa a saber en qué planta está (Norte en la 1, Sur en la 2: valores míos, a validar). Y «sin `--planta`, lista todas las salas» lo entiendo como todas las libres de la franja, como hoy: dime si no.

Validación: dev-lead — es lo que usa una persona desde la terminal; basta ejecutar `libres` con y sin `--planta`.

## Capacidades

- Nuevas: `room-availability` — qué salas están libres en una franja y cómo se filtran (por planta).
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva, interfaz de línea de comandos (opción nueva) · tamaño: ~40 líneas en 4 ficheros
- Único (sonnet): si los escenarios de `--planta` cubren valor sin sala, valor no válido y combinación con la franja (señal: opción nueva), y si algo del Scope falta en el Intent
- Mínimo razonable: sin revisión — deja sin mirar los bordes de `--planta` mal escrita

1. **Plantas de las salas**: Norte en la planta 1 y Sur en la planta 2 — el código no guarda ninguna planta hoy y el dev-lead no dijo cuál es cuál; hay que corregirlo si no son esas.
2. **Planta = entero sin signo, solo dígitos** (`--planta 2`; `02` vale 2; `2.5`, `-1` y `10:00-12:00` no valen), escrita tras la franja o antes (`--planta 2 10:00-12:00` también vale); si se repite, cualquier valor no válido avisa y, si todos valen, vale el último; se evalúa antes de leer la franja — el dev-lead solo dio el nombre de la opción.
3. **«Sin `--planta`, lista todas las salas»** lo interpreto como «todas las salas libres de la franja», que es lo que hace hoy `libres` — si quería decir todas aunque estén ocupadas, avisa.
4. **Planta sin salas libres o sin salas** (`--planta 1` con Norte ocupada, o `--planta 9`): salida vacía, igual que hoy cuando no queda ninguna libre — no inventé un mensaje.
5. **`--planta` sin valor o con algo que no es un número** (`--planta`, `--planta abc`): `planta no válida: usa --planta <número>`.
6. **Capacidad nueva `room-availability`** (slug en inglés), con solo el requisito nuevo: el proyecto no tiene `capabilities/` y el comportamiento previo de `libres` no se vuelca (las init no vuelcan).
7. **Enfoque**: A frente a B y C (ver Approach).
8. **Docs**: una línea nueva en `CHANGELOG.md` bajo `Added`; «Planta» en la Terminology de `PRODUCT.md`; el README no se toca (no documenta comandos).
9. **Pasada de coherencia**: delta probado en una copia de `.docs/sdd` con `sdd capability merge` → un requisito añadido por cada ADDED del delta y las cinco reglas añadidas, sin rechazos; `git grep planta` fuera de `changes/` sin resultados antes de implementar (tras implementar solo darán los ficheros del Scope).
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado** (Crítico) — «un cambio de dos líneas» era falso: con `rooms` en objetos el filtro y el `join` también cambian → Approach A reescrito (tres puntos), tamaño ~40 líneas en 4 ficheros.
- **Aceptado** — líneas citadas incorrectas → tabla con `:2`, `:5-6`, `:28`.
- **Aceptado** — la extracción de `--planta` no estaba en el Scope → añadida al «Entra» y a la tabla.
- **Aceptado** — casos límite de valor → decisión 2 (solo dígitos, última vale) y escenarios `2.5`, `-1`, `--planta 10:00-12:00`, repetida.
- **Aceptado** — el escenario hablaba del «lun» y `libres` no mira el día → GIVEN corregido.
- **Aceptado** — regresión mezclada con requisito nuevo → requisito propio «Sin `--planta`, `libres` no cambia».
- **Aceptado** — «Planta» sin definir en `PRODUCT.md` → entra en el Scope y la decisión 8.
- **Aceptado** — decisión 9 afirmaba sin precisar → reformulada con la salida real (3 requisitos y 5 reglas).
- **Aceptado** — Límites e Idioma → Límites declarado y art. 4 citado.
- **Aceptado** — tests y gate fuera del Scope → añadidos al «Entra».

Segunda ronda (sin Críticos), todo aceptado: el `git grep` es previo a implementar; `--planta` repetida y valores `02`, vacío y `abc` en cualquier orden, con escenario; el aviso se evalúa antes de leer la franja; el «No entra» fija que cancelar y anular no se tocan; Límites e Idioma precisados; la interpretación de la decisión 3 repetida en el 🦆; política de modelos sin la frase contradictoria.

### Decisiones tomadas con el dev-lead

- Filtrar las libres por planta con la opción `--planta` — «filtrar libres por planta con la opción --planta»
- Sin `--planta`, se listan todas las salas — «sin --planta, lista todas las salas» (interpretación en la decisión 3)
- Perfil delegate — «Perfil delegate.»

## Intent

Hoy `libres <franja>` devuelve las salas sin reserva activa en esa franja, de todas las plantas mezcladas. Quien busca sitio en su planta tiene que filtrar a ojo. Éxito: `libres 10:00-12:00 --planta 2` devuelve solo las salas libres de la planta 2 y `libres 10:00-12:00` devuelve lo mismo que hoy. Fracaso aunque «funcione»: que `--planta` cambie el resultado sin `--planta`, o que una planta mal escrita parezca «sin salas libres».

## Scope

- Entra: planta de cada sala (Norte 1, Sur 2); opción `--planta <número>` en `libres`, extraída de los argumentos antes de leer la franja; el mensaje de planta no válida; los tests de `libres` en `test/app.test.js` (primero, y el gate `node --test`); la línea del `CHANGELOG.md`; el término «Planta» en `PRODUCT.md` (Terminology).
- No entra: reservar o cancelar por planta; mostrar la planta en la salida; más salas; validar el formato de la franja ni su ausencia (`libres --planta 2` sin franja filtra por planta como hoy `libres` sin franja; ya está en la deuda «Por triar»); tocar `findBooking`, `cancelBooking`, `voidBooking` ni `test/cancel.test.js` (`bookings[].room` sigue siendo el nombre).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista de salas con planta | `src/app.js:2` (definición), `src/app.js:5-6` (`freeRooms`: el filtro compara `room.name` y devuelve nombres) | Scope y decisión 1: misma task |
| `freeRooms(slot)` recibe también la planta y `run` extrae `--planta` de los argumentos | `src/app.js:5`, `src/app.js:28` | Scope: misma task |

- Filas que implementa: 0012 no tiene fila en el roadmap → nada: comprobado con `git grep -n "0012\|planta" -- . ':!.docs/sdd/changes'` (sin resultados previos).

## Approach

- A. `rooms` pasa a objetos `{ name, planta }`; `freeRooms` filtra por planta cuando llega, compara por `room.name` y devuelve nombres; `run` extrae la opción — toca tres puntos pequeños de `src/app.js`, los datos de la sala viven juntos, se prueba por `run`.
- B. Un mapa aparte `plantaDe = { Norte: 1, Sur: 2 }` junto a la lista de nombres — no toca `rooms`, pero el dato de una sala queda en dos sitios y una sala nueva puede olvidar su planta.
- C. Deducir la planta del nombre o de otro texto — no hay nada fiable en «Norte»/«Sur» que la diga.
- Elegido: A — el dato de la sala vive en un solo sitio y no añade estructuras nuevas.

La opción se extrae de los argumentos de `libres` antes de leer la franja; la franja sigue siendo el primer argumento que no es la opción ni su valor.

## Dónde se prueba

- `libres` con y sin `--planta`, y el aviso de planta no válida: por `run('libres', [...])`, como el test actual de `libres` en `test/app.test.js`.

## Términos y ADR

- Términos resueltos: planta — piso del edificio donde está una sala; se escribe «planta», no «piso» ni «floor».
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Las salas libres se pueden filtrar por planta

- GIVEN Norte en la planta 1, Sur en la planta 2, y Norte con una reserva activa en 10:00-12:00 (`libres` mira la franja, no el día)
- WHEN `libres 10:00-12:00 --planta 2`
- THEN la salida es `Sur`
- AND `libres 10:00-12:00 --planta 1` da salida vacía (Norte está ocupada)
- AND `libres 13:00-14:00 --planta 1` da `Norte`
- AND `libres --planta 2 10:00-12:00` da `Sur` (la opción vale antes de la franja)
- AND `libres 10:00-12:00 --planta 9` da salida vacía (no hay salas en esa planta)
- AND con `--planta` repetida (`--planta 1 --planta 2`) vale la última
- AND `libres 10:00-12:00 --planta 02` da `Sur` (`02` vale 2)

#### ADDED — Sin `--planta`, `libres` no cambia

- GIVEN el mismo estado de reservas
- WHEN `libres 10:00-12:00` (sin `--planta`)
- THEN la salida es `Sur`, igual que antes de esta feature

#### ADDED — Una planta mal escrita se avisa

- GIVEN cualquier estado de reservas
- WHEN `libres 10:00-12:00 --planta abc`, `--planta 2.5`, `--planta -1`, `--planta ""`, `--planta abc --planta 2`, `--planta 2 --planta abc`, `libres --planta 10:00-12:00` o `libres 10:00-12:00 --planta` (sin valor)
- THEN la salida es `planta no válida: usa --planta <número>`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: la planta de cada sala, junto a su nombre, en `src/app.js` (en memoria, como las reservas).
- **Idioma de los nombres**: castellano en el texto de la interfaz (`--planta`, el aviso), según el art. 4 de la constitution; los identificadores del código no cuentan.
- **Límites**: `--planta` es un entero sin signo (solo dígitos); `0` y números muy grandes valen y dan salida vacía
- **Avisos**: `planta no válida: usa --planta <número>`
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
