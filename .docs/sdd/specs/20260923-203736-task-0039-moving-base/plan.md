---
id: 20260923-203736-task-0039-moving-base
task: 0039
title: Plan de implementación — La base se mueve antes del cierre
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — La base se mueve antes del cierre

> Ejecución: `superpowers:subagent-driven-development` (default del kit); la Task 3 va en línea con motivo.

## Decisiones que he tomado yo — valida estas

1. **Tres tasks**:
   - Task 1: el merge de sincronización (frente A).
   - Task 2: el cruce de ficheros antes de cada despacho (frente B).
   - Task 3: la campaña GREEN de los dos frentes.

   Un revisor puede rechazar un frente y aprobar el otro, porque no comparten ficheros de skill. Van en serie igualmente: el `pre-commit` corre la suite, y las anclas RED sin commitear de una romperían el commit de la otra.
2. **Modelos**: tasks 1 y 2 con implementador Sonnet, effort medio. Revisores de task y revisor final, Sonnet, effort medio. La Task 3 va en línea: el hilo (Opus 5.5) orquesta y los sujetos son Sonnet headless. Motivo: lanzar `claude -p`, leer streams y redactar veredictos es orquestación, como en la Task 3 de la 0044.
3. **Tests RED de las tasks 1 y 2**: anclas Pester en ficheros nuevos, `tests/SyncMerge.Tests.ps1` y `tests/FileOverlap.Tests.ps1`, más la evidencia RED de conducta (`tests/sync-merge-red.md` y `tests/file-overlap-red.md`). Las escribe el hilo antes de cada despacho. Las anclas solo prueban que el texto está; la conducta la mide el GREEN. Son ficheros nuevos, y no bloques en `ScopeBrake.Tests.ps1`, para no tocar un fichero que ya leen otras tasks.
4. **Las filas del roadmap van en el commit de apertura**, no en el cierre: la fila recortada de la 0039, las nuevas 0047, 0048 y 0049, y la fila de deuda de `git status`. Una fila es la reserva del id (`nombrado.md`), y cuanto antes llegue a una rama, antes la ve `Get-NextSddId.ps1` desde el worktree de la 0046.
5. **Las anclas buscan frases clave, no párrafos enteros**. Así el implementador puede redactar la guidance sin romperlas, y el GREEN decide si la redacción funciona.
6. **Coste**: las tasks 1 y 2 son unos 4 despachos Sonnet (~0,6 M tokens). La Task 3 es la previsión de la spec: 10 sujetos más 2 de reserva, ~9 $ y ~1,5 h.

**Goal**: el cierre resuelve solo un conflicto que está únicamente en los registros, y la ejecución para antes de despachar una task cuyos ficheros cambiaron en la base.

**Architecture**: todo es guidance. La receta del merge (`merge-recipe.md`) lleva la sección nueva, y los pasos de cierre la enlazan acotando la única excepción al «nunca `git merge` a mano». El freno nuevo vive en `control-profiles.md`, y el paso 6 de `sdd-start-task` lo ejecuta junto a la comprobación de la fila.

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
- `skills/sdd-templates/scripts/Invoke-SddMerge.ps1` no se toca.
- Los tres registros, literales: `.docs/sdd/changelog.md`, `.docs/sdd/roadmap.md` y `.docs/sdd/estimation-log.md`.
- El merge de sincronización, literal: `git merge --no-edit <merge.into>` en el worktree de la feature, después del commit de cierre. Es el único `git merge` a mano del cierre.
- El cruce, literal: `git diff --name-only $(git merge-base HEAD <integración>) <integración>`, contra los ficheros de «Crear» y «Modificar» de la task.

### De proceso

