---
status: accepted
date: 2026-09-27
rutas:
  - skills/sdd-start-feature/**
  - skills/sdd-end-feature/**
  - skills/sdd-start-patch/**
  - skills/sdd-end-patch/**
  - skills/sdd-templates/scripts/**
---

# Convenciones de artefactos, ids, merge y ramas que el kit fija a los proyectos

## Contexto y problema

Antes del kit, cada repo del equipo copiaba las skills de SDD y las copias derivaban: rutas, módulos y nombres distintos. El kit fija las convenciones que permiten que el resultado dependa del proceso y no de quien ejecuta (mission). Se fueron añadiendo:

- Carpetas `-task-` hasta la v2.0.0; desde entonces `feature`, `patch` y `proposal`, en UTC. Las viejas se leen y no se renombran.
- Ids por modo (`ids.mode` en `sdd-kit.json`): `tracker`, con el id del gestor de tickets, o `sequence`, con una secuencia única por proyecto (v2.0.0).
- El merge a la rama de integración pasó de «siempre decisión del usuario» a la política que declara `merge` en `sdd-kit.json`, aplicada por el cierre de feature y el de patch; el merge a la rama estable y el tag siguen siendo de una persona.
- La historia de la rama, un commit por hito (apertura, uno por task, cierre; en un patch, fix y cierre), con su receta en `commit-milestones.md`.

## Opciones consideradas

- Que cada proyecto fije sus convenciones.
- Que el kit las fije y un proyecto se desvíe solo por escrito en su constitution.

## Decisión

El kit fija `.docs/sdd/` como raíz, el naming de carpetas, los ids por modo, la ubicación de los artefactos de release, los módulos por predicado observable, la política de merge declarada y la forma de la historia de las ramas. Cambiar cualquiera es un cambio mayor: spec dedicada y revisión de las skills afectadas.

### Consecuencias

- Las skills leen las convenciones sin preguntar; un proyecto que se desvía lo escribe en su constitution.
- La 0144 cambia la estructura (`steering/`, `changes/`) con una migración.

### Confirmación

`tests/NamingConvention.Tests.ps1`, `tests/TaskIds.Tests.ps1`, `tests/CommitMilestones.Tests.ps1` y `tests/ControlProfiles.Tests.ps1`.
