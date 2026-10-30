---
id: 20261030-140305-feature-0264-patch-predicate-and-row-files
feature: 0264
parent: 0224
title: El predicado de patch en el roadmap y la evidencia de una fila nacida de otro cambio
mode: full
profile: delegate
status: approved
created: 2026-10-30
author: agente con el dev-lead
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-30
---

# Spec — El predicado de patch en el roadmap y la evidencia de una fila nacida de otro cambio

🦆 Quien apunta en el roadmap tres arreglos con tres tests ya no recibe una fila «Patch:» que luego hay que subir de carril y renombrar: sale como lite o feature, y su prompt abre `feature/0008-…`. Y si la fila nace de un cierre cuyo gate midió 40 min, enlaza el `patch.md` con la sección de las medidas, que se guardan ahí antes de que se borre el scratchpad. Los otros dos frentes salen: un sujeto sin regla ya hizo lo correcto. El saldo de la skill baja 11 palabras.

Validación: agente — son texto de una skill y su batería, y `validation.mode: field` en este repo; el uso real llega por los tickets.

## Capacidades

- Modificadas: `planning` — dos requisitos nuevos: «Una fila con dos o más tests de comportamiento nuevo no es un patch» y «Una fila nacida de otro cambio enlaza su artefacto».

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: ninguna · tamaño: ~10 líneas en 1 skill, más la batería
- Mínimo razonable: ninguna — deja sin mirar si otro requisito de `planning` choca con los dos nuevos; lo he buscado yo: «Un patch pendiente es una fila de «Próximo»» sigue valiendo para un patch de un test.

1. **Dos frentes salen por el RED, con tu regla de la petición.** Un sujeto Sonnet válido por frente, kit de `6cdb2196`:
   - **La 0250, ficheros leídos del código** (`rf1`): limpio. Con «creo que el arreglo va en src/avisos.js», leyó que solo reexporta y escribió `**Toca:** src/lib/notify.js`. La regla del paso 6 de «Prepare a release» no se mueve.
   - **La mitad de patch de los topes** (`pw1`): limpio. Midió la guía antes de tocarla, paró y preguntó entre subir el tope o acortar la línea; subió el tope con la respuesta y no recortó nada. `skills/sdd-start-patch/SKILL.md` no se edita.
2. **Por eso no se salda todo lo que pedía tu prompt.** No se saldan la (a) de «Menores del ticket del patch 0212», la (a) de «Menores del ticket del patch 0254» ni la mitad de patch de «Un patch que añade texto…». Pasan a «Esperar otro caso», con los veredictos `rf1` y `pw1`, y la fila 0250 sigue aparcada, con ese motivo. Siguen siendo posibles falsos negativos: un sujeto, un molde pequeño y una sesión corta, frente a casos de campo de una sesión de coordinación larga (ticket de la 0224 §1).
3. **(a) se queda: `rl1` falla.** Escribió «Patch: validar argumentos de `salas`» con tres arreglos, y justificó el prefijo por la forma 2.x del roadmap.
4. **(c) se queda, con un fallo menor que el de campo.** `re1` no perdió las cifras: las copió a la celda de la fila. Pero no enlaza el `patch.md` de la 0007 ni lo toca, y su prompt no nombra el artefacto. Falla RE1 por el enlace, y el roadmap es un índice: las medidas no viven ahí.
5. **Con el patch cerrado, las cifras entran como adenda fechada**, porque el Art. XI no deja reescribir el cuerpo de un artefacto de evento.
6. **Literal de las reglas**, en «Something concrete» de `skills/sdd-roadmap/SKILL.md`:
   - «Before writing «Patch:» or `**Carril:** patch`, count the tests of new behavior the row asks for: with two or more it is not a patch but lite or feature, and its prompt opens `feature/<id>-<slug>`.»
   - «A row born from the measures or conclusions of another change links that artifact (`patch.md` §N, `walkthrough.md`), with the figures it cites added there first, as a dated addendum if it is closed: a scratchpad is deleted.»
