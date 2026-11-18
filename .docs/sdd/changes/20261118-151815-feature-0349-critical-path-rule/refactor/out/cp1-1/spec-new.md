---
id: 20261118-163415-feature-0040-cancel-cutoff
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

🦆 Hoy, si es lunes y escribes `cancelar Norte lun`, la reserva se cancela. Con este cambio responde «ya no se puede cancelar Norte lun» y la reserva sigue en pie. Las reservas de otros días, como `cancelar Norte mar`, se cancelan igual que antes. Para saber qué día es hoy, el programa mira el reloj; en los tests se le dice el día a mano para que no dependan de cuándo se ejecutan.

Validación: dev-lead — cambia lo que ve quien cancela (un mensaje nuevo y una cancelación que ya no ocurre).

## Capacidades

- Nuevas: `booking-cancellation` — cuándo se puede cancelar una reserva y qué responde el programa en cada caso.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna — la pidió así el dev-lead («Sin review»); el nivel que daba la rúbrica (un revisor: ~40 líneas, sin contrato público ni `MODIFIED`) queda sin aplicar y deja sin mirar si el delta casa con lo que el cliente espera de «hoy».

1. Capacidad nueva `booking-cancellation` (inglés, kebab-case): el proyecto no tiene `capabilities/` y el comportamiento observable necesita su delta; lo mínimo que la abre es esta regla y sus dos vecinas (día posterior, sin reserva). Si prefieres no abrir capacidades todavía, dímelo y el delta se queda solo en los THEN de esta spec.
2. Enfoque: inyectar el día de hoy como parámetro opcional, frente a simular el reloj en los tests o a leerlo de una variable de entorno (ver Approach).
3. «Hoy» es el día de la semana del reloj del equipo, con los nombres `dom lun mar mié jue vie sáb` (los días de las reservas ya son nombres de día sin fecha: `lun`, `mar`). El acento de `mié` y `sáb` es mío.
4. Solo se bloquea el día igual al de hoy. Un nombre de día anterior al de hoy (hoy `mié`, `cancelar Norte lun`) se cancela como hasta ahora: sin fecha, no se puede saber si esa reserva es de esta semana o de la próxima. Nadie lo dijo; el dev-lead dijo «las de días posteriores se cancelan como hoy».
5. Si no hay reserva activa, manda el mensaje de siempre, también para hoy: `cancelar Sur lun` (hoy lunes, sin reserva) → `sin reserva Sur lun`; «ya no se puede cancelar» solo sale cuando hay una reserva que se bloquea.
6. Texto literal del dev-lead: `ya no se puede cancelar Norte lun`, con `<sala> <día>` en el lugar de los datos (`ya no se puede cancelar Sur mar` para otra sala y día).
7. `PRODUCT.md` define Cancelación como «la reserva que anula el propio cliente antes de 24 h»: con la regla nueva deja de ser cierto (mañana a las 09:00 se cancela hoy a las 20:00; una reserva de hoy a las 23:00 no se cancela a las 09:00). Propongo escribir «antes del día de la reserva». Si el «24 h» era otra regla que quieres conservar, dímelo antes de aprobar.
8. Camino crítico: la fila `cli · cancelar una reserva · A` conserva su test, `cancel.test.js › cancelar una reserva activa`, pero ese test cancela `Norte lun` y el lunes dejaría de dar verde: la tarea lo cambia para fijar el día de hoy en `dom`. No cambia el id del test ni hace falta editar `critical-path.md`. No propongo fila nueva: el test de «hoy no se cancela» lo ve el nivel unitario (criterio A/B/C no aplica por ahora) y no hace falta uno de la suite `cli`.
9. Delta probado en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` sale con 0 y crea `booking-cancellation.md` con los 4 requisitos añadidos. Coherencia: `git grep "24 h"` solo da `PRODUCT.md:13` (decisión 7).
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Una reserva de hoy ya no se cancela — «una reserva de hoy ya no se cancela»
- Mensaje literal para hoy — «`cancelar Norte lun`, siendo lunes, responde «ya no se puede cancelar Norte lun»»
- Días posteriores sin cambio — «las de días posteriores se cancelan como hoy»
- Sin review — «Sin review»

## Intent

Hoy cualquier reserva activa se cancela con `cancelar <sala> <día>`, también la del propio día. La regla nueva cierra la cancelación el mismo día de la reserva. Éxito: `cancelar Norte lun` en lunes responde «ya no se puede cancelar Norte lun» y la reserva sigue activa; `cancelar Norte mar` en lunes se cancela. Fracaso aunque funcione: que el resultado dependa del día en que se ejecuten los tests, o que `libres` deje de ver la reserva de hoy.

## Scope

- Entra: `cancelBooking` rechaza una reserva activa cuyo día es el de hoy; `run` pasa el día de hoy; los dos tests que cancelan `Norte lun` (`test/cancel.test.js`, `test/booking.unit.test.js`) fijan el día; `PRODUCT.md`, definición de Cancelación.
- No entra: `anular` (`voidBooking`: el responsable de sala sigue anulando también las de hoy; la regla es de la cancelación del cliente); horas (la regla es por día entero, sin mirar la franja); fechas reales; el `CHANGELOG.md` (lo escribe el cierre de la release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «antes de 24 h» en la definición de Cancelación | `PRODUCT.md:13` | decisión 7 |
| `cancelar` de una reserva de hoy: de `cancelada <sala> <día>` a `ya no se puede cancelar <sala> <día>` | `src/app.js` (`cancelBooking`) | delta, `ADDED — Una reserva de hoy no se cancela` |
| Test que cancela `Norte lun` sin fijar el día | `test/cancel.test.js:5`, `test/booking.unit.test.js:5` | Scope; decisión 8 |
| Fila crítica `cancelar una reserva` | `.docs/sdd/steering/critical-path.md:5` | decisión 8: sin cambio, el id del test se conserva |

- Filas que implementa: nada: comprobado con `git grep -n "0040" -- ROADMAP.md .docs` (el id 0040 no tiene fila; la rama lo reservó con `sdd id claim`).

## Approach

- A. `hoy` como parámetro opcional (`cancelBooking(room, day, today = todayName())` y `run(cmd, params, today)`) — cambia dos firmas, sin dependencias; los tests pasan el día y no dependen del reloj.
- B. Simular el reloj en los tests (`mock.timers` de `node:test` sobre `Date`) — la firma no cambia, pero cada test que cancela necesita su montaje y el unitario deja de ser puro.
- C. Variable de entorno `SALAS_HOY` — también determinista, pero abre una configuración que nadie ha pedido y el programa la leería en producción.
- Elegido: A — es el patrón mínimo del proyecto (funciones puras sobre un estado en memoria, Node sin dependencias) y deja el test unitario puro.

`todayName()` devuelve `['dom','lun','mar','mié','jue','vie','sáb'][new Date().getDay()]`. `cancelBooking` busca la reserva activa como hoy; si existe y `booking.day === today`, devuelve `ya no se puede cancelar <sala> <día>` sin tocar su estado.

## Dónde se prueba

- Una reserva de hoy no se cancela (texto y reserva intacta): unitario, `booking.unit.test.js`, con `cancelBooking('Norte', 'lun', 'lun')`, y comprobando que `libres` sigue sin dar Norte en `10:00-12:00`.
- Cancelar un día posterior o anterior al de hoy: unitario, mismo fichero, con `today = 'dom'` y `today = 'mié'`.
- Cancelar sin reserva, también hoy: unitario.
- Camino crítico «cancelar una reserva»: `cancel.test.js › cancelar una reserva activa`, por `run`, con `today = 'dom'`; sigue siendo el test de la fila existente. Ningún test nuevo de la suite `cli` entra en la base.

## Términos y ADR

- Términos resueltos: Cancelación — la reserva que anula el propio cliente antes del día de la reserva (decisión 7)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Una reserva de hoy no se cancela

- GIVEN hoy es lunes y hay una reserva activa Norte lun
- WHEN el cliente escribe `cancelar Norte lun`
- THEN responde `ya no se puede cancelar Norte lun`
- AND la reserva sigue activa: `libres 10:00-12:00` no da Norte

#### ADDED — Una reserva de un día posterior a hoy se cancela

- GIVEN hoy es lunes y hay una reserva activa Norte mar
- WHEN el cliente escribe `cancelar Norte mar`
- THEN responde `cancelada Norte mar`
- AND la reserva queda cancelada

#### ADDED — Un nombre de día anterior al de hoy se cancela como siempre

- GIVEN hoy es miércoles y hay una reserva activa Norte lun
- WHEN el cliente escribe `cancelar Norte lun`
- THEN responde `cancelada Norte lun`

#### ADDED — Cancelar sin reserva lo dice

- GIVEN hoy es lunes y no hay reserva activa Sur lun ni Sur mar
- WHEN el cliente escribe `cancelar Sur lun`, o `cancelar Sur mar`
- THEN responde `sin reserva Sur lun`, o `sin reserva Sur mar`

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
