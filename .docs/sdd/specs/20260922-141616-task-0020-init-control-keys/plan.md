---
id: 20260922-141616-task-0020-init-control-keys
task: 0020
title: Plan de implementación — Claves de control en las entrevistas de las init
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Claves de control en las entrevistas de las init

## Decisiones que he tomado yo — valida estas

1. **Las dos tasks van en línea**, sin subagentes. Motivos:
   - La Task 1 es prosa en cinco ficheros que tienen que decir lo mismo, y el hilo principal tiene en contexto la spec, el RED y la migración. Un implementador tendría que reconstruirlo todo.
   - La Task 2 lanza sujetos headless, que por método es trabajo del hilo (tech-stack, «Sujetos headless»). Es el mismo criterio que la 0012.
2. **Modelos**: los sujetos en Sonnet y el simulador en Haiku, los mismos del RED, para que el GREEN sea comparable. Effort por defecto de `claude -p`, como en el RED.
3. **Un test Pester estructural**, en `tests/ControlProfiles.Tests.ps1`. Vigila el contrato de la fuente única: el bloque existe con sus tres preguntas y las tres skills lo enlazan sin copiar las claves. La conducta la mide el GREEN, no el test.
4. **GREEN con tres escenarios y 2 sujetos cada uno:**
   - **G1, brownfield entero** (16 turnos), el mismo del RED: mide F2 y las claves. El molde solo tiene `master`, así que también comprueba que el merge no se pregunta.
   - **G2, greenfield situado en la pregunta 18**, con git-flow respondido: comprueba las tres preguntas en tres turnos y la propuesta de merge completa.
   - **G3, migración** de un proyecto que tiene `control.profile` pero no tiene `merge` ni los frenos: comprueba que salta el perfil y hace las otras dos preguntas, una por turno.
5. **Coste estimado del GREEN: ~16 $** (G1 ~10 $, G2 ~2,5 $, G3 ~3 $), a ~0,4 $ por turno y sujeto, más ~1,5 h de reloj. El techo es 22 $: si se supera, paro y pregunto.
6. **Gate del plan**: no hay, por el perfil `delegate`. He comprobado que cada escenario de la spec tiene su task (§4).

**Goal**: las dos init y la migración v1.2.0 hacen las mismas tres preguntas de las claves de control, una por turno, con recomendación y motivo, y guardan en `sdd-kit.json` lo que se responde. Además, brownfield hace una pregunta o presenta un documento por turno.

**Architecture**: un bloque nuevo en `control-profiles.md` es la fuente única de las preguntas. Las tres skills lo enlazan en el punto de uso. Brownfield gana una lista numerada en su paso 3.

**Tech Stack**: Markdown de skills; Pester 5; sujetos `claude -p` con `red/driver.py`.

**Spec**: `./spec.md`

## Restricciones globales

