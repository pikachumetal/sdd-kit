---
id: 20260925-180533-feature-0012-check-changed
feature: 0012
title: check:changed comprueba solo los .js y .mjs que cambia la rama
mode: full
status: approved
created: 2026-09-25
author: Claude Sonnet 5 (sesión delegada)
approvers:
  - role: dev-lead
    name: dev-lead (por delegación)
    approved_at: 2026-09-25
---

# Spec — check:changed comprueba solo los .js y .mjs que cambia la rama

## Capacidades

- Ninguna, porque herramientas (script de desarrollo; el proyecto aún no tiene `capabilities/`).

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 (sin capacidad nueva, contrato público, MODIFIED, datos ni dependencia externa; el script y `package.json` los he leído)
- Mínimo razonable: ninguna — deja sin segunda lectura la elección de qué cuenta como «cambiado» (decisión 1)

1. **«Cambiado respecto a `develop`» = desde el ancestro común (`git merge-base develop HEAD`)**, no la diferencia directa con la punta de `develop` — así los cambios que `develop` gana después de ramificar no aparecen como cambios de la rama.
2. **Cuentan los commits de la rama, los cambios sin commitear de ficheros ya seguidos y los ficheros nuevos sin seguir (no ignorados)** — es un check previo al commit; sin los nuevos, un `.js` recién creado quedaría sin comprobar en silencio.
3. **Los ficheros borrados en la rama no se comprueban** (no existen); los renombrados cuentan con su ruta nueva.
4. **Solo extensiones `.js` y `.mjs`, en cualquier carpeta** (incluida `tests/`); `.cjs` y demás no entran — es lo que dice la fila del roadmap.
5. **Si algún fichero falla `node --check`, se comprueban igualmente todos y el script sale con código 1**, mostrando el error de `node` de cada fallo; con todos correctos sale con 0 y no imprime nada más — para ver todos los errores de una pasada y sin ruido cuando todo va bien.
6. **Si no existe la rama local `develop`, el script sale con código 1 y el mensaje «No existe la rama develop»** — la fila pide «Nada que comprobar» solo cuando la rama no cambia ningún `.js`/`.mjs`; sin base no se puede saber, y salir con 0 escondería un check que no se hizo.
7. **Rutas con espacios o caracteres raros se pasan como argumentos, sin shell**, y `git` se llama con `-z` para no depender del entrecomillado.
8. **La salida «Nada que comprobar» va por stdout, con salto de línea, y es literal** — igual que la pide la fila.
9. **Sin review de spec (0 señales) y sin capacidad nueva**: no hay `capabilities/` ni `mission.md`/`tech-stack.md` en el proyecto; no los he creado (fuera de alcance).

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación — «apruebo la spec por delegación, nos vemos en la validación» (primera pregunta, 2026-09-25)
- Modo full y perfil delegate — indicados en la invocación; el perfil coincide con `control.profile` de `sdd-kit.json`

## Intent

Hoy `package.json` solo tiene `test`. No hay forma barata de comprobar la sintaxis de lo que uno ha tocado antes de commitear. Se quiere `npm run check:changed`, que pase `node --check` solo por los `.js` y `.mjs` que la rama cambia respecto a `develop`, sin recorrer el proyecto entero.

## Scope

- Entra: `scripts/check-changed.mjs` (nuevo), la entrada `check:changed` en `package.json`, y sus tests.
- No entra: comprobar `.cjs`, `.ts` ni otros formatos; lint o formato; correr `node --test`; enganchar el check a un hook de git o a CI; cambiar `develop` como base configurable.

## Approach

Un script Node sin dependencias calcula la lista de ficheros cambiados con `git` (decisiones 1-3), se queda con los `.js` y `.mjs` (4), y lanza `node --check` sobre cada uno (5, 7). Sin ficheros, escribe «Nada que comprobar» y sale con 0. `package.json` lo expone como `check:changed`.

## Delta de comportamiento

No aplica: herramientas, sin capacidad tocada. Los escenarios de aceptación, que codifican los tests:

**Escenario — la rama cambia ficheros comprobables**
- GIVEN rama creada desde `develop` que añade `src/a.js` y `scripts/b.mjs` correctos y `README.md`
- WHEN `npm run check:changed`
- THEN sale con 0, ejecuta `node --check` sobre `src/a.js` y `scripts/b.mjs` y sobre ningún otro, y no imprime «Nada que comprobar»

**Escenario — la rama no cambia ningún .js/.mjs**
- GIVEN rama que solo cambia `README.md` y añade `notas.cjs`
- WHEN `npm run check:changed`
- THEN imprime `Nada que comprobar` y sale con 0

**Escenario — rama sin cambios**
- GIVEN rama idéntica a `develop`, árbol limpio
- WHEN `npm run check:changed`
- THEN imprime `Nada que comprobar` y sale con 0

**Escenario — error de sintaxis**
- GIVEN la rama añade `src/ok.js` correcto y `src/mal.js` con `const = ;`
- WHEN `npm run check:changed`
- THEN sale con 1, el error de sintaxis nombra `src/mal.js`, y `src/ok.js` también se ha comprobado

**Escenario — fichero nuevo sin seguir y cambio sin commitear**
- GIVEN `src/nuevo.js` con error, sin `git add`, y `src/slots.js` modificado con error sin commitear
- WHEN `npm run check:changed`
- THEN sale con 1 y el resultado nombra ambos ficheros

**Escenario — fichero borrado**
- GIVEN la rama borra `src/slots.js`
- WHEN `npm run check:changed`
- THEN no intenta comprobarlo y sale con 0 (`Nada que comprobar` si no hay más cambios)

**Escenario — develop avanza después de ramificar**
- GIVEN `develop` gana un commit con `src/otro.js` con error de sintaxis después de crear la rama, y la rama no lo tiene
- WHEN `npm run check:changed`
- THEN no lo comprueba: imprime `Nada que comprobar` y sale con 0

**Escenario — ruta con espacios**
- GIVEN la rama añade `src/mi sala.js` con error de sintaxis
- WHEN `npm run check:changed`
- THEN sale con 1 y el error nombra `src/mi sala.js`

**Escenario — sin rama develop**
- GIVEN un repositorio sin rama local `develop`
- WHEN `npm run check:changed`
- THEN sale con 1 y dice `No existe la rama develop`

## Enmiendas

Ninguna.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead (por delegación) | 2026-09-25 | aprobada: «apruebo la spec por delegación, nos vemos en la validación» |
