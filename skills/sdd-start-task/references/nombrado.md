## Nombrado de carpetas de spec

`<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>`, todo en UTC:

- Timestamp: `Get-Date -AsUTC -Format 'yyyyMMdd-HHmmss'` (PowerShell).
- `task` o `patch` según el carril. Una carpeta que contiene `patch.md` SIEMPRE va prefijada `patch-`.
- `<id>`: el id del ticket en el gestor del proyecto. **Nunca el nombre de un módulo** ("M4" no es un id). Si no hay ticket: `0000`.
- `<slug>`: kebab-case corto descriptivo.

## Módulos por predicado observable (no preguntes: observa el proyecto)

| Si existe… | Entonces… |
| --- | --- |
| `.docs/sdd/estimation.md` | Bloque "Estimación y esfuerzo" obligatorio en `plan.md`, y tiempo real obligatorio en `walkthrough.md` |
| `.docs/sdd/changelog.md` | Entrada vía `add-to-changelog` durante el cierre |
| `.docs/sdd/architecture.md` | Se lee en el paso 1 |
