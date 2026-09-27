# RED — configuración personal y entrevista de claves (task 0061)

Baseline **sin** `sdd-config` ni `sdd-kit.local.json`: el kit en la base de la rama (`259e1b0`, copia con `git archive`). Sujetos Sonnet headless sobre el repo de juguete `salas` (molde de la 0044), sin `AskUserQuestion`: cada uno termina su turno en la primera pregunta. Lanzador, sujeto y salidas en [`red/`](../.docs/sdd/specs/20260924-220849-task-0061-local-config/red/).

**Previsión y techo comunes al RED y al GREEN** (declarados en la spec, decisión 16, antes del primer sujeto): 14 sujetos, ~10 $, ~2 h; techo 20 sujetos, 16 $, 3 h. `SUBJECT_CAP=20`, `COST_CAP=16` y fichero `stop` en `red/run.sh`.

**Gastado en el RED**: 7 sujetos, 2,13 $, ~12 min de reloj en paralelo.

## Escenarios

| Id | Petición | Qué se mide |
| --- | --- | --- |
| c1 | «Soy Marta… prefiero `pair` y que me arranques el entorno antes del guion de pruebas. El resto del equipo sigue como está. Déjamelo configurado» | `sdd-kit.json` intacto · preferencia en un fichero que el kit lee · sin nombre guardado · fuera de git |
| c2 | `sdd-start-task` para la 0012, con `.docs/sdd/sdd-kit.local.json` = `pair` + `merge.noFf: false` + `ids.mode: tracker` | perfil vigente `pair` y de dónde sale · aviso por cada clave de política, con su nombre |
| c3 | «Revisa la configuración del kit y ponla al día», con un `sdd-kit.json` sin `execution` ni `merge.push` | enseña lo que hay antes de preguntar · una sola pregunta cerrada, recomendada primero · no escribe claves sin respuesta |
| c4 | «Actualízame al kit» desde un marcador v1.1.0 (control de no regresión) | una sola pregunta, con su recomendación · salta lo que ya existe |

## Resultados

| Medida | c1-1 | c1-2 | c2-1 | c2-2 | c3-1 | c3-2 | c4-1 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `sdd-kit.json` intacto | ✅ | ✅ | — | — | ✅ | ✅ | ✅ |
| Preferencia en un fichero que el kit lee | ❌ `CLAUDE.local.md` | ❌ `CLAUDE.local.md` | — | — | — | — | — |
| Sin nombre de persona guardado | ✅ | ✅ | — | — | — | — | — |
| Fuera de git | ✅ `.git/info/exclude` | ✅ `.git/info/exclude` | — | — | — | — | — |
| Perfil vigente del fichero local, con su nivel | — | — | ✅ | ✅ | — | — | — |
| Aviso de las claves de política ignoradas | — | — | ❌ | ❌ (da `ids.mode` por válido) | — | — | — |
| Enseña lo que hay antes de preguntar | — | — | — | — | parcial | parcial | parcial |
| Una sola pregunta, recomendada primero | — | — | — | — | ✅ | ✅ | ✅ |
| No escribe claves sin respuesta | — | — | — | — | ✅ | ✅ | ✅ |

## Lo que dicen los sujetos

- c1-1: «el kit no tiene un mecanismo de preferencias por persona». Guarda `pair` en `CLAUDE.local.md` y aclara que «tu preferencia va por task (`profile: pair` en el frontmatter), no como cambio global».
- c1-2: «El kit no tiene un nivel de perfil por persona, así que `CLAUDE.local.md` es la vía que queda sin afectar al resto». Es la misma salida que encontró el compañero en su proyecto: un fichero propio que ninguna skill lee. En una task nueva, el perfil sigue saliendo del proyecto.
- c2-2: «El local pone `ids.mode: tracker`. La rama ya existe con id `0012`, así que no afecta a esta task». Trata una clave de política del fichero local como válida. Ninguno de los dos nombra `merge.noFf`.
- c3-1 y c3-2 invocan `sdd-init-brownfield`, entran por la migración v1.2.0 y preguntan `merge.push` primero, con la recomendación del bloque de `control-profiles.md`. Enseñan la lista de lo que falta y lo que ya está, pero no el valor de cada clave ni el default que rige.

## De dónde sacó cada sujeto la conducta

- **Precedencia del fichero local (c2, 2/2 limpio)**: de una fuente incidental. Los dos listaron `.docs/sdd/`, vieron `sdd-kit.local.json` y lo leyeron por el nombre. Ninguna skill lo nombra. Sin el fichero delante (una task en otro worktree, un sujeto que no lista la carpeta), nada lo lleva a buscarlo. No se recorta: la precedencia es contrato y se escribe.
- **Una pregunta por turno y la recomendada primero (c3, c4, 3/3 limpio)**: de la fuente que se va a mover. El README de migraciones y el bloque «Preguntas de las claves de control» de `control-profiles.md` lo dicen, y los tres llegaron por `sdd-init-brownfield`. No es incidental, pero la fuente pasa a `sdd-config`. Se conserva literal en el catálogo y se repite en el GREEN como control.
- **No commitear lo personal (c1, 2/2)**: criterio propio, sin fuente del kit. No se escribe como prohibición. Basta con el contrato (la línea en `.gitignore`), y se mide en el GREEN.

## Qué guía se escribe

| Guía | Motivo |
| --- | --- |
| `.docs/sdd/sdd-kit.local.json`, sus tres claves y la precedencia en `control-profiles.md` | c1 2/2 al fichero que nadie lee; c2 limpio solo por incidente |
| El aviso por clave no admitida | c2 0/2, y 1/2 aplica una de política |
| `sdd-config`: enseñar cada clave con su valor, su fichero o el default antes de preguntar | c3 y c4 parciales 3/3 |
| `sdd-config` como destino de «configúramelo solo para mí» (`description`) | c1 2/2 resuelto fuera del kit |
| Una pregunta por turno y la recomendada primero | sin guía nueva: el catálogo lleva la recomendación, como hoy. Control en el GREEN |
| No commitear el fichero local | sin guía nueva, más allá del `.gitignore`. Control en el GREEN |

Nota de la fixture: el marcador de `salas` dice `2.0.0`, por encima de la mayor migración (`v1.2.0`), y 2 de 2 en c3 proponen bajarlo. Es un artefacto del molde y no se mide.
