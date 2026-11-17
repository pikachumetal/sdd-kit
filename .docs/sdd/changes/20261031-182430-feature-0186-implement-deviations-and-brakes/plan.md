---
id: 20261031-182430-feature-0186-implement-deviations-and-brakes
feature: 0186
title: Plan de implementación — Freno por regiones, tasks.md antes de la Task 1 y oferta de gama media con su cuenta
spec: ./spec.md
status: approved
created: 2026-10-31
---

# Plan de implementación — Freno por regiones, tasks.md antes de la Task 1 y oferta de gama media con su cuenta

## Decisiones que he tomado yo — valida estas

1. Modelo por task: implementador en Haiku (`general-purpose` + `model: haiku`), porque cada task trae su texto literal; revisor de task en Sonnet con `sdd-kit:effort-medium`. Los ejes de la revisión final, los de la spec.
2. Ejecución: SDD, por la regla de compactación. La sesión viene de una compactación y quedan tres tasks sin su línea `complete`.
3. Los sujetos los lanza el hilo principal, en serie y como «Verificación lenta»: pasan de 10 min y compiten por la copia del kit.
4. Riesgo alto: un freno que deje de parar ante un solape real. Lo vigila `b2`.
5. Coste estimado: 2,5 h; 24 $ de sujetos pendientes (techo total 35 $) y ~4 $ de implementadores y revisores de task, además de la revisión final.
6. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el freno compara regiones, `tasks.md` nace antes de la primera task y las ofertas de gama media dicen cuántas tasks hay, con el saldo de palabras a la baja.

**Architecture**: solo cambia texto de tres skills. Cada cambio paga sus palabras con recortes de duplicados, y lo mide un escenario de la batería de su skill.

**Tech Stack**: skills en Markdown, baterías con sujetos `claude -p` (`tests/headless/`), Vitest para el tope de palabras.

**Spec**: `./spec.md`

**Ejecución**: subagent, porque la sesión se retomó tras una compactación con las tres tasks por hacer, y cada una trae su texto literal, sin interfaz entre ellas salvo dos que tocan `sdd-implement`.

**Eje Arquitectura**: no — solo cambia el texto de tres skills y sus baterías.

## Restricciones globales

### De código

- Las skills van en inglés salvo `sdd-start-feature/references/control-profiles.md`, en castellano. El texto nuevo es el literal de cada task.
- Saldo de palabras: `sdd-implement` −16, `control-profiles.md` −7, `sdd-propose` −9, con este texto.
- Art. X: sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Política de modelos: la línea «Política de modelos» de la spec; sujetos en Opus y en serie, techo 35 $ en total.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; el mensaje va con `git commit -F <fichero>`, por el hook de comandos.
- Una regla reescrita en el REFACTOR se mide otra vez en todos los escenarios que la alcanzan.

## Review Focus

