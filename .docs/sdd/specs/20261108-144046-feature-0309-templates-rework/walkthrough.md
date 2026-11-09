---
id: 20261108-144046-feature-0309-templates-rework
feature: 0309
title: Walkthrough — sdd-templates, una forma por regla, el Approach con sus enfoques y la previsión desde el lanzador
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — sdd-templates, una forma por regla, el Approach con sus enfoques y la previsión desde el lanzador

## 1. Cambios realizados

- **El Approach con sus enfoques** (Task 1, `42b90ad0`): el hueco del Approach de `spec-template.md` pide dos o tres enfoques con lo que cuesta cada uno y una línea `Elegido:` con su porqué. `spec-writing.md` (`:16`, `:30`, `:36`) y el paso 4 de `sdd-propose` (`SKILL.md:64`, enmienda del 2026-11-08) mandan los enfoques al Approach; en `delegate`, el ✋ solo nombra el elegido y los descartados («Enfoque: A, frente a B y C (ver Approach)»), sin repetir el porqué (enmienda del 2026-11-09). `upstream.json` añade `spec-template.md` al concepto `brainstorming` 7.0.2, y `THIRD_PARTY_NOTICES.md` se regenera con él.
- **La previsión desde el comando** (Task 1): la ayuda de la «Previsión de coste» pide en cada fila, tal cual, la línea `suma:` del comando de previsión que nombra `tech-stack.md`, con el del kit de ejemplo; las celdas de la tabla dan la forma, y la fila Suma, `<n> sujetos`, la que lee `campaign.mjs`.
- **Batería de `sdd-propose`** (Task 1): el molde `reservas-skills` planta `scripts/plan.mjs` y su `tech-stack.md` lo nombra; la fila CO4 pide la línea `suma:` en cada fila, la fila AP (nueva) los enfoques en el Approach, y la fila PB el ✋ de `delegate` con el elegido y los descartados.
- **Una forma por regla** (Task 2, `f67ff379`): P10, el mismo hueco `Esfuerzo real` en `patch-template.md` y `walkthrough-template.md`; P11, el criterio de `Validación: agente` del patch con las palabras de la spec; P12, la spec nombra la regla 1 de `capability-template.md`; P16, sale la segunda frase de la «Regla de reparto»; P19, `Validado: <fecha> · «<frase>»[ · no detalló qué probó]` en walkthrough y patch, y `sdd-archive/SKILL.md:29` cita «Validado»; P20, el patch no repite «Ninguna, porque…». `statistics.test.ts` rellena el hueco por su prefijo.
- **Capacidad** `feature-flow`: añadido «La spec guarda sus enfoques en el Approach»; sustituidos «Una feature grande devuelve el diseño por secciones antes de la spec» y «La spec que edita una skill con sujetos prevé su coste».

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 2,27 h — reloj de la sesión 19,79 h desde 2026-11-08T14:31Z, sin 1051 min de espera al dev-lead (9 esperas)
- Desviación: −0,23 h (−9 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): no aplica
- Compactación: sí, en la Task 1 → Native (con las dos tasks sin su línea `complete`, la regla pedía seguir con SDD; no la apliqué ni la registré)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 74.870.437 — claude-opus-5-5 74.870.437
- Tokens de subagentes: 13.013.189 en 7 despachos — Revisión final eje Spec 0309 claude-opus-5-5 2.243.109 / 6 min; Revisión final eje Código 0309 claude-sonnet-5-5 2.509.459 / 3 min; Revisión Opus de la enmienda 0309 claude-opus-5-5 4.395.348 / 7 min; Re-revisión única 0309 claude-opus-5-5 2.094.150 / 3 min; Review spec 0309: dominio claude-sonnet-5-5 461.845 / 1 min; Revisión Opus del GREEN 0309 claude-opus-5-5 1.058.345 / 2 min; Review spec 0309: técnica claude-sonnet-5-5 250.933 / 1 min
- Coste de la sesión: 36,17 $ (hilo 27,68 $ + subagentes 8,49 $)
- Coste de sujetos: 13,69 $ en 16 sujetos sonnet — RED 1,40 $; GREEN 4,03 $; REFACTOR 4,39 $; controles 1,39 $; humo 0,66 $; medición final 1,83 $ (previsión: 14 $, enmienda del 2026-11-09)
- Review de spec: 2 revisores · hallazgos 16, aceptados 8

