# GREEN — feature 0116: arrancar sin el kit y retomar

Salidas de los sujetos en `.docs/sdd/specs/20261101-150956-feature-0116-session-start-and-resume/green/`, `green-entera/` y `fix/`. Los smokes del hook no guardaron salida: su evidencia es esta tabla.

## Hook de arranque

Smoke con Haiku, Claude Code 2.1.316, un proyecto con el hook copiado y `sdd-kit.json` a 3.0.0:

| Sesión | Aviso | Ruta 3.0.0 |
| --- | --- | --- |
| Sin plugin | sí | sí |
| Con el kit y superpowers por `--plugin-dir` | no | no |

Con el kit cargado, sin aviso en el inicio, con `--resume` y con `--continue`. Con `--continue`, el stream etiqueta SessionStart con un id y UserPromptSubmit con otro, pero el hook vio la marca: al terminar no quedó ningún `.warned`. Sin medir: `/clear`, cuyo SessionStart marca igual. El hook tarda ~66 ms por mensaje en Windows.

Hallazgo: con el kit por `--plugin-dir` y **sin superpowers**, el kit no carga (`plugins` no lo lista, 0 skills) y el aviso salta, con razón.

## Retomar

| Escenario | Primera skill | Sigue por lo pendiente | Lee la base | Crea carpeta o `patch.md` |
| --- | --- | --- | --- | --- |
| rf1 | `sdd-implement` 2/2 | 2/2 | 2/2 | 0/2 |
| rf2 | `sdd-implement` 2/2 | 2/2 | 2/2 | 0/2 |
| rp1 | `sdd-implement` 2/2 | 2/2 | no aplica | 0/2 |

## Control: la batería entera

24 escenarios, 34 sujetos, Sonnet: todos verdes, también `i1`, `i2`, `f2`, `f3` y `d1`, que cubren las frases recortadas de `using-sdd`. `d1` leído a mano: una sola pregunta sobre qué es y cuánto abarca, con la recomendación. En `d1-1` la recomendación no va antes de la pregunta, sino justo después.

Los sujetos mencionan el aviso de versión porque el marcador del molde es 3.0.0 y `plugin.json` sigue en 2.3.4: es el aviso esperado, no un fallo de esta feature.

Coste de la campaña: 10,69 $ (previsión de la spec: 12,44 $, con el smoke aparte).

## Retomar sin spec

`rf3` (`fix/`), «Retoma la feature.» en una rama sin spec ni `patch.md`, 2 sujetos: entran por `sdd-implement`, paran sin tocar nada y recomiendan `sdd-propose`. Dejan la decisión al usuario en lugar de invocarla, y con la petición vaga es lo razonable.
