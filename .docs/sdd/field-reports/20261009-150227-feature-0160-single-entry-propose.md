---
kit_version: 2.3.3
superpowers_version: 6.4.2
lane: feature
id: 20261009-150227-feature-0160-single-entry-propose
task: 0160
mode: full
date: 2026-10-09
---

# Ticket para el kit — feature 0160: entrada única con sdd-propose, cinco carriles y ceremonia asimétrica

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native, `validation.mode: field`
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-grilling`, `sdd-rubber-duck`, `sdd-templates`, `add-to-changelog`, `sdd-end-feature`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans`
- Proyecto: el repo del propio kit (skills en Markdown, CLI en Node, baterías de sujetos headless en Bash y Node, Pester); una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (revisor de dominio de la spec, revisor final y re-revisión), Sonnet 5.5 (revisor técnico); sujetos Sonnet 5.5, y Opus 5.5 en dos
- Coste en reloj: ~2,5 h de implementación frente a 7,5 h estimadas (más ~0,5 h de spec y plan)
- Coste en tokens: hilo 134,5 M; subagentes 7,2 M en 4 despachos; sesión 43,68 $; sujetos 31 $ en 123 (techo aprobado 64 $)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una regla de forma escrita en el paso que clasifica no sale en el mensaje que estructura otra skill

