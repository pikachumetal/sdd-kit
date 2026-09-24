---
name: sdd-init-brownfield
description: Usar cuando un proyecto con codebase existente quiere empezar a trabajar con SDD — "haz el onboarding", "documenta el proyecto para Claude", un proyecto llevado con vibe coding que quiere proceso. No para proyectos nuevos sin código (eso es sdd-init-greenfield).
---

# sdd-init-brownfield

## Overview

Onboarding de un codebase existente al flujo SDD: genera la documentación de anclaje en `.docs/sdd/` describiendo **el estado real, no el ideal**, y reduce el `CLAUDE.md` a punteros. No se detiene el desarrollo: la documentación mínima se crea hoy y crece con cada tarea.

**NO uses el `/init` de Claude Code**: genera el `CLAUDE.md` monolítico que esta skill sustituye.

## Predicado: ¿onboarding o migración?

Si **ya existe `.docs/sdd/`**, este proyecto no necesita onboarding: necesita **migrar** al kit instalado. Sigue [references/migrations/README.md](references/migrations/README.md) — lee `sdd-kit.json`, aplica en orden los `migrations/vX.Y.Z.md` que falten con sus gates, escribe el marcador al final — y **nada más**: ni inventario, ni cosecha, ni reglas de oro, ni reescribir `tech-stack.md`/`architecture.md`, ni tabla de deuda. El flujo de abajo es solo para proyectos sin `.docs/sdd/`; aplicarlo a un proyecto ya inicializado le mete artículos y diagnósticos que nadie pidió.

## Principios

- **Estado real, no ideal**: cada afirmación de los docs sale de VERIFICAR el código (manifests, estructura, patrones); lo no verificable se marca como tal. Documentar un ideal que el código no cumple desorienta al agente en cada tarea futura.
- **La constitution se propone, no se autodeclara**: las convenciones observadas en el código son PROPUESTAS que el usuario confirma o corrige, artículo a artículo.
- **Exploración barata**: en codebases medianos o grandes, delega la exploración en subagentes con modelos económicos (sonnet/haiku) — no quemes el contexto principal leyendo código.

## Flujo (crea un todo por paso)

1. **Inventario** — explorar el repo: stack real con versiones exactas (de los manifests: `.csproj`, `package.json`, `pom.xml`…), estructura de módulos, patrones observados, señales de deuda (duplicación, TODOs, documentación contradictoria, dependencias bloqueadas), y **scripts de entorno por worktree** (`env:*`, `worktree:*`, marcadores): si existen, son un contrato que hay que cosechar, no una nota de `tech-stack.md`.
2. **Cosecha del `CLAUDE.md` existente** (si lo hay, incluido uno generado por `/init`): cada afirmación se clasifica — verificada en el código → va al documento de anclaje que corresponda; no verificada → va a la lista de discrepancias para el usuario. Nada se pierde en silencio.
3. **Generar documento a documento, con gate de revisión** — **cada turno termina con una sola pregunta
   de esta lista o con un solo documento para aprobar**. Cada documento se presenta al usuario antes de
   darse por anclaje; si el usuario no está disponible, se entregan marcados **PENDIENTES DE REVISIÓN**,
   nunca como aprobados, y las preguntas quedan pendientes. Antes de la constitution, estas preguntas, en
   su orden:

   | # | Pregunta | Va a |
   | --- | --- | --- |
   | 1 | ¿Cómo se numeran las tasks: ids del gestor de tickets (`tracker`) o secuencia propia (`sequence`)? «No sé» deja `tracker` | `sdd-kit.json` (`ids.mode`) |
   | 2 | Perfil de control: pregunta 1 del [bloque de claves de control](../sdd-start-task/references/control-profiles.md#preguntas-de-las-claves-de-control), con su recomendación y su motivo | `sdd-kit.json` |
   | 3 | Solo si el repo tiene una rama de integración distinta de la estable: política de merge y push, preguntas 2 y 3 del mismo bloque, con esa rama, una por turno | `sdd-kit.json` |
   | 4 | Frenos: pregunta 4 del mismo bloque | `sdd-kit.json` |
   | 5 | Método de ejecución: pregunta 5 del mismo bloque | `sdd-kit.json` |
   | 6 | ¿Llevamos changelog? | `changelog.md` |
   | 7 | Solo si 6 es sí: ¿también novedades para el cliente? | `client-changelog.md` |
   | 8 | ¿Replica los patrones de otro proyecto? Si es sí, ¿cuál? (proyecto de referencia; «no» deja «no aplica») | constitution, «Convenciones» |

   Orden de generación y qué lleva cada documento: [generacion.md](references/generacion.md).
4. **Reglas de oro brownfield** — van a la constitution. Cuáles son: [generacion.md](references/generacion.md).
5. **Estructura** — `.docs/sdd/` completa. Sin carpeta `templates/`: las plantillas viven en el skill
   `sdd-templates`. El marcador `sdd-kit.json` incluye el campo `ids` y las claves de control que el usuario respondió
   (solo esas: «no sé» no escribe la clave). Además, `.claude/settings.json` con `"autoMemoryEnabled": false`
   (fusionado; si ya tiene `"autoMemoryEnabled": true`, pregunta antes de cambiarlo), `.gitignore` con los
   temporales de las herramientas y `estimation-log.md` generado con `Build-EstimationLog.ps1`, nunca a mano.
   `capabilities/` y `specs/` no se crean (git no versiona carpetas vacías), y las capacidades no se vuelcan
   aunque el usuario lo pida: crecen task a task.
   Detalle: [generacion.md](references/generacion.md).
6. **`CLAUDE.md` corto**: reescribirlo como punteros a los documentos + 3-5 reglas críticas. El contenido largo vive en los docs de anclaje, no aquí.
7. **Cierre**: resumen + discrepancias y preguntas del paso 3 pendientes de confirmar + siguientes pasos (skills de nivel 2/3 que capturen el conocimiento tribal: build, patrones backend/frontend).

## Red flags — STOP

- Estás copiando afirmaciones del `CLAUDE.md` viejo a los docs sin verificarlas en el código.
- Todo el contenido está quedando dentro del `CLAUDE.md` (monolito) en vez de en `.docs/sdd/`.
- La constitution declara convenciones que el usuario no ha confirmado, sin marcarlas como propuesta.
- Ibas a lanzar `/init`.
- La deuda encontrada queda en notas sueltas en vez de en la tabla del roadmap.

| Racionalización | Realidad |
| --- | --- |
| "El CLAUDE.md ya lo dice, lo reutilizo" | Los CLAUDE.md heredados mienten (versiones desfasadas, carpetas fantasma). Cada afirmación se verifica o se marca como discrepancia. |
| "Reescribo el CLAUDE.md mejor y listo" | Un monolito honesto sigue siendo un monolito: contexto enorme en cada conversación. Capas + punteros. |
| "El repo es pequeño, no necesito subagentes" | Correcto — la regla de subagentes aplica a codebases medianos/grandes. Lo que no cambia es la estructura del resultado. |
