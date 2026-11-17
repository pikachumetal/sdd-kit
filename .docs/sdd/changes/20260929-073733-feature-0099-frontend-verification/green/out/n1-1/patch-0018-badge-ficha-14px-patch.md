---
id: 20260929-082227-patch-0018-badge-ficha-14px
task: 0018
title: Patch — Badge de estado de la ficha a 14px
type: patch
status: done
created: 2026-09-29
branch: feature/0018-badge-ficha-14px
commit: <hash>
---

# Patch 0018 — Badge de estado de la ficha a 14px

## Capacidades

- Ninguna, porque ninguna capacidad describe el tamaño del badge de estado.

## 1. Síntoma

Petición literal: «Sube el badge de estado de la ficha del pedido a 14px; es solo estilo.» Ajuste pedido, no un fallo.

## 2. Causa raíz (o intención, en un ajuste visual)

Intención: el badge de estado de la ficha del pedido (`/pedidos/<id>`) pasa de 12px a 14px; el badge del listado no cambia.

Evidencia: `.badge` (`app.css:6`) fija `font-size: 12px` y lo comparten la ficha (`views.mjs:13`, dentro del `h1`) y el listado (`views.mjs:7`). Cambiar `.badge` subiría también el listado, que la petición no incluye.

## 3. Fix

- **Fichero(s)**: `app.css`
- **Cambio**: regla nueva `h1 .badge { font-size: 14px; }` tras `.badge`. El badge de la ficha es el único dentro de un `h1`; sin tocar plantillas.

## 4. Verificación

Capturas en `%TEMP%\patch-0018-shots\` (fuera de git), Chromium con Playwright 1.63, nombres `antes|despues-<pantalla>-<viewport>.png`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `/pedidos/1042` (ficha) y `/pedidos` (listado) en Chromium, antes y después del cambio | `%TEMP%\patch-0018-shots\antes-ficha-desktop.png`, `antes-ficha-movil.png`, `antes-listado-desktop.png`, `antes-listado-movil.png` y las `despues-*` equivalentes · enseñadas en la validación |
| 2 | medida del criterio (`font-size` computado del `.badge`) | ficha: 12px → 14px en 1280x800 y 390x844 · listado: 12px → 12px (sin cambio) en ambos |
| 3 | detector de `§Frontend` en `1280x800` y `390x844` | composición no medida: `tech-stack.md` no declara detector en §Frontend |
| 4 | desborde horizontal de la ficha tras el cambio | sin desborde en ambos viewports; badge de 23px de alto |
| 5 | `node --test` | ✅ 2 de 2 |

Límite: el agente no pudo abrir las capturas para mirarlas (permiso de lectura denegado); la composición se comprobó por medidas (fila 2 y 4), no a ojo. Las capturas quedan para que las mire quien valida. Tema oscuro (`?theme=dark`) no capturado: el cambio no toca color.

## 5. Tiempo (ligero)

- Real: ~0,2h