- **Qué pasó**: el anuncio de feature y spike (carril, perfil, aviso de clave local ignorada y frases de delegación) salió 0 de 6 en tres rondas de REFACTOR con la regla en el paso 2 de `sdd-propose` y en el aviso de fase. Al moverlo a la cabeza de la nota de entendimiento de `brainstorming` (paso 4) salió 2/2 y luego 2/4: se cerró en 4 de 6 con una fila de deuda.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` pasos 2 y 4; el método de escritura de reglas, en `.docs/sdd/tech-stack.md` «Baterías por skill» (sin regla previa).
- **Por qué el kit no lo evitó**: ningún sitio dice que, cuando el primer mensaje al usuario lo estructura otra skill (`brainstorming` escribe la nota de entendimiento), la regla de forma tiene que ir dentro de la instrucción de ese mensaje; el sujeto sigue la estructura de `brainstorming` y la línea del paso 2 se pierde.
- **Coste**: seis rondas del escenario `a1` (~4 $ de sujetos y ~40 min de hilo); respaldo: `tests/sdd-propose-0160-green.md` y los rulings de la Task 3 y del cierre en `specs/20261009-110857-feature-0160-single-entry-propose/tasks.md`.
- **Propuesta**: llevar el aprendizaje de `tech-stack.md` a `sdd-agent-writing` (0151) como regla: la forma de un mensaje que estructura otra skill se escribe en el punto donde se invoca esa skill, nombrando el mensaje. Y la fila de deuda del anuncio 4/6 mide si basta.
- **Verificada**: sí — `a1` 0/6 con la regla en el paso 2 frente a 2/2 con la regla en la nota de `brainstorming` (`tests/sdd-propose-0160-green.md`).
- **Criterio de aceptación**: GIVEN una petición de feature con `delegate` y una clave local ignorada · WHEN el sujeto clasifica y entra en `brainstorming` · THEN su primer mensaje lleva las cuatro líneas del anuncio en al menos 5 de 6 repeticiones.

### 2. El `estimation.md` de los proyectos contradice una regla nueva y gana

- **Qué pasó**: la estimación previa del patch salió 0/2 en `a3` (sin pregunta del carril): el `estimation.md` del molde, calcado de la plantilla vieja, decía que los patches solo registran el tiempo real, y el sujeto le hizo caso. La plantilla `estimation-template.md` decía lo mismo y no estaba en el Scope; entró por ruling. Con una frase en el paso 3 de `sdd-start-patch` («vale aunque el estimation.md del proyecto diga…») salió 2/2.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 3; `skills/sdd-templates/templates/estimation-template.md`; `skills/sdd-init-brownfield/references/migrations/` (sin nota para esta regla).
- **Por qué el kit no lo evitó**: al cambiar una regla, nada obliga a buscar el texto viejo en las plantillas que ya se calcaron en los proyectos; el plan listó los ficheros de la skill, no las plantillas que copian la regla.
- **Coste**: una ronda de sujetos de `a3` (~1 $) y un ruling de alcance; respaldo: ruling de la Task 4 y pasada de fix en `tasks.md`; commit `6824eee8`.
- **Propuesta**: en el paso del plan de `sdd-propose` (paso 5), una línea: si la feature cambia una regla que una plantilla copia al proyecto, la plantilla entra en el Scope y la migración de la versión lleva el aviso para los proyectos que ya la calcaron.
- **Verificada**: sí — `a3` 0/2 frente a 2/2 tras la frase del paso 3 (`tests/sdd-propose-0160-green.md`, pasada de fix).
- **Criterio de aceptación**: GIVEN un plan que cambia la regla de estimación de los patches · WHEN se escribe la lista de ficheros · THEN incluye `estimation-template.md` y una línea en la migración de la versión.

### 3. El pre-commit da por bueno un fichero Pester que no parsea

- **Qué pasó**: `tests/NativeDefault.Tests.ps1` se commiteó con un string sin cerrar (comillas dobles con backticks) y el pre-commit pasó: `FailedCount` no suma un contenedor que no parsea, y `kit:test-fast` sale con 0. Lo cazó `sdd task done` con `-CI`.
- **Dónde en el kit**: `.githooks/` del repo y la tarea `kit:test-fast` de moon (no son de una skill).
- **Por qué el kit no lo evitó**: el hook mira `FailedCount`, no `FailedContainersCount`.
- **Coste**: ~10 min y un commit roto en la rama (`73c04628`), juntado en el de la Task 2; respaldo: ruling de la Task 2 en `tasks.md`.
- **Propuesta**: el hook sale con error si `FailedContainersCount > 0`; ya hay fila de deuda en el roadmap.
- **Verificada**: sí — el commit `73c04628` pasó el pre-commit con el fichero roto.
- **Criterio de aceptación**: GIVEN un `.Tests.ps1` con un error de sintaxis · WHEN se commitea · THEN el pre-commit falla.

### 4. La previsión de sujetos de la spec no cuenta las rondas de REFACTOR

- **Qué pasó**: la spec preveía 78 sujetos; `SUBJECT_CAP` subió a 95 en la Task 3 y a 130 en la pasada de fix, y la campaña acabó en 123. El techo en dólares (64 $) aguantó con 31 $.
- **Dónde en el kit**: la previsión de sujetos de la spec (`skills/sdd-propose/SKILL.md` paso 4 y `skills/sdd-templates/templates/spec-template.md`); `tests/headless/run.sh`.
- **Por qué el kit no lo evitó**: la previsión cuenta RED y GREEN por escenario; una regla de forma necesita rondas de REFACTOR que no se pueden saber de antemano.
- **Coste**: dos subidas del tope por ruling (+45 sujetos, ~10 $); respaldo: rulings de la Task 3 y del walkthrough §3.
- **Propuesta**: la previsión de sujetos lleva un margen de REFACTOR (p. ej. ×1,5 sobre los escenarios de forma), y el tope de la campaña sale de ese margen.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec con reglas de forma medidas por sujetos · WHEN se escribe la previsión · THEN el tope de sujetos cubre al menos dos rondas de REFACTOR sin ruling.

### 5. La estimación cuenta en serie campañas que corren en segundo plano

- **Qué pasó**: 7,5 h estimadas y ~2,5 h reales (-67 %). La estimación tomó la 0146 como referencia y sumó las campañas al reloj; aquí corrieron en segundo plano mientras el hilo preparaba la task siguiente.
- **Dónde en el kit**: `skills/sdd-templates/templates/estimation-template.md` y el `estimation.md` del repo.
- **Por qué el kit no lo evitó**: el método no distingue el reloj del hilo del de las campañas.
- **Coste**: ninguno directo; una estimación que se pasa por tres desinforma al dev-lead sobre cuándo volver. Respaldo: walkthrough §2.
- **Propuesta**: el método de estimación cuenta las campañas de sujetos solo por la parte que el hilo espera, no por su duración.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan con campañas en segundo plano · WHEN se estima · THEN la estimación del hilo no suma su duración entera.

## Lo que hice por iniciativa propia

- Un fichero Pester propio de la pasada de fix (`tests/SingleEntry.Tests.ps1`), con los seis Important en RED antes del arreglo (9 de 9 rojos); funcionó como contrato de la pasada sin re-revisión de todo.
- Mover la evidencia de cada regla a «Procedencia de las reglas» de la batería y dejar en la skill solo la ruta: los topes de `sdd-start-feature` bajaron de 8.430 a 5.400 (`SKILL.md`) y de 20.600 a 17.400 (total).
- Un vigía en segundo plano sobre el log de la campaña de la pasada de fix, para no consultar su estado a mano.

## Funcionó, no tocar

- `sdd task done` con `-CI`: cazó el Pester roto que el pre-commit dejó pasar.
- La revisión de spec con dos revisores (dominio en Opus, técnica en Sonnet): 20 hallazgos, 17 aceptados.
- Partir la feature en la apertura (el carril spike a la 0163): la spec cupo en un plan de cinco tasks.
- El revisor final en worktree desanclado: seis Important reales, todos con test.

## Menores

- Un heredoc de Python en Git Bash no parseaba; los scripts pasaron a ficheros del scratchpad — no localizado.
- `subject.sh` heredado guardaba como salida del sujeto la spec del molde (búsqueda por `-newer`); se cambió a la carpeta de fecha mayor — `tests/headless/lib.sh` (`subject_keep`), aprendizaje ya en `tech-stack.md`.
- Un escenario que invoca la skill con `/sdd-kit:<skill>` no deja `>>> Skill:` en el stream y la puerta de `battery.sh` sale roja — `tests/headless/battery.sh`, aprendizaje ya en `tech-stack.md`.
- Un test lento de `tests/Battery.Tests.ps1` seguía nombrando un paso movido; solo salió en la suite completa (`e315894d`) — no localizado.
- El nombre del usuario apareció en salidas guardadas de sujetos y se sustituyó por `<git-user>` a mano; causa sin respaldo — `tests/headless/extract.mjs`.
- `SUBJECT=5` sobrescribió la salida `a1-5` de una ronda anterior — `tests/headless/run.sh`.
- `architecture.md` pasó su tope por 8 palabras — `tests/WordBudget.Tests.ps1`.
