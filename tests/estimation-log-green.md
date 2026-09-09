# Evidencia GREEN — estimation-log desde el kit (2026-09-09)

Verificación de la guidance escrita a partir de [estimation-log-red.md](estimation-log-red.md). Misma fixture "Ledgerly-est", mismos dos escenarios y mismas peticiones neutras; copias frescas `green-e1` / `green-e2` con git propio. Sujetos Sonnet, `Agent` en paralelo, con el texto **editado** de `sdd-end-task/references/estimacion.md` (paso 3) y `sdd-end-patch/SKILL.md` (paso 5) pegado por prompt junto a la línea `Base directory for this skill:` del harness. Estado final verificado en disco.

## Lo que cambió en las skills

Una frase por skill, la misma en las dos: ejecutar `pwsh -NoProfile -File "<Base directory de esta skill>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`; no añadir filas a mano ni usar copia local del proyecto (`.tools/sdd/`, `tools/sdd/` son copias antiguas: avisar); si el script avisa de que el artefacto no se lee, corregir el bloque de tiempo, no el script; fila a mano solo sin `pwsh`.

## Veredicto contra cada fallo del RED

### F1 — Ninguno ejecutaba el script del kit → **resuelto 2/2**

| Comprobación | E1 (`sdd-end-task`) | E2 (`sdd-end-patch`) |
| --- | --- | --- |
| Ejecutó el script del kit | ✅ `pwsh -NoProfile -File "D:\code\git\sdd-kit\skills\sdd-templates\scripts\Build-EstimationLog.ps1" -Root "<proyecto>"` | ✅ mismo comando |
| Resolvió la ruta desde el Base directory | ✅ (`Glob` sobre `sdd-templates`) | ✅ |
| Comprobó copia antigua en `.tools/sdd` / `tools/sdd` | ✅ «confirmado que no hay copia antigua» | — (no lo reportó; la fixture no tenía copia) |
| `estimation-log.md` | ✅ regenerado: cabecera AUTO-GENERADO, 3 filas (`0042 \| backend \| 2 \| 1.2 \| 0.6`), factor global 0.72 y tabla por Tipo | ✅ regenerado: cabecera, 3 filas (`0000 \| patch \| — \| 0.33 \| —`), factor 0.83 |
| Editó el log a mano | ❌ («No editado a mano») | ❌ |
| Commit | `bfcb4a7` | `367e655` |
| Merge | pendiente del dev-lead (Art. II de la fixture) | pendiente del dev-lead |

### F2 — El hueco de un artefacto vecino no se veía → **el warning llega al usuario** (E1)

En `green-e1` el patch `null-date` seguía con placeholders en §5. El script avisó, y el sujeto lo hizo exactamente como dice la guidance: no tocó el script, dejó el patch fuera de su alcance y **lo señaló como pendiente del dev-lead** («afecta a la calibración general»). En el RED ese hueco era invisible.

## Positivos que se conservan

- Ambos verificaron `npm test` por su cuenta, corrigieron el hash de commit falso de la fixture (`c0ffee1`→`96b1f89`, `d00d1e5`→`656b5cc`) y distinguieron verificado/reportado.
- E1 mantuvo la desviación (−40 %) con causa inferida y marcada como pendiente; no fusionó `funcional/exportacion.md` porque la spec no lo declaraba. Nada de lo que la guidance nueva no cubre se degradó respecto al RED.

## Huecos de la propia guidance

Ninguno observado en 2/2. No medido: el aviso ante una copia antigua en `.tools/sdd/` (la fixture no la tenía; E1 lo comprobó de forma espontánea, E2 no lo mencionó). Se deja anotado como escenario pendiente para la próxima campaña que toque estas skills.

## Anotación de método

El GREEN corrió con el script en el estado del commit `809a8da` (antes de la ronda de arreglos de la revisión de Task 1: gate de sección en `patch.md`, fallback de id para `hotfix`). Ninguno de los dos arreglos afecta a lo medido aquí: los dos artefactos de la fixture tienen la sección de tiempo y frontmatter `task:`.
