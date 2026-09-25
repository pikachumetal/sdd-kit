---
id: 20260925-180248-feature-0036-closing-verification
feature: 0036
parent: 0006
title: Verificación de cierre, qué cuenta
mode: full
status: approved
created: 2026-09-25
author: Claude (Opus 5.5), por delegación del dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Verificación de cierre, qué cuenta

## Capacidades

- Modificadas: `task-flow` — la validación del paso 7 (evidencia por THEN, THEN de fallo provocado, procesos parados, vía de validación desde la base), la verificación visual (cómo se para lo arrancado), el cierre de una task Native y la forma del walkthrough
- Modificadas: `estimation` — el log sigue leyendo los walkthroughs cerrados con la forma nueva de la verificación

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (dos requisitos de task-flow), contrato público (walkthrough.md lo lee Build-EstimationLog.ps1)
- Técnica: si la forma nueva de «4. Verificación» del walkthrough deja intacto el bloque «2. Tiempo y coste» que parsea el log (señal: contrato público)
- Mínimo razonable: ninguna — deja sin cubrir la lectura cruzada de los cinco cambios del paso 7; la cubre el repaso de coherencia y, al final, la revisión final de rama
```

1. **Review de spec: ninguna**, decidida por delegación sin preguntarla (2 señales de 8). El contrato del walkthrough lo protege un test Pester, no un revisor.
2. **Se parte de la fila en cinco tasks internas y no en features con fila propia**: el dev-lead eligió «seguir entera en la 2.0.0» (ver abajo). Orden por prioridad: la parada por PID o puerto va primera, y si el lunes 2026-09-28 no llega el resto, lo que falte sale como deuda de la 2.0.1 con su evidencia.
3. **Fuera: «una respuesta corta y ambigua del usuario se aclara antes de registrarla como validación»** (iniciativa del agente del ticket template 0016). Contradice la decisión del dev-lead del 2026-09-23, que ya está en el paso 7 y en `task-flow`: un «sí» sin detalle a la pregunta que pedía el detalle es validación y no se repregunta. Aplico esa decisión; no la reabro sin ti.
4. **Fuera: «suite completa una vez al cerrar»** de la visión 1.2.0: ya lo cumple el paso 6 desde la 0006 («El gate de cierre se ejecuta una vez», `task-flow`).
5. **«Parar por nombre» incluye filtrar por la línea de comandos** (`pkill -f`, `Where-Object CommandLine -match`), no solo `taskkill /IM`, `pkill node`, `killall` y `Stop-Process -Name`: en el RED, 2 de 15 sujetos pararon solo filtrando por `server.mjs`, que también casa con el servidor que el dev-lead tenga abierto del mismo proyecto. El criterio del dev-lead (ninguna tool call con `taskkill /IM`, `pkill node` ni `killall node`) queda como mínimo; el GREEN cuenta también el filtro por línea de comandos.
6. **La parada de procesos del paso 7 respeta `validation.startEnvironment`**: con `true`, el entorno queda arrancado para el guion y el guion dice su puerto y cómo pararlo. Hoy esa clave existe en `control-profiles.md` y en `sdd-config`, pero el paso 7 no la nombra; sin esta excepción, la regla nueva la pisaría (Art. II: la excepción lleva su escenario en el GREEN, `v8`).
7. **Evidencia por THEN con tres valores cerrados**: `suite`, `ejecución real`, `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`; con `suite` cuenta como cubierto por tests y el paso 7 lo dice así. Es la misma frontera que ya fija la verificación visual para la UI, extendida a toda interfaz.
8. **Umbral de la suite: 10 minutos**, el mismo que ya separa una «Verificación lenta» (`task-flow`). Por encima, el walkthrough lo apunta como deuda del proyecto en «4.3 Residuales». No añado clave de configuración: un valor que nadie ha pedido cambiar no la necesita.
9. **La vía de validación de un THEN que depende de la base va en la spec, como una línea `Se valida en:` bajo ese escenario** del delta, solo cuando el THEN depende de la rama de integración, del historial de git, del remoto o de un entorno que la rama no reproduce. Valores: `la rama` (omitible), `worktree con la base al día`, `validación post-merge con fecha`. El paso 7 la lee y prepara ese entorno en vez de improvisarlo.
10. **`task-done` solo con el commit hecho** va en el párrafo «En Native» del paso 6, no en la «Verificación visual». La instrucción del dev-lead decía «el 6 solo en la Verificación visual», pero la fila de la 0036 trae este frente (ticket 0061 §1) y ese es su único sitio. He comprobado que no choca con las olas en paralelo: la 0078 toca el paso 2 y la 0074 el frontmatter.
11. **Sin migración.** Los campos nuevos del walkthrough van en «4. Verificación», que `Build-EstimationLog.ps1` no lee: los walkthroughs cerrados se siguen leyendo igual, y lo prueba un test que pasa el script por la plantilla nueva rellena y por un walkthrough cerrado de la forma vieja.
12. **Campaña (Art. I), previsión declarada antes del primer sujeto: 15 sujetos y 12 $**, RED previo y GREEN incluidos.

    | Paso nuevo o cambiado | Texto | Escenario | Sujetos |
    | --- | --- | --- | --- |
    | Parar por PID o puerto, nunca por nombre | paso 6, «Verificación visual» + fila de racionalizaciones | RED: 15 streams de la 0077 (0 $) · GREEN: `v6`, `v7f` | 0 + 2 |
    | Parar antes del guion, salvo `startEnvironment` | paso 7 | RED: streams de la 0077 + `v7f`; la excepción, estructural (el paso 7 no nombra la clave) · GREEN: `v7f`, `v8` (excepción) | (v7f) + 2 |
    | Evidencia por THEN y THEN de fallo provocado | paso 7 + walkthrough 4.2 | RED: streams de la 0077 + `v7f` · GREEN: `v7f` | 1 + 2 |
    | Duración de la suite y umbral | paso 7 + walkthrough 4.1 y 4.3 | RED: 37 walkthroughs cerrados (0 $) · GREEN: `v7f` | (v7f) |
    | `task-done` solo con el commit hecho | paso 6, «En Native» | RED: `d1` · GREEN: `d1` | 2 + 2 |
    | `Se valida en:` en la spec y su uso en el paso 7 | `spec-template` + paso 7 | RED: `b1` · GREEN: `b1` (escritura); el uso en el paso 7 no se mide con sujeto: es leer una línea de la spec | 2 + 2 |
    | Build-EstimationLog con la forma nueva | `walkthrough-template` | test Pester | — |

    `v7f` es el `v7` de la 0077 con la verificación visual de la Task 2 ya hecha y registrada: en la 0077, 3 de 4 sujetos de `v7` pararon antes del guion por los defectos visuales, y el guion es lo que aquí se mide. Los sujetos web corren con un hook que deniega parar por nombre (`green/deny-kill.mjs`): la tool call queda en el stream y no tumba los MCP de las otras sesiones. Total: 5 del RED + 10 del GREEN = 15, sin reserva. Si la revisión final pide más sujetos, paro y decides tú.

### Decisiones tomadas con el dev-lead

- Alcance: la fila entera en la 2.0.0, sin partir — «Seguir entera en la 2.0.0» (2026-09-25, a la propuesta de partir en patch + 2.0.1)
- Spec aprobada por delegación — «Apruebo spec por delegación» (opción «apruebo la spec por delegación, nos vemos en la validación», 2026-09-25)
- Método: lo decide el agente — «Me dejo recomendar en lo de método: decide tú y cuéntamelo al final» (2026-09-25)
- Campaña ampliada de 15 a 19 sujetos, techo de 12 $ sin cambios, para una tanda de REFACTOR de `b1` (0/2 en el GREEN) y `d1` (disparador ausente 2/2) — «Ampliar a 19 sujetos (Recomendada)» (2026-09-25)

## Intent

Hoy el agente arranca la aplicación para mirarla y la para como puede: de 15 sujetos de la 0077 que levantaron un servidor, 5 mataron todos los procesos de un ejecutable de la máquina, 2 filtraron por la línea de comandos y 2 lo dejaron arrancado. En la sesión del dev-lead eso tumbó el MCP de Playwright. Además, «verificado» mezcla lo que pasó la suite con lo que el agente vio funcionar: un THEN de error se da por visto porque hay un test, y un THEN que solo se observa con la base al día se descubre al validar. Se quiere que el agente pare solo lo suyo, que la validación diga de dónde sale cada THEN, y que el ledger de Native no dé por hecha una task sin commit.

## Scope

- Entra: parar lo arrancado por PID o por puerto (paso 6, «Verificación visual», y paso 7); parar antes del guion salvo `validation.startEnvironment: true`; evidencia por THEN con `suite` · `ejecución real` · `no probado` y THEN de fallo provocado (paso 7, walkthrough 4.2); duración de la suite con umbral de 10 min (walkthrough 4.1 y 4.3); `task-done` solo con el commit hecho (paso 6, «En Native»); `Se valida en:` en la spec para un THEN que depende de la base (spec-template, paso 7); test de `Build-EstimationLog.ps1` con la forma nueva y la vieja.
- No entra: aclarar una respuesta corta del usuario (decisión 3); la suite completa una vez (decisión 4); matar procesos huérfanos que el agente no arrancó; cambiar `tests/headless/`; migración.

## Approach

Guía en el punto de uso: cada regla va en el paso que produce la salida (la parada en la frase que arranca la aplicación, la evidencia en la forma del paso 7, la vía de validación en el delta de la spec). La parada es una regla de disciplina, con fila en la tabla de racionalizaciones (Art. II); la evidencia por THEN es una receta de forma, con los valores cerrados en el paso 7 y en la tabla 4.2 del walkthrough. La compatibilidad del walkthrough con el log la prueba un test, no una migración.

## Delta de comportamiento

### Capacidad: `task-flow`

**MODIFIED — El trabajo se valida con el usuario antes de cerrar**

- GIVEN una feature con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-feature` presenta, empezando por «Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice en su paso, con la comprobación que sí se puede hacer. Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección

**ADDED — El agente para lo que arrancó por su PID o su puerto**

- GIVEN la feature 0012 con su web levantada por el agente con `PORT=4656 node server.mjs` para la verificación visual o para el smoke, y otros procesos `node` en la máquina (el MCP de Playwright, el servidor del dev-lead)
- WHEN el agente termina de usarla
- THEN la para por el PID que guardó al arrancarla o por el proceso que escucha en el puerto 4656
- AND ninguna tool call la para por el nombre del ejecutable (`taskkill /IM node.exe`, `pkill node`, `killall node`, `Stop-Process -Name node`) ni por un patrón de su línea de comandos (`pkill -f server.mjs`, filtrar `CommandLine`)

**ADDED — El guion de pruebas empieza con el entorno parado, salvo que la persona lo quiera arrancado**

- GIVEN la validación del paso 7 de la feature 0012, con la web levantada por el agente en el puerto 4656
- WHEN el agente presenta el guion de pruebas sin `validation.startEnvironment` en `.docs/sdd/sdd-kit.local.json`, o con `false`
- THEN antes de presentarlo ha parado lo que arrancó, y el guion empieza por cómo arrancarla
- AND con `validation.startEnvironment: true`, la deja arrancada, y el guion dice en qué puerto está y cómo pararla

**ADDED — Una task Native no se da por completa sin su commit**

