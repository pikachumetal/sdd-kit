---
id: 20261119-144207-feature-0012-busy-room-warning
feature: 0012
title: Aviso de sala muy ocupada
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Aviso de sala muy ocupada

🦆 Al reservar una sala que ya tiene muchas reservas ese día, la herramienta lo avisa: `reservar Norte lun 14:00-15:00` responde `reservada Norte lun 14:00-15:00` y, debajo, `aviso: Norte muy ocupada el lun (4 reservas)`. La reserva se hace igual; el aviso solo informa. «Muy ocupada» es tener 4 o más reservas activas ese día (cifra propuesta, pendiente de tu visto bueno).

Validación: dev-lead — la usa una persona desde la terminal y el texto del aviso lo juzga quien la usa.

## Capacidades

- Nuevas: `room-occupancy` — reservar una sala en un día y franja, cuándo cuenta como «muy ocupada» y cómo se avisa. (`capabilities/` está vacío: nada vivo que modificar; el comportamiento de `reservar` suelto, que hoy no existe, nace aquí.)
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Todas salen de mí: el mensaje inicial no trae motivo ni cifras, y con la spec aprobada por delegación no hay turno de preguntas. Las marcadas «pendiente» son del dev-lead y las confirmas en la validación.

1. **Pendiente — el porqué**: asumo que se quiere evitar reservar sin darse cuenta una sala casi llena. Si el motivo es otro (p. ej. repartir la carga entre salas), cambia el enfoque.
2. **Pendiente — umbral**: «muy ocupada» = 4 o más reservas activas de la sala en ese día. Razón: las franjas son texto libre y no hay horario de la sala, así que no se puede medir un porcentaje de horas; se cuenta.
3. **Pendiente — dónde se avisa**: al reservar, no en `libres` ni en un comando aparte. Razón: es el momento en que el aviso cambia lo que haces.
4. **Pendiente — el aviso no bloquea**: la reserva se crea igual. Razón: el producto no tiene reglas de tope y bloquear sería inventar una.
5. Texto literal del aviso: `aviso: <sala> muy ocupada el <día> (<n> reservas)`, con `n` contando la reserva recién hecha. Línea aparte tras `reservada <sala> <día> <franja>`.
6. Solo cuentan las reservas con estado `active`: las canceladas y anuladas no suman (como ya hace el código de `libres` y `cancelar`).
7. **Alcance de `reservar`**: hoy `reservar` solo conoce `--cada-semana` y no crea reservas sueltas. Esta feature añade la forma `reservar <sala> <día> <franja>` mínima (añade a `bookings`, en memoria, `{room, day, slot, status: 'active'}` y responde `reservada <sala> <día> <franja>`) porque sin ella no hay dónde avisar. `--cada-semana` no cambia. Sin validar sala, día ni franja, y sin detectar duplicados o solapes (deuda ya anotada en `debt.md`): van a «No entra». Con menos de tres argumentos, `reservar` responde `salas` como hoy.
12. **Pendiente — modelo de ejecución**: `PRODUCT.md` dice que las reservas viven en memoria; si cada invocación de `node src/app.js` es un proceso nuevo, `bookings` arranca con una sola reserva de ejemplo y el aviso solo se vería en los tests o en un proceso largo. La spec no cambia eso (persistir queda en «No entra»); decide en la validación si hace falta una feature de persistencia.
13. La reserva no guarda titular (PRODUCT.md define reserva «a nombre de quien la pide»): igual que `--cada-semana` hoy; una feature aparte.
14. Nombre de la capacidad `room-occupancy`: en inglés porque el nombre de capacidad es un nombre de fichero (regla de kit); el texto de usuario y los términos del producto van en castellano.
7 bis. «El día» es la cadena exacta del argumento (`lun`): sin normalizar.
7 ter. Los escenarios usan el umbral 4 de la decisión 2: si el dev-lead lo cambia en la validación, cambian con él.
7 quater. La aprobación delegada cubre la spec; las decisiones 1 a 4, marcadas «pendiente», se confirman en la validación.
8. Enfoque: A frente a B y C (ver Approach).
9. Capacidad nueva `room-occupancy` (kebab-case en inglés); `capabilities/` no existe aún y la crea el cierre.
10. Sin `§Frontend`: es una CLI, no hay pantalla.
11. Delta probado en una copia de `.docs/sdd`: `capability merge` → `room-occupancy.md: añadido` ×3 requisitos y ×3 reglas, sin rechazos. Coherencia: `grep` de `reservar` solo toca `src/app.js:29` y su test (`--cada-semana`, sin cambio) y `CHANGELOG.md:9` (histórico).
- Política de modelos (solo en `delegate`): revisores de la spec: ninguno salvo lo que proponga la review · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

