---
id: 20260927-165923-feature-0089-greenfield-init-template
feature: 0089
title: Sincronizar sdd-init-greenfield con init-template de sdd-project-template
mode: full
status: approved
created: 2026-09-27
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-27
---

# Spec — Sincronizar sdd-init-greenfield con init-template de sdd-project-template

## Capacidades

- Modificadas: `onboarding` — la entrevista de greenfield pregunta también qué queda fuera de alcance y qué términos del dominio se fijan; y se escribe el contrato de la init sobre un proyecto instanciado desde un template con marcadores.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (el marcador `<!-- sdd-template: pending -->` lo consume sdd-project-template), MODIFIED (dos requisitos de `onboarding`) · tamaño: ~30 líneas en 5 ficheros
- Dominio: si las dos preguntas nuevas cubren las secciones de mission que hoy nadie pregunta (señal: MODIFIED)
- Técnica: si el requisito «La init sobre un template completa solo lo marcado» describe lo que el RED observó y nada más (señal: contrato público)
- Mínimo razonable: ninguna — el delta es de dos filas de tabla y un requisito que documenta conducta medida; el repaso de coherencia lo hago yo
```

1. **Quién hace qué**: `sdd-init-greenfield` hace la entrevista y los documentos también sobre un template; `init-template` queda como **puente** en su repo: su paso 0 (¿hay marcadores?), invocar `sdd-init-greenfield` y su cierre (comprobaciones del template, línea de changelog, borrarse y commit). Es lo que el propio template ya prevé en `architecture.md` §4 y en la última sección de `init-template`. Descarto hacer de `init-template` un modo de greenfield: el kit tendría que conocer la carpeta y el cierre de un template concreto.
2. **Qué entrevista manda**: la lista de `sdd-init-greenfield`. Absorbe las dos preguntas de producto de `init-template` que no tenía —fuera de alcance (su 4) y términos del dominio (su 5)—, que pasan a ser la 4 y la 5 de greenfield; las demás se renumeran (reglas de producto 6–10, claves del kit 19, proyecto de referencia 20). Las otras doce de `init-template` ya están en greenfield.
3. **Qué plantilla es la fuente (Art. VIII)**: las de `sdd-templates`, también para los documentos que trae el template. Los `.docs/sdd/` del template son documentos de un proyecto, no plantillas: el template los calca de `sdd-templates` (secciones y cabeceras de tabla literales) con su contenido técnico. Hoy no lo hacen —roadmap con `| Id | Task | Estado |` y Patches con `| Id | Descripción | Estado |`, mission con secciones numeradas, reglas de producto en tabla—, y eso es lo que causa la forma incoherente del RED. **Se arregla en el template**, no con guía en el kit.
4. **Solo entra lo que falló en el RED** (Art. I). RED previo a la spec, 4 sujetos Sonnet sobre el template `angular-dotnet` de `develop` (`red/`):
   - **Falla, entra**: «Fuera de alcance» y glosario inventados en 3 de 4 sujetos, porque ninguna pregunta de greenfield va a esas secciones.
   - **Falla, se arregla en el template** (decisión 3): 1 de 4 reestructuró mission y roadmap a la plantilla del kit y 3 de 4 conservaron las tablas del template.
   - **Pasa, no se escribe guía**: no pregunta stack, ramas ni worktrees (4/4); no toca los documentos técnicos (4/4); conserva la `version` de `sdd-kit.json` y añade `ids` y las claves (2/2 de los que llegaron). El requisito ADDED lo documenta como contrato, sin texto nuevo en la skill.
   - **No atribuible, fuera**: 3 de 4 escribieron los documentos sin esperar la aprobación de cada uno. La petición daba todas las respuestas de golpe («tómalas como mías»), y el RED de la 0012, con las respuestas turno a turno, lo pasó 2/2. `.claude/settings.json` no se pudo medir: el modo headless bloquea `.claude/` también con `Edit(.claude/**)` permitido.
5. **Campaña (Art. I)**: previsión declarada antes del primer sujeto: RED de 2 sujetos, ~8 $; GREEN de ~2–4 sujetos, ~8 $; techo de 6 sujetos, 20 $ y 2,5 h. **Ajuste**: el RED necesitó 4 sujetos (el primer intento chocó con el permiso de `.claude/` y con rutas largas en el molde), con 5,22 $. El GREEN usa 2 sujetos con el mismo molde y la misma petición, ~3 $. Total previsto: 6 sujetos, ~8,5 $, dentro del techo. Los pasos que cambian: las filas 4 y 5 de la tabla del paso 1 (medidas en el GREEN) y la renumeración, que es mecánica (la cubren los tests Pester que citan números).
6. **El cambio en el template no entra en esta feature**: va en su repo y en su roadmap, y en su checkout hay una rama viva (`feature/0010b-verificacion-e2e`). Esta feature deja en el walkthrough el prompt para lanzarlo allí (rama `feature/init-template-bridge`): puente, documentos calcados de `sdd-templates` y su capacidad `template-contract`.
7. **Sin migración**: no cambia la estructura de `.docs/sdd/` de ningún proyecto existente, y las preguntas nuevas son de la entrevista de init, no datos que falten a un proyecto ya inicializado.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación en la primera pregunta, el 2026-09-27 — «Apruebo spec por delegación» (opción: «Apruebo la spec por delegación y nos vemos en la validación»).
- No generar más tickets para poder cerrar la 2.0.0 — «vamos a intentar no generar mas tikets de problemas para poder cerrar v2.0.0». El ticket de `sdd-feedback` del cierre no se escribe salvo que lo pida.

## Intent

Un proyecto instanciado desde `sdd-project-template` trae la documentación técnica completa y la de producto marcada con `<!-- sdd-template: pending -->`. Hoy la completa `init-template`, con su propia entrevista de 14 preguntas, mientras `sdd-init-greenfield` hace otra de 18 que no nombra el template. Hay dos entrevistas que divergen, y la de greenfield deja sin pregunta dos secciones de mission que acaban inventadas. Se quiere una sola entrevista, la del kit, con esas dos preguntas, y un contrato escrito que el template pueda usar para delegar.

## Scope

- Entra: `skills/sdd-init-greenfield/SKILL.md`: filas 4 y 5 nuevas en la tabla del paso 1, renumeración, «Las preguntas 6 a 10» y «en la 19».
- Entra: `tests/MigrationInitParity.Tests.ps1` (pregunta 18 → 20) y `tests/NativeDefault.Tests.ps1` (en la 17 → en la 19).
- Entra: `tests/init-over-template-red.md` y `tests/init-over-template-green.md` (evidencia).
- Entra: delta de `onboarding` (se fusiona al cerrar, con «pregunta 18 de greenfield» → 20).
- Entra: el prompt para el repo del template, en el walkthrough.
- No entra: guía de «modo sobre template» en la skill (el RED lo pasa sin ella); cambios en `sdd-init-brownfield`, `sdd-config` ni `estructura.md` (la pregunta 1 de `sdd-config` es suya, no de greenfield); ningún fichero del repo `sdd-project-template`; `migrations/`.

## Approach

Añadir las dos preguntas a la lista de greenfield, en el bloque de mission, y medir con el mismo molde del RED que la mission ya no las inventa. El contrato con el template se escribe en la capacidad `onboarding`, con lo que el RED observó. La forma de los documentos del template se corrige en su repo, calcándolos de `sdd-templates`.

## Delta de comportamiento

### Capacidad: `onboarding`

**MODIFIED — La entrevista fija las cinco reglas de producto** (antes: sin las preguntas de fuera de alcance y dominio)

- GIVEN una init greenfield o brownfield en su entrevista
- WHEN se cierra el bloque de producto
- THEN el agente ha preguntado por las cinco reglas por nombre (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) y la constitution propuesta lleva la sección «Reglas de producto» con las cinco: respondida, «pendiente» si el dev-lead no sabe, o «no aplica» si él lo dice
- AND una regla que difiere por capacidad se lista por capacidad dentro de su entrada
- AND el bloque de proceso ha decidido además el modo de ids del proyecto, que se escribe en `sdd-kit.json`
- AND en greenfield el agente ha preguntado qué queda fuera de alcance y qué términos del dominio se fijan, y las secciones «Qué es y qué no es» y «Dominio» de `mission.md` llevan la respuesta, o «pendiente» si el dev-lead no sabe: con el dev-lead diciendo «no sé» a las dos, ninguna de las dos secciones lista un término ni una exclusión que él no dijo

**MODIFIED — La constitution nombra el proyecto de referencia** (antes: «la pregunta 18 de greenfield»)

- GIVEN una init greenfield o brownfield en su entrevista
- WHEN el agente pregunta si el proyecto replica los patrones de otro, que es la pregunta 20 de greenfield y la 4 de brownfield
- THEN la constitution lleva en «Convenciones» la entrada «Proyecto de referencia» con la ruta o el repositorio que el usuario dé, o «no aplica» si responde que no

**ADDED — La init sobre un template completa solo lo marcado**

- GIVEN un proyecto instanciado desde un template cuyo `.docs/sdd/` trae `tech-stack.md`, `architecture.md` y `environments.md` completos, y `mission.md`, `roadmap.md` y secciones de `constitution.md` con `<!-- sdd-template: pending -->`, y un `sdd-kit.json` con `"version": "1.1.0"`
- WHEN el usuario lanza `sdd-init-greenfield`, directamente o desde la skill puente del template
- THEN la entrevista no pregunta stack, convención de ramas ni worktrees, y `tech-stack.md`, `architecture.md` y `environments.md` quedan sin cambios
- AND `sdd-kit.json` conserva `"version": "1.1.0"` y gana `ids` y las claves que el usuario respondió
- AND el contrato con el template es el texto `sdd-template: pending`: su posición y su número los decide el template

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-27 | aprobada por delegación: «Apruebo spec por delegación» |
