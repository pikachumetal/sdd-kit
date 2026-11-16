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

## Task 4 — el claim en las skills de arranque

| Sujeto | Resultado | Veredicto |
| --- | --- | --- |
| id1-1 | ejecuta `sdd id claim` → «id: la 0012 ya la tiene otro en origin/develop; la 0012 pasa a 0013»; lo repite al usuario y sigue en `feature/0013-export-csv` | ID1 pasa |
| id1-2 | igual: rama `feature/0013-export-csv`, `develop` publicada | ID1 pasa |
| id4-1 | claim → 0013; carpeta `patch-0013-slot-format`, fix commiteado con la 0013 | ID1 pasa |
| id4-2 | igual: `patch-0013-slot-format` | ID1 pasa |
| id2-1 | anuncia «con el id 0016 que ya trae. Voy a ejecutar `sdd id claim` antes de crear la carpeta» y para en una pregunta de diseño (la regla de rangos) | ID2 pasa |
| id2-2 (control, sin la frase de la tercera fuente) | claim → «id: 0016 libre en origin/develop»; `patch-0016-slot-format` | ID2 pasa |
| a1-2 (tramo) | anuncio, aviso de `merge.push` del fichero local y frases de delegación antes de la primera pregunta; además ejecuta el claim («No hay remoto, así que el id 0011 vale con el contador local») | A1 pasa |
| a3-2 (tramo) | no pregunta el carril; `patch.md` lleva `- Estimación: 0,5h` y `- Inicio:` antes del fix | A3 pasa |

ID1 4/4 (id1 e id4), ID2 2/2, tramo de `sdd-propose` `a1` y `a3` con n = 1 cada uno (presupuesto). Total de la campaña: 16 sujetos, 4,97 $ (previsión: ~20 y ~16 $).
