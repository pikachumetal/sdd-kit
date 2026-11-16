---
id: 20261031-182430-feature-0186-implement-deviations-and-brakes
feature: 0186
title: Freno por regiones, tasks.md antes de la Task 1 y oferta de gama media con su cuenta
mode: full
profile: delegate
status: done
created: 2026-10-31
author: agente con el dev-lead
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-31
---

# Spec — Freno por regiones, tasks.md antes de la Task 1 y oferta de gama media con su cuenta

🦆 De los siete arreglos pedidos, el RED reproduce tres, y esta spec solo arregla esos. Si `develop` cambia la sección «Soporte» del README y tu task solo toca la línea de `libres`, hoy el agente te para aunque no choquen; con esto apunta un ruling con los dos tramos y sigue, y solo para si las líneas se pisan. El registro `tasks.md` se crea antes de la primera task, no al final. La oferta de bajar a gama media dice cuántas tasks prevé, para que decidas si compensa. Los otros cuatro frentes pararon bien en un molde pequeño: no llevan texto nuevo, quedan como control en la batería y sus filas siguen abiertas como posible falso negativo, porque los casos de campo salieron en sesiones largas.

Validación: agente — solo cambian skills y documentos, medidos con sujetos; `validation.mode: field`.

## Capacidades

- Modificadas: `control-profiles` — el freno «fichero de la task cambiado en la base» compara regiones.
- Modificadas: `feature-flow` — `tasks.md` nace antes de la Task 1, y las dos ofertas de gama media dicen cuántas tasks.
- Modificadas: `cli` — `task start` y `task brief` exigen `tasks.md` con más de una task.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` · tamaño: ~20 líneas en 3 ficheros
- Mínimo razonable: ninguna — deja sin cubrir una lectura ajena de los tres textos, que hace la revisión final.

1. **No se parte, y la 0269 no se usa.** Antes del RED preveía cuatro tasks sobre dos capacidades y reservé la 0269 para la hija. Con los frentes limpios fuera quedan tres tasks, y con tres nunca se parte. El id queda como hueco de la secuencia.
2. **Cuatro de los siete arreglos salen de la spec por RED limpio**, por tu regla: un punto del Scope que no se cumple (`a1`, `a2`), ruling contra «Dónde se prueba» (`g1`), aviso de fase (`n1`) y esperas (`e1`). Tu criterio de hecho, el sujeto que para con update sin dejar `Ruling:`, ya se cumple en la base (`g1`, 1/1); sigue como control. Una enmienda posterior lo matiza: ver «Enmiendas».
3. **Esas filas no se saldan: se quedan abiertas**, con «RED limpio con n = 1 en molde pequeño: posible falso negativo (0186)» y a la espera de un caso nuevo en sesión larga. Pedías saldarlas; sin guía nueva no hay nada que las salde, y borrarlas perdería los dos casos de campo. La 0229 pasa a esa misma fila.
4. **`e1` no mide las esperas**: el sujeto no encontró ninguna espera real («no localizo proceso ni salida suyos») y siguió con la Task 2. Es disparador ausente, no «no se reproduce»; lo dice su fila. `n1` tampoco emitió avisos de fase, porque un sujeto de un turno no llega a la situación del ticket.
5. **«Un ruling decide lo que es de la spec o del dev-lead» no entra**: `d1` limpio, 1/1. Mismo trato que el punto 3.
6. **«Los Minor que abre la re-revisión…» no entra**: está en `sdd-verify`, que dejaste fuera salvo lo que nombre una fila de las que se saldan, y esta no es de las que me pediste saldar. Queda «Actuar», con destino por asignar en el triaje en vez de 0186.
7. **Lo que paga el saldo de palabras** son recortes de duplicados, listados en «Lo que se retira». Son recortes sin baseline propio: la regla sigue viva en su duplicado, y `b1`, `g1` y la tanda de control los cubren.
8. **La parte de la fila «gama media recomendada, con la cifra del hilo» no entra**: tu alcance solo pide que diga cuántas tasks, y la fila exigía medir antes la calidad en gama media.
9. **La oferta solo sale con más de una task prevista** en los dos gates, igual que el anuncio del arranque: el motivo de la 0077, que por una task corta no compensa rehacer la caché.
10. **`tasks.md` también en SDD**: la frase sale de Setup, que vale para los dos métodos, así que el bucle SDD lleva la suya; si no, moverla le quitaría la regla a SDD.
11. **Sujetos en Opus**, no Sonnet: los casos de campo salieron de hilos en Opus (`tech-stack.md`), y la oferta solo se mide en Opus. Van en serie, sin paralelo. Por eso la previsión llega a 36 sujetos y 35 $, techo que fija el lanzador.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no · otros despachos en paralelo: ninguno, sujetos en serie · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se pregunta.
- `sdd capability merge` sobre una copia: 3 sustituidos y 1 añadido, sin rechazos.

### Decisiones tomadas con el dev-lead

- La lista de arreglos es la de la fila — «Las cuatro» (2026-10-15); «Sí, a la 0186» (2026-10-27).
- El saldo de palabras de cada skill queda igual o baja, y el texto se cuenta antes de presentar — regla 6 de `CLAUDE.md` y la petición de esta feature.
- Un frente limpio sale de lo que se arregla y sigue como control en el GREEN — petición de esta feature.
- Un RED limpio en molde pequeño se dice como posible falso negativo — petición de esta feature.
- Una regla reescrita en el REFACTOR se mide otra vez en todos los escenarios que la alcanzan — petición de esta feature.
- Perfil `delegate`; al fusionar, `sdd merge --push` — petición de esta feature.

## Intent

El freno «fichero de la task cambiado en la base» para al dev-lead por cambios en otra región del mismo fichero: una parada sin decisión real, o un ruling que se salta la regla (dos tickets). `tasks.md` nace al final, y una caída a mitad solo deja el ledger (dos tickets). La oferta de gama media no dice cuántas tasks hay, y con una sola no compensa. El éxito: `b1` sigue con un ruling, `b2` sigue parando con los tramos, `tasks.md` existe antes de la primera task, y la oferta lleva su número; con el saldo de palabras igual o a la baja. Sería un fracaso que el freno dejara de parar ante un solape de verdad.

## Scope

- Entra: el freno por regiones en `skills/sdd-implement/SKILL.md` («Before each task») y `skills/sdd-start-feature/references/control-profiles.md` («Fichero de la task cambiado en la base»).
- Entra: `tasks.md` antes de la Task 1, en «Native loop» paso 1 y en el bucle SDD de `skills/sdd-implement/SKILL.md`.
- Entra (enmienda 2026-10-31): la comprobación de `tasks.md` en `cli/src/tasks/brief.ts`, con sus tests en `cli/test/tasks/`.
- Entra: las dos ofertas de los gates de `skills/sdd-propose/SKILL.md`, pasos 4 y 5.
- Entra: los escenarios `g1`, `d1`, `a1`, `a2`, `b1`, `b2`, `b3`, `n1` y `e1` en la batería de `sdd-implement`, y la fila de la oferta en la de `sdd-propose`.
- No entra: un punto del Scope incumplido, ruling contra «Dónde se prueba» (`g2` no lo reproduce; `g1` solo cuando la petición trae la orden) o contra una decisión, aviso de fase y esperas: RED limpio, sin texto nuevo.
- No entra: retirar `sdd-start-feature` y mover `control-profiles.md` (0206); la pasada de fix de `sdd-verify`; coherencia de documentos (0152).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Criterio del freno: «si alguno coincide» pasa a comparar líneas | `skills/sdd-start-feature/references/control-profiles.md:54` (celda de la tabla, «fichero de la task»), `:112-115`; `skills/sdd-implement/SKILL.md:45`, `:298`, `:336`; `.docs/sdd/capabilities/control-profiles.md:99-100` | delta `MODIFIED`; la celda y las líneas 298 y 336 pasan a «líneas de la task» |
| Frase «With more than one task, `tasks.md` is the living record…» | `skills/sdd-implement/SKILL.md:36` | se mueve a «Native loop» paso 1 y al bucle SDD |
| Fila de excusa «The row didn't change and `develop` only brings another feature» (28 palabras) | `skills/sdd-implement/SKILL.md:337` | se quita: su duplicado es el red flag de la línea 325; paga el texto nuevo |
| Fila de excusa «The constitution says all green in every task» (36 palabras) | `skills/sdd-implement/SKILL.md:341` | se quita: su duplicado es el red flag de la línea 329; paga el texto nuevo |
| Viñeta «Lo de arriba vale para lo que se aparta del plan…» | `skills/sdd-start-feature/references/control-profiles.md:83` | se quita: repite el primer párrafo de «Desvío» (línea 69); paga el texto nuevo |
| «Cualquier otro fichero para igual.» | `skills/sdd-start-feature/references/control-profiles.md:112` | se quita: lo sustituye la comparación de regiones |
| Línea «“EN ESPERA” no es un estado del roadmap…» de «Más» | `skills/sdd-start-feature/references/control-profiles.md:63` | se quita: repite la de «Estados del roadmap» (línea 213); paga el texto nuevo |
| Red flag «You're about to ask «which task do we start?» in a separate turn…» | `skills/sdd-propose/SKILL.md`, «Red flags» | se quita: su duplicado es la primera fila de racionalizaciones; paga las ofertas |

- Filas que implementa: «El freno «fichero de la task cambiado en la base» compara ficheros, no regiones», «`tasks.md` nace al final y no antes de la Task 1» y «La oferta de gama media de los pasos 4 y 5 no dice cuántas tasks quedan» → `.docs/sdd/roadmap.md`, se marcan como saldadas al cerrar. Siguen abiertas, con la nota de la decisión 3: las de un ítem del Scope, aviso de fase, RED adelantados, ruling contra «Dónde se prueba» y ruling que decide lo de la spec. `0186` en las filas 0198, 0152 y 0206 («tras 0186») no cambia.

## Approach

Texto literal que entra, ya contado (ver «Topes de palabras»):

**`skills/sdd-implement/SKILL.md`, «Before each task», paso 1**, sustituye desde «: a match is the same brake…»:

> : for a match, compare `git diff -U0` of the base (`origin/<integration>` too if the match comes from there; ranges are the merge base's) with the lines the task will touch. An overlap the spec doesn't declare, or lines you can't tell, is the same brake. Other lines, or an overlap the spec declares with file and region and the base stays inside it, is a `Ruling:` with both ranges, and you go on.

**`control-profiles.md`, «Fichero de la task cambiado en la base»**, sustituye «Si alguno coincide, es un posible desvío.» y «Cualquier otro fichero para igual.»:

> Si alguno coincide, compara `git diff -U0 $(git merge-base HEAD <integración>) <integración> -- <fichero>` con las líneas que tocará la task (o `origin/<integración>` si la coincidencia sale de ahí). Solape no declarado, o líneas que el plan no deja saber: posible desvío. Otras líneas, o un solape que la spec declara con fichero y región sin salir de ella: ruling con los dos tramos, y sigues.

Y en `pair` y `delegate`: «nombran los ficheros, los commits […] y los tramos («la base cambia las líneas A–B; la task toca C») y paran».

**`sdd-implement`, «Native loop», paso 1**, al principio; en el bucle SDD, «In SDD, the same before the first dispatch»:

> Before the first `task start`, with more than one task, write `tasks.md`, the **living record** (status and commit hash per task): it goes in the opening's commit or, if that is done, in Task 1's.

**`sdd-propose`, paso 4**, tercera opción: «…a gama media (prevé <n> tasks)», «in `delegate` on the most capable model with more than one task foreseen». **Paso 5**: «…a gama media (quedan <n> tasks)», con la misma condición.

## Dónde se prueba

- El freno por regiones: `b1`, `b2` y `b3` de la batería de `sdd-implement`.
- `tasks.md` antes de la Task 1: `e1` y `n1` de la batería de `sdd-implement`.
- La oferta con su número: `g1` de la batería de `sdd-propose`, en Opus, y su contraejemplo con una sola task (`g1b`).
- El ruling contra «Dónde se prueba»: `g1` y `g2` de la batería de `sdd-implement`, sin texto nuevo.
- Controles sin texto nuevo: `d1`, `a1` y `a2` de la batería de `sdd-implement`.
- La comprobación de la CLI: `cli/test/tasks/brief.test.ts` y `executing.slow.test.ts`.
- Los recortes: `word-budget.test.ts` y `moon run cli:test`.

## Términos y ADR

- Términos resueltos: región — las líneas de un fichero que cambia un diff o que va a tocar la task.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `control-profiles`

#### MODIFIED — Los ficheros de la task se cruzan con la base antes de cada despacho

- GIVEN una feature en ejecución y la siguiente task del plan con ficheros en «Crear» o «Modificar»
- WHEN el agente va a despacharla, antes de escribir sus tests RED
- THEN cruza `git diff --name-only $(git merge-base HEAD <integración>) <integración>` (y `origin/<integración>` tras `git fetch` si hay remoto) con esos ficheros
- REMOVED AND si alguno coincide, lo trata como freno de alcance: en `pair` y `delegate` nombra los ficheros y los commits que los tocan y para; en `unattended` sigue y lo registra como enmienda sin aprobar
- AND si alguno coincide, compara `git diff -U0` de la base con las líneas que la task va a tocar
- AND si la task solo toca la línea de `libres` de `README.md` y la base cambia «Soporte», registra un ruling con los dos tramos y sigue, sin parar
- AND si la base cambia esa misma línea y la spec declara ese solape con fichero y región, registra un ruling con los dos tramos y sigue
- AND si la base cambia esa misma línea sin que la spec lo declare, o el plan no deja saber qué líneas toca la task, es freno de alcance: en `pair` y `delegate` nombra los ficheros, los commits y los tramos («la base cambia las líneas 11-11; la task toca la 11») y para; en `unattended` sigue y lo registra como enmienda sin aprobar

### Capacidad: `feature-flow`

#### ADDED — `tasks.md` nace antes de la primera task

- GIVEN un plan con dos tasks y la apertura commiteada sin `tasks.md`
- WHEN el agente va a empezar la Task 1, en Native o en SDD
- THEN escribe `tasks.md` antes del primer `sdd task start` o del primer despacho
- AND va en el commit de la apertura o, si ya está hecho, en el de la Task 1
- AND con una sola task no lo escribe por esta regla
- AND con más de una task y sin `tasks.md` junto al plan, `sdd task start` y `sdd task brief` fallan con un error que nombra el fichero, sin escribir el brief

#### MODIFIED — El gate del plan en `pair` ofrece parar para bajar la sesión a gama media

- GIVEN una feature en `pair`, una sesión con Opus 5.5 y un plan de dos o más tasks con `Ejecución: native, porque…`
- WHEN el agente presenta el gate del plan
- REMOVED THEN entre las opciones está «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con su motivo: Native va bien en gama media (Sonnet, effort medium) y bajar solo el effort de Opus no es gama media
- THEN entre las opciones está «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media (quedan 3 tasks)», con las tasks del plan, que no es la recomendada, con su motivo: Native va bien en gama media (Sonnet, effort medium) y bajar solo el effort de Opus no es gama media
- AND si el usuario la elige, el agente junta la apertura en su commit y termina el turno antes de la Task 1 diciendo el cambio (`/model`, Sonnet con effort medium)
- AND con un plan de una sola task no la ofrece

#### MODIFIED — El gate de la spec en `delegate` ofrece parar tras el plan para bajar la sesión a gama media

- GIVEN una feature en `delegate`, una sesión con Opus 5.5 y la spec lista para el gate, con dos o más tasks previstas
- WHEN el agente presenta la spec
- REMOVED THEN entre las opciones numeradas está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con el mismo motivo
- THEN entre las opciones numeradas está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media (prevé 3 tasks)», con las tasks previstas, que no es la recomendada, con el mismo motivo
- AND si el usuario aprueba sin esa opción, el agente sigue sin parar hasta la validación, como hoy
- AND con una sola task prevista no la ofrece

### Capacidad: `cli`

#### ADDED — `task start` y `task brief` exigen `tasks.md` con más de una task

- GIVEN un plan, fuera de lite, con más de una task y sin `tasks.md` en su carpeta
- WHEN se ejecuta `sdd task start` o `sdd task brief` sobre él
- THEN sale con código 1 y el mensaje `plan with <n> tasks and no tasks.md: write <ruta> before the first task (status and commit per task)`, sin escribir el brief

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-implement/SKILL.md` | 9.575 / 9.483 (con el margen del 25 %, 11.854) | 2.279 | sin cambio; saldo −6 (base `9f807d14`: 9.581) |
| `skills/sdd-start-feature` (total, con `control-profiles.md`) | 11.473 / 11.322 (con el margen, 14.152) | 2.679 | sin cambio; saldo −1 |
| `skills/sdd-propose/SKILL.md` | 5.333 / 5.250 (con el margen, 6.562) | 1.229 | sin cambio; saldo −10 (base `9f807d14`: 5.343) |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED, ya gastado: 6 de paradas, `b3`, `n1`, `e1`, oferta (2, el primero sin mensaje final) | 11 (`sdd-implement`, `sdd-propose`) | 10,19 (medido) |
| GREEN: `b1`, `b2`, `b3`, `e1`, `n1`, `g1` de propose y `g1b`, n = 2 | 14 | 13 (0,93 $ por sujeto Opus, lo medido) |
| Una tanda de REFACTOR | 5 | 5 |
| Controles: `g1` de implement n = 2; `d1`, `a1`, `a2` n = 1 | 5 | 5 |
| Medición tras la revisión final | 1 | 1 |
| Enmienda 2026-10-31: `n1` n = 2 | 2 | 2,6 |
| Real | 43 | 44,71 (techo 45) |

