---
id: 20261026-122254-feature-0211-session-clock-gaps
feature: 0211
title: El reloj de la sesión descuenta los huecos sin actividad y no toma por espera lo que no lo es
mode: lite
profile: delegate
status: done
created: 2026-10-26
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-26
---

# Spec — El reloj de la sesión descuenta los huecos sin actividad y no toma por espera lo que no lo es

🦆 Hoy el informe de una sesión cuenta mal las horas en tres casos. Una noche con la sesión cortada suma como trabajo: la 0209 da 10,62 h frente a ~2,9 h. Al revés, el resumen que la sesión escribe sola al compactarse se toma por un mensaje tuyo, y el trabajo de antes cuenta como espera: la 0208 pierde 1,8 h así. Y el aviso de una tarea en segundo plano que llega pegado a un mensaje tuyo hace que la espera a la tarea cuente como espera a ti. Con el cambio, la espera empieza solo cuando el agente cierra su turno y acaba cuando escribes; si el turno lo reabre el aviso de una tarea, es trabajo; y un hueco de más de una hora sin nada en marcha sale de la cuenta, y la línea lo dice: «sin 9,75 h sin actividad (1 hueco)».

## Capacidades

- Modificadas: `estimation` — la medida del esfuerzo real: cuándo empieza y acaba una espera, y el descuento nuevo de los huecos sin actividad

## ✋ Decisiones que he tomado yo — valida estas

1. **Umbral de 60 min**, el ejemplo de la fila: un hueco de más de 60 min entre dos entradas seguidas, con el turno del agente abierto y sin herramienta en curso, no cuenta. Un comando en primer plano no pasa de 10 min, y un subagente en primer plano es una herramienta en curso: no se descuenta.
2. **Cierre de turno**: una respuesta del agente con `stop_reason` `end_turn` o `stop_sequence`. En los transcripts de este repo hay 205 `end_turn`, 5 `stop_sequence` y 3.943 `tool_use`. El `stop_sequence` es el «No response requested.» que Claude Code escribe al retomar una sesión cortada.
3. **Herramienta en curso**: una llamada cuyo `tool_result` llega después en el transcript. Una llamada sin resultado (sesión cortada a media herramienta) no cuenta como en curso. Si contara, una caída de luz a media herramienta dejaría la noche como trabajo.
4. **La cola de la línea**: `, sin <h> h sin actividad (<n> hueco|huecos)`, en horas con dos decimales como el resto de la línea, y solo si hay al menos un hueco. Así las líneas ya pegadas en walkthroughs y patches no cambian. La fila escribía «sin 9 h sin actividad».
5. **`--json`**: `real` gana `idleMinutes` e `idleGaps`, siempre presentes (0 sin huecos). Es aditivo: ningún lector de `real` se rompe.
6. **Sin doble descuento**: un hueco dentro de una espera cuenta solo como espera. Una pregunta pendiente es una herramienta en curso, así que no hay hueco sin actividad dentro de ella. La espera de un turno cerrado no se mira por huecos: acaba en espera o en trabajo entero.
7. **El hueco que acaba en una notificación de tarea cuenta como trabajo aunque pase de 60 min**: hubo una tarea en segundo plano corriendo todo el rato. La 0208 tiene uno de 133 min, de las 07:33 a las 09:46.
8. **El resumen de una compactación** (`isCompactSummary`) no es un mensaje tecleado. Es la causa de la 0208, y salda el menor diferido de la 0188 («no excluye `isCompactSummary`»).
9. **Corrección de dos diagnósticos del roadmap**, medidos con un script sobre los transcripts reales:
   - **0208**: «nos vemos en la validación» llegó encolado a mitad de turno y nunca fue una entrada de usuario. Lo que restó 1,8 h fueron dos resúmenes de compactación en reposo (08:28 y 11:26), tomados por mensajes tuyos tras dos turnos cerrados esperando a los sujetos: 55 y 54 min. 4,7 − 2,99 = 1,71 h.
   - **0210**: de los 178 min en 8 esperas, solo 47 son el caso (c): 12 y 35 min de dos turnos cerrados esperando la suite, con «se colgó el pc» 25 s y 1 s después del aviso de la tarea. Los otros 131 min son esperas reales: 93 min en la pregunta de aprobación de la spec, 23, 19, 2 y 1 min en otras preguntas, y 10, 1 y 2 min en mensajes tuyos.
