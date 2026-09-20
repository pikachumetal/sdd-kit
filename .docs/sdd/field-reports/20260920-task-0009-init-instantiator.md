<!-- Recibido el 2026-09-20 pegado en la conversación por el dev-lead (no existía como fichero: el agente lo generó desde una pregunta lateral, sin poder escribir). Copia literal. PARCIAL: cubre hasta la Task 3 cerrada y la Task 4 en curso; la revisión final, el smoke y `sdd-end-task` pueden añadir hallazgos. -->

# Ticket sdd-kit — hallazgos de la task 0009 (sdd-project-templates)

**Origen**: sesión de `sdd-start-task` sobre la task 0009 (`init.mjs`: instanciador con renombrado completo y poda total del dialecto). Modo full, 6 tasks, ejecución mixta: tasks 1 y 6 en línea, 2–5 por subagente Sonnet. El dev-lead delegó el avance hasta el smoke final. La máquina se reinició dos veces durante la ejecución.

**Cómo leer este ticket**: cada hallazgo trae evidencia (qué pasó en la sesión), impacto, propuesta y criterio de aceptación. Están ordenados por coste observado. Ninguna propuesta está validada con el TDD de `writing-skills`: son hipótesis a testear con RED/GREEN antes de tocar una skill.

## P1 — Cuellos de botella

### 1. Verificaciones que superan el tope de 10 min por comando de un subagente

- **Evidencia**: `backend:test` sobre SQL Server tarda entre 17 y 21 min; en postgres tarda 1,5 min. Un implementador no puede esperarlo en primer plano. El plan pedía «cerrar con los dos dialectos» y hubo que corregirlo en ejecución con un ruling: el implementador verifica el camino rápido y el controlador lanza la suite lenta en segundo plano mientras el revisor revisa.
- **Impacto**: sin guía, el implementador se cuelga, se salta la verificación o reporta DONE sin ella. Además, mientras la suite lenta corre bloquea los binarios (`bin/`) y no se puede despachar otro implementador que compile lo mismo.
- **Propuesta**: en el paso 6 de `sdd-start-task` y en `plan-template.md`, un campo por task `Verificación lenta: <comando> · la ejecuta el controlador en background`. Regla de despacho: la siguiente task puede arrancar durante la suite lenta solo si sus ficheros son disjuntos y se le prohíben los comandos que compiten por los mismos binarios.
- **Aceptación**: con un plan cuya verificación dura más de 10 min, el encargo del implementador nombra qué no debe ejecutar. El controlador lanza la verificación en paralelo con la revisión. Un fallo tardío entra en el fix loop.

### 2. El brief del implementador no lleva los contratos entre tasks

- **Evidencia**: `task-brief` de superpowers extrae solo el texto de la task. Las interfaces que el plan fija en §1.4 (`IDatabaseDialect`, `ITestDialect`, forma de `template.json`, firmas de Node) no viajan. Hubo que extraerlas a mano con `sed` a un `contracts.md` y citarlo en cada encargo. Lo mismo ocurrió con «Restricciones globales».
- **Impacto**: trabajo manual por task y riesgo de que un implementador invente firmas.
- **Propuesta**: primero, que `plan-template.md` adopte por task el bloque `Interfaces: Consume / Produce` que ya trae superpowers. Segundo, un script del kit (`sdd-brief PLAN N`) que emita en un solo fichero restricciones globales, contratos citados por la task y texto de la task.
- **Aceptación**: un encargo se compone con una ruta de fichero, sin `sed` manual.

### 3. «Restricciones globales» literales en cada encargo frente a «entrega artefactos como ficheros»

- **Evidencia**: el kit exige copiar el bloque íntegro en cada encargo (medido en E3: en prosa se pierde). superpowers advierte que todo lo pegado queda residente en el contexto del controlador. Son unas 38 líneas por 8 encargos. Se resolvió con una variante no medida: bloque en fichero + «léelo PRIMERO» + las 2–3 restricciones más incumplidas pegadas literales. Los revisores de las tasks 2 y 3 sí aplicaron las restricciones.
- **Propuesta**: medir esa variante con el mismo método de `tests/gates-reviews-red.md`. Si aguanta, sustituir la regla.
- **Aceptación**: tasa de llegada del bloque ≥ la de la copia literal, con menos contexto residente.

### 4. Reviews de spec con lentes solapadas

- **Evidencia**: dos revisores, de unos 100k tokens cada uno, con 18 hallazgos, todos aceptados. El valor es alto: cazaron dos `MODIFIED` no declarados y un seed dentro de una migración «inmutable». Pero 4 hallazgos salieron duplicados, porque los puntos 1–4 del encargo son comunes a ambas lentes.
- **Propuesta**: repartir los puntos comunes. Dominio: 1 (contradicción con capacidades), 3 (alcance oculto) y 5 bis. Técnica: 2 (escenarios no verificables), 4 (decisiones ocultas) y 6.
- **Aceptación**: sobre la misma spec, menos de un 10 % de hallazgos duplicados sin perder ninguno de los críticos.

## P2 — Huecos de proceso

### 5. Aprobación delegada no existe en el kit

- **Evidencia**: tras aprobar la spec, el dev-lead dijo «puedes ir tú solo avanzando y nos vemos en el smoke final». Los gates de spec y de plan no contemplan delegación. Se registró la frase literal en la tabla de aprobaciones y en la cabecera del plan, y se interpretó que cubre el gate del plan pero no la validación del paso 7.
- **Propuesta**: definir la «aprobación delegada». Cubre el gate del plan y los rulings de ejecución. No cubre nunca la validación del trabajo ni el merge. Se registra con la cita literal y la fecha. Las «Decisiones que he tomado yo» del plan se presentan igualmente en el paso 7.
- **Aceptación**: escenario de test en el que el usuario delega tras la spec; el agente no se para en el plan y sí en la validación.

