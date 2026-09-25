# Flujo de desarrollo rápido con Claude: proyectos brownfield

Este documento explica cómo trabajar con Claude sobre aplicaciones que ya existen. Complementa al [documento de proyectos greenfield](greenfield.md): el ciclo de trabajo es el mismo, pero la fase inicial y la verificación cambian.

El brownfield es el caso difícil para los agentes. El código acumula contratos implícitos, convenciones no escritas y deuda técnica que el agente no puede inferir. La evidencia lo cuantifica: un ensayo controlado de METR, a principios de 2025, midió que desarrolladores experimentados trabajando con IA sin estructura sobre repositorios grandes y maduros iban un **19% más lentos**, aunque creían ir más rápido. La actualización de 2026 del mismo estudio apunta que con las herramientas y flujos actuales la cifra se revierte, y los propios autores califican esa nueva evidencia de débil. La lección estable es que el resultado depende de **cómo** se usa la IA, no solo del modelo. Darle por escrito el contexto que no puede deducir es exactamente lo que hace este flujo.

El principio transversal es el mismo que en greenfield: el resultado debe depender del proceso y no del criterio de quien lo ejecuta.

## 1. Fase 1: onboarding del codebase

En un proyecto existente no hay requisitos de cliente que analizar. El primer paso es hacer explícito lo que el código ya dice. La skill `sdd-init-brownfield` del kit automatiza esta fase: explora el repositorio y genera la documentación inicial.

### 1.1. Documentar el estado real, no el ideal

Los documentos de anclaje describen el sistema **tal como es hoy**, no como debería ser. Documentar un ideal que el código no cumple desorienta al agente y produce cambios incoherentes.

| Documento | Qué captura de un codebase existente |
| --- | --- |
| `.docs/sdd/mission.md` | Qué hace el sistema, para quién, y el modelo de dominio |
| `.docs/sdd/constitution.md` | Convenciones existentes, aunque no sean ideales, y reglas no negociables |
| `.docs/sdd/tech-stack.md` | Tecnologías con **versiones exactas** y dependencias bloqueadas |
| `.docs/sdd/architecture.md` | Estructura real de módulos, capas y flujos |
| `.docs/sdd/roadmap.md` | Deuda técnica inventariada, bloqueos críticos y prioridades |
| `CLAUDE.md` (corto) | Punteros a los anteriores y reglas críticas |

**`capabilities/` no se vuelca de golpe.** En un codebase existente es tentador pedirle al agente que documente todo el comportamiento de una vez, y el resultado son ficheros que nadie revisa. La carpeta nace vacía y crece con la primera tarea que toca cada capacidad, igual que en greenfield: cada spec declara su delta (`ADDED`, `MODIFIED`, `REMOVED`) y el cierre lo fusiona. Si al hacer el onboarding aparece comportamiento documentado que no encaja en ninguna capacidad todavía, se queda en un fichero de legado hasta que una tarea lo reclame.

### 1.2. Reglas de oro en brownfield

Reglas que protegen el sistema en producción y que la constitution del proyecto hace cumplir en cada tarea:

- **Retrocompatibilidad por defecto**: ningún cambio rompe datos ni contratos existentes.
- **Respetar el patrón existente**, aunque no sea el ideal. Los cambios de patrón se proponen y se documentan; nunca se aplican como refactor oportunista dentro de otra tarea.
- **Migraciones masivas solo con justificación escrita** y aprobada.
- **La deuda técnica se registra en el roadmap**, no se corrige sobre la marcha.

### 1.3. Kit de skills

- **Skills de proceso**: desde el día cero, como en greenfield. `sdd-init-brownfield` es además la vía de actualización: cuando el kit publica una versión nueva, lee la que el proyecto tiene anotada en `.docs/sdd/sdd-kit.json` y aplica en orden las migraciones posteriores, preguntando antes de borrar o renombrar nada.
- **Skills técnicas**: en brownfield conviene crearlas pronto, porque capturan el conocimiento tribal del proyecto, como se compila, qué patrón siguen backend y frontend o cómo se hacen las migraciones. Cada skill escrita es conocimiento que deja de depender de la memoria de una persona.

### 1.4. No hace falta parar el desarrollo

El onboarding no bloquea: se crea la documentación mínima de anclaje y se empieza a trabajar. Los documentos crecen con cada tarea cerrada. En un proyecto legacy del equipo, el arranque se hizo con cuatro documentos de anclaje y el proyecto ya ha completado siete tareas con el ciclo entero, mientras seguía entregando correcciones y funcionalidades.

## 2. Fase 2: implementación, ciclo por tarea

El ciclo es el mismo que en greenfield, guiado por las skills:

1. **Arranque** con `sdd-start-task`, que carga el contexto del proyecto y enruta según lo que sea: consulta, patch, modo lite o ciclo completo.
2. **Especificación**: brainstorming con Claude hasta llegar a `spec.md`, con el delta de comportamiento por capacidad, revisada y aprobada antes de continuar. En brownfield conviene activar la revisión adversarial de la spec más a menudo, porque el riesgo está en lo que la spec da por supuesto del sistema existente.
3. **Plan** en `plan.md`, con la estimación de esfuerzo, el modelo por tarea y las restricciones globales.
4. **Tareas** en `tasks.md`, solo si el plan tiene varios pasos.
5. **Implementación** con subagentes por defecto, y los tests en rojo escritos por el hilo principal antes de despachar: son el contrato del implementador.
6. **Verificación**, que se detalla en el punto 2.2.
7. **Validación**: el agente presenta lo hecho y espera a que digas qué has probado y que funciona.
8. **Cierre** con `walkthrough.md` y `sdd-end-task`: delta fusionado en `capabilities/`, aprendizajes a los documentos vivos, y changelog, roadmap y registro de estimaciones actualizados.

