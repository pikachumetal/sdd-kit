---
id: 20261109-194713-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-09
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-09
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y ya. Con esta feature hay que decir por qué: `cancelar Norte lun "sala ocupada"` responde `cancelada Norte lun (sala ocupada)`. Los motivos válidos son `cambio de planes`, `sala ocupada` y `otro`; con uno distinto, o sin ninguno, no se cancela nada y el mensaje enseña la lista. El motivo queda guardado en la reserva cancelada.

Validación: dev-lead — es un comando que usa una persona y cambia su sintaxis.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista cerrada.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: un revisor sonnet + una segunda ronda (hubo Críticos) — señales: capacidad nueva (primera captura de `cancelar`; sin `MODIFIED`, no hay capacidad vigente) · tamaño: ~25 líneas en 3 ficheros
- Dominio y técnica (sonnet): si el motivo obligatorio choca con los dos tests de `test/cancel.test.js` y si el orden «motivo antes que reserva» (decisión 6) deja algún caso sin THEN (señal: capacidad nueva)

1. Capacidad nueva `booking-cancellation` — hoy no hay `capabilities/` y el comportamiento observable vive ahí; el slug va en inglés.
2. El motivo es **obligatorio**: sin motivo no se cancela — la petición dice «elegir de una lista», y un valor por defecto sería un motivo que nadie eligió.
3. El motivo es el tercer argumento de `cancelar`, con el texto literal de la lista, entre comillas en la terminal: `cancelar Norte lun "sala ocupada"` — es el cambio mínimo sobre la sintaxis actual (sala, día); un flag `--motivo` añadiría una forma más.
4. Mensaje de éxito: `cancelada Norte lun (sala ocupada)`.
5. Motivo ausente o fuera de la lista: `motivo no válido: elige cambio de planes, sala ocupada u otro` y la reserva sigue activa. No distingue entre ausente e inválido.
6. La comprobación del motivo va antes de buscar la reserva: con motivo inválido y sin reserva, gana el mensaje del motivo.
7. El motivo se guarda en el campo `reason` de la reserva cancelada; las reservas activas no lo tienen (`undefined`).
8. **Fuera de la spec: el «listado de canceladas»** de la fila 0010. No existe hoy ningún comando que liste reservas; crearlo es otra feature. Al cerrar, la fila 0010 se corrige a «el motivo queda guardado» y el listado pasa a una fila nueva del backlog.
9. Enfoque: A (elegido) validar en `cancelBooking`, frente a B (validar en `run`) y C (flag `--motivo`); ver Approach.
10. `src/app.js` pasa a exportar `bookings`, para que los tests siembren la reserva y comprueben `reason`; es el único cambio de superficie que no es de `cancelar`.
11. Política de modelos: un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.
12. El motivo llega a `run` como **un solo argumento**: la terminal respeta las comillas y `params[2]` es `sala ocupada` entero. Sin comillas (`cancelar Norte lun sala ocupada`) llega `sala` y se rechaza como motivo no válido; los argumentos sobrantes se ignoran — `run` no cambia su forma de recibir argumentos. Los tests llaman a `run`; el punto de entrada real con comillas se comprueba a mano en la validación del dev-lead.
13. El motivo se compara de forma exacta, sensible a mayúsculas y espacios.
14. Una reserva ya cancelada no está activa: cancelarla otra vez responde `sin reserva` (es lo que hace hoy `findBooking`).
15. El motivo vive en memoria como las reservas: se pierde al reiniciar; consultarlo (listado) queda para otra feature (decisión 8). Por eso el Intent promete «queda guardado», no «consultable».
16. `README.md` documenta la sintaxis nueva con los tres motivos.
17. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` sale 0 y crea `booking-cancellation.md` con 9 requisitos y las 5 reglas; el repo no cambia hasta el cierre.

### Hallazgos de la review

- **Aceptado** (Crítico) — `ADDED` camuflaba un cambio y la cabecera hablaba de `MODIFIED` → la cabecera dice «sin `MODIFIED`: primera captura de `cancelar`, no hay capacidad vigente»; la spec solo tiene `ADDED`.
- **Aceptado** (Crítico) — no se decía cómo llega un motivo con espacios → ✋ 12.
- **Aceptado** — la regla ante conflicto no tenía THEN → escenario «Motivo inválido y sin reserva».
- **Aceptado** — casos límite → ✋ 13 y 14, y escenario «Cancelar dos veces»; argumentos sobrantes en ✋ 12.
- **Aceptado** — decisiones en el cuerpo → ✋ 13, 16 y la constante en el Approach.
- **Aceptado** — `export bookings` fuera del Scope → entra en «Entra».
- **Aceptado** — el Intent prometía consultar → el Intent dice «queda guardado» y ✋ 15.
- **Aceptado** — estado `approved` sin review hecha → los hallazgos ya están incorporados; la aprobación por delegación se aplica a esta versión.
- **Aceptado** — `Avisos` incompleta → incluye `sin reserva <sala> <día>`.
### Segunda ronda (sin Críticos)

- **Aceptado** — línea base mezclada con novedad → nota bajo «Delta de comportamiento».
- **Aceptado** — requisitos sin escenario → «Motivo exacto», «Motivo sin comillas» y «Argumentos sobrantes».
- **Aceptado** — el punto de entrada real no tiene gate → ✋ 12: se comprueba a mano en la validación del dev-lead.
- **Aceptado** — «propia» → quitado de la capacidad.
- **Aceptado** — roadmap al cerrar → entra en el Scope.
- **Aceptado** — contrato `bookings` y campo `reason` → Scope y ✋ 7.
- **Aceptado** — `approved` prematuro → la aprobación por delegación se aplica a la versión final tras las dos rondas.
- **Aceptado** — política de paralelismo contradictoria, cabecera de la review e idioma de identificadores → corregidos.

- **Rechazado** (primera ronda) — definir roles y «dev-lead» → no hay roles nuevos; «dev-lead» es el rol del kit y no entra en el producto.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación» (2026-11-09)
- Parar cuando exista el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Motivos de la lista: `cambio de planes`, `sala ocupada`, `otro` — «de una lista: cambio de planes, sala ocupada, otro»

## Intent

Hoy cancelar no deja rastro de por qué. Se quiere que cada cancelación lleve uno de tres motivos de una lista cerrada, para que quede guardado por qué se libera cada sala. Éxito: ninguna reserva queda cancelada sin motivo y ningún motivo fuera de la lista se guarda. Sería un fracaso que una errata en el motivo cancelara igualmente la reserva.

## Scope

- Entra: `cancelar <sala> <día> <motivo>` con motivo obligatorio de la lista; el motivo guardado en la reserva; actualizar los dos tests de cancelación existentes; exportar `bookings` desde `src/app.js` (solo para los tests; es contrato nuevo del módulo); al cerrar, corregir la fila 0010 del roadmap y abrir la fila del listado en el backlog (✋ 8); documentar la sintaxis en `README.md`.
- No entra: el listado de canceladas (no existe, ver ✋ 8); `anular` (la anulación del responsable de sala es la fila 0011); motivos configurables o ampliables.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13-18`, `test/cancel.test.js:5-11` | delta `ADDED` (no hay capacidad vigente); los dos tests se actualizan en la Task 1 |
| El mensaje `cancelada <sala> <día>` pasa a llevar `(<motivo>)` | `src/app.js:17`, `test/cancel.test.js:6` | delta `ADDED`; test actualizado en la Task 1 |

