---
id: 20261125-155223-feature-0367-validate-no-stops-in-delegate
feature: 0367
title: Plan de implementación — sdd-validate en delegate no para antes de volver a sdd-implement ni antes de sdd-archive
spec: ./spec.md
status: approved
created: 2026-11-25
---

# Plan de implementación — `sdd-validate` en `delegate` no para antes de volver a `sdd-implement` ni antes de `sdd-archive`

## Decisiones que he tomado yo — valida estas

1. Modelo: Native, la sesión implementa las dos tasks; sujetos de la batería `sonnet` (los fija la tabla de escenarios) — dos tasks de texto y batería, sin código que delegar.
2. Ejecución: native — ver la línea `Ejecución`.
3. La lectura del motivo de parada se hace con `grep` sobre `vf10-<n>.texts.txt` (último mensaje) y `vf10-<n>.tools.txt`, como en la 0362 («Funcionó, no tocar» de su ticket).
4. Riesgo alto: el molde `reservas-final-bug-campo` puede parar por defectos del molde (como `vf9` en la 0365): se trata con la decisión 2 y 8 de la spec.
5. Coste estimado: ~2 h de hilo y 27,80 $ de sujetos como tope (spec, «Previsión de coste»); el RED, 4,48 $.
- Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `sdd-validate` en `delegate` vuelva a `sdd-implement` sin preguntar y, con la validación en campo registrada, invoque `sdd-archive` y fusione, medido por `vf10`.

**Architecture**: un escenario nuevo, `vf10`, sobre el molde de `vf3` en campo, mide en rojo las dos paradas con el texto de `develop`; después se reescriben «Order» paso 5 y «A failure goes back to `sdd-implement`» de `skills/sdd-validate/SKILL.md` con la frase que pide el motivo del RED, sin subir palabras.

**Tech Stack**: skills en Markdown (`skills/`, construidas a `dist/` con `moon run kit:build`), baterías headless (`tests/headless/battery.mjs`), Vitest para `cli/test/kit/word-budget.test.ts`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks encadenadas (la segunda necesita el motivo que mide la primera), un error lo caza la batería de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el texto de una skill, una fila de batería y un molde de test; ningún módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- `skills/sdd-validate/SKILL.md` en `dist/` queda en 762 palabras o menos, y la skill entera en 1828 o menos (contador de `cli/test/kit/word-budget.test.ts`); los topes (765 y 1847) no cambian.
- Las skills se escriben en inglés; `kit:own` rechaza la prosa en castellano en `skills/` (Art. III).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación (Art. X).
- Ningún arreglo que sale de un ticket alarga una skill (`CLAUDE.md`, regla 6).

### De proceso

- Sujetos con `BATTERY=sdd-validate node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md`, `SCENARIOS` y `N` por tanda; si una tanda supera la previsión de la spec, para y decide el dev-lead (Art. I).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; mensaje por `git commit -F <fichero del scratchpad>` (el hook bloquea `*` suelto y `/palabra`).

## Review Focus

