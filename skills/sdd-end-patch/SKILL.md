---
name: sdd-end-patch
description: Usar cuando un patch está implementado y verificado y hay que cerrarlo — "cierra el patch", fix aplicado con su patch.md en .docs/sdd/specs/. No para tasks (eso es sdd-end-task).
---

# sdd-end-patch

## Overview

Cierre **ligero** de un patch: el subconjunto de `sdd-end-task` sin la ceremonia de una feature. Ligero no significa opcional — son seis pasos y caben en minutos; el séptimo es una oferta.

**Cláusula de escalada**: si el "fix" creció a algo no trivial (varios módulos, interpretación de requisitos), era una task: ciérralo con `sdd-end-task` y deja constancia del cambio de carril.

## Checklist (crea un todo por paso)

1. **`patch.md` finalizado** — commit hash real, verificación con el smoke real (distinguiendo lo verificado por ti de lo reportado por el usuario) y tiempo invertido. Nunca en blanco.
2. **Commit(s)** — con la convención del proyecto, referenciando el ticket. Fix y documentación pueden ir en commits separados.
3. **Changelog** *(si existe `.docs/sdd/changelog.md`)* — entrada `Fixed` en `[Unreleased]` (o en la unidad de release del proyecto) con link a la carpeta del patch.
4. **`roadmap.md`** — fila en la tabla de patches (fecha, id, descripción). El roadmap es el índice del proyecto: un patch sin fila es invisible. Si el patch salda una fila de «Deuda técnica» o de «Backlog», ciérrala con el formato de cierre de `roadmap-template.md` (`sdd-templates`): prefijo al principio y texto original intacto.
5. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — ejecuta el script del kit: `pwsh -NoProfile -File "<Base directory de esta skill>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. Regenera el log desde `patch.md` (§5 Tiempo): no añadas la fila a mano ni uses una copia local del proyecto (`.tools/sdd/`, `tools/sdd/` son copias antiguas: avísalo). Solo sin `pwsh`, o si el script no está en esa ruta (instalación parcial de una sola skill), fila a mano (tipo, estimado si lo hubo, real) y dilo en el informe.
6. **Rama** — *(si existe `.docs/sdd/environments.md`)* `env:clean` **ANTES** de `finishing-a-development-branch`, para no dejar el entorno del worktree huérfano. Luego `superpowers:finishing-a-development-branch`, aplicando la política de merge igual que el paso 10 de `sdd-end-task`: lee el bloque `merge` de `.docs/sdd/sdd-kit.json` y sigue la fila «Merge a develop» de la [tabla de gates](../sdd-start-task/references/control-profiles.md). Con el bloque completo y perfil `delegate` o `unattended`, fusiona en `merge.into` sin preguntar, con `--no-ff` si `merge.noFf` es `true`; con el bloque ausente o incompleto, o en `pair`, el merge lo decide el usuario. Si el usuario no está para decidirlo, deja la rama lista (commits hechos, working tree limpio) y el merge explícitamente PENDIENTE en tu informe final — no fusiones por tu cuenta "porque es trivial". **Si `git worktree list` no muestra la rama destino sacada en ningún worktree, sigue la [receta del merge](../sdd-end-task/references/merge-recipe.md) en lugar de la opción 1 de `finishing-a-development-branch`**: worktree temporal `merge-<id>` en la carpeta del worktree del patch, nunca en el scratchpad, en `%TEMP%` ni cambiando de rama el patch, y retirado con `git worktree remove`. Un conflicto en `estimation-log.md` se regenera con el script, nunca a mano. Si el entorno deniega el merge, no lo reintentes: el informe cita el comando literal, el texto de la denegación y el hash de la rama destino. Push y creación de PR se confirman siempre.
7. **Ticket para el kit** — ofrece generar el ticket de mejora del kit con `sdd-feedback` en esta misma sesión: al limpiar el contexto se pierde lo aprendido sobre el kit. No es un gate — sin respuesta, el cierre termina y no queda nada pendiente ni anotado. Si esta sesión ya generó su ticket, no se ofrece otra vez.

## Red flags — STOP

- Vas a fusionar sin que el usuario lo haya decidido ni el bloque `merge` de `sdd-kit.json` lo declare, o a fusionar a `main`.
- La tabla de patches del roadmap no tiene la fila de este patch.
- `patch.md` sin commit hash o con el tiempo en blanco.

| Racionalización | Realidad |
| --- | --- |
| "Es trivial y hay urgencia: fusiono y listo" | La urgencia es la causa nº1 de merges rotos. Fusiona solo si lo decidió el usuario o lo declara el bloque `merge`; si no, deja la rama lista. |
| "El roadmap ya se actualizará" | La fila cuesta 30 segundos ahora; luego nadie se acuerda. |
| "Ya está todo en el patch.md" | El `patch.md` documenta; el changelog y el roadmap indexan. Sin ellos, el patch es invisible. |
