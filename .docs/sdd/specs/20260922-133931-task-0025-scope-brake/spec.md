---
id: 20260922-133931-task-0025-scope-brake
task: 0025
parent: 0009
title: Freno de alcance en ejecución
mode: full
status: approved
created: 2026-09-22
author: agente
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-22
---

# Spec — Freno de alcance en ejecución

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: sin review. Señales contadas: una, `MODIFIED` (dos requisitos de `control-profiles`).
- Mínimo razonable: sin review. Queda sin mirar si el `MODIFIED` de «Salir del plan es un ruling visible» sigue dejando pasar los rulings internos sin parar. Lo cubre el escenario de control E5 del GREEN.

1. **Los cuatro frentes entran en la spec.** Los cuatro fallan 8 de 8 en el RED ([`red/README.md`](red/README.md)) y ninguno va a deuda.
2. **Un solo mecanismo: el gate de desvío de la 0008.** El tercer fix, la decisión que cambia la salida observable y la fila cambiada en la base se tratan **como un desvío**: en `pair` y `delegate` el agente para y pregunta; en `unattended` elige la opción conservadora y la registra como enmienda sin aprobar. La tabla de gates gana una fila, «Freno de alcance», y no un gate nuevo.
3. **El checkpoint salta en el 3.º fix y en cada tercero después (6.º, 9.º…).** Si salta una sola vez, «seguir» deja la puerta abierta al resto, que es lo que pasó en campo (seis fixes).
4. **Cuenta todo trabajo descubierto que se registra**, se arregle o se difiera. En E1 el sujeto 1 difirió solo, sin preguntar, y también falla: lo que se quiere es que decida el usuario.
5. **La salida observable es lo que ve o recibe quien usa el producto**: la respuesta de una API o de una CLI, el texto y el flujo de una UI, los ficheros generados y los nombres públicos (comandos, campos, rutas). Los nombres internos, la estructura y el orden de implementación siguen siendo rulings. Una definición cerrada, porque «defínelo» fue lo que funcionó con «validar» en la T11.
6. **La fila se compara entre la base de la rama y la rama de integración.** Se usa `git merge-base` contra `develop`, o contra la rama de integración que fije la constitution, con `git fetch` si hay remoto. No hace falta guardar en la spec la fila que se leyó: la rama nace antes que la spec, así que la base de la rama tiene la fila que se leyó.
7. **El solape de una enmienda solo se comprueba si el roadmap declara los ficheros** de cada task (la columna «Ficheros que toca»). Si no los declara, la enmienda lo dice: «solape no comprobable: el roadmap no declara ficheros». **No toco `roadmap-template`**: añadirle la columna es de la 0019, que ya es dueña de lo que crean las init. Lo anoto en su fila.
8. **El contador vive en el encabezado de «Fixes adicionales» de `tasks-template`**, no en un bloque de ayuda: la plantilla dice que los bloques de ayuda se borran al redactar, y el encabezado se queda (T4 y T5: el artefacto es guidance).
9. **`overrides-superpowers.md` gana media frase** en la fila de `subagent-driven-development`: los frenos de alcance paran igual que un desvío. Superpowers dice «Four things stop you, and only these»; sin esa línea, el kit contradice a la skill que invoca sin arbitrarlo (Art. IX, hueco demostrado en E1 y E2).
10. **La regla 6 del `CLAUDE.md` del repo** se alinea con `delegate`: para en la spec, en los desvíos y en la validación. La tomé yo y la aprobaste en el método.
11. **Solape de esta task con otras abiertas, aplicando la regla que añade:**
    - `control-profiles.md` y el paso 6: 0022 (⏳), 0026 (⏳), 0006, 0007 y 0021 (⏳), y 0005 (🧪).
    - `overrides-superpowers`: 0022 y 0026 (⏳).
    - `tasks-template` (`sdd-templates`): 0019 (⏳).

    Ninguna está en curso. El roadmap dice que la 0025 va primera, así que las demás integrarán sobre esta.
12. **GREEN**: los cuatro escenarios del RED más un control de no regresión.
    - E5: un ruling interno, sin salida observable, que tiene que seguir sin parar. Si los frenos nuevos hacen parar por todo, rompen la visión de `delegate`.
    - 2 sujetos Sonnet por escenario, unos 15 $.

### Decisiones tomadas con el dev-lead

- RED antes de la spec; un frente que no se reproduzca va a deuda como posible falso negativo, «no lo descartes sin mí» — «Método: RED antes de la spec, según tech-stack.md…»
- Método aprobado (primera pregunta implícita en el mensaje de arranque: task full, `delegate`, sin partir; RED en un turno a mitad del paso 6; corregir la regla 6 del `CLAUDE.md`) — «si, todo correcto, puedes seguir»

## Intent

