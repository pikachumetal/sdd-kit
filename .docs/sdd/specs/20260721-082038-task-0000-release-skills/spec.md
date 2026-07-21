---
id: 20260721-082038-task-0000-release-skills
task: 0000
title: Carril release — sdd-start-release y sdd-end-release validadas e integradas en el kit
status: approved
created: 2026-07-21
author: Àngel Delgado (redacción asistida por Claude)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-07-21
---

# Spec — Carril release: sdd-start-release y sdd-end-release

> **Estado**: approved
> **Fase del workflow**: Specify (qué + por qué)
> **Siguiente paso**: tras aprobación → `plan.md` con `superpowers:writing-plans`

## 1. Contexto

- **Problema u oportunidad**: el estreno real del kit (ítem 2 del roadmap) en un proyecto de prueba ha producido dos skills nuevas — `sdd-start-release` y `sdd-end-release` — que cubren un hueco real del kit: abrir y cerrar releases (hoy solo hay carriles de task y hotfix). Han llegado al repo tal cual (`skills/sdd-start-release/`, `skills/sdd-end-release/`, sin trackear) y les falta todo lo que el kit exige a una skill:
  - Sin evidencia RED→GREEN en `tests/` (violación del Art. I si se quedan así).
  - Sin integración documental: `mission.md`, `README.md`, `architecture.md` y `CLAUDE.md` hablan de 7 skills de proceso / 8 carpetas.
  - Sus artefactos (`feedback.md`, `release-notes.md`) se describen inline en el checklist, sin plantilla canónica en `sdd-templates`.
  - Rutas implícitas: `releases/<versión>/` sin raíz explícita (¿`.docs/sdd/releases/`? ¿raíz del repo?).
- Además, el working tree contiene sin commitear la alineación de las 7 skills existentes con el Art. VIII (fuente única de plantillas: los proyectos ya no llevan `templates/`) más el ajuste de ruta `.tools/sdd/`. **Decisión del usuario: ese cambio se incluye en esta task.**
- **Stakeholders**: el equipo (developers y agentes que consumen el kit); Àngel Delgado como dev-lead y autor de las skills originales.
- **Restricciones conocidas**: Art. I (test primero, también para ediciones), Art. II (la forma sigue al fallo), Art. III (idioma), Art. VIII (una sola fuente de plantillas). Tests con subagentes sobre fixtures desechables (tech-stack).

## 2. Objetivo

- **Qué construimos (one-liner)**: incorporar el carril release al kit — dos skills validadas con ciclo RED→GREEN, dos plantillas canónicas nuevas y la integración documental completa — y consolidar en el mismo cambio la fuente única de plantillas ya editada en las 7 skills existentes.
- **Definición de éxito** (criterios observables):
  1. `tests/sdd-start-release-red.md` + `-green.md` y `tests/sdd-end-release-red.md` + `-green.md` existen con la anatomía estándar (racionalizaciones citadas del baseline, veredicto por fallo).
  2. Las dos skills mejoradas responden a fallos exhibidos por el RED (no a especulación), con ejemplos donde el baseline muestre fallos de forma.
  3. `skills/sdd-templates/templates/` contiene `feedback-template.md` y `release-notes-template.md`, y las dos skills los referencian ("calcando … del skill `sdd-templates`").
  4. La ruta de los artefactos de release queda explícita y consistente en ambas skills.
  5. `mission.md`, `architecture.md`, `README.md` y `CLAUDE.md` reflejan 9 skills de proceso + plantillas (10 carpetas), y el cambio de fuente única de plantillas queda con su evidencia en `tests/`.
  6. Working tree limpio: todo commiteado con la convención del Art. VI; entradas en `[Unreleased]` del changelog vía `add-to-changelog` en el cierre.
- **NO objetivos**:
  - Cortar release del kit (bump `plugin.json` + sellar changelog) — decisión posterior del usuario (Art. V).
  - `sdd-end-bundle` (sigue en backlog) y skills de nivel 2.
  - Cambiar convenciones del Art. IV (el carril release las usa, no las modifica).

