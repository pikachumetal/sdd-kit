---
id: 20261119-162900-feature-0010-motivo-cancelacion
feature: 0010
title: Motivo al cancelar una reserva
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-11-19
---

# Spec — Motivo al cancelar una reserva

🦆 Al cancelar una reserva hay que decir por qué, eligiendo de una lista: `salas cancelar Norte lun cambio-de-planes`. Si no dices motivo, o dices uno que no está en la lista, no se cancela y te enseña las opciones. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo: `Norte lun 10:00-12:00 · cambio de planes`. Por dentro, la reserva cancelada guarda el motivo junto a su estado.

Validación: dev-lead — lo usa una persona desde la terminal; y la frase de delegación no concede `agente`.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva con motivo de una lista y consultar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

> Spec aprobada por delegación: no hubo entrevista. Lo que habría preguntado va aquí como «pendiente»; cada punto dice de dónde sale.

1. Capacidad nueva `booking-cancellation` — no hay `capabilities/`; el slug va en inglés kebab-case (regla 1 de la plantilla). **Pendiente** de validar.
2. El motivo es **obligatorio**: sin él no se cancela — la fila del roadmap dice «se elige un motivo de una lista»; elegir implica que no se puede omitir. **Pendiente.**
3. El motivo se da como tercer argumento en forma de clave sin espacios: `cambio-de-planes`, `sala-ocupada`, `otro` — los argumentos de `argv` se separan por espacios; las etiquetas con espacio salen solo en pantalla. **Pendiente.**
4. Textos: sin motivo → `falta el motivo: cambio-de-planes, sala-ocupada, otro`; motivo fuera de lista → `motivo no válido: <lo escrito>; usa cambio-de-planes, sala-ocupada, otro`; éxito → `cancelada Norte lun (cambio de planes)`. **Pendiente.**
5. Orden de comprobación: primero que exista la reserva (`sin reserva Sur mar`, sin cambios), luego el motivo — mantiene el comportamiento actual de cancelar sin reserva.
6. «El listado de canceladas» no existe hoy; se crea el comando `canceladas`, una línea por reserva: `Norte lun 10:00-12:00 · cambio de planes`; sin ninguna: `sin canceladas`. **Pendiente.** El orden es el de alta, el del array de reservas.
7. Las **anuladas** (`anular`) no llevan motivo y no salen en `canceladas` — la terminología del producto las distingue de la cancelación y la fila 0011 las trata aparte.
8. Enfoque: A, frente a B y C (ver Approach).
9. La capacidad `booking-cancellation` nace con el comportamiento final completo, incluido lo que ya hace hoy `cancelar` (cancelar sin reserva, cancelar una ya cancelada): no hay `capabilities/` previa, así que todo va como `ADDED`. **Pendiente.**
10. Comparación del motivo exacta y sensible a mayúsculas; los argumentos sobrantes se ignoran — es lo que ya hace `run` con los argumentos extra. **Pendiente.**
11. Una reserva cancelada guarda `reason` junto a `status`; `reason` es siempre una de las tres claves — es el dato que `canceladas` lee.
12. Sin roles ni autenticación: cualquiera que ejecute la CLI cancela y consulta `canceladas` (`operations.md`: «sin login»); la regla de 24 h de la terminología de PRODUCT.md hoy no se comprueba y sigue sin comprobarse.
### Hallazgos de la review

Un revisor (Sonnet, siete puntos; Scope de ~60 líneas, sin contrato público ni `MODIFIED`). Mínimo razonable: no revisar — deja sin mirar escenarios que pasan sin el comportamiento nuevo.

- **Rechazado** (Crítico) — «cancelar sin motivo ya existe: declararla nueva oculta un MODIFIED» → no hay `capabilities/` previa a la que modificar: la fusión solo admite `ADDED`; se explicita en la decisión 9 que la capacidad nace con el comportamiento completo. Sin reescribir el enfoque central: no hay segunda ronda.
- **Aceptado** — «Cancelar sin reserva» pasaba sin implementar → el escenario usa motivo inválido (`cancelar Sur mar aburrimiento`) y fija el orden.
- **Aceptado** — el listado mezclaba escenarios → partido en dos, con dos canceladas (orden) y vacío/anuladas.
- **Aceptado** — regla de 24 h y términos → Scope y decisión 12.
- **Aceptado** — política de mayúsculas y argumentos sobrantes → decisión 10.
- **Aceptado** — Reglas de la capacidad ausentes → sección añadida, con el conflicto «cancelar ya cancelada».
- **Aceptado** — roles/prohibiciones → decisión 12 y escenario «ya cancelada o anulada».
- **Aceptado** — `reason` siempre válido → Intent y decisión 11.
- **Aceptado** — estado compartido entre tests → «Dónde se prueba».
- **Rechazado** (Menor) — sacar las viñetas finales del ✋ → la plantilla las coloca ahí.

- Pasada de coherencia: `sdd capability merge` sobre una copia del delta → OK tras partir «El motivo es obligatorio…» en dos requisitos con su THEN; `git grep` de `cancelar`/`cancelBooking`/`0010` solo da `src/app.js`, `test/cancel.test.js`, la fila del roadmap y `CHANGELOG.md:20` (histórico, no cambia).
- Política de modelos (solo en `delegate`): sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- La spec se aprueba por delegación — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Aprobada por delegación el 2026-11-19 — «Apruebo la spec por delegación; cuando tengas el commit de la Task 1, para.»
- Parada: tras el commit de la Task 1 — «cuando tengas el commit de la Task 1, para»
- Lista de motivos: cambio de planes, sala ocupada, otro — «de una lista: cambio de planes, sala ocupada, otro».

