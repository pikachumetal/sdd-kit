---
id: 20260922-153843-task-0010-token-cost
task: 0010
title: Plan de implementación — Estimación con tokens y modelos reales
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Estimación con tokens y modelos reales

## Decisiones que he tomado yo — valida estas

1. **Las tres tasks van en línea**, con el hilo (Opus 5) haciendo TDD — motivo en cada campo `Ejecución`. El cambio son tres ficheros de texto y unas 40 líneas de PowerShell sobre un parser que el hilo ya tiene leído; un implementador cuesta 200k+ tokens (dato del ticket 0009) para transcribir lo que ya está escrito aquí.
2. **El GREEN son 2 sujetos Sonnet** sobre el molde del RED, unos 2 $. Mismo escenario, para poder comparar.
3. **La revisión final va a un subagente Sonnet, effort medium** (suelo del Art. IV para revisores): el diff lo escribe el hilo y necesita otros ojos.
4. **Formato de los tokens en el log: miles con sufijo `k`** (`342k`), redondeado a entero. Un `1,23 M` se guarda como `1230k`. Una sola unidad se ordena y se compara; dos no.
5. **Coste estimado**: 1,2 h de implementación, ~2 $ de campaña y ~130k tokens de revisor.

**Goal**: que el walkthrough registre por separado el coste del hilo, el de los subagentes y el de los sujetos, y que `estimation-log.md` los agregue en tres columnas.

**Architecture**: la receta vive en `walkthrough-template.md`, con huecos fijos calcados del «Contexto» de `kit-feedback-template.md`, que es la forma que el corpus demuestra que se rellena. `Build-EstimationLog.ps1` gana tres lectores de campo con la misma tolerancia que ya aplica a las horas, más `k`/`M` para tokens y `$` para dinero, y tres columnas en la tabla. `estimation.md` recoge la calibración de los 14 tickets de campo.

**Tech Stack**: Markdown (plantillas del kit) y PowerShell 7 con Pester sobre fixtures versionadas en `tests/fixtures/estimation-log/`.

**Spec**: `./spec.md`

## Restricciones globales

