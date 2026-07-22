---
release: v0.4.0
title: Acta de release — v0.4.0
created: 2026-07-22
source: Trabajo interno del kit (sin demo/cliente); fricción real detectada durante el estreno en un proyecto del equipo
---

# Acta de release — v0.4.0 (2026-07-22)

Fuente: trabajo interno del kit. **Sin demo ni feedback de cliente** — no hay inventario de peticiones externas que triar. El origen fue fricción real detectada por el dev-lead durante el estreno en un proyecto del equipo (roadmap ítem 2): al usar worktrees para paralelizar varios agentes, el override `using-git-worktrees → No-op` de `sdd-start-task` resultaba contradictorio, y el nombre del carril `sdd-*-hotfix` se confundía con `hotfix/*` de git-flow.

## 1. Inventario y triage

No aplica: sin sesión de feedback externo. El único ítem de la release es la task `carril-rama-worktree`, decidida y aprobada por el usuario en la propia sesión ([task](../../specs/20260722-103807-task-0000-carril-rama-worktree/)).

## 2. Cambios de requisito detectados

_Ninguno._ El trabajo confirmó (no contradijo) un supuesto existente: el git-flow concreto es responsabilidad de la constitution del proyecto, no del kit (Art. IV) — el RED lo demostró empíricamente con 3 agentes acertando la rama/worktree vía la constitution del proyecto.

## 3. Retro

- **Agregado de la release**: 1 task con estimación — `carril-rama-worktree`, estimado 2h · real ~2,1h (ratio 1,05).
- **Comprobación de los action items de v0.3.0**:
  - **[A2-bis] Configurar el remoto** (arrastrado de v0.2.0 y v0.1.0) — **PENDIENTE, pospuesto explícitamente** por el usuario en esta sesión (4ª release consecutiva). Decisión consciente, no olvido: el usuario indicó "de momento no tenemos remoto". Consecuencia asumida: v0.2.0, v0.3.0 y v0.4.0 quedan en el código pero NO distribuibles (`/plugin marketplace update` imposible sin remoto). Se mantiene como pendiente vivo #1 del roadmap.
- **Qué funcionó**:
  - **El RED recortó el alcance** en lugar de validar guidance innecesaria. La spec original tenía dos comportamientos nuevos (consciencia de worktree, desacople carril↔rama); el baseline demostró que el agente ya acierta esa conducta vía la constitution del proyecto. Por Art. I no se escribieron. El ciclo del Art. I hizo su trabajo: la task salió más pequeña y honesta.
  - **La consulta previno el sobre-disparo**: la fricción entró por `sdd-consult` (no directamente a task), y el grilling tensó la dirección (rename vs solo-nota) antes de comprometer código.
- **Qué corregir**:
  - **El molde de fixture no debe traer git**: el RED v1 se descartó porque el molde tenía `.git` inicializado, rompiendo el setup por-run. Aprendizaje ya volcado a `tech-stack.md`. Es el 2º defecto de método de fixture en 3 releases (tras el telegrafiado de v0.3.0) → los defectos de método de test se repiten; conviene una checklist de montaje de fixture antes del próximo RED.
- **Action items nuevos** (verificables):
  - [A2-ter] **Configurar el remoto** (arrastrado 3ª vez) — se verifica con `git remote -v` no vacío antes del próximo cierre. Escalado: si no se prioriza en la próxima, decidir formalmente si el kit se queda como uso local-only o se publica. No dejarlo flotar una 5ª vez.
  - [A5] **Checklist de montaje de fixture RED** (molde sin git, código con el bug real, escenario con superficie de decisión, prompt neutro) — se verifica con que el próximo RED no requiera una ronda descartada por método.
