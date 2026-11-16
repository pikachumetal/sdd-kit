---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261014-153448-feature-0181-upstream-watch
task: 0181
mode: full
date: 2026-10-14
---

# Ticket para el kit — feature 0181: una parada por memoria que llegó caduca y una revisión de fuentes que subió la versión vista sin leerlo todo

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, ejecución Native
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-rubber-duck` (modo corto), `sdd-start-feature`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-templates`, `add-to-changelog`, `sdd-end-feature`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript y tests en Pester), una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: revisor final opus con `sdd-kit:effort-high`, un despacho
- Coste en reloj: 1,15 h frente a 4,5 h estimadas, con 34 min de la parada por memoria dentro; ~0,5 h de spec y plan antes
- Coste en tokens: hilo 56.673.318 y subagentes 7.494.110 en 1 despacho; sesión 22,46 $

Fuente de la cabecera y del contexto: `.docs/sdd/sdd-kit.json` → `"version":"2.3.4"`; `installed_plugins.json` de Claude Code → `superpowers@superpowers-marketplace`, entrada del checkout del kit, `"version": "7.0.0"`; `mode: full` en el frontmatter de la spec; walkthrough de la 0181, §2 (tiempos y tokens de `sdd session tokens`).

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La parada por memoria agotada preguntó al dev-lead lo que el hilo podía esperar solo, y la pregunta llegó caduca

- **Qué pasó**: en la Task 1, `git commit --amend -F <mensaje>` en PowerShell falló con `fatal: Out of memory, malloc failed (tried to allocate 1048576 bytes)`. La herramienta Bash daba `EUNKNOWN: unknown error, uv_spawn`, y PowerShell, `Out of memory.` con salida 82. Un `testhost` de otro proyecto (PID 99012) ocupaba 33.947 MB: quedaban 1.245 MB libres de 65.440 y 444 MB de memoria virtual. Paré con una pregunta de tres opciones: «lo liberas tú», «lo mato yo» o «espera, ya acabará». Solo matar el proceso necesitaba al dev-lead. La respuesta llegó 34 min después: «en el task manage rme dice que la mem es 35gb libres?!??!». El `testhost` ya había terminado (35.660 MB libres) y el `--amend` pasó a la primera.
- **Fuente**: transcript de la sesión: salida del `--amend` a las 12:49:07 UTC; `Get-CimInstance Win32_OperatingSystem` y `Get-Process` a las 12:49:35 → `libre MB 1245 de 65440 · virtual libre MB 444` y `testhost 99012 33947`; la pregunta (`AskUserQuestion`) a las 12:49:53 y la respuesta a las 13:23:37; la medida de las 13:23:45 → `libre MB 35660 · virtual libre MB 30409 de 100256`; el `--amend` de las 13:23:49 → `exit 0`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Continuous execution» (línea 18), con los cuatro motivos de parada; `skills/sdd-start-feature/references/control-profiles.md`, «Vigía de silencio», que vigila comandos y subagentes, no un recurso de la máquina.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. De los cuatro motivos, solo matar un proceso ajeno es «an irreversible or destructive operation». Esperar es método, y en `delegate` lo decide el hilo: lo puse como opción de la pregunta en vez de hacerlo. Ninguna regla dice cómo esperar a un recurso de la máquina ni cuánto antes de parar.
- **Coste**: 34 min de hilo parado (12:49:53 → 13:23:37 UTC), que entran en el tiempo real de la feature (walkthrough de la 0181, §2). Cuánto de ese tiempo siguió ocupada la memoria: sin respaldo, no se midió entre las dos lecturas.
- **Propuesta**: en «Continuous execution», un recurso de la máquina que ocupa un proceso ajeno (memoria, disco, un puerto) no es motivo de parada. El hilo lanza en segundo plano una espera que vuelve a medir cada minuto y termina cuando el recurso se libera, con el tope de `control.silence.longCommandMinutes`. Solo para si agota el tope, y la pregunta lleva el valor y la hora de la última medida. Matar el proceso sigue siendo del dev-lead.
- **Verificada**: sin verificar (contrastado con `skills/sdd-implement/SKILL.md:18`).
- **Criterio de aceptación**: GIVEN una task en `delegate` y un `git` que falla con `Out of memory` porque un proceso ajeno ocupa la RAM, WHEN la memoria se libera a los 10 min, THEN el hilo sigue sin preguntar; y si a los 20 min sigue ocupada, para con una pregunta que dice cuánta memoria había libre y a qué hora se midió.

