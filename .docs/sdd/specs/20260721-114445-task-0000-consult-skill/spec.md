---
id: 20260721-114445-task-0000-consult-skill
task: 0000
title: sdd-consult — carril de consulta con contexto, sin SDD clásico
status: approved
created: 2026-07-21
author: Àngel Delgado (redacción asistida por Claude)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-07-21
---

# Spec — sdd-consult: carril de consulta con contexto

> **Estado**: approved
> **Fase del workflow**: Specify (qué + por qué)
> **Siguiente paso**: tras aprobación → `plan.md` con `superpowers:writing-plans`

## 1. Contexto

- **Problema u oportunidad**: hoy el kit tiene dos carriles productivos (task, hotfix) y el de release. Falta el caso más frecuente del día a día: **preguntar** algo del código o de los documentos, **planificar** o **estructurar** el trabajo que viene, o **entender** una parte del sistema — sin arrancar el SDD clásico. Ante ese caso, un agente hoy tiene dos salidas malas:
  1. **Sobre-dispara el SDD**: monta brainstorming + spec + carpeta para responder a una pregunta.
  2. **Responde sin contexto**: contesta desde el código suelto (o desde nada), ignorando los documentos de anclaje, y da respuestas que contradicen mission/constitution/roadmap.
  El carril `sdd-consult` cubre ese hueco: **cargar el contexto relevante, pensar CON el usuario, y responder** — sin producir artefactos por defecto.
- **Stakeholders**: developers del equipo (el uso más frecuente); los agentes, que necesitan una guía explícita de "modo consulta" para no caer en las dos salidas malas.
- **Restricciones conocidas**: Art. I (RED→GREEN también para skills nuevas), Art. II (la forma sigue al fallo), Art. III (idioma), Art. VII (dogfooding), Art. VIII (plantillas solo en el kit — este carril no añade plantillas).

## 2. Objetivo

- **Qué construimos (one-liner)**: una skill de proceso, `sdd-consult`, que prima el contexto de anclaje relevante, responde/planifica/estructura con el usuario, no genera artefactos por defecto, y sabe transicionar a los carriles de trabajo cuando la consulta se vuelve trabajo real.
- **Definición de éxito** (criterios observables):
  1. `skills/sdd-consult/SKILL.md` existe con la anatomía del kit (frontmatter con `description` que solo dice cuándo usarla; overview; el "anti-carril" explícito; predicados; red flags + tabla de racionalizaciones).
  2. Validada con ciclo RED→GREEN documentado en `tests/sdd-consult-red.md` y `-green.md`, dirigido a los fallos exhibidos por el baseline.
  3. Integrada en la documentación del kit (mission: carril consult en el dominio; architecture: árbol; README: catálogo; CLAUDE.md; roadmap).
  4. NO crea `sdd-end-consult` ni plantillas nuevas: es un carril de una sola skill, sin cierre ni artefactos.
- **NO objetivos**:
  - Reemplazar `sdd-start-task`/`-hotfix`/`-release`: `sdd-consult` deriva a ellos, no los absorbe.
  - Ser un carril de debugging: una investigación de bug genuina es `superpowers:systematic-debugging` (y su fix, hotfix/task). `sdd-consult` entiende y explica; no persigue causas raíz de fallos.
  - Producir artefactos SDD (spec, plan, walkthrough, branch, estimation): ninguno por defecto.

## 3. Decisión clave

Tres decisiones de diseño, resueltas con el usuario en el brainstorming (2026-07-21):

- **Nombre**: `sdd-consult` (verbo, inglés kebab-case, como el resto del kit). Cubre el rango completo: preguntar + planificar + estructurar. Descartados `sdd-ask` (sabe a Q&A puro) y `sdd-explore` (se solapa con la fase de exploración de otros carriles).
- **Salida por defecto**: **nada**. La respuesta vive en la conversación (efímera). Si de la consulta surge algo **durable** — una corrección de un documento de anclaje, o una decisión que merece registrarse — se **propone** y lo **aprueba el usuario** explícitamente antes de escribir nada. Descartado "libre de actualizar docs" (rompe la disciplina de gates) y "nunca escribe, siempre deriva" (burocrático para una línea de roadmap).
- **Handoff a trabajo real**: `sdd-consult` **puede transicionar directamente** al carril adecuado cuando la conversación pide trabajo real, **sin** una pregunta de confirmación aparte. La seguridad NO viene de un gate en la consulta, sino de que:
  1. `sdd-consult` en sí **nunca edita código ni crea specs** — solo lee, razona y responde;
  2. la transición se **anuncia** ("esto es una feature → cambio a `sdd-start-task`");
  3. mandan entonces los **gates del carril destino** (Gate 1 + aprobación de spec en task; causa raíz en hotfix; decisión de scope en release).
  Así "solo preguntar" sigue siendo seguro: el salto a un carril pesado es visible y ese carril mantiene su disciplina.

**Distinción que la spec fija explícitamente** (para que 2 y 3 no se lean como contradicción): *actualizar un doc de anclaje desde dentro de la consulta* (salida durable, decisión §3.2) requiere aprobación; *arrancar un carril de trabajo* (transición, decisión §3.3) no requiere confirmación aparte porque el carril destino ya gatea. Son actos distintos.

## 4. Especificación funcional

### 4.1 Forma de la skill

