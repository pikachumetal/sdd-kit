---
status: accepted
date: 2026-11-17
rutas:
  - .docs/sdd/**
  - PRODUCT.md
  - ROADMAP.md
  - CHANGELOG.md
  - skills/sdd-templates/**
  - skills/sdd-upgrade/references/migrations/**
  - cli/src/cli/layout.ts
  - cli/bin/session-start.js
---

# Documentos ubicados por lector, con una sola carpeta de artefactos

## Contexto y problema

Esta ADR sustituye a la [0034](0034-documents-by-reader-3.md) en una sola consecuencia: las carpetas de `specs/` se mueven a `changes/`. El resto de la decisión no cambia. Con la 0034, un proyecto migrado a la 3.0.0 tenía dos carpetas de artefactos vivas: `specs/`, con lo anterior, y `changes/`, con lo nuevo. El agente crea la carpeta de un cambio nuevo junto a la vecina que ve. La 0341 y la 0342 nacieron en `specs/` con la regla de `changes/` ya en su base, y en el proyecto de templates se mezclaban (dev-lead, 2026-11-17: «en templates ya se estaba liando»). La ADR 0005 fija el resto de convenciones de artefactos, ids y merge, que no cambian.

## Opciones consideradas

- Dejar `specs/` y bloquear en ella las carpetas nuevas: dos carpetas siguen vivas y el agente sigue copiando a la vecina.
- Mover `specs/` a `changes/` con una migración mecánica y reescribir las rutas de los `.md` que la enlazan.

## Decisión

Mover. En la raíz del proyecto, `PRODUCT.md` (para quién y para qué, y su terminología, compartido con impeccable), `ROADMAP.md` y `CHANGELOG.md`. En `.docs/sdd/`: `steering/` (`constitution.md`, `operations.md`, `architecture.md`, `estimation.md` y `debt.md`), `decisions/`, `capabilities/`, `changes/` y `releases/`. `sdd-kit.json`, `sdd-kit.local.json` y `kit-feedback/` no se mueven. La migración a la 3.0.1 mueve cada carpeta de `specs/` a `changes/` con `git mv`, en un commit solo de renombrados, y reescribe la ruta en los `.md` que la nombran, salvo en las copias de evidencia, que se mueven tal cual (dev-lead, 2026-11-17: «quería publicar 3.0.1 ya hoy con este sdd-upgrade»).

### Consecuencias

- Un proyecto en la 3.0.0 tiene una sola carpeta de artefactos tras «actualízame al kit», sin decidir nada carpeta a carpeta.
- La CLI sigue leyendo `specs/` hasta la 4.0.0, para un proyecto que aún no migró, y `sdd estimation log` cuenta una carpeta movida desde el commit que la creó en `specs/`.
- Las rutas de la evidencia del kit crecen 2 caracteres, y el tope de `path-length.test.ts` sube de 140 a 142.
- Un enlace relativo dentro de una copia de evidencia puede dejar de resolver: la evidencia no se reescribe.

### Confirmación

`cli/test/estimation/releases.slow.test.ts` cubre la carpeta movida; la «Verification» de `migrations/v3.0.1.md` comprueba que `specs/` no existe y que ningún `.md` fuera de la evidencia la enlaza; los tests de `cli/test/layout.test.ts` siguen cubriendo las dos estructuras.