1. **Aceptado** — `reservar` suelto sin requisito → nuevo ADDED «Reservar una sala en un día y una franja»; «Capacidades» aclara que no hay nada vivo que modificar.
2. **Aceptado** — nada comprueba que la reserva se hace y cuenta → AND «queda registrada» (`cancelar` la encuentra) y escenario con 4 activas → `(5 reservas)`.
3. **Rechazado** — el caso «canceladas no cuentan» no discrimina: con 2 activas, 1 cancelada y 1 anulada, contar todo daría 5 ≥ 4 y avisaría; el escenario exige que no avise. El umbral exacto lo cubre el escenario de 3 activas.
4. **Aceptado** — reglas de datos e idioma de nombres añadidas.
5. **Aceptado** — el día es la cadena exacta (decisión 7 bis).
6. **Aceptado** — validación, duplicados y solapes a «No entra»; argumentos incompletos, decisión 7; `BUSY_THRESHOLD` y `occupancy` son nombres menores del Approach.
7. **Aceptado** — Scope declara `bookings` y sus campos.
8. **Aceptado** — decisión 7 ter.
9. **Aceptado** — decisión 7 quater.
10. **Aceptado** — cubierto por la regla de idioma.

Segunda ronda (sin Críticos, sin tercera):
11. **Aceptado** — AND de `cancelar` cita su dependencia; escenario de argumentos incompletos; argumentos sobrantes y mezcla con `--cada-semana` a «No entra».
12. **Aceptado** — modelo de ejecución y persistencia: decisión 12 (pendiente) y «No entra».
13. **Aceptado** — sin titular: decisión 13.
14. **Aceptado** — los AND observables ya usan `cancelar`; «pura» → «sin efectos laterales»; nombre de capacidad justificado (decisión 14).

Review de spec: un revisor (sonnet) y una segunda ronda (sonnet), señal: capacidad nueva · tamaño ~60 líneas en 1 fichero.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec delegada (2026-11-19) — «apruebo la spec por delegación, nos vemos en la validación»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `libres` dice qué salas están libres en una franja, pero nada avisa de que una sala ya acumula reservas el mismo día. Se quiere que, al reservar, un aviso lo haga visible. Éxito: reservar una 4.ª reserva en `Norte` el `lun` muestra el aviso; reservar la 1.ª, 2.ª o 3.ª no muestra nada. Anti-objetivo: que el aviso impida o cambie la reserva.

## Scope

