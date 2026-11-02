---
id: 20261102-135210-feature-0271-clean-red-rules
feature: 0271
title: Plan de implementación — Una sola línea de conducta ante un RED limpio
spec: ./spec.md
status: approved
created: 2026-11-02
---

# Plan de implementación — Una sola línea de conducta ante un RED limpio

## Decisiones que he tomado yo — valida estas

1. Modelo: Native, la sesión implementa; sujetos de `sdd-implement` en Opus y de `sdd-propose` en Sonnet, como dice cada fila de batería. Revisión final: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: Native (abajo).
3. `a3` y `a4` montan el molde de `a2` con la spec y el humo cambiados en `subject.mjs`, sin fixtures nuevas: el mismo molde, para que la diferencia con `a2` sea solo la marca y la muestra.
4. `cr1` usa el molde `reservas-skills` de `co4`; `cr2`, ese molde más una fixture `spec-0028.md` y un molde de batería con la trampa de la 0277: la spec dice que no tiene `pendientes.md`, y lo tiene.
5. `n` de `cr1` y `cr2` vale 3 en el RED y baja a 2 tras él, como prevé la spec. `a3` queda en 3.
6. Riesgos altos: la previsión de 28,57 $ tiene poco margen sobre el techo de 30 $. `COST_CAP` se fija por tanda y se suma en el ledger; si la suma va a pasar de 30 $, paro (Art. I).
7. Coste estimado: ~2 h de hilo y ~29 $ de sujetos.
8. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dejar una sola regla de conducta ante un RED limpio en `tech-stack.md`, `spec-template.md`, `sdd-implement`, `control-profiles.md` y, si el RED lo exhibe, `plan-writing.md`.

**Architecture**: sustitución de texto, con cada frente medido con sujetos en las baterías existentes. La regla vive en `tech-stack.md` (método del repo) y en `sdd-implement` (lo que viaja a los proyectos); `plan-writing.md` remite a `sdd-implement`, nunca a `tech-stack.md`, que un proyecto no tiene.

**Tech Stack**: Markdown de skills; baterías de `tests/headless/battery.mjs`; Vitest de `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks casi independientes, un error lo caza su batería o el gate, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y escenarios de batería.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code; funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin alias de PowerShell; texto humano en castellano con tildes.
- Las skills, en inglés; los literales que marcan la spec («si el RED lo exhibe»), en castellano, tal cual.

### De proceso

- Política de modelos del Art. IV; `fable` y `opus xhigh`, prohibidos.
- Saldo: lo mide el hilo por skill y por `tech-stack.md` frente a `760feee7`, con el conteo de `word-budget.test.ts`, antes de cada commit de task.
- Texto con escapes, con las herramientas de edición, nunca en un script en heredoc (`tech-stack.md`).

## Review Focus

- `a3` con un sujeto que apunta el ruling pero además escribe la frase del paso 2 → falla: sacar el frente es no escribirla · Task 1, fila A3 de la rúbrica.
- Lo marcado con n = 3 cuyo sujeto sacó la conducta de una fuente incidental → otra tanda, no ruling; se escribe en `tech-stack.md`, no en la skill, porque en la cláusula no cabe · Task 1, lectura de «Una primera tanda limpia…» en la evidencia.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una línea de Scope y dos cláusulas, sin verbo nuevo.
- [x] **YAGNI gate**: sin abstracción.
- [x] **Constitution check**: Art. I (prueba, previsión, una pieza entra y otra sale), II (hueco en la plantilla, y un predicado observable), IX (no se quita texto de la fuente).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/batteries/sdd-propose/fixtures/spec-0028.md` — spec aprobada de `cr2`.
- `tests/clean-red-rules-0271-red.md` y `-green.md` — evidencia.

**Modificar**:

- `.docs/sdd/tech-stack.md` — las cuatro líneas del Scope.
- `skills/sdd-templates/templates/spec-template.md` — línea de Scope; salen dos frases.
- `skills/sdd-implement/SKILL.md` — cláusula de «Deviation»; sale una fila de excusas.
- `skills/sdd-propose/references/control-profiles.md` — cláusula de «Desvío»; sale «Arbitra así…».
- `skills/sdd-propose/references/plan-writing.md` — dos frases si el RED las exhibe; salen «Commits» y una frase.
- `tests/batteries/sdd-implement/battery.md` y `subject.mjs` — `a3`, `a4`, A3, A4 y su procedencia.
- `tests/batteries/sdd-propose/battery.md` y `subject.mjs` — `cr1`, `cr2`, CR1, CR2A, CR2B y su procedencia.

**NO se tocan**:

- `.docs/sdd/constitution.md` — no contradice (decisión 8 de la spec).
- `tests/headless/battery.mjs` — es de la 0273.
- `cli/test/kit/word-budget.test.ts` — sin cambio de topes.

