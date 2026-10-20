# `review.minors: fix` en el cierre de la revisión final (feature 0178)

Escenario `c1f` de la [batería de `sdd-verify`](batteries/sdd-verify/battery.md): el molde de `c1` (la 0010 en Native, ejes devueltos con 1 Important del eje Código y 1 Minor del eje Spec) con `"review": {"minors": "fix"}` en `sdd-kit.json`. `c1` es el control, sin la clave. Sonnet headless; salidas en `red-verify/`, `green-verify/`, `refactor-verify/` y `refactor2-verify/` de la [carpeta de la feature](../.docs/sdd/specs/20261020-112618-feature-0178-sdd-config-english/).

Rúbrica, fila `C1f Minor a la pasada`: falla si el Minor del eje Spec no entra en la única pasada de fix, si queda como `minor (deferred)` o si pregunta si lo arregla. Un Minor que abre la re-revisión no cuenta: es «What it leaves open», fuera de esta spec. La primera redacción de la fila no lo distinguía, y se desempató antes de recalificar.

| Fase | Kit | `c1f` | `c1` (control) |
| --- | --- | --- | --- |
| RED | `develop` | **1/2**: `c1f-1` leyó la clave del marcador, dedujo su sentido y arregló el Minor; `c1f-2` lo difirió y preguntó «si quieres que se arreglen, lo hago» | — |
| GREEN | rama, con la viñeta del Minor de «Closing the review» condicionada a la clave | **1/2**: `c1f-2` no cargó `sdd-verify`; cerró desde `sdd-implement`, cuya fila «I'll fix the minors too… Ledger them; the user decides» siguió | 1/2 en lo de esta spec (difiere el Minor 2/2); `c1-1` no despachó la re-revisión («es lo siguiente») |
| REFACTOR 1 | + la fila de `sdd-implement`: «…unless `review.minors: fix` asks. Otherwise ledger them.» | **1/2**: `c1f-2` sigue sin leer `sdd-kit.json` y copia el ejemplo de `sdd-implement` «minors → ledger as deferred» | — |
| REFACTOR 2 | + el ejemplo: «sdd-kit.json has no review.minors: minors → ledger as deferred» | **2/2**: los dos leen el marcador, meten el Minor en la única pasada («+1 minor sin RED: test desacoplado del orden»), sin preguntar, y despachan la re-revisión `sdd-kit:effort-high` + `opus` | ver abajo |

**Gastado en la Task 2**: 9 sujetos de `sdd-verify` y 6,00 $ (RED 2, GREEN 4, REFACTOR 4, más el control de abajo).

## Lectura

- El RED salió partido: la clave se explica sola, y un sujeto la aplicó desde el marcador. El otro siguió la regla de hoy («Minors never enter the fix pass») y preguntó. Con n = 2 el fallo existe, como el del ticket de la 0204 (dos features con pregunta y enmienda).
- El fallo del GREEN no estaba en `sdd-verify`, sino en lo que el sujeto leyó en su lugar: el cierre se hace a menudo desde `sdd-implement` (su ejemplo de flujo y su tabla de excusas) sin cargar `sdd-verify`. La regla escrita solo en `sdd-verify` no llegaba. Es la lección de la feature 0146 («una regla que solo vive en una referencia no se lee»): la frase tiene que estar donde el agente decide.
- `c1-1` sin re-revisión es una conducta del control que esta spec no toca. La re-revisión sí sale en `c1-2` y en los cuatro `c1f` de la rama.

## Control tras el REFACTOR

`c1-3`, con el kit final (las dos ediciones de `sdd-implement`): **1/1**. Difiere el Minor del eje Spec, despacha la única re-revisión `sdd-kit:effort-high` + `opus` y lleva lo abierto a «Minors diferidos». El cambio de `sdd-implement` no altera la conducta sin la clave.
