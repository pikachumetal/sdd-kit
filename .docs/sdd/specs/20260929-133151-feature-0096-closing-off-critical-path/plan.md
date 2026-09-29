---
id: 20260929-133151-feature-0096-closing-off-critical-path
feature: 0096
title: Plan de implementación — El cierre fuera del camino crítico
spec: ./spec.md
status: approved
created: 2026-09-29
---

# Plan de implementación — El cierre fuera del camino crítico

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native** — las tasks 2-4 editan los mismos cinco ficheros de texto en secuencia, y las tasks 1 y 5 son campañas que lanza el hilo. Un implementador por task pagaría otra vez el contexto de ficheros que el hilo ya tiene leídos.
2. **Modelos** — el hilo implementa (sesión Opus 5.5, la elegida por el dev-lead). Los sujetos de la campaña son Sonnet (`tech-stack.md`, «Cómo se testean las skills»). El revisor final va con `sdd-kit:effort-high` + `opus` (techo del kit; la 0108 decidirá si baja).
3. **Moldes** — c1 sobre el molde `pedidos` de la 0099 (tiene UI, Playwright y «Verificación visual»). c2 y c3 sobre el molde `salas` de la 0085/0091, con el hook `deny-agent.mjs`, que deniega `Agent` y guarda el encargo: el despacho y su texto se ven en `agent-prompts.txt` sin pagar un revisor. El lanzador sale de `tests/headless/`, no de copias.
4. **RED estático además del de conducta** — cada task de texto abre con tests Pester de literales (`tests/ClosingOffCriticalPath.Tests.ps1`), escritos antes de editar, como `ClosingVerification.Tests.ps1`. Los bloques de las tasks 3 y 4 esperan fuera del repo hasta que empieza su task (`tech-stack.md`, «Tests RED de varias tasks en un mismo fichero»).
5. **Riesgo alto** — en c1 el sujeto que despacha en segundo plano puede cerrar el turno «esperando el informe» (`tech-stack.md`, «Despachos en primer plano»). Con `deny-agent.mjs` el despacho vuelve denegado al momento y se ve qué hace el sujeto después. Si aun así el turno acaba sin verificación visual, c1 mide solo el orden y el aislamiento, y los borradores se miden en c2.
6. **Coste** — ~24 $ de campaña (techo 35 $, 15 sujetos, spec §10), más un revisor final Opus (~1-2 M tokens). ~5 h en total.

**Goal**: sacar la revisión final y los registros de cierre del camino crítico, aislar al revisor del `HEAD` que avanza y dejar en `tasks.md` solo shas alcanzables.

**Architecture**: todo es texto de skills. Tres tasks de edición, cada una con sus literales en Pester y su escenario de conducta, entre una task de RED y otra de GREEN.

