---
id: 20261112-152425-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar una reserva
mode: full
status: approved
created: 2026-11-12
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-12
---

# Spec — Motivo al cancelar una reserva

🦆 Hoy `salas cancelar Norte lun` cancela y no deja constancia de por qué. Con esto, cancelar exige un motivo de una lista cerrada (`cambio de planes`, `sala ocupada`, `otro`): `salas cancelar Norte lun --motivo "sala ocupada"` responde `cancelada Norte lun (sala ocupada)`. Sin motivo, o con uno fuera de la lista, no cancela y dice cuáles valen. Un comando nuevo, `salas canceladas`, lista las canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Por dentro, la reserva guarda su motivo al pasar a `cancelled`.

Validación: dev-lead — lo usa una persona desde la terminal, y la frase de delegación no nombra al agente.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`booking-cancellation`) · tamaño: ~45 líneas en 2 ficheros de código (`src/app.js`, `test/cancel.test.js`)
- Único revisor (sonnet): si los escenarios cubren el literal de cada mensaje de error y si lo que `cancelar` hacía sin motivo queda dicho en el delta (señal: capacidad nueva sin capacidad previa)
- Mínimo razonable: sin revisor — deja sin mirar un escenario que falte entre motivo ausente y motivo inválido

1. Lista cerrada, con estos literales y este orden: `cambio de planes`, `sala ocupada`, `otro` — los tres los dijiste tú; el orden y la minúscula son míos.
2. El motivo se pasa como `--motivo "<texto>"`, el literal de la lista en un solo argumento — no había sintaxis; sigue el estilo de `--cada-semana`.
3. El motivo es obligatorio: sin él, o con uno fuera de la lista, no se cancela y la reserva sigue activa — «se elige un motivo» lo pide; opcional dejaría canceladas sin motivo.
4. Texto sin `--motivo`: `falta el motivo: cambio de planes, sala ocupada, otro`.
5. Texto con motivo fuera de lista: `motivo no válido: <valor>; usa: cambio de planes, sala ocupada, otro`.
6. Éxito: `cancelada <sala> <día> (<motivo>)` (hoy `cancelada <sala> <día>`) — el motivo se ve al cancelar.
7. El motivo se valida antes de buscar la reserva: `cancelar Sur mar` sin motivo da el error del motivo, no `sin reserva Sur mar` — sala o día mal escritos quedan fuera de alcance.
8. El listado es un comando nuevo, `canceladas`, porque hoy no existe ningún listado de canceladas y la fila 0010 pide que lo enseñe.
9. Cada línea del listado: `<sala> <día> <franja> · <motivo>`, en el orden de la lista de reservas (decisión 16); sin canceladas, `sin canceladas` — formato y vacío míos.
10. El listado solo enseña canceladas por el cliente: las anuladas (`voided`) no entran, porque la anulación es otra cosa (PRODUCT.md, Terminology) y no lleva motivo.
11. Capacidad nueva `booking-cancellation` (inglés, kebab-case): hoy no hay `capabilities/` y el comportamiento es observable.
12. Reglas de la capacidad: datos en memoria (como dice `operations.md`); nombres en castellano; límite: la lista cerrada de tres motivos; avisos: los dos textos de error; conflicto: dos activas de la misma sala y día → la primera (decisión 20) — la constitution no tiene «Reglas de producto», los valores son míos.
13. Enfoque: guardar `reason` en la propia reserva, frente a una lista aparte de cancelaciones o a un motivo libre (ver Approach).
14. Sin `§Frontend`: la interfaz es texto de terminal y `operations.md` no declara pantallas.
15. `--motivo` va después de sala y día; la comparación con la lista es exacta (distingue mayúsculas): `"Sala ocupada"` no vale; `--motivo` sin valor, seguido de otro token que empiece por `--` o con `""` cuenta como motivo ausente; un `--motivo` repetido no se contempla — mío, para no tener que interpretar variantes.
16. El listado sale en el orden de la lista de reservas (el de creación), no el de cancelación — evita guardar un dato de orden nuevo que nadie pidió.
17. Las reservas ya canceladas o anuladas no se pueden cancelar otra vez: `cancelar` responde `sin reserva <sala> <día>`, como hoy (`findBooking` solo mira las activas).
18. En memoria no hay histórico: toda cancelada nace tras este cambio, así que todas llevan motivo; no hay caso de cancelada sin motivo.
19. `canceladas` lista también las reservas que `PRODUCT.md` no llamaría «cancelación» por pasar de 24 h: el código no aplica esa regla hoy y la dejo fuera (Scope). Divergencia consciente: en este producto «cancelada» es el estado `cancelled`, sin la regla de 24 h de `PRODUCT.md`.
21. Nombres internos y formato: campo `reason` en la reserva, constante `CANCEL_REASONS`, separador ` · ` en el listado, franja tal como está guardada (`HH:MM-HH:MM`) y líneas unidas por salto de línea — míos, no cambian lo que se ve más allá del formato de la decisión 9.
20. Si hay dos reservas activas de la misma sala y día, `cancelar` actúa sobre la primera de la lista (lo que ya hace `findBooking`).

