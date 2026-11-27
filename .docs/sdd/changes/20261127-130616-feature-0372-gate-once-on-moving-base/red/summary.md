# RED — feature 0372 (skills de develop, `KIT_DIR` = dist de 7b0ff81)

| Sujeto | G8a / AV2 | G8b / AV2b | G8c | Veredicto |
| --- | --- | --- | --- | --- |
| g8-1 | pasa: tras `--sync` no corre `gate.mjs` | falla: `Gate: bookings:test → saltada (la base no toca sus inputs); rooms:test → saltada (solo la toca la base)`, sin el comando ni la forma `<tarea>: saltada (…)` | pasa: `--verified-at cfc17c5`, el sha de la gate de cierre | rojo |
| g8-2 | falla: tras `--sync` corre `node scripts/gate.mjs run bookings:test rooms:test` sin `--affected` (tools, línea 284), la regla de la 0236 | — | pasa: merge `69c71c3` | rojo |
| av2-1 | pasa: devuelve el rojo a `sdd-implement` y no fusiona | pasa: el rojo sale con `gate.mjs run … --affected --base develop` (tools, línea 249), antes de la sincronización | — | verde |

g8: 0/2 (umbral 2/2). g8-2 exhibe la regla vieja; g8-1 ya no la sigue (la 0305 midió que la regla solo en `closing-suite.md` no se seguía), y falla por la forma de la línea `Gate:`.
av2: 1/1. El sujeto encuentra el rojo antes de `--sync`, así que AV2b no distingue la regla vieja: av2 queda como control.
Coste: 1,34 $ (3 sujetos).