### 2. La revisión de Spec Kit dejó sin leer `templates/commands/`, que el plan nombraba, y subió la versión vista igualmente

- **Qué pasó**: el plan acotaba Spec Kit `v0.8.7..v1.2.0` a `CHANGELOG.md`, `spec-driven.md` y `templates/`. Leí el changelog, `spec-driven.md` y las plantillas de la raíz de `templates/`, pero no `templates/commands/`, que lleva 10 de los 15 ficheros del diff de `templates/` y 709 de sus 749 líneas añadidas. La fila de `/analyze` decía lo contrario de lo que hace la fuente: pasó a un subagente aparte y se revirtió. Aun así subí la vista a `v1.2.0`. La revisión final lo marcó en dos Important. En OpenSpec faltaba además la sección `## Workflow follow-up` del `schema.yaml`, un Minor que subí a Important. Con la vista ya subida, `kit:upstream` no habría vuelto a avisar de lo no leído.
- **Fuente**: `plan.md` de la 0181, línea 245 («Spec Kit `v0.8.7..v1.2.0`: `CHANGELOG.md`, `spec-driven.md` y `templates/`»); `git -C <clone de spec-kit> diff --stat v0.8.7..v1.2.0 -- templates/` → `15 files changed, 749 insertions(+), 277 deletions(-)`, y con `templates/commands/` → `10 files changed, 709 insertions(+), 254 deletions(-)`; `tasks.md` de la 0181, «Revisión final» (2 Important) y el ruling del Minor 9; walkthrough de la 0181, §3 y §5; `upstream-review.md` de la 0181, línea 85 (la fila de `/analyze`, con los commits `98ee02a9` y `c49966da` de la fuente).
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, Native loop, paso 3 («Completion contract»): sus puntos piden tests y líneas `Expected:`, y una task de lectura no tiene ninguno sobre los ficheros que cubrió. En el repo del kit, `.docs/sdd/tech-stack.md`, «Referencias de vigilancia» (línea 282), que desde el cierre lleva la regla «Solo con todo el ámbito leído sube la fila».
- **Por qué el kit no lo evitó**: la verificación de la Task 3 era `moon run kit:upstream`, que da verde en cuanto sube la vista, se haya leído lo que se haya leído. El ámbito estaba bien en el plan y no lo recorrí entero.
- **Coste**: tres hallazgos de la revisión final, arreglados en la pasada de fix del cierre (`tasks.md` de la 0181); el tiempo, sin respaldo.
- **Propuesta**: la revisión de una fuente abre con `git diff --stat <vista>..<última> -- <ámbito>`, y su tabla tiene una fila o una línea «sin pieza del kit» por cada fichero de esa lista. La task de revisión lleva ese contraste como `Expected:`. La regla va a «Referencias de vigilancia», junto a la del cierre.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN la revisión de Spec Kit `v0.8.7..v1.2.0` con ámbito `templates/`, WHEN se da por hecha, THEN cada uno de los 15 ficheros del `--stat` sale en su tabla o en «sin pieza del kit»; en esta sesión faltaban los 10 de `templates/commands/` hasta la revisión final.

### 3. Dos aprendizajes chocaron con el tope de palabras de su documento de anclaje

