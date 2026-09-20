# Flujo de desarrollo rápido con Claude: anexo de evidencia y referencias

Este anexo recoge la evidencia que sustenta los documentos de flujo [greenfield](greenfield.md) y [brownfield](brownfield.md). Todas las fuentes se verificaron el 9 de julio de 2026 leyendo directamente la fuente primaria. A diferencia de los otros dos, este documento no describe el kit, así que envejece con sus fuentes y no con cada release.

Cada afirmación lleva una etiqueta de fiabilidad:

- **[CONSENSO]**: varias fuentes independientes coinciden.
- **[EVIDENCIA]**: dato empírico medido, ya sea un estudio, telemetría o una encuesta.
- **[VENDOR]**: afirmación de un fabricante o parte interesada, sin verificación independiente.
- **[OPINIÓN]**: análisis o posición de un autor o una consultora.

## 1. Estado del arte del spec-driven development

**[CONSENSO]** El término dominante en la industria es *spec-driven development* (SDD). Lo usan con esa forma exacta GitHub, Microsoft, IBM, AWS y Thoughtworks. *Spec-first* aparece como sinónimo.

**[EVIDENCIA]** SDD **todavía no es un estándar formal**. El Technology Radar de Thoughtworks lo sitúa en el anillo *Assess*, que significa que merece la pena explorarlo pero aún no adoptarlo, y advierte de que la terminología se usa de forma inconsistente y de que algunas herramientas generan especificaciones largas y difíciles de revisar. Un estudio académico de junio de 2026 que compara seis frameworks SDD confirma que el significado de «spec» sigue evolucionando.

**[CONSENSO]** Lo que sí hay es una **convergencia industrial de facto**: GitHub, AWS y Anthropic describen, cada uno con su producto, el mismo flujo de especificación, plan, tareas, implementación y verificación. El mismo estudio académico encuentra convergencia en la idea central: el prompt aislado pierde centralidad, y los **artefactos persistentes, la trazabilidad y la revisión humana** pasan a ser los mecanismos del desarrollo con agentes.

**Formulación defendible para los documentos internos**: «SDD es el flujo hacia el que ha convergido toda la industria de herramientas de IA entre 2025 y 2026, con adopción masiva de tooling, aunque los organismos independientes todavía lo clasifican como práctica en evaluación.»

## 2. Convergencia de la industria

| Herramienta | Promotor | Estado (julio de 2026) | Indicadores de adopción |
| --- | --- | --- | --- |
| **Spec Kit** | GitHub y Microsoft | Activo, v0.12.8 (08-07-2026), MIT | ~119.000 estrellas, 10.500 forks, soporte para más de 30 agentes |
| **Kiro** | AWS | GA desde noviembre de 2025 | Más de 250.000 desarrolladores durante el preview |
| **superpowers** | Jesse Vincent (obra) | Activo, v6.1.1 (02-07-2026), MIT | Uno de los plugins más populares del marketplace de Claude Code |
| **BMAD-Method** | Comunidad open source | Activo, v6.8 (mayo de 2026) | ~49.000 estrellas, más de 12 personas de agente |

Hechos destacables:

- **[EVIDENCIA]** AWS ha anunciado el **fin de soporte de Amazon Q Developer** el 30-04-2027, sin nuevas altas desde el 15-05-2026, con migración a Kiro. Es decir: AWS ha sustituido su producto insignia de codificación por uno construido alrededor del SDD.
- **[EVIDENCIA]** Spec Kit implementa un workflow de siete fases (constitution, specify, clarify, plan, tasks, validate, implement), estructuralmente idéntico al flujo del equipo.
- **[OPINIÓN]** El framework *superpowers*, base del kit, lo analizó Simon Willison, referente independiente del sector, que destaca precisamente los pasos de planificación y el TDD.
- **[CONSENSO, crítica]** Las revisiones independientes de Spec Kit señalan que el sobrecoste de la spec puede superar al beneficio en tareas pequeñas. El flujo del equipo lo resuelve con el carril patch y con la regla de que si el cambio se describe en una frase, se hace directamente.

## 3. Las guías oficiales de Anthropic y el flujo del equipo

El flujo descrito en los dos documentos coincide punto por punto con las *best practices* oficiales de Anthropic para Claude Code, así que no es una ocurrencia local:

| Recomendación oficial de Anthropic | En el flujo del equipo |
| --- | --- |
| Flujo Explore, Plan, Implement, Commit; «dejar que Claude salte directamente al código produce código que resuelve el problema equivocado» | Ciclo spec, plan, implementación, walkthrough |
| Patrón entrevista a spec: «keep interviewing until we've covered everything, then write a complete spec» | Brainstorming hasta una `spec.md` aprobada antes de continuar |
| «Time spent making the spec precise pays off more than time spent watching the implementation» | La spec y el plan se revisan; la implementación va con checkpoints |
| «If you could describe the diff in one sentence, skip the plan» | Sección «Cuándo no usar el ciclo completo» y carril patch |
| `CLAUDE.md` corto y por capas; «un CLAUDE.md inflado hace que Claude ignore las instrucciones» | `CLAUDE.md` con punteros y documentos de anclaje separados |
| La ventana de contexto es el recurso más importante; `/clear` entre tareas | Una tarea, un contexto |
| Subagentes para investigar sin contaminar el contexto principal | Gestión del contexto en codebases grandes (brownfield) |
| El conocimiento que solo aplica a veces va en skills, no en el `CLAUDE.md` | Kit de skills en tres niveles |
| «If you can't verify it, don't ship it» | Verificación por niveles con evidencia en el walkthrough |

## 4. Evidencia cuantitativa: qué pasa con la IA sin estructura

El patrón que emerge de fuentes independientes: **la velocidad de generación ya no es el cuello de botella; lo son la revisión, la verificación y el mantenimiento.** Es exactamente el hueco que cubre el SDD.

| Fuente | Qué mide | Resultado |
| --- | --- | --- |
| METR (RCT, 2025) | Desarrolladores experimentados con IA en repositorios grandes y maduros | **−19% de velocidad**, y creían ir un 20% más rápido |
| DORA 2025 (Google) | Telemetría y encuesta a escala | La IA **amplifica** lo que ya existe: sube el throughput **y** sube la inestabilidad |
| Faros AI 2026 | Telemetría de 22.000 desarrolladores | Tareas +34%, pero tiempo de revisión de PR **+441%**, bugs por desarrollador +54%, incidentes por PR +242% |
| GitClear 2026 | Calidad del código a escala | Duplicación por copia y pega del 9,4% al **15,7%**; refactoring −70% |
| Uplevel 2024 | ~800 desarrolladores con Copilot sin proceso | Sin mejora de ciclo y **+41% de bugs** en los PR |
| CodeRabbit 2025 | Revisión de código generado por IA | **1,7× más issues graves**, de lógica y de seguridad |
| Stack Overflow 2025 | Encuesta anual | El 84% usa IA y solo el 29% confía en su exactitud; el 66% pierde tiempo arreglando código «casi correcto» |

Matices que conviene conocer, porque dan credibilidad ante un lector crítico:

- **[EVIDENCIA]** METR actualizó el estudio en febrero de 2026: con las herramientas y flujos de finales de 2025 la ralentización **se revierte**, con estimaciones de +18% y +4% e intervalos amplios. Los propios autores califican la nueva señal de poco fiable por sesgos de selección, ya que entre el 30% y el 50% de los desarrolladores eligieron no enviar tareas donde esperaban más beneficio de la IA, y advierten de que la adopción generalizada hace cada vez más difícil medir la productividad por tarea. Conclusión honesta: la IA de 2026 sí acelera, pero la magnitud es incierta y depende del flujo de trabajo.
- **[EVIDENCIA, autoinformada]** La encuesta de METR de mayo de 2026, con 349 trabajadores técnicos, reporta ganancias percibidas muy grandes, con una mediana de 3× en velocidad, pero la propia METR advierte de que los encuestados sobreestiman de forma sistemática: en su ensayo de 2025 los desarrolladores creían ir un 20% más rápido cuando iban un 19% más lentos. La lección para el equipo es que la percepción no es una métrica, y el registro de estimado contra real de cada tarea sí lo es.
- **[EVIDENCIA]** El término *vibe coding* lo acuñó Andrej Karpathy en febrero de 2025, explícitamente para prototipos de un solo uso y no para producción. Fue palabra del año 2025 del diccionario Collins.
- Todavía no existe un ensayo controlado que compare directamente SDD contra no-SDD. La defensa del SDD se apoya en el diagnóstico empírico de la tabla anterior, en la convergencia unánime de la industria y en la coincidencia con las guías oficiales de Anthropic.

## 5. Evidencia a favor de la planificación y la estructura

No existe todavía ningún estudio que compare SDD completo contra no-SDD: el paper académico que compara seis frameworks lo reconoce de forma explícita y reclama una agenda de evaluación empírica. Lo que sí existe son tres capas de evidencia convergente:

