# Flujo de desarrollo rápido con Claude: proyectos greenfield

Este documento explica cómo desarrollar aplicaciones nuevas con Claude. Es la evolución del flujo original del equipo, con la práctica que hemos consolidado en proyectos reales y las recomendaciones oficiales de Anthropic para Claude Code.

Durante 2025 y 2026 la industria ha convergido en flujos de este tipo, conocidos como *spec-driven development*. GitHub con Spec Kit, AWS con Kiro y Anthropic describen el mismo ciclo: especificación, plan, implementación y verificación. Todavía no es un estándar formal, aunque sí la dirección hacia la que va todo el sector. La evidencia completa está en el [anexo de referencias](evidence-and-references.md).

Un principio atraviesa todo el flujo: el resultado debe depender del proceso y no del criterio de quien lo ejecuta. Las convenciones y las decisiones técnicas viven en los documentos y en las skills del proyecto, así que cualquier persona puede incorporarse y producir resultados consistentes desde el primer día.

## 1. Fase 1: fundamentos del proyecto

Con la información del cliente (objetivo, funcionalidades, actores, requisitos) y la propuesta de arquitectura del equipo técnico, se construyen los fundamentos del proyecto con **Claude Code**. Si todavía no hay repositorio, Claude Chat sirve para el análisis inicial.

La skill `sdd-init-greenfield` del kit automatiza esta fase: te entrevista sobre el proyecto y genera la documentación y las skills iniciales.

### 1.1. Documentación de anclaje

El fichero único `Claude.md` del flujo original se convierte en varios documentos con responsabilidades separadas. El motivo es práctico: un solo documento con toda la información genera un contexto inicial enorme en cada conversación, mientras que con documentos separados cada tarea carga solo lo que necesita.

| Contenido (antes en `Claude.md`) | Documento |
| --- | --- |
| Descripción del proyecto y objetivos | `.docs/sdd/mission.md` |
| Decisiones técnicas y convenciones no negociables | `.docs/sdd/constitution.md` |
| Tecnologías utilizadas, con versiones | `.docs/sdd/tech-stack.md` |
| Arquitectura, estructura de carpetas y modelo de datos | `.docs/sdd/architecture.md` |
| Comportamiento del producto, una capacidad por fichero | `.docs/sdd/capabilities/` |
| Estado y prioridades del proyecto | `.docs/sdd/roadmap.md` |
| Punteros a los anteriores y reglas críticas | `CLAUDE.md` (corto) |

Esta separación es la recomendación oficial de Anthropic: el `CLAUDE.md` tiene que ser corto y por capas, porque uno inflado hace que Claude ignore las instrucciones que contiene.

Hay documentos que solo aparecen si el proyecto los necesita, y se activan por la presencia de su propio fichero, sin configuración: `estimation.md` enciende el registro de estimaciones, `changelog.md` el changelog técnico, `client-changelog.md` las novedades para el cliente y `environments.md` el contrato de entorno por worktree. La entrevista del init pregunta por cada uno.

La entrevista incluye además **cinco reglas de producto** que, si no se preguntan, el agente decide al azar en cada tarea: dónde viven los datos, en qué idioma van los nombres, qué límites hay, qué se avisa al usuario y qué manda cuando dos vías dan el mismo dato. Quedan escritas en la constitution y cada capacidad puede matizarlas.

### 1.2. Capacidades: la verdad viva del comportamiento

`capabilities/` merece un apartado propio porque es donde vive lo que el sistema hace, con un fichero por capacidad. Una capacidad es un sustantivo del dominio, nunca un ticket ni una tarea.

La carpeta nace vacía y crece tarea a tarea. Cada spec declara su **delta** sobre las capacidades que toca: `ADDED` para un requisito nuevo, `MODIFIED` para uno que cambia y `REMOVED` para uno que se retira. Al cerrar la tarea, `sdd-end-task` fusiona ese delta en el fichero de la capacidad y añade una línea al historial. Así el fichero describe siempre el comportamiento actual, no el histórico de cómo se llegó a él, y es lo primero que lee la tarea siguiente.

El comportamiento observable vive solo ahí. Los documentos de anclaje enlazan a la capacidad en lugar de copiar sus valores, porque una copia queda desactualizada en cuanto un `MODIFIED` toca el original.

### 1.3. Partición en tareas y estimación

- Divide el proyecto en módulos funcionales con sus dependencias explícitas. Así puedes repartirlos entre varios desarrolladores sin que se pisen.
- Las tareas tienen que ser pequeñas, de una jornada o menos. En las demasiado grandes los últimos pasos pierden calidad, sobre todo cuando hay que ir corrigiendo. Si una tarea crece mientras se trabaja, se divide.
- Estima cada módulo con una banda optimista y pesimista, y regístralo en el `roadmap.md`.

El resultado de esta fase es el plan de implementación, igual que en el flujo original.

### 1.4. Kit de skills

Instala el kit SDD desde el primer día:

