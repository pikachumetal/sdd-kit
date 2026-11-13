---
id: 20261112-155723-feature-0012-libres-por-planta
feature: 0012
title: Filtrar las salas libres por planta
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar las salas libres por planta

🦆 Hoy `libres 14:00-16:00` te lista todas las salas libres: `Norte, Sur`. Con esta feature, `libres 14:00-16:00 --planta 2` te lista solo las de la planta 2: `Sur`. Sin `--planta`, todo sigue igual que hoy. Para que se pueda filtrar, cada sala pasa a tener una planta (Norte, la 1; Sur, la 2). Por dentro, la lista de salas pasa de nombres sueltos a nombre y planta.

Validación: dev-lead — lo usa una persona desde la terminal y el filtro es lo que ella ve en pantalla.

## Capacidades

- Nuevas: `free-rooms` — listado de salas libres de una franja, con filtro opcional por planta.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`free-rooms`), contrato público (la sintaxis de `libres`, que consume quien escribe el comando) · tamaño: ~25 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio+técnica (sonnet): si el requisito «Listado de salas libres de una franja» refleja lo que hace hoy `libres` (franja, estado `active`) y si los THEN de `--planta` (planta sin salas, falta el valor) dicen lo mismo que las decisiones 3 y 4 (señal: capacidad nueva + contrato público)
- Mínimo razonable: sin revisión — deja sin mirar que la capacidad nueva describa fielmente la conducta que ya existe, el tipo de hueco que luego obliga a una enmienda

### Hallazgos de la review

- **Aceptado** — #1 faltaba un valor de planta no numérico → escenario `--planta abc` (salida vacía); el filtro combinado con reserva ya estaba (`10:00-12:00 --planta 1`).
- **Aceptado** — #2 el listado documentaba la conducta «a ojo» → el requisito declara franja por igualdad exacta y solo reservas `active`, con escenarios de solapamiento parcial y de reserva cancelada.
- **Aceptado** — #3 el escenario hablaba de «lun» aunque `libres` no recibe día → el requisito declara que una reserva activa de cualquier día bloquea la franja; escenario con reserva de otro día.
- **Aceptado** — #4 faltaban las reglas de la capacidad → sección «Reglas de la capacidad — free-rooms».
- **Aceptado** — #5 tipo de la planta ambiguo → decisión 5: la planta se guarda como texto (`'1'`, `'2'`) y se compara con `===`; escenario `--planta 02` → vacía.
- **Aceptado** — #6 posiciones y argumentos sobrantes → decisión 8 y escenario con valor que empieza por `--`.
- **Aceptado** — #7 canal y código de salida → decisión 9.
- **Aceptado** — #8 el requisito 1 documenta conducta existente → se dice en su texto y en la decisión 6.
- **Aceptado** — #9 Scope incompleto → «Entra» lista la forma de `rooms`, la firma de `freeRooms`, `free-rooms`, los tests y la planta sin salas.
- **Rechazado** — #10 contradicción de roles: en PRODUCT.md el dev-lead y el único usuario son la misma persona, así que «Validación: dev-lead» es coherente.

1. Planta de cada sala: Norte, planta 1; Sur, planta 2 — la entrevista fijó el filtro pero no los datos; una planta distinta por sala deja el filtro observable. Son datos de ejemplo de este proyecto (viven en el código, `rooms`, sin base de datos).
2. Sintaxis: `libres <franja> --planta <n>`, con `--planta` después de la franja — la franja es hoy `params[0]`; admitir la opción antes obligaría a reinterpretar los parámetros.
3. Una planta sin salas libres (o sin salas, p. ej. `--planta 3`) devuelve la salida vacía, igual que hoy `libres` cuando no queda ninguna sala libre — no invento un mensaje nuevo para un caso que ya se comporta así.
4. `--planta` sin valor (`libres 14:00-16:00 --planta`) responde `falta la planta: usa --planta <n>` — sin avisarlo, el filtro compararía contra `undefined` y devolvería vacío, igual que «planta sin salas»: se confundirían.
5. La planta se guarda como texto (`planta: '1'`, `planta: '2'`) y se compara con `===` contra el valor escrito: `--planta 2` coincide, `--planta 02` y `--planta abc` no (caso de la decisión 3) — así lo que se escribe y lo que se guarda son el mismo tipo.
6. Capacidad nueva `free-rooms` (inglés, kebab-case) — el proyecto no tiene `capabilities/`; el requisito del listado sin filtro documenta lo que `libres` ya hace (feature 0006), sin cambio de conducta, para que el filtro tenga base viva.
7. Enfoque: A (salas como objetos `{ name, planta }`) frente a B (mapa aparte `plantaPorSala`) y C (deducir la planta del nombre) — ver Approach.
8. Solo se interpreta `--planta` si es `params[1]`; el valor es `params[2]` aunque empiece por `--` (`--planta --x` es una planta `--x`: salida vacía); cualquier otro argumento sobrante se ignora, como hoy.
9. El mensaje de la decisión 4 sale por la salida normal (`console.log`, como todo lo demás) y el proceso acaba con código 0 — la app no tiene códigos de salida ni canal de errores.
- Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade «Listado de salas libres de una franja» y «Filtro de libres por planta» en `free-rooms.md`, sin rechazos.
- Política de modelos: un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Decisiones tomadas con el dev-lead

