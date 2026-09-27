---
id: 20260927-165923-feature-0089-greenfield-init-template
feature: 0089
title: Plan de implementación — Sincronizar sdd-init-greenfield con init-template de sdd-project-template
spec: ./spec.md
status: approved
created: 2026-09-27
---

# Plan de implementación — Sincronizar sdd-init-greenfield con init-template

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: dos tasks secuenciales sobre textos cortos; la segunda es la campaña GREEN, que corre en segundo plano. Un implementador por task costaría más que la edición.
2. **Modelo**: la sesión implementa (Opus 5.5; el kit recomienda bajar a gama media, pero la spec delegada no dejó parada para cambiarlo y el trabajo es de minutos). Revisor final de rama: `sdd-kit:effort-high` + `opus`. Sujetos GREEN: `claude -p --model sonnet`, como el RED.
3. **Test estático de las filas nuevas** en `tests/MigrationInitParity.Tests.ps1`, junto al de «Proyecto de referencia», que ya mide filas de la entrevista: no justifica un fichero nuevo.
4. **Coste**: ~0,75 h de implementación; GREEN de 2 sujetos, ~3 $ (acumulado de la campaña ~8,5 $, techo 20 $).

**Goal**: la entrevista de `sdd-init-greenfield` pregunta fuera de alcance y dominio, y la evidencia RED/GREEN lo mide sobre un proyecto instanciado desde el template.

**Architecture**: dos filas nuevas en la tabla del paso 1 y renumeración de las siguientes; los tests Pester que citan números se actualizan primero (RED por fallo). El GREEN reutiliza `red/driver.py` y `red/brief.md` con salida en `green/out/`.

