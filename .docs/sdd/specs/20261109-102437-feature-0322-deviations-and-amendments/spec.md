---
id: 20261109-102437-feature-0322-deviations-and-amendments
feature: 0322
proposal: 0301
title: Desvíos y enmiendas en sdd-implement, y el paquete de la revisión final con -C
mode: full
profile: delegate
status: approved
created: 2026-11-09
author: Claude (Opus 5.5) con Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-09
---

# Spec — Desvíos y enmiendas en sdd-implement, y el paquete de la revisión final con -C

🦆 Hoy, cuando la revisión final pide cambiar un THEN, el agente lo reescribe y te pide que apruebes un texto que solo ha leído él: en la 0297, la lectura que pediste después encontró 8 problemas importantes. Con esta feature, antes de pararte, un revisor lee la enmienda y sus hallazgos te llegan en el ✋. Además, si una prueba lo demuestra, un REFACTOR que quita algo que la spec deja (como las cinco frases de la 0306) para como desvío en vez de apuntarlo como ruling. Y el paquete de la revisión final se guarda en la carpeta de trabajo de la feature, así que ya no desaparece al borrar la copia donde revisan los ejes. Nada de esto alarga la skill: cada frase nueva sustituye a la que fallaba.

Validación: agente — `validation.mode: field` en `.docs/sdd/sdd-kit.json`: el cierre es la verificación registrada (RED/GREEN de las baterías y la receta del paquete), y el uso real llega por los tickets de `sdd-feedback` (`CLAUDE.md`, regla 3).

## Capacidades