- **Frontmatter**: `name: sdd-consult`; `description` que SOLO describe cuándo usar (preguntar/planificar/estructurar/entender con contexto, sin SDD clásico; y cuándo NO — implementar → task, bug determinista → hotfix, investigación de fallo → systematic-debugging).
- **Overview**: el principio del "anti-carril" — este carril produce entendimiento, no artefactos; su valor es el contexto cargado + la disciplina de no sobre-disparar.
- **El carril NO tiene gates de parada tipo ⛔** (no es su naturaleza): es ligero. Su disciplina es negativa (qué NO hace) + una receta positiva de cómo es una buena respuesta de consulta.

### 4.2 Comportamiento (checklist ligero, no gates)

1. **Primar contexto proporcional a la pregunta**: leer los documentos de anclaje relevantes (`mission`, `constitution`, `tech-stack`, `roadmap`, `architecture`, `funcional` — los que existan y apliquen) ANTES de responder. A diferencia del Gate 1 de `sdd-start-task`, aquí **la pregunta ES el enunciado**, así que explorar el código (semble/Grep/Read) sí está permitido desde el inicio, en la medida que la pregunta lo pida. Proporcionalidad: una pregunta de estructura de código lee `architecture` + el código; una de "qué hacemos ahora" lee `roadmap` + `mission`.
2. **Responder / planificar / estructurar** apoyándose en lo leído, distinguiendo lo que dice la documentación de lo que infiere el agente. Citar el doc de anclaje cuando la respuesta se apoya en él.
3. **Cero artefactos por defecto**: no crear carpeta de spec, no branch, no tocar código, no editar roadmap/docs "de paso".
4. **Salida durable opcional (con aprobación)**: si la consulta destapa que un doc de anclaje está desactualizado o produce una decisión durable, **proponerlo** al usuario; solo con su OK se escribe (en el doc que le corresponde por su naturaleza).
5. **Handoff (transición anunciada)**: si la conversación pide trabajo real, anunciar y transicionar al carril: feature/cambio no trivial → `sdd-start-task`; bug determinista → `sdd-start-hotfix`; abrir/planificar release → `sdd-start-release`; investigación de un fallo → `superpowers:systematic-debugging`. La consulta no ejecuta el trabajo; el carril destino sí, con sus gates.

### 4.3 Fallos que la skill debe prevenir (a confirmar contra el RED)

- **Responder sin primar el contexto de anclaje** (respuesta que contradice mission/constitution/roadmap).
- **Sobre-disparar el SDD** (crear spec/carpeta/branch para una pregunta).
- **Editar docs/roadmap/código "de paso"** sin que el usuario lo pida ni lo apruebe.
- **Confundir consulta con debugging** (lanzarse a parchear un síntoma en vez de entender/derivar).

### 4.4 Anatomía de la evidencia

- `tests/sdd-consult-red.md`: baseline Sonnet sobre fixture "TimeTrack", con los escenarios (pregunta de código+docs; planificar/estructurar sin arrancar; consulta que se vuelve trabajo). Fallos numerados con racionalizaciones citadas; positivos sin guidance.
- `tests/sdd-consult-green.md`: mismos escenarios con la skill; veredicto por fallo; REFACTOR si aparecen huecos; re-verificación.

## 5. Datos

No aplica.

## 6. UX

No aplica (skill de proceso, Markdown).

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] Art. I — Ley de hierro de skills (ciclo RED→GREEN completo para la skill nueva).
- [x] Art. II — La forma sigue al fallo (disciplina negativa + receta; guidance solo contra fallos exhibidos).
- [x] Art. III — Idioma.
- [x] Art. VI — Commits.
- [x] Art. VII — Dogfooding (esta task ES el flujo).
- [x] Art. VIII — Plantillas: este carril NO añade ninguna (no toca la fuente única).

### 7.2 Dependencias

- Plugin superpowers (`writing-skills` para el ciclo; `systematic-debugging` como destino de handoff).
- Subagentes Sonnet para RED/GREEN sobre la fixture "TimeTrack" (reutilizable de la task anterior).

### 7.3 Excepciones a la constitution

Ninguna.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El baseline Sonnet ya prima contexto y no exhibe el fallo 1 (config global con flujo SDD, como en RED anteriores) | Media | Medio | Escenario con pregunta cuya respuesta correcta EXIGE un doc de anclaje concreto (p. ej. el cambio de requisito de la semana de Sevilla); si el baseline responde sin leerlo, el fallo se exhibe. Si no se exhibe, se marca con procedencia (Art. I) |
| Solape con `sdd-start-release` en "planificar/estructurar" | Media | Bajo | Límite explícito: consult ayuda a pensar/estructurar (efímero); comprometer scope o abrir la release es `sdd-start-release`. El handoff lo hace visible |
| El handoff "sin confirmar" erosiona el "solo preguntar" | Media | Medio | La transición se ancla a la intención expresada por el usuario en la conversación, se anuncia, y el carril destino gatea; consult nunca edita código por sí mismo |
| La skill se lee como "otra skill pesada con gates" y nadie la usa para preguntar | Baja | Medio | Tono ligero explícito; sin ⛔; la description deja claro que es el carril de "solo preguntar" |

## 9. Rollout

Directo a `master` (rama única del kit). El corte de release (v0.3.0 con esta skill) queda como decisión posterior del usuario.

## 10. Open questions

- [ ] Ninguna: las tres decisiones de diseño (nombre, salida por defecto, handoff) las resolvió el usuario en el brainstorming.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-07-21 | aprobado ("ok!") |