- **Art. X — Calidad de código** (literal de `.docs/sdd/constitution.md`): «Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo.»
- **Política de modelos** (Art. IV, literal): «el **modelo y el effort** se declaran **siempre** de forma explícita al despachar […] con **gama media como suelo** para revisores y para implementadores que trabajan a partir de prosa, y el tier más barato reservado a transcripción de código ya escrito en el plan y a arreglos mecánicos de un fichero. El criterio es *turnos, no precio por token* […] `fable` y `opus xhigh` siguen prohibidos por defecto, con justificación escrita en la task.»
- **Modo de ejecución por defecto**: `subagent-driven-development`; en línea solo con motivo declarado por task.
- **Art. I**: toda edición de skill necesita RED antes y GREEN después, en `tests/`.
- **Art. III**: texto humano en castellano con tildes; nombres de fichero en inglés kebab-case.
- **Art. VIII**: las plantillas viven solo en `skills/sdd-templates/templates/`.
- El encabezado de la sección de tiempo del walkthrough **conserva el texto «estimado vs real»**: es el anclaje que busca `Get-TimeSection`.
- La suite entera (`Invoke-Pester -Path tests`) tiene que quedar en verde antes de cada commit: lo exige el hook de pre-commit.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres campos nuevos y tres columnas; sin fichero nuevo ni fase de migración.
- [x] **YAGNI gate**: no se abstrae nada. El log no recalcula la calibración de coste; esa tabla se escribe una vez en `estimation.md`.
- [x] **Brownfield gate**: retrocompatible. Un walkthrough sin los campos sigue dando fila, con `—` en las tres columnas.
- [x] **Constitution check**: Art. I (RED escrito, GREEN planificado), Art. VIII (solo `sdd-templates`), Art. X (en Restricciones globales).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-templates/templates/walkthrough-template.md` — sección 2: cuatro líneas nuevas y la aclaración de que «Esfuerzo real» es el reloj del hilo.
- `skills/sdd-templates/scripts/Build-EstimationLog.ps1` — lectura de los tres campos y tres columnas nuevas.
- `tests/Build-EstimationLog.Tests.ps1` y `tests/fixtures/estimation-log/proyecto/` — tests y fixtures.
- `.docs/sdd/estimation.md` — calibración por rol y aviso sobre la campaña.
- `.docs/sdd/capabilities/estimation.md` y `.docs/sdd/capabilities/task-ids.md` — los fusiona `sdd-end-task` al cerrar, no esta implementación.

**NO se tocan**:

- `skills/sdd-end-task/SKILL.md` — la receta va en la plantilla (decisión 6 de la spec). Si el GREEN falla con la plantilla sola, es enmienda.
- `skills/sdd-templates/templates/plan-template.md` y `patch-template.md` — fuera de scope y ficheros calientes de otras tasks.
- `skills/sdd-templates/templates/kit-feedback-template.md` — ya tiene los huecos.
- `.docs/sdd/estimation-log.md` — se regenera con el script en el cierre, no se edita.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

Ninguna. Los walkthroughs anteriores se leen igual y salen con `—`.

### 1.4 Contratos API

El contrato es de texto, y es doble:

**Sección 2 del walkthrough** (etiquetas exactas que lee el script):

```markdown
- Modelo del hilo: Opus 5 (1M)
- Tokens del hilo: no medido
- Tokens de subagentes: ~342k en 3 despachos — implementador Sonnet high 214k / 13 min; revisor de task Sonnet medium 128k / 7 min | no aplica
- Coste de sujetos: 1,85 $ en 4 sujetos Sonnet — RED 0,90 $; GREEN 0,95 $ | no aplica
```

**Fila del log**:

```markdown
| Fecha | Task | Tipo | Est (h) | Real (h) | Ratio | Hilo (tokens) | Subagentes (tokens) | Sujetos ($) | Carpeta |
| 2026-09-22 | 0010 | docs | 1.2 | 1 | 0.83 | no medido | 342k | 1.85 | 20260922-153843-task-0010-token-cost |
```

Reglas de lectura:

- Etiquetas nuevas: `Tokens del hilo`, `Tokens de subagentes`, `Coste de sujetos`.
- Etiquetas antiguas equivalentes: `Coste de subagentes` (→ tokens de subagentes) y `Coste de los sujetos headless` (→ coste de sujetos).
- `no medido` y `no aplica` pasan tal cual a la columna, aunque lleven texto detrás («**no medido** con contador»).
- Cifra de tokens: primer número de la línea, con prefijos tolerados `*`, `~`, `≈`, `≃`; sufijo `k` (miles) o `M` (millones); sin sufijo, se entiende en unidades. Salida siempre en `k` redondeado a entero.
- Cifra de dinero: primer número de la línea seguido de `$`, con coma o punto decimal. Salida con la misma forma que las horas (dos decimales como máximo).
- Campo ausente: `—`.

### 1.5 UX

No aplica.

### 1.6 Dependencias

Ninguna nueva. PowerShell 7 y Pester, que ya usa el repo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una forma real del corpus que el parser no lee | Media | Bajo — la fila sale con `—`, no se pierde | Tests sobre las cuatro formas reales del corpus (0001, 0011, 0014, 0012) |
| El GREEN falla porque la plantilla sola no basta | Media | Medio — obliga a tocar `sdd-end-task` | Está previsto como enmienda en la decisión 6 de la spec |
| La tabla del log se hace ancha y se lee peor | Alta | Bajo | Nombres de columna cortos; los modelos se quedan fuera |

### 1.8 Rollout

Directo, con la release 1.2.0 del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Sección 2 de `walkthrough-template.md`

**Modelo**: no aplica (hilo, Opus 5).
**Ejecución**: en línea — es la edición de un bloque de texto de una plantilla, y el hilo tiene delante el RED que fija la forma. Despacharlo cuesta más que escribirlo.
**Tests RED**: `tests/token-cost-red.md` (corpus y campaña, ya commiteados). La verificación de esta task es de texto, no Pester.

**Interfaces**:
- Consume: nada.
- Produce: las cuatro etiquetas exactas `Modelo del hilo`, `Tokens del hilo`, `Tokens de subagentes` y `Coste de sujetos`, que la Task 2 lee desde el script.

**Ficheros**: modificar `skills/sdd-templates/templates/walkthrough-template.md`.

- [ ] **Step 1: Implementación** — la sección 2 queda así (el encabezado conserva «estimado vs real»):

```markdown
## 2. Tiempo y coste: estimado vs real *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Estimación de implementación (del plan): <Yh>
- Esfuerzo real: <Zh> — reloj del hilo (aproximado si no hay medición exacta — nunca en blanco). Los minutos de los subagentes NO se suman aquí: van en su línea.
- Desviación: <±h> (<±%>)
- Causa de la desviación (obligatoria si |desviación| > 30%): <…>
- Modelo del hilo: <modelo>
- Tokens del hilo: no medido | <N> *(«no medido» es la salida honesta: el agente no ve su contador. Solo se pone cifra si el dev-lead la aporta)*
- Tokens de subagentes: <total> en <n> despachos — <rol> <modelo> <tokens> / <min>; … | no aplica
- Coste de sujetos: <X> $ en <n> sujetos <modelo> — <campaña> <X> $; … | no aplica
- Review de spec: <no | 1 revisor (dominio|técnica) | 2 revisores> · hallazgos <N>, aceptados <M>
```

- [ ] **Step 2: Build** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`. Esperado: verde (la suite valida la anatomía de las plantillas).
- [ ] **Step 3: Verificación** — `grep -n "Tokens del hilo\|Tokens de subagentes\|Coste de sujetos\|estimado vs real" skills/sdd-templates/templates/walkthrough-template.md` devuelve las cuatro líneas.
- [ ] **Step 4: Commit** — `docs(templates): coste del hilo, de los subagentes y de los sujetos en el walkthrough`.

