---
id: 20261118-162759-feature-0040-cancel-cutoff
feature: 0040
title: Una reserva de hoy ya no se cancela
mode: full
status: draft
created: 2026-11-18
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Una reserva de hoy ya no se cancela

🦆 Hasta ahora `cancelar Norte lun` cancelaba la reserva siempre. Desde ahora, si hoy es lunes, responde «ya no se puede cancelar Norte lun» y la reserva sigue activa; si hoy es domingo, la cancela como siempre y responde «cancelada Norte lun». Por dentro, `cancelar` pasa a saber qué día es hoy (el reloj, que los tests pueden fijar) y compara con el día de la reserva.

Validación: dev-lead — lo usa una persona desde la terminal y la regla es de negocio.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva y cuándo deja de poder cancelarse.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — el dev-lead dijo «Sin review» (ver abajo). Señales: capacidad nueva, comportamiento visible de un camino crítico A · tamaño: ~10 líneas de código y 4 tests en 4 ficheros.
- Mínimo razonable (el que habría propuesto): un revisor con los siete puntos — deja sin mirar que el reloj inyectado no cambie el contrato de `run` ni los tests del camino crítico.

1. **Capacidad nueva `booking-cancellation`** (slug en inglés, contenido en castellano): no existe ninguna en `capabilities/` y la cancelación es un sustantivo del dominio. Alternativa: no crear capacidad y dejar la regla solo en la spec. — pendiente de tu visto bueno al slug.
2. **Enfoque: A, el día de hoy como tercer parámetro opcional de `run` y `cancelBooking`**, frente a B y C (ver Approach).
3. **Qué es «hoy»**: el día de la semana del reloj del sistema, con las mismas abreviaturas que usan las reservas: `dom lun mar mie jue vie sab` (sin tilde en `mie`: ningún comando ni test usa aún ese día).
4. **«Días posteriores»**: cualquier día distinto de hoy se cancela como hoy. Una reserva de un día que en la semana cae antes de hoy (hoy `mie`, reserva `lun`) se entiende como la del lunes siguiente y se cancela. Las reservas no tienen fecha, solo día de la semana, así que no hay «ayer».
5. **Orden de las respuestas**: si no hay reserva activa ese día, gana «sin reserva Norte lun», también si es hoy; «ya no se puede cancelar» solo sale con una reserva activa de hoy.
6. **Texto exacto**: `ya no se puede cancelar Norte lun` (sin mayúscula inicial ni punto, como el resto de respuestas: `cancelada Norte lun`, `sin reserva Sur mar`).
7. **La reserva de hoy no cambia de estado**: sigue `active` (cuenta en `libres`).
8. **`anular` queda fuera**: la anulación del responsable de sala sigue funcionando también hoy. Tampoco entra `reservar --cada-semana`.
9. **Camino crítico (A) «cancelar una reserva»**: la fila de `critical-path.md` no cambia (mismo test, mismo nombre, mismo literal esperado), pero el test pasa a fijar `hoy = dom` para no depender del día en que se ejecute: sin eso fallaría cada lunes. El test del cierre de hoy es un test nuevo de la feature y no entra en la tabla del camino crítico (lo corre `--extras`).
10. **`PRODUCT.md`: «Cancelación: … antes de 24 h»** contradice esta regla (a las 23:00 del domingo faltan 11 h para el lunes y ahora se puede; con «24 h» no). Propongo reescribirlo a «la reserva que anula el propio cliente hasta el día anterior» — pendiente: es un término del glosario, valida el texto.
11. **Sin review**: no se despacha ningún revisor, por orden del dev-lead.
12. **Delta probado en una copia** de `.docs/sdd`: `sdd capability merge` → «booking-cancellation.md: añadido» ×3 (los tres requisitos), sin rechazos; `capabilities/` del repo intacto.
13. **Se valida a mano**: ejecuto `node src/app.js cancelar Norte <hoy>` y con un día distinto; no necesita entorno ni acceso.

### Decisiones tomadas con el dev-lead

- Una reserva de hoy ya no se cancela — «una reserva de hoy ya no se cancela»
- Respuesta literal `ya no se puede cancelar Norte lun` siendo lunes — «`cancelar Norte lun`, siendo lunes, responde «ya no se puede cancelar Norte lun»»
- Las de días posteriores se cancelan como hoy — «las de días posteriores se cancelan como hoy»
- Sin review — «Sin review»

## Intent

