---
id: 20261112-155752-feature-0012-libres-planta
feature: 0012
title: Filtrar `libres` por planta
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Filtrar `libres` por planta

🦆 Hoy `salas libres 10:00-12:00` enseña todas las salas libres de la franja, estén en la planta que estén. Con esta feature, `salas libres 10:00-12:00 --planta 2` enseña solo las libres de la planta 2 (con las salas de ejemplo, `Sur`); sin `--planta` todo sigue igual y salen todas (`Sur`, y `Norte, Sur` si ninguna está reservada). Por dentro, cada sala pasa a llevar su planta y `libres` lee la opción antes de filtrar. Ojo: hoy las salas no tienen planta; la de `Norte` (1) y la de `Sur` (2) la he puesto yo y está en ✋.

Validación: dev-lead — lo que se cambia es lo que la persona ve al teclear `libres`; que `--planta` se sienta bien en el comando solo lo juzga quien lo usa.

## Capacidades

- Nuevas: `room-availability` — qué salas hay libres en una franja y cómo se filtran (hoy sin capacidad; el delta recoge el comportamiento vigente de `libres` y el filtro nuevo)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva · tamaño: ~35 líneas en 2 ficheros (`src/app.js`, un test nuevo)
- Sonnet, siete puntos: que los escenarios del filtro cubran la franja sin planta, el orden de los argumentos y el valor ausente (señal: capacidad nueva); que el delta no cambie en silencio el `libres` vigente (señal: capacidad nueva sin viva)
- Mínimo razonable: el mismo, un revisor — no hay nivel inferior defendible; sin review dejaría sin leer si el delta describe de verdad el `libres` de hoy