## 3. Decisión clave

- **Opción elegida**: validar las skills tal como vienen del proyecto de prueba usándolas como candidato GREEN: baseline RED sin skill sobre fixtures → ejecutar los mismos escenarios con la skill → **cierre de huecos** (las mejoras que pide el usuario salen de los huecos que exhiba el ciclo, no de especulación). Los artefactos de release ganan plantilla canónica (`feedback-template.md`, `release-notes-template.md`) — decisión del usuario, coherente con Art. II: fallo de forma → contrato/plantilla.
- **Alternativa descartada**: aceptar las skills sin ciclo RED→GREEN "porque ya vienen probadas del proyecto real" — viola el Art. I: la evidencia del proyecto origen no está documentada en `tests/` y el kit no la puede auditar.
- **Alternativa descartada**: describir los artefactos inline sin plantillas — descartada por el usuario; el contrato de forma calcable es más fuerte que la descripción en prosa.

## 4. Especificación funcional

### 4.1 Ciclo RED→GREEN de las dos skills nuevas (Art. I)

- Como mantenedor del kit, quiero evidencia de que cada skill corrige fallos reales, para que la guidance no sea especulativa.
- Fixtures desechables en el scratchpad de sesión (proyecto ficticio con `.docs/sdd/` completo: roadmap con backlog y deuda, changelog con `[Unreleased]` poblada, estimation-log, tasks cerradas, y una fuente de feedback simulada de demo con cliente).
- Escenarios mínimos:
  - `sdd-start-release`: abrir la release siguiente con acta de feedback triada disponible + presión de stakeholder ("todo es importante") + tentación de crear specs en batch y documento de scope paralelo.
  - `sdd-end-release`: cerrar una release con demo transcrita + prisa de entrega ("el cliente espera el email hoy") + tentaciones de mandar el changelog como release notes, clasificar el feedback en solitario y saltar a `v1.0.0` por un breaking.
- RED: subagente **sin** la skill; racionalizaciones citadas textualmente. GREEN: mismos escenarios **con** la skill actual; veredicto contra cada fallo del RED; huecos → mejora de la skill → re-verificación del hueco.
- Regla de parada (Art. I): si el baseline no exhibe un fallo, no se añade guidance para ese fallo. Las tablas de racionalizaciones actuales se contrastan con las reales del RED.

### 4.2 Mejoras de forma ya identificadas (candidatas, se confirman contra el ciclo)

- Ruta explícita de artefactos de release: `.docs/sdd/releases/vX.Y.Z/` en ambas skills (hoy `releases/…` ambiguo).
- Ambas skills pasan a calcar plantilla: `feedback.md` ← `feedback-template.md`; `release-notes.md` ← `release-notes-template.md`.
- Referencias cruzadas coherentes: `sdd-end-release` es quien corta versión en el changelog (en `add-to-changelog` el corte figura como "decisión del usuario, no parte de esta acción" — añadir el puntero a `sdd-end-release`); `sdd-start-release` remite a `sdd-start-task` para el refinado del top del scope (ya lo hace).
- Ejemplo de la sección "Release N" del roadmap en `sdd-start-release` si el ciclo muestra que la forma diverge.

### 4.3 Plantillas nuevas en `sdd-templates`

- `feedback-template.md` — acta única por release: inventario completo con referencia (minuto/fuente), área, recomendación y decisión del usuario por ítem (`release-siguiente / backlog / trabajo-cliente / ya-cubierto / descartado`); sección de cambios de requisito; sección de retro *(si existe `estimation-log.md`)*: estimado-vs-real agregado, qué funcionó/qué corregir, action items verificables + revisión de los anteriores.
- `release-notes-template.md` — audiencia cliente: título orientado a valor · resumen del hito · novedades por rol/área en outcome · problemas conocidos y fuera de alcance · próximos pasos. Prohibido: IDs, scopes de commit, jerga.
- Fila nueva por plantilla en la tabla del `SKILL.md` de `sdd-templates`.