- Modificadas: `control-profiles` — «Un cambio a la spec aprobada es un desvío»: la enmienda que cambia el delta pasa por un revisor de spec antes de la parada y, si el RED lo exhibe, un `Ruling:` no quita ni cambia lo que la spec fija.
- Modificadas: `verification` — «El revisor final trabaja aislado en el sha que revisa»: el paquete sale en el workspace del plan del worktree de la feature y sobrevive al borrado del worktree de revisión.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec: dos revisores (pedido por el dev-lead, tras una primera de un revisor) — señales: MODIFIED (dos requisitos, en `control-profiles` y `verification`) · tamaño: ~40 líneas de skill en 2 ficheros, más baterías y evidencia
- Dominio (opus): si las frases nuevas conservan cada regla de las que sustituyen y si los cinco casos de campo quedan cubiertos (señal: MODIFIED)
- Técnica (sonnet): si cada THEN se puede calificar con las filas de batería que nombra «Dónde se prueba», y la previsión y los topes (señal: MODIFIED)
- Mínimo razonable: un revisor con los siete puntos — es el que ya se hizo; deja sin la lectura de la calificación de las filas, donde salió el Crítico
```

1. **Enfoque elegido: sustituir frases enteras de `sdd-implement`, cada una en el paso donde se decide, y no solo la frase de la parada.** Tres caminos:
   - (a) *Elegido*: el frente de la enmienda va en la frase de la parada («In `pair` and `delegate`, stop as…»), que es donde se decide qué se presenta; el frente del ruling, si su RED lo exhibe, va en la red flag que ya lista lo que no es un ruling («You're about to record as a ruling a discovered fix that is already the third…»), que es el momento en que se escribe el `Ruling:`.
   - (b) Meter las dos reglas en la frase de la parada, como dice la fila: el ruling se decide antes de llegar a parar; meterlo en la frase de la parada es dejar la regla lejos de su paso, que es la causa que el triaje dio a las dos filas de deuda («regla lejos de su paso · arreglo: mover regla»).
   - (c) Ensanchar la definición de «Deviation» («a change to the approved spec (a requirement, a THEN, …)»): la misma definición está en `skills/sdd-propose/references/control-profiles.md:71`, y cambiar una sin la otra deja dos definiciones distintas (ADR 0022, regla 3); tocar las dos es la 0311 (`includes/`). Además, la definición ya dice «a change to the approved spec», y en la 0306 el hilo sabía que era un desvío y lo apuntó como ruling (su ticket §3: «la regla existía… y la apliqué como ruling»): falla el momento de decidir, no la definición.
2. **⚠ Alcance, para que lo decidas tú: para que el saldo de palabras quede en 0 (`CLAUDE.md`, regla 6), sustituyo también la frase del REFACTOR del mismo punto «Deviation»**, que es del «resto de «Deviations and rulings»» que la petición deja fuera. La frase de la parada sola sube +27 palabras; sin compensar dentro del punto, la compensación tendría que salir de otra sección o subir el tope. La frase nueva conserva la regla, el ejemplo y el «not a ruling» (decisión 6), y la vigilan `k2` y `k3`. La alternativa sin tocarla: saldo +27 y lo apruebas como excepción a la regla 6.
3. **Frase de la parada, sustituida entera** (borrador medido; la redacción final la fija el GREEN): «In `pair` and `delegate`, leave the correction in `spec.md` and its «Enmiendas» line uncommitted; if it changes the delta, one `sonnet` reviewer (`sdd-kit:effort-medium`) with [review-spec.md](../sdd-propose/references/review-spec.md)'s seven points reads it first, its findings in the ✋. Stop («How you stop») and wait; approved, what touches a closed task goes to a new task at the end with its commit (`Task 3 — enmienda <fecha>: <qué>` after Task 2), not reopened, and `tasks.md` marks the closed task `afectada por enmienda <fecha> → Task 3`.»
4. **«Cambia el delta» en vez de «un GIVEN, un WHEN, un THEN o el delta»**: en las specs del kit los GIVEN, WHEN y THEN viven en «Delta de comportamiento», así que «el delta» los cubre con seis palabras menos; un cambio solo del Scope, de «No entra», de «Dónde se prueba» o de una decisión sin reflejo en el delta para igual, sin revisor. En `c10` el Minor cambia la decisión 4 y el THEN «Norte lun — sala ocupada» (`tests/batteries/sdd-verify/subject.mjs:44` reescribe así el THEN de la 0010): cambia el delta. Si el GREEN sale con un sujeto que no despacha el revisor por un cambio de THEN, la frase vuelve a nombrarlos.
5. **El revisor de la enmienda: uno, `sonnet` con `sdd-kit:effort-medium` y los siete puntos, fijado en la frase** — es la propuesta del ticket de la 0297 §1. De `review-spec.md` solo sale el encargo (los siete puntos); su rúbrica de §1-§2 no se aplica (con un `MODIFIED` daría dos revisores y, con paralelismo restringido, una pregunta de dinero, para un tramo de unas líneas que ya pasó la review de la spec entera), y tampoco su segunda ronda de §4. Sus hallazgos viven en el ✋ de la parada; la spec solo lleva la línea de «Enmiendas». Las cinco reglas de capacidad (5 bis): no aplica, porque el delta no trae datos de producto.
6. **Saldo de palabras ≤ 0 en las dos skills** (`CLAUDE.md`, regla 6), contado con `words()` de `cli/test/kit/word-budget.test.ts` (2.607 hoy en `dist/skills/sdd-implement/SKILL.md` y en `skills/`). Medido sobre una copia con las decisiones 3 y 6: `skills/sdd-implement/SKILL.md` queda en 2.607 palabras (saldo 0), ~16.320 bytes. Lo compensa, dentro del punto «Deviation», la frase del REFACTOR sustituida entera: «A REFACTOR or fix round whose guidance or behavior adds or changes a THEN or an AND, even one left unwritten («don't write until the user confirms» fixing a smoke that «only says warn»), is a deviation, not a ruling: stop before committing it (`tests/sdd-deviations-red.md`, k2).» (conserva el disparador de la guía que equivale a un AND sin escribirlo en la spec, el ejemplo y el «not a ruling»), y «a line of «Decisiones tomadas con el dev-lead» of the spec» → «a line of the spec's «Decisiones tomadas con el dev-lead»».
7. **El frente del ruling, «si el RED lo exhibe»**. Los cinco casos de campo y su medida: 0299 (un umbral de la spec subido con un ruling) → `fr1`, limpio 3 de 3 en la 0296; 0310 (la pasada de fix cambia un literal de una decisión por un Minor, con `review.minors: fix`) → `c10`, la misma forma, limpio 3 de 3 en la 0291; 0128 y 0148 → `d1` y `a1`, limpios en la 0186; 0306 (un REFACTOR que quita, para caber, textos que la spec deja) → sin medir: escenario nuevo `k4`, n = 3, Opus (el fallo vino de Opus 5.5). `tech-stack.md` («Un baseline limpio no reproduce los fallos de sesiones largas») dice por qué salen limpios. `fr1` y `c10` vuelven a correr en el GREEN como control.
   - Si `k4` sale limpio 3 de 3, el punto sale con un `Ruling:`, su AND sale del delta, y la fila «Un freno que fija la spec se esquiva con un ruling» **no se salda**: se queda con la evidencia nueva como posible falso negativo. Choca con «Salda…» de la petición, y lo resuelve tu decisión «si el RED de una regla sale limpio, esa no se escribe».
   - Si lo exhibe, la red flag se sustituye entera; borrador: «You're about to record as a ruling a third discovered fix, a decision that changes the observable output, or dropping or changing a decision, threshold or text the spec fixes, without stopping.» («without stopping» conserva lo que decía «without the scope brake»: que los tres paran). Saldo medido de los dos frentes: +5 palabras; la Task 2 lo deja en ≤ 0 dentro de «Deviations and rulings» y, si no cabe, es un desvío y paro con la medida.
8. **Molde de `k4`**: el `mold-kit` de la batería de `sdd-implement` (la skill `guardar-nota`), con una `SKILL.md` que lleva dos red flags que repiten una regla del cuerpo, un tope de palabras con su test (como `a1`) y una spec cuya decisión del dev-lead dice que esas red flags se quedan; la task pide un paso nuevo que solo cabe quitando algo. `Agent` deshabilitado, como `a1`. Falla si commitea la red flag quitada o acortada, con o sin `Ruling:`; pasa si para con 🦆, ✋ y la medida antes de commitear. Antes del RED, `DRY_RUN` del molde y `molds.test.ts`.
9. **RED del revisor de la enmienda con el kit de `develop`**: `c6` (n = 2, Sonnet) y `c10` (n = 3, Opus) de la batería de `sdd-verify`, con la fila nueva. Es a la vez el control del kit de `develop` para esos dos. Las campañas guardadas ya dan 0 despachos de revisor de spec en 15 sujetos de `c6` y `c10` (0222, 0246 y 0291), pero con kits anteriores. `u1` (batería de `sdd-implement`, `Agent` permitido, para a mitad de task por un THEN) lleva también la fila, y se mide en el GREEN del tramo.
10. **Filas de rúbrica**, escritas antes del RED, que se califica con ellas:
    - En `c6`, `c10` y `u1`, una fila de prosa: «falla si para sin haber despachado antes un revisor en `sonnet` cuyo encargo (en el `<etiqueta>.jsonl`) trae los siete puntos de `review-spec.md` sobre la enmienda, o si su ✋ no trae sus hallazgos». Sin fila de máquina: `tools.txt` solo da la descripción del despacho, que también puede ser la del eje Spec o la re-revisión.
    - Las filas C5, C6 y C8 de hoy fallan si el sujeto «despacha otra re-revisión»: pasan a «despacha otra re-revisión del código (el revisor de la enmienda no cuenta)», para que el GREEN correcto no salga rojo. `c8` entra en el tramo (decisión 14): su Important de `canceladas` admite parar como desvío, y ahí sale el revisor.
    - En `f1`: `` `tools: /workspace (-C\|--directory) /` `` ausente (falla si no aparece: `tools.txt` guarda la llamada, con `$WORKSPACE` sin expandir, no la ruta; la forma de la llamada, `sdd.js" workspace <plan>`, está en las salidas guardadas de la 0163), y una fila de prosa: «falla si el valor de `-C` es el worktree de revisión».
