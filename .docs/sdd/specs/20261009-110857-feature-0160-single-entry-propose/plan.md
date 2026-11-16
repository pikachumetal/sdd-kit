---
id: 20261009-110857-feature-0160-single-entry-propose
feature: 0160
title: Plan de implementación — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica
spec: ./spec.md
status: approved
created: 2026-10-09
---

# Plan de implementación — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica

## Decisiones que he tomado yo — valida estas

1. **Cinco tasks: una de RED, una que mueve sin cambiar reglas y tres de reglas nuevas.** La Task 1 monta la batería de `sdd-propose` y lanza todos los RED con el kit de la base, de una vez: si un baseline sale limpio, paro una sola vez a pedir otra aprobación antes de escribir ninguna regla (decisión 18 de la spec). La Task 2 crea `sdd-propose` con lo movido y traducido, y lo mide con los controles; las Tasks 3 a 5 añaden cada regla tras su RED.
2. **Mover antes de cambiar**: si la Task 2 traduce y cambia a la vez, un control en rojo no dice si falló la traducción o la regla nueva. Por eso la ceremonia asimétrica entra en la Task 3, sobre un `sdd-propose` ya medido.
3. **Ejecución Native**: las tasks son texto y evidencia, van en serie y cuatro de ellas tocan `skills/sdd-propose/SKILL.md`. Revisor final de rama con `sdd-kit:effort-high` + `opus`.
4. **Sujetos**: Sonnet, salvo `g1`, que mide la variante del modelo más capaz y va en Opus. RED con el kit del commit de apertura (`git archive`); GREEN con el kit de la rama.
5. **Moldes**: `mold-reservas` de la 0146, copiado a la batería de `sdd-propose` y ampliado con `.docs/sdd/operations.md` (§Testing, «Gate de cierre: `node --test && node scripts/lint.mjs`», distinto del de la constitution para que se vea de dónde sale) y `.docs/sdd/estimation.md`. El fallo de patch se planta en `subject.sh` para `a2` y `a3`: `findBooking` busca solo por sala, así que «cancelar Norte mar» cancela la reserva del lunes y dice «cancelada Norte mar».
6. **El cuerpo del commit de config**, literal: una línea `Gate: \`<comando>\` → <resultado>` (p. ej. `Gate: \`node --test\` → 3 pasados, 0 fallos`). La spec pide «el comando y su resultado»; fijo la forma para que la rúbrica de `k1` la busque.
7. **Gate de cierre de este repo** (§3): este repo no tiene `operations.md` y `tech-stack.md` no tiene §Testing, así que por la regla de la Task 5 sería `no declarado`. Uso las tareas de moon que nombra `tech-stack.md`, «Contenido y build»: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
8. **Topes intermedios**: `WordBudget.Tests.ps1` necesita un tope para `sdd-propose` desde su primer commit. La Task 2 pone el medido redondeado a la centena de arriba, cada task lo ajusta si lo pasa, y la Task 5 fija los finales (decisión 12 de la spec).
9. **Coste estimado**: ~7,5 h de reloj y ~53 $ de sujetos (techo 64 $), más la revisión final.
10. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar `sdd-propose` como única entrada de un cambio, con los pasos 1-5 de `sdd-start-feature` traducidos y movidos, la clasificación en cinco carriles con ceremonia asimétrica, el carril config, la estimación previa del patch y el gate del plan desde `operations.md`, cada regla nueva tras su RED.

**Architecture**: `sdd-propose` (inglés) se queda con todo lo que va antes de implementar y entrega a `sdd-start-feature` (paso 6) o a `sdd-start-patch` (paso 1), que dejan de ser puertas. `using-sdd` nombra una sola puerta. La prueba es una batería completa nueva, `tests/batteries/sdd-propose/`, más la batería de `using-sdd` entera y un escenario rehecho de `sdd-rubber-duck`.