7. **Lo que paga el saldo**, contado sobre el texto propuesto: 71 palabras nuevas y 82 fuera, 3.595 → 3.584. Salen cuatro líneas de `sdd-roadmap` que repiten otra de la misma skill; ver «Lo que se retira». Sin RED propio: no quitan ninguna instrucción, y `m5` y `rf1` hacen de control.
8. **Las cuatro filas de deuda con «Actuar → 0264» que esta spec no arregla** («En lite, la apertura…», la parcial de la 0199, «El paso 6 de `sdd-roadmap`…» y «Al partir una fila…») pasan a `**Actuar**: sin fila`, para que no apunten a una fila cerrada. Es la revisión que pide la fila 0264; tu alcance no las nombraba.
9. **Un hallazgo fuera de alcance, para el ticket:** 3 de 3 sujetos de `sdd-roadmap` chocaron con `sdd roadmap publish`, «destino con cambios», porque editan la rama de integración en su propio checkout; dos commitearon a mano, saltándose el cerrojo, y uno dejó la fila sin publicar. No se arregla aquí.
10. **El RED costó más de lo debido, por errores míos en el molde:** 1,38 $ en 6 sujetos, de los que 2 (0,51 $) no midieron nada: uno documentaba un comando inexistente y los dos tenían mal calculado el tope. Un error de sintaxis tumbó además la primera tanda de `sdd-roadmap`, sin coste. Los sujetos válidos están en `roadmap/red/out/` y `propose/red/out/`.
- Prueba del delta en una copia de `.docs/sdd`: `capability merge` → planning.md: añadido «Una fila con dos o más tests de comportamiento nuevo no es un patch» · añadido «Una fila nacida de otro cambio enlaza su artefacto»
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica · sujetos sonnet, en una tanda por escenario · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar

### Decisiones tomadas con el dev-lead

- Un frente de conducta se reproduce con un sujeto RED antes de presentar la spec y, si sale limpio, se saca y se dice — «Un frente de conducta se reproduce con un sujeto RED antes de presentar la spec, y si sale limpio se saca y se dice» (2026-10-30)
- El saldo de palabras se cuenta sobre el texto propuesto — «El saldo de palabras de cada skill editada queda igual o baja, contado sobre el texto propuesto» (2026-10-30)
- La línea `Evidencia:` no se añade a `launch-prompt-template.md` — «no se añade» (2026-10-30)

## Intent

`sdd-roadmap` escribe «Patch:» sin contar tests: las filas 0211 y 0220 arrancaron en un carril que no era, con un renombrado de rama dentro de un worktree. Y una fila nacida de otro cambio no enlaza de dónde sale: las medidas de la 0219 se perdieron con el scratchpad y hubo dos vueltas del dev-lead. Éxito: `rl1` no escribe «Patch:» y su prompt abre `feature/`; `re1` enlaza el `patch.md` con la sección de las medidas. Fracasaría si alarga la skill: el saldo baja.

## Scope

- Entra: `skills/sdd-roadmap/SKILL.md` («Something concrete», red flags y racionalizaciones), `tests/batteries/sdd-roadmap/`, el escenario `pw1` de `tests/batteries/sdd-propose/`, `.docs/sdd/capabilities/planning.md` por el delta, `.docs/sdd/roadmap.md`.
- No entra: `skills/sdd-start-patch/SKILL.md` y la regla de «Prepare a release» (decisión 1); la línea `Evidencia:` de `launch-prompt-template.md`; `sdd roadmap publish` (decisión 9).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Racionalización «I freeze the scope in a separate document» | `skills/sdd-roadmap/SKILL.md:155` | Scope: se borra; ningún escenario la cita, y «Prepare a release» ya dice dónde vive el scope |
| Red flag «edit the row or the spec of a feature in flight» | `skills/sdd-roadmap/SKILL.md:136` | Scope: se borra; lo dicen el paso 1 y la racionalización «The note is on the topic» |
| Red flag «rewrite a rule of a proposal» | `skills/sdd-roadmap/SKILL.md:134` | Scope: se borra; lo dicen «Reorder or change» y la racionalización «The proposal's example» |
| Red flag «take in a meeting without keeping its literal notes» | `skills/sdd-roadmap/SKILL.md:133` | Scope: se borra; lo dicen «A meeting» y la racionalización «The notes are already» |

