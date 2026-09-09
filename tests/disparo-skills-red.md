# Evidencia RED — disparo de las skills (2026-09-09)

Baseline de la task [disparo-skills](../.docs/sdd/specs/20260909-162118-task-0000-disparo-skills/spec.md) (T13). Pregunta: cuando el dev dice «implementa la task 77 del roadmap» **sin nombrar ninguna skill**, ¿Claude Code invoca `sdd-kit:sdd-start-task` por su `description`? Si dispara, no se toca ni la `description` ni el `CLAUDE.md` que escriben `init-*`.

## Método

Sujetos Sonnet en sesión headless con el kit cargado como plugin desde una copia limpia (`--plugin-dir`, `--add-dir`), `stream-json` para ver los `tool_use` de `Skill`. Fixture "Ledgerly-rev" en su estado `e1` (task 77 pendiente en el roadmap; `CLAUDE.md` del proyecto **sin ninguna mención a skills**: solo «lee `.docs/sdd/` antes de tocar nada»). Petición: «Implementa la task 77 del roadmap. Soy el dev-lead: apruebo de antemano lo que propongas y no estaré para nada más en esta sesión; si necesitas mi aprobación para algo, déjalo en espera.»

## Resultados

| | A | B |
| --- | --- | --- |
| Primera skill invocada | `sdd-kit:sdd-start-task` | `sdd-kit:sdd-start-task` |
| Después | `brainstorming` → `sdd-templates` → `writing-plans` → `subagent-driven-development` → `using-git-worktrees`: spec y plan escritos (dev-lead preaprobado), task implementada y revisada, y **parada en el paso 7** («queda en espera de tu validación: no la cierro sin que confirmes qué probaste») | `superpowers:brainstorming` (clasificó architectural, primera pregunta de diseño, en espera) |
| Código tocado | en su rama de feature, tras spec y plan | ninguno |
| Coste / turnos | 2,97 $ / 67 | 0,53 $ / 32 |

## Conclusión

**La `description` dispara 2/2** con la petición más común del equipo y sin ninguna pista en el `CLAUDE.md` del proyecto. No se afina la `description` ni `init-*` escribe una regla en el `CLAUDE.md` (decisión 2 de la spec: entra solo lo que haga falta). El hook de sesión queda fuera sin discusión.

Lo que sí entra es forma: el Gate 1 de `sdd-start-task` describe ahora sus dos vías (invocación sola → contexto y parar; con enunciado → contexto y seguir), que es exactamente lo que A y B hicieron por la segunda vía y esta sesión hizo por la primera.

Colateral: A es el primer sujeto que atraviesa el flujo completo del kit tras T11 sin que nadie nombre una skill —enrutado, review de spec, plan por decisiones, despachos con la cabecera de restricciones y gate de validación— y se detiene donde el kit dice que hay que detenerse. Es la verificación de extremo a extremo de la release, gratis.

Trampa de método anotada: la variación entre A (flujo entero) y B (parada en la primera pregunta de `brainstorming`) es el camino de pregunta ya visto en T11 E5b; con «apruebo de antemano lo que propongas» A lo interpretó como licencia para decidir y B no. Ninguna de las dos es fallo del disparo.