Cada paso cambiado: «Before each task» paso 1 (`b1`-`b3`), «Native loop» paso 1 (`e1`, `n1`), bucle SDD (no se mide: misma frase, y un sujeto SDD cuesta ~3 $; lo cubre la lectura de la revisión final), pasos 4 (`g1`, `g1b`) y 5 de `sdd-propose` (no se mide: `pair` no está en el molde de la batería, y es la misma forma), recortes (sin escenario propio, decisión 7).

## Enmiendas

- 2026-10-31, aprobada (dev-lead, opción «1»): «`tasks.md` nace antes de la primera task» no se cumple solo con texto (`n1` 0/2 en GREEN y 0/2 tras el REFACTOR). `sdd task start` y `sdd task brief` fallan con más de una task y sin `tasks.md`; entra `cli/src/tasks/` en el Scope, salen el red flag y la caja del grafo de la ronda fallida, y el techo de sujetos pasa de 35 a 40 $.

- 2026-10-31, aprobada (dev-lead, «si»): el control `g1-2` falla: deja `Ruling: no se escribe test/attempt.test.js y se enmienda Dónde se prueba`, sin parar, y cierra la task. El ruling contra «Dónde se prueba» sale de «No entra» y entra en el Scope, con el texto en «Native loop» paso 2, rama «The plan is wrong»: «A ruling that removes or moves a test «Dónde se prueba» names is a deviation: stop with the update action.» Se mide con `g1`, n = 3.

- 2026-10-31, aprobada (dev-lead, opción «1»): `g1` da 1/3 con la frase de la Task 5, y su petición ya trae la orden de no escribir el test («no te compensa… cierra la task»). Se mide otro molde, donde el sujeto decide solo (`g2`, n = 2 sin la frase y n = 3 con ella), y el techo pasa de 40 a 45 $.

- 2026-11-01, aprobada (dev-lead, opción «1», cuyo texto decía «Si g2 no falla sin la frase, quito la frase»): `g2`, sin la orden en la petición, no reproduce el fallo: 2 de 2 escriben el test sin la frase. Por lo acordado, la frase de la Task 5 sale y `g2-con` no se lanza. El criterio de hecho no se cumple con evidencia nueva; la fila sigue abierta.

- 2026-11-01, sin aprobar: la revisión final añade el delta de `cli`, que documenta el fallo ya aprobado, con un THEN cuyos valores (código 1 y mensaje) la enmienda no fijaba, y el `origin` del `git diff -U0`.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-31 | aprobada (opción «Apruebo») |
