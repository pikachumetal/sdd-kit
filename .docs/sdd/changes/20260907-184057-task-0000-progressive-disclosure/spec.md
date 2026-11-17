---
id: 20260907-184057-task-0000-progressive-disclosure
task: 0000
title: Progressive disclosure de las skills del kit
mode: full
status: approved
created: 2026-09-07
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-07
---

# Spec — Progressive disclosure de las skills del kit

## 1. Contexto

- **Problema u oportunidad**: el roadmap inventaría deuda de tamaño en las skills del kit, encabezada por `sdd-start-task` con 1503 palabras. El remedio previsto era progressive disclosure: `SKILL.md` con gates, enrutado y tablas, y `references/` leídos en el punto de uso. Estado de partida confirmado en el repo el 2026-09-07: las 11 skills suman 51.822 caracteres; ninguna tiene hoy carpeta `references/`; el único auxiliar del kit es `skills/sdd-templates/templates/`. Reparto: `sdd-start-task` 1503 palabras, `sdd-end-release` 1103, `sdd-consult` 839, `sdd-start-release` 796, `sdd-end-task` 767, y seis skills entre 355 y 638.

  Dos verificaciones hechas durante el brainstorming cambian el planteamiento heredado del roadmap:

  1. **El pendiente "crea un todo por paso" no tiene el defecto que el roadmap le atribuía.** superpowers 6.3.0 conserva esa instrucción en sus skills activas (`using-superpowers/SKILL.md:24`, `executing-plans/SKILL.md:23`, `writing-skills/SKILL.md:629`). Lo que su Phase E hizo (`docs/superpowers/specs/2026-05-05-platform-neutral-prose-design.md`) fue despegarla del nombre de la herramienta y escribirla como acción; `docs/porting-to-a-new-harness.md:469` la fija como *"create / update todos (treat older `TodoWrite` references as this action)"*, y cada harness la mapea a lo que tenga (`gemini` → `write_todos`, `hermes` → `todo`, `pi` → tool instalada o `TODO.md`, `antigravity` → task artifact, porque no tiene tool de todos). La línea del kit ya está en lenguaje de acción y no nombra `TodoWrite`: no hay nada que arreglar en las 8 skills.
  2. **superpowers no usa `references/` para adelgazar el `SKILL.md`.** Sus skills con auxiliares son las más gordas: `subagent-driven-development` 4823 palabras con 6 auxiliares, `writing-skills` 3779 con 6, `brainstorming` 2324 con 7. La única que se carga en toda sesión, `using-superpowers`, tiene 485 palabras. Sus auxiliares son contenido condicional (mapeo por harness, guía del visual companion), no troceado del flujo. `writing-skills/SKILL.md:286` marca ❌ el patrón `@ruta/SKILL.md` por "force-loads, burns context": el criterio es qué se fuerza a cargar, no cuánto ocupa un fichero que solo se lee al invocar.

- **Stakeholders**: lo pide el dev-lead (dueño del kit); se benefician los agentes que ejecutan las skills bajo presión y los devs del equipo que las leen; lo mantiene el propio kit.

- **Restricciones conocidas**: Art. I (ninguna edición de skill sin ciclo de test documentado), Art. III (no se traducen las skills al inglés por ahorro de tokens), Art. VIII (las plantillas no se duplican ni se tocan desde aquí). El kit no tiene CI ni framework de test: la evidencia es narrativa verificada en disco.

## 2. Objetivo

- **Qué construimos (one-liner)**: someter las 11 skills del kit a una campaña A/B de no-regresión que decida, skill a skill y con evidencia, qué contenido puede bajar a `references/` sin degradar la conducta del agente.

- **Definición de éxito**:
  1. Las 11 skills tienen su fichero de evidencia `tests/<skill>-ab.md` con los cortes probados, los aceptados y los descartados con su motivo.
  2. Ningún corte se publica sin que su tratamiento reproduzca la conducta del control en todos los escenarios de esa skill.
  3. El Art. I de la constitution reconoce explícitamente el A/B de no-regresión como test válido para recortes y reestructuraciones de skills existentes.
  4. `architecture.md` documenta el criterio que decide qué baja a `references/` y la anatomía de la evidencia A/B.
  5. El ítem T2 del roadmap queda reescrito sin la premisa errónea sobre `TodoWrite`, con la verificación de superpowers 6.3.0 citada.
  6. `tech-stack.md` incorpora el método A/B a su sección de tests.

