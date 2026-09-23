---
id: 20260923-102746-task-0006-task-verification
task: 0006
title: Plan de implementación — Verificación por task
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — Verificación por task

## Decisiones que he tomado yo — valida estas

1. **RED del paso 6 antes de editar nada (Task 1).** El RED previo midió la redacción del plan. Lo que pasa al despachar (qué dice el encargo, quién lanza la suite lenta, si la UI se mira) no lo midió. Se mide con el kit de `develop` y un plan que ya trae los campos nuevos: si el plan basta, el paso 6 no gana guidance (Art. I; T4: «un artefacto bien formado es guidance»).
2. **Tasks 2 y 3 en línea, en el hilo principal (Opus 5.5, el de la sesión).** Son ediciones de prosa de skills que se iteran contra el GREEN que lanza el hilo; mismo motivo que la 0005, la 0021 y la 0025.
3. **Sujetos Sonnet headless** en las Tasks 1 y 4, con 30 s entre arranques (el RED previo perdió dos sujetos por arrancar a la vez). Techo de la campaña restante: **18 $** (RED del paso 6: 4 sujetos; GREEN: 6), con un 20 % de reserva para lo que destape la revisión final. Esta cifra la aprueba el dev-lead antes de lanzar la Task 1.
4. **Revisor final: un subagente Sonnet** sobre el diff de la rama sin `red/` ni `green/`: diff de prosa y anclas Pester, y la gama media es el suelo del kit. El effort no se puede declarar (el tool `Agent` no lo admite: task 0031).
5. **Anclas Pester en un fichero nuevo**, `tests/TaskVerification.Tests.ps1`: fijan los literales que el GREEN mide (campos de la plantilla, sección del encargo, fila del override).
6. **Coste estimado**: ~3 h de reloj entre las cuatro tasks; ~15 $ de sujetos.

**Goal**: que cada task del plan verifique solo sus superficies, que el gate completo corra una vez al cierre, que la UI se mire en un navegador antes de darse por hecha y que una verificación de más de 10 min la lance el hilo principal en segundo plano.

**Architecture**: el contrato vive en `plan-template.md` (campos por task y gate de cierre en la validación final); el paso 6 de `sdd-start-task` dice quién ejecuta cada verificación y cuándo; `encargo-revision.md` lleva la verificación de la task al implementador y `overrides-superpowers.md` declara que sustituye a «run the full suite once before committing».

**Tech Stack**: Markdown de skills; Pester 5 para las anclas; sujetos `claude -p` headless para RED y GREEN.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes. El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor. *(Art. X, literal.)*
- Texto humano de skills, docs y tests en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case (Art. III).
- Ninguna edición de skill sin ciclo RED → GREEN documentado en `tests/` (Art. I): RED en `tests/task-verification-red.md`, GREEN en `tests/task-verification-green.md`.
- Guidance que duplica la de superpowers está prohibida: se cita (Art. IX).
- Las cinco superficies, literal: `BD · backend · frontend · tooling · docs`; BD = migraciones, persistencia o dialecto. Umbral de verificación lenta: 10 min.
- Verificación de cada task: `Invoke-Pester ./tests/TaskVerification.Tests.ps1`. Gate de cierre, una vez y en el hilo: `Invoke-Pester ./tests` (lo ejecuta además el pre-commit).

### De proceso

- Política de modelos (Art. IV): modelo y effort explícitos al despachar; gama media como suelo para revisores e implementadores que trabajan desde prosa; `fable` y `opus xhigh` prohibidos por defecto.
- Modo de ejecución: `subagent-driven-development` por defecto; aquí las cuatro tasks van en línea (decisiones 1–3).
- Sujetos headless con 30 s entre arranques; con una campaña en marcha el hilo no commitea (task 0021).
- Commits: tipo/scope en inglés, título y cuerpo en castellano (Art. VI), con el trailer de atribución de la sesión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cuatro ficheros de texto y un fichero de anclas; ningún script.
- [x] **YAGNI gate**: el umbral de 10 min es fijo; sin configuración nueva en `sdd-kit.json`.
- [x] **Constitution check**: Art. I (RED → GREEN, Task 1 y Task 4), Art. IX (override declarado, no copia), Art. X (anclas Pester).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/TaskVerification.Tests.ps1` — anclas de los literales del contrato.
- `tests/task-verification-green.md` — evidencia GREEN (y el RED del paso 6 se añade a `tests/task-verification-red.md`).
- `red/m6/`, `red/subject6.sh` — molde y lanzador del RED del paso 6.
- `green/` — lanzadores y salidas del GREEN.

**Modificar**:

- `skills/sdd-templates/templates/plan-template.md` — campos por task, ayuda de «De código», gate de cierre en §3.
- `skills/sdd-start-task/SKILL.md` — paso 6 (verificación visual, verificación lenta, gate una vez), red flags y racionalizaciones.
- `skills/sdd-start-task/references/encargo-revision.md` — sección `## Verificación` del encargo del implementador.
- `skills/sdd-start-task/references/overrides-superpowers.md` — fila del override de `implementer-prompt.md`.

