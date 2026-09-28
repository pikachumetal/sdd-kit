---
id: 20260928-173846-feature-0095-silence-watch
feature: 0095
title: El vigía de silencio detecta un subagente colgado sin que nadie pregunte
mode: full
status: approved
created: 2026-09-28
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-28
---

# Spec — El vigía de silencio detecta un subagente colgado sin que nadie pregunte

> **Estado**: approved.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `feature-flow` — cómo se lanza, se vigila y se trata un subagente o una verificación lenta en segundo plano (requisitos nuevos).
- Modificadas: `control-profiles` — la regla «Límites» deja de remitir la conducta de `control.silence` a otra task.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (regla «Límites» de control-profiles), área no explorada (encargo-revision.md y paso 9 de sdd-end-feature, sin leer enteros) · tamaño: ~250 líneas en 11 ficheros (script y tests ~170, texto ~80)
- Técnica: si el formato del transcript que lee el script (tool_use, tool_result, PreToolUse, PermissionRequest, usage) está en los transcripts reales de esta máquina (señal: área no explorada)
- Mínimo razonable: ninguna — la comprobación técnica la hace el Pester del script contra una fixture con la forma de un transcript real de esta máquina, sin su contenido (un transcript lleva datos del proyecto), y la revisión final de rama lee el script entero
```

1. **El script vive en `skills/sdd-templates/scripts/Watch-SubagentSilence.ps1`**, junto a `Measure-SessionTokens.ps1`, y comparte con él la búsqueda de la carpeta de configuración y de `subagents/agent-*.jsonl`, sin copiarla: el Art. X prohíbe la duplicación.
2. **El script lee los umbrales de `sdd-kit.json`**, y sin la clave aplica el default de la tabla de `control-profiles.md` (8 y 20). Ningún `SKILL.md` ni ninguna referencia escribe esos números en una orden: el agente del ticket se inventó 300 s porque nada se los daba.
3. **Mira el transcript cada 30 s.** El intervalo no se configura: un minuto de error sobre 8 no cambia nada.
4. **Un subagente que termina apaga su vigía**: el script sale sin aviso cuando el transcript trae el turno final del subagente, y además el hilo lo para al recibir el resultado. Sin esto, un revisor que terminó a los 5 min daría un falso cuelgue a los 13.
5. **Al relanzar un implementador que dejó cambios sin commitear**, el encargo del relanzado los lista (`git status --short`) y le dice que parta de ellos o los descarte con motivo. El hilo no los borra por su cuenta.
6. **El registro del cuelgue** es un ruling con esta línea: `Cuelgue: <tipo de subagente o comando>, <herramienta> sin respuesta, <minutos> min, <relanzado | no relanzado: permiso | parado: segundo cuelgue>`. En SDD va en `tasks.md`; en Native, en el ledger y en `tasks.md`.
7. **La regla vive en un solo sitio**: una sección «Vigía de silencio» en `control-profiles.md`, que sustituye las dos remisiones a la task 0022 (L143 y L178). El paso 6 de `sdd-start-feature` lleva la orden («tras cada despacho, lanza el vigía») y enlaza la sección. Los demás puntos de despacho remiten a ese paso con una frase.
8. **Sin transcript no hay vigía, y se dice.** Si a los 2 min del despacho el script no encuentra el transcript (otro harness, o una ruta que cambió), sale con el mensaje «sin transcript» y el hilo le dice al usuario que en esta sesión el vigía no funciona. No se sustituye por otra cosa.
9. **Se corrige `mission.md`**: «nunca relanza a ciegas» pasa a «relanza una vez tras leer el último evento», que es lo que decidiste. Si no, la visión contradice la conducta.
10. **Repaso de coherencia**: la fixture del Pester no copia un transcript real, porque lleva datos del proyecto. Lo corregí en el bloque de review. Al contrastar con la fila 0022, faltaba el permiso pendiente en `unattended`: aparca al instante, como dice la 0022 («permisos o entorno aparca al instante»). El relanzamiento único es el reintento propio del cuelgue y no adelanta el tope general de reintentos, que sigue en la 0022.
11. **Campaña (Art. I), previsión**: conducta nueva, así que la campaña es completa. Son cinco escenarios, con 2 sujetos por escenario en RED y 2 en GREEN, más 2 de control (la comprobación del tipo `effort-<nivel>` antes del primer despacho, en el paso 6, que la guía nueva bordea). Total: **22 sujetos en Sonnet** (lanzamiento de `tech-stack.md`), **~2,5 h y ~13 $**. Techo: 28 sujetos o 18 $; si se supera, paro y decides tú. Escenarios:
    - s1: Native, despacho del revisor final.
    - s2: SDD, despacho de un implementador.
    - s3: verificación lenta en segundo plano.
    - s4: llega el aviso de silencio sin permiso pendiente.
    - s5: llega el aviso con permiso pendiente, y un segundo cuelgue en `delegate` y en `unattended`.

    El RED de s4 y s5 se simula con la salida del vigía pegada como notificación, porque un cuelgue real no se reproduce a voluntad.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil `delegate` del proyecto; sin aprobación delegada: la spec se para en el gate — «Full, delegate (Recomendada)».
- Qué cubre cada clave: el umbral lo decide la herramienta que espera el subagente, 20 min (`longCommandMinutes`) si es un comando de shell y 8 min (`betweenStepsMinutes`) para todo lo demás — «Sí, por herramienta (Recomendada)».
- Qué hace el hilo: diagnostica, para y relanza una vez; no relanza si esperaba un permiso; un segundo cuelgue para y pregunta en `pair` y `delegate`, y aparca en `unattended` — «te diria la 1 pero me preocupa que este en una tarea realmente complicada y qu eeste tardando por algo… hoy qu ese me quedo algo enganchado 25min vimos que habia gastado unos pocos miles d etokens .. claramente no estaba haciendo nada». La preocupación la cubre la definición de silencio: una tarea difícil que avanza escribe y gasta tokens, y el diagnóstico lleva los tokens gastados.
- Alcance: todo subagente y toda verificación lenta, en Native y en SDD por igual — «Sí, en los dos (Recomendada)».
- Mecanismo: un script del kit en segundo plano, que sale con el diagnóstico y avisa una vez — «Script del kit (Recomendada)».

## Intent

`sdd-config` pregunta `control.silence.betweenStepsMinutes` y `control.silence.longCommandMinutes`, y las init y la migración los escriben en `sdd-kit.json`. Ninguna skill los lee, porque `control-profiles.md` remite su conducta a la task 0022, que sigue pendiente. En un proyecto real, un revisor final estuvo 26 min sin escribir su transcript tras 30 s de trabajo. Nada avisó, y el agente le dijo al dev-lead que era normal sin mirar. Se quiere que el hilo se entere solo cuando un subagente o una verificación lenta se cuelga, con los umbrales de `sdd-kit.json`, y que actúe sin esperar a que el usuario pregunte.

## Scope

- Entra:
  - Crear `skills/sdd-templates/scripts/Watch-SubagentSilence.ps1` y `tests/Watch-SubagentSilence.Tests.ps1`.
  - Extraer de `skills/sdd-templates/scripts/Measure-SessionTokens.ps1` la búsqueda de transcripts que comparten los dos scripts.
  - `skills/sdd-start-feature/SKILL.md`: en el paso 6, la orden de lanzar el vigía tras cada despacho y tras lanzar la verificación lenta, y qué hacer con su aviso. El paso 7 despacha la re-revisión «con la regla del paso 6».
  - `skills/sdd-start-feature/references/control-profiles.md`: sección «Vigía de silencio», que sustituye L143 y L178.
  - `skills/sdd-start-feature/references/encargo-revision.md`, §Revisor final: el despacho del revisor final de Native lleva su vigía.
  - `skills/sdd-start-feature/references/review-spec.md`, §3: el revisor de spec lleva su vigía.
  - `skills/sdd-end-feature/SKILL.md`, paso 9: la re-revisión del cierre lleva su vigía.
  - `skills/sdd-config/SKILL.md`, pregunta 5: la columna de recomendación deja de decir «su conducta la define la task 0022».
  - `.docs/sdd/mission.md`: la frase de los frenos (decisión 9).
  - `.docs/sdd/roadmap.md`: la fila 0022 pierde el vigía de silencio y conserva el paralelismo y los reintentos.
  - Campaña: `tests/silence-watch-red.md` y `tests/silence-watch-green.md`.
- No entra:
  - El paralelismo dentro del plan, el tope de agentes en paralelo y el tope de reintentos por tipo de fallo: siguen en la 0022.
  - La causa del cuelgue del ticket: el vigía no depende de ella.
  - Los comandos en primer plano: ya los corta el timeout del harness.
  - La herramienta `Monitor`: caduca a los 30 min.
  - Harnesses sin transcript de subagentes: el vigía lo dice y no hace nada más (decisión 8).
  - Claves nuevas en `sdd-kit.json`, y por tanto la migración.
  - `sdd-start-patch` y `sdd-end-patch`: no despachan subagentes.

## Approach

Tras despachar un subagente, el hilo lanza en segundo plano `Watch-SubagentSilence.ps1` sobre el transcript de ese subagente. Tras lanzar una verificación lenta, lo lanza sobre su fichero de salida. El script lee los umbrales de `sdd-kit.json` y mira la última escritura cada 30 s:

- Si el último evento es un `tool_use` de `Bash` o `PowerShell` sin `tool_result`, aplica `longCommandMinutes`.
- Si es cualquier otro, aplica `betweenStepsMinutes`.
- En un fichero de salida de comando, aplica `longCommandMinutes`.

Si se supera el umbral, termina con el diagnóstico, y el harness despierta al hilo con un único aviso. Si el subagente acaba, termina sin aviso. Con el aviso, el hilo sigue la sección «Vigía de silencio» de `control-profiles.md`: para, relanza una vez salvo permiso pendiente, avisa al usuario y registra el ruling. Si el relanzado se vuelve a colgar, para y pregunta, o aparca en `unattended`.

## Delta de comportamiento

### Capacidad: `feature-flow`

**ADDED — Todo subagente y toda verificación lenta llevan su vigía de silencio**
- GIVEN un proyecto con `"control": { "silence": { "betweenStepsMinutes": 8, "longCommandMinutes": 20 } }` en `sdd-kit.json`, y un plan Native con la implementación terminada
- WHEN el hilo despacha el revisor final de rama
- THEN en el mismo turno lanza en segundo plano `Watch-SubagentSilence.ps1` sobre el transcript de ese revisor, y la orden no lleva ni 8 ni 20: los umbrales los lee el script
- AND lo mismo al despachar un implementador, un revisor de task, un fix wave o una re-revisión en SDD, un revisor de spec o la re-revisión del cierre
- AND al lanzar la verificación lenta `Invoke-Pester tests/` en segundo plano, lanza el vigía sobre el fichero de salida de ese comando

**ADDED — El umbral del silencio depende de la herramienta que espera**
- GIVEN `betweenStepsMinutes: 8` y `longCommandMinutes: 20`, y el transcript de un revisor final cuyo último evento es un `tool_use` de `Read` sin `tool_result`, escrito hace 8 min 30 s
- WHEN el vigía lo mira
- THEN termina con el aviso de silencio
- AND si el último evento es un `tool_use` de `PowerShell` con `Invoke-Pester` sin `tool_result`, escrito hace 15 min, no avisa; a los 20 min 30 s, sí
- AND con `betweenStepsMinutes: 5` en `sdd-kit.json`, el caso del `Read` avisa a los 5 min 30 s
- AND sin el bloque `control.silence` en `sdd-kit.json`, aplica 8 y 20

**ADDED — El aviso de silencio dice qué hacía el subagente y cuánto gastó**
- GIVEN el transcript del ticket: arranque a las 13:25:35Z, último evento a las 13:26:12Z, un `tool_use` de `Read` de `review-final-0f264440.diff` con `offset 500` y `limit 420`, sin `tool_result` ni `PreToolUse`, sin `PermissionRequest`
- WHEN el vigía avisa
- THEN el aviso da la hora del último evento (13:26:12Z), la herramienta y sus parámetros recortados (`Read`, `review-final-0f264440.diff`, `offset 500`, `limit 420`), «sin `PreToolUse`», «sin petición de permiso» y los tokens gastados desde el arranque

**ADDED — Un subagente colgado se para, se relanza una vez y se cuenta sin que nadie pregunte**
- GIVEN el perfil `delegate`, un revisor final despachado y el aviso de silencio del escenario anterior
- WHEN el aviso llega al hilo
- THEN el hilo para ese revisor y lo relanza una vez con el mismo encargo y un vigía nuevo
- AND en su siguiente mensaje le dice al usuario, sin que pregunte, qué se colgó, con el diagnóstico, y que lo ha relanzado
- AND registra el ruling `Cuelgue: revisor final, Read sin respuesta, 8 min, relanzado` en `tasks.md` (en Native, también en el ledger)
- AND si lo colgado es un implementador de SDD que dejó cambios sin commitear, el encargo del relanzado lista esos ficheros

**ADDED — Un permiso pendiente o un segundo cuelgue no se relanzan**
- GIVEN un aviso de silencio cuyo diagnóstico dice que hay un `PermissionRequest` pendiente
- WHEN el aviso llega al hilo
- THEN el hilo para el subagente, no lo relanza, le dice al usuario qué permiso esperaba y registra `Cuelgue: <tipo>, <herramienta> sin respuesta, <minutos> min, no relanzado: permiso`
- AND en `unattended`, la feature queda además `⏸️ aparcada: permiso pendiente de <herramienta>` al instante, como pide el tope de reintentos de la 0022 para un fallo de permisos
- AND GIVEN el revisor relanzado, que se vuelve a colgar · WHEN llega su aviso · THEN en `pair` y `delegate` el hilo lo para y pregunta al usuario cómo seguir, sin volver a relanzarlo; en `unattended`, la feature queda `⏸️ aparcada: cuelgue repetido del revisor final` y el agente sigue con la siguiente de la release

**ADDED — Un subagente que termina no da falso aviso**
- GIVEN un revisor final que devuelve su resultado a los 5 min del despacho, con `betweenStepsMinutes: 8`
- WHEN pasan 13 min desde el despacho
- THEN no ha llegado ningún aviso de silencio y su vigía ya no corre

**ADDED — Sin transcript, el vigía lo dice**
- GIVEN una sesión en la que no existe `subagents/agent-*.jsonl` para el subagente despachado
- WHEN pasan 2 min desde que se lanzó el vigía
- THEN el vigía termina con «sin transcript», y el hilo le dice al usuario que en esta sesión el vigía de silencio no funciona

### Capacidad: `control-profiles`

**Reglas de la capacidad**
- **Límites**: `control.maxParallelAgents` 3 por defecto; su conducta la define la task 0022. `control.silence` 8 y 20 minutos por defecto: 20 (`longCommandMinutes`) si la llamada que espera el subagente es un comando de shell o si se vigila la salida de una verificación lenta, y 8 (`betweenStepsMinutes`) en cualquier otra espera; un subagente colgado se relanza una sola vez (requisitos de `feature-flow`). Umbral para proponer partir una feature: más de 5 tasks internas previstas, o 4 o 5 que tocan capacidades o superficies distintas o llevan migración; con 3 o menos, nunca. Checkpoint de alcance: en el 3.º fix descubierto de una feature y en cada tercero después.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-28 | aprobada: «Apruebo (Recomendada)» |
