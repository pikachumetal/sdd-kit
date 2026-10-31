---
id: 20261014-120000-feature-0025-note-tags
feature: 0025
title: Etiquetas en la nota
mode: full
profile: delegate
status: approved
created: 2026-10-14
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-14
---

# Spec — Etiquetas en la nota

## Capacidades

- Modificadas: `notes`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

### Decisiones tomadas con el dev-lead

- El paso de las etiquetas lleva este texto, literal: «4. Ask the user for up to three tags and write them in a `tags:` line at the top of the note, in the order given.» — «lo quiero con esas palabras»
- `skills/guardar-nota/SKILL.md` no pasa de 74 palabras (`test/words.test.js`) — antes 60 («esta skill se queda en 60»); ver «Enmiendas»
- Los pasos 1 a 3 son de la fuente: no se tocan

## Intent

Las notas no se pueden agrupar por tema.

## Scope

- Entra: el paso de las etiquetas en `skills/guardar-nota/SKILL.md` y el tope de `test/words.test.js`.
- No entra: buscar notas por etiqueta.

## Dónde se prueba

- El tope: `test/words.test.js`.
- El paso: humo `h1` con un sujeto headless.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — La nota lleva etiquetas**
- GIVEN una nota que se guarda
- WHEN el usuario da dos etiquetas
- THEN la nota empieza por `tags: a, b`

## Enmiendas

- 2026-10-31 — pendiente de aprobar: el tope de `skills/guardar-nota/SKILL.md` pasa de 60 a 74 palabras y `test/words.test.js` entra en el Scope, porque el paso literal (26) y los pasos 1 a 3 (30) no caben en 60 con el frontmatter de la skill.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
