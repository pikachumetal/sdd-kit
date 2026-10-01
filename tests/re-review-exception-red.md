# RED — la excepción de re-revisión y la pasada de fix partida (patch 0125)

Pasos 6 y 7 de `sdd-start-feature` con el kit de `develop` en `a5197b79`. Lanzador de referencia (`tests/headless/run.sh`) con [`red/subject.sh`](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/subject.sh), sujetos Sonnet headless aislados (`SUPERPOWERS_DIR`, superpowers 6.4.2), 2026-09-30. El molde es el repo `salas` de la 0091: feature 0012 en Native, perfil `delegate`, con una CLI (`src/cli.js`) fuera del Scope y un `cspell.json`. El hook de la 0085 deniega `Agent` y guarda el encargo. Salidas en [`red/out/`](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/).

## Fila 1 — La excepción se define por la ruta

Escenarios, los tres tras una pasada de fix cerrada y apuntada:

- `a1` (ticket de la feature 0027 del template, §1): un commit de 15 líneas, 11 en `docs/uso.md` y 4 de comentario en `src/slots.js`.
- `a2` (tickets de las features 0096 §4, 0113 §1 y 0115 §2): un commit de 15 líneas de una tabla de pruebas manuales en `tests/franja-manual.md`.
- `a3` (ticket de la feature 0038 de document-manager, §3): un commit que añade dos palabras a `cspell.json`.

Criterio: (a) no despacha revisor y lo anota como `revisado en el hilo`.

| Sujeto | (a) |
| --- | --- |
| [a1-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/a1-1.tools.txt) | ❌ `Agent` `sdd-kit:effort-high` + `opus`, «Re-revisión 0012 ce5ebbc..9530688» |
| [a1-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/a1-2.tools.txt) | ❌ el mismo despacho, «tramo 8cadc83..051b065» |
| [a2-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/a2-1.tools.txt) | ❌ el mismo despacho, «768bf6b..af12c91» |
| [a2-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/a2-2.tools.txt) | ❌ el mismo despacho, «tramo docs» |
| [a3-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/a3-1.tools.txt) | ❌ el mismo despacho, «26dbbf0..d1b4c73» |
| [a3-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/a3-2.tools.txt) | ❌ el mismo despacho, «f52284c..92faed2» |

**Falla 0/6.** Los sujetos siguen la letra: el commit no tiene «todos sus ficheros bajo `.docs/` o `*.md` de la raíz». Es el coste de los seis casos de campo. El dev-lead eligió el predicado por el diff sin diccionarios, así que `a3` pasa a control del GREEN: el diccionario sigue despachando. El tope de 20 líneas se mantiene, y los dos commits de la 0113 (~35 y 21 líneas) siguen fuera.

Coste: 2,35 $ (a1: 0,36 + 0,38 $; a2: 0,44 + 0,38 $; a3: 0,37 + 0,41 $).

## Fila 2 — La pasada de fix partida por una pregunta al dev-lead

Escenarios (ticket de la feature 0026 del template, §1; ticket de la feature 0115, §2):

- `b1`: la revisión final devuelve dos Important. El primero se arregla dentro del Scope, y el arreglo del segundo toca `src/cli.js`, que la spec deja en «No entra». Se pide hacer la pasada de fix y seguir con el paso 7.
- `b2`: el primero está arreglado en un commit y el segundo, tras aprobar el dev-lead la enmienda, en otro. No hay línea `Pasada de fix:`. Se pide presentar la validación.
- `b3`: como `b2`, pero con la línea parcial que los sujetos de `b1` apuntaron antes de preguntar (`Pasada de fix: <primer sha>, 1 hallazgo…; Important 2… EN ESPERA`).

Criterio: (a) en `b1`, qué deja apuntado al parar; (b) en `b2` y `b3`, no despacha re-revisión y la línea `Pasada de fix:` lleva el último commit de fix.

| Sujeto | Resultado |
| --- | --- |
| [b1-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/b1-1.texts.txt) | (a) commitea el primer arreglo, apunta la pasada parcial, pregunta y anuncia «hace falta re-revisión de ese tramo» |
| [b1-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/b1-2.texts.txt) | (a) lo mismo: «Pasada de fix (parcial)», pregunta y anuncia «la re-revisión acotada» |
| [b2-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/b2-1.texts.txt) | ✅ «Los dos commits posteriores… son la pasada de fix de la propia revisión final»; `Pasada de fix: <segundo sha>, 2 hallazgos` |
| [b2-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/b2-2.texts.txt) | ✅ lo mismo |
| [b3-1](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/b3-1.texts.txt) | ✅ reescribe la línea parcial al segundo sha con «2 hallazgos» y no re-revisa |
| [b3-2](../.docs/sdd/specs/20260930-170633-patch-0125-re-review-exception-by-change/red/out/b3-2.texts.txt) | ✅ lo mismo |

**`b2` y `b3` pasan 4/4.** El anuncio de `b1` no llega a despacho: con los dos arreglos delante, los cuatro sujetos juntan la pasada, también con la línea parcial escrita. Los dos de `b3` empezaron anunciando la re-revisión y la descartaron al releer el paso 7. El baseline no muestra el fallo, así que la guía no se escribe (Art. I). La fila 2 queda re-medida en el roadmap como posible falso negativo: los casos de campo salieron con sesiones largas y un sujeto recién arrancado no los reproduce.

Coste: 1,73 $ (b1: 0,36 + 0,30 $; b2: 0,27 + 0,26 $; b3: 0,26 + 0,29 $).

## Total

12 sujetos, 4,08 $.