- La base cambia un fichero de la task y el plan no dice qué líneas toca → es freno, para · Task 1, `b1`-`b3` no lo ejercitan: lo cubre la lectura del eje Spec sobre «lines you can't tell».
- Bucle SDD sin `tasks.md` antes del primer despacho → lo escribe igual · Task 2: sin sujeto SDD, por coste; lo cubre la lectura del eje Spec sobre el paso 1 del bucle.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres frases sustituidas, una movida y una condición; ninguna pieza nueva.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: `b2` y `b3` fijan que el freno sigue parando y que el solape declarado sigue.
- [x] **Constitution check**: Art. I, cada frente con su RED, y una pieza entra y otra sale.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-implement/SKILL.md` — freno por regiones, `tasks.md` en los dos bucles, dos filas de excusa fuera.
- `skills/sdd-start-feature/references/control-profiles.md` — freno por regiones, dos recortes.
- `skills/sdd-propose/SKILL.md` — las dos ofertas con su número, un red flag fuera.
- `tests/batteries/sdd-propose/battery.md` y `subject.mjs` — escenario `g1b`, rúbrica de la oferta y turnos de `g1`.

**Crear**:

- `tests/implement-brakes-0186-green.md` — evidencia GREEN con citas, la escribe el hilo principal.

**NO se tocan**:

- `skills/sdd-verify/` — fuera de la spec.
- `skills/sdd-templates/templates/plan-template.md` — la frase «Si hay más de una task → crear `tasks.md`» no contradice la regla.

### 1.2-1.6

No aplican.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un sujeto deja de parar ante un solape real | baja | alto | `b2`, n = 2 |
| Se pasa el techo de 35 $ | media | medio | `COST_CAP` por tanda; si no cabe un REFACTOR, se para |

### 1.8 Rollout

Directo: llega con la siguiente versión del plugin.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El freno compara regiones

**Tras**: —
**Modelo**: `general-purpose` + `model: haiku`, porque el texto viene literal.
**Tests RED**: hilo principal · `b1`, `b2`, `b3` de `tests/batteries/sdd-implement/battery.md`, ya en el commit de apertura, con el RED medido.
**Superficies**: docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`
**Verificación lenta**: la lanza el hilo principal · `b1`, `b2`, `b3`, n = 2 · ~15 min
**Se prueba en la aplicación**: no, porque es guía para el agente: la prueban los sujetos.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-implement/SKILL.md` y `skills/sdd-start-feature/references/control-profiles.md`.

- [ ] **Step 1: `skills/sdd-implement/SKILL.md`**
  - «Before each task», paso 1: sustituye `: a match is the same brake, because another feature already changed what this one will touch.` por `: for a match, compare `git diff -U0` of the base with the lines the task will touch. An overlap the spec doesn't declare, or lines you can't tell, is the same brake. Other lines, or an overlap the spec declares with file and region and the base stays inside it, is a `Ruling:` with both ranges, and you go on.`
  - «Deviations and rulings», «Scope brakes»: `the feature's row or a task file changed in the base` pasa a `the feature's row or the task's lines changed in the base`.
  - Fila de excusa «It doesn't change the spec, so it's a ruling»: `the row and the file changed in the base` pasa a `the row and the task's lines changed in the base`.
  - Quita las dos filas de excusa que empiezan por `| "The row didn't change and `develop` only brings another feature` y `| "The constitution says all green in every task`.
- [ ] **Step 2: `skills/sdd-start-feature/references/control-profiles.md`**
  - Celda de la tabla de gates: `fila de la feature o fichero de la task cambiados en la base` pasa a `fila de la feature o líneas de la task cambiadas en la base`.
  - «Más»: quita la línea `- «EN ESPERA» no es un estado del roadmap: es la feature en curso esperando al usuario.`
  - Quita la viñeta que empieza por `- Lo de arriba vale para lo que se aparta del plan sin tocar la spec`.
  - «Fichero de la task cambiado en la base»: quita ` Cualquier otro fichero para igual.` y sustituye `Si alguno coincide, es un posible desvío.` por `Si alguno coincide, compara `git diff -U0 $(git merge-base HEAD <integración>) <integración> -- <fichero>` con las líneas que tocará la task. Solape no declarado, o líneas que el plan no deja saber: posible desvío. Otras líneas, o un solape que la spec declara con fichero y región sin salir de ella: ruling con los dos tramos, y sigues.`
  - En `pair` y `delegate` de esa sección, deja: `` - `pair` y `delegate`: nombran los ficheros, los commits de la base que los tocan (`git log --oneline $(git merge-base HEAD <integración>)..<integración> -- <fichero>`) y los tramos («la base cambia las líneas A–B; la task toca C») y paran. ``
- [ ] **Step 2b: Build** — no hay build de esta superficie.
- [ ] **Step 3: Verificación** — `npx vitest run test/kit/word-budget.test.ts` desde `cli/`. Esperado: `Tests  N passed (N)`.
- [ ] **Step 4: Commit de la task** — `fix(skills): el freno de fichero cambiado en la base compara regiones`, con cuerpo en castellano.

### Task 2 — `tasks.md` nace antes de la primera task

**Tras**: Task 1
**Modelo**: `general-purpose` + `model: haiku`, porque el texto viene literal.
**Tests RED**: hilo principal · `e1`, `n1` de `tests/batteries/sdd-implement/battery.md`, ya en el commit de apertura, con el RED medido.
**Superficies**: docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`
**Verificación lenta**: la lanza el hilo principal · `e1`, `n1`, n = 2 · ~15 min
**Se prueba en la aplicación**: no, porque es guía para el agente: la prueban los sujetos.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-implement/SKILL.md`.

