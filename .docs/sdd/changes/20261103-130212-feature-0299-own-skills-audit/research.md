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
| O1 — las 11 propias: el 100 % de los candidatos, confirmado o descartado con motivo | cumple | 21 hallazgos (P1-P21) más 23 parejas nuevas bajo el umbral; cada candidato tiene su veredicto por id | `own.md`, `out/*-verdicts*.md`, §2.4 |
| O2 — la capa del kit de las 11 copias, contra el resto del kit: 100 % de candidatos resuelto | cumple | 37 hallazgos (K1-K38; K22 se retiró en la revisión final) más 41 parejas nuevas bajo el umbral, con los 5 de `fork-audit.md` citados | `copies.md`, `out/*-verdicts*.md`, §2.4 |
| O3 — cada hallazgo con `fichero:línea`, tipo, las dos frases literales y su commit | cumple | los 58 de `own.md` y `copies.md`: frase literal y sha de `git blame` sacados del commit base por `render.mjs`; el commit que introdujo la frase, si difiere y se rastreó con `git log -S`, en la nota. Las 135 parejas bajo el umbral llevan sus dos frases literales y la cita en `out/shared-low.md`, sin el commit de origen | `own.md`, `copies.md`, `out/shared-low-verdicts-*.md` |
| O4 — reglas repetidas entre skills distintas, con sus sitios | cumple | 33 reglas en §2.3; bajo el umbral, 68 parejas más en otra skill | §2.3, `out/shared-low-summary.md` |
| O5 — distancia entre las dos frases de cada hallazgo | cumple | contradicción y excepciones pegadas: 10 de 10 en la misma unidad; reglas repetidas: 31 de 47 en otra skill, y 68 de 135 parejas bajo el umbral (§4) | `own.md`, `copies.md`, `out/shared-low-summary.md` |
| O6 — `research.md` con una fila por skill de las 22, descartes, lo no leído y §5 | cumple | este documento | — |

**Candidatos de `scripts/rules.mjs`: 915** (59 excepciones, 778 parejas de unidades con frases de 6 palabras en común y 78 unidades con cita de ticket). Pasan del freno de 300 de la spec. La primera pasada solo leyó las 148 parejas con 5 frases o más en común: el resto lo dejó fuera con un ruling, sin parar. La revisión final lo vio. El dev-lead eligió entonces leer las 630 restantes con 3 subagentes Sonnet, con effort medium (enmienda de la spec). Están en `out/shared-low.md` y sus veredictos, en `out/shared-low-verdicts-1.md` a `-3.md`.

### 2.1 Una fila por skill

Tipos:
- **C**: contradicción.
- **X**: excepción pegada.
- **D**: la misma regla en dos sitios.
- **T**: texto que solo existe por un ticket; ninguno confirmado.
- **R1**: texto de la fuente quitado sin motivo (regla 1).
- **D bajo umbral**: parejas confirmadas con menos de 5 frases en común que no caen en ningún hallazgo existente.

Un hallazgo cuenta en la skill de su primer sitio; «sitio en» lista los de otra skill que también la nombran.

