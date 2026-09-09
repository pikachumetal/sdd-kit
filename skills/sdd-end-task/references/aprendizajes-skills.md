# Aprendizajes a docs vivos y revisión de skills — detalle

## Paso 4 — Aprendizajes

4. **Aprendizajes → docs vivos** — cada aprendizaje del walkthrough se vuelca donde vive: convención nueva → `constitution.md`; cambio estructural → `architecture.md`; versión/herramienta → `tech-stack.md`; cambio de comportamiento observable → el delta de la spec se fusiona en `capabilities/<capability>.md` (ADDED añade, MODIFIED sustituye por título estable, REMOVED quita; las entradas de «Reglas de la capacidad» se sustituyen o añaden por su nombre, sin marcas; nunca una capacidad que la spec no declare). Un aprendizaje que se queda solo en el walkthrough se pierde para las próximas tareas.

## Paso 5 — Revisión de skills

5. **Revisión de skills** — abre `.claude/skills/` del proyecto y decide: ¿este trabajo reveló un patrón reutilizable (nueva skill), o desmintió algo que una skill afirma (actualizarla)? Usa `superpowers:writing-skills` si toca. "No aplica" se decide mirando, no por omisión — y si el proyecto aún no tiene skills, quizá esta task crea la primera.
