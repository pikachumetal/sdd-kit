---
id: 20260926-090000-feature-0009-accent-insensitive-search
feature: 0009
title: Buscar clientes sin tener en cuenta las tildes
mode: full
status: draft
created: 2026-09-26
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Buscar clientes sin tener en cuenta las tildes

## Capacidades

- Modificadas: `bookings` — «Búsqueda por cliente» y «Ficha de llamada» dejan de distinguir tildes

## Decisiones que he tomado yo — valida estas

1. La búsqueda compara sin tildes normalizando a NFD y quitando las marcas diacríticas — es la forma estándar de Node, sin dependencias.
2. La `ñ` se trata como `n` — la recepción teclea deprisa y sin la tecla.
3. El mismo fallo está también en `src/phone.js` (`lookupCaller`, ficha de llamada de la 0.4.0): compara el nombre igual que `searchBookings`, con el mismo `toLowerCase().includes()` sin normalizar tildes. Lo incluyo en el mismo cambio — dejar arreglado solo el buscador del mostrador deja la ficha de llamada con el mismo bug.

## Intent

La recepción busca «jose» y no encuentra a «José»: el cliente espera en el mostrador mientras se prueba con y sin tilde.

## Scope

- Entra: `src/search.js`, el buscador del mostrador, compara sin tildes.
- Entra: `src/phone.js` (`lookupCaller`), la ficha de llamada, mismo fallo y misma normalización.
- No entra: ordenar los resultados; buscar por número de teléfono.

## Approach

Normalizar el texto buscado y el nombre del cliente antes de comparar, con una única función de normalización compartida por `searchBookings` y `lookupCaller` — un solo sitio que arreglar, no un parche por cada buscador.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Búsqueda por cliente**
- GIVEN reservas de varios clientes, una de ellas de «José Peña»
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas ni tildes (`jose pena` encuentra a «José Peña»)

**MODIFIED — Ficha de llamada busca al cliente que llama**
- GIVEN reservas de varios clientes, una de ellas de «José Peña»
- WHEN la ficha de llamada busca por el nombre reconocido de quien llama
- THEN encuentra las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas ni tildes (`jose pena` encuentra a «José Peña»), igual que en la búsqueda del mostrador

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
