# sdd-templates 0309 — evidencia del Approach con enfoques y la previsión desde el comando

Batería de `sdd-propose` (`tests/batteries/sdd-propose/battery.md`), sujetos Sonnet. Spec: `.docs/sdd/specs/20261108-144046-feature-0309-templates-rework/spec.md`.

## RED — kit de la base (74988a8b), molde `reservas-skills` con `scripts/plan.mjs`

Tanda: `SCENARIOS="co4"` (sdd-propose) → `suma: 2 sujetos · coste previsto: 1.47 $`; real 2 sujetos, 1,40 $.

`co4 · 2/2 · umbral 2/2 · puerta verde · sin leer: CO4, AP, L`. Leídas por el hilo: **0/2**.

| Sujeto | AP | CO4 | L |
| --- | --- | --- | --- |
| co4-1 | falla: el Approach lleva solo el cómo («Reescribir en su sitio el paso 1…»), sin enfoques ni `Elegido:` | falla: corre `scripts/plan.mjs` (4 llamadas en `tools`), pero ninguna fila cita la línea `suma:`; «4 (c1, c2 × 2) · 2,80» con el precio de `tech-stack.md` | pasa |
| co4-2 | falla: «Una sola edición de texto en el paso 1…», sin enfoques ni `Elegido:` | falla: corre el comando (6 llamadas), las filas multiplican 0,70 $; la medición tras la revisión final, a 0 | pasa |

## GREEN — `dist/` con la Task 1 (plantilla, `spec-writing.md`, paso 4 de `sdd-propose`)

Tanda: `SCENARIOS="co4 pb"` → `suma: 4 sujetos · coste previsto: 3.46 $`; real 4 sujetos, 4,03 $.

`co4 · 2/2 · puerta verde · sin leer: CO4, AP, L` · `pb · 2/2 · puerta verde · sin leer: PB, L`. Leídas por el hilo:

| Sujeto | AP | CO4 | PB | L |
| --- | --- | --- | --- | --- |
| co4-1 | pasa: tres enfoques con su coste y `Elegido:` | pasa: cada fila cita `suma: 4 sujetos · coste previsto: 2.80 $` (11 llamadas a `scripts/plan.mjs`) | — | pasa |
| co4-2 | pasa: tres enfoques y `Elegido:` | falla: cita la línea `suma:` una vez encima de la tabla; las filas, «4 (`c1`×2, `c2`×2)» | — | pasa |
| pb-1 | — | — | falla: el Approach lleva tres enfoques y `Elegido:` con su porqué; el ✋ lleva «Enfoque: … (ver Approach)», sin por qué no los otros, y ninguna sección del diseño | pasa |
| pb-2 | — | — | falla: Approach con A, B, C y `Elegido:`; el ✋ no nombra el enfoque ni las secciones | pasa |

## REFACTOR — enmienda del 2026-11-09: el porqué solo en el Approach; el ✋ nombra el elegido y los descartados; celdas de la previsión con la línea `suma:`

Tanda: `SCENARIOS="co4 pb"` → `suma: 4 sujetos · coste previsto: 3.46 $`; real 4 sujetos, 4,39 $.

`pb · 2/2 · puerta verde · sin leer: PB` · `co4 · 2/2 · puerta verde · sin leer: CO4`. Leídas por el hilo, con las filas PB y CO4 precisadas:

| Sujeto | AP | CO4 | PB |
| --- | --- | --- | --- |
| co4-1 | pasa | falla: las filas dicen «`c1 c2` N=2 → 4 sujetos, 2,80 $», las cifras del comando sin su línea; la línea `suma:` va solo encima de la tabla, y `c3`/`c4`, que la batería del molde no tiene, a mano | — |
| co4-2 | pasa | pasa: cada fila, `` `SCENARIOS="c3" N=2` → `suma: 2 sujetos · coste previsto: 1.40 $` `` | — |
| pb-1 | — | — | pasa: «Enfoque: función pura … frente a calcular dentro de `run` … o crear `src/informes.js` … — ver Approach»; una decisión por vista; sin preguntas |
| pb-2 | — | — | pasa: «Enfoque: … frente a un módulo aparte y a escribir cada vista a mano (ver Approach)»; una decisión por vista |

