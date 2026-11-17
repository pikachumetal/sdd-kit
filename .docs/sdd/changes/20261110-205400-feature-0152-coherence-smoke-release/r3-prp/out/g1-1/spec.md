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

🦆 Hoy, cuando el titular cancela su reserva, la sala queda libre y no queda constancia de por qué. Con este cambio, para cancelar hay que elegir un motivo de una lista cerrada (cambio de planes, sala ocupada, otro). Sin motivo, o con uno que no está en la lista, la reserva no se cancela. Un comando nuevo, `canceladas`, enseña cada reserva cancelada con sala, día, motivo y titular. Las reservas anuladas por el responsable de sala no salen en ese listado.

## Capacidades

- Nuevas: `reservas`: cancelar pide un motivo y el listado de canceladas lo enseña. Es la primera capacidad del proyecto, porque aún no existe `capabilities/`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec hecha: dos revisores y una segunda ronda. Señales: capacidad nueva (`reservas`); cambia un comportamiento que ya existe (la respuesta de `cancelar` y cancelar sin motivo); datos nuevos (`reason` y `holder` en la reserva); regla de estado (las canceladas salen en el listado, las anuladas no). Tamaño: unas 70 líneas en 2 ficheros.
- Dominio (opus): comprueba si «quién canceló = titular» se sostiene con la definición de Cancelación de `PRODUCT.md`, y si `canceladas` deja fuera todo lo que no es una cancelación. Señales: regla de estado y capacidad nueva.
- Técnica (sonnet): comprueba si poner `--motivo` como obligatorio rompe `test/cancel.test.js`, y si basta con añadir `holder` a la reserva sembrada sin más datos. Señales: comportamiento existente y datos.
- Segunda ronda (sonnet, los siete puntos): había críticos aceptados en la primera.
- Mínimo razonable: un revisor con los siete puntos. Se quedaría sin mirar con la lente de dominio qué no debe aparecer en `canceladas`.

Política de modelos: el revisor de dominio va en opus, y el técnico y la segunda ronda en sonnet. La implementación la hace la sesión (Native).

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro. «Otro» no lleva texto libre. Esto se decidió con el dev-lead en la entrevista.
2. `canceladas` enseña sala, día, motivo y titular, porque la petición habla de «saber quién y por qué».
3. **`--motivo` es obligatorio y cambia la respuesta de `cancelar`.** Hoy `cancelar Norte lun` cancela sin motivo y responde «cancelada Norte lun». Con el cambio:
   - cancelar sin motivo, con `--motivo` sin valor o con `--motivo ""` responde «falta el motivo: cambio de planes, sala ocupada, otro»;
   - un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro»;
   - en esos casos de error la reserva sigue activa;
   - si se cancela, responde «cancelada <sala> <día> (<motivo>)».

   Esa respuesta solo la lee `test/cancel.test.js:6` (lo comprobé con `git grep`), y ese test se reescribe con motivo.
4. **Primero se busca la reserva, después el motivo.** Si no hay reserva activa de esa sala ese día, responde «sin reserva <sala> <día>», sin mirar el motivo. Así sigue valiendo, sin tocarlo, el test que ya existe `cancelar sin reserva lo dice` (`cancelar Sur mar`, sin motivo).
5. **«Quién» es el titular de la reserva, no quien teclea la orden.** La CLI no tiene usuarios (`PRODUCT.md`: «La uso yo»). Además, la Cancelación es por definición la que hace el propio cliente. Por eso no se registra ni se valida quién ejecuta la orden. `holder` es un campo nuevo de la reserva, y la sembrada lleva `holder: 'Ana'`. `reservar` queda fuera, porque hoy no crea reservas: devuelve un texto fijo.
6. **`canceladas` solo lista cancelaciones.** Deja fuera las anuladas (`voided`, el estado que ya pone `anular`) y las activas. Si no hay ninguna, responde «sin canceladas». Cada línea tiene el formato `<sala> <día> — <motivo> — <titular>`, con raya (U+2014) entre espacios. Las líneas van en el orden de la lista en memoria.
7. **La cancelación no tiene vuelta atrás.** Cancelar una reserva ya cancelada o anulada responde «sin reserva <sala> <día>», como cualquier reserva que no está activa, y el motivo guardado no cambia.
8. **Cómo se lee `--motivo`.** `run` recibe los argumentos ya separados (argv): sala, día y, después, `--motivo <valor>`. Cuenta el valor que sigue al primer `--motivo`, comparado exacto y distinguiendo mayúsculas. El resto de argumentos se ignora.
9. **Los tests parten de la reserva sembrada.** `src/app.js` exporta `resetBookings()`, que devuelve la lista a la reserva sembrada. Solo la usan los tests, ningún comando. Cada test de `test/cancel.test.js` la llama antes de empezar.
10. **La regla de las 24 h queda fuera, y el glosario se cumple solo en parte.** `PRODUCT.md` define la Cancelación como la que se hace «antes de 24 h», pero hoy nada mira el plazo. Hasta que exista esa regla, `cancelar` y `canceladas` tratan como cancelación cualquier anulación del titular. Ninguna fila del roadmap la cierra: si la quieres, pídemela y la apunto con `sdd-roadmap`.

