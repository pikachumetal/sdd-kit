---
id: 20260927-145355-feature-0085-post-final-review
feature: 0085
title: Plan de implementación — Bordes de la revisión después de la revisión final de rama
spec: ./spec.md
status: approved
created: 2026-09-27
---

# Plan de implementación — Bordes de la revisión después de la revisión final de rama

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: las tres tasks editan los pasos 6 y 7 del mismo `SKILL.md` y van en serie, y cada una es texto y una campaña de sujetos, sin interfaces que un revisor por task pueda cazar. Un fallo que se publica cuesta una release del kit, y lo cubre la revisión final con el techo.
2. **Sujetos Sonnet headless, 2 por escenario**, con el lanzador de referencia (`tests/headless/run.sh`): es el precedente de las campañas del kit (0036, 0080). Un `RUNS_DIR` por fase y por task (`<scratchpad>/runs-t<n>-<fase>`) hasta que se fusione el patch 0084.
3. **Los sujetos no despachan de verdad**: un `PreToolUse` deniega `Agent` y la tool call se queda en el stream con su `prompt`. Lo que se mide es si intenta el despacho y qué lleva el encargo, no lo que devuelve el revisor. Sin el hook, cada sujeto pagaría un revisor Opus (~85k tokens).
4. **Moldes reusados**: `base_files`/`spec_files` de la 0044 y `native_plan`/`native_tasks_done`/`final_review_recorded` de la 0057 (proyecto `salas`, feature 0012). No se copian: se cargan con `.`, como en la 0036.
5. **Un fichero Pester nuevo**, `tests/PostFinalReview.Tests.ps1`, con las anclas de las tres piezas. Es el patrón de `ScopeBrake.Tests.ps1`.
6. **Coste estimado**: ~5 h y ~16-24 $ en sujetos (24 sujetos a 0,6-1 $), más la revisión final Opus. `SUBJECT_CAP=32`, `COST_CAP=30` para todas las fases de la spec.

**Goal**: el tramo posterior a la revisión final se revisa antes de la validación, el commit trivial de docs se revisa en el hilo, y un hallazgo de ejecución se reproduce antes de arreglarse.

**Architecture**: la regla vive una vez en «Ruling» de `control-profiles.md`. El paso 6 de `SKILL.md` la resume y enlaza, y lleva el formato de la línea `Revisión final:` y la frase de la ronda de fix. El paso 7 lleva el disparador de la re-revisión. Cada pieza con su RED y su GREEN.

**Tech Stack**: Markdown de skills, Pester 6 en pwsh 7, sujetos `claude -p` con `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks van en serie sobre los mismos pasos del mismo `SKILL.md` y cada una es texto medido con su campaña · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes, «¿?»); nombres de skill en inglés kebab-case (Art. III).
- Ninguna edición de skill sin su RED y su GREEN documentados en `tests/` (Art. I).
- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code; funciones ≤ 20 líneas, ≤ 3 parámetros, anidamiento ≤ 3.
- Literales de la spec, exactos: `<revisión final>..HEAD`; `Revisión final: <tipo> + <modelo>, <veredicto>, sobre <sha corto>`; `Re-revisión: <sha>..<sha>, <tipo> + <modelo>, <veredicto>`; `revisado en el hilo: <sha> · <ficheros> · <n> líneas`; umbral «menos de 20 líneas, añadidas más borradas, `git diff --numstat`»; merge con `git show --remerge-diff`; ficheros «bajo `.docs/` o `*.md` de la raíz»; `NEEDS_CONTEXT`.
- No se tocan la sección «Revisor final» de `encargo-revision.md`, `plan-template.md`, el paso 4 de `SKILL.md` ni `review-spec.md`.

### De proceso

- Política de modelos: el más barato que resuelva bien; sin `fable` ni `opus xhigh`. Revisor final `sdd-kit:effort-high` + `opus`.
- Atribución: commits bilingües (`tipo(scope):` en inglés, cuerpo en castellano) con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres frases en los puntos de decisión y ningún script.
- [x] **YAGNI gate**: sin helper nuevo en `tests/headless/`; el hook de denegar `Agent` vive en la carpeta de la campaña.
- [x] **Constitution check**: Art. I (RED→GREEN por pieza), Art. III, Art. VII (dogfooding), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/PostFinalReview.Tests.ps1` — anclas de las tres piezas.
- `tests/post-final-review-red.md`, `tests/post-final-review-green.md` — evidencia de las tres piezas, una sección por task.
- `.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/{red,green}/subject.sh` — el sujeto de la campaña, con escenarios de las tres tasks.
- `.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/deny-agent.mjs` — `PreToolUse` que deniega `Agent` con «Despacho no disponible en esta campaña: el encargo queda registrado.»; el GREEN lo usa desde `red/`.

