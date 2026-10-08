---
status: accepted
date: 2026-10-08
rutas:
  - .docs/sdd/**
  - PRODUCT.md
  - ROADMAP.md
  - CHANGELOG.md
  - skills/sdd-templates/**
  - cli/src/cli/layout.ts
---

# Documentos ubicados por lector

## Contexto y problema

Hasta la 2.x, todo documento del proyecto vivía en `.docs/sdd/`: `mission.md`, `tech-stack.md`, `roadmap.md`, `changelog.md` y los artefactos en `specs/`. Las personas leen el roadmap, el changelog y el para qué del producto. El agente lee la constitution, las operaciones, la arquitectura y las capacidades. Juntos en una carpeta oculta, los primeros quedaban lejos de quien los lee y `tech-stack.md` hacía de cajón. impeccable lee además un `PRODUCT.md`, solo en la raíz, con el para quién y para qué del producto, que es lo mismo que `mission.md`. La propuesta 0131 (2026-10-07) fijó una pregunta por documento y la ubicación por lector. La ADR 0005 fija el resto de convenciones de artefactos, ids y merge, que no cambian.

## Opciones consideradas

- Dejar todo en `.docs/sdd/` (2.x): las personas buscan el roadmap en una carpeta oculta, y `PRODUCT.md` existiría dos veces.
- Todo en la raíz: el agente pierde una carpeta única que leer, y la raíz se llena de documentos que la persona no revisa.
- Por lector: `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md` en la raíz; lo que lee el agente en `.docs/sdd/` (`steering/`, `decisions/`, `capabilities/`, `changes/`, `releases/`).

## Decisión

Por lector. En la raíz del proyecto, `PRODUCT.md` (para quién y para qué, y su terminología, compartido con impeccable), `ROADMAP.md` y `CHANGELOG.md`. En `.docs/sdd/`: `steering/` (`constitution.md`, `operations.md`, que sustituye a `tech-stack.md` sin versiones, `architecture.md`, `estimation.md` y `debt.md`), `decisions/`, `capabilities/`, `changes/` (antes `specs/`) y `releases/`. `sdd-kit.json`, `sdd-kit.local.json` y `kit-feedback/` no se mueven. Las carpetas de `specs/` anteriores a la 3.0.0 se leen y no se mueven. La CLI busca cada documento primero en su ruta 3.0.0 y después en la 2.x, y avisa si existen las dos.

### Consecuencias

- Un proyecto en la 2.x sigue funcionando sin migrar: la CLI lee las dos estructuras.
- Hasta que las skills de la 3.0.0 se reescriban, siguen nombrando las rutas 2.x; la 0152 comprueba que no queda ninguna.
- `PRODUCT.md` lleva encabezados en inglés, porque impeccable los lee por su nombre, con el contenido en el idioma del proyecto.

### Confirmación

Los tests de `cli/test/layout.test.ts` y de cada verbo cubren las dos estructuras y las dos a la vez; `tests/AnchorTemplates.Tests.ps1` comprueba las plantillas y sus destinos en `sdd-templates`.
