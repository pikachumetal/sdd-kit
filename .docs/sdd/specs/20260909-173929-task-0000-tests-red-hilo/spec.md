---
id: 20260909-173929-task-0000-tests-red-hilo
task: 0000
title: Tests RED escritos por el hilo principal antes de despachar (T16)
mode: lite
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Tests RED escritos por el hilo principal antes de despachar (T16)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo lite → implementación directa tras aprobar.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **sin review** — señales: ninguna. Modo lite (flujo existente en `sdd-start-task` paso 6 y `plan-template`; sin contrato público; sin schema; un área; ≤ media jornada).

1. **RED sin gasto nuevo**: la campaña de T12 ya es la fixture que pide `research-hackaton.md` §1.4 (spec de tres escenarios, plan sin campo `Tests RED`, `subagent-driven-development`). En los dos runs con implementación (`rev-green-e3c`, `rev-green-e3d`) el hilo principal escribió **0/2** tests antes de despachar y el implementador los escribió **2/2** después del primer `Agent`. La forma de los tests siguió los tres THEN porque el plan de la fixture los dictaba en su Step 1; una aserción no estaba en la spec (`refund === null` al cancelar un pedido confirmado). Conclusión: el fallo medido es el **origen** del test, que es lo que la guidance cambia; el de forma (tautologías) no aparece en tres escenarios con plan que dicta los tests, y así se deja escrito.
2. **Guidance en `sdd-start-task` paso 6**, una frase: antes de despachar un implementador, el hilo principal escribe los tests que codifican los escenarios de la task (uno por THEN; RED por compilación o por fallo), los commitea, y el encargo del implementador lleva la cabecera de `references/encargo-revision.md`.
3. **La frase de contrato vive en el artefacto, no en la prosa** (lección T11): `encargo-revision.md` gana la sección «Encargo del implementador» con la cabecera literal: Restricciones globales + «Los tests de `<ruta>` son el contrato; no los modifiques; si uno te parece incorrecto, para y explícalo». Es la versión corta probada en SifRest (§1.3).
4. **Campo por task en `plan-template`**: `**Tests RED**: hilo principal · <ruta>` (en línea: «TDD del propio hilo»). La recomendación §1.3.3 (un test por escenario, siembra por API, una aserción de negocio; recorridos largos solo para el smoke de release) va como bloque de ayuda `>` de ese campo: guía sin ser regla, sin RED propio (Art. I).
5. **GREEN**: dos sujetos sobre la misma fixture de T12 (plan **sin** el campo, como en el RED: la guidance del paso 6 tiene que bastar sola). Predicados: (a) ficheros de test escritos por el hilo antes del primer `Agent`; (b) cada THEN de la spec tiene un test; (c) el encargo del implementador contiene la frase de contrato; (d) los tests no cambian tras la implementación, o el implementador para y lo explica. Umbral: 2/2 en (a) y (c); (b) y (d) se registran.
6. **Delta en `funcional/flujo-de-task.md`**: `ADDED` «Los tests de la spec preceden al implementador».
7. **Art. IX**: superpowers tiene `test-driven-development` (un agente) y `subagent-driven-development` (implementador + revisores) y no dice quién escribe el RED con subagentes. Hueco entre dos skills; se extiende, no se duplica.

## Intent

Con el default del kit el implementador escribe código y tests en la misma pasada, y el test tiende a describir lo que el código hace (§1.2: tautologías, E2E que cubren varios requisitos y no dicen cuál falla). SifRest separó quien escribe el test de quien implementa desde la task 0001 y bajó los hallazgos de smoke de 9 a 3 · 0 · 0 con la misma proporción de líneas de test. El kit no dice quién escribe el RED cuando hay subagentes.

## Scope

- Entra: frase en el paso 6 de `sdd-start-task`; sección «Encargo del implementador» en `encargo-revision.md`; campo `Tests RED` y ayuda en `plan-template`; GREEN 2 sujetos; evidencia RED (reutilizada) y GREEN; delta en `flujo-de-task`.
- No entra: obligar la forma de los tests (E2E por escenario queda como recomendación); modo lite sin despacho (ahí el TDD de superpowers ya cubre); plantillas de superpowers.

## Approach

El hilo principal ya tiene la spec y el plan; escribir los tests desde los THEN antes de despachar es una línea en el paso 6. Lo que el implementador no debe hacer va en su encargo, como artefacto, igual que las restricciones para los revisores.

## Delta de comportamiento

### Capacidad: `flujo-de-task`

**ADDED — Los tests de la spec preceden al implementador**
- GIVEN una task cuya implementación se despacha a un subagente
- WHEN el hilo principal prepara el despacho
- THEN los tests que codifican los escenarios de la task existen y están commiteados antes del primer encargo, uno por THEN, en RED
- AND el encargo del implementador nombra su ruta como contrato: no los modifica; si uno le parece incorrecto, para y lo explica

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,6 h (rango 0,4–0,9)
- Base de la estimación: guidance + sección + plantilla (10 min), GREEN 2 runs en paralelo (~2,5 $, ~7 min de reloj), evidencia RED reutilizada (10 min) y GREEN (10 min), funcional (5 min). Ancla: T13 0,35 h, T11 GREEN por sujeto ~1,2 $.
- Confianza: alta

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 7 decisiones sin cambios) |
