---
id: 20261105-211811-feature-0012-libres-planta
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

🦆 Hoy `libres 10:00-12:00` enseña todas las salas libres de esa franja, estén en la planta que estén. Con el cambio, `libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (`Sur`, si el reparto de la decisión 1 es el tuyo); sin `--planta` sigue enseñando todas, como ahora. Para eso cada sala pasa a saber en qué planta está.

Validación: dev-lead — lo usa una persona desde la terminal y el reparto de salas por planta es un dato suyo que solo ella puede confirmar.

## Capacidades

- Nuevas: `room-availability` — qué salas hay libres en una franja y cómo se filtran (por planta).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva, contrato público (la sintaxis del comando `libres`) · tamaño: ~20 líneas en 2 ficheros
- Único (sonnet): si los THEN cubren el orden de argumentos y el valor de `--planta` ausente o no válido, y si la capacidad nueva recoge el comportamiento que `libres` ya tiene (señal: capacidad nueva)
- Mínimo razonable: un revisor es ya el nivel más bajo; sin él quedarían sin mirar los THEN del valor ausente o no válido y de la opción repetida

1. **Plantas de las salas: Norte en la planta 1, Sur en la planta 2.** Nadie me dio el reparto real; son valores inventados. **Confírmalos o corrígelos al aprobar**: los escenarios los usan como datos.
2. **Sintaxis: `libres <franja> --planta <n>`; la opción puede ir antes o después de la franja.** Los otros comandos ya mezclan opciones y argumentos (`reservar Norte --cada-semana`), así que no se obliga un orden.
3. **La planta se escribe como número entero de cero en adelante y se compara tal cual (`--planta 1`; el 0 es la planta baja).** Es lo más corto que una sala de coworking necesita; no admito «p1», «bajo», ni negativos, y tampoco `--planta=2`: el valor va en el argumento siguiente. Vale cualquier valor de solo cifras y se compara como número (`01` es la planta 1).
4. **Una planta sin salas, o sin ninguna libre en la franja, da una línea vacía.** Es lo que hoy da `libres` cuando todas están ocupadas; no invento un texto nuevo para ese caso.
5. **Avisos: `--planta` sin valor responde «falta la planta tras --planta»; con un valor que no es un entero de cero en adelante (`p1`, `-1`, `1.5`, `14:00-16:00`), «planta no válida: usa un número entero».** Es mejor avisar que listar todas las salas y hacer creer que se ha filtrado. El argumento que sigue a `--planta` es siempre su valor, aunque parezca una franja.
6. **Con `--planta` repetida se valida cada aparición (cualquiera sin valor o no válida da su aviso) y, si todas valen, gana la última** (`--planta 1 --planta 2` filtra por la 2): es la regla más corriente y no dejo el caso sin definir.
7. **La planta se valida antes que la franja, y `libres` sin franja sigue como hoy** (lista todas las salas, porque ninguna reserva tiene franja vacía): `libres --planta 1` da `Norte`, `libres` da `Norte, Sur`. Cambiar eso no lo pidió nadie.
8. **Los avisos salen por la salida normal, como `sin reserva Norte lun`, sin código de salida propio:** `run()` devuelve el texto y la aplicación no distingue errores en ningún otro comando.
6. **Capacidad nueva `room-availability`** (inglés, kebab-case, por ser nombre de fichero): hoy `capabilities/` está vacío y `libres` no tiene su comportamiento escrito; la spec escribe el actual (todas las salas libres) como `ADDED` junto al filtro.
7. **Enfoque: cada sala pasa de ser un nombre suelto a llevar su planta, y `libres` filtra sobre eso.** Descarto un mapa aparte `sala → planta`, porque dos listas paralelas se desincronizan al añadir una sala; descarto pedir la planta a cada reserva, porque la planta es de la sala, no de la reserva.
9. **Tres tasks previstas, no se parte la feature:** datos de planta, filtro, y lectura de `--planta` con su aviso; una sola superficie (la línea de comandos), sin migración.
- Delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: añade `room-availability` con 2 requisitos y las 5 reglas, sin errores; `capabilities/` del repo no cambia.
- Política de modelos: revisor de la spec en sonnet y uno de segunda ronda, ambos en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: ningún escenario de «Libres de una franja» da la línea vacía con todas ocupadas → añadido el escenario, con su salida contrastada con el código actual (`filter(...).join(', ')` da `''`, las salas por orden de la lista, separadas por «, »).
- **Aceptado** — `--planta` sin valor sin GIVEN concreto y sin cubrir `--planta 14:00-16:00` → GIVEN concreto, y escenarios del valor sin franja detrás y del valor no válido.
- **Aceptado** — valor no entero sin THEN, justo el fracaso del Intent → aviso «planta no válida: usa un número entero» (decisión 5) y su escenario.
- **Aceptado** — reglas de la capacidad: límites, aviso en castellano y opción repetida → declarados en «Reglas de la capacidad» y en la decisión 5 bis.
- **Aceptado** — datos inventados dados por hechos en los GIVEN → la decisión 1 sigue pidiendo confirmar el reparto antes de aprobar; los GIVEN lo repiten porque un escenario necesita datos concretos.
- **Aceptado** — `--planta=2`, el modo y la comparación exacta sin declarar → en la decisión 3.
- **Aceptado (2.ª ronda)** — dos Críticos: GIVEN incompletos y `libres` sin franja → estado base común y decisión 7 con sus escenarios; formato de la planta, `0` y `-1`, opción repetida con valor malo, canal de los avisos, reparto sin confirmar, alcance de `PRODUCT.md` y changelog, línea de review → decisiones 3, 6, 7, 8, 1 y Scope. No hay tercera ronda.
- **Aceptado** — línea de review incoherente con el mínimo → reescrita.
- **Aceptado** — qué ficheros se tocan y los números de línea frágiles → «Dónde se prueba» los nombra y los números van como orientativos.
- **Aceptado** — regresión sin `--planta` con salas en plantas distintas → el segundo escenario de «Libres de una franja» ya dice las plantas.
- **Aceptado** — Intent y Scope desalineados («mal escrita» / «sin valor») → ambos dicen «sin valor o no válida».

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` para esta feature — «Perfil delegate»