### Task 2 — Tres columnas de coste en `Build-EstimationLog.ps1`

**Modelo**: no aplica (hilo, Opus 5).
**Ejecución**: en línea — TDD del propio hilo: el plan ya trae el código y los tests, y el parser está leído. Un implementador transcribiría.
**Tests RED**: `tests/Build-EstimationLog.Tests.ps1`, escritos antes del cambio del script y ejecutados en rojo.

**Interfaces**:
- Consume: las etiquetas de la Task 1 (`Tokens del hilo`, `Tokens de subagentes`, `Coste de sujetos`) y las antiguas `Coste de subagentes` y `Coste de los sujetos headless`.
- Produce: `estimation-log.md` con las columnas `Hilo (tokens)`, `Subagentes (tokens)` y `Sujetos ($)` entre `Ratio` y `Carpeta`.

**Ficheros**: modificar `skills/sdd-templates/scripts/Build-EstimationLog.ps1`, `tests/Build-EstimationLog.Tests.ps1`, `tests/fixtures/estimation-log/proyecto/`.

- [ ] **Step 1: Escribir los tests en rojo** — fixtures nuevas y tests. Una fixture por forma real del corpus:

```powershell
It 'lee los tres costes declarados por separado' {
  Get-Row $script:Result.Text '20260910-100000-task-0008-coste' |
    Should -Be '| 2026-09-10 | 0008 | docs | 2 | 1 | 0.5 | no medido | 342k | 1.85 | 20260910-100000-task-0008-coste |'
}

It 'muestra no aplica cuando la task no tuvo subagentes ni sujetos' {
  Get-Row $script:Result.Text '20260911-100000-task-0009-solo' |
    Should -Be '| 2026-09-11 | 0009 | docs | 1 | 1 | 1 | 120000 | no aplica | no aplica | 20260911-100000-task-0009-solo |'
}

It 'lee las etiquetas antiguas del corpus y los tokens en millones' {
  Get-Row $script:Result.Text '20260912-100000-task-0010-legacy' |
    Should -Be '| 2026-09-12 | 0010 | docs | 2 | 2 | 1 | — | 1230k | 10.3 | 20260912-100000-task-0010-legacy |'
}

It 'deja en guion los costes de un walkthrough anterior' {
  Get-Row $script:Result.Text '20260901-100000-task-0001-plain' |
    Should -Be '| 2026-09-01 | 0001 | docs | 4 | 2 | 0.5 | — | — | — | 20260901-100000-task-0001-plain |'
}
```

  Las fixtures llevan estas líneas en su sección de tiempo:

  - `20260910-100000-task-0008-coste`: `- Tokens del hilo: **no medido** con contador`, `- Tokens de subagentes: ~342k en 3 despachos — implementador Sonnet high 214k / 13 min`, `- Coste de sujetos: 1,85 $ en 4 sujetos Sonnet`.
  - `20260911-100000-task-0009-solo`: `- Tokens del hilo: 120000`, `- Tokens de subagentes: no aplica`, `- Coste de sujetos: no aplica`.
  - `20260912-100000-task-0010-legacy`: `- Coste de subagentes: ~1,23 M en 9 despachos`, `- Coste de los sujetos headless: ≈ 10,3 $ en 45 sujetos Sonnet`.

  Además, las aserciones de fila de los tests existentes pasan a llevar las tres columnas con `—`.