### 6. Tests RED «uno por THEN» no encajan en refactors que preservan comportamiento

- **Evidencia**: 4 de 6 tasks eran refactors. El contrato útil fue otro: un test estructural escrito en la Task 1, el test de residuos por áreas, que quedaba en rojo por área hasta que cada task lo ponía verde. A eso se sumó el recuento de la suite existente como invariante (98 → 105, justificando cada variación). Funcionó: los implementadores no redactaron su propio contrato.
- **Propuesta**: documentar el patrón en el paso 6: «en refactors, contrato = suite existente + recuento + test estructural escrito antes».

### 7. Hallazgo de revisión cuyo arreglo pertenece a una task posterior

- **Evidencia**: el revisor de la Task 2 marcó un Important (tags en `Directory.Packages.props` sin simétrico en `api.test.csproj`), y ese fichero era de la Task 3. Ni el kit ni superpowers tienen ruta para esto. Se resolvió con un ruling: no abrir fix round y llevarlo como requisito explícito al encargo de la Task 3. Su revisor lo verificó.
- **Propuesta**: ruta explícita «traslado a task posterior», con ruling en el ledger, requisito en el encargo siguiente y verificación por su revisor.

### 8. Dos registros de progreso y rulings que mueren con el workspace

- **Evidencia**: conviven `tasks.md` (durable, del kit) y `.superpowers/sdd/<plan>/progress.md` (git-ignored, que superpowers borra al terminar). Los rulings viven solo en el segundo. Hay bookkeeping doble en cada cierre de task.
- **Propuesta**: que `sdd-end-task` coseche las líneas `Ruling:` y `minor (deferred)` del ledger hacia el walkthrough antes de que se borre. Valorar también que `tasks.md` sea el único ledger.

### 9. Recuperación tras caída de la máquina

- **Evidencia**: hubo dos reinicios con un implementador a medias, que tenía 5 ficheros modificados y una carpeta nueva sin commitear. Se recuperó gracias al ledger, a `git status` y a reanudar el mismo agente con «relee tu trabajo parcial antes de seguir». No se perdió nada, pero el procedimiento hubo que improvisarlo.
- **Propuesta**: sección «Recuperación» en el paso 6 con estos pasos: (a) comprobar HEAD, `git status`, procesos y contenedores huérfanos; (b) reanudar el mismo agente, no despachar uno nuevo; (c) valorar commits WIP del implementador en tasks largas.

### 10. El controlador commitea con un implementador activo

- **Evidencia**: al actualizar `tasks.md` con otro agente trabajando en el mismo árbol, un `git commit` normal habría arrastrado lo que el agente tuviera en el índice. Se usó `git commit -- <ruta>`.
- **Propuesta**: regla de que el controlador commitea siempre por ruta, y que el encargo del implementador prohíbe `git add -A`.

### 11. Worktree preexistente sin entorno

- **Evidencia**: el paso 6 engancha `env:setup` «tras el worktree que crea superpowers». Aquí el worktree ya existía, creado fuera del flujo, y no tenía ni `node_modules` ni `.sdd-env.json`. Se descubrió justo antes de la primera suite.
- **Propuesta**: si existe `environments.md`, el paso 3 (Branch) comprueba el marcador y las dependencias y ejecuta `env:setup` si faltan.

## P3 — Fricciones menores

12. **Gate 1 con rama que ya delata la task**: la skill se invocó sola, pero la rama era `feature/0009` y el roadmap tenía la 0009 pendiente. Costó un turno parar para preguntar. Propuesta: si `feature/<id>` casa con un id pendiente del roadmap, proponerlo como enunciado y seguir tras un «sí».
13. **Dos preguntas en un mismo gate**: «¿Apruebas la spec? ¿Lanzo los revisores?» recibió un «ok» ambiguo. Propuesta: que el gate use `AskUserQuestion` con opciones explícitas (aprobar / aprobar + review / cambios).
14. **Sin sitio para «decidido con el dev-lead en el brainstorming»**: la plantilla de spec solo tiene «Decisiones que he tomado yo». Se improvisó una lista A–E. Propuesta: subsección opcional.
15. **Sin mecanismo de enmienda ligera a una spec aprobada**: al planificar se vio que una validación de la spec (palabras reservadas de C#) era inalcanzable por el propio regex. Se anotó en el plan. La 0008 tuvo el mismo caso. Propuesta: sección `## Enmiendas` con fecha y motivo.
16. **Los ejemplos de la spec no se revisan contra la constitution**: la spec usaba el nombre de un proyecto real como ejemplo (viola el Art. II) y ningún revisor lo marcó. Propuesta: añadir al encargo del revisor que los ejemplos y fixtures de la spec cumplan la constitution.
17. **Conflicto con el `CLAUDE.md` global del usuario**: el suyo pide ejecución en línea por defecto y confirmación antes de usar subagentes. El kit pide subagentes por defecto. Propuesta: declarar que el bloque «Decisiones» del plan (modelo y ejecución por task) es ese punto de confirmación, y que con aprobación delegada esas decisiones se re-presentan en el paso 7.

## Datos de coste, para calibrar

- Revisores de spec: unos 100k tokens cada uno.
- Implementadores Sonnet high: 220–240k tokens y entre 11 y 29 min cada uno.
- Revisores de task Sonnet medium: unos 135k tokens y entre 6 y 10 min.
- Espera pura por suites de SQL Server: unos 75 min acumulados, contando la línea base.