### 4.4 Consolidación de la fuente única de plantillas (cambio ya en el working tree)

- Las ediciones de las 7 skills (referencias `.docs/sdd/templates/` → "del skill `sdd-templates`", no copiar plantillas en los init, ruta `.tools/sdd/` con fallback antiguo) se validan con un escenario GREEN dirigido: crear un artefacto en una fixture **sin** carpeta `templates/` y verificar que el agente calca del skill y no crea la carpeta. El RED de esta edición es el comportamiento anterior (las skills instruían copiar — observable en git). Evidencia en `tests/templates-single-source-green.md` (con el RED anotado dentro).

### 4.5 Integración documental

- `mission.md`: "las 7 skills" → 9 de proceso (init ×2, task ×2, hotfix ×2, release ×2, changelog); carril release añadido al lenguaje del dominio si procede.
- `architecture.md`: árbol del repo con las 2 carpetas nuevas.
- `README.md`: línea de estado, catálogo (+2 filas de skills, plantillas 7 → 9) y convención de `releases/`.
- `CLAUDE.md`: "las 8 skills" → 10 carpetas de skill.
- `constitution.md` Art. IV: "revisión de las 7 skills afectadas" → número actualizado (edición editorial, no cambio de convención).
- `roadmap.md`: reflejar el estreno en curso (ítem 2) y esta task.

## 5. Datos

No aplica (kit de Markdown, sin datos ni migraciones).

## 6. UX

No aplica.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] Art. I — Ley de hierro de skills (núcleo de la task: ciclo completo para las 2 nuevas; verificación dirigida para la edición de las 7).
- [x] Art. II — La forma sigue al fallo (mejoras solo contra fallos exhibidos; plantillas como contrato de forma).
- [x] Art. III — Idioma (skills y tests en castellano; nombres en inglés kebab-case).
- [x] Art. VI — Commits (tipo/scope inglés, cuerpo castellano).
- [x] Art. VII — Dogfooding (esta task ES el flujo: spec → plan → implementación → sdd-end-task).
- [x] Art. VIII — Fuente única de plantillas (las 2 plantillas nuevas nacen solo en el kit).
- Art. V — Versionado: fuera de scope (el corte de release lo decide el usuario después).

### 7.2 Dependencias

- Plugin superpowers (`writing-skills` para el ciclo de test, `brainstorming`/`writing-plans`/`executing-plans` para el flujo).
- Subagentes (Sonnet) para RED/GREEN sobre fixtures en el scratchpad.

### 7.3 Excepciones a la constitution

Ninguna.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED no exhibe algún fallo que las tablas actuales ya recogen | Media | Bajo | Art. I: la guidance sin fallo exhibido se retira o se marca; las tablas se reconstruyen desde el RED real |
| Fixtures poco realistas → RED blando que no estresa las skills | Media | Alto | Calcar el patrón de escenarios de los tests previos (presión, prisa, stakeholder insistente) y fixture con material de release completo |
| Coste en tokens de los subagentes (4 runs mínimo) | Alta | Bajo | Fixtures compactas; un run por escenario; reutilizar la fixture entre RED y GREEN |
| Mezclar en commits el cambio de plantillas-fuente-única con el carril release | Media | Medio | Commits separados por cambio lógico dentro de la misma task |

## 9. Rollout

Directo a `master` (convención actual del repo: rama única, sin remoto). El corte de release del kit (bump + changelog sellado + `/plugin marketplace update`) queda como decisión posterior del usuario.

## 10. Open questions

- [ ] Ninguna — las dos decisiones abiertas (incluir el cambio de plantillas; añadir ambas plantillas nuevas) las resolvió el usuario en el brainstorming.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-07-21 | aprobado ("ok a todo") |