- **NO objetivos**:
  - Traducir las skills al inglés. Medido durante el brainstorming: traducir ahorra ~290 tokens por sesión en lo que se carga siempre (las 11 `description`, 3.255 caracteres) y ~900 en la invocación de `sdd-start-task`, frente a ~1.700 que quita el partido. Además invalida las citas textuales de los baselines en castellano que sostienen las tablas de racionalizaciones. Art. III se mantiene, ahora con números.
  - Editar `skills/sdd-templates/templates/` (Art. VIII).
  - Borrar o reformular "(crea un todo por paso)" en las 8 skills (verificación 1 de la sección 1).
  - Bump de versión y sellado del changelog: eso pertenece al cierre de la release, no a esta task.

## 3. Decisión clave

- **Opción elegida — el A/B decide, skill a skill, sin criterio previo de corte.** No se fija de antemano qué bloques bajan. Por cada skill se genera un tratamiento con cortes candidatos y se compara contra un control fresco de la versión vigente sobre los mismos escenarios. El corte se publica solo si el tratamiento reproduce la conducta del control en **todos** los escenarios de esa skill; un solo escenario degradado obliga a rehacer o descartar el corte, y el descarte se documenta. Es el método con el que superpowers condujo su campaña de compresión 6.2.0, donde el único corte que degradó conducta medida (borrar "Why Order Matters" de TDD bajó el test-first de 8/10 a 5/10 bajo presión) se rehízo en vez de publicarse.

  La campaña se organiza en **olas con hipótesis heredadas**: la ola 1 genera cortes candidatos a ciegas sobre la skill más larga, y los patrones que sobreviven pasan a ser el punto de partida de las siguientes olas — que conservan su A/B propio. Se hereda de dónde partir, nunca el veredicto.

- **Alternativa descartada — criterio previo fijo** ("se queda lo que gobierna la decisión, baja el detalle posterior"): habría producido un partido uniforme y barato, pero decide por hipótesis lo que la evidencia debe decidir. Con el hallazgo de que superpowers mantiene sus `SKILL.md` largos y usa auxiliares solo para contenido condicional, esa hipótesis pierde el respaldo que se le presumía.

- **Alternativa descartada — campaña plana sin herencia** (cada skill genera candidatos desde cero): ~70 runs frente a ~50, sin más información: las 11 skills comparten anatomía, así que los candidatos ciegos se repetirían skill a skill.

- **Alternativa descartada — A/B por familias** (`start-*`, `end-*`, `init-*`, un A/B por familia aplicado a sus miembros): el más barato (~15 runs), pero asume que skills de la misma familia degradan igual, que es justo lo que el A/B tendría que demostrar.

- **Consecuencia asumida**: el A/B puede concluir que una skill no admite ningún corte —incluida `sdd-start-task`, la que originó la deuda—. Bajo el Art. I ese resultado es válido y cierra el ítem con evidencia, igual que un baseline RED que no falla recorta el alcance de una task. Si ocurre en todas, T2 deja de ser "partir las skills" y pasa a ser "evidencia de que el tamaño actual está justificado" más los entregables documentales.

## 4. Especificación funcional

### 4.1 Anatomía objetivo

`SKILL.md` sigue siendo autosuficiente para el caso general. Un bloque solo es **candidato** a bajar a `references/<tema>.md` si cumple las dos condiciones:

- **(a)** aplica a un subconjunto de invocaciones, no a todas;
- **(b)** se necesita después de decidir, no para decidir.

Cumplir (a)+(b) hace candidato al bloque; **el A/B decide si baja**. La referencia se escribe como enlace relativo en el punto exacto del flujo (`ver [nombrado.md](references/nombrado.md)`), nunca con `@`, que fuerza la carga. Verificado en sesión: el harness inyecta `Base directory for this skill: <ruta>` al invocar y **no** carga los ficheros auxiliares por su cuenta.