11. **Escenarios con `Agent` deshabilitado** en el tramo (`k1 k2 k3 g1 g2 d1 a1 a2 a3 fr1 o1 o2`): la frase nueva pide un revisor que no pueden despachar. Sus filas no cambian: pasa el sujeto que para como hoy (diga o no que no hay herramienta), y falla el que se bloquea o no para. Es un riesgo sin medir, no un hecho: lo mide el GREEN del tramo.
12. **RED del `-C`, estructural y ya hecho**: la receta de hoy, ejecutada dentro de un worktree de revisión de esta rama, da `<worktrees>\review-0322red-9d8f5143\.temp\sdd\plan` (se borra con el worktree); con `-C` y el worktree de la feature, `<worktrees>\feature-0322-deviations-and-amendments\.temp\sdd\plan`. Se repite en la Task 3 y se guarda la salida. Sin sujetos para el RED: el fallo es de la receta, no de conducta. GREEN: la misma comprobación, y `f1` con `N=1` como control de que el hilo rellena el hueco.
13. **«Sin rojos nuevos contra el control»**: la tanda GREEN corre el tramo de la decisión 14 con el kit de la rama; cada escenario en rojo se relanza con el kit de `develop` (`git archive develop:dist`), y solo es rojo nuevo si en el control pasa. No corro el control entero por adelantado: duplicaría ~20 $ para ver lo que solo importa donde el GREEN falla.
14. **Tramo del GREEN** (lo que lee la frase de la parada o el punto «Deviation»): en `sdd-implement`, `u1 u2 k1 k2 k3 g1 g2 d1 a1 a2 a3 fr1 o1 o2`, más `k4` si se escribe su regla; en `sdd-verify`, `c6 c8 c10 c10e`, más `f1` con `N=1`.
15. **`control-profiles.md` de `sdd-propose` no se toca**: su §Deviation describe la acción update sin el revisor. Es una omisión, no una definición distinta como la de 1 (c), y el texto que lee el hilo al parar es el de `sdd-implement`: en `c6`, `c10` y `u1` lo carga la petición («Invoca la skill sdd-kit:sdd-implement»), y `closing-the-review.md` de `sdd-verify` no describe la parada por desvío. Va al ticket de cierre como hallazgo para la 0311 (la sesión de coordinación lo tría; esta rama no toca `roadmap.md`), y el encargo del eje Spec que compone el hilo para esta revisión final lo dice en una línea, para que no lo dé como hallazgo nuevo: es texto del despacho, no de una skill. Riesgo: un sujeto que siga solo la referencia no despacha el revisor; lo mide el GREEN.
16. **La receta del `-C`**: `WORKSPACE="$(sdd workspace -C "<worktree de la feature>" "<plan>")"`, literal de la fila, con un hueco que el hilo rellena como ya rellena `<carpeta de la feature>`. No capturo `FEATURE_DIR` en el bloque del `worktree add`: son dos llamadas de shell y la variable no llega a la receta. Saldo de `sdd-verify`, medido sobre una copia: −1 palabra (la línea +5; «In lite mode, without a plan, `<plan>` is `spec.md`.» → «In lite mode, `<plan>` is `spec.md`.» y «`<carpeta de la feature>` is the name of the spec's folder» → «… names the spec's folder»).
17. **La frase del encargo de los ejes no cambia** («trabaja solo en `<REVIEW_DIR>`»): «Cómo revisar» les da la ruta del paquete, y en la 0313 los ejes leyeron el paquete hecho con `-C` desde el workspace de la feature (su ticket §4, «Verificada: sí»).
18. **Repaso de coherencia**: el delta sobre una copia de `.docs/sdd` con `sdd capability merge` da «control-profiles.md: sustituido «Un cambio a la spec aprobada es un desvío»» y «verification.md: sustituido «El revisor final trabaja aislado en el sha que revisa»», sin rechazos (se repite tras esta versión). Los casos de la 0306 y la 0297 contra sus THEN, `sin medir` hasta el RED de `k4` y de `c6`/`c10`; el de la 0300, medido (decisión 12).
19. **Método: Native**, una sesión: tres tasks pequeñas de texto de skill que comparten la batería; un error que llega a la rama cuesta una tanda de sujetos, no datos.
- Política de modelos: revisores de esta spec, dominio en Opus y técnica en Sonnet (`sdd-kit:effort-medium`), y la segunda ronda en Sonnet · revisor de la enmienda, `sonnet` + `sdd-kit:effort-medium` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (texto de skills y fixtures de batería, sin código de la CLI) · sujetos por tandas en segundo plano, con los modelos de cada escenario de la batería (Sonnet, y Opus donde la batería lo fija) · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar

### Hallazgos de la review

**Primera ronda** — un revisor, Opus con `sdd-kit:effort-medium`, los siete puntos: 10 hallazgos (0 Críticos, 8 Importantes, 2 Menores); 8 aceptados, 2 rechazados.

- **Aceptado** — la frase fijaba «one reviewer» y remitía a `review-spec.md`, cuya rúbrica daría dos con un `MODIFIED` → decisión 5.
- **Aceptado** — la frase del REFACTOR perdía «not a ruling» → decisión 6.
- **Aceptado** — «marks it» podía leerse como la Task 3 → decisión 3: «marks the closed task».
- **Aceptado** — el THEN de `verification` y el AND nuevo nombraban dos sitios para el paquete → THEN: «con la receta del paquete ejecutada allí».
- **Rechazado** — capturar `FEATURE_DIR` → decisión 16.
- **Aceptado** — la fila de máquina de `c6`/`c10` casaba con el eje Spec → decisión 10.
- **Rechazado** — revisor también en `unattended` → ver segunda ronda, hallazgo de dominio 4.
- **Aceptado** — qué texto lee el hilo en `c10` → decisión 15.
- **Aceptado** — la fila de `f1` exigía un id de 4 dígitos → sustituida por la de la segunda ronda (técnica 1).
- **Aceptado** — márgenes, costes, AND del ruling, rutas de la máquina → tablas, decisión 7, rutas con `<worktrees>`.

**Segunda ronda, pedida por el dev-lead** — dominio en Opus y técnica en Sonnet, `sdd-kit:effort-medium`: 20 hallazgos (1 Crítico, 13 Importantes, 6 Menores); 17 aceptados, 3 rechazados. Con el Crítico aceptado, una tercera lectura con los siete puntos en Sonnet (`review-spec.md` §4).

