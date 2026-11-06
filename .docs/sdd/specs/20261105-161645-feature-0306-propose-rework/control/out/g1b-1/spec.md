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

🦆 Hoy, cuando cancelas una reserva, la sala queda libre y no queda escrito por qué. Con este cambio, `cancelar` te pide un motivo de una lista cerrada (cambio de planes, sala ocupada, otro) y no cancela si falta o no está en la lista. Un comando nuevo, `canceladas`, enseña lo cancelado con su motivo: `Norte lun 10:00-12:00 — sala ocupada`. Lo que cambia para ti es que `cancelar Norte lun` ya no basta: hay que añadir `--motivo`.

## Capacidades

- Modificadas: `bookings` — cancelar pide un motivo y el comando `canceladas` lo enseña. No hay capacidad nueva.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (cambia la firma y la respuesta de `cancelar`), datos (el motivo se guarda con la reserva) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`)
- Dominio (opus): si el cambio de `cancelar` contradice la Cancelación de `PRODUCT.md` y qué no puede hacerse con una reserva cancelada (señal: MODIFIED)
- Técnica (sonnet): si cada THEN se puede verificar por `run()` y de dónde salen los datos nuevos (señal: datos)
- Mínimo razonable: solo técnica — deja sin mirar el choque con la definición de Cancelación y con la misión (un único usuario)

1. **Quito «quién canceló» del listado.** Las reservas no guardan a nombre de quién están, el CLI no tiene usuarios y `mission.md` dice «La uso yo… No hay más usuarios». Ni el Intent ni la fila 0010 del roadmap lo piden. Si lo quieres, sería un dato nuevo con su fuente (p. ej. `--por <nombre>`) y otra task.
2. **`cancelar` sin `--motivo` (o con `--motivo` sin valor) da error y no cancela**: «falta el motivo: cambio de planes, sala ocupada, otro». El roadmap dice «se elige un motivo». **Esto rompe el uso actual** (`cancelar Norte lun` deja de funcionar, también en scripts): valídalo. La alternativa, usar «otro» por defecto, mantiene el uso de hoy pero deja cancelaciones sin un motivo elegido.
3. **La respuesta de `cancelar` pasa a incluir el motivo**: «cancelada Norte lun (sala ocupada)». Cambia el test actual `cancelar una reserva activa`.
4. **Formato de `canceladas`**: una línea por reserva, `<sala> <día> <franja> — <motivo>`, en el orden en que se cancelaron. La franja va porque una sala puede tener dos reservas el mismo día (patch 0007). Sin canceladas responde «sin canceladas».
5. **Un motivo con espacios va entre comillas** (`--motivo "sala ocupada"`) y se compara literal, en minúsculas como en la lista.
6. **Las cancelaciones viven en la memoria del proceso**, igual que las reservas de hoy (`src/app.js`): `canceladas`, lanzado como otro proceso, no ve lo que se canceló en una ejecución anterior. Es una limitación que ya tiene el producto (lo mismo le pasa a `libres`). Darle persistencia queda fuera de alcance.
7. **Enfoque**: guardar `motivo` en la misma reserva, que ya cambia a `status: 'cancelled'` al cancelar. Descarto una lista aparte de cancelaciones, porque duplicaría la sala, el día y la franja, y separaría el motivo de su reserva. Con una sola task, no hay diseño por secciones.
8. **El límite de 24 h de la Cancelación (`PRODUCT.md`) sigue sin aplicarse**, como hoy: las reservas tienen día de la semana y franja, pero no fecha, así que no hay «24 h antes» que calcular. Esta feature no lo cambia ni toca `PRODUCT.md`. Aplicarlo necesita fechas reales y sería otra fila del roadmap.
9. **Primero se valida el motivo y después se busca la reserva**: `cancelar Sur mar` sin motivo responde «falta el motivo: …», aunque no haya reserva. «sin reserva <sala> <día>» es el mensaje de hoy (`test/cancel.test.js`) y no cambia.
10. **Se cancela por sala y día, como hoy**: si una sala tiene dos reservas activas el mismo día, `cancelar` cancela la primera, igual que ahora. Elegir la franja al cancelar cambiaría la firma una vez más y queda fuera.
11. **`src/app.js` exporta una función solo para los tests**, que fija la lista de reservas de partida («Dónde se prueba»).

### Hallazgos de la review

- **Aceptado** — (dominio 1, técnica 8) el ADDED de cancelar es un MODIFIED no declarado → el delta pasa a `MODIFIED — Cancelar una reserva`, con el requisito anterior.
- **Aceptado** — (técnica 1) falta el caso de `cancelar` sin `--motivo` → escenario propio y decisión 2.
- **Aceptado** — (técnica 2, dominio 3 y 8) «quién canceló» no se puede verificar, choca con la Cancelación (la hace siempre el titular) y con la misión → se quita (decisión 1).
- **Rechazado** — (dominio 2) «hoy cancelar borra la reserva y el estado es nuevo» → en `src/app.js` cancelar ya pone `status: 'cancelled'`, y `libres` solo cuenta las activas. El patch 0007 arregló que se borrara la reserva equivocada. No hay estado nuevo. *(2.ª ronda, 8: la fuente comprobable es `src/app.js` → `cancelBooking`, y v0.3.0 en `changelog.md`.)*
- **Aceptado** — (técnica 3, dominio 5) dónde vive el dato y qué pasa con las cancelaciones antiguas → decisión 6 y «Reglas de la capacidad». No hay cancelaciones anteriores que sobrevivan al proceso.
- **Aceptado** — (técnica 4) faltan el listado vacío y el orden → decisión 4 y su escenario.
- **Aceptado** — (técnica 5) el error del motivo va como AND y no dice si la reserva sigue activa → escenario propio, con la reserva activa.
- **Aceptado** — (técnica 6, dominio 4) faltan la doble cancelación y la reserva inexistente → escenario: responde «sin reserva Norte lun» y no cambia el motivo guardado.
- **Rechazado** — (dominio 4) el límite de 24 h y «no es tuya» → el producto no tiene horas absolutas ni titulares en los datos, así que no se puede aplicar ninguno. Queda en «No entra».
- **Aceptado** — (técnica 7) faltaban decisiones (respuesta, formato, comillas) → decisiones 3, 4 y 5.
- **Rechazado** — (dominio 6) renombrar la capacidad a `reservas` → el kit fija los nombres de capacidad en inglés kebab-case, porque son nombres de fichero. El texto sigue en castellano.
- **Aceptado** — (dominio 7) dos reservas el mismo día no se distinguen en el listado → la franja entra en la línea (decisión 4).
- **Aceptado** — (dominio 9) el Intent abarcaba las anulaciones → acotado a las cancelaciones del titular.
- **Rechazado** — (dominio 10) «sala ocupada» no encaja como motivo del cliente → la lista la decidió el dev-lead. «otro» no lleva texto libre (lista cerrada).
- **Aceptado** — (técnica 9) la justificación de «sin review» era errónea → retirada: la review se hizo.
- **Aceptado** — (técnica 10) cómo se prepara el estado en el test → «Dónde se prueba» lo dice.

Segunda ronda (sonnet, siete puntos, sobre la spec corregida):

- **Aceptado** — (1, Crítico) la regla de 24 h de `PRODUCT.md` quedaba sin decir → decisión 8: sigue sin aplicarse, como hoy, y por qué.
- **Aceptado** — (2) «sin reserva» es el mensaje actual sin declarar → decisión 9. **Rechazado** en parte: dos reservas el mismo día al cancelar → decisión 10, se mantiene lo de hoy.
- **Aceptado** — (3) el orden de validación → decisión 9 y su escenario.
- **Rechazado** — (4) pasar la ruptura de compatibilidad a «con el dev-lead» → no la ha dicho Laura: queda en ✋ (decisión 2), marcada para que la valide en esta parada.
- **Aceptado** — (5) `--motivo` sin valor y motivo con mayúsculas → decisión 2 y escenario de «Sala ocupada».
- **Aceptado** — (6) el orden del listado no se verificaba → escenario con dos canceladas.
- **Aceptado** — (7) THEN vago en «Cancelar dos veces» → línea exacta.
- **Aceptado** — (8) la fuente del rechazo → citada.
- **Rechazado** — (9) sacar el bloque de review de ✋ → el kit fija que ese bloque abre ✋.
- **Aceptado** — (10) `bookings` no tiene fichero vivo → el «antes» del MODIFIED sale de `test/cancel.test.js` y de v0.3.0. `capabilities/bookings.md` se crea al archivar a partir de este delta.

## Decisiones tomadas con el dev-lead

- La lista de motivos es cerrada: cambio de planes, sala ocupada, otro (entrevista).

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué el titular liberó su reserva. Se quiere el motivo de cada cancelación y poder verlo después. Sería un fracaso que una cancelación quedara sin motivo o con uno fuera de la lista.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>` (el motivo es obligatorio y se valida contra la lista); comando `canceladas`.
- No entra: anulaciones del responsable de sala (0011); quién canceló; el límite de 24 h; persistencia entre ejecuciones.