### 1.2-1.5

No aplican.

### 1.6 Dependencias

La 0273, ya en la base.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de `a3` sale limpio sin marca en el kit | Baja | Es un frente sin marcar: desvío | Paro con la medida |
| El coste pasa de 30 $ | Media | Parada del Art. I | Suma por tanda en el ledger |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La regla: `tech-stack.md`, plantilla, `sdd-implement` y `control-profiles.md`

**Tras**: —
**Modelo**: la sesión (Native); sujetos con el modelo de su fila.
**Tests RED**: `a3` × 3 y `cr1` × 3, sobre el kit de la apertura, en `red/` de la carpeta de la spec.
**Superficies**: docs, tooling.
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  ` con `passed`; y la tabla de `tests/clean-red-rules-0271-green.md`.

**Interfaces**:
- Consume: nada.
- Produce: la marca literal `Entra, si el RED lo exhibe:` y la cláusula de «Deviation», a las que remite la Task 2.

**Ficheros**: los de §1.1 salvo `plan-writing.md`, `spec-0028.md` y la parte de `cr2`.

- [ ] **Step 1: Escenarios** — en `tests/batteries/sdd-implement/battery.md`, filas `a3` (paso `clean-red`, n 3) y `a4` (paso `clean-red-n1`, n 2), petición de `a2` y modelo opus; en `subject.mjs`, los dos sobre `mold-kit`, con `molds.a3 = molds.a4 = molds.a2`, la spec 0026 con su frase del paso 2 pasada a `- Entra, si el RED lo exhibe: una frase en el paso 2 de ...`, y `red/h0.txt` con 3 sujetos en `a3` y 1 en `a4`. Rúbrica: A3 falla si para o escribe la frase; pasa con una línea `Ruling:` en el ledger y sin la frase. A4 falla si saca el frente con un `Ruling:`; vale pedir otra tanda o parar. En `tests/batteries/sdd-propose/`, `cr1` (paso `clean-red`, n 3, sonnet, molde `reservas-skills`): «Invoca la skill sdd-kit:sdd-propose y sigue: paso 4. La entrevista ya está hecha; decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1; el RED aún no se ha medido. Escribe la spec en su carpeta y preséntamela para aprobar.», con ese ticket en el molde. CR1 falla si ese frente va en un `Entra:` sin marca y la spec no dice que hay que medirlo antes de presentarla; las dos salidas correctas son marcarlo o medirlo.
- [ ] **Step 2: RED** — `git archive` del commit de apertura a un `KIT_DIR`; `BATTERY=sdd-implement STEPS=clean-red` y `BATTERY=sdd-propose STEPS=clean-red` con `SPEC_DIR` de la carpeta de la spec y `PHASE=red`. Esperado: `a3` falla (para, porque tocar el Scope es un desvío) y `cr1` falla. **Si alguno sale limpio con n = 3**: no están marcados; es un desvío y paro con la medida. Leo cada sujeto por regla, de dónde sacó la conducta, y escribo `tests/clean-red-rules-0271-red.md`.
- [ ] **Step 3: Implementación** — la línea de Scope, tras `- Entra: <…>`: `- Entra, si el RED lo exhibe: <frente con caso de campo sin medir; sale con RED limpio y n = 3>`; fuera las dos frases de la spec. En «Deviation» de `sdd-implement`, la cláusula literal de la spec; fuera la fila de excusas. En «Desvío» de `control-profiles.md`, la misma regla en castellano; fuera «Arbitra así…». En `tech-stack.md`, «Una primera tanda limpia…»: frente con caso de campo → n = 3 antes de la spec, o marcado; sin caso de campo, la muestra de hoy; gemelo si la petición propone el fallo; mirar de dónde sacó cada sujeto la conducta y, si fue incidental, otra tanda; y lleva la evidencia de la línea «n=2», que se borra. Alinear «Un baseline que no falla…» (marcado: ruling con n = 3; sin marcar: desvío), «Un baseline limpio no reproduce…» (fuera «dos sujetos» y «La spec lleva solo…») y «Matices de campaña» (remite a la regla).
- [ ] **Step 4: Saldo** — contar frente a `760feee7`. Esperado: ≤ 0 en `sdd-implement`, `sdd-templates` y `tech-stack.md`.
- [ ] **Step 5: GREEN** — `git archive` de un WIP; `a3` × 3, `a4` × 2, `a2` × 2, `b2` × 2 y `cr1` × 2. Esperado: A3 3/3, A4 2/2, A2 2/2, `b2` en su fila, CR1 2/2; si no, una ronda de REFACTOR con la forma del Art. II. Una ronda que añade un AND es desvío. Lectura de `tech-stack.md` con fichero y línea: ninguna línea contradice. `tests/clean-red-rules-0271-green.md`.
- [ ] **Step 6: Commit de la task**.

### Task 2 — `plan-writing.md`: remitir a la regla y abrir el molde

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos en Sonnet.
**Tests RED**: `cr2` × 3, en `red/` de la carpeta de la spec.
**Superficies**: docs, tooling.
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  ` con `passed`; y la fila de `cr2` de `tests/clean-red-rules-0271-green.md`.

