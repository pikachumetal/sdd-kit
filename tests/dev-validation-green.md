# GREEN y REFACTOR — Validación del dev con guion desde el reporte (feature 0208)

Misma batería que la [RED](dev-validation-red.md) (`sdd-archive`, escenarios `g1`-`g4`), con el kit de la rama: [dev-validation.md](../skills/sdd-archive/references/dev-validation.md), el paso 1 de `sdd-archive` y el paso 7 de `sdd-start-feature` que la nombran, y `sdd validation serve`. Sujetos Sonnet con `tests/headless/battery.sh` y superpowers 7.0.0. La rúbrica gana G6 (plan B sin Claude in Chrome: los sujetos headless no la tienen). Campaña completa: 26 sujetos, 6,14 $ (techo 26 por la enmienda del 2026-10-23).

## GREEN — 8 sujetos

Salidas en [`green/out/`](../.docs/sdd/specs/20261022-140232-feature-0208-dev-validation-script/green/out/).

| Criterio | Resultado | RED |
| --- | --- | --- |
| G1 Pasos del reporte (`g1`) | 2 de 2 | 2 de 2 |
| G2 Ensayo del agente | 8 de 8 | 0 de 6 |
| G3 Resultado con dato | 6 de 6 | 3 de 6 |
| G4 Nada contra el entorno (`g2`, `g4`) | 4 de 4 | 2 de 4 (`g4` falla 2 de 2) |
| G5 Entorno arrancado (`g3`) | 1 de 2: `g3-2` arriba en el 4689; `g3-1` abajo | 0 de 2 |
| G6 Plan B | 0 de 8: ninguno lanza `sdd validation serve`; el guion va en texto | — |

## REFACTOR — 6 sujetos

Salidas en [`refactor/out/`](../.docs/sdd/specs/20261022-140232-feature-0208-dev-validation-script/refactor/out/). Cambios: la línea fija `Panel:` (Chrome, plan B o «sin panel») y el entorno de una app que también corre por CLI.

| Criterio | Resultado |
| --- | --- |
| G5 (`g3`) | 2 de 2: arriba en el 4422 y en el 4317 |
| G6 | 1 de 4: `g3-2` lanza `sdd validation serve`; `g1-1`, `g3-1` y `g4-1` escriben `Panel: sin panel` |
| Controles `a1` y `a2` (`validation.mode: field`) | 2 de 2: sin guion, panel ni entorno |

## REFACTOR 2 — 4 sujetos

Salidas en [`refactor2/out/`](../.docs/sdd/specs/20261022-140232-feature-0208-dev-validation-script/refactor2/out/). Cambio: la línea `Panel:` solo admite Chrome o plan B; `Panel: no arrancó: <su error>` solo si falla `sdd validation serve`.

| Sujeto | G6 | G5 |
| --- | --- | --- |
| `g1-1` | sí: `Panel: plan B en http://127.0.0.1:8083/`, con el servidor en segundo plano | — |
| `g1-2` | sí: `Panel: plan B en http://127.0.0.1:3058/`. Lanza el servidor en primer plano con el límite de tiempo de Bash; al caerse lo relanza (`:1639`) y a la segunda ofrece el guion «sin panel» | — |
| `g3-1` | no: el entorno no arranca y se para antes de ofrecer el panel («Cuando el entorno esté arriba, te doy el panel (plan B…)») | sin medir |
| `g3-2` | sí: `Panel: plan B en http://127.0.0.1:9887/`, con lo que pierde y la propuesta de `.temp/` en `.gitignore` | sin medir |

**G6 3 de 4.** G5 no se mide en esta vuelta: el rango de puertos reservado de Windows se movió sobre los puertos del molde (4633 en 4567-4666, 4671 en 4667-4766) y `env-up` da `EACCES`. Los dos sujetos lo diagnostican con `netsh interface ipv4 show excludedportrange` y no tocan la config, la conducta que pide la línea «Puertos en Windows» de `operations-template.md`. G5 queda con el 2 de 2 del REFACTOR.

Lo que queda abierto va a la deuda del roadmap: la línea `Panel:` cuando el entorno no arranca (`g3-1`) y el servidor lanzado en primer plano (`g1-2`).
