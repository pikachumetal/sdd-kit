---
id: 20260929-082414-patch-0018-badge-estado-ficha-14px
task: 0018
title: Patch — Badge de estado de la ficha a 14px
type: patch
status: done
created: 2026-09-29
branch: feature/0018-badge-estado-ficha-14px
commit: <hash>
---

# Patch 0018 — Badge de estado de la ficha a 14px

## Capacidades

- Ninguna, porque ninguna capacidad describe el tamaño del badge: `orders` solo fija que la cabecera muestra el estado.

## 1. Síntoma

«Sube el badge de estado de la ficha del pedido a 14px; es solo estilo.» No es un fallo: es un ajuste pedido. Medido antes: el badge de la ficha (`/pedidos/1042`) tiene `font-size: 12px`.

## 2. Intención

El badge de estado de la ficha del pedido (`h1 .badge` en `renderDetail`) pasa de 12px a 14px; el badge del listado sigue en 12px.

## 3. Fix

- **Fichero(s)**: `app.css`
- **Cambio**: regla nueva `h1 .badge { font-size: 14px; }`. `.badge` lo comparten el listado y la ficha (`views.mjs:7` y `:13`), así que subir `.badge` habría cambiado también el listado; la regla acotada al `h1` toca solo la ficha. Sin cambios en plantillas ni en TypeScript.

## 4. Verificación

Capturas fuera de git en `%TEMP%\patch-0018\` (`<home>\AppData\Local\Temp\patch-0018\`), Chromium con Playwright 1.63 contra `node server.mjs` en `http://localhost:4632`: `antes-*.png` y `despues-*.png` de `ficha` (`/pedidos/1042`) y de `listado` (`/pedidos`, para comprobar que no cambia), en 1280x800 y 390x844, tema claro y oscuro (`?theme=dark`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de la ficha en Chromium, antes y después | `%TEMP%\patch-0018\{antes,despues}-ficha-{1280x800,390x844}-{light,dark}.png` · enseñadas en la validación |
| 2 | detector de `§Frontend` en 1280x800 y 390x844 | composición no medida: `tech-stack.md` no declara detector en §Frontend |
| 3 | `font-size` computado del badge de la ficha (el criterio fija 14px) | 12px → 14px en los 2 viewports y los 2 temas ✅ |
| 4 | `font-size` computado del badge del listado | 12px antes y después ✅ (no cambia) |
| 5 | el badge cabe en la ficha (390x844): borde derecho 337px, `scrollWidth` 390, sin scroll horizontal | ✅ |
| 6 | `node --test` | 2 de 2 ✅ |

Ojos: el agente no pudo abrir las capturas (permiso de lectura de imágenes denegado en la sesión), así que la rúbrica de composición (jerarquía, ritmo, alineación) **no está mirada por el agente**; lo medido son los casos 3 a 5. Queda para la validación del dev-lead.
