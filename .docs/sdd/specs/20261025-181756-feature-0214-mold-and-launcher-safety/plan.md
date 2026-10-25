---
id: 20261025-181756-feature-0214-mold-and-launcher-safety
feature: 0214
title: Plan de implementación — Molde y seguridad de tests/headless/lib.sh, extract.mjs y battery.mjs
spec: ./spec.md
status: approved
created: 2026-10-25
---

# Plan de implementación — Molde y seguridad de `tests/headless/lib.sh`, `extract.mjs` y `battery.mjs`

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las 4 tasks; los ejes de la revisión final van con el modelo de `sdd-verify` (Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: native (ver la línea `Ejecución`).
3. Cuatro tasks por pieza de la spec (hook y puertos · datos personales · volcado y molde · extractor y batería): cada una con su test en seco; los textos de `tech-stack.md` van en la task de su pieza, no en una task aparte.
4. El saldo de las filas del roadmap lo hace el cierre (`sdd-archive`), no una task.
5. Los tests que siembran transcripts fijan `CLAUDE_CONFIG_DIR` en `$TestDrive`: nunca escriben en el `~/.claude` real.
6. Coste: ~3 h de implementación, sin subagentes salvo los ejes de la revisión final; sin sujetos reales.
7. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: que `tests/headless/` dé por defecto las guardas que hoy cada campaña tiene que recordar, con su test en seco, y dejar limpias las salidas guardadas.

**Architecture**: todo en las piezas existentes de `tests/headless/` (`lib.sh`, `extract.mjs`, `battery.mjs`) más `deny-kill.mjs` copiado de la 0036; cada comportamiento con su caso en el Pester que ya cubre la pieza. Las guardas abortan con `die`, como las de hoy.

**Tech Stack**: bash (Git Bash), Node 22 (`extract.mjs`, `battery.mjs`, `deny-kill.mjs`), Pester 5 con `pwsh` 7.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 4 tasks tocan el mismo `lib.sh` y su Pester, encadenadas por pocas interfaces, un error lo caza el test en seco de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia tooling de pruebas dentro de `tests/headless/`, sin módulo, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Constitution Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); un comentario dice el porqué que el código no muestra, con el ticket o la task de origen como hacen los de `lib.sh`. Clean code.
- Bash compatible con Git Bash en Windows: rutas para programas nativos con `cygpath -m`; nada de `rm -rf` sin variable comprobada (`${var:?}`).
- Ningún test escribe fuera de `$TestDrive` ni en el `~/.claude` real; ningún test para procesos por nombre: por PID o por puerto.
- Mensajes literales de la spec:
  - `[<etiqueta>] SETTINGS sin el hook deny-kill.mjs: añade $DENY_KILL_HOOK a sus PreToolUse`
  - `la salida lleva el nombre o el email de git de la máquina: no se guarda` (stderr de `extract.mjs`, código 3, sin el valor)
  - `[<etiqueta>] … el stream sigue en <run>.jsonl`
  - `[<etiqueta>] la copia del kit lleva .docs/ o tests/: sácala con git archive <commit> skills .claude-plugin`
  - `!!! línea <n> del stream sin parsear (<caracteres> caracteres): <mensaje del error>`
  - `puertos del sujeto: <lista> · escuchando al acabar: <lista|ninguno>`

### De proceso

- Native: TDD del propio hilo; un commit por task al quedar limpia (`commit-milestones.md`); mensajes con tipo/scope en inglés y texto en castellano, cuerpo con la línea `Co-Authored-By`.
- Mensajes de commit con `git commit -F <fichero del scratchpad>` (el hook de comandos bloquea `/palabra`).

## Review Focus

