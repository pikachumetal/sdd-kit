# Tasks — feature 0342

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — La batería mide la carga entera | hecha | a1c6fb1 |
| 2 — RED con el núcleo de hoy | hecha | 50317a6 |
| 3 — Núcleo y territorios | hecha (afectada por las enmiendas del 2026-11-14 → Task 4) | 06c48b4 |
| 4 — GREEN y REFACTOR, con las enmiendas del 2026-11-14 | hecha | bdbcefd, 6f6b295 y este commit |
| 5 — Pasada por los llamantes y cierre de la deuda | hecha | 0e7a108 |

Revisión final: Spec opus+high, con arreglos (3 Important, 6 Minor; 5 sin verificar) · Código sonnet+high, con arreglos (1 Important, 7 Minor) · Arquitectura no (plan), sobre el último commit de la Task 5 con el plan al día (juntado en el cierre)
Pasada de fix: juntada en el cierre, 13 hallazgos (los casos nuevos de test pasan sin RED: cubren comportamiento existente; el resto, texto, con la suite)
Re-revisión: la revisión final..la pasada de fix (juntadas en el cierre), sdd-kit:effort-high + opus, todos los hallazgos resueltos sin fallos nuevos Critical ni Important; 1 Minor nuevo (la decisión 15 decía «sin regresión»), arreglado en el hilo; el hallazgo de la decisión 5, al dev-lead

## Saldo de palabras

| Fichero | `wc -w` en `50317a64` | Ahora | Saldo |
| --- | --- | --- | --- |
| `skills/sdd-grilling/SKILL.md` | 887 | 884 | −3 |
| `skills/sdd-explore/SKILL.md` | 1013 | 1012 | −1 |
| `skills/sdd-init/SKILL.md` | 2642 | 2642 | 0 |
| `skills/sdd-propose/references/spec-writing.md` | 1060 | 1064 | +4 |
| `skills/sdd-roadmap/references/proposal.md`, `skills/sdd-config/SKILL.md`, `skills/sdd-templates/templates/spec-template.md` | — | sin cambio | 0 |
| Total | | | 0 |

## Rulings

