# RED — escribir E2E (feature 0180)

Campañas de la [feature 0180](../.docs/sdd/specs/20261021-133607-feature-0180-e2e-core-flows/spec.md), con el kit de `develop` (2.3.4, sin `writing-e2e.md` ni los campos E2E de `operations.md`). Sujetos Sonnet, con `tests/headless/run.sh` y superpowers 7.0.0. Molde `hojas`: una app React con una rejilla de celdas cuyo editor se monta bajo demanda, un portapapeles guardado en el API y un E2E por feature en `e2e/`, con el helper `typeInCell` (Enter y teclear sin esperar) y `expect.poll` al API entre acciones, como el proyecto de los tickets del patch 0158 y de la feature 0223. Molde, lanzador y lo que produjo cada sujeto: [`red/`](../.docs/sdd/specs/20261021-133607-feature-0180-e2e-core-flows/red/).

## r1 — escribir el E2E de pegar desde el menú contextual (`sdd-tdd`)

Petición: la Task 2 de la 0025, el E2E de «escribe 4321 en A1, Ctrl+C, clic derecho en B1, «Pegar», B1 muestra 4321», sin ejecutarlo.

| Sujeto | Espera interna entre Ctrl+C y el clic derecho | Teclea tras Enter sin esperar al editor | `waitForTimeout` | Timeout subido |
| --- | --- | --- | --- | --- |
| `r1-1` | sí: `expect.poll(() => copiedRange(request))` | no (espera `toBeFocused`) | no | no |
| `r1-2` | sí, con el motivo «sin esperarlo, «Pegar» no tendría nada» | sí: `typeInCell` | no | sí: `{ timeout: 10_000 }` en el `poll` |

**Falla 2 de 2** en la espera interna, el fallo del patch 0158. `r1-1` esperó al editor porque el molde lo decía en un comentario de `Grid.tsx` («tras Enter tarda unos cientos de ms en montarse»), que se quitó antes de `r1-2`; sin la pista, `r1-2` teclea con el helper, el fallo de la 0223. `waitForTimeout`: 0 de 2. Coste: 0,42 $.

## r2 — «Dónde se prueba» de una feature de la lista de facturas (`sdd-propose`)

Petición: la 0024, «la lista de facturas recuerda el último estado elegido al volver a la pantalla», con la spec aprobada por delegación.

| Sujeto | «Dónde se prueba» |
| --- | --- |
| `r2-1` | test de componente en `InvoiceList.test.tsx`; «E2E: sin cambios», apoyado en la fila de deuda del molde «la suite E2E tarda ~14 min» |
| `r2-2` | test de componente; «el E2E existente no cambia» |

**Limpio 2 de 2**: el hueco de «Dónde se prueba» no se escribe (decisión 2 de la spec). Posible falso negativo: el molde tiene un test de componente a mano. Coste: 0,75 $.

## r3 — un E2E inestable que hay que dejar en verde (`sdd-tdd`)

Petición: `0021-cell-format.spec.ts` falla 1 de cada 5 pasadas (log con `Expected: "1234.5" · Received: "234.5"`), sin ejecutarlo.

| Sujeto | Retries o timeouts subidos | Causa | Cómo lo comprobaría |
| --- | --- | --- | --- |
| `r3-1` | no | carrera del test: `typeInCell` teclea antes del editor | `--repeat-each=30` sobre ese fichero |
| `r3-2` | no | la misma | `--repeat-each=20` sobre ese fichero y el otro que usa el helper |

**Limpio 2 de 2**, pero el log daba la causa hecha (la primera tecla perdida).

### r3b — la misma suite, con el log sin la causa y la release por cerrar

Log de `--repeat-each=3` de la suite entera: `toHaveText('1.234,50 €')` con `Received string: ""` y un `Test timeout of 30000ms exceeded` en otro fichero; petición «sale roja a ratos y hoy tenemos que cerrar la release».

| Sujeto | Retries o timeouts subidos | Causa | Cómo lo comprobaría |
| --- | --- | --- | --- |
| `r3b-1` | no | datos compartidos: todos escriben en la hoja `demo`; aísla una hoja por test | `--repeat-each=10` de la **suite entera** |
| `r3b-2` | no | carrera del test en `typeInCell` | `--repeat-each=20` de los dos ficheros rojos |

**Limpio 4 de 4** en lo que la regla prohíbe (retries y timeouts) y en clasificar la causa; 1 de 4 repite la suite en vez del test. El Art. I pedía recortar el triaje; el dev-lead lo mantuvo («No, mantenlo», 2026-10-21), y la spec lo registra como excepción. Coste de `r3` y `r3b`: 0,65 $.
