---
id: 20260922-090037-task-0012-init-interview
task: 0012
title: Entrevista de sdd-init-greenfield — lo que el RED dejó en pie
mode: full
status: draft
created: 2026-09-22
author: Claude (hilo principal)
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Entrevista de sdd-init-greenfield

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: ninguna (cuatro requisitos ADDED en una capacidad existente; sin contrato público, datos ni área sin leer)
- Mínimo razonable: ninguna — deja sin mirar la redacción de los cuatro THEN, que el GREEN pone a prueba de todas formas
```

1. **El modo «sobre template» (a) no entra.** Con el kit tal cual, 2 de 2 sujetos hicieron todo lo que pedía el ticket: no preguntaron stack ni ramas, solo tocaron lo marcado, quitaron los marcadores al aprobar y no hicieron `git init` ni reescribieron `CLAUDE.md` ([RED](../../../../tests/init-interview-red.md)). Añadir guía sin fallo va contra el Art. I. Va a deuda como posible falso negativo.
2. **El contrato del marcador no lo fija el kit.** La init solo busca el texto `sdd-template: pending`; la posición (uno por `##`, bajo el encabezado) es cosa del template y puede cambiar sin romper nada. Se desbloquea la decisión abierta del roadmap y se avisa al repo de templates.
3. **Tampoco entran** leer el stack del código (pasa 2/2), el choque con `brainstorming` (0 de 4 crearon `docs/superpowers/`), las dos racionalizaciones de usuario ausente (2/2 esperan en la pregunta 1) ni el principio «tests RED por el hilo», que ya exige `sdd-start-task` paso 6.
4. **Entran cuatro cosas**, las que fallaron o son hueco leído: default de ramas, git con repo existente, no repetir lo que fija el `CLAUDE.md`, y una pregunta por turno.
5. **La entrevista pasa a ser una lista numerada** (`# · Pregunta · Va a`), no bloques en prosa. Es la forma que en el caso de campo dio cinco turnos seguidos con una pregunta cada uno. El fallo es de forma, así que la solución es una receta, no una prohibición (Art. II).
6. **Git-flow es la opción recomendada** en la pregunta de ramas (`main` estable, `develop` de integración, `feature/<id>` desde `develop`), porque es lo que ya asumen `sdd-start-task` y `sdd-end-release`. La decisión sigue siendo del usuario.
7. **Con repo existente, el agente presenta el plan de git completo y espera el «sí».** El plan incluye renombrados, ramas nuevas, rama por defecto del remoto y borrados. Las operaciones sobre el remoto (push, cambiar la rama por defecto, borrar ramas) las ejecuta el usuario con los comandos que le da el agente: son acciones hacia fuera (mission, «Lo que la autonomía no cubre»).
8. **Solo en `sdd-init-greenfield`.** La entrevista de `sdd-init-brownfield` tiene la misma forma en prosa, pero no se ha medido. Queda a deuda con este RED como indicio.
9. **Capacidad**: se amplía `onboarding` (existe), sin capacidad nueva.

### Decisiones tomadas con el dev-lead

- Partir la 0012 en 0012 (entrevista), 0019 (lo que crean las init) y 0020 (claves de control) — opción «Partir en 3 (Recomendado)» en la primera pregunta.
- Método del RED y alcance: «te voy a decir si a lo que me recomiendes… necesitamos aligerar lo máximo sin perder calidad».

## Intent

La entrevista de `sdd-init-greenfield` es la primera impresión del kit en un proyecto nuevo. Medida con el kit actual, falla en cuatro sitios. Junta varias preguntas en un turno y el usuario solo contesta la primera. Recomienda convenciones de ramas que contradicen al propio kit. Pregunta lo que el usuario ya dejó fijado en su `CLAUDE.md`. Y no sabe qué hacer con git cuando el repo ya existe. Todo lo demás que pedían los tickets ya funciona y no se toca.

## Scope

- Entra: forma de la entrevista (lista numerada con destino, una pregunta por turno); default de ramas git-flow; paso de git para repo existente; no preguntar lo fijado por las instrucciones del usuario.
- No entra: modo sobre template y contrato del marcador (decisiones 1–2); lectura del stack del código, override de `brainstorming`, racionalizaciones nuevas y principio de tests RED (decisión 3); `sdd-init-brownfield` (decisión 8); lo que crean las init (0019); claves de control (0020).

## Approach

Se reescribe el paso 1 de `sdd-init-greenfield` como lista numerada de preguntas, cada una con su documento de destino y un turno propio; las compuestas de hoy (roles y módulos; ramas, worktrees y entorno) se separan. La pregunta de ramas lleva git-flow como opción recomendada. Delante de la lista va una línea: lo que ya fijan las instrucciones del usuario no se pregunta, se referencia. El paso 5 gana el caso de repo existente. Sin referencias nuevas: la lista vive en la skill, porque es el paso que el agente ejecuta.

## Delta de comportamiento

### Capacidad: `onboarding`

**ADDED — La entrevista hace una sola pregunta por turno**
- GIVEN una init greenfield en su entrevista
- WHEN el agente pregunta al usuario
- THEN cada turno termina con una única pregunta de la lista de la entrevista
- AND convención de ramas, worktrees y entorno del worktree son preguntas distintas, en turnos distintos

**ADDED — La pregunta de ramas recomienda git-flow**
- GIVEN una init greenfield que llega a la convención de ramas
- WHEN el agente la pregunta
- THEN la opción recomendada es git-flow: `main` estable, `develop` de integración y `feature/<id>` desde `develop`
- AND el usuario puede elegir otra, y se registra la que elija

**ADDED — Lo que fijan las instrucciones del usuario no se pregunta**
- GIVEN unas instrucciones del usuario (`CLAUDE.md` global o del proyecto) que ya fijan un punto de la entrevista, p. ej. el formato de commit o el idioma del código
- WHEN la entrevista llega a ese punto
- THEN el agente no lo pregunta: la constitution lo referencia

**ADDED — Git sobre un repo existente**
- GIVEN una init greenfield sobre un repo que ya existe y cuyas ramas o remoto no siguen la convención acordada
- WHEN la init llega al paso de git
- THEN el agente presenta el plan completo (renombrados, ramas nuevas, rama por defecto del remoto, borrados) y espera la confirmación antes de ejecutar nada
- AND las operaciones sobre el remoto las ejecuta el usuario, con los comandos que le da el agente

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
