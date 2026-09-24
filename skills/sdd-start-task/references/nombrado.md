## Nombrado de carpetas de spec

`<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>`, todo en UTC:

- Timestamp: `Get-Date -AsUTC -Format 'yyyyMMdd-HHmmss'` (PowerShell).
- `task` o `patch` según el carril. Una carpeta que contiene `patch.md` SIEMPRE va prefijada `patch-`.
- `<id>`: depende del modo declarado en `.docs/sdd/sdd-kit.json` (`ids.mode`; sin campo ⇒ `tracker`). En `tracker`: el id del ticket en el gestor del proyecto, `0000` si no hay. En `sequence`: el id reservado en la fila del roadmap de la task o el patch, o, si no tiene fila, el que reserva `Get-NextSddId.ps1 -ProjectRoot <raíz del proyecto> -Reserve`. Sin `-Reserve` el script solo propone un id, y otro worktree que calcule a la vez se lleva el mismo. **Nunca el nombre de un módulo** ("M4" no es un id).
- Tasks y patches comparten **una sola secuencia**: un id no se repite entre carriles. Una task partida toma un **id reservado** con `Get-NextSddId.ps1 -Reserve`, con `parent: <id>` en el frontmatter **y su fila propia en el roadmap** — nunca un sufijo tipo `0006a`. Sin esa fila, la relación entre las dos mitades se pierde en cuanto se cierra la sesión.
- `<slug>`: kebab-case corto descriptivo.

## Módulos por predicado observable (no preguntes: observa el proyecto)

| Si existe… | Entonces… |
| --- | --- |
| `.docs/sdd/estimation.md` | Bloque "Estimación y esfuerzo" obligatorio en `plan.md`, y tiempo real obligatorio en `walkthrough.md` |
| `.docs/sdd/changelog.md` | Entrada vía `add-to-changelog` durante el cierre |
| `.docs/sdd/architecture.md` | Se lee en el paso 1. Si falta y la task tiene que crearlo, se calca de `architecture-template.md` de `sdd-templates` |
