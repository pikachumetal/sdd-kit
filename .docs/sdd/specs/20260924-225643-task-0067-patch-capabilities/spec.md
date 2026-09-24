---
id: 20260924-225643-task-0067-patch-capabilities
task: 0067
title: El carril patch fusiona su delta de capacidad
mode: lite
profile: delegate
status: approved
created: 2026-09-25
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado (por delegación)
    approved_at: 2026-09-25
---

# Spec — El carril patch fusiona su delta de capacidad

## Decisiones que he tomado yo — valida estas

1. **El paso nuevo va en `sdd-end-patch`, no en `sdd-start-patch`.** El paso 2 decide y fusiona, y el `patch.md` recibe el delta en ese mismo paso. Así el cambio toca una sola skill y el cierre, que es donde `sdd-end-task` fusiona. Si el delta lo escribiera quien arranca el patch, habría que medir y cambiar dos skills.
2. **La salida corta no deja rastro**: si el patch solo devuelve el comportamiento a lo que la capacidad ya decía, no se escribe nada, ni la sección ni una línea de «sin delta». El caso habitual no paga ceremonia, que es lo que pediste. El precio es que no se puede auditar si alguien miró la capacidad o no.
3. **Predicado: existe `.docs/sdd/capabilities/`**, igual que los demás módulos opcionales. Sin carpeta, el paso no aplica.
4. **Un patch nunca crea una capacidad.** Si ninguna capacidad describe la pieza que cambió, lo dice en el mensaje final. La regla 2 de `capability-template.md` sigue igual: las crea la spec que las declara.
5. **La línea de historial usa la carpeta del patch**, con el mismo formato que las tasks: `- <fecha de cierre> — <carpeta> — <ADDED|MODIFIED|REMOVED> <título>`. `capability-template.md` pasa a nombrar también a `sdd-end-patch` donde hoy dice solo `sdd-end-task` (reglas 2 y 3 e «Historial»).
6. **Criba de los 14 patches desde el 2026-09-20.** Cambiaron comportamiento del kit instalado, y la capacidad no lo recoge, 8 patches en 4 capacidades: 0028 → `release-flow`; 0035 y 0038 → `task-ids`; 0037, 0051 y 0065 → `control-profiles`; 0056 y 0066 → `estimation`. Sin delta: 0017 (texto sin conducta), 0024 (README), y 0023, 0027, 0030 y 0043, que son tooling de este repo (tests, hooks, arranque de sesión) y no se instalan en los proyectos. Añado 0028 y 0037 a los seis del enunciado: `release-flow` no nombra el merge de vuelta, y `control-profiles` todavía dice que sin disparador la task sigue esperando, lo contrario de lo que hace el patch 0037.
7. **Choque con las tasks en paralelo**: la 0061 fusionará en `control-profiles.md` y la 0063 en `release-flow.md` al cerrar. Los requisitos que toco yo son otros, así que el choque se limita a las líneas de «Historial» y se resuelve al integrar. No toco los ficheros vetados (`skills/sdd-start-task/references/control-profiles.md`, las init, `migrations/`, `roadmap.md`, `sdd-end-release`). La 0063 conserva el merge de vuelta en su `sdd-end-release` (comprobado en `feature/0063`), así que el requisito ADDED de 0028 no caduca con ella.
8. **Campaña (Art. I), previsión y techo comunes para RED y GREEN**: dos escenarios, dos sujetos Sonnet por escenario y fase, 8 sujetos en total, ~6 $ y ~45 min. Techo: `SUBJECT_CAP=12` y `COST_CAP=9`, que dejan hueco para una tanda más de 4 (REFACTOR, o una tanda más si el RED sale limpio). El lanzador comprueba el fichero `stop`. Si el RED sale limpio, antes de recortar miro de dónde sacó cada sujeto la conducta: el E3 de la task 0003 salió limpio porque su petición decía que el fix cambiaba un requisito, y en campo nadie lo dice.
9. **Molde de campo**: el repo `salas` de la 0044, con `capabilities/bookings.md`. La petición es «el patch está aplicado y verificado, ciérralo», sin mencionar capacidades. `sdd-kit.json` va sin bloque `merge`, para que el sujeto no gaste turnos en fusionar.
10. **Sin review de la spec**: modo lite.

### Decisiones tomadas con el dev-lead

- Modo lite, perfil `delegate`, spec aprobada por delegación: «Lite, apruebo spec por delegación» (2026-09-25, primera pregunta).
- Las dos piezas entran en la 2.0.0; la pieza 2 es trabajo de docs, sin campaña (enunciado de la task, 2026-09-25).
- La fila del roadmap no la escribo yo: la escribe la 0061 al cerrar. Si al cerrar esta task la fila ya está en `develop`, la cierro; si no, lo digo en el mensaje final (enunciado de la task).

## Intent

El carril patch no tiene ningún paso sobre capacidades. Ni `sdd-end-patch` ni `patch-template.md` las nombran. Medido el 2026-09-25: 32 de 33 tasks desde el 20/09 llevaron delta de capacidad, y 0 de 14 patches. Ocho de esos patches cambiaron comportamiento sin reflejarlo, así que `capabilities/` ya no describe lo que hace el kit. La pieza (d) de la task 0003 lo preveía y el RED la recortó con un molde demasiado explícito. Se quiere que el cierre de un patch fusione el cambio de comportamiento cuando lo hay, sin cobrar ceremonia cuando no, y poner al día las capacidades con los patches ya cerrados.

