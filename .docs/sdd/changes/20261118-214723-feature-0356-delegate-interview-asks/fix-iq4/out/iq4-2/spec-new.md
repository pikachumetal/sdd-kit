---
id: 20261118-232645-feature-0012-aviso-sala-ocupada
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

🦆 Hoy no hay forma de ver qué salas se están llenando. Con esto, `node src/app.js ocupacion lun` escribe una línea por cada sala con 3 o más reservas ese día, p. ej. `aviso: Norte muy ocupada el lun (3 reservas)`, o `sin salas muy ocupadas el lun` si ninguna llega. Por dentro, una función pura cuenta las reservas activas por sala y día, y el comando la imprime.

Validación: dev-lead — es una salida que lee una persona en la terminal.

## Capacidades

- Nuevas: `room-occupancy` — cuándo una sala cuenta como muy ocupada y cómo se avisa.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~40 líneas en 3 ficheros (`src/app.js`, un test, README)
- Dominio (sonnet): si el umbral de 3 reservas activas y el texto del aviso son coherentes entre Intent, THENs y Dónde se prueba, y si cancelada y anulada se excluyen cada una en su escenario (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que una reserva cancelada o anulada cuente por error

1. **Qué es «muy ocupada»**: una sala con 3 o más reservas activas en un mismo día — *pendiente*: nadie dijo el umbral; lo he fijado yo y es una constante fácil de cambiar.
2. **Cómo se avisa**: un comando nuevo `ocupacion <día>`. Hoy `reservar` solo es un stub (`--cada-semana`), no hay flujo de reserva donde colgar un aviso en el momento de reservar — *pendiente*: si prefieres el aviso al reservar o dentro de `libres`, es un cambio de spec.
3. **Textos**: con avisos, una línea por sala en el orden de `rooms`: `aviso: <Sala> muy ocupada el <día> (<n> reservas)`. Sin avisos: `sin salas muy ocupadas el <día>`. Sin argumento de día: `uso: ocupacion <día>`.
4. **Solo cuentan las reservas activas**: las canceladas y las anuladas no suman (los dos términos del glosario).
5. **Enfoque**: A (elegido), frente a B y C (ver Approach).
6. **Capacidad nueva** `room-occupancy` (kebab-case en inglés, regla del kit).
7. **Reglas de la capacidad**: límites = umbral 3; avisos = los textos de 3; datos = en memoria, como el resto; idioma = castellano; conflicto = no aplica.
8. **Repaso de coherencia**: `git grep` de `ocupacion`, `ocupada` y `0012` fuera de la carpeta del cambio, sin hallazgos; delta probado en una copia de `.docs/sdd` con `sdd capability merge`: 9 requisitos y 5 reglas añadidos a `room-occupancy.md`, sin rechazos.
9. **Días válidos**: `lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom` (los de los datos actuales, sin tilde). Otro valor: `día no válido: <valor>`, para no dar un «sin salas muy ocupadas» falso — *pendiente*.
10. **`bookings` se exporta** para que el test del comando siembre reservas y las restaure al acabar.
11. **No hay `§Frontend`**: es una CLI sin pantalla.

### Hallazgos de la review

- **Aceptado** — nada fija `(<n> reservas)` más allá de 3 → escenario con 4 reservas.
- **Aceptado** — el orden de salas no tenía escenario → escenario con Norte y Sur.
- **Aceptado** — canceladas y anuladas iban juntas → dos escenarios.
- **Aceptado** — un día mal escrito daba un falso «sin salas muy ocupadas» → decisión 9 y escenario.
- **Aceptado** — cómo siembra datos el test del comando → decisión 10 y Approach.
- **Aceptado** — la review prometía más cobertura de la que tenía → texto ajustado.
- **Rechazado** — «no aplica» sin razón → una reserva tiene un solo estado; añadido al texto.
- **Aceptado** — línea del README sin test → dicho en el Scope que es documentación y el gate no la comprueba.
- **Rechazado** — pendiente contradice la aprobación → *pendiente* marca valores que el dev-lead no dijo, no una spec sin aprobar.
- **Rechazado** — «falta PRODUCT.md» → existe en la raíz del repo; el revisor miró la ruta equivocada.

- Política de modelos: un revisor de la spec (sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación el 2026-11-19 — «Apruebo la spec por delegación, nos vemos en la validación»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy `salas` no dice qué sala se está llenando; hay que mirar las reservas a ojo. Se quiere un aviso cuando una sala está muy ocupada en un día. Éxito: `ocupacion lun` con 3 reservas activas de Norte ese lunes dice `aviso: Norte muy ocupada el lun (3 reservas)`. Anti-objetivo: avisar de una sala que no lo está, por contar reservas canceladas o anuladas.

## Scope

- Entra: función `busyRooms(day, list)`, exportar `bookings` y comando `ocupacion <día>` en `src/app.js`; validación del día; tests; una línea en el README (documentación, sin test: no la comprueba el gate).
- No entra: avisar al reservar o en `libres`; umbral configurable; avisos por correo (fila 0008); franjas dentro del día.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira | `git grep -n "ocupacion\|ocupada" -- . ':!.docs/sdd/changes'` sin hallazgos de código | — |

- Filas que implementa: nada (la 0012 se reservó para esta feature; sin fila en `ROADMAP.md`) → comprobado con `git grep -n 0012`.

## Approach

- A — función pura `busyRooms(day, list = bookings)` + comando `ocupacion`: se prueba sola con listas propias; el coste es un comando nuevo.
- B — comprobar al reservar: no hay flujo de reserva real (`reservar` es un stub), no se puede probar ni usar.
- C — umbral configurable por argumento o entorno: añade superficie que nadie pidió.
- Elegido: A — es lo único medible hoy y no toca el stub de `reservar`.

Umbral: constante `BUSY_THRESHOLD = 3`. `bookings` se exporta; la función admite la lista como segundo parámetro, por defecto `bookings`. El test del comando mete reservas en `bookings` y las quita al acabar. Una reserva tiene un solo estado (`active`, `cancelled` o `voided`), por eso no hay conflicto que resolver.

## Dónde se prueba

- Umbral y exclusión de canceladas/anuladas: unitario de `busyRooms` con listas propias, en `test/occupancy.test.js`.
- Textos del comando, orden de salas y día no válido: por `run('ocupacion', [día])`, como los tests de `cancelar`, sembrando `bookings`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-occupancy`

#### ADDED — Una sala con 3 o más reservas activas en un día está muy ocupada

- GIVEN Norte con reservas activas el lun a 08:00-09:00, 10:00-11:00 y 14:00-15:00, y Sur con una
- WHEN `ocupacion lun`
- THEN sale `aviso: Norte muy ocupada el lun (3 reservas)` y no sale línea de Sur

#### ADDED — El aviso cuenta las reservas que hay

- GIVEN Norte con 4 reservas activas el lun
- WHEN `ocupacion lun`
- THEN sale `aviso: Norte muy ocupada el lun (4 reservas)`

#### ADDED — Varias salas avisan en el orden de las salas

- GIVEN Sur con 3 reservas activas el vie y Norte con 3 el vie
- WHEN `ocupacion vie`
- THEN salen dos líneas, primero `aviso: Norte muy ocupada el vie (3 reservas)` y después `aviso: Sur muy ocupada el vie (3 reservas)`

#### ADDED — Con 2 reservas activas no hay aviso

- GIVEN Norte con 2 reservas activas el mar
- WHEN `ocupacion mar`
- THEN sale `sin salas muy ocupadas el mar`

#### ADDED — Las reservas canceladas no cuentan

- GIVEN Norte con 2 reservas activas y 1 cancelada el lun
- WHEN `ocupacion lun`
- THEN sale `sin salas muy ocupadas el lun`

#### ADDED — Las reservas anuladas no cuentan

- GIVEN Norte con 2 reservas activas y 1 anulada el lun
- WHEN `ocupacion lun`
- THEN sale `sin salas muy ocupadas el lun`

#### ADDED — El aviso es por día

- GIVEN Norte con 2 reservas activas el lun y 2 el mar
- WHEN `ocupacion lun`
- THEN sale `sin salas muy ocupadas el lun`

#### ADDED — Falta el día

- GIVEN cualquier estado
- WHEN `ocupacion` sin argumento
- THEN sale `uso: ocupacion <día>`

#### ADDED — Un día no válido se rechaza

- GIVEN cualquier estado
- WHEN `ocupacion xyz`
- THEN sale `día no válido: xyz`

#### Reglas de la capacidad — room-occupancy

- **Dónde viven los datos**: en memoria, como las reservas actuales
- **Idioma de los nombres**: castellano
- **Límites**: muy ocupada = 3 o más reservas activas de una sala en el mismo día
- **Avisos**: `aviso: <Sala> muy ocupada el <día> (<n> reservas)` · `sin salas muy ocupadas el <día>` · `uso: ocupacion <día>` · `día no válido: <valor>`
- **Regla ante conflicto**: no aplica (una reserva tiene un solo estado)

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-19 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
