---
id: 20261001-153446-feature-0117-patch-lane-fixed-solution
feature: 0117
title: Plan de implementación — Carril patch: lo decide quién fijó la solución
spec: ./spec.md
status: done
created: 2026-10-01
---

# Plan de implementación — Carril patch: lo decide quién fijó la solución

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, la sesión implementa las tres tasks (Opus 5.5, la que aprobó la spec sin pedir bajar a gama media). Revisor final: `sdd-kit:effort-high` + `opus`. Sujetos del GREEN: Sonnet, el método de `tech-stack.md`.
2. **Ejecución Native**: las tres tasks editan los mismos ficheros (`sdd-start-patch`, `patch-template.md`, `sdd-end-patch`) y son texto; un subagente por task repetiría la lectura de los mismos ficheros sin revisión que compense.
3. **Tres tasks por conducta, no por fichero**: criterio y petición cerrada (T1), retirada (T2), lite y deuda parcial (T3). Cada una cierra con su GREEN.
4. **Tests de cada task**: Pester estático (`tests/PatchLane.Tests.ps1`, una aserción por literal que la skill tiene que llevar) escrito por el hilo antes del texto, más los escenarios GREEN de sujetos sobre el molde `ventas`. El Pester se aparca en la carpeta de la spec hasta el commit de la task (el pre-commit rechaza un test en rojo).
5. **Freno de tamaño**: 10 ficheros o 300 líneas, contados con `git diff --numstat <merge-base>` sin `tests/`, `*.md` ni `.docs/`.
6. **Riesgo alto**: `using-sdd` ya pasa del tope de palabras (fila de deuda que absorbe la 0121); la fila de patch se reescribe sin crecer más de ~30 palabras.
7. **Coste**: ~2,5 h de implementación condicionada al GREEN; campaña GREEN ~22 sujetos, ~6 $, techo común con el RED de 15 $ y 40 sujetos.
8. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el carril patch entra por quién fijó la solución, registra decisiones con autor y admite la retirada, sin abrir la puerta trasera.

**Architecture**: cambio de texto en las skills de patch, su plantilla y el router. El árbol de `sdd-start-patch` gana una pregunta previa («¿quién fija la solución?») y tres clases; `patch.md` gana `solution:` y la lista `Decisiones`; `sdd-end-patch` la lee. El resto (router, paso 2 de `sdd-start-feature`, guía) repite el mismo criterio con las mismas palabras.

**Tech Stack**: Markdown de skills; Pester 5 para las aserciones de texto; sujetos headless (`tests/headless/`).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks tocan los mismos tres ficheros de texto y dependen entre sí · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code, nombres en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes. El revisor marca el incumplimiento como Important, salvo un umbral superado en una unidad, que es Minor.
- Art. III: texto de skills, docs y tests en castellano con ortografía correcta.
- Literales fijos de la spec: `solution: ticket | dev-lead | causa raíz`; autores `ticket`, `dev-lead`, `sin el dev-lead`; freno «más de 10 ficheros o más de 300 líneas»; changelog `Fixed` (fallo), `Added` o `Changed` (petición cerrada), `Changed` (ajuste visual), `Removed` (retirada); formato `parcial — <enlace>; queda: <lo pendiente>`.
- Un ejemplo de la guía va en otro dominio que el molde `ventas` (no pedidos ni albaranes), salvo el contraejemplo que la spec fija.

### De proceso

- Política de modelos del Art. IV; `fable` y `opus xhigh` prohibidos.
- Commits: tipo/scope en inglés, cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Campaña: `SUBJECT_CAP=40`, `COST_CAP=15`, `SPEC_DIR` de esta spec.

## Review Focus

