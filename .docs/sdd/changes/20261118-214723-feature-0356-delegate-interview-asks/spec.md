---
id: 20261118-214723-feature-0356-delegate-interview-asks
feature: 0356
title: En delegate, la entrevista pregunta lo que falta y es del dev-lead
mode: full
profile: delegate
status: approved
created: 2026-11-18
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-18
---

# Spec — En delegate, la entrevista pregunta lo que falta y es del dev-lead

🦆 Hoy, si arrancas una feature en `delegate` con un prompt que no dice cuándo una sala cuenta como «muy ocupada», el agente elige él el umbral, lo pone en el ✋ y no te pregunta. Con este cambio, antes de escribir la spec reparte lo que falta en tres montones, como hace `brainstorming`: lo que el prompt o el proyecto ya dicen lo usa, lo menor (nombres, ficheros, orden de las tasks) lo decide él y va al ✋, y lo que solo tú puedes responder y cambia lo que se construye te lo pregunta, una cosa por turno. Si el prompt lo trae todo, no pregunta nada. Va en `spec-writing.md` de `sdd-propose`, que decide qué se pregunta; `sdd-grilling` solo dice cómo.

Validación: agente — es guía del kit; lo que haría una persona lo miden las baterías, y el uso real lo da la validación en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `feature-flow` — un requisito nuevo: la entrevista de la spec pregunta solo lo que falta y es del dev-lead.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos (sonnet) — señales: ninguna (sin capacidad nueva, contrato público ni `MODIFIED`; un `ADDED` en `feature-flow`) · tamaño: ~30 líneas en 4 ficheros
- Un revisor (sonnet): si el `ADDED` «La entrevista pregunta solo lo que falta y es del dev-lead» choca con «El perfil de control decide dónde para el agente» de `control-profiles` («y en ningún otro») o con la AND de `delegate` de «Una feature grande devuelve el diseño por secciones…», y si los tres escenarios de la batería pasan sin la conducta (señal: ninguna; el tamaño baja a uno)
- Mínimo razonable: este mismo — por debajo no relee nadie la spec

