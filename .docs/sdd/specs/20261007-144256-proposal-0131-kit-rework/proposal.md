---
id: 20261007-144256-proposal-0131-kit-rework
proposal: 0131
title: Rework del kit — carriles diseñados de cero, sin superpowers
source: interview
created: 2026-10-07
---

# Propuesta — Rework del kit: carriles diseñados de cero, sin superpowers

## Por qué

Los carriles del kit se construyeron reaccionando a carencias y nunca se diseñaron de cero. El resultado es un kit que depende de superpowers y lo corrige con overrides, con skills de 8.000 palabras de paso a paso, documentos que crecen sin fin (`tech-stack.md` y `roadmap.md` hacen de cajón) y dos fricciones repetidas en campo: el revisor final con re-revisiones sin tope (~25 tickets) y la validación (~18). La crítica de referencia al SDD (Böckeler, martinfowler.com, 2025-10-15) es la misma: un flujo para todo, demasiado markdown que revisar y un agente que ignora la spec igualmente. La 3.0.0 rediseña los carriles con un compromiso explícito: **la ceremonia tiene que pagarse con calidad y velocidad**. El kit pasa a ser un fork propio (lo mejor de superpowers, OpenSpec y mattpocock/skills, todas MIT), sin comportamiento nuevo para el usuario: mejora cómo hacen los carriles lo que ya hacen.

## Principios

1. **Cada pieza de ceremonia nombra el fallo que evita, con evidencia, o sale.**
2. **La ceremonia es proporcional al cambio.**
3. **Lo que revisa la persona es corto; lo que lee el agente lleva índice y rutas.** No se guarda lo que se lee barato del código.
4. **Lo mecánico va a la CLI; el texto queda para el juicio.**
5. **Se mide si la ceremonia se paga:** además de horas y dólares, las vueltas (rondas de fix, re-revisiones, validaciones rechazadas).

## Reglas de negocio

### Marco y carriles

- **Cinco acciones por cambio, no fases**: explore, propose, implement, verify, archive; se puede volver de implement a propose: una task descubre que la spec pide un campo que el modelo no tiene → acción «update»: se corrige la spec en su sitio con una línea en «Enmiendas», se marcan las tasks afectadas y se vuelve a implement; la parada de aprobación del desvío se queda.
- **Explore** (evolución de `sdd-consult`) no deja artefactos: «¿se puede exportar a PDF con la librería actual?» → respuesta en el chat, o el prompt de arranque de un cambio.
- **Cinco carriles con una sola entrada (propose)**: config, patch, lite, feature y **spike**. Spike = investigación que deja `research.md` con evidencia; explore = pensar sin artefactos. «¿Aguanta el repintado diez publicaciones seguidas?» con tabla de medidas → spike; «¿se puede?» en el chat → explore.
- **Ceremonia asimétrica**: propose investiga barato, clasifica con los predicados del kit y lo anuncia; full y spike siguen (la spec es su parada); patch, lite y config preguntan; solo sube, nunca baja: el agente clasifica «ajustar el texto del botón» como patch → pregunta; clasifica «permisos por rol» como feature → lo anuncia y sigue hasta la spec.
- **Carril que trae la petición**: si el prompt dice «patch: …» y al investigar concuerda, no pregunta; si cree que es lite o feature, pregunta.
- **Prompt de arranque del kit**: lo dan explore y roadmap con rama, worktree, carril, fila del roadmap, enunciado y las decisiones ya tomadas: el dev-lead pega el prompt en un worktree de Orca → propose no repite la entrevista.
- **delegate** es un perfil de control, no un carril.

### propose

- **La spec empieza por 🦆 y ✋**: un párrafo llano de qué y cómo (lo escribe `sdd-rubber-duck` en modo corto), y la lista exhaustiva de lo que el agente decidió sin el dev-lead; cada decisión de la spec sale de la entrevista, del roadmap o del agente, y las del agente van todas a ✋: la spec fija un tope de 50 filas que nadie dijo → está en ✋; el revisor de la spec lo marca como hallazgo si no está. La misma forma va en la validación final (los rulings de la implementación). No crea paradas: va donde el perfil ya para, o al mensaje final.
- **«Dónde se prueba»** en la spec: «cancelar reserva: por el endpoint, como los tests de reservas actuales; la pantalla, con una captura»; el implementador no lo cambia sin desvío.
- **Plan con tasks verticales y dependencias**: T1 «cancelar sin penalización (BD + API + UI + test)», T2 y T3 bloqueadas por T1; sin paralelo en la 3.0.0.
- **`sdd-grilling` contrasta el lenguaje** con el glosario y con el código: «tu glosario define *cancelación* como X, pero pareces decir Y» → término canónico; devuelve términos resueltos y candidatas a ADR.
- **Spike**: spec corta (pregunta, objetivos medibles, qué decisión desbloquea); tasks con «Evidencia» en vez de RED; en rendimiento, tabla de aguante (≥ 10 repeticiones con la peor carga que confirma el dev-lead y el recurso acumulado).