- Art. I: ninguna edición de skill sin RED → GREEN documentado en `tests/`. El RED está en `tests/init-control-keys-red.md`; el GREEN irá en `tests/init-control-keys-green.md`.
- Art. II: el fallo de forma de brownfield se resuelve con una receta (lista numerada, una pregunta o un documento por turno), no con prohibiciones.
- Art. III: texto humano en castellano con tildes; nombres de fichero en inglés kebab-case.
- Art. VIII: sin copias de plantillas.
- Art. IX: no se reescribe nada que superpowers ya cubra.
- Art. X (literal): «Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el porqué no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo.»
- Política de modelos (Art. IV): modelo y effort explícitos al despachar; `fable` y `opus xhigh` prohibidos por defecto. La ejecución por defecto es `subagent-driven-development`; aquí las dos tasks van en línea, con su motivo.
- Valores exactos de la spec: perfil recomendado `delegate`; merge recomendado = rama de integración + `--no-ff` + el worktree lo borra una persona (`removeWorktree: false`); frenos por defecto `maxParallelAgents` 3, `silence.betweenStepsMinutes` 8, `silence.longCommandMinutes` 20; «no sé» no escribe la clave; sin rama de integración no se pregunta el merge.
- El pre-commit corre la suite entera: el test RED se aparca en la carpeta de la spec y se mueve con `git mv` en el commit de la implementación. Nunca `--no-verify`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un bloque y tres enlaces, sin fichero nuevo de referencia.
- [x] **YAGNI gate**: el bloque tiene tres consumidores reales.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 2), II, III, VIII, IX, X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/init-control-keys-green.md` — evidencia GREEN.
- `.docs/sdd/specs/20260922-141616-task-0020-init-control-keys/green/` — personas, moldes y salidas del GREEN.

**Modificar**:

- `skills/sdd-start-task/references/control-profiles.md` — sección nueva «Preguntas de las claves de control».
- `skills/sdd-init-greenfield/SKILL.md` — filas 18–20 de la entrevista y paso 3 (escribir las claves).
- `skills/sdd-init-greenfield/references/estructura.md` — la línea de `sdd-kit.json` del árbol, con `ids`, `control` y `merge`.
- `skills/sdd-init-brownfield/SKILL.md` — el paso 3 pasa a lista numerada con la regla de un turno, más el paso 5 y el cierre (claves pendientes sin usuario).
- `skills/sdd-init-brownfield/references/generacion.md` — el marcador del paso 5 con `control` y `merge`.
- `skills/sdd-init-brownfield/references/migrations/v1.2.0.md` — pasos 2 y 3 y la verificación.
- `tests/ControlProfiles.Tests.ps1` — un `It` nuevo.

**NO se tocan**:

- `.docs/sdd/capabilities/` — lo fusiona `sdd-end-task`.
- `skills/sdd-end-task/` — el paso 10 ya lee el bloque `merge`.
- El resto de la entrevista de greenfield (preguntas 1–17), y el orden de documentos y el inventario de brownfield (spec, «No entra»).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto junta las tres claves en un turno porque el bloque las presenta juntas | media | alto | el bloque abre con «una por turno»; G2 lo mide |
| El sujeto escribe los defaults cuando la respuesta fue «no sé» | media | medio | la regla va en el bloque; G1 y G2 lo leen en disco |
| Brownfield sin `develop` propone fusionar a `master` | media | alto | la regla de la rama estable va en el bloque; G1 lo mide |
| El GREEN se va de coste | media | medio | G2 y G3 van situados; techo de 22 $ |

### 1.8 Rollout

Directo: entra en la release 1.2.0 con el resto de tasks.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Bloque único de preguntas y sus tres consumidores

**Modelo**: hilo principal (Opus 5, effort del hilo), porque va en línea.
**Ejecución**: en línea. Motivo: prosa coherente entre cinco ficheros, con la spec y el RED en el contexto del hilo.
**Tests RED**: hilo principal · `tests/ControlProfiles.Tests.ps1`, con un `It` nuevo aparcado primero en la carpeta de la spec (`red/ControlProfiles.Tests.ps1`) y movido en el commit de la implementación.

**Interfaces**:
- Consume: nada.
- Produce: el ancla `control-profiles.md#preguntas-de-las-claves-de-control`, que enlazan las tres skills; y las claves de `sdd-kit.json` `control.profile`, `control.maxParallelAgents`, `control.silence.betweenStepsMinutes`, `control.silence.longCommandMinutes`, `merge.into`, `merge.noFf` y `merge.removeWorktree`.

**Ficheros**: los siete de «Modificar» en §1.1.

- [ ] **Step 1: Test RED.** Añadir a `Describe 'Perfiles de control: cierre, release y migración'`:

```powershell
  It 'las init y la migración enlazan las preguntas de las claves de control sin copiarlas' {
    $block = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    $block | Should -Match '(?m)^## Preguntas de las claves de control'
    ($block | Select-String -Pattern 'Recomendad[ao]' -AllMatches).Matches.Count | Should -BeGreaterOrEqual 3
    $consumers = 'skills/sdd-init-greenfield/SKILL.md', 'skills/sdd-init-brownfield/SKILL.md',
      'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    foreach ($consumer in $consumers) {
      Get-KitFile $consumer | Should -Match 'control-profiles\.md#preguntas-de-las-claves-de-control'
    }
    foreach ($init in $consumers[0..1]) { Get-KitFile $init | Should -Not -Match 'maxParallelAgents' }
  }
```

  Ejecutar con `$env:SDD_KIT_ROOT` sin definir: `Invoke-Pester tests/ControlProfiles.Tests.ps1`. Esperado: FALLA en el primer `Should` (no hay sección). Aparcar la versión con el `It` en `red/ControlProfiles.Tests.ps1` de la carpeta de la spec y dejar `tests/` como estaba.