- [ ] **Step 1: Mover la regla**
  - «Setup», paso 4: quita ` With more than one task, `tasks.md` is the **living record** (status and commit hash per task); the harness todo list is ephemeral.`
  - «Native loop», paso 1, justo tras `1. **Take the task**: ` añade: `Before the first `task start`, with more than one task, write `tasks.md`, the **living record** (status and commit hash per task): it goes in the opening's commit or, if that is done, in Task 1's. `
  - «SDD loop», «1. Dispatch the implementer», primera viñeta, al principio: `In SDD, the same `tasks.md` before the first dispatch. `
- [ ] **Step 2: Build** — no hay build de esta superficie.
- [ ] **Step 3: Verificación** — `npx vitest run test/kit/word-budget.test.ts` desde `cli/`. Esperado: `Tests  N passed (N)`.
- [ ] **Step 4: Commit de la task** — `fix(skills): tasks.md nace antes de la primera task`, con cuerpo en castellano.

### Task 3 — La oferta de gama media dice cuántas tasks

**Tras**: Task 2
**Modelo**: `general-purpose` + `model: haiku`, porque el texto viene literal.
**Tests RED**: hilo principal · `g1` y `g1b` de `tests/batteries/sdd-propose/battery.md`, sin commitear: van en el commit de la task. La «Oferta con su número» de `g1` tiene el RED medido (`g1-10`).
**Superficies**: docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`
**Verificación lenta**: la lanza el hilo principal · `g1`, `g1b`, n = 2 · ~10 min
**Se prueba en la aplicación**: no, porque es guía para el agente: la prueban los sujetos.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-propose/SKILL.md`.

- [ ] **Step 1: Paso 4**, tercera opción del gate: `A third option, in `delegate` on the most capable model, not the recommended one: «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media», with its reason` pasa a `A third option, in `delegate` on the most capable model with more than one task foreseen, not the recommended one: «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media (prevé <n> tasks)», with its reason`.
- [ ] **Step 2: Paso 5**: `If the recommended or fixed method is Native and the session runs on the most capable model, add, not as the recommended one, «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media», with step 4's reason` pasa a `If the recommended or fixed method is Native and the session runs on the most capable model with more than one task, add, not as the recommended one, «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media (quedan <n> tasks)», with step 4's reason`.
- [ ] **Step 3: Red flags**: quita la viñeta `- You're about to ask «which task do we start?» in a separate turn, with the `feature/<id>` branch already created and `<id>` with a pending roadmap row.`
- [ ] **Step 4: Verificación** — `npx vitest run test/kit/word-budget.test.ts` desde `cli/`. Esperado: `Tests  N passed (N)`.
- [ ] **Step 5: Commit de la task** — `fix(skills): la oferta de gama media dice cuántas tasks`, con cuerpo en castellano; incluye `tests/batteries/sdd-propose/`.

### Task 4 — enmienda 2026-10-31: la CLI exige `tasks.md`

**Tras**: Task 3
**Modelo**: `sdd-kit:effort-medium` + `model: sonnet`, porque es código con tests y fixtures que adaptar.
**Tests RED**: hilo principal · `cli/test/tasks/brief.test.ts`, sin commitear.
**Superficies**: tooling
**Verificación**: `npx vitest run test/tasks/brief.test.ts test/tasks/executing.slow.test.ts test/tasks/native.slow.test.ts test/tasks/workspace.slow.test.ts test/kit/word-budget.test.ts --test-timeout 120000` desde `cli/` → `Tests  N passed (N)`
**Verificación lenta**: la lanza el hilo principal · `n1`, n = 2 · ~10 min
**Se prueba en la aplicación**: `sdd task start` sobre un plan de dos tasks sin `tasks.md` falla y nombra el fichero.

**Interfaces**:
- Consume: `writeBrief(request)` y `extractTask` de `cli/src/tasks/brief.ts`.
- Produce: nada.

**Ficheros**: modificar `cli/src/tasks/brief.ts`, los fixtures de plan de varias tasks de `cli/test/tasks/executing.slow.test.ts`, `native.slow.test.ts` y `workspace.slow.test.ts`, y `skills/sdd-implement/SKILL.md`.

