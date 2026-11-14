---
id: 20261113-193506-feature-0342-interviewer-rewrite
feature: 0342
title: Walkthrough — Reescribir el entrevistador del kit
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-14
---

# Walkthrough — Reescribir el entrevistador del kit

## 1. Cambios realizados

- **La batería mide la carga entera** (`a1c6fb1`): la fila K de `tests/batteries/interviewer/battery.md` casa solo con una carga entera del núcleo (`Skill`, `Read` sin rango, `cat`/`Get-Content` sin tubería, redirección ni lectura parcial), probada en 18 llamadas en `cli/test/kit/headless/battery.test.ts` con `verdict` sobre la celda real; `tests/headless/extract.mjs` y `tests/batteries/interviewer/transcript.mjs` escriben el rango de un `Read`, y `transcript.mjs` solo corta el volcado JSON (`cli/test/kit/interviewer-transcript.test.ts`). `g9` y `g8` a n = 5.
- **RED** (`50317a6`): 20 sujetos con el núcleo de antes; rojo en E4w, E1, E6 y E5; E0 20/20.
- **Núcleo reescrito de cero y territorios** (`06c48b4`), **GREEN y dos rondas de REFACTOR** (`bdbcefd`): el núcleo nuevo no sale en verde y pierde reglas medidas al reescribir.
- **Núcleo de antes aligerado** (`6f6b295`, primera enmienda del 2026-11-14): `skills/sdd-grilling/SKILL.md` parte de `50317a64`, sin territorio, con tres piezas medidas (lo que elige el agente va como suyo, seguir con lo que el usuario mantiene, confirmar un hecho sin ejemplos) y «también si lo pide todo de golpe»; 884 palabras, tope 886. La búsqueda web y la fila E4w salen de la entrevista; `proposal.md`, `sdd-config` y la plantilla de spec vuelven a su texto.
- **La frase del porqué, literal en `spec-writing.md`** (`803ef82`, segunda enmienda): parafraseada perdía su contraejemplo.
- **Territorio en los llamantes**: `sdd-explore` paso 2 (el porqué y la dirección, confirma con una pregunta), `sdd-init` paso 3 («Problem it solves» primero, para con cada tema contestado, pendiente o «no aplica»), `spec-writing.md` (el porqué literal, objetivos y antiobjetivos, lo no contestado al ✋ como «pendiente»).
- **Procedencia y cierre** (`0e7a108` y el commit de cierre): `upstream.json`, `THIRD_PARTY_NOTICES.md`, `README.md`, tabla de procedencia de `tests/batteries/sdd-grilling/battery.md`, `word-budget.test.ts`; la fila de `debt.md` del transcript cortado a 160, saldada. Saldo de palabras de las skills tocadas: −1.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 5h
- Esfuerzo real: 4,54 h — reloj de la sesión 22,51 h desde 2026-11-13T19:21Z, sin 1078 min de espera al dev-lead (7 esperas)
- Desviación: −0,46 h (−9 %)
- Causa de la desviación: dentro del 30 %; esperas y huecos: 19:25Z 6 min; 19:40Z 56 min; 20:47Z 9 min; 23:12Z 987 min; 15:40Z 5 min; 16:43Z 2 min; 17:33Z 14 min
- Compactación: no durante la ejecución (la sesión se compactó durante la spec, antes del plan)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 185.280.619 — claude-opus-5-5 185.280.619
- Tokens de subagentes: 24.644.117 en 35 despachos — lectores (Sonnet, 28 despachos), revisores de la spec (Sonnet, 4), ejes de la revisión final (Spec Opus 3.875.728 / 6 min; Código Sonnet 958.253 / 1 min) y re-revisión (Opus 480.658 / 2 min)
- Coste de la sesión: 71,88 $ (hilo 56,89 $ + subagentes 14,99 $)
- Coste de sujetos: 63,50 $ en 259 sujetos sonnet (la persona de `pe`, haiku) — RED 4,35 $; GREEN 1 13,47 $; REFACTOR 1 8,77 $; control de forma 1,02 $; GREEN de la ronda 2 13,77 $; GREEN del núcleo aligerado 15,30 $; lo afectado por la segunda enmienda y relanzamientos 6,73 $; control de `n4` 0,09 $
- Review de spec: 2 revisores y segunda ronda, más un revisor por enmienda · hallazgos 40, aceptados 34

## 3. Desviaciones del plan

