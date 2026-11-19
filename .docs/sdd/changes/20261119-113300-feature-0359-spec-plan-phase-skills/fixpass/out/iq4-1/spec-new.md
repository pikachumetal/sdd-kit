---
id: 20261119-175533-feature-0012-aviso-sala-ocupada
feature: 0012
title: Aviso de sala muy ocupada
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture (por delegación)
    approved_at: 2026-11-19
---

# Spec — Aviso de sala muy ocupada

🦆 Hoy no hay forma de ver si una sala se está llenando. Con este cambio, `ocupacion Norte lun` dice cuántas reservas activas tiene la sala ese día y, si son 3 o más, añade el aviso `aviso: Norte muy ocupada el lun (3 reservas)`. Por dentro es una función que cuenta reservas activas y un comando nuevo.

Validación: dev-lead — lo usa una persona desde la terminal y el umbral y el texto del aviso son decisiones de producto.

## Capacidades

- Nuevas: `room-busy-warning` — aviso cuando una sala alcanza el umbral de reservas activas en un día.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) con los siete puntos — señales: capacidad nueva · tamaño: ~40 líneas en 3 ficheros (sin contrato público ni `MODIFIED`)
- Dominio+técnica (sonnet): umbral y textos de los escenarios frente a las decisiones 1-5, y que los casos límite estén cubiertos (señal: capacidad nueva)
- Mínimo razonable: el mismo; no hay nivel inferior

La petición («avisa cuando una sala esté muy ocupada») no dijo nada más. Lo siguiente es mío y queda **pendiente** de tu validación, porque aprobaste por delegación y no hubo entrevista.

1. «Muy ocupada» = 3 o más reservas activas de esa sala en un mismo día — pendiente: nadie dio el umbral; con 2 salas y un día de oficina corto, 3 es lo que cabe. Constante en un solo sitio.
2. Las canceladas y las anuladas no cuentan — una reserva que ya no existe no ocupa la sala (términos de `PRODUCT.md`).
3. Dónde sale el aviso: comando nuevo `ocupacion <sala> <día>` — pendiente: `reservar` aún no crea reservas reales (solo la semanal devuelve un texto fijo), así que no hay momento de reserva donde avisar sin ampliar el alcance. Alternativa: añadirlo a `libres`. Nombre en castellano y orden sala-día, como `cancelar <sala> <día>`.
4. Textos literales: `Norte lun: 3 reservas` (plural), `Norte lun: 1 reserva` (singular), `Norte lun: 0 reservas`; el aviso, debajo y solo con 3 o más: `aviso: Norte muy ocupada el lun (<n> reservas)` con el número real.
5. Entrada inválida: sala desconocida → `sala desconocida: Oeste`; día fuera de `lun mar mie jue vie` → `día desconocido: xyz`; faltan argumentos → `uso: ocupacion <sala> <día>`. Las salas se escriben como en la lista (`Norte`, `Sur`), sin tolerar minúsculas, como hace `cancelar`. Sábado y domingo no se admiten porque la oficina no los usa (supuesto mío).
6. Para probar hace falta crear reservas: exporto `addBooking(room, day, slot)` desde `src/app.js`, solo para tests y sin comando de usuario.
7. Nombres: en código en inglés (`occupancy`, `addBooking`), en interfaz en castellano, como el resto de `src/app.js` y `PRODUCT.md`.
8. Enfoque A (ver Approach); `§Frontend` no aplica, es una CLI sin pantalla.
- Política de modelos (solo en `delegate`): un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

1. **Aceptado** — escenarios sin cómo se monta el estado ni caso de otra sala/día → decisión 6 y escenario «Otra sala u otro día no cuentan».
2. **Aceptado** — falta singular y cero → escenarios «Una reserva», «Cero reservas».
3. **Aceptado** — canceladas y anuladas en un solo escenario → separados en dos.
4. **Aceptado** — falta 4 o más → escenario «El aviso lleva el número real».
5. **Aceptado** — entrada inválida → decisión 5 y escenario «Entrada inválida».
6. **Aceptado** — faltaba «Reglas de la capacidad» → añadida.
7. **Aceptado** — decisiones 6/7 vacías y comando sin decidir → reescritas (3, 6, 7, 8).
8. **Aceptado** — Intent prometía avisar al reservar → Intent rebajado a consultar; el aviso al reservar queda en No entra.
9. **Aceptado** — término «activa» → en Términos resueltos.
10. **Aceptado** — «unitario» → es una prueba de integración por `run`; las salas salen de la lista `rooms` de `src/app.js`.