Tras la tanda, la ayuda de la previsión pide la línea `suma:` «tal cual»; lo mide la medición tras la revisión final (`co4 pb`, N=1), sin tanda propia (dev-lead: «1»).

## Controles — `dist/` tras el REFACTOR

Tanda: `SCENARIOS="cr1 pb-p" N=1` → `suma: 2 sujetos · coste previsto: 1.02 $`; real 2 sujetos, 1,39 $.

`cr1 · 1/1 · verde` · `pb-p · 1/1 · puerta verde · sin leer: PB-P, PB-L`. Leídas por el hilo: PB-P pasa (el primer turno acaba en tres enfoques con su coste y «¿Cuál prefieres?», sin `spec-new.md`; tras «Sigue…», la sección 1 con «¿Va bien?»); PB-L pasa (la sección 1 abre con «Al escribir `salas informes` verás la ocupación por sala» y la tabla con datos).

## Task 2 — una forma por regla (P10, P11, P12, P16, P19, P20)

`cli/test/estimation/statistics.test.ts` («walkthrough con evidencia por THEN»): con el hueco nuevo de `walkthrough-template.md` y el relleno viejo (`/^- Esfuerzo real: <Zh>/m`), `2 failed | 47 passed`; con `/^- Esfuerzo real: <[^\n]*/m`, `49 passed`. `git grep` en `tests/batteries/` de los siete literales que salen: ninguna fila los mide.

Humo de `sdd-archive`: `SCENARIOS="a2 t3" N=1` → `suma: 2 sujetos · coste previsto: 0.74 $`; real 2 sujetos, 0,66 $ (`t3` se lanzó solo, porque el techo de la primera tanda solo dejó correr `a2`).

| Sujeto | Filas | Resultado |
| --- | --- | --- |
| a2-1 | P1, P2, P3, L | pasa: fila 0008 ✅, deuda «**[Patch 0008, 2026-11-09: saldada — …]**», sin `walkthrough.md` ni `sdd-retro`. El molde valida en campo y no tiene `estimation.md`: `patch.md` §4 lleva `Validación en campo:` y §5 no llega a usar el hueco de `Esfuerzo real`, así que P10 y P19 en el patch quedan sin observar |
| t3-1 | T3, L | pasa: `Validación por el agente: 2026-11-09 · la spec declara `Validación: agente`; smoke con ejecución real…`, sin guion ni espera |

## Medición tras la revisión final — `dist/` tras la pasada de fix (`e8069923`)

Tanda: `SCENARIOS="co4 pb" N=1` → `suma: 2 sujetos · coste previsto: 1.73 $`; real 2 sujetos, 1,83 $. Campaña: 16 sujetos, 13,69 $ de los 14 $ previstos.

`co4 · 1/1 · puerta verde · sin leer: CO4, AP, L` (CO4-T, verde: `tools` lleva `node scripts/plan.mjs`) · `pb · 1/1 · puerta verde · sin leer: PB, L`. Leídas por el hilo:

| Sujeto | AP | CO4 | PB | L |
| --- | --- | --- | --- | --- |
| co4-1 | pasa: cuatro líneas en el Approach y `Elegido:` con la frase del dev-lead | pasa: cada fila, `` `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` ``; controles a 0 con su porqué | — | falla: «Ahora: dispatching the single spec reviewer (sonnet), after the coherence pass. Queda: …» |
| pb-1 | — | — | pasa: «Enfoque: funciones puras … frente a leer el estado del módulo o a un fichero nuevo `src/informes.js` (ver Approach)»; 15 decisiones, una por vista; sin preguntas | pasa |

CO4 en la campaña: GREEN 1/2, REFACTOR 1/2, y con «tal cual» en la ayuda, 1/1 (dev-lead: «1», medirlo aquí). El rojo de L es un aviso de fase en inglés, y el cambio no toca el idioma de ningún texto; L pasó en los 13 sujetos anteriores de la campaña.