## Approach

El motivo se guarda en la reserva cancelada (`status: 'cancelled'`), y `canceladas` lista las reservas con ese estado, en el orden en que se cancelaron.

## Reglas de la capacidad

- Dónde vive el dato: en la reserva, en memoria del proceso (`src/app.js`).
- Idioma de los nombres: castellano (constitución, 4): `cancelar`, `--motivo`, `canceladas`.
- Límites: la lista cerrada de tres motivos. Las 24 h no aplican: el producto no tiene horas absolutas.
- Avisos: «falta el motivo: …» y «motivo no válido: …», ambos con la lista.
- Regla de conflicto: una reserva ya cancelada no se cancela otra vez y conserva su primer motivo.

## Dónde se prueba

- Todo por `run()` en `test/cancel.test.js`. El estado de «cancelada» se prepara llamando antes a `run('cancelar', …)` en el mismo test.
- Las reservas de partida (p. ej. Sur del martes) se preparan con una función de test que exporta `src/app.js` y deja la lista en un estado conocido antes de cada test. Hace falta porque `reservar` todavía no crea reservas reales y porque la lista se comparte entre tests. Es un detalle interno, no cambia lo que ve el usuario (decisión 11).

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Cancelar una reserva** *(antes, según `test/cancel.test.js` y v0.3.0: `cancelar Norte lun` → «cancelada Norte lun»)*
- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND la reserva queda cancelada con el motivo «sala ocupada»

