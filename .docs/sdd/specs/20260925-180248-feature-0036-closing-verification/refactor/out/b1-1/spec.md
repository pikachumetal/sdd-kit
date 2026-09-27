---
id: 20260925-183907-feature-0012-check-changed
feature: 0012
title: check:changed comprueba solo los .js/.mjs que la rama cambia
mode: full
profile: delegate
status: approved
created: 2026-09-25
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: dev-lead (por delegación)
    approved_at: 2026-09-25
---

# Spec — check:changed comprueba solo los .js/.mjs que la rama cambia

## Capacidades

- Ninguna, porque herramientas (script de desarrollo; no toca el comportamiento de `salas`). No hay `capabilities/` en el proyecto ni delta que escribir.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 (sin capacidad nueva, contrato público, MODIFIED/REMOVED, datos ni dependencia externa; he leído `package.json`, `src/slots.js`, `tests/` y las specs del proyecto)
- Mínimo razonable: ninguna review — no deja nada sin cubrir que la rúbrica cuente.

1. **Sin capacidad ni delta**: es un script de herramientas. Los escenarios van en la sección «Escenarios» de esta spec, no en un delta.
2. **Base de comparación**: `develop` local (la rama de integración que fija `sdd-kit.json`, `merge.into`), no `origin/develop`. Si `develop` no existe, el script falla con exit 1 y un mensaje que lo dice, en vez de decir «Nada que comprobar».
3. **Qué cuenta como «cambiado»**: diferencia entre el ancestro común con `develop` y el árbol de trabajo. Entran los commits de la rama y los cambios sin commitear de ficheros ya versionados; los ficheros sin trackear no entran (la fila dice «respecto a `develop`», y un fichero nuevo sin `git add` es invisible para git). Un pre-commit útil ve el trabajo en curso.
4. **Borrados fuera, renombrados dentro**: un `.js` borrado no se comprueba (no existe); uno renombrado se comprueba con su nombre nuevo.
5. **Extensiones exactas**: `.js` y `.mjs`, como dice la fila. Ni `.cjs`, ni `.ts`, ni `.json`.
6. **Un fallo no corta**: si `node --check` falla en un fichero, se siguen comprobando los demás, se imprime el error de cada uno y el script sale con 1. Así un solo `npm run check:changed` da todos los errores.
7. **Salida de éxito**: una línea `ok <ruta>` por fichero comprobado. Nada más.
8. **Mensaje sin cambios**: exactamente `Nada que comprobar` (una línea, stdout, exit 0), sin punto final: es el literal de la fila.
9. **Tests**: `tests/check-changed.test.js`, con `node --test` como manda la constitution. Es un fichero que la fila no lista en «Ficheros que toca»; sin él la lógica no queda comprobada.
10. **Sin dependencias**: Node ESM (`"type": "module"`), `node:child_process` y `git`. No se añade ninguna librería.
11. **Aprobación por delegación**: la spec la apruebo yo (ver «Decisiones tomadas con el dev-lead»); el dev-lead no está y valida al final.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec delegada; se paró antes del plan por instrucción del encargo — «apruebo la spec por delegación, nos vemos en la validación» (2026-09-25). La review de spec la decidí yo: ninguna (0 señales).

## Intent

Hoy `package.json` solo tiene `test`; no hay forma barata de comprobar la sintaxis de lo que se ha tocado. Se quiere `npm run check:changed`, que pase `node --check` por los `.js` y `.mjs` que la rama cambia respecto a `develop`, para dar un error de sintaxis rápido sin ejecutar la suite. Si la rama no cambia ninguno, no es un error: lo dice y sale limpio.

## Scope

- Entra: `scripts/check-changed.mjs` (nuevo), el script `check:changed` en `package.json`, y `tests/check-changed.test.js` (nuevo, decisión 9).
- No entra: `.cjs`/`.ts`/`.json`; lint, formato o ejecución de tests; comparar con `origin/develop` o con una base configurable; ficheros sin trackear; integración con hooks de git o CI; tocar `src/`.

## Approach

`check:changed` en `package.json` lanza `node scripts/check-changed.mjs`. El script pide a git los ficheros cambiados desde el ancestro común con `develop` (sin borrados), se queda con los `.js`/`.mjs`, y por cada uno ejecuta `node --check`. Sin ficheros, imprime `Nada que comprobar`. El cómo (comandos git exactos, estructura para testear) es contenido del plan.

## Escenarios

Los datos son de ejemplo (ficheros del propio proyecto).

**El script comprueba los `.js` y `.mjs` cambiados**
- GIVEN rama con commits sobre `develop` que modifican `src/slots.js` (sintaxis válida) y añaden `scripts/x.mjs` (válido)
- WHEN `npm run check:changed`
- THEN stdout `ok src/slots.js` y `ok scripts/x.mjs`, exit 0

**Solo cuentan `.js` y `.mjs`**
- GIVEN la rama cambia `README.md` y `package.json`, y ningún `.js`/`.mjs`
- WHEN `npm run check:changed`
- THEN stdout `Nada que comprobar`, exit 0

**Rama sin cambios de código** — Se valida en: `worktree con la base al día` (esta rama siempre cambia `scripts/check-changed.mjs`, así que desde ella no se observa)
- GIVEN rama creada desde `develop`, con commits que no tocan ningún `.js`/`.mjs`
- WHEN `npm run check:changed`
- THEN stdout exactamente `Nada que comprobar`, exit 0

**Error de sintaxis**
- GIVEN la rama cambia `src/slots.js` (válido) y `src/roto.js` con `const = ;`
- WHEN `npm run check:changed`
- THEN stdout `ok src/slots.js`, stderr con el error de sintaxis de `src/roto.js`, exit 1

**Fichero borrado**
- GIVEN la rama borra `src/viejo.js` y no cambia ningún otro `.js`/`.mjs`
- WHEN `npm run check:changed`
- THEN stdout `Nada que comprobar`, exit 0

**Cambio sin commitear**
- GIVEN un `.js` versionado, modificado en el árbol de trabajo con un error de sintaxis y sin commit
- WHEN `npm run check:changed`
- THEN stderr con el error de ese fichero, exit 1

**Sin `develop`**
- GIVEN un repositorio sin rama local `develop`
- WHEN `npm run check:changed`
- THEN stderr con un mensaje que nombra `develop`, exit 1, y no imprime `Nada que comprobar`

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead (por delegación) | 2026-09-25 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