- Una petición que fija la solución pero deja abierto un detalle visible (el texto de un botón nuevo) → feature, o pregunta cerrada al dev-lead si las opciones ya están escritas · Task 1, escenario GREEN `d1`.
- Un bug con la solución propuesta en el ticket («el fallo es X, cámbialo a Y») → sigue siendo fallo: causa raíz confirmada, `Fixed`; la propuesta del ticket no lo convierte en petición cerrada · Task 1, escenario de control `k1`.
- Una retirada que deja un símbolo con otro uso → no se borra ese símbolo · Task 2, `PatchLane.Tests.ps1` «la retirada solo quita lo que nadie más usa».
- Un patch que cruza el freno de tamaño a mitad del fix → para antes del commit, no al cerrar · Task 1, `PatchLane.Tests.ps1` «el freno va en el paso 4».
- Una petición cerrada invocada con `/sdd-start-feature` → la salida del paso 2 la manda a `sdd-start-patch` · Task 1, `PatchLane.Tests.ps1` «el paso 2 de sdd-start-feature nombra la petición cerrada».

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres clases en el árbol existente, sin skill nueva ni capacidad nueva.
- [x] **YAGNI gate**: sin abstracción; la lista `Decisiones` sustituye a la prosa que hoy busca el paso 8.1.
- [x] **Brownfield gate**: `patch.md` antiguos sin `solution:` siguen valiendo (el cierre lo trata como fallo).
- [x] **Constitution check**: Art. I (RED hecho, GREEN por task), Art. II (contraejemplo en la guía), Art. VIII (plantilla solo en `sdd-templates`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/PatchLane.Tests.ps1` — aserciones de texto de las tres tasks.
- `tests/patch-lane-red.md`, `tests/patch-lane-green.md` — evidencia (Art. I).
- `.docs/sdd/specs/<esta>/green/subject.sh` — escenarios GREEN sobre `red/mold.sh`.

**Modificar**:

- `skills/sdd-start-patch/SKILL.md` — descripción, árbol, predicado, pasos 1, 3, 4, 5, red flags, racionalizaciones.
- `skills/sdd-templates/templates/patch-template.md` — `solution:`, §2 en tres formas, §3 `Decisiones` y `Retirado`.
- `skills/sdd-end-patch/SKILL.md` — escalada, pasos 3, 4 y 8.1.
- `skills/using-sdd/SKILL.md` — filas de feature, patch y edición directa, racionalización de la plantilla.
- `skills/sdd-start-feature/SKILL.md` — descripción y salida al patch del paso 2.
- `skills/sdd-start-feature/references/modo-lite.md` — condición de migración.
- `.docs/workflow/usage-guide.md` — §3 y la fila «Hacer».

**NO se tocan**:

- `Build-EstimationLog.ps1` y §5 de `patch-template.md` — son de la 0130.
- `roadmap-template.md` — ya tiene el formato `parcial`.
- `capabilities/` — se fusiona en el cierre con `Merge-CapabilityDelta.ps1`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La guía nueva abre la puerta trasera (b1, b2 dejan de ir a feature) | media | alto | b1, b2, c1 y d1 son control obligatorio del GREEN; con un fallo, REFACTOR antes de cerrar |
| El bug con solución sugerida se trata como petición cerrada y se salta la causa raíz | media | medio | `k1` y la frase «una solución propuesta para un fallo no lo convierte en petición cerrada» |
| `using-sdd` crece | alta | bajo | reescribir la fila, no añadir |

### 1.8 Rollout

Directo, en la 2.3.0. Sin migración de proyecto: plantilla y skills viven en el kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Criterio por quién fija la solución y petición cerrada

**Modelo**: Native, la sesión (Opus 5.5, effort de la sesión).
**Tests RED**: hilo principal · `tests/PatchLane.Tests.ps1` (bloque `Describe 'criterio'`), aparcado en la carpeta de la spec hasta el commit; escenarios `p1 p2 b1 b2 c1 c2 k1 d1` en `green/subject.sh`.
**Superficies**: docs (skills).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/PatchLane.Tests.ps1 -Output Detailed"` y la tanda GREEN de sus escenarios (2 sujetos cada uno; d1 y c2, 2).

**Interfaces**:
- Consume: nada.
- Produce: el frontmatter `solution: ticket | dev-lead | causa raíz`; §3 de `patch-template.md` con `**Decisiones**:` y líneas `- <decisión> — <ticket | dev-lead | sin el dev-lead>`; los nombres de clase «fallo», «ajuste visual», «petición cerrada».

**Ficheros**: modificar `skills/sdd-start-patch/SKILL.md`, `skills/sdd-templates/templates/patch-template.md`, `skills/sdd-end-patch/SKILL.md`, `skills/using-sdd/SKILL.md`, `skills/sdd-start-feature/SKILL.md`, `.docs/workflow/usage-guide.md`.

- [ ] **Step 1: Pester RED** — `It` por literal: el árbol de `sdd-start-patch` pregunta «¿Quién fija la solución?»; la skill nombra «petición cerrada» y el contraejemplo «avisa cuando el total pase de 1.000 €»; el paso 4 lleva «más de 10 ficheros o más de 300 líneas»; el paso 5 dice que `fix` es solo para un fallo; la plantilla tiene `solution:` y `**Decisiones**`; `sdd-end-patch` paso 3 nombra `Added` y paso 8 lee `Decisiones`; la cláusula de escalada nombra `sin el dev-lead`; `using-sdd` nombra «solución» en la fila de patch; el paso 2 de `sdd-start-feature` nombra «petición cerrada». Correr: falla.
- [ ] **Step 2: Texto** — escribir la guía con esos literales y la frase «una solución propuesta para un fallo no lo convierte en petición cerrada».
- [ ] **Step 3: Verificación** — Pester verde; GREEN `p1 p2 b1 b2 c1 c2 k1 d1`: p1, p2, c2 a patch; b1, b2, c1, d1 a feature (d1: para dentro del patch); k1 con causa raíz y `Fixed`.
- [ ] **Step 4: Commit de la task**.

### Task 2 — Retirada en el patch visual

**Modelo**: Native, la sesión.
**Tests RED**: hilo · `PatchLane.Tests.ps1` (`Describe 'retirada'`); escenarios `r1 r2 r3`.
**Superficies**: docs (skills).
**Verificación**: Pester y la tanda `r1 r2 r3` (2 sujetos cada uno).

**Interfaces**:
- Consume: `solution:`, `**Decisiones**` y las clases de la Task 1.
- Produce: `**Retirado**:` en §3 de la plantilla, con la línea `Lo que el usuario deja de poder hacer: <…>`.

**Ficheros**: modificar `skills/sdd-start-patch/SKILL.md`, `skills/sdd-templates/templates/patch-template.md`, `skills/sdd-end-patch/SKILL.md`, `skills/using-sdd/SKILL.md`, `.docs/workflow/usage-guide.md`.

- [ ] **Step 1: Pester RED** — el predicado nombra «retirada» y «lo que queda muerto»; «la retirada solo quita lo que nadie más usa»; la retirada no añade nada; la plantilla lleva `**Retirado**`; `sdd-end-patch` paso 3 nombra `Removed`; `using-sdd` nombra «retirada».
- [ ] **Step 2: Texto**.
- [ ] **Step 3: Verificación** — r1 (quitar Borrar y mover) a patch; r2 (recorrido con `/sdd-start-patch`) deja `patch.md` con `**Retirado**`, la línea de lo que se pierde y el delta de `order-sheets`; r3 («Quita Borrar y añade Archivar») a feature.
- [ ] **Step 4: Commit de la task**.

### Task 3 — Lite con migración de datos y deuda parcial

**Modelo**: Native, la sesión.
**Tests RED**: hilo · `PatchLane.Tests.ps1` (`Describe 'lite y parcial'`); escenarios `l1 e1`.
**Superficies**: docs (skills).
**Verificación**: Pester y la tanda `l1 e1` (l1 2 sujetos, e1 1: cambio de redacción).

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: modificar `skills/sdd-start-feature/references/modo-lite.md`, `skills/sdd-end-patch/SKILL.md`.

- [ ] **Step 1: Pester RED** — `modo-lite.md` dice «No cambia el schema de datos» y «solo de datos, idempotente y reversible»; el paso 4 de `sdd-end-patch` nombra `parcial —` y `queda:`.
- [ ] **Step 2: Texto**.
- [ ] **Step 3: Verificación** — l1 (quitar un botón con migración que da de baja dos textos) ofrece lite y nombra la migración; e1 (cierre de un patch que salda la mitad de una fila) escribe `parcial — …; queda: …`.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h (RED previo incluido)
- Estimación de implementación: 2,5h (rango 2–3,5h), condicionada al GREEN
- Base de la estimación: 3 tasks de texto en los mismos ficheros, campaña de ~22 sujetos; referencia: la 0098 (patch visual, mismo molde)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre: `pwsh -NoProfile -Command "Invoke-Pester tests -Output Normal"` (la suite entera, también los `Slow`) y `Test-Roadmap.ps1`.
- [ ] Smoke: una fila por THEN de la spec con su evidencia del GREEN.
- [ ] Cierre con `sdd-end-feature` (validación en campo).

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «Un bug pequeño y determinista…» → Task 1, k1. ✓
- ADDED «Un cambio con la solución fijada…» → Task 1, p1 p2. ✓
- ADDED «Un cambio cuya solución tendría que fijar el agente…» → Task 1, b1 b2 c1 d1. ✓
- ADDED «El patch registra quién fijó la solución…» → Task 1, Pester y p2 (recorrido). ✓
- ADDED «Un patch muy grande para y pregunta» → Task 1, Pester (paso 4). ✓
- MODIFIED «Un ajuste solo de presentación…» → Task 2, Pester del predicado. ✓
- ADDED «Una retirada de presentación…» → Task 2, r1 r2 r3. ✓
- REMOVED + ADDED «Un texto fijado literal…» → Task 1, c2. ✓
- MODIFIED «Un patch visual se verifica… `Changed`» → Task 2, Pester (`Removed`) y r2. ✓
- MODIFIED «Un patch cuyo fallo no se reproduce…» → Task 1, Pester (paso 1, «lo que la petición da por existente»). ✓
- ADDED `feature-flow` «Una migración solo de datos…» → Task 3, l1. ✓
- Formato `parcial` → Task 3, e1. ✓
- Review Focus → Tasks 1 y 2, cada línea con su test. ✓
