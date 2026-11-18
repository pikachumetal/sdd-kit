---
id: 20261118-222003-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso cuando una sala está muy ocupada
mode: full
status: approved
created: 2026-11-18
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-18
---

# Spec — Aviso cuando una sala está muy ocupada

🦆 Hoy `reservar` solo sabe crear la reserva semanal. Con este cambio, `reservar Norte lun 14:00-15:00` reserva la sala y, si con esa reserva Norte llega a 3 reservas activas el lunes, añade una línea: `aviso: Norte muy ocupada el lun (3 reservas)`. Por debajo de 3 no avisa; las canceladas y las anuladas no cuentan. El aviso sale al reservar, no antes ni después, porque el programa no guarda nada entre ejecuciones.

Validación: dev-lead — es texto que sale en la terminal y el umbral y el momento del aviso son decisiones tuyas que solo tú puedes dar por buenas.

## Capacidades

- Nuevas: `room-occupancy` — cuándo una sala cuenta como «muy ocupada» y cómo se avisa al reservar.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/occupancy.test.js`)
- Dominio (sonnet): si «muy ocupada» (≥ 3 reservas activas, sala y día) y el texto del aviso quedan sin ambigüedad en los THEN de «Aviso al reservar» (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si un THEN pasa sin el comportamiento (p. ej. el aviso que sale con 2 reservas)

> Los valores de abajo no vienen de ti (pediste solo «avisa cuando una sala esté muy ocupada»); están todos aquí.

1. **Qué es «muy ocupada»**: una sala con **3 o más reservas activas el mismo día**. Cuento reservas, no horas ni porcentaje, porque las franjas son texto libre sin validar (`debt.md`) y no sé cuántas tiene un día. Las canceladas y las anuladas no cuentan.
2. **Cuándo avisa**: en la respuesta de `reservar` que deja la sala en 3 o más (y en cada reserva posterior que la mantenga ahí). Es el único momento posible: no hay estado entre ejecuciones ni proceso en marcha.
3. **Canal**: una segunda línea en la salida estándar de `reservar`. Sin correo, sin sonido, sin fichero (el correo es la fila 0008, aparte).
4. **Texto literal del aviso**: `aviso: Norte muy ocupada el lun (3 reservas)` (sala, día, nº actual de reservas activas).
5. **`reservar <sala> <día> <franja>` es un comando nuevo**: hasta ahora `reservar` solo tenía la variante `--cada-semana`, que no cambia. Respuesta: `reservada Norte lun 14:00-15:00` (calca `cancelada Norte lun`). La reserva solo vive en memoria durante esa ejecución, como todas.
6. **Sala inexistente**: `sala desconocida: Oeste` y no se reserva (si no, contaría para un umbral de una sala que no existe).
7. **La reserva semanal no avisa**: `reservar Norte --cada-semana` sigue devolviendo `reserva semanal creada`, sin tocar.
8. **Nombre de la capacidad nueva**: `room-occupancy` (slug en inglés, kebab-case).
9. **Sin `§Frontend`**: es una CLI de texto sin pantalla ni login; no propongo detector visual ni Playwright.
10. **Enfoque**: A (aviso al reservar), frente a B (comando `ocupacion <día>`) y C (aviso en `libres`); ver Approach.
11. **Repaso de coherencia**: `git grep` de `reservar` y `0012`: solo la variante `--cada-semana` (`src/app.js:29`, `test/app.test.js:9-10`), intacta. Delta probado en copia con `sdd capability merge`: 6 requisitos y 5 reglas añadidos a `room-occupancy.md`, sin rechazos.
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

12. **⚠️ Límite que conviene que veas**: como las reservas viven solo en memoria y cada ejecución arranca con una sola reserva (Norte, lun), desde la terminal una ejecución nunca llega a 3: el aviso solo se ve en los tests (varias llamadas a `run` en un proceso). Lo dejo así porque persistir reservas es otra feature; si el aviso ha de verse desde la terminal, es una enmienda o una fila nueva.
13. **Avisa, no bloquea**: la reserva se crea con o sin aviso.
14. **Sala y día se comparan tal cual** (`Norte` ≠ `norte`, `lun` ≠ `lunes`), como ya hace `cancelar`; los argumentos que faltan quedan fuera (No entra).
15. **Reparto del código**: `activeCount`, `reserveBooking`, `BUSY_THRESHOLD` (ver Approach); `cancelBooking` y `voidBooking` ya están exportados y no cambian. Se exporta además `resetBookings()` (deja solo la reserva de partida) para aislar cada test, porque `bookings` es estado del módulo. Las reservas nuevas tienen la misma forma que la de partida (`room`, `day`, `slot`, `status: 'active'`); la de partida no cambia.
16. **Enrutado de `reservar`**: con `--cada-semana`, la forma semanal de hoy; con exactamente tres parámetros (sala, día, franja), la nueva; con cualquier otra combinación, lo de hoy (cae en `salas`), sin mensaje de uso nuevo.
17. **El 3 es provisional**: sale de mí, no de ti; queda por confirmar en la validación antes del cierre.

### Hallazgos de la review

- **Segunda ronda** (sin tercera): aceptados el recuento (6 requisitos), el aislamiento de tests (`resetBookings`, decisión 15), las secuencias exactas de `cancelar`/`anular` en los GIVEN, el éxito reformulado en el Intent, la forma de `bookings` y el enrutado (decisiones 15 y 16), la comprobación observable de «sala desconocida» y el 3 provisional (decisión 17). Rechazados: separar el escenario «por sala y día» en dos (las dos comprobaciones son la misma regla) y el hueco de `PRODUCT.md` (existe, en la raíz, no en `steering/`).
- **Aceptado** — (Crítico) el GIVEN de «Aviso» no decía cómo se llega a 2 reservas → los GIVEN dicen ahora «mismo proceso, varias llamadas a `run`», partiendo de la reserva de partida; y de ahí sale la decisión 12 (desde la terminal no se llega a 3).
- **Aceptado** — canceladas y anuladas en un solo escenario → dos escenarios, cada uno discrimina su exclusión.
- **Aceptado** — «no hay aviso» no fijaba el formato → «exactamente una línea».
- **Aceptado** — mayúsculas y día sin declarar → regla en Límites y decisión 14.
- **Aceptado (parcial)** — fuente de las salas y argumentos ausentes → las salas son `rooms` de `src/app.js`; los argumentos que faltan, a No entra.
- **Aceptado** — decisiones sin listar (avisa no bloquea, reparto de funciones) → decisiones 13 y 15.
- **Aceptado** — regla ante conflicto «no aplica» → la misma franja dos veces cuenta como dos; idioma cita la constitución.
- **Rechazado** — status `approved` con review pendiente → los hallazgos ya están aquí; la aprobación es por delegación.
- **Rechazado** — separar `room-booking` de `room-occupancy` → `reservar` es aquí solo el vehículo del aviso; una capacidad de reservas completa (semanal, solapes) sería ampliar el alcance. Se crea cuando una feature la necesite.
- **Aceptado** — la tabla de «cambia de forma» decía «nada» → ahora declara el contrato nuevo de `reservar` y el enrutado en `run`.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, perfil `delegate` — «apruebo la spec por delegación, nos vemos en la validación» (2026-11-18)
- Pendiente, sin respuesta: para qué quieres el aviso (qué harás cuando salga) y si 3 es tu umbral real. Lo corriges en la validación.

## Intent

Hoy no hay noción de ocupación: `libres <franja>` dice qué salas quedan, no cuánta gente se las está quedando. Quieres enterarte cuando una sala se está llenando. Éxito: al reservar la tercera reserva activa del día en una sala, la respuesta lo dice en la misma salida, sin ejecutar nada más. Hoy eso se comprueba con los tests, no desde la terminal (decisión 12); el dev-lead lo valida con `node --test test/occupancy.test.js`. Anti-objetivo: avisar de más (con 2 reservas) o de menos (contando canceladas), que el aviso estorbe a quien no está cerca del tope, o que cambie el resultado de la reserva (avisa, no bloquea). El porqué lo dejaste sin decir: queda pendiente.

## Scope

- Entra: `reservar <sala> <día> <franja>` con su respuesta; contar reservas activas por sala y día; la línea de aviso al llegar a 3 o más; sala desconocida.
- No entra: bloquear la reserva; detectar la misma franja reservada dos veces (cuenta como dos); avisos por correo (0008); persistencia entre ejecuciones; validar el formato de franja (deuda en `debt.md`); `reservar` sin sala, día o franja (error de uso); porcentaje de ocupación; umbral configurable.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira. `reservar` gana una segunda forma (`reservar <sala> <día> <franja>`) y un enrutado nuevo en `run` | `src/app.js:29` (la forma `--cada-semana`, que conserva `reserva semanal creada`), `test/app.test.js:9-10` | Delta (`ADDED`) y decisión 7: la forma semanal no se toca |

- Filas que implementa: 0012 (sin fila en el roadmap; la crea el cierre) → ningún fichero la nombra | comprobado con `git grep -n "0012"`.

## Approach

- A. Aviso en la respuesta de `reservar` — cuesta un comando `reservar` completo (hoy es un stub), pero es el único momento en que el programa «ve» la reserva y coincide con «avisa».
- B. Comando `ocupacion <día>` que lista salas muy ocupadas — no cuesta crear reservas, pero no «avisa»: hay que acordarse de preguntar; y con reservas solo en memoria devolvería siempre lo mismo.
- C. Aviso dentro de `libres` — `libres` recibe una franja, no un día, así que no sabe de qué día hablar.
- Elegido: A — es el único que avisa de verdad con un proceso sin estado.

La ocupación sale de una función pura `activeCount(room, day)` sobre `bookings` (solo `status: 'active'`) en `src/app.js`; `reserveBooking(room, day, slot)` añade la reserva y devuelve la respuesta con el aviso si procede; `run` lo enruta. El umbral es la constante `BUSY_THRESHOLD = 3`.

## Dónde se prueba

- Umbral, aviso y texto: `node --test test/occupancy.test.js`, por `run('reservar', …)` como `test/app.test.js`.
- Canceladas y anuladas no cuentan: mismo fichero, usando `cancelBooking` y `voidBooking` exportados (`test/cancel.test.js`).
- La salida real de la terminal: `node src/app.js reservar Norte lun 14:00-15:00` en la validación (verá `reservada…` sin aviso: ver decisión 12).

## Términos y ADR

- Términos resueltos: «muy ocupada» — sala con 3 o más reservas activas el mismo día.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Reservar una sala

- GIVEN un proceso recién arrancado, con la reserva de partida de Norte `lun 10:00-12:00` activa
- WHEN `reservar Norte lun 14:00-15:00`
- THEN la respuesta es exactamente una línea, `reservada Norte lun 14:00-15:00`
- AND no hay línea de aviso (2 reservas activas)

#### ADDED — Aviso de sala muy ocupada

- GIVEN la sala Norte con 2 reservas activas el lun (la de partida más `reservar Norte lun 14:00-15:00`, en el mismo proceso: varias llamadas seguidas a `run`)
- WHEN `reservar Norte lun 16:00-17:00`
- THEN la respuesta es `reservada Norte lun 16:00-17:00` y, en una segunda línea, `aviso: Norte muy ocupada el lun (3 reservas)`
- AND con una 4.ª reserva el mismo día la segunda línea dice `(4 reservas)`
- AND la reserva se crea igualmente: el aviso no bloquea

#### ADDED — Las reservas canceladas no cuentan para la ocupación

- GIVEN, en un mismo proceso, la reserva de partida de Norte (lun 10:00-12:00), `reservar Norte lun 14:00-15:00`, `reservar Norte lun 16:00-17:00` y después `cancelar Norte lun` (cancela la primera activa, la de partida): 2 activas y 1 cancelada
- WHEN `reservar Norte lun 18:00-19:00`
- THEN la respuesta es `reservada Norte lun 18:00-19:00` y la segunda línea dice `(3 reservas)`, no `(4 reservas)`

#### ADDED — Las reservas anuladas no cuentan para la ocupación

- GIVEN, en un mismo proceso, la reserva de partida de Norte, `reservar Norte lun 14:00-15:00` y después `anular Norte lun` (anula la primera activa, la de partida): 1 activa y 1 anulada
- WHEN `reservar Norte lun 18:00-19:00`
- THEN la respuesta es exactamente una línea, `reservada Norte lun 18:00-19:00`, sin aviso (2 activas con la nueva; con la anulada contada serían 3)

#### ADDED — La ocupación es por sala y por día

- GIVEN, en un mismo proceso, Norte con 2 reservas activas el lun (la de partida y `reservar Norte lun 14:00-15:00`) y Sur con 2 el lun (dos `reservar Sur lun …`)
- WHEN `reservar Norte mar 10:00-11:00`
- THEN no hay aviso (Norte tiene 1 reserva el mar)
- AND `reservar Sur lun 09:00-10:00` avisa `aviso: Sur muy ocupada el lun (3 reservas)`

#### ADDED — Sala desconocida

- GIVEN las salas Norte y Sur
- WHEN `reservar Oeste lun 10:00-11:00`
- THEN la respuesta es `sala desconocida: Oeste` y `activeCount('Oeste', 'lun')` sigue en 0

#### Reglas de la capacidad — room-occupancy

- **Dónde viven los datos**: memoria del proceso (`bookings` en `src/app.js`); nada persiste entre ejecuciones
- **Idioma de los nombres**: castellano en los mensajes y en el comando `reservar` (constitución, art. 4); los identificadores del código quedan fuera
- **Límites**: umbral de «muy ocupada» = 3 reservas activas por sala y día; sala y día se comparan tal cual, con mayúsculas y minúsculas como en `cancelar`
- **Avisos**: `aviso: <sala> muy ocupada el <día> (<n> reservas)`, segunda línea de la respuesta de `reservar`, solo con n ≥ 3
- **Regla ante conflicto**: la misma franja reservada dos veces cuenta como dos reservas (no se detecta el solape)

## Enmiendas

(ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-18 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
