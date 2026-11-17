---
id: 20261025-152402-feature-0213-campaign-control
feature: 0213
title: Plan de implementación — Control de campaña en tests/headless/run.sh
spec: ./spec.md
status: draft
created: 2026-10-25
---

# Plan de implementación — Control de campaña en `tests/headless/run.sh`

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las cuatro tasks con el modelo que tiene (Opus 5.5; el dev-lead aprobó sin la parada para bajarla). Revisión final con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura no (abajo).
2. Ejecución: native (motivo en la cabecera).
3. Orden: primero el ensayo en seco fuera de `SPEC_DIR` (Task 1), porque cambia dónde buscan las salidas todos los casos de Pester que las Tasks 2 y 3 añaden.
4. La marca de un sujeto la crea `run.sh` con su propio PID (`$$`) antes de lanzar, y el subshell la reescribe con `$BASHPID` y la borra al acabar: sin la primera escritura, el siguiente escenario podía no ver al sujeto recién lanzado; sin la reescritura, un sujeto vivo de un `run.sh` muerto contaría como cortado.
5. Un sujeto que muere en una guarda de `lib.sh` (sin skill, `SETTINGS`…) no cuenta como cortado: el subshell sobrevive y borra la marca. Cortado es solo el subshell muerto.
6. La comprobación de que `kill -0` ve el PID de otro `bash` va en el Step 1 de la Task 2, antes de escribir el recuento.
7. Coste: ~2,5 h de implementación; 1 sujeto real en haiku (~0,05 $, techo 0,5 $) en la Task 3.
8. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: que `run.sh` controle etiquetas repetidas, sujetos a la vez, techo de coste con lo lanzado y ensayos en seco, informe el coste por carpeta, y que un sujeto no pueda lanzar `claude`.

**Architecture**: `run.sh` cuenta los sujetos con tres estados (terminado por `tools.txt`; en curso y cortado por las marcas de `RUNS_DIR/live`) y los tres techos y la espera de `MAX_PARALLEL` leen ese recuento; la raíz de salidas (`SPEC_DIR` o `RUNS_DIR/dry`) la decide una sola variable. `lib.sh` antepone `tests/headless/no-claude/` al `PATH` del `claude -p` del sujeto.

**Tech Stack**: bash (Git Bash), Pester 5 (`tests/*.Tests.ps1`), Node para `extract.mjs`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 4 tasks sobre los mismos dos scripts y sus tests, las Tasks 2 y 3 dependen de la raíz de salidas de la Task 1, un error lo caza el Pester de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el arnés de pruebas del repo, sin módulo, dependencia ni contrato nuevos fuera de `tests/headless/`.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); un comentario solo guarda un porqué no deducible. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, ayuda) en castellano con tildes.
- Literales de la spec: `ya existe <etiqueta>: sube SUBJECT` · `techo de <COST_CAP> $ alcanzado (<gastado> $ gastados, <n> en curso a <SUBJECT_COST> $)` · `esperando hueco: <n> sujetos en curso (MAX_PARALLEL=<m>)` · `en seco: salidas en <ruta>` · `<carpeta>: <n> sujetos · <$> $` y ` · <k> sin RESULTADO` · `cortados sin salida: <n> (contados a <SUBJECT_COST> $ cada uno)` · `claude anidado bloqueado en un sujeto: run.sh no ve su coste`. La línea final `sujetos de la campaña: <n> · coste acumulado: <$> $` no cambia.
- Valores: `MAX_PARALLEL` por omisión 5; `SUBJECT_COST` por omisión `COST_CAP / SUBJECT_CAP`; se para si `gastado + (en curso + cortados + 1) × SUBJECT_COST > COST_CAP`; marcas en `RUNS_DIR/live/<fase>.<etiqueta>`; salidas en seco en `RUNS_DIR/dry/<fase>/out`.
- No se edita `run.sh` ni `lib.sh` mientras un sujeto los ejecuta (bash lee el script a trozos).
- Ficheros `.sh` y el `claude` falso con LF; el `claude` falso con bit de ejecución en git (`git update-index --chmod=+x`).