- **Skills de proceso**, agnósticas del stack, organizadas por carriles: `sdd-init-greenfield` y `sdd-init-brownfield` para arrancar; `sdd-start-task` y `sdd-end-task` para el ciclo completo; `sdd-start-patch` y `sdd-end-patch` para el carril corto; `sdd-start-release` y `sdd-end-release` para el carril de release; `sdd-consult` para preguntar sin producir artefactos; `add-to-changelog`; y `sdd-templates`, que guarda las plantillas.
- **Skills técnicas**, según el stack elegido: por ejemplo `sql-migration`, `translation-migration`, `backend-command` y `backend-query` para CQRS, `backend-feature` para casos de uso, o `frontend-feature`.

Las skills encapsulan las convenciones del proyecto, así que nadie tiene que recordarlas ni interpretarlas: basta con seguir el flujo.

Las plantillas viven en el kit y no se copian al proyecto. Cuando el kit se actualiza, `sdd-init-brownfield` aplica las migraciones pendientes leyendo la versión que el proyecto tiene anotada en `.docs/sdd/sdd-kit.json`.

## 2. Fase 2: implementación, ciclo por tarea

Antes de empezar, inicializa el repositorio Git y haz commits frecuentes, como en el flujo original.

Cada tarea del plan sigue el mismo ciclo, guiado por las skills:

1. **Arranque** con `sdd-start-task`, que carga el contexto del proyecto y para. Desde ahí enruta: una pregunta va a `sdd-consult`, un bug determinista al carril patch, un cambio acotado al modo lite y el resto al ciclo completo.
2. **Especificación**: sesión de brainstorming con Claude cuyo resultado es `spec.md`, qué hay que hacer y por qué, con el delta de comportamiento por capacidad. Empieza por las decisiones que el agente ha tomado sin ti, que es lo único que necesitas leer para aprobarla. Según la complejidad, propone una revisión adversarial de la spec y tú decides si la activas.
3. **Plan** en `plan.md`: cómo se va a hacer, con la estimación de esfuerzo, el modelo por tarea y las restricciones globales que viajarán en cada encargo.
4. **Tareas** en `tasks.md`, solo si el plan tiene varios pasos que conviene seguir por separado.
5. **Implementación** con subagentes, que es el modo por defecto: un agente fresco por tarea y revisión entre tareas. La ejecución en línea con checkpoints es la excepción y el plan la declara con su motivo. **Antes de despachar a nadie, el hilo principal escribe los tests que codifican los escenarios de la spec**, uno por THEN y en rojo, y los commitea: son el contrato del implementador, que los hace pasar y no los redacta.
6. **Verificación**, que se detalla en el punto 2.2.
7. **Validación**: antes de cerrar, el agente presenta qué hay, cómo probarlo y el smoke que ha ejecutado, y espera a que digas qué has probado tú y que funciona. Pedir el cierre no es validar.
8. **Cierre** con `walkthrough.md`, donde queda lo que se hizo y el tiempo real invertido, y `sdd-end-task`, que fusiona el delta en `capabilities/`, vuelca los aprendizajes a los documentos vivos y actualiza changelog, roadmap y registro de estimaciones.

Para cambios acotados existe el **modo lite**, que no es un carril aparte: spec corta y sin plan, conservando el gate de aprobación, el smoke y el walkthrough.

Estructura recomendada:

```text
/
├── CLAUDE.md
├── .docs/
│   └── sdd/
│       ├── mission.md, constitution.md, tech-stack.md,
│       │   architecture.md, roadmap.md, changelog.md
│       ├── capabilities/
│       └── specs/
│           └── <fecha>-task-<id>-<nombre>/
│               ├── spec.md
│               ├── plan.md
│               ├── tasks.md
│               └── walkthrough.md
```

### 2.1. Gestión del contexto

**Una tarea, un contexto.** Cada tarea empieza con una conversación nueva. No agrupes tareas en la misma conversación ni esperes a agotar el contexto. Empezar de cero no cuesta nada, porque `sdd-start-task` carga la documentación de anclaje que hace falta.

### 2.2. Verificación

Tres niveles, del mínimo obligatorio al recomendado:

- **Smoke manual** documentado en el `walkthrough.md`. Es la verificación mínima de cada tarea y siempre deja evidencia escrita.
- **Playwright** para validar los flujos de usuario de extremo a extremo. El frontend es donde los agentes cometen más errores, y la validación automatizada en navegador los detecta antes de la entrega.
- **TDD** durante la implementación, escribiendo el test antes del código. En un proyecto nuevo introducirlo cuesta muy poco, y es la red de seguridad de todas las tareas siguientes.

Las incidencias detectadas se corrigen antes de presentar al cliente, igual que en el flujo original.

### 2.3. Carril rápido: patch

Para bugs pequeños y deterministas, de menos de media hora, no hace falta el ciclo completo. `sdd-start-patch` genera un único `patch.md` con síntoma, causa raíz y verificación. Mantiene la trazabilidad sin añadir burocracia.

```text
/
├── .docs/
│   └── sdd/
│       └── specs/
│           └── <fecha>-patch-<id>-<nombre>/
│               └── patch.md
```

