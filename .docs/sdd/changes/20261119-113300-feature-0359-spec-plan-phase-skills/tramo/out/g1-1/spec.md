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

## Capacidades

- Nuevas: `reservas` — cancelar pide un motivo y el listado de canceladas lo enseña.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`reservas`), datos (`reason`, `holder`) · tamaño: ~45 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`)
- Dominio (opus): si «quién canceló» encaja con `PRODUCT.md` y el glosario de Cancelación, qué no puede hacer una reserva cancelada y las cinco reglas del dato nuevo (señal: capacidad nueva + datos)
- Mínimo razonable: sin review — deja sin mirar el complemento del estado cancelada y las reglas del dato nuevo
```

Delta probado en una copia: `capability merge` → `reservas.md`: 4 requisitos añadidos, exit 0 (la primera vez rechazó `bookings` como «Modificada» sin fichero en `capabilities/`: corregido a «Nuevas»).

Política de modelos: ejecución Native; esta sesión (Opus) implementa todas las tareas, sin subagentes por tarea.

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista.
2. El listado de canceladas enseña sala, día, motivo y quién canceló — la petición habla de «saber quién y por qué».
3. Review de spec: un revisor con los siete puntos (bloque de arriba), no «sin review»: la rúbrica decide el número de revisores, no si hay review.
4. «Quién canceló» es el titular de la reserva: por el glosario de `PRODUCT.md`, la cancelación la hace el propio cliente y la reserva va «a nombre de quien la pide». La reserva gana el campo `holder`, que viene en los datos de arranque como la sala, el día y la franja. **Choca con `PRODUCT.md`** («La uso yo… No hay más usuarios»): si de verdad solo hay un usuario, la columna «quién» sobra y se quita del listado; si hay varios, `PRODUCT.md` se corrige en esta feature. Elige tú.
5. `--motivo` es obligatorio: sin él, `cancelar` responde lo mismo que con un motivo fuera de la lista y no cancela.
6. Una lista de canceladas vacía responde «sin cancelaciones»; con varias, una por línea en el orden en que se cancelaron.
7. Orden de validación: primero si existe la reserva activa («sin reserva …»), después el motivo.
8. Una reserva ya cancelada no se vuelve a cancelar ni cambia de motivo: `cancelar` responde «sin reserva …», como hoy.
9. La regla de las 24 h del glosario queda fuera: mientras no exista, `cancelar` acepta cualquier antelación.
10. Datos de arranque: se añade la reserva de Sur del jueves, 16:00-18:00, a nombre de Bruno, para el segundo ejemplo (no choca con `libres 10:00-12:00` ni con `cancelar Sur mar`).

### Hallazgos de la review

- **Rechazado** — Crítico: la cancelada guardada bloquearía la sala (MODIFIED no declarado de reservar) → el código ya guarda la cancelada con `status: 'cancelled'` y `libres` y `cancelar` ya filtran por `active` (`src/app.js:6`, `src/app.js:10`); no cambia ningún requisito existente.
- **Rechazado** — Crítico: nadie rellena `holder` y `reservar` cambiaría de contrato → las reservas viven en memoria y salen de los datos de arranque; `reservar` hoy no crea reservas (`src/app.js:29`), así que no hay reservas antiguas sin titular ni contrato que cambiar. Aclarado en la decisión 4 y en el Approach.
- **Aceptado** — Importante: «Ana» y «quién canceló» contradicen `PRODUCT.md` → queda como elección explícita tuya en la decisión 4.
- **Aceptado** — Importante: el caso inválido no tiene WHEN literal y «sigue activa» no se observa → dos escenarios con WHEN literal; «sigue activa» se comprueba con `canceladas`.
- **Aceptado** — Importante: un solo ejemplo deja pasar la cadena escrita a mano → segundo ejemplo (Sur jue, «cambio de planes», Bruno) y escenario con dos canceladas que fija el orden.
- **Aceptado** — Importante: faltan las cinco reglas del dato nuevo → sección «Reglas de la capacidad».
- **Aceptado** — Importante: falta el complemento del estado cancelada → decisión 8 y su escenario.
- **Aceptado** — Importante: la exclusión de las 24 h estaba solo en el Scope → decisión 9.
- **Aceptado** — Menor: el orden de validación solo estaba en la tabla → decisión 7 y su escenario.
- **Aceptado** — Menor: capacidad `bookings` contra el glosario («Evitar: booking») → la capacidad se llama `reservas`; los campos de código siguen en inglés como el resto de `src/app.js` (regla de idioma abajo).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>`; comando `canceladas`; el titular de la reserva en los datos de arranque.
- No entra: anulaciones del responsable de sala (0011); la regla de las 24 h del glosario; que `reservar` cree reservas con titular.

### Lo que se retira o cambia de forma

| Literal | Dónde | Destino |
| --- | --- | --- |
| `cancelada ${room} ${day}` | `src/app.js:17` | pasa a «cancelada <sala> <día> (<motivo>)» |
| `'cancelada Norte lun'` | `test/cancel.test.js:6` | el test pasa `--motivo` y espera «cancelada Norte lun (sala ocupada)» |
| `cancelar Sur mar` sin reserva | `test/cancel.test.js:10` | se queda: «sin reserva» va antes de validar el motivo |

## Approach

El motivo se guarda con la reserva cancelada (`status: 'cancelled'`, campo `reason`); cada reserva lleva su titular (`holder`) en los datos de arranque de `src/app.js`. `canceladas` lista las reservas con `status: 'cancelled'`, una por línea, en orden de cancelación.

## Reglas de la capacidad

- Dónde vive el dato: en memoria, en el array de reservas de `src/app.js`; sin persistencia (como hoy).
- Idioma de los nombres: textos de interfaz en castellano (constitución, punto 4); campos de código en inglés (`status`, `reason`, `holder`), como el resto de `src/app.js`.
- Límites: el motivo es uno de los tres de la lista, escrito exacto.
- Avisos: «motivo no válido: cambio de planes, sala ocupada, otro».
- Regla en conflicto: una reserva ya cancelada no se vuelve a cancelar («sin reserva …»).

## Dónde se prueba

- Motivo: por el comando `cancelar`, en `test/cancel.test.js`.
- Listado: por la salida del comando `canceladas`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Cancelar pide un motivo de la lista**
- GIVEN la reserva de Norte del lunes, 10:00-12:00, a nombre de Ana
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND `cancelar Sur jue --motivo "cambio de planes"` responde «cancelada Sur jue (cambio de planes)»

**ADDED — Un motivo fuera de la lista, o ninguno, no cancela**
- GIVEN la reserva de Norte del lunes, activa
- WHEN `cancelar Norte lun --motivo "lluvia"`, y después `cancelar Norte lun`
- THEN los dos responden «motivo no válido: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin cancelaciones»

**ADDED — Sin reserva activa no se valida el motivo**
- GIVEN no hay reserva de Sur el martes, y la de Norte del lunes ya está cancelada
- WHEN `cancelar Sur mar`, y después `cancelar Norte lun --motivo otro`
- THEN responden «sin reserva Sur mar» y «sin reserva Norte lun»

**ADDED — El listado de canceladas enseña el motivo y quién canceló**
- GIVEN la reserva de Norte del lunes, a nombre de Ana, cancelada con «sala ocupada», y después la de Sur del jueves, a nombre de Bruno, cancelada con «cambio de planes»
- WHEN `canceladas`
- THEN responde, una por línea, «Norte lun — sala ocupada — Ana» y «Sur jue — cambio de planes — Bruno»
- AND sin ninguna reserva cancelada responde «sin cancelaciones»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
