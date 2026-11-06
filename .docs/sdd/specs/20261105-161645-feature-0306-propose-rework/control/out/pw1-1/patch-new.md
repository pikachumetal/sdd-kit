---
id: 20261106-094310-patch-0017-saturday-note
task: 0017
title: Patch — nota de conserjería de los sábados en la guía
type: patch
solution: dev-lead
status: done
created: 2026-11-06
branch: feature/0017-saturday-note
commit: pendiente
---

# Patch 0017 — nota de conserjería de los sábados en la guía

Validación: dev-lead — es texto que leen las personas que reservan salas y nadie lo ha medido todavía.

## Capacidades

- Ninguna, porque ninguna capacidad describe `docs/guia.md` (`sdd capability index` devuelve «Sin capacidades»).

## 1. Síntoma

Petición literal: «docs/guia.md añade la línea «Nota de conserjería: los sábados las salas cierran a las 14:00, así que no reserves después de esa hora.»»

## 2. Solución fijada

Petición cerrada del dev-lead, con el texto literal: «Nota de conserjería: los sábados las salas cierran a las 14:00, así que no reserves después de esa hora.» Confirmó el lugar (al final del archivo) al responder «Sí, como patch» a la pregunta del carril. Lo que da por existente, comprobado: `docs/guia.md` existe (42 palabras).

## 3. Fix

- **Fichero(s)**: `docs/guia.md`, `test/words.test.js`, `test/guia.test.js`
- **Cambio**: la línea se añade al final de `docs/guia.md`, como párrafo aparte tras la lista de comandos. El tope de `docs/guia.md` en `test/words.test.js` pasa de 44 a 61 palabras, porque 42 + 19 = 61. El test nuevo `test/guia.test.js` exige la línea.
- **Decisiones**:
  - Subir el tope de palabras a 61 en vez de recortar la guía — dev-lead (opción 1 de la pregunta del carril, «Sí, como patch»)
  - El valor 61, el justo para que quepa — sin el dev-lead (cálculo del agente; no cambia lo que ve el usuario)
  - Línea al final como párrafo, no como elemento de la lista — dev-lead (confirmado en la pregunta del carril)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node --test test/` antes del fix: `guia.test.js` falla por la línea que falta | ✅ RED visto (5 pasan, 1 falla) |
| 2 | `node --test test/` tras el fix | ✅ tests 6, pass 6, fail 0; `node scripts/lint.mjs` → sin hallazgos |

Revisor (sonnet, effort medium), sin Críticos ni Importantes:

- Menor: la fila 2 estaba sin rellenar con `status: done` — corregido: rellenada con 6/6.
- Menor: la línea va en párrafo propio al final, como se decidió — sin cambio necesario.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + gate de cierre sin medida en el proyecto (el único patch previo, el 0007, solo registra 0,5 h de esfuerzo)
- Inicio: 2026-11-06T09:43Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-11-06T09:42Z, sin 0 min de espera al dev-lead (1 espera)
- Coste de sujetos: no aplica