### Hallazgos de la review

- **Aceptado** (Crítico) — `cancelar` ya existía sin capacidad escrita, los escenarios lo cambian como si fuera nuevo → nota de línea base al abrir el delta con el comportamiento actual que se sustituye.
- **Aceptado** (Crítico) — falta decir cómo se compara el motivo y qué pasa con `--motivo` sin valor o en otra posición → decisión 15 y escenarios «Motivo con otra capitalización» y «`--motivo` sin valor».
- **Aceptado** — falta el estado ya cancelada o anulada → decisión 17 y escenario «Cancelar una ya cancelada».
- **Aceptado** — el orden «en que se cancelaron» pedía un dato nuevo → decisión 16, THEN reescrito al orden de la lista.
- **Aceptado** — Intent frente a canceladas sin motivo → decisión 18.
- **Aceptado** — divergencia con la regla de 24 h → decisión 19.
- **Aceptado** — GIVEN poco concretos → los escenarios dicen que las reservas están sembradas; `anular` existe (`src/app.js`, `run`).
- **Aceptado** — «Regla ante conflicto: no aplica» sin justificar → decisión 20 y regla escrita.
Segunda ronda (un revisor sonnet, sin tercera):

- **Aceptado** (Crítico) — GIVEN de «ya cancelada» y «anuladas» no sembrables → los escenarios dicen con qué comandos se siembra cada estado y que no hay otra activa.
- **Aceptado** — `--motivo` seguido de `--…`, `""` o repetido → decisión 15.
- **Aceptado** — alcance de la decisión 7 → acotada a «antes de buscar la reserva»; sala o día mal escritos, fuera de alcance.
- **Aceptado** — «cancelada» frente a la Terminology de `PRODUCT.md` → decisión 19 y «Términos resueltos».
- **Aceptado** — nombres internos y formato sin decidir → decisión 21.
- **Aceptado** — regla ante conflicto contradictoria entre decisión 12 y Reglas → unificadas en decisión 20.
- **Aceptado** — orden de siembra en el THEN → pasa al GIVEN y es contrario al orden de cancelación.
- **Aceptado** — números de línea en la tabla de cambios → citan funciones y tests por nombre.
- **Rechazado** (Importante) — los escenarios deberían ser `MODIFIED` → `sdd capability merge` no tiene requisito vivo que sustituir: sin `capabilities/`, el comportamiento previo va en la nota de línea base y los escenarios son `ADDED`.
- **Rechazado** (Menor) — mover a sección propia el bloque de proceso de ✋ → lo fija la plantilla.

Primera ronda:

- **Rechazado** — separar decisiones de producto y de proceso, y revisor único «en conflicto con el encargo» → el bloque de review y la política de modelos van en ✋ por la plantilla y el rubric da un revisor con ~45 líneas; el encargo no fija nivel de review.
- **Rechazado** — escenario de que el binario enruta `canceladas` → `run` es la única costura (`src/app.js`, última línea imprime `run(...)`): no hay dispatcher aparte.
- Política de modelos: un revisor de spec en sonnet (`sdd-kit:effort-medium`) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación (2026-11-12) — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parada: tras el commit de la Task 1, antes de la Task 2 — «cuando tengas el commit de la Task 1, para»
- Lista de motivos — «de una lista: cambio de planes, sala ocupada, otro»

## Intent

Hoy cancelar una reserva (`salas cancelar Norte lun`) no deja constancia de por qué, y no hay forma de ver las canceladas. Con el motivo, quien administra las salas ve de un vistazo por qué se cancela. Éxito: toda reserva cancelada tiene uno de los tres motivos y `salas canceladas` lo enseña. Sería un fracaso que una cancelación sin motivo, o con uno inventado, quedara registrada.

## Scope

- Entra: `cancelar` exige `--motivo` con un valor de la lista; la reserva guarda su motivo.
- Entra: el comando `canceladas`, con el motivo de cada una.
- Entra: actualizar los dos tests actuales de `cancelar`, que hoy no pasan motivo.
- No entra: motivos libres o configurables; editar el motivo de una ya cancelada.
- No entra: la anulación (`anular`), que no lleva motivo.
- No entra: la regla de las 24 h de `PRODUCT.md`, que el código no aplica hoy.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `cancelBooking` y `run` en `src/app.js` | Scope y escenarios 2 y 3 del delta |
| Respuesta `cancelada <sala> <día>` pasa a `cancelada <sala> <día> (<motivo>)` | test «cancelar una reserva activa» de `test/cancel.test.js` | Decisión 6 y escenario 1 del delta |
| `cancelar sin reserva lo dice` ya no vale sin motivo | test «cancelar sin reserva lo dice» de `test/cancel.test.js` | Decisión 7; el test pasa `--motivo` |
| Línea «Cancelar una reserva propia» | `CHANGELOG.md` (versión 0.3.0, ya publicada) | no cambia: es histórico; la entrada nueva la escribe el cierre de la release |

