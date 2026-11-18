# Capacidad — silence-watch

## Propósito

El vigía de silencio de cada subagente y de cada verificación lenta: cuándo avisa, qué dice, cuándo relanza y cuándo calla.

## Requisitos

### Una verificación de más de 10 minutos la lanza el hilo principal en segundo plano

- GIVEN una task cuya verificación incluye un comando que tarda más de 10 minutos
- WHEN se escribe el plan y se despacha la task
- THEN la task declara ese comando y su duración como verificación lenta, el encargo del implementador le dice que no lo ejecute, y el hilo principal lo lanza en segundo plano mientras corre la revisión
- AND la task siguiente solo se despacha durante esa ejecución si no comparte ficheros con ella y su encargo prohíbe los comandos que compiten por los mismos binarios; si la verificación lenta falla, abre la ronda de fix de su task

### Todo subagente y toda verificación lenta llevan su vigía de silencio

- GIVEN un proyecto con `"control": { "silence": { "betweenStepsMinutes": 8, "longCommandMinutes": 20 } }` en `sdd-kit.json`, y un plan Native con la implementación terminada
- WHEN el hilo despacha el revisor final de rama
- THEN en el mismo turno lanza en segundo plano `sdd watch subagent` sobre el transcript de ese revisor, y la orden no lleva ni 8 ni 20: los umbrales los lee el script
- AND lo mismo al despachar un implementador, un revisor de task, un fix wave o una re-revisión en SDD, un revisor de spec o la re-revisión del cierre
- AND la verificación lenta `Invoke-Pester tests/` la lanza en segundo plano el propio vigía, `sdd watch command -- Invoke-Pester tests/`, que guarda su salida y termina con `TERMINADO: Invoke-Pester tests/ salió con <rc>` en cuanto el comando sale, o con `SILENCIO:` si deja de escribir; `sdd watch command --path <fichero>` queda para un comando que ya corre

### El umbral del silencio depende de la herramienta que espera

- GIVEN `betweenStepsMinutes: 8` y `longCommandMinutes: 20`, y el transcript de un revisor final cuyo último evento es un `tool_use` de `Read` sin `tool_result`, escrito hace 8 min 30 s
- WHEN el vigía lo mira
- THEN termina con el aviso de silencio
- AND si el último evento es un `tool_use` de `PowerShell` con `Invoke-Pester` sin `tool_result`, escrito hace 15 min, no avisa; a los 20 min 30 s, sí
- AND con `betweenStepsMinutes: 5` en `sdd-kit.json`, el caso del `Read` avisa a los 5 min 30 s
- AND sin el bloque `control.silence` en `sdd-kit.json`, aplica 8 y 20

### El aviso de silencio dice qué hacía el subagente y cuánto gastó

- GIVEN el transcript del ticket: arranque a las 13:25:35Z, último evento a las 13:26:12Z, un `tool_use` de `Read` de `review-final-0f264440.diff` con `offset 500` y `limit 420`, sin `tool_result` ni `PreToolUse`, sin `PermissionRequest`
- WHEN el vigía avisa
- THEN el aviso da la hora del último evento (13:26:12Z), la herramienta y sus parámetros recortados (`Read`, `review-final-0f264440.diff`, `offset 500`, `limit 420`), «sin `PreToolUse`», «sin petición de permiso» y los tokens gastados desde el arranque

### Un subagente colgado se para, se relanza una vez y se cuenta sin que nadie pregunte

- GIVEN el perfil `delegate`, un revisor final despachado y el aviso de silencio del escenario anterior
- WHEN el aviso llega al hilo
- THEN el hilo para ese revisor y lo relanza una vez con el mismo encargo y un vigía nuevo
- AND en su siguiente mensaje le dice al usuario, sin que pregunte, qué se colgó, con el diagnóstico, y que lo ha relanzado
- AND registra el ruling `Cuelgue: revisor final, Read sin respuesta, 8 min, relanzado` en `tasks.md` (en Native, también en el ledger)
- AND si lo colgado es un implementador de SDD que dejó cambios sin commitear, el encargo del relanzado lista esos ficheros

### Un permiso pendiente o un segundo cuelgue no se relanzan

- GIVEN un aviso de silencio cuyo diagnóstico dice que hay un `PermissionRequest` pendiente
- WHEN el aviso llega al hilo
- THEN el hilo para el subagente, no lo relanza, le dice al usuario qué permiso esperaba y registra `Cuelgue: <tipo>, <herramienta> sin respuesta, <minutos> min, no relanzado: permiso`
- AND en `unattended`, la feature queda además `⏸️ aparcada: permiso pendiente de <herramienta>` al instante, como pide el tope de reintentos de la 0022 para un fallo de permisos
- AND GIVEN el revisor relanzado, que se vuelve a colgar · WHEN llega su aviso · THEN en `pair` y `delegate` el hilo lo para y pregunta al usuario cómo seguir, sin volver a relanzarlo; en `unattended`, la feature queda `⏸️ aparcada: cuelgue repetido del revisor final` y el agente sigue con la siguiente de la release

### Un subagente que termina no da falso aviso

- GIVEN un revisor final que devuelve su resultado a los 5 min del despacho, con `betweenStepsMinutes: 8`
- WHEN pasan 13 min desde el despacho
- THEN no ha llegado ningún aviso de silencio y su vigía ya no corre

### Sin transcript, el vigía lo dice

- GIVEN una sesión en la que no existe `subagents/agent-*.jsonl` para el subagente despachado
- WHEN pasan 2 min desde que se lanzó el vigía
- THEN el vigía termina con «sin transcript», y el hilo le dice al usuario que en esta sesión el vigía de silencio no funciona

### El vigía de una verificación lenta termina con su comando

- GIVEN `longCommandMinutes: 20`
- WHEN se ejecuta `sdd watch command -- node -e "setTimeout(()=>{},100)"` y el comando sale con 0
- THEN el vigía termina con `TERMINADO: node -e setTimeout(()=>{},100) salió con 0` y `salida: <ruta del log>`, y no escribe `SILENCIO:`
- AND con un comando que no escribe nada en 20 min 30 s, el vigía termina con `SILENCIO:` y el comando ya no corre
