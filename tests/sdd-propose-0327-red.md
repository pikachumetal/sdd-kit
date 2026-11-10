# RED — el revisor de la spec señala una prueba que pasa sin la conducta (feature 0327)

Escenario `rc1` de la [batería de `sdd-propose`](batteries/sdd-propose/battery.md), sonnet, con el kit de `develop` (`git archive origin/develop:dist`) y la batería de la rama. La spec de la 0031 está limpia salvo una cosa: su THEN pide que el aviso nombre la 0011 con su título, y la fila de rúbrica que lo prueba es `text: /pendiente/`, que pasa con un aviso que solo diga «pendiente». Salidas en [`red/out/`](../.docs/sdd/specs/20261110-141415-feature-0327-review-conduct-plain-names/red/out/) y [`control/out/`](../.docs/sdd/specs/20261110-141415-feature-0327-review-conduct-plain-names/control/out/).

| Sujeto | $ | Lo que dice «Hallazgos de la review» de la fila | `RC1` |
| --- | --- | --- | --- |
| `red/rc1-1` | 0,46 | «`/pendiente/` es débil → la rúbrica comprueba `0011` y `Anular reservas de otros`» | ✅ |
| `red/rc1-2` | 0,43 | «la rúbrica `/pendiente/` deja pasar «no queda nada pendiente» → se añaden filas `text: /0011/` y `text: /Anular reservas de otros/`» | ✅ |
| `control/rc1-1` | 0,80 | «rúbrica sin anclar al literal → decisión 6» | ✅ |

`battery.mjs run`: `rc1 · 2/2 · umbral 2/2 · puerta verde` y, de control, `rc1 · 1/1`. Total: 3 sujetos, 1,69 $.

## Lo que dice el RED

1. **El revisor de hoy ya ve la fila floja** (3/3): cuando la fila de rúbrica está escrita en la spec, la señala y la spec sale con una fila que nombra la 0011. El punto (2) reescrito de `review-spec.md` (decisión 2 de la spec) no se escribe: Scope «si el RED lo exhibe».
2. **Lo que este escenario no mide**: en la 0326 la fila floja vivía en `battery.md`, no en el texto de la spec, y el revisor lee la spec. Un caso así es otro escenario; queda en el ticket como hipótesis sin segundo caso.
3. **Defecto de la fixture**: llamaba a la 0011 «Responsables de sala» y el roadmap del molde la llama «Anular reservas de otros»; los tres sujetos lo corrigieron antes de despachar al revisor. La fixture usa ya el título del molde; `rc1` no se ha medido con ella.
