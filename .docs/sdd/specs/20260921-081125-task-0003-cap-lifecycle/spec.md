---
id: 20260921-081125-task-0003-cap-lifecycle
task: 0003
title: Capabilities — ciclo de vida completo
mode: full
status: approved
created: 2026-09-21
author: Claude Opus 5 (1M context)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-21
---

# Spec — Capabilities: ciclo de vida completo

> **Enmienda tras el RED (2026-09-21).** La versión aprobada antes (commit `7f0fbfe`) cubría seis frentes. El RED ([`tests/capabilities-red.md`](../../../../tests/capabilities-red.md), 10 sujetos) mostró que el kit de develop ya resuelve cuatro de ellos: no hace cajón de sastre, fusiona al cierre (también en patch), conserva los `AND` de un `MODIFIED` aditivo, fusiona lo construido, vacía `legacy.md` y enruta a task un cambio de requisito. Solo fallan dos cosas, 2 de 2: **el slug de la capacidad nueva sale en castellano** y **los valores de comportamiento se copian a `tech-stack.md`**. El dev-lead aprobó el recorte estricto (Art. I). Esta versión es la que se vuelve a aprobar.

## Decisiones que he tomado yo — valida estas

1. **Review de spec: sin review.** Señales: `REMOVED` (cinco requisitos de `task-flow`, que se mueven sin cambiar de texto) y más de una capacidad. Son dos, y los requisitos que se mueven ya los revisaron las dos lentes en la versión anterior.
   - Mínimo razonable: sin review. Deja sin comprobar por otra mano que las dos reglas nuevas no contradicen `task-flow`; lo asumo yo, porque solo añaden sitio a una regla que no existía.
2. **Capacidad(es) del delta: `capabilities` (nueva) y `task-flow` (existente).**
   - Sustantivo: las capacidades del proyecto.
   - Descartada: dejarlo todo en `task-flow`, porque los requisitos comparten el sustantivo «capacidad» y no «flujo de task». Es la misma decisión que aprobaste en la versión anterior.
3. **Muevo cinco requisitos de `task-flow` a `capabilities`**: «El delta declara el comportamiento por capacidad», «El cierre fusiona el delta en la verdad viva», «Brownfield no vuelca `capabilities/`», «Los documentos de anclaje nombran `capabilities/`» y «La consulta lee la capacidad, no las specs». Los dos primeros cambian por la decisión 9; los otros tres se mueven tal cual.
4. **La regla del slug va donde se crea la capacidad**: `spec-template.md` (la frase de ayuda del delta), `capability-template.md` (regla 1) y `sdd-start-task` paso 4. No va a las init: ningún sujeto del RED creó una capacidad desde una init, y las reescribe la task 0012.
5. **La regla de reparto va donde se escribe el valor duplicado**:
   - `spec-template.md`, junto a la «Regla de contenido»;
   - `plan-template.md` §1.1, porque el plan fue quien pidió «documentar los tiempos en tech-stack»;
   - el paso 4 (aprendizajes) de `sdd-end-task`, con red flag y racionalización.
6. **Fuera, por el RED**:
   - la línea fija de capacidad, el test de pertenencia, el cambio de la rúbrica y el punto 8 de la lente dominio;
   - el paso de fusión propio en task y patch, y la marca `(retira: …)`;
   - la alarma de fusión, la frontera patch/task, el sitio único (skill o referencia) y el validador `Test-Capabilities.ps1`, ya revertido.
7. **Fuera, sin RED**: el volcado inicial en greenfield. La excepción que decidiste el 2026-09-20 sigue en «Decisiones tomadas» del roadmap. Se escribe en la task 0012, que reescribe la init de greenfield, y con su propio RED. Lo apunto en su fila al cerrar, junto con dónde vive el funcional aportado en un greenfield.
8. **Se mantienen** las decisiones de la versión anterior que no dependen del recorte:
   - rutas de la evidencia por debajo de 140 caracteres;
   - sin migración nueva;
   - la fusión no depende de que exista una release.
9. **`MODIFIED` copia el bloque entero del requisito** (regla de OpenSpec), y la fusión sustituye el bloque. Es un arreglo de forma: la plantilla manda «sustituir» y los dos sujetos del RED fusionaron *añadiendo*, contra la letra. En campo, un revisor marcó Crítico dos veces por esa misma letra (task 0008). `(antes: …)` pasa a opcional. El dev-lead lo añadió al recorte el 2026-09-21.
10. **Lo que el RED no reprodujo va a una fila de deuda del roadmap** en el cierre, con `tests/capabilities-red.md` como baseline. Son la defensa bajo presión (cajón, fusión), el validador y el delta en `patch.md`. Se reabre con un ticket de `sdd-feedback` que lo muestre en campo.

