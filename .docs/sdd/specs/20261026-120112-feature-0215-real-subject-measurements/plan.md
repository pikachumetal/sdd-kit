---
id: 20261026-120112-feature-0215-real-subject-measurements
feature: 0215
title: Plan de implementación — Medidas con sujetos reales del lanzador de tests/headless/
spec: ./spec.md
status: draft
created: 2026-10-26
---

# Plan de implementación — Medidas con sujetos reales del lanzador de tests/headless/

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las 3 tasks y lanza los sujetos; los ejes de la revisión final van con el modelo de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native (ver la línea `Ejecución`).
3. Las salidas de cada medida van en una fase propia de la carpeta de la spec: `perfil/` y `paralelo/` (`PHASE=perfil`, `PHASE=paralelo`), con su `subject.sh` versionado al lado; no son RED ni GREEN de una skill.
4. El caso sin `--setting-sources` se lanza a mano en el molde que deja `lib.sh` con `KEEP_MOLD=1`, con los mismos `--settings`, `--model haiku`, `--allowedTools "Bash(*)"` y `--output-format stream-json --verbose`, y su stream se guarda limpio con `extract.mjs tools` y `texts`.
5. La línea de `.err` de un puerto que no se para por ser de otro sujeto: `· compartidos con otro sujeto en curso, sin parar: <puertos>`, añadida a la línea de puertos que ya existe.
6. Coste: ~1,5 $ en sujetos y ~2,5 h. Riesgo alto: que el paralelo se reproduzca (desvío, spec decisión 6).
- Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: medir con sujetos reales el perfil, el hook y el paralelo del lanzador, y arreglar los dos fallos de puertos de `lib.sh`.

**Architecture**: dos campañas pequeñas con `run.sh` y `lib.sh` tal como están, y un cambio acotado a `subject_ports` y `stop_subject_ports`. Lo medido se escribe en `tech-stack.md`; `run.sh` cambia solo si la medida lo pide.

**Tech Stack**: Git Bash (`tests/headless/*.sh`), Node (`extract.mjs`, `deny-kill.mjs`), Pester 5 (`tests/HeadlessLauncher.Tests.ps1`).

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks sobre el mismo lanzador, dos de ellas son campañas que lanza y lee el hilo principal, un error de código lo caza el Pester de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el cuerpo de dos funciones de `lib.sh`, sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); un comentario dice el porqué que el código no muestra, en una línea, con su origen (ticket o feature) como en el resto de `lib.sh`.
- `lib.sh` sigue la forma de sus funciones: builtins de bash y `grep`/`awk`, sin dependencias nuevas.
- Tope de `tech-stack.md`: 19663 palabras (`tests/WordBudget.Tests.ps1`), medido 19477.

### De proceso

- Native: TDD del propio hilo; un commit por task al quedar limpia (`commit-milestones.md`); mensajes con tipo/scope en inglés y texto en castellano, cuerpo con la línea `Co-Authored-By`.
- Con una campaña en marcha, el hilo no commitea ni corre la base (`tech-stack.md`, task 0021).
- Techos de las campañas: `SUBJECT_CAP=8`, `COST_CAP=3`, comunes a las fases de `SPEC_DIR`.

## Review Focus

- Dos sujetos en curso nombran el mismo puerto y el primero acaba → no lo para, y el `.err` lo dice · Task 3, `no para un puerto que nombra otro sujeto en curso`.
- La marca de otro sujeto con PID muerto → su puerto cuenta como propio y se para · Task 3, `para un puerto de otro sujeto que ya no corre`.
- `PORT` o stream con `70000` junto a un puerto válido → el válido se comprueba, `70000` no sale · Task 3, `subject_ports descarta puertos fuera de rango`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el último en acabar evita seguir la cadena de procesos de Windows.
- [x] **YAGNI gate**: sin abstracciones nuevas.
- [x] **Brownfield gate**: `subject_ports` y la línea de `.err` mantienen su forma; solo se añaden.
- [x] **Constitution check**: Art. I no pide RED (sin texto de skill); Art. X en las restricciones.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20261026-120112-feature-0215-real-subject-measurements/perfil/subject.sh` — molde y sonda del perfil y del hook.
- `.docs/sdd/specs/20261026-120112-feature-0215-real-subject-measurements/paralelo/subject.sh` — molde con el patch 0013 y su pregunta.
- `.docs/sdd/specs/20261026-120112-feature-0215-real-subject-measurements/{perfil,paralelo}/out/` — salidas de `subject_save`.

**Modificar**:

- `tests/headless/lib.sh` — `subject_ports` (rango) y `stop_subject_ports` (puertos de otro sujeto en curso).
- `tests/HeadlessLauncher.Tests.ps1` — tres tests de la Task 3.
- `tests/headless/run.sh` — solo si la Task 1 mide que el `CLAUDE.md` global llega con `--setting-sources ""`.
- `.docs/sdd/tech-stack.md` — lo medido en las Tasks 1 y 2.
- `.docs/sdd/roadmap.md` — fila 0215 y las dos filas de deuda (lo hace el cierre).

**NO se tocan**:

- `tests/DispatchBrief.Tests.ps1` — ya no lee la caché de plugins (spec, decisión 1).

### 1.6 Dependencias

- Superpowers 7.0.0 de la caché: `SUPERPOWERS_DIR=$HOME/.claude/plugins/cache/superpowers-marketplace/superpowers/7.0.0`.
- Copia del kit: `git archive HEAD skills .claude-plugin` a una carpeta del scratchpad.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El paralelo se reproduce | baja | desvío y parada | spec, decisión 6 |
| Un sujeto contesta la sonda leyendo `~/.claude/CLAUDE.md` | media | medida inválida | la petición lo prohíbe; se mira `tools.txt` y se relanza |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Medida del perfil y del hook

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: no aplica (medida); si cambia `run.sh`, Native TDD del hilo en `tests/HeadlessLauncher.Tests.ps1`.
**Superficies**: tooling · docs
**Verificación**: los dos streams guardados y leídos; si cambia `run.sh`, `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI"` → `Tests Passed: <n>, Failed: 0`

