---
id: 20260925-183407-feature-0012-check-changed
feature: 0012
title: check:changed comprueba solo los .js/.mjs cambiados en la rama
mode: full
status: approved
created: 2026-09-25
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado (por delegación)
    approved_at: 2026-09-25
---

# Spec — check:changed comprueba solo los .js/.mjs cambiados en la rama

> **Estado**: approved (por delegación).
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Ninguna, porque herramientas: es un script de desarrollo (`npm run check:changed`), no comportamiento del producto `salas`. El proyecto no tiene `capabilities/` (`Get-CapabilityIndex.ps1`: «Sin capacidades»), así que no hay delta que fusionar.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales contadas: 0 (sin capacidad nueva, sin contrato público, sin MODIFIED/REMOVED, sin datos, sin dependencia externa; área leída entera: `package.json`, `src/slots.js`, `tests/`).
- Mínimo razonable: ninguna — no deja nada sin cubrir que un revisor pudiera ver en una spec de un solo script.

1. **Qué cuenta como «cambiado por la rama»**: los ficheros tracked que difieren entre el merge-base con `develop` y el working tree (commiteados, staged y sin stagear), sin los borrados. Un fichero sin `git add` que aún no existe en git (untracked) **no entra**. Por qué: quien corre `check:changed` antes de commitear espera que se compruebe lo que acaba de editar; el merge-base evita que cambios nuevos de `develop` cuenten como míos.
2. **Base fija `develop`**: es la rama de integración de `sdd-kit.json` (`merge.into`) y la del enunciado. Sin configuración ni argumento. Si `develop` no existe, el script falla con exit 1 y un mensaje que lo dice, en vez de decir «Nada que comprobar»: un falso «todo bien» es peor que un error.
3. **Extensiones**: solo `.js` y `.mjs`, como dice la fila. `.cjs` no entra.
4. **Todos los ficheros, sin parar en el primero que falla**: se comprueban todos y el exit es 1 si falla alguno, para ver todos los errores de una vez. El mensaje de error es el que imprime `node --check`, sin envolver.
5. **Salida cuando hay ficheros y todos pasan**: una línea, `Comprobados <N> ficheros`, y exit 0. La fila no la fija; elijo una línea para que un éxito no sea indistinguible de un script que no hizo nada.
6. **Sin capacidad y sin delta**: es herramienta; una capacidad para un script de desarrollo sería inventarla. No se crea ninguna.
7. **Sin review de spec ni partición**: 0 señales; el plan prevé 1 task. Por eso tampoco te ofrecí la variante de bajar la sesión de modelo (solo se ofrece con más de una task).
8. **Repaso de coherencia** (hecho por mí, sin review): contrastados el literal «Nada que comprobar», la base `develop`, `.js`/`.mjs` y `Comprobados <N> ficheros` entre decisiones y escenarios; coinciden. Sin placeholders ni contradicciones.
9. **El contexto SDD del proyecto es mínimo**: solo existen `constitution.md`, `roadmap.md`, `changelog.md` y `sdd-kit.json`; no hay `mission.md`, `tech-stack.md` ni `architecture.md`. Los leí todos; no hay más que contrastar.

### Decisiones tomadas con el dev-lead

- Aprobar la spec por delegación (modo full, perfil `delegate`, de `sdd-kit.json` del proyecto; sin `sdd-kit.local.json`) — «apruebo la spec por delegación, nos vemos en la validación» (2026-09-25).
- Review de spec: la decido yo sin preguntar, por la opción anterior — ninguna (ver arriba).

## Intent

Hoy no existe ningún `check:changed`. Se quiere una comprobación de sintaxis rápida para quien trabaja en la rama: `node --check` solo sobre los ficheros JavaScript que la rama ha tocado respecto a `develop`, en vez de sobre todo el repo, con un mensaje claro cuando no hay nada que mirar.

## Scope

- Entra: el comando `npm run check:changed`; el script `scripts/check-changed.mjs`; la entrada en `package.json`.
- No entra: ficheros `.cjs`, `.ts` u otros; ficheros untracked; lint o formato; base configurable; integrarlo en `npm test` o en un hook; arreglar ni tocar `src/`.

## Approach

Un script Node que pregunta a git qué ficheros difieren de `develop` (desde el merge-base), se queda con los `.js`/`.mjs` que siguen existiendo, y ejecuta `node --check` sobre cada uno. `package.json` lo expone como `check:changed`. Sin dependencias nuevas.

## Delta de comportamiento

Sin delta: herramienta, no toca capacidades. Los escenarios que verifican el script son estos (datos concretos; la rama de cada uno parte de `develop`):

**Escenario 1 — Ficheros cambiados que pasan**
- GIVEN la rama cambia `src/slots.js` y añade `scripts/check-changed.mjs`, ambos con sintaxis válida
- WHEN se ejecuta `npm run check:changed`
- THEN escribe `Comprobados 2 ficheros` y sale con 0

**Escenario 2 — Solo se comprueban .js y .mjs**
- GIVEN la rama cambia `src/slots.js` (válido) y `README.md` y `package.json`
- WHEN se ejecuta `npm run check:changed`
- THEN escribe `Comprobados 1 ficheros` y sale con 0
- AND `README.md` y `package.json` no se pasan a `node --check`

**Escenario 3 — Sintaxis inválida**
- GIVEN la rama cambia `src/slots.js` (válido) y `src/roto.mjs` con el contenido `export function {`
- WHEN se ejecuta `npm run check:changed`
- THEN el error de `node --check` sobre `src/roto.mjs` aparece en la salida de error y sale con 1
- AND `src/slots.js` se comprueba igualmente

**Escenario 4 — La rama no cambia ningún .js/.mjs**
- GIVEN la rama solo cambia `README.md`
- WHEN se ejecuta `npm run check:changed`
- THEN escribe `Nada que comprobar` y sale con 0

**Escenario 5 — La rama no cambia nada**
- GIVEN la rama está en el mismo commit que `develop` y sin cambios sin commitear
- WHEN se ejecuta `npm run check:changed`
- THEN escribe `Nada que comprobar` y sale con 0

**Escenario 6 — Cambios sin commitear cuentan; lo de develop, no**
- GIVEN `src/slots.js` editado sin commitear en la rama, y `develop` con un commit nuevo posterior a la bifurcación que cambia `src/otro.js`
- WHEN se ejecuta `npm run check:changed`
- THEN escribe `Comprobados 1 ficheros` (solo `src/slots.js`) y sale con 0

**Escenario 7 — Fichero borrado en la rama**
- GIVEN la rama borra `src/viejo.js` y no cambia nada más
- WHEN se ejecuta `npm run check:changed`
- THEN escribe `Nada que comprobar` y sale con 0, sin intentar comprobar el fichero borrado

**Escenario 8 — develop no existe**
- GIVEN un repo sin rama `develop`
- WHEN se ejecuta `npm run check:changed`
- THEN el mensaje de error dice que no encuentra `develop` y sale con 1

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «apruebo la spec por delegación, nos vemos en la validación» |
