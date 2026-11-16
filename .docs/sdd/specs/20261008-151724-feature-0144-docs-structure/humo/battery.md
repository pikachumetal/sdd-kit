# Humo de la 0144 — `sdd-templates` con la estructura 3.0.0

Un escenario por plantilla nueva, n = 1, Sonnet, molde `salas` pasado a la estructura 3.0.0 (`ROADMAP.md` y `CHANGELOG.md` en la raíz, `constitution.md` en `.docs/sdd/steering/`, artefactos en `changes/`, sin `tech-stack.md` ni `mission.md`). Pasa si se cumple el criterio de la columna «Esperado».

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| h1 | sdd-templates | Crea el documento de operaciones del proyecto (cómo se arranca y cómo se prueba) con la plantilla del kit. Rellénalo con lo que veas en el repo y no me preguntes nada. | salas-3.0.0 | existe `.docs/sdd/steering/operations.md` con `## Testing`, calcado de `operations-template.md` | 1 | 1/1 | sonnet | 0144, regla de rutas e índice |
| h2 | sdd-templates | Apunta como decisión de arquitectura (ADR) del proyecto que guardamos las reservas en un fichero JSON y no en una base de datos, porque la herramienta es local y de un solo usuario. Usa la plantilla del kit y no me preguntes nada. | salas-3.0.0 | existe `.docs/sdd/decisions/0001-*.md` y `sdd decision check` sale con 0 | 1 | 1/1 | sonnet | 0144, `adr-template.md` |