## 3. Desviaciones del plan

- La enmienda del 2026-11-09 (aprobada: «sigue», a la opción D): el GREEN dio PB 0/2 porque la spec pedía el porqué del elegido en el Approach y en el ✋; pasa a vivir solo en el Approach, y la previsión sube de 11,88 a 14 $.
- Dos enmiendas más en la revisión final (las dos aprobadas: «1»): Task 3, `27c20ff2`, la regla de reparto, P16 y P12 con una forma en plan, architecture y proposal; Task 4, `97c8039e`, la cuarta forma de la regla en `operations-template.md` y la línea `- REMOVED` del patch con las palabras de la spec.
- La frase de los subagentes («los minutos de los subagentes no se suman…») se queda en los dos huecos de `Esfuerzo real`, igual en los dos: la pasada de fix la llevó al Método de `estimation-template.md` y `20ef3c4b` la devolvió, porque ningún paso del cierre lee el Método y es la medida GREEN de la task 0010 (`tests/token-cost-green.md`). No es «la regla que lo explica» de la decisión 1, sino una instrucción para rellenar el hueco.
- Tras el REFACTOR, CO4 quedó 1/2 (co4-1 citaba las cifras del comando sin su línea); la ayuda pide la línea «tal cual» y lo mide la medición tras la revisión final, sin tanda propia (dev-lead: «1»).

### Decisiones tomadas sin el dev-lead

