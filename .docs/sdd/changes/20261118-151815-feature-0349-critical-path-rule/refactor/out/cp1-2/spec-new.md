---
id: 20261118-163603-feature-0040-cancel-cutoff
feature: 0040
title: Una reserva de hoy ya no se cancela
mode: full
profile: delegate
status: draft
created: 2026-11-18
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Una reserva de hoy ya no se cancela

🦆 Hoy, `cancelar Norte lun` anula la reserva siempre. Con este cambio, si hoy es lunes responde «ya no se puede cancelar Norte lun» y la reserva sigue activa; si hoy es martes (o cualquier otro día), `cancelar Norte lun` la cancela como siempre. Por dentro, `cancelBooking` compara el día de la reserva con el día de hoy, que se puede inyectar para que los tests no dependan del reloj.

Validación: agente — es una regla de dos ramas sobre un comando de terminal, y los tests con «hoy» inyectado miden exactamente lo que vería una persona.

## Capacidades

- Nuevas: `booking-cancellation` — cuándo se puede cancelar una reserva y qué responde el comando
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

- Review de la spec: ninguna — lo dijo el dev-lead («Sin review»); queda sin cubrir lo que un revisor independiente habría mirado.
1. Enfoque: «hoy» como tercer parámetro opcional de `cancelBooking(room, day, today)` y de `run(cmd, params, today)`, con el día del sistema por defecto, frente a (B) una variable de entorno y (C) un reloj global falso en los tests (ver Approach).
2. Nombres de los días de la semana al leer el reloj: `dom, lun, mar, mie, jue, vie, sab` (los de la app son `lun`, `mar`…; los que no aparecen aún, sin tilde) — ningún test ni comando los usa hoy.
3. Solo se bloquea la reserva del día de hoy; una del mismo nombre de día que ya pasó o cae en otra semana se cancela como hoy — la frase del dev-lead dice «las de días posteriores se cancelan como hoy» y las anteriores no se mencionaron: las trato igual que las posteriores.
4. Si no hay reserva activa, `sin reserva <sala> <día>` manda sobre el bloqueo, también siendo hoy ese día — si no existe, no hay nada que proteger.
5. La reserva bloqueada queda `active`: `libres` sigue sin ofrecer su sala en esa franja.
6. `anular` (responsable de sala) no cambia: el dev-lead habló solo de cancelar.
7. **Toca un test del camino crítico**: `test/cancel.test.js › cancelar una reserva activa` (fila A de `critical-path.md`) llama hoy a `run('cancelar', ['Norte', 'lun'])` sin «hoy», y los lunes dejaría de dar «cancelada». Propongo pasarle `'mar'` como hoy; su comportamiento esperado (`cancelada Norte lun`) no cambia, la fila de `critical-path.md` tampoco. Lo mismo para `test/booking.unit.test.js › cancelBooking cancela una reserva activa`. Aprobar la spec aprueba editar esas dos llamadas; si prefieres que el test crítico no se toque, dímelo y el aviso queda como riesgo de los lunes.
8. Los tests nuevos van solo en `booking.unit.test.js` (nivel unitario, que ya ve la regla y su texto); no añado test en `cancel.test.js` ni fila al camino crítico: el comportamiento nuevo no es un camino nuevo y lo ve el nivel de abajo. «De feature, se borra al cerrar» no aplica: se quedan en la suite unitaria.
9. Texto exacto de la respuesta: `ya no se puede cancelar <sala> <día>` — el del dev-lead, sin punto final ni mayúscula; `<día>` es el que el usuario escribió.
10. `PRODUCT.md` define «Cancelación» como «antes de 24 h», lo que deja de ser cierto: la reescribo como «la reserva que anula el propio cliente antes del día de la reserva» (ver «Lo que se retira»).
11. Capacidad nueva `booking-cancellation` (no hay `capabilities/`): una sola capacidad, sustantivo del dominio, con el nombre en inglés kebab-case.
12. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → añadidos los 3 requisitos en `booking-cancellation.md`, sin rechazos; el `capabilities/` del repo no cambia.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Una reserva de hoy ya no se cancela — «una reserva de hoy ya no se cancela»
- Respuesta: `cancelar Norte lun`, siendo lunes, dice «ya no se puede cancelar Norte lun» — «`cancelar Norte lun`, siendo lunes, responde «ya no se puede cancelar Norte lun»»
- Las de días posteriores se cancelan como hoy — «las de días posteriores se cancelan como hoy»
- Sin review — «Sin review»

