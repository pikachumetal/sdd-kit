# Feedback de uso del sdd-kit — init greenfield del proyecto `statusline`

- **Origen:** agente Claude (Fable 5.1) en Claude Code, sesión del 2026-09-18 al 2026-09-20.
- **Skill usada:** `sdd-kit:sdd-init-greenfield`, kit v1.1.0, cargado desde `D:\code\git\sdd-kit\skills`.
- **Proyecto:** `statusline` — un fichero Node de 213 líneas, sin dependencias, un desarrollador, con un commit previo.
- **Resultado:** init completada. 18 preguntas de entrevista, 6 documentos de anclaje aprobados, 4 capabilities, git-flow aplicado.

Cada hallazgo indica qué pasó, la evidencia y una propuesta. Los ordeno por impacto.
Al final hay una sección con mis propios errores, separados de los huecos del kit.

---

## A. Huecos que provocaron un error o una decisión mía sin respaldo

### A1. La convención «nombres de fichero en inglés» solo está en una migración

- **Qué pasó:** propuse las capabilities como `entrada.md`, `estado-sesion.md`, `consumo.md`, `instalacion.md`. El usuario me corrigió.
- **Evidencia:** la regla solo aparece en `sdd-init-brownfield/references/migrations/v1.1.0.md` (pasos 2 y 3). No está en `capability-template.md`, ni en `sdd-init-greenfield/SKILL.md`, ni en `references/estructura.md`. Quien crea capabilities desde cero nunca lee una migración.
- **Propuesta:** añadir a `capability-template.md` una regla anti-proliferación más: «el nombre del fichero es inglés kebab-case; el contenido va en el idioma del proyecto; el nombre lo aprueba el dev-lead». Repetirlo en `estructura.md`.
- **Efecto colateral:** la regla de producto «idioma de los nombres» no distingue contenido de nombres de fichero. En la `constitution.md` escribí «En castellano: `.docs/sdd/`» y hubo que corregirlo después. La pregunta de la entrevista podría nombrar ese caso.

### A2. No hay esqueleto de los documentos de anclaje

- **Qué pasó:** `estructura.md` da una línea por documento. No hay secciones mínimas para `mission`, `constitution`, `tech-stack`, `architecture`, `roadmap`, `estimation` ni `changelog`. Tuve que deducir el formato de tres sitios:
  - `estimation.md` y `sdd-kit.json`: los copié del `.docs/sdd/` del propio repo del kit.
  - Cabecera de `changelog.md` (`## [Unreleased]`): la saqué de `add-to-changelog/SKILL.md`.
  - Tabla de patches del roadmap: inventé las columnas.
- **Riesgo:** cada init produce documentos con forma distinta, y las skills que luego los leen (`sdd-end-patch`, `add-to-changelog`, `sdd-start-release`) pueden no encontrar lo que esperan.
- **Propuesta:** no hace falta una plantilla completa. Basta con las secciones obligatorias de cada documento en `estructura.md`, y el texto literal de lo que otra skill parsea: cabecera del changelog, columnas de la tabla de patches y de la tabla de deuda.
- **Caso concreto, `estimation.md`:** el método es el mismo en todos los proyectos. El del repo del kit mezcla el método con avisos propios del kit (sesgo del RED, coste de gates). Conviene un texto base neutro que la init pueda calcar.

### A3. `estimation-log.md` «VACÍO» es ambiguo

- **Qué pasó:** creé un fichero de 0 bytes. El log real lo genera `Build-EstimationLog.ps1` con una cabecera `<!-- AUTO-GENERADO … -->` y la tabla.
- **Duda sin resolver:** no sé si un fichero de 0 bytes es lo que se espera, o si la init debería ejecutar el script para que nazca ya con cabecera.
- **Propuesta:** decirlo explícitamente. Si el script funciona sin specs, que la init lo ejecute.

### A4. Carpetas vacías y git

- **Qué pasó:** la skill pide crear `capabilities/` y `specs/` vacías. Git no versiona carpetas vacías, así que añadí `.gitkeep` por decisión propia.
- **Inconsistencia entre inits:** greenfield crea `capabilities/` vacía (`estructura.md`); brownfield dice «`capabilities/` NO se crea» (`generacion.md`, paso 5).
- **Propuesta:** unificar el criterio y decir qué hacer con git (`.gitkeep`, o no crear la carpeta hasta la primera task).

### A5. El árbol de `estructura.md` no incluye los ficheros opcionales

- **Qué pasó:** la entrevista pregunta por `changelog.md`, `client-changelog.md` y `environments.md`, pero el árbol objetivo no los muestra. No queda claro dónde van ni con qué nombre exacto hasta leer otras skills.
- **Propuesta:** añadirlos al árbol marcados como «(opcional, según entrevista)».

### A6. `sdd-kit.json`: versión y canal

