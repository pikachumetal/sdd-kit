---
id: 20260921-081125-task-0003-cap-lifecycle
task: 0003
title: Plan de implementación — Capabilities, ciclo de vida completo
spec: ./spec.md
status: approved
created: 2026-09-21
---

# Plan de implementación — Capabilities: ciclo de vida completo

> **Enmienda tras el RED (2026-09-21).** El plan aprobado antes (commit `7f0fbfe`) tenía seis tasks. La Task 1 (RED) está hecha y la Task 2 (validador) se implementó y se revirtió (`79bec32` → `ca51ef4`). Con la spec recortada quedan dos tasks más.

## Decisiones que he tomado yo — valida estas

1. **Task 3 en línea, no por subagente.** Son seis frases en cinco ficheros y su redacción sale de las citas del RED. Despachar un implementador y un revisor cuesta ~350k tokens por un diff de unas 15 líneas, y el hilo ya tiene el RED leído. Tests estructurales del hilo antes de editar (TDD en línea).
2. **GREEN con 4 sujetos**: m1 y m2 × 2, con el kit de la rama. m3, m5 y m6 no se repiten: no fallaron.
3. **Revisor final de rama: Sonnet, effort medium.** Sin código ejecutable, la razón que justificaba Opus en el plan anterior desaparece.
4. **Coste**: unas 1,5 h de reloj más y unos 3 $ en sujetos. Ya gastado: 7,48 $ del RED y unos 167k tokens del implementador del validador.
5. **Los ejemplos de la guidance van en otro dominio que los moldes** (aprendizaje de la task 0011): nada de reservas ni avisos por email. El ejemplo del slug es `notifications`/`avisos`, que sí coincide con m1, así que en el GREEN se cambia por otro: `invoicing`/`facturación`.

**Goal**: que una capacidad nueva nazca con slug en inglés y que los valores de comportamiento no se copien a los documentos de anclaje.

**Architecture**: una línea por regla en el punto de uso donde el RED vio el fallo; un red flag en el paso de aprendizajes de `sdd-end-task`. Sin ficheros nuevos de guidance.

**Tech Stack**: markdown de skills del kit; Pester ≥ 5 para los tests estructurales; sujetos headless `claude -p --model sonnet`.

**Spec**: `./spec.md`

## Restricciones globales

