---
name: sdd-templates
description: Usar cuando hay que crear un artefacto SDD (spec, plan, tasks, walkthrough, patch, propuesta, data-model, research, feedback de release, release notes) o un documento del proyecto (PRODUCT, constitution, operations, architecture, roadmap, estimation, changelog, ADR) — la plantilla se calca desde aquí. Las plantillas viven SOLO en el kit; los proyectos NO llevan carpeta templates/.
user-invocable: false
---

# sdd-templates

## Overview

Plantillas canónicas del kit SDD. **Viven solo aquí**: los proyectos no llevan carpeta `templates/` — al crear un artefacto se invoca esta skill y se calca la plantilla que toque. Una copia por proyecto sería deriva instantánea (la plantilla evoluciona en el kit y las copias se quedan atrás).

| Plantilla | Artefacto | Cuándo |
| --- | --- | --- |
| [spec-template.md](templates/spec-template.md) | `spec.md` | Toda feature, en los dos modos. Spec ligera: decisiones a validar · Intent/Scope/Approach · delta por capacidad · aprobaciones |
| [plan-template.md](templates/plan-template.md) | `plan.md` | Solo modo full, tras aprobar la spec (cómo) |
| [tasks-template.md](templates/tasks-template.md) | `tasks.md` | Solo si el plan tiene >1 task (registro vivo) |
| [walkthrough-template.md](templates/walkthrough-template.md) | `walkthrough.md` | Cierre de toda feature |
| [patch-template.md](templates/patch-template.md) | `patch.md` | Carril patch (único artefacto) |
| [proposal-template.md](templates/proposal-template.md) | `proposal.md` | Carril `proposal`: la escribe `sdd-roadmap` para algo grande o una reunión con el cliente; histórica, con enmiendas fechadas |
| [data-model-template.md](templates/data-model-template.md) | `data-model.md` | Opcional: cambios de datos que no caben en el plan |
| [research-template.md](templates/research-template.md) | `research.md` | Opcional: investigación previa con timebox |
| [feedback-template.md](templates/feedback-template.md) | `feedback.md` | Cierre de release: acta única (inventario + triage + retro) |
| [release-notes-template.md](templates/release-notes-template.md) | `release-notes.md` | Cierre de release: notas de cliente destiladas del changelog |
| [client-changelog-template.md](templates/client-changelog-template.md) | `client-changelog.md` | **2.x: la retira la 0150.** Opt-in del proyecto (entrevista de init): acumulado de cliente, versión a versión, derivado de las release notes de cada cierre; lo actualiza `sdd-end-release` si existe |
| [environments-template.md](templates/environments-template.md) | `environments.md` | **2.x: la retira la 0156**, sustituida por `## Entornos` de `operations-template.md`. Solo si el proyecto usa worktrees **y** su entorno necesita más que instalar dependencias (BD, puertos, servicios). Lo calca `init-*` por entrevista; `sdd-start-feature` y `sdd-end-*` lo activan por predicado |
| [capability-template.md](templates/capability-template.md) | `capabilities/<capability>.md` | Verdad viva del comportamiento: la crea la spec que declara la capacidad, la fusiona `sdd-end-feature` |
| [kit-feedback-template.md](templates/kit-feedback-template.md) | ticket en `.docs/sdd/kit-feedback/` | Al cerrar una feature o un patch, vía `sdd-feedback` |
| [PRODUCT-template.md](templates/PRODUCT-template.md) | `PRODUCT.md` en la raíz | Para quién y para qué es el producto, y su glosario (`## Terminology`). Encabezados de impeccable, que lee el mismo fichero |
| [mission-template.md](templates/mission-template.md) | `mission.md` | **2.x: la retira la 0156**, sustituida por `PRODUCT-template.md`. Documento de anclaje: lo calca el init; la entrevista o el código ponen el contenido |
| [constitution-template.md](templates/constitution-template.md) | `.docs/sdd/steering/constitution.md` (2.x: `.docs/sdd/constitution.md`) | Documento de anclaje: lo calca el init, con las cinco «Reglas de producto» por nombre |
| [operations-template.md](templates/operations-template.md) | `.docs/sdd/steering/operations.md` | Cómo se ejecuta y se verifica: comandos, testing, frontend y entornos; sin versiones |
| [tech-stack-template.md](templates/tech-stack-template.md) | `tech-stack.md` | **2.x: la retira la 0156**, sustituida por `operations-template.md`. Documento de anclaje: lo calca el init |
| [architecture-template.md](templates/architecture-template.md) | `.docs/sdd/steering/architecture.md` (2.x: `.docs/sdd/architecture.md`) | Documento de anclaje: lo calca el init, o quien lo necesite si se pospuso (una feature, `sdd-end-feature` con un aprendizaje estructural, una consulta) |
| [roadmap-template.md](templates/roadmap-template.md) | `ROADMAP.md` en la raíz (2.x: `.docs/sdd/roadmap.md`) | Documento de anclaje: lo calca el init; secciones y cabeceras de tabla literales, porque las leen otras skills |
| [estimation-template.md](templates/estimation-template.md) | `.docs/sdd/steering/estimation.md` (2.x: `.docs/sdd/estimation.md`) | Opt-in del proyecto: activa el módulo de estimación; calibración vacía al nacer |
| [changelog-template.md](templates/changelog-template.md) | `CHANGELOG.md` en la raíz (2.x: `.docs/sdd/changelog.md`) | Opt-in del proyecto (entrevista de init): activa `add-to-changelog`; nace con `## [Unreleased]` y sin entradas |
| [adr-template.md](templates/adr-template.md) | `.docs/sdd/decisions/NNNN-<slug>.md` | El porqué de una decisión difícil de deshacer; inmutable, se sustituye con otra |

