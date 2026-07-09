# sdd-kit

Kit SDD del equipo: skills de proceso agnósticas para el flujo **spec → plan → implementación → walkthrough** con Claude Code. Es el nivel 1 de la taxonomía de skills del equipo (proceso, igual en todos los proyectos); las skills técnicas por stack (nivel 2) y las específicas de cada proyecto (nivel 3) viven en cada repo.

> Estado: **v0.1.0 — completo**. Las 7 skills validadas con el TDD de writing-skills: baseline sin skill (RED) → skill dirigida a los fallos observados (GREEN) → cierre de huecos. Evidencia completa en `tests/`.

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
| `sdd-start-hotfix` | Carril ligero para bugs deterministas (<30 min): causa raíz obligatoria + un solo hotfix.md |
| `sdd-end-hotfix` | Cierre ligero del hotfix: changelog, roadmap, estimation-log; el merge es decisión del usuario |
| `add-to-changelog` | Entrada en el changelog con contrato de formato (Keep a Changelog; SemVer o bundle) |
| `sdd-templates` | Las 7 plantillas canónicas (spec, plan, tasks, walkthrough, hotfix, data-model, research) |

## Convenciones

- Los artefactos SDD viven en **`.docs/sdd/`** de cada proyecto (carpeta con punto: no es el proyecto, es su andamiaje).
- Requiere el plugin **superpowers** (brainstorming, executing-plans, systematic-debugging, finishing-a-development-branch).
- Documentación del flujo del equipo: [`.docs/flux/`](.docs/flux/) — *Flux per al desenvolupament ràpid d'aplicacions amb Claude* (greenfield / brownfield / annex amb l'evidència).
- Este repo aplica su propio flujo (dogfooding): documentación de anclaje en [`.docs/sdd/`](.docs/sdd/).
