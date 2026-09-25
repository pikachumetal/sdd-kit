---
id: 20260925-144030-task-0077-playwright-visual-check
task: 0077
title: Verificación visual con Playwright, hecha por el agente
mode: full
status: approved
created: 2026-09-25
author: agente (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Verificación visual con Playwright, hecha por el agente

## Capacidades

- Modificadas: `task-flow` — la task que cambia la UI se mira en un navegador: cómo, cuándo, qué se enseña y cuándo queda «no probado»
- Modificadas: `control-profiles` — la opción de delegación de la primera pregunta ofrece parar para bajar la sesión a gama media

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (un requisito de `task-flow`). Una señal de ocho; la rúbrica no propone review. Con la spec aprobada por delegación, lo decido yo y lo registro aquí.

1. **El RED recorta la mitad del enunciado** (`tests/visual-check-red.md`). Con el MCP de Playwright en la sesión, 4 de 4 sujetos ya abrían la pantalla, medían estilos computados, sacaban capturas y lo hacían en el momento pedido: en `pair` antes de la parada, en `delegate` antes de la validación. Una medida que fallaba abría un fix en 4 de 4. Nada de eso lleva guía; el GREEN lo repite como control.
2. **Lo que entra es lo que falló**: sin el MCP, 0 de 2 probaron un script de Playwright y los dos declararon «no probado»; la captura llegó al usuario en 1 de 4, porque 3 la borraron al limpiar; y la variante de gama media, 0 de 2. Sin poder mirar, 4 de 4 dejaron «no probado» y ninguno dijo «verificado»: también se recorta. El escenario «sin forma de levantar la aplicación» no se deja reproducir aquí, porque los dos sujetos encontraron el SDK real de .NET por su ruta completa, y el GREEN no lo repite.
3. **Sin fichero auxiliar ni receta nueva.** Lo que falta cabe en la frase del paso 6 que ya pide mirar en un navegador, y en la presentación de los pasos 6 y 7. La plantilla del plan no cambia.
4. **El script como alternativa al MCP, con su contraejemplo** (Art. II): «no probado» vale solo sin navegador con el que ejecutar Playwright o sin forma de levantar la aplicación, dicho con el error concreto. No valen «el MCP de Playwright no está en la sesión», que se resuelve con un script del paquete `playwright`, ni «faltan dependencias», que se resuelve instalándolas. El GREEN mide `x4`, donde esa es la salida fácil.
5. **Qué se enseña**: antes del guion de pruebas, cada medida con su valor y el esperado, y la ruta de cada captura. Las capturas se guardan fuera de git hasta la validación y no se commitean: pesan y el walkthrough no las necesita.
6. **Pieza 5 con el matiz del dev-lead**: con la sesión en el modelo más capaz, la opción de delegación de la primera pregunta tiene la variante «…y paras antes de la Task 1 para que baje la sesión a gama media», con las tasks que prevé el agente y el motivo del paso 4. Con una sola task prevista no se ofrece, porque rehacer la caché al cambiar de modelo no compensa.
7. **El mismo matiz no se lleva a las ofertas de los pasos 4 y 5.** Queda como fila de deuda: medirlo ahí es otra campaña.
8. **El lanzador de referencia gana dos variables**, `SETTINGS` y `EXTRA_ALLOWED`, con su test en `tests/HeadlessLauncher.Tests.ps1`: hacían falta para lanzar sujetos con y sin el MCP de Playwright.
9. **Campaña (Art. I)**: previsión común de RED y GREEN, declarada antes del primer sujeto: 25 sujetos, ~30 $ y ~2 h de reloj, con techo de 30 sujetos y 36 $ que aplica el lanzador. El RED usó 12 sujetos y 5,31 $, dos de ellos repetidos por un molde defectuoso, y el GREEN lleva 11: 23 en total, con un coste muy por debajo, ~0,5 $ por sujeto. Pasos que el agente ejecuta y su escenario:

| Paso nuevo o cambiado | Escenario |
| --- | --- |
| Paso 2: variante de delegación con gama media y número de tasks | `q5` (tres tasks, la ofrece) · `q1` (una task, no la ofrece; solo GREEN) |
| Paso 6: script sin MCP, contraejemplo de «no probado», capturas conservadas; la parada de `pair` enseña medidas y capturas con el guion | `v6` · `x4` · control `c6` (en `delegate` no para; solo GREEN) |
| Paso 7: medidas y capturas antes del guion, o «no probado» con su motivo | `v7` · `x4` |
| Controles de lo que el RED ya cumplía: mirar con el MCP, medir estilos computados, el momento, arreglar una medida que falla; «no probado» sin «verificado», si algún sujeto no llega a mirar | `v6` · `v7` · `x4` |

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación en la primera pregunta — «Task full, delegate, y apruebo la spec por delegación, nos vemos en la validación» (2026-09-25).
- La pieza 5 entra, con su matiz — «Un matiz para que la pieza (5) de la 0077 lo haga bien: la oferta debería decir cuántas tasks quedan para que valga la pena, porque por una sola task corta no compensa el coste de rehacer la caché.» (2026-09-25, relayado por el dev-lead desde el hilo principal).

## Intent

El kit pide mirar en un navegador la task que cambia lo que se ve, pero no dice cómo. Con el MCP de Playwright a mano el agente ya mira, pero sin él se rinde a la primera, y lo que mira no siempre llega al usuario: una captura borrada no se valida. El dev-lead lo ha pedido varias veces: quiere validar mirando algo, no leyendo «los tests pasan». Además, quien delega la spec en la primera pregunta no ve la oferta de bajar la sesión a gama media, y el hilo es ~90 % del coste de una sesión.

## Scope

- Entra: el script de Playwright cuando falta el MCP; «no probado» con su contraejemplo; qué se enseña en la parada de `pair` y en la validación (medidas y capturas conservadas); la variante de gama media en la opción de delegación de la primera pregunta, con el número de tasks.
- No entra: lo que el RED ya cumplía (mirar con el MCP, medir, el momento, arreglar lo que falla), que queda como control; cambiar la plantilla del plan; tests E2E de Playwright en los proyectos; el matiz del número de tasks en las ofertas de los pasos 4 y 5; renombrar task a feature (es la 0064).

## Approach

Tres toques en `sdd-start-task`: el paso 2 (la variante de delegación), el paso 6 (el script sin MCP, el contraejemplo y lo que enseña la parada de `pair`) y el paso 7 (lo que enseña la validación), más la racionalización del caso sin MCP.

## Delta de comportamiento

### Capacidad: `task-flow`

**MODIFIED — Una task que cambia la UI se mira en un navegador**
- GIVEN una task con superficie frontend que cambia lo que se ve
- WHEN se escribe el plan y, después, cuando esa task termina su revisión
- THEN la task lleva una verificación visual con la pantalla o ruta, los estados y los temas que se miran y qué se mira en ellos (alineación, separación a bordes, contraste)
- AND el hilo principal la abre en un navegador real con Playwright —el MCP si está en la sesión, un script del paquete `playwright` si no—, mide en estilos computados cada cosa que el campo declara y saca una captura por estado y tema, que guarda fuera de git hasta la validación, antes de darla por terminada en `tasks.md`
- AND sin navegador con el que ejecutar Playwright o sin forma de levantar la aplicación, lo dice con el error concreto y la task queda «no probado» en lo visual, nunca «verificado» ni sustituida por la suite; «el MCP de Playwright no está en la sesión» y «faltan dependencias» no son ninguno de los dos

**ADDED — La verificación visual se enseña con medidas y capturas**
- GIVEN la task 0012 con el selector de estado, cuya «Verificación visual» declara `/` y `/?theme=dark`, contraste del texto y separación de la flecha al borde
- WHEN el agente para tras la task en `pair`, o presenta la validación del paso 7 en `delegate`
- THEN antes del guion de pruebas enseña cada medida con su valor y el esperado («texto del selector, oscuro · contraste · 7,9:1 · ≥ 4,5:1») y la ruta de cada captura
- AND una task que quedó «no probado» lo dice en ese sitio, con su motivo

### Capacidad: `control-profiles`

**MODIFIED — La primera pregunta confirma carril, modo y perfil**
- GIVEN una task que arranca con usuario presente
- WHEN el agente termina de leer el contexto
- THEN su primera pregunta, sola en su turno, confirma carril y modo, ofrece lite citando el predicado si se cumple y dice el perfil vigente con la opción de cambiarlo para esta task
- AND si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, la pregunta propone esa fila como enunciado
- AND en `pair` y `delegate`, una de sus opciones aprueba la spec por delegación con la frase «apruebo la spec por delegación, nos vemos en la validación»
- AND con la sesión en el modelo más capaz y más de una task prevista, otra opción aprueba igual y añade «…y paras antes de la Task 1 para que baje la sesión a gama media», con las tasks que prevé («prevé 3 tasks») y el motivo: en Native la sesión implementa todas las tasks y va bien en Sonnet con effort medium; con una sola task prevista no se ofrece, porque rehacer la caché al cambiar de modelo no compensa

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «Task full, delegate, y apruebo la spec por delegación, nos vemos en la validación» |
