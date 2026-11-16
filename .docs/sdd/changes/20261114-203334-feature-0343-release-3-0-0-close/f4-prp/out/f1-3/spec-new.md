---
id: 20261116-140702-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-16
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-16
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `cancelar Norte lun` cancela y no pregunta nada. Después de esto hay que decir por qué: `cancelar Norte lun sala-ocupada` responde `cancelada Norte lun (motivo: sala ocupada)`, y un comando nuevo, `canceladas`, enseña cada cancelación con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Sin motivo, o con uno que no esté en la lista, no se cancela y se dice cuáles valen. Por dentro, la reserva guarda el motivo en memoria junto a su estado.

Validación: dev-lead — lo que ve quien usa la herramienta (respuestas de `cancelar` y `canceladas`).

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y listar las canceladas con su motivo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (siete puntos) — señales: capacidad nueva (`booking-cancellation`), cambio de la respuesta de `cancelar` (contrato de la CLI) · tamaño: ~80 líneas en 3 ficheros (código y tests)
- Dominio y técnica (sonnet): si `cancelar` sin motivo y con motivo inválido comparten un único texto, y si la respuesta antigua `cancelada <sala> <día>` desaparece de todo el repo (señal: la respuesta de `cancelar` cambia)
- Mínimo razonable: un solo revisor — es el nivel dispatchado; una segunda ronda se hizo por los Críticos aceptados