| Skill | Origen | C | X | D | R1 | D bajo umbral | Hallazgos | Sitio en |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `sdd-roadmap` | propia | 0 | 0 | 4 | 0 | 3 | P1-P4 | P5 |
| `sdd-init` | propia | 0 | 0 | 2 | 0 | 3 | P8, P9 | — |
| `sdd-templates` | propia | 0 | 0 | 11 | 0 | 11 | P10-P20 | P7, K20, K32 |
| `sdd-end-release` | propia | 0 | 0 | 1 | 0 | 3 | P6 | P4 |
| `sdd-config` | propia | 0 | 1 | 0 | 0 | 1 | P21 | — |
| `sdd-explore` | propia | 0 | 0 | 1 | 0 | 1 | P5 | — |
| `sdd-upgrade` | propia | 0 | 0 | 0 | 0 | 0 | limpia, sin leer `references/migrations/` (13 ficheros) | — |
| `sdd-feedback` | propia | 0 | 0 | 1 | 0 | 0 | P7 | — |
| `sdd-retro` | propia | 0 | 0 | 0 | 0 | 0 | limpia | — |
| `using-sdd` | propia | 0 | 0 | 0 | 0 | 0 | limpia (la tabla repite las `description` por diseño: §5, «para la 0300») | — |
| `add-to-changelog` | propia | 0 | 0 | 0 | 0 | 1 | — | — |
| `sdd-implement` | copia | 1 | 3 | 10 | 1 | 13 | K1-K14, K37 | P13, P15, P17, P18, K19 |
| `sdd-propose` | copia | 0 | 1 | 8 | 0 | 12 | K15-K21, K23, K24 | P1, P12, P14, P15, P17, P19, K5, K6, K10, K25, K36 |
| `sdd-archive` | copia | 0 | 2 | 5 | 0 | 16 | K25-K30, K38 | P3, P14, P16, P20, K5, K11, K12, K14 |
| `sdd-verify` | copia | 0 | 1 | 3 | 0 | 0 | K31, K32, K33, K36 | P9, P14, P18, K2, K9, K13, K26, K30 |
| `sdd-tdd` | copia | 0 | 1 | 1 | 0 | 0 | K34, K35 | K9 |
| `sdd-debugging` | copia | 0 | 0 | 0 | 0 | 0 | limpia en su capa del kit | K28 |
| `sdd-worktrees` | copia | 0 | 0 | 0 | 0 | 0 | limpia en su capa del kit | K20, K28 |
| `sdd-parallel-agents` | copia | 0 | 0 | 0 | 0 | 0 | limpia en su capa del kit | P18, K33 |
| `sdd-rubber-duck` | copia | 0 | 0 | 0 | 0 | 0 | limpia | — |
| `sdd-agent-writing` | copia | 0 | 0 | 0 | 0 | 0 | limpia | — |
| `sdd-grilling` | copia | 0 | 0 | 0 | 0 | 0 | limpia | — |
| **Total** | | **1** | **9** | **47** | **1** | **64** | **58** | |

«Limpia» quiere decir sin hallazgo confirmado entre los candidatos, no fiel en todo (§2.5). Las 71 parejas bajo el umbral que caen en un hallazgo existente lo refuerzan con más sitios (P19 10, P18 7, P10 5, P14 5, K11 4, K28 4, P17 4…: `out/shared-low-summary.md`).

### 2.2 Los hallazgos que no son repetición

Son los que rompen las reglas 2 y 3 de forma directa: una frase que contradice o exceptúa a otra sin cambiarla.

El criterio, uno solo:
- **Excepción pegada** es una de estas dos cosas:
  - una frase aparte que exceptúa la absoluta;
  - una cláusula en la misma frase que `git log -S` muestra añadida en un commit posterior al de la absoluta.
- **Predicado (Art. II), y se descarta**: una cláusula que nace con su absoluta.

| Id | Tipo | Dónde | Lo que pasó | Commit |
| --- | --- | --- | --- | --- |
| K1 | C | `sdd-implement/SKILL.md:18` | «only these» de superpowers y «a fifth class, not an exception to the four» del kit, en el mismo párrafo (`fork-audit.md` §1) | `e7ddf254` volvió a pegar la frase de la fuente |
| K2 | X | `sdd-implement/SKILL.md:200` | «cheap-to-mid tier» recibe «—except the single re-review of the final review…» (`fork-audit.md` §2) | `1d89f543` sobre `e7ddf254` |
| K3 | X | `sdd-implement/SKILL.md:14` | «except in a patch» añadido a la regla del primer mensaje | `144a9b2f` (fix de la revisión final de la 0206) sobre `31783aa5` |
| K4 | X | `sdd-implement/SKILL.md:305` | «stop before committing it — also when you didn't write the AND» y, después, «One case goes on…» | `b66381e7` (0222) sobre `39868b02` |
| K16 | X | `sdd-propose/SKILL.md:104` | el predicado «only touches templates or styles» y, en frase aparte, «**Removal** is the exception» | nacen juntas en `0490c649` (traídas de la 2.x) |
| K25 | X | `sdd-archive/SKILL.md:89` y `:96` | dos filas de racionalizaciones reciben «except with `field` or `Validación: agente`» | `5abd84b8` (pasada de fix de la 0263) sobre `7d0b66cd` |
| K38 | X | `sdd-archive/SKILL.md:51` | «no run without the filter for it» recibe «, unless it is a file of «Sin filtro»» | `97ee8641` (cierre de la 0236) sobre `161195a3` |
| K31 | X | `sdd-verify/SKILL.md:243` | «A fix without a test that failed first is not verified» recibe «except a Minor no test reproduces» | `97ec9c02` (cierre de la 0178) sobre `649f1a99` |
| K34 | X | `sdd-tdd/SKILL.md:125` | «Fix test» de la fuente seguido de la regla del test recibido (`fork-audit.md` §4) | `bc8113f6` |
| P21 | X | `sdd-config/SKILL.md:16` | «A key with a value isn't asked again» recibe «unless asked» | `97ec9c02` (cierre de la 0178) sobre `900f5af1` |
| K37 | R1 | `sdd-implement/SKILL.md:303` | «Rulings, not stalls» pierde texto de superpowers sin motivo escrito (`fork-audit.md` §3) | `e7ddf254` (última versión de la frase; `git log -S`) |

