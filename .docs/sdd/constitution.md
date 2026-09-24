# Constitution — sdd-kit

Principios no negociables del kit. La constitution manda sobre cualquier spec.

## Art. I — Ley de hierro de skills

Ninguna skill nueva ni edición de una existente sin test que falle primero: baseline sin la skill (RED, con racionalizaciones textuales documentadas) → skill dirigida a esos fallos (GREEN, mismos escenarios) → cierre de huecos. La evidencia vive en `tests/<skill>-red.md` y `tests/<skill>-green.md`. Aplica también a recortes, traducciones y "pequeños ajustes". Si el baseline no exhibe el fallo, no se escribe la guidance; **antes de recortar por un baseline limpio, se mira de dónde sacó cada sujeto la conducta**: si la sacó de una fuente incidental, que otro sujeto puede no abrir (la ayuda de un script, un fichero leído por azar), se lanza una tanda más antes de recortar (task 0059: 3/3 limpio con un sujeto por escenario, 1/6 con uno más). **El recorte quita la guía, no la medición**: un requisito recortado por el RED se repite en el GREEN como control de no regresión, porque la guía nueva de otro requisito puede crear la presión que el baseline no tenía (task 0008: el recortado falló 1/2 en el GREEN; decisión del dev-lead, 2026-09-22).

Para un **recorte o reestructuración de una skill existente**, el baseline vacío no es el test: una versión recortada puede batir a un baseline sin skill y aun así ser peor que la versión vigente. El test válido es el **A/B de no-regresión** — control (la versión vigente) contra tratamiento (la versión recortada), mismos escenarios —, y el corte se publica solo si el tratamiento reproduce la conducta del control en TODOS ellos. La evidencia vive en `tests/<skill>-ab.md`. El RED contra baseline vacío sigue siendo el test de la guidance nueva.

**La campaña se dimensiona al cambio.** Un cambio de redacción que no añade ni quita conducta (una frase, un ejemplo, una aclaración) lleva RED y GREEN con un sujeto cada uno por escenario afectado; una conducta o un paso nuevos llevan la campaña completa. **Antes de lanzarla se declara la previsión** —sujetos, minutos y coste—, y si la campaña la supera, una tanda más de REFACTOR incluida, se para y decide el dev-lead: seguir, cerrar con lo medido y dejar lo pendiente como deuda, o recortar el alcance. **La previsión cubre la campaña entera**: el RED previo a la spec y el GREEN comparten previsión y techo, que se declaran antes del primer sujeto y la spec repite en sus decisiones (task 0039). La 0040 gastó ~3,5 h, 44 sujetos y 15,29 $ en un cambio de ~30 min de texto sin que nadie avisara del coste (decisión del dev-lead, 2026-09-23).

## Art. II — La forma sigue al fallo

- Fallo de disciplina (sabe la regla y la salta bajo presión) → prohibición + tabla de racionalizaciones + red flags.
- Fallo de forma (cumple pero con la forma equivocada) → receta/contrato de cómo ES el output.
- Comportamiento condicional → predicado observable ("si existe `.docs/sdd/estimation.md`…"), nunca cláusulas de excepción.

## Art. III — Idioma

Texto humano (skills, docs, tests, commits-cuerpo) en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case. No se traducen las skills al inglés por ahorro de tokens: el ahorro es marginal y rompe la validación y la legibilidad del equipo (decisión 2026-07-09).

## Art. IV — Convenciones que el kit fija a los proyectos

`.docs/sdd/` como raíz de artefactos; naming `<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>` en UTC con el id que fija el modo declarado en `.docs/sdd/sdd-kit.json` (`ids.mode`): en modo `tracker`, el id del gestor de tickets (0000 si no hay); en modo `sequence`, el id de la secuencia única de tasks y patches del proyecto; artefactos de release (acta, release notes) en `.docs/sdd/releases/vX.Y.Z/`; módulos por predicado observable; el merge a la rama de integración sigue la política que el usuario declara en `sdd-kit.json` y que aplican las skills que la leen (el cierre de task y el de patch); sin política declarada, lo decide el usuario; el merge a la rama estable y el tag los decide siempre una persona. Cambiar cualquiera de estas convenciones es un cambio mayor: spec dedicada + revisión de las 9 skills afectadas. La historia de una rama de task queda en un commit de apertura, uno por task del plan y uno de cierre, y la de un patch en fix y cierre; los commits intermedios se juntan al quedar limpia la revisión de cada hito (`sdd-start-task/references/commit-milestones.md`).

