---
id: 20261018-103026-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-10-18
author: <git-user>
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 El comando `anular` desaparece: hoy `anular Norte lun` responde `anulada Norte lun`; después responde `salas`, como cualquier comando que la herramienta no conoce. Cancelar queda como la única forma de dar de baja una reserva, y el requisito que lo describe deja de decir «propia». La guía, el README y el vocabulario del producto dejan de nombrar `anular`.

## Capacidades

- Modificadas: `bookings` — se retira el requisito «Anular una reserva» y «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»; el propósito deja de mencionar anular.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED/REMOVED (un requisito retirado y uno renombrado) · tamaño: ~35 líneas en 6 ficheros
- Mínimo razonable: ninguna — nada que añadir; deja sin mirar solo la lectura de un revisor sobre una spec de una señal.

1. `anular Norte lun` pasa a responder `salas` (el comando desconocido de hoy) — retirar es dejar que caiga en el mismo camino que cualquier palabra no reconocida; no añado un mensaje «comando retirado» que nadie pidió.
2. Se borra también el código muerto: la función `voidBooking`, la rama `anular` de `run` y el estado `voided` — nadie más los usa (comprobado con búsqueda de `anul`/`void` en `src/`, `test/` y `scripts/`).
3. «Cancelar una reserva» conserva los escenarios de «Cancelar una reserva propia» sin cambio — solo cambia el título; la restricción por persona no la implementa nada hoy y no se inventa aquí.
4. El renombrado va como `REMOVED` del título viejo + `ADDED` del nuevo, porque el título es la clave de fusión.
5. `docs/guia.md`: se borra la línea de `anular` y `cancelar` pasa de «cancela tu reserva» a «cancela una reserva», para no repetir el «propia» que se retira. La guía baja de 42 palabras, bajo su tope de 60: sin cambio de tope.
6. `README.md`: «Comandos: `cancelar` y `anular`» pasa a «Comando: `cancelar`».
7. `PRODUCT.md`: se borra el término «Anulación»; ya no existe el rol que lo definía. «Cancelación» se deja como está (aunque dice «el propio cliente»): corregirla es de la 0010 o la 0011, no de esta.
8. Fila 0011 del roadmap («Anular reservas de otros»): no la toco, pero **choca con esta feature** — hoy nace sobre el comando que se retira. Hay que decidir si se reformula (p. ej. cancelar reservas de otros por el responsable) o se descarta; lo dejo como pregunta para el cierre, no para esta spec.
9. Al cierre: la fila 0012 pasa a ✅ y se anota el `### Removed` en el changelog al cerrar (`sdd-archive`), no ahora.
10. El propósito de `bookings` pasa a «Reservar y cancelar salas desde la línea de comandos» — deja de nombrar lo retirado; `capability merge` no cambia el propósito, así que se edita a mano al cierre.
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»»
- Se actualiza la guía — «la guía docs/guia.md se actualiza»
- Perfil `delegate` — «Perfil delegate»

## Intent

Hoy la herramienta ofrece `cancelar` y `anular`, y `anular` (la baja por el responsable de sala) no se quiere mantener. Tras la feature la única baja es `cancelar`, y nada del código, de la capacidad ni de los documentos nombra `anular`. Fracasaría, aunque los tests pasen, si quedara una mención de `anular` en la guía o en la capacidad, o un estado `voided` sin camino que lo produzca.

## Scope

- Entra: quitar el comando `anular` y su código muerto de `src/app.js`; delta de `bookings`; `docs/guia.md`, `README.md` y `PRODUCT.md`; un test que fija que `anular` ya no hace nada especial.
- No entra: el motivo al cancelar (0010); qué hace el responsable de sala (0011); cambiar la respuesta de `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular`, `voidBooking`, estado `voided` | `src/app.js:21-26`, `src/app.js:35` | Scope; decisión 2 |
| Requisito «Anular una reserva» | `capabilities/bookings.md:15` | delta, `REMOVED` |
| Requisito «Cancelar una reserva propia» (título) | `capabilities/bookings.md:7` | delta, `REMOVED` + `ADDED` «Cancelar una reserva»; decisión 4 |
| Propósito «Reservar, cancelar y anular salas…» | `capabilities/bookings.md:5` | decisión 10 |
| Línea `anular` de la guía | `docs/guia.md:8` | Scope; decisión 5 |
| «cancela tu reserva» | `docs/guia.md:7` | decisión 5 |
| `cancelar` y `anular` | `README.md:5` | Scope; decisión 6 |
| Término «Anulación» | `PRODUCT.md:9` | Scope; decisión 7 |
| «Anular reservas de otros» | `roadmap.md` (fila 0011) | decisión 8: queda abierta |

- Filas que implementa: 0012 → `roadmap.md` y `docs/guia.md:8` («lo retira la 0012») — la línea de la guía se borra con la feature; la fila la cierra `sdd-archive`. Tests, `scripts/` y los walkthroughs de `specs/`: nada, comprobado con `grep -rniE "anul|void" test scripts .docs/sdd/specs`.

## Approach

Retirada en seco: se quita `anular` del despacho de comandos y el código que solo él usaba; la capacidad pierde su requisito y renombra el de cancelar (la respuesta `salas` de `anular` la fija el test, no la capacidad: un requisito negativo no es comportamiento que contar); los tres documentos que lo nombran se ajustan. Cancelar no se toca.

## Dónde se prueba

- `anular` ya no existe: por `run('anular', ['Norte','lun'])`, como los tests de `cancel.test.js`; espera `salas` y que la reserva de Norte el lunes siga activa (cancelarla después responde `cancelada Norte lun`).
- Cancelar sigue igual: los tests actuales de `cancel.test.js`.
- La guía: el test de tope de palabras de `words.test.js`.

## Términos y ADR

- Términos resueltos: «Anulación» se retira del vocabulario; el canónico para dar de baja es «Cancelación».
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

**REMOVED — Anular una reserva**
- motivo: el comando `anular` se retira; dar de baja una reserva es solo cancelarla.

**REMOVED — Cancelar una reserva propia**
- motivo: se renombra a «Cancelar una reserva».

**ADDED — Cancelar una reserva**
- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
