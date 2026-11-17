---
id: 20261111-195723-feature-0012-libres-por-planta
feature: 0012
title: Filtrar salas libres por planta
mode: full
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar salas libres por planta

🦆 Hoy `salas libres 14:00-16:00` enseña todas las salas libres de la franja, estén en la planta que estén. Con esta feature, `salas libres 14:00-16:00 --planta 2` enseña solo las libres de la planta 2 (`Sur`), y sin `--planta` todo sigue igual: todas las salas. Si la planta está mal escrita (`--planta abc`) sale «planta no válida: usa un número entero mayor que 0» en vez de una lista engañosa. Para poder filtrar, cada sala pasa a saber en qué planta está; las plantas de `Norte` y `Sur` son una suposición mía que tienes que corregir.

Validación: dev-lead — lo que usa una persona desde la terminal; el agente solo mide la salida de los tests.

## Capacidades

- Nuevas: `room-availability` — qué salas aparecen en `libres` para una franja, con o sin filtro de planta.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`room-availability`), contrato público (la opción `--planta` de la CLI) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio (sonnet): si los THEN de «Libres filtra por planta» y «Planta no válida» cubren lo que el dev-lead dijo («sin --planta, lista todas las salas») y no inventan reglas sobre plantas sin salas (señal: capacidad nueva)
- Técnica (sonnet): si el tratamiento de `--planta` antes o después de la franja y el cambio de forma de `rooms` no rompen `libres <franja>` ni `cancelar`/`anular` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si los THEN dicen lo que el dev-lead quería para plantas vacías o inexistentes


