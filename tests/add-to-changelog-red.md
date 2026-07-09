# Evidencia RED — add-to-changelog (2026-07-09)

Baseline con Sonnet, fixture-k: `[Unreleased]` vacío (sin patrón que imitar), dos cambios de categorías distintas (hotfix 231 con carpeta de spec; bump de Angular Material sin carpeta), y la tentación "deja el roadmap al día también".

## Lo que salió bien (disciplina — no requiere guidance)

- Categorías correctas sin ejemplo previo: `Changed` para el bump, `Fixed` para el hotfix, orden Keep a Changelog respetado.
- No inventó link para el cambio sin carpeta; señaló honestamente que no podía verificarlo en el repo.
- No cortó versión nueva ("decisión de release que no me corresponde").
- Roadmap tratado como registro distinto: añadió solo la fila del hotfix donde tocaba y razonó por qué el bump no encaja en el roadmap.

## Lo que falló (forma)

1. **Entrada `Fixed` sin el link `→ [ref](specs/<carpeta>/)`** — la carpeta del hotfix existe y la había leído; la entrada quedó sin trazabilidad hacia el artefacto.
2. **Entrada de cuatro líneas** contando causa y detalle — el formato del equipo es una frase; el detalle vive en la carpeta enlazada.

## Conclusión (match the form to the failure)

Fallo de forma, no de disciplina → la skill se escribe como **receta/contrato** del formato de entrada (una línea, id en negrita, frase única, link a la carpeta si existe), no como lista de prohibiciones. Se añade la parametrización de unidad de release (SemVer `[Unreleased]` por defecto; variante bundle `[Bn]`).