1. Enfoque: los tres montones en `spec-writing.md`, frente a meterlo en `sdd-grilling` y a solo una fila en `control-profiles.md` (ver Approach) — lo validaste: «sí, sigue».
2. La regla 3 del `CLAUDE.md` del kit no cambia: ya para en «una decisión que es suya de verdad», que es el montón «del dev-lead»; lo que fallaba es que `spec-writing.md` no lo separaba y lo mandaba al ✋.
3. `sdd-grilling` no se toca salvo que el RED señale su punto «Decide for me»: está a 886 de 886 palabras y el cambio sería quitar, no añadir.
4. Los ejemplos del montón «menor» son nombres, ficheros, el orden de las tasks y un enfoque que el proyecto decide; los del montón «del dev-lead», el porqué, el criterio de hecho, el alcance, una contradicción entre la petición y el proyecto y cada punto de «Abierto» que no sea menor. Es la frontera de `brainstorming` («only your human partner can answer it, and the answer changes what gets built»), dicha con la prueba de OpenSpec (`schemas/spec-driven/schema.yaml:205`, «would change the specs, the chosen approach, or the task breakdown»; `explore.ts:21`, «ask the user when only they can answer»): «del dev-lead» si solo él puede responderlo y la respuesta cambia la spec, el enfoque o las tasks. Un enfoque que el proyecto decide es «respondido» y va al Approach, como hoy; solo se pregunta el que únicamente el dev-lead puede elegir. Lo demás de OpenSpec ya estaba: lo que no cambia nada de eso es «menor» o va al plan («Regla de contenido» de `spec-template.md`), y lo no contestado queda pendiente (`sdd-grilling`). Lo propuso el dev-lead a través de la sesión de la 0357; «es un matiz… solo la redacción» — «sí, sigue».
5. Un punto de la sección «Abierto» del prompt de arranque nunca cuenta como respondido: va a «menor» o a «del dev-lead» por su contenido. Si es del dev-lead, la pregunta cita su propuesta como dato del prompt, y solo la recomienda con una razón del caso, como pide `interviewing` («La recomendada se gana con una razón del caso»). Acordado con la sesión de la 0357, que crea esa sección: la 0357 no toca la entrevista ni escribe «pregúntaselo» en el prompt. Lo que trae «Decisiones ya tomadas» cuenta como respondido: que ahí solo entre lo que dijo el dev-lead es la 0357 («solo entra lo que tiene su frase literal»), y esta feature no lo vuelve a comprobar.
6. Esas preguntas son la entrevista del paso de spec que ya existe en `pair` y `delegate` («El diseño de una feature pregunta con `sdd-grilling`», de `feature-flow`), no una parada nueva del perfil: también en `pair` la entrevista pregunta antes de la spec y no figura en la lista de «El perfil de control decide dónde para el agente», así que esa lista no cambia. La línea de `delegate` de `control-profiles.md` lo aclara; la conducta la mide `iq1`.
7. Escenarios nuevos en la batería de `sdd-propose`, molde `reservas`. Con el RED medido (`tests/sdd-propose-0356-interview-asks-red.md`): `iq3` («Abierto», n = 2, rojo 1/2) e `iq4` (spec aprobada por delegación, n = 1, rojo 0/1) son los que fallan; `iq1` (hueco del dev-lead en una línea, n = 3, limpio 3/3) pasa a control de no regresión; `iq5` (el hueco de `iq1` en un prompt de arranque largo, n = 2, enmienda) intenta el caso de campo de la 0355; `iq2` (prompt completo, n = 2) es control. Controles `a5` y `pb` con n = 1 (los enfoques y las secciones siguen al ✋ en `delegate`).
8. El perfil `delegate` no cuenta como «decide tú» ni como algo que «la petición delega» (`interviewing`, «Cuándo para la entrevista»). Lo miden `iq1` e `iq5` con la fila `IQ2`: falla si el sujeto da el umbral por decidido.
9. La regla vale en los carriles con spec: feature, lite y spike. Con la spec aprobada por delegación o tras «empieza ya», el dev-lead no está para contestar: lo suyo va al ✋ marcado «pendiente», como hoy. En `unattended` aparca la feature («En `unattended`, lo que falta aparca la feature»). Si el dev-lead contesta «decide tú», se aplica «Decide tú» de `interviewing`. Quedan sin observar en la batería: lite, spike, `pair`, `unattended` y «decide tú»; la regla es la misma en todos y su texto no los distingue.
10. El requisito va en `feature-flow` y no en `interviewing`, porque es qué pregunta el paso de spec; `interviewing` es cómo pregunta `sdd-grilling` a todas las skills.
11. Validación: agente. El registro sale como «Validación en campo», porque el repo tiene `validation.mode: field`.
12. Sin A/B contra la 2.x: no se recuerda bien cómo era y la referencia es el texto de `brainstorming` v7.0.2 de `upstream.json`.
13. La previsión de coste: el RED de `iq1`–`iq4` está medido (`red: 8 sujetos · 4.31 $`, 0,54 $ por sujeto); el resto se estima a ese precio, `sin medir`.
14. **Tope de palabras de `sdd-propose`: de 13.927 a 14.162**, `sin medir` (ver «Topes de palabras»). Es lo medido más lo previsto más un 2 %, como en la 0349. Lo apruebas tú en el gate. Si el GREEN cabe en el tope de hoy, no se sube.
15. Los literales de los montones en `spec-writing.md`, en inglés: **answered**, **minor** y **the dev-lead's**. `spec-writing.md` no tiene bloques copiados (sin marcas `<!-- kit:`), y la verificación de la task corre `kit:copies` y `kit:own`.
16. Repaso de coherencia: el delta, probado en una copia de `.docs/sdd` con `sdd capability merge` → `feature-flow.md: añadido «La entrevista pregunta solo lo que falta y es del dev-lead»`; los dos literales que cambian de forma solo aparecen en sus ficheros (y en su build de `dist/`), con `git grep` fuera de las carpetas de evidencia.

