# Método de estimación — sdd-kit

El mismo método que en los proyectos del equipo: el `plan.md` de cada tarea estima horas (con rango), el `walkthrough.md` registra el tiempo real, y el log agregado calcula el factor de calibración (ratio mediano real/estimado). Fiabilidad a partir de ~10 tareas registradas.

Aviso de sesgo (2026-09-02): tres tasks consecutivas —`carril-rama-worktree`, `modo-lite` y `dependencias-declaradas`— cerraron con ratio bajo por la misma causa: el RED desautorizó guidance que la estimación daba por segura. **La implementación de guidance se estima condicionada al RED**, no como coste cierto; contarla entera infla la estimación de forma sistemática.

Segundo aviso (2026-09-07, task `alineacion-superpowers`): estimar la guidance condicionada al RED (rango) no bastó — el suelo del rango también sobreestimó (ratio 0,25). La unidad de coste de un ciclo Art. I con subagentes en paralelo son **minutos**: una campaña RED o GREEN cuesta ≈ (nº de escenarios × 5 min, en paralelo) + ~10 min de redacción por fichero de evidencia; las ediciones de docs y skills son de una línea. Estimar en horas de trabajo secuencial infla el suelo de forma sistemática.

Nota de escala: las tareas del kit suelen ser pequeñas (una skill, una plantilla); los patches registran solo el tiempo real, sin ceremonia.
