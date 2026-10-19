---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261019-080136-feature-0185-propose-fixes
task: 0185
mode: full
date: 2026-10-19
---

# Ticket para el kit — feature 0185: diez arreglos de `sdd-propose` y de las plantillas de spec y plan

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, Native
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-grilling` (secciones), `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents` (leída de la rama), `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code: skills en Markdown y CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: ejes Spec y re-revisión en Opus, eje Código en Sonnet; 38 sujetos de batería en Sonnet (y `mp1` en Opus)
- Coste en reloj: 13,98 h medidas frente a 4 h estimadas de implementación; incluye la noche de una caída de luz (hallazgo 4)
- Coste en tokens: hilo 83.381.270; subagentes 6.063.070 en 3 despachos; sesión 35,20 $; sujetos 23,64 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La spec puso dos reglas fuera del sitio donde el sujeto decide, aunque el stack del kit ya decía dónde van

- **Qué pasó**: la decisión 5 de la spec puso «la política de modelos aprobada es la confirmación de paralelizar» en `sdd-parallel-agents`, que se carga después de decidir parar: GREEN `mp1` 0/2, y hubo que enmendar la spec para llevarla a «The axes» de `sdd-verify` (3/3). La regla de la tabla de topes fue primero una frase en el «Coherence pass»: `sp1` 0/2 dos veces, hasta pasarla a la ayuda del hueco de la plantilla (2/2).
- **Fuente**: `tests/sdd-propose-0185-green.md` (Task 1 y Task 2); `spec.md` de la 0185, «Enmiendas» (2026-10-18, primera); `.docs/sdd/tech-stack.md`, «Una regla que solo vive en una referencia no se lee» y «Una regla de forma que sale en un mensaje que otra skill estructura va dentro de ese mensaje»
- **Dónde en el kit**: `skills/sdd-propose/references/spec-writing.md` (no tiene paso que pregunte dónde vive cada regla nueva); en este repo, `tech-stack.md` ya lo decía
- **Por qué el kit no lo evitó**: la regla existía en `tech-stack.md` y no la apliqué al diseñar: elegí el fichero por su tope de palabras (`sdd-verify` estaba en 2.885 de 2.900), no por el paso que decide
- **Coste**: 6 sujetos de más (~5 $), una enmienda y una parada del dev-lead (walkthrough de la 0185, §3)
- **Propuesta**: en la spec de un kit de skills, cada decisión que pone una regla nueva nombra el paso donde el agente toma la decisión que la regla cambia, y la regla va ahí; si el tope no da, se sube el tope, no se cambia de sitio la regla
- **Verificada**: sí — medido con `mp1` y `sp1` (`tests/sdd-propose-0185-green.md`)
- **Criterio de aceptación**: GIVEN una spec del kit que añade una regla que quita una parada · WHEN el sujeto escribe la decisión · THEN nombra la skill y el paso donde el agente decide parar, y no otra skill que se carga después

### 2. Un THEN sobre la salida de una herramienta se escribió sin ejecutarla

- **Qué pasó**: el THEN «la Verificación es un comando cuya última línea es el resumen» no se cumple con `node --test`: con los reporters `spec` y `tap` acaba en `ℹ duration_ms` / `# duration_ms`, y con `dot` en un punto. `pl2` salió 0/2 en esa fila y hubo que enmendar la spec.
- **Fuente**: `node --test a.test.mjs 2>&1 | tail -3` en Git Bash → `ℹ duration_ms 239.7102`; `spec.md` de la 0185, «Enmiendas» (segunda)
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 4, «Coherence pass»
- **Por qué el kit no lo evitó**: el repaso comprueba literales contra la spec, no contra la herramienta que los produce
- **Coste**: una enmienda, una parada del dev-lead y 2 sujetos (~0,9 $)
- **Propuesta**: en el repaso de coherencia, un THEN que fija la salida literal de un comando o una herramienta se ejecuta una vez, y la salida real va a ✋
- **Verificada**: sí — reproducido con el comando de «Fuente»
- **Criterio de aceptación**: GIVEN una spec con un THEN «`<comando>` acaba en `<línea>`» · WHEN el agente hace el repaso · THEN `tools.txt` lleva la ejecución de `<comando>` antes del gate

### 3. El merge de sincronización paró por dos requisitos añadidos al final de la misma capacidad

