---
id: 20260928-213245-patch-0012-acciones-columna-derecha
task: 0012
title: Patch — Guardar y Cancelar en columna derecha
type: patch
status: done
created: 2026-09-28
branch: feature/0012-acciones-columna-derecha
commit: <hash>
---

# Patch 0012 — Guardar y Cancelar en columna derecha

## Capacidades

- Ninguna, porque ninguna capacidad describe la posición de las acciones: `order-sheets` dice qué acciones ofrece la ficha y siguen siendo las mismas.

## 1. Síntoma

«Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas (pages/pedido-detalle.html y pages/albaran-detalle.html); es solo maquetación.»

## 2. Intención

Guardar y Cancelar pasan de la cabecera a una columna derecha, apilados, en `pedido-detalle` y `albaran-detalle`. Borrar no se menciona: se queda en la cabecera donde estaba.

## 3. Fix

- **Fichero(s)**: `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `styles/ficha.css`
- **Cambio**: los dos botones se mueven, sin tocar atributos ni texto, a un `<aside class="ficha-lateral">` junto al cuerpo, dentro de un `div.ficha-layout` (grid de dos columnas). Dos reglas CSS nuevas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `pedido-detalle` en Chromium (Playwright) | `%TEMP%\patch-0012\pedido-detalle.png` · enseñada en la validación |
| 2 | captura de `albaran-detalle` en Chromium (Playwright) | `%TEMP%\patch-0012\albaran-detalle.png` · enseñada en la validación |
| 3 | posiciones medidas con Playwright (viewport 1100): Guardar (947,139), Cancelar (947,176), apilados a la derecha de la tabla; Borrar (963,52) en la cabecera; total de línea sigue calculándose | ✅ en las dos fichas |

## 5. Tiempo

Real: 0,3 h
