---
id: 20261115-142534-patch-0015-botones-columna-derecha
task: 0015
title: Patch — Guardar y Cancelar a una columna derecha
type: patch
solution: dev-lead
status: done
created: 2026-11-15
branch: feature/0015-botones-columna-derecha
commit: pendiente
---

# Patch 0015 — Guardar y Cancelar a una columna derecha

Validación: dev-lead — lo usa una persona y es una disposición visual.

## Capacidades

- Ninguna, porque ninguna capacidad describe la pantalla `public/index.html`.

## 1. Síntoma

Petición: «en `public/index.html`, pasa Guardar y Cancelar de la cabecera a una columna derecha. Solo presentación.»

## 2. Intención

Guardar y Cancelar pasan de la cabecera a una columna derecha en `public/index.html`.

## 3. Fix

- **Fichero(s)**: `public/index.html`
- **Cambio**: los dos botones salen de `<header>` y van a un `<aside class="acciones">` a la derecha de `<main>`, apilados en columna; `<main>` y ese `<aside>` van envueltos en un `<div class="cuerpo">` flex (regla `.cuerpo main{flex:1}`); se añade un `<style>` mínimo con flex.
- **Decisiones**:
  - La columna va a la derecha de `<main>`, con los botones apilados en el orden actual — dev-lead (petición)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `index.html` en Chromium (Playwright), antes y después | `%TEMP%\..\pw-0015\antes.png` y `despues.png` (fuera de git). Después no se pudo mirar la imagen (permiso de lectura denegado); se midió con `getBoundingClientRect` a 1024 px: Guardar (947,66) y Cancelar (947,95), a la derecha de «Detalle» (8,66), y fuera de la cabecera (la cabecera solo contiene «Pedido»; los botones están en y≥66, por debajo de ella). Solo se midió a 1024 px; la medida «antes» es la captura `antes.png` |
| 2 | detector de `§Frontend` | composición no medida: `operations.md` no declara detector en §Frontend |

Gate: `node --test` → 4/4 en verde.

Revisión (un revisor sonnet): el §3 no nombraba el `<div class="cuerpo">` ni la regla de `main` → corregido, §3 lo dice. La verificación no respaldaba «fuera de la cabecera» ni decía a qué ancho se midió → corregido en la fila 1. Su nota de que no corrió `node --test` es suya; el 4/4 lo corrí yo.
