---
id: 20260928-213117-patch-0012-acciones-columna-derecha
task: 0012
title: Patch — Guardar y Cancelar en columna derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-acciones-columna-derecha
commit:
---

# Patch 0012 — Guardar y Cancelar en columna derecha

## 1. Síntoma

«Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html); es solo maquetación.» Ajuste visual: no hay fallo que reproducir.

## 2. Causa raíz (o intención, en un ajuste visual)

Guardar y Cancelar pasan de la cabecera a una columna a la derecha del cuerpo, en `pedido-detalle` y `albaran-detalle`. Borrar no se menciona y se queda en la cabecera.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: los dos botones se mueven a un `<aside class="ficha-columna">` junto a `.ficha-cuerpo`, dentro de un contenedor `.ficha-layout`; tres reglas CSS nuevas. Sin cambios en atributos, texto ni JS.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `pedido-detalle` en Chromium (Playwright, 1000 px) | `<home>\AppData\Local\Temp\tmp.rlThY628D8\pedido-detalle.png`, fuera de git |
| 2 | captura de `albaran-detalle` en Chromium (Playwright, 1000 px) | `<home>\AppData\Local\Temp\tmp.rlThY628D8\albaran-detalle.png`, fuera de git |
| 3 | posiciones medidas en ambas fichas | Guardar y Cancelar apilados en x≈897 (derecha de la tabla, que acaba en x≈881); Borrar sigue en la cabecera (y≈52) |

El agente no pudo abrir las imágenes: la comprobación visual se apoya en las posiciones medidas. Pendiente de validación del usuario en `sdd-end-patch`.
