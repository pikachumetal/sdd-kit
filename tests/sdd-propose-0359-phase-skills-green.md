# GREEN — feature 0359: la spec y el plan en skills de fase

Batería de `sdd-propose`, molde `reservas`, sujetos `sonnet`. Kit: `dist/` del worktree tras cada task, copiado sin `.docs/` ni `tests/`. Salidas en `.docs/sdd/changes/20261119-113300-feature-0359-spec-plan-phase-skills/<fase>/out/`.

## Task 2 — `sdd-spec-review` (`PHASE=green-t2`, 5 sujetos, 2,49 $)

| Escenario | RED | GREEN | Filas |
| --- | --- | --- | --- |
| `rq1` | 2/3 | **3/3** | RQ1 3/3: ninguno carga `AskUserQuestion`; RQ1-B 3/3: los tres terminan en una pregunta numerada con los dos revisores, el modelo de cada uno y su coste. `rq1-3` recomienda un revisor en Opus en vez de dos, con los dos en la opción 2: la fila no lo pide. `rq1-2` añade «Dime también si apruebas la spec», una segunda pregunta en el mismo turno |
| `rv1` | — | **2/2** | RV-S 2/2 (`>>> Skill: sdd-kit:sdd-spec-review`); RV-A y RV-B 2/2; RV-C 2/2: despachan sin preguntar el nivel |

## Task 3 — `sdd-plan-writing` (`PHASE=green-t3`, N = 1)

| Escenario | GREEN | Filas |
| --- | --- | --- |
| `p2` | **1/1** | PW 1/1 (`>>> Skill: sdd-kit:sdd-plan-writing`, después `sdd-implement`); P2 1/1: §3 dice `node --test && node scripts/lint.mjs` |
| `k2p` | **1/1** | PW 1/1; K2p 1/1: la task lleva «Evidencia» con `research.md` y el script, y la línea `Ejecución` dice Native |

`sdd-plan-writing`: 2.143 palabras, 13.4 KB; `kit:copies` en verde (conserva más del 50 % de `writing-plans`).

## Task 4 — `sdd-spec-writing`, `sdd-spec-approval` y `sdd-propose` reducido (`PHASE=green-t4`)

| Escenario | RED | GREEN | Filas |
| --- | --- | --- | --- |
| `ss1` | 0/3 | puerta 3/3; conducta según la enmienda 30 | SW1 3/3; IQ1 3/3 (sin `spec.md`); SS2 3/3: los tres montones en un mensaje, cada porqué con su fuente (`src/app.js:3`, `findBooking`, la línea del prompt); SS3: «Abierto» en el montón del dev-lead con su propuesta citada 3/3, y la primera pregunta es el orden de `sort()` (`jue` antes de `lun`), del montón del dev-lead, 3/3; con el AND aprobado («la primera pregunta cita un punto de Abierto»), 0/3; SS4 3/3 |
| `iq2` | — | 0/2 con la petición aprobada | SW1 2/2; IQ1 2/2; IQ5: montones sin preguntar lo que la petición dice 2/2, pero los dos preguntan el orden de las líneas, que la petición no fijaba, en vez de acabar en el diseño corto (enmienda 30) |
| `iq3` | — | 1/2 | SW1 2/2; IQ1 2/2; IQ3: separador con `;` como propuesta del prompt 2/2, nombre del test en el montón del dev-lead con su propuesta 2/2; `iq3-1` lista dos puntos más del montón con interrogación («¿solo las activas…?», «¿qué te haría torcer el gesto…?»), una segunda pregunta en el turno |
| `iq4` | — | **1/1** | SW1, SA1, SA2: `sdd-spec-writing` → `sdd-spec-approval` → `sdd-spec-review` → `sdd-plan-writing`; IQ6: sin mensaje de montones, el umbral en ✋ marcado «pendiente» |

`sdd-spec-writing`: 3.215 palabras, 18.903 bytes, 51 % de `brainstorming`; `sdd-spec-approval`: 1.130 palabras, 6.723 bytes; `sdd-propose`: 2.248 / 8.665 palabras.

### Tandas de REFACTOR de la Task 4

| Tanda | Cambio | `ss1` | `iq2` | `iq3` |
| --- | --- | --- | --- | --- |
| 1 (`refactor-t4`) | los puntos del dev-lead se nombran sin preguntarlos; la única interrogación es la pregunta del turno | 3/3 (primera pregunta: el orden de `sort()`) | `iq2-1` escribe `spec.md` sin mensaje de montones; `iq2-2` encuentra otro hueco (sala que no existe) | **2/2** |
| 2 (`refactor2-t4`, aprobada por el dev-lead) | ⛔ sin `spec.md` hasta que el mensaje de los montones ha salido y el turno ha acabado, también con el montón vacío | **3/3** | montones y parada antes de `spec.md` 3/3; los tres preguntan la sala que no existe, un hueco real de la petición | — |

