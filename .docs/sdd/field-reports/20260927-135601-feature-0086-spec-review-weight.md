---
kit_version: 1.1.0
superpowers_version: 6.4.2
lane: feature
id: 20260927-135601-feature-0086-spec-review-weight
task: 0086
mode: lite
date: 2026-09-27
---

# Ticket para el kit — feature 0086: un molde sin `git init` escribió en un repo ajeno, y en lite la revisión final llegó en el cierre

## Contexto

- Carril y modo: feature lite, perfil `delegate`, spec aprobada por delegación en la primera pregunta
- Skills del kit usadas: `sdd-start-feature` (pasos 1, 2, 4, 6 y 7), `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`; de superpowers, `brainstorming` y las plantillas `code-reviewer.md` y `re-review-prompt.md`
- Proyecto: el propio kit (skills en Markdown, scripts PowerShell, sujetos headless); una persona, con otras dos features del kit en paralelo en otros worktrees
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisor final `sdd-kit:effort-high` + opus; re-revisión `sdd-kit:effort-medium` + sonnet; 13 sujetos Sonnet
- Coste en reloj: ~1,5 h
- Coste en tokens: hilo 29,4 M, subagentes 2,4 M; sesión 11,74 $ y sujetos 9,65 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un `subject.sh` sin `git init` hace que `g` escriba en el repo que contiene el scratchpad

- **Qué pasó**: el `subject.sh` de la campaña usó `put`, `commit` y `g checkout -b` de `lib.sh` sin `git init` en el molde. En esta máquina `%TEMP%` está dentro de un repo git vacío, así que el ensayo en seco (`DRY_RUN=1`) cambió el HEAD de ese repo (`feature/0011`, luego `feature/0009`), le dejó un `index` y 377 objetos sueltos y un sujeto se quedó haciendo `git add -A` sobre todo `%TEMP%`. Ningún error lo avisó: solo 1,9 MB de «index.lock: File exists» en la salida del ensayo. Se paró por PID y se restauró el repo con permiso del dev-lead.
- **Dónde en el kit**: `tests/headless/lib.sh` (`g`, `commit`, `subject_launch`); `tech-stack.md` ya avisa de que `%TEMP%` puede estar en un repo (task 0059), pero para los tests «sin git», no para el lanzador.
- **Por qué el kit no lo evitó**: `lib.sh` delega el `git init` en cada `subject.sh`, y el `DRY_RUN` no comprueba que el molde sea su propio repo: el modo en seco ejecuta el molde de verdad.
- **Coste**: ~10 min, una parada del dev-lead y escrituras en un repo que no es de la campaña.
- **Propuesta**: `subject_launch` (o un `subject_repo` que llame el `subject.sh` antes del primer `g`) aborta si `git -C "$R" rev-parse --show-toplevel` no es `$R`, con su caso en `HeadlessLauncher.Tests.ps1`. Fila de deuda en el roadmap.
- **Criterio de aceptación**: GIVEN un `subject.sh` que llama a `commit` sin `git init`, con el scratchpad dentro de un repo git, WHEN se lanza con `DRY_RUN=1`, THEN el sujeto aborta con un mensaje que nombra el molde y el repo padre queda sin cambios.

### 2. En lite, nada dice cuándo se despacha el revisor final

