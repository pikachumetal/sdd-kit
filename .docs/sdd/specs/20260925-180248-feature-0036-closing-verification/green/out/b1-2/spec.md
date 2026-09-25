---
id: 20260925-183407-feature-0012-check-changed
feature: 0012
title: check:changed comprueba solo los .js y .mjs que cambia la rama
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

# Spec — check:changed comprueba solo los .js y .mjs que cambia la rama

> **Estado**: approved (por delegación).
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Ninguna, porque herramientas: `npm run check:changed` es un script de desarrollo, no comportamiento del producto. No hay `capabilities/` en el proyecto; no se escribe delta.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 (sin capacidad nueva, sin contrato público, sin MODIFIED/REMOVED, sin datos, sin dependencia externa; el área —`package.json` y un script nuevo— la he leído)
- Mínimo razonable: ninguna — no deja nada sin cubrir que la rúbrica cuente.

1. **«Cambia la rama» = ficheros commiteados en la rama frente a `develop`**, con `git diff --name-only --diff-filter=d develop...HEAD` (tres puntos: desde el merge-base, sin arrastrar lo que `develop` avance después). Cambios sin commitear o sin trackear no entran — la fila dice «la rama cambia respecto a `develop`», y el check se lanza al cerrar tareas ya commiteadas.
2. **Los ficheros borrados se excluyen** (`--diff-filter=d`): `node --check` sobre un fichero que ya no existe fallaría sin ser un error de sintaxis. Un renombrado cuenta con su ruta nueva.
3. **Solo extensiones `.js` y `.mjs`**, literal de la fila. `.cjs` y el resto no entran.
4. **Base fija `develop`**, la rama de integración de `sdd-kit.json` (`merge.into`); no hay parámetro para cambiarla. Si `develop` no existe, el script falla con exit distinto de 0 y el error de git; no lo enmascaro como «Nada que comprobar».
5. **Si algún fichero falla `node --check`, el script sale con exit distinto de 0** y deja el error de `node` (fichero y línea) en la salida. Comprueba todos los ficheros y no para en el primero. Con ficheros y todo bien no imprime nada y sale con 0: la fila solo pide mensaje para el caso vacío.
6. **Sin capacidad ni delta.** Los escenarios van en «Escenarios de aceptación» y son los THEN que el plan convierte en tests y el smoke recorre.
7. **Sin dependencias nuevas**: `node:child_process` y la propia `node --check`; el script es `scripts/check-changed.mjs` y `package.json` añade `"check:changed": "node scripts/check-changed.mjs"`.

### Decisiones tomadas con el dev-lead

- Aprobación de esta spec por delegación, sin review de spec — «apruebo la spec por delegación, nos vemos en la validación» (2026-09-25, respuesta a la primera pregunta; modo full, perfil delegate).

## Intent

Hoy no hay forma barata de comprobar la sintaxis de lo que una rama toca: `node --test` ejecuta la suite entera. Se quiere un `npm run check:changed` que pase `node --check` solo por los `.js` y `.mjs` que la rama cambia respecto a `develop`, para dar feedback rápido antes de la suite.

## Scope

- Entra: `scripts/check-changed.mjs` nuevo; script `check:changed` en `package.json`; tests del script.
- No entra: comprobar cambios sin commitear; base configurable; otras extensiones; lint, formato o tipos; cambiar la suite `node --test` o `src/`.

## Approach

El script pide a git la lista de ficheros cambiados desde el merge-base con `develop` (sin borrados), la filtra por `.js`/`.mjs`, y ejecuta `node --check` sobre cada uno. Sin ficheros: escribe «Nada que comprobar» y sale con 0. Con fallos: sale con 1 tras revisarlos todos.

## Delta de comportamiento

Sin capacidades (ver «Capacidades»).

### Escenarios de aceptación

Ficheros de ejemplo: `src/slots.js` (`.js`), `scripts/check-changed.mjs` (`.mjs`), `README.md`, `.docs/sdd/roadmap.md`.

- **Comprueba lo que cambia la rama**
  - GIVEN la rama commitea cambios en `src/slots.js` y `README.md` frente a `develop`
  - WHEN se ejecuta `npm run check:changed`
  - THEN `node --check` se pasa por `src/slots.js` y no por `README.md`, y sale con 0
- **Incluye `.mjs`**
  - GIVEN la rama commitea `scripts/check-changed.mjs`
  - WHEN se ejecuta `npm run check:changed`
  - THEN se comprueba ese fichero
- **Nada que comprobar**
  - GIVEN la rama solo cambia `README.md` y `.docs/sdd/roadmap.md`, o no cambia nada, frente a `develop`
  - WHEN se ejecuta `npm run check:changed`
  - THEN escribe «Nada que comprobar» y sale con 0
- **Error de sintaxis**
  - GIVEN la rama commitea `src/slots.js` con `export function reserve(room, {` sin cerrar
  - WHEN se ejecuta `npm run check:changed`
  - THEN muestra el error de `node` con el fichero y sale con distinto de 0
- **Fichero borrado**
  - GIVEN la rama borra `src/slots.js` y no cambia otro `.js`/`.mjs`
  - WHEN se ejecuta `npm run check:changed`
  - THEN escribe «Nada que comprobar» y sale con 0
- **Lo que no está commiteado no cuenta**
  - GIVEN `src/slots.js` modificado sin commitear y la rama sin más cambios frente a `develop`
  - WHEN se ejecuta `npm run check:changed`
  - THEN escribe «Nada que comprobar» y sale con 0

## Enmiendas

Ninguna.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead (por delegación) | 2026-09-25 | aprobada: «apruebo la spec por delegación, nos vemos en la validación» |
