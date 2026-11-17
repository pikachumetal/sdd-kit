---
id: 20260928-100000-feature-0015-order-summary
feature: 0015
title: Resumen del pedido
mode: full
status: approved
created: 2026-09-28
---

# Spec — Resumen del pedido

## Intent

El comercial abre la ficha y no ve de un vistazo a quién es el pedido ni cuánto suma: una tarjeta de resumen arriba de la ficha.

## Delta de comportamiento

### Capacidad: `orders`

**ADDED — La ficha abre con un resumen del pedido**
- GIVEN el pedido 1042 de Ferretería López, pendiente de envío, por 1.240,00 €
- WHEN se abre `/pedidos/1042`
- THEN bajo la cabecera hay una tarjeta «Resumen» con el cliente, el total y el estado

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-28 | aprobada |