- **Qué pasó**: al integrar `develop` en el cierre, la rama y otra feature añadían cada una un requisito al final de `capabilities/routing.md`; git dio `CONFLICT (content): Merge conflict in .docs/sdd/capabilities/routing.md`. La receta solo resuelve los tres registros, así que abortó y paró a preguntar. La resolución fue dejar los dos.
- **Fuente**: `git merge --no-edit origin/develop` en Git Bash; `skills/sdd-archive/references/merge-recipe.md:11-12`
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md`, paso 6, y `references/merge-recipe.md`
- **Por qué el kit no lo evitó**: la receta trata como conflicto de una persona cualquier fichero fuera de los registros, también un add/add de dos requisitos nuevos en una capacidad
- **Coste**: una parada del dev-lead, ~5 min (sin respaldo)
- **Propuesta**: tratar `capabilities/*.md` como los registros cuando los dos lados solo añaden requisitos enteros (`### ...` con sus líneas): se quedan los dos, en el orden de la base; `resolveAddOnlyConflicts` de `cli/src/merge/` ya resuelve add-only en los registros
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN dos ramas que añaden cada una un requisito distinto al final de `capabilities/routing.md` · WHEN el cierre integra la base · THEN la capacidad queda con los dos y `capability check` pasa, sin parar

### 4. `sdd session tokens` cuenta una noche sin actividad como esfuerzo

- **Qué pasó**: la sesión se cortó por una caída de luz con la Task 1 a medias y se retomó al día siguiente. `Esfuerzo real: 13,98 h — reloj de la sesión 16,94 h desde 2026-10-17T22:03Z, sin 178 min de espera al dev-lead (8 esperas)`: la noche sin eventos cuenta como trabajo, y el estimation-log de la 0185 sale con +250 %.
- **Fuente**: `node cli/bin/sdd.js session tokens --path <worktree> --branch feature/0185-propose-fixes`; walkthrough de la 0185, §2
- **Dónde en el kit**: `cli/src/` del verbo `session tokens` (capacidad `estimation`)
- **Por qué el kit no lo evitó**: solo descuenta las esperas al dev-lead, no un hueco sin ningún evento del transcript
- **Coste**: una fila del estimation-log que descalibra el factor (walkthrough de la 0185, §2)
- **Propuesta**: descontar los huecos entre eventos de más de N min (p. ej. 60) sin herramienta en curso, y decirlo en la línea («sin 9 h sin actividad»)
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un transcript con un hueco de 8 h sin eventos entre dos turnos · WHEN `sdd session tokens` · THEN `Esfuerzo real` no cuenta esas 8 h y la línea lo dice

## Lo que hice por iniciativa propia

- `tests/headless/lib.sh` gana `APPEND_SYSTEM` (`--append-system-prompt`): con `--setting-sources ""` el sujeto no lee un `CLAUDE.md` del molde, y la instrucción de campo de `mp1` era del usuario. Funcionó: el RED reprodujo la parada 1/1.
- Repetí un control rojo (`l1`) con el kit de la base para saber si lo causaba la rama: salió igual, y fue a la deuda en vez de a la pasada de fix.
- Para caber en el tope de `tech-stack.md` quité dos entradas que ya vivían en otro sitio (una frase repetida de «Fixtures» y una regla que ya es comentario de `subject.sh`), en vez de recortar aprendizajes.

## Funcionó, no tocar

- La recuperación tras la caída: ledger, `git log` y el árbol bastaron para retomar la Task 1 en su GREEN sin rehacer nada.
- `capability merge` sobre una copia antes de cerrar cazó un hueco de plantilla citado en el delta (`<búsqueda>`) que habría ido a la capacidad viva.
- La regla 1 del `CLAUDE.md` del repo: con `sdd-parallel-agents` ausente de la caché de la sesión, leer el `SKILL.md` de la rama bastó.
- El diseño por secciones en llano, en la propia 0185: tres «sí» sin repreguntas.

## Menores

- Escribí `tasks.md` tarde (en la pasada de fix), con un plan de 5 tasks — `skills/sdd-implement/SKILL.md`, Setup, paso 4.
- Un `sed` en Git Bash rompió los escapes de un `.mjs` del workspace, como ya avisa `tech-stack.md` para Python — no localizado en una skill.
- Dos `**Tras**: —` del plan eran `Tras: Task 1` (comparten `tests/ProposeFixes.Tests.ps1`) — `skills/sdd-propose/references/plan-writing.md`.