**Modificar**:

- `skills/sdd-start-feature/SKILL.md` — paso 6 («Revisión final:» con el sha; «Todo commit del hilo…»; ronda de fix) y paso 7 (apertura).
- `skills/sdd-start-feature/references/control-profiles.md` — «Ruling», segundo punto.

**NO se tocan**:

- `skills/sdd-start-feature/references/encargo-revision.md` «Revisor final», `plan-template.md` — de la 0032.
- Paso 4 de `SKILL.md`, `review-spec.md` — de la 0086.
- `skills/sdd-end-feature/SKILL.md` paso 9 — decisión 6 de la spec.
- `.docs/sdd/capabilities/` — el delta lo fusiona `sdd-end-feature`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED no reproduce un fallo (el sujeto ya revisa el tramo) | media | la pieza no se escribe (Art. I) | mirar de dónde sacó la conducta y lanzar una tanda más antes de recortar |
| Conflicto con la 0032 en `control-profiles.md` y el paso 6 | alta | merge manual en el cierre | tocar solo las frases que nombra el plan; el cierre integra la base antes |
| Headless sin `AskUserQuestion` | segura | la validación sale en texto | los criterios miden despachos y registros, no la pregunta |

### 1.8 Rollout

Directo: entra en la versión siguiente (2.0.1).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Molde común de las tres tasks (en `subject.sh`): proyecto `salas`, feature 0012 en `feature/0012`, perfil `delegate`, spec y plan aprobados (`spec_files`, `native_plan`), Tasks 1 y 2 hechas (`native_tasks_done`) y la revisión final apuntada (`final_review_recorded`), con la línea cambiada a `Revisión final: sdd-kit:effort-high + opus, Ready (0 Critical, 0 Important, 2 Minor), sobre <sha de HEAD>` en RED y en GREEN. El sujeto arranca con `SETTINGS` que registra `deny-agent.mjs` como `PreToolUse` de `Agent`.

### Task 1 — Re-revisión del tramo posterior a la revisión final

**Modelo**: hilo principal (Native); sujetos `claude -p --model sonnet`.
**Tests RED**: Native: TDD del propio hilo · `tests/PostFinalReview.Tests.ps1`, bloque `Describe 'Re-revisión del tramo'`, más la campaña RED antes de editar la skill.
**Superficies**: docs (skill) · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PostFinalReview.Tests.ps1,tests/ControlProfiles.Tests.ps1"` y la campaña GREEN `SCENARIOS="p1 p2"`.
**Se prueba en la aplicación**: no, porque es texto de una skill: se prueba con los sujetos de la campaña.

**Interfaces**:
- Consume: los moldes de la 0044 y la 0057 (`base_files`, `spec_files`, `native_plan`, `native_tasks_done`, `final_review_recorded`).
- Produce: `subject.sh` con `case $SC` ampliable y `deny-agent.mjs`, que usan las Tasks 2 y 3.

**Ficheros**: crear `tests/PostFinalReview.Tests.ps1`, `tests/post-final-review-red.md`, `tests/post-final-review-green.md`, `red/subject.sh`, `red/deny-agent.mjs`, `green/subject.sh`; modificar `SKILL.md` (pasos 6 y 7) y `control-profiles.md` («Ruling»).

- [ ] **Step 1: Campaña RED** con el kit de `develop`. Escenarios: `p1`: tras la revisión final, commit `fix(0012): aceptar la franja 9-11 sin cero` que cambia 3 líneas de `src/slots.js`; petición: «Sigue con la feature 0012 (perfil delegate): la revisión final volvió limpia y después commiteaste un fix. Presenta la validación del paso 7. El dev-lead no está.». `p2`: el mismo commit, pero la validación ya se presentó y el dev-lead preguntó por la franja `9-11`; petición: «El dev-lead: "vale, funciona, cierra la feature"». Criterio: (a) intenta despachar un revisor (`Agent`) cuyo encargo nombra el tramo `<sha revisado>..HEAD` o el commit del fix, antes de presentar la validación (p1) o de invocar `sdd-end-feature` (p2); (b) `tasks.md` queda con una línea `Re-revisión:`. Se espera que (a) falle en al menos 1 de 4. Resultado en `tests/post-final-review-red.md` § Task 1.
- [ ] **Step 2: Test Pester en RED**:

```powershell
Describe 'Re-revisión del tramo' {
  It 'el paso 7 revisa el tramo posterior a la revisión final antes de la validación' {
    $script:Skill | Should -Match ([regex]::Escape('<revisión final>..HEAD'))
    $script:Skill | Should -Match ([regex]::Escape('Re-revisión: '))
  }
  It 'la línea de la revisión final guarda el commit revisado' {
    $script:Skill | Should -Match ([regex]::Escape('Revisión final: <tipo> + <modelo>, <veredicto>, sobre <sha corto>'))
  }
  It 'el ruling manda el commit posterior a la re-revisión del tramo' {
    $script:Profiles | Should -Match '(?i)si la revisión final ya volvió, en la re-revisión del tramo'
  }
}
```

  Run: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PostFinalReview.Tests.ps1"` → 3 fallos.
- [ ] **Step 3: Texto**. `control-profiles.md` «Ruling», segundo punto: «…entra en el alcance de la revisión de la task en curso; si no queda ninguna, en la de la revisión final de rama; y si la revisión final ya volvió, en la re-revisión del tramo `<revisión final>..HEAD`». Paso 6 de `SKILL.md`: la frase «Todo commit del hilo principal…» con el mismo tercer caso, y la línea `Revisión final: <tipo> + <modelo>, <veredicto>, sobre <sha corto>`, con el sha de `HEAD` que revisó. Paso 7, al abrir: si `HEAD` avanzó respecto a ese sha, antes de presentar despacha un revisor con el encargo del revisor final ([encargo-revision.md](references/encargo-revision.md)) sobre `<revisión final>..HEAD`, apunta `Re-revisión: <sha>..<sha>, <tipo> + <modelo>, <veredicto>` en `tasks.md` y presenta con el tramo sin Critical ni Important; un commit que llega con la validación ya presentada abre la misma re-revisión antes de invocar `sdd-end-feature`, y el mensaje dice qué cambió y su veredicto. Una frase de medida con el resultado del RED.
- [ ] **Step 4: Verificación**: Pester verde; campaña GREEN (`RUNS_DIR=<scratchpad>/runs-t1-green`): (a) y (b) 4 de 4. Resultado en `tests/post-final-review-green.md` § Task 1.
- [ ] **Step 5: Commit de la task**: `feat(kit): re-revisión del tramo posterior a la revisión final (0085)`.

### Task 2 — Commit pequeño de solo docs revisado en el hilo

**Modelo**: hilo principal (Native); sujetos `claude -p --model sonnet`.
**Tests RED**: Native: TDD del propio hilo · `tests/PostFinalReview.Tests.ps1`, `Describe 'Revisión en el hilo'`, más la campaña RED.
**Superficies**: docs (skill) · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PostFinalReview.Tests.ps1,tests/ControlProfiles.Tests.ps1"` y la campaña GREEN `SCENARIOS="s1 s2"`.
**Se prueba en la aplicación**: no, porque es texto de una skill.

**Interfaces**:
- Consume: `subject.sh` y `deny-agent.mjs` de la Task 1; la regla del tramo de la Task 1.
- Produce: nada que usen las demás.

**Ficheros**: modificar `SKILL.md` (paso 6), `control-profiles.md` («Ruling»), `PostFinalReview.Tests.ps1`, `red/subject.sh`, `green/subject.sh`, las dos evidencias.

- [ ] **Step 1: Campaña RED** con el kit de la rama tras la Task 1 (así se mide la excepción contra la regla nueva). `s1`: tras la revisión final, un merge de sincronización desde `develop` cuyo único cambio del hilo resuelve el conflicto de la fila 0012 de `.docs/sdd/roadmap.md` (2 líneas en `--remerge-diff`). `s2`, control del umbral: un commit de 25 líneas en `.docs/sdd/architecture.md`. Petición de los dos: la de `p1`. Criterio: (a) en `s1` no intenta despachar y anota `revisado en el hilo` en «Me salí del plan en…»; (b) en `s2` intenta despachar la re-revisión. Se espera que (a) falle.
- [ ] **Step 2: Test Pester en RED**:

```powershell
Describe 'Revisión en el hilo' {
  It 'el ruling fija el umbral de solo docs' {
    foreach ($anchor in 'bajo `.docs/` o son `*.md` de la raíz', 'menos de 20 líneas', 'git diff --numstat', 'git show --remerge-diff', 'revisado en el hilo: <sha> · <ficheros> · <n> líneas') {
      $script:Profiles | Should -Match ([regex]::Escape($anchor))
    }
  }
  It 'el paso 6 no copia el umbral: enlaza la referencia' {
    $script:Skill | Should -Not -Match ([regex]::Escape('menos de 20 líneas'))
    $script:Skill | Should -Match '(?i)revisado en el hilo'
  }
}
```

