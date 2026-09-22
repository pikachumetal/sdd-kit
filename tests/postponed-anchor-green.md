# Evidencia GREEN — anclaje pospuesto (2026-09-22)

Mismos escenarios que [el RED](postponed-anchor-red.md) más E3 (greenfield). 12 sujetos Sonnet headless, 6,92 $. Detalle por sujeto: [`green/`](../.docs/sdd/specs/20260922-083703-task-0013-postponed-anchor/green/README.md).

| THEN de la spec | RED | GREEN |
| --- | --- | --- |
| Cierre sin `architecture.md`: lo crea desde la plantilla y vuelca ahí el aprendizaje | 1/4 lo crea, sin forma de referencia | T2: **0/2** · tras el REFACTOR: **3/3** (1 sujeto más sin la precondición) |
| No lo lleva a `tech-stack.md` ni a otro documento | 0/4 (3 a `tech-stack.md`) | 3/3 |
| Lo dice en el informe final | 0/4 | 2/3 (el tercero, solo en el walkthrough) |
| Un anclaje que falta se calca de su plantilla (task) | 0/2 | 2/2 |
| La init calca cada documento de su plantilla, con las tablas literales | sin sujetos: ticket de campo A2 | 2/2, 7/7 documentos cada uno |

## REFACTOR

Con la regla solo en `sdd-end-task/references/aprendizajes-skills.md`, 0/2 sujetos leyeron el fichero y los dos dejaron el aprendizaje en el walkthrough. Racionalizaciones literales: «sin `architecture.md` en el proyecto, no hay otro doc vivo de estructura donde volcarlo» y «visible directamente en el código, no requiere doc vivo aparte». La regla subió al paso 4 del `SKILL.md`, con red flag y esas dos frases en la tabla de racionalizaciones. Confirma la anatomía de `architecture.md` §6: lo que gobierna una decisión no baja a `references/`, porque el harness no lo carga.

## Huecos que quedan

- **El aviso en el mensaje final llega en 2/3**; el tercero lo registra solo en el walkthrough. No es silencioso, así que no se endurece más sin otro dato.
- **Un sujeto no recogió como aprendizaje la nota de estructura de `review.md`**. Es un hueco de la cosecha de aprendizajes, no del destino que falta. Va a deuda.
- **La rama «destino sin plantilla → deuda» se verificó leyendo, no con sujetos.** Tras esta task, todo documento que el cierre puede tener que crear tiene plantilla, así que no hay escenario real que la dispare. Es el mismo criterio que la decisión 7 de la spec aplica a brownfield.
- **La cabecera de la tabla de deuda cambió después del E3** (`Deuda · Plan` pasó a `Ítem · Destino`, hallazgo de la revisión). E3 no se repitió: el cambio es de texto de columna, y la conducta medida, calcar la plantilla, no depende de él.