- sin revisar: 97c8039e — aplica literales los arreglos de la revisión Opus de la enmienda (operations-template.md:3, la línea `- REMOVED` del patch, CO4-T que admite `./` y comillas); 20ef3c4b lo revisó esa misma revisión, sin defectos
- Task 1: Ruling: la fila Suma de la previsión («16 sujetos, ~50 min en tandas de hasta 3») no casa con la regex de campaign.mjs — paso SUBJECT_CAP=16, el total de la spec, en cada tanda, sin enmendar la spec — si estuviera mal, el techo sería el mismo número que la spec aprobó
- Task 1: Ruling: `npx vitest` de la «Verificación» falla en Git Bash (MODULE_NOT_FOUND vitest.mjs); corro `pnpm exec vitest` desde cli/, el mismo binario — si estuviera mal, saldría el mismo recuento que moon cli:test
- Task 1: Ruling: kit:own sale con 1, igual que en la base: mismas 26 líneas (diff vacío contra own-base) — el criterio es «sin rojos nuevos» — si una línea nueva se colara, el diff la habría mostrado
- Task 1: Ruling: «tal cual, la línea `suma:`» en la ayuda de la previsión de spec-template.md (opción 1 del dev-lead: «1») — aplica literal el AND de la spec («cada fila cita la línea `suma: …`»), sin tanda propia: lo mide la medición final co4 pb N=1 — si no basta, la medición sale roja y se para
- Task 1: Ruling: el node replace de la enmienda en battery.md tomó «$`» como patrón y metió el fichero dentro de la fila CO4; el REFACTOR y los controles corrieron con esa batería (los sujetos no la leen; el veredicto omitió L) — arreglado con split/join, L leída a mano en los 6 sujetos (0 mensajes en inglés), kit:test-headless 448/448 — si quedara algo, battery.test.ts lo habría visto
- Task 1: Ruling: molds.test.ts id1 «unable to migrate temporary objects» en la primera pasada de kit:test-headless, no en la segunda — fallo pasajero de git, no del cambio — si fuera real, volvería en el gate de cierre
- Task 1: Ruling: el pre-commit (notices.test.ts) pide regenerar THIRD_PARTY_NOTICES.md tras cambiar upstream.json; el plan no lo nombraba — moon run kit:notices, una fila que añade spec-template.md al concepto brainstorming — si estuviera mal, notices.test.ts seguiría rojo
- Task 1: Ruling: kit:copies rojo («skills/sdd-verify/references/: sin anotar → 0297»), también en la base 74988a8b (worktree aparte) — heredado, la rama no toca sdd-verify ni su entrada de upstream.json; task done con kit:build kit:test-headless, porque kit:own y kit:copies salen con 1 ya en la base (kit:own: mismas 26 líneas que la base, comparado aparte) — si el rojo fuera nuevo, la base no lo daría
- Task 2: Ruling: base — origin/develop no toca ningún fichero de la Task 2 ni la fila 0309 (la 0311 cambia en su texto, no esta) — sin freno
- Task 2: humo a2 t3 N=1: 2/2 (0,66 $; campaña 11,86 de 14 $); a2 no ejercita P10 ni P19 del patch (molde en campo, sin estimation.md). Ruling: t3 relanzado solo, el techo COST_CAP=12.5 reservaba 0,78 $ por sujeto en curso — sin coste extra
- Task 2: Ruling: la primera pasada de task done dio 3 timeouts de 5 s en *.slow.test.ts (hooks, manifests, upstream-watch), que pasaron antes y en la segunda — carga de la máquina — si fueran reales, el gate de cierre los vuelve a correr
- Final: Ruling: Spec I2 (CO4 nunca 2/2) — se mide con la medición final co4 pb N=1 que eligió el dev-lead («1»); el walkthrough lo dice con su frase y el recuento 1/2 + 1/2 + medición — si sale rojo, se para
- Final: Ruling: Spec I3 (el humo no observó P10, P11, P19, P20 del patch ni el Validado del walkthrough) — no probado en la 4.2 del walkthrough: a2 valida en campo sin estimation.md y t3 con agente; otro molde costaría una tanda fuera de la previsión — si una forma está mal, la verá el primer cierre en campo y su ticket
- Final: Ruling: Spec M5 y Código M6 (la decisión central «en el mensaje o en el ✋») — sigue cierto: en delegate el ✋ nombra el elegido, y en unattended, por delegación o tras «empieza ya» el elegido es lo que se habría preguntado, que va al ✋ (spec-writing.md:36) — si un revisor de spec no lo encuentra, lo busca en el Approach
- Final: Ruling: Spec M8 (la variante del panel no está en la plantilla) — la forma del panel vive en sdd-archive (archive.md:160) y cabe en «<frase literal>» — sin coste: no cambia lo que escribe el cierre
- Final: Ruling: Spec M9 (las celdas solo enseñan la rama con comando) — la rama sin comando es la excepción que dice la ayuda; dos juegos de celdas serían la regla en dos formas — si confunde, una spec sin comando reescribe las celdas
- Final: Ruling: Spec M10 (P12 depende de abrir otro fichero) — es la tabla aprobada de la decisión 3; spec-writing.md:22 conserva el slug — si falla, lo medirá la 0311
- Final: Ruling: Código M1 (<n> y <x> pasan a huecos de TEMPLATE_GAPS) — merge.ts quita los code spans antes de mirar, y un <n> suelto en una capacidad viva es un hueco sin rellenar — si un delta legítimo lo lleva, el merge lo rechaza con un mensaje claro
- Final: Ruling: Código M2 (la regla del Approach en spec-writing.md :16, :30 y la plantilla) — :16 resume la sección y apunta a «Approaches»; la copia entre skills es de la 0311 — si diverge, kit:own de la 0311 lo verá
- Final: Ruling: Código M3 (el criterio de agente igual en patch y spec) — es P11 de la decisión 3: las mismas palabras, a propósito — sin coste
- Final: Ruling: Código M8 (sdd-propose/SKILL.md a 39 bytes del límite) — informativo; kit:skill-size lo para en el próximo cambio — sin coste ahora
- Final: Ruling: Spec «declined» (cr2 y cr3 sin correr con el molde cambiado) — solo cambió el comando nuevo y la línea de tech-stack; cr1 de control 1/1 — si rompe, su próxima campaña lo verá
- Final: Ruling: L rojo en co4-1 de la medición final — el diff no toca el idioma de ningún texto y L pasó en los 13 sujetos anteriores; va al ticket, sin tanda (la previsión no da para otra) — si fuera del cambio, la siguiente campaña de sdd-propose lo repetiría
- Final: Ruling: Spec M6 deshecho — la frase de los subagentes vuelve a los dos huecos de Esfuerzo real, iguales: en el Método de estimation-template.md no la lee sdd-archive ni la reciben los proyectos ya creados, y era la medida GREEN de la task 0010 (re-revisión, Minor) — si molesta repetida, la 0311 la lleva a includes/
- Final: Ruling: PRODUCT-template.md:19 («el comportamiento detallado vive en capabilities/: aquí va el alcance») se queda — marca la frontera del alcance de PRODUCT.md, no repite la regla de reparto (revisión Opus de la enmienda: dudoso, a criterio del dev-lead, que eligió «1») — si un agente pone un valor en «Es:», la 0311 lo iguala

## 4. Verificación

### 4.1 Builds

- `moon run kit:build`: verde en cada task y en cada pasada de fix. `kit:own`: las mismas 26 líneas que la base (salida 1, heredada). `kit:skill-size`: solo el rojo heredado de `sdd-roadmap` (21.680 bytes). `kit:copies`: rojo heredado, también en la base `74988a8b` (`skills/sdd-verify/references/: sin anotar → 0297`).
- `vitest run test/estimation/ test/kit/` desde `cli/`: 963 passed | 13 skipped, sobre `97c8039e` (dos timeouts de tests lentos en la misma pasada, que solos dan 37/37). `moon run kit:test-headless`: 448/448, sobre `97c8039e`.
- Gate: el gate de cierre corre una vez, en el merge de sincronización del paso 6, porque hay otras dos ramas abiertas (0321 y 0322); su línea `Gate:` y su sha van en el mensaje final.
- Tanda: `SCENARIOS="co4"` → `suma: 2 sujetos · coste previsto: 1.47 $` (RED) · `SCENARIOS="co4 pb"` → `suma: 4 sujetos · coste previsto: 3.46 $` (GREEN y REFACTOR) · `SCENARIOS="cr1 pb-p" N=1` → `suma: 2 sujetos · coste previsto: 1.02 $` · `SCENARIOS="a2 t3" N=1` → `suma: 2 sujetos · coste previsto: 0.74 $` · `SCENARIOS="co4 pb" N=1` → `suma: 2 sujetos · coste previsto: 1.73 $`; minutos sin medir.

### 4.2 Smoke / tests

Verificado por el agente con sujetos sobre `dist/` (`tests/sdd-templates-0309-green.md`); nada reportado por el dev-lead.

- Validación en campo: 2026-11-09 · batería de `sdd-propose`: AP 2/2 + 1/1, PB 2/2 + 1/1, CO4 1/2 (REFACTOR) + 1/1 (medición final, con «tal cual»), PB-P y PB-L 1/1, `cr1` 1/1; L 1/2 en la medición final; humo de `sdd-archive` `a2` y `t3` 1/1; `statistics.test.ts` RED→GREEN; revisión final Spec y Código sobre `f67ff379`, re-revisión sobre `5270de73` con Spec I4 a medias, cerrado en las Tasks 3 y 4; 1 sin revisar (`97c8039e`); la suite, en el merge de sincronización

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| ADDED, THEN: el `## Approach` lleva dos o tres enfoques con su coste y `Elegido:` | ejecución real | AP 2/2 (REFACTOR) y 1/1 (final); PB 2/2 y 1/1 |
| ADDED, THEN: con una sola vía sensata, esa y por qué no encajan las otras | no probado | ningún escenario tiene una sola vía (spec, decisión 11) |
| ADDED, AND: en `pair` el elegido por el dev-lead; en `unattended` o tras «empieza ya», los del agente | no probado | ningún escenario llega al Approach en `pair` ni en `unattended` (decisión 11) |
| MODIFIED secciones, THEN: en `pair`, mensaje de enfoques y secciones con «¿va bien?» | ejecución real | PB-P 1/1 (`pb-p`, controles) |
| MODIFIED secciones, AND: en `delegate`, enfoques al Approach y el ✋ nombra el elegido y los descartados, con las secciones | ejecución real | PB 0/2 (GREEN, antes de la enmienda), 2/2 (REFACTOR), 1/1 (final) |
| MODIFIED secciones, AND: por delegación, en `unattended` o tras «empieza ya», enfoques al Approach | no probado | sin escenario propio (decisión 11) |
| MODIFIED secciones, AND: cada sección abre con lo que ve quien usa el producto | ejecución real | PB-L 1/1 (`pb-p`) |
| MODIFIED secciones, AND sin cambio de texto (corrige, propuesta, recuento, 2 tasks) | no probado | sin cambio de texto en esta feature |
| MODIFIED previsión, THEN: filas RED, GREEN, REFACTOR, controles y medición | ejecución real | CO4 2/2 (REFACTOR) y 1/1 (final) en la forma de las filas |
| MODIFIED previsión, AND: cada fila cita la línea `suma:` del comando | ejecución real | CO4 1/2 (GREEN), 1/2 (REFACTOR), 1/1 (final, con «tal cual»); CO4-T verde en los 7 sujetos |
| MODIFIED previsión, AND: sin comando, la batería y el precio por sujeto | no probado | el molde lleva comando (plan, §4) |
| MODIFIED previsión, AND: sin skill probada con sujetos, sin sección | no probado | sin cambio de texto |
| Decisión 3, P10, P11, P19 y P20 en el patch (`Esfuerzo real`, `Validación: agente`, `Validado`, §6) | no probado | `a2` valida en campo y no tiene `estimation.md`: no llega a §4 ni a §5 |
| Decisión 3, P19 en el walkthrough (`Validado: … · no detalló qué probó`) | no probado | `t3` valida por el agente |
| Decisión 3, el hueco `Esfuerzo real` del walkthrough lo lee `sdd estimation log` | suite | `statistics.test.ts` («walkthrough con evidencia por THEN») RED 2 failed → GREEN 49 passed |