1. Lista de motivos: `cambio-de-planes`, `sala-ocupada`, `otro`; se escriben así, en una sola palabra, como último argumento: `cancelar <sala> <día> <motivo>` — son los tres del encargo, sin espacios para no complicar los argumentos de la CLI.
2. El motivo es obligatorio. Si falta o no está en la lista: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`, y la reserva sigue activa — una cancelación sin motivo es justo lo que se quiere evitar.
3. El motivo se valida antes que la existencia de la reserva: `cancelar Sur mar` (sin motivo) da el error del motivo; `cancelar Sur mar otro` da `sin reserva Sur mar` — un solo orden, fácil de predecir.
4. Respuesta de una cancelación correcta: `cancelada Norte lun (motivo: cambio de planes)`, con el motivo en lenguaje natural (guiones → espacios); la respuesta actual `cancelada Norte lun` se retira.
5. Listado: comando nuevo `canceladas`, sin argumentos; una línea por reserva, `<sala> <día> <franja> · <motivo en lenguaje natural>`, en el orden de la lista de reservas (no el de cancelación: no se guarda); sin ninguna, `sin canceladas` — el encargo pide que «el listado de canceladas» enseñe el motivo y hoy no existe ningún listado.
6. Las reservas anuladas (`anular`) no llevan motivo ni salen en `canceladas` — la Anulación es otro concepto (PRODUCT.md) y el encargo habla solo de cancelar.
7. Capacidad nueva `booking-cancellation` (inglés, kebab-case) — no hay capacidades todavía y esto es comportamiento observable nuevo.
8. El motivo se guarda en memoria, en la propia reserva (`reason`), como el resto de datos del producto (operations.md: sin base de datos).
9. Enfoque: A, frente a B y C (ver Approach).
10. **Limitación que valido contigo**: las reservas viven en memoria del proceso y la CLI arranca un proceso por comando; por tanto `canceladas` solo ve lo cancelado en el mismo proceso (hoy, en la práctica, siempre `sin canceladas` desde la terminal). Persistir queda fuera: no lo pide el encargo y `operations.md` dice «sin base de datos». Si quieres verlo desde la terminal de verdad, hace falta otra feature de persistencia.
11. Motivo: coincidencia exacta y sensible a mayúsculas (`Otro` es no válido); argumentos de más se ignoran; sala o día ausentes quedan como hoy (fuera de Scope) — el encargo no los toca.
12. La condición de 24 h de la Cancelación (PRODUCT.md) no se comprueba hoy ni la añade esta feature; `sala-ocupada` se acepta como motivo porque el dev-lead lo pidió.
13. `cancelBooking(room, day, reason)` cambia de firma (exportada): una llamada sin motivo devuelve el error de motivo.
14. Las formas con guiones (`cambio-de-planes`…) y el texto del error son propuesta mía; el dev-lead dijo «cambio de planes, sala ocupada, otro».
16. Para probar con datos distintos de la siembra (`Norte lun`), `src/app.js` exporta `seedBookings(list)`, que sustituye la lista en memoria; es solo para tests y no tiene comando — `reservar` es un stub y no crea reservas.
17. En el código interno se mantiene `bookings` y `cancelledBookings`; en la interfaz se dice «reserva» (PRODUCT.md).
18. **Cambio incompatible de la CLI**: `cancelar` sin motivo deja de funcionar; va al CHANGELOG del cierre como cambio incompatible.
15. Una reserva ya cancelada no se vuelve a cancelar: da `sin reserva …` y su motivo no cambia (comportamiento que ya tiene `findBooking`, ahora declarado).
- Política de modelos: revisor de spec en sonnet · ejes de la revisión final según `sdd-verify` (Spec opus+high, Código sonnet+high; Arquitectura no) · sin otros despachos en paralelo · hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Lista de motivos — «cambio de planes, sala ocupada, otro»
- Parada tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para» (se ejecuta en el plan, no en la spec)

### Hallazgos de la review

- **Aceptado** — Crítico: `canceladas` no ve nada entre procesos → Intent rebajado, decisión 10 declara la limitación.
- **Aceptado** — Crítico: orden de cancelación no garantizado → se retira la promesa (decisión 5) y hay un escenario con dos canceladas.
- **Aceptado** — un escenario por motivo, por vacío, por anulada y por segunda cancelación → delta dividido.
- **Aceptado** — cambio de firma de `cancelBooking` → decisión 13; Scope añade los tests de los escenarios.
- **Aceptado** — mayúsculas, argumentos de más → decisión 11.
- **Aceptado** — regla de 24 h y `sala-ocupada` → decisión 12.
- **Aceptado** — «Regla ante conflicto» e idioma → reglas reescritas, decisión 15.
- **Aceptado** — formas con guiones propuesta mía → decisión 14.
- **Aceptado** (2.ª ronda) — siembra imposible → decisión 16 y `seedBookings`; un escenario por motivo y por «ausente»/«fuera de lista»; precedencia e identificadores en las reglas; decisiones 17 y 18; tamaño corregido.
- **Aceptado** — estado de aprobación → fila de Aprobaciones y estado `approved`.

## Intent

Hoy se cancela sin dejar rastro de por qué. Se quiere que cada cancelación diga su motivo, elegido de una lista corta, y que el listado de canceladas lo enseñe. Éxito: toda reserva cancelada tiene uno de los tres motivos y `canceladas` los enseña todos los del proceso (las reservas viven en memoria: ver decisión 10). Fracaso aunque funcione: que se pueda cancelar sin motivo, o que un texto libre se cuele como motivo.

## Scope

- Entra: motivo obligatorio en `cancelar` · lista de tres motivos · comando `canceladas` · `seedBookings` (solo tests) · ajustar los dos tests de `test/cancel.test.js` a la nueva respuesta y añadir los de cada escenario del delta.
- No entra: motivo en `anular` · texto libre para «otro» · motivos configurables · filtros u ordenación del listado · persistencia fuera de memoria · reservar de verdad.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta `cancelada <sala> <día>` | `src/app.js:17`, `test/cancel.test.js:6` | delta, ADDED en `booking-cancellation` (la respuesta nueva); el test se reescribe |
| `cancelar` sin motivo acepta | `src/app.js:30`, `test/cancel.test.js:10` | decisiones 2 y 3; el test pasa a llevar motivo |
| `cancelar` sin motivo (cambio incompatible) | `src/app.js:30` | decisión 18, al CHANGELOG del cierre |
| «Cancelar una reserva propia» | `CHANGELOG.md:20` | sin cambio: histórico de una versión ya publicada |

- Filas que implementa: 0010 → `ROADMAP.md:7` (el cierre la marca ✅) | comprobado con `git grep -niE "motivo|canceladas"`: solo `ROADMAP.md`.

## Approach

- A: guardar `reason` en la reserva y añadir `canceladas`, que filtra por `status === 'cancelled'` — un campo y una función; reutiliza el patrón de `voidBooking`.
- B: lista de cancelaciones aparte (`cancellations[]`) con su motivo — duplica estado que ya vive en la reserva y puede desincronizarse.
- C: texto libre validado en lugar de lista — contradice «de una lista».
- Elegido: A — una sola fuente de verdad, el mínimo cambio, y coincide con cómo ya se guarda `status`.

En `src/app.js`: `reasons = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`; `cancelBooking(room, day, reason)`; `cancelledBookings()`; comando `canceladas` en `run`.

## Dónde se prueba

- Cancelar con motivo, sin motivo, inválido y sin reserva: por `run('cancelar', …)`, como los tests actuales de `test/cancel.test.js`.
- Listado `canceladas`: por `run('canceladas', [])`, mismo patrón y fichero.
- Estados de partida: cada test siembra con `seedBookings([...])` antes de actuar, porque el estado del módulo se comparte.
- Efecto en `libres` tras cancelar: por `run('libres', …)`, como `test/app.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun cambio-de-planes`
- THEN responde `cancelada Norte lun (motivo: cambio de planes)`
- AND `libres 10:00-12:00` pasa a responder `Norte, Sur`

#### ADDED — Cada motivo de la lista se acepta

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (motivo: sala ocupada)`

