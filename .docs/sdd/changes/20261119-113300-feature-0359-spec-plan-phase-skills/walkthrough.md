---
id: 20261119-113300-feature-0359-spec-plan-phase-skills
feature: 0359
title: Walkthrough — La spec y el plan se escriben en skills de fase, y la entrevista no tiene puerta para no preguntar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-19
---

# Walkthrough — La spec y el plan se escriben en skills de fase, y la entrevista no tiene puerta para no preguntar

## 1. Cambios realizados

- **Escenarios y RED** (`52ecebd`): `ss1` y `rq1` en la batería de `sdd-propose`, filas de invocación de las skills de fase, `IQ3` e `IQ5` cambiadas. RED: `ss1` 0/3, `rq1` 2/3.
- **`sdd-spec-review`** (`1d43f85`): la rúbrica de `review-spec.md` en su skill propia, con el brief del revisor en `references/`; la pregunta de los revisores en prosa numerada, nunca con `AskUserQuestion`. El aviso de fase pasa a `includes/phase-notice.md`. ADR 0039 sustituye a la 0024.
- **`sdd-plan-writing`** (`a36877e`): copia anotada de `writing-plans` v7.0.2 con la línea `Ejecución`, el eje Arquitectura, el gate de cierre, dónde para y el traspaso a `sdd-implement`. ADR 0040 y 0041 sustituyen a la 0028 y la 0029.
- **`sdd-spec-writing` y `sdd-spec-approval`** (`da26f4c`): la fase de la spec, partida en dos (enmienda 29): la copia anotada de `brainstorming` entrevista hasta `spec.md` con los tres montones a la vista y «Abierto» siempre al montón del dev-lead; `sdd-spec-approval` (propia) repasa, invoca la review, aprueba y traspasa. `sdd-propose` clasifica y traspasa por nombre; salen `spec-writing.md`, `coherence-pass.md`, `plan-writing.md` y `review-spec.md`. ADR 0042 sustituye a la 0035.
- **Pasada de la revisión final** (el commit de cierre): retomar a mitad de la cadena (`sdd-propose` traspasa a `sdd-spec-approval` o `sdd-plan-writing`; `sdd-implement` devuelve una spec aprobada sin plan), el bloque del anuncio en `includes/announcement.md`, descripciones con su llamante, «¿va bien?», la ADR 0038 con el alcance del Art. II.
- **Última ronda** (el commit de cierre): un ⛔ en los traspasos de `sdd-spec-writing` y `sdd-spec-approval`; «lo que lleva la spec» pasa a la ayuda de `spec-template.md` y vuelven dos literales de la entrevista.
- **Constitución, ADR y tramo** (`6a42ab2`): ADR 0038, una línea del Art. II, el punto 6 de `architecture.md`, 28 skills en `README.md`, `PRODUCT.md` y `CLAUDE.md`; el bloque del anuncio pasa al primer mensaje de `sdd-spec-writing`.
- ADR: Una fase obligatoria va en una skill que se carga entera → decisions/0038-mandatory-phase-in-a-skill.md

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 6h
- Esfuerzo real: 3,34 h — reloj de la sesión 7,53 h desde 2026-11-19T11:13Z, sin 251 min de espera al dev-lead (22 esperas)
- Desviación: −2,66 h (−44 %)
- Causa de la desviación: la estimación sumaba el tiempo de las tandas de sujetos; corren en segundo plano mientras la sesión espera o trabaja, y las esperas al dev-lead (251 min, 22 esperas) no cuentan
- Compactación: no (la sesión se retomó tras una compactación antes de la Task 1, con el ledger aún sin abrir)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 180.940.169 — claude-opus-5-5 180.940.169
- Tokens de subagentes: 28.135.313 en 11 despachos — revisores de la spec y de las tres enmiendas (sonnet y opus), lector de prosa del tramo (sonnet), ejes Spec, Código y Arquitectura de la revisión final y re-revisión (opus y sonnet)
- Coste de la sesión: 67,31 $ (hilo 52,67 $ + subagentes 14,63 $)
- Coste de sujetos: 64,58 $ en 118 sujetos sonnet — red 1,11 $; green-t2 2,49 $; green-t3 2,62 $; green-t4 2,26 $; refactor 1,91 + 1,30 $; tramo 32,21 $; interviewer 4,90 $; arreglos del tramo y de la revisión final ~12,5 $; última ronda 3,26 $
- Review de spec: 2 revisores, una segunda ronda y un revisor por cada una de las tres enmiendas que cambiaban el delta · hallazgos de la primera: 4 Críticos y 21 importantes aceptados, 6 rechazados

