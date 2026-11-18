---
id: 20261118-231858-feature-0012-reservas-sala
feature: 0012
title: Comando reservas <sala> para repasar la agenda
mode: full
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Comando `reservas <sala>`

Validación: dev-lead — es lo que usa una persona cada mañana: hay que ver la salida real en la terminal.

## Capacidades

- Nuevas: `room-bookings` — consulta de las reservas activas de una sala.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva · tamaño: ~25 líneas en 3 ficheros (`src/app.js`, un test, la capacidad)
- Dominio (sonnet): si «activa» excluye de verdad canceladas y anuladas (`status` `cancelled` / `voided`, los dos términos de PRODUCT.md) y si el orden y el literal `sin reservas <sala>` quedan sin ambigüedad (señal: capacidad nueva)
- Mínimo razonable: el mismo revisor sin segunda ronda — dejaría sin mirar si los escenarios del orden y de las inactivas distinguen de verdad la implementación correcta

1. Capacidad nueva `room-bookings` (slug inglés kebab-case; no existía ninguna) — el comando es un sustantivo del dominio que otras features (0010, 0011) tocarán.
2. Enfoque: función exportada `listBookings(room)` + una rama en `run`, frente a filtrar dentro de `run` y frente a un módulo nuevo (ver Approach).
3. Orden de las líneas: por día de la semana (`lun mar mié jue vie sáb dom`) y, dentro del día, por hora de inicio de la franja (`HH:MM`, con cero a la izquierda, comparada como texto); nadie lo dijo y el responsable lee la agenda de arriba abajo.
4. Cada línea no lleva el nombre de quien reserva: el formato `<día> <franja>` es tuyo, la ausencia de nombre la decidí yo porque el ejemplo no lo trae.
5. Sala desconocida (`reservas Oeste`): responde `sin reservas Oeste`, igual que una sala sin reservas; no valida que la sala exista: en `src/app.js` la lista de salas (`Norte`, `Sur`) solo la usa `libres`, y `cancelar` y `anular` tampoco la consultan.
6. El nombre de sala se compara exacto, con mayúsculas (`Norte`, no `norte`), como el resto de comandos.
7. Sin sala (`reservas`): responde `falta la sala: reservas <sala>`. `reservas` no existe hoy (cualquier comando desconocido cae en `salas`), así que no cambia nada existente; sin esta regla, `reservas` sin sala daría `sin reservas undefined`. El literal es mío, a validar.
8. «Activa» = la reserva con `status: 'active'`; canceladas (`cancelled`) y anuladas (`voided`) no salen, y si todas lo están responde `sin reservas <sala>`.
9. Validación: dev-lead — lo usa una persona; no pedí la validación por agente.
10. Pruebas solo a través de `run`: `listBookings` se prueba por el comando, sin test directo de la función exportada.
11. Duplicados: si hubiera dos reservas activas idénticas (misma sala, día y franja) se listan las dos, sin deduplicar; hoy nada las crea, y ocultar una engañaría a quien revisa la agenda.
12. Ficheros y parámetros: el test va en `test/reservas.test.js`; «sin sala» es `params[0]` ausente (una cadena vacía se trata como una sala sin reservas); la franja se guarda ya con `HH:MM` de dos cifras, como en `bookings` de `src/app.js`.

Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` acepta el delta y crea `capabilities/room-bookings.md` (repetido tras la última edición, rc=0); `git grep` de `0012` y `reservas` no encuentra nada que se retire o cambie de forma.

### Hallazgos de la review

- **Aceptado** — orden de franja sin criterio y sin dato que lo distinga → criterio en decisión 3 y escenario con datos sembrados en orden inverso.
- **Aceptado** — requisito «sala sin reservas» mezclaba tres comportamientos → «Comando sin sala» pasa a requisito propio.
- **Aceptado** — el escenario de canceladas/anuladas no tenía ninguna activa → ahora mezcla una activa y hay otro escenario con todas inactivas.
- **Aceptado** — «como `cancelar` y `anular`» sin fuente → decisión 5 cita `src/app.js`.
- **Aceptado** — `reservas` sin sala parecía cambiar un comando existente → decisión 7 aclara que no existe hoy; el literal queda a validar.
- **Aceptado** — decisión 4 mezclaba lo dicho por ti con lo mío → reescrita.
- **Aceptado** — reglas «no aplica» incorrectas → datos en memoria y sin tope declarados.
- **Aceptado** — Approach prometía probar `listBookings` sola → decisión 11 y «Dónde se prueba» solo por `run`.
- **Rechazado** — nombres `room-bookings`/`listBookings` chocan con _Evitar_ → el slug en inglés lo exige la plantilla de capacidades y `listBookings` sigue a `cancelBooking`/`voidBooking` del código; el texto de cara a la persona va en castellano.
- **Aceptado (2.ª ronda)** — el orden no distinguía día de hora → escenario con horas cruzadas entre días y con `sáb`/`dom`.
- **Aceptado (2.ª ronda)** — el caso «todas inactivas» no tenía GIVEN propio → escenario propio; «sala desconocida» también separada.
- **Aceptado (2.ª ronda)** — numeración de decisiones rota y repaso de coherencia dentro de la lista → renumerada y movido a un párrafo.
- **Aceptado (2.ª ronda)** — duplicados sin regla → decisión 11 y escenario.
- **Aceptado en parte (2.ª ronda)** — decisiones implícitas de fichero y parámetros → decisión 12; el aprobador `TBD` es el de la plantilla hasta aprobar.
- **Rechazado (2.ª ronda)** — `bookings` sin verificar → es la lista existente de `src/app.js` (leída); el rechazo de los nombres en inglés sigue en pie. Merge ya verificado: crea el fichero con las cinco reglas.
- **Aceptado (parcial)** — el «mínimo» y el revisor «sonnet» parecían contradecirse → no lo hacen: el mínimo es el nivel defendible más bajo, pero la regla pide siempre al menos un revisor, y se despachó con segunda ronda.
- Política de modelos: un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Salida: una reserva por línea como `lun 10:00-12:00`, y `sin reservas <sala>` si no hay — «una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`»
- Solo reservas activas — «lista las reservas activas de la sala»

