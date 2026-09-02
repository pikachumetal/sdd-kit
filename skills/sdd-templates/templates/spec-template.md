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

> **Estado**: draft / in-review / approved / implementing / done / superseded / cancelled
> **Fase del workflow**: Specify (qué + por qué)
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`; modo lite → implementación directa.
> Borra los bloques de ayuda (`>`) al redactar.
>
> **Modo lite**: borra las secciones marcadas `(solo full)` y rellena el bloque de estimación
> de la sección 4. En lite quedan: 1, 2, 3, 4 (con estimación) y 11. Esta es la ÚNICA plantilla
> de spec: no existe ni se crea un `spec-lite-template.md` (Art. VIII).
> Las condiciones del predicado que justifican el modo lite van en la **sección 3**, que sobrevive
> al recorte — nunca en Open questions, que el propio modo elimina.

## 1. Contexto

- **Problema u oportunidad**: qué pasa hoy y por qué importa. Estado de partida confirmado del código (qué existe ya, qué no).
- **Stakeholders**: quién lo pide, quién se beneficia, quién lo mantiene después.
- **Restricciones conocidas**: técnicas, plazos, compliance.

## 2. Objetivo

- **Qué construimos (one-liner)**: una frase.
- **Definición de éxito**: criterios observables.
- **NO objetivos**: lo que queda explícitamente fuera de alcance.

## 3. Decisión clave

> La decisión de diseño central, con su alternativa. Evita re-discutirla en el plan.

- **Opción elegida**: descripción + por qué.
- **Alternativa descartada**: opción — motivo del descarte.
- **Refinamiento brownfield** *(si aplica)*: footprint mínimo, respetar el patrón del módulo aunque no sea el ideal, no propagar dependencias.

## 4. Especificación funcional

- User stories (Como / Quiero / Para).
- Comportamiento esperado, paso a paso.
- Flujos alternativos y edge cases (fallos, concurrencia, conflictos).

### Estimación y esfuerzo *(solo modo lite — OBLIGATORIO si existe `.docs/sdd/estimation.md`)*

> En modo full este bloque vive en `plan.md`. En lite no hay plan, así que vive aquí:
> sin él, el `estimation-log` pierde justo las tareas pequeñas, que son las que mejor lo calibran.

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Esfuerzo spec: <Xh>
- Estimación de implementación: <Yh>
- Base de la estimación: <complejidad, incertidumbres, referencia del estimation-log>
- Confianza: alta / media / baja

## 5. Datos *(si aplica · solo full)*

- Entidades involucradas y cambios de schema (detalle técnico en `plan.md` o `data-model.md`).
- Migraciones: mecanismo del proyecto (ver `tech-stack.md` y skills de nivel 2). Retrocompatibilidad por defecto en brownfield.
- Permisos / roles: quién puede leer, crear, editar, eliminar.

## 6. UX *(si aplica · solo full)*

- Frontend: componentes, wireframes o capturas.
- Backend / API: endpoints y contratos request/response.

## 7. Constraints técnicos *(solo full)*

### 7.1 Compatibilidad con la constitution

Listar y marcar los artículos de `.docs/sdd/constitution.md` que aplican a esta spec:

- [ ] Art. <n> — <nombre> (si aplica)

### 7.2 Dependencias

- Specs previas, servicios externos, librerías.

### 7.3 Excepciones a la constitution

Si la spec necesita desviarse: artículo violado · por qué · plan de remediación · aprobado por.

## 8. Riesgos *(solo full)*

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |

## 9. Rollout *(solo full)*

> Cómo llega a producción: toggle/feature flag, orden de despliegue, entrega al cliente. "Directo" si no hay nada especial.

## 10. Open questions *(solo full)*

- [ ] <pregunta> — quién la responde

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
