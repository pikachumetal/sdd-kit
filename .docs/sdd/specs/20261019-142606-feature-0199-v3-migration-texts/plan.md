---
id: 20261019-142606-feature-0199-v3-migration-texts
feature: 0199
title: Plan de implementación — Migración v3.0.0, textos, reglas del proyecto y marcador
spec: ./spec.md
status: draft
created: 2026-10-19
---

# Plan de implementación — Migración v3.0.0: textos, reglas del proyecto y marcador

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**:
   - Implementa la sesión, en Native (Opus 5.5).
   - Los sujetos van en Sonnet y la persona en Haiku (`subject_converse`).
   - Revisión final por los ejes de `sdd-verify`: Spec con `sdd-kit:effort-high` + `opus` y Código con `sdd-kit:effort-high` + `sonnet`. El eje Arquitectura no va (línea de abajo).
2. **Ejecución**: Native (línea de abajo).
3. **Tres tasks y no cuatro**: la spec preveía 4. El molde con su RED es una, el texto de la migración otra, y la campaña GREEN la tercera; las reglas para escribir migraciones y los topes van con el texto, porque se prueban con los mismos Pester.
4. **Persona**: gana una línea para la tabla de reglas: «Quita la regla de los ids; las demás, déjalas.»
5. **El RED corre con el kit de `develop`**: `git archive HEAD skills .claude-plugin cli hooks` sobre el commit de apertura. Lo que mide es lo que falta con la 0197 sola.
6. **Riesgo alto**: `v1` ya llegaba cerca de 60 turnos con cuatro pasos, y gana cuatro más. `MAX_TURNS` de `v1` pasa de 60 a 90.
7. **Coste estimado**: ~3 h de implementación y ~2,5 $ en 11 sujetos.
8. **Review Focus**: 3 entradas; ver la sección.

**Goal**: `migrations/v3.0.0.md` termina con los pasos de nombres, estimación, marcador y revisión de reglas, más los backticks y los seis menores de la 0197; `sdd-upgrade` fija las reglas para escribir migraciones futuras.

**Architecture**: son pasos de texto que siguen el patrón de la `v2.0.0.md`: predicado, búsqueda con `git grep`, sustitución sin gate o tabla con gate, e informe. No hay código nuevo. La prueba es la batería de `sdd-upgrade` sobre el molde v2x ampliado.