Candidatos identificados a ojo, sujetos al veredicto del A/B: el bloque de modo lite y la receta de nombrado en `sdd-start-task`; el detalle de los pasos 2, 3, 5 y 6 de `sdd-end-release`; la anatomía por artefacto en `sdd-templates`. Los gates ⛔, el enrutado, el checklist numerado, las red flags y las tablas de racionalizaciones entran también como candidatos, con la hipótesis previa —no el veredicto— de que degradan.

### 4.2 Protocolo del A/B

| Elemento | Definición |
| --- | --- |
| Control | El `SKILL.md` vigente del working tree, entregado al subagente **pegado por prompt**. Nunca la copia en cache del plugin, que es la versión publicada. |
| Tratamiento | El `SKILL.md` partido más sus `references/`, entregados igual, sin forzar su lectura: si el subagente los necesita, los lee por su cuenta. |
| Escenarios | Los de `tests/<skill>-green.md`, ya escritos y ya validados contra la versión vigente. Solo se añaden escenarios nuevos si se descubre un hueco. |
| Criterio de aceptación | El tratamiento reproduce la conducta del control en **todos** los escenarios de la skill. Un escenario degradado ⇒ corte rehecho o descartado, con el motivo escrito. |
| Bisección | Si un tratamiento con varios cortes degrada, se bisecciona para atribuir la degradación al corte concreto antes de descartar. |
| superpowers | Sus skills **no** se pegan: las resuelve el harness, para que el A/B mida la integración real entre la versión instalada y el working tree del kit. |
| Neutralidad del prompt | El prompt del subagente no telegrafía la conducta correcta. La conducta se infiere del log de acciones y se verifica en disco, no del autoinforme. |
| Evidencia | `tests/<skill>-ab.md` por skill: cortes probados, aceptados, descartados y por qué. Los descartados son el dato caro. |

Control fresco en las olas 1 y 2. En la ola 3 el control se corre solo si el tratamiento se desvía de lo documentado en su GREEN.

### 4.3 Olas

| Ola | Alcance | Nota |
| --- | --- | --- |
| 0 | Art. I ampliado en `constitution.md` + criterio (a)+(b) y anatomía de la evidencia en `architecture.md` | Sin subagentes. Va primero: gobierna cómo se testea el resto. |
| 1 | `sdd-start-task` (1503 palabras) | Cortes candidatos a ciegas. Salida: qué tipo de bloque sobrevive. |
| 2 | `sdd-end-release`, `sdd-consult`, `sdd-start-release`, `sdd-end-task` (767–1103) | Parten de las hipótesis de la ola 1; A/B propio cada una. |
| 3 | `sdd-start-patch`, `sdd-init-greenfield`, `sdd-init-brownfield`, `add-to-changelog`, `sdd-end-patch`, `sdd-templates` (355–638) | Resultado esperado: no cortar. Deja evidencia de que ya están dimensionadas. Menos escenarios por skill. |

Volumen estimado: ~50 runs de subagente más las bisecciones que aparezcan. El modelo por ola y su justificación de coste van en `plan.md` y se confirman antes de lanzar la campaña.

### 4.4 Historias

- Como agente que invoca una skill del kit, quiero que el `SKILL.md` contenga todo lo que gobierna mi decisión, para no depender de leer un fichero que puedo saltarme.
- Como agente que ya decidió el carril, quiero encontrar el detalle de ejecución en un fichero referenciado en el punto exacto donde lo necesito, para no arrastrarlo mientras decido.
- Como dev-lead, quiero que cada corte publicado tenga evidencia de que no degradó la conducta, y cada corte descartado el motivo, para que la siguiente campaña no repita el experimento.

### 4.5 Edge cases

- **Degradación parcial** (el tratamiento falla 1 de 3 escenarios): cuenta como degradación. No hay corte "casi bueno".
- **El control degrada respecto a su GREEN documentado**: la causa es el entorno (versión de superpowers, modelo, harness), no el corte. Se anota y se re-corre antes de concluir nada del tratamiento.
- **El subagente invoca por `Skill` la copia en cache de la misma skill que se le pega**: ocurrió en 2/3 GREEN de una campaña previa. La entrega por prompt gobierna; se anota en la evidencia cuando ocurra.
- **Una skill sin `tests/<skill>-green.md` utilizable**: `sdd-templates` no tiene fichero propio (su evidencia es `templates-single-source-green.md`). Su A/B necesita escenarios redactados en la ola 3; se documenta como hueco preexistente.