## Intent

Hoy no hay forma de ver las reservas de una sala: `libres` solo dice qué salas están libres en una franja. El responsable de sala quiere repasar su agenda cada mañana con un solo comando. Éxito: `reservas Norte` imprime `lun 10:00-12:00` (la reserva activa de Norte) y `reservas Sur` imprime `sin reservas Sur`. Anti-objetivo: que una reserva cancelada o anulada aparezca y haga creer que la sala está ocupada.

## Scope

- Entra: comando `reservas <sala>` en `src/app.js` y su test en `test/reservas.test.js`; la capacidad `room-bookings`.
- No entra: filtrar por día o por fecha, enseñar quién reservó, listar las canceladas o anuladas, validar la existencia de la sala, mayúsculas/minúsculas flexibles.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0012 → ningún fichero la nombra | nada: comprobado con `git grep -nE "0012"` (sin resultados antes de esta spec)

## Approach

- A. Función exportada `listBookings(room)` + rama en `run` — una función pura de unas 8 líneas, como `cancelBooking` y `voidBooking`; coste: ordenar exige una lista de días.
- B. Filtrar y formatear dentro de `run` — menos líneas, pero `run` ya mezcla comandos y esto lo haría más largo y menos testeable de forma aislada.
- C. Módulo nuevo `src/agenda.js` — rompe la estructura de «un solo fichero de entrada» de `architecture.md` por una función de 8 líneas.
- Elegido: A — sigue el patrón de `cancelBooking`/`voidBooking` y respeta `architecture.md`.

`listBookings(room)` devuelve las líneas `<day> <slot>` de las reservas con `room` igual y `status === 'active'`, ordenadas por `['lun','mar','mié','jue','vie','sáb','dom']` y luego por franja, unidas con `\n`; sin ninguna, `sin reservas <room>`. En `run`, `reservas` con `params[0]` ausente devuelve `falta la sala: reservas <sala>`.

## Dónde se prueba

- Listado, orden, vacío, canceladas/anuladas fuera, sala desconocida y sin sala: unitarios sobre `run`, en `test/reservas.test.js`, como los de `test/cancel.test.js`; el orden con reservas sembradas en orden inverso.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `room-bookings`

#### ADDED — Listar las reservas activas de una sala

- GIVEN Norte tiene una reserva activa `lun 10:00-12:00`
- WHEN se ejecuta `reservas Norte`
- THEN imprime `lun 10:00-12:00`

#### ADDED — Orden de las reservas listadas

- GIVEN Norte tiene activas, guardadas en este orden: `dom 08:00-09:00`, `mar 08:00-09:00`, `lun 10:00-12:00`, `lun 08:00-09:00`, `sáb 09:00-10:00`
- WHEN se ejecuta `reservas Norte`
- THEN imprime cinco líneas, en este orden: `lun 08:00-09:00`, `lun 10:00-12:00`, `mar 08:00-09:00`, `sáb 09:00-10:00`, `dom 08:00-09:00`

#### ADDED — Sala sin reservas activas

- GIVEN Sur no tiene reservas
- WHEN se ejecuta `reservas Sur`
- THEN imprime `sin reservas Sur`

#### ADDED — Sala desconocida

- GIVEN `Oeste` no es una sala (ni tiene reservas)
- WHEN se ejecuta `reservas Oeste`
- THEN imprime `sin reservas Oeste`

#### ADDED — Reservas activas idénticas

- GIVEN Norte tiene dos reservas activas `lun 10:00-12:00`
- WHEN se ejecuta `reservas Norte`
- THEN imprime `lun 10:00-12:00` dos veces, una por línea

#### ADDED — Comando sin sala

- GIVEN cualquier estado de reservas
- WHEN se ejecuta `reservas` sin sala
- THEN imprime `falta la sala: reservas <sala>`

#### ADDED — Las reservas canceladas o anuladas no salen

- GIVEN Norte tiene `lun 10:00-12:00` cancelada, `mar 09:00-10:00` anulada y `mié 09:00-10:00` activa
- WHEN se ejecuta `reservas Norte`
- THEN imprime solo `mié 09:00-10:00`

#### ADDED — Sala con todas las reservas inactivas

- GIVEN Norte tiene `lun 10:00-12:00` cancelada y `mar 09:00-10:00` anulada, y ninguna activa
- WHEN se ejecuta `reservas Norte`
- THEN imprime `sin reservas Norte`

#### Reglas de la capacidad — room-bookings

- **Dónde viven los datos**: en memoria, en la lista `bookings` existente; el comando no guarda nada
- **Idioma de los nombres**: no aplica (castellano, constitution art. 4)
- **Límites**: sin tope: se listan todas las reservas activas de la sala
- **Avisos**: `sin reservas <sala>` · `falta la sala: reservas <sala>`
- **Regla ante conflicto**: dos reservas activas idénticas se listan las dos, sin deduplicar

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