- **Versión:** greenfield obliga a leer una carpeta de otra skill (`sdd-init-brownfield/references/migrations/`) para saber la versión. Es un acoplamiento frágil; un fichero `VERSION` en la raíz del kit lo evitaría.
- **Canal:** nada dice cómo decidir entre `"plugin"` y `"cli"`. Puse `plugin` porque la skill se invocó como `sdd-kit:sdd-init-greenfield`, pero el directorio base era un checkout local (`D:\code\git\sdd-kit`), no la caché de plugins. No sé si acerté.
- **Propuesta:** una línea con el criterio de detección.

### A7. El paso 5 (Git) solo contempla `git init`

- **Qué pasó:** el repo ya existía, con remoto en GitHub y rama `master`. La convención acordada (git-flow) exigía renombrar a `main`, crear `develop`, cambiar la rama por defecto en GitHub y borrar `master` del remoto. La skill no da ninguna guía para ese caso.
- **Detalle operativo:** `git push origin --delete master` lo bloqueó el clasificador de permisos de Claude Code por destructivo. Hubo que pasárselo al usuario.
- **Propuesta:** ampliar el paso 5 con el caso «repo existente»: comprobar remoto, presentar el plan completo, pedir confirmación, y avisar de que el borrado de ramas remotas lo ejecuta el usuario.

### A8. La entrevista no dice cuál es la convención de ramas por defecto del kit

- **Qué pasó:** en la pregunta de ramas recomendé `master` + `feat/<slug>` sin `develop`. El usuario respondió con git-flow.
- **Evidencia:** el kit ya asume git-flow: `sdd-start-task` usa `feature/<ticket>` desde `develop`; `sdd-start-patch` explica que el carril patch es independiente del tipo de rama; `sdd-end-release` etiqueta sobre la rama estable. Nada de eso está a la vista desde `sdd-init-greenfield`, así que recomendé algo que contradice los valores por defecto del propio kit.
- **Propuesta:** que la pregunta de ramas del bloque (d) presente git-flow como opción por defecto del kit y cite cómo encaja el carril patch.

---

## B. Fricción de proceso

### B1. Frontera greenfield / brownfield para proyectos muy pequeños

- **Qué pasó:** el repo tenía código funcional (5 ficheros, 1 commit). Avisé de que correspondía brownfield. El usuario eligió greenfield con razón: el código era de un día y quería la entrevista completa.
- **Problema:** el flujo greenfield no tiene un paso de «leer el código existente». `tech-stack.md` y `architecture.md` salieron del código por iniciativa mía, y el bloque (b) de la entrevista (stack) quedó casi vacío porque el stack ya estaba decidido.
- **Propuesta:** un tercer carril ligero, o una rama dentro de greenfield: «hay poco código y es reciente → entrevista completa de producto, principios y proceso; stack y arquitectura se leen del código y se presentan como propuesta».

### B2. Choque con `superpowers:brainstorming`

- **Qué pasó:** la skill dice que el motor de la entrevista es `superpowers:brainstorming`. Esa skill trae su propio checklist: clasificar el camino en voz alta, proponer 2–3 enfoques, escribir el diseño en `docs/superpowers/specs/` y terminar invocando `writing-plans`. Todo eso contradice el greenfield, que prohíbe `docs/superpowers/`.
- **Evidencia:** las red flags de greenfield ya avisan del directorio, pero no dicen qué partes de brainstorming aplican.
- **Propuesta:** una frase explícita: «de brainstorming se usa solo la técnica de entrevista (una pregunta cada vez, opciones con recomendación); se ignoran su checklist de diseño, su documento de spec y su estado terminal».

### B3. Gate documento a documento en proyectos diminutos

- **Qué pasó:** con seis documentos, el gate estricto uno a uno pesa. Agrupé de dos en dos los documentos sin decisiones nuevas (`tech-stack` + `architecture`; `roadmap` + `estimation`), con aprobación separada de cada uno. Funcionó bien.
- **Propuesta:** permitirlo de forma explícita: «los documentos que solo describen lo ya decidido o lo ya existente pueden presentarse juntos; `mission` y `constitution` siempre van solos».

### B4. `CLAUDE.md` no está en la lista del gate

- **Qué pasó:** el paso 2 enumera el gate como «mission → constitution → …». El paso 4 crea `CLAUDE.md` sin mencionar aprobación. Lo escribí sin presentarlo y avisé después.
- **Propuesta:** decir si `CLAUDE.md` pasa por el gate. Como es el fichero que se carga en todas las sesiones, yo diría que sí.

### B5. Volcado inicial de capabilities en proyectos pequeños

