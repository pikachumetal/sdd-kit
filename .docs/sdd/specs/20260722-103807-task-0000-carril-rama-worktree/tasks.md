---
id: 20260722-103807-task-0000-carril-rama-worktree
task: 0000
title: Registro vivo — Desacople carril↔rama, worktree y rename hotfix→patch
plan: ./plan.md
---

# Tasks — registro vivo

> Status + commit hash por task. La lista de todos del harness es efímera; este es el registro durable.

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | RED: baseline (acotó el alcance) | done | — | RED v1 (`wf_ca5f594f-2e5`) DESCARTADO (método). RED v2 (`wf_d6ee43e7-75c`) válido: baseline YA acierta conducta vía constitution del proyecto → guidance de comportamiento retirada (Art. I). Único fallo: contradicción del override No-op (S1b). Evidencia en `tests/sdd-start-patch-red.md` |
| 2 | Rename mecánico de carpetas y plantilla | done | `2c31c12` | git mv (R) + name frontmatter |
| 3 | Contenido de las skills patch + plantilla (rename, SIN guidance nueva) | done | `a51aadd` | grep limpio; "hotfix/" solo como rama git-flow. Nota aclaratoria del nombre CONFIRMADA por el usuario (mantener) |
| 4 | sdd-start-task: rename refs + reescritura del override | done | `ef710ba` | override neutral (elimina contradicción S1b) + 0 refs hotfix vivas |
| 5 | Referencias vivas en docs de anclaje y skills auxiliares | done | `e49f286` | +plugin.json. Barrido de cierre: 0 refs vivas colgadas; solo quedan histórico (changelog) + git-flow (`hotfix/*`). SemVer "hotfixes→patches" confirmado por usuario |
| 6 | GREEN: override sin contradicción + integridad del rename | done | `cc129f9` | `wf_bb2e1e62-355`: G1 ✅ override ya no genera contradicción (agente lo lee "claro, sin razonar contra el kit"); G2 ✅ handoff consult→patch resuelve en código (la lista viva vieja del subagente es gap código↔plugin publicado, se cierra al releasear). Evidencia en `tests/sdd-start-patch-green.md` |

## Bitácora

- 2026-07-22 — spec aprobada, plan aprobado. Ejecución en línea sobre `master` (repo de rama única, consentida por el usuario).
- 2026-07-22 — **RED reencuadró la task**. El baseline (`wf_d6ee43e7-75c`) acierta la conducta de worktree/rama leyendo la constitution del proyecto (Art. IV del kit). Por Art. I, se retira la guidance de comportamiento (consciencia de worktree, desacople carril↔rama). Alcance recortado a: rename hotfix→patch (claridad) + reescritura del override No-op (única contradicción reproducida). Spec §2/§3/§4/§7/§8 y plan (Goal, Tasks 1/3/4/6, estimación, self-review) actualizados. Estimación revisada 2,5h→2h.
- 2026-07-22 — alcance recortado **re-aprobado** por el usuario. Implementación en 5 commits (`2c31c12`, `a51aadd`, `ef710ba`, `e49f286`, `cc129f9`).
- 2026-07-22 — **cierre vía `sdd-end-task`**: walkthrough, tiempo real (~2,1h, ratio 1,05), estimation-log, aprendizaje a tech-stack (molde sin git), changelog `[Unreleased]`, roadmap (task marcada + deuda de publicación). Sin discrepancias tasks.md↔realidad (la sospecha sobre `sdd-end-task` "Para hotfixes" era el gap código↔plugin-publicado; el fichero en disco ya estaba correcto). Merge: decisión del usuario (paso 9).