## Intent

En campo, un agente copió a `tech-stack.md` valores que ya estaban en la capacidad (caducidad, reintentos, cuotas), y otro nombró en castellano una capacidad nueva. El RED lo reproduce 2 de 2 en los dos casos. Así la verdad del comportamiento queda en dos sitios que divergen en el primer `MODIFIED`, y un nombre de fichero incumple la convención del kit. Además, renombrar después rompe enlaces.

## Scope

- Entra:
  - la regla del slug en inglés kebab-case, en sus tres puntos de uso;
  - la regla de reparto, en sus tres puntos de uso;
  - `MODIFIED` de bloque entero en `spec-template.md` y en la fusión (`aprendizajes-skills.md` y la regla 3 de `capability-template.md`);
  - mover cinco requisitos de `task-flow` a la capacidad nueva `capabilities`.
- No entra: lo listado en las decisiones 6 y 7.

## Approach

Cada regla, una línea en el sitio donde el RED vio el fallo, sin ficheros nuevos. El único paso con red flag es el de aprendizajes de `sdd-end-task`, porque ahí se escribe el duplicado.

## Delta de comportamiento

### Capacidad: `capabilities` *(nueva)*

**ADDED — El nombre de una capacidad nueva es un sustantivo inglés en kebab-case**
- GIVEN una spec que declara una capacidad nueva
- WHEN se le da nombre
- THEN el slug es un sustantivo del dominio en inglés y kebab-case (`notifications`, no `avisos`), aunque el contenido del fichero vaya en castellano
- AND el nombre se presenta en el gate y lo aprueba el dev-lead

**ADDED — El comportamiento observable vive solo en `capabilities/`**
- GIVEN una task que escribe en `tech-stack.md`, `architecture.md` o `environments.md`, en su plan o en el cierre
- WHEN el texto es un valor de comportamiento (tiempo, límite, cuota, aviso, respuesta, estado)
- THEN el valor vive en `capabilities/<capability>.md`, y el documento de anclaje dice dónde está la pieza técnica y enlaza la capacidad, sin copiar el valor

**ADDED — El delta declara el comportamiento por capacidad**
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto); `sdd-end-task` sustituye o añade cada entrada por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

**ADDED — El cierre fusiona el delta en la verdad viva**
- GIVEN una task cerrándose vía `sdd-end-task` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN cada `ADDED` se añade a `capabilities/<capability>.md`, cada `MODIFIED` sustituye entero el requisito con ese título, cada `REMOVED` lo quita, y el walkthrough referencia los escenarios del delta como casos del smoke
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado

**ADDED — Brownfield no vuelca `capabilities/`**
- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`
- WHEN se generan los documentos de anclaje
- THEN `capabilities/` no se crea ni se rellena: aparece con la primera task que toque una capacidad

**ADDED — Los documentos de anclaje nombran `capabilities/`**
- GIVEN cualquier skill o plantilla que cite la carpeta de capacidades
- WHEN se lee el contexto SDD
- THEN la referencia es a la carpeta `capabilities/` y a sus capacidades

**ADDED — La consulta lee la capacidad, no las specs**
- GIVEN una pregunta de comportamiento ("¿qué hace hoy X?") en `sdd-consult`
- WHEN existe `capabilities/<capability>.md`
- THEN la respuesta se ancla en ese fichero, no en la reconstrucción a partir de specs históricas

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/capabilities/`, un fichero por capacidad; el listado de la carpeta es el índice.
- **Idioma de los nombres**: slug en inglés kebab-case; el contenido, en el idioma que fija la constitution del proyecto.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: entre una capacidad y un documento de anclaje, manda la capacidad.

### Capacidad: `task-flow`

**REMOVED — El delta declara el comportamiento por capacidad**
- motivo: se mueve a `capabilities`, con el `MODIFIED` de bloque entero.

**REMOVED — El cierre fusiona el delta en la verdad viva**
- motivo: se mueve a `capabilities`, con la sustitución del bloque entero.

**REMOVED — Brownfield no vuelca `capabilities/`**
- motivo: se mueve a `capabilities` sin cambios.

**REMOVED — Los documentos de anclaje nombran `capabilities/`**
- motivo: se mueve a `capabilities` sin cambios.

**REMOVED — La consulta lee la capacidad, no las specs**
- motivo: se mueve a `capabilities` sin cambios.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-21 | aprobada: eligió «Recorte + MODIFIED + deuda» entre las opciones de alcance, con esta spec y el plan presentados |
