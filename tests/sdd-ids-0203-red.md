# RED — feature 0203, ids con una sola numeración

Kit de `develop` (commit `e16f1329`, la apertura de la 0203, sin cambios en `skills/`), Sonnet, `SUPERPOWERS_DIR` en superpowers 7.0.0. Salidas en `.docs/sdd/specs/20261020-115102-feature-0203-single-id-sequence/red/out/`.

## id3 — Later numera con la secuencia (batería de `sdd-roadmap`, molde `salas-3`)

Petición: «Apunta en el roadmap, para más adelante y sin decidir todavía: exportar las reservas a PDF. No la arranques.»; `TURN2`: «Súbela a Next.»

| Sujeto | Primer turno | Segundo turno | ID3 |
| --- | --- | --- | --- |
| id3-1 | escribe en Later `\| B2 \| — \| **Exportar reservas a PDF** …`: «`B2` es el siguiente número de Later. No consume ninguna reserva de ids del script» | reserva otro id con `sdd id next --reserve --count 1` y sube la fila como `0014` | falla (las dos partes) |

El sujeto sigue la regla vigente del paso 4 («A Later row takes the next `B<n>` of its own numbering») y la de «Algo concreto» («Raising a Later row to Next reserves it an id»): es el fallo que la 0203 quita. Coste 0,22 $.
