# Capacidad — routing

Cómo entra una petición en lenguaje natural por el carril que le toca del kit, en un proyecto con `.docs/sdd/` y con superpowers instalado. Las cuatro salidas finas (consult, patch, lite, full) las decide después el paso 2 de `sdd-start-task`; esta capacidad cubre solo la primera skill que se invoca.

## Requisitos

### Una petición de trabajo entra por el kit, no por brainstorming

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una feature o un cambio con comportamiento sin nombrar ninguna skill («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido»)
- THEN la primera skill que se invoca es `sdd-kit:sdd-start-task`
- AND `superpowers:brainstorming` se invoca después, desde el paso 4 de `sdd-start-task`, nunca antes

### Un bug pequeño y determinista entra por el carril patch

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario reporta un bug acotado y pide arreglarlo
- THEN la primera skill que se invoca es `sdd-kit:sdd-start-patch`

### Una pregunta entra por consult

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pregunta cómo funciona algo, o si algo es posible
- THEN la primera skill que se invoca es `sdd-kit:sdd-consult`

### Una edición trivial no lleva ceremonia

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una edición sin comportamiento (un typo, un renombrado, un formato)
- THEN no se invoca ninguna skill del kit ni `superpowers:brainstorming`, y el cambio se hace directo

### El router solo existe donde hay SDD

- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el router, que nombra `sdd-start-task`, `sdd-start-patch` y `sdd-consult`

### Un patch cuyo fallo no se reproduce no se abre

- GIVEN una petición de patch (una fila de deuda, un ticket) cuyo fallo la investigación del paso 1 no reproduce sobre la base actual
- WHEN el agente termina la investigación
- THEN para: no crea rama ni carpeta, no escribe `patch.md` ni fix, y no reserva id
- AND si viene de una fila del roadmap, la deja re-medida según «Una re-medición que contradice una fila la reescribe» de [`roadmap`](roadmap.md), y lo dice al usuario

### En un patch manda el síntoma medido, no el predicho

- GIVEN una petición de patch cuyo ticket o fila predice un síntoma A, y una investigación del paso 1 que mide otro fallo B
- WHEN el agente fija el alcance del fix
- THEN el patch sigue con B: la sección de síntoma de `patch.md` recoge B como síntoma medido y dice en qué difiere de A, y el fix cubre B
- AND si no mide ningún fallo, no es este caso: se aplica «Un patch cuyo fallo no se reproduce no se abre»

## Historial

- 2026-09-22 — task 0014 — ADDED «Una petición de trabajo entra por el kit, no por brainstorming», «Un bug pequeño y determinista entra por el carril patch», «Una pregunta entra por consult», «Una edición trivial no lleva ceremonia», «El router solo existe donde hay SDD»
- 2026-09-24 — 20260923-214917-task-0053-fewer-stops — ADDED «Un patch cuyo fallo no se reproduce no se abre», «En un patch manda el síntoma medido, no el predicho»