**Tech Stack**: Markdown de skills, Pester 5 (`tests/*.Tests.ps1`), sujetos headless con `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks comparten ficheros y van en secuencia, y dos de cinco son campañas del hilo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case (Art. III).
- Literales exactos de la spec: `review-<id>-<sha corto>`, «juntada en el cierre», «cambiado después de tu prueba», `Cambiado después de tu prueba: <sha> · <qué cambia>`.
- Un paso que resume una regla de una referencia lleva todas las condiciones que deciden; la referencia se queda con el porqué (`architecture.md`).
- Art. X: sin comentarios que repitan el código. Sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`). Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano en castellano con tildes. El revisor marca el incumplimiento como Important, salvo un umbral numérico superado en una unidad, que es Minor.
- Todo test que cree repos git, lance procesos o espere lleva `-Tag 'Slow'`.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho; revisor final `sdd-kit:effort-high` + `opus`.
- Campaña: tandas de 5 sujetos como máximo; con sujetos en marcha, el hilo no commitea; previsión y techo de la spec §10, y se para si se supera.
- Commits bilingües (tipo/scope en inglés, cuerpo en castellano) con la atribución de la sesión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin scripts nuevos; el aislamiento reutiliza `git worktree add --detach`.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Constitution check**: Art. I (RED antes de editar, previsión declarada), Art. IV (forma de la historia intacta: las líneas se reescriben, no se añade commit), Art. IX (el kit extiende `executing-plans` solo donde hay hueco medido).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/ClosingOffCriticalPath.Tests.ps1` — literales de las tasks 2-4.
- `tests/closing-off-critical-path-red.md`, `tests/closing-off-critical-path-green.md` — evidencia.
- `.docs/sdd/specs/20260929-133151-feature-0096-closing-off-critical-path/red/` y `green/` — `subject.sh`, moldes propios y `out/`.

**Modificar**:

- `skills/sdd-start-feature/SKILL.md` — pasos 6 y 7.
- `skills/sdd-start-feature/references/encargo-revision.md` — «Revisor final».
- `skills/sdd-start-feature/references/control-profiles.md` — viñeta de la pasada de fix y último revisado.
- `skills/sdd-start-feature/references/overrides-superpowers.md` — filas `executing-plans` y `subagent-driven-development`.
- `skills/sdd-start-feature/references/commit-milestones.md` — fila «Cierre» y «El hash en los artefactos».
- `skills/sdd-end-feature/SKILL.md` — pasos 0, 1, 9, 10 y 12.
- `skills/sdd-templates/templates/walkthrough-template.md` — §4 Verificación.

**NO se tocan**:

- `skills/sdd-start-feature/references/encargo-revision.md` línea del modelo del revisor final — es de la 0108.
- `skills/sdd-end-feature/references/merge-recipe.md`, `Invoke-SddMerge.ps1` — son de la 0097 y la 0048.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED no exhibe el fallo en c3 (los sujetos ya reescriben los shas) | media | la guía de la task 4 no se escribe (Art. I) | se mira de dónde sacaron la conducta antes de recortar; una tanda más si es incidental |
| c1 acaba el turno al despachar | media | c1 no mide los borradores | decisión 5 |
| La campaña pasa del techo | baja | parar y decidir con el dev-lead | contar coste tras cada tanda |

### 1.8 Rollout

Release siguiente del kit: bump de `plugin.json` y entrada en `changelog.md` al cerrar.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — RED de conducta

**Modelo**: hilo (sesión); sujetos `claude -p --model sonnet` con el lanzador de referencia
**Tests RED**: la campaña es el test: 3 escenarios × 2 sujetos con el kit de `develop`
**Superficies**: tooling (evidencia)
**Verificación**: cada `state.txt` con coste > 0; `tests/closing-off-critical-path-red.md` con una tabla por escenario y el coste total
**Se prueba en la aplicación**: no, porque es evidencia: mide el fallo antes de escribir la guía

**Interfaces**:
- Consume: `tests/headless/run.sh` y `lib.sh`; molde `pedidos` (`.docs/sdd/specs/20260929-073733-feature-0099-frontend-verification/red/mold.sh`, `features.sh`); molde `salas` y `deny-agent.mjs` (`.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/`).
- Produce: `red/subject.sh` con los escenarios `c1`, `c2` y `c3`, reutilizado por la task 5; los criterios de cada escenario, que la task 5 repite.

**Ficheros**: crear `red/subject.sh`, `red/out/`, `tests/closing-off-critical-path-red.md`

- [ ] **Step 1: Escenarios**, con la comprobación previa de 7 puntos de `tech-stack.md` antes de lanzar:
  - `c1`: `pedidos`, feature Native de una task que cambia la UI, commit de la task hecho y «Verificación visual» pendiente, perfil delegate. Petición: seguir desde el cierre de la task hasta presentar la validación. Criterios: (a) el despacho del revisor final va antes de arrancar la aplicación; (b) el encargo ancla el revisor en un worktree desanclado en el sha, o le prohíbe los commits posteriores; (c) escribe borradores de cierre antes de presentar la validación.
  - `c2`: `salas`, feature validada con `tasks.md` al día, y el dev-lead pide cambiar el texto de un error antes de cerrar. Petición: hacerlo y cerrar. Criterios: (a) re-revisión del tramo antes del walkthrough (control); (b) walkthrough y mensaje final separan el cambio con su sha; (c) no se niega ni lo trata como «second fix pass».
  - `c3`: `salas`, feature validada con `Pasada de fix: <sha>` y `Re-revisión: <sha>..<sha>` dentro del tramo de cierre. Petición: cerrar. Criterios: (a) tras el commit de cierre, todo sha de `tasks.md` cumple `git merge-base --is-ancestor <sha> HEAD`.
- [ ] **Step 2: Lanzar** 2 sujetos por escenario, en serie por escenario, con `SUBJECT_CAP=6` y `COST_CAP=15`.
- [ ] **Step 3: Evidencia** — tabla por escenario con enlace a `out/`, racionalizaciones literales y coste. Si un criterio sale limpio, anota de dónde sacó el sujeto la conducta (Art. I).
- [ ] **Step 4: Commit de la task** — `test(sdd-start-feature): RED del cierre fuera del camino crítico`.

### Task 2 — Revisor final en segundo plano y aislado

**Modelo**: hilo (sesión)
**Tests RED**: hilo · `tests/ClosingOffCriticalPath.Tests.ps1`, `Describe 'Revisor en segundo plano'`, antes de editar
**Superficies**: docs (skills)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingOffCriticalPath.Tests.ps1,tests/Skills.Tests.ps1"`
**Se prueba en la aplicación**: no, porque el kit no tiene aplicación: se prueba en el GREEN (c1)