1. **Plantas de las salas**: `Norte` en planta 1 y `Sur` en planta 2. Nadie me las dijo: es un dato inventado para poder escribir los tests. Corrígelo con las reales.
2. **Forma de la opción**: `--planta <número>`, con el número como argumento siguiente (no `--planta=2`). El argumento que sigue a `--planta` es siempre su valor, sea lo que sea (incluso una franja). Puede ir antes o después de la franja: `libres 14:00-16:00 --planta 2` y `libres --planta 2 14:00-16:00` dan lo mismo.
3. **Una sola planta por llamada**: repetir la opción (`--planta 1 --planta 2`) o dar una lista (`--planta 1,2`) da `planta no válida: usa un número entero mayor que 0`.
4. **Planta sin salas libres o sin salas** (`--planta 3`, o la planta 1 con `Norte` reservada): sale la línea vacía, igual que hoy cuando no queda ninguna libre. No distingo «no existe esa planta» de «no hay libres».
5. **Planta no válida**: cualquier valor que no sean solo dígitos con valor mayor que 0 (`abc`, `1.5`, `0`, `00`, `-1`, `+2`, `1,2`), `--planta` sin valor, la opción repetida y cualquier argumento que empiece por `--planta` sin ser exactamente `--planta` (`--planta=2`, `--planta2`) dan el texto `planta no válida: usa un número entero mayor que 0`, sin listar nada. `02` es válido y vale 2. Un número enorme es válido y da la línea vacía. **Suposición mía**: rechazo `0` y los negativos, así que no hay planta baja ni sótanos con ese número; si tus plantas empiezan en 0, dímelo.
6. **Orden de validación y argumentos sobrantes**: se valida la planta antes que nada; la franja no se valida (como hoy): `libres 25:00 --planta abc` da `planta no válida…`, y `libres 25:00 --planta 2` da `Sur`. El primer argumento que no es `--planta` ni su valor es la franja y los demás se ignoran, como hoy: `libres 14:00-16:00 10:00-12:00` da `Norte, Sur`; una opción desconocida (`--foo`) en ese primer puesto cuenta como franja.
7. **`libres --planta 2` sin franja**: lista las salas de la planta 2, como hoy `libres` sin franja lista todas.
8. **Contrato que se mide**: el valor que devuelve `run('libres', [...])`, que es lo que se imprime por stdout; el código de salida del proceso no cambia (0, como hoy, también en planta no válida).
9. **Formato de salida**: sin cambios, nombres separados por `, `; sin salas, línea vacía.
10. **Enfoque**: A, frente a B y C (ver Approach).
11. **Capacidad nueva `room-availability`**: el proyecto no tiene `capabilities/`; la creo con esta feature y documento el comportamiento de hoy con franja y sin `--planta`. Solo fijo que la franja no se valida en combinación con `--planta` (decisión 6); sin la opción no documento la franja ausente o inválida, ni qué hace «libre» más allá de la reserva activa en la misma franja exacta (solapes, canceladas, anuladas, día): eso queda fuera y lo sigue definiendo el código de hoy. Con una sola sala por planta ningún escenario prueba el filtro con varias salas: acepto ese riesgo en vez de inventar salas. Nombre en inglés kebab-case por ser nombre de fichero.
12. **Término «Planta» en `PRODUCT.md`**: lo añado a Terminology al implementar (_Evitar_: piso, nivel).
13. **Carpeta de la feature en `.docs/sdd/changes/`**, como manda el kit, aunque las features viejas del proyecto están en `.docs/sdd/specs/` (no las muevo).
14. **No se toca `CHANGELOG.md`**: lo escribe el corte de la release.
15. **Repaso de coherencia**: `git grep` de `libres`, `freeRooms`, `rooms` y `planta` en todo el repo: solo `src/app.js`, `test/app.test.js` y `CHANGELOG.md:10` (sin cambio); `rooms` no se exporta. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade los requisitos y las reglas a `room-availability.md`, sin rechazos; el `capabilities/` del repo no cambia.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Dominio:
- **Aceptado** — «Libres sin planta» no deja claro que se ignora la planta → el THEN añade que con `Norte` en planta 1 y `Sur` en planta 2 salen ambas en `14:00-16:00` y que el Scope fija «sin opción nada cambia».
- **Aceptado** — «Planta» no está en Terminology → decisión 12.
- **Aceptado** — `02`, `+2`, números enormes sin definir → decisión 5 y un requisito de entradas.
- **Aceptado** — «Planta sin salas libres» no cubre planta existente con todo reservado → el requisito añade el caso; la regla de no distinguir va a «Reglas».
- **Aceptado** — «Regla ante conflicto» marcada «no aplica» → ahora declara la repetición.
- **Aceptado** — `--planta` sin valor en distintas posiciones → requisitos «Planta sin valor» con cada posición.
- **Aceptado** — carpeta viva → decisión 13 ya la declara; sin más cambio.
- **Aceptado** — regla de idioma contradice el nombre en inglés → «Idioma de los nombres» matizada.
- **Aceptado** — Scope no recoge formato ni documentar lo de hoy → añadido a «Entra».
- **Rechazado** — fixture con dos salas en la misma planta → el proyecto solo tiene `Norte` y `Sur`; inventar salas cambiaría los datos del producto. El formato `, ` con varias salas ya lo cubre `libres 14:00-16:00` sin opción.

Técnica:
- **Aceptado (Crítico)** — «Planta no válida» solo ejecuta `abc` → un requisito con GIVEN/WHEN/THEN por entrada: `abc`, `1.5`, `0`, `-1`, `+2`, `1,2`, `--planta=2`.
- **Aceptado (Crítico)** — `--planta 14:00-16:00` ambiguo → decisión 2 (el siguiente argumento es siempre el valor) y escenarios «Planta sin valor».
- **Aceptado** — repetición sin escenario → decisión 3 y su escenario.
- **Aceptado** — `--planta=2` sin salida → decisión 5 y su escenario.
- **Aceptado** — `02` frente a `2` → decisión 5 y escenario `--planta 02` da `Sur`.
- **Aceptado** — canal y código de salida → decisión 8.
- **Aceptado** — orden de validación → decisión 6 y su escenario.
- **Aceptado** — qué comportamiento actual se documenta → decisión 11.
- **Aceptado** — `run` como contrato y `rooms` exportado → fila en «Lo que se retira o cambia de forma» y decisión 15.
- **Aceptado** — gate completo → «Dónde se prueba».

