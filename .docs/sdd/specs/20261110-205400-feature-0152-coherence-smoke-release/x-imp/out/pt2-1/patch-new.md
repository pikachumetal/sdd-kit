---
id: 20261112-205246-patch-0015-botones-columna-derecha
task: 0015
title: Patch — Guardar y Cancelar en columna derecha
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0015-botones-columna-derecha
commit: pendiente
---

# Patch 0015 — Guardar y Cancelar en columna derecha

Validación: dev-lead — lo ve una persona en la pantalla.

## Capacidades

- Ninguna, porque ninguna capacidad describe la disposición de la cabecera.

## 1. Síntoma

Petición: «en `public/index.html`, pasa Guardar y Cancelar de la cabecera a una columna derecha. Solo presentación.»

## 2. Intención

Guardar y Cancelar pasan de la cabecera, en línea con el título, a una columna a la derecha de la cabecera.

## 3. Fix

- **Fichero(s)**: `public/index.html`
- **Cambio**: los dos botones se envuelven en `div.acciones` (columna flex) y la cabecera pasa a flex con `space-between`. Mismo texto, sin handlers ni bindings nuevos.
- **Decisiones**: orden Guardar arriba, Cancelar abajo, el que ya tenían; sin hueco añadido entre botones (no se fija ningún valor nuevo) — dev-lead (petición: «columna»).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `index.html` en Chromium 1280×720, antes y después | `scratchpad/shots-0015/before.png` y `after.png` (fuera de git). No he podido abrir la imagen en esta sesión; lo sustituye la medición de cajas. |
| 2 | posiciones medidas con Playwright (x,y) | antes: Pedido (8,8), Guardar (8,66), Cancelar (73,66); después: Guardar (1203,8), Cancelar (1203,29): columna a la derecha, sin hueco añadido |
| 3 | detector de `§Frontend` | composición no medida: `operations.md` no declara detector en §Frontend |

Gate: `node --test` → 4/4 verde.

Revisión (sonnet): hallazgo 1, el `gap:.5rem` era un valor nuevo y la nota decía lo contrario — corregido: quitado el `gap`. Hallazgo 2, añadidas las coordenadas de antes — corregido. Hallazgos 3 y 4: sin cambio.
