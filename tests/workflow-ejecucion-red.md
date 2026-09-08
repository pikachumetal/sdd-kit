# Evidencia RED — política de ejecución y modelos (2026-09-08)

Baseline de la task [workflow-ejecucion](../.docs/sdd/specs/20260908-095857-task-0000-workflow-ejecucion/spec.md) (T3). Sonnet, fixture desechable "Cobra", 7 runs en dos tandas. Estado final verificado en disco.

## Fixture

Proyecto "Cobra" (gestión de cobros, Node 22, sin dependencias), construido el 2026-09-08. Molde sin `.git`; una copia por run con `git init` + `develop` + commit inicial.

- `.docs/sdd/` completo. `constitution.md` con **Art. II — testing obligatorio** («todo cambio de comportamiento lleva test automático»). `tech-stack.md` declara `node --test` y afirma que la suite está en verde: **2/2 tests reales pasando** antes de cada run.
- `src/billing/invoice.js` con `totalCents` y `withSurcharge`, que opera en **milésimas sobre céntimos** con `Math.round`.
- Spec del ticket 42 **aprobada**, y `plan.md` **multi-task de 3 tasks** con bloque "Restricciones globales". Las restricciones se enuncian **una sola vez**: ninguna task las repite (verificado: "céntimos" aparece 1 vez en todo el plan).

## Escenarios

| Id | Qué se pide | Qué mide |
| --- | --- | --- |
| R1a, R1b | «Implementa el plan que hay en `<carpeta>/plan.md`» | ¿Delega en subagentes? ¿Elige o declara modelo? ¿Hace TDD sin que nadie lo nombre? |
| R3b | «El ticket 42 ya está implementado y probado, en la rama `feature/42`. Ciérralo» | ¿Pide code-review antes de cerrar? |
| R4b, R4c | Al ejecutor se le entrega **solo el texto de la Task 2**; el `plan.md` está borrado de su copia | ¿Respeta restricciones globales que su task no repite? (residual de T1) |

## Fallos observados

### F1 — Nadie delega: la ejecución es en línea (2/2)

`r1a` y `r1b` implementaron las tres tasks en su propia sesión, invocando `superpowers:executing-plans`. Ninguno despachó un subagente.

No es desobediencia: es **obediencia a la skill vigente**, que manda ejecución en línea y marca `subagent-driven-development` como "se evita". `r1a` lo declara: *"Leídos references/… para confirmar convenciones (sin worktrees gestionados por el kit, **ejecución en línea sin subagentes**)"*.

Lectura para el Art. I: la conducta la gobierna la skill, no el criterio del ejecutor. Es la condición que hace que invertir el default sea una intervención con efecto esperable — y a la vez la prueba de que hoy el kit produce lo contrario de lo que el equipo necesita.

### F2 — El modelo no se elige ni se declara nunca (2/2)

En ninguno de los dos runs aparece una sola mención al modelo con el que se ejecuta cada task, ni una decisión de coste. El plan no lo pide y el agente no se lo plantea. Sin campo en el plan, la asignación de modelo simplemente no ocurre como decisión: ocurre por defecto del harness.

### F3 — El cierre no pide code-review (1/1)

`r3b` ejecutó el Definition of Done completo y bien: pre-check de coherencia, `npm test` verificado por él mismo (11/11), walkthrough distinguiendo lo verificado de lo reportado, fila en `estimation-log.md`, roadmap actualizado, `superpowers:finishing-a-development-branch` invocada y **merge no ejecutado** porque la constitution reserva esa decisión al dev-lead.

**Cero invocaciones de `requesting-code-review`** (verificado en el log de acciones y en el informe). El paso no existe en la skill, así que no ocurre.

### F4 — El ejecutor aislado NO hereda las "Restricciones globales" (2/2) — residual de T1

`r4b` y `r4c` recibieron únicamente el texto de su task, con el `plan.md` eliminado de su copia. Las restricciones globales de esa fixture incluían: **«Toda función nueva se documenta con un bloque JSDoc en castellano justo encima, con `@param` y `@returns`. El código antiguo no lo lleva; a partir de este plan es obligatorio.»**

Resultado en disco: **0 bloques JSDoc en 2/2 runs.**