- **Dos enmiendas de la spec, aprobadas por el dev-lead el 2026-11-14.** El núcleo reescrito de cero no salió en verde tras las dos rondas de la decisión 8, y frente al núcleo de antes empataba o perdía un sujeto en varias filas. Las regresiones tenían causa en el texto: frases medidas que se perdieron al reescribir (el rechazo sin opciones, el boceto sobre la app real, el orden del paso 2 de `sdd-config`) y una pieza nueva que hacía daño (la pregunta que pide un caso y su ejemplo del CSV, que los sujetos copiaban). La primera enmienda vuelve al núcleo de antes, aligerado; la segunda copia literal la frase del porqué, que parafraseada perdió su contraejemplo.
- La búsqueda web antes de la primera pregunta sale de la feature: E4w dio 0–1 de 5 con cada núcleo probado, como en el spike.
- `COST_CAP` pasó de 44 a 58 y a 66 con las enmiendas.
- Una tercera enmienda (dev-lead, «1», 2026-11-14) cuenta como igual una fila a un sujeto de diferencia con n ≤ 5 cuando el núcleo de antes muestra el mismo fallo: la revisión final señaló que E5 de `fp` y R4 y R10 de `g7` eran peores a la letra de la decisión 5, y yo los había dado por iguales.
- sin revisar: la tercera enmienda en la spec, los totales y el control de `n4` (solo `.docs/`, 96 líneas, después de la re-revisión; juntado en el cierre).

### Decisiones tomadas sin el dev-lead

- Los tests de `extract.mjs` van en `interviewer-transcript.test.ts` — ningún test llamaba a `extract.mjs tools` — un fichero de test más mezclado.
- La prosa de la rúbrica del entrevistador dice «lectura entera» como la K — el lector puntuaba «cargó» con cualquier mención — ninguno.
- `transcript.mjs` no corta ningún argumento conocido, solo el volcado JSON — la decisión 12 al pie de la letra — un transcript algo más largo.
- `SUBJECT_CAP` a mano en cada tanda — `run.mjs` no lee la fila «Suma» de la previsión — ninguno: `COST_CAP` manda.
- Relanzar una vez cada «no cargó» (`fp-1`, `fp-2`, `fp-5`, `g8-3`, `fp-4`, `g2-2`, `g8-2`, `g8-4`, `g7-2`, `fp-3`), con el primer intento en `no-cargo/` — decisión 6 — un sujeto de más cada uno.
- Relecturas del hilo (`g8`, `g4-1`, `pe-4`, `pe-5`, el turno 2 de `fp`) con la regla de cada fila — el lector puntuaba más estricto o al revés — una «falla» de más o de menos por línea, todas en `readings/`.
- La pieza de E0 se escribió aunque el RED dio E0 20/20 — sustituye una frase del núcleo — sin RED propio; el GREEN la mide como no regresión.
- Control con el núcleo de antes en `g7` y `sk` — saber si C1 y B1 eran regresión — ~1 $.
- La ronda 2 dentro del GREEN final — una ronda aparte más el GREEN pasaban el techo — un rojo se veía igual.
- El kit de cada REFACTOR salió de `dist/` sin commitear — los cambios entraron en el commit de la Task 4 — la evidencia del REFACTOR 1 no apunta a un sha.
- `g7-2` entra por `sdd-upgrade` en los dos intentos: rojo de puerta, no del núcleo, a deuda — la puerta no es del entrevistador — una puerta mal leída.
- La K da «no cargó» a `cat … 2>&1`, a los alias `gc` y `type` y acepta `my-sdd-grilling/SKILL.md` en un `Read` (revisión final, Código) — la decisión 10 fija la celda literal y ningún sujeto lo hizo — un relanzamiento de más.
- Lo que el usuario mantiene va a «Decisiones tomadas con el dev-lead» y «también si lo pide todo de golpe» quedan sin fila de batería — el texto los lleva — un comportamiento sin medir.
- La revisión final, con el plan al día antes de despacharla — el eje Spec habría revisado contra el tope 817 — ninguno.

## 4. Verificación

### 4.1 Builds

