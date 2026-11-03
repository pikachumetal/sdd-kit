---
id: 20261103-130212-feature-0299-own-skills-audit
title: Research — dónde incumplen las skills del kit las tres reglas del dev-lead
spec: ./spec.md
status: done
created: 2026-11-03
timeboxed: 4h
---

# Research — dónde incumplen las skills del kit las tres reglas del dev-lead

Base de la medida: `skills/` en el commit `8e22a49f`. Cada cita es `skills/<skill>/<fichero>:<línea>` en ese commit, y se puede leer con `git show 8e22a49f:<ruta>` aunque la 0300 mueva las skills.

## 1. Pregunta a resolver

En las skills del kit, ¿dónde se incumplen las tres reglas del dev-lead?

1. Partir de la fuente sin tocar lo que funciona.
2. Lo que el kit hace distinto sustituye la frase de la fuente; nunca se añade al lado contradiciéndola.
3. Un problema se arregla mejorando la frase que falla, no añadiendo otra.

## 2. Objetivos

| Objetivo | Estado | Detalle | Evidencia |
| --- | --- | --- | --- |
| O1 — las 11 propias: el 100 % de los candidatos, confirmado o descartado con motivo | cumple | 20 hallazgos confirmados en 6 de las 11 propias; los descartes, por clase, en «Descartes» | `own.md`, `out/*.md` |
| O2 — la capa del kit de las 11 copias, contra el resto del kit: 100 % de candidatos resuelto | cumple | 36 hallazgos en 5 de las 11 copias, con los 5 de `fork-audit.md` citados | `copies.md`, `out/*.md` |
| O3 — cada hallazgo con `fichero:línea`, tipo, las dos frases literales y su commit | cumple | 56 de 56: la frase la saca `render.mjs` del commit base, con el sha de `git blame`; el commit que la introdujo, si difiere y se rastreó con `git log -S`, en la nota | `own.md`, `copies.md`, `scripts/render.mjs` |
| O4 — reglas repetidas entre skills distintas, con sus sitios | cumple | 33 reglas dichas en dos skills o más; tabla de §2.3 | `own.md`, `copies.md`, `out/shared.md` |
| O5 — distancia entre las dos frases de cada hallazgo | cumple | excepciones y contradicciones: 5 de 9 en la misma unidad; reglas repetidas: 30 de 47 en otra skill (§4) | `own.md`, `copies.md` |
| O6 — `research.md` con una fila por skill de las 22, descartes, lo no leído y §5 | cumple | este documento | — |

Candidatos de `scripts/rules.mjs`: 285 (59 excepciones, 148 bloques repetidos de 10 palabras o más, 78 unidades con cita de ticket), por debajo del freno de 300 de la spec. La lectura no pasó de 4 h.

### 2.1 Una fila por skill

Tipos: **C** contradicción · **X** excepción pegada · **D** la misma regla en dos sitios · **T** texto que solo existe por un ticket. Un hallazgo cuenta en la skill de su primer sitio; «sitio en» lista los hallazgos de otra skill que también la nombran.