## Scope

- Entra: sección opcional «Delta de capacidad» en `patch-template.md`; paso de capacidades en `sdd-end-patch` (con la renumeración de pasos y la mención en el commit de cierre); `capability-template.md` nombra el cierre de patch; evidencia `tests/sdd-end-patch-red.md` y `tests/sdd-end-patch-green.md`; fusión de los 8 patches de la criba en `release-flow`, `task-ids`, `control-profiles` y `estimation`, con una línea de historial por patch; changelog.
- No entra: `sdd-start-patch`, `sdd-end-task`, los ficheros de la 0061 y de la 0063, la fila del roadmap, los patches anteriores al 2026-09-20 y cualquier capacidad nueva.

## Approach

Pieza 1: RED con el kit de `develop` sobre dos escenarios de campo, el cambio de texto mínimo que ataque lo que el RED muestre, y GREEN con los mismos escenarios. Pieza 2: releer cada patch de la criba y su capacidad, y escribir el `MODIFIED` o `ADDED` con el comportamiento que dejó el patch, verificado contra el código actual del kit (un patch posterior puede haberlo cambiado otra vez).

## Delta de comportamiento

### Capacidad: `capabilities`

**ADDED — El cierre de un patch fusiona su delta**
- GIVEN un proyecto con `.docs/sdd/capabilities/bookings.md`, cuyo requisito «Consultar salas libres» dice que `salas libres 10-12` lista las salas sin reserva en esa franja
- WHEN se cierra con `sdd-end-patch` el patch 0014, cuyo fix hace que `salas libres 10-12` deje fuera las salas en mantenimiento y las liste aparte con `(en mantenimiento)`
- THEN `patch.md` lleva la sección «Delta de capacidad» con `MODIFIED — Consultar salas libres` y el bloque entero del requisito con el cambio
- AND `bookings.md` sustituye ese requisito y añade a «Historial» `- <fecha de cierre> — <carpeta del patch 0014> — MODIFIED Consultar salas libres`
- AND el cambio de `bookings.md` va en el commit de cierre del patch
- AND si ninguna capacidad describe la pieza que cambió, no se crea ninguna y el mensaje final lo dice

**ADDED — Un patch que devuelve el comportamiento a la capacidad no lleva delta**
- GIVEN `bookings.md` con la regla «Límites: una reserva dura como máximo 2 h»
- WHEN se cierra el patch 0013, cuyo fix hace que `salas reservar Norte 10-13` se rechace, como ya decía la capacidad
- THEN `bookings.md` no cambia y `patch.md` no lleva sección de delta ni línea de «sin delta»

### Capacidad: `release-flow`

**ADDED — El cierre devuelve el branch estable a la rama de integración** (patch 0028)
- El texto sale de `skills/sdd-end-release/SKILL.md` paso 7 en `develop`: tras el tag y su push, si el git-flow tiene rama de integración, merge de vuelta del branch estable a esa rama.

### Capacidad: `task-ids`

**MODIFIED — el requisito que describe las fuentes del cálculo del siguiente id** (patches 0035 y 0038)
- Hoy dice «los nombres de rama locales y remotos». Pasa a: el roadmap y las carpetas de `specs/` de todas las ramas, y el roadmap y `specs/` del disco de cada worktree. Texto exacto, del script de `develop`.

### Capacidad: `control-profiles`

**MODIFIED — el requisito de la validación diferida** (patch 0037)
- Hoy: sin disparador con dueño no hay diferido y la task sigue esperando. Pasa a: con el usuario presente y su frase de diferir, un disparador ausente o vago lo concreta el agente con el uso más próximo, con quien difiere como dueño, y lo dice en el mensaje final.

**MODIFIED o ADDED — la verificación del merge del cierre** (patches 0051 y 0065)
- La verificación del merge es el gate de merge de `tech-stack.md` (el conjunto rápido, si el proyecto separa). La suite completa corre antes, en la validación final. Si un hook rechaza el merge sin ficheros en conflicto, el script falla con `verificación: el hook rechazó el merge.` y la cola de su salida.

### Capacidad: `estimation`

**MODIFIED — la fecha de cada fila del log y el reparto por versión** (patch 0056)
- La fecha es la de cierre: la primera línea `created:` o `date:` del artefacto, con la de la carpeta como respaldo. El reparto por versión usa esa fecha.

**MODIFIED — el requisito de lectura tolerante del bloque de tiempo** (patch 0066)
- `min`, `mins` y `minuto(s)` se convierten a horas; `h`, `hora(s)` o sin unidad, como antes; otra unidad deja la celda vacía y avisa con el fichero.

> Los títulos exactos de los requisitos de `release-flow`, `task-ids`, `control-profiles` y `estimation` se toman de cada capacidad al fusionar: son la clave de fusión y la spec no los reescribe. El texto definitivo se contrasta con el código de `develop`.

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,75h
- Estimación de implementación: 2,5h (campaña ~1h de reloj, cambio de texto 0,25h, criba y fusión de 8 patches 1h, cierre 0,25h)
- Base de la estimación: la 0044 (patch en el molde `salas`, 12 sujetos) y las fusiones de capacidad de las tasks de la 2.0.0
- Confianza: media — la campaña puede pedir una tanda más

## Enmiendas

## Aprobaciones

- 2026-09-25 — dev-lead, por delegación: «Lite, apruebo spec por delegación» (respuesta a la primera pregunta de `sdd-start-task`). Review de spec: ninguna (modo lite).