**NO se tocan**:

- `skills/sdd-templates/templates/walkthrough-template.md` y el paso 7 — son de la 0036.
- `skills/sdd-start-task/references/control-profiles.md` — la verificación no añade paradas al usuario.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED del paso 6 pasa con el plan nuevo y el paso 6 no necesita guidance | media | bajo (buena noticia) | Task 3 recorta lo que el RED no respalde; el recorte se repite en el GREEN como control |
| Sin navegador ni app que servir, el sujeto no puede mirar la UI | alta | medio | El THEN lo prevé: se mide que marque «no probado» y no «hecho» por la suite |
| Dos sujetos que arrancan a la vez no cargan los plugins | media | medio | 30 s entre arranques; antes del veredicto, comprobar en el stream que cargó la skill |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — RED del paso 6

**Modelo**: sujetos `sonnet` headless; molde y lectura en el hilo.
**Ejecución**: en línea — construir el molde y leer la conducta es juicio del hilo.
**Tests RED**: no aplica (los escenarios son el RED).

**Interfaces**:
- Consume: el molde `red/m` y `red/f1` del RED previo; la copia del kit de `develop` (`5bdc35c`).
- Produce: veredictos E2 y E3 del kit de `develop`, en `tests/task-verification-red.md`; el molde `red/m6` y `red/subject6.sh`, que la Task 4 reutiliza.

**Ficheros**: `red/m6/`, `red/subject6.sh`, `tests/task-verification-red.md`.

- [ ] **Step 1: Molde `m6`** — el proyecto de `red/m` más, en `feature/0012`, la spec aprobada de `red/f1`, un `plan.md` y un `tasks.md` que ya usan los campos nuevos:
  - Task 1 (backend y BD): `Superficies: BD · backend`; `Verificación: dotnet build backend`; `Verificación lenta: moon run backend:test · 17–21 min`.
  - Task 2 (frontend): `Superficies: frontend`; `Verificación: moon run frontend:test y moon run frontend:check`; `Verificación visual: /bookings · selector normal, con foco y deshabilitado · tema claro y oscuro · alineación, separación a bordes, contraste`.
  - Validación final: `Gate de cierre (una vez, el hilo principal): moon run :test y moon run frontend:check`.
  - E3 añade el commit de la Task 1 implementada y revisada (`tasks.md`: Task 1 ✅ con hash).
- [ ] **Step 2: Escenarios** — un turno cada uno, «Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: está en el paso 6 …»:
  - **E2 (lenta)**: despachar la Task 1 y seguir con el plan. Se mide en el stream: el `input.prompt` del implementador dice que no ejecute `backend:test` ni la suite completa; el hilo lanza `moon run backend:test` con `run_in_background` mientras revisa; si despacha la Task 2 con la suite aún en marcha, su encargo prohíbe los comandos de backend (compiten por los mismos binarios).
  - **E3 (UI y suite ajena)**: despachar la Task 2 y seguir hasta cerrarla. Se mide: el encargo lleva la verificación de la task y no `:test` ni `backend:test`; tras la revisión, el hilo intenta abrir un navegador o deja la Task 2 como «no probado» en `tasks.md`, y no la marca hecha solo por la suite.
- [ ] **Step 3: Comprobación previa** — la de `tech-stack.md` (carga de skill, molde, una lectura, kit correcto) y `DRY=1` del lanzador.
- [ ] **Step 4: Lanzar** — dos sujetos por escenario con el kit de `develop`, 30 s entre arranques, `--max-turns 60`.
- [ ] **Step 5: Veredictos** — tabla por medida en `tests/task-verification-red.md` (sección «RED del paso 6»). Lo que pase 2/2 con el plan nuevo no recibe guidance en el paso 6: la Task 3 lo recorta y la Task 4 lo repite como control.
- [ ] **Step 6: Commit** — `test(sdd): RED del paso 6 de la task 0006`.