**Tech Stack**: Markdown (SKILL.md), Pester 5 (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`), sujetos headless `claude -p` con Python.

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks cortas y secuenciales, sin interfaces entre subagentes. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case (Art. III).
- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
- Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell.
- Las filas nuevas de la tabla son literales: `| 4 | ¿Qué queda fuera de alcance? | mission, «Qué es y qué no es» |` y `| 5 | ¿Qué términos del dominio hay que fijar? | mission, «Dominio» |`; las reglas de producto pasan a 6–10, las claves del kit a 19 y el proyecto de referencia a 20.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho; `fable` y `opus xhigh` prohibidos por defecto.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos filas y una renumeración; sin guía de «modo sobre template», que el RED pasa sin ella.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en Task 2), Art. VIII (la forma la fijan las plantillas del kit; el template se alinea en su repo).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/init-over-template-red.md` — evidencia del RED (4 sujetos, tabla por frente).
- `tests/init-over-template-green.md` — evidencia del GREEN.
- `.docs/sdd/specs/<carpeta>/green/` — salida de los sujetos GREEN.

**Modificar**:

- `skills/sdd-init-greenfield/SKILL.md` — filas 4 y 5, renumeración, «Las preguntas 6 a 10», «en la 19».
- `tests/MigrationInitParity.Tests.ps1` — pregunta 20 y las filas nuevas.
- `tests/NativeDefault.Tests.ps1` — `'| 19 |'` y «en la 19».

**NO se tocan**:

- `skills/sdd-init-greenfield/references/estructura.md` — «la pregunta 1» es la de `sdd-config`.
- `.docs/sdd/capabilities/onboarding.md` — la fusión del delta es del cierre.
- Repo `sdd-project-template` — su cambio va en su roadmap (decisión 6 de la spec).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El GREEN no llega a la mission (el sujeto para antes) | media | medio | la mission es el primer documento; el driver sigue hasta 14 turnos |
| Otro test cita un número de fila | baja | bajo | la suite completa en §3 |

### 1.8 Rollout

Directo, con la release 2.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Entrevista con fuera de alcance y dominio

**Modelo**: la sesión (Native).
**Tests RED**: hilo principal · `tests/MigrationInitParity.Tests.ps1`, `tests/NativeDefault.Tests.ps1`.
**Superficies**: docs, tooling (tests Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/MigrationInitParity.Tests.ps1, tests/NativeDefault.Tests.ps1"`
**Interfaces**:
- Consume: nada.
- Produce: la tabla del paso 1 de `skills/sdd-init-greenfield/SKILL.md` con 20 filas; la 4 y la 5 son las literales de «De código».

**Ficheros**: modificar `skills/sdd-init-greenfield/SKILL.md`, `tests/MigrationInitParity.Tests.ps1`, `tests/NativeDefault.Tests.ps1`; crear `tests/init-over-template-red.md`.

- [ ] **Step 1: Tests RED** — en `MigrationInitParity.Tests.ps1`: `It 'greenfield lo pregunta como pregunta 20'` con `Should -Match '(?m)^\s*\| 20 \|.*proyecto de referencia'`; `Describe 'Entrevista de greenfield: mission completa'` con `It 'pregunta qué queda fuera de alcance como pregunta 4'` (`'(?m)^\s*\| 4 \| ¿Qué queda fuera de alcance\? \| mission, «Qué es y qué no es» \|'`) e `It 'pregunta los términos del dominio como pregunta 5'` (`'(?m)^\s*\| 5 \| ¿Qué términos del dominio hay que fijar\? \| mission, «Dominio» \|'`). En `NativeDefault.Tests.ps1`: `'| 19 |'` y `'las claves que el usuario respondió en la 19'`. Copia de los tests fuera del repo; ejecutarlos: 4 fallos.
- [ ] **Step 2: Implementación** — insertar las filas 4 y 5 tras la 3, renumerar 4–18 a 6–20, «Las preguntas 4 a 8» → «Las preguntas 6 a 10», «respondió en la 17» → «respondió en la 19». Las referencias internas de fila («Solo si 11 es sí», «Solo si 15 es sí», «la rama de integración que dejó la 14») se renumeran igual (13, 17, 16).
- [ ] **Step 3: Verificación** — el comando de «Verificación»: 0 fallos. `git diff --no-index` de la copia de los tests frente a los del repo: sin cambios.
- [ ] **Step 4: Evidencia RED** — `tests/init-over-template-red.md`: método (molde, petición, respuestas fijas, driver), tabla por frente con los 4 sujetos, literales de los fallos, caveats (permiso de `.claude/`, respuestas de golpe) y coste (5,22 $).
- [ ] **Step 5: Commit de la task** — `feat(sdd-init-greenfield): preguntar fuera de alcance y dominio en la entrevista (0089)`.

### Task 2 — GREEN sobre el template

**Modelo**: la sesión lanza 2 sujetos `claude -p --model sonnet` en segundo plano.
**Tests RED**: el GREEN es el test (Art. I): mismo molde, misma petición, mismas respuestas que el RED.
**Superficies**: docs (evidencia).
**Verificación**: los dos sujetos terminados y la tabla de `tests/init-over-template-green.md` con una fila por frente.
**Interfaces**:
- Consume: la tabla de 20 filas de la Task 1; `red/driver.py` y `red/brief.md`.
- Produce: `tests/init-over-template-green.md`.

**Ficheros**: crear `green/driver.py` (copia de `red/driver.py` que escribe en `green/out/`), `green/out/`, `tests/init-over-template-green.md`.

- [ ] **Step 1: Copia limpia del kit** con el commit de la Task 1 (`git archive HEAD` en el scratchpad) y el molde del RED.
- [ ] **Step 2: Lanzar g1-a y g1-b** en paralelo, en segundo plano.
- [ ] **Step 3: Medir** por sujeto: (a) «Qué es y qué no es» y «Dominio» o «Fuera de alcance» y «Glosario» sin una exclusión ni un término que `brief.md` no diga, con «pendiente» o marcador, o preguntados; controles: (b) sin preguntas de stack, ramas ni worktrees; (c) `tech-stack.md`, `architecture.md` y `environments.md` sin cambios; (d) `sdd-kit.json` con `"version": "1.1.0"` y `ids`, si llega.
- [ ] **Step 4: Evidencia GREEN** — `tests/init-over-template-green.md` con la tabla, los literales y el coste.
- [ ] **Step 5: Commit de la task** — `test(sdd-init-greenfield): GREEN de la entrevista sobre el template (0089)`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,4 h (RED previo incluido)
- Estimación de implementación: 0,75 h (0,5–1 h)
- Base de la estimación: dos tasks; ediciones de una línea y dos ficheros de evidencia (~10 min cada uno, `estimation.md`); el GREEN corre en paralelo.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` en verde.
- [ ] Cada THEN de la spec con su evidencia (smoke por THEN).
- [ ] Revisión final de rama: `sdd-kit:effort-high` + `opus`.
- [ ] Cierre con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «La entrevista fija las cinco reglas de producto» (fuera de alcance y dominio) → Task 1 (filas) y Task 2 (GREEN, frente a). ✓
- MODIFIED «La constitution nombra el proyecto de referencia» (pregunta 20) → Task 1 (Pester). ✓
- ADDED «La init sobre un template completa solo lo marcado» → RED (4/4 y 2/2) y controles b–d de la Task 2. ✓
- Prompt del template → walkthrough, en el cierre. ✓
