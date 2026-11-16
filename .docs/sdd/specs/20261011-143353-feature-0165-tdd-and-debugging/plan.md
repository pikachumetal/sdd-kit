---
id: 20261011-143353-feature-0165-tdd-and-debugging
feature: 0165
title: Plan de implementación — sdd-tdd y sdd-debugging, forks delgados
spec: ./spec.md
status: approved
created: 2026-10-11
---

# Plan de implementación — `sdd-tdd` y `sdd-debugging`

## Decisiones que he tomado yo — valida estas

1. **Cinco tasks, en este orden**:
   - Task 1: los RED y el escritor de RED. Primero se mide, porque de `t2`-`t5` depende qué entra en las Tasks 2 y 3.
   - Task 2: `sdd-tdd` y el encargo.
   - Task 3: el escritor de RED opcional. Se salta entera si `t5` no lo gana.
   - Task 4: `sdd-debugging` y el recableado.
   - Task 5: documentos, filas y topes.
2. **Ejecución Native**: tasks encadenadas sobre `sdd-implement` y la batería, casi todo texto y campañas en segundo plano; el plan cabe en un contexto. Revisor final con `sdd-kit:effort-high` y `opus`.
3. **Escenarios en las baterías que ya existen, no en dos nuevas** (ruling sobre la decisión 15 de la spec, que pedía `tests/batteries/sdd-tdd/` y `sdd-debugging/`). Las dos skills no son una entrada: su conducta se ve en quien las invoca.
   - `t1`-`t5` van a `tests/batteries/sdd-implement/` (su `subject.sh`, su molde y su `compose.mjs`).
   - `d1` es `a3` de `tests/batteries/sdd-propose/`: «patch: si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes», un fallo determinista que ya entra por `sdd-propose` como patch. Se lanza hasta `sdd-start-patch` con la rúbrica de `sdd-debugging`. Sustituye al fallo de `libres` del ejemplo de la spec: mide lo mismo sin otra fixture.
   - `e1` va a `tests/batteries/sdd-explore/`.
4. **Kits del RED y del GREEN**: el RED, con el kit del commit de apertura (`git archive`), que aún carga `superpowers:test-driven-development`, y `SUPERPOWERS_DIR` en la caché 7.0.0. El GREEN, con el kit de la rama.
5. **Cuándo entra cada pieza** (spec, decisiones 4-7):
   - Una pieza que sale limpia en su RED no se escribe; va a deuda y a Enmiendas.
   - `t1` gana la versión más barata que cumple 2 de 2.
   - `t5` entra solo si el RED del hilo falla en algo de la rúbrica y el del escritor no.
6. **Gate de cierre**: `no declarado`, ni en `operations.md` (no existe en este repo) ni en `tech-stack.md` §Testing. Va, como en la 0147 y la 0160, la suite completa que `tech-stack.md` manda ejecutar en la validación final: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
7. **Coste estimado**: ~35 $ de sujetos (techo de 45 $ en `COST_CAP`) y ~3,5 h de reloj, más la revisión final (~3 $).
8. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que TDD y depuración sean del kit, con `sdd-tdd` y `sdd-debugging` delgadas y en la forma del kit; que quien recibe un RED lo vea fallar antes de implementar; y medir si el hilo ve fallar su RED, los antipatrones de Matt, la costura y un escritor de RED en Native.

**Architecture**: dos skills en inglés: `sdd-tdd` con `references/writing-good-tests.md`, y `sdd-debugging` con tres auxiliares. `sdd-implement` y su encargo las nombran donde hoy nombran las de superpowers, y `sdd-start-patch`, `sdd-propose`, `sdd-explore` y dos plantillas cambian el nombre. Las piezas condicionadas entran por su medida.

**Tech Stack**: Markdown (skills, plantillas), Bash y Node (`tests/headless/`, baterías), Pester (`Skills`, `WordBudget`, uno nuevo de forma).

**Spec**: `./spec.md`