### De proceso

- Política de modelos: la de `sdd-implement` (Art. IV); `fable` y `opus xhigh` prohibidos.
- Con una campaña de sujetos en marcha no se commitea ni se corre la base.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia su revisión; `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Dos `run.sh` a la vez sobre el mismo `RUNS_DIR` con fases distintas → `MAX_PARALLEL` cuenta los sujetos de las dos fases, no solo los de la suya · Task 2, `MAX_PARALLEL cuenta los sujetos de otro run.sh sobre el mismo RUNS_DIR` (las marcas llevan la fase en el nombre pero se cuentan todas).
- Un sujeto que acaba entre la comprobación de `tools.txt` y la de su PID → cuenta como terminado, nunca como cortado · Task 2, revisión de `subject_state` (se mira `tools.txt` primero; el subshell borra la marca después de guardar).
- Un `SUBJECT_COST` con decimales y `COST_CAP` entero (`0.4` y `1`) → la comparación es de coma flotante (awk), no de enteros de bash · Task 2, `no lanza si lo gastado más lo lanzado a SUBJECT_COST pasa de COST_CAP`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un recuento con marcas de PID y una variable de raíz; sin demonio ni lock.
- [x] **YAGNI gate**: sin opción para permitir `claude` anidado ni generador versionado de la tabla.
- [x] **Brownfield gate**: ninguna variable obligatoria nueva; los `subject.sh` existentes no cambian.
- [x] **Constitution check**: Art. I no aplica (sin texto de skill); Art. X en las restricciones; Art. XI: la tabla va a `tech-stack.md`, documento de estado.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/headless/no-claude/claude` — `claude` falso para el sujeto (bash): imprime el mensaje de bloqueo en stderr y sale con 1.
- `tests/headless/no-claude/claude.cmd` — el mismo para el tool PowerShell del sujeto.

**Modificar**:

- `tests/headless/run.sh` — raíz de salidas, recuento de sujetos, techos, `MAX_PARALLEL`, informe por carpeta; cabecera con las variables nuevas.
- `tests/headless/lib.sh` — `run_claude` con el `PATH` del sujeto; línea de cabecera.
- `tests/headless/battery.sh` — sin `CHUNK`; veredicto sobre la raíz de salidas.
- `tests/HeadlessLauncher.Tests.ps1` — salidas en seco en `RUNS_DIR/dry`; casos nuevos.
- `tests/Battery.Tests.ps1` — lo que cambie por la raíz en seco.
- `.docs/sdd/tech-stack.md` — tabla de coste por tipo de sujeto, regla del techo, líneas 133, 137, 143 y 160.
- `tests/WordBudget.Tests.ps1` — tope de `tech-stack.md` a 19663.

**NO se tocan**:

- `tests/headless/extract.mjs`, `battery.mjs` — son de la 0214.
- Los `subject.sh` de campañas cerradas — conservan su lanzador.

### 1.6 Dependencias

- Ninguna nueva. `kill -0` y `$BASHPID` de Git Bash (Task 2, Step 1 lo comprueba).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `kill -0` no ve el PID de un `bash` de otra llamada | baja | `MAX_PARALLEL` no cuenta otro `run.sh` | Task 2 Step 1 lo mide; si falla, desvío: la marca sola cuenta como en curso |
| El `PATH` no llega al Bash tool del sujeto (snapshot del shell) | media | el bloqueo no actúa | sujeto real de la Task 3; si falla, desvío a `--disallowedTools` |
| Los tests de concurrencia se vuelven lentos o inestables | media | suite lenta | sueños de 2 s, `MAX_PARALLEL=2`, comparación por máximo observado |

### 1.8 Rollout

Directo: el arnés se usa desde la rama siguiente que lance una campaña.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Ensayo en seco fuera de la spec y coste por carpeta