- **Qué pasó**: la implementación terminó (skills editadas, GREEN y REFACTOR) y pasé directamente a `sdd-end-feature`. El revisor final lo despaché en el paso 9 del cierre, al comprobar que no lo había, con la rama ya commiteada. Devolvió tres Important, uno de ellos un THEN de la spec aprobada sin condicionar: hubo una enmienda, un desvío que paró al dev-lead y una re-revisión, todo dentro del cierre.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 6 («En modo lite, sin plan: … con `auto`, Native») y paso 7 («con la implementación terminada y la revisión final limpia»); `sdd-end-feature` paso 9.
- **Por qué el kit no lo evitó**: el paso 6 nombra el revisor final de Native dentro del párrafo del primer despacho («el revisor final en Native»), pero en lite no hay tasks ni `executing-plans` que lo lancen al terminar, y el paso 7 solo lo presupone. El paso 9 del cierre lo recupera, tarde.
- **Coste**: la enmienda y su pregunta al dev-lead llegaron en el cierre en vez de antes de la validación; ~1,6 $ de revisores que habrían sido los mismos, pero con el orden invertido.
- **Propuesta**: en el paso 6, una frase para lite: «sin plan, al terminar la implementación despacha el revisor final con [encargo-revision.md](references/encargo-revision.md) antes del paso 7».
- **Criterio de aceptación**: GIVEN una feature lite con la implementación terminada, WHEN el agente va a presentar la validación o a cerrar, THEN ya despachó el revisor final y el paso 7 muestra su veredicto; hoy, en esta sesión, 0/1.

### 3. El techo de coste del lanzador se mira antes de cada sujeto, no con lo que va a costar

- **Qué pasó**: con `COST_CAP=9` y 7,36 $ gastados, `run.sh` lanzó la tanda de REFACTOR (2 sujetos), que acabó en 9,65 $.
- **Dónde en el kit**: `tests/headless/run.sh` (`spent` frente a `COST_CAP` antes de cada `bash "$SUBJECT_SH"`).
- **Por qué el kit no lo evitó**: el techo cuenta los sujetos terminados; los que se lanzan en paralelo en la misma llamada no suman hasta acabar.
- **Coste**: 0,65 $ por encima de un techo que la spec aprobada fijaba.
- **Propuesta**: `run.sh` acepta `SUBJECT_COST` (estimado por sujeto) y no lanza si `spent + (lanzados sin terminar + 1) × SUBJECT_COST` pasa del techo.
- **Criterio de aceptación**: GIVEN `COST_CAP=9`, 7,36 $ gastados y `SUBJECT_COST=1` WHEN `run.sh` va a lanzar dos sujetos THEN lanza uno y dice «techo de 9 $ alcanzado con los previstos».

### 4. Los sujetos copian el nombre del dev-lead del contexto de la sesión a sus artefactos

- **Qué pasó**: tres sujetos que registraban una aprobación por delegación escribieron el nombre del dev-lead en su `spec.md` (frontmatter y Aprobaciones). `extract.mjs` no lo sustituyó; lo cazó `SubjectOutputPrivacy.Tests.ps1` en la suite completa, y se sustituyó a mano por `<git-user>`.
- **Dónde en el kit**: `tests/headless/extract.mjs` (limpieza de `<home>`, `<user>` y `<run>`); `lib.sh` fija `user.name` de git, pero el nombre llega al sujeto por el contexto que inyecta el harness.
- **Por qué el kit no lo evitó**: la limpieza cubre rutas y el usuario de la ruta del home, no el `user.name` de git de la máquina.
- **Coste**: una pasada extra de la suite y una sustitución a mano que, por ir con `Replace` sobre la carpeta entera, también cambió el aprobador de la spec real (se deshizo).
- **Propuesta**: `extract.mjs clean` sustituye además `git config user.name` de la máquina por `<git-user>`, y `subject_keep` pasa por esa limpieza.
- **Criterio de aceptación**: GIVEN un sujeto cuyo `spec.md` lleva el `user.name` de la máquina WHEN `subject_keep` lo copia THEN la copia dice `<git-user>` y `SubjectOutputPrivacy.Tests.ps1` pasa sin retoques.

### 5. La copia limpia del kit para los sujetos no lleva `agents/`