## Intent

Hoy cualquier reserva se puede cancelar en cualquier momento, también la que empieza ese mismo día, cuando la sala ya no se puede reasignar. El dev-lead decidió que la reserva de hoy ya no se cancela. Éxito: siendo lunes, `cancelar Norte lun` responde «ya no se puede cancelar Norte lun» y la reserva sigue activa; las demás cancelaciones no cambian. Anti-objetivo: que una cancelación de otro día se rechace por error, o que los tests de cancelar dependan del día en que se ejecuten.

## Scope

- Entra: la regla en `cancelBooking` (`src/app.js`), «hoy» opcional en `cancelBooking` y en `run`, los tests unitarios de la regla y el ajuste de los dos tests existentes de cancelar activa (ver decisión 7), la definición de «Cancelación» en `PRODUCT.md`.
- No entra: `anular` (`voidBooking`), la hora de la reserva (solo cuenta el día), días de calendario reales (las reservas siguen siendo `lun`, `mar`…), cualquier otro texto del comando, el listado `libres`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «antes de 24 h» como definición de Cancelación | `PRODUCT.md:13` | Scope + decisión 10: pasa a «antes del día de la reserva» |
| Llamadas de cancelar activa sin «hoy» | `test/cancel.test.js:6`, `test/booking.unit.test.js:6` | Scope + decisión 7: se les pasa `'mar'` |
| `cancelBooking(room, day)` de dos parámetros | `src/app.js:13`, `:30` | Approach: tercer parámetro opcional; los llamadores existentes siguen válidos |

- Filas que implementa: ninguna: comprobado con `git grep -n "0040\|cancel-cutoff" -- . ':!.docs/sdd/changes'` (sin resultados) — la fila no existe en `ROADMAP.md`.

## Approach

- A: `today` como tercer parámetro opcional (`cancelBooking(room, day, today = currentDay())`, y `run(cmd, params, today)` lo pasa) — un cambio pequeño, los tests lo fijan sin tocar el entorno; el comando de terminal lo calcula del reloj.
- B: variable de entorno `SALAS_HOY` — añade una superficie de configuración que el producto no tiene y los tests tendrían que mutar `process.env`.
- C: reloj falso global en los tests — el código no cambia de firma, pero el test crítico dependería de un mock compartido.
- Elegido: A — la menor superficie nueva y los tests de la suite crítica quedan deterministas pasando un argumento.

`currentDay()` devuelve el día del sistema como `dom, lun, mar, mie, jue, vie, sab`. La regla: con reserva activa en `<sala> <día>` y `day === today`, devuelve `ya no se puede cancelar <sala> <día>` y no cambia el estado; sin reserva activa, `sin reserva <sala> <día>`.

## Dónde se prueba

- Una reserva de hoy se rechaza con el texto y sigue activa: unitario, en `test/booking.unit.test.js` con `cancelBooking('Norte', 'lun', 'lun')` — el nivel más bajo que ve la regla y su texto.
- Una de otro día se cancela: unitario, `cancelBooking('Norte', 'lun', 'mar')`.
- Hoy sin reserva activa dice «sin reserva»: unitario, `cancelBooking('Sur', 'lun', 'lun')`.
- La reserva rechazada sigue activa: unitario, tras el rechazo `cancelBooking('Norte', 'lun', 'mar')` la cancela.
- El camino crítico `cancelar una reserva activa` (`cancel.test.js`) sigue verde con «hoy» = `'mar'`; no se añade test a esa suite.

## Términos y ADR

- Términos resueltos: Cancelación — la reserva que anula el propio cliente antes del día de la reserva (sustituye «antes de 24 h»).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Una reserva de hoy no se cancela

- GIVEN hoy es lunes y hay una reserva activa de Norte el lunes
- WHEN `cancelar Norte lun`
- THEN responde `ya no se puede cancelar Norte lun`
- AND la reserva sigue activa

#### ADDED — Una reserva de otro día se cancela

- GIVEN hoy es martes y hay una reserva activa de Norte el lunes
- WHEN `cancelar Norte lun`
- THEN responde `cancelada Norte lun`
- AND la reserva queda cancelada

#### ADDED — Sin reserva activa, el comando lo dice

- GIVEN hoy es lunes y no hay reserva activa de Sur el lunes
- WHEN `cancelar Sur lun`
- THEN responde `sin reserva Sur lun`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
