# Constitution — sdd-kit

Reglas no negociables del kit. La constitution manda sobre cualquier spec. Cada artículo es una regla con su porqué en una frase; la historia de cada regla está en su ADR de [`decisions/`](decisions/).

## Principios

1. **Cada pieza de ceremonia nombra el fallo que evita, con evidencia, o sale.**
2. **La ceremonia es proporcional al cambio.**
3. **Lo que revisa la persona es corto; lo que lee el agente lleva índice y rutas.** No se guarda lo que se lee barato del código.
4. **Lo mecánico va a la CLI; el texto queda para el juicio.**
5. **Se mide si la ceremonia se paga:** además de horas y dólares, las vueltas (rondas de fix, re-revisiones, validaciones rechazadas).

## Art. I — Pruebas de skills

Ninguna skill nueva ni edición de una existente —recortes, traducciones y renombrados incluidos— sin su prueba:

- La guidance nueva lleva un test que falla antes de escribirla; si el baseline no exhibe el fallo, no se escribe.
- **Batería completa** en las skills de entrada, propose, verify y archive; **humo** (1-2 escenarios, n = 1) en todas; antes de cada release, las dos. Mientras no existan las skills de propose, verify y archive, la que se escribe nace con su batería, y una edición de una skill de la 2.3.x lleva el tramo de su batería si la tiene y, si no, humo.
- **A/B** (la versión vigente contra la editada) solo ante una duda concreta. Cada fallo de campo pasa a escenario.
- **La previsión de coste** (sujetos, minutos y dólares) se declara antes del primer sujeto y la spec la repite. Lista cada paso nuevo o cambiado de lo que el agente sigue (`SKILL.md`, `references/`, `migrations/`) con su escenario o el motivo de no medirlo, y la lente técnica de la review de spec lo comprueba. Si la prueba la supera, una tanda más de REFACTOR incluida, se para y decide el dev-lead: seguir, cerrar con lo medido y dejar lo pendiente como deuda, o recortar el alcance.
- **Renombrar, retirar o fusionar una skill es editarla**: se vuelve a medir su entrada, y la spec lleva una tabla «regla de la skill retirada → dónde vive ahora | por qué se descarta», con una fila por paso, red flag y racionalización.

**Una pieza entra, otra sale**: la spec de toda feature o patch del kit dice qué retira o adelgaza; «nada» se justifica y se aprueba en el gate. Los topes de palabras viven en `tests/WordBudget.Tests.ps1` y solo suben por decisión del dev-lead escrita en la spec.

El método (baterías, sujetos, matices de campaña) vive en `tech-stack.md`.

*Por qué*: una skill se escribe para que un agente la cumpla bajo presión, y solo una prueba dice si lo hace; la campaña completa en cada edición costaba más de lo que pagaba. [ADR 0002](decisions/0002-skill-testing-by-battery.md)

## Art. II — La forma sigue al fallo

- Fallo de disciplina (sabe la regla y la salta bajo presión) → prohibición + tabla de racionalizaciones + red flags.
- Fallo de forma (cumple pero con la forma equivocada) → receta o contrato de cómo es el output.
- Comportamiento condicional → predicado observable («si existe `.docs/sdd/estimation.md`…»), nunca cláusulas de excepción.
- Una excepción de la guía lleva su contraejemplo (el motivo que no vale), y la prueba tiene un escenario donde esa excepción es la salida fácil.

*Por qué*: cada tipo de fallo se corrige con una forma distinta de texto, y una excepción sin contraejemplo se convierte en la salida fácil. [ADR 0003](decisions/0003-form-follows-failure.md)

## Art. III — Idioma

Texto humano (docs, tests, cuerpo de los commits) en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case. Las skills se escriben en inglés y cada una le dice al agente que hable con el usuario en su idioma; las que siguen en castellano se traducen al reescribirlas y hasta entonces conviven.

*Por qué*: el inglés es el idioma del ecosistema de skills y gasta menos tokens por instrucción, y el equipo lee en castellano. [ADR 0004](decisions/0004-skills-in-english.md)

## Art. IV — Convenciones que el kit fija a los proyectos