- [ ] **Step 2: Bloque en `control-profiles.md`.** Sección nueva, tras «Claves de sdd-kit.json». Contenido:
  - Primera línea: la hacen las init y la migración v1.2.0, **una pregunta por turno**, y cada una con su recomendación y su motivo. Se salta la que ya tiene su clave en `sdd-kit.json`. Se escribe solo lo que el usuario responde, y esa respuesta es su frase (no es el atajo autoconcedido).
  - Tabla `# · Pregunta · Recomendada y motivo · Escribe`:
    1. «¿Con qué perfil de control trabajáis: `pair`, `delegate` o `unattended`?». Recomendada: `delegate`, porque para en la spec, en los desvíos y en la validación, y se ahorra el gate del plan; con menos paradas, la 0.6.0 cerró tres tasks en un día. Escribe: `control.profile`.
    2. «Al cerrar una task, ¿fusiono a `<rama de integración>` con `--no-ff` y dejo que el worktree lo borre una persona?». Recomendada: sí. El `--no-ff` deja la task en un solo commit que se revierte de una vez, y borrar el worktree es irreversible si quedan cambios sin commit. Escribe: con «sí», `merge` entero (`into: <rama>`, `noFf: true`, `removeWorktree: false`); con otra combinación explícita, esa. «No» o «no sé» no escriben nada, y el cierre de task pregunta.
    3. «¿Os valen los frenos por defecto: hasta 3 agentes en paralelo, y aviso tras 8 minutos de silencio entre pasos o tras 20 en un comando largo?». Recomendada: sí, los defaults del kit (su conducta la define la task 0022). Escribe: con «sí» o con números propios, las tres claves; «no sé» no escribe nada.
  - Regla de la pregunta 2: la rama de integración sale de la convención de ramas (greenfield) o de la que se ve en el repo (brownfield). Si la integración va directa a la rama estable, la pregunta no se hace y `merge` queda sin declarar: el merge a la rama estable lo decide siempre una persona.
  - Sin usuario: las preguntas quedan pendientes explícitas en el informe o en el resumen de cierre, y rigen los defaults.

- [ ] **Step 3: Greenfield.** En la tabla del paso 1, detrás de la fila 17:
  - `| 18 | Perfil de control ([preguntas](../sdd-start-task/references/control-profiles.md#preguntas-de-las-claves-de-control), 1) | sdd-kit.json |`
  - `| 19 | Política de merge (ídem, 2); solo si 15 deja una rama de integración distinta de la estable | sdd-kit.json |`
  - `| 20 | Frenos (ídem, 3) | sdd-kit.json |`

  Paso 3: «… y el campo `ids` con la respuesta de la entrevista» pasa a «… el campo `ids` y las claves de control que el usuario respondió en 18–20». En `estructura.md`, la línea del árbol de `sdd-kit.json` pasa a `{ "version", "channel": "plugin"|"cli", "updated", "ids", "control"?, "merge"? }`, y `control` y `merge` solo llevan lo respondido. Comprobar que la ruta relativa del enlace resuelve desde `skills/sdd-init-greenfield/SKILL.md`.

