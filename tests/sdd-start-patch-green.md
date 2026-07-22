# Evidencia GREEN — rename hotfix→patch + override de worktrees (2026-07-22)

Verificación con las skills **modificadas** por esta task (`sdd-start-task` con el override reescrito, `sdd-consult` con el handoff renombrado, carril `sdd-start-patch`/`sdd-end-patch`). Workflow multi-agente (2 subagentes Sonnet en paralelo, `wf_bb2e1e62-355`) sobre la misma fixture "Acme Orders" del RED (git-flow con worktrees en la constitution, código con NRE real). Estado verificado en disco y contra el journal.

## Veredicto contra los dos hallazgos del RED

### G1 — El override reescrito ya NO genera contradicción (corrige el fallo de S1b) ✅

Mismo escenario que el RED S1b (agente arranca `sdd-start-task` en `develop`, proyecto con worktrees en la constitution), ahora con la fila `using-git-worktrees` reescrita.

**RED S1b (antes)** — el agente tuvo que razonar CONTRA el kit para conciliar el "No-op" con el Art. II del proyecto:
> *"La skill del kit dice que using-git-worktrees es no-op … pero remite a la convención que fije la constitution del proyecto, así que el no-op solo descarta el flujo genérico de superpowers, no anula una exigencia explícita del proyecto."*

**GREEN G1 (ahora)** — el agente lee la fila reescrita sin fricción. Cita textual de su reporte:
> *"El override NO me obligó a razonar contra el kit. La fila `using-git-worktrees` es una delegación, no una prohibición… El proyecto Acme SÍ los usa (constitution Art. II), así que kit y proyecto son consistentes: el kit se abstiene y deja que la constitution del proyecto mande. La fila me resultó CLARA en su intención… resuelve la aparente tensión sin contradicción."*

Texto de la fila que leyó (verificado, coincide con el implementado):
> *"El kit no gestiona worktrees desde el flujo (no invoca esta skill ni crea entornos): trabaja dentro del git-flow del proyecto —worktrees incluidos si el proyecto los usa— que el dev gestiona por su cuenta. No los prescribe ni los excluye."*

**Veredicto: ✅ la contradicción desaparece.** El agente creó el worktree que la constitution del proyecto pedía, sin necesidad de desambiguar contra el kit. Conducta correcta preservada, fricción eliminada.

Nota lateral (no es un fallo de esta task): el agente tuvo una fricción **interna a `superpowers:using-git-worktrees`** (el tool nativo `EnterWorktree` usa base `origin/<default>` y el fixture no tiene remoto → aplicó el fallback `git worktree add`). Es una decisión dentro de la skill de worktrees de superpowers, ajena al override del kit.

### G2 — El rename resuelve en el código; handoff de consult → patch correcto ✅ (con nota de entorno)

El agente en el carril `sdd-consult` (modificada) diagnosticó el bug determinista (NRE por `Customer` null), se detuvo en el punto del handoff sin fabricar artefactos (conducta de consult intacta), y **anunció el handoff a `sdd-start-patch`** — el nombre nuevo, leído de la skill modificada. La referencia en el código resuelve.

**Discrepancia detectada por el agente (esperada, NO un defecto de esta task):** al verificar el nombre destino contra la **lista viva de skills del system prompt de su sesión**, encontró `sdd-kit:sdd-start-hotfix`, no `sdd-start-patch`. Cita:
> *"la skill sdd-consult remite a 'sdd-start-patch'… pero ese nombre NO existe en la lista viva de skills publicadas de este entorno… el carril fue renombrado de patch → hotfix, pero [la lista viva] todavía apunta al nombre antiguo. Nota: en el checkout de trabajo del kit aún existen las carpetas sdd-start-patch/sdd-end-patch, coherentes con la referencia de sdd-consult."*

(El agente lo interpretó al revés — cree que el rename fue patch→hotfix — porque su lista viva es la del plugin **publicado**, anterior a este cambio.)

**Explicación**: hay dos estados distintos del kit:
- **Código en disco** (`d:\code\git\sdd-kit\skills\`, lo que esta task editó): renombrado a `sdd-start-patch`. El handoff de `sdd-consult` apunta ahí y **resuelve**.
- **Plugin publicado/instalado** (lo que la sesión del subagente tenía cargado en su system prompt): aún `sdd-start-hotfix`, porque el rename **no se ha publicado** (`/plugin marketplace update`) ni releaseado.

**Veredicto: ✅ el rename es íntegro y coherente en el código** (barrido de cierre: 0 referencias vivas colgadas; carpetas viejas eliminadas; plantilla renombrada). La discrepancia que el agente vio es el gap normal entre "código editado en el checkout" y "plugin publicado", que se cierra al releasear — paso posterior explícitamente fuera del scope de esta task (spec §9). No hay referencia rota que corregir en el código.

## Integridad del rename verificada en disco (Task 6 Step 2)

- `skills/sdd-start-patch/`, `skills/sdd-end-patch/` existen; `sdd-start-hotfix/`, `sdd-end-hotfix/` no.
- `skills/sdd-templates/templates/patch-template.md` existe; `hotfix-template.md` no.
- Grep global (`skills/**/*.md`, `README.md`, `CLAUDE.md`, `.docs/sdd/*.md`, `.claude-plugin/*.json`): las únicas ocurrencias de "hotfix" que quedan son (a) `changelog.md` (histórico ② de v0.1.0, intacto por diseño), (b) `hotfix/*` como valor de rama git-flow en `patch-template.md` y `sdd-start-patch` (legítimo). 0 referencias vivas al carril con el nombre viejo.
- `git mv` preservó el historial (renames registrados como `R`).

## Conclusión

Los dos cambios que el RED justificó quedan verificados:
1. **Override reescrito**: el agente ya no razona contra el kit (G1). ✅
2. **Rename íntegro**: código coherente, histórico preservado, handoff resuelve (G2). ✅

Ningún hueco de la propia guidance que exija REFACTOR. La task se cierra sin guidance de conducta añadida (el RED demostró que el baseline ya acierta vía la constitution del proyecto), fiel al Art. I.
