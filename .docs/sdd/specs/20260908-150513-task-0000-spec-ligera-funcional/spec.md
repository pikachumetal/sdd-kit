---
id: 20260908-150513-task-0000-spec-ligera-funcional
task: 0000
title: Spec ligera y funcional/ vivo con delta
mode: full
status: approved
created: 2026-09-08
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-08
---

# Spec — Spec ligera y `funcional/` vivo con delta

> Esta spec está escrita **en el formato que propone**: es su primer dogfooding. Si cuesta leerla, el formato está mal.

## Decisiones que he tomado yo — valida estas

1. **La plantilla de spec se sustituye entera**, no se retoca: cuatro bloques (este, Intent/Scope/Approach, Delta, Aprobaciones). Constitution check, datos, UX, riesgos y rollout pasan a `plan.md`.
2. **`funcional/` es una carpeta con un fichero por capacidad**, sin índice, sin volcado inicial en brownfield. Una capacidad es un sustantivo del dominio, nunca un ticket.
3. **Crear una capacidad nueva es una decisión que se lista aquí arriba**, en cada spec que lo haga. `sdd-end-task` fusiona el delta pero nunca crea una capacidad que la spec no haya declarado.
4. **Un requisito vive en una sola capacidad**; si otra lo necesita, lo enlaza.
5. **Las siete menciones actuales a `funcional.md` pasan a `funcional/`** — es un rename de convención (Art. IV), y por eso esta spec existe como task dedicada.
6. **El propio kit estrena `funcional/`** con esta task: su primera capacidad es `flujo-de-task` (el comportamiento observable del carril task). Es lo que exige el Art. VII.
7. **La plantilla de walkthrough no cambia**: el smoke verifica contra los escenarios del delta, pero eso es contenido, no forma.

## Intent

La spec de hoy tiene 11 secciones y mezcla comportamiento con técnica: nadie la lee entera, y el comportamiento vigente de una capacidad solo se reconstruye leyendo todas las specs que la tocaron. Se quiere una spec que quepa en una pantalla, cuya primera sección sea lo único que el dev-lead necesita para aprobar, y una verdad viva por capacidad que `sdd-end-task` mantenga fusionando deltas.

## Scope

Entra: `spec-template.md` nueva; `funcional-template.md` nueva; `sdd-start-task` (paso 4 y gate), `sdd-end-task` (paso de fusión), `sdd-init-*` (carpeta `funcional/` y rename), `sdd-consult` (lee `funcional/` en preguntas de comportamiento), `sdd-end-release` (ruta nueva); `funcional/flujo-de-task.md` del kit.

No entra: migrar las specs ya escritas al formato nuevo (siguen válidas como registro histórico); `plan-template.md` más allá de recibir las secciones que salen de la spec; un índice de capacidades; volcar `funcional/` en Alybo.

## Approach

Mapeo por conceptos desde OpenSpec, no por layout: su `proposal.md` es nuestra spec ligera, su `specs/<capacidad>/spec.md` es nuestro `funcional/<capacidad>.md`, su delta con `GIVEN/WHEN/THEN` es nuestra sección de delta, su `archive` es el paso de fusión de `sdd-end-task`. Nuestro `specs/` es su `changes/`: sin choque. La regla de contenido —*si la implementación puede cambiar sin cambiar el comportamiento observable, no va en la spec*— es la que decide qué sección vive dónde. Art. I: RED sobre las skills de flujo con una fixture que tenga `funcional/`, A/B de no-regresión de todas las editadas, y dogfooding con esta misma task.

## Delta de comportamiento

### Capacidad: `flujo-de-task` (nueva — ver decisión 6)

**ADDED — La spec presenta primero las decisiones tomadas sin el usuario**
- GIVEN una task en modo full o lite
- WHEN el agente presenta la spec en el gate
- THEN el primer bloque que el dev-lead lee es "Decisiones que he tomado yo — valida estas", con una línea por decisión, y el resto de la spec cabe en una pantalla

**ADDED — El delta declara el comportamiento por capacidad**
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED (antes: …)` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND si la capacidad no existe en `funcional/`, su creación aparece en "Decisiones a validar"

**ADDED — Lo técnico no vive en la spec**
- GIVEN un contenido cuya implementación puede cambiar sin cambiar el comportamiento observable (modelo de datos, endpoints, riesgos técnicos, rollout)
- WHEN se redacta la spec
- THEN ese contenido va a `plan.md`, no a `spec.md`

**ADDED — El cierre fusiona el delta en la verdad viva**
- GIVEN una task cerrándose vía `sdd-end-task` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN cada `ADDED` se añade a `funcional/<capacidad>.md`, cada `MODIFIED` sustituye el requisito anterior, cada `REMOVED` lo quita, y el walkthrough referencia los escenarios del delta como casos del smoke
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado

**ADDED — Brownfield no vuelca `funcional/`**
- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`
- WHEN se generan los documentos de anclaje
- THEN `funcional/` no se crea ni se rellena: aparece con la primera task que toque una capacidad

**MODIFIED — Los documentos de anclaje nombran `funcional/` (antes: `funcional.md`)**
- GIVEN cualquier skill o plantilla que hoy cite `funcional.md`
- WHEN se lee el contexto SDD
- THEN la referencia es a la carpeta `funcional/` y a sus capacidades

**ADDED — La consulta lee la capacidad, no las specs**
- GIVEN una pregunta de comportamiento ("¿qué hace hoy X?") en `sdd-consult`
- WHEN existe `funcional/<capacidad>.md`
- THEN la respuesta se ancla en ese fichero, no en la reconstrucción a partir de specs históricas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-08 | aprobada |

Aprobada en conversación el 2026-09-08 leyendo el bloque de decisiones: el formato pasó su primera prueba.