- **[EVIDENCIA, revisada por pares]** *Self-Planning Code Generation with LLMs* (TOSEM, 2024): hacer que el modelo **planifique antes de implementar** mejora el resultado hasta un **+25,4% relativo** frente a la generación directa. Es la ablación más limpia de «plan primero». Su limitación son las tareas a nivel de función y los modelos pre-agénticos.
- **[EVIDENCIA]** *From Plan to Action* (2026): sobre unas 17.000 trayectorias de agentes en SWE-bench, **eliminar el plan reduce la tasa de resolución**, y recordarlo periódicamente mejora el rendimiento de forma consistente. El matiz que da credibilidad es que **un plan incompleto es peor que ningún plan**, así que la evidencia defiende specs y planes bien hechos y mantenidos, no la ceremonia por sí misma. Coincide con la regla del flujo: la spec se revisa y se aprueba antes de continuar.
- **[EVIDENCIA]** *Agentless* (FSE 2025): un pipeline estructurado de tres fases superó a todos los agentes autónomos open source de la época, con un coste muy inferior. Estructura de proceso por encima de autonomía libre.
- **[EVIDENCIA, descriptiva]** Anthropic, con telemetría de unas 400.000 sesiones reales de Claude Code en 2026: el patrón de uso dominante entre quienes tienen éxito es que **el humano retiene en torno al 70% de las decisiones de planificación y solo un 20% de las de ejecución**. Los usuarios expertos duplican la tasa de éxito verificado de los novatos, entre el 28% y el 33% frente al 15%, así que el dominio del proceso importa tanto como la herramienta.
- **[CONSENSO]** DORA 2025: las prácticas de proceso disciplinado, como lotes pequeños, commits frecuentes y control de versiones fuerte, **amplifican el beneficio medido de la IA**. Es evidencia correlacional, aunque la más sólida disponible a escala organizativa.

**Formulación defendible para los documentos internos**: «todavía no hay un ensayo que mida el SDD como metodología completa; lo que hay son ablaciones que muestran que planificar mejora el resultado de los agentes, telemetría que muestra que el patrón de uso experto es plan humano y ejecución del agente, y evidencia organizativa de que la disciplina de proceso amplifica el beneficio de la IA.»

## 6. Greenfield frente a brownfield

- **[CONSENSO]** El rendimiento de la IA es asimétrico: excelente en greenfield, con código aislado y sin dependencias ocultas, y con un fuerte impuesto de integración en brownfield, donde hay contratos invisibles y deuda acumulada.
- **[EVIDENCIA]** El ensayo de METR se hizo precisamente en repositorios grandes y maduros, de más de un millón de líneas, que es el escenario brownfield. Es el mejor dato citable de que en legacy la IA sin estructura puede restar.
- **[EVIDENCIA]** El riesgo característico en brownfield son los cambios «plausibles, sintácticamente válidos y semánticamente incorrectos» que pasan la revisión. Lo corrobora el 1,7× de issues de CodeRabbit.
- **[EVIDENCIA]** Thoughtworks observa que sus equipos usan Spec Kit «sobre todo en entornos brownfield»: la spec como contrato explícito compensa el contexto que el agente no puede inferir.
- **[CONSENSO, mitigaciones]** Para legacy las guías coinciden: fase previa de onboarding del codebase, `CLAUDE.md` por capas, subagentes de exploración, protección con tests de los flujos que se tocan, y verificación antes de dar nada por acabado. Es la fase 1 del documento brownfield.

## 7. Resultados internos del equipo (anonimizados)

Datos propios de proyectos del equipo que aplican este flujo:

- **Calibración de estimaciones**: en el primer proyecto con el flujo completo, un brownfield, hay **25 tareas registradas** con estimación previa y tiempo real; la mediana del factor de calibración, real entre estimado, es **1,0**, así que las estimaciones se cumplen. El método declara fiabilidad a partir de 10 o 15 tareas.
- **Sobrecoste del proceso**: en la estimación de un MVP greenfield, el flujo SDD añade en torno a un **9%** sobre el tiempo de implementación, de 189 h a 207 h. Como referencia, una feature fullstack media son unas 2 h de spec y plan y unas 5,75 h de implementación.
- **Onboarding brownfield sin parar el desarrollo**: un proyecto legacy del equipo arrancó el flujo con cuatro documentos de anclaje y ha completado siete tareas con el ciclo entero mientras seguía entregando.
- **El coste de no tener proceso**, en un proyecto del equipo nacido con vibe coding y documentado en julio de 2026: la librería de CQRS se migró sin actualizar ningún documento, de modo que la documentación contradice al código; una skill apunta a rutas que ya no existen tras una reestructuración; las instrucciones de agente referencian un sistema de planificación borrado meses antes; tres ficheros de instrucciones divergentes describen stacks distintos; y la versión de base de datos documentada no coincide con la infraestructura real. Ninguna de esas derivas es posible con el ciclo SDD, porque el cierre de cada tarea obliga a sincronizar documentos, skills y código.

## 8. Riesgos y límites reconocidos del SDD