10. **La 0185 y la 0149 no se pueden medir**: sus transcripts ya no están en `~/.claude/projects`. La noche de la 0209 tiene la misma forma que la 0185, con una interrupción y la sesión retomada al día siguiente, y es el caso del escenario.
11. **Prueba del delta**: `sdd capability merge` sobre una copia de `.docs/sdd` → sustituido «La sesión mide el esfuerzo real sin las esperas al dev-lead», añadidos los tres requisitos nuevos y la regla «Límites» sustituida, exit 0.
- Política de modelos: ninguno. Lite, sin revisores de la spec, sin sujetos y sin despachos en paralelo; la revisión final sigue `sdd-verify` en lite.

### Decisiones tomadas con el dev-lead

- Carril lite y no patch: tres fallos son tres tests, y el umbral y la línea estaban abiertos — opción «Lite (Recomendada)», 2026-10-26
- La espera empieza cuando el agente cierra su turno, no en cualquier entrada suya; un hueco por encima de un umbral (p. ej. 60 min) sin herramienta en curso no cuenta como trabajo, y la línea lo dice; el hueco que acaba en una `task-notification` cuenta como trabajo — «Decisiones ya tomadas» del prompt de arranque y fila 0211 del roadmap

## Intent

`sdd session tokens` da el `Esfuerzo real` que el walkthrough y el patch pegan tal cual, y del que sale la calibración del `estimation-log`. Hoy la espera va de la última entrada del agente, sea cual sea, al siguiente mensaje tecleado. Por eso, en tres casos medidos, el log recibe desviaciones falsas: +250 % en la 0185, 10,62 h frente a ~2,9 h en la 0209, 2,99 h frente a ~4,7 h en la 0208. El éxito es que los tres casos de la sección «Dónde se prueba» den el esfuerzo de trabajo real. El cambio fracasaría si descontara trabajo real (un subagente largo, una tarea en segundo plano) o si cambiara la línea de las sesiones sin huecos.

## Scope

- Entra: el reloj de `cli/src/session/clock.ts` (cierre de turno, notificación de tarea, resumen de compactación, huecos sin actividad); la línea de `cli/src/session/format.ts` y el `real` de `--json` en `cli/src/session/measure.ts`; los casos en `cli/test/session/clock.test.ts`; la línea de ejemplo de `walkthrough-template.md`.
- No entra: el desglose por fase (fila 0192); la sesión en otra máquina (resto de la fila de la 0202); recalcular los esfuerzos ya pegados en walkthroughs y patches cerrados; los mensajes encolados, que no son entradas de usuario y ya no cuentan.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| AND «el hueco entre una llamada a `AskUserQuestion` y su resultado es una espera; cualquier otro resultado de herramienta, una notificación del harness o una entrada `isMeta` no abre ni cierra una espera» | `capabilities/estimation.md:170` | delta, `MODIFIED`: la espera abre con el cierre de turno y la notificación de tarea la cierra como trabajo |
| GIVEN «cuya entrada anterior del agente es de las 12:40 y de las 13:28» | `capabilities/estimation.md:168` | delta, `MODIFIED`: «un turno del agente que se cierra a las 12:40» |
| `--json` `real` sin `idleMinutes` ni `idleGaps` | `capabilities/estimation.md:173` | delta, `MODIFIED` |
| Línea de ejemplo `- Esfuerzo real: … (<n> esperas)` | `skills/sdd-templates/templates/walkthrough-template.md:26` | Scope: gana la cola opcional `[, sin <h> h sin actividad (<n> huecos)]` |
| Línea pegada «tal cual» | `skills/sdd-templates/templates/patch-template.md:73`, `skills/sdd-archive/SKILL.md:34` | sin cambio: no fijan la forma de la línea |
| **Límites** de la capacidad | `capabilities/estimation.md` §Reglas | delta: gana el umbral de 60 min |
| Nota de la línea «Esfuerzo real» (`se pega tal cual …, y deja fuera las esperas`) | `skills/sdd-templates/templates/walkthrough-template.md:26` | recortada sin quitar instrucción para que la cola quepa en el tope del kit (91300 palabras, sin margen): ruling del ledger |

