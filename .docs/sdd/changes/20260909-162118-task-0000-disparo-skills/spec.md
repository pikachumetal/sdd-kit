---
id: 20260909-162118-task-0000-disparo-skills
task: 0000
title: Disparo de las skills y dos vías del Gate 1 (T13)
mode: lite
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Disparo de las skills y dos vías del Gate 1 (T13)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo lite → implementación directa tras aprobar.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **sin review** — señales: ninguna. Modo lite.

1. **Qué se mide (RED E1)**: en un proyecto con `.docs/sdd/`, el dev dice «implementa la task 77 del roadmap» sin nombrar ninguna skill. ¿El agente invoca `sdd-kit:sdd-start-task` solo (visible como `tool_use` de `Skill` en `stream-json`) o se va a `brainstorming`/código directo? Dos sujetos headless con el kit cargado como plugin (copia limpia, `--add-dir`). La `description` de la skill es el único disparador que Claude Code usa sin comando; si dispara 2/2, no se toca nada más que el Gate 1.
2. **Si no dispara, dos remedios medidos por separado**: (a) `init-*` escriben en el `CLAUDE.md` corto del proyecto la regla «toda task, feature o cambio no trivial arranca con `sdd-start-task`; los bugs deterministas con `sdd-start-patch`» (forma: lista de estructura de `init-*`, sin RED propio; el GREEN E2 mide con esa línea en el `CLAUDE.md` de la fixture); (b) la `description` de `sdd-start-task` se afina con las frases reales del equipo («implementa la task», «hazme la feature», «empezamos con», «tengo un ticket»), y el GREEN E3 la mide. Entra lo que dispare; si (a) basta, (b) no se toca (Art. I).
3. **Gate 1 con dos vías explícitas** (forma, sin RED): `/sdd-start-task` solo → cargar contexto y parar hasta el enunciado; `/sdd-start-task <enunciado>` o el enunciado en el mismo mensaje → cargar contexto y seguir por el enrutado (paso 2). Evidencia ya disponible: los sujetos de T11 con «arranca la task 77 con la skill…» siguieron hasta la spec, y esta sesión paró en el Gate 1 al invocar la skill sin enunciado.
4. **Sin hook de sesión**: un `UserPromptSubmit` que inyecte la regla funciona, pero es configuración por máquina, no del kit. Queda fuera salvo que (a) y (b) fallen, y entonces se anota como decisión pendiente, no se implementa aquí.
5. **Sin delta en `funcional/`** salvo que entre (a) o (b): entonces un `ADDED` en `flujo-de-task` («Una petición de implementar una task dispara `sdd-start-task` sin nombrarla»).

## Intent

Un compañero del dev-lead lo dijo: si al dev se le olvida invocar la skill, el flujo SDD no arranca y todo lo demás no existe. Claude Code invoca skills por su `description` cuando el prompt encaja, pero nadie ha medido si la del kit dispara con las frases que el equipo usa de verdad. Y el Gate 1 de `sdd-start-task` describe una sola vía (invocar y parar) cuando hay dos.

## Scope

- Entra: RED E1 (2 sujetos); según resultado, (a) regla en el `CLAUDE.md` que escriben `init-*` y/o (b) `description` afinada, con su GREEN; Gate 1 con las dos vías; evidencia.
- No entra: hooks; cambios en otras skills; el `CLAUDE.md` del propio kit (no es un consumidor de `init-*`).

## Approach

Medir primero con la petición más común del equipo. Tocar lo mínimo que dispare: primero la regla en el `CLAUDE.md` del proyecto (es forma y la escriben `init-*`), después la `description` solo si hace falta. El Gate 1 se reescribe como dos vías con el texto que ya implica.

## Delta de comportamiento

Sin delta salvo que entre (a) o (b) (decisión 5).

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,15 h
- Estimación de implementación: 0,6 h (rango 0,4–1)
- Base de la estimación: fixture reutilizada (Ledgerly-rev `e1`), RED 2 runs (~5 min de reloj, ~2 $), Gate 1 (5 min), evidencia (10 min); si hay GREEN, +2–4 runs (~15 min). Ancla: T12 0,4 h con un escenario.
- Confianza: media

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 5 decisiones sin cambios) |
