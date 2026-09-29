---
id: 20260929-075901-patch-0018-badge-estado-ficha
task: 0018
title: Patch — badge de estado de la ficha a 14px
type: patch
status: done
created: 2026-09-29
branch: feature/0018-badge-estado-ficha
commit: pendiente
---

# Patch 0018 — badge de estado de la ficha a 14px

## 1. Síntoma

Petición: «Sube el badge de estado de la ficha del pedido a 14px; es solo estilo.» Ajuste pedido, no un fallo.

## 2. Causa raíz (o intención, en un ajuste visual)

Intención: el badge de estado de la cabecera de la ficha (`/pedidos/<id>`) pasa de 12px a 14px; el badge del listado no cambia.

Evidencia: `.badge` (`app.css`) fija `font-size: 12px` y lo usan la ficha y el listado (`views.mjs`, `renderDetail` y `renderList`), así que subir `.badge` movería también el listado. Por eso el selector se acota a la cabecera de la ficha.

## 3. Fix

- **Fichero(s)**: `app.css`
- **Cambio**: regla nueva `h1 .badge { font-size: 14px; }`. Solo CSS; `views.mjs` sin tocar.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node --test` | ✅ 2/2 |
| 2 | *(ajuste visual)* capturas de la ficha `/pedidos/1042` en Chromium (Playwright), 1280x800 y 390x844, y del listado como control | `%TEMP%\claude\D--code--worktrees-sdd-kit-0099-frontend-verification\bd593fa3-334e-428b-87fa-6c692514bb5f\scratchpad\shots-0018\` (`ficha-1280.png`, `ficha-390.png`, `listado-1280.png`) · tamaño computado: ficha 14px en ambos viewports, listado 12px sin cambios |