- **Qué pasó**: el RED se lanzó con `git archive HEAD skills .claude-plugin`, como dice `tech-stack.md` («solo `skills/` y `.claude-plugin/`»). Los sujetos p dijeron que `sdd-kit:effort-medium` no estaba en la sesión y planearon la frase de respaldo. El GREEN se lanzó con `agents/` y desapareció.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Sujetos headless» (`--plugin-dir` apunta a una copia con solo `skills/` y `.claude-plugin/`), y `lib.sh` (`subject_init` solo comprueba `skills/<skill>/SKILL.md`).
- **Por qué el kit no lo evitó**: la regla es anterior a los tipos `effort-*` (task 0031).
- **Coste**: ruido en el RED; no cambió lo medido, porque los sujetos pararon antes de despachar.
- **Propuesta**: la línea de `tech-stack.md` dice `skills/`, `.claude-plugin/` y `agents/`, y `subject_init` avisa si falta `agents/`.
- **Criterio de aceptación**: GIVEN una copia del kit sin `agents/` WHEN `subject_init` la recibe THEN avisa «sin agents/: los despachos no tendrán effort».

### 6. `Measure-SessionTokens.ps1` no encuentra los transcripts con `CLAUDE_CONFIG_DIR`

- **Qué pasó**: con la configuración de Claude Code en `~/.claude-gco`, el script dio «no medido» en las tres líneas; con `-ProjectsRoot ~/.claude-gco/projects`, midió.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Measure-SessionTokens.ps1` (`$ProjectsRoot = Join-Path $HOME '.claude/projects'`) y `skills/sdd-end-feature/SKILL.md` paso 2.
- **Por qué el kit no lo evitó**: el default no mira `$env:CLAUDE_CONFIG_DIR`.
- **Coste**: bajo aquí; en otra sesión, un walkthrough con «no medido» cuando sí había transcripts.
- **Propuesta**: el default sale de `$env:CLAUDE_CONFIG_DIR/projects` si la variable existe. Fila de deuda en el roadmap.
- **Criterio de aceptación**: GIVEN `CLAUDE_CONFIG_DIR` apuntando a una carpeta con `projects/<worktree>` WHEN el cierre ejecuta el script sin `-ProjectsRoot` THEN pega las tres líneas con cifras.

## Lo que hice por iniciativa propia

- Apliqué la pieza (3) de la feature a su propia spec antes de escribirla: `grep` de los literales que cambian en `skills/` y `tests/`, y la decisión 6 lista lo que queda fuera y por qué. Funcionó: el revisor final lo citó como fortaleza.
- RED por lectura con fichero y línea para el frente estructural (la rúbrica sin tamaño), y sujetos solo para las dos conductas: 4 sujetos en vez de 6.
- Tras el GREEN, conté la conducta vecina (abrir la rúbrica) aunque no era un frente, y eso destapó que la guía nueva la había bajado. Es el control del Art. I; lo hice sin que el paso lo pidiera.
- Re-revisión acotada del commit de arreglos de la revisión final, con Sonnet: la regla está en la fila 0032, aún sin fusionar.
- Antes de restaurar el repo ajeno, comprobé que las campañas de las otras dos features no escribían en él (sus `subject.sh` sí hacen `git init`).

## Funcionó, no tocar

- La opción «apruebo la spec por delegación» en la primera pregunta: el dev-lead la eligió y la spec no paró.
- La regla del disparador vago de la validación diferida: «validación diferida al uso» se concretó sin repreguntar.
- La cabecera de `encargo-revision.md` con el Art. X literal: el revisor final marcó como Important dos comentarios que citaban tasks en el molde.
- La frase «Invoca la skill sdd-kit:sdd-start-feature…» en la petición de los sujetos: 13 de 13 cargaron la skill.

## Errores míos, no huecos del kit

- Pasé el mensaje de commit con `git commit -F -` y un here-string en PowerShell; git lo tomó como ruta.
- La sustitución del nombre en las salidas la hice sobre la carpeta entera de la spec y cambió también el aprobador de la spec real; lo deshice.
- Conté mal la fila de control del GREEN (5/7 en vez de 3/7) y copié la cifra a la skill; lo cazó la revisión final.
