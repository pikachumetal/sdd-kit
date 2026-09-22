---
id: 20260922-154013-task-0029-release-replan
task: 0029
title: Replanificar la release en curso
mode: full
status: approved
created: 2026-09-22
author: Claude (hilo principal)
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-22
---

# Spec — Replanificar la release en curso

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: ninguna de la rúbrica (sin capacidad nueva, sin MODIFIED/REMOVED, una capacidad, sin datos ni dependencias externas)
- Mínimo razonable: ninguna — deja sin mirar la redacción del camino nuevo, que el GREEN pone a prueba con los mismos seis escenarios del RED
```

1. **Entran los cuatro frentes que fallan** ([RED](../../../../tests/release-replan-red.md), 6 sujetos, 5,26 $):
   - **E4**, la reserva no se publica: 6/6 dejan `roadmap.md` sin commit, y dos arrancan ya la task nueva.
   - **E3**, ids que chocan con una reserva de otra rama: 3/4.
   - **E2**, tocar una task en marcha: 3/6, dos de ellos editando su spec aprobada.
   - **E1**, meter trabajo en una task cerrada: solo falla con base vieja, 2/2 (0/4 con la fila visible en ✅). Por eso entra como «leer el estado real», no como regla sobre filas cerradas: con el estado delante, los sujetos ya no amplían una fila ✅.
2. **Fuera del scope, a deuda**: el triaje agrupado con tabla (punto 4 de la fila), porque 4/4 triaron en una pasada con destino por nota, como posible falso negativo; y reordenar las olas por ficheros calientes (punto 5), porque ningún escenario lo mide (Art. I).
3. **Lo nuevo para una task en marcha va a una task nueva con fila propia, dependiente de ella**, no a una «sección de entrada» que la task lea al integrar, como proponía la fila del roadmap. La sección de entrada exige que `sdd-end-task` o `sdd-start-task` la lean, y los dos son ficheros calientes de otras tasks (0009, 0015). La task nueva no necesita tocar ninguna otra skill, y 3 de los 6 sujetos del RED ya la eligieron solos.
4. **El id nuevo sale del máximo de todo lo leído**: el del script y los de los roadmaps de la rama de integración y de cada `feature/*` abierta. No se toca `Get-NextSddId.ps1`, que es fichero de la 0009 (allí está anotado que lea las ramas).
5. **La reserva se publica antes de nada**: un commit solo de `roadmap.md` en la rama de integración, hecho en el worktree donde esté sacada. Si no está en ninguno, en un worktree temporal de ruta corta. El commit va **antes** de arrancar cualquier task nueva. No hace falta un gate propio: publicar la reserva es parte de escribir el scope que el usuario ya decidió.
6. **Un camino, no una skill nueva**: una sección «Replanificar la release en curso» en `sdd-start-release/SKILL.md`, con su predicado (hay una sección de release abierta en el roadmap). Va en el `SKILL.md` y no en `references/`: en la 0013, una regla puesta en una referencia se leyó 0/2. `roadmap-fuente.md` no cambia.
7. **Capacidad**: se amplía `release-flow` con cuatro requisitos. Sin capacidad nueva.

### Decisiones tomadas con el dev-lead

- Carril task, modo full, perfil `delegate` y la task entera, sin partir — respuesta a la primera pregunta: «Sí, full + delegate (Recomendado)».
- RED con 2 sujetos por ronda, techo de 12 $ — «Sí, lánzalo (Recomendado)». Las rondas s y u se añadieron dentro de ese techo.
- Spec aprobada por delegación — «avanza hasta el end, que me voy con la bici, :D» (2026-09-22).

## Intent

El dev-lead reestructura la release a medida que trabaja: mete trabajo nuevo, parte tasks y mueve filas. `sdd-start-release` solo sabe **abrir** una release, y al replanificar con ella el agente trabaja sobre el roadmap de su worktree: amplía tasks cerradas en otra rama o en marcha, reutiliza ids que otra rama ya reservó y deja la reserva sin publicar. Así salieron en campo los errores de `82c2b53` y `f00195a` y los del ticket 0005 §1 y §2. Se quiere que replanificar parta del estado real del repo y publique la reserva antes de que nadie arranque la task nueva.

## Scope

- Entra: camino de replanificación en `sdd-start-release`: estado real (rama de integración y ramas `feature/*`), tasks en marcha intocables, ids sin choque, reserva publicada con un commit solo de roadmap.
- No entra: triaje agrupado con tabla; reordenar olas por ficheros calientes; cambios en `Get-NextSddId.ps1`, `sdd-start-task` o `sdd-end-task`; la sección de entrada para tasks en marcha.

## Approach

Una sección nueva en `sdd-start-release/SKILL.md`, con una checklist corta de cuatro pasos (estado real → proponer → reservar ids → publicar), sus red flags y la racionalización que mostró el RED. La apertura de release no cambia.

## Delta de comportamiento

### Capacidad: `release-flow`

**ADDED — Replanificar parte del estado real de la release**
- GIVEN una release en curso en el roadmap, con la rama de integración por delante del worktree del agente o con ramas `feature/*` abiertas
- WHEN el usuario pide meter trabajo en la release, partir, mover o crear tasks
- THEN antes de proponer nada el agente lee el roadmap de la rama de integración y el de cada rama `feature/*` abierta, no solo el de su worktree
- AND no amplía una task que esté cerrada (✅ o 🧪) en la rama de integración: el trabajo nuevo va a una task nueva

**ADDED — Una task en marcha no se toca al replanificar**
- GIVEN una task en marcha (con rama `feature/<id>` abierta o 🔄 en el roadmap)
- WHEN la replanificación trae trabajo de su tema
- THEN ni su fila ni su spec cambian: el trabajo va a una task nueva con fila propia que declara que va tras ella

**ADDED — Los ids nuevos no chocan con reservas de otras ramas**
- GIVEN `ids.mode: sequence` y una rama `feature/*` que reservó en su roadmap un id que la rama de integración aún no tiene
- WHEN la replanificación crea tasks
- THEN cada id nuevo es mayor que el que da `Get-NextSddId.ps1` y que cualquier id de los roadmaps leídos

**ADDED — La reserva se publica antes de arrancar**
- GIVEN un scope replanificado que el usuario ha decidido
- WHEN el agente escribe las filas en el roadmap
- THEN las publica en la rama de integración con un commit que solo toca `roadmap.md`, en el worktree donde está sacada (o en uno temporal de ruta corta si no está en ninguno)
- AND lo hace antes de arrancar ninguna de las tasks nuevas

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-22 | aprobada por delegación: «avanza hasta el end, que me voy con la bici, :D» |
