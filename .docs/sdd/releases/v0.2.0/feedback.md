---
release: v0.2.0
title: Acta de release — v0.2.0
created: 2026-07-21
source: Estreno real del kit en un proyecto del equipo (sin acta formal; el feedback llegó como artefactos)
---

# Acta de release — v0.2.0 (2026-07-21)

Fuente: estreno real del kit en un proyecto del equipo (roadmap, ítem 2). El feedback no llegó como transcripción sino como **artefactos**: dos skills nuevas escritas sobre la marcha en el proyecto de prueba y las ediciones de fuente única en las 7 existentes, incorporadas al kit en la sesión del 2026-07-21 ([task](../../specs/20260721-082038-task-0000-release-skills/)).

## 1. Inventario y triage

| # | Petición | Ref | Área | Recomendación | Decisión |
| --- | --- | --- | --- | --- | --- |
| 1 | Falta el carril release: abrir/cerrar releases no tenía skill (cada cierre se improvisaba) | estreno → skills traídas | proceso | Incorporar con ciclo RED→GREEN completo (Art. I) | release-siguiente — **ejecutada en esta release** (Àngel, sesión 2026-07-21) |
| 2 | Las plantillas copiadas en cada proyecto derivan respecto al kit | estreno → ediciones en 7 skills | plantillas | Fuente única: los proyectos dejan de llevar `templates/` | release-siguiente — **ejecutada** (Àngel: "incluirlo en esta task") |
| 3 | Los artefactos de release (acta, release notes) se improvisaban sin contrato de forma | estreno | plantillas | Añadir `feedback-template` y `release-notes-template` | release-siguiente — **ejecutada** (Àngel: "sí, ambas") |
| 4 | Ruta de scripts de proyecto movida a `.tools/sdd/` | estreno → ediciones | convenciones | Actualizar referencias con fallback a `tools/sdd/` | release-siguiente — **ejecutada** |

## 2. Cambios de requisito detectados

- El **Art. VIII de la constitution** quedó contradicho por la decisión de fuente única: decía "los proyectos consumidores sí las copian — es su instalación". Corregido en este cierre (los proyectos calcan del skill, nunca instalan copia); el índice CLAUDE.md ajustado en la misma línea.

## 3. Retro

- **Agregado de la release**: 1 task con estimación — estimado 4h · real ~1,5h (ratio 0,38). (Los commits de docs previos al carril fueron cambios-de-una-frase sin estimación.)
- **Comprobación de los action items de la release anterior**: v0.1.0 se cerró sin retro (el carril release no existía) — no hay action items previos que comprobar. Primera retro del kit.
- **Qué funcionó**: orquestación de los ciclos RED/GREEN con workflows multi-agente (8 runs en ~30 min de pared); fixtures con git local; verificación en disco además del autoinforme; el GREEN exhibiendo huecos de la propia skill (merge+tag) que ni el RED ni la revisión manual habían visto.
- **Qué corregir**: la estimación asumió ciclo secuencial (desviación −62%); un bug al pasar `args` al workflow costó 3 runs (mitigado: rutas incrustadas, aprendizaje en tech-stack).
- **Action items nuevos**:
  - [A1] Estimar las tasks con ciclos de test orquestados en horas-pared con paralelización (factor observado 0,38) — se verifica en el próximo `plan.md` con bloque de estimación.
  - [A2] Configurar el remoto del kit (roadmap, ítem 1) antes del próximo cierre de release — se verifica con `git remote -v` no vacío.
