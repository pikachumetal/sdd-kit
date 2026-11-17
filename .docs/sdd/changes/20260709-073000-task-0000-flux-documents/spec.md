# Spec: Documentos de flujo SDD (greenfield + brownfield + anexo)

- **Fecha**: 2026-07-09
- **Estado**: done
- **Origen**: evolución del documento interno "Flux per al desenvolupament ràpid d'apps.md"

> **Nota de migración**: spec redactada originalmente en `D:\code\labs\vibe-coding\docs\specs\` (antes de existir este repo) y migrada aquí el 2026-07-09 al aplicar el Art. VII (dogfooding). El plan de ejecución vivía embebido en §9 — no existió `plan.md` separado. Los entregables son documentos internos del equipo y viven fuera de este repo desde 2026-09-20.

## 1. Contexto y objetivo

El equipo dispone de un primer documento de flujo de desarrollo rápido con Claude, deliberadamente simple. Esta tarea lo evoluciona incorporando la práctica SDD consolidada en cuatro proyectos internos (specs, plans, walkthroughs, skills, estimación calibrada).

**Objetivo**: producir tres documentos en catalán, con el tono formal del original, que evolucionen su flujo incorporando SDD, escritos como proceso ejecutable que explicita en cada paso qué riesgo elimina y qué tiempo ahorra. Tono formal y neutro.

## 2. Entregables

| # | Fichero | Extensión |
| --- | --- | --- |
| 1 | `Flux … — Projectes greenfield.md` | ~150 líneas |
| 2 | `Flux … — Projectes brownfield.md` | ~150 líneas |
| 3 | `Flux … — Annex: evidència i referències.md` | sin límite estricto, documento de referencia |

Ubicación final: documentación interna del equipo, fuera de este repo desde 2026-09-20. Los títulos mantienen la familia del documento original (se leen como su continuación).

## 3. Decisiones cerradas (grilling 2026-07-09)

1. **Posicionamiento**: mismo esqueleto que el original (fundamentos → implementación → presentación al cliente + principio general); cada fase se enriquece con SDD.
2. **Idioma**: catalán, ortografía correcta, términos técnicos en inglés.
3. **Herramienta**: Claude Code como vía por defecto; Claude Chat mencionado como alternativa válida para el análisis inicial si aún no hay repositorio.
4. **Evidencia interna**: ejemplos y métricas anonimizados, nunca nombres de proyectos.
5. **Skills**: nombradas en el cuerpo como base del sistema. Se referencia el "kit SDD de l'equip" y la carpeta estándar `.docs/sdd/`.
6. **Taxonomía de skills en 3 niveles**: nivel 1 proceso (kit precargable), nivel 2 técnicas por stack, nivel 3 específicas del proyecto.
7. **sdd-init**: cada documento nombra su skill de inicialización en una línea; construir el kit fue el proyecto siguiente (ya realizado — este repo).
8. **Verificación por niveles, asimétrica**: greenfield TDD + Playwright + smoke; brownfield smoke base + Playwright para regresión + TDD donde sea viable.
9. **Paralelismo**: la partición reparte tareas entre developers sin pisarse, no paralelismo multi-agente; ejecución inline con checkpoints.
10. **Gestión de contexto**: una tarea, un contexto (corrige la regla del original de 2-3 tareas por chat); documentos de anclaje en vez de CLAUDE.md monolítico.
11. **Citas**: intro breve con 4-5 enlaces por flujo; evidencia completa al anexo.
12. **Honestidad como estrategia**: cuándo NO usar SDD; Thoughtworks *Assess* reconocido.
13. **Tamaño de tarea**: ≤1 jornada; en tareas grandes los últimos pasos degradan.
14. **Principio transversal**: consistencia independiente de quién ejecuta.
15. **Carpeta con punto**: `.docs/` en lugar de `docs/`.

## 4-6. Estructuras de los tres documentos

Los entregables están fuera de este repo — las estructuras detalladas de la spec original se materializaron sin desviaciones relevantes (ver walkthrough).

## 7. Criterios de aceptación

- Catalán ortográficamente correcto; términos técnicos en inglés.
- Flujos: ~150 líneas (±20), tono formal impersonal calcado al original.
- Cero nombres de proyectos internos; tono formal y neutro.
- Cada fase explicita qué riesgo elimina o qué tiempo ahorra, integrado en el texto (sin sección de "ventajas").
- Enlaces del anexo verificados (investigación del 2026-07-09).

## 8. Fuera de scope

- Crear el kit de skills (fue la tarea siguiente: ver `20260709-100000-task-0000-sdd-kit-v010/`).
- Versión en castellano; modificar el documento original.
