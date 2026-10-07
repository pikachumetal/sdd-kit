---
status: accepted
date: 2026-10-01
rutas:
  - .claude-plugin/plugin.json
  - skills/sdd-init-brownfield/references/migrations/**
  - skills/sdd-init-greenfield/**
  - .docs/sdd/changelog.md
---

# Versionado SemVer y una migración por release

## Contexto y problema

Los proyectos declaran en `sdd-kit.json` la versión del kit que tienen aplicada y «actualízame al kit» aplica las migraciones posteriores (T10, 2026-09-09). La 2.1.0 salió sin su fichero de migración y los proyectos se quedaron en 2.0.0 (feature 0109). En la task 0020, las claves de control solo las preguntaba la migración v1.2.0 y 0 de 7 sujetos de init las pidieron: un proyecto nuevo nace en la versión vigente y nunca pasa por esa migración (dev-lead, 2026-09-22). Hasta la 2.3.0 el número de versión se decidía sin criterio escrito.

## Opciones consideradas

- Migración solo en las releases que cambian algo del proyecto.
- Migración en toda release, con «sin cambios en el proyecto» cuando no hay pasos.

## Decisión

SemVer en `.claude-plugin/plugin.json`. Una release es mayor si tras ella un proyecto tiene que cambiar algo para seguir trabajando (una frase o un comando que deja de funcionar, un artefacto que cambia de forma, una migración con pasos además del marcador); si no, menor, o patch si solo arregla. Toda release lleva bump, entrada en el changelog y su `migrations/vX.Y.Z.md`. Toda pregunta o dato que añade una migración va también en las init, desde una sola fuente.

### Consecuencias

- Una release sin cambios en los proyectos escribe igualmente su migración vacía.
- En la 2.3.x, cada release revisaba la compatibilidad con la versión de superpowers instalada; con el fork (ADR 0009) pasa a revisar las versiones nuevas de todas las fuentes.

### Confirmación

`tests/MigrationInitParity.Tests.ps1` falla si la versión de `plugin.json` no tiene migración.
