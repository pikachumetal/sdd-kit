# RED — la review de la spec pesa el delta, respeta el paralelismo y busca cada MODIFIED (feature 0086)

Baseline: kit de `feature/0086-spec-review-weight` en `0c2840b`, sin cambios de la feature (`git archive` de `skills` y `.claude-plugin`), con superpowers 6.4.2. Molde (`agenda`, heredado de la 0021) y lanzador en [`red/`](../.docs/sdd/specs/20260927-125612-feature-0086-spec-review-weight/red/); salida por sujeto en `red/out/`. 4 sujetos Sonnet headless, 1,93 $.

- **m** — paso 4 de `sdd-start-feature` con la spec ya redactada: un `MODIFIED` de «Búsqueda por cliente» (sin tildes) cuyo Scope nombra solo `src/search.js`. El mismo literal (`toLowerCase().includes`) lo implementa `src/phone.js`, la ficha de llamada, que nombra el `README.md`. El requisito no nombra las entradas: se encuentran en el código, no en la spec. Caso del ticket 0060 §1 en otro dominio.
- **p** — paso 4 con la spec de «Cobros en recepción» (capacidad nueva, contrato público, `MODIFIED`, migración, rol nuevo; seis ficheros) aprobada por delegación. Los sujetos heredan el `CLAUDE.md` global del dev-lead, que pide confirmar antes de paralelizar. Caso del ticket 0061 §4.

## Fallos que respaldan la guidance

| Frente | Resultado | Conducta citada |
| --- | --- | --- |
| El Scope no nombra la segunda entrada del `MODIFIED` | 0/2 m | m-1 leyó solo `src/search.js` y presentó «Scope: solo `src/search.js`»; m-2 buscó `Búsqueda por cliente\|search.js`, leyó el mismo fichero y cerró «Spec lista, sin cambios de fondo». Ninguno abrió `src/phone.js` |
| Con la spec delegada y el paralelismo restringido, para a pedir permiso para dos revisores | 2/2 p | p-1: «¿Confirmas despachar los dos revisores (dominio + técnica) en Sonnet?»; p-2: «Son 5 señales → toca "dos revisores"… ¿Confirmas que lance los dos con Sonnet?». Ninguno despachó un revisor con los siete puntos |

## Frente estructural

- `skills/sdd-start-feature/references/review-spec.md:20-21` — el nivel sale solo de las señales («0–3 señales no proponen review», «4 señales o más, o contrato público + datos → recomienda dos revisores»). Nada mira el tamaño del delta: con un Scope de dos líneas y contrato público + datos, la rúbrica pide dos revisores. Es el caso del ticket 0040 §1b (cuatro señales, dos revisores, unos pocos párrafos).

## Método

- Un turno por sujeto, situado en el paso 4 con «Invoca la skill sdd-kit:sdd-start-feature…». Los 4 cargan la skill (`>>> Skill: sdd-kit:sdd-start-feature` en `tools.txt`). 3 de 4 leen `review-spec.md`; m-1 no, y no menciona el nivel de review.
- La copia del kit no llevaba `agents/`, así que p-1 y p-2 dijeron que `sdd-kit:effort-medium` no estaba en la sesión. No cambia lo medido: los dos pararon a preguntar antes de despachar, por el `CLAUDE.md`, no por el tipo de agente. El GREEN lleva `agents/` en la copia.
- El primer ensayo en seco, sin `git init` en el molde, escribió en el repo vacío que contiene `%TEMP%` en esta máquina (ver `tech-stack.md`, task 0059). Se restauró (HEAD a `master`, sin objetos) y `subject.sh` comprueba ahora que el molde es su propio repo.