**ADDED — Cancelar sin motivo no cancela**
- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa

**ADDED — Un motivo fuera de la lista no cancela**
- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "me aburro"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa

**ADDED — El motivo se compara literal**
- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa

**ADDED — Sin motivo se avisa antes de buscar la reserva**
- GIVEN ninguna reserva de Sur el martes
- WHEN `cancelar Sur mar`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»

**ADDED — Cancelar dos veces no cambia el motivo**
- GIVEN la reserva de Norte del lunes, 10:00-12:00, cancelada con «sala ocupada»
- WHEN `cancelar Norte lun --motivo "otro"`
- THEN responde «sin reserva Norte lun»
- AND `canceladas` responde «Norte lun 10:00-12:00 — sala ocupada»

**ADDED — El listado de canceladas enseña el motivo**
- GIVEN la reserva de Norte del lunes, 10:00-12:00, cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun 10:00-12:00 — sala ocupada»

**ADDED — El listado sigue el orden de cancelación**
- GIVEN las reservas activas de Norte del lunes, 10:00-12:00, y de Sur del martes, 09:00-10:00
- WHEN se cancela primero `cancelar Sur mar --motivo "otro"` y después `cancelar Norte lun --motivo "cambio de planes"`, y luego `canceladas`
- THEN responde dos líneas, en este orden: «Sur mar 09:00-10:00 — otro» y «Norte lun 10:00-12:00 — cambio de planes»

**ADDED — Sin canceladas, el listado lo dice**
- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
