---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: task
id: 0007
mode: full
date: 2026-09-21
---

# Ticket para el kit — task 0007: despacho de implementadores sin firmas compartidas y aprendizaje sin destino

## Contexto

- Carril y modo: task full (spec con gate, plan con tres tasks, `tasks.md`). Sesión del 2026-09-15.
- Skills del kit usadas: `sdd-start-task`, `sdd-end-task`, `sdd-templates` (spec, plan, walkthrough, estimation-log), `sdd-feedback`. De superpowers: `brainstorming` y `subagent-driven-development` (según el flujo del kit; la bitácora no confirma cuáles se invocaron con el tool `Skill`).
- Proyecto: aplicación de negocio en .NET, brownfield, con capacidades documentadas en `capabilities/` y módulo de estimación activo; un interlocutor de negocio. Tamaño y nº de personas: no constan.
- Modelo del hilo: no registrado en la bitácora
- Modelos de los subagentes: no registrados en la bitácora
- Coste en reloj: 4 h 20 min (09:02–13:22); estimado 3 h 30 min, desviación +23 %
- Coste en tokens: subagentes 535k (T1 212k, T2 180k con su ronda de fix, T3 143k); hilo principal no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Tres implementadores despachados en paralelo sobre tasks que comparten una interfaz

- **Qué pasó**: a las 10:05 se lanzaron los tres implementadores a la vez. Una de las tasks definía una interfaz de dominio que las otras dos consumían. Dos consecuencias: (a) el implementador de esa task inventó una firma distinta de la del plan, con un parámetro que el plan no contemplaba; el desajuste no se vio hasta las 11:20, unos 75 min después del despacho, al comparar los tres PR entre sí, y costó una ronda de fix; (b) dos tasks tocaban el mismo `using` de un namespace compartido y al fusionar los branches hubo un conflicto de nombres que rompió la build.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6 (fija `subagent-driven-development` como default y no dice nada sobre el orden de despacho) y `skills/sdd-templates/templates/plan-template.md` §2 Tasks (los campos de cada task son Modelo, Ejecución, Tests RED y Ficheros; ninguno declara dependencia ni interfaz compartida con otra task). La regla vive en superpowers 6.3.0, `skills/subagent-driven-development/SKILL.md` §1 «Dispatch the implementer»: «Never dispatch multiple implementation subagents in parallel (conflicts)», más el escaneo previo del plan con una fila por cada par de tasks que comparten fichero o interfaz.
- **Por qué el kit no lo evitó**: el kit delega en esa skill sin repetir la regla ni añadir una red flag propia, y la plantilla del plan no obliga a declarar qué tasks comparten fichero o interfaz. Puede que no sea un hueco del kit sino un incumplimiento de una regla de superpowers; este ticket no lo distingue porque la bitácora no dice si `subagent-driven-development` se cargó ni si se hizo el escaneo de pares. El criterio de aceptación sirve para decidirlo.
- **Coste**: una ronda de fix en T2 (sin desglose de minutos ni tokens; T2 sumó 180k con ella), detección tardía de unos 75 min y un conflicto de build. Es el mismo coste que el del hallazgo 2, no se suma.
- **Propuesta**: en `sdd-start-task` paso 6, una red flag «vas a despachar dos implementadores a la vez» y una fila en la tabla de racionalizaciones («las tasks son independientes, las paralelizo para ganar tiempo» → SDD despacha de uno en uno; las que comparten fichero o interfaz son las que más sufren el paralelo), siguiendo el patrón que el kit ya usa en esa skill.
- **Criterio de aceptación**: GIVEN un plan aprobado con tres tasks, dos de las cuales comparten una interfaz, WHEN el ejecutor llega al paso 6 de `sdd-start-task`, THEN despacha un implementador, espera su informe y solo entonces despacha el siguiente. RED que hoy falla: en esa sesión se despacharon los tres a la vez y el desajuste de firmas solo apareció al comparar los PR.

### 2. El encargo del implementador no lleva las firmas que el plan fijó

