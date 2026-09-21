---
id: 20260921-081125-task-0003-cap-lifecycle
task: 0003
title: Capabilities — ciclo de vida completo
mode: full
status: draft
created: 2026-09-21
author: Claude Opus 5 (1M context)
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Capabilities: ciclo de vida completo

## Decisiones que he tomado yo — valida estas

1. **Review de spec propuesta: dos revisores — señales: contrato público (cambia la forma de `spec.md`, `patch.md` y `capabilities/<capability>.md`, que leen otras skills y todos los proyectos consumidores), `MODIFIED`/`REMOVED` (seis requisitos de `task-flow`), más de una capacidad (`capabilities` nueva y `task-flow`), área no explorada (`sdd-init-greenfield`, `plan-template` y `generacion.md` no los he leído en esta sesión).**
   - Dominio: si los cinco requisitos que salen de `task-flow` llegan a `capabilities` sin perder ninguna cláusula, y si «Cambiar un requisito es task, salvo una frase decidida por el usuario» deja un solo caso para cada bug (señal: `MODIFIED`/`REMOVED` + capacidad nueva).
   - Técnica: si las cuatro comprobaciones de «Un validador comprueba la forma del delta» se pueden decidir leyendo solo Markdown, sin juicio, y si el `MODIFIED` de bloque entero deja válidas las specs ya escritas con `(antes: …)` (señal: contrato público).
   - Mínimo razonable: solo dominio. Deja sin mirar si el validador promete algo que un script no puede decidir, que es justo el tipo de fallo que se paga en el plan.
   - Coste: dos subagentes Sonnet, ~100k tokens cada uno.
2. **Capacidad(es) del delta: `capabilities` (nueva) y `task-flow` (existente).**
   - Sustantivo: las capacidades del proyecto, su ciclo de vida.
   - Descartada: dejarlo todo en `task-flow`. El test de pertenencia de esta misma spec da dos síes: los `ADDED` comparten el sustantivo «capacidad», que no es «task-flow», y el delta trae sus propias reglas. Es el caso del cajón de sastre que la task viene a cerrar.
3. **Muevo cinco requisitos de `task-flow` a `capabilities`**: `REMOVED` en una y `ADDED` en la otra, con el mismo título. Son «El delta declara el comportamiento por capacidad», «El cierre fusiona el delta en la verdad viva», «Brownfield no vuelca `capabilities/`», «Los documentos de anclaje nombran `capabilities/`» y «La consulta lee la capacidad, no las specs». Los tres primeros cambian de texto y los dos últimos se mueven tal cual. Los requisitos de review se quedan en `task-flow`, junto a sus hermanos.
4. **La forma del sitio único (skill `sdd-capability` o referencia en `sdd-templates`) la decide el RED de cuatro brazos** que aprobaste: baseline, referencia, skill y con validador; 3 escenarios × 2 sujetos, ~25–45 $. Si el baseline no falla en algún frente, ese frente se recorta y te vuelvo a pedir la aprobación (Art. I). El volcado inicial usa como RED el caso real del statusline (N=1).
5. **`MODIFIED` copia el bloque entero del requisito** (regla de OpenSpec, sin `EXTENDED`). `(antes: …)` pasa a opcional y señala solo la cláusula que cambia. Las specs ya escritas siguen valiendo: al fusionarlas, la cláusula citada sustituye a la vigente y el resto se conserva.
6. **La rúbrica de review deja de contar «Capacidad nueva»** y cuenta «el delta toca o crea más de una capacidad». Hoy declarar una capacidad sube el nivel de review, y callarla lo baja.
7. **Frontera entre patch y task**: arreglar el código para que cumpla la capacidad es patch; cambiar lo que la capacidad dice es task. La excepción es un cambio de una frase que el usuario decide en el momento; su frase se cita en `patch.md`.
8. **El validador comprueba forma, no juicio.** Mira que el slug esté en kebab-case ASCII, pero no si está en inglés. Tampoco decide la pertenencia: eso queda para el agente, la lente dominio y el gate.
9. **«Codebase pequeño» en el volcado inicial = el agente lo lee entero en la sesión antes de proponer la partición.** Es un criterio observable, no un número de líneas.
10. **Umbral de la alarma de fusión: tres o más `ADDED` con «Reglas de la capacidad» propias** que se van a fusionar en una capacidad existente. Es el umbral que propone el ticket de la task 0005.
11. **Fuera de la task**: el campo `Cobertura` por requisito (va al backlog, sin evidencia de necesidad); limpiar capacidades cajón que ya existen en proyectos consumidores; `status: draft` para capacidades nuevas; la pregunta de modo incremental del init (task 0012); cualquier dependencia de la fusión respecto a una release (task 0004).
12. **Rutas de la evidencia por debajo de 140 caracteres relativos**: moldes en `red/m1/`, `green/m1/` y specs de los moldes con slug de una palabra. Lo comprueba un paso del plan antes de cada commit de evidencia. No añado test de convención: fallaría con las rutas de 165 que ya están en develop.
13. **Sin migración nueva.** La task cambia cómo se escriben los artefactos nuevos, no la estructura de `.docs/sdd/`. Las capacidades con slug en castellano de los consumidores no se renombran solas: la regla aplica a las nuevas.

