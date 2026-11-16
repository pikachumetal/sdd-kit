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
- `skills/guardar-nota/SKILL.md` no pasa de ~~60~~ 75 palabras (`test/words.test.js`) — «esta skill se queda en 60» — *enmienda propuesta 2026-11-15, pendiente de aprobar: con los pasos 1-3 y el paso 4 literal la skill mide 74*
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

- 2026-11-15 — **pendiente de aprobar** — El tope de `skills/guardar-nota/SKILL.md` pasa de 60 a 75 palabras (`test/words.test.js`). Motivo: hoy mide 48 y el paso 4 literal suma 26 (74); con los pasos 1-3 intocables, cumplir 60 exigiría quitar 14 de las 17 palabras de frontmatter y título, lo que deja la skill sin `description`. Añade a la Task 1 el fichero `test/words.test.js`. Solape no comprobable: no hay `ROADMAP.md` que declare ficheros.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
