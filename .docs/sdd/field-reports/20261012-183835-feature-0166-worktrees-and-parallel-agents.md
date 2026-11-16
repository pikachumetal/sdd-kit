---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261012-183835-feature-0166-worktrees-and-parallel-agents
task: 0166
mode: full
date: 2026-10-12
---

# Ticket para el kit — feature 0166: forks de los worktrees y del despacho en paralelo, y el desvío del REFACTOR

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: sdd-propose, sdd-grilling, sdd-start-feature, sdd-implement, sdd-tdd, add-to-changelog, sdd-end-feature, sdd-feedback
- Proyecto: el propio kit (plugin de Claude Code: skills en Markdown, CLI en TypeScript, Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 effort high (revisión final y re-revisión); 16 sujetos headless Sonnet
- Coste en reloj: 1,9 h frente a 4 h estimadas (walkthrough §2)
- Coste en tokens: hilo 64,6 M, subagentes 5,3 M; 30,96 $ de sesión más 5,82 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Dos rondas de REFACTOR sobre un THEN que el texto de la fuente ya pedía

- **Qué pasó**: el THEN de `w1` pedía que `sdd-worktrees` dijera la ruta del worktree al detectarlo. El texto de la fuente ya dice «Already in isolated workspace at `<path>`», y 3/3 sujetos daban la rama sin la ruta. En la Task 2 el hilo lo dejó como ruling; la revisión final lo subió a Important y el hilo lanzó dos rondas de REFACTOR con guía nueva. Las dos dieron 0/3 y se retiraron. Al final el THEN pasó a «lo dice con su rama» por enmienda.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings» y la pasada de fix de la revisión final; en este repo, `tech-stack.md` §cómo se testean las skills (rondas de REFACTOR).
- **Por qué el kit no lo evitó**: ninguna regla dice cuándo parar de refactorizar texto de skill que no mueve la conducta, ni que un THEN que mide algo que la fuente ya pide y no se cumple es antes una pregunta sobre el THEN que sobre el texto.
- **Coste**: ~35 min y ~0,7 $ de sujetos en dos tandas (walkthrough §2 y §3, ruling «Important 1»).
- **Propuesta**: tras una ronda de REFACTOR con 0/N, si el texto de la fuente ya pedía la conducta, el hilo para y ofrece la enmienda del THEN como desvío antes de otra ronda.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un THEN medido 0/3 en GREEN y una ronda de REFACTOR también 0/3, con la conducta ya pedida por el texto heredado, WHEN la revisión final lo marca Important, THEN el hilo para con 🦆 y ✋ y propone enmendar el THEN, sin lanzar una segunda ronda.

### 2. El primer molde de `k1` dejaba una salida antes del punto medido

- **Qué pasó**: el molde de `k1` (tocar lo que la spec deja en «No entra») tenía dos THEN que se contradecían. 2/2 sujetos pararon por la contradicción y nunca llegaron a decidir sobre el «No entra». La comprobación en seco vio que el molde llegaba al punto, no que hubiera otra salida antes. Se rehízo fiel al caso de la 0168 y salió limpio (0/2 fallan).
- **Dónde en el kit**: en este repo, `tech-stack.md`, «Comprobación previa de cada escenario».
- **Por qué el kit no lo evitó**: la lista de la comprobación previa no preguntaba por salidas anteriores al punto medido. Ya se añadió en el cierre como punto (6).
- **Coste**: ~0,5 $ y una tanda más por fila (walkthrough §3, ruling «el primer molde de `k1`»).
- **Propuesta**: aplicada en el cierre; falta comprobar que la pregunta (6) la usa el siguiente que diseñe un molde.
- **Verificada**: sí — el segundo molde, diseñado contra esa pregunta, midió el «No entra» (`red/out/k1-*`).
- **Criterio de aceptación**: GIVEN un molde cuyo turno ofrece una salida previa (un dato contradictorio, un fichero que falta), WHEN el hilo hace la comprobación previa, THEN la anota como fallo del molde antes de lanzar sujetos.

## Lo que hice por iniciativa propia

- Ante un fallo del gate de cierre (`FastSuiteBudget`, 31-34 s con umbral de 30), lo ejecuté sobre la base `9e0c308` sin la feature: falla igual (32,4 s), y así no se atribuyó a la feature. Funcionó; candidato a regla: un rojo del gate de cierre se contrasta con la base antes de atribuirlo.
- Partí el coste de sujetos por escenario en el walkthrough (§2). Sirvió para ver que el coste estaba en rehacer moldes, no en medir.

## Funcionó, no tocar

- El contraejemplo concreto en el punto del desvío (`k2`): el freno abstracto «cambia la salida observable» no paró a 2/2 sujetos; el caso concreto, sí (GREEN 2/2).
- `sdd-parallel-agents` en `review-spec.md`: los dos revisores en la misma respuesta, con modelo y effort (`a1` 1/1).
- La revisión final opus effort high encontró los dos Important que el hilo no vio.
- `sdd merge --push` fusionó y empujó sin intervención.

## Menores

- La decisión 7 de la spec contó solo el cambio de nombre en `architecture.md`; la línea nueva del árbol lo dejó en 1.903 de 1.900 palabras — `skills/sdd-propose/SKILL.md` (sin regla que cuente el tope de los documentos que toca la spec).
- El plan ponía los topes de `WordBudget` de las skills nuevas en la Task 4, pero el test los exige en cuanto la skill existe — plantilla del plan, no localizado con más precisión.
- El plan nombraba `sdd-avisos` la skill del molde de `k2`; el molde usaba `guardar-nota` — no localizado.
- `FastSuiteBudget` rojo en la base: el conjunto rápido del pre-commit pasa de 30 s en esta máquina — `tests/` (`FastSuiteBudget`).
