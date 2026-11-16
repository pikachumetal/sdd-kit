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

> 🦆 Hoy, cuando cancelas una reserva, la sala queda libre y no queda escrito por qué. Con esta feature, `cancelar` te obliga a elegir uno de tres motivos (cambio de planes, sala ocupada, otro). Si no das motivo o das otro distinto, la reserva sigue en pie. Un comando nuevo, `canceladas`, te enseña cada sala cancelada con su motivo. Lo que cambia para ti: la forma de cancelar de siempre, sin motivo, deja de funcionar.

## Capacidades

- Modificadas: `reservas` — cancelar exige un motivo de una lista cerrada y el comando nuevo `canceladas` lo enseña. No hay `capabilities/` en el proyecto: el «antes» del delta sale del código actual (`src/app.js`) y de su test (`test/cancel.test.js`), no de un requisito escrito.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED no declarado (hoy `cancelar <sala> <día>` funciona sin motivo), datos (motivo y quién canceló se guardan con la reserva) · tamaño: ~50 líneas en 2 ficheros (src/app.js, test/cancel.test.js)
- Dominio (opus): si «Cancelar pide un motivo de la lista» cambia el requisito de cancelar del patch 0007, y qué no ve / no puede hacer quien no canceló sobre el listado `canceladas` frente a la 0011 (señal: MODIFIED + estado cancelada)
- Técnica (sonnet): de dónde sale «Ana» en «Norte lun — sala ocupada — Ana», y si el formato guardado de las reservas y la firma de `cancelar` que usan los tests actuales cambian sin decirlo (señal: datos + MODIFIED)
- Mínimo razonable: solo técnica — deja sin mirar si el MODIFIED rompe la cancelación ya validada en la 0007 y qué no debe ver el listado
Hecha: dos revisores (dominio en opus, técnica en sonnet) + segunda ronda en sonnet por Críticos aceptados; hallazgos abajo.
```

1. La lista de motivos es cerrada: cambio de planes, sala ocupada, otro — decidido con el dev-lead en la entrevista. El motivo no distingue cancelación de anulación: la 0011 no debe reutilizar esta lista sin decidirlo.
2. **El listado no enseña quién canceló** (antes sí, con «Ana»). `PRODUCT.md` dice que hay un solo usuario, la Terminología dice que la cancelación la hace el propio cliente y la fila 0010 del roadmap solo pide el motivo. Si quieres guardar quién cancela, hace falta un dato que hoy no existe (p. ej. `--por <nombre>`) y vuelve a la spec.
3. **`cancelar` sin `--motivo` se rechaza**, no se pone un motivo por defecto: un motivo por defecto deja canceladas sin rastro, que es justo lo que la feature quiere evitar. El test actual «cancelar una reserva activa» cambia la llamada (con `--motivo`) y la aserción («cancelada Norte lun (<motivo>)»).
4. **Primero se busca la reserva y después se mira el motivo**: sin reserva activa responde «sin reserva <sala> <día>» aunque falte el motivo. Así el test actual «cancelar sin reserva lo dice» sigue igual.
5. **El motivo se compara literal** (mayúsculas y acentos incluidos) y «otro» no lleva texto libre. `--motivo` sin valor cuenta como motivo que falta.
6. **`canceladas` lista solo las reservas con estado cancelada**, no las anuladas con `anular` (comando que ya existe en `src/app.js`; la 0011 decide quién puede usarlo). El orden de varias líneas no entra en el contrato: la app arranca con una sola reserva.
7. **La regla de 24 h no entra**: la Terminología la nombra, pero el código no la aplica hoy, y esta feature no la añade.
8. **Pruebas en `test/cancel.test.js`**, por `run()`. Las reservas viven en memoria del módulo y los tests del fichero se la reparten: `src/app.js` exporta una función de reinicio del estado, solo para los tests.
9. **La capacidad se llama `reservas`**, no `bookings`: la Terminología dice «_Evitar_: booking».

### Hallazgos de la review

- **Aceptado** — (dominio 1, técnica 3, Crítico) `cancelar` sin motivo ya existe: el requisito es un MODIFIED sin declarar, y falta qué pasa sin `--motivo` → pasa a MODIFIED con el requisito de antes citado, con el escenario «sin motivo» (decisión 3), y el Scope dice que el test actual cambia.
- **Aceptado** — (técnica 1, Crítico) el motivo no válido no tiene GIVEN/WHEN propios ni dice si la reserva sigue activa → escenario propio; la reserva sigue activa y lo comprueba `libres`.
- **Aceptado** — (dominio 3 y 4, técnica 2, Crítico) «quién canceló» no tiene origen, choca con «no hay más usuarios» de `PRODUCT.md` y la fila del roadmap no lo pide → sale del delta y del ejemplo «Ana» (decisión 2).
- **Aceptado** — (dominio 2, Crítico) el estado cancelada solo se describía por lo que hace → escenarios del complemento: libera la franja en `libres` y volver a cancelarla responde «sin reserva Norte lun».
- **Aceptado** — (dominio 5, Importante) la frontera con la 0011 → `canceladas` no lista anulaciones, con su escenario (decisión 6).
- **Rechazado** — (dominio 5, Importante) que no se pueda cancelar una reserva ajena → no hay reservas ajenas: un solo usuario (`PRODUCT.md`), y la anulación es de la 0011. Tampoco se toca «sala ocupada» como motivo: lo fijó el dev-lead en la entrevista.
- **Aceptado** — (dominio 6, Importante) faltan las cinco reglas → sección «Reglas de la capacidad».
- **Aceptado** — (técnica 5, Importante) `canceladas` solo tenía el caso feliz → escenario vacío («sin canceladas»).
- **Aceptado** — (técnica 6, Importante) no se decía cómo se compara el motivo ni qué pasa con «otro» → decisión 5.
- **Aceptado** — (técnica 7, Importante) la ubicación de los tests y el aislamiento del estado no estaban en las decisiones → decisión 8.
- **Rechazado** — (técnica 4, Importante) el formato persistido y las canceladas antiguas sin motivo → no hay persistencia: las reservas viven en memoria de `src/app.js` y no existen canceladas anteriores a esta feature. Queda dicho en «Dónde vive el dato».
- **Rechazado** — (dominio 7 y técnica 8) fijar el «ahora» frente a la regla de 24 h → el código no tiene reloj ni aplica esa regla, así que el resultado no depende de la hora. Queda en «No entra» (decisión 7).
- **Aceptado** — (dominio 8, técnica 9, Menor) la decisión 3 antigua «Sin review de spec» → quitada; la review se ha hecho y Capacidades y delta ya concuerdan (MODIFIED + ADDED).
- **Rechazado** — (dominio 9, Menor) el nombre «Laura» del aprobador → es quien aprueba la spec, no un ejemplo inventado.

Segunda ronda (sonnet, siete puntos):

- **Rechazado** — (2.1, Crítico) el escenario de la anulada usa `anular`, que «no existe» → `anular Norte lun` ya existe en `src/app.js` (deja la reserva en estado `voided`); la 0011 solo restringe quién lo usa. El escenario falla si `canceladas` lista todo lo no activo, así que prueba la frontera.
- **Aceptado** — (2.2, Crítico) el «antes» del MODIFIED no tiene requisito escrito y `bookings` choca con la Terminología → Capacidades dice que el «antes» sale del código y del test actuales; la capacidad pasa a `reservas` (decisión 9).
- **Aceptado** — (2.3, Importante) el escenario «ya cancelada» con un motivo válido no prueba el orden reserva → motivo → el WHEN pasa a `cancelar Norte lun` sin motivo. El caso de una sala inexistente ya lo cubre el test actual «cancelar sin reserva lo dice».
- **Aceptado** — (2.4, Importante) la comparación literal no tenía escenario → escenario con `--motivo "Sala ocupada"`.
- **Aceptado** — (2.5, Importante) el reinicio del estado era alcance oculto → en «Entra», como export de `src/app.js` (decisión 8).
- **Aceptado** — (2.6, Importante) el test actual cambia también la aserción → Scope y decisión 3 lo dicen.
- **Aceptado** — (2.7, Importante) el orden de varias líneas no se puede verificar → sale del contrato (decisión 6) y de las reglas.
- **Aceptado** — (2.8, Importante) el parseo de `--motivo` → la firma `run(cmd, params)` no cambia; el valor llega como un solo elemento de `params` (la shell quita las comillas); `--motivo` sin valor cuenta como falta, con su escenario.
- **Aceptado** — (2.9, Menor) «sala ocupada» frente a la anulación → anotado en la decisión 1.
- **Rechazado** — (2.10, Menor) quitar el bloque «Review de spec propuesta» → es el registro de lo que se lanzó, como pide la rúbrica de review; se le añade la línea «Hecha:».

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Se quiere el motivo de cada cancelación.

## Scope

- Entra: `--motivo` obligatorio en `cancelar <sala> <día>`; comando nuevo `canceladas`; el test actual «cancelar una reserva activa» cambia llamada y aserción; un export de `src/app.js` que reinicia el estado, solo para los tests.
- No entra: anulaciones del responsable de sala (0011); quién canceló (un solo usuario); la regla de 24 h de la Terminología, que el código no aplica hoy; el orden de varias canceladas.

## Approach

`cancelBooking` comprueba la reserva activa, después el motivo contra la lista, y guarda `motivo` en la reserva al ponerla en estado `cancelled`. `canceladas` recorre las reservas con estado `cancelled`, una línea por reserva. La firma `run(cmd, params)` no cambia: `--motivo` y su valor son dos elementos de `params`.

## Reglas de la capacidad

- **Dónde vive el dato:** campo `motivo` en el objeto de la reserva, en memoria de `src/app.js`. No hay persistencia.
- **Idioma de los nombres:** castellano (constitución, regla 4): `--motivo`, `canceladas`, capacidad `reservas`.
- **Límites:** tres motivos exactos (cambio de planes, sala ocupada, otro), comparados literal; «otro» sin texto libre; `--motivo` sin valor cuenta como falta.
- **Avisos:** «falta el motivo: cambio de planes, sala ocupada, otro» · «motivo no válido: cambio de planes, sala ocupada, otro» · «sin canceladas».
- **Regla ante conflicto:** sin reserva activa (inexistente o ya cancelada) responde «sin reserva <sala> <día>» antes de mirar el motivo.

## Dónde se prueba

- Motivo: por `run('cancelar', …)`, en `test/cancel.test.js`.
- Listado: por `run('canceladas', [])`, en `test/cancel.test.js`.

## Delta de comportamiento

### Capacidad: `reservas`

**MODIFIED — Cancelar exige un motivo de la lista** *(antes, en el código y en el test «cancelar una reserva activa»: `cancelar Norte lun` → «cancelada Norte lun», sin motivo)*

- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND `libres 10:00-12:00` responde «Norte, Sur»

- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa: `libres 10:00-12:00` responde «Sur»

- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo`
- THEN responde «falta el motivo: cambio de planes, sala ocupada, otro»

- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "porque sí"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»
- AND la reserva sigue activa: `libres 10:00-12:00` responde «Sur»

- GIVEN la reserva activa de Norte del lunes, 10:00-12:00
- WHEN `cancelar Norte lun --motivo "Sala ocupada"`
- THEN responde «motivo no válido: cambio de planes, sala ocupada, otro»

- GIVEN la reserva de Norte del lunes ya cancelada
- WHEN `cancelar Norte lun`
- THEN responde «sin reserva Norte lun»

**ADDED — El listado de canceladas enseña el motivo**

- GIVEN la reserva de Norte del lunes cancelada con «sala ocupada»
- WHEN `canceladas`
- THEN responde «Norte lun — sala ocupada»

- GIVEN ninguna reserva cancelada
- WHEN `canceladas`
- THEN responde «sin canceladas»

- GIVEN la reserva de Norte del lunes anulada con `anular Norte lun`
- WHEN `canceladas`
- THEN responde «sin canceladas»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
