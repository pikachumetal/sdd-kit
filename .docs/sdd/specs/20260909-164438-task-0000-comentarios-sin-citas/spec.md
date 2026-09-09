---
id: 20260909-164438-task-0000-comentarios-sin-citas
task: 0000
title: Comentarios que citan documentos (T14)
mode: lite
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Comentarios que citan documentos (T14)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo lite → implementación directa tras aprobar.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **sin review** — señales: ninguna. Modo lite.

1. **La regla entra en el Art. X del kit como principio** (docs, sin RED): un comentario nunca referencia constitution, spec, task, requisito o funcional; la trazabilidad vive en el commit y en el walkthrough. Motivo de `research-hackaton.md` §4: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos.
2. **En `plan-template`, la ayuda de Restricciones globales lista la regla por nombre** (forma), para que viaje aunque la constitution del proyecto consumidor no la tenga: «sin comentarios que repitan el código ni que citen documentos».
3. **Guidance en `encargo-revision.md` (punto explícito para el revisor) solo si el RED falla**: la evidencia disponible del kit dice lo contrario del experimento — en los cuatro runs de implementación de T11 (E3, E3c, E3d y su RED) el código salió con **cero comentarios**; el experimento del hackaton vio 4 citas en 2 de 4 tasks con la regla escrita. Se mide con dos sujetos más sobre una task algo mayor (Ledgerly-rev `e3`, con `subagent-driven-development` completo) contando comentarios que citen documentos en `src/`. Si 0/2, el punto del revisor no se escribe (Art. I) y queda la regla como principio y forma.
4. **Sin delta en `funcional/`**: es calidad de código, no comportamiento del carril.

## Intent

En los dos retos 110 comentarios citaban la constitution, la spec, la task o el funcional, limpiados en un patch sobre 81 ficheros. El Art. X del kit prohíbe los comentarios que repiten el código, pero no dice nada de los que citan documentos, que son la otra forma de comentario que no explica un porqué. Se quiere que la regla exista donde viaja a implementadores y revisores, y saber si hace falta que el revisor la busque explícitamente.

## Scope

- Entra: Art. X; ayuda de Restricciones globales en `plan-template`; RED con dos sujetos; punto en `encargo-revision.md` solo si el RED falla; evidencia.
- No entra: limpiar comentarios en proyectos consumidores; lint automático.

## Approach

Principio en la constitution y forma en la plantilla; guidance de revisión solo con fallo medido. Reutiliza la fixture y el método de T11 E3 (headless con `stream-json`), contando en `src/` los comentarios que contengan «spec», «constitution», «Art.», «task», «requisito» o «funcional».

## Delta de comportamiento

Sin delta (decisión 4).

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,1 h
- Estimación de implementación: 0,5 h (rango 0,3–0,8)
- Base de la estimación: dos ediciones de texto (5 min), RED 2 runs de implementación completa (~10 min de reloj, ~5 $), evidencia (10 min); si falla, punto en `encargo-revision.md` y GREEN (+15 min). Ancla: T13 0,35 h.
- Confianza: alta

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat; decisión 4 aclarada con el paralelo OpenSpec specs/ vs project.md) |
