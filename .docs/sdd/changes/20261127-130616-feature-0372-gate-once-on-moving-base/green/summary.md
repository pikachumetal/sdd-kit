# GREEN — feature 0372

## Primera tanda (`green/`), frase del paso 6 «doesn't run the gate whole: it counts for the crossing like any other file»

| Sujeto | G8a / AV2 | G8b / AV2b | G8c | Veredicto |
| --- | --- | --- | --- | --- |
| g8-1 | falla: corre `gate.mjs run bookings:test` tras `--sync` («el sync trajo package.json… por eso volví a pasarlo») | pasa en la forma | pasa | rojo |
| g8-2 | falla: corre `gate.mjs run bookings:test rooms:test` sin `--affected`, «porque la base trajo `package.json` («Sin filtro»)» | falla: `(sin filtro: cambia el build)` | pasa | rojo |
| av2-1 | pasa | falla: el rojo sale con `gate.mjs run bookings:test rooms:test` sin `--affected` | — | rojo |

g8 0/2, av2 0/1. Ninguno leyó `closing-suite.md`: decidieron con el paso 6. Clase (Art. II): excepción sin contraejemplo; «cambia el build» era la salida fácil.

## Segunda tanda (`green2/`), frase reescrita como predicado con contraejemplo

«A file of «Sin filtro» from the base (`package.json`, a lockfile) runs only a task whose inputs hold it and that the branch touches; «it changes the build» isn't a reason.»

| Sujeto | G8a / AV2 | G8b / AV2b | G8c | Veredicto |
| --- | --- | --- | --- | --- |
| g8-1 | pasa: tras `--sync` (tools.txt:202) no corre nada; antes repitió la gate de cierre sobre el árbol de cierre | pasa: `` `bookings:test`: saltada (la base no toca sus inputs) · `rooms:test`: saltada (solo la toca la base) `` (nombres entre backticks) | pasa: `--verified-at da96d9b`, el commit de cierre («Suite completa … sobre el commit de cierre») | verde |
| g8-2 | pasa: `--sync` y no corre nada | pasa: `bookings:test: saltada (la base no toca sus inputs) · rooms:test: saltada (solo la toca la base)` | pasa: `--verified-at 2ac7c73`, el de la gate de cierre; fusionada | verde |
| av2-1 | pasa: devuelve el rojo, no fusiona | pasa: el rojo sale con `gate.mjs run … --affected --base develop` tras `--sync` | — | verde |

g8 2/2, av2 1/1. Coste acumulado de la campaña: 4,11 $ (9 sujetos), dentro de la contingencia (5,83 $).
