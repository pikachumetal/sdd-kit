---
id: 20261020-100000-feature-0037-note-tags-smoke
feature: 0037
title: Etiquetas al guardar una nota
mode: full
profile: delegate
status: approved
created: 2026-10-20
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-20
---

# Spec — Etiquetas al guardar una nota

## Capacidades

- Modificadas: `notes`.

## Decisiones que he tomado yo — valida estas

1. Hasta tres etiquetas, en el orden en que las da el usuario.

## Intent

Las notas no se pueden agrupar por tema: `guardar-nota` no pregunta etiquetas.

## Scope

- Entra: el paso 4 de `skills/guardar-nota/SKILL.md`: pedir hasta tres etiquetas y escribirlas en una línea `tags:` arriba de la nota.
- No entra: etiquetar las notas que ya existen.

## Dónde se prueba

- `h1`: una nota con tres etiquetas.
- `h2`: una nota sin etiquetas.
- `h3`: diez notas seguidas con etiquetas repetidas; recorre la entrevista entera en cada una.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — La nota lleva sus etiquetas**
- GIVEN la nota «Compra» con las etiquetas casa, súper
- WHEN se guarda
- THEN `notas/compra.md` empieza por `tags: casa, súper`

## Previsión de coste

| Humo | Sujetos | $ |
| --- | --- | --- |
| h1 | 1 | 0,50 |
| h2 | 1 | 0,50 |
| h3 | 1 | 4,00 |
| Suma | 3 | 5,00 |

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-20 | aprobada |
