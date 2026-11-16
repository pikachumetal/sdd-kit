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

- Modificadas: `bookings` — se añade un requisito (`cancelar` acepta varios días); ningún requisito existente cambia.

## Decisiones que he tomado yo — valida estas

1. Los días van separados por espacios, sin límite (la capacidad declara «Límites: no aplica»).
2. `cancelar` sigue la regla que `bookings` ya tiene, «Un comando con varios días trata cada día aparte»: cancela los días que tienen reserva y responde una línea por día, en el orden en que se escriben. Si prefieres «todo o nada», es un MODIFIED de ese requisito y lo reescribo.
3. Un día repetido (`lun lun`) responde `cancelada` la primera vez y `sin reserva` la segunda; un día que no existe responde `sin reserva`, igual que hoy. `cancelar Norte` sin días queda como hoy, fuera de esta feature.
4. Reglas de la capacidad: dónde viven los datos, idioma, límites, avisos y conflicto no cambian («no aplica»). Roles y permisos: no aplica, la regla de las 24 h de `PRODUCT.md` no está en `bookings` ni en el código y no entra aquí.
5. Política de modelos: sesión Native; revisión de la spec con un revisor (Sonnet), por alcance pequeño y sin MODIFIED.

### Hallazgos de la review

Revisión de spec propuesta: un revisor — señales: ninguna de contrato público ni MODIFIED · tamaño: ~10 líneas en 2 ficheros. No hubo ningún Crítico, así que no hay segunda ronda.
- **Aceptado** — «Modificadas» contradice un ADDED → la línea de Capacidades aclara que se añade un requisito y no cambia ninguno.
- **Aceptado** — faltan días repetidos, inválidos y sin días → decisión 3 y escenario del día repetido.
- **Aceptado** — decisiones sin declarar (orden, duplicados, límites) → decisiones 1 a 4.
- **Aceptado** — el Intent hablaba de «operación entera» → reescrito a una respuesta por día; el historial de la corrección sale de las decisiones.
- **Aceptado** — `anular` afirmado sin respaldo → pasa a «No entra» sin describirlo.
- **Rechazado** — reservas ajenas y menos de 24 h → `bookings` no tiene esa regla y el código tampoco; añadirla es otra feature.
- **Aceptado** — verificación del merge y política de modelos mezcladas con decisiones → el merge sale de las decisiones y consta aquí: `sdd capability merge` en una copia de `.docs/sdd` dio «añadido «Cancelar varios días de una vez»», sin rechazos.
- **Aceptado** — el grep no cubría `src` ni `test` → ampliado.
- **Aceptado** — «Dónde se prueba» no pedía el caso mixto → ahora lo exige.

## Intent

Hoy, para cancelar una semana hay que lanzar `cancelar` cinco veces. Quien cancela quiere hacerlo de una vez y saber, día por día, cuál se canceló y cuál no tenía reserva.

## Scope

- Entra: `cancelar <sala> <día> <día>…` en `src/app.js` (rama `cancelar` de `run`) y su test en `test/cancel.test.js`.
- No entra: reservar varios días, ni `anular`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | | |

- Filas que implementa: 0013 → nada: comprobado con `git grep -n 0013 -- src test README.md .docs/sdd/steering .docs/sdd/capabilities` (sin resultados) y el README no documenta `cancelar`.

## Approach

`cancelar` recorre los días y trata cada uno aparte, como exige la capacidad; responde una línea por día.

## Dónde se prueba

- cancelar varios días: por el comando, como `test/cancel.test.js`, con el caso mixto (`lun mar`), el orden de las líneas y el día repetido.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar varios días de una vez

- GIVEN reservas activas de Norte el lunes y el miércoles
- WHEN la persona ejecuta `cancelar Norte lun mie`
- THEN las dos quedan canceladas y responde dos líneas: `cancelada Norte lun` y `cancelada Norte mie`
- AND con `cancelar Norte lun mar`, sin reserva el martes, cancela el lunes y responde `cancelada Norte lun` y `sin reserva Norte mar`
- AND con `cancelar Norte lun lun` responde `cancelada Norte lun` y `sin reserva Norte lun`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