El camino «montón del dev-lead vacío → diseño corto para confirmar» queda **sin observar**: la petición de `iq2` se corrigió una vez (enmienda 30) y el segundo hueco va como hallazgo del ticket, sin editarla otra vez. Lo que la ronda 2 arregla —escribir la spec sin enseñar los montones— sale 3/3. Coste de la Task 4: 2,26 + 1,91 (ronda 1) + 1,30 (ronda 2) $.

## Task 5 — tramo, entrevistador y arreglos

Tramo de `sdd-propose` a N = 1 (`PHASE=tramo`, 43 sujetos, 32,21 $): puerta y filas automáticas verdes en 41 de 43. `co2p` (CO2P-M) se lee verde: la previsión del tope va en la tabla «Topes de palabras» con «=» en vez de «→». `iq4` (SA2) se queda en 1/3 a n = 3: los dos rojos presentan la spec y paran porque la petición dice «preséntamela»; la fila de racionalización que se probó no lo cambió y se quitó (Art. IX). Entrevistador (`PHASE=interviewer`, 16 sujetos, 4,90 $): puerta 16/16.

Filas de prosa, leídas por un agente en Sonnet (~197 filas×sujeto): 7 fallos y 18 dudas. Tres eran reglas perdidas al moverse, restauradas y medidas:

| Fallo | Causa | Arreglo | Medida |
| --- | --- | --- | --- |
| `a1` A1: sin anuncio | el bloque del anuncio quedó en `sdd-propose` y el primer mensaje se escribe en `sdd-spec-writing`; dos frases de guía no lo arreglaron (0/1, 0/2) | el bloque `text` del anuncio pasa al primer mensaje de `sdd-spec-writing` (Art. II, elemento omitido) | **2/2** |
| `g1` G1-N: tercera opción sin «prevé <n> tasks» | se perdió al reescribirla para `kit:own` | restaurado en `sdd-spec-approval` | **1/1** |
| `sp1` SP1: sin tabla de topes | el sujeto lee la plantilla pero no `test/words.test.js`; la 3.0.0 lo leía | «of the `sdd-templates` skill» en «Where it goes» | 0/1: duda de un caso, al ticket |

Dudas de un caso, al ticket: `t1` (puntero a la 0009), `rc1` (un aviso de fase en inglés), `p3-1` E3 y `pe-2` E7 del entrevistador (pregunta lo que la fila dice; no para a tiempo), `iq2` (el camino del montón vacío sin observar).

Campaña entera: 104 sujetos, 54,69 $.

## Pasada de fix de la revisión final (`PHASE=fixpass*`, 9 sujetos, 6,63 $)

| Escenario | Resultado | Filas |
| --- | --- | --- |
| `rs1` (nuevo: retomar con `spec.md` sin aprobar) | **1/1** | RS1 invoca `sdd-spec-approval`; RS2 no vuelve a `sdd-spec-writing` |
| `iq4` (petición «Escribe la spec y el plan») | 1/2 | `iq4-2` escribe spec y plan sin invocar `sdd-spec-approval` ni `sdd-plan-writing` y decide «sin revisores»: el atajo que la feature cierra, en la delegada; al ticket |
| `pb-p` | puerta 1/1; PB-P falla | escribe la spec sin secciones con «¿va bien?» (5 tasks, `pair`): se restaura la frase, sin medir (techo de 113) |
| `pb-c` | **1/1** | — |
| `u1` (`sdd-implement`) | **1/1** | U1r: despacha el revisor de la enmienda en Sonnet con los siete puntos |
| `c6` (`sdd-verify`) | **1/1** | C6r 1/1 |
| `c10` (`sdd-verify`) | puerta 1/1; C10r falla | para con una pregunta sin despachar el revisor de la enmienda (la 3.0.0 sí lo despachaba): duda de un caso, al ticket |
| `s1` (`sdd-verify`) | **1/1** | el revisor compuesto con `reviewer-brief.md` |

Campaña entera: 113 sujetos, 61,32 $.

## Última ronda tras la re-revisión (`PHASE=last`, 5 sujetos, 3,26 $)

| Escenario | Resultado |
| --- | --- |
| `iq4` (n = 3) | **3/3**: `sdd-spec-writing` → `sdd-spec-approval` → `sdd-plan-writing` en los tres, con el ⛔ del traspaso |
| `ss1` | **1/1**: primera pregunta, el orden de `sort()` |
| `pb-p` | puerta 1/1; el perfil sale `pair` («lo pides tú») y no escribe la spec; el segundo turno pregunta un punto del montón del dev-lead antes de los enfoques. PB-P pide los enfoques en el primer turno, que la decisión 8 da solo con el montón vacío: fila vieja, al ticket |

Campaña entera: 118 sujetos, 64,58 $. `sdd-spec-writing`: 3.282 palabras, 19.187 bytes, 51 % de `brainstorming`.
