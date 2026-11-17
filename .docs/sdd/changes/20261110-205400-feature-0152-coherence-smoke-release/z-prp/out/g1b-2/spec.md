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

🦆 Hoy, cuando alguien cancela una reserva, la sala queda libre y no se sabe por qué. Con esta feature, `cancelar` exige un motivo de una lista cerrada (cambio de planes, sala ocupada, otro) y un comando nuevo, `canceladas`, enseña cada cancelación con su sala, su día, el motivo y el titular de la reserva: por ejemplo, «Norte lun — sala ocupada — Ana». Las anulaciones del responsable de sala no salen ahí. Ojo: las reservas viven en memoria, así que el listado solo ve lo cancelado en la misma ejecución.

## Capacidades

- Nueva: `bookings` — no hay `capabilities/` en el proyecto; esta spec la crea con el comportamiento de cancelar y del listado de canceladas.

## Decisiones tomadas con el dev-lead

- (ninguna con frase literal recogida; la lista de motivos va como decisión 1 de «Decisiones que he tomado yo», para validarla)

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: cambio de comportamiento de `cancelar` (hoy cancela sin motivo), datos (campos `holder` y `reason` en la reserva) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): si exigir motivo rompe lo que hoy hace `cancelar` y si «titular» respeta la frontera cancelación/anulación de PRODUCT.md (señal: cambio de comportamiento)
- Técnica (sonnet): si `holder` y `reason` caben en la reserva en memoria sin tocar `anular` ni `libres`, y si cada THEN es observable por la salida del comando (señal: datos)
- Mínimo razonable: un revisor con los siete puntos — deja sin la segunda lectura la forma de los datos nuevos
```

1. **Lista cerrada de motivos**: cambio de planes, sala ocupada, otro. Viene de la entrevista, pero sin frase literal recogida: valídala tú.
2. **`--motivo` pasa a ser obligatorio**: `cancelar Norte lun` sin motivo deja de cancelar. Hoy responde «cancelada Norte lun» (`src/app.js` `cancelBooking`, `test/cancel.test.js`). Descartado: motivo opcional, que dejaría cancelaciones sin rastro.
3. **El listado enseña el titular de la reserva, no «quién ejecutó el comando»**: la CLI no tiene login, y según `PRODUCT.md` una cancelación la hace el propio cliente (la del responsable es una anulación, 0011). Si quieres de verdad «quién canceló» distinto del titular, hace falta identidad y es otra feature.
4. **El titular solo existe en la reserva de ejemplo**: `reservar` hoy no crea reservas reales (solo responde «reserva semanal creada»), así que no se toca; la reserva de ejemplo de Norte del lunes pasa a ser de Ana, y se añaden dos de ejemplo a nombre de Luis, Sur martes y Sur miércoles, de 16:00 a 18:00, en otra franja para no cambiar la salida de `libres 10:00-12:00`. Todas las reservas tienen titular: no hace falta un caso «sin titular».
5. **La regla de 24 h de PRODUCT.md queda fuera**: hoy `cancelar` no la comprueba y esta feature no la añade. Va a «No entra» y propongo apuntarla en la deuda.
6. **Orden de comprobación**: primero el motivo, después la reserva. Así, sin motivo y sin reserva, responde «falta el motivo: …».
7. **El motivo se compara literal**: sin pasar a minúsculas ni recortar espacios. «Sala ocupada» con mayúscula no es válido.
8. **Formatos de salida**: «cancelada <sala> <día> (<motivo>)»; una línea por cancelación «<sala> <día> — <motivo> — <titular>», en el orden en que se cancelaron; «sin cancelaciones» si no hay ninguna; errores «falta el motivo: cambio de planes, sala ocupada, otro» y «motivo no válido: cambio de planes, sala ocupada, otro». Descartado: un formato de tabla con cabecera, que pesa más para una línea.
9. **Cancelar dos veces** la misma reserva responde «sin reserva Norte lun», como hoy cualquier reserva que no está activa.
10. **Reglas de los datos nuevos**: dónde viven: en la reserva, en memoria (`operations.md`: sin base de datos) · idioma de los nombres: campos `holder` y `reason` en inglés, como `status`; textos en castellano (constitución, 4) · límites: no aplica, el motivo es de una lista cerrada · avisos: los dos errores de la decisión 8 · conflicto: la decisión 9.
11. **El código de `anular` y `libres` no cambia** (ver la decisión 18 para la salida de `libres` en la franja nueva): `libres` filtra por sala, franja y estado, y `test/app.test.js` no lee el titular. Comprobado leyendo el código, no ejecutado: `sin medir` hasta el RED.
12. Enfoque: A, frente a B (ver Approach).
13. Corregido en el repaso de coherencia, antes de la review: la spec no decía qué pasa con `cancelar` sin `--motivo` (contradecía el test actual), ni de dónde sale «quién canceló»; se retira «Sin review de spec», porque la rúbrica decide cuántos revisores, no si hay review.
14. Delta en copia: `sdd capability merge` no se ha podido probar porque el proyecto no tiene `capabilities/` — `sin medir`.
15. **Las cancelaciones no sobreviven entre ejecuciones**: las reservas viven en memoria (`operations.md`) y cada `node src/app.js …` es un proceso nuevo, así que desde la terminal `canceladas` responde siempre «sin cancelaciones». El motivo y el listado solo se ven encadenados en el mismo proceso, como en el test. Persistir las reservas es otra feature: cambia `operations.md` y todos los comandos. **Es la decisión que más pesa: si sin persistencia la feature no te sirve, dímelo y la partimos.**
16. **`--motivo` sin valor** cuenta como «falta el motivo». Los errores salen por la salida estándar y terminan con código 0, como hoy «sin reserva».
17. **Cambio de lo que ya existe**: el requisito «Cancelar exige un motivo de la lista» sustituye a lo que hace hoy `cancelar` (cancela sin motivo). Va como ADDED porque `bookings` no tiene capacidad escrita contra la que poner un MODIFIED.
18. **Las reservas nuevas de Sur, de 16:00 a 18:00, cambian `libres 16:00-18:00`**: deja de dar «Sur» y pasa a dar «Norte». Ningún test lo comprueba hoy; `test/app.test.js` entra en el Scope para ejecutarlo.
19. Política de modelos: revisores de spec en Sonnet (el delta no trae roles ni reglas de permiso); la implementación prevé una sola task.

### Hallazgos de la review

- **Aceptado** — (dominio 1, técnica 9, Crítico) `bookings` no existe en `capabilities/` → se declara capacidad nueva y los requisitos van como ADDED; el cambio de lo que hoy hace `cancelar` queda en la decisión 2.
- **Aceptado** — (dominio 2, técnica 4, Crítico) la regla de 24 h de PRODUCT.md no estaba recogida → decisión 5 y «No entra».
- **Aceptado** — (dominio 3, Crítico) «quién canceló» se afirmaba sin fuente → decisión 3: el listado enseña el titular.
- **Aceptado** — (técnica 1, Crítico) el THEN de cancelar solo comprobaba la respuesta → el escenario de cancelar comprueba también `canceladas`, y el GIVEN del listado es una invocación real de `cancelar`.
- **Aceptado** — (dominio 4, técnica 7) el origen del titular no estaba → decisión 4 y Scope.
- **Aceptado** — (dominio 5) faltaban las reglas de los datos nuevos → decisión 10; los campos pasan a `holder` y `reason`.
- **Aceptado** — (dominio 6, técnica 3) faltaban «otro», recancelar, sin reserva y anuladas → escenarios nuevos y decisión 9.
- **Aceptado** — (dominio 7) faltaba el orden de comprobación → decisión 6 y su AND.
- **Aceptado** — (técnica 2) faltaba un caso con una activa y una cancelada → escenario del listado.
- **Aceptado** — (técnica 5) formatos y textos de error sin decidir → decisión 8.
- **Aceptado** — (técnica 6) «`anular` no cambia» sin comprobar → decisión 11, `sin medir`.
- **Aceptado** — (dominio 8) el Intent prometía «toda cancelación tiene titular» → recortado a lo que el delta cubre.
- **Aceptado** — (dominio 10, técnica 8) la decisión del dev-lead no tenía frase literal → pasa a ✋ 1 para validarla.
- **Aceptado** — (técnica 10) el bloque de review interrumpía la numeración → la lista se numera seguida debajo del bloque.
- **Aceptado** — (2.ª ronda 1, Crítico) los AND encadenados comprobaban una reserva ya cancelada → un escenario por caso, cada uno con su GIVEN.
- **Aceptado, sin resolver** — (2.ª ronda 2, Crítico) con reservas en memoria, `canceladas` no ve nada desde la terminal → decisión 15 e Intent; no se añade persistencia: se lleva al gate como la decisión que tienes que tomar.
- **Aceptado** — (2.ª ronda 3) el orden del listado no tenía escenario → escenario con dos cancelaciones.
- **Aceptado** — (2.ª ronda 4) cambio rompiente de `cancelar` sin declarar → decisión 17.
- **Aceptado** — (2.ª ronda 5) las reservas nuevas cambian `libres 16:00-18:00` → decisión 18 y `test/app.test.js` en el Scope.
- **Aceptado** — (2.ª ronda 6) el filtrado de anuladas dependía de `anular` sin escenario → el GIVEN dice qué responde `anular Sur mié` («anulada Sur mié», como hoy).
- **Aceptado** — (2.ª ronda 7) la referencia «✋ 1» no existía → corregida.
- **Aceptado** — (2.ª ronda 9) `--motivo` sin valor, canal y código de salida → decisión 16 y su escenario.
- **Rechazado** — (2.ª ronda 8) la regla de 24 h → ya está en «No entra» (decisión 5); la fila de deuda se apunta con `sdd-roadmap` si la apruebas, no desde esta spec.
- **Rechazado** — (2.ª ronda 10, dominio 9) usar «Ana» en el ejemplo junto a «Laura» como aprobadora → Ana es inventada y Laura es el rol de aprobación del frontmatter; no se confunden en ningún THEN.
- **Rechazado** — (técnica 7, ayuda de la CLI) no hay ayuda ni uso documentado en el README; no hay nada que actualizar.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación. Éxito: no se puede cancelar sin un motivo de la lista, y `canceladas` enseña cada cancelación de la misma ejecución con su motivo y su titular. Entre ejecuciones no se guarda nada (decisión 15). Fracaso aunque funcione: que se pueda cancelar sin motivo.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>` (obligatorio); comando `canceladas`; campos `holder` y `reason` en la reserva y las reservas de ejemplo de la decisión 4 (`src/app.js`); una forma de volver a las reservas de ejemplo entre tests (`src/app.js`), porque cada escenario parte de ellas; actualizar `test/cancel.test.js`, cuyo test «cancelar una reserva activa» pasa a llevar motivo; ejecutar `test/app.test.js` sin cambiarlo (decisión 18).
- No entra: anulaciones del responsable de sala (0011); `anular`, `libres` y `reservar` no cambian; el titular en reservas nuevas; motivo con texto libre; la regla de 24 h de PRODUCT.md.