#### ADDED — El motivo `otro` se acepta

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun otro`
- THEN responde `cancelada Norte lun (motivo: otro)`

#### ADDED — Una reserva ya cancelada no se cancela otra vez

- GIVEN Norte lun cancelada por `cambio-de-planes`
- WHEN `cancelar Norte lun otro`
- THEN responde `sin reserva Norte lun`
- AND `canceladas` sigue enseñando `cambio de planes` como su motivo

#### ADDED — Un motivo ausente no cancela

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND `libres 10:00-12:00` sigue respondiendo `Sur`

#### ADDED — Un motivo fuera de la lista no cancela

- GIVEN la reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun aburrimiento`
- THEN responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- AND `cancelar Norte lun Otro` responde lo mismo, y `libres 10:00-12:00` sigue respondiendo `Sur`

#### ADDED — El motivo se comprueba antes que la reserva

- GIVEN no hay reserva activa Sur mar
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`
- AND `cancelar Sur mar` responde `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN canceladas Norte lun 10:00-12:00 por `cambio-de-planes`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`

#### ADDED — Sin canceladas el listado lo dice

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### ADDED — Las anuladas no salen en el listado de canceladas

- GIVEN Norte lun anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### ADDED — El listado trae varias canceladas

- GIVEN Norte lun (10:00-12:00) cancelada por `otro` y Sur mar (14:00-16:00) cancelada por `sala-ocupada`
- WHEN `canceladas`
- THEN responde dos líneas: `Norte lun 10:00-12:00 · otro` y `Sur mar 14:00-16:00 · sala ocupada`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`)
- **Idioma de los nombres**: identificadores del código en inglés; texto de la interfaz en castellano: motivos con guiones al escribirlos y en lenguaje natural al mostrarlos
- **Límites**: tres motivos, coincidencia exacta y sensible a mayúsculas: `cambio-de-planes`, `sala-ocupada`, `otro`
- **Avisos**: `motivo no válido: usa cambio-de-planes, sala-ocupada u otro`
- **Regla ante conflicto**: el motivo se valida antes que la existencia de la reserva; una reserva ya cancelada no se cancela otra vez y su motivo no cambia

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-16 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
