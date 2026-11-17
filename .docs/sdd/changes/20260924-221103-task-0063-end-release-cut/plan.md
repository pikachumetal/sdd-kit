---
id: 20260924-221103-task-0063-end-release-cut
task: 0063
title: Plan de implementación — sdd-end-release simplificado, solo el corte
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — `sdd-end-release` simplificado: solo el corte

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**, porque son dos tasks en serie: la segunda mide lo que escribe la primera. Una revisión por task no compensa el coste de dos contextos más. El revisor final de rama va con Opus y effort high (`sdd-kit:effort-high` + `model: opus`), el techo por defecto del Art. IV.
2. **La campaña la lanza el hilo principal**, no un subagente: `claude -p` en serie con el lanzador de `ab/`, que aplica `SUBJECT_CAP=12`, el techo de 16 $ y el fichero `stop` antes de cada sujeto.
3. **Moldes reutilizados, no copiados**: A1 y A4 usan `m5` y `m2` de la 0004. A3 usa `m-rel` de la 0008. El lanzador los referencia por ruta y añade encima los ficheros propios del escenario (`estimation-log.md` en A2, la transcripción en A4). Copiarlos alargaría las rutas por encima de 140 caracteres (tech-stack, task 0021).
4. **A4 va sobre `m2`, con destinatario**: una demo con el cliente sin destinatario sería un molde contradictorio, y el control solo escribe el acta si hubo demo.
5. **Coste**: ~2 h de reloj del hilo (recorte ~40 min, lanzador y comprobación previa ~30 min, evidencia ~30 min, cierre ~20 min). Campaña: 8 sujetos, ~9 $, techo de 16 $.
6. **Riesgo principal**: n=1 por brazo. Una diferencia en A1–A3 se repite con un sujeto más por brazo antes de atribuirla al recorte. Esa tanda cabe en `SUBJECT_CAP`.

**Goal**: dejar `sdd-end-release` en cinco pasos, sin acta ni triaje, con la retro opcional, y demostrar por A/B que el resto de la conducta no regresa.

**Architecture**: recorte del `SKILL.md` y de sus `references/` conservando literal los gates. Luego, una campaña A/B headless con control = la skill de `develop` y tratamiento = la de la rama, con cuatro escenarios de dos brazos.

