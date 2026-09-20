# sdd-kit

Kit SDD del equipo: skills de proceso agnósticas para el flujo **spec → plan → implementación → walkthrough** con Claude Code. Es el nivel 1 de la taxonomía de skills del equipo (proceso, igual en todos los proyectos); las skills técnicas por stack (nivel 2) y las específicas de cada proyecto (nivel 3) viven en cada repo.

> Estado: **v1.1.0 cerrada** y publicada en `pikachumetal/sdd-kit`. La 1.2.0 está abierta: 16 tasks salidas de siete tickets de campo de agentes que usaron el kit en proyectos reales (ver [roadmap](.docs/sdd/roadmap.md)). Las 11 skills de proceso validadas con el TDD de writing-skills: baseline sin skill (RED) → skill dirigida a los fallos observados (GREEN) → cierre de huecos. Evidencia completa en `tests/`.

## Instalación

Como plugin de Claude Code (recomendado — actualizable centralmente):

```text
/plugin marketplace add pikachumetal/sdd-kit
/plugin install sdd-kit@sdd-kit
/reload-plugins
```

Desde un clon local, para desarrollar el propio kit:

```text
/plugin marketplace add <ruta-al-clon>
/plugin install sdd-kit@sdd-kit
/reload-plugins
```

Por skill individual, con el CLI de agent skills:

```bash
npx skills add pikachumetal/sdd-kit -a claude-code            # todas
npx skills add pikachumetal/sdd-kit --skill sdd-start-task    # una concreta
```

## Actualizar un proyecto

Tras actualizar el kit (`/plugin marketplace update` o de nuevo `npx skills add`), pide en el proyecto: «Ponme el proyecto al día con `sdd-init-brownfield`». La skill lee `.docs/sdd/sdd-kit.json` (la versión aplicada), ejecuta en orden los ficheros de `skills/sdd-init-brownfield/references/migrations/` posteriores a esa versión —cada paso con su predicado, los borrados y renombrados con gate del dev-lead— y escribe el marcador al terminar. Un proyecto sin marcador se trata como anterior a v0.2.0.

## Contenido

| Skill | Propósito |
| --- | --- |
| `sdd-init-greenfield` | Arrancar un proyecto nuevo: entrevista (brainstorming como motor, con gates) y genera la documentación de anclaje |
| `sdd-init-brownfield` | Onboarding de un codebase existente: documenta el estado real (no el ideal), cosecha el CLAUDE.md previo y reduce a punteros |
| `sdd-start-task` | Arrancar una tarea: Gate 1 de contexto, spec → plan → tasks con gates de aprobación |
| `sdd-end-task` | Definition of Done: walkthrough, aprendizajes a docs vivos, estimation-log, revisión de skills, changelog, roadmap, rama |
| `sdd-start-patch` | Carril ligero para bugs deterministas (<30 min): causa raíz obligatoria + un solo patch.md |
| `sdd-end-patch` | Cierre ligero del patch: changelog, roadmap, estimation-log; el merge es decisión del usuario |
| `sdd-start-release` | Abrir la siguiente release: inventario ordenado (acta, backlog, deuda, retro) con recomendación y bloqueos; el scope lo decide el usuario; se refina solo el top |
| `sdd-end-release` | Cierre de release: acta + triage, retro con evidencia, changelog sellado, release notes de cliente, roadmap colapsado; merge y tag los confirma el usuario |
| `sdd-consult` | Carril de consulta: preguntar/entender/planificar/estructurar con el contexto cargado, sin artefactos; grilling para estructurar, handoff anunciado a los carriles de trabajo |
| `add-to-changelog` | Entrada en el changelog con contrato de formato (Keep a Changelog; SemVer o bundle) |
| `sdd-templates` | Las 12 plantillas canónicas (spec, plan, tasks, walkthrough, patch, data-model, research, feedback, release-notes, environments, capability, client-changelog) y el script `Build-EstimationLog.ps1`, que `sdd-end-task` y `sdd-end-patch` ejecutan desde el kit para regenerar el estimation-log del proyecto |

## Dependencias

Declaración canónica del kit: el resto de documentos apuntan aquí en vez de repetir la lista.

| Dependencia | Obligatoria | Canal | Instalación |
| --- | --- | --- | --- |
| `superpowers` | Sí | Plugin de Claude Code, marketplace `claude-plugins-official` | Se resuelve sola: `plugin.json` la declara. Manual: `claude plugin install superpowers@claude-plugins-official` |
| `grilling` | No | Skill suelta del CLI de agent skills | `npx skills add mattpocock/skills --skill grilling` |

El kit invoca **7 skills de superpowers**: `brainstorming`, `writing-plans`, `subagent-driven-development` (default de implementación desde v1.0.0; la ejecución en línea es excepción declarada en el plan), `systematic-debugging`, `writing-skills`, `requesting-code-review` y `finishing-a-development-branch`. Lista verificable con `grep -rhoE "superpowers:[a-z-]+" skills/ | sort -u`. Sin el plugin instalado, Claude Code deshabilita el kit y muestra el comando de instalación en el error: es un fallo ruidoso a propósito, preferible a un flujo que se ejecuta a medias sin que nadie lo note.

**Versión validada**: superpowers **6.3.0** (revisado el 2026-09-07). El kit traduce las vías de `brainstorming` (spike / bounded / architectural) a sus carriles y adopta el bloque de restricciones globales de `writing-plans`; ese mapeo se re-testa (Art. I) en cada minor de superpowers antes de cerrar una release del kit.

`grilling` es opcional y solo la usa el carril consult, para tensar una dirección sin producir artefactos. Sin ella el carril sigue funcionando: el interrogatorio se hace igual, una pregunta cada vez y con recomendación, solo que sin la skill. Verificado con dos baselines en [`tests/sdd-consult-degradacion-red.md`](tests/sdd-consult-degradacion-red.md), que es también la razón de que el kit no lleve guidance para ese caso.

## Desarrollo del kit

La suite valida la anatomía de las skills, los manifests y el script de estimación. Se ejecuta con Pester (≥ 5) en `pwsh` 7+:

```powershell
pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Detailed"
```

El hook `.githooks/pre-commit` la ejecuta antes de cada commit y lo bloquea si falla. Se activa una vez por clon:

```bash
git config core.hooksPath .githooks
```

`tests/Manifests.Tests.ps1` usa `claude plugin validate` si el CLI de Claude Code está en PATH; si no, esos tests se saltan.

## Convenciones

- Los artefactos SDD viven en **`.docs/sdd/`** de cada proyecto (carpeta con punto: no es el proyecto, es su andamiaje); los de release (acta, release notes), en `.docs/sdd/releases/vX.Y.Z/`.
- Documentación del flujo del equipo: [`.docs/flux/`](.docs/flux/) — *Flux per al desenvolupament ràpid d'aplicacions amb Claude* (greenfield / brownfield / annex amb l'evidència).
- Este repo aplica su propio flujo (dogfooding): documentación de anclaje en [`.docs/sdd/`](.docs/sdd/).
