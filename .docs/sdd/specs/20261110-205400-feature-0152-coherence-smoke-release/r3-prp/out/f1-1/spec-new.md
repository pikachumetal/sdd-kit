---
id: 20261111-193520-feature-0010-motivo-cancelar
feature: 0010
title: Motivo al cancelar
mode: full
status: approved
created: 2026-11-11
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-11
---

# Spec — Motivo al cancelar

🦆 Al cancelar una reserva ahora hay que decir por qué, eligiendo de una lista cerrada: `cambio de planes`, `sala ocupada` u `otro`. Por ejemplo, `cancelar Norte lun "sala ocupada"` responde `cancelada Norte lun (sala ocupada)`; sin motivo, o con uno que no está en la lista, no cancela y enseña las opciones. Además hay un comando nuevo, `canceladas`, que lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 · sala ocupada`. Aviso: las reservas viven en memoria y cada comando de terminal es un proceso nuevo, así que `canceladas` solo verá las cancelaciones del mismo proceso (hoy, los tests); que se recuerden entre comandos es otra feature.

Validación: dev-lead — es comportamiento que usa una persona desde la terminal y la frase de delegación no nombra `agente`.

## Capacidades

- Nuevas: `reservation-cancellation` — cancelar una reserva con motivo de una lista cerrada y listar las canceladas con su motivo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservation-cancellation`), contrato público (cambia la forma de `cancelar` y aparece `canceladas`, comandos que consume quien usa la terminal), regla de negocio (lista de motivos) · tamaño: ~40 líneas en 4 ficheros
- Dominio (opus): si «motivo obligatorio» y la lista cerrada de tres cubren lo que pide la fila 0010, y qué NO debe pasar (reserva ya anulada o ya cancelada no se toca, `anular` no pide motivo) (señal: regla de negocio)
- Técnica (sonnet): si el orden «valida motivo antes de buscar la reserva» y el texto de error son consistentes entre THENs, y si cada THEN se puede observar con el estado en memoria que dejan los demás tests (señal: contrato público)
- Mínimo razonable (no aplicado; se despacharon los dos): solo técnica — habría dejado sin mirar si la lista de motivos y el alcance de `canceladas` son los que el dev-lead quería

