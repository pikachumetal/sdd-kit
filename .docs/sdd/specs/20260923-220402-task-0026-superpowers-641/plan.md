---
id: 20260923-220402-task-0026-superpowers-641
task: 0026
title: Plan de implementación — Compatibilidad con superpowers 6.4.1 y ruta del workspace en Windows
spec: ./spec.md
status: approved
created: 2026-09-24
---

# Plan de implementación — Compatibilidad con superpowers 6.4.1 y ruta del workspace en Windows

> Ejecución: las tres tasks van en línea, cada una con su motivo. La Task 1 pasa por un revisor de task y la rama por un revisor final.

## Decisiones que he tomado yo — valida estas

1. **Tres tasks**:
   - Task 1: las dos filas de override y sus anclas Pester.
   - Task 2: el GREEN de conducta.
   - Task 3: la 6.4.1 validada en README y roadmap, y lo que queda de la fila 0026.

   Van en serie: la Task 3 declara validada la 6.4.1 solo con el GREEN de la Task 2 limpio.
2. **Las tres en línea**:
   - Task 1: son dos filas de tabla con el texto ya fijado por la spec. Un implementador Sonnet releyendo el kit cuesta más que el cambio. La revisa un revisor de task, Sonnet con effort medio.
   - Task 2: es orquestación de sujetos headless, como la Task 3 de la 0039.
   - Task 3: es texto de registro. Entra en la revisión final.
3. **Revisor final**: Sonnet con effort alto. Es la revisión de toda la rama, y la gama media es el suelo del kit.
4. **Anclas Pester** en `tests/SuperpowersCompat.Tests.ps1`, fichero nuevo. Buscan frases clave, no párrafos: las filas se pueden redactar sin romperlas, y la conducta la mide el GREEN. El test se aparca en la carpeta de la spec mientras está en rojo, porque el `pre-commit` corre la suite.
5. **La fila 0026 del roadmap** queda solo con lo que pasa a la versión siguiente. Se añaden filas de deuda para los posibles falsos negativos (c), (e) y (f) y para «Review Focus» tras la 0031.
6. **Coste**: la previsión de la spec ya cubre el GREEN, 4 sujetos Sonnet por unos 4 $, dentro del techo de 16 $. Aparte, dos despachos de revisión Sonnet, unos 0,3 M tokens.

**Goal**: el kit declara validada superpowers 6.4.1, con el handoff de ejecución anulado por la tabla de gates y la ruta del workspace convertida a Windows antes de usarla.

**Architecture**: todo es guidance en la tabla `overrides-superpowers.md`, que ya enlazan los pasos 4 y 6 de `sdd-start-task`. Ningún paso de `SKILL.md` cambia. Las anclas Pester vigilan que las filas y la versión declarada no se pierdan.

**Tech Stack**: skills en Markdown, Pester 5 y sujetos `claude -p` headless (`tech-stack.md` §Cómo se testean las skills).

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Constitution Art. X, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Texto de skills en castellano con ortografía correcta; nombres de fichero en inglés kebab-case (Art. III).
- No se tocan `plan-template.md`, `review-spec.md`, `constitution.md`, `skills/sdd-start-task/SKILL.md`, `sdd-start-patch`, `sdd-end-patch` ni `encargo-revision.md`: los tocan la 0031 y la 0053 en paralelo.
- En `README.md` solo cambia la frase «Versión validada: …» (línea 149).
- La conversión de ruta, literal: `cygpath -w <ruta>`.

### De proceso

- Política de modelos: gama media (Sonnet) como suelo para revisores y sujetos, con modelo **y** effort explícitos en cada despacho; nada de `fable` ni de `opus xhigh`.
- Modo de ejecución: en línea las tres, con el motivo de la decisión 2.
- Atribución: los commits acaban con `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.
- Forma de la historia (`commit-milestones.md`): apertura, un commit por task y cierre.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos filas de tabla, sin pasos nuevos.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: Art. I (RED previo y GREEN con previsión común), Art. V (6.4.1 re-testada antes de declararla), Art. IX (se cita el texto de superpowers, no se copia).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/SuperpowersCompat.Tests.ps1`: anclas de las dos filas y de la versión validada.
- `tests/superpowers-641-red.md` y `tests/superpowers-641-green.md`: evidencia.
- `.docs/sdd/specs/20260923-220402-task-0026-superpowers-641/green/`: salidas del GREEN.

**Modificar**:

- `skills/sdd-start-task/references/overrides-superpowers.md`: dos filas nuevas.
- `README.md:149`: «Versión validada: 6.4.1».
- `.docs/sdd/roadmap.md`: fila 0026, «Referencias de vigilancia» y filas de deuda.

**NO se tocan**: los ficheros de la 0031 y la 0053 listados en «De código».

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto `w` no llega al primer `Write` del ledger | media | GREEN sin medir el frente | La petición lo sitúa en el paso 6 y pide parar antes del primer despacho |
| Conflicto con la 0031 en `README.md` | baja | merge manual | Hunks distintos (línea 72 y línea 149) |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Filas de override: handoff de ejecución y ruta del workspace

**Modelo**: hilo principal (Opus 5.5); revisor de task Sonnet, effort medio.
**Ejecución**: en línea. Son dos filas de tabla con el texto que fija la spec, y un implementador que relee el kit cuesta más que el cambio.
**Tests RED**: TDD del propio hilo · `tests/SuperpowersCompat.Tests.ps1`, aparcado en la carpeta de la spec hasta el commit.
**Superficies**: docs · tooling (Pester)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/SuperpowersCompat.Tests.ps1, tests/Skills.Tests.ps1"`