- `moon run kit:build kit:skill-size kit:own` → verde: ningún `SKILL.md` de 20.000 bytes o más, «Skills al día: 127 ficheros».
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 763/763 · cli:typecheck: corrió, sin errores · cli:test: corrió 2500/2500 (12 omitidos) · 122 s · configuración: la del gate · sobre el commit de cierre
- Tanda: 259 sujetos en las tandas de `red/`, `green/`, `refactor-1/`, `control-forma/`, `green-2/`, `green-3/`, `green-4/` y `control-n4/`, cada una con su `totales.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-14 · gate 763/763 · typecheck · 2500/2500 sobre el commit de cierre · batería del entrevistador y de forma (259 sujetos), cada fila de fondo igual o mejor que el núcleo de antes con la tolerancia de la tercera enmienda (`green-4/totales.md`) · revisión final Spec y Código, re-revisión de la pasada de fix limpia (las dos, juntadas en el cierre), 1 sin revisar (la tercera enmienda)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La fila K casa con la carga entera y no con otra mención | suite: `fila K de la batería del entrevistador`, 21 casos | pasa |
| `transcript.mjs` no corta las lecturas y enseña el rango de `Read`; `extract.mjs` lo escribe igual | suite: `interviewer-transcript.test.ts`, 7 casos | pasa |
| Una decisión por turno, la que más cambia el resto | ejecución real: E5 en todos los escenarios (`green-3`, `green-4`) | pasa salvo E5 de `pe` 3/5 y `fp` 4/5, igual que el núcleo de antes |
| También si lo pide todo de golpe | no probado: ninguna batería pide rondas | — |
| Nada supuesto en silencio; el para qué pendiente; el separador, preguntado o pendiente | ejecución real: E0 en `g9 g8 fp pe` y los de n = 2 | pasa (E0 de `pe` 5/5 en `green-4`) |
| Lo que solo sabe el usuario, abierto; un hecho con su fuente y una pregunta que acaba en él, sin ejemplos | ejecución real: E6 en `g2 p1 g8` | pasa salvo E6 de `g8` 4/5, igual que el RED |
| Rebatir una vez y seguir con lo pedido | ejecución real: E1 en `fp` | 3/5, mejor que el 2/5 del RED |
| Lo mantenido va a «Decisiones tomadas con el dev-lead» | no probado: ninguna fila mira dónde se apunta | — |
| Para donde dice el llamante, o con cada decisión del usuario contestada o pendiente; devuelve las tres listas | ejecución real: E7 en `pe`, R10 en `g7`, `m2` | E7 4/4 y 1 sin veredicto; R10 0/1 (control 1/2, mismo fallo); `m2` 3/3 |
| Con gate del llamante, sin confirmación propia; desde `sdd-explore`, una pregunta | ejecución real: `u1`, `g1 g9 rq`, `m2` | pasa |
| No pregunta lo que la petición ya dice | ejecución real: E3 en `p2 p3 fp pe` | pasa |
| `sdd-init` para con cada tema contestado, pendiente o «no aplica» | ejecución real: `g2 g8 n4` | pasa salvo S2 de `n4`, igual que el control |

### 4.3 Residuales / deuda generada

- E5 de `pe` (3/5, como el núcleo de antes) y E1 de `fp` (3/5, mejor que el 2/5 de antes): por debajo del verde, a deuda con sus citas.
- La carga del núcleo en los llamantes: cada tanda tiene 1–4 «no cargó» que cargan al relanzar (`sdd-propose` en `fp` y `g3`, `sdd-init` en `g8`); el turno 1 de `fp`, el rebate, va siempre sin núcleo porque `sdd-propose` lo hace al clasificar.
- La puerta de `g7` en un molde 3.0.0 entra por `sdd-upgrade` en un sujeto de cada dos.
- B1 de `sk` (1/2, igual que el control) y S2 de `n4` (pregunta doble, sin base).
- La búsqueda autónoma en internet, fuera de la entrevista: fila de roadmap para `sdd-explore` en modo probar o un spike (dev-lead).
- El precio de plan de las baterías se queda corto: los sujetos del GREEN aligerado costaron ~15 % más que su previsión y la tanda tocó el techo.

## 5. Aprendizajes

- Reescribir de cero una skill medida pierde reglas probadas aunque se reescriban «con el mismo sentido»: las cuatro regresiones con causa fueron frases medidas que salieron o se parafrasearon. Al bajar una frase a otro sitio, va literal → ya lo dice la constitution, Art. IX («parte de su fuente sin tocar lo que funciona»); esta feature es su caso, y la ADR 0035 lo fija para el territorio.
- Un ejemplo de la skill en el dominio de un escenario se copia: el «¿qué harás con el CSV el próximo lunes?» tumbó E3 en `pe` → `operations.md`, «Baterías por skill».
- Con n = 5 y un rojo por sujeto, `pe` no separa dos núcleos: el mismo núcleo de antes da E0 y E5 entre 3/5 y 5/5 en tres tandas → `operations.md`, «Baterías por skill».

ADR: el núcleo dice cómo se pregunta y cada llamante su territorio → decisions/0035-interviewer-core-and-caller-territory.md

Retro: error que cazaría un chequeo → test que rechaza dos viñetas fundidas en una línea de una skill (cli/test/kit/skills.test.ts)
Retro: documento o skill desmentido → ticket del kit: el precio de plan de `battery.mjs` se queda corto (~15 %) y la tanda del núcleo aligerado cortó en `COST_CAP`
Retro: documento o skill desmentido → ticket del kit: `sdd-propose` rebate la premisa en el paso 2 antes de cargar `sdd-grilling`, y el turno 1 de `fp` sale siempre sin núcleo

## 6. Adendas