- Filas que implementa: 0010 → `ROADMAP.md` la nombra; el cierre la pasa a ✅ | sin más ficheros: comprobado con `git grep -n "0010"`.

## Approach

- Guardar el motivo en la propia reserva (`booking.reason`) — un campo más; `canceladas` filtra `bookings` por `status === 'cancelled'`; sin estructura nueva.
- Lista aparte de cancelaciones (`cancellations[]` con su motivo) — duplica la reserva y hay que mantener las dos sincronizadas.
- Motivo libre — no cumple «de una lista» y estropea un listado que se quiere leer de un vistazo.
- Elegido: motivo en la reserva — es lo más simple y la reserva ya cambia a `cancelled` en un único sitio (`cancelBooking`).

Partes del cómo: `cancelBooking(room, day, reason)` valida `reason` contra una constante `CANCEL_REASONS` antes de buscar la reserva; `run` extrae el valor que sigue a `--motivo` en `params`; `canceladas` devuelve las líneas unidas por salto de línea.

## Dónde se prueba

- Cancelar con motivo, motivo ausente o inválido y sin reserva: por `run('cancelar', …)`, como `test/cancel.test.js` actual.
- Listado de canceladas: por `run('canceladas', [])`, en el mismo fichero de tests.

## Términos y ADR

- Términos resueltos: «cancelada» en `canceladas` = estado `cancelled`, sin la regla de 24 h de `PRODUCT.md` (decisión 19)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

> Línea base: `cancelar` ya existe sin capacidad escrita y hoy responde `cancelada <sala> <día>` sin pedir motivo. Estos escenarios lo sustituyen; al no haber capacidad previa, todos son `ADDED`. En todos, las reservas están sembradas en los tests; `anular` ya existe.

#### ADDED — Cancelar pide un motivo de la lista

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND la reserva queda cancelada con ese motivo

#### ADDED — Cancelar sin motivo no cancela

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun`
- THEN responde `falta el motivo: cambio de planes, sala ocupada, otro`
- AND la reserva sigue activa

#### ADDED — Un motivo fuera de la lista no cancela

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo "me aburro"`
- THEN responde `motivo no válido: me aburro; usa: cambio de planes, sala ocupada, otro`
- AND la reserva sigue activa

#### ADDED — Motivo con otra capitalización no vale

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde `motivo no válido: Sala ocupada; usa: cambio de planes, sala ocupada, otro`
- AND la reserva sigue activa

#### ADDED — `--motivo` sin valor cuenta como ausente

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun --motivo`
- THEN responde `falta el motivo: cambio de planes, sala ocupada, otro`
- AND la reserva sigue activa

#### ADDED — Cancelar una ya cancelada

- GIVEN reserva sembrada Norte lun, sin otra activa de Norte lun, cancelada antes con `cancelar Norte lun --motivo otro`
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde `sin reserva Norte lun`
- AND el motivo guardado sigue siendo `otro`

#### ADDED — Cancelar sin reserva lo dice

- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar --motivo otro`
- THEN responde `sin reserva Sur mar`

#### ADDED — El motivo se valida antes que la reserva

- GIVEN no hay reserva activa de Sur el martes
- WHEN `cancelar Sur mar`
- THEN responde `falta el motivo: cambio de planes, sala ocupada, otro`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN reservas sembradas en este orden: Sur mar 14:00-15:00, Norte lun 10:00-12:00; canceladas en el orden contrario: primero Norte lun con `--motivo "cambio de planes"`, luego Sur mar con `--motivo otro`
- WHEN `canceladas`
- THEN responde dos líneas, `Sur mar 14:00-15:00 · otro` y `Norte lun 10:00-12:00 · cambio de planes`, en el orden de la lista de reservas

#### ADDED — Sin canceladas el listado lo dice

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### ADDED — El listado no incluye las anuladas

- GIVEN reservas sembradas Norte lun y Sur mar 14:00-15:00; Norte lun anulada con `anular Norte lun` y Sur mar cancelada con `cancelar Sur mar --motivo "sala ocupada"`
- WHEN `canceladas`
- THEN responde solo `Sur mar 14:00-15:00 · sala ocupada`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`reason`).
- **Idioma de los nombres**: castellano (comandos, motivos y mensajes).
- **Límites**: la lista cerrada `cambio de planes`, `sala ocupada`, `otro`.
- **Avisos**: `falta el motivo: cambio de planes, sala ocupada, otro` · `motivo no válido: <valor>; usa: cambio de planes, sala ocupada, otro`.
- **Regla ante conflicto**: con dos reservas activas de la misma sala y día, `cancelar` actúa sobre la primera de la lista.

## Enmiendas

- ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