- `SETTINGS` propio que ya trae otros `PreToolUse` además de `deny-kill.mjs` → se acepta (la guarda busca el nombre del hook, no la forma exacta del JSON) · Task 1, `acepta un SETTINGS propio que lleva el hook`.
- Nombre de git con tilde y consola no UTF-8 → `extract.mjs` lo encuentra igual y sale con 3 · Task 2, `extract.mjs falla con el user.name de la máquina aunque lleve tilde`.
- Línea sin parsear en el modo `last` (lo lee `subject_converse`) → se salta y devuelve el último `result` válido · Task 4, `extract.mjs last salta una línea sin parsear`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cada pieza va en la función que ya existe o en una nueva de pocas líneas en `lib.sh`; sin parser de JSON en bash.
- [x] **YAGNI gate**: sin opciones nuevas salvo `DENY_KILL_HOOK` (la necesita quien compone su `SETTINGS`).
- [x] **Brownfield gate**: las campañas cerradas no cambian; las vivas (`tests/batteries/*`) usan el `SETTINGS` por defecto, así que ganan el hook sin tocarlas.
- [x] **Constitution check**: Art. I (cada comportamiento con su test, en seco), Art. X (comentarios).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/headless/deny-kill.mjs` — copia literal del hook de la 0036.

**Modificar**:

- `tests/headless/lib.sh` — `DENY_KILL_HOOK`, `SETTINGS` por defecto con el hook y su guarda, `subject_ports`, parada por puerto y borrado de la siembra en `subject_cleanup`, `subject_show`, `seed_transcript`, guarda de `.docs/`/`tests/` en `subject_init`, `core.longpaths` en `g`, escritura atómica en `subject_save`/`subject_keep`, cabecera.
- `tests/headless/extract.mjs` — falla con nombre o email; líneas sin parsear.
- `tests/headless/battery.mjs` — `cualquiera`.
- `tests/HeadlessLauncher.Tests.ps1`, `tests/SubjectOutputPrivacy.Tests.ps1`, `tests/DenyKillHook.Tests.ps1`, `tests/Battery.Tests.ps1` — casos.
- `tests/batteries/sdd-implement/battery.md` — `t1b` a `cualquiera`.
- 8 salidas con fugas: `.docs/sdd/specs/20260923-070206-patch-0037-disparador-vago/campaign/out/{green-1/walkthrough.md,green-2/roadmap.md,green-2/walkthrough.md,green2-2/roadmap.md,green2-2/t2.txt,green2-2/walkthrough.md}` y `.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/green/out/{x4-1,x4-2}.tools.txt`.
- `.docs/sdd/tech-stack.md` — líneas 60, 95, 133, 162, 210 y 211.

**NO se tocan**:

- `.docs/sdd/specs/20260925-180248-feature-0036-closing-verification/green/` — campaña cerrada, conserva su lanzador.
- `tests/headless/run.sh` — es de la 0213.

### 1.6 Dependencias

Ninguna nueva. `Get-NetTCPConnection` (Windows) ya lo usa el `web.sh` de la 0036.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Ampliar la evidencia a toda subcarpeta saca rutas de usuario en carpetas que antes no se miraban | media | el `Slow` de privacidad en rojo | se ejecuta en la Task 2 antes de dar el cambio; lo que salga se limpia con `extract.mjs clean` en la misma task |
| La parada por puerto para un proceso ajeno que escucha en un puerto que el stream nombra | baja | un proceso del dev-lead parado | solo puertos del sujeto (`PORT` o del stream, 4-5 dígitos), como la 0036; el test usa un puerto libre aleatorio |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Hook por defecto y parada por puerto

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: Native, TDD del propio hilo · `tests/HeadlessLauncher.Tests.ps1`, `tests/DenyKillHook.Tests.ps1`
**Superficies**: tooling · docs
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1,tests/DenyKillHook.Tests.ps1 -CI"` → `Tests Passed: <n>, Failed: 0`

**Interfaces**:
- Consume: nada.
- Produce: `DENY_KILL_HOOK` (ruta Windows de `tests/headless/deny-kill.mjs`); `subject_ports` → stdout `4512,5173`.

**Ficheros**: crear `tests/headless/deny-kill.mjs`; modificar `tests/headless/lib.sh`, `tests/HeadlessLauncher.Tests.ps1`, `tests/DenyKillHook.Tests.ps1`, `.docs/sdd/tech-stack.md` (210, 211).

