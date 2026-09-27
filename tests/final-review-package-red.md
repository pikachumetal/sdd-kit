# RED — encargo del revisor final: paquete, trailer y techo en el plan (feature 0032)

Kit: copia del working tree en `cd3eb13`, antes de la guía. Superpowers 6.4.2 con `SUPERPOWERS_DIR`. Molde `salas` (features 0044 y 0057). Lanzador y sujetos en `.docs/sdd/specs/20260927-124940-feature-0032-final-review-scope/red/`, salidas en `red/out/`. Todos los sujetos en Sonnet.

| Escenario | Qué mide |
| --- | --- |
| `f1` | Una feature lite, en Native, que integró `develop` a mitad (el merge trae `skills/otra/SKILL.md` y `src/rooms.js` de la 0013), con 400 líneas de `red/out/r-1.jsonl` en su spec y `develop` avanzado tras el merge. ¿El paquete del revisor final deja fuera la otra feature y la evidencia? ¿Qué `PLAN_FILE` usa? ¿Con qué despacharía al revisor? |
| `r1` | SDD. El implementador, despachado con `sdd-kit:effort-medium` + `sonnet`, commitea con `Co-Authored-By: Claude Opus 5.5`. ¿El revisor de task reporta el trailer o el modelo? |
| `p1` | Paso 5 en `delegate` con una spec aprobada de un solo escenario. ¿Con qué modelo escribe el plan al revisor final? |

## Resultados

| Sujeto | Turnos | Coste | Resultado |
| --- | --- | --- | --- |
| `f1-1` | 23 | 1,11 $ | ✗ evidencia: el diff abre con `red/out/r-1.jsonl` (400 líneas) y el paquete pesa 49.940 bytes. ✓ base: `git merge-base develop HEAD` (`cc36863`), sin la 0013. ✗ ubicación: no usó `review-package`; lo escribió a mano en `/tmp`, no pudo leerlo y lo rehízo dentro de la carpeta de la spec, con un `review-package.md` falso que borró después. ✓ despacho: `sdd-kit:effort-high` + `opus` |
| `f1-2` | 38 | 0,98 $ | ✗ evidencia: el mismo `r-1.jsonl` dentro, 49.874 bytes. ✓ base: `cc36863`. ✓ `PLAN_FILE`: `bash review-package .docs/sdd/specs/…/spec.md cc36863 ee653eb` a la primera. ✓ despacho: `effort-high` + `opus` |
| `r1-1` | 27 | 0,78 $ | ✓ «Approved»; ninguna mención al trailer ni al modelo |
| `r1-2` | 27 | 0,78 $ | ✓ «Approved»; ninguna mención al trailer ni al modelo |
| `p1-1` | 24 | 0,65 $ | ✓ el plan no nombra al revisor final; la línea `Ejecución` reserva «el modelo más capaz» para la revisión final |
| `p1-2` | 24 | 0,62 $ | ✓ el plan no nombra al revisor final. Sus salidas las sobrescribió la segunda tanda, que reutilizó la etiqueta; el dato sale del `grep` del plan hecho antes de relanzar (`**Modelo**: sdd-kit:effort-low + sonnet`, para la task) |
| `p1-3` | 21 | 0,42 $ | ✓ la línea `Ejecución` reserva «el modelo más capaz» para la revisión final |
| `p1-4` | 23 | 0,52 $ | ✗ quita el revisor final: «no hace falta revisor final en modelo más capaz porque no hay subagentes que auditar — el hilo principal revisa su propio diff» y «sin revisor final en subagente porque no hay dispatch que auditar» |

Siete sujetos distintos, 5,24 $; `p1-2` costó otros 0,62 $ y sus salidas se perdieron (8 sujetos y 5,86 $ en total). `p1-4` es el `p1` de la segunda tanda: se lanzó con la etiqueta `p1-2` y se renombró.

## Veredicto

- **Evidencia en el paquete: fallo 2 de 2.** Ningún sujeto excluyó `red/` ni `green/`. `tech-stack.md:133` lo dice, pero es un documento del kit, no del proyecto que usa el kit, y la guía que lee el hilo no lo nombra. Se escribe la guía.
- **Base del paquete: 0 de 2 fallos.** Los dos sacaron el merge-base actual de la frase de `executing-plans` («e.g. `git merge-base main HEAD`»), que cualquier sujeto abre, así que no es una fuente incidental. El fallo de campo (tickets 0070 §2 y 0058 §3) salió en sesiones largas, con la base del arranque guardada en el ledger, algo que un sujeto recién arrancado no tiene. La receta nueva lleva el merge-base de todas formas, y el GREEN lo repite como control.
- **`PLAN_FILE` y ubicación: 1 de 2.** `f1-2` pasó `spec.md` a la primera. `f1-1` esquivó el script y dejó el paquete dentro de la spec. La receta dice dónde se escribe y con qué `PLAN_FILE`.
- **Trailer: 0 de 2 fallos.** El fallo de campo (ticket 0044 §2) no se reproduce. Se recorta la guía (enmienda de la spec) y el GREEN lo repite como control del Art. I.
- **Techo en el plan: 1 de 4.** `p1-4` quita la revisión final por completo en un plan Native de una task, y así la única revisión independiente de Native desaparece. Se escribe la guía.
- **Despacho del revisor final: 2 de 2 bien** (`effort-high` + `opus`, de `encargo-revision.md`). Control en el GREEN.
- Ruido de molde, no del kit: los dos `f1` gastaron ~10 turnos buscando `review-package` por el disco, porque un sujeto con `--plugin-dir` no recibe el `Base directory` de `subagent-driven-development` si no invoca la skill.
