# RED previo a la spec — task 0013

Regla de `tech-stack.md` («Un baseline limpio no reproduce los fallos de sesiones largas»): cada frente de campo se reproduce antes de presentar la spec. El dev-lead aprobó medir E1 y E2 con dos sujetos cada uno (2026-09-22).

- **Kit**: copia limpia de `skills/`, `.claude-plugin/` y `hooks/` de `feature/0013` a 2026-09-22, sin cambios de la task.
- **Moldes**: los de la task 0008 (CLI de reservas de salas), sin `architecture.md`. `m-close`: task 0009 implementada, con un plan que crea `src/slots.js` y una nota de revisión que describe el cambio de estructura. `m-close-b`: igual, pero sin la línea «un solo fichero de entrada» en `tech-stack.md`. `mold`: base, con la fila 0010 «Documentar la arquitectura: el `architecture.md` se pospuso en el init».
- **Lanzador**: `run.sh` → `subject.sh` (Sonnet headless, mensajería entre sesiones bloqueada). E1b con `E1B=1`.
- **Salidas**: `<etiqueta>/` guarda el `.docs/sdd/` del sujeto aplanado (sin `.docs/sdd/`, para no pasar de 140 caracteres de ruta) y el resultado de cada turno; `<etiqueta>.state.txt`, el estado git del run.
- **Coste**: 4,67 $ (E1 1,40 · E1b 1,34 · E2 1,93).

## E1 — cierre con un aprendizaje estructural y sin `architecture.md`

Turno: «Cierra la task 0009. Lo he probado yo: […] Funciona.»

| Sujeto | Destino del aprendizaje | ¿Dice que falta el destino del kit? |
| --- | --- | --- |
| e1-1 | `tech-stack.md`: reescribe la línea «un solo fichero de entrada» | No |
| e1-2 | `tech-stack.md`: ídem | No |
| e1b-1 | **crea `architecture.md`** por su cuenta: dos viñetas, sin forma de referencia; lo menciona solo al pedir permiso para el commit | No |
| e1b-2 | `tech-stack.md`: añade una sección «Estructura de ficheros»; el walkthrough dice que el aprendizaje va a `review.md` | No |

**Veredicto**: la pérdida en silencio del ticket **no se reproduce** (0/4 lo descartan). Sí se reproduce el hueco que la causa: con el destino ausente, cada sujeto improvisa uno distinto (3 a `tech-stack.md`, 1 crea el anclaje sin forma) y **ninguno lo hace visible** (0/4). E1 estaba sesgado por el molde (la línea de estructura en `tech-stack.md`); E1b lo quita y el resultado se dispersa en lugar de mejorar.

## E2 — completar el anclaje pospuesto dentro de una task

Turnos: «Arranca con sdd-start-task.» · «Task full con delegate, como propones. Toma tú las decisiones que falten y déjame el documento de arquitectura escrito para revisarlo.»

| Sujeto | ¿Busca la forma? | Resultado |
| --- | --- | --- |
| e2-1 | Sí: lista `sdd-templates/templates/` y busca `*architecture*`; no hay nada y sigue sin decirlo | Siete secciones inventadas |
| e2-2 | No | Seis secciones inventadas, distintas de las de e2-1 |

0/2 leen `sdd-init-greenfield/references/estructura.md`, que de todos modos solo da una línea («cómo se construye»). Los dos proponen lite y paran en el gate de su diseño: la vía de creación funciona; lo que falta es la forma.

**Veredicto**: se reproduce. La forma de `architecture.md` no existe en ningún sitio que un agente de task pueda calcar, y tres sujetos (e2-1, e2-2, e1b-1) producen tres formas distintas.