- **Artefactos**: `.docs/sdd/` como raíz; naming `<yyyyMMdd-HHmmss>-(feature|patch|proposal)-<id>-<slug>` en UTC (las carpetas `-task-` anteriores a la v2.0.0 se leen y no se renombran); artefactos de release en `.docs/sdd/releases/vX.Y.Z/`; módulos por predicado observable.
- **Ids**, según `ids.mode` en `.docs/sdd/sdd-kit.json`: en `tracker`, el id del gestor de tickets (0000 si no hay; el de la épica para una propuesta); en `sequence`, la secuencia única de features, patches y propuestas del proyecto.
- **Merge**: a la rama de integración, según la política que el usuario declara en `sdd-kit.json` y aplican las skills que la leen (el cierre de feature y el de patch); sin política declarada, lo decide el usuario. El merge a la rama estable y el tag los decide siempre una persona.
- **Historia de la rama**: en una feature, un commit de apertura, uno por task del plan y uno de cierre; en un patch, fix y cierre; los intermedios se juntan al quedar limpia la revisión de cada hito (`sdd-start-feature/references/commit-milestones.md`).
- **Método de ejecución**, que elige para cada plan el handoff de `writing-plans` con `execution: auto` en `sdd-kit.json`, el default: Native (`executing-plans`), la más barata, o `subagent-driven-development`, cuando se quiere revisión por task o el plan es tan largo que sus últimas tasks correrían con el contexto compactado. Con `execution: native` o `subagent`, el proyecto lo fija.
- **Política de modelos**, la de `subagent-driven-development`: modelo y effort se declaran siempre al despachar —omitir el modelo hereda el de la sesión, y declarar el modelo sin el effort hace que el subagente herede el de la sesión—; gama media como suelo para revisores e implementadores que trabajan desde prosa; el tier más barato, solo para transcribir código ya escrito en el plan y arreglos mecánicos de un fichero. En Claude Code el effort viaja en el tipo de agente (`sdd-kit:effort-low`, `-medium` y `-high`) junto al `model`; si el harness no lo expone, el plan escribe «effort: no disponible en este harness, hereda el de la sesión». `fable` y `opus xhigh`, prohibidos por defecto salvo justificación escrita en la task. El revisor final de rama de una ejecución Native va con Opus y effort high (`sdd-kit:effort-high`): es el techo por defecto. La sesión que ejecuta en Native es el implementador y su modelo lo elige el usuario; el kit le recomienda gama media (Sonnet, effort medium) en la última parada antes de ejecutar, porque la sesión no puede cambiar su propio modelo. Bajar solo el effort de Opus no es gama media. El walkthrough registra modelo y effort de cada fase.
- **Nivel de verificación**: lo fija la spec, con evidencia por THEN y verificación visual cuando hay pantalla; la configuración personal (`sdd-kit.local.json`) cambia cómo trabaja la persona con el agente, nunca cuánto se comprueba.

Cambiar cualquiera de estas convenciones es un cambio mayor: spec dedicada y revisión de las skills afectadas. Un proyecto consumidor puede desviarse, por escrito en su propia constitution.

*Por qué*: el resultado debe depender del proceso y no de quien ejecuta, y el coste lo deciden el método y los modelos, medidos en turnos y no en precio por token. [ADR 0005](decisions/0005-artifact-and-branch-conventions.md) · [ADR 0006](decisions/0006-model-policy-and-execution.md)

## Art. V — Versionado

SemVer en `.claude-plugin/plugin.json`. Una release es **mayor** si tras ella un proyecto tiene que cambiar algo para seguir trabajando (una frase o un comando que deja de funcionar, un artefacto que cambia de forma, una migración con pasos además del marcador); si no, menor, o patch si solo arregla. Cada release: bump de versión, entrada en `.docs/sdd/changelog.md` y `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md`, con «sin cambios en el proyecto», su verificación y su línea `**Escribe**:` si no cambia nada. El proyecto declara en `.docs/sdd/sdd-kit.json` la versión que tiene aplicada, y «actualízame al kit» aplica solo las migraciones posteriores. Toda pregunta o dato que añade una migración va también en las init, desde una sola fuente. Cada release revisa las versiones nuevas de sus fuentes (`THIRD_PARTY_NOTICES.md`, y superpowers mientras siga instalado, con la versión validada que declara el README) y apunta en la deuda lo que convenga traer; si una versión nueva cambia una skill que el kit aún invoca, esa integración se vuelve a probar antes de cerrar.

