---
id: 20261119-183945-feature-0012-aviso-sala-ocupada
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

🦆 Al reservar una sala, si con esa reserva la sala ya tiene 3 o más reservas ese día, el comando lo dice en la misma respuesta: `reservada Norte lun 14:00-16:00 · aviso: Norte muy ocupada el lun (3 reservas)`. La reserva se hace igualmente; el aviso solo informa. Para poder avisar, `reservar <sala> <día> <franja>` pasa a crear una reserva de verdad (hoy solo existe `--cada-semana`, que devuelve un texto fijo).

Validación: dev-lead — es lo que ve una persona en la terminal al reservar; el aviso y su umbral los tiene que juzgar quien usa la herramienta.

## Capacidades

- Nuevas: `room-booking` — reservar una sala y avisar cuando queda muy ocupada ese día.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~50 líneas en 3 ficheros
- Dominio+técnica (sonnet): si el escenario «Aviso de sala muy ocupada» es comprobable con datos y si «Reservar una sala» cambia algo ya existente (señal: capacidad nueva)
- Mínimo razonable: sin review — dejaría sin mirar los escenarios del delta, que son lo que los tests copian

1. Enfoque: aviso al reservar, frente a aviso en `libres` y a un comando `ocupacion` aparte (ver Approach) — es donde la persona puede reaccionar.
2. «Muy ocupada» = 3 o más reservas activas de la misma sala el mismo día (la reserva recién hecha cuenta) — **pendiente**: nadie dio el umbral; 3 de las franjas habituales de un día laboral.
3. Texto del aviso, literal: `aviso: <sala> muy ocupada el <día> (<n> reservas)`, tras ` · ` de la confirmación; `n` ≥ 3, así que siempre plural — **pendiente**.
4. Confirmación de la reserva, literal: `reservada <sala> <día> <franja>` — **pendiente**, nadie la fijó.
5. `reservar <sala> <día> <franja>` se añade como comando real, porque sin reserva individual no hay cuándo avisar — **pendiente**: amplía el alcance desde lo pedido.
6. El aviso no bloquea la reserva ni pide confirmación — **pendiente**: «avisa» se lee como informar.
7. Solo cuentan reservas `active`; las canceladas (`cancelar`) y anuladas (`anular`) no suman. Comprobado leyendo `findBooking` y `freeRooms` de `src/app.js`: ambos filtran por `active`.
8. Dos reservas idénticas (misma sala, día y franja) cuentan por separado — **pendiente**: no hay detección de solapes en este cambio.
9. Con falta de sala, día o franja, `reservar` cae en el texto `salas` como hoy — **pendiente**.
10. Día y franja se aceptan tal cual y se comparan como cadena exacta (`lun`, `10:00-12:00`); sin validación de formato ni de sala existente — **pendiente**.
11. Capacidad nueva `room-booking` (slug en inglés por la regla de capacidades; el texto sigue en castellano) — no existe ninguna en el proyecto; a validar por el dev-lead.
12. Sin `§Frontend`: es una terminal, no hay pantalla que verificar.
13. Se valida en el worktree de la rama, sin entorno aparte.
14. Constante `BUSY_THRESHOLD` y función `activeCount` en `src/app.js`, y los tests de canceladas en `test/cancel.test.js` — decisiones de implementación que sigue el patrón actual del fichero.
15. Delta sobre copia de `.docs/sdd`: `sdd capability merge` aceptó el delta (8 requisitos y 3 reglas, rc=0).
- Política de modelos (solo en `delegate`): revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · hasta `control.maxParallelAgents`.

### Hallazgos de la review

- **Aceptado** — `reservar` sin `--cada-semana` cambia de comportamiento sin capacidad previa → no hay requisito vivo que modificar (`capabilities/` está vacío); queda declarado en «Lo que se retira o cambia de forma», y la capacidad pasa a `room-booking`, que cubre reservar y avisar.
- **Aceptado** — escenario del aviso mezclado → partido en escenarios independientes, cada uno con su GIVEN/WHEN/THEN.
- **Aceptado** — faltaban errores de argumentos → pasan a «No entra» y a la decisión 9.
- **Aceptado** — reservas idénticas → decisión 8.
- **Aceptado** (parcial) — reglas «no aplica» sin motivo → «Dónde viven los datos» declarada: lista `bookings` en memoria (como dice `operations.md`); el resto, «no aplica» con su motivo.
- **Rechazado** — slug con «room» choca con la terminología → es un identificador de capacidad, que la plantilla exige en inglés; el texto del producto sigue en castellano.
- **Aceptado** — afirmación sobre `findBooking` → decisión 7 con la comprobación hecha.
- **Rechazado** — «aprobada» frente a «pendiente» → la aprobación por delegación cubre los pendientes: son los puntos que el dev-lead revisa en la validación.
- **Segunda ronda** — Aceptado: escenarios mezclados partidos en 4 y `Faltan argumentos` añadido (decisión 9); cifra del merge corregida; decisiones de implementación a ✋ (14). Rechazado: forma del registro «sin definir» → ya existe `{room, day, slot, status}` y se cita en «Dónde viven los datos».
- **Aceptado** — días válidos → decisión 9.
- **Aceptado** — tests de canceladas/anuladas → se usan `cancelar` y `anular`, que existen en `src/app.js`.