- **Qué pasó**: el plan fijó un bloque con las firmas de la interfaz del hallazgo 1. Al preparar el brief de esa task no se incluyó el bloque: el brief solo describía en prosa qué debía resolver el servicio. El implementador rellenó el hueco con su propia firma. La bitácora no dice en qué parte del plan vivía el bloque ni si el encargo llevaba la cabecera de `encargo-revision.md`, así que este ticket no puede valorar esos dos puntos.
- **Dónde en el kit**: `skills/sdd-start-task/references/encargo-revision.md`, sección «Encargo del implementador» (la cabecera contiene solo «Restricciones globales» y «Tests RED»); `skills/sdd-start-task/SKILL.md` paso 6; `skills/sdd-templates/templates/plan-template.md` §2 (la task no tiene campo para firmas y §1.4 «Contratos API» cubre endpoints, no interfaces internas). En superpowers 6.3.0, `subagent-driven-development` §1: el `task-brief` extrae el texto completo de la task y «exact values (numbers, magic strings, signatures, test cases) appear only in the brief».
- **Por qué el kit no lo evitó**: si las firmas solo pueden llegar al implementador dentro del brief, y el brief es el texto de la task, el plan tiene que llevarlas dentro de cada task. La plantilla no ofrece ese sitio, así que un plan que las fija en una sección común (§1.x) las deja fuera de lo que `task-brief` extrae. Esto es una hipótesis: depende de dónde estuviera el bloque.
- **Coste**: el de la ronda de fix del hallazgo 1.
- **Propuesta**: campo `**Interfaces**` en cada task de `plan-template.md` con las firmas que la task implementa o consume, literales, y una línea en `encargo-revision.md` (encargo del implementador): «si la task implementa o consume una interfaz, comprueba que el brief la contiene literal antes de despachar».
- **Criterio de aceptación**: GIVEN un plan cuya task 2 declara en `**Interfaces**` una firma, WHEN se genera el brief con `scripts/task-brief <plan> 2`, THEN el brief contiene esa firma literal. RED que hoy falla: la plantilla no tiene el campo y un brief generado desde una task cuya firma está solo en prosa no la contiene.

### 3. `sdd-end-task` paso 4 no dice qué hacer cuando el documento destino del aprendizaje no existe

- **Qué pasó**: al cierre hubo un aprendizaje estructural (un patrón de resolver siempre a través de una interfaz, nunca contra el repositorio) que el paso 4 manda a `architecture.md`. El proyecto no tenía ese fichero; solo `mission.md`, `constitution.md` y `tech-stack.md`. El ejecutor dudó unos 20 min entre crearlo solo para esa anotación o forzarlo en otro documento y acabó, por decisión propia y sin consultar, añadiéndolo como sección final de `tech-stack.md`, «el menos malo», sin que encajara. Queda en un documento que se lee en el paso 1 de las próximas tasks, pero fuera de su ámbito (versiones y herramientas).
- **Dónde en el kit**: `skills/sdd-end-task/references/aprendizajes-skills.md` paso 4 («cambio estructural → `architecture.md`») y su resumen en `skills/sdd-end-task/SKILL.md` paso 4. `architecture.md` es opcional en el resto del kit (`sdd-start-task` paso 1 lo lee «si existe»; `nombrado.md` lo trata como módulo por predicado), y ambos init lo generan, pero un proyecto puede no tenerlo: la bitácora no dice por qué faltaba.
- **Por qué el kit no lo evitó**: el paso da el destino por tipo de aprendizaje y calla sobre el caso de que ese destino no exista. No hay plantilla de `architecture.md` en `sdd-templates` a la que recurrir.
- **Coste**: unos 20 min de decisión y un aprendizaje archivado fuera de su ámbito.
- **Propuesta**: en `aprendizajes-skills.md` paso 4, una línea: si el destino no existe, no se fuerza el aprendizaje en otro documento; se propone al usuario crear el destino (esqueleto mínimo) o elegir él otro, y se anota lo decidido en el walkthrough. Pregunta abierta para quien mantiene el kit: si conviene que la migración a una versión nueva recree `architecture.md` cuando falta.
- **Criterio de aceptación**: GIVEN un proyecto sin `architecture.md` y un aprendizaje estructural en el paso 4 de `sdd-end-task`, WHEN el ejecutor llega a ese paso, THEN pregunta al usuario si crear el documento o elegir otro destino, y no escribe el aprendizaje en un documento cuyo ámbito no lo cubre sin su visto bueno. RED que hoy falla: el ejecutor eligió solo y tardó unos 20 min.

