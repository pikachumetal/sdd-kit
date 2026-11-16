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

- Ampliadas con un requisito nuevo: `bookings` — `cancelar` acepta varios días. Ningún requisito vigente cambia: «Cancelar una reserva propia» sigue valiendo para un día y «Un comando con varios días trata cada día aparte» ya fija el trato por día.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de las 8 (sin capacidad nueva, contrato público, `MODIFIED`, datos ni roles; área explorada: `bookings` y `src/app.js`) · tamaño: ~15 líneas en 1 fichero
- Dominio (sonnet): si el escenario respeta el requisito vigente «Un comando con varios días trata cada día aparte» y si el caso del día sin reserva queda cubierto (señal: capacidad ya existente)
- Mínimo razonable: sin revisor — deja sin mirar choques con la capacidad, justo el que se encontró en la coherencia

1. **Cada día va aparte, como ya manda la capacidad (cambio respecto al borrador).** El borrador decía «todo o nada»: con `cancelar Norte lun mar`, sin reserva el martes, no cancelaba ninguna y respondía una sola línea. Eso contradice «Un comando con varios días trata cada día aparte» (atiende los demás días y responde una línea por día), y habría sido un `MODIFIED` sin declarar. Ahora: se cancela el lunes, el martes dice `sin reserva Norte mar`, y la persona ve qué salió y qué no con una línea por día. **Si quieres «todo o nada», dímelo: sería un `MODIFIED` de ese requisito y afecta a `reservar` y a los demás comandos con varios días.** Enfoque: A (cada día aparte) frente a B (comprobar todos antes de tocar ninguno; ver Approach).
2. Los días van separados por espacios, sin límite (la capacidad dice «Límites: no aplica»).
3. Un día repetido (`cancelar Norte lun lun`) se trata como dos días: el segundo responde `sin reserva Norte lun`. No lo deduplico.
4. `cancelar Norte` sin ningún día queda fuera de esta spec: la capacidad no lo especifica y no lo toco; pendiente: si quieres que avise de que faltan días.
5. Reglas de la capacidad: dónde viven los datos, idioma, límites, avisos y conflicto — sin cambios, no aplican a esta spec.
6. Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

7. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → «bookings.md: añadido “Cancelar varios días de una vez”» (sin rechazos; el `capabilities/` del repo no cambia).

### Hallazgos de la review

- **Rechazado** (Crítico) — el ADDED repite requisitos vigentes y debería ser `MODIFIED` → el requisito genérico presupone que `cancelar` ya acepta varios días, y ninguno lo dice; el ADDED es el único sitio que lo fija, y «Cancelar una reserva propia» sigue cierto para un día, así que no se reescribe ningún requisito.
- **Aceptado** — cabecera «Modificadas» contra delta solo ADDED → la cabecera de Capacidades ahora dice «ampliadas con un requisito nuevo».
- **Aceptado** — el escenario pasa sin tocar el estado → añadido un THEN sobre el estado (`reservas Norte` ya no devuelve `lun`) y el orden de las líneas es el de los días dados.
- **Aceptado** — día repetido sin escenario → escenario nuevo con `cancelar Norte lun lun`.
- **Aceptado** — `cancelar Norte` sin días sin especificar → declarado fuera de esta spec (decisión 4).
- **Aceptado** — señales mal contadas → corregidas en la cabecera de la review.
- **Aceptado** — `test/cancel.test.js` no estaba en el Scope → añadido.
- **Aceptado** — dos días sin reserva a la vez → añadido como escenario.
- **Rechazado** — mover la política de modelos fuera de ✋ → en `delegate` esa línea va ahí por regla del kit.
- Sin segunda ronda: el Crítico se rechaza con motivo y la decisión central no se reescribe.

## Decisiones tomadas con el dev-lead

- «Cancelar varios días de una vez» (fila 0013 del roadmap, carril feature).

## Intent

Hoy, para cancelar una semana hay que lanzar `cancelar` cinco veces. Quien cancela quiere hacerlo de una vez y saber, día a día, qué salió y qué no.

Anti-objetivo: que un día sin reserva haga fallar en silencio el resto, o que la respuesta no diga cuál falló.

## Scope

- Entra: `cancelar <sala> <día> <día>…` en `src/app.js` (la función `run`; no hay otro sitio que aplique `cancelar`, comprobado con `git grep cancelar`) y sus tests en `test/cancel.test.js`.
- No entra: reservar varios días; `anular` con varios días.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | | |

- Filas que implementa: 0013 → nada que retirar: comprobado con `git grep -n 0013 -- . ':!.docs/sdd/specs'` (solo su fila en `ROADMAP.md`).

## Approach

- **A (elegido): cada día aparte.** `cancelar` recorre los días y aplica `cancelBooking` a cada uno; responde una línea por día. Coincide con el requisito vigente de la capacidad y reutiliza `cancelBooking` tal cual.
- B: comprobar todos los días antes de tocar ninguno. Da «todo o nada», pero contradice la capacidad (exigiría un `MODIFIED`) y obliga a una segunda pasada.

## Dónde se prueba

- cancelar varios días: por el comando (`run('cancelar', [...])`), junto a `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar varios días de una vez

- GIVEN reservas activas de Norte el lunes y el miércoles
- WHEN la persona ejecuta `cancelar Norte lun mie`
- THEN las dos quedan canceladas (`reservas Norte` ya no devuelve `lun` ni `mie`) y responde una línea por día, en el orden dado: `cancelada Norte lun` y `cancelada Norte mie`
- AND con `cancelar Norte lun mar mie`, con reserva el lunes y el miércoles y ninguna el martes, cancela lunes y miércoles y responde `cancelada Norte lun`, `sin reserva Norte mar` y `cancelada Norte mie`
- AND con `cancelar Norte mar jue`, sin reserva ninguno de los dos, responde `sin reserva Norte mar` y `sin reserva Norte jue`
- AND con `cancelar Norte lun lun`, con reserva el lunes, responde `cancelada Norte lun` y después `sin reserva Norte lun`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
