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

- Modificadas: `bookings` — `cancelar` acepta varios días.

## Decisiones que he tomado yo — valida estas

1. Los días van separados por espacios, sin límite.
2. Cada día se trata aparte, como ya exige el requisito «Un comando con varios días trata cada día aparte» de `bookings`: si un día no tiene reserva, los demás se cancelan igual y la respuesta lleva una línea por día. **Corrección mía**: el borrador decía «todo o nada» con una sola línea de respuesta, y eso contradecía ese requisito. Si prefieres «todo o nada», habría que hacer un `MODIFIED` de ese requisito, que afecta a cualquier comando con varios días: dímelo y lo cambio.
3. La respuesta reutiliza el texto de hoy, una línea por día y en el orden dado: `cancelada Norte lun` / `sin reserva Norte mar`.
4. Un día repetido (`cancelar Norte lun lun`) responde `cancelada Norte lun` y luego `sin reserva Norte lun`, porque la primera ya la canceló. Sin días (`cancelar Norte`) no se toca: no entra.
5. Review de spec: ninguna. Señales: ninguna (delta `ADDED` de una capacidad existente, ~15 líneas en 2 ficheros, sin contrato público ni datos). Mínimo razonable: lo mismo; no deja nada sin mirar salvo lo que la pasada de coherencia ya cubrió.
6. Política de modelos: Sonnet con effort medium para la implementación (una task, Native).
7. Prueba del delta en una copia de `.docs/sdd` (`capability merge`): añadidos «Cancelar varios días de una vez» y «Un día sin reserva no impide cancelar los demás», sin rechazos. El `capabilities/` del repo no cambia.

## Intent

Hoy, para cancelar una semana hay que lanzar `cancelar` cinco veces. Quien cancela quiere hacerlo de una vez y saber, día a día, qué se canceló y qué no tenía reserva.

## Scope

- Entra: `cancelar <sala> <día> <día>…` en `src/app.js` (`run`, que hoy solo pasa `params[1]`) y su test en `test/cancel.test.js`.
- No entra: reservar varios días; `anular` con varios días (`voidBooking`); `cancelar` sin días.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | | |

- Filas que implementa: 0013 → nada: comprobado con `grep -rn 0013 .docs README.md`

## Approach

`cancelar` recorre los días dados, cancela cada uno que tenga reserva activa y responde una línea por día (ver ✋ 2 y 3).

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
- THEN las dos quedan canceladas y responde `cancelada Norte lun` y `cancelada Norte mie`, una línea por día

#### ADDED — Un día sin reserva no impide cancelar los demás

- GIVEN una reserva activa de Norte el lunes y Norte sin reserva el martes
- WHEN la persona ejecuta `cancelar Norte lun mar`
- THEN la del lunes queda cancelada y responde `cancelada Norte lun` y `sin reserva Norte mar`, una línea por día

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
