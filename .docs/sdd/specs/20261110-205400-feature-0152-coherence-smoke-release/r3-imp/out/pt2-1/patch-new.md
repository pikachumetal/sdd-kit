---
id: 20261112-091312-patch-0015-acciones-cabecera-derecha
task: 0015
title: Patch — Guardar y Cancelar en una columna derecha de la cabecera
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0015-acciones-cabecera-derecha
commit: pendiente
---

# Patch 0015 — Guardar y Cancelar en una columna derecha de la cabecera

Validación: dev-lead — es lo que una persona ve en pantalla; las capturas y las medidas del agente no sustituyen su vista.

## Capacidades

- Ninguna, porque ninguna capacidad describe la pantalla `public/index.html` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición literal: «en `public/index.html`, pasa Guardar y Cancelar de la cabecera a una columna derecha. Solo presentación.»

Estado medido antes: Guardar y Cancelar quedan en línea, debajo del título «Pedido» y pegados al borde izquierdo (x = 8 px, y = 66 px en 1280 y en 375 px de ancho).

## 2. Intención

Guardar y Cancelar dejan de ir sueltos en la cabecera y pasan a una columna a la derecha de ella. Autor: dev-lead (la petición).

## 3. Fix

- **Fichero(s)**: `public/index.html`
- **Cambio**: los dos botones se envuelven en `<div class="acciones">` (columna flex: Guardar encima de Cancelar, orden del HTML anterior), y la cabecera (`class="cabecera"`) pasa a flex con el título a la izquierda y esa columna a la derecha. Se añade un `<style>` con tres reglas; una de ellas, `margin:0` del `h1`, evita que el título baje 21 px al dejar de colapsar su margen dentro del flex. No se añade, quita ni cambia ningún texto, botón, evento ni binding, y no se eligen separaciones ni alineaciones propias.
- **Efecto inevitable**: los botones salen de la línea que ocupaban bajo el título, así que el contenido de `<main>` sube (y = 103 → 66 px). El título se queda donde estaba (y = 8).

## 4. Verificación

Sin tests: es solo layout y el proyecto no tiene prueba de pantalla. `node --test` sigue en verde (4/4).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `public/index.html` en Edge (Playwright), 1280 px y 375 px, antes y después | `D:\code\git\sdd-kit\.temp\pw-0015\antes-desktop.png`, `antes-movil.png`, `despues-desktop.png`, `despues-movil.png` (fuera de git) · pendiente de que el dev-lead las vea en la validación |
| 2 | medida de los botones después del cambio | Guardar (1203, 8) y Cancelar (1203, 29) en 1280 px; (298, 8) y (298, 29) en 375 px; pegados al borde derecho, uno encima de otro, sin desbordar (scrollWidth 1280 y 375) ✅ |
| 3 | medida del título y de `<main>`, antes → después | título y: 8 → 8 · `<main>` y: 103 → 66, en 1280 y 375 px ✅ |
| 4 | detector de `§Frontend` | composición no medida: `operations.md` no declara detector en §Frontend |
| 5 | `node --test` | 4/4 pasan, sin cambios (el HTML no lo usa nadie) ✅ |

Revisión del patch (un revisor sonnet): 1 Importante, el título y `<main>` se movían sin declararlo → corregido (`margin:0` del `h1`, medidas en las filas 3 y en §3). Menores: decisiones de `gap` y alineación superior → rechazadas por quitadas, se eliminó el CSS que las fijaba · estado y fila 1 sin resultado → corregido, la fila 1 queda pendiente de validación · marcado sin `<!doctype>` ni `<head>` → rechazado, ya era así y no es de este patch.