- Un sujeto que fusiona con `git merge` a mano en vez de `sdd merge` → `vf10` falla (c): la rúbrica pide `sdd merge` · Task 1, fila VF10.
- Un sujeto que en `vf10` invoca `sdd-archive` antes de registrar `Validación en campo:` → VF10 (b) falla, porque el orden es «después de escribir» · Task 1, fila VF10.
- La frase nueva absorbe la parada de la decisión de la revisión final → `v1a` sigue preguntándola sola · Task 2, control `v1a`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un escenario sobre un molde que ya existe, y dos frases sustituidas.
- [x] **YAGNI gate**: nada nuevo en `control-profiles.md` ni en otras skills.
- [x] **Brownfield gate**: `vf2`, `vf3`, `v1a` y `vf9` vigilan lo que ya funciona.
- [x] **Constitution check**: Art. I (RED antes de la guidance, previsión), Art. II (regla en su paso), Art. III, regla 6 de `CLAUDE.md`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-validate-0367-red.md` — evidencia del RED de `vf10`, con el motivo literal de cada sujeto.
- `tests/sdd-validate-0367-green.md` — evidencia del GREEN y de los controles.

**Modificar**:

- `tests/batteries/sdd-archive/subject.mjs` — molde `reservas-final-bug-campo`.
- `tests/batteries/sdd-validate/battery.md` — molde, escenario `vf10` y fila de rúbrica VF10.
- `skills/sdd-validate/SKILL.md` — «Order» paso 5 y «A failure goes back to `sdd-implement`».
- `ROADMAP.md` — `**Toca:**` de la fila 0367 (gana `tests/batteries/sdd-archive/subject.mjs`, pierde `skills/sdd-propose/references/control-profiles.md`).

**NO se tocan**:

- `skills/sdd-propose/references/control-profiles.md` y `skills/sdd-validate/references/validation-modes.md` — decisión del dev-lead; un motivo del RED que apunte a `validation-modes.md` es desvío.
- La rúbrica de `vf9` — decisión 7 de la spec.
- `cli/test/kit/word-budget.test.ts` — los topes no cambian.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED sale 0/2 | media | la feature cierra sin tocar la skill | decisión 9 de la spec: `vf10` queda de regresión |
| Una parada por defecto del molde | media | una tanda más (4,48 $) | decisión 2 y 8 de la spec |
| La frase no cabe en 3 palabras de margen | media | recorte de otra instrucción | decisión 13: lo miden controles y `vf9`, o desvío |

### 1.8 Rollout

Directo: entra con la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El escenario `vf10`, en rojo sobre el texto de `develop`

**Tras**: —
**Modelo**: Native: la sesión (effort: el de la sesión).
**Tests RED**: hilo principal · `vf10` de `tests/batteries/sdd-validate/battery.md`, `N=2`, sobre `skills/sdd-validate/SKILL.md` de la base; esperado: rojo (al menos un sujeto falla VF10).
**Superficies**: tooling (batería)
**Verificación**: `SCENARIOS="vf10" N=2 BATTERY=sdd-validate node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md` → cada sujeto puntuado contra VF10; esperado: al menos un fallo.
**Verificación lenta**: la misma línea, ~15 min.

**Interfaces**:
- Consume: `moldReservas()`, `e2eSuite()`, `done0010()`, `freeRoomsBug(true)`, `reviewPending()` de `tests/batteries/sdd-archive/subject.mjs` (las que compone hoy `'reservas-final-bug'`, sin `manualValidation()`).
- Produce: molde `reservas-final-bug-campo`; escenario `vf10`; fila `VF10 Sin paradas en delegate`; el motivo literal de cada parada en `tests/sdd-validate-0367-red.md`.

**Ficheros**: modificar `tests/batteries/sdd-archive/subject.mjs`, `tests/batteries/sdd-validate/battery.md`; crear `tests/sdd-validate-0367-red.md`.

- [ ] **Step 1: Molde** — en la tabla de moldes de `subject.mjs`, junto a `'reservas-final-bug'`: `'reservas-final-bug-campo': () => (moldReservas(), e2eSuite(), done0010(), freeRoomsBug(true), reviewPending())`.
- [ ] **Step 2: Escenario y rúbrica** en `tests/batteries/sdd-validate/battery.md`:
  - «Moldes»: `- \`reservas-final-bug-campo\`: \`reservas-final-bug\` con \`validation.mode: field\`: el paso \`libres\` del guion falla, y tras el arreglo y el registro el cierre fusiona en \`develop\` (bloque \`merge\` completo, sin push).`
  - Escenario: `| vf10 | validation-no-stops | Invoca la skill sdd-kit:sdd-validate y sigue. Las tasks de la 0010 están acabadas y commiteadas y la revisión final aún no ha salido: valídala. | reservas-final-bug-campo | \`sdd-kit:sdd-validate\` | 2 | 2/2 | sonnet | feature 0367: en \`delegate\` no para antes de volver a \`sdd-implement\` ni antes de \`sdd-archive\` (tickets de las features 0362 y 0365, §3) |`
  - Rúbrica: `| VF10 Sin paradas en \`delegate\` | vf10, vf2, vf3 | el sujeto acaba sin (a) el \`git commit\` (o \`sdd task done\`) de la task del arreglo en \`tools.txt\`, (b) \`>>> Skill: sdd-kit:sdd-archive\` en \`tools.txt\` después de escribir \`Validación en campo:\` en el borrador del walkthrough, o (c) el \`sdd merge\` del cierre en \`tools.txt\` (un \`sdd merge\` que el entorno rechaza, con su error literal, pasa); en \`vf2\` y \`vf3\` solo cuenta (a). Mide la acción, no la forma de la frase. No cuenta el final que cita un fichero o un comando que falta en el molde, con su ruta o su error literal: se arregla el molde y se repite la tanda |`
  - Cabecera: «La feature 0367 añade `vf10` (las paradas de `delegate`)».
- [ ] **Step 3: RED** — la línea de «Verificación»; en `tests/sdd-validate-0367-red.md`: tabla sujeto · VF10 (a, b, c) · motivo literal de la última frase sin acción, con la línea `suma:`. Clasifica el motivo según Approach §2 de la spec (merge · Native sin sesión · sin motivo · `validation-modes.md` → desvío · otro → desvío). Con 0/2, decisión 9 de la spec.
- [ ] **Step 4: Commit de la task** — `test(sdd-validate): escenario vf10 de las paradas en delegate, en rojo`.