**Tras**: —
**Modelo**: Native: la sesión (effort: el de la sesión).
**Tests RED**: hilo principal · `tests/HeadlessLauncher.Tests.ps1`
**Superficies**: tooling
**Verificación**: `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -CI` → `Tests Passed: <n>, Failed: 0`

**Interfaces**:
- Consume: nada.
- Produce: en `run.sh`, `ROOT` (`$SPEC_DIR`, o `$RUNS/dry` con `DRY_RUN=1`) y `OUT="$ROOT/${PHASE:-red}/out"`; `spent()` y `subjects()` sobre `"$ROOT"/*/out`; `folder_report()` que imprime las líneas por carpeta. En `battery.sh`, el veredicto sobre la misma raíz. En los tests, `New-Campaign` devuelve `Out` = `<runs>/dry/red/out` y `Dry` = `<runs>/dry`; `Get-Subjects` cuenta `spec/*/out` y `runs/dry/*/out`.

**Ficheros**: modificar `tests/headless/run.sh`, `tests/headless/battery.sh`, `tests/HeadlessLauncher.Tests.ps1`, `tests/Battery.Tests.ps1`

- [ ] **Step 1: Tests RED** — en `HeadlessLauncher.Tests.ps1`:
  - Adaptar los casos existentes a `Out` en seco; el de COST_CAP planta `x-1.tools.txt` en `<runs>/dry/green/out`.
  - `It 'en seco deja las salidas en RUNS_DIR/dry y nada en SPEC_DIR'`: `SCENARIOS='a'` → `Join-Path $campaign.Spec 'red/out' | Should -Not -Exist`; `Join-Path $campaign.Runs 'dry/red/out/a-1.tools.txt' | Should -Exist`; `$run.Output | Should -Match 'en seco: salidas en .*dry'`.
  - `It 'en seco no cuenta las salidas de SPEC_DIR'`: planta `spec/green/out/x-1.tools.txt` con `=== RESULTADO (1 turnos, 9 $)`, `COST_CAP='4'` → se lanza `a` y `$run.Output | Should -Match 'coste acumulado: 0\.50 \$'`.
  - `It 'al acabar da el coste por carpeta'`: planta `dry/green-premature/out/x-1.tools.txt` (`=== RESULTADO (2 turnos, 0.9 $)`) y `dry/green/out/y-1.tools.txt` sin `RESULTADO`; `SCENARIOS='a'` → `Should -Match 'red: 1 sujetos · 0\.50 \$'`, `'green-premature: 1 sujetos · 0\.90 \$'`, `'green: 1 sujetos · 0\.00 \$ · 1 sin RESULTADO'`, `'coste acumulado: 1\.40 \$'`.
  - El caso de `SPEC_DIR` relativo pasa a lanzar sin seco con un `claude` falso en `PATH` que imprime un stream mínimo (`{"type":"result","num_turns":1,"total_cost_usd":0.5,"result":"hecho"}`), como el de `SUBJECT_TIMEOUT`; sigue esperando `spec/red/out/a-1.tools.txt` y `sujetos de la campaña: 1 `.
  Correr y ver fallar los nuevos.