Los artefactos viven en `.docs/sdd/specs/<fecha>-task-<id>-<nombre>/`, como en greenfield.

Las tareas tienen que ser pequeñas, de una jornada o menos. En las demasiado grandes los últimos pasos pierden calidad. Si una tarea crece mientras se trabaja, se divide.

### 2.1. Gestión del contexto

**Una tarea, un contexto.** Cada tarea empieza con una conversación nueva y `sdd-start-task` carga la documentación de anclaje. En codebases grandes conviene usar subagentes para explorar el código sin contaminar el contexto principal, que es lo que recomienda Anthropic para repositorios de ese tamaño.

### 2.2. Verificación

En brownfield el riesgo principal es la **regresión**: cambios plausibles y sintácticamente correctos que rompen un comportamiento existente. Los niveles de verificación se adaptan a eso:

- **Smoke manual documentado en el `walkthrough.md`**, que es la base obligatoria. Verifica la funcionalidad nueva **y** los flujos existentes que toca, con evidencia escrita.
- **Playwright** para proteger los flujos críticos existentes. Cada flujo cubierto es una regresión que se detecta antes de llegar a producción.
- **Tests automatizados donde sea viable.** Introducir TDD en código que no se diseñó para ser testeado es caro, así que se aplica de forma oportunista, en el código nuevo y en las zonas que se tocan a menudo, y no como requisito universal.

### 2.3. Carril rápido: patch

En un sistema en producción los bugs pequeños son frecuentes. Para los deterministas de menos de media hora, `sdd-start-patch` genera un único `patch.md` con síntoma, causa raíz y verificación: trazabilidad completa sin el ciclo entero.

### 2.4. Carril de consulta

En un codebase que no conoces, la mitad de lo que le pides a Claude son preguntas. `sdd-consult` responde con la documentación de anclaje cargada y sin producir artefactos, y avisa cuando la consulta se convierte en trabajo.

### 2.5. Cuándo no usar el ciclo completo

Si el cambio se puede describir en una frase, se hace directamente. La planificación es proporcional a la incertidumbre y al tamaño del cambio.

## 3. Fase 3: presentar al cliente

Igual que en el flujo original: presentación periódica, idealmente semanal, de lo implementado al cliente o a los stakeholders internos; recogida de feedback con notas, capturas y decisiones; y conversión de cada cambio en una tarea nueva que entra por el ciclo de la fase 2.

Si el trabajo se agrupa en entregas, `sdd-end-release` cierra el hito con el acta de feedback triado, la retro con números, el changelog sellado y las notas para el cliente, y `sdd-roadmap` convierte todo eso en el scope de la siguiente. En brownfield el acta tiene una sección que importa especialmente: las peticiones que contradicen un supuesto documentado, porque son las que obligan a corregir el anclaje.

## 4. Trazabilidad y estimación

Cada `plan.md` incluye una estimación y cada `walkthrough.md` registra el tiempo real. Con el histórico se calcula el factor de calibración del equipo, la razón entre real y estimado. En proyectos legacy, donde las estimaciones son históricamente las más inciertas, este mecanismo vale todavía más: al cabo de 10 o 15 tareas las estimaciones se defienden con datos.

Resultados del primer proyecto del equipo con el flujo completo, que era un brownfield: 25 tareas registradas, factor de calibración mediano de 1,0 y un sobrecoste del proceso de alrededor del 9% sobre el tiempo de implementación.

## 5. Evolución: los aprendizajes vuelven al proceso

Cada `walkthrough.md` recoge los aprendizajes de la tarea, y el cierre con `sdd-end-task` obliga a volcarlos a los documentos y a las skills. Un ejemplo real del equipo: un bug de producción causado por un detalle de serialización se convirtió en un artículo de la constitution, y desde entonces ninguna tarea lo repite, la haga quien la haga. En brownfield este bucle es el mecanismo por el que el conocimiento tribal se convierte en activo del proyecto.

## 6. Principio general

Mantén la documentación de anclaje actualizada durante todo el proyecto. Los documentos de `.docs/sdd/` son la fuente de verdad y el contexto base de cualquier interacción con Claude. En brownfield, además, son la única defensa contra el contexto que el agente no puede inferir del código.

## Objetivo final

Reducir el tiempo necesario para entregar cambios validados sobre un sistema existente **sin degradarlo**: manteniendo la calidad, la trazabilidad y la retrocompatibilidad, y garantizando que el resultado sea consistente lo ejecute quien lo ejecute.

---

*Estos tres documentos son la documentación temprana del kit y se mantienen al día con él: cuando una release cambia un carril, un artefacto o una regla que aquí se describe, se actualizan en el mismo cierre. Última revisión: kit v1.1.0, septiembre de 2026.*

## Referencias

- Anthropic, [How Claude Code works in large codebases](https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start)
- Anthropic, [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- METR, [Measuring the impact of AI on experienced developers](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/)
- Thoughtworks Technology Radar, [Spec-driven development](https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development)
- [Anexo: evidencia y referencias](evidence-and-references.md)