## Approach

- **A (elegido)** — el motivo se guarda en la propia reserva al pasar a `cancelled`; `canceladas` filtra las reservas con ese estado, lo que deja fuera las anuladas (`voided`). Cuesta un campo más en la reserva; es lo que ya hace el código con `status`.
- **B (descartado)** — un registro aparte de cancelaciones. Duplica sala y día y añade una segunda estructura en memoria sin ganar nada mientras no haya historial.

## Dónde se prueba

- Motivo y listado: por los comandos `cancelar` y `canceladas`, en `test/cancel.test.js`, encadenados en el mismo proceso (las reservas viven en memoria). Cada escenario parte de las reservas de ejemplo: Norte lun 10:00-12:00 de Ana, Sur mar y Sur mié 16:00-18:00 de Luis, todas activas.

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Cancelar exige un motivo de la lista** (sustituye a cancelar sin motivo; decisión 17)

Escenario: motivo válido
- GIVEN las reservas de ejemplo
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND `canceladas` responde «Norte lun — sala ocupada — Ana»

Escenario: «otro» es un motivo válido
- GIVEN las reservas de ejemplo
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde «cancelada Norte lun (otro)»

Escenario: motivo fuera de la lista
- GIVEN las reservas de ejemplo
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin cancelaciones»