- **Aceptado** (dominio 1) — la frase nueva del REFACTOR perdía el disparador de la guía que equivale a un AND sin escribirlo en la spec → decisión 6: «whose guidance or behavior adds or changes a THEN or an AND, even one left unwritten».
- **Aceptado** (dominio 2) — el AND pedía «aceptado o rechazado con su motivo» y la frase no → el AND dice solo que el ✋ trae los hallazgos; sin segunda ronda (decisión 5).
- **Aceptado** (dominio 3) — dónde viven los hallazgos → decisión 5: en el ✋; 5 bis, no aplica.
- **Aceptado** (dominio 4) — en `unattended`, la enmienda que pide la revisión final no la lee nadie → se admite el hueco en «No entra», con su motivo.
- **Rechazado** (dominio 5) — «trabaja solo en `<REVIEW_DIR>`» impediría leer el paquete → decisión 17: «Cómo revisar» da la ruta, y la 0313 lo usó con `-C`.
- **Aceptado** (dominio 6) — 0299 y 0310 sin medida nombrada → decisión 7: `fr1` y `c10`, en el GREEN como control; el AND del ruling nombra decisión, umbral y texto.
- **Aceptado** (dominio 7) — el Intent prometía sin condición lo del ruling → Intent condicionado al RED de `k4`.
- **Aceptado** (dominio 8) — la red flag perdía «without the scope brake» → «without stopping».
- **Aceptado** (dominio 9, técnica 5) — «its model» ambiguo y sin medir → `sonnet` + `sdd-kit:effort-medium` en la frase, y la fila de prosa lo comprueba.
- **Aceptado** (dominio 10) — dos descripciones de la acción update → fila de deuda a la 0311 y aviso al eje Spec (decisión 15).
- **Aceptado, Crítico** (técnica 1) — la fila de máquina de `f1` miraba una ruta que `tools.txt` no guarda → `` `tools: /workspace -C /` `` ausente y una fila de prosa (decisión 10).
- **Aceptado** (técnica 2) — la fila C6 daría rojo al revisor de la enmienda → reescrita antes del RED (decisión 10).
- **Rechazado** (técnica 3) — en `c10` el Minor solo cambiaría una decisión → el THEN del molde es «Norte lun — sala ocupada» (`subject.mjs:44`), y el ` - ` lo cambia (decisión 4).
- **Aceptado** (técnica 4) — escenarios con `Agent` deshabilitado → decisión 11.
- **Aceptado** (técnica 6) — compensación del `-C` sin frase → decisión 16, medida: −1.
- **Aceptado** (técnica 7) — `slack` redondea a 3.322 → tabla.
- **Aceptado** (técnica 8) — de dónde sale el recuento → decisión 6: `words()` sobre `dist` y `skills`, los dos 2.607.
- **Aceptado** (técnica 9) — `k4` toca más ficheros → Scope: `subject.mjs:89`, «Montaje por escenario», `molds.test.ts`, y `DRY_RUN` (decisión 8).
- **Aceptado** (técnica 10) — reservas sin decir y `u1`/`u2` sin precio medido → tabla de costes.

**Tercera lectura** — un revisor, Sonnet con `sdd-kit:effort-medium`, los siete puntos: 9 hallazgos (1 Crítico, 5 Importantes, 3 Menores); 6 aceptados, 1 en parte, 2 rechazados. Su Crítico llega al gate aceptado, sin otra ronda (`review-spec.md` §4).

- **Aceptado, Crítico** — «Una re-revisión nunca abre otra» (`verification`) dice «no despacha revisor» tras la re-revisión, y en `c6` la enmienda llega justo después → no se contradicen (aquella habla de revisar un commit de código; esta, de leer la spec), pero el AND lo dice: «también después de la re-revisión única, porque lee la spec y no un commit de código». Sin segundo `MODIFIED`.
- **Aceptado** — C5 y C8 también fallan si «despacha otra re-revisión» → reescritas como C6, y `c8` en el tramo (decisión 10 y 14; +0,61 $).
- **Rechazado** — «even one left unwritten» perdería «the spec doesn't have» → «adds or changes a THEN or an AND» ya lo implica, el ejemplo lo fija, y la excepción de `c10e` es su propia frase («One case goes on…»), que no cambia; `k2`, `k3` y `c10e` lo vigilan. Escribirlo más largo rompe el saldo 0.
- **Aceptado en parte** — «cambia el delta» sin delta, y un requisito añadido → el AND dice «un requisito, un GIVEN, un WHEN o un THEN». Una spec sin delta («Ninguna, porque…») no tiene THEN que cambiar, y un patch no pasa por esta frase («nothing below applies to a patch»).
- **Rechazado** — el AND condicional del ruling dentro del `MODIFIED` → es un punto «si el RED lo exhibe»: con `k4` limpio sale con su `Ruling:` como dice el AND vigente, antes de la fusión (decisión 7). Partir el delta en dos versiones añade forma sin cambiar la conducta.
- **Aceptado** — la deuda a la 0311 y el aviso al eje Spec no estaban en el Scope → decisión 15: al ticket de cierre, y el aviso es texto del despacho de esta revisión, no de una skill.
- **Aceptado** — el THEN de `verification` daba dos lugares → «donde se calcula el diff del paquete»; el AND, verificado con la receta ejecutada (decisión 12).
- **Aceptado** — la fila de `f1` era frágil → `/workspace (-C\|--directory) /`, contrastada con la forma de la llamada en las salidas de la 0163.
- **Aceptado** — la decisión 11 afirmaba sin medir → escrita como riesgo que mide el GREEN.

### Decisiones tomadas con el dev-lead