### Hallazgos de la review

- **Aceptado** — Crítico: el `ADDED` chocaba con «lo que habría preguntado, a ✋» de la spec aprobada por delegación y con «empieza ya» → sin el dev-lead para contestar, lo suyo va al ✋ «pendiente», como hoy (decisión 9), con la AND y el control `iq4`; no es `MODIFIED`, porque esas dos AND no cambian.
- **Aceptado** — «dentro de la parada de la spec» no se observa → sale del delta; queda en la decisión 6 y en la línea de `control-profiles.md`.
- **Aceptado** — recomendar la propuesta de «Abierto» sin razón del caso choca con `interviewing` → se cita como dato del prompt (decisión 5 y AND de `iq3`).
- **Aceptado** — el escenario del prompt completo pasa hoy → `iq2` es control, y «ninguna pregunta antes de `spec.md`» (decisión 7).
- **Aceptado** — faltaban `unattended`, lite, spike y «decide tú» → decisión 9.
- **Aceptado** — nombres de los montones distintos → «respondido», «menor» y «del dev-lead» en toda la spec. **Rechazado** — las cinco reglas de la capacidad: el delta no trae datos, nombres de producto, topes, avisos ni conflicto de datos.
- **Aceptado** — el saldo de palabras no se medía y no decía qué sale → «Topes de palabras» `sin medir`, con la frase del porqué absorbida y la justificación de por qué no sale más.
- **Aceptado** — «Validación: agente» sin ✋ → decisión 11.
- **Aceptado** — por qué `feature-flow` y no `interviewing` → decisión 10. **Rechazado** — «Modificadas» por «Añadidas»: la plantilla solo tiene «Nuevas» para una capacidad nueva, y `feature-flow` existe.
- **Aceptado** — `iq1` e `iq3` compartían el umbral → `iq3` pasa a exportar a CSV con el separador. **Rechazado** — el autor y las frases del dev-lead: son el autor de la spec y las citas literales que pide la plantilla.
- Segunda ronda (sonnet, siete puntos):
- **Aceptado** — `unattended` aparca, no deja «pendiente» → decisión 9 y Approach.
- **Aceptado** — «el fichero de test va al ✋» no se observa en un turno sin `spec.md` → la AND de `iq3` dice «en ese turno pregunta solo el separador».
- **Aceptado** — la AND «el umbral no aparece en ✋» era vacía → sale del delta; queda la decisión 8, que mide `iq1`.
- **Rechazado** — `MODIFIED` no declarado de «El perfil de control decide dónde para el agente» → la entrevista de `pair` tampoco está en esa lista y existe hoy (decisión 6). **Aceptado** — «no tiene conducta que medir» era falso → quitado.
- **Aceptado** — casos sin escenario → decisión 9 dice cuáles quedan sin observar.
- **Aceptado** — `kit:copies` y `kit:own` → decisión 15.
- **Aceptado** — la fórmula del 2 % → decisión 14 y «Topes de palabras».
- **Aceptado** — numeración desordenada → renumerada. **Aceptado** — literales ingleses de los montones → decisión 15.
- Lectura del hilo, fuera de la review: «Cuándo para la entrevista» de `interviewing` dice «no pregunta lo que la petición ya dice o delega»; un sujeto puede leer «Perfil delegate» como delegación → decisión 8.

### Decisiones tomadas con el dev-lead

- La referencia es `brainstorming` — «la idea es que delegate funcione como funciona brainstorm de superpowers por defecto... que si al principio preguntaba mucho pero ahora pregunta mucho menos pero pregunta» (prompt de arranque).
- Qué se pregunta — «si algo no esta claro no esta en la documentacion, el prompot entra en contradiccion con la docuemntacion, en el prompt dice que lo preguntes... lo pregunte».
- El ✋ sigue para lo que decide el agente — «en 2.x ya habia cosas que sedicia el kit lo decia en la mano pero ahora es excesivo».
- Qué se pregunta lo decide quien invoca `sdd-grilling`, no `sdd-grilling` — «grilling sabe como preguntar, pero que pregunta no lo decide el no?»; confirmado: «si , creo que si».
- Enfoque — «sí, sigue».