### Task 2 — La regla en el paso donde se decide

**Tras**: Task 1
**Modelo**: Native: la sesión.
**Tests RED**: `vf10` de la Task 1 (rojo en la base).
**Superficies**: docs (skills), tooling
**Verificación**: `moon run kit:build` → sale con 0; desde `cli/`, `npx vitest run test/kit/word-budget.test.ts` → `Tests  … passed`; `moon run kit:own` → sale con 0; `SCENARIOS="vf10 vf9" N=2 BATTERY=sdd-validate node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md` → VF10 2/2 y VF9 2/2; `SCENARIOS="vf2 vf3 v1a" N=1 BATTERY=sdd-validate node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md` → VF10 (a), VF2, VF3 y V1A pasan.
**Verificación lenta**: las dos tandas, ~25 min.

**Interfaces**:
- Consume: escenario `vf10` y el motivo clasificado de `tests/sdd-validate-0367-red.md` (Task 1).
- Produce: «Order» paso 5 y «A failure goes back to `sdd-implement`» reescritos.

**Ficheros**: modificar `skills/sdd-validate/SKILL.md`, `ROADMAP.md`; crear `tests/sdd-validate-0367-green.md`.

- [ ] **Step 1: Implementación** — en `skills/sdd-validate/SKILL.md`:
  - «A failure goes back to `sdd-implement`», primera frase: quita «without asking» y di que la vuelta no es una parada, con la forma que pide el motivo del RED (sin motivo: imperativo en el mismo turno).
  - «Order» paso 5: tras el registro, `sdd-archive` sin preguntar; con el motivo «merge», que en `delegate` con el bloque `merge` completo el merge a `merge.into` es del cierre; con el motivo «Native sin sesión», que se invoca `sdd-archive` directamente si no hay una «Finish» en curso.
  - Saldo: `SKILL.md` ≤ 762 palabras en `dist/` y la skill ≤ 1828; si no cabe, recorta dentro de esas dos frases; otro recorte, decisión 13 de la spec.
  - `ROADMAP.md`, fila 0367, `**Toca:**`: `skills/sdd-validate/SKILL.md`, `tests/batteries/sdd-validate/`, `tests/batteries/sdd-archive/subject.mjs`.
- [ ] **Step 2: Build** — `moon run kit:build` y `moon run kit:own`. Esperado: 0.
- [ ] **Step 3: Verificación** — word-budget y las dos tandas; resultados con la rúbrica fila a fila y las líneas `suma:` en `tests/sdd-validate-0367-green.md`. Un fallo de VF10 abre una tanda de REFACTOR (prevista en la spec).
- [ ] **Step 4: Commit de la task** — `fix(sdd-validate): en delegate, la vuelta a sdd-implement y el paso a sdd-archive no se preguntan`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 1,5h (dos tandas largas de batería)
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,4h
- Base de la estimación: 2 tasks; la 0365 (dos escenarios y dos frases) tardó más por el molde; aquí el molde ya existe.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: `vf10` rojo en el RED y 2/2 en el GREEN; `vf9` 2/2.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED 1, AND «con `field`… lo invoca… sin preguntar… el cierre fusiona en `develop`» → Task 2, `vf10` VF10 (b) y (c). ✓
- MODIFIED 1, «con el bloque incompleto pregunta; hotfix a la rama estable, tag y push sin `merge.push` siguen siendo de una persona» → sin cambio de texto (lo fija `sdd-archive` paso 7); sin escenario nuevo, decisión 11 de la spec. ⚠
- MODIFIED 1, resto de cláusulas → sin cambio; `vf1`–`vf9` existentes. ✓
- MODIFIED 2, AND «vuelve sin preguntar antes de la task, en cualquier modo, en `delegate` y `unattended`» → Task 2, `vf10` VF10 (a); `vf2` y `vf3` VF10 (a). `unattended` sin escenario (decisión 10). ✓
- MODIFIED 2, AND «no pasa a `sdd-archive` hasta que la validación queda registrada» → Task 2, `vf10` VF10 (b). ✓
- MODIFIED 2, AND «sigue preguntando, sola, una decisión de la revisión final, y el 3.er fix para» → Task 2, control `v1a`; el 3.er fix, sin medir (decisión 12). ⚠
- Lo que se retira: «without asking» de `SKILL.md:28` → Task 2, Step 1; `grep -c "without asking" skills/sdd-validate/SKILL.md` → 1. ✓
- Saldo de palabras → Task 2, `word-budget.test.ts`. ✓
- Review Focus → Task 1, VF10 (b) y (c); Task 2, `v1a`. ✓
