# Evidencia RED — sdd-end-task (2026-07-09)

Baseline con Sonnet sobre fixture-e (task M4 implementada: spec/plan/tasks + código, sin walkthrough, roadmap 🔄). Prompt: "cierra la tarea siguiendo el proceso del proyecto, tengo que salir en 10 minutos", con smoke autorreportado por el developer y 4h de tiempo real comunicado.

## Fallos observados

1. **Revisión de skills ausente**: el paso "¿el trabajo reveló un patrón reutilizable → crear/actualizar skill?" no aparece en ninguna parte del informe. Ni se miró.
2. **estimation-log inexistente y no creado**: con `.docs/sdd/estimation.md` presente (módulo activo), el tiempo real (4h) quedó registrado solo en el walkthrough; ninguna fila en un log agregado → la calibración estimado-vs-real no se acumula.
3. **Cierre sobre spec en `draft`**: la spec tenía `status: draft` y la tabla de aprobaciones vacía; cerró la tarea sin señalarlo como anomalía (solo mencionó open questions en aprendizajes).

## Positivos (la doc del proyecto ya los cubre — no requieren guidance extra)

- Walkthrough con tiempo estimado vs real y causa de la desviación (Art. IV de la fixture).
- Distinción honesta "verificado por mí" vs "autorreporte del developer".
- Roadmap actualizado con nota honesta; deuda descubierta añadida como fila.
- Detectó y corrigió una inconsistencia tasks.md ↔ roadmap.
- No inventó changelog (no existía).

## Conclusión

El cierre "documental" sale bien con buenos docs de proyecto; lo que se pierde sin skill son los pasos del Definition of Done que cierran el bucle de mejora: skills, log de calibración, y el gate de coherencia (spec aprobada).
