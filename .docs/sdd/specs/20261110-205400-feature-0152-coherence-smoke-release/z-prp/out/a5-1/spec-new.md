---
id: 20261112-155552-feature-0012-libres-por-planta
feature: 0012
title: Filtrar libres por planta
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar libres por planta

🦆 Hoy `libres 14:00-16:00` te dice qué salas están libres en esa franja, estén en la planta que estén: `Norte, Sur`. Con este cambio puedes añadir `--planta 1` y solo te enseña las de esa planta: `libres 14:00-16:00 --planta 1` → `Norte`. Sin `--planta` todo sigue igual que hoy. Para que sea posible, cada sala pasa a saber en qué planta está (Norte en la 1, Sur en la 2: son valores que he puesto yo y tienes que confirmar).

Validación: dev-lead — es una opción de línea de comandos que usa una persona y no hay otro modo de saber que la salida es la que espera.

## Capacidades

- Nuevas: `free-rooms` — qué salas salen libres en una franja y cómo se filtran por planta.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`free-rooms`) · tamaño: ~25 líneas en 2 ficheros
- Dominio (sonnet): que «sin `--planta` lista todas las salas» no contradiga el comportamiento actual de `libres` en `src/app.js` y que cada THEN del delta lleve datos (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si los escenarios cubren los bordes (`--planta` sin valor, planta inexistente)

1. **Interpretación de «sin `--planta`, lista todas las salas»** — PENDIENTE DE TU CONFIRMACIÓN: la leo como «sin filtro de planta», es decir, el comportamiento de hoy: las salas libres de la franja, de todas las plantas, sin mostrar las ocupadas. — es la lectura que no cambia nada de lo existente; si querías ver también las ocupadas, es otro alcance.
2. **Plantas de las salas existentes**: Norte → planta `1`, Sur → planta `2`. — ningún documento dice en qué planta están; son valores de arranque inventados.
3. **Cómo se escribe**: `--planta <n>` con espacio (no `--planta=1`), y puede ir antes o después de la franja (`libres 14:00-16:00 --planta 1` y `libres --planta 1 14:00-16:00` dan lo mismo). — el CLI actual lee la franja como primer argumento posicional; aceptar ambos órdenes evita un error tonto.
4. **La planta es un texto que se compara tal cual** (`1`, `2`): `01` no es `1`, y no hay nombres («baja», «primera»). Los escenarios dependen de la decisión 2: si cambias una planta, cambian sus THEN. — mínimo para dos salas; ampliar a nombres es otra feature.
5. **Planta sin salas libres o inexistente** (`--planta 9`, o la 1 con Norte reservada): no imprime nada (cadena vacía), igual que hoy cuando no queda ninguna sala libre. — no invento un texto nuevo para un caso que hoy ya tiene su salida.
6. **`--planta` sin valor** (`libres 14:00-16:00 --planta`): responde `falta la planta: usa --planta <n>` y no lista nada. — silenciarlo listaría todas las salas y el usuario creería que filtró.
7. **Capacidad nueva `free-rooms`** (slug en inglés, kebab-case): hoy `libres` no tiene capacidad en `capabilities/`; la declaro nueva con los tres comportamientos de este delta, sin volcar el resto. — no hay capacidad previa que modificar.
8. **Enfoque**: A (cada sala lleva su planta en el propio dato de `src/app.js`), frente a B (un mapa aparte sala→planta) y C (un subcomando `libres-planta`) (ver Approach).
9. **Argumentos de `--planta`**: toma siempre el argumento siguiente como su valor, aunque parezca una franja (`libres --planta 14:00-16:00` filtra por la planta `14:00-16:00` y sin franja → salida vacía por planta inexistente); un solo `--planta` por invocación, con dos se usa el primero. El comportamiento de `libres` sin franja no cambia. — no amplío `libres` con validación de franjas, que no es de esta feature.
10. **Sin `§Frontend`**: es una CLI sin pantalla; no propongo detector ni capturas.
11. **Repaso de coherencia**: delta probado en una copia de `.docs/sdd` con `sdd capability merge` → «añadido» ×3 requisitos y ×5 reglas, sin rechazos; los THEN del primer requisito (`Sur` y `Norte, Sur`) coinciden con lo que `run('libres', …)` devuelve hoy; `git grep` de `planta`/`0012` fuera de `changes/` → sin resultados.
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil delegate — «Perfil delegate»

### Hallazgos de la review

- **Aceptado** — `vacío` sin dato → «no imprime nada (cadena vacía)» en decisión 5 y THEN.
- **Aceptado** — conflicto «lista todas las salas» → decisión 1 marcada pendiente de tu confirmación.
- **Aceptado** — `01`≠`1` y dependencia de la decisión 2 → decisión 4.
- **Aceptado** — límites → un solo `--planta` (decisión 9 y Reglas).
- **Aceptado** — orden del aviso sin escenario → AND con `libres 10:00-12:00 --planta`.
- **Aceptado** — capacidad parcial y término Planta → Scope.
- **Aceptado en parte** — `--planta` seguido de una franja → decisión 9 (documentado, sin validar franjas: otra feature).
- **Rechazado** — requisito 1 duplica lo de hoy → es la guarda de no regresión de la capacidad nueva; lo marco como tal.
- **Rechazado** — decisión 11 sin evidencia → el repaso lo ejecuté yo (merge en copia, `git grep`); es la línea que el kit exige.

## Intent

Hoy `libres <franja>` devuelve todas las salas libres sin saber en qué planta están. Quien busca sala quiere la de su planta y tiene que mirar la lista y acordarse de cuál es cuál. Se quiere poder acotar con `--planta <n>` sin cambiar nada de quien no la use. Éxito: `libres 14:00-16:00 --planta 1` devuelve solo las salas libres de la planta 1, y `libres 14:00-16:00` devuelve lo mismo que hoy. Fracaso aunque funcione: que un `--planta` mal escrito liste todas las salas sin avisar.

## Scope

- Entra: la opción `--planta <n>` en `libres`; el dato de planta de cada sala en `src/app.js`; sus tests en `test/app.test.js`.
- Entra: añadir **Planta** a «Terminology» de `PRODUCT.md`; la capacidad `free-rooms` nace parcial: recoge solo lo de este delta, no vuelca el resto del comportamiento actual de `libres` (decisión 7).
- No entra: filtrar por planta en otros comandos (`reservar`, `cancelar`, `anular`); filtrar por día (`libres` ignora hoy el día y sigue igual); nombres de planta; más de un `--planta` a la vez; mostrar la planta en la salida.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de textos a lista de `{ name, planta }` | `src/app.js:2`, `src/app.js:5-6` (único uso: `freeRooms`) | Scope: se cambia en `src/app.js`; la salida de `libres` sin `--planta` no cambia |
| `run('libres', ...)` deja de leer la franja solo en `params[0]` | `src/app.js:28` | Scope: decisión 3 |

- Filas que implementa: 0012 (id reservado, sin fila en `ROADMAP.md`) → ningún fichero lo nombra: comprobado con `git grep -n 0012 -- . ':!.docs/sdd/changes'` → sin resultados.

## Approach

- A. La sala lleva su planta (`{ name: 'Norte', planta: '1' }`) y `freeRooms(slot, planta)` filtra con ella — un solo sitio donde vive el dato, se prueba por `run`; cuesta tocar la forma de `rooms`, pero solo `freeRooms` la usa.
- B. Un mapa aparte `{ Norte: '1', Sur: '2' }` y `rooms` queda igual — no toca la forma, pero deja dos listas que mantener a la vez (alta de una sala nueva en un sitio y no en el otro).
- C. Un subcomando nuevo `libres-planta` — evita leer flags, pero el dev-lead pidió una opción `--planta`, no un comando.
- Elegido: A — un único dato por sala, y el coste de cambiar la forma es una función de 2 líneas.

Lo que fija: se leen los argumentos de `libres` quitando `--planta` y su valor, y lo que queda en primer lugar es la franja; `--planta` sin valor responde el aviso de la decisión 6 antes de mirar las reservas.

## Dónde se prueba

- `libres` con y sin `--planta`, ambos órdenes de argumentos, planta inexistente y `--planta` sin valor: por `run('libres', [...])`, como los tests actuales de `test/app.test.js`.

## Términos y ADR

- Términos resueltos: **Planta** — piso del edificio en que está una sala; se escribe `--planta` en la CLI. | ninguno más
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `free-rooms`

#### ADDED — Libres sin filtro de planta

> Guarda de no regresión: el código de hoy ya lo cumple; fija lo que no puede romper el filtro.

- GIVEN Norte (planta 1) con reserva activa en `10:00-12:00` y Sur (planta 2) sin reservas
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`
- AND `libres 14:00-16:00` responde `Norte, Sur`

#### ADDED — Libres filtrado por planta

- GIVEN Norte (planta 1) con reserva activa en `10:00-12:00` y Sur (planta 2) sin reservas
- WHEN `libres 14:00-16:00 --planta 1`
- THEN responde `Norte`
- AND `libres --planta 1 14:00-16:00` responde `Norte`
- AND `libres 14:00-16:00 --planta 2` responde `Sur`
- AND `libres 10:00-12:00 --planta 1` no imprime nada (Norte está reservada)
- AND `libres 14:00-16:00 --planta 9` no imprime nada (no hay planta 9)

#### ADDED — Planta sin valor

- GIVEN las salas del escenario anterior
- WHEN `libres 14:00-16:00 --planta`
- THEN responde `falta la planta: usa --planta <n>` y no lista salas
- AND `libres 10:00-12:00 --planta` (franja ocupada) responde lo mismo: el aviso va antes de mirar las reservas

#### Reglas de la capacidad — free-rooms

- **Dónde viven los datos**: en memoria, en `src/app.js` (cada sala con su planta)
- **Idioma de los nombres**: castellano (`libres`, `--planta`)
- **Límites**: un solo `--planta` por invocación; con dos se usa el primero
- **Avisos**: `falta la planta: usa --planta <n>` cuando `--planta` no trae valor
- **Regla ante conflicto**: no aplica

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
