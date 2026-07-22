---
name: add-to-changelog
description: Usar al cerrar una task o patch en un proyecto con .docs/sdd/changelog.md, o cuando el usuario pide poner al día el changelog — normalmente invocada desde sdd-end-task o sdd-end-patch.
---

# add-to-changelog

## Overview

`changelog.md` es el changelog **técnico** del proyecto (Keep a Changelog 1.1.0) y la base del changelog de cliente. Es *backward-looking*: registra lo ya hecho. El `roadmap.md` es *forward-looking*: son registros distintos que se actualizan por razones distintas — tocar uno no sustituye al otro.

## Formato de entrada (contrato)

Cada entrada es **una línea** con esta forma exacta:

```markdown
- **<id>** — <qué cambió, en una frase>. → [ref](specs/<carpeta-del-artefacto>/)
```

- `<id>`: el ticket o módulo (`Ticket 217`, `M4`).
- La frase describe el cambio para un lector técnico. El detalle (causa, evidencia, decisiones) vive en la carpeta enlazada, no aquí.
- `→ [ref](…)` apunta a la carpeta de spec o patch en `specs/`. Si el cambio no tiene carpeta (cambio de una frase), la entrada va **sin link** — nunca se inventa una ruta.

## Dónde va

- Bajo la sección de release activa: `## [Unreleased]` por defecto (SemVer). Si el changelog del proyecto usa `## [Bn] — en curso`, la unidad de release es el **bundle**: localiza la sección activa y no inventes numeración SemVer.
- En su categoría, manteniendo el orden Keep a Changelog: `Added` · `Changed` · `Deprecated` · `Removed` · `Fixed` · `Security` (solo se crean las categorías que tienen entradas).

| Cambio | Categoría |
| --- | --- |
| Funcionalidad nueva | Added |
| Comportamiento, dependencia o versión que cambia | Changed |
| Algo marcado para desaparecer | Deprecated |
| Algo eliminado | Removed |
| Bug corregido | Fixed |
| Vulnerabilidad | Security |

## Errores comunes

| Error | Correcto |
| --- | --- |
| Entrada de varias líneas contando causa y detalle | Una frase + link: el detalle vive en la carpeta del artefacto |
| Inventar un link para un cambio sin carpeta | Entrada sin link |
| Cortar una versión nueva (`[0.2.0]`) al añadir la entrada | Cortar release es decisión del usuario y lo ejecuta `sdd-end-release`, no esta acción |
| Registrar aquí deuda técnica diferida | La deuda va al roadmap |
| Dar el roadmap por actualizado "porque ya toqué el changelog" | Cada registro se actualiza por su propio motivo |