- Carril feature, perfil `delegate`, y `sdd merge --push` al fusionar — «Arranca la 0322 con sdd-propose, carril feature… Perfil delegate. Al fusionar, `sdd merge --push`.»
- RED antes de cambiar (Art. I) con las baterías de `sdd-implement` y `sdd-verify`; si el RED de una regla sale limpio, esa no se escribe — «Si el RED de una regla sale limpio, esa no se escribe, como en la 0297»
- Los GIVEN son los casos de campo: 0306 §3, 0310 §3, 0299 §1, 0297 §1 y el menor de la 0300 — «Los casos de campo son los GIVEN»
- La frase que sale se sustituye entera, sin frase al lado (ADR 0022, regla 3); `sdd-implement` no pasa de 20.000 bytes — «La frase que sale se sustituye entera, sin frase al lado»
- La previsión de coste cita `battery.mjs plan`; para un humo, N=1 — «La previsión de coste cita la salida de node tests/headless/battery.mjs plan; para un humo, N=1»
- Quitar en un REFACTOR algo que la spec dice que se queda es un desvío — «Quitar en un REFACTOR algo que la spec dice que se queda es un desvío: paras»
- Los recuentos de la spec se miden antes de fijarlos — «Antes de fijar en la spec un recuento, mídelo»
- Redacción de la frase por confirmar en el diseño — «La redacción está por confirmar en el diseño»
- Review de spec con dos lentes, dominio en Opus y técnica en Sonnet — «haz revision opus dom tec sonnet» (2026-11-09)
- La frase del REFACTOR entra en el alcance para dejar el saldo de palabras en 0 (decisión 2) — opción «Apruebo, y en el punto 1 toco la frase del REFACTOR» (2026-11-09)

## Intent

Dos reglas de `sdd-implement` fallan en campo. Un `Ruling:` quita o cambia lo que la spec fija sin parar (cinco casos: 0128, 0148, 0299, 0306 y 0310), y una enmienda que reescribe un THEN llega a la parada sin que nadie más que su autor la lea (0297 y 0306: la review que pidió después el dev-lead dio 14 hallazgos, 8 Important). Además, la receta del paquete de la revisión final calcula el workspace dentro del worktree de revisión, y el paquete se borra con él (0300, 0313). El éxito: el ✋ de una enmienda trae los hallazgos de un revisor de spec; el paquete sobrevive al borrado del worktree de revisión; si el RED de `k4` lo exhibe, un REFACTOR que quita lo que la spec deja para como desvío (si sale limpio, no se escribe y su fila sigue abierta); y nada de esto alarga `sdd-implement`. Fracaso aunque funcione: una frase nueva al lado de la que falla, o un rojo nuevo en el tramo de «Deviations and rulings».

## Scope

