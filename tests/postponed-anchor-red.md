# Evidencia RED — anclaje pospuesto (2026-09-22)

Baseline de la task [0013](../.docs/sdd/specs/20260922-083703-task-0013-postponed-anchor/spec.md), medido **antes de la spec** (regla de `tech-stack.md`). Seis sujetos Sonnet headless sobre una copia limpia del kit de `feature/0013` sin cambios; 4,67 $. Moldes, lanzador y lo que produjo cada sujeto: [`red/`](../.docs/sdd/specs/20260922-083703-task-0013-postponed-anchor/red/README.md).

## E1 / E1b — cierre con un aprendizaje estructural y sin `architecture.md`

| Sujeto | Destino del aprendizaje | ¿Avisa de que falta el destino? |
| --- | --- | --- |
| e1-1, e1-2 | `tech-stack.md` (el molde ya describía ahí la estructura) | No |
| e1b-1 | crea `architecture.md` con dos viñetas, sin forma de referencia | No |
| e1b-2 | `tech-stack.md`, sección nueva; el walkthrough dice `review.md` | No |

- La pérdida en silencio del ticket **no se reproduce** (0/4).
- **Se reproduce** el destino improvisado sin aviso (0/4 avisan). Esto entra en la spec.

## E2 — completar el anclaje pospuesto en una task

- 2/2 escriben `architecture.md` con secciones inventadas y distintas entre sí (7 y 6).
- e2-1 buscó una plantilla en `sdd-templates/templates/`, no la encontró y no lo dijo.
- 0/2 leen `sdd-init-greenfield/references/estructura.md`, que solo da una línea por documento.
- Los dos pasan su diseño por gate. La vía de creación funciona; lo que falta es la forma.

## Frente estructural de la enmienda (verificado por lectura, sin sujetos)

- `sdd-templates/templates/` no tenía ninguna plantilla de documento de anclaje.
- `estructura.md` daba una línea por documento.
- El ticket de campo de la init de `statusline` (A2, de primera mano): el agente copió `estimation.md` y `sdd-kit.json` del `.docs/` del kit e inventó las columnas de la tabla de patches.
- Ticket 0008 §5: un `estimation.md` heredado con notas de calibración de otro proyecto.
