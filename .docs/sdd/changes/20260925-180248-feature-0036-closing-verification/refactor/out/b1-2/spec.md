---
id: 20260925-183909-feature-0012-check-changed
feature: 0012
title: check:changed comprueba solo los .js/.mjs que la rama cambia
mode: full
profile: delegate
status: approved
created: 2026-09-25
author: Claude (sdd-start-feature)
approvers:
  - role: dev-lead
    name: dev-lead (por delegación)
    approved_at: 2026-09-25
---

# Spec — check:changed comprueba solo los .js/.mjs que la rama cambia

## Capacidades

- Ninguna, porque herramientas (script de desarrollo; el proyecto no tiene `capabilities/`). Los escenarios van en «Approach».

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales contadas: 0 (sin capacidad nueva, sin contrato público, sin MODIFIED/REMOVED, sin datos, sin dependencia externa, área leída: `package.json` y la constitution).
- Mínimo razonable: ninguna review — deja sin mirar solo si `--diff-filter` cubre casos raros de git (rename con cambio, submódulos); lo cubren los tests con repos temporales.

1. **Base = `git merge-base HEAD develop`**, comparada contra el árbol de trabajo: entran commits de la rama, cambios en staging y cambios sin commitear de ficheros ya rastreados. — «lo que la rama cambia respecto a `develop`» del roadmap; comprobar antes de commitear es el uso normal. Los ficheros sin rastrear NO entran (límite conocido: un `.js` nuevo hay que añadirlo con `git add` para que lo vea).
2. **Los ficheros borrados no se comprueban**; un renombrado cuenta con su nombre nuevo. — `node --check` sobre un fichero que ya no existe falla siempre.
3. **Solo extensiones `.js` y `.mjs`**, tal cual las nombra el roadmap; `.cjs` y demás no entran.
4. **Ramas de comparación: solo `develop` local**, sin `origin/develop`. — el repo no tiene remoto y la constitution/kit fusiona en `develop`.
5. **Si git no puede calcular la base** (no hay `develop`, no es un repo git): mensaje en stderr y salida 1, nunca «Nada que comprobar». — un falso «nada que comprobar» dejaría pasar código sin comprobar.
6. **Un `node --check` por fichero; se comprueban todos aunque alguno falle**, y la salida es 1 si falla alguno. Los errores salen tal cual los da node. — así el dev ve todos los fallos de una vez.
7. **En éxito con ficheros, el script no escribe nada propio** (sale 0). Solo escribe «Nada que comprobar» (stdout) cuando no hay ficheros. — el roadmap solo fija el mensaje del caso vacío.
8. **Sin capacidad nueva**: los escenarios viven en «Approach» y no en un delta. — es herramienta de desarrollo, no comportamiento del producto.
9. **Repaso de coherencia**: «Nada que comprobar», `scripts/check-changed.mjs` y `develop` aparecen igual en Intent, Scope, Approach y escenarios; sin contradicciones halladas.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación — «apruebo la spec por delegación, nos vemos en la validación» (elegida en la primera pregunta, 2026-09-25). Review de spec decidida por mí: ninguna (0 señales).

## Intent

Hoy `package.json` solo tiene `test`. No hay forma barata de comprobar la sintaxis de lo que una rama toca antes de commitear. Se quiere `npm run check:changed`, que pase `node --check` únicamente por los `.js` y `.mjs` que la rama cambia respecto a `develop`, y que diga «Nada que comprobar» (salida 0) cuando no hay ninguno.

## Scope

- Entra: `scripts/check-changed.mjs` (nuevo) y el script `check:changed` en `package.json`; tests con repos git temporales.
- No entra: ficheros sin rastrear; `.cjs`/`.ts`; comparar con `origin/develop`; enganchar el script a un hook o a `npm test`; formato/lint.

## Approach

El script calcula la lista con git (merge-base con `develop`, ficheros modificados o añadidos, filtrados a `.js`/`.mjs`), ejecuta `node --check` por cada uno y propaga el fallo en la salida. El cómo (API de git usada, manejo de rutas con espacios) va en `plan.md`.

### Escenarios

**Comprueba solo lo que la rama cambia**
- GIVEN rama con `src/a.js` cambiado (sintaxis válida) y `src/b.js` igual que en `develop`, con `b.js` roto a propósito en ambas
- WHEN `npm run check:changed`
- THEN comprueba `src/a.js`, no toca `src/b.js`, sale 0

**Fichero cambiado con error de sintaxis**
- GIVEN rama que cambia `src/c.mjs` con el contenido `export const = ;`
- WHEN `npm run check:changed`
- THEN node imprime su `SyntaxError` sobre `src/c.mjs` y el script sale 1

**Varios fallos, se ven todos**
- GIVEN rama que cambia `src/c.mjs` y `src/d.js`, ambos con error de sintaxis
- WHEN `npm run check:changed`
- THEN salen los errores de `src/c.mjs` y de `src/d.js`, y sale 1

**Solo cambian ficheros de otro tipo**
- GIVEN rama que solo cambia `README.md` y `package.json`
- WHEN `npm run check:changed`
- THEN escribe «Nada que comprobar» y sale 0
- Se valida en: worktree con la base al día *(esta rama añade `scripts/check-changed.mjs`, así que en ella el resultado real ya no es «Nada que comprobar»; se ve en un worktree nuevo desde `develop` con solo un cambio en `README.md`)*

**Rama sin cambios**
- GIVEN rama idéntica a `develop`
- WHEN `npm run check:changed`
- THEN escribe «Nada que comprobar» y sale 0
- Se valida en: worktree con la base al día

**Ficheros borrados**
- GIVEN rama que borra `src/old.js`
- WHEN `npm run check:changed`
- THEN no intenta comprobar `src/old.js` y, sin más cambios `.js`/`.mjs`, escribe «Nada que comprobar» y sale 0

**Cambios sin commitear**
- GIVEN `src/e.js` con un error de sintaxis, modificado y sin commitear (rastreado)
- WHEN `npm run check:changed`
- THEN falla sobre `src/e.js` y sale 1

**No existe `develop`**
- GIVEN repo sin rama `develop`
- WHEN `npm run check:changed`
- THEN escribe un error en stderr, no escribe «Nada que comprobar» y sale 1

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | por delegación | 2026-09-25 | aprobada: «apruebo la spec por delegación, nos vemos en la validación» |