**Interfaces**:
- Consume: nada.
- Produce: dos filas en `overrides-superpowers.md`. Primera columna: «`writing-plans`: Execution Handoff · `brainstorming`: HARD-GATE architectural (revisar el plan y elegir el método)» y «`sdd-workspace` / `task-brief` en Windows: ruta POSIX».

**Ficheros**: crear `tests/SuperpowersCompat.Tests.ps1`; modificar `skills/sdd-start-task/references/overrides-superpowers.md`.

- [ ] **Step 1: Test RED**. Tres `It`:
  - la tabla tiene una fila que nombra «Execution Handoff» y «Native»;
  - la tabla tiene una fila que nombra `sdd-workspace` y `cygpath -w`;
  - `README.md` dice «Versión validada: 6.4.1».

  Ejecutarlo: 3 en rojo.
- [ ] **Step 2: Implementación**. Las dos filas, con el texto de superpowers al que responden, su efecto por perfil y la evidencia (`tests/superpowers-641-red.md`).
- [ ] **Step 3: Verificación**. Los dos primeros `It` en verde. El tercero sigue en rojo hasta la Task 3, así que el test se queda aparcado hasta entonces.
- [ ] **Step 4: Commit de la task**. `feat(skills): overrides de superpowers 6.4.1 para el handoff de ejecución y la ruta del workspace (0026)`.

### Task 2 — GREEN de conducta

**Modelo**: hilo principal orquesta; sujetos Sonnet headless (`claude -p --model sonnet`).
**Ejecución**: en línea. Es orquestación de sujetos, sin código.
**Tests RED**: los escenarios `h` y `w` de `red/subject.sh`.
**Superficies**: docs
**Verificación**: lectura de `green/out/<sujeto>/result.json`, del `.state.txt` y del stream en el scratchpad.

**Interfaces**:
- Consume: la Task 1 commiteada, copiada a un `KIT_DIR` limpio con `git archive HEAD skills .claude-plugin hooks`.
- Produce: veredictos en `tests/superpowers-641-green.md`.

**Ficheros**: crear `tests/superpowers-641-red.md`, `tests/superpowers-641-green.md` y `green/out/`.

- [ ] **Step 1**: `KIT_DIR` desde HEAD y 4 sujetos en paralelo: `h` ×2 y `w` ×2.
- [ ] **Step 2**: veredictos.
  - `h` pasa si no pregunta el método de ejecución ni ofrece «Nativo». Si pide aprobar el plan, se anota aparte: esa parada la gobierna el paso 5, no esta fila.
  - `w` pasa si el primer `Write` al workspace usa ruta Windows y ningún `Write` queda denegado.
- [ ] **Step 3**: si algo falla, una tanda de REFACTOR dentro del techo de 16 $. Si hace falta más, se para (Art. I).
- [ ] **Step 4: Commit de la task**. `test(skills): GREEN de los overrides de superpowers 6.4.1 (0026)`.

### Task 3 — Validación de la 6.4.1 y registros

**Modelo**: hilo principal.
**Ejecución**: en línea. Es texto de registro.
**Tests RED**: el tercer `It` de `tests/SuperpowersCompat.Tests.ps1`.
**Superficies**: docs · tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/SuperpowersCompat.Tests.ps1, tests/Skills.Tests.ps1, tests/WorkflowDocs.Tests.ps1"`

**Interfaces**:
- Consume: el veredicto limpio de la Task 2.
- Produce: README y roadmap con «6.4.1» y la fecha del GREEN.

**Ficheros**: modificar `README.md` (149) y `.docs/sdd/roadmap.md`; mover `tests/SuperpowersCompat.Tests.ps1` a `tests/`.

- [ ] **Step 1**: README:149 → «Versión validada: 6.4.1, revisada el 2026-09-24».
- [ ] **Step 2**: roadmap.
  - «Referencias de vigilancia» → «Validado: 6.4.1 (2026-09-24)».
  - La fila 0026 se deja con lo recortado para la versión siguiente.
  - Filas de deuda: (b) «Review Focus» tras la 0031; (c), (e) y (f) como posibles falsos negativos, con su evidencia.
- [ ] **Step 3**: el test, a `tests/`, y la verificación en verde.
- [ ] **Step 4: Commit de la task**. `docs(sdd): superpowers 6.4.1 validada en README y roadmap (0026)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,3h (con el RED previo a la spec y sus 5 sujetos)
- Estimación de implementación: 1–1,5h (Task 1 ~0,3h, Task 2 ~0,5h de sujetos y veredictos, Task 3 ~0,3h, revisión final ~0,2h)
- Base de la estimación: 3 tasks cortas; la 0039 como referencia (docs, 1,5–2,5h con 10 sujetos); aquí son 4. Mediana `docs` 0,52.
- Confianza: media. El escenario `w` es nuevo.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` (suite completa, `Slow` incluidos).
- [ ] Los dos requisitos `ADDED` de la spec, verificados por el GREEN.
- [ ] Cada requisito tiene su task (§4).
- [ ] Cierre con `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «El plan no pregunta el método de ejecución» → Task 1 (fila) y Task 2 (`h`). ✓
- ADDED «En Windows, el workspace de ejecución se usa en su ruta Windows» → Task 1 (fila) y Task 2 (`w`). ✓
- Decisión 6 (README y vigilancia) → Task 3. ✓
- Frentes (b), (c), (e) y (f) al roadmap → Task 3. ✓
- Evidencia RED (sondas y `r-*`) → Task 2 (`tests/superpowers-641-red.md`). ✓
- Review Focus (writing-plans 6.4.1): no aplica a un cambio de guidance sin código de producto. Sección omitida, decisión (b) de la spec. ✓
