---
id: 20261113-131112-feature-0341-interviewer-spike
feature: 0341
title: Walkthrough — Spike: qué postura de entrevista va en el núcleo del entrevistador del kit
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-13
---

# Walkthrough — Spike: la postura del núcleo del entrevistador

## 1. Cambios realizados

- **Batería de fondo del entrevistador** (`tests/batteries/interviewer/`, `2290c9b`): `battery.md` con once escenarios de explore, init y propose y las filas E0–E7 de las expectativas del dev-lead; `subject.mjs` con los moldes, los turnos extra y la persona de `pe` (`persona-pe.md`, Haiku, nunca aprueba); `transcript.mjs`, que deja un `transcript.txt` por sujeto con turnos y llamadas intercalados; `make-kits.mjs`, que monta una copia del kit por núcleo y la comprueba con `--check`.
- **Pasada en seco y copias del kit** (`40e2202`): cinco copias en `.temp/i/kit-<núcleo>`; seis sujetos del control (`seco/`, `seco2/`, `seco/resumen.md`); el transcript parte los turnos por `system:init` y `pe` va sin `Agent` (0,61 $ por sujeto).
- **Seis brazos** (`c82e377`): `control-a`, `matt`, `brainstorming`, `openspec`, `look-decide-ask`, `control-b`, 28 sujetos cada uno, con su transcript en `<brazo>/out/`; ocho relanzados una vez por no cargar el núcleo, con el primer intento en `<brazo>/no-cargo/`.
- **Lectura** (`068a410`): 13 lectores Sonnet por escenario con etiquetas barajadas (`readings/key.md`), la relectura del hilo (`readings/relectura.md`), los recuentos (`readings/totales.md`), la matriz de cobertura (`readings/coverage.md`) y los scripts que los recalculan (`readings/scripts/`).
- **Research y elección** (`6f1b87c`): `research.md` con la tabla por fila, brazo y sitio, la regla de la decisión 13 aplicada a cada candidato, el indicio O3, la recomendación y la elección del dev-lead.
- **Roadmap** (`7b2d039`): la fila 0338 se funde en la 0342.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 8h
- Esfuerzo real: 3,43 h — reloj de 2 sesiones 8,42 h desde 2026-11-13T10:12Z, sin 299 min de espera al dev-lead (13 esperas)
- Desviación: −4,6 h (−57 %)
- Causa de la desviación: la campaña de los seis brazos corrió en segundo plano en 1 h 40 min (la estimación preveía ~7 h de reloj) y su espera cuenta en «Esperas y huecos»: 16:28Z 102 min.
- Compactación: sí, en la Task 3 → Native (la regla pedía SDD con 3 tasks por delante; la línea del ledger se escribió al cerrar, ver §3)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 79.966.619 — claude-opus-5-5 79.966.619
- Tokens de subagentes: 15.952.014 en 17 despachos — 13 lectores claude-sonnet-5-5; revisores de la spec claude-fable-5-2 363.591 y claude-sonnet-5-5 975.731; revisión final (eje Spec) y re-revisión claude-opus-5-5 7.019.173
- Coste de la sesión: sin precio (modelos sin precio: claude-fable-5-2); hilo 32,47 $ + subagentes Sonnet 5,39 $ + Opus 4,10 $
- Coste de sujetos: 44,43 $ en 180 sujetos Sonnet (persona Haiku en `pe`) — seco 2,63 $; seis brazos 40,70 $; relanzados 1,10 $
- Review de spec: 2 rondas (Fable a petición del dev-lead; segunda en Sonnet) · hallazgos 18, aceptados 17

## 3. Desviaciones del plan

