# GREEN — feature 0203, ids con una sola numeración

Kit de la rama `feature/0203-single-id-sequence` (working tree), Sonnet, `SUPERPOWERS_DIR` en superpowers 7.0.0. Salidas en `.docs/sdd/specs/20261020-115102-feature-0203-single-id-sequence/green/out/`. Escenarios y RED en [sdd-ids-0203-red.md](sdd-ids-0203-red.md).

## Task 1 — Later con id de la secuencia

| Sujeto | Resultado | Veredicto |
| --- | --- | --- |
| id3-1 | Later `\| 0014 \| — \| **Exportar reservas a PDF** …`, «el 0014 lo reservé con `sdd id next --reserve`»; tras «Súbela a Next.», «Conserva el id 0014» | ID3 pasa |
| id3-2 | Later `0014`, «El id salió de `sdd id next --reserve`»; en Next sigue como `0014` | ID3 pasa |
| m5-1 (humo) | propone en Next la fila nueva con título, one-liner, brief de cinco etiquetas, `⏳` y tamaño `S`, y espera, como pide el paso 3 en `delegate` | M5 pasa |

ID3: 2/2 (umbral 2/2). Humo de `sdd-roadmap`: 1/1.

**Ruido del molde**: `salas-3` trae una fila heredada `B1` en Later. Con el `check` nuevo, en `sequence` falla («el id «B1» no es de la secuencia…»), y los tres sujetos la nombran como forma heredada que no tocan, sin bloquearse. El molde no se cambia en esta campaña para comparar con el RED en las mismas condiciones. Coste de la tanda: 0,90 $ acumulados con el RED (4 sujetos).
