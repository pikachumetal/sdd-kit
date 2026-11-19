# Tasks — feature 0359

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Escenarios y RED | hecha | 52ecebd |
| 2 — `sdd-spec-review` | hecha | 1d43f85 |
| 3 — `sdd-plan-writing` | hecha | a36877e |
| 4 — `sdd-spec-writing`, `sdd-spec-approval` y `sdd-propose` reducido | hecha | da26f4c |
| 5 — Constitución, ADR, documentos y tramo | hecha | 6a42ab2 |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura opus+high, con arreglos, sobre 6a42ab2
Pasada de fix: juntada en el cierre, 9 sujetos de medida (rs1, iq4, pb-p, pb-c, u1, c6, c10, s1), sin test que reproduzca cada hallazgo de texto: kit:* y test/kit en verde
Re-revisión: 6a42ab2..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, con arreglos (1 Important nuevo: el anuncio en la delegada)

## Rulings

- Ruling: el include `includes/phase-notice.md` se crea en la Task 2, no en la 4 — la Task 2 ya lo incluye y el build fallaría sin él — si es un error, solo cambia en qué commit nace.
- Ruling: el tope de `sdd-propose` baja por pasos: cada task deja el tope en lo que mide tras quitar su referencia (redondeado al alza), y la Task 4 lo fija en 2.900 / 9.400 — el tope aprobado es el final; los intermedios no los fija la spec — si es un error, un tope intermedio holgado deja pasar crecimiento entre tasks, que el final atrapa igual.
- Task 1: Ruling: la verificación de sdd task done es `battery.mjs plan` de ss1 y rq1 (parsea la batería y los escenarios), no el run — el run ya se hizo y leyó (RED ss1 0/3, rq1 2/3, 1,11 $) y relanzarlo gasta sujetos — si falla, una fila mal formada de la rúbrica no la ve el plan; la ve el run del GREEN.
- Task 2: Ruling: base comprobada contra develop y origin/develop — la fila 0359 no cambia y ningún fichero de la task cambia en la base — sin coste.
- Task 2: Ruling: tope de sdd-spec-review a 1.460 / 1.860 (medido 1.429 / 1.819 + 2 %), no 1.250 / 1.680 — la previsión «sin medir» de la spec no contó los includes user-language y phase-notice (~85), la frase de la decisión 25 ni la línea de la prosa; la tabla de topes no es requisito, THEN ni Scope, así que no es desvío — si es un error, son ~180 palabras que el dev-lead no aprobó; las paga la bajada de sdd-propose (−1.599 de review-spec.md), y va al mensaje final.
- Task 2: Ruling: sdd-spec-review nombra a quien la invoca como «the spec step» hasta la Task 4, que lo cambia a sdd-spec-writing — skills.test.ts exige que toda skill nombrada exista — si es un error, la Task 4 olvida cambiarlo y la descripción no nombra la fase; lo busca su verificación.
- Task 2: Ruling: enmienda aprobada (dev-lead «1»): ADR 0039 sustituye a la 0024 en esta task; 0040 y 0041 a la 0028 y la 0029 en la Task 3; 0042 a la 0035 en la Task 4 — cada una nace con la task que deja su ruta huérfana — si es un error, solo cambia el orden de los números.
- Task 2: Ruling: la enmienda va en el commit de la Task 2 — el pre-commit corre la suite sobre el árbol con la task a medias — sin coste.
- Task 2: Ruling: las peticiones «sigue: paso 4» de rv1-rv3, rr1 y lr1 no cambian en esta task — sdd-propose conserva el paso 4 hasta la Task 4, que las cambia — sin coste.
- Task 2: Ruling: GREEN rq1 3/3, rv1 2/2 (2,49 $); la verificación de task done son los tests de test/kit con --test-timeout 120000, no la batería, ya corrida y leída — si es un error, una regresión de la batería sin re-medir la ve el tramo de la Task 5.
- Task 3: Ruling: base comprobada — sin solapes con develop — sin coste.
- Task 3: Ruling: las filas de Procedencia (216, 273) nombran plan-writing.md como historia y no cambian; H1 cambia en la Task 4 con spec-writing.md — la procedencia es evidencia, no guía — si es un error, una fila dice un fichero que ya no existe.
- Task 3: Ruling: tope de sdd-plan-writing a 2.220 (medido 2.174 + 2 %), no 1.800 — la previsión «sin medir» contaba ~1.000 del original, y conservar la cabecera con Global Constraints y Review Focus (decisión 26) deja más — si es un error, ~420 palabras que el dev-lead no aprobó; sdd-propose baja de 13.937 a 11.054 en total; va al mensaje final.
- Task 3: Ruling: la opción de parar antes de la Task 1 en pair remite al anuncio de sdd-propose en vez de repetirla literal — kit:own rechaza las tres frases repetidas entre las dos SKILL.md — si es un error, la sesión en pair no tiene el texto a mano; sdd-propose sigue cargada en la sesión.
- Task 3: Ruling: GREEN p2 1/1, k2p 1/1 (2,62 $); task done con los tests de test/kit — la batería ya se corrió y leyó — sin coste.
- Task 4: Ruling: enmienda 29 aprobada (dev-lead: «si me lo revates 1», rebatido con la evidencia de 14/15 y 0/2) — sigo con la Task 4 partida en sdd-spec-writing y sdd-spec-approval — sin coste.
- Task 4: Ruling: base comprobada sin solapes — sin coste.
- Task 4: Ruling: patch-flow.md:7, :11, :21 decían «move up through step 4 of sdd-propose» → «through sdd-propose, which hands it to sdd-spec-writing», como el MODIFIED de «El patch registra…» — la tabla de la spec no los listaba; sin el cambio nombran un paso que ya no existe — si es un error, ninguno: es la misma ruta.
- Task 4: Ruling: tope de sdd-spec-writing a 3.280 (medido 3.215 + 2 %), no 3.100 — la previsión «sin medir» de la enmienda no contó el texto del original recuperado para llegar al 51 % — si es un error, ~180 palabras sin aprobar; sdd-propose baja a 8.665 en total (tope 9.400). Bytes: 18.903 < 20.000.
- Task 4: Ruling: enmienda 30 aprobada (dev-lead «1») — sin coste.
- Task 4: Ruling: REFACTOR (una tanda): en el mensaje de los montones, los puntos del dev-lead se nombran sin preguntarlos y la única interrogación es la pregunta del turno — iq3-1 listó dos puntos con «¿…?»; no cambia ningún THEN — si es un error, el sujeto deja de anunciar qué preguntará después.
- Task 4: Ruling: segunda tanda de REFACTOR aprobada por el dev-lead («1») para el montón vacío (iq2 n=3 + ss1), ~6 $ — la primera dejó iq2 en 0/2 — sin coste fuera de lo aprobado.
- Task 4: Ruling: tope de sdd-spec-writing a 3.350 (3.284 + 2 %) por el tope de la segunda ronda — si es un error, ~70 palabras más.
- Task 4: Ruling: el tope de la constitución (2.303) entra en el commit de la Task 4 con el resto de word-budget.test.ts; la línea del Art. II, en la Task 5 — sin coste.
- Task 4: Ruling: GREEN ss1 3/3, iq3 2/2, iq4 1/1, iq2 para antes de spec.md 3/3 con el hueco de la sala inexistente (va al ticket); el camino del montón vacío queda sin observar — si es un error, una feature cerrada pide un turno de confirmación que nadie midió.
- Task 5: Ruling: co2p rojo automático (CO2P-M) leído como verde — la fila de «Topes de palabras» lleva la previsión medida (52 + 42 + 20 = 114) con «=» y no con «→» o «sin medir»; la conducta de la fila (el origen del recuento en una fila) está — si es un error, una regresión del repaso de coherencia pasa sin ver.
- Task 5: Ruling: tercera tanda de REFACTOR aprobada (dev-lead «1»): fila de racionalización en sdd-spec-approval para el traspaso tras aprobar por delegación; iq4 a n=3 — el tramo dio iq4 0/1 (acaba con «Dime sigue») — previsión a 100 sujetos.
- Task 5: Ruling: el lector de prosa (sonnet) halló regresiones de reglas movidas: a1 sin anuncio (el enlace «la nota la abre el anuncio» se perdió), g1 sin «prevé <n> tasks» en la tercera opción, sp1 sin invocar sdd-templates (la tabla de topes) — restauradas literales y re-medidas a N=1; t1 y las E3/E7 del entrevistador quedan como dudas de un caso para el ticket — si es un error, una regresión del entrevistador pasa sin fila.
- Task 5: Ruling: iq4 a n=3 da 1/3 con la fila de racionalización (0/1 sin ella): los dos rojos presentan la spec y paran porque la petición dice «Escribe la spec y preséntamela»; la fila se quita (Art. IX: guía sin efecto no se queda) y SA2 va al ticket como fila que choca con su petición; el traspaso aprobación → plan lo miden p2 y k2p — si es un error, una sesión delegada para tras aprobar y nadie lo ve.
- Task 5: Ruling: el anuncio pasa al primer mensaje de sdd-spec-writing («abre con las líneas del anuncio si aún no han salido»); el cambio en sdd-propose se revierte (a1 0/1 con él) — techo 102 aprobado por el dev-lead.
- Task 5: Ruling: el bloque del anuncio pasa de sdd-propose al primer mensaje de sdd-spec-writing (Art. II, elemento omitido); tope de sdd-spec-writing a 3.450 (3.381 + 2 %), sdd-propose baja a 2.144; bytes 19.905 < 20.000, margen 95 — si es un error, la próxima frase en el fork lo pasa de 20.000.
- Final: Ruling: el paquete excluye dist/** además de la carpeta de la feature — dist es el build de skills/ y lo duplica — si es un error, un fallo del build que solo se ve en dist lo caza kit:build y dist.test.ts.
- Final: Ruling: no se reponen literales (eje Spec I5, eje Código I2): «what will you do with it?», «¿va bien?», «in delegate the Approach says so» y «what the user says goes to Intent» — sdd-spec-writing está a 32 bytes del corte de 20.000 (antiobjetivo 4); sus reglas siguen cubiertas por «Get them describing» y la Discovery de sdd-grilling, «End each chunk by asking what's wrong or missing», el bloque de «Lay out the approaches» en delegate y «With nobody to answer»; pb-p y pb-c las miden — si es un error, una sección sin «¿va bien?» o una pregunta de porqué con menú.
- Final: Ruling: la opción de pair «paras antes de la Task 1» en sdd-plan-writing sigue remitiendo al anuncio (eje Código Minor 1, Spec I5) — kit:own rechaza las frases repetidas; el anuncio vive ahora en includes/announcement.md, que sdd-propose y sdd-spec-writing cargan — si es un error, en una batería que invoca sdd-plan-writing sola la condición no está en contexto.
- Final: Ruling: el spike sigue sin repaso de coherencia en sdd-spec-approval (eje Spec M4) — el paso 4 de antes lo decía «in both modes», full y lite — sin coste nuevo. ADR 0027 no se toca (eje Arquitectura Minor 6): inmutable, y crear carpetas sigue siendo convención del kit. control-profiles.md compartido por siete skills: recomendación, sin cambio. M9 (fuente frente al kit en delegate): pb en delegate sale verde; sin cambio.
- Final: Ruling: «¿va bien?» restaurado en sdd-spec-writing (pb-p de la pasada salió sin secciones: PB-P falla) y «full, lite or spike» quitado de Size the Work para caber (19.990 bytes aprox.) — sin medir: la campaña llegó a 113 de 113 — si es un error, pair sigue sin secciones.
- Final: Ruling: PB-P (pb-p) leída como fila vieja frente a la decisión 8 — en pair, los enfoques van en el primer mensaje solo con el montón del dev-lead vacío; el sujeto pregunta antes un punto de ese montón — si es un error, pair pierde el mensaje de enfoques.
