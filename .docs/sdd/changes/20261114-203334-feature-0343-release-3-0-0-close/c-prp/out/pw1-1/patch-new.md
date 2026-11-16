---
id: 20261115-202318-patch-0017-saturday-note
task: 0017
title: Patch — nota de conserjería de los sábados en la guía
type: patch
solution: dev-lead
status: done
created: 2026-11-15
branch: feature/0017-saturday-note
commit:
---

# Patch 0017 — nota de conserjería de los sábados en la guía

Validación: dev-lead — es un texto que leerá una persona en la guía; no hay frase del dev-lead que delegue la validación en el agente.

## Capacidades

- Ninguna, porque ninguna capacidad describe `docs/guia.md` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición literal: «docs/guia.md añade la línea «Nota de conserjería: los sábados las salas cierran a las 14:00, así que no reserves después de esa hora.»».

Medido: la guía hoy tiene 42 palabras y `test/words.test.js` fija su tope en 44; la línea suma 19, así que la guía queda en 61 y el gate se pondría en rojo.

## 2. Solución fijada (petición cerrada)

- Frase literal del dev-lead: «añade la línea «Nota de conserjería: los sábados las salas cierran a las 14:00, así que no reserves después de esa hora.»» — autor: dev-lead.
- Existe lo que da por existente: `docs/guia.md`, con la lista de comandos.
- Choque con el tope de palabras: el dev-lead eligió subir el tope (opción 1 de la pregunta del carril: «Sí, como patch»).

## 3. Fix

- **Fichero(s)**: `docs/guia.md`, `test/words.test.js`, `test/guia.test.js` (nuevo).
- **Cambio**: la línea literal va al final de la guía, tras la lista y separada por una línea en blanco; el tope de `docs/guia.md` en `words.test.js` sube de 44 a 61, lo justo para que quepa.
- **Decisiones**:
  - La línea va al final del fichero, en párrafo propio tras la lista — sin el dev-lead (posición no dicha; la petición dice «añade la línea», sin lugar; el final es lo que no reordena nada existente).
  - Tope nuevo de 61 palabras, el tamaño exacto de la guía con la nota — dev-lead (opción 1 de la pregunta del carril).

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → suite unitaria: corrió 6/6 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/guia.test.js` antes del cambio → `falta la nota de conserjería` | ✅ falló por la razón esperada |
| 2 | `node --test test/guia.test.js` tras el cambio | ✅ 1/1 |
| 3 | `node --test` entero (incluye el tope de palabras: 61 ≤ 61) | ✅ 6/6 |

## 5. Tiempo (ligero)

- Estimación: 0,25 h
- Inicio: 2026-11-15T20:23Z
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-11-15T20:22Z, sin 0 min de espera al dev-lead (1 espera)
- Coste de sujetos: no aplica

## Revisión del patch

Un revisor (`sdd-kit:effort-medium`, sonnet): sin hallazgos de severidad alta ni media. Un hallazgo bajo: `commit:` del frontmatter vacío — aceptado, se rellena en el commit de cierre de `sdd-archive`. El lint lo corrí yo: «lint: sin hallazgos».
