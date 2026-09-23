---
id: 20260923-102746-task-0006-task-verification
task: 0006
title: Verificación por task — qué se ejecuta y qué cuesta
mode: full
status: draft
created: 2026-09-23
author: agente
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Verificación por task: qué se ejecuta y qué cuesta

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: contrato público (`plan-template.md` lo calcan los proyectos)
- Dominio: si las cinco superficies cubren los proyectos del equipo y si leer «todo verde en cada task» como verificación de superficies respeta la constitution de un proyecto (señal: contrato público)
- Técnica: si el tope de 10 min y el lanzamiento en segundo plano encajan con el bucle de `subagent-driven-development` (señal: contrato público)
- Mínimo razonable: ninguna — el RED ya midió los tres frentes sobre un plan real y el GREEN los vuelve a medir

1. **Una constitution que pide «todo verde al cerrar cada task» se lee como la verificación de las superficies de esa task; el gate completo corre una vez, al cierre.** Motivo: en el proyecto de campo esa misma constitution existía y el dev-lead pidió lo contrario («si no has tocado db no lo lances»). Alternativa descartada: exigir una excepción de §1.9 en cada plan, que añade una parada por plan.
2. **Cinco superficies, lista cerrada**: BD · backend · frontend · tooling · docs. BD es migraciones, persistencia o dialecto SQL; tocar un servicio que usa la BD sin cambiar su acceso es backend.
3. **El umbral de «verificación lenta» es 10 min, fijo**: es el tope de un comando de la herramienta de shell de un subagente. No se hace configurable hasta que un proyecto lo pida.
4. **La verificación visual la hace el hilo principal**, en un navegador real (Playwright MCP o similar), después de la revisión de la task. Ni el implementador ni el revisor tienen por qué tener navegador, y el revisor ve un diff, no un render.
5. **Se sobreescribe una línea de superpowers**: `subagent-driven-development/implementer-prompt.md:48` («run the full suite once before committing») pide la suite completa en cada task. El kit la sustituye por la verificación de la task: fila en `overrides-superpowers.md` y sección `## Verificación` en la cabecera del implementador (`encargo-revision.md`), porque el artefacto gana a la prosa (T11).
6. **Todo va a la capacidad `task-flow`**, con cuatro requisitos ADDED. No hay capacidad nueva.
7. **RED previo a la spec** ([`red/`](red/)): dos sujetos Sonnet escribieron el plan de una spec fullstack con el kit de `develop`. Los tres frentes fallan 2/2: copian el gate completo (con una suite de SQL Server de 17–21 min) en «De código», que viaja a cada implementador; ninguno pide ver la UI en un navegador; los dos dejan la suite de 17–21 min al implementador. No va nada a deuda. Coste: 3,80 $ de un techo de 5 $, de los que 1,77 $ se perdieron en dos sujetos que arrancaron a la vez y no cargaron los plugins; desde entonces los sujetos se lanzan con 30 s de separación.

### Decisiones tomadas con el dev-lead

- Partir la 0006 en dos: esta se queda con la verificación por task y la 0036 (`parent: 0006`) recibe la de cierre — «Partir en dos (Recomendado)».
- RED previo a la spec con dos sujetos en paralelo y techo de 5 $ — «Sí, 2 sujetos, techo 5 $ (Recomendado)».

## Intent

El plan copia el gate de cierre del proyecto como obligación de cada task, y superpowers pide además la suite completa antes de cada commit del implementador. En campo, una suite de backend corrió unas 12 veces en una task de solo frontend y el dev-lead lo paró («si no has tocado db no lo lances»). Una suite de 17–21 min no cabe en el tope de 10 min de un subagente, y siete tasks de UI pasaron tests y revisiones con seis defectos que solo se ven en un navegador. Se quiere que cada task verifique lo que toca, a su coste, y que la UI se mire antes de darla por hecha.

## Scope

- Entra: superficies y verificación por task en el plan; gate de cierre una vez; verificación visual por task en frontend; verificación lenta en segundo plano por el hilo principal; la cabecera del implementador y el override de superpowers que lo hacen llegar al despacho.
- No entra: la verificación de cierre (evidencia por THEN, fallos provocados, artefacto real, duración de la suite, parar procesos arrancados), que es la 0036; paralelismo general dentro del plan (0022); modo lite, que no tiene plan (la cabecera del implementador en lite ya es deuda de la 0032).

## Approach

La verificación sale de lo que la task toca. Cada task del plan declara sus superficies, y de ellas sale su verificación: los comandos de esas superficies y ninguno más. El gate completo del proyecto deja de viajar en «De código» y pasa a la validación final, una vez, en el hilo principal. Dos campos opcionales por task cubren los dos casos que el gate no ve: la verificación visual, cuando la task cambia lo que se ve, y la verificación lenta, cuando un comando pasa del tope de un subagente. El paso 6 dice quién hace cada una y cuándo, y la cabecera del implementador lleva su verificación literal para que la línea de superpowers no la sustituya por la suite completa.

## Delta de comportamiento

### Capacidad: `task-flow`

**ADDED — Cada task del plan verifica solo sus superficies**
- GIVEN una spec aprobada cuyo cambio toca BD, backend y frontend, y un proyecto con una suite de BD distinta de la de frontend
- WHEN se escribe el plan
- THEN cada task declara sus superficies (BD · backend · frontend · tooling · docs) y una verificación con los comandos de esas superficies y ninguno más
- AND la suite de BD solo aparece en las tasks cuyas superficies incluyen BD (migraciones, persistencia o dialecto)

**ADDED — El gate de cierre se ejecuta una vez**
- GIVEN una constitution que pide el gate completo en verde al cerrar cada task
- WHEN se escribe el plan y se despacha una task de solo frontend
- THEN el gate completo aparece una sola vez, en la validación final, y lo ejecuta el hilo principal
- AND no aparece en «De código» ni en la verificación de esa task, y el encargo de su implementador le dice que ejecute su verificación y no la suite completa

**ADDED — Una task que cambia la UI se mira en un navegador**
- GIVEN una task con superficie frontend que cambia lo que se ve
- WHEN se escribe el plan y, después, cuando esa task termina su revisión
- THEN la task lleva una verificación visual con la pantalla o ruta, los estados y los temas que se miran y qué se mira en ellos (alineación, separación a bordes, contraste)
- AND no se da por terminada en `tasks.md` hasta que el hilo principal la ha visto en un navegador real; sin navegador disponible queda como «no probado», nunca sustituida por la suite

**ADDED — Una verificación de más de 10 minutos la lanza el hilo principal en segundo plano**
- GIVEN una task cuya verificación incluye un comando que tarda más de 10 minutos
- WHEN se escribe el plan y se despacha la task
- THEN la task declara ese comando y su duración como verificación lenta, el encargo del implementador le dice que no lo ejecute, y el hilo principal lo lanza en segundo plano mientras corre la revisión
- AND la task siguiente solo se despacha durante esa ejecución si no comparte ficheros con ella y su encargo prohíbe los comandos que compiten por los mismos binarios; si la verificación lenta falla, abre la ronda de fix de su task

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
