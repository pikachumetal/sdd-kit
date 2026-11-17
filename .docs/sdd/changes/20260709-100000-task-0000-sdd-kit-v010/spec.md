# Spec: Kit SDD v0.1.0 (retroactiva)

- **Fecha**: 2026-07-09
- **Estado**: done

> **Nota de honestidad**: spec retroactiva, registrada al cerrar la tarea. El diseño no salió de una spec previa sino del grilling de la tarea anterior (`../20260709-073000-task-0000-flux-documents/spec.md` §3, decisiones 5-7) más las decisiones tomadas durante la construcción, listadas aquí. Se registra para trazabilidad, no para aparentar un proceso que no ocurrió — a partir de v0.1.0, los cambios no triviales del kit sí ciclan spec-primero (Art. VII de la constitution).

## 1. Objetivo

Kit instalable con las skills de proceso SDD del equipo (nivel 1 de la taxonomía), extraídas de las versiones probadas en los repos internos y generalizadas, más las dos skills nuevas de inicialización. Un único origen de verdad frente a la deriva de copias por proyecto.

## 2. Decisiones tomadas durante la construcción

1. **Distribución dual**: plugin de Claude Code (`.claude-plugin/`) + compatible `npx skills add` (mismo layout `skills/<nombre>/SKILL.md`). Verificado contra docs oficiales de ambos.
2. **TDD de writing-skills obligatorio por skill**: baseline RED con subagentes Sonnet sobre fixtures desechables → skill dirigida a los fallos observados → GREEN con los mismos escenarios. Una skill cada vez, sin lotes.
3. **Base de extracción**: versiones del proyecto marketplace (las más agnósticas) con injertos del legacy (Brownfield gate, "NO se tocan", fixes fuera de scope, Decisión clave, Rollout).
4. **Módulos por predicado observable** en vez de configuración: `estimation.md` / `changelog.md` presentes → módulo activo.
5. **La forma sigue al fallo**: `add-to-changelog` como receta/contrato (el baseline falló la forma, no la disciplina); las demás con prohibiciones + tablas de racionalización construidas con frases textuales de los baselines.
6. **Las init delegan la entrevista/exploración**: brainstorming como motor (greenfield), subagentes sonnet/haiku (brownfield); `/init` de Claude Code prohibido (produce el monolito que el kit sustituye — confirmado empíricamente en el baseline).
7. **No traducir a inglés** (decisión con datos: ahorro ~0,3% por tarea vs coste de re-validación y legibilidad del equipo).

## 3. Entregables

7 skills + `sdd-templates` (7 plantillas) + manifests + 14 ficheros de evidencia en `tests/` + andamiaje SDD propio (`.docs/sdd/`, este mismo).

## 4. Criterios de aceptación

- Cada skill con ciclo RED→GREEN documentado y en verde (cumplido: 7/7).
- Instalable como plugin desde ruta local (cumplido: verificado en la máquina del usuario).