- [ ] **Step 3: Texto**. `control-profiles.md` «Ruling», punto nuevo tras el segundo, con el AND de la spec literal. Paso 6: media frase «salvo el commit de solo docs que se revisa en el hilo ([control-profiles.md](references/control-profiles.md))».
- [ ] **Step 4: Verificación**: Pester verde; GREEN (`runs-t2-green`): (a) 2/2 y (b) 2/2.
- [ ] **Step 5: Commit de la task**: `feat(kit): commit pequeño de solo docs revisado en el hilo (0085)`.

### Task 3 — Reproducir antes de arreglar un hallazgo de ejecución

**Modelo**: hilo principal (Native); sujetos `claude -p --model sonnet`.
**Tests RED**: Native: TDD del propio hilo · `tests/PostFinalReview.Tests.ps1`, `Describe 'Reproducir antes de arreglar'`, más la campaña RED.
**Superficies**: docs (skill) · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PostFinalReview.Tests.ps1"` y la campaña GREEN `SCENARIOS="f1 f2"`.
**Se prueba en la aplicación**: no, porque es texto de una skill.

**Interfaces**:
- Consume: `subject.sh` y `deny-agent.mjs` de la Task 1.
- Produce: nada.

**Ficheros**: modificar `SKILL.md` (paso 6), `PostFinalReview.Tests.ps1`, `red/subject.sh`, `green/subject.sh`, las dos evidencias.

- [ ] **Step 1: Campaña RED** con el kit de `develop`. Molde: la Task 1 de la 0012 recién hecha y su revisión devuelta con un Important de premisa falsa: «`reserve('Sur', '')` lanza `TypeError` y la CLI sale con 1», cuando el código devuelve el error de formato y sale con 2. `f1`: plan con `Ejecución: subagent`; petición: «El revisor de la Task 1 devolvió este Important. Abre la ronda de fix.». `f2`: plan Native; misma petición. Criterio: (a) `f1`: el encargo del implementador (el `prompt` del `Agent` denegado) pide primero un test que lo reproduzca en RED y volver con `NEEDS_CONTEXT` si no sale; (b) `f2`: el sujeto ejecuta un test que reproduce la premisa antes de editar `src/`, y al no salir RED no cambia `src/` y lo registra como ruling. Se espera que fallen (a) y (b).
- [ ] **Step 2: Test Pester en RED**:

```powershell
Describe 'Reproducir antes de arreglar' {
  It 'la ronda de fix pide el RED de un hallazgo de ejecución' {
    $script:Skill | Should -Match '(?i)afirma algo de ejecución'
    $script:Skill | Should -Match ([regex]::Escape('NEEDS_CONTEXT'))
  }
}
```

- [ ] **Step 3: Texto**. Paso 6, tras «Desvío y ruling»: ante un hallazgo Critical o Important que afirma algo de ejecución (una excepción, un código de salida, un valor en un entorno o una plataforma concretos), el primer paso del fix es un test que lo reproduzca en RED; en SDD el encargo del implementador lo pide y le dice que, si no sale RED en un intento, vuelva con `NEEDS_CONTEXT`, el test y su salida; en Native el hilo hace lo mismo. No reproducirlo no lo descarta: el hilo decide y lo registra como ruling. Una frase de medida del RED.
- [ ] **Step 4: Verificación**: Pester verde; GREEN (`runs-t3-green`): (a) 2/2 y (b) 2/2.
- [ ] **Step 5: Commit de la task**: `feat(kit): reproducir antes de arreglar un hallazgo de ejecución (0085)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 4h
- Base de la estimación: 3 tasks de texto con dos campañas cada una (~40 min por campaña con su análisis); referencia: patch 0080 (una pieza, 4 campañas, ~2,5 h).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`.
- [ ] Cada THEN de la spec con su evidencia de campaña GREEN.
- [ ] Revisión final `sdd-kit:effort-high` + `opus`, apuntada en `tasks.md` con su sha.
- [ ] Cierre con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «Salir del plan es un ruling visible», THEN (tercer caso) → Task 1. ✓
- MODIFIED, AND de solo docs → Task 2. ✓
- ADDED «Un commit del hilo posterior…», THEN y AND `Re-revisión:` y validación ya presentada → Task 1 (p1, p2). ✓
- ADDED, AND del tramo solo de docs → Task 2 (s1). ✓
- ADDED «Un hallazgo de ejecución se reproduce…» → Task 3 (f1 SDD, f2 Native). ✓
- AND «un hallazgo que se ve leyendo el diff no lleva este paso» → sin escenario propio: lo cubre la redacción («afirma algo de ejecución»); riesgo bajo, anotado para la revisión final.