## Intent

`capabilities/` es la verdad viva del comportamiento y lo primero que lee la task siguiente, pero hoy se degrada por cinco vías. Ninguna spec está obligada a decidir a qué capacidad pertenece su delta, y la rúbrica premia callarlo: en campo, cinco requisitos de un dominio propio acabaron en una capacidad cajón y ningún gate ni revisor lo vio. Además:

- La fusión no es un paso visible del cierre.
- Un `MODIFIED` aditivo borra contenido si se aplica a la letra.
- Los valores de comportamiento se copian a `tech-stack.md`.
- Los patches cambian comportamiento sin tocarla.

Las reglas viven en cinco ficheros y se leen tarde. Esta task las junta en un sitio, las pone en el punto de uso y añade un validador de forma.

## Scope

- Entra:
  - la declaración obligatoria de capacidad y el test de pertenencia;
  - la regla del slug en el punto de uso;
  - la rúbrica sin incentivo invertido y el punto de pertenencia de la lente dominio;
  - el paso de fusión en `sdd-end-task` y en `sdd-end-patch`;
  - `MODIFIED` de bloque entero, y la regla de que manda lo construido y validado;
  - la alarma de fusión y la regla de reparto;
  - la frontera entre patch y task;
  - el sitio único, `Test-Capabilities.ps1` con sus tests Pester, y el volcado inicial como excepción de greenfield.
- No entra: lo listado en la decisión 11.

## Approach

Un sitio único con todas las reglas de capacidades. Su forma la decide el RED. Si gana la skill, esta inserta el inventario de `capabilities/` con `` !`comando` ``. Cada punto de uso gana una línea y el enlace o la invocación:

- `spec-template`: la línea fija de capacidad y la regla de reparto.
- `sdd-start-task`, paso 4.
- `sdd-end-task`: un paso numerado propio.
- `sdd-end-patch`: un paso nuevo.
- `sdd-start-patch`: la frontera en el diagrama.
- `capability-template`: las reglas 3 y 4 y el historial.
- `review-spec`: la rúbrica y el punto 8.
- `plan-template`: la regla de reparto.
- `sdd-init-greenfield`: el volcado y el aviso de nombre.

`Test-Capabilities.ps1` se ejecuta antes del gate de la spec y antes de fusionar.

## Delta de comportamiento

### Capacidad: `capabilities` *(nueva)*

**ADDED — Toda spec declara a qué capacidad pertenece su delta**
- GIVEN una spec en modo full o lite
- WHEN se redacta «Decisiones que he tomado yo — valida estas»
- THEN lleva la línea `Capacidad(es) del delta: <nombre> (existente | nueva) — sustantivo: <cuál> — descartada: <alternativa>`
- AND reutilizar una capacidad existente se justifica con la misma línea que crear una
- AND una spec sin cambio de comportamiento observable lleva `Capacidad(es) del delta: ninguna — <motivo>`

