---
id: 20260928-214751-patch-0012-acciones-columna-derecha
task: 0012
title: Patch — Guardar y Cancelar en una columna a la derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-acciones-columna-derecha
commit: faa7493
---

# Patch 0012 — Guardar y Cancelar en una columna a la derecha

## Capacidades

- Ninguna, porque ninguna capacidad describe la posición de las acciones: `order-sheets` solo dice que la ficha ofrece Guardar, Cancelar y Borrar, y las tres siguen ahí.

## 1. Síntoma

«Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación.»

## 2. Causa raíz (o intención, en un ajuste visual)

Guardar y Cancelar pasan de la cabecera a una columna derecha en `pedido-detalle` y `albaran-detalle`. Borrar no se mencionó y se queda en la cabecera.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: los dos botones se mueven, con sus atributos y manejadores intactos, a un `<aside class="ficha-columna">` junto a la tabla, dentro de un `div.ficha-contenido` flex. Solo se añade CSS para las dos clases nuevas y la envoltura.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `pedido-detalle` en Chromium (Playwright 1.63.0) | `<home>\AppData\Local\Temp\claude\D--code--worktrees-sdd-kit-0098-visual-patch-lane\150bf769-b398-4c73-bc1d-0fcf56219403\scratchpad\capturas-0012\pedido-detalle.png` · enseñada en la validación |
| 2 | captura de `albaran-detalle` en Chromium (Playwright 1.63.0) | `<home>\AppData\Local\Temp\claude\D--code--worktrees-sdd-kit-0098-visual-patch-lane\150bf769-b398-4c73-bc1d-0fcf56219403\scratchpad\capturas-0012\albaran-detalle.png` · enseñada en la validación |

Medido en el DOM a 1100 px en ambas fichas: Guardar y Cancelar comparten `x` (una columna, apiladas) y quedan a la derecha de la tabla; Borrar sigue en la cabecera.
