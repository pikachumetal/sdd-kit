---
id: 20261119-160221-feature-0012-sala-ocupada
feature: 0012
title: Aviso de sala muy ocupada
mode: full
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Aviso de sala muy ocupada

🦆 Hoy no hay forma de saber de un vistazo si una sala se está llenando. Con este cambio, `node src/app.js ocupacion lun` lista cada sala con sus reservas de ese día y, si una llega a 3 reservas activas, la marca: `Norte: 3 reservas ⚠ muy ocupada`. Por dentro, es una función pura que cuenta reservas activas por sala y día y un comando nuevo que la imprime.

Validación: dev-lead — es salida de terminal que la persona que usa el producto lee y juzga (el umbral y el texto del aviso son suyos).

## Capacidades

- Nuevas: `room-occupancy` — cuántas reservas activas tiene una sala en un día y cuándo se avisa de que está muy ocupada

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva (`room-occupancy`) · tamaño: ~70 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`). Lo decido yo, sin preguntar, porque el dev-lead delegó la aprobación: la regla del kit da un solo revisor con los siete puntos a un Scope pequeño sin contrato público ni `MODIFIED`.
- Dominio+técnica (sonnet): que cada THEN de `room-occupancy` se pueda cumplir con las reservas que entran por `occupancy` y por `run`, y que el umbral `≥ 3` de «Límites» no pase por azar (señal: capacidad nueva).
- Mínimo razonable: ningún revisor (solo el repaso de coherencia) — dejaría sin mirar si los escenarios del comando se pueden cumplir con el estado en memoria, que trae una sola reserva.

La petición («avisa cuando una sala esté muy ocupada») no dice qué es «muy ocupada», dónde sale el aviso ni qué cuenta. Por la delegación no hubo entrevista: lo de abajo es mi propuesta y todo lo marcado **pendiente** es tuyo, el dev-lead, para corregir en la validación.

1. **pendiente** — «Muy ocupada» = **3 o más reservas activas** de esa sala en ese día. Sin catálogo de franjas en el código no se puede medir «% de horas ocupadas»; contar reservas es lo único medible hoy. El 3 es un valor mío, sin dato detrás.
2. **pendiente** — Dónde sale el aviso: un comando **nuevo** `ocupacion <día>`. `libres` no recibe día (solo franja) y `reservar` no crea reservas todavía (solo devuelve `reserva semanal creada`), así que avisar «al reservar» no es posible sin ampliar el alcance.
3. **pendiente** — Texto: una línea por sala, `<Sala>: <n> reservas` y, si `n ≥ 3`, se añade ` ⚠ muy ocupada`. Con 1 reserva, `1 reserva` (singular); con 0, `0 reservas`. Castellano, por la constitution (art. 4).
4. Solo cuentan reservas `active`: las canceladas (`cancelled`) y las anuladas (`voided`) no ocupan sala (sale de `findBooking` y `freeRooms`, que ya las ignoran).
5. Todas las salas salen siempre, en el orden de `rooms` (Norte, Sur), con o sin reservas: es el orden que ya usa `libres`.
6. Día sin argumento: `run` devuelve la cadena `falta el día` (no lanza excepción) y `app.js` la imprime con `console.log`, igual que `sin reserva <sala> <día>` y el resto de comandos. No fijo código de salida: ningún comando actual lo hace.
6 bis. **pendiente** — El día es una cadena que se compara tal cual con el `day` guardado en la reserva (`lun`, en minúsculas, como la reserva de ejemplo del código). Un día desconocido (`xyz`, `LUN`) no es error: cuenta 0 reservas por sala, como `cancelar` tampoco valida el día. Los argumentos sobrantes (`ocupacion lun mar`) se ignoran: solo cuenta el primero, y un día vacío (`""`) cuenta como día desconocido, 0 reservas. Validar el día sería otra decisión del dev-lead.
7. Nombre de la capacidad: `room-occupancy` (kebab-case en inglés, regla del slug); el contenido va en castellano.
8. Enfoque: A (función pura `occupancy(bookings, day)` + comando), frente a B (aviso dentro de `libres`) y C (estado «ocupada» guardado en la sala). Ver Approach.
7 bis. **pendiente** — Se cuentan reservas, no franjas distintas: dos reservas activas de la misma sala, día y franja suman 2 hacia el umbral.
8 bis. `run` gana un tercer parámetro opcional con la lista de reservas (por defecto, la de memoria): es la vía por la que los tests meten reservas en el comando, porque el estado en memoria solo trae una.
9. Umbral como constante `BUSY_THRESHOLD = 3` en `src/app.js`, no configurable por línea de comandos ni fichero: nadie lo pidió y el producto lo usa una sola persona.
9 bis. **pendiente** — El glifo `⚠` (con un espacio delante) forma parte del texto exacto del aviso, y la salida es UTF-8; el test compara la cadena completa. Si tu terminal de Windows lo pinta mal, se cambia por `(!)` en la validación. El umbral no se exporta: los tests usan las cuentas literales 2, 3 y 4, y si el 3 de la decisión 1 cambia, cambian ellos.
10. Validación: dev-lead (el aviso es lo que ve quien usa la herramienta).
### Hallazgos de la review

- **Aceptado** (Crítico) — los escenarios del comando no podían cumplirse con el estado en memoria → `run` recibe la lista de reservas como tercer parámetro (✋ 8 bis, Approach) y los escenarios se fijan sobre esa lista; el modelo de la reserva (`room`, `day`, `slot`, `status`) va al Approach.
- **Aceptado** (Crítico) — día desconocido o sin reservas sin definir → ✋ 6 bis y un escenario nuevo.
- **Aceptado** (Importante) — umbral solo probado con 3 y 2 → escenarios con 4 reservas y con las dos salas avisadas.
- **Aceptado** (Importante) — el AND del singular contradecía su GIVEN → escenario propio.
- **Rechazado** (Importante) — decisión 4 sin fuente → la fuente es `src/app.js` (`status: 'active'` en la reserva de ejemplo, `'cancelled'` en `cancelBooking`, `'voided'` en `voidBooking`), ya citada en la propia decisión.
- **Aceptado** (Importante) — canal y código de salida sin declarar → ✋ 6; el error de argumentos sale de «Avisos».
- **Rechazado** (Importante) — decisiones técnicas 8 y 9 sin marcar → son el Approach que fija el kit para `delegate`; `src/app.js` como sede lo impone `architecture.md` («un solo fichero de entrada»).
- **Rechazado** (Menor) — gate con `scripts/lint.mjs` → es el gate de cierre de `operations.md`.
- **Aceptado** (Menor) — idioma del comando e identificadores → declarado en «Idioma de los nombres».
- **Aceptado** (Menor) — «exactamente» en el Intent → retirado.
- Segunda ronda (un revisor sonnet, sin Críticos): **Aceptado** — la firma de `run` en la tabla y el Scope; los escenarios de 4 y 3+3 con su propio GIVEN; `LUN`, argumentos sobrantes y día vacío (✋ 6 bis); franjas fuera del GIVEN; duplicadas (✋ 7 bis); glifo y constante (✋ 9 bis); el código de salida 0 se retira del contrato; relato único de la aprobación. **Rechazado** — comprobar `scripts/lint.mjs`: es el gate de `operations.md` y el plan lo ejecuta.
- Delta probado en copia: `capability merge` añadió los requisitos y las 5 reglas en `room-occupancy.md` y `capability check` salió válido; el `capabilities/` del repo no se toca.

- Política de modelos (solo en `delegate`): sin revisores de spec fuera de los que dicte `sdd-spec-approval` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Apruebo la spec por delegación; la validación la hace el dev-lead — «apruebo la spec por delegación, nos vemos en la validación»
- Perfil `delegate` para esta feature — «Perfil delegate.»

## Intent

Hoy `salas` solo dice qué salas están libres en una franja; no hay manera de ver cuánta carga lleva una sala un día. Quien reserva (el propio dev-lead, único usuario) quiere enterarse de que una sala se está llenando sin revisar reserva a reserva. Éxito: `ocupacion lun` marca con `⚠ muy ocupada` las salas que llegan al umbral (propuesta: 3 reservas activas ese día), y ninguna otra. Anti-objetivo: que el aviso salga por reservas ya canceladas o anuladas, o que bloquee reservar.

## Scope

- Entra: el tercer parámetro opcional de `run` para inyectar reservas en los tests; el comando `ocupacion <día>` y su cuenta de reservas activas por sala; el aviso de «muy ocupada» con umbral 3; el error `falta el día`; tests.
- No entra: avisar al reservar o al cancelar; avisos por correo (es la 0008); umbral configurable; ocupación por franjas o por horas; bloquear reservas en una sala llena; persistencia (las reservas siguen en memoria).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. `run` gana un comando y un tercer parámetro opcional (`list = bookings`); con el valor por defecto los comandos existentes se comportan igual | `src/app.js` (`run`) | Scope y decisión 8 bis; los tests actuales de `libres` y `reservar` lo comprueban |

- Filas que implementa: nada: comprobado con `grep -rniE "ocupad|ocupaci" --exclude-dir=.git .` (sin resultados) y `ROADMAP.md` no tiene fila para esto; la 0012 se reservó con `sdd id next`.

## Approach

- A — función pura `occupancy(bookings, day)` que devuelve `{ sala: n }` de reservas activas, y un comando `ocupacion` en `run` que la formatea. Cuesta: un comando nuevo. Se prueba sola, sin tocar el estado en memoria.
- B — meter el aviso en `libres`. Cuesta: `libres` no recibe día, habría que cambiar su firma y romper su test; mezcla dos preguntas («¿qué está libre?» y «¿qué se llena?»).
- C — guardar un estado `ocupada` en cada sala y mantenerlo al reservar/cancelar/anular. Cuesta: estado duplicado que se desincroniza con `cancelBooking` y `voidBooking`.
- Elegido: A — es el único que no cambia nada existente y deriva el aviso del estado real, sin duplicarlo.

Partes del cómo que fija A: una reserva es `{ room, day, slot, status }`; `BUSY_THRESHOLD = 3` constante en `src/app.js`; `occupancy(bookings, day)` exportada, devuelve `{ sala: n }` contando `status === 'active'` y `day` igual; `run(cmd, params, list = bookings)`: `ocupacion <día>` devuelve las líneas unidas por `\n` y `ocupacion` sin día devuelve `falta el día`, como cadena. Sin dependencias nuevas (arquitectura: Node 22 sin externas).

## Dónde se prueba

- Cuenta de reservas activas por sala y día, ignorando canceladas y anuladas: unitario de `occupancy` en `test/app.test.js`, pasándole la lista de reservas, como el test actual de `libres`.
- Umbral (2 → sin aviso; 3 y 4 → aviso; las dos salas a la vez) y texto de cada línea: `run('ocupacion', ['lun'], lista)` en `test/app.test.js`, con la lista de cada caso; el estado en memoria solo trae una reserva.
- `falta el día`: `run('ocupacion', [])`, mismo fichero.
- Gate de cierre: `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: «muy ocupada» — sala con 3 o más reservas activas en un día (pendiente de validar, ✋ 1)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Cuenta de reservas activas por sala y día

