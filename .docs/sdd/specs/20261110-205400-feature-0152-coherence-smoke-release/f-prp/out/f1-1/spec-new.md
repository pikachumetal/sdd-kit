---
id: 20261112-121011-feature-0010-cancel-reason
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

🦆 Al cancelar una reserva ahora hay que decir por qué, eligiendo de una lista: `cambio de planes`, `sala ocupada` u `otro`. Por ejemplo, `cancelar Norte lun "sala ocupada"` responde `cancelada Norte lun (motivo: sala ocupada)`. Sin motivo, o con uno que no está en la lista, no cancela y avisa de las opciones. Un comando nuevo, `canceladas`, enseña cada reserva cancelada con su motivo. Por dentro, la reserva guarda el motivo en memoria junto a su estado.

Validación: dev-lead — lo que cambia se ve y se usa en la terminal, y la frase de delegación no nombra al agente como validador.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con un motivo de una lista y listar las canceladas con su motivo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`booking-cancellation`) · tamaño: ~35 líneas de código en `src/app.js` y ~60 de tests en 3 ficheros, sin `MODIFIED` ni contrato público
- Dominio y técnica (sonnet): que «sin motivo no cancela» no deje la reserva a medias, que la lista cerrada no choque con `anular` y que `canceladas` y el tercer argumento de `cancelar` no rompan el despacho de `run` (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si un THEN pasa sin comportamiento real

1. **Capacidad nueva `booking-cancellation`** (inglés, kebab-case): hoy no existe ninguna capacidad en `capabilities/`; la cancelación vive solo en el código.
2. **El motivo es obligatorio**, tercer argumento de `cancelar`: «se elige un motivo» no admite cancelar sin él. Cambia el comportamiento de `cancelar Norte lun` (hoy cancela): pasa a avisar.
3. **Lista cerrada y literal**: `cambio de planes`, `sala ocupada`, `otro`, tal cual las dijiste, con espacios; en la terminal se pasa entre comillas. La comparación distingue mayúsculas.
4. **Respuesta al cancelar**: `cancelada <sala> <día> (motivo: <motivo>)`.
5. **Motivo ausente o no válido**: `falta el motivo: elige uno de cambio de planes, sala ocupada, otro` si no hay tercer argumento; `motivo no válido: <lo escrito>; elige uno de cambio de planes, sala ocupada, otro` si no está en la lista. En ambos casos la reserva sigue activa.
6. **El motivo se valida antes que la reserva**: `cancelar Sur mar "x"` (sin reserva y con motivo no válido) responde `motivo no válido…`, no `sin reserva Sur mar`.
7. **Comando nuevo `canceladas`**, en vez de ampliar `libres`: la fila 0010 pide «el listado de canceladas», y hoy no hay ninguno. Una línea por reserva: `<sala> <día> <franja> · <motivo>`, p. ej. `Norte lun 10:00-12:00 · sala ocupada`; en el orden en que se cancelaron; sin ninguna, `sin canceladas`. La franja se incluye para distinguir dos reservas de la misma sala y día; `otro` se guarda sin texto libre.
8. **`canceladas` solo lista cancelaciones**, no anulaciones del responsable (`anular`): son términos distintos en `PRODUCT.md`. `anular` no cambia.
9. **Cancelar dos veces, o cancelar una anulada**, responde `sin reserva <sala> <día>`: es el comportamiento de hoy, que la capacidad nueva recoge por primera vez; y el plazo de 24 h queda fuera (No entra).
10. **El motivo vive en la propia reserva** (campo `reason`, en memoria, como el resto de las reservas): no hay persistencia en este proyecto.
11. Enfoque: A, frente a B y C (ver Approach).
12. **Argumentos sobrantes**: `cancelar` solo lee los tres primeros; `cancelar Norte lun otro extra` cancela con `otro`.
13. **Plazo de 24 h fuera**: `PRODUCT.md` lo cita, el código no lo aplica y no lo pediste; no entra.
14. **Sin observar** (una sola reserva de siembra y sin comando `reservar` real): el orden de varias canceladas y la mezcla de una cancelada con una anulada en el mismo listado no se pueden probar; los cubre la validación en la terminal.
15. Repaso de coherencia: el delta, fusionado en una copia de `.docs/sdd` (que no tiene `capabilities/`), crea `booking-cancellation` con sus requisitos y las 5 reglas, sin rechazos (`sdd capability merge`, salida 0).
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario de anuladas no podía fallar → requisito propio «El listado de canceladas no incluye anuladas» con `anular` en el GIVEN y `sin canceladas` en el THEN.
- **Aceptado, en parte** — Crítico: ADDED sobre una conducta que ya existe → no hay capacidad previa que `MODIFIED` pueda sustituir; se declara en la decisión 9 que la capacidad recoge por primera vez el comportamiento de hoy, y la decisión 2 dice que cambia.
- **Aceptado** — doble cancelación y cancelar una anulada → dos AND de «Cancelar una reserva que no existe».
- **Aceptado** — mayúsculas y motivo sin comillas → dos AND de «Sin motivo válido no se cancela».
- **Aceptado** — franja y `otro` sin texto libre sin declarar → decisión 7.
- **Aceptado** — Scope y tamaño no alineados con los ficheros de test → corregidos.
- **Rechazado** — orden de validación como requisito propio → ya es el AND con `Sur mar` y `"x"`, y la cancelación con motivo válido es el requisito 1.
- **Rechazado** — plazo de 24 h → el código no lo aplica y no lo pidió nadie; va a «No entra».
- **Rechazado** — status approved antes de la review → la aprobación es por delegación y el revisor lo decide el agente, sin parada; la review se integró antes de escribir el plan.
### Segunda ronda

- **Aceptado** — la reserva sigue activa tras cada fallo → AND con «y la reserva sigue activa»; la Task 1 acaba con una cancelación válida que lo confirma.
- **Aceptado** — argumentos sobrantes → decisión 12.
- **Aceptado** — regla ante conflicto → «el motivo se valida antes que la reserva».
- **Aceptado** — numeración, plazo de 24 h y divergencia con `PRODUCT.md` → decisiones 13 y «Términos».
- **Aceptado como límite** — orden de varias canceladas y mezcla con anuladas → decisión 14, sin observar.
- **Rechazado** — separar «cancelar dos veces» y «cancelar anulada» → ambas dan `sin reserva`, un solo requisito.

- **Aceptado en el plan** — un motivo por test, no un único test con tres respuestas.

### Decisiones tomadas con el dev-lead

- La spec se aprueba por delegación — «Apruebo la spec por delegación» (2026-11-12).
- Paro cuando tenga el commit de la Task 1 — «cuando tengas el commit de la Task 1, para».

## Intent

Hoy `cancelar <sala> <día>` anula la reserva sin dejar rastro de por qué: no se sabe si la gente cambia de planes o si la sala estaba ocupada. Se quiere que cada cancelación guarde un motivo de una lista corta y que se pueda ver. Éxito: toda reserva cancelada tiene un motivo de la lista, y `canceladas` lo enseña. Fracaso aunque funcione: que se pueda cancelar sin motivo, o que un motivo fuera de la lista quede guardado.

## Scope

- Entra: `cancelar` pide un tercer argumento con el motivo de la lista; `canceladas` lista las canceladas con su motivo; actualizar los dos tests existentes de `cancelar` en `test/cancel.test.js` y crear `test/cancelled-list.test.js` y `test/cancelled-voided.test.js`.
- No entra: el plazo de 24 h de `PRODUCT.md` (el código no lo aplica hoy y esta feature no lo introduce); cambiar `anular` (responsable de sala, fila 0011); persistencia; motivos libres o editables; cambiar el motivo de una reserva ya cancelada; filtrar `canceladas` por sala o día.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta `cancelada <sala> <día>` | `src/app.js:17`; `test/cancel.test.js:6` | Scope (test actualizado) y requisito ADDED «Cancelar pide un motivo de la lista» |
| `cancelar <sala> <día>` sin motivo cancelaba | `src/app.js:30`; `test/cancel.test.js:5-10` | Decisión 2; el test de «sin reserva» pasa a llevar motivo |
| «Cancelar una reserva propia» | `CHANGELOG.md:20` (versión 0.3.0, histórico) | Se deja: es la entrada de una release pasada |

- Filas que implementa: 0010 → `ROADMAP.md:7` (el cierre la marca ✅) · `git grep -n "0010"` no encuentra otro fichero que la nombre.

## Approach

- A. Motivo como tercer argumento obligatorio, validado contra una constante `CANCEL_REASONS` — una constante y una comprobación en `cancelBooking`; encaja con una CLI de un solo disparo y sin prompts.
- B. Motivo opcional con `otro` por defecto — no obliga a elegir y deja una puerta abierta a cancelar sin pensar; descartado porque pierde el dato que se busca.
- C. Menú interactivo que pregunta el motivo — la CLI no lee de stdin hoy y los tests tendrían que simularlo; descartado.
- Elegido: A — es la forma mínima que garantiza que toda cancelación lleva motivo.

`cancelBooking(room, day, reason)` valida `reason` y solo entonces busca la reserva y guarda `reason` junto a `status = 'cancelled'`. `listCancelled()` devuelve las canceladas en orden de cancelación; `run('canceladas', [])` las formatea. `run` pasa `params[2]` a `cancelBooking`.

## Dónde se prueba

- Cancelar con motivo, sin motivo, con motivo no válido y sin reserva: por `run('cancelar', …)` en `test/cancel.test.js`, como los tests actuales.
- `canceladas`: por `run('canceladas', [])`, en dos ficheros nuevos, `test/cancelled-list.test.js` (cancela y lista) y `test/cancelled-voided.test.js` (anula, y no sale; sin ninguna).
- Aislamiento: las reservas viven en el módulo y `node --test` ejecuta cada fichero en su propio proceso; solo hay una reserva de siembra (`Norte lun`), así que cada fichero que la cancela o la anula va aparte.

## Términos y ADR

- Términos resueltos: ninguno. Divergencia sin resolver: «Cancelación» en `PRODUCT.md` incluye un plazo de 24 h que `booking-cancellation` no aplica; queda fuera de esta feature
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar pide un motivo de la lista

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun "sala ocupada"`
- THEN responde `cancelada Norte lun (motivo: sala ocupada)` y la reserva deja de estar activa
- AND con `"cambio de planes"` responde `cancelada Norte lun (motivo: cambio de planes)`, y con `"otro"`, `cancelada Norte lun (motivo: otro)`

#### ADDED — Sin motivo válido no se cancela

- GIVEN la reserva activa `Norte lun 10:00-12:00`
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `falta el motivo: elige uno de cambio de planes, sala ocupada, otro` y la reserva sigue activa
- AND con `"vacaciones"` responde `motivo no válido: vacaciones; elige uno de cambio de planes, sala ocupada, otro` y la reserva sigue activa
- AND con `"Sala ocupada"` (otra capitalización) responde `motivo no válido: Sala ocupada; elige uno de cambio de planes, sala ocupada, otro` y la reserva sigue activa
- AND sin comillas, `cancelar Norte lun sala ocupada`, responde `motivo no válido: sala; elige uno de cambio de planes, sala ocupada, otro` y la reserva sigue activa
- AND con `Sur mar` (sin reserva) y motivo `"x"` responde `motivo no válido: x; elige uno de cambio de planes, sala ocupada, otro`

#### ADDED — Cancelar una reserva que no existe

- GIVEN que `Sur mar` no tiene reserva activa
- WHEN se ejecuta `cancelar Sur mar "otro"`
- THEN responde `sin reserva Sur mar`
- AND cancelar por segunda vez `Norte lun "otro"`, ya cancelada, responde `sin reserva Norte lun`
- AND cancelar `Norte lun "otro"` ya anulada con `anular` responde `sin reserva Norte lun`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN la reserva `Norte lun 10:00-12:00` cancelada con motivo `sala ocupada`
- WHEN se ejecuta `canceladas`
- THEN responde `Norte lun 10:00-12:00 · sala ocupada`
- AND sin ninguna cancelada responde `sin canceladas`

#### ADDED — El listado de canceladas no incluye anuladas

- GIVEN la reserva `Norte lun 10:00-12:00` anulada con `anular Norte lun`
- WHEN se ejecuta `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, campo `reason` de la reserva
- **Idioma de los nombres**: castellano en mensajes y motivos
- **Límites**: tres motivos: `cambio de planes`, `sala ocupada`, `otro`
- **Avisos**: `falta el motivo: …` y `motivo no válido: …`, con la lista
- **Regla ante conflicto**: el motivo se valida antes que la reserva

## Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,5h
- Estimación de implementación: 1h
- Base de la estimación: 2 tasks pequeñas en un fichero, sin dependencias
- Confianza: alta

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-12 | aprobada por delegación: «Apruebo la spec por delegación» |