### Hallazgos de la segunda ronda (un revisor, sin Críticos)

- **Aceptado** — decisión 11 contradecía los escenarios de franja → decisión 11 reescrita: la franja no validada se fija solo con `--planta`.
- **Aceptado** — el texto «número entero» salía para `0` y negativos → texto `…mayor que 0` en toda la spec; rechazar `0` y negativos va a la decisión 5 como suposición tuya a validar.
- **Aceptado** — `--planta2` y `00` sin definir → decisión 5 y escenarios.
- **Aceptado** — argumentos sobrantes y opciones desconocidas → decisión 6 y un AND en «Libres sin planta».
- **Aceptado** — «libre» solo probado con la misma franja → decisión 11 declara el resto fuera.
- **Aceptado** — `--planta` solo y repetición incompleta → AND añadido.
- **Aceptado** — «Planta» definida con «piso», que la propia spec manda evitar → definición reescrita.
- **Aceptado** — una sala por planta no prueba el filtro con varias → riesgo aceptado en la decisión 11.
- **Rechazado** — el gate `node --test && node scripts/lint.mjs` no es el de la constitución → es el que fija `operations.md` del proyecto («Gate de cierre»), que concreta el punto 2 de la constitución.
- **Rechazado** — la línea «Política de modelos» consiente por ti → es la forma fija de la plantilla en `delegate` y está en esta lista justo para que la veas; si no quieres paralelizar, dilo al aprobar.

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, `libres` lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `libres <franja>` no sabe de plantas: quien busca sala en su planta tiene que leer la lista entera. Se quiere que `libres <franja> --planta <n>` enseñe solo las salas libres de esa planta, y que sin la opción nada cambie. Éxito: con `Norte` en planta 1 y `Sur` en planta 2, `libres 14:00-16:00 --planta 2` da `Sur`; fracaso aunque funcione: que `libres 14:00-16:00` sin opción dejara de listar las dos, o que una planta mal escrita diera una lista sin filtrar que parece un éxito.

## Scope

- Entra: cada sala conoce su planta (`Norte` 1, `Sur` 2); la opción `--planta <n>` de `libres`; el texto de planta no válida; el término «Planta» en `PRODUCT.md`; documentar en `room-availability` el comportamiento de `libres <franja>` sin opción, cuyo formato de salida no cambia.
- No entra: dar de alta salas o cambiar su planta desde la CLI; listar las plantas que existen; `--planta` en `reservar`, `cancelar` o `anular`; guardar plantas fuera de memoria; validar la franja; `CHANGELOG.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms`: de lista de nombres a lista de `{ name, floor }` | `src/app.js:2` (definición, no exportada), `src/app.js:6` (único consumidor, `freeRooms`) | Scope y decisión 10: `cancelBooking` y `voidBooking` buscan por nombre en `bookings`, no usan `rooms` |
| `freeRooms(slot)` pasa a `freeRooms(slot, floor)` | `src/app.js:5`, `src/app.js:28` | Scope; el test de `test/app.test.js:5` sigue valiendo sin cambios |
| `run('libres', params)` acepta `--planta <n>` entre sus argumentos | `src/app.js:28`, `test/app.test.js:6` | Delta (`room-availability`): sin la opción, igual que hoy |

- Filas que implementa: 0012 → nada: comprobado con `git grep -niE "libres|freeRooms|planta|\brooms\b"` (solo `CHANGELOG.md:10`, que cita el comando sin cambio, `src/app.js` y `test/app.test.js`).

## Approach

- A — `rooms` pasa a objetos `{ name, floor }` y `freeRooms(slot, floor)` filtra por ambos: cambia la forma de una constante con un solo consumidor; el dato de la planta vive junto a la sala.
- B — mapa aparte `floors = { Norte: 1, Sur: 2 }` y `rooms` queda como está: no toca `rooms`, pero son dos sitios que mantener a la vez al añadir una sala.
- C — sacar la planta del nombre de la sala: ninguna sala la lleva en el nombre, no sirve.
- Elegido: A — un solo sitio por sala, y el único consumidor de `rooms` es `freeRooms`.