De las nueve excepciones pegadas, cinco se añadieron en un cierre o en la pasada de fix de una revisión final (K3, K25, K31, K38, P21): el sitio donde un hallazgo se arregla con prisa.

### 2.3 Reglas dichas en dos skills o más

| Regla | Skills | Ids |
| --- | --- | --- |
| Leer el índice de capacidades antes de abrir una | `sdd-roadmap`, `sdd-propose` | P1 |
| `sdd roadmap check` y el fallo en una línea ajena | `sdd-roadmap`, `sdd-archive` | P3 |
| `release.hasRecipient`: preguntar una vez y no escribirlo sin respuesta | `sdd-roadmap`, `sdd-end-release` | P4 |
| El prompt de lanzamiento | `sdd-explore`, `sdd-roadmap`, `sdd-templates` | P5 |
| Privacidad del ticket del kit | `sdd-feedback`, `sdd-templates` | P7 |
| Lista de manifests que cambian el build | `sdd-init`, `sdd-verify` | P9 |
| Capacidad = sustantivo del dominio, slug en inglés | `sdd-templates` (2), `sdd-propose` | P12 |
| Campos de `§Frontend` | `sdd-implement`, `sdd-templates` | P13 |
| La línea `Gate:` | `sdd-verify`, `sdd-propose`, `sdd-archive`, `sdd-templates` | P14 |
| Qué es un desvío | `sdd-propose`, `sdd-implement`, `sdd-templates` | P15 |
| Un documento técnico enlaza la capacidad sin copiar el valor | `sdd-templates`, `sdd-archive` | P16 |
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

Las versiones ya difieren en estos hallazgos:
- **Entre skills, 5 de estas 33**: P1, P9, P13, K5 y K28.
- **Dentro de una misma skill, 3 más**: P2, P10 y P11.
- **Bajo el umbral, 29 de 135 parejas.** Una de ellas: el walkthrough pide `Validado por el dev-lead: <fecha> · <qué probó>`, y `sdd-archive` y `patch-template` piden `Validado: <fecha> · «<frase literal>»` (S456, S457). Otra: una fila de «En espera» caducada; `sdd-end-release` la mueve sin preguntar y `sdd-roadmap` solo la propone (S665).

### 2.4 Descartes

Cada candidato tiene su veredicto por id.

**Excepciones (44 de 59 descartadas, 15 en hallazgos):**
- **Comparación o sustitución**: «instead of», «exception» o «instead of many» sin regla absoluta que exceptuar. E1, E2, E5, E8, E12, E15, E16, E19, E20, E23, E24, E27, E30, E32, E33, E35, E37, E38, E45, E46, E47, E49, E55, E57.
- **Predicado**: la cláusula nace con su absoluta, comprobado con `git log -S`. E10, E11, E18, E26, E28, E31, E34, E41, E43, E54. Y E36, cuya cláusula es anterior a la redacción actual de la absoluta.
- **Texto de la fuente que define su propia excepción**: E4, E51 (el kit sustituye la frase de la fuente, la regla 2 se cumple), E52, E53, E58.
- **Sin absoluta con el mismo sujeto**: E3, E39, E50.
- **La fila remite a una excepción que sí existe en su paso**: E40 (`sdd-init/SKILL.md:68`, dentro del paso 8).
- **En hallazgos**: E6, E7, E9 (K38), E13, E14, E17 (P21), E21, E22, E25, E29, E42, E44, E48, E56, E59.

