---
id: 20261016-100000-feature-0028-note-tags-kept-flags
feature: 0028
title: Etiquetas en la nota, con las red flags de guardar-nota
mode: full
profile: delegate
status: approved
created: 2026-10-16
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-16
---

# Spec — Etiquetas en la nota, con las red flags de guardar-nota

## Capacidades

- Modificadas: `notes`.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

### Decisiones tomadas con el dev-lead

- El paso de las etiquetas lleva este texto, literal: «4. Ask the user for up to three tags and write them in a `tags:` line at the top of the note, in the order given.» — «lo quiero con esas palabras»
- `skills/guardar-nota/SKILL.md` no pasa de 80 palabras (`test/words.test.js`) — «esta skill se queda en 80»
- Las dos red flags de `guardar-nota` se quedan como están — «las red flags no se tocan, que sin ellas los agentes se inventan el título»
- Los pasos 1 a 3 son de la fuente: no se tocan

## Intent

Las notas no se pueden agrupar por tema.

## Scope

- Entra: el paso de las etiquetas en `skills/guardar-nota/SKILL.md`.
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

- 2026-11-12 — propuesta, sin aprobar: el tope de `skills/guardar-nota/SKILL.md` sube de 80 a 100 palabras (`test/words.test.js`). Las partes que fijan las otras decisiones (pasos 1 a 3, 30 palabras; paso 4 literal, 26; las dos red flags, 22) suman 78 antes del frontmatter, así que 80 no cabe sin romper otra decisión. Con el paso 4 la skill mide 99.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-16 | aprobada |
