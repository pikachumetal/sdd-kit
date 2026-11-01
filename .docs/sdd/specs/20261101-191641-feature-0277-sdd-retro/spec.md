---
id: 20261101-191641-feature-0277-sdd-retro
feature: 0277
parent: 0151
proposal: 0131
title: sdd-retro, señales del cierre y repaso por causa de cada release
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — sdd-retro, señales del cierre y repaso por causa de cada release

🦆 Hoy, al cerrar una feature, el agente abre la carpeta de skills y decide a ojo si hace falta una; y la deuda solo se mira fila a fila. Con este cambio, el cierre busca cuatro señales concretas y arregla con lo más barato. Si te corrigieron dos veces porque los tests se lanzan con `npm run test:unit`, se corrige `operations.md`, sin crear una skill; sin señales, queda una línea. En cada corte de release, una tabla agrupa la deuda por causa: «regla lejos de su paso: 2 abiertas, y una de ellas con 2 casos y desde la v1.2.0», y debajo se propone un solo cambio que las resuelva. El corte te nombra esa propuesta, no escribe filas ni espera; la decides al preparar la siguiente, o descartando la fila.

Validación: agente — son skills, plantilla y un verbo de la CLI, sin pantalla; el uso real llega por los tickets (`validation.mode: field`).

## Capacidades

- Nuevas: `project-retro` — la mejora del entorno del proyecto: señales del cierre y repaso por causa de cada release.
- Modificadas: `archive` — el cierre de feature pasa por `sdd-retro`, y un aprendizaje tiene salida si su destino no cabe.
- Modificadas: `release-flow` — qué parte de la retro es opcional y cuándo existe la carpeta de la release.
- Modificadas: `cli` — el verbo `roadmap causes`.
- Modificadas: `planning` — preparar una release lee las propuestas de la última retro.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: dos revisores, dominio en Opus y técnica en Sonnet (dev-lead: «1») — señales: capacidad nueva (`project-retro`), contrato público (la salida de `roadmap causes` y el `retro.md` que lee el corte siguiente), `MODIFIED` (`archive`, `release-flow`, `cli`), tres o más capacidades (cinco), dato persistente nuevo (`retro.md` en cada corte) · tamaño: ~350 líneas en 20 ficheros

