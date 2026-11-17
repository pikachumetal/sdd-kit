---
id: 20260928-215121-patch-0012-boton-guardar-ilegible
task: 0012
title: Patch — Botón Guardar ilegible (texto blanco sobre fondo blanco)
type: patch
status: done
created: 2026-09-28
branch: feature/0012-boton-guardar-ilegible
commit: pendiente
---

# Patch 0012 — Botón Guardar ilegible

## Capacidades

- Ninguna, porque ninguna capacidad describe el color de los botones (`order-sheets` solo dice qué acciones ofrece la ficha).

## 1. Síntoma

Reportado: «En las dos fichas el botón Guardar no se lee: sale el texto blanco sobre fondo blanco.»

Medido: coincide. En `pedido-detalle` y `albaran-detalle`, el botón `[data-accion=guardar]` tiene `color: rgb(255,255,255)` sobre `background-color: rgb(255,255,255)`.

## 2. Causa raíz

El commit `80fd576` («style: unificar el fondo de los botones») cambió `.btn-primario` de `background: #1f5fbf` a `background: #fff` en `styles/ficha.css` y dejó `color: #fff`. Ese texto era blanco porque el fondo era azul; con fondo blanco desaparece. Las dos fichas usan la misma clase `btn-primario` sobre Guardar, por eso fallan las dos a la vez. Evidencia: `git show 80fd576` y los estilos computados medidos en el navegador antes del fix.

## 3. Fix

- **Fichero(s)**: `styles/ficha.css`
- **Cambio**: `.btn-primario` conserva el fondo blanco que pidió `80fd576` y pasa a `color: #1f5fbf`, el mismo azul de su borde (contraste ≈ 6,6:1 sobre blanco).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Estilos computados de Guardar antes del fix, en Chromium (Playwright) | ❌ blanco sobre blanco en las dos fichas |
| 2 | Estilos computados de Guardar tras el fix | ✅ `rgb(31,95,191)` sobre `rgb(255,255,255)` en las dos fichas |
| 3 | Captura de `pedido-detalle` y `albaran-detalle` en Chromium | `<home>\AppData\Local\Temp\claude\D--code--worktrees-sdd-kit-0098-visual-patch-lane\150bf769-b398-4c73-bc1d-0fcf56219403\scratchpad\shots\{pedido,albaran}-detalle-{antes,despues}.png`, fuera de git · pendiente de enseñar en la validación |

El proyecto no tiene build ni tests.

## 5. Tiempo

Real: ~0,25 h