## CLI

El código ejecutable del kit es una CLI en Node, `cli/bin/sdd.js`, que viaja con el plugin; no se copia al proyecto. Se invoca `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verbo> <opciones>`; `--help` lista los verbos. Abajo van sin la ruta.

| Verbo | Uso |
| --- | --- |
| `sdd estimation log` | Regenera `estimation-log.md` desde los walkthroughs y patches (`walkthrough.md` §2, `patch.md` §5, `hotfix.md` legacy): `estimation log --root "<raíz del proyecto>"`. Una copia local en el proyecto es deriva. |
| `sdd id next` | Reserva el siguiente id (`0001`–`9999`) en modo `ids.mode: sequence`: `id next --project-root "<raíz>" --reserve [--count N]`. Cerrojo en el directorio común de git y contador compartido entre worktrees: un id reservado no vuelve a salir. Sin `--reserve` solo propone y no escribe (lo usa una consulta). En modo `tracker` sale con error. |
| `sdd merge` | Merge del cierre según la política `merge` de `sdd-kit.json`, con cerrojo por repo, en un worktree temporal `merge-<id>`; regenera `estimation-log.md` si choca y ejecuta `--verify`. Con `--push` empuja la rama destino. Si falla, la deja como estaba. Receta: [merge-recipe](../sdd-end-feature/references/merge-recipe.md): `merge --project-root "<worktree>" [--push] [--verify "<suite>"]`. |
| `sdd capability check` | Valida `capabilities/` (título, secciones, propósito ≤ 300 caracteres, GIVEN/WHEN/THEN, sin marcas de delta, reglas con sus cinco entradas). Con `--artifact`, tras fusionar, comprueba que el bloque «Capacidades» de la spec o del `patch.md` nombra las capacidades de su delta y que cada `ADDED` o `MODIFIED` está en su capacidad: `capability check --path "<raíz>/.docs/sdd" [--artifact "<spec.md o patch.md>"]`. |
| `sdd capability merge` | Fusiona el delta de una spec o `patch.md` en `capabilities/` (`ADDED` añade, `MODIFIED` sustituye, `REMOVED` quita, las reglas por nombre; solo pasan los escenarios). Todo o nada: con un fallo no escribe y sale con 1: `capability merge --path "<raíz>/.docs/sdd" --artifact "<spec.md o patch.md>"`. |
| `sdd capability index` | El índice de `capabilities/`, al vuelo: una línea `` - `<nombre>` — <propósito> `` por capacidad, o `(sin propósito)`. Lo usan `sdd-start-feature`, `sdd-roadmap` y `sdd-explore` antes de elegir qué leer. Sale siempre con 0: `capability index --path "<raíz>/.docs/sdd"`. |
| `sdd decision check` | Valida las ADR de `decisions/` (nombre, `status`, `date`, `rutas`, secciones en orden, números sin repetir); una línea por fallo y sale con 1: `decision check --path "<raíz>/.docs/sdd"`. |
| `sdd decision index` | Lista las ADR; con `--files`, solo las `accepted` y `proposed` cuyas `rutas` casan con esos ficheros. Sale siempre con 0: `decision index --path "<raíz>/.docs/sdd" [--files <fichero>]…`. |
| `sdd roadmap check` | Valida que `roadmap.md` tiene la forma de `roadmap-template.md` (secciones, orden, tablas, cabeceras y estados, nada saldado tras la última release cerrada). Una línea por fallo y sale con 1; sin fallos, `Roadmap válido`. Bloquea el corte de `sdd-end-release`; en los demás cierres avisa de lo heredado: `roadmap check --path "<raíz>/.docs/sdd"`. |
| `sdd roadmap publish` | Commitea en la rama de integración los ficheros de `.docs/sdd/` que se le pasan, con el cerrojo de `sdd merge`: `roadmap publish --project-root "<raíz>" --message "<mensaje>" [--into <rama>] <ficheros>`. Lo usa `sdd-roadmap`. |
| `sdd session tokens` | Mide los tokens y el coste de las sesiones de Claude Code de un worktree: `session tokens --path <worktree> --branch <rama>`. Lo usa `sdd-end-feature`. |
| `sdd watch subagent` | Vigila el transcript de un subagente y termina cuando se cuelga o acaba: `watch subagent --description "<description del despacho>"`. |
| `sdd watch command` | Vigila la salida de un comando en segundo plano y termina si se queda en silencio: `watch command --path <fichero de salida>`. |
| `sdd workspace` | Resuelve y crea el workspace de SDD de un plan: `workspace <plan>`. |
| `sdd task start` | Abre una task Native y registra el commit base: `task start <plan> <n>`. |
| `sdd task done` | Ejecuta la «Verificación» de una task y, si pasa, la anota en el ledger: `task done <plan> <n> <base> -- <comando…>`. |
| `sdd task brief` | Extrae el texto de una task del plan a un fichero: `task brief <plan> <n> <out>`. |
| `sdd review package` | Genera el paquete de revisión de un rango de commits: `review package <plan> <base> <head> <out>`. |
| `sdd ledger rulings` | Lista los rulings y los minor diferidos del ledger de un plan: `ledger rulings <plan>`. Lo usan `sdd-start-feature` y `sdd-end-feature`. |
| `sdd hook session-start` | Escribe el contexto de arranque de sesión; lo ejecuta `hooks/hooks.json`, no las skills. |