**Interfaces**:
- Consume: la receta del paquete de `encargo-revision.md` («Revisor final»).
- Produce: la frase del encargo y la ruta `<padre de los worktrees>/review-<id>-<sha corto>`, que usa la re-revisión del paso 7 y el paso 9 de `sdd-end-feature`.

**Ficheros**: modificar `skills/sdd-start-feature/SKILL.md` (paso 6, párrafo del revisor final; paso 7, primera frase), `references/encargo-revision.md`, `references/overrides-superpowers.md`

- [ ] **Step 1: Tests RED**, con `Get-Step` y `Assert-Literal` como `ClosingVerification.Tests.ps1`:
  - `el paso 6 despacha el revisor final en segundo plano con el commit de la última task`: `Get-Step 6` contiene `en segundo plano`, `en cuanto existe el commit de la última task`, `antes de arrancar la aplicación`.
  - `el paso 7 presenta la validación cuando vuelve el revisor`: `Get-Step 7` contiene `cuando vuelve el revisor`.
  - `el encargo del revisor final lo aísla en un worktree desanclado`: `encargo-revision.md` contiene `git worktree add --detach`, `review-<id>-<sha corto>`, `no mires ramas ni commits posteriores`, `git worktree remove`.
  - `overrides dice que la revisión final de Native sale en segundo plano`: la fila `executing-plans` contiene `en segundo plano`.
- [ ] **Step 2: Correrlos** — esperado: 4 fallos.
- [ ] **Step 3: Editar** los tres ficheros. En el paso 6, el disparador para los dos métodos (Native: el commit de la última task; SDD: el commit juntado tras su revisión limpia), qué hace el hilo mientras tanto (verificación visual, borradores de la task 3) y el aislamiento resumido con todas sus condiciones. El detalle, en «Revisor final» de `encargo-revision.md`: `git worktree add --detach <padre de los worktrees>/review-<id>-<sha corto> <sha>`, la receta del paquete ejecutada allí, la frase del encargo, la re-revisión anclada en el último sha del tramo y `git worktree remove` al volver.
- [ ] **Step 4: Verificación** — verde.
- [ ] **Step 5: Commit de la task**.

### Task 3 — Borradores de cierre y «cambiado después de tu prueba»

**Modelo**: hilo (sesión)
**Tests RED**: hilo · `Describe 'Lo cambiado tras la validación'`, que vuelve al fichero desde fuera del repo al empezar la task
**Superficies**: docs (skills, plantilla)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingOffCriticalPath.Tests.ps1,tests/Skills.Tests.ps1"`
**Se prueba en la aplicación**: no, porque el kit no tiene aplicación: se prueba en el GREEN (c1, c2)

**Interfaces**:
- Consume: el paso 6 de la task 2 (los borradores se escriben mientras revisa).
- Produce: la línea `Cambiado después de tu prueba: <sha> · <qué cambia>` de la plantilla, que el paso 12 de `sdd-end-feature` lista.

**Ficheros**: modificar `skills/sdd-start-feature/SKILL.md` (paso 7: borradores sin commitear en vez de «ni walkthrough ni fusión»), `skills/sdd-end-feature/SKILL.md` (pasos 0, 1 y 12), `references/control-profiles.md` (pasada pedida tras la validación), `references/overrides-superpowers.md` (fila `executing-plans`: enmienda de proceso), `skills/sdd-templates/templates/walkthrough-template.md` (§4)

- [ ] **Step 1: Tests RED**:
  - `el paso 7 escribe los borradores sin commitear`: `Get-Step 7` contiene `sin commitear` y `walkthrough.md` sin la verificación ni el tiempo.
  - `el walkthrough separa lo cambiado tras la validación`: la plantilla contiene `Cambiado después de tu prueba: <sha> · <qué cambia>`.
  - `el mensaje final lista lo cambiado después de tu prueba`: el paso 12 de `sdd-end-feature` contiene `Cambiado después de tu prueba`.
  - `una pasada pedida tras la validación no es el second fix pass`: `overrides-superpowers.md` contiene `enmienda de proceso` y `second fix pass`.
- [ ] **Step 2: Correrlos** — esperado: 4 fallos.
- [ ] **Step 3: Editar**. El paso 1 de `sdd-end-feature` dice cuándo va la línea: un commit posterior a la validación con salida observable, uno por commit; sin salida observable, no. No se pide otra validación.
- [ ] **Step 4: Verificación** — verde.
- [ ] **Step 5: Commit de la task**.