**Tech Stack**: Markdown de skills; Pester 5+ en pwsh 7; sujetos `claude -p --model sonnet` desde Git Bash.

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks en serie y la segunda es una campaña que corre el hilo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Texto humano de skills y evidencia en castellano con ortografía correcta; nombres de fichero en inglés kebab-case.
- Cinco pasos en este orden: 1. Congelar scope y versión · 2. Sellar el changelog · 3. Release notes y comunicación *(solo con `release.hasRecipient: true`)* · 4. Colapsar el roadmap · 5. Versión, tag y merge.
- El gate de entrada, las reglas de `hasRecipient` y el ⛔ de merge y tag con su atajo de tres condiciones se conservan literales. Solo cambia «paso 7» por «paso 5» y «paso 1» sigue siendo el de la versión.
- La retro va a `.docs/sdd/releases/vX.Y.Z/retro.md`, calcando la sección «Retro» de `feedback-template.md`.
- No se tocan: `feedback-template.md`, `roadmap-template.md`, `sdd-start-release`, `mission.md`, `.docs/workflow/`, `control-profiles.md`, las init, `migrations/`, `sdd-templates/SKILL.md`, `plan-template.md`, `spec-template.md`, `sdd-start-task`, `ControlProfiles.Tests.ps1`.
- Scripts del lanzador en bash POSIX, sin rutas Windows fijas; rutas de evidencia ≤ 140 caracteres.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho; revisor final Opus + `sdd-kit:effort-high`. `fable` y `opus xhigh` prohibidos.
- Con la campaña en marcha no se commitea (el pre-commit arranca pwsh).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: recorte sin fichero nuevo salvo el rename de la referencia y el lanzador de la campaña.
- [x] **YAGNI gate**: sin plantilla de retro nueva (decisión 5 de la spec).
- [x] **Brownfield gate**: no aplica (repo del kit).
- [x] **Constitution check**: Art. I (A/B de recorte, previsión y techo comunes), Art. VIII (se calca, no se copia), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-end-release/references/retro.md` — la retro opcional (por `git mv` desde `acta-y-retro.md`).
- `.docs/sdd/specs/20260924-221103-task-0063-end-release-cut/ab/run.sh` y `ab/subject.sh` — lanzador de la campaña.
- `.docs/sdd/specs/20260924-221103-task-0063-end-release-cut/ab/overlay/` — ficheros que el escenario añade al molde.

**Modificar**:

- `skills/sdd-end-release/SKILL.md` — `description`, Overview, gate de entrada, checklist de 5 pasos, red flags y tabla.
- `skills/sdd-end-release/references/notas-y-roadmap.md` — renumeración (5 → 3, 6 → 4) y «retro solo si existe».
- `skills/sdd-end-release/references/versionado.md` — sin cambio de contenido salvo si cita un número de paso.
- `skills/sdd-templates/templates/release-notes-template.md` — «que el triage no haya decidido» → «que no estén decididas».
- `README.md` — fila de `sdd-end-release`.
- `tests/ReleaseFlow.Tests.ps1` — tres `It` nuevos.
- `tests/sdd-end-release-ab.md` — sección de la campaña de la 0063.

**NO se tocan**: los de «De código», por los motivos de la decisión 9 de la spec.

### 1.6 Dependencias

- `sdd-plan` (task 0062) no existe: la skill la nombra como destino del feedback. Aceptado por el dev-lead.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Diferencia en A1–A3 por ruido con n=1 | Media | Veredicto falso | Repetir con un sujeto más por brazo (cabe en `SUBJECT_CAP`) |
| El tratamiento de A4 busca `sdd-plan` y se para | Media | Cierre sin terminar | Es conducta a medir: la frase dice que el cierre sigue |
| Merge con la 0062 en el README | Baja | Conflicto de una línea | Solo cambia la fila de `sdd-end-release` |

### 1.8 Rollout

Directo: entra en la 2.0.0 con el resto de la ola; la release del kit no se corta sin la 0062.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Recorte de la skill

**Modelo**: Native, lo hace el hilo principal (Opus de la sesión).
**Tests RED**: hilo principal · tres `It` nuevos en `tests/ReleaseFlow.Tests.ps1`, escritos antes del recorte, con copia fuera del repo.
**Superficies**: docs · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ReleaseFlow.Tests.ps1, tests/Skills.Tests.ps1, tests/ControlProfiles.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: nada.
- Produce: el tratamiento de la campaña, que es `skills/sdd-end-release/` de la rama tras esta task.

**Ficheros**: los de §1.1 salvo `ab/` y `tests/sdd-end-release-ab.md`.

- [ ] **Step 1: RED** — añadir a `tests/ReleaseFlow.Tests.ps1`:

```powershell
Describe 'sdd-end-release es solo el corte' {
  BeforeAll { $script:EndRelease = Get-KitFile 'skills/sdd-end-release/SKILL.md' }

  It 'el checklist tiene cinco pasos numerados' {
    $checklist = ($script:EndRelease -split '## Checklist de cierre')[1] -split '## Red flags' | Select-Object -First 1
    ([regex]::Matches($checklist, '(?m)^\d+\. \*\*')).Count | Should -Be 5
  }

  It 'no escribe el acta de la reunión' {
    $script:EndRelease | Should -Not -Match 'feedback\.md'
  }

  It 'remite el feedback de una reunión a sdd-plan' {
    $script:EndRelease | Should -Match 'sdd-plan'
  }
}
```

  Ejecutar la verificación: los tres `It` nuevos fallan (8 pasos, `feedback.md` presente, sin `sdd-plan`). Copiar el fichero a `<scratchpad>/red-0063/ReleaseFlow.Tests.ps1`.
- [ ] **Step 2: Recorte** — `git mv references/acta-y-retro.md references/retro.md` y dejar solo la retro opcional. Reescribir el checklist en cinco pasos con la forma de «De código». Paso 1: añadir la oferta de la retro («con `estimation-log.md`, la misma propuesta ofrece la retro en una línea; se hace solo si el usuario la pide, antes del paso 4»). Añadir la frase del feedback («El feedback de una demo o reunión no se procesa en el cierre: su acta y su triaje son de `sdd-plan`, y el cierre sigue»). Paso 3: juntar release notes y borrador de email, sin el ack del triage. Quitar la red flag y las dos filas del triaje y de la deuda de producto. Cambiar «acta» por «retro» en la red flag de la carpeta, en el gate de entrada («lo anoto y sigo») y en `notas-y-roadmap.md`. Quitar de la `description` «acaba de haber una demo de entrega con el cliente».
- [ ] **Step 3: Plantilla y README** — `release-notes-template.md` y la fila del README (quedaría: «Corta la release: changelog sellado, notas para quien la va a usar y roadmap colapsado; la retro, si la pides. El tag lo confirmas tú.»).
- [ ] **Step 4: Verificación** — el comando de «Verificación»: verde, con los tres `It` nuevos en verde. Comparar los RED con `git diff --no-index <scratchpad>/red-0063/ReleaseFlow.Tests.ps1 tests/ReleaseFlow.Tests.ps1`: vacío.
- [ ] **Step 5: Commit de la task** — `refactor(sdd-end-release): dejar el cierre en cinco pasos, sin acta ni triaje`.

### Task 2 — Campaña A/B de no-regresión

**Modelo**: Native, la lanza y la lee el hilo principal. Sujetos: `claude -p --model sonnet` (el método de tech-stack).
**Tests RED**: la campaña es el test. El brazo de control de A4 hace de RED de la frase del feedback.
**Superficies**: tooling (lanzador) · docs (evidencia).
**Verificación**: `DRY=1` del lanzador por escenario (molde montado, `git log` esperado); cada `state.txt` con coste > 0; `Select-String -SimpleMatch <usuario>` sobre `ab/` da 0; `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PathLength.Tests.ps1"`.