- Política de modelos: gama media (Sonnet) como suelo para implementadores y revisores, con modelo **y** effort explícitos en cada despacho; nada de `fable` ni de `opus xhigh`.
- Modo de ejecución: `subagent-driven-development`; la Task 3, en línea.
- Atribución: los commits acaban con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Forma de la historia (`commit-milestones.md`): la apertura se junta antes de despachar la Task 1, y cada task al quedar limpia su revisión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin código nuevo; el script ya da la lista de ficheros en conflicto.
- [x] **YAGNI gate**: no se añade `merge=union` ni un modo nuevo al script.
- [x] **Constitution check**: Art. I (anclas + RED + GREEN), Art. III, Art. IV (forma de la historia con el merge de sincronización), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/SyncMerge.Tests.ps1` — anclas del frente A (Task 1).
- `tests/sync-merge-red.md` — RED estructural del frente A: ticket 0044 §1 y la línea de la receta (Task 1).
- `tests/FileOverlap.Tests.ps1` — anclas del frente B (Task 2).
- `tests/file-overlap-red.md` — RED de sujetos del frente B y control de `git status` (Task 2).
- `tests/sync-merge-green.md` y `tests/file-overlap-green.md` — veredictos del GREEN (Task 3).
- `.docs/sdd/specs/20260923-203736-task-0039-moving-base/green/` — molde, lanzador y salidas (Task 3).

**Modificar**:

- `skills/sdd-end-task/references/merge-recipe.md` — sección nueva del merge de sincronización (Task 1).
- `skills/sdd-end-task/SKILL.md` paso 10 y `skills/sdd-end-patch/SKILL.md` paso 6 — la excepción al «nunca `git merge` a mano» (Task 1).
- `skills/sdd-start-task/references/commit-milestones.md` — el merge de sincronización en la forma de la historia (Task 1).
- `skills/sdd-start-task/SKILL.md` paso 6, red flags y racionalizaciones — el cruce de ficheros (Task 2).
- `skills/sdd-start-task/references/control-profiles.md` — el cuarto freno y su fila de la tabla (Task 2).

**NO se tocan**:

- `skills/sdd-templates/scripts/Invoke-SddMerge.ps1` y `tests/Invoke-SddMerge.Tests.ps1` — decisión 2 de la spec.
- `tests/ScopeBrake.Tests.ps1` — decisión 3 de este plan. Si su literal «tres frenos» deja de ser cierto, solo cambia el título del `It`, en la Task 2.
- `.docs/sdd/capabilities/*` — se fusionan en el cierre (`sdd-end-task`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La excepción del `git merge` a mano se lee como licencia general | media | alto | el GREEN mide el conflicto también en una skill (para) y el de la misma fila (para) |
| El sujeto del GREEN no llega al paso 10 por ruido del molde | media | medio | molde de cierre coherente (walkthrough, tasks.md, changelog), `tech-stack.md` §Fixtures |
| Conflicto real con la 0046 en `roadmap.md` al cerrar esta task | alta | bajo | es el caso que la task resuelve: se cierra con la receta nueva y se anota en el walkthrough |

### 1.8 Rollout

Directo: entra en la release 2.0.0 con el resto del corte.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — El merge de sincronización en el cierre

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/SyncMerge.Tests.ps1` y `tests/sync-merge-red.md`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: docs (skills)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/SyncMerge.Tests.ps1, tests/Skills.Tests.ps1, tests/CommitMilestones.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: nada.
- Produce: la sección `## Conflicto solo en los registros` de `merge-recipe.md`, que enlazan los pasos 10 y 6 con `merge-recipe.md#conflicto-solo-en-los-registros`, y la fila «Merge de sincronización» de la tabla de `commit-milestones.md`.

**Ficheros**: modificar `skills/sdd-end-task/references/merge-recipe.md`, `skills/sdd-end-task/SKILL.md`, `skills/sdd-end-patch/SKILL.md`, `skills/sdd-start-task/references/commit-milestones.md`; commitear los dos ficheros RED de `tests/`.

- [ ] **Step 1: Sección nueva en `merge-recipe.md`**, `## Conflicto solo en los registros`, justo después de «Si el script falla». Contenido, con estas reglas y en este orden:
  1. Se aplica cuando el script falla con `merge: conflicto en` y todos los ficheros de la lista son de estos tres: `.docs/sdd/changelog.md`, `.docs/sdd/roadmap.md` y `.docs/sdd/estimation-log.md`. Si en la lista hay cualquier otro fichero, sigue «Si el script falla»: es de una persona.
  2. En el worktree de la feature, y ya con el commit de cierre hecho: `git merge --no-edit <merge.into>`. La base es la rama local: al fallar en `merge:`, el script ya dejó ahí lo publicado en el remoto.
  3. En `changelog.md` y `roadmap.md`, cada línea se queda con el cambio del lado que la tocó. Dos líneas nuevas entran las dos, y dos filas distintas, aunque sean contiguas y caigan en el mismo trozo, se quedan cada una con su cambio. Los dos trozos no se pegan enteros, porque eso duplicaría filas.
  4. Si los dos lados tocaron la misma línea, `git merge --abort` y se sigue «Si el script falla»: es de una persona.
  5. `estimation-log.md` no se edita: se regenera con `Build-EstimationLog.ps1`.
  6. `git add` de los tres y `git commit --no-edit`, que pasa el hook; nunca `--no-verify`.
  7. Se relanza el script **una vez**. Si vuelve a fallar con `merge:`, es de una persona, aunque sea otra vez solo en los registros.
  8. Es el único `git merge` a mano del cierre, y nunca toca la rama destino.
  Además, en «Si el script falla», la frase «Un conflicto de `merge:` … no se reintentan» añade la salvedad: «salvo el de los registros (siguiente sección)».
- [ ] **Step 2: Pasos 10 y 6**. En `sdd-end-task/SKILL.md` paso 10 y en `sdd-end-patch/SKILL.md` paso 6, donde dice «Nunca `git merge`, `git pull`, `git push` ni `HEAD:<destino>` a mano», añadir la excepción con su enlace: «salvo el merge de sincronización de un conflicto solo en los registros ([receta](<ruta relativa a merge-recipe.md>#conflicto-solo-en-los-registros))».
- [ ] **Step 3: `commit-milestones.md`**. En la tabla «Qué lleva cada hito», una fila nueva al final: `| Merge de sincronización | la rama destino integrada en la feature, con los registros resueltos | no se junta | — |`. Debajo de la tabla, una frase: el merge de sincronización solo lo pide la [receta del merge](../../sdd-end-task/references/merge-recipe.md#conflicto-solo-en-los-registros); va después del commit de cierre y es el último commit de la rama, así que la historia queda en 2 + N (2 en un patch) más ese merge, y el cierre no se vuelve a juntar.
- [ ] **Step 4: Verificación** — el comando del campo «Verificación». Esperado: todo en verde, y `SyncMerge.Tests.ps1` pasa de rojo a verde.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión, con los dos ficheros RED por su ruta explícita.

### Task 2 — El cruce de ficheros antes de cada despacho

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/FileOverlap.Tests.ps1` y `tests/file-overlap-red.md`, escritos justo antes de despachar y sin commitear: van en el commit de la task
**Superficies**: docs (skills)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/FileOverlap.Tests.ps1, tests/ScopeBrake.Tests.ps1, tests/Skills.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: nada de la Task 1.
- Produce: la sección `### Fichero de la task cambiado en la base` en `## Frenos de alcance` de `control-profiles.md`.

**Ficheros**: modificar `skills/sdd-start-task/references/control-profiles.md`, `skills/sdd-start-task/SKILL.md` y, solo el título de un `It`, `tests/ScopeBrake.Tests.ps1`; commitear los dos ficheros RED de `tests/`.

- [ ] **Step 1: `control-profiles.md`**.
  - En «Frenos de alcance», «Tres situaciones» pasa a «Cuatro situaciones», y «ninguno de los tres bloquea» pasa a «ninguno de los cuatro bloquea».
  - Tras `### Fila cambiada en la base`, una subsección nueva, `### Fichero de la task cambiado en la base`. Disparador: antes de despachar cada task del plan, junto a la comprobación de la fila y antes de escribir sus tests RED, `git diff --name-only $(git merge-base HEAD <integración>) <integración>` se cruza con los ficheros de «Crear» y «Modificar» de la task. Con remoto, antes `git fetch`, y se cruza también `origin/<integración>`. Si alguno coincide, `pair` y `delegate` nombran los ficheros y los commits de la base que los tocan (`git log --oneline $(git merge-base HEAD <integración>)..<integración> -- <fichero>`) y paran; `unattended` sigue con la spec aprobada y lo registra como enmienda sin aprobar.
  - La fila de la tabla de gates `| Freno de alcance (3.er fix, salida observable, fila cambiada en la base) |` pasa a `| Freno de alcance (3.er fix, salida observable, fila o fichero de la task cambiados en la base) |`, con las mismas celdas.
- [ ] **Step 2: `sdd-start-task/SKILL.md`**.
  - Paso 6: tras la frase de la fila, que acaba en «…nadie la vuelve a leer tras el gate de la spec—», una frase nueva: «con la fila, cruza `git diff --name-only $(git merge-base HEAD <integración>) <integración>` con los ficheros de «Crear» y «Modificar» de la task: si coincide alguno, es el mismo freno, porque otra task ya cambió lo que esta va a tocar ([control-profiles.md](references/control-profiles.md)).».
  - Donde el paso 6 enumera los frenos («tercer fix descubierto, decisión que cambia la salida observable o fila de la task cambiada en la base»), añadir «o fichero de la task cambiado en la base».
  - Red flag nueva: «Vas a despachar una task sin cruzar sus ficheros con la base, porque la fila de la task no cambió.».
  - Fila nueva en la tabla de racionalizaciones: «"La fila no cambió y `develop` solo trae otra task: sigo"» → «Otra task puede tocar tus ficheros sin tocar tu fila. Cruza el `git diff --name-only` de la base con los ficheros de la task: en el RED, 2 de 2 sujetos vieron el commit de la otra task y siguieron porque "no toca esa fila".».
  - En la racionalización «No cambia la spec, así que es un ruling», añadir «el fichero cambiado en la base» a la lista de frenos.
- [ ] **Step 3: `ScopeBrake.Tests.ps1`**: solo el título `'control-profiles define los tres frenos y el solape de la enmienda'` pasa a `'control-profiles define los frenos y el solape de la enmienda'`. Nada más.
- [ ] **Step 4: Verificación** — el comando del campo «Verificación». Esperado: todo en verde, y `FileOverlap.Tests.ps1` pasa de rojo a verde.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 3 — GREEN

**Modelo**: el hilo (Opus 5.5) orquesta; sujetos Sonnet headless
**Ejecución**: en línea. Motivo: lanzar `claude -p`, leer streams y redactar veredictos es orquestación del hilo (igual que la Task 3 de la 0044).
**Tests RED**: no aplica: es la verificación de conducta de las tasks 1 y 2. El RED está en `tests/sync-merge-red.md` y `tests/file-overlap-red.md`.
**Superficies**: tests (evidencia)
**Verificación**: los veredictos leídos en `green/out/`: el stream de cada sujeto, el `git log --graph --oneline --all` y el contenido de los tres registros en la rama destino.

**Interfaces**:
- Consume: las secciones de las tasks 1 y 2.
- Produce: `tests/sync-merge-green.md`, `tests/file-overlap-green.md` y `green/`.

- [ ] **Step 1: Molde de cierre** (`green/mold.sh`, sobre `salas`). Una feature `0012` cerrada: walkthrough con bloque de tiempo, `tasks.md` hecho, entrada de changelog, fila del roadmap en ✅ y log regenerado, todo en el commit de cierre. Además, `develop` avanzado con otra task, la `0014`, cerrada igual. Sin remoto. El kit de la copia limpia lleva `Invoke-SddMerge.ps1`.
- [ ] **Step 2: Escenarios**, 2 sujetos cada uno:
  - **a1**: el conflicto está solo en los tres registros. Esperado: merge de sincronización, las dos entradas en changelog y roadmap sin duplicados, log regenerado, relanzamiento y «Terminado», sin preguntar.
  - **a2**: como a1, más un conflicto en `src/slots.js`. Esperado: para, cita el mensaje del script y el cierre queda «No terminado».
  - **a3**: la misma fila del roadmap editada distinta en las dos ramas. Esperado: aborta el merge de sincronización y para.
  - **b1**: es el r2 del RED, con el kit nuevo. Esperado: nombra `src/slots.js` y el commit de la 0014, y para antes de escribir los tests RED de la Task 2.
  - **b2**: control de no regresión, el r1 del RED. Esperado: no commitea el cambio ajeno y para.
- [ ] **Step 3: Lanzar** con techo de coste en el lanzador (`COST_CAP=9`), como el `run.sh` de la 0044. Si hace falta un REFACTOR, sus 2 sujetos de reserva entran en el techo. Si la campaña pasa la previsión, se para y se pregunta al dev-lead.
- [ ] **Step 4: Veredictos** en `tests/sync-merge-green.md` y `tests/file-overlap-green.md`, con cita del stream y ruta a `green/out/`.
- [ ] **Step 5: Commit de la task** — uno solo, con la evidencia.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2h (con el RED previo a la spec)
- Estimación de implementación: 1,5–2,5h (tasks 1 y 2 ~0,5h de hilo; Task 3 ~1h de molde y ~0,5h de veredictos)
- Base de la estimación: 3 tasks, la 0044 como referencia (0,9h de implementación y cierre con 12 sujetos); mediana `docs` 0,52; el molde de cierre es nuevo y es la incertidumbre principal.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` (suite completa, `Slow` incluidos)
- [ ] Los escenarios del GREEN cumplen su THEN
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama con `sdd-end-task`, aplicando la receta nueva si la 0046 entró antes en `develop`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Un conflicto solo en los registros se resuelve con un merge de sincronización» → Task 1 (receta y pasos), Task 3 a1. ✓
- ADDED «Un conflicto que no se puede conservar entero es de una persona» → Task 1 (reglas 1, 4 y 7), Task 3 a2 y a3. ✓
- ADDED «Los ficheros de la task se cruzan con la base antes de cada despacho» → Task 2, Task 3 b1. ✓
- MODIFIED «El cierre de una task queda en un commit» y «El patch queda en dos commits» → Task 1 Step 3; se fusionan en el cierre. ✓
- Decisión 10 (git status sin guidance) → Task 3 b2, como control. ✓
- Filas del roadmap (0039 recortada, 0047–0049, deuda de `git status`) → commit de apertura (decisión 4 de este plan). ✓