- GIVEN la Task 1 de un plan Native, cuya «Verificación» (`node --test tests/slot-format.test.js`) pasa, y un pre-commit que corre la suite y rechaza el commit porque `tests/import.test.js` falla
- WHEN el agente cierra la task
- THEN no ejecuta `task-done` ni escribe la línea `Task 1: complete` mientras `HEAD` siga en la base de la task
- AND lee el mensaje del hook y arregla la causa antes de volver a commitear

**ADDED — Un THEN que solo se observa con la base al día declara cómo se valida**

- GIVEN la fila 0012 «`npm run check:changed` … si la rama no cambia ninguno, escribe «Nada que comprobar» y sale con 0», cuyo THEN negativo no se puede observar desde `feature/0012`, porque la rama siempre cambia `scripts/check-changed.mjs`
- WHEN el agente escribe la spec
- THEN bajo ese escenario escribe `Se valida en: worktree con la base al día` (o `validación post-merge con fecha`)
- AND en el paso 7 prepara ese entorno y lo da en el guion, en vez de pedir al usuario que se lo monte

**ADDED — El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite**

- GIVEN una feature cerrada con `sdd-end-feature`
- WHEN se escribe «4. Verificación» del walkthrough
- THEN «4.1 Builds» lleva la suite completa con su comando, su resultado y su duración
- AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

### Capacidad: `estimation`

**ADDED — El log lee igual los walkthroughs de antes y de después de la evidencia por THEN**

- GIVEN un walkthrough cerrado con la tabla 4.2 vieja (`| # | Caso | Resultado |`) y otro con la forma nueva (fila por THEN con evidencia y duración de la suite en 4.1)
- WHEN se ejecuta `Build-EstimationLog.ps1`
- THEN los dos dan su fila con el mismo tipo, estimación, esfuerzo real, tokens y coste que declara su bloque «2. Tiempo y coste», sin aviso

## Enmiendas

- _Ninguna_

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «Apruebo spec por delegación» |