- [ ] **Step 1: Implementación**
  - `deny-kill.mjs`: `cp` del de la 0036; `DenyKillHook.Tests.ps1:2` apunta a `tests/headless/deny-kill.mjs`.
  - `lib.sh`: `DENY_KILL_HOOK="$(cygpath -m "$HEADLESS/deny-kill.mjs" 2>/dev/null || echo "$HEADLESS/deny-kill.mjs")"`. `SETTINGS` por defecto: `{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node \"<DENY_KILL_HOOK>\""}]}]}}`. En `subject_launch`, tras la guarda de `sdd-kit@sdd-kit`: `case "$settings" in *deny-kill.mjs*) ;; *) die "SETTINGS sin el hook deny-kill.mjs: añade \$DENY_KILL_HOOK a sus PreToolUse" ;; esac` (literal con `$DENY_KILL_HOOK` sin expandir).
  - `subject_ports()`: `PORT` si está definido más `grep -oE '(PORT=|localhost:)[0-9]{4,5}' "$JSONL"`, únicos, separados por comas; vacío si no hay ninguno o no existe `$JSONL`.
  - `subject_cleanup`: antes de borrar, si `subject_ports` no está vacío, `pwsh -NoProfile -Command` con `Get-NetTCPConnection -LocalPort <puertos> -State Listen` → lista que escuchaba, `Stop-Process -Id $_.OwningProcess -Force`; añade a `$RUNS/$LABEL.err` `puertos del sujeto: <lista> · escuchando al acabar: <lista|ninguno>`. Sin puertos, no llama a `pwsh`.
  - Tests (`HeadlessLauncher.Tests.ps1`, `Describe` del lanzador):
    - `el SETTINGS por defecto carga deny-kill.mjs` → `<etiqueta>.args` en `RUNS/red/` contiene `tests/headless/deny-kill.mjs`.
    - `aborta si SETTINGS no carga deny-kill.mjs` → con `SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false}}'`, `Output -Match 'SETTINGS sin el hook deny-kill.mjs'` y 0 sujetos.
    - `acepta un SETTINGS propio que lleva el hook` → `SETTINGS` con otro `PreToolUse` y el de `deny-kill.mjs`: 1 sujeto.
    - `para al acabar lo que escucha en los puertos del sujeto` → el `subject.sh` arranca con `Start-Process`/`node -e` un servidor en un `PORT` libre (`$PORT` exportado), `subject_launch`; al acabar, `Get-NetTCPConnection -LocalPort $port -State Listen` vacío y `<etiqueta>.err` con `escuchando al acabar: <port>`.
    - `subject_ports junta PORT y los puertos del stream` → JSONL con `localhost:4567` y `PORT=5173`, `PORT=4300`: `4300,4567,5173`.
  - `tech-stack.md:210-211`: el hook y `subject_ports` viven en `tests/headless/` y los carga `lib.sh` por defecto.
- [ ] **Step 2: Build** — no aplica (bash y node sin build).
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(headless): deny-kill.mjs por defecto y parada por puerto (0214)`.

### Task 2 — Nombre y email reales: fallo, evidencia ampliada y barrido

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: Native · `tests/SubjectOutputPrivacy.Tests.ps1`, `tests/HeadlessLauncher.Tests.ps1`
**Superficies**: tooling · docs
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1,tests/HeadlessLauncher.Tests.ps1 -CI"` → `Tests Passed: <n>, Failed: 0`

**Interfaces**:
- Consume: nada.
- Produce: `extract.mjs` sale con 3 si la salida lleva `user.name` o `user.email` de la máquina; `subject_save`/`subject_keep` no dejan ficheros si el extractor falla.

**Ficheros**: `tests/headless/extract.mjs`, `tests/headless/lib.sh`, `tests/SubjectOutputPrivacy.Tests.ps1`, `tests/HeadlessLauncher.Tests.ps1`, las 8 salidas, `.docs/sdd/tech-stack.md` (133).

- [ ] **Step 1: Implementación**
  - `extract.mjs`: lee `user.email` igual que `user.name` (mismo `machineEnv`); quita `replaceAll(gitUser, '<git-user>')`; acumula la salida y, antes de escribirla, si contiene alguno de los dos, `console.error('la salida lleva el nombre o el email de git de la máquina: no se guarda')` y `process.exit(3)`. Vale para `tools`, `texts` y `clean`.
  - `lib.sh`: `subject_save` y `subject_keep` escriben a `<destino>.tmp` y `mv` solo si el extractor sale con 0; si no, `rm -f` del temporal, `die "… el stream sigue en $JSONL"` (salida con error del sujeto).
  - `SubjectOutputPrivacy.Tests.ps1`:
    - El test de la línea 145 pasa a `extract.mjs clean falla con el user.name de la máquina, no con el del molde`: `$LASTEXITCODE | Should -Be 3`, stderr sin `Alice Liddell`; con solo `Fixture`, sale 0.
    - `extract.mjs falla con el user.email de la máquina` (global con `email = alice@example.org`).
    - `extract.mjs falla con el user.name de la máquina aunque lleve tilde` (`Àlice Liddell`).
    - `Select-EvidencePath` y el recorrido de `BeforeAll` (171-176): toda subcarpeta de `specs/<tarea>/`, no solo `red|green|refactor|battery|fix`; el test de la selección añade `"$spec/campaign/out/x.md"` como evidencia y deja `"$spec/spec.md"` fuera.
    - `ni el user.email de git de esta máquina`, como el del nombre; `-Because` de los dos: `el repo es público: no se guarda una salida con la identidad de la máquina`.
  - `HeadlessLauncher.Tests.ps1`: `subject_save no deja el estado si la salida lleva la identidad de la máquina` → global con `user.name` que el `subject.sh` escribe en su estado; `Output -Match 'el stream sigue en'` y sin `<etiqueta>.state.txt`.
  - Barrido: en las 8 salidas, nombre → `<git-user>`, email → `<git-email>`.
  - `tech-stack.md:133`: `extract.mjs` falla si la salida lleva el nombre o el email de git de la máquina.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — el comando de «Verificación»; antes del barrido, el test del nombre sobre la evidencia sale en rojo con las 6 de `campaign/` y el del email con las 2 de la 0077.
