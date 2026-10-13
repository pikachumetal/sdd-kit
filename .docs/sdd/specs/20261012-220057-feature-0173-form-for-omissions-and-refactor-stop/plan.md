---
id: 20261012-220057-feature-0173-form-for-omissions-and-refactor-stop
feature: 0173
title: Plan de implementación — Art. II: la forma para un elemento omitido y cuándo parar el REFACTOR de una skill
spec: ./spec.md
status: approved
created: 2026-10-13
---

# Plan de implementación — Art. II: la forma para un elemento omitido y cuándo parar el REFACTOR de una skill

## Decisiones que he tomado yo — valida estas

1. Modelo: la sesión (Opus 5.5) implementa las dos tasks; los sujetos, Sonnet (columna «Modelo» de la batería); el revisor final de rama, `sdd-kit:effort-high` + `opus`.
2. Ejecución: native (abajo).
3. El molde lee las reglas de la copia del kit que se prueba: `subject.sh` saca el Art. II de `$KIT/.docs/sdd/constitution.md` y la regla de parada de `$KIT/.docs/sdd/tech-stack.md`, y el `KIT_DIR` de cada fase es el `git archive` de su commit con esos dos ficheros. Así el RED lleva el texto vigente y el GREEN el nuevo sin copiar nada a mano (spec, decisión 7).
4. En el molde, el artículo se añade como «Art. III — La forma sigue al fallo» (el Art. II de `mold-kit` ya es «Spec»), y la regla de parada, en un `.docs/sdd/tech-stack.md` con la sección «Pruebas de skills».
5. Rúbrica de «hueco»: el paso 3 de `guardar-nota` manda enviar una línea o un bloque literal con un marcador de la ruta (`<path>`, `<ruta>`, `{path}`). Un ejemplo con una ruta concreta («e.g. Saved to notas/x.md») sin decir que es la plantilla de la respuesta es prosa.
6. `o2` se mide sobre el commit de la Task 1: si la fila del Art. II basta para que el sujeto cambie de forma, el RED de `o2` sale limpio y la regla de parada no entra (Art. I); el walkthrough lo dice aparte, como «la fila lo cubre».
7. Coste: ~2,5 h; sujetos ≤ 10 y ≤ 5 $ (`SUBJECT_CAP=10`, `COST_CAP=5`), con la revisión final ~3 $.
8. Gate de cierre: `no declarado` en `operations.md` (no existe) ni en `tech-stack.md` §Testing; va, como en la 0165 y la 0166, `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
9. Review Focus: 2 entradas (abajo).

**Goal**: el Art. II gana la forma para un elemento omitido y `tech-stack.md` la regla de parada del REFACTOR, cada una solo si su RED falla.

**Architecture**: dos escenarios nuevos en la batería de `sdd-implement` sobre `mold-kit`, con la feature 0020 de fixture (`guardar-nota` responde sin la ruta). El molde recibe las reglas del kit que se prueba, así que el mismo escenario sirve de RED y de GREEN.

**Tech Stack**: Markdown (constitution, ADR, `tech-stack.md`), bash de las baterías (`tests/headless/`), Pester (`WordBudget.Tests.ps1`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks en serie sobre los mismos ficheros de batería, un error lo caza el sujeto o la revisión final y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano en castellano con tildes.
- Fila del Art. II, literal: «- Elemento omitido (cumple, pero falta una pieza de algo que ya produce) → hueco obligatorio en la plantilla que rellena, no un recordatorio en prosa junto a ella.»
- Regla de parada, literal: «- **Una ronda de REFACTOR que da 0/N no se repite con la misma forma** (feature 0173): la siguiente cambia de forma por el Art. II —un elemento omitido pide un hueco en la plantilla, no otro recordatorio— o para y propone al dev-lead enmendar el THEN como desvío. En la 0166, dos rondas en prosa sobre `w1` dieron 0/3 y se retiraron (~35 min).»
- Tope de `constitution.md` en `WordBudget.Tests.ps1`: 2230.

### De proceso

- Native: implementa la sesión; revisor final `sdd-kit:effort-high` + `opus`.
- Sujetos con `tests/headless/battery.sh`, `SUPERPOWERS_DIR` en la caché 7.0.0, `RUNS_DIR` en el scratchpad.

## Review Focus

- La fila del Art. II sola hace pasar `o2` → la regla de parada no entra, y el walkthrough lo cuenta como cubierto por la fila, no como «no se reproduce» · Task 2, RED de `o2`.
- Un sujeto que escribe un ejemplo con ruta concreta en vez de una plantilla con marcador → cuenta como prosa (decisión 5) · Tasks 1 y 2, rúbrica `O1` y `O2`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos escenarios sobre un molde que ya existe, sin código nuevo.
- [x] **YAGNI gate**: nada se abstrae; la extracción del Art. II es un `sed` en `subject.sh`.
- [x] **Brownfield gate**: `k1` y `k2` no cambian; el molde solo crece en `o1` y `o2`.
- [x] **Constitution check**: Art. I (RED antes de cada regla, previsión), Art. IX (trae de otro kit, con su aviso), Art. XI (ADR nueva, la 0003 no se toca).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/decisions/0014-form-for-omissions-and-refactor-stop.md` — el porqué de la fila y, si entra, de la regla de parada.
- `tests/batteries/sdd-implement/fixtures/spec-0020.md`, `plan-0020.md`, `h1-0020.txt` — la feature del molde y su humo en rojo.
- `tests/batteries/sdd-implement/fixtures/guardar-nota-r1.md`, `h1-r1-0020.txt` — la ronda 1 en prosa y su humo otra vez en rojo (`o2`).