- **Qué pasó**: en la Task 2, `tech-stack.md` quedó en 18.711 palabras con el párrafo nuevo (tope 18.700) y lo condensé hasta 18.698. En el cierre, `architecture.md` estaba en su tope (1.900). `tests/upstream/` no entró en su estructura del repo, y el aprendizaje del `package.json` de módulo fue a un comentario de cabecera de `check.ts`. La línea de `architecture.md` quedó en la fila de deuda de los menores diferidos. Es el séptimo ticket que cita el tope en un hallazgo o un menor (antes, 0098, 0128, 0146, 0160, 0165 y 0166).
- **Fuente**: `tasks.md` de la 0181, ruling de la Task 2 (18.711 → 18.698, tope 18.700); walkthrough de la 0181, §5, primer aprendizaje; `tests/WordBudget.Tests.ps1:40-41` (`'architecture.md' = 1900`, `'tech-stack.md' = 18700`); fila «Menores diferidos de la feature 0181» del roadmap; `grep -n 'tope de palabras\|WordBudget' .docs/sdd/field-reports/*.md`.
- **Dónde en el kit**: `skills/sdd-end-feature/references/aprendizajes-skills.md`, que fija el destino de cada aprendizaje y no dice qué hacer con un destino en su tope; la constitution, Art. I (los topes solo suben por decisión del dev-lead escrita en la spec); `tests/WordBudget.Tests.ps1`.
- **Por qué el kit no lo evitó**: en el cierre, el destino y el tope están fijos y el dev-lead ya no decide. Solo quedan recortar otra cosa o llevar el aprendizaje a otro sitio, y lo segundo choca con el paso 4 de `sdd-end-feature` («nunca lo dejes solo en el walkthrough ni lo lleves a otro documento»).
- **Coste**: el recorte de `tech-stack.md` (sin respaldo) y una línea de `architecture.md` pendiente en la deuda.
- **Propuesta**: la pasada de coherencia de `sdd-propose` mira el margen de `WordBudget` de cada documento de anclaje que la feature va a tocar. Si alguno no tiene margen para lo que añade, la spec pide la decisión del tope en su aprobación.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una feature que añade la carpeta `tests/upstream/` y `architecture.md` sin margen, WHEN se aprueba la spec, THEN la spec lleva la decisión del dev-lead sobre el tope de `architecture.md` y el cierre escribe la línea; hoy acabó en una fila de deuda.

## Lo que hice por iniciativa propia

- El dev-lead pidió el inventario de procedencia; el método fue mío. `provenance-scan.mjs` compara las frases de 8 palabras de cada `.md` de `skills/` con los clones de las fuentes. Encontró una frase de `brainstorming` en `sdd-grilling` sin aviso. Funcionó: candidato a herramienta del kit para comprobar los avisos de cada fork.
- Fijé la versión de cada copia por identidad de blob con un tag (`writing-for-agents` en v1.3.1 y `writing-skills` en 7.0.0), no por fecha. Funcionó salvo en `sdd-grilling`, que es una reescritura y fue por fecha (ruling).
- Añadí `tests/upstream/package.json` con `"type": "module"` para que Node no escriba un aviso que ensucia la salida del check (ruling).

## Funcionó, no tocar

- Native con el ledger: tres tasks sin subagente por task, y un solo despacho, el del revisor final.
- La revisión final (opus, `sdd-kit:effort-high`, 9 min): cazó los huecos de la revisión de fuentes que el check habría callado para siempre (hallazgo 2).
- El RED real del check contra los clones: cuatro fuentes con versión nueva y, tras la revisión, `Fuentes al día: 6.`
- `sdd session tokens`, `sdd estimation log` y `sdd merge --push`, a la primera.
- Las paradas de `delegate`: solo la aprobación de la spec, con la enmienda del inventario, y la de la memoria (hallazgo 1).

## Menores

- Un `git commit -q -F "$ws\..\..\..\.git"` de más, al principio del comando del commit de la Task 1, creó el commit con el mensaje «gitdir: …», el contenido del fichero `.git` del worktree, y con el pre-commit en verde. Lo vio el `git log` siguiente y se corrigió con `--amend` (~1 min) — `skills/sdd-implement/SKILL.md`, Native loop, paso 4 («Close, in this order»): la comprobación mira que el commit exista, no su mensaje.
- La spec ponía la tabla de vigilancia en `tech-stack.md`, como decía la petición, sin contrastarla con la propuesta 0131 de la misma release, que convierte `tech-stack.md` en `operations.md` sin versiones. Lo vio el dev-lead en la parada de la spec — `skills/sdd-propose/SKILL.md`, «Coherence pass».
- La plantilla del plan pide citar el estimation-log en la base de la estimación, no aplicar su ratio a la cifra: el plan citó 0,45 y estimó 4,5 h; el real fue 1,15 h (ratio 0,26) — `skills/sdd-templates/templates/plan-template.md:177`.
- El tiempo real de la 0181 incluye los 34 min de la parada por memoria, y el método no dice si una espera de la respuesta del dev-lead cuenta — `skills/sdd-end-feature/references/estimation.md`, paso 2.
