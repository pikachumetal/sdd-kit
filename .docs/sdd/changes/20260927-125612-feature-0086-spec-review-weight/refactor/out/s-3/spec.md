---
id: 20260926-090000-feature-0011-site-code-field
feature: 0011
title: La sede de origen como campo propio
mode: full
status: draft
created: 2026-09-26
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — La sede de origen como campo propio

## Capacidades

- Modificadas: `bookings` — el portal recibe la sede de la reserva

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: contrato público (`GET /api/bookings` lo consume el portal del cliente) · MODIFIED (requisito «El portal del cliente lista sus reservas») · datos (campo `site` nuevo) · tamaño: delta pequeño (baja de dos revisores a uno)
- Dominio+Técnica (siete puntos): si el valor de `site` es coherente con la regla de producto de la constitution y con «Código de reserva» de `capabilities/bookings.md`; si el enfoque elegido evita el riesgo de re-etiquetar mal el histórico.
- Mínimo razonable: ninguna review — deja sin mirar si el JSON del portal rompe algún consumidor que espere solo 4 campos.

### Hallazgos de la review

1. **Aceptado (Crítico)** — el enfoque original (columna nueva + migración con default fijo `local`) dejaría las reservas ya importadas de Madrid marcadas como `local`, justo el dato que la feature quiere corregir, porque su origen real solo consta en el prefijo del código → cambiado el approach: `site` se deriva del prefijo de `code` en el momento de leer, sin columna ni migración; así el histórico ya existente sale correcto sin backfill.
2. **Aceptado** — el Scope no cubría dónde se asigna `site` al crear o importar una reserva → ya no aplica: al derivarse de `code`, no hay ninguna escritura nueva que cubrir.
3. **Aceptado** — faltaba un escenario verificable para "guardar la sede al crear o importar" → ya no aplica: no se guarda nada nuevo; el escenario de lectura ya cubre reserva propia e importada, que es lo único que hay que probar.
4. **Aceptado** — los valores concretos del campo (`local` y el prefijo de sede) no estaban en esta lista → añadidos como decisión 2, abajo.
5. **Aceptado** — no estaba claro a qué base de datos aplicaba la migración → ya no aplica: sin migración.
6. **Aceptado** — faltaba la regla de mayúsculas/minúsculas de los valores → declarada en la decisión 2: se toma el prefijo tal cual aparece en el código (ya en mayúsculas por convención existente, p. ej. `MAD`) y `local` en minúsculas cuando no hay prefijo.

**Decisiones de diseño:**

1. `site` se deriva del prefijo de `code` en `bookingToJson`, sin columna nueva en `bookings` ni migración: una reserva sin prefijo (`R-0042`) es `local`; una reserva con prefijo de sede (`MAD-R-0042`) es ese prefijo (`MAD`). El prefijo ya identifica el origen según `capabilities/bookings.md` ("Código de reserva"), así que no hace falta guardarlo dos veces.
2. Valores del campo: `local` (minúsculas, sede propia) o el prefijo de sede en mayúsculas tal cual aparece en el código (`MAD`).
3. El portal recibe un campo nuevo `site` en `GET /api/bookings`; los campos que ya recibe no cambian.

## Intent

El portal del cliente quiere mostrar en qué sede es cada reserva, hoy solo deducible del prefijo del código; que lo calcule el backend y no cada consumidor.

## Scope

- Entra: derivar `site` desde el prefijo de `code` en `bookingToJson` (`src/api.js`, unas líneas).
- No entra: cambiar el código de reserva; mostrar la sede en recepción; persistir `site` como columna en base de datos.

## Approach

Calcular `site` a partir de `booking.code` al construir el JSON del portal: sin prefijo → `local`; con prefijo de sede → ese prefijo.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — El portal del cliente lista sus reservas**
- GIVEN un cliente con una reserva propia (`R-0042`) y una importada de la sede de Madrid (`MAD-R-0017`)
- WHEN el portal pide `GET /api/bookings`
- THEN recibe cada reserva con `code`, `customer`, `day`, `start` y `site` (`local` para `R-0042`, `MAD` para `MAD-R-0017`)

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