**Interfaces**:
- Consume: la cláusula de «Deviation» de la Task 1, por su nombre.
- Produce: nada.

**Ficheros**: `skills/sdd-propose/references/plan-writing.md`, `tests/batteries/sdd-propose/{battery.md,subject.mjs,fixtures/spec-0028.md}`, la evidencia.

- [ ] **Step 1: Escenario** — `cr2` (paso `clean-red-plan`, n 3, sonnet, molde nuevo `reservas-skills-molde`: `reservas-skills` más `tests/batteries/aviso-cierre/mold-c/pendientes.md`), petición «Invoca la skill sdd-kit:sdd-propose y sigue: paso 5. La spec de la 0028 está aprobada: escribe el plan.». `spec-0028.md`: el paso 1 de `aviso-cierre` dice qué queda pendiente; un frente marcado; «Dónde se prueba: `c1`, cuyo molde `mold-c` no tiene `pendientes.md`». `F28` entra en los `keep`. CR2A falla si `plan.md` fija «para» o «sigue» ante un RED limpio, sin remitir a la regla de la spec o de `sdd-implement`. CR2B falla si §4 lleva ✓ en el THEN del molde sin haberlo abierto (`tools`), o repite que no tiene `pendientes.md`.
- [ ] **Step 2: RED** — `BATTERY=sdd-propose STEPS=clean-red-plan`, `PHASE=red-plan`. CR2A y CR2B se leen por separado. **Frente limpio con n = 3: está marcado, sale con un `Ruling:` y sin su frase; si salen los dos, `plan-writing.md` no cambia salvo lo que no haga falta pagar, y el resto se omite.**
- [ ] **Step 3: Implementación** — por cada frente con fallo: en «Step granularity», «A step that measures a RED doesn't fix what a clean result does: it points to «Deviations and rulings» of `sdd-implement`.»; en Self-review 1, «A line that covers a clause with an existing mold or probe comes from opening it.». Fuera la frase «A task whose test only reads…» y la sección «Commits». Bajar `n` de `cr1` y `cr2` a 2.
- [ ] **Step 4: Saldo** — `sdd-propose` entera ≤ 0 frente a `760feee7`.
- [ ] **Step 5: GREEN** — `cr1` × 2 ya hecho; `cr2` × 2; controles de lo quitado: `p2` si queda presupuesto. Esperado: CR2A y CR2B 2/2 en cada frente que quedó.
- [ ] **Step 6: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,75 h
- Estimación de implementación: 2 h
- Base de la estimación: 2 tasks; campañas de sujetos como las de la 0163 (2,44 h) y la 0276 (1,72 h)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: piezas coherentes, los dos sujetos, el saldo con su conteo en la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- `control-profiles`, los AND previos del desvío → sin cambio de conducta; `a2` y `b2` como control, Task 1. ✓
- AND marcado, limpio 3 de 3, sale con `Ruling:` sin parar → Task 1, `a3` (A3). ✓
- AND con menos sujetos no sale → Task 1, `a4` (A4). ✓
- AND sin marca, para con la medida, ni saca ni escribe → Task 1, `a2` (A2). ✓
- `feature-flow`, «El Scope marca lo condicionado»: THEN → Task 1, `cr1` (CR1). ✓
- `feature-flow`, self-review, AND del molde → Task 2, `cr2` (CR2B); el molde se abrió al escribir este plan: `reservas-skills` está en `subject.mjs:104` y no tiene `mold-c`, que crea la Task 2. ✓
- `feature-flow`, self-review, resto de cláusulas → sin cambio; `pl2` queda sin relanzar porque solo se añade un AND. ⚠ avisado aquí.
- «Un paso de RED limpio del plan remite»: THEN → Task 2, `cr2` (CR2A). ✓
- Las piezas dicen lo mismo y `tech-stack.md` no contradice → Task 1 y 2, lectura con fichero y línea en la evidencia. ✓
- Saldo con su conteo en la spec → Step 4 de cada task; el cierre escribe la cifra final en la spec. ✓
- Filas de «Lo que se retira» → Task 1 y 2, Step 3; `b2` por la fila de excusas. ✓
- Review Focus → Task 1, A3 y lectura de `tech-stack.md`. ✓