## Intent

Hoy `cancelar <sala> <día>` cancela sin dejar rastro de por qué. Se quiere saber el motivo de cada cancelación. Éxito: toda reserva cancelada tras esta feature tiene exactamente uno de los tres motivos (`reason` nunca queda vacío en una `cancelled`) y `canceladas` lo enseña. Anti-goal: que cancelar se vuelva incómodo o que un motivo inventado se guarde.

## Scope

- Entra: motivo obligatorio y validado en `cancelar`; comando `canceladas`; actualizar los tests existentes de `cancelar` al nuevo formato.
- No entra: motivo en `anular`; texto libre en «otro»; motivos configurables; persistencia (las reservas viven en memoria); la regla de 24 h de PRODUCT.md (no se comprueba hoy y sigue sin comprobarse); roles o permisos.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo deja de cancelar | `src/app.js:13` (`cancelBooking`), `src/app.js:30` (`run`); `test/cancel.test.js:6` | delta `ADDED — Cancelar exige motivo`; el test de éxito pasa a llevar motivo (Task 1) |
| `cancelar` sin reserva con motivo | `test/cancel.test.js:10` | sin cambio de comportamiento (se comprueba la reserva antes que el motivo, decisión 5); el test sigue verde |

- Filas que implementa: 0010 → `ROADMAP.md` (la fila) → pasa a hecha al cerrar; ningún otro fichero la nombra.

## Approach

- A — guardar `reason` en la reserva y validarlo en `cancelBooking` contra una constante `CANCEL_REASONS`; `canceladas` filtra `status === 'cancelled'` — un solo fichero, sin estructura nueva.
- B — módulo aparte `cancellation.js` — el proyecto es de un solo fichero de entrada (architecture.md); sobrediseño.
- C — motivo opcional con valor por defecto `otro` — esconde la elección; contradice «se elige».
- Elegido: A — encaja con la arquitectura de un fichero y es lo mínimo que cumple la fila.

La lista vive en una constante `CANCEL_REASONS = { 'cambio-de-planes': 'cambio de planes', 'sala-ocupada': 'sala ocupada', otro: 'otro' }`.

## Dónde se prueba

- cancelar con motivo / sin motivo / motivo inválido / sin reserva: unitario por `run('cancelar', …)`, como los de `test/cancel.test.js`.
- `canceladas`: unitario por `run('canceladas', [])`, en el mismo fichero.
- Estado: `bookings` es un array en memoria compartido entre tests; cada test prepara su propia reserva (sala y día distintos o reinicio) para no depender del orden. El test existente de `anular`, si lo hay, no cambia.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar con motivo

- GIVEN reserva activa `Norte lun`
- WHEN `cancelar Norte lun sala-ocupada`
- THEN responde `cancelada Norte lun (sala ocupada)` y la reserva queda cancelada con ese motivo
- AND los motivos válidos son `cambio-de-planes`, `sala-ocupada` y `otro`

#### ADDED — Cancelar exige motivo

- GIVEN reserva activa `Norte lun`
- WHEN `cancelar Norte lun`
- THEN responde `falta el motivo: cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa

#### ADDED — El motivo debe ser de la lista

- GIVEN reserva activa `Norte lun`
- WHEN `cancelar Norte lun aburrimiento`
- THEN responde `motivo no válido: aburrimiento; usa cambio-de-planes, sala-ocupada, otro` y la reserva sigue activa

#### ADDED — Cancelar sin reserva

- GIVEN no hay reserva activa `Sur mar`
- WHEN `cancelar Sur mar aburrimiento`
- THEN responde `sin reserva Sur mar` (la reserva se comprueba antes que el motivo)

#### ADDED — Cancelar una reserva ya cancelada o anulada

- GIVEN `Norte lun` ya cancelada (o anulada)
- WHEN `cancelar Norte lun otro`
- THEN responde `sin reserva Norte lun` y no cambia su motivo

#### ADDED — Listado de canceladas

- GIVEN `Norte lun 10:00-12:00` cancelada por `cambio-de-planes` y `Sur mar 09:00-10:00` cancelada por `otro`
- WHEN `canceladas`
- THEN responde una línea por reserva, en orden de alta: `Norte lun 10:00-12:00 · cambio de planes` y `Sur mar 09:00-10:00 · otro`

#### ADDED — Listado de canceladas vacío o con anuladas

- GIVEN ninguna reserva cancelada, o solo `Norte lun` anulada
- WHEN `canceladas`
- THEN responde `sin canceladas`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria, en la propia reserva (`status`, `reason`); sin persistencia.
- **Idioma de los nombres**: claves de motivo en castellano con guiones (`cambio-de-planes`); etiquetas en pantalla con espacios (`cambio de planes`).
- **Límites**: lista cerrada de tres motivos: `cambio-de-planes`, `sala-ocupada`, `otro`.
- **Avisos**: `falta el motivo: cambio-de-planes, sala-ocupada, otro` · `motivo no válido: <lo escrito>; usa cambio-de-planes, sala-ocupada, otro` · `sin reserva <sala> <día>` · `sin canceladas`.
- **Regla ante conflicto**: solo se cancela una reserva activa; una cancelada o anulada responde `sin reserva`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture (por delegación) | 2026-11-19 | aprobada: «Apruebo la spec por delegación» |
