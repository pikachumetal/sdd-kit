# RED previo a la spec — task 0008

Regla de `tech-stack.md` («Un baseline limpio no reproduce los fallos de sesiones largas»): cada frente de campo se reproduce antes de presentar la spec. El dev-lead eligió medir con sujetos solo el frente de la oferta de lite (2026-09-21). Los frentes estructurales se verificaron leyendo el kit de la rama.

## Frente de conducta: ¿se ofrece el modo lite?

- **Molde**: `mold/`, copia del molde m5 de la task 0004 (CLI de reservas de salas con test), con la fila 0009 en el roadmap: validar el formato de la franja horaria. Cumple las cinco condiciones de `modo-lite.md` y no es un patch (hay que decidir qué franja es válida y el mensaje).
- **Kit**: copia limpia de `skills/` y `.claude-plugin/` de `feature/0008` a 2026-09-21 (sin cambios de la task).
- **Lanzador**: `run.sh` → `subject.sh`, dos turnos. T1: «Arranca la task 0009 del roadmap con sdd-start-task.» T2: «Toma tú las decisiones que falten, lístalas en la spec y déjamela lista para aprobar.»
- **Coste**: 1,59 $ (T1 0,33 + 0,28; T2 0,50 + 0,48).

| Sujeto | T1: ¿ofrece lite? | ¿La oferta va sola? | T2: modo de la spec |
| --- | --- | --- | --- |
| 1 | Sí, cita las cinco condiciones una por una | No: en el mismo turno hace la primera pregunta de diseño (forma de `reservar`) | full — «el predicado se cumple, pero no lo has confirmado» |
| 2 | Sí, cita las cinco condiciones una por una | Sí: cierra con «¿Confirmas modo lite?» | full — «no confirmaste lite» |

**Veredicto**: el baseline **no reproduce** el fallo de campo («ninguno de los dos lo vio aparecer»): 2/2 ofrecen lite en el primer turno. Va a deuda como **posible falso negativo**: en campo la sesión era larga y con contexto cargado. Queda un hallazgo de forma: cuando el usuario contesta a otra cosa, la oferta se pierde y la task sigue en full (2/2), y uno de los dos mezcló la oferta con una pregunta de diseño. Eso encaja en la visión 1.2.0 («la primera pregunta confirma carril y modo y ofrece lite», una sola pregunta por turno), no en un arreglo de la oferta.

## Frentes estructurales (verificados por lectura en `feature/0008`)

| Frente | Evidencia |
| --- | --- |
| «Decide con el usuario» contra «rulings, not stalls» | `skills/sdd-start-task/SKILL.md:48` frente a `superpowers 6.3.0 subagent-driven-development/SKILL.md:19`; `overrides-superpowers.md` no tiene fila que arbitre |
| Sin estado de validación diferida | `skills/sdd-end-task/SKILL.md:16` (validado o EN ESPERA); `walkthrough-template.md:13` («inmutable») y `:44` («sin validación no hay cierre») |
| Review de spec no es «ninguna por defecto» | `skills/sdd-start-task/references/review-spec.md:20-22`: con dos señales propone un revisor |
| Merge preguntado aunque ya esté ordenado | `skills/sdd-end-task/SKILL.md:31` («decidir merge/PR con el usuario») |
| Gate 1 con la rama ya nombrada | `skills/sdd-start-task/SKILL.md:20` |
| «Aprobación explícita» sin definir | `skills/sdd-start-task/SKILL.md:37`: el gate dice cuándo parar, no qué respuesta cuenta |
| Sin claves de control | `.docs/sdd/sdd-kit.json` solo lleva `version`, `channel`, `updated`, `ids`, `release` |
| Merge «SIEMPRE decisión del usuario» | `constitution.md` Art. IV: choca con «el merge se hace según la política del proyecto sin volver a preguntar» de la visión |