### Decisiones tomadas con el dev-lead

- Perfil delegate y spec aprobada por delegación (2026-11-19) — «Perfil delegate. Apruebo la spec por delegación, nos vemos en la validación.»

## Intent

Hoy `src/app.js` guarda las reservas en memoria y no ofrece ninguna vista de cuánto se llena una sala. Se quiere poder consultar la ocupación de una sala en un día y que el programa avise cuando está muy ocupada. Éxito: `ocupacion Norte lun` con 3 reservas activas imprime el aviso; con 2, no. Anti-goal: avisar por canceladas o anuladas, o con un número que no sea el real.

## Scope

- Entra: función `occupancy(room, day)`, constante de umbral, comando `ocupacion <sala> <día>`, `addBooking` exportada para tests, tests.
- No entra: avisar en el momento de reservar (cuando `reservar` cree reservas reales: fila nueva en el roadmap), avisos por correo (fila 0008), umbral configurable, persistencia, fines de semana.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "ocupa|0012|room-busy"` (sin coincidencias fuera de esta spec).

## Approach

- A. Función pura `occupancy` que cuenta y un comando `ocupacion` que la formatea — un comando nuevo; se prueba sola.
- B. Ampliar `libres` con el aviso — mezcla dos preguntas distintas y `libres` no recibe día.
- C. Calcular dentro de `run` — no se prueba sin pasar por el despacho.
- Elegido: A — aislada y no cambia los comandos existentes. Lo elijo yo (delegate).

## Dónde se prueba

- Conteo, umbral, plural, entrada inválida: prueba de integración por `run`, en `test/occupancy.test.js`, mismo patrón que `test/cancel.test.js`; el estado se monta con `addBooking`, `cancelBooking` y `voidBooking`. Las salas conocidas salen de `rooms` en `src/app.js`.

## Términos y ADR

- Términos resueltos: **Reserva activa** — la que no está cancelada ni anulada (a añadir a Terminology de `PRODUCT.md` en el cierre).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-busy-warning`

#### ADDED — Aviso al llegar al umbral

- GIVEN la sala Norte con 3 reservas activas el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN imprime `Norte lun: 3 reservas` y debajo `aviso: Norte muy ocupada el lun (3 reservas)`

#### ADDED — El aviso lleva el número real

- GIVEN la sala Norte con 4 reservas activas el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN imprime `Norte lun: 4 reservas` y debajo `aviso: Norte muy ocupada el lun (4 reservas)`

#### ADDED — Sin aviso por debajo del umbral

- GIVEN la sala Norte con 2 reservas activas el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN imprime `Norte lun: 2 reservas` y ningún aviso

#### ADDED — Una reserva

- GIVEN la sala Norte con 1 reserva activa el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN imprime `Norte lun: 1 reserva` y ningún aviso

#### ADDED — Cero reservas

- GIVEN la sala Sur sin reservas el mar
- WHEN se ejecuta `ocupacion Sur mar`
- THEN imprime `Sur mar: 0 reservas` y ningún aviso

#### ADDED — Las canceladas no cuentan

- GIVEN la sala Norte con 2 activas y 1 cancelada el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN imprime `Norte lun: 2 reservas` y ningún aviso

#### ADDED — Las anuladas no cuentan

- GIVEN la sala Norte con 2 activas y 1 anulada el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN imprime `Norte lun: 2 reservas` y ningún aviso

#### ADDED — Otra sala u otro día no cuentan

- GIVEN la sala Norte con 2 reservas activas el lun y 3 el mar, y la sala Sur con 3 el lun
- WHEN se ejecuta `ocupacion Norte lun`
- THEN imprime `Norte lun: 2 reservas` y ningún aviso

#### ADDED — Entrada inválida

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `ocupacion Oeste lun`, `ocupacion Norte xyz` o `ocupacion Norte`
- THEN imprime respectivamente `sala desconocida: Oeste`, `día desconocido: xyz` y `uso: ocupacion <sala> <día>`

#### Reglas de la capacidad — room-busy-warning

- **Dónde viven los datos**: en memoria, en `bookings` de `src/app.js`; sin persistencia.
- **Idioma de los nombres**: interfaz en castellano (`ocupacion`, textos); código en inglés (`occupancy`).
- **Límites**: umbral de aviso = 3 reservas activas, inclusivo, por sala y día.
- **Avisos**: `aviso: <sala> muy ocupada el <día> (<n> reservas)`.
- **Regla ante conflicto**: una reserva cancelada o anulada nunca cuenta; solo cuenta la que tiene estado activo.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación.» |