- Task 1: Ruling: los tests de extract.mjs van en interviewer-transcript.test.ts (decisión 3 del plan) — ningún test llama hoy a extract.mjs tools — si me equivoco, un fichero de test más mezclado.
- Task 1: Ruling: la prosa de la rúbrica (carga del núcleo) dice lectura entera de sdd-grilling/SKILL.md, como la K — el lector puntuaba «cargó» con cualquier mención — ninguno.
- Task 1: Ruling: transcript.mjs no corta ningún argumento conocido (pattern, query, url, description tampoco), solo el volcado JSON — es lo que dice la decisión 12 al pie de la letra — un transcript algo más largo.
- Task 2: Ruling: relanzo fp-1 una vez (no cargó: solo Skill sdd-propose, sin núcleo) — decisión 6 de la spec; primer intento en red/no-cargo/ y .temp/i/runs-no-cargo/red/ — si me equivoco, un sujeto de más.
- Task 2: Ruling: SUBJECT_CAP=182 a mano — run.mjs no lee la fila «Suma» de la previsión (aviso «sin previsión legible») — ninguno: COST_CAP=44 manda.
- Task 2: Ruling: relectura g8 — g8-2 E6 pasa (enseña PRODUCT.md:5 con su fuente y pide confirmarlo, que es lo que pide la regla); g8-4 y g8-5 E6 pasan (menú sobre el origen de las referencias huérfanas, no sobre para quién o para qué) — si me equivoco, 2 «falla» de E6 de menos en el RED de g8.
- Task 2: Ruling: E0 sale 20/20 en el RED (sin el fallo del spike); la pieza de E0 se escribe igual porque sustituye «Facts are your job; decisions are the user's» en el núcleo de cero (Art. IX, decisión del dev-lead), y el GREEN la mide como no regresión — el RED la exhibe en E4w, E1, E6 y E5 — si me equivoco, una frase del núcleo sin RED propio: se dice en el walkthrough y en el aviso final.
- Task 3: Ruling: la línea «Pendiente de ti» sube spec-template.md 14 palabras sin compensar del todo en el ✋ (−2) — word-budget de sdd-templates pasa con su tope; el saldo conjunto queda negativo — si me equivoco, 12 palabras más en una plantilla.
- Task 3: Ruling: spec-writing.md sube 33 palabras (compensadas en parte en la misma sección: Intent ya no repite la definición de antiobjetivo); cabe en el tope de sdd-propose sin subirlo — si me equivoco, el saldo conjunto lo absorbe: −33 en wc -w.
- Task 3: Ruling: en sdd-explore quito «(no artifacts, not tied to SDD)» y el «applied to a question…» de brainstorming para compensar el territorio — el paso 3 ya dice cero artefactos y la tabla de racionalizaciones da el porqué de brainstorming — si me equivoco, un sujeto de explore deja un artefacto (lo mide e1 y u1).
- Task 4: Ruling: relanzo fp-2 y fp-5 una vez (no cargaron: solo Skill sdd-propose) — decisión 6; primer intento en green/no-cargo/ — si me equivoco, dos sujetos de más (~0,5 $).
- Task 4: Ruling: relectura GREEN g8 — g8-3 E6 pasa (confirma PRODUCT.md sin ejemplos); g8-4 E6 pasa (hecho con fuente; la doble pregunta va a E5); g8-1 y g8-2 E6 se sostienen («por ejemplo…» tras la confirmación) — si me equivoco, E6 de g8 1 «falla» más o menos.
- Task 4: Ruling: relectura GREEN — g4-1 R7 pasa (acepta y escribe la fila, solo nombra el hecho); g3-1 E0, g1-2 E0, g9-4 E0, fp E1, pe E3/E5/E7, g6-2 R9, g7 C1 se sostienen con su cita — si me equivoco, una «falla» de R7 de menos.
- Task 4: Ruling: REFACTOR 1 — núcleo: búsqueda web para comparar con otra herramienta o versión (E4w), pregunta abierta que acaba en el signo de interrogación (E5, E6), rechazo sin opciones (R9, frase que quité al reescribir), lo que se mantiene se hace tal como se pidió (E1); sdd-config paso 2 tras la tabla (C1); spec-writing carga el núcleo también ante un rebate (K de fp). Núcleo recortado a 817 con wc -w para no subir su tope — si me equivoco, una frase recortada pierde una conducta: lo mide el GREEN final.
- Task 4: Ruling: REFACTOR 1 suma el boceto (B1 de sk 0/2): «shown, not described… on the app, which you start» repone el contraejemplo de la 0168 que quité al reescribir; ag-2 A1 queda «pasa» sin verificar (el sujeto no guardó spec.md) — si me equivoco, un A1 rojo sin ver.
- Task 4: Ruling: el kit del REFACTOR sale de dist/ sin commitear (copia en .temp/i/kit-r1) — los cambios van en el commit de la Task 4 — si me equivoco, la evidencia no apunta a un sha: el walkthrough dice qué texto midió.
- Task 4: Ruling: relanzo g8-3 y fp-4 del REFACTOR 1 una vez (no cargaron: solo Skill sdd-init / sdd-propose) — decisión 6 — si me equivoco, dos sujetos de más.
- Task 4: Ruling: fp-4 no carga en el relanzamiento: segundo «no cargó» de fp (también fp-2 en el GREEN 1) — rojo de K por la decisión 6 — ninguno: se cuenta como rojo.
- Task 4: Ruling: control con el núcleo de antes (kit-red) en g7 y sk, 4 sujetos — saber si C1 y B1 son regresión de la 0342 antes de gastar la ronda 2 en ellos — si me equivoco, ~1,1 $.
- Task 4: Ruling: control con el núcleo de antes — g7 C1 2/2 (C1 es regresión de la 0342: el paso 2 de sdd-config vuelve a su orden de antes, con la parada al final); sk B1 1/2 (sk-1 también describe en texto: B1 ya era ruidoso, no es regresión) — si me equivoco, B1 sigue rojo sin causa nuestra.
- Task 4: Ruling: la ronda 2 va dentro del GREEN final (cambios + GREEN entero una vez, PHASE=green-2) en vez de una tanda sobre los rojos y después el GREEN — con 27,61 $ gastados, la ronda aparte más el GREEN pasaban COST_CAP=44 — si me equivoco, un rojo de la ronda 2 se ve en el GREEN final y para (decisión 8) igual.
- Task 4: Ruling: ronda 2 — ejemplo de pregunta abierta neutro (el del CSV se copiaba en pe y p3, E3 0/5); búsqueda sin salida («la pregunta cita la URL»); contraejemplo de pregunta doble en «One decision per turn» (E5); sdd-config paso 2 en su orden de antes (C1).
- Task 4: Ruling: GREEN final — E4w de g9 1/5 tras dos rondas: rojo, paro y lo enseño (decisión 8); antes completo la evidencia (relanzo g2-2 y fp-1, que no cargaron, y leo la tanda) para que el dev-lead decida con todo — ~4 $ — si me equivoco, 4 $ de lectura que no cambian la parada.
- Task 4: Ruling: parada por desvío (decisión 8) — enmienda propuesta en spec.md, sin commitear; no cambia el delta, así que sin revisor — el dev-lead decide: cerrar con lo medido y deuda, otra ronda con más presupuesto, o volver al núcleo de antes.
- Task 4: Ruling: el dev-lead elige aligerar («1», 2026-11-14) — enmienda escrita en spec.md (núcleo de antes sin territorio + tres piezas medidas; búsqueda web y E4w fuera; proposal, config y plantilla vuelven a su texto; COST_CAP 58; tope del núcleo 886); revisor Sonnet de la enmienda, y GREEN entero (PHASE=green-3) con el kit aligerado — si me equivoco en una pieza, la mide el GREEN.
- Task 4: Ruling: GREEN aligerado (green-3) corta en el techo de 58 $ con 56 de 59 sujetos (faltan sk-2, fl-2, ag-2): los sujetos salieron más caros que el precio de plan; 4 «no cargó» (g8-2, g8-4, g3-1, fp-3) sin relanzar por el techo — leo lo que hay y el dev-lead decide el dinero para completar.
- Task 4: Ruling: segunda enmienda («1», 2026-11-14) — frase del porqué literal en spec-writing.md; relanzo con kit-r4 (green-3) g8-2, g8-4 y g7-2, que no dependen de spec-writing; mido otra vez con kit-r5 (green-4) p1 g3 p3 pe fp y sk fl ag — COST_CAP 66 — si me equivoco, ~8 $.
- Task 4: Ruling: g7-2 entra otra vez por sdd-upgrade (segundo intento): rojo de puerta de g7, no del núcleo — va a deuda con g7 (la puerta de «revisa la configuración» en un molde 3.0.0); fp-3 de green-4 no cargó: relanzado una vez.
- Final: Ruling: la K da «no cargó» a `cat … 2>&1`, a los alias `gc`/`type` y acepta `my-sdd-grilling/SKILL.md` en Read (Código M5) — ningún sujeto de las 7 tandas lo hizo y la decisión 10 fija la celda literal; un caso así se relanza una vez — un relanzamiento de más.
- Final: Ruling: AND «lo mantenido va a Decisiones tomadas con el dev-lead» y AND «todo de golpe» sin fila (Spec M5, M6) — declarados ⚠ en el plan; el texto los lleva — un comportamiento sin medir.
- Final: Ruling: Declined to judge del eje Spec — sdd-explore parafrasea el porqué sin contraejemplo: g1, g9, rq en verde en green-3, lo mide E6 donde aplica; queda como riesgo en 4.3 — si me equivoco, un menú en explore.
- Final: Ruling: Declined to judge — el resto (comentarios, borrar la fila de deuda, Look it up que se queda, ADR 0014 sin hueco) se sostiene como dice cada eje — ninguno.
- Final: Ruling: parada por desvío — la decisión 5 a la letra deja fp E5, g7 R4/R10 peores que el núcleo de antes por un sujeto (n4 S2 igual, control 0/1); enmienda propuesta en spec.md, sin commitear, sin cambio de delta — decide el dev-lead
- Final: Ruling: fuera de alcance de la re-revisión — plan §4 sin línea para «no pregunta lo que la petición dice» y para la parada de explore/propose; bloque de review del ✋ con los recuentos de la versión del 2026-11-13 — el primero lo cubren E3/E2b/E7 de la batería; el segundo es el registro de aquella review, como dice la primera enmienda — ninguno.
