# GREEN — la opción «Diferir» de la validación trae su disparador (patch 0080)

Mismo molde, petición y segundo turno que el [RED](defer-trigger-red.md), con [`red/subject.sh`](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/red/subject.sh) y el kit del working tree en cada ronda. Sujetos Sonnet headless, 2026-09-27. Criterio: (a) la opción de diferir de la pregunta nombra un disparador concreto con dueño; (b) tras «Diferir» sin texto, `patch.md` §4 queda con una línea `Validación diferida:` completa, sin otro turno.

| Ronda | Texto del kit | (a) | (b) | Salidas |
| --- | --- | --- | --- | --- |
| RED | `develop` | 0/2 | 2/2 | [`red/out/`](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/red/out/) |
| 1 | la opción lleva «Diferir: lo pruebo en <uso más próximo>, a cargo de <quien valida>» | 1/2: d-2 «dime dónde y quién lo prueba» | 2/2 | [`green1/out/`](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/green1/out/) |
| 2 | + «no pide nada al usuario», con ejemplo | 0/2: los dos hacen una pregunta abierta, sin opciones | 2/2 | [`green2/out/`](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/green2/out/) |
| 3 | + «la pregunta ofrece una opción por cada salida, también en texto» | 1/2: d-2 «dime en qué uso próximo se prueba y quién» | 2/2 | [`green3/out/`](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/green3/out/) |
| 4 (final) | + las tres etiquetas literales en el paso 0 | 1/2: d-1 copia `<uso más próximo>` sin rellenarlo | 2/2 | [`green/out/`](../.docs/sdd/specs/20260927-085723-patch-0080-defer-trigger/green/out/) |

**GREEN parcial: (a) pasa de 0/2 a 1/2; (b) se mantiene 2/2 en las cinco rondas.** Con las etiquetas literales, los dos sujetos de la ronda 4 ofrecen las tres opciones. En la ronda 4, el fallo que queda ya no es pedirle el disparador al usuario, sino dejar el hueco sin rellenar. Al elegirlo, la regla del disparador vago lo concreta sin otro turno. El dev-lead decidió cerrar tras la ronda 4 con lo que hubiera (2026-09-27).

Límite: sin `AskUserQuestion`, que headless no puede contestar. El turno de más del patch 0078 fue con esa herramienta.

Coste de las cuatro rondas: 7,51 $ (ronda 1: 2,14 $; 2: 1,90 $; 3: 1,68 $; 4: 1,78 $), y 10,00 $ con el RED. El recuento de `run.sh` se queda corto: solo lee el último `RESULTADO` de cada sujeto, y con `--resume` hay dos.