- Filas que implementa: 0010 → `.docs/sdd/roadmap.md` la nombra; su texto «el listado de canceladas lo enseña» se corrige al cerrar (✋ 8) · `git grep -n "cancelar\|cancelada"` fuera de `specs/`: solo `src/app.js`, `test/cancel.test.js` y el roadmap.

## Approach

- A: validar el motivo dentro de `cancelBooking(room, day, reason)` — una función, se prueba por `run('cancelar', …)` como hoy.
- B: validar en `run` antes de llamar a `cancelBooking` — deja `cancelBooking` aceptando cualquier valor; otro llamador podría guardar un motivo inválido.
- C: flag `--motivo` — una forma más de argumento que el resto de comandos no usa, sin ganancia.
- Elegido: A — la regla vive donde cambia el estado y no hay otro llamador que la salte.

La lista es una constante `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']` en `src/app.js`; `run('cancelar', params)` pasa `params[2]`.

## Dónde se prueba

- Cancelar con motivo, con motivo inválido, sin motivo y sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Que la reserva queda con `reason` y que sigue activa tras un motivo inválido: leyendo `bookings` exportado, sembrado en cada test.

## Términos y ADR

- Términos resueltos: **Motivo** — la razón de una cancelación, una de `cambio de planes`, `sala ocupada`, `otro`. _Evitar_: causa.
- ADR candidatas: ninguna

## Delta de comportamiento

> Los escenarios `sin reserva` ya se cumplen hoy (`findBooking` solo ve reservas activas); van como `ADDED` porque no hay capacidad vigente: es su primera captura, no un cambio.

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva con motivo

- GIVEN reserva activa Norte lun, motivos válidos `cambio de planes`, `sala ocupada`, `otro`
- WHEN `cancelar Norte lun "sala ocupada"`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND la reserva queda cancelada con `reason` `sala ocupada`

#### ADDED — Motivo de la lista

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun "me aburro"`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`
- AND la reserva sigue activa

#### ADDED — Cancelar sin motivo no cancela

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`
- AND la reserva sigue activa

#### ADDED — Cancelar sin reserva avisa

- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — Motivo inválido y sin reserva

- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar "me aburro"`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`

#### ADDED — Cancelar dos veces

- GIVEN reserva Norte lun ya cancelada con motivo `otro`
- WHEN `cancelar Norte lun "sala ocupada"`
- THEN responde `sin reserva Norte lun`
- AND el motivo guardado sigue siendo `otro`

#### ADDED — Motivo exacto

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun "Sala ocupada"`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`

#### ADDED — Motivo sin comillas

- GIVEN reserva activa Norte lun
- WHEN `run('cancelar', ['Norte', 'lun', 'sala', 'ocupada'])`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`

#### ADDED — Argumentos sobrantes

- GIVEN reserva activa Norte lun
- WHEN `cancelar Norte lun otro extra`
- THEN responde `cancelada Norte lun (otro)`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, campo `reason` de la reserva cancelada
- **Idioma de los nombres**: castellano en mensajes, motivos y documentos; identificadores de código y slugs en inglés
- **Límites**: tres motivos, cerrados; comparación exacta; argumentos sobrantes ignorados
- **Avisos**: `motivo no válido: elige cambio de planes, sala ocupada u otro` · `sin reserva <sala> <día>`
- **Regla ante conflicto**: motivo inválido y sin reserva → gana el aviso del motivo

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-09 | aprobada por delegación: «Apruebo la spec por delegación» |