Reglas al usarlas:

- **Calcar la estructura** (mismas secciones, mismo orden); los bloques de ayuda en citas (`>`) se borran al redactar.
- **Estructura 3.0.0**: `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md` en la raíz del proyecto; en `.docs/sdd/`, `steering/` (constitution, operations, architecture, estimation), `decisions/`, `capabilities/`, `changes/` y `releases/vX.Y.Z/`. Los artefactos de feature, patch y propuesta, en `changes/<yyyyMMdd-HHmmss>-(feature|patch|proposal)-<id>-<slug>/`. Las carpetas de `specs/` anteriores a la 3.0.0 se leen y no se mueven (y las `-task-` anteriores a la 2.0.0 no se renombran); un proyecto aún en la 2.x sigue con sus documentos en `.docs/sdd/` y sus artefactos en `specs/`.
- Las secciones marcadas *(si el módulo está activo)* se rigen por los predicados del proyecto (`estimation.md`, `changelog.md` presentes o no).
- **Modo lite**: la spec se calca de la MISMA plantilla ligera (decisiones · Intent/Scope/Approach · delta · aprobaciones) y añade el bloque «Estimación y esfuerzo», que en modo full vive en `plan.md`. No existe ni se crea un `spec-lite-template.md`: una segunda plantilla es deriva instantánea (Art. VIII).
- Al redactar el artefacto, sustituir los huecos `<proyecto>` (stack, comandos de build, artículos de constitution) por los valores reales del proyecto (`tech-stack.md`, `constitution.md`).