- GIVEN Norte con 2 reservas activas y 1 cancelada el lunes (la franja de cada una no influye en la cuenta), y Sur sin reservas
- WHEN se ejecuta `ocupacion lun`
- THEN sale `Norte: 2 reservas` y `Sur: 0 reservas`, en ese orden

#### ADDED — Singular con una reserva

- GIVEN Norte con 1 reserva activa el lunes y Sur sin reservas
- WHEN se ejecuta `ocupacion lun`
- THEN sale `Norte: 1 reserva` y `Sur: 0 reservas`

#### ADDED — Aviso de sala muy ocupada

- GIVEN Norte con 3 reservas activas el lunes y Sur con 2
- WHEN se ejecuta `ocupacion lun`
- THEN sale `Norte: 3 reservas ⚠ muy ocupada` y `Sur: 2 reservas`, sin aviso en Sur

#### ADDED — El aviso sigue por encima del umbral

- GIVEN Norte con 4 reservas activas el lunes y Sur con 0
- WHEN se ejecuta `ocupacion lun`
- THEN sale `Norte: 4 reservas ⚠ muy ocupada` y `Sur: 0 reservas`

#### ADDED — Varias salas avisadas a la vez

- GIVEN Norte y Sur con 3 reservas activas cada una el lunes
- WHEN se ejecuta `ocupacion lun`
- THEN salen `Norte: 3 reservas ⚠ muy ocupada` y `Sur: 3 reservas ⚠ muy ocupada`