| Skill | Origen | C | X | D | T | Hallazgos | Sitio en | No leído entero |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sdd-roadmap` | propia | 0 | 0 | 4 | 0 | P1, P2, P3, P4 | P5 | — |
| `sdd-init` | propia | 0 | 0 | 2 | 0 | P8, P9 | — | — |
| `sdd-templates` | propia | 0 | 0 | 11 | 0 | P10-P20 | P7, K20, K32 | — |
| `sdd-end-release` | propia | 0 | 0 | 1 | 0 | P6 | P3, P4 | — |
| `sdd-config` | propia | 0 | 0 | 0 | 0 | limpia | — | — |
| `sdd-explore` | propia | 0 | 0 | 1 | 0 | P5 | — | — |
| `sdd-upgrade` | propia | 0 | 0 | 0 | 0 | limpia | — | `references/migrations/` (13 ficheros) |
| `sdd-feedback` | propia | 0 | 0 | 1 | 0 | P7 | — | — |
| `sdd-retro` | propia | 0 | 0 | 0 | 0 | limpia | — | — |
| `using-sdd` | propia | 0 | 0 | 0 | 0 | limpia (la tabla repite las `description` por diseño: §5, «para la 0300») | — | — |
| `add-to-changelog` | propia | 0 | 0 | 0 | 0 | limpia | — | — |
| `sdd-implement` | copia | 1 | 3 | 10 | 0 | K1-K14 | P13, P15, P17, P18, K19 | — |
| `sdd-propose` | copia | 0 | 1 | 8 | 1 | K15-K24 | P1, P12, P14, P15, P17, P19, K5, K6, K10, K25, K36 | — |
| `sdd-archive` | copia | 0 | 1 | 5 | 0 | K25-K30 | P3, P14, P16, P20, K5, K11, K12, K14 | — |
| `sdd-verify` | copia | 0 | 1 | 3 | 0 | K31, K32, K33, K36 | P9, P14, P18, K2, K9 (dudoso §5 de `fork-audit.md`), K13, K26, K30 | — |
| `sdd-tdd` | copia | 0 | 1 | 1 | 0 | K34, K35 | K9 | — |
| `sdd-debugging` | copia | 0 | 0 | 0 | 0 | limpia en su capa del kit | K28 | — |
| `sdd-worktrees` | copia | 0 | 0 | 0 | 0 | limpia en su capa del kit | K20, K28 | — |
| `sdd-parallel-agents` | copia | 0 | 0 | 0 | 0 | limpia en su capa del kit | P18, K33 | — |
| `sdd-rubber-duck` | copia | 0 | 0 | 0 | 0 | limpia | — | — |
| `sdd-agent-writing` | copia | 0 | 0 | 0 | 0 | limpia | — | — |
| `sdd-grilling` | copia | 0 | 0 | 0 | 0 | limpia | — | — |
| **Total** | | **1** | **7** | **47** | **1** | **56** | | |

«Limpia» quiere decir sin hallazgo confirmado entre los candidatos, no fiel en todo (§2.5).

### 2.2 Los hallazgos que no son repetición

Son los que rompen las reglas 2 y 3 de forma directa: una frase que contradice o exceptúa a otra sin cambiarla.

| Id | Tipo | Dónde | Lo que pasó | Commit |
| --- | --- | --- | --- | --- |
| K1 | C | `sdd-implement/SKILL.md:18` | «only these» de superpowers y «a fifth class, not an exception to the four» del kit, en el mismo párrafo (`fork-audit.md` §1) | `e7ddf254` volvió a pegar la frase de la fuente |
| K2 | X | `sdd-implement/SKILL.md:200` | «cheap-to-mid tier —except the single re-review of the final review…» (`fork-audit.md` §2) | `1d89f543` |
| K3 | X | `sdd-implement/SKILL.md:14` | «except in a patch» añadido a la regla del primer mensaje | `144a9b2f` (fix de la revisión final de la 0206) sobre `31783aa5` |
| K4 | X | `sdd-implement/SKILL.md:305` | «stop before committing it — also when you didn't write the AND» y, después, «One case goes on…» | `b66381e7` (0222) sobre `39868b02` |
| K16 | X | `sdd-propose/SKILL.md:104` | el predicado «only touches templates or styles» y «**Removal** is the exception» | nacen juntas en `0490c649` (traídas de la 2.x) |
| K25 | X | `sdd-archive/SKILL.md:89` y `:96` | dos filas de racionalizaciones reciben «except with `field` or `Validación: agente`» | `5abd84b8` (pasada de fix de la 0263) sobre `7d0b66cd` |
| K31 | X | `sdd-verify/SKILL.md:243` | «A fix without a test that failed first is not verified» recibe «except a Minor no test reproduces» | `97ec9c02` (cierre de la 0178) sobre `649f1a99` |
| K34 | X | `sdd-tdd/SKILL.md:125` | «Fix test» de la fuente seguido de la regla del test recibido (`fork-audit.md` §4) | `bc8113f6` |
| K22 | T | `sdd-propose/SKILL.md:61` | «Deciding the level without opening it is the failure» repite la frase anterior («open review-spec.md and apply its rubric») | `01be8f1d` (último que tocó la línea) |

De los nueve, tres se pegaron en un cierre o en la pasada de fix de una revisión final (K3, K25, K31): el sitio donde un hallazgo se arregla con prisa.

### 2.3 Reglas dichas en dos skills o más

| Regla | Skills | Ids |
| --- | --- | --- |
| Leer el índice de capacidades antes de abrir una | `sdd-roadmap`, `sdd-propose` | P1 |
| `sdd roadmap check` y el fallo en una línea ajena | `sdd-roadmap`, `sdd-archive`, `sdd-end-release` | P3 |
| `release.hasRecipient`: preguntar una vez y no escribirlo sin respuesta | `sdd-roadmap`, `sdd-end-release` | P4 |
| El prompt de lanzamiento | `sdd-explore`, `sdd-roadmap`, `sdd-templates` | P5 |
| Privacidad del ticket del kit | `sdd-feedback`, `sdd-templates` | P7 |
| Lista de manifests que cambian el build | `sdd-init`, `sdd-verify` | P9 |
| Capacidad = sustantivo del dominio, slug en inglés | `sdd-templates` (2), `sdd-propose` | P12 |
| Campos de `§Frontend` | `sdd-implement`, `sdd-templates` | P13 |
| La línea `Gate:` | `sdd-verify`, `sdd-propose`, `sdd-archive`, `sdd-templates` | P14 |
| Qué es un desvío | `sdd-propose`, `sdd-implement`, `sdd-templates` | P15 |
| Los valores viven solo en `capabilities/` | `sdd-templates`, `sdd-archive` | P16 |
| El método de ejecución y sus cuatro factores | `sdd-templates`, `sdd-propose` (2), `sdd-implement` | P17 |
| Modelo y effort en cada despacho | `sdd-templates`, `sdd-implement`, `sdd-parallel-agents`, `sdd-verify` | P18 |
| Las líneas de validación del walkthrough | `sdd-propose`, `sdd-templates` | P19 |
| El delta de un patch | `sdd-archive`, `sdd-templates` | P20 |
| La re-revisión única con opus | `sdd-implement` (2), `sdd-verify` (2) | K2 |
| El commit de menos de 20 líneas que no se revisa | `sdd-implement`, `sdd-propose`, `sdd-archive` | K5 |
| Red flag «edit code and the plan isn't approved» | `sdd-implement`, `sdd-propose` | K6 |
| Cuándo corre la suite completa | `sdd-implement`, `sdd-tdd`, `sdd-verify` | K9 |
| La comprobación de la base antes de cada task | `sdd-implement`, `sdd-propose` | K10 |
| Cómo se presenta la verificación visual | `sdd-implement` (3), `sdd-archive` | K11 |
| Un patch que interpreta requisitos era una feature | `sdd-implement`, `sdd-archive`, `sdd-propose` | K12 |
| La revisión final sale con el último commit | `sdd-implement`, `sdd-verify` | K13 |
| El squash del cierre | `sdd-archive`, `sdd-implement` | K14 |
| Carpeta y rama del patch, renombrar `feature/<slug>` | `sdd-implement`, `sdd-propose` | K19 |
| De dónde sale el gate de cierre | `sdd-propose` (2), `sdd-worktrees`, `sdd-templates` | K20 |
| La validación en campo no para | `sdd-archive` (3), `sdd-propose` (2) | K25 |
| Qué suites corren antes del gate; `.docs/` no corre nada | `sdd-archive`, `sdd-verify` | K26 |
| Contrastar un rojo con la integración y la deuda | `sdd-archive` (2), `sdd-worktrees`, `sdd-debugging` | K28 |
| El último sha revisado | `sdd-archive`, `sdd-verify` | K30 |
| `Política de modelos:` confirma paralelizar | `sdd-verify`, `sdd-templates`, `sdd-propose` | K32 |
| El tope `control.maxParallelAgents` | `sdd-parallel-agents`, `sdd-verify` | K33 |
| El eje Arquitectura | `sdd-propose`, `sdd-verify` | K36 |

En 5 de estas 33 las versiones ya difieren (P1, P9, P13, K5 y K28); dentro de una misma skill, en 3 más (P2, P10 y P11).

### 2.4 Descartes

Cada candidato se leyó con sus dos frases. Los que no son hallazgo, por motivo:

- **Excepciones (46 de 59)**:
  - «instead of», «exception» o «instead of many» como comparación o sustitución, sin regla absoluta que exceptuar: E1, E2, E5, E8, E12, E15, E16, E19, E20, E23, E24, E27, E30, E32, E33, E35, E37, E38, E45, E46, E47, E49, E55, E57.
  - Absoluta y salida en la misma frase con un predicado observable (Art. II): E9, E10, E11, E17, E18, E26, E28, E31, E34, E36, E41, E43, E54. Con una lectura estricta del Art. II («nunca cláusulas de excepción») estos 13 serían excepciones; se rastrearon con `git log -S` E31, E34, E41 y E43, que nacen con su absoluta; los otros nueve no se rastrearon.
  - Texto de la fuente que define su propia excepción (`sdd-agent-writing`, `sdd-tdd`, `sdd-verify`): E4, E51 (el kit sustituye la frase de la fuente, regla 2 cumplida), E52, E53, E58.
  - Sin absoluta con el mismo sujeto: E3, E39, E50.
  - La fila remite a una excepción que sí existe en su paso: E40 (`sdd-init/SKILL.md:68`, dentro del paso 8).
  - Confirmados dentro de otro hallazgo: E6, E7, E13, E14, E21, E22, E25, E29, E42, E44, E48, E56, E59 (13).
- **Bloques repetidos (73 de 148)**:
  - Preámbulo común de cada skill («Write everything the user reads in the language of their message», «Forked from…»), que el Art. III pide en cada una: S21, S22, S23, S25, S26, S57, S109, S111, S113, S116, S121, S123, S131, S133, S138, S141, S146, S148.
  - Frontmatter y `description`: S76, S91, S108, S110, S119, S120, S122, S128, S130, S140, S145.
  - La tabla de `using-sdd` repite las `description`, por diseño de router: S29, S34, S53, S106 (§5, «para la 0300»).
  - Estructura común de plantillas (frontmatter, campos, filas de ejemplo, encargos de revisor): S5, S6, S27, S28, S52, S59, S62, S63, S64, S65, S78, S81, S82, S96, S99, S101, S134, S137.
  - Texto que ya se repite en la fuente de superpowers: S1, S19, S46, S47, S84, S147.
  - Tabla de racionalizaciones o red flag que repite su paso, la forma del Art. II: S55, S89, S90, S93, S94.
  - Mandatos distintos con una frase común (fórmulas como «invoke it with `Skill`», el índice de plantillas, dos líneas de CI): S39, S41, S43, S51, S68, S74, S77, S86, S117, S129, S139.
  - Los 75 restantes están confirmados y agrupados en los hallazgos P y K.
- **Citas de ticket (78 unidades)**: 43 frases con cita nacen con su regla (la cita es la evidencia del Art. I); de las 55 que se añadieron después, 7 entran en hallazgos (K3, K4, K8, K17, K19, K22, K32) y el resto cambia o precisa su regla sin repetir otra, o tiene un origen que `git log -S` no encuentra porque la frase es corta o se movió.

### 2.5 Lo que no se leyó

- `skills/sdd-upgrade/references/migrations/` (13 ficheros), los `NOTICE.md` y los `tests/` de cada skill (decisión 4 de la spec).
- Bloques repetidos de menos de 5 frases de 6 palabras (630 de 778): frases hechas casi todas; una regla repetida en menos de 10 palabras seguidas queda sin candidato.
- Paráfrasis: la misma regla dicha con otras palabras solo aparece si un candidato la trae al lado. Ninguna skill se leyó entera frase contra frase.
- El origen real de las frases que nacen en los commits que movieron o tradujeron texto de la 2.x (`4597d47e`, `0490c649`, `33d0d0b7`, `2d738fbd`): el sha es el del movimiento, como avisa `provenance.md`.
- El emparejamiento automático de excepciones elige mal el compañero en líneas muy largas (`sdd-propose/SKILL.md:60` sale en 12 parejas): por eso cada excepción se juzgó por su propia frase, no por la pareja.

## 4. Recomendación

- **Elegida**: rehacer `sdd-implement` y `sdd-propose`; arreglar frase a frase los 7 restantes con hallazgo; dar una sola fuente a las 33 reglas repetidas entre skills. · **Por qué**:
  - Las excepciones pegadas y la contradicción están **en la misma unidad o sección** (5 de 9 en la unidad, 1 en la sección, 2 en otra sección, 1 en otro fichero de la skill): agrupar las reglas por tema no las habría evitado, porque ya estaban al lado de su regla. Se evitan reescribiendo la frase que falla (regla 3), y un lint del pre-commit solo puede avisar de ellas.
  - Las reglas repetidas están **en otra skill** en 30 de 47 casos (en otro fichero de la misma skill, 9; en otra sección, 7; en la misma sección, 1). Ahí sí ayuda una fuente única por regla: es lo que puede dar una anotación que la 0300 sustituye al construir `dist/`.
  - `sdd-implement` (14) y `sdd-propose` (10) concentran el 43 % de los hallazgos y los dos únicos tipos C y T, y en `sdd-propose` la misma oferta sale en cuatro sitios del mismo flujo (K15).
- **Descartadas**:
  - Agrupar por tema dentro de cada skill: no habría evitado ninguna de las 9 C/X/T (todas en su unidad o sección) y rompe el orden de pasos que sigue el agente.
  - Solo un lint de pre-commit: avisa de las excepciones, pero no de una regla repetida en otra skill ni de una paráfrasis.

## 5. Lo que sale

Propuesta para `sdd-roadmap`, en tres cubos (decisión 8 de la spec). El spike no cambia nada.

- **Se rehacen** (más de un hallazgo estructural, o contradicción o excepciones entre secciones):
  - `sdd-implement` — K1-K14: una contradicción, tres excepciones pegadas y 10 reglas repetidas. Va con la 0296, que ya separa `sdd-implement` en la puerta y dos copias de superpowers 7.0.1. → fila por abrir, o ampliar la 0296.
  - `sdd-propose` — K15-K24: la oferta de «gama media» y el anuncio en cuatro sitios, la regla del patch de dos tests en dos, el paso 4 con frases añadidas por RED que repiten la anterior. → fila por abrir.
- **Se arreglan** (cambiando la frase que falla, sin añadir otra):
  - `sdd-archive` — K25 (quitar el «except» de las dos filas y dejar que el paso 1 diga lo de `field`) y K26-K30. → fila por abrir.
  - `sdd-verify` — K31 (decidir si un Minor sin test reproducible se arregla, y decirlo en la frase) y K32, K33, K36. → fila por abrir.
  - `sdd-tdd` — K34 (ya en `fork-audit.md`) y K35. → fila por abrir, con la de `sdd-verify` o sola.
  - `sdd-roadmap` — P1-P4. → fila por abrir.
  - `sdd-templates` — P10 y P11 primero (dos formas distintas de la misma regla en dos plantillas); P12-P20 se resuelven con la fuente única. → fila por abrir.
  - `sdd-init` (P8, P9), `sdd-explore` (P5), `sdd-end-release` (P6) y `sdd-feedback` (P7). → una fila para las cuatro.
- **Se quedan**: `sdd-config`, `sdd-upgrade`, `sdd-retro`, `using-sdd`, `add-to-changelog`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-rubber-duck`, `sdd-agent-writing` y `sdd-grilling`. Las cuatro que aparecen como sitio secundario de un hallazgo (`sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `using-sdd`) cambian solo si la fuente única de esa regla las toca.
- **Para la 0300**:
  - Una regla que vive en varias skills (§2.3, 33 reglas) necesita una sola fuente: una anotación de inclusión en el repo que `dist/` sustituye por el texto, para que las copias no deriven. En 5 ya derivaron.
  - La tabla de `using-sdd` se puede generar desde las `description` de cada skill (S29, S34, S53, S106).
  - El commit de origen de cada regla (el que este spike rastrea a mano con `git log -S`) cabe en la anotación del repo, fuera de lo que lee el agente: así no se pierde al mover o traducir texto, como pasó con `4597d47e` y `0490c649`.
- **La ADR de las tres reglas** (pendiente desde `estado.md` de la 0296): sustituye a la ADR 0013, que solo dice «conserva el texto». Los 9 hallazgos C/X/T de §2.2 son su evidencia. → fila por abrir.