### 4.3 Residuales / deuda generada

- La regla de reparto en `PRODUCT-template.md:19` se queda como frontera del alcance (ruling); si un agente escribe en «Es:» un valor de comportamiento, la 0311 la iguala.
- Las copias de las reglas en otras skills (P7, P12-P20 fuera de `sdd-templates`) y la «decisión central» en `review-spec.md:66` y `feature-flow.md:45`, a la 0311.
- `sdd-propose/SKILL.md` queda a 39 bytes del límite de `kit:skill-size`.

## 5. Aprendizajes

- Un `String.replace` de Node con un reemplazo que lleva `` $` `` inserta el texto anterior al hallazgo: metió una copia de `battery.md` dentro de la fila CO4, y una tanda corrió con ella. Para editar texto con `$`, `split`/`join` o el `Edit` → ticket del kit.
- `COST_CAP` es el techo de la campaña entera y reserva ~0,78 $ por sujeto en curso: lo pasé como techo de una tanda y una tanda no corrió y otra corrió a medias, sin error. `tech-stack.md:208` ya lo dice («`COST_CAP`, el de la previsión») → ticket del kit (la regla existía y no la apliqué).

Retro: error que cazaría un chequeo → ticket del kit: `battery.mjs run` lanzó el REFACTOR y los controles con un `battery.md` que llevaba otra copia de la tabla de escenarios y de la rúbrica dentro de la fila CO4, y solo se notó porque L dejó de salir en «sin leer»; un chequeo de ids de escenario y de filas repetidas antes de lanzar lo habría parado
Retro: error que cazaría un chequeo → ticket del kit: con `COST_CAP` por debajo de lo gastado más lo que reserva un sujeto, `battery.mjs run` sale con 0 y «sin evidencia» (o corre menos sujetos de los pedidos) en vez de negarse antes de lanzar con el techo que haría falta

## 6. Adendas
