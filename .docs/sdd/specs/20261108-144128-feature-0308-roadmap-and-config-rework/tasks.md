# Tasks — feature 0308

| Task | Nombre | Estado | Commit |
| --- | --- | --- | --- |
| 1 | Adelgazar `sdd-roadmap`: P2, tabla, dos tramos a `references/` y saldo | hecha | e25ba55b |
| 2 | La frase del triaje: solo se fija una solución probada con el caso real | hecha | 83cdbda9 |
| 3 | `sdd-config` sin las dos frases de excepción pegada | hecha | 0fe1e6cb |
| 4 | Control: la batería entera contra el kit de `develop` y las comprobaciones | hecha | 11edbd02 |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 11edbd02
Pasada de fix: juntada en el cierre, 7 hallazgos (molde de ts1 idéntico antes y después; kit:test-headless 451/451), 3 rulings
Re-revisión: 11edbd02..pasada de fix juntada en el cierre, sdd-kit:effort-high + opus, limpia (3 Minor adjudicados)

## Rulings

Task 0: Ruling: «Retirado (feature 0308)» lo escribe la Task 1 con los controles nombrados y la Task 4 completa el resultado — el plan lo reparte así; si la Task 4 da un rojo de esos controles, el párrafo cambia — coste: ninguno.
Task 0: Ruling: las líneas de kit:own de la 0311 se comprueban por la frase citada, no por el número de línea — los números se mueven al adelgazar — coste: confundir una línea nueva con una de la 0311; se lee la cita.
Task 1: Ruling: la Verificación de word-budget corre con `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts` — `npx vitest` desde cli/ da MODULE_NOT_FOUND con el Node 26 de la sesión — coste: ninguno, mismo test.
Task 1: Ruling: M7b acepta el título de Now «escrito o propuesto» — en la tanda refactor-t1 los dos sujetos de m7 lo proponen y paran, porque el paso 3 deja el alcance al usuario; la fila del plan lo pedía escrito y fallaría con la conducta correcta, también con el kit de develop — coste: ninguno, la fila sigue exigiendo el título, el estado y el **Toca:**.
Task 1: Ruling: subject.mjs guarda la proposal.md que escribe el sujeto (specs/ y changes/) y m2 se relanza con n = 2 en refactor-t1b — en refactor-t1 la propuesta no se guardaba y M2b no se podía leer; no es relanzar un rojo: el rojo de puerta de m2-1 (entró por sdd-propose, variación anotada en la 0194) se queda en la evidencia — coste: ~0,37 $.
Task 2: Ruling: el dev-lead eligió la opción 1 («1»): el RED cuenta por la cláusula de la solución sin probar; la capa salas-3-fix añade la sala ocupada Oeste para que el hallazgo 3 sea cierto (enmienda en spec.md). Frase del triaje sustituida; dist 19.187 B. GREEN green-ts lanzado (0,89 $ previstos).
Task 2: Ruling: COST_CAP es acumulado de la campaña (2,40 $ previos): el GREEN cortó en 3 $ con 2 de 4 sujetos; relanzo con --resume y COST_CAP=4 — coste si me equivoco: ninguno, solo los 2 que faltan.
Task 2: Ruling: el dev-lead aprobó («1») la frase nueva de la decisión 6; aplicada en SKILL.md (el Step 4 del plan cita la anterior: manda la spec). GREEN repetido como PHASE=green-ts2 para no pisar la evidencia de green-ts; COST_CAP=5 acumulado.
Task 2: Ruling: el dev-lead eligió «2»: molde endurecido (el informe propone un texto que ya dice qué da sin número; libres --planta sin número da las libres de todas las plantas), enmienda en spec.md. ts1 n=2 como PHASE=green-ts3, COST_CAP=5.5.
Task 2: Ruling: el dev-lead eligió «2, pero usa sonnet a ver»: los sujetos ya eran sonnet; la frase de la cita la reescribió un agente sonnet (candidata 1), aplicada en SKILL.md y en la decisión 6. ts1 n=2 como PHASE=green-ts4, COST_CAP=6.
Task 3: Ruling: base — origin/develop cambió roadmap.md (filas 0310, 0311, 0297 y una de deuda), no la de la 0308; sdd-config sin cambios en la base. La 0310 tocó sdd-explore: las líneas de kit:own compartidas con sdd-roadmap se miran en la Task 4 contra develop.
Task 4: Ruling: el dev-lead eligió «1» en la parada de dinero: la rama corre los 17 escenarios del control (sin ts1, ts2 ni m7r, medidos en las Tasks 1 y 2); umbral 21 $ (enmienda en spec.md). Base: origin/develop no cambió la fila 0308 ni los ficheros de la task. COST_CAP acumulado de SPEC_DIR: control 14, rama 21 — coste si me equivoco: la tabla rama/control no cubre ts1, ts2 ni m7r con el kit final, que no cambió desde su medida.
Task 4: Ruling: la rama cortó en 33 de 35 (techo de 96 sujetos de la fila Suma; faltan wn1-3 y wn2-3). La opción 1 aprobada son 98 más los 4 de la medición final: Suma a 102 y la enmienda de la Task 4 lo dice. Relanzo la rama con --resume. Coste campaña 18,14 $ — coste si me equivoco: 2 sujetos, ~0,35 $.
Final: Ruling: regex de M7r sobre salidas — no aplica: presenceCheck de battery.mjs solo mira las llamadas (toolCalls, «>>>»), no las salidas — coste si me equivoco: un falso rojo de M7r, visible en tools.txt.
Final: Ruling: viñeta del Destino junta dos reglas y dice «the row's WHEN» (Código, Minor 4) — la frase es el literal de la decisión 6 que aprobó el dev-lead y midió green-ts4 2/2; partirla o reescribirla cambia la spec y exige otra ronda de ts1/ts2 — coste si me equivoco: un agente que no entienda «the row's WHEN»; va al ticket.
Final: Ruling: viñeta «a row» de la decisión 6 más amplia que el literal (Spec, Minor 3) — el THEN cubre la fila de deuda con «sin fila» y la cola «· arreglo:», y TS1 y TS2 lo midieron en verde; estrechar la viñeta o abrir el literal cambia la spec aprobada — coste si me equivoco: un sujeto que fije una solución en la fila de debt.md con «sin fila» sin que la frase lo nombre; va al ticket.
Final: Ruling: «Declined to judge» de los dos ejes — las cuatro líneas de kit:own y la paráfrasis del destinatario son de la 0311 (decisión 2); el RED sin la cláusula de la cita y ts1/ts2/m7r fuera de la tanda de rama los aprobó el dev-lead; roadmap publish va al ticket; el slug de la rama, decisión 3 — coste: ninguno nuevo.
Final: Ruling: replaceOnce con 4 parámetros (tope 3, se pasa en uno: Minor) — el cuarto es el motivo de s.die, que dice qué parte del molde cambió; meterlo en un objeto no aclara nada — coste si me equivoco: una firma de 4 en una ayuda de la batería.
Final: Ruling: subject.mjs:67 con 202 caracteres — la restricción no fija ancho de línea y es la sustitución literal del molde — coste: una línea larga de leer.
Final: Ruling: el comentario de por qué la ayuda es cierta va sobre withOccupiedRoom — es esa función la que hace cierto el hallazgo (filtra las ocupadas y da las de todas las plantas sin número) — coste: ninguno.