- Entra: en `skills/sdd-implement/SKILL.md`, «Deviations and rulings», la frase de la parada sustituida entera (decisión 3), y la frase del REFACTOR y «a line of «Decisiones…» of the spec» sustituidas enteras para compensar las palabras (decisiones 2 y 6).
- Entra: en `skills/sdd-verify/references/encargo-revision.md`, la línea `WORKSPACE="$(sdd workspace "<plan>")"` pasa a `WORKSPACE="$(sdd workspace -C "<worktree de la feature>" "<plan>")"`, con su compensación de palabras (decisión 16).
- Entra: `tests/batteries/sdd-verify/battery.md` (fila de la enmienda en `c6` y `c10`, fila C6 reescrita, filas de `f1`, procedencia) y `tests/batteries/sdd-implement/battery.md` (fila de la enmienda en `u1`; escenario `k4` en la tabla, en «Montaje por escenario» y en la procedencia), `tests/batteries/sdd-implement/subject.mjs` (`k4` en la lista de `mold-kit` de la línea 89, en `molds` y en la lista sin `Agent`), sus `fixtures/`, `cli/test/kit/headless/molds.test.ts` si su recorrido de moldes lo pide, y la evidencia RED/GREEN en `tests/`.
- Entra, si el RED lo exhibe: en `skills/sdd-implement/SKILL.md`, la red flag «You're about to record as a ruling a discovered fix that is already the third, or a decision that changes the observable output, without the scope brake.» sustituida entera (decisión 7), con el AND del ruling del delta de `control-profiles`. Su RED: `k4`, n = 3.
- No entra: el resto de «Deviations and rulings» (salvo lo de la decisión 2), la definición de desvío y la acción update de `skills/sdd-propose/references/control-profiles.md`, y la traducción de los encargos de los ejes (0311).
- No entra: un revisor de la enmienda en `unattended`. Ahí no hay aprobación que proteger; el hueco es la enmienda que pide la propia revisión final, que solo lee la re-revisión única si aún no salió. Sin caso de campo: va al ticket.
- No entra: un aviso de `sdd ledger rulings` sobre rulings que quitan literales de la spec (propuesta del ticket de la 0306 §3): sería CLI nueva para un caso que la regla cubre.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Frase de la parada por desvío («In `pair` and `delegate`, stop as «How you stop» says, leave the correction…») | `skills/sdd-implement/SKILL.md:61`; la acción update que describe, en `.docs/sdd/capabilities/control-profiles.md:54-55` | sustituida entera (decisión 3) · delta, `MODIFIED` de «Un cambio a la spec aprobada es un desvío» |
| Frase del REFACTOR («A REFACTOR or fix round that writes guidance or behavior the spec doesn't have…») | `skills/sdd-implement/SKILL.md:61`; su regla, en `.docs/sdd/capabilities/control-profiles.md:61` | sustituida entera con la misma regla, el mismo ejemplo y el «not a ruling» (decisión 6): el AND de la capacidad no cambia |
| La acción update sin el revisor de la enmienda | `skills/sdd-propose/references/control-profiles.md:74` | no se toca (decisión 15) · al ticket de cierre, para la 0311, que alinea las dos copias de la acción update |
| Línea `WORKSPACE="$(sdd workspace "<plan>")"` de la receta del paquete | `skills/sdd-verify/references/encargo-revision.md:43`; «con el paquete construido allí», en `.docs/sdd/capabilities/verification.md:140` | sustituida (decisión 16) · delta, `MODIFIED` de «El revisor final trabaja aislado en el sha que revisa» |
| Filas C5, C6 y C8 de la rúbrica («despacha otra re-revisión») | `tests/batteries/sdd-verify/battery.md:105`, `:106` y `:108` | reescritas (decisión 10) |
| Red flag del ruling («You're about to record as a ruling a discovered fix that is already the third…»), si el RED lo exhibe | `skills/sdd-implement/SKILL.md:80` | sustituida entera (decisión 7) · delta, AND del `MODIFIED` de `control-profiles` |

- Filas que implementa: 0322 → `.docs/sdd/roadmap.md` (fila 0322 y mención en la fila 0311) y las de deuda «Una enmienda que cambia el delta llega a la parada sin review de spec» y «Un freno que fija la spec se esquiva con un ruling»: las cierra `sdd-archive`; la del ruling solo si `k4` lo exhibe (decisión 7) · comprobado con `git grep -n "0322"` fuera de las carpetas de evidencia.

## Approach

El de la decisión 1 (a): cada frente cambia la frase que decide en su paso, sustituida entera, y el saldo de palabras se compensa en el mismo punto «Deviation». Los tres frentes son independientes y se prueban por separado: la enmienda con `c6`, `c10` y `u1`; el ruling con `k4`; el `-C` con la receta ejecutada y `f1`.

## Dónde se prueba

- El revisor de la enmienda: batería de `sdd-verify`, `c6` y `c10`, y de `sdd-implement`, `u1`, con la fila de prosa (decisión 10); RED de `c6` y `c10` con el kit de `develop`, GREEN con el de la rama.
- El REFACTOR que quita lo que la spec deja: batería de `sdd-implement`, `k4` nuevo, n = 3 (decisión 8).
- El paquete con `-C`: la receta ejecutada en un worktree de revisión desanclado de esta rama, antes y después, con la ruta que da y el paquete aún en su sitio tras `git worktree remove`; y `f1` de `sdd-verify` con `N=1`, filas nuevas (decisión 10).
- No regresión: el tramo de la decisión 14, con el control de la decisión 13; y `moon run kit:build kit:copies kit:own kit:skill-size` sin rojos nuevos frente a `develop`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna — aplica la ADR 0022 sin cambiarla

## Delta de comportamiento

### Capacidad: `control-profiles`

#### MODIFIED — Un cambio a la spec aprobada es un desvío

- GIVEN la spec aprobada de cancelar reservas, con la Task 1 cerrada y la Task 2 en curso, que descubre que la spec pide guardar el motivo de la cancelación y la tabla de reservas no tiene ese campo
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba»
- THEN en `pair` y `delegate` el agente para con el 🦆 del cambio y su ✋, deja escrito sin commitear el THEN corregido en su sitio de la spec y la línea en `## Enmiendas`, y espera la aprobación
- AND en `pair` y `delegate`, si la corrección cambia el delta —un requisito, un GIVEN, un WHEN o un THEN, también el que pide la revisión final—, antes de parar despacha un revisor de spec en `sonnet` con los siete puntos de `review-spec.md`, y su ✋ trae sus hallazgos; también después de la re-revisión única, porque lee la spec y no un commit de código
- AND con la aprobación, commitea la spec y sigue implementando; si la enmienda obliga a cambiar la Task 1, ya cerrada (guardar quién cancela con `--por <nombre>`), añade al plan `Task 3 — enmienda <fecha>: guardar quién cancela` con su `Tras` y anota en `tasks.md` la Task 1 como `afectada por enmienda <fecha> → Task 3`; si solo cambia la Task 2 en curso (quitar «quién canceló» del listado), el trabajo sigue en la Task 2, con la nota de la enmienda
- AND la Task 1 no se reabre ni se reescribe su commit; una task nueva no se da por hecha sin su verificación ni su `sdd task done`
- AND sin aprobación no sigue con la enmienda
- AND la misma acción se aplica cuando la respuesta a un freno de alcance cambia el texto de la spec; si no lo cambia, la respuesta se apunta en «Enmiendas» sin corregir nada
- AND en `unattended` elige la opción más conservadora, la aplica igual en su sitio con su línea de «Enmiendas» marcada `sin aprobar` y, si no hay opción que no bloquee, aparca la feature (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las features abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x), o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, el «Toca:» o la fila de la feature añade esos ficheros
- AND con el humo de una skill fallado y una ronda de REFACTOR cuya guía nueva añade un AND a un requisito de la spec, el hilo para con el 🦆 y el ✋ antes de commitear esa guía, y no la commitea en la task en curso para pedir la aprobación en la siguiente
- AND un `Ruling:` no quita ni cambia lo que la spec fija —una decisión, un umbral, un texto que deja—: con una decisión del dev-lead que deja dos red flags de una skill y una ronda de REFACTOR que solo cabe en el tope de palabras quitándolas, el hilo para con el 🦆, el ✋ y la medida antes de commitear
- AND en `pair` y `delegate`, un AND o un THEN de una ronda de REFACTOR o de fix que solo aplica, literal, una línea de «Decisiones tomadas con el dev-lead» de la spec no para: se escribe en su sitio con su línea de `## Enmiendas` marcada `sin aprobar`, se commitea con la ronda y se nombra en ✋; un valor, un caso o un texto que esa línea no dice para como desvío
- AND un punto del Scope marcado «si el RED lo exhibe», con RED limpio 3 de 3, sale con un `Ruling:` y sin parar; con menos sujetos, no sale
- AND un punto del Scope sin esa marca, con RED limpio, es un desvío: para con la medida en la pregunta, y ni lo saca ni escribe su guía

### Capacidad: `verification`

#### MODIFIED — El revisor final trabaja aislado en el sha que revisa

- GIVEN los ejes despachados sobre `a1b2c3d`, y el hilo que commitea después `e4f5a6b` (un fix de la verificación visual)
- WHEN los ejes leen el código y el historial
- THEN trabajan en un worktree desanclado `review-0096-a1b2c3d`, creado con `git worktree add --detach` en `a1b2c3d`, donde se calcula el diff del paquete, y su encargo les dice que no miren ramas ni commits posteriores
- AND el paquete se escribe en el workspace del plan del worktree de la feature, no en el de `review-0096-a1b2c3d`, y sigue ahí después de `git worktree remove` del worktree de revisión
- AND ningún informe cita `e4f5a6b`
- AND la re-revisión se ancla igual, en el último sha de su tramo
- AND el hilo retira el worktree con `git worktree remove` cuando han vuelto todos los ejes

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-implement` · `SKILL.md` | 2.607 / 2.658 (×1,25 de `slack`: 3.322) | 51 bajo el tope nominal | sin cambio (saldo medido 0; +5 con la red flag, a ≤ 0 en la Task 2) |
| `sdd-implement` · total | 6.566 / 6.657 (8.321) | 91 bajo el tope nominal | sin cambio |
| `sdd-verify` · total | 9.577 / 9.120 (11.400) | 457 sobre el tope nominal y 1.823 bajo el límite con `slack` | sin cambio (saldo medido −1, decisión 16) |

## Previsión de coste

Precios de `node tests/headless/battery.mjs plan` (2026-11-09), con `SCENARIOS` y `N` de cada tanda; `k4` sin medida previa, con el precio de `a1` (mismo molde y modelo); `u1` y `u2` sin medida previa, a 0,55 $, la media que da `plan`. Las filas «Controles» y «Medición tras la revisión final» son reservas, no previsión de `plan`.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `c6 c10` con el kit de `develop` (`sdd-verify`): 5 · `k4` n = 3 (`sdd-implement`, como `a1` con `N=3`): 3 · `-C`: 0, estructural | 3,27 + 2,27 = 5,54 |
| GREEN | `c6 c8 c10 c10e` (`sdd-verify`): 9 · `k4` n = 3, si se escribe: 3 · `f1` con `N=1`: 1 | 5,09 + 0,61 + 2,27 + 1,64 = 9,61 |
| Una tanda de REFACTOR | `c6 c10`: 5 · `k4`, si se escribe: 3 | 3,27 + 2,27 = 5,54 |
| GREEN del tramo (no regresión) | tramo de `sdd-implement` (decisión 14), `u1` incluido: 30 | 14,68 |
| Controles (reserva) | relanzar con el kit de `develop` lo que salga rojo en el GREEN (decisión 13) | ~3 |
| Medición tras la revisión final (reserva) | ~20 % para lo que destape (`tech-stack.md`) | ~7 |
| Suma | ~59 sujetos | ~45,37 |

Paso nuevo o cambiado → escenario: la frase de la parada → `c6`, `c10`, `u1` (y `u2`, `k1`, `g1`, `d1`, `a1`, `a2` como control de la acción update); la frase del REFACTOR → `k2`, `k3`, `o1`, `o2`; la red flag del ruling, si se escribe → `k4`, `fr1`, `d1`, `c10`; la receta del paquete → receta ejecutada y `f1`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-09 | aprobada (opción «Apruebo, y en el punto 1 toco la frase del REFACTOR») |
