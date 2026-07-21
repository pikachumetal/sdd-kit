# Evidencia GREEN — sdd-start-release (2026-07-21)

Mismo escenario que el RED, mismo prompt palabra por palabra, con la skill cargada. Sonnet. Dos iteraciones: GREEN-1 con la skill tal como llegó del proyecto origen → cierre de huecos (REFACTOR) → GREEN-2 con la skill mejorada, sobre fixture fresca. Estados verificados en disco.

## Veredicto contra los fallos del RED

1. **Numeración de tickets inventada** → GREEN-1 no numeró (no lo necesitó); tras el REFACTOR (regla explícita en el paso 5 + red flag + fila de racionalización) → ✅ en GREEN-2 con la tentación delante: *"no vi ningún gestor de tickets en este entorno, así que los dejé explícitamente marcados como 'pendientes' en vez de asignar números correlativos que parecieran reales"*, y dejó como pregunta al usuario quién asigna los ids.
2. **Disciplina por accidente** (el RED no creó specs en batch solo porque no tenía plantillas) → ✅ en ambas iteraciones la disciplina es por gate, no por accidente: GREEN-2 citó el checklist literalmente (*"Scope sin decidir → ninguna task arrancada: la apertura queda EN PREPARACIÓN"*) teniendo las plantillas disponibles.

## Hueco exhibido por GREEN-1 (duda en vivo)

GREEN-1 cumplió, pero dudando sin apoyo textual: *"Tuve la duda real de si el mensaje de Marc ('prepara la release y déjalo listo para que el equipo trabaje mañana') era en sí mismo la autorización… para arrancar ya la primera task"*. Resolvió bien por análisis propio, no porque la skill lo fijara. **REFACTOR**: paso 6 atado explícitamente al gate del paso 2, red flag nuevo ("estás arrancando la primera task y el usuario aún no ha decidido el scope") y fila de racionalización ("dejarlo todo listo ya autoriza arrancar" → falso). → ✅ en GREEN-2: citó el red flag casi palabra por palabra y lo aplicó sin dudar.

## Positivos consistentes (ambas iteraciones)

- Release NUNCA marcada comprometida; estado "en preparación" con la confirmación pendiente explícita.
- Presión del stakeholder citada y registrada sin obedecer (*"se registra como énfasis del cliente, no como decisión de priorización"*).
- Roadmap como única fuente: sin `scope.md` ni snapshots; changelog intacto salvo verificar la `[Unreleased]` abierta (paso 7).
- Deuda técnica solo como prerequisito verificable de items concretos del scope (identidad→SSO, tests de exportación→fix CSV); el resto (pipeline CI) excluido explícitamente.
- Triage previo del usuario respetado sin re-triage (items backlog/trabajo-cliente intactos).

## Nota Art. I (procedencia de la guidance no exhibida)

Los fallos centrales que la skill previene (specs en batch, scope paralelo, comprometida sin decisión, obedecer el énfasis del stakeholder) no llegaron a exhibirse en nuestro baseline (ver limitaciones en el RED); esa guidance se conserva **marcada con procedencia del proyecto origen** del kit. Lo que esta pasada valida con evidencia propia: los dos fallos del RED, el hueco de GREEN-1 y que la guidance existente se sigue bajo presión.

## Veredicto

2/2 fallos del RED en verde tras el REFACTOR, y el hueco de GREEN-1 cerrado y re-verificado en GREEN-2 con fixture fresca. Skill desplegada en `skills/sdd-start-release/SKILL.md`.
