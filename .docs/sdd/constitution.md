# Constitution — sdd-kit

Principios no negociables del kit. La constitution manda sobre cualquier spec.

## Art. I — Ley de hierro de skills

Ninguna skill nueva ni edición de una existente sin test que falle primero: baseline sin la skill (RED, con racionalizaciones textuales documentadas) → skill dirigida a esos fallos (GREEN, mismos escenarios) → cierre de huecos. La evidencia vive en `tests/<skill>-red.md` y `tests/<skill>-green.md`. Aplica también a recortes, traducciones y "pequeños ajustes". Si el baseline no exhibe el fallo, no se escribe la guidance.

Para un **recorte o reestructuración de una skill existente**, el baseline vacío no es el test: una versión recortada puede batir a un baseline sin skill y aun así ser peor que la versión vigente. El test válido es el **A/B de no-regresión** — control (la versión vigente) contra tratamiento (la versión recortada), mismos escenarios —, y el corte se publica solo si el tratamiento reproduce la conducta del control en TODOS ellos. La evidencia vive en `tests/<skill>-ab.md`. El RED contra baseline vacío sigue siendo el test de la guidance nueva.

## Art. II — La forma sigue al fallo

- Fallo de disciplina (sabe la regla y la salta bajo presión) → prohibición + tabla de racionalizaciones + red flags.
- Fallo de forma (cumple pero con la forma equivocada) → receta/contrato de cómo ES el output.
- Comportamiento condicional → predicado observable ("si existe `.docs/sdd/estimation.md`…"), nunca cláusulas de excepción.

## Art. III — Idioma

Texto humano (skills, docs, tests, commits-cuerpo) en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case. No se traducen las skills al inglés por ahorro de tokens: el ahorro es marginal y rompe la validación y la legibilidad del equipo (decisión 2026-07-09).

## Art. IV — Convenciones que el kit fija a los proyectos

`.docs/sdd/` como raíz de artefactos; naming `<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>` en UTC con el id que fija el modo declarado en `.docs/sdd/sdd-kit.json` (`ids.mode`): en modo `tracker`, el id del gestor de tickets (0000 si no hay); en modo `sequence`, el id de la secuencia única de tasks y patches del proyecto; artefactos de release (acta, release notes) en `.docs/sdd/releases/vX.Y.Z/`; módulos por predicado observable; el merge es SIEMPRE decisión del usuario. Cambiar cualquiera de estas convenciones es un cambio mayor: spec dedicada + revisión de las 9 skills afectadas.

También son convención del kit el **modo de ejecución por defecto** —`subagent-driven-development`, con la ejecución en línea como excepción que el plan declara por task— y la **política de modelos**, que es la de `subagent-driven-development` y no una propia: el **modelo y el effort** se declaran **siempre** de forma explícita al despachar —omitir el modelo hereda el de la sesión, normalmente el más caro, y declarar el modelo sin el effort lo deja caer al defecto de ese modelo—, con **gama media como suelo** para revisores y para implementadores que trabajan a partir de prosa, y el tier más barato reservado a transcripción de código ya escrito en el plan y a arreglos mecánicos de un fichero. El criterio es *turnos, no precio por token*: un modelo barato que da 2-3× vueltas sale más caro. `fable` y `opus xhigh` siguen prohibidos por defecto, con justificación escrita en la task. Un proyecto consumidor puede desviarse, pero por escrito en su propia constitution.

## Art. V — Versionado

SemVer en `.claude-plugin/plugin.json`. Cada release: bump de versión + entrada en `.docs/sdd/changelog.md`. Los usuarios actualizan con `/plugin marketplace update`. Toda release que cambie la estructura de `.docs/sdd/` o retire algo del proyecto consumidor escribe además `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` con pasos-predicado y verificación; el proyecto declara la versión que tiene aplicada en `.docs/sdd/sdd-kit.json`, y «actualízame al kit» aplica solo las migraciones posteriores (T10, 2026-09-09). Cada release del kit revisa además la compatibilidad con la versión de superpowers instalada (sus `RELEASE-NOTES.md`) y actualiza la versión validada que declara el README; si una minor cambia una skill que el kit invoca, el mapeo se re-testa antes de cerrar.

## Art. VI — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

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
- El revisor marca el incumplimiento como Important, no como estilo.
