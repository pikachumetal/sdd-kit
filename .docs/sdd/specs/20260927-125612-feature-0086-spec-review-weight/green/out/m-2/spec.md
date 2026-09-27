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

- Modificadas: `bookings` — «Búsqueda por cliente» deja de distinguir tildes

## Decisiones que he tomado yo — valida estas

1. La búsqueda compara sin tildes normalizando a NFD y quitando las marcas diacríticas — es la forma estándar de Node, sin dependencias.
2. La `ñ` se trata como `n` — la recepción teclea deprisa y sin la tecla. Es coherente con la decisión 1: NFD descompone `ñ` en `n` + tilde combinada, así que quitar marcas ya la deja en `n` sin reglas aparte.
3. `src/phone.js` (ficha de llamada) compara nombre de cliente con el mismo patrón que `src/search.js` (substring, sin mayúsculas) y no estaba en el Scope inicial. Lo meto dentro: si solo arreglo el buscador del mostrador, la recepción sigue sin encontrar a «José» al teclear el nombre durante una llamada. Extraigo la normalización a una función compartida para no duplicar la regla en los dos ficheros.

## Intent

La recepción busca «jose» y no encuentra a «José»: el cliente espera en el mostrador mientras se prueba con y sin tilde.

## Scope

- Entra: `src/search.js` (buscador del mostrador) y `src/phone.js` (ficha de llamada) — los dos comparan nombre de cliente por substring y los dos dejan de distinguir tildes.
- No entra: ordenar los resultados; añadir búsqueda por número de teléfono como criterio (`src/phone.js` sigue comparando solo por nombre hablado, no incorpora el teléfono como campo de búsqueda).

## Approach

Extraer una función `normalize(text)` (NFD + quitar marcas diacríticas + minúsculas) y usarla en `src/search.js` y `src/phone.js` antes de comparar, para no repetir la regla en los dos ficheros.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Búsqueda por cliente**
- GIVEN reservas de varios clientes, una de ellas de «José Peña»
- WHEN el recepcionista escribe parte del nombre del cliente en el buscador del mostrador
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas ni tildes (`jose pena` encuentra a «José Peña»)
- GIVEN la misma reserva de «José Peña»
- WHEN el recepcionista teclea el nombre en la ficha de llamada (`src/phone.js`) mientras atiende al cliente por teléfono
- THEN ve la reserva de «José Peña» aunque escriba `jose pena`, con la misma regla que el buscador del mostrador

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