- [ ] **Step 1: Comprobación** en `writeBrief`, antes de escribir: fuera de lite, si los encabezados `Task <n>` del plan fuera de fences son más de uno y no existe `tasks.md` en la carpeta del plan, `DomainError` con el texto `plan with <n> tasks and no tasks.md: write <ruta> before the first task (status and commit per task)`.
- [ ] **Step 2: Fixtures**: los tests que usan un plan de varias tasks crean también su `tasks.md`; ninguna aserción cambia.
- [ ] **Step 3: Quitar la ronda fallida** de `skills/sdd-implement/SKILL.md`: la viñeta de «Red flags» que empieza por `- First ` y termina en `no ` + `tasks.md` + ` yet.`, y `, tasks.md` al final de las dos apariciones del nodo Setup del grafo Native.
- [ ] **Step 4: Verificación** — los comandos de «Verificación». Esperado: `Tests  N passed (N)`.
- [ ] **Step 5: Commit de la task** — `feat(cli): task start y task brief exigen tasks.md con más de una task`, con cuerpo en castellano.

### Task 5 — enmienda 2026-10-31: el ruling contra «Dónde se prueba» es desvío (retirada: `g2` no reproduce el fallo)

**Tras**: Task 4
**Modelo**: `general-purpose` + `model: haiku`, porque el texto viene literal.
**Tests RED**: hilo principal · `g1` de `tests/batteries/sdd-implement/battery.md`, ya commiteado; RED: `control/out/g1-2`.
**Superficies**: docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`
**Verificación lenta**: la lanza el hilo principal · `g1`, n = 3 · ~10 min
**Se prueba en la aplicación**: no, porque es guía para el agente: la prueban los sujetos.

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-implement/SKILL.md`.

- [ ] **Step 1**: «Native loop», paso 2, viñeta «**The plan is wrong**»: justo tras `a command that cannot work.` añade, con un espacio delante: `A ruling that removes or moves a test «Dónde se prueba» names is a deviation: stop with the update action.`
- [ ] **Step 2: Verificación** — el comando de «Verificación». Esperado: `Tests  N passed (N)`.
- [ ] **Step 3: Commit de la task** — `fix(skills): el ruling que quita un test de Dónde se prueba es desvío`, con cuerpo en castellano.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 3 h
- Estimación de implementación: 2,5 h
- Base de la estimación: 3 tasks de texto literal, ~24 sujetos en serie a ~3 min, una revisión final.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Controles: `g1` de `sdd-implement` n = 2; `d1`, `a1`, `a2` n = 1.
- [ ] Una fila de smoke por THEN, con evidencia, en la evidencia GREEN.
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`).

---

## 4. Self-review (cobertura spec → tasks)

- `control-profiles`, cruce de `git diff --name-only` → sin cambio; Task 1, `b1`-`b3` (el sujeto lo corre). ✓
- AND compara `git diff -U0` → Task 1, `b1`. ✓
- AND otra región, ruling con los dos tramos y sigue → Task 1, `b1`. ✓
- AND misma línea declarada, ruling y sigue → Task 1, `b3`. ✓
- AND misma línea sin declarar, nombra tramos y para → Task 1, `b2`. ✓
- AND el plan no deja saber qué líneas toca → sin observar: ningún molde lo planta; va al Review Focus. ⚠
- AND `unattended` sigue con enmienda sin aprobar → sin observar: el texto no cambia y el molde es `delegate` (decisión de la spec sobre coste). ⚠
- `tasks.md` antes del primer `task start` → Task 2, `n1`, N2. ✓
- `tasks.md` antes del primer despacho en SDD → sin observar: sin sujeto SDD, por coste; va al Review Focus. ⚠
- AND va en el commit de apertura o en el de la Task 1 → Task 2, `n1`. ✓
- AND con una sola task no lo escribe por esta regla → sin observar: el texto lo condiciona y ningún molde lo planta. ⚠
- Gate de la spec en `delegate` con número → Task 3, `g1`. ✓
- AND aprobar sin esa opción sigue sin parar → sin cambio. N/A. ✓
- AND con una sola task no la ofrece → Task 3, `g1b`. ✓
- Gate del plan en `pair` con número y su contraejemplo → sin observar: `pair` no está en el molde, misma forma que el paso 4 (spec, «Previsión de coste»). ⚠
- Filas de «Lo que se retira» → Tasks 1-3, por `word-budget.test.ts` y la lectura del eje Spec. ✓
- Review Focus → Tasks 1 y 2, lectura del eje Spec. ✓