- **Art. X — Calidad de código** (literal de la constitution del kit):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough (T14, 2026-09-09; 110 comentarios con cita en los dos retos del equipo).
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo.
- **Art. I — Ley de hierro de skills**: solo guidance para los dos fallos del RED (slug en castellano, valores copiados a `tech-stack.md`).
- **Art. III — Idioma**: texto humano en castellano con tildes; nombres de skill y de fichero en inglés kebab-case.
- **Art. VIII — Una sola fuente de plantillas**: las plantillas viven SOLO en `skills/sdd-templates/templates/`.
- **La fusión no depende de que exista una release.**
- **Rutas del repo < 140 caracteres relativos.**
- **Política de modelos**: modelo **y** effort explícitos al despachar; gama media como suelo para revisores; `fable` y `opus xhigh` prohibidos por defecto.
- **Evidencia = salida leída**, no el exit code.
- **Prohibido `git add -A`**: se commitea por ruta. Nunca `--no-verify`.
- **Nombres propios prohibidos**: ningún ejemplo, fixture o texto del kit nombra a un cliente, proyecto o producto real.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una línea por regla, sin ficheros nuevos.
- [x] **YAGNI gate**: sin validador, sin sitio único.
- [x] **Brownfield gate**: las capacidades con slug en castellano de los consumidores no se tocan; la regla aplica a las nuevas.
- [x] **Constitution check**: Art. I (RED hecho), III, VIII, X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/CapabilityRules.Tests.ps1`: tests estructurales de los puntos de uso.
- `tests/capabilities-green.md`: evidencia del GREEN; `green/` en la carpeta de la spec.

**Modificar**:

- `skills/sdd-templates/templates/spec-template.md`:
  - la frase de ayuda del delta: «el slug es un sustantivo en inglés kebab-case aunque el contenido vaya en castellano»;
  - junto a la «Regla de contenido», la regla de reparto;
  - el marcador `MODIFIED`: copia el bloque entero del requisito; `(antes: …)` opcional.
- `skills/sdd-templates/templates/capability-template.md`: regla 1, con el slug en inglés kebab-case aprobado por el dev-lead; regla 3, «`MODIFIED` sustituye entero», para que la plantilla describa la misma fusión que `aprendizajes-skills.md` (añadido tras la revisión final).
- `skills/sdd-templates/templates/plan-template.md`: §1.1, una línea sobre qué no se documenta en `tech-stack.md`.
- `skills/sdd-start-task/SKILL.md`: paso 4, «nombre en inglés kebab-case» en la frase que ya declara la capacidad nueva.
- `skills/sdd-end-task/references/aprendizajes-skills.md`: paso 4, «los anclajes enlazan el valor, no lo copian», y «`MODIFIED` sustituye entero el requisito con ese título».
- `skills/sdd-end-task/SKILL.md`: una red flag y una fila de racionalización.

**NO se tocan**: `.docs/sdd/capabilities/*`, `roadmap.md`, `mission.md`, `tech-stack.md` y `changelog.md` (son del cierre, tras integrar develop); `sdd-init-*` (task 0012); el carril release (task 0004).

### 1.2–1.6

No aplica: sin datos, migraciones, contratos, UX ni dependencias nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El GREEN no corrige el duplicado en tech-stack porque el plan del molde lo pide explícitamente | Media | Alto | El red flag nombra el caso «el plan pide documentarlo en tech-stack»; si persiste, se mueve la regla al paso de la task de docs y se re-verifica |
| El ejemplo de la guidance da la respuesta al sujeto | Media | Medio | Ejemplo en otro dominio (decisión 5) |

### 1.8 Rollout

Directo, dentro de la 1.2.0. Sin migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Campaña RED ✅

Hecha: `tests/capabilities-red.md`, artefactos en `red/`.

### Task 2 — Validador ✗ (revertido)

Implementado en `79bec32` y revertido en `ca51ef4` por el RED.

### Task 3 — Las dos reglas en sus puntos de uso

**Modelo**: hilo principal (Opus 5).
**Ejecución**: `en línea` — decisión 1.
**Tests RED**: hilo · `tests/CapabilityRules.Tests.ps1`, en el working tree antes de editar. Se commitean con la edición que los pone en verde, porque el pre-commit rechaza la suite en rojo.

- [ ] **Step 1: Tests**, un `It` por punto de uso:
  - `spec-template.md` contiene «inglés» dentro del bloque de ayuda del delta y la regla de reparto («solo en `capabilities/`»);
  - `capability-template.md`, regla 1, contiene «inglés»;
  - `plan-template.md` contiene la línea de reparto;
  - `sdd-start-task/SKILL.md`, paso 4, contiene «inglés kebab-case»;
  - `aprendizajes-skills.md` contiene «enlaza» y «entero»;
  - `spec-template.md` contiene «bloque entero» junto al marcador `MODIFIED`;
  - `sdd-end-task/SKILL.md` tiene la red flag con `tech-stack`.
- [ ] **Step 2: RED**: `Invoke-Pester tests/CapabilityRules.Tests.ps1` falla.
- [ ] **Step 3: Editar** los seis puntos.
- [ ] **Step 4: Verde**: `Invoke-Pester -Path tests`, suite entera.
- [ ] **Step 5: Commit**: `feat(capabilities): slug en inglés y comportamiento solo en capabilities`.

### Task 4 — GREEN

**Modelo**: hilo principal; sujetos Sonnet (4 runs).
**Ejecución**: `en línea` — la lectura de la evidencia es juicio.

- [ ] **Step 1**: copia limpia del kit de la rama y moldes `m1` y `m2` copiados de `red/` a `green/`.
- [ ] **Step 2**: lanzar 2 sujetos por molde.
- [ ] **Step 3**: veredicto por fallo del RED (slug, tech-stack), comprobación de que el `MODIFIED` aditivo de m2 se sigue fusionando sin perder `AND`, y comprobación de que los positivos del RED siguen igual (capacidad nueva, fusión, `legacy.md`, valor construido).
- [ ] **Step 4**: `tests/capabilities-green.md`, longitud de rutas (§1.6 del plan anterior: `git ls-files --others --cached --exclude-standard -- <carpeta> tests | Where-Object { $_.Length -ge 140 }`, sin salida) y commit.

### Revisión final de rama

Sonnet, effort medium, sobre el diff de la rama. El encargo lleva primero la cabecera de `encargo-revision.md`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h (incluye la enmienda)
- Estimación de implementación: 4h en total (rango 3–5h). Ya consumidas unas 2,5 h: RED con dos rondas, validador y revert.
- Base de la estimación: seis ediciones de una línea y una campaña de 4 sujetos; referencia del `estimation-log`, tipo docs, mediana 0,5.
- Confianza: media. El GREEN de tech-stack es el punto incierto (riesgo 1).

---

## 3. Validación final

- [ ] Suite Pester en verde y `claude plugin validate --strict skills/`.
- [ ] GREEN: los dos fallos del RED corregidos y los positivos intactos.
- [ ] Longitud de rutas limpia.
- [ ] Gate de validación con el dev-lead; después, `sdd-end-task`. El cierre integra develop primero, fusiona el delta y apunta en la fila de la 0012 el volcado inicial y el funcional aportado en greenfield.

---

## 4. Self-review (cobertura spec → tasks)

- El nombre de una capacidad nueva es un sustantivo inglés en kebab-case → Task 3 (`spec-template`, `capability-template`, `sdd-start-task`); GREEN m1. ✓
- El comportamiento observable vive solo en `capabilities/` → Task 3 (`spec-template`, `plan-template`, `aprendizajes-skills`, `sdd-end-task`); GREEN m2. ✓
- Cinco requisitos que se mueven de `task-flow` a `capabilities` → fusión en el cierre. N/A en el plan. ✓
