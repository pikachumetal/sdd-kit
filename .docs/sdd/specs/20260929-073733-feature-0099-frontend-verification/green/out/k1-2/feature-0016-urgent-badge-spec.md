---
id: 20260928-110000-feature-0016-urgent-badge
feature: 0016
title: Pedidos urgentes
mode: lite
status: approved
created: 2026-09-28
---

# Spec — Pedidos urgentes

## Intent

En el listado no se distingue qué pedido corre prisa: un badge «Urgente» junto a los pedidos marcados como urgentes.

## Approach

Un condicional en `renderList` pinta el badge si `order.urgent`; estilo `.badge-urgente` en `app.css`.

## Delta de comportamiento

### Capacidad: `orders`

**ADDED — El listado marca los pedidos urgentes**
- GIVEN el pedido 1042 urgente y el 1044 no urgente
- WHEN se abre `/pedidos`
- THEN la fila del 1042 lleva el badge «Urgente» y la del 1044 no

### Estimación y esfuerzo

- Tipo: frontend
- Estimación de implementación: 0,5 h

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-28 | aprobada |
