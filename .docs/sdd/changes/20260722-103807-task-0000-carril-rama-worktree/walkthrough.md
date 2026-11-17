---
id: 20260722-103807-task-0000-carril-rama-worktree
task: 0000
title: Walkthrough — Desacople carril↔rama git-flow, consciencia de worktree y rename hotfix→patch
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-07-22
---

# Walkthrough — Rename hotfix→patch + override de worktrees neutral

> Documento post-implementación e inmutable. El título de la spec conservó el enunciado original ("desacople carril↔rama, consciencia de worktree"); la implementación real es más pequeña porque el RED recortó el alcance (ver §3).

## 1. Cambios realizados

- **Rename mecánico** (`2c31c12`): `git mv` de `skills/sdd-start-hotfix/`→`sdd-start-patch/`, `sdd-end-hotfix/`→`sdd-end-patch/`, `hotfix-template.md`→`patch-template.md`, con historial preservado (renames `R`) + `name:` frontmatter.
- **Contenido del carril patch** (`a51aadd`): cuerpo de las dos skills, plantilla (`patch.md`, `type: patch`, `branch: <feature|hotfix>/<id>`), índice de `sdd-templates`, árbol de decisión, red flags, racionalizaciones. Añadida una nota aclaratoria (confirmada por el usuario) de que el nombre del carril es independiente del tipo de rama git-flow.
- **`sdd-start-task`** (`ef710ba`): reescritura de la fila `using-git-worktrees` del override (de "No-op" a redacción neutral que no niega los worktrees) + rename de referencias vivas (enrutado, nombrado `task|patch`, red flag, description, racionalización).
- **Referencias vivas** (`e49f286`): 7 skills auxiliares, 8 docs de anclaje del kit y `plugin.json`. En `sdd-end-release`, "hotfixes: v0.N.x"→"patches: v0.N.x" (término SemVer oficial, decidido con el usuario). Histórico preservado (changelog v0.1.0 intacto).
- **Evidencia RED+GREEN** (`cc129f9`): `tests/sdd-start-patch-red.md` y `-green.md`.

## 2. Tiempo: estimado vs real *(OBLIGATORIO — existe `.docs/sdd/estimation.md`)*

- Tipo: docs (contenido de skills) + infra/tooling (workflows de test)
- Estimación de implementación (del plan): 2h (rango 1,5–2,8h) — ya revisada a la baja tras el recorte del RED
- Esfuerzo real: ~2,1h (aproximado, reloj de sesión: carpeta 10:38 UTC → cierre 12:45 UTC; incluye las dos rondas de RED, la implementación en 5 commits y el GREEN)
- Desviación: +0,1h (+5%)
- Causa de la desviación: dentro del rango; no requiere análisis. (La estimación inicial de 2,5h sí se habría desviado a la baja de no recortar; el recorte del RED alineó estimación y real.)

## 3. Desviaciones del plan

**Desviación mayor — el RED recortó el alcance (documentada en spec §2 y plan Goal):** la spec original tenía dos comportamientos nuevos (consciencia de worktree, desacople carril↔rama con nota anti-atajo). El RED (`wf_d6ee43e7-75c`) demostró que el baseline **ya acierta** esa conducta leyendo la constitution del proyecto (Art. IV del kit: el git-flow es del proyecto). Por Art. I, esa guidance no se escribió. El alcance quedó en: rename + reescritura del override. Spec, plan, tasks y estimación se actualizaron antes de implementar, con re-aprobación del usuario.

- RED en dos rondas: v1 (`wf_ca5f594f-2e5`) descartada por método (molde con git → setup roto; bug irreproducible en clase vacía). v2 válida (molde sin git, código con NRE real, 3 escenarios).
- Nota aclaratoria en `sdd-start-patch` L12: no estaba en el plan; se añadió en la implementación y se confirmó con el usuario en el checkpoint de Task 3.

## 4. Verificación

### 4.1 Builds

- El kit no tiene build ni CI (Markdown puro). "Build verde" = frontmatter YAML válido + referencias vivas que resuelven. Verificado por grep de cierre.

### 4.2 Smoke / tests

> Para el kit, el "smoke" es la evidencia RED/GREEN en disco verificada, no un binario que corre.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | GREEN G1 — override reescrito, agente en proyecto con worktrees | ✅ **verificado por el agente** (`wf_bb2e1e62-355`): leyó la fila "clara, sin razonar contra el kit". La contradicción del RED S1b desapareció. |
| 2 | GREEN G2 — handoff `sdd-consult`→`sdd-start-patch` | ✅ **verificado en código**: el handoff apunta al nombre nuevo y resuelve. La lista viva vieja que vio el subagente es el gap código↔plugin publicado (se cierra al releasear). |
| 3 | Integridad del rename en disco | ✅ **verificado por el agente**: carpetas nuevas existen, viejas no; plantilla renombrada; grep global 0 referencias vivas colgadas; histórico intacto. |
| 4 | git mv preserva historial | ✅ **verificado**: `git status` mostró renames `R`, no delete+add. |

### 4.3 Residuales / deuda generada

- **Publicar el rename**: el gap "código↔plugin publicado" (G2) se cierra con el release + `/plugin marketplace update`. Va al roadmap como próximo (release posterior).
- **Ninguna deuda de rename pendiente**. (Durante el cierre se sospechó que `sdd-end-task` tenía la sección "Para hotfixes" sin renombrar, pero se verificó en disco: ya estaba corregida en Task 5 — grep 0 ocurrencias. La versión "vieja" que apareció al invocar la skill era la del plugin publicado, no el checkout editado: el mismo gap código↔publicado que G2. El fichero en disco está correcto.)

## 5. Aprendizajes

- **El RED puede (y debe) recortar el alcance**: un baseline que no falla es evidencia de que la guidance sobra, no un contratiempo. Aquí ahorró escribir dos comportamientos innecesarios. → refuerza Art. I; ya está en la constitution, no requiere cambio de doc.
- **Fixture de test: el molde no debe traer git**: inicializar git en el molde rompe el `git init`/`worktree add` por-run. El git se crea en la copia. → vuelca a `tech-stack.md` (§Tests), que ya menciona "una copia por run con git local propio" pero no explicita "molde sin git".
- **El git-flow concreto es del proyecto, confirmado empíricamente**: el RED mostró 3 agentes acertando la rama/worktree vía la constitution del proyecto. → confirma Art. IV; no requiere cambio.
- **Rename multi-fichero: distinguir vivo de histórico y de valor-git-flow**: tres categorías de "hotfix" (carril vivo → renombrar; histórico → intacto; `hotfix/*` rama → preservar). → patrón reutilizable para futuros renames del kit; se anota aquí como referencia.