La restricción se eligió deliberadamente **no inferible del código**: el fichero existente tiene cero JSDoc, así que no había nada que imitar. Es la corrección de un primer intento fallido —ver "Escenarios descartados"— y es lo que convierte este fallo en evidencia real.

`writing-plans` 6.3.0 afirma que las "Restricciones globales" son heredadas implícitamente por toda task. **Medido: "implícitamente" no llega al ejecutor que solo ve su task.**

## Positivos que NO requieren guidance

### El TDD ya ocurre sin nombrarlo (2/2) → la guidance de TDD NO se escribe

`r1a` y `r1b` escribieron el test antes que la implementación en las tres tasks, verificaron el RED y solo entonces implementaron. `r1b` fue más lejos e **invocó `superpowers:test-driven-development` por su cuenta**, sin que nada en su encargo la mencionara.

La causa está en la fixture, no en el azar: el **Art. II de la constitution del proyecto** dice «todo cambio de comportamiento lleva test automático». Un predicado de proyecto ya empuja la conducta.

Consecuencia (Art. I): **el paso que iba a nombrar `test-driven-development` en `plan-template.md` no se escribe.** Guidance sin baseline que la respalde. Es el mismo desenlace que tuvieron dos ítems de T1.

### El resto del Definition of Done aguanta

`r3b` no mergeó pese a que nadie se lo impedía, citando la constitution del proyecto. Detectó además que el `plan.md` de la fixture carecía del bloque de estimación obligatorio y lo registró como desviación de proceso en vez de inventarse un estimado.

### Las restricciones con reflejo en el código sí se respetan

En la primera tanda, `r4` respetó "importes en céntimos enteros" — pero **por imitación, no por herencia**: *"con el mismo estilo aritmético que la función hermana `withSurcharge`"*. No cuenta como positivo del ejecutor aislado; cuenta como defecto del escenario, corregido después.

## Escenarios descartados y por qué

- **R2 (TDD como escenario propio)**: era idéntico a R1 —Cobra ya tiene tests ejecutables—, así que se fundió con él y el presupuesto se gastó en una repetición (`r1b`). Medir dos veces lo mismo no es medir dos cosas.
- **R3 primera versión**: la copia no tenía el ticket implementado, pese a que el prompt afirmaba que sí. El agente hizo el pre-check, buscó en `git reflog`, `git stash list` y en todo el árbol, y **se negó a cerrar** con la evidencia delante. Conducta correcta, escenario inválido: se rehízo como `r3b` sobre una copia con el trabajo real hecho.
- **R4 primera versión**: la restricción elegida ("importes en céntimos") ya estaba encarnada en el código existente, así que el escenario no podía distinguir herencia de imitación. Se rehízo con una restricción no inferible (JSDoc).

## Conclusión — qué guidance queda respaldada

| Guidance candidata | Veredicto |
| --- | --- |
| `subagent-driven-development` como default en `sdd-start-task` | **Se escribe** (F1) |
| Campo `Modelo` por task + política de modelos en Restricciones globales | **Se escribe** (F2) |
| `requesting-code-review` en el checklist de `sdd-end-task` | **Se escribe** (F3) |
| Nombrar `test-driven-development` en `plan-template.md` | **NO se escribe** — el baseline ya lo hace (Art. I) |
| Traspaso de las "Restricciones globales" al ejecutor | **Se escribe**, y cambia de forma respecto a lo previsto (F4) |

### El hallazgo que cambia el diseño

La spec asumía que `Ejecución` podía aparecer solo cuando una task se desvía, porque el ejecutor heredaría el default de las "Restricciones globales". **F4 lo desmiente.** Si no hereda el JSDoc, tampoco heredaría el modo de ejecución ni el modelo.

Decisión tomada tras presentar el hallazgo al dev-lead, que delegó la elección: **la obligación cae en quien despacha, no en quien ejecuta.** `sdd-start-task` pasará a exigir que las "Restricciones globales" viajen en el encargo de cada subagente. Motivo: repetir campos por task arregla los dos campos que caben en una línea y deja huérfanas las demás restricciones (JSDoc, dependencias, naming), además de crear las dos copias divergentes que el Art. VIII enseñó a evitar. Punto débil asumido: B depende de que quien despacha cumpla, lo cual es gobernable por skill y se medirá en el GREEN con este mismo escenario.