**Tech Stack**: Markdown (migración y `SKILL.md`); Pester (`MigrationInitParity` y `WordBudget`); sujetos headless (`tests/headless/battery.sh`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks encadenadas sobre un mismo fichero de texto, sin interfaces de código entre ellas; un error lo caza la campaña de la Task 3, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una migración ya existente, una sección de `sdd-upgrade` y la batería; la estructura de documentos la fijó la 0197.

## Restricciones globales

### De código

- Art. X de la constitution, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell.
  - Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Los pasos de `v3.0.0.md` y la «Verificación» van en castellano; cada paso empieza por su predicado, y los gates van marcados **gate**.
- Ninguna búsqueda nueva usa `Select-String`. Todas son `git grep … --untracked`, sobre rutas que pueden no existir.
- Skills retiradas → nombre nuevo: `sdd-end-feature` y `sdd-end-patch` → `sdd-archive`; `sdd-consult` → `sdd-explore`; `sdd-init-greenfield` y `sdd-init-brownfield` → `sdd-init`.
- Commit de la revisión de reglas: `chore(sdd): reglas del proyecto que ya cubre el kit`. Commit de la versión: `chore(sdd): migrar al kit v3.0.0`.
- Topes: `sdd-upgrade` `SkillMd` y `Total` a 980; `Kit` a 87600.

### De proceso

- Native, con `sdd-implement` y `sdd-tdd`; revisión final por ejes con `sdd-verify`.
- `DRY_RUN=1` del molde antes del primer RED. Se para antes del sujeto 12.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 (1M context) <noreply@anthropic.com>`.

## Review Focus

- **Un proyecto sin `.claude/`, ni `AGENTS.md`, ni `estimation.md`**:
  - Esperado: el paso de nombres busca igual en lo que hay, el de estimación se salta y lo dice, y la «Verificación» no da error.
  - Lo fija la Task 2, por lectura de cada `git grep` con rutas inexistentes; `v1` no tiene `AGENTS.md`.
- **Una regla del proyecto que el kit cubre con otra forma, sin chocar** (por ejemplo, «el pre-commit corre los tests»):
  - Esperado: sale como «repite» solo si hay una ruta del kit que la diga; si no, fuera de la tabla.
  - Lo fija la Task 2, en el texto del paso 8, y `v1` V10, que no admite filas sin ruta.
- **Un `estimation.md` con los literales viejos y notas de calibración propias**:
  - Esperado: las notas no cambian.
  - Lo fija la Task 3, `v1` V8: el molde lleva una nota.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin código; pasos de texto y una batería que ya existe.
- [x] **YAGNI gate**: el molde gana solo lo que miden los THEN.
- [x] **Brownfield gate**: los pasos 1-3 de `v3.0.0.md` solo cambian en los seis menores, y de `v2.0.0.md` solo cambia su línea de «Verificación».
- [x] **Constitution check**: Art. I (RED antes, previsión de sujetos), Art. V (migración con `**Escribe**:` y «Verificación») y Art. XI.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-upgrade/mold-v2x/.claude/commands/pregunta.md` — un comando del proyecto que nombra `/sdd-consult`.
- `tests/v3-migration-texts-red.md` y `tests/v3-migration-texts-green.md` — la evidencia.

**Modificar**:

- `tests/batteries/sdd-upgrade/mold-v2x/` — `CLAUDE.md`, `.docs/sdd/estimation.md`, `.docs/sdd/constitution.md` y `.docs/sdd/roadmap.md` (la evidencia relativa de una deuda).
- `tests/batteries/sdd-upgrade/battery.md` — las filas V7-V12 de la rúbrica.
- `tests/batteries/sdd-upgrade/subject.sh` — volcado de los ficheros nuevos y `MAX_TURNS` 90 en `v1`.
- `tests/batteries/sdd-upgrade/persona-v2x.md` — la respuesta a la tabla de reglas.
- `skills/sdd-upgrade/references/migrations/v3.0.0.md` — los pasos 5-8, los backticks del paso 4, los seis menores, `**Escribe**:` y la «Verificación».
- `skills/sdd-upgrade/SKILL.md` — tres reglas en «Writing a new migration».
- `skills/sdd-upgrade/references/migrations/v2.0.0.md` — su línea de «Verificación» de los nombres.
- `tests/WordBudget.Tests.ps1` — los topes.

**NO se tocan**: las otras migraciones, la CLI, `sdd-propose` (decisión 9 de la spec) y los escenarios `o1`-`h2` de la batería.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `v1` se queda sin turnos antes del paso 8 | media | sin GREEN de V10-V11 | `MAX_TURNS` 90; la persona responde sin rodeos |
| El sujeto propone reglas sin ruta del kit, o rutas inventadas | media | tabla ruidosa | V10 lo cuenta como fallo; en el REFACTOR, la regla «sin ruta, no hay fila» con su literal |
| Coste por encima de la previsión | baja | más gasto | se para antes del sujeto 12 |

### 1.8 Rollout

Directo a `develop`; sale con la 3.0.0. Tras ella, la 0198 migra este repo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Molde, rúbrica y RED

**Tras**: —
**Modelo**: Native, la sesión (Opus 5.5)
**Tests RED**: hilo · `v1` (n = 2) con el kit de `develop`, antes de tocar `v3.0.0.md`
**Superficies**: tooling (batería)
**Verificación**: `DRY_RUN=1 BATTERY=sdd-upgrade STEPS=v3 bash tests/headless/battery.sh` → el molde se monta y `state.txt` vuelca `.claude/commands/pregunta.md`; después, la campaña RED
**Verificación lenta**: la campaña RED, ~25 min, en segundo plano
**Se prueba en la aplicación**: no, porque es la base de la prueba: el RED dice qué falta.

**Interfaces**:
- Consume: la batería de la 0197 (`battery.md`, `subject.sh`, `persona-v2x.md` y `mold-v2x/`).
- Produce: el molde con estos textos literales, que la Task 3 puntúa:
  - en `CLAUDE.md`, «Cierra cada feature con `sdd-end-feature`.» y «El roadmap vive en `.docs/sdd/roadmap.md`.»;
  - en `pregunta.md`, «Usa `/sdd-consult` para responder.»;
  - en la constitution, «**Ids**: el id de una feature se elige a mano, el siguiente libre del roadmap.»;
  - en `estimation.md`, las dos líneas viejas, más la nota «2026-09-20 — feature 0016: los informes semanales tardan el doble.»;
  - y las filas V7-V12 de la rúbrica.

**Ficheros**: crear `mold-v2x/.claude/commands/pregunta.md` y `tests/v3-migration-texts-red.md`; modificar `mold-v2x/CLAUDE.md`, `mold-v2x/.docs/sdd/estimation.md`, `mold-v2x/.docs/sdd/constitution.md`, `mold-v2x/.docs/sdd/roadmap.md`, `battery.md`, `subject.sh` y `persona-v2x.md`.

- [ ] **Step 1: Molde**:
  - `CLAUDE.md` gana las dos líneas de «Produce», sin tocar sus enlaces.
  - `.claude/commands/pregunta.md` se crea con su línea.
  - `estimation.md` pasa a ser el «Método» de la plantilla 2.x (`git show 6824eee8~1:skills/sdd-templates/templates/estimation-template.md`) con «salas» en el título, sin bloques `>` y con la nota de calibración de «Produce».
  - La constitution gana la línea de los ids.
  - La fila de deuda de SAL-45 del roadmap gana «([ticket](field-reports/sal-45.md))».
  - El molde sigue pasando `sdd roadmap check` en la forma 2.x.
- [ ] **Step 2: Batería**:
  - `subject.sh`: `MAX_TURNS` 90 en `v1`, y la lista del volcado gana `.claude/commands/pregunta.md` y `.docs/sdd/steering/estimation.md`.
  - `persona-v2x.md` gana: «Si te enseña una tabla de reglas del proyecto que ya cubre el kit: «Quita la regla de los ids; las demás, déjalas.»».
  - Rúbrica:

    | Fila | Escenario | Falla si… |
    | --- | --- | --- |
    | V7 Nombres | `v1` | `CLAUDE.md` o `pregunta.md` siguen nombrando `sdd-end-feature` o `/sdd-consult`, o no dicen `sdd-archive` y `/sdd-explore`; o cambió `specs/…-0016-weekly/walkthrough.md` |
    | V8 Estimación | `v1` | `steering/estimation.md` no tiene «Cuenta desde el arranque de la sesión que abre el trabajo» y `(post hoc)`, o perdió la nota de calibración |
    | V9 Backticks | `v1` | `CLAUDE.md` sigue con `` `.docs/sdd/roadmap.md` `` o no dice `` `ROADMAP.md` `` |
    | V10 Reglas | `v1` | no enseña la tabla de reglas con la de los ids y una ruta de `skills/`; tras «quita la de los ids», la constitution la conserva; o una fila no lleva ruta del kit |
    | V11 Orden | `v1` | el commit `chore(sdd): reglas del proyecto que ya cubre el kit` no va después de `chore(sdd): migrar al kit v3.0.0`, o `sdd-kit.json` no dice `3.0.0` |
    | V12 Reglas pendientes | `v2` | la constitution cambia o el informe no deja la revisión de reglas pendiente |

- [ ] **Step 3: DRY_RUN** — `DRY_RUN=1` del escenario `v1`. Esperado: el molde se monta, con `pregunta.md` en `state.txt`.
- [ ] **Step 4: RED** — `v1` ×2 con `KIT_DIR` = `git archive` del commit de apertura. Esperado: V7-V11 en rojo. Evidencia en `tests/v3-migration-texts-red.md`.
- [ ] **Step 5: Commit** — `test(sdd-upgrade): molde v2x con textos y reglas, y RED de la 0199`.

### Task 2 — Pasos de textos, marcador y reglas

**Tras**: Task 1
**Modelo**: Native, la sesión (Opus 5.5)
**Tests RED**: el RED de `v1` de la Task 1; hilo · `WordBudget`, que falla con los topes viejos al crecer `SKILL.md`; hilo · la línea `git grep` de `v2.0.0.md`, en una carpeta temporal con `git init` y sin `AGENTS.md`
**Superficies**: docs (migración y skill) · tooling (topes)
**Verificación**: `Invoke-Pester tests/MigrationInitParity.Tests.ps1, tests/WordBudget.Tests.ps1 -CI` → `Tests Passed: <n>, Failed: 0`
**Se prueba en la aplicación**: no; la migración entera se mide en la Task 3.

**Interfaces**:
- Consume: el molde y la rúbrica de la Task 1.
- Produce: `v3.0.0.md` con los pasos 5-8, la «Verificación» y la línea `**Escribe**:` con `sdd-kit.json` → `version`, `channel`, `updated` añadidos.

**Ficheros**: modificar `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `skills/sdd-upgrade/SKILL.md`, `skills/sdd-upgrade/references/migrations/v2.0.0.md` y `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: Paso 4 y menores**:
  - **Predicado del paso 4**: «Si el paso 1, el 2 o el 3 movieron algo», también en «Cómo se aplica cada paso».
  - **Backticks**: segunda búsqueda, `git grep -nE '`\.docs/sdd/(mission|tech-stack|environments|roadmap|changelog|constitution|architecture|estimation|estimation-log)\.md`' --untracked -- CLAUDE.md AGENTS.md README.md`, que corrige con la misma tabla de correspondencias.
  - **Hermanos**: en la salida se descartan también los enlaces sin carpeta de un fichero de `steering/` a un hermano de `steering/`.
  - **Nombres de skills**: «Las menciones a nombres de skills son del paso 5».
  - **Paso 2**: «Si el paso 3 queda pendiente, el informe nombra cada decisión abierta junto a él, con `git show <sha>:.docs/sdd/tech-stack.md`».
  - **Paso 1, log**: «La tabla enseña el diff de `sdd estimation log --root "<raíz>" --out <tmp>/estimation-log.md` contra el actual; tras el «sí», se regenera en su sitio».
  - **Paso 3, `parcial`**: la fila dice «anterior o posterior a la última release».
  - **Paso 3, Evidencia**: «un enlace relativo gana `../`».
- [ ] **Step 2: Pasos 5-8**:
  - **5. Nombres de skills**:
    - Predicado: `git grep -nE 'sdd-(end-feature|end-patch|consult|init-greenfield|init-brownfield)' --untracked -- CLAUDE.md AGENTS.md '.docs/sdd/*.md' '.docs/sdd/steering/*.md' '.docs/sdd/capabilities/*.md' .claude/skills .claude/commands` devuelve algo.
    - Sustituye por la tabla de nombres de las Restricciones, sin gate.
    - No toca la historia: `specs/`, `changes/`, `releases/`, `kit-feedback/`, `decisions/` ni `CHANGELOG.md`.
    - El informe lista los ficheros cambiados.
  - **6. Estimación**:
    - Predicado: existe `.docs/sdd/steering/estimation.md`.
    - Con los dos literales de la plantilla 2.x, los sustituye sin gate por las líneas de `estimation-template.md`. Copia aquí las dos líneas vigentes, literales.
    - Con otro texto: **gate**, con el texto del proyecto al lado de las dos líneas nuevas.
    - «Notas de calibración» no se toca.
  - **7. Marcador**:
    - Corre la «Verificación».
    - Después, `sdd upgrade --root "<raíz>" --mark 3.0.0` y el commit `chore(sdd): migrar al kit v3.0.0`, con los gates resueltos.
  - **8. Revisión de reglas**: **gate**, tras el commit del 7.
    - Lee `CLAUDE.md`, `AGENTS.md`, `PRODUCT.md` y `.docs/sdd/steering/*.md`.
    - Tabla con las columnas «Regla del proyecto · Dónde · Kit · Choca o repite · Propuesta».
    - Una regla sin una ruta del kit instalado (`${CLAUDE_PLUGIN_ROOT}/skills/…`) que la cubra no va a la tabla.
    - Aplica solo las filas aprobadas, en el commit `chore(sdd): reglas del proyecto que ya cubre el kit`.
    - Sin el «sí», la tabla va al informe como pendiente y no frena el marcador.
    - Sin filas, el paso se salta y lo dice.
  - **`**Escribe**:`** gana `sdd-kit.json` → `version`, `channel`, `updated`. La frase «Además…» añade, sin backticks, los nombres de skills (paso 5), el método de estimación (paso 6) y las reglas aprobadas (paso 8).
  - **«Verificación»** gana:
    - el `git grep` del paso 5, vacío;
    - el `git grep` de backticks del paso 4, vacío;
    - `sdd-kit.json` con `"version": "3.0.0"`.
- [ ] **Step 3: `SKILL.md`** — «Writing a new migration» gana tres frases:
  - toda migración acaba con la revisión de reglas de `v3.0.0.md` (su paso 8), después del marcador y sin frenarlo;
  - si la release cambia una regla que una plantilla copió a los proyectos, la migración lleva el paso que actualiza la copia;
  - ningún paso ni su «Verificación» pasa a `Select-String` una ruta que puede no existir: `git grep`.
- [ ] **Step 4: `v2.0.0.md`** — su línea de «Verificación» de los nombres pasa a ser la de la decisión 10 de la spec, literal. RED: en una carpeta temporal con `git init`, un `CLAUDE.md` que cita `sdd-end-task` y sin `AGENTS.md`, la línea vieja no devuelve la cita y la nueva sí.
- [ ] **Step 5: Topes** — `WordBudget`: `sdd-upgrade` a 980 (`SkillMd` y `Total`) y `Kit` a 87600.
- [ ] **Step 6: Verificación** — los dos Pester en verde.
- [ ] **Step 7: Commit** — `feat(sdd-upgrade): migración v3.0.0, textos, marcador y reglas del proyecto`.

### Task 3 — GREEN

**Tras**: Task 2
**Modelo**: Native, la sesión (Opus 5.5)
**Tests RED**: el RED de `v1` de la Task 1
**Superficies**: tooling (batería) · docs (si el REFACTOR toca `v3.0.0.md`)
**Verificación**: la campaña `BATTERY=sdd-upgrade STEPS="v3 v3-absent"`; si el REFACTOR toca texto, los dos Pester de la Task 2
**Verificación lenta**: la campaña, ~40 min, en segundo plano
**Se prueba en la aplicación**: sí. Con «Actualízame al kit.», el molde acaba en 3.0.0, sin nombres viejos, con el método nuevo y sin la regla de los ids, en dos commits.

**Interfaces**:
- Consume: `v3.0.0.md` de la Task 2.
- Produce: `tests/v3-migration-texts-green.md`.

**Ficheros**: crear `tests/v3-migration-texts-green.md`; `v3.0.0.md` si el REFACTOR lo pide.

- [ ] **Step 1: GREEN** — `v1` ×2 y `v2` ×1. Esperado: V1-V12 en verde.
- [ ] **Step 2: REFACTOR** — si una fila falla, una ronda con n = 2 por regla con literal (nombres, estimación y tabla de reglas), hasta 6 sujetos. Se para antes del sujeto 12.
- [ ] **Step 3: Commit** — `test(sdd-upgrade): GREEN de la 0199`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 3h
- Base de la estimación:
  - 3 tasks sobre una batería que ya existe;
  - la 0197 estimó 3,5 h con un molde nuevo;
  - las campañas son de ~25-40 min cada una.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, una vez y al cerrar (patch 0183)
- [ ] Criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha (Self-review)
- [ ] Cierre con `sdd-archive` y `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- **ADDED nombres**:
  - THEN `CLAUDE.md` y `pregunta.md` → Task 3, `v1` V7. ✓
  - AND las otras tres skills, en las rutas listadas → Task 2, el paso 5 por lectura; `v1` solo trae dos nombres. ⚠ (las otras tres, por lectura)
  - AND el walkthrough de `specs/` intacto → V7. ✓
  - AND el informe, o el paso saltado → `v1`, en `texts.txt`. ✓
  - AND la «Verificación» vacía, también sin `AGENTS.md` → Task 2, Step 2, y Review Focus 1. ✓
- **ADDED estimación**:
  - THEN las dos líneas → V8. ✓
  - AND las notas intactas → V8. ✓
  - AND un texto sin literales va a gate → Task 2 por lectura; el molde lleva los literales. ⚠ (por lectura)
  - AND sin `estimation.md`, el paso se salta → por lectura. ⚠
- **ADDED backticks**:
  - THEN `CLAUDE.md` → V9. ✓
  - THEN `README.md` → por lectura: el molde no la tiene entre backticks. ⚠
  - AND solo los movidos y aprobados → Task 2, Step 1. ✓
- **ADDED marcador y reglas**:
  - THEN `3.0.0` y el commit → V6 y V11. ✓
  - AND la tabla con la regla de los ids y su ruta → V10. ✓
  - AND solo lo aprobado, en su commit → V10 y V11. ✓
  - AND sin ruta no hay fila; sin filas, se salta → V10 y por lectura. ✓
  - AND sin el dev-lead, pendiente → `v2` V12. ✓
- **ADDED lo que queda pendiente o se regenera**:
  - THEN las decisiones abiertas en el informe → por lectura: el molde no rechaza el paso 3. ⚠
  - AND el diff con `--out` antes del gate → `v1`, en `tools.txt`. ✓
- **MODIFIED v2.0.0** → Task 2, Step 4 (RED con la carpeta temporal). ✓
- **«Lo que se retira o cambia de forma»** → Task 2, Steps 1 y 4. ✓
- **Review Focus** → Tasks 2 y 3. ✓
- **Lo que solo se observa por lectura** (marcado ⚠): lo mira el eje Spec de la revisión final; montar un escenario para cada caso pasaría la previsión de sujetos (spec, «Dónde se prueba»).