*Por qué*: sin migración en cada release el marcador de los proyectos no avanza, y un proyecto nuevo nunca pasa por las migraciones viejas. [ADR 0007](decisions/0007-versioning-and-migrations.md)

## Art. VI — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only. Las ramas de este repo siguen la forma de la historia del Art. IV.

*Por qué*: el tipo en inglés lo leen las herramientas, y el porqué del cambio lo lee el equipo.

## Art. VII — Dogfooding

Los cambios no triviales del kit pasan por su propio flujo (arranque de feature → spec → plan → implementación → cierre), con artefactos en `.docs/sdd/specs/`; los fixes pequeños deterministas, por el carril patch.

*Por qué*: el kit solo se prueba de verdad usándolo, y cada sesión del propio repo es un caso de campo.

## Art. VIII — Una sola fuente de plantillas

Las plantillas canónicas viven solo en `skills/sdd-templates/templates/`. Ninguna copia, ni en este repo ni en los proyectos: al crear un artefacto se calca del skill `sdd-templates`.

*Por qué*: las copias de cada proyecto derivaban de las del kit sin que nadie se enterara. [ADR 0008](decisions/0008-single-template-source.md)

## Art. IX — Fuentes y fork

El kit es un fork propio. Copia y adapta de superpowers, OpenSpec, mattpocock/skills, Wondel, MADR y skill-creator, con su aviso en `THIRD_PARTY_NOTICES.md` (fuente, versión y licencia). Una pieza copiada es del kit: la mantiene el kit y se prueba con el Art. I. Hasta que la 0147 retire superpowers, el kit sigue invocando las skills suyas que aún no ha copiado.

*Por qué*: vestir superpowers con overrides costaba una revisión por cada versión suya y dejaba fuera lo mejor de otros métodos. [ADR 0009](decisions/0009-fork-instead-of-dressing-superpowers.md)

## Art. X — Calidad de código

Aplica al código ejecutable del kit (scripts, tests) y viaja **literal** en las Restricciones globales de todo plan y en el encargo de todo implementador y revisor.

- **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
- **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

*Por qué*: un subagente no hereda el `CLAUDE.md` del dev-lead, y un comentario que cita un documento envejece con él sin explicar nada. [ADR 0010](decisions/0010-executable-code-quality.md)

## Art. XI — Documentos acotados

Todo documento de `.docs/sdd/` es de uno de estos tipos, y no los mezcla:

- **Documento de estado**: dice cómo es el proyecto hoy. Se reescribe; no se le añade.
- **Artefacto de evento**: dice qué pasó y por qué, un fichero por evento. Su cuerpo no se reescribe: lo posterior se añade como adenda fechada.
- **ADR** (`.docs/sdd/decisions/NNNN-<slug>.md`): el porqué de una regla, en la forma de la [ADR 0001](decisions/0001-bounded-documents-and-adr.md). Es inmutable: una decisión nueva escribe otra ADR y la vieja solo cambia su `status` a `superseded by NNNN`.

Fuera quedan el changelog, un diario que solo crece por arriba y del que solo se lee la cabecera, y el log de estimación, que genera un script. Cada documento declara quién lo escribe, quién lo lee y qué lo acota, en la tabla de `architecture.md`; un documento sin dueño o sin lector no se crea. Lo que no cabe en un documento de estado va al artefacto del evento que lo produjo (el porqué de una feature, a su spec; lo decidido para una release, a su resumen; una decisión de una consulta, a una propuesta); una regla o un descarte, al documento de anclaje de su tema, y su historia, a una ADR.

*Por qué*: un documento al que solo se le añade crece hasta que nadie lo lee entero, y el porqué de una regla no es estado ni pertenece a una sola feature. [ADR 0001](decisions/0001-bounded-documents-and-adr.md)