- Filtrar las libres por planta con la opción `--planta` — «filtrar libres por planta con la opción --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `libres <franja>` devuelve todas las salas libres sin distinguir dónde están. Quien busca sala en una planta concreta tiene que descartar a mano las de las demás. Éxito: `libres 14:00-16:00 --planta 1` devuelve `Norte` y `--planta 2` devuelve `Sur`. Fracaso, aunque funcione: que `libres` sin `--planta` cambie su salida, o que una planta inexistente se confunda con un error de uso.

## Scope

- Entra: planta como dato de cada sala (forma de `rooms` y firma de `freeRooms`); opción `--planta <n>` en `libres`; salida vacía con una planta sin salas libres; mensaje cuando falta el valor; la capacidad `free-rooms` y los tests de `test/app.test.js`.
- No entra: reservar, cancelar o anular por planta; mostrar la planta en la salida de `libres`; el día en `libres` (hoy solo mira la franja); validar el formato de la franja (deuda ya anotada); persistencia de las salas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de `['Norte', 'Sur']` a objetos `{ name, planta }` | `src/app.js:2`; lo lee `freeRooms` (`src/app.js:5-6`) | Scope y Approach: lo implementa el plan; no hay más lectores (`git grep -n "rooms"`) |
| La firma de `freeRooms(slot)` gana la planta | `src/app.js:5`, llamada en `src/app.js:28` | Approach |

- Filas que implementa: nada: comprobado con `git grep -niE "planta"` fuera de `.docs/sdd/specs` (sin resultados) y el ROADMAP, que no tiene fila para esta feature; el id 0012 sale de `sdd id next --reserve`. El `CHANGELOG.md:10` cita `salas libres 10:00-12:00` y no cambia: la forma sin `--planta` queda igual.

## Approach

- A. Salas como objetos `{ name, planta }`, y `freeRooms(slot, planta)` filtra por planta si viene — un solo sitio donde vive el dato y una función con un parámetro opcional; el coste es tocar la forma de `rooms` y su único lector.
- B. Mapa aparte `plantaPorSala = { Norte: 1, Sur: 2 }` — no toca `rooms`, pero deja dos estructuras que mantener a la vez y una sala nueva se puede olvidar en una de ellas.
- C. Deducir la planta del nombre de la sala — descartada: «Norte» y «Sur» no dicen la planta.
- Elegido: A — el dato de la sala vive con la sala, y `rooms` solo lo lee `freeRooms`.

`run('libres', params)` toma la franja de `params[0]`; si `params[1] === '--planta'`, el valor es `params[2]`. Con `--planta` sin valor, devuelve el texto de la decisión 4 y no llama a `freeRooms`.

## Dónde se prueba

- Listado de libres sin y con `--planta`, planta sin salas y falta de valor: por `run('libres', [...])` en `test/app.test.js`, como el test de `libres` actual. La pantalla no cambia, no lleva captura.

## Términos y ADR

- Términos resueltos: planta — piso del edificio donde está una sala (se escribe «planta», no «piso» ni «floor»).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `free-rooms`

#### ADDED — Listado de salas libres de una franja

> Documenta la conducta que `libres` ya tiene (feature 0006), sin cambio.

- GIVEN las salas Norte y Sur, y una reserva activa de Norte con franja 10:00-12:00 (`libres` no recibe día: una reserva activa de cualquier día bloquea esa franja)
- WHEN se ejecuta `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND con `libres 14:00-16:00`, sin reservas en esa franja, la salida es `Norte, Sur`
- AND la franja se compara por igualdad exacta: con `libres 11:00-13:00` la salida es `Norte, Sur`
- AND solo bloquean las reservas activas: si la reserva de Norte 10:00-12:00 está cancelada, `libres 10:00-12:00` da `Norte, Sur`

#### ADDED — Filtro de libres por planta

- GIVEN Norte en la planta 1, Sur en la planta 2 y una reserva activa de Norte el lun 10:00-12:00
- WHEN se ejecuta `libres 14:00-16:00 --planta 2`
- THEN la salida es `Sur`
- AND con `--planta 1`, la salida es `Norte`
- AND con `libres 10:00-12:00 --planta 1` (Norte reservada), la salida es vacía
- AND con `libres 14:00-16:00 --planta 3` (sin salas en esa planta), la salida es vacía
- AND con `libres 14:00-16:00 --planta` (sin valor), la salida es `falta la planta: usa --planta <n>`
- AND con `libres 14:00-16:00 --planta abc` o `--planta 02`, la salida es vacía
- AND con `libres 14:00-16:00 --planta --x`, la salida es vacía
- AND con `libres 14:00-16:00` sin `--planta`, la salida sigue siendo `Norte, Sur`

#### Reglas de la capacidad — free-rooms

- **Dónde viven los datos**: `rooms` en `src/app.js`, cada sala con `name` y `planta`; sin base de datos.
- **Idioma de los nombres**: castellano (`libres`, `--planta`, `Norte`, `Sur`).
- **Límites**: la planta no se valida: se compara como texto exacto.
- **Avisos**: `falta la planta: usa --planta <n>` cuando `--planta` no trae valor.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
