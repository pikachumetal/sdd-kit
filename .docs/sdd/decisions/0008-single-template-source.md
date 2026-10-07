---
status: accepted
date: 2026-07-21
rutas:
  - skills/sdd-templates/templates/**
---

# Una sola fuente de plantillas

## Contexto y problema

Hasta la 0.2.0 cada proyecto instalaba una copia de las plantillas en su propia carpeta `templates/`, y las copias derivaban de las del kit: un artefacto nuevo se calcaba de la copia vieja y nadie se enteraba de los cambios.

## Opciones consideradas

- Copia de las plantillas en cada proyecto (vigente hasta el 2026-07-21).
- Plantillas solo en el skill `sdd-templates`, que las sirve al crear un artefacto.

## Decisión

Las plantillas canónicas viven solo en `skills/sdd-templates/templates/`. Ninguna copia, ni en este repo ni en los proyectos: al crear un artefacto se calca del skill `sdd-templates` (2026-07-21).

### Consecuencias

- Un proyecto sin el kit instalado no puede crear artefactos.
- Una variante de un artefacto (la spec en modo lite) es un bloque de la misma plantilla, no otra plantilla.

### Confirmación

`tests/AnchorTemplates.Tests.ps1` comprueba que las init calcan desde `sdd-templates`.