#### ADDED — Día sin reservas o desconocido

- GIVEN Norte con 3 reservas activas el lunes
- WHEN se ejecuta `ocupacion mar` (o `ocupacion xyz`, o `ocupacion LUN`)
- THEN sale `Norte: 0 reservas` y `Sur: 0 reservas`, sin aviso

#### ADDED — Las reservas anuladas y canceladas no ocupan

- GIVEN Norte con 2 reservas activas, 1 cancelada y 1 anulada el lunes
- WHEN se ejecuta `ocupacion lun`
- THEN sale `Norte: 2 reservas`, sin aviso

#### ADDED — El comando exige el día

- GIVEN cualquier estado
- WHEN se ejecuta `ocupacion` sin día
- THEN sale `falta el día` y no se lista ninguna sala

#### Reglas de la capacidad — room-occupancy

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; la ocupación no se guarda, se calcula en cada consulta
- **Idioma de los nombres**: castellano en la salida (`reservas`, `muy ocupada`); el comando es `ocupacion`, sin tilde por convención de línea de comandos, y los identificadores de código (`occupancy`, `bookings`) quedan fuera de la regla
- **Límites**: muy ocupada con 3 o más reservas activas de una sala en un día
- **Avisos**: ` ⚠ muy ocupada` al final de la línea de la sala (el error de argumentos `falta el día` no es un aviso de ocupación: está en su requisito)
- **Regla ante conflicto**: una reserva cancelada o anulada nunca cuenta; si el estado de una reserva no es `active`, se ignora

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