- Entra: función de ocupación (reservas activas de una sala en un día), la forma simple de `reservar` que añade a `bookings` (en memoria: `room`, `day`, `slot`, `status`), el aviso con su umbral.
- No entra: persistir las reservas entre invocaciones (limitación conocida: `bookings` vive en memoria de un proceso, decisión 12), argumentos sobrantes o mezclar la forma simple con `--cada-semana`, validar sala, día o franja, detectar duplicados o solapes, bloquear reservas, avisos por correo (la 0008), umbral configurable, validar el formato de franja (deuda en `debt.md`), cambios en `libres`, `cancelar` o `anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `reservar` sin `--cada-semana` (hoy devuelve `salas`) | `src/app.js:run` | Scope: pasa a crear la reserva y responder `reservada …` (decisión 7) |

- Filas que implementa: nada: comprobado con `grep -n "0012\|ocupad" ROADMAP.md src test`

## Approach

- A. Aviso al reservar, con una función `occupancy(room, day)` sin efectos laterales que cuenta activas — coste: añade la forma simple de `reservar`; se prueba sola y por `run`.
- B. Comando nuevo `ocupacion <sala> <día>` que el usuario consulta — coste: no «avisa», hay que acordarse de preguntar.
- C. Aviso dentro de `libres` — coste: `libres` no recibe día, habría que cambiar su firma y su salida.
- Elegido: A — es el único que avisa sin que lo pidas y no toca la salida de `libres`.

Fija: `occupancy` cuenta `bookings` con `status === 'active'`; umbral como constante `BUSY_THRESHOLD = 4` en `src/app.js` (un solo fichero de entrada, `architecture.md`).

## Dónde se prueba

- Umbral y recuento (incluye canceladas/anuladas que no suman): unitario sobre `occupancy`, en `test/occupancy.test.js`, con el patrón de `test/cancel.test.js`.
- Aviso al reservar y texto literal: por `run('reservar', …)`, como los tests actuales de `app.test.js`.
- `--cada-semana` sigue igual: el test existente.

## Términos y ADR

- Términos resueltos: ninguno (se usa «reserva», «sala» del PRODUCT).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Reservar una sala en un día y una franja

- GIVEN `Norte` sin reservas el `lun`
- WHEN se ejecuta `reservar Norte lun 14:00-15:00`
- THEN responde `reservada Norte lun 14:00-15:00`
- AND la reserva queda registrada: después, el `cancelar` vigente (`cancelar Norte lun`) responde `cancelada Norte lun`

#### ADDED — `reservar` con argumentos incompletos

- GIVEN cualquier estado
- WHEN se ejecuta `reservar Norte lun` (menos de tres argumentos)
- THEN responde `salas`, como hoy, y no registra ninguna reserva

#### ADDED — Aviso al reservar una sala muy ocupada

- GIVEN `Norte` tiene 3 reservas activas el `lun`
- WHEN se ejecuta `reservar Norte lun 14:00-15:00`
- THEN responde `reservada Norte lun 14:00-15:00`
- AND una segunda línea `aviso: Norte muy ocupada el lun (4 reservas)`
- AND la reserva queda hecha igual

#### ADDED — El aviso sigue por encima del umbral

- GIVEN `Norte` tiene 4 reservas activas el `lun`
- WHEN se ejecuta `reservar Norte lun 14:00-15:00`
- THEN responde `reservada Norte lun 14:00-15:00` y `aviso: Norte muy ocupada el lun (5 reservas)`

#### ADDED — Sin aviso por debajo del umbral

- GIVEN `Norte` tiene 1 reserva activa el `lun`
- WHEN se ejecuta `reservar Norte lun 14:00-15:00`
- THEN responde solo `reservada Norte lun 14:00-15:00`, sin aviso

#### ADDED — Las reservas canceladas y anuladas no cuentan

- GIVEN `Norte` tiene 2 activas, 1 cancelada y 1 anulada el `lun`
- WHEN se ejecuta `reservar Norte lun 14:00-15:00`
- THEN responde solo `reservada Norte lun 14:00-15:00` (3 activas con la nueva)

#### Reglas de la capacidad — room-occupancy

- **Dónde viven los datos**: en memoria, en `bookings` (`PRODUCT.md`: las reservas viven en memoria).
- **Idioma de los nombres**: el texto al usuario, en castellano; los identificadores del código (`bookings`, `occupancy`) son internos y los fija el código existente.
- **Límites**: «muy ocupada» = 4 o más reservas activas de la sala en el día, contando la que se acaba de hacer.
- **Avisos**: `aviso: <sala> muy ocupada el <día> (<n> reservas)`.
- **Regla ante conflicto**: el aviso nunca impide la reserva.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
