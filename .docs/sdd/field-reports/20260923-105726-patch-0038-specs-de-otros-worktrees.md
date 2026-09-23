---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260923-105726-patch-0038-specs-de-otros-worktrees
task: 0038
mode:
date: 2026-09-23
---

# Ticket para el kit — patch 0038: la validación diferida de un patch no tiene forma escrita y el merge sigue sin decir qué hacer si la rama destino no está sacada

## Contexto

- Carril y modo: patch, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch` y `sdd-end-patch` (las dos cargadas por el harness desde la caché 1.1.0 y contrastadas con las del working tree, que mandan), `sdd-feedback` (solo existe en el working tree; la leí de ahí); `sdd-templates` (`patch-template.md`, `kit-feedback-template.md`, `Get-NextSddId.ps1`, `Build-EstimationLog.ps1`); `control-profiles.md` («Validación diferida»)
- Proyecto: el propio kit (repo de Markdown + scripts PowerShell con Pester), un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,3 h con el cierre
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La validación diferida de un patch no tiene forma en `patch.md` ni en la tabla de patches

- **Qué pasó**: el dev-lead ordenó el cierre con «ya sabes, diferido al uso del kit». `control-profiles.md` fija la forma solo para el walkthrough (`Validación diferida: <fecha> · «<frase>» · disparador: …`) y para la fila de una task (`🧪 validación diferida a <disparador>`, en lugar de ✅). Un patch no tiene walkthrough, y la tabla de patches del roadmap no tiene columna de estado. Improvisé: la línea del walkthrough debajo de la tabla de §4 de `patch.md`, y el prefijo `🧪 validación diferida a …` al principio de la celda «Descripción» de la fila del patch.
- **Dónde en el kit**: `skills/sdd-start-task/references/control-profiles.md`, «Validación diferida» (solo nombra walkthrough y roadmap de task); `skills/sdd-end-patch/SKILL.md` no la menciona; `skills/sdd-templates/templates/patch-template.md` §4 no tiene hueco; `skills/sdd-templates/templates/roadmap-template.md`, tabla de patches.
- **Por qué el kit no lo evitó**: la regla nació para `sdd-end-task` y el cierre del patch no la hereda. El patch 0027 ya difirió al uso diario y lo escribió de otra forma (una fila «diferido por el dev-lead…» dentro de la tabla de verificación): dos patches, dos formas.
- **Coste**: bajo por cierre (~2 min decidiendo dónde ponerlo), pero deja un formato que nadie puede buscar. Cuando el dev-lead valide, no hay regla que diga dónde va la adenda ni cómo se quita el 🧪 de la fila del patch.
- **Propuesta**: en «Validación diferida», una línea para el carril patch: la línea va en `patch.md` §4, debajo de la tabla, y la fila de la tabla de patches empieza por `🧪 validación diferida a <disparador> — `; al validar, adenda fechada en §4 y se quita el prefijo. `sdd-end-patch` paso 1 remite a esa línea, y el paso 1 dice que el disparador concretado va al mensaje final, como en `sdd-end-task` paso 11.
- **Criterio de aceptación**: GIVEN un patch implementado y «diferido, se prueba en uso» del usuario WHEN el agente ejecuta `sdd-end-patch` THEN `patch.md` lleva la línea `Validación diferida:` en §4, la fila de la tabla de patches empieza por `🧪 validación diferida a`, y el mensaje final nombra el disparador concretado. Hoy la forma depende del agente (0027 y 0038 difieren).

### 2. Merge a `develop` sin `develop` sacada en ningún worktree: quinto reporte

- **Qué pasó**: el repo es un bare con worktrees; `develop` no estaba sacada en ninguno. `sdd-end-patch` paso 6 delega en `finishing-a-development-branch`, que supone que se puede hacer `checkout` de la rama destino. Lo resolví con un worktree temporal de `develop`, `merge --no-ff`, `git worktree remove` y push.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 6 y `skills/sdd-end-task/SKILL.md` paso 10. Ninguno lee `merge.into` / `merge.noFf` de `sdd-kit.json`, que solo describe `control-profiles.md`.
- **Por qué el kit no lo evitó**: está en la fila 0009 del roadmap («merge `--no-ff` en un repo bare sin la rama destino en ningún worktree», cuatro reportes), aún pendiente.
- **Coste**: ~1 min; ninguno, salvo que el agente no piense en el worktree temporal y haga `switch` a `develop` en el worktree del patch.
- **Propuesta**: la de la fila 0009. Este reporte suma evidencia, no propone nada nuevo.
- **Criterio de aceptación**: el de la fila 0009.

## Lo que hice por iniciativa propia

- **Smoke del script en el repo real después del fix**: devolvió 0039, porque la carpeta del propio patch 0038 ya estaba creada, y antes de crearla devolvía 0038 (el de la rama). Confirma que el cambio no rompe la regla de la rama actual del patch 0027. No lo pide ninguna skill; cuesta un comando.
- **Worktree temporal para el merge** (hallazgo 2), en `%TEMP%`, borrado justo después del merge.
- **`git fetch` y comparar `origin/develop` con la base antes de fusionar**, por si otro worktree había empujado mientras tanto. Es el «integrar la base otra vez justo antes del merge» de la fila 0009, aplicado a mano.

## Funcionó, no tocar

- La regla 2 del `CLAUDE.md`: el diff enseñó que la copia de la caché de `sdd-start-patch` no tenía el id por modo `sequence` y que la de `sdd-end-patch` no tenía el cierre de filas de deuda ni la oferta del ticket (paso 7). Sin el diff, este ticket no se habría ofrecido: `sdd-feedback` ni siquiera sale en la lista de skills del harness.
- `Get-NextSddId.ps1` devolvió el id de la rama `feature/0038` al arrancar, sin buscarlo a mano.
- El ticket del patch 0037 §1 traía el criterio de aceptación escrito como test: pasó a Pester casi literal y el RED falló por la aserción (`But was: '0006'`) a la primera.
- El pre-commit y el `pre-merge-commit` con la suite entera: 357/0 en los dos commits y en el merge.

## Errores míos, no huecos del kit

- Sin errores propios que reseñar.
