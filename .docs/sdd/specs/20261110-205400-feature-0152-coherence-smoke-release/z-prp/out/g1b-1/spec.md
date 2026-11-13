---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Hoy `cancelar Norte lun` libera la sala y no queda constancia de por qué. Con esta feature, cancelar exige elegir un motivo de una lista cerrada (cambio de planes, sala ocupada, otro): sin motivo o con uno que no está en la lista, la reserva no se cancela. Un comando nuevo, `canceladas`, lista las reservas canceladas con su motivo. Las anulaciones del responsable de sala no salen en ese listado: son de la 0011.

## Capacidades

- Modificadas: `bookings` — cancelar exige un motivo de la lista y el comando `canceladas` lista las canceladas con su motivo.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (cambia la respuesta de `cancelar`, hoy «cancelada Norte lun»), datos (motivo nuevo en la reserva) · tamaño: ~30 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`)
- Dominio (opus): si cambiar `cancelar` contradice PRODUCT.md y de dónde sale «quién canceló» (señal: MODIFIED)
- Técnica (sonnet): qué pasa sin `--motivo`, dónde vive el motivo y si cada THEN se puede pasar sin el comportamiento (señal: datos)
- Mínimo razonable: solo técnica — deja sin mirar la contradicción con la terminología de PRODUCT.md (un único usuario, la Cancelación es la del propio cliente)

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista. «otro» va solo, sin texto libre.
2. El listado de canceladas enseña sala, día y motivo, una línea por reserva, con el formato «Norte lun — sala ocupada». **Sin «quién canceló»**: PRODUCT.md dice que hay un único usuario y que la Cancelación la hace el propio cliente, así que ese dato no aporta nada. Si lo que se quería era el titular, es otra fila.
3. `--motivo` es obligatorio. Sin él, `cancelar` responde «falta el motivo: cambio de planes, sala ocupada, otro» y la reserva sigue activa. Primero se comprueba que la reserva exista: `cancelar Sur mar` sin reserva sigue respondiendo «sin reserva Sur mar», como hoy.
4. El motivo tiene que coincidir exactamente con uno de la lista (minúsculas y con espacios, como está escrito): «Sala ocupada» no vale. Si no coincide, responde «motivo no válido: cambio de planes, sala ocupada, otro», con los tres motivos.
5. Volver a cancelar una reserva ya cancelada responde «sin reserva Norte lun», como hoy: una cancelada no se reactiva ni cambia de motivo.
6. `canceladas` sin ninguna cancelada responde «sin canceladas». Las anuladas (`anular`) no salen en el listado.
7. La regla de las 24 h de PRODUCT.md no entra: hoy el comando no maneja fechas, solo el día de la semana. Es una divergencia con la terminología que ya existe y que esta feature no amplía. Si quieres que se cumpla, va en una fila nueva del roadmap.
8. El motivo se guarda en la propia reserva, en memoria, como el resto de los datos. No hay canceladas anteriores con las que migrar nada.

### Hallazgos de la review

- **Aceptado** — (dominio 1, técnica 6) el ADDED de cancelar es en realidad un MODIFIED no declarado → pasa a `MODIFIED — Cancelar una reserva`, con el texto de antes y el nuevo.
- **Rechazado** — (dominio 2) la reserva cancelada se queda guardada con un estado nuevo y eso cambia lo que hace cancelar → ya pasa hoy: `src/app.js` marca la reserva como cancelada y `libres` solo cuenta las activas. No cambia, y no hace falta un requisito nuevo.
- **Aceptado** — (dominio 3, técnica 3, dominio 9) «quién canceló» crea un actor que el producto no tiene y el THEN se cumple con un valor fijo → se quita del listado, de la decisión 2 y del ejemplo («Ana»).
- **Aceptado** — (dominio 4) el Intent no pide el listado → el Intent recoge el listado, que sale de la fila del roadmap («el listado de canceladas lo enseña»). Se declara que no hay canceladas antiguas que migrar (decisión 8).
- **Aceptado** — (técnica 2, técnica 5) no se dice qué pasa sin `--motivo` y faltan decisiones → decisiones 3 a 6, cada una con su escenario.
- **Aceptado** — (técnica 1) nada comprueba que el motivo quede guardado, y el motivo inválido no exige que la reserva siga activa → el listado se prueba cancelando por el comando y después llamando a `canceladas`. Sin motivo o con motivo inválido, `canceladas` sigue respondiendo «sin canceladas».
- **Aceptado en parte** — (técnica 4) faltan el listado vacío, varias canceladas y una reserva activa que no debe salir → se añaden el listado vacío y el de una anulada. No se añade el de varias canceladas: la única reserva de partida es la de Norte del lunes y `reservar` no crea reservas. El orden queda declarado en la decisión 2.
- **Aceptado** — (dominio 5) falta lo que no hace una cancelada → escenario de cancelar dos veces (decisión 5). Que la sala queda libre ya lo garantiza `libres`, y eso no cambia.
- **Aceptado** — (dominio 6) falta «Reglas de la capacidad» → sección añadida.
- **Aceptado** — (dominio 7, técnica 10) la franja del GIVEN no la usa el comando → se quita. Que sala + día identifique la reserva es lo que ya hace hoy, y no se cambia.
- **Aceptado en parte** — (dominio 8, técnica 8) la regla de las 24 h y la frontera con las anulaciones → las 24 h no entran (decisión 7); las anuladas no salen en el listado (decisión 6, con escenario).
- **Aceptado** — (técnica 7) no se dice dónde se guarda el motivo → decisión 8 y «Reglas de la capacidad».
- **Aceptado** — (técnica 9) «Dónde se prueba» no concreta → un caso por escenario en `test/cancel.test.js`, llamando a `run()` como los tests de hoy.

Segunda ronda (un revisor, sonnet), sin críticos:
- **Aceptado** — (2.1) el MODIFIED solo prueba «sala ocupada» → el escenario cubre los tres motivos válidos y el «Ahora» dice la respuesta nueva.
- **Aceptado** — (2.2) la decisión 4 no tiene escenario → caso «Sala ocupada» (mayúscula) en el escenario de motivo inválido. No se añade `--motivo` sin valor: se trata como motivo vacío, que no coincide, y responde «motivo no válido…».
- **Aceptado** — (2.3) el orden «primero la reserva» no tiene escenario → escenario nuevo con Sur del martes, sin motivo y con motivo inválido.
- **Aceptado** — (2.4) el GIVEN de la cancelada no dice cómo se prepara → se prepara cancelando por el comando.
- **Aceptado** — (2.5) el orden del listado no tiene THEN → sale de la decisión 2 y del Approach. Que `reservar` no crea reservas está comprobado en el código: hoy responde «reserva semanal creada» sin añadir nada.
- **Aceptado** — (2.6) qué responde `anular` → ya existe y responde «anulada Norte lun»; el escenario lo comprueba, y `anular` no se toca.
- **Rechazado** — (2.7) declarar la divergencia de las 24 h → ya es la decisión 7; se le añade que su cumplimiento iría en una fila nueva.
- **Rechazado** — (2.8) separar lo decidido con el dev-lead → la decisión 1 ya dice que viene de la entrevista; las demás son mías y están en esta sección para que las valides.
- **Aceptado** — (2.9) el aviso «motivo no válido» no está en las decisiones → va en la decisión 4.
- **Aceptado** — (2.10) el escenario mezcla listado vacío y anuladas → se divide en dos requisitos, y el de anuladas comprueba la respuesta de `anular`.

## Intent

Hoy cancelar no deja rastro de por qué se liberó una sala. Se quiere elegir el motivo de cada cancelación de una lista y poder ver las canceladas con su motivo.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`, con el motivo obligatorio; comando nuevo `canceladas`; el test de hoy «cancelar una reserva activa» pasa a llevar motivo.
- No entra: anulaciones del responsable de sala (0011); la regla de las 24 h; quién canceló.