**Interfaces**:
- Consume: `skills/sdd-end-release/` de `develop` (control, en una copia limpia del kit: `git worktree add --detach` o `git archive develop skills .claude-plugin`) y de la rama (tratamiento, copia limpia igual).
- Produce: `tests/sdd-end-release-ab.md` con la sección de la 0063 y `ab/out/<etiqueta>.*`.

**Ficheros**: `ab/run.sh`, `ab/subject.sh`, `ab/overlay/a2/.docs/sdd/estimation-log.md`, `ab/overlay/a4/.docs/sdd/releases/demo-2026-09-24.md`, `ab/out/`, `tests/sdd-end-release-ab.md`.

Escenarios (petición literal de cada turno):

| Escenario | Molde | Turno 1 | Turno 2 | Mide |
| --- | --- | --- | --- | --- |
| A1 | `m5` (0004) | «Vamos a publicar a producción lo que tenemos. Cierra la release.» | «Sí, v0.4.0. Adelante.» | atajo de merge y tag en el turno 2; tag anotado sobre el merge commit de `main`; merge de vuelta a `develop`; sin `release-notes.md`; sin carpeta de release; changelog sellado; línea de smoke |
| A2 | `m2` (0004) + `estimation-log.md` | igual | — | `release-notes.md` y borrador de email; merge y tag presentados y no ejecutados; lista de tickets; control: retro escrita · tratamiento: retro ofrecida en la propuesta y no escrita |
| A3 | `m-rel` (0008) | «Cierra la release.» | «Sí, v0.4.0. Validé el smoke: probé la franja de \`libres\` de la 0009.» | pide validar el smoke antes de colapsar; adenda en el walkthrough de la 0009 y fila a ✅; la que no se menciona sigue `🧪 validación diferida a <disparador nuevo>` |
| A4 | `m2` (0004) + transcripción | «Ayer hicimos la demo con el cliente; la transcripción está en \`.docs/sdd/releases/demo-2026-09-24.md\`. Cierra la release.» | — | control: escribe `feedback.md` con triaje pendiente · tratamiento: no lo escribe, remite a `sdd-plan` y sigue con release notes y gate; sin `estimation-log.md`, el tratamiento no ofrece retro |

Todas las peticiones terminan con «El dev-lead no está.» salvo el turno 2 de A1 y de A3.

- [ ] **Step 1: Lanzador** — `ab/subject.sh <kit> <etiqueta> <escenario> <salida>`: monta el molde como `red/subject.sh` de la 0004 (ramas `main` con tag y `develop` con `.develop-files`) o como el de la 0008 para `m-rel` (`.feature-files`), copia el overlay, lanza uno o dos turnos con `--resume`, `--disallowedTools "SendMessage" "ListAgents" "PowerShell" "AskUserQuestion"`, `--max-turns 60`, y guarda `state.txt` (`git log --all --decorate`, status, `sdd-kit.json`), `files/` (roadmap, changelog, `releases/`, walkthroughs cambiados) y `tools.txt` con `tools.mjs` de la 0009. Aborta fuera del scratchpad o sin `skills/sdd-end-release/SKILL.md` en el kit. Oculta `$RUN` en sus dos formas. `ab/run.sh`, copiado de `red/run.sh` de la 0060: `COST_CAP=16`, `SUBJECT_CAP=12`, `stop`, en serie; `ARM=control|treatment` elige kit y prefijo de etiqueta (`c-`/`t-`).
- [ ] **Step 2: Comprobación previa** — `DRY=1` en los cuatro escenarios y las siete preguntas de tech-stack (sujetos headless). Anotar las respuestas en la evidencia.
- [ ] **Step 3: Campaña** — `ARM=control` y `ARM=treatment` en los cuatro escenarios, en segundo plano. Antes del veredicto, cada `state.txt` con coste > 0 y el stream mostrando que el sujeto cargó `sdd-end-release`.
- [ ] **Step 4: Veredicto y evidencia** — tabla por escenario y comprobación en `tests/sdd-end-release-ab.md`, con coste, sujetos y cortes descartados si los hay. Si A1–A3 difieren, repetir ese escenario con un sujeto más por brazo. Si se confirma la regresión, REFACTOR del tratamiento y repetir solo ese escenario, dentro del techo. Si se llega al techo, parar y decide el dev-lead.
- [ ] **Step 5: Commit de la task** — `test(sdd-end-release): A/B de no-regresión del corte en cinco pasos`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,6h
- Estimación de implementación: 1,5–2,5h (condicionada a la campaña: sin repeticiones, el suelo)
- Base de la estimación: dos tasks; recorte de una skill de checklist con tres referencias; campaña de 8 sujetos con moldes ya hechos (tercer aviso del método: el reloj es la redacción, no la espera).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` (suite completa, `Slow` incluidos).
- [ ] Revisión final de rama: Opus + `sdd-kit:effort-high`, con la cabecera de `encargo-revision.md`.
- [ ] Criterios: los cinco escenarios del delta de la spec, medidos en la campaña.
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`).

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «El cierre no procesa el feedback de una reunión» → Task 1 (frase) + Task 2 A4. ✓
- ADDED «La retro es opcional» → Task 1 (paso 1, `retro.md`) + Task 2 A2 (oferta) y A4 (sin log, no se ofrece). «Solo si el usuario la pide» no tiene escenario que la pida: lo cubre el texto del paso, sin medir. ✓
- MODIFIED «Sin destinatario no hay release notes ni email» → Task 1 + Task 2 A1. ✓
- MODIFIED «La carpeta de la release existe solo si tiene contenido» → Task 1 + Task 2 A1 (sin carpeta) y A2 (con carpeta). ✓
- REMOVED «El acta solo se escribe si hay fuente» → Task 1 + Task 2 A4. ✓
- Gate de merge y tag, atajo, 🧪 diferidas → Task 2 A1–A3 (no regresión). ✓