Hoy un cliente puede cancelar la reserva de una sala el mismo día en que la usa, dejando la sala vacía sin tiempo de reasignarla. El dev-lead decidió que, a partir de ese día, la reserva ya no se cancela. Éxito: con hoy = lunes, `cancelar Norte lun` responde `ya no se puede cancelar Norte lun` y la reserva sigue activa; con cualquier otro día, todo sigue igual. Fracasaría si dejara de poder cancelarse una reserva de otro día, o si los tests dependieran del día de la semana en que se ejecutan.

## Scope

- Entra: `cancelBooking` y `run('cancelar', …)` en `src/app.js` rechazan la reserva activa de hoy con `ya no se puede cancelar <sala> <día>`.
- Entra: el día de hoy se pasa como parámetro opcional (por defecto el del reloj) para que los tests lo fijen.
- Entra: `test/cancel.test.js` y `test/booking.unit.test.js` fijan hoy; tests nuevos del cierre de hoy.
- Entra: texto de «Cancelación» en `PRODUCT.md` (decisión 10).
- Entra: la capacidad `booking-cancellation` (la crea el cierre).
- No entra: `anular`, `reservar`, `libres`; fechas reales en las reservas; hora de corte dentro del día; avisar por otro canal.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «cancelar» siempre cancela una reserva activa | `src/app.js:13-18` (`cancelBooking`), `src/app.js:30` (`run`) | Scope · delta, `ADDED` (no hay capacidad previa) |
| Tests que cancelan `Norte lun` sin fijar hoy | `test/cancel.test.js:6`, `test/booking.unit.test.js:6` | Scope · decisión 9: pasan a fijar hoy |
| «antes de 24 h» | `PRODUCT.md:13` | Scope · decisión 10 |
| Camino crítico «cancelar una reserva» | `.docs/sdd/steering/critical-path.md:5` | Sin cambio: mismo test y nombre (decisión 9) |

- Filas que implementa: ninguna: comprobado con `git grep -n "0040" -- . ':!.docs/sdd/changes'` (sin resultados en `ROADMAP.md`; la 0040 no tiene fila).

## Approach

- **A. `hoy` como parámetro opcional**: `run(cmd, params, hoy = diaDeHoy())` y `cancelBooking(room, day, hoy = diaDeHoy())`. Cuesta un parámetro; los tests lo fijan sin tocar el entorno, y el uso real no cambia.
- B. Variable de entorno `SALAS_HOY`: no cambia las firmas, pero es estado global que los tests tendrían que poner y quitar, y un valor olvidado en el servidor desactivaría la regla.
- C. Fechas reales (ISO) en las reservas: sería lo correcto con reservas con fecha, pero hoy solo hay día de la semana; es otra feature.
- Elegido: A — la costura más pequeña y sin estado global.

`diaDeHoy()` devuelve `['dom','lun','mar','mie','jue','vie','sab'][new Date().getDay()]`. En `cancelBooking`, tras `findBooking` (decisión 5): `if (day === hoy) return \`ya no se puede cancelar ${room} ${day}\``.

## Dónde se prueba

- Cancelar hoy / otro día / sin reserva: por `run('cancelar', …, hoy)`, como `cancel.test.js`.
- `cancelBooking` con hoy fijado: unitario, como `booking.unit.test.js`.
- A mano, tras los tests: `node src/app.js cancelar Norte lun` en lunes y en otro día.

## Términos y ADR

- Términos resueltos: Cancelación — hasta el día anterior a la reserva; el mismo día ya no (decisión 10, pendiente).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Una reserva de otro día se cancela

- GIVEN hoy es domingo y Norte tiene una reserva activa el lunes
- WHEN `cancelar Norte lun`
- THEN responde `cancelada Norte lun` y la reserva deja de estar activa
- AND con hoy miércoles, la reserva del lunes (la del lunes siguiente) también se cancela

#### ADDED — Una reserva de hoy no se cancela

- GIVEN hoy es lunes y Norte tiene una reserva activa el lunes
- WHEN `cancelar Norte lun`
- THEN responde `ya no se puede cancelar Norte lun`
- AND la reserva sigue activa (`libres` no ofrece Norte en su franja)

#### ADDED — Cancelar sin reserva activa lo dice

- GIVEN hoy es lunes y Sur no tiene reserva activa el martes ni el lunes
- WHEN `cancelar Sur mar`, o `cancelar Sur lun`
- THEN responde `sin reserva Sur mar`, o `sin reserva Sur lun` (también si es hoy)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
