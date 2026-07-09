---
id: <yyyyMMdd-HHmmss>-task-<id>-<slug>
task: <id>            # ID del gestor de tickets, o 0000 si interno
title: <título corto descriptivo>
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
> **Siguiente paso**: tras aprobación → `plan.md` con `superpowers:writing-plans`
> Borra los bloques de ayuda (`>`) al redactar.

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

## 5. Datos *(si aplica)*

- Entidades involucradas y cambios de schema (detalle técnico en `plan.md` o `data-model.md`).
- Migraciones: mecanismo del proyecto (ver `tech-stack.md` y skills de nivel 2). Retrocompatibilidad por defecto en brownfield.
- Permisos / roles: quién puede leer, crear, editar, eliminar.

## 6. UX *(si aplica)*

- Frontend: componentes, wireframes o capturas.
- Backend / API: endpoints y contratos request/response.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

Listar y marcar los artículos de `.docs/sdd/constitution.md` que aplican a esta spec:

- [ ] Art. <n> — <nombre> (si aplica)

### 7.2 Dependencias

- Specs previas, servicios externos, librerías.

### 7.3 Excepciones a la constitution

Si la spec necesita desviarse: artículo violado · por qué · plan de remediación · aprobado por.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |

## 9. Rollout

> Cómo llega a producción: toggle/feature flag, orden de despliegue, entrega al cliente. "Directo" si no hay nada especial.

## 10. Open questions

- [ ] <pregunta> — quién la responde

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