## 3. Desviaciones del plan

- **La fase de la spec se partió en dos skills** (enmienda 29, aprobada): con todo dentro, `sdd-spec-writing` medía ~23.300 bytes y conservaba el 48 % de `brainstorming`.
- **Las ADR con rutas movidas se sustituyeron** con ADR nuevas (enmienda de la Task 2, aprobada) en vez de quedar intactas: `decision-routes.test.ts` exige que cada ruta de una ADR vigente exista.
- **Dos AND de la spec cambiaron tras el GREEN** (enmienda 30, aprobada): la primera pregunta de `ss1` es la que más cambia del montón del dev-lead, y la petición de `iq2` dice el orden de las líneas.
- **Tres tandas de REFACTOR y dos de arreglo** en vez de una, aprobadas por el dev-lead; la campaña subió de 93 a 118 sujetos.

### Decisiones tomadas sin el dev-lead

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
- Final: Ruling: dos de los literales de «no se reponen» («what will you do with it?» y «What the user says goes to Intent») sí volvieron en la última ronda, con los bytes que liberó llevar «lo que lleva la spec» a la plantilla.

## 4. Verificación

### 4.1 Builds

- `moon run kit:build kit:own kit:copies kit:skill-size` → verde sobre el commit de cierre: `sdd-spec-writing` 19.187 bytes y 51 % de `brainstorming`; `kit:own` 134 ficheros; `kit:copies` 33 copias.
- `pnpm --dir cli exec vitest run test/kit --test-timeout 120000` → Tests 1044 passed | 15 skipped (1059), sobre el commit de cierre.
- Gate: corre una vez sobre el merge de sincronización (la base va 13 commits por delante); su línea va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-19 · baterías de `sdd-propose` (118 sujetos), del entrevistador (16) y de `sdd-implement` y `sdd-verify` (4); revisión final Spec, Código y Arquitectura sobre `6a42ab2`, re-revisión `6a42ab2..pasada de fix (juntada en el cierre)` con arreglos, 1 sin revisar (la última ronda, juntada en el cierre); el uso real lo da el recuento de invocaciones sobre los transcripts de las sesiones de feature tras la release.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La spec en `sdd-spec-writing`, su repaso y aprobación en `sdd-spec-approval`, la review en `sdd-spec-review`, el plan en `sdd-plan-writing` | ejecución real | `iq4` 3/3 (última ronda), `rv1` 2/2, `p2` y `k2p` 1/1 |
| Los tres montones antes de `spec.md`, con porqué y «Abierto» al montón del dev-lead | ejecución real | `ss1` 3/3 + 3/3 + 1/1 |
| Pregunta lo que falta y es del dev-lead; con «Abierto» cita la propuesta del prompt | ejecución real | `iq3` 2/2; `iq1` e `iq5` en el tramo |
| Con el prompt completo, una parada con montones y diseño corto | ejecución real | sin observar: los sujetos de `iq2` hallan un hueco real (sala inexistente); paran antes de `spec.md` 3/3 |
| Delegada: sin montones, el umbral «pendiente», la cadena hasta el plan | ejecución real | `iq4` 3/3 |
| La pregunta de los revisores en prosa numerada | ejecución real | `rq1` 3/3 |
| Full y spike anuncian y siguen | ejecución real | `a1` 2/2 tras mover el bloque (0/3 antes) |
| Retomar a mitad de la cadena | ejecución real | `rs1` 1/1 (spec sin aprobar → `sdd-spec-approval`); la rama «aprobada sin plan» sin escenario |
| El gate de cierre del plan, el eje Arquitectura, el repaso, las secciones, empezar ya | ejecución real | tramo a N = 1: `p2`, `ax`, `pl2`, `pl3`, `co1`–`co8`, `cr1`–`cr3`, `sp1`, `s1` en verde en la puerta; `pb-p` PB-P falla (fila vieja frente a la decisión 8) |
| El revisor de una enmienda usa la rúbrica de `sdd-spec-review` | ejecución real | `u1` 1/1, `c6` 1/1; `c10` C10r falla (un caso) |
| El núcleo del entrevistador no empeora | ejecución real | puerta 16/16; E3 en `p3-1` y E7 en `pe-2`, dudas de un caso sin línea base de prosa |

