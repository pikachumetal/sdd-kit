---
id: 20260909-172400-task-0000-release-pequena
task: 0000
title: Release pequeña primero y smoke por tramo (T15)
mode: lite
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Release pequeña primero y smoke por tramo (T15)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo lite → implementación directa tras aprobar.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **sin review** — señales: ninguna. Modo lite.

1. **Qué se mide (RED)**: proyecto sin ninguna release cerrada y un backlog de ocho ítems; el dev-lead dice «prepara la release 1» con `sdd-start-release`. ¿El agente propone un alcance mínimo entregable y deja el resto para releases siguientes, o mete el backlog entero? Dos sujetos headless. `research-hackaton.md` §3: una release con smoke único dio 9 hallazgos de golpe; tres cortas, 3/0/0.
2. **Si el baseline propone grande**, guidance en el paso 2 de `sdd-start-release`: en la primera release del proyecto (sin `releases/`), la propuesta arranca por el mínimo entregable con el argumento escrito (un smoke por tramo saca los huecos cuando son baratos) y el resto queda en releases siguientes. Sigue siendo propuesta: el tamaño lo decide el usuario en el gate que ya existe. **Si el baseline ya propone pequeño, no se escribe** (Art. I).
3. **Forma, sin RED**: al colapsar el roadmap en `sdd-end-release` (paso 6, `references/notas-y-roadmap.md`), la línea de la release cerrada lleva «smoke: fecha · N hallazgos», para que el patrón se lea sin abrir las actas. El kit lo estrena al cerrar v0.6.0 (dogfooding).
4. **No es un gate**: recomendación con datos; el tamaño de release es decisión del usuario.
5. **Sin delta en `funcional/`**: `funcional/` del kit no tiene capacidad de release; crearla para dos líneas sería una capacidad de una task, que la plantilla prohíbe. Se anota como candidata («carril-release») para cuando una task lo toque de verdad.

## Intent

SifAcademy cerró una release grande con smoke único: nueve hallazgos de golpe y cuatro trabajos derivados en el corte. SifRest abrió pequeña a propósito y amplió al ver el ritmo: 3, 0 y 0 hallazgos sin subir el ratio. `sdd-start-release` fija hoy cómo se compone el scope desde el acta y el backlog, pero no dice nada del tamaño de la primera release; y el roadmap colapsado no deja ver cuántos hallazgos dio cada smoke.

## Scope

- Entra: RED con dos sujetos; guidance en el paso 2 de `sdd-start-release` solo si el baseline propone grande (y su GREEN); línea de smoke en el roadmap colapsado de `sdd-end-release`; evidencia.
- No entra: cambiar el gate de scope; releases posteriores a la primera; plantilla de roadmap (no existe: la estructura la fijan `init-*` y `sdd-end-release`).

## Approach

Medir primero. La recomendación solo entra si el baseline no la hace. La línea de smoke es forma en el fichero que ya describe el colapso.

## Delta de comportamiento

Sin delta (decisión 5).

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,1 h
- Estimación de implementación: 0,5 h (rango 0,3–0,8)
- Base de la estimación: fixture con backlog (10 min), RED 2 runs (~5 min de reloj, ~1,5 $), línea de smoke (5 min), evidencia (10 min); si falla, guidance + GREEN (+15 min). Ancla: T13 0,35 h.
- Confianza: alta

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 5 decisiones sin cambios) |
