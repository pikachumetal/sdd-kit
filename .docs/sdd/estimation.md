# Método de estimación — sdd-kit

El mismo método que en los proyectos del equipo: el `plan.md` de cada tarea estima horas (con rango), el `walkthrough.md` registra el tiempo real, y el log agregado calcula el factor de calibración (ratio mediano real/estimado). Fiabilidad a partir de ~10 tareas registradas.

Aviso de sesgo (2026-09-02): tres tasks consecutivas —`carril-rama-worktree`, `modo-lite` y `dependencias-declaradas`— cerraron con ratio bajo por la misma causa: el RED desautorizó guidance que la estimación daba por segura. **La implementación de guidance se estima condicionada al RED**, no como coste cierto; contarla entera infla la estimación de forma sistemática.

Segundo aviso (2026-09-07, task `alineacion-superpowers`): estimar la guidance condicionada al RED (rango) no bastó — el suelo del rango también sobreestimó (ratio 0,25). La unidad de coste de un ciclo Art. I con subagentes en paralelo son **minutos**: una campaña RED o GREEN cuesta ≈ (nº de escenarios × 5 min, en paralelo) + ~10 min de redacción por fichero de evidencia; las ediciones de docs y skills son de una línea. Estimar en horas de trabajo secuencial infla el suelo de forma sistemática.

Nota de escala: las tareas del kit suelen ser pequeñas (una skill, una plantilla); los patches registran solo el tiempo real, sin ceremonia.

Tercer aviso (2026-09-09, T10): con el método headless los sujetos corren en segundo plano y en paralelo, así que su duración (3–7 min cada uno) **no suma al tiempo real**: el reloj de la task es el de redactar artefactos y evidencia. Estimar la campaña como tiempo de espera infla el suelo; se estima como redacción (≈ 10 min por fichero de evidencia) más un smoke del método.

El log (`estimation-log.md`) **se genera**, no se escribe: desde T7 (2026-09-09) lo regenera `skills/sdd-templates/scripts/Build-EstimationLog.ps1` a partir del bloque de tiempo de cada walkthrough y patch, con el factor global y la mediana por Tipo. Los rangos y las notas («condicionado al RED») viven en el walkthrough; el log es la tabla de calibración. Comportamiento observable en `funcional/estimacion.md`.