### 2.4. Carril de consulta

No todo lo que le pides a Claude es trabajo. Para preguntar, entender o pensar en voz alta con el contexto cargado está `sdd-consult`, que responde sin crear carpetas ni ramas. Tiene tres modos: entender, que lee y responde; sondear, para probar algo desechable cuya salida es una respuesta y no código que se conserve; y pensar, un interrogatorio para estructurar una dirección. Cuando la consulta se convierte en trabajo, avisa y pasa al carril que toque.

### 2.5. Cuándo no usar el ciclo completo

Si el cambio se puede describir en una frase, se hace directamente. La propia guía de Anthropic lo dice: la planificación tiene que ser proporcional a la incertidumbre y al tamaño del cambio, no un trámite universal.

## 3. Fase 3: presentar al cliente

### 3.1. Presentación

Cada iteración termina presentando lo desarrollado desde la última reunión, idealmente cada semana: funcionalidades implementadas, cambios solicitados y ajustes visuales o de usabilidad. Sirve para obtener feedback rápido y mantener la alineación con el cliente.

### 3.2. Recoger feedback

Durante la reunión se recoge toda la información posible: notas, capturas, decisiones y necesidades nuevas. Si se puede, graba la sesión. Después:

- Analiza el feedback con Claude Code y relaciónalo con el proyecto existente.
- Convierte cada cambio en una tarea nueva, que entra por el ciclo de la fase 2.

### 3.3. Carril de release

Cuando el trabajo se agrupa en entregas, hay dos skills más. `sdd-end-release` cierra el hito: inventario completo del feedback con su triaje, que decides tú punto por punto; retro con los números del registro de estimaciones; changelog sellado; notas de release destiladas del changelog y escritas en beneficio para quien las va a leer, nunca copiadas de él; roadmap colapsado; y el merge y el tag, que confirmas tú. `sdd-start-release` abre la siguiente: convierte el acta y la deuda en un scope ordenado con su recomendación y sus bloqueos, y solo refina las primeras tareas, porque detallar lo lejano produce specs que caducan.

Trabajar por releases es opcional. Si el proyecto no lo necesita, las tareas se cierran una a una y ya está.

## 4. Trazabilidad y estimación

Cada `plan.md` incluye una estimación y cada `walkthrough.md` registra el tiempo real. Un script agrega los datos y calcula el factor de calibración del equipo, la razón entre real y estimado. Con ese histórico las estimaciones se defienden con datos delante del cliente, y mejoran con cada tarea cerrada.

Resultados del primer proyecto del equipo con el flujo completo: 25 tareas registradas, factor de calibración mediano de 1,0, es decir que las estimaciones se cumplen, y un sobrecoste del proceso de alrededor del 9% sobre el tiempo de implementación.

## 5. Evolución de las skills

Las skills crecen en tres niveles:

1. **Proceso**, el kit: desde el día cero e iguales en todos los proyectos.
2. **Técnicas**, por stack: se eligen al fijar las tecnologías.
3. **Específicas del proyecto** (dialogs, styles, build y demás): se crean cuando las convenciones se consolidan, alimentadas por los aprendizajes de los walkthroughs.

## 6. Diseño (opcional)

Si el cliente tiene diseños o el equipo de UX aporta prototipos, usa **Claude Design** para facilitar la implementación visual. Exporta el diseño con la opción específica para Claude Code, o en ZIP, y pídele a Claude Code que integre los recursos. No uses capturas de pantalla como fuente principal, porque se pierde la información estructural y de componentes.

## 7. Principio general

Mantén los requisitos, la arquitectura y el plan de implementación actualizados durante todo el proyecto. Los documentos de `.docs/sdd/` son la fuente de verdad y el contexto base de cualquier interacción con Claude. Los aprendizajes de cada tarea vuelven a los documentos y a las skills antes de seguir, de modo que el proyecto va mejorando su propio proceso.

## Objetivo final

Reducir el tiempo que va de una idea a una funcionalidad validada por el cliente, manteniendo la calidad, la trazabilidad y la alineación con sus necesidades, y garantizando que el resultado sea consistente lo ejecute quien lo ejecute. La documentación es el medio para conseguirlo.

---

*Estos tres documentos son la documentación temprana del kit y se mantienen al día con él: cuando una release cambia un carril, un artefacto o una regla que aquí se describe, se actualizan en el mismo cierre. Última revisión: kit v1.1.0, septiembre de 2026.*

## Referencias

- Anthropic, [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices)
- GitHub, [Spec Driven Docs](https://github.com/github/spec-kit/blob/main/spec-driven.md) y [Spec Kit](https://github.com/github/spec-kit)
- AWS, [Kiro](https://kiro.dev/) y [retirada de Amazon Q Developer](https://aws.amazon.com/blogs/devops/amazon-q-developer-end-of-support-announcement/)
- Thoughtworks Technology Radar, [Spec-driven development](https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development)
- Martin Fowler, [Understanding Spec-Driven Development](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [Anexo: evidencia y referencias](evidence-and-references.md)