- **Qué pasó:** el usuario pidió generar las capabilities al final de la init. La regla anti-proliferación 4 lo prohíbe, y su texto habla solo de brownfield aunque vive en la plantilla genérica.
- **Por qué tenía sentido aquí:** 213 líneas leídas enteras; el usuario puede revisar 4 ficheros. El argumento de la regla («ficheros que nadie revisa») no aplica.
- **Propuesta:** una excepción explícita con condiciones: codebase pequeño, petición del usuario, aprobación previa de la partición y de los nombres. Y un formato para el historial de ese volcado; usé `<fecha> — init — ADDED todos los requisitos`, que no encaja con el `task <id>` de la plantilla.
- **Idea derivada:** marqué cada requisito con `> Cobertura: con test | parcial | sin test`. Hizo visible de inmediato qué comportamiento está protegido, y de ahí salió una fila de deuda. Puede valer como campo opcional de la plantilla.

### B6. No hay estado de «init en curso»

- **Qué pasó:** la sesión se interrumpió dos veces. Al volver, el usuario preguntó dónde nos habíamos quedado. Lo reconstruí del historial de la conversación y de `git status`.
- **Riesgo:** si se hubiera perdido el contexto, no habría forma de saber qué documentos estaban aprobados y cuáles no. Un fichero escrito no implica aprobado.
- **Propuesta:** un marcador mínimo, por ejemplo en `sdd-kit.json`: `"init": { "approved": ["mission", "constitution"] }`, que se elimina al cerrar la init.

### B7. «Crea un todo por paso» sin herramienta de todos

- **Qué pasó:** todas las skills del kit lo piden. En este entorno no había ninguna herramienta de lista de tareas disponible, así que no los creé.
- **Propuesta:** «si el entorno tiene herramienta de todos, crea uno por paso; si no, enumera los pasos al empezar y marca el avance en cada mensaje».

---

## C. Contenido de la entrevista

### C1. Reglas que el usuario ya tiene en su `CLAUDE.md` global

- **Qué pasó:** el bloque (c) pide preguntar por commits, y la regla 2 por el idioma del código. El `CLAUDE.md` global del usuario ya fijaba ambos. No los volví a preguntar y puse un puntero en la constitution.
- **Propuesta:** que la skill lo indique: «antes de la entrevista, lee las instrucciones globales del usuario; lo que ya esté decidido ahí no se pregunta, se referencia».

### C2. Quién escribe los tests en RED

- **Qué pasó:** al aprobar la constitution, el usuario añadió una regla aprendida en otros proyectos: los tests en RED los escribe el hilo principal; un subagente solo los pone en GREEN y no toca los tests que recibe.
- **Propuesta:** si es un aprendizaje del equipo, debería estar en el kit: como pregunta del bloque (c) o como principio por defecto de la constitution. Hoy depende de que el usuario se acuerde.

### C3. «No aplica» durante la entrevista

- **Qué pasó:** el paso 1 solo contempla «no sé» (deja la entrada pendiente). El paso 2 sí admite «no aplica». En un proyecto sin datos ni migraciones, varias preguntas son «no aplica» desde el principio.
- **Propuesta:** mencionarlo también en el paso 1, y permitir que el agente lo proponga cuando sea evidente, para no gastar una pregunta.

### C4. Término «skills de nivel 2» sin definir

- **Qué pasó:** el paso 6 pide recomendar «skills de nivel 2 según el stack». El término no se define en greenfield. Lo interpreté como skills específicas del stack del proyecto y recomendé no crear ninguna.
- **Propuesta:** una línea de definición, o un enlace a donde se explican los niveles.

---

## D. Lo que funcionó bien

- **Las cinco reglas de producto preguntadas por nombre.** Forzaron decisiones que de otro modo habría tomado yo en cada task: caché sí o no, qué fuente manda, qué se avisa. En la regla 4 además destaparon una incoherencia entre lo decidido y lo que el código ya hacía.
- **El gate «sin entrevista no hay documentos» y su tabla de racionalizaciones.** Evitó que rellenara documentos con suposiciones. La redacción es clara y difícil de esquivar.
- **«Pendiente» como estado válido.** Permitió cerrar la constitution sin inventar una cifra para el presupuesto de tiempo.
- **`sdd-start-patch` ya desacopla el carril del tipo de rama.** Encajó sin cambios con la decisión del usuario de elegir `hotfix/*` o `chore/*` en cada patch.

---

## E. Errores míos, no del kit

- Propuse nombres de capabilities en castellano sin mirar cómo los nombra el propio kit (relacionado con A1, pero pude comprobarlo).
- Escribí `CLAUDE.md` sin presentarlo antes (relacionado con B4).
- En la pregunta 12 dejé sin respuesta si el repo lleva `package.json` y seguí con el estado actual por defecto. Lo avisé, pero fue una decisión mía.
- En la pregunta de ramas recomendé una convención distinta de la que usa el kit, por no haber leído `sdd-start-task` antes (relacionado con A8).