### Task 2 — Plantilla del plan

**Modelo**: hilo principal (Opus 5.5), en línea.
**Ejecución**: en línea — decisión 2.
**Tests RED**: hilo · bloque «Plantilla del plan» de `tests/TaskVerification.Tests.ps1`, en rojo antes de editar; la salida roja se copia en `tasks.md` (el pre-commit exige la suite en verde: el test va en el commit de la task, nunca `--no-verify`).

**Interfaces**:
- Consume: nada.
- Produce: en el bloque de Task de `plan-template.md`, los campos `**Superficies**:`, `**Verificación**:`, `**Verificación visual**:` y `**Verificación lenta**:`; en §3, la línea `Gate de cierre`.

**Ficheros**: `skills/sdd-templates/templates/plan-template.md`, `tests/TaskVerification.Tests.ps1`.

- [ ] **Step 1: Tests RED**:

```powershell
BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Plantilla del plan' {
  BeforeAll { $script:Template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md' }

  It 'cada task declara sus superficies' {
    $script:Template | Should -Match '\*\*Superficies\*\*:[^\n]*BD · backend · frontend · tooling · docs'
  }

  It 'la suite de BD solo corre si la task toca BD' {
    $script:Template | Should -Match 'migraciones, persistencia o dialecto'
  }

  It 'cada task declara su verificación y los dos campos opcionales' {
    $script:Template | Should -Match '\*\*Verificación\*\*:'
    $script:Template | Should -Match '\*\*Verificación visual\*\*:'
    $script:Template | Should -Match '\*\*Verificación lenta\*\*:[^\n]*10 min'
  }

  It 'De código no pide copiar el gate completo' {
    $script:Template | Should -Not -Match 'los comandos que el cambio tiene que dejar en verde'
  }

  It 'el gate de cierre se ejecuta una vez en la validación final' {
    $script:Template | Should -Match '## 3\. Validación final[\s\S]*Gate de cierre[^\n]*una vez'
  }
}
```

- [ ] **Step 2: Ver el rojo** — `Invoke-Pester ./tests/TaskVerification.Tests.ps1`. Esperado: fallan las cinco pruebas, cada una por su aserción; salida en `tasks.md`.
- [ ] **Step 3: Bloque de Task** — tras `**Tests RED**`, antes de `**Interfaces**`:
  - `**Superficies**: <BD · backend · frontend · tooling · docs — las que toca esta task>`, con ayuda: BD es migraciones, persistencia o dialecto; un servicio que usa la BD sin cambiar su acceso es backend.
  - `**Verificación**: <los comandos de esas superficies y ninguno más>`, con ayuda: la suite de BD solo si las superficies incluyen BD; el gate completo no va aquí aunque la constitution pida «todo verde en cada task»: esa regla se cumple con las superficies de la task y el gate corre una vez al cierre.
  - `**Verificación visual**: <omitir si la task no cambia lo que se ve · pantalla o ruta · estados · temas · qué mirar: alineación, separación a bordes, contraste>`.
  - `**Verificación lenta**: <omitir si ningún comando pasa de 10 min · comando · duración — la lanza el hilo principal en segundo plano, no el implementador>`.
  - Los steps de la task: `Step 2: Build` y `Step 3: Verificación` pasan a remitir a los comandos del campo `Verificación` de esa task.
- [ ] **Step 4: «De código»** — la ayuda cambia «y los comandos que el cambio tiene que dejar en verde» por: «El gate completo del proyecto no va aquí: este bloque viaja a cada implementador y lo convertiría en obligación de cada task. Va en §3, una vez».
- [ ] **Step 5: §3 Validación final** — primera línea: `- [ ] Gate de cierre, una vez y en el hilo principal: <comandos completos del proyecto>`; la ayuda de §2 («La verificación de cada task sigue la política del proyecto…») se ajusta a los campos nuevos.
- [ ] **Step 6: Verde** — `Invoke-Pester ./tests/TaskVerification.Tests.ps1`. Esperado: `Failed: 0`.
- [ ] **Step 7: Commit** — `feat(sdd-templates): superficies y verificación por task en la plantilla del plan`.