- La K de máquina (`tools: /sdd-grilling/`) no prueba la carga: casa con la salida de `spec-writing.md`. El hilo comprobó la carga por las llamadas (`>>>`) de cada sujeto, y `research.md` da dos criterios: leer el `SKILL.md` entero (las tablas) y solo `Skill` (el literal de la decisión 10, que saca `p2` y `pe`).
- La revisión final (eje Spec, opus+high, sobre `6f1b87c`) pidió tres arreglos en `research.md`: decir el criterio de carga, aplicar la decisión 13 igual a los cuatro candidatos y reescribir la recomendación como insumos de un núcleo de cero. La pasada de fix metió un error, dos «no cargó» por un `head -80` que cortaba otro fichero; la re-revisión lo encontró y el hilo lo arregló después. La recomendación se le volvió a enseñar al dev-lead, que la confirmó («Sí, con esa versión»); esa corrección solo refuerza una pieza que ya aceptó (la regla de E0 de `brainstorming`, otra vez por encima del umbral con el criterio de las tablas).
- Tres filas (E1 de `fp`, E7 de `pe`, E4 de `g9`) las puntuaba cada lector con su vara; el hilo fijó una sola regla y las releyó enteras (`readings/relectura.md`).

### Decisiones tomadas sin el dev-lead

- Pre-flight: el escaneo no encuentra conflictos — si me equivoco, lo caza la revisión final.
- `transcript.mjs` parte los turnos por `system:init` y quita los eventos de subagentes — en `pe` daba 6 turnos para 3 reales — un turno mal partido cambia el mensaje puntuado.
- `pe` sin la herramienta `Agent` — en seco costaba 1,22 $, casi todo en revisores tras el punto que mide E7 — un núcleo que lanza subagentes en `pe` no se mide en eso.
- `COST_CAP=65` en los brazos — la parada de 65 $ la aplica el arnés — un brazo podía cortarse a medias.
- Seguir sin parar con 43,07 $ — bajo la parada de 65 $ — ninguno.
- `g9` E4w falla en los seis brazos; va tal cual a `research.md` — ninguno.
- `look-decide-ask` p3-2 (entró por `sdd-roadmap` antes de `sdd-propose`) se puntúa — cargó el núcleo — un sujeto de `p3` más.
- Los 8 «no cargó» se relanzan con `run --resume`, con el primer intento apartado en `no-cargo/` — ninguno.
- El lector escribe su fichero y devuelve una línea — los cuadros no cabían en el contexto del hilo — un fichero mal escrito lo relee el hilo.
- K y E4w salen de `verdict`; las rutas del kit se cambian por `<kit>` en las copias del lector — la ruta delataba el brazo — ninguno.
- El hilo puntúa los 3 «no cargó» de `g3` que leyeron el núcleo con `Read` o `cat` — 2 «falla» de E0 de más si el hilo es más estricto.
- La K de máquina no prueba la carga sola; va a `research.md` y a la 0342 — ninguno para el spike.
- `g9` E4: una pregunta del para qué es «no aplica» — si se leyera literal, la fila no discrimina.
- E1 de `fp` con una sola regla en los 30 sujetos — 6 cambios de «pasa» a «falla».
- `look-decide-ask` pe-5 carga el núcleo tarde: «no cargó», sin relanzar — un sujeto de `pe` menos en ese brazo.
- Los scripts de la lectura van en `readings/scripts/` — ninguno.
- Los sujetos corrieron de 5 en 5 (`MAX_PARALLEL` de `run.mjs`), no de 3 en 3: el 3 de la spec es el tope de subagentes, y los sujetos son procesos de la batería con su propio tope — si el dev-lead quería 3 también ahí, la campaña tardó menos con el mismo gasto.
- `make-kits.mjs --check` da «difieren» en un checkout nuevo por CRLF frente a LF; en la campaña dio iguales — la 0342 lo verá al reutilizar la batería.
- El comentario de `subject.mjs` con el coste de la pasada en seco se queda: es el porqué de quitar `Agent` — ninguno.
- No verificados de la revisión, resueltos en el hilo: `tally.mjs` regenera `totales.md` sin cambios; el coste de los lectores sale de `sdd session tokens`; la persona corre con Haiku (`tests/headless/lib.mjs:546`) y `g9` lleva `WebSearch` y `WebFetch` (`subject.mjs`, `EXTRA_ALLOWED`) — ninguno.
- Tras la compactación en la Task 3, seguí en Native con 3 tasks por delante, cuando `sdd-implement` pide pasar a SDD; la línea del ledger la escribí al cerrar — las tasks 3 a 5 eran campaña, despachos de lectores y redacción — las tasks 4 y 5 corrieron sin el contexto fresco de SDD.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 742/742 · cli:typecheck: corrió · cli:test: corrió 2469/2481 (12 skipped) · 123 s · configuración: la del gate · sobre el commit de cierre
- Revisión final: Spec opus+high, con arreglos (3 Important, 6 Minor), sobre `6f1b87c` · Código y Arquitectura no salen (spike) · pasada de fix y re-revisión de `6f1b87c` a la pasada, opus+high, 5 de 6 arreglados y un Important que trajo la pasada, arreglado en el hilo
- ✋ sin revisar: el arreglo tras la re-revisión, juntado en el cierre — repone los veredictos de `p1` c5-2 y c6-2 y las cifras de `research.md` que dependían de ellos