1. Lista de motivos exacta: `cambio de planes`, `sala ocupada`, `otro` — la dio el dev-lead en la fila 0010; se compara en minúsculas y exacto, sin tolerar mayúsculas (YAGNI).
2. El motivo es el 3.er argumento de `cancelar`; si hay más palabras se unen con espacio, así `cancelar Norte lun cambio de planes` funciona sin comillas. `run` recibe los argumentos ya separados por el shell; con comillas llega uno solo, sin ellas varios, y `slice(2).join(' ')` cubre ambos. Un resto que no forma un motivo exacto (`otro extra`) es inválido.
3. Motivo obligatorio: sin él, o con uno fuera de la lista, no se cancela y responde `motivo no válido: elige cambio de planes, sala ocupada u otro` — texto mío.
4. El motivo se valida antes de buscar la reserva: con motivo inválido y sin reserva, responde el error de motivo, no `sin reserva …`.
5. Respuesta de éxito: `cancelada Norte lun (sala ocupada)` — cambia la forma de la respuesta actual `cancelada Norte lun`; texto mío.
6. «El listado de canceladas» no existe hoy: lo creo como comando nuevo `canceladas` (sin argumentos), una reserva por línea `Norte lun 10:00-12:00 · sala ocupada`, y `sin canceladas` si no hay; texto mío. Orden de las líneas: el de inserción en memoria; hoy solo hay una reserva sembrada (Norte lun), así que el orden con varias **no se puede observar** y queda sin test. Las anuladas (`voided`) no salen: son otra cosa (PRODUCT.md, «Anulación»).
7. `anular` no cambia: no pide motivo (la fila 0011 trata las anulaciones). Una reserva cancelada o anulada deja de estar activa: volver a cancelarla o anularla responde `sin reserva …`, no cambia su motivo ni su estado.
8. Capacidad nueva `reservation-cancellation`: slug en inglés kebab-case por la regla de la plantilla de capacidades; evito `booking` porque PRODUCT.md lo marca «evitar» en el término Reserva. Los identificadores de código existentes (`cancelBooking`, `status`) no se renombran.
9. Los dos tests existentes de `cancelar` se actualizan para pasar un motivo (la respuesta de éxito cambia); es un cambio de forma, no un `MODIFIED`, porque no hay capacidad vigente.
10. Enfoque: A (motivo como 3.er argumento, lista cerrada validada en `src/app.js`), frente a B (motivo opcional con valor por defecto `otro`) y C (modo interactivo que pregunta). Ver Approach.
11. «Cancelación» en PRODUCT.md es la que hace el propio cliente antes de 24 h. Esta feature no implementa ninguna de las dos condiciones (no hay identidad ni fechas hoy): el comando `cancelar` existente solo gana motivo. Lo dejo declarado y no toco PRODUCT.md; cuando existan, se añadirán a la capacidad. `sala ocupada` está en la lista que dio el dev-lead aunque suene a anulación: lo elige quien cancela.
12. Las reservas siguen en memoria (`operations.md`): `canceladas` ve solo lo cancelado en el mismo proceso. El éxito de la feature se mide por `run()`, no por usar la terminal en comandos sueltos.
13. Para probar cada THEN con el estado en memoria, `src/app.js` exporta `resetBookings()`, que restaura la reserva sembrada (Norte lun, 10:00-12:00, activa); los tests la llaman antes de cada caso. Es un cambio interno, no de comportamiento.
- Reglas de la capacidad `reservation-cancellation`: datos → en memoria, campo `reason` de la reserva cancelada; idioma de los nombres → castellano en lo que ve quien usa la terminal (comandos, textos, motivos); límites → lista cerrada de tres motivos; avisos → los tres textos: el error de motivo, `sin reserva <sala> <día>` y `sin canceladas`; regla ante conflicto → cancelada y anulada son estados finales: gana la primera acción, la segunda responde `sin reserva …`. Sin «Reglas de producto» en la constitution a las que atenerse.
14. `cancelar` sin sala o sin día (`cancelar`, `cancelar Norte`) no tiene tratamiento propio: como el motivo se valida primero y queda vacío, responde `motivo no válido: …`. `canceladas` ignora los argumentos que reciba. No hay texto de ayuda ni de uso en `src/app.js` que haya que actualizar.
15. Salida de la terminal: el error de motivo es solo texto por stdout con código de salida 0, como el resto de respuestas de `run` (`sin reserva …`); no introduzco códigos de salida distintos. Cancelar sin motivo deja de cancelar: es un cambio rompedor para quien lo automatice, aceptado por la fila 0010.
- Resultado de `sdd capability merge` sobre una copia de `.docs/sdd` (2026-11-11), repetido con la spec ya corregida por los hallazgos: exit 0 — «añadido» los dos requisitos y sus cinco reglas.
- Política de modelos: revisores de la spec: dominio opus, técnica sonnet (y, si hay segunda ronda, un revisor sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): capacidad `booking-cancellation` choca con «evitar booking» → renombrada `reservation-cancellation` (decisión 8).
- **Aceptado** — Crítico (dominio): la capacidad no cumple las 24 h ni «el propio cliente» de PRODUCT.md → diferencia declarada, decisión 11.
- **Aceptado** — dominio: Intent mezclaba cancelar y anular → Intent reescrito; `sala ocupada` en decisión 11.
- **Aceptado** — dominio 4 y técnica 7: memoria por proceso → decisiones 12 y 13, y aviso en la 🦆.
- **Aceptado** — dominio 5, 6, 9: estados finales y `anular` → decisión 7, regla ante conflicto y tres escenarios nuevos.
- **Aceptado** — dominio 7, 8; técnica 8: Scope y avisos completos; forma de la reserva en Approach.
- **Aceptado** — técnica 1, 2, 4, 5: escenarios de `libres`, `me aburro` sin reserva y `otro extra`; decisiones 2, 6 y 7.
- **Rechazado** — dominio 10 y técnica 3 (escenario con dos canceladas): solo existe una reserva sembrada y no hay comando que cree otras; el orden queda declarado sin observar (decisión 6).
- **Rechazado** — técnica 9 (separar citas): la delegación y la parada están en una sola frase literal del dev-lead; se citan por separado en «Decisiones tomadas con el dev-lead».
- **Aceptado** — técnica 6: el escenario de `anular` cita `anulada Norte lun` y el estado `voided` en el Approach.

