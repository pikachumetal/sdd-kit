# GREEN — `sdd-worktrees` y `sdd-parallel-agents` (feature 0166)

Humos de las dos skills nuevas, sujetos Sonnet headless con el kit de la rama y superpowers 7.0.0. Salidas en [`green/out/`](../.docs/sdd/specs/20261012-104247-feature-0166-worktrees-and-parallel-agents/green/out/); las de `w1` antes de la enmienda, en `green-w1r0/` (primera tanda) y `green-w1r1/` (ronda 1).

## w1 — `sdd-worktrees` desde la preparación de `sdd-implement`

Escenario `w1` de la batería de `sdd-implement`: el montaje de `h1` dentro de un worktree enlazado de `feature/0010-cancel-reason`, con `environments.md`, `env:setup` en `package.json` y `tech-stack.md` §Testing `Gate de cierre: node --test`. La petición para antes de la Task 1.

| Comprobación (Wt) | Resultado |
| --- | --- |
| Carga `sdd-worktrees` desde `sdd-implement` | sí: `sdd-start-feature` → `sdd-implement` → `sdd-worktrees` |
| Detecta el worktree y no crea otro | sí: `git rev-parse --git-dir`/`--git-common-dir` y la guarda de submódulos; «Ya estoy en un worktree enlazado, en `feature/0010-cancel-reason`: no creo otro»; ningún `git worktree add` |
| `env:setup` | sí: `npm run env:setup`; `.sdd-env.json` en `active` |
| Baseline con el gate del proyecto | sí: «la línea base con el gate de cierre (`node --test`)» → 4/4 |
| Informe con ruta y rama | no: dice la rama, no la ruta (la imprimió con `pwd`, no la escribió) |

**Veredicto de la primera tanda: falla** la parte de la ruta del THEN; lo demás pasa. La revisión final lo marcó Important: el primer veredicto («pasa, con el matiz de la ruta») contradecía la rúbrica.

**Dos rondas de REFACTOR**, n = 1 cada una (primera tanda en `green-w1r0/`, ronda 1 en `green-w1r1/`, ronda 2 en `green/out/w1-1`):

- Ronda 1: «Report with branch state and the full path (`git rev-parse --show-toplevel`)». El sujeto ejecuta el comando y escribe solo la rama.
- Ronda 2: además, «Write that line in your message… with the real path in place of `<path>`». Igual: «Ya estoy en un worktree enlazado, en la rama `feature/0010-cancel-reason`».

**Resultado: 0/3 escriben la ruta; 3/3 pasan el resto** (detectan el worktree sin crear otro, `env:setup` en `active`, baseline `node --test` 4/4). Las dos frases se retiran (Art. I: no cambiaron la conducta) y el Step 0 vuelve al texto de la fuente. El THEN pasa a «lo dice con su rama» por enmienda aprobada por el dev-lead (2026-10-12). Coste: 0,34 + 0,29 + 0,39 $.

## a1 — `sdd-parallel-agents` desde `review-spec.md`

Escenario `a1` de la batería de `sdd-start-feature`: la spec de la 0011 (anular reservas de otros) en borrador, con cuatro señales y la review de dos revisores aceptada, el de dominio en Sonnet; la petición entra por `sdd-propose`, paso 4.

| Comprobación (P) | Resultado |
| --- | --- |
| Carga `sdd-parallel-agents` | sí: `sdd-propose` → lee `review-spec.md` → `sdd-parallel-agents` |
| Los dos `Agent` en la misma respuesta | sí: los dos `tool_use` en el mismo mensaje (`msg_011CfxGJ1eVSjkMFJMvZd9jT` del `.jsonl`) |
| Modelo y effort en cada despacho | sí: `subagent_type=sdd-kit:effort-medium model=sonnet` en «Review spec 0011 dominio» y «… técnica» |

**Veredicto: 1/1 pasa.** Coste: 0,66 $ (revisores incluidos).