**Ejecución**: native, porque las 5 tasks van encadenadas sobre `skills/sdd-implement/` y la batería de `sdd-implement`, un error lo caza el humo o la campaña de su task y la revisión final, y el plan cabe en un contexto. `execution: auto` en `sdd-kit.json`. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- `sdd-tdd`, `sdd-debugging` y sus auxiliares, en inglés; hablan con el usuario en su idioma. Nombres de skill y fichero en inglés kebab-case; texto humano (docs, tests, commits) en castellano con tildes (Art. III).
- Ninguna skill de `skills/` invoca `superpowers:test-driven-development` ni `superpowers:systematic-debugging`.
- Literales de la spec, exactos:
  - el paso del encargo: `Before touching \`src/\`, run \`<comando de los RED>\`; paste the failing output and why that failure was expected`;
  - la clave `tdd.redWriter: thread | subagent`, con `thread` por defecto;
  - el término `test seam: the surface «Dónde se prueba» names`.
- Topes de palabras (spec, decisión 11): `sdd-tdd` con techo de 900 en `SKILL.md` y 2.500 en total; `sdd-debugging` con techo de 1.100 y 3.000.
- Cada regla cita solo la ruta de su evidencia (`tests/…`), sin recuentos.
- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV:
  - sujetos, Sonnet;
  - revisor final, `sdd-kit:effort-high` con `opus`;
  - escritor de RED de `t5`, `sdd-kit:effort-medium` con `sonnet`;
  - `fable` y `opus xhigh`, prohibidos.
- Ejecución Native: implementa la sesión. Cada task: `sdd task start`, el RED apartado fuera del repo, commit, `sdd task done`.
- Una pieza cuyo RED sale limpio no se escribe (decisión 5).
- Techo de sujetos: 45 $ (`COST_CAP`). Si se pasa, paro y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; `git add` por ruta. Nunca `git stash`.

## Review Focus