- **Aceptado** — 2.ª ronda 1, 4, 5, 6, 7, 8, 9: escenario anulada→cancelar y `Otro` en mayúscula; decisiones 14 y 15; Scope con el fichero nuevo; `Sur mar` reescrito; línea del mínimo aclarada.
- **Rechazado** — 2.ª ronda 2 y 10 (apuntar la persistencia y la reconciliación del término 24 h/cliente en roadmap o deuda): abrir filas de roadmap es planificar, no lo decide esta feature; queda dicho en las decisiones 11 y 12 y se lo señalo al dev-lead al entregar.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación (2026-11-11) — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parar al tener el commit de la Task 1, antes de la Task 2 — «cuando tengas el commit de la Task 1, para.»
- Lista de motivos y que el listado de canceladas lo enseñe — fila 0010 del roadmap: «al cancelar una reserva se elige un motivo de una lista, y el listado de canceladas lo enseña»; la lista, «cambio de planes, sala ocupada, otro».

## Intent

Hoy `cancelar Norte lun` cancela la reserva sin dejar rastro de por qué, y no hay forma de ver las canceladas. Importa porque quien gestiona las salas no sabe si se liberan por un cambio de planes o porque la sala estaba ocupada. Éxito: no se puede cancelar sin uno de los tres motivos, y `canceladas` los enseña dentro del mismo proceso. Fracasaría, aunque funcionara, si una cancelación sin motivo válido llegara a cancelar la reserva.

## Scope

- Entra: `cancelar <sala> <día> <motivo>` con motivo obligatorio de la lista cerrada; la reserva guarda el motivo; la respuesta de éxito pasa a `cancelada <sala> <día> (<motivo>)`; error con las opciones si falta o no es válido; `canceladas` con el motivo de cada una; `resetBookings()` exportado para los tests; el fichero nuevo `test/cancelled.test.js`; actualizar los dos tests existentes de `cancelar`.
- No entra: pedir motivo al anular (`anular`, fila 0011); la condición de 24 h y que cancele el propio cliente (no existen hoy); persistencia de las reservas entre comandos; filtros del listado (por sala o día); tolerancia a mayúsculas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Respuesta `cancelada <sala> <día>` (pasa a `cancelada <sala> <día> (<motivo>)`) | `src/app.js:17`; `test/cancel.test.js:6` | Scope + decisión 5; el test se actualiza en la Task 1 |
| `cancelar <sala> <día>` sin motivo (deja de cancelar) | `src/app.js:30`; `test/cancel.test.js:6` y `:10` | Scope + decisión 3; los dos tests pasan un motivo en la Task 1 |
| Código de salida de `cancelar` sin motivo | `src/app.js:30` | decisión 15: solo texto, exit 0 |
| `CHANGELOG.md:20` «Cancelar una reserva propia.» | histórico de una versión ya publicada | se queda: lo escribe el corte de `sdd-end-release`, no esta feature |
| `PRODUCT.md:13` término «Cancelación» | definición de dominio, no cambia | se queda: decisión 11 declara la diferencia |

- Filas que implementa: 0010 → `ROADMAP.md:7` (estado, lo cambia `sdd-archive`) | ningún otro fichero la nombra: comprobado con `git grep -n 0010`

## Approach

- A: motivo como 3.er argumento obligatorio, lista cerrada validada en `src/app.js` — la lista vive en una constante; es lo más pequeño y se prueba por `run()`, como los tests actuales.
- B: motivo opcional con `otro` por defecto — no obliga a elegir, y la fila pide «se elige un motivo».
- C: modo interactivo que pregunta por la lista — `run()` es síncrona y los tests la llaman con argumentos; añadiría lectura de la entrada estándar.
- Elegido: A — es lo único que impide cancelar sin motivo sin cambiar la forma de probar la aplicación.