**Parejas con 5 frases o más en común (73 de 148 descartadas, 75 en hallazgos):**
- **Preámbulo común de cada skill**, que el Art. III pide en cada una: S21, S22, S23, S25, S26, S57, S109, S111, S113, S116, S121, S123, S131, S133, S138, S141, S146, S148.
- **Frontmatter y `description`**: S76, S91, S108, S110, S119, S120, S122, S128, S130, S140, S145.
- **La tabla de `using-sdd` repite las `description`**, por diseño de router: S29, S34, S53, S106.
- **Estructura común de plantillas**: S5, S6, S27, S28, S52, S59, S62, S63, S64, S65, S78, S81, S82, S96, S99, S101, S134, S137.
- **Texto que ya se repite en la fuente**: S1, S19, S46, S47, S84, S147.
- **Racionalización o red flag que repite su paso** (Art. II): S55, S89, S90, S93, S94.
- **Mandatos distintos con una frase común**: S39, S41, S43, S51, S68, S74, S77, S86, S117, S129, S139.

**Parejas con menos de 5 frases (495 de 630 descartadas, 135 confirmadas):**
- Por clase: frase común 306 · plantilla 70 · productor/consumidor 29 · preámbulo 27 · frontmatter 25 · art-ii 20 · fuente 18.
- Cada veredicto, en `out/shared-low-verdicts-*.md`. Seis que un subagente confirmó como reglas nuevas los reclasificó el hilo como `fuente`, porque superpowers 7.0.0 ya repite ese texto: S149, S150, S218, S219, S295 y S334. Y S211 pasó de K2 a K5.

**Citas de ticket (78 unidades, 98 frases con cita):**
- En `out/tickets-verdicts.md`, por id.
- **36 unidades nacen con su regla** (comprobado con `git log -S`): la cita es la evidencia del Art. I.
- **21 son hallazgo (6) o sitio de un hallazgo D o X (15)**.
- **20 se leyeron una a una sin hallazgo**: 7 con la frase con cita añadida después, que precisa su regla sin repetir otra; y 13 sin origen rastreable con `git log -S` (frase corta o movida), cada una con su motivo en el fichero (precisa su regla, cita sola, nota de procedencia, medida, productor/consumidor). El script no da veredicto a una unidad sin origen que no esté en esa lista: falla.
- **T43, el antiguo K22, se descarta**: la frase «Deciding the level without opening it is the failure» y su cita nacen juntas con la regla en `9e0fc16a` (`sdd-start-feature`), traducidas después. Era el único T.

### 2.5 Lo que no se leyó

- `skills/sdd-upgrade/references/migrations/` (13 ficheros), los `NOTICE.md` y los `tests/` de cada skill (decisión 4 de la spec).
- Paráfrasis: la misma regla dicha con otras palabras solo aparece si comparte al menos una frase de 6 palabras. Ninguna skill se leyó entera frase contra frase.
- Las unidades largas, en un subagente: las leyó cortadas a unos 650 caracteres. Sobre todo `sdd-propose/SKILL.md:46, 53, 54, 60 y 65` en el tramo S569-S778, donde un solape más allá de ese corte puede no estar visto.
- En el tramo S359-S568, 53 descartes de clase `plantilla`, `preámbulo`, `frontmatter` o `fuente` se decidieron por la frase compartida, sin abrir las dos unidades enteras.
- El commit de origen de las 135 parejas bajo el umbral: llevan su cita y su sha de `git blame` en `out/shared-low.md`, sin rastreo con `git log -S`.
- El origen real de las frases que nacen en los commits que movieron o tradujeron texto de la 2.x (`4597d47e`, `0490c649`, `33d0d0b7`, `2d738fbd`): el sha es el del movimiento, como avisa `provenance.md`. El rastreo se hizo con `git log -S`, no con `git log -L` (riesgo 1.7 del plan).

## 3. Aguante

No aplica: ningún objetivo es de rendimiento.

## 4. Recomendación

- **Elegida**: rehacer `sdd-implement`, `sdd-archive` y `sdd-propose`; arreglar frase a frase las otras 10 con hallazgo; dar una sola fuente a las reglas repetidas entre skills. · **Por qué**:
  - La contradicción y las nueve excepciones pegadas están **en la misma unidad que su regla** (10 de 10). Agrupar las reglas por tema no las habría evitado, porque ya estaban al lado. Se evitan reescribiendo la frase que falla (regla 3). Un lint del pre-commit puede avisar de ellas, pero no arreglarlas.
  - Las reglas repetidas están **en otra skill** en 31 de 47 hallazgos y en 68 de 135 parejas bajo el umbral, y en otro fichero de la misma skill en 8 y 38. Ahí sí ayuda una fuente única por regla: es lo que puede dar una anotación que la 0300 sustituye al construir `dist/`.
  - **Criterio de «se rehace»**: una contradicción, dos o más excepciones pegadas, o más de 15 reglas repetidas que no son plantilla. Lo cumplen:
    - `sdd-implement`: C, 3 X, 10 D y 13 bajo el umbral;
    - `sdd-archive`: 2 X, 5 D y 16 bajo el umbral;
    - `sdd-propose`: 1 X, 8 D y 12 bajo el umbral, con la misma oferta en cuatro sitios del flujo (K15).

    El umbral de 15 lo puse yo. `sdd-templates` (11 D y 11 bajo el umbral) no lo cruza porque sus repeticiones son la plantilla que copia la regla de una skill. Se arregla con la fuente única, no reescribiéndola.