- [ ] **Step 4: Brownfield.** El paso 3 del `SKILL.md` se reescribe:
  - «Generar documento a documento, con gate de revisión. **Cada turno termina con una sola pregunta de esta lista o con un solo documento para aprobar**».
  - Lista numerada: 1 ids (`tracker` / `sequence`; «no sé» deja `tracker`); 2 perfil; 3 política de merge (con la rama de integración que se ve en el repo; se salta si no hay una distinta de la estable); 4 frenos (2–4 del [bloque](../sdd-start-task/references/control-profiles.md#preguntas-de-las-claves-de-control)); 5 ¿changelog?; 6 solo si 5 es sí, ¿novedades para el cliente?
  - Todas van antes de la constitution. Se mantiene el caso sin usuario: documentos **PENDIENTES DE REVISIÓN** y preguntas pendientes.
  - Paso 5: el marcador incluye `control` y `merge` con lo respondido.
  - Paso 7, cierre: si faltan respuestas, las preguntas pendientes se listan junto a las discrepancias.
  - En `generacion.md`: el marcador del paso 5 añade `"control"?` y `"merge"?`, y la frase del changelog del paso 5 remite a la lista del paso 3, no la duplica.

- [ ] **Step 5: Migración v1.2.0.**
  - Cabecera: el predicado añade «o las claves de frenos».
  - Paso 2: pasa a «**Claves de control.** Por cada clave que falte (`control.profile`, un bloque `merge` completo, `control.maxParallelAgents` o `control.silence.*`), la pregunta correspondiente del [bloque](../../../sdd-start-task/references/control-profiles.md#preguntas-de-las-claves-de-control), una por turno; lo que ya estaba no se pregunta». Se mantiene el caso sin dev-lead, con los defaults.
  - Paso 3: el marcador añade `control.maxParallelAgents` y `control.silence` si se respondieron.
  - Verificación: la línea de `control.profile` pasa a «devuelve un perfil válido, o el informe lo lista como pendiente; ídem para los frenos».

- [ ] **Step 6: Verde.** `git mv` del test aparcado a `tests/ControlProfiles.Tests.ps1` (o sobrescribirlo con la versión aparcada y borrar la copia). Ejecutar `Invoke-Pester tests/`. Esperado: todo verde, y el `It` nuevo pasa.

- [ ] **Step 7: Commit.** `feat(sdd): claves de control en las entrevistas de las init y en la migración v1.2.0`, con el cuerpo en castellano.

### Task 2 — GREEN

**Modelo**: sujetos Sonnet, simulador Haiku (los del RED); el veredicto lo da el hilo principal.
**Ejecución**: en línea. Motivo: sujetos headless, trabajo del hilo por método.
**Tests RED**: no aplica; la evidencia es `tests/init-control-keys-green.md`.

**Interfaces**:
- Consume: el kit con la Task 1 (una copia limpia nueva en `$SDD_SCRATCH/kit`), y `red/driver.py`, con la detección de «FIN.» ya corregida.
- Produce: `tests/init-control-keys-green.md`.

**Ficheros**: crear `green/` (personas, moldes y `out/`) y `tests/init-control-keys-green.md`.

- [ ] **Step 1: Copia limpia del kit** (`skills/` y `.claude-plugin/`) en `$SDD_SCRATCH/kit`. Comprobación previa de los seis puntos en cada escenario.
- [ ] **Step 2: G1 brownfield**, 2 sujetos, tope de 16 turnos, molde `e2-code`. Es la persona del RED más tres respuestas: perfil «el que recomiendes», merge «sí» y frenos «sí, los de por defecto». Esperado:
  - una pregunta o un documento por turno;
  - perfil y frenos preguntados en turnos distintos, con su recomendación;
  - el merge **no** se pregunta (solo hay `master`);
  - `sdd-kit.json` lleva `control.profile: delegate` y los tres frenos, y no lleva `merge`.
- [ ] **Step 3: G2 greenfield situado**, 2 sujetos, tope de 5 turnos, molde `e3-absent`. La petición invoca `sdd-kit:sdd-init-greenfield` con las preguntas 1–17 respondidas (git-flow con `develop`, sin worktrees). La persona contesta «delegate», «sí» y «no sé». Esperado:
  - tres turnos con una pregunta cada uno;
  - la propuesta de merge nombra `develop`, `--no-ff` y el worktree a cargo de una persona;
  - si el sujeto llega a escribir `sdd-kit.json`, no lleva los frenos.
- [ ] **Step 4: G3 migración**, 2 sujetos, tope de 5 turnos. Molde con `.docs/sdd/` mínima, `sdd-kit.json` `{version 1.1.0, ids sequence, control.profile delegate}` y ramas `main` y `develop`. Petición: «Invoca la skill sdd-kit:sdd-init-brownfield: actualízame al kit». La persona contesta «sí» al merge y «sí» a los frenos. Esperado:
  - no pregunta el perfil;
  - merge y frenos en turnos distintos;
  - el marcador acaba con `merge` completo y los tres frenos.
- [ ] **Step 5: Evidencia.** Tabla de frentes por sujeto, citas y coste en `tests/init-control-keys-green.md`. Si un escenario falla, se cierra el hueco y se repite solo ese escenario.
- [ ] **Step 6: Commit.** `test(sdd): GREEN de las claves de control en las init`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h (incluye el RED previo, 9,83 $)
- Estimación de implementación: 2 h (Task 1: 0,75 h; Task 2: 1,25 h de reloj de campaña)
- Base de la estimación: cinco ficheros de prosa y un test; la campaña es la misma forma que la de la 0012, más corta. Ratio `docs` del estimation-log: 0,52
- Confianza: media (el coste de la campaña depende de lo que tarde cada entrevista)

---

## 3. Validación final

- [ ] `Invoke-Pester tests/` en verde
- [ ] GREEN: los tres escenarios pasan, o el hueco está cerrado y repetido
- [ ] Cada requisito de la spec tiene su task (§4)
- [ ] Cierre de rama con `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «La entrevista hace una sola pregunta por turno» (greenfield y brownfield, un documento por turno) → Task 1, step 4; Task 2, G1 (brownfield) y G2 (greenfield). ✓
- ADDED «La entrevista fija las claves de control», THEN de las tres preguntas con recomendación → Task 1, steps 2–4; G1 y G2. ✓
- ADDED, AND de escribir solo lo respondido y de que «no sé» no escribe → Task 1, step 2; G2 (frenos «no sé»). ✓
- ADDED, AND de la rama de integración estable → Task 1, step 2; G1 (solo `master`). ✓
- ADDED, AND de brownfield sin usuario → Task 1, step 4. Sin escenario: el RED de la 0012 (E3) ya mide que las init sin usuario esperan o marcan pendiente, y esto solo añade las claves a esa lista. ✓
- MODIFIED de la migración → Task 1, step 5; G3. ✓
- Decisión 2 de la spec (fuente única) → test Pester, Task 1, step 1. ✓
