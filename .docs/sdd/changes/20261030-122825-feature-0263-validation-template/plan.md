---
id: 20261030-122825-feature-0263-validation-template
feature: 0263
title: Plan de implementación — La validación se presenta siempre igual, y la spec decide quién valida
spec: ./spec.md
status: approved
created: 2026-10-30
---

# Plan de implementación — La validación se presenta siempre igual, y la spec decide quién valida

## Decisiones que he tomado yo — valida estas

1. Dos tasks en Native, sesión Opus 5.5 — el dev-lead aprobó sin parar a bajar de modelo.
2. El molde `reservas-config-agent` ya está en `subject.mjs`, del RED; `t3` solo añade su fila.
3. La evidencia RED/GREEN va en `tests/validation-template-red.md`.
4. Coste: ~1 h, ~4 $ de sujetos, tope 8 $.
5. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: la validación sale de una plantilla y la spec dice quién valida.

**Architecture**: la forma vive en una plantilla de chat; los pasos dicen cuándo y enlazan. Texto, sin código ejecutable salvo el molde del RED.

**Tech Stack**: Markdown de skills y baterías de sujetos.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks de texto encadenadas, un error lo caza el sujeto GREEN y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no añade módulo, dependencia ni contrato; una plantilla más en `templates/`.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos; clean code; nombres en inglés y texto humano en castellano.
- Saldo de palabras (`wc -w`): `sdd-start-feature/SKILL.md` ≤ 1977, `control-profiles.md` ≤ 4805, `sdd-archive/SKILL.md` ≤ 4616, `dev-validation.md` ≤ 1029, `sdd-templates/SKILL.md` ≤ 1663.
- Bloques de comandos sin lenguaje.

### De proceso

- Sujetos Sonnet, por tandas, hasta `control.maxParallelAgents`; `fable` y `opus xhigh`, prohibidos.
- Revisión final: Spec opus+high, Código sonnet+high.

## Review Focus

- Un proyecto sin entorno declarado → el guion lo dice y sigue por los pasos · Task 1, plantilla; `g3` de control.
- `Validación: agente` con un THEN que se ve en una pantalla → vuelve a `dev-lead` como desvío · Task 2, `control-profiles.md`; sin sujeto, se lee.
- `validado` a secas → es validación y registra «no detalló qué probó» · Task 2, se conserva en el paso 7.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una plantilla y una línea.
- [x] **YAGNI gate**: sin clave nueva ni comprobación en la CLI.
- [x] **Brownfield gate**: sin la línea, todo sigue como `dev-lead`.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en Task 2), Art. II (hueco de plantilla), Art. VIII.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/templates/validation-template.md` — forma y orden del mensaje.
- `tests/validation-template-red.md` — evidencia.

**Modificar**:

- `skills/sdd-templates/SKILL.md`, `spec-template.md`, `patch-template.md`, `walkthrough-template.md` — fila, hueco y línea de registro.
- `skills/sdd-start-feature/SKILL.md`, `references/control-profiles.md`, `skills/sdd-archive/SKILL.md`, `references/dev-validation.md` — trazan.
- `.docs/workflow/usage-guide.md`, `tests/batteries/sdd-archive/battery.md`.

**NO se tocan**:

- `skills/sdd-propose/` — la línea la pide el hueco.
- `cli/` — nada la lee.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto no abre la plantilla | media | alto | la frase va al paso que decide (`tech-stack.md`, «Una regla que solo vive en una referencia no se lee»); `t1` lo mide |

### 1.8 Rollout

Directo, en la siguiente release.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La plantilla y sus huecos

**Tras**: —
**Modelo**: sesión Native.
**Tests RED**: hechos, `red/out/t1-1` y `t2-1`.
**Superficies**: docs.
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` desde `cli/` → `Tests` sin fallos.
**Se prueba en la aplicación**: no, porque es base común de la Task 2.

**Interfaces**:
- Consume: nada.
- Produce: `validation-template.md`; la línea `Validación: dev-lead | agente — <porqué>`; el registro `Validación por el agente: <fecha> · <evidencia>`.

**Ficheros**: los de plantillas de §1.1.

- [ ] **Step 1**: escribir la plantilla, con el orden de la spec, la excepción de `AskUserQuestion` con su porqué, el caso `agente` (sin guion) y `field` (sin guion). Añadir el hueco tras el 🦆 de `spec-template.md` y antes de «Capacidades» en `patch-template.md`; el registro en `walkthrough-template.md` §4.2 y `patch-template.md` §4.
- [ ] **Step 2**: fila en `sdd-templates/SKILL.md`, recortando otra para que no suba.
- [ ] **Step 3**: Verificación.
- [ ] **Step 4**: commit de la task.

### Task 2 — Las skills trazan desde la plantilla

**Tras**: Task 1
**Modelo**: sesión Native.
**Tests RED**: `t3` nuevo, en `battery.md`.
**Superficies**: docs, baterías.
**Verificación**: GREEN de `t1`, `t2`, `t3`, `v1a`, `v1b`, `g1`, `g3` leídos con su rúbrica; y `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts`.
**Se prueba en la aplicación**: no, porque el kit se valida con sujetos.

**Interfaces**:
- Consume: los literales de la Task 1.
- Produce: nada.

**Ficheros**: los de skills y `usage-guide.md` de §1.1, `tests/validation-template-red.md`.

- [ ] **Step 1**: paso 7 de `sdd-start-feature` y paso 1 de `sdd-archive`: la primera frase de la presentación nombra la plantilla y lee `Validación:`; sale el texto de forma, incluidas las tres opciones. `control-profiles.md`: la regla de quién valida, en «Validación diferida»/«en campo». `dev-validation.md`: remite a la plantilla.
- [ ] **Step 2**: `usage-guide.md` §Validar de verdad, con el orden nuevo.
- [ ] **Step 3**: filas de rúbrica `T1`-`T3` y escenario `t3` en la batería; lanzar el GREEN; evidencia.
- [ ] **Step 4**: `wc -w` de cada fichero con saldo.
- [ ] **Step 5**: commit de la task.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 1h
- Base de la estimación: 2 tasks de texto y una tanda de sujetos
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- «El trabajo se valida…», presentación y orden → Task 2, `t1`. ✓
- Guion último, rama, worktree, entorno, bloques, parada y frase final → Task 2, `t1`. ✓
- Sin `AskUserQuestion` → Task 2, `t1` (`claude -p` no la tiene: se puntúa el final del mensaje y que no la busque). ⚠ avisado en la spec, decisión 2.
- `startEnvironment: true` → Task 2, `g3`. ✓
- `agente` sin guion y con su línea → Task 2, `t3`. ✓
- ✅ de `agente` → sin observar: el molde no tiene fila; leído en `sdd-archive`. ⚠
- Sin la línea, valida el dev-lead → Task 2, `t2`. ✓
- Spec delegada, patch y vuelta a `dev-lead` → sin observar: reglas de una línea leídas en `control-profiles.md`. ⚠
- `field` → Task 2, `v1b`. ✓
- Filas de «Lo que se retira» → Task 2, búsqueda de los literales. ✓
