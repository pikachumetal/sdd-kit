# sdd-kit

Kit SDD del equipo: skills de proceso agnósticas para el flujo **spec → plan → implementación → walkthrough** con Claude Code. Es el nivel 1 de la taxonomía de skills del equipo (proceso, igual en todos los proyectos); las skills técnicas por stack (nivel 2) y las específicas de cada proyecto (nivel 3) viven en cada repo.

> Estado: **v0.4.0 cerrada**, sin distribuir (sin remoto configurado). Las 10 skills de proceso validadas con el TDD de writing-skills: baseline sin skill (RED) → skill dirigida a los fallos observados (GREEN) → cierre de huecos. Evidencia completa en `tests/`.

## Instalación

Como plugin de Claude Code (recomendado — actualizable centralmente):

```text
/plugin marketplace add <ruta-o-repo>/sdd-kit
/plugin install sdd-kit@sdd-kit
/reload-plugins
```

```text
/plugin marketplace add D:\code\git\sdd-kit
/plugin install sdd-kit@sdd-kit
/reload-plugins
```

Por skill individual, con el CLI de agent skills:

```bash
npx skills add <org>/sdd-kit -a claude-code            # todas
npx skills add <org>/sdd-kit --skill sdd-start-task    # una concreta
```

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
| `sdd-templates` | Las 9 plantillas canónicas (spec, plan, tasks, walkthrough, patch, data-model, research, feedback, release-notes) |

## Dependencias

Declaración canónica del kit: el resto de documentos apuntan aquí en vez de repetir la lista.

| Dependencia | Obligatoria | Canal | Instalación |
| --- | --- | --- | --- |
| `superpowers` | Sí | Plugin de Claude Code, marketplace `claude-plugins-official` | Se resuelve sola: `plugin.json` la declara. Manual: `claude plugin install superpowers@claude-plugins-official` |
| `grilling` | No | Skill suelta del CLI de agent skills | `npx skills add mattpocock/skills --skill grilling` |

El kit invoca **6 skills de superpowers**: `brainstorming`, `writing-plans`, `executing-plans`, `systematic-debugging`, `writing-skills` y `finishing-a-development-branch`. Sin el plugin instalado, Claude Code deshabilita el kit y muestra el comando de instalación en el error: es un fallo ruidoso a propósito, preferible a un flujo que se ejecuta a medias sin que nadie lo note.

`grilling` es opcional y solo la usa el carril consult, para tensar una dirección sin producir artefactos. Si no está instalada, la skill hace el interrogatorio por su cuenta y lo dice.

## Convenciones

- Los artefactos SDD viven en **`.docs/sdd/`** de cada proyecto (carpeta con punto: no es el proyecto, es su andamiaje); los de release (acta, release notes), en `.docs/sdd/releases/vX.Y.Z/`.
- Documentación del flujo del equipo: [`.docs/flux/`](.docs/flux/) — *Flux per al desenvolupament ràpid d'aplicacions amb Claude* (greenfield / brownfield / annex amb l'evidència).
- Este repo aplica su propio flujo (dogfooding): documentación de anclaje en [`.docs/sdd/`](.docs/sdd/).