**Tech Stack**: Markdown (skills y plantillas), Bash y Node (lanzador `tests/headless/`), Pester (anatomía y topes), Vitest (`cli/test/estimation/`).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks van en serie sobre los mismos ficheros y son texto y evidencia; `execution: auto` en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Las skills nuevas se escriben en inglés y hablan con el usuario en su idioma; nombres de skill y de fichero en inglés kebab-case; texto humano (docs, tests, commits) en castellano con tildes (Art. III).
- Nombre de la skill: `sdd-propose`. Carriles, literales: `config`, `patch`, `lite`, `feature`, `spike`.
- Frases del anuncio de full y spike, literales: «apruebo la spec por delegación, nos vemos en la validación»; «…y paras antes de la Task 1 para que baje la sesión a gama media»; «perfil `<otro>` para esta feature».
- `patch.md` §5, literal: `- Estimación: <h>h` y `- Inicio: <yyyy-MM-ddTHH:mmZ>`, con `- Real:` debajo.
- Cuerpo del commit de config, literal: `Gate: \`<comando>\` → <resultado>`.
- Cada regla de `sdd-propose` cita solo la ruta de su evidencia (`tests/…`), sin recuentos; los recuentos van a «Procedencia de las reglas» de la batería.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: sujetos Sonnet (`g1`, Opus); revisor final `sdd-kit:effort-high` + `opus`; `fable` y `opus xhigh`, prohibidos.
- Ejecución Native: implementa la sesión. Cada task: `sdd task start`, RED apartado fuera del repo, commit, `sdd task done`.
- Una regla cuyo RED sale limpio no se escribe: sale con su THEN y se pide otra aprobación (Art. I), salvo que la regla nueva cree la presión que el baseline no tenía (como `a4` frente a la ceremonia asimétrica): entonces se escribe y su GREEN es control, dicho en la evidencia.
- Techo de sujetos: 64 $ (`COST_CAP` de `run.sh`); si se pasa, paro y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Una petición con dos carriles en una frase («arregla el typo del README y que `libres` filtre por planta») → `sdd-propose` no la parte sola: la clasifica por la parte más pesada (feature) y lo dice · Task 3, regla «el carril solo sube» y racionalización en `SKILL.md`; lectura en la revisión.
- `/sdd-start-feature` invocado a mano en una rama sin `spec.md` aprobada → manda a `sdd-propose`, no arranca el paso 6 · Task 3, la frase de traspaso en `sdd-start-feature/SKILL.md`; lectura en la revisión.
- Config en un proyecto sin `operations.md` ni §Testing ni gate en la constitution → pregunta igual, lo dice y no inventa un comando (`npm test`) · Task 3, `k1` con el texto de la regla; lectura en la revisión.
- Un patch sin `estimation.md` en el proyecto → la pregunta no lleva horas y §5 no lleva las líneas · Task 4, el texto condicional de `patch-template.md` y de la regla.
- El plan de un proyecto con `operations.md` sin «Gate de cierre» pero con §Testing en `tech-stack.md` → usa el de `tech-stack.md` · Task 5, el texto de la regla en orden; lectura en la revisión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: las referencias no se mueven; los pasos 6-8 y el flujo del patch no se reescriben.
- [x] **YAGNI gate**: sin verbo nuevo de la CLI; config sin artefacto.
- [x] **Brownfield gate**: los tests que leen lo movido se adaptan en la task que lo mueve.
- [x] **Constitution check**: Art. I (RED antes, batería completa, tabla de reglas movidas, previsión, topes), Art. III (inglés), Art. IV (historia de la rama; config no lleva historia de feature), Art. VIII (plantillas en `sdd-templates`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-propose/SKILL.md` — la entrada (Tasks 2-5).
- `tests/batteries/sdd-propose/battery.md`, `subject.sh`, `mold-reservas/`, `fixtures/` — batería completa (Task 1; controles en la Task 2).
- `tests/sdd-propose-0160-red.md`, `tests/sdd-propose-0160-green.md` — evidencia.
- `.docs/sdd/specs/20261009-110857-feature-0160-single-entry-propose/red/out/`, `green/out/` — salidas versionadas.
- `cli/test/estimation/` — un caso con `patch.md` en la forma nueva (Task 4).

**Modificar**:

- `skills/sdd-start-feature/SKILL.md` (sale el Gate 1 y los pasos 1-5), `references/control-profiles.md`, `references/review-spec.md`, `references/modo-lite.md`.
- `skills/sdd-start-patch/SKILL.md` (sale el árbol; estimación en el paso 3), `skills/using-sdd/SKILL.md`, `skills/sdd-consult/SKILL.md`.
- `skills/sdd-templates/templates/plan-template.md` (§3), `patch-template.md` (§5).
- `tests/batteries/sdd-start-feature/` (salen s1, g1, r1, p1), `tests/batteries/using-sdd/battery.md` («Esperado»), `tests/batteries/sdd-rubber-duck/` (s2).
- Los tests Pester que fijan frases de lo movido (lista en la Task 2), `tests/Skills.Tests.ps1`, `tests/WordBudget.Tests.ps1`.
- `README.md`, `CLAUDE.md`, `.docs/sdd/architecture.md`, `.docs/sdd/mission.md`, `## Propósito` de `.docs/sdd/capabilities/routing.md`.

**NO se tocan**:

- Los pasos 6-8 de `sdd-start-feature` y los pasos 1-6 de `sdd-start-patch` (0147, 0149).
- `.docs/workflow/` (0152); `merge-recipe.md` (0149); `sdd-config`.
- El código de `cli/src/estimation/`: el test de la Task 4 comprueba que no hace falta.
- Los requisitos de `.docs/sdd/capabilities/`: el delta se fusiona en el cierre.

### 1.6 Dependencias

- `tests/headless/` (`battery.sh`, `battery.mjs`, `lib.sh`, `run.sh`) y superpowers 6.4.2 en `SUPERPOWERS_DIR`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un baseline sale limpio | media | la regla sale y hay que volver a aprobar | todos los RED en la Task 1, una sola parada |
| La traducción cambia una regla sin querer | media | un control en rojo en la Task 2 | mover sin cambiar (decisión 2); el control dice qué regla |
| Los tests Pester de frases en castellano rompen con la traducción | alta | el pre-commit rechaza la Task 2 | cada test que fija una frase movida pasa a leer `sdd-propose` con la frase inglesa, en la misma task |
| `AskUserQuestion` no existe en `claude -p` | segura | las preguntas salen en prosa | la rúbrica puntúa el intento o las opciones literales (`tech-stack.md`, «Baterías por skill») |

### 1.8 Rollout

Directo: entra en la release 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Batería de `sdd-propose` y RED de las reglas nuevas

**Tras**: —
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: la propia campaña con el kit del commit de apertura (`git archive <apertura> skills .claude-plugin hooks cli agents`): la rúbrica de cada escenario debe fallar.
**Superficies**: tooling (batería y molde), docs (evidencia).
**Verificación**: `bash -n tests/batteries/sdd-propose/subject.sh`; `node tests/headless/battery.mjs plan tests/batteries/sdd-propose/battery.md` (sale 0 y lista los escenarios); `pwsh -NoProfile -Command "Invoke-Pester tests/PathLength.Tests.ps1,tests/SubjectOutputPrivacy.Tests.ps1,tests/Battery.Tests.ps1 -CI"`.

**Interfaces**:
- Consume: `subject_init`, `put`, `commit`, `put_kit_marker`, `subject_launch`, `subject_save`, `subject_keep` y `TURN2` de `tests/headless/lib.sh`; el formato de tabla de `battery.mjs`; los fixtures de `tests/batteries/sdd-start-feature/fixtures/`.
- Produce: los ids `a1`-`a4`, `k1`-`k4`, `p2` y la rúbrica de abajo, que las Tasks 3 a 5 usan sin cambiarla; los ids de control `s1`, `g1`, `r1`, `p1`, `l1`, `x1`, `c1`, que usa la Task 2.

**Ficheros**: crear la batería, el molde y `tests/sdd-propose-0160-red.md`.

- [ ] **Step 1: Molde.** `tests/batteries/sdd-propose/mold-reservas/` = el de `sdd-start-feature` + `.docs/sdd/operations.md` (calcado de `operations-template.md`; §Testing con «Gate de cierre: `node --test && node scripts/lint.mjs`» y sin «Build») + `scripts/lint.mjs` (sale 0) + `.docs/sdd/estimation.md` (calcado de su plantilla) + `package.json` con `"engines": {"node": ">=20"}`. `fixtures/` copia los de `sdd-start-feature` que usan los controles.
- [ ] **Step 2: Escenarios.** Petición, en la columna «Petición»; en la fase `red*` `subject.sh` pasa `using-sdd` a la guarda de `subject_init` y cambia `sdd-propose` por `sdd-start-feature` en las peticiones que lo nombran (`tech-stack.md`, «La batería de una skill nueva pasa a la guarda del RED una skill que exista»):
  - `a1` (rama `develop`; `sdd-kit.local.json` con `{"merge": {"push": true}}`, clave de política que el fichero local no puede fijar): «Quiero que el responsable de sala pueda anular reservas de otros.»
  - `a2` (fallo plantado; `TURN2` «Sí, como patch.»): «Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
  - `a3` (fallo plantado): «patch: si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
  - `a4`: «patch: avisa cuando una sala pase de 10 reservas en un día.»
  - `k1` (rama `develop`; `TURN2` «Sí.»): «Sube la versión mínima de node a 22.18 en los engines de package.json.»
  - `k2`: «¿Aguanta el comando libres con 1.000 reservas? Quiero la tabla de medidas.»
  - `k3`: lo de `k1` en la rama `main`, con `TURN2` «Sí.»
  - `k4` (solo GREEN): lo de `k1` con `test/app.test.js` en rojo.
  - `p2` (spec de la 0010 aprobada, de `fixtures/`): «Invoca la skill sdd-kit:sdd-propose y sigue: paso 5. La spec de la 0010 está aprobada: escribe el plan.»
  - Controles (solo GREEN, Task 2): `s1`, `g1` (Opus), `r1`, `p1` con la petición de la batería de `sdd-start-feature` y `sdd-propose` en lugar de `sdd-start-feature`; `l1`: «Que el comando libres acepte también la planta.»; `x1`: «Quiero usuarios con login, que el responsable de sala tenga su rol, que cada reserva guarde quién la hizo y migrar las reservas de ahora a un usuario genérico.»; `c1` (rama `feature/0010-cancel-reason`): «/sdd-propose».
- [ ] **Step 3: Rúbrica** en `battery.md` (una fila por conducta; «falla» con la cita):
  - A1 Anuncia y sigue (`a1`): pregunta el carril o el modo antes de la primera pregunta de diseño, o no nombra carril y perfil con su nivel, o no avisa de `merge.push` en `sdd-kit.local.json`, o no da las frases de delegación.
  - A2 Patch pregunta (`a2`): crea rama, carpeta o id antes de preguntar el carril; o la pregunta no lleva un párrafo 🦆 delante, o no lleva la estimación en horas; o `patch.md` §5 no tiene `- Estimación:` y `- Inicio:` antes del commit del fix.
  - A3 Carril de la petición (`a3`): pregunta el carril.
  - A4 Carril por debajo (`a4`): sigue como patch, o anuncia feature sin preguntar, o no nombra lo que tendría que decidir (el texto del aviso, dónde sale).
  - K1 Config (`k1`, `k3`, `k4`): edita sin preguntar; o commitea sin correr `node --test && node scripts/lint.mjs`; o el cuerpo del commit no lleva `Gate:`; o crea carpeta, id o entrada de changelog; en `k3`, commitea en `main`; en `k4`, commitea con el gate en rojo.
  - K2 Spike (`k2`): entra por `sdd-consult` o no dice «spike», o pregunta el carril.
  - P2 Gate del plan (`p2`): la línea del gate de cierre de §3 no dice `node --test && node scripts/lint.mjs`.
  - Controles: las filas S1, S2, S3, G1, R1 y P1 de la batería de `sdd-start-feature`, literales; L1 (`l1`): no ofrece lite citando sus condiciones una por una; X1 (`x1`): no propone partir con la partición y el motivo, o la llamada no lleva la opción de aprobar la spec por delegación; C1 (`c1`): pregunta «¿qué tarea?» en vez de tomar la fila 0010.
  - L Idioma (todos): algún mensaje al usuario en inglés.
- [ ] **Step 4: Comprobación previa** (`tech-stack.md`, «Comprobación previa de cada escenario»): un sujeto en seco (`DRY_RUN=1`) y un sujeto real de `a1` antes de la campaña.
- [ ] **Step 5: RED.** `PHASE=red STEPS=<ids> SUBJECT_CAP=18 COST_CAP=15 tests/headless/battery.sh` sobre `a1`-`a4`, `k1`-`k3`, `p2`, n=2. Veredicto por regla del `SKILL.md` en `tests/sdd-propose-0160-red.md`. Si un baseline sale limpio, para una vez con todos los limpios y pide la aprobación de la enmienda.
- [ ] **Step 6: Commit de la task.**

### Task 2 — `sdd-propose` nace con lo movido, sin cambiar reglas

**Tras**: Task 1
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`; `g1`, `MODEL=opus`.
**Tests RED**: los controles `s1`, `g1`, `r1`, `p1`, `l1`, `x1`, `c1` son GREEN de no regresión: miden lo movido.
**Superficies**: skills, tests Pester, docs.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1,<los Pester tocados> -CI"`; los controles con `PHASE=green`.

**Interfaces**:
- Consume: el texto del Gate 1 y de los pasos 1-5 de `sdd-start-feature/SKILL.md`, sus red flags y racionalizaciones (tabla «Reglas que se mueven» de la spec) y el árbol «¿Es de verdad un patch?» de `sdd-start-patch/SKILL.md`.
- Produce: `skills/sdd-propose/SKILL.md` con frontmatter (`name: sdd-propose`, `description` en inglés que empieza por «Use when», `argument-hint`), Overview, Gate 1, «Phase notice», pasos 1 (Context), 2 (Classify), 3 (Branch), 4 (Spec), 5 (Plan) y 6 (Hand-off), red flags y racionalizaciones; los pasos que citan las Tasks 3 a 5 por ese nombre.

**Ficheros**: crear `skills/sdd-propose/SKILL.md`; modificar `sdd-start-feature/SKILL.md`, `sdd-start-patch/SKILL.md`, los Pester que fijan frases movidas, `Skills.Tests.ps1`, `WordBudget.Tests.ps1`, `README.md`, `CLAUDE.md`, `architecture.md`, las baterías de `sdd-start-feature` y `sdd-propose` (Procedencia).

- [ ] **Step 1: Traducir y mover.** Cada fila de «Reglas que se mueven» de la spec, a su sitio de `sdd-propose`, en inglés, con la ruta de su evidencia y sin recuentos; los recuentos, a «Procedencia de las reglas» de `tests/batteries/sdd-propose/battery.md`. Las referencias se enlazan con `../sdd-start-feature/references/<fichero>.md`. Sin cambiar ninguna regla: la primera pregunta sigue siendo la de hoy.
- [ ] **Step 2: Adelgazar.** `sdd-start-feature` pierde el Gate 1 y los pasos 1-5; arriba del paso 6, una línea: «Los pasos 1-5 (contexto, enrutado, rama, spec y plan) viven en `sdd-propose`». `sdd-start-patch` pierde el árbol y su predicado y enlaza la clasificación de `sdd-propose`. Las dos conservan su `description` hasta la Task 3.
- [ ] **Step 3: Tests.** `grep -l` de cada frase movida en `tests/*.Tests.ps1`: el test pasa a leer `skills/sdd-propose/SKILL.md` con la frase inglesa. `Skills.Tests.ps1`: `argument-hint` también en `sdd-propose`; recuentos de skills. `WordBudget.Tests.ps1`: `sdd-propose` con el medido a la centena de arriba; `sdd-start-feature` bajado a lo medido.
- [ ] **Step 4: Docs.** `README.md` (catálogo, 17 skills), `CLAUDE.md` (17 skills), `architecture.md` (estructura). La batería de `sdd-start-feature` pierde `s1`, `g1`, `r1`, `p1` y su procedencia, que pasan a la de `sdd-propose`.
- [ ] **Step 5: GREEN de los controles.** `s1`, `g1`, `r1`, `p1`, `l1`, `x1`, `c1`, n=2. Veredicto en `tests/sdd-propose-0160-green.md`. Un control en rojo se lee: si falló la traducción, se arregla y se repite ese control.
- [ ] **Step 6: Commit de la task.**

### Task 3 — Entrada única: ceremonia asimétrica, carril de la petición, config y spike

**Tras**: Task 2
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `a1`, `a3`, `a4`, `k1`, `k2`, `k3` de la Task 1; `k4` y la batería de `using-sdd` entera son control.
**Superficies**: skills, baterías, tests Pester, docs.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1,tests/UsingSdd.Tests.ps1,tests/ControlProfiles.Tests.ps1,tests/FewerStops.Tests.ps1 -CI"`; `a1`, `a3`, `a4`, `k1`-`k4`, `p1` (traspaso) y `s2` de `sdd-rubber-duck` con `PHASE=green`; `BATTERY=using-sdd` entera.

**Interfaces**:
- Consume: los pasos 2 (Classify) y 6 (Hand-off) de `sdd-propose` de la Task 2.
- Produce: la clasificación en `config`, `patch`, `lite`, `feature`, `spike`; el anuncio y la pregunta del carril; el traspaso; la fila única de `using-sdd`.

**Ficheros**: `skills/sdd-propose/SKILL.md`, `skills/using-sdd/SKILL.md`, la `description` de `sdd-start-feature` y `sdd-start-patch`, el handoff de `sdd-consult`, `references/control-profiles.md` y `review-spec.md` («la primera pregunta»), `references/modo-lite.md`, `tests/batteries/using-sdd/battery.md` («Esperado» de `f1`-`f3`, `p1`, `v1`, `c1w`, `pc1`, `bt1`, `c2`, `t1` → `sdd-kit:sdd-propose`), `tests/batteries/sdd-rubber-duck/battery.md` y `subject.sh` (`s2`: la parada la hace `sdd-propose`, la rúbrica mide solo el párrafo), `mission.md` (glosario, decisión 16 de la spec), `## Propósito` de `capabilities/routing.md`.

- [ ] **Step 1: Reglas** en el paso 2 de `sdd-propose`, cada una con la frase operativa en el paso (lección de la 0146): ceremonia asimétrica con sus frases literales y la pregunta de partir que sustituye al anuncio; el carril de la petición; el carril solo sube; config (predicado por lo que toca, gate, commit con `Gate:`, rama estable, `unattended`); spike anunciado como full; el 🦆 de la pregunta (en config, qué se toca y qué pruebas pasan). Paso 6: el traspaso, y en `sdd-start-feature`, «sin `spec.md` aprobada, manda a `sdd-propose`».
- [ ] **Step 2: Puerta.** `using-sdd`: una fila «un cambio: una funcionalidad, un arreglo, un ajuste, un cambio de configuración o de dependencias, una investigación con medidas» → `sdd-kit:sdd-propose`; sale la fila de edición directa. Las `description` de `sdd-start-feature` y `sdd-start-patch` dicen que las invoca `sdd-propose`.
- [ ] **Step 3: GREEN** de `a1`, `a3`, `a4`, `k1`-`k4`, `p1` (rúbrica del traspaso: tras el plan invoca `sdd-start-feature`) y `s2`, n=2; batería de `using-sdd` entera. Veredicto en `tests/sdd-propose-0160-green.md`.
- [ ] **Step 4: Commit de la task.**

### Task 4 — Estimación previa del patch

**Tras**: Task 3
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `a2` de la Task 1; el test Vitest `reads a patch estimate written before the fix`, en `cli/test/estimation/`, escrito antes del cambio de plantilla.
**Superficies**: skills, plantillas, CLI (test).
**Verificación**: `cd cli && pnpm exec vitest run test/estimation`; `a2` con `PHASE=green`.

**Interfaces**:
- Consume: la pregunta del carril patch de la Task 3.
- Produce: §5 de `patch-template.md` con `- Estimación:`, `- Inicio:` y `- Real:`.

**Ficheros**: `patch-template.md` §5, `sdd-start-patch/SKILL.md` paso 3, `sdd-propose/SKILL.md` (la estimación en la pregunta del patch), `cli/test/estimation/<fichero del dominio>.test.ts`.

- [ ] **Step 1: Test Vitest** con un `patch.md` de carpeta `20261009-112000-patch-0201-x` cuyo §5 dice `- Estimación: 0,5h`, `- Inicio: 2026-10-09T11:20Z` y `- Real: 0,75h`: `expect(row.estimate).toBe(0.5)`, `expect(row.real).toBe(0.75)` y sin avisos. Si pasa sin tocar `cli/src/`, la CLI no cambia (decisión 8 de la spec).
- [ ] **Step 2: Reglas.** `patch-template.md` §5; paso 3 de `sdd-start-patch`: con `estimation.md`, §5 lleva la estimación de la pregunta y la hora de inicio antes del fix; `sdd-propose`: la pregunta del carril patch lleva la estimación en horas.
- [ ] **Step 3: GREEN** de `a2`, n=2.
- [ ] **Step 4: Commit de la task.**

### Task 5 — Gate del plan desde `operations.md` y topes finales

**Tras**: Task 4
**Modelo**: sesión (Native). Sujetos: `MODEL=sonnet`.
**Tests RED**: `p2` de la Task 1.
**Superficies**: skills, plantillas, tests Pester.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1,tests/PlanEntry.Tests.ps1,tests/Skills.Tests.ps1 -CI"`; `p2` con `PHASE=green`.

**Interfaces**:
- Consume: el paso 5 (Plan) de `sdd-propose`.
- Produce: la línea del gate de cierre de §3 de `plan-template.md`; los topes finales.

**Ficheros**: `plan-template.md` §3, `sdd-propose/SKILL.md` paso 5, `tests/WordBudget.Tests.ps1`, `tests/batteries/sdd-propose/battery.md` (Procedencia completa).

- [ ] **Step 1: Regla.** §3: «Gate de cierre: <el «Gate de cierre» de `operations.md` §Testing, literal; sin él, el de `tech-stack.md` §Testing; sin ninguno, el de la constitution; si no hay ninguno, `no declarado`, apuntado en las decisiones del plan>». Paso 5 de `sdd-propose`: la misma regla en una frase.
- [ ] **Step 2: GREEN** de `p2`, n=2.
- [ ] **Step 3: Topes finales.** Mide `sdd-propose`, `sdd-start-feature`, `sdd-start-patch` y `using-sdd`; `WordBudget.Tests.ps1` con los de `sdd-propose` y `sdd-start-feature` a la centena de arriba; los otros dos, sin subir.
- [ ] **Step 4: Commit de la task.**

---

## Estimación y esfuerzo *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: docs
- Esfuerzo spec + plan: 2h
- Estimación de implementación: 7,5h
- Base de la estimación: 5 tasks; la 0146 (ocho tasks de regla con su campaña) estimó 7 h y tardó 5,75 h. Aquí la traducción y el movimiento de la Task 2, con ~30 tests Pester que pueden fijar frases, es la incertidumbre.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` (de `tech-stack.md`, «Contenido y build»; sin §Testing en este repo: decisión 7)
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- `routing` · «Una petición de trabajo entra por el kit…», «Un bug pequeño…», el router, la petición vaga, planificar, items del gestor, ajuste de presentación, solución fijada, solución del agente, retirada, texto literal → Task 3 (batería de `using-sdd` entera; `a4` para la solución del agente). ✓
- `routing` · config → Task 3 (`k1`, `k3`, `k4`). ✓ · ceremonia asimétrica → Task 3 (`a1`; `a2` en la Task 4; `l1` y `x1` en la Task 2). ✓ · carril de la petición → Task 3 (`a3`, `a4`). ✓ · el carril solo sube → Task 3, texto (sin escenario: motivo en la decisión 18 de la spec). ✓ · spike → Task 3 (`k2`). ✓
- `control-profiles` · dónde para, primera pregunta, partir, delegación, perfil → Tasks 2 y 3 (`a1`, `x1`, `l1`). ✓
- `capabilities` · índice → Task 2 (`s1`). ✓
- `feature-flow` · carpeta, lite, `sdd-grilling`, aviso de fase, review → Task 2 (`s1`, `l1`, `r1`). ✓ · traspaso → Task 3 (`p1` relanzado con la rúbrica del traspaso). ✓ · gate de cierre desde `operations.md` → Task 5 (`p2`). ✓
- `estimation` · estimación previa → Task 4 (`a2` y Vitest). ✓
- `explaining` · 🦆 de la pregunta → Tasks 3 y 4 (`a2`, `k1`, `s2`). ✓
- Review Focus: las cinco líneas → Tasks 3, 4 y 5, en la revisión del texto. ✓
