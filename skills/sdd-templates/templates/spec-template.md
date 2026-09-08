---
id: <yyyyMMdd-HHmmss>-task-<id>-<slug>
task: <id>            # ID del gestor de tickets, o 0000 si interno
title: <título corto descriptivo>
mode: full            # full | lite — lo lee sdd-end-task; sin campo = full
status: draft
created: <YYYY-MM-DD>
author: <autor>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — <título>

> **Estado**: draft / in-review / approved / implementing / done / superseded / cancelled.
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`; modo lite → implementación directa.
> **Modo lite** = rellenar el bloque «Estimación y esfuerzo» de esta misma plantilla; no existe ni se crea un `spec-lite-template.md` (Art. VIII).
> **Regla de contenido**: si la implementación puede cambiar sin cambiar el comportamiento observable, no va en la spec — va en `plan.md` (datos, UX, riesgos, rollout, restricciones).
> Borra los bloques de ayuda (`>`) al redactar.

## Decisiones que he tomado yo — valida estas

> Una línea por decisión tomada sin el usuario: es lo único que el dev-lead necesita leer para aprobar. Si esta spec crea una capacidad nueva en `funcional/`, se declara aquí.

1. <decisión> — <por qué>

## Intent

> 3-5 líneas: qué pasa hoy, por qué importa, qué se quiere que sea distinto.

<texto>

## Scope

> Entra / No entra — listas cortas, no prosa.

- Entra: <…>
- No entra: <…>

## Approach

> Qué enfoque se toma, no cómo se implementa — el cómo es contenido de `plan.md`.

<texto>

## Delta de comportamiento

> Una subsección por capacidad tocada. El título de cada requisito es la clave de fusión de `sdd-end-task`: estable, no cambia salvo que la spec lo renombre explícitamente. Una capacidad es un sustantivo del dominio, nunca un ticket.

### Capacidad: `<nombre>`

**ADDED — <título estable>**
- GIVEN <precondición>
- WHEN <acción>
- THEN <resultado observable>
- AND <opcional>

**MODIFIED — <título estable>** (antes: "<texto anterior literal>")
- GIVEN <contexto>
- WHEN <acción>
- THEN <resultado actualizado>

**REMOVED — <título estable>**
- motivo: <por qué deja de aplicar>

### Estimación y esfuerzo *(solo modo lite — OBLIGATORIO si existe `.docs/sdd/estimation.md`)*

> En modo full este bloque vive en `plan.md`. En lite no hay plan, así que vive aquí: sin él, el `estimation-log` pierde justo las tareas pequeñas, que son las que mejor lo calibran.

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Esfuerzo spec: <Xh>
- Estimación de implementación: <Yh>
- Base de la estimación: <complejidad, incertidumbres, referencia del estimation-log>
- Confianza: alta / media / baja

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
