# GREEN — `sdd-worktrees` y `sdd-parallel-agents` (feature 0166)

Humos de las dos skills nuevas, sujetos Sonnet headless con el kit de la rama y superpowers 7.0.0. Salidas en [`green/out/`](../.docs/sdd/specs/20261012-104247-feature-0166-worktrees-and-parallel-agents/green/out/).

## w1 — `sdd-worktrees` desde la preparación de `sdd-implement`

Escenario `w1` de la batería de `sdd-implement`: el montaje de `h1` dentro de un worktree enlazado de `feature/0010-cancel-reason`, con `environments.md`, `env:setup` en `package.json` y `tech-stack.md` §Testing `Gate de cierre: node --test`. La petición para antes de la Task 1.

| Comprobación (Wt) | Resultado |
| --- | --- |
| Carga `sdd-worktrees` desde `sdd-implement` | sí: `sdd-start-feature` → `sdd-implement` → `sdd-worktrees` |
| Detecta el worktree y no crea otro | sí: `git rev-parse --git-dir`/`--git-common-dir` y la guarda de submódulos; «Ya estoy en un worktree enlazado, en `feature/0010-cancel-reason`: no creo otro»; ningún `git worktree add` |
| `env:setup` | sí: `npm run env:setup`; `.sdd-env.json` en `active` |
| Baseline con el gate del proyecto | sí: «la línea base con el gate de cierre (`node --test`)» → 4/4 |
| Informe con ruta y rama | a medias: dice la rama, no la ruta (la imprimió con `pwd`, no la escribió) |

**Veredicto: 1/1 pasa**, con el matiz de la ruta. El texto de la fuente ya pide «at `<path>`» y se conserva literal; no se añade guía (ruling en el ledger). Coste: 0,34 $.

## a1 — `sdd-parallel-agents` desde `review-spec.md`

Escenario `a1` de la batería de `sdd-start-feature`: la spec de la 0011 (anular reservas de otros) en borrador, con cuatro señales y la review de dos revisores aceptada, el de dominio en Sonnet; la petición entra por `sdd-propose`, paso 4.

| Comprobación (P) | Resultado |
| --- | --- |
| Carga `sdd-parallel-agents` | sí: `sdd-propose` → lee `review-spec.md` → `sdd-parallel-agents` |
| Los dos `Agent` en la misma respuesta | sí: los dos `tool_use` en el mismo mensaje (`msg_011CfxGJ1eVSjkMFJMvZd9jT` del `.jsonl`) |
| Modelo y effort en cada despacho | sí: `subagent_type=sdd-kit:effort-medium model=sonnet` en «Review spec 0011 dominio» y «… técnica» |

**Veredicto: 1/1 pasa.** Coste: 0,66 $ (revisores incluidos).
