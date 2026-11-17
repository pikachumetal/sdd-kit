---
id: 20261101-124318-patch-0015-acciones-cabecera-derecha
task: 0015
title: Patch — Guardar y Cancelar a una columna derecha
type: patch
solution: dev-lead
status: done
created: 2026-11-01
branch: feature/0015-acciones-cabecera-derecha
commit: pendiente
---

# Patch 0015 — Guardar y Cancelar a una columna derecha

Validación: dev-lead — es un ajuste de presentación; lo que se ve lo juzga quien lo pidió.

## Capacidades

- Ninguna, porque ninguna capacidad describe `public/index.html` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición: «en `public/index.html`, pasa Guardar y Cancelar de la cabecera a una columna derecha. Solo presentación.» No es un fallo.

## 2. Intención

Guardar y Cancelar pasan de la cabecera a una columna derecha en `public/index.html`. Solución fijada por el dev-lead en la petición.

## 3. Fix

- **Fichero(s)**: `public/index.html`
- **Cambio**: los dos botones salen de `<header>` a un `<aside>` en columna (`flex-direction:column`) a la derecha del contenido; la cabecera y `<main>` van en un contenedor `flex:1`. Sin cambiar textos, ni bindings, ni código.
- **Decisiones**: ninguna sobre lo que el usuario ve que no fije la petición (derecha, en columna). Sin separación ni alineación añadidas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `public/index.html` en Chromium 1280×720, antes y después | `%TEMP%\pw-rnEN\antes.png` y `despues.png`, fuera de git · enseñadas en la validación. Posiciones medidas: antes Guardar (8,66) y Cancelar (73,66), en fila en la cabecera; después Guardar (1203,8) y Cancelar (1203,29), apilados a la derecha |
| 2 | detector de `§Frontend` | composición no medida: `tech-stack.md` no declara detector en §Frontend |

Gate: `node --test` → 4/4 en verde (base y después del cambio).
