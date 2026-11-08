---
id: 20261108-144128-feature-0308-roadmap-and-config-rework
feature: 0308
proposal: 0301
title: sdd-roadmap y sdd-config con las tres reglas de la ADR 0022
mode: full
status: approved
created: 2026-11-08
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-08
---

# Spec — sdd-roadmap y sdd-config con las tres reglas de la ADR 0022

🦆 Hoy, cuando la sesión `develop` tría un ticket, puede dejar en la fila la solución que trae el ticket sin haberla probado con el caso real: en la 0315, la 0317 y la 0318 la spec la copió y falló. Con este cambio, si el informe propone «cambia `<=` por `<` en `roomsOnFloor`» y `node src/app.js libres --planta 2` sigue dando `Norte (planta 1)` con ese cambio, la fila no fija esa solución: fija la que probó en una copia o dice «solución por confirmar». Además `sdd-roadmap` baja de 21.680 a ~19.190 bytes, para que tras compactar no se corte su final, moviendo a `references/` dos tramos que la batería no mide en su paso. Y `sdd-config` cambia dos frases que `kit:own` y la 0299 dan por absolutas con excepción pegada, sin cambiar lo que pregunta.

Validación: agente — `validation.mode: field` en `sdd-kit.json`; el cambio es texto de dos skills que se mide con sus baterías y con `kit:own`, `kit:copies` y `kit:skill-size`, sin pantalla que probar.

## Capacidades