### 4.3 Residuales / deuda generada

- Sin revisar (juntado en el cierre) — el ⛔ de los traspasos, «lo que lleva la spec» a la plantilla, dos literales repuestos (medido: `iq4` 3/3, `ss1` 1/1).
- `sdd-spec-writing` queda a ~800 bytes del corte de 20.000 y en el 51 % de `brainstorming` (mínimo 50): un arreglo de un ticket o subir `brainstorming` de versión rompe uno de los dos.
- La migración de las ~15 referencias que aún llevan un paso obligatorio (ADR 0038, «Consecuencias»): fila que abre la coordinación desde el ticket.

- El camino «montón del dev-lead vacío → diseño corto para confirmar» queda sin observar: los tres `iq2` de la última tanda encuentran un hueco real de la petición (una sala que no existe).
- `iq4` (SA2) 1/3: con «Escribe la spec y preséntamela», el sujeto presenta y para tras aprobar por delegación; la fila choca con su petición.
- Dudas de un caso del tramo: `sp1` (sin tabla de topes: no lee `test/words.test.js`), `t1` (puntero a la 0009), `rc1` (un aviso de fase en inglés), `p3-1` E3 y `pe-2` E7 del entrevistador.

## 5. Aprendizajes

- Una regla de forma (el bloque del anuncio) que vive en una skill y se aplica en el primer mensaje de otra se pierde; dos frases de guía no la recuperan y el bloque con su forma en el sitio donde se escribe sí (a1: 0/3 → 2/2) → `skills/sdd-spec-writing/SKILL.md` y el Art. II (elemento omitido), ya aplicado.
- El tope de 20.000 bytes manda sobre cuántas reglas caben en una copia anotada: con el 50 % del original, quedan ~11 KB para el kit → ADR 0038, «Consecuencias».

Retro: error que cazaría un chequeo → ticket del kit: tres reglas movidas de `sdd-propose` a las fases se perdieron (el bloque del anuncio, «prevé <n> tasks», la plantilla de `sdd-templates`) y solo las cazó un lector de las filas de prosa; un test que buscara en `dist/` los literales de la tabla «regla que se mueve» de la spec las habría visto al construir
Retro: documento o skill desmentido → ticket del kit: el repaso de coherencia admite topes y bytes «sin medir» para una skill nueva, y los cuatro se quedaron cortos (1.250 → 1.460, 1.800 → 2.220, 3.100 → 3.450 palabras; ~18.500 → ~23.300 bytes, que obligó a partir la fase); medirlos sobre un borrador antes del gate habría cambiado la spec antes de aprobarla
Retro: búsqueda a ciegas → ticket del kit: cómo termina un bloque del kit y qué cita una marca `sustituye` solo se lee en `tests/copies/annotated.ts`; el fork de `brainstorming` necesitó leer el comprobador para ajustar diez citas

## 6. Adendas
