---
name: sdd-templates
description: Usar cuando hay que crear un artefacto SDD (spec, plan, tasks, walkthrough, patch, propuesta, data-model, research, feedback de release, release notes) o un documento de SDD del proyecto (mission, constitution, tech-stack, architecture, roadmap, estimation, changelog) — la plantilla se calca desde aquí. Las plantillas viven SOLO en el kit; los proyectos NO llevan carpeta templates/.
user-invocable: false
---

# sdd-templates

## Overview

Plantillas canónicas del kit SDD. **Viven solo aquí**: los proyectos no llevan carpeta `templates/` — al crear un artefacto se invoca esta skill y se calca la plantilla que toque. Una copia por proyecto sería deriva instantánea (la plantilla evoluciona en el kit y las copias se quedan atrás).

| Plantilla | Artefacto | Cuándo |
| --- | --- | --- |
| [spec-template.md](templates/spec-template.md) | `spec.md` | Toda task, en los dos modos. Spec ligera: decisiones a validar · Intent/Scope/Approach · delta por capacidad · aprobaciones |
| [plan-template.md](templates/plan-template.md) | `plan.md` | Solo modo full, tras aprobar la spec (cómo) |
| [tasks-template.md](templates/tasks-template.md) | `tasks.md` | Solo si el plan tiene >1 task (registro vivo) |
| [walkthrough-template.md](templates/walkthrough-template.md) | `walkthrough.md` | Cierre de toda task |
| [patch-template.md](templates/patch-template.md) | `patch.md` | Carril patch (único artefacto) |
| [proposal-template.md](templates/proposal-template.md) | `proposal.md` | Carril `proposal`: la escribe `sdd-roadmap` para algo grande o una reunión con el cliente; histórica, con enmiendas fechadas |
| [data-model-template.md](templates/data-model-template.md) | `data-model.md` | Opcional: cambios de datos que no caben en el plan |
| [research-template.md](templates/research-template.md) | `research.md` | Opcional: investigación previa con timebox |
| [feedback-template.md](templates/feedback-template.md) | `feedback.md` | Cierre de release: acta única (inventario + triage + retro) |
| [release-notes-template.md](templates/release-notes-template.md) | `release-notes.md` | Cierre de release: notas de cliente destiladas del changelog |
| [client-changelog-template.md](templates/client-changelog-template.md) | `client-changelog.md` | Opt-in del proyecto (entrevista de init): acumulado de cliente, versión a versión, derivado de las release notes de cada cierre; lo actualiza `sdd-end-release` si existe |
| [environments-template.md](templates/environments-template.md) | `environments.md` | Solo si el proyecto usa worktrees **y** su entorno necesita más que instalar dependencias (BD, puertos, servicios). Lo calca `init-*` por entrevista; `sdd-start-task` y `sdd-end-*` lo activan por predicado |
| [capability-template.md](templates/capability-template.md) | `capabilities/<capability>.md` | Verdad viva del comportamiento: la crea la spec que declara la capacidad, la fusiona `sdd-end-task` |
| [kit-feedback-template.md](templates/kit-feedback-template.md) | ticket en `.docs/sdd/kit-feedback/` | Al cerrar una task o un patch, vía `sdd-feedback` |
| [mission-template.md](templates/mission-template.md) | `mission.md` | Documento de anclaje: lo calca el init; la entrevista o el código ponen el contenido |
| [constitution-template.md](templates/constitution-template.md) | `constitution.md` | Documento de anclaje: lo calca el init, con las cinco «Reglas de producto» por nombre |
| [tech-stack-template.md](templates/tech-stack-template.md) | `tech-stack.md` | Documento de anclaje: lo calca el init |
| [architecture-template.md](templates/architecture-template.md) | `architecture.md` | Documento de anclaje: lo calca el init, o quien lo necesite si se pospuso (una task, `sdd-end-task` con un aprendizaje estructural, una consulta) |
| [roadmap-template.md](templates/roadmap-template.md) | `roadmap.md` | Documento de anclaje: lo calca el init; secciones y cabeceras de tabla literales, porque las leen otras skills |
| [estimation-template.md](templates/estimation-template.md) | `estimation.md` | Opt-in del proyecto: activa el módulo de estimación; calibración vacía al nacer |
| [changelog-template.md](templates/changelog-template.md) | `changelog.md` | Opt-in del proyecto (entrevista de init): activa `add-to-changelog`; nace con `## [Unreleased]` y sin entradas |

