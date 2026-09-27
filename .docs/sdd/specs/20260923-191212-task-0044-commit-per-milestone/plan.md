---
id: 20260923-191212-task-0044-commit-per-milestone
task: 0044
title: Plan de implementación — Un commit por hito: apertura, cada task y cierre
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — Un commit por hito

## Decisiones que he tomado yo — valida estas

1. **Tres tasks**:
   - Task 1: la forma en la task, en la constitution y en las plantillas.
   - Task 2: el carril patch.
   - Task 3: la campaña GREEN.

   — Un revisor puede rechazar el carril patch y aprobar el resto. La 1 y la 2 no comparten ficheros, pero van en serie: el `pre-commit` corre la suite entera y los tests RED de una romperían el commit de la otra.
2. **Modelos**:
   - Tasks 1 y 2: implementador Sonnet, effort medio.
   - Revisores de task y revisor final: Sonnet, effort medio.
   - Task 3: en línea. El hilo (Opus 5.5) orquesta y los sujetos son Sonnet headless.

   — Es lo decidido en la spec (decisión 12). La Task 3 lanza `claude -p` y lee streams, un trabajo de orquestación que no se delega bien.
3. **Tests RED de las tasks 1 y 2: anclas Pester en `tests/CommitMilestones.Tests.ps1`**:
   - las escribe el hilo antes de cada despacho: el bloque de la Task 2 se añade justo antes de despacharla;
   - la evidencia RED de conducta (`tests/commit-milestones-red.md`, desde el archivo) va con la Task 1.

   — Las anclas solo prueban que el texto está; la conducta la mide el GREEN. Son pocas porque la 0045 va a podar anclas.
4. **`plan-template.md` conserva un «Step 4», reescrito como el commit de la task**: al quedar limpia su revisión, un único commit. — La spec (decisión 9) decía «quitar el Step 4: Commit por paso», pero en la plantilla ese paso ya es por task, no por paso. Borrarlo dejaría la task sin decir cuándo se commitea.
5. **Coste**: las tasks 1 y 2 son unos 4 despachos Sonnet (~0,6 M tokens). La Task 3 es la previsión de la spec: 10 sujetos, ~10 $ y ~75 min, con un techo de 14 sujetos, ~14 $ y 1 h 45 min.

**Goal**: la historia de la rama de una task queda en apertura + un commit por task + cierre, y la de un patch en fix + cierre.

**Architecture**: la receta y las guardas viven en una sola referencia nueva, `skills/sdd-start-task/references/commit-milestones.md`. Las skills la citan con una frase en el punto de uso y la constitution fija la forma.

**Tech Stack**: skills en Markdown, Pester 5 para las anclas y sujetos `claude -p` headless para el GREEN (`tech-stack.md` §Cómo se testean las skills).

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Constitution Art. X, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Texto de skills en castellano con ortografía correcta; nombres de fichero en inglés kebab-case (Art. III).
- La receta de juntar es `git reset --soft <base>` + un `git commit`; nunca `rebase -i`, `push --force` ni `--no-verify`.
- Las dos guardas, literales: `git rev-list --merges <base>..HEAD` no vacío → no se junta; `git branch -r --contains <primer commit del rango>` no vacío → no se junta.

### De proceso

