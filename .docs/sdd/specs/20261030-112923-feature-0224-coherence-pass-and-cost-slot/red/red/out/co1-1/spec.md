---
id: 20261008-120000-feature-0013-cancel-many-days
feature: 0013
title: Cancelar varios días de una vez
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Cancelar varios días de una vez

## Capacidades

- Modificadas: `bookings` — `cancelar` acepta varios días y exceptúa a `cancelar` de «Un comando con varios días trata cada día aparte».

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (un requisito de `bookings`) · tamaño: ~20 líneas en 3 ficheros. Mínimo razonable: ninguna.

1. **Choca con una regla vigente.** `bookings` dice hoy que un comando con varios días «trata cada día aparte» (atiende los demás y responde una línea por día). Esta spec cancela todo o nada, que es lo contrario para `cancelar`. Lo he declarado como `MODIFIED`: la regla sigue valiendo para los demás comandos y `cancelar` queda exceptuado. La alternativa es seguir la regla vigente (cancelar los días con reserva y avisar del que no la tiene); cambiaría el Approach y los THEN.
2. Los días van separados por espacios, sin límite (`Límites` de la capacidad sigue en «no aplica»).
3. La respuesta de éxito es `canceladas <sala> <día> <día>…`, con los días en el orden en que se escribieron. Es un texto inventado por mí.
4. Si faltan varios días con reserva, responde una línea `sin reserva <sala> <día>` por cada uno, en orden, y no cancela ninguno.
5. Con un solo día, `cancelar` responde como hoy (`cancelada Norte lun`).

Política de modelos: la del proyecto (`execution: native`, la sesión implementa).

Prueba del delta en una copia de `.docs/sdd` fuera del repo: `capability merge` → añadido «Cancelar varios días de una vez», añadido «Cancelar varios días es todo o nada», sustituido «Un comando con varios días trata cada día aparte». Sin rechazos.

## Intent

Hoy, para cancelar una semana hay que lanzar `cancelar` cinco veces. Quien cancela quiere hacerlo de una vez y saber si la operación entera salió.

## Scope

- Entra: `cancelar <sala> <día> <día>…` en `src/app.js` (hoy `run` solo pasa `params[0]` y `params[1]`), y el `MODIFIED` de `bookings`.
- No entra: reservar varios días.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | | |

- Filas que implementa: 0013 → nada: comprobado con `grep -rn 0013 .docs README.md`

## Approach

`cancelar` comprueba todos los días antes de tocar ninguna reserva.

## Dónde se prueba

- cancelar varios días: por el comando, como `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar varios días de una vez

- GIVEN reservas activas de Norte el lunes y el miércoles
- WHEN la persona ejecuta `cancelar Norte lun mie`
- THEN las dos quedan canceladas y responde `canceladas Norte lun mie`

#### ADDED — Cancelar varios días es todo o nada

- GIVEN una reserva activa de Norte el lunes y Norte sin reserva el martes
- WHEN la persona ejecuta `cancelar Norte lun mar`
- THEN no cancela ninguna y responde `sin reserva Norte mar`

#### MODIFIED — Un comando con varios días trata cada día aparte

- GIVEN cualquier comando que acepta varios días, salvo `cancelar`, con un día que no se puede atender
- WHEN la persona lo ejecuta
- THEN atiende los demás días y responde una línea por día, también la del que no pudo atender
- AND `cancelar` con varios días no atiende ninguno si alguno no se puede atender (ver «Cancelar varios días es todo o nada»)

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
