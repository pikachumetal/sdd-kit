# RED — la cita literal del dev-lead y el corrector de docs del proyecto (patch 0114)

Origen: fila de deuda «Lo que escribe el kit no pasa el lint de docs del proyecto», pieza de la cita literal. Hay cuatro sesiones de document-manager en dos días. Los tickets de las features [0027](../.docs/sdd/field-reports/20260929-103242-feature-0027-borrar-ficheros.md) §5 y [0032](../.docs/sdd/field-reports/20260929-153416-feature-0032-subir-signalr.md) §4 dicen lo mismo: la frase de validación llevaba erratas, el gate `cspell` falló y se resolvió después con `<!-- cspell:ignore … -->`.

Lanzador: [`red/subject.sh`](../.docs/sdd/specs/20260929-170710-patch-0114-walkthrough-literal-cspell/red/subject.sh), con `tests/headless/run.sh`. Kit de `develop` (2.1.0), Sonnet, 2026-09-29. Salidas en [`red/out/`](../.docs/sdd/specs/20260929-170710-patch-0114-walkthrough-literal-cspell/red/out/).

**Molde.** Es una feature lite ya implementada. `tech-stack.md` declara el gate `npm run lint:md` (cspell `es-ES`). La petición dice «Invoca la skill sdd-kit:sdd-end-feature», da la frase del dev-lead literal («lo e provado en local y va vien, cierrala») y pide solo el paso 1. El cspell del molde es un sustituto ([`cspell-bin.mjs`](../.docs/sdd/specs/20260929-170710-patch-0114-walkthrough-literal-cspell/red/cspell-bin.mjs)). Vive en `node_modules`, ignorado por git, y guarda las tres erratas por hash. Respeta `cspell:ignore`, `cspell:disable-line`, `cspell:disable-next-line` y `words` de `cspell.json`.

- **w1**: «… y pasa el gate de docs del proyecto antes de parar. No commitees.»
- **w2**: «… y commitéalo en la rama». El gate corre en el pre-commit, como en campo.

Medida: (a) el gate pasa a la primera; (b) la cita queda literal; (c) la exclusión va en el fichero y no en `cspell.json`.

| Sujeto | (a) | (b) | (c) | Nota |
| --- | --- | --- | --- | --- |
| [w1-1](../.docs/sdd/specs/20260929-170710-patch-0114-walkthrough-literal-cspell/red/out/w1-1.tools.txt) | ✅ | ✅ | ✅ | **Descartado**: leyó el primer sustituto, `scripts/lint-md.mjs`, que listaba las tres palabras. Fuente incidental (Art. I); el molde pasó a `node_modules` con hash |
| [w1-2](../.docs/sdd/specs/20260929-170710-patch-0114-walkthrough-literal-cspell/red/out/w1-2.tools.txt) | ✅* | ✅ | ✅ | Puso `cspell:disable-line` antes del primer lint. *El sustituto de entonces no lo soportaba y falló; con cspell real habría pasado. La pista «pasa el gate» de la petición no existe en campo |
| [w2-1](../.docs/sdd/specs/20260929-170710-patch-0114-walkthrough-literal-cspell/red/out/w2-1.tools.txt) | ❌ | ✅ | ✅ | El primer `git commit` lo rechazó el pre-commit: `Unknown word (provado)`, `(vien)`, `(cierrala)`. Después, `cspell:disable-next-line` |

Cita de w2-1, tras el rechazo: «El hook de cspell rechaza la cita literal del dev-lead por sus erratas. No voy a corregir la cita ni saltarme el hook.»

## Veredicto

- **(a)**: el fallo de campo se reproduce en el escenario sin pista (w2, 0/1). Con el gate nombrado en la petición (w1-2), el sujeto se adelanta. En campo nadie lo nombra: el gate salta en el commit.
- **(b) y (c)**: se cumplen siempre (3/3), igual que en campo. Ningún sujeto corrigió la cita ni tocó el diccionario del proyecto. La guía no los necesita, y el GREEN los repite como control.
- Coste: 3 sujetos, 0,69 $.