- [ ] **Step 2: Implementación** — `run.sh`: `ROOT`, `OUT`, `subjects`/`spent` sobre `$ROOT`, `folder_report` (awk sobre el último `RESULTADO` de cada `tools.txt` por carpeta, `printf "%.2f"`), la línea `en seco: salidas en <OUT>` antes de la final con `DRY_RUN=1`; cabecera. `battery.sh`: la misma raíz para el veredicto.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(headless): ensayo en seco fuera de SPEC_DIR y coste por carpeta en run.sh`.

### Task 2 — Recuento de sujetos: etiqueta existente, techo con lo lanzado, cortados y MAX_PARALLEL

**Tras**: Task 1
**Modelo**: Native: la sesión (effort: el de la sesión).
**Tests RED**: hilo principal · `tests/HeadlessLauncher.Tests.ps1`
**Superficies**: tooling
**Verificación**: `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -CI` → `Tests Passed: <n>, Failed: 0`

**Interfaces**:
- Consume: `ROOT`, `OUT`, `spent()`, `subjects()`, `folder_report()` de la Task 1.
- Produce: `LIVE="$RUNS/live"`; `subject_state <marca>` → `done` | `running` | `cut` (`done` si existe `$ROOT/<fase>/out/<etiqueta>.tools.txt`; `running` si `kill -0 <pid>`; si no, `cut`); `count_state <estado>`; `launch_subject <escenario>`; `SUBJECT_COST` y `MAX_PARALLEL` con sus valores por omisión. Sale el recuento `before + launched`.

**Ficheros**: modificar `tests/headless/run.sh`, `tests/headless/battery.sh`, `tests/HeadlessLauncher.Tests.ps1`

- [ ] **Step 1: Comprobación de `kill -0`** — en Git Bash: lanzar `bash -c 'echo $BASHPID > <scratchpad>/pid; sleep 20'` en segundo plano desde una llamada y, desde otra, `kill -0 $(cat <scratchpad>/pid) && echo vivo`. Esperado: `vivo`; y tras acabar, `kill -0` falla. Si no, parar: desvío (riesgo 1).
- [ ] **Step 2: Tests RED** — `Invoke-Campaign` gana `[string]$Command` opcional (un `bash -c` en lugar de `run.sh`) para lanzar dos `run.sh` a la vez. Casos:
  - `It 'no relanza una etiqueta que ya tiene tools.txt en su fase'`: planta `dry/red/out/a-1.tools.txt` con `marca`, `SCENARIOS='a b'` → `Should -Match 'ya existe a-1: sube SUBJECT'`; el fichero sigue con `marca`; `dry/red/out/b-1.tools.txt` existe.
  - `It 'no lanza si lo gastado más lo lanzado a SUBJECT_COST pasa de COST_CAP'`: `subject.sh` con `sleep 3` antes de `subject_launch`, `SCENARIOS='a b c'`, `COST_CAP='1'`, `SUBJECT_COST='0.4'` → `Should -Match 'techo de 1 \$ alcanzado \(0\.00 \$ gastados, 2 en curso a 0\.4 \$\)'`; 2 sujetos.
  - `It 'cuenta un sujeto cortado como sujeto y como SUBJECT_COST'`: planta `runs/live/red.z-1` con un PID muerto (`999999`), `SUBJECT_CAP='2'`, `SCENARIOS='a b'` → `Should -Match 'techo de 2 sujetos'`; 1 sujeto; `Should -Match 'cortados sin salida: 1 \(contados a 5 \$ cada uno\)'`.
  - `It 'MAX_PARALLEL limita los sujetos a la vez'`: cada sujeto hace `touch "$C/$2"; ls "$C" | wc -l >> "$LOG"; sleep 2; rm "$C/$2"` antes de `subject_launch`; `MAX_PARALLEL='2'`, `SCENARIOS='a b c d'` → máximo de `$LOG` = 2; 4 sujetos; `Should -Match 'esperando hueco: 2 sujetos en curso \(MAX_PARALLEL=2\)'`.
  - `It 'MAX_PARALLEL cuenta los sujetos de otro run.sh sobre el mismo RUNS_DIR'`: el mismo `subject.sh`, `-Command "SCENARIOS='a b' bash run.sh & PHASE=green SCENARIOS='c d' bash run.sh; wait"` (con `green/subject.sh` copiado), `MAX_PARALLEL='2'` → máximo de `$LOG` = 2.
  - `It 'borra la marca del sujeto al acabar'`: `SCENARIOS='a'` → `runs/live` vacío.
  Correr y ver fallar los nuevos.
- [ ] **Step 3: Implementación** — en `run.sh`, por escenario y en este orden: parada a petición; etiqueta existente (sigue); esperar hueco de `MAX_PARALLEL`, con su mensaje una vez; techo de sujetos (`terminados + en curso + cortados + 1 > SUBJECT_CAP`); techo de coste; `launch_subject` (marca con `$$`, subshell que la reescribe con `$BASHPID`, lanza `SUBJECT_SH` y la borra). Al acabar, `cortados sin salida` antes de la línea final, y lo gastado de la línea final incluye los cortados a `SUBJECT_COST`. `battery.sh`: sin `CHUNK`, un `run.sh` por modelo e índice con todos sus escenarios; fuera la línea de cabecera de las tandas. Cabecera de `run.sh` con `SUBJECT_COST`, `MAX_PARALLEL`, la marca y «ya existe».
- [ ] **Step 4: Verificación** — el comando de «Verificación».
- [ ] **Step 5: Commit de la task** — `feat(headless): MAX_PARALLEL, SUBJECT_COST y etiquetas existentes en run.sh`.

### Task 3 — `claude` anidado bloqueado en el sujeto

**Tras**: Task 2
**Modelo**: Native: la sesión (effort: el de la sesión).
**Tests RED**: hilo principal · `tests/HeadlessLauncher.Tests.ps1`
**Superficies**: tooling
**Verificación**: `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI` → `Tests Passed: <n>, Failed: 0`; y el sujeto real del Step 3.

**Interfaces**:
- Consume: `run.sh` de la Task 2.
- Produce: `tests/headless/no-claude/{claude,claude.cmd}`; `run_claude` con `PATH="$HEADLESS/no-claude:$PATH"` solo para el `claude -p` del sujeto (no para `persona_reply`).

**Ficheros**: crear `tests/headless/no-claude/claude`, `tests/headless/no-claude/claude.cmd`; modificar `tests/headless/lib.sh`, `tests/HeadlessLauncher.Tests.ps1`

- [ ] **Step 1: Test RED** — `It 'el sujeto no puede lanzar su propio claude'`: un `claude` falso en `PATH` (sin seco) que ejecuta `claude --version > "$NESTED_LOG" 2>&1; echo "rc=$?" >> "$NESTED_LOG"` y después imprime el stream mínimo → `$NESTED_LOG` casa `claude anidado bloqueado en un sujeto: run\.sh no ve su coste` y `rc=1`. Correr y verlo fallar.
- [ ] **Step 2: Implementación** — los dos falsos (bash: `echo "<mensaje>" >&2; exit 1`; cmd: `@echo <mensaje> 1>&2` y `@exit /b 1`), `chmod +x` en git; `run_claude` con el `PATH`; línea en la cabecera de `lib.sh`.
- [ ] **Step 3: Sujeto real** — campaña mínima en el scratchpad (kit con `skills/sdd-plan/SKILL.md`, sin `plugin.json`), `MODEL=haiku`, `SUBJECT_CAP=2`, `COST_CAP=0.5`, petición «Ejecuta `claude --version` con la herramienta Bash y después con la herramienta PowerShell, y copia literal lo que devuelve cada una.» Esperado en `tools.txt`: el mensaje de bloqueo en las dos. Si alguna devuelve una versión, parar: desvío (riesgo 2). El resultado va al walkthrough; la campaña no se versiona.
- [ ] **Step 4: Verificación** — el comando de «Verificación».
- [ ] **Step 5: Commit de la task** — `feat(headless): el sujeto no puede lanzar claude anidado`.

### Task 4 — Tabla de coste por tipo de sujeto y `tech-stack.md` al día

**Tras**: Task 3
**Modelo**: Native: la sesión (effort: el de la sesión).
**Tests RED**: ninguno (documento); la verificación es el tope de palabras.
**Superficies**: docs
**Verificación**: `Invoke-Pester -Path tests/WordBudget.Tests.ps1 -CI` → `Failed: 0`

**Interfaces**:
- Consume: los nombres de variables y mensajes de las Tasks 1-3.
- Produce: nada.

**Ficheros**: modificar `.docs/sdd/tech-stack.md`, `tests/WordBudget.Tests.ps1`

- [ ] **Step 1: Datos** — script de un solo uso en el scratchpad: por cada `specs/*/{red,green}/out/*.tools.txt` con `RESULTADO`, su último coste y el tipo según la skill medida de su campaña (la primera `>>> Skill: sdd-kit:<x>`, agrupada: `using-sdd` → enrutado; `sdd-propose`, `sdd-grilling`, `sdd-start-*` → primera pregunta; `sdd-archive`, `sdd-end-*` → cierre; `sdd-upgrade` → migración; `sdd-init*` → init; el resto → otros). Salida: n y mediana por tipo; guardarla para el walkthrough. Si un tipo agrupa mal (p. ej. enrutado y primera pregunta indistinguibles), se dice en la tabla y no se inventa la frontera.
- [ ] **Step 2: Texto** — en «Sujetos headless»: la tabla (tipo · n · mediana), con fecha y regla de clasificación en una frase; la regla del techo (línea 184) añade que la previsión parte de esa tabla; la línea 133 dice que `DRY_RUN=1` escribe en `RUNS_DIR/dry`; la 137 sale; la 143 dice «hasta `MAX_PARALLEL` a la vez (`MAX_PARALLEL=1`, en serie)»; la 160 se queda en el hecho medido y nombra `MAX_PARALLEL`. Medir palabras: lo nuevo no pasa de lo que sale más 380.
- [ ] **Step 3: Tope** — `'tech-stack.md' = 19663` en `WordBudget.Tests.ps1`.
- [ ] **Step 4: Verificación** — el comando de «Verificación».
- [ ] **Step 5: Commit de la task** — `docs(sdd): coste por tipo de sujeto y run.sh al día en tech-stack`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 2,5h (rango 1,5–3,5h)
- Base de la estimación: 4 tasks sobre dos scripts con Pester ya montado; la incertidumbre está en la concurrencia (Task 2) y en el `PATH` del sujeto real (Task 3).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Decisión 1, etiqueta existente → Task 2, `no relanza una etiqueta que ya tiene tools.txt en su fase`. ✓
- Decisiones 2 y 3, `SUBJECT_COST` y techo con lo lanzado → Task 2, `no lanza si lo gastado más lo lanzado…`; el valor por omisión, en `cuenta un sujeto cortado…` (5 $ = 10/2). ✓
- Decisión 4, en curso entre lanzadores → Task 2, Step 1 y `MAX_PARALLEL cuenta los sujetos de otro run.sh…`. ✓
- Decisión 5, cortados sin salida → Task 2, `cuenta un sujeto cortado como sujeto y como SUBJECT_COST`. ✓
- Decisión 6, `MAX_PARALLEL` y espera → Task 2, `MAX_PARALLEL limita los sujetos a la vez`; `CHUNK` fuera → Task 2 Step 3, `Battery.Tests.ps1` sigue verde. ✓
- Decisión 7, seco fuera de la spec → Task 1, `en seco deja las salidas…` y `en seco no cuenta las salidas de SPEC_DIR`; `battery.sh` → `Battery.Tests.ps1` actuales. ✓
- Decisión 8, `claude` anidado → Task 3, `el sujeto no puede lanzar su propio claude` y sujeto real. ✓
- Decisión 9, coste por carpeta → Task 1, `al acabar da el coste por carpeta`. ✓
- Decisión 10, tabla de coste → Task 4, Step 1-2 (lectura). ✓
- «Lo que se retira»: líneas 133, 137, 143, 160 y 184 de `tech-stack.md` → Task 4 Step 2; `CHUNK` → Task 2; mensaje del techo → Task 2 (test del techo de coste existente actualizado); `before + launched` → Task 2. ✓
- Filas del roadmap → cierre (`sdd-archive`). ✓
- Review Focus → Task 2, sus tres tests. ✓
