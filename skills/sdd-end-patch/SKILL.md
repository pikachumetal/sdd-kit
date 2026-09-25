---
name: sdd-end-patch
description: Usar cuando un patch está implementado y verificado y hay que cerrarlo — "cierra el patch", fix aplicado con su patch.md en .docs/sdd/specs/. No para tasks (eso es sdd-end-task).
---

# sdd-end-patch

## Overview

Cierre **ligero** de un patch: el subconjunto de `sdd-end-task` sin la ceremonia de una feature. Ligero no significa opcional — son seis pasos y caben en minutos; el séptimo es una oferta y el octavo, el mensaje final.

**Cláusula de escalada**: si el "fix" creció a algo no trivial (varios módulos, interpretación de requisitos), era una task: ciérralo con `sdd-end-task` y deja constancia del cambio de carril.

## Checklist (crea un todo por paso)

1. **`patch.md` finalizado** — commit hash real —el del commit del fix—, verificación con el smoke real (distinguiendo lo verificado por ti de lo reportado por el usuario) y tiempo invertido. Nunca en blanco.

   **Capacidades** *(si existe `.docs/sdd/capabilities/`)* — abre la capacidad que describe la pieza que tocó el fix y compárala con lo que hace ahora. Si el patch solo devuelve el comportamiento a lo que la capacidad ya decía, no hay delta: no escribas nada y sigue (si `patch.md` trae la sección de delta vacía de la plantilla, bórrala). Si el fix cambió algo observable que la capacidad dice de otra forma o no dice —una salida, un mensaje, un formato, de dónde lee un dato—, escribe el delta en la sección «Delta de capacidad» de `patch.md` y fusiónalo en `capabilities/<capability>.md` igual que el cierre de una task ([aprendizajes-skills.md](../sdd-end-task/references/aprendizajes-skills.md)). Un patch no crea capacidades: si ninguna describe esa pieza, dilo en el mensaje final.
2. **Commit de cierre** — si el fix —código, tests y `patch.md`— llega en más de un commit desde el `merge-base`, júntalo antes en uno con la receta, salvo que salte una guarda, y apunta en `patch.md` el hash del commit juntado. Luego, un solo commit sobre el del fix: `patch.md` con su hash y el tiempo, más changelog, roadmap, estimation-log y las capacidades fusionadas en el paso 1, si existen. El patch queda en dos commits, fix y cierre ([commit-milestones.md](../sdd-start-task/references/commit-milestones.md)).
3. **Changelog** *(si existe `.docs/sdd/changelog.md`)* — entrada `Fixed` en `[Unreleased]` (o en la unidad de release del proyecto) con link a la carpeta del patch.
4. **`roadmap.md`** — fila en la tabla de patches (fecha, id, descripción). El roadmap es el índice del proyecto: un patch sin fila es invisible. Si el patch salda una fila de «Deuda técnica» o de «Backlog», ciérrala con el formato de cierre de `roadmap-template.md` (`sdd-templates`): prefijo al principio y texto original intacto.

   Si `patch.md` re-mide una fila de «Deuda técnica» o de «Backlog» que el patch no salda, y el resultado contradice lo que la fila afirma (su evidencia, su recuento, su propuesta), reescribe esas celdas con la medición nueva, su fecha y un enlace al `patch.md`: la fila ya no puede afirmar lo que la medición desmiente (2/2 la dejaron intacta en `tests/fewer-stops-red.md`, s6).
5. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — ejecuta el script del kit: `pwsh -NoProfile -File "<Base directory de esta skill>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. Regenera el log desde `patch.md` (§5 Tiempo): no añadas la fila a mano ni uses una copia local del proyecto (`.tools/sdd/`, `tools/sdd/` son copias antiguas: avísalo). Solo sin `pwsh`, o si el script no está en esa ruta (instalación parcial de una sola skill), fila a mano (tipo, estimado si lo hubo, real) y dilo en el informe.
6. **Rama** — *(si existe `.docs/sdd/environments.md`)* `env:clean` **ANTES** de `finishing-a-development-branch`, para no dejar el entorno del worktree huérfano. Luego `superpowers:finishing-a-development-branch`, aplicando la política de merge igual que el paso 10 de `sdd-end-task`: lee el bloque `merge` de `.docs/sdd/sdd-kit.json` y sigue la fila «Merge a develop» de la [tabla de gates](../sdd-start-task/references/control-profiles.md). Con el bloque completo y perfil `delegate` o `unattended`, fusiona en `merge.into` sin preguntar, con `--no-ff` si `merge.noFf` es `true`; con el bloque ausente o incompleto, o en `pair`, el merge lo decide el usuario. Si la rama destino está sacada en un worktree con cambios sin commitear, no fusiones ahí: di qué ficheros y para, sin tocarlos. Si el usuario no está para decidirlo, deja la rama lista (commits hechos, working tree limpio) y el merge explícitamente PENDIENTE en tu informe final — no fusiones por tu cuenta "porque es trivial". **El merge lo hace `Invoke-SddMerge.ps1`, con la [receta del merge](../sdd-end-task/references/merge-recipe.md), en lugar de la opción 1 de `finishing-a-development-branch`**. El script coge el cerrojo del repo, integra la base publicada en el remoto, fusiona en un worktree temporal `merge-<id>` junto a los demás y empuja la rama destino por su nombre. Pasa `-Push` si el usuario confirmó el push o, con `merge.push: true` y perfil `delegate` o `unattended`, sin preguntar; en `pair` presentas el push con el merge ([receta](../sdd-end-task/references/merge-recipe.md#push)). Nunca `git merge`, `git pull`, `git push` ni `HEAD:<destino>` a mano, salvo el merge de sincronización de un conflicto solo en los registros ([receta](../sdd-end-task/references/merge-recipe.md#conflicto-solo-en-los-registros)). Si el script falla, el informe cita su mensaje. Si el entorno deniega el merge, no lo reintentes: el informe cita el comando literal, el texto de la denegación y el hash de la rama destino. Cualquier otro push y la creación de PR se confirman siempre.
7. **Ticket para el kit** — decide si ofreces generar el ticket de mejora del kit con `sdd-feedback` en esta misma sesión: se ofrece salvo que esta sesión ya haya generado el suyo, porque al limpiar el contexto se pierde lo aprendido sobre el kit. La oferta va en el mensaje final (paso 8). No es un gate — sin respuesta, el cierre termina y no queda nada pendiente ni anotado.
8. **Mensaje final** — el último mensaje del cierre. Lo que el cierre tiene que decir se reúne aquí, aunque haya nacido en un paso anterior. En este orden, y solo lo que tenga contenido:
   1. Las decisiones tomadas sin el dev-lead en este patch: las que cuente `patch.md` (ábrelo ahora, aunque lo escribiera otra sesión; no lo resumas de memoria) y las que tomaste en este cierre. `patch.md` no tiene sección propia: solo cuenta lo que su texto dice que se decidió sin el dev-lead. Una línea cada una; si no hay ninguna, se omite.
   2. Cada instrucción que el dev-lead dio antes del cierre y cómo quedó.
   3. Lo pendiente, con la evidencia de un merge o un push denegados o fallidos del paso 6.
   4. La oferta del ticket, si el paso 7 la hace.
   5. La línea de terminado, siempre la última. Con la rama fusionada en `merge.into` y el worktree del patch sin cambios sin commitear: `**Terminado.** <rama> fusionada en <destino> (<hash>) · push: <hecho a <remoto>/<destino> | no hecho: <motivo>> · puedes borrar el worktree <ruta>`, por ejemplo `**Terminado.** feature/0213 fusionada en develop (d4e5f6a) · push: no hecho: merge.push no lo autoriza · puedes borrar el worktree D:\work\billing\0213`. Si no: `**No terminado.** Falta <qué>. No borres todavía el worktree <ruta>.` Un push fallido o no autorizado no cambia la línea: la rama ya está fusionada y el worktree se puede borrar, y el motivo va en «push: no hecho». «No terminado» es solo para un merge que falta o un worktree con cambios sin commitear. Solo se borra un worktree enlazado: si la rama está en el checkout principal del repo (`git rev-parse --git-dir` y `git rev-parse --git-common-dir` dan la misma ruta), la línea acaba en el push, sin cláusula de borrado.

   Si el dev-lead acepta después el ticket, al escribirlo repite la línea de terminado: el ticket es un fichero nuevo del worktree, y queda como pendiente hasta que se commitee y se fusione.

## Red flags — STOP

- Vas a fusionar sin que el usuario lo haya decidido ni el bloque `merge` de `sdd-kit.json` lo declare, o a fusionar a `main`.
- La tabla de patches del roadmap no tiene la fila de este patch.
- `patch.md` sin commit hash o con el tiempo en blanco.

| Racionalización | Realidad |
| --- | --- |
| "Es trivial y hay urgencia: fusiono y listo" | La urgencia es la causa nº1 de merges rotos. Fusiona solo si lo decidió el usuario o lo declara el bloque `merge`; si no, deja la rama lista. |
| "El roadmap ya se actualizará" | La fila cuesta 30 segundos ahora; luego nadie se acuerda. |
| "Ya está todo en el patch.md" | El `patch.md` documenta; el changelog y el roadmap indexan. Sin ellos, el patch es invisible. |