- [ ] **Step 2: Ejecutar los tests y verlos fallar** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Build-EstimationLog.Tests.ps1 -Output Detailed"`. Esperado: fallan por el número de columnas de la fila.
- [ ] **Step 3: Implementación** — en `Build-EstimationLog.ps1`:

```powershell
$script:ThreadTokensLabel = 'Tokens del hilo'
$script:SubagentTokensLabel = 'Tokens de subagentes|Coste de subagentes'
$script:SubjectCostLabel = 'Coste de los sujetos headless|Coste de sujetos'

function Get-DeclaredAbsence([string]$Text) {
  if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
  $normalized = ($Text -replace '\*', '').Trim()
  foreach ($answer in @('no medido', 'no aplica')) {
    if ($normalized -like "$answer*") { return $answer }
  }
  return $null
}

function ConvertTo-Tokens([string]$Text) {
  $absence = Get-DeclaredAbsence $Text
  if ($null -ne $absence) { return $absence }
  if ($Text -notmatch '^[\s*~≈≃]*(\d+(?:[.,]\d+)?)\s*([kKmM])?') { return $null }
  $amount = [double]($Matches[1] -replace ',', '.')
  $thousands = switch -Regex ($Matches[2]) { '[mM]' { $amount * 1000 } '[kK]' { $amount } default { $amount / 1000 } }
  return '{0}k' -f [math]::Round($thousands, 0, [System.MidpointRounding]::AwayFromZero)
}

function ConvertTo-Money([string]$Text) {
  $absence = Get-DeclaredAbsence $Text
  if ($null -ne $absence) { return $absence }
  if ($Text -notmatch '^[\s*~≈≃]*(\d+(?:[.,]\d+)?)\s*\$') { return $null }
  return Format-Number ([double]($Matches[1] -replace ',', '.'))
}

function Read-CostFields([string]$Section) {
  return [pscustomobject]@{
    ThreadTokens   = ConvertTo-Tokens (Get-FieldText $Section $script:ThreadTokensLabel)
    SubagentTokens = ConvertTo-Tokens (Get-FieldText $Section $script:SubagentTokensLabel)
    SubjectCost    = ConvertTo-Money (Get-FieldText $Section $script:SubjectCostLabel)
  }
}
```

  `Read-Walkthrough` y `Read-Patch` añaden `Cost = Read-CostFields $section` al objeto que devuelven; `New-Row` copia `$Artifact.Cost` en la fila; `Format-Log` escribe las tres columnas nuevas con `Format-Text`, que devuelve `—` cuando el valor es `$null`. `ConvertTo-Money` se declara después de `Format-Number`, que ya existe.

- [ ] **Step 4: Ejecutar la suite entera** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`. Esperado: verde.
- [ ] **Step 5: Smoke sobre el repo real** — `pwsh -NoProfile -File skills/sdd-templates/scripts/Build-EstimationLog.ps1 -Root .` y leer el diff: las filas antiguas llevan `—` y las cinco del corpus con etiqueta antigua recuperan sus tokens.
- [ ] **Step 6: Commit** — `feat(templates): columnas de coste en tokens y dólares en el estimation-log`.

### Task 3 — Calibración en `estimation.md`

**Modelo**: no aplica (hilo, Opus 5).
**Ejecución**: en línea — es redacción de un documento de anclaje a partir de datos que el hilo ya ha leído en los 14 tickets.
**Tests RED**: no aplica; es el documento de método, no guidance de skill.

**Interfaces**:
- Consume: las cifras de los tickets de `.docs/sdd/field-reports/`.
- Produce: nada que lea otra task.

**Ficheros**: modificar `.docs/sdd/estimation.md`.

- [ ] **Step 1: Implementación** — añadir al final una sección «Coste en tokens y en dinero» con: la tabla de referencia por rol (revisor de spec ~90–110k; implementador Sonnet high 67–240k y 11–29 min; revisor de task 66–142k y 6–10 min; revisor final 121–136k), el coste por sujeto headless (0,6–0,9 $ a un turno; 2–5 $ en entrevistas de varios turnos con simulador) y el aviso de que la campaña es la partida más variable, con el dato de la 0012 (RED 29,8 $ frente a 5–7 $ estimados) y el de la 0020 (GREEN 26,3 $ frente a ~17 $).
- [ ] **Step 2: Verificación** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` en verde y lectura del documento.
- [ ] **Step 3: Commit** — `docs(sdd): calibración de coste por rol y por sujeto en estimation.md`.