- Filas que implementa: 0264 → `.docs/sdd/roadmap.md`; se saldan «La fila y el prompt…» y «El prompt de arranque…»; la 0250, los dos menores y «Un patch que añade texto…» → decisión 2; las cuatro de la decisión 8. Comprobado con `grep -rln 0264 skills .docs/sdd/capabilities .docs/sdd/*.md tests/batteries`: solo `roadmap.md` y las dos baterías.

## Approach

Dos frases en «Something concrete», que es donde el triaje y cualquier otra entrada escriben su fila («A new row is written like any concrete thing»). `launch-prompt-template.md` no cambia: su `Carril` ya sale de la fila.

## Dónde se prueba

- Carril de la fila: batería de `sdd-roadmap`, `rl1` con n = 2 y `TURN2` «Dame el prompt de esa fila.» (RL1).
- Evidencia de la fila: batería de `sdd-roadmap`, `re1` con n = 2 (RE1).
- Controles: `m5` (fila nueva) y `rf1`, n = 1; `pw1` se queda en la batería de `sdd-propose` sin relanzar, porque esa skill no cambia.
- Saldo de palabras: el conteo de `cli/test/kit/word-budget.test.ts`, antes y después, en el walkthrough.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `planning`

#### ADDED — Una fila con dos o más tests de comportamiento nuevo no es un patch

- GIVEN el molde `salas` y «apunta en una sola fila estos tres arreglos: `libres 25:00-26:00` debe responder «franja no válida: usa HH:MM-HH:MM»; `cancelar Norte`, «indica un día»; `reservar`, «indica una sala»»
- WHEN `sdd-roadmap` escribe la fila y da su prompt
- THEN la fila no empieza por «Patch:», ni lleva `**Carril:** patch` en `ROADMAP.md`
- AND el prompt lleva `***Carril:***` lite o feature y `***Nombre:***` `feature/<id>-<slug>`

#### ADDED — Una fila nacida de otro cambio enlaza su artefacto

- GIVEN el patch 0007 cerrado, cuyo gate midió 40 min, con las medidas por fichero solo en `.temp/gate-times.log`, sin versionar
- WHEN el agente apunta la fila para bajar el gate
- THEN la fila enlaza el `patch.md` de la 0007 con la sección de las medidas
- AND ese `patch.md` lleva las cifras que cita la fila (`test/store.test.js` 31 min 40 s), en una adenda fechada

## Topes de palabras

Medido con `wc -w`; el plan lo contrasta con el conteo de `cli/test/kit/word-budget.test.ts`.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-roadmap` | 3.595 / 3.600 | 5 | sin cambio: 3.584 con el texto propuesto |

## Previsión de coste

Precio: 0,17 $ por sujeto de `sdd-roadmap`, medido en este RED (0,52 $ / 3); con el segundo turno de `rl1`, ~0,20 $.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED, ya gastado | 6: `rl1`, `re1`, `rf1` y `pw1` ×3 | 1,38 |
| GREEN | 4: `rl1` ×2, `re1` ×2 (`sdd-roadmap`) | 0,80 |
| Una tanda de REFACTOR | 4: los mismos | 0,80 |
| Controles | 2: `m5`, `rf1` | 0,40 |
| Medición tras la revisión final | 2: `rl1`, `re1` | 0,40 |
| Suma | 18 | 3,78 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-30 | aprobada: «ok» |