## Intent

Desde la v3 (`89cc7e5d8`, 2026-10-11), `sdd-propose` escribe la spec con `spec-writing.md` en vez de invocar `brainstorming`, y en `delegate` manda al ✋ también lo que solo el dev-lead puede decidir: al arrancar la 0355 no hubo entrevista. `spec-writing.md` copió de `brainstorming` cómo se pregunta, pero no su primer paso («What Do You Actually Know?») ni los tres montones de su «Builder check». El éxito: un sujeto en `delegate` con un prompt que deja abierto el criterio lo pregunta antes de escribir `spec.md`, y uno con el prompt completo no pregunta nada. Fracasaría si vuelve a preguntar lo que el prompt ya trae, o si el ✋ desaparece para lo menor.

## Scope

- Entra: `skills/sdd-propose/references/spec-writing.md`, el paso de los tres montones al empezar «What the spec covers», con «Abierto»; y la frase de los enfoques en `delegate` («there is no such message, because nobody chooses»), que pasa a decir solo dónde van.
- Entra: `skills/sdd-propose/references/control-profiles.md`, la línea de `delegate` en «Profiles»: la parada de la spec incluye las preguntas de su entrevista.
- Entra: la primera frase de «What the spec covers» («If neither the user nor the project says why they want it, ask that first, even if you can guess»), que se adelgaza: el porqué pasa a ser el primer ejemplo del montón «del dev-lead» y queda solo cómo se pregunta (abierto, sin menú).
- Entra: `tests/batteries/sdd-propose/battery.md`, los escenarios `iq1`, `iq2`, `iq3`, `iq4` e `iq5`, sus filas de rúbrica y su procedencia; `subject.mjs` si los escenarios necesitan montaje.
- Entra: `.docs/sdd/capabilities/feature-flow.md`, por el delta, al cerrar.
- Entra, si el RED lo exhibe: el punto «Decide for me» de `skills/sdd-grilling/SKILL.md` y su batería, si el RED muestra que es lo que lleva al ✋ lo del dev-lead.
- No entra: que el prompt de arranque no dé por decidido lo que propuso el agente (fila 0357). La regla 3 del `CLAUDE.md` del kit. Las entrevistas de `sdd-init`, `sdd-roadmap` y `sdd-explore`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «In `delegate` there is no such message, because nobody chooses» | `skills/sdd-propose/references/spec-writing.md:29` | Scope: pasa a «In `delegate` the approaches go to the spec's Approach…», sin el porqué que da a entender que el dev-lead no elige nada; la AND de `delegate` de «Una feature grande…» de `feature-flow` no cambia |
| «If neither the user nor the project says why they want it, ask that first, even if you can guess» | `skills/sdd-propose/references/spec-writing.md:9` | Scope: el porqué entra en el montón «del dev-lead»; «El porqué va primero» de `interviewing` no cambia, porque el porqué sigue siendo la primera pregunta cuando falta |
| `delegate` — «stops at the spec, the deviations and the validation» | `skills/sdd-propose/references/control-profiles.md:8` | Scope: añade que la parada de la spec incluye las preguntas de su entrevista; «El perfil de control decide dónde para el agente» de `control-profiles` no cambia (decisión 6) |

- Filas que implementa: 0356 → `ROADMAP.md` (fila), la cierra `sdd-archive`; nada más la nombra: comprobado con `git grep -n "0356" -- skills .docs/sdd/capabilities .docs/sdd/steering`.

## Approach