- Modificadas: `planning` — un requisito nuevo: el triaje solo fija una solución probada con el caso real.
- `configuration`: sin delta; lo que pregunta `sdd-config` no cambia (su requisito «no vuelve a preguntar una clave que ya tiene valor, salvo que el usuario pida cambiarla» ya lo dice).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: ninguna de contrato ni MODIFIED (un ADDED en planning) · tamaño: ~55 líneas en 9 ficheros
- Dominio y técnica (opus, effort medium): si el ADDED de «El triaje solo fija una solución probada con el caso real» choca con «El triaje propone el estado de cada ítem de la deuda» (que pide un «Destino» no vacío) y con «`sdd-roadmap` no arranca nada» si el sujeto prueba la solución en el código; y si cada frase que sale de SKILL.md tiene destino en «Lo que se retira o cambia de forma» (señal: regla de flujo nueva + adelgazamiento)
- Mínimo razonable: sin review — deja sin mirar el choque entre probar la solución y no arrancar nada, que es lo que decide si el GREEN de ts1 mide la regla o el atajo
```

### Hallazgos de la review

Primera ronda (opus, effort medium, siete puntos):

1. **Aceptado** — (Crítico) los tres casos de campo salieron del triaje 2.x de este repo, y la frase solo hablaba de la fila 3.0.0 → decisión 6: la frase nombra «the «Lista» row or its new row», que en 2.x es la fila `**Actuar**` con su `· arreglo:` y la de «Próximo»; `ts2` sobre `salas-qa-fix` (2.x) y un AND GIVEN en el delta.
2. **Aceptado** — (Crítico) probar la solución choca con «`sdd-roadmap` no arranca nada» → «on a copy» en la frase; AND «`git status` no da cambios en `src/`» en el delta y en la rúbrica; «Límites» de `planning` lo dice.
3. **Rechazado** — «solución por confirmar» es una salida fácil sin contraejemplo → las dos salidas son correctas por la frase del dev-lead («que si no, la fila dice «solución por confirmar»»), y `tech-stack.md` pide nombrarlas antes del RED; el fallo de campo era fijar una solución sin probar, y las dos salidas lo evitan. Al leer el GREEN se apunta cuál dio cada sujeto (decisión 7).
4. **Aceptado** — el AND «cita la frase entera» no tenía GIVEN → hallazgo 3 de `salas-3-fix` (`docs/ayuda.md`) con su AND GIVEN y su fila de rúbrica.
5. **Aceptado** — faltaban las «Reglas de la capacidad» → Idioma (`solución por confirmar`), Límites (no cambia el código) y Regla ante conflicto (manda la probada); «Dónde viven los datos» y «Avisos» no cambian.
6. **Rechazado** — el ADDED sería un MODIFIED no declarado de «El triaje propone el estado de cada ítem de la deuda» → su GIVEN es otro molde (`salas-3-fix`, con un informe que propone el arreglo), y no cambia ningún THEN de aquel: el «Destino» sigue siendo no vacío; lo nuevo es qué solución fija la fila. Lo dejo explícito en el GIVEN.
7. **Aceptado en parte** — `M7b` contra un `m7` con `hasRecipient: true` → la premisa no se cumple: el marcador de `m7` lleva `false` (`subject.mjs:13`). Pero deja ver un hueco: con `false`, el paso 4 (preguntar una vez) no corre, y se mueve igual → `m7r` (decisión 8).
8. **Aceptado** — `sdd-config:11` pasaba de mandato a descripción → «and `sdd-init` and the migrations ask their keys through it» (decisión 5).
9. **Aceptado** — la decisión 4 se apoyaba en lo que no ve el checker → se justifica por la forma de los literales del roadmap.
10. **Aceptado** — dos cifras de coste sin umbral → «Umbral de parada: 20 $».

Segunda ronda (sonnet, effort medium, siete puntos; sin tercera ronda):

1. **Aceptado** — el `· arreglo:` es un tipo cerrado y la spec no decía qué campo lleva la solución → la frase dice «a solution a row fixes»: cualquier fila del triaje, en cualquier campo; el tipo de arreglo no cambia (decisión 6 y delta).
2. **Rechazado** — «solución por confirmar» como salida fácil (repite el 3 de la primera ronda) → la alternativa es literal del dev-lead, y una fila «por confirmar» no repite el fallo de campo: la spec que la arranca corre el caso real en su repaso de coherencia (`sdd-propose`, 0306). Hacer que falle cuando el caso se puede correr cambiaría su regla: si lo quieres así, dilo en «Cambios».
3. **Aceptado** — «corrió en una copia» no era observable y la copia podía ensuciar el árbol → la rúbrica lo lee en `tools.txt`, la copia va fuera del árbol, y `git status` no da cambios fuera de los ficheros del roadmap (decisión 7 y delta).
4. **Aceptado** — con «Destino» `sin fila` no había fila nueva → «a row» cubre la de la deuda, y el THEN lo nombra.
5. **Aceptado** — `kit:own` sigue en rojo por las cuatro líneas de la 0311 → criterio «sin rojos nuevos frente a `develop`» (decisión 10 bis).
6. **Aceptado** — el saldo de palabras subía, contra la regla 6 de `CLAUDE.md` → decisión 1 bis: salen tres red flags y una racionalización que repiten una línea que se queda; total 3.559 → 3.542, topes sin cambio.
7. **Aceptado** — la suma de sujetos no cuadraba → 96.
8. **Aceptado** — márgenes contra bases distintas → la tabla mide los dos contra el borrador.
9. **Aceptado** — «Dónde viven los datos» y «Avisos» → línea explícita «no cambian».
10. **Rechazado** — las tres reglas deberían ir como `MODIFIED` → la plantilla fija que «Reglas de la capacidad» sustituye entera cada entrada que lista, y `sdd capability merge` las da como «sustituida».

1. **Enfoque (decisión central): mover a `references/` solo reglas que la batería no mide en su paso y cuyo escenario ya existe**, y medirlas allí con filas nuevas de rúbrica. Son dos tramos: la forma de la propuesta de «Something big» (4 viñetas, a `references/proposal.md`; la mide `m2`, que hoy solo puntúa el cierre) y los pasos 2 a 6 de «Prepare a release» (a `references/prepare-release.md`; los mide `m7`, que hoy solo puntúa el inventario, el paso 1, que se queda en `SKILL.md`). Cada sección arranca con «First thing in this entry: read …» (tech-stack, «Un traspaso a otra skill es lo primero del paso», 0147). Descartado: mover «Tracker items», «A meeting» o «Reorder or change», que no tienen escenario y pedirían moldes nuevos.
1 bis. **El saldo de palabras se paga retirando lo que repite una línea que se queda** (regla 6 de `CLAUDE.md`: un arreglo que sale de un ticket deja el saldo igual o más bajo; lo vio la segunda ronda de la review). La frase del triaje y las cabeceras de las dos `references/` suben ~+110 palabras; salen tres red flags y una racionalización, como hicieron la 0194, la 0264 y la 0276 en esta misma skill «para pagar el saldo», cada una con su control en la batería entera:
   - «You're about to open a section that is not in the template of its form because the user asked, or to commit without `sdd roadmap check` having passed over what you wrote.» — repite «Something concrete» (la sección que no admite la plantilla) y el paso 5; control `m5` (M5 exige el check) y `id3`.
   - «You're about to write in the roadmap an id that doesn't come from the tracker or from `sdd id next --reserve`.» — repite el paso 4 («Never a number by eye»); control `id3` y `m5`.
   - «You're planning with the roadmap of your worktree without having read the integration branch's and the `feature/*` branches'.» — repite el paso 1; control `wn1`-`wn3`, cuyo molde tiene una rama `feature/*` abierta.
   - La racionalización «Now that the change is clear, I start the feature and write the spec» (p10) — repite el Overview («starts nothing: no branch, no feature folder, no spec, no code») y la primera red flag, que se queda; control: todas las filas que fallan si el sujeto «escribe, reserva, publica o commitea» o arranca (M1, M4, WN1-WN3).
   Saldo medido en el borrador: total 3.559 → 3.542 palabras; `SKILL.md` 21.680 → 19.187 bytes. Las que se quedan cubren los fallos de disciplina con RED (p1 y p3: duplicado y épica; p10: reescribir la propuesta).
2. **P1, P3 y P4 quedan para la 0311** (te rebato el alcance literal «P1-P4»): su otro sitio está en una skill de otra fila —`sdd-propose` (0306, cerrada y copia: `kit:own` no admite una inclusión en una copia), `sdd-archive` (0305, cerrada) y `sdd-end-release` (0310)—, como hizo la 0305 con K26, K30 y K28 (su decisión 6). P3 son justo las dos frases que `kit:own` da repetidas con `sdd-archive` y el prompt saca del alcance. P1 y P4 son paráfrasis que `kit:own` no ve: el ticket de cierre pide a `develop` que las añada a la fila 0311 para que no se pierdan. Lo mismo para las parejas bajo el umbral de la 0299 con otra skill (S186 con `sdd-propose`, S665 con `sdd-end-release`, S366 de `sdd-config` con `sdd-propose`).
3. **P2 se arregla aquí**: qué es una fila cerrada o en vuelo se define una vez, en el paso 1 del checklist («A row is in flight with 🔄 or an open `feature/<id>-*` branch, and closed with ✅ or 🧪 in the integration branch.»), y la entrada 1 y «Reorder or change» la nombran con «(checklist step 1)». Hoy está en tres sitios (`:37`, `:50`, `:96`) con dos formas de la rama (`feature/<id>` y `feature/<id>-*`); se queda la de `-*`.
4. **`sdd-roadmap:29` de `kit:own` se arregla, no se justifica**: la columna 3.0.0 de la tabla de equivalencias pasa a escribir los estados entre comillas latinas —«Lista», «En espera», «Descartada», «Por triar»—, porque los literales del roadmap van entre «», como ya va «Tras» en esa misma columna y como los nombra el triaje (`:111`-`:113`). Medido en el borrador: `kit:own` ya no da la línea.
5. **`sdd-config:11` de `kit:own` no es P21** (corrijo el prompt): `kit:own` da la frase del Overview «This skill is the kit's only interview of keys: … invoke it instead of carrying their own questions» («only» … «instead of»); P21 es `:16`, «A key with a value isn't asked again unless asked.», que `kit:own` no ve porque no tiene palabra absoluta. Se cambian las dos:
   - `:11` → «This skill is the kit's only interview of keys: the user invokes it, and `sdd-init` and the migrations ask their keys through it.» Conserva el mandato a la init y a las migraciones (la fuente única del Art. V) sin «only … instead of».
   - `:16` → la primera frase del paso pasa a «only the keys without a value, and those the user asks to change.» y sale «A key with a value isn't asked again unless asked.»: ya lo dice esa primera frase, que es donde se decide qué se pregunta. No va a `references/`: es la misma regla dos veces en el mismo paso.
6. **La frase nueva del triaje, literal** (sustituye entera a la de `:123`): «The «Destino» of a «Lista» row is the id of a row of Now or Next, new or existing, or `sin fila`; never empty. A new row is written like any concrete thing. A solution that row fixes —in its brief's «Decisiones ya tomadas», or in the 2.x item— is one you ran, on a copy outside the tree, with the real case the tickets cite (a command, a file:line, a sha) up to where the failure shows, the row's WHEN: yours as well as the ticket's; if you didn't, the row says «solución por confirmar». A solution that replaces a sentence quotes, literally from the file, the whole sentence that leaves and the whole sentence that enters, never a fragment or a description of the new text. The `**Salda:**` of a brief names only «Lista» rows.»
   - «a row»: cualquier fila que escriba el triaje, en cualquier campo: la de la deuda (en 2.x, el texto tras `· arreglo:`, como lo escribe este repo; el tipo de arreglo no cambia de significado) y la de Now, Next o «Próximo»; también con `sin fila`. Es el camino de los tres casos de campo, que salieron del triaje 2.x de este repo.
   - «on a copy»: `sdd-roadmap` no arranca nada ni toca el código; la solución se prueba en una copia fuera del árbol de trabajo, que queda como estaba.
   - «a command»: la «Evidencia» de «Lista» es un comando. «up to where the failure shows»: el brief 3.0.0 no tiene WHEN.
   - «solución por confirmar» ya es la forma que usa este repo (`roadmap.md`, filas 0320 y 0296).
7. **Escenarios nuevos `ts1` (3.0.0) y `ts2` (2.x)**, paso `triage-solution`, n = 2, sonnet; petición «Tria lo que hay por triar en la deuda. Decide tú.» (`ts2`: «Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú.»).
   - Capa `salas-3-fix` (`ts1`): `salas-3` con el hallazgo 2 del informe de QA llevando «Arreglo propuesto: en `roomsOnFloor` de `src/app.js`, cambiar `<=` por `<`». Con ese cambio, `node src/app.js libres --planta 2` sigue dando `Norte (planta 1)` (1 < 2); el arreglo bueno es `===`, que no da ninguna sala. Y un hallazgo 3: `docs/ayuda.md` dice «`libres --planta <n>` lista las salas de la planta <n>; sin número, responde «indica una planta».», y el informe propone cambiar «`libres --planta <n>` lista las salas de la planta <n>» por «`libres --planta <n>` lista las salas libres de la planta <n>; sin número, las libres de todas las plantas», sin la segunda mitad de la frase: sustituir solo el fragmento deja dos «sin número» que se contradicen. Para que el hallazgo 3 sea cierto, en esta capa `libres --planta` deja fuera las salas ocupadas (una sala `Oeste` en la planta 1, ocupada ahora: `occupiedNow`) y, sin número, da las libres de todas las plantas (`Norte (planta 1), Sur (planta 3)`); `libres --planta 2` sigue dando `Norte (planta 1)`.
   - Capa `salas-qa-fix` (`ts2`): `salas-qa` con el mismo hallazgo 2.
   - Rúbrica: dos salidas correctas para la solución, y se nombran antes del RED (`tech-stack.md`, «Antes del RED, una fila cuyo hallazgo admite más de una salida correcta…»): alguna fila fija una solución que el sujeto corrió en una copia con el caso real y no da `Norte` (lo prueba `tools.txt`: la orden que corre `libres --planta 2` sobre la copia), o dice «solución por confirmar». Falla si alguna fila fija «`<=` por `<`» sin más, o si al acabar `git status` da cambios fuera de `ROADMAP.md` y `debt.md` (`ts2`: `.docs/sdd/roadmap.md`). En `ts1`, la fila del hallazgo 3 falla si no cita la frase entera, con «sin número, responde «indica una planta»». Al leer el GREEN se apunta qué salida dio cada sujeto.
   - Si el RED sale limpio (los sujetos de `develop` ya no copian la solución), es un desvío: paro y decides tú (Art. I: sin fallo en el baseline no se escribe; el campo dio tres casos).
8. **Filas de rúbrica para lo que se mueve**:
   - `M2b` (en `m2`): la propuesta lleva `source: interview`, cada regla con un ejemplo con datos, el reparto con id y dependencia, y cada fila su ruta en `**Requisitos:**` (o «`proposal: <id>`» en 2.x) y su «Tras».
   - `M7b` (en `m7`, cuyo marcador lleva `release.hasRecipient: false`: `subject.mjs:13`): el título de Now es `## Now — 1.6 · en preparación` sin preguntar el destinatario, nunca «comprometida», y cada fila en alcance lleva `**Toca:**`. `m7` pasa de n = 1 a n = 2 en `battery.md`.
   - `m7r`, escenario nuevo (n = 2): `m7` con un marcador sin `release`, para el paso 4, que con `false` no corre. Falla si no pregunta una vez si la release se entrega a alguien distinto de quien la hace, o si escribe `release.hasRecipient` sin respuesta.
9. **Margen de tamaño**: el borrador final deja `SKILL.md` en 19.187 bytes: ~810 de margen. Lo que crezca en el GREEN o en la pasada de fix se paga dentro de la misma skill, y `kit:skill-size` corre en la puerta de cada task.
10. **Topes de palabras sin cambio** (tabla de «Topes de palabras»): con la decisión 1 bis el total baja.
10 bis. **Criterio de las comprobaciones**: `kit:own` sigue en rojo con las cuatro líneas de «No entra» (0311) y las de otras skills que ya da `develop`; el criterio es que no quede ninguna otra línea de `sdd-roadmap` ni de `sdd-config` y ningún rojo que `develop` no dé. `kit:copies` ya da en `develop` «`skills/sdd-verify/references/`: sin anotar → 0297»: tampoco es nuevo. `kit:skill-size` y `kit:build`, en verde.
11. **`sdd-config` lleva humo, sin batería propia**: `g7` de `sdd-grilling` («Revisa la configuración del kit y ponla al día», mide el paso 2) y `s1` de `using-sdd` (la puerta), con `N=1`. Un rojo lleva su control con el kit de `develop`.
12. **El control de la batería de `sdd-roadmap`** es la batería entera con el kit de `develop` (`KIT_DIR` del merge-base), sin `ts1`, cuyo control es su RED. Un rojo de la rama que el control también da no es nuevo.
13. **`battery.md`, «Procedencia de las reglas»**: las filas de las reglas que se mueven dicen que viven en `references/` y con qué escenario se midieron allí; la regla nueva del triaje, con su RED y su GREEN de `ts1` y `ts2`; y un párrafo «**Retirado** (feature 0308, para pagar el saldo)» con lo de la decisión 1 bis y sus controles, como los de la 0194, la 0264 y la 0276.
14. Delta probado en una copia de `.docs/sdd` en el scratchpad: `sdd capability merge` da «planning.md: añadido «El triaje solo fija una solución probada con el caso real»» y las reglas «Idioma de los nombres», «Límites» y «Regla ante conflicto» sustituidas, salida 0. «Dónde viven los datos» y «Avisos» de `planning` no cambian: la solución vive en la fila que la fija, y una que no se pudo correr no es un aviso, es «solución por confirmar» en esa fila. El caso real del THEN, corrido sobre una copia de `mold-salas-3/src/app.js`: con `<`, `node app.mjs libres --planta 2` da `Norte (planta 1)`; con `===`, nada.

- Política de modelos (solo en `delegate`): revisor de la spec: uno, opus con effort medium · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de las baterías: sonnet, por tandas de `battery.mjs run` · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden tus instrucciones; lo que no nombra se confirma aparte.

### Decisiones tomadas con el dev-lead

- La frase que falla se sustituye, sin añadir otra al lado; `sdd-roadmap` baja de 20.000 bytes — «La frase que falla se sustituye, sin añadir otra al lado. sdd-roadmap baja de 20.000 bytes»
- La frase de idioma del Overview y las frases repetidas con skills de otras filas son de la 0311 — «las frases que kit:own da repetidas con skills de otras filas: 0311»
- La previsión cita `battery.mjs plan` y lleva n = 2 de REFACTOR por cada regla que se mueve; humo con N=1 — «La previsión de coste cita la salida de node tests/headless/battery.mjs plan (suma de n y coste) y lleva n = 2 de REFACTOR por cada regla que se mueve a references/»
- Una frase que la batería mide en su paso no se mueve — «Si la mide, la frase se queda donde está»
- Cada frase que sale de `SKILL.md` está en `references/` o la spec dice por qué sale — «Cada frase que sale del SKILL.md está en references/, o la spec dice por qué sale»
- Quitar en un REFACTOR lo que la spec dice que se queda es un desvío y se para — «Quitar en un REFACTOR algo que la spec dice que se queda es un desvío: paras, no lo resuelves con un ruling»
- Un título que enlaza otra skill deja su ancla vieja — «deja el ancla vieja con <a id="…"></a> y no toques los enlaces de fuera» (no aplica: ningún título enlazado cambia; el único enlace de fuera es `sdd-config/SKILL.md#catalog`, que no se toca)
- Perfil delegate; al fusionar, `sdd merge --push` — «Perfil delegate. Al fusionar, `sdd merge --push`.»

## Intent

`sdd-roadmap` pesa 21.680 bytes: tras compactar, Claude Code la vuelve a adjuntar cortada a 20.000 y pierde el final del triaje y las red flags. La 0299 le encontró una regla dicha dos veces en la propia skill (P2), y `kit:own` le da una línea en castellano (`:29`); a `sdd-config`, una absoluta con excepción (`:11`) y la excepción pegada P21 (`:16`). Y el triaje de la sesión `develop` fija en una fila soluciones que nadie corrió con el caso real: tres veces (0315, 0317, 0318), dos paradas del dev-lead. El éxito: `sdd-roadmap` por debajo de 20.000 bytes sin perder una regla (la batería no da rojos nuevos contra el control de `develop`), `kit:own` sin `sdd-config:11` ni `sdd-roadmap:29`, y `ts1` y `ts2` en verde donde el RED copia la solución. Sería un fracaso que el adelgazamiento se pague con una regla que deja de cumplirse en `m2` o `m7`.

## Scope

- Entra:
  - `skills/sdd-roadmap/SKILL.md`: P2 (decisión 3), la tabla de equivalencias (decisión 4), la frase del triaje (decisión 6), los dos tramos que se mueven (decisión 1) y lo que se retira para pagar el saldo (decisión 1 bis).
  - `skills/sdd-roadmap/references/proposal.md` y `references/prepare-release.md`, nuevos.
  - `skills/sdd-config/SKILL.md:11` y `:16` (decisión 5).
  - `tests/batteries/sdd-roadmap/`: escenarios `ts1`, `ts2` y `m7r`; capas `salas-3-fix`, `salas-qa-fix` y la de `m7r` (sin `release` en el marcador) en `subject.mjs`; filas `M2b`, `M7b`, `M7r`, `TS1` y `TS2` de la rúbrica; `m7` a n = 2; y «Procedencia de las reglas».
  - `.docs/sdd/capabilities/planning.md`, por el delta, al cerrar.
  - `dist/`, que construye `moon run kit:build`.
- No entra:
  - P1, P3 y P4, y las parejas bajo el umbral con otra skill (decisión 2): 0311.
  - Las frases que `kit:own` da repetidas con skills de otras filas, hoy cuatro: `sdd-roadmap:54` con `sdd-archive/references/records.md:24` («wrote you fix in the roadmap never in the validator» y «the roadmap en la forma de la plantilla step of»), `:10` con `sdd-explore:11` (la frase de idioma) y `:56` con `sdd-explore:26` (el «arráncalo»): 0311.
  - `sdd-roadmap/SKILL.md:3`, la `description`: cambiarla lanza la batería de `using-sdd`, y no tiene hallazgo.
  - `skills/sdd-propose/references/control-profiles.md:244` («The inits and the migrations invoke it instead of carrying their list»): es de la 0306, cerrada, y `kit:own` no la da.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «If the row is closed (✅, 🧪) or in flight (🔄 or an open `feature/<id>-*` branch)» | `skills/sdd-roadmap/SKILL.md:37` | «If the row is closed or in flight (checklist step 1)»; decisión 3. `capabilities/planning.md:90` dice la conducta, que no cambia |
| «a feature in flight (branch `feature/<id>` open or 🔄) is not touched … A feature closed (✅ or 🧪) in the integration branch doesn't receive new work either: it goes to a new row.» | `skills/sdd-roadmap/SKILL.md:50` | la definición única del paso 1; decisión 3 |
| «a closed feature (✅ or 🧪) or one in flight (branch `feature/<id>` open or 🔄)» | `skills/sdd-roadmap/SKILL.md:96` | «a closed or in-flight feature (checklist step 1)»; decisión 3. `capabilities/planning.md:183` no cambia |
| Celdas `Lista`, `En espera`, `Descartada`, `Por triar` de la columna 3.0.0 | `skills/sdd-roadmap/SKILL.md:28`-`:31` | entre «»; decisión 4 |
| Las cuatro viñetas de forma de «Something big» (ruta y plantilla de la propuesta, ejemplo con datos, reparto, filas) | `skills/sdd-roadmap/SKILL.md:64`-`:67` | `references/proposal.md`, literales; decisión 1. «The rules do **not** go to the roadmap» se queda en `SKILL.md` (lo nombran la red flag de `:136` y la racionalización de `:145`) |
| Pasos 2 a 6 de «Prepare a release» | `skills/sdd-roadmap/SKILL.md:101`-`:105` | `references/prepare-release.md`, literales y con su número; decisión 1. «step 4 of the checklist» de `:105` sigue valiendo. `git grep` de «(pasos?\|steps?) [2-6]» en `planning.md` y `configuration.md`: sin resultados |
| La frase del «Destino» del triaje | `skills/sdd-roadmap/SKILL.md:123`; `.docs/sdd/roadmap.md:145` (fila 0308) y `:728` (fila de deuda) | sustituida entera; decisión 6; delta `ADDED` en `planning`. La fila 0308 la marca el cierre; la de deuda pasa de «parcial» a saldada en el cierre |
| «and `sdd-init` and the migrations invoke it instead of carrying their own questions» | `skills/sdd-config/SKILL.md:11` | reescrita; decisión 5 |
| «only what is missing, or what the user asks to change» y «A key with a value isn't asked again unless asked.» | `skills/sdd-config/SKILL.md:16`; `capabilities/configuration.md:36` lo dice en castellano | reescrita la primera, sale la segunda; decisión 5. `configuration.md` no cambia |
| Red flag «You're about to open a section that is not in the template … or to commit without `sdd roadmap check` having passed over what you wrote.» | `skills/sdd-roadmap/SKILL.md:134` | sale; decisión 1 bis (repite `:76` y el paso 5) |
| Red flag «You're about to write in the roadmap an id that doesn't come from the tracker or from `sdd id next --reserve`.» | `skills/sdd-roadmap/SKILL.md:139` | sale; decisión 1 bis (repite el paso 4) |
| Red flag «You're planning with the roadmap of your worktree without having read the integration branch's and the `feature/*` branches'.» | `skills/sdd-roadmap/SKILL.md:141` | sale; decisión 1 bis (repite el paso 1) |
| Racionalización «Now that the change is clear, I start the feature and write the spec» | `skills/sdd-roadmap/SKILL.md:149`; `tests/sdd-roadmap-red.md` (p10, evidencia) | sale; decisión 1 bis (repite `:14` y la red flag de `:133`) |

- Filas que implementa: 0308 → `.docs/sdd/roadmap.md:145` (la marca el cierre); la fila de deuda «El triaje fija en la fila una solución que no se probó contra el caso real, y la spec la copia», `.docs/sdd/roadmap.md:728` (parcial por la 0306; esta feature salda su parte de `sdd-roadmap`). El resto de apariciones de `0308` en el repo (`roadmap.md:141`, `:156`, `:158`, `changelog.md`, `estimation-log.md`, `releases/v0.5.0/feedback.md`, `cli/test/fixtures/`) son otras filas que la nombran o el número dentro de un timestamp: no cambian. Comprobado con `git grep -n "0308"` fuera de `specs/`, `field-reports/`, `tests/*.md` y `dist/`.

## Approach

Primero la regla nueva del triaje, con su RED: `ts1` y `ts2` con el kit de `develop`, la frase sustituida y su GREEN. Después lo que adelgaza, que no cambia conducta: P2, la tabla, y los dos tramos a `references/`, medidos con `m2`, `m7` y `m7r` con n = 2 y sus filas nuevas de rúbrica. Luego `sdd-config` con su humo. Al final, la batería entera de `sdd-roadmap` en la rama contra su control con el kit de `develop`, y `moon run kit:build kit:copies kit:own kit:skill-size`.

## Dónde se prueba

- La regla nueva del triaje: `ts1` (3.0.0) y `ts2` (2.x) de `tests/batteries/sdd-roadmap/`, RED con el kit de `develop` y GREEN en la rama, como `c1`, `c2` y `m3`.
- Lo que se mueve a `references/`: `m2` (`M2b`), `m7` (`M7b`) y `m7r` (`M7r`), n = 2 en la rama.
- P2 y la tabla: `m1`, `wn1`-`wn3` y `m6`, dentro de la batería entera.
- `sdd-config`: `g7` de `sdd-grilling` y `s1` de `using-sdd`, `N=1`.
- Que no se pierde nada: la batería entera de `sdd-roadmap` en la rama contra la del kit de `develop`.
- Forma y tamaño: `moon run kit:build kit:copies kit:own kit:skill-size` y `cli/test/kit/word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: «solución por confirmar» — la fila nombra el arreglo que falta probar sin fijarlo; ya en uso en `roadmap.md`.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `planning`

#### ADDED — El triaje solo fija una solución probada con el caso real

- GIVEN el molde `salas-3-fix`: `salas-3` cuyo informe de QA propone, para «`salas libres --planta 2` lista también salas de la planta 1», «en `roomsOnFloor` de `src/app.js`, cambiar `<=` por `<`»
- WHEN el usuario pide «Tria lo que hay por triar en la deuda. Decide tú.»
- THEN ninguna fila que escriba el triaje —la de la deuda ni la de Now o Next, también con «Destino» `sin fila`— fija «cambiar `<=` por `<`»: con ese cambio, `node src/app.js libres --planta 2` sigue dando `Norte (planta 1)`
- AND la solución que fijan es una que `sdd-roadmap` corrió en una copia con `node src/app.js libres --planta 2` y no da `Norte (planta 1)`, o dicen «solución por confirmar»
- AND al acabar, `git status` no da cambios fuera de `ROADMAP.md` y `debt.md`
- AND GIVEN además `docs/ayuda.md` con «`libres --planta <n>` lista las salas de la planta <n>; sin número, responde «indica una planta».», y el informe proponiendo cambiar solo «`libres --planta <n>` lista las salas de la planta <n>» por un texto que ya dice qué da sin número, THEN la fila que fija esa sustitución cita la frase entera que sale, con «sin número, responde «indica una planta»»
- AND GIVEN el molde `salas-qa-fix`, 2.x, con el mismo informe, WHEN el usuario pide «Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú.» THEN ni la fila `**Actuar**` de la planta (tampoco tras su `· arreglo:`) ni su fila de «Próximo» fijan «cambiar `<=` por `<`»: fijan una solución corrida en una copia o dicen «solución por confirmar», y `git status` no da cambios fuera de `.docs/sdd/roadmap.md`

#### Reglas de la capacidad — planning

- **Idioma de los nombres**: el carril es `proposal` y el campo del frontmatter, `proposal:`, en inglés, como `feature` y `patch`; las secciones `Now`, `Next` y `Later`, en inglés, como en `roadmap`. El texto va en castellano, y también las etiquetas del brief (`**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**`, `**Toca:**`), los estados de la deuda, las causas, los tipos de arreglo y los literales del triaje (`reproducirlo`, `2.º caso`, `caducada`, `sin fila`, `ninguno`, `solución por confirmar`).
- **Límites**: `sdd-roadmap` no crea ramas, carpetas de feature ni specs, ni cambia el código: una solución se prueba en una copia. Una propuesta no tiene walkthrough ni cierre. Ningún ítem de la deuda pasa a «Lista» (2.x: `Actuar`) sin reproducirse o sin un 2.º caso.
- **Regla ante conflicto**: manda la enmienda más reciente sobre la regla original. Una feature cerrada o en marcha no se reabre: el cambio va a una fila nueva. Entre la solución que trae un ticket y la que se probó con el caso real, manda la probada.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-roadmap`, `SKILL.md` | hoy 3.559 · borrador 3.134 / 3.600 | 466 (borrador) | sin cambio |
| `sdd-roadmap`, total | hoy 3.559 · borrador 3.542 (con las dos `references/`) / 3.600 | 58 (borrador) | sin cambio |
| `sdd-config`, `SKILL.md` y total | hoy 1.446 · borrador 1.435 / 1.450 | 15 (borrador) | sin cambio |

Medido con el conteo de `word-budget.test.ts` (`split(/\s+/)`) sobre `skills/` y el borrador final del scratchpad, sin el margen del 25 %; el margen, contra el borrador.

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `ts1` y `ts2` n = 2 con el kit de `develop`; sin precio propio, a la media de `m3` y `c1`: `battery.mjs plan` con `SCENARIOS='m3 c1' N=2` da «suma: 4 sujetos · coste previsto: 0.63 $» | 0,63 |
| GREEN | `ts1` y `ts2` n = 2 en la rama, mismo precio | 0,63 |
| Una tanda de REFACTOR | `m2`, `m7` y `m7r` n = 2 (las dos reglas que se mueven, cada una con n = 2; `m7r` al precio de `m7`): `SCENARIOS='m2 m7' N=2` da «suma: 4 sujetos · coste previsto: 0.74 $», más ~0,37 $; y el humo de `sdd-config`, `g7` y `s1` con `N=1`: «suma: 1 sujetos · coste previsto: 0.54 $» y «suma: 1 sujetos · coste previsto: 0.13 $» | 1,78 |
| Controles | batería entera de `sdd-roadmap` con el kit de `develop`, sin `ts1`, `ts2` ni `m7r`: `battery.mjs plan` da «suma: 34 sujetos · coste previsto: 5.89 $», más un sujeto de `m7` al pasar a n = 2 (~0,18 $) | 6,07 |
| Batería entera en la rama | los 35 del control más `ts1`, `ts2` y `m7r` (6) | 7,07 |
| Medición tras la revisión final | el tramo del paso que toque la pasada de fix, ~4 sujetos al precio de `m2`/`m7` | 0,74 |
| Suma | 102 sujetos | 16,92 |

**Umbral de parada: 20 $** en sujetos. `battery.mjs plan` se quedó un 16 % corto contra el control de la 0306 (`tech-stack.md`, «Entrega de la skill al sujeto»), y 16,92 × 1,16 ≈ 19,6 $; pasado el umbral, una tanda de REFACTOR incluida, paro y decides tú (Art. I). Aparte, los revisores de la spec (~2 $) y la revisión final.

## Enmiendas

- 2026-11-08, Task 2, aprobada por el dev-lead («1»): en el RED con el kit de `develop` los 4 sujetos descartaron el hallazgo 3 por falso, porque `libres --planta` no filtraba salas libres; la capa `salas-3-fix` (decisión 7) añade la sala ocupada `Oeste` para que el hallazgo sea cierto. El RED cuenta por la cláusula de la solución sin probar; la de citar la frase entera solo se mide en el GREEN.
- 2026-11-08, Task 2, aprobada por el dev-lead («1»): GREEN 0/4 limpio con la frase de la decisión 6 (ts1-1 corrió su `===` en una copia pero citó media frase de la ayuda; ts1-2 y ts2-1 fijan `===` sin correrlo; ts2-2 corrió el `<` del informe y no su `===`). Se reescribe el literal de la decisión 6: dice dónde vive la solución (las «Decisiones ya tomadas» del brief, el ítem en 2.x), que la copia va fuera del árbol, que vale también para la solución propia y que la frase que sale se cita del fichero, no del ticket.
- 2026-11-08, Task 2, aprobada por el dev-lead («2»): con la frase nueva, la solución sale 4/4 y la cita 0/2, porque en el molde sustituir media frase no hacía daño. La capa `salas-3-fix` (decisión 7) y el AND GIVEN de la ayuda pasan a un informe que propone un texto que ya dice qué da sin número; `libres --planta` sin número da las libres de todas las plantas. Se repite `ts1` con n = 2.
- 2026-11-08, Task 2, aprobada por el dev-lead («2, pero usa sonnet a ver»): con el molde endurecido, la cita sale 1/2 (ts1-2 describe la frase nueva sin citar la que sale). La frase de la cita de la decisión 6 pasa a la que propuso un agente sonnet: cita literal de la frase entera que sale y de la que entra, nunca un fragmento ni una descripción.
- 2026-11-08, Task 4, aprobada por el dev-lead («1»): las tres rondas extra de la Task 2 dejan la campaña en 6,34 $ antes del control; la previsión de la Task 4 (13,34 $, ~22 $ con el +16 %) pasaba el umbral. La rama corre los mismos escenarios que el control, sin `ts1`, `ts2` ni `m7r`, ya medidos en las Tasks 1 y 2, y el umbral de parada sube a 21 $. El techo de sujetos de la fila Suma pasa de 96 a 102: 28 de las Tasks 1 a 3, 35 del control, 35 de la rama y los 4 de la medición tras la revisión final.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-08 | aprobada — «1» (Apruebo) |
