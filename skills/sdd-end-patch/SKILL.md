---
name: sdd-end-patch
description: Usar cuando un patch está implementado y verificado y hay que cerrarlo — "cierra el patch", fix aplicado con su patch.md en .docs/sdd/specs/. No para tasks (eso es sdd-end-task).
---

# sdd-end-patch

## Overview

Cierre **ligero** de un patch: el subconjunto de `sdd-end-task` sin la ceremonia de una feature. Ligero no significa opcional — son seis pasos y caben en minutos.

**Cláusula de escalada**: si el "fix" creció a algo no trivial (varios módulos, interpretación de requisitos), era una task: ciérralo con `sdd-end-task` y deja constancia del cambio de carril.

## Checklist (crea un todo por paso)

1. **`patch.md` finalizado** — commit hash real, verificación con el smoke real (distinguiendo lo verificado por ti de lo reportado por el usuario) y tiempo invertido. Nunca en blanco.
2. **Commit(s)** — con la convención del proyecto, referenciando el ticket. Fix y documentación pueden ir en commits separados.
3. **Changelog** *(si existe `.docs/sdd/changelog.md`)* — entrada `Fixed` en `[Unreleased]` (o en la unidad de release del proyecto) con link a la carpeta del patch.
4. **`roadmap.md`** — fila en la tabla de patches (fecha, id, descripción). El roadmap es el índice del proyecto: un patch sin fila es invisible.
5. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — ejecuta el script del kit: `pwsh -NoProfile -File "<Base directory de esta skill>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. Regenera el log desde `patch.md` (§5 Tiempo): no añadas la fila a mano ni uses una copia local del proyecto (`.tools/sdd/`, `tools/sdd/` son copias antiguas: avísalo). Solo sin `pwsh`, fila a mano (tipo, estimado si lo hubo, real).
6. **Rama** — *(si existe `.docs/sdd/environments.md`)* `env:clean` **ANTES** de `finishing-a-development-branch`, para no dejar el entorno del worktree huérfano. Luego `superpowers:finishing-a-development-branch`: la decisión de merge/PR es **del usuario**. Si no está disponible, deja la rama lista (commits hechos, working tree limpio) y el merge explícitamente PENDIENTE en tu informe final — no fusiones por tu cuenta "porque es trivial".

## Red flags — STOP

- Vas a fusionar a develop/master sin que el usuario lo haya decidido.
- La tabla de patches del roadmap no tiene la fila de este patch.
- `patch.md` sin commit hash o con el tiempo en blanco.

| Racionalización | Realidad |
| --- | --- |
| "Es trivial y hay urgencia: fusiono y listo" | La urgencia es la causa nº1 de merges rotos. Deja la rama lista; fusionar es decisión del usuario. |
| "El roadmap ya se actualizará" | La fila cuesta 30 segundos ahora; luego nadie se acuerda. |
| "Ya está todo en el patch.md" | El `patch.md` documenta; el changelog y el roadmap indexan. Sin ellos, el patch es invisible. |