En un proyecto real, una task triplicó su alcance: unas 10 h, unos 60 commits y seis fixes descubiertos, y cerró sin validar. El dev-lead dijo: «se ha ido tanto de madre que no puedo validar tantas cosas». Hoy el kit trata como ruling, sin parar, todo lo que no cambia la spec escrita. Eso incluye el tercer fix, el sexto y un atajo que cambia lo que el producto entrega. Además, no contrasta una enmienda con las otras tasks abiertas ni vuelve a leer la fila del roadmap después del gate de la spec. Se quiere que el agente pare y pregunte justo en esos cuatro puntos, y en ningún otro.

## Scope

- Entra:
  - checkpoint en el tercer fix descubierto (y en cada tercero después);
  - pregunta ante una decisión que cambia la salida observable;
  - lista de las tasks abiertas que declaran los ficheros de una enmienda;
  - comparación de la fila de la task en la base antes de cada despacho;
  - su conducta en los tres perfiles;
  - la regla 6 del `CLAUDE.md` del repo.
- No entra:
  - partir antes de firmar la spec (ya lo hace la 0008);
  - la columna «Ficheros que toca» en `roadmap-template` (0019);
  - integrar la base antes del cierre y del merge (0009);
  - tasks en paralelo dentro del plan y frenos de reintentos (0022);
  - detectar solapes con ramas `feature/*` que no están en el roadmap.

## Approach

Se extiende `control-profiles.md`. La sección «Desvío» pasa a nombrar los **frenos de alcance**: tres situaciones que no cambian la letra de la spec pero se tratan como un desvío. Además, la enmienda que añade ficheros tiene que listar las tasks abiertas que los declaran. La tabla de gates gana una fila. El paso 6 y la sección «Trabajo descubierto fuera de scope» de `sdd-start-task` enlazan esos frenos y no los copian. `tasks-template` lleva el contador en el encabezado de «Fixes adicionales». `overrides-superpowers.md` arbitra el «only these» de superpowers. Hay tests estructurales en `tests/ControlProfiles.Tests.ps1` y GREEN con sujetos.

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — El tercer fix descubierto abre un checkpoint de alcance**
- GIVEN una task en ejecución con dos fixes descubiertos ya registrados (en «Fixes adicionales» de `tasks.md` o como ruling de fix)
- WHEN aparece un tercer defecto fuera del plan, y después cada tercero (6.º, 9.º…)
- THEN antes de arreglarlo o diferirlo, en `pair` y `delegate` el agente para y pregunta con tres opciones: seguir en esta task, diferir a otra task (fila en el roadmap) o partir la task
- AND en `unattended` lo difiere a una fila nueva del roadmap, lo registra como enmienda sin aprobar y sigue

**ADDED — Una decisión que cambia la salida observable se pregunta**
- GIVEN una decisión de ejecución que la spec no fija y que cambia lo que ve o recibe quien usa el producto: la respuesta de una API o de una CLI, el texto o el flujo de una UI, los ficheros generados o los nombres públicos
- WHEN el agente o un subagente la tiene que tomar
- THEN en `pair` y `delegate` el agente para, la pregunta con sus opciones antes de despachar y no la registra como ruling; la respuesta entra en `## Enmiendas`
- AND en `unattended` elige la opción que deja la salida como la describe la spec o, si la spec calla, como está hoy, y la registra como enmienda sin aprobar

**ADDED — La fila de la task se compara con la base antes de cada despacho**
- GIVEN una task en ejecución con su fila en el roadmap
- WHEN el agente va a despachar la siguiente task del plan
- THEN compara la fila en la base de la rama (`git merge-base`) con la fila en la rama de integración
- AND si cambió, lo trata como posible desvío: en `pair` y `delegate` presenta el cambio y para; en `unattended` sigue con la spec aprobada y registra la fila nueva como enmienda sin aprobar

**MODIFIED — Un cambio a la spec aprobada es un desvío** (antes: sin contraste con otras tasks)
- GIVEN una spec aprobada y una ejecución en curso
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope o un «No entra»
- THEN en `pair` y `delegate` el agente para, propone el cambio como entrada de `## Enmiendas` en la spec y espera la aprobación
- AND en `unattended` elige la opción más conservadora, la registra como enmienda sin aprobar y, si no hay opción que no bloquee, aparca la task (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las tasks abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en «Ficheros que toca», o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, la fila de la task añade esos ficheros

**MODIFIED — Salir del plan es un ruling visible** (antes: todo lo que no cambia la spec es ruling)
- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal) y sin caer en un freno de alcance
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso o, si no queda ninguna, de la revisión final de rama
- AND la presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones

**Reglas de la capacidad**
- **Límites**: `control.maxParallelAgents` 3 y `control.silence` 8 y 20 minutos por defecto; su conducta la define la task 0005. Umbral para proponer partir una task: más de 3 tasks internas previstas. Checkpoint de alcance: en el 3.º fix descubierto de una task y en cada tercero después.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-22 | aprobada: «si» |
