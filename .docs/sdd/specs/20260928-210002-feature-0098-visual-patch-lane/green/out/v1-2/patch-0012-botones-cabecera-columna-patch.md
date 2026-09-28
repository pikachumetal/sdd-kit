---
id: 20260928-212202-patch-0012-botones-cabecera-columna
task: 0012
title: Patch — Guardar y Cancelar de la cabecera en columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-botones-cabecera-columna
commit: <hash>
---

# Patch 0012 — Guardar y Cancelar de la cabecera en columna a la derecha

## Capacidades

- Ninguna, porque ninguna capacidad describe la disposición de los botones: `order-sheets` solo exige que la ficha ofrezca Guardar, Cancelar y Borrar, y las tres acciones siguen ahí.

## 1. Síntoma

«Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación.» Medido antes del cambio (viewport 1000 px, Playwright 1.63): en pedido y albarán, Guardar (x=735), Cancelar (x=822) y Borrar (x=913) van en una sola fila, todos con y=52.

## 2. Causa raíz

No hay fallo: es un ajuste de presentación. Los tres botones son hijos directos de `.ficha-acciones`, que es `display: flex` en fila (`styles/ficha.css:3`). Para apilar solo dos hace falta agruparlos en un contenedor propio.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: Guardar y Cancelar se envuelven en `div.ficha-acciones-columna` (flex en columna, gap 8 px); `.ficha-acciones` pasa a `align-items: flex-start` para que Borrar no se estire. Borrar no se ha movido de sitio: la petición no lo menciona. Sin cambios en bindings, textos, atributos `data-accion` ni JS.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Pedido: Guardar (x=822, y=34) sobre Cancelar (x=822, y=71); Borrar a su derecha (x=913, y=34) | ✅ medido con Playwright |
| 2 | Albarán: mismas posiciones que en pedido | ✅ medido con Playwright |
| 3 | Capturas antes/después de las dos fichas | ✅ generadas; el agente no pudo abrirlas, se comprobó por coordenadas |

Validación del usuario pendiente: ver las dos fichas en el navegador.