## Lo que hice por iniciativa propia

- Antes de despachar, tabla informal de cada THEN de la spec contra el test que lo probaría en RED (09:45, ninguna skill la pide). Funcionó: al revisar los tres PR fue mecánico comprobar que cada test cubría el THEN que le tocaba, sin reconstruir la relación con los tres briefs por separado. Encaja como extensión del §4 «Self-review (cobertura spec → tasks)» de `plan-template.md`, que hoy llega hasta el requisito y no hasta el escenario. Candidato a regla: la tabla THEN → test se guarda junto al plan y se entrega al revisor. Criterio si se adopta: GIVEN un plan con Tests RED, WHEN se aprueba, THEN existe una fila por cada THEN de la spec con el test que lo cubre.

## Funcionó, no tocar

- La aprobación del intent antes de escribir la spec (09:12–09:14) fue directa y sin fricción. En `sdd-start-task` 1.1.0 no localizo un gate de intent separado del de spec (paso 4); la bitácora lo llama así.
- El gate de spec de `sdd-start-task` paso 4, con el bloque «Decisiones que he tomado yo — valida estas» por delante, hizo que un cambio de criterio de cálculo (requisito MODIFIED) pasara por aprobación del usuario en lugar de quedarse como detalle de implementación. También lo apoya el paso 1: leer la capacidad que la task toca permitió comprobar que el requisito a modificar existía tal cual.
- La fusión del delta de la spec en `capabilities/<capability>.md` (`aprendizajes-skills.md` paso 4): el delta ya venía en el formato exacto que pide el fichero de capacidad, dos ADDED y un MODIFIED con su entrada de Historial, casi copiar y pegar.
- El formato de la tabla del `estimation-log.md`: consolidado desde las tasks anteriores, sin fricción al añadir la fila.
- El smoke ejecutado antes del cierre (tres casos) pasó a la primera con la build ya sana.

## Errores míos, no huecos del kit

- **Fusión y commit sin `dotnet build`** (11:55): se fusionaron los tres branches dando por hecho que si compilaban por separado compilarían juntos; la rama estuvo rota unos 15 min. Regla escrita que lo cubría: Step 2 «Build» de cada task y §3 «Validación final» de `plan-template.md`, y `superpowers:verification-before-completion`. El conflicto que rompió la build lo produjo el paralelismo (hallazgo 1); no compilar antes de comitear fue del ejecutor.
- **La pregunta que pareció repetida al cierre** (12:31): la bitácora la atribuye al kit, que preguntaría dos veces lo mismo (paso 7 de `sdd-start-task` y paso 0 de `sdd-end-task`). Contrastado con el texto del kit 1.1.0, no es así: el paso 7 de `sdd-start-task` es la validación del trabajo terminado, después de la implementación, no el cierre del plan; la pregunta del plan es el gate del paso 5. Eran dos preguntas distintas. Según ese paso 7 y el paso 0 de `sdd-end-task`, si el usuario ya hubiera dicho qué probó y que funciona, el paso 0 no volvería a preguntar. La bitácora no registra esa validación entre el smoke (12:15) y el cierre (12:30), y la pregunta del paso 0 se hizo como «¿sigue en pie lo aprobado?» en vez de presentar el trabajo y el smoke y preguntar qué ha probado el usuario. Lectura equivocada del paso por parte del ejecutor; con una sola sesión no hay evidencia de hueco en el kit.