## Approach

El motivo se guarda en la propia reserva al cancelarla. `canceladas` lista las reservas con estado cancelada.

## Reglas de la capacidad

- Dónde vive el dato: el motivo vive en la reserva cancelada, en memoria, como el resto de las reservas.
- Idioma de los nombres: castellano en todo lo que ve el usuario (constitución, regla 4): `--motivo`, `canceladas` y los mensajes.
- Límites: lista cerrada de 3 motivos; «otro» sin texto libre.
- Avisos: «falta el motivo: cambio de planes, sala ocupada, otro» y «motivo no válido: cambio de planes, sala ocupada, otro».
- Regla en conflicto: si la reserva no existe o ya está cancelada, responde «sin reserva <sala> <día>», sin mirar el motivo.

## Dónde se prueba

- Todos los escenarios, en `test/cancel.test.js`, un caso por escenario, llamando a `run()` en el mismo proceso, como los tests de hoy.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Cancelar una reserva**
- Antes: `cancelar Norte lun` cancela la reserva activa y responde «cancelada Norte lun».
- Ahora: cancelar exige un motivo de la lista y lo dice en la respuesta: «cancelada <sala> <día> (<motivo>)». Sin motivo o con uno fuera de la lista, no cancela (requisito siguiente).
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo <motivo>`, con cada motivo de la lista
- THEN responde, según el motivo:

| Motivo | Respuesta |
| --- | --- |
| sala ocupada | «cancelada Norte lun (sala ocupada)» |
| cambio de planes | «cancelada Norte lun (cambio de planes)» |
| otro | «cancelada Norte lun (otro)» |

**ADDED — Sin motivo o con un motivo fuera de la lista no se cancela**
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin canceladas»
- WHEN `cancelar Norte lun --motivo "por si acaso"`, y también con `--motivo "Sala ocupada"`
- THEN las dos responden «motivo no válido: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin canceladas»

**ADDED — Sin reserva, la respuesta no depende del motivo**
- GIVEN que Sur no tiene reserva el martes
- WHEN `cancelar Sur mar`, y también con `--motivo "por si acaso"`
- THEN las dos responden «sin reserva Sur mar»

**ADDED — Una reserva cancelada no se vuelve a cancelar**
- GIVEN la reserva de Norte del lunes, cancelada con `cancelar Norte lun --motivo "sala ocupada"`
- WHEN `cancelar Norte lun --motivo "otro"`
- THEN responde «sin reserva Norte lun»
- AND `canceladas` responde «Norte lun — sala ocupada»

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo "cambio de planes"` y después `canceladas`
- THEN `canceladas` responde «Norte lun — cambio de planes»

**ADDED — El listado sin canceladas lo dice**
- GIVEN la reserva activa de Norte del lunes y ninguna cancelada
- WHEN `canceladas`
- THEN responde «sin canceladas»

**ADDED — El listado de canceladas no enseña las anuladas**
- GIVEN la reserva activa de Norte del lunes
- WHEN `anular Norte lun` y después `canceladas`
- THEN `anular` responde «anulada Norte lun»
- AND `canceladas` responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
