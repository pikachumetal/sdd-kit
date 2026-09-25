---
name: sdd-start-patch
description: Usar cuando llega un bug pequeño y determinista (<30 min, sin interpretación de requisitos) en un proyecto con carpeta .docs/sdd/ — "arregla este bug", "hay un bug…, arréglalo", "métele un patch", un ticket de fallo puntual. No para features ni para bugs que exigen interpretar requisitos (eso es sdd-start-task).
argument-hint: "<id o descripción del bug>"
---

# sdd-start-patch

## Overview

Un **patch** es un fix pequeño y **determinista** (sin interpretación de requisitos), típicamente de menos de 30 minutos. NO pasa por spec → plan → tasks → walkthrough — sería overengineering. Deja constancia legible y portable en un único `patch.md`.

> El nombre del carril (**patch**) es independiente del tipo de rama git-flow: un patch puede salir como `feature/*` o `hotfix/*` según lo que fije el git-flow del proyecto. El carril describe el *proceso ligero*, no de dónde ramificas.

## ¿Es de verdad un patch?

```dot
digraph decision {
    "¿Toca una feature cuyo walkthrough sigue abierto?" [shape=diamond];
    "¿Determinista, <30 min, sin interpretar requisitos?" [shape=diamond];
    "Apéndice 'Post-release fixes' en el walkthrough de esa feature" [shape=box];
    "Es una TASK: usa sdd-start-task" [shape=box];
    "PATCH: este flujo" [shape=box];

    "¿Toca una feature cuyo walkthrough sigue abierto?" -> "Apéndice 'Post-release fixes' en el walkthrough de esa feature" [label="sí"];
    "¿Toca una feature cuyo walkthrough sigue abierto?" -> "¿Determinista, <30 min, sin interpretar requisitos?" [label="no"];
    "¿Determinista, <30 min, sin interpretar requisitos?" -> "PATCH: este flujo" [label="sí"];
    "¿Determinista, <30 min, sin interpretar requisitos?" -> "Es una TASK: usa sdd-start-task" [label="no"];
}
```

Que quien reporta "crea saber la causa" NO convierte el bug en determinista: la causa la determina tu investigación, no el reporte.

## Flujo (crea un todo por paso)

1. **Causa raíz OBLIGATORIA** — `superpowers:systematic-debugging` ANTES de proponer el fix. Nada de parchear el síntoma, y nada de implementar la hipótesis del reporte sin confirmarla con evidencia en el código. Si la investigación revela que la causa exige interpretar requisitos, o el fix crece más allá de lo puntual → STOP: era una task, cambia a `sdd-start-task`.

   Si la investigación **no reproduce el fallo** sobre la base actual → STOP también, sin abrir el patch: ni rama, ni carpeta, ni `patch.md`, ni fix, ni id reservado. Si la petición viene de una fila del roadmap, déjala re-medida: las celdas que el resultado contradice se reescriben con la fecha y la evidencia nuevas, porque añadir la medición y dejar el texto viejo no basta. Díselo al usuario. Si reproduce un fallo **distinto** del que predice el ticket o la fila, no es este caso: el patch sigue con el fallo medido.
2. **Carpeta** — `.docs/sdd/specs/<yyyyMMdd-HHmmss>-patch-<id>-<slug>/` (timestamp UTC: `Get-Date -AsUTC -Format 'yyyyMMdd-HHmmss'`; `<id>` según el modo de `.docs/sdd/sdd-kit.json` (`ids.mode`; sin campo ⇒ `tracker`): en `tracker`, el ticket y `0000` si no hay; en `sequence`, el id reservado en la fila del roadmap, o el que reserva `Get-NextSddId.ps1 -Reserve` si no tiene fila (sin `-Reserve` solo propone, y otro worktree puede coger el mismo) — comparte secuencia con las tasks y nunca reutiliza un id entre carriles (detalle en `sdd-start-task/references/nombrado.md`)). Los artefactos viven SOLO ahí: no existe `.docs/sdd/patches/` ni ninguna otra ubicación, por ordenada que parezca. Si estás en una rama sin id (`feature/fix-sala`) y sin commits propios, renómbrala con `git branch -m feature/<id>-<slug>` antes del commit del fix y dilo: sin esa regla, 2 de 2 sujetos commitearon en `feature/fix-sala` (`tests/sdd-plan-red.md`, p8b). Detalle en `nombrado.md`.
3. **`patch.md`** — calcando `patch-template.md` del skill `sdd-templates`: síntoma (lo reportado, literal; si la investigación midió otro, también el medido y en qué difiere del reportado), causa raíz (lo que TÚ encontraste, con la evidencia), fix, verificación, tiempo.
4. **Fix mínimo** — sin refactor oportunista, aunque la deuda esté a un renglón de distancia. Verificar que el build del proyecto pasa.
5. **Commit del fix** — un solo commit con el código, los tests y `patch.md`, con la convención del proyecto y referenciando el ticket; si hubo intermedios, se juntan ([commit-milestones.md](../sdd-start-task/references/commit-milestones.md)).
6. **Cierre** — `sdd-end-patch`.

## Red flags — STOP

- Estás implementando la hipótesis de quien reporta sin haberla confirmado en el código.
- Vas a crear el documento fuera de `.docs/sdd/specs/` o en una carpeta sin prefijo `patch-`.
- El "fix" ya toca varios módulos o interpreta requisitos → era una task.
- `patch.md` sin causa raíz con evidencia, o con el tiempo en blanco.
- Vas a abrir rama o carpeta de un patch cuyo fallo no has reproducido.

| Racionalización | Realidad |
| --- | --- |
| "Operaciones ya sabe la causa" | El reporte describe el síntoma. La causa la determina tu investigación con evidencia en el código. |
| "Es un fix de una línea, no hace falta documento" | Una línea sin rastro es una regresión esperando repetirse. El `patch.md` cuesta 2 minutos. |
| "No quiero abrir una tarea entera" | Correcto: patch ≠ tarea entera. Pero patch ≠ sin proceso: causa raíz + `patch.md` + cierre. |
| "Lo pongo en `.docs/sdd/patches/`, queda más ordenado" | Una segunda ubicación es deriva instantánea. SOLO `.docs/sdd/specs/`. |
| "No se reproduce, pero dejo el patch como cobertura y rastro documental" | Un patch sin fallo consume id, rama y carpeta para nada: 2/2 sujetos del RED lo hicieron (`tests/fewer-stops-red.md`, s5). Se para, y la fila queda re-medida. |