**ADDED — La pertenencia se decide con el inventario delante**
- GIVEN una spec con delta
- WHEN el agente elige la capacidad
- THEN ha leído el listado de `capabilities/` y se ha preguntado si los títulos de los `ADDED` comparten un sustantivo distinto del nombre de la capacidad elegida, y si el delta trae sus propias «Reglas de la capacidad»
- AND con dos síes propone una capacidad nueva, o escribe en la línea de capacidad el motivo para no hacerlo

**ADDED — El nombre de una capacidad es un sustantivo inglés en kebab-case**
- GIVEN una capacidad nueva, declarada en una spec o propuesta por una init
- WHEN se le da nombre
- THEN el slug es un sustantivo del dominio en inglés y kebab-case, nunca un ticket, una task ni el nombre del producto, el repo o el template
- AND el nombre se presenta en el gate y lo aprueba el dev-lead

**ADDED — El comportamiento observable vive solo en `capabilities/`**
- GIVEN una task que escribe en `tech-stack.md`, `architecture.md` o `environments.md`
- WHEN el texto es un valor de comportamiento (límite, aviso, respuesta, estado, caducidad)
- THEN el valor vive en `capabilities/<capability>.md` y el documento de anclaje lo enlaza, sin copiarlo

**ADDED — El delta declara el comportamiento por capacidad**
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios, y `(antes: …)` es opcional y señala solo la cláusula que cambia
- AND si la capacidad no existe en `capabilities/`, su creación aparece en «Decisiones a validar»
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian, cada una entera (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto)
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

**ADDED — Un validador comprueba la forma del delta**
- GIVEN una spec o un `patch.md`, y la carpeta `capabilities/` del proyecto
- WHEN se ejecuta `Test-Capabilities.ps1` antes del gate de la spec o antes de fusionar
- THEN informa, con el fichero y el título, de cada caso: falta la línea de capacidad; un slug que no está en kebab-case ASCII; un `ADDED` cuyo título ya existe en la capacidad; un `MODIFIED` con menos cláusulas GIVEN/WHEN/THEN/AND que el requisito vigente
- AND con algún caso sale con código distinto de 0, y sin ninguno sale con 0
- AND no juzga la pertenencia ni el idioma del slug

**ADDED — El cierre fusiona el delta en la verdad viva**
- GIVEN una task cerrándose vía `sdd-end-task` con un delta en su spec
- WHEN se ejecuta el paso de fusión, que es un paso numerado propio del checklist
- THEN cada `ADDED` se añade a `capabilities/<capability>.md`, cada `MODIFIED` sustituye entero el requisito con ese título, cada `REMOVED` lo quita, cada entrada de «Reglas de la capacidad» se sustituye entera por su nombre, y el walkthrough referencia los escenarios del delta como casos del smoke
- AND se fusiona lo construido y validado: un THEN que el código no cumple no se fusiona; si lo construido difiere del delta, el walkthrough lo dice y se fusiona lo construido
- AND si se van a fusionar tres o más `ADDED` con «Reglas de la capacidad» propias en una capacidad existente, el agente pregunta antes de fusionar y no crea nada por su cuenta
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado
- AND la fusión no depende de que exista una release

**ADDED — El patch fusiona su delta al cerrar**
- GIVEN un patch cuyo fix cambia comportamiento descrito en `capabilities/<capability>.md`
- WHEN se cierra con `sdd-end-patch`
- THEN el delta se fusiona con el mismo algoritmo que en una task y el historial de la capacidad lleva `<fecha> — patch <id> — <ADDED|MODIFIED|REMOVED> <título>`
- AND si el fix solo devuelve el comportamiento a lo que la capacidad ya decía, `patch.md` dice «Delta de capacidades: ninguno» y no se fusiona nada