### Hallazgos de la review

Notas del repaso de coherencia, antes de la review:
- La versión anterior decía «Sin review de spec». La rúbrica solo decide cuántos revisores hay, no si hay review, y nadie pidió que no la hubiera: se hizo con los revisores de arriba.
- La capacidad aparecía como la `bookings` «modificada», y el CLI la rechazaba porque no existe en `capabilities/`. Ahora es nueva.

Primera ronda:
- **Aceptado** (Crítico, dominio): faltaba el bloque «Reglas de la capacidad» → añadido con las cinco reglas por nombre.
- **Aceptado en parte** (Crítico, dominio): había nombres en inglés que el glosario evita → la capacidad pasa a `reservas`. Los identificadores del código siguen en inglés (`holder`, `reason`), igual que los que ya existen (`room`, `status`). La constitución 4 pide castellano en la interfaz y en los documentos, no en el código: queda escrito en Reglas.
- **Rechazado** (Crítico, dominio): «el cambio de `cancelar` es un MODIFIED sin declarar» → no hay ninguna capacidad previa sobre la que hacer el MODIFIED, porque `capabilities/` no existe y el CLI no lo admite sin fichero. El cambio frente al comportamiento de hoy queda declarado en la decisión 3, con el antes y el después.
- **Aceptado** (Crítico, técnica): `holder` no tenía origen → la decisión 5 dice que es un campo nuevo de la reserva sembrada, y un escenario lo comprueba en la salida de `canceladas`.
- **Aceptado** (Crítico, técnica, e Importante, dominio): la reserva anulada del GIVEN no tenía forma de crearse → ahora se anula con `anular`, que ya existe (`src/app.js:31`). También hay un escenario con la reserva activa.
- **Aceptado** (Importante, técnica): se mezclaban tres comportamientos en un escenario → ahora son escenarios separados, y en los de error se comprueba con `canceladas` que no se ha cancelado nada.
- **Aceptado en parte** (Importante, técnica): el formato y el orden de `canceladas` → quedan fijados la raya U+2014, el orden en memoria y el escenario de «sin canceladas». **Rechazado** el escenario con dos canceladas: la única reserva sembrada es Norte lun y `reservar` no crea reservas, así que no hay dos reservas que cancelar sin inventar datos que esta feature no tiene.
- **Aceptado** (Importante, técnica): cómo se lee `--motivo` → decisión 8.
- **Aceptado** (Importante, técnica, ×2): faltaban decisiones en ✋ (el formato de la respuesta, los mensajes de error, «sin canceladas») → decisiones 3 y 6.
- **Aceptado** (Importante, dominio): `holder` se contradecía entre el Approach y las decisiones → corregido: es un campo nuevo.
- **Aceptado** (Importante, dominio): «quién» prometía saber quién ejecuta la orden → el Intent y la decisión 5 dicen ahora «titular».
- **Aceptado** (Importante, dominio): faltaba el complemento de los estados → decisión 7 y sus escenarios.
- **Rechazado** (Importante, dominio): «dos reservas de la misma sala el mismo día en franjas distintas» → hoy no pueden existir, porque `reservar` no crea reservas. La búsqueda por sala y día es de la 0007. Queda como la regla de conflicto «no aplica» en Reglas.
- **Rechazado** (Menor, dominio): «“sala ocupada” encaja mejor en Anulación, y “otro” sin texto» → la lista es la que decidió el dev-lead (decisión 1). Te lo dejo señalado por si quieres cambiarla.
- **Aceptado** (Menor, dominio): la regla de las 24 h → decisión 10.
- **Aceptado** (Menor, técnica): no estaba claro si `cancelled` y `voided` ya existen → los dos existen hoy en `src/app.js`. Lo dice el Approach.
- **Aceptado** (Menor, técnica): la prueba del delta afirmada a ojo → abajo va la salida real.

