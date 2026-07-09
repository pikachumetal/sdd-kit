# sdd-kit

Kit SDD del equipo: skills de proceso agnósticas para el flujo **spec → plan → implementación → walkthrough** con Claude Code. Es el nivel 1 de la taxonomía de skills del equipo (proceso, igual en todos los proyectos); las skills técnicas por stack (nivel 2) y las específicas de cada proyecto (nivel 3) viven en cada repo.

> Estado: **en construcción**. Cada skill se somete a test con subagentes antes de entrar (RED → GREEN → REFACTOR).

## Instalación

Como plugin de Claude Code (recomendado — actualizable centralmente):

```text
/plugin marketplace add <ruta-o-repo>/sdd-kit
/plugin install sdd-kit@sdd-kit
```

Por skill individual, con el CLI de agent skills:

```bash
npx skills add <org>/sdd-kit -a claude-code            # todas
npx skills add <org>/sdd-kit --skill sdd-start-task    # una concreta
```

## Contenido previsto

| Skill | Propósito |
| --- | --- |
| `sdd-init-greenfield` | Arrancar un proyecto nuevo: entrevista y genera la documentación de anclaje y las skills iniciales |
| `sdd-init-brownfield` | Onboarding de un codebase existente: explora y documenta el estado real |
| `sdd-start-task` | Arrancar una tarea: carga contexto y guía spec → plan → tasks |
| `sdd-end-task` | Definition of Done: walkthrough, changelog, roadmap, estimation-log, revisión de skills |
| `sdd-start-hotfix` | Carril ligero para bugs deterministas (<30 min): un solo hotfix.md |
| `sdd-end-hotfix` | Cierre ligero del hotfix |
| `add-to-changelog` | Entrada en el changelog (Keep a Changelog) |

## Convenciones

- Los artefactos SDD viven en **`.docs/sdd/`** de cada proyecto (carpeta con punto: no es el proyecto, es su andamiaje).
- Requiere el plugin **superpowers** (brainstorming, executing-plans, systematic-debugging, finishing-a-development-branch).
- Documentación del flujo: ver los documentos internos *Flux per al desenvolupament ràpid d'aplicacions amb Claude* (greenfield / brownfield / annex).