### Task 4 — GREEN con sujetos

**Modelo**: sujetos `claude -p --model sonnet` (mismo modelo que el RED, para comparar).
**Ejecución**: campaña del hilo, con el lanzador de `red/`.
**Tests RED**: `tests/token-cost-red.md`.

**Interfaces**:
- Consume: el molde `red/m-close` y el kit con las tasks 1–3 aplicadas.
- Produce: `tests/token-cost-green.md`.

**Ficheros**: crear `green/` en la carpeta de la spec y `tests/token-cost-green.md`.

- [ ] **Step 1: Copia del kit** — copiar `skills/`, `.claude-plugin/` y `hooks/` al scratchpad, ya con las tasks 1–3.
- [ ] **Step 2: Lanzar 2 sujetos** — mismo turno que el RED: «Cierra la task 0009. Lo he probado yo: …».
- [ ] **Step 3: Veredicto** — por sujeto: ¿están las cuatro líneas?, ¿el hilo dice «no medido»?, ¿el esfuerzo real deja de sumar los minutos de los subagentes?, ¿el log muestra las tres columnas?
- [ ] **Step 4: Commit** — `test(sdd): GREEN de la task 0010 con dos sujetos`.

---

## Estimación y esfuerzo *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: docs
- Esfuerzo spec + plan: 0,9h (incluido el RED previo)
- Estimación de implementación: 1,2h
- Base de la estimación: cuatro tasks, tres en línea sobre ficheros leídos; la campaña corre en paralelo y no suma reloj (tercer aviso de este mismo documento). Referencia del log: las tasks `docs` de la release rondan 0,75–1,5h reales.
- Confianza: alta

---

## 3. Validación final

- [ ] Suite entera en verde (`Invoke-Pester -Path tests`)
- [ ] Smoke: regenerar `.docs/sdd/estimation-log.md` del propio repo y leer el diff
- [ ] GREEN documentado en `tests/token-cost-green.md`
- [ ] Revisión final de rama por subagente Sonnet medium
- [ ] Cierre con `sdd-end-task`, tras la validación del dev-lead

---

## 4. Self-review (cobertura spec → tasks)

- Decisión 1 (cuatro líneas fijas en el walkthrough) → Task 1. ✓
- Decisión 2 («Esfuerzo real» es el reloj del hilo) → Task 1, verificado en Task 4. ✓
- Decisión 3 (tres columnas del log) → Task 2. ✓
- Decisión 4 (etiquetas antiguas) → Task 2, Step 1 y Step 5. ✓
- Decisión 5 (calibración en `estimation.md`) → Task 3. ✓
- Decisión 6 (no se toca `sdd-end-task`) → §1.1 «NO se tocan»; el GREEN de la Task 4 lo comprueba. ✓
- Decisión 7 (sin migración) → §1.3 y el test de la fila antigua en la Task 2. ✓
- Decisión 8 (`Get-NextSddId.ps1` con rutas no ASCII) → hecho antes del plan, en el commit `c4fab15`, porque bloqueaba el pre-commit. ✓
- `MODIFIED` El estimation-log se genera desde los artefactos de cierre → Task 2. ✓
- `ADDED` El coste del hilo, de los subagentes y de los sujetos se registra por separado → Tasks 1 y 2. ✓
- `ADDED` El esfuerzo real es el reloj del hilo → Task 1 y Task 4. ✓
- `ADDED` El id se calcula igual con una ruta no ASCII → commit `c4fab15`, con test en `tests/Get-NextSddId.Tests.ps1`. ✓