- Política de modelos: gama media (Sonnet) como suelo para implementadores y revisores, con modelo **y** effort explícitos en cada despacho; nada de `fable` ni de `opus xhigh`.
- Modo de ejecución: `subagent-driven-development`; la Task 3, en línea.
- Atribución: los commits acaban con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Esta task ya sigue la forma nueva: juntar la apertura antes de despachar la Task 1, y cada task al quedar limpia su revisión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una referencia, una frase por punto de uso y sin script.
- [x] **YAGNI gate**: no hay abstracción; la receta son dos comandos.
- [x] **Constitution check**:
  - Art. I (RED del archivo y GREEN medido);
  - Art. IV (convención nueva, revisadas las 4 skills que commitean);
  - Art. VIII (las plantillas se editan en `sdd-templates`);
  - Art. IX (sobrescribe el «Frequent commits» de superpowers solo en la historia final).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-start-task/references/commit-milestones.md`: la receta, las guardas, qué lleva cada hito, el hash en los artefactos y los RED sin commit.
- `tests/CommitMilestones.Tests.ps1`: las anclas.
- `tests/commit-milestones-red.md` y `tests/commit-milestones-green.md`: la evidencia de conducta.
- `.docs/sdd/specs/<carpeta>/green/`: el molde, el lanzador y la salida de cada sujeto.

**Modificar**:

- `.docs/sdd/constitution.md`: el Art. IV (forma de la historia) y el Art. VI (este repo la sigue).
- `skills/sdd-start-task/SKILL.md`:
  - paso 5: juntar la apertura antes del primer despacho;
  - paso 6: los RED sin commitear, con copia; juntar cada task; el hash en el hito siguiente.
- `skills/sdd-start-task/references/overrides-superpowers.md`: una fila para el «Frequent commits» de `writing-plans` y el rango del ledger.
- `skills/sdd-start-task/references/encargo-revision.md`: la sección «Tests RED» del implementador (commitearlos con la implementación).
- `skills/sdd-templates/templates/plan-template.md`: la línea «Tests RED» y el «Step 4».
- `skills/sdd-templates/templates/tasks-template.md`: la nota de la columna Commit.
- `skills/sdd-end-task/SKILL.md`: el paso 10, que junta el cierre antes del merge.
- `skills/sdd-start-patch/SKILL.md`: el paso 5, el commit del fix.
- `skills/sdd-end-patch/SKILL.md`:
  - paso 1: el hash del fix;
  - paso 2: el commit de cierre.
- `skills/sdd-templates/templates/patch-template.md`: el comentario de `commit:`.

**NO se tocan**:

- `.docs/sdd/capabilities/*`: los escribe el cierre al fusionar el delta.
- Las skills del carril release: sus commits quedan fuera de alcance (spec, «No entra»).
- `skills/sdd-templates/scripts/*`: sin script de juntado (spec, decisión 5).

### 1.6 Dependencias

`subagent-driven-development` 6.4.1 registra en el ledger un `BASE` por task antes de despachar y revisa `BASE..HEAD`. La receta usa ese mismo `BASE` como base del juntado.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto junta a través de un merge de `develop` | media | alto: mete `develop` en el commit del hito | guarda literal en la receta; escenario G5 del GREEN |
| El `pre-commit` bloquea un commit con RED de la task siguiente | alta si se escriben todos a la vez | medio | los RED de cada task se escriben justo antes de su despacho |
| El sujeto no abre la referencia | media (0013: 0/2 con la regla solo en `references/`) | alto | el paso de la skill dice **qué** hacer; la referencia, el **cómo** y las guardas |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La forma en la task, en la constitution y en las plantillas

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/CommitMilestones.Tests.ps1` (bloques «Referencia», «Task» y «Constitution») y `tests/commit-milestones-red.md`, escritos antes de despachar **y sin commitear**: el implementador los commitea con su implementación.
**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/CommitMilestones.Tests.ps1, tests/Skills.Tests.ps1, tests/TaskVerification.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: nada.
- Produce:
  - la referencia `skills/sdd-start-task/references/commit-milestones.md`, con estas secciones que la Task 2 enlaza por ancla: `## Qué lleva cada hito`, `## Receta`, `## Guardas`, `## El hash en los artefactos` y `## Tests RED sin commitear`;
  - la ruta relativa desde `sdd-end-patch` y `sdd-start-patch`: `../sdd-start-task/references/commit-milestones.md`.

**Ficheros**: crear `skills/sdd-start-task/references/commit-milestones.md`; modificar `.docs/sdd/constitution.md`, `skills/sdd-start-task/SKILL.md`, `skills/sdd-start-task/references/overrides-superpowers.md`, `skills/sdd-start-task/references/encargo-revision.md`, `skills/sdd-templates/templates/plan-template.md`, `skills/sdd-templates/templates/tasks-template.md` y `skills/sdd-end-task/SKILL.md`.

- [ ] **Step 1: Referencia**: crear `commit-milestones.md` con este contenido (se puede pulir la redacción; los valores y los comandos, no):

  ````markdown
  # Un commit por hito

  La rama de una task cuenta sus hitos: **apertura**, **un commit por task del plan** y **cierre** — 2 + N commits desde el `merge-base`, 3 en lite. La de un patch, dos: **fix** y **cierre**. Mientras un hito está abierto se commitea lo que haga falta: la revisión de `subagent-driven-development` trabaja por rangos `BASE..HEAD`. Cuando la revisión del hito queda limpia, su rango se junta en un commit.

  ## Qué lleva cada hito

  | Hito | Lleva | Se junta | Base |
  | --- | --- | --- | --- |
  | Apertura | spec, hallazgos de la review de spec, `plan.md`, `tasks.md` (lite: solo la spec) | justo antes del primer despacho (lite: antes de implementar) | `git merge-base HEAD <integración>` |
  | Task N | sus tests RED, su implementación, los arreglos de su revisión, su evidencia | con su revisión (y re-revisión) limpia, antes de despachar la siguiente o la revisión final | el `BASE` que apuntaste antes de despacharla |
  | Cierre | documentación de `sdd-end-task`, arreglos de la revisión final de rama y de la validación | tras la documentación de cierre, antes del merge | el commit de la última task |
  | Fix (patch) | código, tests y `patch.md` | con el fix verificado | `git merge-base HEAD <integración>` |
  | Cierre (patch) | `patch.md` con hash y tiempo, changelog, roadmap, estimation-log | antes del merge | el commit del fix |

  ## Receta

  Primero las dos guardas (siguiente sección). Si ninguna salta:

  ```bash
  git reset --soft <base>
  git commit        # convención de commits del proyecto
  ```

  Con un solo commit en `<base>..HEAD` no hay nada que juntar. Nunca `rebase -i`, `push --force` ni `--no-verify`.

  ## Guardas

  No se junta, y no se hace push forzado, si:

  - el rango contiene un merge: `git rev-list --merges <base>..HEAD` no sale vacío. Juntarlo metería los cambios de la rama integrada en el commit del hito;
  - el rango ya está publicado: `git branch -r --contains <primer commit del rango>` no sale vacío (el primero lo da `git rev-list --reverse <base>..HEAD`). Reescribirlo obligaría a forzar el push.

  El hito queda como está, y el walkthrough (o `patch.md`) dice cuál quedó sin juntar y por qué.

  ## El hash en los artefactos

  Un commit no puede contener su propio hash. El de la task N se escribe en `tasks.md` en el commit del hito siguiente —la task N+1 o, para la última, el cierre—, y el del fix de un patch, en `patch.md` en el commit de cierre. Es siempre el hash del commit ya juntado; la línea del ledger de `subagent-driven-development` también usa `<base>..<hash juntado>`.

  ## Tests RED sin commitear

  Los tests RED de la task los escribe el hilo antes del despacho y **no los commitea**: van en el commit de la task. Con un `pre-commit` que exige la suite en verde, un commit de tests en rojo no se puede hacer sin `--no-verify`, y con el juntado ya no aportaría nada a la historia. Antes de despachar, guarda una copia fuera del repo; al volver el implementador, compárala con el test commiteado (`git diff --no-index <copia> <ruta>`). Un cambio que no sea de formato va al revisor de la task.
  ````

- [ ] **Step 2: Constitution**:
  - En el Art. IV, tras la frase de naming y merge, añadir: «la historia de una rama de task queda en un commit de apertura, uno por task del plan y uno de cierre, y la de un patch en fix y cierre; los commits intermedios se juntan al quedar limpia la revisión de cada hito (`sdd-start-task/references/commit-milestones.md`)».
  - En el Art. VI, añadir: «Las ramas de este repo siguen la forma de la historia que fija el Art. IV».
- [ ] **Step 3: `sdd-start-task/SKILL.md`**:
  - Paso 5: al final, «Antes del primer despacho, junta la apertura en un commit ([commit-milestones.md](references/commit-milestones.md)).».
  - Paso 6:
    - sustituir «y los commitea» por «sin commitearlos: van en el commit de la task, y antes de despachar guardas una copia fuera del repo para compararla cuando vuelva el implementador»;
    - tras la frase de `tasks.md` como registro vivo, añadir: «Cuando la revisión de una task queda limpia, junta su rango en un commit antes de despachar la siguiente, salvo que salte una guarda; su hash va a `tasks.md` en el commit del hito siguiente ([commit-milestones.md](references/commit-milestones.md)).».
- [ ] **Step 4: `overrides-superpowers.md`**: añadir una fila a la tabla:

  ```markdown
  | `writing-plans`: «Frequent commits» · `subagent-driven-development`: el ledger por rango `BASE..HEAD` | Los commits frecuentes siguen valiendo mientras un hito está abierto; al quedar limpia su revisión se juntan en uno (`commit-milestones.md`), y el ledger apunta `BASE..<hash juntado>`. La historia final es apertura, una por task y cierre. |
  ```

- [ ] **Step 5: `encargo-revision.md`**:
  - En la sección `## Tests RED` del encargo del implementador, añadir: «Están escritos y sin commitear: commitéalos con tu implementación, con `git add` de sus rutas explícitas, y nunca con `--no-verify`.».
  - En la línea 65 (la de «Los tests los escribe el hilo principal…»), cambiar «antes de despachar» por «antes de despachar, sin commitearlos».
- [ ] **Step 6: Plantillas**:
  - `plan-template.md`, línea «Tests RED»: `<hilo principal · \`ruta/del/test\`, escritos antes de despachar y sin commitear: van en el commit de la task; \`en línea\`: TDD del propio hilo>`.
  - `plan-template.md`, Step 4: `- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: los intermedios se juntan (\`sdd-start-task/references/commit-milestones.md\`). Convención del proyecto, referenciando el ticket.`
  - `tasks-template.md`, nota de la cabecera: sustituir «actualiza (status + commit) al cerrar cada task» por «actualiza al cerrar cada task: el status en el commit de la task y su hash —el del commit ya juntado— en el del hito siguiente».
- [ ] **Step 7: `sdd-end-task/SKILL.md`**, paso 10: después de «**Rama** —» y de la cláusula de `env:clean`, antes de «Luego `superpowers:finishing-a-development-branch`», añadir «Antes del merge, junta el cierre en un commit desde el de la última task, con los arreglos de la revisión final y de la validación ([commit-milestones.md](../sdd-start-task/references/commit-milestones.md)).».
- [ ] **Step 8: Verificación**: el comando del campo «Verificación». Esperado: todo en verde.
- [ ] **Step 9: Commit de la task**: `git add` de las rutas de esta task, incluidos los tests RED y `tests/commit-milestones-red.md`.

### Task 2 — El carril patch

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · bloque «Patch» de `tests/CommitMilestones.Tests.ps1`, escrito justo antes de despachar y sin commitear.
**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/CommitMilestones.Tests.ps1, tests/Skills.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: `skills/sdd-start-task/references/commit-milestones.md`, creada por la Task 1, enlazada desde el carril patch como `../sdd-start-task/references/commit-milestones.md`. Su tabla «Qué lleva cada hito» tiene las filas «Fix (patch)» (código, tests y `patch.md`) y «Cierre (patch)» (`patch.md` con hash y tiempo, changelog, roadmap, estimation-log).
- Produce: nada.

**Ficheros**: modificar `skills/sdd-start-patch/SKILL.md`, `skills/sdd-end-patch/SKILL.md` y `skills/sdd-templates/templates/patch-template.md`.

- [ ] **Step 1: `sdd-start-patch`**, paso 5: `5. **Commit del fix** — un solo commit con el código, los tests y \`patch.md\`, con la convención del proyecto y referenciando el ticket; si hubo intermedios, se juntan ([commit-milestones.md](../sdd-start-task/references/commit-milestones.md)).`
- [ ] **Step 2: `sdd-end-patch`**:
  - Paso 1: tras «commit hash real», añadir «—el del commit del fix—».
  - Paso 2: sustituirlo por `2. **Commit de cierre** — un solo commit sobre el del fix: \`patch.md\` con su hash y el tiempo, más changelog, roadmap y estimation-log si existen. El patch queda en dos commits, fix y cierre ([commit-milestones.md](../sdd-start-task/references/commit-milestones.md)).`
- [ ] **Step 3: `patch-template.md`**: el comentario de `commit:` pasa a ser `# hash del commit del fix; se escribe en el commit de cierre`.
- [ ] **Step 4: Verificación**: el comando del campo «Verificación». Esperado: todo en verde.
- [ ] **Step 5: Commit de la task**: `git add` de las rutas de esta task y de `tests/CommitMilestones.Tests.ps1`.

### Task 3 — GREEN

**Modelo**: el hilo (Opus 5.5) orquesta; sujetos Sonnet headless
**Ejecución**: en línea. El motivo: lanzar `claude -p`, leer streams y redactar veredictos es orquestación del hilo (igual que la Task 4 de la 0040).
**Tests RED**: no aplica: es la verificación de conducta de las tasks 1 y 2. El RED es `tests/commit-milestones-red.md`, de la Task 1.
**Superficies**: tooling (lanzador de sujetos) · docs
**Verificación**: los veredictos leídos en `green/out/` (el stream y el `git log --graph --oneline` de cada sujeto)

**Interfaces**:
- Consume: las skills editadas por las tasks 1 y 2 (una copia limpia del worktree como `--plugin-dir`).
- Produce: `tests/commit-milestones-green.md`.

**Ficheros**: crear `tests/commit-milestones-green.md` y `.docs/sdd/specs/20260923-191212-task-0044-commit-per-milestone/green/` (molde, lanzador y salida).

Escenarios (2 sujetos cada uno; cada molde es un repo git con `develop`, `feature/<id>` y los commits del estado que se describe):

| Esc. | Estado del molde | Petición | Pasa si |
| --- | --- | --- | --- |
| G1 apertura | spec aprobada y plan de 2 tasks en 3 commits sobre `develop` | «Plan escrito, perfil delegate: sigue con el paso 6 hasta justo antes de despachar la Task 1 y para ahí» | 1 commit desde el `merge-base` con spec, plan y tasks |
| G2 task | apertura en 1 commit; la Task 1 en 3 commits (RED, feat y fix de revisión); informe de revisión limpio | «La re-revisión de la Task 1 está limpia. Deja todo listo para despachar la Task 2 y para» | la Task 1 en 1 commit desde su BASE, y los RED no van en un commit aparte en lo que el sujeto prepara para la Task 2 |
| G3 cierre | 2 tasks juntadas; 1 commit de fix de la revisión final; validación dada | «Validado: probé X y funciona. Cierra la task» (hasta antes del merge) | 1 commit de cierre desde el de la última task con los docs y el fix; `tasks.md` con los hashes juntados |
| G4 patch | patch con el fix en 2 commits | «Cierra el patch» (hasta antes del merge) | 2 commits: el fix y el cierre; `commit:` = hash del fix |
| G5 guarda | la Task 1 en 3 commits con un merge de `develop` en medio | la de G2 | no junta, dice por qué y no hace push forzado |

- [ ] **Step 1: Molde y lanzador**: se reutilizan los de la 0040 (`red/subject.sh`) y los estados se construyen con un script `green/build-fixtures.sh`. El lanzador se niega a ejecutar fuera del scratchpad y oculta `$RUN` en sus dos formas.
- [ ] **Step 2: Lanzar** los 10 sujetos en serie, en segundo plano. Llevar la cuenta del coste acumulado; si pasa de 14 $ o de 14 sujetos, parar y preguntar al dev-lead.
- [ ] **Step 3: Veredictos** en `tests/commit-milestones-green.md`: por escenario, 2/2 o qué falló con su cita. Si hay REFACTOR, se re-verifica solo el escenario que falló, dentro del techo.
- [ ] **Step 4: Commit de la task**: la evidencia y `green/`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 2,5h (rango 1,5–3,5h)
- Base de la estimación:
  - 3 tasks: dos de edición de texto con implementador y la campaña GREEN de 10 sujetos;
  - la 0040 (tres tasks de texto y un GREEN) tardó ~3,5 h;
  - condicionada al GREEN, con la previsión de `estimation.md`: la campaña se estima como redacción, no como espera.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Minimal"` (con los `Slow`)
- [ ] Los criterios de la spec: la propia rama de la 0044 queda en 2 + 3 = 5 commits desde el `merge-base`, salvo lo que diga una guarda
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`)

---

## 4. Self-review (cobertura spec → tasks)

- La apertura de una task queda en un commit → Task 1 (paso 5 y referencia) · G1. ✓
- Cada task del plan queda en un commit → Task 1 (paso 6, `tasks-template`, `plan-template`) · G2. ✓
- El cierre de una task queda en un commit → Task 1 (`sdd-end-task` paso 10) · G3. ✓
- El patch queda en dos commits → Task 2 · G4. ✓
- No se junta a través de un merge ni lo ya publicado → Task 1 (referencia, Guardas) · G5. La guarda de lo publicado no tiene escenario GREEN: es la misma forma que la del merge. ✓
- MODIFIED «Los tests de la spec preceden al implementador» → Task 1 (paso 6, `encargo-revision`, `plan-template`) · G2. ✓
- Constitution Art. IV y Art. VI → Task 1, Step 2. ✓
- Dogfooding (decisión 10) → la ejecución de esta misma rama, comprobada en §3. ✓