- **Descartadas**:
  - Agrupar por tema dentro de cada skill: no habría evitado ninguna de las 10 C/X, y rompe el orden de pasos que sigue el agente.
  - Solo un lint de pre-commit: avisa de las excepciones, pero no de una regla repetida en otra skill ni de una paráfrasis.

## 5. Lo que sale

Propuesta para `sdd-roadmap`, en tres cubos (decisión 8 de la spec). El spike no cambia nada.

**Se rehacen:**
- `sdd-implement` — K1-K14 y K37: una contradicción, tres excepciones pegadas, 10 reglas repetidas, texto de la fuente quitado y 13 parejas más bajo el umbral. Va con la 0296, que ya separa `sdd-implement` en la puerta y dos copias de superpowers 7.0.1. → ampliar la 0296.
- `sdd-archive` — K25-K30 y K38: dos excepciones pegadas en cierres (K25, K38), 5 reglas repetidas y 16 parejas bajo el umbral, la cifra más alta. → fila por abrir.
- `sdd-propose` — K15-K21, K23, K24: la oferta de «gama media» y el anuncio en cuatro sitios, la regla del patch de dos tests en dos, el predicado de la retirada con su excepción aparte (K16) y 12 parejas bajo el umbral. → fila por abrir.

**Se arreglan** (cambiando la frase que falla, sin añadir otra):
- `sdd-verify` — K31 (decidir si un Minor sin test reproducible se arregla, y decirlo en la frase) y K32, K33, K36. → fila por abrir.
- `sdd-tdd` — K34 (ya en `fork-audit.md`) y K35. → con la de `sdd-verify` o sola.
- `sdd-roadmap` — P1-P4 y 3 parejas bajo el umbral, más la caducidad de «En espera», que difiere con `sdd-end-release` (S665). → fila por abrir.
- `sdd-templates` — P10 y P11 primero, porque son dos formas distintas de la misma regla en dos plantillas. Después, la de validación del walkthrough (S456, S457). P12-P20 se resuelven con la fuente única. → fila por abrir.
- `sdd-config` — P21: quitar «unless asked» y decir en la frase cuándo se vuelve a preguntar. → con la de `sdd-roadmap` o sola.
- `sdd-init` (P8, P9), `sdd-explore` (P5), `sdd-end-release` (P6), `sdd-feedback` (P7) y `add-to-changelog` (S686). → una fila para las cinco.

**Se quedan**: `sdd-upgrade`, `sdd-retro`, `using-sdd`, `sdd-debugging`, `sdd-worktrees`, `sdd-parallel-agents`, `sdd-rubber-duck`, `sdd-agent-writing` y `sdd-grilling`. Las que aparecen como sitio secundario de un hallazgo cambian solo si la fuente única de esa regla las toca.

**Para la 0300:**
- Una regla que vive en varias skills necesita una sola fuente: una anotación de inclusión en el repo que `dist/` sustituye por el texto. Son las 33 reglas de §2.3 y las 68 parejas bajo el umbral en otra skill. En 5 de §2.3 ya derivaron, y en 29 parejas bajo el umbral.
- La tabla de `using-sdd` se puede generar desde las `description` de cada skill (S29, S34, S53, S106).
- El commit de origen de cada regla cabe en la anotación del repo, fuera de lo que lee el agente. Este spike lo rastrea a mano con `git log -S`. Así no se pierde al mover o traducir texto, como pasó con `4597d47e` y `0490c649`.

**La ADR de las tres reglas** (pendiente desde `estado.md` de la 0296): sustituye a la ADR 0013, que solo dice «conserva el texto». Los 10 hallazgos C/X de §2.2 son su evidencia. → fila por abrir.