## 5. Datos

No aplica: la task no toca schema ni datos. El repo es Markdown sin código ejecutable.

## 6. UX

No aplica.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] Art. I — Ley de hierro de skills: la task **es** un ciclo de test; además propone ampliar el artículo (ver 7.3).
- [x] Art. II — La forma sigue al fallo: ningún corte publicado sin fallo medido que lo respalde; las tablas de racionalizaciones son forma comprimida de un argumento, no decoración.
- [x] Art. III — Idioma: se mantiene; la traducción queda descartada con medición.
- [x] Art. IV — Convenciones: carpeta y naming estándar; no se cambia ninguna convención impuesta a los proyectos.
- [x] Art. VII — Dogfooding: la task cicla por el flujo del propio kit.
- [x] Art. VIII — Fuente única de plantillas: no se toca `skills/sdd-templates/templates/`.

### 7.2 Dependencias

- superpowers 6.3.0 instalado (validado el 2026-09-07): el A/B lo resuelve por harness, no por prompt.
- `tests/*-green.md` existentes como fuente de escenarios.
- T1 (`alineacion-superpowers`) cerrada: su guidance ya está en `sdd-start-task` y `sdd-consult`, y entra en el A/B como parte del control.

### 7.3 Enmienda a la constitution

No es una excepción, es una ampliación, y por eso figura como entregable y no como desviación.

- **Artículo**: Art. I — Ley de hierro de skills.
- **Texto hoy**: define el test como baseline sin la skill (RED) → skill dirigida a esos fallos (GREEN), y declara que aplica "también a recortes, traducciones y pequeños ajustes".
- **Problema**: para un recorte, el baseline sin la skill mide contra el vacío. Una versión recortada puede batir a un baseline vacío y ser peor que la versión vigente, y el artículo la daría por buena.
- **Ampliación propuesta**: para recortes y reestructuraciones de skills existentes, el test válido es el A/B de no-regresión contra la versión vigente (control), con criterio de aceptación en todos los escenarios. El RED contra baseline vacío sigue siendo el test de la guidance nueva.
- **Aprobado por**: dev-lead, en el gate de esta spec.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Ningún corte sobrevive y T2 no entrega partido | Media | Medio | Asumido en la sección 3. El cierre documenta el tamaño como justificado; los entregables 2–6 se entregan igual. |
| Ruido entre runs confunde degradación con varianza del modelo | Media | Alto | Control fresco en olas 1 y 2; bisección antes de descartar; un control desviado de su GREEN invalida la comparación y se re-corre. |
| El coste de la campaña se dispara con las bisecciones | Media | Medio | Herencia de hipótesis entre olas; ola 3 con menos escenarios; el volumen se revisa al cerrar cada ola. |
| Un corte pasa el A/B y degrada en uso real fuera de los escenarios cubiertos | Baja | Alto | Los escenarios salen de los GREEN, construidos desde baselines reales; cada criterio de éxito exige su escenario. |
| La evidencia se acumula sin que nadie la relea | Baja | Bajo | Los descartes con motivo entran en `tests/<skill>-ab.md` y el criterio destilado en `architecture.md`. |

## 9. Rollout

Directo. El kit es local-only por decisión del 2026-09-02: los cambios llegan al working tree y se distribuyen cuando se cierre la release v0.6.0 con su bump. Nada que desplegar.

## 10. Open questions

- [ ] Modelo y coste por ola de la campaña A/B — se propone en `plan.md` y lo confirma el dev-lead antes de lanzar subagentes.
- [ ] Si la ola 1 no produce ningún corte superviviente, ¿se ejecutan igual las olas 2 y 3, o se cierra la task con la evidencia de la ola 1? — dev-lead, al cerrar la ola 1.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-07 | aprobada |

Aprobada en conversación el 2026-09-07, incluida la enmienda al Art. I de la §7.3.