1. **Las salas no tienen planta hoy: `Norte` = planta 1, `Sur` = planta 2.** Datos inventados por mí para poder probar; son lo primero que debes corregir si no son los reales. Si el edificio tiene más salas o más plantas, se añaden en `rooms`.
2. **El valor es el número de planta tal como se teclea (`1`, `2`), y se compara como texto exacto**: `--planta 02` no encuentra la planta 2. Sin ceros a la izquierda ni nombres tipo «baja».
3. **`--planta <n>` va en cualquier sitio de los argumentos** (`libres 10:00-12:00 --planta 2` o `libres --planta 2 10:00-12:00`), y la franja es el primer argumento que no es la opción ni su valor. El valor es siempre el argumento que sigue a `--planta`, sea lo que sea: `libres --planta 14:00-16:00` toma `14:00-16:00` como planta y no hay franja.
4. **Una planta sin salas libres (o que no existe, o con un valor que no es una planta) da salida vacía**, igual que hoy cuando no queda ninguna libre. No invento un mensaje distinto ni valido la planta: es el mínimo, y un `--planta 9` equivocado se verá como «nada libre» sin pista. Si prefieres que avise («no hay planta 9»), es validar contra las plantas de `rooms`: dímelo y entra en el Scope.
5. **`--planta` sin valor da el aviso literal `falta la planta: usa --planta <número>`** y no lista salas. Texto mío.
6. **«Sin `--planta` lista todas las salas» lo leo como «todas las libres de la franja»**, que es lo que hace hoy; no lista también las ocupadas.
7. **Capacidad nueva `room-availability`** (slug en inglés, contenido en castellano): hoy `capabilities/` está vacía y el delta describe también el `libres` vigente para que el filtro tenga dónde colgar.
8. **Enfoque: A (filtrar en `freeRooms` con la planta como dato de cada sala), frente a B y C (ver Approach).**
9. **Términos**: «planta» entra a la terminología (ver «Términos y ADR»).
10. **`libres` sigue ignorando el día de la reserva** (solo mira la franja, como hoy): no es de esta feature; va a «No entra» y lo dejo dicho aquí para que decidas si merece una fila de deuda.
11. **El aviso sale como salida normal del comando, sin código de error**, como el resto de mensajes de `salas` (`sin reserva Sur mar`). La planta se guarda como texto (`floor: '1'`).
12. **`--planta` repetido: vale la primera**: se quita solo la primera `--planta` con su valor, y la segunda queda entre los sobrantes, donde puede acabar siendo la «franja» (`libres --planta 1 --planta 2 14:00-16:00` toma `--planta` por franja y no filtra por reservas); caso raro, fuera de contrato y sin escenario. Sin franja (`libres --planta 2`) se comporta como `libres` sin franja hoy: no filtra por reservas y lista las salas de esa planta.
13. **Quedan fuera, por mí**: mostrar la planta en la salida y que el orden cambie (la salida sigue el orden de `rooms`: `Norte, Sur`); el `CHANGELOG.md` lo escribe el corte de la release.
14. **`floor` y `rooms` son identificadores del código** (en inglés, como `bookings`); «Evitar: floor» de la terminología rige para los textos que lee la persona.
- Repaso de coherencia: `sdd capability merge` sobre una copia → `room-availability.md: añadido «Libres lista las salas libres de una franja»`, `añadido «Libres filtra por planta»` y las cinco reglas; `node --test` actual 4/4 en verde; `git grep -nE "rooms" -- . ':!.docs'` solo da los dos sitios de `src/app.js` de la tabla.
- Política de modelos: revisor de la spec en sonnet (`sdd-kit:effort-medium`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- La opción se llama `--planta` — «la opción se llama --planta»
- Sin `--planta`, lista todas las salas — «sin --planta, lista todas las salas»
- Perfil `delegate` — «Perfil delegate»

## Intent

Quien reserva quiere ver las salas libres de su planta sin leer las de las demás. Hoy `libres` las enseña todas. Éxito: `libres <franja> --planta <n>` enseña exactamente las libres de esa planta y `libres <franja>`, sin `--planta` entre los argumentos, no cambia ni un carácter de su salida de hoy (`libres --planta 2` sí cambia: hoy toma `--planta` por franja y lista todas). Fracaso aunque «funcione»: que la salida sin `--planta` cambie. Límite conocido y aceptado: una planta que no existe da salida vacía, igual que «nada libre» (decisión 4).

## Scope

- Entra: la opción `--planta <n>` de `libres`; la planta como dato de cada sala; el aviso de valor ausente; tests del filtro; el término «planta» en `PRODUCT.md` al cerrar. El `CHANGELOG.md` lo escribe el corte de la release (`sdd-end-release`), no esta feature.
- No entra: más comandos con `--planta` (`reservar`, `cancelar`…); validar que la planta exista; mostrar la planta en la salida; que `libres` distinga días (hoy solo mira la franja); persistir salas (ADR 0003: todo vive en memoria).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `rooms` pasa de lista de nombres a lista de salas con planta | `src/app.js:2` (definición) y `src/app.js:6` (único uso, `freeRooms`) | Scope y Approach: se cambian los dos sitios; no queda otro lector (`git grep -nE "rooms\b"` fuera de specs) |
| `freeRooms(slot)` pasa a recibir también la planta | `src/app.js:5`, llamada en `src/app.js:28` | Scope y Approach |
| Salida de `libres` sin `--planta` | `test/app.test.js:5-7` | No cambia: ese test debe seguir verde sin tocarlo (escenario «sin `--planta`») |
| Contrato de la línea de comandos de `libres`: opción nueva `--planta <n>` y aviso nuevo | `src/app.js:28` (`run` la interpreta); `CHANGELOG.md:10` cita el comando sin opción | Delta `ADDED — Libres filtra por planta`; `run(cmd, params)` sigue exportado con la misma firma; el CHANGELOG no cambia en esta feature |

- Filas que implementa: nada — no hay fila de roadmap para esta feature (id 0012 reservado en `sequence`), comprobado con `git grep -nE "0012" -- ROADMAP.md` → sin resultados.

## Approach

- A — Cada sala lleva su planta (`{ name: 'Norte', floor: '1' }`) y `freeRooms` recibe la franja y la planta opcional y filtra con ambos criterios — un cambio de ~10 líneas en `src/app.js`, sin ficheros nuevos y con los tests por `run('libres', …)` como hoy.
- B — Mapa aparte `floors = { Norte: '1', Sur: '2' }` y filtrar después de `freeRooms` — deja la planta lejos de la sala y obliga a mantener dos listas sincronizadas al añadir una sala.
- C — Un parser de opciones genérico (`--clave valor`) para todos los comandos — no se pide, no hay otra opción hoy y abre un contrato que nadie ha decidido.
- Elegido: A — la planta es un atributo de la sala y el filtro es una condición más en el sitio donde ya se decide qué sala está libre; B duplica datos y C es alcance que nadie pidió.

Lo que fija A:
- `rooms = [{ name: 'Norte', floor: '1' }, { name: 'Sur', floor: '2' }]`; la salida sigue siendo los nombres unidos por `, `.
- `run('libres', params)` separa `--planta` y su valor de `params`; la franja es el primer argumento restante.
- Si `--planta` es el último argumento (sin valor), devuelve el aviso de la decisión 5 sin listar nada.

## Dónde se prueba

- `libres` con y sin `--planta`, en cualquier orden de argumentos, y valor ausente: por `run('libres', [...])`, como el test actual de `test/app.test.js`; fichero nuevo `test/libres-planta.test.js`.
- El `libres` de hoy no se toca (la línea base del delta): `test/app.test.js:5` queda como está y es el escenario sin `--planta`; el escenario `Norte, Sur` va al fichero nuevo.

## Términos y ADR

- Términos resueltos: **Planta** — piso del edificio donde está una sala; cada sala tiene una. _Evitar_: piso, floor. Va a `PRODUCT.md` al cierre.
- ADR candidatas: ninguna — el cambio no es difícil de deshacer ni hay alternativa real que sorprenda.

## Delta de comportamiento

### Capacidad: `room-availability`

#### ADDED — Libres lista las salas libres de una franja

> Línea base: es el `libres` de hoy, que la capacidad aún no recogía. El primer escenario lo cubre `test/app.test.js:5`; el de `14:00-16:00` lo añade el test nuevo.


- GIVEN `Norte` con una reserva activa en `10:00-12:00` (del `lun`) y `Sur` sin reservas
- WHEN `libres 10:00-12:00`
- THEN la salida es `Sur`
- AND el día de la reserva no interviene: hoy `libres` solo recibe la franja (límite vigente, ver «No entra»)
- GIVEN `Norte` y `Sur` sin reservas en `14:00-16:00`
- WHEN `libres 14:00-16:00`
- THEN la salida es `Norte, Sur`

#### ADDED — Libres filtra por planta

- GIVEN `Norte` en la planta 1, `Sur` en la planta 2, y ninguna reserva en `14:00-16:00`
- WHEN `libres 14:00-16:00 --planta 2`
- THEN la salida es `Sur`
- GIVEN el mismo estado
- WHEN `libres --planta 1 14:00-16:00`
- THEN la salida es `Norte`
- GIVEN `Norte` con una reserva activa en `10:00-12:00`
- WHEN `libres 10:00-12:00 --planta 1`
- THEN la salida está vacía
- GIVEN `Norte` en la planta 1 y `Sur` en la planta 2
- WHEN `libres 14:00-16:00 --planta 9`
- THEN la salida está vacía
- GIVEN el mismo estado
- WHEN `libres 14:00-16:00 --planta 02`
- THEN la salida está vacía
- GIVEN el mismo estado
- WHEN `libres --planta 14:00-16:00`
- THEN la salida está vacía
- AND no hay franja (`14:00-16:00` es el valor de la planta), así que no se filtra por reservas y es la planta la que vacía la salida
- GIVEN `Norte` en la planta 1, `Sur` en la planta 2
- WHEN `libres --planta 2`
- THEN la salida es `Sur`
- GIVEN el mismo estado
- WHEN `libres 14:00-16:00 --planta 1 --planta 2`
- THEN la salida es `Norte`
- GIVEN el mismo estado
- WHEN `libres 14:00-16:00 --planta`
- THEN la salida es `falta la planta: usa --planta <número>`
- GIVEN el mismo estado
- WHEN `libres --planta`
- THEN la salida es `falta la planta: usa --planta <número>`

#### Reglas de la capacidad — room-availability

- **Dónde viven los datos**: en memoria del proceso, como las reservas (ADR 0003); las salas y su planta están en `src/app.js`
- **Idioma de los nombres**: castellano en la opción (`--planta`) y en el aviso
- **Límites**: la planta es texto exacto (`1`, `2`), sin normalizar ceros ni nombres
- **Avisos**: `falta la planta: usa --planta <número>` cuando `--planta` no trae valor
- **Regla ante conflicto**: si `--planta` se repite, vale la primera

### Hallazgos de la review

Ronda 1:

- **Aceptado** — Intent llama fracaso a lo que la decisión 4 acepta → Intent reescrito: el fracaso es solo que cambie la salida sin `--planta`; la planta inexistente es un límite aceptado, con la opción de validarla ofrecida en la decisión 4.
- **Aceptado** — el día ignorado quedaba escondido en el escenario → AND explícito en el primer escenario y «No entra».
- **Aceptado** — faltaban `--planta 02`, `--planta` sin franja y `--planta 14:00-16:00` → tres escenarios más; decisiones 3, 11 y 12.
- **Aceptado** — `--planta` repetido sin regla, Límites en «no aplica» → rellenados; decisión 12.
- **Aceptado** — `PRODUCT.md` no estaba en el Scope; `floor`/`rooms` frente a «Evitar» → Scope y decisión 13; la línea de `CHANGELOG.md` sale del Scope (decisión de la release).
- **Aceptado** — decisiones sin recoger (aviso sin código de error, planta como texto) → decisión 11.
- **Aceptado** — línea base marcada y fila de contrato en la tabla → hecho.
- **Rechazado** — «dev-lead» sin respaldo en `PRODUCT.md` → es el rol del usuario en el kit (quien aprueba y valida); aquí es el autor del producto, sin cambio.

Ronda 2 (sin Críticos, no hay tercera):

- **Aceptado** — `--planta` repetido y franja: dos reglas contradictorias → decisión 12 reescrita; caso fuera de contrato.
- **Aceptado** — la línea base marcada ADDED sin test del `Norte, Sur` → blockquote corregido; el test nuevo lo cubre.
- **Aceptado** — `libres --planta` sin escenario → escenario añadido.
- **Aceptado** — «no cambia ni un carácter» falso para `libres --planta 2` → Intent matizado.
- **Aceptado** — AND de «sin franja», exclusiones y orden a ✋ (decisión 13), comando del `git grep` exacto.
- **Rechazado** — «dev-lead» sin definir → ya rechazado en la ronda 1; el propio revisor lo da por aceptable.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