### implement

- **Native y SDD con `execution: auto`**; el método se elige por juicio con factores nombrados (dependencia entre interfaces, cuántas tasks, coste de un error, ¿cabe el plan en un contexto?), sin umbral numérico; cada task cabe en un contexto nuevo; se mantiene el rescate tras compactar; el walkthrough apunta si compactó.
- **TDD**: base de superpowers (ley de hierro, refactor dentro del bucle) + costuras pactadas y antipatrones de Matt (test tautológico, test acoplado a la implementación).
- **Decálogo de calidad** (~20-30 líneas de los cinco libros) en el encargo del implementador, junto al artículo de calidad del proyecto, que manda.

### verify

- **Revisión final en tres ejes, en paralelo**: Spec (Opus), Código (Sonnet: artículo de calidad del proyecto, Clean Code, olores de Fowler y los 12 de Matt, Ousterhout, Pragmatic) y Arquitectura (Opus, solo si el diff toca fronteras: Clean Architecture). Un eje baja a Sonnet solo con datos del principio 5.
- **Cierre de la revisión**: una tanda de fixes, una re-revisión acotada, lo residual se adjudica y va a ✋; sin segunda tanda: en la 0128 hubo tres re-revisiones encadenadas (~5 M tokens) → ahora, una.
- **Comentarios**: los que citan documentos (spec, task, constitution) los detecta la CLI; los que repiten el código son Important del eje Código.
- **Spike**: el eje Spec contrasta el research con la evidencia: objetivo → medido / no medido / no cumple; la recomendación solo cita lo medido.

### archive

- **`sdd-archive` funde el cierre de feature y de patch** (84 % común) y `finishing-a-development-branch`, con ramas cortas por carril; la batería mide que un patch no hereda pasos de feature.
- **Tras integrar la base**, la suite completa (E2E incluidos si `operations.md` los declara) corre sobre el resultado integrado.
- **Escribe las ADR** que la spec listó, y **revisa qué filas de deuda salda** el diff.
- **Lo hecho** queda en Now hasta cortar la release; entonces sale al changelog.
- **`sdd-retro`** sustituye a la revisión de skills del cierre: solo con señales (corrección repetida, búsqueda a ciegas, documento o skill desmentido, error que cazaría un chequeo); salida más barata primero: chequeo → `CLAUDE.md`/`operations.md` → norma del revisor → skill. Sin señal, una línea.

### Documentos

- **Una pregunta por documento**: `PRODUCT.md` ¿para quién y para qué? (y la terminología); `operations.md` ¿cómo se ejecuta y se verifica?; `architecture.md` ¿cómo está montado?; ADR ¿por qué?; `capabilities/` ¿qué hace?. Los de estado se reescriben, nunca se les añade.
- **Ubicación por lector**: raíz en mayúsculas `PRODUCT.md` (compartido con impeccable, que solo lo lee en la raíz), `ROADMAP.md`, `CHANGELOG.md`; el resto en `.docs/sdd/` en minúsculas: `steering/` (constitution, operations, architecture, debt, estimation), `decisions/`, `capabilities/`, `changes/` (antes `specs/`), `releases/`.
- **`tech-stack.md` → `operations.md`**: comandos, testing, frontend y entornos; sin versiones (están en los manifests); el README enlaza, no duplica.
- **ADR con MADR 4.0.0 mínima** + `status`, `date`, *Confirmation* y un campo propio `rutas`; se ofrecen solo si son difíciles de deshacer, sorprenden sin contexto y hubo una alternativa real (Matt); inmutables, se sustituyen; un índice por la CLI cruza `rutas` con los ficheros del cambio: `0007-use-powershell-scripts.md` cubre `skills/**/scripts/**` → la lee quien toca un script.
- **`ROADMAP.md` Now / Next / Later**: tabla Id | Externo (Jira, Azure DevOps, GitHub) | Tarea (**título**, *one-liner llano*, brief plegado) | Estado | Tras | Tamaño; prioridad = orden de filas; el brief es la fuente del prompt de arranque.
- **`debt.md` con triaje**: por triar / en espera / lista / descartada; nada pasa a lista sin reproducir o un 2.º caso; una fila en espera caduca tras dos releases sin 2.º caso; las descartadas, con motivo, a una lista de descartes.
- **Constitution corta**: un artículo = una regla con su porqué en una frase; la historia, a ADR; los cinco principios como preámbulo; `CLAUDE.md` la enlaza.
- **Fuera el changelog de cliente y el email**; se quedan las release notes en `releases/`.