- Filas que implementa: 0211 → `roadmap.md:24`, la fila se cierra en el archive · deuda «cuenta como esfuerzo una noche sin actividad» (0185/0149, `roadmap.md:121`), «cuenta como trabajo una noche de interrupción» (0209, `:160`), «descuenta como espera el trabajo que sigue a un mensaje … que no pide respuesta» (0208, `:486`), «cuenta como espera al dev-lead la espera a una tarea en segundo plano» (0210, `:494`) → saldadas en el archive · parciales: «El esfuerzo real medido se queda corto…» (`:478`, queda: la sesión de otra máquina) y «Menores diferidos de la feature 0188» (`:480`, el de `isCompactSummary`) → marca parcial en el archive. Comprobado con `grep -n "session tokens\|isCompactSummary\|0211" .docs/sdd/roadmap.md`.

## Approach

El reloj recorre las entradas del transcript en orden, con dos estados:

- **Turno cerrado**: lo abre una respuesta del agente con `end_turn` o `stop_sequence`. Un mensaje tecleado lo cierra como espera, del cierre al mensaje. Una notificación de tarea lo cierra como trabajo. Lo demás (compactación, `isMeta`, otras etiquetas del harness) no lo cierra.
- **Turno abierto**: un mensaje tecleado no abre ni cierra nada. Cada hueco entre dos entradas seguidas de más de 60 min, sin herramienta en curso y que no acaba en una notificación de tarea, se descuenta como hueco sin actividad.

Las preguntas con `AskUserQuestion` siguen como hoy: espera de la llamada a su resultado. `Esfuerzo real` = reloj − esperas − huecos. Las fixtures de transcript van en línea en `clock.test.ts`, como las de hoy.

## Dónde se prueba

- Los cuatro escenarios del delta: por el verbo, `run(['session', 'tokens', …])` con transcripts escritos por el test, como los de `cli/test/session/clock.test.ts`.
- La fixture de hoy (`firstSession`) gana el `stop_reason: end_turn` en la respuesta de las 12:40 y da la misma línea de 0,82 h.
- El transcript largo de `clock.slow.test.ts` no cambia: 5,56 h.

## Términos y ADR

- Términos resueltos: **hueco sin actividad** — más de 60 min entre dos entradas seguidas del transcript, con el turno abierto y sin herramienta en curso; **cierre de turno** — respuesta del agente con `end_turn` o `stop_sequence`.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `estimation`

**MODIFIED — La sesión mide el esfuerzo real sin las esperas al dev-lead** (antes: "cuya entrada anterior del agente es de las 12:40 y de las 13:28")
- GIVEN un worktree con un transcript que empieza a las 12:26 en `develop`, pasa a `feature/0181` a las 12:40 y termina a las 13:35, con un turno del agente que se cierra a las 12:40 y el usuario contesta a las 12:58, y una pregunta del agente a las 13:28 que el usuario contesta a las 13:30
- WHEN se ejecuta `sdd session tokens --path <worktree> --branch feature/0181`
- THEN la cuarta línea es `- Esfuerzo real: 0,82 h — reloj de la sesión 1,15 h desde 2026-10-14T12:26Z, sin 20 min de espera al dev-lead (2 esperas)`
- REMOVED AND el hueco entre una llamada a `AskUserQuestion` y su resultado es una espera; cualquier otro resultado de herramienta, una notificación del harness o una entrada `isMeta` no abre ni cierra una espera
- AND una espera va del cierre de turno del agente (una respuesta con `stop_reason` `end_turn` o `stop_sequence`) al siguiente mensaje tecleado, o de una llamada a `AskUserQuestion` a su resultado; un mensaje tecleado con el turno abierto no abre ni cierra una espera
- AND el resumen de una compactación (`isCompactSummary`), una entrada `isMeta` o una etiqueta del harness no es un mensaje tecleado: no abre ni cierra una espera
- AND con dos transcripts de la rama, el reloj suma los dos, el inicio es el del más antiguo y la línea dice `reloj de 2 sesiones`
- AND un transcript sin ninguna respuesta de la rama pedida no cuenta
- AND `--json` lleva `real: { measured: true, hours: 0.82, clockHours: 1.15, start: "2026-10-14T12:26Z", waitMinutes: 20, waits: 2, idleMinutes: 0, idleGaps: 0 }`
- AND `sdd estimation log` lee esa línea como real 0,82 en un walkthrough y en §5 de un `patch.md`