**Interfaces**:
- Consume: `lib.sh` (`subject_init`, `subject_launch`, `subject_save`, `KEEP_MOLD`, `SUPERPOWERS_DIR`, `MODEL`); `run.sh` (`SPEC_DIR`, `PHASE`, `SUBJECT_CAP=8`, `COST_CAP=3`).
- Produce: la fila del perfil en `tech-stack.md`; si llega el `CLAUDE.md`, la línea de `run.sh` `CLAUDE_CONFIG_DIR efectivo: <ruta>` (ruta de `CLAUDE_CONFIG_DIR` o, sin ella, `$HOME/.claude`) como primera salida.

**Ficheros**: crear `perfil/subject.sh`; modificar `.docs/sdd/tech-stack.md` (y `tests/headless/run.sh` según el resultado).

- [ ] **Step 1: subject.sh** — `subject_init "$1" "$2" "$4" sdd-propose`; molde vacío con `g init -q -b main` y un `README.md` commiteado; `MODEL=haiku`, `MAX_TURNS=4`; petición literal: «No leas ningún fichero ni uses herramientas salvo la orden que te pido. 1) ¿Qué te piden tus instrucciones de usuario (CLAUDE.md global) para los mensajes de commit? Si no tienes instrucciones de usuario, responde NINGUNA. 2) Ejecuta con Bash `taskkill //IM sdd-0215-nonexistent.exe` y copia literal lo que te devuelva.»; `subject_save`.
- [ ] **Step 2: Con `--setting-sources ""`** — `run.sh` con `PHASE=perfil SCENARIOS=s SUPERPOWERS_DIR=<7.0.0> KEEP_MOLD=1`. Esperado medido: la respuesta 1 (NINGUNA o la regla «tipo/scope en inglés») y, en `tools.txt`, la denegación «Bloqueado por el entorno de pruebas» o su ausencia.
- [ ] **Step 3: Sin `--setting-sources`** — en el molde conservado, `claude -p` con los argumentos de `perfil/s-1.args` menos `--setting-sources ""` y `--plugin-dir`, `--model haiku --max-turns 4`; stream a `perfil/n-1.jsonl` del `RUNS_DIR`, limpio con `extract.mjs tools|texts` a `perfil/out/n-1.tools.txt` y `n-1.texts.txt`. Se borra el molde al acabar.
- [ ] **Step 4: Decidir run.sh** — si la respuesta 1 con `--setting-sources ""` nombra la regla de commits: test `run.sh imprime el CLAUDE_CONFIG_DIR efectivo` (`$run.Output | Should -Match 'CLAUDE_CONFIG_DIR efectivo: '` con `CLAUDE_CONFIG_DIR` en el entorno, y `\.claude` sin ella), en rojo, y la línea en `run.sh` tras cargar `lib.sh`. Si no la nombra: sin cambio.
- [ ] **Step 5: tech-stack.md** — completar la línea «Un sujeto de enrutado no lleva el `CLAUDE.md` del dev-lead» con lo medido en los dos casos (feature 0215) y añadir si el hook de `--settings` corre con y sin `--setting-sources ""`; dentro del tope.
- [ ] **Step 6: Commit de la task**.

### Task 2 — Dos sujetos en paralelo

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: no aplica (medida).
**Superficies**: tooling · docs
**Verificación**: `paralelo/out/*.texts.txt` de los 4 sujetos leídos; `run.sh` termina con `sujetos de la campaña: 4`.

**Interfaces**:
- Consume: `run.sh` con `MAX_PARALLEL=2`; `lib.sh`.
- Produce: la línea de `tech-stack.md` del paralelo; si se reproduce, la parada del desvío.

**Ficheros**: crear `paralelo/subject.sh`; modificar `.docs/sdd/tech-stack.md`.