Segunda ronda:
- **Aceptado** (Importante): la parte del glosario que no se cumple, sin decirlo → decisión 10.
- **Aceptado** (Importante): faltaba el escenario de cancelar una anulada → añadido.
- **Aceptado** (Importante): faltaba el escenario de `--motivo` sin valor, y `""` no estaba decidido → decisión 3 (las dos cosas cuentan como «falta») y su escenario.
- **Aceptado** (Importante): no estaba fijado qué se comprueba antes, la reserva o el motivo → decisión 4. Lo cubre el escenario de la cancelada, junto con el test que ya existe `cancelar sin reserva lo dice`.
- **Aceptado** (Importante): había tests nuevos y llamadas al reinicio que no estaban en el Scope → ahora están listados.
- **Aceptado** (Menor): el escenario de cancelar no comprobaba que el motivo se guarda → se añade la comprobación con `canceladas`.
- **Aceptado** (Menor): la posición de `--motivo`, los repetidos y los argumentos sobrantes → decisión 8.
- **Aceptado** (Menor): la función de reinicio no tenía nombre → `resetBookings()`, decisión 9.
- **Aceptado** (Menor): en ✋ había notas de la review mezcladas con decisiones → movidas aquí.
- **Aceptado** (Menor): la cuenta de la prueba del delta estaba desfasada → repetida después de esta ronda.

Prueba del delta en una copia de `.docs/sdd` (`sdd capability merge`), lanzada sobre esta versión: `reservas.md: añadido` × 8 requisitos, exit 0. El `capabilities/` del repo no cambia.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere guardar el motivo de cada cancelación y verlo junto al titular de la reserva.

## Scope

- Entra:
  - en `src/app.js`, `cancelar <sala> <día> --motivo <motivo>` (`cancelBooking` y `run`), con `--motivo` obligatorio;
  - los campos `holder` y `reason` de la reserva, con `holder: 'Ana'` en la reserva sembrada;
  - el comando `canceladas`;
  - `resetBookings()`;
  - en `test/cancel.test.js`, la reescritura del test `cancelar una reserva activa`, los tests nuevos de los escenarios del delta y la llamada a `resetBookings()` en todos los tests. `cancelar sin reserva lo dice` queda igual (decisión 4).
- No entra:
  - las anulaciones del responsable de sala (0011);
  - la regla de las 24 h;
  - que `reservar` cree reservas con titular;
  - `test/app.test.js`, que no llama a `cancelar`.

## Approach

Los estados `active`, `cancelled` y `voided` ya existen en `src/app.js`. `cancelBooking` busca primero la reserva activa, después valida el motivo y, si es válido, cambia el estado y guarda el motivo en `reason`. `canceladas` filtra `status === 'cancelled'` y forma cada línea con el formato de la decisión 6.

## Reglas de la capacidad

- **Dónde viven los datos:** en memoria, en la lista `bookings` de `src/app.js`, como hoy. No hay persistencia ni migración.
- **Idioma de los nombres:** la interfaz y los documentos van en castellano (constitución 4). Los identificadores del código siguen en inglés, como los que ya existen.
- **Límites:** el motivo es uno de estos tres valores exactos: «cambio de planes», «sala ocupada», «otro». No hay texto libre.
- **Avisos:** no aplica. Los rechazos son respuestas de error, no avisos.
- **Regla en conflicto:** no aplica. Hoy no pueden existir dos reservas de la misma sala el mismo día, porque `reservar` no crea reservas.

## Dónde se prueba

- Todo con la salida de los comandos `cancelar` y `canceladas`, en `test/cancel.test.js`. Cada test parte de la reserva sembrada, con `resetBookings()`.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Cancelar con un motivo de la lista**
- GIVEN la reserva activa de Norte del lunes, 10:00-12:00, a nombre de Ana
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND `canceladas` responde «Norte lun — sala ocupada — Ana»

**ADDED — Un motivo fuera de la lista no cancela**
- GIVEN la reserva activa de Norte del lunes, a nombre de Ana
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin canceladas»

**ADDED — Sin motivo no se cancela**
- GIVEN la reserva activa de Norte del lunes, a nombre de Ana
- WHEN `cancelar Norte lun`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin canceladas»

**ADDED — `--motivo` sin valor cuenta como sin motivo**
- GIVEN la reserva activa de Norte del lunes, a nombre de Ana
- WHEN `cancelar Norte lun --motivo`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin canceladas»

**ADDED — Una reserva cancelada no se vuelve a cancelar**
- GIVEN la reserva de Norte del lunes, cancelada con «sala ocupada»
- WHEN `cancelar Norte lun --motivo "otro"`
- THEN responde «sin reserva Norte lun»
- AND `canceladas` sigue respondiendo «Norte lun — sala ocupada — Ana»

**ADDED — Una reserva anulada no se cancela**
- GIVEN la reserva de Norte del lunes, anulada con `anular Norte lun`
- WHEN `cancelar Norte lun --motivo "otro"`
- THEN responde «sin reserva Norte lun»
- AND `canceladas` responde «sin canceladas»

**ADDED — El listado de canceladas enseña el motivo y el titular**
- GIVEN la reserva de Norte del lunes, a nombre de Ana, cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada — Ana»

**ADDED — El listado de canceladas deja fuera las anuladas y las activas**
- GIVEN la reserva activa de Norte del lunes
- WHEN `canceladas`
- THEN responde «sin canceladas»
- AND después de `anular Norte lun`, `canceladas` sigue respondiendo «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
