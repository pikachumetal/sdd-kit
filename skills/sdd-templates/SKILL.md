---
name: sdd-templates
description: Usar cuando hay que crear un artefacto SDD (spec, plan, tasks, walkthrough, hotfix, data-model, research) y el proyecto no tiene la plantilla correspondiente en .docs/sdd/templates/ — se copia desde aquí. Las skills sdd-init-* instalan este set completo en cada proyecto nuevo.
---

# sdd-templates

Plantillas canónicas del kit SDD. Cada proyecto las lleva copiadas en `.docs/sdd/templates/` (las instala `sdd-init-greenfield` / `sdd-init-brownfield`); esta carpeta es la fuente de verdad del kit.

| Plantilla | Artefacto | Cuándo |
| --- | --- | --- |
| [spec-template.md](templates/spec-template.md) | `spec.md` | Toda task (qué + por qué) |
| [plan-template.md](templates/plan-template.md) | `plan.md` | Toda task, tras aprobar la spec (cómo) |
| [tasks-template.md](templates/tasks-template.md) | `tasks.md` | Solo si el plan tiene >1 task (registro vivo) |
| [walkthrough-template.md](templates/walkthrough-template.md) | `walkthrough.md` | Cierre de toda task |
| [hotfix-template.md](templates/hotfix-template.md) | `hotfix.md` | Carril hotfix (único artefacto) |
| [data-model-template.md](templates/data-model-template.md) | `data-model.md` | Opcional: cambios de datos que no caben en el plan |
| [research-template.md](templates/research-template.md) | `research.md` | Opcional: investigación previa con timebox |

Reglas al usarlas:

- **Calcar la estructura** (mismas secciones, mismo orden); los bloques de ayuda en citas (`>`) se borran al redactar.
- Los artefactos viven en `.docs/sdd/specs/<yyyyMMdd-HHmmss>-(task|hotfix)-<id>-<slug>/`.
- Las secciones marcadas *(si el módulo está activo)* se rigen por los predicados del proyecto (`estimation.md`, `changelog.md` presentes o no).
- Al copiar las plantillas a un proyecto, sustituir los huecos `<proyecto>` (stack, comandos de build, artículos de constitution) por los valores reales.