Forma de la reserva hoy (leída de `src/app.js`): `{ room, day, slot, status }` con `status` en `active | cancelled | voided`; `findBooking` solo encuentra las `active`. A añade `reason` a las canceladas. Partes del cómo: constante `CANCEL_REASONS = ['cambio de planes', 'sala ocupada', 'otro']`; `cancelBooking(room, day, reason)` valida `reason` antes de `findBooking` y guarda `booking.reason`; `run` pasa `params.slice(2).join(' ')`; `run('canceladas')` filtra `status === 'cancelled'`; `bookings` pasa a `let` y `resetBookings()` lo restaura a la reserva sembrada.

## Dónde se prueba

- Cancelar con motivo (éxito, sin motivo, motivo fuera de lista, `otro extra`, sin comillas, sin reserva, ya cancelada, `anular`): por `run('cancelar' | 'anular', …)`, como los tests actuales de `test/cancel.test.js`, con `resetBookings()` antes de cada caso.
- Listado `canceladas`: por `run('canceladas', [])` en `test/cancelled.test.js`, también con `resetBookings()` antes de cada caso.

## Términos y ADR

- Términos resueltos: ninguno (la diferencia con «Cancelación» de PRODUCT.md está en la decisión 11)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reservation-cancellation`

#### ADDED — La cancelación pide un motivo de la lista

- GIVEN reserva sembrada activa Norte lun 10:00-12:00 (`libres 10:00-12:00` responde `Sur`)
- WHEN `cancelar Norte lun "sala ocupada"`
- THEN responde `cancelada Norte lun (sala ocupada)`
- AND la reserva deja de estar activa: `libres 10:00-12:00` responde `Norte, Sur`

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun` sin motivo
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`
- AND la reserva sigue activa: `libres 10:00-12:00` responde `Sur`

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun "me aburro"`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`
- AND la reserva sigue activa

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun Otro` (con mayúscula)
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`
- AND la reserva sigue activa

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun otro extra`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`
- AND la reserva sigue activa

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `cancelar Norte lun cambio de planes` (sin comillas)
- THEN responde `cancelada Norte lun (cambio de planes)`

- GIVEN no existe reserva activa de Sur el martes (`mar`)
- WHEN `cancelar Sur mar otro`
- THEN responde `sin reserva Sur mar`

- GIVEN no existe reserva activa de Sur el martes (`mar`)
- WHEN `cancelar Sur mar` sin motivo, o `cancelar Sur mar "me aburro"`
- THEN responde `motivo no válido: elige cambio de planes, sala ocupada u otro`

- GIVEN Norte lun cancelada por `sala ocupada`
- WHEN `cancelar Norte lun otro`
- THEN responde `sin reserva Norte lun`
- AND `canceladas` sigue enseñando `Norte lun 10:00-12:00 · sala ocupada`

- GIVEN reserva activa Norte lun 10:00-12:00
- WHEN `anular Norte lun`
- THEN responde `anulada Norte lun`, sin pedir motivo

- GIVEN Norte lun anulada con `anular Norte lun`
- WHEN `cancelar Norte lun otro`
- THEN responde `sin reserva Norte lun`
- AND `canceladas` responde `sin canceladas`

- GIVEN Norte lun cancelada por `otro`
- WHEN `anular Norte lun`
- THEN responde `sin reserva Norte lun`
- AND `canceladas` sigue enseñando `Norte lun 10:00-12:00 · otro`

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN Norte lun 10:00-12:00 cancelada por `cambio de planes`
- WHEN `canceladas`
- THEN responde `Norte lun 10:00-12:00 · cambio de planes`

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde `sin canceladas`

- GIVEN Norte lun 10:00-12:00 anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — reservation-cancellation

- **Dónde viven los datos**: en memoria, campo `reason` de la reserva cancelada
- **Idioma de los nombres**: castellano en lo que ve quien usa la terminal (comandos, textos y motivos)
- **Límites**: lista cerrada de tres motivos: `cambio de planes`, `sala ocupada`, `otro`
- **Avisos**: `motivo no válido: elige cambio de planes, sala ocupada u otro`; `sin reserva <sala> <día>`; `sin canceladas`
- **Regla ante conflicto**: cancelada y anulada son estados finales; gana la primera acción y la segunda responde `sin reserva <sala> <día>`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-11 | aprobada por delegación: «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.» |