### Task 4 — Todo sha de `tasks.md` alcanzable tras el cierre

**Modelo**: hilo (sesión)
**Tests RED**: hilo · `Describe 'Sha alcanzable'`, que vuelve al fichero al empezar la task
**Superficies**: docs (skills)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingOffCriticalPath.Tests.ps1,tests/Skills.Tests.ps1"`
**Se prueba en la aplicación**: no, porque el kit no tiene aplicación: se prueba en el GREEN (c3)

**Interfaces**:
- Consume: los formatos vigentes `Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN`, `Re-revisión: <sha>..<sha>, <tipo> + <modelo>, <veredicto>`, `Revisión final: <tipo> + <modelo>, <veredicto>, sobre <sha corto>`.
- Produce: `Pasada de fix: juntada en el cierre, <n> hallazgos RED→GREEN` y `Re-revisión: juntada en el cierre, <tipo> + <modelo>, <veredicto>`; último revisado = commit de cierre.

**Ficheros**: modificar `references/commit-milestones.md` (fila «Cierre», «El hash en los artefactos»), `skills/sdd-end-feature/SKILL.md` (pasos 9 y 10), `skills/sdd-start-feature/SKILL.md` (paso 7, último revisado), `references/control-profiles.md` (viñeta de la pasada de fix)

- [ ] **Step 1: Tests RED**:
  - `commit-milestones reescribe las líneas del tramo juntado`: contiene `juntada en el cierre` y `git merge-base --is-ancestor`.
  - `el paso 10 reescribe antes de juntar`: el paso 10 de `sdd-end-feature` contiene `juntada en el cierre`.
  - `el último revisado cubre la línea juntada` en los tres sitios que lo definen (paso 7 de `sdd-start-feature`, paso 9 de `sdd-end-feature`, `control-profiles.md`): cada uno contiene `si la línea dice «juntada en el cierre», el commit de cierre`.
- [ ] **Step 2: Correrlos** — esperado: 3 fallos.
- [ ] **Step 3: Editar**.
- [ ] **Step 4: Verificación** — verde.
- [ ] **Step 5: Commit de la task**.

### Task 5 — GREEN

**Modelo**: hilo (sesión); sujetos Sonnet
**Tests RED**: los criterios de la task 1, con el kit de la rama
**Superficies**: tooling (evidencia)
**Verificación**: `tests/closing-off-critical-path-green.md` con veredicto por criterio del RED y filas de control; coste acumulado ≤ 35 $
**Se prueba en la aplicación**: no, porque es evidencia

**Interfaces**:
- Consume: `red/subject.sh` de la task 1 (sin copiar el molde si no cambia).
- Produce: veredicto por escenario; REFACTOR si falla alguno (una tanda, dentro del techo).

**Ficheros**: crear `green/out/`, `tests/closing-off-critical-path-green.md`

- [ ] **Step 1: Lanzar** los 3 escenarios × 2 sujetos con el kit de la rama.
- [ ] **Step 2: Evidencia** — mismos criterios del RED, más controles: en c1, la pasada de fix de la revisión final no abre re-revisión; en c2, la re-revisión del tramo sigue antes del walkthrough.
- [ ] **Step 3: REFACTOR** si hace falta, con re-verificación en el mismo fichero.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 4h
- Base de la estimación: 5 tasks; dos campañas de 6 sujetos con moldes reutilizados (la 0091, parecida, gastó ~3 h en sus dos campañas); tres ediciones de texto de ~40 líneas cada una
- Confianza: media — c1 depende de un molde con UI y de cómo se comporta un despacho denegado en segundo plano

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal, desde la herramienta PowerShell: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`
- [ ] Criterios de éxito de la spec: cada THEN con su evidencia (GREEN o Pester)
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama con `sdd-end-feature`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «El revisor final sale en segundo plano con el commit de la última task» → Task 2 (disparador, orden), Task 3 (borradores); GREEN c1. ✓
- ADDED «El revisor final trabaja aislado en el sha que revisa» → Task 2; GREEN c1. ✓
- ADDED «Lo cambiado tras la validación se separa de lo validado» → Task 3; GREEN c2. ✓
- MODIFIED «El cierre no repite la revisión final de Native» → Task 4 (último revisado); GREEN c3. ✓
- MODIFIED «El cierre de una feature queda en un commit» → Task 4; GREEN c3. ✓
- Decisión 9 (gate en paralelo) → N/A, fuera de scope. ✓