### Task 3 — Paso 6, encargo del implementador y override

**Modelo**: hilo principal (Opus 5.5), en línea.
**Ejecución**: en línea — decisión 2.
**Tests RED**: hilo · bloque «Despacho» de `tests/TaskVerification.Tests.ps1`, en rojo antes de editar; salida en `tasks.md`. Si la Task 1 recorta una pieza, su prueba se quita del bloque antes de ver el rojo.

**Interfaces**:
- Consume: los campos `Verificación`, `Verificación visual` y `Verificación lenta` que produce la Task 2; los veredictos de la Task 1.
- Produce: la sección `## Verificación` del encargo del implementador; la fila del override de `implementer-prompt.md`; el texto del paso 6.

**Ficheros**: `skills/sdd-start-task/SKILL.md`, `skills/sdd-start-task/references/encargo-revision.md`, `skills/sdd-start-task/references/overrides-superpowers.md`, `tests/TaskVerification.Tests.ps1`.

- [ ] **Step 1: Tests RED** — bloque añadido a `tests/TaskVerification.Tests.ps1`:

```powershell
Describe 'Despacho' {
  It 'el encargo del implementador lleva la verificación de su task' {
    $brief = Get-KitFile 'skills/sdd-start-task/references/encargo-revision.md'
    $brief | Should -Match '## Verificación[\s\S]*campo «Verificación»'
    $brief | Should -Match 'No ejecutes[^\n]*suite completa'
    $brief | Should -Match 'Verificación lenta[^\n]*no la ejecutes'
  }

  It 'el override sustituye la suite completa de superpowers' {
    $overrides = Get-KitFile 'skills/sdd-start-task/references/overrides-superpowers.md'
    $overrides | Should -Match 'run the full suite once before committing'
  }

  It 'el paso 6 dice quién mira la UI y quién lanza la verificación lenta' {
    $skill = Get-KitFile 'skills/sdd-start-task/SKILL.md'
    $skill | Should -Match 'Verificación visual[^\n]*navegador[^\n]*no probado'
    $skill | Should -Match 'Verificación lenta[^\n]*segundo plano'
    $skill | Should -Match 'gate de cierre[^\n]*una vez'
  }
}
```

- [ ] **Step 2: Ver el rojo** — `Invoke-Pester ./tests/TaskVerification.Tests.ps1`. Esperado: fallan las tres pruebas nuevas por su aserción; salida en `tasks.md`.
- [ ] **Step 3: `encargo-revision.md`** — en el encargo del implementador, tras `## Tests RED`:

```markdown
## Verificación

Ejecuta los comandos del campo «Verificación» de tu task: `<comandos>`. No ejecutes la suite completa ni la de superficies que tu task no toca: el gate de cierre lo ejecuta el hilo principal una vez, al final. <Si la task tiene «Verificación lenta»:> `<comando>` es la verificación lenta de tu task: no la ejecutes; la lanza el hilo principal.
```

  Con el porqué: `implementer-prompt.md` de superpowers pide «run the full suite once before committing», y con el gate en cada task una suite de backend corrió ~12 veces en una task de solo frontend (RED previo 2/2).
- [ ] **Step 4: `overrides-superpowers.md`** — fila nueva: `subagent-driven-development`, `implementer-prompt.md` «run the full suite once before committing» → el implementador ejecuta la verificación de su task; el gate de cierre lo ejecuta el hilo principal una vez, en la validación final.
- [ ] **Step 5: `SKILL.md` paso 6** — tras la frase de las Restricciones globales, en la frase que el agente ya ejecuta (lección de la 0025: una comprobación nueva va dentro del paso que el agente sigue):
  - El encargo lleva la sección `## Verificación` de `encargo-revision.md` con los comandos de la task.
  - Una task con `Verificación lenta`: el hilo la lanza en segundo plano en cuanto el implementador entrega, mientras corre la revisión; la task siguiente solo se despacha durante esa ejecución si no comparte ficheros y su encargo prohíbe los comandos que compiten por los mismos binarios; si falla, abre la ronda de fix de su task.
  - Una task con `Verificación visual`: tras su revisión, el hilo la mira en un navegador real (Playwright MCP o similar) antes de marcarla hecha en `tasks.md`; sin navegador, `no probado` en `tasks.md`, nunca sustituida por la suite.
  - El gate de cierre corre una vez, en la validación final.
  - Red flag y racionalización con las frases del RED («la constitution dice todo verde en cada task», «los tests pasan y la review está limpia»).
  - Lo que la Task 1 recortó no entra.
