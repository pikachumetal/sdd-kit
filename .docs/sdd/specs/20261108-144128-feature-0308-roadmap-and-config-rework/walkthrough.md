---
id: 20261108-144128-feature-0308-roadmap-and-config-rework
feature: 0308
title: Walkthrough — sdd-roadmap y sdd-config con las tres reglas de la ADR 0022
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-08
---

# Walkthrough — sdd-roadmap y sdd-config con las tres reglas de la ADR 0022

## 1. Cambios realizados

- **`sdd-roadmap` por debajo de 20.000 bytes** (`e25ba55b`): `dist/skills/sdd-roadmap/SKILL.md` pasa de 21.680 a 19.417 bytes. La forma de la propuesta de «Something big» baja a `references/proposal.md`, y los pasos 2 a 6 de «Prepare a release», a `references/prepare-release.md`; cada entrada manda leerlas con «First thing in this entry: read …». Para pagar el saldo de palabras se retiran tres red flags y una racionalización que repetían una línea que se queda (párrafo «Retirado (feature 0308)» de la batería). Batería: `m7` a n = 2, escenario `m7r` (destinatario) y filas `M2b`, `M7b` y `M7r`.
- **La frase del triaje** (`83cdbda9`): la frase del «Destino» de una fila «Lista» se sustituye entera por una que pide haber corrido la solución en una copia fuera del árbol con el caso real, también la propia, o escribir «solución por confirmar», y que una sustitución cite literal la frase entera que sale y la que entra. Batería: escenarios `ts1` (3.0.0) y `ts2` (2.x), moldes `salas-3-fix` y `salas-qa-fix`, filas `TS1` y `TS2`.
- **`sdd-config` sin sus dos excepciones pegadas** (`0fe1e6cb`): la línea `:11` dice que `sdd-init` y las migraciones preguntan sus claves a través de la skill, y el paso «Ask» pregunta las claves sin valor y las que el usuario pide cambiar; sale «A key with a value isn't asked again unless asked.».
- **Control** (`11edbd02`): 17 escenarios con el kit de `develop` y con el de la rama, 35 sujetos cada uno; resultado en la «Procedencia» y en el párrafo «Retirado» de `tests/batteries/sdd-roadmap/battery.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 2,57 h — reloj de la sesión 7,93 h desde 2026-11-08T14:30Z, sin 322 min de espera al dev-lead (6 esperas)
- Desviación: +0,07 h (+3 %)
- Causa de la desviación: no aplica (|desviación| ≤ 30 %); esperas y huecos: 14:53Z 70 min; 16:34Z 75 min; 17:56Z 36 min; 18:36Z 1 min; 18:42Z 16 min; 19:14Z 123 min
- Compactación: sí, dos; el ledger no tiene la línea `Ruling: compactación` y el hilo siguió en Native hasta el final (la segunda, con la Task 4 sola pendiente); no sé en qué task fue la primera
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 72.223.924 — claude-opus-5-5 72.223.924
- Tokens de subagentes: 5.895.464 en 6 despachos — Revisión adversarial de la spec 0308 claude-opus-5-5 288.379 / 1 min; Final review — Code axis claude-sonnet-5-5 839.801 / 2 min; Final review — Spec axis claude-opus-5-5 3.431.853 / 7 min; Reescribir frase de la cita claude-sonnet-5-5 50.465 / 0 min; Re-review final fix pass 0308 claude-opus-5-5 1.059.421 / 2 min; Segunda ronda de revisión de la spec 0308 claude-sonnet-5-5 225.545 / 1 min
- Coste de la sesión: 31,74 $ (hilo 27,50 $ + subagentes 4,23 $)
- Coste de sujetos: 18,42 $ en 98 sujetos sonnet — refactor-t1 1,00 $; refactor-t1b 0,51 $; red-ts 0,89 $; green-ts 1,05 $; green-ts2 0,89 $; green-ts3 0,42 $; green-ts4 0,64 $; smoke-config 0,33 $; smoke-config-control 0,34 $; smoke-config2 0,27 $; control 6,26 $; branch 5,82 $
- Review de spec: 2 revisores (opus effort medium y sonnet effort medium, en dos rondas) · hallazgos 20, aceptados 16

## 3. Desviaciones del plan

- La Task 2 necesitó cuatro rondas de GREEN en vez de una, con tres enmiendas aprobadas por el dev-lead (spec, «Enmiendas»): el hallazgo de la ayuda pasa a ser cierto en el molde, el molde hace daño a una sustitución a media frase y la frase de la cita la reescribe un agente sonnet.
- La Task 4 corre en la rama los mismos 17 escenarios que el control, sin `ts1`, `ts2` ni `m7r`, con el umbral de parada a 21 $ y el techo de sujetos a 102 (enmienda aprobada en la parada de dinero).

### Decisiones tomadas sin el dev-lead

- Task 0: Ruling: «Retirado (feature 0308)» lo escribe la Task 1 con los controles nombrados y la Task 4 completa el resultado — el plan lo reparte así; si la Task 4 da un rojo de esos controles, el párrafo cambia — coste: ninguno.
- Task 0: Ruling: las líneas de kit:own de la 0311 se comprueban por la frase citada, no por el número de línea — los números se mueven al adelgazar — coste: confundir una línea nueva con una de la 0311; se lee la cita.
- Task 1: Ruling: la Verificación de word-budget corre con `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts` — `npx vitest` desde cli/ da MODULE_NOT_FOUND con el Node 26 de la sesión — coste: ninguno, mismo test.
- Task 1: Ruling: M7b acepta el título de Now «escrito o propuesto» — en la tanda refactor-t1 los dos sujetos de m7 lo proponen y paran, porque el paso 3 deja el alcance al usuario; la fila del plan lo pedía escrito y fallaría con la conducta correcta, también con el kit de develop — coste: ninguno, la fila sigue exigiendo el título, el estado y el **Toca:**.
- Task 1: Ruling: subject.mjs guarda la proposal.md que escribe el sujeto (specs/ y changes/) y m2 se relanza con n = 2 en refactor-t1b — en refactor-t1 la propuesta no se guardaba y M2b no se podía leer; no es relanzar un rojo: el rojo de puerta de m2-1 (entró por sdd-propose, variación anotada en la 0194) se queda en la evidencia — coste: ~0,37 $.
- Task 2: Ruling: el dev-lead eligió la opción 1 («1»): el RED cuenta por la cláusula de la solución sin probar; la capa salas-3-fix añade la sala ocupada Oeste para que el hallazgo 3 sea cierto (enmienda en spec.md). Frase del triaje sustituida; dist 19.187 B. GREEN green-ts lanzado (0,89 $ previstos).
- Task 2: Ruling: COST_CAP es acumulado de la campaña (2,40 $ previos): el GREEN cortó en 3 $ con 2 de 4 sujetos; relanzo con --resume y COST_CAP=4 — coste si me equivoco: ninguno, solo los 2 que faltan.
- Task 2: Ruling: el dev-lead aprobó («1») la frase nueva de la decisión 6; aplicada en SKILL.md (el Step 4 del plan cita la anterior: manda la spec). GREEN repetido como PHASE=green-ts2 para no pisar la evidencia de green-ts; COST_CAP=5 acumulado.
- Task 2: Ruling: el dev-lead eligió «2»: molde endurecido (el informe propone un texto que ya dice qué da sin número; libres --planta sin número da las libres de todas las plantas), enmienda en spec.md. ts1 n=2 como PHASE=green-ts3, COST_CAP=5.5.
- Task 2: Ruling: el dev-lead eligió «2, pero usa sonnet a ver»: los sujetos ya eran sonnet; la frase de la cita la reescribió un agente sonnet (candidata 1), aplicada en SKILL.md y en la decisión 6. ts1 n=2 como PHASE=green-ts4, COST_CAP=6.
- Task 3: Ruling: base — origin/develop cambió roadmap.md (filas 0310, 0311, 0297 y una de deuda), no la de la 0308; sdd-config sin cambios en la base. La 0310 tocó sdd-explore: las líneas de kit:own compartidas con sdd-roadmap se miran en la Task 4 contra develop.
- Task 4: Ruling: el dev-lead eligió «1» en la parada de dinero: la rama corre los 17 escenarios del control (sin ts1, ts2 ni m7r, medidos en las Tasks 1 y 2); umbral 21 $ (enmienda en spec.md). Base: origin/develop no cambió la fila 0308 ni los ficheros de la task. COST_CAP acumulado de SPEC_DIR: control 14, rama 21 — coste si me equivoco: la tabla rama/control no cubre ts1, ts2 ni m7r con el kit final, que no cambió desde su medida.
- Task 4: Ruling: la rama cortó en 33 de 35 (techo de 96 sujetos de la fila Suma; faltan wn1-3 y wn2-3). La opción 1 aprobada son 98 más los 4 de la medición final: Suma a 102 y la enmienda de la Task 4 lo dice. Relanzo la rama con --resume. Coste campaña 18,14 $ — coste si me equivoco: 2 sujetos, ~0,35 $.
- Final: Ruling: regex de M7r sobre salidas — no aplica: presenceCheck de battery.mjs solo mira las llamadas (toolCalls, «>>>»), no las salidas — coste si me equivoco: un falso rojo de M7r, visible en tools.txt.
- Final: Ruling: viñeta del Destino junta dos reglas y dice «the row's WHEN» (Código, Minor 4) — la frase es el literal de la decisión 6 que aprobó el dev-lead y midió green-ts4 2/2; partirla o reescribirla cambia la spec y exige otra ronda de ts1/ts2 — coste si me equivoco: un agente que no entienda «the row's WHEN»; va al ticket.
- Final: Ruling: viñeta «a row» de la decisión 6 más amplia que el literal (Spec, Minor 3) — el THEN cubre la fila de deuda con «sin fila» y la cola «· arreglo:», y TS1 y TS2 lo midieron en verde; estrechar la viñeta o abrir el literal cambia la spec aprobada — coste si me equivoco: un sujeto que fije una solución en la fila de debt.md con «sin fila» sin que la frase lo nombre; va al ticket.
- Final: Ruling: «Declined to judge» de los dos ejes — las cuatro líneas de kit:own y la paráfrasis del destinatario son de la 0311 (decisión 2); el RED sin la cláusula de la cita y ts1/ts2/m7r fuera de la tanda de rama los aprobó el dev-lead; roadmap publish va al ticket; el slug de la rama, decisión 3 — coste: ninguno nuevo.
- Final: Ruling: replaceOnce con 4 parámetros (tope 3, se pasa en uno: Minor) — el cuarto es el motivo de s.die, que dice qué parte del molde cambió; meterlo en un objeto no aclara nada — coste si me equivoco: una firma de 4 en una ayuda de la batería.
- Final: Ruling: subject.mjs:67 con 202 caracteres — la restricción no fija ancho de línea y es la sustitución literal del molde — coste: una línea larga de leer.
- Final: Ruling: el comentario de por qué la ayuda es cierta va sobre withOccupiedRoom — es esa función la que hace cierto el hallazgo (filtra las ocupadas y da las de todas las plantas sin número) — coste: ninguno.

## 4. Verificación

### 4.1 Builds

- Gate: corre una vez en el paso 6 del cierre, sobre el merge de sincronización con `develop` (otras tres ramas abiertas); su línea `Gate:` y su sha van en el mensaje final, porque este walkthrough va en el commit de cierre.
- Por task: `moon run kit:build kit:skill-size` (Tasks 1, 2 y 4), `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts` → 78/78 (Task 3); `kit:skill-size` OK, `dist/skills/sdd-roadmap/SKILL.md` 19.417 bytes.
- Pasada de fix (juntada en el cierre): `moon run kit:build kit:skill-size kit:test-headless` → `kit:test-headless` 451/451, `kit:skill-size` OK.
- `moon run kit:build kit:copies kit:own kit:skill-size` (Task 4): `kit:own` rojo solo con líneas de otras skills y, de `sdd-roadmap`, las cuatro de la 0311 (`:10`, `:54` dos, `:56`); ninguna de `sdd-config`.
- Tanda: control 35 sujetos (6,26 $) y rama 35 sujetos (5,82 $), en serie bajo `sdd watch command`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-08 · RED y GREEN de `ts1` y `ts2` (cuatro rondas, la última 2/2), humo de `sdd-config` (`s1`, `g7`), batería entera de `sdd-roadmap` con el kit de `develop` y con la rama (35 + 35 sujetos, ningún rojo de la rama que el control no dé), `kit:test-headless` 451/451 · revisión final Spec opus+high y Código sonnet+high sobre 11edbd02, With fixes; pasada de fix juntada en el cierre; re-revisión opus+high limpia (3 Minor adjudicados) · gate de cierre en el paso 6, sobre el merge de sincronización

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Ninguna fila del triaje (3.0.0, `ts1`) fija «cambiar `<=` por `<`» sin correrlo; la fija con `===` corrido en una copia o dice «solución por confirmar» | ejecución real: `green-ts2/` a `green-ts4/` | 6 de 6 desde la segunda ronda |
| La sustitución de `docs/ayuda.md` cita entera la frase que sale y la que entra (`ts1`) | ejecución real: `green-ts4/` | 2 de 2 en la cuarta ronda (0/2, 1/2 antes) |
| En 2.x (`ts2`), ni la fila `**Actuar**` ni su `· arreglo:` fijan la solución sin probarla | ejecución real: `green-ts2/` | 2 de 2 |
| `dist/skills/sdd-roadmap/SKILL.md` por debajo de 20.000 bytes | `moon run kit:skill-size` | 19.417 bytes |
| `kit:own` sin líneas de `sdd-roadmap` ni `sdd-config` fuera de las cuatro de la 0311 | `moon run kit:own` | solo `:10`, `:54` (dos) y `:56` |
| Ningún rojo de la rama que el control no dé, por fila de rúbrica | ejecución real: `control/` y `branch/` | ninguno |

### 4.3 Residuales / deuda generada

- `sdd roadmap publish` rechaza con «destino con cambios» la edición del propio sujeto cuando la rama de integración está en el mismo árbol: igual con los dos kits; en el control 11 de 13 sujetos lo saltan con `git commit`, en la rama 8 de 13 paran y lo dicen. Va al ticket.

## 5. Aprendizajes

- `COST_CAP` y el techo de sujetos son acumulados de toda la campaña de `SPEC_DIR`: el GREEN de la Task 2 cortó en 2 de 4 sujetos con `COST_CAP=3` → `tech-stack.md`, «El techo de coste y el de sujetos los aplica el lanzador».
- Una regla que pide citar la frase entera solo se mide en un molde donde la media sustitución hace daño: con el molde blando salió 0/2 sin que el GIVEN mostrara nada → procedencia de `tests/batteries/sdd-roadmap/battery.md` (fila del triaje y enmiendas de la spec).
- `sdd roadmap publish` rechaza con «destino con cambios» la edición del propio agente cuando la rama de integración está sacada en el mismo árbol, con los dos kits → ticket del kit.

Retro: documento o skill desmentido → ticket del kit: el paso 6 «Publish the reservation» de `sdd-roadmap` dice que `roadmap publish` hace el commit en el worktree donde está sacada la rama de integración, y `publish` rechaza con «destino con cambios» la edición del propio agente en ese worktree (control y rama de la Task 4, los dos kits).
Retro: error que cazaría un chequeo → ticket del kit: `tests/headless/battery.mjs plan` sin la ruta de la batería cae con `ERR_INVALID_ARG_TYPE` en vez de dar su uso.

## 6. Adendas