`run` recorre los argumentos de `libres`: el que sigue a `--planta` es su valor; cualquier otro argumento que empiece por `--planta` (`--planta=2`) o una segunda `--planta` es planta no válida; el primer argumento restante es la franja. La planta se valida antes de listar.

## Dónde se prueba

- `libres` con y sin `--planta`, planta vacía y las entradas no válidas: por `run('libres', [...])`, como el test actual de `test/app.test.js`; se lanza con `node --test test/app.test.js` y se cierra con el gate `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: **Planta**: la altura numerada del edificio donde está una sala; número entero mayor que 0. _Evitar_: piso, nivel.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres sin planta lista todas las salas

- GIVEN `Norte` en planta 1 con una reserva activa en `10:00-12:00`, y `Sur` en planta 2 sin reservas
- WHEN se ejecuta `libres 10:00-12:00`
- THEN sale `Sur`
- AND `libres 14:00-16:00` da `Norte, Sur`, sin importar la planta de cada sala
- AND `libres 14:00-16:00 10:00-12:00` da `Norte, Sur`: el argumento sobrante se ignora

#### ADDED — Libres filtra por planta

- GIVEN `Norte` en planta 1 y `Sur` en planta 2, sin reservas en `14:00-16:00`
- WHEN se ejecuta `libres 14:00-16:00 --planta 2`
- THEN sale `Sur`
- AND `libres 14:00-16:00 --planta 1` da `Norte`
- AND `libres --planta 2 14:00-16:00` da `Sur`
- AND `libres 14:00-16:00 --planta 02` da `Sur`
- AND `libres --planta 2` (sin franja) da `Sur`
- AND `libres 25:00 --planta 2` da `Sur`: la franja no se valida

#### ADDED — Planta sin salas libres

- GIVEN `Norte` en planta 1 con una reserva activa en `10:00-12:00`, y `Sur` en planta 2
- WHEN se ejecuta `libres 10:00-12:00 --planta 1`
- THEN sale la línea vacía
- AND `libres 14:00-16:00 --planta 3` da la línea vacía, igual que una planta sin salas libres
- AND `libres 14:00-16:00 --planta 99999999999999999999` da la línea vacía

#### ADDED — Planta no válida

- GIVEN `Norte` en planta 1 y `Sur` en planta 2
- WHEN se ejecuta `libres 14:00-16:00 --planta abc`
- THEN sale `planta no válida: usa un número entero mayor que 0`
- AND lo mismo con `--planta 1.5`, `--planta 0`, `--planta -1`, `--planta +2` y `--planta 1,2`
- AND lo mismo con `--planta=2`, `--planta2` y `--planta 00`
- AND lo mismo con `libres 25:00 --planta abc`: la planta se valida antes que la franja

#### ADDED — Planta sin valor o repetida

- GIVEN `Norte` en planta 1 y `Sur` en planta 2
- WHEN se ejecuta `libres 14:00-16:00 --planta`
- THEN sale `planta no válida: usa un número entero mayor que 0`
- AND `libres --planta 14:00-16:00` da lo mismo: `14:00-16:00` es el valor de `--planta`, no la franja
- AND `libres 14:00-16:00 --planta 1 --planta 2` da lo mismo
- AND `libres --planta` (solo la opción) y `libres 14:00-16:00 --planta 1 --planta` dan lo mismo

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria, en `src/app.js` (la planta de cada sala junto a su nombre).
- **Idioma de los nombres**: textos y opciones en castellano (`--planta`, «planta no válida…»), como manda la constitución; el identificador de la capacidad es un nombre de fichero en inglés kebab-case.
- **Límites**: una sola planta por llamada; solo dígitos, mayor que 0; `02` vale 2.
- **Avisos**: `planta no válida: usa un número entero mayor que 0`.
- **Regla ante conflicto**: repetir `--planta` es planta no válida.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