- **Un implementador que recibe un RED que ya pasa sin código** → lo reporta como hallazgo sobre el test (`DONE_WITH_CONCERNS` con la salida en verde) y no implementa nada para «hacerlo pasar» · Task 2, texto de `sdd-tdd` § Verify RED y del paso del encargo; lectura en la revisión.
- **Una task de spike o del carril config que llega a `sdd-tdd`** → no exige RED: el spike lleva «Evidencia» y config, su gate · Task 2, texto de `sdd-tdd` § Exceptions.
- **Un patch de ajuste visual que pasa por `sdd-start-patch`** → no invoca `sdd-debugging` · Task 4, `a3` no lo cubre: lectura del paso 1 en la revisión, y el Pester de forma comprueba que la variante del ajuste visual nombra `sdd-debugging` solo para decir que no se invoca.
- **`tdd.redWriter: subagent` en un plan con `Ejecución: subagent`** → se ignora: en SDD los RED los sigue escribiendo el hilo, porque ya hay otra mano · Task 3, texto de la regla (solo si la Task 3 entra).
- **Un `sdd-kit.local.json` con `tdd.redWriter`** → `sdd-propose` no lo avisa como clave ignorada · Task 3, las listas de claves locales (solo si la Task 3 entra).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin verbo nuevo de la CLI; escenarios en baterías existentes; piezas condicionadas a su medida.
- [x] **YAGNI gate**: el escritor de RED, solo si `t5` lo gana y solo en Native; la clave, solo si entra.
- [x] **Brownfield gate**: `Skills.Tests.ps1` se mantiene en verde en cada task: la frase del README cambia en la misma task que retira cada invocación.
- [x] **Constitution check**: Art. I (RED antes, A/B ante una duda, humo, tabla en el anexo, previsión, topes), Art. III (inglés), Art. IV (política de modelos), Art. IX (avisos del fork), Art. X (restricciones).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-tdd/SKILL.md`, `skills/sdd-tdd/references/writing-good-tests.md`, `skills/sdd-tdd/NOTICE`.
- `skills/sdd-debugging/SKILL.md`, `skills/sdd-debugging/references/{root-cause-tracing,defense-in-depth,condition-based-waiting}.md`, `skills/sdd-debugging/NOTICE`.
- `skills/sdd-implement/references/red-writer-prompt.md`, solo si entra la Task 3.
- `tests/batteries/sdd-implement/fixtures/` nuevas: `spec-0016.md`, `plan-0016.md`, `app-0016.js` (horas por sala), `spec-0017.md`, `plan-0017.md`, `app-0017.js` (reactivar), `red-writer-brief.md`.
- `tests/sdd-tdd-red.md`, `tests/sdd-tdd-green.md`: evidencia de la campaña.
- `tests/TddSkills.Tests.ps1`: Pester de forma.

**Modificar**:

- `skills/sdd-implement/SKILL.md` (paso 5 de Setup, paso 2 del bucle Native y, si entran, «Before each task» con `t4` y `t5`), `skills/sdd-implement/references/implementer-prompt.md` (lo que gane `t1`).
- `skills/sdd-start-patch/SKILL.md` (paso 1 y sus dos variantes), `skills/sdd-propose/SKILL.md` (el predicado de ajuste visual), `skills/sdd-explore/SKILL.md` (`description` y paso 2).
- `skills/sdd-templates/templates/patch-template.md` (§2), `tasks-template.md` (línea de fix).
- Solo con la Task 3: `skills/sdd-config/SKILL.md` y las listas de claves locales de `skills/sdd-propose/SKILL.md`, `skills/sdd-start-feature/SKILL.md` y `skills/sdd-start-feature/references/control-profiles.md`.
- `tests/batteries/sdd-implement/{battery.md,subject.sh}`, `tests/batteries/sdd-propose/battery.md` (rúbrica de `a3` con `sdd-debugging`), `tests/batteries/sdd-explore/battery.md` (`e1`).
- `README.md`, `CLAUDE.md`, `THIRD_PARTY_NOTICES.md`, `.docs/sdd/architecture.md`, `.docs/sdd/roadmap.md`, `tests/WordBudget.Tests.ps1`.

**NO se tocan**:

- `cli/`: ni verbos ni `cli/src/tasks/` (nota a la 0152).
- `.docs/sdd/capabilities/`: el delta se fusiona al cerrar (`sdd-end-feature`).
- `.docs/workflow/`, `mission.md`, los `tests/*.md` anteriores y las migraciones: 0152, eventos y 0157.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `t2` y `t3` salen limpios y `t5` no tiene con qué ganar | alta | bajo | Es un resultado válido: el escritor no entra y se apunta en Enmiendas |
| Cargar `sdd-tdd` en el implementador sube el coste por task | media | medio | El A/B de `t1` lo decide por evidencia |
| Una frase recortada como no-op era la que sostenía la conducta | media | medio | Humos `h1` y `d1`; lo que falle vuelve con su fila del anexo |
| La sesión compacta | media | medio | Ledger y rescate del propio plan |

### 1.8 Rollout

Directo: entra en `develop` y viaja en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Escenarios y RED: antipatrones, costura, RED del hilo y escritor de RED

**Tras**: —
**Modelo**: Native (la sesión); sujetos `sonnet`.
**Tests RED**: los escenarios de la batería, con el kit del commit de apertura.
**Superficies**: tooling (batería), docs (evidencia).
**Verificación**: `bash -n tests/batteries/sdd-implement/subject.sh` y `node tests/headless/battery.mjs field tests/batteries/sdd-implement/battery.md t2 Petición` (sale con 0).
**Se prueba en la aplicación**: no, porque es la base de prueba de las tasks siguientes.

**Interfaces**:
- Consume: `tests/headless/{lib.sh,battery.sh,run.sh,battery.mjs}`; `tests/batteries/sdd-implement/{subject.sh,compose.mjs,fixtures,mold-reservas}`.
- Produce: los escenarios `t1a`, `t1b`, `t2`, `t3`, `t5a`, `t5b` y su rúbrica «Falla si…»; `tests/sdd-tdd-red.md` con el veredicto de `t2`, `t3`, `t4` (leído en `t2` y `t3`) y `t5`.

**Ficheros**: modificar `tests/batteries/sdd-implement/{battery.md,subject.sh}`; crear las fixtures 0016, 0017, `red-writer-brief.md` y `tests/sdd-tdd-red.md`; las salidas de los sujetos van en `.docs/sdd/specs/20261011-143353-feature-0165-tdd-and-debugging/red/`.

- [ ] **Step 1: Fixtures**:
  - **0016, «horas por sala»**:
    - `app-0016.js` = molde con `export function slotHours(slot)` (`'10:00-12:00'` → `2`) usado por `libres`, sin comando `horas`.
    - `spec-0016.md`, con un THEN: «`horas Norte` responde `Norte: 2 h` con la reserva lun 10:00-12:00», y «Dónde se prueba: horas: por `run`, como `test/cancel.test.js`».
    - `plan-0016.md`: una task, `Ejecución: native`, `Verificación: node --test test/horas.test.js`.
  - **0017, «reactivar»**:
    - `app-0017.js` = molde con Norte lun cancelada.
    - `spec-0017.md`, con un THEN: «`reactivar Norte lun` deja Norte fuera de `libres 10:00-12:00`», y «Dónde se prueba: reactivar: por `run`, como `test/cancel.test.js`».
    - `plan-0017.md`: una task, Native.
  - **`red-writer-brief.md`**: encargo del escritor de RED, en inglés: «write the failing tests for this task from the THEN, the "Dónde se prueba" line and the Interfaces only; don't read `src/` beyond the exported signatures; use `<fichero patrón>` as the style; don't implement; report the test file and its failing output». Lleva tres huecos: `<THEN>`, `<Dónde se prueba>` e `<Interfaces>`.
- [ ] **Step 2: Escenarios** en `battery.md` (n = 2), con su montaje en `subject.sh`:
  - **`t2`**: hilo con `Agent` denegado; «Invoca la skill sdd-kit:sdd-implement y sigue. La 0016 tiene la spec y el plan aprobados y la apertura commiteada: empieza la Task 1.».
    - Falla (tautología) si el esperado de `horas` sale de `slotHours`, o de partir y restar la franja dentro del test, en vez del literal `2` / `'Norte: 2 h'`.
  - **`t3`**: lo mismo con la 0017.
    - Falla (costura o acoplamiento) si el test no pasa por `run('reactivar', …)` y `run('libres', …)`: lee o exporta el array de reservas, o llama a una función interna nueva.
  - **`t4`**, leído en `t2` y `t3`: falla si el hilo escribe el código de la task sin haber ejecutado antes su RED y leído por qué falla.
  - **`t5a`** y **`t5b`**: la petición es `red-writer-brief.md` rellenado con el THEN, «Dónde se prueba» e «Interfaces» de la 0016 (`t5a`) y de la 0017 (`t5b`); su esperado es `ninguna`. Rúbrica: la de `t2` y `t3`, más «aserciones fuera de la spec».
  - **`t1a`** y **`t1b`** quedan declarados, para el GREEN de la Task 2: `r1b` con el encargo A o con el B. Falla si no ejecuta `test/informe.test.js` antes del primer `Edit` o `Write` sobre `src/` (orden en `tools.txt`), o si su informe no trae la salida en rojo.
- [ ] **Step 3: RED**: `BATTERY=sdd-implement PHASE=red KIT_DIR=<git archive del commit de apertura> SUPERPOWERS_DIR=<caché 7.0.0> COST_CAP=45 bash tests/headless/battery.sh`, solo con `t2`, `t3`, `t5a` y `t5b`, en segundo plano con su vigía. Esperado: un veredicto por escenario.
- [ ] **Step 4: Evidencia**: `tests/sdd-tdd-red.md`, por pieza (tautología, costura, RED del hilo, escritor): qué hizo cada sujeto, sus frases literales y si la pieza se escribe. Dice si entra la Task 3 (`t5`).
- [ ] **Step 5: Commit de la task**.

### Task 2 — `sdd-tdd`, el encargo y lo que confirme la Task 1

**Tras**: Task 1
**Modelo**: Native (la sesión); sujetos `sonnet`.
**Tests RED**: `tests/TddSkills.Tests.ps1` (forma), escrito antes de la skill; los GREEN de la batería.
**Superficies**: skills, tooling (Pester), docs.
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/TddSkills.Tests.ps1,tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`.
**Se prueba en la aplicación**: no, porque es una skill; se prueba con los sujetos de `t1` y `h1`.

**Interfaces**:
- Consume: el veredicto de `tests/sdd-tdd-red.md` (qué piezas entran).
- Produce:
  - `skills/sdd-tdd/` (la skill se invoca como `sdd-tdd` con `Skill`);
  - el paso del encargo, con el literal de las Restricciones;
  - `sdd-implement` nombrando `sdd-tdd`;
  - la frase del README con 5 skills de superpowers, sin `test-driven-development`.

**Ficheros**: crear `skills/sdd-tdd/*`, `tests/TddSkills.Tests.ps1`, `tests/sdd-tdd-green.md`; modificar `skills/sdd-implement/SKILL.md`, `skills/sdd-implement/references/implementer-prompt.md`, `README.md`, `THIRD_PARTY_NOTICES.md`, `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: Pester de forma**, en rojo:
  - `skills/sdd-tdd/SKILL.md` existe;
  - ningún fichero de `skills/` contiene `superpowers:test-driven-development`;
  - `implementer-prompt.md` contiene `Before touching \`src/\`, run`.
- [ ] **Step 2: `sdd-tdd`** con las secciones del anexo de la spec:
  - Overview, The Iron Law, Exceptions, The cycle (RED, Verify RED, GREEN, Verify GREEN y REFACTOR, con el puntero a `sdd-debugging`) y Red flags (las cinco del anexo);
  - Anti-patterns y Test seams solo si la Task 1 los confirma;
  - `description`: `Use when sdd-implement or an implementer brief reaches code to write or a test to add, to keep it test-first. Invoked from there; not the entry of a change (that is sdd-propose).`;
  - `references/writing-good-tests.md`: el de superpowers, en inglés, con «superpowers:writing-skills» cambiado por «the kit's skill tests»;
  - `NOTICE`: obra/superpowers 7.0.0, MIT, Copyright (c) 2025 Jesse Vincent (y mattpocock/skills 1.2.3, Copyright (c) 2026 Matt Pocock, si entra lo de Matt).
- [ ] **Step 3: Encargo, versión A**: en «Your Job» de `implementer-prompt.md`, como primer punto, el literal de las Restricciones con `<comando de los RED>` = el de «Tests RED» del encargo.
- [ ] **Step 4: `sdd-implement`**:
  - paso 5 de Setup: «load `sdd-tdd`»;
  - paso 2 del bucle Native: «→ `sdd-debugging`», que nace en la Task 4; hasta entonces, el nombre de superpowers se queda.
  - Si `t4` falló: en el paso 2 de «Before each task», «run them and read why they fail before writing the task's code; a RED that passes is a finding about the test», con la línea del ledger.
- [ ] **Step 5: GREEN**:
  - `t1a` (encargo A) y `t1b` (A con «Load `sdd-tdd` with `Skill`», montado por `subject.sh`), n = 2 cada uno;
  - `t2` y `t3` si fallaron en RED, con el kit de la rama;
  - `h1` (humo Native: el hilo carga `sdd-tdd`).
  - Gana la versión del encargo más barata con 2 de 2. Si gana B, el paso 3 añade la carga.
- [ ] **Step 6: Documentos de la task**:
  - README: la frase de superpowers, de 6 a 5 (la 0168 ya quitó `brainstorming` y `writing-plans`);
  - `THIRD_PARTY_NOTICES.md`: la línea de `sdd-tdd`;
  - `WordBudget`: el tope medido de `sdd-tdd`, redondeado a la centena de arriba y bajo su techo.
- [ ] **Step 7: Evidencia** en `tests/sdd-tdd-green.md` y **commit de la task**.

### Task 3 — Escritor de RED opcional en Native (solo si `t5` lo gana)

**Tras**: Task 2
**Modelo**: Native (la sesión); sujeto `sonnet`.
**Tests RED**: en `tests/TddSkills.Tests.ps1`, la clave `tdd.redWriter` en el catálogo de `sdd-config` y en las listas de claves locales.
**Superficies**: skills, tooling, docs.
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/TddSkills.Tests.ps1,tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`.
**Se prueba en la aplicación**: no, porque es una skill; humo `c1`.

**Interfaces**:
- Consume: `tests/batteries/sdd-implement/fixtures/red-writer-brief.md` (de la Task 1).
- Produce:
  - `skills/sdd-implement/references/red-writer-prompt.md`;
  - la clave `tdd.redWriter: thread | subagent`, con `thread` por defecto, admitida en `sdd-kit.local.json`.

**Ficheros**: crear `skills/sdd-implement/references/red-writer-prompt.md`; modificar `skills/sdd-implement/SKILL.md`, `skills/sdd-config/SKILL.md`, `skills/sdd-propose/SKILL.md`, `skills/sdd-start-feature/SKILL.md`, `skills/sdd-start-feature/references/control-profiles.md`.

- [ ] **Step 1**: si `tests/sdd-tdd-red.md` dice que `t5` no gana, la task se cierra sin cambios, con su línea en el ledger y una entrada en Enmiendas de la spec (quitar los ADDED del escritor y de `configuration`).
- [ ] **Step 2: Pester** en rojo; luego el prompt (desde `red-writer-brief.md`) y la regla en «Before each task» de `sdd-implement`:
  - con `Ejecución: native` y `tdd.redWriter: subagent`, despacha `sdd-kit:effort-medium` con `sonnet` y el prompt;
  - con `subagent`, se ignora.
- [ ] **Step 3: Clave**: en el catálogo de `sdd-config` y en las cuatro listas de claves locales admitidas.
- [ ] **Step 4: Humo `c1`**: «quiero que en mis features los RED los escriba un subagente», con `sdd-config` y el kit de la rama. Falla si la escribe en `sdd-kit.json` en vez de en `sdd-kit.local.json`, o con otro nombre.
- [ ] **Step 5: Commit de la task**.

### Task 4 — `sdd-debugging` y el recableado

**Tras**: Task 2
**Modelo**: Native (la sesión); sujetos `sonnet`.
**Tests RED**: en `tests/TddSkills.Tests.ps1`, ningún fichero de `skills/` contiene `superpowers:systematic-debugging`, y `skills/sdd-debugging/SKILL.md` existe.
**Superficies**: skills, plantillas, tooling, docs.
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/TddSkills.Tests.ps1,tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1 -CI"`.
**Se prueba en la aplicación**: no, porque es una skill; humos `d1` y `e1`.

**Interfaces**:
- Consume: `sdd-tdd` (de la Task 2), para la fase 4.
- Produce:
  - `skills/sdd-debugging/` (se invoca como `sdd-debugging` con `Skill`);
  - la frase del README con 4 skills de superpowers: `using-git-worktrees`, `writing-skills`, `requesting-code-review` y `finishing-a-development-branch`.

**Ficheros**: crear `skills/sdd-debugging/*`; modificar `skills/sdd-implement/SKILL.md`, `skills/sdd-start-patch/SKILL.md`, `skills/sdd-propose/SKILL.md`, `skills/sdd-explore/SKILL.md`, `skills/sdd-templates/templates/{patch-template,tasks-template}.md`, `tests/batteries/sdd-propose/battery.md`, `tests/batteries/sdd-explore/battery.md`, `README.md`, `THIRD_PARTY_NOTICES.md`, `tests/WordBudget.Tests.ps1`.

- [ ] **Step 1: Pester** en rojo.
- [ ] **Step 2: `sdd-debugging`** con las secciones del anexo:
  - Overview, Phase 1-4, Red flags (las 11), No root cause, y los tres auxiliares;
  - en `root-cause-tracing.md`, la línea que sustituye a `find-polluter.sh`;
  - fase 4: `sdd-tdd`, y la verificación leída antes de decir que está arreglado; tres arreglos fallidos → parada de desvío en el hilo, `BLOCKED` en el implementador;
  - `description`: `Use when an sdd-kit skill meets a failure to explain — a bug in a patch, a step whose Expected doesn't match because the code fails — before proposing a fix. Invoked from there; not the entry of a change (that is sdd-propose).`;
  - `NOTICE`.
- [ ] **Step 3: Recableado**, solo el nombre:
  - `sdd-implement`, paso 2 del bucle Native;
  - `sdd-start-patch`, paso 1 y sus dos variantes;
  - `sdd-propose`, el predicado;
  - las dos plantillas;
  - `sdd-explore`: la `description` y el paso 2 pasan a «investigating a failure → `sdd-propose`».
- [ ] **Step 4: Humos**:
  - `d1` = `a3` de la batería de `sdd-propose`, con `MAX_TURNS` hasta el fix. Falla si no invoca `sdd-debugging`, si escribe el arreglo antes de la causa con su evidencia en el código, o si no hay un test en rojo antes del arreglo.
  - `e1` en la batería de `sdd-explore`: «¿por qué `libres 10:00-12:00` me da Norte si está reservada?», con el molde de `libres` roto. Falla si investiga o arregla él, o si nombra `superpowers:systematic-debugging` en vez de pasar a `sdd-propose`.
- [ ] **Step 5: Documentos**: la frase del README, de 5 a 4, más el catálogo; `THIRD_PARTY_NOTICES.md`; el tope de `sdd-debugging`.
- [ ] **Step 6: Evidencia** en `tests/sdd-tdd-green.md` y **commit de la task**.

### Task 5 — Documentos, filas y topes finales

**Tras**: Task 4
**Modelo**: Native (la sesión).
**Tests RED**: ninguno nuevo; la verificación es la suite de Pester tocada.
**Superficies**: docs, tooling.
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/Skills.Tests.ps1,tests/WordBudget.Tests.ps1,tests/TddSkills.Tests.ps1 -CI"` y `moon run kit:roadmap`.
**Se prueba en la aplicación**: no, porque son documentos.

**Interfaces**:
- Consume: los veredictos de `tests/sdd-tdd-red.md` y `tests/sdd-tdd-green.md`.
- Produce: nada que use otra task.

**Ficheros**: modificar `CLAUDE.md`, `.docs/sdd/architecture.md`, `.docs/sdd/roadmap.md`, `tests/WordBudget.Tests.ps1`, y la spec (Enmiendas) si alguna pieza salió limpia.

- [ ] **Step 1**: `CLAUDE.md` pasa de «las 18 skills» a «las 20 skills», y el árbol de `architecture.md` suma `sdd-tdd/` y `sdd-debugging/`.
- [ ] **Step 2: Roadmap**:
  - sale la fila de deuda 141;
  - fila nueva en el backlog, «TDD en legacy sin tests» (tests de caracterización y sprout/wrap de Feathers);
  - frase en la fila 0152: «`cli/src/tasks/` dice portar scripts de superpowers 6.4.2 (`THIRD_PARTY_NOTICES.md`): comprobar si cambiaron en la 7.0.0»;
  - una fila de deuda «Esperar caso» por cada pieza que salió limpia;
  - si `t4` entró, sale la pieza de la 0007 «el hilo ejecuta los RED antes de despachar».
- [ ] **Step 3**: tope `Kit` de `WordBudget` = lo medido, redondeado a la centena de arriba.
- [ ] **Step 4**: Enmiendas de la spec, una por pieza que salió limpia o que cambió de forma.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 3,5 h
- Base de la estimación: 5 tasks (la 3, probablemente vacía), dos campañas de sujetos en segundo plano (~20 sujetos), y la 0147 como referencia (4 tasks y ~34 $ en ~5 h).
- Confianza: media.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `no declarado` en `operations.md` y `tech-stack.md` §Testing (decisión 6); se ejecuta `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
- [ ] Verificación de los criterios de éxito de la spec.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Quien implementa ve fallar los RED antes de implementar» → Task 2, `t1a`/`t1b`. ✓
- ADDED «Un fallo se investiga con `sdd-debugging`» → Task 4, `d1` y el Pester de forma. ✓
- ADDED «El hilo ve fallar su propio RED» → Task 1 (`t4`), Task 2 Step 4 si entra. ✓
- ADDED «Un test no recalcula su valor esperado» → Task 1 (`t2`), Task 2 si entra. ✓
- ADDED «Los tests van en la costura de "Dónde se prueba"» → Task 1 (`t3`), Task 2 si entra. ✓
- ADDED «En Native, el RED lo escribe un subagente» y `configuration` → Task 1 (`t5`), Task 3 si entra. ✓
- MODIFIED de `routing` (los dos) → Task 4, recableado de `sdd-start-patch` y `patch-template.md`; el delta se fusiona al cerrar. ✓
- Decisión 8 de la spec (`sdd-explore`) → Task 4, `e1`. ✓
- Decisiones 12 y 13 de la spec (fila 141, legacy, nota de 0152) → Task 5. ✓
- Topes (decisión 11) → Tasks 2, 4 y 5. ✓
- Review Focus → Task 2 (RED que ya pasa, excepciones), Task 4 (ajuste visual), Task 3 (clave con SDD y en local). ✓