### 4.2 Smoke / tests

- Validación en campo: 2026-11-13 · gate 742/742 y 2469/2481 (12 skipped) · tres objetivos medidos con ejecución real (168 sujetos, 13 lectores, relectura del hilo) · `check-readings.mjs` sin errores y `tally.mjs` regenera `totales.md` · revisión final Spec con re-revisión, 1 sin revisar

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — tabla por fila, brazo y sitio con A/A y cobertura | ejecución real: 168 sujetos, `readings/totales.md` | cumple |
| O2 — recomendación con la regla de la decisión 13 | ejecución real: `research.md` §2.4 y §4 | ninguno supera el umbral; mejor por filas, elegido por el dev-lead |
| O3 — indicio de `look-decide-ask` en `p2`, `p3`, `pe` | ejecución real: `research.md` §2.5 | sin señal (dentro del A/A) |

Elección del dev-lead, 2026-11-13: «me cuadra, vamos con tu recomendación, pero tendriamoss qwue mirar si podemos envontrar algo quew mejore no?»; tras la revisión final, a «¿Mantienes tu elección con esa versión?»: «Sí, con esa versión».
<!-- cspell:ignore cuadra vamos recomendación tendriamoss qwue mirar podemos envontrar algo quew mejore -->

### 4.3 Residuales / deuda generada

- La 0342 reescribe el núcleo con lo elegido y busca la mejora con `g9`, `fp` y E0 como RED (`research.md` §4, §8).
- La K de máquina de la batería y el corte de las líneas `> Bash:` de `transcript.mjs` (`research.md` §5) los cambia la 0342, que reutiliza la batería.

## 5. Aprendizajes

- El texto de la postura apenas mueve el fondo de la entrevista: los fallos que molestan al dev-lead (no buscar en la web, volver a rebatir) los comparten todos los núcleos y viven en el orden de los pasos y en la colisión con reglas del llamante → `research.md` §4, que lee la 0342.
- Un lector por escenario con etiquetas barajadas no basta cuando un escenario se parte en dos lectores: cada uno puntúa con su vara, y la relectura del hilo tiene que fijar una regla por fila y releerla entera → `readings/relectura.md`; a la batería de la 0342 y a `operations.md`, «Baterías por skill».

Retro: documento o skill desmentido → la fila K de máquina de `tests/batteries/interviewer/battery.md` (`tools: /sdd-grilling/`) casa con texto que el sujeto lee y no prueba la carga; la cambia la 0342 antes de usar la batería, con lo que dice `research.md` §5 (`research.md`)
Retro: error que cazaría un chequeo → la carga de cada sujeto se comprueba con la llamada que lee `SKILL.md` partida por `;` y `|`, no con un `grep` de la línea entera, que atribuyó dos `head -80` a otro fichero; va en el arreglo de la fila K de la 0342 (`research.md`)

## 6. Adendas
