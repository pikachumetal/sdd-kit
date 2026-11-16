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

🦆 Hoy, cuando cancelas una reserva, no queda ningún rastro de por qué. Con este cambio, `cancelar` te pide uno de tres motivos fijos y lo guarda con la reserva. Un comando nuevo, `canceladas`, lista las reservas canceladas junto con su motivo. Hay un cambio que notarás: `cancelar` sin `--motivo` deja de cancelar y te dice qué motivos admite.

## Capacidades

- Modificadas: `bookings`. Cancelar exige un motivo de la lista y lo guarda, y el comando nuevo `canceladas` lo enseña.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (cambia la interfaz y la respuesta de `cancelar`), MODIFIED (Cancelar), datos (el motivo, nuevo dato de la reserva) · tamaño: ~40 líneas en 2 ficheros
- Dominio (opus): si el cambio de `cancelar` es un MODIFIED y si «quién canceló» encaja con un producto de un solo usuario (señal: MODIFIED + datos)
- Técnica (sonnet): qué pasa con `cancelar` sin `--motivo`, de dónde sale el cancelador y si el listado tiene casos sin definir (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos. Dejaría sin una lente propia la contradicción con PRODUCT.md (un solo usuario)
```

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro. Lo decidiste tú en la entrevista (ver «Decisiones tomadas con el dev-lead»).
2. **«Quién canceló» sale del listado.** PRODUCT.md dice que hay un solo usuario, y una cancelación la hace siempre el propio titular, así que el dato sería siempre el mismo. El Intent pide solo el «por qué». `canceladas` enseña sala, día y motivo.
3. **`cancelar` sin `--motivo` no cancela.** Responde «falta el motivo: cambio de planes, sala ocupada, otro» y la reserva sigue activa. Esto rompe el uso actual del comando. Lo asumo porque el único usuario eres tú, y el test actual «cancelar una reserva activa» pasa a llevar motivo.
4. El motivo se compara de forma exacta: en minúsculas y tal como aparece en la lista. «Sala ocupada», con mayúscula, es un motivo no válido.
5. Las reservas anuladas no salen en `canceladas`. `anular` ya existe, y la 0011 lo restringe al responsable de la sala.
6. Textos de salida: «cancelada Norte lun (sala ocupada)», «motivo no válido: cambio de planes, sala ocupada, otro», «falta el motivo: …», una línea por cancelación con el formato «Norte lun — sala ocupada», en el orden en que se cancelaron, y «sin canceladas» si no hay ninguna.
7. **Creo el comando `canceladas` y el flag `--motivo`.** La fila del roadmap pide que «el listado de canceladas lo enseñe», y hoy no existe ningún listado.
8. El motivo se valida antes de buscar la reserva: con un motivo malo sobre un día sin reserva, gana «motivo no válido». El valor de `--motivo` es el argumento que le sigue: un motivo de varias palabras va entre comillas, y `--motivo` sin valor cuenta como «falta el motivo».
9. Cada cancelación es su propia línea en `canceladas`: no se agrupan.

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): el cambio de `cancelar` estaba declarado como ADDED → ahora es «MODIFIED — Cancelar exige un motivo de la lista», con la respuesta anterior y la nueva.
- **Aceptado** — Crítico (dominio y técnica): no se decía qué pasa sin `--motivo` → nuevo escenario y decisión 3.
- **Aceptado** — Crítico (dominio y técnica): «quién canceló» no salía de ningún dato y el ejemplo «Ana» contradecía la idea de un solo usuario → se quita del listado (decisión 2).
- **Aceptado** — Importante (dominio): «quién» era alcance oculto frente al Intent → se ha resuelto con la decisión 2.
- **Aceptado** — Importante (técnica): el THEN solo probaba «sala ocupada» → el rechazo tiene su propio escenario y hay una batería con los tres motivos.
- **Aceptado** — Importante (técnica): con un motivo inválido no se decía en qué estado quedaba la reserva, ni cómo se compara el motivo → THEN «la reserva sigue activa» y decisión 4.
- **Aceptado** — Importante (dominio y técnica): faltaban el listado vacío y el orden → escenario «sin canceladas» y orden de cancelación (decisión 6). Cancelaciones antiguas sin motivo: no hay, porque las reservas viven en la memoria del proceso (ver Reglas).
- **Aceptado** — Importante (técnica): no se declaraban el contrato ni la persistencia → Scope y Approach dicen que cambia la interfaz de `cancelar` y que el motivo es un campo de la reserva en memoria, sin migración.
- **Aceptado** — Importante (técnica): `canceladas` podía mezclar anulaciones → decisión 5 y su THEN.
- **Aceptado** — Importante (dominio): el estado «cancelada» no decía qué prohíbe → Reglas: libera la franja (comportamiento de hoy), no se cancela dos veces («sin reserva …», como hoy).
- **Aceptado** — Importante (dominio): faltaba «Reglas de la capacidad» → la sección está añadida con las cinco reglas.
- **Rechazado** — Importante (técnica): la regla de las 24 h de PRODUCT.md → `cancelar` no la aplica hoy, y esta feature no la introduce. Va a «No entra».
- **Aceptado** — Menor (técnica): los textos de salida no estaban entre las decisiones → decisión 6. La antigua decisión 3 («sin review») se elimina: no era una decisión del agente.
- **Rechazado** — Menor (técnica): el fixture y la dependencia de orden entre tests → es cómo se prueba, no qué se comporta. Lo fija el plan.
- **Rechazado** — Menor (dominio): «sala ocupada» parece motivo de anulación → la lista la fijaste tú en la entrevista. Te lo señalo por si quieres revisarla.
- **Aceptado** — Menor (dominio): la franja del GIVEN no se usaba → se quita. En el seed hay una reserva por sala y día.

Segunda ronda (un revisor, sonnet, los siete puntos):

- **Aceptado** — Crítico: el caso sin motivo cambiaba la respuesta actual y seguía como ADDED → ahora es una fila del MODIFIED.
- **Aceptado** — Crítico: el «Antes» no tenía fuente, porque no existe `capabilities/` → el «Antes» cita `src/app.js` y `test/cancel.test.js`, y la capacidad `bookings` se crea al archivar.
- **Aceptado** — Importante: no se comprobaba que la reserva siguiera activa tras un rechazo → AND con un `cancelar … --motivo "otro"` que sí cancela.
- **Aceptado** — Importante: las filas de la batería compartían estado → cada fila parte de su propio GIVEN.
- **Aceptado** — Importante: la comparación exacta, el orden y el conflicto no tenían escenario → filas «Sala ocupada», el listado con dos líneas en orden y el escenario de conflicto.
- **Aceptado** — Importante: la precedencia de errores y el parseo del flag → decisión 8 y su escenario.
- **Aceptado** — Importante: no estaba claro si una franja cancelada dos veces sale una o dos veces → decisión 9. `reservar` no crea reservas sueltas hoy, así que no hay escenario de volver a reservar.
- **Aceptado** — Importante: el comando y el flag nuevos no figuraban como decisión → decisión 7.
- **Rechazado** — Menor: alinear el término «Cancelación» de PRODUCT.md (antes de 24 h) → la regla de las 24 h queda en «No entra», y el glosario no cambia en esta feature. Sí se corrige: `anular` ya existe, y la 0011 solo lo restringe.
- **Aceptado en parte** — Menor: (a) que las reservas vivan en memoria era un límite no declarado → se añade a Límites. Es igual para todo `src/app.js` hoy, no lo trae esta feature. (b) El bloque de review se queda donde está, porque es donde el kit lo pide. (c) «Tú» es el dev-lead del frontmatter.

## Decisiones tomadas con el dev-lead

- Lista cerrada de motivos: cambio de planes, sala ocupada, otro (entrevista).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`. Cambia la interfaz del comando: `--motivo` pasa a ser obligatorio. Entra también el comando nuevo `canceladas`.
- No entra: anulaciones del responsable de sala (0011), quién canceló, y la regla de las 24 h de PRODUCT.md.

## Approach

El motivo se guarda como un campo más de la reserva cancelada, en la memoria del proceso, igual que el resto de reservas (`src/app.js`). `canceladas` lista, en el orden en que se cancelaron, las reservas con estado cancelada; las anuladas no.

## Reglas de la capacidad

- Dónde vive el dato: en la reserva, en memoria (`src/app.js`). No hay persistencia ni migración.
- Lengua de los nombres: castellano (constitución, art. 4). Comando `canceladas`, flag `--motivo`.
- Límites: tres motivos fijos. `canceladas` enseña todas las canceladas, sin tope. Las reservas, también las canceladas, viven en la memoria del proceso: un reinicio las pierde, igual que hoy.
- Avisos: falta el motivo → «falta el motivo: cambio de planes, sala ocupada, otro». Motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro».
- Regla de conflicto: cancelar una reserva ya cancelada, o que no existe, responde «sin reserva <sala> <día>», como hoy. La reserva cancelada libera la franja, también como hoy.

## Dónde se prueba

- Cancelar con motivo, sin motivo y con un motivo no válido: con el comando `cancelar`, en `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Cancelar exige un motivo de la lista**
Antes (comportamiento actual, `src/app.js` y `test/cancel.test.js`; `bookings` aún no tiene capacidad documentada): `cancelar Norte lun` respondía «cancelada Norte lun» y cancelaba la reserva.

Escenario «con motivo válido». Cada fila de la tabla parte de su propio GIVEN, la reserva activa de Norte del lunes:
- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo "<motivo>"`
- THEN responde con el texto de la fila

| Motivo | Respuesta |
| --- | --- |
| cambio de planes | cancelada Norte lun (cambio de planes) |
| sala ocupada | cancelada Norte lun (sala ocupada) |
| otro | cancelada Norte lun (otro) |

Escenario «sin motivo o con un motivo fuera de la lista». Cada fila parte de la reserva activa de Norte del lunes:

| Comando | Respuesta |
| --- | --- |
| `cancelar Norte lun` | falta el motivo: cambio de planes, sala ocupada, otro |
| `cancelar Norte lun --motivo` (sin valor) | falta el motivo: cambio de planes, sala ocupada, otro |
| `cancelar Norte lun --motivo "porque sí"` | motivo no válido: cambio de planes, sala ocupada, otro |
| `cancelar Norte lun --motivo "Sala ocupada"` | motivo no válido: cambio de planes, sala ocupada, otro |

- AND, después de cada fila, `cancelar Norte lun --motivo "otro"` responde «cancelada Norte lun (otro)»: la reserva seguía activa.

Escenario «conflicto»:
- GIVEN la reserva de Norte del lunes, ya cancelada con «otro»
- WHEN `cancelar Norte lun --motivo "otro"`
- THEN responde «sin reserva Norte lun»
- WHEN `cancelar Sur dom --motivo "porque sí"`, sin reserva ese día
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»: el motivo se valida antes de buscar la reserva

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes, cancelada con «sala ocupada»
- AND después la de Sur del martes, cancelada con «cambio de planes»
- AND la de Norte del miércoles, anulada con `anular`
- WHEN `canceladas`
- THEN responde exactamente dos líneas, en este orden: «Norte lun — sala ocupada» y «Sur mar — cambio de planes»
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
