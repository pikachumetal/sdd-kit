---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: config
id: 20261026-161948-feature-0223-kit-gate-minutes
task: 0223
mode:
date: 2026-10-26
---

# Ticket para el kit — feature 0223: el gate de cierre del kit corre solo lo afectado

## Contexto

- Carril y modo: config (fila 0223 del roadmap, carril dado en la petición), perfil `delegate`
- Skills del kit usadas: `using-sdd`, `sdd-propose` (§Config lane), `sdd-feedback`
- Proyecto: el propio repo del kit (Markdown + CLI TypeScript, moon, Pester y Vitest), un dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: no medido; el carril config no estima. Tres pasadas del gate: 758 s, 832 s y 100 s
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un gate con `--affected` dio verde sin correr una de sus tareas

- **Qué pasó**: el gate nuevo `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` salió con 0 en 758 s, pero solo corrió `kit:test-headless`: `Tasks: 3 completed, 3 skipped`. `kit:test` no corrió porque el proyecto raíz de moon (`kit`, en `.`) no tiene inputs por defecto, solo `.moon/*`, así que `--affected` la salta siempre. Lo vi al leer el resumen, no por el código de salida. Con `inputs: ['**/*']`, la pasada siguiente corrió `kit:test` y dio 2 rojos que la primera había escondido (tope de palabras de `tech-stack.md` y prefijo de cierre del roadmap).
- **Fuente**: `moon task kit:test` → `Inputs: - .moon/*.{yml,yaml,jsonc,json,pkl,hcl,toml}`; log del gate → `Tasks: 3 completed, 3 skipped`; commit `9ce9487a` (cuerpo, línea `Gate:`).
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` §Config lane, pasos 2–4 («Gate green → one commit…»); igual en `sdd-verify` para cualquier gate.
- **Por qué el kit no lo evitó**: el carril da el gate por verde con el código de salida. Ninguna regla pide comprobar que corrió cada tarea que nombra el gate, y un gate con filtro (`--affected`, caché) sale con 0 cuando salta tareas.
- **Coste**: una pasada de ~13 min que no probó lo que decía; respaldo: commit `9ce9487a`.
- **Propuesta**: la línea `Gate:` del commit nombra el resultado de cada tarea del gate (`corrió N/M` o `saltada`). Cuando el cambio toca la definición del gate, cada tarea saltada lleva su porqué, comprobado con la herramienta (`moon task <t>` → inputs), y la tarea cuya definición cambia tiene que correr.
- **Verificada**: sí — reproducido con `moon run kit:test --affected --base develop` en Git Bash sobre la rama, antes de declarar `inputs` (moon 2.6.0).
- **Criterio de aceptación**: GIVEN un gate con `--affected` en el que una tarea no tiene inputs que casen con el cambio, WHEN el carril config lo corre y sale con 0, THEN la línea `Gate:` del commit la nombra como `saltada` con su porqué, y no como verde.

### 2. Integré la base con `git merge` a mano en vez de `sdd merge --sync`, y el conflicto del roadmap se repitió

- **Qué pasó**: `node cli/bin/sdd.js merge --project-root <worktree> --push` paró con una sola línea, `merge: conflicto en .docs/sdd/roadmap.md.`: la 0220, ya fusionada, había editado la misma fila 0223. Lo integré con `git merge --no-edit origin/develop` y resolví con un script de Node. Mientras tanto, otra sesión publicó en `develop` las filas 0226–0228 justo debajo de la 0223, y el segundo `git merge` volvió a chocar en el mismo bloque. Lo resolví igual, y `sdd merge --push` fusionó a la tercera.
- **Fuente**: salida de `sdd merge` (una línea); `git diff MERGE_HEAD --stat -- .docs/sdd/roadmap.md` → `2 insertions(+), 2 deletions(-)` tras cada resolución; `.docs/sdd/tech-stack.md` («`sdd merge` y `sdd merge --sync` resuelven por dentro. Un merge o un rebase a mano fuera del cierre sigue con el de git»); `cli/src/merge/registries.ts:13` (`KEYED_REGISTRIES` incluye `.docs/sdd/roadmap.md`).
- **Dónde en el kit**: salida de conflicto de `sdd merge` (`cli/src/merge/exits.ts:5`) y `skills/sdd-propose/SKILL.md` §Config lane paso 5, que manda a `sdd merge` sin decir qué hacer si choca.
- **Por qué el kit no lo evitó**: la regla existía en `tech-stack.md` y no la apliqué. La salida del verbo no ofrecía `--sync`: la salida de `exits.ts:5` («Llevarlos a la rama de la feature: solo tocan registros») no salió, aunque el único fichero era un registro.
- **Coste**: ~10 min de resolución a mano en dos rondas; sin respaldo en commit, más allá de los dos merges `72cf0a00` y `a957f003`.
- **Propuesta**: con un conflicto que solo toca `KEYED_REGISTRIES`, `sdd merge` imprime la salida `sdd merge --sync` (o la aplica). El paso 5 del carril config nombra esa salida.
- **Verificada**: sin verificar (no reproduje por qué no salió la línea de `exits.ts`).
- **Criterio de aceptación**: GIVEN una rama y `develop` que editan la misma fila del roadmap, WHEN `sdd merge` choca solo en `.docs/sdd/roadmap.md`, THEN su salida nombra `sdd merge --sync` como siguiente paso.

### 3. El carril config no dice cómo se cierra la fila del roadmap que implementa

- **Qué pasó**: el carril config dice «No spec, plan, folder, id, roadmap row, changelog entry…», pero la 0223 ya tenía fila y saldaba una deuda. Cerré la fila a ✅ con una nota y puse prefijo de saldada a la deuda. Mi primer prefijo (`**[0223, …: saldada — gate de [enlace]]**`) dio aviso en `sdd roadmap check` y rojo en `tests/RoadmapClosing.Tests.ps1:60`: el formato solo admite `Feature|Task|Patch` y el enlace justo detrás de «—». Un cierre en carril config no tiene artefacto que enlazar; enlacé `tech-stack.md#testing`.
- **Fuente**: `node cli/bin/sdd.js roadmap check --path .docs/sdd` → `el prefijo de cierre no casa con «**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**»`; `tests/RoadmapClosing.Tests.ps1:4` (`ClosingPrefix`).
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` §Config lane (último párrafo).
- **Por qué el kit no lo evitó**: el carril supone que no hay fila; no prevé una fila que lanza `sdd-roadmap` con su id y su deuda.
- **Coste**: dos vueltas de `kit:test` (~100 s cada una) y una edición.
- **Propuesta**: si el cambio en carril config implementa una fila, el último párrafo dice que se cierra a ✅ con una línea de cierre, y que la deuda que salda lleva el prefijo `**[Feature <id>, <fecha>: saldada — [<doc cambiado>](<ruta>)]**`.
- **Verificada**: sí — contrastado con `skills/sdd-propose/SKILL.md` §Config lane y con el aviso de `sdd roadmap check`.
- **Criterio de aceptación**: GIVEN una fila del roadmap lanzada en carril config que salda una deuda, WHEN el agente cierra, THEN la fila queda ✅ y el prefijo de la deuda pasa `sdd roadmap check` sin aviso a la primera.

## Lo que hice por iniciativa propia

- Antes de cambiar el gate, probé el comportamiento de `--affected` con una tarea barata (`moon run cli:typecheck --affected --base develop`): salta sin cambios y sale con 0. Funcionó para decidir, pero no detectó el hueco de los inputs del proyecto raíz (hallazgo 1).
- Me aparté del punto (c) de la fila («un cambio que no toca `cli/` no corre la CLI»): mantuve los `testInputs` de `cli/moon.yml` (`skills/`, `capabilities/`) porque los tests de la CLI leen esos ficheros, y lo escribí en el cierre de la fila.

## Funcionó, no tocar

- El cerrojo de suites de `sdd lock run` detectó el cerrojo huérfano de otro worktree y siguió solo.
- `sdd merge --push` fusionó y publicó en una llamada una vez integrada la base.

## Menores

- `python3` no existe en el Git Bash de la máquina; reescribí la edición con la herramienta de edición — no localizado (entorno).
- `kit-feedback-template.md` solo prevé `lane: feature|patch`; este ticket es de carril config — `skills/sdd-templates/templates/kit-feedback-template.md`.
- Un `--query 'task=test'` que esperaba que filtrara el gate no filtró nada, y `kit:test-headless` corrió otra vez (~11 min) — no localizado (uso de moon).
