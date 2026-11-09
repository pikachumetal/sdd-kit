---
id: 20261109-105429-feature-0284-word-budgets-without-slack
feature: 0284
title: Plan de implementación — Los topes de palabras vuelven a mandar, sin el margen del 25 %
spec: ./spec.md
status: approved
created: 2026-11-09
---

# Plan de implementación — Los topes de palabras vuelven a mandar, sin el margen del 25 %

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las dos tasks las hace el hilo (Native); son un test y una frase, sin prosa que interpretar. La revisión final va con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura, no (ver «Eje Arquitectura»).
2. Ejecución: native (ver la línea `Ejecución`).
3. Decisión técnica: el test del GIVEN llama a `expectWithin` directamente, sin extraerla a otro módulo; vitest captura el `expect` que falla como excepción (`AssertionError`), y `toThrow` lo comprueba.
4. Riesgo alto: ninguno. El medio, que la base cambie antes del cierre: lo cubre la decisión 8 de la spec.
5. Coste estimado: ~0,5 h de implementación; sin sujetos (0 $); la revisión final, ~3 $ en dos ejes.
6. Review Focus: 2 entradas; ver la sección.

**Goal**: `word-budget.test.ts` compara cada medida con su tope nominal, sin factor, con los topes de la spec.

**Architecture**: sale el factor y sus dos ayudantes del test; `expectWithin` compara con el tope tal cual. Las cifras de los topes son las de la tabla «Topes de palabras» de la spec. La regla 6 de `CLAUDE.md` se reescribe con el texto de su decisión 6.