### Proyecto, herramientas y distribución

- **`sdd-init`** funde greenfield y brownfield; **`sdd-upgrade`** aplica las migraciones (el hook la ofrece, no migra sin preguntar); lo determinista, a la CLI.
- **CLI `sdd` en Node** (JS plano, `node:test`, sin dependencias, sin UI interactiva) dentro del plugin: absorbe los 12 scripts PowerShell y los bash heredados de superpowers; todo el código del kit en Node (hook incluido).
- **`sdd-agent-writing`, una skill para escribir para agentes** (forma de `writing-for-agents` de Matt): estilo + anexo de mecánica de skills + anexo de prueba (ligera en proyectos, RED/GREEN en este repo); puerta «quiero una skill para las migraciones SQL», y la invocan retro, roadmap y el prompt de arranque.
- **`sdd-rubber-duck`** (B13, entra por decisión del dev-lead, 2026-10-07, ampliando el alcance): explicar en llano. Modo corto: el 🦆 de cada parada lo escribe `sdd-rubber-duck` (una sola forma de explicar). Modo largo, a petición: «explícame cómo viaja una exportación de punta a punta» → explicación por pasos en lenguaje llano, con el glosario del proyecto.
- **Distribución solo como plugin de Claude Code**; fuera `npx skills add`; superpowers sale de los proyectos y de este repo.
- **Vigilancia de fuentes**: cada fuente con versión en `THIRD_PARTY_NOTICES.md`; en cada release, `sdd sources check` → filas de deuda «por triar».

### Pruebas (Art. I)

- **Batería completa** en la entrada, propose, verify y archive; **humo** (1-2 escenarios, n = 1) en todas las skills; antes de cada release, las dos.
- **A/B puntual** solo ante una duda concreta; **tendencia de vueltas** en cada cierre de release; cada fallo de campo pasa a escenario.
- **Tests deterministas skill ↔ CLI** (docs-claims de OpenSpec); se evalúa `claude plugin eval` como sustituto del arnés propio.

### Release

- **De golpe, con git-flow**: las features van a `develop`; los hotfix 2.3.x nacen de `main`; `release/3.0.0` se corta al final con una beta de 1-2 semanas en un proyecto real, migración incluida. Los proyectos migran una vez.

## Capacidades que toca

- `routing` — entrada única, carriles y ceremonia asimétrica.
- `feature-flow` — se parte por acción: propose, implement, verify, archive (nombres al hacer cada feature).
- `interviewing` — contraste de lenguaje.
- `capabilities` — ubicación nueva.
- `roadmap` y `planning` — Now / Next / Later, brief y triaje de la deuda.
- `release-flow` — cierre de release con caducidad, tendencia y vigilancia; sin changelog de cliente.
- `onboarding` y `migration` — `sdd-init` y `sdd-upgrade`.
- `kit-feedback` — señales comunes con la retro.
- `decisions` (nueva) — ADR.
- `project-retro` (nueva) — mejora del entorno del proyecto.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0142 | Constitution nueva: principios, Art. IX (fork), I (pruebas), XI (ADR); ADR iniciales del kit | — |
| 2 | 0143 | CLI `sdd` en Node: los 12 scripts, los bash heredados y el hook, con sus tests; evaluar `claude plugin eval` | 0142 |
| 3 | 0144 | Documentos y migración: estructura nueva, plantillas, `sdd-init`, `sdd-upgrade` y migración v3.0.0 | 0143 |
| 4 | 0145 | `sdd-rubber-duck`: explicar en llano, modo corto (el 🦆 de las paradas) y modo largo (B13; base: teach y wait-what de Matt) | 0144 |
| 5 | 0146 | Entrada, explore y propose: carriles con spike, ceremonia asimétrica, prompt de arranque, spec con 🦆 ✋ y «Dónde se prueba», grilling, acción update | 0145 |
| 6 | 0147 | implement: fork de executing-plans, SDD, TDD, debugging, worktrees y parallel-agents; decálogo de calidad | 0146 |
| 7 | 0148 | verify: tres ejes, cierre de la revisión, los cinco libros, chequeo de comentarios | 0147 |
| 8 | 0149 | archive: cierre único, ADR, deuda saldada, suite sobre la base integrada | 0148 |
| 9 | 0150 | Proyecto: roadmap (Now / Next / Later, triaje), release, config y feedback | 0144 |
| 10 | 0151 | `sdd-retro` y `sdd-agent-writing` | 0149 |
| 11 | 0152 | Coherencia de todos los documentos, humo de todas las skills y batería entera de release | 0150, 0151 |

