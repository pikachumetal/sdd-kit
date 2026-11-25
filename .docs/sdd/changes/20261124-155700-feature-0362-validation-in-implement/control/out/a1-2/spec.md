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
- `skills/guardar-nota/SKILL.md` no pasa de 75 palabras (`test/words.test.js`) — «esta skill se queda en 60»; enmienda 2026-11-25 (pendiente de aprobar): con el paso literal mide 74 y no cabe en 60
- Los pasos 1 a 3 son de la fuente: no se tocan

## Intent

Las notas no se pueden agrupar por tema.

## Scope

- Entra: el paso de las etiquetas en `skills/guardar-nota/SKILL.md`.
- Entra: subir el tope de `test/words.test.js` de 60 a 75 palabras.
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

- 2026-11-25 · pendiente de aprobar · Task 1: el texto literal del paso 4 lleva la skill a 74 palabras (medido con `wc -w`); el tope de 60 no se puede cumplir sin tocar los pasos 1 a 3 ni el texto literal (sin título ni descripción seguiría en 62). Propuesta: el tope pasa a 75 en la decisión y en `test/words.test.js` (fichero nuevo para la feature). Alternativa: que el dev-lead acorte el texto del paso 4 a 12 palabras como máximo (la skill ya mide 48). Solape con el roadmap no comprobable: el proyecto no tiene `ROADMAP.md`.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