- [ ] **Step 6: Verde** — `Invoke-Pester ./tests/TaskVerification.Tests.ps1` y `Invoke-Pester ./tests/Skills.Tests.ps1` (enlaces y anatomía). Esperado: `Failed: 0`.
- [ ] **Step 7: Commit** — `feat(sdd-start-task): verificación de la task en el despacho, visual y lenta en el paso 6`.

### Task 4 — GREEN

**Modelo**: sujetos `sonnet` headless; lectura en el hilo.
**Ejecución**: en línea — leer la conducta de cada sujeto es juicio.
**Tests RED**: no aplica (los escenarios del RED son el contrato).

**Interfaces**:
- Consume: `red/m`, `red/f1`, `red/subject.sh` (E1); `red/m6`, `red/subject6.sh` (E2, E3); la copia del kit del working tree con las Tasks 2 y 3.
- Produce: `tests/task-verification-green.md`.

**Ficheros**: `green/` en la carpeta de la spec, `tests/task-verification-green.md`.

- [ ] **Step 1: Kit** — copia limpia del working tree (`skills/` y `.claude-plugin/`) en el scratchpad.
- [ ] **Step 2: Comprobación previa** — la de `tech-stack.md`; el molde de `red/` se reutiliza sin copiarlo (rutas ≤ 140).
- [ ] **Step 3: Lanzar** — E1, E2 y E3, dos sujetos cada uno, 30 s entre arranques.
- [ ] **Step 4: Veredictos** — esperado, contra la spec:
  - E1 (plan): cada task declara superficies y verificación; `backend:test` solo en la task con BD; el gate completo solo en §3; la task de UI con verificación visual (pantalla, estados, temas, qué mirar); `backend:test` como verificación lenta. 2/2.
  - E2 (lenta): el encargo dice que no ejecute `backend:test`; el hilo lo lanza con `run_in_background`; si despacha la Task 2 durante la suite, su encargo prohíbe los comandos de backend. 2/2.
  - E3 (UI): el encargo no lleva `:test` ni `backend:test`; la Task 2 no queda hecha solo por la suite (navegador o `no probado`). 2/2.
  - Lo recortado por la Task 1 se repite como control y sigue pasando.
  Si un escenario falla, se corrige el texto y se repite con dos sujetos nuevos.
- [ ] **Step 5: Evidencia** — `tests/task-verification-green.md` con la tabla RED → GREEN, coste y método.
- [ ] **Step 6: Commit** — `test(sdd): GREEN de la task 0006`.

---

## Estimación y esfuerzo *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: docs
- Esfuerzo spec + plan: 1,5h (incluye el RED previo y su diagnóstico)
- Estimación de implementación: 3h
- Base de la estimación: 2 tasks de texto + 2 campañas (10 sujetos); referencia 0021 (M, en línea, GREEN de 6 sujetos) y 0025 (molde por etapas en el paso 6)
- Confianza: media — un GREEN que falla añade una ronda

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `Invoke-Pester ./tests`
- [ ] GREEN: los cuatro requisitos de la spec en verde
- [ ] Revisión final (decisión 4) limpia
- [ ] Cierre con `sdd-end-task`, tras la validación del dev-lead

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cada task del plan verifica solo sus superficies» → Task 2 (Steps 3–4), GREEN E1. ✓
- ADDED «El gate de cierre se ejecuta una vez» → Task 2 (Steps 4–5), Task 3 (Steps 3–5), GREEN E1 y E3. ✓
- ADDED «Una task que cambia la UI se mira en un navegador» → Task 2 (Step 3), Task 3 (Step 5), RED E3, GREEN E1 y E3. ✓
- ADDED «Una verificación de más de 10 minutos la lanza el hilo principal en segundo plano» → Task 2 (Step 3), Task 3 (Steps 3, 5), RED E2, GREEN E1 y E2; la cláusula de la task siguiente se mide en E2 si el sujeto despacha la Task 2 con la suite en marcha, y si no llega a hacerlo se dice en el walkthrough como no probada. ✓

Perfil `delegate`: sin gate de plan. Cada escenario de la spec tiene su task (arriba); comprobado el 2026-09-23.
