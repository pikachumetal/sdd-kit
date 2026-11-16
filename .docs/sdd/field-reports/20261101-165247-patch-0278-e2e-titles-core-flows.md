---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261101-165247-patch-0278-e2e-titles-core-flows
task: 0278
mode:
date: 2026-11-01
---

# Ticket para el kit — patch 0278: un test del proyecto compara los títulos E2E con «Flujos core»

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-archive`, `sdd-feedback`; leídas con `Read`: `patch-flow.md`, `sdd-agent-writing`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica; 4 sujetos Sonnet válidos más 1 invalidado
- Coste en reloj: 0,36 h frente a 1,5 h + ~10 min de gate
- Coste en tokens: 3,84 $ de hilo, 0,91 $ de sujetos contados

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El test de títulos sale en rojo al adoptarlo en una suite sin limpiar, y frena el gate hasta que decida el dev-lead

- **Qué pasó**: en el GREEN, `t1-1` añadió el test y dejó `npm test` en rojo por un título que ya estaba fuera de la lista, como pide la guía. Es lo buscado en el criterio de hecho, pero en un proyecto real esa rama no cierra hasta decidir cada título. Por eso `sdd-init` y la migración v3.0.0 no ofrecen el test.
- **Fuente**: `.docs/sdd/specs/20261101-164101-patch-0278-e2e-titles-core-flows/green/out/t1-1.texts.txt`; §3 de su `patch.md`.
- **Dónde en el kit**: `skills/sdd-tdd/references/writing-e2e.md`, regla 1.
- **Por qué el kit no lo evitó**: limpiar la suite quedó fuera del alcance de la fila, y sin campo no se ha medido.
- **Coste**: no observado; 0 proyectos adoptados.
- **Propuesta**: esperar al primer proyecto que lo adopte. Si frena una rama ajena, que la migración pida la decisión de los títulos antes del test.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un proyecto con títulos fuera de la lista WHEN una feature toca su primer E2E THEN el dev-lead decide esos títulos sin que la feature amplíe su alcance.

### 2. Un `subject.mjs` que no espera a `s.launch` da una campaña en verde con 0 $

- **Qué pasó**: mi lanzador llamó a `s.launch(ASK)` sin `await`. `run.mjs` salió con código 0 e imprimió `red: 1 sujetos · 0.00 $ · 1 sin RESULTADO`, el estado se guardó antes de que el sujeto acabara, y el sujeto siguió corriendo. Hubo que repetir la tanda, y ese gasto no consta en lo contado.
- **Fuente**: salida de `run.mjs`; `tests/headless/lib.mjs:496`, `async function launch`.
- **Dónde en el kit**: `tests/headless/lib.mjs`, cabecera de uso; `tests/headless/campaign.mjs`. No es de una skill.
- **Por qué el kit no lo evitó**: el «sin RESULTADO» es una línea más, con salida 0.
- **Coste**: un sujeto sin contar; la cifra no se midió.
- **Propuesta**: que una campaña con un sujeto sin RESULTADO salga con código distinto de 0.
- **Verificada**: sí — reproducido con `node tests/headless/run.mjs` en Git Bash.
- **Criterio de aceptación**: GIVEN un `subject.mjs` que acaba sin esperar al sujeto WHEN corre `run.mjs` THEN sale con código distinto de 0 y nombra la etiqueta.

## Lo que hice por iniciativa propia

- Pagar el saldo dentro de la misma guía quitando lo que repetía la regla 1: funcionó (1003 → 1002 palabras), aunque los últimos recortes no se volvieron a medir con sujeto.

## Funcionó, no tocar

- El molde `hojas` ya traía un título fuera de la lista: no hubo que construir el escenario.
- Citar el test de document-manager como modelo bastó; el sujeto escribió el suyo en 20 líneas.

## Menores

- El molde `hojas` de `sdd-verify` no sirve para `npm test`: sin `jsdom` y sin config, vitest recoge `e2e/`. Lo tapé en el lanzador — `tests/batteries/sdd-verify/mold-hojas`
- `t3` nombró la lista que falta porque la constitution del molde aún cita `npm run e2e` — mismo molde
- Tres intentos de editar con `sed` y scripts anidados por los CRLF del roadmap; se resolvió con `Edit` — no localizado