**ADDED — La espera a una tarea en segundo plano es trabajo**
- GIVEN un transcript de la rama donde el agente cierra el turno a las 10:00, la siguiente entrada es una notificación de tarea (`<task-notification>`) a las 10:18, el usuario escribe a las 10:19 y el agente trabaja hasta cerrar a las 10:30
- WHEN se ejecuta `sdd session tokens --branch <rama>`
- THEN la línea dice `sin 0 min de espera al dev-lead (0 esperas)` y el esfuerzo real es el reloj entero
- AND si la notificación llega 133 min después del cierre del turno, el hueco también es trabajo

**ADDED — La compactación no cierra la espera de un turno**
- GIVEN un transcript de la rama donde el agente cierra el turno a las 07:33 esperando una tarea en segundo plano, Claude Code compacta la conversación a las 08:28 (una entrada `isCompactSummary`), la notificación de la tarea llega a las 09:46 y el agente trabaja hasta cerrar a las 10:00
- WHEN se ejecuta `sdd session tokens --branch <rama>`
- THEN la línea dice `sin 0 min de espera al dev-lead (0 esperas)` y `reloj de la sesión 2,45 h`, con esfuerzo real 2,45 h

**ADDED — La sesión descuenta los huecos sin actividad**
- GIVEN un transcript de la rama donde el agente trabaja de las 21:00 a las 21:03 del 2026-10-21, el usuario lo interrumpe a las 21:03 (`[Request interrupted by user]`), la siguiente entrada es el «No response requested.» del agente a las 06:48 del 2026-10-22 con `stop_reason` `stop_sequence`, el usuario escribe «sigue» a las 06:50 y el agente trabaja hasta cerrar a las 07:00
- WHEN se ejecuta `sdd session tokens --branch <rama>`
- THEN la cuarta línea es `- Esfuerzo real: 0,22 h — reloj de la sesión 10,00 h desde 2026-10-21T21:00Z, sin 2 min de espera al dev-lead (1 espera), sin 9,75 h sin actividad (1 hueco)`
- AND `--json` lleva `idleMinutes: 585, idleGaps: 1`
- AND un hueco cuenta como sin actividad si pasa de 60 min entre dos entradas seguidas, con el turno del agente abierto y sin herramienta en curso: una llamada cuyo resultado llega después en el transcript
- AND un subagente en primer plano que tarda 90 min es una herramienta en curso: su hueco es trabajo
- AND un hueco que acaba en una notificación de tarea es trabajo también con el turno abierto: GIVEN el usuario interrumpe al agente a las 10:01 y la notificación llega a las 11:30, THEN no hay hueco sin actividad
- AND un hueco dentro de una espera cuenta solo como espera
- AND sin huecos, la línea acaba en `(<n> esperas)`, como hoy

**Reglas de la capacidad**
- **Límites**: la ventana de una rama sin transcripts propios va de la primera entrada de su reflog hasta su último merge en `merge.into`, la creación de otra rama local sin transcripts propios o ahora, lo que llegue antes. Un hueco sin actividad pasa de 60 min.

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 1h (incluye medir los transcripts reales de la 0208, la 0209 y la 0210)
- Estimación de implementación: 1,5h
- Base de la estimación: un fichero de lógica (~40 líneas), la línea, el `--json` y cuatro tests por el verbo; referencia, la 0210 (lite infra/tooling, 2,5 h estimadas, 2,37 h reales)
- Confianza: media — la forma real del transcript en otros casos (subagentes, sesiones viejas sin `stop_reason`) puede pedir un ajuste

## Enmiendas

- 2026-10-26 — AND nuevo en «La sesión descuenta los huecos sin actividad» y el Approach: el hueco que acaba en una notificación de tarea es trabajo también con el turno abierto — la revisión final (eje Spec) vio que la regla cubría a medias la decisión del dev-lead «el hueco que acaba en una `task-notification` cuenta como trabajo», que no se condiciona al turno cerrado; hay 5 huecos así en los transcripts reales — sin aprobar: aplica una decisión del dev-lead ya registrada, se le enseña en el cierre

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-26 | aprobada (opción «Apruebo») |
