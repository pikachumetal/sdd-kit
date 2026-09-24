# GREEN — configuración personal y entrevista de claves (task 0061)

Mismos escenarios y sujetos que el [RED](sdd-config-red.md), con el kit de la rama en `4e39bac`: `sdd-config`, el fichero local en `control-profiles.md` y las init y la v1.2.0 invocando `sdd-config`. Salidas en [`green/out/`](../.docs/sdd/specs/20260924-220849-task-0061-local-config/green/out/).

**Gastado en el GREEN**: 7 sujetos y 1,69 $. **Campaña entera**: 14 de 20 sujetos, 3,82 $ de 16 $ y ~30 min de reloj. Dentro de la previsión (14 sujetos, ~10 $, ~2 h), sin REFACTOR.

## Resultados frente al RED

| Medida | RED | GREEN |
| --- | --- | --- |
| c1 · `sdd-kit.json` intacto | 2/2 | 2/2 |
| c1 · preferencia en un fichero que el kit lee | 0/2 (`CLAUDE.local.md`) | **2/2**: `.docs/sdd/sdd-kit.local.json` = `{"control": {"profile": "pair"}, "validation": {"startEnvironment": true}}` |
| c1 · `.gitignore` con la línea y el fichero local sin commitear | 2/2 por otra vía (`.git/info/exclude`) | 2/2 |
| c1 · sin nombre de persona guardado | 2/2 | 2/2 |
| c1 · `sdd-config` se dispara sin nombrarla | — | 2/2 («Skill `sdd-kit:sdd-config` aplica: preferencia personal de pair, sin cambiar la del equipo») |
| c2 · perfil vigente del fichero local, con su nivel | 2/2 (incidental) | 2/2 («Sale de `.docs/sdd/sdd-kit.local.json` (nivel persona) y pisa el `delegate`…») |
| c2 · aviso literal por cada clave de política | 0/2 | **2/2**, `merge.noFf` e `ids.mode` con la línea del contrato |
| c3 · enseña lo que hay antes de preguntar | parcial 2/2 | **2/2**: tabla clave · valor · fichero, con «falta; rige `<default>`» |
| c3 · una sola pregunta cerrada, recomendada primero (control) | 2/2 | 2/2 |
| c3 · no escribe claves sin respuesta (control) | 2/2 | 2/2 |
| c4 · una sola pregunta, con su recomendación (control) | 1/1 | 1/1, con el texto y el motivo del catálogo de `sdd-config` |
| c4 · la migración añade la línea del fichero local a `.gitignore` | — | 1/1 |

## Observaciones

- **c1 promete una conducta que aún no existe.** Los dos sujetos dicen a la persona «te arranco el entorno antes de darte el guion de pruebas». La clave se guarda bien, pero el paso 7 de `sdd-start-task`, que la leería, es de la 0060 y esta task no lo toca (spec, decisión 7). Hasta que se cablee, la promesa no se cumple. La fila de deuda la recoge.
- **c4 no invoca `sdd-config` con el tool `Skill`**: sigue la migración, lee el catálogo por el enlace y hace la pregunta con su texto y su recomendación. La conducta medida es la del control. La diferencia no cambia la salida.
- **c3 (2/2) añade un matiz propio**: sin remoto, desaconseja `merge.push: true` después de recomendarlo. No viene del catálogo, y es razonable: no se escribe guía.
- **c1-1 no enseña la tabla** antes de escribir, porque no hace ninguna pregunta: la petición ya traía las dos respuestas. c1-2 sí la enseña. La regla del paso 1 va ligada a la primera pregunta, así que no es un fallo.