Reconocer los límites es parte de la credibilidad del flujo:

- **Sobrecoste en tareas pequeñas**: la planificación es proporcional a la incertidumbre. Para eso existen el carril patch y la regla del cambio de una frase, que la propia Anthropic recomienda.
- **Especificaciones largas difíciles de revisar**, que es la crítica de Thoughtworks a algunas herramientas: las plantillas del equipo limitan la estructura de la spec y la revisión humana es obligatoria antes de implementar.
- **Volumen no es fidelidad**: en brownfield complejo, generar mucha documentación no garantiza que sea correcta. Por eso la regla es documentar el estado real y no el ideal, y hacer crecer la documentación tarea a tarea.
- **Terminología todavía fluida**: el nombre puede cambiar; el mecanismo, que son artefactos persistentes más trazabilidad más revisión humana, es lo que la industria ha validado.

## 9. Tabla de fuentes

| Fuente | Tipo | Enlace |
| --- | --- | --- |
| Anthropic, Best practices for Claude Code | Guía oficial | <https://code.claude.com/docs/en/best-practices> |
| Anthropic, Claude Code in large codebases | Guía oficial | <https://claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start> |
| Anthropic, Effective context engineering | Guía oficial | <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents> |
| GitHub, Spec Kit (repositorio) | Herramienta | <https://github.com/github/spec-kit> |
| GitHub Blog, Spec-driven development | Anuncio | <https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/> |
| Microsoft, Spec-driven development, AI-native engineering | Análisis | <https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering> |
| AWS, Kiro | Herramienta | <https://kiro.dev/> |
| AWS, fin de soporte de Amazon Q Developer | Anuncio | <https://aws.amazon.com/blogs/devops/amazon-q-developer-end-of-support-announcement/> |
| obra/superpowers (repositorio) | Herramienta | <https://github.com/obra/superpowers> |
| Simon Willison, análisis de superpowers | Opinión experta | <https://simonwillison.net/2025/Oct/10/superpowers/> |
| Thoughtworks Technology Radar, SDD | Evaluación independiente | <https://www.thoughtworks.com/en-us/radar/techniques/spec-driven-development> |
| METR, estudio RCT 2025 | Evidencia | <https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/> |
| METR, actualización 2026 | Evidencia | <https://metr.org/blog/2026-02-24-uplift-update/> |
| METR, encuesta de uso de IA (mayo de 2026) | Evidencia (encuesta autoinformada) | <https://metr.org/blog/2026-05-11-ai-usage-survey/> |
| DORA 2025, State of AI-assisted software development | Evidencia | <https://dora.dev/dora-report-2025/> |
| Faros AI, AI Engineering Report 2026 | Evidencia (telemetría de vendor) | <https://www.faros.ai/research/ai-acceleration-whiplash> |
| GitClear, AI code quality 2026 | Evidencia (telemetría) | <https://www.gitclear.com/the_ai_code_quality_maintainability_gap> |
| Uplevel, vía Visual Studio Magazine | Evidencia | <https://visualstudiomagazine.com/articles/2024/09/17/another-report-weighs-in-on-github-copilot-dev-productivity.aspx> |
| CodeRabbit, vía The Register | Evidencia (vendor) | <https://www.theregister.com/2025/12/17/ai_code_bugs/> |
| Stack Overflow Developer Survey 2025 | Evidencia (encuesta) | <https://survey.stackoverflow.co/2025/ai> |
| Estudio académico, comparativa de frameworks SDD | Académico | <https://arxiv.org/abs/2606.04967> |
| Jiang et al., Self-Planning Code Generation (TOSEM 2024) | Académico (revisado por pares) | <https://dl.acm.org/doi/10.1145/3672456> |
| From Plan to Action (2026) | Académico (preprint) | <https://arxiv.org/abs/2604.12147> |
| Agentless (FSE 2025) | Académico | <https://arxiv.org/abs/2407.01489> |
| Anthropic, How Claude Code is used in practice | Evidencia (telemetría) | <https://www.anthropic.com/research/claude-code-expertise> |
| DORA, AI Capabilities Model | Evidencia (encuesta) | <https://cloud.google.com/blog/products/ai-machine-learning/introducing-doras-inaugural-ai-capabilities-model> |

Afirmaciones que circulan pero que **no** hay que usar como pilar, porque no son rastreables a una fuente primaria o carecen de auditoría independiente: «3-10× más éxito a la primera», atribuida a GitHub y AWS sin fuente primaria; «50% menos errores con SDD», que se remonta a blogs y no a ningún estudio controlado; el caso Rackspace de «52 semanas a 3», que es afirmación de AWS y su cliente; y «McKinsey: −46% en tareas rutinarias», que solo aparece en fuentes secundarias.
