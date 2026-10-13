# GREEN — feature 0150: roadmap Now / Next / Later y debt.md con triaje

Kit de la rama en `d8b8dc20` (Task 4 antes de su ronda 1; `git archive` al scratchpad, sin `.docs/` ni `tests/`), Sonnet, superpowers 7.0.0 en `SUPERPOWERS_DIR`. Batería `tests/batteries/sdd-roadmap/` entera: m1 a m6 y m3b, 2 sujetos cada uno. Salidas en `.docs/sdd/specs/20261013-112220-feature-0150-roadmap-triage-release-feedback/green/out/`. 14 sujetos, 2,90 $; ninguno leyó `.docs/` de la copia del kit. Los 14 entran por `sdd-kit:sdd-roadmap` y contestan en castellano (fila L).

## Resultado por escenario

| Escenario | Fila | Resultado | Cita |
| --- | --- | --- | --- |
| m1-1, m1-2 | M1 | limpio (control) | prompt con título, `Base: develop`, rama `feature/0013-…` en su bloque, carril, las 8:00 de la enmienda, «Nada que saldar», `Perfil delegate` y `sdd merge --push`; no escribe |
| m2-1 | M2 | limpio (control) | da el prompt de la primera fila en la forma de la plantilla y «di "arráncalo"» |
| m2-2 | M2 | limpio por la letra de la fila · observación | da un prompt («Arranca la feature 0009 del roadmap: …») y «di "arráncalo"», pero sin la forma de `launch-prompt-template.md`, que no abrió; la regla vigente del paso 7 sigue en el texto traducido |
| m3-1 | M3 | limpio | CSV en «En espera» con «Falta» `reproducirlo`; planta en «Lista» con «Evidencia: el comando y su salida» y «Destino: fila nueva, patch en Now»; la de las 8 h a «Descartadas» con «Motivo» `caducada`; no escribe |
| m3-2 | M3 | limpio | lo mismo, con `src/app.js:12` y «`**Salda:**` este ítem»; no escribe |
| m3b-1, m3b-2 | M3b | limpio (control) | los dos abren el walkthrough («4 s») y no escriben antes de la decisión (en el RED, m3b-2 escribió) |
| m4-1, m4-2 | M4 | limpio (control) | el prompt sale del brief de la 0013; no escribe |
| m5-1 | M5 | limpio | fila 0014 en Next con título, one-liner, brief con las cinco etiquetas, `⏳` y tamaño `S`; ejecuta el check |
| m5-2 | M5 | limpio (desempate) | propone la fila en Next con tamaño `S` y el brief, y espera la decisión por el paso 3 vigente en `delegate`; no escribe |
| m6-1 | M6 | limpio | planta en «Deuda técnica» con `**Actuar**: patch` y el comando; CSV con `**Esperar 2.º ticket**`; fila «Patch:» 0008 en «Próximo»; no crea `ROADMAP.md` ni `debt.md` |
| m6-2 | M6 | falla (desempate) | CSV en «Deuda técnica» con `**Esperar 2.º ticket**`, pero la planta va directa a «Próximo» como patch 0008, sin su fila de «Deuda técnica»: el THEN pide que cada ítem sea una fila de deuda con su «Destino» |

## Lectura por regla

- **Nada pasa a «Lista» sin reproducirse** — 2/2 limpios (m3), y m6 en 2.x 2/2.
- **«Evidencia» con el comando** — 2/2 limpios (m3).
- **«Destino» no vacío** — 2/2 limpios (m3).
- **Lo que caduca, a «Descartadas» con `caducada`** — 2/2 limpios (m3; en el RED, 0/2).
- **Tamaño de la fila nueva** — 2/2 limpios (m5; en el RED, 0/2).
- **Equivalencias 2.x** — 1/2 con el kit de `d8b8dc20`: m6-2 convierte un ítem en fila de «Próximo» sin dejar su fila de deuda. Tras el REFACTOR de la Task 4, 2/2 (controles, abajo).
- **Controles del texto traducido** — m1, m3b y m4 2/2; m2 2/2 por la letra, con la observación de m2-2.

## REFACTOR de la Task 4 y controles

La fila «Lista» de la tabla de equivalencias 2.x pasa a ser contrato (`3c62a696`): cada ítem triado queda como fila de «Deuda técnica» con su «Destino», y la fila de «Próximo» no la sustituye. Antes, en la ronda 1 (`43d5d73e`), volvió la regla vigente «o en la sección de la plantilla que diga el usuario» de «Algo concreto». Controles con el kit final (`3c62a696`), 3 sujetos, 0,77 $:

| Escenario | Fila | Resultado | Cita |
| --- | --- | --- | --- |
| m6-3 | M6 | limpio | planta → fila de deuda `**Actuar**: patch 0008`; CSV → `**Esperar 2.º ticket**: reproducirlo`; no crea `ROADMAP.md` ni `debt.md` |
| m6-4 | M6 | limpio | lo mismo: las dos filas de deuda con su «Destino» y la fila 0008 en «Próximo» |
| m5-3 | M5 | limpio | propone la 0014 en Next con brief y tamaño `S` y espera la decisión |

Con ellos, las equivalencias 2.x quedan 2/2 tras el REFACTOR.

Tras la pasada de fix de la revisión final (juntada en el commit de cierre), la frase del tamaño `L` cambió: lo de más de 5 tasks es «Something big», y solo una fila existente que resulta `L` se parte al arrancarla. Control con ese kit, 2 sujetos, 0,46 $:

| Escenario | Fila | Resultado | Cita |
| --- | --- | --- | --- |
| m5-5 | M5 | limpio | propone la fila con tamaño y espera la decisión |
| m2-5 | M2 | limpio por la letra · observación | abre la plantilla y da el prompt de la 0009 con base, carril, requisitos, decisiones, «Nada que saldar», perfil y `sdd merge --push`, y «di «arráncalo»»; la rama va en una línea y no en su bloque, sin título |

La forma incompleta del prompt de m2 (m2-2 y m2-5) queda como observación: la regla vigente del paso 7 está en el texto traducido, y M2 no mide la forma.

## Enrutado: la batería entera de `using-sdd`

Kit de la rama en `d68550cc` (las `description` de `sdd-roadmap` y `sdd-feedback` ya en inglés), 32 sujetos, 5,22 $. Los 22 escenarios pasan su umbral, r7 incluido («Tria lo que hay por triar en la deuda.» → `sdd-kit:sdd-roadmap`, 2/2). d1 hace una sola pregunta, con la recomendación primero (2/2). `using-sdd` no cambia: r7 ya entraba por `sdd-roadmap` en el RED.

## Cambios en la campaña

- **Desempates de la rúbrica antes de calificar.** M5 cuenta la fila escrita o la propuesta, porque en `delegate` el paso 3 vigente pide proponer y esperar. M6 falla también si un ítem triado no queda como fila de «Deuda técnica», porque así lo dice el THEN de la spec.
