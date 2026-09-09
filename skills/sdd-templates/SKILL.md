---
name: sdd-templates
description: Usar cuando hay que crear un artefacto SDD (spec, plan, tasks, walkthrough, patch, data-model, research, feedback de release, release notes) — la plantilla se calca desde aquí. Las plantillas viven SOLO en el kit; los proyectos NO llevan carpeta templates/.
---

# sdd-templates

Plantillas canónicas del kit SDD. **Viven solo aquí**: los proyectos no llevan carpeta `templates/` — al crear un artefacto se invoca esta skill y se calca la plantilla que toque. Una copia por proyecto sería deriva instantánea (la plantilla evoluciona en el kit y las copias se quedan atrás).

| Plantilla | Artefacto | Cuándo |
| --- | --- | --- |
| [spec-template.md](templates/spec-template.md) | `spec.md` | Toda task, en los dos modos. Spec ligera: decisiones a validar · Intent/Scope/Approach · delta por capacidad · aprobaciones |
| [plan-template.md](templates/plan-template.md) | `plan.md` | Solo modo full, tras aprobar la spec (cómo) |
| [tasks-template.md](templates/tasks-template.md) | `tasks.md` | Solo si el plan tiene >1 task (registro vivo) |
| [walkthrough-template.md](templates/walkthrough-template.md) | `walkthrough.md` | Cierre de toda task |
| [patch-template.md](templates/patch-template.md) | `patch.md` | Carril patch (único artefacto) |
| [data-model-template.md](templates/data-model-template.md) | `data-model.md` | Opcional: cambios de datos que no caben en el plan |
| [research-template.md](templates/research-template.md) | `research.md` | Opcional: investigación previa con timebox |
| [feedback-template.md](templates/feedback-template.md) | `feedback.md` | Cierre de release: acta única (inventario + triage + retro) |
| [release-notes-template.md](templates/release-notes-template.md) | `release-notes.md` | Cierre de release: notas de cliente destiladas del changelog |
| [environments-template.md](templates/environments-template.md) | `environments.md` | Solo si el proyecto usa worktrees **y** su entorno necesita más que instalar dependencias (BD, puertos, servicios). Lo calca `init-*` por entrevista; `sdd-start-task` y `sdd-end-*` lo activan por predicado |
| [funcional-template.md](templates/funcional-template.md) | `funcional/<capacidad>.md` | Verdad viva del comportamiento: la crea la spec que declara la capacidad, la fusiona `sdd-end-task` |

## Scripts

| Script | Uso |
| --- | --- |
| [scripts/Build-EstimationLog.ps1](scripts/Build-EstimationLog.ps1) | Regenera `estimation-log.md` desde los walkthroughs y patches (`walkthrough.md` §2, `patch.md` §5, `hotfix.md` legacy). Lo ejecutan `sdd-end-task` y `sdd-end-patch` desde el kit: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. No se copia al proyecto: una copia local es deriva, igual que con las plantillas. |

Reglas al usarlas:

- **Calcar la estructura** (mismas secciones, mismo orden); los bloques de ayuda en citas (`>`) se borran al redactar.
- Los artefactos de task/patch viven en `.docs/sdd/specs/<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>/`; los de release, en `.docs/sdd/releases/vX.Y.Z/`.
- Las secciones marcadas *(si el módulo está activo)* se rigen por los predicados del proyecto (`estimation.md`, `changelog.md` presentes o no).
- **Modo lite**: la spec se calca de la MISMA plantilla ligera (decisiones · Intent/Scope/Approach · delta · aprobaciones) y añade el bloque «Estimación y esfuerzo», que en modo full vive en `plan.md`. No existe ni se crea un `spec-lite-template.md`: una segunda plantilla es deriva instantánea (Art. VIII).
- Al redactar el artefacto, sustituir los huecos `<proyecto>` (stack, comandos de build, artículos de constitution) por los valores reales del proyecto (`tech-stack.md`, `constitution.md`).