**Modificar**:

- `.docs/sdd/constitution.md` — fila del Art. II y enlace a la ADR 0014.
- `.docs/sdd/tech-stack.md` — regla de parada en «Baterías por skill»; la entrada «El techo de coste lo aplica el lanzador», a una frase.
- `tests/WordBudget.Tests.ps1` — tope de `constitution.md` a 2230.
- `tests/batteries/sdd-implement/battery.md` y `subject.sh` — escenarios `o1` y `o2`, rúbrica y procedencia.
- `THIRD_PARTY_NOTICES.md` — la fila del Art. II viene de `writing-skills` de superpowers.

**NO se tocan**:

- `.docs/sdd/decisions/0003-form-follows-failure.md` — inmutable; la 0014 la amplía.
- `skills/sdd-worktrees/SKILL.md` — el THEN de `w1` ya está enmendado.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto no lee la constitution del molde al hacer el REFACTOR | media | el GREEN no mide la regla | el `CLAUDE.md` del molde la lista; si `tools.txt` no la lee, el veredicto lo dice como disparador ausente |
| `o1` sale limpio en el RED | media | la fila no entra | enmienda de la spec y el escenario queda como control (Art. I) |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `o1` y la fila del Art. II

**Tras**: —
**Modelo**: la sesión (Native); sujetos `sonnet`.
**Tests RED**: escenario `o1` de la batería de `sdd-implement`, sobre el `KIT_DIR` del commit de apertura.
**Superficies**: docs · tooling (batería)
**Verificación**: `BATTERY=sdd-implement STEPS=form-omission … bash tests/headless/battery.sh` y la rúbrica `O1` leída en `tools.txt`; `Invoke-Pester tests/WordBudget.Tests.ps1 -CI`; `node cli/bin/sdd.js decision check`.
**Interfaces**:
- Consume: `mold-kit` (constitution con Art. I y II, `guardar-nota` con el paso 3 «Tell the user the path you wrote.»).
- Produce: la función `form_rules` de `subject.sh` (añade al molde el Art. II del kit como Art. III y la regla de parada si existe), los fixtures de la 0020 y la ADR 0014, que la Task 2 amplía.

**Ficheros**: los de §1.1 salvo `guardar-nota-r1.md`, `h1-r1-0020.txt` y `tech-stack.md`.

- [ ] **Step 1: Escenario** — fila de `battery.md`: `| o1 | form-omission | Invoca la skill sdd-kit:sdd-implement y sigue. Estás en la Task 1 de la 0020: el humo \`h1\` falló (\`.docs/sdd/specs/20261013-100000-feature-0020-path-reply/green/h1.txt\`). Haz la ronda de REFACTOR y cierra la task. | kit | \`sdd-kit:sdd-implement\` | 2 | 2/2 | sonnet | ticket de la feature 0166 §1: dos rondas en prosa sobre una omisión |`. Rúbrica `O1`: falla si el paso 3 de `guardar-nota` no manda enviar una línea o un bloque literal con un marcador de la ruta, o si solo añade una frase o énfasis. `subject.sh`: `o1` usa `mold-kit`, abre la 0020 con `open_feature` y llama a `form_rules`; `CLAUDE.md` del molde con una línea «Reglas: `.docs/sdd/constitution.md` y `.docs/sdd/tech-stack.md`». Fixtures: spec 0020 con el THEN «responde con la ruta que escribió (`notas/reunion-martes.md`)»; plan con la Task 1 y «Verificación: el humo `h1`; si falla, una ronda de REFACTOR (Art. I)»; `h1-0020.txt`: el sujeto escribió `notas/reunion-martes.md` y respondió «Nota guardada.», FALLA por la ruta.
- [ ] **Step 2: En seco** — `DRY_RUN=1`: el molde lleva el Art. III con las tres filas vigentes y la rama `feature/0020-path-reply`.
- [ ] **Step 3: RED** — `KIT_DIR` = `git archive` del commit de apertura (`skills .claude-plugin agents cli .docs/sdd/constitution.md .docs/sdd/tech-stack.md`). Esperado: `o1` falla 2/2 con la rúbrica `O1`. Si sale limpio: para, enmienda la spec (la fila no entra) y sigue en la Task 2.
- [ ] **Step 4: GREEN** — la fila en el Art. II, «[ADR 0014](decisions/0014-form-for-omissions-and-refactor-stop.md)» en su *Por qué*, la ADR 0014 (forma de la 0001: contexto con el caso `w1`, opciones, decisión, consecuencias, confirmación), el tope 2230 y la línea en `THIRD_PARTY_NOTICES.md`. Commit en la rama y `KIT_DIR` nuevo. Esperado: `o1` 2/2 con hueco.
- [ ] **Step 5: Verificación** — `Invoke-Pester tests/WordBudget.Tests.ps1 -CI` en verde; `node cli/bin/sdd.js decision check` sin errores.
- [ ] **Step 6: Commit de la task**.

