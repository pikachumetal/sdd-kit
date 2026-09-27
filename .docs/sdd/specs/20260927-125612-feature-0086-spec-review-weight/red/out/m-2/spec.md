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

Review de spec propuesta: ninguna — señales: MODIFIED (1; el delta cambia el requisito existente «Búsqueda por cliente» de `bookings`); 1 señal, bajo el umbral de 4.

1. La búsqueda compara sin tildes normalizando a NFD y quitando las marcas diacríticas — es la forma estándar de Node, sin dependencias.
2. La `ñ` se trata como `n` — la recepción teclea deprisa y sin la tecla. Es consecuencia directa de la decisión 1 (NFD descompone `ñ` en `n` + marca de tilde combinada, que la misma limpieza elimina), no una regla aparte.

## Intent

La recepción busca «jose» y no encuentra a «José»: el cliente espera en el mostrador mientras se prueba con y sin tilde.

## Scope

- Entra: `src/search.js`, el buscador del mostrador, compara sin tildes.
- No entra: ordenar los resultados; buscar por teléfono.

## Approach

Normalizar el texto buscado y el nombre del cliente antes de comparar.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Búsqueda por cliente**
- GIVEN reservas de varios clientes, una de ellas de «José Peña»
- WHEN el recepcionista escribe parte del nombre del cliente
- THEN ve las reservas cuyo cliente contiene ese texto, sin distinguir mayúsculas ni tildes (`jose pena` encuentra a «José Peña»)

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
