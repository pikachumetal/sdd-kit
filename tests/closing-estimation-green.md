# GREEN — esfuerzo real medido en los cierres (feature 0188)

Kit: copia del working tree tras las Tasks 1 y 2 y el paso 2 de `sdd-end-feature` editado (cuatro líneas), cargada con `--plugin-dir` junto a superpowers 7.0.0 y `--setting-sources ""`. `sdd-end-patch` sin editar: por la enmienda del 2026-10-15, su GREEN prueba la plantilla sola. Mismo molde y peticiones que el [RED](closing-estimation-red.md); lanzador en [`green/subject.sh`](../.docs/sdd/specs/20261015-104325-feature-0188-closing-estimation-templates/green/subject.sh), salidas en `green/out/`.

Fecha: 2026-10-15. Coste: 0,78 $ en 3 sujetos (`p1-1` 0,28 $, `p1-2` 0,27 $, `f1-1` 0,22 $). Campaña entera: 1,51 $ en 6 sujetos, frente a la previsión de 9 $ (techo 12 $).

## Resultados

| Sujeto | ¿Ejecuta `sdd session tokens`? | Esfuerzo real escrito |
| --- | --- | --- |
| p1-1 | sí (`tools.txt`:92) | `0,7 h, aproximado con las marcas de los commits (inicio 09:00Z, commit del fix 09:40Z)` |
| p1-2 | sí (`tools.txt`:77), tras leer §5 de la plantilla | `0,7 h, aproximado con las marcas de los commits (09:00Z → 09:40Z del 2026-10-14)` |
| f1-1 | sí (`tools.txt`:30) | las cuatro líneas pegadas: `0,00 h — reloj de la sesión 0,00 h desde 2026-10-15T13:35Z, sin 0 min de espera al dev-lead (0 esperas)`, y detrás «≈0,75 h por los commits» |

Frente al RED: `p1` pasa de 0/2 a 2/2 en ejecutar el script; `f1` pasa de tres líneas a cuatro, con `Esfuerzo real` de la CLI.

## Lo que el molde no reproduce

El trabajo de los dos moldes está en commits, no en una sesión de Claude Code: la única sesión con transcripts es la del sujeto, que solo cierra. Por eso la línea medida da 0,00 h, y los dos `p1` lo explican («`sdd session tokens` mide la sesión de cierre y no la que abrió el patch») y aproximan con los commits, como pide la plantilla fuera de Claude Code. En el flujo del kit la sesión que cierra es la que trabajó, o comparte la carpeta de transcripts del worktree, y la CLI suma todas sus sesiones de la rama (Vitest: «suma dos sesiones de la rama…»).

**Hallazgo**: `f1-1` pegó la línea con `0,00 h` y añadió la aproximación detrás. `sdd estimation log` lee el primer número, así que esa fila daría real 0. Solo pasa cuando los transcripts no cubren el trabajo (otra máquina, otra ruta). No se corrige aquí, porque sería un AND nuevo de la spec: va a la deuda como **Esperar 2.º ticket**.
