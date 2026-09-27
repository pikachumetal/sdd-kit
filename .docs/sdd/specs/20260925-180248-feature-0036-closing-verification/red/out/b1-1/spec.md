---
id: 20260925-180538-feature-0012-check-changed
feature: 0012
title: check:changed comprueba solo los .js/.mjs que cambia la rama
mode: full
profile: delegate
status: approved
created: 2026-09-25
author: Claude Sonnet 5
approvers:
  - role: dev-lead
    name: dev-lead (por delegación)
    approved_at: 2026-09-25
---

# Spec — check:changed comprueba solo los .js/.mjs que cambia la rama

> **Estado**: approved (por delegación).
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`. La sesión para antes del plan.

## Capacidades

- Ninguna, porque herramientas: `npm run check:changed` es un script de desarrollo, no comportamiento de la CLI `salas`. No hay delta.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 (no hay capacidad nueva, contrato público, MODIFIED/REMOVED, datos ni dependencia externa; el script y el `package.json` que toca son mínimos y los he leído).
- Mínimo razonable: ninguna — deja sin mirar solo la interpretación de «cambia la rama» (decisión 1), que es la que el dev-lead valida abajo.

1. «Cambios de la rama» = lo que difiere del punto de bifurcación con `develop` (`git merge-base develop HEAD`), commiteado o no — la fila dice «respecto a `develop`» y no aclara si cuenta lo sin commitear. Incluir lo tracked sin commitear hace que el comando sirva mientras se trabaja, no solo tras commitear. Los ficheros sin trackear (nuevos, sin `git add`) no entran; con `git add` sí.
2. La base es `develop` fijo, el valor de `merge.into` en `sdd-kit.json` — no se lee de la config para no acoplar el script al kit. Si `develop` no existe, sale con 1 y un mensaje que lo dice, en vez de tratarlo como «nada que comprobar»: un falso verde es peor que un fallo.
3. Los ficheros borrados se excluyen (`node --check` no puede leerlos); los renombrados entran con el nombre nuevo.
4. Solo `.js` y `.mjs`, como pide la fila. `.cjs` y `.ts` no entran.
5. Si un fichero falla, se comprueban igualmente todos los demás y el script sale con 1 al final: se ven todos los fallos de una vez. Cada fallo enseña la salida de `node --check`.
6. «Nada que comprobar» va por stdout, sin punto final y con esa capitalización exactas, y sale con 0.
7. La tarea es una sola task de plan (script + entrada en `package.json` + su test en `tests/`), así que no propongo partirla ni parar antes de la Task 1 para cambiar de modelo.
8. Ruta del script y nombre del comando, los de la fila: `scripts/check-changed.mjs` y `"check:changed": "node scripts/check-changed.mjs"`. Sin dependencias nuevas: solo `node:child_process` y `git`.
9. `sdd-kit.json` dice `profile: delegate` y no hay `sdd-kit.local.json`: la feature va en `delegate`.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación; el dev-lead no está hasta la validación — «apruebo la spec por delegación, nos vemos en la validación» (2026-09-25)
- Review de spec: ninguna, decidida por el agente (0 señales), sin preguntar, como permite esa opción.

## Intent

Hoy no hay forma barata de comprobar la sintaxis de lo que uno ha tocado: `node --check` se lanza a mano fichero a fichero. Se quiere un `npm run check:changed` que compruebe solo los `.js` y `.mjs` que la rama cambia respecto a `develop`, y que en una rama sin cambios de ese tipo diga que no hay nada que comprobar en vez de fallar.

## Scope

- Entra: `scripts/check-changed.mjs` (nuevo), la entrada `check:changed` en `package.json`, y un test en `tests/` que ejecuta el script contra un repo git temporal.
- No entra: leer la rama base de la config, otras extensiones, lint o formato, integrarlo en `npm test` o en hooks, tocar `src/`.

## Approach

El script pide a git la lista de ficheros cambiados desde el punto de bifurcación con `develop`, sin los borrados, se queda con los `.js` y `.mjs` y lanza `node --check` sobre cada uno. Sin ficheros de esos tipos, escribe «Nada que comprobar» y sale con 0. Si alguno falla o `develop` no existe, sale con 1.

## Delta de comportamiento

Sin delta: no cambia el comportamiento de ninguna capacidad. El comportamiento de la herramienta, con datos concretos, es este (lo cubre el test):

- GIVEN la rama cambia `src/slots.js` (sintaxis correcta) y `README.md` · WHEN `npm run check:changed` · THEN comprueba `src/slots.js`, no toca `README.md`, sale con 0.
- GIVEN la rama cambia `scripts/a.mjs` con `const = ;` · WHEN `npm run check:changed` · THEN muestra el error de `node --check` de `scripts/a.mjs` y sale con 1.
- GIVEN la rama cambia `a.mjs` (con error) y `b.js` (correcto) · WHEN `npm run check:changed` · THEN comprueba los dos, informa del fallo de `a.mjs` y sale con 1.
- GIVEN la rama solo cambia `README.md` · WHEN `npm run check:changed` · THEN escribe «Nada que comprobar» y sale con 0.
- GIVEN la rama no cambia nada respecto a `develop` · WHEN `npm run check:changed` · THEN escribe «Nada que comprobar» y sale con 0.
- GIVEN la rama borra `src/old.js` y no cambia nada más · WHEN `npm run check:changed` · THEN escribe «Nada que comprobar» y sale con 0.
- GIVEN un cambio sin commitear en `src/slots.js` · WHEN `npm run check:changed` · THEN lo comprueba.
- GIVEN no existe la rama `develop` · WHEN `npm run check:changed` · THEN escribe por stderr que falta `develop` y sale con 1.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead (por delegación) | 2026-09-25 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
