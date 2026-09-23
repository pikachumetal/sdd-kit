# RED — effort real al despachar (task 0031)

**Qué se mide**: si el effort que declara un plan del kit es el que viaja en las peticiones a la API de un subagente despachado con `Agent` en Claude Code 2.1.281.

**Método**: sondas técnicas headless (`claude -p`), no sujetos de conducta. Un proxy local (`ANTHROPIC_BASE_URL=http://127.0.0.1:8787`) registra `model`, `output_config` y `thinking` de cada petición y la reenvía intacta. Las peticiones de subagente llevan `cc_is_subagent=true` en la cabecera de facturación del system prompt. Ni `--debug-file` ni los transcripts de subagentes registran el effort. Proxy, definiciones y registros: [`red/`](../.docs/sdd/specs/20260923-213417-task-0031-dispatch-effort/red/).

**Por qué no hay sujetos de conducta**: el fallo es determinista (el tool `Agent` no tiene parámetro de effort) y ya hay cuatro reportes de campo: 0008 §6, 0006a §8, la fila de la 0021 y 0039 §1. En la 0039, el plan declaró «Sonnet, effort medio» y los cinco subagentes corrieron sin ese effort.

## Sondas

Sesión en todas: `--model sonnet --effort high`.

| Sonda | Despacho | Peticiones del subagente | Lectura |
| --- | --- | --- | --- |
| P0 | — | — | **Inválida**: se lanzó desde el worktree del kit, sin los agentes de prueba (fallo del lanzador en PowerShell). No cuenta |
| P1 | `probe-low` y `probe-plain` (proyecto, `model: haiku`; `probe-low` con `effort: low`) | `claude-haiku-4-5`, sin `output_config`, `thinking.budget_tokens: 31999` | Haiku 4.5 no admite effort: no viaja ninguno, se declare o no |
| P2 | `probe-low` (`effort: low`) y `probe-plain` (sin effort), los dos `model: sonnet` | `probe-low`: `effort: low` (2/2 peticiones); `probe-plain`: `effort: high` (2/2) | **El frontmatter se respeta; sin él, el subagente hereda el effort de la sesión**, no el defecto del modelo |
| P3 | agente de plugin `probeplug:implementer-medium` (`model: sonnet`, `effort: medium`), y otra vez con `model: haiku` en el despacho | 1.º: `effort: medium` (2/2); 2.º: `claude-haiku-4-5` sin effort | Los agentes de plugin también lo respetan; el `model` del despacho pisa el de la definición |

**Fallo que confirma el RED**: con el kit actual, un despacho `Agent(model: sonnet)` sin tipo equivale a `probe-plain`. El subagente corre con el effort de la sesión (`high` aquí; en un hilo Opus, `high` o `xhigh`), no con el «effort medio» que declara el plan. El Art. IV y `plan-template.md` dicen además que cae «al defecto de ese modelo», y es falso: hereda el de la sesión.

**Coste**: P1 1,17 $ (Haiku con 32k de thinking), P2 0,28 $, P3 0,38 $, sonda de debug sin proxy 0,19 $, y P0 sin medir. ~2,0 $.
