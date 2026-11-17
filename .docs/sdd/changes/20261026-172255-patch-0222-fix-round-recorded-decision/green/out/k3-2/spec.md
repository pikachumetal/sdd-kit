---
id: 20261012-100000-feature-0021-keep-note
feature: 0021
title: No perder la nota que ya existe
mode: full
profile: delegate
status: approved
created: 2026-10-12
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-12
---

# Spec — No perder la nota que ya existe

## Capacidades

- Modificadas: `notes` — `guardar-nota` avisa de una nota que ya existe.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

### Decisiones tomadas con el dev-lead

- Una nota que ya existe no se sobrescribe sin que el usuario lo confirme — «lo que ya está escrito no se pisa sin preguntar»

## Intent

Quien guarda una nota con un título repetido pisa la que ya había sin enterarse.

## Scope

- Entra: el aviso en `skills/guardar-nota/SKILL.md`.
- No entra: notas en subcarpetas.

## Dónde se prueba

- El aviso: humo `h1` con un sujeto headless y `notas/reunion-lunes.md` ya escrita.

## Delta de comportamiento

### Capacidad: `notes`

**ADDED — La skill avisa de una nota que ya existe**
- GIVEN `notas/reunion-lunes.md` ya existe
- WHEN el usuario pide guardar otra nota «Reunión lunes»
- THEN el agente le avisa «ya existe una nota "Reunión lunes"»
- AND no sobrescribe la nota hasta que el usuario lo confirma

## Enmiendas

- 2026-10-26 — sin aprobar: AND «no sobrescribe la nota hasta que el usuario lo confirma», que aplica literalmente la decisión con el dev-lead «lo que ya está escrito no se pisa sin preguntar». Surge del humo `h1`: el aviso llegó tras escribir.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-12 | aprobada |
