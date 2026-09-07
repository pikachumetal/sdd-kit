# Evidencia GREEN — spike en `sdd-consult` (2026-09-07)

Mismo escenario que [`sdd-consult-spike-red.md`](sdd-consult-spike-red.md), con `sdd-consult` **modificado** (commit `f8e07f7`: modo "sondear / probar viabilidad" en el paso 2 y fila de racionalización *"Un spike, aunque sea rápido, ya es implementar…"*). Prompt idéntico palabra por palabra, copia fresca del molde (`bookline-g2`), un subagente Sonnet, skill pegada por prompt desde el working tree.

## Qué hizo — verificado en disco

| Comprobación | RED (E2) | GREEN (G2) |
| --- | --- | --- |
| Sonda ejecutada | ❌ se negó | ✅ dos scripts desechables **fuera del repo** (scratchpad), ejecutados con `node`, salida CSV real y prueba del escapado RFC 4180 |
| Etiquetado como desechable y borrado | — | ✅ «(ya borrado, no queda nada en el repo)»; `rm` de ambos scripts; verificado: ningún `spike-*` en el scratchpad |
| `git status --short` | limpio | limpio |
| `git branch` | `develop`, `main` | `develop`, `main` |
| `.docs/sdd/specs/` | solo `.gitkeep` | solo `.gitkeep` |
| Respuesta a la pregunta | ❌ sustituida por un handoff | ✅ «Sí, se puede», con la salida generada, lo comprobado en los docs y las decisiones que quedarían para una task |
| Handoff | a `sdd-start-task` en lugar de responder | a `sdd-start-task` **después** de responder, condicionado a que el usuario quiera construirlo |
| Salida durable | — | Propuesta y no ejecutada: «Si quieres que esto se construya de verdad (…) dímelo y lo transicionamos» |

## Veredicto contra el fallo del RED

- **F1 (la skill veta la sonda)** → **corregido**. El agente eligió el modo sondear («He completado la consulta usando la skill `sdd-consult` en modo sondeo (spike), tal y como pedía el "pruébalo rápido"»), probó, borró y respondió. La regla "cero artefactos" siguió intacta: nada persiste en el repo.

## Racionalización prevista en el RED

"El spike funciona, lo dejo" **no apareció**: el agente borró los scripts por iniciativa propia antes de informar. La fila añadida a la tabla cubre la racionalización que sí se observó en el RED (negarse a probar); no se añade ninguna otra.

## Nota de método

El agente invocó además `sdd-kit:sdd-consult` con `Skill`, que en el harness resuelve a la **copia en cache de v0.5.0** (sin el modo sondear), y aun así siguió el texto pegado por prompt. Confirma la advertencia del `tech-stack`: el GREEN prueba la versión del working tree solo porque se entrega por prompt.