También son convención del kit el **modo de ejecución**, que elige para cada plan el handoff de `writing-plans` con `execution: auto` en `sdd-kit.json`, el default. Las opciones son Native (`executing-plans`), la más barata, o `subagent-driven-development`, que superpowers recomienda cuando se quiere revisión por task o cuando el plan es tan largo que sus últimas tasks correrían con el contexto compactado. Con `execution: native` o `subagent`, el proyecto lo fija. Y es convención del kit la **política de modelos** de los subagentes, que es la de `subagent-driven-development` y no una propia: el **modelo y el effort** se declaran **siempre** de forma explícita al despachar —omitir el modelo hereda el de la sesión, normalmente el más caro, y declarar el modelo sin el effort hace que el subagente herede el de la sesión—, con **gama media como suelo** para revisores y para implementadores que trabajan a partir de prosa, y el tier más barato reservado a transcripción de código ya escrito en el plan y a arreglos mecánicos de un fichero. En Claude Code el effort viaja en el tipo de agente: el kit entrega `sdd-kit:effort-low`, `-medium` y `-high`, y el despacho pasa ese `subagent_type` junto al `model`. Si el harness no expone el effort, el plan lo escribe así: «effort: no disponible en este harness, hereda el de la sesión». El criterio es *turnos, no precio por token*: un modelo barato que da 2-3× vueltas sale más caro. `fable` y `opus xhigh` siguen prohibidos por defecto, con justificación escrita en la task. El revisor final de rama de una ejecución Native, que `executing-plans` pide en «the most capable available model», va con Opus y effort high (`sdd-kit:effort-high`): es el techo por defecto. Un proyecto consumidor puede desviarse, pero por escrito en su propia constitution.

## Art. V — Versionado

SemVer en `.claude-plugin/plugin.json`. Cada release: bump de versión + entrada en `.docs/sdd/changelog.md`. Los usuarios actualizan con `/plugin marketplace update`. Toda release que cambie la estructura de `.docs/sdd/` o retire algo del proyecto consumidor escribe además `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` con pasos-predicado y verificación; el proyecto declara la versión que tiene aplicada en `.docs/sdd/sdd-kit.json`, y «actualízame al kit» aplica solo las migraciones posteriores (T10, 2026-09-09). **Toda pregunta o dato que añade una migración va también en las init, desde una sola fuente**: un proyecto nuevo nace en la versión vigente y nunca pasa por esa migración (task 0020: las claves de control solo las preguntaba la v1.2.0 y 0 de 7 sujetos de init las pidieron; decisión del dev-lead, 2026-09-22). Cada release del kit revisa además la compatibilidad con la versión de superpowers instalada (sus `RELEASE-NOTES.md`) y actualiza la versión validada que declara el README; si una minor cambia una skill que el kit invoca, el mapeo se re-testa antes de cerrar.

## Art. VI — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only. Las ramas de este repo siguen la forma de la historia que fija el Art. IV.

## Art. VII — Dogfooding

Los cambios no triviales del kit pasan por su propio flujo: `sdd-start-task` → spec → plan → implementación → `sdd-end-task`, con artefactos en `.docs/sdd/specs/`. Los fixes pequeños deterministas, por el carril patch.

## Art. VIII — Una sola fuente de plantillas

Las plantillas canónicas viven SOLO en `skills/sdd-templates/templates/`. Ninguna copia en ningún sitio: ni en este repo ni en los proyectos consumidores — al crear un artefacto se calca del skill `sdd-templates` (decisión 2026-07-21; antes los proyectos instalaban copia y derivaban).

## Art. IX — Relación con superpowers

El kit **no compite con superpowers: lo viste**. Tres reglas, en este orden:

1. **Adoptar al máximo.** Si superpowers ya resuelve algo, el kit lo invoca y no lo reescribe. Guidance que duplica la suya está prohibida igual que la guidance sin baseline (Art. I): una segunda copia diverge, y la suya está mejor probada.
2. **Aportar lo que superpowers no tiene.** Los artefactos del equipo (`spec.md`, `plan.md`, `tasks.md`, `walkthrough.md`, `patch.md`, acta de release), la estructura `.docs/sdd/`, los carriles y sus gates de aprobación. Ahí el kit manda y sobreescribe los defaults de superpowers.
3. **Extender solo ante un hueco demostrado.** Cuando superpowers enuncia una regla pero no la ejecuta —lo dice en prosa y su herramienta o su receta no lo hacen—, el kit escribe la pieza que falta y **documenta el hueco** en la evidencia. Ejemplo: `subagent-driven-development` afirma que un subagente necesita "su task, las interfaces que toca y las restricciones globales", pero su `scripts/task-brief` extrae solo el texto de la task y su receta de dispatch no lista las restricciones; el kit obliga a entregarlas (medido en `tests/workflow-ejecucion-red.md`, F4). Segundo ejemplo: superpowers advierte de que declarar el modelo sin el effort es una trampa, pero solo en `using-superpowers/references/codex-tools.md`; su propia skill de despacho no lo recoge, así que el campo `Modelo` del plan del kit exige los dos valores.

Antes de escribir guidance nueva, comprueba si superpowers ya la cubre. Si la cubre, se cita; no se copia.

## Art. X — Calidad de código

Aplica al código ejecutable del kit (scripts, tests) y viaja **literal** en las Restricciones globales de todo plan y en el encargo de todo implementador y revisor: un subagente no hereda el CLAUDE.md del dev-lead, y de ahí que la regla se duplique donde haga falta (decisión 2026-09-09, T7).

- **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
- **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough (T14, 2026-09-09; 110 comentarios con cita en los dos retos del equipo).
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor (task 0021, decisión del dev-lead, 2026-09-22).
