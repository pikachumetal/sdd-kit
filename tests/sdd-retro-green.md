# GREEN — `sdd-retro` (feature 0277)

Sujetos Sonnet, mismas baterías que el [RED](sdd-retro-red.md). Salidas en `.docs/sdd/specs/20261101-191641-feature-0277-sdd-retro/green/out/`. Coste de la campaña, RED incluido: 5,91 $ del kit más 0,43 $ del contraste de `rc2`.

La última medida, tras la revisión final, está en `out/`; las anteriores, en `out/ronda-1/`, `ronda-2/` y `ronda-3/`.

| Escenario | Ronda 1 | Ronda 2 |
| --- | --- | --- |
| `r1` × 2 | 1/2 deja la línea; el otro la deja en el chat | 2/2 `Retro: corrección repetida → operations.md`, sin skill |
| `r2` × 2 | 1/2 | 2/2 `Retro: sin señales`, ningún otro fichero |
| `r3` × 1 | 1/1 | 1/1 `→ ticket del kit: …`, sin editar el kit |
| `r5` × 2 | 0/2: la línea, solo en el chat | 2/2 `Retro: error que cazaría un chequeo → test (…)` |
| `c1` × 2 | 0/2: paran a preguntar | 2/2 sale la línea del puerto, entra el aprendizaje y hay commit, sin subir el tope |
| `r4` × 2 | 2/2: la salida del verbo literal, una propuesta por causa, `prioriza o descarta` en la arrastrada, `--planta 2` fuera, `debt.md` sin tocar, `retro.md` en el commit del corte y el resumen la nombra | — |
| `m7` × 1 | 1/1: el inventario nombra la propuesta y `A1` | — |

**Ronda 2**: el paso 4 pasa de «Write the lines» a «Edit §5 of the walkthrough file», con el motivo (el fichero es el registro y el mensaje no); la salida del tope dice «without asking: its other home keeps it»; y el molde gana lo que le faltaba: el hueco de la plantilla en el walkthrough y un `operations.md` real en `c1`.

**Tras la revisión final**: los literales `Retro: <señal> → …` sustituyen al ejemplo, y con ellos `r1` funde dos señales en una línea (ronda 3, 0/2 leído literal). El paso 4 pasa a «One line per signal, with its name as written above», y `r1` a `r6` se vuelven a medir: `r1` 2/2, `r2` 2/2, `r3` 1/1, `r5` 2/2, `r4` 2/2 y `r6` 1/1, sin carpeta.

## Controles

- `a1` × 2: 2/2 pasan por `sdd-retro` y dejan su línea. `a2` × 2: 2/2 un patch no pasa por ella.
- `rc1` × 2: 2/2 en la suite. Su molde sí tiene `debt.md`: un sujeto llega al repaso (`Sin propuestas`) y el otro para antes, en el smoke.
- `rc2` × 2: 0/2 en `K6`, **y 0/2 igual con el kit sin esta feature** (`base-ctl/out/`): `gh run list` da `no git remotes found` porque el `gh` falso del molde no llega al sujeto, y sin respuesta de la CI corre la suite. No lo causa la 0277.

## Sin medir con sujetos

Lectura en la revisión final: el peldaño de la norma del revisor y el de la skill; el destino que no cabe en `unattended`; la estimación pedida sin `debt.md`; la oferta de la estimación, porque `r6` corre en `unattended` y no hay propuesta que la lleve; que el repaso corre tras caducar, porque el molde no tiene nada que caduque.