## Scripts

| Script | Uso |
| --- | --- |
| [scripts/Build-EstimationLog.ps1](scripts/Build-EstimationLog.ps1) | Regenera `estimation-log.md` desde los walkthroughs y patches (`walkthrough.md` §2, `patch.md` §5, `hotfix.md` legacy). Lo ejecutan `sdd-end-task` y `sdd-end-patch` desde el kit: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. No se copia al proyecto: una copia local es deriva, igual que con las plantillas. |
| [scripts/Get-NextSddId.ps1](scripts/Get-NextSddId.ps1) | Reserva el siguiente id (`0001`–`9999`) para un proyecto en modo `ids.mode: sequence`: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Get-NextSddId.ps1" -ProjectRoot "<raíz del proyecto>" -Reserve [-Count N]`. Toma un cerrojo en el directorio común de git y consume los ids en un contador que comparten todos los worktrees de la máquina, así que un id reservado no vuelve a salir aunque el trabajo se abandone. El escaneo de `specs/`, `roadmap.md` y las ramas solo inicializa o corrige ese contador. Sin `-Reserve` solo propone el id y no escribe nada: es lo que usa una consulta. En modo `tracker` (o sin campo `ids`) sale con error, porque ese modo asigna el id con el gestor de tickets. No se copia al proyecto. |
| [scripts/SddLock.ps1](scripts/SddLock.ps1) | El cerrojo de fichero del directorio común de git que comparten `Get-NextSddId.ps1` y `Invoke-SddMerge.ps1`. Lo cargan ellos; no se ejecuta solo. |
| [scripts/Invoke-SddMerge.ps1](scripts/Invoke-SddMerge.ps1) | Hace el merge del cierre según la política `merge` de `sdd-kit.json`. Toma un cerrojo por repo (si otra sesión lo tiene, dice quién y espera) e integra la base del remoto. Fusiona en un worktree temporal `merge-<id>` junto a los demás, regenerando `estimation-log.md` si choca, y ejecuta `-VerifyCommand`. Con `-Push`, empuja la rama destino por su nombre. Si algo falla, deja la rama destino como estaba. Lo invocan `sdd-end-task` y `sdd-end-patch` con la [receta del merge](../sdd-end-task/references/merge-recipe.md): `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Invoke-SddMerge.ps1" -ProjectRoot "<worktree de la feature>" [-Push] [-VerifyCommand "<suite>"]`. No se copia al proyecto. |
| [scripts/Test-Capabilities.ps1](scripts/Test-Capabilities.ps1) | Valida `capabilities/`: el título, que solo haya «Requisitos» y «Reglas de la capacidad», que cada requisito tenga `- GIVEN`, `- WHEN` y `- THEN`, que no queden marcas de delta y que las reglas tengan sus cinco entradas. Con `-Artifact`, después de fusionar, comprueba que el bloque «Capacidades» de la spec o del `patch.md` nombra las mismas capacidades que su delta. Lo ejecutan `sdd-end-task` y `sdd-end-patch` tras fusionar: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Test-Capabilities.ps1" -Path "<raíz del proyecto>/.docs/sdd" [-Artifact "<spec.md o patch.md>"]`. No se copia al proyecto. |

Reglas al usarlas:

- **Calcar la estructura** (mismas secciones, mismo orden); los bloques de ayuda en citas (`>`) se borran al redactar.
- Los artefactos de task, patch y propuesta viven en `.docs/sdd/specs/<yyyyMMdd-HHmmss>-(task|patch|proposal)-<id>-<slug>/`; los de release, en `.docs/sdd/releases/vX.Y.Z/`.
- Las secciones marcadas *(si el módulo está activo)* se rigen por los predicados del proyecto (`estimation.md`, `changelog.md` presentes o no).
- **Modo lite**: la spec se calca de la MISMA plantilla ligera (decisiones · Intent/Scope/Approach · delta · aprobaciones) y añade el bloque «Estimación y esfuerzo», que en modo full vive en `plan.md`. No existe ni se crea un `spec-lite-template.md`: una segunda plantilla es deriva instantánea (Art. VIII).
- Al redactar el artefacto, sustituir los huecos `<proyecto>` (stack, comandos de build, artículos de constitution) por los valores reales del proyecto (`tech-stack.md`, `constitution.md`).