1. **`feedback-template.md` se retira, y nace `retro-template.md`.** Sus secciones de inventario y cambios de requisito no las escribe nadie desde la 0063: el acta va a `proposal.md`. Solo su §3 sigue viva, y va a la plantilla nueva. El nombre, además, se confunde con `kit-feedback-template.md`. La alternativa era recortarla y conservar un nombre que ya no dice lo que hay dentro.
2. **La skill tiene dos pasadas, por quién la invoca**: `cierre` (paso 3 de `sdd-archive`, solo feature) y `release` (paso 5 de `sdd-end-release`). Un patch no pasa por ella, como hoy no pasa por la revisión de skills (`P3`).
3. **El repaso corre en cada corte con `debt.md`, sin preguntar y sin parar.** La parte de estimación y action items sigue siendo la que se ofrece y solo se hace si se pide: la fila pide el repaso cada release, no cambiar lo demás.
4. **El repaso no escribe filas.** Deja propuestas en `retro.md`, el resumen del corte las nombra —así llegan también sin preparar release— y `sdd-roadmap` las lee en su inventario al preparar la siguiente. Crear filas en el corte añadiría trabajo a un paso que no debe retener, y decidir qué entra es tuyo. No hay registro de propuestas rechazadas: se rechaza descartando la fila en `debt.md`, que deja de contar como abierta; una ignorada vuelve en el corte siguiente y acaba en `prioriza o descarta`.
5. **Verbo nuevo `sdd roadmap causes --path .docs/sdd --version <X.Y.Z>`** (Principio 4). La fila no lo pide, pero contar causas y casos a mano sobre una tabla de cientos de filas es lo mecánico que va a la CLI. Sale en Markdown, para pegarlo tal cual en `retro.md`, y con `--json` como los verbos de datos. Sin `debt.md`, sale con 2. Sus literales están en el delta de `cli`.
6. **`Abierta desde` se saca de la retro anterior**: la de mayor versión, por SemVer numérico, menor que `--version`, solo en carpetas `vX.Y.Z` y con la sección `## Abiertas en «Lista»`; una retro sin ella se salta. Una fila cuyo «Ítem» aparece allí hereda su valor; si no, es la versión actual. «Lista» no tiene fecha, y añadirla sería otra columna. Sin retro anterior válida, todas nacen en la actual.
7. **La identidad de una fila es su celda «Ítem» tal como está escrita**, sin normalizar, con `\|` y enlaces incluidos. Un «Ítem» editado cuenta como cerrada la vieja y nueva la otra: es barato y se ve en la tabla, y normalizar textos daría falsos iguales. Dos «Ítem» idénticos heredan el mismo valor. «Cerrada» es todo «Ítem» de la retro anterior que ya no está abierto en «Lista», sea por saldarse o por moverse a otra sección.
8. **Entrada única a «Propuestas»**: (a) una causa con dos o más filas abiertas con «Destino» `sin fila`, o una fila `sin fila` con dos o más casos: una fila de propuesta por causa, con un solo cambio concreto; (b) una fila cuyo `Abierta desde` es anterior a la versión de la retro anterior, tenga o no destino: `prioriza o descarta`, la regla de «arrastrado dos veces» de `feedback-template.md`. Una fila con destino y sin arrastre ya está decidida y no entra.
9. **Peldaños de la salida**, de la 0131: chequeo → `CLAUDE.md` u `operations.md` → norma del revisor → skill. Concreto yo: «norma del revisor» es el artículo de calidad de la constitution, el que recibe el eje Código; sin ese artículo, el peldaño no aplica. El último peldaño invoca `sdd-agent-writing`. **Un documento desmentido se corrige en ese mismo documento**, no en un peldaño (Art. XI). La frontera con el paso de aprendizajes: un aprendizaje es algo nuevo que se supo; una señal es algo que ya debía estar resuelto y costó en la sesión.
10. **La línea del cierre va en un hueco de la plantilla** (Art. II, elemento omitido): `Retro: <señal> → <salida> (<fichero>)` o `Retro: sin señales`, en §5 de `walkthrough-template.md`.
11. **Una señal cuya causa es una skill o una plantilla del kit va al ticket**, no al proyecto: `Retro: <señal> → ticket del kit: <qué desmiente>`. La skill no edita el kit desde un proyecto. La línea conserva el hallazgo aunque se rechace el ticket, y la oferta del paso 8 de `sdd-archive` la nombra. **En este repo**, donde el proyecto es el kit, va igual al ticket: lo tría la sesión de `develop` (regla 6 de `CLAUDE.md`).
12. **`kit-feedback` no cambia, y me desvío de la 0131**, que la lista como «señales comunes con la retro». No hay fallo medido que pida tocar `sdd-feedback`, y su tope no da para líneas sin RED (Art. I).
13. **Salida si el destino no cabe: la regla va en el paso de aprendizajes de `sdd-archive`, no en `sdd-retro` como dice la fila.** Los dos casos de la fila son aprendizajes, y una regla lejos de su paso es la causa que este mismo trabajo mira. `sdd-retro` remite a ella. La regla es la de la fila: una regla de una skill con batería va a su procedencia; si no, sale la pieza más vieja que ya vive en otro sitio; si no hay, se pregunta (en `unattended`, va a «Por triar»). El walkthrough dice dónde fue.
14. **Las tres filas de «regla lejos de su paso» (workspace, anuncio de `sdd-propose`, prompt de arranque) no se saldan.** La 0277 no las arregla: su fila dice que el repaso «mira si siguen abiertas». Pasan a `**Actuar** → sin fila`, con su causa y su arreglo, para que `roadmap check` no avise de un destino ya cerrado y el primer repaso las vea. Las otras dos filas que apuntan a la 0277 (la plantilla huérfana y el destino que no cabe) sí se saldan.
15. **El repaso solo lee `debt.md` (3.0.0).** `sdd-end-release` ya para ante la forma 2.x, y este repo migra en la 0198, antes de cortar. Este cierre, por tanto, no puede correr el repaso sobre la deuda real del repo: la prueba es el molde.
16. **`aprendizajes-skills.md` conserva su nombre** aunque pierda la revisión de skills. Renombrarlo solo daría churn en enlaces. Cambia el título.
17. **Tope de `sdd-retro`**: 700 palabras en total, en el `SKILL.md`, sin `references/`: se lee entera en cada cierre.
18. **`retro.md` es el repaso más una parte opcional**, y «retro pedida» es solo esa parte. El requisito «La retro es opcional» se renombra, porque su título ya no sería cierto.
19. **El repaso corre al final del paso 5 de `sdd-end-release`**, tras caducar la deuda y sacar lo saldado, y `retro.md` entra en el commit del corte, antes del merge y el tag. Con una deuda sin filas triadas el verbo dice `Sin deuda triada` y no hay `retro.md` por el repaso: una carpeta con tablas vacías no tiene lector.
20. **Reglas de `cli` y `archive`**: sus literales van en los requisitos nuevos, sin tocar sus «Reglas de la capacidad». Esas entradas se sustituyen enteras y son largas, y copiarlas por una cláusula arriesga perder texto al fusionar.
21. **Repaso de coherencia**: `sdd capability merge` sobre una copia de `.docs/sdd` sale con 0 y fusiona el delta de las cinco capacidades; el repo no cambia.
- Política de modelos: revisores de la spec ya corridos (dominio en Opus, técnica en Sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura sonnet+high · sujetos de las baterías en Sonnet, uno tras otro (`MAX_PARALLEL=1`) · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado** — Una propuesta sin fila no llega a nadie, y renace en cada corte (Crítico de dominio) → decisión 4 y requisito nuevo de `planning`, con su escenario `m7`.
- **Aceptado** — La identidad por «Ítem» sin definir y sin fixture (Crítico de técnica) → decisión 7 y un GIVEN con `a \| b [x](y)`.
- **Aceptado** — Retro intermedia ausente, retro sin tabla, comparación de versiones → decisión 6 y escenarios en `cli`.
- **Aceptado** — Orden sin desempate → delta `cli`.
- **Aceptado** — Orden del repaso dentro del corte → decisión 19 y un `AND`.
- **Aceptado** — «Se repite» contra «Sin propuestas», filas con destino → decisión 8.
- **Aceptado** — Carpeta con `debt.md` vacío, sin aserción positiva → decisión 19 y delta `release-flow`.
- **Aceptado** — «La retro es opcional» desmentida por su título → decisión 18, `REMOVED` + `ADDED`.
- **Aceptado** — Señal del kit perdida si se rechaza el ticket → decisión 11 y `r3`.
- **Aceptado** — Documento desmentido fuera de su sitio, constitution sin artículo de calidad, frontera con aprendizajes → decisión 9.
- **Aceptado** — `--project-root`, `--version` mal formada, `closedSinceLast` sin retro → delta `cli`.
- **Aceptado** — Comprobar «no pregunta» → el `r4` corre con `unattended`.
- **Aceptado** — El 🦆 no cuadraba con el molde, y la «feature 0082» chocaba con un patch de `archive` → corregidos.
- **Aceptado en parte** — Reglas de las capacidades → `project-retro` las declara con sus literales y tope; `cli` y `archive`, en sus requisitos (decisión 20).
- **Rechazado** — Fila sin «Causa» u «Origen» vacío → `sdd roadmap check` ya los rechaza, y el corte lo corre antes en ese paso.

## Intent

Hoy la mejora del entorno depende de una pregunta abierta: «abre `.claude/skills/` y decide». Pide mirar una carpeta y siempre apunta a la salida más cara, una skill, aunque baste una línea en `operations.md` o un test. Y la deuda se ve fila a fila: el dev-lead lo llamó «muy miope» el 2026-10-28. El triaje de la 0276 ya deja la causa en cada fila, pero nadie la lee en conjunto.

El éxito: un cierre con una corrección repetida acaba en la salida más barata con una línea en el walkthrough; uno sin señales, en una línea y nada más; y cada corte deja una tabla por causa con lo abierto y lo repetido, y una propuesta por grupo. Fracasaría, aunque funcione, si el agente inventa señales para rellenar, si crea skills por defecto, o si el repaso retiene el corte.

## Scope

- Entra:
  - `skills/sdd-retro/SKILL.md` y `tests/batteries/sdd-retro/` (batería, `subject.mjs` y molde).
  - `skills/sdd-templates/templates/retro-template.md`; se borra `feedback-template.md`; `skills/sdd-templates/SKILL.md` (índice y `description`).
  - `skills/sdd-templates/templates/walkthrough-template.md`, §5: el hueco `Retro:`.
  - `skills/sdd-archive/SKILL.md`, paso 3, red flag y racionalización; `skills/sdd-archive/references/aprendizajes-skills.md`, sin su paso 5.
  - `skills/sdd-end-release/SKILL.md`, pasos 1 y 5, y su red flag; se borra `skills/sdd-end-release/references/retro.md`.
  - `skills/sdd-roadmap/SKILL.md:99`: lee «Propuestas» y los action items de `retro.md` en lugar de `feedback.md`, sin cambio de saldo, con su escenario `m7` en `tests/batteries/sdd-roadmap/`.
  - `skills/sdd-archive/SKILL.md`, paso 8: la oferta del ticket nombra la señal del kit.
  - `cli/src/roadmap/` (`causes.ts`, `debt.ts`, `verbs.ts`), su registro y `cli/test/roadmap/causes.test.ts`.
  - `cli/test/kit/word-budget.test.ts`: el tope de `sdd-retro`.
  - `tests/batteries/sdd-archive/battery.md`: rúbrica `P3` y escenario `c1`.
  - Documentos que nombran lo que cambia: `README.md`, `CLAUDE.md`, `.docs/sdd/mission.md`, `.docs/sdd/architecture.md`, `.docs/workflow/usage-guide.md`.
  - `.docs/sdd/roadmap.md`: las cinco filas de deuda de la decisión 14 y la fila 0277.
- No entra:
  - Crear filas de deuda o de roadmap desde el repaso (decisión 4).
  - `sdd-feedback` y `kit-feedback` (decisión 12).
  - Arreglar las tres filas de «regla lejos de su paso» (decisión 14).
  - Migrar la deuda de este repo (0198), ni la forma 2.x en el repaso (decisión 15).
  - Una migración: `retro.md` ya vivía en esa ruta, y la plantilla la traza el kit.
  - «sus cinco pasos» de `release-flow`: es de la 0152.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `feedback-template.md` | `skills/sdd-templates/SKILL.md:25`; `skills/sdd-end-release/references/retro.md:3`; el fichero | Scope; decisión 1 |
| «release feedback» | `description` de `skills/sdd-templates/SKILL.md:3` | Scope: pasa a «release retro» |
| `feedback.md` | `skills/sdd-roadmap/SKILL.md:99`; `.docs/sdd/mission.md:48`; `capabilities/release-flow.md`, «El cierre no procesa…» | Scope; `release-flow` queda: dice que el corte no escribe ese fichero |
| «acta + triage» y «Acta de release» | `.docs/sdd/mission.md:45,48` | Scope: `mission.md` deja de prometerlos |
| «La retro, si la pides» | `README.md:114`; `.docs/workflow/usage-guide.md:189` | Scope: el repaso va siempre, y la estimación, si la pides |
| `references/retro.md` | `skills/sdd-end-release/SKILL.md:26` | Scope; su texto va a `sdd-retro` |
| Paso «skills review» | `skills/sdd-archive/SKILL.md:40`; `aprendizajes-skills.md:9-11` y su título | Scope; delta `archive`, `MODIFIED` |
| «hace la revisión de skills» | `capabilities/archive.md:14-15`; `tests/batteries/sdd-archive/battery.md:110` (`P3`) | Delta `archive`, `MODIFIED`; Scope |
| «las 21 skills» | `CLAUDE.md:22` | Scope: 22 |
| Lista de verbos | `capabilities/cli.md:13` | Delta `cli`, `MODIFIED` |
| «La retro es opcional»; «La carpeta de la release…» | `capabilities/release-flow.md` | Delta `release-flow`, `MODIFIED` |

Reglas de lo que se retira (Art. I):

| Regla retirada | Dónde vive ahora | Por qué se descarta |
| --- | --- | --- |
| Paso 5: abre `.claude/skills/` y decide | Señal `documento o skill desmentido` de `sdd-retro` | — |
| «Reveló un patrón reutilizable (nueva skill)» | Último peldaño de la salida | — |
| «Si no tiene skills, quizá esta feature crea la primera» | — | Empuja a la salida más cara sin señal: es lo que la 0131 corta |
| Red flag «you haven't opened `.claude/skills/`» | — | Sin señal, no hay nada que abrir |
| Racionalización «This project has no skills, I skip that step» | Red flag nueva: «write the `Retro:` line without walking the signals» | Cambia con el paso |
| `retro.md`: agregado, qué corregir, action items, comprobar los anteriores | `sdd-retro`, pasada `release`, y `retro-template.md` | — |
| `feedback-template.md` §1 y §2 | `sdd-roadmap`, desde la 0063 | Nadie las escribe |
| Racionalización «The retro from memory» | Se queda en `sdd-end-release` | — |

**Una pieza entra, otra sale**: entran `sdd-retro` y `retro-template.md`; salen `feedback-template.md`, `references/retro.md` y el paso de revisión de skills.

- Filas que implementa: 0277 → se marca ✅ en `.docs/sdd/roadmap.md:112` al cerrar. La nombran también 0198 y 0152 («tras»), que quedan, y 0151 («partida»), que queda. Filas de deuda con `Actuar → 0277`: líneas 235 y 354 → `saldada`; líneas 262, 284 y 539 → `**Actuar** → sin fila` (decisión 14). Comprobado con `grep -n 0277 .docs/sdd/roadmap.md`, y `grep -rn 0277 skills capabilities` no da nada.

## Approach

Tres tasks: el verbo con sus tests; `sdd-retro` con su batería y el paso de `sdd-archive`; y `sdd-end-release`, la plantilla y los documentos. Las reglas nuevas de la skill van con su RED antes de escribirlas (Art. I), y una que el baseline no pida sale.

## Dónde se prueba

- `roadmap causes`: `cli/test/roadmap/causes.test.ts`, como los de `debt.test.ts`, con un `debt.md` y una retro anterior.
- `retro-template.md` calcada con la salida del verbo se relee como retro anterior: el mismo fichero (un verbo que lee un artefacto se prueba contra su plantilla).
- Señales y peldaño: `r1` de la batería de `sdd-retro`, 2 sujetos.
- Sin señales, una línea: `r2`, 2 sujetos.
- Señal del kit, al ticket: `r3`, 1 sujeto.
- Repaso y propuestas: `r4`, 2 sujetos en `unattended`, con la plantilla y el verbo.
- `sdd-roadmap` lee las propuestas: `m7`, 1 sujeto.
- El destino no cabe: `c1` de la batería de `sdd-archive`, 2 sujetos.
- Control de no regresión: `a1` (una feature pasa por `sdd-retro`) y `a2` (un patch no) de `sdd-archive`; `rc1` (el corte llama al repaso y sigue).
- Skills y plantillas: `cli/test/kit/skills.test.ts` y `word-budget.test.ts`, ya existentes.

## Términos y ADR

- Términos resueltos: **señal** — uno de los cuatro hechos observados en la sesión que justifican cambiar el entorno; **peldaño** — cada salida posible, de la más barata a la más cara; **repaso por causa** — la tabla por causa y las propuestas de `retro.md`; **retro pedida** — la parte de estimación y action items de `retro.md`; **arrastrada** — abierta desde antes de la retro anterior. Se evita **acta** para la retro.
- ADR candidatas: ninguna. Todo se deshace barato.

## Delta de comportamiento

### Capacidad: `project-retro`

#### ADDED — El cierre de una feature busca señales y arregla con la salida más barata

- GIVEN el cierre de la feature 0081, en cuya sesión el dev-lead corrigió dos veces «los tests se lanzan con `npm run test:unit`», y `operations.md` dice `npm test`
- WHEN `sdd-archive` llega a `sdd-retro`
- THEN nombra la señal `corrección repetida`, corrige `operations.md` y escribe en §5 del walkthrough `Retro: corrección repetida → operations.md (comando de los tests unitarios)`
- AND no crea ninguna skill
- AND las señales son `corrección repetida`, `búsqueda a ciegas`, `documento o skill desmentido` y `error que cazaría un chequeo`
- AND de cada señal elige el primer peldaño que la resuelve, por este orden: un chequeo (test, lint o hook), `CLAUDE.md` u `operations.md`, la norma del revisor (el artículo de calidad de la constitution, si lo tiene) y una skill, esta con `sdd-agent-writing`
- AND un documento desmentido se corrige en ese mismo documento
- AND si la salida no cabe en su documento, aplica la salida del paso de aprendizajes de `sdd-archive`

#### ADDED — Sin señales, el cierre deja una línea

- GIVEN el cierre de la feature 0084, sin correcciones repetidas, búsquedas a ciegas, documentos desmentidos ni errores que un chequeo cazaría, en un proyecto sin `.claude/skills/`
- WHEN `sdd-archive` llega a `sdd-retro`
- THEN escribe en §5 del walkthrough `Retro: sin señales` y no cambia ningún otro fichero
- AND no crea `.claude/skills/`

#### ADDED — Una señal causada por el kit va al ticket

- GIVEN el cierre de la feature 0083, en cuya sesión un paso de `sdd-implement` del kit cargado dio un comando que ya no existe
- WHEN `sdd-archive` llega a `sdd-retro`
- THEN escribe `Retro: documento o skill desmentido → ticket del kit: <el comando que ya no existe>` y no edita la skill del kit
- AND la oferta del ticket de `sdd-feedback` nombra esa señal, y la línea queda aunque se rechace la oferta

#### ADDED — Cada corte deja un repaso de la deuda por causa

- GIVEN un `.docs/sdd/steering/debt.md` cuya «Lista» tiene «El anuncio sale 4 de 6» (`regla lejos de su paso`, 2 casos, «Destino» `sin fila`), «El prompt sale sin su forma» (`regla lejos de su paso`, 1 caso, `sin fila`) y «`--planta 2` lista otra planta» (`defecto del producto`, 1 caso, `0030`), y un `.docs/sdd/releases/v1.3.0/retro.md` que da «El anuncio sale 4 de 6» abierta desde `1.2.0`
- WHEN `sdd-end-release` corta la 1.4.0
- THEN `.docs/sdd/releases/v1.4.0/retro.md` existe, calcado de `retro-template.md`, con la salida de `sdd roadmap causes --path .docs/sdd --version 1.4.0` sin tocar
- AND «Propuestas» lleva una fila para `regla lejos de su paso`, con esas dos filas y un solo cambio concreto, y `prioriza o descarta` para «El anuncio sale 4 de 6», arrastrada desde la `1.2.0`
- AND el corte no escribe en `debt.md` ni en `ROADMAP.md` por el repaso, y su resumen nombra las propuestas
- AND en `unattended` no hace ninguna pregunta por el repaso y lo escribe igual
- AND el repaso corre tras caducar la deuda y sacar lo saldado, y `retro.md` entra en el commit del corte, antes del merge y el tag
- AND la fila de `--planta 2`, con destino y sin arrastre, no entra en «Propuestas»
- AND sin ninguna fila que cumpla la entrada, «Propuestas» dice `Sin propuestas`, sin inventar ninguna
- AND sin `debt.md`, o si el verbo dice `Sin deuda triada`, no hay repaso

#### Reglas de la capacidad — project-retro

- **Dónde viven los datos**: la línea del cierre, en §5 del walkthrough; el repaso, en `.docs/sdd/releases/vX.Y.Z/retro.md`.
- **Idioma de los nombres**: las señales, los títulos y los literales, en castellano; la capacidad y la skill, en inglés kebab-case.
- **Límites**: una línea `Retro:` por señal; una fila de «Propuestas» por causa, más una por fila arrastrada; `sdd-retro`, tope de 700 palabras (`cli/test/kit/word-budget.test.ts`).
- **Avisos**: `Retro: <señal> → <salida> (<fichero>)` · `Retro: <señal> → ticket del kit: <qué desmiente>` · `Retro: sin señales` · `Sin propuestas` · `prioriza o descarta`.
- **Regla ante conflicto**: entre rellenar y no inventar, manda `Retro: sin señales` y `Sin propuestas`. Decidir una propuesta es de `sdd-roadmap` y del dev-lead, no del corte.

### Capacidad: `archive`

#### MODIFIED — El cierre de una feature y el de un patch van por la misma skill

- GIVEN la rama `feature/0081-booking-reminders` con su `spec.md` aprobada y todas sus tasks hechas, y la rama `patch/0082-slot-overlap` con su `patch.md` y el fix commiteado
- WHEN se cierra cada una
- THEN las dos se cierran con `sdd-archive`
- REMOVED AND el cierre de la 0081 escribe `walkthrough.md`, actualiza `tasks.md` y hace la revisión de skills
- AND el cierre de la 0081 escribe `walkthrough.md`, actualiza `tasks.md` y pasa por `sdd-retro`
- REMOVED AND el cierre de la 0082 no escribe `walkthrough.md`, no toca `tasks.md` ni hace la revisión de skills: completa `patch.md` y su fila del roadmap
- AND el cierre de la 0082 no escribe `walkthrough.md`, no toca `tasks.md` ni pasa por `sdd-retro`: completa `patch.md` y su fila del roadmap

#### ADDED — Un aprendizaje cuyo destino no cabe tiene salida

- GIVEN el cierre de una feature con el aprendizaje «la suite lenta necesita `--maxWorkers 8`», cuyo destino `tech-stack.md` está en su tope de palabras, y un pre-commit que lo comprueba
- WHEN se vuelca el aprendizaje
- THEN sale de ese documento la pieza más vieja que ya vive en otro sitio, y el aprendizaje entra
- AND una regla de una skill con batería (`tests/batteries/<skill>/`) va a la procedencia de esa batería
- AND si no hay pieza que salga, pregunta; en `unattended`, va a «Por triar» de la deuda
- AND el tope no sube y el commit no se salta el hook
- AND §5 del walkthrough dice dónde fue el aprendizaje

### Capacidad: `release-flow`

#### MODIFIED — La carpeta de la release existe solo si tiene contenido

- REMOVED GIVEN `release.hasRecipient: false` y un cierre sin retro
- GIVEN `release.hasRecipient: false`, un proyecto sin filas triadas en `.docs/sdd/steering/debt.md`, o sin ese fichero, y un cierre sin retro pedida
- WHEN termina `sdd-end-release`
- THEN no se exige que exista `.docs/sdd/releases/vX.Y.Z/` ni se crea vacía
- REMOVED AND con destinatario o con retro, la carpeta sigue siendo obligatoria
- AND con destinatario, con filas triadas en `debt.md` o con retro pedida, la carpeta sigue siendo obligatoria
- AND con `release.hasRecipient: false` y una fila en «Lista» de `debt.md`, existe `.docs/sdd/releases/vX.Y.Z/retro.md`

#### REMOVED — La retro es opcional

- motivo: `retro.md` lleva ahora un repaso que corre siempre; lo opcional pasa a «La estimación y los action items de la retro son opcionales»

#### ADDED — La estimación y los action items de la retro son opcionales

- GIVEN un proyecto con `.docs/sdd/estimation-log.md`
- WHEN `sdd-end-release` propone la versión en el paso 1
- THEN la misma propuesta ofrece la estimación y los action items de la retro en una línea, sin pregunta aparte
- AND solo se escriben si el usuario los pide, en `.docs/sdd/releases/vX.Y.Z/retro.md`, y no retienen los demás pasos
- AND sin `estimation-log.md` no se ofrecen
- AND el repaso por causa de esa retro no se ofrece: corre sin preguntar ([`project-retro`](project-retro.md))
- AND pedidos sin `debt.md`, `retro.md` lleva solo esa parte

### Capacidad: `cli`

#### MODIFIED — La CLI se ejecuta con Node y sin dependencias

- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- REMOVED THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next|claim`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start|session-end`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`, `validation serve`) con una línea de ayuda, y sale con 0
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish|causes`, `id next|claim`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start|session-end`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`, `validation serve`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

#### ADDED — `sdd roadmap causes` agrupa la deuda por causa y dice qué sigue abierto

- GIVEN el `debt.md` y la `releases/v1.3.0/retro.md` del requisito «Cada corte deja un repaso de la deuda por causa» de `project-retro`, más una fila de «En espera» con `regla lejos de su paso` y, en la retro anterior, «La fila cerrada» abierta desde `1.3.0`, que ya no está en «Lista»
- WHEN se ejecuta `node sdd.js roadmap causes --path .docs/sdd --version 1.4.0`
- THEN escribe `## Repaso por causa` y la tabla `| Causa | En espera | Lista | Descartadas |`, con `| regla lejos de su paso | 1 | 2 | 0 |` antes que `| defecto del producto | 0 | 1 | 0 |`, ordenada por «Lista» de mayor a menor y, a igualdad, por el nombre de la causa, y sale con 0
- AND después escribe `## Abiertas en «Lista»` y la tabla `| Ítem | Causa | Casos | Destino | Abierta desde |`, por `Abierta desde` ascendente y, a igualdad, en el orden de `debt.md`, con `| El anuncio sale 4 de 6 | regla lejos de su paso | 2 | sin fila | 1.2.0 |` primero y `1.4.0` en las otras dos
- AND la última línea es `Cerradas desde la 1.3.0: 1`
- AND una fila con prefijo `**[… saldada …]**` no cuenta como abierta ni en las causas
- AND un «Ítem» `a \| b [x](y)` en `debt.md` y en la tabla de la retro anterior sale igual y hereda su `Abierta desde`
- AND con `releases/v1.1.0/retro.md`, `releases/v1.10.0/retro.md`, una `releases/v1.3.0/retro.md` sin la sección `## Abiertas en «Lista»`, `releases/draft/retro.md` y `releases/v1.4.0/retro.md`, y `--version 1.11.0`, la retro anterior es la `v1.10.0`, y con `--version 1.4.0`, la `v1.1.0`, y la última línea nombra esa versión
- AND sin retro anterior válida, no hay esa línea y todas salen abiertas desde la versión dada
- AND una retro calcada de `retro-template.md` con esta salida se lee como retro anterior
- AND con `--json` escribe `{"causes":[…],"open":[…],"closedSinceLast":1}`; sin retro anterior válida, `"closedSinceLast":null`
- AND sin filas en «En espera», «Lista» ni «Descartadas» escribe `Sin deuda triada` y sale con 0
- AND sin `.docs/sdd/steering/debt.md` escribe en stderr `roadmap causes: no existe steering/debt.md` y sale con 2; sin `--version`, o con `--version 1.x`, escribe `--version debe ser X.Y.Z` y el uso, y sale con 2
- AND `--project-root D:\code\reservas` hace lo mismo que `--path D:\code\reservas\.docs\sdd`, y con las dos a la vez escribe `--path y --project-root no van juntas` y el uso, y sale con 2

### Capacidad: `planning`

#### ADDED — Preparar una release lee las propuestas de la última retro

- GIVEN `releases/v1.3.0/retro.md` con una fila de «Propuestas» para `regla lejos de su paso` y un action item `[A1]`
- WHEN el usuario pide «prepara la release 1.4: qué entra de lo que tenemos»
- THEN `sdd-roadmap` presenta en su inventario esa propuesta y ese action item, y el dev-lead decide si entran
- AND lee la retro de la última carpeta `vX.Y.Z` que tenga `retro.md`; una `feedback.md` de una release anterior no se lee
- AND sin `retro.md` el inventario sigue sin ella

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-retro/SKILL.md` | 0 / no tiene | — | 700 (`skillMd` y `total`), con el margen del 25 % del test |
| `skills/sdd-archive/SKILL.md` | 4.792 / 4.900 (3.920 + 25 %) | 108 | sin cambio: lo que entra lo pagan el paso, la red flag y la racionalización que salen |
| `skills/sdd-archive` (total) | 9.924 / 10.000 | 76 | sin cambio: sale el paso 5 de la referencia |
| `skills/sdd-end-release/SKILL.md` | 1.862 / 2.375 | 513 | sin cambio |
| `skills/sdd-roadmap/SKILL.md` | sin medir: saldo cero | — | sin cambio |
| `skills/sdd-templates` (total) | 16.739 / 19.650 | 2.911 | sin cambio: la plantilla nueva es más corta que la que sale |
| `.docs/sdd/mission.md` | 1.692 / 2.125 | 433 | sin cambio |
| `.docs/sdd/architecture.md` | 2.018 / 2.375 | 357 | sin cambio |

## Previsión de coste

Precio: `a9` de `sdd-archive`, estimado en 1 $ en la spec de la 0276, y los 39 sujetos de esa feature costaron 7,61 $ (0,20 $ por sujeto). Tomo 0,4 $ por sujeto de `sdd-retro`, que es el doble de esa media porque lee más molde, y 1 $ por los de `sdd-archive`. Son estimaciones, sin medir aquí.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `r1` × 2, `r2` × 1, `r4` × 2 (`sdd-retro`, con el kit sin la skill); `c1` × 2 (`sdd-archive`) | 3,6 |
| GREEN | `r1` × 2, `r2` × 2, `r3` × 1, `r4` × 2 (`sdd-retro`); `c1` × 2 (`sdd-archive`) | 4,8 |
| Una tanda de REFACTOR | `r1` × 2, `r4` × 2 | 1,6 |
| Controles | `a1` × 1, `a2` × 1, `rc1` × 1 (`sdd-archive`); `m7` × 1 (`sdd-roadmap`) | 3,4 |
| Medición tras la revisión final | `r4` × 1 | 0,4 |
| Suma | | 13,8 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo») |