**Tech Stack**: TypeScript y Vitest en `cli/` (ver `.docs/sdd/tech-stack.md`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks sin interfaz entre ellas, un error lo caza el propio test o el pre-commit, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambian cifras y ayudantes de un test existente y una frase de `CLAUDE.md`; ni módulo, ni dependencia, ni contrato.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.
- Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- El mensaje de fallo de `expectWithin` no cambia: `mide ${measured} y el tope es ${budget}: recorta, o sube el tope con la decisión del dev-lead escrita en la spec`.

### De proceso

- Política de modelos del Art. IV: modelo y effort se declaran al despachar; `fable` y `opus xhigh`, prohibidos por defecto.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia.

## Review Focus

- La base cambia antes del cierre (fusiona la 0322 u otra rama que suma palabras) → `word-budget.test.ts` en rojo tras el merge de sincronización; se re-mide y la cifra va como enmienda con el id de la rama (decisión 8 de la spec) · lo cubre el gate de cierre tras la sincronización, en `sdd-archive`.
- Un tope que no se pasaba hoy queda igual → solo cambian las 14 cifras de la tabla de la spec · Task 1, `git diff` del test contra la tabla.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: quitar código y cambiar cifras; nada más simple.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Brownfield gate**: el test conserva sus nombres y su mensaje.
- [x] **Constitution check**: Art. I (los topes suben por decisión escrita en la spec), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `cli/test/kit/word-budget.test.ts` — sin factor; topes nuevos; test del GIVEN.
- `CLAUDE.md` — regla 6, una frase.

**NO se tocan**:

- `skills/` y `dist/skills/` — ninguna skill cambia de texto (spec, decisión 1).
- `.docs/sdd/capabilities/archive.md` — la fusiona el cierre desde el delta.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La base cambia antes del cierre y una cifra deja de ser lo medido | media (0322 en marcha) | rojo en el gate tras sincronizar | decisión 8 de la spec: re-medir y enmienda |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El test compara contra el tope nominal

**Tras**: —
**Modelo**: hilo principal (Native); effort de la sesión.
**Tests RED**: hilo principal · `cli/test/kit/word-budget.test.ts`, el test del GIVEN, escrito antes de quitar el factor.
**Superficies**: tooling
**Verificación**: `cd cli; pnpm exec vitest run test/kit/word-budget.test.ts` → `Tests  78 passed (78)` (sale el test del redondeo y entra el del GIVEN).

**Interfaces**:
- Consume: nada.
- Produce: `expectWithin(measured: number, budget: number): void`, que falla con `mide <medido> y el tope es <tope>: …` si `measured > budget`.

**Ficheros**: modificar `cli/test/kit/word-budget.test.ts`

- [ ] **Step 1: RED** — sustituir el test `aplica el margen redondeando al par` por:
  ```ts
  it('una skill por encima de su tope sale en rojo con las dos cifras', () => {
    expect(() => expectWithin(3692, 3600)).toThrow('mide 3692 y el tope es 3600');
  });
  ```
  Correr la verificación: falla, porque con el factor el límite es 4500 y no lanza.
- [ ] **Step 2: GREEN** — quitar `slack` y su comentario, `roundHalfToEven` y su comentario, y `budgetWithSlack`; `expectWithin` compara con `budget` y lo pone en el mensaje. Correr: el test del GIVEN pasa y salen en rojo los topes de la tabla de la spec.
- [ ] **Step 3: Topes** — cambiar exactamente estas cifras y ninguna más:
  - `sdd-agent-writing` total 8760 → 8949
  - `sdd-archive` total 8000 → 9794
  - `sdd-debugging` total 3400 → 3407
  - `sdd-end-release` skillMd 1900 → 1920
  - `sdd-init` skillMd 2500 → 2648, total 3100 → 3193
  - `sdd-templates` total 15720 → 16999
  - `sdd-verify` total 9120 → 9577
  - `sdd-worktrees` skillMd 1300 → 1431, total 1300 → 1431
  - `kitBudget` 89328 → 103372
  - `constitution.md` 2236 → 2250, `mission.md` 1700 → 1808, `architecture.md` 1900 → 2253, `tech-stack.md` 19663 → 23181
  Antes, `moon run kit:build` y re-medir con el conteo del test: si una cifra no coincide con la medida, la base cambió; se aplica la decisión 8 de la spec.
- [ ] **Step 4: Verificación** — la de arriba, en verde; y `moon run cli:typecheck`.
- [ ] **Step 5: Commit de la task** — `test(kit): topes de palabras sin el margen del 25 %`.

### Task 2 — La regla 6 cuenta el saldo sobre las skills que toca

**Tras**: —
**Modelo**: hilo principal (Native); effort de la sesión.
**Tests RED**: no aplica — `CLAUDE.md` es la guía de sesión del repo, no una skill (spec, decisión 6).
**Superficies**: docs
**Verificación**: `git grep -n "saldo de palabras" -- CLAUDE.md` → una sola línea, con «de las skills que toca, contadas juntas».

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: modificar `CLAUDE.md`

- [ ] **Step 1: Implementación** — en la regla 6, sustituir «y el saldo de palabras de la skill queda igual o baja, porque» por «y el saldo de palabras de las skills que toca, contadas juntas, queda igual o baja (una regla que pasa de una skill a su plantilla, como pide la ADR 0014, no alarga), porque». Nada más en la regla.
- [ ] **Step 2: Verificación** — la de arriba.
- [ ] **Step 3: Commit de la task** — `docs(claude): el saldo de palabras se cuenta sobre las skills que toca`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 0.3h
- Estimación de revisión: 0.3h
- Estimación de cierre: 0.5h
- Base de la estimación: 2 tasks mecánicas, cifras ya medidas; la incertidumbre es la base que cambia (0322).
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] `moon run kit:build kit:copies kit:own kit:skill-size`: sin rojos nuevos frente al baseline de `3b179f84` (`kit:own` en rojo con 24 frases repetidas, de la 0311; los otros, en verde)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- GIVEN una skill con 3.692 palabras y tope 3.600 WHEN corre `word-budget.test.ts` THEN sale en rojo con las dos cifras → Task 1, `una skill por encima de su tope sale en rojo con las dos cifras`. ✓
- `word-budget.test.ts` pasa sin margen, con cada tope nuevo y su motivo en la spec → Task 1, Step 4; los motivos, tabla «Topes de palabras» de la spec. ✓
- `moon run kit:build kit:copies kit:own kit:skill-size` sin rojos nuevos → §3. ✓
- `sdd-templates` cuenta por el conjunto → Task 2, verificación por `git grep`. ✓
- Delta de `archive`, «Límites» → lo fusiona `sdd-archive` al cerrar; probado ya sobre una copia (`archive.md: regla «Límites» sustituida`). ✓
- Filas de «Lo que se retira o cambia de forma» del test → Task 1, Steps 1-2. ✓
- Review Focus, base que cambia → §3 y cierre (decisión 8). ✓