- [ ] **Step 1: subject.sh** — `subject_init "$1" "$2" "$4" sdd-explore`; molde con `g init`, `put_kit_marker '"ids": {"mode": "sequence"}'`, `.docs/sdd/roadmap.md` mínimo y `.docs/sdd/specs/20260901-100000-patch-0013-<etiqueta>/patch.md` con un título que lleva la etiqueta del sujeto (`Patch 0013 — ajuste <etiqueta>`); commit; `MODEL=sonnet`; petición «¿Qué hay en el patch 0013 de este proyecto? Dime su título literal.»; `subject_save`.
- [ ] **Step 2: Dos tandas** — `run.sh` con `PHASE=paralelo SCENARIOS="a b" MAX_PARALLEL=2 SUBJECT=1`, y otra con `SUBJECT=2`. Esperado medido: cada sujeto cita el título con su propia etiqueta. Se reproduce si alguno dice que no hay patch 0013 o lee rutas del kit (`tools.txt`).
- [ ] **Step 3: Si se reproduce** — parar: desvío; `sdd-debugging` antes de tocar nada; la decisión vuelve al dev-lead.
- [ ] **Step 4: tech-stack.md** — una frase en la línea de `subject_launch`/`mold_is_repo`: 0 de 4 con `lib.sh` (o lo que salga), feature 0215.
- [ ] **Step 5: Commit de la task**.

### Task 3 — Puertos fuera de rango y compartidos

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: Native, TDD del hilo, en `tests/HeadlessLauncher.Tests.ps1`.
**Superficies**: tooling
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI"` → `Tests Passed: <n>, Failed: 0`

**Interfaces**:
- Consume: `subject_ports`, `stop_subject_ports`, las marcas de `run.sh` (`$RUNS_DIR/live/<fase>.<etiqueta>` y `$RUNS_DIR/dry/live/…`, con el PID de bash del sujeto) y los streams `$RUNS_DIR/<fase>/<etiqueta>.jsonl`.
- Produce: `subject_ports` sin puertos fuera de 1–65535; `other_subject_ports` (puertos de los streams de otros sujetos con marca viva, coma-separados); línea de `.err` `puertos del sujeto: <p> · escuchando al acabar: <l>[ · compartidos con otro sujeto en curso, sin parar: <c>]`.

**Ficheros**: modificar `tests/headless/lib.sh`, `tests/HeadlessLauncher.Tests.ps1`.

- [ ] **Step 1: Tests** —
  - `subject_ports descarta puertos fuera de rango`: stream con `localhost:70000` y `localhost:4567`, `PORT=99999` → `Should -Be '4567'`.
  - `no para un puerto que nombra otro sujeto en curso`: como `para al acabar lo que escucha en los puertos del sujeto`, y antes de `subject_launch` el `-Launch` crea `$RUNS_DIR/live/red.b-1` con el PID de un `sleep 60 &` y `$RUNS_DIR/red/b-1.jsonl` con `localhost:<port>` → el servidor sigue escuchando y `.err` casa `compartidos con otro sujeto en curso, sin parar: <port>`; `finally` para el servidor y el `sleep`.
  - `para un puerto de otro sujeto que ya no corre`: igual con la marca de un PID muerto → el servidor no escucha y `.err` casa `escuchando al acabar: <port>` sin «compartidos».
- [ ] **Step 2: Implementación** — `subject_ports`: filtro `awk '$1 >= 1 && $1 <= 65535'` antes del `sort -un`. `other_subject_ports`: recorre `"$RUNS_DIR"/live/*.*` y `"$RUNS_DIR"/dry/live/*.*`, salta la propia (`${PHASE:-red}.$LABEL`), con `kill -0` sobre su PID toma los puertos de `$RUNS_DIR/<fase>/<etiqueta>.jsonl` con la misma expresión. `stop_subject_ports`: pasa a `Get-NetTCPConnection` solo los propios menos los compartidos y añade el sufijo cuando hay compartidos.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,8h
- Estimación de implementación: 2,5h
- Base de la estimación: 3 tasks; dos campañas pequeñas con espera de sujetos y una función de bash con 3 tests; referencia la 0214 (4 tasks de `lib.sh`).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada decisión tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Decisión 1 (tests y vigilancia sin código) → cierre: la comprobación con `grep` va al walkthrough y salda la fila. ✓
- Decisiones 2-4 (sondas del perfil y del hook, con y sin `--setting-sources`) → Task 1, Steps 1-3. ✓
- Decisiones 5-6 (paralelo y parada si se reproduce) → Task 2, Steps 2-3. ✓
- Decisión 7 (rango) → Task 3, `subject_ports descarta puertos fuera de rango`. ✓
- Decisión 8 (último en acabar) → Task 3, los dos tests de puertos compartidos. ✓
- Decisión 9 (`run.sh` condicional) → Task 1, Step 4. ✓
- Decisión 10 (techos) → `SUBJECT_CAP=8`, `COST_CAP=3` en las dos campañas. ✓
- Filas de la tabla «Lo que se retira o cambia de forma» → Task 1, Step 5 (`tech-stack.md:221`); cierre (filas del roadmap). ✓
- Líneas del Review Focus → Task 3, sus tres tests. ✓
