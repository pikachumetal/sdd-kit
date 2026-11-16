---
id: 20261112-184744-patch-0015-botones-derecha
task: 0015
title: Patch — Guardar y Cancelar a una columna derecha
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0015-botones-derecha
commit: pendiente
---

# Patch 0015 — Guardar y Cancelar a una columna derecha

Validación: dev-lead — es lo que ve una persona en la pantalla.

## Capacidades

- Ninguna, porque ninguna capacidad describe `public/index.html` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

Petición literal: «en `public/index.html`, pasa Guardar y Cancelar de la cabecera a una columna derecha. Solo presentación.» Hoy los dos botones van en línea junto al título, a la izquierda (Guardar x=8, Cancelar x=72, y=66).

## 2. Intención (ajuste solo de presentación)

Guardar y Cancelar pasan de la cabecera en línea a una columna derecha de la cabecera de `public/index.html`.

## 3. Fix

- **Fichero(s)**: `public/index.html`
- **Cambio**: los dos botones se envuelven en `<div class="acciones">` y un `<style>` pone la cabecera en flex con ese bloque a la derecha, en columna. Sin cambiar texto, handlers ni bindings; no hay TypeScript, API ni datos.
- **Decisiones**:
  - «columna derecha»: bloque a la derecha de la cabecera con los botones apilados, Guardar encima de Cancelar (orden actual) — dev-lead (petición)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | captura de `public/index.html` en Chromium 1280×720, antes y después | `scratchpad/shots/antes.png`, `scratchpad/shots/despues.png` (fuera de git) · enseñadas en la validación |
| 2 | posición medida con Playwright | antes Guardar x=8 y=66 / Cancelar x=72 y=66; después Guardar x=1202 y=8 / Cancelar x=1202 y=33 ✅ |
| 3 | detector de `§Frontend` | composición no medida: `operations.md` no declara detector en §Frontend |
| 4 | `node --test` | 4/4 en verde (el patch no toca código; sin test nuevo: un test unitario no ve el layout) |

Revisión (un revisor sonnet): sin hallazgos bloqueantes. Los dos menores —`commit: pendiente` hasta el commit de cierre y el aviso LF/CRLF de git— quedan como están: el hash lo escribe `sdd-archive` y el aviso no cambia el contenido.