**ADDED — Cambiar un requisito es task, salvo una frase decidida por el usuario**
- GIVEN un bug cuyo arreglo exige cambiar lo que dice una capacidad
- WHEN se enruta entre patch y task
- THEN es una task
- AND es patch si el cambio es de una frase y lo decide el usuario en el momento; su frase literal se cita en `patch.md`
- AND arreglar el código para que cumpla lo que la capacidad ya dice es patch

**ADDED — El volcado inicial es una excepción de greenfield**
- GIVEN `sdd-init-greenfield` sobre un codebase que arrancó sin el kit y que el agente lee entero en la sesión
- WHEN el usuario pide las capacidades iniciales desde el código
- THEN el agente propone la partición y los nombres, los aprueba el usuario antes de escribir ningún fichero, y el historial de cada capacidad lleva `<fecha> — init — ADDED <título>`
- AND sin la petición del usuario, `capabilities/` nace vacía

**ADDED — Brownfield no vuelca `capabilities/`**
- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`
- WHEN se generan los documentos de anclaje
- THEN `capabilities/` no se crea ni se rellena: aparece con la primera task que toque una capacidad
- AND esto se mantiene aunque el usuario pida el volcado

**ADDED — Los documentos de anclaje nombran `capabilities/`**
- GIVEN cualquier skill o plantilla que cite la carpeta de capacidades
- WHEN se lee el contexto SDD
- THEN la referencia es a la carpeta `capabilities/` y a sus capacidades

**ADDED — La consulta lee la capacidad, no las specs**
- GIVEN una pregunta de comportamiento («¿qué hace hoy X?») en `sdd-consult`
- WHEN existe `capabilities/<capability>.md`
- THEN la respuesta se ancla en ese fichero, no en la reconstrucción a partir de specs históricas

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/capabilities/`, un fichero por capacidad; el listado de la carpeta es el índice.
- **Idioma de los nombres**: slug en inglés kebab-case; el contenido, en el idioma que fija la constitution del proyecto.
- **Límites**: alarma de fusión a partir de tres `ADDED` con reglas propias en una capacidad existente.
- **Avisos**: el validador informa por fichero y título; la init avisa si la primera capacidad se llama como el producto, el repo o el template.
- **Regla ante conflicto**: entre el delta y lo construido, manda lo construido y validado.

### Capacidad: `task-flow`

**REMOVED — El delta declara el comportamiento por capacidad**
- motivo: se mueve a `capabilities`, con el `MODIFIED` de bloque entero.

**REMOVED — El cierre fusiona el delta en la verdad viva**
- motivo: se mueve a `capabilities`, con la regla de lo construido y validado y la alarma de fusión.

**REMOVED — Brownfield no vuelca `capabilities/`**
- motivo: se mueve a `capabilities`.

**REMOVED — Los documentos de anclaje nombran `capabilities/`**
- motivo: se mueve a `capabilities` sin cambios.

**REMOVED — La consulta lee la capacidad, no las specs**
- motivo: se mueve a `capabilities` sin cambios.

**MODIFIED — La spec propone su propio nivel de review por complejidad** (antes: señal «capacidad nueva» en la rúbrica)
- GIVEN una spec en modo full recién redactada
- WHEN el agente la presenta en el gate
- THEN el bloque que abre «Decisiones a validar» dice el nivel propuesto (sin review · un revisor con su lente · dos revisores), las señales contadas que lo justifican, una línea por lente candidata con qué comprobaría en esta spec y la señal que lo motiva, y la opción mínima razonable con lo que deja sin cubrir
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND declarar una capacidad nueva no sube el nivel; la señal es que el delta toque o cree más de una capacidad
- AND el usuario activa o rechaza; en modo lite no se propone

**ADDED — La review de dominio vigila la pertenencia a la capacidad**
- GIVEN una spec con delta y un nivel de review activado
- WHEN la lente dominio la revisa
- THEN marca como Importante una capacidad elegida que ya agrupa tres o más dominios o que se llama como el producto, el repo o el template, y un `ADDED` cuyo sustantivo pertenece a otra capacidad
- AND con dos revisores ese punto es de la lente dominio

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