Escenario: sin motivo, con reserva
- GIVEN las reservas de ejemplo
- WHEN `cancelar Norte lun` (y también `cancelar Norte lun --motivo`, sin valor)
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND `canceladas` responde «sin cancelaciones»

Escenario: sin motivo, sin reserva
- GIVEN las reservas de ejemplo
- WHEN `cancelar Sur jue`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»

Escenario: motivo válido, sin reserva
- GIVEN las reservas de ejemplo
- WHEN `cancelar Sur jue --motivo otro`
- THEN responde «sin reserva Sur jue»

Escenario: cancelar dos veces
- GIVEN `cancelar Norte lun --motivo "sala ocupada"` ya hecho
- WHEN `cancelar Norte lun --motivo otro`
- THEN responde «sin reserva Norte lun»
- AND `canceladas` sigue respondiendo «Norte lun — sala ocupada — Ana»

**ADDED — El listado de canceladas enseña el motivo y el titular**

Escenario: sin cancelaciones
- GIVEN las reservas de ejemplo
- WHEN `canceladas`
- THEN responde «sin cancelaciones»

Escenario: las anuladas y las activas no salen
- GIVEN `anular Sur mié`, que responde «anulada Sur mié», y `cancelar Norte lun --motivo "sala ocupada"`; Sur mar sigue activa
- WHEN `canceladas`
- THEN responde solo «Norte lun — sala ocupada — Ana»

Escenario: orden de cancelación
- GIVEN `cancelar Sur mar --motivo "cambio de planes"` y después `cancelar Norte lun --motivo otro`
- WHEN `canceladas`
- THEN responde dos líneas, en este orden: «Sur mar — cambio de planes — Luis» y «Norte lun — otro — Ana»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