- [ ] **Step 4: Commit de la task** — `fix(headless): extract.mjs falla con la identidad de git de la máquina (0214)`.

### Task 3 — Volcado, siembra, copia del kit y rutas largas

**Tras**: Task 1 (mismo `subject_cleanup`)
**Modelo**: la sesión (Native).
**Tests RED**: Native · `tests/HeadlessLauncher.Tests.ps1`
**Superficies**: tooling · docs
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI"` → `Tests Passed: <n>, Failed: 0`

**Interfaces**:
- Consume: `subject_keep` (reglas de copia plana y `out_path`), `subject_cleanup`.
- Produce: `subject_show <rev>:<ruta> <copia plana>`; `seed_transcript <rama>` (stdin: `<fecha ISO> <user|assistant> <texto>` por línea).

**Ficheros**: `tests/headless/lib.sh`, `tests/HeadlessLauncher.Tests.ps1`, `.docs/sdd/tech-stack.md` (60, 95, 162).

- [ ] **Step 1: Implementación**
  - `g`: añade `-c core.longpaths=true`.
  - `subject_init`: tras comprobar la skill, `[ -e "$KIT/.docs" ] || [ -e "$KIT/tests" ]` → `die "la copia del kit lleva .docs/ o tests/: sácala con git archive <commit> skills .claude-plugin"`.
  - `subject_show()`: mismas guardas que `subject_keep` (copia plana, `out_path`); `MSYS2_ARG_CONV_EXCL='*' git -C "$(cygpath -m "$R" 2>/dev/null || echo "$R")" show "$1"`, limpio con `clean`, a `$OUT/$LABEL/$2`; si `git show` falla, aviso y `return 1`.
  - `seed_transcript()`: carpeta `${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects/<slug de cygpath -w "$R">`, con el slug de `remove_claude_folder`; escribe `seed-<n>.jsonl` (n = siguiente libre) con node: por línea, `{type, timestamp, gitBranch: <rama>, message}`; en `assistant`, `message: {model: "claude-sonnet-5", id: "seed-<k>", role: "assistant", content: [{type: "text", text}], usage: {input_tokens: 1, cache_read_input_tokens: 0, output_tokens: 1}}`; en `user`, `message: {role: "user", content: <texto>}`. Guarda la carpeta en `SEED_DIR`; `subject_cleanup` la borra siempre (`${SEED_DIR:?}`), también con `KEEP_MOLD=1`.
  - Cabecera de `lib.sh`: nombra `subject_show`, `seed_transcript`, `subject_ports` y `DENY_KILL_HOOK`.
  - Tests:
    - `aborta si la copia del kit lleva .docs/ o tests/` → `New-Item <kit>/.docs`; `Output -Match 'sácala con git archive'`, 0 sujetos; lo mismo con `tests/`.
    - `subject_show vuelca un fichero de otra rama` → el molde crea `feature/0013` con `.docs/sdd/roadmap.md`; `subject_show feature/0013:.docs/sdd/roadmap.md roadmap.md`; la copia existe y tiene el contenido.
    - `seed_transcript siembra en la carpeta del molde y la borra al acabar` → `CLAUDE_CONFIG_DIR` en `$TestDrive`, `KEEP_MOLD=1`; durante el sujeto (`subject_launch` con `DRY_RUN`, el `subject.sh` copia el `.jsonl` a la salida con `cp`) el fichero tiene `"gitBranch":"feature/0042"` y `"model":"claude-sonnet-5"`; al acabar, `projects/` sin la carpeta.
    - `g pasa core.longpaths` → `.args` no sirve: el `subject.sh` escribe `g config --get core.longpaths` en su estado → `true`.
  - `tech-stack.md`: 60 nombra `seed_transcript`; 95, la copia del kit de toda campaña sale con `git archive <commit> skills .claude-plugin` y `subject_init` lo comprueba; 162, `g` ya pasa `core.longpaths`.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(headless): subject_show, seed_transcript y guardas del molde (0214)`.

### Task 4 — Líneas sin parsear y «cualquiera»

**Tras**: Task 2 (mismo `extract.mjs`)
**Modelo**: la sesión (Native).
**Tests RED**: Native · `tests/SubjectOutputPrivacy.Tests.ps1`, `tests/Battery.Tests.ps1`
**Superficies**: tooling
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1,tests/Battery.Tests.ps1 -CI"` → `Tests Passed: <n>, Failed: 0`

