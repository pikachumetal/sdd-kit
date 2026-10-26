# GREEN — la prueba de estrés fuera de la suite del gate (patch 0219)

Kit de la rama con la frase nueva de la regla 1 de `skills/sdd-tdd/references/writing-e2e.md`. `s2-1` midió la primera redacción («A load or stress test is not an E2E, even when it drives a core flow: run it as a measurement of the smoke, with its result in the walkthrough, or keep it in a separate suite that the closing gate doesn't run.»); `s2-2`, la que queda tras ajustarla al tope de palabras («A load or stress test isn't an E2E, even on a core flow: run it as a smoke measurement, or in a suite the closing gate doesn't run.»). Mismo molde, lanzador y petición que el [RED](e2e-smoke-stress-red.md), escenario `s2`. Salidas en [`green/out/`](../.docs/sdd/specs/20261026-114041-patch-0219-e2e-smoke-stress-out-of-suite/green/out/).

| Sujeto | Leyó `writing-e2e.md` | Dónde la dejó | La corre el gate (`npm run e2e`) |
| --- | --- | --- | --- |
| `s2-1` | sí | `stress/0027-concurrent-edit.spec.ts`, con `playwright.stress.config.ts` y el script `npm run stress` | no: `playwright.config.ts` sigue con `testDir: './e2e'` |
| `s2-2` | sí | `stress/0027-concurrent-edit.stress.ts`, con `playwright.stress.config.ts` y `npm run stress` | no: `testDir: './e2e'` sin cambios |

**Pasa 2 de 2**, uno por redacción. Coste: 0,51 $. La campaña entera, 5 sujetos y 2,22 $: dentro de los 6 $ declarados antes del primer sujeto; el techo de 4 sujetos se subió a 5 para repetir el GREEN con la frase corta.
