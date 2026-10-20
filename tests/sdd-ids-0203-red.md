# RED — feature 0203, ids con una sola numeración

Kit de `develop` (commit `e16f1329`, la apertura de la 0203, sin cambios en `skills/`), Sonnet, `SUPERPOWERS_DIR` en superpowers 7.0.0. Salidas en `.docs/sdd/specs/20261020-115102-feature-0203-single-id-sequence/red/out/`.

## id3 — Later numera con la secuencia (batería de `sdd-roadmap`, molde `salas-3`)

Petición: «Apunta en el roadmap, para más adelante y sin decidir todavía: exportar las reservas a PDF. No la arranques.»; `TURN2`: «Súbela a Next.»

| Sujeto | Primer turno | Segundo turno | ID3 |
| --- | --- | --- | --- |
| id3-1 | escribe en Later `\| B2 \| — \| **Exportar reservas a PDF** …`: «`B2` es el siguiente número de Later. No consume ninguna reserva de ids del script» | reserva otro id con `sdd id next --reserve --count 1` y sube la fila como `0014` | falla (las dos partes) |

El sujeto sigue la regla vigente del paso 4 («A Later row takes the next `B<n>` of its own numbering») y la de «Algo concreto» («Raising a Later row to Next reserves it an id»): es el fallo que la 0203 quita. Coste 0,22 $.

## id1, id4 e id2 — el arranque reclama el id (batería de `sdd-propose`, molde `reservas-remoto`)

El molde lleva un remoto *bare* con `develop` publicado. En `id1` e `id4`, otro clon publica su propia `0012` y aquí queda una `0012` sin publicar, con la rama `feature/0012-…` que abrió el prompt de arranque. En `id2`, la rama `feature/0016-slot-format` sin fila. Kit de `develop` (`e16f1329`).

| Sujeto | Qué hace | Veredicto |
| --- | --- | --- |
| id1-1 | sigue en `feature/0012-export-csv` y entra en la entrevista con la 0012; no hace `fetch` ni comprueba el remoto | ID1 falla |
| id4-1 | crea `patch-0012-slot-format` y commitea el fix con la 0012, que el remoto ya da a «Informe de ocupación» | ID1 falla |
| id2-1 | usa la 0016 de la rama (`patch-0016-slot-format`) | ID2 limpio |
| id2-2 | repetición del baseline: otra vez la 0016 | ID2 limpio |

ID2 sale limpio 2/2: la tercera fuente de id («sin fila, el de la rama si ya lo lleva») no se escribe en `sdd-start-patch` ni en `nombrado.md` (Art. I). El claim, que toma por defecto el id de la rama, cubre el caso del ticket del patch 0176. Coste acumulado: 3,21 $ (11 sujetos).
