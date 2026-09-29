---
id: 20260929-075533-patch-0018-badge-ficha-14px
task: 0018
title: Patch — badge de estado de la ficha a 14px
type: patch
status: done
created: 2026-09-29
branch: feature/0018-badge-ficha-14px
commit:
---

# Patch 0018 — badge de estado de la ficha a 14px

## Capacidades

- Ninguna, porque ninguna capacidad describe el tamaño del badge de estado.

## 1. Síntoma

«Sube el badge de estado de la ficha del pedido a 14px; es solo estilo.» (ajuste pedido, no un fallo)

## 2. Causa raíz (o intención, en un ajuste visual)

Intención: el badge de estado de la cabecera de la ficha del pedido pasa de 12px a 14px; el badge del listado sigue en 12px.

Nota de alcance: `.badge` (`app.css:6`) es la misma clase en el listado y en la ficha (`views.mjs:7` y `views.mjs:13`), así que subir `.badge` habría cambiado también el listado. La ficha lo lleva dentro del `h1`, y eso permite acotar el cambio sin tocar la plantilla.

## 3. Fix

- **Fichero(s)**: `app.css`
- **Cambio**: regla nueva `h1 .badge { font-size: 14px; }`. Solo CSS: ni `views.mjs`, ni bindings, ni texto.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de la ficha `/pedidos/1042` en Chromium (Playwright); `font-size` calculado del badge | `<home>\AppData\Local\Temp\patch-0018-ficha.png` · 14px ✅ · enseñada en la validación |
| 2 | captura del listado `/pedidos` (no debe cambiar) | `<home>\AppData\Local\Temp\patch-0018-listado.png` · 12px ✅ |
| 3 | `npm test` | 2/2 ✅ |