### Decisiones tomadas con el dev-lead

- Perfil `delegate` y spec aprobada por delegación (2026-11-19) — «Perfil delegate. Apruebo la spec por delegación, nos vemos en la validación.»

## Intent

Hoy `salas` no avisa de nada: la persona descubre que una sala está saturada solo si lista las reservas. Se quiere que quien reserva sepa en el momento que la sala ya va cargada ese día. Éxito: al hacer la reserva que alcanza el umbral, la respuesta lleva el aviso; con menos reservas, no hay aviso. Anti-goal: que el aviso estorbe o bloquee una reserva válida.

## Scope

- Entra: `reservar <sala> <día> <franja>` crea una reserva activa; el aviso cuando la sala llega al umbral ese día; tests.
- No entra: detectar solapes de franja o doble reserva; validar sala, día o franja; umbral configurable; avisar por correo (0008); avisos en `libres` o `cancelar`; `--cada-semana` (sigue igual).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `reservar` sin `--cada-semana` deja de caer en el texto `salas` | `src/app.js:29` (`run`) | Scope: ahora crea reserva; ningún requisito vivo lo recogía |

- Filas que implementa: nada: comprobado con `git grep -niE "reservar|ocupad|0012"` fuera de `changes/`: solo `--cada-semana` (CHANGELOG, `src/app.js`, `test/app.test.js`), que no cambia.

## Approach

- A. Aviso al reservar — el único momento en que la persona puede elegir otra sala; exige crear la reserva individual (función pura `activeCount(room, day)` + rama nueva en `run`).
- B. Marca en `libres` — no toca la reserva, pero `libres` no recibe día y no distingue días; habría que cambiar su firma.
- C. Comando `ocupacion <sala> <día>` — barato, pero la persona tiene que acordarse de preguntar: no «avisa».
- Elegido: A — es el aviso en el momento útil y el cambio queda en `src/app.js`, sin cambiar firmas existentes.

Constante `BUSY_THRESHOLD = 3`; `activeCount` cuenta `bookings` con `status === 'active'` de esa sala y día.

## Dónde se prueba

- Reservar crea la reserva: `test/app.test.js`, por `run('reservar', …)`, como los tests actuales.
- Aviso al llegar al umbral y no antes: `test/app.test.js`, por `run`, con 3 reservas el mismo día.
- Canceladas y anuladas no cuentan: `test/cancel.test.js`, con `cancelar` y `anular`, como los tests de cancelación actuales.
- Otro día u otra sala no cuenta: `test/app.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-booking`

#### ADDED — Reservar una sala

- GIVEN la sala Norte sin reservas el mar
- WHEN `reservar Norte mar 09:00-10:00`
- THEN `reservada Norte mar 09:00-10:00`

#### ADDED — Aviso de sala muy ocupada

- GIVEN Norte con 2 reservas activas el lun
- WHEN `reservar Norte lun 14:00-16:00`
- THEN `reservada Norte lun 14:00-16:00 · aviso: Norte muy ocupada el lun (3 reservas)` y la reserva queda hecha

#### ADDED — Sin aviso bajo el umbral

- GIVEN Norte con 1 reserva activa el lun
- WHEN `reservar Norte lun 14:00-16:00`
- THEN `reservada Norte lun 14:00-16:00`, sin aviso

#### ADDED — Las canceladas no cuentan

- GIVEN Norte con 2 reservas activas y 1 cancelada (`cancelar Norte lun`) el lun
- WHEN `reservar Norte lun 14:00-16:00`
- THEN `reservada Norte lun 14:00-16:00 · aviso: Norte muy ocupada el lun (3 reservas)`

#### ADDED — Las anuladas no cuentan

- GIVEN Norte con 1 reserva activa y 1 anulada (`anular Norte lun`) el lun
- WHEN `reservar Norte lun 14:00-16:00`
- THEN `reservada Norte lun 14:00-16:00`, sin aviso

#### ADDED — Otra sala no cuenta

- GIVEN Norte con 1 reserva activa el lun, y Sur con 2 reservas activas el lun
- WHEN `reservar Norte lun 14:00-16:00`
- THEN `reservada Norte lun 14:00-16:00`, sin aviso

#### ADDED — Otro día no cuenta

- GIVEN Norte con 1 reserva activa el lun y 2 reservas activas el mar
- WHEN `reservar Norte lun 14:00-16:00`
- THEN `reservada Norte lun 14:00-16:00`, sin aviso

#### ADDED — Faltan argumentos

- GIVEN cualquier estado
- WHEN `reservar Norte lun` (falta la franja)
- THEN `salas`, como hoy, y no se crea ninguna reserva

#### Reglas de la capacidad — room-booking

- **Dónde viven los datos**: la lista `bookings` en memoria (`operations.md`: sin base de datos); cada reserva ya es `{room, day, slot, status}`, sin id: `cancelar` y `anular` la buscan por sala y día.
- **Límites**: muy ocupada = 3 o más reservas activas de la sala en el día.
- **Avisos**: `aviso: <sala> muy ocupada el <día> (<n> reservas)`.
- **Idioma de los nombres** / **Regla ante conflicto**: no aplica: los textos ya van en castellano y el cambio no introduce conflicto entre reglas.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada: «Apruebo la spec por delegación, nos vemos en la validación.» |