## Intent

Hoy `libres <franja>` lista todas las salas libres de la franja y no se puede acotar por la planta. Importa porque con más salas el listado crece y quien está en la planta 2 no quiere leer las de la 1. Éxito: `libres 14:00-16:00 --planta 1` enseña solo `Norte`; sin la opción, el listado de hoy no cambia ni un carácter. Fracaso, aunque funcione: que `--planta` sin valor o con un valor no válido dé el listado entero y parezca filtrado.

## Scope

- Entra: al cerrar, el término «planta» en `PRODUCT.md` y la entrada del changelog; cada sala tiene una planta; `libres <franja> --planta <n>` filtra por ella; `--planta` sin valor o con un valor no válido da un aviso; `libres <franja>` sin la opción no cambia.
- No entra: enseñar la planta en el listado de `libres` (la salida sigue siendo solo los nombres); filtrar por planta en `reservar`, `cancelar` o `anular`; alta o edición de salas y plantas desde la terminal; filtrar por otra cosa (capacidad, equipamiento).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La franja ya no es siempre el primer argumento de `libres` | `src/app.js:28` (`params[0]`; número de línea orientativo) | Entra: `libres <franja> --planta <n>`; la franja pasa a ser el primer argumento que no es la opción ni su valor (decisión 7 para el caso sin franja) |
| La lista de salas deja de ser solo nombres | `src/app.js:2`, `freeRooms` en `src/app.js:5` | Entra: cada sala lleva nombre y planta; `reservar`, `cancelar` y `anular` no usan la lista |

- Filas que implementa: ninguna (la feature no tiene fila en el roadmap) → nada: comprobado con `git grep -niE "planta|libres"`, solo `changelog.md:10` (histórico, no cambia), `src/app.js` y `test/app.test.js`.

## Approach

`libres` lee `--planta <n>` entre sus argumentos, toma como franja el primer argumento que no sea esa opción ni su valor, y filtra las salas por planta antes de quitar las ocupadas. Qué estructura de datos y qué orden de tasks quedan para el plan.

## Dónde se prueba

- `libres` con y sin `--planta`, con la opción antes y después de la franja, repetida, y los dos avisos: por `run('libres', [...])`, como el test actual `libres excluye la sala reservada en la franja` de `test/app.test.js`, que sigue valiendo tal cual. Ficheros que se tocan: `src/app.js`, `test/app.test.js` y, al cerrar, `PRODUCT.md`.

## Términos y ADR

- Términos resueltos: planta — el piso del edificio donde está la sala; se escribe como número. Falta añadirlo a la terminología de `PRODUCT.md` (lo hace el cierre).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

> Estado base de los escenarios: Norte en la planta 1 y Sur en la planta 2; Sur sin reservas; Norte sin reservas salvo que el GIVEN diga otra cosa.

#### ADDED — Libres de una franja

- GIVEN el estado base con Norte reservada de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN `Sur`

- GIVEN el estado base
- WHEN `libres 14:00-16:00`
- THEN `Norte, Sur`

- GIVEN el estado base
- WHEN `libres`
- THEN `Norte, Sur`

- GIVEN el estado base con Norte y Sur reservadas de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN línea vacía

#### ADDED — Libres de una planta

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta 1`
- THEN `Norte`

- GIVEN el estado base
- WHEN `libres --planta 2 14:00-16:00`
- THEN `Sur`

- GIVEN el estado base
- WHEN `libres --planta 1`
- THEN `Norte`

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta 01`
- THEN `Norte`

- GIVEN el estado base con Norte reservada de 10:00 a 12:00
- WHEN `libres 10:00-12:00 --planta 1`
- THEN línea vacía

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta 3`
- THEN línea vacía

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta 0`
- THEN línea vacía

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta`
- THEN `falta la planta tras --planta`

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta p1`
- THEN `planta no válida: usa un número entero`

- GIVEN el estado base
- WHEN `libres --planta 14:00-16:00`
- THEN `planta no válida: usa un número entero`

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta -1`
- THEN `planta no válida: usa un número entero`

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta 1 --planta 2`
- THEN `Sur`

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta p1 --planta 2`
- THEN `planta no válida: usa un número entero`

- GIVEN el estado base
- WHEN `libres 14:00-16:00 --planta 1 --planta`
- THEN `falta la planta tras --planta`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: la planta de cada sala está en la lista de salas de `src/app.js`; Norte, planta 1; Sur, planta 2.
- **Idioma de los nombres**: castellano (`--planta`, «planta» y los avisos), por el punto 4 de la constitution.
- **Límites**: la planta es un valor de solo cifras (de cero en adelante), comparado como número.
- **Avisos**: `falta la planta tras --planta`; `planta no válida: usa un número entero`.
- **Regla ante conflicto**: con `--planta` repetida se valida cada aparición y, si todas valen, gana la última; la planta se valida antes que la franja.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
