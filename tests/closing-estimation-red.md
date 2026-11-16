# RED — estimación post hoc y esfuerzo real en los cierres (feature 0188)

Baseline: el kit del commit de apertura `08f3176e` (sin la línea `Esfuerzo real` de la CLI ni las plantillas nuevas), cargado con `--plugin-dir` junto a superpowers 7.0.0 y `--setting-sources ""`. Sujetos Sonnet, un turno. Molde y lanzador: [`red/subject.sh`](../.docs/sdd/specs/20261015-104325-feature-0188-closing-estimation-templates/red/subject.sh); salidas en `red/out/`.

Fecha: 2026-10-15. Coste: 0,73 $ en 3 sujetos (`p1-1` 0,28 $, `p1-2` 0,31 $, `f1-1` 0,15 $).

## p1 — cierre del patch 0042, cuyo commit del fix no trae `- Estimación:`

Molde: proyecto Node con `estimation.md` (método calcado de la plantilla anterior), perfil `delegate`, `validation.mode: field`; rama `feature/0042` con el fix y un `patch.md` cuyo §5 solo tiene `- Inicio: 2026-10-14T09:00Z`. Petición: «Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0042. No fusiones ni empujes: el merge lo hago yo.»

| Sujeto | Estimación en §5 al cerrar | Real en §5 | ¿De la sesión? |
| --- | --- | --- | --- |
| p1-1 | no la escribe | `0.5h (aproximado, no medido: un fix de una línea con su test; el patch estuvo abierto de 2026-10-14T09:00Z a 2026-10-15T11:25Z)` | no |
| p1-2 | `no registrada antes del fix` | `0.7h (aproximado: del inicio al commit del fix, 09:40Z)` | no |

- **`post hoc`: baseline limpio, 0/2.** Ninguno escribió una cifra de estimación con el real delante: la plantilla del commit de apertura ya dice «escrita antes del fix» (feature 0160). Por el Art. I, la regla de `post hoc` no se escribe en `sdd-end-patch`. Posible falso negativo: el caso de campo (patch 6300) escribió `0,5 h` al cerrar con la plantilla anterior a la 0160.
- **Real: falla 2/2.** Los dos lo aproximan con las marcas del molde y ninguno ejecuta `sdd session tokens`; `p1-1` cuenta un día entero de reloj de pared y lo rebaja a ojo.

## f1 — paso 2 de `sdd-end-feature` en el walkthrough de la feature 0043

Molde: feature con plan (`Estimación de implementación: 1h`), commits de apertura a las 10:05 y de la feature a las 10:50 del 2026-10-14, y el walkthrough con §2 vacío. Petición: «Invoca la skill sdd-kit:sdd-end-feature y haz solo su paso 2 (tiempo real) en el walkthrough de la feature 0043. No hagas ningún otro paso del cierre ni commitees.»

| Sujeto | Esfuerzo real | Líneas de `sdd session tokens` |
| --- | --- | --- |
| f1-1 | `45 min (aproximado: de la apertura de la rama, f937060 a las 10:05, al commit de la feature, b779de2 a las 10:50)` | las tres, pegadas (`tools.txt`:32) |

- **Falla 1/1**: ejecuta el script y pega sus tres líneas, pero el real sale de los commits, no de la sesión: la CLI no lo da.