### Task 2 — `o2` y la regla de parada

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `sonnet`.
**Tests RED**: escenario `o2`, sobre el `KIT_DIR` del commit de la Task 1.
**Superficies**: docs · tooling (batería)
**Verificación**: `BATTERY=sdd-implement STEPS=refactor-stop … bash tests/headless/battery.sh` y la rúbrica `O2`; `Invoke-Pester tests/WordBudget.Tests.ps1 -CI`.
**Interfaces**:
- Consume: `form_rules` y los fixtures de la 0020 (Task 1); la ADR 0014.
- Produce: la regla de parada en `tech-stack.md`, que `form_rules` copia al molde.

**Ficheros**: `guardar-nota-r1.md`, `h1-r1-0020.txt`, `battery.md`, `subject.sh`, `.docs/sdd/tech-stack.md`, la ADR 0014.

- [ ] **Step 1: Escenario** — fila `| o2 | refactor-stop | Invoca la skill sdd-kit:sdd-implement y sigue. Estás en la Task 1 de la 0020: la ronda 1 de REFACTOR no arregló el humo (\`.docs/sdd/specs/20261013-100000-feature-0020-path-reply/green/h1-r1.txt\`). Haz la siguiente ronda y cierra la task. | kit | \`sdd-kit:sdd-implement\` | 2 | 2/2 | sonnet | ticket de la feature 0166 §1 |`. Rúbrica `O2`: falla si la ronda vuelve a ser una frase o énfasis sobre la ruta; pasa si pone un hueco o si para antes de editar y propone enmendar el THEN. `guardar-nota-r1.md`: el paso 3 dice «Always tell the user the full path you wrote — never omit it.»; `h1-r1-0020.txt`: 0/3, los tres respondieron sin la ruta.
- [ ] **Step 2: RED** — `KIT_DIR` del commit de la Task 1. Esperado: `o2` falla 2/2. Si sale limpio: la regla no entra (decisión 6), enmienda y cierre.
- [ ] **Step 3: GREEN** — la regla en «Baterías por skill», la entrada del techo de coste a una frase («**El techo de coste y el de sujetos los aplica el lanzador** (`tests/headless/run.sh`, `COST_CAP` y `SUBJECT_CAP`, los de la previsión de la spec); al redactar la previsión, se suman las tandas que lista la propia spec.») y la regla en la ADR 0014. Esperado: `o2` 2/2.
- [ ] **Step 4: Verificación** — `Invoke-Pester tests/WordBudget.Tests.ps1 -CI` en verde.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: 2,5 h
- Base de la estimación: 2 tasks con RED y GREEN de sujetos; la 0166 midió ~0,3 h por tanda con su lectura; incertidumbre en si el sujeto lee la constitution del molde.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `no declarado` en `operations.md` ni en `tech-stack.md` §Testing (decisión 8); va `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`.
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`)

---

## 4. Self-review (cobertura spec → tasks)

- Fila del Art. II y ADR 0014 → Task 1. ✓
- Escenario `o1` → Task 1. ✓
- Regla de parada y adelgazamiento del techo de coste → Task 2. ✓
- Escenario `o2` → Task 2. ✓
- Tope de la constitution → Task 1. ✓
- Review Focus: la fila cubre `o2` → Task 2, RED de `o2`; ejemplo con ruta concreta → rúbricas `O1` y `O2`. ✓
