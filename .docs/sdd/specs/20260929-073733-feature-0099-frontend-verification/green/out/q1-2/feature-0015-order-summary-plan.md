---
id: 20260928-100000-feature-0015-order-summary
feature: 0015
title: Plan de implementación — Resumen del pedido
spec: ./spec.md
status: approved
created: 2026-09-28
---

# Plan de implementación — Resumen del pedido

**Ejecución**: native, fijado en sdd-kit.json.

## 2. Tasks

### Task 1 — Los datos del resumen

**Superficies**: backend
**Verificación**: `node --test`

- `summaryOf(order)` en `views.mjs` devuelve `{ customer, total, status }`.

### Task 2 — La tarjeta de resumen en la ficha

**Superficies**: frontend
**Verificación**: `node --test`
**Verificación visual**: `/pedidos/1042` y `/pedidos/1042?theme=dark` · estados: normal, y `/pedidos/1043` con «Enviar» deshabilitado · temas claro y oscuro · qué mirar: la tarjeta muestra cliente, total y estado, bajo la cabecera y antes de la tabla
**Se prueba en la aplicación**: el comercial abre `/pedidos/1042` y ve la tarjeta «Resumen» con Ferretería López, 1.240,00 € y Pendiente de envío.

- `renderDetail` pinta `<section class="card">` con `<h2>Resumen</h2>` y los tres datos; estilo `.card` en `app.css`.

### Task 3 — El listado enlaza cada pedido con su resumen

**Superficies**: frontend
**Verificación**: `node --test`

- Cada fila del listado muestra el total junto al cliente.
