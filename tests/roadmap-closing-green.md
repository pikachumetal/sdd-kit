# GREEN — cierre de filas del roadmap (task 0018)

Mismos moldes, lanzador y turnos que el [RED](roadmap-closing-red.md), sobre una copia del kit con la guía nueva: el bloque «Formato de cierre» de `roadmap-template.md` y la cita desde el paso 8 de `sdd-end-task` y el paso 4 de `sdd-end-patch`. Salida en `.docs/sdd/specs/20260922-153902-task-0018-roadmap-closing/green/out/`.

- Ronda 1 (`t-green-*`, `p-green-*`): guía tal como quedó en `f688ecc`.
- Ronda 2 (`t-green2-*`): la plantilla precisa que `<enlace>` es un enlace Markdown (`[walkthrough](…)` o `[patch](…)`), porque en la ronda 1 las dos tasks escribieron la ruta suelta.
- Coste: 0,63 + 0,54 + 1,29 + 0,99 (ronda 1) + 0,89 + 0,81 (ronda 2) = 5,15 $.
- Comprobación previa: la misma del RED. Los seis cargaron `sdd-kit:sdd-end-task` o `sdd-kit:sdd-end-patch` (`*.skills.txt`).

## Resultado

| Frente | RED | GREEN ronda 1 | GREEN ronda 2 | Veredicto |
| --- | --- | --- | --- | --- |
| B. Prefijo al principio de la celda | 0/4 (3 formas) | 4/4 | 2/2 | **Corregido** |
| B. Estado correcto (`parcial`, con lo que queda) | — | 4/4 | 2/2 | **Corregido** |
| B. Enlace Markdown al artefacto | 3/4 (en formas distintas) | 2/4: los patches sí, las tasks con ruta suelta | 2/2 | **Corregido en la ronda 2** |
| B. Texto original conservado | 0/4 | 4/4 las palabras; 1/2 tasks quita la negrita del título | 2/2 las palabras; 2/2 quitan la negrita | **Corregido** (ver nota) |
| B. `grep` de conteo | no aplicable | 0 filas saldadas, correcto: las cuatro son `parcial` | igual | **Correcto** |
| A. Task sin fila en modo tracker (control) | 2/2 sin fila inventada | 2/2 sin fila de scope, `SALAS-142` en el changelog | 2/2 | **Sin regresión** |

Fila de la ronda 2 (t-green2-1), literal:

`| **[Task SALAS-142, 2026-09-22: parcial — [walkthrough](specs/20260919-090000-task-SALAS-142-slot-format/walkthrough.md); queda: validar el día de `cancelar`]** Sin validación de la entrada de `libres` y `cancelar` — …`

Y la del patch (p-green-2):

`| **[Patch 0008, 2026-09-22: parcial — [patch](specs/20260919-090000-patch-0008-slot-format/patch.md); queda: validar la entrada de `cancelar`]** **Sin validación de la entrada de `libres` y `cancelar`** — …`

**Nota sobre la negrita.** Tres de los cuatro sujetos de task quitan el `**…**` del título al poner el prefijo delante, probablemente para no juntar dos negritas. Las palabras de la fila no cambian y el `grep` no depende de la negrita, así que no se añade guía: sería prosa para un fallo cosmético. Si en campo se pierde texto, y no solo la negrita, vuelve a deuda.

**Fila nueva de t-green-1.** Además de cerrar la fila, t-green-1 añadió deuda descubierta (el delta de la task no declaró capacidad). Es el «Deuda descubierta → fila» del paso 8 y no toca el frente medido.