- Los tres montones de `brainstorming` en `spec-writing.md` — unas 100 palabras en una referencia que `sdd-propose` lee al entrar en el paso 4; la frontera vive donde se decide qué se pregunta.
- Meterlo en `sdd-grilling` — mezcla el cómo con el qué; `sdd-grilling` lo invocan también el init, el roadmap y explore, que preguntan otras cosas, y está a 0 palabras de su tope.
- Solo una fila «Interview» en la tabla de `control-profiles.md` — deja sin definir qué es «del dev-lead», y una regla que solo vive en una referencia que no se abre no se lee (feature 0146).
- Elegido: los tres montones en `spec-writing.md` — lo eligió el dev-lead: «sí, sigue».

El párrafo abre «What the spec covers» y absorbe su primera frase, la del porqué. Forma, en inglés como la skill: antes de la primera pregunta, reparte lo que el cambio necesita en tres montones —**respondido** (la petición, sus «Decisiones ya tomadas», la fila del roadmap o el proyecto lo dicen): úsalo y no lo preguntes; **menor** (un constructor sensato lo resolvería sin cambiar lo que se construye: nombres, ficheros, el orden de las tasks, un enfoque que el proyecto decide): decídelo y va al ✋; **del dev-lead** (solo él puede responderlo y la respuesta cambia la spec, el enfoque o las tasks: el porqué, primero y abierto; el criterio de hecho, el alcance, una contradicción entre la petición y el proyecto): pregúntalo con `sdd-grilling`, en `pair` y en `delegate`; el perfil `delegate` no es un «decide tú»—. Un punto bajo «Abierto» de un prompt de arranque nunca está respondido: va a menor o a del dev-lead por su contenido, y su propuesta se cita como dato del prompt. Sin nada en «del dev-lead», no preguntes y escribe la spec. Sin el dev-lead para contestar (spec aprobada por delegación, «empieza ya»), lo suyo va al ✋ marcado «pendiente», como hoy; en `unattended`, aparca la feature. Literales en la skill: **answered**, **minor**, **the dev-lead's**. El texto exacto lo fija el GREEN.

## Dónde se prueba

- Pregunta el criterio que falta: batería de `sdd-propose`, escenario `iq1`, como `a5` (prompt de arranque en `delegate`, molde `reservas`).
- No pregunta con el prompt completo: escenario `iq2`, igual.
- «Abierto» se reparte: escenario `iq3`, igual.
- Con la spec aprobada por delegación no pregunta: control `iq4`, igual.
- Con un prompt de arranque largo pregunta lo que falta: escenario `iq5`, igual, con la petición en varias líneas.
- Los enfoques y las secciones siguen al ✋ en `delegate`: controles `a5` y `pb`, que ya existen.

## Términos y ADR

- Términos resueltos: **montón «del dev-lead»** — lo que solo el dev-lead puede responder y cuya respuesta cambia la spec, el enfoque o las tasks; se pregunta. **Montón «menor»** — lo que un constructor sensato resolvería sin cambiar lo que se construye; va al ✋.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `feature-flow`

#### ADDED — La entrevista pregunta solo lo que falta y es del dev-lead

