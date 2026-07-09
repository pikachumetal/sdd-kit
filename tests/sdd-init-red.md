# Evidencia RED — sdd-init-greenfield y sdd-init-brownfield (2026-07-09)

Dos baselines con Sonnet, sin skills del kit.

## Baseline greenfield (fixture-m: README de una línea, stack sin decidir, developer no disponible)

1. **Inventó el proyecto en vez de entrevistar**: 8 ficheros / 350 líneas de una tirada — alcance del MVP, rol Administrador, modelo de datos y validaciones decididos por el agente. Racionalización textual: *"convertí las preguntas que habría hecho una a una en asunciones explícitas documentadas"*. Marcarlo todo como "borrador pendiente" no mitiga: el volumen de suposiciones ancla las conversaciones futuras.
2. **Estructura propia en vez de la del equipo**: `docs/superpowers/specs/` (ubicación explícitamente prohibida por la convención), `docs/decisions/` con ADRs sueltos, `docs/glosario.md` — cero documentos de anclaje (mission/constitution/tech-stack/architecture/roadmap), sin plantillas, sin estimation.md/log.
3. **Contaminación**: la disciplina que sí mostró (no scaffolding, ADR de stack abierta) vino de las skills superpowers del entorno del tester, no de nada del proyecto.

Positivos: no generó código, no cerró la decisión de stack, listó preguntas abiertas, git init razonable.

## Baseline brownfield (fixture-n: código real + CLAUDE.md monolítico con 3 derivas plantadas)

1. **Gravedad natural hacia el monolito**: invocó el `/init` de Claude Code y reescribió TODO dentro de un único CLAUDE.md — cero `.docs/sdd/`, sin documentos de anclaje, sin plantillas, sin estructura SDD, pese a que el pedido era "empezar a trabajar con SDD".
2. **Deuda sin inventariar**: los hallazgos quedaron como "siguientes pasos sugeridos" dentro del CLAUDE.md, no como tabla de deuda en un roadmap.
3. **Sin gate de revisión**: sobrescribió el CLAUDE.md completo sin presentar nada a confirmación.

Positivos (¡importantes!): detectó las 3 derivas plantadas (web/ fantasma, xUnit inexistente, Migrations/ ausente), separó "verificado en código" de "heredado sin confirmar" y conservó las discrepancias de forma visible. **La honestidad no es el fallo; la estructura sí.**

## Conclusión

- Greenfield: la skill debe imponer el gate de entrevista (sin respuestas no hay documentos) y la estructura del equipo.
- Brownfield: la skill debe canalizar la honestidad existente hacia las capas (`.docs/sdd/` + CLAUDE.md de punteros), con constitution-como-propuesta, deuda al roadmap, cosecha del CLAUDE.md previo y prohibición explícita de `/init` (produce el monolito que la skill sustituye).
