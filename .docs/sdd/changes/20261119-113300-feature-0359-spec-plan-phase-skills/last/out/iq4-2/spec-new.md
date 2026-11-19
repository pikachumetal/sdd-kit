---
id: 20261119-183549-feature-0012-aviso-sala-ocupada
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

🦆 Al reservar una sala en un día que ya va cargado, la herramienta te lo dice en la misma respuesta: `reservar Norte lun 15:00-16:00` contesta «reservada Norte lun 15:00-16:00» y, debajo, «aviso: Norte está muy ocupada el lun (4 reservas)». La reserva se hace igual; el aviso solo informa. Por dentro, se cuentan las reservas activas de esa sala ese día.

Validación: dev-lead — es una herramienta que usa una persona desde la terminal y el aviso es texto que ella lee; la frase de delegación no nombra al agente.

## Capacidades

- Nuevas: `room-busy-warning` — reservar una sala con `reservar` y avisar cuando ese día ya tiene muchas reservas activas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva · tamaño: ~40 líneas en 2 ficheros (`src/app.js` y su test)
- Técnica y dominio (sonnet): si los escenarios distinguen el umbral exacto del «o más» (requisito «Aviso al alcanzar el umbral») y si `reservar` tiene comportamiento propio (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar un umbral ambiguo entre «igual a 4» y «4 o más».

Nadie respondió a la entrevista (spec aprobada por delegación): lo que solo el dev-lead puede decidir va marcado «pendiente».

1. **pendiente** — «Muy ocupada» = 4 o más reservas activas de la sala en el mismo día, contando la que se acaba de hacer; el aviso sale en la 4.ª y en las siguientes. Propongo 4 porque nadie dio un número y no hay datos que digan otro.
2. **pendiente** — Dónde avisa: al reservar, en la respuesta del comando. Avisar en un listado queda fuera.
3. **pendiente** — El aviso no bloquea: la reserva se crea igual. Un bloqueo cambiaría lo que el usuario puede hacer y nadie lo pidió.
4. **pendiente** — Texto literal: «aviso: {sala} está muy ocupada el {día} ({n} reservas)», en una línea aparte tras «reservada {sala} {día} {franja}».
5. Cuentan solo las reservas con estado `active`, de la misma sala y el mismo día; la franja no interviene en el conteo. El día es la abreviatura literal (`lun`, `mar`), sin normalizar, como en `findBooking`. Las canceladas y las anuladas no suman, como ya hacen `freeRooms` y `findBooking` en `src/app.js`.
6. Hace falta un comando `reservar {sala} {día} {franja}` simple, que hoy no existe: sin él no hay momento en el que avisar. Crea una reserva activa en memoria. El stub `reservar … --cada-semana` se queda como está y se despacha antes (mismo orden de comprobación que hoy).
7. Sala inexistente, día o franja inválidos y solapes de franja no se validan en esta feature: van a «No entra» — son un comportamiento aparte y nadie lo pidió.
8. Enfoque: A (aviso al reservar), frente a B (bloquear) y C (consulta aparte), ver Approach.
9. Todo en `src/app.js`, el único fichero de entrada (architecture.md), y tests en `test/`. Los identificadores de código existentes (`bookings`, `room`) no se tocan; en prosa y salida, «reserva» y «sala».
- Política de modelos: un revisor de la spec (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

- **Aceptado** (Crítico) — umbral ambiguo entre «=4» y «4 o más» → Intent, decisión 1 y regla «Límites» dicen «4 o más»; escenario nuevo con 5 reservas.
- **Aceptado** (Crítico) — `reservar` sin requisito propio → ADDED «Reservar crea la reserva activa»; las validaciones de entrada van a «No entra» (decisión 7).
- **Aceptado** — faltaban escenarios de que el aviso no bloquea y de otra sala → dos escenarios nuevos.
- **Aceptado** — el escenario de «solo activas del mismo día» mezclaba dos causas → partido en dos.
- **Aceptado** — día y franja sin declarar → decisión 5; convivencia con el stub → decisión 6.
- **Aceptado** — «Dónde viven los datos» → escribe en memoria; la tabla de cambios lista lo que se añade.
- **Rechazado** (Importante, idioma de los identificadores) — PRODUCT.md fija el vocabulario del producto, no los identificadores que ya tiene el código; se dice en la decisión 9.
- **Rechazado** (Menor, parametrizar con el umbral) — el valor es una decisión pendiente; si cambia, cambian los escenarios con ella.
- **Rechazado** (Importante, capacidad aparte `room-booking`) — una sola capacidad: `reservar` existe como soporte del aviso y su nombre cubre ambos.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, 2026-11-19 — «Apruebo la spec por delegación, nos vemos en la validación»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy no hay forma de saber que una sala va muy cargada hasta intentar usarla. Se quiere que quien reserva lo sepa en el momento. Éxito: reservando la 4.ª o siguiente reserva activa de una sala en un día, la respuesta lleva el aviso, y en ningún caso por debajo. Anti-goal: que el aviso salga cuando no toca (canceladas, otro día, otra sala) o que impida reservar.

## Scope

- Entra: el comando `reservar {sala} {día} {franja}`; el aviso cuando la sala llega a 4 o más reservas activas ese día.
- No entra: bloquear reservas; avisos por correo (fila 0008); cambiar `--cada-semana`; configurar el umbral; avisar en `libres`; validar sala, día o franja; solapes.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma; se añade el comando `reservar` simple y un contador | `src/app.js:29` (el stub `--cada-semana` queda como está) | Delta (`ADDED`) |

- Filas que implementa: nada: comprobado con `git grep -niE "ocupad"` fuera de `.docs/sdd/changes` (sin coincidencias).

## Approach

- A. Aviso al reservar — un contador de reservas activas por sala y día y una función `reservar` nueva en `src/app.js`; coste bajo, se prueba con `run`.
- B. Bloquear al llegar al tope — cambia lo que el usuario puede hacer; más intrusivo y nadie lo pidió.
- C. Comando de consulta `ocupacion` — no «avisa»: depende de que alguien pregunte.
- Elegido: A — es lo más cercano a «avisar», no cambia lo que se puede reservar y es lo mínimo.

La reserva nueva se añade a `bookings` antes de contar; el conteo filtra por `status === 'active'`, `room` y `day`.

## Dónde se prueba

- Reservar crea la reserva activa, el aviso (4.ª y 5.ª), la ausencia de aviso (bajo umbral, canceladas, otro día, otra sala) y que no bloquea: `run('reservar', …)` en un test nuevo de `test/`, como los de `test/app.test.js`.
- Gate de cierre: `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-busy-warning`

#### ADDED — Reservar crea la reserva activa

- GIVEN Sur no tiene reservas activas el mar
- WHEN se ejecuta `reservar Sur mar 09:00-10:00`
- THEN responde «reservada Sur mar 09:00-10:00»
- AND `libres 09:00-10:00` ya no lista a Sur

#### ADDED — Aviso al alcanzar el umbral

- GIVEN Norte tiene 3 reservas activas el lun
- WHEN se ejecuta `reservar Norte lun 15:00-16:00`
- THEN responde «reservada Norte lun 15:00-16:00» y, en otra línea, «aviso: Norte está muy ocupada el lun (4 reservas)»

#### ADDED — El aviso sigue por encima del umbral

- GIVEN Norte tiene 4 reservas activas el lun
- WHEN se ejecuta `reservar Norte lun 17:00-18:00`
- THEN responde «reservada Norte lun 17:00-18:00» y, en otra línea, «aviso: Norte está muy ocupada el lun (5 reservas)»

#### ADDED — Sin aviso por debajo del umbral

- GIVEN Norte tiene 1 reserva activa el lun
- WHEN se ejecuta `reservar Norte lun 15:00-16:00`
- THEN responde solo «reservada Norte lun 15:00-16:00»

#### ADDED — Las canceladas no suman

- GIVEN Norte tiene 2 reservas activas y 2 canceladas el lun
- WHEN se ejecuta `reservar Norte lun 15:00-16:00`
- THEN responde solo «reservada Norte lun 15:00-16:00» (3 activas)

#### ADDED — Otro día no suma

- GIVEN Norte tiene 2 reservas activas el lun y 3 el mar
- WHEN se ejecuta `reservar Norte lun 15:00-16:00`
- THEN responde solo «reservada Norte lun 15:00-16:00» (3 activas)

#### ADDED — Otra sala no suma

- GIVEN Sur tiene 4 reservas activas el lun y Norte 1
- WHEN se ejecuta `reservar Norte lun 15:00-16:00`
- THEN responde solo «reservada Norte lun 15:00-16:00»

#### ADDED — El aviso no bloquea

- GIVEN Norte tiene 3 reservas activas el lun
- WHEN se ejecuta `reservar Norte lun 15:00-16:00`
- THEN, además del aviso, la reserva queda activa: `libres 15:00-16:00` no lista a Norte

#### Reglas de la capacidad — room-busy-warning

- **Dónde viven los datos**: las reservas, en memoria (`bookings`); `reservar` añade una; no hay datos nuevos ni persistencia.
- **Idioma de los nombres**: castellano en la salida; «reserva» y «sala» según PRODUCT.md.
- **Límites**: «muy ocupada» = 4 o más reservas activas por sala y día (pendiente).
- **Avisos**: «aviso: {sala} está muy ocupada el {día} ({n} reservas)» (pendiente).
- **Regla ante conflicto**: no aplica (el aviso no bloquea ni compite con otra regla).

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