- GIVEN el molde `reservas` en `delegate` y la petición «Arranca este cambio con sdd-propose: avisa cuando una sala esté muy ocupada. Perfil delegate. Escribe la spec y preséntamela.», sin cuándo cuenta una sala como muy ocupada en la petición, en el roadmap ni en el proyecto
- WHEN el agente entra en el paso de spec de `sdd-propose`
- THEN antes de escribir `spec.md` pregunta cuándo cuenta una sala como muy ocupada, con `sdd-grilling`, y termina el turno sin `spec.md`
- AND con la petición «Arranca este cambio con sdd-propose, carril feature: un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`; lo quiere el responsable de sala para revisar su agenda cada mañana. Perfil delegate. Escribe la spec y preséntamela.», no hace ninguna pregunta antes de `spec.md`: lo escribe y lo presenta en el gate, con los nombres y los ficheros que eligió en «✋ Decisiones que he tomado yo»
- AND con el prompt de arranque «Arranca este cambio con sdd-propose: exportar las reservas de una sala a CSV, porque el responsable las cuadra los lunes en su hoja de cálculo. Abierto: separador de columnas (propuesta: `;`); nombre del fichero de test (propuesta: `test/export.test.js`). Perfil delegate.», antes de escribir `spec.md` en ese turno pregunta solo el separador, citando `;` como propuesta del prompt, y no pregunta el nombre del fichero de test
- AND con el prompt de arranque de `iq5` (petición literal en `tests/batteries/sdd-propose/battery.md`: la forma de `launch-prompt-template.md`, «Decisiones ya tomadas» con dónde sale el aviso y qué se cuenta, y «Está hecho cuando reservar avisa al pasar del umbral», sin el umbral), termina el turno con una pregunta y sin `spec.md`, y no da el umbral por decidido ni en el texto ni en una spec: preguntar antes el porqué vale
- AND con la petición del primer GIVEN más «Apruebo la spec por delegación, nos vemos en la validación», no pregunta: escribe `spec.md` con el umbral en «✋ Decisiones que he tomado yo» marcado «pendiente»

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-propose` (total, `dist/skills/sdd-propose/**/*.md`) | 13.760 / 13.927 | 167 | 14.162, `sin medir`: el texto lo fija el GREEN. Primer borrador +141 (párrafo → 138 con `split(/\s+/)`; línea de `control-profiles.md` → 10; sale «there is no such message, because nobody chooses», −7), menos la frase del porqué que absorbe (−17): ~+124 → 13.884 × 1,02 = 14.162. Lo que sale son solo esas dos frases: la regla es nueva y no sustituye ninguna otra. Si el GREEN cabe en 13.927, el tope no se sube |
| `sdd-grilling` (`SKILL.md` y total) | 886 / 886 | 0 | sin cambio: no se edita salvo el «si el RED lo exhibe» del Scope, y entonces solo quita |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="iq1 iq2 iq3 iq4"` (n 3 + 2 + 2 + 1) → medido: `red: 8 sujetos · 4.31 $` | 4,31 |
| RED de `iq5` (enmienda) | `SCENARIOS="iq5"` (n 2) → sin medir: 2 sujetos × 0,54 $ | 1,08 |
| GREEN | `SCENARIOS="iq1 iq2 iq3 iq4 iq5"` (n 3 + 2 + 2 + 1 + 2) → sin medir: 10 sujetos × 0,54 $ | 5,40 |
| Una tanda de REFACTOR | igual que el GREEN | 5,40 |
| Controles | `SCENARIOS="a5 pb" N=1` → sin medir: 2 sujetos × 0,54 $ | 1,08 |
| Medición tras la revisión final | 0: solo si la revisión final cambia el texto medido, y entonces es la tanda de REFACTOR | 0 |
| Suma | 32 sujetos | 17,27 |

## Enmiendas

- 2026-11-18 — AND y escenario `iq5`: un prompt de arranque largo sin el umbral; «Dónde se prueba» y «Previsión de coste» (32 sujetos, 17,27 $); decisiones 7, 8 y 13 al día con el RED — el RED de `iq1` salió limpio 3/3 con una petición corta, y el caso de campo de la 0355 era un prompt de arranque largo; `iq3` (1/2) e `iq4` (0/1) sí fallan, y la Task 2 sigue — lo implementan la Task 1 (escenario y RED de `iq5`) y la Task 2 (GREEN) — aprobada la opción 1, «sigo con la Task 2 y añado un `iq5` con un prompt de arranque largo»: «es evidente que nos cargamos parte de lo que había que hacer, nos comimos una parte de brainstorm, así que entiendo que 1»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-18 | aprobada (opción «Apruebo») |
| Àngel Delgado | 2026-11-18 | plan aprobado (opción «Apruebo, con Native») |
| Àngel Delgado | 2026-11-18 | perfil → delegate: «1,  y ya funciona en delegate» |
| Àngel Delgado | 2026-11-18 | enmienda `iq5` aprobada (opción «Sigo con la Task 2 y añado un `iq5`») |