**Interfaces**:
- Consume: el `extract.mjs` de la Task 2.
- Produce: nada.

**Ficheros**: `tests/headless/extract.mjs`, `tests/headless/battery.mjs`, `tests/SubjectOutputPrivacy.Tests.ps1`, `tests/Battery.Tests.ps1`, `tests/batteries/sdd-implement/battery.md`.

- [ ] **Step 1: Implementación**
  - `extract.mjs`: un `parse(line, n)` que devuelve el evento o `null`; en `tools` y `texts`, con `null` escribe `!!! línea <n> del stream sin parsear (<line.length> caracteres): <error.message>` y sigue; en `last`, filtra los `null`.
  - `battery.mjs` `judge`: `passed` cuenta todo sujeto terminado si `row.Esperado === 'cualquiera'`.
  - `battery.md` de `sdd-implement`, fila `t1b`: `ninguna` → `cualquiera`.
  - Tests:
    - `extract.mjs tools salta una línea sin parsear y sigue` → stream con una línea válida, `{"type":"assistant","message":{"content":[{"type":"text","text":"a"` cortada y otra válida: sale 0, `-Match '!!! línea 2 del stream sin parsear'` y las dos válidas extraídas.
    - `extract.mjs texts salta una línea sin parsear y sigue` → igual con `texts`.
    - `extract.mjs last salta una línea sin parsear` → `result` válido, línea rota al final: devuelve el texto del `result`.
    - `Battery.Tests.ps1`: fila `a1` con `cualquiera`, n=2, umbral 2/2, dos sujetos terminados que cargan skills distintas → `a1 · 2/2 · umbral 2/2 · verde`; con uno sin `=== RESULTADO` → `rojo · faltan 1`.
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(headless): extract.mjs tolera líneas sin parsear y battery.mjs admite cualquiera (0214)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 3 h
- Base de la estimación: 4 tasks pequeñas en bash/node con Pester en seco; la incertidumbre es la parada por puerto (procesos reales en Windows) y lo que saque la evidencia ampliada.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, una vez y al cerrar (patch 0183).
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada decisión tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

La spec no tiene delta (capacidades: ninguna); se cubren sus decisiones.

- Dec. 1 (copia de `deny-kill.mjs`, la 0036 intacta) → Task 1, `DenyKillHook.Tests.ps1` en la ruta nueva. ✓
- Dec. 2 (`SETTINGS` sin hook aborta; `DENY_KILL_HOOK`) → Task 1, `aborta si SETTINGS no carga deny-kill.mjs`, `el SETTINGS por defecto carga deny-kill.mjs`. ✓
- Dec. 3 (`subject_ports` y parada por puerto, línea en `.err`) → Task 1, `subject_ports junta…`, `para al acabar…`. ✓
- Dec. 4 (código 3, sin el valor, sin `<git-user>`) → Task 2, tests de nombre, email y tilde. ✓
- Dec. 5 (escritura atómica) → Task 2, `subject_save no deja el estado…`. ✓
- Dec. 6 (evidencia en toda subcarpeta, email) → Task 2, test de selección y `ni el user.email…`. ✓
- Dec. 7 (barrido) → Task 2, los `Slow` de evidencia en verde tras el barrido. ✓
- Dec. 8 (`subject_show`) → Task 3, `subject_show vuelca…`. ✓
- Dec. 9 (`seed_transcript`, borrado con `KEEP_MOLD=1`) → Task 3, `seed_transcript siembra…`. ✓
- Dec. 10 (copia del kit) → Task 3, `aborta si la copia del kit…`. ✓
- Dec. 11 (`core.longpaths`) → Task 3, `g pasa core.longpaths`. ✓
- Dec. 12 (líneas sin parsear) → Task 4, tres tests. ✓
- Dec. 13 (`cualquiera`, `t1b`) → Task 4, `Battery.Tests.ps1`. ✓
- Dec. 14 y tabla «Lo que se retira o cambia de forma» (`tech-stack.md` 60, 95, 133, 162, 210, 211; `SubjectOutputPrivacy` 23-25, 145-152, 171-176, 206; `DenyKillHook:2`; `battery.md:43`; cabecera de `lib.sh`) → Tasks 1-4, en sus ficheros; la revisión final Spec lo contrasta. ✓
- Review Focus → Task 1 (`acepta un SETTINGS propio…`), Task 2 (tilde), Task 4 (`last`). ✓
