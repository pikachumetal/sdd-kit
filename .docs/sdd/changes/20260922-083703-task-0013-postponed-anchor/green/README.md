# GREEN — task 0013

- **Kit**: copia limpia de `skills/`, `.claude-plugin/` y `hooks/` de `feature/0013` tras T2 (`12d9fbd`), y tras el REFACTOR (`f4f50bb`) para los reruns `e1b-refactor-*`.
- **Moldes y turnos**: E1b y E2 iguales que en el RED (`m-close-b`, `mold`). E3 usa `m-empty` (repo con solo un README) y una petición a `sdd-init-greenfield` que lleva dentro las respuestas de la entrevista, con los documentos aprobados de antemano y la arquitectura pospuesta.
- **Lanzador**: `run.sh` → `subject.sh`.
- **Salidas**: `<etiqueta>/` guarda el `.docs/sdd/` del sujeto aplanado (sin `.docs/sdd/`, para no pasar de 140 caracteres de ruta) y el resultado de cada turno; `<etiqueta>.state.txt`, el estado git del run. Los reruns se lanzan con `subject.sh` directamente, con el mismo turno.
- **Coste**: 6,92 $ (12 sujetos).

## E1b — cierre con un aprendizaje estructural y sin `architecture.md`

| Sujeto | Kit | ¿Crea `architecture.md` desde la plantilla? | ¿Lo dice? |
| --- | --- | --- | --- |
| e1b-green-1 | T2 | No: «sin `architecture.md` en el proyecto, no hay otro doc vivo de estructura donde volcarlo» | — |
| e1b-green-2 | T2 | No: «visible directamente en el código, no requiere doc vivo aparte» | — |
| e1b-refactor-1 | REFACTOR | N/A: no registra ningún aprendizaje estructural (no recoge la nota de `review.md`) | — |
| e1b-refactor-2 | REFACTOR | Sí, las cinco secciones | Sí: informe y walkthrough |
| e1b-refactor-3 | REFACTOR | Sí, las cinco secciones | Sí: «`architecture.md` no existía, creado desde plantilla» |
| e1b-refactor-4 | REFACTOR | Sí, las cinco secciones | Solo en el walkthrough, no en el mensaje final |

**Fallo del GREEN con el kit de T2 (0/2)**: la regla estaba solo en `references/aprendizajes-skills.md` y ningún sujeto leyó ese fichero; el stream solo muestra `sdd-end-task`, `sdd-templates` y `add-to-changelog`. Además, sin la guía del RED para redirigir, los dos dejaron el aprendizaje solo en el walkthrough: justo la pérdida en silencio del ticket. **REFACTOR** (`f4f50bb`): la regla sube al paso 4 del `SKILL.md`, con red flag y las dos frases de arriba como racionalización. Con el REFACTOR: 3/3 de los que registran el aprendizaje crean el documento desde la plantilla, y ninguno lo lleva a `tech-stack.md` (0/3, frente a 3/4 en el RED). El aviso llega al informe final en 2/3; el tercero lo deja escrito en el walkthrough, así que no es silencioso. `e1b-refactor-1` no cuenta: le falta la precondición, y ese es otro hueco (recoger aprendizajes de `review.md`), que no es de esta task.

## E2 — completar el anclaje pospuesto en una task

| Sujeto | ¿Lee `architecture-template.md`? | Forma |
| --- | --- | --- |
| e2-green-1 | Sí | Diseño con las secciones de la plantilla (piezas, flujo, dónde va lo nuevo, decisión estructural) |
| e2-green-2 | Sí | Spec que declara «`architecture.md` calca `architecture-template.md`» |

2/2, frente a 0/2 en el RED (dos formas inventadas).

## E3 — greenfield

| Sujeto | Siete documentos con las secciones de su plantilla | Cabeceras de tabla del roadmap literales | `architecture.md` pospuesto |
| --- | --- | --- | --- |
| e3-green-1 | 7/7 | Sí (Próximo, Backlog, Deuda, Patches) | Creado desde la plantilla, con la tarea en el Backlog |
| e3-green-2 | 7/7 | Sí | Creado con todas las secciones en `_Pendiente._` |

2/2. Ninguno copió de otro proyecto. Hallazgos que no son de la guidance:

- e3-green-2 heredó las convenciones de idioma y commits del CLAUDE.md global de la máquina que lanza el sujeto. Es contaminación del método, no del kit.
- e3-green-1 decidió la regla «Avisos», que la petición dejaba en «no sé». La misma petición le pedía «lo que falte decídelo tú», así que es un conflicto del guion, no de la plantilla, que dice «una pendiente no se inventa».