Filas absorbidas (se saldan con la feature que indica; su texto es requisito de esa feature): 0097 (0146, 0144), 0108 (0148), 0093 (0144), 0122 (0144), 0034 (0144), 0045 (0143, 0152), 0007 (0147), 0048 y 0047 (0149), 0049 (0143), 0054 (0143, 0147), 0130 (0146, 0149), 0121 (toda la propuesta; la congelación sigue hasta la 3.0.0). A Later: 0022.

## Acta

No aplica: entrevista del lienzo 0131 con el dev-lead, 2026-10-05 a 2026-10-07 (47 decisiones registradas).

## Enmiendas

- 2026-10-08 — Reparto: 0146 «Entrada, explore y propose» en una feature → partida al arrancarla en tres: 0146 (spec y plan de propose: 🦆 ✋, «Dónde se prueba», acción update, tasks verticales, revisor de dominio, gate de la spec con `AskUserQuestion` y contraste de lenguaje de `sdd-grilling`), 0160 (entrada única con cinco carriles, ceremonia asimétrica y spike; salda la parte de propose de la 0130) y 0161 (explore y prompt de arranque), en cadena 0146 → 0160 → 0161, y la 0147 pasa a ir tras la 0161; unas 11 tasks en siete superficies — pedido por el dev-lead al arrancar la 0146 — re-parte: 0146, 0160, 0161
- 2026-10-08 — Reparto: 0144 «Documentos y migración» en una feature → partida al arrancarla en tres: 0144 (estructura, plantillas y rutas de la CLI), 0156 (`sdd-init`, salda 0093, 0034 y la pregunta de §Testing de la 0097) y 0157 (`sdd-upgrade` y migración v3.0.0, salda 0122), en cadena 0144 → 0156 → 0157; unas 8 tasks en tres superficies — pedido por el dev-lead al arrancar la 0144 — re-parte: 0144, 0156, 0157
- 2026-10-08 — Prompt de arranque: contenido (rama, worktree, carril, fila, enunciado, decisiones tomadas) → forma fija en `launch-prompt-template.md` de `sdd-templates`: **título**, **base** (de qué rama sale: `develop` para una feature, `main` para un hotfix), **rama y worktree**, **carril** y **prompt** (skill que arranca, enunciado, dónde están los requisitos, decisiones ya tomadas, filas que salda, perfil y lo que hay que hacer al fusionar), redactado con `sdd-agent-writing`; lo producen explore y roadmap al pedir «dame el prompt»: «dame el prompt de la 0144» → título «0144 — Documentos y migración», base `develop`, rama `feature/0144-docs-and-migration`, carril feature y el prompt — pedido por el dev-lead — re-parte: 0146
- 2026-10-07 — Revisión de la spec: los dos revisores (dominio y técnica) en Sonnet → el modelo del revisor de dominio se elige en cada spec: la última ronda de la entrevista ofrece «revisor de dominio en Opus» con su recomendación (p. ej. Opus si la spec toca reglas de negocio o roles: «permisos por rol del gestor de cobros» → recomienda Opus; «renombrar una columna del listado» → Sonnet); si la petición o el prompt de arranque lo dice, se aplica sin preguntar; sin entrevista, Sonnet; técnica, siempre Sonnet; sin parada nueva — pedido por el dev-lead (lo usa en campo desde hace días) — re-parte: 0146
